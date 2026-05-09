
> [!info] Intro
> Complex numbers and matrices share a plenty of similarities, specifically the rotating ones. Actually, they are *isomorphic*. Later, we will inspect them in polar form which shows the common rotating nature.

# 1. Complex Numbers and Matrices
Consider the complex number

$$
z=a+bi
$$

with $a,b\in\mathbb R$.

At first glance, $i$ appears to be an exotic algebraic object satisfying

$$
i^2=-1.
$$

However, the same algebraic structure appears naturally inside real $2\times2$ matrices.

Define the map

$$
\phi(a+bi)=
\begin{pmatrix}
a & -b\\
b & a
\end{pmatrix}.
$$

We now verify that this map preserves both addition and multiplication.

For addition,

$$
\phi((a+bi)+(c+di))
=
\phi((a+c)+(b+d)i)
$$

which equals

$$
\begin{pmatrix}
a+c & -(b+d)\\
b+d & a+c
\end{pmatrix}.
$$

On the other hand,

$$
\phi(a+bi)+\phi(c+di)
=
\begin{pmatrix}
a & -b\\
b & a
\end{pmatrix}
+
\begin{pmatrix}
c & -d\\
d & c
\end{pmatrix}
=
\begin{pmatrix}
a+c & -(b+d)\\
b+d & a+c
\end{pmatrix}.
$$

Thus,

$$
\phi(z_1+z_2)=\phi(z_1)+\phi(z_2).
$$

Now examine multiplication.

Complex multiplication gives

$$
(a+bi)(c+di)
=
(ac-bd)+(ad+bc)i.
$$

Meanwhile,

$$
\phi(a+bi)\phi(c+di)
=
\begin{pmatrix}
a & -b\\
b & a
\end{pmatrix}
\begin{pmatrix}
c & -d\\
d & c
\end{pmatrix}.
$$

Carrying out the matrix multiplication,

$$
=
\begin{pmatrix}
ac-bd & -(ad+bc)\\
ad+bc & ac-bd
\end{pmatrix}
=
\phi((ac-bd)+(ad+bc)i).
$$

Hence,

$$
\phi(z_1z_2)=\phi(z_1)\phi(z_2).
$$

Therefore the complex numbers are algebraically isomorphic to the set of matrices

$$
\left\{
\begin{pmatrix}
a & -b\\
b & a
\end{pmatrix}
:a,b\in\mathbb R
\right\}.
$$

Complex numbers are not merely “numbers”; they are disguised linear operators on the plane.




# 2. Polar Form and the Rotation Matrix
Substituting

$$
a=r\cos\theta,
\qquad
b=r\sin\theta
$$

into the matrix form gives

$$
\begin{pmatrix}
a & -b\\
b & a
\end{pmatrix}
=
r
\begin{pmatrix}
\cos\theta & -\sin\theta\\
\sin\theta & \cos\theta
\end{pmatrix}.
$$

The matrix

$$
R(\theta)=
\begin{pmatrix}
\cos\theta & -\sin\theta\\
\sin\theta & \cos\theta
\end{pmatrix}
$$

is precisely the standard planar rotation matrix.

Also
$$
a+bi
=
r(\cos\theta+i\sin\theta)=re^{i\theta}
$$
Hence

$$
re^{i\theta}
\leftrightarrow
rR(\theta).
$$

Complex numbers and planar rotations are two languages describing the same transformation. Above build the bridge from imaginary world to real linear algebra world. 

#compex_numbers