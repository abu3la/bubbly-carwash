import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateBookingInput, UpdateBookingStatusInput } from '@sama/validation';
import { servicesService } from './services';
import { bookingsService, type BookingFilter } from './bookings';

export function useServices() {
  return useQuery({ queryKey: ['services'], queryFn: servicesService.list });
}

export function useBookings(filter?: BookingFilter) {
  return useQuery({
    queryKey: ['bookings', filter ?? {}],
    queryFn: () => bookingsService.list(filter),
  });
}

export function useBooking(id: string) {
  return useQuery({ queryKey: ['bookings', id], queryFn: () => bookingsService.get(id) });
}

/** Open jobs a driver can pick up. */
export function useDriverQueue() {
  return useBookings({ status: 'pending' });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => bookingsService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateBookingStatusInput & { id: string }) =>
      bookingsService.updateStatus(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
