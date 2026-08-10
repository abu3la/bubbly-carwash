# design-sync notes — Bubbly Carwash

- `@bubbly/ui-web` is source-only (no dist): build with `--entry libs/ui-web/src/index.ts`.
- Use `--node-modules ./node_modules` (repo root). pnpm leaves `libs/ui-web/node_modules` sparse (react hoisted to root).
- Root `node_modules/@bubbly/` does not exist after `pnpm install` — recreate before building:
  `mkdir -p node_modules/@bubbly && ln -sfn ../../libs/design-tokens node_modules/@bubbly/design-tokens && ln -sfn ../../libs/types node_modules/@bubbly/types`
  (needed so `tokensPkg: "@bubbly/design-tokens"` resolves).
- `libs/design-tokens/tokens.css` is GENERATED from the TS tokens by `node .design-sync/gen-tokens.mjs` (uses `.ds-sync/node_modules/esbuild`). Regenerate whenever `libs/design-tokens/src/*` changes, before building.
- Render check: playwright@1.61.0 in `.ds-sync` matches the cached chromium build 1228 (`~/Library/Caches/ms-playwright`). A different playwright version fails with "Executable doesn't exist".
- `[FONT_MISSING] BubblyDisplay` is DELIBERATE and accepted by the user (2026-08-09 plan approval): the signature display face is intentionally unchosen (candidates: Fontshare Pally / Sentient / Gambarino, to be picked from a render test); `--bb-font-display-family` falls back to the system stack by design. When the face is chosen, wire the woff2 via `cfg.extraFonts` and remove this acceptance.
- `LedgerTotal` is co-exported from `src/LedgerRow.tsx` — pinned in `componentSrcMap`.

- Root `package.json` carries `pnpm.overrides["react-dom"] = "19.1.0"`. Without it the hoisted layout resolves react-dom 19.2.8 next to react 19.1.0 (pulled by an Expo/react-navigation peer), `require("react-dom/client")` throws a version-mismatch error, and every preview fails with "ReactDOM.createRoot is not a function". Keep react and this override in lockstep when upgrading React.
- Re-sync driver command:
  `node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules --entry libs/ui-web/src/index.ts --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json`

## Known render warns

- `[FONT_MISSING] BubblyDisplay` — deliberate, see acceptance bullet above.

## Re-sync risks

- `libs/design-tokens/tokens.css` silently goes stale if `gen-tokens.mjs` isn't re-run after token changes — the bundle would ship old variable values while components use new ones.
- The `node_modules/@bubbly` symlinks vanish on a fresh `pnpm install`/clone; the build then fails to resolve the tokens package.
- BubblyDisplay acceptance above becomes WRONG the moment a display face is chosen — re-check on every sync.
