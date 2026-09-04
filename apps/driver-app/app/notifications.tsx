import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Screen, Txt } from '@sama/ui-native';
import { notifications, readNotification, type DriverNotification } from '../src/api';
import { copy } from '../src/copy';

export default function Notifications() {
  const router = useRouter();
  const [rows, setRows] = useState<DriverNotification[] | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    try { setRows((await notifications()).notifications); setError(false); }
    catch { setError(true); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return <Screen scroll contentStyle={styles.page}>
    <View style={styles.head}><Txt variant="title" weight="bold">{copy.notifications}</Txt><Button label="رجوع" variant="ghost" size="sm" onPress={() => router.back()} /></View>
    {error ? <Button label="إعادة المحاولة" variant="secondary" onPress={() => void load()} /> : null}
    {rows?.length === 0 ? <Txt variant="small" tone="secondary" center>لا توجد تنبيهات.</Txt> : null}
    {(rows ?? []).map((item) => <Card key={item.id} variant={item.read_at ? 'default' : 'booking'} onPress={async () => {
      if (!item.read_at) await readNotification(item.id);
      if (item.booking_id) router.push(`/job/${item.booking_id}`);
      else await load();
    }} style={styles.item}>
      <Txt variant="body" weight="bold">{item.title_ar}</Txt>
      <Txt variant="small" tone="secondary">{item.body_ar}</Txt>
      <Txt variant="caption" tone="muted">{new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' }).format(new Date(item.created_at))}</Txt>
    </Card>)}
  </Screen>;
}
const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { gap: theme.spacing[1] + 2 },
}));
