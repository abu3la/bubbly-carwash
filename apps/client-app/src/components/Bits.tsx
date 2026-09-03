import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { Num, Reveal, Txt } from '@sama/ui-native';

/** The one small tracked-out label in the system, above a group. */
export function SectionLabel({ children }: { children: string }) {
  return (
    <Txt variant="label" weight="bold" tone="muted" style={styles.sectionLabel}>
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
      <View style={styles.tickDisc}>
        <Check size={theme.scale(11)} strokeWidth={3} color={theme.action.primary} />
      </View>
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
  tickDisc: {
    width: theme.scale(20),
    height: theme.scale(20),
    borderRadius: theme.radius.pill,
    backgroundColor: theme.action.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tickText: { flex: 1 },
}));
