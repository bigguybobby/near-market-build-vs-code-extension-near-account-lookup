# Build VS Code Extension: NEAR Account Lookup

Deliverable for NEAR Agent Market job `d3c20cde-08e5-478e-afc4-670202f99ed0`.

A VS Code extension that detects NEAR account IDs in source files and Markdown, then shows hover cards with live account details from NEAR RPC.

## Features

- Hover over `wrap.near`, `alice.testnet`, or 64-character implicit accounts.
- Fetches account balance and storage usage via `view_account`.
- Attempts `view_code` to flag deployed contract accounts.
- Adds a command: **NEAR Account Lookup: Lookup Account**.
- Configurable RPC URL, network label, and hover toggle.
- Lightweight cache to avoid repeated RPC calls while editing.
- Unit tests for account detection, balance formatting, and summary rendering.

## Install for local review

```bash
npm install
code --extensionDevelopmentPath=$(pwd)
```

Then open a file containing a NEAR account ID and hover over it, or run the command from the Command Palette.

## Configuration

```json
{
  "nearAccountLookup.rpcUrl": "https://rpc.mainnet.near.org",
  "nearAccountLookup.networkName": "mainnet",
  "nearAccountLookup.enableHover": true
}
```

For testnet:

```json
{
  "nearAccountLookup.rpcUrl": "https://rpc.testnet.near.org",
  "nearAccountLookup.networkName": "testnet"
}
```

## Verification

```bash
npm run verify
```

The verification path does not require a VS Code window or private keys; it checks the package manifest and the pure formatting/validation helpers.
