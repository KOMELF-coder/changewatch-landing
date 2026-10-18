const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),base='43dcbdf',origin='http://127.0.0.1:8830',shots=path.join(process.env.TEMP,'cw-starter-trial');
const prior=f=>execFileSync('git',['show',base+':'+f],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n');
const server=http.createServer((req,res)=>{const u=new URL(req.url,origin);let f=path.join(root,u.pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(u.searchParams.has('baseline')&&['/','/en/'].includes(u.pathname)?prior(u.pathname==='/en/'?'en/index.html':'index.html'):fs.readFileSync(f));});
const GA='G-RB6NSRRM9L';
const stub=`let config;function record(c){if(window['ga-disable-${GA}'])return;if(c[0]==='config'&&c[1]==='${GA}')config=c[2];if(c[0]==='event'&&c[2]?.send_to==='${GA}')fetch('https://www.google-analytics.com/g/collect?'+new URLSearchParams({en:c[1],ep:JSON.stringify(c[2]),dl:config.page_location}));}dataLayer.forEach(record);dataLayer.push=(...cs)=>{cs.forEach(record);return Array.prototype.push.apply(dataLayer,cs)};`;
(async()=>{await new Promise(r=>server.listen(8830,'127.0.0.1',r));fs.mkdirSync(shots,{recursive:true});const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 // Preserve all existing runtime, legal, blog, payment, consent and integration files.
 const allowed=new Set(['index.html','en/index.html','tests/browser.cjs','tests/i18n.cjs']);
 for(const file of execFileSync('git',['ls-tree','-r','--name-only',base],{cwd:root,encoding:'utf8'}).trim().split('\n'))if(!allowed.has(file)){
  const previous=execFileSync('git',['show',base+':'+file],{cwd:root});assert.ok(previous.equals(fs.readFileSync(path.join(root,file)))||previous.toString().replace(/\r\n/g,'\n')===fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n'),file+' unchanged');
 }
 for(const [lang,route,file] of [['fr','/','index.html'],['en','/en/','en/index.html']]){
  const old=prior(file),now=fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
  const cards=s=>s.match(/<article class="pricing-card[^>]*>.*?<\/article>/g);
  assert.deepEqual(cards(now).slice(1),cards(old).slice(1),'Business/Pro unchanged');
  const stripe=s=>s.match(/https:\/\/buy\.stripe\.com\/[^"<]+/g);assert.deepEqual(stripe(now),stripe(old),'all payment links identical');
  assert.equal(now.match(/<form id="demande"[\s\S]*?<\/form>/)[0],old.match(/<form id="demande"[\s\S]*?<\/form>/)[0],'form byte-equivalent');
  const ctx=await browser.newContext({reducedMotion:'reduce'}),requests=[],errors=[];await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(origin))return r.continue();requests.push({url:u,body:r.request().postData()||''});if(u.includes('googletagmanager'))return r.fulfill({contentType:'text/javascript',body:stub});return r.fulfill({status:204});});
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+route);await p.locator('[data-consent=reject]').first().click();
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
  await p.goto(origin+route);const trial=p.locator('.starter-trial a.button');await trial.focus();assert.ok(await trial.evaluate(e=>e.matches(':focus-visible')));await p.keyboard.press('Enter');assert.equal(new URL(p.url()).hash,'#demande');assert.equal(await p.locator(':focus').getAttribute('id'),'demande');
  assert.equal(requests.filter(r=>/google-analytics|googletagmanager|formspree|buy.stripe/.test(r.url)).length,0,'refusal prevents Google and clicking trial neither submits nor pays');
  await p.setViewportSize({width:320,height:900});await p.goto(origin+route+'?baseline=1');await p.addStyleTag({content:'html{font-size:200%!important}'});const baselineWidth=await p.evaluate(()=>document.documentElement.scrollWidth);
  await p.goto(origin+route);await p.addStyleTag({content:'html{font-size:200%!important}'});const enlargedWidth=await p.evaluate(()=>document.documentElement.scrollWidth);assert.ok(enlargedWidth<=baselineWidth,'no additional whole-page overflow at 200% text');assert.ok(await p.locator('.starter-trial').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Starter fits at 320px with 200% text');console.log(lang+' 320px / 200% text: baseline scrollWidth='+baselineWidth+', new='+enlargedWidth+'; Starter fits');
  await p.setViewportSize({width:1440,height:1000});await p.goto(origin+route);await p.evaluate(()=>document.body.style.zoom='2');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await p.goto(origin+route+'?email=PRIVATE#PRIVATE');await p.locator('[data-manage-cookies]').click();await p.locator('.cookie-dialog [data-consent=accept]').click();await p.waitForTimeout(500);
  await trial.click();await p.waitForTimeout(250);const events=()=>requests.filter(r=>r.url.includes('/collect')).map(r=>Object.fromEntries(new URL(r.url).searchParams));
  assert.deepEqual(events().map(e=>e.en),['page_view','commercial_cta_click']);assert.deepEqual(JSON.parse(events()[1].ep),{send_to:GA,destination:'demande'});assert.ok(!JSON.stringify(requests).includes('PRIVATE'));
  await p.locator('[data-manage-cookies]').click();await p.locator('.cookie-dialog [data-consent=reject]').click();const n=requests.length;await trial.click();await p.waitForTimeout(200);assert.equal(requests.length,n);assert.deepEqual(errors,[]);await ctx.close();
  console.log('PASS '+lang+': manual trial copy, unchanged Business/Pro/promo/Stripe/form, 6 widths, axe, keyboard/focus, 200% text/zoom, trial CTA tracking without PII and refusal/withdrawal; screenshots '+shots);
 }
 const ctx=await browser.newContext({javaScriptEnabled:false});await ctx.route('https://**/*',r=>r.fulfill({status:204}));const p=await ctx.newPage();for(const route of ['/','/en/']){await p.goto(origin+route);await p.locator('.starter-trial a.button').click();assert.equal(new URL(p.url()).hash,'#demande');assert.equal(await p.locator('form noscript').count(),1);assert.ok(await p.locator('a[href="mailto:changewatch@cybersignal.fr"]').count()>0);}await ctx.close();console.log('PASS no-JS trial enquiry anchor and existing email fallback. No real payment, enquiry or telemetry.');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
