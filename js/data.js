// Plan catalogue shared by the landing page, basket and checkout.
// Prices and wording per language live in js/lang/en.js and js/lang/de.js (plans); the numbers below are the totals.
(function () {
  var L = window.GLEEV_L;
  var TOTALS = { three: 112.47, monthly: 49.99, once: 59.99 };
  var PLANS = L.plans.map(function (p) { p.total = TOTALS[p.id]; return p; });

  window.GLEEV = {
    PLANS: PLANS,
    DEFAULT_PLAN: 'three',
    money: L.money,
    plan: function (id) { return PLANS.filter(function (p) { return p.id === id; })[0] || PLANS[1]; }
  };
})();
