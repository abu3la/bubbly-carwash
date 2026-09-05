const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = process.env.BUBBLES_REPO_ROOT ?? process.cwd();
const ts = require(path.join(root, 'node_modules/typescript'));
const defer = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = () => new Promise((resolve) => setImmediate(resolve));
async function until(test) { for (let i = 0; i < 100; i++) { if (test()) return; await tick(); } throw new Error('Expected async step did not run'); }
const session = (id, expired = false) => ({ accessToken: `${id}-access`, refreshToken: `${id}-refresh`, userId: id, phone: '+966500000001', expiresAt: expired ? 1 : Math.floor(Date.now()/1000) + 3600 });
const payload = (id) => ({ accessToken: `${id}-access`, refreshToken: `${id}-refresh`, user: { id, phone: '+966500000001' }, expiresIn: 3600 });
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
function harness(kind, initial, handler, onWrite) {
  const key = kind === 'client' ? 'bubbles.session' : 'bubbles.driver.session';
  const data = new Map(initial ? [[key, JSON.stringify(initial)]] : []);
  const requests = [], writes = [];
  const storage = {
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => { writes.push(['set-start', key, value]); if (onWrite) await onWrite(key, value); data.set(key, value); writes.push(['set-end', key, value]); },
    removeItem: async (key) => { data.delete(key); writes.push(['remove', key]); },
    multiRemove: async (keys) => { keys.forEach((key) => data.delete(key)); writes.push(['clear']); },
  };
  const cache = {};
  function load(relative) {
    if (cache[relative]) return cache[relative].exports;
    const module = { exports: {} }; cache[relative] = module;
    const js = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    vm.runInNewContext(`(function(require,module,exports){${js}\n})`, {
      setTimeout, clearTimeout, AbortController, URL, URLSearchParams,
      process: { env: {} },
      fetch: async (url, init) => { const req = { path: new URL(url).pathname, body: init?.body ? JSON.parse(init.body) : null, headers: init?.headers }; requests.push(req); if (req.path === '/auth/logout') return response({ signedOut: true }); return handler(req); },
    }, { filename: relative })((name) => {
      if (name === '@react-native-async-storage/async-storage') return storage;
      if (name === './auth') return load('apps/client-app/src/auth.ts');
      throw new Error(`Unexpected require ${name}`);
    }, module, module.exports);
    return module.exports;
  }
  const auth = load(kind === 'client' ? 'apps/client-app/src/auth.ts' : 'apps/driver-app/src/api.ts');
  const api = kind === 'client' ? load('apps/client-app/src/api.ts') : auth;
  return { auth, api, requests, writes, data, key, current: () => JSON.parse(data.get(key) ?? 'null') };
}
async function run(kind) {
  const tests = [];
  async function test(name, fn) { await fn(); tests.push(name); }
  await test('late refresh cannot resurrect logout', async () => {
    const refresh = defer(); const h = harness(kind, session('old', true), () => refresh.promise);
    let events = 0; h.auth.onSessionCleared(() => events++);
    const pending = h.auth.loadSession(); await until(() => h.requests.some((r) => r.path === '/auth/refresh'));
    await h.auth.clearSession(); refresh.resolve(response(payload('old-renewed')));
    assert.equal(await pending, null); assert.equal(h.current(), null); assert.equal(events, 1);
    assert.equal(h.requests.find((r) => r.path === '/auth/logout').headers.Authorization, 'Bearer old-access');
  });
  await test('failed old refresh cannot clear new sign-in', async () => {
    const refresh = defer(); const h = harness(kind, session('old', true), (r) => r.path === '/auth/verify' ? response(payload('new')) : refresh.promise);
    let events = 0; h.auth.onSessionCleared(() => events++);
    const pending = h.auth.loadSession(); await until(() => h.requests.some((r) => r.path === '/auth/refresh'));
    await h.auth.verifyOtp('+966500000001', '123456'); refresh.resolve(response({ error: { code: 'wrongCode' } }, 401));
    assert.equal(await pending, null); assert.equal(h.current().userId, 'new'); assert.equal(events, 0);
  });
  await test('serialized writes protect newer sign-in from delayed old write and logout', async () => {
    const write = defer(); let holding = false;
    const h = harness(kind, session('old', true), (r) => response(payload(r.path === '/auth/verify' ? 'new' : 'old-renewed')), async (_, value) => { if (JSON.parse(value).userId === 'old-renewed') { holding = true; await write.promise; } });
    const pending = h.auth.loadSession(); await until(() => holding);
    const logout = h.auth.clearSession().catch(() => null);
    const signin = h.auth.verifyOtp('+966500000001', '123456'); await tick(); write.resolve();
    await Promise.all([pending, logout, signin]); assert.equal(h.current().userId, 'new');
    const newWrite = h.writes.findIndex((r) => r[0] === 'set-end' && JSON.parse(r[2]).userId === 'new');
    assert.equal(h.writes.slice(newWrite + 1).some((r) => r[0] === 'clear'), false);
  });
  await test('old 401 cannot retry action under new account', async () => {
    const request = defer(); const h = harness(kind, session('old'), (r) => r.path === '/auth/verify' ? response(payload('new')) : request.promise);
    const pending = (kind === 'client' ? h.api.fetchMe() : h.api.jobs()).catch((e) => e);
    await until(() => h.requests.some((r) => r.path === (kind === 'client' ? '/me' : '/driver/jobs')));
    await h.auth.verifyOtp('+966500000001', '123456'); request.resolve(response({ error: { code: 'unauthorized' } }, 401)); await pending;
    assert.equal(h.current().userId, 'new'); assert.equal(h.requests.filter((r) => r.path !== '/auth/verify').length, 1);
  });
  await test('concurrent refresh deduplicated within generation', async () => {
    const refresh = defer(); const h = harness(kind, session('old', true), () => refresh.promise);
    const reads = [h.auth.loadSession(), h.auth.loadSession(), h.auth.loadSession()]; await until(() => h.requests.length === 1); await tick();
    assert.equal(h.requests.length, 1); refresh.resolve(response(payload('old-renewed')));
    assert.equal((await Promise.all(reads)).every((s) => s.userId === 'old-renewed'), true);
  });
  await test('offline refresh preserves local identity', async () => {
    const h = harness(kind, session('old', true), () => Promise.reject(new Error('offline')));
    assert.equal((await h.auth.loadSession()).userId, 'old'); assert.equal(h.current().userId, 'old');
  });
  await test('newest verification wins', async () => {
    const older = defer(); let count = 0;
    const h = harness(kind, null, () => ++count === 1 ? older.promise : response(payload('new')));
    const first = h.auth.verifyOtp('+966500000001', '123456').catch(() => null);
    await h.auth.verifyOtp('+966500000001', '654321'); older.resolve(response(payload('old')));
    assert.equal(await first, null); assert.equal(h.current().userId, 'new');
  });
  await test('logout ordered after in-flight verification write', async () => {
    const write = defer(); let holding = false;
    const h = harness(kind, null, () => response(payload('new')), async () => { holding = true; await write.promise; });
    const signin = h.auth.verifyOtp('+966500000001', '123456').catch(() => null); await until(() => holding);
    const logout = h.auth.clearSession(); write.resolve(); await Promise.all([signin, logout]); assert.equal(h.current(), null);
  });
  console.log(`${kind}: ${tests.length} auth races passed`); tests.forEach((name) => console.log(`  ✓ ${name}`));
}
(async () => { await run('client'); await run('driver'); })().catch((e) => { console.error(e); process.exitCode = 1; });
