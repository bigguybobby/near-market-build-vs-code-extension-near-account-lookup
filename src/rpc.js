async function rpcQuery(rpcUrl, params) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'near-account-lookup', method: 'query', params })
  });
  const payload = await response.json();
  if (payload.error) {
    const message = payload.error.cause && payload.error.cause.info && payload.error.cause.info.error_message
      ? payload.error.cause.info.error_message
      : payload.error.message || 'NEAR RPC error';
    throw new Error(message);
  }
  return payload.result;
}

async function lookupAccount(accountId, rpcUrl) {
  const account = await rpcQuery(rpcUrl, { request_type: 'view_account', finality: 'final', account_id: accountId });
  let contract = { present: false };
  try {
    const code = await rpcQuery(rpcUrl, { request_type: 'view_code', finality: 'final', account_id: accountId });
    const codeBase64 = code.code_base64 || '';
    contract = {
      present: Boolean(codeBase64),
      codeSize: codeBase64 ? Math.floor((codeBase64.length * 3) / 4) : 0,
      codeHash: code.hash || null,
      blockHeight: code.block_height || null,
    };
  } catch (_) {
    contract = { present: false };
  }
  return { account, contract };
}

module.exports = { rpcQuery, lookupAccount };
