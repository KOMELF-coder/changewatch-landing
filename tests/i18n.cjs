const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),origin='http://127.0.0.1:8770',publicOrigin='https://changewatch.cybersignal.fr';
const pairs=[['/','/en/'],['/cgv.html','/en/terms.html'],['/mentions-legales.html','/en/legal-notice.html'],['/confidentialite.html','/en/privacy.html'],['/demo-produit.html','/en/demo-product.html']];
const widths=[320,375,390,768,1024,1440];
const shotDir=process.env.CW_SCREENSHOT_DIR || path.join(process.env.TEMP||'/tmp','cw-i18n');
const server=http.createServer((req,res)=>{let file=path.join(root,new URL(req.url,origin).pathname);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
const tokenStub=`const w=document.querySelector('.cf-turnstile');if(w){const i=document.createElement('input');i.type='hidden';i.name='cf-turnstile-response';w.append(i);}window.resetCount=0;window.turnstile={reset(){window.resetCount++;document.querySelector('[name=cf-turnstile-response]').value='';}};`;
const gaStub=`function record(c){if(window['ga-disable-G-RB6NSRRM9L'])return;if(c[0]==='config'){window.testConfig=c[2];document.cookie='_ga=local;path=/';}if(c[0]==='event')fetch('https://www.google-analytics.com/g/collect?'+new URLSearchParams({en:c[1],dl:testConfig.page_location,ep:JSON.stringify(c[2]||{})}),{method:'POST'});}dataLayer.forEach(record);dataLayer.push=(...cs)=>{cs.forEach(record);return Array.prototype.push.apply(dataLayer,cs)};`;
async function main(){await new Promise(r=>server.listen(8770,'127.0.0.1',r));fs.mkdirSync(shotDir,{recursive:true});const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({reducedMotion:'reduce'}),requests=[],errors=[];let mode='success',formCount=0,lastPayload;
 await context.route('**/*',async route=>{const req=route.request(),u=new URL(req.url());if(u.origin===origin)return route.continue();
  if(u.hostname==='challenges.cloudflare.com')return route.fulfill({contentType:'text/javascript',body:tokenStub});
  if(u.hostname==='formspree.io'){formCount++;lastPayload=req.postDataJSON();if(mode==='timeout')return;if(mode==='network')return route.abort();await new Promise(r=>setTimeout(r,300));return route.fulfill({status:mode==='http'?422:200,contentType:'application/json',body:mode==='http'?'{}':'{"ok":true}'});}
  requests.push(req.url());if(u.hostname==='www.googletagmanager.com')return route.fulfill({contentType:'text/javascript',body:gaStub});
  if(u.hostname==='buy.stripe.com')return route.fulfill({contentType:'text/html',body:'<h1>Local test destination</h1>'});
  return route.fulfill({status:204,headers:{'access-control-allow-origin':'*'}});
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const analytics=()=>requests.filter(u=>/google-analytics|googletagmanager/.test(u));
 const events=()=>requests.filter(u=>u.includes('/collect')).map(u=>Object.fromEntries(new URL(u).searchParams));
 await page.goto(origin+'/en/');assert.equal(analytics().length,0);
 for(const width of [320,375,390,1440]){
  await page.setViewportSize({width,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'initial banner '+width);
  assert.deepEqual(await page.locator('.cookie-banner button').allTextContents(),['Accept all','Reject all','Customise']);
  const sizes=await page.locator('.cookie-banner button').evaluateAll(es=>es.map(e=>({w:e.offsetWidth,h:e.offsetHeight})));assert.deepEqual(sizes[0],sizes[1]);
  await page.locator('[data-consent=customize]').click();assert.equal(await page.locator('#cookie-analytics').isChecked(),false);
  for(const button of await page.locator('.cookie-dialog button').all()){await button.focus();assert.ok(await button.evaluate(e=>e===document.activeElement));}
  await page.screenshot({path:path.join(shotDir,`en-consent-${width}.png`)});await page.keyboard.press('Escape');
 }
 assert.equal(analytics().length,0);
 await page.locator('.cookie-banner [data-consent=reject]').click();
 for(const [fr,en] of pairs)for(const route of [fr,en]){
  const english=route===en;await page.goto(origin+route);assert.equal(await page.locator('html').getAttribute('lang'),english?'en':'fr');
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),publicOrigin+route);
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),publicOrigin+route);
  assert.equal(await page.locator('meta[property="og:locale"]').getAttribute('content'),english?'en_GB':'fr_FR');
  assert.ok((await page.locator('meta[name=description]').getAttribute('content')).length>40);
  for(const [lang,url] of [['fr',fr],['en',en],['x-default',fr]])assert.equal(await page.locator(`link[hreflang="${lang}"]`).getAttribute('href'),publicOrigin+url);
  const switchLink=page.locator('.language-switch a[aria-current=page]');assert.equal(await switchLink.count(),1);assert.equal(await switchLink.getAttribute('href'),route);
  const refs=await page.locator('a[href],link[href],script[src],img[src]').evaluateAll(es=>es.map(e=>e.href||e.src));
  for(const href of new Set(refs)){const u=new URL(href);if(![origin,publicOrigin].includes(u.origin))continue;const response=await page.request.get(origin+u.pathname);assert.equal(response.status(),200,href);if(u.hash)assert.ok((await response.text()).includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),href);}
  for(const width of widths){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' width '+width);}
  if(english && process.env.CW_AXE_PATH){await page.addScriptTag({path:process.env.CW_AXE_PATH});const audit=await page.evaluate(()=>axe.run());assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],route);}
  const other=page.locator('.language-switch a:not([aria-current])');await other.focus();await page.keyboard.press('Enter');await page.waitForURL(origin+(english?fr:en));assert.equal(await page.locator('.cookie-banner').isVisible(),false);
 }
 assert.equal(analytics().length,0);console.log('PASS ten FR/EN pages: reciprocal SEO, resources, anchors, six widths, keyboard language links, shared refusal; English axe audits if configured');
 const sitemap=await (await page.request.get(origin+'/sitemap.xml')).text();for(const [fr,en] of pairs.slice(0,4)){assert.ok(sitemap.includes('<loc>'+publicOrigin+fr+'</loc>'));assert.ok(sitemap.includes('<loc>'+publicOrigin+en+'</loc>'));}
 for(const [fr,en] of pairs.slice(4)){assert.ok(!sitemap.includes(publicOrigin+en));await page.goto(origin+en);assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex');}
 await page.goto(origin+'/en/');
 for(const width of [320,375,390]){await page.setViewportSize({width,height:844});assert.equal(await page.locator('.language-switch').isVisible(),true);await page.locator('.menu-toggle').click();assert.equal(await page.locator('#navigation').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');await page.locator('.menu-toggle').click();await page.locator('#navigation a[href="#tarifs"]').first().click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
 const prices=await page.locator('.plan-price').allTextContents();assert.deepEqual(prices,['€14.90/month','€29.90/month','€59.90/month']);
 const plans={Starter:'dRm5kC8cA3P93hg9pc4gg02',Business:'dRm28q50o2L5aJI58W4gg03',Pro:'3cI9AScsQ4Td8BA30O4gg04'};
 for(const [name,id]of Object.entries(plans)){const link=page.getByRole('link',{name:'Choose '+name});assert.equal(await link.getAttribute('href'),'https://buy.stripe.com/'+id);assert.equal(await link.getAttribute('target'),null);await link.focus();await page.keyboard.press('Enter');await page.waitForURL('https://buy.stripe.com/'+id);assert.equal(context.pages().length,1);await page.goto(origin+'/en/');}
 assert.equal(formCount,0);assert.equal(await page.locator('.cf-turnstile').getAttribute('data-sitekey'),'0x4AAAAAAE2QTEgZOtjjoxAY');assert.equal(await page.locator('.cf-turnstile').getAttribute('data-language'),'en');
 async function fill(){await page.locator('#name').fill('PRIVATE_NAME');await page.locator('#company').fill('PRIVATE_COMPANY');await page.locator('#email').fill('private@example.org');for(let i=1;i<4;i++)await page.locator('#url'+i).fill('https://example.org/private');await page.locator('#message').fill('PRIVATE_MESSAGE');await page.locator('[name=cf-turnstile-response]').evaluate(e=>e.value='local-token');}
 await fill();await page.locator('#url1').fill('https://user:password@example.org');await page.locator('[type=submit]').click();assert.match(await page.locator('#url1').evaluate(e=>e.validationMessage),/^Enter a full public URL/);assert.equal(formCount,0);await fill();
 for(const token of ['', '   ']){await page.locator('[name=cf-turnstile-response]').evaluate((e,v)=>e.value=v,token);await page.locator('[type=submit]').click();assert.equal(formCount,0);assert.equal(await page.locator('#form-status').innerText(),'Please wait a few seconds while the anti-spam check completes.');}
 for(mode of ['success','http','network','timeout']){await fill();const before=formCount,resets=await page.evaluate(()=>resetCount);await page.locator('[type=submit]').click();await page.locator('#demande').evaluate(e=>{e.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));});await page.waitForFunction(()=>!document.querySelector('[type=submit]').disabled,{},{timeout:20000});assert.equal(formCount,before+1);assert.equal(lastPayload['cf-turnstile-response'],'local-token');assert.deepEqual(Object.keys(lastPayload).sort(),['name','company','email','competitor_url_1','competitor_url_2','competitor_url_3','optional_message','cf-turnstile-response'].sort());assert.equal(await page.evaluate(()=>resetCount),resets+1);assert.equal(await page.locator('#name').inputValue(),mode==='success'?'':'PRIVATE_NAME');assert.match(await page.locator('#form-status').innerText(),mode==='success'?/^Your request has been received/:/^We could not send your request/);}
 console.log('PASS English mobile menu, Stripe same-tab targets/prices, URL validation, token guard, AJAX success/422/network/15s timeout, double-submit lock, preserved fields and Turnstile reset (local mocks only)');
 await page.locator('[data-manage-cookies]').click();await page.locator('.cookie-dialog [data-consent=accept]').click();await page.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.testConfig);
 await page.waitForTimeout(300);assert.equal(events().filter(e=>e.en==='page_view').length,1);assert.equal(events()[0].dl,publicOrigin+'/en/');
 await page.locator('.hero-actions a[href="#tarifs"]').click();await page.evaluate(()=>document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault())));await page.getByRole('link',{name:'Choose Business'}).click();await page.waitForTimeout(200);assert.equal(events().filter(e=>e.en==='stripe_click').length,1);assert.equal(events().filter(e=>e.en==='commercial_cta_click').length,1);
 await page.locator('.language-switch a[lang=fr]').click();await page.waitForTimeout(300);assert.equal(await page.locator('.cookie-banner').isVisible(),false);assert.equal(events().filter(e=>e.en==='page_view').length,2);assert.equal(events().at(-1).dl,publicOrigin+'/');
 await page.locator('[data-manage-cookies]').click();await page.locator('.cookie-dialog [data-consent=reject]').click();const count=analytics().length;await page.goto(origin+'/en/');await page.locator('.hero-actions a[href="#tarifs"]').click();await page.waitForTimeout(300);assert.equal(analytics().length,count);assert.equal((await context.cookies()).filter(c=>c.name.startsWith('_ga')).length,0);assert.ok(!requests.join('').includes('PRIVATE'));assert.ok(!requests.join('').includes('private@'));assert.ok(!events().some(e=>e.en==='purchase'));
 console.log('PASS EN→FR accepted consent, canonical page_view once/document, CTA/stripe_click, FR→EN withdrawal/cookie cleanup, no private data or purchase');
 for(const width of widths){await page.setViewportSize({width,height:900});for(let i=0;i<4;i++){await page.locator(`[data-step="${i}"]`).click();assert.equal(await page.locator('#story-workbench').getAttribute('data-phase'),String(i));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.match(await page.locator('.result-channel').innerText(),/BASELINE|PENDING|COMPARISON|BY EMAIL/);}}
 await page.locator('[data-step="0"]').focus();await page.keyboard.press('End');assert.equal(await page.locator('[data-step="3"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#demo-play').innerText(),'See the result ↗');
 for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.goto(origin+'/en/');await page.screenshot({path:path.join(shotDir,`en-home-${width}.png`)});await page.locator('#story-workbench').screenshot({path:path.join(shotDir,`en-demo-${width}.png`)});await page.goto(origin+'/');await page.screenshot({path:path.join(shotDir,`fr-home-${width}.png`)});}
 await page.goto(origin+'/en/');await page.setViewportSize({width:1024,height:900});await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'200% text');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const np=await nojs.newPage();await np.goto(origin+'/en/');assert.equal(await np.locator('[type=submit]').isDisabled(),true);await np.locator('.language-switch a[lang=fr]').click();await np.waitForURL(origin+'/');await nojs.close();assert.deepEqual(errors,[]);
 console.log('PASS English four demo steps at six widths, keyboard/reduced motion, 200% text, no-JS language links; screenshots: '+shotDir);
}finally{await browser.close();server.close();}}
main().catch(e=>{console.error(e);process.exitCode=1;server.close();});
