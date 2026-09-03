# Development deployment

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

Never commit their values. Deploy from the repository root with:

```sh
pnpm --filter @sama/api deploy:dev
pnpm --filter @sama/dashboard deploy:dev
pnpm --filter @sama/landing deploy:dev
```

The `deploy:dev:triggers` script in each package reapplies its `workers.dev`
route if Cloudflare reports that the Worker has no URL.
