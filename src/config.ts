import * as vscode from 'vscode';

export interface Rule {
  linkPattern: string;
  linkPatternFlags: string;
  linkTarget: string;
  languages: string[];
}

export interface Config {
  rules: Rule[];
}

interface RawRule {
  linkPattern?: unknown;
  linkTarget?: unknown;
  linkPatternFlags?: unknown;
  languages?: unknown;
}

export function getConfig(): Config {
  const raw = vscode.workspace.getConfiguration('cursorLinkPatterns');
  const rawRules: RawRule[] = raw.get('rules') ?? [];

  const rules: Rule[] = rawRules
    .filter(
      (r): r is RawRule & { linkPattern: string; linkTarget: string } =>
        typeof r.linkPattern === 'string' &&
        r.linkPattern.length > 0 &&
        typeof r.linkTarget === 'string' &&
        r.linkTarget.length > 0,
    )
    .map((r) => ({
      linkPattern: r.linkPattern,
      linkPatternFlags: typeof r.linkPatternFlags === 'string' ? r.linkPatternFlags : '',
      linkTarget: r.linkTarget,
      languages:
        Array.isArray(r.languages) && r.languages.every((l) => typeof l === 'string')
          ? (r.languages as string[])
          : ['*'],
    }));

  return { rules };
}
