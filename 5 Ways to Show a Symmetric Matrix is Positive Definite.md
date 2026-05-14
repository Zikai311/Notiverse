
> [!info] Intro
> A symmetric matrix $M$ is **positive definite** if
> $$
>	\mathbf{x}^\text{T}M\mathbf{x}>0
> $$
> for every nonzero vector $\mathbf{x}\neq \mathbf{0}$.
>
> For a symmetric matrix, this is equivalent to saying that all eigenvalues are positive real numbers. In this note, we start with the $2\times 2$ case
> $$
>	M=\begin{pmatrix}
>	a & b \\
>	b & c
>	\end{pmatrix}
> $$
> and then move to the general $n\times n$ versions.


# Method 1. Find the Determinant


> [!quote] Theorem 1
> 
> $$
> M=
>	\begin{pmatrix}
>	a & b \\
>	b & c
>	\end{pmatrix}
> $$
> *$M$ is positive definite if and only if $a>0$ and $ac-b^2>0$.*
>
> Equivalently, $ac-b^2>0$ and at least one of $a$ or $c$ is positive. In that case, both $a$ and $c$ are positive.

$\implies$
$$
	M\mathbf{v}=\lambda \mathbf{v} \quad\text{for} \;\mathbf{v}\neq \mathbf{0}
$$
If $M$ is positive definite, then all eigenvalues are positive, so $\lambda_{1}>0$ and $\lambda_{2}>0$.

Hence,
$$
	\det(M)=\lambda_{1}\lambda_{2}=ac-b^2>0
$$
Also, using the quadratic form with $\mathbf{e}_{1}=(1,0)^\text{T}$,
$$
	\mathbf{e}_{1}^\text{T}M\mathbf{e}_{1}=a>0
$$
Therefore $a>0$ and $ac-b^2>0$.

$\Longleftarrow$

Assume
$$
	a>0
$$
and
$$
	\det(M)=ac-b^2>0
$$
Since $ac-b^2>0$, we have $ac>b^2\geq 0$, so $ac>0$.

Because $a>0$, this implies $c>0$.
$$
	\mathrm{tr}(M)=a+c>0
$$
Also,
$$
	\det(M)=\lambda_{1}\lambda_{2}>0
$$
$$
	\mathrm{tr}(M)=\lambda_{1}+\lambda_{2}>0
$$
Since $M$ is symmetric, $\lambda_{1}$ and $\lambda_{2}$ are real. Their product is positive, so they have the same sign. Their sum is positive, so they must both be positive.

Thus $\lambda_{1}>0$ and $\lambda_{2}>0$, so $M$ is positive definite.

> [!quote] Theorem 2
>
 >
> *A symmetric matrix $M$ is positive definite if and only if the upper triangular matrix has all $\text{pivots}>0$ after Gaussian elimination.*

$\implies$
Using **Theorem 1**, we get $a>0$ and $ac-b^2>0$.

Hence in the upper triangular matrix after Gaussian elimination
$$
	U=\begin{pmatrix}
	a & b \\
	0 & c-\frac{b^2}{a}
	\end{pmatrix}=\begin{pmatrix}
	a & b \\
	0 & \frac{ac-b^2}{a}
	\end{pmatrix}
$$
$$
	a>0
$$

$$
	\frac{ac-b^2}{a}>0
$$
All pivots are positive.

$\Longleftarrow$
the upper triangular matrix after Gaussian elimination is 
$$
	U=\begin{pmatrix}
	a & b \\
	0 & c-\frac{b^2}{a}
	\end{pmatrix}
$$
where
$$
	a>0
$$
and
$$
	c-\frac{b^2}{a}>0
$$

Since $a>0$, multiplying the second pivot by $a$ gives
$$
	ac-b^2>0
$$

Using **Theorem 1** $\implies$ M is positive definite.



> [!quote] Theorem 3
> *A symmetric matrix $M$ is positive definite if and only if all its leading principal minors (upper-left sub-determinants) are strictly positive. For an $n \times n$ matrix, this requires:*
> $$\det_1 > 0, \det_2 > 0, \dots, \det_n > 0$$

$\iff$ **Theorem 1** in the $2\times 2$ case.
where 
$$
	\det_{1}=a>0
$$
$$
	\det_{2}=ac-b^2>0
$$

> [!example] Example
> 
> $$
>	M=\begin{pmatrix}
>	2 & 1 & 1 \\
>	1 & 2 & 1 \\
>	 1 & 1 & 2
>	\end{pmatrix}
> $$

$$
	\det_{1}=|2|=2>0
$$
$$
	\det_{2}=\begin{vmatrix}
	2 & 1 \\
    1 & 2
	\end{vmatrix}=3>0
$$
$$
	\det_{3}=\begin{vmatrix}
	2 & 1 & 1 \\
	1 & 2 & 1 \\
	1 & 1 & 2
	\end{vmatrix}=4>0
$$
Apply **Theorem 3**, $M$ is positive definite.


> [!quote] Theorem 4
> *For a symmetric matrix $M$, all eigenvalues are positive if and only if for every $\mathbf{x}\neq \mathbf{0}$,*
> $$
>	\mathbf{x}^\text{T}M\mathbf{x}>0
> $$


