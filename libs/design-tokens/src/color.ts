/**
 * Bubbles's palette, ported verbatim from the handoff's `tokens/colors.css`.
 * Electric violet is the one action colour; guava, yellow and ice are the
 * supporting brand tones. Ink is a single near-black expressed in alpha steps
 * rather than a ladder of greys, so every muted tone is provably the same hue.
 */
export const palette = {
  violet: '#5A42FF',
  violet600: '#4A33E6',
  violet700: '#3D28C4',
  violet200: '#C9C1FF',
  violet100: '#EEEBFF',

  guava: '#FF5E7E',
  guava600: '#E84A6B',
  guava100: '#FFE9EE',

  yellow: '#FFD84D',
  yellow600: '#EFC53B',
  yellow100: '#FFF5D6',

  ice: '#BDEEFF',
  ice100: '#E7F8FF',

  ink: '#17162E',
  ink72: 'rgba(23,22,46,0.72)',
  ink56: 'rgba(23,22,46,0.56)',
  ink40: 'rgba(23,22,46,0.4)',
  ink16: 'rgba(23,22,46,0.16)',
  ink10: 'rgba(23,22,46,0.1)',
  ink06: 'rgba(23,22,46,0.06)',

  cloud: '#FAFAF5',
  white: '#FFFFFF',
  whiteSoft: 'rgba(255,255,255,0.72)',

  /** Readable ink for text sitting on the tint backgrounds. */
  onYellowTint: '#8A6D00',
  onIceTint: '#0B6A8F',
} as const;

/**
 * The wash pipeline has exactly three beats. Never a fourth — the handoff is
 * explicit, and StatusBadge is the only component allowed to colour them.
 */
export const beat = {
  arrived: palette.violet,
  washed: palette.guava,
  verified: palette.yellow,
} as const;

export type BeatKey = keyof typeof beat;

/** Ink that sits legibly on each beat colour. */
export const onBeat: Record<BeatKey, string> = {
  arrived: palette.white,
  washed: palette.white,
  verified: palette.ink,
};
