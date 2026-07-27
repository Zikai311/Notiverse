# Handout 09 · Epilogue: The Complete Picture and Formalisation

> **Goal of this handout:** No new theorems. We do three things: (1) compress the entire series into a single sentence and a single table; (2) honestly acknowledge what we have skipped and where the rigour still has edges; (3) introduce **formal verification** — the idea of checking mathematical proofs with a computer — and explain the winter task.

---

## 9.1 The Series in One Sentence

If the nine handouts had to be compressed into a single statement, it would be the guiding spirit repeated at the start of every handout:

> **Every object that calculus needs — a maximum value, a zero, a mean-value point, an antiderivative — must first be proved to exist. And every such existence proof traces back, in the end, to a single source: the completeness of ℝ.**

The table below shows how this played out:

| Layer | Handout | Key theorem | What it delivers |
|-------|---------|-------------|-----------------|
| Ground floor | 01 | Completeness (LUB axiom) | "ℝ has no gaps" |
| 2nd floor | 02 | $\varepsilon$ language | Limits are checkable, not just felt |
| 2nd floor | 03 | Bolzano–Weierstrass | Bounded sequences always hide a convergent subsequence |
| 2nd floor | 04 | Compactness / EVT | Extrema *exist* |
| 3rd floor | 05 | IVT / Fermat | Zeros *exist* / interior extrema have zero derivative |
| 3rd floor | 06 | Rolle / MVT | $f' \equiv 0 \Rightarrow f$ constant |
| Top floor | 07 | Riemann integral | Area has a definition; continuous $\Rightarrow$ integrable |
| Top floor | 08 | FTC | Differentiation $\rightleftharpoons$ integration |

If you can narrate this table from memory — tracing every arrow back to its dependency — you have understood the architecture of the course. That ability is worth more than facility with any single calculation.

---

## 9.2 A Historical Reconciliation

Return to the opening of handout 00. We described calculus as having been built upside down: Newton and Leibniz worked at the top floor (derivatives, integrals, FTC) while the ground floor was empty. The Second Mathematical Crisis was the moment someone looked down and noticed.

Now you can appreciate what the repair work actually involved:

- **Newton and Leibniz** worked at the summit — derivatives, integrals, and the germ of the FTC — on foundations that did not yet exist. Their intuitions were right; their justifications were not.
- **Cauchy** (1820s) rebuilt the second floor: the $\varepsilon$–$\delta$ language replaced infinitesimals with something checkable.
- **Weierstrass and Dedekind** (1860s–1870s) dug the ground floor: a rigorous construction of ℝ, making completeness a theorem rather than an assumption.

This course did not follow the historical path. We built from the ground up — from a number system with no gaps, upward to limits, then compactness, then calculus. The result is a building in which every brick can be inspected: there are no floors where the beams are secretly made of good intentions.

> **The broader lesson:** The most substantial results (FTC) and the most unassuming foundations (completeness) are often separated by the entire height of the building. But the foundations are what decide whether the building stands. Whenever something "obviously" works, look downward once — the interesting question is usually there.

---

## 9.3 What We Skipped
A good course is honest about its own edges. We deliberately simplified or omitted the following; none of them undermine the main arguments, but you will fill them in when you study real analysis properly:

1. **The construction of ℝ (handout 01).** We took completeness as an axiom. There are two standard constructions of ℝ from ℚ — **Dedekind cuts** and **equivalence classes of Cauchy sequences** — each of which turns the LUB property from an axiom into a theorem. The axiomatic approach is pedagogically cleaner for a first course.

2. **The other half of several biconditionals.** For example: the sequential characterisation of continuity (we proved the easier direction); the full Heine–Borel theorem (we proved "closed + bounded ⟹ compact" carefully, and sketched the converse); the complete proof of the Cauchy criterion.

3. **Uniform continuity (handout 07, Heine–Cantor).** We gave the BW-based sketch of why uniform continuity holds on closed bounded intervals but did not write out the full $\varepsilon$ argument.

4. **The limits of Riemann integration.** The Dirichlet function is not Riemann integrable, yet it is zero "almost everywhere" — suggesting the definition is too restrictive. The **Lebesgue integral** handles vastly more functions and is the standard tool of modern analysis. Riemann integration is the right starting point, but not the endpoint.

5. **Higher floors:** multivariable calculus, series convergence theory, complex analysis, measure theory — the building continues upward well beyond this course.

> Knowing what you do not yet know is part of rigour. These are not gaps; they are doors.

---

## 9.4 Formalisation

The full title of this course is *Calculus — Theory, Applications, and **Formal Methods***. The first eight handouts covered the theory. Now for the third term.

### What is formal verification?

Throughout this series, we have insisted on not letting any "obvious" step slide by. But mathematicians are human: we tire, we fill in gaps with intuition, we miss things. A proof that convinced every reader for two centuries might still contain a subtle error — as happened more than once in the history of mathematics.

