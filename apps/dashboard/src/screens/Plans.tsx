import { useEffect, useState } from 'react';
import { admin, type Plan } from '../api';

/** Club plans: the monthly fee, and the limits that make the fee viable. */
export function Plans() {
  const [rows, setRows] = useState<Plan[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = () => admin.plans().then((d) => setRows(d.plans)).catch(() => setErr('تعذّر تحميل الاشتراكات.'));
  useEffect(() => { load(); }, []);

  const patch = async (id: string, body: Record<string, unknown>) => {
    try { await admin.updatePlan(id, body); await load(); }
    catch { setErr('لم يُحفظ التغيير.'); load(); }
  };

  if (!rows) return <p className="note">{err ?? 'جارٍ التحميل…'}</p>;

  return (
    <>
      <div className="page-head">
        <h1>اشتراكات النادي</h1>
        <p>الرسوم الشهرية وحدود الاستخدام. الحد الأسبوعي هو ما يحمي الربحية.</p>
      </div>

      <div className="sheet">
        <table>
          <thead>
            <tr>
              <th>الخطة</th>
              <th>الشهري (ر.س)</th>
              <th>غسلات الدورة</th>
              <th>الحد الأسبوعي</th>
              <th>الترحيل</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className={p.active ? '' : 'off'}>
                <td className="headline">{p.name_ar}</td>
                {([
                  ['priceSar', (p.price_minor / 100).toFixed(0)],
                  ['credits', String(p.credits)],
                  ['weekly', String(p.weekly)],
                  ['roll', String(p.roll)],
                ] as const).map(([field, value]) => (
                  <td key={field}>
                    <input
                      type="number"
                      defaultValue={value}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (String(v) !== value) patch(p.id, { [field]: v });
                      }}
                    />
                  </td>
                ))}
                <td>
                  <button className="ghost" onClick={() => patch(p.id, { active: !p.active })}>
                    {p.active ? 'إخفاء' : 'إظهار'}
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
