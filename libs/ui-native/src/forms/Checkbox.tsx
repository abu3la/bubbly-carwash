import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, withTiming } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Txt } from '../primitives/Text';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  const { theme } = useUnistyles();
  const reduced = useReducedMotion();

  const markStyle = useAnimatedStyle(() => ({
    opacity: withTiming(checked ? 1 : 0, { duration: reduced ? 0 : theme.duration.fast }),
    transform: [{ scale: withTiming(checked ? 1 : 0.6, { duration: reduced ? 0 : theme.duration.fast }) }],
  }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={styles.box(checked)}>
        <Animated.View style={markStyle}>
          <Check size={theme.scale(14)} strokeWidth={3} color={theme.action.onPrimary} />
        </Animated.View>
      </View>
      {label ? (
        <Txt variant="body" style={styles.label}>
          {label}
        </Txt>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] + 2, minHeight: theme.layout.hitTarget },
  box: (checked: boolean) => ({
    width: theme.scale(22),
    height: theme.scale(22),
    borderRadius: theme.scale(7),
    borderCurve: 'continuous',
    borderWidth: theme.border.width,
    borderColor: checked ? theme.action.primary : theme.border.strong,
    backgroundColor: checked ? theme.action.primary : theme.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  label: { flex: 1 },
}));
