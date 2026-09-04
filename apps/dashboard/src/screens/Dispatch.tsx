import { useEffect, useMemo, useState } from 'react';
import { admin, type AdminBooking } from '../api';

const format = (value: string) => new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh',
}).format(new Date(value));

export function Dispatch() {
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const bookingData = await admin.bookings();
      setBookings(bookingData.bookings);
      setError(null);
    } catch { setError('تعذّر تحميل لوحة التوزيع.'); }
  };
  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => (bookings ?? [])
    .filter((booking) => booking.status === 'scheduled' || booking.status === 'active')
    .sort((a, b) => Number(Boolean(a.technician)) - Number(Boolean(b.technician)) || Date.parse(a.scheduled_at) - Date.parse(b.scheduled_at)), [bookings]);

  return (
    <>
      <div className="page-head"><h1>توزيع الحجوزات</h1><p>يختار النظام الفريق تلقائيًا حسب الموقع والسعة. أعضاء الفريق يرون المهمة ويستلمها أحدهم من تطبيق السائق.</p></div>
      <div className="dispatch-summary"><strong>{rows.filter((row) => !row.technician).length}</strong><span>مهام بانتظار استلام أحد أعضاء الفريق</span></div>
      <div className="sheet">
        {!bookings ? <p className="empty">جارٍ التحميل…</p> : rows.length === 0 ? <p className="empty">لا توجد حجوزات تشغيلية الآن.</p> : <table>
          <thead><tr><th>الحجز</th><th>الموعد</th><th>الفريق التلقائي</th><th>العميل والسيارة</th><th>منفذ المهمة</th><th>الحالة</th></tr></thead>
          <tbody>{rows.map((booking) => <tr key={booking.id}>
              <td className="headline num">{booking.ref}</td>
              <td className="num">{format(booking.scheduled_at)}</td>
              <td>{booking.teams?.name_ar ?? 'غير محدد'}</td>
              <td><div>{booking.profiles?.full_name || 'عميل'} · {booking.vehicles.make} {booking.vehicles.model}</div><div className="note num">{booking.vehicles.plate}</div></td>
              <td>{booking.technician?.full_name ?? <span className="note">يستلمها أحد أعضاء الفريق</span>}</td>
              <td>{booking.technician ? <span className="ok">استلمها السائق</span> : <span className="note">متاحة لأعضاء الفريق</span>}</td>
            </tr>)}</tbody>
        </table>}
      </div>
      {error ? <p className="err" role="alert">{error}</p> : null}
    </>
  );
}
