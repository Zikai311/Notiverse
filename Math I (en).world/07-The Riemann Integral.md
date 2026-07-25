# Handout 07 · The Riemann Integral

> **Goal of this handout:** Give "the area under a curve" a rigorous definition. We follow the principle **partition · approximate · sum · take limits**, trapping the area between upper and lower sums until they converge to the same number. The main theorem is that **every continuous function on a closed interval is Riemann integrable** — and the proof brings compactness back into the picture one more time.

**Main theorems:** ⭐ **Definition of Riemann integrability (upper and lower sums)**; ⭐ **Continuous functions on $[a,b]$ are integrable**.

---

## 7.1 Motivation: "Area" Has Not Yet Been Defined

We have been computing areas since school — rectangles, triangles, circles. But the area of an irregular region bounded by the graph of $y = f(x)$ over $[a,b]$ has never been defined rigorously. We have used the word without giving it meaning.

Archimedes had the right idea two thousand years ago (**method of exhaustion**): approximate the curved region with rectangles, make the rectangles thinner and thinner, and see whether the total area converges. Riemann's contribution was to turn this ancient intuition into a precise definition.

The four steps:

1. **Partition:** cut $[a,b]$ into small subintervals;
2. **Approximate:** on each subinterval, choose a rectangle (height = some value of $f$ on that subinterval) to approximate that thin strip of area;
3. **Sum:** add up all the rectangle areas — this is a **Riemann sum**, an approximation to the total area;
4. **Take limits:** let the partition become finer and finer. If the approximations converge to a unique number regardless of how we choose the rectangle heights, that number *is* the integral.

The difficulty is in step 4: why should the approximations converge? And why should different choices of rectangle heights give the same limit? Riemann's answer: use **upper sums** and **lower sums** to trap the area from above and below simultaneously, then force them to meet.

---

## 7.2 Partitions, Upper Sums, and Lower Sums

### Definition 7.1 (Partition)

A **partition** $P$ of $[a,b]$ is a finite collection of points

$$a = x_0 < x_1 < x_2 < \cdots < x_n = b,$$

dividing $[a,b]$ into $n$ subintervals $[x_{i-1}, x_i]$ of length $\Delta x_i = x_i - x_{i-1}$.

### ⭐ Definition 7.2 (Upper and Lower Sums)

Let $f$ be **bounded** on $[a,b]$. On the $i$-th subinterval, let

$$M_i = \sup_{[x_{i-1},x_i]} f, \qquad m_i = \inf_{[x_{i-1},x_i]} f.$$

(Boundedness of $f$ guarantees these sup and inf exist — by the LUB axiom, as always.) Define

$$U(f,P) = \sum_{i=1}^n M_i\, \Delta x_i \quad \text{(upper sum)}, \qquad L(f,P) = \sum_{i=1}^n m_i\, \Delta x_i \quad \text{(lower sum)}.$$

**Geometric meaning.** The upper sum uses the tallest rectangle on each subinterval — an overestimate of the area. The lower sum uses the shortest — an underestimate. The true area (if it exists) is sandwiched between them:

$$L(f,P) \le \text{``true area''} \le U(f,P).$$

> **Why sup and inf, rather than an arbitrary sample point?** Because the upper and lower sums give the *worst-case* upper and lower bounds. No matter how the rectangle height is chosen, the resulting Riemann sum lies between $L$ and $U$. If we can force $U$ and $L$ to coincide, then the limit is uniquely determined — the concern about different choices giving different limits is resolved. This is the whole point of the upper/lower sum approach.

### 📎 Key Monotonicity (refining a partition can only tighten the bounds)

If $P'$ is obtained from $P$ by adding more partition points (a **refinement** of $P$), then

$$L(f,P) \le L(f,P') \le U(f,P') \le U(f,P).$$

Intuitively: a finer partition can only lower the upper sum (the tallest rectangle on each subinterval can only decrease or stay the same when the subinterval is split) and raise the lower sum. The bounds get tighter.

