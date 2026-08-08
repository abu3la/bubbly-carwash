import type { BookingStatus } from '@bubbly/types';
import { statusColor } from '@bubbly/design-tokens';

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
    <span className="bb-status" style={{ background: statusColor[status] }}>
      {LABELS[status]}
    </span>
  );
}
