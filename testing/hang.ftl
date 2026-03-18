# Graph Reachability
# Demonstrates: simple signatures, axioms, chained reasoning.

[synonym node/-s]

Signature. A node is a notion.

Let u, v, w denote nodes.

Signature. edge(u, v) is an atom.
Signature. reaches(u, v) is an atom.

Axiom ReachRefl. reaches(u, u).
Axiom ReachEdge. If edge(u, v) then reaches(u, v).
Axiom ReachTrans. If reaches(u, v) and reaches(v, w) then reaches(u, w).

Signature. p is a node.
Signature. q is a node.
Signature. r is a node.

Axiom E1. edge(p, q).
Axiom E2. edge(q, r).

Lemma. reaches(p, q).
Proof.
  edge(p, q) (by E1).
  Hence reaches(p, q) (by ReachEdge).
Qed.

Lemma. reaches(p, r).
Proof.
  reaches(p, q) (by ReachEdge, E1).
  reaches(q, r) (by ReachEdge, E2).
  Hence reaches(p, r) (by ReachTrans).
Qed.
