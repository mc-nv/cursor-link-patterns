import * as vscode from 'vscode';

function buildUrl(template: string, match: RegExpExecArray): string {
  return template
    .replace(/(^|[^\\])\$(\d)/g, (_, prefix: string, idx: string) => {
      return prefix + (match[Number(idx)] ?? `$${idx}`);
    })
    .replace(/\\\$/g, '$');
}

function withGlobalFlag(flags: string): string {
  return flags.includes('g') ? flags : `${flags}g`;
}

export class LinkDefinitionProvider implements vscode.DocumentLinkProvider {
  constructor(
    private readonly pattern: string,
    private readonly flags: string,
    private readonly targetTemplate: string,
  ) {}

  provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
    const regEx = new RegExp(this.pattern, withGlobalFlag(this.flags));
    const text = document.getText();
    const links: vscode.DocumentLink[] = [];

    let match: RegExpExecArray | null;
    while ((match = regEx.exec(text)) !== null) {
      const start = document.positionAt(match.index);
      const end = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(start, end);
      const target = vscode.Uri.parse(buildUrl(this.targetTemplate, match));
      links.push(new vscode.DocumentLink(range, target));
    }

    return links;
  }
}
