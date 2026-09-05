import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { type AddOn, type Service } from './content';
import { type PaySource } from './session';
import type { SavedAddress, SavedVehicle } from './api';
import { useCatalogue } from './catalogue';

interface Draft {
  serviceKey: Service['key'];
  addOnKeys: AddOn['key'][];
  /** The chosen day's label in the active language. */
  day: string;
  date: string;
  slot: string;
  slotStart: string;
  period: 'morning' | 'afternoon' | 'night' | '';
  vehicleId: string;
  vehicleLabel: string;
  addressId: string;
  addressLabel: string;
  addressLat: number | null;
  addressLng: number | null;
  villaNumber: string;
  /** Which balance pays for the wash itself. */
  source: PaySource;
}

interface DraftApi extends Draft {
  /** What this booking costs right now, credit and add-ons accounted for. */
  total: number;
  setService: (key: Service['key']) => void;
  toggleAddOn: (key: AddOn['key']) => void;
  setDay: (date: string, label: string) => void;
  setSlot: (period: 'morning' | 'afternoon' | 'night', startsAt: string, endsAt: string) => void;
  setVehicle: (vehicle: SavedVehicle) => void;
  setAddress: (address: SavedAddress) => void;
  setSource: (source: PaySource) => void;
  reset: () => void;
}

const INITIAL: Draft = {
  serviceKey: 'exterior',
  addOnKeys: [],
  // Filled in by the provider, which can read the active language.
  day: '',
  date: '',
  slot: '',
  slotStart: '',
  period: '',
  vehicleId: '',
  vehicleLabel: '',
  addressId: '',
  addressLabel: '',
  addressLat: null,
  addressLng: null,
  villaNumber: '',
  source: 'cash',
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
  const catalogue = useCatalogue();
  const preferred = sources[0] ?? 'cash';
  const defaults = { ...INITIAL, source: preferred };
  const [draft, setDraft] = useState<Draft>(defaults);

  const value = useMemo<DraftApi>(
    () => ({
      ...draft,
      total: (
        (draft.source === 'cash'
          ? (catalogue?.services.find((service) => service.key === draft.serviceKey)?.priceMinor ?? 0)
          : 0)
        + draft.addOnKeys.reduce((sum, key) => (
          sum + (catalogue?.addOns.find((addOn) => addOn.key === key)?.priceMinor ?? 0)
        ), 0)
      ) / 100,
      setService: (serviceKey) => setDraft((d) => ({ ...d, serviceKey })),
      toggleAddOn: (key) =>
        setDraft((d) => ({
          ...d,
          addOnKeys: d.addOnKeys.includes(key)
            ? d.addOnKeys.filter((k) => k !== key)
            : [...d.addOnKeys, key],
        })),
      setDay: (date, day) => setDraft((d) => ({ ...d, date, day, slot: '', slotStart: '', period: '' })),
      setSlot: (period, startsAt, endsAt) => setDraft((d) => ({
        ...d,
        period,
        slot: `${startsAt}–${endsAt}`,
        slotStart: `${d.date}T${startsAt}:00+03:00`,
      })),
      setVehicle: (vehicle) => setDraft((d) => ({
        ...d,
        vehicleId: vehicle.id,
        vehicleLabel: `${vehicle.make} ${vehicle.model}`.trim(),
      })),
      setAddress: (address) => setDraft((d) => ({
        ...d,
        addressId: address.id,
        addressLabel: address.line,
        addressLat: address.lat,
        addressLng: address.lng,
        villaNumber: address.villa_number ?? '',
        slot: '', slotStart: '', period: '',
      })),
      setSource: (source) => setDraft((d) => ({ ...d, source })),
      reset: () => setDraft({ ...INITIAL, source: preferred }),
    }),
    [draft, preferred, catalogue],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useBookingDraft(): DraftApi {
  const draft = useContext(DraftContext);
  if (!draft) throw new Error('useBookingDraft must be used inside <BookingDraftProvider>');
  return draft;
}
