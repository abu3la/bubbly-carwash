import { useEffect, useState } from 'react';
import { admin, type Package } from '../api';

/**
 * The packages a customer can buy.
 *
 * Edits save on blur rather than behind a Save button. A price list is a small
 * number of small numbers, and a form that has to be submitted invites the
 * half-finished state where the screen and the database disagree.
 */
export function Packages() {
  const [rows, setRows] = useState<Package[] | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = () => admin.packages().then((d) => setRows(d.packages)).catch(() => setErr('تعذّر تحميل الباقات.'));
  useEffect(() => { load(); }, []);

  const patch = async (id: number, body: Record<string, unknown>) => {
    setErr(null);
    try {
      await admin.updatePackage(id, body);
      // Reload rather than patching locally: setting `best` clears it from the
      // other rows server-side, and only a reload shows that truthfully.
      await load();
      setSaved(id);
      setTimeout(() => setSaved((s) => (s === id ? null : s)), 1600);
    } catch {
      setErr('لم يُحفظ التغيير.');
      load();
    }
  };

  if (err && !rows) return <p className="err">{err}</p>;
  if (!rows) return <p className="note">جارٍ التحميل…</p>;

  return (
    <>
      <div className="page-head">
        <h1>الباقات</h1>
        <p>ما يشتريه العميل مقدّمًا. التعديل يُحفظ مباشرة ويظهر في التطبيق فورًا.</p>
      </div>

      <div className="sheet">
        <table>
          <thead>
            <tr>
              <th>الباقة</th>
              <th>السعر (ر.س)</th>
              <th>سعر الغسلة</th>
              <th>التوفير %</th>
              <th>الصلاحية (يوم)</th>
              <th>الأكثر توفيرًا</th>
              <th>الحالة</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className={p.active ? '' : 'off'}>
                <td className="headline">{p.washes} غسلات</td>
                <td>
                  <input
                    type="number"
                    defaultValue={(p.price_minor / 100).toFixed(0)}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v && v * 100 !== p.price_minor) patch(p.id, { priceSar: v });
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.5"
                    defaultValue={(p.per_minor / 100).toFixed(1)}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v && Math.round(v * 100) !== p.per_minor) patch(p.id, { perSar: v });
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={p.save_pct}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== p.save_pct) patch(p.id, { savePct: v });
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={p.valid_days}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v && v !== p.valid_days) patch(p.id, { validDays: v });
                    }}
                  />
                </td>
                <td>
                  {/* Only one package may carry the badge, so this is a choice
                      between rows rather than a switch on each. */}
                  {p.best ? (
                    <span className="badge">الأكثر توفيرًا</span>
                  ) : (
                    <button className="ghost" onClick={() => patch(p.id, { best: true })}>
                      اجعلها الأبرز
                    </button>
                  )}
                </td>
                <td>
                  <span className={p.active ? 'badge quiet' : 'badge quiet'}>
                    {p.active ? 'معروضة' : 'مخفية'}
                  </span>
                </td>
                <td>
                  <div className="row">
                    <button className="ghost" onClick={() => patch(p.id, { active: !p.active })}>
                      {p.active ? 'إخفاء' : 'إظهار'}
                    </button>
                    {saved === p.id ? <span className="ok">حُفظ</span> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {err ? <p className="err" style={{ marginTop: 14 }}>{err}</p> : null}
      <p className="note" style={{ marginTop: 14 }}>
        الأسعار بالهللات في قاعدة البيانات وتُعرض هنا بالريال. تغيير السعر لا يمسّ باقات اشتراها العملاء بالفعل.
      </p>
    </>
  );
}
