import { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { BeatIcon, Button, Card, Num, Screen, Txt } from '@bubbles/ui-native';
import { doneJobs, type Job } from '../src/api';
import { copy } from '../src/copy';
import { DriverNav } from '../src/DriverNav';
import { jobDate, jobTime } from '../src/jobPresentation';

export default function History() {
  const [rows, setRows] = useState<Array<Pick<Job, 'id' | 'ref' | 'scheduled_at' | 'service_key'>> | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try { setRows((await doneJobs()).jobs); setError(false); }
    catch { setError(true); }
    finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return <View style={styles.root}>
    <Screen scroll safeBottom={false} contentStyle={styles.page}>
      <Txt variant="title" weight="bold">سجل العمل</Txt>
      <Txt variant="small" tone="secondary">آخر 50 مهمة أنهيتها بعد مراجعة الجودة.</Txt>
      {loading ? <ActivityIndicator /> : null}
      {error ? <View style={styles.job}><Txt variant="small" tone="danger">تعذّر تحميل السجل.</Txt><Button label="إعادة المحاولة" disabled={loading} variant="ghost" onPress={() => void load()} /></View> : null}
      {rows?.length === 0 ? <View style={styles.empty}><BeatIcon size="lg" active={0} /><Txt variant="heading" weight="bold" center>{copy.noHistory}</Txt><Txt variant="small" tone="secondary" center>تظهر المهمة هنا بعد توثيق الغسيل ومراجعة الجودة.</Txt></View> : null}
      {(rows ?? []).map((job) => <Card key={job.id} style={styles.job}>
        <View style={styles.row}><Num variant="body" weight="bold">{job.ref}</Num><BeatIcon size="sm" active={3} /></View>
        <Txt variant="body" weight="semibold">{copy.services[job.service_key] ?? job.service_key}</Txt>
        <Txt variant="small" tone="secondary">{jobDate(job.scheduled_at)}</Txt>
        <Num variant="small" tone="secondary">{jobTime(job.scheduled_at)}</Num>
      </Card>)}
    </Screen>
    <DriverNav active="history" />
  </View>;
}
const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.surface.page },
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], paddingBottom: theme.spacing[4], gap: theme.spacing[4] },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  job: { gap: theme.spacing[2], boxShadow: undefined },
  empty: { alignItems: 'center', gap: theme.spacing[4], paddingVertical: theme.spacing[8] },
}));
