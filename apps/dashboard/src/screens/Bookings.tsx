import { useEffect, useState } from 'react';
import { admin, sar } from '../api';

const STATUS_AR: Record<string, string> = {
  scheduled: 'مجدول', active: 'جارٍ', done: 'مكتمل', cancelled: 'ملغى',
};
const SOURCE_AR: Record<string, string> = {
  club: 'النادي', package: 'باقة', cash: 'دفع مباشر',
};

/** Every customer's bookings — which is the point of a back office. */
export function Bookings() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    admin.bookings().then((d) => setRows(d.bookings)).catch(() => setErr('تعذّر تحميل الحجوزات.'));
  }, []);

  if (!rows) return <p className="note">{err ?? 'جارٍ التحميل…'}</p>;

  return (
    <>
      <div className="page-head">
        <h1>الحجوزات</h1>
        <p>{rows.length} حجزًا، الأحدث أولًا.</p>
      </div>

      <div className="sheet">
        {rows.length === 0 ? (
          <p className="empty">لا حجوزات بعد.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>المرجع</th>
                <th>الموعد</th>
                <th>الخدمة</th>
                <th>الدفع</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>المرحلة</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className={b.status === 'cancelled' ? 'off' : ''}>
                  <td className="headline num">{b.ref}</td>
                  <td className="num">{String(b.scheduled_at).slice(0, 16).replace('T', ' ')}</td>
                  <td>{b.service_key === 'exterior' ? 'خارجية' : 'كاملة'}</td>
                  <td>{SOURCE_AR[b.source] ?? b.source}</td>
                  <td className="num">{sar(b.total_minor)}</td>
                  <td>{STATUS_AR[b.status] ?? b.status}</td>
                  <td className="note">{b.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {err ? <p className="err" style={{ marginTop: 14 }}>{err}</p> : null}
    </>
  );
}
