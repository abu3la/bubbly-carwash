export const en = {
  'app.name': 'Bubbly',
  'booking.status.pending': 'Finding a driver',
  'booking.status.assigned': 'Driver assigned',
  'booking.status.en_route': 'Driver on the way',
  'booking.status.washing': 'Washing now',
  'booking.status.done': 'All clean',
  'booking.status.cancelled': 'Cancelled',
  'booking.cta.book': 'Book a wash',
  'booking.cta.cancel': 'Cancel booking',
  'driver.cta.accept': 'Accept job',
  'driver.cta.depart': "I'm on my way",
  'driver.cta.arrive': 'Start washing',
  'driver.cta.finish': 'Finish job',
} as const;

export type MessageKey = keyof typeof en;
