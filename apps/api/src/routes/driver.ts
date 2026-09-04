import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth, requireRole } from '../middleware/auth';
import { db } from '../db';
import { notify } from '../notifications';

/**
 * The technician's app.
 *
 * Every query is scoped to the caller's team. Unclaimed jobs expose only the
 * district and service window; the exact customer, vehicle and location become
 * visible only after this technician atomically claims the job.
 */
export const driverRoute = new Hono<{ Bindings: Env }>();
driverRoute.use('*', requireAuth(), requireRole('driver'));

/**
 * The pipeline the customer watches, in order.
 *
 * Held here rather than in the app so a technician cannot skip a beat by
 * sending whichever value they like — the customer's tracking screen is
 * driven by exactly this.
 */
const ORDER = ['booked', 'arrived', 'washed', 'verified'] as const;
type Stage = (typeof ORDER)[number];

driverRoute.get('/jobs', async (c) => {
  const caller = c.get('caller');
  const [membership] = await db<{ team_id: string; shift_start: string; shift_end: string; teams: { id: string; name_ar: string } }>(
    c.env,
    `team_members?profile_id=eq.${caller.id}&active=eq.true&available=eq.true&select=team_id,shift_start,shift_end,teams(id,name_ar)&limit=1`,
  );
  if (!membership) return c.json({ team: null, jobs: [] });
  const rows = await db(
    c.env,
    `bookings?team_id=eq.${encodeURIComponent(membership.team_id)}` +
      `&or=(technician_id.is.null,technician_id.eq.${caller.id})` +
      '&status=in.(scheduled,active)' +
      '&payment_confirmed=eq.true' +
      '&select=id,ref,scheduled_at,ends_at,status,stage,service_key,total_minor,source,technician_id,team_id,' +
      'customers:profiles!bookings_profile_id_fkey(full_name,phone),' +
      'vehicles(make,model,color,plate,size),' +
      'addresses(label,line,district,city,lat,lng,notes),' +
      'booking_add_ons(add_on_key),' +
      'booking_media(id,phase,kind,angle,content_type,byte_size,created_at)' +
      '&order=scheduled_at',
  );
  const jobs = rows.filter((job: { scheduled_at: string }) => {
    const localTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(job.scheduled_at));
    return localTime >= membership.shift_start.slice(0, 5) && localTime < membership.shift_end.slice(0, 5);
  }).map((job: {
    technician_id: string | null;
    customers?: unknown;
    vehicles?: Record<string, unknown> | null;
    addresses?: Record<string, unknown> | null;
    booking_media?: unknown[];
  }) => {
    if (job.technician_id === caller.id) return job;
    const address = job.addresses;
    return {
      ...job,
      customers: null,
      vehicles: job.vehicles ? { ...job.vehicles, plate: null } : null,
      addresses: address ? {
        label: null,
        line: address.district || address.city || 'مكة المكرمة',
        district: address.district,
        city: address.city,
        lat: null,
        lng: null,
        notes: null,
      } : null,
      booking_media: [],
    };
  });
  return c.json({ team: membership.teams, jobs });
});

driverRoute.get('/jobs/done', async (c) => {
  const rows = await db(
    c.env,
    `bookings?technician_id=eq.${c.get('caller').id}&status=eq.done` +
      '&select=id,ref,scheduled_at,service_key,total_minor&order=scheduled_at.desc&limit=50',
  );
  return c.json({ jobs: rows });
});

driverRoute.post('/jobs/:id/claim', async (c) => {
  const caller = c.get('caller');
  try {
    const [booking] = await db(c.env, 'rpc/claim_team_booking', {
      method: 'POST', body: { p_booking: c.req.param('id'), p_technician: caller.id },
    });
    return c.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const known = ['bookingNotFound', 'bookingNotClaimable', 'jobClaimed', 'technicianNotInTeam', 'outsideDriverShift', 'technicianBusy']
      .find((code) => message.includes(code));
    if (known) return c.json({ error: { code: known } }, known === 'bookingNotFound' ? 404 : 409);
    throw error;
  }
});

