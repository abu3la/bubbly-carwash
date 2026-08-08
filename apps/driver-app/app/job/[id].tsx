import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBooking, useUpdateBookingStatus } from '@bubbly/api-client';
import { Button, Card, Heading, Screen, StatusBadge } from '@bubbly/ui-native';
import { color, fontSize } from '@bubbly/design-tokens';
import { NEXT_STATUS } from '@bubbly/types';
import { formatMoney, formatSlot } from '@bubbly/utils';

const ACTION_LABELS: Record<string, string> = {
  en_route: "I'm on my way",
  washing: 'Start washing',
  done: 'Finish job',
};

export default function Job() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = useBooking(id);
  const updateStatus = useUpdateBookingStatus();

  if (job.isPending) {
    return (
      <Screen>
        <Text style={styles.note}>Loading job…</Text>
      </Screen>
    );
  }
  if (job.isError || !job.data) {
    return (
      <Screen>
        <Text style={styles.note}>Job not found.</Text>
      </Screen>
    );
  }

  const booking = job.data;
  const next = NEXT_STATUS[booking.status];
  const actionable = next && next !== 'assigned';

  return (
    <Screen>
      <Heading title="Job" meta={booking.id} />
      <Card>
        <StatusBadge status={booking.status} />
        <Text style={styles.when}>{formatSlot(booking.scheduledAt)}</Text>
        <Text style={styles.address}>{booking.address}</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.meta}>vehicle {booking.vehicleId}</Text>
          <Text style={styles.price}>{formatMoney(booking.priceMinor, booking.currency)}</Text>
        </View>
      </Card>
      {actionable && (
        <Button
          label={updateStatus.isPending ? 'Updating…' : ACTION_LABELS[next]}
          onPress={() => updateStatus.mutate({ id: booking.id, status: next })}
          disabled={updateStatus.isPending}
        />
      )}
      {booking.status === 'done' && <Text style={styles.note}>Job complete. Nice work.</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: color.inkSoft },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  when: { fontSize: fontSize.emphasis, fontWeight: '600', color: color.ink },
  address: { color: color.inkSoft },
  meta: { color: color.inkFaint, fontSize: fontSize.caption },
  price: { fontWeight: '600', color: color.ink, fontVariant: ['tabular-nums'] },
});
