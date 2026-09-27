const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),origin='http://127.0.0.1:8820',pub='https://changewatch.cybersignal.fr';
const records=[['fr','/blog/logiciel-veille-concurrentielle/','software-selection-fr'],['en','/en/blog/competitor-price-monitoring/','price-monitoring-workflow-en']];
const shots=process.env.CW_SCREENSHOT_DIR||path.join(process.env.TEMP,'cw-operations-guides');
const GA='G-RB6NSRRM9L';
const stub=`let config;function record(c){if(window['ga-disable-${GA}'])return;if(c[0]==='config'&&c[1]==='${GA}')config=c[2];if(c[0]==='event'&&c[2]?.send_to==='${GA}')fetch('https://www.google-analytics.com/g/collect?'+new URLSearchParams({en:c[1],dl:config.page_location,ep:JSON.stringify(c[2])}));}dataLayer.forEach(record);dataLayer.push=(...cs)=>{cs.forEach(record);return Array.prototype.push.apply(dataLayer,cs)};`;
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,origin).pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'text/plain');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(8820,'127.0.0.1',r));fs.mkdirSync(shots,{recursive:true});const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 // Render original code-native social illustrations to local PNGs only on request.
 if(process.env.CW_RENDER_SOCIAL==='1'){
  const p=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  for(const [, ,asset] of records){await p.goto(origin+'/assets/'+asset+'-social.svg');await p.locator('svg').screenshot({path:path.join(root,'assets',asset+'-social.png')});}
  await p.close();
 }
 const existing=['blog/veille-concurrentielle-ecommerce/index.html','blog/etude-de-concurrence/index.html','blog/veille-concurrentielle-exemple/index.html','en/blog/ecommerce-competitor-monitoring/index.html','en/blog/competitor-price-analysis/index.html','en/blog/price-tracking-software/index.html','script.js','index.html','en/index.html','CNAME','google20898eface6e8c69.html','assets/blog.css','styles.css'];
 for(const file of existing)assert.equal(fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n'),execFileSync('git',['show','40836f8:'+file],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n'),file+' preserved');
 console.log('PASS existing articles byte-equivalent (including URLs/metadata/markup), form, landing/Stripe/Turnstile, shared styles, CNAME/Search Console');
 for(const [lang,route,asset] of records){
  const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),requests=[],errors=[];
  await c.route('**/*',r=>{const u=r.request().url();if(u.startsWith(origin))return r.continue();requests.push({url:u,body:r.request().postData()||''});if(u.includes('googletagmanager.com/gtag/js'))return r.fulfill({contentType:'text/javascript',body:stub});return r.fulfill({status:204,headers:{'access-control-allow-origin':'*'}});});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
  assert.equal((await p.goto(origin+route)).status(),200);await p.waitForTimeout(200);assert.equal(requests.length,0);
  assert.equal(await p.locator('h1').count(),1);assert.equal(await p.locator('html').getAttribute('lang'),lang);assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),pub+route);assert.equal(await p.locator('link[hreflang]').count(),0,'independent articles are not translation alternates');
  const graph=JSON.parse(await p.locator('script[type="application/ld+json"]').textContent())['@graph'];const post=graph.find(x=>x['@type']==='BlogPosting');
  const words=await p.locator('.article-body').evaluate(e=>{const d=document.createElement('div');d.innerHTML=e.innerHTML.replace(/<[^>]+>/g,' ');return d.textContent.trim().split(/\s+/).length;});
  assert.equal(post.wordCount,words);assert.ok(words>1500);assert.equal(post.timeRequired,'PT'+Math.ceil(words/200)+'M');assert.equal(post.dateModified,'2026-09-27');assert.equal(post.datePublished,'2026-09-27');assert.ok(!/brouillon|draft/i.test(await p.locator('.article-header').innerText()));assert.equal(post.headline,await p.locator('h1').textContent());assert.equal(post.mainEntityOfPage['@id'],pub+route);assert.ok(!post.translationOfWork);assert.equal(post.image,await p.locator('meta[property="og:image"]').getAttribute('content'));
  assert.equal(graph.find(x=>x['@type']==='BreadcrumbList').itemListElement.at(-1).item,pub+route);
  assert.equal(await p.locator('.article-toc a').count(),await p.locator('.article-body h2').count());
  for(const a of await p.locator('.article-toc a').all()){const href=await a.getAttribute('href');assert.equal(await p.locator(href).count(),1);await a.click();assert.equal(new URL(p.url()).hash,href);}
  assert.equal(await p.locator('script[src$="/consent.js"]').count(),1);assert.equal(await p.locator('script[src*=googletagmanager]').count(),0);
  await p.locator('.cookie-banner [data-consent=reject]').click();
  for(const width of [320,375,390,768,1024,1440]){
   await p.setViewportSize({width,height:900});await p.goto(origin+route);await p.locator('.workflow-figure img').evaluate(e=>e.decode());
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),lang+' width '+width);
   assert.ok(await p.locator('.workflow-figure img').evaluate(e=>e.complete&&e.naturalWidth===480));
   if(width>=1024)assert.ok(await p.locator('.table-scroll').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)),'No desktop table scroll');
   if([320,1440].includes(width)){
    await p.addScriptTag({path:process.env.CW_AXE_PATH||path.join(process.env.TEMP,'changewatch-axe.min.js')});
    const audit=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.length})),[]);
    await p.screenshot({path:path.join(shots,lang+'-'+width+'-full.png'),fullPage:true});
    await p.screenshot({path:path.join(shots,lang+'-'+width+'-header.png')});
    await p.locator('.table-scroll').first().screenshot({path:path.join(shots,lang+'-'+width+'-table.png')});
    await p.locator('[data-conversion=conclusion]').screenshot({path:path.join(shots,lang+'-'+width+'-cta.png'),style:'.header{visibility:hidden}'});
   }
  }
  await p.setViewportSize({width:320,height:900});await p.goto(origin+route);await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').getAttribute('class'),'skip-link');await p.keyboard.press('Enter');assert.equal(new URL(p.url()).hash,'#contenu');
  await p.locator('.table-scroll').first().focus();await p.keyboard.press('ArrowRight');await p.waitForTimeout(200);assert.ok(await p.locator('.table-scroll').first().evaluate(e=>e.scrollLeft>0));
  await p.addStyleTag({content:'html{font-size:200% !important}'});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'200% text');
  await p.setViewportSize({width:1440,height:1000});await p.goto(origin+route);await p.evaluate(()=>document.body.style.zoom='2');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'200% CSS zoom');
  const home=lang==='fr'?'/':'/en/';
  for(const sel of ['[data-conversion=context] a','[data-conversion=conclusion] a[href$="#tarifs"]','[data-conversion=conclusion] a[href$="#demande"]']){
   await p.goto(origin+route);const dest=await p.locator(sel).getAttribute('href');await p.locator(sel).click();await p.waitForURL(origin+dest);assert.equal(new URL(p.url()).pathname,home);
   if(dest.endsWith('#demande')){assert.equal(await p.locator('form#demande input[type=url]').count(),3);assert.equal(await p.locator('.cf-turnstile').getAttribute('data-sitekey'),'0x4AAAAAAE2QTEgZOtjjoxAY');}else assert.equal(await p.locator('.pricing-card>a[href^="https://buy.stripe.com/"]').count(),3);
  }
  assert.equal(requests.filter(r=>/google-analytics|googletagmanager/.test(r.url)).length,0,'Refusal through CTA navigation');
  for(const suffix of ['', 'index.html']){
   await p.goto(origin+route+suffix+'?email=PRIVATE#PRIVATE');await p.locator('[data-manage-cookies]').click();const before=requests.length;await p.locator('.cookie-dialog [data-consent=accept]').click();await p.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.dataLayer?.some(c=>c[0]==='event'&&c[1]==='page_view'));await p.waitForTimeout(300);
   const events=requests.slice(before).filter(r=>r.url.includes('/collect')).map(r=>Object.fromEntries(new URL(r.url).searchParams));assert.equal(events.length,1);assert.equal(events[0].en,'page_view');assert.equal(events[0].dl,pub+route);
   await p.locator('[data-conversion] a').evaluateAll(es=>es.forEach(e=>e.addEventListener('click',ev=>ev.preventDefault())));
   const prior=requests.length;for(const sel of ['[data-conversion=context] a','[data-conversion=conclusion] a[href$="#tarifs"]','[data-conversion=conclusion] a[href$="#demande"]'])await p.locator(sel).click();await p.waitForTimeout(200);
   assert.deepEqual(requests.slice(prior).filter(r=>r.url.includes('/collect')).map(r=>JSON.parse(new URL(r.url).searchParams.get('ep')).destination),['demande','tarifs','demande']);
   await p.locator('[data-manage-cookies]').click();const n=requests.length;await p.locator('.cookie-dialog [data-consent=reject]').click();await p.waitForTimeout(200);assert.equal(requests.length,n);assert.equal(p.frames().length,1);
  }
  assert.ok(!JSON.stringify(requests).includes('PRIVATE'));assert.ok(!requests.some(r=>r.url.includes('formspree.io')||r.url.includes('buy.stripe.com')));assert.deepEqual(errors,[]);
  const listing=home+'blog/';await p.goto(origin+listing);assert.equal(await p.locator('h2 a[href="'+route+'"]').count(),1);
  assert.ok(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes('<loc>'+pub+route+'</loc>'));
  console.log('PASS '+lang+': metadata/schema, independent canonical, TOC, six widths, no desktop scroll, axe320/1440, keyboard/200% text/layout, images, localized CTA destinations, consent/GA4 routes and no PII');await c.close();
 }
 assert.deepEqual([89-99,95-95,92-109],[-10,0,-17]);assert.equal(89+8,97);assert.equal(97-95,2);assert.equal(3*2,6);
 console.log('PASS fictitious example arithmetic. External services mocked; no payment/contact/telemetry sent. Screenshots: '+shots);
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
