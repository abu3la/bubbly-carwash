import { useEffect, useState } from 'react';
import { admin, type Team } from '../api';

/** Pilot team coverage: one active team, with the others staged for launch. */
export function Teams() {
  const [rows, setRows] = useState<Team[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const load = () =>
    admin.teams().then((d) => setRows(d.teams)).catch(() => setErr('تعذّر تحميل الفرق.'));

  useEffect(() => { load(); }, []);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setErr(null);
    setSaved(null);
    try {
      await admin.updateTeam(id, body);
      setSaved(id);
      await load();
    } catch {
      setErr('لم يُحفظ التغيير.');
      await load();
    }
  };

  if (!rows) return <p className="note">{err ?? 'جارٍ التحميل…'}</p>;

  return (
    <>
      <div className="page-head">
        <h1>فرق التشغيل</h1>
        <p>إحداثيات الفريق تحدّد المواعيد التي تظهر للعميل. يعمل فريق واحد فقط في التجربة.</p>
      </div>

      <div className="ops-summary" aria-label="ملخص التشغيل">
        <strong>{rows.filter((team) => team.active).length}</strong>
        <span>فريق نشط من أصل {rows.length}</span>
        <span>الحد اليومي للفريق النشط: 40 حجزًا</span>
      </div>

      <div className="sheet">
        <table>
          <thead>
            <tr>
              <th>الفريق</th>
              <th>خط العرض</th>
              <th>خط الطول</th>
              <th>نطاق الخدمة (كم)</th>
              <th>السعة اليومية</th>
              <th>التشغيل</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((team) => (
              <tr key={team.id} className={team.active ? '' : 'off'}>
                <td>
                  <div className="headline">{team.name_ar}</div>
                  <div className="note num">{team.id}</div>
                </td>
                {([
                  ['lat', team.lat],
                  ['lng', team.lng],
                  ['serviceRadiusKm', team.service_radius_km],
                  ['dailyCapacity', team.daily_capacity],
                ] as const).map(([field, value]) => (
                  <td key={field}>
                    <input
                      type="number"
                      step={field === 'dailyCapacity' ? 1 : 0.0001}
                      defaultValue={value}
                      onBlur={(event) => {
                        const next = Number(event.target.value);
                        if (Number.isFinite(next) && next !== value) patch(team.id, { [field]: next });
                      }}
                    />
                  </td>
                ))}
                <td>
                  <button className={team.active ? 'state active' : 'state'} onClick={() => patch(team.id, { active: !team.active })}>
                    {team.active ? 'نشط الآن' : 'تفعيل هذا الفريق'}
                  </button>
                  {saved === team.id ? <span className="saved">تم الحفظ</span> : null}
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
