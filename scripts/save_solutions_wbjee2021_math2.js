require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const R = String.raw;

const UPDATES = {
  // Q41 — book #41
  'PRBL-120': R`🎯
- Parabola $ y^2 = x$. Three normals are drawn from the point $ (d, 0)$ on the X-axis. Find the condition on $ d$.

💡 For $ y^2 = 4ax$, three distinct normals can be drawn from a point $ (h, 0)$ on the axis only when $ h > 2a$.

✏️
Write $ y^2 = x$ in standard form $ y^2 = 4ax$, so $ 4a = 1$, giving $ a = \frac{1}{4}$.

Condition for three normals from $ (d, 0)$:
$ d > 2a = 2 \cdot \frac{1}{4} = \frac{1}{2}$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q42 — book #42
  'TDGM-308': R`🎯
- From $ P(a, b, c)$, perpendiculars $ PA$ and $ PB$ are dropped onto the $ YZ$-plane and $ ZX$-plane. Find the equation of plane $ OAB$ ($ O$ = origin).

💡 The foot of perpendicular onto a coordinate plane keeps the two coordinates of that plane and zeroes the third.

✏️
Foot on $ YZ$-plane: $ A = (0, b, c)$.
Foot on $ ZX$-plane: $ B = (a, 0, c)$.

Plane $ OAB$ passes through the origin, so its normal is $ \vec{OA} \times \vec{OB}$:
$ \begin{vmatrix} \hat{i} & \hat{j} & \hat{k} \\ 0 & b & c \\ a & 0 & c \end{vmatrix} = \hat{i}(bc - 0) - \hat{j}(0 - ac) + \hat{k}(0 - ab) = bc\,\hat{i} + ca\,\hat{j} - ab\,\hat{k}$.

Equation of plane through origin with this normal:
$ bcx + cay - abz = 0$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q43 — book #43
  'ELPS-095': R`🎯
- Ellipse $ x^2 + 2y^2 = 4$. Find the point on its auxiliary circle corresponding to the point on the ellipse with eccentric angle $ 60°$.

💡 The point on the ellipse is $ (a\cos\theta, b\sin\theta)$; the corresponding point on the auxiliary circle is $ (a\cos\theta, a\sin\theta)$.

✏️
Write the ellipse as $ \frac{x^2}{4} + \frac{y^2}{2} = 1$, so $ a^2 = 4$, $ a = 2$.

Auxiliary circle: $ x^2 + y^2 = 4$ (radius $ a = 2$).

Point on auxiliary circle at eccentric angle $ 60°$:
$ (2\cos 60°, 2\sin 60°) = \left(2 \cdot \frac{1}{2},\ 2 \cdot \frac{\sqrt{3}}{2}\right) = (1, \sqrt{3})$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q44 — book #44
  'CRCL-136': R`🎯
- A variable circle always touches two given fixed circles externally. Find the locus of its centre.

💡 If a circle of radius $ r$ touches two fixed circles externally, the difference of its distances from the two fixed centres is constant — the definition of a hyperbola.

✏️
Let the variable circle have centre $ C$, radius $ r$; the fixed circles have centres $ C_1, C_2$ and radii $ r_1, r_2$.

External contact gives:
$ CC_1 = r + r_1$ and $ CC_2 = r + r_2$.

Subtracting:
$ CC_2 - CC_1 = (r + r_2) - (r + r_1) = r_2 - r_1 = \text{constant}$.

A constant difference of distances from two fixed points is a hyperbola.

$\boxed{\text{Answer: (b)}}$
`,

  // Q45 — book #45
  'TDGM-309': R`🎯
- A line with positive direction cosines, equally inclined to the axes, passes through $ P(2, -1, 2)$ and meets the plane $ 2x + y + z = 9$ at $ Q$. Find $ PQ$.

💡 Equal angles with the axes means the direction cosines are all equal: $ \ell = m = n = \frac{1}{\sqrt{3}}$.

✏️
From $ \ell^2 + m^2 + n^2 = 1$ with $ \ell = m = n$: $ 3\ell^2 = 1 \Rightarrow \ell = \frac{1}{\sqrt{3}}$.

Line through $ P(2, -1, 2)$:
$ x = k + 2,\quad y = k - 1,\quad z = k + 2$ (using parameter $ k$).

Substitute into the plane $ 2x + y + z = 9$:
$ 2(k + 2) + (k - 1) + (k + 2) = 9 \Rightarrow 4k + 5 = 9 \Rightarrow k = 1$.

So $ Q = (3, 0, 3)$, and
$ PQ = \sqrt{(3-2)^2 + (0+1)^2 + (3-2)^2} = \sqrt{1 + 1 + 1} = \sqrt{3}$ units.

$\boxed{\text{Answer: (c)}}$
`,

  // Q46 — book #46
  'ITF-069': R`🎯
- For $ y = \sin^{-1}\left\{\frac{5x + 12\sqrt{1 - x^2}}{13}\right\}$, find $ (a, b)$ such that $ a(1 - x^2)y_2 + bxy_1 = 0$.

💡 Split the bracket so it becomes $ \sin(\theta_1 + \theta_2)$, which collapses $ y$ to a simple inverse-sine plus a constant angle.

✏️
Write $ y = \sin^{-1}\left\{\frac{5}{13}x + \frac{12}{13}\sqrt{1 - x^2}\right\}$.

Let $ \sin\theta_1 = \frac{5}{13}$ (so $ \cos\theta_1 = \frac{12}{13}$) and $ \cos\theta_2 = x$ (so $ \sin\theta_2 = \sqrt{1 - x^2}$). Then the bracket is $ \sin\theta_1\cos\theta_2 + \cos\theta_1\sin\theta_2 = \sin(\theta_1 + \theta_2)$, so
$ y = \theta_1 + \theta_2 = \sin^{-1}\frac{5}{13} + \cos^{-1}x$.

Differentiate:
$ y_1 = -\frac{1}{\sqrt{1 - x^2}}$.

Differentiate again:
$ y_2 = -\frac{x}{(1 - x^2)\sqrt{1 - x^2}}$, which gives $ y_2(1 - x^2) = x y_1$.

So $ (1 - x^2)y_2 - x y_1 = 0$, i.e. $ a = 1$, $ b = -1$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q47 — book #47
  'FUNC-184': R`🎯
- Given $ 2f(x) + 3f(-x) = 15 - 4x$ for all real $ x$. Find $ f(2)$.

💡 Replace $ x$ with $ -x$ to get a second equation, then solve the two linear equations for $ f(x)$.

✏️
Given: $ 2f(x) + 3f(-x) = 15 - 4x$ … (i)

Replace $ x$ by $ -x$:
$ 2f(-x) + 3f(x) = 15 + 4x$ … (ii)

Solve (i) and (ii) [multiply suitably and subtract]:
$ f(x) = 4x + 3$.

Therefore $ f(2) = 4 \cdot 2 + 3 = 11$.

$\boxed{\text{Answer: (c)}}$
`,

  // Q48 — book #48
  'FUNC-185': R`🎯
- Functions $ f_1(x) = x$ and $ f_2(x) = 2 + \log_e x$ ($ x > 0$). Find where their graphs intersect.

💡 Study the sign of $ h(x) = f_2(x) - f_1(x)$ at key points; sign changes locate the roots.

✏️
Let $ h(x) = f_2(x) - f_1(x) = (2 + \log_e x) - x = 2 + \log_e x - x$.

Check the sign:
$ h(0^+) < 0$, $ h(1) = 1 > 0$, $ h(e) = 3 - e > 0$, $ h(e^2) = 4 - e^2 < 0$, and $ h(x) < 0$ for all $ x \ge e^2$.

So $ h$ changes sign in $ (0, 1)$ and again in $ (e, e^2)$ — two intersections, one in each interval.

$\boxed{\text{Answer: (c)}}$
`,

  // Q49 — book #49
  'QUAD-143': R`🎯
- Find the number of real roots of $ 6^x + 8^x = 10^x$.

💡 Divide through by $ 10^x$ to turn it into $ (\sin\theta)^x + (\cos\theta)^x = 1$, a form with exactly one solution.

✏️
Divide by $ 10^x$:
$ \left(\frac{6}{10}\right)^x + \left(\frac{8}{10}\right)^x = 1 \Rightarrow \left(\frac{3}{5}\right)^x + \left(\frac{4}{5}\right)^x = 1$.

Since $ \left(\frac{3}{5}\right)^2 + \left(\frac{4}{5}\right)^2 = 1$, set $ \frac{3}{5} = \sin\theta$, $ \frac{4}{5} = \cos\theta$:
$ (\sin\theta)^x + (\cos\theta)^x = 1$.

Each term is a strictly decreasing function of $ x$, so the sum equals $ 1$ for exactly one value, $ x = 2$.

Hence exactly one real root.

$\boxed{\text{Answer: (c)}}$
`,

  // Q50 — book #50
  'CTDF-118': R`🎯
- $ f : D \to R$, $ D = [0, 1] \cup [2, 4]$, with $ f(x) = x$ on $ [0,1]$ and $ f(x) = 4 - x$ on $ [2,4]$. Is Rolle's theorem applicable?

💡 Rolle's theorem needs the function to be continuous and differentiable on a single closed interval — here the domain is split into two disconnected pieces.

✏️
On $ [0, 1]$, $ f(x) = x$ is increasing; on $ [2, 4]$, $ f(x) = 4 - x$ is decreasing.

The domain $ D = [0,1] \cup [2,4]$ is not a single interval — there is a gap $ (1, 2)$ where $ f$ is undefined, so $ f$ is neither continuous nor differentiable throughout $ D$.

Therefore Rolle's theorem is not applicable to $ f$ in $ D$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q51 — book #51
  'DFIN-256': R`🎯
- $ f(x)$ is a continuous periodic function with period $ T$. For $ I = \int_{a}^{a+T} f(x)\, dx$, determine how $ I$ depends on $ a$.

💡 The integral of a periodic function over any one full period is the same regardless of where the period starts.

✏️
For a function with period $ T$:
$ I = \int_{a}^{a + T} f(x)\, dx = \int_{0}^{T} f(x)\, dx$.

The right side has no $ a$ in it, so the value is fixed.

Hence $ I$ does not depend on $ 'a'$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q52 — book #52
  'DFIN-257': R`🎯
- Given $ b = \int_{0}^{1} \frac{e^t}{t+1}\, dt$. Evaluate $ \int_{a-1}^{a} \frac{e^{-t}}{t - a - 1}\, dt$.

💡 Use the king's rule $ \int_a^b f(x)\,dx = \int_a^b f(a+b-x)\,dx$, then substitute to reduce the integral back to $ b$.

✏️
Let $ I = \int_{a-1}^{a} \frac{e^{-t}}{t - a - 1}\, dt$.

Apply $ f(t) \to f(a + (a-1) - t) = f(2a - 1 - t)$:
$ I = \int_{a-1}^{a} \frac{e^{-(2a - 1 - t)}}{(2a - 1 - t) - a - 1}\, dt = \int_{a-1}^{a} \frac{e^{t - 2a + 1}}{a - 2 - t}\, dt$.

Put $ t - (a - 1) = x \Rightarrow dt = dx$; limits become $ 0$ to $ 1$:
$ I = \int_{0}^{1} \frac{e^{x - a}}{-(x + 1)}\, dx = -e^{-a}\int_{0}^{1} \frac{e^{x}}{x + 1}\, dx = -e^{-a}\, b$.

So $ I = -b\,e^{-a}$.

$\boxed{\text{Answer: (c)}}$
`,

  // Q53 — book #53
  'DIFF-055': R`🎯
- Find the differential of $ f(x) = \log_e(1 + e^{10x}) - \tan^{-1}(e^{5x})$ at $ x = 0$ for $ dx = 0.2$.

💡 The differential is $ df = f'(x)\,dx$; compute $ f'(0)$ then multiply by $ dx$.

✏️
$ f'(x) = \frac{10e^{10x}}{1 + e^{10x}} - \frac{5e^{5x}}{1 + e^{10x}} = \frac{10e^{10x} - 5e^{5x}}{1 + e^{10x}}$.

At $ x = 0$:
$ f'(0) = \frac{10 - 5}{1 + 1} = \frac{5}{2}$.

Differential:
$ df = f'(0)\,dx = \frac{5}{2} \times 0.2 = 0.5$.

$\boxed{\text{Answer: (a)}}$
`,

  // Q54 — book #54
  'FUNC-186': R`🎯
- $ f : [1, \infty) \to R$, $ f(x) = 1 + \sqrt{x}$. How many fixed points ($ f(c) = c$) does it have?

💡 A fixed point satisfies $ f(c) = c$; solve the resulting equation and keep only roots inside the domain.

✏️
Set $ f(c) = c$:
$ 1 + \sqrt{c} = c \Rightarrow \sqrt{c} = c - 1$.

Square: $ c = (c - 1)^2 = c^2 - 2c + 1 \Rightarrow c^2 - 3c + 1 = 0$.

$ c = \frac{3 \pm \sqrt{5}}{2}$.

Only $ c = \frac{3 + \sqrt{5}}{2} \approx 2.62$ lies in $ [1, \infty)$ and satisfies $ \sqrt{c} = c - 1 \ge 0$ (the other root is less than $ 1$ and fails the square-root sign).

So $ f$ has a unique fixed point.

$\boxed{\text{Answer: (b)}}$
`,

  // Q55 — book #55
  'LIMS-109': R`🎯
- Evaluate $ \lim_{x \to \infty}\left(\frac{3x - 1}{3x + 1}\right)^{4x}$.

💡 This is a $ 1^{\infty}$ form; use $ \lim e^{(\text{base}-1)\cdot\text{power}}$.

✏️
$ L = \lim_{x \to \infty}\left(\frac{3x - 1}{3x + 1}\right)^{4x} = e^{\lim_{x \to \infty}\left(\frac{3x-1}{3x+1} - 1\right)4x}$.

Compute the exponent:
$ \frac{3x - 1}{3x + 1} - 1 = \frac{(3x - 1) - (3x + 1)}{3x + 1} = \frac{-2}{3x + 1}$.

So exponent $ = \lim_{x \to \infty} \frac{-2 \cdot 4x}{3x + 1} = \lim_{x \to \infty} \frac{-8x}{3x + 1} = -\frac{8}{3}$.

Hence $ L = e^{-8/3}$.

$\boxed{\text{Answer: (c)}}$
`,

  // Q56 — book #56
  'AUC-133': R`🎯
- Find the area bounded by $ y = 4x^2$, $ y = \frac{x^2}{9}$ and the line $ y = 2$.

💡 Integrate with respect to $ y$ across the symmetric region; for each $ y$ the horizontal strip runs between the two parabolas.

✏️
Solve each parabola for $ x \ge 0$: from $ y = 4x^2$, $ x = \frac{\sqrt{y}}{2}$; from $ y = \frac{x^2}{9}$, $ x = 3\sqrt{y}$.

By symmetry about the Y-axis, area $ = 2\int_{0}^{2}\left(3\sqrt{y} - \frac{\sqrt{y}}{2}\right) dy = 2\int_{0}^{2} \frac{5\sqrt{y}}{2}\, dy$.

$ = 5\int_{0}^{2} y^{1/2}\, dy = 5 \cdot \frac{2}{3}\left[y^{3/2}\right]_0^2 = \frac{10}{3}\left[2^{3/2}\right] = \frac{10}{3}\cdot 2\sqrt{2} = \frac{20\sqrt{2}}{3}$ sq units.

$\boxed{\text{Answer: (a)}}$
`,

  // Q57 — book #57
  'VCAL-217': R`🎯
- Given $ a(\alpha \times \beta) + b(\beta \times \gamma) + c(\gamma \times \alpha) = 0$ with non-zero scalars $ a, b, c$. What is the relation among $ \alpha, \beta, \gamma$?

💡 A non-trivial linear dependence among the cross products forces the three vectors into one plane.

✏️
The vectors $ (\alpha \times \beta)$, $ (\beta \times \gamma)$, $ (\gamma \times \alpha)$ are linearly dependent (their weighted sum with non-zero $ a, b, c$ is zero).

That dependence holds exactly when $ \alpha, \beta, \gamma$ are coplanar.

$\boxed{\text{Answer: (c)}}$
`,

  // Q58 — book #58
  'AODV-220': R`🎯
- The tangent at $ P(h, k)$ on $ y^2 = 2x^3$ is perpendicular to the line $ 4x = 3y$. Find $ (h, k)$.

💡 Slope of the curve at $ P$ times the slope of the given line $ = -1$; combine with the fact that $ P$ lies on the curve.

✏️
Differentiate $ y^2 = 2x^3$: $ 2y\frac{dy}{dx} = 6x^2 \Rightarrow \frac{dy}{dx} = \frac{3x^2}{y}$. At $ P$: slope $ = \frac{3h^2}{k}$.

The line $ 4x = 3y$ has slope $ \frac{4}{3}$. Perpendicularity:
$ \frac{3h^2}{k}\cdot\frac{4}{3} = -1 \Rightarrow 4h^2 = -k$ … (i)

$ P$ on curve: $ k^2 = 2h^3$ … (ii)

From (i), $ k = -4h^2$; substitute into (ii): $ (4h^2)^2 = 2h^3 \Rightarrow 16h^4 = 2h^3 \Rightarrow h = \frac{1}{8}$.

Then $ k = -4\left(\frac{1}{8}\right)^2 = -4 \cdot \frac{1}{64} = -\frac{1}{16}$.

So $ (h, k) = \left(\frac{1}{8}, -\frac{1}{16}\right)$ only.

$\boxed{\text{Answer: (b)}}$
`,

  // Q59 — book #59
  'BNML-214': R`🎯
- Find the coefficient of $ a^3 b^4 c^5$ in $ (bc + ca + ab)^6$.

💡 Use the multinomial general term and match the exponents of $ a, b, c$.

✏️
General term of $ (bc + ca + ab)^6$:
$ \frac{6!}{p!\,q!\,r!}(bc)^p (ca)^q (ab)^r = \frac{6!}{p!\,q!\,r!}\, a^{q+r}\, b^{p+r}\, c^{p+q}$,
with $ p + q + r = 6$.

Match $ a^3 b^4 c^5$:
$ q + r = 3,\quad p + r = 4,\quad p + q = 5$.

Adding all three: $ 2(p + q + r) = 12 \Rightarrow p + q + r = 6$ (consistent), and solving: $ p = 3,\ q = 2,\ r = 1$.

Coefficient $ = \frac{6!}{3!\,2!\,1!} = \frac{720}{12} = 60$, which the book writes equivalently as $ 3\left(\frac{6!}{3!\,3!}\right) = 3 \cdot 20 = 60$.

$\boxed{\text{Answer: (c)}}$
`,

  // Q60 — book #60
  'SQSR-256': R`🎯
- $ a, b, c$ (positive, unequal) are in G.P., and $ \log\frac{5c}{2a}$, $ \log\frac{7b}{5c}$, $ \log\frac{2a}{7b}$ are in A.P. What kind of triangle do $ a, b, c$ form?

💡 G.P. gives $ b^2 = ac$; the A.P. condition gives a second relation between the sides — solve and test the triangle type.

✏️
G.P.: $ b^2 = ac$.

A.P. of the logs: $ 2\log\frac{7b}{5c} = \log\frac{5c}{2a} + \log\frac{2a}{7b}$, so
$ \frac{49b^2}{25c^2} = \frac{5c}{2a}\cdot\frac{2a}{7b} = \frac{5c}{7b} \Rightarrow (7b)^3 = (5c)^3 \Rightarrow 7b = 5c \Rightarrow c = \frac{7}{5}b$.

From $ b^2 = ac$: $ b^2 = a\cdot\frac{7}{5}b \Rightarrow b = \frac{7}{5}a$, so $ a = \frac{5b}{7}$.

Sides: $ a = \frac{5b}{7}$, $ b$, $ c = \frac{7b}{5}$ — three different lengths.

Check: largest side $ c = 1.4b$; sum of other two $ = \frac{5b}{7} + b \approx 1.71b > c$, so it is a valid triangle with all sides unequal → scalene.

$\boxed{\text{Answer: (c)}}$
`,

  // Q61 — book #61
  'DTRM-163': R`🎯
- Determine the divisibility of $ \begin{vmatrix} a^2 + 10 & ab & ac \\ ab & b^2 + 10 & bc \\ ac & bc & c^2 + 10 \end{vmatrix}$.

💡 Factor $ a, b, c$ out of the rows, regroup, then use row operations to expose a factor of $ 100$.

✏️
Multiply/divide to factor $ a, b, c$ out of $ R_1, R_2, R_3$ (and compensate by $ \frac{1}{abc}$ after pulling $ a, b, c$ from the columns) — the determinant reduces to
$ (a^2 + b^2 + c^2 + 10)\begin{vmatrix} 1 & b^2 & c^2 \\ 1 & b^2 + 10 & c^2 \\ 1 & b^2 & c^2 + 10 \end{vmatrix}$ after applying $ C_1 \to C_1 + C_2 + C_3$.

Now $ R_2 \to R_2 - R_1$ and $ R_3 \to R_3 - R_1$:
$ (a^2 + b^2 + c^2 + 10)\begin{vmatrix} 1 & b^2 & c^2 \\ 0 & 10 & 0 \\ 0 & 0 & 10 \end{vmatrix} = (a^2 + b^2 + c^2 + 10)(100)$.

The factor $ 100$ shows the determinant is divisible by $ 100$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q62 — book #62
  'STRL-098': R`🎯
- $ S = \{(x, y) : y = x + 1, 0 < x < 2\}$ and $ T = \{(x, y) : x - y \in \mathbb{Z}\}$. Which is an equivalence relation?

💡 Test each relation for reflexivity, symmetry and transitivity.

✏️
For $ S$: reflexive needs $ (x, x) \in S$, i.e. $ x = x + 1$, which is false. So $ S$ is not reflexive → not an equivalence relation.

For $ T$ ($ x - y$ an integer):
- Reflexive: $ x - x = 0 \in \mathbb{Z}$ ✓
- Symmetric: if $ x - y \in \mathbb{Z}$ then $ y - x \in \mathbb{Z}$ ✓
- Transitive: if $ x - y \in \mathbb{Z}$ and $ y - z \in \mathbb{Z}$ then $ (x - y) + (y - z) = x - z \in \mathbb{Z}$ ✓

So $ T$ is an equivalence relation but $ S$ is not.

$\boxed{\text{Answer: (b)}}$
`,

  // Q63 — book #63
  'TDGM-310': R`🎯
- The plane $ \ell x + my = 0$ is rotated about its line of intersection with $ z = 0$ through angle $ \alpha$. Find the new equation.

💡 The rotated plane is $ \ell x + my + nz = 0$; find $ n$ from the angle between the original and rotated planes.

✏️
Common line of $ P_1: \ell x + my = 0$ and $ P_2: z = 0$. The rotated plane through this line is
$ P_3: \ell x + my + nz = 0$.

Angle $ \alpha$ between $ P_1$ and $ P_3$:
$ \cos\alpha = \frac{\ell^2 + m^2}{\sqrt{\ell^2 + m^2}\,\sqrt{\ell^2 + m^2 + n^2}} = \sqrt{\frac{\ell^2 + m^2}{\ell^2 + m^2 + n^2}}$.

So $ \cos^2\alpha = \frac{\ell^2 + m^2}{\ell^2 + m^2 + n^2}$, giving $ \sec^2\alpha = 1 + \frac{n^2}{\ell^2 + m^2}$, hence
$ n^2 = \tan^2\alpha\,(\ell^2 + m^2) \Rightarrow n = \pm\tan\alpha\sqrt{\ell^2 + m^2}$.

Equation: $ \ell x + my \pm z\tan\alpha\sqrt{\ell^2 + m^2} = 0$.

$\boxed{\text{Answer: (d)}}$
`,

  // Q64 — book #64
  'ELPS-096': R`🎯
- The intersection points of $ x^2 + 2y^2 - 6x - 12y + 20 = 0$ and $ 2x^2 + y^2 - 10x - 6y + 15 = 0$ lie on a circle. Find its centre.

💡 The family $ E_1 + \lambda E_2 = 0$ passes through the intersection points; choose $ \lambda$ to make it a circle (equal $ x^2$, $ y^2$ coefficients).

✏️
Form $ (x^2 + 2y^2 - 6x - 12y + 20) + \lambda(2x^2 + y^2 - 10x - 6y + 15) = 0$:
$ (1 + 2\lambda)x^2 + (2 + \lambda)y^2 - (6 + 10\lambda)x - (12 + 6\lambda)y + (20 + 15\lambda) = 0$.

For a circle the $ x^2$ and $ y^2$ coefficients are equal:
$ 1 + 2\lambda = 2 + \lambda \Rightarrow \lambda = 1$.

Substitute $ \lambda = 1$:
$ 3x^2 + 3y^2 - 16x - 18y + 35 = 0$.

Centre $ = \left(\frac{16}{2\cdot 3}, \frac{18}{2\cdot 3}\right) = \left(\frac{8}{3}, 3\right)$.

$\boxed{\text{Answer: (c)}}$
`,

  // Q65 — book #65
  'DFIN-258': R`🎯
- Bound the integral $ I = \int_{\pi/4}^{\pi/3} \frac{\sin x}{x}\, dx$.

💡 $ \frac{\sin x}{x}$ is decreasing on this interval, so its values lie between the endpoint values; multiply by the interval length.

✏️
Let $ f(x) = \frac{\sin x}{x}$, decreasing on $ \left[\frac{\pi}{4}, \frac{\pi}{3}\right]$, so
$ f\!\left(\frac{\pi}{3}\right) \le f(x) \le f\!\left(\frac{\pi}{4}\right)$, i.e. $ \frac{3\sqrt{3}}{2\pi} \le f(x) \le \frac{2\sqrt{2}}{\pi}$.

Integrate over the interval of length $ \frac{\pi}{3} - \frac{\pi}{4} = \frac{\pi}{12}$:
$ \frac{3\sqrt{3}}{2\pi}\cdot\frac{\pi}{12} \le I \le \frac{2\sqrt{2}}{\pi}\cdot\frac{\pi}{12}$.

$ \frac{3\sqrt{3}}{24} \le I \le \frac{2\sqrt{2}}{12} \Rightarrow \frac{\sqrt{3}}{8} \le I \le \frac{\sqrt{2}}{6}$.

$\boxed{\text{Answer: (a)}}$
`,

  // Q66 — book #66 (MCQ: b, c)
  'CMPL-169': R`🎯
- Given $ |z + i| - |z - 1| = |z| - 2 = 0$. Find $ z$.

💡 $ |z| = 2$ is a circle; $ |z + i| = |z - 1|$ is the perpendicular bisector of the points $ -i$ and $ 1$ — intersect them.

✏️
From $ |z| - 2 = 0$: $ |z| = 2 \Rightarrow x^2 + y^2 = 4$ … (ii)

From $ |z + i| = |z - 1|$:
$ x^2 + (y + 1)^2 = (x - 1)^2 + y^2 \Rightarrow 2y + 1 = -2x + 1 \Rightarrow y = -x$ … (i)

Substitute (i) into (ii): $ x^2 + x^2 = 4 \Rightarrow x = \pm\sqrt{2}$, with $ y = \mp\sqrt{2}$.

So $ z = \sqrt{2} - \sqrt{2}\,i = \sqrt{2}(1 - i)$ or $ z = -\sqrt{2} + \sqrt{2}\,i = \sqrt{2}(-1 + i)$.

$\boxed{\text{Answer: (b), (c)}}$
`,

  // Q67 — book #67
  'DTRM-164': R`🎯
- For how many values of $ x$ is $ \begin{vmatrix} x & 3x+2 & 2x-1 \\ 2x-1 & 4x & 3x+1 \\ 7x-2 & 17x+6 & 12x-1 \end{vmatrix} = 0$?

💡 A single row operation can collapse a whole row to zeros, making the determinant identically zero for every $ x$.

✏️
Apply $ R_3 \to R_3 - 3R_1 - 2R_2$:

Row 3 becomes:
$ (7x-2) - 3x - 2(2x-1) = 7x - 2 - 3x - 4x + 2 = 0$,
$ (17x+6) - 3(3x+2) - 2(4x) = 17x + 6 - 9x - 6 - 8x = 0$,
$ (12x-1) - 3(2x-1) - 2(3x+1) = 12x - 1 - 6x + 3 - 6x - 2 = 0$.

So $ R_3 \equiv (0, 0, 0)$, making the determinant $ 0$ for every $ x$.

Hence it holds for infinitely many values of $ x$.

$\boxed{\text{Answer: (d)}}$
`,

  // Q68 — book #68
  'SQSR-257': R`🎯
- Find the remainder when $ 7^{7^{7^{\cdots^{7}}}}$ (a tower of $ 22$ sevens) is divided by $ 48$.

💡 $ 7^2 = 49 = 48 + 1$, so even powers of $ 7$ leave remainder $ 1$; the tower's exponent is odd, so write the power as $ 2m + 1$.

✏️
The exponent $ 7^{7^{\cdots}}$ is itself an odd number, so the whole expression is $ 7^{(2m + 1)}$ for some integer $ m$.

$ 7^{2m + 1} = (7^2)^m \cdot 7 = 49^m \cdot 7 = (48 + 1)^m \cdot 7$.

By the binomial expansion, $ (48 + 1)^m = 1 + 48k$, so
$ 7^{2m+1} = 7(1 + 48k) = 7 + 48(7k)$.

The remainder on division by $ 48$ is $ 7$.

$\boxed{\text{Answer: (b)}}$
`,

  // Q69 — book #69 (MCQ: c, d)
  'DFIN-259': R`🎯
- Which substitutions are valid/invalid for $ I_1 = \int_{-2}^{2}\frac{dx}{4 + x^2}$ and $ I_2 = \int_{0}^{1}\sqrt{x^2 + 1}\, dx$?

💡 A substitution is only valid if it stays continuous and one-to-one over the whole interval of integration.

✏️
For $ I_1 = \int_{-2}^{2}\frac{dx}{4 + x^2}$: putting $ x = \frac{1}{t}$ is invalid because $ x = 0$ lies in the interval and would make $ t$ infinite — so it is NOT possible to put $ x = \frac{1}{t}$ (option d is correct; option a, which claims it IS possible, is wrong).

For $ I_2 = \int_{0}^{1}\sqrt{x^2 + 1}\, dx$: putting $ x = \sec t$ requires $ |x| \ge 1$, but here $ x$ ranges over $ [0, 1)$, so $ x = \sec t$ is NOT valid (option b, claiming it IS possible, is wrong). Likewise $ x = \mathrm{cosec}\,\theta$ needs $ |x| \ge 1$ and is not possible here (option c, stating it is NOT possible, is correct).

Hence options (c) and (d) are correct.

$\boxed{\text{Answer: (c), (d)}}$
`,

  // Q70 — book #70 (MCQ: a, c)
  'TDGM-311': R`🎯
- A plane meets the axes at $ A, B, C$ so that the centroid of $ \triangle ABC$ is $ (1, r, r^2)$. The plane passes through $ (5, 5, -12)$. Find $ r$.

💡 Intercept form $ \frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1$; the centroid is $ \left(\frac{a}{3}, \frac{b}{3}, \frac{c}{3}\right)$.

✏️
Centroid $ = \left(\frac{a}{3}, \frac{b}{3}, \frac{c}{3}\right) = (1, r, r^2)$, so $ a = 3$, $ b = 3r$, $ c = 3r^2$.

Plane: $ \frac{x}{3} + \frac{y}{3r} + \frac{z}{3r^2} = 1$. Pass through $ (5, 5, -12)$:
$ \frac{5}{3} + \frac{5}{3r} - \frac{12}{3r^2} = 1$.

Multiply by $ 3r^2$:
$ 5r^2 + 5r - 12 = 3r^2 \Rightarrow 2r^2 + 5r - 12 = 0 \Rightarrow (2r - 3)(r + 4) = 0$.

So $ r = \frac{3}{2}$ or $ r = -4$.

$\boxed{\text{Answer: (a), (c)}}$
`,

  // Q71 — book #71
  'CRCL-137': R`🎯
- $ P$ moves on a circle $ C$; $ Q$ is a fixed point outside $ C$; $ R$ is the midpoint of $ PQ$. Find the locus of $ R$.

💡 The midpoint of a fixed point and a point on a circle traces a scaled, shifted circle.

✏️
Let circle $ C$: $ (x - \alpha)^2 + (y - \beta)^2 = r^2$, so $ P = (\alpha + r\cos\theta, \beta + r\sin\theta)$. Let $ Q = (a, b)$ fixed, $ R = (h, k)$.

Midpoint: $ h = \frac{\alpha + r\cos\theta + a}{2}$, $ k = \frac{\beta + r\sin\theta + b}{2}$, which give
$ r\cos\theta = 2h - (\alpha + a)$ and $ r\sin\theta = 2k - (\beta + b)$.

Square and add (using $ \cos^2\theta + \sin^2\theta = 1$):
$ \left(h - \frac{\alpha + a}{2}\right)^2 + \left(k - \frac{\beta + b}{2}\right)^2 = \left(\frac{r}{2}\right)^2$.

This is a circle (radius $ \frac{r}{2}$). Hence the locus of $ R$ is a circle.

$\boxed{\text{Answer: (a)}}$
`,

  // Q72 — book #72
  'LIMS-110': R`🎯
- Evaluate $ \lim_{n\to\infty}\sum_{r=0}^{n-1}\frac{\sqrt{n}}{\sqrt{(n + 4r)^3}}$.

💡 Convert the sum into a definite integral via $ \frac{1}{n}\sum f\!\left(\frac{r}{n}\right) \to \int_0^1 f(x)\,dx$.

✏️
$ I = \lim_{n\to\infty}\sum_{r=0}^{n-1}\frac{\sqrt{n}}{\sqrt{(n + 4r)^3}} = \lim_{n\to\infty}\frac{1}{n}\sum_{r=0}^{n-1}\frac{1}{\left(1 + \frac{4r}{n}\right)^{3/2}}$.

As an integral (with $ x = \frac{r}{n}$):
$ I = \int_{0}^{1}\frac{dx}{(1 + 4x)^{3/2}}$.

Integrate:
$ I = \left[\frac{(1 + 4x)^{-1/2}}{4 \cdot (-\frac{1}{2})}\right]_0^1 = -\frac{1}{2}\left[(1 + 4x)^{-1/2}\right]_0^1 = -\frac{1}{2}\left[\frac{1}{\sqrt{5}} - 1\right]$.

$ I = -\frac{1}{2}\cdot\frac{1 - \sqrt{5}}{\sqrt{5}} = \frac{\sqrt{5} - 1}{2\sqrt{5}} = \frac{5 - \sqrt{5}}{10}$.

$\boxed{\text{Answer: (a)}}$
`,

  // Q73 — book #73 (MCQ: a, d)
  'CTDF-119': R`🎯
- $ f(x) = 0$ on $ [-1,0)$, $ f(0)=1$, $ f(x)=2$ on $ (0,1]$. With $ F(x) = \int_{-1}^{x} f(t)\,dt$, examine continuity and differentiability at $ x = 0$.

💡 An integral of a bounded function is always continuous, but a jump in the integrand makes $ F$ non-differentiable there (corner).

✏️
For $ -1 \le x \le 0$: $ F(x) = \int_{-1}^{x} 0\, dt = 0$.

For $ 0 < x \le 1$: $ F(x) = \int_{-1}^{0} 0\, dt + \int_{0}^{x} 2\, dt = 2x$.

So $ F(x) = \begin{cases} 0, & -1 \le x \le 0 \\ 2x, & 0 < x \le 1 \end{cases}$.

$ F$ is continuous on $ [-1, 1]$ (both pieces meet at $ F(0) = 0$).

At $ x = 0$: left slope $ = 0$, right slope $ = 2$ — a corner, so $ F'(0)$ does not exist.

Hence $ F$ is continuous on $ [-1,1]$ but $ F'(x)$ does not exist at $ x = 0$.

$\boxed{\text{Answer: (a), (d)}}$
`,

  // Q74 — book #74 (MCQ: b, c)
  'AODV-221': R`🎯
- Find the greatest and least values of $ f(x) = \tan^{-1}x - \frac{1}{2}\ln x$ on $ \left[\frac{1}{\sqrt{3}}, \sqrt{3}\right]$.

💡 The derivative's sign decides where the max and min sit; since $ f$ is decreasing here, the max is at the left endpoint and the min at the right.

✏️
$ f'(x) = \frac{1}{1 + x^2} - \frac{1}{2x} = \frac{2x - 1 - x^2}{2x(1 + x^2)} = \frac{-(x^2 - 2x + 1)}{2x(1 + x^2)} = \frac{-(x-1)^2}{2x(1 + x^2)} \le 0$.

So $ f$ is decreasing for $ x > 0$ → max at $ x = \frac{1}{\sqrt{3}}$, min at $ x = \sqrt{3}$.

$ f\!\left(\frac{1}{\sqrt{3}}\right) = \tan^{-1}\frac{1}{\sqrt{3}} - \frac{1}{2}\ln\frac{1}{\sqrt{3}} = \frac{\pi}{6} + \frac{1}{4}\ln 3$.

$ f(\sqrt{3}) = \tan^{-1}\sqrt{3} - \frac{1}{2}\ln\sqrt{3} = \frac{\pi}{3} - \frac{1}{4}\ln 3$.

So $ f_{\max} = \frac{\pi}{6} + \frac{1}{4}\ln 3$ and $ f_{\min} = \frac{\pi}{3} - \frac{1}{4}\ln 3$.

$\boxed{\text{Answer: (b), (c)}}$
`,

  // Q75 — book #75
  'FUNC-187': R`🎯
- $ f$ and $ g$ are periodic with periods $ T_1$ and $ T_2$. When is $ f + g$ periodic?

💡 A sum of periodic functions is periodic when their periods share a common period — guaranteed here when the periods are equal.

✏️
If $ T_1 = T_2$, both functions repeat over the same length, so $ f + g$ repeats over that same period and is periodic.

In general $ f + g$ need not be periodic when $ T_1 \ne T_2$ (e.g. incommensurable periods), so the safe answer is: periodic when $ T_1 = T_2$.

$\boxed{\text{Answer: (d)}}$
`,
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const now = new Date();
  let ok = 0, fail = 0;
  for (const [display_id, md] of Object.entries(UPDATES)) {
    const res = await col.updateOne({ display_id },
      { $set: { 'solution.text_markdown': md, 'solution.latex_validated': false, updated_at: now, updated_by: 'wbjee2021-solutions' } });
    res.matchedCount === 0 ? (console.log('⚠️  ' + display_id + ' NOT FOUND'), fail++) : (console.log('✅ ' + display_id), ok++);
  }
  console.log('\n' + ok + ' updated, ' + fail + ' failed');
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
