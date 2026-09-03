import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Txt } from '../primitives/Text';

interface RadioProps {
  label?: string;
  selected: boolean;
  onPress: () => void;
}

export function Radio({ label, selected, onPress }: RadioProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.row}
    >
      {/* Selected state is a thick violet ring that closes to a dot — one
          element, so nothing can sit off-centre inside it. */}
      <View style={styles.dot(selected)} />
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
  dot: (selected: boolean) => ({
    width: theme.scale(22),
    height: theme.scale(22),
    borderRadius: theme.radius.pill,
    borderWidth: selected ? theme.scale(7) : theme.border.width,
    borderColor: selected ? theme.action.primary : theme.border.strong,
    backgroundColor: theme.surface.card,
  }),
  label: { flex: 1 },
}));
