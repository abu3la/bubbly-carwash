/**
 * Everything the Worker reads from its environment.
 *
 * All of it is secret and none of it is in the repo: `apps/api/.dev.vars`
 * locally, `wrangler secret put` in production. The service-role key in
 * particular bypasses row-level security, so it must never reach the app
 * bundle — the Worker is the only thing that holds it.
 */
export interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  MOYASAR_SECRET_KEY?: string;
  MOYASAR_WEBHOOK_SECRET?: string;

  /** Signs Supabase's auth hooks. Without it the SMS hook refuses to run. */
  SUPABASE_AUTH_HOOK_SECRET?: string;

  /** Taqnyat, once a sender name is registered. Absent = codes are logged. */
  TAQNYAT_BEARER?: string;
  TAQNYAT_SENDER?: string;
}
