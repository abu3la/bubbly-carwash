import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, MapPin, Plus } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Badge, Button, Card, Num, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { VEHICLE } from '../../src/content';
import { useCopy } from '../../src/i18n';

export default function VehicleAndPlace() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const copy = useCopy();

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.vehicleAndPlace} step={2} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <View>
          <SectionLabel>{copy.booking.vehicleSection}</SectionLabel>
          <Card selected style={styles.row}>
            <View style={styles.icon}>
              <Car size={theme.scale(21)} color={theme.action.primary} strokeWidth={2} />
            </View>
            <View style={styles.text}>
              <Txt variant="body" weight="bold">
                {copy.vehicleName}
              </Txt>
              {/* Only the plate digits are isolated. Wrapping the whole
                  phrase would make its Arabic words part of a left-to-right
                  run, and the bidi algorithm then splits them around it. */}
              <Txt variant="caption" tone="secondary">
                {copy.booking.plateLabel}{' '}
                <Num variant="caption" tone="secondary">
                  {VEHICLE.plate}
                </Num>{' '}
                {VEHICLE.plateLetters} · {copy.booking.defaultVehicle}
              </Txt>
            </View>
            <Badge tone="violet">{copy.booking.selected}</Badge>
          </Card>
          <Button
            label={copy.booking.addVehicle}
            variant="ghost"
            size="sm"
            onPress={() => {}}
            icon={<Plus size={theme.scale(15)} color={theme.action.primary} strokeWidth={2.5} />}
            style={styles.addVehicle}
          />
        </View>

        <View>
          <SectionLabel>{copy.booking.locationSection}</SectionLabel>
          <Card style={styles.row}>
            <MapPin size={theme.scale(19)} color={theme.text.primary} strokeWidth={2} />
            <View style={styles.text}>
              <Txt variant="body" weight="bold">
                {copy.addressLabel}
              </Txt>
              <Txt variant="caption" tone="secondary">
                {copy.addressFull}
              </Txt>
            </View>
            <Button label={copy.common.change} variant="ghost" size="sm" onPress={() => {}} />
          </Card>
        </View>

        <Button label={copy.common.continue} size="lg" fullWidth onPress={() => router.push('/book/slot')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  text: { flex: 1, gap: 1 },
  icon: {
    width: theme.scale(42),
    height: theme.scale(42),
    borderRadius: theme.scale(13),
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.action.tint,
  },
  addVehicle: { marginTop: theme.spacing[2] },
}));
