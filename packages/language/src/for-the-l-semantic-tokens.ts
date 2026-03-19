import { type AstNode, AstUtils } from 'langium';
import { AbstractSemanticTokenProvider, type SemanticTokenAcceptor } from 'langium/lsp';
import { SemanticTokenTypes } from 'vscode-languageserver-types';
import {
    isDirective,
    isSignatureBlock,
    isDefinitionBlock,
    isAxiomBlock,
    isTheoremBlock,
    isLetBinding,
    isModel,
    type Model,
    type Directive,
    type SectionSentence,
} from './generated/ast.js';

/**
 * Collects all synonym roots and their plural forms from [synonym ...] directives.
 * Returns a set of all recognized notion words (singular + plural).
 */
function collectAllSynonymForms(model: Model): Set<string> {
    const forms = new Set<string>();
    for (const el of model.elements) {
        if (isDirective(el)) {
            const tokens = el.content.map(t => String(t.value));
            if (tokens[0] === 'synonym' && tokens.length >= 2) {
                const raw = tokens.slice(1).join('');
                const parts = raw.split('/');
                const root = parts[0]!;
                forms.add(root);
                for (let i = 1; i < parts.length; i++) {
                    const suffix = parts[i]!;
                    if (suffix.startsWith('-')) {
                        // e.g. "-s" -> root + "s", "-es" -> root + "es"
                        forms.add(root + suffix.slice(1));
                    } else {
                        // e.g. "vertices" (irregular)
                        forms.add(suffix);
                    }
                }
            }
        }
    }
    return forms;
}

/**
 * Collects all notion words introduced via Signature blocks.
 * e.g. "Signature. A morphism is a notion." -> "morphism"
 */
function collectDeclaredNotions(model: Model): Set<string> {
    const notions = new Set<string>();
    for (const el of model.elements) {
        if (isSignatureBlock(el)) {
            for (const sentence of el.sentences) {
                const text = sentence.body.map(t => String(t.value)).join(' ');
                const match = /^(?:A|An)\s+(\w+)\s+is\s+a\s+(?:notion|mathematical\s+object)/i.exec(text);
                if (match?.[1]) {
                    notions.add(match[1]);
                }
            }
        }
    }
    return notions;
}

/** Collects all named section labels (Axiom Name, Lemma Name, etc.) */
function collectSectionNames(model: Model): Set<string> {
    const names = new Set<string>();
    for (const el of model.elements) {
        if (isAxiomBlock(el) || isDefinitionBlock(el) || isSignatureBlock(el) || isTheoremBlock(el)) {
            if (el.name) {
                for (const seg of el.name.segments) {
                    names.add(seg);
                }
            }
        }
    }
    return names;
}

/**
 * Provides semantic token highlighting for ForTheL documents.
 *
 * Highlights:
 * - Declared synonyms/notion words as `type` (distinct from filler)
 * - Section names (axiom/theorem labels) as `enum` (label-like)
 * - Directive keywords (synonym, read, exit) as `macro`
 */
export class ForTheLSemanticTokenProvider extends AbstractSemanticTokenProvider {

    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void | 'prune' {
        const root = AstUtils.getDocument(node).parseResult.value;
        if (!isModel(root)) return;

        // Cache sets on the model (computed once per highlight pass)
        const cache = this.getCache(root);

        if (isDirective(node)) {
            this.highlightDirective(node, acceptor);
            return 'prune';
        }

        if (isLetBinding(node)) {
            // Highlight notion words in Let bindings
            for (let i = 0; i < node.body.length; i++) {
                const token = node.body[i]!;
                const val = String(token.value);
                if (cache.allNotionForms.has(val)) {
                    acceptor({ node, property: 'body', index: i, type: SemanticTokenTypes.type });
                }
            }
            return 'prune';
        }

        if (isSignatureBlock(node) || isDefinitionBlock(node) || isAxiomBlock(node) || isTheoremBlock(node)) {
            // Highlight the section name as enum/label
            if (node.name) {
                for (let i = 0; i < node.name.segments.length; i++) {
                    acceptor({ node: node.name, property: 'segments', index: i, type: SemanticTokenTypes.enum });
                }
            }

            // Highlight notion words in sentence bodies
            for (const sentence of node.sentences) {
                this.highlightSentenceTokens(sentence, cache, acceptor);
            }

            // Highlight notion words and references in proof sentences
            if (isTheoremBlock(node) && node.proof) {
                for (const sentence of node.proof.sentences) {
                    for (let i = 0; i < sentence.body.length; i++) {
                        const token = sentence.body[i]!;
                        const val = String(token.value);
                        if (cache.allNotionForms.has(val)) {
                            acceptor({ node: sentence, property: 'body', index: i, type: SemanticTokenTypes.type });
                        } else if (cache.sectionNames.has(val)) {
                            acceptor({ node: sentence, property: 'body', index: i, type: SemanticTokenTypes.enum });
                        }
                    }
                }
            }

            return 'prune';
        }

        return undefined;
    }

    private highlightDirective(node: Directive, acceptor: SemanticTokenAcceptor): void {
        for (let i = 0; i < node.content.length; i++) {
            const val = String(node.content[i]!.value);
            if (val === 'synonym' || val === 'read' || val === 'exit' || val === 'quit') {
                acceptor({ node, property: 'content', index: i, type: SemanticTokenTypes.macro });
            }
        }
    }

    private highlightSentenceTokens(
        sentence: SectionSentence,
        cache: HighlightCache,
        acceptor: SemanticTokenAcceptor,
    ): void {
        for (let i = 0; i < sentence.body.length; i++) {
            const token = sentence.body[i]!;
            const val = String(token.value);
            if (cache.allNotionForms.has(val)) {
                acceptor({ node: sentence, property: 'body', index: i, type: SemanticTokenTypes.type });
            } else if (cache.sectionNames.has(val)) {
                acceptor({ node: sentence, property: 'body', index: i, type: SemanticTokenTypes.enum });
            }
        }
    }

    // Simple per-model cache to avoid recomputing sets for every node.
    private cacheMap = new WeakMap<Model, HighlightCache>();

    private getCache(model: Model): HighlightCache {
        let cache = this.cacheMap.get(model);
        if (!cache) {
            const synonymForms = collectAllSynonymForms(model);
            const notions = collectDeclaredNotions(model);
            // Combine: a word is a notion form if it's declared via Signature or via synonym
            const allNotionForms = new Set([...synonymForms, ...notions]);
            const sectionNames = collectSectionNames(model);
            cache = { allNotionForms, sectionNames };
            this.cacheMap.set(model, cache);
        }
        return cache;
    }
}

interface HighlightCache {
    allNotionForms: Set<string>;
    sectionNames: Set<string>;
}
