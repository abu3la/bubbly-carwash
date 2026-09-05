# Sharbatly Village coverage

Migration `20260905000019_sharbatly_coverage.sql` replaces team-radius eligibility with an area polygon, a villa registry, and block assignments. Apply it after the previous migrations. It seeds Sharbatly Village in Jeddah, active Block A, and active Team 1. All other teams start inactive. It creates no villa records and provides no guessed service boundary.

The seeded map center is a public place marker (21.6054953, 39.2002795), useful only for orientation. It is not a surveyed footprint. Coverage remains `areaUnavailable` until operations enters a valid simple polygon and explicitly verifies it. Next, add actual covered villa numbers to Block A in the dashboard. A customer qualifies only when their pin is within the verified active polygon, their exact canonical villa number is active, and its block and assigned team are active. Boundary segments count as inside. Ambiguous overlapping active areas fail closed.

Arabic and Persian digits normalize to ASCII, whitespace is removed, and Latin letters become uppercase. Leading zeroes remain meaningful. Duplicate numbers across blocks of the same area are rejected, including deactivated records; reactivate the existing record instead. Bulk insertion is atomic.

New saved addresses, membership signup appointments, bookings, payment activation, and reopening terminal bookings repeat the checks in PostgreSQL. Frontend checks are for guidance. Direct team reassignment cannot select a team that differs from the villa's block. Updates to coverage configuration and new booking creation use a shared transaction lock. No radius fallback exists; callers of the old three-argument availability function receive no slots without a villa number.

Team activation is independent so future blocks can use additional teams. The seed activates only Team 1. Existing bookings retain their original assignment when a block changes team; newly created bookings follow the replacement assignment. Already started work can finish after a villa is disabled. If coverage becomes unavailable before a payment activates, the API requests a refund instead of confirming an unserviceable wash.

Historical addresses without villa numbers stay readable but cannot create bookings. Customers must add a current covered address. API, dashboard, and customer/driver applications should be released together after migration; legacy clients cannot supply the required villa number.

## Verification

API contract tests run without network, against the actual Hono routes with stubbed Auth/PostgREST/Moyasar boundaries:

```sh
node --test apps/api/tests/coverage-api.test.mjs
pnpm --filter @bubbles/api type-check
pnpm --filter @bubbles/api lint
```

The PostgreSQL integration fixture requires a **fresh local database** with all migrations already applied and Supabase's `auth.users` and roles present:

```sh
psql "$LOCAL_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f apps/api/tests/coverage.sql
```

The fixture uses synthetic geometry and villa numbers, asserts coverage and booking rules, and rolls its transaction back. It must not run against production. It was prepared but not executed in this workspace: no local PostgreSQL server was installed, and the temporary test-runtime installation was cancelled. API contract tests do not substitute for executing the SQL fixture before a deployment.
