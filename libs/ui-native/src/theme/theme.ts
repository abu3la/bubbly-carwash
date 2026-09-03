import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { StyleSheet } from 'react-native-unistyles';
import {
  border,
  beat,
  duration,
  focusRing,
  fontSize as size,
  HIT_TARGET,
  layout,
  lineHeight as leading,
  lineHeightArabic as leadingArabic,
  nativeFont,
  onBeat,
  palette,
  radius,
  shadow,
  space,
  spring,
  tracking,
} from '@sama/design-tokens';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/**
 * Every dimension passes through here, so a design drawn on a 390pt frame keeps
 * its proportions on a 320pt SE and a 440pt Pro Max without per-screen
 * breakpoints.
 */
const scale = (value: number): number => Math.round(moderateScale(value));

const scaleAll = <T extends Record<string, number>>(values: T): { [K in keyof T]: number } =>
  Object.fromEntries(Object.entries(values).map(([k, v]) => [k, scale(v)])) as { [K in keyof T]: number };

const theme = {
  // ---- colour ----------------------------------------------------------
  // Raw brand tones. Reach for a semantic role below before using these.
  palette,

  /** Page, cards, and the two special grounds. */
  surface: {
    page: palette.cloud,
    card: palette.white,
    /** Ice blue — booking tickets and slot chips only. */
    booking: palette.ice,
    bookingSoft: palette.ice100,
    dark: palette.ink,
    tint: palette.violet100,
  },

  text: {
    primary: palette.ink,
    secondary: palette.ink72,
    muted: palette.ink56,
    faint: palette.ink40,
    inverse: palette.white,
    inverseSoft: palette.whiteSoft,
    onTintYellow: palette.onYellowTint,
    onTintIce: palette.onIceTint,
  },

  /** Electric violet is the only action colour in the system. */
  action: {
    primary: palette.violet,
    hover: palette.violet600,
    active: palette.violet700,
    onPrimary: palette.white,
    tint: palette.violet100,
    mid: palette.violet200,
  },

  /** The three-beat pipeline. Nothing else may colour a status. */
  beat,
  onBeat,

  border: {
    subtle: border.subtle,
    strong: border.strong,
    width: border.width,
  },

  // ---- dimension -------------------------------------------------------
  spacing: scaleAll(space),
  radius: { ...scaleAll(radius), pill: radius.pill },
  fontSize: scaleAll(size),
  leading,
  leadingArabic,
  tracking,
  font: nativeFont,
  layout: { ...scaleAll(layout), hitTarget: scale(HIT_TARGET) },
  scale,

  // ---- effect ----------------------------------------------------------
  shadow,
  focusRing,
  duration,
  spring,

  screen: {
    width: SCREEN_W,
    height: SCREEN_H,
    isSmall: SCREEN_W < 380,
  },
} as const;

type AppTheme = typeof theme;

const breakpoints = { xs: 0, sm: 380, md: 430, lg: 768 } as const;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme;
  }
  // Unistyles declares UnistylesBreakpoints as an interface, and module
  // augmentation can only extend an interface with an interface — a type alias
  // is rejected. So the "no members" shape here is required by the library's
  // API, not an oversight.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends Record<keyof typeof breakpoints, number> {}
}

/**
 * Switches the design system on. Must run once, before any component's
 * `StyleSheet.create` is evaluated — the app imports this from its entry.
 */
let configured = false;

export function configureDesignSystem(): void {
  // Configuring twice would register a second theme store, so this is a
  // no-op after the first call whatever imports it.
  if (configured) return;
  configured = true;

  StyleSheet.configure({
    themes: { light: theme },
    breakpoints,
    settings: {
      // A single light system: the handoff defines no dark palette, and
      // inventing one would be guessing at the brand.
      initialTheme: 'light',
    },
  });
}

export { theme, breakpoints };
export type { AppTheme };
