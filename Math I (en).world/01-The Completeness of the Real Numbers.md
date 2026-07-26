# Handout 01 · The Completeness of the Real Numbers

> **Goal of this handout:** Lay the ground floor of the entire building. We introduce the **Least Upper Bound Property** — the one axiom that distinguishes ℝ from ℚ — and derive three key consequences: the **Monotone Convergence Theorem**, the **Nested Intervals Theorem**, and the **Archimedean Property**. Every existence proof in the series will trace back to one of these results.

**Main theorems:** ⭐ **Supremum Principle (LUB Property)**; ⭐ **Monotone Convergence Theorem (MCT)**; ⭐ **Nested Intervals Theorem**; ⭐ **Archimedean Property**.

---

## 1.1 The Gap in ℚ

We begin with a question that looks elementary: does $\sqrt{2}$ exist?

More precisely: is there a rational number $q$ with $q^2 = 2$?

**Proposition 1.1.** There is no rational number whose square equals 2.

*Proof.* Suppose $q = p/n$ in lowest terms and $q^2 = 2$, so $p^2 = 2n^2$. Then $p^2$ is even, hence $p$ is even; write $p = 2k$. Then $4k^2 = 2n^2$, so $n^2 = 2k^2$, making $n$ even. But then $p$ and $n$ share the factor 2, contradicting lowest terms. $\blacksquare$

So the set $S = \{x \in \mathbb{Q} : x^2 < 2\}$ is bounded above in $\mathbb{Q}$ (for example, $2$ is an upper bound), yet has **no least upper bound in $\mathbb{Q}$**: whatever rational $q$ you propose, either $q \notin S$ but $q - \varepsilon \in S$ for some $\varepsilon > 0$ (so $q$ is not tight), or $q \in S$ but $q + \varepsilon \in S$ for small $\varepsilon$ (so $q$ is not an upper bound).

This is the **gap** that the rational numbers leave open. The real numbers are — by design — the system that closes it.

---

## 1.2 Supremum and Infimum

### Definitions 1.2

Let $S \subseteq \mathbb{R}$ be non-empty.

- A number $M$ is an **upper bound** of $S$ if $x \le M$ for all $x \in S$.
- $S$ is **bounded above** if it has at least one upper bound.
- A number $c$ is the **supremum** (or **least upper bound**) of $S$, written $c = \sup S$, if:
  1. $c$ is an upper bound of $S$: $x \le c$ for all $x \in S$;
  2. $c$ is the *smallest* upper bound: if $M$ is any upper bound of $S$, then $c \le M$.

**Infimum** (greatest lower bound), written $\inf S$, is defined symmetrically.

### The Approximation Property

The defining property of the supremum can be rephrased in a way that is more useful in practice:

> **Proposition 1.3.** $c = \sup S$ if and only if:
> (i) $x \le c$ for all $x \in S$, and
> (ii) for every $\varepsilon > 0$, there exists $x \in S$ with $x > c - \varepsilon$.

Condition (ii) says: you cannot improve on $c$ as an upper bound by even $\varepsilon$ — there is always something in $S$ that comes within $\varepsilon$ of $c$.

This approximation formulation is the key to virtually every proof in the series that involves a supremum. You will see it used in lectures 03, 04, 05, and 07.

---

## 1.3 The Completeness Axiom ⭐

### ⭐ Axiom 1.4 (Least Upper Bound Property / Completeness of ℝ)

> Every non-empty subset of $\mathbb{R}$ that is bounded above has a supremum in $\mathbb{R}$.

This is the axiom that defines $\mathbb{R}$. It is not a theorem — it is a *choice* about which number system to work in.

> **Why is this the right axiom?** Because the entire failure we saw in §1.1 was precisely the absence of this property in $\mathbb{Q}$. By taking it as an axiom for $\mathbb{R}$, we decree that the real numbers have no such gaps. Every "missing" limit point — every $\sqrt{2}$, every $\pi$, every $e$ — is guaranteed to exist somewhere in $\mathbb{R}$.

One can also *construct* $\mathbb{R}$ from $\mathbb{Q}$ (using Dedekind cuts or equivalence classes of Cauchy sequences) and then *prove* the LUB property rather than assume it. We adopt the axiomatic approach here and treat the construction as optional reading.

---

## 1.4 Three Consequences of Completeness

From the LUB axiom we derive three important consequences. The logical relationships are:

$$\text{Completeness} \Longrightarrow \text{MCT} \Longrightarrow \text{Nested Intervals}$$
$$\text{Completeness} \Longrightarrow \text{Archimedean Property}$$

The Archimedean property is a strictly weaker statement (the rationals are Archimedean but not complete). MCT and Nested Intervals are each proved in sequence from completeness; both are used extensively in later handouts.

### ⭐ Theorem 1.5 (Monotone Convergence Theorem, MCT)

> A sequence $(a_n)$ that is **monotone increasing** and **bounded above** converges to a limit.

**Proof.** Let $L = \sup\{a_n : n \ge 1\}$, which exists by the LUB axiom. We claim $a_n \to L$.

Given $\varepsilon > 0$, by the approximation property (Proposition 1.3(ii)), there exists some $a_N > L - \varepsilon$. Since the sequence is increasing, $a_n \ge a_N > L - \varepsilon$ for all $n \ge N$. Also $a_n \le L$ for all $n$. Hence $|a_n - L| < \varepsilon$ for all $n \ge N$. $\blacksquare$

