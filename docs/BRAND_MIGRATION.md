# Bubbles naming migration

Local changes, 2026-09-05; nothing published, merged or removed remotely.

- Workspace name: `bubbles-carwash`; all 13 packages/imports/dependencies use `@bubbles/*`. Lockfile and installed workspace links updated together.
- Source/docs now say Bubbles / ببلز. Arabic words such as «السماح» are ordinary language, not the former brand, and remain intact.
- New session/language keys use `bubbles.*`. Existing installations are read once from their legacy keys, written to the new key, then the legacy value is removed. Sign-out clears both keys. The dashboard's existing legacy-token compatibility remains until those sessions expire.
- Two migration filenames now use `bubbles`; their timestamp identifiers and SQL statements are unchanged. Do not replay them against an initialized database.
- The imported Claude archive is preserved verbatim, including historical names embedded in compiled design metadata. It is evidence, not application branding.

## Cloudflare cutover pending

Wrangler authentication and the existing R2 bucket were checked read-only. No remote resources were renamed, created or deleted because the user explicitly requested no publishing.

| Resource | Existing deployment | Prepared local name |
| --- | --- | --- |
| Development API | `sama-api-dev` | `bubbles-api-dev` |
| Development dashboard | `sama-dashboard-dev` | `bubbles-dashboard-dev` |
| Development landing | `sama-site-dev` | `bubbles-site-dev` |
| Production API | `sama-api` | `bubbles-api` |
| Development media bucket | `sama-dev-media` | `bubbles-dev-media` (not provisioned) |

The existing media binding deliberately still targets the populated bucket. Renaming a config string does not move media. Before changing it, copy objects and relevant bucket settings, verify object counts/content and access, then switch the binding. Keep the existing bucket until verification and a separate deletion decision.

Deployment scripts for the dashboard/landing build against the new API/dashboard Worker names. Runtime fallback URLs and the Supabase SMS-hook URL still target the existing deployments, avoiding broken connections before cutover. Override `BUBBLES_API_URL`, `EXPO_PUBLIC_API_URL`, `VITE_API_URL` and `NEXT_PUBLIC_DASHBOARD_URL` with verified new URLs during cutover. Do not assume a new hostname works because it appears in a config.

Preserve account IDs, Supabase project/data, service bindings, secrets, scheduled triggers, Firebase identifiers and payment webhooks. Transfer Worker secrets through the authorized secret source, verify health/catalogue/auth/media, update webhook callbacks, then update runtime defaults and remove obsolete endpoints. The production account-level `samacarwash.workers.dev` subdomain requires a separate coordinated account-wide migration; changing it can affect other Workers.

Remaining old-name references are live endpoint compatibility, legacy storage keys, migration documentation and the untouched design export. No new feature/package uses the old brand.
