import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Language } from '@sama/ui-native';
import { DEFAULT_LANGUAGE, saveLanguage } from './language';

/** The wash itself is paid directly or by an active weekly membership. */
export type PaySource = 'club' | 'cash';

interface SessionValue {
  language: Language;
  setLanguage: (language: Language) => void;
  restoreLanguage: (language: Language) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

/**
 * Local state is deliberately limited to display preferences. Customer data,
 * balances, bookings and memberships all come from the authenticated API.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    void saveLanguage(next);
  }, []);
  const restoreLanguage = useCallback((next: Language) => setLanguageState(next), []);
  const value = useMemo(() => ({ language, setLanguage, restoreLanguage }), [language, setLanguage, restoreLanguage]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>');
  return value;
}
