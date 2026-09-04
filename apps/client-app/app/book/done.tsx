import { useRouter } from 'expo-router';
import { BookingTicket, Button } from '@sama/ui-native';
import { SuccessScreen } from '../../src/components/SuccessScreen';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';

export default function Done() {
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();

  return (
    <SuccessScreen
      title={draft.source === 'cash' ? copy.booking.paidTitle : copy.booking.creditTitle}
      sub={copy.booking.successSub}
      actions={
        <>
          <Button
            label={copy.booking.trackWash}
            size="lg"
            fullWidth
            onPress={() => router.replace('/(tabs)/bookings')}
          />
          <Button label={copy.booking.backHome} variant="ghost" fullWidth onPress={() => router.replace('/(tabs)/home')} />
        </>
      }
    >
      <BookingTicket
        time={draft.slot}
        meta={`${draft.day} · ${draft.vehicleLabel} · ${draft.addressLabel}`}
      />
    </SuccessScreen>
  );
}
