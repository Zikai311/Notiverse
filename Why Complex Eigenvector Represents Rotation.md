
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

Acting on a vector $(x,y)^{\text{T}}$,

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

Plus, In my opinion, $e^{i\theta}$ is most naturally understood as rotation or evolution operator, rather than abuse of notation or interpreted as analytical function.

---
# Rotation Matrices

$\mathbf{R}(\theta)$ is a rotation matrix counter-clockwise by $\theta^\circ$.

$$
	\mathbf{R} = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}
$$

Consider the eigenvalue equation

$$
\mathbf{Rv}=\lambda \mathbf{v}.
$$

To determine the eigenvalues, solve

$$
\det(\mathbf{R}-\lambda \mathbf{I})=0.
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
-i
\end{pmatrix}\quad \text{and} \quad \begin{pmatrix}
1 \\
i
\end{pmatrix}
$$
respectively.

you can verify it directly, e.g for $\begin{pmatrix}1 \\  -i\end{pmatrix}$,

$$
	\mathbf{R}(\theta)\begin{pmatrix}
	1 \\
	-i
	 \end{pmatrix}=\begin{pmatrix}
	 \cos \theta+i\sin \theta \\
	 \sin \theta-i\cos \theta
	 \end{pmatrix}=e^{i\theta}\begin{pmatrix}
	 1 \\
	 -i
	 \end{pmatrix}
$$

Summary for the important fact:

> Real scaling transformations have real eigenvalues.
>
> Pure rotations require complex eigenvalues.

In the real plane, no nonzero vector remains fixed under a genuine rotation. The invariant directions only appear after extending the space to complex numbers, which I think, is unnecessary to be visually interpreted, since we have a more powerful way to think about it below.

---
# The Operator Interpretation of Eigenvalues

Please read [[Polar Form and Euler's Formula]] and [[The Matrix Operator View of Euler’s Identity]] first, then you may feel it natural to treat real rotation as matrix exponential operator.

Consider the eigenvalue equation:
$$\mathbf{Rv} = \lambda \mathbf{v}$$

Where the rotation matrix $R$ is defined as:
$$\mathbf{R} = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$$

We already know one of the the eigenvalues is
$$\lambda = e^{i\theta}$$
and take it as an example

From the second resource above, we got the identity, without reference to complex numbers
$$
	\mathbf{R}(\theta)=e^{\theta J}.
$$
The eigenvalue equation
$$\mathbf{Rv} = \lambda \mathbf{v}$$
Transforms into
$$e^{\theta J}\begin{pmatrix}
1 \\
-i
\end{pmatrix} = e^{i\theta}\begin{pmatrix}
1 \\
-i
\end{pmatrix}$$

We can verify this by substituting $\theta=90^{\circ}$.
$$
	e^{\frac{\pi}{2}J}=J=\begin{pmatrix}
	0 & -1 \\
	1 & 0
	\end{pmatrix}
$$
$$
	\begin{pmatrix}
	0 & -1 \\
	1 & 0
	\end{pmatrix}\begin{pmatrix}
	1 \\
	-i
	\end{pmatrix}=\boxed{\begin{pmatrix}
	i \\
	1
	\end{pmatrix}}
$$
and
$$
	e^{\frac{\pi }{2}i}=i
$$
$$
	i\begin{pmatrix}
	1 \\
	-i
	\end{pmatrix}=\boxed{\begin{pmatrix}
	i \\
	1
	\end{pmatrix}}
$$
What does this mean? 

The rotation of the real plane $e^{\theta J}$ is algebraically identical to a one-dimensional phase shift $e^{\pm i\theta}$ in the eigen-basis, along these specific complex directions $(1,\pm i)^T$. 

Essentially, $e^{\pm i\theta}v$ defines two circular path where the distinction between "rotation matrix multiplication" and "scaling by a complex rotation operator in each component" disappears.


The real $\mathbb{R^2}$ rotation operator $e^{\theta J}$ has two complex eigen-directions:

- one rotating counterclockwise with phase shift $e^{i\theta}$ along the path spanned by $(1,-i)^{\text{T}}$
- one rotating clockwise with phase shift $e^{-i\theta}$ along the path spanned by $(1,i)^{\text{T}}$

It is worth noting that, these two paths will always keep *orthogonal* under standard complex inner product [^1], along with the revolution by $e^{i\theta}$ and $e^{-i\theta}$ for any $\theta$.
$$\langle \mathbf{v}_1, \mathbf{v}_2 \rangle = (1)e^{i\theta}\overline{(1)e^{-i\theta}} + (i)e^{i\theta}\overline{(-i)e^{-i\theta}} =e^{2i\theta}-e^{2i\theta}= 0$$

> [!tip] Why complex eigenvector represents rotation?
> The $\mathbb{R}^2$ plane itself cannot split one rotation apart, but $\mathbb{C}^2$ plane can. It is decomposing over $\mathbb{C}^2$ into two opposite rotations along *orthogonal* complex circular paths. These opposite phase shift operators are its *eigenvalues*, and the paths are its *eigenvectors*.

Final tips: Don't try to visualise $\mathbb{C}^2$ rotation in your head, the algebraic insight you’ve built is indeed more powerful than forcing a mental picture.





[^1]: In In physics (especially quantum mechanics), the convention is often the opposite, i.e conjugate‑linear in the first and linear in the second. Here, we are using the **standard Hermitian inner product** convention in mathematics.

#compex_number #why #matrix_eponential 
