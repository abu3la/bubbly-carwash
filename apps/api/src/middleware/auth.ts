import type { MiddlewareHandler } from 'hono';
import type { Env } from '../env';
import { db } from '../db';

/**
 * Establishes who is calling.
 *
 * Verification is delegated to Supabase rather than done locally: Supabase signs
 * with ES256 and rotates its keys, so checking the signature here would mean
 * fetching and caching a JWKS and getting rotation right. One extra request per
 * call buys correctness, and that is the honest trade at this size. If it ever
 * shows up in latency, cache the JWKS — do not skip the check.
 */
export interface Caller {
  id: string;
  phone: string;
  role: Role;
}

export type Role = 'customer' | 'driver' | 'admin';

declare module 'hono' {
  interface ContextVariableMap {
    caller: Caller;
  }
}

export const requireAuth = (): MiddlewareHandler<{ Bindings: Env }> => async (c, next) => {
  const header = c.req.header('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return c.json({ error: { code: 'unauthorized' } }, 401);

  const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: c.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return c.json({ error: { code: 'unauthorized' } }, 401);

  const user = (await res.json()) as { id?: string; phone?: string };
  if (!user.id) return c.json({ error: { code: 'unauthorized' } }, 401);

  // The role comes from our own table, never from the token. Supabase issues
  // the same shape of JWT to every user, and a claim the client could
  // influence must not decide who is an administrator.
  const rows = await db<{ role: Role; active: boolean }>(
    c.env,
    `profiles?id=eq.${user.id}&select=role,active`,
  );
  const profile = rows[0];
  if (!profile?.active) return c.json({ error: { code: 'unauthorized' } }, 401);

  c.set('caller', { id: user.id, phone: user.phone ?? '', role: profile.role });
  await next();
};

/**
 * Gates a route on a role. Runs after `requireAuth`, which is what puts the
 * role on the context.
 */
export const requireRole =
  (...allowed: Role[]): MiddlewareHandler<{ Bindings: Env }> =>
  async (c, next) => {
    if (!allowed.includes(c.get('caller').role)) {
      // 403, not 404: the caller is known, they simply may not do this.
      return c.json({ error: { code: 'forbidden' } }, 403);
    }
    await next();
  };
