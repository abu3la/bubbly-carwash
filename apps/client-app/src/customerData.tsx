import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  fetchMe,
  fetchMembership,
  listAddresses,
  listBookings,
  listVehicles,
  type Profile,
  type RealBooking,
  type RealMembership,
  type SavedAddress,
  type SavedVehicle,
} from './api';
import { useAuthSession } from './authSession';

interface CustomerData {
  loading: boolean;
  error: boolean;
  profile: Profile | null;
  addresses: SavedAddress[];
  vehicles: SavedVehicle[];
  bookings: RealBooking[];
  membership: RealMembership | null;
  refresh: () => Promise<void>;
  applyProfile: (profile: Profile) => void;
}

const CustomerDataContext = createContext<CustomerData | null>(null);

export function CustomerDataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuthSession();
  const generation = useRef(0);
  const currentSession = useRef(session);
  currentSession.current = session;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [bookings, setBookings] = useState<RealBooking[]>([]);
  const [membership, setMembership] = useState<RealMembership | null>(null);

  const refresh = useCallback(async () => {
    if (!session) return;
    const request = ++generation.current;
    const owner = session;
    setLoading(true);
    setError(false);
    try {
      const [me, addressData, vehicleData, bookingData, membershipData] = await Promise.allSettled([
        fetchMe(), listAddresses(), listVehicles(), listBookings(), fetchMembership(),
      ]);
      if (request !== generation.current || currentSession.current !== owner) return;
      if (me.status === 'fulfilled') setProfile(me.value.profile);
      if (addressData.status === 'fulfilled') setAddresses(addressData.value.addresses);
      if (vehicleData.status === 'fulfilled') setVehicles(vehicleData.value.vehicles);
      if (bookingData.status === 'fulfilled') setBookings(bookingData.value.bookings);
      if (membershipData.status === 'fulfilled') setMembership(membershipData.value.membership);
      setError([me, addressData, vehicleData, bookingData, membershipData].some((result) => result.status === 'rejected'));
    } catch {
      if (request === generation.current && currentSession.current === owner) setError(true);
    } finally {
      if (request === generation.current && currentSession.current === owner) setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) void refresh();
    else {
      generation.current += 1;
      setLoading(false); setError(false);
      setProfile(null); setAddresses([]); setVehicles([]); setBookings([]); setMembership(null);
    }
  }, [session, refresh]);

  const value = useMemo(() => ({
    loading, error, profile, addresses, vehicles, bookings, membership, refresh, applyProfile: setProfile,
  }), [loading, error, profile, addresses, vehicles, bookings, membership, refresh]);
  return <CustomerDataContext.Provider value={value}>{children}</CustomerDataContext.Provider>;
}

export function useCustomerData() {
  const value = useContext(CustomerDataContext);
  if (!value) throw new Error('useCustomerData must be inside CustomerDataProvider');
  return value;
}
