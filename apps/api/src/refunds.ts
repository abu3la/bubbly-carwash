import { db } from './db';
import type { Env } from './env';
import { refundInvoice } from './moyasar';
import { notify } from './notifications';

interface RefundablePayment {
  id: string;
  provider_ref: string;
}

const sar = (minor: number) => (minor / 100).toFixed(2);

/** Refunds a Moyasar payment in full and records who asked for it and why. */
export async function refundPayment(env: Env, payment: RefundablePayment, reason: string, requestedBy: string) {
  const refunded = await refundInvoice(env, payment.provider_ref);
  await db(env, 'payment_refunds', {
    method: 'POST',
    prefer: 'return=minimal',
    body: {
      payment_id: payment.id,
      provider_payment_ref: refunded.paymentId,
      amount_minor: refunded.amount,
      reason,
      requested_by: requestedBy,
    },
  });
  await db(env, `payments?id=eq.${payment.id}`, {
    method: 'PATCH', prefer: 'return=minimal', body: { state: 'refunded', updated_at: new Date().toISOString() },
  });
  return refunded;
}

/**
 * Returns the money for a paid booking cancelled before the notice deadline.
 * The booking is already cancelled by then, so a failed refund becomes a case
 * in the operations queue instead of an error the customer cannot act on.
 */
export async function refundCancelledBooking(
  env: Env,
  booking: { id: string; total_minor: number },
  customerId: string,
  options: { reason: string; notifyCustomer: boolean },
): Promise<'sent' | 'review'> {
  try {
    // A payment the webhook confirmed may not have reached `paid` yet. Moyasar
    // is asked again inside refundInvoice, so this only finds the invoice.
    const [payment] = await db<RefundablePayment>(
      env,
      `payments?booking_id=eq.${booking.id}&provider=eq.moyasar&state=in.(paid,pending)` +
        '&select=id,provider_ref&order=created_at.desc&limit=1',
    );
    if (!payment?.provider_ref) throw new Error('paymentNotFound');
    const refunded = await refundPayment(env, payment, options.reason, customerId);
    if (options.notifyCustomer) {
      await notify(env, {
        profileId: customerId,
        bookingId: booking.id,
        kind: 'payment_refunded',
        titleAr: 'تم استرجاع المبلغ',
        titleEn: 'Payment refunded',
        bodyAr: `تمت إعادة ${sar(refunded.amount)} ر.س إلى وسيلة الدفع.`,
        bodyEn: `${sar(refunded.amount)} SAR was returned to your payment method.`,
      }).catch((error) => console.warn('[refunds] refund notification failed', error));
    }
    return 'sent';
  } catch (error) {
    console.error('[refunds] automatic refund failed', { bookingId: booking.id, error });
    await db(env, 'operations_incidents', {
      method: 'POST',
      prefer: 'return=minimal',
      body: {
        booking_id: booking.id,
        reported_by: customerId,
        category: 'refund_review',
        source: 'system',
        note: `تعذر الاسترجاع التلقائي بعد الإلغاء. مراجعة استرجاع ${sar(booking.total_minor)} ر.س`,
      },
    }).catch((reviewError) => console.error('[refunds] refund review not recorded', { bookingId: booking.id, reviewError }));
    return 'review';
  }
}
