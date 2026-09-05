import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatHomeBookingDate, selectHomeBooking } from './homeBooking.ts';

const now = new Date('2026-09-05T08:00:00Z');
const booking = (id, scheduled_at, overrides = {}) => ({
  id,
  scheduled_at,
  ends_at: new Date(Date.parse(scheduled_at) + 60 * 60 * 1000).toISOString(),
  status: 'scheduled',
  payment_confirmed: true,
  ...overrides,
});

test('home selects the nearest paid wash from descending or unsorted API results without changing them', () => {
  const later = booking('later', '2026-09-09T06:00:00Z');
  const nearest = booking('nearest', '2026-09-06T06:00:00Z');
  const middle = booking('middle', '2026-09-07T06:00:00Z');
  const rows = Object.freeze([later, nearest, middle]);
  assert.equal(selectHomeBooking(rows, now), nearest);
  assert.deepEqual(rows.map((row) => row.id), ['later', 'nearest', 'middle']);
});

test('unpaid, cancelled, completed, missed, expired and malformed bookings never become the next wash', () => {
  const rows = [
    ...['cancelled', 'done', 'missed'].map((status) => booking(status, '2026-09-05T09:00:00Z', { status })),
    booking('unpaid', '2026-09-05T09:00:00Z', { payment_confirmed: false }),
    booking('expired', '2026-09-05T06:00:00Z'),
    booking('ends-now', '2026-09-05T07:00:00Z'),
    booking('invalid-start', '2026-09-05T09:00:00Z', { scheduled_at: 'invalid' }),
    booking('invalid-end', '2026-09-05T09:00:00Z', { ends_at: 'invalid' }),
    booking('backwards-slot', '2026-09-05T09:00:00Z', { ends_at: '2026-09-05T08:30:00Z' }),
  ];
  assert.equal(selectHomeBooking(rows, now), null);
  assert.equal(selectHomeBooking([], now), null);
  assert.equal(selectHomeBooking([booking('future', '2026-09-06T09:00:00Z')], new Date('invalid')), null);
});

test('a scheduled wash stays visible during its slot; overdue active work takes priority until completed', () => {
  const future = booking('future', '2026-09-06T06:00:00Z');
  const inSlot = booking('in-slot', '2026-09-05T07:30:00Z');
  const active = booking('active', '2026-09-04T06:00:00Z', { status: 'active' });
  assert.equal(selectHomeBooking([future, inSlot], now), inSlot);
  assert.equal(selectHomeBooking([future, active, inSlot], now), active);
  assert.equal(selectHomeBooking([future, { ...active, status: 'done' }, inSlot], now), inSlot);
  assert.equal(selectHomeBooking([{ ...active, payment_confirmed: false }, future], now), future);
});

test('today and tomorrow follow Riyadh midnight even when both timestamps have the same UTC date', () => {
  const beforeSaudiMidnight = new Date('2026-09-05T20:59:00Z');
  const date = '2026-09-05T21:01:00Z';
  const tomorrow = formatHomeBookingDate(date, 'en', beforeSaudiMidnight);
  assert.equal(tomorrow.day, 'Tomorrow');
  assert.equal(tomorrow.date, '6 September 2026');
  assert.match(tomorrow.time, /^12:01\s*am$/i);
  assert.equal(formatHomeBookingDate(date, 'en', new Date('2026-09-05T21:00:00Z')).day, 'Today');
  assert.equal(formatHomeBookingDate(date, 'ar', beforeSaudiMidnight).day, 'غدًا');
  assert.equal(formatHomeBookingDate(date, 'ar', new Date('2026-09-05T21:00:00Z')).day, 'اليوم');
});

test('later dates include the weekday and Gregorian year, and times distinguish morning from evening', () => {
  const morning = formatHomeBookingDate('2026-09-07T06:30:00Z', 'en', now);
  const evening = formatHomeBookingDate('2026-09-07T18:30:00Z', 'en', now);
  assert.equal(morning.day, 'Monday');
  assert.equal(morning.date, '7 September 2026');
  assert.match(morning.time, /^9:30\s*am$/i);
  assert.match(evening.time, /^9:30\s*pm$/i);
  const arabic = formatHomeBookingDate('2026-09-07T18:30:00Z', 'ar', now);
  assert.equal(arabic.day, 'الاثنين');
  assert.match(arabic.date, /سبتمبر/);
  assert.match(arabic.date, /٢٠٢٦|2026/);
  assert.match(arabic.time, /م/);
});

test('Riyadh tomorrow handles a Gregorian year boundary', () => {
  const result = formatHomeBookingDate('2026-12-31T22:00:00Z', 'en', new Date('2026-12-31T20:00:00Z'));
  assert.equal(result.day, 'Tomorrow');
  assert.equal(result.date, '1 January 2027');
  assert.match(result.time, /^1:00\s*am$/i);
});
