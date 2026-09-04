import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { admin, auth, token } from './api';

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
    try { const result = await auth.requestOtp(e164); setCode(result.developmentCode ?? ''); setSent(true); }
    catch { setErr('تعذّر إرسال الرمز. تأكد من الرقم.'); }
    finally { setBusy(false); }
  };

  const verify = async () => {
    setErr(null); setBusy(true);
    try {
      const r = await auth.verify(e164, code);
      token.set(r);
      await admin.bookings();
      onIn();
    } catch { token.clear(); setErr('تعذّر الدخول. تأكد أن الحساب بصلاحية مدير وأن الرمز صحيح.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="gate">
      <div className="gate-card">
        <Beats />
        <h1>لوحة BubblesCarWash</h1>
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
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="1111"
              inputMode="numeric"
            />
            <button onClick={verify} disabled={busy || code.length < 4}>
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

  useEffect(() => {
    const expire = () => setSignedIn(false);
    window.addEventListener('bubbles:session-expired', expire);
    return () => window.removeEventListener('bubbles:session-expired', expire);
  }, []);

  if (!signedIn) return <Gate onIn={() => setSignedIn(true)} />;

  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand">
          <Beats />
          BubblesCarWash
        </div>
        <nav>
          <NavLink to="/" end>الحجوزات</NavLink>
          <NavLink to="/plans">اشتراكات النادي</NavLink>
          <NavLink to="/services">الخدمات</NavLink>
          <NavLink to="/dispatch">توزيع الحجوزات</NavLink>
          <NavLink to="/teams">فرق التشغيل</NavLink>
          <NavLink to="/drivers">السائقون</NavLink>
          <NavLink to="/operations">مركز التشغيل</NavLink>
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
