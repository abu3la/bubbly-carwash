import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Car } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { deleteVehicle, setDefaultVehicle } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

export default function Vehicles() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const { vehicles, refresh, loading, error: loadError } = useCustomerData();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const ar = language === 'ar';
  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'سياراتي' : 'My vehicles'} onBack={() => router.back()} />
      <View style={styles.body}>
        {loading ? <Txt variant="small" tone="secondary">{ar ? 'نحمّل سياراتك…' : 'Loading your vehicles…'}</Txt> : null}
        {!loading && !vehicles.length ? <Txt variant="body">{ar ? 'أضف سيارتك ليتعرف عليها الفريق عند الوصول.' : 'Add your car so the team can identify it on arrival.'}</Txt> : null}
        {error ? <Txt variant="small" tone="danger">{error}</Txt> : null}
        {loadError ? <Button label={ar ? 'إعادة المحاولة' : 'Try again'} variant="secondary" fullWidth onPress={() => void refresh()} /> : null}
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} selected={vehicle.is_default} style={styles.card}>
            <Car size={theme.scale(21)} color={theme.text.secondary} strokeWidth={2} />
            <View style={styles.text}>
              <Txt variant="body" weight="bold">{vehicle.make} {vehicle.model}</Txt>
              <Txt variant="caption" tone="secondary">{vehicle.color} · {vehicle.plate}</Txt>
              {vehicle.is_default ? <Txt variant="caption" weight="semibold" tone="action">{ar ? 'السيارة الافتراضية' : 'Default vehicle'}</Txt> : null}
            </View>
            <View style={styles.actions}>
              {!vehicle.is_default ? <Button label={ar ? 'اختيار' : 'Select'} size="sm" variant="secondary" disabled={busy !== null} onPress={async () => { setBusy(vehicle.id); setError(''); try { await setDefaultVehicle(vehicle.id); await refresh(); } catch { setError(ar ? 'تعذّر تحديث السيارة. قد تكون مرتبطة بحجز. حاول مرة أخرى.' : 'Could not update the vehicle. It may be linked to a booking. Try again.'); } finally { setBusy(null); } }} /> : null}
              <Button label={ar ? 'حذف' : 'Delete'} size="sm" variant="ghost" disabled={busy !== null} onPress={async () => { setBusy(vehicle.id); setError(''); try { await deleteVehicle(vehicle.id); await refresh(); } catch { setError(ar ? 'تعذّر تحديث السيارة. قد تكون مرتبطة بحجز. حاول مرة أخرى.' : 'Could not update the vehicle. It may be linked to a booking. Try again.'); } finally { setBusy(null); } }} />
            </View>
          </Card>
        ))}
        <Button label={ar ? 'إضافة سيارة' : 'Add vehicle'} fullWidth onPress={() => router.push({ pathname: '/onboarding/vehicle', params: { returnTo: 'vehicles' } })} />
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
