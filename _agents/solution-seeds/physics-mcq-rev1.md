# Solution seeds — Physics MCQ (Deb Mukherji), Revision Exercise 1

> **Purpose (hybrid ingestion, 2026-06-10).** These are the book's own "Hints and Solutions to
> Selected Questions" (book pages 1-57 → 1-62), transcribed once during the Phase-1 reading pass and
> keyed by `display_id`. The later Phase-4 physics solution pass (`physics-solution-workflow.md` +
> `scripts/math-solutions/` toolkit) should consume **this file** instead of re-opening the PDF — it
> already has every worked derivation + the diagram description. Treat each seed as the *skeleton*;
> expand into the teacher-style 6-section solution, re-deriving and checking against the uploaded figure
> for the four figure-dependent questions (NLM-167, NLM-169, NLM-175, NLM-177).
>
> Answer key (book "Answers to Revision Exercise 1", page 1-56) is baked into each seed.
> The book solves 25/26 — only R8 (COM-124) has no printed hint (trivial: CoM of any thrown rigid
> body is a projectile → parabola in all cases).

| Book | display_id | chapter | answer | needs figure |
|---|---|---|---|---|
| R1 | K2D-112 | Motion in 2D | b | — |
| R2 | COM-122 | CoM/Momentum | b | — |
| R3 | COM-123 | CoM/Momentum | a | — |
| R4 | NLM-167 | Laws of Motion | b | ✅ spring on two strings |
| R5 | NLM-168 | Laws of Motion | b | — (refers to Q96 fig) |
| R6 | NLM-169 | Laws of Motion | d | ✅ two blocks + string |
| R7 | K1D-139 | Motion in 1D | c | — |
| R8 | COM-124 | CoM/Momentum | a | — (no book hint) |
| R9 | NLM-170 | Laws of Motion | d | — |
| R10 | NLM-171 | Laws of Motion | c | — (book draws FBD) |
| R11 | COM-125 | CoM/Momentum | a | — |
| R12 | NLM-172 | Laws of Motion | c | — |
| R13 | K2D-113 | Motion in 2D | b | — (book draws compass) |
| R14 | K1D-140 | Motion in 1D | d | — (book draws v-t) |
| R15 | COM-126 | CoM/Momentum | b | — |
| R16 | NLM-173 | Laws of Motion | c | — (book draws FBD) |
| R17 | WEP-130 | Work/Power/Energy | a | — |
| R18 | WEP-131 | Work/Power/Energy | c | — |
| R19 | COM-127 | CoM/Momentum | b | — |
| R20 | NLM-174 | Laws of Motion | a | — (book draws FBD) |
| R21 | NLM-175 | Laws of Motion | d | ✅ four v-t graph options |
| R22 | K2D-114 | Motion in 2D | d | — (book draws vector tri.) |
| R23 | K2D-115 | Motion in 2D | b | — (book draws frames) |
| R24 | NLM-176 | Laws of Motion | c | — (book draws Atwood) |
| R25 | K2D-116 | Motion in 2D | d | — |
| R26 | NLM-177 | Laws of Motion | c | ✅ four force-direction options |

---

### K2D-112 (R1) — answer **b**
Resolve both into components ($z$ vertical). $\vec{v_A} = 4\hat{i} + 4\hat{k}$ (45° in $xz$, speed $4\sqrt2$). $\vec{v_B} = 3\hat{j} + 4\hat{k}$ (5 m/s at $\theta=\tan^{-1}(4/3)$ to $y$-axis in $yz$ ⇒ $y$-comp $=5\cos\theta=3$, $z$-comp $=5\sin\theta=4$). $\vec{v_{BA}} = \vec{v_B}-\vec{v_A} = -4\hat{i}+3\hat{j}$. Magnitude $=5$ m/s, lies in the $xy$ (horizontal) plane. Both particles share the same gravity ⇒ relative acceleration $=0$ ⇒ $\vec{v_{BA}}$ is **constant** ⇒ its magnitude does NOT change with time. So statement (b) is the incorrect one.

### COM-122 (R2) — answer **b**
For a head-on elastic collision, relative velocity after collision $= -$ (relative velocity before collision). This is **independent of the masses** of the particles. Hence "$\vec{v_1}=-\vec{v_2}$ only if equal mass" (b) is wrong.

### COM-123 (R3) — answer **a**
A has mass $m$, initial velocity $u$: $E_i=\tfrac12 mu^2=E$, momentum $p=mu=$ const. PE is maximum when KE is minimum — i.e. when both bodies move with the **same velocity**. Min KE $E_f=\dfrac{p^2}{2(m+nm)}$. Max PE $=E_i-E_f=\tfrac12 mu^2-\dfrac{m^2u^2}{2m(1+n)}=E\left[1-\dfrac{1}{1+n}\right]=\dfrac{nE}{n+1}$.

