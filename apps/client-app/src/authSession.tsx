import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSession, loadSession, onSessionCleared, type Session } from './auth';

interface AuthSessionValue {
  loading: boolean;
  introSeen: boolean;
  finishIntro: () => void;
  session: Session | null;
  signedIn: (session: Session) => void;
  signOut: () => Promise<void>;
}

const INTRO_KEY = 'bubbles.introSeen';

const AuthSessionContext = createContext<AuthSessionValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const [introSeen, setIntroSeen] = useState(false);
  const finishIntro = useCallback(() => {
    setIntroSeen(true);
    void AsyncStorage.setItem(INTRO_KEY, '1').catch(() => undefined);
  }, []);

  useEffect(() => {
    let live = true;
    const unsubscribe = onSessionCleared(() => {
      if (live) setSession(null);
    });
    Promise.all([loadSession(), AsyncStorage.getItem(INTRO_KEY).catch(() => null)]).then(([value, seen]) => {
      if (live) {
        setSession(value);
        setIntroSeen(seen === '1' || !!value);
        if (value) finishIntro();
        setLoading(false);
      }
    });
    return () => { live = false; unsubscribe(); };
  }, [finishIntro]);

  const signOut = useCallback(async () => {
    finishIntro();
    await clearSession();
    setSession(null);
  }, [finishIntro]);

  const signedIn = useCallback((next: Session) => {
    finishIntro();
    setSession(next);
  }, [finishIntro]);

  const value = useMemo<AuthSessionValue>(() => ({
    loading,
    session,
    introSeen,
    finishIntro,
    signedIn,
    signOut,
  }), [loading, session, introSeen, finishIntro, signedIn, signOut]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const value = useContext(AuthSessionContext);
  if (!value) throw new Error('useAuthSession must be inside AuthSessionProvider');
  return value;
}
