import type { AstNode, ValidationAcceptor, ValidationChecks } from 'langium';
import type {
    ForTheLAstType,
    Model,
    Directive,
    SignatureBlock,
    SectionSentence,
    TheoremBlock,
    AxiomBlock,
    DefinitionBlock,
} from './generated/ast.js';
import {
    isDirective,
    isSignatureBlock,
    isAxiomBlock,
    isDefinitionBlock,
    isTheoremBlock,
} from './generated/ast.js';
import type { ForTheLServices } from './for-the-l-module.js';

/** Diagnostic codes used by the CodeActionProvider to identify fixable issues. */
export const IssueCodes = {
    MissingSynonym: 'missing-synonym',
    UndefinedReference: 'undefined-reference',
    ReservedWord: 'reserved-word',
    MissingProof: 'missing-proof',
    BadSynonymFormat: 'bad-synonym-format',
} as const;

/**
 * Register custom validation checks.
 * These produce "Did you mean X?" diagnostics for common Naproche pitfalls.
 */
export function registerValidationChecks(services: ForTheLServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ForTheLValidator;
    const checks: ValidationChecks<ForTheLAstType> = {
        Model: validator.checkModel.bind(validator),
        SignatureBlock: validator.checkSignatureReservedWords.bind(validator),
        TheoremBlock: validator.checkTheoremHasProof.bind(validator),
        Directive: validator.checkDirective.bind(validator),
    };
    registry.register(checks, validator);
}

// Naproche built-in reserved words that should not be redeclared as signatures.
const RESERVED_NOTIONS = new Set([
    'set', 'sets',
    'class', 'classes',
    'collection', 'collections',
    'element', 'elements',
    'object', 'objects',
    'function', 'functions',
    'map', 'maps',
    'notion', 'notions',
]);

// Common English irregular plurals for ForTheL notions.
const COMMON_PLURALS: ReadonlyMap<string, string> = new Map([
    ['vertex', 'vertices'],
    ['matrix', 'matrices'],
    ['basis', 'bases'],
    ['index', 'indices'],
    ['formula', 'formulae'],
    ['criterion', 'criteria'],
    ['hypothesis', 'hypotheses'],
    ['thesis', 'theses'],
    ['analysis', 'analyses'],
    ['supremum', 'suprema'],
    ['infimum', 'infima'],
    ['maximum', 'maxima'],
    ['minimum', 'minima'],
]);

/** Extract the text content of a sentence as a flat string of token values. */
function sentenceText(sentence: SectionSentence): string {
    return sentence.body.map(t => String(t.value)).join(' ');
}

/**
 * Find the token in a sentence body whose value matches the target word.
 * Returns the token node for precise diagnostic highlighting.
 */
function findTokenByValue(sentence: SectionSentence, target: string): AstNode | undefined {
    return sentence.body.find(t => String(t.value) === target);
}

/** Get all declared section names across the file. */
function collectDeclaredNames(model: Model): Set<string> {
    const names = new Set<string>();
    for (const el of model.elements) {
        if (isAxiomBlock(el) || isDefinitionBlock(el) || isSignatureBlock(el) || isTheoremBlock(el)) {
            const block = el as AxiomBlock | DefinitionBlock | SignatureBlock | TheoremBlock;
            if (block.name) {
                names.add(block.name.segments.join(' '));
            }
        }
    }
    return names;
}

/** Collect all synonym declarations from directives. */
function collectSynonyms(model: Model): Set<string> {
    const synonymRoots = new Set<string>();
    for (const el of model.elements) {
        if (isDirective(el)) {
            const tokens = el.content.map(t => String(t.value));
            if (tokens[0] === 'synonym' && tokens.length >= 2) {
                const parts = tokens.slice(1).join('').split('/');
                synonymRoots.add(parts[0]!);
            }
        }
    }
    return synonymRoots;
}

/**
 * Implementation of custom validations for ForTheL.
 */
export class ForTheLValidator {

    /**
     * File-level checks: missing synonyms, undefined references.
     */
    checkModel(model: Model, accept: ValidationAcceptor): void {
        this.checkMissingSynonyms(model, accept);
        this.checkUndefinedReferences(model, accept);
    }

    /**
     * Warn when a Signature redeclares a Naproche built-in word.
     * Highlights the reserved word itself, not the article.
     */
    checkSignatureReservedWords(node: SignatureBlock, accept: ValidationAcceptor): void {
        for (const sentence of node.sentences) {
            const text = sentenceText(sentence);
            const match = /^(?:A|An)\s+(\w+)\s+is\s+a\s+/i.exec(text);
            if (match?.[1] && RESERVED_NOTIONS.has(match[1].toLowerCase())) {
                const targetToken = findTokenByValue(sentence, match[1]);
                accept('warning',
                    `"${match[1]}" is a Naproche built-in and should not be redeclared. ` +
                    `Built-in words: set, class, element, object, function, map, notion.`,
                    {
                        node: targetToken ?? sentence,
                        code: IssueCodes.ReservedWord,
                        data: { word: match[1] },
                    }
                );
            }
        }
    }

