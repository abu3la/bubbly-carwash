import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { Txt } from '../primitives/Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  /** Primary is Electric Violet — the only action colour in the system. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon, 16-18px, inheriting the label's colour. */
  icon?: ReactNode;
  disabled?: boolean;
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
  fullWidth,
  style,
}: ButtonProps) {
  const reduced = useReducedMotion();
  // The design's press state is a 1px settle, not a lift — the button moves
  // *into* the surface under your thumb.
  const press = useSharedValue(0);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value }],
  }));

  const inactive = disabled || !onPress;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive }}
      onPress={onPress}
      disabled={inactive}
      onPressIn={() => {
        if (!reduced) press.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        if (!reduced) press.value = withTiming(0, { duration: 120 });
      }}
      style={[styles.button(variant, size, !!inactive, !!fullWidth), pressStyle, style]}
    >
      <View style={styles.inner}>
        {icon}
        <Txt variant={size === 'lg' ? 'bodyLg' : size === 'sm' ? 'small' : 'body'} weight="semibold" style={styles.label(variant)}>
          {label}
        </Txt>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: (variant: ButtonVariant, size: ButtonSize, disabled: boolean, fullWidth: boolean) => ({
    height: { sm: theme.scale(32), md: theme.scale(42), lg: theme.scale(52) }[size],
    paddingHorizontal: { sm: theme.scale(14), md: theme.spacing[5], lg: theme.scale(28) }[size],
    borderRadius: theme.radius.pill,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    backgroundColor: {
      primary: theme.action.primary,
      secondary: theme.surface.card,
      ghost: 'transparent',
      dark: theme.surface.dark,
    }[variant],
    // Secondary is drawn with an inset ring rather than a border so its height
    // matches the other variants to the pixel.
    boxShadow: variant === 'secondary' ? `inset 0 0 0 ${theme.border.width}px ${theme.border.strong}` : undefined,
    opacity: disabled ? 0.45 : 1,
  }),
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  label: (variant: ButtonVariant) => ({
    color: {
      primary: theme.action.onPrimary,
      secondary: theme.text.primary,
      ghost: theme.action.primary,
      dark: theme.text.inverse,
    }[variant],
  }),
}));
