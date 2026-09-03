import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, Star } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import {
  Badge,
  BeatIcon,
  BookingTicket,
  Button,
  Card,
  Checkbox,
  IconButton,
  Input,
  Num,
  Screen,
  StatusBadge,
  Tabs,
  Txt,
  useToast,
} from '@sama/ui-native';
import { LedgerRow, SectionLabel, Stagger } from '../../src/components/Bits';
import { BEAT_STEPS, PAST_WASHES } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useSession } from '../../src/session';

type TabKey = 'upcoming' | 'active' | 'past';

export default function Bookings() {
  const { theme } = useUnistyles();
  const session = useSession();
  const copy = useCopy();
  const [tab, setTab] = useState<TabKey>(session.isLive ? 'active' : 'upcoming');

  // Tab identity is a key, never the label — so switching language cannot
  // strand the selection on a string that no longer exists.
  const labels: Record<TabKey, string> = {
    upcoming: copy.bookings.tabUpcoming,
    active: copy.bookings.tabActive,
    past: copy.bookings.tabPast,
  };
  const keys = Object.keys(labels) as TabKey[];

  return (
    <Screen scroll bottomInset={theme.spacing[6]} contentStyle={styles.page}>
      <Txt variant="title" weight="bold">
        {copy.bookings.title}
      </Txt>

      <Tabs
        tabs={keys.map((key) => labels[key])}
        value={labels[tab]}
        onChange={(label) => setTab(keys.find((key) => labels[key] === label) ?? 'upcoming')}
      />

      {tab === 'upcoming' ? <Upcoming /> : null}
      {tab === 'active' ? <Active /> : null}
      {tab === 'past' ? <Past /> : null}
    </Screen>
  );
}

// ------------------------------------------------------------------ upcoming

function Upcoming() {
  const session = useSession();
  const toast = useToast();
  const copy = useCopy();
  const { booking } = session;

  if (!booking) return <Empty message={copy.bookings.emptyUpcoming} />;

  const service = copy.services[booking.serviceKey];

  return (
    <View style={styles.stack}>
      <BookingTicket
        time={booking.slot}
        meta={`${booking.day} · ${service.name} · ${copy.addressLabel}`}
        stub={<BeatIcon size="sm" active={0} />}
      />

      <Card style={styles.details}>
        <LedgerRow label={copy.bookings.vehicleLabel} amount={copy.vehicleName} muted />
        <LedgerRow label={copy.bookings.locationLabel} amount={copy.addressLine} muted />
        <LedgerRow
          label={copy.bookings.paymentLabel}
          amount={
            booking.source === 'club'
              ? copy.bookings.clubWash
              : booking.source === 'package'
                ? copy.bookings.packageCredit
                : copy.common.money(booking.total)
          }
          muted
        />
      </Card>

      <View style={styles.pair}>
        <Button
          label={copy.bookings.reschedule}
          variant="secondary"
          fullWidth
          onPress={() => toast.show(copy.bookings.rescheduleSoon, 'arrived')}
          style={styles.half}
        />
        <Button
          label={copy.bookings.cancelBooking}
          variant="ghost"
          fullWidth
          onPress={() => {
            session.cancelBooking();
            toast.show(copy.bookings.cancelled, 'washed');
          }}
          style={styles.half}
        />
      </View>

      <Txt variant="caption" tone="muted">
        {copy.bookings.freeCancelNote}
      </Txt>
    </View>
  );
}

// -------------------------------------------------------------------- active

