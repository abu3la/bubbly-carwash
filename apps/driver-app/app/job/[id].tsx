import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Camera, Check, MapPin, Phone, Video } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BeatIcon, Button, Card, IconButton, Input, Num, Screen, Txt, useToast } from '@bubbles/ui-native';
import { ApiError, advance, claimJob, jobs as fetchJobs, nextStage, reportIncident, uploadEvidence, type Job } from '../../src/api';
import { copy } from '../../src/copy';
import { useSession } from '../../src/session';
import { jobDate, jobTime } from '../../src/jobPresentation';
import { WashProgress } from '../../src/WashProgress';

const LIT: Record<string, 0 | 1 | 2 | 3> = { booked: 0, arrived: 1, washed: 2, verified: 3 };
const ANGLES = ['front', 'right', 'rear', 'left'] as const;
const STAGE_HELP: Record<string, string> = {
  booked: 'اتجه إلى الفيلا، ثم أكد وصولك من الموقع.',
  arrived: 'وثّق حالة السيارة قبل الغسيل، ثم أكمل الغسيل.',
  washed: 'وثّق النتيجة بعد الغسيل، ثم راجع الجودة.',
  verified: 'اكتملت المهمة وحُفظ التوثيق للعميل.',
};
const errorMessage = (e: unknown) => copy.errors[e instanceof ApiError ? e.code : 'unknown'] ?? copy.errors.unknown;

