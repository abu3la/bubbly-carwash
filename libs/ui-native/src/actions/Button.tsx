import { useButtonAction } from './useButtonAction';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Txt } from '../primitives/Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => unknown;
  /** For work managed outside the press handler. Returned promises load automatically. */
  loading?: boolean;
  /** Primary is Electric Violet — the only action colour in the system. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon, 16-18px, inheriting the label's colour. */
  icon?: ReactNode;
  disabled?: boolean;
  /** A ghost button sitting on the ink ground. */
  onDark?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  onDark = false,
  loading = false,
  fullWidth,
  style,
}: ButtonProps) {
  const { theme } = useUnistyles();
  const { busy, inactive, run } = useButtonAction(onPress, disabled, loading);
  const indicatorColor = { primary: theme.action.onPrimary, secondary: theme.text.primary, ghost: onDark ? theme.text.inverse : theme.text.primary, dark: theme.text.inverse }[variant];
  const reduced = useReducedMotion();
  // The design's press state is a 1px settle, not a lift — the button moves
  // *into* the surface under your thumb.
  const press = useSharedValue(0);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy }}
      onPress={run}
      disabled={inactive}
      onPressIn={() => {
        if (!reduced) press.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        if (!reduced) press.value = withTiming(0, { duration: 120 });
      }}
      style={[styles.button(variant, size, !!inactive && !busy, !!fullWidth), pressStyle, style]}
    >
      <View style={[styles.inner, busy && styles.hidden]} accessibilityElementsHidden={busy} importantForAccessibility={busy ? 'no-hide-descendants' : 'auto'}>
        {icon}
        <Txt center variant={size === 'lg' ? 'bodyLg' : size === 'sm' ? 'small' : 'body'} weight="semibold" style={styles.label(variant, !!inactive && !busy, onDark)}>
          {label}
        </Txt>
      </View>
      {busy ? <ActivityIndicator pointerEvents="none" accessible={false} style={styles.indicator} size="small" color={indicatorColor} /> : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: (variant: ButtonVariant, size: ButtonSize, disabled: boolean, fullWidth: boolean) => ({
    minHeight: { sm: theme.scale(44), md: theme.scale(46), lg: theme.scale(52) }[size],
    paddingVertical: theme.spacing[2],
    paddingHorizontal: { sm: theme.scale(14), md: theme.spacing[5], lg: theme.scale(28) }[size],
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    backgroundColor: disabled ? theme.palette.ink06 : {
      primary: theme.action.primary,
      secondary: theme.palette.ink06,
      ghost: 'transparent',
      dark: theme.surface.dark,
    }[variant],
    opacity: 1,
  }),
  hidden: { opacity: 0 },
  indicator: { position: 'absolute', alignSelf: 'center' },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    maxWidth: '100%',
  },
  label: (variant: ButtonVariant, disabled: boolean, onDark: boolean) => ({
    flexShrink: 1,
    color: disabled ? theme.text.secondary : {
      primary: theme.action.onPrimary,
      secondary: theme.text.primary,
      ghost: onDark ? theme.text.inverse : theme.text.primary,
      dark: theme.text.inverse,
    }[variant],
  }),
}));
