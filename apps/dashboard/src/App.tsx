import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth, token } from './api';

function Beats() {
  return (
    <span className="beats" aria-hidden>
      <span className="beat y" />
      <span className="beat g" />
      <span className="beat v" />
    </span>
  );
}

/**
 * Sign-in, using the same phone-and-code flow as the app.
 *
 * There is no separate admin login system: the Worker checks `profiles.role`,
 * so an administrator is a customer record with a different role rather than a
 * parallel identity to keep in sync.
 */
function Gate({ onIn }: { onIn: () => void }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const e164 = `+966${phone.replace(/\D/g, '')}`;

  const send = async () => {
    setErr(null); setBusy(true);
    try { await auth.requestOtp(e164); setSent(true); }
    catch { setErr('تعذّر إرسال الرمز. تأكد من الرقم.'); }
    finally { setBusy(false); }
  };

  const verify = async () => {
    setErr(null); setBusy(true);
    try {
      const r = await auth.verify(e164, code);
      token.set(r.accessToken);
      onIn();
    } catch { setErr('الرمز غير صحيح أو انتهت صلاحيته.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="gate">
      <div className="gate-card">
        <Beats />
        <h1>لوحة تحكم سما</h1>
        <p>{sent ? 'أدخل الرمز المرسل إلى جوالك.' : 'سجّل دخولك برقم جوالك.'}</p>

        {!sent ? (
          <>
            <div className="dial">
              <span>+966</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5X XXX XXXX"
                inputMode="tel"
              />
            </div>
            <button onClick={send} disabled={busy || phone.replace(/\D/g, '').length !== 9}>
              {busy ? 'جارٍ الإرسال…' : 'إرسال الرمز'}
            </button>
          </>
        ) : (
          <>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              inputMode="numeric"
            />
            <button onClick={verify} disabled={busy || code.length < 6}>
              {busy ? 'جارٍ التحقق…' : 'دخول'}
            </button>
            <button className="ghost" onClick={() => { setSent(false); setCode(''); }}>
              تغيير الرقم
            </button>
          </>
        )}

        {err ? <p className="err" style={{ marginTop: 12 }}>{err}</p> : null}
      </div>
    </div>
  );
}

export function App() {
  const [signedIn, setSignedIn] = useState(Boolean(token.get()));
  const navigate = useNavigate();

  if (!signedIn) return <Gate onIn={() => setSignedIn(true)} />;

  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand">
          <Beats />
          سما
        </div>
        <nav>
          <NavLink to="/" end>الباقات</NavLink>
          <NavLink to="/plans">اشتراكات النادي</NavLink>
          <NavLink to="/services">الخدمات</NavLink>
          <NavLink to="/bookings">الحجوزات</NavLink>
        </nav>
        <div className="foot">
          لوحة التشغيل
          <br />
          <button
            className="ghost"
            style={{ padding: 0, marginTop: 8 }}
            onClick={() => { token.clear(); setSignedIn(false); navigate('/'); }}
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
