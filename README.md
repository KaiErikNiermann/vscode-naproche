# vscode-naproche

VS Code extension providing language support for [Naproche](https://github.com/naproche/naproche)'s ForTheL (Formal Theory Language). Built with [Langium](https://langium.org/).

ForTheL is a controlled natural language for writing formal mathematical proofs that can be automatically verified by the Naproche proof checker and the E automated theorem prover.

## Features

- Syntax highlighting for `.ftl` and `.ftl.tex` files
- Semantic token highlighting -- declared notions and synonym forms are visually distinct from filler words
- Validation diagnostics with "Did you mean X?" suggestions for common pitfalls:
  - Redeclaring Naproche built-in words (`set`, `element`, `function`, ...)
  - Missing `[synonym]` directives for custom notions
  - Referencing undefined axiom/lemma names in `(by ...)` citations
  - Theorems without proof blocks
- Quick-fix code actions (Ctrl+.):
  - Insert `[synonym word/-s]` for undeclared plurals
  - Create template `Axiom Name.` or `Lemma Name.` for undefined references
  - Add `Proof. ... Qed.` block to theorems
- Bracket matching and auto-closing for `[ ]`, `{ }`, `( )`

## Project structure

```
packages/
  language/         Langium grammar, AST, validator, semantic tokens
  extension/        VS Code extension entry point, TextMate grammars
testing/            23 verified .ftl test files (Naproche proof corpus)
  broken-samples/   Files that intentionally trigger each diagnostic
```

## Getting started

### Prerequisites

- Node.js >= 20
- pnpm

### Build

```sh
pnpm install
pnpm run build
```

### Install locally

```sh
pnpm run install-local
# or with just:
just install-local
```

This builds the extension, packages a `.vsix`, and installs it into VS Code. Reload the window to activate.

### Development

```sh
# Watch mode (recompiles on save)
pnpm run watch

# Run tests
pnpm run test

# Lint
pnpm run lint
```

Or press F5 in VS Code to launch an Extension Development Host with the extension loaded.

## Running Naproche

The extension provides editor support only. To verify `.ftl` files you need the Naproche binary and E prover:

```sh
# Set the prover path
export NAPROCHE_EPROVER=/path/to/eprover

# Verify a file
naproche -t 10 file.ftl

# LaTeX dialect
naproche -t 10 --dialect=tex file.ftl.tex

# Parse only (no proving)
naproche -n file.ftl
```

See [NAPROCHE-SYNTAX.md](https://github.com/naproche/naproche) for the full ForTheL language reference.

## ForTheL quick reference

```forthl
# Comments start with #
[synonym number/-s]                    # declare plural forms

Signature. A number is a notion.       # declare a sort
Signature. n + m is a number.          # declare an operation
Signature. n <= m is an atom.          # declare a relation

Let n, m denote numbers.               # bind variables

Definition. n is even iff there exists m such that n = 2 * m.

Axiom AddComm. n + m = m + n.

Theorem. 0 + 0 = 0.
Proof.
  0 + 0 = 0.
Qed.
```

## Testing corpus

The `testing/` directory contains 21 self-contained `.ftl` files covering:

| File | Topic |
|------|-------|
| `basic-arithmetic.ftl` | Peano arithmetic, successor, addition |
| `basic-sets.ftl` | Set membership, subclass |
| `cantor.ftl` | Cantor's diagonal argument |
| `chinese.ftl` | Modular arithmetic, divisibility |
| `classes.ftl` | Class theory, extensionality |
| `dwarfs.ftl` | Logic puzzle (truth-tellers and liars) |
| `furstenberg.ftl` | Integer theory, primes, congruence |
| `hang.ftl` | Graph reachability |
| `hausdorff.ftl` | Topological separation |
| `hilbert-calculus.ftl` | Hilbert-style propositional calculus |
| `koenig.ftl` | Functions, injectivity |
| `macros.ftl` | Let-binding abbreviations |
| `maximum_modulus.ftl` | Total ordering, max function |
| `nested_existential.ftl` | Nested quantifiers |
| `newman.ftl` | Abstract rewriting, confluence |
| `preliminaries.ftl` | Set theory basics |
| `prime_no_square.ftl` | Primes, divisibility |
| `tarski.ftl` | Fixed point, monotone functions |
| `vocabulary.ftl` | Synonym directives, plurals |

All files pass `naproche -t 15` verification.

## License

MIT
