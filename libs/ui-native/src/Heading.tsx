import { StyleSheet, Text, View } from 'react-native';
import { color, fontSize } from '@bubbly/design-tokens';

export function Heading({ title, meta }: { title: string; meta?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  title: { fontSize: fontSize.title, fontWeight: '700', color: color.ink, letterSpacing: -0.3 },
  meta: { fontSize: fontSize.body, color: color.inkSoft },
});
