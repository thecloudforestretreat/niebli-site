# Niebli website

Niebli tells the history of the land and the family, with future pages for family businesses. Cloudflare Pages deploys the main branch.

## Analytics

Owner: Nuestroniebli Google account. GA4 account 411117438, property 557943520, measurement ID `G-JSJP1427M4`, website stream 16060918129. GTM container `GTM-WHL6R22F`. Search Console domain property `niebli.com` is DNS verified.

Load `/assets/js/analytics.js` once on each public page. It loads GTM only after visitors allow analytics, only on niebli.com or www.niebli.com. Advertising consent stays denied. Local and pages.dev previews do not send data. The coming-soon page has only baseline visits and engagement; future content needs the markup below. Never install a second GA4 snippet.

## Measuring stories and businesses

Use stable public IDs; never use visitor information, private family information, email addresses, or form contents as event parameters.

```html
<article data-story-id="land-origins" data-content-section="land" data-historical-period="1900-1949">
  <!-- Story content. Tracks visible views, section-relative scroll 25/50/75/90%, and foreground visible time 30/60/120 seconds. -->
  <button data-analytics-event="timeline_select" data-interaction-id="1900">1900</button>
</article>
<section data-business-id="cloud-forest-retreat" data-content-section="businesses">
  <a href="https://thecloudforestretreat.com/" data-analytics-event="business_referral">Visit the business</a>
</section>
<a href="mailto:nuestroniebli@gmail.com" data-analytics-event="contact_click" data-contact-method="email">Contact</a>
<audio controls data-story-id="oral-history-01" src="/assets/audio/history.mp3"></audio>
```

Other click hooks: `family_branch_select`, `gallery_open`, `map_interaction`. Oral history hooks measure start, 25/50/75% progress, and completion on native audio/video. YouTube embeds use GA4 enhanced measurement and require supported JS API setup.

Send `window.niebliAnalytics.track('sign_up', {content_section:'newsletter'})` or `generate_lead` only after the server confirms success. Do not treat generic form_submit, contact clicks, or reading as successful inquiries. Outbound business clicks measure referrals; actual bookings or sales require agreed destination-side instrumentation, possibly cross-domain measurement. Do not add unrelated business domains to the same property without deciding ownership and consent.

Story reading time is an engagement proxy, not proof that every word was read. Short sections may reach several progress thresholds on one scroll. IDs and listeners are initialized on page load; dynamic content must use the public track API or extend the registration code.

## Attribution convention

External campaign links use lowercase stable `utm_source`, `utm_medium`, `utm_campaign` and optionally `utm_content`/`utm_term`. Example: `https://niebli.com/?utm_source=instagram&utm_medium=organic_social&utm_campaign=family_history_launch&utm_content=land_story`. Never put personal data in UTMs. Do not add UTMs to links between Niebli pages: that can distort acquisition reporting. GA4 reporting takes processing time; Realtime is for collection checks. Search Console provides organic search queries, clicks, impressions, CTR, and position independently of browser cookie consent.

## QA before each content launch

Check fresh-browser decline produces no GTM load; allow produces one GA4 page_view. Verify custom content events and public IDs in Tag Assistant/GA4 DebugView, including mobile and keyboard navigation. Confirm each successful form emits once only after confirmation, outbound referrals include the right business_id, and no private fields reach Google. Check campaign source/medium in acquisition reports after processing. Ad blockers and declined consent reduce analytics coverage.

## Staging and releases

Develop on `staging`, automatically deployed to `https://staging.niebli-site.pages.dev`. Feature branches also receive Pages previews. `main` remains production at https://niebli.com. Cloudflare previews carry a noindex header; production analytics is disabled on pages.dev by the hostname guard. A preview is not private unless Cloudflare Access is enabled. This repository is public: never commit secrets, private family records, or unpublished material that must remain confidential.

Review staging on phone and desktop, test links, keyboard navigation, media, forms, accessibility, and analytics hooks before opening a pull request from staging to main. Merge only after the owner approves the release. Cloudflare retains previous deployments for rollback.

## Turnstile

Managed widgets are separate for production (`niebli.com`, site key `0x4AAAAAAFQZI2xH1DMZg0xh`) and staging (`staging.niebli-site.pages.dev`, site key `0x4AAAAAAFQZJSrYZhZo9CzX`). Pre-clearance is disabled. Their private keys are stored as `TURNSTILE_SECRET_KEY` in the matching Cloudflare Pages Production and Preview secret environments, never in GitHub or client JavaScript. Secrets take effect on the next deployment.

`/turnstile-test` on staging tests the client widget and `/api/turnstile-check` server validation. The diagnostic endpoint rejects requests outside the named staging branch and stable staging hostname. It saves no data and sends no messages. Production has no form yet; when one is added, embed its production widget and call the exported `verifyTurnstile` gate inside that form's actual submission handler before any email, storage, or success response. Set a matching per-form action and exact expected hostname. Do not treat the test endpoint as authorization for a later submission: tokens expire and are single-use. Handle expired, invalid, duplicate, and unavailable verification by rejecting the submission. Add rate limiting appropriate to the eventual endpoint.

For local automated tests, use Cloudflare's official Turnstile test keys; do not add localhost to the production widget or use test secret keys in deployed environments. Never log tokens or secret keys.

## Approved branding

The approved smooth-cloud master is installed from the owner's `Niebli-Final-Brand-Kit`. Shared tokens and locally hosted Playfair Display/Montserrat are in `/assets/css/brand.css`; `site.css` and `header.css` import it. The landing page uses `landing.css` for its existing layout. Fonts retain their OFL licenses in `/assets/fonts/`.

`/assets/brand/logos/` contains the approved outlined SVGs in forest, paper, copper, white and black. `/assets/brand/social/` includes symbol-only and accented NIEBLÍ circular wordmarks. Use paper or white on forest for small readable branding; copper on forest is decorative. Favicons, Apple touch icon and the web manifest use the symbol alone. `/assets/images/homepage/niebli-landscape.jpg` is the owner's actual photograph. Every public HTML page includes the shared tokens and favicon links directly, without relying on JavaScript.
