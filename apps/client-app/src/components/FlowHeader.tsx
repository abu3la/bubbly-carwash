import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, withSpring } from 'react-native-reanimated';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { IconButton, Num, Txt, useLocale } from '@sama/ui-native';
import { useCopy } from '../i18n';

interface FlowHeaderProps {
  title: string;
  /** 1-based position in the flow. Omit for single-screen flows. */
  step?: number;
  steps?: number;
  onBack?: () => void;
}

/**
 * The header every purchase flow shares. The progress rail grows toward the
 * current step rather than redrawing, so moving through a flow reads as one
 * continuous advance instead of a series of unrelated screens.
 */
export function FlowHeader({ title, step, steps, onBack }: FlowHeaderProps) {
  const { theme } = useUnistyles();
  const router = useRouter();
  const reduced = useReducedMotion();
  const copy = useCopy();
  const { isRTL } = useLocale();

  const progress = steps && step ? Math.min(1, step / steps) : 0;
  const rail = useAnimatedStyle(() => ({
    width: reduced
      ? `${progress * 100}%`
      : withSpring(`${progress * 100}%`, { damping: 20, stiffness: 180, mass: 0.9 }),
  }));

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <IconButton label={copy.common.back} variant="ghost" size="md" onPress={onBack ?? (() => router.back())}>
          {isRTL ? (
            <ArrowRight size={theme.scale(22)} color={theme.text.primary} strokeWidth={2} />
          ) : (
            <ArrowLeft size={theme.scale(22)} color={theme.text.primary} strokeWidth={2} />
          )}
        </IconButton>

        <Txt variant="heading" weight="bold" numberOfLines={1} style={styles.title}>
          {title}
        </Txt>

        {/* The counter is a Latin run: as plain Arabic text "1 / 3" reorders
            into "3 / 1", so it goes through Num. */}
        {step && steps ? (
          <Num variant="caption" tone="muted">
            {step} / {steps}
          </Num>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      {step && steps ? (
        <View style={styles.track}>
          <Animated.View style={[styles.fill, rail]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[2], gap: theme.spacing[3] },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  title: { flex: 1 },
  spacer: { width: theme.scale(42) },
  track: {
    height: theme.scale(4),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.ink06,
    overflow: 'hidden',
  },
  // Rounded on both ends and driven by width, so the cap never changes shape
  // as the rail grows.
  fill: { height: '100%', borderRadius: theme.radius.pill, backgroundColor: theme.action.primary },
}));
