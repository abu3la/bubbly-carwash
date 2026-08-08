import { useBookings } from '@bubbly/api-client';
import { PageHeading, StatusBadge } from '@bubbly/ui-web';

/**
 * There is no drivers endpoint yet; this derives the roster from booking
 * assignments so the screen stays honest about what the API knows.
 */
export function Drivers() {
  const bookings = useBookings();

  if (bookings.isPending) return <p className="state-note">Loading…</p>;
  if (bookings.isError) {
    return <p className="state-note">Can't reach the API — is `pnpm --filter @bubbly/api dev` running?</p>;
  }

  const byDriver = new Map<string, typeof bookings.data>();
  for (const b of bookings.data) {
    if (!b.driverId) continue;
    byDriver.set(b.driverId, [...(byDriver.get(b.driverId) ?? []), b]);
  }

  return (
    <>
      <header>
        <PageHeading title="Drivers" meta="Derived from booking assignments" />
      </header>
      {byDriver.size === 0 ? (
        <p className="state-note">No bookings are assigned to a driver yet.</p>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Driver</th>
              <th className="num">Jobs</th>
              <th>Latest job status</th>
            </tr>
          </thead>
          <tbody>
            {[...byDriver.entries()].map(([driverId, jobs]) => (
              <tr key={driverId}>
                <td className="cell-main">{driverId}</td>
                <td className="num">{jobs.length}</td>
                <td>
                  <StatusBadge status={jobs[jobs.length - 1].status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
