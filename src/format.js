const YOCTO = 10n ** 24n;
const NAMED_ACCOUNT_RE = /^(?=.{2,64}$)([a-z0-9]+[a-z0-9_-]*\.)+[a-z0-9][a-z0-9_-]*$/;
const IMPLICIT_ACCOUNT_RE = /^[a-f0-9]{64}$/;

function isNearAccountId(value) {
  const text = String(value || '').trim();
  return NAMED_ACCOUNT_RE.test(text) || IMPLICIT_ACCOUNT_RE.test(text);
}

function formatYoctoNear(value) {
  const yocto = BigInt(String(value || '0'));
  const whole = yocto / YOCTO;
  const fraction = yocto % YOCTO;
  const decimals = fraction.toString().padStart(24, '0').slice(0, 5).replace(/0+$/, '');
  return `${whole.toString()}${decimals ? `.${decimals}` : ''} NEAR`;
}

function explorerUrl(accountId, networkName = 'mainnet') {
  const host = networkName === 'testnet' ? 'https://testnet.nearblocks.io' : 'https://nearblocks.io';
  return `${host}/address/${encodeURIComponent(accountId)}`;
}

function compactAccountSummary(accountId, account, contract, networkName = 'mainnet') {
  return [
    `**${accountId}** (${networkName})`,
    `Balance: ${formatYoctoNear(account.amount || '0')}`,
    `Storage: ${account.storage_usage || 0} bytes`,
    contract && contract.present ? `Contract: deployed (${contract.codeSize || 0} bytes)` : 'Contract: no deployed code detected',
  ];
}

module.exports = { isNearAccountId, formatYoctoNear, explorerUrl, compactAccountSummary };
