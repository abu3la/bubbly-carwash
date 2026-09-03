import { useEffect, useMemo, useState } from 'react';
import { admin, type AdminBooking, type Technician } from '../api';

const format = (value: string) => new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh',
}).format(new Date(value));

export function Dispatch() {
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [drivers, setDrivers] = useState<Technician[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [bookingData, driverData] = await Promise.all([admin.bookings(), admin.technicians()]);
      setBookings(bookingData.bookings);
      setDrivers(driverData.technicians);
      setError(null);
    } catch { setError('تعذّر تحميل لوحة التوزيع.'); }
  };
  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => (bookings ?? [])
    .filter((booking) => booking.status === 'scheduled' || booking.status === 'active')
    .sort((a, b) => Number(Boolean(a.technician)) - Number(Boolean(b.technician)) || Date.parse(a.scheduled_at) - Date.parse(b.scheduled_at)), [bookings]);

  const candidates = (booking: AdminBooking) => drivers.filter((driver) => {
    const member = driver.team_members[0];
    return !driver.pending && driver.active && member?.active && member.available && member.team_id === booking.teams?.id;
  });

  const assign = async (bookingId: string, technicianId: string | null) => {
    setBusy(bookingId); setError(null);
    try {
      await admin.assignBooking(bookingId, technicianId);
      await load();
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      setError(code === 'technicianBusy' ? 'السائق لديه مهمة متعارضة.' : code === 'outsideDriverShift' ? 'الموعد خارج مناوبة السائق.' : 'لم يتم إسناد الحجز.');
    } finally { setBusy(null); }
  };

  return (
    <>
      <div className="page-head"><h1>توزيع الحجوزات</h1><p>يختار النظام الفريق تلقائيًا حسب الموقع والسعة. أعضاء الفريق يرون المهمة ويستلمها أحدهم من تطبيق السائق.</p></div>
      <div className="dispatch-summary"><strong>{rows.filter((row) => !row.technician).length}</strong><span>مهام بانتظار استلام أحد أعضاء الفريق</span></div>
      <div className="sheet">
        {!bookings ? <p className="empty">جارٍ التحميل…</p> : rows.length === 0 ? <p className="empty">لا توجد حجوزات تشغيلية الآن.</p> : <table>
          <thead><tr><th>الحجز</th><th>الموعد</th><th>الفريق التلقائي</th><th>العميل والسيارة</th><th>منفذ المهمة</th><th>الحالة</th></tr></thead>
          <tbody>{rows.map((booking) => {
            const available = candidates(booking);
            return <tr key={booking.id}>
              <td className="headline num">{booking.ref}</td>
              <td className="num">{format(booking.scheduled_at)}</td>
              <td>{booking.teams?.name_ar ?? 'غير محدد'}</td>
              <td><div>{booking.profiles?.full_name || 'عميل'} · {booking.vehicles.make} {booking.vehicles.model}</div><div className="note num">{booking.vehicles.plate}</div></td>
              <td><select aria-label={`سائق ${booking.ref}`} value={booking.technician?.id ?? ''} disabled={busy === booking.id} onChange={(event) => void assign(booking.id, event.target.value || null)}>
                <option value="">غير مسند</option>
                {available.map((driver) => <option key={driver.id} value={driver.id}>{driver.full_name}</option>)}
                {booking.technician && !available.some((driver) => driver.id === booking.technician?.id) ? <option value={booking.technician.id}>{booking.technician.full_name} - غير متاح</option> : null}
              </select></td>
              <td>{booking.technician ? <span className="ok">استلمها السائق</span> : <span className="note">متاحة لأعضاء الفريق</span>}</td>
            </tr>;
          })}</tbody>
        </table>}
      </div>
      {error ? <p className="err" role="alert">{error}</p> : null}
    </>
  );
}
