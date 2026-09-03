import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { clearSession, loadSession, type Session } from './auth';

interface AuthSessionValue {
  loading: boolean;
  session: Session | null;
  signedIn: (session: Session) => void;
  signOut: () => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let live = true;
    loadSession().then((value) => {
      if (live) {
        setSession(value);
        setLoading(false);
      }
    });
    return () => { live = false; };
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthSessionValue>(() => ({
    loading,
    session,
    signedIn: setSession,
    signOut,
  }), [loading, session, signOut]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const value = useContext(AuthSessionContext);
  if (!value) throw new Error('useAuthSession must be inside AuthSessionProvider');
  return value;
}
