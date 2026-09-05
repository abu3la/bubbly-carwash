import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import type { BeatKey } from '@bubbles/design-tokens';

const BEATS: BeatKey[] = ['arrived', 'washed', 'verified'];
const CYCLE = 1200;
const PEAK = 1.35;

interface BeatIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** The sequential pulse — the brand's loading and live-progress animation. */
  animate?: boolean;
  /** How many beats are lit, 0-3. Unlit dots stay grey. */
  active?: 0 | 1 | 2 | 3;
  style?: StyleProp<ViewStyle>;
}

/**
 * The brand mark: three dots that beat in sequence. It doubles as the loading
 * indicator and as the wash-pipeline progress read-out, so one gesture carries
 * both meanings.
 */
export function BeatIcon({ size = 'md', animate = false, active = 3, style }: BeatIconProps) {
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 3, now: active }} style={[styles.row, style]}>
      {BEATS.map((beat, i) => (
        <Dot key={beat} beat={beat} index={i} size={size} lit={i < active} animate={animate} />
      ))}
    </View>
  );
}

function Dot({
  beat,
  index,
  size,
  lit,
  animate,
}: {
  beat: BeatKey;
  index: number;
  size: 'sm' | 'md' | 'lg' | 'xl';
  lit: boolean;
  animate: boolean;
}) {
  const reduced = useReducedMotion();
  // Rests at full size, so a dot that never animates is still a correct dot.
  const scale = useSharedValue(1);
  const running = animate && !reduced;

  useEffect(() => {
    if (!running) {
      scale.value = withTiming(1, { duration: 120 });
      return;
    }
    // 0-30-60-100% of the cycle: rise, fall, hold — each dot 200ms behind the
    // one before it, so the pulse travels along the mark.
    scale.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(PEAK, { duration: CYCLE * 0.3 }),
          withTiming(1, { duration: CYCLE * 0.3 }),
          withTiming(1, { duration: CYCLE * 0.4 }),
        ),
        -1,
      ),
    );
  }, [running, index, scale]);

  const pulse = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return <Animated.View style={[styles.dot(beat, size, lit), pulse]} />;
}

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] + 2 },
  dot: (beat: BeatKey, size: 'sm' | 'md' | 'lg' | 'xl', lit: boolean) => {
    // xl carries a hero moment on its own — the success seal, where all
    // three beats are lit because the wash is finished.
    const side = { sm: theme.scale(9), md: theme.scale(14), lg: theme.scale(22), xl: theme.scale(34) }[size];
    return {
      width: side,
      height: side,
      borderRadius: theme.radius.pill,
      backgroundColor: lit ? theme.beat[beat] : theme.border.strong,
    };
  },
}));
