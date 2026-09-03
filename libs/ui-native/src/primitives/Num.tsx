import { Text as RNText, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, writtenAlign } from '../theme/locale';
import { LRI, PDI } from '../theme/bidi';
import type { TextTone, TextVariant, TextWeight } from './Text';

/**
 * Applied outside the stylesheet for the same reason as in `Text`.
 *
 * `writingDirection: 'ltr'` is NOT here to make digits run left-to-right —
 * digits are Unicode class EN and always do, in every paragraph direction. It
 * is here for the *neutral and Latin* characters travelling with them: `+`,
 * `–`, `••••`, `Nº`, the letters in `BK-4821`. Those take their direction from
 * their surroundings, so at the edge of an Arabic line `+966` can resolve to
 * `966+`. The direction pins them; `textAlign` is a separate concern and only
 * decides which edge the run sits on.
 */
const ALIGN_NUM: Record<'rtl' | 'ltr', TextStyle> = {
  rtl: { writingDirection: 'ltr', textAlign: writtenAlign('right', 'rtl') },
  ltr: { writingDirection: 'ltr', textAlign: writtenAlign('left', 'ltr') },
};

interface NumProps extends Omit<TextProps, 'style'> {
  variant?: TextVariant;
  weight?: TextWeight;
  tone?: TextTone;
  style?: StyleProp<TextStyle>;
}

/**
 * Prices, times, phone numbers, plates and invoice IDs.
 *
 * Two jobs, neither of them "make the digits LTR" — that is automatic. It pins
 * the direction of the punctuation and Latin letters mixed in with them (see
 * ALIGN_NUM), and it applies tabular figures so amounts do not jitter as their
 * digits change.
 */
export function Num({
  children,
  variant = 'body',
  weight = 'regular',
  tone = 'primary',
  style,
  ...rest
}: NumProps) {
  const { direction } = useLocale();
  return (
    <RNText {...rest} style={[styles.num(variant, weight, tone), ALIGN_NUM[direction], style]}>
      {LRI}
      {children}
      {PDI}
    </RNText>
  );
}

const styles = StyleSheet.create((theme) => ({
  num: (variant: TextVariant, weight: TextWeight, tone: TextTone) => ({
    fontFamily: theme.font[weight],
    fontSize: theme.fontSize[variant],
    lineHeight: Math.round(theme.fontSize[variant] * theme.leading[variant]),
    color: {
      primary: theme.text.primary,
      secondary: theme.text.secondary,
      muted: theme.text.muted,
      faint: theme.text.faint,
      inverse: theme.text.inverse,
      inverseSoft: theme.text.inverseSoft,
      action: theme.action.primary,
      danger: theme.palette.guava600,
    }[tone],
    fontVariant: ['tabular-nums'],
  }),
}));
