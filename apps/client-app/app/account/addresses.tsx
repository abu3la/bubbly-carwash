import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Screen, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { deleteAddress, setDefaultAddress } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

export default function Addresses() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const { addresses, refresh } = useCustomerData();
  const [busy, setBusy] = useState<string | null>(null);
  const ar = language === 'ar';
  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'عناويني' : 'My addresses'} onBack={() => router.back()} />
      <View style={styles.body}>
        {addresses.map((address) => (
          <Card key={address.id} selected={address.is_default} style={styles.card}>
            <MapPin size={theme.scale(20)} color={theme.text.secondary} strokeWidth={2} />
            <View style={styles.text}>
              <Txt variant="body" weight="bold">{address.line}</Txt>
              <Txt variant="caption" tone="secondary">{[address.district, address.city].filter(Boolean).join(' · ')}</Txt>
              {address.is_default ? <Txt variant="caption" weight="semibold" tone="action">{ar ? 'العنوان الافتراضي' : 'Default address'}</Txt> : null}
            </View>
            <View style={styles.actions}>
              {!address.is_default ? <Button label={ar ? 'اختيار' : 'Select'} size="sm" variant="secondary" disabled={busy !== null} onPress={async () => { setBusy(address.id); try { await setDefaultAddress(address.id); await refresh(); } finally { setBusy(null); } }} /> : null}
              <Button label={ar ? 'حذف' : 'Delete'} size="sm" variant="ghost" disabled={busy !== null} onPress={async () => { setBusy(address.id); try { await deleteAddress(address.id); await refresh(); } finally { setBusy(null); } }} />
            </View>
          </Card>
        ))}
        <Button label={ar ? 'إضافة عنوان' : 'Add address'} fullWidth onPress={() => router.push({ pathname: '/onboarding/map', params: { returnTo: 'addresses' } })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  card: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  text: { flex: 1, gap: 2 },
  actions: { gap: theme.spacing[1], alignItems: 'stretch' },
}));
