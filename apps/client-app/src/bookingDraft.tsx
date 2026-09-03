import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { SLOTS, type AddOn, type PayMethod, type Service } from './content';
import { quoteForSource, type PaySource } from './session';
import { useCopy } from './i18n';

interface Draft {
  serviceKey: Service['key'];
  addOnKeys: AddOn['key'][];
  /** The chosen day's label in the active language. */
  day: string;
  slot: string;
  /** Which balance pays for the wash itself. */
  source: PaySource;
  method: PayMethod['key'];
}

interface DraftApi extends Draft {
  /** What this booking costs right now, credit and add-ons accounted for. */
  total: number;
  setService: (key: Service['key']) => void;
  toggleAddOn: (key: AddOn['key']) => void;
  setDay: (day: string) => void;
  setSlot: (slot: string) => void;
  setSource: (source: PaySource) => void;
  setMethod: (method: PayMethod['key']) => void;
  reset: () => void;
}

const INITIAL: Draft = {
  serviceKey: 'exterior',
  addOnKeys: [],
  // Filled in by the provider, which can read the active language.
  day: '',
  slot: SLOTS.find((s) => !s.taken)?.time ?? SLOTS[0].time,
  source: 'cash',
  method: 'mada',
};

const DraftContext = createContext<DraftApi | null>(null);

/**
 * The booking being composed. It lives in the flow's layout rather than in a
 * screen, so every step reads and writes the same draft and going back a step
 * never loses what you already chose.
 */
export function BookingDraftProvider({
  children,
  sources,
}: {
  children: ReactNode;
  /**
   * Every balance that could pay, best value first. The draft opens on the
   * first of them, so a member is not asked to opt into the thing they already
   * pay a monthly fee for.
   */
  sources: PaySource[];
}) {
  const copy = useCopy();
  const preferred = sources[0] ?? 'cash';
  const defaults = { ...INITIAL, source: preferred, day: copy.days[1] };
  const [draft, setDraft] = useState<Draft>(defaults);

  const value = useMemo<DraftApi>(
    () => ({
      ...draft,
      total: quoteForSource(draft.serviceKey, draft.addOnKeys, draft.source),
      setService: (serviceKey) => setDraft((d) => ({ ...d, serviceKey })),
      toggleAddOn: (key) =>
        setDraft((d) => ({
          ...d,
          addOnKeys: d.addOnKeys.includes(key)
            ? d.addOnKeys.filter((k) => k !== key)
            : [...d.addOnKeys, key],
        })),
      setDay: (day) => setDraft((d) => ({ ...d, day })),
      setSlot: (slot) => setDraft((d) => ({ ...d, slot })),
      setSource: (source) => setDraft((d) => ({ ...d, source })),
      setMethod: (method) => setDraft((d) => ({ ...d, method })),
      reset: () => setDraft({ ...INITIAL, source: preferred, day: copy.days[1] }),
    }),
    [draft, preferred, copy],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useBookingDraft(): DraftApi {
  const draft = useContext(DraftContext);
  if (!draft) throw new Error('useBookingDraft must be used inside <BookingDraftProvider>');
  return draft;
}
