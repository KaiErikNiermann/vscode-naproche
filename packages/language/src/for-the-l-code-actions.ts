import type { CodeActionProvider } from 'langium/lsp';
import type { LangiumDocument } from 'langium';
import type { CodeAction, Diagnostic, Position } from 'vscode-languageserver-types';
import { CodeActionKind, TextEdit } from 'vscode-languageserver-types';
import { IssueCodes } from './for-the-l-validator.js';

// CodeActionParams comes from vscode-languageserver (runtime dep of the extension).
// We type it structurally here to avoid pulling in the full server package.
interface CodeActionParams {
    textDocument: { uri: string };
    range: { start: Position; end: Position };
    context: { diagnostics: Diagnostic[] };
}

/**
 * Provides quick-fix code actions for ForTheL validation diagnostics.
 */
export class ForTheLCodeActionProvider implements CodeActionProvider {
    getCodeActions(document: LangiumDocument, params: CodeActionParams): CodeAction[] | undefined {
        const actions: CodeAction[] = [];
        for (const diagnostic of params.context.diagnostics) {
            const action = this.createAction(diagnostic, document);
            if (action) {
                actions.push(...(Array.isArray(action) ? action : [action]));
            }
        }
        return actions.length > 0 ? actions : undefined;
    }

    private createAction(
        diagnostic: Diagnostic,
        document: LangiumDocument,
    ): CodeAction | CodeAction[] | undefined {
        switch (diagnostic.code) {
            case IssueCodes.MissingSynonym:
                return this.fixMissingSynonym(diagnostic, document);
            case IssueCodes.UndefinedReference:
                return this.fixUndefinedReference(diagnostic, document);
            case IssueCodes.MissingProof:
                return this.fixMissingProof(diagnostic, document);
            default:
                return undefined;
        }
    }

    /**
     * Quick fix: insert [synonym word/-s] at the top of the file.
     */
    private fixMissingSynonym(diagnostic: Diagnostic, document: LangiumDocument): CodeAction {
        const data = diagnostic.data as { word?: string; suggestion?: string } | undefined;
        const suggestion = data?.suggestion ?? '[synonym word/-s]';

        const text = document.textDocument.getText();
        const insertPos = document.textDocument.positionAt(
            this.findSynonymInsertPosition(text)
        );

        return {
            title: `Add ${suggestion}`,
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: true,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        TextEdit.insert(insertPos, `${suggestion}\n`),
                    ],
                },
            },
        };
    }

    /**
     * Quick fix: create a template Axiom or Lemma with the referenced name.
     */
    private fixUndefinedReference(diagnostic: Diagnostic, document: LangiumDocument): CodeAction[] {
        const data = diagnostic.data as { name?: string } | undefined;
        const name = data?.name ?? 'Unknown';

        const text = document.textDocument.getText();
        const refOffset = document.textDocument.offsetAt(diagnostic.range.start);
        const insertOffset = this.findBlockStartBefore(text, refOffset);
        const insertPos = document.textDocument.positionAt(insertOffset);

        return [
            {
                title: `Create "Axiom ${name}."`,
                kind: CodeActionKind.QuickFix,
                diagnostics: [diagnostic],
                isPreferred: true,
                edit: {
                    changes: {
                        [document.textDocument.uri]: [
                            TextEdit.insert(insertPos, `Axiom ${name}. .\n\n`),
                        ],
                    },
                },
            },
            {
                title: `Create "Lemma ${name}."`,
                kind: CodeActionKind.QuickFix,
                diagnostics: [diagnostic],
                edit: {
                    changes: {
                        [document.textDocument.uri]: [
                            TextEdit.insert(insertPos, `Lemma ${name}. .\nProof.\n  .\nQed.\n\n`),
                        ],
                    },
                },
            },
        ];
    }

    /**
     * Quick fix: add a Proof. ... Qed. block after the theorem.
     */
    private fixMissingProof(diagnostic: Diagnostic, document: LangiumDocument): CodeAction {
        const endOffset = document.textDocument.offsetAt(diagnostic.range.end);
        const text = document.textDocument.getText();

        let lineEnd = text.indexOf('\n', endOffset);
        if (lineEnd === -1) lineEnd = text.length;
        const insertPos = document.textDocument.positionAt(lineEnd);

        return {
            title: 'Add proof block',
            kind: CodeActionKind.QuickFix,
            diagnostics: [diagnostic],
            isPreferred: true,
            edit: {
                changes: {
                    [document.textDocument.uri]: [
                        TextEdit.insert(insertPos, `\nProof.\n  .\nQed.\n`),
                    ],
                },
            },
        };
    }

    /** Find insert position for synonym: after existing directives/comments at top. */
    private findSynonymInsertPosition(text: string): number {
        const lines = text.split('\n');
        let pos = 0;
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#') || trimmed.startsWith('[') || trimmed === '') {
                pos += line.length + 1;
            } else {
                break;
            }
        }
        return pos;
    }

    /** Walk backward to find start of the containing block (blank line or start of file). */
    private findBlockStartBefore(text: string, offset: number): number {
        let i = offset - 1;
        while (i > 0) {
            if (text[i] === '\n' && (i === 0 || text[i - 1] === '\n')) {
                return i + 1;
            }
            i--;
        }
        return 0;
    }
}
