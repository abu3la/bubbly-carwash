import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '@sama/ui-native';

/** The customer's chosen language. */
const LANGUAGE_KEY = 'sama.language';

/** Arabic-first product: this is what a fresh install gets. */
export const DEFAULT_LANGUAGE: Language = 'ar';

/**
 * Reads the stored language.
 *
 * Note what is NOT here: `I18nManager.forceRTL`. That writes a native setting
 * read only when the process starts, and since `Updates.reloadAsync()` restarts
 * the JS bundle rather than the process — and iOS will not let an app relaunch
 * itself — a native flag can never follow an in-app toggle. It leaves you with
 * the new copy in the old layout.
 *
 * Direction is applied in React instead, by `<DirectionRoot>`, so switching is
 * immediate and needs no restart.
 */
export async function loadLanguage(): Promise<Language> {
  try {
    const stored = (await AsyncStorage.getItem(LANGUAGE_KEY)) as Language | null;
    return stored ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export async function saveLanguage(language: Language): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // Not worth failing the switch over; it simply will not survive a restart.
  }
}
