import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { BookingTicket, Button, Card, Num, Screen, Tabs, Txt, useLocale } from '@sama/ui-native';
import { bookingMediaSource, cancelBooking, type RealBooking } from '../../src/api';
import { useCustomerData } from '../../src/customerData';

type TabKey = 'upcoming' | 'active' | 'past';

export default function Bookings() {
  const { language } = useLocale();
  const { bookings, loading, error, refresh } = useCustomerData();
  const [tab, setTab] = useState<TabKey>('upcoming');
  const ar = language === 'ar';
  useEffect(() => { void refresh(); }, [refresh]);
  const labels: Record<TabKey, string> = ar
    ? { upcoming: 'القادمة', active: 'الجارية', past: 'السابقة' }
    : { upcoming: 'Upcoming', active: 'Active', past: 'Past' };
  const keys = Object.keys(labels) as TabKey[];
  const paid = bookings.filter((booking) => booking.payment_confirmed);
  const rows = tab === 'upcoming'
    ? paid.filter((b) => b.status === 'scheduled')
    : tab === 'active'
      ? paid.filter((b) => b.status === 'active')
      : paid.filter((b) => b.status === 'done' || b.status === 'cancelled');

  return (
    <Screen scroll contentStyle={styles.page}>
      <Txt variant="title" weight="bold">{ar ? 'حجوزاتي' : 'My bookings'}</Txt>
      <Tabs tabs={keys.map((key) => labels[key])} value={labels[tab]} onChange={(label) => setTab(keys.find((key) => labels[key] === label) ?? 'upcoming')} />
      {loading && rows.length === 0 ? <Txt variant="small" tone="secondary">{ar ? 'جارٍ تحميل الحجوزات…' : 'Loading bookings…'}</Txt> : null}
      {error ? <Button label={ar ? 'إعادة المحاولة' : 'Retry'} variant="secondary" onPress={() => void refresh()} /> : null}
      {!loading && rows.length === 0 ? <Empty ar={ar} /> : null}
      <View style={styles.stack}>{rows.map((booking) => <BookingRow key={booking.id} booking={booking} onRefresh={refresh} />)}</View>
    </Screen>
  );
}

function BookingRow({ booking, onRefresh }: { booking: RealBooking; onRefresh: () => Promise<void> }) {
  const { language } = useLocale();
  const [busy, setBusy] = useState(false);
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
    ? ({ scheduled: 'مجدول', active: 'قيد التنفيذ', done: 'مكتمل', cancelled: 'ملغى' } as const)[booking.status]
    : booking.status;
  return (
    <View style={styles.booking}>
      <BookingTicket time={time} meta={`${date} · ${service} · ${booking.addresses.line}`} />
      <Card style={styles.details}>
        <Detail label={ar ? 'السيارة' : 'Vehicle'} value={`${booking.vehicles.make} ${booking.vehicles.model} · ${booking.vehicles.plate}`} />
        <Detail label={ar ? 'العنوان' : 'Address'} value={[booking.addresses.line, booking.addresses.district, booking.addresses.city].filter(Boolean).join(' · ')} />
        <Detail label={ar ? 'الفريق' : 'Team'} value={booking.teams ? (ar ? booking.teams.name_ar : booking.teams.name_en) : (ar ? 'بانتظار الإسناد' : 'Awaiting assignment')} />
        <Detail label={ar ? 'الدفع' : 'Payment'} value={booking.source === 'club' ? (ar ? 'ضمن الاشتراك' : 'Subscription') : `${booking.total_minor / 100} ${ar ? 'ر.س' : 'SAR'}`} />
        <Detail label={ar ? 'الحالة' : 'Status'} value={state} />
        {(before + after > 0) ? <Detail label={ar ? 'توثيق الغسلة' : 'Wash evidence'} value={ar ? `قبل ${before} · بعد ${after}` : `Before ${before} · after ${after}`} /> : null}
      </Card>
      {(before + after > 0) ? <Button label={showEvidence ? (ar ? 'إخفاء التوثيق' : 'Hide evidence') : (ar ? 'عرض الصور والفيديو' : 'View photos and video')} variant="secondary" fullWidth onPress={() => setShowEvidence(!showEvidence)} /> : null}
      {showEvidence ? <View style={styles.evidence}>{booking.booking_media.map((item) => <EvidenceItem key={item.id} bookingId={booking.id} item={item} ar={ar} />)}</View> : null}
      {booking.status === 'scheduled' ? (
        <Button label={busy ? (ar ? 'جارٍ الإلغاء…' : 'Cancelling…') : (ar ? 'إلغاء الحجز' : 'Cancel booking')} variant="ghost" fullWidth disabled={busy} onPress={async () => {
          setBusy(true);
          try { await cancelBooking(booking.id); await onRefresh(); } finally { setBusy(false); }
        }} />
      ) : null}
      <Num variant="caption" tone="muted">{booking.ref}</Num>
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

function Empty({ ar }: { ar: boolean }) {
  const router = useRouter();
  return <View style={styles.empty}><Txt variant="body" weight="bold" center>{ar ? 'لا توجد حجوزات هنا.' : 'No bookings here.'}</Txt><Button label={ar ? 'احجز غسلة' : 'Book a wash'} onPress={() => router.push('/book/service')} /></View>;
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], paddingBottom: theme.spacing[7], gap: theme.spacing[4] },
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
