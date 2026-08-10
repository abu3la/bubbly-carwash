import { color, statusColor } from './color';
import { border, shadow } from './elevation';
import { duration, easing } from './motion';
import { fontSize, radius, space } from './scale';
import { fontFamily } from './type';

const lightVars: Record<string, string> = {
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
  '--bb-border-subtle': border.subtle,
  '--bb-shadow-raised': shadow.raised,
  '--bb-status-pending': statusColor.pending,
  '--bb-status-assigned': statusColor.assigned,
  '--bb-status-en-route': statusColor.en_route,
  '--bb-status-washing': statusColor.washing,
  '--bb-status-done': statusColor.done,
  '--bb-status-cancelled': statusColor.cancelled,
  '--bb-font-display-family': fontFamily.display,
  '--bb-font-body-family': fontFamily.body,
  '--bb-radius-sm': `${radius.sm}px`,
  '--bb-radius-md': `${radius.md}px`,
  '--bb-radius-lg': `${radius.lg}px`,
  '--bb-radius-round': `${radius.round}px`,
  '--bb-space-xs': `${space.xs}px`,
  '--bb-space-sm': `${space.sm}px`,
  '--bb-space-md': `${space.md}px`,
  '--bb-space-lg': `${space.lg}px`,
  '--bb-space-xl': `${space.xl}px`,
  '--bb-space-xxl': `${space.xxl}px`,
  '--bb-font-caption': `${fontSize.caption}px`,
  '--bb-font-body': `${fontSize.body}px`,
  '--bb-font-emphasis': `${fontSize.emphasis}px`,
  '--bb-font-title': `${fontSize.title}px`,
  '--bb-font-display': `${fontSize.display}px`,
  '--bb-duration-fast': `${duration.fast}ms`,
  '--bb-duration-base': `${duration.base}ms`,
  '--bb-duration-fill': `${duration.fill}ms`,
  '--bb-easing': easing.standard,
};

/**
 * Night remaps the same variable names, so components written against the
 * light roles work on both grounds untouched. Resting accent is aquaOnNight;
 * the hover/active step brightens (aquaSoftOnNight) instead of deepening.
 */
const darkVars: Record<string, string> = {
  '--bb-ink': color.foamOnNight,
  '--bb-ink-soft': color.mutedOnNight,
  '--bb-ink-faint': color.inkFaintOnNight,
  '--bb-foam': color.nightSurface,
  '--bb-surface': color.night,
  '--bb-surface-sunken': color.nightRaised,
  '--bb-aqua': color.aquaSoftOnNight,
  '--bb-aqua-deep': color.aquaOnNight,
  '--bb-success': color.successOnNight,
  '--bb-warning': color.warningOnNight,
  '--bb-danger': color.dangerOnNight,
  '--bb-border-subtle': border.subtleOnNight,
  '--bb-status-pending': color.inkFaintOnNight,
  '--bb-status-assigned': color.aquaOnNight,
  '--bb-status-en-route': color.aquaOnNight,
  '--bb-status-washing': color.warningOnNight,
  '--bb-status-done': color.successOnNight,
  '--bb-status-cancelled': color.dangerOnNight,
};

function block(vars: Record<string, string>, indent = '  '): string {
  return Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n');
}

/**
 * Serializes the light tokens to CSS custom properties for web apps.
 * Platform-neutral: returns a string, touches no DOM.
 */
export function cssVariables(): string {
  return block(lightVars, '');
}

/**
 * Full theme stylesheet: light on :root, night under prefers-color-scheme
 * (unless the app stamps data-theme="light"), and again under an explicit
 * data-theme="dark" stamp so an in-app toggle wins in both directions.
 */
export function themeCss(): string {
  return [
    `:root {\n${block(lightVars)}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${block(darkVars, '    ')}\n  }\n}`,
    `:root[data-theme='dark'] {\n${block(darkVars)}\n}`,
  ].join('\n');
}
