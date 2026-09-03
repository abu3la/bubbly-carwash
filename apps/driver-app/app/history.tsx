import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt } from '@sama/ui-native';
import { doneJobs, type Job } from '../src/api';
import { copy } from '../src/copy';

export default function History() {
  const router = useRouter();
  const [rows, setRows] = useState<Array<Pick<Job, 'id' | 'ref' | 'scheduled_at' | 'service_key'>> | null>(null);
  const [error, setError] = useState(false);
  useFocusEffect(useCallback(() => {
    void doneJobs().then((result) => { setRows(result.jobs); setError(false); }).catch(() => setError(true));
  }, []));
  return <Screen scroll contentStyle={styles.page}>
    <View style={styles.head}><Txt variant="title" weight="bold">{copy.history}</Txt><Button label="رجوع" variant="ghost" size="sm" onPress={() => router.back()} /></View>
    {error ? <Txt variant="small" tone="danger">تعذّر تحميل السجل.</Txt> : null}
    {rows?.length === 0 ? <Txt variant="small" tone="secondary" center>{copy.noHistory}</Txt> : null}
    {(rows ?? []).map((job) => <Card key={job.id} style={styles.job}>
      <Num variant="body" weight="bold">{job.ref}</Num>
      <Txt variant="small">{copy.services[job.service_key] ?? job.service_key}</Txt>
      <Txt variant="caption" tone="secondary">{new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Riyadh' }).format(new Date(job.scheduled_at))}</Txt>
    </Card>)}
  </Screen>;
}
const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  job: { gap: theme.spacing[1] + 2 },
}));