driverRoute.post('/jobs/:id/stage', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const { stage, note } = await c.req.json<{ stage?: Stage; note?: string }>();

  if (!stage || !ORDER.includes(stage)) {
    return c.json({ error: { code: 'badStage' } }, 400);
  }

  const [booking] = await db<{ id: string; stage: Stage; status: string; profile_id: string; ref: string }>(
    c.env,
    `bookings?id=eq.${id}&technician_id=eq.${caller.id}&select=id,stage,status,profile_id,ref`,
  );
  // Scoped to this technician, so another's job reads as "not found" rather
  // than confirming it exists.
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);
  if (booking.status === 'cancelled') return c.json({ error: { code: 'cancelled' } }, 409);

  // Forward only, one beat at a time. Without this a mis-tap could mark a wash
  // verified before the technician has arrived, and the customer would be told
  // their car was finished.
  const from = ORDER.indexOf(booking.stage as Stage);
  const to = ORDER.indexOf(stage);
  if (to !== from + 1) {
    return c.json({ error: { code: to <= from ? 'alreadyPast' : 'skippedStage' } }, 409);
  }

  // Evidence is part of completing the work, not an optional attachment. A
  // wash cannot be marked complete without a before record, or verified
  // without an after record.
  const requiredPhase = stage === 'washed' ? 'before' : stage === 'verified' ? 'after' : null;
  if (requiredPhase) {
    const evidence = await db<{ kind: 'photo' | 'video'; angle: string }>(
      c.env,
      `booking_media?booking_id=eq.${id}&phase=eq.${requiredPhase}&select=kind,angle`,
    );
    const has360 = evidence.some((item) => item.kind === 'video' && item.angle === '360');
    const photoAngles = new Set(evidence.filter((item) => item.kind === 'photo').map((item) => item.angle));
    const hasFullPhotoSet = ['front', 'right', 'rear', 'left'].every((angle) => photoAngles.has(angle));
    if (!has360 && !hasFullPhotoSet) {
      return c.json({ error: { code: `${requiredPhase}MediaRequired` } }, 409);
    }
  }

  await db(c.env, `bookings?id=eq.${id}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: {
      stage,
      // The wash is under way from the moment someone arrives, and finished
      // when it is verified. Status follows the beat rather than being set by
      // hand, so the two can never disagree.
      status: stage === 'verified' ? 'done' : 'active',
    },
  });

  // Append-only: the booking holds the latest beat, this holds how it got
  // there — and who moved it, which an audit needs.
  await db(c.env, 'booking_events', {
    method: 'POST',
    prefer: 'return=minimal',
    body: { booking_id: id, stage, actor_id: caller.id, note: note?.trim() ?? '' },
  });

  const messages: Record<Stage, { ar: string; en: string }> = {
    booked: { ar: 'تم تأكيد حجزك.', en: 'Your booking is confirmed.' },
    arrived: { ar: 'وصل فريق BubblesCarWash إلى موقعك.', en: 'Your BubblesCarWash team has arrived.' },
    washed: { ar: 'اكتمل غسيل سيارتك وتجري مراجعة الجودة.', en: 'Your wash is complete and being checked.' },
    verified: { ar: 'اكتملت غسلتك وتم حفظ توثيق قبل وبعد.', en: 'Your wash is complete and the evidence is ready.' },
  };
  try {
    await notify(c.env, {
      profileId: booking.profile_id,
      bookingId: id,
      kind: `booking_${stage}`,
      titleAr: booking.ref,
      titleEn: booking.ref,
      bodyAr: messages[stage].ar,
      bodyEn: messages[stage].en,
      data: { route: '/(tabs)/bookings' },
    });
  } catch (error) {
    console.warn('[driver] customer notification failed', error);
  }

  const [updated] = await db(c.env, `bookings?id=eq.${id}&select=id,ref,stage,status`);
  return c.json({ booking: updated });
});

driverRoute.get('/incidents', async (c) => {
  const rows = await db(
    c.env,
    `operations_incidents?reported_by=eq.${c.get('caller').id}` +
      '&select=id,booking_id,category,note,status,created_at,resolved_at' +
      '&order=created_at.desc&limit=50',
  );
  return c.json({ incidents: rows });
});

driverRoute.post('/jobs/:id/incidents', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const body = await c.req.json<{ category?: string; note?: string }>();
  const categories = new Set(['customer_absent', 'access', 'vehicle', 'safety', 'equipment', 'other']);
  if (!body.category || !categories.has(body.category)) {
    return c.json({ error: { code: 'badIncidentCategory' } }, 400);
  }
  if (!body.note?.trim()) return c.json({ error: { code: 'incidentNoteRequired' } }, 400);

  const [booking] = await db<{ id: string; ref: string }>(
    c.env,
    `bookings?id=eq.${id}&technician_id=eq.${caller.id}&status=in.(scheduled,active)&select=id,ref`,
  );
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);

  const [incident] = await db(c.env, 'operations_incidents', {
    method: 'POST',
    prefer: 'return=representation',
    body: {
      booking_id: id,
      reported_by: caller.id,
      category: body.category,
      note: body.note.trim(),
    },
  });

  const admins = await db<{ id: string }>(c.env, 'profiles?role=eq.admin&active=eq.true&select=id');
  await Promise.all(admins.map((admin) => notify(c.env, {
    profileId: admin.id,
    bookingId: id,
    kind: 'incident_reported',
    titleAr: `بلاغ على ${booking.ref}`,
    titleEn: `Incident on ${booking.ref}`,
    bodyAr: body.note!.trim(),
    bodyEn: body.note!.trim(),
    data: { route: '/operations' },
  }).catch((error) => console.warn('[driver] admin notification failed', error))));

  return c.json({ incident }, 201);
});

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
]);
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
};
const ANGLES = new Set(['general', 'front', 'rear', 'left', 'right', '360']);
const PHOTO_ANGLES = new Set(['front', 'rear', 'left', 'right']);
const MAX_MEDIA_BYTES = 100 * 1024 * 1024;

/** Upload private before/after evidence directly into the bound R2 bucket. */
driverRoute.post('/jobs/:id/media', async (c) => {
  const caller = c.get('caller');
  const id = c.req.param('id');
  const phase = c.req.query('phase');
  const angle = c.req.query('angle') ?? 'general';
  const contentType = (c.req.header('content-type') ?? '').split(';')[0].toLowerCase();
  const byteSize = Number(c.req.header('content-length') ?? c.req.header('x-file-size'));

  if (!c.env.MEDIA) return c.json({ error: { code: 'storageUnavailable' } }, 503);
  if (phase !== 'before' && phase !== 'after') {
    return c.json({ error: { code: 'badMediaPhase' } }, 400);
  }
  if (!ANGLES.has(angle)) return c.json({ error: { code: 'badMediaAngle' } }, 400);
  if (!ALLOWED_TYPES.has(contentType)) return c.json({ error: { code: 'badMediaType' } }, 415);
  if ((contentType.startsWith('video/') && angle !== '360')
    || (contentType.startsWith('image/') && !PHOTO_ANGLES.has(angle))) {
    return c.json({ error: { code: 'badMediaAngle' } }, 400);
  }
  if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_MEDIA_BYTES) {
    return c.json({ error: { code: 'badMediaSize' } }, 413);
  }

  const [booking] = await db<{ id: string; stage: Stage; status: string }>(
    c.env,
    `bookings?id=eq.${id}&technician_id=eq.${caller.id}&select=id,stage,status`,
  );
  if (!booking) return c.json({ error: { code: 'notFound' } }, 404);
  if (booking.status === 'cancelled') return c.json({ error: { code: 'cancelled' } }, 409);
  if ((phase === 'before' && booking.stage !== 'arrived') || (phase === 'after' && booking.stage !== 'washed')) {
    return c.json({ error: { code: 'mediaWrongStage' } }, 409);
  }

  const body = c.req.raw.body;
  if (!body) return c.json({ error: { code: 'badMediaSize' } }, 400);

  const mediaId = crypto.randomUUID();
  const objectKey = `bookings/${id}/${phase}/${mediaId}.${EXTENSIONS[contentType]}`;
  await c.env.MEDIA.put(objectKey, body, {
    httpMetadata: { contentType },
    customMetadata: { bookingId: id, phase, angle, uploadedBy: caller.id },
  });

  try {
    const [media] = await db(c.env, 'booking_media', {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        id: mediaId,
        booking_id: id,
        phase,
        kind: contentType.startsWith('image/') ? 'photo' : 'video',
        angle,
        object_key: objectKey,
        content_type: contentType,
        byte_size: byteSize,
        uploaded_by: caller.id,
      },
    });
    return c.json({ media }, 201);
  } catch (error) {
    // Do not leave an unowned object in R2 if its database record fails.
    await c.env.MEDIA.delete(objectKey);
    throw error;
  }
});
