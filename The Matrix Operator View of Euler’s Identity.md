
> [!info] Intro
> Read [[Complex Numbers are Special Kinds of 2×2 Matrices]] first and understand the fact that complex numbers and rotation matrix with scaling are talking about the same thing in different languages, i.e $$a+b\,i\leftrightarrow\begin{pmatrix}a & -b \\  b & a\end{pmatrix}$$This note focus on how to reinvent the Euler's Identity in Matrix's language.

Recall the exponential power series:

$$
e^x
=
\sum_{n=0}^\infty
\frac{x^n}{n!}.
$$

For matrices the same definition applies:

$$
e^A
=
\sum_{n=0}^\infty
\frac{A^n}{n!}.
$$

Now let,

$$
J=
\begin{pmatrix}
0 & -1\\
1 & 0
\end{pmatrix}.
$$

Note that $J$ and $i$ are talking about the same thing
$$
	i \leftrightarrow J
$$
Since $J^2=-I,$

the powers of $J$ cycle: $J^0=I$, $J^1=J$, $J^2=-I$, $J^3=-J$, $J^4=I$, $\dots$ and so on.

Now compute

$$
e^{\theta J}.
$$

Substituting into the series:

$$
e^{\theta J}
=
I+\theta J+\frac{\theta^2J^2}{2!}
+\frac{\theta^3J^3}{3!}
+\cdots.
$$

Separate even and odd powers:

$$
=
\left(
I-\frac{\theta^2}{2!}I+\frac{\theta^4}{4!}I-\cdots
\right)
+
\left(
\theta J-\frac{\theta^3}{3!}J+\frac{\theta^5}{5!}J-\cdots
\right).
$$

Factor out $I$ and $J$:

$$
=
\left(
1-\frac{\theta^2}{2!}+\frac{\theta^4}{4!}-\cdots
\right)I
+
\left(
\theta-\frac{\theta^3}{3!}+\frac{\theta^5}{5!}-\cdots
\right)J.
$$

Recognizing the Taylor series,

$$
\cos\theta
=
1-\frac{\theta^2}{2!}+\frac{\theta^4}{4!}-\cdots,
$$

$$
\sin\theta
=
\theta-\frac{\theta^3}{3!}+\frac{\theta^5}{5!}-\cdots,
$$

we conclude

$$
e^{\theta J}
=
\cos\theta\,I+\sin\theta\,J.
$$

Substituting $I$ and $J$,

$$
e^{\theta J}=
\begin{pmatrix}
\cos\theta & -\sin\theta\\
\sin\theta & \cos\theta
\end{pmatrix}
=
R(\theta).
$$

Thus,

$$
R(\theta)=e^{\theta J}.
$$

This is the operator version of Euler’s identity:

$$
e^{i\theta}
=
\cos\theta+i\sin\theta.
$$

The imaginary unit and the rotation matrix are the same algebraic object in different representations.

#compex_numbers