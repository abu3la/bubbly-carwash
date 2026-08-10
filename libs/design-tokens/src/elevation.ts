/**
 * Depth in Bubbly is tonal: surface steps plus a self-colored 1px border.
 * The single shadow exists for floating sheets and menus only — tight,
 * directional, ink-tinted. Nothing else casts one.
 */
export const border = {
  subtle: 'rgba(20, 43, 48, 0.10)', // ink on light grounds
  subtleOnNight: 'rgba(217, 233, 231, 0.12)', // foam on night grounds
} as const;

export const shadow = {
  raised: '0 1px 2px rgba(13, 28, 31, 0.10)',
} as const;
