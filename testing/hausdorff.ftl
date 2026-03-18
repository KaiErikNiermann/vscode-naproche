# Hausdorff Separation
# Demonstrates: multiple signatures, definitions, axioms with quantifiers.

[synonym point/-s]
[synonym region/-s]

Signature. A point is a notion.
Signature. A region is a notion.

Let x, y, z denote points.
Let S, T denote regions.

Signature. pts(S) is a class.

Signature. nbhd(S, x) is an atom.

Signature. disjoint(S, T) is an atom.

# Separation: distinct points have disjoint neighborhoods.
Axiom Hausdorff. If x != y then there exists a region S such that
there exists a region T such that nbhd(S, x) and nbhd(T, y)
and disjoint(S, T).

Lemma. If x != y then there exists a region S such that nbhd(S, x).
Proof.
  Assume x != y.
  Take a region S such that there exists a region T such that
    nbhd(S, x) and nbhd(T, y) and disjoint(S, T) (by Hausdorff).
Qed.
