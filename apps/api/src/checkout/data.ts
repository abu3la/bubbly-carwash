import type { Env } from '../env';
import { db } from '../db';
import { getInvoice, invoiceMatches } from '../moyasar';
import { membershipWeeklySchedule } from '../membershipSchedule';
import type { CheckoutPage } from './page';

export interface CheckoutPayment {
  id: string; profile_id: string; booking_id: string | null; membership_id: string | null;
  amount_minor: number; state: string; created_at: string; provider_ref: string;
}
export async function checkoutData(env: Env, invoiceId: string, language: 'ar' | 'en') {
  const [payment] = await db<CheckoutPayment>(env,
    `payments?provider=eq.moyasar&provider_ref=eq.${invoiceId}&select=id,profile_id,booking_id,membership_id,amount_minor,state,created_at,provider_ref`);
  if (!payment) return null;
  const ar = language === 'ar';
  const name = (r: { name_ar: string; name_en: string }) => ar ? r.name_ar : r.name_en;
  const time = (date: string) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Riyadh' }).format(new Date(date));
  const date = (value: string) => new Intl.DateTimeFormat(ar ? 'ar-SA-u-ca-gregory' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh' }).format(new Date(value));
  let cancelled = false;
  let confirmed = false;
  const page: CheckoutPage = {
    language, mode: payment.membership_id ? 'membership' : 'booking', title: '', description: '',
    amount: payment.amount_minor, lines: [], schedule: [], reference: '', status: 'form',
  };
  if (payment.booking_id) {
    const [booking] = await db<{
      ref: string; status: string; payment_confirmed: boolean; scheduled_at: string; ends_at: string;
      services: { name_ar: string; name_en: string }; vehicles: { make: string; model: string; color: string };
      addresses: { line: string }; booking_add_ons: Array<{ add_on_key: string; price_minor: number }>;
    }>(env, `bookings?id=eq.${payment.booking_id}&profile_id=eq.${payment.profile_id}&select=ref,status,payment_confirmed,scheduled_at,ends_at,services(name_ar,name_en),vehicles(make,model,color),addresses(line),booking_add_ons(add_on_key,price_minor)`);
    if (!booking) return null;
    cancelled = booking.status === 'cancelled'; confirmed = booking.payment_confirmed;
    page.title = name(booking.services); page.reference = booking.ref;
    page.vehicle = [booking.vehicles.make, booking.vehicles.model, booking.vehicles.color].filter(Boolean).join(' · ');
    page.address = booking.addresses.line;
    page.schedule = [{ label: date(booking.scheduled_at), time: `${time(booking.scheduled_at)}–${time(booking.ends_at)}` }];
    const additions = booking.booking_add_ons;
    const names = additions.length ? await db<{ key: string; name_ar: string; name_en: string }>(env, 'add_ons?select=key,name_ar,name_en') : [];
    page.lines = [
      { label: page.title, amount: payment.amount_minor - additions.reduce((sum, a) => sum + a.price_minor, 0) },
      ...additions.map((a) => ({ label: names.find((n) => n.key === a.add_on_key) ? name(names.find((n) => n.key === a.add_on_key)!) : (ar ? 'إضافة' : 'Add-on'), amount: a.price_minor })),
    ];
  } else if (payment.membership_id) {
    const [membership] = await db<{
      state: string; payment_confirmed: boolean; cycle_end: string;
      plans: { name_ar: string; name_en: string; weekly: number };
    }>(env, `memberships?id=eq.${payment.membership_id}&profile_id=eq.${payment.profile_id}&select=state,payment_confirmed,cycle_end,plans(name_ar,name_en,weekly)`);
    if (!membership) return null;
    cancelled = membership.state === 'cancelled'; confirmed = membership.payment_confirmed;
    page.title = name(membership.plans);
    page.description = ar ? `${membership.plans.weekly === 2 ? 'غسلتان' : `${membership.plans.weekly} غسلات`} أسبوعيًا` : `${membership.plans.weekly} washes per week`;
    page.lines = [{ label: page.title, amount: payment.amount_minor }];
    page.reference = payment.membership_id.slice(0, 8).toUpperCase();
    const slots = await db<{ slot_start: string; vehicles: { make: string; model: string }; addresses: { line: string } }>(env,
      `membership_signup_slots?membership_id=eq.${payment.membership_id}&select=slot_start,vehicles(make,model),addresses(line)&order=slot_start`);
    if (slots[0]) { page.vehicle = `${slots[0].vehicles.make} ${slots[0].vehicles.model}`; page.address = slots[0].addresses.line; }
    page.schedule = membershipWeeklySchedule(slots).map((s) => ({
      label: new Intl.DateTimeFormat(ar ? 'ar-SA' : 'en-GB', { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 4 + s.weekday))), time: s.time,
    }));
    page.renewal = { date: date(membership.cycle_end), amount: payment.amount_minor };
  } else return null;
  const invoice = await getInvoice(env, invoiceId);
  const paid = invoiceMatches(invoice, {
    amount: payment.amount_minor, profileId: payment.profile_id,
    ...(payment.booking_id ? { bookingId: payment.booking_id } : { membershipId: payment.membership_id! }),
  });
  if (paid && confirmed && payment.state !== 'refunded') page.status = 'paid';
  else if (cancelled || payment.state === 'refunded' || ['expired', 'canceled'].includes(invoice.status)) page.status = 'unavailable';
  else if (paid) page.status = 'pending';
  else if (Date.parse(payment.created_at) + 15 * 60_000 <= Date.now()) page.status = 'unavailable';
  return { page, payment, invoice, paid };
}