A stronger consequence: **any lower sum is $\le$ any upper sum**, even from different partitions. Hence all lower sums have an upper bound, and all upper sums have a lower bound.

---

## 7.3 The Definition of Riemann Integrability ⭐

Since lower sums are bounded above and upper sums are bounded below, we can take their supremum and infimum respectively.

### ⭐ Definition 7.3 (Upper Integral, Lower Integral, and Integrability)

$$\underline{\int_a^b} f = \sup_P\, L(f,P) \quad \text{(lower integral)}, \qquad \overline{\int_a^b} f = \inf_P\, U(f,P) \quad \text{(upper integral)}.$$

(Both exist by the LUB axiom.) The monotonicity from §7.2 guarantees $\underline{\int} \le \overline{\int}$.

> We say $f$ is **Riemann integrable** on $[a,b]$ if the upper and lower integrals agree. Their common value is the **definite integral**:
> $$\int_a^b f(x)\, dx := \underline{\int_a^b} f = \overline{\int_a^b} f.$$

**Interpretation.** Integrability means: approximating from below and approximating from above both produce the same number — the area is uniquely determined. If there remains a persistent gap ($\underline{\int} < \overline{\int}$), the upper and lower approximations can never agree, and the area is undefined.

### 📎 Integrability Criterion (more practical equivalent)

> $f$ is integrable $\iff$ for every $\varepsilon > 0$, there exists a partition $P$ with $U(f,P) - L(f,P) < \varepsilon$.

In other words: **we can squeeze the gap between upper and lower sums to any desired tolerance.** This is the form we use in the next proof.

> **Why is this equivalent?** If $U - L$ can be made as small as we like, then since $\underline\int$ and $\overline\int$ are sandwiched between $L$ and $U$, the gap $\overline\int - \underline\int \le U - L$ can also be made as small as we like, hence must be zero. The argument runs $\varepsilon$-style in both directions — a familiar pattern from handout 02.

### A non-integrable function

The **Dirichlet function** $D(x) = \begin{cases}1 & x \in \mathbb{Q} \\ 0 & x \notin \mathbb{Q}\end{cases}$ on $[0,1]$ is not integrable: on any subinterval, there are both rationals and irrationals, so $M_i = 1$ and $m_i = 0$ for every partition, giving $U = 1$ and $L = 0$ always. The gap never closes.

This shows that integrability is a genuine condition — not every bounded function is integrable.

---

## 7.4 Continuous Functions are Integrable ⭐

The theorem we need for FTC (handout 08) is that the functions we care about — continuous ones — are always integrable.

### ⭐ Theorem 7.4 (Continuous $\Rightarrow$ Integrable)

> If $f$ is continuous on $[a,b]$, then $f$ is Riemann integrable on $[a,b]$.

> **Proof strategy.** We use the criterion: show $U(f,P) - L(f,P)$ can be made smaller than any $\varepsilon$. Note:
> $$U - L = \sum_i (M_i - m_i)\,\Delta x_i.$$
> If the **oscillation** $M_i - m_i$ (max minus min on each subinterval) is small on every subinterval, say $< \eta$, then $U - L < \eta\sum \Delta x_i = \eta(b-a)$. Choosing $\eta$ small enough handles everything.
>
> The question is: can we guarantee small oscillation on every subinterval by making the partition fine enough? This requires not just pointwise continuity but **uniform continuity** — and the theorem "continuous on a closed bounded interval ⟹ uniformly continuous" (**Heine–Cantor**) delivers exactly this, via compactness.

### 📎 Lemma 7.5 (Heine–Cantor: Uniform Continuity on $[a,b]$)

**Uniform continuity** means: $\forall\, \varepsilon > 0,\ \exists\, \delta > 0$ such that for *all* pairs of points with $|x - x'| < \delta$, we have $|f(x) - f(x')| < \varepsilon$. The key is that $\delta$ works **uniformly across the whole interval** — it does not depend on where $x$ is.

