/**
 * Bubbly's world is water: a deep petrol ink (green-leaning, deliberately not
 * the stock blue-slate), foam-tinted surfaces, and one aqua accent used
 * sparingly. Semantic colors are separate from the accent.
 */
export const color = {
  // grounds
  ink: '#142b30',
  inkSoft: '#51696e',
  inkFaint: '#7d9296',
  foam: '#eef3f2',
  surface: '#f7fafa',
  surfaceSunken: '#e4edec',

  // dark grounds
  night: '#0d1c1f',
  nightSurface: '#13262a',
  nightRaised: '#182e33',
  foamOnNight: '#d9e9e7',
  mutedOnNight: '#93aeac',

  inkFaintOnNight: '#6d8785',

  // accent — one aqua, two tonal steps per ground
  aqua: '#0d7e8f',
  aquaDeep: '#0a5f6c',
  aquaOnNight: '#52c2d0',
  aquaSoftOnNight: '#7dd3de',

  // semantic (not the accent)
  success: '#2e7d5b',
  warning: '#a8681c',
  danger: '#a83a32',
  successOnNight: '#5fae8c',
  warningOnNight: '#cf9455',
  dangerOnNight: '#cf7a72',
} as const;

/** Booking status → semantic color role. */
export const statusColor = {
  pending: color.inkFaint,
  assigned: color.aqua,
  en_route: color.aqua,
  washing: color.warning,
  done: color.success,
  cancelled: color.danger,
} as const;
