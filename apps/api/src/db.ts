import type { Env } from './env';

/**
 * PostgREST, wrapped.
 *
 * Every call carries the service-role key, which bypasses row-level security —
 * so every query here must scope itself to the caller by hand. There is no
 * safety net underneath this file. `profile_id=eq.${caller.id}` is not a
 * convenience; it is the only thing stopping one customer reading another's
 * addresses.
 */
export async function db<T = any>(
  env: Env,
  path: string,
  opts: { method?: string; body?: unknown; prefer?: string } = {},
): Promise<T[]> {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    method: opts.method ?? 'GET',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.prefer ? { Prefer: opts.prefer } : {}),
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  if (!res.ok) {
    throw new Error(`db ${res.status} on ${path}: ${await res.text()}`);
  }
  const text = await res.text();
  if (!text) return [] as T[];
  const parsed = JSON.parse(text);
  // A table query returns an array; an RPC returning a composite type returns a
  // bare object. Normalising here means every caller can destructure the same
  // way — without this, `const [row] = await db(...)` on an RPC throws
  // "(intermediate value) is not iterable", which says nothing useful.
  return (Array.isArray(parsed) ? parsed : [parsed]) as T[];
}
