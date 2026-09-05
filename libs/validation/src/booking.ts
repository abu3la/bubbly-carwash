import { z } from 'zod';
import { BOOKING_STATUSES } from '@bubbles/types';

export const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);

export const createBookingSchema = z.object({
  clientId: z.string().min(1),
  vehicleId: z.string().min(1),
  serviceId: z.string().min(1),
  address: z.string().min(3),
  location: geoPointSchema,
  scheduledAt: z.string().datetime({ offset: true }),
});

export const updateBookingStatusSchema = z.object({
  status: bookingStatusSchema,
  driverId: z.string().min(1).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
