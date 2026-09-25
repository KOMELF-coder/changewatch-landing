'use strict';
(() => {
  const english = document.documentElement.lang === 'en';
  // Version 2 renews the former Analytics-only consent before enabling advertising.
  const KEY = 'cw-consent-v1';
  const ID = 'G-RB6NSRRM9L';
  const base = new URL('../', document.currentScript.src);
  const paths = new Map([
    ['/blog/veille-concurrentielle-exemple/', 'Veille concurrentielle : exemple concret et tableau à remplir'], ['/blog/veille-concurrentielle-exemple/index.html', 'Veille concurrentielle : exemple concret et tableau à remplir'],
    ['/en/blog/price-tracking-software/', 'Price tracking software: choose the right fit'], ['/en/blog/price-tracking-software/index.html', 'Price tracking software: choose the right fit'],
    ['/blog/etude-de-concurrence/', 'Étude de concurrence'], ['/blog/etude-de-concurrence/index.html', 'Étude de concurrence'],
    ['/en/blog/competitor-price-analysis/', 'Competitor price analysis'], ['/en/blog/competitor-price-analysis/index.html', 'Competitor price analysis'],

    ['/en/blog/', 'Blog'], ['/en/blog/index.html', 'Blog'],
    ['/en/blog/ecommerce-competitor-monitoring/', 'Ecommerce competitor monitoring'],
    ['/en/blog/ecommerce-competitor-monitoring/index.html', 'Ecommerce competitor monitoring'],
    ['/en/', 'Home'], ['/en/index.html', 'Home'], ['/en/terms.html', 'Terms of sale'],
    ['/en/legal-notice.html', 'Legal notice'], ['/en/privacy.html', 'Privacy'], ['/en/demo-product.html', 'Demo'],
    ['/', 'Accueil'], ['/index.html', 'Accueil'], ['/blog/', 'Blog'], ['/blog/index.html', 'Blog'],
    ['/blog/veille-concurrentielle-ecommerce/', 'Guide veille concurrentielle'],
    ['/blog/veille-concurrentielle-ecommerce/index.html', 'Guide veille concurrentielle'],
    ['/demo-produit.html', 'Démonstration'], ['/cgv.html', 'Conditions de vente'],
    ['/mentions-legales.html', 'Mentions légales'], ['/confidentialite.html', 'Confidentialité'],
  ]);
  const canonicalPath = location.pathname.replace(/index\.html$/, '');
  // Explicit routes and labels only: never forward query, hash, referrer or document title.
  const page = {path: paths.has(location.pathname) ? canonicalPath : '/', title: paths.get(location.pathname) || 'ChangeWatch'};
  let frame = null, ready = false, pending = [], expiryTimer, memoryChoice = null, storageAvailable = true;
  let sentPageView = false, activeChoice = null;
  function readChoice() {
    if (!storageAvailable) return memoryChoice?.expires > Date.now() ? memoryChoice : null;
    try {
      const value = JSON.parse(localStorage.getItem(KEY));
      return value?.version === 2 && typeof value.analytics === 'boolean' && typeof value.advertising === 'boolean' &&
        Number.isFinite(value.expires) && value.expires > Date.now() &&
        value.expires <= Date.now() + 184 * 86400000 ? value : null;
    } catch { storageAvailable = false; return memoryChoice?.expires > Date.now() ? memoryChoice : null; }
  }
  function allowed() { const choice = readChoice(); return choice?.analytics === true || choice?.advertising === true; }
  function clearCookies() {
    // Remove readable first-party GA and Ads cookies at host/parent domains and current path ancestors.
    const names = document.cookie.split(';').map(v => v.trim().split('=')[0]).filter(n => /^(?:_ga(?:_|$)|_gcl_)/.test(n));
    const hosts = location.hostname.split('.');
    const domains = ['', ...hosts.map((_, i) => hosts.slice(i).join('.')).filter(d => d.includes('.'))];
    const parts = location.pathname.split('/');
    const cookiePaths = new Set(['/']);
    for (let i = 1; i < parts.length; i++) { const p = parts.slice(0, i).join('/') || '/'; cookiePaths.add(p); cookiePaths.add(p.replace(/\/$/, '') + '/'); }
    for (const name of names) for (const domain of domains) for (const path of cookiePaths) {
      document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax${domain ? '; Domain=' + domain : ''}${location.protocol === 'https:' ? '; Secure' : ''}`;
    }
  }
  function stop() {
    pending = []; ready = false; activeChoice = null;
    if (frame) {
      // Block new iframe network activity BEFORE notifying Google of withdrawal.
      // Ads can otherwise emit a cookieless consent ping when receiving denied.
      const policy = frame.contentDocument.createElement('meta');
      policy.httpEquiv = 'Content-Security-Policy';
      policy.content = "default-src 'none'; connect-src 'none'; img-src 'none'; script-src 'none'; frame-src 'none'; form-action 'none'";
      frame.contentDocument.head.append(policy);
      // Shut down the tag BEFORE destroying its isolated document (including unload events).
      frame.contentWindow['ga-disable-' + ID] = true;
      frame.contentWindow.gtag?.('consent', 'update', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
      frame.remove(); frame = null;
    }
    clearCookies();
  }
  function start() {
    if (frame || !allowed()) return;
    activeChoice = [readChoice().analytics, readChoice().advertising].join(',');
    frame = document.createElement('iframe');
    // Keep a layout viewport so enhanced measurement cannot interpret a zero-size document as fully scrolled.
    frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:1px;height:1px;border:0;visibility:hidden';
    frame.setAttribute('aria-hidden', 'true');
    frame.title = english ? 'Consented analytics' : 'Mesure d’audience consentie'; frame.tabIndex = -1;
    frame.referrerPolicy = 'no-referrer';
    frame.src = new URL('assets/analytics-frame.html', base).href;
    document.body.append(frame);
  }
  function send(name, parameters = {}) {
    if (!allowed() || !frame) return;
    const event = {type:'cw-analytics-event', name, parameters};
    if (ready) frame.contentWindow.cwRecord(event);
    else if (pending.length < 20) pending.push(event);
  }
  window.addEventListener('message', e => {
    if (!frame || e.source !== frame.contentWindow || e.origin !== location.origin || e.data?.type !== 'cw-analytics-ready' || !allowed() || ready) return;
    ready = true;
    const consent = readChoice();
    frame.contentWindow.cwInit({type:'cw-analytics-init', page, consent, pageView:consent.analytics && !sentPageView});
    if (consent.analytics) sentPageView = true;
    for (const event of pending) frame.contentWindow.cwRecord(event);
    pending = [];
  });
  const banner = document.createElement('section');
  banner.className = 'cookie-banner'; banner.setAttribute('aria-labelledby', 'cookie-title');
  banner.innerHTML = english ? `<div><h2 id="cookie-title">Your privacy choices</h2><p>With your permission, Google Analytics measures visits and enquiries, and Google Ads measures advertising and enables ad personalisation. Tracking is optional; the form remains available if you refuse.</p><a href="${new URL('en/privacy.html#cookies', base).href}">Learn more</a></div><div class="cookie-actions"><button type="button" data-consent="accept">Accept all</button><button type="button" data-consent="reject">Reject all</button><button type="button" data-consent="customize">Customise</button></div>` : `<div><h2 id="cookie-title">Vos choix de confidentialité</h2><p>Avec votre accord, Google Analytics mesure les visites et demandes, et Google Ads mesure la publicité et permet sa personnalisation. Le suivi est facultatif ; le formulaire reste disponible en cas de refus.</p><a href="${new URL('confidentialite.html#cookies', base).href}">En savoir plus</a></div><div class="cookie-actions"><button type="button" data-consent="accept">Tout accepter</button><button type="button" data-consent="reject">Tout refuser</button><button type="button" data-consent="customize">Personnaliser</button></div>`;
  document.body.append(banner);
  const dialog = document.createElement('dialog');
  dialog.className = 'cookie-dialog'; dialog.setAttribute('aria-labelledby', 'cookie-dialog-title');
  dialog.innerHTML = english ? `<h2 id="cookie-dialog-title">Manage cookies</h2><p>The features needed by the form, including Turnstile, do not depend on your tracking choice.</p><label class="cookie-option"><input type="checkbox" id="cookie-analytics"> <span><strong>Audience measurement</strong><br>Google Analytics: visits, plan clicks and confirmed enquiries. No form fields are shared.</span></label><label class="cookie-option"><input type="checkbox" id="cookie-advertising"> <span><strong>Advertising</strong><br>Google Ads: advertising measurement and personalisation. No contact details are shared.</span></label><p>Your choice is saved for six months in this browser. You can change it at any time.</p><div class="cookie-actions"><button type="button" data-consent="accept">Accept all</button><button type="button" data-consent="reject">Reject all</button><button type="button" data-consent="save">Save my choices</button><button type="button" data-consent="close">Close without changes</button></div>` : `<h2 id="cookie-dialog-title">Gérer les cookies</h2><p>Les fonctions nécessaires au formulaire, dont Turnstile, ne dépendent pas du choix de suivi.</p><label class="cookie-option"><input type="checkbox" id="cookie-analytics"> <span><strong>Mesure d’audience</strong><br>Google Analytics : visites, clics et demandes confirmées. Aucun champ du formulaire n’est transmis.</span></label><label class="cookie-option"><input type="checkbox" id="cookie-advertising"> <span><strong>Publicité</strong><br>Google Ads : mesure et personnalisation publicitaires. Aucune coordonnée n’est transmise.</span></label><p>Votre choix est conservé six mois sur ce navigateur. Vous pouvez le modifier à tout moment.</p><div class="cookie-actions"><button type="button" data-consent="accept">Tout accepter</button><button type="button" data-consent="reject">Tout refuser</button><button type="button" data-consent="save">Enregistrer mes choix</button><button type="button" data-consent="close">Fermer sans modifier</button></div>`;
  document.body.append(dialog);
  let opener;
  function customize(source) { opener = source; dialog.querySelector('#cookie-analytics').checked = readChoice()?.analytics === true; dialog.querySelector('#cookie-advertising').checked = readChoice()?.advertising === true; dialog.showModal(); }
  dialog.addEventListener('close', () => opener?.focus());
  function sync() {
    clearTimeout(expiryTimer);
    const choice = readChoice();
    banner.hidden = !!choice;
    if (frame && [choice?.analytics, choice?.advertising].join(',') !== activeChoice) stop();
    if (allowed()) start(); else stop();
    // Timers are bounded; recheck long-lived tabs, expiry, focus and bfcache restoration.
    if (choice) expiryTimer = setTimeout(sync, Math.min(choice.expires - Date.now() + 10, 2147483647));
  }
  function choose(analytics, advertising) {
    const expires = new Date(); expires.setMonth(expires.getMonth() + 6);
    const choice = {version:2, analytics, advertising, expires:expires.getTime()};
    memoryChoice = choice;
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch { storageAvailable = false; }

    if (dialog.open) dialog.close();
    sync();
  }
  document.addEventListener('click', e => {
    const manage = e.target.closest('[data-manage-cookies]');
    if (manage) { e.preventDefault(); customize(manage); return; }
    const action = e.target.closest('[data-consent]');
    if (action) {
      const value = action.dataset.consent;
      if (value === 'customize') customize(action);
      if (value === 'close') dialog.close();
      if (value === 'accept' || value === 'reject' || value === 'save') choose(value === 'accept' || (value === 'save' && dialog.querySelector('#cookie-analytics').checked), value === 'accept' || (value === 'save' && dialog.querySelector('#cookie-advertising').checked));
      return;
    }
    const link = e.target.closest('a[href]');
    if (!link) return;
    const plans = {
      'https://buy.stripe.com/dRm3cu78w4TdbNMdFs4gg05?prefilled_promo_code=CWBUSINESS3MOIS':'Business',
      'https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02':'Starter',
      'https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03':'Business',
      'https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04':'Pro',
    };
    if (plans[link.href]) send('stripe_click', {plan:plans[link.href]});
    else if (link.origin === location.origin && ['#tarifs', '#demande'].includes(link.hash)) send('commercial_cta_click', {destination:link.hash.slice(1)});
  });
  // No form content in this event; dispatched only after Formspree returns HTTP 2xx.
  document.addEventListener('cw:lead-confirmed', () => send('generate_lead'));
  window.addEventListener('storage', e => { if (e.key === KEY || e.key === null) sync(); });
  window.addEventListener('pageshow', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  sync();
})();
