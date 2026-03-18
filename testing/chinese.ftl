# Chinese Remainder Theorem style
# Modular arithmetic with divisibility.
# Demonstrates: synonyms, arithmetic signatures, named axioms, equational chains.

[synonym number/-s]

Signature. A number is a notion.

Let a, b, c, n denote numbers.

Signature Zero. 0 is a number.
Signature One. 1 is a number.

Signature Plus. a + b is a number.
Signature Times. a * b is a number.
Signature Neg. -a is a number.

Let a - b stand for a + (-b).

Axiom AddComm. a + b = b + a.
Axiom AddAssoc. a + (b + c) = (a + b) + c.
Axiom AddZero. a + 0 = a.
Axiom AddNeg. a + (-a) = 0.

Axiom MulComm. a * b = b * a.
Axiom MulAssoc. a * (b * c) = (a * b) * c.
Axiom MulOne. a * 1 = a.

Axiom Distrib. a * (b + c) = (a * b) + (a * c).

Axiom ZeroLeft. 0 + a = a.
Axiom NonTriv. 0 != 1.
Axiom ZeroMul. a * 0 = 0.

Let a is nonzero stand for a != 0.
Let p, q denote nonzero numbers.

Definition Divides. p divides b iff there exists a number n
such that p * n = b.

Let p | b stand for p divides b.

Definition Congruent. a = b (mod p) iff p | (a - b).

Lemma ModRefl. a = a (mod p).
Proof.
  a - a = 0. Indeed a + (-a) = 0.
  p * 0 = 0.
  Hence p | (a - a).
Qed.
