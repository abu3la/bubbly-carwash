/** Free cancellation, with an automatic refund, closes this long before the service window opens. */
export const CANCELLATION_NOTICE_HOURS = 3;
export const CANCELLATION_NOTICE_MS = CANCELLATION_NOTICE_HOURS * 60 * 60 * 1000;

/** Whether a paid booking starting at `scheduledAt` can still be cancelled. */
export function cancellationOpen(scheduledAt: string, now = Date.now()): boolean {
  return Date.parse(scheduledAt) - now >= CANCELLATION_NOTICE_MS;
}
