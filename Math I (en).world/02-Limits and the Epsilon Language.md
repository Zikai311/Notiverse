# Handout 02 · Limits and the Epsilon Language

> **Goal of this handout:** Replace Newton's "infinitely small but not zero" with something precise. The $\varepsilon$–$N$ definition turns "converging to a limit" from an intuition into a statement that can be checked — and, crucially, *disproved*. We then prove the basic properties of limits that make them useful: uniqueness, boundedness, the algebraic limit laws, and the squeeze theorem. The handout closes with the $\varepsilon$–$\delta$ definition for limits of functions.

**Main theorems:** ⭐ **$\varepsilon$–$N$ definition**; ⭐ **Algebraic Limit Laws**; ⭐ **Squeeze Theorem**.

---

## 2.1 The Adversarial Game

Intuitively, "$a_n \to L$" means that $a_n$ gets arbitrarily close to $L$ as $n$ grows. But "arbitrarily close" is not a definition.

Here is the precise version. Think of it as a two-player game:

- **You** (the sceptic) name a tolerance $\varepsilon > 0$, as small as you like.
- **I** (the analyst) must respond with a threshold $N \in \mathbb{N}$ such that, for *every* $n \ge N$, the term $a_n$ is within $\varepsilon$ of $L$.

If I can always respond — no matter how small your $\varepsilon$ — then the sequence converges to $L$.

### ⭐ Definition 2.1 (Convergence of a Sequence)

We say the sequence $(a_n)$ **converges to $L$**, written $a_n \to L$ or $\lim_{n \to \infty} a_n = L$, if:

$$\forall\,\varepsilon > 0,\quad \exists\, N \in \mathbb{N},\quad \forall\, n \ge N:\quad |a_n - L| < \varepsilon.$$

The **order of quantifiers** is essential. $\forall \varepsilon\, \exists N$ (I respond to your challenge) is completely different from $\exists N\, \forall \varepsilon$ (I fix $N$ before knowing your challenge, which is far weaker and useless for convergence).

> **Example.** Show that $\frac{1}{n} \to 0$.
>
> *Proof.* Given $\varepsilon > 0$, by the Archimedean property (Proposition 1.7) choose $N$ with $\frac{1}{N} < \varepsilon$. Then for all $n \ge N$: $\left|\frac{1}{n} - 0\right| = \frac{1}{n} \le \frac{1}{N} < \varepsilon$. $\blacksquare$

---

## 2.2 Uniqueness and Boundedness

### ⭐ Proposition 2.2 (Uniqueness of Limits)

> If $a_n \to L$ and $a_n \to M$, then $L = M$.

**Proof.** Suppose $L \ne M$; set $\varepsilon = \frac{|L - M|}{2} > 0$. By convergence to $L$, there exists $N_1$ such that $|a_n - L| < \varepsilon$ for $n \ge N_1$. By convergence to $M$, there exists $N_2$ such that $|a_n - M| < \varepsilon$ for $n \ge N_2$. For $n \ge \max(N_1, N_2)$:

$$|L - M| \le |L - a_n| + |a_n - M| < \varepsilon + \varepsilon = |L - M|.$$

A contradiction. Hence $L = M$. $\blacksquare$

Note the technique: take $\varepsilon$ to be *half* the gap you want to rule out. The triangle inequality then forces the gap to be smaller than itself — the only way out is $L = M$.

### 📎 Proposition 2.3 (Convergent Sequences are Bounded)

> If $(a_n)$ converges, then there exists $B > 0$ such that $|a_n| \le B$ for all $n \in \mathbb{N}$.

**Proof.** Take $\varepsilon = 1$. There exists $N$ such that $|a_n - L| < 1$ for $n \ge N$, hence $|a_n| < |L| + 1$ for $n \ge N$. Set $B = \max(|a_1|, \ldots, |a_{N-1}|, |L| + 1)$. $\blacksquare$

---

## 2.3 Algebraic Limit Laws

The following theorem lets us compute limits by breaking a complicated sequence into simpler parts.

### ⭐ Theorem 2.4 (Algebraic Limit Laws)

> Suppose $a_n \to A$ and $b_n \to B$. Then:
> 1. $a_n + b_n \to A + B$
> 2. $c\, a_n \to cA$ for any constant $c$
> 3. $a_n \cdot b_n \to AB$
> 4. $\frac{a_n}{b_n} \to \frac{A}{B}$ provided $B \ne 0$ and $b_n \ne 0$ for all $n$

**Proof of (1).** Given $\varepsilon > 0$, apply convergence of $a_n$ with tolerance $\frac{\varepsilon}{2}$ to get $N_1$, and convergence of $b_n$ with tolerance $\frac{\varepsilon}{2}$ to get $N_2$. For $n \ge \max(N_1, N_2)$:

$$|(a_n + b_n) - (A + B)| \le |a_n - A| + |b_n - B| < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon. \quad \blacksquare$$

The $\frac{\varepsilon}{2}$ split is the signature technique for sum limits: budget your error allowance across the two terms.

**Proof of (3) — the add-and-subtract trick.** Write

$$a_n b_n - AB = a_n(b_n - B) + B(a_n - A).$$

By Proposition 2.3, there exists $C$ with $|a_n| \le C$ for all $n$. Given $\varepsilon > 0$, choose $N$ large enough so that $|a_n - A| < \frac{\varepsilon}{2(|B|+1)}$ and $|b_n - B| < \frac{\varepsilon}{2C}$ for $n \ge N$. Then:

$$|a_n b_n - AB| \le C \cdot \frac{\varepsilon}{2C} + |B| \cdot \frac{\varepsilon}{2(|B|+1)} < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon. \quad \blacksquare$$

