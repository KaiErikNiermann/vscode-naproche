# Abstract Rewriting / Confluence
# Demonstrates: custom relation signatures, definitions.

[synonym term/-s]

Signature. A term is a notion.

Let s, t, u, v denote terms.

Signature. red(s, t) is an atom.

Definition Joinable. s and t are joinable iff
there exists a term v such that red(s, v) and red(t, v).

Definition LocalConfl. s is locally confluent iff
for all terms t for all terms u
if red(s, t) and red(s, u) then t and u are joinable.

# A term that reduces to itself is joinable with itself.

Axiom SelfRed. red(s, s).

Lemma SelfJoin. s and s are joinable.
Proof.
  red(s, s) (by SelfRed).
  Hence there exists a term v such that red(s, v) and red(s, v).
Qed.
