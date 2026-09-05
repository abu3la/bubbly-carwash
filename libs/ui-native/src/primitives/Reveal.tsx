import { useEffect, type ComponentProps, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { easingPoints } from '@bubbles/design-tokens';

interface RevealProps {
  children: ReactNode;
  /**
   * Optional exit animation. Safe to gate on the animation engine: if it never
   * runs the view simply unmounts, which is where it was going anyway.
   */
  exiting?: ComponentProps<typeof Animated.View>['exiting'];
  /** Stagger position in a list. */
  delay?: number;
  /** How far the content travels on its way in. */
  distance?: number;
  style?: StyleProp<ViewStyle>;
}

const DURATION = 320;

/**
 * The app's entrance motion — and the only one content is allowed to use.
 *
 * It animates POSITION ONLY. Opacity is never touched, so there is no state in
 * which this wrapper can hide what it contains: if the animation engine is
 * unavailable, throttled, or the effect never fires, the content is on screen
 * and readable — at worst a few pixels from its final resting place.
 *
 * Reanimated's `entering` props do the opposite. They start at the hidden
 * frame, so a reveal that fails to fire leaves a blank section behind, and a
 * whole screen can render empty. Content is visible by default here, always.
 */
export function Reveal({ children, exiting, delay = 0, distance = 10, style }: RevealProps) {
  const reduced = useReducedMotion();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (reduced) {
      offset.value = 0;
      return;
    }
    offset.value = distance;
    offset.value = withDelay(
      delay,
      withTiming(0, {
        duration: DURATION,
        easing: Easing.bezier(easingPoints[0], easingPoints[1], easingPoints[2], easingPoints[3]),
      }),
    );
  }, [delay, distance, reduced, offset]);

  const motion = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));

  return (
    <Animated.View exiting={exiting} style={[style, motion]}>
      {children}
    </Animated.View>
  );
}
