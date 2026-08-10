import { themeCss } from '@bubbly/design-tokens';

/**
 * Full theme stylesheet apps inject once (style tag or global stylesheet):
 * light on :root, night via prefers-color-scheme, and data-theme stamps for
 * an explicit in-app toggle.
 */
export const tokenCss = themeCss();
