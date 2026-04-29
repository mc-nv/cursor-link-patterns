# cursor-link-patterns

A Cursor / VS Code extension that turns text into clickable links based on regex patterns — in both the **editor** and the **integrated terminal**.

## Features

- Define regex rules that make matching text clickable anywhere in the editor
- Same rules also intercept matching text in the integrated terminal
- Supports capture group substitution (`$0`, `$1`, …) for dynamic URLs
- Rules can be scoped to specific editor languages
- Live reload — config changes apply instantly without restarting

## Installation

### From VSIX

```bash
git clone https://github.com/mc-nv/cursor-link-patterns
cd cursor-link-patterns
npm install
npm run compile
npx vsce package
```

Then in Cursor:

1. Open the Command Palette (`Cmd+Shift+P`)
2. Run `Extensions: Install from VSIX...`
3. Select the generated `cursor-link-patterns-*.vsix` file

### Development mode

```bash
npm install
npm run compile
```

Open the project folder in Cursor and press `F5` to launch an Extension Development Host.

## Configuration

Add rules to your user, workspace, or `.code-workspace` settings:

```json
"cursorLinkPatterns.rules": [
  {
    "linkPattern": "TRI-(\\d+)",
    "linkTarget": "https://linear.app/issue/TRI-$1",
    "languages": ["*"]
  }
]
```

### Rule properties

| Property | Required | Description |
|---|---|---|
| `linkPattern` | Yes | Regular expression to match |
| `linkTarget` | Yes | URL template — `$0` full match, `$1` first capture group, etc. Use `\$` for a literal `$` |
| `linkPatternFlags` | No | Regex flags e.g. `"i"` for case-insensitive. `g` is always added automatically |
| `languages` | No | Editor language IDs to apply the rule to. Defaults to `["*"]` (all). Has no effect on terminal links |

### Examples

**Linear / Jira tickets**
```json
{
  "linkPattern": "TRI-(\\d+)",
  "linkTarget": "https://linear.app/issue/TRI-$1"
}
```

**GitHub PRs**
```json
{
  "linkPattern": "PR#(\\d+)",
  "linkTarget": "https://github.com/my-org/my-repo/pull/$1"
}
```

**Only in markdown files**
```json
{
  "linkPattern": "DOCS-(\\d+)",
  "linkTarget": "https://confluence.example.com/pages/$1",
  "languages": ["markdown"]
}
```

### Workspace settings

Rules can be added per workspace in a `.code-workspace` file:

```json
{
  "folders": [...],
  "settings": {
    "cursorLinkPatterns.rules": [
      {
        "linkPattern": "TRI-(\\d+)",
        "linkTarget": "https://linear.app/issue/TRI-$1"
      }
    ]
  }
}
```

## License

MIT
