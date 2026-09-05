import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { listNotifications, markNotificationRead, type CustomerNotification } from '../src/api';

export default function Notifications() {
  const router = useRouter();
  const { language } = useLocale();
  const ar = language === 'ar';
  const [rows, setRows] = useState<CustomerNotification[] | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    try { setRows((await listNotifications()).notifications); setError(false); }
    catch { setError(true); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  return <Screen scroll contentStyle={styles.page}>
    <View style={styles.head}>
      <Txt variant="title" weight="bold">{ar ? 'التنبيهات' : 'Notifications'}</Txt>
      <Button label={ar ? 'رجوع' : 'Back'} variant="ghost" size="sm" onPress={() => router.back()} />
    </View>
    {error ? <Button label={ar ? 'إعادة المحاولة' : 'Retry'} variant="secondary" onPress={() => void load()} /> : null}
    {rows?.length === 0 ? <Txt variant="small" tone="secondary" center>{ar ? 'لا توجد تنبيهات بعد.' : 'No notifications yet.'}</Txt> : null}
    {(rows ?? []).map((item) => <Card key={item.id} variant={item.read_at ? 'default' : 'booking'} style={styles.item} onPress={async () => {
      if (!item.read_at) await markNotificationRead(item.id);
      if (item.booking_id) router.replace('/(tabs)/bookings');
      else await load();
    }}>
      <Txt variant="body" weight="bold">{ar ? item.title_ar : item.title_en}</Txt>
      <Txt variant="small" tone="secondary">{ar ? item.body_ar : item.body_en}</Txt>
      <Txt variant="caption" tone="muted">{new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' }).format(new Date(item.created_at))}</Txt>
    </Card>)}
  </Screen>;
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { gap: theme.spacing[1] + 2 },
}));
