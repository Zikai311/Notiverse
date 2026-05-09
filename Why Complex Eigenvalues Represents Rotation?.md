
> [!info] Intro
> I always wonder, why when there's complex number inside the eigenvector, then its matrix would naturally involves *rotation*. Once introduced this idea, I tried to visualise the geometrical meaning of this, twisting around with the eigenvectors in a high dimensional space, but all end up failed. Maybe the most beautiful way to think about this is to consider eigenvalues as operators rather than magnifying factors.

Please read [[Complex Numbers are Special Kinds of 2×2 Matrices]] first.

# The Meaning of $i$

Before we dive into the question itself, I would like you to recap what $i$ really means in our context.

Under the correspondence in above link,

$$
i
\leftrightarrow
\begin{pmatrix}
0 & -1\\
1 & 0
\end{pmatrix}.
$$

Call this matrix $J$:

$$
J=
\begin{pmatrix}
0 & -1\\
1 & 0
\end{pmatrix}.
$$

Acting on a vector $(x,y)^T$,

$$
J
\begin{pmatrix}
x\\
y
\end{pmatrix}
=
\begin{pmatrix}
-y\\
x
\end{pmatrix}.
$$

Geometrically, this rotates vectors by $90^\circ$ counterclockwise.

Applying $J$ twice,

$$
J^2
=
\begin{pmatrix}
0 & -1\\
1 & 0
\end{pmatrix}^2
=
\begin{pmatrix}
-1 & 0\\
0 & -1
\end{pmatrix}
=
-I.
$$

Thus the mysterious identity

$$
i^2=-1
$$

acquires simple geometric meaning:

> Two consecutive $90^\circ$ rotations produce a $180^\circ$ reversal.

The imaginary unit is therefore not fundamentally a strange number. It is a rotation operator.

Plus, In my opinion, any imaginary-ish stuffs like $e^{i\theta}$ is just the abuse of notation without the interpretation of a rotation or evolutional operator.

---
# Rotation Matrices

$R(\theta)$ is a rotation matrix counter-clockwise by $\theta^\circ$.

$$
	R = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}
$$

Consider the eigenvalue equation

$$
Rv=\lambda v.
$$

To determine the eigenvalues, solve

$$
\det(R-\lambda I)=0.
$$

Compute:

$$
\det
\begin{pmatrix}
\cos\theta-\lambda & -\sin\theta\\
\sin\theta & \cos\theta-\lambda
\end{pmatrix}
=0.
$$

Expanding,

$$
(\cos\theta-\lambda)^2+\sin^2\theta=0.
$$

Using

$$
\sin^2\theta+\cos^2\theta=1,
$$

we obtain

$$
\lambda^2-2\cos\theta\,\lambda+1=0.
$$

Thus,

$$
\lambda
=
\cos\theta\pm i\sin\theta
=
e^{\pm i\theta}.
$$
A rotation matrix therefore has complex eigenvalues lying on the unit circle.

Note that the eigenvectors are 
$$
\begin{pmatrix}
1 \\
i
\end{pmatrix}\quad \text{and} \quad \begin{pmatrix}
1 \\
-i
\end{pmatrix}
$$

The important fact:

> Real scaling transformations have real eigenvalues.
>
> Pure rotations require complex eigenvalues.

In the real plane, no nonzero vector remains fixed under a genuine rotation. The invariant directions only appear after extending the space to complex numbers, which I think, is unnecessary to be visually interpreted, since we have a more powerful way to think about it bellow.

---
# The Operator Interpretation of Eigenvalues

Read [[Polar Form and Euler's Formula]] and [[The Matrix Operator Version of Euler’s Identity]] first.

Consider the eigenvalue equation:
$$Rv = \lambda v$$

Where the rotation matrix $R$ is defined as:
$$R = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$$

We already know that the eigenvalue is:
$$\lambda = e^{i\theta}$$

Now, let's stop treating $i$ as a mysterious number and instead view it as the operator $J$ that performs a $90^\circ$ rotation:
$$i \leftrightarrow J = \begin{pmatrix} 0 & -1 \\ 1 & 0 \end{pmatrix}$$

Consequently:
$$\lambda = e^{i\theta}$$

Should actually be understood as:
$$\lambda = e^{\theta J}$$

From the second resource above, we got the identity, without reference to complex numbers
$$
	R(\theta)=e^{\theta J}.
$$
The eigenvalue equation。
$$Rv = \lambda v$$
Transforms into:
$$R(\theta)v = e^{\theta J}v$$

But because $R(\theta) = e^{\theta J}$, we arrive at:
$$e^{\theta J}v = e^{\theta J}v$$

On the surface, this looks like a tautology. However, something profoundly deep has occurred: 

The **eigenvalue** is no longer a simple scalar; it has become a **rotation operator** acting directly on the vector. The **eigenvalue** means exactly the same as the **rotation matrix** itself. No mysterious twists on eigenvector in some high-dimensional space ever occur. 


> [!tip] Why complex eigenvalue represents rotation?
> Ans: Since complex eigenvalue is a rotation operator itself !!!



# Two Fundamental Kinds of Linear Dynamics

The discussion reveals two fundamentally different geometric behaviours.

A real eigenvalue produces stretching or shrinking:

$$
Av=\lambda v,
\qquad
\lambda\in\mathbb R.
$$

The vector keeps its direction while its magnitude changes.

A purely imaginary generator produces rotation:

$$
e^{i\theta}
\quad\text{or}\quad
e^{\theta J}.
$$

The magnitude remains constant while the direction changes continuously.

These correspond to two fundamentally different kinds of operators:

$$
\text{Scaling}
\qquad\text{vs}\qquad
\text{Rotation}.
$$

One acts radially.

The other acts tangentially.

One changes norm.

The other changes phase.

Together they form the polar anatomy of linear transformations.

Indeed,

$$
re^{i\theta} 
$$

already combines both behaviours into a single operation:

$$
(\text{scale by }r)
+
(\text{rotate by }\theta).
$$
#compex_numbers #why