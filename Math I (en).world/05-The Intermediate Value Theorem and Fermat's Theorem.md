# Handout 05 · The Intermediate Value Theorem and Fermat's Theorem

> **Goal of this handout:** Complete the second of the two existence pillars. The **EVT** (handout 04) guarantees that maximum and minimum values exist; the **IVT** guarantees that *every* intermediate value is attained — in particular, that continuous functions cannot skip over zeros. We then introduce the **derivative** and prove **Fermat's Theorem**: at any interior local extremum where the function is differentiable, the derivative must be zero.

**Main theorems:** ⭐ **Intermediate Value Theorem (IVT)**; ⭐ **Fermat's Theorem**.

---

## 5.1 Motivation: EVT Handles Extrema; What About Zeros?

The EVT tells us that a continuous function on $[a,b]$ attains its maximum and minimum. But calculus constantly needs a different kind of existence result: **equations have solutions**.

- Does $x^2 = 2$ have a solution? Equivalently: does $f(x) = x^2 - 2$ have a zero?
- Do two curves $g$ and $h$ intersect? Equivalently: does $g - h$ have a zero?
- The Rolle's Theorem in the next handout needs a point where the derivative is zero — again a zero problem.

The geometric intuition is clear: a continuous curve that starts below the $x$-axis and ends above it *must cross* the axis somewhere in between — it cannot teleport.

But recall the lesson of handout 01: **this intuition fails in $\mathbb{Q}$**. The function $f(x) = x^2 - 2$ satisfies $f(1) = -1 < 0$ and $f(2) = 2 > 0$ on $\mathbb{Q}$, yet has no rational zero (since $\sqrt{2} \notin \mathbb{Q}$). The curve passes through the axis via a *gap* in $\mathbb{Q}$. The IVT holds precisely because $\mathbb{R}$ has no such gaps — because $\mathbb{R}$ is complete.

---

## 5.2 The Intermediate Value Theorem ⭐

### ⭐ Theorem 5.1 (Intermediate Value Theorem)

> Let $f$ be continuous on $[a,b]$ with $f(a) \ne f(b)$. Then for every $y_0$ between $f(a)$ and $f(b)$, there exists $c \in (a,b)$ with $f(c) = y_0$.

**Reduction.** It suffices to prove the **zero version**: if $f$ is continuous, $f(a) < 0 < f(b)$, then there exists $c$ with $f(c) = 0$. (The general case follows by replacing $f$ with $f - y_0$.) We prove the zero version.

We present two strategies.

> **Strategy A (Supremum method):** Consider the set $S = \{x \in [a,b] : f(x) < 0\}$ — the "still-negative" part of the domain. Take $c = \sup S$. Intuitively, $c$ is the last point at which $f$ is non-positive. By continuity, $f(c)$ cannot be strictly positive or strictly negative — it must be zero. **Core tool: the LUB axiom.**

> **Strategy B (Bisection):** Repeatedly halve $[a,b]$, always keeping the half on which $f$ changes sign. The nested intervals converge to a unique point $c$, and continuity forces $f(c) = 0$. **Core tool: Nested Intervals Theorem.** This strategy is exactly the **bisection root-finding algorithm** — the IVT proof is a mathematical algorithm in disguise.

We give the detailed proof of Strategy A; Strategy B is left as an exercise.

**Proof (Strategy A).** Let $S = \{x \in [a,b] : f(x) < 0\}$.

$S$ is non-empty (since $f(a) < 0$, we have $a \in S$) and bounded above by $b$. By the **LUB axiom**, $c = \sup S$ exists and $c \in [a,b]$.

We show $f(c) = 0$ by ruling out both alternatives.

- **Suppose $f(c) < 0$.** By continuity, $f$ is negative in a neighbourhood of $c$: there exists $\delta > 0$ such that $f(x) < 0$ for $x \in (c - \delta, c + \delta)$. In particular, $c + \frac{\delta}{2} \in S$ (provided $c + \frac{\delta}{2} \le b$, which holds since $f(b) > 0$ forces $c < b$). But then $c + \frac{\delta}{2} > c = \sup S$ — a contradiction.

- **Suppose $f(c) > 0$.** By continuity, $f$ is positive near $c$: there exists $\delta > 0$ such that $f(x) > 0$ for $x \in (c - \delta, c + \delta)$. Then $c - \frac{\delta}{2}$ is an upper bound for $S$ smaller than $c = \sup S$ — contradiction.

Neither alternative is possible, so $f(c) = 0$. $\blacksquare$

> **Reflecting on Strategy A:** The point $c = \sup S$ might not be a rational number — it might be exactly the kind of irrational $\sqrt{2}$ that $\mathbb{Q}$ lacks. The LUB axiom manufactures this point out of the completeness of $\mathbb{R}$. The entire proof turns on that single $\sup$.

> **The sign-preservation lemma:** The key micro-tool used twice above: *if $f(c) \ne 0$, then $f$ keeps the same sign as $f(c)$ in a small neighbourhood of $c$*. This follows directly from $\varepsilon$–$\delta$ continuity (take $\varepsilon = |f(c)|$). You will see this tool used again in handout 08.

---

## 5.3 Interlude: What is a Derivative?

Before stating Fermat's Theorem, we need the derivative. It is simply a special case of the function limit from handout 02.

### Definition 5.2 (Derivative)

We say $f$ is **differentiable at $x_0$** if the following limit exists:

$$f'(x_0) = \lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0} = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}.$$

This limit is called the **derivative** of $f$ at $x_0$. Geometrically it is the slope of the tangent line; physically it is the instantaneous rate of change.

