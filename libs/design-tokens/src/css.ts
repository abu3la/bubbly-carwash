import { color } from './color';
import { fontSize, radius, space } from './scale';

/**
 * Serializes the tokens to CSS custom properties for web apps.
 * Platform-neutral: returns a string, touches no DOM.
 */
export function cssVariables(): string {
  const entries: Record<string, string> = {
    '--bb-ink': color.ink,
    '--bb-ink-soft': color.inkSoft,
    '--bb-ink-faint': color.inkFaint,
    '--bb-foam': color.foam,
    '--bb-surface': color.surface,
    '--bb-surface-sunken': color.surfaceSunken,
    '--bb-aqua': color.aqua,
    '--bb-aqua-deep': color.aquaDeep,
    '--bb-success': color.success,
    '--bb-warning': color.warning,
    '--bb-danger': color.danger,
    '--bb-radius-sm': `${radius.sm}px`,
    '--bb-radius-md': `${radius.md}px`,
    '--bb-radius-lg': `${radius.lg}px`,
    '--bb-space-sm': `${space.sm}px`,
    '--bb-space-md': `${space.md}px`,
    '--bb-space-lg': `${space.lg}px`,
    '--bb-space-xl': `${space.xl}px`,
    '--bb-font-caption': `${fontSize.caption}px`,
    '--bb-font-body': `${fontSize.body}px`,
    '--bb-font-title': `${fontSize.title}px`,
    '--bb-font-display': `${fontSize.display}px`,
  };
  return Object.entries(entries)
    .map(([k, v]) => `${k}: ${v};`)
    .join('\n');
}
