const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if (!file.startsWith(path.normalize(root)) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type', mime[path.extname(file)] || 'text/plain');
  res.end(fs.readFileSync(file));
});
async function fill(page) {
  await page.locator('#name').fill('Test QA');await page.locator('#company').fill('Test seulement');await page.locator('#email').fill('qa@example.org');
  for(let i=1;i<4;i++) await page.locator('#url'+i).fill('https://example.org/produit'+i);
  await page.locator('[name="cf-turnstile-response"]').evaluate(e=>e.value='local-test-token');
}
async function main() {
  await new Promise(r=>server.listen(8765,'127.0.0.1',r));
  const browser = await chromium.launch({headless:true,channel:'msedge'});
  try {
    const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));

    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js',route=>route.fulfill({contentType:'text/javascript',body:
      "const widget=document.querySelector('.cf-turnstile');const token=document.createElement('input');token.type='hidden';token.name='cf-turnstile-response';widget.append(token);const visual=document.createElement('div');visual.style.cssText='width:150px;height:140px;border:1px solid #ccc';visual.textContent='Vérification simulée';widget.append(visual);window.resetCount=0;window.turnstile={reset(){window.resetCount++;token.value='';}};"
    }));
    await page.goto('http://127.0.0.1:8765/');
    const structural=await page.evaluate(()=>{
      const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
      const broken=[...document.querySelectorAll('a[href^="#"]')].map(e=>e.getAttribute('href')).filter(h=>h!=='#'&&!document.querySelector(h));
      const unlabeled=[...document.querySelectorAll('input:not([type=hidden]),textarea')].filter(e=>!e.labels.length).map(e=>e.id);
      return {duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),broken,unlabeled,h1:document.querySelectorAll('h1').length,lang:document.documentElement.lang};
    });
    assert.deepEqual(structural,{duplicateIds:[],broken:[],unlabeled:[],h1:1,lang:'fr'});console.log('PASS structure, anchors, labels, heading and language');
    const links=await page.locator('[href],[src]').evaluateAll(els=>els.map(e=>e.getAttribute('href')||e.getAttribute('src')).filter(s=>s&&!s.startsWith('#')&&!s.includes(':')));
    for (const link of new Set(links)) assert.equal((await page.request.get('http://127.0.0.1:8765/'+link)).status(),200,link);
    console.log('PASS local asset and page links');
    for(const width of [320,375,390,768,1024,1440]){
      await page.setViewportSize({width,height:1000});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'overflow '+width);
      
    }
    console.log('PASS responsive widths 320/375/390/768/1024/1440');
    await page.setViewportSize({width:390,height:844});
    await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('.menu-toggle').click();await page.locator('#navigation a[href="#tarifs"]').first().click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('summary').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('details').first().getAttribute('open'),'');
    console.log('PASS mobile navigation, Escape and keyboard FAQ');


    const stripeLinks={Starter:'https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02',Business:'https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03',Pro:'https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04'};
    assert.deepEqual(await page.locator('.plan-price').allTextContents(),['14,90 €/mois','29,90 €/mois','59,90 €/mois']);
    assert.equal(await page.locator('.hero-actions .button').getAttribute('href'),'#tarifs');
    assert.equal(await page.locator('#navigation .button').getAttribute('href'),'#tarifs');
    assert.equal(/gratuit|7 jours|sans carte|\bHT\b|\bTTC\b/i.test(await page.locator('body').innerText()),false);
    assert.match(await page.locator('body').innerText(),/TVA non applicable — art. 293 B du CGI\./);
    let formCalls=0;page.on('request',r=>{if(r.url().includes('formspree.io'))formCalls++;});
    for(const [plan,url] of Object.entries(stripeLinks)){
      const link=page.getByRole('link',{name:'Choisir '+plan});
      assert.equal(await link.getAttribute('href'),url);
      assert.equal(await link.getAttribute('target'),null);
      assert.equal(await link.getAttribute('data-plan'),null);
      await page.route(url,route=>route.fulfill({contentType:'text/html',body:'<h1>Destination interceptée pour test</h1>'}));
      await link.focus();await page.keyboard.press('Enter');
      await page.waitForURL(url);assert.equal(page.context().pages().length,1);
      assert.equal(formCalls,0);
      await page.unroute(url);await page.goto('http://127.0.0.1:8765/');
    }
    console.log('PASS exact Stripe mappings, same-tab keyboard navigation, no Formspree interception, pricing and CTA');
    await page.locator('.pricing-note a[href="#demande"]').click();
    assert.equal(await page.locator('#demande').evaluate(e=>e===document.activeElement),true);

    assert.equal(await page.locator('.cf-turnstile').getAttribute('data-sitekey'),'0x4AAAAAAE2QTEgZOtjjoxAY');
    assert.equal(await page.locator('.cf-turnstile').getAttribute('data-size'),'compact');
    await fill(page);
    for(const value of ['', '   ']){
      await page.locator('[name="cf-turnstile-response"]').evaluate((e,v)=>e.value=v,value);
      await page.locator('[type="submit"]').click();
      assert.equal(await page.locator('#form-status').textContent(),'Veuillez patienter quelques secondes pendant la vérification anti-spam.');
      assert.equal(formCalls,0);assert.equal(await page.locator('[type="submit"]').isDisabled(),false);
      assert.equal(await page.locator('#name').inputValue(),'Test QA');
    }
    console.log('PASS no token / whitespace: no request, French inline error, fields preserved');
    for(const mode of ['success','http-error','network-error','timeout']){
      let count=0;
      await page.route('https://formspree.io/f/mbgjnvjq',async route=>{
        count++;
        const data=route.request().postDataJSON();
        assert.equal(data['cf-turnstile-response'],'local-test-token');
        for(const key of ['name','company','email','competitor_url_1','competitor_url_2','competitor_url_3','optional_message']) assert.equal(typeof data[key],'string',key);
        if(mode==='network-error'){await new Promise(r=>setTimeout(r,500));return route.abort();}
        if(mode==='timeout')return;
        await new Promise(r=>setTimeout(r,500));
        await route.fulfill({status:mode==='http-error'?422:200,contentType:'application/json',body:mode==='success'?'{"ok":true}':'{"errors":[{"message":"Invalid"}]}'});
      });
      const resetsBefore=await page.evaluate(()=>window.resetCount);
      await fill(page);
      await page.locator('[type="submit"]').click();
      await page.locator('#demande').evaluate(e=>e.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})));
      assert.equal(await page.locator('[type="submit"]').isDisabled(),true);
      await page.waitForFunction(()=>!document.querySelector('[type="submit"]').disabled,{},{timeout:20000});
      assert.equal(count,1,'duplicate request');
      assert.equal(await page.evaluate(()=>window.resetCount),resetsBefore+1);
      assert.equal(await page.locator('[name="cf-turnstile-response"]').inputValue(),'');
      assert.equal(await page.locator('#form-status').getAttribute('data-state'),mode==='success'?'success':'error');
      assert.equal(await page.locator('#name').inputValue(),mode==='success'?'':'Test QA');
      assert.match(await page.locator('#form-status').textContent(),mode==='success'?/Nous vous recontactons rapidement/:/Impossible d’envoyer votre demande/);
      await page.unroute('https://formspree.io/f/mbgjnvjq');
      console.log('PASS Formspree '+mode+' / payload / double-submit protection / values');
    }
    assert.equal(await page.locator('.direct-contact a').getAttribute('href'),'mailto:changewatch@cybersignal.fr');
    await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
    await page.setViewportSize({width:1024,height:900});await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();await np.goto('http://127.0.0.1:8765/');assert.equal(await np.locator('#navigation').isVisible(),true);assert.equal(await np.locator('[type="submit"]').isDisabled(),true);await nojs.close();

    console.log('PASS contact focus, email, reduced motion, 200% text, no-JS');
    for(const route of ['/blog/','/blog/veille-concurrentielle-ecommerce/']){
      await page.goto('http://127.0.0.1:8765'+route);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://changewatch.cybersignal.fr'+route);
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),'https://changewatch.cybersignal.fr'+route);
      assert.ok((await page.title()).length>20);
      assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length>80);
      assert.equal(await page.locator('script[src*="turnstile"]').count(),0);
      const anchorUrls=await page.locator('a[href],link[href],img[src],script[src]').evaluateAll(els=>els.map(e=>e.href||e.src).filter(Boolean));
      for(const href of new Set(anchorUrls)){
        const url=new URL(href);
        if(!['127.0.0.1','changewatch.cybersignal.fr'].includes(url.hostname))continue;
        const result=await page.request.get('http://127.0.0.1:8765'+url.pathname);
        assert.equal(result.status(),200,href);
        if(url.hash){const markup=await result.text();assert.ok(markup.includes('id="'+url.hash.slice(1)+'"'),href);}
      }
      for(const width of [320,375,768,1440]){
        await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' '+width);
      }
      await page.setViewportSize({width:375,height:900});
      await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');
      
      if(route!='/blog/'){
        const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
        assert.equal(schema['@graph'][0]['@type'],'BlogPosting');assert.equal(schema['@graph'][1]['@type'],'BreadcrumbList');
        assert.equal(schema['@graph'][0].datePublished,'2026-09-15');assert.equal(schema['@graph'][0].dateModified,'2026-09-16');
        assert.equal(schema['@graph'][0].wordCount, await page.locator('.article-body').evaluate(el => { const copy=el.cloneNode(true);copy.querySelectorAll('*').forEach(node=>{node.before(' ');node.after(' ')});return copy.textContent.trim().split(/\s+/).length; }));
        assert.equal(schema['@graph'][0].mainEntityOfPage['@id'],'https://changewatch.cybersignal.fr'+route);
        assert.equal(await page.locator('.article-body h2').count(),8);assert.equal(await page.locator('.table-scroll table').count(),1);
        await page.locator('.table-scroll').focus();assert.equal(await page.locator('.table-scroll').evaluate(e=>e===document.activeElement),true);
        await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:8765'+route);
      }
    }
    await page.goto('http://127.0.0.1:8765/');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.locator('#demo-play').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-demo-step].is-active').count(),1);
    assert.match(await page.locator('#demo-status').innerText(),/1 sur 4/);
    await page.keyboard.press('Enter');assert.match(await page.locator('#demo-status').innerText(),/interrompue/);
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('#demo-status').textContent.startsWith('4 sur 4'));
    assert.match(await page.locator('#demo-play').innerText(),/Rejouer/);
    await page.emulateMedia({reducedMotion:'reduce'});await page.keyboard.press('Enter');
    assert.match(await page.locator('#demo-status').innerText(),/4 sur 4/);
    assert.equal(await page.locator('[data-demo-step]').last().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
    console.log('PASS demo keyboard play/stop/replay and reduced-motion immediate result');
    const pages=['/','/blog/','/blog/veille-concurrentielle-ecommerce/','/cgv.html','/confidentialite.html','/mentions-legales.html','/demo-produit.html'];
    for(const route of pages){
      await page.goto('http://127.0.0.1:8765'+route);
      for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' overflow '+width);}
      const urls=await page.locator('a[href],link[href],script[src],img[src]').evaluateAll(els=>els.map(el=>el.href||el.src).filter(Boolean));
      for(const href of new Set(urls)){
        const url=new URL(href);if(!['127.0.0.1','changewatch.cybersignal.fr'].includes(url.hostname))continue;
        const response=await page.request.get('http://127.0.0.1:8765'+url.pathname);assert.equal(response.status(),200,href);
        if(url.hash&&url.hash!=='#'){const markup=await response.text();assert.ok(markup.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),href);}
      }
      assert.equal(await page.locator('img:not([alt])').count(),0);
      for(const source of await page.locator('source[srcset]').evaluateAll(els=>els.map(el=>el.srcset))){const response=await page.request.get(new URL(source,page.url()).href);assert.equal(response.status(),200,source);}
      assert.equal(await page.locator('h1').count(),1);
    }
    console.log('PASS all 7 pages: local links/assets/anchors, images alt, H1, five responsive widths');
    const sitemap=await (await page.request.get('http://127.0.0.1:8765/sitemap.xml')).text();
    assert.ok(sitemap.includes('https://changewatch.cybersignal.fr/blog/veille-concurrentielle-ecommerce/'));
    const robots=await (await page.request.get('http://127.0.0.1:8765/robots.txt')).text();assert.ok(robots.includes('Allow: /'));assert.ok(robots.includes('Sitemap: https://changewatch.cybersignal.fr/sitemap.xml'));
    assert.deepEqual(errors,[]);
    console.log('PASS blog routes, titles, canonical, JSON-LD, length, table, 4 widths, keyboard, every local link/anchor, sitemap and robots');

  } finally {await browser.close();server.close();}
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});

