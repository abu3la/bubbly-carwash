/**
 * The display face is the signature and must be chosen by *rendering* the
 * candidates in docs/DESIGN_SYSTEM.md §3 (Fontshare Pally / Sentient /
 * Gambarino), then self-hosting the woff2 under assets/fonts. Until that
 * decision lands, the stack falls through to the system face so nothing
 * silently renders in a wrong webfont.
 */
export const fontFamily = {
  display: "'BubblyDisplay', system-ui, -apple-system, 'Segoe UI', sans-serif",
  body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

/** Keyed to the fontSize steps in scale.ts. */
export const lineHeight = {
  caption: 1.4,
  body: 1.5,
  emphasis: 1.4,
  title: 1.25,
  display: 1.1,
} as const;

export const letterSpacing = {
  display: -0.5,
} as const;
