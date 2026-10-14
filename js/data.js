// Plan catalogue shared by the landing page, basket and checkout.
(function () {
  var gbp = function (n) { return '£' + n.toFixed(2); };

  var PLANS = [
    { id: 'three', name: 'Three-month plan', total: 112.47, price: '£37.49', perShort: '/ month',
      sub: '£112.47 billed every 12 weeks · three packs', per: '£112.47 every 12 weeks', day: '£1.34 a day',
      tag: 'LEAD VALUE · SAVE 25%', save: 'Save 25% vs monthly', rec: true,
      lines: ['Three packs in one plan', '25% off the monthly price', 'Skip, pause or cancel in two clicks'],
      renew: 'Renews every 12 weeks at £112.47', flex: 'Skip, pause or cancel in two clicks.',
      cta: 'Start my plan', ctaLong: 'Start my plan · £112.47 every 12 weeks' },
    { id: 'monthly', name: 'Monthly plan', total: 49.99, price: '£49.99', perShort: '/ month',
      sub: 'One pack, every 28 days', per: '£49.99 every 28 days', day: '£1.79 a day',
      tag: 'LOW COMMITMENT', save: '',
      lines: ['One pack a month', 'Switch to the three-month plan any time', 'Skip, pause or cancel in two clicks'],
      renew: 'Renews every 28 days at £49.99', flex: 'Skip, pause or cancel in two clicks.',
      cta: 'Start my plan', ctaLong: 'Start my plan · £49.99 every 28 days' },
    { id: 'once', name: 'Buy once', total: 59.99, price: '£59.99', perShort: '',
      sub: 'One pack, 28 days. Nothing renews', per: '£59.99 once, one pack', day: '£2.14 a day',
      tag: 'ONE-TIME', save: '',
      lines: ['No subscription', 'Never discounted'],
      renew: 'One-time purchase. Nothing renews', flex: '',
      cta: 'Buy once', ctaLong: 'Buy once · £59.99' }
  ];

  window.GLEEV = {
    PLANS: PLANS,
    DEFAULT_PLAN: 'monthly',
    gbp: gbp,
    plan: function (id) { return PLANS.filter(function (p) { return p.id === id; })[0] || PLANS[1]; }
  };
})();
