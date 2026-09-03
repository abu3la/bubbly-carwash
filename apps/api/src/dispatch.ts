import { db } from './db';
import type { Env } from './env';
import { notify } from './notifications';

export const ASSIGNMENT_FAILURES = new Set([
  'bookingNotFound',
  'bookingNotAssignable',
  'bookingHasNoTeam',
  'notATechnician',
  'technicianNotInTeam',
  'outsideDriverShift',
  'technicianBusy',
]);

interface AssignedBooking {
  id: string;
  ref: string;
  profile_id: string;
  technician_id: string | null;
  team_id: string | null;
  scheduled_at: string;
  ends_at: string;
  status: string;
}

export function assignmentFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return [...ASSIGNMENT_FAILURES].find((code) => message.includes(code)) ?? null;
}

export async function assignBooking(
  env: Env,
  bookingId: string,
  technicianId: string,
  actorId: string,
) {
  const [before] = await db<AssignedBooking>(
    env,
    `bookings?id=eq.${bookingId}&select=id,ref,profile_id,technician_id,team_id,scheduled_at,ends_at,status`,
  );
  if (!before) throw new Error('bookingNotFound');

  const [booking] = await db<AssignedBooking>(env, 'rpc/assign_booking_to_technician', {
    method: 'POST',
    body: { p_booking: bookingId, p_technician: technicianId, p_actor: actorId },
  });

  if (before.technician_id !== technicianId) {
    const when = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Riyadh',
    }).format(new Date(booking.scheduled_at));
    await notify(env, {
      profileId: technicianId,
      bookingId,
      kind: 'job_assigned',
      titleAr: 'مهمة جديدة',
      titleEn: 'New job',
      bodyAr: `${booking.ref} في ${when}`,
      bodyEn: `${booking.ref} has been assigned to you`,
      data: { route: `/job/${bookingId}` },
    });
  }
  return booking;
}

/** Notify every available member of the team selected by location/capacity. */
export async function notifyTeamOfBooking(env: Env, bookingId: string) {
  const [booking] = await db<AssignedBooking>(
    env,
    `bookings?id=eq.${bookingId}&select=id,ref,profile_id,technician_id,team_id,scheduled_at,ends_at,status`,
  );
  if (!booking) throw new Error('bookingNotFound');
  if (!booking.team_id) throw new Error('bookingHasNoTeam');

  const members = await db<{ profile_id: string; shift_start: string; shift_end: string }>(
    env,
    `team_members?team_id=eq.${encodeURIComponent(booking.team_id)}` +
      '&active=eq.true&available=eq.true' +
      '&profiles.active=eq.true&profiles.role=eq.driver' +
      '&select=profile_id,shift_start,shift_end,profiles!inner(active,role)' +
      '&order=is_lead.desc,updated_at.asc',
  );
  const localTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(booking.scheduled_at));
  const eligible = members.filter((member) => localTime >= member.shift_start.slice(0, 5)
    && localTime < member.shift_end.slice(0, 5));
  const when = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh',
  }).format(new Date(booking.scheduled_at));
  await Promise.all(eligible.map(({ profile_id }) => notify(env, {
    profileId: profile_id,
    bookingId,
    kind: 'team_job_available',
    titleAr: 'مهمة جديدة لفريقك',
    titleEn: 'New team job',
    bodyAr: `${booking.ref} في ${when}`,
    bodyEn: `${booking.ref} is available for your team`,
    data: { route: `/job/${bookingId}` },
  })));
  return eligible.length;
}