**Formal verification** takes "no sliding" to its logical conclusion: every step of a proof is written as code that a computer checks, line by line. The computer has no intuition, no patience for "it's clear that", no tolerance for implicit reasoning. If the logic does not hold, the check fails.

**Lean** is one such system — a *proof assistant* and *interactive theorem prover*. In Lean, you do not write a proof for a human reader; you write it for a machine that will reject every unjustified step. If the proof compiles, it is correct.

> **This is the same spirit that has driven the whole course** — "do not let any 'obvious' pass without examination" — carried to its logical conclusion.

Why is the material of this course well-suited to formalisation? Because the $\varepsilon$–$N$ and $\varepsilon$–$\delta$ definitions already have the structure of formal logic: $\forall \varepsilon > 0,\ \exists N,\ \forall n \ge N: \ldots$. In Lean, this becomes literally `∀ ε > 0, ∃ N, ∀ n ≥ N, ...`. You have been writing formal logic on paper all along; the winter task asks you to run it on a machine.

---

## 9.5 The Winter Task

> **From the course outline:** Due to time constraints in the lectures, the detailed treatment of **sequence convergence** — specifically, the $\varepsilon$–$N$ proofs and the basic limit laws — is to be completed independently via the **Lean Real Analysis Game** (*Mathematics in Lean* / *Natural Number Game*), **first 15 levels**.

### What you will do

Complete the first 15 levels of the Lean Real Analysis Game. Each level is a proof about sequences or limits that you must construct using Lean's tactic language. The game provides feedback on every step.

### What you will see confirmed

- **The quantifier order $\forall \varepsilon\, \exists N$ cannot be swapped.** Lean makes this concrete: if you try to construct $N$ before knowing $\varepsilon$, the proof does not type-check. There is no "well, you know what I mean" — the machine does not.
- **Taking $\max(N_1, N_2)$ to satisfy two thresholds simultaneously** (handout 02, §2.3) — in Lean this appears explicitly as `max N₁ N₂`, and you must prove both bounds hold for indices beyond it.
- **Splitting $\varepsilon$ as $\varepsilon/2$** (handout 02, sum law) — in Lean you explicitly construct `ε/2` and verify the arithmetic.

Every proof technique you practised on paper becomes a concrete object the machine can inspect. The first few levels will feel frustrating: Lean will reject a step you consider trivially obvious. That frustration is the point — it shows you where your mental proof was skipping ahead.

### How to approach it

1. Before each level, look up the corresponding section in handouts 02–03. Read the proof. Understand which $N$ to choose and why.
2. Attempt the Lean proof. When it rejects a step, that step is where your paper proof was incomplete.
3. After completing a level, write one sentence: *"The machine made me see that I had been skipping ..."*.

These sentences, accumulated over 15 levels, are a record of exactly where your understanding has been sharpened.

> **The connection to the whole course.** Berkeley challenged Newton's "obvious" reasoning two centuries ago. Today, you challenge your own. A proof assistant — Lean in this case — enforces the same standard computationally: every step must be fully justified; appeals to intuition are rejected. The intellectual demand is the same; the medium has changed.

---

## 9.6 Closing Words

This course has done one thing, done thoroughly:

**It took seventeenth-century calculus — a building constructed on uncertain ground — dismantled it brick by brick, and rebuilt it from a foundation that can be examined: the completeness of the real numbers.**

What you should carry away is not a list of theorems, but a **way of looking**:

- When something is claimed to exist, ask: *what guarantees existence? Does it trace to completeness?*
- When something is called "obvious", ask: *what is the precise argument? Where would the proof fail if the hypotheses were weakened?*

This habit of mind will accompany you into whatever mathematics you pursue next — real analysis, topology, algebra, or wherever the next floor of the building takes you.

Good luck with Lean. See you there.

← Back to [Series Introduction](Math I intro.md)

---

### Final Exercises (Comprehensive)

1. **Without notes**, draw the full logical dependency diagram from "completeness of ℝ" to "Newton–Leibniz formula", labelling every theorem and every dependency arrow. Then compare with the diagram in handout 08, §8.4. Identify any arrow you missed.

2. **Self-test by layer.** For each of the following theorems, identify which *face of completeness* (LUB axiom / MCT / Nested Intervals / Archimedean property / Bolzano–Weierstrass) is its most direct root: (a) EVT; (b) IVT; (c) Continuous $\Rightarrow$ integrable; (d) $\frac{1}{n} \to 0$.

3. **Explain it simply.** Describe to someone who has not studied this course why "a continuous function on a closed interval always has a maximum value" is not obvious, and which mathematical fact ultimately guarantees it. Use no jargon beyond "sequence" and "limit".

4. Begin the Lean Real Analysis Game. After completing level 5, write down the step the machine rejected that you had considered obvious. After completing level 15, write down how your understanding of the $\varepsilon$–$N$ definition has changed.
