import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { parseHelper } from "langium/test";
import type { Model } from "for-the-l-language";
import {
    createForTheLServices,
    isAxiomBlock,
    isDefinitionBlock,
    isDirective,
    isLetBinding,
    isModel,
    isSignatureBlock,
    isTheoremBlock,
} from "for-the-l-language";

let services: ReturnType<typeof createForTheLServices>;
let parse: ReturnType<typeof parseHelper<Model>>;

beforeAll(async () => {
    services = createForTheLServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.ForTheL);
});

describe('Basic parsing', () => {

    test('parse axiom', async () => {
        const doc = await parse('Axiom. a + b = b + a.');
        expectNoErrors(doc);
        expect(doc.parseResult.value.elements).toHaveLength(1);
        expect(isAxiomBlock(doc.parseResult.value.elements[0])).toBe(true);
    });

    test('parse named axiom', async () => {
        const doc = await parse('Axiom AddComm. a + b = b + a.');
        expectNoErrors(doc);
    });

    test('parse definition', async () => {
        const doc = await parse('Definition. A prime is a natural number.');
        expectNoErrors(doc);
        expect(isDefinitionBlock(doc.parseResult.value.elements[0])).toBe(true);
    });

    test('parse multi-sentence definition', async () => {
        const doc = await parse(`
Definition. Let X be a set.
A function of X is a function f such that Dom(f) = X.
        `);
        expectNoErrors(doc);
        const def = doc.parseResult.value.elements[0];
        expect(isDefinitionBlock(def)).toBe(true);
        if (isDefinitionBlock(def)) {
            expect(def.sentences).toHaveLength(2);
        }
    });

    test('parse signature', async () => {
        const doc = await parse('Signature. A natural number is a mathematical object.');
        expectNoErrors(doc);
        expect(isSignatureBlock(doc.parseResult.value.elements[0])).toBe(true);
    });

    test('parse theorem with proof', async () => {
        const doc = await parse(`
Theorem Cantor. No function surjects onto the powerset.
Proof by contradiction.
  Assume the contrary.
Qed.
        `);
        expectNoErrors(doc);
        const thm = doc.parseResult.value.elements[0];
        expect(isTheoremBlock(thm)).toBe(true);
        if (isTheoremBlock(thm)) {
            expect(thm.kind).toBe('Theorem');
            expect(thm.proof).toBeDefined();
            expect(thm.proof?.method?.method).toBe('contradiction');
        }
    });

    test('parse lemma without proof', async () => {
        const doc = await parse('Lemma. a * 0 = 0.');
        expectNoErrors(doc);
        const lem = doc.parseResult.value.elements[0];
        if (isTheoremBlock(lem)) {
            expect(lem.kind).toBe('Lemma');
            expect(lem.proof).toBeUndefined();
        }
    });

    test('parse proposition', async () => {
        const doc = await parse('Proposition. Every natural number is nonnegative.');
        expectNoErrors(doc);
    });

    test('parse corollary', async () => {
        const doc = await parse('Corollary. The empty set has no elements.');
        expectNoErrors(doc);
    });

    test('parse directive', async () => {
        const doc = await parse('[read examples/preliminaries.ftl]');
        expectNoErrors(doc);
        expect(isDirective(doc.parseResult.value.elements[0])).toBe(true);
    });

    test('parse synonym directive', async () => {
        const doc = await parse('[synonym number/numbers]');
        expectNoErrors(doc);
    });

    test('parse let binding', async () => {
        const doc = await parse('Let a,b,c stand for integers.');
        expectNoErrors(doc);
        expect(isLetBinding(doc.parseResult.value.elements[0])).toBe(true);
    });

    test('parse let macro binding', async () => {
        const doc = await parse('Let a divides b stand for a is a divisor of b.');
        expectNoErrors(doc);
    });

    test('ignore comments', async () => {
        const doc = await parse('# This is a comment\nAxiom. x = x.');
        expectNoErrors(doc);
        expect(doc.parseResult.value.elements).toHaveLength(1);
    });
});

