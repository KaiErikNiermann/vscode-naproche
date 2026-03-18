# Class and Set Theory
# Demonstrates: built-in class, element, set, \in, \subseteq, set comprehension.

[synonym subclass/-es]

Let S, T, U denote classes.

Let x \in S stand for x is an element of S.
Let x \notin S stand for x is not an element of S.

Definition DefSubclass. A subclass of S is a class T such that
every element of T is an element of S.

Let T \subseteq S stand for T is a subclass of S.

Axiom Extensionality. If S \subseteq T and T \subseteq S then S = T.

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

Definition DefDiff. The difference of S and T is
{x in S | x \notin T}.

Let S \ T stand for the difference of S and T.

Lemma InterSub. S \cap T \subseteq S.
Proof.
  Let x \in S \cap T. Then x \in S.
Qed.

Lemma UnionSub. If S \subseteq U and T \subseteq U then S \cup T \subseteq U.
Proof.
  Assume S \subseteq U and T \subseteq U.
  Let x \in S \cup T. Then x \in S \/ x \in T. Hence x \in U.
Qed.

Lemma DiffSub. S \ T \subseteq S.
Proof.
  Let x \in S \ T. Then x \in S.
Qed.

Lemma InterComm. S \cap T = T \cap S.
Proof.
  S \cap T \subseteq T \cap S.
  T \cap S \subseteq S \cap T.
Qed.
