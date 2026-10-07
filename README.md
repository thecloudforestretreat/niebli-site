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
