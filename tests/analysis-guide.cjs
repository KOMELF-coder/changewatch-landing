const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),origin='http://127.0.0.1:8774',pub='https://changewatch.cybersignal.fr';
const routes=['/blog/etude-de-concurrence/','/en/blog/competitor-price-analysis/'];
const shots=process.env.CW_SCREENSHOT_DIR||path.join(process.env.TEMP||'/tmp','cw-independent-shots');
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,origin).pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.csv':'text/csv; charset=utf-8'})[path.extname(f)]||'text/plain');res.end(fs.readFileSync(f));});
const stub=`let config;function record(c){if(window['ga-disable-G-RB6NSRRM9L'])return;if(c[0]==='config'){config=c[2];document.cookie='_ga=test;path=/';}if(c[0]==='event')fetch('https://www.google-analytics.com/g/collect?'+new URLSearchParams({en:c[1],dl:config.page_location,ep:JSON.stringify(c[2]||{})}));}dataLayer.forEach(record);dataLayer.push=(...cs)=>{cs.forEach(record);return Array.prototype.push.apply(dataLayer,cs)};`;
async function main(){await new Promise(r=>server.listen(8774,'127.0.0.1',r));fs.mkdirSync(shots,{recursive:true});const b=await chromium.launch({headless:true,channel:'msedge'});try{
for(const [i,route] of routes.entries()){
 const lang=i?'en':'fr',requests=[],errors=[],c=await b.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await c.route('**/*',r=>{const u=r.request().url();if(u.startsWith(origin))return r.continue();requests.push(u);if(u.includes('googletagmanager.com'))return r.fulfill({contentType:'text/javascript',body:stub});return r.fulfill({status:204,headers:{'access-control-allow-origin':'*'}});});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));const ga=()=>requests.filter(u=>/google-analytics|googletagmanager/.test(u));
 assert.equal((await p.goto(origin+route)).status(),200);await p.waitForTimeout(150);assert.equal(ga().length,0);
 assert.equal(await p.locator('html').getAttribute('lang'),lang);assert.equal(await p.locator('h1').count(),1);assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),pub+route);assert.equal(await p.locator('meta[name=robots][content*=noindex]').count(),0);
 assert.equal(await p.locator('link[hreflang]').count(),0);
 const graph=JSON.parse(await p.locator('script[type="application/ld+json"]').textContent())['@graph'],post=graph.find(x=>x['@type']==='BlogPosting');
 const words=await p.locator('.article-body').evaluate(e=>{const d=document.createElement('div');d.innerHTML=e.innerHTML.replace(/<[^>]+>/g,' ');return d.textContent.trim().split(/\s+/).length;});
 assert.equal(post.wordCount,words);assert.equal(post.timeRequired,'PT'+Math.ceil(words/200)+'M');assert.equal(post.headline,await p.locator('h1').textContent());assert.equal(post.mainEntityOfPage['@id'],pub+route);assert.equal(post.datePublished,'2026-09-21');assert.equal(post.dateModified,'2026-09-21');assert.equal(await p.locator('meta[property="article:published_time"]').getAttribute('content'),'2026-09-21');assert.equal(post.image,await p.locator('meta[property="og:image"]').getAttribute('content'));assert.ok(!post.translationOfWork);assert.ok(!/Brouillon|Draft/.test(await p.locator('main').textContent()));
 assert.equal(await p.locator('.article-body h2').count(),7);assert.equal(await p.locator('.article-toc a').count(),7);
 for(const a of await p.locator('.article-toc a').all()){const id=await a.getAttribute('href');assert.equal(await p.locator(id).count(),1);await a.click();assert.equal(new URL(p.url()).hash,id);}
 if(i){const rows=await p.locator('.analysis-data tbody tr').evaluateAll(es=>es.map(e=>({sku:e.dataset.sku,price:+e.dataset.price,discount:+e.dataset.discount,shipping:+e.dataset.shipping,total:+e.dataset.total,displayed:e.querySelector('td:nth-child(6)').textContent})));assert.equal(rows.length,8);
 for(const r of rows){assert.equal(r.price*(1-r.discount/100)+r.shipping,r.total);assert.ok(r.displayed.includes(String(r.total)));}
 assert.deepEqual(rows.map(r=>r.total),[35,36,32,34,65,66,64,62]);
 for(const [offset,median,gap] of [[0,34,'2.94'],[4,64,'1.56']]){const others=rows.slice(offset+1,offset+4).map(r=>r.total).sort((a,b)=>a-b);assert.equal(others[1],median);assert.equal(((rows[offset].total-median)/median*100).toFixed(2),gap);assert.ok((await p.locator('.article-body').textContent()).includes(lang==='fr'?gap.replace('.',','):gap));}
 }else{assert.equal(await p.locator('.strategy-data tbody tr').count(),7);for(const v of ['35 €','30 €','32 €','22 €'])assert.ok((await p.locator('.strategy-data').textContent()).includes(v));assert.deepEqual([30+5,24+6,32+0,18+4],[35,30,32,22]);}
 const download=p.locator('a[download]');const d=await p.request.get(origin+await download.getAttribute('href'));assert.equal(d.status(),200);assert.equal((await d.text()).trim().split('\n')[0].split(',').length,i?29:26);
 await p.locator('.cookie-banner [data-consent=reject]').click();
 for(const width of [320,375,390,768,1024,1440]){
  await p.setViewportSize({width,height:900});await p.goto(origin+route);await p.locator('.analysis-figure').scrollIntoViewIfNeeded();await p.locator('.analysis-figure img').evaluate(img=>img.decode());await p.evaluate(()=>scrollTo(0,0));
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang} overflow ${width}`);
  assert.ok(await p.locator('.analysis-figure img').evaluate(e=>e.complete&&e.naturalWidth===440));
  if([375,390,1440].includes(width)){await p.screenshot({path:path.join(shots,lang+'-'+width+'.png'),fullPage:true});await p.screenshot({path:path.join(shots,lang+'-'+width+'-header.png')});await p.locator('.analysis-figure').screenshot({path:path.join(shots,lang+'-'+width+'-diagram.png')});await p.locator('[data-conversion=conclusion]').screenshot({path:path.join(shots,lang+'-'+width+'-cta.png')});}
  if([320,1440].includes(width)){await p.addScriptTag({path:process.env.CW_AXE_PATH||path.join(process.env.TEMP,'changewatch-axe.min.js')});const audit=await p.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.length})),[]);}
 }
 await p.setViewportSize({width:320,height:900});await p.goto(origin+route);await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').getAttribute('class'),'skip-link');await p.keyboard.press('Enter');assert.equal(new URL(p.url()).hash,'#contenu');
 const table=p.locator('.table-scroll');await table.focus();await p.keyboard.press('ArrowRight');await p.waitForTimeout(100);assert.ok(await table.evaluate(e=>e.scrollLeft>0));
 await p.addStyleTag({content:'html{font-size:200% !important}'});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'200% text');await p.screenshot({path:path.join(shots,lang+'-320-text200.png'),fullPage:true});
 await p.setViewportSize({width:1440,height:1000});await p.goto(origin+route);await p.evaluate(()=>{document.body.style.zoom='2'});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'200% CSS layout zoom');
 await p.goto(origin+route);await p.locator('.language-switch a[lang='+(['en','fr'][i])+']').click();await p.waitForURL(origin+(i?'/':'/en/'));assert.equal(ga().length,0);
 // Context + conclusion CTAs reach the correct localized form and pricing; never submit.
 await p.setViewportSize({width:390,height:900});await p.goto(origin+route);
 assert.equal(await p.locator('[data-conversion=context]').count(),1);assert.equal(await p.locator('[data-conversion=conclusion]').count(),1);
 const home=i?'/en/':'/';
 for(const selector of ['[data-conversion=context] .button','[data-conversion=conclusion] a[href$="#demande"]','[data-conversion=conclusion] a[href$="#tarifs"]']){
  await p.goto(origin+route);const link=p.locator(selector);const dest=await link.getAttribute('href');await link.click();await p.waitForURL(origin+dest);assert.equal(new URL(p.url()).pathname,home);
  if(dest.endsWith('#demande')){assert.equal(await p.locator('form#demande').count(),1);assert.equal(await p.locator('#demande input[type=url]').count(),3);assert.equal(await p.locator('.cf-turnstile').getAttribute('data-sitekey'),'0x4AAAAAAE2QTEgZOtjjoxAY');}
  else{assert.deepEqual(await p.locator('.pricing-card>a[href^="https://buy.stripe.com/"]').evaluateAll(es=>es.map(e=>e.href)),['https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02','https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03','https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04']);}
 }
 // Both canonical and explicit index aliases sanitize queries and emit one mocked page_view per document.
 for(const suffix of ['', 'index.html']){
  await p.goto(origin+route+suffix+'?email=private%40example.org#private');await p.locator('[data-manage-cookies]').click();const before=ga().filter(u=>u.includes('/collect')).length;await p.locator('.cookie-dialog [data-consent=accept]').click();
  await p.waitForFunction(()=>!!document.querySelector('iframe[title]')?.contentWindow.dataLayer?.some(x=>x[0]==='event'&&x[1]==='page_view'));
  await p.waitForTimeout(200);const events=ga().filter(u=>u.includes('/collect'));assert.equal(events.length,before+1);const event=new URL(events.at(-1));assert.equal(event.searchParams.get('dl'),pub+route);assert.equal(event.searchParams.get('en'),'page_view');assert.ok(!events.at(-1).includes('private'));
  await p.locator('[data-conversion] a').evaluateAll(es=>es.forEach(e=>e.addEventListener('click',ev=>ev.preventDefault())));
  const ctaBefore=ga().filter(u=>u.includes('en=commercial_cta_click')).length;
  for(const sel of ['[data-conversion=context] a','[data-conversion=conclusion] a[href$="#demande"]','[data-conversion=conclusion] a[href$="#tarifs"]'])await p.locator(sel).click();
  await p.waitForTimeout(500);const clicks=ga().filter(u=>u.includes('en=commercial_cta_click')).slice(ctaBefore);assert.equal(clicks.length,3);assert.deepEqual(clicks.map(u=>JSON.parse(new URL(u).searchParams.get('ep')).destination),['demande','demande','tarifs']);assert.ok(!ga().some(u=>u.includes('en=purchase')));

  await p.locator('[data-manage-cookies]').click();await p.locator('.cookie-dialog [data-consent=reject]').click();const count=ga().length;await p.reload();await p.waitForTimeout(100);assert.equal(ga().length,count);assert.equal((await c.cookies()).filter(x=>x.name.startsWith('_ga')).length,0);
 }
 assert.deepEqual(errors,[]);assert.ok(!requests.some(u=>u.includes('formspree.io')||u.includes('buy.stripe.com')));await c.close();
 console.log('PASS '+lang+': independent metadata/schema and publication dates, arithmetic/matrix, anchors, localized CSV, six widths, axe320/1440, keyboard, 200% text/layout, language switch, consent/route privacy (mock GA)');
}
const c=await b.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const p=await c.newPage();for(const route of routes){await p.goto(origin+route);assert.equal(await p.locator('h1').count(),1);await p.locator('.article-toc a').last().click();assert.equal(new URL(p.url()).hash,'#synthese');assert.ok(await p.locator('a[download]').isVisible());assert.ok(await p.locator('.language-switch').isVisible());}await c.close();console.log('PASS both articles without JavaScript; screenshots '+shots);
}finally{await b.close();server.close();}}main().catch(e=>{console.error(e);process.exitCode=1;server.close();});
