
> [!info] Intro
> A positive-definite matrix is a symmetric matrix such that all eigenvalues are positive real numbers. In this note, we start from $2\times 2$ matrices with the form 
> $$
>	M=\begin{pmatrix}
>	a & b \\
>	b & c
>	\end{pmatrix}
> $$


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
> *$M$ is positive definite if and only if $ac-b^2>0$ and at least one of $a$ or $c$ is positive.*

$\implies$
$$
	M\mathbf{v}=\lambda \mathbf{v} \quad\text{for} \;\mathbf{v}\neq \mathbf{0}
$$
If $M$ is positive-definite, then for all eigenvalues, $\lambda_{1}>0$ and $\lambda_{2}>0$.

Hence,
$$
	\det(M)=\lambda_{1}\lambda_{2}=ac-b^2>0
$$
$$
	\mathrm{tr}(M)=\lambda_{1}+\lambda_{2}=a+c>0
$$
Since $ac-b^2>0$, $ac>0$

With $a+c>0$, then $a>0$ and $c>0$.

$\Longleftarrow$

$$\det(M)=ac-b^2>0$$
Again, since $ac-b^2>0$, $ac>0$.

With at least one of $a$ or $c$ is positive, then $a>0$ and $c>0$.
$$
	\mathrm{tr}(M)=a+c>0
$$
since
$$
	\det(M)=\lambda_{1}\lambda_{2}>0
$$
$$
	\mathrm{tr}(M)=\lambda_{1}+\lambda_{2}>0
$$
, so $\lambda_{1}>0$ and $\lambda_{2}>0$ $\implies$ M is positive definite.

# Method 2. All Positive pivots

> [!quote] Theorem 2
>
 >
> *A symmetric matrix $M$ is positive definite if and only if the upper triangular matrix has all $\text{pivots}>0$ after Gaussian elimination.*

$\implies$
Using **Theorem 1**, we get $a>0$, $c>0$ and $ac-b^2>0$.
(Both $a$ and $c$ are positive by **Theorem 1**.)

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
where $a>0$ and $c-\frac{b^2}{a}>0$. 

Hence, $ac-b^2>0$.

Using **Theorem 1** $\implies$ M is positive definite.

# Method 3. All Upper-left Sub-determinants Positive

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

# Method 4. Positive Quadratic Form

> [!quote] Theorem 4
> *A symmetric matrix $M$ is positive definite if and only if for all $\mathbf{x}\neq \mathbf{0}$,*
> $$
>	\mathbf{x}^\text{T}M\mathbf{x}>0
> $$


$\implies$
consider the orthonormal eigenvectors $\mathbf{q}$
$$
	M \mathbf{q}=\lambda \mathbf{q}
$$
for $\mathbf{x}=c_{1}\mathbf{q}_{1}+c_{2}\mathbf{q}_{2}+\dots+ c_{n}\mathbf{q}_{n}$
$$
	\mathbf{x}^\text{T}M\mathbf{x}=(c_{1}\mathbf{q}_{1}+\dots+ c_{n}\mathbf{q}_{n})^\text{T}(c_{1}\lambda_{1}\mathbf{q}_{1}+\dots +c_{n}\lambda_{n}\mathbf{q}_{n})
$$
since $M$ is a symmetric matrix, by **Spectral Theorem**, $\mathbf{q}_{i}$ and $\mathbf{q}_{j}$ must be perpendicular if $i\neq j$.

so $$c_{i}\mathbf{q}_{i}^\text{T}\;c_{j}\lambda_{j}\mathbf{q}_{j}=0$$
for the remaining terms, $i=j$
$$
	\mathbf{q}^\text{T}M\mathbf{q}=\mathbf{q}^\text{T}\lambda\mathbf{q}=\lambda\,\|\mathbf{q}\|^2=\lambda
$$
combine the two results, expand the brackets
$$
	\mathbf{x}^\text{T}M\mathbf{x}=c_{1}^2\lambda_{1}+c_{2}^2\lambda_{2}+\dots+c_{n}^2\lambda_{n}
$$
since $M$ is positive definite, $\lambda>0$ so $\mathbf{x}^\text{T}M\mathbf{x}>0$.

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


# Method 5. Using the Spectral Theorem
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
consider $\mathbf{x}\neq \mathbf{0}$,
$$
		\mathbf{x}^\text{T}M\mathbf{x}=	\mathbf{x}^\text{T}A^TA\mathbf{x}
$$
$$
	=(A\mathbf{x})^\text{T}(A\mathbf{x})
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
