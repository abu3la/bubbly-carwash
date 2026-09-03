import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
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
}

const CustomerDataContext = createContext<CustomerData | null>(null);

export function CustomerDataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuthSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [bookings, setBookings] = useState<RealBooking[]>([]);
  const [membership, setMembership] = useState<RealMembership | null>(null);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(false);
    try {
      const [me, addressData, vehicleData, bookingData, membershipData] = await Promise.all([
        fetchMe(), listAddresses(), listVehicles(), listBookings(), fetchMembership(),
      ]);
      setProfile(me.profile);
      setAddresses(addressData.addresses);
      setVehicles(vehicleData.vehicles);
      setBookings(bookingData.bookings);
      setMembership(membershipData.membership);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) void refresh();
    else {
      setProfile(null); setAddresses([]); setVehicles([]); setBookings([]); setMembership(null);
    }
  }, [session, refresh]);

  const value = useMemo(() => ({
    loading, error, profile, addresses, vehicles, bookings, membership, refresh,
  }), [loading, error, profile, addresses, vehicles, bookings, membership, refresh]);
  return <CustomerDataContext.Provider value={value}>{children}</CustomerDataContext.Provider>;
}

export function useCustomerData() {
  const value = useContext(CustomerDataContext);
  if (!value) throw new Error('useCustomerData must be inside CustomerDataProvider');
  return value;
}
