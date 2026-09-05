import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Screen, Txt } from '@bubbles/ui-native';
import { StyleSheet } from 'react-native-unistyles';
import { Processing } from '../../src/components/Processing';
import { useBookingDraft } from '../../src/bookingDraft';
import { useCopy } from '../../src/i18n';
import { confirmBooking, createBooking } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

export default function ProcessingPayment() {
  const router = useRouter();
  const { id, result } = useLocalSearchParams<{ id?: string; result?: string }>();
  const draft = useBookingDraft();
  const { refresh } = useCustomerData();
  const copy = useCopy();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const run = async () => {
      try {
        let bookingId = id;
        if (!bookingId) {
          if (!draft.vehicleId || !draft.addressId || !draft.slotStart || !draft.villaNumber) throw new Error('incomplete');
          const result = await createBooking({
            vehicleId: draft.vehicleId,
            addressId: draft.addressId,
            serviceKey: draft.serviceKey,
            slotStart: draft.slotStart,
            source: draft.source === 'club' ? 'club' : 'cash',
            addOns: draft.addOnKeys,
          });
          bookingId = result.booking.id;
          if (result.checkoutUrl) {
            router.replace({
              pathname: '/book/payment',
              params: { id: bookingId, url: result.checkoutUrl },
            });
            return;
          }
        }
        if (result && result !== 'success') throw new Error('cancelled');
        await confirmBooking(bookingId);
        await refresh();
        router.replace('/book/done');
      } catch {
        setError(copy.booking.paymentFailed);
      }
    };
    void run();
  }, []);

  if (error) {
    return (
      <Screen contentStyle={styles.error}>
        <Txt variant="heading" weight="bold" center>{error}</Txt>
        <Button label={copy.common.back} fullWidth onPress={() => router.replace('/book/review')} />
      </Screen>
    );
  }

  return <Processing title={draft.total > 0 ? copy.booking.processingPayment : copy.booking.processingCredit} sub={draft.total > 0 ? copy.booking.processingPaymentSub : copy.booking.processingCreditSub} />;
}

const styles = StyleSheet.create((theme) => ({
  error: { paddingHorizontal: theme.spacing[6], alignItems: 'center', justifyContent: 'center', gap: theme.spacing[5] },
}));
