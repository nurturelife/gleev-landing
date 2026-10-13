# Gleev landing (v2)

Pre-launch landing page for Gleev 360° Biom. Plain HTML, CSS and JS: no build step, no dependencies.

```
index.html        landing page (11 sections)
checkout.html     mock checkout (name + email) and "thanks for your interest" confirmation
legal/            DRAFT terms and privacy pages (placeholders: search for "tbc" to find items to confirm)
how-to/           redirects /how-to to the home page
css/styles.css    all styling and responsive rules (tokens at the top, :root)
js/config.js      Klaviyo settings
js/data.js        plans and prices
js/cart.js        basket (localStorage) and drawer that opens from the right
js/klaviyo.js     email sign-up + events (spam traps included)
js/checkout.js    checkout page logic
js/app.js         page behaviour
assets/           images and fonts
```

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Journey

Add to basket → drawer opens from the right → **Checkout** → name and email → **Continue to delivery** → "Thanks for your interest, you're a bit early" confirmation. The lead is sent to Klaviyo when "Continue to delivery" is pressed. Nothing is charged or stored; there are no payment fields.

## Klaviyo

`js/config.js` holds the public API key (company ID) and list ID. Set `DRY_RUN: true` to log payloads to the browser console instead of sending them.

Profile data sent: email, first and last name, and properties `plan`, `plan_name`, `quantity`, `plan_total`, `source` (`checkout_waitlist` or `footer`). Events `Started Checkout` and `Joined Waitlist` are sent once an email is known (turn off with `TRACK_EVENTS: false`).

## Editing content

- Prices and plan copy: `js/data.js` (the cart and checkout read it too).
- Page copy and structure: `index.html`. Sections are marked with comments (`01 Hero` … `11 FAQ`).
- Colours, spacing, breakpoints: `css/styles.css`. Responsive rules are at the bottom (≤1039px tablet, ≤699px phone, ≤640px small phone).

## Content still to supply

Visible placeholders in the page (search for `PLACEHOLDER`): Tim's credentials and quote, per-strain studies for four strains, euro pricing note, review module and practitioner strip. Picture slots without photos (problem background, Tim's portrait, strain images, acid-test video, routine) are neutral blocks: add real images in `assets/img/` and drop them into the matching `.problem-img`, `.person-img`, `.strain-img`, `.video`, `.habit-img` elements.

## Deploy (GitHub Pages)

Work happens on the `development` branch. In the repo: Settings > Pages > Source: **Deploy from a branch** > `development` / root. Custom domain: add a `CNAME` file with the domain, set the DNS records (apex `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` `CNAME` to `nurturelife.github.io`) and tick **Enforce HTTPS** once the certificate is issued.