### NLM-167 (R4) — answer **b**  ·  FIGURE: spring held horizontally by two strings each at angle θ to vertical
$T=$ tension in each string. Vertical: $2T\cos\theta=W$. Horizontal: $T\sin\theta=kx$ ($x=$ extension). Eliminate $T$: $\left(\dfrac{W}{2\cos\theta}\right)\sin\theta=kx \Rightarrow x=\dfrac{W\tan\theta}{2k}$.

### NLM-168 (R5) — answer **b**
The forces the walls exert on the man are (a) horizontal normal reactions and (b) **friction forces acting upward**. By Newton's third law he exerts equal and opposite forces on the walls — i.e. he exerts BOTH horizontal and vertical (friction) components. So "he exerts only horizontal forces" (b) is not correct.

### NLM-169 (R6) — answer **d**  ·  FIGURE: blocks A and B on a table joined by a string, P pulls A away from B
Tension appears only when the string length tends to change, i.e. when A tends to move — which can occur only when $F_A$ reaches its limiting value $F$. Then for A: $P=F_A+T=F+T$; for B: $T=F_B$. With $P=\tfrac{3F}{2}$: $T=\tfrac{F}{2}=F_B$ and $F_A=F$.

### K1D-139 (R7) — answer **c**
Both events (headlight at the engine, taillight at the tail) occur at the same ground point ⇒ the train has advanced exactly its own length, 200 m, in the interval. $200=0+\tfrac12(0.5)t^2 \Rightarrow t^2=800 \Rightarrow t=20\sqrt2$ s.

### COM-124 (R8) — answer **a**  ·  (no printed book hint)
Once airborne the only external force on the stick is gravity, so its **centre of mass** moves exactly like a projectile — a parabola — regardless of shape, uniformity, rotation, or whether the CoM lies on the body. True in all cases.

### NLM-170 (R9) — answer **d**
$\mu=cx$ ($c$ const). Maximum acceleration $=\mu g=(cx)g$. Using $v^2=u^2+2\!\int a\,dx$ with $u=0$: $v^2=2(cgx)x=2cg\,x^2 \Rightarrow v^2\propto x^2 \Rightarrow$ KE $\propto x^2$.

### NLM-171 (R10) — answer **c**  ·  FIGURE in book: chain over pulley, sides M and (m−M)
Let the two hanging sections have masses $M$ and $(m-M)$ with $M>m/2$. With $a=$ acceleration and $T=$ tension where the chain meets the pulley: $Mg-T=Ma$ and $T-(m-M)g=(m-M)a$. Eliminating $a$: $T=2\left(1-\dfrac{M}{m}\right)Mg$. Force on the pulley $=2T$, which is **less than $mg$** since $M>m/2$.

### COM-125 (R11) — answer **a**
Time to fall $t=\sqrt{2h/g}$; impact speed $v=\sqrt{2gh}$. Each elastic bounce reverses momentum: $\Delta p=2mv$. Time between successive impacts $\Delta t=2t$. Time-averaged force $=\dfrac{\Delta p}{\Delta t}=\dfrac{2mv}{2t}=mg$. (The continuous weight is supported on average — independent of $h$.)

### NLM-172 (R12) — answer **c**
Max friction between insect and stick $=kmg$. Max accel of insect $a_1=\dfrac{kmg}{m}=kg$. The reaction drives the stick: $a_2=\dfrac{kmg}{M}$ (opposite direction). Relative accel of insect w.r.t. stick $=a_1-(-a_2)=kg\left(1+\dfrac{m}{M}\right)$. Then $L=\tfrac12 a t^2 \Rightarrow t^2=\dfrac{2L}{a}=\dfrac{2ML}{kg(M+m)}$.

### K2D-113 (R13) — answer **b**  ·  FIGURE in book: NE/NW unit vectors on a compass
$\vec{v_{AB}}=\vec{v_A}-\vec{v_B}=v\hat{i}+v\hat{j}$ with $v=\dfrac{V}{\sqrt2}$ (NE). $\vec{v_{BC}}=\vec{v_B}-\vec{v_C}=-v\hat{i}+v\hat{j}$ (NW). $\vec{v_{CA}}=\vec{v_C}-\vec{v_A}=-(\vec{v_{AB}}+\vec{v_{BC}})=-2v\hat{j}$ ⇒ C moves toward the **south** as seen by A.

