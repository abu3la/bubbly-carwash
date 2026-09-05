import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { Processing } from '../../src/components/Processing';
import { ApiError, confirmMembership, createMembershipCheckout } from '../../src/api';
import { useClubDraft } from '../../src/clubDraft';
import { useCatalogue } from '../../src/catalogue';
import { useCustomerData } from '../../src/customerData';

export default function ProcessingClub() {
  const router = useRouter();
  const { id, result } = useLocalSearchParams<{ id?: string; result?: string }>();
  const { language } = useLocale();
  const draft = useClubDraft();
  const catalogue = useCatalogue();
  const { refresh } = useCustomerData();
  const started = useRef(false);
  const [error, setError] = useState<'general' | 'refunded' | 'refundPending' | null>(null);
  const ar = language === 'ar';

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const run = async () => {
      try {
        let membershipId = id;
        if (!membershipId) {
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
          membershipId = checkout.membershipId;
          router.replace({
            pathname: '/club/payment',
            params: { id: membershipId, url: checkout.checkoutUrl },
          });
          return;
        }
        if (result && result !== 'success') throw new Error('cancelled');
        await confirmMembership(membershipId);
        await refresh();
        draft.reset();
        router.replace('/club/dashboard');
      } catch (caught) {
        if (caught instanceof ApiError && caught.code === 'scheduleUnavailableRefunded') {
          setError('refunded');
        } else if (caught instanceof ApiError && caught.code === 'scheduleUnavailableRefundPending') {
          setError('refundPending');
        } else {
          setError('general');
        }
      }
    };
    void run();
  }, []);

  if (error) {
    return (
      <Screen contentStyle={styles.error}>
        <Txt variant="heading" weight="bold" center>{ar ? 'لم يكتمل الاشتراك' : 'Subscription was not completed'}</Txt>
        <Txt variant="small" tone="secondary" center>
          {error === 'refunded'
            ? (ar ? 'تعذر تثبيت جميع المواعيد، لذلك أرسلنا استرجاع المبلغ إلى ميسر.' : 'We could not secure every appointment, so the payment was refunded through Moyasar.')
            : error === 'refundPending'
              ? (ar ? 'تعذر تثبيت المواعيد. لم يكتمل الاسترجاع بعد وسيعيد النظام المحاولة تلقائياً.' : 'We could not secure the appointments. The refund is pending and the system will retry automatically.')
              : (ar ? 'لم نفعّل الاشتراك. ارجع وحاول الدفع مرة أخرى.' : 'The subscription was not activated. Go back and try payment again.')}
        </Txt>
        <Button label={ar ? 'رجوع للمراجعة' : 'Back to review'} fullWidth onPress={() => router.replace('/club/review')} />
      </Screen>
    );
  }
  return <Processing title={ar ? 'نتحقق من الدفع…' : 'Verifying payment…'} sub={ar ? 'لن يتفعّل الاشتراك قبل تأكيد ميسر.' : 'Your subscription activates only after Moyasar confirms payment.'} />;
}

const styles = StyleSheet.create((theme) => ({
  error: { paddingHorizontal: theme.spacing[6], alignItems: 'center', justifyContent: 'center', gap: theme.spacing[4] },
}));
