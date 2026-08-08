import { cssVariables } from '@bubbly/design-tokens';

/** `:root { … }` block apps inject once (style tag or global stylesheet). */
export const tokenCss = `:root {\n${cssVariables()}\n}`;
