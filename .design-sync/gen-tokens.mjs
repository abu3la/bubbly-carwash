// Regenerates the static tokens stylesheet design-sync ships, from the live
// TS tokens. Run from the repo root: node .design-sync/gen-tokens.mjs
// Needs the staged converter deps (.ds-sync/node_modules) for esbuild.
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from '../.ds-sync/node_modules/esbuild/lib/main.js';

const root = new URL('..', import.meta.url).pathname;
const tmp = mkdtempSync(join(tmpdir(), 'bb-tokens-'));
const outFile = join(tmp, 'css.mjs');
await build({
  entryPoints: [join(root, 'libs/design-tokens/src/webCss.ts')],
  bundle: true,
  format: 'esm',
  outfile: outFile,
});
const { themeCss } = await import(pathToFileURL(outFile).href);
const header =
  '/* GENERATED from @bubbles/design-tokens themeCss() — do not edit.\n' +
  '   Regenerate: node .design-sync/gen-tokens.mjs */\n';
writeFileSync(join(root, 'libs/design-tokens/tokens.css'), header + themeCss() + '\n');
rmSync(tmp, { recursive: true, force: true });
console.log('wrote libs/design-tokens/tokens.css');
