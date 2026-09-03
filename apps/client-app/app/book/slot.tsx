import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Button, Num, Screen, Tag, Txt } from '@sama/ui-native';
import { FlowHeader } from '../../src/components/FlowHeader';
import { SectionLabel } from '../../src/components/Bits';
import { SLOTS } from '../../src/content';
import { useCopy } from '../../src/i18n';
import { useBookingDraft } from '../../src/bookingDraft';
import { useSession } from '../../src/session';

export default function ChooseSlot() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const draft = useBookingDraft();
  const copy = useCopy();
  const { club } = useSession();

  return (
    <Screen scroll contentStyle={styles.page}>
      <FlowHeader title={copy.booking.slot} step={3} steps={5} onBack={() => router.back()} />

      <View style={styles.body}>
        <View>
          <SectionLabel>{copy.booking.day}</SectionLabel>
          <View style={styles.days}>
            {copy.days.map((day) => (
              <Tag key={day} selected={draft.day === day} onPress={() => draft.setDay(day)}>
                {day}
              </Tag>
            ))}
          </View>
        </View>

        <View>
          <SectionLabel>{copy.booking.availableSlots}</SectionLabel>
          <View style={styles.slots}>
            {SLOTS.map((slot) => {
              const selected = draft.slot === slot.time;
              // The perk the club actually sells: a peak slot that is closed to
              // everyone else opens for a member. It is the same grid either
              // way, so the difference is legible rather than hidden.
              const open = club ? !slot.taken || !!slot.priority : !slot.taken;
              const forMember = !!slot.priority && !!club;
              return (
                <Pressable
                  key={slot.time}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: !open }}
                  accessibilityLabel={forMember ? `${slot.time} · ${copy.booking.prioritySlot}` : slot.time}
                  disabled={!open}
                  onPress={() => draft.setSlot(slot.time)}
                  style={styles.slot(selected, !open, forMember)}
                >
                  <Num variant="small" weight="semibold" tone={selected ? 'inverse' : !open ? 'faint' : 'primary'}>
                    {slot.time}
                  </Num>
                  {forMember && !selected ? (
                    <Txt variant="label" weight="bold" tone="action">
                      {copy.booking.prioritySlot}
                    </Txt>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          {/* A taken slot is shown, not hidden: the grid stays stable and you
              can see the shape of the day. */}
          <Txt variant="caption" tone="muted" style={styles.note}>
            {club ? copy.booking.takenNoteMember : copy.booking.takenNote}
          </Txt>
        </View>

        <View style={styles.hold}>
          <Clock size={theme.scale(14)} color={theme.text.muted} strokeWidth={2} />
          <Txt variant="caption" tone="muted" style={styles.holdText}>
            {copy.booking.holdNote}
          </Txt>
        </View>

        <Button label={copy.common.continue} size="lg" fullWidth onPress={() => router.push('/book/review')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingBottom: theme.spacing[7] },
  body: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[4], gap: theme.spacing[5] },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] },
  slot: (selected: boolean, taken: boolean, forMember: boolean) => ({
    // Three to a row, gaps removed, so every chip is the same width and the
    // grid cannot go ragged.
    width: `${(100 - 2 * 3) / 3}%`,
    minHeight: theme.scale(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    gap: 1,
    backgroundColor: selected ? theme.action.primary : theme.surface.bookingSoft,
    // A member's slot carries the action colour on its own edge rather than a
    // badge parked on top of it.
    boxShadow: selected
      ? undefined
      : `inset 0 0 0 ${theme.border.width * (forMember ? 2 : 1)}px ${forMember ? theme.action.primary : theme.surface.booking}`,
    opacity: taken ? 0.45 : 1,
  }),
  note: { marginTop: theme.spacing[2] },
  hold: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  holdText: { flexShrink: 1 },
}));
