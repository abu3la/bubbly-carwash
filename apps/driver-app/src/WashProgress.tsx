import { View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { Txt } from '@bubbles/ui-native';
import type { Stage } from './api';

const steps = ['الوصول', 'الغسيل', 'الجودة'];
const done: Record<Stage, number> = { booked: 0, arrived: 1, washed: 2, verified: 3 };

/** This is the customer's real three-stage record, readable without motion. */
export function WashProgress({ stage }: { stage: Stage }) {
  return <View accessibilityRole="progressbar" accessibilityLabel="تقدم المهمة" accessibilityValue={{ min: 0, max: 3, now: done[stage] }} style={styles.row}>
    {steps.map((label, index) => <Step key={label} label={label} completed={index < done[stage]} current={index === done[stage]} />)}
  </View>;
}

function Step({ label, completed, current }: { label: string; completed: boolean; current: boolean }) {
  const reduced = useReducedMotion();
  const progress = useAnimatedStyle(() => ({ width: withTiming(completed ? '100%' : '0%', { duration: reduced ? 0 : 280 }) }));
  return <View style={styles.step}>
    <View style={styles.track}><Animated.View style={[styles.fill, progress]} /></View>
    <Txt variant="small" weight={completed || current ? 'bold' : 'regular'} tone={completed || current ? 'primary' : 'secondary'} center>{label}</Txt>
    <Txt variant="caption" tone="secondary" center>{completed ? 'مكتمل' : current ? 'الخطوة التالية' : 'لاحقًا'}</Txt>
  </View>;
}

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: 'row', gap: theme.spacing[3], paddingVertical: theme.spacing[2] },
  step: { flex: 1, gap: theme.spacing[1] },
  track: { height: theme.scale(6), borderRadius: theme.radius.pill, backgroundColor: theme.palette.ink16, marginBottom: theme.spacing[2] },
  fill: { height: '100%', borderRadius: theme.radius.pill, backgroundColor: theme.action.primary },
}));
