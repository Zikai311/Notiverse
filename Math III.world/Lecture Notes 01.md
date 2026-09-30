# Lecture Notes 01

## Combinatorial identities

$$
\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k} \qquad \text{(Pascal)}
$$

$$
\sum_{i=k}^{n} \binom{i}{k} = \binom{n+1}{k+1} \qquad \text{(hockey stick)}
$$

$$
k\binom{n}{k} = n\binom{n-1}{k-1} \qquad \text{(committee} = \text{chairman)}
$$

$$
\sum_{k=0}^{r} \binom{m}{k}\binom{n}{r-k} = \binom{m+n}{r} \qquad \text{(Vandermonde)}
$$

Choosing $k$ out of $n$:

| $n$ choose $k$  | ordered                | unordered             |
| ------------------- | ---------------------- | --------------------- |
| without replacement | $\dfrac{n!}{(n-k)!}$ | $\dbinom{n}{k}$     |
| with replacement    | $n^k$                | $\dbinom{n+k-1}{k}$ |

## Three ingredients and three axioms of Probability

1. Sample space $S = \{\cdots\}$
2. Event $E \subseteq S$, i.e. any subset of $S$ (not necessarily — see Example 1)
3. Measurement $P$, with $\Omega = 2^S$ and $P : \Omega \to \mathbb{R}$

Probability is a normalized measure.

1. Non-negativity: $P(E) \ge 0$
2. Normalization: $P(S) = 1$
3. Countable additivity: for mutually disjoint $E_1, E_2, \ldots$ (that is $E_i \cap E_j = \emptyset$ for $i \ne j$),

$$
P\left(\bigcup_{i=1}^{\infty} E_i\right) = \sum_{i=1}^{\infty} P(E_i)
$$

## Example 1

$$
S = [0,1), \qquad P([a,b]) = b-a
$$

Define $x \sim y :\iff x - y \in \mathbb{Q}$, and write $\mathbb{Q} = \{q_0, q_1, \ldots\}$.

Pick a set $V$ (one representative per equivalence class), and set $V_0 = V + q_0$, $V_1 = V + q_1, \ldots$. Then for all $i$,

$$
P(V_i) = P(V)
$$

and

$$
[0,1) = \bigsqcup_{i=0}^{\infty} V_i
= \sum_{i=0}^{\infty} P(V_i)
= \sum_{i=0}^{\infty} P(V)
$$

The left side is $1$, the right side is $0$ or $\infty$ — hence $V$ is a non-measurable set (Vitali set).

Ingredients again:

1. $S$
2. $\mathcal{F}$: a $\sigma$-algebra
3. $P : \mathcal{F} \to \mathbb{R}$

where $\mathcal{F}$ satisfies:

1. $S \in \mathcal{F}$
2. $E \in \mathcal{F} \Rightarrow E^c \in \mathcal{F}$
3. Closed under countable unions: $E_1, E_2, \ldots \in \mathcal{F} \Rightarrow \bigcup_{i=0}^{\infty} E_i \in \mathcal{F}$

## Consequences of the axioms

$$
0 \le P(E) \le 1, \qquad P(\emptyset) = 0, \qquad
P\left(\bigsqcup_{i=0}^{n} E_i\right) = \sum_{i=0}^{n} P(E_i)
$$

1. $P(E) = 1 - P(E^c)$

365 days, probability that someone shares the same birthday, with $m$ days and $n$ people:

$$
1 - \frac{A_m^n}{m^n}
$$

For $E, F$:

$$
E = (E \cap F) \cup (E \cap F^c)
$$

$$
P(E) = P(EF) + P(EF^c)
$$

Adjacent birthdays, $h = 15$, e.g. the pattern `0 1 0 0 1 0 0 0 0 0`:

$$
1 - \frac{1}{m^n}\frac{m}{m-n}\binom{m-n}{n} n!
$$

Scratch:

|                     |       |                         |         |
| ------------------- | ----- | ----------------------- | ------- |
| $m-1$             | $n$ | $m-3$                 | $n-1$ |
| $(m-1-h)+1$       |       | $(m-3)(n-1)+1$        |         |
| $\dbinom{m-n}{n}$ |       | $\dbinom{m-n-1}{n-1}$ |         |

## Inclusion–Exclusion

3. For $E_1, E_2$:

$$
P(E_1 \cup E_2) = P(E_1) + P(E_2) - P(E_1 E_2)
$$

For $E_1, E_2, E_3$:

$$
P(E_1 \cup E_2 \cup E_3) = \cdots
$$

For $E_1, \ldots, E_n$:

$$
P(E_1 \cup \cdots \cup E_n)
= \sum_{r=1}^{n} (-1)^{r+1} \sum_{1 \le i_1 < \cdots < i_r \le n} P(E_{i_1}, \ldots, E_{i_r})
$$

Inclusion–Exclusion equation.

4. de Montmort Problem (derangements)

$A_i$: person $i$ gets their own hat.

$$
P(A_1^c \cap A_2^c \cap \cdots \cap A_n^c) = 1 - P(A_1 \cup \cdots \cup A_n)
$$

$$
= 1 - \left\{ P(A_1) + \cdots + P(A_n) - P(A_1 A_2) - \cdots + \cdots \right\}
$$

with

$$
\binom{n}{1}\frac{(n-1)!}{n!} = 1 = \frac{1}{1!}, \qquad
\binom{n}{2}\frac{(n-2)!}{n!} = \frac{1}{2!}, \qquad
\binom{n}{3}\frac{(n-3)!}{n!} = \frac{1}{3!}
$$

$$
= 1 - 1 + \frac{1}{2!} - \frac{1}{3!} + \cdots = \sum_{k=0}^{n} (-1)^k \frac{1}{k!}
= \frac{1}{e} \qquad (n \to \infty)
$$
