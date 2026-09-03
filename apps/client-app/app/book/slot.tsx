import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Num, Screen, Tag, Txt, useLocale } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { BOOKING_LOCATION } from '../../src/content';
import { fetchAvailability, type Availability } from '../../src/api';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';

const DAY_MS = 86_400_000;

function riyadhDayStart() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day));
}

export default function ChooseSlot() {
  const { theme } = useUnistyles();
  const { language } = useLocale();
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();

  const days = useMemo(() => {
    const start = riyadhDayStart();
    return Array.from({ length: 7 }, (_, index) => {
      const value = new Date(start + index * DAY_MS);
      return {
        iso: value.toISOString().slice(0, 10),
        friday: value.getUTCDay() === 5,
        label: new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-GB', {
          weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
        }).format(value),
      };
    });
  }, [language]);

  const [selectedDate, setSelectedDate] = useState(days.find((day) => !day.friday)?.iso ?? days[0].iso);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const selectedDay = days.find((day) => day.iso === selectedDate) ?? days[0];

  useEffect(() => {
    draft.setDay(selectedDay.label);
    draft.setSlot('');
    if (selectedDay.friday) {
      setAvailability(null);
      setLoading(false);
      setFailed(false);
      return;
    }

    let alive = true;
    setLoading(true);
    setFailed(false);
    fetchAvailability(BOOKING_LOCATION.lat, BOOKING_LOCATION.lng, selectedDay.iso)
      .then((result) => {
        if (!alive) return;
        setAvailability(result);
        const first = result.slots[0];
        if (first) draft.setSlot(`${first.startsAt}–${first.endsAt}`);
      })
      .catch(() => {
        if (alive) {
          setAvailability(null);
          setFailed(true);
        }
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [selectedDate, selectedDay.friday, selectedDay.iso, selectedDay.label]);

  const message = selectedDay.friday
    ? copy.booking.fridayOff
    : failed
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
        <View>
          <SectionLabel>{copy.booking.day}</SectionLabel>
          <View style={styles.days}>
            {days.map((day) => (
              <Tag key={day.iso} selected={selectedDate === day.iso} onPress={() => setSelectedDate(day.iso)}>
                {day.friday ? `${day.label} · ${copy.booking.fridayOff}` : day.label}
              </Tag>
            ))}
          </View>
        </View>

        <View>
          <SectionLabel>{copy.booking.availableSlots}</SectionLabel>
          {loading ? (
            <Txt variant="small" tone="secondary">{copy.booking.checkingAvailability}</Txt>
          ) : message ? (
            <Txt variant="small" tone="secondary">{message}</Txt>
          ) : (
            <View style={styles.slots}>
              {(availability?.slots ?? []).map((slot) => {
                const value = `${slot.startsAt}–${slot.endsAt}`;
                const selected = draft.slot === value;
                return (
                  <Pressable
                    key={slot.period}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${copy.booking.periods[slot.period]} · ${value}`}
                    onPress={() => draft.setSlot(value)}
                    style={styles.slot(selected)}
                  >
                    <Txt variant="body" weight="bold" tone={selected ? 'inverse' : 'primary'}>
                      {copy.booking.periods[slot.period]}
                    </Txt>
                    <Num variant="caption" tone={selected ? 'inverseSoft' : 'secondary'}>{value}</Num>
                    <Txt variant="caption" tone={selected ? 'inverseSoft' : 'muted'}>
                      {copy.booking.remainingSlots(slot.remaining)}
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
          )}

          {availability?.team ? (
            <Txt variant="caption" tone="muted" style={styles.note}>
              {copy.booking.teamAvailable(
                availability.team.name[language],
                availability.team.distanceKm,
                availability.team.dailyCapacity,
              )}
            </Txt>
          ) : null}
        </View>

        <View style={styles.hold}>
          <Clock size={theme.scale(14)} color={theme.text.muted} strokeWidth={2} />
          <Txt variant="caption" tone="muted" style={styles.holdText}>{copy.booking.holdNote}</Txt>
        </View>

        <Button
          label={copy.common.continue}
          size="lg"
          fullWidth
          disabled={loading || !draft.slot || !!message}
          onPress={() => router.push('/book/review')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
  slots: { gap: theme.spacing[2] },
  slot: (selected: boolean) => ({
    minHeight: theme.scale(68),
    paddingHorizontal: theme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    backgroundColor: selected ? theme.action.primary : theme.surface.bookingSoft,
    boxShadow: selected ? undefined : `inset 0 0 0 ${theme.border.width}px ${theme.surface.booking}`,
  }),
  note: { marginTop: theme.spacing[3], lineHeight: theme.scale(19) },
  hold: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  holdText: { flexShrink: 1 },
}));
