import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { loadSession, signOut as clear, type Session } from './api';

interface Api {
  session: Session | null;
  /** False until the stored session has been read from disk. */
  ready: boolean;
  setSession: (s: Session) => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<Api | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  // Reading storage is async, so there is a moment where we do not yet know
  // whether anyone is signed in. Routing on that unknown state would flash the
  // sign-in screen at someone who is already signed in.
  useEffect(() => {
    loadSession().then((s) => {
      setSession(s);
      setReady(true);
    });
  }, []);

  const signOut = useCallback(async () => {
    await clear();
    setSession(null);
  }, []);

  return <Ctx.Provider value={{ session, ready, setSession, signOut }}>{children}</Ctx.Provider>;
}

export function useSession(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSession must be used inside <SessionProvider>');
  return v;
}
