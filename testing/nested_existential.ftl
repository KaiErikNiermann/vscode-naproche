# Nested Existential Quantifiers
# Tests nested quantifiers with multiple layers.
# Demonstrates: for all / there exists nesting in theorems and proofs.

[synonym number/-s]

Signature. A number is a notion.

Let m, n, k denote numbers.

Signature. 0 is a number.
Signature. succ(n) is a number.

Axiom SuccNotZero. succ(n) != 0.
Axiom SuccInj. If succ(m) = succ(n) then m = n.

Signature. n + m is a number.

Axiom PlusZero. n + 0 = n.
Axiom PlusSucc. n + succ(m) = succ(n + m).

Lemma. For all numbers n n + 0 = n.

Lemma Ex1. There exists a number k such that succ(0) = succ(k).
Proof.
  succ(0) = succ(0).
Qed.

Lemma Ex2. For all numbers n there exists a number k
such that succ(n) = succ(k).
Proof.
  Let n be a number.
  succ(n) = succ(n).
Qed.

Lemma Ex3. For all numbers n there exists a number k
such that n + succ(0) = succ(k).
Proof.
  Let n be a number.
  n + succ(0) = succ(n + 0) = succ(n).
Qed.
