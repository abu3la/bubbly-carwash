import type { RealBooking } from './api';

type BookingSchedule = Pick<RealBooking, 'scheduled_at' | 'ends_at' | 'status' | 'payment_confirmed'>;

/** Server list order is newest first; home needs the current or nearest wash. */
export function selectHomeBooking<T extends BookingSchedule>(
  bookings: readonly T[],
  now = new Date(),
): T | null {
  const timestamp = now.getTime();
  if (!Number.isFinite(timestamp)) return null;

  let current: T | null = null;
  let upcoming: T | null = null;
  for (const booking of bookings) {
    const start = Date.parse(booking.scheduled_at);
    if (!booking.payment_confirmed || !Number.isFinite(start)) continue;

    // An active wash ends when the team finishes it, not when its slot expires.
    if (booking.status === 'active') {
      if (!current || start < Date.parse(current.scheduled_at)) current = booking;
      continue;
    }

    const end = Date.parse(booking.ends_at);
    if (booking.status !== 'scheduled' || end <= timestamp || end <= start || !Number.isFinite(end)) continue;
    if (!upcoming || start < Date.parse(upcoming.scheduled_at)) upcoming = booking;
  }
  return current ?? upcoming;
}

const timeZone = 'Asia/Riyadh';
const dayKey = (date: Date) => new Intl.DateTimeFormat('en-CA', {
  timeZone, calendar: 'gregory', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(date);

/** The service date is always Saudi local time, regardless of the phone timezone. */
export function formatHomeBookingDate(iso: string, language: 'ar' | 'en', now = new Date()) {
  const date = new Date(iso);
  const locale = language === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB';
  const bookingDay = dayKey(date);
  const today = dayKey(now);
  const tomorrow = dayKey(new Date(now.getTime() + 24 * 60 * 60 * 1000));

  return {
    day: bookingDay === today
      ? (language === 'ar' ? 'اليوم' : 'Today')
      : bookingDay === tomorrow
        ? (language === 'ar' ? 'غدًا' : 'Tomorrow')
        : new Intl.DateTimeFormat(locale, { timeZone, weekday: 'long' }).format(date),
    date: new Intl.DateTimeFormat(locale, {
      timeZone, calendar: 'gregory', day: 'numeric', month: 'long', year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      timeZone, hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(date),
  };
}