function Active() {
  const { theme } = useUnistyles();
  const session = useSession();
  const copy = useCopy();
  const { booking, stage } = session;

  if (!booking) return <Empty message={copy.bookings.emptyActive} />;

  const service = copy.services[booking.serviceKey];

  return (
    <View style={styles.stack}>
      <BookingTicket
        time={booking.slot}
        meta={`${service.name} · ${copy.addressLine}`}
        stub={<BeatIcon size="sm" active={stage} animate={stage > 0 && stage < 3} />}
      />

      <Card style={styles.technician}>
        <View style={styles.avatar}>
          <Txt variant="body" weight="bold" tone="action">
            {copy.technicianName.charAt(0)}
          </Txt>
        </View>
        <View style={styles.technicianText}>
          <View style={styles.technicianName}>
            <Txt variant="body" weight="bold">
              {copy.technicianName}
            </Txt>
            <Badge tone="violet">{stage === 0 ? copy.bookings.onTheWay : copy.bookings.onSite}</Badge>
          </View>
          <Txt variant="caption" tone="secondary">
            {stage === 0 ? copy.bookings.arrivingIn : copy.bookings.started}
          </Txt>
        </View>
        <IconButton label={copy.technicianName} variant="secondary" onPress={() => {}}>
          <Phone size={theme.scale(17)} color={theme.text.primary} strokeWidth={2} />
        </IconButton>
      </Card>

      <Card style={styles.pipeline}>
        <View style={styles.pipelineTop}>
          <SectionLabel>{copy.bookings.washStatus}</SectionLabel>
          <BeatIcon size="md" active={stage} animate={stage < 3} />
        </View>

        {BEAT_STEPS.map((step, i) => {
          const done = i < stage;
          return (
            <View key={step.key} style={styles.step(done)}>
              <StatusBadge status={step.key} size="sm" />
              <View style={styles.stepText}>
                <Txt variant="body" weight="semibold">
                  {copy.beats[step.key].title}
                </Txt>
                <Txt variant="caption" tone="secondary">
                  {done ? copy.beats[step.key].copy : copy.bookings.waiting}
                </Txt>
              </View>
              <Num variant="caption" tone="muted">
                {done ? step.time : '—'}
              </Num>
            </View>
          );
        })}
      </Card>

      {stage >= 3 ? <Documentation /> : null}
      {stage >= 3 ? <Rating /> : null}

      {/* The customer cannot really advance the pipeline — this stands in for
          the technician's app until the two are wired together. */}
      <Button
        label={stage < 3 ? copy.bookings.simulateNext : copy.bookings.replay}
        variant={stage < 3 ? 'ghost' : 'secondary'}
        fullWidth
        onPress={() => (stage < 3 ? session.advanceStage() : session.resetStage())}
      />
    </View>
  );
}

function Documentation() {
  const copy = useCopy();

  return (
    <Card style={styles.docs}>
      <Txt variant="body" weight="bold">
        {copy.bookings.documentation}
      </Txt>
      <View style={styles.photoRow}>
        <View style={styles.photo} />
        <View style={styles.photo} />
      </View>
      <Txt variant="caption" tone="muted">
        {copy.bookings.documentationNote(copy.technicianName)}
      </Txt>
    </Card>
  );
}

function Rating() {
  const { theme } = useUnistyles();
  const session = useSession();
  const toast = useToast();
  const copy = useCopy();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [attachPhotos, setAttachPhotos] = useState(true);

  if (session.rated) {
    return (
      <Card style={styles.thanks}>
        <StatusBadge status="verified" size="sm" />
        <View style={styles.thanksText}>
          <Txt variant="body" weight="bold">
            {copy.bookings.thanksTitle}
          </Txt>
          <Txt variant="caption" tone="secondary">
            {copy.bookings.thanksBody}
          </Txt>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.rating}>
      <View style={styles.ratingTop}>
        <View style={styles.ratingAvatar}>
          <Txt variant="small" weight="bold" tone="action">
            {copy.technicianName.charAt(0)}
          </Txt>
        </View>
        <Txt variant="body" weight="bold">
          {copy.bookings.rateTechnician(copy.technicianName)}
        </Txt>
      </View>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <IconButton
            key={value}
            label={copy.bookings.ratingStars(value)}
            variant="ghost"
            size="sm"
            onPress={() => setStars(value)}
          >
            <Star
              size={theme.scale(26)}
              strokeWidth={2}
              color={value <= stars ? theme.action.primary : theme.text.faint}
              fill={value <= stars ? theme.action.primary : 'transparent'}
            />
          </IconButton>
        ))}
      </View>

      <Input
        value={comment}
        onChangeText={setComment}
        placeholder={copy.bookings.commentPlaceholder}
        multiline
      />

      <Checkbox
        label={copy.bookings.attachPhotos}
        checked={attachPhotos}
        onChange={setAttachPhotos}
      />

      {/* Disabled until a star is chosen: a rating with no rating is not a
          thing we should accept. */}
      <Button
        label={copy.bookings.submitRating}
        fullWidth
        disabled={stars === 0}
        onPress={() => {
          session.submitRating();
          toast.show(copy.bookings.ratingSent, 'verified');
        }}
      />
    </Card>
  );
}

