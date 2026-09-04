/**
 * The language-neutral half of the catalogue: prices, durations, ids and
 * times. Anything with words in it lives in `src/i18n/` so it exists in both
 * languages. Prices include 15% VAT, per the BRD.
 */


// ---------------------------------------------------------------- services

export interface Service {
  key: 'exterior' | 'full';
}

export interface AddOn {
  key: 'wax' | 'tires';
}

/** Kept only to type translations for retired package deep links. */
export interface Package {
  id: 3 | 5 | 10;
}

// ------------------------------------------------------------------- club

export interface Plan {
  id: 'basic' | 'basic-3' | 'plus' | 'plus-3';
}


// ------------------------------------------------------------- scheduling

export interface Slot {
  period: 'morning' | 'afternoon' | 'night';
}

// -------------------------------------------------------------- promises

export const PROMISE_ICONS = ['clock', 'shield', 'chat'] as const;
export type PromiseIcon = (typeof PROMISE_ICONS)[number];
