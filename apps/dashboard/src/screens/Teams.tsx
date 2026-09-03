import { useEffect, useState } from 'react';
import { admin, type AdminBooking, type Team } from '../api';

/** Pilot team coverage: one active team, with the others staged for launch. */
export function Teams() {
  const [rows, setRows] = useState<Team[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  const load = () =>
    Promise.all([admin.teams(), admin.bookings()])
      .then(([teamData, bookingData]) => { setRows(teamData.teams); setBookings(bookingData.bookings); })
      .catch(() => setErr('تعذّر تحميل الفرق وغسلاتها.'));

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
                  <div className="row-detail">{team.members.length} سائقين</div>
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
      <div className="team-jobs">
        {rows.map((team) => {
          const jobs = bookings.filter((booking) => booking.teams?.id === team.id && booking.status !== 'cancelled');
          return (
            <section className="sheet" key={`${team.id}-jobs`}>
              <div className="team-jobs-head">
                <div>
                  <h2>{team.name_ar}</h2>
                  <p className="note">{team.active ? 'نشط الآن' : 'غير نشط'} · {jobs.length} غسلات مسجلة</p>
                  <p className="team-roster">
                    {team.members.length
                      ? team.members.map((member) => `${member.profiles.full_name}${member.is_lead ? ' (قائد)' : ''} · ${member.shift_start.slice(0, 5)}-${member.shift_end.slice(0, 5)}${member.available ? '' : ' · غير متاح'}`).join('، ')
                      : 'لا يوجد سائقون مرتبطون بهذا الفريق.'}
                  </p>
                </div>
                <strong className="num">{jobs.filter((job) => job.status === 'scheduled' || job.status === 'active').length}/{team.daily_capacity}</strong>
              </div>
              {jobs.length === 0 ? <p className="empty">لا توجد غسلات لهذا الفريق.</p> : (
                <table>
                  <thead><tr><th>الموعد</th><th>العميل</th><th>السيارة</th><th>الموقع</th><th>الحالة</th></tr></thead>
                  <tbody>{jobs.slice(0, 30).map((job) => (
                    <tr key={job.id}>
                      <td className="num">{new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' }).format(new Date(job.scheduled_at))}</td>
                      <td><div className="headline">{job.profiles?.full_name || 'عميل'}</div><div className="note num">{job.profiles?.phone || 'لا يوجد رقم'}</div></td>
                      <td>{job.vehicles.make} {job.vehicles.model}<div className="note num">{job.vehicles.plate}</div></td>
                      <td>{job.addresses.line}<div className="note">{job.addresses.district}</div></td>
                      <td>{job.status === 'scheduled' ? 'مجدول' : job.status === 'active' ? 'جارٍ' : 'مكتمل'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </section>
          );
        })}
      </div>
      {err ? <p className="err" style={{ marginTop: 14 }}>{err}</p> : null}
    </>
  );
}
