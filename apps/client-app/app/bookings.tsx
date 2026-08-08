import { Text, View, StyleSheet } from 'react-native';
import { useBookings, useUpdateBookingStatus } from '@bubbly/api-client';
import { Button, Card, Heading, Screen, StatusBadge } from '@bubbly/ui-native';
import { color, fontSize } from '@bubbly/design-tokens';
import { formatMoney, formatSlot } from '@bubbly/utils';
import { DEMO_CLIENT_ID } from './index';

export default function Bookings() {
  const bookings = useBookings({ clientId: DEMO_CLIENT_ID });
  const updateStatus = useUpdateBookingStatus();

  return (
    <Screen>
      <Heading title="My washes" meta="Live status of every booking" />
      {bookings.isPending && <Text style={styles.note}>Loading…</Text>}
      {bookings.isError && <Text style={styles.note}>Can't reach the API.</Text>}
      {bookings.data?.length === 0 && <Text style={styles.note}>No washes yet — book one.</Text>}
      {bookings.data?.map((booking) => {
        const cancellable = booking.status === 'pending' || booking.status === 'assigned';
        return (
          <Card key={booking.id}>
            <View style={styles.rowBetween}>
              <StatusBadge status={booking.status} />
              <Text style={styles.price}>{formatMoney(booking.priceMinor, booking.currency)}</Text>
            </View>
            <Text style={styles.when}>{formatSlot(booking.scheduledAt)}</Text>
            <Text style={styles.address}>{booking.address}</Text>
            {cancellable && (
              <Button
                label="Cancel booking"
                variant="quiet"
                onPress={() => updateStatus.mutate({ id: booking.id, status: 'cancelled' })}
                disabled={updateStatus.isPending}
              />
            )}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: color.inkSoft },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: '600', color: color.ink, fontVariant: ['tabular-nums'] },
  when: { fontSize: fontSize.emphasis, fontWeight: '600', color: color.ink },
  address: { color: color.inkSoft },
});
