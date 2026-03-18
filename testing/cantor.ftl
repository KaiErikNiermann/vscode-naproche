# Cantor's Diagonal Argument (simplified)
# No surjection from a set to all its subclasses.
# Demonstrates: proof by contradiction, set comprehension, functions.

[synonym subset/-s]

Let S, T denote classes.
Let f, g denote functions.

Let x \in S stand for x is an element of S.
Let x \notin S stand for x is not an element of S.

Definition DefSubclass. A subclass of S is a class T such that
every element of T is an element of S.

Let T \subseteq S stand for T is a subclass of S.

Definition Surjects. f surjects onto T iff for every element y of T
there exists an element x of Dom(f) such that f(x) = y.

# Given a set M and a function g, the diagonal class is not in range.

Lemma Diagonal. Let M be a set. Let Dom(g) = M.
Assume for all elements x of M g(x) is a class.
Then there exists a class N such that N \subseteq M and
for all elements x of M g(x) != N.
Proof by contradiction.
  Assume the contrary.
  Define N = {x in M | x \notin g(x)}.
  N \subseteq M.
  Take an element z of M such that g(z) = N.
  Then z \in N iff z \notin g(z).
  Contradiction.
Qed.
