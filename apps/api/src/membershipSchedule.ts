export interface MembershipWeeklySlot {
  /** Sunday = 0 through Saturday = 6, in Asia/Riyadh. */
  weekday: number;
  /** Local Asia/Riyadh time, formatted HH:mm. */
  time: string;
}

/**
 * Signup rows retain the customer's chosen recurring schedule even after an
 * individual booking is cancelled. Expanded weekly occurrences collapse here
 * into the original weekday/time choices, never into booking usage.
 */
export function membershipWeeklySchedule(
  slots: ReadonlyArray<{ slot_start: string }>,
): MembershipWeeklySlot[] {
  const schedule = new Map<string, MembershipWeeklySlot>();
  for (const { slot_start } of slots) {
    // Postgres timestamptz includes an offset. Do not infer a host timezone for
    // malformed or legacy values that omit it.
    if (!/(?:z|[+-]\d{2}:\d{2})$/i.test(slot_start)) continue;
    const stamp = Date.parse(slot_start);
    if (!Number.isFinite(stamp)) continue;
    // Saudi Arabia uses UTC+3 throughout the year, without daylight saving.
    const local = new Date(stamp + 3 * 60 * 60 * 1000);
    if (!Number.isFinite(local.getTime())) continue;
    const weekday = local.getUTCDay();
    const time = `${String(local.getUTCHours()).padStart(2, '0')}:${String(local.getUTCMinutes()).padStart(2, '0')}`;
    schedule.set(`${weekday}:${time}`, { weekday, time });
  }
  return [...schedule.values()].sort((a, b) => a.weekday - b.weekday || a.time.localeCompare(b.time));
}
