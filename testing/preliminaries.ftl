# Preliminaries: Sets, Elements, Functions
# Self-contained basic definitions for set theory and functions.
# Demonstrates: built-in class, set, element, function, Dom.

[synonym subclass/-es]

Let S, T denote classes.

Let x \in S stand for x is an element of S.
Let x \notin S stand for x is not an element of S.

Definition DefSubclass. A subclass of S is a class T such that
every element of T is an element of S.

Let T \subseteq S stand for T is a subclass of S.

Axiom Extensionality. If S \subseteq T and T \subseteq S then S = T.

Definition. A subset of S is a set that is a subclass of S.

Axiom Separation. Let X be a set. Let T be a subclass of X. Then T is a set.

Definition DefEmpty. The empty set is the set that has no elements.

Lemma EmptySubclass. The empty set is a subclass of S.

Lemma SubRefl. S is a subclass of S.

Definition DefIntersection. The intersection of S and T is
{x in S | x \in T}.

Let S \cap T stand for the intersection of S and T.

Definition DefUnion. The union of S and T is
{x | x \in S \/ x \in T}.

Let S \cup T stand for the union of S and T.

Lemma InterSub. S \cap T \subseteq S.
Proof.
  Let x \in S \cap T. Then x \in S.
Qed.

Let f denote a function.

Definition FImage. Assume S is a subclass of Dom(f). f[S] = {f(x) | x \in S}.

Axiom Replacement. Let M be a set. Assume M is a subclass of Dom(f).
Then f[M] is a set.
