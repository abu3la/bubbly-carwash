/**
 * IBM Plex Sans Arabic carries the whole interface — the handoff names it, and
 * it is a genuine Arabic family with tabular numerals, which this app leans on
 * for every price, slot and invoice ID.
 */
export const fontFamily = {
  arabic: "'IBM Plex Sans Arabic', 'IBM Plex Sans', system-ui, sans-serif",
  latin: "'IBM Plex Sans', system-ui, sans-serif",
} as const;

/**
 * React Native does not synthesise weights for custom families: each weight is
 * its own registered family name, so a component picks a weight by family.
 */
export const nativeFont = {
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semibold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
} as const;
