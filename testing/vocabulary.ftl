# Vocabulary / Synonym Tests
# Tests synonym directives extensively with multiple declarations.
# Demonstrates: [synonym ...] with various plural forms.

[synonym number/-s]
[synonym color/-s]
[synonym vertex/vertices]
[synonym dwarf/-s]

Signature. A number is a notion.
Signature. A color is a notion.
Signature. A vertex is a notion.
Signature. A dwarf is a notion.

Let n, m denote numbers.
Let x, y denote vertices.

Signature. 0 is a number.
Signature. red is a color.
Signature. blue is a color.

Axiom. red != blue.

Signature. col(x) is a color.

# Using plurals in statements.

Lemma. For all numbers n n = n.

Lemma. For all vertices x col(x) is a color.

Lemma. For all vertices x col(x) = red or col(x) = blue or
(col(x) != red and col(x) != blue).
