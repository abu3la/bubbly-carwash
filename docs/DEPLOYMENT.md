# Development deployment

**Migration pending:** the table below records the existing deployment, not the
new local Worker names. Do not deploy until the [brand migration](BRAND_MIGRATION.md)
is coordinated; the commands below target the new Bubbles Workers.

The shared development environment runs in the Cloudflare account
the Taz development account (`57118b773c4166fafe8b041d792cb2ef`). Production
configuration stays in the original Wrangler files; development uses the
separate `wrangler.dev.jsonc` files.

| Surface | Worker | URL |
| --- | --- | --- |
| API | `sama-api-dev` | `https://sama-api-dev.taz2886.workers.dev` |
| Dashboard | `sama-dashboard-dev` | `https://sama-dashboard-dev.taz2886.workers.dev` |
| Site | `sama-site-dev` | `https://sama-site-dev.taz2886.workers.dev` |

Supabase remains the system of record. Private media belongs in the
`sama-dev-media` R2 bucket, exposed to the API as the `MEDIA` binding. Store
object ownership and business metadata in Supabase; store only object bytes in
R2.

The API Worker needs these encrypted secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_AUTH_HOOK_SECRET`
- `MOYASAR_SECRET_KEY`
- `MOYASAR_WEBHOOK_SECRET`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Firebase native config belongs in the gitignored `firebase/` directory of each
mobile app. The development Firebase project is `bubblescarwash-cbb8a`, with a
separate iOS and Android registration for each customer and driver bundle.
Android delivery uses FCM directly. iOS delivery additionally needs an APNs
authentication key or certificate configured in Firebase.

Never commit their values. Deploy from the repository root with:

```sh
pnpm --filter @bubbles/api deploy:dev
pnpm --filter @bubbles/dashboard deploy:dev
pnpm --filter @bubbles/landing deploy:dev
```

The `deploy:dev:triggers` script in each package reapplies its `workers.dev`
route if Cloudflare reports that the Worker has no URL.
