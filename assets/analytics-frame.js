'use strict';
(() => {
  // Isolate Google's automatic DOM inspection from all contact fields and browser URL parameters.
  // This document has no form, links, history navigation or visitor-supplied content.
  if (window.parent === window) return;
  const ID = 'G-RB6NSRRM9L';
  const GOOGLE_ADS_ID = 'AW-18472426652';
  // Paste only the verified Google Ads lead conversion label here (not the full send_to).
  // Leave null until supplied: GA4 generate_lead remains active without an Ads conversion.
  const GOOGLE_ADS_LEAD_LABEL = null;
  const hasAdsLeadLabel = typeof GOOGLE_ADS_LEAD_LABEL === 'string' && /^[A-Za-z0-9_-]+$/.test(GOOGLE_ADS_LEAD_LABEL);
  let initialized = false, analytics = false, advertising = false;
  const routes = new Set(['/blog/veille-concurrentielle-exemple/', '/en/blog/price-tracking-software/', '/blog/etude-de-concurrence/', '/en/blog/competitor-price-analysis/', '/en/blog/', '/en/blog/ecommerce-competitor-monitoring/', '/en/', '/en/terms.html', '/en/legal-notice.html', '/en/privacy.html', '/en/demo-product.html', '/', '/blog/', '/blog/veille-concurrentielle-ecommerce/', '/demo-produit.html', '/cgv.html', '/mentions-legales.html', '/confidentialite.html']);
  window['ga-disable-' + ID] = true;
  // Ads config may emit an automatic /ccm/collect page_view even with send_page_view:false.
  // While the label is missing, initialise the tag but allow only GA collection.
  // This iframe-only CSP also blocks image/script/frame transports to Ads collectors.
  if (!hasAdsLeadLabel) {
    const policy = document.createElement('meta');
    policy.httpEquiv = 'Content-Security-Policy';
    policy.content = "default-src 'none'; script-src 'self' https://www.googletagmanager.com; connect-src https://*.google-analytics.com; img-src https://*.google-analytics.com; frame-src 'none'; form-action 'none'";
    document.head.append(policy);
  }
  window.dataLayer = [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.cwInit = data => {
    if (data?.type === 'cw-analytics-init' && !initialized && routes.has(data.page?.path)) {
      initialized = true;
      analytics = data.consent?.analytics === true;
      advertising = data.consent?.advertising === true;
      if (!analytics && !advertising) return;
      const denied = {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'};
      gtag('consent', 'default', denied);
      gtag('set', 'ads_data_redaction', true);
      gtag('set', 'url_passthrough', false);
      gtag('consent', 'update', {analytics_storage:analytics ? 'granted' : 'denied', ad_storage:advertising ? 'granted' : 'denied', ad_user_data:advertising ? 'granted' : 'denied', ad_personalization:advertising ? 'granted' : 'denied'});
      window['ga-disable-' + ID] = false;
      gtag('js', new Date());
      if (analytics) gtag('config', ID, {
        send_page_view:false,
        page_location:'https://changewatch.cybersignal.fr' + data.page.path,
        page_referrer:'', page_title:data.page.title,
        allow_google_signals:false, allow_ad_personalization_signals:false,
        cookie_domain:location.hostname, cookie_path:'/', cookie_expires:180 * 86400, cookie_update:false,
      });
      // Explicit routing below prevents GA4 events from also reaching the Ads destination.
      if (advertising) gtag('config', GOOGLE_ADS_ID, {
        send_page_view:false,
        page_location:'https://changewatch.cybersignal.fr' + data.page.path,
        page_referrer:'', page_title:data.page.title,
        allow_enhanced_conversions:false,
      });
      if (analytics && data.pageView) gtag('event', 'page_view', {send_to:ID});
      const script = document.createElement('script'); script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + (analytics ? ID : GOOGLE_ADS_ID);
      document.head.append(script);
    }
  };
  // Synchronous handoff avoids losing the click before the parent navigates to Stripe.
  window.cwRecord = data => {
    if (!initialized || window['ga-disable-' + ID]) return;
    if (data.name === 'generate_lead') {
      if (analytics) gtag('event', 'generate_lead', {send_to:ID, form_name:'contact'});
      if (advertising && hasAdsLeadLabel) {
        gtag('event', 'conversion', {send_to:GOOGLE_ADS_ID + '/' + GOOGLE_ADS_LEAD_LABEL});
      }
    }
    if (analytics && data.name === 'stripe_click' && ['Starter','Business','Pro'].includes(data.parameters?.plan)) gtag('event', 'stripe_click', {send_to:ID, plan:data.parameters.plan});
    if (analytics && data.name === 'commercial_cta_click' && ['tarifs','demande'].includes(data.parameters?.destination)) gtag('event', 'commercial_cta_click', {send_to:ID, destination:data.parameters.destination});
  };
  parent.postMessage({type:'cw-analytics-ready'}, location.origin);
})();
