# Handout 06 · The Mean Value Theorem

> **Goal of this handout:** Use the two pillars from the previous two handouts (EVT and Fermat) together to prove **Rolle's Theorem**, then generalise to the **Mean Value Theorem (MVT)**. The payoff is a corollary that looks almost trivial but is the single key unlocking the Fundamental Theorem of Calculus: *if a function's derivative is identically zero, the function is constant.*

**Main theorems:** ⭐ **Rolle's Theorem**; ⭐ **Lagrange's Mean Value Theorem (MVT)**; ⭐ **Corollary: $f' \equiv 0 \Rightarrow f$ constant**.

---

## 6.1 Motivation: From Local to Global

The derivative is **local** information: it tells you the slope of the curve at a single point. But the questions we care about are usually **global**:

- If a function has a positive derivative everywhere on an interval, is it increasing on the whole interval?
- If two functions have identical derivatives everywhere, do they differ by at most a constant?
- If a function's derivative is identically zero, is the function truly constant — or could it make some hidden jump somewhere?

These "local ⟹ global" inferences are **not obvious.** Just because the instantaneous slope is zero at every point does not immediately tell us that the function has not moved across the whole interval. The unseen interior might, for all we know, misbehave.

**The Mean Value Theorem is the bridge from local to global.** Its content is:

> The average rate of change over $[a,b]$ (the slope of the chord) is *exactly* the instantaneous rate of change at some intermediate point.

Once we know that "the chord slope equals some tangent slope", we can control global behaviour using derivative information. In particular: "derivative identically zero ⟹ chord slope zero ⟹ no change" — and that is the key to everything in handout 08.

---

## 6.2 Rolle's Theorem: the Level Case ⭐

We first handle the special case where the two endpoints are at the same height.

### ⭐ Theorem 6.1 (Rolle's Theorem)

> Let $f$ be **continuous** on $[a,b]$, **differentiable** on $(a,b)$, and satisfy $f(a) = f(b)$. Then there exists $c \in (a,b)$ with $f'(c) = 0$.

> **Proof strategy — EVT and Fermat working together:**
> On a closed interval, EVT guarantees maximum and minimum values exist.
> - If an extremum occurs at an *interior* point, Fermat's Theorem gives $f' = 0$ there.
> - If both maximum and minimum occur at the *endpoints* — that is the only other option — then $f(a) = f(b)$ means the maximum equals the minimum, so $f$ is constant, and $f' \equiv 0$ everywhere.
>
> The condition $f(a) = f(b)$ is precisely what prevents the "awkward" situation of a non-trivial extremum sitting at one endpoint but not the other. EVT, Fermat, and the equal-endpoints condition fit together without gaps.

**Proof.** By **EVT**, $f$ attains its maximum $M$ and minimum $m$ on $[a,b]$.

- **Case 1: $M = m$.** Then $f$ is constant, so $f' \equiv 0$ on $(a,b)$; any $c \in (a,b)$ works.

- **Case 2: $M > m$.** Since $f(a) = f(b)$, the two endpoints share the same value. They cannot simultaneously equal the maximum *and* the minimum (that would force $M = m$), so at least one of $M$ or $m$ is attained at some interior point $c \in (a,b)$. At this interior point $c$, the function is differentiable (by hypothesis) and achieves a local extremum; by **Fermat's Theorem**, $f'(c) = 0$. $\blacksquare$

> **Each condition has its job:**
> - *Continuous on $[a,b]$* — needed for EVT (to guarantee the extremum exists).
> - *Differentiable on $(a,b)$* — needed for Fermat (to guarantee the derivative at the interior extremum is zero).
> - *$f(a) = f(b)$* — needed to prevent an extremum from hiding at an endpoint trivially.
>
> Remove any one of these and the conclusion fails; you can construct a counterexample for each missing hypothesis.

---

## 6.3 The Mean Value Theorem: the General Case ⭐

Rolle's Theorem requires equal endpoint heights. In general, the two endpoints differ. The fix is elegant.

### ⭐ Theorem 6.2 (Lagrange's Mean Value Theorem)

> Let $f$ be continuous on $[a,b]$ and differentiable on $(a,b)$. Then there exists $c \in (a,b)$ with
> $$f'(c) = \frac{f(b) - f(a)}{b - a}.$$
> That is: *the tangent slope at some interior point equals the chord slope between the endpoints.*

> **Proof strategy — "tilting flat":**
> Rolle only works when the chord is horizontal (zero slope). When the chord is tilted, we *subtract it out*: define an auxiliary function $g = f - \ell$, where $\ell$ is the linear function whose graph is the chord. Then $g$ has the same endpoints height ($g(a) = g(b) = 0$), so Rolle applies to $g$. Translating $g'(c) = 0$ back to $f$ gives the MVT.
>
> **The core tactic:** reduce a new, more general problem to one already solved by constructing an auxiliary function. This reduction technique is one of the most frequently used moves in mathematics.

**Proof.** The chord from $(a, f(a))$ to $(b, f(b))$ has equation

$$\ell(x) = f(a) + \frac{f(b) - f(a)}{b - a}(x - a).$$

Define $g(x) = f(x) - \ell(x)$. Then $g$ is continuous on $[a,b]$ and differentiable on $(a,b)$, and

