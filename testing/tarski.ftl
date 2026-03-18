# Tarski-style Fixed Point (simplified)
# Demonstrates: ordering, definitions, simple proofs.

[synonym point/-s]

Signature. A point is a notion.

Let x, y, z denote points.

Signature. x <= y is an atom.

Axiom LeqRefl. x <= x.
Axiom LeqAnti. If x <= y and y <= x then x = y.
Axiom LeqTrans. If x <= y and y <= z then x <= z.

Signature. g(x) is a point.

Axiom Monotone. If x <= y then g(x) <= g(y).

Definition Fixed. x is fixed iff g(x) = x.

Definition Prefixed. x is prefixed iff g(x) <= x.

# If x is fixed then x is prefixed.

Lemma FixedIsPrefixed. If x is fixed then x is prefixed.
Proof.
  Assume x is fixed.
  Then g(x) = x.
  Hence g(x) <= x (by LeqRefl).
Qed.

# If x is prefixed, then g(x) is prefixed.

Lemma MonoPre. If x is prefixed then g(x) is prefixed.
Proof.
  Assume x is prefixed.
  Then g(x) <= x.
  g(g(x)) <= g(x) (by Monotone).
  Hence g(x) is prefixed.
Qed.
