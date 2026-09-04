import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Input, Screen, Tag, Txt } from '@sama/ui-native';
import { useCopy } from '../../src/i18n';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { ApiError, saveAddress } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

export default function SaveAddress() {
  const router = useRouter();
  const copy = useCopy();
  const { refresh } = useCustomerData();
  // Carried from the map: the coordinates and address the customer chose.
  const picked = useLocalSearchParams<{
    lat?: string; lng?: string; line?: string; district?: string; city?: string; returnTo?: string;
  }>();
  const [label, setLabel] = useState(0);
  const [line, setLine] = useState(picked.line ?? '');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setError(null);
    setSaving(true);
    try {
      await saveAddress({
        label: (['home', 'work', 'other'] as const)[label] ?? 'home',
        line: line.trim(),
        district: picked.district ?? '',
        city: picked.city ?? '',
        // Undefined rather than NaN when the map did not run — the API
        // treats a missing coordinate as "not known yet", but NaN as invalid.
        lat: picked.lat ? Number(picked.lat) : undefined,
        lng: picked.lng ? Number(picked.lng) : undefined,
        notes: note,
      });
      await refresh();
      if (picked.returnTo === 'home') {
        router.replace('/(tabs)/home');
      } else if (picked.returnTo === 'booking') {
        router.replace('/book/vehicle');
      } else if (picked.returnTo === 'addresses') {
        router.replace('/account/addresses');
      } else {
        // The car is the last thing onboarding needs, and it comes after the
        // address because a wash without a place to happen is meaningless.
        router.push('/onboarding/vehicle');
      }
    } catch (e) {
      // The address is the one thing a wash cannot happen without, so a failure
      // here stops the flow rather than being swallowed.
      setError(copy.addressErrors[e instanceof ApiError && e.code in copy.addressErrors
        ? (e.code as keyof typeof copy.addressErrors)
        : 'unknown']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen contentStyle={styles.screen}>
      <FlowHeader
        title={copy.onboarding.addressTitle}
        step={picked.returnTo ? undefined : 4}
        steps={picked.returnTo ? undefined : 5}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        <View style={styles.head}>
          <Txt variant="title" weight="bold">
            {copy.onboarding.addressHeading}
          </Txt>
          <Txt variant="small" tone="secondary">
            {copy.onboarding.addressManualSub}
          </Txt>
        </View>

        <Input
          value={line}
          onChangeText={setLine}
          placeholder={copy.onboarding.addressLinePlaceholder}
        />

        <View>
          <SectionLabel>{copy.onboarding.addressLabelSection}</SectionLabel>
          <View style={styles.tags}>
            {copy.onboarding.addressLabels.map((option, i) => (
              <Tag key={option} selected={label === i} onPress={() => setLabel(i)}>
                {option}
              </Tag>
            ))}
          </View>
        </View>

        <Input
          label={copy.onboarding.accessNotes}
          value={note}
          onChangeText={setNote}
          placeholder={copy.onboarding.accessNotesPlaceholder}
        />

        <View style={styles.spacer} />

        {error ? (
          <Txt variant="small" tone="danger" center>
            {error}
          </Txt>
        ) : null}

        <Button
          label={saving
            ? copy.common.sending
            : picked.returnTo
              ? copy.onboarding.saveLocation
              : copy.onboarding.saveAndContinue}
          size="lg"
          fullWidth
          disabled={saving || line.trim().length < 4}
          onPress={finish}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingBottom: theme.spacing[7] },
  body: { flex: 1, paddingHorizontal: theme.spacing[6], paddingTop: theme.spacing[5], gap: theme.spacing[5] },
  head: { gap: theme.spacing[1] + 2 },
  tags: { flexDirection: 'row', gap: theme.spacing[2] },
  spacer: { flex: 1 },
}));
