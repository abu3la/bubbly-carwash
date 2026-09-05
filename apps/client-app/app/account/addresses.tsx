import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { deleteAddress, hasVillaAddress, setDefaultAddress } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

export default function Addresses() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const { addresses, refresh, loading, error: loadError } = useCustomerData();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const ar = language === 'ar';
  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'عناويني' : 'My addresses'} onBack={() => router.back()} />
      <View style={styles.body}>
        <Txt variant="body" tone="secondary">{ar ? 'الخدمة في شربتلي فيلج، جدة. يحتاج كل عنوان إلى موقع ورقم فيلا معتمد.' : 'Service is in Sharbatly Village, Jeddah. Each address needs a verified location and villa number.'}</Txt>
        {loading ? <Txt variant="small" tone="secondary">{ar ? 'نحمّل عناوينك…' : 'Loading your addresses…'}</Txt> : null}
        {!loading && !addresses.length ? <Txt variant="body">{ar ? 'لم تضف عنوانًا بعد. تحقق من موقع فيلتك لتبدأ.' : 'No addresses yet. Check your villa location to get started.'}</Txt> : null}
        {error ? <Txt variant="small" tone="danger">{error}</Txt> : null}
        {loadError ? <Button label={ar ? 'إعادة المحاولة' : 'Try again'} variant="secondary" fullWidth onPress={() => void refresh()} /> : null}
        {addresses.map((address) => (
          <Card key={address.id} selected={address.is_default} style={styles.card}>
            <MapPin size={theme.scale(20)} color={theme.text.secondary} strokeWidth={2} />
            <View style={styles.text}>
              <Txt variant="body" weight="bold">{address.line}</Txt>
              <Txt variant="caption" tone="secondary">{hasVillaAddress(address) ? (ar ? `فيلا ${address.villa_number} · شربتلي فيلج` : `Villa ${address.villa_number} · Sharbatly Village`) : (ar ? 'تحقق من الموقع ورقم الفيلا' : 'Verify the location and villa number')}</Txt>
              {address.is_default ? <Txt variant="caption" weight="semibold" tone="action">{ar ? 'العنوان الافتراضي' : 'Default address'}</Txt> : null}
            </View>
            <View style={styles.actions}>
              {!hasVillaAddress(address) ? <Button label={ar ? 'تحقق' : 'Verify'} size="sm" variant="secondary" onPress={() => router.push({ pathname: '/onboarding/map', params: { returnTo: 'addresses' } })} /> : null}
              {!address.is_default && hasVillaAddress(address) ? <Button label={ar ? 'اختيار' : 'Select'} size="sm" variant="secondary" disabled={busy !== null} onPress={async () => { setBusy(address.id); setError(''); try { await setDefaultAddress(address.id); await refresh(); } catch { setError(ar ? 'تعذّر تحديث العنوان. قد يكون مرتبطًا بحجز. حاول مرة أخرى.' : 'Could not update the address. It may be linked to a booking. Try again.'); } finally { setBusy(null); } }} /> : null}
              <Button label={ar ? 'حذف' : 'Delete'} size="sm" variant="ghost" disabled={busy !== null} onPress={async () => { setBusy(address.id); setError(''); try { await deleteAddress(address.id); await refresh(); } catch { setError(ar ? 'تعذّر تحديث العنوان. قد يكون مرتبطًا بحجز. حاول مرة أخرى.' : 'Could not update the address. It may be linked to a booking. Try again.'); } finally { setBusy(null); } }} />
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
