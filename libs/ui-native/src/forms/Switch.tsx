import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { useLocale } from '../theme/locale';

const TRACK_W = 44;
const KNOB = 20;
const INSET = 3;
const TRAVEL = TRACK_W - KNOB - INSET * 2;

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

/** A labelled switch — the row it sits in says what it controls. */
export function Switch({ checked, onChange, label }: SwitchProps) {
  const { theme } = useUnistyles();
  const { isRTL } = useLocale();
  const reduced = useReducedMotion();
  const ms = reduced ? 0 : theme.duration.base;

  // Everything the worklets read is resolved here, on the JS thread. `theme.scale`
  // is a plain function, and calling it inside `useAnimatedStyle` throws
  // "tried to synchronously call a non-worklet function on the UI thread".
  const on = theme.action.primary;
  const off = theme.border.strong;
  // Transforms are never mirrored for RTL, so the travel direction is signed by
  // hand: the knob rests on the start edge and moves toward the end edge.
  const travel = theme.scale(TRAVEL) * (isRTL ? -1 : 1);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(checked ? on : off, { duration: ms }),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(checked ? travel : 0, { duration: ms }) }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      hitSlop={theme.spacing[2]}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  track: {
    width: theme.scale(TRACK_W),
    height: theme.scale(26),
    borderRadius: theme.radius.pill,
    padding: theme.scale(INSET),
    justifyContent: 'center',
  },
  // Anchored at the start edge and travelling forward from there.
  knob: {
    width: theme.scale(KNOB),
    height: theme.scale(KNOB),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.white,
    boxShadow: '0 1px 3px rgba(23,22,46,0.25)',
  },
}));
