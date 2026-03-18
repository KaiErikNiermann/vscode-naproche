# Number Theory: Primes and Divisibility
# Self-contained formalization of basic number theory.
# Demonstrates: integers, divisibility, primes, modular arithmetic.

[synonym number/-s]

Signature. A number is a notion.

Let a, b, c, n, m denote numbers.

Signature. 0 is a number.
Signature. 1 is a number.
Signature. a + b is a number.
Signature. a * b is a number.
Signature. -a is a number.

Let a - b stand for a + (-b).

Axiom AddComm. a + b = b + a.
Axiom AddAssoc. a + (b + c) = (a + b) + c.
Axiom AddZero. a + 0 = a.
Axiom ZeroAdd. 0 + a = a.
Axiom AddNeg. a + (-a) = 0.

Axiom MulComm. a * b = b * a.
Axiom MulAssoc. a * (b * c) = (a * b) * c.
Axiom MulOne. a * 1 = a.
Axiom OneMul. 1 * a = a.

Axiom Distrib. a * (b + c) = (a * b) + (a * c).

Axiom NonTriv. 0 != 1.
Axiom ZeroMul. a * 0 = 0.
Axiom NoZeroDiv. If a != 0 and b != 0 then a * b != 0.

Let a is nonzero stand for a != 0.
Let p, q denote nonzero numbers.

Signature. a is prime is an atom.

Axiom PrimeNonzero. If a is prime then a is nonzero.
Axiom PrimeNotOne. If a is prime then a != 1.

Definition Divides. p divides a iff there exists a number n
such that p * n = a.

Let p | a stand for p divides a.

Lemma DivRefl. p | p.
Proof.
  p * 1 = p.
Qed.

Lemma DivZero. p | 0.
Proof.
  p * 0 = 0.
Qed.

Definition Congruent. a = b (mod p) iff p | (a - b).

Lemma ModRefl. a = a (mod p).
Proof.
  a - a = 0.
  p * 0 = 0.
  Hence p | (a - a).
Qed.