### K1D-140 (R14) — answer **d**  ·  FIGURE in book: v–t triangle OAB with alternative curve OCB
The simplest motion is the triangle OAB; area under $v$–$t$ = displacement = 1, so $\tfrac{V}{2}=1\Rightarrow V=2$, giving slope of OA $=\dfrac{V}{1/2}=4$ ⇒ $\alpha=4$ on OA. But any other curve (e.g. OCB) also satisfies area $=1$; its slope (=$\alpha$) can be made arbitrarily large near the ends, so **no upper limit on $|\alpha|$ can be set** from the data. Hence (d) "$|\alpha|$ cannot be less than $\tfrac12$" is the incorrect statement. (α must change sign — true; $|\alpha|\ge4$ somewhere — true; can't set an upper limit — true.)

### COM-126 (R15) — answer **b**
Momentum of (man + car) $=(m+M)V=$ const. Let $v_M,v_C$ be the ground velocities of man and car; the man runs at $u=v_M-v_C$ relative to the car. Conservation: $(m+M)V=m v_M+M v_C$. Sub $v_M=v_C+u$ and solve: $v_C=V-\dfrac{mu}{m+M}$.

### NLM-173 (R16) — answer **c**  ·  FIGURE in book: body on sphere, ∠θ from top, N, mg, F
Constant speed ⇒ equilibrium along and perpendicular to the surface. Normal: $mg\cos\theta=N$. Along surface: $mg\sin\theta=F=\mu N=\mu mg\cos\theta \Rightarrow \mu=\tan\theta$.

### WEP-130 (R17) — answer **a**
Let $x=$ max compression. Energy conservation (smooth floor): $\tfrac12 kx^2=\tfrac12 mv^2 \Rightarrow x=v\sqrt{m/k}$. Maximum spring force $=kx=v\sqrt{mk}$ (equals the force transmitted to the wall).

### WEP-131 (R18) — answer **c**
$s=kt^3 \Rightarrow v=\dot s=3kt^2,\ a=\dot v=6kt,\ F=ma=6mkt$. Power $P=Fv=(6mkt)(3kt^2)=18mk^2t^3 \propto t^3$.

### COM-127 (R19) — answer **b**
Let $v=$ horizontal velocity of the shell, $T=$ total flight time, so range $vT=2$ km. At the highest point the shell splits into two equal parts; one falls vertically (no horizontal velocity), so by momentum conservation the other gets horizontal velocity $2v$. Its remaining flight time is $T/2$, so it travels a further $(2v)(T/2)=vT=2$ km beyond the apex (which is at 1 km) ⇒ it lands **3 km** from the cannon.

### NLM-174 (R20) — answer **a**  ·  FIGURE in book: 2m block on table, hanging part over pulley
At the point of sliding, hanging weight = limiting friction on the part on the table. With uniform chain (linear density $\lambda$), hanging length $L/3$, on-table length $2L/3$: $\lambda(L/3)g=\mu\,\lambda(2L/3)g \Rightarrow \mu=\dfrac{1}{2}$.

### NLM-175 (R21) — answer **d**  ·  FIGURE: four v–t graphs (options a–d)
The block stays at rest until the linearly-growing applied force reaches the limiting friction — that happens at some $t>0$, so $v$ stays $0$ then rises. Because the net force keeps increasing, acceleration increases ⇒ $v$–$t$ is an upward-**curving** graph that takes off only after a delay. That is option (d).

### K2D-114 (R22) — answer **d**  ·  FIGURE in book: velocity-change vector triangle
$\vec{v_i}=V\hat{i}$, $\vec{v_f}=V\cos\theta\,\hat{i}+V\sin\theta\,\hat{j}$. $\Delta\vec{v}=\vec{v_f}-\vec{v_i}=V(\cos\theta-1)\hat{i}+V\sin\theta\,\hat{j}$. $|\Delta\vec v|=\sqrt{[V(\cos\theta-1)]^2+(V\sin\theta)^2}=2V\sin\tfrac{\theta}{2}$. Its direction: $\tan\phi=\dfrac{V\sin\theta}{V(\cos\theta-1)}=-\cot\tfrac{\theta}{2}=\tan\!\left(\tfrac{\pi}{2}+\tfrac{\theta}{2}\right)\Rightarrow\phi=\tfrac{\pi}{2}+\tfrac{\theta}{2}$. So (a),(b),(c) are correct; (d) is wrong — $\Delta\vec v=\vec{v_f}-\vec{v_i}$, not the negative of the resultant of the two.

### K2D-115 (R23) — answer **b**
With position vectors $\vec{r_1}=\vec r+\vec{r_2}$ (object in $F_1$ = $F_2$-origin in $F_1$ + object in $F_2$), differentiate: $\vec{v_1}=\vec v+\vec{v_2}\Rightarrow \vec{v_2}=\vec{v_1}-\vec v$.

### NLM-176 (R24) — answer **c**  ·  FIGURE in book: Atwood, m up, M down
$Mg-T=Ma,\ T-mg=ma \Rightarrow a=\dfrac{M-m}{M+m}g$. $T=mg+ma=mg\!\left[1+\dfrac{M-m}{M+m}\right]=\dfrac{2mMg}{M+m}=\dfrac{2mg}{1+m/M}\approx 2mg$ since $M\gg m$.

### K2D-116 (R25) — answer **d**
$y=bx^2$. Differentiate: $\dot y=2bx\dot x$; again $\ddot y=a=2b\dot x^2+2bx\ddot x$. There is no $x$-acceleration ($\ddot x=0$, constant $x$-velocity), so $a=2b\dot x^2 \Rightarrow \dot x=\sqrt{a/2b}$ (constant).

### NLM-177 (R26) — answer **c**  ·  FIGURE: four bow-bend force-direction options
For the bent stick to be in equilibrium the **net force on it must be zero**. The two end forces the hands apply must therefore be equal, opposite, and oriented so they sum to zero (and provide the bending couple) — the configuration shown in option (c).
