# Handout 00 · Introduction: Historical Displacement and Logical Reconstruction

> **Goal of this handout:** Before a single theorem, we ask one prior question — *why does rigour matter?* We trace how calculus was discovered in the wrong order, what went wrong as a result, and how the nineteenth century repaired the damage. The answer shapes the entire logical architecture of this series.

---

## 0.1 The Building and Its Foundations

Here is the structure we will build over the course of this series:

```
  ┌─────────────────────────────────────────┐
  │  4th floor: The Fundamental Theorem     │
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

History built this upside down. Newton and Leibniz moved straight into the fourth floor — derivatives, integrals, and the relationship between them — without having laid the ground floor at all. The building stood for two centuries. Then in 1734, a bishop noticed the foundations were missing.

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

| Approximate date | What was discovered |
|-----------------|---------------------|
| 1660s–1680s | Integration (areas, volumes) |
| 1660s–1680s | Differentiation (tangent lines, rates of change) |
| 1680s | Fundamental Theorem of Calculus (Newton, Leibniz) |
| 1740s–1820s | Series, power series, convergence (informally) |
| 1820s | Rigorous definition of limits (Cauchy) |
| 1860s | Rigorous definition of real numbers (Weierstrass, Dedekind) |

The subject was built from the top down. The most substantial results came first; the justification came two hundred years later. Cauchy introduced the $\varepsilon$–$\delta$ language in the 1820s; Dedekind and Weierstrass gave a rigorous construction of the real numbers in the 1860s–1870s.

**This course reverses the historical order.** We begin at the ground floor — the completeness of $\mathbb{R}$ — and build upwards. This is not the order in which the ideas were discovered, but it is the order in which they can be understood without contradiction.

### Logical Dependency Map

```
                  Completeness of ℝ (LUB Axiom)                  [Handout 01]
                              │
                ┌─────────────┴──────────────┐
                ▼                             ▼
         Limits (ε language)  [Handout 02]   Monotone Convergence
                │                             │
                ▼                             ▼
   Bolzano–Weierstrass Theorem  ◄──────  Nested Intervals  [Handout 03]
   (bounded sequence ⟹ convergent subsequence)
                │
                ▼
       Continuity + Compact sets       [Handout 04]
                │
        ┌───────┴────────┐
        ▼                ▼
   Extreme Value     Intermediate Value Theorem  [Handout 05]
   Theorem (EVT)     (IVT — zeros exist)
   (max/min exist)        │
        │                ▼
        │          Fermat's Theorem (critical point condition)
        │                │
        └───────┬────────┘
                ▼
      Rolle's Theorem ⟹ Mean Value Theorem       [Handout 06]
                │
                ▼
      Corollary: f' ≡ 0 ⟹ f constant    ← bridge to integration
                │
      Riemann integral (partition·approximate·sum·limit)  [Handout 07]
                │
                ▼
      Fundamental Theorem of Calculus (FTC)        [Handout 08]
      · FTC1 (accumulation function is an antiderivative)  ← uses EVT + IVT
      · FTC2 (Newton–Leibniz formula)               ← uses f' ≡ 0 ⟹ const
