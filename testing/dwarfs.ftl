# Dwarfs Logic Puzzle
# A logic puzzle with truth-tellers and liars.
# Demonstrates: synonyms, atom signatures, proof by contradiction.

[synonym dwarf/-s]

Signature. A dwarf is a notion.

Signature. Grumpy is a dwarf.
Signature. Happy is a dwarf.
Signature. Sleepy is a dwarf.

Let P denote a dwarf.

Signature. P is truthful is an atom.

Definition. P is lying iff P is not truthful.

# The puzzle setup:
# Grumpy says "Happy is lying."
# Happy says "Grumpy is truthful."

Axiom GrumpySays.
  Grumpy is truthful iff Happy is lying.

Axiom HappySays.
  Happy is truthful iff Grumpy is truthful.

# Solution: Grumpy is lying, Happy is lying.

Proposition. Grumpy is lying.
Proof by contradiction.
  Assume the contrary.
  Then Grumpy is truthful.
  Hence Happy is lying (by GrumpySays).
  Then Happy is not truthful.
  Hence Grumpy is not truthful (by HappySays).
  Contradiction.
Qed.

Proposition. Happy is lying.
Proof.
  Grumpy is lying.
  Then Grumpy is not truthful.
  Hence Happy is not truthful (by HappySays).
  Then Happy is lying.
Qed.
