const vscode = require('vscode');
const { isNearAccountId, explorerUrl, compactAccountSummary } = require('./src/format');
const { lookupAccount } = require('./src/rpc');

const ACCOUNT_REGEX = /\b(?:[a-z0-9]+[a-z0-9_-]*\.)+[a-z0-9][a-z0-9_-]*\b|\b[a-f0-9]{64}\b/g;
const cache = new Map();

function config() {
  const cfg = vscode.workspace.getConfiguration('nearAccountLookup');
  return {
    rpcUrl: cfg.get('rpcUrl'),
    networkName: cfg.get('networkName'),
    enableHover: cfg.get('enableHover'),
  };
}

async function cachedLookup(accountId, rpcUrl) {
  const key = `${rpcUrl}:${accountId}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < 60_000) return cached.value;
  const value = await lookupAccount(accountId, rpcUrl);
  cache.set(key, { time: Date.now(), value });
  return value;
}

function wordAt(document, position) {
  const range = document.getWordRangeAtPosition(position, ACCOUNT_REGEX);
  return range ? { text: document.getText(range), range } : null;
}

async function hoverFor(document, position) {
  const found = wordAt(document, position);
  if (!found || !isNearAccountId(found.text)) return undefined;
  const { rpcUrl, networkName } = config();
  try {
    const { account, contract } = await cachedLookup(found.text, rpcUrl);
    const md = new vscode.MarkdownString(compactAccountSummary(found.text, account, contract, networkName).join('\n\n'));
    md.appendMarkdown(`\n\n[Open in NearBlocks](${explorerUrl(found.text, networkName)})`);
    md.isTrusted = true;
    return new vscode.Hover(md, found.range);
  } catch (error) {
    return new vscode.Hover(`NEAR lookup failed for \`${found.text}\`: ${error.message}`, found.range);
  }
}

async function lookupCommand() {
  const accountId = await vscode.window.showInputBox({ prompt: 'NEAR account ID', placeHolder: 'wrap.near' });
  if (!accountId) return;
  if (!isNearAccountId(accountId)) {
    vscode.window.showErrorMessage('Invalid NEAR account ID.');
    return;
  }
  const { rpcUrl, networkName } = config();
  const channel = vscode.window.createOutputChannel('NEAR Account Lookup');
  channel.show(true);
  channel.appendLine(`Looking up ${accountId} via ${rpcUrl}…`);
  try {
    const { account, contract } = await cachedLookup(accountId, rpcUrl);
    channel.appendLine(compactAccountSummary(accountId, account, contract, networkName).join('\n'));
    channel.appendLine(explorerUrl(accountId, networkName));
  } catch (error) {
    channel.appendLine(`Lookup failed: ${error.message}`);
    vscode.window.showErrorMessage(`NEAR lookup failed: ${error.message}`);
  }
}

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('nearAccountLookup.lookup', lookupCommand));
  context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: '*', language: '*' }, {
    provideHover(document, position) {
      if (!config().enableHover) return undefined;
      return hoverFor(document, position);
    }
  }));
}

function deactivate() {}

module.exports = { activate, deactivate, hoverFor, wordAt };
