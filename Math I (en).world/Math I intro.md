# Math I · Series Introduction

**Series:** Calculus — Theory, Applications, and Formal Methods
**Audience:** Students encountering rigorous analysis for the first time

**Spirit of the series:**
> Every object that calculus needs — a maximum value, a zero, a mean-value point, an antiderivative — must first be *proved to exist*. And every such proof of existence traces back, in the end, to a single source: **the completeness of ℝ**.

---

## Logical Dependency Map

```
              Completeness of ℝ (Least Upper Bound Property)             [Handout 01]
                              │
              ┌───────────────┼────────────────────┐
              ▼               ▼                     ▼
        Archimedean     Nested Intervals /        LUB Principle
         Property            MCT
              │               │                     │
              │               ▼                     │
              │       Bolzano–Weierstrass            │           [Handout 03]
              │               │                     │
              ▼               ▼                     ▼
         ε Language   Compact Sets /         ┌── IVT (Zeros)  [Handout 05]
         [Handout 02]  Heine–Borel            │       │
                           │                 │       ▼
                           ▼                 │   Fermat's Thm
                   Continuous image     │   (critical pts)
                   of compact set       │       │
                       ⟹ EVT [Handout 04]  │       │
                           │               └───────┤
                           └──────────┬────────────┘
                                      ▼
                             Rolle ⟹ Lagrange MVT       [Handout 06]
                                      │
                                      ▼
                           Corollary: f' ≡ 0 ⟹ constant
                                      │
              ┌───────────────────────┘
              ▼                                    ▼
   Continuous ⟹ Integrable                   FTC1: Φ' = f          [Handout 08]
   (uniform continuity ← compactness)    (uses EVT + IVT)
   [Handout 07]                               │
              │                               │
              └──────► Riemann Integral ──────►
                                              ▼
                                   FTC2: Newton–Leibniz
                                   (uses f' ≡ 0 ⟹ const)
                                              │
                                              ▼
                                  ★ Differentiation ⇄ Integration ★
```

---

## How to Read This Series

Each handout opens with a **motivation section** — the "why" before the "what". Please read it carefully; it is not decoration. The theorems follow the pattern:

- **Motivation** — what problem forces this definition or theorem into existence
- **Proof strategy** — the key idea in plain language, before any symbols appear
- **Proof details** — the rigorous argument

**⭐** marks the load-bearing theorems of the series — the ones every later handout depends on directly.  
**📎** marks technical lemmas: necessary scaffolding, but not the main story.

The series is designed as a **single dependency chain**. A theorem in handout $n$ is only invoked after it has been proved in an earlier handout. Follow the arrows in the map above and the logic is self-contained.

---

## Notation Conventions

| Symbol | Meaning |
|--------|---------|
| $\mathbb{N}$ | Natural numbers $\{1, 2, 3, \ldots\}$ |
| $\mathbb{Q}$ | Rational numbers |
| $\mathbb{R}$ | Real numbers |
| $\forall$ | "for all" |
| $\exists$ | "there exists" |
| $\sup S$ | Least upper bound (supremum) of set $S$ |
| $\inf S$ | Greatest lower bound (infimum) of set $S$ |
| $\{a_n\}$ | A sequence with general term $a_n$ |
| $a_n \to L$ | The sequence $(a_n)$ converges to $L$ |
| $[a,b]$ | Closed interval: $\{x \in \mathbb{R} : a \le x \le b\}$ |
| $(a,b)$ | Open interval: $\{x \in \mathbb{R} : a < x < b\}$ |

---

## Handouts in This Series

- [Handout 00 — Introduction: Historical Displacement and Logical Reconstruction](00-Introduction: Historical Displacement and Logical Reconstruction.md)
- [Handout 01 — The Completeness of the Real Numbers](01-The Completeness of the Real Numbers.md)
- [Handout 02 — Limits and the Epsilon Language](02-Limits and the Epsilon Language.md)
- [Handout 03 — Sequential Compactness and the Bolzano–Weierstrass Theorem](03-Sequential Compactness and the Bolzano-Weierstrass Theorem.md)
- [Handout 04 — Continuity, Compact Sets, and the Extreme Value Theorem](04-Continuity, Compact Sets, and the Extreme Value Theorem.md)
- [Handout 05 — The Intermediate Value Theorem and Fermat's Theorem](05-The Intermediate Value Theorem and Fermat's Theorem.md)
- [Handout 06 — The Mean Value Theorem](06-The Mean Value Theorem.md)
- [Handout 07 — The Riemann Integral](07-The Riemann Integral.md)
- [Handout 08 — The Fundamental Theorem of Calculus](08-The Fundamental Theorem of Calculus.md)
- [Handout 09 — Epilogue: The Complete Picture and Formalisation](09-Epilogue: The Complete Picture and Formalisation.md)
