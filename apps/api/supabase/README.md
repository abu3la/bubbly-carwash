# Sama database

Two migrations, applied in order:

| File | What it does |
| --- | --- |
| `migrations/0001_sama_init.sql` | Tables, enums, indexes, constraints, RLS lockdown |
| `migrations/0002_sama_seed.sql` | The catalogue: services, add-ons, packages, plans, slot grid |

`0002` is idempotent (`on conflict … do update`), so re-running it updates the
catalogue rather than failing. `0001` is not — it is a first-run migration.

## Applying to a project

Both files are plain SQL with no CLI-specific syntax, so either route works.

**SQL editor** — open the project, paste `0001` and run, then `0002`.

**CLI**, once per machine:

```bash
npx supabase login
```

Then per project:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

`link` prompts for the database password on its own. Do not put it in a file,
a command, or a chat message.

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
