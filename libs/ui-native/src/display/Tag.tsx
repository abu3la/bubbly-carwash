import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Txt } from '../primitives/Text';

interface TagProps {
  children: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** A choosable chip: day, address label, language. Selected = filled violet. */
export function Tag({ children, selected, onPress, style }: TagProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[styles.tag(!!selected), style]}
    >
      <Txt variant="small" weight="medium" style={styles.label(!!selected)}>
        {children}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  tag: (selected: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: theme.scale(34),
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radius.pill,
    borderCurve: 'continuous',
    backgroundColor: selected ? theme.action.primary : theme.surface.card,
    boxShadow: selected ? undefined : `inset 0 0 0 ${theme.border.width}px ${theme.border.subtle}`,
  }),
  label: (selected: boolean) => ({
    color: selected ? theme.action.onPrimary : theme.text.primary,
  }),
}));
