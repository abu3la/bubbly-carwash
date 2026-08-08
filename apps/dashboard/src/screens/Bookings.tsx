import { useState } from 'react';
import { useBookings } from '@bubbly/api-client';
import { PageHeading, StatusBadge } from '@bubbly/ui-web';
import { formatMoney, formatSlot } from '@bubbly/utils';
import { BOOKING_STATUSES, type BookingStatus } from '@bubbly/types';

export function Bookings() {
  const [status, setStatus] = useState<BookingStatus | undefined>();
  const bookings = useBookings(status ? { status } : undefined);

  return (
    <>
      <header>
        <PageHeading title="Bookings" meta="Every wash, live from the API" />
      </header>

      <div className="filter-row" role="group" aria-label="Filter by status">
        <button className={status === undefined ? 'on' : ''} onClick={() => setStatus(undefined)}>
          All
        </button>
        {BOOKING_STATUSES.map((s) => (
          <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {bookings.isPending && <p className="state-note">Loading bookings…</p>}
      {bookings.isError && (
        <p className="state-note">Can't reach the API — is `pnpm --filter @bubbly/api dev` running?</p>
      )}
      {bookings.data && bookings.data.length === 0 && (
        <p className="state-note">No bookings match this filter.</p>
      )}
      {bookings.data && bookings.data.length > 0 && (
        <table className="data">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Where</th>
              <th>When</th>
              <th>Status</th>
              <th className="num">Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.data.map((b) => (
              <tr key={b.id}>
                <td>
                  <div className="cell-main">{b.id}</div>
                  <div className="cell-sub">driver: {b.driverId ?? 'unassigned'}</div>
                </td>
                <td>{b.address}</td>
                <td>{formatSlot(b.scheduledAt)}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td className="num">{formatMoney(b.priceMinor, b.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
