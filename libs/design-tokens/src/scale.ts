/**
 * The handoff's spacing ramp (`tokens/spacing.css`), by its own step numbers so
 * a value in the design maps to a token by name: space[5] is the 20px card pad.
 */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
  11: 80,
  12: 96,
} as const;

/** Card padding and page gutter, named because the handoff names them. */
export const layout = {
  cardPad: space[5],
  gutter: space[6],
  /** The bottom tab bar's fixed height. */
  tabBar: 66,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/** `tokens/typography.css`. Line heights are multipliers of the size. */
export const fontSize = {
  displayXl: 56,
  display: 40,
  title: 28,
  heading: 20,
  bodyLg: 18,
  body: 16,
  small: 14,
  caption: 12,
  label: 11,
} as const;

/**
 * Latin leading, straight from the handoff. The tight display steps assume
 * Latin metrics: an ascender and a cap height and nothing above them.
 */
export const lineHeight = {
  displayXl: 1.05,
  display: 1.1,
  title: 1.2,
  heading: 1.3,
  bodyLg: 1.5,
  body: 1.5,
  small: 1.45,
  caption: 1.4,
  label: 1.3,
} as const;

/**
 * Arabic needs more room. Its letters carry marks and tall finals above the
 * nominal cap height, so a 1.1 display leading crops the tops of سما and
 * لمعة — React Native clips to the line box rather than overflowing it. These
 * are the same steps, opened up enough for the script to fit.
 */
export const lineHeightArabic = {
  displayXl: 1.35,
  display: 1.4,
  title: 1.45,
  heading: 1.45,
  bodyLg: 1.6,
  body: 1.6,
  small: 1.55,
  caption: 1.55,
  label: 1.45,
} as const;

export const tracking = {
  display: -0.02,
  /** Letter-spaced micro labels — the only tracked-out type in the system. */
  label: 0.08,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/** Minimum comfortable touch target. */
export const HIT_TARGET = 44;
