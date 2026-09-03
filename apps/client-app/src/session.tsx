import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Language } from '@sama/ui-native';
import { DEFAULT_LANGUAGE, saveLanguage } from './language';
import {
  ADD_ONS,
  PACKAGES,
  PLANS,
  SERVICES,
  type AddOn,
  type Package,
  type Plan,
  type Service,
} from './content';

/** How far a live wash has progressed: 0 upcoming → 3 verified. */
export type Stage = 0 | 1 | 2 | 3;

/**
 * Where the wash itself is paid from.
 *
 * This started as a boolean, which stopped being expressible the moment a
 * customer could hold a club membership *and* a package balance at once: the
 * question is no longer "credit or not" but "which balance".
 */
export type PaySource = 'club' | 'package' | 'cash';

export interface Booking {
  id: string;
  /** The 30-minute slot, e.g. "10:30–11:00". */
  slot: string;
  day: string;
  serviceKey: Service['key'];
  addOnKeys: AddOn['key'][];
  /** What was actually charged. Zero when a credit covered the wash. */
  total: number;
  /** Which balance paid for the wash itself. */
  source: PaySource;
}

/** Pre-paid wash credits bought as a package. */
export interface Wallet {
  credits: number;
  total: number;
}

/** An active Sama Club subscription. Display names are looked up per language. */
export interface Club {
  planId: Plan['id'];
  price: number;
  /** Washes left in the current monthly cycle. */
  credits: number;
  /** The plan's weekly ceiling. */
  weekly: number;
  /** Washes already booked this week, against that ceiling. */
  used: number;
  /** Carried in from last cycle — part of `credits`, shown separately. */
  rolled: number;
}

interface State {
  onboarded: boolean;
  /**
   * Drives text direction. Seeded from the native RTL flag, which is where the
   * choice persists across the restart a language change requires.
   */
  language: Language;
  wallet: Wallet;
  club: Club | null;
  booking: Booking | null;
  stage: Stage;
  /** Set once the customer rates a finished wash. */
  rated: boolean;
}

const INITIAL: State = {
  onboarded: false,
  language: DEFAULT_LANGUAGE,
  wallet: { credits: 0, total: 0 },
  club: null,
  booking: null,
  stage: 0,
  rated: false,
};

interface Session extends State {
  /** True when a package credit can cover the next wash. */
  hasCredits: boolean;
  /**
   * True when the club can cover the next wash: the membership has cycle
   * credits left AND the week's ceiling has not been reached. Both have to
   * hold — a plan with washes banked is still capped week by week.
   */
  clubAvailable: boolean;
  /** Every balance that could pay for the next wash, best value first. */
  sources: PaySource[];
  /** The wash currently in flight, if the pipeline has started. */
  isLive: boolean;

  completeOnboarding: () => void;
  /** Switches language. Takes effect immediately — no restart. */
  setLanguage: (language: Language) => void;
  /** Applies the stored language once it has been read from disk. */
  restoreLanguage: (language: Language) => void;
  confirmBooking: (booking: Omit<Booking, 'id'>) => void;
  cancelBooking: () => void;
  /** Moves the pipeline on one beat: upcoming → arrived → washed → verified. */
  advanceStage: () => void;
  resetStage: () => void;
  buyPackage: (pkg: Package) => void;
  joinClub: (plan: Plan) => void;
  leaveClub: () => void;
  submitRating: () => void;
  signOut: () => void;
}

const SessionContext = createContext<Session | null>(null);