The add-and-subtract identity $a_n b_n - AB = a_n(b_n - B) + B(a_n - A)$ is worth remembering as a standard manoeuvre.

---

## 2.4 The Squeeze Theorem ⭐

### ⭐ Theorem 2.5 (Squeeze Theorem)

> Suppose $a_n \le c_n \le b_n$ for all sufficiently large $n$, and $a_n \to L$, $b_n \to L$. Then $c_n \to L$.

**Proof.** Given $\varepsilon > 0$, choose $N$ such that for $n \ge N$: $|a_n - L| < \varepsilon$ and $|b_n - L| < \varepsilon$. Then $L - \varepsilon < a_n \le c_n \le b_n < L + \varepsilon$, so $|c_n - L| < \varepsilon$. $\blacksquare$

---

## 2.5 Divergence to Infinity

We say $a_n \to +\infty$ if for every $M > 0$ there exists $N$ such that $a_n > M$ for all $n \ge N$. This is *not* convergence ($+\infty$ is not a real number), but it has a precise $\varepsilon$-style definition.

---

## 2.6 Limits of Functions: the $\varepsilon$–$\delta$ Definition

The same idea extends from sequences to functions.

### Definition 2.6 (Function Limit)

We say $\lim_{x \to x_0} f(x) = L$ if:

$$\forall\, \varepsilon > 0,\quad \exists\, \delta > 0,\quad \forall\, x:\quad 0 < |x - x_0| < \delta \Rightarrow |f(x) - L| < \varepsilon.$$

The crucial $0 < |x - x_0|$ says $x \ne x_0$: the limit is about the *approach* to $x_0$, not the value *at* $x_0$. This is exactly what legitimises the derivative calculation: the difference quotient $\frac{f(x) - f(x_0)}{x - x_0}$ is undefined at $x = x_0$ (the denominator vanishes), but its limit as $x \to x_0$ — with $x \ne x_0$ throughout — is perfectly well-defined.

> **This is where Berkeley's ghost is finally exorcised.** Newton said "let $\Delta x \to 0$ but also $\Delta x \ne 0$". The $\varepsilon$–$\delta$ language makes this rigorous: we consider $x$ approaching $x_0$ while always remaining distinct from it. No infinitesimals, no logical contradiction.

---

## 2.7 Summary

- ⭐ The **$\varepsilon$–$N$ definition** captures convergence as a two-player game: for every challenge $\varepsilon$, there is a response $N$. Quantifier order is essential.
- ⭐ Limits are **unique** (triangle inequality + half-gap argument) and **bounded sequences** converge only to finite values.
- ⭐ **Algebraic Limit Laws**: sum, scalar multiple, product, and quotient of convergent sequences converge to the corresponding combinations of limits. Key techniques: $\varepsilon/2$ splitting for sums; add-subtract identity for products.
- ⭐ **Squeeze Theorem**: if $a_n \le c_n \le b_n$ and $a_n, b_n \to L$, then $c_n \to L$.
- **$\varepsilon$–$\delta$ for functions**: same spirit, replacing the index $n$ with a continuous variable and $N$ with $\delta$. The $0 < |x - x_0|$ condition is what makes the derivative definition legitimate.

→ [Handout 03: Sequential Compactness and the Bolzano–Weierstrass Theorem](03-Sequential Compactness and the Bolzano-Weierstrass Theorem.md)

---

## 2.8 Application: The Derivative

The $\varepsilon$–$\delta$ definition is now in place. Its first application is the object that motivated the whole enterprise.

### Definition 2.7 (Derivative)

We say $f$ is **differentiable at $x_0$** if the following limit exists:

$$f'(x_0) = \lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0} = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}.$$

This limit is called the **derivative** of $f$ at $x_0$. Geometrically it is the slope of the tangent line; physically it is the instantaneous rate of change.

> **The ghost is fully exorcised.** Newton divided by $\Delta x$ and then discarded it — treating it as zero after using it as nonzero. The $\varepsilon$–$\delta$ definition handles this cleanly: the difference quotient is formed with $x \ne x_0$ throughout (the $0 < |x - x_0|$ condition in Definition 2.6 keeps the denominator nonzero), and we simply ask whether this ratio approaches a limit. No infinitesimals, no contradiction.

**Differentiable implies continuous.** If $f$ is differentiable at $x_0$, then $f$ is continuous at $x_0$:

$$f(x) - f(x_0) = \frac{f(x) - f(x_0)}{x - x_0} \cdot (x - x_0) \xrightarrow{x \to x_0} f'(x_0) \cdot 0 = 0.$$

The converse fails: $|x|$ is continuous at $0$ but not differentiable there (the left and right difference quotients tend to $-1$ and $+1$ respectively).

The derivative will be used in earnest in handouts 05–06, where we prove Fermat's Theorem and the Mean Value Theorem.

---

### Exercises

1. Using the $\varepsilon$–$N$ definition directly, prove that $\frac{2n+1}{n+3} \to 2$.
2. Give a definition of "$a_n$ does **not** converge to $L$" by negating the $\varepsilon$–$N$ definition. Use it to prove that the sequence $(-1)^n$ does not converge.
3. Prove part (4) of the Algebraic Limit Laws: $\frac{a_n}{b_n} \to \frac{A}{B}$ when $B \ne 0$. (Hint: first prove $\frac{1}{b_n} \to \frac{1}{B}$, then apply the product law.)
4. Use the squeeze theorem to evaluate $\lim_{n\to\infty} \frac{\sin n}{n}$.
