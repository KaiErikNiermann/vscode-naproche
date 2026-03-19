# BROKEN: Multiple issues in one file to test stacking diagnostics.
# Expected: reserved-word warning, missing-synonym warning, undefined ref, no-proof hint.

Signature. A set is a notion.

Signature. A widget is a notion.

Let w denote a widget.

Axiom. w = w.

Theorem Foo. w = w.

Lemma Bar. w = w.
Proof.
  w = w (by Baz).
Qed.
