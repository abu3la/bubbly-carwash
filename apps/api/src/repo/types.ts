import type { Booking, BookingStatus, Service } from '@bubbly/types';
import type { CreateBookingInput, CreateServiceInput } from '@bubbly/validation';

export interface BookingFilter {
  status?: BookingStatus;
  clientId?: string;
  driverId?: string;
}

export interface Repository {
  listServices(): Promise<Service[]>;
  createService(input: CreateServiceInput): Promise<Service>;
  listBookings(filter: BookingFilter): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | null>;
  createBooking(input: CreateBookingInput, priceMinor: number, currency: string): Promise<Booking>;
  updateBookingStatus(
    id: string,
    status: BookingStatus,
    driverId?: string,
  ): Promise<Booking | null>;
}