describe('Complex examples', () => {

    test('parse Cantor snippet', async () => {
        const doc = await parse(`
# Cantor's Theorem

[read examples/preliminaries.ftl]

Definition. Let X be a set.
A function of X is a function f such that Dom(f) = X.

Definition. Let f be a function and Y be a set.
f surjects onto Y iff Y = {f(x) | x in Dom(f)}.

Definition. Let X,Y be sets.
A function from X onto Y is a function of X that surjects onto Y.

Definition. Let X be a set.
The powerset of X is the collection of subsets of X.

Axiom. The powerset of any set is a set.

Theorem Cantor. Let M be a set.
No function of M surjects onto the powerset of M.

Proof by contradiction.
  Assume the contrary.
  Take a function f from M onto the powerset of M.
  The value of f at any element of M is a set.
  Define N = {x in M | x is not an element of f(x)}.
  N is a subset of M.
  Consider an element z of M such that f(z) = N.
  Contradiction.
Qed.
        `);
        expectNoErrors(doc);
        // 1 directive + 4 definitions + 1 axiom + 1 theorem = 7
        expect(doc.parseResult.value.elements).toHaveLength(7);
    });

    test('parse Furstenberg-style integer theory', async () => {
        const doc = await parse(String.raw`
Signature Integers. An integer is an object.

Let a,b,c,d,i,j,k,l,m,n stand for integers.

Signature IntZero. 0 is an integer.
Signature IntOne. 1 is an integer.
Signature IntNeg. -a is an integer.
Signature IntPlus. a + b is an integer.
Signature IntMult. a * b is an integer.

Let a - b stand for a + (-b).

Axiom AddAsso. a + (b + c) = (a + b) + c.
Axiom AddComm. a + b = b + a.
Axiom AddZero. a + 0 = a = 0 + a.
Axiom AddNeg. a - a = 0 = -a + a.

Axiom MulAsso. a * (b * c) = (a * b) * c.
Axiom MulComm. a * b = b * a.
Axiom MulOne. a * 1 = a = 1 * a.

Axiom Distrib. a * (b + c) = (a*b) + (a*c) and (a + b) * c = (a*c) + (b*c).

Axiom NonTriv. 0 != 1.
Axiom ZeroDiv. a != 0 /\ b != 0 => a * b != 0.

Let a is nonzero stand for a != 0.
Let p,q stand for nonzero integers.

Definition Divisor. A divisor of b is a nonzero integer a
such that for some n (a * n = b).

Let a divides b stand for a is a divisor of b.
Let a | b stand for a is a divisor of b.

Definition EquMod. a = b (mod q) iff q | a-b.

Lemma EquModRef. a = a (mod q).

Lemma EquModSym. a = b (mod q) => b = a (mod q).
Proof.
  Assume that a = b (mod q).
  Take n such that q * n = a - b.
Qed.

Lemma EquModTrn. a = b (mod q) /\ b = c (mod q) => a = c (mod q).
Proof.
  Assume that a = b (mod q) /\ b = c (mod q).
  Take n such that q * n = a - b.
  Take m such that q * m = b - c.
  We have q * (n + m) = a - c.
Qed.
        `);
        expectNoErrors(doc);
    });

    test('parse proof by induction with case', async () => {
        const doc = await parse(`
Theorem. Every natural number is nonnegative.
Proof by induction.
  Let n be a natural number.
  Case n = 0.
    0 is nonnegative.
  End.
Qed.
        `);
        expectNoErrors(doc);
    });

    test('parse inline proof block', async () => {
        const doc = await parse(`
Theorem. X is a subset of Y.
Proof.
  x belongs to X.
  Proof.
    Assume x is in X.
    Then x is in Y.
  End.
Qed.
        `);
        expectNoErrors(doc);
    });

    test('parse lowercase proof/end/qed', async () => {
        const doc = await parse(`
Lemma. X is Y.
Proof.
  Step one.
  proof.
    Step two.
  end.
  Step three.
  proof.
    Step four.
  end.
qed.
        `);
        expectNoErrors(doc);
    });

    test('parse Indeed clause', async () => {
        const doc = await parse('Lemma MulZero. a * 0 = 0 = 0 * a. Indeed a * 0 = a * (1 - 1) = a - a = 0.');
        expectNoErrors(doc);
    });

    test('parse equational reasoning chain (.=)', async () => {
        const doc = await parse(`
Lemma EquModSym. a = b (mod q) => b = a (mod q).
Proof.
  Assume that a = b (mod q).
  Take n such that q * n = a - b.
  q * -n .= (-1) * (q * n) .= (-1) * (a - b).
Qed.
        `);
        expectNoErrors(doc);
    });

    test('parse multiple interleaved sections', async () => {
        const doc = await parse(`
[read examples/preliminaries.ftl]

Signature. A natural number is an object.
Signature. 0 is a natural number.

Let n,m stand for natural numbers.

Definition. n is even iff there exists m such that n = 2 * m.

Axiom. 0 is even.

Theorem. 0 is even.
Proof.
  0 = 2 * 0.
  Qed.

Lemma. x = x.
        `);
        expectNoErrors(doc);
        // directive + sig(2 sentences) + let + def + axiom + theorem + lemma = 7
        expect(doc.parseResult.value.elements).toHaveLength(7);
    });

    test('parse proof with Contradiction terminator', async () => {
        const doc = await parse(`
Theorem. There is no largest prime.
Proof by contradiction.
  Assume the contrary.
  Take n such that n is the largest prime.
  Contradiction.
Qed.
        `);
        expectNoErrors(doc);
    });

    test('parse nested case blocks', async () => {
        const doc = await parse(`
Theorem. P or not P.
Proof.
  Case P holds.
    Then P or not P.
  End.
  Case P does not hold.
    Then not P.
    Then P or not P.
  End.
Qed.
        `);
        expectNoErrors(doc);
    });
});

function expectNoErrors(document: LangiumDocument<Model>) {
    if (document.parseResult.parserErrors.length > 0) {
        const msgs = document.parseResult.parserErrors.map(
            e => `  ${e.message} at ${e.token?.startLine}:${e.token?.startColumn}`
        );
        throw new Error(`Parser errors:\n${msgs.join('\n')}`);
    }
    expect(document.parseResult.lexerErrors).toHaveLength(0);
    expect(isModel(document.parseResult.value)).toBe(true);
}
