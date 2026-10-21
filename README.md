# Gleev landing (v2)

Pre-launch landing page for Gleev 360° Biom, in English (`/`) and German (`/de/`). Plain HTML, CSS and JS served as static files. The HTML is **pre-rendered by a small script**, and the generated files are committed, so nothing is built on the server.

## How it is organised

```
src/                 page templates (structure) with {{keys}} where text goes
  index.html  checkout.html  legal.html  404.html
  legal/             legal text per language: privacy.en/.de, terms.en/.de, impressum.de
  partials/          analytics.html (Google Analytics), redirect.html (browser-language redirect)
i18n/en.json         every page string, English   (key -> text)
i18n/de.json         every page string, German
js/lang/en.js, de.js strings used by the scripts: plans and prices, basket, form messages, cookie banner
tools/build.py       renders src/ + i18n/ into the final pages (see below)

index.html  checkout.html  legal/*.html          generated, English
de/index.html  de/checkout.html  de/legal/*.html  generated, German (incl. Impressum)
404.html  sitemap.xml                             generated
css/styles.css  js/*.js  assets/                  edited by hand
```

## Day to day

1. Change copy in `i18n/en.json` / `i18n/de.json`, structure in `src/*.html`, legal text in `src/legal/`, plans and prices in `js/lang/*.js`.
2. Run the build, which regenerates every page and stamps CSS/JS links with a fresh `?v=` so browsers never mix old and new files:

```bash
python3 tools/build.py
```

3. Preview, commit and push. **Do not edit the generated HTML files directly**; the next build overwrites them.

The build warns if a German key is missing (it then falls back to English) and fails on an unknown `{{key}}`.

## Languages

- URLs: `/` English, `/de/` German, linked with `hreflang` tags and listed in `sitemap.xml`.
- First visit to `/`: browsers set to German (de, de-AT, de-CH...) are sent to `/de/`. The `EN | DE` switch in the footer (and in the checkout and legal headers) stores the visitor's choice, which then always wins.
- German uses the euro sign with the same figures as the English prices (`37,49 €`). To change the format edit `money` in `js/lang/de.js`.
- Klaviyo gets a `language` property (`en` or `de`) with every sign-up, so notifications can be sent in the right language.
- The German text is a first draft: have a native speaker proofread it. Health claims must also be checked per market (EU rules differ from the UK).

## Analytics and cookies

Google Analytics 4 (`G-86W1T4YRWF`) is in every page `<head>`, but it **only loads after the visitor accepts** the cookie banner (`js/common.js`). Declining keeps it off and removes the cookies. "Cookie settings" in the footer lets people change their mind. The privacy pages describe this.

## Klaviyo

`js/config.js` holds the public key and list ID. `DRY_RUN: true` logs payloads to the console instead of sending them. Profile data: email, first and last name, and properties `plan`, `plan_name`, `quantity`, `plan_total`, `source` (`checkout_waitlist` or `footer`) and `language`. Events `Started Checkout` and `Joined Waitlist` are sent once an email is known.

## Content still to supply

Search for `PLACEHOLDER` / `PLATZHALTER` in the strings and for `tbc` in `src/legal/`: Tim's credentials and quote, strain studies for four strains, the euro price note, company details, retention periods and Impressum details. Pictures still missing: the routine section.

## Run locally

```bash
python3 -m http.server 8765
```

Open http://localhost:8765 (English) or http://localhost:8765/de/ (German).

## Deploy (GitHub Pages)

Work happens on `development`; Pages deploys that branch from the root. Custom domain `gleevhealth.com` (the `CNAME` file must stay in the repo). DNS: apex `A` records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`; `www` `CNAME` to `nurturelife.github.io`.
