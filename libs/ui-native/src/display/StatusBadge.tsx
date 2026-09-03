import { View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { BeatKey } from '@sama/design-tokens';
import { Txt } from '../primitives/Text';

/**
 * Fixed bilingual copy for the three-beat pipeline. There is no fourth status —
 * the handoff is explicit, and inventing one would break the whole model.
 */
const COPY: Record<BeatKey, [en: string, ar: string]> = {
  arrived: ['ARRIVED', 'وصل'],
  washed: ['WASHED', 'الغسيل'],
  verified: ['VERIFIED', 'تأكد'],
};

interface StatusBadgeProps {
  status?: BeatKey;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

/** A stamped seal. The only component allowed to colour a status. */
export function StatusBadge({ status = 'arrived', size = 'md', style }: StatusBadgeProps) {
  const [en, ar] = COPY[status];
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={ar}
      style={[styles.seal(status, size), style]}
    >
      <Txt variant="label" weight="bold" center style={styles.en(status, size)}>
        {en}
      </Txt>
      <Txt variant="label" weight="semibold" center style={styles.ar(status)}>
        {ar}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  // Both labels are centred by the circle itself, on both axes, so the stack
  // cannot drift off-centre at any copy length.
  seal: (status: BeatKey, size: 'sm' | 'md') => {
    const side = size === 'md' ? theme.scale(72) : theme.scale(56);
    return {
      width: side,
      height: side,
      borderRadius: theme.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      backgroundColor: theme.beat[status],
    };
  },
  en: (status: BeatKey, size: 'sm' | 'md') => ({
    color: theme.onBeat[status],
    fontSize: size === 'md' ? theme.scale(10) : theme.scale(8.5),
    lineHeight: size === 'md' ? theme.scale(12) : theme.scale(10),
    letterSpacing: theme.scale(10) * 0.06,
  }),
  ar: (status: BeatKey) => ({
    color: theme.onBeat[status],
    fontSize: theme.scale(10),
    lineHeight: theme.scale(13),
    letterSpacing: 0,
  }),
}));
