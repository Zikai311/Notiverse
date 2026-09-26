## 1-forms

$$
V = vec(v_1, v_2, v_3)
$$

$$
dif x (V) = v_1, quad dif y (V) = v_2, quad dif z (V) = v_3
$$

$$
gamma(t) = vec(x(t), y(t), z(t)), quad gamma'(t) = vec(x'(t), y'(t), z'(t))
$$

$$
dif x (gamma'(t)) = x'(t) = dot(x)(t)
$$

$$
dif x = dot(x)(t) dif t
$$

Basic 1-forms in $RR^3$: $dif x$, $dif y$, $dif z$.

General 1-form:

$$
omega = P dif x + Q dif y + R dif z
$$

$$
F = vec(P(x,y,z), Q(x,y,z), R(x,y,z))
$$

$$
omega_F (V) = P v_1 + Q v_2 + R v_3 = F dot V
$$

Vector line integral / work:

$$
integral_(gamma(t)) omega_F = integral omega_F (gamma'(t)) dif t = integral F dot gamma'(t) dif t
$$

## Wedge product

$$
dif x and dif y = - dif y and dif x
$$

Bilinear antisymmetric form $B: RR^2 times RR^2 -> RR$:

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

$$
B(arrow(e)_1, arrow(e)_1) = B(arrow(e)_2, arrow(e)_2) = 0
$$

$$
= (u_1 v_2 - u_2 v_1) B(arrow(e)_1, arrow(e)_2) = det mat(u_1, v_1; u_2, v_2) dot B(arrow(e)_1, arrow(e)_2)
$$

## General 2-forms

$$
B(arrow(u), arrow(v)) = det mat(u_1, v_1; u_2, v_2)
$$

$$
dif x and dif y (arrow(u), arrow(v)) = det mat(u_1, v_1; u_2, v_2)
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
arrow(omega) times arrow(v) = vec(dif y and dif z, dif z and dif x, dif x and dif y)
$$

General 2-form:

$$
omega = P dif y and dif z + Q dif z and dif x + R dif x and dif y
$$

$$
omega_F (T_u, T_v) = F dot (T_u times T_v)
$$

$$
F = vec(P, Q, R)
$$

$$
integral.double_(Phi(u,v)) omega_F = integral.double F dot (T_u times T_v) dif u dif v
$$

## Motivation: circulation and flux

$$
integral.cont_C F dot dif s
$$

$$
integral.cont_S F dot dif A = integral.double_S F dot (T_u times T_v) dif u dif v
$$

$$
Phi(u,v)
$$

## Comparison of the four classical theorems

| #   | Formula                                                                                                | Left region (domain) | Left-side object | Right region (boundary) | Right-side object |
| --- | ------------------------------------------------------------------------------------------------------ | -------------------- | ---------------- | ----------------------- | ----------------- |
| 1   | $integral_a^b (dif f)/(dif x) dif x = f(b) - f(a)$                                                     | $[a,b]$              | derivative       | ${a,b}$                 | $f$               |
| 2   | $integral.double_D (diff Q/diff x - diff P/diff y) dif A = integral.cont_(diff D) (P dif x + Q dif y)$ | 2D surface           | curl             | 1D curve $diff D$       | F circulation     |
| 3   | $integral.double_S (nabla times F) dot n dif A = integral.cont_(diff S) F dot dif r$                   | 2D surface           | curl             | 1D curve $diff D$       | F circulation     |
| 4   | $integral.triple_V (nabla dot F) dif V = integral.double_(diff V) F dot n dif A$                       | 3D solid             | divergence       | 2D surface $diff V$     | F flux            |

General Stokes' theorem unifying all four:

$$
integral_M dif omega = integral_(diff M) omega
$$

$$
M quad "is a" quad k quad "-dim manifold, " quad diff M quad "is" quad (k-1) quad "-dim"
$$

## FTC, Green's theorem, Stokes' theorem (curl form)

**1. Fundamental Theorem of Calculus**

$$
integral_a^b (dif f)/(dif x) dif x = f(b) - f(a)
$$

**2. Green's theorem**

$$
integral.double_D (diff Q/diff x - diff P/diff y) dif A = integral.cont_(diff D) (P dif x + Q dif y)
$$

$$
F = vec(P(x,y), Q(x,y))
$$

$$
integral.double_D (diff Q/diff x - diff P/diff y) dif A = integral.cont_(diff D) F dot dif r
$$

**3. Stokes' theorem (curl form), surface $S$**

$$
integral.double_S (nabla times F) dot n dif A = integral.cont_(diff S) F dot dif r
$$

$$
F = vec(P(x,y,z), Q(x,y,z), R(x,y,z))
$$

$$
dif r = vec(dif x, dif y, dif z)
$$

## Divergence theorem

**4. Divergence theorem**

$$
integral.triple_V (nabla dot F) dif V = integral.double_(diff V) F dot n dif A
$$

$$
F = vec(P, Q, R)
$$

$V$ is a bounded solid region; $diff V$ is its piecewise-smooth closed boundary.

## Pullback metric

$$
dif V_m = sqrt(det(g)) dif^k u = sqrt(det(J^T J)) dif^k u
$$

1-dim manifold, curve $gamma(t)$:

$$
g = (gamma'(t))^2
$$

$$
dif V_m = dif s = gamma'(t) dif t = abs(gamma'(t)) dif t
$$

2-dim manifold, $Phi(u,v)$:

$$
J = mat(T_u, T_v), quad J^T = mat(T_u; T_v)
$$

$$
J^T J = mat(T_u dot T_u, T_u dot T_v; T_v dot T_u, T_v dot T_v) = g
$$

## Arc length and surface integral of a scalar function

$$
g = mat(T_u dot T_u, T_u dot T_v; T_v dot T_u, T_v dot T_v)
$$

$$
det g = abs(T_u)^2 abs(T_v)^2 - (T_u dot T_v)^2 = abs(T_u times T_v)^2
$$

$$
integral_C f(x,y,z) dif s = integral_C f(x,y,z) abs(gamma'(t)) dif t
$$

$$
integral_S f(x,y,z) sqrt(det(g)) dif u dif v
$$
