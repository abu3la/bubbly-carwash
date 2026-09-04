import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { Calendar, LocaleConfig, type DateData } from 'react-native-calendars';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Num, Screen, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { fetchAvailability, type Availability } from '../../src/api';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';
import { addCalendarDays, isFriday, nextBookableDateKey, riyadhDateKey } from '../../src/dates';

LocaleConfig.locales.ar = {
  monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  today: 'اليوم',
};

export default function ChooseSlot() {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();
  LocaleConfig.defaultLocale = language === 'ar' ? 'ar' : '';
  const [bookingWindow] = useState(() => {
    const minDate = riyadhDateKey();
    return { minDate, maxDate: addCalendarDays(minDate, 90) };
  });
  const [selectedDate, setSelectedDate] = useState(() => (
    draft.date && draft.date >= bookingWindow.minDate && !isFriday(draft.date)
      ? draft.date
      : nextBookableDateKey()
  ));
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const dateLabel = useMemo(() => new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${selectedDate}T12:00:00Z`)), [language, selectedDate]);
  const markedDates = useMemo(() => {
    const days: Record<string, { disabled?: boolean; disableTouchEvent?: boolean; selected?: boolean; selectedColor?: string }> = {};
    // Include neighbouring dates rendered by the calendar as well as the
    // booking window, so even "today" is visibly disabled when it is Friday.
    for (let offset = -35; offset <= 125; offset += 1) {
      const key = addCalendarDays(bookingWindow.minDate, offset);
      if (isFriday(key)) days[key] = { disabled: true, disableTouchEvent: true };
    }
    days[selectedDate] = { ...days[selectedDate], selected: true, selectedColor: theme.action.primary };
    return days;
  }, [bookingWindow.minDate, selectedDate, theme.action.primary]);

  useEffect(() => {
    draft.setDay(selectedDate, dateLabel);
    if (draft.addressLat == null || draft.addressLng == null) {
      setAvailability(null); setFailed(true); setLoading(false); return;
    }
    let alive = true;
    setLoading(true); setFailed(false);
    fetchAvailability(draft.addressLat, draft.addressLng, selectedDate)
      .then((result) => {
        if (!alive) return;
        setAvailability(result);
        const first = result.slots[0];
        if (first) draft.setSlot(first.period, first.startsAt, first.endsAt);
      })
      .catch(() => { if (alive) { setAvailability(null); setFailed(true); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [selectedDate, dateLabel, draft.addressLat, draft.addressLng]);

  const message = failed
    ? copy.authErrors.offline
    : availability?.reason === 'outsideServiceArea'
      ? copy.booking.outsideTeamArea
      : availability?.reason === 'full'
        ? copy.booking.dayFull
        : null;

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.slot} step={3} steps={5} onBack={() => router.back()} />
      <View style={styles.body}>
        <View style={styles.calendarBlock}>
          <SectionLabel>{copy.booking.day}</SectionLabel>
          <Calendar
            key={language}
            current={selectedDate}
            minDate={bookingWindow.minDate}
            maxDate={bookingWindow.maxDate}
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
          <Txt variant="caption" tone="muted">{copy.booking.fridayOff}</Txt>
        </View>

        <View style={styles.slotBlock}>
          <SectionLabel>{copy.booking.availableSlots}</SectionLabel>
          {loading ? <Txt variant="small" tone="secondary">{copy.booking.checkingAvailability}</Txt> : null}
          {!loading && message ? <Txt variant="small" tone="danger">{message}</Txt> : null}
          {!loading && !message ? (availability?.slots ?? []).map((slot) => {
            const selected = draft.period === slot.period;
            return (
              <Pressable
                key={slot.period}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => draft.setSlot(slot.period, slot.startsAt, slot.endsAt)}
                style={styles.slot(selected)}
              >
                <View style={styles.slotText}>
                  <Txt variant="body" weight="bold" tone={selected ? 'inverse' : 'primary'}>{copy.booking.periods[slot.period]}</Txt>
                  <Txt variant="caption" tone={selected ? 'inverseSoft' : 'muted'}>{copy.booking.remainingSlots(slot.remaining)}</Txt>
                </View>
                <Num variant="small" weight="semibold" tone={selected ? 'inverse' : 'secondary'}>{slot.startsAt}–{slot.endsAt}</Num>
              </Pressable>
            );
          }) : null}
          {availability?.team ? (
            <Txt variant="caption" tone="muted">{copy.booking.teamAvailable(availability.team.name[language], availability.team.distanceKm, availability.team.dailyCapacity)}</Txt>
          ) : null}
        </View>

        <View style={styles.hold}>
          <Clock size={theme.scale(14)} color={theme.text.muted} strokeWidth={2} />
          <Txt variant="caption" tone="muted" style={styles.holdText}>{copy.booking.holdNote}</Txt>
        </View>
        <Button label={copy.common.continue} size="lg" fullWidth disabled={loading || !draft.slotStart || !!message} onPress={() => router.push('/book/review')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  calendarBlock: { gap: theme.spacing[2] },
  calendar: { borderRadius: theme.radius.md, borderCurve: 'continuous', paddingBottom: theme.spacing[2] },
  slotBlock: { gap: theme.spacing[2] },
  slot: (selected: boolean) => ({
    minHeight: theme.scale(68), paddingHorizontal: theme.spacing[4], flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: theme.spacing[3], borderRadius: theme.radius.md, borderCurve: 'continuous',
    backgroundColor: selected ? theme.action.primary : theme.surface.bookingSoft,
  }),
  slotText: { flex: 1, gap: 2 },
  hold: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  holdText: { flexShrink: 1 },
}));
