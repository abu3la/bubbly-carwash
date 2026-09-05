# BubblesCarWash - current development status

Updated 2026-09-05. This file is the hand-off checkpoint after a restart.

## Today's saved progress

- Customer home now leads with monthly subscription signup for nonmembers. For
  subscribers it shows the next or active wash first, then the actual package,
  weekly wash count and chosen days/times in a shared subscription card.
- Subscription management uses the same card with its validity date. The
  punitive "Subscription rule" panel and repeated forfeiture copy were removed.
  Payment consent, prices and backend subscription behavior are unchanged.
- Customer onboarding, profile name/mobile, logout, coverage/villa entry and
  authentication handoffs are implemented. The driver app has contextual job
  actions, evidence guidance, progress, persistent navigation and an account page.
- Coverage administration and API checks support areas, blocks, teams and an
  explicit villa registry. The migration starts with Sharbatly Village, Jeddah,
  Block A and Team 1. It contains no invented boundary or enabled villa numbers.
- Approved Bubbles design sources, fonts/assets, package-name migration,
  landing implementation, screenshots and review records are saved with the code.
  The landing was separately published at https://bubblescarwash.co; see
  [its deployment record](docs/review/landing/REVIEW.md).
- The latest actual Simulator images are available in the
  [private screenshot gallery](https://bubbles-app-screenshots-sep-2026.aaahashmi95.chatgpt.site).
  It requires the owner's ChatGPT sign-in. Screenshot data is synthetic.

The September 5 API, coverage database migration, dashboard and mobile changes
have not been deployed. The preceding deployed development baseline is recorded
below. Git backup does not activate these changes in a live environment.

## Checkpoint verification (2026-09-05)

- Workspace TypeScript and ESLint passed across all 13 packages.
- All 29 coverage API, membership schedule, customer next-wash and driver
  presentation tests passed.
- All 16 authentication race scenarios passed across the two mobile apps.
- Storage brand-migration checks passed for customer/driver sessions and
  language. The test VM now supplies the abort/timer globals used by logout.
- Whitespace checks passed. The backup audit found no credential files or
  generated dependencies/build directories among the changes being saved.

## Environments

- Branch: `dev`
- API: `https://sama-api-dev.taz2886.workers.dev`
- Admin dashboard: `https://sama-dashboard-dev.taz2886.workers.dev`
- Database: Supabase project `wakslhngvyfeedqubqmo` (BubblesDB)
- Media: Cloudflare R2 bucket `sama-dev-media`

Package identifiers now use `@bubbles/*`; pending Worker configurations use
`bubbles-*`. The live URLs and media bucket above remain unchanged until the
Cloudflare migration is authorized and verified. See [the migration record](docs/BRAND_MIGRATION.md).

## Previously deployed development baseline (2026-09-04)

- Customer and driver apps are Expo React Native applications.
- Login is required. The development API returns and accepts fixed OTP `1111`;
  verification still creates a real Supabase session and protected routes
  validate its access token.
- Customer vehicles and addresses persist in Supabase and are selectable.
- Google Maps supports Makkah, current location, a movable pin and live Google
  Places suggestions. Only covered Makkah coordinates can be booked.
- A single exterior wash costs SAR 40. Checkout is a real Moyasar test hosted
  page rendered inside the app with React Native WebView.
- Basic and Super Wash each offer two or three washes per week. The customer
  chooses two or three distinct days during signup. Those appointments repeat
  every seven days through the 30-day cycle; a missed wash is marked `missed`
  and never becomes credit. Cancelling a membership atomically cancels only its
  future, not-yet-started appointments.
- Both booking calendars are Gregorian and make Fridays unavailable.
- Four teams exist, only Team 1 is enabled, and capacity is limited to 40 per
  team. Booking assigns a team automatically by coverage and capacity.
- A development driver account is active, belongs to Team 1, and has been
  verified through the fixed-OTP login and team-first claim flow.
- Team members see their team's jobs in the driver app. The first available
  member to claim a job becomes its executing driver.
- The driver workflow supports job stages, customer calling, navigation,
  incidents, and before/after photo or video evidence stored in R2.
- The admin dashboard shows bookings, customers, vehicles, addresses, teams,
  team rosters, driver shifts and dispatch state. It manages drivers and teams,
  but does not manually assign a booking to an individual driver.
- Unpaid booking and membership checkout holds expire after 15 minutes. Late
  payments are verified against Moyasar and refunded instead of granting an
  invalid reservation. A Cloudflare cron runs the expiry sweep every five
  minutes even when no client is making requests.
- API and mobile TypeScript checks, repository lint, both native iOS builds,
  both iOS JavaScript bundle exports and the dashboard production build pass.
- The September 4 version of `pnpm verify:dev` checked the deployed API,
  catalogue and plan matrix, Friday closure, Makkah coverage, Team 1 capacity,
  authenticated Google Places, role boundaries and the deployed dashboard.
  The current script expects the new Sharbatly contract and must be used only
  after that API and coverage migration have been deployed.

## Notifications

- Firebase project `bubblescarwash-cbb8a` has separate iOS and Android app
  registrations for both the customer and driver applications.
- Native Firebase config files are installed locally and remain gitignored.
- The development Worker has the Firebase service-account secrets and `/health`
  reports `notifications: "firebase"`.
- Android FCM and the in-app notification history are configured. iOS external
  push delivery still requires an APNs authentication key or certificate from
  the Apple Developer account and a physical-device acceptance test.

## Deliberate boundaries

- The Worker is the only application path to Supabase. The service-role key is
  never shipped to a browser or mobile binary.
- OTP `1111` is development-only and comes from the development Worker config.
  Remove `DEV_FIXED_OTP` when a Saudi SMS provider is enabled.
- Google and Firebase native config files, `.dev.vars`, and service-account keys
  remain gitignored. Client-side Google Maps keys must be restricted by bundle
  identifier/package name in Google Cloud.
- Moyasar uses test credentials in development. A paid invoice is never trusted
  from the redirect alone; the Worker fetches and verifies it from Moyasar.

## Resume here: coverage activation and remaining acceptance

The workspace now includes monthly-package copy and onboarding/profile improvements, a redesigned driver work flow, and area/block/team/villa coverage management. The new migration seeds Sharbatly Village in Jeddah, Block A and Team 1, with no invented villa numbers or boundary. Eligibility requires verified perimeter points and enabled villa records. This replaces the Makkah radius for new bookings after the migration/API are deployed; the deployed state described above has not been changed by this follow-up.

After applying the ordered migrations and deploying the matching API, enter the
real perimeter in Coverage, verify it, and add the available villa numbers to
Block A. Eligibility stays unavailable until the verified boundary, villa,
block and assigned team are all active. Existing historical records are retained.

The Mac was subsequently unlocked. Actual iOS Simulator pointer checks covered
customer subscription/signup navigation, profile/language/logout, onboarding,
next-wash details, empty/error/retry states, Arabic/English subscription cards,
and driver jobs/details/report/logout using isolated fixtures. Screenshots are
saved under `docs/review/customer-driver-coverage/`. Dashboard pointer acceptance,
local SQL execution, the full driver job lifecycle, physical camera/call/maps,
real payment acceptance and iOS physical-device push testing remain pending.

See [coverage and driver review](docs/review/customer-driver-coverage/REVIEW.md),
[subscription/home review](docs/review/customer-driver-coverage/subscription-cta/REVIEW.md)
and [coverage setup](apps/api/supabase/COVERAGE.md) for exact behavior and checks.
The new `weeklySchedule` response field needs the matching API deployment but
no additional schema migration; older APIs show a truthful unavailable state.