> **How MCT is used upstream:** Whenever we need to extract a convergent subsequence (handout 03) or verify that a sequence of approximations converges, MCT provides the engine.

### ⭐ Theorem 1.6 (Nested Intervals Theorem)

> Let $[a_1, b_1] \supseteq [a_2, b_2] \supseteq \cdots$ be a sequence of nested closed intervals. Then $\bigcap_{n=1}^{\infty} [a_n, b_n] \ne \emptyset$. If in addition $b_n - a_n \to 0$, the intersection contains exactly one point.

**Proof.** The sequence $(a_n)$ is increasing and bounded above by $b_1$; by MCT, $a_n \to \xi$ for some $\xi$. The sequence $(b_n)$ is decreasing and bounded below by $a_1$; similarly $b_n \to \eta$. Since $a_n \le b_n$ for all $n$, passing to the limit gives $\xi \le \eta$. Every $\xi \in [\xi, \eta]$ lies in every $[a_n, b_n]$ (because $a_n \le \xi \le \eta \le b_n$), so the intersection is non-empty.

If $b_n - a_n \to 0$ then $\eta - \xi = \lim(b_n - a_n) = 0$, so $\xi = \eta$ and the intersection is the singleton $\{\xi\}$. $\blacksquare$

### ⭐ Proposition 1.7 (Archimedean Property)

> For every real number $x > 0$, there exists a natural number $n$ with $\frac{1}{n} < x$. Equivalently: for every real $x$, there exists $n \in \mathbb{N}$ with $n > x$.

**Proof.** Suppose for contradiction that $n \le x$ for all $n \in \mathbb{N}$. Then $\mathbb{N}$ is bounded above, so $M = \sup \mathbb{N}$ exists. By the approximation property, there exists $n \in \mathbb{N}$ with $n > M - 1$, hence $n + 1 > M$. But $n + 1 \in \mathbb{N}$ and $n + 1 > M = \sup \mathbb{N}$ — a contradiction. $\blacksquare$

> The Archimedean property is what makes "$\frac{1}{n} \to 0$" true. Without it, you could have a positive real smaller than $\frac{1}{n}$ for every $n$ — an "infinitely small" number in the Newtonian sense. The completeness axiom rules this out: $\mathbb{R}$ has no infinitesimals.

---

## 1.5 The Template for Existence Proofs

A recurring pattern throughout this series:

> 1. **Construct a set** $S$ that captures the "right answer" (e.g., $S = \{x : f(x) < 0\}$).
> 2. **Take its supremum** $c = \sup S$, guaranteed by the LUB axiom.
> 3. **Use the approximation property** to pin down the behaviour of $f$ at $c$: pick a sequence $x_n \in S$ with $x_n \to c$, then use continuity or another hypothesis to conclude $f(c) = $ whatever is needed.

You will see this template in action in handouts 05 (IVT) and 07 (integrability criterion). Recognising it each time it appears is more valuable than memorising the individual proofs.

---

## 1.6 Summary

- ℚ has a gap at $\sqrt{2}$: the set $\{x \in \mathbb{Q} : x^2 < 2\}$ is bounded above but has no supremum in $\mathbb{Q}$.
- ⭐ The **LUB axiom** asserts that every non-empty bounded-above subset of ℝ has a supremum in ℝ. This is the defining property of the real numbers.
- ⭐ **MCT** (consequence of completeness): monotone increasing + bounded above $\Rightarrow$ convergent.
- ⭐ **Nested Intervals** (consequence of MCT): nested closed intervals have non-empty intersection; if lengths $\to 0$, a unique point.
- ⭐ **Archimedean Property** (separate consequence of completeness): $\frac{1}{n} \to 0$; no infinitesimals in $\mathbb{R}$. This is strictly weaker than completeness — $\mathbb{Q}$ is Archimedean but not complete.
- The **Approximation Property** of $\sup$ ($c = \sup S$ iff $c$ is an upper bound and you can get within $\varepsilon$ of $c$ from inside $S$) is the practical tool for proofs.

**The significance of this handout in the calculus building:**

> From this point on, whenever a theorem asserts that "something **exists**" — a limit, an extremum, a zero, an antiderivative — you can trace the proof downward and will always arrive at the **LUB axiom** as the foundation. If you cannot trace it there, the proof has a gap.

→ [Handout 02: Limits and the Epsilon Language](02-Limits and the Epsilon Language.md)

---

### Exercises

1. Prove that $\inf S = -\sup\{-s : s \in S\}$ for any non-empty bounded-below set $S$. (This shows infimum is not a new axiom — it follows from the LUB axiom by symmetry.)
2. Use MCT to prove that the sequence $a_n = \left(1 + \frac{1}{n}\right)^n$ converges. (You may assume it is increasing and bounded above by 3.)
3. Let $S = \{1 - \frac{1}{n} : n \in \mathbb{N}\}$. Find $\sup S$ and $\inf S$. Is $\sup S \in S$? Is $\inf S \in S$?
4. Explain, using the approximation property, why $\sup[0,1] = 1$ and why $\sup(0,1) = 1$ also, even though $1 \notin (0,1)$.
