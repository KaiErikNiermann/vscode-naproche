# Basic Arithmetic
# A simple formalization of natural number arithmetic.
# Demonstrates: signatures, axioms, definitions, lemmas with proofs.

[synonym number/numbers]

Signature. A natural number is a notion.

Signature Zero. 0 is a natural number.
Signature Succ. Let n be a natural number. succ(n) is a natural number.

Let m,n,k denote natural numbers.

Axiom SuccNotZero. succ(m) != 0.
Axiom SuccInj. If succ(m) = succ(n) then m = n.

Signature Plus. m + n is a natural number.

Axiom PlusZero. m + 0 = m.
Axiom PlusSucc. m + succ(n) = succ(m + n).

Signature Times. m * n is a natural number.

Axiom TimesZero. m * 0 = 0.
Axiom TimesSucc. m * succ(n) = (m * n) + m.

# Simple lemmas (no induction needed)

Lemma. succ(0) != 0. Indeed succ(0) is a natural number.

Lemma. 0 + 0 = 0.

Lemma. succ(0) + 0 = succ(0).

Lemma. 0 * succ(0) = (0 * 0) + 0.
