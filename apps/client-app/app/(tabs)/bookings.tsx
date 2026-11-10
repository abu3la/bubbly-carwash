import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, LocaleConfig, type DateData } from 'react-native-calendars';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { BookingTicket, Button, Card, Dialog, Num, Screen, StatusBadge, Tabs, Txt, useLocale, useToast, type TicketTone } from '@bubbles/ui-native';
import { CANCELLATION_NOTICE_HOURS, cancellationOpen } from '@bubbles/utils';
import { ApiError, bookingMediaSource, cancelBooking, type RealBooking } from '../../src/api';
import { useCustomerData } from '../../src/customerData';
import { addCalendarDays, isFriday, riyadhDateKey } from '../../src/dates';

LocaleConfig.locales.ar = {
  monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  today: 'اليوم',
};

type TabKey = 'upcoming' | 'active' | 'past';

/** A live booking takes its stage; a closed one takes how it ended. */
const toneOf = (booking: RealBooking): TicketTone =>
  booking.status === 'cancelled' ? 'quiet' : booking.status === 'missed' ? 'attention' : booking.stage;

export default function Bookings() {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const { bookings, membership, loading, error, refresh } = useCustomerData();
  const params = useLocalSearchParams<{ bookingId?: string; tab?: string; date?: string }>();
  const [tab, setTab] = useState<TabKey>('upcoming');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const ar = language === 'ar';
  useFocusEffect(useCallback(() => {
    if (!params.bookingId) return;
    setTab(params.tab === 'active' ? 'active' : 'upcoming');
    setSelectedDate(params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : null);
  }, [params.bookingId, params.tab, params.date]));
  LocaleConfig.defaultLocale = ar ? 'ar' : '';
  useEffect(() => { void refresh(); }, [refresh]);
  const labels: Record<TabKey, string> = ar
    ? { upcoming: 'القادمة', active: 'الجارية', past: 'السابقة' }
    : { upcoming: 'Upcoming', active: 'Active', past: 'Past' };
  const keys = Object.keys(labels) as TabKey[];
  const paid = bookings.filter((booking) => booking.payment_confirmed);
  const tabRows = tab === 'upcoming'
    ? paid.filter((b) => b.status === 'scheduled')
    : tab === 'active'
      ? paid.filter((b) => b.status === 'active')
      : paid.filter((b) => b.status === 'done' || b.status === 'cancelled' || b.status === 'missed');
  const rows = selectedDate
    ? tabRows.filter((booking) => riyadhDateKey(new Date(booking.scheduled_at)) === selectedDate)
    : tabRows;
  const calendarDate = selectedDate
    ?? paid.find((booking) => booking.status === 'scheduled')?.scheduled_at
    ?? new Date().toISOString();
  const currentMonth = /^\d{4}-\d{2}-\d{2}$/.test(calendarDate)
    ? calendarDate
    : riyadhDateKey(new Date(calendarDate));
  const markedDates = useMemo(() => {
    const marked: Record<string, {
      disabled?: boolean;
      disableTouchEvent?: boolean;
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
    }> = {};
    for (let offset = -370; offset <= 370; offset += 1) {
      const key = addCalendarDays(currentMonth, offset);
      if (isFriday(key)) marked[key] = { disabled: true, disableTouchEvent: true };
    }
    const dot: Record<RealBooking['status'], string> = {
      scheduled: theme.action.primary,
      active: theme.action.primary,
      done: theme.text.onTintYellow,
      missed: theme.palette.guava600,
      cancelled: theme.text.faint,
    };
    // Cancelled first, so a live booking on the same day keeps its colour.
    [...paid].sort((a, b) => Number(b.status === 'cancelled') - Number(a.status === 'cancelled')).forEach((booking) => {
      const key = riyadhDateKey(new Date(booking.scheduled_at));
      marked[key] = { ...marked[key], marked: true, dotColor: dot[booking.status] };
    });
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate], selected: true, selectedColor: theme.action.primary,
      };
    }
    return marked;
  }, [currentMonth, paid, selectedDate, theme]);

  return (
    <Screen scroll contentStyle={styles.page}>
      <Txt variant="title" weight="bold">{ar ? 'حجوزاتي' : 'My bookings'}</Txt>
      <Calendar
        key={language}
        current={currentMonth}
        firstDay={0}
        disabledByWeekDays={[5]}
        disableAllTouchEventsForDisabledDays
        onDayPress={(day: DateData) => {
          if (!isFriday(day.dateString)) setSelectedDate(day.dateString);
        }}
        markedDates={markedDates}
        theme={{
          calendarBackground: theme.surface.card,
          textSectionTitleColor: theme.text.secondary,
          selectedDayBackgroundColor: theme.action.primary,
          selectedDayTextColor: theme.text.inverse,
          todayTextColor: theme.action.primary,
          dayTextColor: theme.text.primary,
          textDisabledColor: theme.text.faint,
          monthTextColor: theme.text.primary,
          arrowColor: theme.action.primary,
          textDayFontFamily: 'IBMPlexSansArabic_500Medium',
          textMonthFontFamily: 'IBMPlexSansArabic_700Bold',
          textDayHeaderFontFamily: 'IBMPlexSansArabic_600SemiBold',
          textDayFontSize: theme.scale(14),
          textMonthFontSize: theme.scale(17),
          textDayHeaderFontSize: theme.scale(12),
        }}
        style={styles.calendar}
      />
      <View style={styles.calendarFoot}>
        <Txt variant="caption" tone="muted" style={styles.calendarHint}>
          {ar ? 'النقطة تعني وجود حجز. الجمعة غير متاحة.' : 'A dot marks a booking. Friday is unavailable.'}
        </Txt>
        {selectedDate ? <Button label={ar ? 'عرض الكل' : 'Show all'} variant="ghost" size="sm" onPress={() => setSelectedDate(null)} /> : null}
      </View>
      <Tabs tabs={keys.map((key) => labels[key])} value={labels[tab]} onChange={(label) => {
        setTab(keys.find((key) => labels[key] === label) ?? 'upcoming');
        setSelectedDate(null);
      }} />
      {loading && rows.length === 0 ? <Txt variant="small" tone="secondary">{ar ? 'جارٍ تحميل الحجوزات…' : 'Loading bookings…'}</Txt> : null}
      {error ? <Button label={ar ? 'إعادة المحاولة' : 'Retry'} variant="secondary" onPress={() => refresh()} /> : null}
      {!loading && !error && rows.length === 0 ? <Empty ar={ar} tab={tab} filtered={selectedDate !== null} subscribed={!!membership} /> : null}
      <View style={styles.stack}>{rows.map((booking) => <BookingRow key={booking.id} booking={booking} onRefresh={refresh} />)}</View>
    </Screen>
  );
}

