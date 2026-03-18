# Primes and Divisibility
# Demonstrates: proof by contradiction, divisibility reasoning.

[synonym number/-s]

Signature. A number is a notion.

Let a, b, c denote numbers.

Signature. 0 is a number.
Signature. 1 is a number.

Signature. a + b is a number.
Signature. a * b is a number.

Axiom. 0 != 1.
Axiom MulOne. a * 1 = a.
Axiom OneMul. 1 * a = a.
Axiom MulComm. a * b = b * a.
Axiom MulAssoc. a * (b * c) = (a * b) * c.

Definition Divides. a | b iff there exists a number c such that c * a = b.

Let a divides b stand for a | b.

Lemma OneDivides. 1 | a.
Proof.
  a * 1 = a (by MulOne).
  Hence there exists a number c such that c * 1 = a.
Qed.

Lemma DivSelf. a | a.
Proof.
  1 * a = a (by OneMul).
  Hence there exists a number c such that c * a = a.
Qed.
