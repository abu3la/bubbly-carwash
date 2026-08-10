# Building with Bubbly UI

React components for Bubbly Carwash (on-demand car wash: customer app, washer app, ops dashboard). No provider or wrapper is needed — components are styled by the stylesheet alone. The base stylesheet also styles `body` (font, ink color, surface background); don't override those with raw hex values.

## Styling idiom: CSS custom properties, never raw values

Style your own layout glue with the `--bb-*` custom properties. Never hard-code colors, radii, spacing, or font sizes; never hand-write `bb-*` CSS classes (they're the components' internals — use the components).

- **Surfaces**: `--bb-surface` (page), `--bb-foam` (panel), `--bb-surface-sunken` (inset). Depth is tonal: shift surface + `1px solid var(--bb-border-subtle)`. The ONLY shadow is `--bb-shadow-raised`, for floating sheets/menus.
- **Ink**: `--bb-ink`, `--bb-ink-soft` (secondary), `--bb-ink-faint` (disabled-ish).
- **Accent**: one aqua — `--bb-aqua-deep` (resting), `--bb-aqua` (hover/bright step). Use on at most ONE primary action + progress fill per screen region. No gradients, no glows, no hover lifts, no filled+outlined button pairs (secondary actions use `<Button variant="quiet">`).
- **Semantic** (never decoration): `--bb-success`, `--bb-warning`, `--bb-danger`; booking-status colors only via `StatusBadge` or `--bb-status-{pending|assigned|en-route|washing|done|cancelled}`.
- **Spacing**: `--bb-space-{xs|sm|md|lg|xl|xxl}` (4/8/16/24/40/64px). **Radius**: `--bb-radius-{sm|md|lg|round}`. **Type sizes**: `--bb-font-{caption|body|emphasis|title|display}`; families `--bb-font-body-family`, `--bb-font-display-family` (display for status headlines, prices, stat numbers only). **Motion**: `--bb-duration-{fast|base|fill}` with `--bb-easing`.
- Dark mode is automatic (`prefers-color-scheme`) or stamp `data-theme="dark"` on the root; the variables remap — code written against them needs no changes.

## House patterns

- Progress is always `WashTrack` (the water-fill metaphor) — don't build ad-hoc steppers.
- Payment/price summaries are `LedgerRow` rows closed by `LedgerTotal` — plain typographic rows, no boxes around them.
- Section transitions use `Waterline` with `fill` matching the section below.
- Prices/amounts get `font-variant-numeric: tabular-nums` (LedgerRow does this itself).

## Where the truth lives

Read `styles.css` and its imports (`tokens/tokens.css` for every variable, `_ds_bundle.css` for component styles) before styling; each component ships a `.d.ts` (exact props) and `.prompt.md` (usage).

## Idiomatic example

```jsx
import { Card, StatusBadge, LedgerRow, LedgerTotal, Button } from '@bubbly/ui-web';

<Card style={{ maxWidth: 380 }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--bb-space-sm)' }}>
    <strong>Shine package — SUV</strong>
    <StatusBadge status="en_route" />
  </div>
  <LedgerRow label="Shine package" amount="$42.00" />
  <LedgerRow label="Service fee" amount="$4.00" muted />
  <LedgerTotal amount="$46.00" />
  <div style={{ display: 'flex', gap: 'var(--bb-space-sm)', marginTop: 'var(--bb-space-md)' }}>
    <Button>Track wash</Button>
    <Button variant="quiet">Reschedule</Button>
  </div>
</Card>
```
