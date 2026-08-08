# Bubbly Carwash

A monorepo for the Bubbly mobile car-wash platform, structured per
[`docs/ARCHITECTURE_GUIDE.md`](docs/ARCHITECTURE_GUIDE.md).

## What's inside

| Package | What it is |
|---|---|
| `apps/landing` | Public marketing site (Next.js, deploys to Cloudflare via OpenNext) |
| `apps/dashboard` | Admin dashboard (Vite + React SPA, deploys as static assets to Cloudflare) |
| `apps/client-app` | Customer mobile app (Expo + expo-router) |
| `apps/driver-app` | Driver mobile app (Expo + expo-router) |
| `apps/api` | Backend API (Hono on Cloudflare Workers, Supabase Postgres) |
| `libs/types` | Shared domain contracts (`Booking`, `Service`, `User`, …) |
| `libs/validation` | Zod schemas, used by the API and the clients |
| `libs/design-tokens` | Colors, type scale, spacing, radii |
| `libs/ui-web` | Web components (dashboard + landing) |
| `libs/ui-native` | React Native components (both mobile apps) |
| `libs/api-client` | HTTP client + TanStack Query hooks |
| `libs/i18n` | English + Arabic catalogs and locale helpers |
| `libs/utils` | Pure shared helpers |

## Getting started

```bash
pnpm install
pnpm dev          # every app in dev mode (or target one, below)

pnpm --filter @bubbly/api dev        # Hono API on http://localhost:8787
pnpm --filter @bubbly/dashboard dev  # dashboard on http://localhost:5173
pnpm --filter @bubbly/landing dev    # landing on http://localhost:3000
pnpm --filter @bubbly/client-app dev # Expo dev server (customer app)
pnpm --filter @bubbly/driver-app dev # Expo dev server (driver app)
```

Workspace-wide checks:

```bash
pnpm build
pnpm type-check
pnpm lint
```

## Database (Supabase)

The API reads and writes Supabase Postgres. Without credentials it falls back to an
in-memory seeded dataset, so the workspace runs out of the box.

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration in `apps/api/supabase/migrations/0001_init.sql` (SQL editor or `supabase db push`).
3. Copy `apps/api/.dev.vars.example` to `apps/api/.dev.vars` and fill in
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Hosting (Cloudflare)

Deploys are manual and need `wrangler login` first:

```bash
pnpm --filter @bubbly/api deploy        # Worker
pnpm --filter @bubbly/dashboard deploy  # static assets Worker
pnpm --filter @bubbly/landing deploy    # OpenNext build + Worker
```

Production secrets for the API: `wrangler secret put SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
from `apps/api/`.

## Architecture rules (short form)

- Apps depend on libs; libs never depend on apps; apps never import other apps.
- All server communication goes through `@bubbly/api-client` (TanStack Query owns server state).
- `ui-web` and `ui-native` share `design-tokens`, never component implementations.
- Every package declares its own dependencies — no hoisting reliance.

## Not built yet (deliberate)

- **Auth** — Supabase Auth as Hono middleware.
- **Live driver tracking** — Supabase Realtime on `driver_locations`.
- **Payments** — `Booking` already snapshots the price for this.
