# Macro / Let-binding Tests
# Tests Let-binding abbreviations extensively.
# Demonstrates: multiple Let ... stand for ... patterns used in axioms/lemmas.

[synonym number/-s]

Signature. A number is a notion.

Let m, n, k denote numbers.

Signature. 0 is a number.
Signature. 1 is a number.

Signature. m + n is a number.
Signature. m * n is a number.
Signature. -m is a number.

Let m - n stand for m + (-n).
Let m is nonzero stand for m != 0.
Let m^2 stand for m * m.

Axiom AddZ. m + 0 = m.
Axiom ZAdd. 0 + m = m.
Axiom AddInv. m + (-m) = 0.
Axiom AddComm. m + n = n + m.
Axiom MulOne. m * 1 = m.
Axiom OneMul. 1 * m = m.

# Test that abbreviations work in lemmas.

Lemma. 0 - 0 = 0.
Proof.
  0 - 0 .= 0 + (-0) .= 0 + 0 .= 0 (by AddZ).
Qed.

Lemma. 1^2 = 1.
Proof.
  1^2 .= 1 * 1 .= 1 (by MulOne).
Qed.

Lemma. 0 is nonzero or 0 = 0.
