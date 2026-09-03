import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';
import { useCustomerData } from '../../src/customerData';

export default function VehicleAndPlace() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const copy = useCopy();
  const draft = useBookingDraft();
  const { vehicles, addresses, loading, refresh } = useCustomerData();

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    if (!draft.vehicleId && vehicles.length) draft.setVehicle(vehicles.find((v) => v.is_default) ?? vehicles[0]);
    if (!draft.addressId && addresses.length) draft.setAddress(addresses.find((a) => a.is_default) ?? addresses[0]);
  }, [vehicles, addresses, draft.vehicleId, draft.addressId]);

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.vehicleAndPlace} step={2} steps={5} onBack={() => router.back()} />
      <View style={styles.body}>
        <View style={styles.section}>
          <SectionLabel>{copy.booking.vehicleSection}</SectionLabel>
          {vehicles.map((vehicle) => {
            const selected = draft.vehicleId === vehicle.id;
            return (
              <Card key={vehicle.id} selected={selected} onPress={() => draft.setVehicle(vehicle)} style={styles.row}>
                <Car size={theme.scale(20)} color={selected ? theme.action.primary : theme.text.secondary} strokeWidth={2} />
                <View style={styles.text}>
                  <Txt variant="body" weight="bold">{vehicle.make} {vehicle.model}</Txt>
                  <Txt variant="caption" tone="secondary">
                    {vehicle.color ? `${vehicle.color} · ` : ''}{copy.booking.plateLabel}{' '}
                    <Num variant="caption" tone="secondary">{vehicle.plate}</Num>
                  </Txt>
                </View>
                <Txt variant="caption" weight="semibold" tone={selected ? 'action' : 'muted'}>
                  {selected ? copy.booking.selected : copy.common.change}
                </Txt>
              </Card>
            );
          })}
          <Button label={copy.onboarding.vehicleTitle} variant="secondary" fullWidth onPress={() => router.push({ pathname: '/onboarding/vehicle', params: { returnTo: 'booking' } })} />
        </View>

        <View style={styles.section}>
          <SectionLabel>{copy.booking.locationSection}</SectionLabel>
          {addresses.map((address) => {
            const selected = draft.addressId === address.id;
            return (
              <Card key={address.id} selected={selected} onPress={() => draft.setAddress(address)} style={styles.row}>
                <MapPin size={theme.scale(19)} color={selected ? theme.action.primary : theme.text.secondary} strokeWidth={2} />
                <View style={styles.text}>
                  <Txt variant="body" weight="bold">{address.line}</Txt>
                  <Txt variant="caption" tone="secondary">{[address.district, address.city].filter(Boolean).join(' · ')}</Txt>
                </View>
                <Txt variant="caption" weight="semibold" tone={selected ? 'action' : 'muted'}>
                  {selected ? copy.booking.selected : copy.common.change}
                </Txt>
              </Card>
            );
          })}
          <Button label={copy.onboarding.saveLocation} variant="secondary" fullWidth onPress={() => router.push({ pathname: '/onboarding/map', params: { returnTo: 'booking' } })} />
        </View>

        {loading ? <Txt variant="small" tone="secondary" center>{copy.common.sending}</Txt> : null}
        <Button label={copy.common.continue} size="lg" fullWidth disabled={loading || !draft.vehicleId || !draft.addressId || draft.addressLat == null || draft.addressLng == null} onPress={() => router.push('/book/slot')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  section: { gap: theme.spacing[2] },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  text: { flex: 1, gap: 2 },
}));
