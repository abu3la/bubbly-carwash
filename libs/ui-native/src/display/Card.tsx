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
  /** Surface hierarchy: booking uses ice; ordinary content stays on white. */
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
      accessibilityState={selected === undefined ? undefined : { selected }}
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
    boxShadow: selected ? `inset 0 0 0 2px ${theme.action.primary}` : undefined,
  }),
}));
