import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkoutFailure, checkoutStartFailure, paymentRecovery, verifyFailure } from './paymentFailure.ts';

test('a paid checkout is not a failure, and a decline is not a cancellation', () => {
  assert.equal(checkoutFailure(undefined), null);
  assert.equal(checkoutFailure('success'), null);
  assert.equal(checkoutFailure('declined'), 'declined');
  assert.equal(checkoutFailure('cancel'), 'cancelled');
});

test('failures before payment name the cause', () => {
  assert.equal(checkoutStartFailure('offline'), 'offline');
  assert.equal(checkoutStartFailure('paymentUnavailable'), 'unavailable');
  for (const code of ['slotFull', 'slotInPast', 'scheduleUnavailable', 'oneWashPerDay']) {
    assert.equal(checkoutStartFailure(code), 'slotTaken', code);
  }
  assert.equal(checkoutStartFailure('unknown'), 'general');
  assert.equal(checkoutStartFailure(undefined), 'general');
});

test('failures after payment keep money and time apart', () => {
  assert.equal(verifyFailure('paymentPending'), 'pending');
  assert.equal(verifyFailure('offline'), 'verifyOffline');
  assert.equal(verifyFailure('cancelled'), 'late');
  assert.equal(verifyFailure('scheduleUnavailableRefunded'), 'refunded');
  assert.equal(verifyFailure('scheduleUnavailableRefundPending'), 'refundPending');
});

test('an unexplained result after payment never offers to pay again', () => {
  for (const code of ['paymentNotFound', 'paymentMismatch', 'unknown', undefined]) {
    assert.equal(paymentRecovery(verifyFailure(code)), 'verify', String(code));
  }
  assert.equal(paymentRecovery('pending'), 'verify');
  assert.equal(paymentRecovery('verifyOffline'), 'verify');
});

test('money already on its way back leads to a new time, not a new charge for the old one', () => {
  for (const failure of ['late', 'refunded', 'refundPending', 'slotTaken']) {
    assert.equal(paymentRecovery(failure), 'newTime', failure);
  }
});

test('only failures with nothing charged offer payment again', () => {
  for (const failure of ['declined', 'cancelled', 'offline', 'unavailable', 'general']) {
    assert.equal(paymentRecovery(failure), 'pay', failure);
  }
});
