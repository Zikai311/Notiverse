## Generalised Stokes' Theorem and the Exterior Derivative

$$
\int_M d\omega = \int_{\partial M}\omega

$$

- $\omega$: a $k$-form
- $d\omega$: a $(k+1)$-form
- $d$: the exterior derivative

This note is a introduction to the external derivative $d$.

## External derivative

The exterior derivative on a differential form is defined as follows:
$$
d\omega_p(v_1, v_2, \cdots, v_{k+1}) = \lim_{h\to 0}\frac{\displaystyle\int_{\partial P(hv_1,\,hv_2,\,\cdots)}\omega}{h^{k+1}}

$$
The three-dimensional case:
 $v_1, v_2, v_3 \in \mathbb{R}^3$, $P$ is the resulting parallelepiped..

$$
d\omega(v_1, v_2, v_3) = \lim_{h\to 0}\frac{\displaystyle\int_{\partial P(hv_1,\,hv_2,\,hv_3)}\omega}{h^{3}}

$$

## The relation to divergence

Recall the definition of divergence,

$$
\nabla\cdot E = \lim_{\Delta V\to 0}\frac{\displaystyle\iint_{S}F\cdot dA}{\Delta V} = \lim_{\Delta V\to 0}\frac{\displaystyle\int_{\partial P}\omega}{\Delta V}

$$

$$
\Delta V = \det\!\begin{bmatrix}hv_1 & hv_2 & hv_3\end{bmatrix} = h^{3}\det\!\begin{bmatrix}v_1 & v_2 & v_3\end{bmatrix}

$$

$$
d\omega =\det \begin{bmatrix}v_{1}  & v_{2} & v_{3}

\end{bmatrix}  \frac{\iint_{\partial P}F \cdot dA}{\Delta V} =(\nabla\cdot E)\: dx\wedge dy\wedge dz\,(v_1, v_2, v_3)

$$

## Example: The Flux Form of $\mathbf F = (P, 0, 0)$

$$
\mathbf F(x,y,z) = \begin{pmatrix}P(x,y,z)\\0\\0\end{pmatrix}

$$
$$
\omega_{\mathbf{F}} = P(x,y,z)\,dy\wedge dz

$$

![[Pasted image 20261002001824.png]]

*Figure: the small parallelepiped $\partial P(h\mathbf v_1,h\mathbf v_2,h\mathbf v_3)$ spanned by $h\mathbf v_1,h\mathbf v_2,h\mathbf v_3$, with the field $\mathbf F=(P,0,0)$ crossing its two $yz$-faces $S_0$ and $S_1$; the quantity computed is the flux difference $\Delta\Phi_{yz}=\Phi_{yz}(S_{1})-\Phi_{yz}(S_{0})$.*

The computation below treats this parallelepiped as a rectangular cube (using $dy\,dz$ as the face area element), which is not strictly rigorous for a general parallelepiped, yet plausible to show our result.

by definition,
$$
d\omega_{\mathbf{F}} = \lim_{h\to 0}\frac{\displaystyle\int_{\partial P(hv_1,\,hv_2,\,\cdots)}\omega}{h^{3}}=\lim_{h\to 0}\frac{\Delta\Phi_{yz}}{h^{3}}

$$
$$
d\omega_{\mathbf{F}} = \lim_{h\to 0}\frac{1}{h^{2}}\int_{y_0}^{y_0+h}\int_{z_0}^{z_0+h}\frac{\bigl[P(x_0+h,\,y,\,z) - P(x_0,\,y,\,z)\bigr]}{h}\,dz\,dy = \frac{1}{h^{2}}\cdot h^2\cdot \frac{\partial P}{\partial x} = \frac{\partial P}{\partial x}

$$

$$
\implies \quad d\omega_{\mathbf{F}}= \frac{\partial P}{\partial x}\,dx\wedge dy\wedge dz

$$

$$
\boxed{\,d\omega_{\mathbf{F}} = \frac{\partial P}{\partial x}\det\!\begin{bmatrix}v_1 & v_2 & v_3\end{bmatrix}\,}

$$

## Example: The Flux Form of $\mathbf F = (P, Q, R)$

$$
\mathbf F(x,y,z)=\begin{pmatrix}P(x,y,z)\\Q(x,y,z)\\R(x,y,z)\end{pmatrix},\qquad
\Phi_{\mathbf F}=P\,dy\wedge dz+Q\,dz\wedge dx+R\,dx\wedge dy .
$$

