#!/usr/bin/env python3
"""Stamp every local CSS/JS reference in the HTML pages with a fresh ?v=... value.

Browsers (and GitHub Pages) cache CSS/JS for several minutes. Without this, a visitor can
load the new HTML with an old script. Run it before each commit:

    python3 tools/bump_version.py
"""
import glob, re, time

version = time.strftime('%Y%m%d%H%M%S')
pattern = re.compile(r'((?:href|src)="(?:\.\./)?(?:css/[\w.-]+\.css|js/[\w.-]+\.js))(?:\?v=\d+)?(")')
changed = 0
for path in glob.glob('*.html') + glob.glob('*/*.html'):
    text = open(path, encoding='utf8').read()
    new = pattern.sub(lambda m: m.group(1) + '?v=' + version + m.group(2), text)
    if new != text:
        open(path, 'w', encoding='utf8').write(new)
        changed += 1
print('stamped %d file(s) with v=%s' % (changed, version))
