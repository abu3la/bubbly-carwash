/**
 * What went wrong with a payment, in the terms the customer needs: whether money
 * moved, whether the time is still theirs, and what to do next. Each kind maps
 * to one message, so a declined card and a slow result can never read the same.
 */
export type PaymentFailure =
  | 'declined'
  | 'cancelled'
  | 'pending'
  | 'offline'
  | 'verifyOffline'
  | 'verifyFailed'
  | 'late'
  | 'refunded'
  | 'refundPending'
  | 'slotTaken'
  | 'unavailable'
  | 'general';

/** Next action on the failure screen. */
export type PaymentRecovery = 'verify' | 'newTime' | 'pay';

const TIME_GONE = new Set([
  'slotFull', 'slotInPast', 'unknownSlot', 'fridayClosed', 'weeklyCapReached',
  'scheduleUnavailable', 'scheduleOutsideFirstWeek', 'duplicateSlot', 'oneWashPerDay',
]);

/** The outcome the hosted checkout handed back, or null when it was paid. */
export function checkoutFailure(result: string | undefined): PaymentFailure | null {
  if (!result || result === 'success') return null;
  return result === 'declined' ? 'declined' : 'cancelled';
}

/** Failed before the customer reached the payment page, so nothing was charged. */
export function checkoutStartFailure(code: string | undefined): PaymentFailure {
  if (code === 'offline') return 'offline';
  if (code === 'paymentUnavailable') return 'unavailable';
  return code && TIME_GONE.has(code) ? 'slotTaken' : 'general';
}

/**
 * Failed after the customer paid, so money may have moved. Anything unexplained
 * has to send them back to verifying, never toward paying a second time.
 */
export function verifyFailure(code: string | undefined): PaymentFailure {
  switch (code) {
    case 'paymentPending':
    case 'scheduleUnavailable':
      return 'pending';
    case 'offline':
      return 'verifyOffline';
    // The hold expired first. The paid-invoice callback refunds a cancelled target.
    case 'cancelled':
    case 'notFound':
      return 'late';
    case 'scheduleUnavailableRefunded':
      return 'refunded';
    case 'scheduleUnavailableRefundPending':
      return 'refundPending';
    default:
      return 'verifyFailed';
  }
}

export function paymentRecovery(failure: PaymentFailure): PaymentRecovery {
  switch (failure) {
    case 'pending':
    case 'verifyOffline':
    case 'verifyFailed':
      return 'verify';
    case 'late':
    case 'refunded':
    case 'refundPending':
    case 'slotTaken':
      return 'newTime';
    default:
      return 'pay';
  }
}
