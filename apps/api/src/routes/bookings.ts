import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { NEXT_STATUS, type BookingStatus } from '@bubbly/types';
import {
  bookingStatusSchema,
  createBookingSchema,
  updateBookingStatusSchema,
} from '@bubbly/validation';
import type { Env } from '../env';
import { getRepository } from '../repo';

const listQuerySchema = z.object({
  status: bookingStatusSchema.optional(),
  clientId: z.string().optional(),
  driverId: z.string().optional(),
});

function transitionAllowed(from: BookingStatus, to: BookingStatus): boolean {
  if (to === 'cancelled') return from === 'pending' || from === 'assigned';
  return NEXT_STATUS[from] === to;
}

export const bookingsRoute = new Hono<{ Bindings: Env }>()
  .get('/', zValidator('query', listQuerySchema), async (c) => {
    const bookings = await getRepository(c.env).listBookings(c.req.valid('query'));
    return c.json(bookings);
  })
  .get('/:id', async (c) => {
    const booking = await getRepository(c.env).getBooking(c.req.param('id'));
    if (!booking) return c.json({ error: 'Booking not found' }, 404);
    return c.json(booking);
  })
  .post('/', zValidator('json', createBookingSchema), async (c) => {
    const repo = getRepository(c.env);
    const input = c.req.valid('json');
    const service = (await repo.listServices()).find((s) => s.id === input.serviceId);
    if (!service) return c.json({ error: 'Unknown service' }, 422);
    // Snapshot the price so later price changes never affect existing bookings.
    const booking = await repo.createBooking(input, service.priceMinor, service.currency);
    return c.json(booking, 201);
  })
  .patch('/:id/status', zValidator('json', updateBookingStatusSchema), async (c) => {
    const repo = getRepository(c.env);
    const id = c.req.param('id');
    const { status, driverId } = c.req.valid('json');
    const current = await repo.getBooking(id);
    if (!current) return c.json({ error: 'Booking not found' }, 404);
    if (!transitionAllowed(current.status, status)) {
      return c.json({ error: `Cannot move a ${current.status} booking to ${status}` }, 422);
    }
    if (status === 'assigned' && !driverId && !current.driverId) {
      return c.json({ error: 'Assigning a booking requires a driverId' }, 422);
    }
    const booking = await repo.updateBookingStatus(id, status, driverId);
    return c.json(booking);
  });
