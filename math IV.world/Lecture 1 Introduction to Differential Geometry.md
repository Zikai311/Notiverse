## Revision of scalar integral on $m"-dim"$ manifold

$$
dif V_m = sqrt(det(g)) dif^k u = sqrt(det(J^T J)) dif^k u
$$

1-dim manifold, curve $gamma(t)$:

$$
g =gamma'(t)^T gamma'(t)= abs(gamma'(t))^2
$$

$$
dif V_m = dif s = sqrt(det(g)) dif t = abs(gamma'(t)) dif t
$$
$$
integral_C f(x,y,z) dif s = integral_C f(x,y,z) abs(gamma'(t)) dif t
$$

2-dim manifold, $Phi(u,v)$:

$$
J = mat(T_u, T_v), quad J^T = mat(T_u; T_v)
$$

$$
J^T J = mat(T_u dot T_u, T_u dot T_v; T_v dot T_u, T_v dot T_v) = g
$$

$$
det g = abs(T_u)^2 abs(T_v)^2 - (T_u dot T_v)^2 = abs(T_u times T_v)^2
$$
$$
dif V_m = dif A = sqrt(det(g)) dif t = abs(T_u times T_v) dif t
$$
$$
integral_S f(x,y,z) abs(T_u times T_v) dif u dif v
$$
## Motivation - circulation and flux

$$
integral.cont_C F dot dif s= F dot gamma'(t) dif t
$$

$$
integral.cont_S F dot dif A = integral.double_S F dot (T_u times T_v) dif u dif v
$$

## Comparison of the four classical theorems

| #   | Formula                                                                                                | Left region (domain) | Left-side object | Right region (boundary) | Right-side object |
| --- | ------------------------------------------------------------------------------------------------------ | -------------------- | ---------------- | ----------------------- | ----------------- |
| 1   | $integral_a^b (dif f)/(dif x) dif x = f(b) - f(a)$                                                     | $[a,b]$              | derivative       | ${a,b}$                 | $f$               |
| 2   | $integral.double_D (diff Q/diff x - diff P/diff y) dif A = integral.cont_(diff D) (P dif x + Q dif y)$ | 2D surface           | curl             | 1D curve $diff D$       | $F$ circulation   |
| 3   | $integral.double_S (nabla times F) dot n dif A = integral.cont_(diff S) F dot dif r$                   | 2D surface           | curl             | 1D curve $diff D$       | $F$ circulation   |
| 4   | $integral.triple_V (nabla dot F) dif V = integral.double_(diff V) F dot n dif A$                       | 3D solid             | divergence       | 2D surface $diff V$     | F flux            |

Our aim of this course - General Stokes' theorem unifying all four:

$$
integral_M dif omega = integral_(diff M) omega
$$

 where $M$ is a $k"-dim"$  manifold,  $diff M$ is a $(k-1)"-dim"$  manifold.

let's inspect the four theorems by details.
## FTC, Green's theorem, Stokes' theorem, Divergence theorem

**1. Fundamental Theorem of Calculus**

$$
integral_a^b (dif f)/(dif x) dif x = f(b) - f(a)
$$

**2. Green's theorem**
$$
F = vec(P(x,y), Q(x,y))quad dif r=vec(dif x, dif y)
$$
$$
integral.double_D (diff Q/diff x - diff P/diff y) dif A = integral.cont_(diff D) (P dif x + Q dif y)
$$
$$
integral.double_D (diff Q/diff x - diff P/diff y) dif A
$$

**3. Stokes' theorem (curl form), surface $S$**

$$
F = vec(P(x,y,z), Q(x,y,z), R(x,y,z))
quad
dif r = vec(dif x, dif y, dif z)
$$
$$
integral.double_S (nabla times F) dot n dif A = integral.cont_(diff S) F dot dif r
$$
**4. Divergence theorem**
$$
F = vec(P, Q, R)
$$
$$
integral.triple_V (nabla dot F) dif V = integral.double_(diff V) F dot n dif A
$$
$V$ is a bounded solid region; $diff V$ is its piecewise-smooth closed boundary.

## 1-forms
Consider a tangent vector $v$ to the curve $C$, defined by 
$$
C:gamma(t) = vec(x(t), y(t), z(t))
$$
$$
gamma'(t) = vec(x'(t), y'(t), z'(t))=vec(v_1, v_2, v_3)
$$
define $dif x(dot):bb(R)^3 mapsto bb(R)$ , and similar for $dif y, dif z$.
$$
dif x (v) = v_1, quad dif y (v) = v_2, quad dif z (v) = v_3
$$
hence,
$$
dif x (v) = x'(t)
$$
compare with the classical Leibniz's view
$$
dif x =x'(t) dif t
$$
Basic 1-forms in $RR^3$ are $dif x$, $dif y$, $dif z$.

General 1-form combines them linearly:

$$
omega = P dif x + Q dif y + R dif z
$$

$$
F = vec(P(x,y,z), Q(x,y,z), R(x,y,z))
$$

$$
omega_F (v) = P v_1 + Q v_2 + R v_3 = F dot v
$$

Vector line integral:

$$
integral_(gamma(t)) omega_F = integral omega_F (gamma'(t)) dif t = integral F dot gamma'(t) dif t
$$

## Wedge product

$$
dif x and dif y
$$

Could be represented in bilinear antisymmetric form $B: RR^2 times RR^2 -> RR$:
$$
dif x and dif y(dot, dot)=B(dot,dot)
$$
Properties are as follows:
1. $B(arrow(u), arrow(v)) = - B(arrow(v), arrow(u))$
2. $B(a arrow(u)_1 + b arrow(u)_2, arrow(v)) = a B(arrow(u)_1, arrow(v)) + b B(arrow(u)_2, arrow(v))$
3. $B(arrow(u), a arrow(v)_1 + b arrow(v)_2) = a B(arrow(u), arrow(v)_1) + b B(arrow(u), arrow(v)_2)$

$$
arrow(e)_1 = vec(1,0), quad arrow(e)_2 = vec(0,1)
$$

$$
arrow(u) = u_1 arrow(e)_1 + u_2 arrow(e)_2, quad arrow(v) = v_1 arrow(e)_1 + v_2 arrow(e)_2
$$

$$
B(arrow(u), arrow(v)) = B(u_1 arrow(e)_1 + u_2 arrow(e)_2,quad v_1 arrow(e)_1 + v_2 arrow(e)_2)
$$

$$
= u_1 v_1 B(arrow(e)_1, arrow(e)_1) + u_1 v_2 B(arrow(e)_1, arrow(e)_2) + u_2 v_1 B(arrow(e)_2, arrow(e)_1) + u_2 v_2 B(arrow(e)_2, arrow(e)_2)
$$
since,
$$
B(arrow(e)_1, arrow(e)_1) = B(arrow(e)_2, arrow(e)_2) = 0
$$
and
$$
 B(arrow(e)_1, arrow(e)_2)= -B(arrow(e)_2, arrow(e)_1)
$$
$$
B(arrow(u), arrow(v))= (u_1 v_2 - u_2 v_1) B(arrow(e)_1, arrow(e)_2) = det mat(u_1, v_1; u_2, v_2) dot B(arrow(e)_1, arrow(e)_2)
$$
let ${} B(arrow(e)_1, arrow(e)_2)=1 {}$,
$$
B(arrow(u), arrow(v))= det mat(u_1, v_1; u_2, v_2)$$
## General 2-forms



$$
dif x and dif y (arrow(u), arrow(v))  = det mat(u_1, v_1; u_2, v_2)
$$

$$
dif y and dif z (arrow(u), arrow(v)) = det mat(u_2, v_2; u_3, v_3)
$$

$$
dif x and dif z (arrow(u), arrow(v)) = det mat(u_1, v_1; u_3, v_3)
$$

$$
binom(3,2) = 3 quad "basic 2-forms"
$$

$$
(T_u times T_v) = vec(dif y and dif z, dif z and dif x, dif x and dif y)(u,v)
$$

General 2-form:

$$
omega = P dif y and dif z + Q dif z and dif x + R dif x and dif y
$$



$$
omega_F=vec(P,Q,R) dot vec(dif y and dif z, dif z and dif x, dif x and dif y) 
$$
let $F = vec(P, Q, R)$.
$$
omega_F (T_u, T_v) = F dot (T_u times T_v)
$$
hence,
$$
integral.double_(Phi(u,v)) omega_F = integral.double F dot (T_u times T_v) dif u dif v
$$

