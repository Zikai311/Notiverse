# Handout 08 · The Fundamental Theorem of Calculus

> **Goal of this handout:** We prove that **differentiation and integration are inverse operations**. The proof assembles the major tools from the preceding seven handouts: EVT, IVT, the Bridge Corollary, and the integrability of continuous functions.

**Main theorems:** ⭐ **FTC1 (the variable upper limit integral is an antiderivative)**; ⭐ **FTC2 (Newton–Leibniz formula)**.

---

## 8.1 Motivation: An Unlikely Coincidence

Up to this point, differentiation and integration have been entirely separate enterprises:

- **Differentiation** (handouts 05–06): the study of *local* change — tangent slopes, instantaneous rates.
- **Integration** (handout 07): the study of *global* accumulation — areas under curves.

One concerns slopes; the other concerns areas. They seem to have nothing to do with each other.

Newton and Leibniz discovered that they are in fact **inverses**: computing an area (integrating) and computing a slope (differentiating) are reverse operations, just as addition and subtraction, or multiplication and division, reverse each other.

This is the **Fundamental Theorem of Calculus** — "fundamental" because it welds the two theories into a single discipline, and because it gives us a powerful practical tool:

> To compute a complicated integral $\int_a^b f(x)\,dx$, you need not perform an infinite limiting process. You need only find *one* antiderivative $F$ (a function with $F' = f$) and evaluate $F(b) - F(a)$.

**FTC2 converts integration into reverse differentiation.** Our task in this handout is to prove that this "unlikely coincidence" is in fact a logical necessity.

---

## 8.2 FTC1: The Variable Upper Limit Integral is an Antiderivative ⭐

First, we turn the area into a function by letting the upper endpoint vary.

### Definition 8.1 (Variable Upper Limit Integral)

Let $f$ be continuous on $[a,b]$ (hence integrable, by Theorem 7.4). Define

$$\Phi(x) = \int_a^x f(t)\, dt, \qquad x \in [a,b].$$

$\Phi(x)$ is the accumulated area from $a$ to $x$ — it is a new function of $x$.

### ⭐ Theorem 8.2 (FTC1)

> If $f$ is continuous on $[a,b]$, then $\Phi$ is differentiable on $[a,b]$ and
> $$\Phi'(x) = f(x) \quad \text{for every } x \in [a,b].$$
> In other words, **$\Phi$ is an antiderivative of $f$** — every continuous function has an antiderivative. This is an existence result.

> **Proof strategy.** We go directly to the definition of the derivative:
> $$\Phi'(x) = \lim_{h \to 0} \frac{\Phi(x+h) - \Phi(x)}{h}.$$
> By the **additivity** of the integral (§7.5), the numerator $\Phi(x+h) - \Phi(x) = \int_x^{x+h} f$ — the thin strip of area between $x$ and $x+h$. So the difference quotient is the *average value* of $f$ on $[x, x+h]$.
>
> As $h \to 0$, this thin strip shrinks to the single point $x$, and the average value should approach $f(x)$ — provided $f$ is continuous there.
>
> Two tools make this rigorous: **EVT** pins down the strip's maximum and minimum values (bounding the average from above and below), and **IVT** finds an interior point where $f$ exactly equals that average. Then continuity carries the argument home. **This is where EVT and IVT converge for the first time.**

**Proof.** Fix $x \in [a,b]$; take $h > 0$ (the case $h < 0$ is symmetric). By additivity:

$$\Phi(x+h) - \Phi(x) = \int_a^{x+h} f - \int_a^x f = \int_x^{x+h} f(t)\, dt.$$

**Step 1 — EVT bounds the strip.** $f$ is continuous on $[x, x+h]$, so by **EVT** it attains its minimum $m_h$ and maximum $M_h$ there. By the **integral bounds** (§7.5):

$$m_h \cdot h \le \int_x^{x+h} f \le M_h \cdot h.$$

Dividing by $h > 0$:

$$m_h \le \frac{\Phi(x+h) - \Phi(x)}{h} \le M_h.$$

The difference quotient lies between the minimum and maximum of $f$ on $[x, x+h]$ — it is an "average value" of $f$ on that strip.

**Step 2 — IVT pins it to a real point.** By **IVT** (Theorem 5.1), $f$ takes every value between $m_h$ and $M_h$ on $[x, x+h]$. Since the difference quotient is one such value, there exists $c_h \in [x, x+h]$ with

$$f(c_h) = \frac{\Phi(x+h) - \Phi(x)}{h}.$$

(This step upgrades "the difference quotient is an average" to "the difference quotient equals $f$ at some specific point". This is sometimes called the **Integral Mean Value Theorem**: $\int_x^{x+h} f = f(c_h) \cdot h$ for some $c_h$ in the interval.)

**Step 3 — continuity closes the limit.** As $h \to 0$: since $c_h \in [x, x+h]$, the squeeze theorem gives $c_h \to x$. By **continuity** of $f$, $f(c_h) \to f(x)$. Therefore:

$$\Phi'(x) = \lim_{h \to 0} \frac{\Phi(x+h) - \Phi(x)}{h} = \lim_{h \to 0} f(c_h) = f(x). \qquad \blacksquare$$

> **The proof draws on:** additivity (to write the strip integral), **EVT** (to bound the difference quotient), **IVT** (to realise it as a function value), and **continuity** (to pass to the limit). Two of the three handouts above this one contributed their main theorem directly.

---

## 8.3 FTC2: The Newton–Leibniz Formula ⭐

Now we deliver the practical payoff.

### ⭐ Theorem 8.3 (FTC2, Newton–Leibniz Formula)

> Let $f$ be continuous on $[a,b]$, and let $F$ be **any** antiderivative of $f$ — that is, any function satisfying $F' = f$ on $[a,b]$. Then:
> $$\int_a^b f(x)\, dx = F(b) - F(a).$$

> **Proof strategy.** This is the **Bridge Corollary of handout 06** being cashed in directly. We have two antiderivatives of $f$: the one manufactured by FTC1 ($\Phi$, with $\Phi' = f$) and the given $F$ (also with $F' = f$). Their derivatives are equal everywhere. By Corollary 6.3, they differ by a constant. Substituting the endpoints cancels the constant and delivers the formula.

**Proof.** By FTC1, $\Phi(x) = \int_a^x f$ satisfies $\Phi' = f$. By hypothesis, $F' = f$. Hence $(F - \Phi)' = 0$ on $[a,b]$.

By **Corollary 6.3** (Bridge Corollary, handout 06), there exists a constant $C$ such that $F(x) = \Phi(x) + C$ for all $x \in [a,b]$.

Substituting $x = a$: $F(a) = \Phi(a) + C = 0 + C = C$ (since $\Phi(a) = \int_a^a f = 0$).

Substituting $x = b$: $F(b) = \Phi(b) + C = \int_a^b f + C$.

Therefore: $F(b) - F(a) = \int_a^b f + C - C = \int_a^b f$. $\blacksquare$

> **Why can $F$ be *any* antiderivative?** Because all antiderivatives of $f$ differ from each other by a constant (Corollary 6.3), and that constant cancels in $F(b) - F(a)$. This is what makes FTC2 so powerful in practice: pick whichever antiderivative is most convenient to compute.

---

## 8.4 The Complete Logical Diagram

Every theorem in this series has now played its part. Here is the full dependency map:

```
           Completeness of ℝ (LUB Axiom)                         [Handout 01]
                       │
         ┌─────────────┼──────────────────┐
         ▼             ▼                   ▼
    Archimedean   Nested Intervals /     LUB Principle
     Property         MCT
         │             │                   │
         │             ▼                   │
         │     Bolzano–Weierstrass         │           [Handout 03]
         │             │                   │
         ▼             ▼                   ▼
    ε language  Compact Sets /      ┌── IVT (zeros)  [Handout 05]
    [Handout 02]  Heine–Borel        │       │
                      │              │       ▼
                      ▼              │  Fermat (critical pts)
              Continuous image       │       │
              of compact = compact   │       │
                  ⟹ EVT [H.04]      │       │
                      │              └───────┤
                      └──────────┬───────────┘
                                 ▼
                        Rolle ⟹ MVT (Lagrange)          [Handout 06]
                                 │
                                 ▼
                     Corollary: f'≡0 ⟹ constant ─────────────────┐
                                                                  │
         ┌───────────────────────────────────────┐               │
         ▼ (uniform continuity ← compactness)    │               ▼
  Continuous ⟹ Integrable [H.07]                FTC1: Φ'=f  [Handout 08]
         │                    (uses EVT + IVT) ──┤
         └──────► Riemann Integral ──────────────►
                                                  ▼
                                         FTC2: Newton–Leibniz
                                         (uses f'≡0 ⟹ const)
                                                  │
                                                  ▼
                                    ★ Differentiation ⇄ Integration ★
```

Observe the two inputs to FTC:

- **FTC1** uses **EVT** (handout 04) and **IVT** (handout 05) — the two existence pillars converge here.
- **FTC2** uses the **Bridge Corollary** (handout 06) — the MVT's payoff arrives here.

And EVT, IVT, and the Bridge Corollary all trace their roots to **completeness**. Therefore:

> **The Fundamental Theorem of Calculus — the culmination of this series — rests on a single foundation: the real numbers have no gaps.**

Every step in the proof chain traces back to completeness.

---

## 8.5 Summary

- ⭐ **FTC1**: $\Phi(x) = \int_a^x f$ satisfies $\Phi' = f$ — continuous functions *always* have antiderivatives. Proof uses: **additivity** + **EVT** + **IVT** + continuity (the key step is the Integral Mean Value Theorem: the difference quotient equals $f$ at some point).
- ⭐ **FTC2 (Newton–Leibniz)**: $\int_a^b f = F(b) - F(a)$ for any antiderivative $F$. Proof uses only: $\Phi$ and $F$ have equal derivatives, so the Bridge Corollary gives $F = \Phi + C$; endpoint substitution cancels $C$.
- Together: **differentiation and integration are inverse operations.** This transforms the problem of computing areas from infinite limiting processes into reverse lookup of antiderivatives.
- **The full series converges here:** EVT, IVT, and the Bridge Corollary all converge at FTC, and all trace back to completeness.

The final handout steps back to survey the whole picture and introduces the formal verification task — checking these arguments in a proof assistant.

→ [Handout 09: Epilogue — The Complete Picture and Formalisation](09-Epilogue: The Complete Picture and Formalisation.md)

---

### Exercises

1. Use FTC (differentiation under the integral sign) to compute $\dfrac{d}{dx}\displaystyle\int_0^{x^2} \cos(t)\, dt$. (Hint: FTC1 plus the chain rule.)
2. In the proof of FTC1, which step requires continuity of $f$? If $f$ had a jump discontinuity at $x$, identify at which step the proof would fail.
3. FTC2 says $\int_a^b f = F(b) - F(a)$ for *any* antiderivative $F$. Compute $\int_0^{\pi} \sin(x)\, dx$ using two different antiderivatives (e.g. $-\cos x$ and $-\cos x + 7$) and verify you get the same answer.
4. Reconstruct the full logical chain from memory: starting at "completeness of ℝ", name every theorem in order up to "Newton–Leibniz formula", and state which theorem each one depends on. Check against the diagram in §8.4.
