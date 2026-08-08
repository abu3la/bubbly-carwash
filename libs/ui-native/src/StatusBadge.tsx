import { StyleSheet, Text, View } from 'react-native';
import type { BookingStatus } from '@bubbly/types';
import { color, fontSize, radius, statusColor } from '@bubbly/design-tokens';

const LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  en_route: 'En route',
  washing: 'Washing',
  done: 'Done',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <View style={[styles.badge, { backgroundColor: statusColor[status] }]}>
      <Text style={styles.label}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  label: { color: color.surface, fontSize: fontSize.caption, fontWeight: '600' },
});
