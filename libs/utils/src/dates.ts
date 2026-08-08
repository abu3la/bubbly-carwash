/** "14:30 · Sat 9 Aug" style short slot label, localized. */
export function formatSlot(iso: string, locale = 'en'): string {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
  const day = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
  return `${time} · ${day}`;
}

/** Minutes as "1h 15m" / "45m". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
