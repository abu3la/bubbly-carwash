/** Milliseconds. `fast` is a press; `base` is everything else. */
export const duration = {
  fast: 120,
  base: 200,
  /** A screen push or a sheet — long enough to read as one movement. */
  screen: 320,
} as const;

/**
 * `cubic-bezier(.2,.8,.2,1)` — the handoff's single easing curve, kept as raw
 * control points so CSS and Reanimated bend on the identical curve.
 */
export const easingPoints = [0.2, 0.8, 0.2, 1] as const;
export const easing = { standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)' } as const;

/**
 * One spring for everything physical (sheets, pressables, the beat pulse), so
 * motion across the app feels like one hand made it.
 */
export const spring = { damping: 18, stiffness: 220, mass: 0.9 } as const;
