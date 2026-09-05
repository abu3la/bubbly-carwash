# Landing pilot review — 2026-09-05

Routes: `/ar`, `/en` and the existing `/` entry, in `apps/landing`. No other app was visually restyled. Naming changes were separately requested; [migration scope](../../BRAND_MIGRATION.md).

## Reference and intentional differences

The exported HTML, styles, used bundle components, phone frame, strings and data fixtures were inspected; the original prototype was also rendered locally for comparison. Every imported file and shipped SVG was verified byte-for-byte against the ZIP. The handoff's actual violet/guava/yellow/ice palette is authoritative, as explicitly confirmed by the user. Conflicting petrol notes were rejected.

The original composition, SVG geometry, font families, source token ramp, section order, responsive grids, two phone previews and five-row pricing layout are retained. Differences are deliberate:

- User's headline: **غسيل سيارتك عند بيتك بأعلى جودة**; English translation uses the existing 56px display step on desktop to avoid a three-line heading.
- Prices and localized plan names come from the real public catalogue. The prototype used a local fixture and English plan names even in Arabic. The five prices match: 40, 199, 269, 299, 399 SAR. Other backend catalogue services were not removed or altered.
- Explicit demo labels distinguish the placeholder villa registry, fixed sample date/time slots and illustrative phone screens from real service availability and customer records. The backend's existing coverage remains unchanged; the Sharbatly/Jeddah design copy is not used to alter the existing Makkah service configuration.
- The existing Operations link remains available in the footer. Subscription stays disabled until a destination exists; unavailable legal/store links stay hidden. No placeholder canonical/OG domain is emitted; `noindex` stays on.
- Exact original IBM Plex font files are self-hosted. No CDN runtime, React 18 UMD, Babel-in-browser or Claude support runtime ships with the page; it uses the existing React 19/Next.js application.
- Mobile nav spacing fixes 4px horizontal overflow at 390px. Arabic leading clears glyphs, LTR isolates protect time ranges, and ticket notch/stub geometry follows RTL. Small slot ranges stay on one line at 360px.
- Dark-section field labels and focus states, inactive tracker text, guava seal text and disabled CTA text were made readable. Source text at ink 56% measured about 4.03:1 on cloud; small journey/table labels now use the existing ink 72% token.
- Menu scroll calculation occurs after collapse, retaining a 15px gap below the sticky header. Escape closes the menu and returns focus. Input edits cancel pending demo checks. Input hints are associated programmatically.

## Browser checks

Performed on the local running application through the browser, with Arabic/RTL and English/LTR:

- Desktop 1440×1000; mobile 390×844; additional 360×800 overflow check. Confirmed no horizontal document overflow at the mobile widths. Desktop hero owns the viewport; no stray following section appears in the initial frame.
- Mobile menu opens/closes, navigation closes the menu and reaches its section below the sticky header, Escape dismisses, keyboard focus reaches controls. Logo returns to the top.
- Both locale switches work; route, title, document language and direction update. Direct HTTP responses also contain the correct `html lang/dir` and a populated heading before JavaScript runs.
- Real pricing fetch displays all five rows. Forced loading/error review states render; clicking Retry fetches real prices and restores the table.
- Villa 112 and Arabic-digit `١١٢` resolve to the supplied **demo** record; 45 resolves after editing; 999 produces the unserved message; `!!` produces the invalid/check-error message. Checking feedback is visible. Editing during a pending check cancels the stale result.
- Sample availability and no-slots states render. The post-check Subscribe button is disabled. No booking, payment, location lookup, authentication or customer data mutation was performed.
- Route animation uses a defined CSS Modules keyframe. Reduced-motion rules disable animations/transitions; server-rendered content does not depend on reveals. The OS motion preference was not changed during the review.
- Text contrast was checked from computed foreground/background values, with manual visual review of the hero, navigation and coverage form. This is a focused review, not an accessibility certification.

## Code and asset checks

- `pnpm type-check`: all 13 workspace packages passed.
- `pnpm lint`: all 13 packages passed.
- Landing production build and dashboard production build passed. Existing Next.js warning: its optional ESLint plugin is not installed in the shared lint configuration.
- API `wrangler deploy --dry-run --config wrangler.dev.jsonc`: bundled successfully; no upload/deploy performed.
- `node scripts/verify-brand-migration.mjs`: existing customer/driver sessions and language preferences migrate intact; newer values win; sign-out clears both keys; storage-write failure preserves old data.
- `git diff --check` passed. No publish, merge, secret change, database statement, remote deletion or media move performed.

## Remaining launch inputs

