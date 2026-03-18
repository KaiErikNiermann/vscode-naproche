# Maximum / Modulus Properties
# Real number ordering, max.
# Demonstrates: arithmetic axioms, ordering, definitions with conditions.

[synonym number/-s]

Signature. A number is a notion.

Let a, b, c denote numbers.

Signature. 0 is a number.
Signature. 1 is a number.

Signature. a + b is a number.
Signature. a * b is a number.
Signature. -a is a number.

Let a - b stand for a + (-b).

Axiom AddComm. a + b = b + a.
Axiom AddAssoc. a + (b + c) = (a + b) + c.
Axiom AddZero. a + 0 = a.
Axiom AddNeg. a + (-a) = 0.

Axiom MulComm. a * b = b * a.
Axiom MulOne. a * 1 = a.

Axiom ZeroLeft. 0 + a = a.

Signature. a <= b is an atom.

Axiom LeRefl. a <= a.
Axiom LeAntiSym. If a <= b and b <= a then a = b.
Axiom LeTrans. If a <= b and b <= c then a <= c.

Let a >= b stand for b <= a.
Let a < b stand for a <= b and a != b.
Let a > b stand for b < a.

Axiom LeTotal. a <= b or b <= a.

Definition DefMax. max(a, b) is a number c such that
(c = a or c = b) and c >= a and c >= b.

Lemma MaxComm. max(a, b) = max(b, a).
Proof.
  max(a, b) >= a and max(a, b) >= b.
  max(b, a) >= b and max(b, a) >= a.
  max(a, b) <= max(b, a).
  Proof.
    max(a, b) = a or max(a, b) = b.
    Case max(a, b) = a. Then a <= max(b, a). End.
    Case max(a, b) = b. Then b <= max(b, a). End.
  End.
  max(b, a) <= max(a, b).
  Proof.
    max(b, a) = b or max(b, a) = a.
    Case max(b, a) = b. Then b <= max(a, b). End.
    Case max(b, a) = a. Then a <= max(a, b). End.
  End.
Qed.

Lemma MaxGeLeft. max(a, b) >= a.
Lemma MaxGeRight. max(a, b) >= b.
