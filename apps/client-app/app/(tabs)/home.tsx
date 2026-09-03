import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ChevronDown, Clock, Droplets, MapPin, MessageSquare, ShieldCheck } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import {
  BeatIcon,
  BookingTicket,
  Button,
  Card,
  IconButton,
  Num,
  Screen,
  Txt,
} from '@sama/ui-native';
import { PROMISE_ICONS, SERVICES } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { SectionLabel, Stagger } from '../../src/components/Bits';
import { useSession } from '../../src/session';

const ICONS = { clock: Clock, shield: ShieldCheck, chat: MessageSquare };

export default function Home() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const session = useSession();
  const copy = useCopy();
  const { booking, club } = session;
  const cheapest = SERVICES[0];

  return (
    <Screen scroll bottomInset={theme.spacing[6]} contentStyle={styles.page}>
      <View style={styles.topRow}>
        <Card onPress={() => {}} style={styles.place}>
          <MapPin size={theme.scale(14)} color={theme.text.primary} strokeWidth={2.2} />
          <Txt variant="caption" weight="bold">
            {copy.addressLabel} · {copy.addressShort}
          </Txt>
          <ChevronDown size={theme.scale(13)} color={theme.text.muted} strokeWidth={2.2} />
        </Card>
        <IconButton label={copy.profile.rows.notifications} variant="secondary" size="md" onPress={() => {}}>
          <Bell size={theme.scale(17)} color={theme.text.secondary} strokeWidth={2} />
        </IconButton>
      </View>

      <View style={styles.greeting}>
        <Txt variant="title" weight="bold">
          {copy.home.greeting(copy.customerShort)}
        </Txt>
        <Txt variant="body" tone="secondary">
          {copy.brand.tagline}.
        </Txt>
      </View>

      {booking ? (
        <Stagger index={0}>
          <BookingTicket
            time={booking.slot}
            meta={`${booking.day} · ${copy.services[booking.serviceKey].name}`}
            stub={<BeatIcon size="sm" active={session.stage} animate={session.isLive && session.stage < 3} />}
            onPress={() => router.push('/(tabs)/bookings')}
          />
        </Stagger>
      ) : null}

      <Stagger index={1}>
        <Button label={copy.home.bookWash} size="lg" fullWidth onPress={() => router.push('/book/service')} />
      </Stagger>

      <View>
        <SectionLabel>{copy.home.chooseWhatSuits}</SectionLabel>
        <View style={styles.options}>
          <Stagger index={2}>
            <Card onPress={() => router.push('/book/service')} style={styles.option}>
              <View style={styles.optionIcon('ice')}>
                <Droplets size={theme.scale(20)} color={theme.action.primary} strokeWidth={2} />
              </View>
              <View style={styles.optionText}>
                <Txt variant="body" weight="bold">
                  {copy.home.singleWash}
                </Txt>
                <Txt variant="caption" tone="secondary">
                  {copy.home.singleWashSub}
                </Txt>
              </View>
              <View style={styles.optionPrice}>
                <Num variant="bodyLg" weight="bold">
                  {copy.common.fromPrice(cheapest.price)}
                </Num>
                <Num variant="caption" tone="muted">
                  {copy.common.minutes(cheapest.minutes)}
                </Num>
              </View>
            </Card>
          </Stagger>

          <Stagger index={3}>
            <Card variant="dark" onPress={() => router.push('/club')} style={styles.club}>
              <BeatIcon size="md" active={3} />
              <View style={styles.optionText}>
                <Txt variant="body" weight="bold" tone="inverse">
                  {copy.home.club}
                </Txt>
                <Txt variant="caption" tone="inverseSoft">
                  {club
                    ? copy.home.clubBalance(copy.plans[club.planId], club.credits, club.weekly - club.used)
                    : copy.home.clubTeaser}
                </Txt>
              </View>
              <Button
                label={club ? copy.home.myClub : copy.home.join}
                variant="secondary"
                size="sm"
                onPress={() => router.push('/club')}
              />
            </Card>
          </Stagger>
        </View>
      </View>

      <Stagger index={4}>
        <View style={styles.promises}>
          {PROMISE_ICONS.map((icon) => {
            const Icon = ICONS[icon];
            const label = { clock: copy.home.promises.onTime, shield: copy.home.promises.documented, chat: copy.home.promises.support }[icon];
            return (
              <View key={icon} style={styles.promise}>
                <Icon size={theme.scale(18)} color={theme.action.primary} strokeWidth={2} />
                <Txt variant="label" weight="semibold" tone="secondary" center>
                  {label}
                </Txt>
              </View>
            );
          })}
        </View>
      </Stagger>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[5],
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing[3] },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1] + 2,
    paddingVertical: theme.spacing[2] - 1,
    paddingHorizontal: theme.spacing[3] + 1,
    borderRadius: theme.radius.pill,
  },
  greeting: { gap: 2 },
  options: { gap: theme.spacing[3] },
  option: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] + 2 },
  club: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] + 2 },
  optionIcon: (tone: 'ice' | 'yellow') => ({
    width: theme.scale(40),
    height: theme.scale(40),
    borderRadius: theme.scale(13),
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tone === 'ice' ? theme.surface.bookingSoft : theme.palette.yellow100,
  }),
  optionText: { flex: 1, gap: 1 },
  // Prices hold their own column so every row's amount shares one end edge.
  optionPrice: { alignItems: 'flex-end', flexShrink: 0 },
  promises: { flexDirection: 'row', gap: theme.spacing[2] },
  promise: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing[1] + 2,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[1] + 2,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    backgroundColor: theme.surface.card,
    borderWidth: theme.border.width,
    borderColor: theme.border.subtle,
  },
}));
