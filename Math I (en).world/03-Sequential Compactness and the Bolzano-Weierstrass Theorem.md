# Handout 03 · Sequential Compactness and the Bolzano–Weierstrass Theorem

> **Goal of this handout:** Prove the **Bolzano–Weierstrass Theorem** — every bounded sequence of real numbers has a convergent subsequence. This is the key tool that turns finiteness arguments into existence proofs: it says that "bounded" is enough to guarantee some convergent behaviour lurks inside a sequence, even if the sequence itself diverges. We also introduce the **Cauchy criterion** as an elegant characterisation of convergence that does not require knowing the limit in advance.

**Main theorems:** ⭐ **Bolzano–Weierstrass Theorem (BW)**; ⭐ **Cauchy Completeness**.

---

## 3.1 Subsequences and Cluster Points

### Definition 3.1 (Subsequence)

Given a sequence $(a_n)_{n=1}^{\infty}$, a **subsequence** is a sequence of the form $(a_{n_k})_{k=1}^{\infty}$ where $n_1 < n_2 < n_3 < \cdots$ is a strictly increasing sequence of natural numbers.

Intuitively: a subsequence selects an infinite collection of terms from the original sequence, in the same order.

### Definition 3.2 (Cluster Point)

A number $L$ is a **cluster point** (or *accumulation point*) of the sequence $(a_n)$ if infinitely many terms of the sequence lie within any neighbourhood of $L$: for every $\varepsilon > 0$, the inequality $|a_n - L| < \varepsilon$ holds for infinitely many $n$.

Equivalently: $L$ is a cluster point if and only if some subsequence of $(a_n)$ converges to $L$.

> **Example.** The sequence $1, 0, 1, 0, 1, 0, \ldots$ (i.e. $a_n = \frac{1 + (-1)^n}{2}$) does not converge, but it has two cluster points: $0$ and $1$. The even-indexed subsequence converges to $1$; the odd-indexed subsequence converges to $0$.

---

## 3.2 The Bolzano–Weierstrass Theorem ⭐

### ⭐ Theorem 3.3 (Bolzano–Weierstrass)

> Every bounded sequence of real numbers has a convergent subsequence.

We give two proofs. Both are worth knowing: the first is conceptually transparent; the second is more elegant.

---

### Proof A: Bisection and Nested Intervals

Since $(a_n)$ is bounded, all its terms lie in some interval $[A, B]$. We bisect repeatedly, keeping the half that contains infinitely many terms.

**Step 1.** The interval $[A, B]$ contains all terms; at least one of $[A, \frac{A+B}{2}]$ or $[\frac{A+B}{2}, B]$ contains infinitely many terms. Call it $[a_1, b_1]$.

**Step 2.** Bisect $[a_1, b_1]$; again at least one half contains infinitely many terms. Call it $[a_2, b_2]$.

**Inductively**, we get a sequence of nested closed intervals $[a_k, b_k]$ with $b_k - a_k = \frac{B - A}{2^k} \to 0$, each containing infinitely many terms.

By the **Nested Intervals Theorem** (Theorem 1.6), there is a unique point $\xi \in \bigcap [a_k, b_k]$. Since $[a_k, b_k]$ contains infinitely many terms, we can pick $a_{n_k} \in [a_k, b_k]$ with $n_k$ strictly increasing. Then $|a_{n_k} - \xi| \le b_k - a_k \to 0$, so $a_{n_k} \to \xi$. $\blacksquare$

> This proof is essentially the **bisection method** — a numerical algorithm in disguise. At each stage, you are halving the search region. The Nested Intervals Theorem is what guarantees the search terminates at a real point.

---

### Proof B: The Peak-Point Lemma and MCT

**Definition.** Call $a_m$ a **peak** (or *peak point*) of the sequence if $a_m \ge a_n$ for all $n \ge m$ — i.e., no later term exceeds it.

**Case 1: infinitely many peaks.** Let $a_{n_1}, a_{n_2}, \ldots$ be the peaks in order. Since $a_{n_k}$ is a peak, $a_{n_{k+1}} \le a_{n_k}$ (the next peak cannot exceed the current one), so the subsequence is **decreasing**. It is also bounded below, so by the **Monotone Convergence Theorem** (Theorem 1.5, applied to the decreasing version), it converges. $\checkmark$

