import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { Bell, ChevronLeft, RefreshCw } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BeatIcon, Button, Card, IconButton, Num, Screen, Tabs, Txt } from '@bubbles/ui-native';
import { ApiError, jobs as fetchJobs, type DriverTeam, type Job } from '../src/api';
import { useSession } from '../src/session';
import { copy } from '../src/copy';
import { DriverNav } from '../src/DriverNav';
import { jobDate, jobTime, organizeJobs } from '../src/jobPresentation';

const LIT: Record<string, 0 | 1 | 2 | 3> = { booked: 0, arrived: 1, washed: 2, verified: 3 };

export default function Jobs() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { session, ready } = useSession();
  const [list, setList] = useState<Job[] | null>(null);
  const [team, setTeam] = useState<DriverTeam | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState('اليوم');
  const requestSequence = useRef(0);

  const load = useCallback(async () => {
    if (!session) return;
    const request = ++requestSequence.current;
    setRefreshing(true);
    try {
      const result = await fetchJobs();
      if (request !== requestSequence.current) return;
      setList(result.jobs); setTeam(result.team); setError(null);
    } catch (e) {
      if (request === requestSequence.current) setError(copy.errors[e instanceof ApiError ? e.code : 'unknown'] ?? copy.errors.unknown);
    } finally { if (request === requestSequence.current) setRefreshing(false); }
  }, [session]);
  useFocusEffect(useCallback(() => { void load(); return () => { requestSequence.current += 1; }; }, [load]));
  useEffect(() => {
    const listener = AppState.addEventListener('change', (state) => { if (state === 'active') void load(); });
    return () => listener.remove();
  }, [load]);

  if (!ready) return <View style={styles.loading}><ActivityIndicator /></View>;
  if (!session) return <Redirect href="/" />;

  const grouped = organizeJobs(list ?? [], session.userId);
  const teamName = team?.name_ar;
  const assignedBlocks = team?.coverage_blocks ?? [];
  const visible = (period === 'اليوم' ? grouped.today : grouped.upcoming).filter((job) => job.id !== grouped.current?.id);

  return <View style={styles.root}>
    <Screen scroll safeBottom={false} contentStyle={styles.page}>
      <View style={styles.topRow}>
        <View style={styles.grow}>
          <Txt variant="title" weight="bold">ميدان العمل</Txt>
          <Txt variant="small" tone="secondary">{jobDate(new Date().toISOString())}</Txt>
        </View>
        <IconButton label={copy.notifications} variant="ghost" onPress={() => router.push('/notifications')}>
          <Bell size={theme.scale(23)} color={theme.text.primary} />
        </IconButton>
      </View>
      <View style={styles.assignment}>
        <View style={styles.assignmentHead}>
          <Txt variant="heading" weight="bold">{list ? teamName ?? copy.noTeam : 'جارٍ تحميل فريقك'}</Txt>
          <IconButton label="تحديث المهام" variant="ghost" disabled={refreshing} onPress={() => void load()}>
            {refreshing ? <ActivityIndicator color={theme.text.primary} /> : <RefreshCw size={theme.scale(20)} color={theme.text.primary} />}
          </IconButton>
        </View>
        {assignedBlocks.length > 0 ? assignedBlocks.map((block) => <Txt key={block.id} variant="small" tone="secondary">
          {[block.coverage_areas?.name_ar, `بلوك ${block.code}`].filter(Boolean).join(' · ')}
        </Txt>) : <Txt variant="small" tone="secondary">{teamName ? 'لم تُسند نطاقات متاحة لفريقك بعد.' : 'تحدد الإدارة فريقك ومناوبتك لتصلك المهام.'}</Txt>}
        {list ? <View style={styles.totals}>
          <View style={styles.total}><Num variant="title" weight="bold">{grouped.today.length}</Num><Txt variant="small">مهام اليوم</Txt></View>
          <View style={styles.total}><Num variant="title" weight="bold">{grouped.today.filter((job) => job.technician_id === session.userId).length}</Num><Txt variant="small">باسمك</Txt></View>
          <View style={styles.total}><Num variant="title" weight="bold">{grouped.upcoming.length}</Num><Txt variant="small">قادمة</Txt></View>
        </View> : null}
      </View>
      {error ? <View accessibilityLiveRegion="polite" style={styles.message}>
        <Txt tone="danger" variant="small">{error}</Txt>
        {list ? <Txt variant="caption" tone="secondary">تظهر آخر بيانات محمّلة. حدّث المهام قبل المتابعة.</Txt> : null}
        <Button label="إعادة المحاولة" variant="ghost" disabled={refreshing} onPress={() => void load()} />
      </View> : null}
      {grouped.current ? <Card variant="dark" style={styles.current}>
        <View style={styles.assignmentHead}><Txt variant="body" tone="inverse" weight="bold">مهمتك الجارية</Txt><BeatIcon active={LIT[grouped.current.stage]} /></View>
        <Txt variant="heading" tone="inverse" weight="bold">{grouped.current.addresses?.line}</Txt>
        <Txt variant="small" tone="inverseSoft">{copy.stages[grouped.current.stage]} · {copy.services[grouped.current.service_key]}</Txt>
        <Button label="متابعة المهمة" variant="secondary" fullWidth onPress={() => router.push(`/job/${grouped.current!.id}`)} />
      </Card> : null}
      <Tabs tabs={['اليوم', 'القادمة']} value={period} onChange={setPeriod} />
      {!list && !error ? <View style={styles.empty}><BeatIcon animate /><Txt tone="secondary">جارٍ تحميل المهام</Txt></View> : null}
      {list && visible.length === 0 ? <View style={styles.empty}>
        <BeatIcon size="lg" active={0} />
        <Txt variant="heading" weight="bold" center>{grouped.current && period === 'اليوم' ? 'هذه مهمتك الوحيدة الآن' : period === 'اليوم' ? 'لا مهام لهذا اليوم' : 'لا مهام قادمة بعد'}</Txt>
        <Txt variant="small" tone="secondary" center>{teamName ? 'ستظهر الحجوزات المؤكدة لفريقك هنا. يمكنك تحديث القائمة.' : 'راجع الإدارة لربط حسابك بفريق متاح.'}</Txt>
      </View> : null}
      {visible.map((job) => <Card key={job.id} onPress={() => router.push(`/job/${job.id}`)} style={styles.job}>
        <View style={styles.assignmentHead}>
          <View style={styles.grow}><Num variant="heading" weight="bold">{jobTime(job.scheduled_at)} - {jobTime(job.ends_at)}</Num>{period === 'القادمة' ? <Txt variant="caption" tone="secondary">{jobDate(job.scheduled_at)}</Txt> : null}</View>
          <ChevronLeft size={theme.scale(22)} color={theme.text.primary} />
        </View>
        <Txt variant="body" weight="bold">{job.addresses?.line || 'موقع ضمن نطاق فريقك'}</Txt>
        <Txt variant="small" tone="secondary">{[copy.services[job.service_key] ?? job.service_key, job.vehicles?.make, job.vehicles?.model].filter(Boolean).join(' · ')}</Txt>
        <View style={styles.assignmentHead}><Txt variant="caption" tone={job.technician_id ? 'action' : 'secondary'}>{job.technician_id ? copy.claimedByYou : copy.availableToTeam}</Txt><BeatIcon size="sm" active={LIT[job.stage]} /></View>
      </Card>)}
    </Screen>
    <DriverNav active="jobs" />
  </View>;
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: theme.surface.page },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface.page },
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], paddingBottom: theme.spacing[4], gap: theme.spacing[5] },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  grow: { flex: 1 },
  assignment: { backgroundColor: theme.surface.bookingSoft, borderRadius: theme.radius.lg, padding: theme.spacing[5], gap: theme.spacing[2] },
  assignmentHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing[3] },
  totals: { flexDirection: 'row', gap: theme.spacing[3], paddingTop: theme.spacing[3] },
  total: { flex: 1, gap: theme.spacing[1] },
  message: { gap: theme.spacing[2] },
  current: { gap: theme.spacing[3], boxShadow: undefined },
  job: { gap: theme.spacing[2], boxShadow: undefined },
  empty: { alignItems: 'center', gap: theme.spacing[3], paddingVertical: theme.spacing[6], paddingHorizontal: theme.spacing[4] },
}));