Reusing the box above, each basis 2-form is measured only on the pair of faces it spans, so

$$
\int_{\partial P_h} P\,dy\wedge dz
=\iint\big[P(x_0+h,y,z)-P(x_0,y,z)\big]\,dy\,dz,
$$

$$
\int_{\partial P_h} Q\,dz\wedge dx
=\iint\big[Q(x,y_0+h,z)-Q(x,y_0,z)\big]\,dz\,dx,
$$

$$
\int_{\partial P_h} R\,dx\wedge dy
=\iint\big[R(x,y,z_0+h)-R(x,y,z_0)\big]\,dx\,dy .
$$

By linearity, $\displaystyle\int_{\partial P_h}\Phi_{\mathbf F}$ is the sum of these three; combining the $yz$-, $zx$- and $xy$-flux differences and using the definition,

$$
d\Phi_{\mathbf F}=\lim_{h\to 0}\frac{1}{h^{3}}\int_{\partial P_h}\Phi_{\mathbf F}
=\Big(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\Big)dx\wedge dy\wedge dz
=(\nabla\cdot\mathbf F)\,dx\wedge dy\wedge dz .
$$

$$
\boxed{\,d\Phi_{\mathbf F}=(\nabla\cdot\mathbf F)\,dx\wedge dy\wedge dz\,}
$$

$$
\boxed{\,d\Phi_{\mathbf F}(v_1,v_2,v_3)=(\nabla\cdot\mathbf F)\det\!\begin{bmatrix}v_1 & v_2 & v_3\end{bmatrix}\,}
$$

## Example: The Work Form of $\mathbf F = (P, Q, R)$

$$
\mathbf F(x,y,z)=\begin{pmatrix}P(x,y,z)\\Q(x,y,z)\\R(x,y,z)\end{pmatrix},\qquad
W_{\mathbf F}=P\,dx+Q\,dy+R\,dz .
$$

By definition, for the parallelogram $P(hv_1,hv_2)$,

$$
dW_{\mathbf F}(v_1,v_2)=\lim_{h\to 0}\frac{1}{h^{2}}\int_{\partial P(hv_1,\,hv_2)}W_{\mathbf F},
$$

the circulation per unit area. Take $v_1=e_x,\ v_2=e_y$ (an $xy$-rectangle); then $dz=0$ and the loop integral is

$$
\int_{\partial P_h}(P\,dx+Q\,dy)
=\int_{x_0}^{x_0+h}\big[P(x,y_0,z_0)-P(x,y_0+h,z_0)\big]\,dx
+\int_{y_0}^{y_0+h}\big[Q(x_0+h,y,z_0)-Q(x_0,y,z_0)\big]\,dy .
$$

Dividing by $h^{2}$ and letting $h\to 0$,

$$
dW_{\mathbf F}(e_x,e_y)=\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}.
$$

Cycling the same computation around the other two edge pairs,

$$
dW_{\mathbf F}(e_y,e_z)=\frac{\partial R}{\partial y}-\frac{\partial Q}{\partial z},
\qquad
dW_{\mathbf F}(e_z,e_x)=\frac{\partial P}{\partial z}-\frac{\partial R}{\partial x}.
$$

Hence

$$
dW_{\mathbf F}=\Big(\frac{\partial R}{\partial y}-\frac{\partial Q}{\partial z}\Big)dy\wedge dz
+\Big(\frac{\partial P}{\partial z}-\frac{\partial R}{\partial x}\Big)dz\wedge dx
+\Big(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\Big)dx\wedge dy
=\Phi_{\nabla\times\mathbf F}.
$$

$$
\boxed{\,dW_{\mathbf F}=\Phi_{\nabla\times\mathbf F}\,}
$$

$$
\boxed{\,dW_{\mathbf F}(v_1,v_2)=(\nabla\times\mathbf F)\cdot(v_1\times v_2)\,}
$$

## Computational Rules for the Exterior Derivative

1. **Linearity:** $d(\alpha+\beta)=d\alpha+d\beta$.
2. **Leibniz rule:** for a function $f$ and a $k$-form $\alpha$,

$$
d(f\,\alpha)=df\wedge\alpha+f\,d\alpha.
$$

Every basis form is closed, $d(dx_i)=0$, so $d(dy\wedge dz)=0$; hence for a pure $k$-form

$$
d(P\,dx_I)=dP\wedge dx_I.
$$

3. **Anticommutativity and nilpotency:** $dx\wedge dx=0$ and $dx\wedge dy=-dy\wedge dx$, together with $d^2=0$; so any repeated direction in a wedge product vanishes.

