import { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Bell, ChevronDown, Clock, Droplets, MapPin, MessageSquare, ShieldCheck } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import {
  BeatIcon,
  BookingTicket,
  Button,
  Card,
  Num,
  Screen,
  Txt,
} from '@sama/ui-native';
import { PROMISE_ICONS, SERVICES } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { SectionLabel, Stagger } from '../../src/components/Bits';
import { useCustomerData } from '../../src/customerData';
import { useCatalogue } from '../../src/catalogue';
import { useLocale } from '@sama/ui-native';

const ICONS = { clock: Clock, shield: ShieldCheck, chat: MessageSquare };

export default function Home() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { language } = useLocale();
  const copy = useCopy();
  const { profile, addresses, bookings, membership, refresh } = useCustomerData();
  const catalogue = useCatalogue();
  const cheapest = catalogue?.services[0] ?? { priceMinor: SERVICES[0].price * 100, minutes: SERVICES[0].minutes };
  const address = addresses.find((item) => item.is_default) ?? addresses[0] ?? null;
  const booking = bookings.find((item) => item.payment_confirmed && item.status === 'scheduled') ?? null;

  useFocusEffect(useCallback(() => {
    void refresh();
    return () => {};
  }, [refresh]));

  const labelIndex = address?.label === 'work' ? 1 : address?.label === 'other' ? 2 : 0;
  const locationLabel = address
    ? `${copy.onboarding.addressLabels[labelIndex]} · ${address.district || address.city || address.line}`
    : `${copy.addressLabel} · ${copy.addressShort}`;

  return (
    <Screen scroll bottomInset={theme.spacing[6]} contentStyle={styles.page}>
      <View style={styles.topRow}>
        <Card
          onPress={() => router.push('/account/addresses')}
          style={styles.place}
        >
          <MapPin size={theme.scale(14)} color={theme.text.primary} strokeWidth={2.2} />
          <Txt variant="caption" weight="bold" numberOfLines={1} style={styles.placeText}>
            {locationLabel}
          </Txt>
          <ChevronDown size={theme.scale(13)} color={theme.text.muted} strokeWidth={2.2} />
        </Card>
        <Button
          label={language === 'ar' ? 'التنبيهات' : 'Alerts'}
          variant="ghost"
          size="sm"
          icon={<Bell size={theme.scale(16)} color={theme.action.primary} strokeWidth={2} />}
          onPress={() => router.push('/notifications')}
        />
      </View>

      <View style={styles.greeting}>
        <Txt variant="title" weight="bold">
          {copy.home.greeting(profile?.full_name || (language === 'ar' ? 'عميلنا' : 'there'))}
        </Txt>
        <Txt variant="body" tone="secondary">
          {copy.brand.tagline}.
        </Txt>
      </View>

      {booking ? (
        <Stagger index={0}>
          <BookingTicket
            time={new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' }).format(new Date(booking.scheduled_at))}
            meta={`${new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh' }).format(new Date(booking.scheduled_at))} · ${language === 'ar' ? booking.services.name_ar : booking.services.name_en}`}
            stub={<BeatIcon size="sm" active={0} />}
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
              <Droplets size={theme.scale(24)} color={theme.action.primary} strokeWidth={2} />
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
                  {copy.common.fromPrice(cheapest.priceMinor / 100)}
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
                  {membership
                    ? (language === 'ar' ? `${membership.plans.weekly - membership.usedThisWeek} مواعيد متاحة هذا الأسبوع` : `${membership.plans.weekly - membership.usedThisWeek} appointments available this week`)
                    : copy.home.clubTeaser}
                </Txt>
              </View>
              <Button
                label={membership ? copy.home.myClub : copy.home.join}
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
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing[2] },
  place: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1] + 2,
    paddingVertical: theme.spacing[2] - 1,
    paddingHorizontal: theme.spacing[3] + 1,
    borderRadius: theme.radius.pill,
  },
  placeText: { flexShrink: 1 },
  greeting: { gap: 2 },
  options: { gap: theme.spacing[3] },
  option: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] + 2 },
  club: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] + 2 },
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
