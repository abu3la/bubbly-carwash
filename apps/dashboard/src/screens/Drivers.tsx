import { useEffect, useState } from 'react';
import { admin, type Team, type Technician } from '../api';

const emptyForm = { name: '', phone: '', teamId: '' };

export function Drivers() {
  const [drivers, setDrivers] = useState<Technician[] | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [driverData, teamData] = await Promise.all([admin.technicians(), admin.teams()]);
      setDrivers(driverData.technicians);
      setTeams(teamData.teams);
      setError(null);
    } catch {
      setError('تعذّر تحميل السائقين.');
    }
  };
  useEffect(() => { void load(); }, []);

  const create = async () => {
    const digits = form.phone.replace(/\D/g, '');
    const phone = digits.startsWith('966') ? `+${digits}` : `+966${digits}`;
    setBusy('create'); setError(null);
    try {
      await admin.createTechnician(phone, form.name.trim(), form.teamId);
      setForm(emptyForm);
      await load();
    } catch {
      setError('لم نتمكن من إضافة السائق. تحقق من الرقم أو من وجود الحساب مسبقًا.');
    } finally { setBusy(null); }
  };

  const changeTeam = async (driver: Technician, teamId: string) => {
    setBusy(driver.id); setError(null);
    try {
      await admin.setTechnicianTeam(driver.id, teamId ? { teamId } : { teamId: null });
      await load();
    } catch { setError('لم يُحفظ الفريق.'); }
    finally { setBusy(null); }
  };

  const updateMember = async (driver: Technician, patch: Record<string, boolean | string>) => {
    const member = driver.team_members[0];
    if (!member) return;
    setBusy(driver.id); setError(null);
    try {
      await admin.setTechnicianTeam(driver.id, {
        teamId: member.team_id,
        available: typeof patch.available === 'boolean' ? patch.available : member.available,
        isLead: typeof patch.isLead === 'boolean' ? patch.isLead : member.is_lead,
        shiftStart: typeof patch.shiftStart === 'string' ? patch.shiftStart : member.shift_start.slice(0, 5),
        shiftEnd: typeof patch.shiftEnd === 'string' ? patch.shiftEnd : member.shift_end.slice(0, 5),
      });
      await load();
    } catch { setError('لم تُحفظ المناوبة. تأكد أن وقت النهاية بعد البداية.'); }
    finally { setBusy(null); }
  };

  return (
    <>
      <div className="page-head">
        <h1>السائقون والمناوبات</h1>
        <p>أنشئ حساب السائق، اربطه بفريق، ثم حدّد جاهزيته وساعات عمله.</p>
      </div>

      <section className="create-driver" aria-label="إضافة سائق">
        <input type="text" placeholder="اسم السائق" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <div className="phone-field"><span>+966</span><input type="tel" dir="ltr" placeholder="5X XXX XXXX" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
        <select aria-label="فريق السائق" value={form.teamId} onChange={(event) => setForm({ ...form, teamId: event.target.value })}>
          <option value="">اختر الفريق</option>
          {teams.map((team) => <option key={team.id} value={team.id}>{team.name_ar}{team.active ? '' : ' - غير نشط'}</option>)}
        </select>
        <button disabled={busy === 'create' || !form.name.trim() || form.phone.replace(/\D/g, '').length < 9 || !form.teamId} onClick={() => void create()}>
          {busy === 'create' ? 'جارٍ الإضافة…' : 'إضافة سائق'}
        </button>
      </section>

      <div className="sheet">
        {!drivers ? <p className="empty">جارٍ تحميل السائقين…</p> : drivers.length === 0 ? <p className="empty">لا يوجد سائقون بعد.</p> : (
          <table>
            <thead><tr><th>السائق</th><th>الفريق</th><th>المناوبة</th><th>الدور</th><th>الجاهزية</th><th>الحساب</th></tr></thead>
            <tbody>{drivers.map((driver) => {
              const member = driver.team_members[0];
              return (
                <tr key={driver.id} className={driver.active ? '' : 'off'}>
                  <td><div className="headline">{driver.full_name || 'بلا اسم'}</div><div className="note num">{driver.phone}</div>{driver.pending ? <div className="pending-copy">بانتظار أول تسجيل دخول</div> : null}</td>
                  <td>
                    <select value={member?.team_id ?? ''} disabled={busy === driver.id || driver.pending} onChange={(event) => void changeTeam(driver, event.target.value)}>
                      <option value="">غير مرتبط</option>
                      {teams.map((team) => <option key={team.id} value={team.id}>{team.name_ar}{team.active ? '' : ' - غير نشط'}</option>)}
                    </select>
                  </td>
                  <td>{member ? <div className="shift-fields">
                    <input aria-label="بداية المناوبة" type="time" disabled={driver.pending} defaultValue={member.shift_start.slice(0, 5)} onBlur={(event) => void updateMember(driver, { shiftStart: event.target.value })} />
                    <span>إلى</span>
                    <input aria-label="نهاية المناوبة" type="time" disabled={driver.pending} defaultValue={member.shift_end.slice(0, 5)} onBlur={(event) => void updateMember(driver, { shiftEnd: event.target.value })} />
                  </div> : <span className="note">اختر فريقًا أولًا</span>}</td>
                  <td>{member ? <button className="state" disabled={busy === driver.id || driver.pending} onClick={() => void updateMember(driver, { isLead: !member.is_lead })}>{member.is_lead ? 'قائد الفريق' : 'عضو'}</button> : '—'}</td>
                  <td>{member ? <button className={member.available ? 'state active' : 'state'} disabled={busy === driver.id || driver.pending} onClick={() => void updateMember(driver, { available: !member.available })}>{member.available ? 'متاح' : 'غير متاح'}</button> : '—'}</td>
                  <td>{driver.pending ? <span className="note">يتفعّل عند الدخول</span> : <button className="ghost" disabled={busy === driver.id} onClick={async () => { setBusy(driver.id); try { await admin.updateTechnician(driver.id, { active: !driver.active }); await load(); } catch { setError('لم تُحفظ حالة الحساب.'); } finally { setBusy(null); } }}>{driver.active ? 'تعطيل' : 'تفعيل'}</button>}</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>
      {error ? <p className="err" role="alert">{error}</p> : null}
    </>
  );
}
