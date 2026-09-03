import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

export type CardVariant = 'default' | 'booking' | 'dark' | 'stack';

interface CardProps {
  children: ReactNode;
  /** booking = flat ice · dark = deep ink · stack = hard ice offset (promo). */
  variant?: CardVariant;
  onPress?: () => void;
  /** Draws the violet selection ring used by pickable cards. */
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ children, variant = 'default', onPress, selected, style }: CardProps) {
  const reduced = useReducedMotion();
  const press = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: press.value }] }));

  if (!onPress) return <View style={[styles.card(variant, !!selected), style]}>{children}</View>;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        // A card settles slightly inward under the thumb. It never lifts.
        if (!reduced) press.value = withTiming(0.985, { duration: 120 });
      }}
      onPressOut={() => {
        if (!reduced) press.value = withTiming(1, { duration: 120 });
      }}
      style={[styles.card(variant, !!selected), pressStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: (variant: CardVariant, selected: boolean) => ({
    backgroundColor: {
      default: theme.surface.card,
      booking: theme.surface.booking,
      dark: theme.surface.dark,
      stack: theme.surface.card,
    }[variant],
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    padding: theme.layout.cardPad,
    // A selected card is ringed, not glowing; the booking card is deliberately
    // flat, so tone alone separates it from the page.
    boxShadow: selected
      ? `0 0 0 2px ${theme.action.primary}`
      : {
          default: theme.shadow.card,
          booking: undefined,
          dark: theme.shadow.card,
          stack: theme.shadow.stackIce,
        }[variant],
  }),
}));
