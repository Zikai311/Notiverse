> [!info] Intro
> This note deduce the curvature of function $\gamma(t)=\begin{pmatrix}x(t) \\  y(t)\end{pmatrix}$ $$\kappa(t)=\frac{|x'(t)y''(t)-y'(t)x''(t)|}
{(x'(t)^2+y'(t)^2)^{3/2}}$$
 
consider the mapping $\gamma:\mathbb{R}\to\mathbb{R}^2$ where
$$
	\gamma(t)=\begin{pmatrix}
	x(t) \\
	y(t)
	\end{pmatrix}
$$
hence the tangent to the graph is
$$
\gamma'(t)=\begin{pmatrix}
x'(t) \\
y'(t)
\end{pmatrix}
$$
the unitary tangental vector is 
$$
	T(t)=\frac{\gamma'(t)}{\|\gamma'(t)\|}=\begin{pmatrix}
	x'(t) \\
	y'(t)
	\end{pmatrix} \frac{1}{\sqrt{ (x'(t))^2+(y'(t))^2 }}
$$
by definition the curvature is the rate of change in tangental direction w.r.t arc length
$$
	\kappa(t)=\|\frac{dT}{ds}\|=\|\frac{dT / dt}{ds/dt}\|=\frac{\|T'(t)\|}{\|\gamma'(t)\|}
$$
let $\sqrt{  (x'(t))^2+(y'(t))^2}={\|\gamma'(t)\|}=l$ for convenience,
$$
	T'(t)=\begin{pmatrix}
	x''l-x' \frac{2x'x''+2y'y''}{2l} \\
	y''l-y' \frac{2x'x''+2y'y''}{2l}
	\end{pmatrix}\, \frac{1}{l^2}=\begin{pmatrix} 
	x''l^2-x'(x'x''+y'y'') \\
	y''l^2-y' (x'x''+y'y'')
	\end{pmatrix} \frac{1}{l^3}
$$

$$
	=\frac{1}{l^3}\begin{pmatrix}
	x''(x')^2+x''(y')^2-x''(x')^2-y''x'y' \\
	y''(x')^2+y''(y')^2-x''x'y'-y''(y')^2
	\end{pmatrix}=\frac{1}{l^3}\begin{pmatrix}
	x''(y')^2-y''x'y' \\
	y''(x')^2-x''x'y'
	\end{pmatrix}
$$
$$
	\|T'(t)\|=\frac{1}{l^3} \sqrt{ (x''(y')^2-y''x'y')^2+(	y''(x')^2-x''x'y') ^2}
$$
$$
	=\frac{1}{l^3}\sqrt{ ((x')^2+(y')^2)(x'y''-y'x'')^2 }=\frac{1}{l^2}|x'y''-y'x''|
$$
hence
$$
	\kappa(t)=\frac{|x'y''-y'x''|}{(x'(t)^2+y'(t)^2)^{3/2}}
$$
It' worth noting that when $f(x)=\begin{pmatrix}x \\  y(x)\end{pmatrix}$,
$$
	\kappa(x)=\frac{|y''|}{(1+y'(t)^2)^{3/2}}
$$

#differential_geometry