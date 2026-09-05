import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '@bubbles/ui-native';

/** The customer's chosen language. */
const LANGUAGE_KEY = 'bubbles.language';
// Compatibility only: migrate existing installations without losing stored data.
const LEGACY_LANGUAGE_KEY = 'sama.language';

async function readStoredValue(): Promise<string | null> {
  const current = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (current !== null) return current;
  const legacy = await AsyncStorage.getItem(LEGACY_LANGUAGE_KEY);
  if (legacy !== null) {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, legacy);
      await AsyncStorage.removeItem(LEGACY_LANGUAGE_KEY);
    } catch {
      // Keep using the existing value if migration cannot be persisted yet.
    }
  }
  return legacy;
}

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
    const stored = (await readStoredValue()) as Language | null;
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
