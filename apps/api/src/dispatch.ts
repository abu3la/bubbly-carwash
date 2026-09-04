import { db } from './db';
import type { Env } from './env';
import { notify } from './notifications';

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
