
> [!info] Intro
> In topology and differential geometry, a manifold aims to describe complicated globally curved structures using locally Euclidean spaces.
> 
Intuitively, a $k$-dimensional manifold is a geometric object which, **locally** (that is, when infinitely zoomed in near a point), looks homeomorphic to the flat space $\mathbb{R}^k$.
>
>- A twisted wire locally looks like a straight line (1-dimensional manifold).
>- The surface of a balloon locally looks like a plane (2-dimensional manifold).

# Define Manifolds via “Graphs”

To define manifolds, Hubbard first defines the notion of a **graph** of a mapping.


Let $U \subset \mathbb{R}^k$ be an open set. The graph of a mapping[^1]

$$
\mathbf{f}: U \to \mathbb{R}^{n-k}
$$

is the subset of $\mathbb{R}^n$, denoted $\Gamma(\mathbf{f})$, defined by

$$
\Gamma(\mathbf{f}) =
\left\{
\begin{pmatrix}
\mathbf{x} \\
\mathbf{f}(\mathbf{x})
\end{pmatrix}
\in \mathbb{R}^n
\;\middle|\;
\mathbf{x} \in U
\right\}
$$

Here we implicitly regard the first $k$ variables as independent variables and the remaining $n-k$ variables as dependent variables.

### Intuitive Interpretation

The essence of a graph is the dimensional concatenation of the domain and codomain.

Suppose you have the function

$$
f(x,y)=x^2+y^2
$$

Its domain is the 2-dimensional $xy$-plane, while its codomain is the 1-dimensional $z$-axis.

Combining them creates a 3-dimensional space $(x,y,z)$. The graph of the function in this 3-dimensional space is a 2-dimensional paraboloid which you could visualise in Desmos.

$$
	\Gamma(\mathbf{f})=\left\{\begin{pmatrix}
	x \\
	y \\
	x^2+y^2
	\end{pmatrix}\in \mathbb{R}^3\;\middle|\;(x,y)\in \mathbb{R}^2\right\}
$$

The graph itself is a direct embedding of a flat $\mathbb{R}^k$ space and $\mathbb{R}^{n-k}$ space into $\mathbb{R}^n$. But for some manifolds (such as closed surfaces), we usually cannot describe the entire object using a single global function . Hence we introduce the idea of **local graphs**.

---

## Define Smooth Manifold in $\mathbb{R}^n$

>Manifold is a shape formed from a set of points lives in some higher dimensional space than the shape.

A subset

$$
M \subset \mathbb{R}^n
$$

is called a smooth $k$-dimensional manifold if for every point

$$
\mathbf{p} \in M
$$

there exists an open neighbourhood $V$, (you may think of $V$ as a small open sphere centred at $p$, but not necessarily in later examples)


$$
p\in V \subset \mathbb{R}^n
$$

such that

$$
M \cap V
$$
(i.e the neighbouring region on that manifold $M$) is the graph of a $C^1$ mapping $\mathbf{f}$ [^2].

More precisely, after possibly reordering coordinates, one may choose $k$ variables (denoted $\mathbf{x}$) as the independent variables, while the remaining $n-k$ variables (denoted $\mathbf{y}$) can be expressed as functions of them:
$$
\mathbf{y} = \mathbf{f}(\mathbf{x})
$$
since $\mathbf{f}$ has only $k$ degrees of freedom, the manifold defined by graph of such is so called a $k$ dimensional manifold.

---

> [!example] Example 1: The Sphere $S^2$
> 
Consider the unit sphere in $\mathbb{R}^3$: $$
M=\{(x,y,z)\in\mathbb{R}^3\mid x^2+y^2+z^2=1\}
$$
 
We now prove it is a 2-dimensional smooth manifold.

- Near the north hemisphere:

