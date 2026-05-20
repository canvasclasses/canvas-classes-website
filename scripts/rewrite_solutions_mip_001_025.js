// Rewrite MIP-001..025 solutions to comply with physics-solution-workflow.md (v1.0).
// Changes: drop 🎯, replace 💡 → 🧠 **bespoke title**, strip [Diagram Placeholder: ...] blocks,
// add ⚠️ Trap to questions that need one (8 additions: 2 mandatory Conceptual + 6 high-value).
// Math and existing good ⚠️ Traps preserved verbatim.

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const UPDATES = {
  'MIP-001': {
    text_markdown: `🧠 **Direction × magnitude = the vector**
To build a vector with a specific direction and a specific length, take the unit vector of that direction and scale it to the length you want.

✏️
$|\\vec{A}| = |\\vec{B}| = 5$

$\\hat{B} = \\frac{4\\hat{i} + 3\\hat{j}}{5}$

Required vector $= 5\\,\\hat{B} = 4\\hat{i} + 3\\hat{j}$

The $y$-component is $3$ ✓, so $x = 4$.

$\\boxed{\\text{Answer: }4}$`
  },

  'MIP-002': {
    text_markdown: `🧠 **Sum² and difference² both carry $\\cos\\theta$**
Squaring the resultant formulas gives $|\\vec{X}+\\vec{Y}|^2 = 2A^2(1+\\cos\\theta)$ and $|\\vec{X}-\\vec{Y}|^2 = 2A^2(1-\\cos\\theta)$. Take their ratio and $\\cos\\theta$ pops out directly.

✏️
Let $|\\vec{X}| = |\\vec{Y}| = A$:

$|\\vec{X} + \\vec{Y}|^2 = 2A^2(1 + \\cos\\theta)$

$|\\vec{X} - \\vec{Y}|^2 = 2A^2(1 - \\cos\\theta)$

Square the given condition and divide — $2A^2$ cancels:

$1 - \\cos\\theta = n^2(1 + \\cos\\theta)$

$\\cos\\theta = \\frac{1 - n^2}{1 + n^2} = \\frac{n^2 - 1}{-(n^2 + 1)}$

⚠️ **Trap** Option (b) writes this as $\\frac{n^2-1}{-n^2-1}$ — same value. Option (d) has all positive signs; that's what you land on if you drop a negative in the last step.

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-003': {
    text_markdown: `🧠 **Divide $v_y$ by $v_x$ — time cancels, slope remains**
Dividing the components gives $dy/dx$ directly. Separate the variables and integrate to get the equation of the path.

✏️
$v_x = Ky, \\qquad v_y = Kx$

$\\frac{dy}{dx} = \\frac{v_y}{v_x} = \\frac{x}{y}$

Separate and integrate:

$y\\,dy = x\\,dx \\implies y^2 = x^2 + \\text{constant}$

⚠️ **Trap** The velocity is $K(y\\hat{i} + x\\hat{j})$ — the $y$ sits on the $\\hat{i}$ side, so $v_x = Ky$, not $Kx$. Mix them up and you get $dy/dx = y/x$, which gives a straight line through the origin — that's option (b).

$\\boxed{\\text{Answer: (d)}}$`
  },

  'MIP-004': {
    text_markdown: `🧠 **Two conditions, two equations: $|\\vec{A}|=|\\vec{B}|$ and $\\vec{A}\\cdot\\vec{B}=0$**
"Same distance from origin" gives the magnitude equation. "Perpendicular" gives the dot product equation. Together they pin down $n$ and $p$.

✏️
Equal magnitudes ($x$ and $z$ terms of $\\vec{A}$ and $\\vec{B}$ contribute equally, so they cancel):

$9n^2 = 16p^2 \\qquad \\cdots (1)$

Dot product $= 0$:

$(2)(2) + (3n)(-2) + (2)(4p) = 0 \\implies p = \\frac{3n-2}{4} \\qquad \\cdots (2)$

Sub $(2)$ into $(1)$:

$9n^2 = (3n - 2)^2 = 9n^2 - 12n + 4$

$n = \\frac{1}{3} \\implies n^{-1} = 3$

⚠️ **Trap** Many students use only the magnitude condition (1) and get stuck with two unknowns. You need *both* conditions — magnitude AND perpendicularity — to nail $n$ uniquely.

$\\boxed{\\text{Answer: }3}$`
  },

  'MIP-005': {
    text_markdown: `🧠 **Resultant = a side → angle is obtuse**
When the diagonal of the parallelogram equals one of its sides, the law of cosines forces $\\cos\\theta$ to be negative. Just plug into $R^2 = F_1^2 + F_2^2 + 2F_1 F_2 \\cos\\theta$ and solve.

✏️
Let $|\\vec{F_1}| = F$, so $|\\vec{F_2}| = |\\vec{R}| = 3F$:

$9F^2 = F^2 + 9F^2 + 6F^2\\cos\\theta$

$0 = 1 + 6\\cos\\theta$

$\\cos\\theta = -\\frac{1}{6}$

Since $\\theta = \\cos^{-1}(1/n)$, we get $n = -6$.

⚠️ **Trap** The question asks for $|n|$, not $n$. The angle is obtuse so $n$ is negative — writing $-6$ loses you the mark.

$\\boxed{\\text{Answer: }6}$`
  },

  'MIP-006': {
    text_markdown: `🧠 **The $\\vec{P}$ terms cancel — only $\\vec{Q}$ survives**
Add the two given vectors first. The $+2\\vec{P}$ and $-2\\vec{P}$ kill each other, leaving a vector entirely along $\\vec{Q}$.

✏️
$(2\\vec{Q} + 2\\vec{P}) + (2\\vec{Q} - 2\\vec{P}) = 4\\vec{Q}$

$4\\vec{Q}$ points in the same direction as $\\vec{Q}$, so the angle between them is $0°$.

⚠️ **Trap** Options (a) and (c) tempt you toward $90°$ or $180°$ — angles that *would* matter if $\\vec{P}$ and $\\vec{Q}$ were in the answer. But the $\\vec{P}$ cancels in the sum, so the angle has nothing to do with $\\vec{P}$ at all.

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-007': {
    text_markdown: `🧠 **Perpendicular forces? Pythagoras, nothing else**
For perpendicular vectors, the resultant is the hypotenuse — no $\\cos\\theta$ term, just $\\sqrt{F_1^2 + F_2^2}$.

✏️
$|R| = \\sqrt{A^2 + \\left(\\frac{A}{2}\\right)^2} = \\sqrt{\\frac{5A^2}{4}} = \\frac{\\sqrt{5}\\,A}{2}$

⚠️ **Trap** Option (a) has $\\sqrt{5}A/4$ — that's what you get if you compute $\\frac{A}{2}$ incorrectly when squaring. Remember: $\\left(\\frac{A}{2}\\right)^2 = \\frac{A^2}{4}$, so $\\sqrt{A^2 + \\frac{A^2}{4}} = \\sqrt{\\frac{5A^2}{4}} = \\frac{\\sqrt{5}A}{2}$, not $\\frac{\\sqrt{5}A}{4}$.

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-008': {
    text_markdown: `🧠 **Rearrange the equation, then take the magnitude**
$\\vec{B} - \\vec{A} = 2\\hat{j}$ gives $\\vec{B} = \\vec{A} + 2\\hat{j}$. Add component-wise and compute $|\\vec{B}|$.

✏️
$\\vec{B} = \\vec{A} + 2\\hat{j} = 2\\hat{i} + 5\\hat{j} + 2\\hat{k}$

$|\\vec{B}| = \\sqrt{4 + 25 + 4} = \\sqrt{33}$

$\\boxed{\\text{Answer: (d)}}$`
  },

  'MIP-009': {
    text_markdown: `🧠 **Angle from $y$-axis swaps $\\sin$ and $\\cos$**
When the angle is measured from the $y$-axis (not the usual $x$-axis), the $y$-component uses $\\cos\\theta$ and the $x$-component uses $\\sin\\theta$. The standard formulas swap roles.

✏️
$y\\text{-component} = |A|\\cos30° = 2\\sqrt{3} \\implies |A| = 4$

$x\\text{-component} = |A|\\sin30° = 4 \\times \\frac{1}{2} = 2$

⚠️ **Trap** Most students write $y = |A|\\sin\\theta$ by habit — that's only valid when $\\theta$ is measured from the $x$-axis. Here $\\theta$ is from the $y$-axis, so the $\\sin$ and $\\cos$ roles flip.

$\\boxed{\\text{Answer: (c)}}$`
  },

  'MIP-010': {
    text_markdown: `🧠 **Arc gives the radius; chord gives the displacement**
Arc length $= r\\theta$ converts the given $60$ m into the radius. Then the chord (straight-line displacement) follows from the cosine rule on the isoceles triangle formed by the two radii.

✏️
Arc length: $60 = r \\times \\frac{3\\pi}{4} \\implies r = \\frac{80}{\\pi}$ m

Chord using cosine rule ($\\cos135° = -0.7$):

$d^2 = 2r^2(1 - \\cos135°) = 2r^2 \\times 1.7 = 3.4r^2$

$d = r\\sqrt{3.4} = \\frac{80}{\\pi} \\times \\sqrt{3.4} \\approx 47$ m

⚠️ **Trap** A very common mistake is treating the arc length as the displacement. Displacement is always the *straight line* between start and end — the arc is just the path travelled.

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-011': {
    text_markdown: `🧠 **Decompose $\\vec{B}$ along and perpendicular to $\\vec{A}$**
Split $\\vec{B}$ into its component along $\\vec{A}$ (which subtracts from $A$) and its perpendicular component (which stays untouched). The angle of the resultant follows from $\\tan = \\frac{\\perp}{\\parallel}$.

✏️
Component of $\\vec{B}$ along $\\vec{A}$: $B\\cos60° = \\frac{B}{2}$

Component of $\\vec{B}$ perpendicular to $\\vec{A}$: $B\\sin60° = \\frac{\\sqrt{3}\\,B}{2}$

For $(\\vec{A} - \\vec{B})$: along-$\\vec{A}$ component $= A - \\frac{B}{2} = \\frac{2A-B}{2}$, perpendicular component $= \\frac{\\sqrt{3}\\,B}{2}$

$\\tan\\phi = \\frac{\\sqrt{3}\\,B/2}{(2A-B)/2} = \\frac{\\sqrt{3}\\,B}{2A-B}$

$\\phi = \\tan^{-1}\\!\\left(\\frac{\\sqrt{3}\\,B}{2A-B}\\right)$

⚠️ **Trap** Option (a) puts $\\cos\\theta$ in the numerator — but that's the along-$\\vec{A}$ component. In $\\tan(\\text{angle from }\\vec{A})$, the perpendicular component goes on top and the parallel component goes on the bottom.

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-012': {
    text_markdown: `🧠 **Dot = cross magnitude means $\\tan\\theta = 1$**
$\\vec{A}\\cdot\\vec{B}$ carries $\\cos\\theta$, $|\\vec{A}\\times\\vec{B}|$ carries $\\sin\\theta$. Equating them gives $\\tan\\theta = 1$, so $\\theta = 45°$ — drop this straight into $|\\vec{A}-\\vec{B}|^2$.

✏️
$AB\\cos\\theta = AB\\sin\\theta \\implies \\tan\\theta = 1 \\implies \\theta = 45°$

$|\\vec{A} - \\vec{B}|^2 = A^2 + B^2 - 2AB\\cos45° = A^2 + B^2 - \\sqrt{2}\\,AB$

$|\\vec{A} - \\vec{B}| = \\sqrt{A^2 + B^2 - \\sqrt{2}\\,AB}$

⚠️ **Trap** The $-2AB\\cos 45°$ becomes $-\\sqrt{2}\\,AB$, NOT $-AB$. The factor of 2 multiplied by $\\cos 45° = 1/\\sqrt{2}$ gives $\\sqrt{2}$. Drop this and you'll wrongly pick the option with just $-AB$ inside the square root.

$\\boxed{\\text{Answer: (d)}}$`
  },

  'MIP-013': {
    text_markdown: `🧠 **Two resultant equations, square both, divide**
Write $R^2$ before and after doubling $Q$. The condition $R_2 = 2R_1$ becomes $R_2^2 = 4R_1^2$ — that's one clean equation in $\\cos\\theta$.

✏️
$R_1^2 = (2F)^2 + (3F)^2 + 2(2F)(3F)\\cos\\theta = F^2(13 + 12\\cos\\theta)$

$R_2^2 = (2F)^2 + (6F)^2 + 2(2F)(6F)\\cos\\theta = F^2(40 + 24\\cos\\theta)$

Setting $R_2^2 = 4R_1^2$:

$40 + 24\\cos\\theta = 52 + 48\\cos\\theta$

$-24\\cos\\theta = 12 \\implies \\cos\\theta = -\\frac{1}{2} \\implies \\theta = 120°$

⚠️ **Trap** "Resultant doubles" means $R_2 = 2R_1$, which on squaring gives $R_2^2 = 4R_1^2$, NOT $R_2^2 = 2R_1^2$. Forgetting to square the 2 is the single most common error here.

$\\boxed{\\text{Answer: (a)}}$`
  },

  'MIP-014': {
    text_markdown: `🧠 **Scalar triple product = $3\\times3$ determinant**
$\\vec{A}\\cdot(\\vec{B}\\times\\vec{C})$ is the determinant of the matrix whose rows are the three vectors' components. Setting it to zero gives one equation in $x$.

✏️
$\\begin{vmatrix} -x & -6 & -2 \\\\ -1 & 4 & 3 \\\\ -8 & -1 & 3 \\end{vmatrix} = 0$

Expanding along row 1:

$-x(12+3) + 6(-3+24) - 2(1+32) = 0$

$-15x + 126 - 66 = 0 \\implies x = 4$

$\\boxed{\\text{Answer: }4}$`
  },

  'MIP-015': {
    text_markdown: `🧠 **Perpendicular vectors: dot product = 0**
Perpendicularity means $\\vec{P}\\cdot\\vec{Q} = 0$. Compute it, set equal to zero, solve the resulting quadratic.

✏️
$\\vec{P} \\cdot \\vec{Q} = (1)(4) + (2m)(-2) + (m)(m) = 0$

$m^2 - 4m + 4 = 0 \\implies (m-2)^2 = 0 \\implies m = 2$

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-016': {
    text_markdown: `🧠 **Match cross product to its scaled unit vector**
Compute $\\vec{P}\\times\\vec{Q}$, then its magnitude. The unit vector is $(\\vec{P}\\times\\vec{Q})/|\\vec{P}\\times\\vec{Q}|$; matching the given form reads off $x$.

✏️
$\\vec{P} \\times \\vec{Q} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 3 & \\sqrt{3} & 2 \\\\ 4 & \\sqrt{3} & 2.5 \\end{vmatrix}$

$\\hat{i}$: $(\\sqrt{3})(2.5) - (2)(\\sqrt{3}) = 0.5\\sqrt{3}$

$\\hat{j}$: $-[(3)(2.5) - (2)(4)] = -[7.5 - 8] = 0.5$

$\\hat{k}$: $(3)(\\sqrt{3}) - (\\sqrt{3})(4) = -\\sqrt{3}$

$\\vec{P} \\times \\vec{Q} = 0.5\\sqrt{3}\\,\\hat{i} + 0.5\\hat{j} - \\sqrt{3}\\hat{k} = \\frac{1}{2}(\\sqrt{3}\\hat{i} + \\hat{j} - 2\\sqrt{3}\\hat{k})$

$|\\vec{P} \\times \\vec{Q}| = \\sqrt{0.75 + 0.25 + 3} = 2$

Unit vector $= \\frac{\\vec{P} \\times \\vec{Q}}{2} = \\frac{1}{4}(\\sqrt{3}\\hat{i} + \\hat{j} - 2\\sqrt{3}\\hat{k})$, so $x = 4$

⚠️ **Trap** After computing $\\vec{P}\\times\\vec{Q}$, don't stop. The unit vector needs you to divide by $|\\vec{P}\\times\\vec{Q}| = 2$. So $x = 2 \\times 2 = 4$ (one factor from the $\\frac{1}{2}$ pulled out, one from dividing by the magnitude). Stop at the cross product and you'll wrongly write $x = 2$.

$\\boxed{\\text{Answer: }4}$`
  },

  'MIP-017': {
    text_markdown: `🧠 **Scalar projection: $\\vec{A}\\cdot\\vec{B}/|\\vec{B}|$**
The magnitude of $\\vec{A}$'s shadow along $\\vec{B}$ is the dot product divided by $|\\vec{B}|$ — no $\\hat{B}$ at the end since the question asks for a scalar (magnitude in metres).

✏️
$\\vec{A} \\cdot \\vec{B} = (2)(1) + (3)(2) + (-1)(2) = 2 + 6 - 2 = 6$

$|\\vec{B}| = \\sqrt{1 + 4 + 4} = 3$

Component $= \\frac{\\vec{A} \\cdot \\vec{B}}{|\\vec{B}|} = \\frac{6}{3} = 2$ m

⚠️ **Trap** Don't confuse scalar projection ($\\vec{A}\\cdot\\vec{B}/|\\vec{B}|$, gives a number) with vector projection ($(\\vec{A}\\cdot\\vec{B}/|\\vec{B}|^2)\\vec{B}$, gives a vector). The question asks for "magnitude of component", which is the scalar form.

$\\boxed{\\text{Answer: }2}$`
  },

  'MIP-018': {
    text_markdown: `🧠 **Projection zero = dot product zero**
A zero projection means the two vectors are perpendicular. Set $\\vec{A}\\cdot\\vec{B} = 0$ and solve for $\\alpha$.

✏️
$(2)(1) + (4)(2) + (-2)(\\alpha) = 0$

$2 + 8 - 2\\alpha = 0 \\implies \\alpha = 5$

$\\boxed{\\text{Answer: }5}$`
  },

  'MIP-019': {
    text_markdown: `🧠 **Any vector crossed with itself is the zero vector**
$\\vec{A}\\times\\vec{A}$ has $\\sin 0° = 0$ in the formula. So it's *always* the zero vector — direction-less, magnitude-less.

✏️
$\\vec{A} \\times \\vec{A} = |\\vec{A}||\\vec{A}|\\sin 0°\\,\\hat{n} = \\vec{0}$

This is always a zero *vector*, never a positive or negative number (a cross product is a vector, not a scalar).

⚠️ **Trap** Option (a) says $\\vec{A}\\cdot\\vec{A} = 0$ — but $\\vec{A}\\cdot\\vec{A} = |\\vec{A}|^2$, which is non-zero since $|\\vec{A}|$ is a non-zero constant. Options (b) and (d) treat the cross product as a scalar — wrong; "$<0$" or "$>0$" makes no sense for a vector.

$\\boxed{\\text{Answer: (c)}}$`
  },

  'MIP-020': {
    text_markdown: `🧠 **Vector projection: scalar piece × $\\hat{B}$ direction**
The vector projection of $\\vec{A}$ onto $\\vec{B}$ is $\\frac{\\vec{A}\\cdot\\vec{B}}{|\\vec{B}|^2}\\vec{B}$ — direction along $\\vec{B}$, magnitude = scalar projection.

✏️
$\\vec{A} \\cdot \\vec{B} = 1 + 1 + 0 = 2, \\quad |\\vec{B}|^2 = 1 + 1 = 2$

Projection $= \\frac{2}{2}(\\hat{i} + \\hat{j}) = \\hat{i} + \\hat{j}$

⚠️ **Trap** Options (a) and (b) include $\\hat{k}$ — but the projection onto $\\vec{B}$ can never have a $\\hat{k}$ component, since $\\vec{B}$ itself has none. Option (c) has the right direction but scales by $\\sqrt{2}$ — that's the scalar projection number, not the vector form.

$\\boxed{\\text{Answer: (d)}}$`
  },

  'MIP-021': {
    text_markdown: `🧠 **Cross product is anti-commutative — equality forces zero**
$\\vec{P}\\times\\vec{Q} = -(\\vec{Q}\\times\\vec{P})$ always. So $\\vec{P}\\times\\vec{Q} = \\vec{Q}\\times\\vec{P}$ can only happen when both sides are the zero vector — meaning $\\sin\\theta = 0$.

✏️
$\\vec{P} \\times \\vec{Q} = -(\\vec{Q} \\times \\vec{P})$

For the given equality: $\\vec{P} \\times \\vec{Q} = -\\vec{P} \\times \\vec{Q} \\implies 2(\\vec{P} \\times \\vec{Q}) = \\vec{0}$

$|\\vec{P}||\\vec{Q}|\\sin\\theta = 0$

Magnitudes are non-zero, so $\\sin\\theta = 0 \\implies \\theta = 0°$ or $180°$.

⚠️ **Trap** $\\theta = 0°$ also makes the cross product zero — but the question says $0° < \\theta < 360°$, which excludes $0°$. So only $\\theta = 180°$ survives. Many students write $0°$ without checking the allowed range.

$\\boxed{\\text{Answer: }180°}$`
  },

  'MIP-022': {
    text_markdown: `🧠 **Extract $\\vec{A_1}\\cdot\\vec{A_2}$ from the resultant magnitude**
Expanding the product gives a combination of $|\\vec{A_1}|^2$, $|\\vec{A_2}|^2$, and $\\vec{A_1}\\cdot\\vec{A_2}$. The first two are given directly; the third comes from squaring $|\\vec{A_1}+\\vec{A_2}|$.

✏️
Expand: $(2\\vec{A_1} + 3\\vec{A_2}) \\cdot (3\\vec{A_1} - 2\\vec{A_2}) = 6|\\vec{A_1}|^2 + 5(\\vec{A_1} \\cdot \\vec{A_2}) - 6|\\vec{A_2}|^2$

Find $\\vec{A_1} \\cdot \\vec{A_2}$:

$|\\vec{A_1} + \\vec{A_2}|^2 = |\\vec{A_1}|^2 + 2(\\vec{A_1} \\cdot \\vec{A_2}) + |\\vec{A_2}|^2$

$25 = 9 + 2(\\vec{A_1} \\cdot \\vec{A_2}) + 25 \\implies \\vec{A_1} \\cdot \\vec{A_2} = -\\frac{9}{2}$

Substitute:

$6(9) + 5\\!\\left(-\\frac{9}{2}\\right) - 6(25) = 54 - 22.5 - 150 = -118.5$

⚠️ **Trap** The cross terms in the expansion are $-4(\\vec{A_1}\\cdot\\vec{A_2}) + 9(\\vec{A_2}\\cdot\\vec{A_1}) = +5(\\vec{A_1}\\cdot\\vec{A_2})$ — positive 5, not $\\pm 6$ or $-5$. Sign errors here flip the final value.

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-023': {
    text_markdown: `🧠 **In product/quotient errors, exponents become coefficients**
For $C = p^a q^b / (r^c \\sqrt{s})$, the fractional error in $C$ is $a\\cdot\\Delta p/p + b\\cdot\\Delta q/q + c\\cdot\\Delta r/r + \\frac{1}{2}\\cdot\\Delta s/s$. Powers in the formula become multipliers on the percentage errors.

✏️
$\\frac{\\Delta C}{C} \\times 100 = \\frac{\\Delta p}{p} + 2\\frac{\\Delta q}{q} + 3\\frac{\\Delta r}{r} + \\frac{1}{2}\\frac{\\Delta s}{s}$

$= 1 + 2(2) + 3(3) + \\frac{1}{2}(2) = 1 + 4 + 9 + 1 = 15\\%$

⚠️ **Trap** The exponent on $r$ is 3 and on $s$ is $\\frac{1}{2}$ (from $\\sqrt{s}$). A common mistake is to forget the $\\frac{1}{2}$ and write $2\\%$ instead of $1\\%$ for $s$'s contribution, or to treat the exponent of $\\sqrt{s}$ as $2$.

$\\boxed{\\text{Answer: }15}$`
  },

  'MIP-024': {
    text_markdown: `🧠 **In multiplication, the least sig-fig count wins**
For $\\times$ and $\\div$, the result has as many significant figures as the input with the *fewest* sig figs. Calculate first, then round to that limit.

✏️
$32.3$ → 3 sig figs; $\\quad 1125$ → 4 sig figs; $\\quad 27.4$ → 3 sig figs

Least $= 3$ sig figs

Calculated value: $\\frac{32.3 \\times 1125}{27.4} \\approx 1326.2$

Rounded to 3 sig figs: $1330$

⚠️ **Trap** Writing $1326.2$ or $1326.19$ is wrong even though the raw computation gives that — it claims more precision than the data supports. The least-count rule forces you to drop the last two digits here.

$\\boxed{\\text{Answer: (b)}}$`
  },

  'MIP-025': {
    text_markdown: `🧠 **The mean inherits the least precise reading's decimals**
After averaging, the answer can never be more precise than the least precise input. Find the reading with the fewest decimal places and round the mean to match it.

✏️
Mean $= \\frac{4.62 + 4.632 + 4.6 + 4.64}{4} = \\frac{18.492}{4} = 4.623$ s

The least precise reading is $4.6$ s (1 decimal place), so the mean must be reported to 1 decimal place:

Mean $= 4.6$ s

⚠️ **Trap** $4.623$ s is the raw average but it's incorrectly precise — you're claiming a level of accuracy that your worst instrument doesn't support. In experimental physics, the final answer can never be more precise than the least precise measurement that went into it.

$\\boxed{\\text{Answer: (c)}}$`
  }
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const now = new Date();
  let ok = 0, fail = 0;
  for (const [display_id, update] of Object.entries(UPDATES)) {
    try {
      const res = await col.updateOne({ display_id }, { $set: {
        'solution.text_markdown': update.text_markdown,
        'solution.latex_validated': false,
        updated_at: now, updated_by: 'ai_agent'
      }});
      if (res.matchedCount === 0) { console.log(`⚠️  ${display_id}: not found`); fail++; }
      else { console.log(`✅ ${display_id}`); ok++; }
    } catch (e) { console.log(`❌ ${display_id}: ${e.message}`); fail++; }
  }
  console.log(`\n📊 ${ok} updated, ${fail} failed`);
  await client.close();
}
main();
