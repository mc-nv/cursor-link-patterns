import * as vscode from 'vscode';

interface PatternTerminalLink extends vscode.TerminalLink {
  url: string;
}

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

export class TerminalLinkProvider implements vscode.TerminalLinkProvider<PatternTerminalLink> {
  constructor(
    private readonly pattern: string,
    private readonly flags: string,
    private readonly targetTemplate: string,
  ) {}

  provideTerminalLinks(
    context: vscode.TerminalLinkContext,
    _token: vscode.CancellationToken,
  ): PatternTerminalLink[] {
    const regEx = new RegExp(this.pattern, withGlobalFlag(this.flags));
    const links: PatternTerminalLink[] = [];

    let match: RegExpExecArray | null;
    while ((match = regEx.exec(context.line)) !== null) {
      const url = buildUrl(this.targetTemplate, match);
      links.push({
        startIndex: match.index,
        length: match[0].length,
        tooltip: `Open: ${url}`,
        url,
      });
    }

    return links;
  }

  handleTerminalLink(link: PatternTerminalLink): void {
    vscode.env.openExternal(vscode.Uri.parse(link.url));
  }
}
