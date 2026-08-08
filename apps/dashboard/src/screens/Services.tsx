import { useServices } from '@bubbly/api-client';
import { PageHeading } from '@bubbly/ui-web';
import { formatDuration, formatMoney } from '@bubbly/utils';

export function Services() {
  const services = useServices();

  if (services.isPending) return <p className="state-note">Loading services…</p>;
  if (services.isError) {
    return <p className="state-note">Can't reach the API — is `pnpm --filter @bubbly/api dev` running?</p>;
  }

  return (
    <>
      <header>
        <PageHeading title="Services" meta="Wash packages offered to clients" />
      </header>
      <table className="data">
        <thead>
          <tr>
            <th>Package</th>
            <th>Duration</th>
            <th className="num">Price</th>
          </tr>
        </thead>
        <tbody>
          {services.data.map((s) => (
            <tr key={s.id}>
              <td>
                <div className="cell-main">{s.name}</div>
                <div className="cell-sub">{s.description}</div>
              </td>
              <td>{formatDuration(s.durationMinutes)}</td>
              <td className="num">{formatMoney(s.priceMinor, s.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