```

---

## 0.4 Why "Existence" is the Unifying Theme

Every time calculus says something exists — a maximum value, a zero of a function, a point where the derivative equals the average slope, an antiderivative — it is making a claim that must be *proved*. The proof cannot be a picture or an appeal to intuition. It must trace back to something solid.

That solid thing is: **ℝ has no gaps.**

Formally: every non-empty set of real numbers that is bounded above has a least upper bound (a supremum). The rational numbers do not have this property — the set $\{x \in \mathbb{Q} : x^2 < 2\}$ is bounded above in $\mathbb{Q}$ but has no least upper bound in $\mathbb{Q}$, because $\sqrt{2} \notin \mathbb{Q}$. The real numbers are, by definition, the number system that fills all such gaps.

This single property — variously called the **Least Upper Bound Property**, the **Completeness Axiom**, or the **Supremum Principle** — is what makes everything else work. Follow any theorem in this series back to its roots, and you will arrive here.

> **Every object that calculus needs — a maximum value, a zero, a mean-value point, an antiderivative — must first be proved to exist. And every such proof of existence traces back, in the end, to a single source: the completeness of ℝ.**

> The ghost of $\Delta x$ was exorcised when Cauchy replaced "infinitely small" with "for all $\varepsilon > 0$". But the $\varepsilon$ language only *works* because ℝ is complete — otherwise the limits that language describes might not exist.

---

## 0.5 Handouts in This Series

| Handout | Title | Summary |
|---------|-------|---------|
| [00](00-Introduction: Historical Displacement and Logical Reconstruction.md) | Introduction | Why reconstruct in reverse |
| [01](01-The Completeness of the Real Numbers.md) | The Completeness of the Real Numbers | Ground floor: ℝ has no gaps |
| [02](02-Limits and the Epsilon Language.md) | Limits and the Epsilon Language | Banishing the ghost of infinitesimals |
| [03](03-Sequential Compactness and the Bolzano-Weierstrass Theorem.md) | Sequential Compactness and Bolzano–Weierstrass | Bounded sequences cannot escape |
| [04](04-Continuity, Compact Sets, and the Extreme Value Theorem.md) | Continuity, Compact Sets, and EVT | Existence guarantee for optimisation |
| [05](05-The Intermediate Value Theorem and Fermat's Theorem.md) | The Intermediate Value Theorem and Fermat's Theorem | Zeros exist; critical point condition |
| [06](06-The Mean Value Theorem.md) | The Mean Value Theorem | Rolle to Lagrange; the bridge to integration |
| [07](07-The Riemann Integral.md) | The Riemann Integral | A rigorous definition of area |
| [08](08-The Fundamental Theorem of Calculus.md) | The Fundamental Theorem of Calculus | Differentiation and integration are inverse operations |
| [09](09-Epilogue: The Complete Picture and Formalisation.md) | Epilogue: The Complete Picture and Formalisation | The full dependency chain; Lean formalisation |

---

## 0.6 How to Read This Series

Each handout opens with a **motivation section** — the "why" before the "what". The theorems follow the pattern:

- **Motivation** — what problem forces this definition or theorem into existence
- **Proof strategy** — the key idea in plain language, before any symbols appear
- **Proof details** — the rigorous argument

**⭐** marks the load-bearing theorems of the series — the ones every later handout depends on directly.  
**📎** marks technical lemmas: necessary scaffolding, but not the main story. On a first reading, accept them and move on.

The series is a **single dependency chain**. A theorem in handout $n$ is only invoked after it has been proved in an earlier handout. Follow the arrows in the map above and the logic is self-contained.

---

## 0.7 Notation

| Symbol | Meaning |
|--------|---------|
| $\mathbb{N}$ | Natural numbers $\{1, 2, 3, \ldots\}$ |
| $\mathbb{Q}$ | Rational numbers |
| $\mathbb{R}$ | Real numbers |
| $\forall$ | "for all" |
| $\exists$ | "there exists" |
| $\sup S$ | Least upper bound (supremum) of set $S$ |
| $\inf S$ | Greatest lower bound (infimum) of set $S$ |
| $(a_n)$ | A sequence with general term $a_n$ |
| $a_n \to L$ | The sequence $(a_n)$ converges to $L$ |
| $[a,b]$ | Closed interval: $\{x \in \mathbb{R} : a \le x \le b\}$ |
| $(a,b)$ | Open interval: $\{x \in \mathbb{R} : a < x < b\}$ |

---

→ [Handout 01: The Completeness of the Real Numbers](01-The Completeness of the Real Numbers.md)

---

### Exercises

1. In your own words, explain why Newton's derivation of $\frac{d}{dx}(x^2) = 2x$ is logically circular. What assumption is made twice with contradictory values?

2. Look up one other objection Berkeley raised in *The Analyst*. Is it a mathematical criticism, a philosophical one, or both?

3. Suppose someone says: "The $\varepsilon$–$\delta$ definition of a limit works fine for functions on $\mathbb{Q}$, so we don't need ℝ to be complete." Construct a specific counterexample — a sequence of rationals that *should* converge but does not converge *in* $\mathbb{Q}$.

4. Preview question: we will define $\sup S$ carefully in handout 01. Before reading it, try to write down what properties a "least upper bound" should have. How many properties are needed to pin down the definition uniquely?
