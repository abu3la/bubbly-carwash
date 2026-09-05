import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { admin, type AdminBooking, type Team } from '../api';

/** Team 1 starts active; each team can operate independently as coverage expands. */
export function Teams() {
  const [rows, setRows] = useState<Team[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () =>
    Promise.all([admin.teams(), admin.bookings()])
      .then(([teamData, bookingData]) => { setRows(teamData.teams); setBookings(bookingData.bookings); })
      .catch(() => setErr('تعذّر تحميل الفرق وغسلاتها.'));

  useEffect(() => { load(); }, []);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(id);
    setErr(null);
    setSaved(null);
    try {
      await admin.updateTeam(id, body);
      setSaved(id);
      await load();
    } catch {
      setErr('تعذّر حفظ التغيير. حاول مرة أخرى.');
    } finally {
      setBusy(null);
    }
  };

  if (!rows) return <div><p className="note">{err ?? 'جارٍ التحميل…'}</p>{err ? <button className="ghost" onClick={() => { setErr(null); void load(); }}>إعادة المحاولة</button> : null}</div>;

  return (
    <>
      <div className="page-head">
        <h1>فرق التشغيل</h1>
        <p>أدر فرق التشغيل وسعتها. أهلية العميل تعتمد على نطاق التغطية والبلوك ورقم الفيلا.</p>
        <p style={{ marginTop: 8 }}>يمكن تفعيل عدة فرق. إيقاف فريق يمنع الحجوزات الجديدة لبلوكاته ولا يلغي حجوزاته الحالية. <Link to="/coverage">إدارة البلوكات والفلل</Link></p>
      </div>

      <div className="ops-summary" aria-label="ملخص التشغيل">
        <strong>{rows.filter((team) => team.active).length}</strong>
        <span>فريق نشط من أصل {rows.length}</span>
        <span>السعة القصوى لكل فريق: 40 حجزًا يوميًا</span>
      </div>

      <div className="sheet teams-configuration">
        <table>
          <thead>
            <tr>
              <th>الفريق</th>
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
                  <div className="row-detail">عدد السائقين: {team.members.length}</div>
                </td>
                <td><TeamCapacity key={`${team.id}-${team.daily_capacity}`} team={team} busy={busy !== null} save={(capacity) => patch(team.id, { dailyCapacity: capacity })} /></td>
                <td>
                  <div className="note" style={{ marginBottom: 8 }}>{team.active ? 'نشط الآن' : 'متوقف'}</div>
                  <button className="ghost" disabled={busy !== null} onClick={() => void patch(team.id, { active: !team.active })}>
                    {busy === team.id ? 'جارٍ الحفظ…' : team.active ? 'إيقاف الفريق' : 'تفعيل الفريق'}
                  </button>
                  {saved === team.id ? <span className="saved" role="status">حُفظت التغييرات</span> : null}
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
                <strong>{jobs.filter((job) => job.status === 'scheduled' || job.status === 'active').length} مهام مفتوحة</strong>
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
                      <td>{job.status === 'scheduled' ? 'مجدول' : job.status === 'active' ? 'جارٍ' : job.status === 'missed' ? 'فات الموعد' : job.status === 'cancelled' ? 'ملغى' : 'مكتمل'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </section>
          );
        })}
      </div>
      {err ? <p className="err" role="alert" style={{ marginTop: 14 }}>{err}</p> : null}
    </>
  );
}

function TeamCapacity({ team, busy, save }: { team: Team; busy: boolean; save: (capacity: number) => Promise<void> }) {
  const [value, setValue] = useState(String(team.daily_capacity));
  const next = Number(value);
  const valid = Number.isInteger(next) && next >= 1 && next <= 40;
  return <form className="team-capacity" onSubmit={(event) => { event.preventDefault(); if (valid && next !== team.daily_capacity) void save(next); }}>
    <input type="number" step={1} min={1} max={40} required value={value} aria-label={`السعة اليومية لفريق ${team.name_ar}`} disabled={busy} onChange={(event) => setValue(event.target.value)} />
    <button className="ghost" type="submit" disabled={busy || !valid || next === team.daily_capacity}>حفظ السعة</button>
  </form>;
}
