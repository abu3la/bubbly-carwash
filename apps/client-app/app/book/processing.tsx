import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Processing } from '../../src/components/Processing';
import { useBookingDraft } from '../../src/bookingDraft';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';

/** How long the gateway round-trip takes in this prototype. */
const SETTLE_MS = 1700;

export default function ProcessingPayment() {
  const router = useRouter();
  const draft = useBookingDraft();
  const session = useSession();
  const copy = useCopy();

  useEffect(() => {
    const timer = setTimeout(() => {
      // The booking is committed here, not on the success screen — so a
      // customer who backgrounds the app mid-payment still has their wash.
      session.confirmBooking({
        slot: draft.slot,
        day: draft.day,
        serviceKey: draft.serviceKey,
        addOnKeys: draft.addOnKeys,
        total: draft.total,
        source: draft.source,
      });
      router.replace('/book/done');
    }, SETTLE_MS);
    return () => clearTimeout(timer);
    // Deliberately runs once. Everything it reads is fixed by the time
    // payment starts, and re-running would charge twice.
  }, []);

  return (
    <Processing
      title={draft.source === 'cash' ? copy.booking.processingPayment : copy.booking.processingCredit}
      sub={draft.source === 'cash' ? copy.booking.processingPaymentSub : copy.booking.processingCreditSub}
    />
  );
}
