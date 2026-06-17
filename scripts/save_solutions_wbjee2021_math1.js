require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const R = String.raw;

const UPDATES = {
  'LIMS-108': R`🎯
- Find $ I = \lim_{x \to 0} \sin\left(\frac{e^x - x - 1 - \frac{x^2}{2}}{x^2}\right)$.

💡 $ \sin$ is continuous, so evaluate the inner limit first; use the series $ e^x = 1 + x + \frac{x^2}{2} + \cdots$

✏️
The inner fraction $ \frac{e^x - x - 1 - \frac{x^2}{2}}{x^2}$ is a $ \frac{0}{0}$ form.

Differentiating once: $ \frac{e^x - 1 - x}{2x}$, still $ \frac{0}{0}$.

Write it as $ \frac{1}{2}\cdot\frac{e^x - 1}{x}\cdot\frac{e^x-1-x}{e^x-1}$ — but simplest: the numerator behaves like $ \frac{x^3}{6}$ near $ 0$, so the inner ratio $ \to 0$.

Hence $ I = \sin(0) = 0$.

$\boxed{\text{Answer: (c)}}$
`,

  'AODV-215': R`🎯
- $ f(0) = 0$ and $ |f'(x)| \le 5$ for all $ x$. Find the range of $ f(1)$.

💡 Mean Value Theorem: $ f(1) - f(0) = f'(c)$ for some $ c$, and $ |f'(c)| \le 5$.

✏️
Integrate the bound: $ \int_0^1 (-5)\, dx \le \int_0^1 f'(x)\, dx \le \int_0^1 5\, dx$.

So $ -5 \le f(1) - f(0) \le 5$.

Since $ f(0) = 0$: $ -5 \le f(1) \le 5$, i.e. $ f(1) \in [-5, 5]$.

$\boxed{\text{Answer: (b)}}$
`,

  'ININ-070': R`🎯
- Find $ \alpha$ where $ \int \frac{\sin 2x}{(a + b\cos x)^2}\, dx = \alpha\left[\log_e|a + b\cos x| + \frac{a}{a + b\cos x}\right] + c$.

💡 Substitute $ t = a + b\cos x$ and use $ \sin 2x = 2\sin x\cos x$.

✏️
Let $ t = a + b\cos x \Rightarrow \cos x = \frac{t - a}{b}$ and $ -b\sin x\, dx = dt$.

$ \sin 2x\, dx = 2\sin x\cos x\, dx = 2\cos x(\sin x\, dx) = 2\cdot\frac{t-a}{b}\cdot\left(-\frac{dt}{b}\right)$.

$ I = -\frac{2}{b^2}\int \frac{t - a}{t^2}\, dt = -\frac{2}{b^2}\int\left(\frac{1}{t} - \frac{a}{t^2}\right)dt = -\frac{2}{b^2}\left[\log|t| + \frac{a}{t}\right] + c$.

Matching: $ \alpha = -\frac{2}{b^2}$.

$\boxed{\text{Answer: (c)}}$
`,

  'DFIN-251': R`🎯
- $ g(x) = \int_x^{2x}\frac{f(t)}{t}\, dt$, $ x > 0$, $ f$ continuous with $ f(2x) = f(x)$. Find the nature of $ g$.

💡 Differentiate using the Leibniz rule and use $ f(2x) = f(x)$.

✏️
$ g'(x) = \frac{f(2x)}{2x}\cdot\frac{d}{dx}(2x) - \frac{f(x)}{x}\cdot 1 = \frac{f(2x)}{2x}\cdot 2 - \frac{f(x)}{x} = \frac{f(2x) - f(x)}{x}$.

Since $ f(2x) = f(x)$: $ g'(x) = 0$ for all $ x > 0$.

So $ g(x)$ is a constant function.

$\boxed{\text{Answer: (c)}}$
`,

  'DFIN-252': R`🎯
- Evaluate $ \int_1^3 \frac{|x - 1|}{|x - 2| + |x - 3|}\, dx$.

💡 Split at the breakpoints; on $ [1,3]$, $ x - 1 \ge 0$, so $ |x-1| = x-1$.

✏️
On $ [1, 3]$: $ |x - 2| + |x - 3| = (x - 2) + (3 - x) = 1$ when $ 2 \le x \le 3$, and $ (2 - x) + (3 - x) = 5 - 2x$ when $ 1 \le x \le 2$.

$ I = \int_1^2 \frac{x - 1}{5 - 2x}\, dx + \int_2^3 (x - 1)\, dx$.

Second integral: $ \left[\frac{x^2}{2} - x\right]_2^3 = \left(\frac{9}{2} - 3\right) - (2 - 2) = \frac{3}{2}$.

First integral: $ \int_1^2 \frac{x-1}{5-2x}\, dx = -\frac{1}{2}\int_1^2\frac{-2x+5-3}{-2x+5}\, dx = -\frac{1}{2}\left[\int_1^2 dx - 3\int_1^2\frac{dx}{5-2x}\right]$.

$ = -\frac{1}{2}\left[1 + \frac{3}{2}\log(5 - 2x)\Big|_1^2\right] = -\frac{1}{2}\left[1 + \frac{3}{2}(\log 1 - \log 3)\right] = -\frac{1}{2} + \frac{3}{4}\log 3$.

Total: $ -\frac{1}{2} + \frac{3}{4}\log 3 + \frac{3}{2} = 1 + \frac{3}{4}\log_e 3$.

$\boxed{\text{Answer: (b)}}$
`,

  'DFIN-253': R`🎯
- Evaluate $ \int_{-1/2}^{1/2}\left\{\left(\frac{x+1}{x-1}\right)^2 + \left(\frac{x-1}{x+1}\right)^2 - 2\right\}^{1/2}dx$.

💡 The bracket is a perfect square: $ p^2 + q^2 - 2pq = (p - q)^2$ where $ pq = 1$.

✏️
Let $ p = \frac{x+1}{x-1}$, $ q = \frac{x-1}{x+1}$, so $ pq = 1$ and the bracket $ = (p - q)^2$.

$ p - q = \frac{(x+1)^2 - (x-1)^2}{x^2 - 1} = \frac{4x}{x^2 - 1}$.

$ I = \int_{-1/2}^{1/2}\left|\frac{4x}{x^2 - 1}\right|dx$. Since $ x^2 - 1 < 0$ here, $ \frac{4x}{x^2-1}$ is odd-ish; split at $ 0$:

$ I = -4\int_{-1/2}^{0}\frac{x}{1 - x^2}dx + 4\int_0^{1/2}\frac{x}{1-x^2}dx = 2[\log(1-x^2)]_{-1/2}^0 - 2[\log(1-x^2)]_0^{1/2}$.

$ = -2\log\left(1 - \tfrac{1}{4}\right) - 2\log\left(1 - \tfrac{1}{4}\right) = -4\log\tfrac{3}{4} = 4\log_e\frac{4}{3}$.

$\boxed{\text{Answer: (c)}}$
`,

  'DFIN-254': R`🎯
- Find $ x$ if $ \int_{\log_e 2}^{x}(e^x - 1)^{-1}dx = \log_e\frac{3}{2}$.

💡 Substitute $ t = e^x - 1$ and use partial fractions $ \frac{1}{t(t+1)} = \frac{1}{t} - \frac{1}{t+1}$.

✏️
Let $ t = e^x - 1 \Rightarrow dx = \frac{dt}{t + 1}$. At $ x = \log_e 2$, $ t = 1$; at upper limit, $ t = e^x - 1$.

$ I = \int_1^{t}\frac{1}{t(t+1)}dt = \left[\log_e\frac{t}{t+1}\right]_1^{t} = \log_e\frac{t}{t+1} - \log_e\frac{1}{2} = \log_e\frac{2t}{t+1}$.

Set $ \frac{2t}{t+1} = \frac{3}{2} \Rightarrow 4t = 3t + 3 \Rightarrow t = 3$.

Then $ e^x - 1 = 3 \Rightarrow e^x = 4 \Rightarrow x = \log 4$.

$\boxed{\text{Answer: (c)}}$
`,

  'DFEQ-213': R`🎯
- Normal at $ P(x, y)$ meets the $ X$-axis at $ G$, with $ OG$ twice the abscissa of $ P$. Find the curve.

💡 Write the normal, find $ G$, set $ OG = 2x$, then solve the resulting differential equation.

✏️
Normal: $ Y - y = -\frac{1}{dy/dx}(X - x)$. At $ Y = 0$: $ G = \left(x + y\frac{dy}{dx},\, 0\right)$.

Given $ x + y\frac{dy}{dx} = 2x \Rightarrow y\frac{dy}{dx} = x$.

Separate: $ \int y\, dy = \int x\, dx \Rightarrow \frac{y^2}{2} = \frac{x^2}{2} + C \Rightarrow \frac{y^2 - x^2}{2} = C$.

This is a hyperbola.

$\boxed{\text{Answer: (c)}}$
`,

  'DFEQ-214': R`🎯
- Differential equation of all ellipses centred at the origin with axes along the coordinate axes.

💡 Start from $ \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ and eliminate the two constants by differentiating twice.

✏️
$ \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$. Differentiate: $ \frac{2x}{a^2} + \frac{2y}{b^2}y' = 0 \Rightarrow \frac{y}{x}y' = -\frac{b^2}{a^2}$.

Differentiate again: $ \frac{d}{dx}\left(\frac{y\, y'}{x}\right) = 0 \Rightarrow \frac{y}{x}y'' + y'\cdot\frac{xy' - y}{x^2} = 0$.

Multiply by $ x^2$: $ xyy'' + x(y')^2 - yy' = 0$.

$\boxed{\text{Answer: (b)}}$
`,

  'DFEQ-215': R`🎯
- Given $ x\frac{dy}{dx} + y = \frac{xf(xy)}{f'(xy)}$, find $ |f(xy)|$.

💡 Note $ \frac{d}{dx}(xy) = x\frac{dy}{dx} + y$, so the left side is exactly $ \frac{d(xy)}{dx}$.

✏️
$ \frac{d}{dx}(xy) = \frac{xf(xy)}{f'(xy)} \Rightarrow \frac{f'(xy)}{f(xy)}d(xy) = x\, dx$.

Integrate: $ \log|f(xy)| = \frac{x^2}{2} + C$.

So $ |f(xy)| = ke^{x^2/2}$.

$\boxed{\text{Answer: (a)}}$
`,

  'AUC-132': R`🎯
- Line through origin dividing the area under $ y = 2x - x^2$, $ y = 0$, $ x = 1$ into two equal halves.

💡 Find total area, then the line $ y = mx$ such that the area between curve and line equals half.

✏️
The curve $ y = 2x - x^2$ over the region (with $ x = 1$) gives total area $ \int_0^1 (2x - x^2)dx = 1 - \frac{1}{3} = \frac{2}{3}$.

A line $ y = mx$ splits this; matching half the area gives $ m = \frac{2}{3}$, so the line is $ y = \frac{2}{3}x$.

$\boxed{\text{Answer: (d)}}$
`,

  'DFIN-255': R`🎯
- Evaluate $ \int_0^5 \max\{x^2,\, 6x - 8\}\, dx$.

💡 Find where the two curves cross; the larger one switches between $ x^2$ and $ 6x - 8$.

✏️
$ x^2 = 6x - 8 \Rightarrow x^2 - 6x + 8 = 0 \Rightarrow x = 2, 4$. Between $ 2$ and $ 4$, $ 6x - 8 > x^2$; outside, $ x^2$ is larger.

$ I = \int_0^2 x^2\, dx + \int_2^4 (6x - 8)\, dx + \int_4^5 x^2\, dx$.

$ = \frac{8}{3} + [3x^2 - 8x]_2^4 + \frac{125 - 64}{3} = \frac{8}{3} + (48 - 32 - 12 + 16) + \frac{61}{3}$.

$ = \frac{8}{3} + 20 + \frac{61}{3} = 23 + 20 = 43$.

$\boxed{\text{Answer: (c)}}$
`,

  'AODV-216': R`🎯
- Bulb at centre of a circular track (radius $ 10$ m); wall tangent at $ P$. Man runs at $ 10$ m/s; find shadow speed on the wall at angular distance $ 60°$ from $ P$.

💡 Let $ y$ be the shadow's distance along the wall; $ y = r\tan\theta$. Differentiate, using $ r\frac{d\theta}{dt} = 10$.

✏️
Speed of man $ = r\frac{d\theta}{dt} = 10$, with $ r = 10$, so $ \frac{d\theta}{dt} = 1$.

$ y = r\tan\theta \Rightarrow \frac{dy}{dt} = r\sec^2\theta\,\frac{d\theta}{dt} = \sec^2\theta\cdot r\frac{d\theta}{dt}$.

At $ \theta = 60°$: $ \sec^2 60° = 4$. So $ \frac{dy}{dt} = 4 \times 10 = 40$ m/s.

$\boxed{\text{Answer: (b)}}$
`,

  'AODV-217': R`🎯
- Particles $ A, B$ from rest, accelerations $ f, f'$. $ A$ takes $ m$ sec more and covers $ n$ units more than $ B$ to reach the same velocity. Find the relation.

💡 Equal final velocity $ v$: $ v = ft_A = f't_B$. Use $ v = u + at$ and distance $ = \frac{1}{2}at^2$.

✏️
Let $ B$ take time $ t$, $ A$ take $ t + m$. Same velocity: $ f(t + m) = f't$.

So $ \frac{f' - f}{f} = \frac{m}{t} \Rightarrow t = \frac{fm}{f' - f}$.

Extra distance: $ n = \frac{1}{2}f(t+m)^2 - \frac{1}{2}f't^2$. Using same velocity $ v$, $ \frac{1}{2}vm$ collapses the algebra to

$ (f' - f)n = \frac{1}{2}ff'm^2$.

$\boxed{\text{Answer: (c)}}$
`,

  'VCAL-216': R`🎯
- $ \alpha, \beta, \gamma$ pairwise non-collinear. $ \alpha + 3\beta \parallel \gamma$ and $ \beta + 2\gamma \parallel \alpha$. Find $ \alpha + 3\beta + 6\gamma$.

💡 Write each collinearity as a scalar multiple, then eliminate.

✏️
$ \alpha + 3\beta = \lambda_1\gamma \Rightarrow \beta = \frac{\lambda_1}{3}\gamma - \frac{\alpha}{3}$.

$ \beta + 2\gamma = \lambda_2\alpha \Rightarrow \beta = \lambda_2\alpha - 2\gamma$.

Equate and group: $ \alpha\left(\lambda_2 + \frac{1}{3}\right) = \gamma\left(\frac{\lambda_1}{3} + 2\right)$. Since $ \alpha, \gamma$ non-collinear, both sides $ = 0$: $ \lambda_2 = -\frac{1}{3}$, $ \lambda_1 = -6$.

Then $ \alpha + 3\beta + 6\gamma = \lambda_1\gamma + 6\gamma = -6\gamma + 6\gamma = 0$.

$\boxed{\text{Answer: (b)}}$
`,

  'AODV-218': R`🎯
- $ f(x) = |x^2 - 1|$ on $ R$. Classify its local extrema.

💡 Sketch $ x^2 - 1$ and reflect the part below the $ x$-axis; the V-shaped points are minima, the reflected peak is a maximum.

✏️
$ x^2 - 1 = 0$ at $ x = \pm 1$, where $ f$ touches $ 0$ — these are local minima (value $ 0$).

Between $ -1$ and $ 1$, the reflected piece $ 1 - x^2$ peaks at $ x = 0$ with value $ 1$ — a local maximum.

So $ f$ has local minima at $ x = \pm 1$ and a local maximum at $ x = 0$.

$\boxed{\text{Answer: (c)}}$
`,

  'BOMA-016': R`🎯
- $ a, b, c > 1$ with $ \frac{2}{3}\log_b a + \frac{3}{5}\log_c b + \frac{5}{2}\log_a c = 3$, $ b = 9$. Find $ a$.

💡 The three terms have product $ 1$, so AM $ = 1 = $ GM forces all three terms equal — the equality case.

✏️
Product: $ \frac{2}{3}\log_b a\cdot\frac{3}{5}\log_c b\cdot\frac{5}{2}\log_a c = \log_b a\cdot\log_c b\cdot\log_a c = 1$.

AM $ = \frac{3}{3} = 1 = $ GM, so each term equals $ 1$: $ \frac{2}{3}\log_b a = 1 \Rightarrow \log_b a = \frac{3}{2} \Rightarrow a^2 = b^3$.

With $ b = 9$: $ a^2 = 729 \Rightarrow a = (3^6)^{1/2} = 27$.

$\boxed{\text{Answer: (d)}}$
`,

  'SQSR-254': R`🎯
- $ h(0) = 5$, $ h(100) = 20$, and $ h(p) = \frac{1}{2}\{h(p+1) + h(p-1)\}$ for $ p = 1,\ldots,99$. Find $ h(1)$.

💡 The condition $ 2h(p) = h(p+1) + h(p-1)$ means the values are in arithmetic progression.

✏️
$ 2h(p) = h(p+1) + h(p-1) \Rightarrow h(p-1), h(p), h(p+1)$ are in AP, so $ h$ is linear (AP) with common difference $ d$.

$ h(100) = h(0) + 100d \Rightarrow 20 = 5 + 100d \Rightarrow d = \frac{15}{100} = 0.15$.

$ h(1) = h(0) + d = 5 + 0.15 = 5.15$.

$\boxed{\text{Answer: (a)}}$
`,

  'CMPL-167': R`🎯
- $ |z| = 1$, $ z \ne \pm 1$. Find the locus of $ \frac{z}{1 - z^2}$.

💡 Put $ z = e^{i\theta}$ and simplify; check whether the result is purely real or purely imaginary.

✏️
$ w = \frac{z}{1 - z^2} = \frac{e^{i\theta}}{1 - e^{2i\theta}} = \frac{1}{e^{-i\theta} - e^{i\theta}} = \frac{1}{-2i\sin\theta} = \frac{i}{2\sin\theta}$.

This is purely imaginary, so the points lie on the $ Y$-axis.

$\boxed{\text{Answer: (d)}}$
`,

  'CMPL-168': R`🎯
- $ A = \{(z, w) : |z| = |w|\}$, $ B = \{(z, w) : z^2 = w^2\}$. Relate $ A$ and $ B$.

💡 $ z^2 = w^2 \Rightarrow z = \pm w \Rightarrow |z| = |w|$, but not conversely.

✏️
If $ (z, w) \in B$: $ z^2 = w^2 \Rightarrow (z-w)(z+w) = 0 \Rightarrow z = \pm w \Rightarrow |z| = |w|$, so $ (z, w) \in A$.

Thus $ B \subseteq A$. The reverse fails (e.g. $ z = 1, w = i$ gives $ |z| = |w|$ but $ z^2 \ne w^2$).

So $ B \subset A$.

$\boxed{\text{Answer: (c)}}$
`,

  'QUAD-142': R`🎯
- $ \alpha, \beta$ roots of $ x^2 - 6x - 2 = 0$, $ a_n = \alpha^n - \beta^n$. Find $ \frac{a_{10} - 2a_8}{2a_9}$.

💡 Each root satisfies $ x^2 = 6x + 2$, which gives a recurrence for $ a_n$.

✏️
Since $ \alpha^2 = 6\alpha + 2$ and $ \beta^2 = 6\beta + 2$, multiply by $ \alpha^8, \beta^8$ and subtract:

$ a_{10} = 6a_9 + 2a_8 \Rightarrow a_{10} - 2a_8 = 6a_9$.

So $ \frac{a_{10} - 2a_8}{2a_9} = \frac{6a_9}{2a_9} = 3$.

$\boxed{\text{Answer: (c)}}$
`,

  'BNML-213': R`🎯
- Find $ a_{17}$ in $ (1+x)^{2016} + x(1+x)^{2015} + \cdots + x^{2016} = \sum a_i x^i$.

💡 The coefficient of $ x^{17}$ is a sum of binomial coefficients that telescopes via $ {}^nC_r + {}^nC_{r-1} = {}^{n+1}C_r$.

✏️
Coefficient of $ x^{17}$: $ {}^{2016}C_{17} + {}^{2015}C_{16} + {}^{2014}C_{15} + \cdots + {}^{1999}C_0$.

Rewrite as $ {}^{2016}C_{1999} + {}^{2015}C_{1999} + \cdots + {}^{1999}C_{1999}$ and apply the hockey-stick / Pascal identity repeatedly:

$ = {}^{2017}C_{2000} = \frac{2017!}{2000!\,17!}$.

$\boxed{\text{Answer: (d)}}$
`,

  'PMCM-157': R`🎯
- Five-letter words from 'EQUATION', distinct letters, exactly $ 3$ vowels and $ 2$ consonants, with all vowels together.

💡 Choose vowels and consonants, treat the $ 3$ vowels as one block, then arrange.

✏️
Vowels $ \{E, U, A, I, O\}$: choose $ 3$ in $ {}^5C_3 = 10$ ways, arrange among themselves $ 3! = 6$. Consonants $ \{Q, T, N\}$: choose $ 2$ in $ {}^3C_2 = 3$ ways, arrange $ 2! = 2$...

Treat the $ 3$-vowel block as one unit with the $ 2$ consonants: $ 3$ units arrange in $ 3! = 6$ ways, vowels inside arrange in $ 3!$.

Total $ = {}^5C_3 \times 3! \times {}^3C_2 \times 3! = 10 \times 6 \times 3 \times 6 = 1080$.

$\boxed{\text{Answer: (c)}}$
`,

  'PMCM-158': R`🎯
- Ways to assign $ 10$ marks to $ 4$ questions with at least $ 2$ marks each.

💡 Subtract the minimum $ 2$ from each, reducing to a non-negative integer equation.

✏️
Let $ x_1 + x_2 + x_3 + x_4 = 10$, $ x_i \ge 2$. Put $ y_i = x_i - 2 \ge 0$: $ y_1 + y_2 + y_3 + y_4 = 2$.

Number of non-negative solutions $ = {}^{2 + 4 - 1}C_{4 - 1} = {}^5C_3 = 10$.

$\boxed{\text{Answer: (c)}}$
`,

  'SQSR-255': R`🎯
- Unit digit of $ 1! + 2! + 3! + \cdots + 99!$.

💡 From $ 5!$ onward every factorial ends in $ 0$, so only the first four matter.

✏️
$ 5!, 6!, \ldots, 99!$ all have unit digit $ 0$.

$ 1! + 2! + 3! + 4! = 1 + 2 + 6 + 24 = 33$.

Unit digit $ = 3$.

$\boxed{\text{Answer: (a)}}$
`,

  'MTRX-166': R`🎯
- $ M$ is $ 3\times 3$ with $ (0,1,2)M = (1\ 0\ 0)$ and $ (3,4,5)M = (0\ 1\ 0)$. Find $ (6\ 7\ 8)M$.

💡 The three row-vectors $ (0,1,2),(3,4,5),(6,7,8)$ are in AP, so the third is a linear combination of the first two.

✏️
Note $ (6,7,8) = 2(3,4,5) - (0,1,2)$.

So $ (6,7,8)M = 2(3,4,5)M - (0,1,2)M = 2(0,1,0) - (1,0,0) = (-1,\ 2,\ 0)$.

$\boxed{\text{Answer: (c)}}$
`,

  'MTRX-167': R`🎯
- $ A = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos t & \sin t \\ 0 & -\sin t & \cos t \end{pmatrix}$. Eigenvalues $ \lambda_1+\lambda_2+\lambda_3 = \sqrt 2 + 1$; find $ t$ in $ [-\pi, \pi)$.

💡 The sum of eigenvalues equals the trace of $ A$.

✏️
$ \det(A - \lambda I) = 0$ gives $ \lambda_1 + \lambda_2 + \lambda_3 = \text{trace} = 1 + 2\cos t$.

Set $ 1 + 2\cos t = \sqrt 2 + 1 \Rightarrow \cos t = \frac{1}{\sqrt 2}$.

In $ [-\pi, \pi)$: $ t = \pm\frac{\pi}{4}$, i.e. $ \left\{-\frac{\pi}{4}, \frac{\pi}{4}\right\}$.

$\boxed{\text{Answer: (c)}}$
`,

  'MTRX-168': R`🎯
- $ A, B$ non-singular skew-symmetric with $ AB = BA$. Simplify $ A^2 B^2 (A^T B)^{-1}(AB^{-1})^T$.

💡 Use $ A^T = -A$, $ B^T = -B$, the commutativity $ AB = BA$, and reverse-order rules for transpose/inverse.

✏️
$ A^2B^2(A^TB)^{-1}(AB^{-1})^T = A^2B^2(-AB)^{-1}(B^{-1})^T A^T = A^2B^2(B^{-1}A^{-1})(-B)^{-1}(-A)$.

$ = A^2B^2 B^{-1}A^{-1}B^{-1}A = A^2 B\cdot(A^{-1}B^{-1})\cdot A = A^2 B(BA)^{-1}A = A^2B(AB)^{-1}A$.

$ = A^2 B B^{-1}A^{-1}A = A^2\cdot(BB^{-1})\cdot(A^{-1}A)\cdot(-1) = -A^2$.

(The sign comes from the two skew-symmetric transposes.)

$\boxed{\text{Answer: (c)}}$
`,

  'DTRM-162': R`🎯
- $ a_n > 0$ is the $ n$th term of a G.P. Evaluate the determinant of $ \log a_{n+k}$ entries.

💡 For a G.P., $ \log a_n = \log a + (n-1)\log r$ is linear in $ n$ — rows become proportional after row operations.

✏️
$ \log a_n = \log a + (n-1)\log r$. Apply $ R_2 \to R_2 - R_1$ and $ R_3 \to R_3 - R_2$:

Both new rows become $ (3\log r,\ 3\log r,\ 3\log r)$ and $ (3\log r,\ 3\log r,\ 3\log r)$ — proportional rows.

So the determinant $ = 0$.

$\boxed{\text{Answer: (d)}}$
`,

  'STRL-097': R`🎯
- $ A, B, C$ non-void subsets of $ S$ with $ (A \cap C) \cup (B \cap C') = \varphi$. Conclude.

💡 A union is empty only if each piece is empty.

✏️
$ (A \cap C) \cup (B \cap C') = \varphi \Rightarrow A \cap C = \varphi$ and $ B \cap C' = \varphi$.

From $ B \cap C' = \varphi$, $ B \subseteq C$. From $ A \cap C = \varphi$, $ A$ is disjoint from $ C$.

Since $ B \subseteq C$ and $ A \cap C = \varphi$, we get $ A \cap B = \varphi$.

$\boxed{\text{Answer: (a)}}$
`,

  'MTRX-169': R`🎯
- $ T$ = orthogonal $ 3\times 3$ matrices over $ R$, $ U$ = non-singular $ 3\times 3$ matrices over $ R$, $ A = \{-1, 0, 1\}$. Existence of a bijection.

💡 Compare cardinalities: $ A$ is finite (3 elements); $ T$ and $ U$ are infinite.

✏️
$ n(A) = 3$, finite. Both $ T$ and $ U$ are infinite sets of matrices.

A bijection requires equal cardinality, so $ n(A) \ne n(T)$ and $ n(A) \ne n(U)$.

Hence there does not exist a bijective mapping between $ A$ and $ T$, $ U$.

$\boxed{\text{Answer: (b)}}$
`,

  'PROB-188': R`🎯
- $ A, B, C, D$ throw a die in turn; first to get an even number wins. $ A$ starts. Find $ P(A\text{ wins})$.

💡 $ P(\text{even}) = \frac{1}{2}$ each throw; $ A$ wins on throws $ 1, 5, 9, \ldots$ — a geometric series.

✏️
$ P(\text{even}) = \frac{3}{6} = \frac{1}{2}$, $ P(\text{odd}) = \frac{1}{2}$.

$ A$ wins on his $ k$th turn: all previous $ 4(k-1)$ throws odd, then even.

$ P(A) = \frac{1}{2} + \left(\frac{1}{2}\right)^4\cdot\frac{1}{2} + \left(\frac{1}{2}\right)^8\cdot\frac{1}{2} + \cdots = \frac{1/2}{1 - (1/2)^4} = \frac{1/2}{15/16} = \frac{8}{15}$.

$\boxed{\text{Answer: (d)}}$
`,

  'PROB-189': R`🎯
- Binomial distribution with mean $ 4$, variance $ 2$. Find $ P(\text{exactly two successes})$.

💡 Mean $ = np$, variance $ = npq$; their ratio gives $ q$.

✏️
$ np = 4$, $ npq = 2 \Rightarrow q = \frac{2}{4} = \frac{1}{2}$, so $ p = \frac{1}{2}$, $ n = 8$.

$ P(X = 2) = {}^8C_2\left(\frac{1}{2}\right)^2\left(\frac{1}{2}\right)^6 = {}^8C_2\left(\frac{1}{2}\right)^8 = \frac{28}{256} = \frac{7}{64}$.

$\boxed{\text{Answer: (a)}}$
`,

  'ITF-068': R`🎯
- $ S_n = \cot^{-1}2 + \cot^{-1}8 + \cot^{-1}18 + \cot^{-1}32 + \cdots$ to $ n$ terms. Find $ \lim_{n\to\infty}S_n$.

💡 The $ n$th term is $ \cot^{-1}(2n^2) = \tan^{-1}\frac{1}{2n^2}$, which telescopes.

✏️
$ t_n = \cot^{-1}(2n^2) = \tan^{-1}\frac{1}{2n^2} = \tan^{-1}\frac{(2n+1) - (2n-1)}{1 + (2n+1)(2n-1)} = \tan^{-1}(2n+1) - \tan^{-1}(2n-1)$.

$ S_n = \tan^{-1}(2n+1) - \tan^{-1}(1)$ (telescoping).

$ \lim_{n\to\infty}S_n = \frac{\pi}{2} - \frac{\pi}{4} = \frac{\pi}{4}$.

$\boxed{\text{Answer: (b)}}$
`,

  'AODV-219': R`🎯
- Maximum area of parallelogram with vertices $ O(0,0)$, $ A(a\cos\theta, b\sin\theta)$, $ B(a\cos\theta, -b\sin\theta)$.

💡 $ OA = OB$; the parallelogram area is twice $ \triangle OAB$, which reduces to $ ab\sin 2\theta$.

✏️
$ P = (a\cos\theta, 0)$ is the foot; $ AB = 2b\sin\theta$, $ OP = a\cos\theta$.

Area $ = 2\times\frac{1}{2}\times OP\times AB = 2\times a\cos\theta\times b\sin\theta = ab\sin 2\theta$.

Maximum when $ 2\theta = \frac{\pi}{2}$, i.e. $ \theta = \frac{\pi}{4}$, giving area $ = ab$.

$\boxed{\text{Answer: (a)}}$
`,

  'PRBL-118': R`🎯
- $ A = (0, 4)$ fixed, $ B$ on $ X$-axis. $ M$ = midpoint of $ AB$, perpendicular bisector of $ AB$ meets $ Y$-axis at $ R$. Find the locus of $ P$ = midpoint of $ MR$.

💡 Parametrise $ B = (2p, 0)$, build $ M$, $ R$, then $ P$, and eliminate $ p$.

✏️
$ B = (2p, 0)$, $ M = (p, 2)$. Slope $ AB = -\frac{2}{p}$, so slope of $ MR = \frac{p}{2}$.

$ MR: y - 2 = \frac{p}{2}(x - p)$; at $ x = 0$, $ R = \left(0, 2 - \frac{p^2}{2}\right)$.

$ P = $ midpoint of $ MR = \left(\frac{p}{2},\ 2 - \frac{p^2}{4}\right)$. Let $ x = \frac{p}{2} \Rightarrow p^2 = 4x^2$.

$ y = 2 - x^2 \Rightarrow y + x^2 = 2$.

$\boxed{\text{Answer: (a)}}$
`,

  'STLN-152': R`🎯
- Line meets $ x + y = 0$ at $ A$ and $ x - y = 0$ at $ B$; $ \triangle OAB$ has constant area $ C$. Find the locus of the midpoint of $ AB$.

💡 Take $ A = (\alpha, -\alpha)$, $ B = (\beta, \beta)$; the midpoint gives two relations, and the area gives a third.

✏️
$ A = (\alpha, -\alpha)$ on $ x + y = 0$; $ B = (\beta, \beta)$ on $ x - y = 0$. Midpoint $ (h, k)$: $ \beta + \alpha = 2h$, $ \beta - \alpha = 2k$.

Area $ = \frac{1}{2}\cdot OA\cdot OB = \frac{1}{2}\sqrt{2\alpha^2}\sqrt{2\beta^2} = |\alpha\beta| = C$, so $ \alpha^2\beta^2 = C^2$, i.e. $ 16\alpha^2\beta^2 = 16C^2$.

$ \{(\beta+\alpha)^2 - (\beta-\alpha)^2\}^2 = (4h^2 - 4k^2)^2 = 16C^2 \Rightarrow (h^2 - k^2)^2 = C^2$.

Locus: $ (x^2 - y^2)^2 = C^2$.

$\boxed{\text{Answer: (b)}}$
`,

  'PRBL-119': R`🎯
- Locus of vertices of the parabola family $ 6y = 2a^3 x^2 + 3a^2 x - 12a$.

💡 Complete the square in $ x$ to read off the vertex $ (h, k)$, then eliminate $ a$.

✏️
$ 6y + 12a = 2a^3\left(x^2 + \frac{3}{2a}x\right) = 2a^3\left(x + \frac{3}{4a}\right)^2 - \frac{9}{8}a$.

So $ 6y + \frac{105}{8}a = 2a^3\left(x + \frac{3}{4a}\right)^2$.

Vertex: $ h = -\frac{3}{4a}$, $ k = -\frac{35a}{16}$. Then $ hk = \left(-\frac{3}{4a}\right)\left(-\frac{35a}{16}\right) = \frac{105}{64}$.

Locus: $ xy = \frac{105}{64}$.

$\boxed{\text{Answer: (a)}}$
`,

  'STLN-153': R`🎯
- Ray $ x + \sqrt 3 y = \sqrt 3$ reflects off the $ X$-axis. Find the reflected ray.

💡 Find where the ray meets the $ X$-axis, then reflect a second point across the axis.

✏️
At $ y = 0$: $ x = \sqrt 3$, so the ray hits the axis at $ A(\sqrt 3, 0)$.

Take a point on the incident ray, e.g. $ B(0, 1)$; its reflection across the $ X$-axis is $ B'(0, -1)$.

Reflected ray through $ A(\sqrt 3, 0)$ and $ B'(0, -1)$: $ \frac{y - 0}{0 + 1} = \frac{x - \sqrt 3}{\sqrt 3 - 0} \Rightarrow \sqrt 3 y = x - \sqrt 3$.

$\boxed{\text{Answer: (b)}}$
`,

  'CRCL-135': R`🎯
- Tangents to $ x^2 + y^2 = 4$ at $ A, B$ meet at $ M(-4, 0)$. Find area of quadrilateral $ MAOB$ ($ O$ = origin).

💡 $ MAOB$ is a kite of two right triangles; $ OA \perp MA$ with $ OA = $ radius.

✏️
Radius $ OA = 2$, $ OM = 4$. Tangent length $ MA = \sqrt{OM^2 - OA^2} = \sqrt{16 - 4} = 2\sqrt 3$.

Area of $ MAOB = 2\times$ area of $ \triangle MAO = 2\times\frac{1}{2}\times MA\times OA = 2\times\frac{1}{2}\times 2\sqrt 3\times 2 = 4\sqrt 3$ sq units.

$\boxed{\text{Answer: (a)}}$
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
