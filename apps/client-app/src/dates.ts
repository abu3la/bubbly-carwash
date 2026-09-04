/** Gregorian service-day helpers, always evaluated in Riyadh rather than the device zone. */
export function riyadhDateKey(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);
  const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${fields.year}-${fields.month}-${fields.day}`;
}

export function addCalendarDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function isFriday(date: string) {
  return new Date(`${date}T12:00:00+03:00`).getUTCDay() === 5;
}

/** First service day that can still contain a future period. */
export function nextBookableDateKey(now = new Date()) {
  const time = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Riyadh',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);
  let date = riyadhDateKey(now);
  // Night begins at 18:00. At or after that instant the last period has
  // started, and the API correctly removes it from availability.
  if (time >= '18:00') date = addCalendarDays(date, 1);
  while (isFriday(date)) date = addCalendarDays(date, 1);
  return date;
}
