# Sama Car Wash — where things stand

Written 2026-08-20. Read this first after a restart.

## What exists and is verified working

**Database** — Supabase project `fqrnqntiypmqzhlqozqj`, region `eu-central-1`
(Frankfurt). 15 tables, schema + catalogue seed applied and queried back. Moved
here from a Seoul project, which was deleted.

**API** — Hono on Cloudflare Workers, live at
`https://sama-api.sama-api.workers.dev`. Routes:

| Route | Status |
| --- | --- |
| `GET /health` | reports which secrets are present, never their values |
| `POST /auth/otp` | validates the phone, asks Supabase to send a code |
| `POST /auth/verify` | verifies, creates the `profiles` row, returns a session |
| `GET/POST /me/addresses` | authenticated; several per customer |
| `GET/POST /me/vehicles` | authenticated |
| `POST /hooks/sms` | Supabase Send SMS Hook — **deployed but never exercised** |

**Auth** — real. Test number `+966551234567`, fixed code `123456`, configured in
`apps/api/supabase/config.toml` (note: no `+` in that field, Supabase rejects
it). No SMS is sent for a test number, so this needs no provider. Verified end
to end from the app: a wrong code is rejected, a right one issues a session that
the app persists.

**App** — onboarding runs: welcome → phone → OTP → location → address → vehicle
→ home. Address and vehicle both write to Postgres through the Worker.

## Cloudflare

The legacy production deployment has its own Cloudflare account.
(`de8c4462ba0c1c0449f99aa8dbb71870`), with its own `workers.dev` subdomain,
`samacarwash`. The API is at **https://sama-api.samacarwash.workers.dev**.

It lives on its own account for a specific reason: a `workers.dev` subdomain is
**one per account**, shared by every Worker on it. Sama previously sat on the
account that now serves `mukhtalif`, and when that account's subdomain was
renamed to `mukhtalif`, Sama's URL stopped resolving with no warning. Separate
accounts mean neither project can break the other's URLs.

Two dead ends, recorded so they are not retried:

- **Taz development account** - the deployment operator is a *member* but
  holds no Workers permission there, so every call returns
  `403 / code 10000`. Being able to *see* an account in `whoami` says nothing
  about permissions in it. No token, profile, or re-login fixes this; only a
  role change by a Taz admin would. `bubblycarwash.co` is a zone on that
  account, which is why a custom domain there is still appealing later.
- **A `sama` wrangler auth profile** exists and is bound to this repo
  (`wrangler auth list`). It was created while chasing the Taz problem and is
  harmless, but it is not what makes deploys work — the `account_id` in
  `wrangler.jsonc` is.

Still worth doing: put a real custom domain in front of the Worker. The URL then
stops depending on any account's subdomain, which is precisely the failure that
cost an afternoon.

## Known bugs, not fixed

- **`%18` renders as `18%` reversed** on the home screen and package cards. The
  Unicode isolate fix works in a bare `View` and fails inside a `Card` — proven
  with the identical string from the identical function. Cause unknown. The
  reliable fix is likely rendering the number as a nested element rather than
  relying on invisible control characters.
- **Location screen copy overpromises** — the button says
  "السماح بتحديد الموقع" but no longer requests location, because the map is
  parked.
- **12 screens never walked** in the original UI audit (bookings, tracking,
  rating, club, profile, empty states).
- `saveAddress` hardcodes `isDefault: true`, which is right for onboarding and
  wrong for a future "manage addresses" screen.

## Parked deliberately

`apps/client-app/src/draft/MapStep.tsx` — the real map picker
(`react-native-maps` + `expo-location`, centre-pin gesture, reverse geocoding).
It is outside `app/` because expo-router bundles that whole tree and both
packages are native, so importing them there red-screens the app until a dev
client is rebuilt. Its README has the steps to bring it back. Needs
`GOOGLE_MAPS_KEY`.

## Decisions already made — do not relitigate

- **Hono on Workers is the only door to the database.** RLS is on with no
  policies; the service-role key lives only in the Worker. The app holds no
  Supabase key.
- **No Twilio, ever** — too expensive for Saudi. Taqnyat or Msegat, delivered
  through our own `/hooks/sms` route so the provider is ours to swap.
- **OTP is 6 digits.** Supabase enforces a minimum of 6; 4 is not available.
- **Error wording is chosen by the Worker**, never passed through from Supabase.
  The app receives a code, not English prose.
- Customer app first. Driver and admin have their tables (`profiles.role`,
  `bookings.technician_id`) but no UI.

## Next piece of work

`create_booking` as a Postgres function, so checking the club weekly cap,
spending a credit and writing the booking happen in one transaction. Over
PostgREST there are no multi-statement transactions, so without it two fast taps
can spend the same last credit twice. This is the known hard edge of choosing
Workers over Laravel.