> **Why does a closed interval force uniformity?** Intuitively: if continuity could not be made uniform, there would exist two sequences of points $x_n, x_n'$ getting arbitrarily close to each other but with $|f(x_n) - f(x_n')|$ bounded away from zero. By **BW**, extract a convergent subsequence of $(x_n)$; since $[a,b]$ is closed, the limit $\xi \in [a,b]$. Both sequences converge to $\xi$, and continuity forces $f(x_n), f(x_n') \to f(\xi)$ — contradicting the assumption that their difference stays large.
>
> **Again: compactness ← BW ← completeness.** The same chain, one more time.

**Proof of Theorem 7.4.** Given $\varepsilon > 0$, let $\eta = \frac{\varepsilon}{b-a}$.

By Heine–Cantor (Lemma 7.5), $f$ is uniformly continuous: there exists $\delta > 0$ such that $|f(x) - f(x')| < \eta$ whenever $|x - x'| < \delta$.

Choose any partition $P$ with all subintervals of length $\Delta x_i < \delta$. On each subinterval, any two points differ by less than $\delta$, so the oscillation satisfies $M_i - m_i \le \eta$. Therefore:

$$U(f,P) - L(f,P) = \sum_i (M_i - m_i)\,\Delta x_i \le \eta \sum_i \Delta x_i = \eta(b-a) = \varepsilon.$$

By the integrability criterion, $f$ is integrable. $\blacksquare$

> **The proof's backbone:** "oscillation is controllable" $\leftarrow$ uniform continuity $\leftarrow$ compactness $\leftarrow$ completeness. The Riemann integral's existence is ultimately guaranteed by the same ground-floor property as every other existence result in this series.

---

## 7.5 Two Properties for the Next Handout

Two properties of the definite integral are needed in the proof of FTC. Their proofs follow directly from the definition; we state them without proof.

- **📎 Additivity over intervals:** For $a < c < b$,
  $$\int_a^b f = \int_a^c f + \int_c^b f.$$

- **📎 Integral bounds (monotonicity):** If $m \le f(x) \le M$ for all $x \in [a,b]$, then
  $$m(b-a) \le \int_a^b f \le M(b-a).$$
  (The integral of a function bounded between two horizontal lines is bounded between two rectangles.)

The integral bounds property is the star of FTC1.

---

## 7.6 Summary

- **Area** had never been rigorously defined. Riemann's "partition · approximate · sum · limit" strategy makes Archimedes' method of exhaustion rigorous.
- ⭐ **Upper and lower sums** trap the area from above and below; using sup/inf of function values on each subinterval eliminates the freedom in choosing rectangle heights.
- ⭐ **Integrability** $\iff$ upper integral = lower integral $\iff$ $U - L$ can be made arbitrarily small (integrability criterion). The Dirichlet function is a non-integrable counterexample.
- ⭐ **Continuous $\Rightarrow$ integrable**: oscillation on each subinterval can be controlled uniformly by making the partition fine enough, thanks to **uniform continuity** (Heine–Cantor). Uniform continuity follows from compactness, which follows from completeness.
- Tools for the next handout: **additivity** and **integral bounds**.

The integration side is ready. The next handout is the climax of the series — proving that differentiation and integration are inverse operations.

→ [Handout 08: The Fundamental Theorem of Calculus](08-The Fundamental Theorem of Calculus.md)

---

### Exercises

1. Calculate $\int_0^1 x\, dx$ directly from the definition: take the equal partition $P_n$ into $n$ equal subintervals, compute $U(f, P_n)$ and $L(f, P_n)$, show both tend to $\frac{1}{2}$ as $n \to \infty$, and conclude the integral equals $\frac{1}{2}$.
2. In the proof of Theorem 7.4, identify precisely where uniform continuity (rather than pointwise continuity) is used. Show by example that the proof would break if $\delta$ depended on $x$.
3. Explain in your own words why the Dirichlet function is not integrable, even though it equals $0$ "almost everywhere". (This motivates the Lebesgue integral — a strictly more powerful integration theory — as further reading.)
4. Use the integral bounds property to prove: if $f$ is continuous and $f \ge 0$ on $[a,b]$ with $f$ not identically zero, then $\int_a^b f > 0$.
