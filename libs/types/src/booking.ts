export const BOOKING_STATUSES = [
  'pending',
  'assigned',
  'en_route',
  'washing',
  'done',
  'cancelled',
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** The forward transitions a driver can make. */
export const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  pending: 'assigned',
  assigned: 'en_route',
  en_route: 'washing',
  washing: 'done',
};

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  clientId: string;
  driverId: string | null;
  vehicleId: string;
  serviceId: string;
  status: BookingStatus;
  address: string;
  location: GeoPoint;
  scheduledAt: string;
  /** Price snapshot at booking time, in the smallest currency unit. */
  priceMinor: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverLocation {
  driverId: string;
  location: GeoPoint;
  recordedAt: string;
}
