// Checkout page: shows the basket as an order summary, collects name and email,
// sends the lead to Klaviyo, then shows the "thanks for your interest" confirmation.
(function () {
  var G = window.GLEEV, L = window.GLEEV_L, Cart = window.GleevCart, K = window.GleevKlaviyo;
  var $ = function (s) { return document.querySelector(s); };

  var s = Cart.summary();
  if (!s) { location.replace(L.paths.plans); return; }

  var price = G.money(s.total);
  var pl = s.plan;
  $('#co-plan').textContent = pl.name + (s.qty > 1 ? ' × ' + s.qty : '');
  $('#co-renew').textContent = pl.renew;
  $('#co-qty').textContent = s.qty;
  $('#co-price').textContent = price;
  $('#co-sub').textContent = price;
  $('#co-total').textContent = price;
  $('#co-toggle-total').textContent = price;

  // Order summary collapses on small screens
  var box = $('#co-summary'), toggle = $('.co-toggle');
  toggle.addEventListener('click', function () {
    var open = !box.classList.contains('open');
    box.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.firstElementChild.textContent = open ? L.ui.hideSummary : L.ui.showSummary;
  });

  $('#co-form').addEventListener('gleev:subscribed', function (e) {
    var em = e.detail.email;
    $('#co-form').reset();
    K.track('Started Checkout', { plan: s.planId, plan_name: s.name, quantity: s.qty }, s.total, em);
    $('#thanks-email').textContent = em;
    $('#thanks-plan').textContent = L.ui.productName + ' · ' + pl.name + (s.qty > 1 ? ' × ' + s.qty : '');
    $('#thanks-price').textContent = pl.id === 'once' ? price : pl.per;
    $('#co-wrap').hidden = true;
    $('#thanks').hidden = false;
    document.title = L.ui.thanksTitle;
    window.scrollTo(0, 0);
    var h = $('#thanks h1'); if (h) h.focus({ preventScroll: true });
  });
})();
