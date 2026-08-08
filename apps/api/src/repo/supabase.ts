import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Booking, Service } from '@bubbly/types';
import type { BookingFilter, Repository } from './types';

/* Rows use snake_case (Postgres convention); the API speaks camelCase. */

interface ServiceRow {
  id: string;
  name: string;
  description: string;
  price_minor: number;
  currency: string;
  duration_minutes: number;
  active: boolean;
}

interface BookingRow {
  id: string;
  client_id: string;
  driver_id: string | null;
  vehicle_id: string;
  service_id: string;
  status: Booking['status'];
  address: string;
  lat: number;
  lng: number;
  scheduled_at: string;
  price_minor: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

function toService(row: ServiceRow): Service {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceMinor: row.price_minor,
    currency: row.currency,
    durationMinutes: row.duration_minutes,
    active: row.active,
  };
}

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    clientId: row.client_id,
    driverId: row.driver_id,
    vehicleId: row.vehicle_id,
    serviceId: row.service_id,
    status: row.status,
    address: row.address,
    location: { lat: row.lat, lng: row.lng },
    scheduledAt: row.scheduled_at,
    priceMinor: row.price_minor,
    currency: row.currency,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function throwOn(error: { message: string } | null): void {
  if (error) throw new Error(`supabase: ${error.message}`);
}

export function createSupabaseRepository(url: string, serviceRoleKey: string): Repository {
  const db: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return {
    async listServices() {
      const { data, error } = await db.from('services').select('*').order('price_minor');
      throwOn(error);
      return (data as ServiceRow[]).map(toService);
    },
    async createService(input) {
      const { data, error } = await db
        .from('services')
        .insert({
          name: input.name,
          description: input.description,
          price_minor: input.priceMinor,
          currency: input.currency,
          duration_minutes: input.durationMinutes,
          active: input.active,
        })
        .select()
        .single();
      throwOn(error);
      return toService(data as ServiceRow);
    },
    async listBookings(filter: BookingFilter) {
      let query = db.from('bookings').select('*').order('scheduled_at', { ascending: false });
      if (filter.status) query = query.eq('status', filter.status);
      if (filter.clientId) query = query.eq('client_id', filter.clientId);
      if (filter.driverId) query = query.eq('driver_id', filter.driverId);
      const { data, error } = await query;
      throwOn(error);
      return (data as BookingRow[]).map(toBooking);
    },
    async getBooking(id) {
      const { data, error } = await db.from('bookings').select('*').eq('id', id).maybeSingle();
      throwOn(error);
      return data ? toBooking(data as BookingRow) : null;
    },
    async createBooking(input, priceMinor, currency) {
      const { data, error } = await db
        .from('bookings')
        .insert({
          client_id: input.clientId,
          vehicle_id: input.vehicleId,
          service_id: input.serviceId,
          status: 'pending',
          address: input.address,
          lat: input.location.lat,
          lng: input.location.lng,
          scheduled_at: input.scheduledAt,
          price_minor: priceMinor,
          currency,
        })
        .select()
        .single();
      throwOn(error);
      return toBooking(data as BookingRow);
    },
    async updateBookingStatus(id, status, driverId) {
      const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (driverId !== undefined) patch.driver_id = driverId;
      const { data, error } = await db
        .from('bookings')
        .update(patch)
        .eq('id', id)
        .select()
        .maybeSingle();
      throwOn(error);
      return data ? toBooking(data as BookingRow) : null;
    },
  };
}
