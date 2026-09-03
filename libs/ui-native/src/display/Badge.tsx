import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Txt } from '../primitives/Text';

export type BadgeTone = 'violet' | 'guava' | 'yellow' | 'ice' | 'ink';

interface BadgeProps {
  children: string;
  tone?: BadgeTone;
  /** Small leading element (a dot, a 12px icon). */
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * A tinted micro-label. Reserved for genuinely contained facts — a count, an
 * availability note — never wrapped around every noun on a screen.
 */
export function Badge({ children, tone = 'violet', icon, style }: BadgeProps) {
  return (
    <View style={[styles.badge(tone), style]}>
      {icon}
      <Txt variant="caption" weight="semibold" style={styles.label(tone)}>
        {children}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  badge: (tone: BadgeTone) => ({
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing[1] + 2,
    height: theme.scale(24),
    paddingHorizontal: theme.spacing[2] + 2,
    borderRadius: theme.radius.pill,
    borderCurve: 'continuous',
    backgroundColor: {
      violet: theme.palette.violet100,
      guava: theme.palette.guava100,
      yellow: theme.palette.yellow100,
      ice: theme.palette.ice100,
      ink: theme.palette.ink,
    }[tone],
  }),
  label: (tone: BadgeTone) => ({
    color: {
      violet: theme.palette.violet,
      guava: theme.palette.guava600,
      yellow: theme.text.onTintYellow,
      ice: theme.text.onTintIce,
      ink: theme.text.inverse,
    }[tone],
  }),
}));
