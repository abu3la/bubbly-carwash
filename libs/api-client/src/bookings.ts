import type { Booking, BookingStatus } from '@sama/types';
import type { CreateBookingInput, UpdateBookingStatusInput } from '@sama/validation';
import { request } from './client';

export interface BookingFilter {
  status?: BookingStatus;
  clientId?: string;
  driverId?: string;
}

function toQuery(filter: BookingFilter = {}): string {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.clientId) params.set('clientId', filter.clientId);
  if (filter.driverId) params.set('driverId', filter.driverId);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const bookingsService = {
  list: (filter?: BookingFilter) => request<Booking[]>(`/bookings${toQuery(filter)}`),
  get: (id: string) => request<Booking>(`/bookings/${id}`),
  create: (input: CreateBookingInput) =>
    request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(input) }),
  updateStatus: (id: string, input: UpdateBookingStatusInput) =>
    request<Booking>(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(input) }),
};
