import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface ClubSlot {
  date: string;
  label: string;
  period: 'morning' | 'afternoon' | 'night';
  startsAt: string;
  endsAt: string;
  slotStart: string;
}

interface ClubDraftValue {
  planId: string;
  vehicleId: string;
  addressId: string;
  slots: ClubSlot[];
  setPlanId: (id: string) => void;
  setVehicleId: (id: string) => void;
  setAddressId: (id: string) => void;
  addSlot: (slot: ClubSlot) => void;
  removeSlot: (slotStart: string) => void;
  reset: () => void;
}

const ClubDraftContext = createContext<ClubDraftValue | null>(null);

export function ClubDraftProvider({ children }: { children: ReactNode }) {
  const [planId, setPlanId] = useState('basic');
  const [vehicleId, setVehicleId] = useState('');
  const [addressId, setAddressId] = useState('');
  const [slots, setSlots] = useState<ClubSlot[]>([]);
  const value = useMemo(() => ({
    planId, vehicleId, addressId, slots, setPlanId,
    setVehicleId: (id: string) => setVehicleId(id),
    setAddressId: (id: string) => setAddressId(id),
    addSlot: (slot: ClubSlot) => setSlots((current) => current.some((item) => item.slotStart === slot.slotStart) ? current : [...current, slot].sort((a, b) => a.slotStart.localeCompare(b.slotStart))),
    removeSlot: (slotStart: string) => setSlots((current) => current.filter((item) => item.slotStart !== slotStart)),
    reset: () => { setPlanId('basic'); setVehicleId(''); setAddressId(''); setSlots([]); },
  }), [planId, vehicleId, addressId, slots]);
  return <ClubDraftContext.Provider value={value}>{children}</ClubDraftContext.Provider>;
}

export function useClubDraft() {
  const value = useContext(ClubDraftContext);
  if (!value) throw new Error('useClubDraft must be inside ClubDraftProvider');
  return value;
}
