#!/usr/bin/env python3
"""Pre-render the English and German pages from the templates in src/ and the strings in i18n/.

    python3 tools/build.py

Edit copy in i18n/en.json and i18n/de.json (key -> text), page structure in src/*.html,
legal text in src/legal/*.html. The generated HTML files are committed, so the site stays
plain static files (no build step on the server). Run this before every commit.
"""
import json, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://gleevhealth.com/'
V = time.strftime('%Y%m%d%H%M%S')
EMAIL = '<a href="mailto:hi@gleevhealth.com">hi@gleevhealth.com</a>'

def read(*p):
    with open(os.path.join(ROOT, *p), encoding='utf8') as f: return f.read()
def write(path, text):
    full = os.path.join(ROOT, path); os.makedirs(os.path.dirname(full) or ROOT, exist_ok=True)
    with open(full, 'w', encoding='utf8') as f: f.write(text)

STR = {l: json.loads(read('i18n', l + '.json')) for l in ('en', 'de')}
missing, used = set(), set()
ANALYTICS = read('src', 'partials', 'analytics.html').rstrip()
REDIRECT = read('src', 'partials', 'redirect.html')

def render(tpl, lang, v):
    strings = STR[lang]
    def sub(m):
        k = m.group(1)
        if k in v: return v[k]
        if k in strings: used.add((lang, k)); return strings[k]
        if k in STR['en']: missing.add((lang, k)); return STR['en'][k]
        raise KeyError('unknown key {{%s}}' % k)
    for _ in range(4):
        new = re.sub(r'\{\{([A-Za-z0-9_.-]+)\}\}', sub, tpl)
        if new == tpl: break
        tpl = new
    return tpl

def switch(lang, href_en, href_de):
    def a(code, href):
        cur = ' class="is-current" aria-current="true"' if code == lang else ''
        return '<a href="%s" hreflang="%s" lang="%s" data-lang="%s"%s>%s</a>' % (href, code, code, code, cur, code.upper())
    return ('<span class="lang-switch" role="group" aria-label="%s">%s<span aria-hidden="true">|</span>%s</span>'
            % (STR[lang]['lang.aria'], a('en', href_en), a('de', href_de)))

LANG = {'en': dict(og='en_GB', alt='de_DE', pre='', root=''), 'de': dict(og='de_DE', alt='en_GB', pre='de/', root='../')}
HREFLANG = ('<link rel="alternate" hreflang="en" href="%s">\n<link rel="alternate" hreflang="de" href="%s">\n'
            '<link rel="alternate" hreflang="x-default" href="%s">' % (SITE, SITE + 'de/', SITE))

def base_vars(lang, root):
    return dict(lang=lang, root=root, v=V, analytics=ANALYTICS, email=EMAIL,
                og_locale=LANG[lang]['og'], og_locale_alt=LANG[lang]['alt'])

# ---- home ----
tpl = read('src', 'index.html')
for lang in ('en', 'de'):
    L = LANG[lang]; v = base_vars(lang, L['root'])
    v.update(canonical=SITE + L['pre'], hreflang=HREFLANG, redirect=REDIRECT if lang == 'en' else '',
             langswitch=switch(lang, '../' if lang == 'de' else './', './' if lang == 'de' else 'de/'),
             impressum_link='<a href="legal/impressum.html">%s</a>' % STR['de']['footer.impressum'] if lang == 'de' else '')
    write(L['pre'] + 'index.html', render(tpl, lang, v))

# ---- checkout ----
tpl = read('src', 'checkout.html')
for lang in ('en', 'de'):
    L = LANG[lang]; v = base_vars(lang, L['root'])
    v.update(langswitch=switch(lang, '../checkout.html' if lang == 'de' else 'checkout.html', 'checkout.html' if lang == 'de' else 'de/checkout.html'))
    write(L['pre'] + 'checkout.html', render(tpl, lang, v))

# ---- legal pages (body text per language in src/legal/<name>.<lang>.html) ----
layout = read('src', 'legal.html')
LEGAL = {'privacy': ('en', 'de'), 'terms': ('en', 'de'), 'impressum': ('de',)}
for name, langs in LEGAL.items():
    for lang in langs:
        L = LANG[lang]; v = base_vars(lang, '../' + L['root'])
        body = read('src', 'legal', '%s.%s.html' % (name, lang)).rstrip()
        if lang == 'en':
            sw = switch('en', name + '.html', '../de/legal/%s.html' % name) if 'de' in langs else ''
        else:
            sw = switch('de', ('../../legal/%s.html' % name) if 'en' in langs else '../../index.html', name + '.html')
        v.update(langswitch=sw, page_title=STR[lang]['legal.%s.title' % name], body=body)
        write(L['pre'] + 'legal/%s.html' % name, render(layout, lang, v))

# ---- 404 ----
write('404.html', render(read('src', '404.html'), 'en', dict(base_vars('en', '/'), langswitch='')))

# ---- sitemap ----
sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for loc in (SITE, SITE + 'de/'):
    sm.append('  <url><loc>%s</loc>' % loc)
    sm.append('    <xhtml:link rel="alternate" hreflang="en" href="%s"/>' % SITE)
    sm.append('    <xhtml:link rel="alternate" hreflang="de" href="%sde/"/>' % SITE)
    sm.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>' % SITE)
    sm.append('  </url>')
sm.append('</urlset>')
write('sitemap.xml', '\n'.join(sm) + '\n')

# ---- report ----
untranslated = sorted(k for l, k in missing if l == 'de')
print('built: index, checkout, privacy, terms (EN+DE), impressum (DE), 404, sitemap  | v=%s' % V)
if untranslated:
    print('WARNING %d German keys fall back to English:' % len(untranslated)); [print('  ', k) for k in untranslated[:40]]
unused = sorted(k for k in STR['en'] if ('en', k) not in used and not k.startswith(('legal.', 'lang.', 'footer.impressum')))
if unused: print('note: %d English keys are not used by any template: %s' % (len(unused), ', '.join(unused[:12]) + (' ...' if len(unused) > 12 else '')))
sys.exit(1 if untranslated else 0)
