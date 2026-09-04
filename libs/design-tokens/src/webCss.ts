/**
 * Web roles retained for the landing-page component library. Native apps use
 * the platform theme exported above, while web components consume these
 * stable `--bb-*` custom properties.
 */
const light: Record<string, string> = {
  '--bb-ink': '#142b30',
  '--bb-ink-soft': '#51696e',
  '--bb-ink-faint': '#7d9296',
  '--bb-foam': '#eef3f2',
  '--bb-surface': '#f7fafa',
  '--bb-surface-sunken': '#e4edec',
  '--bb-aqua': '#0d7e8f',
  '--bb-aqua-deep': '#0a5f6c',
  '--bb-success': '#2e7d5b',
  '--bb-warning': '#a8681c',
  '--bb-danger': '#a83a32',
  '--bb-border-subtle': 'rgba(20, 43, 48, 0.10)',
  '--bb-shadow-raised': '0 1px 2px rgba(13, 28, 31, 0.10)',
  '--bb-status-pending': '#7d9296',
  '--bb-status-assigned': '#0d7e8f',
  '--bb-status-en-route': '#0d7e8f',
  '--bb-status-washing': '#a8681c',
  '--bb-status-done': '#2e7d5b',
  '--bb-status-cancelled': '#a83a32',
  '--bb-font-display-family': "'BubblyDisplay', system-ui, -apple-system, 'Segoe UI', sans-serif",
  '--bb-font-body-family': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  '--bb-radius-sm': '6px',
  '--bb-radius-md': '10px',
  '--bb-radius-lg': '16px',
  '--bb-radius-round': '999px',
  '--bb-space-xs': '4px',
  '--bb-space-sm': '8px',
  '--bb-space-md': '16px',
  '--bb-space-lg': '24px',
  '--bb-space-xl': '40px',
  '--bb-space-xxl': '64px',
  '--bb-font-caption': '12px',
  '--bb-font-body': '15px',
  '--bb-font-emphasis': '17px',
  '--bb-font-title': '22px',
  '--bb-font-display': '32px',
  '--bb-duration-fast': '140ms',
  '--bb-duration-base': '220ms',
  '--bb-duration-fill': '600ms',
  '--bb-easing': 'cubic-bezier(0.2, 0, 0, 1)',
};

const dark: Record<string, string> = {
  '--bb-ink': '#d9e9e7',
  '--bb-ink-soft': '#93aeac',
  '--bb-ink-faint': '#6d8785',
  '--bb-foam': '#13262a',
  '--bb-surface': '#0d1c1f',
  '--bb-surface-sunken': '#182e33',
  '--bb-aqua': '#7dd3de',
  '--bb-aqua-deep': '#52c2d0',
  '--bb-success': '#5fae8c',
  '--bb-warning': '#cf9455',
  '--bb-danger': '#cf7a72',
  '--bb-border-subtle': 'rgba(217, 233, 231, 0.12)',
  '--bb-status-pending': '#6d8785',
  '--bb-status-assigned': '#52c2d0',
  '--bb-status-en-route': '#52c2d0',
  '--bb-status-washing': '#cf9455',
  '--bb-status-done': '#5fae8c',
  '--bb-status-cancelled': '#cf7a72',
};

function block(variables: Record<string, string>, indent = '  ') {
  return Object.entries(variables).map(([name, value]) => `${indent}${name}: ${value};`).join('\n');
}

export function cssVariables() {
  return block(light, '');
}

export function themeCss() {
  return [
    `:root {\n${block(light)}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${block(dark, '    ')}\n  }\n}`,
    `:root[data-theme='dark'] {\n${block(dark)}\n}`,
  ].join('\n');
}
