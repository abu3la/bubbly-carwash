import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, LocaleConfig, type DateData } from 'react-native-calendars';
import { Car, MapPin, X } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Card, Num, Screen, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { useClubDraft } from '../../src/clubDraft';
import { useCustomerData } from '../../src/customerData';
import { fetchAvailability, type Availability } from '../../src/api';
import { useCatalogue } from '../../src/catalogue';

LocaleConfig.locales.ar = {
  monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  today: 'اليوم',
};

const key = (date: Date) => date.toISOString().slice(0, 10);
const TODAY = key(new Date());
const MAX = key(new Date(Date.now() + 30 * 86_400_000));
function firstOpen() {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  while (d.getUTCDay() === 5) d.setUTCDate(d.getUTCDate() + 1);
  return key(d);
}

export default function ClubSchedule() {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const router = useRouter();
  const draft = useClubDraft();
  const { vehicles, addresses } = useCustomerData();
  const catalogue = useCatalogue();
  const plan = catalogue?.plans.find((item) => item.id === draft.planId);
  const quota = plan?.weekly ?? (draft.planId.endsWith('-3') ? 3 : 2);
  const [date, setDate] = useState(firstOpen());
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);
  const address = addresses.find((item) => item.id === draft.addressId);
  const ar = language === 'ar';
  LocaleConfig.defaultLocale = ar ? 'ar' : '';

  useEffect(() => {
    if (!draft.vehicleId && vehicles.length) draft.setVehicleId((vehicles.find((v) => v.is_default) ?? vehicles[0]).id);
    if (!draft.addressId && addresses.length) draft.setAddressId((addresses.find((a) => a.is_default) ?? addresses[0]).id);
  }, [vehicles, addresses, draft.vehicleId, draft.addressId]);

  useEffect(() => {
    if (address?.lat == null || address.lng == null) { setAvailability(null); return; }
    let live = true;
    setLoading(true);
    fetchAvailability(address.lat, address.lng, date)
      .then((value) => { if (live) setAvailability(value); })
      .catch(() => { if (live) setAvailability(null); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [address?.id, address?.lat, address?.lng, date]);

  const label = useMemo(() => new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`)), [ar, date]);
  const marked = Object.fromEntries(draft.slots.map((slot) => [slot.date, { marked: true, dotColor: theme.action.primary }]));
  marked[date] = { ...marked[date], selected: true, selectedColor: theme.action.primary } as never;

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={ar ? 'مواعيد الاشتراك' : 'Subscription appointments'} onBack={() => router.back()} />
      <View style={styles.body}>
        <Txt variant="small" tone="secondary">
          {ar ? `اختر ${quota} مواعيد أولى. كل موعد يُحتسب في أسبوعه وإذا مرّ لا يتحول إلى رصيد.` : `Choose your first ${quota} appointments. Each one belongs to its week and never becomes credit.`}
        </Txt>

        <View style={styles.section}>
          <SectionLabel>{ar ? 'السيارة' : 'Vehicle'}</SectionLabel>
          {vehicles.map((vehicle) => (
            <Pressable key={vehicle.id} onPress={() => draft.setVehicleId(vehicle.id)} style={styles.choice(draft.vehicleId === vehicle.id)}>
              <Car size={theme.scale(18)} color={theme.text.secondary} strokeWidth={2} />
              <Txt variant="small" weight="semibold" style={styles.choiceText}>{vehicle.make} {vehicle.model} · {vehicle.plate}</Txt>
            </Pressable>
          ))}
        </View>
        <View style={styles.section}>
          <SectionLabel>{ar ? 'العنوان' : 'Address'}</SectionLabel>
          {addresses.map((item) => (
            <Pressable key={item.id} onPress={() => draft.setAddressId(item.id)} style={styles.choice(draft.addressId === item.id)}>
              <MapPin size={theme.scale(18)} color={theme.text.secondary} strokeWidth={2} />
              <Txt variant="small" weight="semibold" style={styles.choiceText}>{item.line}</Txt>
            </Pressable>
          ))}
        </View>

        <Calendar
          key={language}
          current={date}
          minDate={TODAY}
          maxDate={MAX}
          disabledByWeekDays={[5]}
          disableAllTouchEventsForDisabledDays
          onDayPress={(day: DateData) => setDate(day.dateString)}
          markedDates={marked}
          theme={{
            calendarBackground: theme.surface.card, textSectionTitleColor: theme.text.secondary,
            selectedDayBackgroundColor: theme.action.primary, selectedDayTextColor: theme.text.inverse,
            todayTextColor: theme.action.primary, dayTextColor: theme.text.primary, textDisabledColor: theme.text.faint,
            monthTextColor: theme.text.primary, arrowColor: theme.action.primary,
            textDayFontFamily: 'IBMPlexSansArabic_500Medium', textMonthFontFamily: 'IBMPlexSansArabic_700Bold',
            textDayHeaderFontFamily: 'IBMPlexSansArabic_600SemiBold',
          }}
          style={styles.calendar}
        />
        <Txt variant="caption" tone="muted">{ar ? 'الجمعة إجازة وغير متاح للحجز.' : 'Friday is closed and cannot be booked.'}</Txt>

        <View style={styles.section}>
          <SectionLabel>{ar ? 'الفترة' : 'Period'}</SectionLabel>
          {loading ? <Txt variant="small" tone="secondary">{ar ? 'نتحقق من السعة…' : 'Checking capacity…'}</Txt> : null}
          {!loading && availability?.slots.map((slot) => {
            const slotStart = `${date}T${slot.startsAt}:00+03:00`;
            const chosen = draft.slots.some((item) => item.slotStart === slotStart);
            const full = draft.slots.length >= quota && !chosen;
            return (
              <Pressable key={slot.period} disabled={full} onPress={() => {
                if (chosen) draft.removeSlot(slotStart);
                else draft.addSlot({ date, label, period: slot.period, startsAt: slot.startsAt, endsAt: slot.endsAt, slotStart });
              }} style={styles.slot(chosen, full)}>
                <View style={styles.choiceText}>
                  <Txt variant="body" weight="bold" tone={chosen ? 'inverse' : 'primary'}>{ar ? ({ morning: 'صباحًا', afternoon: 'ظهرًا', night: 'مساءً' } as const)[slot.period] : slot.period}</Txt>
                  <Txt variant="caption" tone={chosen ? 'inverseSoft' : 'muted'}>{ar ? `${slot.remaining} متاح` : `${slot.remaining} available`}</Txt>
                </View>
                <Num variant="small" weight="semibold" tone={chosen ? 'inverse' : 'secondary'}>{slot.startsAt}–{slot.endsAt}</Num>
              </Pressable>
            );
          })}
          {!loading && availability?.reason ? <Txt variant="small" tone="danger">{ar ? 'لا توجد سعة لهذا اليوم أو العنوان خارج النطاق.' : 'No capacity for this day, or the address is outside coverage.'}</Txt> : null}
        </View>

        {draft.slots.length ? (
          <Card style={styles.selected}>
            <Txt variant="body" weight="bold">{ar ? `تم اختيار ${draft.slots.length} من ${quota}` : `${draft.slots.length} of ${quota} selected`}</Txt>
            {draft.slots.map((slot) => (
              <View key={slot.slotStart} style={styles.selectedRow}>
                <View style={styles.choiceText}>
                  <Txt variant="small" weight="semibold">{slot.label}</Txt>
                  <Num variant="caption" tone="secondary">{slot.startsAt}–{slot.endsAt}</Num>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={ar ? 'حذف الموعد' : 'Remove appointment'} onPress={() => draft.removeSlot(slot.slotStart)} hitSlop={10}>
                  <X size={theme.scale(18)} color={theme.text.secondary} strokeWidth={2} />
                </Pressable>
              </View>
            ))}
          </Card>
        ) : null}

        <Button label={ar ? 'مراجعة الاشتراك' : 'Review subscription'} size="lg" fullWidth disabled={!draft.vehicleId || !draft.addressId || draft.slots.length !== quota} onPress={() => router.push('/club/review')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[4] },
  section: { gap: theme.spacing[2] },
  choice: (selected: boolean) => ({ minHeight: theme.scale(48), paddingHorizontal: theme.spacing[3], flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2], borderRadius: theme.radius.md, backgroundColor: selected ? theme.surface.booking : theme.surface.card }),
  choiceText: { flex: 1, gap: 1 },
  calendar: { borderRadius: theme.radius.md, borderCurve: 'continuous', paddingBottom: theme.spacing[2] },
  slot: (selected: boolean, disabled: boolean) => ({ minHeight: theme.scale(64), paddingHorizontal: theme.spacing[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing[3], borderRadius: theme.radius.md, backgroundColor: selected ? theme.action.primary : theme.surface.bookingSoft, opacity: disabled ? 0.38 : 1 }),
  selected: { gap: theme.spacing[3] },
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] },
}));
