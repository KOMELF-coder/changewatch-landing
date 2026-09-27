// Local integration test. All external collection, Formspree and Turnstile are intercepted.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict'), http=require('node:http'), fs=require('node:fs'), path=require('node:path');
const root=path.resolve(__dirname,'..'), origin='http://127.0.0.1:8810';
const GA='G-RB6NSRRM9L', ADS='AW-18472426652', real=process.env.CW_REAL_GA==='1';
const server=http.createServer((req,res)=>{
 let file=path.join(root,new URL(req.url,origin).pathname);
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
const stub=`function record(c){if(window['ga-disable-${GA}'])return;if(c[0]==='config'){document.cookie='_ga=mock;path=/';document.cookie='_gcl_au=mock;path=/';}if(c[0]==='event')fetch('https://www.google-analytics.com/g/collect?'+new URLSearchParams({en:c[1],params:JSON.stringify(c[2])}),{method:'POST'});}dataLayer.forEach(record);dataLayer.push=(...cs)=>{cs.forEach(record);return Array.prototype.push.apply(dataLayer,cs)};`;
const LABEL='fb09CMW964MdEJy5q-hE', SEND_TO=ADS+'/'+LABEL;
const denied={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
const granted=Object.fromEntries(Object.keys(denied).map(k=>[k,'granted']));
(async()=>{
 await new Promise(r=>server.listen(8810,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
 for(const lang of ['fr','en']) {
  const context=await browser.newContext(), external=[],errors=[];let formStatus=422,forms=0;
  await context.route('**/*',async route=>{
   const req=route.request(),u=new URL(req.url());
   if(u.origin===origin)return route.continue();
   if(u.hostname==='challenges.cloudflare.com')return route.fulfill({contentType:'text/javascript',body:`const w=document.querySelector('.cf-turnstile');if(w){const i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';w.append(i);}window.turnstile={reset(){document.querySelector('[name=cf-turnstile-response]').value=''}};`});
   if(u.hostname==='formspree.io'){forms++;if(formStatus===0)return route.abort('failed');return route.fulfill({status:formStatus,contentType:'application/json',body:formStatus===200?'{}':'{"errors":[{"message":"Simulated failure"}]}'});}
   external.push({url:req.url(),body:req.postData()||''});
   if(u.hostname==='www.googletagmanager.com'&&u.pathname==='/gtag/js'){
    if(real){const response=await route.fetch();assert.equal(response.status(),200);return route.fulfill({response});}
    return route.fulfill({contentType:'text/javascript',body:stub});
   }
   return route.fulfill({status:204,headers:{'access-control-allow-origin':'*'}});
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const home=origin+(lang==='en'?'/en/':'/');
  await page.goto(home+'?email=PRIVATE_EMAIL#PRIVATE_HASH');await page.waitForTimeout(300);assert.equal(external.length,0);
  await page.locator('.cookie-banner [data-consent=reject]').click();await page.reload();await page.waitForTimeout(200);assert.equal(external.length,0);
  // A still-valid Analytics-only acceptance must not silently opt visitors into advertising.
  await page.evaluate(()=>localStorage.setItem('cw-consent-v1',JSON.stringify({version:1,analytics:true,expires:Date.now()+86400000})));
  await page.reload();assert.equal(await page.locator('.cookie-banner').isVisible(),true);assert.equal(external.length,0);
  await page.locator('.cookie-banner [data-consent=accept]').click();
  await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.dataLayer?.some(c=>c[0]==='config'&&c[1]==='AW-18472426652'));
  await page.waitForTimeout(real?6000:400);
  const frame=page.frames().find(f=>f.url().includes('analytics-frame.html'));
  const commands=()=>frame.evaluate(()=>dataLayer.filter(c=>c&&typeof c.length==='number').map(c=>Array.from(c)));
  let cs=await commands();
  assert.deepEqual(cs.find(c=>c[0]==='consent'&&c[1]==='default')[2],denied);
  assert.deepEqual(cs.find(c=>c[0]==='consent'&&c[1]==='update')[2],granted);
  assert.deepEqual(cs.filter(c=>c[0]==='config').map(c=>c[1]),[GA,ADS]);
  assert.ok(cs.filter(c=>c[0]==='config').every(c=>c[2].send_page_view===false));
  assert.equal(cs.filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
  assert.equal(cs.find(c=>c[0]==='event'&&c[1]==='page_view')[2].send_to,GA);
  assert.equal(cs.find(c=>c[0]==='set'&&c[1]==='ads_data_redaction')[2],true);
  assert.equal(cs.find(c=>c[0]==='config'&&c[1]===ADS)[2].allow_enhanced_conversions,false);
  assert.equal(await frame.locator('script[src*="/gtag/js?id=G-"]').count(),1);
  assert.equal(cs.filter(c=>c[0]==='event'&&c[1]==='conversion').length,0);
  async function fill(){for(const [id,value] of Object.entries({name:'PRIVATE_NAME',company:'PRIVATE_COMPANY',email:'private@example.org',message:'PRIVATE_MESSAGE',url1:'https://private.example.org/a',url2:'https://private.example.org/b',url3:'https://private.example.org/c'}))await page.locator('#'+id).fill(value);await page.locator('[name=cf-turnstile-response]').evaluate(e=>e.value='simulated-token');}
  for (const failure of [422,500,0]) {
  formStatus=failure;
  await fill();await page.locator('[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#form-status').dataset.state==='error');
  assert.equal((await commands()).filter(c=>c[0]==='event'&&['generate_lead','conversion'].includes(c[1])).length,0);
  assert.equal(await page.locator('#name').inputValue(),'PRIVATE_NAME');
  await page.waitForTimeout(real?2000:100);
  assert.equal(external.filter(r=>new URL(r.url).searchParams.get('label')===LABEL).length,0,'No Ads lead request on failed Formspree');
  }
  formStatus=200;await fill();await page.locator('[type=submit]').evaluate(e=>{e.click();e.click();});await page.waitForFunction(()=>document.querySelector('#form-status').dataset.state==='success');
  cs=await commands();assert.deepEqual(cs.filter(c=>c[0]==='event'&&c[1]==='generate_lead').map(c=>c[2]),[{send_to:GA,form_name:'contact'}]);assert.deepEqual(cs.filter(c=>c[0]==='event'&&c[1]==='conversion').map(c=>c[2]),[{send_to:SEND_TO}]);assert.equal(forms,4,'Double submit sends only one successful request');
  await page.waitForTimeout(real?10000:200);
  const observed=external.filter(r=>new URL(r.url).pathname.endsWith('/collect')).flatMap(r=>{
   const query=new URL(r.url).searchParams;
   return (r.body?r.body.split(/\r?\n/):['']).map(line=>{const q=new URLSearchParams(query);for(const [k,v] of new URLSearchParams(line))q.set(k,v);return Object.fromEntries(q);});
  });
  if(real)fs.writeFileSync(path.join(process.env.TEMP,'cw-ads-traffic-'+lang+'.json'),JSON.stringify(external,null,2));
  console.log('Observed collect request summary: '+JSON.stringify(observed.filter(e=>e.en).map(e=>({en:e.en,tid:e.tid,dl:e.dl,params:e.params}))));
  assert.equal(observed.filter(e=>e.en==='page_view'&&(!real||e.tid===GA)).length,1,'One actual GA4 page_view request');
  assert.equal(observed.filter(e=>e.en==='generate_lead').length,1,'One actual generate_lead request');
  if(!real)assert.equal(observed.filter(e=>e.en==='conversion').length,1);
  const adsLeads=external.filter(r=>new URL(r.url).searchParams.get('label')===LABEL);
  if(real){assert.ok(adsLeads.length>0,'Real Ads lead transport observed');assert.ok(adsLeads.every(r=>new URL(r.url).pathname.endsWith('/18472426652/')));const groups=new Set(adsLeads.map(r=>new URL(r.url).searchParams.get('random')));assert.equal(groups.size,1,'One Ads event across Google transport endpoints');assert.ok(!groups.has(null));console.log('Ads lead transports: '+JSON.stringify(adsLeads.map(r=>{const u=new URL(r.url);return {host:u.hostname,path:u.pathname,label:u.searchParams.get('label'),random:u.searchParams.get('random'),oid:u.searchParams.get('oid')};})));}
  if(real){assert.ok(observed.filter(e=>e.en==='generate_lead').every(e=>e.tid===GA));assert.ok(external.some(r=>r.url.includes('/gtag/js?id='+ADS)),'Google loads its Ads destination module');}
  console.log('Observed intercepted GA4 events ('+lang+'): '+observed.filter(e=>!real||e.tid===GA).map(e=>e.en).join(', '));
  assert.doesNotMatch(decodeURIComponent(JSON.stringify(external)+JSON.stringify(cs)),/PRIVATE_|private@example|private\.example/);
  // No event forwarding after withdrawal; readable GA and Ads cookies are removed.
  await context.addCookies([{name:'_gcl_au',value:'test',url:origin}]);
  await page.locator('[data-manage-cookies]').click();const before=external.length;
  await page.locator('.cookie-dialog [data-consent=reject]').click();await page.waitForTimeout(real?6000:400);
  assert.equal(external.length,before,'No external request after withdrawal');assert.equal(page.frames().length,1);
  assert.equal((await context.cookies()).filter(c=>/^(_ga|_gcl_)/.test(c.name)).length,0);
  await page.evaluate(()=>document.dispatchEvent(new Event('cw:lead-confirmed')));await page.reload();await page.waitForTimeout(300);assert.equal(external.length,before);
  assert.deepEqual(errors,[]);console.log('PASS '+lang+': refusal, legacy consent renewal, two destinations, one GA page_view, 422/500/network failure/200/double-submit, one Ads conversion on success, no PII, withdrawal/cookies/reload');
  console.log('Intercepted Google hosts ('+lang+'): '+[...new Set(external.map(r=>new URL(r.url).hostname))].join(', '));
  for(const category of ['analytics','advertising']) {
   await page.locator('[data-manage-cookies]').click();
   await page.locator('#cookie-analytics').setChecked(category==='analytics');
   await page.locator('#cookie-advertising').setChecked(category==='advertising');
   await page.locator('.cookie-dialog [data-consent=save]').click();
   await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.dataLayer?.some(c=>c[0]==='config'));
   const f=page.frames().find(f=>f.url().includes('analytics-frame.html'));
   if(real)await f.waitForFunction(id=>!!window.google_tag_manager?.[id],category==='analytics'?GA:ADS);
   const scoped=await f.evaluate(()=>dataLayer.filter(c=>c&&typeof c.length==='number').map(c=>Array.from(c)));
   assert.deepEqual(scoped.filter(c=>c[0]==='config').map(c=>c[1]),[category==='analytics'?GA:ADS]);
   const state=scoped.find(c=>c[0]==='consent'&&c[1]==='update')[2];
   assert.equal(state.analytics_storage,category==='analytics'?'granted':'denied');
   for(const key of ['ad_storage','ad_user_data','ad_personalization'])assert.equal(state[key],category==='advertising'?'granted':'denied');
   if(category==='advertising')assert.equal(scoped.filter(c=>c[0]==='event').length,0);
   await page.evaluate(()=>document.dispatchEvent(new Event('cw:lead-confirmed')));
   const afterLead=await f.evaluate(()=>dataLayer.filter(c=>c&&typeof c.length==='number').map(c=>Array.from(c)));
   assert.equal(afterLead.filter(c=>c[0]==='event'&&c[1]==='conversion').length,category==='advertising'?1:0);
   assert.equal(afterLead.filter(c=>c[0]==='event'&&c[1]==='generate_lead').length,category==='analytics'?1:0);
   await page.waitForTimeout(real?1500:100);
   assert.doesNotMatch(decodeURIComponent(JSON.stringify(external)),/PRIVATE_|private@example|private\.example/);
   await page.locator('[data-manage-cookies]').click();await page.locator('.cookie-dialog [data-consent=reject]').click();
  }
  console.log('PASS '+lang+': audience-only and advertising-only choices configure only the authorised destination');
  await context.close();
 }
 // Missing-label fail-closed branch is tested with a local response replacement.
 if(!real){
  const context=await browser.newContext();await context.route('https://**/*',r=>r.fulfill({status:204}));
  await context.route('**/assets/analytics-frame.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(root,'assets/analytics-frame.js'),'utf8').replace("GOOGLE_ADS_LEAD_LABEL = '"+LABEL+"'",'GOOGLE_ADS_LEAD_LABEL = null')}));
  const page=await context.newPage();await page.goto(origin);await page.locator('.cookie-banner [data-consent=accept]').click();await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.cwRecord);
  await page.evaluate(()=>document.dispatchEvent(new Event('cw:lead-confirmed')));
  const cs=await page.frames().find(f=>f.url().includes('analytics-frame.html')).evaluate(()=>dataLayer.map(c=>Array.from(c)));
  assert.deepEqual(cs.filter(c=>c[0]==='event'&&c[1]==='conversion').map(c=>c[2]),[]);assert.equal(cs.filter(c=>c[0]==='event'&&c[1]==='generate_lead').length,1);await context.close();console.log('PASS absent label: no Ads conversion, fail closed');
 }
 console.log(real?'REAL Google JavaScript, ALL collection intercepted; no real lead/payment':'Deterministic tag double; ALL external services intercepted');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
