// Deutsche Texte für die Skripte. Seitentexte stehen in i18n/de.json.
// Währung: Euro-Symbol statt Pfund, die Zahlen bleiben unverändert (Schreibweise 37,49 €).
window.GLEEV_L = (function () {
  var m = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var pct = '25 %';
  return {
    lang: 'de',
    money: m,
    currencyCode: 'EUR',
    paths: { plans: 'index.html#plans', checkout: 'checkout.html', privacyFromRoot: 'de/legal/privacy.html' },
    ui: {
      saveBadge: pct + ' SPAREN', productName: 'Gleev 360° Biom',
      basket: 'Ihr Warenkorb', closeBasket: 'Warenkorb schließen', empty: 'Ihr Warenkorb ist leer.', choosePlan: 'Plan auswählen',
      qtyDec: 'Menge verringern', qtyInc: 'Menge erhöhen', remove: 'Entfernen',
      subtotal: 'Zwischensumme', delivery: 'Lieferung', free: 'Kostenlos', total: 'Gesamt', checkout: 'Zur Kasse',
      showSummary: 'Bestellübersicht anzeigen', hideSummary: 'Bestellübersicht ausblenden', thanksTitle: 'Vielen Dank · Gleev'
    },
    msg: {
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.', first: 'Bitte geben Sie Ihren Vornamen ein.', last: 'Bitte geben Sie Ihren Nachnamen ein.',
      consent: 'Bitte setzen Sie den Haken, um fortzufahren.', sending: 'Wird gesendet…',
      thanks: 'Vielen Dank! Sie stehen auf der Liste.', error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es gleich noch einmal.'
    },
    consent: {
      title: 'Cookies',
      text: 'Wir möchten Analyse- und Werbe-Cookies (Google Analytics, PostHog und das Meta-Pixel) einsetzen, um zu verstehen, wie die Website genutzt wird, einschließlich Heatmaps zu Klicks und Scrollverhalten, und um unsere Werbung zu messen. Sie bleiben ausgeschaltet, solange Sie nicht zustimmen.',
      privacy: 'Datenschutzerklärung', accept: 'Zulassen', decline: 'Ablehnen'
    },
    plans: [
      { id: 'three', name: 'Drei-Monats-Plan', price: m(37.49), perShort: '/ Monat',
        sub: m(112.47) + ' alle 12 Wochen abgerechnet · drei Packungen', per: m(112.47) + ' alle 12 Wochen', day: m(1.34) + ' pro Tag',
        tag: 'BESTER WERT · ' + pct + ' SPAREN', save: pct + ' sparen gegenüber dem Monatsplan', rec: true,
        lines: ['Drei Packungen in einem Plan', pct + ' günstiger als der Monatspreis', 'Überspringen, pausieren oder kündigen mit zwei Klicks'],
        renew: 'Verlängert sich alle 12 Wochen für ' + m(112.47), flex: 'Überspringen, pausieren oder kündigen mit zwei Klicks.',
        cta: 'Meinen Plan starten', ctaLong: 'Meinen Plan starten · ' + m(112.47) + ' alle 12 Wochen' },
      { id: 'monthly', name: 'Monatsplan', price: m(49.99), perShort: '/ Monat',
        sub: 'Eine Packung alle 28 Tage', per: m(49.99) + ' alle 28 Tage', day: m(1.79) + ' pro Tag',
        tag: 'GERINGE BINDUNG', save: '',
        lines: ['Eine Packung pro Monat', 'Jederzeit zum Drei-Monats-Plan wechseln', 'Überspringen, pausieren oder kündigen mit zwei Klicks'],
        renew: 'Verlängert sich alle 28 Tage für ' + m(49.99), flex: 'Überspringen, pausieren oder kündigen mit zwei Klicks.',
        cta: 'Meinen Plan starten', ctaLong: 'Meinen Plan starten · ' + m(49.99) + ' alle 28 Tage' },
      { id: 'once', name: 'Einmalkauf', price: m(59.99), perShort: '',
        sub: 'Eine Packung für 28 Tage. Keine Verlängerung', per: m(59.99) + ' einmalig, eine Packung', day: m(2.14) + ' pro Tag',
        tag: 'EINMALIG', save: '',
        lines: ['Kein Abo', 'Nie reduziert'],
        renew: 'Einmalkauf. Keine Verlängerung', flex: '',
        cta: 'Jetzt kaufen', ctaLong: 'Jetzt kaufen · ' + m(59.99) }
    ]
  };
})();
