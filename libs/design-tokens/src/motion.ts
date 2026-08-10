/** Milliseconds. `fill` is reserved for water-fill track animations. */
export const duration = {
  fast: 140,
  base: 220,
  fill: 600,
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;
