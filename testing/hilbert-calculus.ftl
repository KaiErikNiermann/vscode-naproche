# Hilbert-style Propositional Calculus
# Demonstrates: formula signatures, deducibility, modus ponens.

[synonym formula/-s]

Signature. A formula is a notion.

Let P, Q, R denote formulas.

Signature. imp(P, Q) is a formula.
Signature. ded(P) is an atom.

# Axiom schemas.

Axiom Implosion. ded(imp(P, imp(Q, P))).

Axiom Chain. ded(imp(imp(P, imp(Q, R)), imp(imp(P, Q), imp(P, R)))).

# Modus ponens.

Axiom Detach. If ded(P) and ded(imp(P, Q)) then ded(Q).

# Derive: ded(imp(P, P)).

Lemma Identity. ded(imp(P, P)).
Proof.
  ded(imp(P, imp(imp(P, P), P))) (by Implosion).
  ded(imp(imp(P, imp(imp(P, P), P)), imp(imp(P, imp(P, P)), imp(P, P)))) (by Chain).
  ded(imp(imp(P, imp(P, P)), imp(P, P))) (by Detach).
  ded(imp(P, imp(P, P))) (by Implosion).
  ded(imp(P, P)) (by Detach).
Qed.
