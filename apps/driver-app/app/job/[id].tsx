import { useCallback, useState } from 'react';
import { Linking, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangle, ArrowRight, Camera, Car, MapPin, Phone, Sparkles, Video } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BeatIcon, Button, Card, Input, Num, Screen, Txt, useToast } from '@sama/ui-native';
import { ApiError, advance, claimJob, jobs as fetchJobs, nextStage, reportIncident, uploadEvidence, type Job } from '../../src/api';
import { copy } from '../../src/copy';
import { useSession } from '../../src/session';

const LIT: Record<string, 0 | 1 | 2 | 3> = { booked: 0, arrived: 1, washed: 2, verified: 3 };

export default function JobScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useSession();

  const [job, setJob] = useState<Job | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIncident, setShowIncident] = useState(false);
  const [incidentCategory, setIncidentCategory] = useState('access');
  const [incidentNote, setIncidentNote] = useState('');

  // There is no single-job endpoint: a technician has a handful of jobs, so
  // reusing the list is cheaper than another route and keeps the two in step.
  const load = useCallback(async () => {
    setLoaded(false);
    try {
      const all = (await fetchJobs()).jobs;
      setJob(all.find((j) => j.id === id) ?? null);
      setError(null);
    } catch (e) {
      setError(copy.errors[e instanceof ApiError ? e.code : 'unknown']);
    } finally {
      setLoaded(true);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const step = async () => {
    if (!job) return;
    const next = nextStage(job.stage);
    if (!next) return;
    setError(null);
    setBusy(true);
    try {
      await advance(job.id, next);
      if (next === 'verified') {
        toast.show(copy.done);
        router.back();
      } else {
        await load();
      }
    } catch (e) {
      setError(copy.errors[e instanceof ApiError ? e.code : 'unknown']);
      // Re-read rather than trust local state: the beat may have been advanced
      // on another device, and the server is the only truth about where it is.
      load();
    } finally {
      setBusy(false);
    }
  };

  const capture = async (mode: 'photo' | 'video') => {
    if (!job || (job.stage !== 'arrived' && job.stage !== 'washed')) return;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError(copy.cameraDenied);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: mode === 'video' ? ['videos'] : ['images'],
      allowsEditing: false,
      quality: 0.85,
      videoMaxDuration: 60,
    });
    if (result.canceled || !result.assets[0]) return;

    setError(null);
    setUploading(true);
    try {
      const phase = job.stage === 'arrived' ? 'before' : 'after';
      await uploadEvidence(job.id, phase, mode === 'video' ? '360' : 'general', result.assets[0]);
      toast.show(copy.evidenceSaved);
      await load();
    } catch (e) {
      setError(copy.errors[e instanceof ApiError ? e.code : 'unknown']);
    } finally {
      setUploading(false);
    }
  };

  const claim = async () => {
    if (!job) return;
    setBusy(true); setError(null);
    try { await claimJob(job.id); await load(); toast.show(copy.claimed); }
    catch (e) { setError(copy.errors[e instanceof ApiError ? e.code : 'unknown']); await load(); }
    finally { setBusy(false); }
  };

  const sendIncident = async () => {
    if (!job || !incidentNote.trim()) return;
    setBusy(true); setError(null);
    try {
      await reportIncident(job.id, incidentCategory, incidentNote.trim());
      setIncidentNote(''); setShowIncident(false); toast.show(copy.incidentSent);
    } catch (e) { setError(copy.errors[e instanceof ApiError ? e.code : 'unknown']); }
    finally { setBusy(false); }
  };

  if (!job) {
    return (
      <Screen contentStyle={styles.page}>
        <Txt variant="body" tone={error ? 'danger' : 'secondary'} center>
          {error ?? (loaded ? copy.unavailableJob : '…')}
        </Txt>
        {loaded ? <Button label={copy.backToJobs} fullWidth onPress={() => router.replace('/jobs')} /> : null}
      </Screen>
    );
  }

  const v = job.vehicles;
  const a = job.addresses;
  const next = nextStage(job.stage);
  const extras = job.booking_add_ons ?? [];
  const media = job.booking_media ?? [];
  const beforeCount = media.filter((item) => item.phase === 'before').length;
  const afterCount = media.filter((item) => item.phase === 'after').length;
  const evidencePhase = job.stage === 'arrived' ? 'before' : job.stage === 'washed' ? 'after' : null;
  const claimed = job.technician_id === session?.userId;
  const requiredEvidenceReady = next === 'washed' ? beforeCount > 0 : next === 'verified' ? afterCount > 0 : true;

  // Google Maps directions by coordinates when we have them, by address text when not.
  const openMaps = () => {
    const q = a?.lat && a?.lng ? `${a.lat},${a.lng}` : encodeURIComponent(a?.line ?? '');
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${q}`);
  };

  return (
    <Screen scroll contentStyle={styles.page} bottomInset={theme.spacing[6]}>
      <View style={styles.top}>
        <Button label="" variant="ghost" size="sm" onPress={() => router.back()} />
        <ArrowRight size={theme.scale(22)} color={theme.text.primary} strokeWidth={2} />
        <Num variant="body" weight="bold" style={styles.grow}>
          {job.ref}
        </Num>
      </View>

      {/* The three beats are the job's state, shown the same way the customer
          sees them — so a technician knows exactly what was reported. */}
      <View style={styles.beats}>
        <BeatIcon size="lg" active={LIT[job.stage] ?? 0} />
        <Txt variant="body" weight="bold">
          {copy.stages[job.stage]}
        </Txt>
      </View>

      {!claimed ? <Card variant="booking" style={styles.block}>
        <Txt variant="body" weight="bold">{copy.teamJob}</Txt>
        <Txt variant="small" tone="secondary">{copy.teamJobSub}</Txt>
        <Button label={busy ? copy.working : copy.claimJob} fullWidth disabled={busy} onPress={claim} />
      </Card> : null}

      <Card style={styles.block}>
        <View style={styles.row}><Phone size={theme.scale(18)} color={theme.text.primary} strokeWidth={2} /><Txt variant="label" weight="semibold" tone="muted">{copy.customer}</Txt></View>
        <Txt variant="body" weight="bold">{job.customers?.full_name || copy.customer}</Txt>
        <Num variant="small" tone="secondary">{job.customers?.phone || '—'}</Num>
        {job.customers?.phone ? <Button label={copy.callCustomer} variant="secondary" size="sm" onPress={() => Linking.openURL(`tel:${job.customers!.phone}`)} /> : null}
      </Card>

      <Card style={styles.block}>
        <View style={styles.row}>
          <Car size={theme.scale(18)} color={theme.text.primary} strokeWidth={2} />
          <Txt variant="label" weight="semibold" tone="muted">
            {copy.vehicle}
          </Txt>
        </View>
        <Txt variant="heading" weight="bold">
          {v ? `${v.make} ${v.model}` : '—'}
        </Txt>
        <View style={styles.row}>
          {v?.plate ? (
            <Num variant="body" weight="bold">
              {v.plate}
            </Num>
          ) : null}
          <Txt variant="small" tone="secondary">
            {[v?.color, v ? copy.sizes[v.size] : null].filter(Boolean).join(' · ')}
          </Txt>
        </View>
      </Card>

      {claimed && evidencePhase ? (
        <Card variant="booking" style={styles.block}>
          <Txt variant="body" weight="bold">
            {evidencePhase === 'before' ? copy.beforeEvidence : copy.afterEvidence}
          </Txt>
          <Txt variant="small" tone="secondary">
            {copy.evidenceInstruction}
          </Txt>
          <View style={styles.evidenceActions}>
            <Button
              label={uploading ? copy.uploadingEvidence : copy.takePhotos}
              variant="secondary"
              fullWidth
              disabled={uploading}
              icon={<Camera size={theme.scale(17)} color={theme.text.primary} strokeWidth={2} />}
              onPress={() => capture('photo')}
            />
            <Button
              label={uploading ? copy.uploadingEvidence : copy.record360}
              variant="secondary"
              fullWidth
              disabled={uploading}
              icon={<Video size={theme.scale(17)} color={theme.text.primary} strokeWidth={2} />}
              onPress={() => capture('video')}
            />
          </View>
          <Txt variant="caption" tone={requiredEvidenceReady ? 'action' : 'muted'}>
            {copy.evidenceCount(beforeCount, afterCount)}
          </Txt>
        </Card>
      ) : null}

      <Card style={styles.block}>
        <View style={styles.row}>
          <MapPin size={theme.scale(18)} color={theme.text.primary} strokeWidth={2} />
          <Txt variant="label" weight="semibold" tone="muted">
            {copy.address}
          </Txt>
        </View>
        <Txt variant="body" weight="bold">
          {a?.line || '—'}
        </Txt>
        <Txt variant="small" tone="secondary">
          {[a?.district, a?.city].filter(Boolean).join('، ')}
        </Txt>
        {a?.notes ? (
          <View style={styles.notes}>
            <Txt variant="label" weight="semibold" tone="muted">
              {copy.accessNotes}
            </Txt>
            <Txt variant="small">{a.notes}</Txt>
          </View>
        ) : null}
        <Button label="الاتجاهات" variant="secondary" size="sm" onPress={openMaps} />
      </Card>

      {claimed ? <Card style={styles.block}>
        <View style={styles.row}><AlertTriangle size={theme.scale(18)} color={theme.text.primary} strokeWidth={2} /><Txt variant="body" weight="bold">{copy.reportProblem}</Txt></View>
        {!showIncident ? <Button label={copy.openReport} variant="ghost" size="sm" onPress={() => setShowIncident(true)} /> : <>
          <View style={styles.incidentKinds}>
            <Button label={copy.accessProblem} variant={incidentCategory === 'access' ? 'dark' : 'secondary'} size="sm" onPress={() => setIncidentCategory('access')} />
            <Button label={copy.otherProblem} variant={incidentCategory === 'other' ? 'dark' : 'secondary'} size="sm" onPress={() => setIncidentCategory('other')} />
          </View>
          <Input label={copy.problemDetails} value={incidentNote} onChangeText={setIncidentNote} placeholder={copy.problemPlaceholder} />
          <Button label={busy ? copy.working : copy.sendReport} disabled={busy || !incidentNote.trim()} onPress={sendIncident} />
          <Button label={copy.cancel} variant="ghost" size="sm" onPress={() => setShowIncident(false)} />
        </>}
      </Card> : null}

      <Card style={styles.block}>
        <View style={styles.row}>
          <Sparkles size={theme.scale(18)} color={theme.text.primary} strokeWidth={2} />
          <Txt variant="label" weight="semibold" tone="muted">
            {copy.extras}
          </Txt>
        </View>
        <Txt variant="body">
          {extras.length
            ? extras.map((e) => copy.addOns[e.add_on_key] ?? e.add_on_key).join(' · ')
            : copy.noExtras}
        </Txt>
      </Card>

      {error ? (
        <Txt variant="small" tone="danger" center>
          {error}
        </Txt>
      ) : null}

      {/* One action, and only the next one. Advancing is the whole job, so the
          button is large and unmistakable — this is used one-handed, outdoors,
          often with wet hands. */}
      {claimed && next ? (
        <Button
          label={busy ? copy.working : copy.actions[next]}
          size="lg"
          fullWidth
          disabled={busy || uploading || !requiredEvidenceReady}
          onPress={step}
        />
      ) : claimed ? (
        <Txt variant="body" weight="bold" center tone="action">
          {copy.done}
        </Txt>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[3] },
  top: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  grow: { flex: 1 },
  beats: { alignItems: 'center', gap: theme.spacing[2], paddingVertical: theme.spacing[4] },
  block: { gap: theme.spacing[2] },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  notes: {
    gap: 2,
    padding: theme.spacing[3],
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    backgroundColor: theme.surface.bookingSoft,
  },
  evidenceActions: { gap: theme.spacing[2] },
  incidentKinds: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
}));