**Case 2: only finitely many peaks.** Beyond the last peak, every term $a_m$ is *not* a peak — meaning there exists $n > m$ with $a_n > a_m$. Starting from any index $n_1$ past the last peak, we can always find $n_2 > n_1$ with $a_{n_2} > a_{n_1}$, then $n_3 > n_2$ with $a_{n_3} > a_{n_2}$, and so on. This gives a **strictly increasing** subsequence. It is bounded (the whole sequence is), so by MCT it converges. $\checkmark$

In either case, a convergent subsequence exists. $\blacksquare$

> Proof B is slicker: it shows that every bounded sequence either has a decreasing convergent subsequence or an increasing one — you cannot avoid both. The peak-point argument is a beautiful example of a combinatorial trick doing heavy lifting.

---

## 3.3 Cauchy Sequences ⭐

Sometimes we want to know that a sequence converges without being told (or without being able to compute) the limit. The Cauchy criterion gives exactly this.

### Definition 3.4 (Cauchy Sequence)

A sequence $(a_n)$ is a **Cauchy sequence** if its terms become arbitrarily close to one another:

$$\forall\, \varepsilon > 0,\quad \exists\, N,\quad \forall\, m, n \ge N:\quad |a_m - a_n| < \varepsilon.$$

### ⭐ Theorem 3.5 (Cauchy Completeness)

> A sequence of real numbers converges if and only if it is Cauchy.

**Proof ($\Rightarrow$).** If $a_n \to L$, given $\varepsilon > 0$ find $N$ such that $|a_n - L| < \frac{\varepsilon}{2}$ for $n \ge N$. For $m, n \ge N$: $|a_m - a_n| \le |a_m - L| + |L - a_n| < \varepsilon$. $\checkmark$

**Proof ($\Leftarrow$).** Let $(a_n)$ be Cauchy. It is bounded (take $\varepsilon = 1$; terms beyond $N$ lie in an interval of length 2 around $a_N$; include the finite initial segment). By **BW**, extract a convergent subsequence $a_{n_k} \to L$. For any $\varepsilon > 0$, find $N$ so that $|a_m - a_n| < \frac{\varepsilon}{2}$ for $m, n \ge N$, and $K$ so that $|a_{n_k} - L| < \frac{\varepsilon}{2}$ for $k \ge K$. Pick $k \ge K$ with $n_k \ge N$. Then for any $n \ge N$:
$$|a_n - L| \le |a_n - a_{n_k}| + |a_{n_k} - L| < \varepsilon. \quad \blacksquare$$

> **The Cauchy criterion is intrinsic** — it refers only to the terms of the sequence, not to any proposed limit. This is extremely useful when the limit is not known in closed form, e.g. in series convergence.

---

## 3.4 Summary

- **Subsequences** select an infinite collection of terms in order; a **cluster point** is the limit of some subsequence.
- ⭐ **Bolzano–Weierstrass**: every bounded sequence has a convergent subsequence. Two proofs: (A) bisection + nested intervals; (B) peak-point lemma + MCT. Both trace back to completeness.
- ⭐ **Cauchy completeness**: in ℝ, a sequence converges iff it is Cauchy. The proof of ($\Leftarrow$) uses BW as its core step.
- BW is one of the most-used tools in the series: it will appear in the proofs of Heine–Borel, uniform continuity, and (implicitly) in the Riemann integrability theorem.

→ [Handout 04: Continuity, Compact Sets, and the Extreme Value Theorem](04-Continuity, Compact Sets, and the Extreme Value Theorem.md)

---

### Exercises

1. Give an example of a sequence that is bounded but does not converge. Identify two distinct cluster points and write down the corresponding convergent subsequences.
2. Prove that if $(a_n)$ has exactly one cluster point $L$, then $a_n \to L$. (Hint: suppose not and derive a contradiction using BW.)
3. The sequence $a_n = \sum_{k=1}^{n} \frac{1}{k^2}$ is increasing and bounded above (you may assume the bound $2$ without proof). Use MCT to conclude it converges. Can you find its limit? (This is a famous open-ended question — the answer is $\pi^2/6$, proved by Euler.)
4. Is the sequence $a_n = \sin(n)$ bounded? Does it have a convergent subsequence? (Hint for the second part: apply BW.)
