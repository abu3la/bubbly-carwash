import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Num, Reveal, Txt } from '@bubbles/ui-native';

/** A readable heading for a related group. */
export function SectionLabel({ children }: { children: string }) {
  return (
    <Txt variant="body" weight="semibold" tone="primary" style={styles.sectionLabel}>
      {children}
    </Txt>
  );
}

/** A line in a payment ledger: label at the start, amount at the end. */
export function LedgerRow({
  label,
  amount,
  muted,
  strong,
}: {
  label: string;
  amount: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <View style={styles.ledgerRow}>
      <Txt
        variant={strong ? 'body' : 'small'}
        weight={strong ? 'bold' : 'regular'}
        tone={muted ? 'muted' : strong ? 'primary' : 'secondary'}
        style={styles.ledgerLabel}
      >
        {label}
      </Txt>
      <Num
        variant={strong ? 'bodyLg' : 'small'}
        weight={strong ? 'bold' : 'medium'}
        tone={muted ? 'muted' : 'primary'}
      >
        {amount}
      </Num>
    </View>
  );
}

/** A ticked inclusion line. */
export function TickRow({ children }: { children: string }) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.tickRow}>
      <Check size={18} strokeWidth={2} color={theme.text.secondary} />
      <Txt variant="small" style={styles.tickText}>
        {children}
      </Txt>
    </View>
  );
}

/** Staggers a list in as it mounts, resting visible (see `Reveal`). */
export function Stagger({
  index,
  children,
  style,
}: {
  index: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Reveal delay={index * 55} style={style}>
      {children}
    </Reveal>
  );
}

const styles = StyleSheet.create((theme) => ({
  sectionLabel: { marginBottom: theme.spacing[2] },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: theme.spacing[4],
  },
  // Holds the flexible half of the row so a long label wraps in its own column
  // instead of pushing the amount off its shared end edge.
  ledgerLabel: { flexShrink: 1 },
  tickRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[2] + 2 },
  tickText: { flex: 1 },
}));