$$
V=\{(x,y,z)\mid z>0\}
$$
(what a big neighbourhood, isn't it?)
we may write

$$
z=f_1(x,y)=\sqrt{1-x^2-y^2}
$$
then, the graph is like
$$
	\Gamma(\mathbf{f})=\left\{\begin{pmatrix}
	x \\
	y \\
	\sqrt{1-x^2-y^2}
	\end{pmatrix}\in \mathbb{R}^3\;\middle|\;(x,y)\in \mathbb{R}^2\right\}
$$
Thus $M\cap V$ is the graph of a $C^1$ function.

- Near the point $(1,0,0)$, the tangent plane becomes vertical relative to the $xy$-plane, so we cannot continue using $x,y$ as independent variables.

Instead choose

$$
V=\{(x,y,z)\mid x>0\}
$$

and rewrite the sphere as

$$
x=f_2(y,z)=\sqrt{1-y^2-z^2}
$$
then the graph is like
$$
		\Gamma(\mathbf{f})=\left\{\begin{pmatrix}
	\sqrt{1-y^2-z^2} \\
	y \\
	z
	\end{pmatrix}\in \mathbb{R}^3\;\middle|\;(y,z)\in \mathbb{R}^2\right\}
$$
Now $y,z$ are the independent variables.

Similarly, every point on the sphere admits a valid local coordinate system, so $S^2$ satisfies the Definition.

---

> [!example] Example 2: The Circle $S^1$
> 
Consider$$
M=\{(x,y,z)\in \mathbb{R}^3\;|\;x^2+y^2=1\}
$$

Near

$$
\left(\frac{\sqrt2}{2},\frac{\sqrt2}{2}\right)
$$

we may write

$$
y=\sqrt{1-x^2}
$$

- Near $(1,0)$, the derivative

$$
\frac{dy}{dx}
$$

blows up, so the representation $y=f(x)$ fails.

Instead we switch coordinates:

$$
x=\sqrt{1-y^2}
$$

This illustrates why coordinate reordering is essential in manifold theory.

---

# Define smooth $\mathbb{R}^n$ Manifold in Another Way

The previous definition of manifold is rigorous but impractical for applications. In physics and engineering, systems are usually given by a few constraint equations represented by $\mathbf{F}$:

$$
M=\{\mathbf{x}\in \mathbb{R}^n\;|\;\mathbf{F}(\mathbf{x})=\mathbf{0}\}
$$

It's tedious to verify they are manifolds via finding the graph one by one. We therefore need a theorem allowing us to determine equivalently whether such a set forms a manifold via the constraint equation.

***Regular Level Set Theorem:***

Let

$$
U\subset\mathbb{R}^n
$$

be open, and let

$$
\mathbf{F}:U\to\mathbb{R}^{n-k}
$$

be a $C^1$ map.

Define

$$
M=\{\mathbf{x}\in U\mid \mathbf{F}(\mathbf{x})=\mathbf{0}\}
$$

If for every point $\mathbf{z}\in M$, the Jacobian matrix

$$
[D\mathbf{F}(\mathbf{x})]
$$

is surjective (equivalently, has rank $n-k$), then $M$ is a smooth $k$-dimensional manifold in $\mathbb{R}^n$.

The Regular Level Set Theorem gives a **sufficient** condition for a level set to be a manifold: the defining map must be a submersion at every point of the level set. It is **not necessary**: a level set can be a smooth manifold even if the defining map fails to be a submersion there.

# Full version theorem: (aside)

***Sufficiency*** $\implies$

Let $U \subset \mathbb{R}^n$ be open, and let$$F : U \to \mathbb{R}^{\,n-k}$$be a $C^1$ map. Let $M \subset \mathbb{R}^n$ satisfy$$M \cap U=\{ x \in U \mid F(z)=0 \}.$$If the Jacobian matrix$$[DF(x)]$$is surjective (equivalently, has full row rank) for every$$x \in M \cap U,$$then the local piece $M \cap U$ is a smooth $k$-dimensional manifold in $\mathbb{R}^n$. If every point $x \in M$ lies in some such neighbourhood $U$, then the global set $M$ is a smooth $k$-dimensional manifold.

***Necessity*** $\Longleftarrow$ 

Conversely, if $M$ is a smooth $k$-dimensional manifold in $\mathbb{R}^n$, then for every point$$x \in M,$$there exists a neighbourhood$$U \subset \mathbb{R}^n$$and a $C^1$ map$$F : U \to \mathbb{R}^{\,n-k}$$such that $[DF(z)]$ is surjective and$$M \cap U=\{ x \in U \mid F(x)=0 \}.$$
In essence, a smooth manifold is locally the zero set of a smooth map whose derivative has maximal rank. A manifold is therefore a geometric object carved out smoothly by equations, without singularities, creases, or self-pinching behaviour nearby.



---

TODO: 
# Proof Using the Implicit Function Theorem

We want to prove:

If the Jacobian has full rank, then locally the set can be written as

$$
\mathbf{y}=\mathbf{f}(\mathbf{x})
$$

which is exactly the graph condition in the original Definition

## Proof

1. Choose any point

$$
\mathbf{z}_0\in M
$$

2. The Jacobian

$$
[D\mathbf{F}(\mathbf{z}_0)]
$$

has size

$$
(n-k)\times n
$$

and rank $n-k$.

3. By linear algebra, some

$$
(n-k)\times(n-k)
$$

submatrix must be invertible.

4. After reordering coordinates, split variables into:

$$
\mathbf{x}\in\mathbb{R}^k,
\qquad
\mathbf{y}\in\mathbb{R}^{n-k}
$$

5. The equation becomes

$$
\mathbf{F}(\mathbf{x},\mathbf{y})=\mathbf{0}
$$

with

$$
[D_{\mathbf y}\mathbf F]
$$

invertible at $(\mathbf{x}_0,\mathbf{y}_0)$.

6. By the Implicit Function Theorem, there exists a $C^1$ function

$$
\mathbf{f}
$$

such that locally:

$$
\mathbf{F}(\mathbf{x},\mathbf{y})=0
\iff
\mathbf{y}=\mathbf{f}(\mathbf{x})
$$

7. Hence locally $M$ is the graph of $\mathbf f$, satisfying Definition 3.1.2.

---

## Example 3: The Sphere via Theorem 3.1.10

Define

$$
F(x,y,z)=x^2+y^2+z^2-1
$$

Its Jacobian is:

$$
[DF]=
\begin{bmatrix}
2x & 2y & 2z
\end{bmatrix}
$$

Since $(x,y,z)\neq(0,0,0)$ on the sphere, the rank is always 1.

Therefore $S^2$ is a smooth manifold of dimension

$$
3-1=2
$$

---

## Example 4: Singularities Destroy Manifolds — The Cone

Consider

$$
F(x,y,z)=x^2+y^2-z^2
$$

Then

$$
[DF]=
\begin{bmatrix}
2x & 2y & -2z
\end{bmatrix}
$$

At the origin:

$$
[DF(0,0,0)]
=
\begin{bmatrix}
0 & 0 & 0
\end{bmatrix}
$$

The rank collapses to 0.

Thus the Implicit Function Theorem fails completely.

Geometrically, the cone tip has no well-defined tangent plane.

Therefore the cone including its apex is **not** a smooth manifold.

---

# 4. Rigorous Definition: Manifolds via Parameterization

Previous definitions emphasize implicit constraints:

$$
\mathbf F(\mathbf z)=0
$$

But in geometry, graphics, and multivariable calculus, we often prefer a constructive viewpoint.

This leads to the notion of **parameterization**.

This is still part of **extrinsic geometry**, because the manifold remains embedded inside a higher-dimensional Euclidean space.

---

## Definition 3.1.18 (Parameterization)

A parameterization of a $k$-dimensional manifold

$$
M\subset\mathbb R^n
$$

is a map

$$
\gamma:U\subset\mathbb R^k\to M
$$

satisfying:

1. $U$ is open.

2. $\gamma$ is $C^1$, injective, and surjective onto $M$ (or a local open subset).

3. The Jacobian matrix

$$
[D\gamma(\mathbf u)]
$$

is injective for every point $\mathbf u\in U$, equivalently:

$$
\operatorname{rank}(D\gamma)=k
$$

---

# Geometric Interpretation

Constraint equations describe how higher-dimensional space restricts motion.

Parameterizations instead actively generate manifolds from lower-dimensional flat spaces.

- The parameter domain $U$ is a flat $k$-dimensional space.
- The map $\gamma$ bends and embeds this flat space into $\mathbb R^n$.

The Jacobian rank condition is crucial.

Each column of

$$
[D\gamma]
$$

represents how movement in one parameter direction produces a tangent vector in ambient space.

Full column rank means these tangent vectors are linearly independent and span a proper $k$-dimensional tangent space.

If rank drops, the manifold degenerates into a singularity.

---

# AI Analogy: Generative Models as Parameterized Manifolds

For researchers in AI and representation learning:

GANs and VAEs fundamentally construct high-dimensional manifolds through parameterization.

A low-dimensional latent vector

$$
\mathbf z\in\mathbb R^k
$$

is sampled from latent space and mapped through a nonlinear neural network

$$
\gamma
$$

into high-dimensional observation space

$$
\mathbb R^n
$$

thus generating a data manifold.

---

## Example 5: Parameterization of the Torus

Define:

$$
U=\{(u,v)\mid 0<u<2\pi,\;0<v<2\pi\}
$$

The torus parameterization:

$$
\begin{cases}
x=(R+r\cos v)\cos u \\
y=(R+r\cos v)\sin u \\
z=r\sin v
\end{cases}
$$

- $u$: rotation around the large circle.
- $v$: rotation around the tube cross-section.

The Jacobian has two orthogonal column vectors everywhere, so rank is constantly 2.

Hence the torus is a smooth 2-dimensional manifold.

---

## Example 6: Degeneration of Spherical Coordinates at the Poles

Consider the standard sphere parameterization:

$$
\gamma(\theta,\phi)=
\begin{pmatrix}
\sin\phi\cos\theta \\
\sin\phi\sin\theta \\
\cos\phi
\end{pmatrix}
$$

Its Jacobian:

$$
[D\gamma(\theta,\phi)]
=
\begin{bmatrix}
-\sin\phi\sin\theta & \cos\phi\cos\theta \\
\sin\phi\cos\theta & \cos\phi\sin\theta \\
0 & -\sin\phi
\end{bmatrix}
$$

At the north pole $\phi=0$:

$$
[D\gamma]
=
\begin{bmatrix}
0 & \cos\theta \\
0 & \sin\theta \\
0 & 0
\end{bmatrix}
$$

The first column vanishes completely.

The rank drops from 2 to 1.

Geometrically, changing longitude $\theta$ at the pole produces no actual movement in space.

The coordinate grid collapses there.

Hence spherical coordinates fail to provide a valid global chart for the entire sphere.

This rigorously proves that no single flat parameter domain can smoothly cover all of $S^2$.

Complex manifolds require multiple local coordinate charts patched together.


#manifold #differential_geometry #what

[^1]: The mapping is from $\mathbb{R}^k$ to $\mathbb{R}^{n-k}$ is because we will focus on the concatenated $n$ dimensional space out of the domain and co-domain where the real manifold lives later. Don't worry if you feel confused here, threat $n-k$ as the dimension of the co-domain of the mapping normally is fine.

[^2]: A $C^1$ mapping is a function whose first partial derivatives exist and are continuous (i.e., it is continuously differentiable).
