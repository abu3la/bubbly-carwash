import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLocale } from '@bubbles/ui-native';
import { Processing } from '../../src/components/Processing';
import { PaymentFailureScreen } from '../../src/components/PaymentFailureScreen';
import { abandonMembership, ApiError, confirmMembership, createMembershipCheckout } from '../../src/api';
import { useClubDraft } from '../../src/clubDraft';
import { useCatalogue } from '../../src/catalogue';
import { useCustomerData } from '../../src/customerData';
import { useCopy } from '../../src/i18n';
import { checkoutFailure, checkoutStartFailure, paymentRecovery, verifyFailure, type PaymentFailure } from '../../src/paymentFailure';

const codeOf = (error: unknown) => error instanceof ApiError ? error.code : undefined;

export default function ProcessingClub() {
  const router = useRouter();
  const { id, result } = useLocalSearchParams<{ id?: string; result?: string }>();
  const { language } = useLocale();
  const draft = useClubDraft();
  const catalogue = useCatalogue();
  const { refresh } = useCustomerData();
  const copy = useCopy();
  const started = useRef(false);
  const [failure, setFailure] = useState<PaymentFailure | null>(null);
  const ar = language === 'ar';

  const verify = async () => {
    setFailure(null);
    try {
      await confirmMembership(id!);
      await refresh();
      draft.reset();
      router.replace('/club/dashboard');
    } catch (caught) {
      setFailure(verifyFailure(codeOf(caught)));
    }
  };

  const pay = async () => {
    setFailure(null);
    try {
      const plan = catalogue?.plans.find((item) => item.id === draft.planId);
      if (!plan || !draft.vehicleId || !draft.addressId || draft.slots.length !== plan.weekly) throw new Error('incomplete');
      const checkout = await createMembershipCheckout({
        planId: draft.planId,
        slots: draft.slots.map((slot) => ({
          vehicleId: draft.vehicleId,
          addressId: draft.addressId,
          serviceKey: plan.serviceKey,
          slotStart: slot.slotStart, addOns: [],
        })),
      });
      router.replace({
        pathname: '/club/payment',
        params: { id: checkout.membershipId, url: checkout.checkoutUrl },
      });
    } catch (caught) {
      setFailure(checkoutStartFailure(codeOf(caught)));
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const outcome = checkoutFailure(result);
    if (outcome) {
      // Releases the chosen times now rather than holding them until the checkout expires.
      if (id) void abandonMembership(id).catch(() => undefined);
      setFailure(outcome);
    } else if (id) void verify();
    else void pay();
  }, []);

  if (failure) {
    const recovery = paymentRecovery(failure);
    const message = copy.club.paymentFailures[failure];
    return (
      <PaymentFailureScreen
        title={message.title}
        body={message.body}
        actionLabel={recovery === 'newTime' ? copy.club.chooseNewTimes : copy.booking.paymentRecovery[recovery]}
        onAction={() => {
          if (recovery === 'verify') void verify();
          else if (recovery === 'pay') void pay();
          else router.replace('/club/schedule');
        }}
        backLabel={recovery === 'pay' ? copy.booking.backToReview : copy.booking.backHome}
        onBack={() => router.replace(recovery === 'pay' ? '/club/review' : '/(tabs)/home')}
      />
    );
  }
  return <Processing title={ar ? 'نتحقق من الدفع…' : 'Verifying payment…'} sub={ar ? 'لن يتفعّل الاشتراك قبل تأكيد ميسر.' : 'Your subscription activates only after Moyasar confirms payment.'} />;
}
