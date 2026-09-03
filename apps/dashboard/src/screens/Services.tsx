import { useEffect, useState } from 'react';
import { admin, type Service } from '../api';

/** The washes themselves — price and how long a technician is booked for. */
export function Services() {
  const [rows, setRows] = useState<Service[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = () => admin.services().then((d) => setRows(d.services)).catch(() => setErr('تعذّر تحميل الخدمات.'));
  useEffect(() => { load(); }, []);

  const patch = async (key: string, body: Record<string, unknown>) => {
    try { await admin.updateService(key, body); await load(); }
    catch { setErr('لم يُحفظ التغيير.'); load(); }
  };

  if (!rows) return <p className="note">{err ?? 'جارٍ التحميل…'}</p>;

  return (
    <>
      <div className="page-head">
        <h1>الخدمات</h1>
        <p>المدة تحدّد متى ينتهي الموعد، وليست وصفًا فقط.</p>
      </div>

      <div className="sheet">
        <table>
          <thead>
            <tr>
              <th>الخدمة</th>
              <th>بالإنجليزية</th>
              <th>السعر (ر.س)</th>
              <th>المدة (دقيقة)</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.key} className={s.active ? '' : 'off'}>
                <td className="headline">{s.name_ar}</td>
                <td className="note">{s.name_en}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={(s.price_minor / 100).toFixed(0)}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v && v * 100 !== s.price_minor) patch(s.key, { priceSar: v });
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={s.minutes}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v && v !== s.minutes) patch(s.key, { minutes: v });
                    }}
                  />
                </td>
                <td>
                  <button className="ghost" onClick={() => patch(s.key, { active: !s.active })}>
                    {s.active ? 'إخفاء' : 'إظهار'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {err ? <p className="err" style={{ marginTop: 14 }}>{err}</p> : null}
    </>
  );
}
