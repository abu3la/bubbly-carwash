import { Text as RNText, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, writtenAlign } from '../theme/locale';

export type TextVariant =
  | 'displayXl'
  | 'display'
  | 'title'
  | 'heading'
  | 'bodyLg'
  | 'body'
  | 'small'
  | 'caption'
  | 'label';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextTone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'faint'
  | 'inverse'
  | 'inverseSoft'
  | 'action'
  | 'danger';

/**
 * Alignment is applied outside `StyleSheet.create`: Unistyles does not carry
 * `textAlign` through its dynamic style functions, and `textAlign: 'auto'` is
 * no help either — on iOS it resolves from the device language rather than the
 * script of the string, so Arabic still sits on the left.
 *
 * The values go through `writtenAlign` because React Native swaps physical
 * left/right inside an RTL subtree: writing 'right' there renders on the left.
 * The intent below is the *visual* one.
 */
const ALIGN: Record<'rtl' | 'ltr', TextStyle> = {
  rtl: { textAlign: writtenAlign('right', 'rtl'), writingDirection: 'rtl' },
  ltr: { textAlign: writtenAlign('left', 'ltr'), writingDirection: 'ltr' },
};
const ALIGN_CENTER: Record<'rtl' | 'ltr', TextStyle> = {
  rtl: { textAlign: 'center', writingDirection: 'rtl' },
  ltr: { textAlign: 'center', writingDirection: 'ltr' },
};

interface TxtProps extends Omit<TextProps, 'style'> {
  variant?: TextVariant;
  weight?: TextWeight;
  tone?: TextTone;
  center?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * The only way text enters the app. Size, leading, tracking and weight all come
 * from the type scale, so no screen can invent a font size.
 */
export function Txt({
  variant = 'body',
  weight = 'regular',
  tone = 'primary',
  center = false,
  style,
  ...rest
}: TxtProps) {
  const { direction } = useLocale();
  const arabic = direction === 'rtl';

  return (
    <RNText
      {...rest}
      style={[styles.text(variant, weight, tone, arabic), (center ? ALIGN_CENTER : ALIGN)[direction], style]}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  text: (variant: TextVariant, weight: TextWeight, tone: TextTone, arabic: boolean) => ({
    fontFamily: theme.font[weight],
    fontSize: theme.fontSize[variant],
    // Arabic rides a taller ladder — see `lineHeightArabic`.
    lineHeight: Math.round(
      theme.fontSize[variant] * (arabic ? theme.leadingArabic : theme.leading)[variant],
    ),
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
    // Tracking is a Latin-only device here, in BOTH directions.
    //
    // Positive tracking forces gaps between letters that are required to join,
    // and Arabic words visibly fall apart. Negative tracking fails the same way
    // from the other side: it pulls the joined forms into each other until the
    // connections collide, and ببلز reads as a single mangled shape rather than
    // three letters. Neither is a tightening Arabic "tolerates" — a cursive
    // script sets at its designed fit or not at all.
    letterSpacing: arabic
      ? 0
      : variant === 'display' || variant === 'displayXl' || variant === 'title'
        ? theme.fontSize[variant] * theme.tracking.display
        : 0,
  }),
}));