$\implies$
Assume that all eigenvalues of $M$ are positive. Since $M$ is symmetric, by the **Spectral Theorem**, there is an orthonormal eigenbasis
$$
	\mathbf{q}_{1},\mathbf{q}_{2},\dots,\mathbf{q}_{n}
$$
with
$$
	M \mathbf{q}_{i}=\lambda_i \mathbf{q}_{i}
$$
For any nonzero vector $\mathbf{x}$, write
$$
	\mathbf{x}=c_{1}\mathbf{q}_{1}+c_{2}\mathbf{q}_{2}+\dots+c_{n}\mathbf{q}_{n}
$$
Then
$$
	M\mathbf{x}=c_{1}\lambda_{1}\mathbf{q}_{1}+c_{2}\lambda_{2}\mathbf{q}_{2}+\dots+c_{n}\lambda_{n}\mathbf{q}_{n}
$$
Using orthonormality, $\mathbf{q}_{i}^\text{T}\mathbf{q}_{j}=0$ if $i\neq j$ and $\mathbf{q}_{i}^\text{T}\mathbf{q}_{i}=1$, so
$$
	\mathbf{x}^\text{T}M\mathbf{x}=c_{1}^2\lambda_{1}+c_{2}^2\lambda_{2}+\dots+c_{n}^2\lambda_{n}
$$
Since $\mathbf{x}\neq \mathbf{0}$, at least one coefficient $c_i$ is nonzero. Since every $\lambda_i>0$,
$$
	\mathbf{x}^\text{T}M\mathbf{x}>0
$$

$\Longleftarrow$
assume that for every $\mathbf{x}\neq \mathbf{0}$,
$$
	\mathbf{x}^\text{T}M\mathbf{x}>0
$$
Let $\mathbf{q}$ be an eigenvector of $M$ with eigenvalue $\lambda$, so
$$
	M\mathbf{q}=\lambda \mathbf{q}
$$
Since $\mathbf{q}\neq \mathbf{0}$, we can plug $\mathbf{q}$ into the quadratic form:
$$
	\mathbf{q}^\text{T}M\mathbf{q}>0
$$
but
$$
	\mathbf{q}^\text{T}M\mathbf{q}
	=\mathbf{q}^\text{T}\lambda\mathbf{q}
	=\lambda\,\mathbf{q}^\text{T}\mathbf{q}
	=\lambda\|\mathbf{q}\|^2
$$
Since $\|\mathbf{q}\|^2>0$, we must have
$$
	\lambda>0
$$
This is true for every eigenvalue of $M$, so all eigenvalues are positive. Therefore $M$ is positive definite.


> [!quote] Theorem 5
> *A symmetric matrix $M$ is positive definite if and only if $M$ can be written as*
> 
> $$
>	M=A^TA
> $$
> *where $A$ is of full column rank.*

$\implies$
Since $M$ is symmetric and positive definite, by the **Spectral Theorem**,
$$
	M=Q\Lambda Q^\text{T}
$$
where $Q$ is an orthogonal matrix and
$$
	\Lambda=\begin{pmatrix}
	\lambda_{1} & 0 & \cdots & 0 \\
	0 & \lambda_{2} & \cdots & 0 \\
	\vdots & \vdots & \ddots & \vdots \\
	0 & 0 & \cdots & \lambda_{n}
	\end{pmatrix}
$$
Since $M$ is positive definite, all eigenvalues satisfy $\lambda_i>0$.

Define
$$
	\Lambda^{1/2}=\begin{pmatrix}
	\sqrt{\lambda_{1}} & 0 & \cdots & 0 \\
	0 & \sqrt{\lambda_{2}} & \cdots & 0 \\
	\vdots & \vdots & \ddots & \vdots \\
	0 & 0 & \cdots & \sqrt{\lambda_{n}}
	\end{pmatrix}
$$
and let
$$
	A=\Lambda^{1/2}Q^\text{T}
$$
Then
$$
	A^\text{T}A
	=(\Lambda^{1/2}Q^\text{T})^\text{T}(\Lambda^{1/2}Q^\text{T})
$$
$$
	=Q\Lambda^{1/2}\Lambda^{1/2}Q^\text{T}
	=Q\Lambda Q^\text{T}
	=M
$$
Also, $\Lambda^{1/2}$ has no zero diagonal entries and $Q^\text{T}$ is invertible, so $A$ is of full column rank.

$\Longleftarrow$
consider $\mathbf{x}\neq 0$,
$$
		\mathbf{x}^\text{T}M\mathbf{x}=	\mathbf{x}^\text{T}A^TA\mathbf{x}
$$
$$
	=(A\mathbf{x})^T(A\mathbf{x})
$$
$$
	=\|A\mathbf{x}\|^2
$$
since $A$ is of full column rank and $\mathbf{x}\neq 0$, any linear combination other than all zero cannot build up a zero vector.
$$\|A\mathbf{x}\|^2>0$$
so
$$
	\mathbf{x}^\text{T}M\mathbf{x}>0
$$
Using **Theorem 4**, $M$ is positive definite.
