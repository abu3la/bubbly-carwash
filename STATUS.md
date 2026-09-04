# BubblesCarWash - current development status

Updated 2026-09-04. This file is the hand-off checkpoint after a restart.

## Environments

- Branch: `dev`
- API: `https://sama-api-dev.taz2886.workers.dev`
- Admin dashboard: `https://sama-dashboard-dev.taz2886.workers.dev`
- Database: Supabase project `wakslhngvyfeedqubqmo` (BubblesDB)
- Media: Cloudflare R2 bucket `sama-dev-media`

The `sama-*` package, Worker and bucket identifiers are historical internal
names. The product name shown to customers, drivers and admins is
**BubblesCarWash**.

## Implemented and verified

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
- `pnpm verify:dev` rechecks the deployed API, catalogue and plan matrix,
  Friday closure, Makkah coverage and Team 1 capacity, authenticated Google
  Places, customer/driver/admin role boundaries, and the deployed dashboard.

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
