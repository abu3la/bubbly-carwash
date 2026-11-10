const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { act, create } = require('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT = true;
const compiled = ts.transpileModule(readFileSync(`${__dirname}/useButtonAction.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exported = {};
vm.runInNewContext(compiled, { exports: exported, require, Promise });
const { useButtonAction } = exported;

async function mount(props) {
  let current;
  function Harness(p) { current = useButtonAction(p.onPress, p.disabled, p.loading); return null; }
  let root;
  await act(() => { root = create(React.createElement(Harness, props)); });
  return {
    get value() { return current; },
    update: (next) => act(() => root.update(React.createElement(Harness, next))),
    unmount: () => act(() => root.unmount()),
  };
}

test('only the pressed button loads; repeated presses are locked before the next render', async () => {
  let resolve;
  let calls = 0;
  const request = new Promise((done) => { resolve = done; });
  const a = await mount({ onPress: () => { calls++; return request; } });
  const b = await mount({ onPress: () => {} });
  let pending;
  await act(() => { pending = a.value.run(); a.value.run(); });
  assert.equal(calls, 1);
  assert.equal(a.value.busy, true);
  assert.equal(a.value.inactive, true);
  assert.equal(b.value.busy, false);
  await act(async () => { resolve(); await pending; });
  assert.equal(a.value.busy, false);
  assert.equal(a.value.inactive, false);
  await a.unmount(); await b.unmount();
});

test('a failed request releases loading and can be retried', async () => {
  let reject;
  const error = new Error('request failed');
  const button = await mount({ onPress: () => new Promise((_, fail) => { reject = fail; }) });
  let pending;
  await act(() => { pending = button.value.run(); });
  await act(async () => { reject(error); await assert.rejects(pending, /request failed/); });
  assert.equal(button.value.busy, false);
  assert.equal(button.value.inactive, false);
  await button.update({ onPress: () => {} });
  await act(() => { button.value.run(); });
  assert.equal(button.value.busy, false);
  await button.unmount();
});

test('disabled and externally loading buttons never invoke their action', async () => {
  let calls = 0;
  const onPress = () => { calls++; };
  const button = await mount({ onPress, disabled: true });
  button.value.run();
  await button.update({ onPress, loading: true });
  button.value.run();
  assert.equal(button.value.busy, true);
  assert.equal(calls, 0);
  await button.update({ onPress });
  button.value.run();
  assert.equal(calls, 1);
  assert.equal(button.value.busy, false);
  await button.unmount();
});

test('unmounting while a request is pending is safe', async () => {
  let resolve;
  const button = await mount({ onPress: () => new Promise((done) => { resolve = done; }) });
  let pending;
  await act(() => { pending = button.value.run(); });
  await button.unmount();
  resolve(); await pending;
});
