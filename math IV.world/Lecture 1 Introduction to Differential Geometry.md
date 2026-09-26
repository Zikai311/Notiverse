
> [!Quote] 
> *Spoiler:* There is no differential in differential form.

## Revision of scalar integral on $k"-dim"$ manifold

$$
dif V_k = sqrt(det(g)) dif^k u quad g=J^T J
$$

1-dim manifold, curve $gamma: [a,b] mapsto bb(R)^3$:

$$
g =gamma'(t)^T gamma'(t)= abs(gamma'(t))^2
$$

$$
dif V_1 = dif s = sqrt(det(g)) dif t = abs(gamma'(t)) dif t
$$
$$
integral_C f(x,y,z) dif s = integral_a^b f(gamma(t)) abs(gamma'(t)) dif t
$$

2-dim manifold, $Phi(u,v): bb(R)^2 mapsto bb(R)^3$

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
dif V_2 = dif A = sqrt(det(g)) dif u dif v = abs(T_u times T_v) dif u dif v
$$
$$
integral_S f(x,y,z) dif A = integral.double_D f(Phi(u,v)) abs(T_u times T_v) dif u dif v
$$
## Motivation

Circulation and flux are evaluated by vector integrals, which are not yet unified in one single language.

$$
integral.cont_C F dot dif s=integral_C F dot gamma'(t) dif t
$$
$$
integral.cont_S F dot dif A = integral.double_D F dot (T_u times T_v) dif u dif v
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

## 1-forms in 3 dimension
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
let
$$
F = vec(P(x,y,z), Q(x,y,z), R(x,y,z))
$$
then,
$$
omega_F (v) = P v_1 + Q v_2 + R v_3 = F dot v
$$

Vector line integral:

$$
integral_C omega_F = integral_a ^b omega_F (gamma'(t)) dif t = integral_a ^b F dot gamma'(t) dif t quad t in [a,b]
$$

## Introducing wedge product

$$
dif x and dif y: RR^3 times RR^3 -> RR
$$

with so-called antisymmetric bilinear properties as follows:
1. $arrow(a) and arrow(b) = - arrow(b) and arrow(a)$
2. $(lambda arrow(a) + mu arrow(b)) and arrow(c) = lambda arrow(a) and arrow(c) + mu arrow(b) and arrow(c)$
3. $arrow(a) and (lambda arrow(b) + mu arrow(c)) = lambda arrow(a) and arrow(b) + mu arrow(a) and arrow(c)$

Consider two general tangent vectors $arrow(a)$ and $arrow(b)$ in $RR^3$:
$$arrow(a) = a_1 arrow(e)_1 + a_2 arrow(e)_2 + a_3 arrow(e)_3$$
$$arrow(b) = b_1 arrow(e)_1 + b_2 arrow(e)_2 + b_3 arrow(e)_3$$

If we apply the properties thereof, we expand $arrow(a)$ and $arrow(b)$ into $3 times 3 = 9$ terms.

$$arrow(a) and arrow(b) = sum_(i=1)^3 sum_(j=1)^3 a_i b_j arrow(e)_i and arrow(e)_j$$

Because $arrow(e)_i and arrow(e)_i = 0$ and $arrow(e)_i and arrow(e)_j = - arrow(e)_j and arrow(e)_i$,
$$arrow(a) and arrow(b) = (a_2 b_3 - a_3 b_2) arrow(e)_2 and arrow(e)_3 + (a_3 b_1 - a_1 b_3) arrow(e)_3 and arrow(e)_1 + (a_1 b_2 - a_2 b_1) arrow(e)_1 and arrow(e)_2$$
$$= det mat(a_2, b_2; a_3, b_3) arrow(e)_2 and arrow(e)_3 + det mat(a_3, b_3; a_1, b_1) arrow(e)_3 and arrow(e)_1 + det mat(a_1, b_1; a_2, b_2) arrow(e)_1 and arrow(e)_2$$

In $RR^3$, there are $binom(3,2) = 3$ fundamental 2-forms, which we denote as $dif y and dif z$, $dif z and dif x$, and $dif x and dif y$.

Define the fundamental mappings for any vectors $arrow(a)$ and $arrow(b)$:
$$dif y and dif z (arrow(a), arrow(b)) = det mat(a_2, b_2; a_3, b_3)$$
$$dif z and dif x (arrow(a), arrow(b)) = det mat(a_3, b_3; a_1, b_1)$$
$$dif x and dif y (arrow(a), arrow(b)) = det mat(a_1, b_1; a_2, b_2)$$
## 2-form in 3D space
The general 2-form in 3D space is defined as a linear combination of elementary 2-forms as follows:
$$omega = P dif y and dif z + Q dif z and dif x + R dif x and dif y$$

Apply this to a 2D surface $S$ parameterised by $Phi(u,v)$. The tangent vectors are $T_u$ and $T_v$.
$$omega_F(T_u, T_v) = vec(P,Q,R) dot vec(dif y and dif z, dif z and dif x, dif x and dif y)(T_u, T_v)$$
Notice that the cross product perfectly matches the fundamental 2-forms evaluated on the tangent vectors. By applying the operators component-wise, we have:

$$upright(bold(T))_u times upright(bold(T))_v &= vec((dif y and dif z)(upright(bold(T))_u, upright(bold(T))_v), (dif z and dif x)(upright(bold(T))_u, upright(bold(T))_v), (dif x and dif y)(upright(bold(T))_u, upright(bold(T))_v)) \
&= vec(dif y and dif z, dif z and dif x, dif x and dif y)(upright(bold(T))_u, upright(bold(T))_v)$$
Then,
$$omega_F(T_u, T_v) = F dot (T_u times T_v)$$

Let
$$
F = vec(P(x,y,z), Q(x,y,z), R(x,y,z))
$$

Hence, the surface integral becomes:
$$integral.double_S omega_F = integral.double_D F(Phi(u,v)) dot (T_u times T_v) dif u dif v quad u,v in D$$