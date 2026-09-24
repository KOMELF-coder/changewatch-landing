const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),origin='http://127.0.0.1:8784';
const shots=process.env.CW_COMMENTS_SHOTS||path.join(process.env.TEMP,'cw-blog-comments-shots');
const routes=['/blog/veille-concurrentielle-ecommerce/','/blog/etude-de-concurrence/','/blog/veille-concurrentielle-exemple/','/en/blog/ecommerce-competitor-monitoring/','/en/blog/competitor-price-analysis/','/en/blog/price-tracking-software/'];
const endpoint='https://isobceqeaiwsxndqxqas.supabase.co/rest/v1/rpc/';
const key='sb_publishable_L3nGfR6XoeU1NSA1pabmpw_22N3lkZl';
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,origin).pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!f.startsWith(root)||!fs.existsSync(f)){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.csv':'text/csv'})[path.extname(f)]||'text/plain');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(8784,'127.0.0.1',r));fs.mkdirSync(shots,{recursive:true});const browser=await chromium.launch({headless:true,channel:'msedge'});try{
for(const [index,route] of routes.entries()){
 const en=index>=3,slug=route.split('/').filter(Boolean).at(-1),ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),requests=[],errors=[];
 let readMode='hold',writeMode='success',releaseRead,releaseWrite;
 const rows=[{id:1,article_slug:slug,name:'<img src=x onerror=alert(1)>',comment:'<script>alert(1)</script> **plain**\nhttps://example.test',created_at:'2026-09-24T10:00:00Z',email:'NEVER_RENDER@example.test',status:'NEVER_RENDER_STATUS'},{id:2,article_slug:'other-article',name:'Wrong article',comment:'Other',created_at:'2026-09-24T11:00:00Z'}];
 await ctx.route('**/*',async r=>{
  const req=r.request(),url=req.url();if(url.startsWith(origin))return r.continue();
  requests.push({url,body:req.postData(),headers:req.headers()});
  if(url.startsWith(endpoint+'get_approved_comments')){
   if(readMode==='hold')await new Promise(resolve=>releaseRead=resolve);
   if(readMode==='error')return r.fulfill({status:404,contentType:'application/json',body:'{"message":"PRIVATE_BACKEND_DETAIL"}'});
   let data=readMode==='empty'?[]:rows;
   if(readMode==='pages'){const offset=Number(new URL(url).searchParams.get('offset'));data=Array.from({length:offset===0?51:1},(_,i)=>({id:offset+i+1,article_slug:slug,name:'Reader '+(offset+i+1),comment:'Useful comment',created_at:'2026-09-24T10:00:00Z'}));}
   return r.fulfill({contentType:'application/json',body:JSON.stringify(data)});
  }
  if(url===endpoint+'submit_blog_comment'){
   if(writeMode==='hold')await new Promise(resolve=>releaseWrite=resolve);
   if(writeMode==='network')return r.abort('failed');
   return r.fulfill({status:writeMode==='error'?400:204,contentType:'application/json',body:writeMode==='error'?'{"message":"PRIVATE_BACKEND_DETAIL"}':''});
  }
  return r.fulfill({status:204}); // No external telemetry, Formspree, Stripe or real Supabase writes.
 });
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+route);await p.waitForTimeout(150);
 assert.equal(requests.length,0,'lazy load: no external requests at article top');
 assert.equal(await p.locator('[data-comments]').count(),1);assert.equal(await p.locator('[data-comments]').getAttribute('data-article-slug'),slug);
 await p.locator('.cookie-banner [data-consent=reject]').click();await p.locator('[data-comments]').scrollIntoViewIfNeeded();
 await p.waitForFunction(()=>document.querySelector('.comments-form'));
 assert.match(await p.locator('.comments-status').textContent(),en?/Loading/:/Chargement/);assert.ok(await p.locator('.comments-form [type=submit]').isDisabled());
 await p.waitForFunction(()=>document.querySelector('.comments-form'));while(!releaseRead)await p.waitForTimeout(10);readMode='rows';releaseRead();
 await p.waitForFunction(()=>!document.querySelector('.comments-form [type=submit]').disabled);
 assert.equal(await p.locator('.comments-item').count(),1);assert.equal(await p.locator('.comments-text').textContent(),rows[0].comment);
 assert.equal(await p.locator('.comments-list img,.comments-list script,.comments-list a').count(),0);assert.ok(!(await p.locator('.comments-list').textContent()).includes('NEVER_RENDER'));
 assert.equal(await p.locator('.comments-form a').getAttribute('href'),en?'/en/privacy.html':'/confidentialite.html');
 const form=p.locator('.comments-form'),send=form.locator('[type=submit]');
 await send.click();assert.equal(await form.locator('[aria-invalid=true]').count(),3);assert.equal(await p.locator(':focus').getAttribute('name'),'name');
 assert.equal(await form.locator('[name=website]').isVisible(),false);assert.equal(await form.locator('[name=website]').getAttribute('tabindex'),'-1');
 await form.locator('[name=name]').fill('  Jane Doe  ');await form.locator('[name=email]').fill('invalid');await form.locator('[name=comment]').fill('x');await send.click();assert.equal(await p.locator(':focus').getAttribute('name'),'email');
 await form.locator('[name=email]').fill('jane@example.test');await form.locator('[name=comment]').fill('  This is a useful question.  ');
 await form.locator('[name=name]').evaluate(e=>e.value='N'.repeat(81));await send.click();assert.equal(await p.locator(':focus').getAttribute('name'),'name');await form.locator('[name=name]').fill('  Jane Doe  ');
 await form.locator('[name=website]').evaluate(e=>e.value='spam.example');await send.click();assert.equal(requests.filter(r=>r.url===endpoint+'submit_blog_comment').length,0);await form.locator('[name=website]').evaluate(e=>e.value='');
 await p.waitForTimeout(2100);writeMode='hold';await send.click();while(!releaseWrite)await p.waitForTimeout(10);assert.ok(await send.isDisabled());await form.evaluate(f=>f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));assert.equal(requests.filter(r=>r.url===endpoint+'submit_blog_comment').length,1);
 writeMode='success';releaseWrite();await p.waitForFunction(()=>!document.querySelector('.comments-form [type=submit]').disabled);
 assert.equal(await form.locator('[name=name]').inputValue(),'');assert.match(await form.locator('.comments-feedback').textContent(),en?/after moderation/:/après modération/);assert.equal(await p.locator('.comments-item').count(),1);
 const sent=JSON.parse(requests.find(r=>r.url===endpoint+'submit_blog_comment').body);assert.deepEqual(sent,{p_article_slug:slug,p_name:'Jane Doe',p_email:'jane@example.test',p_comment:'This is a useful question.',p_website:''});assert.ok(!('status' in sent));
 await form.locator('[name=name]').fill('Jane');await form.locator('[name=email]').fill('jane@example.test');await form.locator('[name=comment]').fill('Keep this draft');await send.click();assert.match(await form.locator('.comments-feedback').textContent(),en?/wait a few/:/patienter/);assert.equal(requests.filter(r=>r.url===endpoint+'submit_blog_comment').length,1);
 await p.waitForTimeout(2100);
 for(const mode of ['error','network']){writeMode=mode;await send.click();await p.waitForFunction(()=>!document.querySelector('.comments-form [type=submit]').disabled);assert.equal(await form.locator('[name=comment]').inputValue(),'Keep this draft');assert.ok(!(await p.locator('[data-comments]').textContent()).includes('PRIVATE_BACKEND_DETAIL'));}
 for(const width of [320,375,1024,1440]){
  await p.setViewportSize({width,height:1000});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if([0,3].includes(index)){await p.locator('[data-comments]').screenshot({path:path.join(shots,(en?'en':'fr')+'-'+width+'.png'),style:'.header,.skip-link{visibility:hidden}'});}
  if([320,1440].includes(width)){await p.addScriptTag({path:process.env.CW_AXE_PATH});const audit=await p.evaluate(()=>axe.run(document.querySelector('[data-comments]'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);}
 }
 await p.setViewportSize({width:320,height:1000});await form.locator('[name=name]').focus();await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').getAttribute('name'),'email');await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').getAttribute('name'),'comment');await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').getAttribute('type'),'submit');assert.notEqual(await send.evaluate(e=>getComputedStyle(e).outlineStyle),'none');
 await p.addStyleTag({content:'html{font-size:200%!important}'});
 assert.ok(await p.locator('[data-comments]').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Comments fit at 320px / 200% text');
 const zoomWidth=await p.evaluate(()=>document.documentElement.scrollWidth);
 if(zoomWidth>321){await p.locator('[data-comments]').evaluate(e=>e.remove());assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),zoomWidth,'Overflow also exists without comments');console.log('NOTE '+slug+': existing editorial text overflows at 320px / 200% text; comments do not add overflow');}
 for(const req of requests){assert.ok(req.url.startsWith(endpoint),'No analytics or unrelated external calls');assert.equal(req.headers.apikey,key);assert.equal(req.headers.authorization,undefined);assert.equal(req.headers.referer,undefined);if(req.url.includes('get_approved_comments'))assert.deepEqual(JSON.parse(req.body),{p_article_slug:slug});}
 // Fail closed if RPC is absent; retry, empty state and paginated loading.
 readMode='error';await p.reload();await p.locator('[data-comments]').scrollIntoViewIfNeeded();await p.waitForSelector('.comments-form');await p.waitForFunction(()=>!document.querySelector('[data-comments] > button:last-of-type').hidden);assert.ok(await p.locator('.comments-form [type=submit]').isDisabled());
 readMode='empty';await p.getByRole('button',{name:en?'Try again':'Réessayer',exact:true}).click();await p.waitForFunction(()=>!document.querySelector('.comments-form [type=submit]').disabled);assert.match(await p.locator('.comments-status').textContent(),en?/No comments yet/:/Aucun commentaire/);
 readMode='pages';await p.reload();await p.locator('[data-comments]').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelectorAll('.comments-item').length===50);await p.getByRole('button',{name:en?'Load more comments':'Afficher les commentaires suivants'}).click();await p.waitForFunction(()=>document.querySelectorAll('.comments-item').length===51);
 assert.deepEqual(errors,[]);await ctx.close();console.log('PASS '+slug+': lazy loading, private-field exclusion, plain text, validation, honeypot, pending UX, success/errors/double-submit, pagination, responsive/axe/keyboard/200%');
}
const nojs=await browser.newContext({javaScriptEnabled:false});const p=await nojs.newPage();for(const route of routes){await p.goto(origin+route);assert.equal(await p.locator('[data-comments] noscript').count(),1);assert.equal(await p.locator('h1').count(),1)}await nojs.close();console.log('PASS six no-JS articles; all APIs mocked, no production writes. Screenshots: '+shots);
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
