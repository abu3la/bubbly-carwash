import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt } from '@bubbles/ui-native';
import { ApiError, driverProfile, incidents, jobs, type DriverIncident, type DriverProfile } from '../src/api';
import { DriverNav } from '../src/DriverNav';
import { copy } from '../src/copy';
import { useSession } from '../src/session';
import { unregisterFirebaseMessaging } from '../src/firebase';

export default function Account() {
  const router = useRouter();
  const { session, signOut } = useSession();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [reports, setReports] = useState<DriverIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const load = useCallback(async () => {
    const request = ++requestSequence.current;
    setLoading(true); setError(null);
    try {
      const [account, work, history] = await Promise.allSettled([driverProfile(), jobs(), incidents()]);
      if (request !== requestSequence.current) return;
      if (account.status === 'fulfilled') setProfile(account.value.profile);
      if (work.status === 'fulfilled') setTeam(work.value.team?.name_ar ?? null);
      if (history.status === 'fulfilled') setReports(history.value.incidents);
      const failed = [account, work, history].find((result) => result.status === 'rejected');
      if (failed?.status === 'rejected') setError(copy.errors[failed.reason instanceof ApiError ? failed.reason.code : 'unknown'] ?? copy.errors.unknown);
    } catch (e) { setError(copy.errors[e instanceof ApiError ? e.code : 'unknown'] ?? copy.errors.unknown); }
    finally { if (request === requestSequence.current) setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); return () => { requestSequence.current += 1; }; }, [load]));
  const logout = async () => {
    setBusy(true);
    try {
      await unregisterFirebaseMessaging().catch(() => undefined);
      await signOut();
    } catch { setError('تعذّر تسجيل الخروج. حاول مرة أخرى.'); }
    finally { setBusy(false); }
  };
  return <View style={styles.root}>
    <Screen scroll safeBottom={false} contentStyle={styles.page}>
      <Txt variant="title" weight="bold">حسابي</Txt>
      {loading ? <ActivityIndicator /> : null}
      {error ? <View style={styles.block}><Txt variant="small" tone="danger">{error}</Txt><Button label="إعادة المحاولة" variant="ghost" disabled={loading} onPress={() => void load()} /></View> : null}
      <View style={styles.identity}>
        <Txt variant="heading" weight="bold">{profile?.full_name || 'حساب السائق'}</Txt>
        <Num variant="body" tone="secondary">{profile?.phone || session?.phone}</Num>
        <Txt variant="small">{team ?? (loading ? 'جارٍ تحميل فريقك' : copy.noTeam)}</Txt>
        <Txt variant="caption" tone="secondary">لتعديل بياناتك أو المناوبة، تواصل مع إدارة التشغيل.</Txt>
      </View>
      <Button label="الإشعارات" variant="ghost" onPress={() => router.push('/notifications')} />
      <View style={styles.block}>
        <Txt variant="heading" weight="bold">بلاغاتي</Txt>
        {!loading && !error && reports.length === 0 ? <Txt tone="secondary" variant="small">لم ترسل بلاغات بعد. يمكنك إبلاغ الإدارة من تفاصيل المهمة.</Txt> : null}
        {reports.map((report) => <Card key={report.id} style={styles.report}>
          <Txt variant="small" weight="bold">{report.status === 'resolved' ? 'أُغلق البلاغ' : 'قيد المتابعة'}</Txt>
          <Txt variant="small">{report.note}</Txt>
          <Txt variant="caption" tone="secondary">{new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'medium', timeZone: 'Asia/Riyadh' }).format(new Date(report.created_at))}</Txt>
        </Card>)}
      </View>
      <Button label={busy ? 'جارٍ تسجيل الخروج' : copy.signOut} variant="dark" fullWidth disabled={busy} onPress={() => void logout()} />
    </Screen>
    <DriverNav active="account" />
  </View>;
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.surface.page },
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], paddingBottom: theme.spacing[5], gap: theme.spacing[5] },
  identity: { padding: theme.spacing[5], borderRadius: theme.radius.lg, backgroundColor: theme.surface.bookingSoft, gap: theme.spacing[3] },
  block: { gap: theme.spacing[3] },
  report: { gap: theme.spacing[2], boxShadow: undefined },
}));