    /**
     * Hint when a Theorem/Lemma/Proposition/Corollary has no Proof block.
     */
    checkTheoremHasProof(node: TheoremBlock, accept: ValidationAcceptor): void {
        if (!node.proof) {
            accept('hint',
                `${node.kind} has no proof block. Naproche will attempt auto-proving, ` +
                `which may time out. Consider adding "Proof. ... Qed."`,
                { node, code: IssueCodes.MissingProof }
            );
        }
    }

    /**
     * Check directive syntax for common issues.
     */
    checkDirective(node: Directive, accept: ValidationAcceptor): void {
        const tokens = node.content.map(t => String(t.value));
        if (tokens.length === 0) return;

        if (tokens[0] === 'synonym') {
            const rest = tokens.slice(1).join('');
            if (!rest.includes('/')) {
                accept('error',
                    `Synonym directive must include a slash separator. ` +
                    `Did you mean: [synonym ${rest}/-s] ?`,
                    { node, code: IssueCodes.BadSynonymFormat }
                );
            }
        }
    }

    /**
     * Warn when a notion is declared but no corresponding synonym exists.
     * Highlights the notion word itself, not the article.
     */
    private checkMissingSynonyms(model: Model, accept: ValidationAcceptor): void {
        const synonymRoots = collectSynonyms(model);

        for (const el of model.elements) {
            if (!isSignatureBlock(el)) continue;
            for (const sentence of el.sentences) {
                const text = sentenceText(sentence);
                const match = /^(?:A|An)\s+(\w+)\s+is\s+a\s+(?:notion|mathematical\s+object)/i.exec(text);
                if (!match?.[1]) continue;
                const word = match[1];

                if (RESERVED_NOTIONS.has(word.toLowerCase())) continue;

                if (!synonymRoots.has(word)) {
                    const irregular = COMMON_PLURALS.get(word.toLowerCase());
                    const suggestion = irregular
                        ? `[synonym ${word}/${irregular}]`
                        : `[synonym ${word}/-s]`;
                    const targetToken = findTokenByValue(sentence, word);
                    accept('warning',
                        `No [synonym] declared for "${word}". Naproche won't recognize its plural form. ` +
                        `Did you mean to add: ${suggestion}`,
                        {
                            node: targetToken ?? sentence,
                            code: IssueCodes.MissingSynonym,
                            data: { word, suggestion },
                        }
                    );
                }
            }
        }
    }

    /**
     * Warn when (by Name) references a name that doesn't exist.
     * Highlights the referenced name token.
     */
    private checkUndefinedReferences(model: Model, accept: ValidationAcceptor): void {
        const declaredNames = collectDeclaredNames(model);

        const checkTokensForRefs = (tokens: Array<{ value: string | number; } & AstNode>) => {
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i]!;
                if (String(token.value) === 'by' && i > 0 && String(tokens[i - 1]!.value) === '(') {
                    const refs: Array<{ name: string; token: AstNode }> = [];
                    let j = i + 1;
                    let currentName: string[] = [];
                    let firstToken: AstNode | undefined;
                    while (j < tokens.length) {
                        const v = String(tokens[j]!.value);
                        if (v === ')') break;
                        if (v === ',') {
                            if (currentName.length > 0) {
                                refs.push({ name: currentName.join(' '), token: firstToken ?? tokens[j - 1]! });
                                currentName = [];
                                firstToken = undefined;
                            }
                        } else {
                            if (currentName.length === 0) firstToken = tokens[j]!;
                            currentName.push(v);
                        }
                        j++;
                    }
                    if (currentName.length > 0 && j > i + 1) {
                        refs.push({ name: currentName.join(' '), token: firstToken ?? tokens[j - 1]! });
                    }

                    for (const ref of refs) {
                        if (/^\d+$/.test(ref.name)) continue;

                        if (!declaredNames.has(ref.name)) {
                            accept('warning',
                                `Reference "${ref.name}" not found. ` +
                                `No Axiom, Definition, Lemma, or Theorem named "${ref.name}" exists in this file.`,
                                {
                                    node: ref.token,
                                    code: IssueCodes.UndefinedReference,
                                    data: { name: ref.name },
                                }
                            );
                        }
                    }
                }
            }
        };

        for (const el of model.elements) {
            if (isTheoremBlock(el) && el.proof) {
                for (const sentence of el.proof.sentences) {
                    checkTokensForRefs(sentence.body);
                }
            }
            if (isAxiomBlock(el) || isDefinitionBlock(el) || isSignatureBlock(el) || isTheoremBlock(el)) {
                const block = el as AxiomBlock | DefinitionBlock | SignatureBlock | TheoremBlock;
                for (const sentence of block.sentences) {
                    checkTokensForRefs(sentence.body);
                }
            }
        }
    }
}
