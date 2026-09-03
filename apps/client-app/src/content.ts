/**
 * The language-neutral half of the catalogue: prices, durations, ids and
 * times. Anything with words in it lives in `src/i18n/` so it exists in both
 * languages. Prices include 15% VAT, per the BRD.
 */


// ---------------------------------------------------------------- services

export interface Service {
  key: 'exterior' | 'full';
  price: number;
  minutes: number;
}

export const SERVICES: Service[] = [
  { key: 'exterior', price: 49, minutes: 45 },
  { key: 'full', price: 69, minutes: 70 },
];

export interface AddOn {
  key: 'wax' | 'tires';
  price: number;
}

export const ADD_ONS: AddOn[] = [
  { key: 'wax', price: 20 },
  { key: 'tires', price: 10 },
];

// ---------------------------------------------------------------- packages

export interface Package {
  id: number;
  washes: number;
  price: number;
  /** Price per wash once the package is used up. */
  per: number;
  save: string;
  best?: boolean;
}

export const PACKAGES: Package[] = [
  { id: 3, washes: 3, price: 139, per: 46, save: '5%' },
  { id: 5, washes: 5, price: 219, per: 44, save: '12%', best: true },
  { id: 10, washes: 10, price: 399, per: 40, save: '18%' },
];



// ------------------------------------------------------------------- club

export interface Plan {
  id: 'basic' | 'plus' | 'max';
  price: number;
  /** Washes granted each cycle. */
  credits: number;
  /** How many may be used per week. */
  weekly: number;
  /** How many unused washes roll into the next cycle. */
  roll: number;
  best?: boolean;
}

export const PLANS: Plan[] = [
  { id: 'basic', price: 149, credits: 4, weekly: 1, roll: 1 },
  { id: 'plus', price: 199, credits: 8, weekly: 2, roll: 2, best: true },
  { id: 'max', price: 279, credits: 12, weekly: 3, roll: 2 },
];


// ------------------------------------------------------------- scheduling

export interface Slot {
  time: string;
  /** Slots the design marks as taken — the app only offers what is real. */
  taken?: boolean;
  /** Reserved for club members, who are promised priority on peak slots. */
  priority?: boolean;
}

export const SLOTS: Slot[] = [
  { time: '08:00–08:30' },
  { time: '08:30–09:00' },
  { time: '09:00–09:30' },
  // Held back for the club, which promises priority on the 10:00 slots.
  { time: '10:00–10:30', taken: true, priority: true },
  { time: '10:30–11:00' },
  { time: '11:00–11:30' },
  { time: '15:30–16:00', taken: true },
  { time: '16:00–16:30' },
  { time: '16:30–17:00' },
];

// ------------------------------------------------------------------- user

/** Identifiers, not copy — these read the same in both languages. */
export const CUSTOMER = { phone: '+966 55 123 4567', memberNo: 'Nº 10100' } as const;
export const VEHICLE = { plate: '8241', plateLetters: 'د ح ب' } as const;

// --------------------------------------------------------------- pipeline

export interface BeatStep {
  key: 'arrived' | 'washed' | 'verified';
  time: string;
}

export const BEAT_STEPS: BeatStep[] = [
  { key: 'arrived', time: '10:31' },
  { key: 'washed', time: '10:52' },
  { key: 'verified', time: '10:58' },
];

// --------------------------------------------------------------- payment

export interface PayMethod {
  key: 'mada' | 'visa' | 'apple';
}

export const PAY_METHODS: PayMethod[] = [{ key: 'mada' }, { key: 'visa' }, { key: 'apple' }];

// --------------------------------------------------------------- history

export interface PastWash {
  id: string;
  slot: string;
  rating: number;
}

export const PAST_WASHES: PastWash[] = [
  { id: 'BK-4821', slot: '09:00–09:30', rating: 5 },
  { id: 'BK-4770', slot: '16:00–16:30', rating: 4 },
];

// -------------------------------------------------------------- promises

export const PROMISE_ICONS = ['clock', 'shield', 'chat'] as const;
export type PromiseIcon = (typeof PROMISE_ICONS)[number];
