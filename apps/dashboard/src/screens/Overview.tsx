import { useBookings } from '@bubbly/api-client';
import { PageHeading, Stat, Card } from '@bubbly/ui-web';
import { formatMoney } from '@bubbly/utils';

export function Overview() {
  const bookings = useBookings();

  if (bookings.isPending) return <p className="state-note">Loading bookings…</p>;
  if (bookings.isError) {
    return <p className="state-note">Can't reach the API — is `pnpm --filter @bubbly/api dev` running?</p>;
  }

  const all = bookings.data;
  const open = all.filter((b) => !['done', 'cancelled'].includes(b.status));
  const done = all.filter((b) => b.status === 'done');
  const revenueMinor = done.reduce((sum, b) => sum + b.priceMinor, 0);
  const currency = all[0]?.currency ?? 'SAR';

  return (
    <>
      <header>
        <PageHeading title="Overview" meta="Today across the fleet" />
      </header>
      <div className="stat-row">
        <Card>
          <Stat value={String(open.length)} label="Open bookings" />
        </Card>
        <Card>
          <Stat value={String(done.length)} label="Completed washes" />
        </Card>
        <Card>
          <Stat value={formatMoney(revenueMinor, currency)} label="Revenue, completed" />
        </Card>
      </div>
    </>
  );
}
