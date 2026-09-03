import { useLocale } from '@sama/ui-native';
import type { Language } from '@sama/ui-native';
import { ar } from './ar';
import { en } from './en';
import type { Copy } from './types';

const CATALOGUES: Record<Language, Copy> = { ar, en };

/** The catalogue for a language, for use outside React. */
export function copyFor(language: Language): Copy {
  return CATALOGUES[language];
}

/**
 * The copy for the active language. Direction and wording come from the same
 * source, so a screen can never end up right-aligned in English or reading
 * Arabic in a left-to-right layout.
 */
export function useCopy(): Copy {
  const { language } = useLocale();
  return CATALOGUES[language];
}

export type { Copy };
