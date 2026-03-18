# Basic Set Theory
# Demonstrates definitions, let-bindings, and set-theoretic reasoning.
# Uses Naproche's built-in notions of set, class, and element.

[synonym element/elements]
[synonym set/sets]
[synonym subclass/-es]

Let S,T,U denote classes.

Let x \in S stand for x is an element of S.

Definition Subset. A subclass of S is a class T such that every
element of T is an element of S.

Let a subset of S stand for a set that is a subclass of S.

Axiom SubsetIsSet.
Let A be a set.
Let B be a subclass of A.
Then B is a set.

Definition DefEmpty.
The empty set is the set that has no elements.

Lemma EmptySubclass.
The empty set is a subclass of S.

Lemma SubRefl.
S is a subclass of S.
