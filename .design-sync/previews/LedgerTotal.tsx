import { LedgerRow, LedgerTotal } from '@bubbly/ui-web';

/** LedgerTotal closes a ledger — always shown after its rows. */
export const ClosingALedger = () => (
  <div style={{ maxWidth: 360 }}>
    <LedgerRow label="Shine package — Sedan" amount="$32.00" />
    <LedgerRow label="Service fee" amount="$4.00" muted />
    <LedgerTotal amount="$36.00" />
  </div>
);

export const CustomLabel = () => (
  <div style={{ maxWidth: 360 }}>
    <LedgerRow label="Week of Aug 3–9 · 14 washes" amount="$412.00" />
    <LedgerTotal label="Payout" amount="$412.00" />
  </div>
);
