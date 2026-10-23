// English strings used by the scripts. Page copy lives in i18n/en.json.
window.GLEEV_L = (function () {
  var m = function (n) { return '£' + n.toFixed(2); };
  return {
    lang: 'en',
    money: m,
    currencyCode: 'GBP',
    // links are relative to the current page; "privacyFromRoot" is relative to the site root
    paths: { plans: 'index.html#plans', checkout: 'checkout.html', privacyFromRoot: 'legal/privacy.html' },
    ui: {
      saveBadge: 'SAVE 25%', productName: 'Gleev 360° Biom',
      basket: 'Your basket', closeBasket: 'Close basket', empty: 'Your basket is empty.', choosePlan: 'Choose your plan',
      qtyDec: 'Decrease quantity', qtyInc: 'Increase quantity', remove: 'Remove',
      subtotal: 'Subtotal', delivery: 'Delivery', free: 'Free', total: 'Total', checkout: 'Checkout',
      showSummary: 'Show order summary', hideSummary: 'Hide order summary', thanksTitle: 'Thank you · Gleev'
    },
    msg: {
      email: 'Please enter a valid email address.', first: 'Please enter your first name.', last: 'Please enter your last name.',
      consent: 'Please tick the box to agree.', sending: 'Sending…',
      thanks: "Thanks! You're on the list.", error: 'Something went wrong. Please try again in a moment.'
    },
    consent: {
      title: 'Cookies',
      text: 'We would like to use analytics and advertising cookies (Google Analytics, PostHog and the Meta Pixel) to understand how the site is used, including heatmaps of clicks and scrolling, and to measure our advertising. They stay off unless you accept.',
      privacy: 'Privacy policy', accept: 'Accept', decline: 'Decline'
    },
    plans: [
      { id: 'three', name: 'Three-month plan', price: m(37.49), perShort: '/ month',
        sub: m(112.47) + ' billed every 12 weeks · three packs', per: m(112.47) + ' every 12 weeks', day: m(1.34) + ' a day',
        tag: 'LEAD VALUE · SAVE 25%', save: 'Save 25% vs monthly', rec: true,
        lines: ['Three packs in one plan', '25% off the monthly price', 'Skip, pause or cancel in two clicks'],
        renew: 'Renews every 12 weeks at ' + m(112.47), flex: 'Skip, pause or cancel in two clicks.',
        cta: 'Start my plan', ctaLong: 'Start my plan · ' + m(112.47) + ' every 12 weeks' },
      { id: 'monthly', name: 'Monthly plan', price: m(49.99), perShort: '/ month',
        sub: 'One pack, every 28 days', per: m(49.99) + ' every 28 days', day: m(1.79) + ' a day',
        tag: 'LOW COMMITMENT', save: '',
        lines: ['One pack a month', 'Switch to the three-month plan any time', 'Skip, pause or cancel in two clicks'],
        renew: 'Renews every 28 days at ' + m(49.99), flex: 'Skip, pause or cancel in two clicks.',
        cta: 'Start my plan', ctaLong: 'Start my plan · ' + m(49.99) + ' every 28 days' },
      { id: 'once', name: 'Buy once', price: m(59.99), perShort: '',
        sub: 'One pack, 28 days. Nothing renews', per: m(59.99) + ' once, one pack', day: m(2.14) + ' a day',
        tag: 'ONE-TIME', save: '',
        lines: ['No subscription', 'Never discounted'],
        renew: 'One-time purchase. Nothing renews', flex: '',
        cta: 'Buy now', ctaLong: 'Buy now · ' + m(59.99) }
    ]
  };
})();
