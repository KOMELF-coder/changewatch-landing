'use strict';
(() => {
  // Isolate Google's automatic DOM inspection from all contact fields and browser URL parameters.
  // This document has no form, links, history navigation or visitor-supplied content.
  if (window.parent === window) return;
  const ID = 'G-RB6NSRRM9L';
  let initialized = false;
  const routes = new Set(['/blog/veille-concurrentielle-exemple/', '/en/blog/price-tracking-software/', '/blog/etude-de-concurrence/', '/en/blog/competitor-price-analysis/', '/en/blog/', '/en/blog/ecommerce-competitor-monitoring/', '/en/', '/en/terms.html', '/en/legal-notice.html', '/en/privacy.html', '/en/demo-product.html', '/', '/blog/', '/blog/veille-concurrentielle-ecommerce/', '/demo-produit.html', '/cgv.html', '/mentions-legales.html', '/confidentialite.html']);
  window['ga-disable-' + ID] = true;
  window.dataLayer = [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.cwInit = data => {
    if (data?.type === 'cw-analytics-init' && !initialized && routes.has(data.page?.path)) {
      initialized = true;
      const denied = {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
      gtag('consent', 'default', denied);
      gtag('set', 'ads_data_redaction', true);
      gtag('set', 'url_passthrough', false);
      gtag('consent', 'update', {...denied, analytics_storage:'granted'});
      window['ga-disable-' + ID] = false;
      gtag('js', new Date());
      gtag('config', ID, {
        send_page_view:false,
        page_location:'https://changewatch.cybersignal.fr' + data.page.path,
        page_referrer:'', page_title:data.page.title,
        allow_google_signals:false, allow_ad_personalization_signals:false,
        cookie_domain:location.hostname, cookie_path:'/', cookie_expires:180 * 86400, cookie_update:false,
      });
      if (data.pageView) gtag('event', 'page_view');
      const script = document.createElement('script'); script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
      document.head.append(script);
    }
  };
  // Synchronous handoff avoids losing the click before the parent navigates to Stripe.
  window.cwRecord = data => {
    if (!initialized || window['ga-disable-' + ID]) return;
    if (data.name === 'generate_lead') gtag('event', 'generate_lead', {form_name:'contact'});
    if (data.name === 'stripe_click' && ['Starter','Business','Pro'].includes(data.parameters?.plan)) gtag('event', 'stripe_click', {plan:data.parameters.plan});
    if (data.name === 'commercial_cta_click' && ['tarifs','demande'].includes(data.parameters?.destination)) gtag('event', 'commercial_cta_click', {destination:data.parameters.destination});
  };
  parent.postMessage({type:'cw-analytics-ready'}, location.origin);
})();
