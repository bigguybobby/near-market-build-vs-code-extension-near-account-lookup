const test = require('node:test');
const assert = require('node:assert/strict');
const { isNearAccountId, formatYoctoNear, explorerUrl, compactAccountSummary } = require('../src/format');

test('detects NEAR account IDs', () => {
  assert.equal(isNearAccountId('wrap.near'), true);
  assert.equal(isNearAccountId('alice.testnet'), true);
  assert.equal(isNearAccountId('A.wrap.near'), false);
  assert.equal(isNearAccountId('bad account.near'), false);
});

test('formats balances', () => {
  assert.equal(formatYoctoNear('1000000000000000000000000'), '1 NEAR');
  assert.equal(formatYoctoNear('1234500000000000000000000'), '1.2345 NEAR');
});

test('builds explorer URLs and summary', () => {
  assert.equal(explorerUrl('wrap.near', 'testnet'), 'https://testnet.nearblocks.io/address/wrap.near');
  const summary = compactAccountSummary('wrap.near', { amount: '1', storage_usage: 10 }, { present: true, codeSize: 99 });
  assert.equal(summary.some((line) => /Contract: deployed/.test(line)), true);
});
