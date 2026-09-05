import { Fragment, useEffect, useState } from 'react';
import { admin, sar, type AdminBooking } from '../api';

const STATUS_AR: Record<string, string> = {
  scheduled: 'مجدول', active: 'جارٍ', done: 'مكتمل', cancelled: 'ملغى', missed: 'فات الموعد',
};
const SOURCE_AR: Record<string, string> = {
  club: 'باقة شهرية', package: 'باقة', cash: 'دفع مباشر',
};
const STAGE_AR: Record<string, string> = {
  booked: 'محجوز', arrived: 'وصل الفريق', washed: 'اكتمل الغسيل', verified: 'تم التوثيق',
};
const formatRiyadh = (value: string) => new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh',
}).format(new Date(value));

/** Every customer's bookings — which is the point of a back office. */
export function Bookings() {
  const [rows, setRows] = useState<AdminBooking[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [refundId, setRefundId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refunding, setRefunding] = useState(false);

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
                <th>العميل</th>
                <th>السيارة</th>
                <th>الموقع</th>
                <th>الفريق</th>
                <th>السائق</th>
                <th>التوثيق</th>
                <th>الدفع</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>المرحلة</th>
                <th>الاسترجاع</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <Fragment key={b.id}>
                <tr className={b.status === 'cancelled' ? 'off' : ''}>
                  <td className="headline num">{b.ref}</td>
                  <td className="num">{formatRiyadh(b.scheduled_at)}</td>
                  <td>
                    <div className="headline">{b.profiles?.full_name || 'عميل'}</div>
                    <div className="note num">{b.profiles?.phone || 'لا يوجد رقم'}</div>
                  </td>
                  <td>
                    <div>{b.vehicles.make} {b.vehicles.model}</div>
                    <div className="note">{b.vehicles.color} · <span className="num">{b.vehicles.plate}</span></div>
                  </td>
                  <td>
                    <div>{b.addresses.line}</div>
                    <div className="note">{[b.addresses.district, b.addresses.city].filter(Boolean).join('، ')}</div>
                  </td>
                  <td>{b.teams?.name_ar ?? 'لم يُسند'}</td>
                  <td>{b.technician?.full_name ?? <span className="warn">بانتظار الإسناد</span>}</td>
                  <td className="note">
                    {(() => {
                      const media = b.booking_media ?? [];
                      const before = media.filter((item) => item.phase === 'before').length;
                      const after = media.filter((item) => item.phase === 'after').length;
                      return media.length ? <button className="ghost" onClick={() => setOpen(open === b.id ? null : b.id)}>قبل {before} · بعد {after}</button> : 'لا يوجد';
                    })()}
                  </td>
                  <td>{SOURCE_AR[b.source] ?? b.source}</td>
                  <td className="num">{sar(b.total_minor)}</td>
                  <td>{STATUS_AR[b.status] ?? b.status}</td>
                  <td className="note">{STAGE_AR[b.stage] ?? b.stage}</td>
                  <td>{(() => {
                    const payment = b.payments?.find((item) => item.state === 'paid');
                    return payment ? <button className="ghost danger-text" onClick={() => { setRefundId(refundId === b.id ? null : b.id); setRefundReason(''); }}>استرجاع</button> : <span className="note">{b.payments?.some((item) => item.state === 'refunded') ? 'مُسترجع' : '—'}</span>;
                  })()}</td>
                </tr>
                {open === b.id ? <tr className="media-row"><td colSpan={13}><MediaPanel booking={b} /></td></tr> : null}
                {refundId === b.id ? <tr className="refund-row"><td colSpan={13}><div className="refund-form">
                  <div><strong>استرجاع كامل عبر Moyasar</strong><p>سيُلغى الحجز ويصل إشعار للعميل. اكتب سببًا واضحًا في سجل العملية.</p></div>
                  <input type="text" value={refundReason} onChange={(event) => setRefundReason(event.target.value)} placeholder="سبب الاسترجاع" />
                  <button className="danger-button" disabled={refunding || refundReason.trim().length < 4} onClick={async () => {
                    const payment = b.payments.find((item) => item.state === 'paid');
                    if (!payment) return;
                    setRefunding(true); setErr(null);
                    try {
                      await admin.refundPayment(payment.id, refundReason.trim());
                      setRefundId(null); setRefundReason('');
                      setRows((await admin.bookings()).bookings);
                    } catch { setErr('فشل الاسترجاع. لم تتغير حالة الحجز؛ راجع مركز التشغيل وسجل Moyasar.'); }
                    finally { setRefunding(false); }
                  }}>{refunding ? 'جارٍ الاسترجاع…' : 'تأكيد الاسترجاع'}</button>
                  <button className="ghost" disabled={refunding} onClick={() => setRefundId(null)}>تراجع</button>
                </div></td></tr> : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {err ? <p className="err" style={{ marginTop: 14 }}>{err}</p> : null}
    </>
  );
}

function MediaPanel({ booking }: { booking: AdminBooking }) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    const created: string[] = [];
    Promise.all((booking.booking_media ?? []).map(async (item) => {
      const blob = await admin.mediaBlob(booking.id, item.id);
      const url = URL.createObjectURL(blob);
      created.push(url);
      return [item.id, url] as const;
    })).then((pairs) => { if (alive) setUrls(Object.fromEntries(pairs)); }).catch(() => { if (alive) setError(true); });
    return () => { alive = false; created.forEach((url) => URL.revokeObjectURL(url)); };
  }, [booking]);

  if (error) return <p className="err">تعذّر فتح التوثيق.</p>;
  return <div className="media-gallery">{booking.booking_media.map((item) => <figure key={item.id}>
    {urls[item.id] ? item.kind === 'video'
      ? <video src={urls[item.id]} controls preload="metadata" />
      : <img src={urls[item.id]} alt={`${item.phase === 'before' ? 'قبل' : 'بعد'} الغسيل - ${item.angle}`} />
      : <div className="media-loading">جارٍ التحميل…</div>}
    <figcaption>{item.phase === 'before' ? 'قبل الغسيل' : 'بعد الغسيل'} · {item.kind === 'video' ? 'فيديو 360°' : 'صورة'}</figcaption>
  </figure>)}</div>;
}
