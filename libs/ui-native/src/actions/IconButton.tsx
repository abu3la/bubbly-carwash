import { useButtonAction } from './useButtonAction';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { ButtonSize, ButtonVariant } from './Button';

interface IconButtonProps {
  /** Accessible name — the button shows only an icon, so this is required. */
  label: string;
  children: ReactNode;
  onPress?: () => unknown;
  /** For work managed outside the press handler. Returned promises load automatically. */
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function IconButton({
  label,
  children,
  onPress,
  variant = 'secondary',
  size = 'md',
  disabled,
  loading = false,
  style,
}: IconButtonProps) {
  const { theme } = useUnistyles();
  const { busy, inactive, run } = useButtonAction(onPress, disabled, loading);
  const indicatorColor = { primary: theme.action.onPrimary, secondary: theme.text.primary, ghost: theme.text.primary, dark: theme.text.inverse }[variant];
  const reduced = useReducedMotion();
  const press = useSharedValue(0);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ translateY: press.value }] }));

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
      style={[styles.button(variant, size, !!inactive && !busy), pressStyle, style]}
    >
      {busy ? <ActivityIndicator accessible={false} size="small" color={indicatorColor} /> : children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: (variant: ButtonVariant, size: ButtonSize, disabled: boolean) => {
    const side = { sm: theme.scale(44), md: theme.scale(44), lg: theme.scale(52) }[size];
    return {
      width: side,
      height: side,
      borderRadius: theme.radius.md,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: {
        primary: theme.action.primary,
        secondary: theme.palette.ink06,
        ghost: 'transparent',
        dark: theme.surface.dark,
      }[variant],
      opacity: disabled ? 0.45 : 1,
    };
  },
}));
