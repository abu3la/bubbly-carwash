import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { FadeOut } from 'react-native-reanimated';
import { Check, ChevronDown } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { DirectionRoot } from '../theme/DirectionRoot';
import { Reveal } from '../primitives/Reveal';
import { Txt } from '../primitives/Text';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label?: string;
  hint?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
}

/**
 * A native picker sheet rather than a fake dropdown: the field opens a real
 * list you can only leave by choosing or dismissing.
 */
export function Select<T extends string>({ label, hint, value, options, onChange, placeholder }: SelectProps<T>) {
  const { theme } = useUnistyles();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View style={styles.field}>
      {label ? (
        <Txt variant="small" weight="semibold">
          {label}
        </Txt>
      ) : null}

      <Pressable accessibilityRole="button" onPress={() => setOpen(true)} style={styles.control(open)}>
        <Txt variant="body" tone={current ? 'primary' : 'faint'} style={styles.value}>
          {current?.label ?? placeholder ?? ''}
        </Txt>
        <ChevronDown size={theme.scale(16)} color={theme.text.primary} strokeWidth={2} />
      </Pressable>

      {hint ? (
        <Txt variant="caption" tone="muted">
          {hint}
        </Txt>
      ) : null}

      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        {/* Modals render outside the app tree — restate the direction. */}
        <DirectionRoot>
          <Reveal exiting={FadeOut} distance={0} style={styles.scrim}>
          <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="إغلاق" onPress={() => setOpen(false)} />
          <Reveal delay={40} distance={28} style={styles.sheet}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole="menuitem"
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={styles.option}
              >
                <Txt variant="body" weight={option.value === value ? 'semibold' : 'regular'} style={styles.value}>
                  {option.label}
                </Txt>
                {option.value === value ? (
                  <Check size={theme.scale(18)} color={theme.action.primary} strokeWidth={2.5} />
                ) : null}
              </Pressable>
            ))}
            </Reveal>
          </Reveal>
        </DirectionRoot>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  field: { gap: theme.spacing[1] + 2 },
  control: (open: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    height: theme.scale(44),
    paddingHorizontal: theme.scale(14),
    backgroundColor: theme.surface.card,
    borderWidth: theme.border.width,
    borderColor: open ? theme.action.primary : theme.border.strong,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  }),
  value: { flex: 1 },
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(23,22,46,0.4)' },
  sheet: {
    backgroundColor: theme.surface.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderCurve: 'continuous',
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[5] + rt.insets.bottom,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    minHeight: theme.layout.hitTarget + theme.spacing[2],
  },
}));
