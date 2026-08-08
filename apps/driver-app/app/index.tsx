import { Text, View, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useDriverQueue, useUpdateBookingStatus } from '@bubbly/api-client';
import { Button, Card, Heading, Screen } from '@bubbly/ui-native';
import { color, fontSize } from '@bubbly/design-tokens';
import { formatMoney, formatSlot } from '@bubbly/utils';

// Demo identity until auth lands (matches the API's seeded data).
export const DEMO_DRIVER_ID = 'usr-driver-1';

export default function Queue() {
  const queue = useDriverQueue();
  const updateStatus = useUpdateBookingStatus();
  const router = useRouter();

  const accept = (id: string) => {
    updateStatus.mutate(
      { id, status: 'assigned', driverId: DEMO_DRIVER_ID },
      { onSuccess: () => router.push(`/job/${id}`) },
    );
  };

  return (
    <Screen>
      <Heading title="Job queue" meta="Open washes waiting for a driver" />
      {queue.isPending && <Text style={styles.note}>Loading queue…</Text>}
      {queue.isError && (
        <Text style={styles.note}>Can't reach the API. Start it with: pnpm --filter @bubbly/api dev</Text>
      )}
      {queue.data?.length === 0 && <Text style={styles.note}>Queue is empty — check back soon.</Text>}
      {queue.data?.map((job) => (
        <Card key={job.id}>
          <View style={styles.rowBetween}>
            <Text style={styles.when}>{formatSlot(job.scheduledAt)}</Text>
            <Text style={styles.price}>{formatMoney(job.priceMinor, job.currency)}</Text>
          </View>
          <Text style={styles.address}>{job.address}</Text>
          <Button
            label={updateStatus.isPending ? 'Accepting…' : 'Accept job'}
            onPress={() => accept(job.id)}
            disabled={updateStatus.isPending}
          />
        </Card>
      ))}
      <View style={styles.links}>
        <Link href="/history" style={styles.link}>
          My jobs & earnings
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: color.inkSoft },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  when: { fontSize: fontSize.emphasis, fontWeight: '600', color: color.ink },
  price: { fontWeight: '600', color: color.ink, fontVariant: ['tabular-nums'] },
  address: { color: color.inkSoft },
  links: { alignItems: 'center', paddingVertical: 8 },
  link: { color: color.aquaDeep, fontWeight: '600', fontSize: fontSize.body },
});
