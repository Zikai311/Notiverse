# Handout 04 · Continuity, Compact Sets, and the Extreme Value Theorem

> **Goal of this handout:** Introduce **continuity** via its sequential characterisation, then build up to the **Extreme Value Theorem (EVT)**: a continuous function on a closed bounded interval always attains its maximum and minimum values. The key intermediary concept is **compactness** — a property that, in ℝ, is equivalent to being closed and bounded, and which is precisely what "transfers" completeness from the domain to the range.

**Main theorems:** ⭐ **Sequential characterisation of continuity**; ⭐ **Heine–Borel Theorem**; ⭐ **Continuous image of a compact set is compact**; ⭐ **Extreme Value Theorem (EVT)**.

---

## 4.1 Motivation: Why Does "Maximum Exists" Need Proof?

Recall the counterexample from handout 00:

$$f(x) = x \text{ on the open interval } (0,1) \text{ has no maximum value.}$$

The function is perfectly continuous and smooth — yet the maximum does not exist, because the interval is **open** and the supremum $1$ is never attained.

Another counterexample: $f(x) = \frac{1}{x}$ on $(0,1]$ is unbounded as $x \to 0^+$, so it has no maximum whatsoever. Here the trouble is that the function "escapes to infinity" near the missing left endpoint.

These examples show that the existence of a maximum is a genuine fact requiring two conditions:

1. **The function is continuous** (otherwise one can create holes or jumps that skip over the maximum);
2. **The interval is closed and bounded**: $[a,b]$ (otherwise the maximum can "leak out" through a missing endpoint, as in both examples above).

The EVT says: **given exactly these two conditions, the maximum always exists.**

The challenge is: how do we translate the geometric condition "closed and bounded" into the kind of analytic language that drives a proof? The answer is the central concept of this handout: **compactness**.

---

## 4.2 Continuity: the Sequential Definition

### Definition 4.1 (Continuity)

A function $f : [a,b] \to \mathbb{R}$ is **continuous at $x_0$** if for every sequence $(x_n)$ in $[a,b]$ with $x_n \to x_0$, we have $f(x_n) \to f(x_0)$.

$f$ is **continuous on $[a,b]$** if it is continuous at every point.

> This is the **sequential characterisation** of continuity — equivalent to the $\varepsilon$–$\delta$ definition, but often more convenient for proofs involving sequences. The two definitions are logically interchangeable; use whichever fits the argument at hand.

**$\varepsilon$–$\delta$ version (for reference):** $f$ is continuous at $x_0$ if $\forall\, \varepsilon > 0,\ \exists\, \delta > 0,\ \forall x:\ |x - x_0| < \delta \Rightarrow |f(x) - f(x_0)| < \varepsilon$.

> **Examples.** Polynomials, $\sin$, $\cos$, $e^x$, and compositions thereof are all continuous everywhere. The function $f(x) = \frac{1}{x}$ is continuous on $(0,1)$ but not on $[-1,1]$ (it is undefined at $0$). The function $f(x) = \begin{cases} 1 & x \ge 0 \\ 0 & x < 0 \end{cases}$ is discontinuous at $0$: take $x_n = \frac{1}{n} \to 0$ and observe $f(x_n) = 1 \not\to f(0) = 1$... wait, let me correct: $f(0) = 1$, $f(-\frac{1}{n}) = 0 \not\to 1$. ✓

---

## 4.3 Compact Sets

### Definition 4.2 (Sequential Compactness)

A set $K \subseteq \mathbb{R}$ is **compact** if every sequence in $K$ has a subsequence that converges to a point *in $K$*.

This combines two requirements: the subsequence converges (some limit exists), and that limit stays inside $K$ (the set is "closed enough" to catch it).

> **Motivation.** Compactness is the property that makes a set "behave like a finite set" for the purpose of optimisation and approximation. A finite set is trivially compact (any sequence eventually repeats a value). Compactness is the right infinite generalisation.

### ⭐ Theorem 4.3 (Heine–Borel, one direction: closed + bounded ⟹ compact)

> In $\mathbb{R}$, if $K$ is **closed** and **bounded**, then $K$ is compact.

**Proof.** Let $(x_n)$ be any sequence in $K$. Since $K$ is bounded, $(x_n)$ is bounded; by **BW** (Theorem 3.3), it has a convergent subsequence $x_{n_k} \to \xi$. Since $K$ is closed and all $x_{n_k} \in K$, the limit $\xi \in K$. $\blacksquare$

### The other direction: compact ⟹ closed and bounded

**Bounded:** If $K$ were unbounded, pick $x_n \in K$ with $|x_n| > n$. No subsequence can converge (it is unbounded), contradicting compactness.

**Closed:** Suppose $x_n \in K$ and $x_n \to \xi$. By compactness, some subsequence $x_{n_k} \to \eta \in K$. But a subsequence of a convergent sequence converges to the same limit, so $\eta = \xi$. Hence $\xi \in K$. $\blacksquare$

> **Heine–Borel in full:** A subset of $\mathbb{R}$ is compact if and only if it is closed and bounded. The most important example: any closed interval $[a,b]$ is compact.

---

## 4.4 Continuous Image of a Compact Set ⭐

### ⭐ Proposition 4.4

> If $f$ is continuous on $K$ and $K$ is compact, then $f(K) = \{f(x) : x \in K\}$ is also compact.

**Proof.** Let $(y_n)$ be any sequence in $f(K)$; write $y_n = f(x_n)$ with $x_n \in K$. Since $K$ is compact, extract a subsequence $x_{n_k} \to \xi \in K$. By continuity, $f(x_{n_k}) \to f(\xi) \in f(K)$. So every sequence in $f(K)$ has a subsequence converging to a point of $f(K)$. $\blacksquare$

