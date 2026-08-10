import type { ReactNode } from 'react';

interface LedgerRowProps {
  label: ReactNode;
  amount: ReactNode;
  /** Fees and secondary lines read softer than items. */
  muted?: boolean;
}

/** One line of the typographic payment summary. No boxes — spacing and a
 * shared right edge carry the structure. */
export function LedgerRow({ label, amount, muted = false }: LedgerRowProps) {
  return (
    <div className={muted ? 'bb-ledger-row bb-ledger-row--muted' : 'bb-ledger-row'}>
      <span>{label}</span>
      <span className="bb-ledger-amount">{amount}</span>
    </div>
  );
}

export function LedgerTotal({ label = 'Total', amount }: { label?: ReactNode; amount: ReactNode }) {
  return (
    <div className="bb-ledger-row bb-ledger-total">
      <span>{label}</span>
      <span className="bb-ledger-amount">{amount}</span>
    </div>
  );
}