$$g(a) = f(a) - f(a) = 0, \qquad g(b) = f(b) - f(b) = 0.$$

By **Rolle's Theorem**, there exists $c \in (a,b)$ with $g'(c) = 0$. Since

$$g'(x) = f'(x) - \frac{f(b) - f(a)}{b - a},$$

setting $x = c$ and $g'(c) = 0$ gives $f'(c) = \dfrac{f(b) - f(a)}{b - a}$. $\blacksquare$

> **Savour the "tilting flat" trick.** We did not re-invent the wheel — we transformed the new problem into one already solved. The auxiliary function $g = f - \ell$ removes the tilt; the equal endpoints in $g$ unlock Rolle. Whenever you see a "general case" proved by reduction to a "special case", look for this kind of auxiliary function. (The Cauchy Mean Value Theorem, which we do not cover here, is yet another instance of the same move.)

---

## 6.4 The Bridge Corollary ⭐

Now we harvest the crucial consequence of MVT — the theorem that will unlock the Fundamental Theorem of Calculus.

### ⭐ Corollary 6.3

> If $f$ is differentiable on an interval $I$ and $f'(x) = 0$ for all $x \in I$, then $f$ is constant on $I$.

> **Motivation:** This is the rigorous proof that "zero derivative ⟹ no motion." It sounds obvious — but recall the lesson of handout 00: "obvious" is where the dangers lurk. How do we know that a zero derivative at every point prevents the function from making some sudden jump somewhere in the interior? This leap from "zero slope at every point" to "function does not move across the whole interval" is *not* self-evident. The only way to make it rigorous is via the MVT.

**Proof.** Take any two points $x_1 < x_2$ in $I$. The hypotheses of the MVT are satisfied on $[x_1, x_2]$, so there exists $c \in (x_1, x_2)$ with

$$f(x_2) - f(x_1) = f'(c)(x_2 - x_1) = 0 \cdot (x_2 - x_1) = 0.$$

Hence $f(x_1) = f(x_2)$. Since $x_1, x_2$ were arbitrary, $f$ is constant. $\blacksquare$

### 📎 Equivalent Form (the version we actually use in handout 08)

> If $f'(x) = g'(x)$ for all $x$ in an interval, then $f(x) = g(x) + C$ for some constant $C$.

*Proof:* Apply Corollary 6.3 to $h = f - g$, noting $h' \equiv 0$. $\blacksquare$

> **Why emphasise this form?** Because in the proof of FTC2 (handout 08), the key step is: "the variable upper limit integral $\Phi$ and the given antiderivative $F$ both satisfy $\Phi' = f = F'$, hence $\Phi = F + C$." That single application of this corollary is what converts FTC1 into the Newton–Leibniz formula. **This corollary is the passport that lets the differentiation world hand information to the integration world.**

---

## 6.5 Summary of the Logical Flow

```
   EVT (handout 04) ──┐
                      ├──► Rolle's Theorem ──(tilt correction)──► MVT
   Fermat (handout 05)┘                                           │
                                                                  ▼
                                               Corollary: f' ≡ 0 ⟹ constant
                                               (equiv: f' = g' ⟹ f = g + C)
                                                                  │
                                                                  ▼
                                                        Handout 08: FTC2 key
```

One sentence capturing the flow of ideas:
**"Extrema exist" (EVT) + "interior extrema have zero derivative" (Fermat) ⟹ "equal endpoints ⟹ horizontal tangent" (Rolle) ⟹ (tilt correction) "chord slope is hit by some tangent" (MVT) ⟹ "zero derivative ⟹ constant" (bridge corollary).**

---

## 6.6 Summary

- ⭐ **Rolle's Theorem**: EVT + Fermat, applied to the equal-endpoint case. Continuous on $[a,b]$, differentiable on $(a,b)$, $f(a) = f(b)$ ⟹ some interior $c$ with $f'(c) = 0$.
- ⭐ **MVT (Lagrange)**: "tilting flat" via the auxiliary function $g = f - \ell$ reduces the general case to Rolle.
- ⭐ **Bridge Corollary**: $f' \equiv 0 \Rightarrow f$ constant; equivalently $f' = g' \Rightarrow f = g + C$. This is the sole key to FTC2.

The differentiation toolkit is now complete. Next we turn to integration — giving "area" a rigorous definition (the Riemann sum) — before the two sides meet in the Fundamental Theorem.

→ [Handout 07: The Riemann Integral](07-The Riemann Integral.md)

---

### Exercises

1. Use the MVT to prove: if $f'(x) > 0$ for all $x \in (a,b)$, then $f$ is strictly increasing on $[a,b]$. (This is the rigorous justification for "positive derivative ⟹ increasing function".)
2. State a counterexample for each of the three hypotheses of Rolle's Theorem: (a) $f$ not continuous on $[a,b]$; (b) $f$ not differentiable on $(a,b)$; (c) $f(a) \ne f(b)$.
3. Use the MVT to prove the inequality: for $x > 0$, $\dfrac{x}{1+x} < \ln(1+x) < x$. (Hint: apply the MVT to $\ln$ on the interval $[0,x]$.)
4. Reproduce the logical flow diagram in §6.5 from memory, filling in the name of the theorem at each arrow. Check against the diagram in handout 08.