> This proposition is the bridge: the hypotheses are on the domain ($f$ continuous, $K$ compact); the conclusion lands on the range ($f(K)$ compact).

---

## 4.5 The Extreme Value Theorem ⭐

### ⭐ Theorem 4.5 (Extreme Value Theorem, EVT)

> If $f$ is continuous on a closed bounded interval $[a,b]$, then $f$ attains its maximum and minimum: there exist $c, d \in [a,b]$ such that $f(c) \le f(x) \le f(d)$ for all $x \in [a,b]$.

**Proof.** $[a,b]$ is compact (Heine–Borel). By Proposition 4.4, $f([a,b])$ is compact, hence closed and bounded (Heine–Borel again). Since $f([a,b])$ is bounded, $M = \sup f([a,b])$ exists. Since it is closed, $M \in f([a,b])$ (a supremum of a closed bounded set is attained). Hence there exists $d \in [a,b]$ with $f(d) = M$. Similarly for the minimum. $\blacksquare$

> **Why does this need proof?** The statement feels obvious, but here is a counterexample when each hypothesis is dropped:
> - *Drop "closed"*: $f(x) = x$ on $(0,1)$ never attains its supremum $1$.
> - *Drop "bounded"*: $f(x) = x$ on $[1,\infty)$ has no maximum.
> - *Drop "continuous"*: the function that equals $0$ everywhere on $[0,1]$ except $f(0) = 1$ has supremum $1$, attained at $0$, but consider instead $f(x) = \frac{1}{x}$ extended by $f(0) = 0$: the image $(0,\infty) \cup \{0\}$ is not closed, and the supremum is not attained.

Each condition does exactly one job:
- **Closed interval** → compact domain (via Heine–Borel)
- **Continuity** → compact image (via Proposition 4.4)
- **Compact image** → supremum is attained (closed + bounded)

### Direct proof via BW (alternative, no Heine–Borel needed)

Let $M = \sup_{x \in [a,b]} f(x)$. Choose $x_n \in [a,b]$ with $f(x_n) > M - \frac{1}{n}$ (by the approximation property of the supremum). By **BW**, extract $x_{n_k} \to d \in [a,b]$ (the limit is in $[a,b]$ since $[a,b]$ is closed). By continuity, $f(x_{n_k}) \to f(d)$. But $f(x_{n_k}) > M - \frac{1}{n_k} \to M$, so $f(d) = M$. $\blacksquare$

---

## 4.6 The Dependency Chain

The proof of the EVT is a relay race in which completeness is carried upward through every step:

```
   Completeness (Handout 01)
          │
          ▼
   Bolzano–Weierstrass (Handout 03)
          │
          ▼
   Heine–Borel: [a,b] is compact  ──┐
                                    ├──► Continuous image is compact (Prop. 4.4) ──► f([a,b]) compact
   Sequential continuity (Def. 4.1)─┘                                                       │
                                                                                             ▼
                                                                               f([a,b]) closed and bounded
                                                                                             │
                                                                         sup exists + closed ⟹ sup attained
                                                                                             ▼
                                                                                  ⭐ EVT: max and min exist
```

**Every arrow carries completeness upward.** The closed interval $[a,b]$ is compact because ℝ is complete (via BW); continuity transfers that compactness to the image; and the image being **closed** is what upgrades "supremum exists" into "maximum is attained". The full chain is:

$$\text{Completeness} \to \text{BW} \to \text{compact domain} \xrightarrow{\text{continuity}} \text{compact image} \to \text{closed} \to \text{sup attained} \to \text{EVT}.$$

---

## 4.7 Summary

- ⭐ **Sequential continuity**: $f$ is continuous at $x_0$ iff $x_n \to x_0 \Rightarrow f(x_n) \to f(x_0)$.
- ⭐ **Compact** = every sequence has a subsequence converging to a point of the set. In ℝ: compact ↔ closed and bounded (**Heine–Borel**).
- ⭐ **Continuous image of compact = compact**: compactness transfers from domain to range under continuous maps.
- ⭐ **EVT**: continuous function on $[a,b]$ attains its max and min. Proof chain: closed interval → compact domain → compact image → sup is attained. Each arrow requires a specific hypothesis.
- The full dependency chain (§4.6) shows every step traces back to completeness: **EVT is completeness, carried four arrows upward**.
- The EVT and the IVT (handout 05) are the two main existence theorems of the series: EVT guarantees extrema exist; the next handout provides tools to locate them.

→ [Handout 05: The Intermediate Value Theorem and Fermat's Theorem](05-The Intermediate Value Theorem and Fermat's Theorem.md)

---

### Exercises

1. Let $f : [0,1] \to \mathbb{R}$ be defined by $f(x) = x^2$. Find the maximum and minimum explicitly and identify the points where they are attained. Verify the EVT.
2. Show that the function $f(x) = \frac{1}{x}$ on $(0,1]$ attains its infimum but not its supremum. Which hypothesis of the EVT fails?
3. Prove that if $K_1$ and $K_2$ are compact subsets of $\mathbb{R}$, then $K_1 \cup K_2$ and $K_1 \cap K_2$ are also compact.
4. **(EVT for sequences.)** Suppose $(a_n)$ is a sequence with $|a_n| \le 1$ for all $n$. Prove it has a subsequence converging to some $L \in [-1, 1]$. (This is just BW; state explicitly which step uses compactness of $[-1,1]$.)
