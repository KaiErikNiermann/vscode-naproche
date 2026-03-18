// ForTheL (Formal Theory Language) grammar for Naproche
// Reverse-engineered from generated grammar.ts after filesystem corruption

grammar ForTheL

entry Model:
    elements+=TopLevel*;

TopLevel:
    Directive | SectionBlock | LetBinding;

// --- Directives: [synonym ...], [read ...], etc. ---

Directive:
    '[' content+=DirectiveToken+ ']';

DirectiveToken:
    value=WORD | value=SYMBOL | value=INT | value='.' | value=',' | value='|';

// --- Let bindings ---

LetBinding:
    'Let' body+=BodyToken+ '.';

// --- Section blocks ---

SectionBlock:
    SignatureBlock | DefinitionBlock | AxiomBlock | TheoremBlock;

SignatureBlock:
    'Signature' name=SectionName? '.' sentences+=SectionSentence+;

DefinitionBlock:
    'Definition' name=SectionName? '.' sentences+=SectionSentence+;

AxiomBlock:
    'Axiom' name=SectionName? '.' sentences+=SectionSentence+;

TheoremBlock:
    kind=TheoremKind name=SectionName? '.' sentences+=SectionSentence+ proof=ProofBlock?;

TheoremKind returns string:
    'Theorem' | 'Proposition' | 'Lemma' | 'Corollary';

SectionName:
    segments+=WORD+;

SectionSentence:
    body+=SectionBodyToken+ '.';

// --- Proof blocks ---

ProofBlock:
    ('Proof' | 'proof') method=ProofMethod? '.' sentences+=ProofSentence*;

ProofMethod:
    'by' method=ProofMethodKind;

ProofMethodKind returns string:
    'contradiction' | 'induction';

ProofSentence:
    body+=ProofBodyToken+ '.';

// --- Token rules ---
// These capture the "token soup" that makes up ForTheL sentences.
// Actual ForTheL semantics are handled downstream, not by the parser.

BodyToken:
    value=WORD | value=INT | value=SYMBOL | value=STRING
    | value='(' | value=')' | value='{' | value='}'
    | value='[' | value=']' | value=',' | value='|'
    | value='by' | value='contradiction' | value='induction';

SectionBodyToken:
    value=WORD | value=INT | value=SYMBOL | value=STRING
    | value='(' | value=')' | value='{' | value='}'
    | value='[' | value=']' | value=',' | value='|'
    | value='Let'
    | value='by' | value='contradiction' | value='induction';

ProofBodyToken:
    value=WORD | value=INT | value=SYMBOL | value=STRING
    | value='(' | value=')' | value='{' | value='}'
    | value='[' | value=']' | value=',' | value='|'
    | value='Let'
    | value='Proof' | value='proof'
    | value='End' | value='end' | value='Qed' | value='qed'
    | value='Case' | value='Trivial' | value='Obvious'
    | value='by' | value='contradiction' | value='induction';

// --- Terminal rules ---

hidden terminal WS: /\s+/;
hidden terminal SL_COMMENT: /#[^\n\r]*/;

terminal WORD: /\\?[a-zA-Z_\u0391-\u03C9][a-zA-Z_0-9\u0391-\u03C9]*/;
terminal INT returns number: /[0-9]+/;
terminal SYMBOL: /[!@#$%^&*+=<>\-~`?:;\/\\]+|\.(?=[=<>])/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
