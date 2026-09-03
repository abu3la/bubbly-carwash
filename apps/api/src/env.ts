/**
 * Everything the Worker reads from its environment.
 *
 * All of it is secret and none of it is in the repo: `apps/api/.dev.vars`
 * locally, `wrangler secret put` in production. The service-role key in
 * particular bypasses row-level security, so it must never reach the app
 * bundle — the Worker is the only thing that holds it.
 */
export interface Env {
  /** Private media storage. Object metadata and ownership stay in Supabase. */
  MEDIA?: R2Bucket;

  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  MOYASAR_SECRET_KEY?: string;
  MOYASAR_WEBHOOK_SECRET?: string;

  /** Signs Supabase's auth hooks. Without it the SMS hook refuses to run. */
  SUPABASE_AUTH_HOOK_SECRET?: string;

  /** Taqnyat, once a sender name is registered. Absent = codes are logged. */
  TAQNYAT_BEARER?: string;
  TAQNYAT_SENDER?: string;

  /**
   * Development-only sign-in code. It is deliberately a normal Worker var,
   * not a secret, and must never be present in the production deployment.
   */
  DEV_FIXED_OTP?: string;

  /** Server-side Places API (New) key. Never embedded in either mobile app. */
  GOOGLE_PLACES_API_KEY?: string;

  /** Firebase service account used only by the Worker for FCM HTTP v1. */
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_CLIENT_EMAIL?: string;
  FIREBASE_PRIVATE_KEY?: string;
}
