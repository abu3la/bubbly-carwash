import { palette } from './color';

/**
 * `tokens/effects.css`. Expressed as CSS `boxShadow` strings — React Native
 * 0.76+ takes them directly, so a value pasted from the design lands unchanged
 * on both platforms instead of being split into the legacy iOS shadow props and
 * Android elevation.
 */
export const shadow = {
  card: '0 1px 2px rgba(23,22,46,0.05), 0 6px 20px rgba(23,22,46,0.07)',
  float: '0 12px 32px rgba(23,22,46,0.16)',
  /** The promo "stack" — a hard offset block, no blur. Never a soft bloom. */
  stackIce: `8px 8px 0 0 ${palette.ice}`,
  stackGuava: `8px 8px 0 0 ${palette.guava}`,
  /** Sits under the active pill in the segmented tab control. */
  tab: '0 1px 4px rgba(23,22,46,0.12)',
} as const;

export const border = {
  subtle: palette.ink10,
  strong: palette.ink16,
  /** Field and card hairlines are 1.5px in this system, not 1px. */
  width: 1.5,
} as const;

/** The focus ring, as a boxShadow. */
export const focusRing = '0 0 0 3px rgba(90,66,255,0.35)';