// ---------------------------------------------------------------------- past

function Past() {
  const { theme } = useUnistyles();
  const copy = useCopy();

  return (
    <View style={styles.stack}>
      {PAST_WASHES.map((wash, i) => (
        <Stagger key={wash.id} index={i}>
          <Card style={styles.pastRow}>
            <StatusBadge status="verified" size="sm" />
            <View style={styles.pastText}>
              <Txt variant="body" weight="bold">
                {copy.pastServices[wash.id]}
              </Txt>
              <Txt variant="caption" tone="secondary">
                {copy.pastDates[wash.id]} · <Num variant="caption" tone="secondary">{wash.slot}</Num>
              </Txt>
            </View>
            <View style={styles.pastRating}>
              <Star size={theme.scale(14)} color={theme.text.primary} strokeWidth={2} fill={theme.text.primary} />
              <Num variant="small" weight="bold">
                {wash.rating}
              </Num>
            </View>
          </Card>
        </Stagger>
      ))}
    </View>
  );
}

function Empty({ message }: { message: string }) {
  const router = useRouter();
  const copy = useCopy();
  return (
    <View style={styles.empty}>
      <BeatIcon size="lg" active={1} />
      <Txt variant="body" weight="bold" center>
        {message}
      </Txt>
      <Button label={copy.home.bookWash} onPress={() => router.push('/book/service')} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  stack: { gap: theme.spacing[3] + 2 },
  details: { gap: theme.spacing[2] + 2 },
  pair: { flexDirection: 'row', gap: theme.spacing[2] + 2 },
  half: { flex: 1 },

  technician: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  technicianText: { flex: 1, gap: 1 },
  technicianName: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2], flexWrap: 'wrap' },
  avatar: {
    width: theme.scale(44),
    height: theme.scale(44),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.action.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pipeline: { gap: theme.spacing[4] },
  pipelineTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // A pending station is dimmed as a whole rather than recoloured, so the
  // three beat colours never appear in a state they do not mean.
  step: (done: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3] + 2,
    opacity: done ? 1 : 0.38,
  }),
  stepText: { flex: 1, gap: 1 },

  docs: { gap: theme.spacing[3] },
  photoRow: { flexDirection: 'row', gap: theme.spacing[2] + 2 },
  photo: {
    flex: 1,
    height: theme.scale(130),
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    backgroundColor: theme.surface.bookingSoft,
  },

  rating: { gap: theme.spacing[3], backgroundColor: theme.palette.yellow100 },
  ratingTop: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] + 2 },
  ratingAvatar: {
    width: theme.scale(38),
    height: theme.scale(38),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: { flexDirection: 'row', gap: theme.spacing[1] },
  thanks: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3], backgroundColor: theme.palette.yellow100 },
  thanksText: { flex: 1, gap: 1 },

  pastRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
  pastText: { flex: 1, gap: 1 },
  pastRating: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] },

  empty: { alignItems: 'center', gap: theme.spacing[4], paddingVertical: theme.spacing[10] },
}));
