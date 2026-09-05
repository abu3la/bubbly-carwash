import { useCallback, useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Bell, ChevronDown, MapPin } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import {
  BeatIcon,
  BookingTicket,
  Button,
  Card,
  Num,
  Screen,
  Txt,
} from '@bubbles/ui-native';
import { useCopy } from '../../src/i18n';
import { Stagger } from '../../src/components/Bits';
import { useCustomerData } from '../../src/customerData';
import { useCatalogueStatus } from '../../src/catalogue';
import { checkCoverage, hasVillaAddress, type Coverage } from '../../src/api';
import { useLocale } from '@bubbles/ui-native';
import { useBookingDraft } from '../../src/bookingDraft';
import { formatHomeBookingDate, selectHomeBooking } from '../../src/homeBooking';
import { riyadhDateKey } from '../../src/dates';
import { MembershipSummary } from '../../src/components/MembershipSummary';


export default function Home() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { language } = useLocale();
  const copy = useCopy();
  const { profile, addresses, bookings, membership, loading, error, refresh } = useCustomerData();
  const draft = useBookingDraft();
  const [now, setNow] = useState(() => new Date());
  const { catalogue, loading: catalogueLoading, error: catalogueError } = useCatalogueStatus();
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [checking, setChecking] = useState(false);
  const ar = language === 'ar';
  const monthlyPrice = catalogue?.plans.length
    ? Math.min(...catalogue.plans.map((plan) => plan.priceMinor)) / 100
    : null;
  const address = addresses.find((item) => item.is_default) ?? addresses[0] ?? null;
  const booking = selectHomeBooking(bookings, now);
  const appointment = booking ? formatHomeBookingDate(booking.scheduled_at, language, now) : null;
  const stage = booking?.stage ?? 'booked';
  const status = booking?.status === 'active' ? copy.home.washStages[stage] : copy.home.scheduled;
  const progress = ({ booked: 0, arrived: 1, washed: 2, verified: 3 } as const)[stage];
  const openAppointment = () => {
    if (!booking) return;
    router.push({ pathname: '/(tabs)/bookings', params: {
      bookingId: booking.id,
      tab: booking.status === 'active' ? 'active' : 'upcoming',
      date: riyadhDateKey(new Date(booking.scheduled_at)),
    } });
  };
  const scheduleWash = () => {
    draft.reset();
    draft.setSource('club');
    draft.setService(membership?.plan_id.startsWith('plus') ? 'full' : 'exterior');
    router.push('/book/vehicle');
  };

  useEffect(() => {
    let live = true;
    setCoverage(null);
    if (address?.lat == null || address.lng == null) return;
    setChecking(true);
    checkCoverage(address.lat, address.lng, address.villa_number ?? undefined)
      .then((value) => { if (live) setCoverage(value); })
      .catch(() => { if (live) setCoverage(null); })
      .finally(() => { if (live) setChecking(false); });
    return () => { live = false; };
  }, [address?.id, address?.lat, address?.lng, address?.villa_number]);

  useFocusEffect(useCallback(() => {
    setNow(new Date());
    void refresh();
    const timer = setInterval(() => setNow(new Date()), 60_000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') { setNow(new Date()); void refresh(); }
    });
    return () => { clearInterval(timer); subscription.remove(); };
  }, [refresh]));

  const labelIndex = address?.label === 'work' ? 1 : address?.label === 'other' ? 2 : 0;
  const locationLabel = address
    ? `${copy.onboarding.addressLabels[labelIndex]} · ${address.district || address.city || address.line}`
    : (language === 'ar' ? 'أضف عنوان الخدمة' : 'Add a service address');

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
        {!membership ? <Txt variant="body" tone="secondary">
          {ar ? 'غسيل سيارتك عند بيتك بأعلى جودة' : 'A quality car wash at your home'}
        </Txt> : null}
      </View>

      {booking && appointment ? (
        <Stagger index={0} style={styles.nextWash}>
          <Txt variant="heading" weight="bold">
            {booking.status === 'active' ? copy.home.currentWash : copy.home.nextWash}
          </Txt>
          <BookingTicket
            label={appointment.day}
            time={appointment.time}
            meta={appointment.date}
            stub={<View style={styles.washState}>
              <BeatIcon size="sm" active={progress} />
              <Txt variant="caption" weight="semibold" center>{status}</Txt>
            </View>}
            onPress={openAppointment}
          />
          <View style={styles.washDetails}>
            <Txt variant="body" weight="semibold">
              {ar ? booking.services.name_ar : booking.services.name_en} · {booking.vehicles.make} {booking.vehicles.model}
            </Txt>
            <Txt variant="small" tone="secondary">{booking.addresses.line}</Txt>
          </View>
          <Button label={copy.home.viewWash} size="lg" fullWidth onPress={openAppointment} />
          {error ? <View style={styles.washDetails}><Txt variant="small" tone="secondary">{copy.home.refreshWash}</Txt><Button label={copy.home.retryWash} variant="ghost" size="sm" onPress={() => void refresh()} /></View> : null}
        </Stagger>
      ) : membership ? (
        <Card variant="booking" style={styles.nextWash}>
          <Txt variant="heading" weight="bold">{copy.home.nextWash}</Txt>
          <Txt variant="body" weight="semibold">
            {loading ? copy.home.loadingWash : error ? copy.home.washLoadError : copy.home.noUpcomingWash}
          </Txt>
          {!loading && !error ? <Txt variant="small" tone="secondary">{copy.home.chooseWashTime}</Txt> : null}
          {!loading ? <Button
            label={error ? copy.home.retryWash : copy.home.scheduleWash}
            size="lg" fullWidth
            onPress={error ? () => void refresh() : scheduleWash}
          /> : null}
        </Card>
      ) : null}

      <Stagger index={booking || membership ? 1 : 0}>
        {membership ? <MembershipSummary membership={membership} onManage={() => router.push('/club/dashboard')} /> : (
          <Card variant="dark" style={styles.subscription}>
            <View style={styles.subscriptionCopy}>
              <Txt variant="heading" weight="bold" tone="inverse">{copy.home.subscriptionTitle}</Txt>
              <Txt variant="body" tone="inverseSoft">{copy.home.clubTeaser}</Txt>
            </View>
            {monthlyPrice !== null && !catalogueLoading && !catalogueError ? (
              <View style={styles.subscriptionPrice}>
                <Num variant="heading" weight="bold" tone="inverse">{copy.common.fromPrice(monthlyPrice)}</Num>
                <Txt variant="small" tone="inverseSoft">{copy.home.monthlyCycle}</Txt>
              </View>
            ) : null}
            <Button label={copy.home.join} size="lg" fullWidth onPress={() => router.push('/club')} />
          </Card>
        )}
      </Stagger>

      <View style={styles.coverage}>
        <View style={styles.coverageTitle}>
          <MapPin size={20} color={theme.text.primary} />
          <Txt variant="body" weight="bold">{ar ? 'شربتلي فيلج، جدة' : 'Sharbatly Village, Jeddah'}</Txt>
        </View>
        <Txt variant="small" tone="secondary">{checking ? (ar ? 'نتحقق من تغطية عنوانك…' : 'Checking your address coverage…')
          : coverage?.status === 'covered' ? (ar ? `فيلا ${coverage.villaNumber} · بلوك ${coverage.block?.code} · ${coverage.team?.name.ar}` : `Villa ${coverage.villaNumber} · Block ${coverage.block?.code} · ${coverage.team?.name.en}`)
          : !hasVillaAddress(address) ? (ar ? 'حدّد موقعك وأدخل رقم الفيلا لمعرفة توفر الخدمة.' : 'Choose your location and enter your villa number to check service.')
          : (ar ? 'تحقق من عنوانك لمعرفة توفر الخدمة حاليًا.' : 'Verify your address to check current service availability.')}</Txt>
        {coverage?.status !== 'covered' && !checking ? <Button label={ar ? 'تحقق من فيلتك' : 'Check your villa'} variant="ghost" size="sm" onPress={() => router.push({ pathname: '/onboarding/map', params: { returnTo: 'home' } })} /> : null}
      </View>


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
    borderRadius: theme.radius.md,
  },
  placeText: { flexShrink: 1 },
  greeting: { gap: 2 },
  coverage: { backgroundColor: theme.surface.bookingSoft, borderRadius: theme.radius.lg, padding: theme.spacing[4], gap: theme.spacing[2] },
  coverageTitle: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  nextWash: { gap: theme.spacing[2] },
  washState: { alignItems: 'center', gap: theme.spacing[2] },
  washDetails: { gap: theme.spacing[1] },
  subscription: { gap: theme.spacing[4] },
  subscriptionCopy: { gap: theme.spacing[2] },
  subscriptionPrice: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: theme.spacing[2] },
}));
