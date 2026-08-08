import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { color, radius, space } from '@bubbly/design-tokens';

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.surfaceSunken,
    padding: space.md,
    gap: space.sm,
  },
});
