import * as vscode from 'vscode';
import { getConfig } from './config';
import { LinkDefinitionProvider } from './LinkDefinitionProvider';
import { TerminalLinkProvider } from './TerminalLinkProvider';

let activeDisposables: vscode.Disposable[] = [];

function clearDisposables(): void {
  activeDisposables.forEach((d) => d.dispose());
  activeDisposables = [];
}

function initFromConfig(): void {
  clearDisposables();

  const { rules } = getConfig();

  for (const rule of rules) {
    const docProvider = vscode.languages.registerDocumentLinkProvider(
      rule.languages.map((language) => ({ language })),
      new LinkDefinitionProvider(rule.linkPattern, rule.linkPatternFlags, rule.linkTarget),
    );

    const termProvider = vscode.window.registerTerminalLinkProvider(
      new TerminalLinkProvider(rule.linkPattern, rule.linkPatternFlags, rule.linkTarget),
    );

    activeDisposables.push(docProvider, termProvider);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  initFromConfig();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('cursorLinkPatterns')) {
        initFromConfig();
      }
    }),
    { dispose: clearDisposables },
  );
}

export function deactivate(): void {
  clearDisposables();
}
