// Landing page behaviour: plans, gallery, findings, tabs, FAQ, delivery stages, sticky bars, mobile menu.
(function () {
  var G = window.GLEEV;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var selected = G.DEFAULT_PLAN;
  window.GleevSelectedPlan = function () { return selected; };

  /* ---------- Plans ---------- */
  function priceLine(p) { return p.price + (p.perShort ? ' ' + p.perShort : ''); }

  function planOption(p) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'plan-opt'; b.setAttribute('role', 'radio'); b.dataset.plan = p.id;
    b.innerHTML = (p.rec ? '<span class="badge">SAVE 25%</span>' : '')
      + '<span class="radio"><i></i></span>'
      + '<span class="mid"><b>' + p.name + '</b><span>' + p.sub + '</span></span>'
      + '<span class="end"><b>' + p.day + '</b><span>' + priceLine(p) + '</span></span>';
    return b;
  }
  function planCard(p) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pcard' + (p.rec ? ' rec' : ''); b.setAttribute('role', 'radio'); b.dataset.plan = p.id;
    b.innerHTML = '<span class="row"><span class="tag">' + p.tag + '</span><span class="rd"><i></i></span></span>'
      + '<span class="nm">' + p.name + '</span>'
      + '<span class="big"><b>' + p.day + '</b><span>' + p.per + '</span></span>'
      + '<span class="pills"><span>' + priceLine(p) + '</span>' + (p.save ? '<span>' + p.save + '</span>' : '') + '</span>'
      + '<span class="ls">' + p.lines.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</span>';
    return b;
  }
  function mountPlans() {
    var list = $('#plan-list'), cards = $('#plan-cards');
    G.PLANS.forEach(function (p) { list.appendChild(planOption(p)); cards.appendChild(planCard(p)); });
    [list, cards].forEach(function (c) {
      c.addEventListener('click', function (e) { var b = e.target.closest('[data-plan]'); if (b) setPlan(b.dataset.plan); });
      c.addEventListener('keydown', function (e) {
        if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].indexOf(e.key) < 0) return;
        e.preventDefault();
        var ids = G.PLANS.map(function (p) { return p.id; });
        var i = ids.indexOf(selected) + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1);
        setPlan(ids[(i + ids.length) % ids.length]);
        var t = $('[data-plan="' + selected + '"]', c); if (t) t.focus();
      });
    });
    setPlan(selected);
  }
  function setPlan(id) {
    selected = id;
    var p = G.plan(id);
    $$('[data-plan]').forEach(function (b) {
      var on = b.dataset.plan === id;
      b.setAttribute('aria-checked', on);
      b.tabIndex = on ? 0 : -1;
    });
    $$('[data-bind]').forEach(function (n) { n.textContent = p[n.dataset.bind] || ''; });
  }

  /* ---------- Gallery ---------- */
  function mountGallery() {
    var tabs = $$('#shop-thumbs .thumb'), figs = $$('#shop-main figure'), box = $('#shop-thumbs');
    function show(i) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
      figs.forEach(function (f, k) { f.classList.toggle('is-on', k === i); });
      var t = tabs[i];
      if (box.scrollHeight > box.clientHeight + 1) {
        var top = t.offsetTop - box.offsetTop;
        if (top < box.scrollTop) box.scrollTo({ top: top, behavior: 'smooth' });
        else if (top + t.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTo({ top: top + t.offsetHeight - box.clientHeight, behavior: 'smooth' });
      } else if (box.scrollWidth > box.clientWidth + 1) {
        var left = t.offsetLeft - box.offsetLeft;
        if (left < box.scrollLeft) box.scrollTo({ left: left, behavior: 'smooth' });
        else if (left + t.offsetWidth > box.scrollLeft + box.clientWidth) box.scrollTo({ left: left + t.offsetWidth - box.clientWidth, behavior: 'smooth' });
      }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0; if (!d) return;
        e.preventDefault(); var n = (i + d + tabs.length) % tabs.length; show(n); tabs[n].focus();
      });
    });
    // Swipe on the main image
    var main = $('#shop-main'), x0 = null;
    main.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 40) return;
      var cur = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
      show((cur + (dx < 0 ? 1 : -1) + tabs.length) % tabs.length);
    }, { passive: true });
    show(0);
  }

  /* ---------- Findings, tabs, FAQ (one open at a time) ---------- */
  function mountDisclosures() {
    var findings = $$('#findings .finding');
    function setFinding(f, on) {
      f.setAttribute('aria-expanded', on);
      $('.sign', f).textContent = on ? '\u2212' : '+';
      $('.more', f).hidden = !on;
    }
    // Keep the whole "Scientist formulated" section tall enough for the biggest open card,
    // so opening a card never changes the page height. Content is centred vertically.
    function fitScience() {
      var grid = $('.science-grid');
      if (!grid || !findings.length) return;
      var was = findings.map(function (f) { return f.getAttribute('aria-expanded') === 'true'; });
      grid.style.minHeight = '';
      var max = grid.offsetHeight;
      findings.forEach(function (f) {
        findings.forEach(function (o) { setFinding(o, o === f); });
        max = Math.max(max, grid.offsetHeight);
      });
      findings.forEach(function (o, i) { setFinding(o, was[i]); });
      grid.style.minHeight = max + 'px';
    }
    var fitTimer;
    window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitScience, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitScience);
    window.addEventListener('load', fitScience);
    fitScience();
    findings.forEach(function (f) {
      f.addEventListener('click', function () {
        var open = f.getAttribute('aria-expanded') !== 'true';
        findings.forEach(function (o) { setFinding(o, o === f && open); });
      });
    });

    var tabs = $$('#inside-tabs .tab'), panels = $$('.tab-panel');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t); });
        panels.forEach(function (p) { p.classList.toggle('is-on', p.dataset.panel === t.dataset.tab); });
      });
    });

    var faqs = $$('#faq-list .faq-item');
    faqs.forEach(function (item) {
      var btn = $('.faq-btn', item);
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        faqs.forEach(function (o) {
          var on = o === item && open;
          $('.faq-btn', o).setAttribute('aria-expanded', on);
          $('i', o).textContent = on ? '−' : '+';
          $('p', o).hidden = !on;
        });
      });
    });
  }

  /* ---------- 05 How it works: the pill follows the page scroll while the panel is pinned ---------- */
  function mountStages() {
    var scroll = $('#how-scroll'), pin = $('#how-pin'), track = $('#how-track');
    var stages = $$('.stage', track), beats = $$('.beat', $('#how'));
    var cur = -1, ticking = false;
    function clamp(n) { return Math.min(1, Math.max(0, n)); }
    function pinTop() { return parseFloat(getComputedStyle(pin).top) || 0; }
    function travel() { return scroll.offsetHeight - pin.offsetHeight; }
    // A short, fixed pinned stretch: the pill moves quickly and the next section follows straight after.
    function layout() {
      var t = window.innerWidth < 700 ? 130 : 170;
      scroll.style.minHeight = (pin.offsetHeight + t) + 'px';
    }
    function progress() {
      var r = scroll.getBoundingClientRect(), d = travel();
      return d > 0 ? clamp((pinTop() - r.top) / d) : 0;
    }
    function apply() {
      ticking = false;
      var t = progress();
      track.style.setProperty('--p', (12 + t * 75) + '%');
      var idx = Math.round(t * 3);
      if (idx === cur) return;
      cur = idx;
      stages.forEach(function (s, i) { s.classList.toggle('on', i <= idx); });
      beats.forEach(function (b, i) {
        var n = i % 4;
        b.classList.toggle('done', n <= idx);
        b.classList.toggle('cur', n === idx);
        b.setAttribute('aria-pressed', n === idx);
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
    function jump(i) {
      var y = window.scrollY + scroll.getBoundingClientRect().top - pinTop() + (i / 3) * travel() + 1;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    stages.forEach(function (s, i) { s.addEventListener('click', function () { jump(i); }); });
    beats.forEach(function (b, i) { b.addEventListener('click', function () { jump(i % 4); }); });
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', function () { layout(); req(); });
    layout();
    apply();
  }

  /* ---------- Sideways rows (strains, reviews): visible progress bar + arrows ---------- */
  function mountRows() {
    $$('.strain-row, .review-row').forEach(function (row) {
      var nav = row.nextElementSibling;
      if (!nav || !nav.classList.contains('strain-nav')) return;
      var bar = $('.strain-progress i', nav), arrows = $$('.arrow', nav);
      function update() {
        var max = row.scrollWidth - row.clientWidth;
        var w = row.scrollWidth ? Math.min(100, row.clientWidth / row.scrollWidth * 100) : 100;
        bar.style.width = w + '%';
        bar.style.left = (max > 0 ? row.scrollLeft / max * (100 - w) : 0) + '%';
        arrows[0].disabled = row.scrollLeft <= 2;
        arrows[1].disabled = row.scrollLeft >= max - 2;
      }
      arrows.forEach(function (a) {
        a.addEventListener('click', function () {
          var card = row.firstElementChild;
          var step = card ? card.offsetWidth + 12 : row.clientWidth * 0.8;
          row.scrollBy({ left: step * Number(a.dataset.dir), behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      });
      row.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ---------- Mobile menu ---------- */
  function mountMenu() {
    var btn = $('.menu-btn'), menu = $('#mobile-menu');
    function set(on) { btn.setAttribute('aria-expanded', on); menu.classList.toggle('is-on', on); }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    window.matchMedia('(min-width:1040px)').addEventListener('change', function () { set(false); });
  }

  /* ---------- Sticky bars ---------- */
  function mountBars() {
    var hero = $('[data-hero]'), plans = $('[data-plans]');
    var top = $('#topbar'), bottom = $('#bottombar');
    var ticking = false, last = {};
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var h = hero.getBoundingClientRect(), pl = plans.getBoundingClientRect();
      var showSticky = h.bottom < 0;
      var plansInView = pl.top < vh * 0.8 && pl.bottom > vh * 0.2;
      if (last.sticky !== showSticky) {
        top.classList.toggle('is-on', showSticky);
        top.setAttribute('aria-hidden', !showSticky);
        $('.topbar-cta', top).tabIndex = showSticky ? 0 : -1;
      }
      var showBottom = showSticky && !plansInView;
      if (last.bottom !== showBottom) bottom.classList.toggle('is-on', showBottom);
      last.sticky = showSticky; last.bottom = showBottom;
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  }

  function init() { mountPlans(); mountGallery(); mountDisclosures(); mountStages(); mountRows(); mountMenu(); mountBars(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
