const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='43dcbdf',origin='http://127.0.0.1:8830',shots=path.join(process.env.TEMP,'cw-starter-trial');
const prior=f=>execFileSync('git',['show',base+':'+f],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n');
const server=http.createServer((req,res)=>{const u=new URL(req.url,origin);let f=path.join(root,u.pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(u.searchParams.has('baseline')&&['/','/en/'].includes(u.pathname)?prior(u.pathname==='/en/'?'en/index.html':'index.html'):fs.readFileSync(f));});
const expectedForm=s=>[["Tous les champs sont requis, sauf le message.", "Le message et les URL 2 et 3 sont facultatifs."], ["All fields are required except the message.", "The message and URLs 2 and 3 are optional."], ["Vos premières pages à surveiller", "Ajoutez de 1 à 3 pages à vérifier"], ["Your first pages to monitor", "Add 1 to 3 pages to check"], ["URL concurrente 2</label>", "URL concurrente 2 <span class=\"muted\">(facultative)</span></label>"], ["URL concurrente 3</label>", "URL concurrente 3 <span class=\"muted\">(facultative)</span></label>"], ["Competitor URL 2</label>", "Competitor URL 2 <span class=\"muted\">(optional)</span></label>"], ["Competitor URL 3</label>", "Competitor URL 3 <span class=\"muted\">(optional)</span></label>"], ["name=\"competitor_url_2\" type=\"url\" placeholder=\"https://…\" required maxlength=\"600\"", "name=\"competitor_url_2\" type=\"url\" placeholder=\"https://…\" maxlength=\"600\""], ["name=\"competitor_url_3\" type=\"url\" placeholder=\"https://…\" required maxlength=\"600\"", "name=\"competitor_url_3\" type=\"url\" placeholder=\"https://…\" maxlength=\"600\""]].reduce((html,[before,after])=>html.replace(before,after),s);
const GA='G-RB6NSRRM9L';
const stub=`let config;function record(c){if(window['ga-disable-${GA}'])return;if(c[0]==='config'&&c[1]==='${GA}')config=c[2];if(c[0]==='event'&&c[2]?.send_to==='${GA}')fetch('https://www.google-analytics.com/g/collect?'+new URLSearchParams({en:c[1],ep:JSON.stringify(c[2]),dl:config.page_location}));}dataLayer.forEach(record);dataLayer.push=(...cs)=>{cs.forEach(record);return Array.prototype.push.apply(dataLayer,cs)};`;
(async()=>{await new Promise(r=>server.listen(8830,'127.0.0.1',r));fs.mkdirSync(shots,{recursive:true});const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 // Preserve all existing runtime, legal, blog, payment, consent and integration files.
 const allowed=new Set(['index.html','en/index.html','tests/browser.cjs','tests/i18n.cjs','script.js','assets/consent.js','assets/analytics-frame.js']);
 for(const file of execFileSync('git',['ls-tree','-r','--name-only',base],{cwd:root,encoding:'utf8'}).trim().split('\n'))if(!allowed.has(file)){
  const previous=execFileSync('git',['show',base+':'+file],{cwd:root});assert.ok(previous.equals(fs.readFileSync(path.join(root,file)))||previous.toString().replace(/\r\n/g,'\n')===fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n'),file+' unchanged');
 }
 for(const [lang,route,file] of [['fr','/','index.html'],['en','/en/','en/index.html']]){
  const old=prior(file),now=fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
  const cards=s=>s.match(/<article class="pricing-card[^>]*>.*?<\/article>/g);
  assert.deepEqual(cards(now).slice(1),cards(old).slice(1),'Business/Pro unchanged');
  const stripe=s=>s.match(/https:\/\/buy\.stripe\.com\/[^"<]+/g);assert.deepEqual(stripe(now),stripe(old),'all payment links identical');
  assert.equal(now.replace(/<div class="field request-type-field">.*?<\/div>/,'').match(/<form id="demande"[\s\S]*?<\/form>/)[0],expectedForm(old).match(/<form id="demande"[\s\S]*?<\/form>/)[0],'existing form unchanged apart from request selector and optional URLs');
  const ctx=await browser.newContext({reducedMotion:'reduce'}),requests=[],errors=[];await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(origin))return r.continue();requests.push({url:u,body:r.request().postData()||''});if(u.includes('googletagmanager'))return r.fulfill({contentType:'text/javascript',body:stub});return r.fulfill({status:204});});
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+route);await p.locator('[data-starter-trial]').click();assert.equal(requests.filter(r=>/google-analytics|googletagmanager/.test(r.url)).length,0,'no Analytics before consent');await p.locator('[data-consent=reject]').first().click();
  for(const width of [320,375,390,768,1024,1440]){
   await p.setViewportSize({width,height:1000});await p.goto(origin+route);const card=p.locator('.starter-trial');await card.scrollIntoViewIfNeeded();
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),lang+' overflow '+width);
   assert.ok(await card.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'card fits');
   assert.match(await card.innerText(),lang==='fr'?/30 jours gratuits[\s\S]*puis 14,90 €\/mois/:/30 days free[\s\S]*then €14.90\/month/);
   assert.equal(await card.locator('a.button').getAttribute('href'),'#demande');assert.equal(await card.locator('.starter-paid').getAttribute('href'),'https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02');
   if([320,1440].includes(width)){
    await p.addScriptTag({path:process.env.CW_AXE_PATH});const audit=await p.evaluate(()=>axe.run(document.querySelector('.pricing-grid'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(audit.violations.map(x=>({id:x.id,nodes:x.nodes.map(n=>n.target)})),[]);
    await card.screenshot({path:path.join(shots,`${lang}-${width}-after-card.png`),style:'.header{visibility:hidden}'});
    await p.locator('.pricing-grid').screenshot({path:path.join(shots,`${lang}-${width}-after-grid.png`),style:'.header{visibility:hidden}'});
    await p.goto(origin+route+'?baseline=1');await p.locator('.pricing-card').first().screenshot({path:path.join(shots,`${lang}-${width}-before-card.png`),style:'.header{visibility:hidden}'});
   }
  }
  await p.goto(origin+route);const trial=p.locator('.starter-trial a.button');await trial.focus();assert.ok(await trial.evaluate(e=>e.matches(':focus-visible')));await p.keyboard.press('Enter');assert.equal(new URL(p.url()).hash,'#demande');assert.equal(await p.locator('#request-type').inputValue(),lang==='fr'?'Essai Starter 30 jours':'Starter 30-day free trial');assert.equal(await p.locator(':focus').getAttribute('id'),'demande');
  assert.equal(requests.filter(r=>/google-analytics|googletagmanager|formspree|buy.stripe/.test(r.url)).length,0,'refusal prevents Google and clicking trial neither submits nor pays');
  await p.setViewportSize({width:320,height:900});await p.goto(origin+route+'?baseline=1');await p.addStyleTag({content:'html{font-size:200%!important}'});const baselineWidth=await p.evaluate(()=>document.documentElement.scrollWidth);
  await p.goto(origin+route);await p.addStyleTag({content:'html{font-size:200%!important}'});const enlargedWidth=await p.evaluate(()=>document.documentElement.scrollWidth);assert.ok(enlargedWidth<=baselineWidth,'no additional whole-page overflow at 200% text');assert.ok(await p.locator('.starter-trial').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Starter fits at 320px with 200% text');console.log(lang+' 320px / 200% text: baseline scrollWidth='+baselineWidth+', new='+enlargedWidth+'; Starter fits');
  await p.setViewportSize({width:1440,height:1000});await p.goto(origin+route);await p.evaluate(()=>document.body.style.zoom='2');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.goto(origin+route+'?email=PRIVATE#PRIVATE');await p.locator('[data-manage-cookies]').click();await p.locator('.cookie-dialog [data-consent=accept]').click();await p.waitForTimeout(500);
  await trial.click();await p.waitForTimeout(250);const events=()=>requests.filter(r=>r.url.includes('/collect')).map(r=>Object.fromEntries(new URL(r.url).searchParams));
  assert.deepEqual(events().map(e=>e.en),['page_view','free_trial_click','commercial_cta_click']);assert.deepEqual(JSON.parse(events()[1].ep),{send_to:GA,plan:'starter',destination:'demande'});assert.ok(!JSON.stringify(requests).includes('PRIVATE'));
  const requestType=p.locator('#request-type');
  const trialValue=lang==='fr'?'Essai Starter 30 jours':'Starter 30-day free trial', compatibility=lang==='fr'?'Vérification de compatibilité':'Compatibility check';
  assert.equal(await requestType.inputValue(),trialValue);
  await requestType.focus();assert.ok(await requestType.evaluate(e=>e.matches(':focus-visible')));
  await requestType.selectOption({index:2});assert.equal(await requestType.inputValue(),lang==='fr'?'Autre demande':'Other enquiry');
  await p.locator('.pricing-note a[href="#demande"]').click();assert.equal(await requestType.inputValue(),compatibility);
  assert.equal(events().filter(e=>e.en==='free_trial_click').length,1,'classic request does not count as trial');
  await p.locator('#name').fill('PRIVATE_NAME');await p.locator('#company').fill('PRIVATE_COMPANY');await p.locator('#email').fill('private@example.test');await p.locator('#message').fill('PRIVATE_MESSAGE');
  for(const i of [1,2,3])await p.locator('#url'+i).fill('https://example.test/PRIVATE_'+i);
  await trial.click();await p.waitForTimeout(150);assert.equal(await requestType.inputValue(),trialValue);assert.equal(events().filter(e=>e.en==='free_trial_click').length,2,'one dedicated event per click');
  const frame=p.frames().find(f=>f.url().includes('analytics-frame.html'));
  const commands=await frame.evaluate(()=>dataLayer.map(c=>Array.from(c)));
  assert.deepEqual(commands.filter(c=>c[0]==='event'&&c[1]==='free_trial_click').map(c=>c[2]),Array(2).fill({send_to:GA,plan:'starter',destination:'demande'}));
  assert.equal(commands.filter(c=>c[0]==='event'&&['generate_lead','conversion','purchase'].includes(c[1])).length,0,'click is not a lead or payment');
  assert.ok(!JSON.stringify(requests).match(/PRIVATE|private@example|Essai Starter|Starter 30-day free trial|request_type/),'no form values or request type in Google traffic');
  let formCalls=0,payload,reply=422;
  await p.route('https://formspree.io/**',r=>{formCalls++;payload=r.request().postDataJSON();return r.fulfill({status:reply,contentType:'application/json',body:reply===200?'{}':'{"errors":[]}'});});
  const token=async()=>p.evaluate(()=>{let el=document.querySelector('[name="cf-turnstile-response"]');if(!el){el=document.createElement('input');el.type='hidden';el.name='cf-turnstile-response';document.querySelector('#demande').append(el);}el.value='mock-token';window.turnstile={reset(){el.value='';}};});
  await token();await p.locator('[type=submit]').click();await p.waitForFunction(()=>document.querySelector('#form-status').dataset.state==='error');assert.equal(formCalls,1);assert.equal(payload.request_type,trialValue);assert.equal(await requestType.inputValue(),trialValue);
  assert.equal((await frame.evaluate(()=>dataLayer.map(c=>Array.from(c)))).filter(c=>c[0]==='event'&&['generate_lead','conversion'].includes(c[1])).length,0,'failed form has no conversion');
  assert.equal(payload.competitor_url_2,'https://example.test/PRIVATE_2');assert.equal(payload.competitor_url_3,'https://example.test/PRIVATE_3');
  await p.locator('#url2').fill('');await p.locator('#url3').fill('');
  reply=200;await token();await p.locator('[type=submit]').click();await p.waitForFunction(()=>document.querySelector('#form-status').dataset.state==='success');assert.equal(formCalls,2);assert.equal(payload.request_type,trialValue);assert.equal(payload.competitor_url_1,'https://example.test/PRIVATE_1');assert.equal(payload.competitor_url_2,'');assert.equal(payload.competitor_url_3,'');assert.equal(await requestType.inputValue(),compatibility,'success resets to classic enquiry');
  const confirmed=await frame.evaluate(()=>dataLayer.map(c=>Array.from(c)));assert.equal(confirmed.filter(c=>c[0]==='event'&&c[1]==='generate_lead').length,1);assert.equal(confirmed.filter(c=>c[0]==='event'&&c[1]==='conversion').length,1);
  assert.equal(await p.locator('#url1').getAttribute('required'),'');assert.equal(await p.locator('#url2').getAttribute('required'),null);assert.equal(await p.locator('#url3').getAttribute('required'),null);
  for(const count of [1,3]){
    await p.locator('#name').fill('PRIVATE_NAME');await p.locator('#company').fill('PRIVATE_COMPANY');await p.locator('#email').fill('private@example.test');
    await token();await p.locator('[type=submit]').click();assert.equal(formCalls,count===1?2:3,'URL 1 is still required');
    for(let i=1;i<=count;i++)await p.locator('#url'+i).fill('https://example.test/PRIVATE_'+i);
    if(count===1){await p.locator('#url2').fill('not-a-url');assert.equal(await p.locator('#url2').evaluate(e=>e.checkValidity()),false);await p.locator('#url2').fill('');}
    await p.locator('[type=submit]').click();await p.waitForFunction(()=>document.querySelector('#form-status').dataset.state==='success');
    assert.equal(payload.request_type,compatibility);for(let i=1;i<=3;i++)assert.equal(payload['competitor_url_'+i],i<=count?'https://example.test/PRIVATE_'+i:'');
    assert.equal(formCalls,count===1?3:4);
  }
  assert.equal(events().filter(e=>e.en==='free_trial_click').length,2,'form submission does not emit a trial click');
  assert.ok(!JSON.stringify(requests.filter(r=>/google/.test(r.url))).match(/PRIVATE|private@example|request_type|Essai Starter|Starter 30-day free trial/));
  await p.locator('[data-manage-cookies]').click();await p.locator('.cookie-dialog [data-consent=reject]').click();const n=requests.length;await trial.click();await p.waitForTimeout(200);assert.equal(requests.length,n);assert.deepEqual(errors,[]);await ctx.close();
  const ads=await browser.newContext();const outbound=[];await ads.route('**/*',r=>{if(r.request().url().startsWith(origin))return r.continue();outbound.push(r.request().url());return r.fulfill({status:204});});const ap=await ads.newPage();await ap.goto(origin+route);await ap.locator('[data-consent=customize]').click();await ap.locator('#cookie-advertising').check();await ap.locator('[data-consent=save]').click();await ap.waitForTimeout(300);await ap.locator('[data-starter-trial]').click();const af=ap.frames().find(f=>f.url().includes('analytics-frame.html'));assert.equal((await af.evaluate(()=>dataLayer.map(c=>Array.from(c)))).filter(c=>c[0]==='event').length,0,'advertising-only consent never emits trial or CTA or lead');assert.equal(await ap.locator('#request-type').inputValue(),trialValue);await ads.close();
  console.log('PASS '+lang+': manual trial copy, unchanged Business/Pro/promo/Stripe; request selector, mock Formspree error/success/reset, one-URL trial and compatibility, three-URL payload, required URL 1, Analytics-only trial event, 6 widths, axe, keyboard/focus, 200% text/zoom, trial CTA tracking without PII and refusal/withdrawal; screenshots '+shots);
 }
 const ctx=await browser.newContext({javaScriptEnabled:false});await ctx.route('https://**/*',r=>r.fulfill({status:204}));const p=await ctx.newPage();for(const route of ['/','/en/']){await p.goto(origin+route);await p.locator('.starter-trial a.button').click();assert.equal(new URL(p.url()).hash,'#demande');assert.equal(await p.locator('form noscript').count(),1);assert.ok(await p.locator('a[href="mailto:changewatch@cybersignal.fr"]').count()>0);}await ctx.close();console.log('PASS no-JS trial enquiry anchor and existing email fallback. No real payment, enquiry or telemetry.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
