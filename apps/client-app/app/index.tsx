import { Text, View, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useCreateBooking, useServices } from '@bubbly/api-client';
import { Button, Card, Heading, Screen } from '@bubbly/ui-native';
import { color, fontSize } from '@bubbly/design-tokens';
import { formatDuration, formatMoney } from '@bubbly/utils';

// Demo identity until auth lands (matches the API's seeded data).
export const DEMO_CLIENT_ID = 'usr-client-1';
export const DEMO_VEHICLE_ID = 'veh-1';

export default function Home() {
  const services = useServices();
  const createBooking = useCreateBooking();
  const router = useRouter();

  const book = (serviceId: string) => {
    createBooking.mutate(
      {
        clientId: DEMO_CLIENT_ID,
        vehicleId: DEMO_VEHICLE_ID,
        serviceId,
        address: 'King Fahd Rd, Al Olaya, Riyadh',
        location: { lat: 24.6905, lng: 46.6852 },
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
      { onSuccess: () => router.push('/bookings') },
    );
  };

  return (
    <Screen>
      <Heading title="Book a wash" meta="A driver comes to your car" />
      {services.isPending && <Text style={styles.note}>Loading packages…</Text>}
      {services.isError && (
        <Text style={styles.note}>Can't reach the API. Start it with: pnpm --filter @bubbly/api dev</Text>
      )}
      {services.data?.map((service) => (
        <Card key={service.id}>
          <Text style={styles.name}>{service.name}</Text>
          <Text style={styles.desc}>{service.description}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>
              {formatMoney(service.priceMinor, service.currency)} · {formatDuration(service.durationMinutes)}
            </Text>
          </View>
          <Button
            label={createBooking.isPending ? 'Booking…' : 'Book this'}
            onPress={() => book(service.id)}
            disabled={createBooking.isPending}
          />
        </Card>
      ))}
      <View style={styles.links}>
        <Link href="/bookings" style={styles.link}>
          My washes
        </Link>
        <Link href="/garage" style={styles.link}>
          Garage
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: color.inkSoft },
  name: { fontSize: fontSize.emphasis, fontWeight: '700', color: color.ink },
  desc: { color: color.inkSoft },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  price: { fontWeight: '600', color: color.ink, fontVariant: ['tabular-nums'] },
  links: { flexDirection: 'row', gap: 24, justifyContent: 'center', paddingVertical: 8 },
  link: { color: color.aquaDeep, fontWeight: '600', fontSize: fontSize.body },
});