Real villa registry and availability integration, real car photos, subscription route, legal pages, app-store destinations and production SEO assets/domain are absent. Pricing tax treatment is unspecified. The legacy Cloudflare resource/endpoint migration remains pending because publishing was excluded. These gaps are documented, not guessed.

## Design-law recheck

Reviewed the supplied general design instructions against this specific approved handoff. The handoff expressly governs its purple palette, IBM Plex families, split hero, pill buttons, action pairing, labels, rules, phone-frame shadows and small status seals; those were not replaced by generic aesthetic preferences. The supplied logos, custom compound SVG and original section structure provide the identity. No invented customer logos/testimonials, decorative code window, pricing-card preset, countdown, theme toggle, gradient background, glow, hover lift or entrance-hidden content was added.

Checked the execution requirements independently of those approved exceptions: coherent colors/type, real asset fidelity, readable contrast, centered controls and status marks, aligned pricing columns, margins, glyph/shape clipping, route/track animation behavior, reduced-motion fallback rules, responsive navigation, complete time text, original content/data preservation and actual control responses. Fixed the failures listed above rather than claiming the prototype itself was flawless.

## Screenshots

- [Arabic desktop](desktop-ar.png), [English desktop](desktop-en.png)
- [Arabic mobile](mobile-ar.png), [English mobile](mobile-en.png)
- Full-page browser capture was omitted because stitching duplicated sections; viewport captures above are the review images. DOM verification confirms five unique section headings.

## Publication follow-up — 2026-09-05

User authorized deployment to https://bubblescarwash.co in the Taz account.
- Removed the complete Coming section in both languages.
- Added disabled App Store / Google Play buttons under a native hidden container; no guessed store URLs.
- Disabled all subscription CTAs, including mobile navigation, hero, packages and coverage.
- Built with OpenNext, deployed Worker `bubbles-site` in account `57118b773c4166fafe8b041d792cb2ef`.
- Domain uses Worker route `bubblescarwash.co/*`; existing proxied DNS records are preserved. Initial custom-domain attachment conflicted with those records and was replaced by this successful route configuration.
- Verified live Arabic and English, mobile and 1440px desktop, no horizontal overflow, hidden downloads, disabled subscription controls, language switching and catalogue loading. Browser reported no errors/warnings.
- Landing lint, type-check and Cloudflare production build passed. Demo villa data and noindex remain as documented; no merge or changes to API/data services.
- [Published desktop screenshot](published-desktop-ar.png).

## Side-by-side previews and pricing refresh — 2026-09-05

- Both original phone previews now share a two-column grid at every viewport. Canvas scaling preserves the original frame and content; labels stay unscaled. Verified equal top coordinates and no page overflow at 1440px and 390px, and visually checked both layouts.
- Reviewed Bloom pricing in the authenticated Mobbin gallery: https://mobbin.com/screens/4999c558-9dcd-412f-b522-0ceb3ed6a83b. Adapted prominent price hierarchy, aligned plans and a frequency selector into the Bubbles palette. No reference assets or business claims copied.
- Native radio group switches live catalogue prices: 199/299 for two washes and 269/399 for three washes; single wash stays 40 SAR. Verified Arabic/English, pointer and arrow-key selection. All subscription buttons remain disabled; downloads hidden.
- Landing lint, type-check, OpenNext build and whitespace checks passed. Published Worker version `e290ed55-4628-47ee-829b-ed5b4b365e3a` to bubblescarwash.co. A refreshed browser load confirms the new production UI and working price selector.
- [Published pricing screenshot](published-pricing-ar.png).

## Terms and footer — 2026-09-05

Added `/ar/terms`, `/en/terms`, and `/terms` redirect, linked from pricing and footer. Customer-missed weekly washes do not carry over as credit; provider-caused cancellations are outside this condition. No cancellation fees or refund deadlines invented. Wording reviewed against the Ministry of Commerce e-commerce resources (https://mc.gov.sa/ar/ecc/pages/default.aspx); statutory rights remain unaffected. This is the specified service policy, not a claim of a comprehensive legal compliance audit.

Removed the Operations link and extra CarWash logo suffix. Footer now uses canonical ice with original Bubbles logo and readable ink text; coverage retains ink. Fixed terms locale navigation and Arabic font inheritance. Verified actual links, AR/EN document directions, mobile and desktop readability, distinct backgrounds, no overflow, exact policy text, and absence of dashboard link. Build, lint, type-check and diff checks passed. Published version `dfabdb4e-160f-44e9-a125-440bc26e155c`; live Arabic terms and footer verified. [Footer screenshot](published-footer-ar.png).
