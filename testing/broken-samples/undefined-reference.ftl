# BROKEN: References axiom names that don't exist.
# Expected warning: Reference "AddComm" not found.

[synonym number/-s]
Signature. A number is a notion.
Let m, n denote numbers.
Signature. m + n is a number.

Axiom. m + n = n + m.

Lemma. m + n = n + m.
Proof.
  m + n = n + m (by AddComm).
Qed.
