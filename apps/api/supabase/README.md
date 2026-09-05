# Bubbles database

Apply **all files in `migrations/` in filename order**. The initial schema and catalogue seed are only the beginning: later files add team dispatch, customer checkout, recurring appointments, archive handling, expiry, and coverage enforcement. Applying only the first two files cannot run the current application.

The current final migration is `20260905000019_sharbatly_coverage.sql`. It seeds Sharbatly Village in Jeddah with active Block A assigned to Team 1, which is the only team active initially. It does not invent villa numbers or a surveyed boundary. Coverage fails closed until an administrator enters and verifies the polygon and adds the actual covered villas. See [coverage behavior and rollout notes](COVERAGE.md).

## Applying to a project

The Supabase CLI tracks previously applied migrations. On an authorized target, apply the pending files in order with `supabase db push`. For a local Supabase development database, `supabase db reset` rebuilds from the complete migration sequence and destroys that local database's current data. Do not use reset on a database whose data must be retained.

Do not apply production migrations as an incidental test. API and application changes for coverage must be released together with the database migration. The coverage migration has **not been applied to any remote database in this task**.

## Local verification

Contract tests execute real Hono routes with controlled Auth, PostgREST and payment boundaries:

```sh
node --test apps/api/tests/coverage-api.test.mjs
pnpm --filter @bubbles/api type-check
pnpm --filter @bubbles/api lint
```

After all migrations are applied to a fresh **local** database, run the SQL integration assertions from the repository root:

```sh
psql "$LOCAL_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f apps/api/tests/coverage.sql
```

The fixture uses synthetic coordinates and villa records, and rolls its transaction back. It checks boundary validation, villa and block activation, exact team assignment, availability, address and booking enforcement, archived assets, membership signup and RPC privileges. Do not run it against production.

The SQL fixture is prepared but **not executed in this workspace**. No local PostgreSQL server was available, and installation of a temporary test runtime was cancelled. The 14 API contract tests, TypeScript and ESLint checks passed; those do not replace the SQL execution required before deploying this migration.

## Secrets

The Worker needs the project URL and the **service-role** key — service-role, not
anon: it bypasses RLS, which is the whole security model here.

```
apps/api/.dev.vars          # local, gitignored — copy .dev.vars.example
wrangler secret put ...     # production
```

The service-role key must never reach the app bundle. It only ever lives in the
Worker.

## Why RLS has no policies

Every table has RLS **enabled** and **no policies**, which denies everything to
anon and authenticated keys. The service-role key the Worker holds bypasses RLS
entirely, so the Worker is the only path to the data and every rule lives there
in one place. Add policies only if a client is ever pointed straight at Postgres.
