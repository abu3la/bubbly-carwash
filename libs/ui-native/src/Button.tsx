import { Pressable, StyleSheet, Text } from 'react-native';
import { color, fontSize, radius } from '@bubbly/design-tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'quiet';
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.quiet,
        pressed && (primary ? styles.primaryPressed : styles.quietPressed),
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.label, primary ? styles.labelPrimary : styles.labelQuiet]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  primary: { backgroundColor: color.aquaDeep },
  primaryPressed: { backgroundColor: color.aqua },
  quiet: { backgroundColor: 'transparent' },
  quietPressed: { backgroundColor: color.surfaceSunken },
  disabled: { opacity: 0.55 },
  label: { fontSize: fontSize.body, fontWeight: '600' },
  labelPrimary: { color: color.surface },
  labelQuiet: { color: color.aquaDeep },
});
