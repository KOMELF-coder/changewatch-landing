const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),origin='http://127.0.0.1:8772',publicOrigin='https://changewatch.cybersignal.fr';
const pairs=[['/blog/','/en/blog/'],['/blog/veille-concurrentielle-ecommerce/','/en/blog/ecommerce-competitor-monitoring/']];
const promo='https://buy.stripe.com/dRm3cu78w4TdbNMdFs4gg05?prefilled_promo_code=CWBUSINESS3MOIS';
const standard=['https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02','https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03','https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04'];
const shots=process.env.CW_SCREENSHOT_DIR||path.join(process.env.TEMP||'/tmp','cw-blog-after');
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,origin).pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'text/plain');res.end(fs.readFileSync(f));});
const stub=`let config;function record(c){if(window['ga-disable-G-RB6NSRRM9L'])return;if(c[0]==='config'){config=c[2];document.cookie='_ga=test;path=/';}if(c[0]==='event')fetch('https://www.google-analytics.com/g/collect?'+new URLSearchParams({en:c[1],dl:config.page_location,ep:JSON.stringify(c[2]||{})}));}dataLayer.forEach(record);dataLayer.push=(...cs)=>{cs.forEach(record);return Array.prototype.push.apply(dataLayer,cs)};`;
async function main(){await new Promise(r=>server.listen(8772,'127.0.0.1',r));fs.mkdirSync(shots,{recursive:true});const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const context=await browser.newContext({reducedMotion:'reduce'}),requests=[],errors=[];
 await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin===origin)return r.continue();requests.push(u.href);if(u.hostname==='www.googletagmanager.com')return r.fulfill({contentType:'text/javascript',body:stub});return r.fulfill({status:204,headers:{'access-control-allow-origin':'*'}});});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const ga=()=>requests.filter(u=>/google-analytics|googletagmanager/.test(u)),events=()=>requests.filter(u=>u.includes('/collect')).map(u=>Object.fromEntries(new URL(u).searchParams));
 const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'),routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 assert.equal(new Set(routes).size,routes.length);for(const route of pairs.flat())assert.ok(routes.includes(route));
 for(const route of routes){assert.equal((await page.goto(origin+route)).status(),200);assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),publicOrigin+route);
  const links=await page.locator('[href],[src],[srcset]').evaluateAll(es=>es.flatMap(e=>['href','src','srcset'].map(a=>e.getAttribute(a)).filter(Boolean)).filter(v=>!v.startsWith('mailto:')));
  for(const link of new Set(links)){const u=new URL(link,origin+route);if(![origin,publicOrigin].includes(u.origin))continue;const response=await page.request.get(origin+u.pathname);assert.equal(response.status(),200,route+' → '+link);if(u.hash&&u.hash!=='#'){const text=await response.text();assert.ok(text.includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),link);}}
 }
 console.log('PASS all 12 sitemap pages: canonical, all local resources/links/anchors, original French URLs');
 for(const [fr,en] of pairs)for(const route of [fr,en]){
  await page.goto(origin+route);if(await page.locator('.cookie-banner').isVisible())await page.locator('.cookie-banner [data-consent=reject]').click();
  for(const [lang,url] of [['fr',fr],['en',en],['x-default',fr]])assert.equal(await page.locator(`link[hreflang="${lang}"]`).getAttribute('href'),publicOrigin+url);
  assert.equal(await page.locator('h1').count(),1);assert.ok((await page.title()).length<90);assert.ok((await page.locator('meta[name=description]').getAttribute('content')).length>80);
  for(const width of [320,375,390,768,1024,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' '+width);}
  await page.locator('.language-switch a[lang="'+(route===fr?'en':'fr')+'"]').focus();await page.keyboard.press('Enter');await page.waitForURL(origin+(route===fr?en:fr));
  {await page.goto(origin+route);await page.addScriptTag({path:process.env.CW_AXE_PATH});assert.deepEqual((await page.evaluate(()=>axe.run())).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);}
 }
 assert.equal(ga().length,0);
 const article=pairs[1][1];await page.goto(origin+article);
 const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
 const post=schema.find(x=>x['@type']==='BlogPosting');assert.equal(post.mainEntityOfPage['@id'],publicOrigin+article);assert.equal(post.inLanguage,'en-GB');assert.equal(post.translationOfWork['@id'],publicOrigin+pairs[1][0]+'#article');assert.equal(post.headline,await page.locator('h1').innerText());
 const wordCount=await page.locator('.article-body').evaluate(e=>{const d=document.createElement('div');d.innerHTML=e.innerHTML.replace(/<[^>]+>/g,' ');return d.textContent.trim().split(/\s+/).length;});assert.equal(post.wordCount,wordCount);assert.equal(post.timeRequired,'PT'+Math.ceil(wordCount/200)+'M');assert.equal(await page.locator('.article-body h2').count(),8);assert.ok(wordCount>1300);
 assert.deepEqual(schema[1].itemListElement.map(x=>x.item),[publicOrigin+'/en/',publicOrigin+'/en/blog/',publicOrigin+article]);
 for(const img of await page.locator('.article-figure img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());assert.ok(await img.evaluate(e=>e.complete&&e.naturalWidth>0));}
 // SVG labels must fit inside their original canvas after translation.
 for(const asset of ['price-context','price-context-mobile','monitoring-flow','monitoring-flow-mobile']){await page.goto(origin+'/assets/'+asset+'-en.svg');assert.deepEqual(await page.locator('text').evaluateAll(es=>es.filter(e=>{const b=e.getBBox();return b.x<0||b.x+b.width>e.ownerSVGElement.viewBox.baseVal.width;}).map(e=>e.textContent)),[]);}
 console.log('PASS reciprocal language switches, English axe audits, full translated article/schema/word count, four local SVGs');
 for(const [route,lang] of [['/','fr'],['/en/','en']]){await page.goto(origin+route);assert.equal(await page.locator('#navigation a[href$="blog/"]').getAttribute('href'),lang==='fr'?'blog/':'/en/blog/');
  assert.deepEqual(await page.locator('.pricing-card>a[href^="https://buy.stripe.com/"]').evaluateAll(es=>es.map(e=>e.href)),standard);
  assert.equal(await page.locator('#business-offer a').getAttribute('href'),promo);assert.equal(await page.locator('a[href^="https://buy.stripe.com/"]').count(),4);
  const offer=await page.locator('#business-offer').innerText(),banner=await page.locator('.launch-banner').innerText();for(const text of [offer,banner]){assert.match(text,lang==='fr'?/14,90.*3 mois, puis 29,90.*4e mois/:/14.90.*3 months, then.*29.90.*month 4/);assert.match(text,lang==='fr'?/Nouveaux clients uniquement/:/New customers only/);}
  assert.match(offer,/CWBUSINESS3MOIS/);assert.match(offer,/45/);assert.equal((2990-1490)*3,4500);
  await page.locator('.launch-banner a').click();assert.equal(new URL(page.url()).hash,'#business-offer');await page.locator('#business-offer a').focus();assert.ok(await page.locator('#business-offer a').evaluate(e=>document.activeElement===e));
  for(const width of [320,375,390,768,1024,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'promo '+lang+width);}
  for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.goto(origin+route);await page.screenshot({path:path.join(shots,`${lang}-home-${width}.png`)});await page.locator('.pricing-card.featured').screenshot({path:path.join(shots,`${lang}-business-${width}.png`)});}
  await page.setViewportSize({width:1024,height:900});await page.addStyleTag({content:'html{font-size:200%}'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 for(const [name,route] of [['en-blog',pairs[0][1]],['en-article',article]])for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.goto(origin+route);for(const img of await page.locator("img[loading=lazy]").all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(shots,`${name}-${width}.png`),fullPage:true});}
 // New routes must send their canonical path only, and only with consent.
 for(const route of ['/en/blog/',article]){await page.goto(origin+route+'?email=PRIVATE#PRIVATE');assert.equal(ga().length,0);}
 await page.locator('[data-manage-cookies]').click();await page.locator('.cookie-dialog [data-consent=accept]').click();await page.waitForTimeout(400);assert.equal(events().filter(e=>e.en==='page_view').length,1);assert.equal(events()[0].dl,publicOrigin+article);
 await page.goto(origin+'/en/blog/');await page.waitForTimeout(400);assert.equal(events().at(-1).dl,publicOrigin+'/en/blog/');assert.equal(events().filter(e=>e.en==='page_view').length,2);
 await page.goto(origin+'/en/');await page.waitForTimeout(400);await page.locator('#business-offer a').evaluate(e=>e.addEventListener('click',ev=>ev.preventDefault()));await page.locator('#business-offer a').click();await page.waitForTimeout(300);assert.deepEqual(events().filter(e=>e.en==='stripe_click').map(e=>JSON.parse(e.ep)),[{plan:'Business'}]);assert.ok(!events().some(e=>e.en==='purchase'));assert.ok(!ga().join('').includes('PRIVATE'));
 await page.locator('[data-manage-cookies]').click();await page.locator('.cookie-dialog [data-consent=reject]').click();const count=ga().length;await page.goto(origin+article);await page.waitForTimeout(300);assert.equal(ga().length,count);assert.equal((await context.cookies()).filter(c=>c.name.startsWith('_ga')).length,0);assert.ok(!requests.some(u=>u.includes('formspree.io')));
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});await nojs.route('https://**/*',r=>r.fulfill({status:204}));const np=await nojs.newPage();for(const route of ['/','/en/']){await np.goto(origin+route);assert.ok(await np.locator('.launch-banner').isVisible());await np.locator('.launch-banner a').click();assert.ok(await np.locator('#business-offer').isVisible());assert.equal(await np.locator('#business-offer a').getAttribute('href'),promo);}
 await np.goto(origin+pairs[1][0]);await np.locator('.language-switch a[lang=en]').click();await np.waitForURL(origin+article);assert.ok(await np.locator('h1').isVisible());assert.ok(await np.locator('.article-toc a').count()===8);await nojs.close();assert.deepEqual(errors,[]);
 console.log('PASS exact standard/promo links and conditions, six widths, 200% text, no-JS, no-consent/refusal/new canonical GA routes/promo stripe_click/withdrawal (mocked external services)');console.log('Screenshots: '+shots);
}finally{await browser.close();server.close();}}
main().catch(e=>{console.error(e);process.exitCode=1;server.close();});
