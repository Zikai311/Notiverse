# Handout 00 · Introduction: Historical Displacement and Logical Reconstruction

> **Goal of this handout:** Before a single theorem, we ask one prior question — *why does rigour matter?* We trace how calculus was discovered in the wrong order, what went wrong as a result, and how the nineteenth century repaired the damage. The answer shapes the entire logical architecture of this series.

---

## 0.1 The Building and Its Foundations

Here is the structure we will build over the course of this series:

```
  ┌─────────────────────────────────────────┐
  │  4th floor: The Fundamental Theorem     │  ← where everyone wants to live
  │  (differentiation ⇄ integration)        │
  ├─────────────────────────────────────────┤
  │  3rd floor: Mean Value Theorem,         │
  │  Intermediate Value Theorem             │
  ├─────────────────────────────────────────┤
  │  2nd floor: Limits, Continuity,         │
  │  Sequences, Compactness                 │
  ├─────────────────────────────────────────┤
  │  Ground floor: Completeness of ℝ        │  ← the only thing holding it up
  └─────────────────────────────────────────┘
```

History built this upside down. Newton and Leibniz moved straight into the fourth floor — derivatives, integrals, and the relationship between them — without having laid the ground floor at all. The building stood, dazzlingly, for two centuries. Then in 1734, a bishop noticed the foundations were missing.

---

## 0.2 The Second Mathematical Crisis

### What Newton actually wrote

When Newton computed a derivative, he reasoned roughly like this. To find the instantaneous rate of change of $f(x) = x^2$:

$$\frac{(x+\Delta x)^2 - x^2}{\Delta x} = \frac{2x\,\Delta x + (\Delta x)^2}{\Delta x} = 2x + \Delta x.$$

Then he *discarded* $\Delta x$, concluding the derivative is $2x$.

The manipulation is: first treat $\Delta x$ as a nonzero quantity (divide by it), then treat it as zero (throw it away). Is $\Delta x$ zero or not? Newton called these quantities **fluxions** or **infinitesimals** — quantities that are "infinitely small but not zero". This is not a definition. It is a hope dressed up as mathematics.

### Berkeley's objection

In 1734, Bishop George Berkeley published *The Analyst*, addressed to "an Infidel Mathematician". His critique was surgical:

> *"And what are these fluxions? The velocities of evanescent increments. And what are these same evanescent increments? They are neither finite quantities, nor quantities infinitely small, nor yet nothing. May we not call them the ghosts of departed quantities?"*

Berkeley was not being hostile to mathematics. He was pointing out a genuine logical contradiction: you cannot divide by $\Delta x$ and simultaneously assume $\Delta x = 0$. The calculation *worked*, but the justification was incoherent.

This was the **Second Mathematical Crisis** — not because calculus produced wrong answers, but because nobody could say *why* it produced right ones. The entire edifice rested on a foundation that had never been examined.

---

## 0.3 Historical Order vs Logical Order

Here is the uncomfortable fact about how calculus actually developed:

| Approximate date | What was discovered |
|-----------------|---------------------|
| 1660s–1680s | Integration (areas, volumes) |
| 1660s–1680s | Differentiation (tangent lines, rates of change) |
| 1680s | Fundamental Theorem of Calculus (Newton, Leibniz) |
| 1740s–1820s | Series, power series, convergence (informally) |
| 1820s | Rigorous definition of limits (Cauchy) |
| 1860s | Rigorous definition of real numbers (Weierstrass, Dedekind) |

The subject was built from the top down. The most spectacular results came first; the justification came two hundred years later. Cauchy introduced the $\varepsilon$–$\delta$ language in the 1820s; Dedekind and Weierstrass gave a rigorous construction of the real numbers in the 1860s–1870s.

**This course reverses the historical order.** We begin at the ground floor — the completeness of $\mathbb{R}$ — and build upwards. This is not the order in which the ideas were discovered, but it is the order in which they can be understood without contradiction.

---

## 0.4 Why "Existence" is the Unifying Theme

Every time calculus says something exists — a maximum value, a zero of a function, a point where the derivative equals the average slope, an antiderivative — it is making a claim that must be *proved*. The proof cannot be a picture or an appeal to intuition. It must trace back to something solid.

That solid thing is: **ℝ has no gaps.**

Formally: every non-empty set of real numbers that is bounded above has a least upper bound (a supremum). The rational numbers do not have this property — the set $\{x \in \mathbb{Q} : x^2 < 2\}$ is bounded above in $\mathbb{Q}$ but has no least upper bound in $\mathbb{Q}$, because $\sqrt{2} \notin \mathbb{Q}$. The real numbers are, by definition, the number system that fills all such gaps.

This single property — variously called the **Least Upper Bound Property**, the **Completeness Axiom**, or the **Supremum Principle** — is what makes everything else work. Follow any theorem in this series back to its roots, and you will arrive here.

> **The ghost of $\Delta x$ was exorcised when Cauchy replaced "infinitely small" with "for all $\varepsilon > 0$".
> But the $\varepsilon$ language only *works* because ℝ is complete — otherwise the limits that language describes might not exist.**

---

## 0.5 A Map of the Journey

The course is structured as a single logical chain. Each handout has exactly one job: to deliver one key theorem to the handout above it.

| Handout | Key theorem delivered | Depends on |
|---------|----------------------|------------|
| 01 | Completeness of ℝ (LUB axiom) | Axiom |
| 02 | Limits: the $\varepsilon$–$N$ language | Completeness |
| 03 | Bolzano–Weierstrass theorem | Completeness |
| 04 | Extreme Value Theorem (EVT) | BW, limits |
| 05 | Intermediate Value Theorem (IVT), Fermat's theorem | Completeness, limits |
| 06 | Mean Value Theorem (MVT) | EVT, Fermat |
| 07 | Riemann integral; continuity ⟹ integrability | Compactness |
| 08 | Fundamental Theorem of Calculus | EVT, IVT, MVT corollary |

By the end of handout 08, the Second Mathematical Crisis will be fully resolved: the "ghost of departed quantities" will have been replaced by a complete, rigorous argument that Berkeley himself could not fault.

→ [Handout 01: The Completeness of the Real Numbers](01-The Completeness of the Real Numbers.md)

---

### Exercises

1. In your own words, explain why Newton's derivation of $\frac{d}{dx}(x^2) = 2x$ is logically circular. What assumption is made twice with contradictory values?

2. Look up one other objection Berkeley raised in *The Analyst*. Is it a mathematical criticism, a philosophical one, or both?

3. Suppose someone says: "The $\varepsilon$–$\delta$ definition of a limit works fine for functions on $\mathbb{Q}$, so we don't need ℝ to be complete." Construct a specific counterexample — a sequence of rationals that *should* converge but does not converge *in* $\mathbb{Q}$.

4. Preview question: we will define $\sup S$ (the supremum of a set $S$) carefully in handout 01. Before reading it, try to write down what properties a "least upper bound" should have. How many properties are needed to pin down the definition uniquely?
