import type { BookingStatus } from '@sama/types';

const LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  en_route: 'En route',
  washing: 'Washing',
  done: 'Done',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  // CSS variable (not the JS statusColor map) so night grounds get the
  // lightened status set automatically.
  const varName = `--bb-status-${status.replace('_', '-')}`;
  return (
    <span className="bb-status" style={{ background: `var(${varName})` }}>
      {LABELS[status]}
    </span>
  );
}