let bookingSeq = 4900;

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const patch = useCallback((next: Partial<State> | ((prev: State) => Partial<State>)) => {
    setState((prev) => ({ ...prev, ...(typeof next === 'function' ? next(prev) : next) }));
  }, []);

  const value = useMemo<Session>(
    () => ({
      ...state,
      hasCredits: state.wallet.credits > 0,
      clubAvailable: !!state.club && state.club.credits > 0 && state.club.used < state.club.weekly,
      sources: [
        ...(state.club && state.club.credits > 0 && state.club.used < state.club.weekly
          ? (['club'] as PaySource[])
          : []),
        ...(state.wallet.credits > 0 ? (['package'] as PaySource[]) : []),
        'cash' as PaySource,
      ],
      isLive: !!state.booking && state.stage > 0,

      completeOnboarding: () => patch({ onboarded: true }),
      setLanguage: (language) => {
        patch({ language });
        void saveLanguage(language);
      },
      restoreLanguage: (language) => patch({ language }),

      confirmBooking: (booking) =>
        patch((prev) => ({
          booking: { ...booking, id: `BK-${++bookingSeq}` },
          stage: 0,
          rated: false,
          // A credit is spent at confirmation, not at completion — that is
          // when the customer agreed to it.
          wallet:
            booking.source === 'package'
              ? { ...prev.wallet, credits: Math.max(0, prev.wallet.credits - 1) }
              : prev.wallet,
          // A club wash draws down the cycle balance and counts against the
          // week's ceiling, which is what actually limits a member.
          club:
            booking.source === 'club' && prev.club
              ? {
                  ...prev.club,
                  credits: Math.max(0, prev.club.credits - 1),
                  used: prev.club.used + 1,
                }
              : prev.club,
        })),

      cancelBooking: () =>
        patch((prev) => {
          // Cancelling before the wash starts returns whatever paid for it,
          // per the rules shown at purchase.
          const refundable = prev.stage === 0;
          return {
            booking: null,
            stage: 0,
            wallet:
              refundable && prev.booking?.source === 'package'
                ? { ...prev.wallet, credits: prev.wallet.credits + 1 }
                : prev.wallet,
            club:
              refundable && prev.booking?.source === 'club' && prev.club
                ? {
                    ...prev.club,
                    credits: prev.club.credits + 1,
                    used: Math.max(0, prev.club.used - 1),
                  }
                : prev.club,
          };
        }),

      advanceStage: () => patch((prev) => ({ stage: Math.min(3, prev.stage + 1) as Stage })),
      resetStage: () => patch({ stage: 0, rated: false }),

      buyPackage: (pkg) =>
        patch((prev) => ({
          wallet: {
            credits: prev.wallet.credits + pkg.washes,
            total: prev.wallet.total + pkg.washes,
          },
        })),

      joinClub: (plan) =>
        patch({
          club: {
            planId: plan.id,
            price: plan.price,
            credits: plan.credits,
            weekly: plan.weekly,
            used: 0,
            rolled: 0,
          },
        }),

      leaveClub: () => patch({ club: null }),
      submitRating: () => patch({ rated: true }),
      signOut: () => setState(INITIAL),
    }),
    [state, patch],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside <SessionProvider>');
  return session;
}

// ------------------------------------------------------------------ pricing

/** What a single-visit booking costs, before any credit is applied. */
export function quote(serviceKey: Service['key'], addOnKeys: AddOn['key'][]): number {
  const service = SERVICES.find((s) => s.key === serviceKey) ?? SERVICES[0];
  const extras = ADD_ONS.filter((a) => addOnKeys.includes(a.key)).reduce((sum, a) => sum + a.price, 0);
  return service.price + extras;
}

/**
 * A package credit covers the wash itself but never the add-ons — the package
 * rules say so, and hiding that would be a surprise at checkout.
 */
export function quoteForSource(
  serviceKey: Service['key'],
  addOnKeys: AddOn['key'][],
  source: PaySource,
): number {
  const extras = ADD_ONS.filter((a) => addOnKeys.includes(a.key)).reduce((sum, a) => sum + a.price, 0);
  // Club and package credits both cover the wash and neither covers add-ons.
  return source === 'cash' ? quote(serviceKey, addOnKeys) : extras;
}

export const packageById = (id: number) => PACKAGES.find((p) => p.id === id) ?? PACKAGES[1];
export const planById = (id: Plan['id']) => PLANS.find((p) => p.id === id) ?? PLANS[1];
export const serviceByKey = (key: Service['key']) => SERVICES.find((s) => s.key === key) ?? SERVICES[0];
