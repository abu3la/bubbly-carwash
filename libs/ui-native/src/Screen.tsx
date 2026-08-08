import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { color, space } from '@bubbly/design-tokens';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  if (!scroll) return <View style={styles.root}>{children}</View>;
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.foam },
  content: { padding: space.md, gap: space.md },
});
