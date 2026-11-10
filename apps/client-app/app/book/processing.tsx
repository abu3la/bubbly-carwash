import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Processing } from '../../src/components/Processing';
import { PaymentFailureScreen } from '../../src/components/PaymentFailureScreen';
import { useBookingDraft } from '../../src/bookingDraft';
import { useCopy } from '../../src/i18n';
import { ApiError, cancelBooking, confirmBooking, createBooking } from '../../src/api';
import { useCustomerData } from '../../src/customerData';
import { checkoutFailure, checkoutStartFailure, paymentRecovery, verifyFailure, type PaymentFailure } from '../../src/paymentFailure';

const codeOf = (error: unknown) => error instanceof ApiError ? error.code : undefined;

export default function ProcessingPayment() {
  const router = useRouter();
  const { id, result } = useLocalSearchParams<{ id?: string; result?: string }>();
  const draft = useBookingDraft();
  const { refresh } = useCustomerData();
  const copy = useCopy();
  const started = useRef(false);
  const bookingId = useRef(id);
  const [failure, setFailure] = useState<PaymentFailure | null>(null);

  const verify = async () => {
    setFailure(null);
    try {
      await confirmBooking(bookingId.current!);
      await refresh();
      router.replace('/book/done');
    } catch (caught) {
      setFailure(verifyFailure(codeOf(caught)));
    }
  };

  const pay = async () => {
    setFailure(null);
    try {
      if (!draft.vehicleId || !draft.addressId || !draft.slotStart || !draft.villaNumber) throw new Error('incomplete');
      const created = await createBooking({
        vehicleId: draft.vehicleId,
        addressId: draft.addressId,
        serviceKey: draft.serviceKey,
        slotStart: draft.slotStart,
        source: draft.source === 'club' ? 'club' : 'cash',
        addOns: draft.addOnKeys,
      });
      bookingId.current = created.booking.id;
      if (created.checkoutUrl) {
        router.replace({
          pathname: '/book/payment',
          params: { id: created.booking.id, url: created.checkoutUrl },
        });
        return;
      }
    } catch (caught) {
      setFailure(checkoutStartFailure(codeOf(caught)));
      return;
    }
    await verify();
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const outcome = checkoutFailure(result);
    if (outcome) {
      // Releases the time now rather than holding it until the checkout expires.
      if (id) void cancelBooking(id).catch(() => undefined);
      setFailure(outcome);
    } else if (id) void verify();
    else void pay();
  }, []);

  if (failure) {
    const recovery = paymentRecovery(failure);
    const message = copy.booking.paymentFailures[failure];
    return (
      <PaymentFailureScreen
        title={message.title}
        body={message.body}
        actionLabel={copy.booking.paymentRecovery[recovery]}
        onAction={() => {
          if (recovery === 'verify') void verify();
          else if (recovery === 'pay') void pay();
          else router.replace('/book/slot');
        }}
        backLabel={recovery === 'pay' ? copy.booking.backToReview : copy.booking.backHome}
        onBack={() => router.replace(recovery === 'pay' ? '/book/review' : '/(tabs)/home')}
      />
    );
  }

  return <Processing title={draft.total > 0 ? copy.booking.processingPayment : copy.booking.processingCredit} sub={draft.total > 0 ? copy.booking.processingPaymentSub : copy.booking.processingCreditSub} />;
}