export default function JobScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fresh, setFresh] = useState(false);
  const requestSequence = useRef(0);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const captureLock = useRef(false);
  const actionLock = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [showIncident, setShowIncident] = useState(false);
  const [incidentCategory, setIncidentCategory] = useState('access');
  const [incidentNote, setIncidentNote] = useState('');
  const load = useCallback(async (clearError = true) => {
    const request = ++requestSequence.current;
    try {
      const all = (await fetchJobs()).jobs;
      if (request !== requestSequence.current) return;
      setJob(all.find((j) => j.id === id) ?? null);
      setFresh(true);
      if (clearError) setError(null);
    } catch (e) { if (request === requestSequence.current) { setError(errorMessage(e)); setFresh(false); } }
    finally { if (request === requestSequence.current) setLoaded(true); }
  }, [id]);
  useFocusEffect(useCallback(() => { void load(); return () => { requestSequence.current += 1; }; }, [load]));

  const run = async (operation: () => Promise<void>) => {
    if (actionLock.current || captureLock.current || !fresh) return;
    actionLock.current = true; setBusy(true); setError(null);
    try { await operation(); }
    catch (e) { setError(errorMessage(e)); await load(false); }
    finally { actionLock.current = false; setBusy(false); }
  };
  const step = () => {
    if (!job) return;
    const next = nextStage(job.stage);
    if (!next) return;
    return run(async () => {
      await advance(job.id, next);
      if (next === 'verified') { toast.show(copy.done); router.replace('/jobs'); }
      else await load();
    });
  };
  const capture = async (mode: 'photo' | 'video', angle: typeof ANGLES[number] | '360') => {
    if (!job || !fresh || captureLock.current || actionLock.current || (job.stage !== 'arrived' && job.stage !== 'washed')) return;
    captureLock.current = true; setUploading(true); setError(null);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) { setError(copy.cameraDenied); return; }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: mode === 'video' ? ['videos'] : ['images'], allowsEditing: false,
        quality: 0.85, videoMaxDuration: 60,
      });
      if (result.canceled || !result.assets[0]) return;
      await uploadEvidence(job.id, job.stage === 'arrived' ? 'before' : 'after', angle, result.assets[0]);
      toast.show(copy.evidenceSaved); await load();
    } catch (e) { setError(e instanceof ApiError ? errorMessage(e) : 'تعذّر فتح الكاميرا أو رفع التوثيق. حاول مرة أخرى.'); }
    finally { captureLock.current = false; setUploading(false); }
  };
  const openLink = async (url: string) => {
    try { await Linking.openURL(url); }
    catch { setError('تعذّر فتح التطبيق. تحقق من توفره على جهازك.'); }
  };
  const claim = () => job && run(async () => { await claimJob(job.id); await load(); toast.show(copy.claimed); });
  const sendIncident = () => job && run(async () => {
    await reportIncident(job.id, incidentCategory, incidentNote.trim());
    setIncidentNote(''); setShowIncident(false); toast.show(copy.incidentSent);
  });

  if (!job || job.id !== id) return <Screen contentStyle={styles.page}>
    <Txt variant="heading" weight="bold">تفاصيل المهمة</Txt>
    {!loaded ? <ActivityIndicator /> : null}
    <Txt tone={error ? 'danger' : 'secondary'}>{error ?? (loaded ? copy.unavailableJob : 'جارٍ تحميل المهمة')}</Txt>
    {error ? <Button label="إعادة المحاولة" onPress={() => void load()} /> : null}
    <Button label={copy.backToJobs} variant="ghost" onPress={() => router.replace('/jobs')} />
  </Screen>;

  const a = job.addresses;
  const v = job.vehicles;
  const next = nextStage(job.stage);
  const claimed = job.technician_id === session?.userId;
  const evidencePhase = job.stage === 'arrived' ? 'before' : job.stage === 'washed' ? 'after' : null;
  const phaseMedia = (job.booking_media ?? []).filter((item) => item.phase === evidencePhase);
  const capturedAngles = new Set(phaseMedia.filter((item) => item.kind === 'photo').map((item) => item.angle));
  const has360 = phaseMedia.some((item) => item.kind === 'video' && item.angle === '360');
  const nextAngle = ANGLES.find((angle) => !capturedAngles.has(angle));
  const evidenceReady = has360 || !nextAngle;
  const canAdvance = !evidencePhase || evidenceReady;
  const extras = job.booking_add_ons ?? [];
  const destination = a?.lat != null && a.lng != null ? `${a.lat},${a.lng}` : a?.line;

  return <Screen scroll contentStyle={styles.page} bottomInset={theme.spacing[4]}>
    <View style={styles.row}>
      <IconButton label={copy.backToJobs} variant="ghost" onPress={() => router.replace('/jobs')}><ArrowRight size={theme.scale(22)} color={theme.text.primary} /></IconButton>
      <View style={styles.grow}><Num variant="body" weight="bold">{job.ref}</Num><Txt variant="caption" tone="secondary">{jobDate(job.scheduled_at)}</Txt></View>
      <BeatIcon size="sm" active={LIT[job.stage]} />
    </View>
    <View style={styles.destination}>
      <Txt variant="title" weight="bold">{claimed && a?.villa_number ? `فيلا ${a.villa_number}` : a?.line || copy.teamJob}</Txt>
      <Txt variant="small" tone="secondary">{[a?.coverage_areas?.name_ar, a?.coverage_blocks ? `بلوك ${a.coverage_blocks.code}` : null, a?.city].filter(Boolean).join(' · ')}</Txt>
      <Num variant="heading" weight="bold">{jobTime(job.scheduled_at)} - {jobTime(job.ends_at)}</Num>
      <Txt variant="body" weight="semibold">{copy.services[job.service_key] ?? job.service_key}</Txt>
      {extras.length ? <Txt variant="small" tone="secondary">{extras.map((e) => copy.addOns[e.add_on_key] ?? e.add_on_key).join(' · ')}</Txt> : null}
    </View>

    {error ? <View accessibilityLiveRegion="polite" style={styles.error}><Txt tone="danger" variant="small">{error}</Txt>{!fresh ? <Button label="إعادة تحميل المهمة" variant="ghost" disabled={busy || uploading} onPress={() => void load()} /> : null}</View> : null}

    {!claimed ? <View style={styles.block}>
      <Txt variant="heading" weight="bold">{copy.teamJob}</Txt>
      <Txt variant="small" tone="secondary">{copy.teamJobSub}</Txt>
      <Button label={busy ? copy.working : copy.claimJob} size="lg" fullWidth disabled={busy || !fresh} onPress={() => void claim()} />
    </View> : <>
      <View style={styles.progress}>
        <WashProgress stage={job.stage} />
        <Txt variant="heading" weight="bold">{copy.stages[job.stage]}</Txt>
        <Txt variant="small" tone="secondary">{STAGE_HELP[job.stage]}</Txt>
        {next && !evidencePhase ? <Button label={busy ? copy.working : copy.actions[next]} size="lg" fullWidth disabled={busy || uploading || !fresh} onPress={() => void step()} /> : null}
      </View>
      <View style={styles.block}>
        <Txt variant="heading" weight="bold">{v ? `${v.make} ${v.model}` : copy.vehicle}</Txt>
        <View style={styles.row}><Num variant="body" weight="bold">{v?.plate}</Num><Txt variant="small" tone="secondary">{[v?.color, v ? copy.sizes[v.size] : null].filter(Boolean).join(' · ')}</Txt></View>
        <Txt variant="body">{job.customers?.full_name || copy.customer}</Txt>
        <Num variant="small" tone="secondary">{job.customers?.phone}</Num>
        <Txt variant="small" tone="secondary">{a?.line}</Txt>
        {a?.notes ? <View style={styles.notes}><Txt variant="small" weight="semibold">{copy.accessNotes}</Txt><Txt variant="small">{a.notes}</Txt></View> : null}
        <View style={styles.actions}>
          {destination ? <Button label="الاتجاهات" variant="ghost" icon={<MapPin size={theme.scale(18)} color={theme.action.primary} />} onPress={() => void openLink(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`)} /> : null}
          {job.customers?.phone ? <Button label={copy.callCustomer} variant="ghost" icon={<Phone size={theme.scale(18)} color={theme.action.primary} />} onPress={() => void openLink(`tel:${job.customers!.phone}`)} /> : null}
        </View>
      </View>
      {evidencePhase ? <Card variant="booking" style={styles.block}>
        <Txt variant="heading" weight="bold">{evidencePhase === 'before' ? copy.beforeEvidence : copy.afterEvidence}</Txt>
        <Txt variant="small" tone="secondary">{copy.evidenceInstruction}</Txt>
        <View style={styles.photoGrid}>
          {ANGLES.map((angle) => <View key={angle} style={styles.angle}>
            {has360 || capturedAngles.has(angle) ? <Check size={theme.scale(19)} color={theme.text.primary} /> : <Camera size={theme.scale(19)} color={theme.text.secondary} />}
            <Txt variant="small" weight={capturedAngles.has(angle) || has360 ? 'bold' : 'regular'}>{copy.photoAngles[angle]}</Txt>
            <Txt variant="caption" tone="secondary">{has360 || capturedAngles.has(angle) ? 'موثّق' : 'بانتظار الصورة'}</Txt>
          </View>)}
        </View>
        {uploading ? <View style={styles.row}><ActivityIndicator /><Txt variant="small">الكاميرا والتوثيق قيد المعالجة</Txt></View> : null}
        {!evidenceReady && nextAngle ? <>
          <Button label={`صوّر ${copy.photoAngles[nextAngle]}`} fullWidth disabled={uploading || busy || !fresh} onPress={() => void capture('photo', nextAngle)} />
          <Button label={copy.record360} variant="ghost" fullWidth disabled={uploading || busy || !fresh} icon={<Video size={theme.scale(18)} color={theme.action.primary} />} onPress={() => void capture('video', '360')} />
        </> : <Txt variant="body" weight="bold">{copy.evidenceReady}</Txt>}
        {has360 ? <Button label="إعادة تسجيل الفيديو" variant="ghost" disabled={uploading || busy || !fresh} onPress={() => void capture('video', '360')} /> : null}
        {!has360 && capturedAngles.size > 0 ? <View style={styles.actions}>{ANGLES.filter((angle) => capturedAngles.has(angle)).map((angle) => <Button key={angle} label={`إعادة تصوير ${copy.photoAngles[angle]}`} size="sm" variant="ghost" disabled={uploading || busy || !fresh} onPress={() => void capture('photo', angle)} />)}</View> : null}
        {next && canAdvance ? <Button label={busy ? copy.working : copy.actions[next]} size="lg" fullWidth disabled={busy || uploading || !fresh} onPress={() => void step()} /> : null}
      </Card> : null}
      <View style={styles.block}>
        {!showIncident ? <Button label={copy.openReport} variant="ghost" onPress={() => setShowIncident(true)} /> : <>
          <Txt variant="heading" weight="bold">{copy.reportProblem}</Txt>
          <View style={styles.actions}>
            <Button label={copy.accessProblem} variant={incidentCategory === 'access' ? 'dark' : 'ghost'} onPress={() => setIncidentCategory('access')} />
            <Button label={copy.otherProblem} variant={incidentCategory === 'other' ? 'dark' : 'ghost'} onPress={() => setIncidentCategory('other')} />
          </View>
          <Input label={copy.problemDetails} value={incidentNote} onChangeText={setIncidentNote} placeholder={copy.problemPlaceholder} multiline maxLength={2000} />
          <Button label={busy ? copy.working : copy.sendReport} fullWidth disabled={busy || uploading || !fresh || !incidentNote.trim()} onPress={() => void sendIncident()} />
          <Button label={copy.cancel} variant="ghost" disabled={busy || !fresh} onPress={() => setShowIncident(false)} />
        </>}
      </View>
    </>}
  </Screen>;
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[3], gap: theme.spacing[5] },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  grow: { flex: 1 },
  destination: { gap: theme.spacing[2] },
  block: { gap: theme.spacing[3], boxShadow: undefined },
  progress: { backgroundColor: theme.surface.bookingSoft, borderRadius: theme.radius.lg, padding: theme.spacing[5], gap: theme.spacing[3] },
  notes: { gap: theme.spacing[2], padding: theme.spacing[4], borderRadius: theme.radius.md, backgroundColor: theme.surface.bookingSoft },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing[2] },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
  angle: { minWidth: '45%', flex: 1, paddingVertical: theme.spacing[3], gap: theme.spacing[1], alignItems: 'center' },
  error: { paddingVertical: theme.spacing[2] },
}));
