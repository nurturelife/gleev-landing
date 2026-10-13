// Checkout page: shows the basket as an order summary, collects name and email,
// sends the lead to Klaviyo, then shows the "thanks for your interest" confirmation.
(function () {
  var G = window.GLEEV, Cart = window.GleevCart, K = window.GleevKlaviyo;
  var $ = function (s) { return document.querySelector(s); };

  var s = Cart.summary();
  if (!s) { location.replace('index.html#plans'); return; }

  var price = G.gbp(s.total);
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
    toggle.firstElementChild.textContent = open ? 'Hide order summary' : 'Show order summary';
  });

  if (K.knownEmail()) $('#co-email').value = K.knownEmail();

  $('#co-form').addEventListener('gleev:subscribed', function (e) {
    var em = e.detail.email;
    K.track('Started Checkout', { plan: s.planId, plan_name: s.name, quantity: s.qty }, s.total, em);
    $('#thanks-email').textContent = em;
    $('#thanks-plan').textContent = 'Gleev 360° Biom · ' + pl.name + (s.qty > 1 ? ' × ' + s.qty : '');
    $('#thanks-price').textContent = pl.id === 'once' ? price : pl.per;
    $('#co-wrap').hidden = true;
    $('#thanks').hidden = false;
    document.title = 'Thank you · Gleev';
    window.scrollTo(0, 0);
    var h = $('#thanks h1'); if (h) h.focus({ preventScroll: true });
  });
})();
