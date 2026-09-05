import { Card, StatusBadge, LedgerRow, LedgerTotal } from '@bubbles/ui-web';

export const BookingCard = () => (
  <Card style={{ maxWidth: 380 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
      <strong>Shine package — SUV</strong>
      <StatusBadge status="en_route" />
    </div>
    <div style={{ color: 'var(--bb-ink-soft)', fontSize: 'var(--bb-font-body)' }}>
      Today 14:00–15:00 · 12 Marina Walk
    </div>
  </Card>
);

export const CardWithLedger = () => (
  <Card style={{ maxWidth: 380 }}>
    <LedgerRow label="Detail package — Pickup" amount="$68.00" />
    <LedgerRow label="Service fee" amount="$4.00" muted />
    <LedgerTotal amount="$72.00" />
  </Card>
);