function BookingRow({ booking, onRefresh }: { booking: RealBooking; onRefresh: () => Promise<void> }) {
  const { language } = useLocale();
  const router = useRouter();
  const toast = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  const ar = language === 'ar';
  const date = new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Riyadh',
  }).format(new Date(booking.scheduled_at));
  const time = new Intl.DateTimeFormat(ar ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' }).format(new Date(booking.scheduled_at));
  const service = ar ? booking.services.name_ar : booking.services.name_en;
  const before = booking.booking_media?.filter((item) => item.phase === 'before').length ?? 0;
  const after = booking.booking_media?.filter((item) => item.phase === 'after').length ?? 0;
  const state = ar
    ? ({ scheduled: 'مجدول', active: 'قيد التنفيذ', done: 'مكتمل', cancelled: 'ملغى', missed: 'فات الموعد' } as const)[booking.status]
    : ({ scheduled: 'Scheduled', active: 'In progress', done: 'Completed', cancelled: 'Cancelled', missed: 'Missed' } as const)[booking.status];
  const issue = booking.customer_issues?.[0];
  // A late team shows as scheduled until someone arrives, so the status alone
  // cannot decide this. The window opening can.
  const canReport = booking.status !== 'cancelled' && issue?.status !== 'open' && Date.parse(booking.scheduled_at) <= Date.now();
  const paid = booking.payment_confirmed ? booking.total_minor / 100 : 0;
  const cancelOpen = !booking.payment_confirmed || cancellationOpen(booking.scheduled_at);
  const noticeClosed = ar
    ? `انتهت مهلة الإلغاء، وهي ${CANCELLATION_NOTICE_HOURS} ساعات قبل الموعد.`
    : `Cancellation closed ${CANCELLATION_NOTICE_HOURS} hours before the appointment.`;
  const cancelEffect = [
    booking.source === 'club' ? (ar ? 'يمكن حجز موعد بديل في الأسبوع نفسه، ولا ترحل الغسلة إلى أسبوع آخر.' : 'Another time can be booked in the same week. The wash does not carry over to a later week.') : null,
    paid > 0 ? (ar ? `يعاد مبلغ ${paid} ر.س إلى وسيلة الدفع تلقائيًا.` : `SAR ${paid} returns to the payment method automatically.`) : null,
  ].filter(Boolean).join(' ');
  const cancel = async () => {
    setCancelError('');
    try {
      const { refund } = await cancelBooking(booking.id);
      setConfirmCancel(false);
      toast.show(refund === 'sent'
        ? (ar ? 'تم إلغاء الحجز واسترجاع المبلغ' : 'Booking cancelled and refunded')
        : refund === 'review'
          ? (ar ? 'تم إلغاء الحجز، والاسترجاع قيد المراجعة' : 'Booking cancelled. The refund is under review')
          : (ar ? 'تم إلغاء الحجز' : 'Booking cancelled'), 'washed');
      await onRefresh();
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : 'unknown';
      if (code === 'alreadyStarted') {
        setCancelError(ar ? 'بدأت الغسلة، ولا يمكن إلغاء الحجز الآن.' : 'The wash has started, so this booking can no longer be cancelled.');
        await onRefresh();
      } else if (code === 'cancelWindowClosed') {
        setCancelError(noticeClosed);
        await onRefresh();
      } else if (code === 'offline') setCancelError(ar ? 'لا يوجد اتصال بالإنترنت.' : 'No internet connection.');
      else setCancelError(ar ? 'تعذر إلغاء الحجز. يمكن إعادة المحاولة.' : 'Could not cancel the booking. Try again.');
    }
  };
  return (
    <View style={styles.booking}>
      <BookingTicket
        time={time}
        meta={`${date} · ${service} · ${booking.addresses.line}`}
        tone={toneOf(booking)}
        stub={booking.stage !== 'booked' && (booking.status === 'active' || booking.status === 'done') ? <StatusBadge status={booking.stage} size="sm" /> : undefined}
      />
      <Card style={styles.details}>
        <Detail label={ar ? 'السيارة' : 'Vehicle'} value={`${booking.vehicles.make} ${booking.vehicles.model} · ${booking.vehicles.plate}`} />
        <Detail label={ar ? 'العنوان' : 'Address'} value={[booking.addresses.line, booking.addresses.district, booking.addresses.city].filter(Boolean).join(' · ')} />
        <Detail label={ar ? 'الفريق' : 'Team'} value={booking.teams ? (ar ? booking.teams.name_ar : booking.teams.name_en) : (ar ? 'بانتظار الإسناد' : 'Awaiting assignment')} />
        <Detail label={ar ? 'الدفع' : 'Payment'} value={booking.source === 'club' ? (ar ? 'ضمن الاشتراك' : 'Subscription') : `${booking.total_minor / 100} ${ar ? 'ر.س' : 'SAR'}`} />
        <Detail label={ar ? 'الحالة' : 'Status'} value={state} />
        {(before + after > 0) ? <Detail label={ar ? 'توثيق الغسلة' : 'Wash evidence'} value={ar ? `قبل ${before} · بعد ${after}` : `Before ${before} · after ${after}`} /> : null}
        {issue ? <Detail label={ar ? 'البلاغ' : 'Report'} value={issue.status === 'open' ? (ar ? 'قيد المراجعة' : 'Under review') : (ar ? 'تمت المعالجة' : 'Resolved')} /> : null}
      </Card>
      {(before + after > 0) ? <Button label={showEvidence ? (ar ? 'إخفاء التوثيق' : 'Hide evidence') : (ar ? 'عرض الصور والفيديو' : 'View photos and video')} variant="secondary" fullWidth onPress={() => setShowEvidence(!showEvidence)} /> : null}
      {showEvidence ? <View style={styles.evidence}>{booking.booking_media.map((item) => <EvidenceItem key={item.id} bookingId={booking.id} item={item} ar={ar} />)}</View> : null}
      {canReport ? <Button label={ar ? 'الإبلاغ عن مشكلة' : 'Report a problem'} variant="ghost" fullWidth onPress={() => router.push({ pathname: '/account/report-issue', params: { bookingId: booking.id } })} /> : null}
      {booking.status === 'scheduled' && cancelOpen ? (
        <Button label={ar ? 'إلغاء الحجز' : 'Cancel booking'} variant="ghost" fullWidth onPress={() => { setCancelError(''); setConfirmCancel(true); }} />
      ) : null}
      {booking.status === 'scheduled' && !cancelOpen ? <Txt variant="small" tone="secondary" center>{noticeClosed}</Txt> : null}
      <Num variant="caption" tone="muted">{booking.ref}</Num>
      <Dialog
        open={confirmCancel}
        title={ar ? 'إلغاء الحجز؟' : 'Cancel this booking?'}
        body={`${date}${ar ? '،' : ','} ${time}`}
        dismissLabel={ar ? 'إغلاق' : 'Close'}
        onClose={() => setConfirmCancel(false)}
        actions={<>
          <Button label={ar ? 'إبقاء الحجز' : 'Keep it'} variant="secondary" onPress={() => setConfirmCancel(false)} />
          <Button label={ar ? 'تأكيد الإلغاء' : 'Cancel booking'} onPress={cancel} />
        </>}
      >
        {cancelEffect ? <Txt variant="small">{cancelEffect}</Txt> : null}
        {cancelError ? <Txt accessibilityLiveRegion="polite" variant="small" tone="danger">{cancelError}</Txt> : null}
      </Dialog>
    </View>
  );
}

