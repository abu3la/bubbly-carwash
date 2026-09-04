import { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { Car, ChevronLeft, Clock, MapPin } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BeatIcon, Button, Card, Num, Screen, Txt } from '@sama/ui-native';
import { ApiError, jobs as fetchJobs, type Job } from '../src/api';
import { useSession } from '../src/session';
import { copy } from '../src/copy';
import { unregisterFirebaseMessaging } from '../src/firebase';

/** How far along the three beats a job is, for the mark. */
const LIT: Record<string, 0 | 1 | 2 | 3> = { booked: 0, arrived: 1, washed: 2, verified: 3 };

/** "2026-10-13T05:00:00+00:00" → "08:00", in Riyadh time. */
const clock = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Riyadh',
  });

export default function Jobs() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { session, ready, signOut } = useSession();
  const [list, setList] = useState<Job[] | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await fetchJobs();
      setList(result.jobs);
      setTeamName(result.team?.name_ar ?? null);
      setError(null);
    } catch (e) {
      setError(copy.errors[e instanceof ApiError ? e.code : 'unknown']);
    }
  }, []);

  // Refetch whenever the screen comes back into view, so finishing a job and
  // going back shows the list without it.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!ready) return <View style={styles.loading}><ActivityIndicator /></View>;
  if (!session) return <Redirect href="/" />;

  return (
    <Screen scroll contentStyle={styles.page}>
      <View style={styles.topRow}>
        <View>
          <Txt variant="title" weight="bold">
            {copy.today}
          </Txt>
          <Txt variant="small" tone="secondary">
            {list ? `${teamName ?? copy.noTeam} · ${list.length}` : '—'}
          </Txt>
        </View>
        <View style={styles.actions}>
          <Button label={copy.notifications} variant="ghost" size="sm" onPress={() => router.push('/notifications')} />
          <Button label={copy.history} variant="ghost" size="sm" onPress={() => router.push('/history')} />
          <Button label={copy.signOut} variant="ghost" size="sm" onPress={async () => {
            await unregisterFirebaseMessaging().catch(() => undefined);
            await signOut();
          }} />
        </View>
      </View>

      {error ? (
        <Txt variant="small" tone="danger">
          {error}
        </Txt>
      ) : null}

      {list && list.length === 0 ? (
        <View style={styles.empty}>
          <BeatIcon size="lg" active={0} />
          <Txt variant="body" weight="bold">
            {copy.noJobs}
          </Txt>
          <Txt variant="small" tone="secondary" center>
            {copy.noJobsSub}
          </Txt>
        </View>
      ) : null}

      {(list ?? []).map((job) => {
        const v = job.vehicles;
        const a = job.addresses;
        return (
          <Card key={job.id} onPress={() => router.push(`/job/${job.id}`)} style={styles.job}>
            <View style={styles.jobHead}>
              <View style={styles.time}>
                <Clock size={theme.scale(14)} color={theme.text.muted} strokeWidth={2.2} />
                <Num variant="body" weight="bold">
                  {clock(job.scheduled_at)}
                </Num>
              </View>
              <BeatIcon size="sm" active={LIT[job.stage] ?? 0} />
            </View>

            <Txt variant="body" weight="bold">
              {copy.services[job.service_key] ?? job.service_key}
            </Txt>
            <Txt variant="caption" tone={job.technician_id ? 'action' : 'muted'}>{job.technician_id ? copy.claimedByYou : copy.availableToTeam}</Txt>

            <View style={styles.line}>
              <Car size={theme.scale(14)} color={theme.text.muted} strokeWidth={2} />
              <Txt variant="small" tone="secondary" numberOfLines={1}>
                {v ? `${v.make} ${v.model}` : '—'}
              </Txt>
              {v?.plate ? (
                <Num variant="small" weight="semibold" tone="secondary">
                  {v.plate}
                </Num>
              ) : null}
            </View>

            <View style={styles.line}>
              <MapPin size={theme.scale(14)} color={theme.text.muted} strokeWidth={2} />
              <Txt variant="small" tone="secondary" numberOfLines={1} style={styles.grow}>
                {a?.line || '—'}
              </Txt>
              <ChevronLeft size={theme.scale(16)} color={theme.text.faint} strokeWidth={2.2} />
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface.page },
  page: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '68%' },
  job: { gap: theme.spacing[2] },
  jobHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  line: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  grow: { flex: 1 },
  empty: { alignItems: 'center', gap: theme.spacing[2], paddingVertical: theme.spacing[10] },
}));
