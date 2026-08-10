import { StatusBadge } from '@bubbly/ui-web';

export const AllStatuses = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <StatusBadge status="pending" />
    <StatusBadge status="assigned" />
    <StatusBadge status="en_route" />
    <StatusBadge status="washing" />
    <StatusBadge status="done" />
    <StatusBadge status="cancelled" />
  </div>
);

export const InContext = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
    <span>Booking #2481 — Ahmed's SUV</span>
    <StatusBadge status="washing" />
  </div>
);
