# Checkerboard Coloring
# A simple combinatorics puzzle about coloring squares.
# Demonstrates: signatures, definitions, axioms, simple proofs.

[synonym square/-s]
[synonym color/-s]

Signature. A square is a notion.
Signature. A color is a notion.

Let x, y, z denote squares.

Signature. black is a color.
Signature. white is a color.

Axiom TwoColors. black != white.
Axiom ExactlyTwo. Let c be a color. Then c = black or c = white.

Signature. col(x) is a color.

Definition Dark. x is dark iff col(x) = black.
Definition Light. x is light iff col(x) = white.

Signature. adj(x, y) is an atom.

Axiom AdjSym. If adj(x, y) then adj(y, x).

Axiom Coloring. If adj(x, y) then col(x) != col(y).

Lemma DarkLight. If adj(x, y) and x is dark then y is light.
Proof.
  Assume adj(x, y) and x is dark.
  col(x) != col(y) (by Coloring).
  col(x) = black.
  col(y) != black.
  col(y) = white (by ExactlyTwo).
Qed.

Lemma DarkDark. If adj(x, y) and adj(y, z) and x is dark then z is dark.
Proof.
  Assume adj(x, y) and adj(y, z) and x is dark.
  y is light (by DarkLight).
  col(y) != col(z) (by Coloring).
  col(y) = white.
  col(z) != white.
  col(z) = black (by ExactlyTwo).
Qed.
