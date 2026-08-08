import { Text, StyleSheet } from 'react-native';
import { Card, Heading, Screen } from '@bubbly/ui-native';
import { color, fontSize } from '@bubbly/design-tokens';
import type { Vehicle } from '@bubbly/types';

// Static until a vehicles endpoint exists; shape matches @bubbly/types.
const DEMO_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    ownerId: 'usr-client-1',
    make: 'Toyota',
    model: 'Camry',
    color: 'White',
    plate: 'HSA 8341',
    size: 'sedan',
  },
];

export default function Garage() {
  return (
    <Screen>
      <Heading title="Garage" meta="Vehicles on your account" />
      {DEMO_VEHICLES.map((vehicle) => (
        <Card key={vehicle.id}>
          <Text style={styles.name}>
            {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.sub}>
            {vehicle.color} · {vehicle.plate} · {vehicle.size}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: fontSize.emphasis, fontWeight: '700', color: color.ink },
  sub: { color: color.inkSoft },
});
