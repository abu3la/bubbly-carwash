import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Input, Screen, Tag, Txt } from '@sama/ui-native';
import { useCopy } from '../../src/i18n';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { ApiError, saveVehicle } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

const SIZES = ['sedan', 'suv', 'pickup'] as const;

export default function RegisterVehicle() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { refresh } = useCustomerData();
  const copy = useCopy();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [size, setSize] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The plate is what the technician reads at the gate; make and model are how
  // they spot the car in a compound. Colour helps but is not worth blocking on.
  const ready = make.trim() && model.trim() && plate.trim().length >= 3;

  const finish = async () => {
    setError(null);
    setSaving(true);
    try {
      await saveVehicle({ make, model, color, plate, size: SIZES[size] });
      await refresh();
      if (returnTo === 'booking' || returnTo === 'vehicles') {
        router.replace(returnTo === 'booking' ? '/book/vehicle' : '/account/vehicles');
        return;
      }
      router.replace('/(tabs)/home');
    } catch (e) {
      setError(
        copy.vehicleErrors[
          e instanceof ApiError && e.code in copy.vehicleErrors
            ? (e.code as keyof typeof copy.vehicleErrors)
            : 'unknown'
        ],
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll contentStyle={styles.screen}>
      <FlowHeader title={copy.onboarding.vehicleTitle} step={4} steps={4} onBack={() => router.back()} />

      <View style={styles.body}>
        <View style={styles.head}>
          <Txt variant="title" weight="bold">
            {copy.onboarding.vehicleHeading}
          </Txt>
          <Txt variant="small" tone="secondary">
            {copy.onboarding.vehicleSub}
          </Txt>
        </View>

        <View style={styles.fields}>
          <Input value={make} onChangeText={setMake} placeholder={copy.onboarding.vehicleMake} />
          <Input value={model} onChangeText={setModel} placeholder={copy.onboarding.vehicleModel} />
          <Input value={color} onChangeText={setColor} placeholder={copy.onboarding.vehicleColour} />
          <Input value={plate} onChangeText={setPlate} placeholder={copy.onboarding.vehiclePlate} />
        </View>

        <View>
          <SectionLabel>{copy.onboarding.vehicleSizeSection}</SectionLabel>
          <View style={styles.tags}>
            {copy.vehicleSizes.map((label, i) => (
              <Tag key={label} selected={size === i} onPress={() => setSize(i)}>
                {label}
              </Tag>
            ))}
          </View>
        </View>

        <View style={styles.spacer} />

        {error ? (
          <Txt variant="small" tone="danger" center>
            {error}
          </Txt>
        ) : null}

        <Button
          label={saving ? copy.common.sending : copy.onboarding.saveAndContinue}
          size="lg"
          fullWidth
          disabled={!ready || saving}
          onPress={finish}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingBottom: theme.spacing[7] },
  body: { flex: 1, paddingHorizontal: theme.spacing[6], paddingTop: theme.spacing[5], gap: theme.spacing[4] },
  head: { gap: theme.spacing[1] + 2 },
  fields: { gap: theme.spacing[3] },
  tags: { flexDirection: 'row', gap: theme.spacing[2], flexWrap: 'wrap' },
  spacer: { flex: 1, minHeight: theme.spacing[5] },
}));
