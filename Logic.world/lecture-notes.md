这是一份为你整理的笔记Markdown转录。我保留了原笔记中的所有拼写（包括手写时的缩写或笔误，如“form”、“Intuitiontisc”、“sementics”等）以及空间排版逻辑，并已将所有公式替换为LaTeX语法。

  

  

  

### Pg 1

  

  

**Propositional logic**

  

$P \to P$

non-controversially true

  

$P \lor \neg P$

$(\neg P \to P) \to P$

controversial

  

**Syntax** formulae are built form variables using

$\varphi \lor \psi$ disjunction

$\varphi \land \psi$ conjunction

$\varphi \to \psi$ implication

$\bot$ false

  

notation

$\neg \varphi \equiv \varphi \to \bot$

  

**Classical Propositional Logic**

"true under every valuation"

$\vDash \varphi \iff \text{for every val}: \text{Var} \to \{0,1\}$

$\text{val} \vDash \varphi$

  

_$\leftarrow \equiv$ The same, Actually $\rightarrow$_

  

"Can be proved" using the "int" system + "$P \lor \neg P$"

$\vdash \varphi$

  

**Intuitiontisc propositional logic**

$\varphi$ is intuitionistically provable if the following system gives $\vdash \varphi$

  

$\vdash \varphi$

natural deduction

  

$\Gamma \vdash \varphi$ (_$\leftarrow$ set of formulas_)

eg $\Gamma, \varphi \vdash \varphi$

  

Conjunction

  

$$\frac{\Gamma \vdash \varphi_1 \quad \Gamma \vdash \varphi_2}{\Gamma \vdash \varphi_1 \land \varphi_2}$$

$$\frac{\Gamma \vdash \varphi_1 \land \varphi_2}{\Gamma \vdash \varphi_1} \quad \frac{\Gamma \vdash \varphi_1 \land \varphi_2}{\Gamma \vdash \varphi_2}$$

$$\frac{\Gamma \vdash \bot}{\Gamma \vdash \varphi}$$

Disjunction

  

$$\frac{\Gamma \vdash \varphi_1}{\Gamma \vdash \varphi_1 \lor \varphi_2} \quad \frac{\Gamma \vdash \varphi_2}{\Gamma \vdash \varphi_1 \lor \varphi_2}$$

$$\frac{\Gamma \vdash \varphi_1 \lor \varphi_2 \quad \Gamma, \varphi_1 \vdash \varphi \quad \Gamma, \varphi_2 \vdash \varphi}{\Gamma \vdash \varphi}$$

  

  

### Pg 2

  

  

$$\frac{\Gamma \vdash \varphi \to \psi \quad \Gamma \vdash \varphi}{\Gamma \vdash \psi} \quad \frac{\Gamma, \varphi \vdash \psi}{\Gamma \vdash \varphi \to \psi} \quad \text{implication}$$

Note that $P \lor \neg P$, $(\neg P \to P) \to P$ are NOT intuitionistically true !

$\equiv$ equivalent

  

what are "valuations" here ? $\vDash \varphi$

  

**kripke models.**

If $P$ is true in some world, then also in later worlds

  

$w \vDash \varphi_1 \lor \varphi_2$ (_$w \uparrow$ world_)

$w \vDash \varphi_1$ or $w \vDash \varphi_2$

  

likewise for "$\land$"

  

$w \vDash \varphi_1 \to \varphi_2$

if implication is true for now and in future worlds

  

_(Kripke Model Graph 1)_

  

- **Root Node:** $P \times$ | $\neg P \times$ | $P \lor \neg P \times$ (circled)
    
      
    - $\to$ **Left Node:** $P$ (circled) | $\neg P \times$ | $P \lor \neg P \checkmark$
        
          
        
    - $\to$ **Right Node:** $P \times$ | $\neg P \checkmark$ | $P \lor \neg P \checkmark$
        
          
        

_(Kripke Model Graph 2)_

  

- **Root Node:** $\neg P \times$ | $\neg P \to P \checkmark$ | $(\neg P \to P) \to P \times$ (circled)
    
      
    - $\to$ **Top Node:** $P$ (circled) | $\neg P \times$ | $\neg P \to P \checkmark$ | $(\neg P \to P) \to P \checkmark$
        
          
        

nice proof system + crazy sementics vs poor proof system + nice sementics