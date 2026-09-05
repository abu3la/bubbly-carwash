# Customer, driver and coverage implementation

Date: 2026-09-05. This is a local implementation review, not a deployment record.

## Delivered behavior

- Customer screens say monthly packages, show catalogue prices, two/three weekly visits and the 30-day cycle. No loyalty club or invented priority benefit.
- Profile reads the authenticated name and mobile, saves name edits, and signs out. Customer data and purchase drafts are reset across accounts.
- Three onboarding introductions explain location/villa eligibility, monthly scheduling and actual wash tracking. Location can be declined and browsing can continue without booking.
- A native map displays only configured and verified polygons. Coordinate eligibility prompts for a villa; the server checks the explicit enabled villa registry before saving an address or exposing bookable slots.
- Admin coverage management configures boundaries, areas, blocks, assigned teams and individual villa numbers. It supports bulk explicit numbers, search, activation/deactivation and validation. The block selector is a logical operating layout, explicitly not an invented street map.
- Initial data creates Sharbatly Village, Jeddah and Block A assigned to Team 1. No villa numbers or geographical boundary are invented. A representative public map center is discovery only.
- Driver work is organized into today's and upcoming jobs, with current work prominent, persistent navigation, an account page and operational incident history. A job shows time, villa/block, vehicle, customer/access details and contextual actions. Each evidence stage guides the four photo angles or a complete video; progress updates come from the server.
- Shared native controls have minimum touch sizes, text wrapping, visible labels, corrected segmented-indicator geometry, safe-area padding and keyboard insets.

## Activation dependencies

Apply the ordered database migrations, including `20260905000019_sharbatly_coverage.sql`, before deploying the new API and app clients. Existing live endpoints still run the preceding schema. This turn does not deploy Workers, change a remote database, or distribute a mobile release.

Enter the real perimeter points in Coverage, verify them, then add the actual villa numbers to Block A. Without those inputs the system deliberately returns unavailable. Only a location inside a verified area AND a registered active villa AND an active block/team can qualify. A location marker alone never qualifies.

The discovery center (21.6054953, 39.2002795) comes from the public Sharbatly Village place listing: https://sa.near-place.com/sharbatly-village-prince-mutaib-bin-abdulaziz-road-jeddah . The official site https://sharbatlyvillage.com/ confirms the community is in Jeddah. Neither source is a surveyed service boundary.

New block/team configuration governs new bookings. Existing historical bookings and customer addresses are retained; old addresses without a villa must be completed before a new booking.

## Verification evidence

- Workspace TypeScript and ESLint: all 13 packages passed after integration fixes.
- 14 API contract tests passed, including role restrictions, villa normalization, denied address writes, independent teams, terminal jobs, assigned block context, logout and refund after coverage changes during payment.
- 16 authentication race scenarios passed across both mobile apps. The reusable harness is `scripts/verify-auth-races.cjs`.
- Driver presentation tests: Saudi midnight/day grouping, preserving ongoing previous-day work, chronological upcoming work, user ownership and non-mutating sorting passed.
- Customer iOS and Android Hermes exports passed again after authentication fixes.
- Driver iOS and Android Hermes exports passed, with final exports repeated after integration fixes.
- Dashboard production build passed.
- `git diff --check` passed.
- `scripts/verify-dev.mjs` now verifies Sharbatly discovery and rejection of the old Makkah radius and missing villa. Full eligible-villa and Friday verification requires `BUBBLES_COVERAGE_TEST_VILLA`, `BUBBLES_COVERAGE_TEST_LAT` and `BUBBLES_COVERAGE_TEST_LNG` for an actual configured test villa. This remote smoke script was not run against the preceding deployed API.

Local database execution and pointer QA have separate status. The local SQL test runtime was unavailable; a dependency-install approval was not completed. Native/browser control reported that the Mac was locked on both attempts. No screenshot, pointer interaction, physical camera, phone call, navigation launch or visual acceptance is claimed. These checks remain required before treating the design as accepted.

An independent read-only review of the migration and coverage routes found no blocking issue in fail-closed eligibility, assignment, activation, input validation or admin permissions. This does not replace executing `apps/api/tests/coverage.sql` in a fresh local database with all migrations applied.

Run the portable checks from the repository root:

```sh
pnpm type-check
pnpm lint
node scripts/verify-auth-races.cjs
node --test apps/api/tests/coverage-api.test.mjs apps/driver-app/src/jobPresentation.test.mjs
```

## Point-by-point design review

The entire user-provided anti-slop law was revisited. The approved Bubbles assets, Plex families and violet/guava/ice/ink tokens remain the explicit project authority where the generic defaults conflict. The following records code inspection; visual items remain pending on-device verification.