> **The ghost is fully exorcised.** Recall from handout 00: Newton divided by $\Delta x$ and then *discarded* it — treating it as zero after dividing by it. The $\varepsilon$–$\delta$ limit definition handles this cleanly: the quotient $\frac{f(x) - f(x_0)}{x - x_0}$ is formed with $x \ne x_0$ (so division by zero never occurs — recall the $0 < |x - x_0|$ condition in Definition 2.6), and then we ask whether this ratio *approaches* a limit as $x \to x_0$. No infinitesimals, no contradiction.

**Differentiable implies continuous.** If $f$ is differentiable at $x_0$, then $f$ is continuous at $x_0$:

$$f(x) - f(x_0) = \frac{f(x) - f(x_0)}{x - x_0} \cdot (x - x_0) \xrightarrow{x \to x_0} f'(x_0) \cdot 0 = 0.$$

The converse fails: $|x|$ is continuous at $0$ but not differentiable there (the left and right difference quotients give $-1$ and $+1$ respectively).

---

## 5.4 Fermat's Theorem ⭐

### Definition 5.3 (Local Extremum)

We say $x_0$ is a **local maximum** of $f$ if $f(x) \le f(x_0)$ for all $x$ in some neighbourhood of $x_0$. **Local minimum** is defined symmetrically.

### ⭐ Theorem 5.4 (Fermat's Theorem)

> If $x_0$ is a local extremum of $f$, $x_0$ is in the **interior** of the domain (not an endpoint), and $f$ is differentiable at $x_0$, then $f'(x_0) = 0$.

> **What this theorem does:** It is the rigorous justification behind "to find extrema, set the derivative to zero." But note carefully: it is a **necessary condition**, not a sufficient one. Fermat's Theorem narrows the list of *candidates* — it says an interior extremum can only occur at a **critical point** (where $f' = 0$), or at a non-differentiable point. It does not say that every critical point is an extremum. (Example: $f(x) = x^3$ has $f'(0) = 0$ but $x = 0$ is neither a maximum nor a minimum.)

> **Proof strategy:** At a local maximum, moving slightly left or right cannot increase $f$. Look at the sign of the difference quotient $\frac{f(x) - f(x_0)}{x - x_0}$: the numerator $f(x) - f(x_0) \le 0$, while the denominator is positive for $x > x_0$ and negative for $x < x_0$. So the right-hand limit is $\le 0$ and the left-hand limit is $\ge 0$. Differentiability forces these one-sided limits to be *equal*, so the derivative is simultaneously $\le 0$ and $\ge 0$ — hence exactly $0$.

**Proof (local maximum case).** In a neighbourhood of $x_0$, we have $f(x) - f(x_0) \le 0$.

- **From the right** ($x > x_0$): $x - x_0 > 0$, so $\dfrac{f(x) - f(x_0)}{x - x_0} \le 0$. Taking the right-hand limit: $f'(x_0) \le 0$.

- **From the left** ($x < x_0$): $x - x_0 < 0$, a non-positive numerator divided by a negative denominator is $\ge 0$. Taking the left-hand limit: $f'(x_0) \ge 0$.

Since $f$ is differentiable, both one-sided limits equal $f'(x_0)$. Hence $f'(x_0) \le 0$ and $f'(x_0) \ge 0$, giving $f'(x_0) = 0$. $\blacksquare$

> **Why "interior" is essential.** At an endpoint, only one side is available. For example, $f(x) = x$ on $[0,1]$ has its maximum at $x = 1$, an endpoint, where $f'(1) = 1 \ne 0$. Endpoint extrema are entirely outside Fermat's reach — which is why, when solving an optimisation problem, the list of candidates must include *both* critical points *and* endpoints.

---

## 5.5 The Two Main Existence Theorems

We now have both foundational existence tools in place:

| Theorem | Statement | Root | Serves |
|--------|-----------|------|--------|
| **EVT** (handout 04) | Continuous $f$ on $[a,b]$ attains max and min | Compactness ← Completeness | Optimisation: extrema *exist* |
| **IVT** (this handout) | Continuous $f$ takes every intermediate value; sign change ⟹ zero | LUB axiom ← Completeness | Equations: zeros *exist* |

Plus the necessary condition **Fermat's Theorem** (interior extremum + differentiable ⟹ $f' = 0$), which locates where extrema can hide.

Both trace back to the completeness of $\mathbb{R}$.

In the next handout, we bring EVT and Fermat together to prove Rolle's Theorem, from which the full Mean Value Theorem follows.

→ [Handout 06: The Mean Value Theorem](06-The Mean Value Theorem.md)

---

### Exercises

1. Use the IVT to prove that every odd-degree polynomial has at least one real root. (Hint: consider $p(x)$ as $x \to +\infty$ and $x \to -\infty$.)
2. Use the IVT to prove rigorously that $\sqrt{2}$ exists as a real number — i.e., that $x^2 = 2$ has a solution in $\mathbb{R}$. Identify exactly where the completeness of $\mathbb{R}$ enters.
3. Give an example showing that Fermat's Theorem is not a sufficient condition: find $f$ and $x_0$ with $f'(x_0) = 0$ but $x_0$ is neither a local max nor a local min.
4. **(Strategy B — bisection proof of IVT.)** Carry out the bisection proof: at each stage, bisect $[a,b]$ and keep the half on which $f$ changes sign. Use the Nested Intervals Theorem to extract the zero $c$. Explain why this proof naturally gives an algorithm for computing $c$ numerically.
