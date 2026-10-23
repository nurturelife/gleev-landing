// Runs on every page: remembers a manual language choice, and shows the cookie banner
// that decides whether Google Analytics may load (see the analytics snippet in <head>).
(function () {
  var L = window.GLEEV_L || { consent: {} }, C = L.consent || {};
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/js\/common\.js.*$/, '');
  var CONSENT_KEY = 'gleev.consent', LANG_KEY = 'gleev.lang', GA_ID = 'G-86W1T4YRWF';
  var banner = null;

  function store(k, v) { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---- language switch: a click is the visitor's choice and overrides the browser-language redirect ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-lang]');
    if (a) store(LANG_KEY, a.getAttribute('data-lang'));
  });

  /* ---- cookie banner ---- */
  function clearGaCookies() {
    var host = location.hostname, bare = host.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^_ga/.test(n) || n === '_gid' || /^_gat/.test(n)) {
        ['', '; domain=' + host, '; domain=.' + bare].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }
  function hide() { if (banner) { banner.parentNode.removeChild(banner); banner = null; } }
  function accept() { store(CONSENT_KEY, 'granted'); if (window.gleevLoadAnalytics) window.gleevLoadAnalytics(); hide(); }
  function clearPosthog() {
    try { if (window.posthog && window.posthog.opt_out_capturing) window.posthog.opt_out_capturing(); } catch (e) {}
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^ph_/.test(n)) {
        ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
    try { Object.keys(localStorage).forEach(function (k) { if (/^ph_|posthog/i.test(k)) localStorage.removeItem(k); }); } catch (e) {}
  }
  function clearMeta() {
    try { if (window.fbq) window.fbq('consent', 'revoke'); } catch (e) {}
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_fbp' || n === '_fbc') {
        ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }
  function decline() {
    store(CONSENT_KEY, 'denied');
    window['ga-disable-' + GA_ID] = true;
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    clearGaCookies(); clearPosthog(); clearMeta(); hide();
  }
  function show() {
    if (banner || !C.text) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', C.title || 'Cookies');
    banner.innerHTML = '<p>' + C.text + ' <a href="' + BASE + L.paths.privacyFromRoot + '">' + C.privacy + '</a></p>'
      + '<div class="cookie-actions"><button type="button" class="cb-decline">' + C.decline + '</button>'
      + '<button type="button" class="cb-accept">' + C.accept + '</button></div>';
    banner.querySelector('.cb-accept').addEventListener('click', accept);
    banner.querySelector('.cb-decline').addEventListener('click', decline);
    document.body.appendChild(banner);
  }
  function init() {
    if (read(CONSENT_KEY) === null) show();
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-cookie-settings]')) { store(CONSENT_KEY, null); show(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
