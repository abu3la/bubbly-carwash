import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface Locale {
  language: Language;
  direction: Direction;
  isRTL: boolean;
}

/**
 * The app's language decides text direction — not the device locale, and
 * deliberately not `I18nManager`.
 *
 * `I18nManager.forceRTL` writes a *native* setting that is only read when the
 * process starts. `Updates.reloadAsync()` restarts the JS bundle but not the
 * process, and iOS will not let an app relaunch itself, so a native flag can
 * never follow an in-app language toggle: you get the new copy in the old
 * layout. Driving direction from here instead means a switch is instant and
 * complete, with no restart at all.
 *
 * Layout mirroring is applied by `<DirectionRoot>`, which sets Yoga's
 * per-node `direction` — the same mechanism, scoped to React.
 *
 * Arabic is the default because this is an Arabic-first product.
 */
const LocaleContext = createContext<Locale>({ language: 'ar', direction: 'rtl', isRTL: true });

export function LocaleProvider({ language, children }: { language: Language; children: ReactNode }) {
  const value = useMemo<Locale>(
    () => ({ language, direction: language === 'ar' ? 'rtl' : 'ltr', isRTL: language === 'ar' }),
    [language],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * Converts a *visual* alignment into the value you must actually write.
 *
 * React Native swaps physical `left`/`right` in styles inside an RTL subtree,
 * so `textAlign: 'right'` under `direction: 'rtl'` renders on the LEFT. This
 * is verified on device, not assumed — and it is why alignment in this design
 * system is never written literally.
 *
 * Say what you mean (`writtenAlign('right', direction)`) and this produces the
 * value that survives the swap.
 */
export function writtenAlign(visual: 'left' | 'right', direction: Direction): 'left' | 'right' {
  if (direction === 'ltr') return visual;
  return visual === 'left' ? 'right' : 'left';
}

