# Bubbles design system

## Approved source

[Claude project](https://claude.ai/design/p/b91dd6e6-c743-47fc-a332-eb1b88943db1?file=BubblesCarWash+Landing.dc.html), imported from the user's `Repo connection and palette choice-handoff.zip` on 2026-09-05. The original export is preserved in [design/claude/project](design/claude/project); production does not execute `support.js` or the compiled design runtime.

**Authority:** the user confirmed the actual HTML/CSS handoff colors, explicitly rejecting petrol. The petrol paragraphs in `BubblesCarWash - Notes.md` are stale. Approved Bubbles files override general aesthetic preferences and [historical design guidance](docs/DESIGN_SYSTEM.md), while preserving readability and accessibility. The requested Arabic headline is **غسيل سيارتك عند بيتك بأعلى جودة**.

## Source → implementation

| Concern | Canonical reference | Application entry |
| --- | --- | --- |
| Composition / responsive rules | [Landing HTML](design/claude/project/BubblesCarWash%20Landing.dc.html) | [LandingPage](apps/landing/components/LandingPage.tsx), [layout CSS](apps/landing/styles/landing.module.css) |
| Colors, spacing, typography, effects | [tokens](design/claude/project/_ds/bubbles-design-system-9de8efbd-0623-4c1a-ab59-9938b468e3ce/tokens) | [token entry](apps/landing/styles/tokens.css) imports the originals; page-specific alpha colors/dimensions live here |
| Component styles / states | [components.css](design/claude/project/_ds/bubbles-design-system-9de8efbd-0623-4c1a-ab59-9938b468e3ce/components/components.css), [_ds_bundle.js](design/claude/project/_ds/bubbles-design-system-9de8efbd-0623-4c1a-ab59-9938b468e3ce/_ds_bundle.js) | [React primitives](apps/landing/components/primitives.tsx), [accessibility overrides](apps/landing/app/globals.css) |
| Fonts | [fonts.css](design/claude/project/_ds/bubbles-design-system-9de8efbd-0623-4c1a-ab59-9938b468e3ce/tokens/fonts.css) | [local font CSS](apps/landing/styles/fonts.css), [files, source URLs, hashes and license](apps/landing/public/fonts) |
| Logos | [supplied SVG assets](design/claude/project/assets) | Exact copies in [public/brand](apps/landing/public/brand); do not redraw or substitute |
| Signature illustration | SVG in the approved HTML | [CompoundPlan](apps/landing/components/CompoundPlan.tsx), original geometry and route |
| Before/after phone previews | [ios-frame.jsx](design/claude/project/ios-frame.jsx), HTML and bundle components | Shared [TrackingPreview](apps/landing/components/TrackingPreview.tsx); previews are explicitly illustrative |
| Arabic / English copy | [landing-i18n.js](design/claude/project/landing-i18n.js) | [strings.ts](apps/landing/components/strings.ts), with the user-requested headline; [useLanding](apps/landing/components/useLanding.ts) owns locale/menu/demo state |
| Real pricing | Existing `/catalogue` API | [read-only pricing adapter](apps/landing/app/api/pricing/route.ts); no fixture fallback |

## Actual rules

- Palette: violet `#5A42FF`, guava `#FF5E7E`, yellow `#FFD84D`, ice `#BDEEFF`, ink `#17162E`, cloud `#FAFAF5`. Use the imported semantic aliases, not duplicated hex values. The dark sections use the handoff's ink, not the old petrol web theme.
- IBM Plex Sans and IBM Plex Sans Arabic, weights 400/500/600/700. The handoff references Google-hosted font files rather than including binaries; the **same families and weights** were fetched and self-hosted, with provenance and license. No lookalike typefaces.
- Spacing ramp: 4/8/12/16/20/24/32/40/48/64/80/96px; card padding 20px, base gutter 24px. Typography scale: 11/12/14/16/18/20/28/40/56px; the landing adds its explicit responsive headline sizes. The landing's original maximum width, responsive display sizes and section padding are retained. The layout module uses canonical spacing/type/radius tokens wherever values match.
- Buttons: primary/secondary/dark/ghost, 32/42/52px source sizes; hover, active, focus and disabled styles. Input: label/hint/error, 44px height, hover/focus border. Native semantic buttons/inputs retain keyboard behavior. BeatIcon, status seals and booking ticket follow the supplied components.
- At 960px the navigation switches to a mobile menu. Source auto-fit grids stack on narrow screens. Language sets `lang`/`dir`, local choice uses `bcw-lang`, `/ar` and `/en` are the same page; direct visits have the correct document language before hydration via [middleware](apps/landing/middleware.ts).
- Original route/shine/journey motion is retained; reduced-motion disables it. Content is server-rendered and visible by default. No entrance animation gates content.

## Scope, reuse and unresolved inputs

Only the existing landing application changes visually. It already had independent Next.js/React and CSS, so it is the lowest-impact match to the handoff. The user subsequently removed the Operations footer link. Existing `libs/ui-web` primitives and `src/webCss.ts` consume the historical petrol system and do **not** match this handoff; importing their global body rules would affect the whole page. The pilot therefore scopes approved primitives/styles to the landing. Shared native/application tokens and other app interfaces were not restyled.

The handoff does not define a global theme switch or responsive/RTL behavior for every unused library component. Its notes mention a before/after range slider and polygon checker, but the actual HTML implements two phone previews and a villa registry lookup; the unused `outside` message has no reachable registry path.

The handoff does **not** provide a real villa registry, live villa-to-availability service, car photographs, subscription destination, privacy/support pages, store links or OG images. Coverage lookup and slots remain clearly labeled demo data; booking stays disabled, absent destinations stay hidden, placeholder canonical/OG URLs are omitted, and `noindex` remains. No invented coverage/service launch claims are used as evidence of real backend support. Pricing loads real catalogue values and bilingual names; VAT remains unspecified.

Deliberate prototype fixes: mobile nav overflow, Arabic headline leading, LTR time ranges inside RTL, ticket notch/stub alignment, readable inactive preview steps and status seals, input labels on dark surfaces, disabled-button contrast, mobile-menu scroll offset, input hint association, Escape dismissal and stale-check cancellation. See [review record](docs/review/landing/REVIEW.md) for checks and screenshots.

The separately requested Bubbles naming migration spans package identifiers and configs; see [BRAND_MIGRATION.md](docs/BRAND_MIGRATION.md). Live Cloudflare endpoints/bucket and legacy-session compatibility are retained until a coordinated cutover. The user subsequently authorized publishing the landing to `bubblescarwash.co` in the Taz account; other app/resource cutovers and merging remain out of scope.

## Local review

`pnpm --filter @bubbles/landing dev --port 4181` → `/ar` and `/en`. Development-only `?preview=pricing-error`, `?preview=pricing-loading`, `?preview=slots-none` expose existing review states. To inspect those states in a local production build, set `BUBBLES_DESIGN_PREVIEW=1` when starting it. This flag is not set in deployment configs.

Checks: `pnpm type-check`, `pnpm lint`, landing/dashboard builds, and `node scripts/verify-brand-migration.mjs`. The legacy web token generator now points at the actual `src/webCss.ts`; do not regenerate it to restyle the pilot or change shared consumers unintentionally.

## Published landing follow-up

The user removed the entire Coming section. App Store and Google Play download buttons are present in a native `hidden` container and disabled until official destinations are supplied. All subscription CTAs are disabled, including navigation, hero, packages and coverage. Production domain: `bubblescarwash.co`, Worker `bubbles-site`, Taz account.

Before/after previews remain side by side at every viewport, as requested. The original phone canvas scales proportionally inside two equal columns; comparison labels stay at normal text size.

Pricing uses [PricingComparison](apps/landing/components/PricingComparison.tsx): two live subscription panels filtered by a native weekly-frequency radio group, plus a separate single-wash row. Reference reviewed in Mobbin: [Bloom pricing](https://mobbin.com/screens/4999c558-9dcd-412f-b522-0ceb3ed6a83b), adapted for hierarchy and aligned comparisons only. Bubbles fonts, palette and actual catalogue data remain authoritative; no inferred benefits, discounts or popularity claims.

Terms are available at `/ar/terms` and `/en/terms`, linked from pricing and the footer. The missed-appointment rule applies to customer-caused missed appointments only. Footer uses ice and the original Bubbles-only logo; the extra CarWash text and Operations link were removed at the user’s request.

The pricing footnote is only the linked phrase “تطبق الشروط والأحكام” / “Terms and conditions apply”. The detailed missed-appointment policy remains on the terms page.

The user restored the handoff’s 0.38 opacity for pending WASHED and VERIFIED rows in the before-wash preview. ARRIVED and all after-wash rows remain at full opacity.

Hero height is content-driven at all sizes. The desktop compound illustration is capped at 480px wide so the next section can appear within a typical desktop viewport; no full-screen minimum height is imposed on mobile.

## Customer, driver and coverage expansion (2026-09-05, local)

The user subsequently requested changes across both mobile applications, the API and dashboard. This expands the earlier landing-only pilot scope. Native controls retain the approved Bubbles palette and Plex fonts, with accessibility/height/inset corrections. Dashboard coverage imports the approved source tokens and self-hosts the exact supplied brand/font assets. See [implementation review](docs/review/customer-driver-coverage/REVIEW.md) for the new flows, verification and the remaining boundary and visual-acceptance inputs. This follow-up is not yet deployed.
