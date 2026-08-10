import { LedgerRow, LedgerTotal } from '@bubbly/ui-web';

export const PaymentSummary = () => (
  <div style={{ maxWidth: 360 }}>
    <LedgerRow label="Shine package — SUV" amount="$42.00" />
    <LedgerRow label="Interior add-on" amount="$15.00" />
    <LedgerRow label="Service fee" amount="$4.00" muted />
    <LedgerTotal amount="$61.00" />
  </div>
);

export const SingleItem = () => (
  <div style={{ maxWidth: 360 }}>
    <LedgerRow label="Rinse package — Sedan" amount="$24.00" />
    <LedgerRow label="Service fee" amount="$4.00" muted />
    <LedgerTotal amount="$28.00" />
  </div>
);
