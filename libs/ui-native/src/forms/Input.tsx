import { useState } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { useLocale } from '../theme/locale';
import { Txt } from '../primitives/Text';

/**
 * Alignment lives outside `StyleSheet.create` for the same reason it does in
 * `Text`: Unistyles does not carry `textAlign` through a dynamic style
 * function, so a value set in the stylesheet is silently dropped and the field
 * renders left-aligned whatever the language is.
 *
 * Plain physical values: the app does not set the native RTL flag, so React
 * Native's left/right swap never runs and what is written is what renders.
 */
const ALIGN: Record<'rtl' | 'ltr', TextStyle> = {
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  ltr: { textAlign: 'left', writingDirection: 'ltr' },
};

/** A Latin run — a phone number or a code — sits against its prefix. */
const ALIGN_LTR: TextStyle = {
  textAlign: 'left',
  writingDirection: 'ltr',
  fontVariant: ['tabular-nums'],
};

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Helper text under the field. */
  hint?: string;
  /** Error message; switches the field to its guava state. */
  error?: string;
  /**
   * For fields holding a number with punctuation — a phone number, a code.
   * Pins the direction of the non-digit characters and left-aligns the run
   * against its prefix; the digits themselves need no help.
   */
  ltr?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, hint, error, ltr, containerStyle, ...rest }: InputProps) {
  const { theme } = useUnistyles();
  const { direction } = useLocale();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.field, containerStyle]}>
      {label ? (
        <Txt variant="small" weight="semibold">
          {label}
        </Txt>
      ) : null}
      <TextInput
        {...rest}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        placeholderTextColor={theme.text.faint}
        style={[styles.input(focused, !!error), ltr ? ALIGN_LTR : ALIGN[direction]]}
      />
      {error || hint ? (
        <Txt variant="caption" tone={error ? 'danger' : 'muted'}>
          {error ?? hint}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  field: { gap: theme.spacing[1] + 2 },
  input: (focused: boolean, error: boolean) => ({
    minHeight: theme.scale(48),
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.scale(14),
    fontFamily: theme.font.regular,
    fontSize: theme.fontSize.body,
    color: theme.text.primary,
    backgroundColor: theme.surface.card,
    borderWidth: theme.border.width,
    borderColor: error ? theme.palette.guava : focused ? theme.action.primary : theme.border.strong,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    // The focus ring is a real ring, drawn only while focused — never a
    // resting glow.
    boxShadow: focused && !error ? theme.focusRing : undefined,
  }),
}));