function EvidenceItem({ bookingId, item, ar }: { bookingId: string; item: RealBooking['booking_media'][number]; ar: boolean }) {
  const [source, setSource] = useState<{ uri: string; headers: Record<string, string> } | null>(null);
  useEffect(() => { void bookingMediaSource(bookingId, item.id).then(setSource); }, [bookingId, item.id]);
  return <Card style={styles.evidenceItem}>
    {!source ? <View style={styles.mediaPlaceholder}><Txt variant="caption" tone="inverse">{ar ? 'جارٍ التحميل…' : 'Loading…'}</Txt></View>
      : item.kind === 'video' ? <EvidenceVideo source={source} /> : <Image source={source} style={styles.media} resizeMode="cover" />}
    <Txt variant="caption" tone="secondary">{item.phase === 'before' ? (ar ? 'قبل الغسيل' : 'Before') : (ar ? 'بعد الغسيل' : 'After')} · {item.kind === 'video' ? '360°' : (ar ? 'صورة' : 'Photo')}</Txt>
  </Card>;
}

function EvidenceVideo({ source }: { source: { uri: string; headers: Record<string, string> } }) {
  const player = useVideoPlayer(source);
  return <VideoView player={player} style={styles.media} nativeControls contentFit="cover" />;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Txt variant="caption" tone="muted">{label}</Txt><Txt variant="small" weight="semibold" style={styles.detailValue}>{value}</Txt></View>;
}

