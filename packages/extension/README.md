# vscode-naproche extension

The VS Code extension package for ForTheL language support. Provides the language client, TextMate grammars, and language configuration.

## What's in this package

```
src/
  extension/main.ts     VS Code extension entry point, starts the language client
  language/main.ts      Language server entry point, starts the Langium LSP server
syntaxes/
  for-the-l.tmLanguage.json       TextMate grammar for .ftl files
  for-the-l-tex.tmLanguage.json   TextMate grammar for .ftl.tex files
language-configuration.json       Bracket matching, comments, etc. for .ftl
language-configuration-tex.json   Same for .ftl.tex
package.json                      Extension manifest (contributes, activation, etc.)
esbuild.mjs                       Bundler config (produces single .cjs output)
```

## Language support

| Feature | .ftl | .ftl.tex |
|---------|------|----------|
| Syntax highlighting (TextMate) | Yes | Yes |
| Semantic tokens (notions, labels) | Yes | -- |
| Validation diagnostics | Yes | -- |
| Quick-fix code actions | Yes | -- |
| Bracket matching | Yes | Yes |

The Langium grammar currently targets `.ftl` only. The `.ftl.tex` TextMate grammar provides basic highlighting but no LSP features.

## Extension activation

The extension activates on `onLanguage:for-the-l` (when a `.ftl` file is opened). It starts a language server in the same process using Langium's `startLanguageServer`.

## Provided diagnostics

The language server reports these diagnostics (from the validator in `packages/language`):

| Code | Severity | Description |
|------|----------|-------------|
| `reserved-word` | Warning | Signature redeclares a Naproche built-in (`set`, `element`, etc.) |
| `missing-synonym` | Warning | Notion declared without `[synonym]` -- plural won't be recognized |
| `undefined-reference` | Warning | `(by Name)` cites a name not declared in the file |
| `missing-proof` | Hint | Theorem/Lemma has no `Proof. ... Qed.` block |
| `bad-synonym-format` | Error | `[synonym]` directive missing `/` separator |

## Quick fixes (Ctrl+.)

| Diagnostic | Action |
|------------|--------|
| Missing synonym | Insert `[synonym word/-s]` at top of file |
| Undefined reference | Create template `Axiom Name.` or `Lemma Name.` with proof block |
| Missing proof | Append `Proof. ... Qed.` after the theorem |

## Semantic token types

| Token type | Applied to |
|------------|-----------|
| `type` | Declared notion words and their synonym forms (e.g. "number", "numbers") |
| `enum` | Section labels (e.g. "AddComm" in `Axiom AddComm.` or `(by AddComm)`) |
| `macro` | Directive keywords (`synonym`, `read`, `exit`) |

## Building

From the workspace root:

```sh
pnpm run build          # build everything
pnpm run install-local  # package .vsix and install into VS Code
```

Or press F5 to launch the Extension Development Host.

## Packaging

```sh
pnpm run package   # creates vscode-naproche.vsix in the workspace root
```