### A 2-form coefficient

Let $\omega=P(x,y,z)\,dy\wedge dz$. By rule 2, $d\omega=dP\wedge dy\wedge dz$ with

$$
dP=\frac{\partial P}{\partial x}\,dx+\frac{\partial P}{\partial y}\,dy+\frac{\partial P}{\partial z}\,dz.
$$

Expanding and keeping only terms with three distinct directions,

$$
\begin{aligned}
d\omega &= P_x\,dx\wedge dy\wedge dz
        + P_y\,\underbrace{dy\wedge dy}_{0}\wedge dz
        + P_z\,\underbrace{dz\wedge dy\wedge dz}_{0}\\[4pt]
        &= \frac{\partial P}{\partial x}\,dx\wedge dy\wedge dz.
\end{aligned}
$$

The $dx$-term is simply differentiated, while the $dy$- and $dz$-terms die because each repeats a direction.

$$
\boxed{\,d(P\,dy\wedge dz) = \frac{\partial P}{\partial x}\,dx\wedge dy\wedge dz\,}
$$

$$
d(P\,dx\wedge dy) = P_z\,dz\wedge dx\wedge dy = (dP)\wedge dx\wedge dy

$$

### Example of a 0-form

$$
f(x,y,z) = x^{2} + yz \qquad (0\text{-form})

$$

$$
df = 2x\,dx + z\,dy + y\,dz \qquad (1\text{-form})

$$

### Example of a 1-form

$$
\omega = x^{2}\,dy \qquad (1\text{-form})

$$

$$
d\omega = d(x^{2}\,dy) = d(x^{2})\wedge dy

$$

## Example: A quick way to evaluate the curl  
$$
\omega_{\mathbf{F}} = xz\,dx + x^{2}\,dy + yz\,dz

$$

$$
\begin{aligned}
d\omega_{\mathbf{F}} &= d(xz)\wedge dx + d(x^{2})\wedge dy + d(yz)\wedge dz\\[4pt]
&= (z\,dx + x\,dz)\wedge dx + 2x\,dx\wedge dy + (z\,dy + y\,dz)\wedge dz\\[4pt]
&= x\,dz\wedge dx + 2x\,dx\wedge dy + z\,dy\wedge dz\\[4pt]
&= z\,dy\wedge dz + x\,dz\wedge dx + 2x\,dx\wedge dy
\end{aligned}

$$

$$
\nabla\times \mathbf F = \begin{bmatrix}z\\x\\2x\end{bmatrix}, \qquad d\omega_F = \Phi_{\nabla\times \mathbf F}

$$
## Conclusion

In each dimension $d$ raises the degree by one, and the top form always has $d=0$ because there is no room left.

**1D**

$$
\boxed{
\begin{aligned}
&0\text{-form}:f &&\xrightarrow{d}&& df &&\longleftrightarrow&& f'=\nabla f,\\
&1\text{-form}:\omega=P\,dx &&\xrightarrow{d}&& d\omega=0 &&\longleftrightarrow&& (\text{no }2\text{-forms}).
\end{aligned}
}
$$

**2D**

$$
\boxed{
\begin{aligned}
&0\text{-form}:f &&\xrightarrow{d}&& df &&\longleftrightarrow&& \nabla f=(f_x,f_y),\\
&1\text{-form}:\omega=P\,dx+Q\,dy &&\xrightarrow{d}&& d\omega=(Q_x-P_y)\,dx\wedge dy &&\longleftrightarrow&& Q_x-P_y\ (\text{planar curl}),\\
&2\text{-form}:\eta=A\,dx\wedge dy &&\xrightarrow{d}&& d\eta=0 &&\longleftrightarrow&& (\text{no }3\text{-forms}).
\end{aligned}
}
$$

**3D**

$$
\boxed{
\begin{aligned}
&0\text{-form}:f &&\xrightarrow{d}&& df &&\longleftrightarrow&& \nabla f,\\
&1\text{-form}:\omega=P\,dx+Q\,dy+R\,dz &&\xrightarrow{d}&& d\omega &&\longleftrightarrow&& \nabla\times(P,Q,R),\\
&2\text{-form}:\eta=A\,dy\wedge dz+B\,dz\wedge dx+C\,dx\wedge dy &&\xrightarrow{d}&& d\eta &&\longleftrightarrow&& \nabla\cdot(A,B,C).
\end{aligned}
}
$$