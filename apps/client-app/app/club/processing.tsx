import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Screen, Txt, useLocale } from '@sama/ui-native';
import { Processing } from '../../src/components/Processing';
import { confirmMembership, createMembershipCheckout } from '../../src/api';
import { useClubDraft } from '../../src/clubDraft';
import { useCustomerData } from '../../src/customerData';

export default function ProcessingClub() {
  const router = useRouter();
  const { id, result } = useLocalSearchParams<{ id?: string; result?: string }>();
  const { language } = useLocale();
  const draft = useClubDraft();
  const { refresh } = useCustomerData();
  const started = useRef(false);
  const [error, setError] = useState(false);
  const ar = language === 'ar';

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const run = async () => {
      try {
        let membershipId = id;
        if (!membershipId) {
          const checkout = await createMembershipCheckout({
            planId: draft.planId,
            slots: draft.slots.map((slot) => ({
              vehicleId: draft.vehicleId, addressId: draft.addressId, serviceKey: 'exterior',
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
      } catch {
        setError(true);
      }
    };
    void run();
  }, []);

  if (error) {
    return (
      <Screen contentStyle={styles.error}>
        <Txt variant="heading" weight="bold" center>{ar ? 'لم يكتمل الاشتراك' : 'Subscription was not completed'}</Txt>
        <Txt variant="small" tone="secondary" center>{ar ? 'لم نفعّل الاشتراك. ارجع وحاول الدفع مرة أخرى.' : 'The subscription was not activated. Go back and try payment again.'}</Txt>
        <Button label={ar ? 'رجوع للمراجعة' : 'Back to review'} fullWidth onPress={() => router.replace('/club/review')} />
      </Screen>
    );
  }
  return <Processing title={ar ? 'نتحقق من الدفع…' : 'Verifying payment…'} sub={ar ? 'لن يتفعّل الاشتراك قبل تأكيد ميسر.' : 'Your subscription activates only after Moyasar confirms payment.'} />;
}

const styles = StyleSheet.create((theme) => ({
  error: { paddingHorizontal: theme.spacing[6], alignItems: 'center', justifyContent: 'center', gap: theme.spacing[4] },
}));