| Rule / related variants | Result in this change |
|---|---|
| Em dashes and ornamental quote marks | New Arabic copy uses sentences, commas and direct labels. |
| Repeated Google display fonts and house pairings | Preserved exact approved IBM Plex families. No alternative font hunting or replacement. |
| Space Grotesk, Sora, Syne, Archivo, Cormorant, Didones and novelty faces | Not introduced. |
| Mono as house voice / one uppercase label treatment | Normal Arabic type hierarchy; tabular numerals only for real time/count/phone data. |
| Eyebrows, pills and tiny rules next to labels | No decorative hero eyebrow or ornament added. Form labels identify actual fields. |
| Gradient logo lockup, initials avatars and icon tiles | No synthetic identity/avatar or boxed logo added. Dashboard uses the supplied Bubbles SVG. |
| Missing real marks / no icons over-correction | Existing approved mark retained; bare task/navigation icons have specific destinations/actions. |
| Generic line icons redrawn as custom | No redrawn icon-pack claims. Existing library primitives are used honestly, sparingly. |
| Glowing pills, inner glow, halos and clipped glows | No new glow effects or glow-backed status indicators. |
| All-around shadow / offset duplicate-box shadows / boxy bloom | Driver containers use tonal surfaces with their default shadows removed. No duplicated shadow geometry. |
| Botched glass, banding, backdrop blur and transition pops | No glass material introduced. |
| Candy gradients, drifting blobs, blue-purple gradient fields and gradient headline text | No new gradient background or gradient-filled text. Approved solid brand accents preserved. |
| Cool blue charcoal, cream, gray and saturation by default | No new palette inferred. Source Bubbles tokens have documented authority. |
| Floating cards, hover lift and button boop | No hover translate/scale added; shared native press response is the existing inward touch state. |
| Underline-fill hover and active-nav dots | No underline animation or dot added. Active navigation uses actual selected semantics and type/color. |
| Fake app/code windows and empty product props | Real job/booking/coverage UI is populated from the API; no fabricated app screenshots or code props. |
| Crude CSS/SVG scenery, graph-paper grids and fixed atmosphere sheets | None introduced. Boundary preview draws operator-supplied geometry only. |
| Full-bleed images, hard seams and masked overlaps | No new full-bleed imagery or overlapped live text. Not applicable to these operational screens. |
| Grain above content and banded gradient substrates | Neither grain nor large gradient transitions added. |
| Split hero, default hero stack, default CTA pair and SaaS meta-skeleton | Operational screens are composed around current tasks, registry editing and actual account information. No marketing-page skeleton added. |
| Three-tier pricing, glowing popular card and invented savings | Catalogue-fed wash types filtered by real weekly frequency; no “most popular” invention or third pricing tier. |
| Kitchen-sink cards and repeated metadata chips | Job details prioritize destination, appointment, current stage and next task; metadata is typographic. |
| Testimonial/quote cards, invented customers and fake proof | No testimonials or customer marks invented. Real profile/job data is authenticated. |
| Countdown urgency widgets | None added. Real scheduled job times remain factual. |
| Kicker/H2 repeats, serif statement blocks and closing enquire islands | None added. |
| Pill email forms, newsletter strips and pre-footer CTA banners | Not applicable; none introduced. |
| Standard footer and oversized wordmark failures | Native navigation has three real destinations; no oversized footer composition added. |
| Image cards with overlay captions and floating tags | None introduced. |
| Numbered process on a decorative rail | Wash status is a horizontal live progress component; photo states represent required evidence. |
| Recolored house layouts and stacked slop compositions | Customer onboarding, location validation, admin block registry and driver execution each reflect their actual job. |
| Clear the cut / text clipped by edges, notches or section overlap | No decorative clips on live driver content. Shared fixed button heights replaced with min-height; keyboard/safe-area padding corrected. Pixel review pending. |
| Text touching the rim / content pushed to opposite edges | Consistent source gutters, flexible wrapping and bounded rows. Device review pending. |
| Misaligned comparisons / long copy and CTA alignment | Native packages stack; driver photo cells share widths; admin block grid holds comparison roles. Large-text visual review pending. |
| Centering assumptions and off-center strikes | Button labels explicitly use Txt `center`; tab indicator accounts for both padding edges. No strikes added. Optical verification pending. |
| Cramped display text and dangling headlines | Large text is bounded; no accent word stranded on a tall hero stack. Long names/villas must be checked on-device. |
| Hidden entrance content | All content is visible by default. Loading is explicit; progress animates width without gating text. |
| Dead controls and fake tabs | Every new control has a real handler/API/navigation action. Disabled states reflect busy/ineligible operations. Pointer proof pending. |
| Purposeful motion and reduced motion | Existing native navigation, touch state, tab indicator and data-driven wash progress; no appearance depends on animation. |
| Cohesion, specificity and meaningful signature | The signature is the real villa/job operating record and Bubbles three-beat wash state, not decorative stock scenery. Final aesthetic acceptance remains visual. |
| Accessible primitives instead of generic hand-rolled controls | Shared Button/Input/Screen/Nav plus native form controls reused. Semantic labels, selected/busy state and recovery paths retained. |
| Say less and Arabic clarity | Concise Arabic name/mobile/villa/stage copy; monthly-package terminology; no unsupported club privileges. |

## Pointer acceptance still required

Check Arabic and English customer onboarding/profile/monthly packages; keyboard, error, permission-denied and unavailable-villa cases; narrow and large-text layouts; dashboard boundary/block/villa create/edit/activate flows; and the driver's complete claim → directions/call → arrival → before documentation → wash → after documentation → quality → history cycle. Recheck logout during a request and a subsequent account sign-in. Use actual disposable test data and the local/new development backend, not invented production availability.

## Screenshot follow-up after the Mac was unlocked

Captured the actual current iPhone interfaces with an isolated local fixture API. See `screenshots/README.md` for the images and provenance. All people, bookings, villas and preview geometry are synthetic. Confirmed native pointer navigation through driver jobs/details/report, customer monthly frequency selection, profile/language and all three onboarding pages. Customer logout and subsequent OTP login passed, and driver logout passed after fixing auth guards to preserve the navigator. Removed redundant logout navigation and changed draft cleanup to reset state without remounting the navigation tree. Both mobile apps pass TypeScript and ESLint after these fixes. Camera, payment, live coverage and the full job lifecycle remain outside this screenshot verification. Dashboard screenshot capture was not completed because its local server escalation was aborted; no browser screenshot is claimed.