function Empty({ ar, tab, filtered, subscribed }: { ar: boolean; tab: TabKey; filtered: boolean; subscribed: boolean }) {
  const router = useRouter();
  const messages: Record<TabKey, string> = ar
    ? { upcoming: 'لا توجد مواعيد غسيل قادمة.', active: 'لا توجد غسلة جارية الآن.', past: 'لا توجد حجوزات سابقة.' }
    : { upcoming: 'No upcoming wash appointments.', active: 'No wash is in progress now.', past: 'No past bookings.' };
  return <View style={styles.empty}>
    <Txt variant="body" weight="bold" center>{filtered ? (ar ? 'لا توجد حجوزات في هذا القسم للتاريخ المحدد.' : 'No bookings in this tab for the selected date.') : messages[tab]}</Txt>
    {!filtered && tab === 'upcoming' ? <Button
      label={subscribed ? (ar ? 'إدارة اشتراكي' : 'Manage my subscription') : (ar ? 'اشترك الآن' : 'Subscribe now')}
      onPress={() => router.push(subscribed ? '/club/dashboard' : '/club')}
    /> : null}
  </View>;
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], paddingBottom: theme.spacing[7], gap: theme.spacing[4] },
  calendar: { borderRadius: theme.radius.md, borderCurve: 'continuous', paddingBottom: theme.spacing[2] },
  calendarFoot: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  calendarHint: { flex: 1 },
  stack: { gap: theme.spacing[4] },
  booking: { gap: theme.spacing[2] },
  details: { gap: theme.spacing[2] },
  detail: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[3] },
  detailValue: { flex: 1, textAlign: 'left' },
  empty: { alignItems: 'center', gap: theme.spacing[4], paddingVertical: theme.spacing[10] },
  evidence: { gap: theme.spacing[3] },
  evidenceItem: { gap: theme.spacing[2] },
  media: { width: '100%', aspectRatio: 4 / 3, borderRadius: theme.radius.sm, backgroundColor: theme.surface.dark },
  mediaPlaceholder: { width: '100%', aspectRatio: 4 / 3, borderRadius: theme.radius.sm, backgroundColor: theme.surface.dark, alignItems: 'center', justifyContent: 'center' },
}));
