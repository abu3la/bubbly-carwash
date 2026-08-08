import type { Booking, Service } from '@bubbly/types';
import type { BookingFilter, Repository } from './types';

const now = () => new Date().toISOString();

const services: Service[] = [
  {
    id: 'svc-exterior',
    name: 'Exterior wash',
    description: 'Foam wash, rinse, and hand dry — outside only.',
    priceMinor: 4500,
    currency: 'SAR',
    durationMinutes: 30,
    active: true,
  },
  {
    id: 'svc-full',
    name: 'Full wash',
    description: 'Exterior wash plus interior vacuum and dashboard wipe.',
    priceMinor: 7500,
    currency: 'SAR',
    durationMinutes: 55,
    active: true,
  },
  {
    id: 'svc-detail',
    name: 'Deep detail',
    description: 'Clay bar, polish, interior shampoo, and wax.',
    priceMinor: 24000,
    currency: 'SAR',
    durationMinutes: 150,
    active: true,
  },
];

const bookings: Booking[] = [
  {
    id: 'bkg-1001',
    clientId: 'usr-client-1',
    driverId: null,
    vehicleId: 'veh-1',
    serviceId: 'svc-exterior',
    status: 'pending',
    address: 'King Fahd Rd, Al Olaya, Riyadh',
    location: { lat: 24.6905, lng: 46.6852 },
    scheduledAt: '2026-08-09T16:00:00+03:00',
    priceMinor: 4500,
    currency: 'SAR',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'bkg-1002',
    clientId: 'usr-client-2',
    driverId: 'usr-driver-1',
    vehicleId: 'veh-2',
    serviceId: 'svc-full',
    status: 'washing',
    address: 'Prince Sultan Rd, Al Khobar',
    location: { lat: 26.2794, lng: 50.2083 },
    scheduledAt: '2026-08-08T18:30:00+03:00',
    priceMinor: 7500,
    currency: 'SAR',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'bkg-1003',
    clientId: 'usr-client-1',
    driverId: 'usr-driver-2',
    vehicleId: 'veh-1',
    serviceId: 'svc-detail',
    status: 'done',
    address: 'Corniche Rd, Jeddah',
    location: { lat: 21.5433, lng: 39.1728 },
    scheduledAt: '2026-08-05T10:00:00+03:00',
    priceMinor: 24000,
    currency: 'SAR',
    createdAt: now(),
    updatedAt: now(),
  },
];

/**
 * Dev fallback used when Supabase credentials are absent. Module-level state
 * persists only per Worker isolate — good enough for local development.
 */
export function createMemoryRepository(): Repository {
  return {
    async listServices() {
      return services;
    },
    async createService(input) {
      const service: Service = { id: `svc-${crypto.randomUUID().slice(0, 8)}`, ...input };
      services.push(service);
      return service;
    },
    async listBookings(filter: BookingFilter) {
      return bookings.filter(
        (b) =>
          (!filter.status || b.status === filter.status) &&
          (!filter.clientId || b.clientId === filter.clientId) &&
          (!filter.driverId || b.driverId === filter.driverId),
      );
    },
    async getBooking(id) {
      return bookings.find((b) => b.id === id) ?? null;
    },
    async createBooking(input, priceMinor, currency) {
      const booking: Booking = {
        id: `bkg-${crypto.randomUUID().slice(0, 8)}`,
        clientId: input.clientId,
        driverId: null,
        vehicleId: input.vehicleId,
        serviceId: input.serviceId,
        status: 'pending',
        address: input.address,
        location: input.location,
        scheduledAt: input.scheduledAt,
        priceMinor,
        currency,
        createdAt: now(),
        updatedAt: now(),
      };
      bookings.push(booking);
      return booking;
    },
    async updateBookingStatus(id, status, driverId) {
      const booking = bookings.find((b) => b.id === id);
      if (!booking) return null;
      booking.status = status;
      if (driverId !== undefined) booking.driverId = driverId;
      booking.updatedAt = now();
      return booking;
    },
  };
}
