import { en, type MessageKey } from './catalogs/en';
import { ar } from './catalogs/ar';

export type Locale = 'en' | 'ar';
export type { MessageKey };

const catalogs: Record<Locale, Record<MessageKey, string>> = { en, ar };

export function translate(locale: Locale, key: MessageKey): string {
  return catalogs[locale][key] ?? en[key];
}

export function isRtl(locale: Locale): boolean {
  return locale === 'ar';
}
