// VS Code Extension: Build VS Code Extension: NEAR Account Lookup
// ## Overview Create a VS Code extension that provides quick account lookups - hover over any NEAR account ID to see balance and details.  ## Why This Matters Account lookups are frequent during development. Quick inline info improves developer experience.  ## Technical Requirements - Detect NEAR acco

const vscode = require("vscode");

function activate(context) {
    const disposable = vscode.commands.registerCommand("extension.run", () => {
        vscode.window.showInformationMessage("Extension running!");
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}
module.exports = { activate, deactivate };
