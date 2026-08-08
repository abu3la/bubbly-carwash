import { Text, View, StyleSheet } from 'react-native';
import { useBookings } from '@bubbly/api-client';
import { Card, Heading, Screen, StatusBadge } from '@bubbly/ui-native';
import { color, fontSize } from '@bubbly/design-tokens';
import { formatMoney, formatSlot } from '@bubbly/utils';
import { DEMO_DRIVER_ID } from './index';

export default function History() {
  const jobs = useBookings({ driverId: DEMO_DRIVER_ID });

  const done = jobs.data?.filter((j) => j.status === 'done') ?? [];
  const earningsMinor = done.reduce((sum, j) => sum + j.priceMinor, 0);
  const currency = done[0]?.currency ?? 'SAR';

  return (
    <Screen>
      <Heading
        title="My jobs"
        meta={done.length > 0 ? `Earned ${formatMoney(earningsMinor, currency)} so far` : 'Your assigned and completed washes'}
      />
      {jobs.isPending && <Text style={styles.note}>Loading…</Text>}
      {jobs.isError && <Text style={styles.note}>Can't reach the API.</Text>}
      {jobs.data?.length === 0 && <Text style={styles.note}>No jobs yet — accept one from the queue.</Text>}
      {jobs.data?.map((job) => (
        <Card key={job.id}>
          <View style={styles.rowBetween}>
            <StatusBadge status={job.status} />
            <Text style={styles.price}>{formatMoney(job.priceMinor, job.currency)}</Text>
          </View>
          <Text style={styles.when}>{formatSlot(job.scheduledAt)}</Text>
          <Text style={styles.address}>{job.address}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: color.inkSoft },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  when: { fontSize: fontSize.emphasis, fontWeight: '600', color: color.ink },
  address: { color: color.inkSoft },
  price: { fontWeight: '600', color: color.ink, fontVariant: ['tabular-nums'] },
});
