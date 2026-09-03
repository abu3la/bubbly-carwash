import { useEffect, useState } from 'react';
import { admin, type Incident, type OperationsSnapshot } from '../api';

const CATEGORY: Record<string, string> = {
  customer_absent: 'العميل غير موجود', access: 'تعذّر الوصول', vehicle: 'مشكلة في السيارة',
  safety: 'سلامة', equipment: 'المعدات', other: 'أخرى',
};

export function Operations() {
  const [snapshot, setSnapshot] = useState<OperationsSnapshot | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      const [next, incidentData] = await Promise.all([admin.operations(), admin.incidents()]);
      setSnapshot(next); setIncidents(incidentData.incidents); setError(null);
    } catch { setError('تعذّر تحميل صحة التشغيل.'); }
  };
  useEffect(() => { void load(); }, []);

  return <>
    <div className="page-head"><h1>مركز التشغيل</h1><p>المشكلات التي تحتاج تدخلًا، وحالة الخدمات التي يعتمد عليها التشغيل اليومي.</p></div>
    {snapshot ? <div className="metric-grid">
      <Metric value={snapshot.unassignedBookings} label="حجوزات بلا سائق" alert={snapshot.unassignedBookings > 0} />
      <Metric value={snapshot.staleActiveBookings} label="غسلات متأخرة" alert={snapshot.staleActiveBookings > 0} />
      <Metric value={snapshot.openIncidents} label="بلاغات مفتوحة" alert={snapshot.openIncidents > 0} />
      <Metric value={snapshot.failedPayments} label="مدفوعات فاشلة" alert={snapshot.failedPayments > 0} />
      <Metric value={snapshot.invalidPushTokens} label="أجهزة إشعار غير صالحة" alert={snapshot.invalidPushTokens > 0} />
    </div> : <p className="note">جارٍ فحص الخدمات…</p>}
    {snapshot ? <div className="service-strip">
      <Service name="Firebase" state={snapshot.firebaseConfigured ? 'متصل' : 'يحتاج إعداد'} ok={snapshot.firebaseConfigured} />
      <Service name="SMS" state={snapshot.smsMode === 'taqnyat' ? 'تشغيل حقيقي' : snapshot.smsMode === 'development-code' ? 'رمز التطوير 1111' : 'غير متصل'} ok={snapshot.smsMode === 'taqnyat'} />
      <Service name="Moyasar" state={snapshot.paymentMode === 'live' ? 'Live' : snapshot.paymentMode === 'test' ? 'Test' : 'غير متصل'} ok={snapshot.paymentMode === 'live'} />
    </div> : null}

    <section className="sheet incidents">
      <div className="section-head"><h2>بلاغات السائقين</h2><button className="ghost" onClick={() => void load()}>تحديث</button></div>
      {incidents.length === 0 ? <p className="empty">لا توجد بلاغات.</p> : <table><thead><tr><th>الحجز</th><th>السائق</th><th>النوع</th><th>التفاصيل</th><th>الحالة</th></tr></thead><tbody>{incidents.map((incident) => <tr key={incident.id} className={incident.status === 'resolved' ? 'off' : ''}>
        <td className="headline num">{incident.bookings.ref}</td><td>{incident.profiles.full_name}<div className="note num">{incident.profiles.phone}</div></td><td>{CATEGORY[incident.category] ?? incident.category}</td><td>{incident.note}</td><td>{incident.status === 'open' ? <button disabled={busy === incident.id} onClick={async () => { setBusy(incident.id); try { await admin.resolveIncident(incident.id); await load(); } finally { setBusy(null); } }}>تمت المعالجة</button> : 'مغلق'}</td>
      </tr>)}</tbody></table>}
    </section>
    {error ? <p className="err" role="alert">{error}</p> : null}
  </>;
}

function Metric({ value, label, alert }: { value: number; label: string; alert: boolean }) {
  return <div className={alert ? 'metric alert' : 'metric'}><strong className="num">{value}</strong><span>{label}</span></div>;
}
function Service({ name, state, ok }: { name: string; state: string; ok: boolean }) {
  return <div><strong>{name}</strong><span className={ok ? 'ok' : 'warn'}>{state}</span></div>;
}
