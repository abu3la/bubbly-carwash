import { db } from './db';
import type { Env } from './env';

/** R2 accepts at most this many keys in one delete. */
const R2_DELETE_LIMIT = 1000;

/**
 * The parts of an account deletion that live outside Postgres: the evidence in
 * R2 and the sign-in identity. They run after `delete_customer_account` commits
 * and are recorded in `account_deletions`, so a failure here is retried by the
 * maintenance sweep rather than leaving either behind.
 */
export async function finishAccountDeletion(env: Env, profileId: string, mediaKeys: string[]) {
  if (mediaKeys.length) {
    if (!env.MEDIA) throw new Error('storageUnavailable');
    for (let start = 0; start < mediaKeys.length; start += R2_DELETE_LIMIT) {
      await env.MEDIA.delete(mediaKeys.slice(start, start + R2_DELETE_LIMIT));
    }
  }

  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${profileId}`, {
    method: 'DELETE',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  // A 404 means an earlier attempt already removed the identity.
  if (!response.ok && response.status !== 404) throw new Error(`authDelete ${response.status}`);

  await db(env, `account_deletions?profile_id=eq.${profileId}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: { media_keys: [], completed_at: new Date().toISOString() },
  });
}

export async function retryAccountDeletions(env: Env) {
  const pending = await db<{ profile_id: string; media_keys: string[] }>(
    env,
    'account_deletions?completed_at=is.null&select=profile_id,media_keys&order=requested_at&limit=50',
  );
  await Promise.all(pending.map(({ profile_id, media_keys }) =>
    finishAccountDeletion(env, profile_id, media_keys).catch((error) => {
      console.error('[account] deletion will retry', { profile_id, error });
    })));
}
