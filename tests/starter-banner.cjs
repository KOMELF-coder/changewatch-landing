const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),origin='http://127.0.0.1:8831',out=path.join(root,'docs/starter-banner/screenshots');
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,origin).pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(8831,'127.0.0.1',r));fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [lang,route] of [['fr','/'],['en','/en/']]){
 const c=await b.newContext({reducedMotion:'reduce'}),external=[],errors=[];await c.route('https://**/*',r=>{external.push(r.request().url());return r.fulfill({status:204});});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+route);await p.locator('[data-consent=reject]').first().click();
 const title=lang==='fr'?'Essai gratuit Starter pendant 30 jours':'Starter free trial for 30 days',label=lang==='fr'?'Demander mon essai':'Request my trial',value=lang==='fr'?'Essai Starter 30 jours':'Starter 30-day free trial';
 assert.equal(await p.locator('.launch-banner strong').innerText(),title);assert.ok((await p.locator('.launch-banner a').innerText()).includes(label));assert.notEqual(await p.locator('.launch-banner a').getAttribute('data-starter-trial'),null);
 await p.locator('.skip-link').focus();assert.ok(await p.locator('.skip-link').evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'skip link above sticky stack');
 const pristine=execFileSync('git',['show','cde98b9:'+(lang==='fr'?'index.html':'en/index.html')],{cwd:root,encoding:'utf8'}),current=fs.readFileSync(path.join(root,lang==='fr'?'index.html':'en/index.html'),'utf8');
 for(const regex of [/<form id="demande"[\s\S]*?<\/form>/,/<div class="pricing-grid">[\s\S]*?<section data-reveal class="section container trial"/])assert.equal(current.match(regex)[0].replace(/\r\n/g,'\n'),pristine.match(regex)[0].replace(/\r\n/g,'\n'));
 for(const width of [320,375,390,768,1024,1440]){
 await p.setViewportSize({width,height:1000});await p.goto(origin+route);await p.waitForTimeout(100);const banner=p.locator('.launch-banner'),header=p.locator('.header');
 const mobileTitle=lang==='fr'?'30 jours gratuits sur Starter':'30 days free on Starter';
 assert.equal(await banner.locator('p>span').isVisible(),width>600);
 assert.equal(await banner.locator('strong').innerText(),width<=600?mobileTitle:title);
 assert.ok(await banner.locator('a').isVisible());
 const actualHeight=(await banner.boundingBox()).height,actualPixels=await p.locator('.sticky-top').screenshot();
 const baselineHtml=execFileSync('git',['show','13eba2b:'+(lang==='fr'?'index.html':'en/index.html')],{cwd:root});
 const baselineCss=execFileSync('git',['show','13eba2b:assets/launch-offer.css'],{cwd:root});
 await p.route(origin+route,r=>r.fulfill({contentType:'text/html;charset=utf-8',body:baselineHtml}));
 await p.route('**/assets/launch-offer.css',r=>r.fulfill({contentType:'text/css',body:baselineCss}));
 await p.goto(origin+route);await p.waitForTimeout(100);const beforeHeight=(await banner.boundingBox()).height;
 if(width>600)assert.ok(actualPixels.equals(await p.locator('.sticky-top').screenshot()),'tablet/desktop pixel-identical '+lang+width);
 else {assert.ok(actualHeight<beforeHeight);assert.ok(actualHeight>=55&&actualHeight<=70);console.log(lang+' '+width+'px: banner '+beforeHeight+' → '+actualHeight+'px');}
 await p.unroute(origin+route);await p.unroute('**/assets/launch-offer.css');await p.goto(origin+route);await p.waitForTimeout(100);
 const check=async()=>{const a=await banner.boundingBox(),h=await header.boundingBox();assert.ok(a.y>=-1&&a.y+a.height<=1000);assert.ok(h.y>=a.y+a.height-1);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await banner.locator('p').evaluate(e=>e.scrollWidth<=e.clientWidth));assert.ok(await banner.locator('a').evaluate(e=>e.scrollWidth<=e.clientWidth));};await check();
 if([320,1440].includes(width))await p.screenshot({path:path.join(out,`${lang}-${width}-top.png`)});
 await p.evaluate(()=>scrollTo(0,2500));await check();assert.ok(Math.abs((await banner.boundingBox()).y)<1);
 if([320,1440].includes(width))await p.screenshot({path:path.join(out,`${lang}-${width}-scroll.png`)});
 await banner.locator('a').focus();assert.ok(await banner.locator('a').evaluate(e=>e.matches(':focus-visible')));assert.ok((await banner.locator('a').boundingBox()).height>=44);await p.keyboard.press('Enter');await p.waitForTimeout(100);assert.equal(await p.locator('#request-type').inputValue(),value);
 const bottom=(await p.locator('.sticky-top').boundingBox()).height;assert.ok((await p.locator('#demande').boundingBox()).y>=bottom-1,'form clear '+lang+width);assert.ok((await p.locator('#request-type').boundingBox()).y<1000,'request visible');assert.equal(await p.locator('#name').inputValue(),'');
 for(const id of ['tarifs','fonctionnement','alertes','faq']){await p.locator('a[href="#'+id+'"]').first().evaluate(e=>e.click());await p.waitForTimeout(100);assert.ok((await p.locator('#'+id).boundingBox()).y>=(await p.locator('.sticky-top').boundingBox()).height-1,id+' anchor clear '+width);}
 if(width<=800){await p.locator('.menu-toggle').click();await p.locator('#navigation a[href="#tarifs"]').first().click();await p.waitForTimeout(100);assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'false');assert.ok((await p.locator('#tarifs').boundingBox()).y>=(await p.locator('.sticky-top').boundingBox()).height-1);}
 }
 await p.setViewportSize({width:1440,height:1000});await p.goto(origin+route);await p.evaluate(()=>document.body.style.zoom='2');await p.waitForTimeout(100);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.locator('.launch-banner a').click();await p.waitForTimeout(100);assert.ok((await p.locator('#demande').boundingBox()).y>=(await p.locator('.sticky-top').boundingBox()).height-1);
 await p.evaluate(()=>document.body.style.zoom='1');await p.addScriptTag({path:process.env.CW_AXE_PATH});assert.deepEqual((await p.evaluate(()=>axe.run(document.querySelector('.sticky-top')))).violations.map(v=>v.id),[]);
 assert.equal(external.filter(u=>/google|formspree|buy.stripe/.test(u)).length,0);await p.locator('[data-manage-cookies]').click();await p.locator('.cookie-dialog [data-consent=accept]').click();await p.waitForTimeout(250);const frame=p.frames().find(f=>f.url().includes('analytics-frame.html'));await p.locator('.launch-banner a').click();const events=await frame.evaluate(()=>dataLayer.map(c=>Array.from(c)).filter(c=>c[0]==='event'));
 assert.deepEqual(events.filter(c=>c[1]==='free_trial_click').map(c=>c[2]),[{send_to:'G-RB6NSRRM9L',plan:'starter',destination:'demande'}]);assert.equal(events.filter(c=>c[1]==='commercial_cta_click').length,1);assert.ok(!JSON.stringify(events).match(/request_type|competitor_url|email|optional_message/));assert.deepEqual(errors,[]);await c.close();console.log('PASS '+lang+': banner copy, natural sticky stack, six widths, mobile compact copy/height, tablet/desktop pixel-identical, anchors/form/menu, keyboard, 200% CSS zoom, axe, refusal and fixed GA4 trial event; unchanged pricing/form');
 }
}finally{await b.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
