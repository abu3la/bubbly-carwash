import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(new URL('../libs/design-tokens/package.json', import.meta.url));
const ts = require('typescript');
const cases = [
  ['apps/client-app/src/auth.ts', 'session', 'loadSession'],
  ['apps/driver-app/src/api.ts', 'driver.session', 'loadSession'],
  ['apps/client-app/src/language.ts', 'language', 'loadLanguage'],
];
const session = {
  accessToken: 'test-access',
  refreshToken: 'test-refresh',
  expiresAt: 4102444800,
  userId: 'fixture',
  phone: '',
};

function load(file, items, failWrite = false) {
  const store = new Map(items);
  const storage = {
    getItem: async (key) => store.get(key) ?? null,
    setItem: async (key, value) => {
      if (failWrite) throw new Error('storage full');
      store.set(key, value);
    },
    removeItem: async (key) => {
      store.delete(key);
    },
    multiRemove: async (keys) => {
      keys.forEach((key) => store.delete(key));
    },
  };
  const output = ts.transpileModule(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports,
    AbortController,
    setTimeout,
    clearTimeout,
    require: (name) => {
      assert.equal(name, '@react-native-async-storage/async-storage');
      return storage;
    },
    process: { env: {} },
    fetch: () => {
      throw new Error('Unexpected network access');
    },
    console,
  });
  return { exports, store };
}
for (const [file, key, method] of cases) {
  const legacy = `sama.${key}`,
    current = `bubbles.${key}`;
  const raw = key === 'language' ? 'en' : JSON.stringify(session);
  const existing = key === 'language' ? 'ar' : JSON.stringify({ ...session, userId: 'existing' });
  let test = load(file, [[legacy, raw]]);
  assert.ok(await test.exports[method]());
  assert.equal(test.store.get(current), raw, `${file}: migrate value intact`);
  assert.equal(test.store.has(legacy), false, `${file}: remove old key after successful write`);
  test = load(file, [
    [legacy, raw],
    [current, existing],
  ]);
  await test.exports[method]();
  assert.equal(test.store.get(current), existing, `${file}: current data takes precedence`);
  if (key !== 'language') {
    await test.exports.clearSession();
    assert.equal(
      test.store.has(current) || test.store.has(legacy),
      false,
      `${file}: sign-out cannot revive old session`,
    );
  }
  // Exercise the migration helper itself: a failed new write must never erase the old value.
  test = load(file, [[legacy, raw]], true);
  await test.exports[method]();
  assert.equal(
    test.store.get(legacy),
    raw,
    `${file}: failed migration preserves the original data`,
  );
  console.log(`PASS ${file}: migration, precedence, cleanup and storage failure`);
}
