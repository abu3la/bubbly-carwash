import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import type { ButtonSize, ButtonVariant } from './Button';

interface IconButtonProps {
  /** Accessible name — the button shows only an icon, so this is required. */
  label: string;
  children: ReactNode;
  onPress?: () => void;
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
  style,
}: IconButtonProps) {
  const reduced = useReducedMotion();
  const press = useSharedValue(0);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ translateY: press.value }] }));
  const inactive = disabled || !onPress;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive }}
      onPress={onPress}
      disabled={inactive}
      onPressIn={() => {
        if (!reduced) press.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        if (!reduced) press.value = withTiming(0, { duration: 120 });
      }}
      style={[styles.button(variant, size, !!inactive), pressStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: (variant: ButtonVariant, size: ButtonSize, disabled: boolean) => {
    const side = { sm: theme.scale(44), md: theme.scale(44), lg: theme.scale(52) }[size];
    return {
      width: side,
      height: side,
      borderRadius: theme.radius.pill,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: {
        primary: theme.action.primary,
        secondary: theme.surface.card,
        ghost: 'transparent',
        dark: theme.surface.dark,
      }[variant],
      boxShadow:
        variant === 'secondary' ? `inset 0 0 0 ${theme.border.width}px ${theme.border.strong}` : undefined,
      opacity: disabled ? 0.45 : 1,
    };
  },
}));
