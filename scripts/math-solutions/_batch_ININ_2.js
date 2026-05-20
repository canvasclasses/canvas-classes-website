module.exports = [
  {
    display_id: 'ININ-011',
    answer: { correct_option: 'd' },
    solution: `**🧠 $ x^{3} $ Means "Save One $x$ for $du$"**

Read the integrand: $ x^{3}\\sqrt{3-x^{2}} $. The radical contains $ 3-x^{2} $. Whenever you see $ \\sqrt{a^{2}-x^{2}} $ or any polynomial in $ x^{2} $ inside a root, your first reflex should be the substitution $ u = a^{2}-x^{2} $ (or whatever is under the root), provided you have an $x$ outside that can pair with $ dx $ to make $ du $.

Here we have $ x^{3} $ outside, which we split as $ x^{2}\\cdot x $. The $x$ pairs with $ dx $ to give $ du/(-2) $, and the leftover $ x^{2} $ becomes $ 3-u $. So the integrand turns into a polynomial in $u$ — easy power-rule territory.

The boundary condition $ 5f(\\sqrt{2}) = -4 $ pins the integration constant. The value $ \\sqrt{2} $ is picked because $ 3 - (\\sqrt{2})^{2} = 1 $, which is the cleanest possible $u$.

This is the habit I want you to build. Whenever you see $ x^{2k+1}\\cdot(\\text{function of }x^{2}) $, save one $x$ for $du$ and convert the rest of the $x^{2}$ in terms of $u$.

**🗺️ Working It Out**

Let $ u = 3-x^{2} $, $ du = -2x\\,dx $, so $ x\\,dx = -du/2 $. Also $ x^{2} = 3-u $.

$f(x) = \\int x^{3}\\sqrt{3-x^{2}}\\,dx = \\int x^{2}\\cdot\\sqrt{3-x^{2}}\\cdot x\\,dx = \\int (3-u)\\sqrt{u}\\cdot\\left(-\\dfrac{du}{2}\\right)$
$= -\\dfrac{1}{2}\\int(3u^{1/2}-u^{3/2})\\,du = -\\dfrac{1}{2}\\left[3\\cdot\\dfrac{2u^{3/2}}{3}-\\dfrac{2u^{5/2}}{5}\\right]+C = -u^{3/2}+\\dfrac{u^{5/2}}{5}+C$
$= -(3-x^{2})^{3/2}+\\dfrac{(3-x^{2})^{5/2}}{5}+C$.

**Pin down $C$.** At $ x = \\sqrt{2} $: $ 3-x^{2} = 1 $.
$f(\\sqrt{2}) = -1+\\dfrac{1}{5}+C = -\\dfrac{4}{5}+C$.

Given $ 5f(\\sqrt{2}) = -4 $, so $ f(\\sqrt{2}) = -\\dfrac{4}{5} $. Therefore $ C = 0 $.

**Evaluate $ f(1) $.** $ 3-x^{2} = 2 $.
$f(1) = -2^{3/2}+\\dfrac{2^{5/2}}{5} = -2\\sqrt{2}+\\dfrac{4\\sqrt{2}}{5} = \\dfrac{-10\\sqrt{2}+4\\sqrt{2}}{5} = -\\dfrac{6\\sqrt{2}}{5}$.

**⚡ The "Save One $x$" Reflex**

Whenever the integrand is $ x^{2k+1} \\cdot g(x^{2}) $ — an odd power of $x$ times any function of $x^{2}$ — set $ u = x^{2} $ (or, if there is a root, $u$ = whatever is under the root that contains $ x^{2} $). The $x\\,dx$ on the outside becomes $ du/2 $, and the remaining $ x^{2k} = (x^{2})^{k} $ becomes $ u^{k} $. The integral becomes a polynomial-times-power problem. This same template kills 80% of "polynomial times radical of polynomial" integrals on JEE.

**⚠️ Where Students Get Stuck**

⚠️ **Splitting $ x^{3} $ as $ x\\cdot x\\cdot x $ and getting lost.** The clean split is $ x^{3} = x^{2}\\cdot x $: the $ x^{2} $ converts directly to $ 3-u $, and the $ x\\,dx $ becomes $ -du/2 $. Two pieces, one move each.

⚠️ **Computing $ 2^{5/2} $ as $ 4 $ or $ 8 $ instead of $ 4\\sqrt{2} $.** $ 2^{5/2} = (2^{2})\\cdot 2^{1/2} = 4\\sqrt{2} $. Many students slip here and pick option (c) with $ -4\\sqrt{2}/5 $. Always pull out the integer part of half-integer powers: $ 2^{5/2} = 2^{2}\\cdot\\sqrt{2} $.

⚠️ **Forgetting $ C = 0 $.** Some students compute the antiderivative and immediately plug $ x = 1 $ without enforcing the boundary condition. Then they pick option (a). Always use the given condition first to find $C$.

$\\boxed{\\text{Answer: (d) } -\\dfrac{6\\sqrt{2}}{5}}$`,
  },

  {
    display_id: 'ININ-012',
    answer: { integer_value: 19 },
    solution: `**🧠 Factor Inside the Radical First — That Unlocks Everything**

Read the integrand. The radical is $ \\sqrt[23]{3x^{-24}+x^{-26}} $. The two exponents inside are $ -24 $ and $ -26 $. Whenever you see two negative powers inside a root and they differ by 2, your first move should be to factor out the common factor.

Notice $ 3x^{-24}+x^{-26} = x^{-23}(3x^{-1}+x^{-3}) $. So the radical becomes $ \\left[x^{-23}(3x^{-1}+x^{-3})\\right]^{1/23} = x^{-1}(3x^{-1}+x^{-3})^{1/23} $.

Now the integrand is $ (x^{-1}+x^{-3})\\cdot x^{-1}\\cdot(3x^{-1}+x^{-3})^{1/23} = (x^{-2}+x^{-4})(3x^{-1}+x^{-3})^{1/23} $. Look at the $ x^{-2}+x^{-4} $ outside — that is exactly $ -\\dfrac{1}{3}\\dfrac{d}{dx}[3x^{-1}+x^{-3}] $ because $ \\dfrac{d}{dx}[3x^{-1}+x^{-3}] = -3x^{-2}-3x^{-4} = -3(x^{-2}+x^{-4}) $.

So substitution $ u = 3x^{-1}+x^{-3} $ gives $ du = -3(x^{-2}+x^{-4})\\,dx $. The integral becomes $ -\\dfrac{1}{3}\\int u^{1/23}\\,du $ — a one-step power rule.

This is the habit I want you to build. Whenever JEE shows you a radical $ \\sqrt[n]{A x^{p}+x^{q}} $ inside an integral that "doesn't simplify", the hidden move is always to factor the lowest power out of the radicand. The remainder is almost always related to the rest of the integrand by a simple derivative.

**🗺️ Working It Out**

Factor $ 3x^{-24}+x^{-26} = x^{-23}(3x^{-1}+x^{-3}) $, so
$\\sqrt[23]{3x^{-24}+x^{-26}} = x^{-1}(3x^{-1}+x^{-3})^{1/23}$.

Integrand:
$(x^{-1}+x^{-3})\\cdot x^{-1}(3x^{-1}+x^{-3})^{1/23} = (x^{-2}+x^{-4})(3x^{-1}+x^{-3})^{1/23}$.

Let $ u = 3x^{-1}+x^{-3} $. Then $ du = -3(x^{-2}+x^{-4})\\,dx $, so $ (x^{-2}+x^{-4})\\,dx = -\\dfrac{du}{3} $.

$\\int(x^{-2}+x^{-4})(3x^{-1}+x^{-3})^{1/23}\\,dx = -\\dfrac{1}{3}\\int u^{1/23}\\,du = -\\dfrac{1}{3}\\cdot\\dfrac{u^{24/23}}{24/23}+C = -\\dfrac{23}{72}\\,u^{24/23}+C$.

So
$\\int = -\\dfrac{23}{72}(3x^{-1}+x^{-3})^{24/23}+C$.

Matching with the stated form $ -\\dfrac{\\alpha}{3(\\alpha+1)}(3x^{\\beta}+x^{\\gamma})^{(\\alpha+1)/\\alpha}+C $: the exponent $ \\dfrac{\\alpha+1}{\\alpha} = \\dfrac{24}{23} $, so $ \\alpha = 23 $. The constant $ \\dfrac{\\alpha}{3(\\alpha+1)} = \\dfrac{23}{72} $. ✓ And $ \\beta = -1, \\gamma = -3 $.

So $ \\alpha+\\beta+\\gamma = 23+(-1)+(-3) = 19 $.

**⚡ The "Factor the Radicand" Move**

For any $ \\sqrt[n]{A x^{p}+x^{q}} $ where $p < q$ (or vice versa), factor $ x^{p} $ (the lower power) out of the radicand to get $ \\sqrt[n]{x^{p}(A+x^{q-p})} = x^{p/n}\\cdot(A+x^{q-p})^{1/n} $. The point is to move the $x$-power outside, leaving a cleaner $ (A+x^{r}) $ inside. Then the rest of the integrand almost always lines up with the derivative of that cleaner expression. This is one of the highest-value JEE patterns — the integrand is engineered around it. If you see negative-power numbers like $ -24, -26 $, do not panic — factor them.

**⚠️ Where Students Get Stuck**

⚠️ **Trying $ u = 3x^{-24}+x^{-26} $ directly.** Then $ du = -72 x^{-25}-26 x^{-27}\\,dx $, which does NOT match the $ x^{-1}+x^{-3} $ outside. You'd have to manipulate the rest of the integrand into that form, and the algebra is painful. Factoring first gives you a clean derivative match.

⚠️ **Matching coefficients carelessly.** The given form has $ \\dfrac{\\alpha}{3(\\alpha+1)} $ — make sure the constant in front of your answer fits this exact pattern. With $ \\alpha = 23 $: $ 23/(3\\cdot 24) = 23/72 $. ✓

⚠️ **Reading $ \\beta, \\gamma $ off the wrong factorisation.** The form is $ (3x^{\\beta}+x^{\\gamma}) $ — with $3$ on the first term and $1$ on the second. Our answer $ (3x^{-1}+x^{-3}) $ has $ \\beta = -1 $ and $ \\gamma = -3 $ in that order. Reverse them and you get $ \\beta+\\gamma = -4 $ regardless, but it's the right reflex to keep order.

$\\boxed{\\text{Answer: } 19}$`,
  },

  {
    display_id: 'ININ-013',
    answer: { integer_value: 16 },
    solution: `**🧠 Differentiate the Form — That Tells You $\\alpha$ and $\\beta$**

Read the question. The RHS is given in pieces: $ x\\sqrt{x^{2}+x+1}+\\alpha\\sqrt{x^{2}+x+1}+\\beta\\log_{e}|\\cdots| $. Each piece is a standard antiderivative form. Your first move should be to differentiate each piece, then match coefficients to the integrand. This is far cleaner than trying to integrate the LHS from scratch.

Why this works: each piece on the RHS is one of the three standard antiderivatives for $ \\dfrac{\\text{polynomial}}{\\sqrt{x^{2}+x+1}} $-type integrands:
$\\dfrac{d}{dx}[x\\sqrt{x^{2}+x+1}]\\to$ gives the $ x^{2} $ piece,
$\\dfrac{d}{dx}[\\sqrt{x^{2}+x+1}]\\to$ gives the $ x $ piece,
$\\dfrac{d}{dx}[\\log_{e}|x+1/2+\\sqrt{x^{2}+x+1}|]\\to$ gives the constant piece.

So the question is set up as a coefficient-matching problem, not an integration problem. This is a JEE specialty — they rarely make you derive these antiderivatives from scratch.

This is the habit I want you to build. When the answer-form is given in pieces, differentiate each piece and compare coefficients. It is six times faster than direct integration.

**🗺️ Working It Out**

Compute each derivative.

**Piece 1.** $ \\dfrac{d}{dx}[x\\sqrt{x^{2}+x+1}] = \\sqrt{x^{2}+x+1}+x\\cdot\\dfrac{2x+1}{2\\sqrt{x^{2}+x+1}} = \\dfrac{2(x^{2}+x+1)+x(2x+1)}{2\\sqrt{x^{2}+x+1}} = \\dfrac{4x^{2}+3x+2}{2\\sqrt{x^{2}+x+1}} $.

**Piece 2.** $ \\dfrac{d}{dx}\\sqrt{x^{2}+x+1} = \\dfrac{2x+1}{2\\sqrt{x^{2}+x+1}} $.

**Piece 3.** $ \\dfrac{d}{dx}\\log_{e}\\left|x+\\dfrac{1}{2}+\\sqrt{x^{2}+x+1}\\right| = \\dfrac{1}{\\sqrt{x^{2}+x+1}} $.

(This last one is the standard $ \\int\\frac{dx}{\\sqrt{x^{2}+x+1}} $ result. To verify: let $ g = x+1/2+\\sqrt{x^{2}+x+1} $. Then $ g' = 1+(2x+1)/[2\\sqrt{x^{2}+x+1}] = [2\\sqrt{x^{2}+x+1}+(2x+1)]/[2\\sqrt{x^{2}+x+1}] = 2g/[2\\sqrt{x^{2}+x+1}] = g/\\sqrt{x^{2}+x+1} $, so $ g'/g = 1/\\sqrt{x^{2}+x+1} $.)

Set the sum equal to the integrand:
$\\dfrac{4x^{2}+3x+2}{2\\sqrt{x^{2}+x+1}}+\\alpha\\cdot\\dfrac{2x+1}{2\\sqrt{x^{2}+x+1}}+\\beta\\cdot\\dfrac{1}{\\sqrt{x^{2}+x+1}} = \\dfrac{2x^{2}+5x+9}{\\sqrt{x^{2}+x+1}}$.

Multiply both sides by $ \\sqrt{x^{2}+x+1} $:
$\\dfrac{4x^{2}+3x+2}{2}+\\alpha\\cdot\\dfrac{2x+1}{2}+\\beta = 2x^{2}+5x+9$.

Expand:
$2x^{2}+\\dfrac{3x}{2}+1+\\alpha x+\\dfrac{\\alpha}{2}+\\beta = 2x^{2}+5x+9$.

Match coefficients.
- $ x $: $ \\dfrac{3}{2}+\\alpha = 5 \\Rightarrow \\alpha = \\dfrac{7}{2} $.
- constant: $ 1+\\dfrac{\\alpha}{2}+\\beta = 9 \\Rightarrow \\beta = 9-1-\\dfrac{7}{4} = 8-\\dfrac{7}{4} = \\dfrac{25}{4} $.

So $ \\alpha+2\\beta = \\dfrac{7}{2}+\\dfrac{25}{2} = \\dfrac{32}{2} = 16 $.

**⚡ The Three Standard $ \\sqrt{ax^{2}+bx+c} $ Antiderivatives**

Memorise these three and the entire family of "rational over $ \\sqrt{\\text{quadratic}} $" integrals becomes coefficient-matching:
$\\int\\dfrac{dx}{\\sqrt{ax^{2}+bx+c}} = \\dfrac{1}{\\sqrt{a}}\\log_{e}\\left|x+\\dfrac{b}{2a}+\\sqrt{x^{2}+bx/a+c/a}\\right|+C$ (for $ a > 0 $),
$\\int\\dfrac{dx}{ax^{2}+bx+c}$ standard quadratic-completion result,
$\\int\\sqrt{ax^{2}+bx+c}\\,dx = \\dfrac{(2ax+b)}{4a}\\sqrt{ax^{2}+bx+c}+\\dfrac{4ac-b^{2}}{8a}\\int\\dfrac{dx}{\\sqrt{ax^{2}+bx+c}}$.

Knowing these gives you the building blocks; the JEE just asks you to find the coefficients.

**⚠️ Where Students Get Stuck**

⚠️ **Forgetting that $ d/dx[x\\sqrt{f}] $ uses product rule.** It is $ \\sqrt{f}+x\\cdot f'/(2\\sqrt{f}) $, NOT just $ f'/\\sqrt{f} $. Many students lose the first $ \\sqrt{f} $ term and end up with wrong coefficients on $ x^{2} $.

⚠️ **Arithmetic on the $ \\beta $ piece.** With $ \\alpha = 7/2 $, $ \\alpha/2 = 7/4 $. Then $ \\beta = 9-1-7/4 = 8-7/4 = 32/4 - 7/4 = 25/4 $. Be careful with the $1-\\alpha/2$ subtraction step.

⚠️ **Reading the answer form.** The question asks for $ \\alpha+2\\beta $, not $ \\alpha+\\beta $. $ \\alpha+2\\beta = 7/2+25/2 = 32/2 = 16 $. The "+2" is the question's check that you matched both coefficients correctly.

$\\boxed{\\text{Answer: } 16}$`,
  },

  {
    display_id: 'ININ-014',
    answer: { correct_option: 'a' },
    solution: `**🧠 The Integral Is a Disguised "Find $a$ and $b$" Question**

Read the question carefully. The integral itself is a well-known JEE form:
$\\int\\dfrac{dx}{a^{2}\\sin^{2}x+b^{2}\\cos^{2}x} = \\dfrac{1}{ab}\\tan^{-1}\\left(\\dfrac{a\\tan x}{b}\\right)+C$.

So this question is really asking: from the given answer $ \\dfrac{1}{12}\\tan^{-1}(3\\tan x) $, deduce $a$ and $b$. Then plug into the max-value formula for $ a\\sin x+b\\cos x $, which is $ \\sqrt{a^{2}+b^{2}} $.

The whole problem is a 30-second matching exercise once you know the standard form. The hint inside the question is the way the integral is written — JEE almost never asks you to evaluate this from scratch; they give you the result and ask you to read off the parameters.

This is the habit I want you to build. When a JEE question gives you the result of a standard integral with unknown constants, work backward: identify the standard form, match coefficients.

**🖼️ The Standard Form (Worth Memorising)**

$\\int\\dfrac{dx}{a^{2}\\sin^{2}x+b^{2}\\cos^{2}x} = \\dfrac{1}{ab}\\tan^{-1}\\left(\\dfrac{a\\tan x}{b}\\right)+C$.

(Derivation: divide numerator and denominator by $ \\cos^{2}x $, then substitute $ t = \\tan x $.)

**🗺️ Working It Out**

Match $ \\dfrac{1}{ab}\\tan^{-1}\\left(\\dfrac{a\\tan x}{b}\\right) $ with $ \\dfrac{1}{12}\\tan^{-1}(3\\tan x) $.

- $ \\dfrac{1}{ab} = \\dfrac{1}{12} \\Rightarrow ab = 12 $.
- $ \\dfrac{a}{b} = 3 \\Rightarrow a = 3b $.

Sub the second into the first: $ 3b\\cdot b = 12 \\Rightarrow b^{2} = 4 \\Rightarrow b = 2 $. So $ a = 6 $.

Maximum of $ a\\sin x+b\\cos x $ is $ \\sqrt{a^{2}+b^{2}} = \\sqrt{36+4} = \\sqrt{40} $.

**⚡ Why $ \\sqrt{a^{2}+b^{2}} $ Is the Maximum**

For any $ a\\sin x+b\\cos x $, write it as $ R\\sin(x+\\phi) $ where $ R = \\sqrt{a^{2}+b^{2}} $ and $ \\tan\\phi = b/a $. The expression $ R\\sin(x+\\phi) $ varies between $ -R $ and $ +R $, so the maximum is $R$ and the minimum is $ -R $. This is one of the highest-value identities on JEE — memorise it. Same idea: $ a\\cos x+b\\sin x \\in [-\\sqrt{a^{2}+b^{2}}, \\sqrt{a^{2}+b^{2}}] $.

**⚠️ Where Students Get Stuck**

⚠️ **Forgetting the standard integral.** Students who try to derive $ \\int dx/(a^{2}\\sin^{2}x+b^{2}\\cos^{2}x) $ from scratch waste 3 minutes. Memorise the standard form; the question is a 30-second one if you do.

⚠️ **Wrong sign convention.** The standard result has $ \\tan^{-1}(a\\tan x/b) $, NOT $ \\tan^{-1}(b\\tan x/a) $. The coefficient on $ \\tan x $ inside is $ a/b $, with $a$ from $ \\sin^{2}x $ and $b$ from $ \\cos^{2}x $. Mix this up and you get $ a $ and $ b $ swapped.

⚠️ **$ \\sqrt{40} $ vs $ \\sqrt{41} $ confusion.** $ a^{2}+b^{2} = 36+4 = 40 $, not $ 41 $. Option (b) is a trap for students who slip on $ a^{2} = 36 $ (and add $5$ somewhere instead of $4$). Double-check: $ a = 6, b = 2 $, $ a^{2} = 36, b^{2} = 4 $, sum $40$. ✓

$\\boxed{\\text{Answer: (a) } \\sqrt{40}}$`,
  },

  {
    display_id: 'ININ-015',
    answer: { correct_option: 'a' },
    solution: `**🧠 The $ x^{12}+3x^{6}+1 $ Is a Perfect $ (x^{3}+1/x^{3})^{2}+1 $ in Disguise**

Read the integrand. The denominator has $ x^{12}+3x^{6}+1 $ multiplied by $ \\tan^{-1}(x^{3}+1/x^{3}) $. The presence of $ x^{3}+1/x^{3} $ inside the arctan is a huge hint. Your first move should be to relate $ x^{12}+3x^{6}+1 $ to $ x^{3}+1/x^{3} $.

Compute: $ \\left(x^{3}+\\dfrac{1}{x^{3}}\\right)^{2}+1 = x^{6}+2+x^{-6}+1 = x^{6}+3+x^{-6} $. Multiply by $ x^{6} $: $ x^{12}+3x^{6}+1 $. So
$x^{12}+3x^{6}+1 = x^{6}\\left[\\left(x^{3}+\\dfrac{1}{x^{3}}\\right)^{2}+1\\right]$.

Now look at the numerator: $ x^{8}-x^{2} = x^{2}(x^{6}-1) $. And $ \\dfrac{d}{dx}\\left(x^{3}+\\dfrac{1}{x^{3}}\\right) = 3x^{2}-\\dfrac{3}{x^{4}} = \\dfrac{3(x^{6}-1)}{x^{4}} $. So $ x^{6}-1 = \\dfrac{x^{4}}{3}\\cdot\\dfrac{d}{dx}(x^{3}+1/x^{3}) $, meaning $ (x^{8}-x^{2}) = \\dfrac{x^{6}}{3}\\cdot\\dfrac{d}{dx}(x^{3}+1/x^{3}) $.

So the whole integrand is $ \\dfrac{(x^{8}-x^{2})\\,dx}{x^{6}[(x^{3}+1/x^{3})^{2}+1]\\tan^{-1}(x^{3}+1/x^{3})} = \\dfrac{1}{3}\\cdot\\dfrac{d(x^{3}+1/x^{3})}{[(x^{3}+1/x^{3})^{2}+1]\\tan^{-1}(x^{3}+1/x^{3})} $.

Two substitutions chained: $ u = x^{3}+1/x^{3} $ (kills the $x$-dependence), then $ v = \\tan^{-1}u $ (kills the $ u^{2}+1 $). Final integrand is $ \\dfrac{dv}{v} $.

This is the habit I want you to build. When you see $ \\tan^{-1}(f(x)) $ in the denominator with $ 1+f^{2}(x) $-type expressions elsewhere, the substitution chain $ u = f(x), v = \\tan^{-1}u $ unwinds the whole thing in two steps.

**🗺️ Working It Out**

Let $ u = x^{3}+\\dfrac{1}{x^{3}} $. Then
$du = \\left(3x^{2}-\\dfrac{3}{x^{4}}\\right)dx = 3\\cdot\\dfrac{x^{6}-1}{x^{4}}\\,dx$,
so $ (x^{6}-1)\\,dx = \\dfrac{x^{4}}{3}\\,du $, and therefore $ (x^{8}-x^{2})\\,dx = x^{2}(x^{6}-1)\\,dx = \\dfrac{x^{6}}{3}\\,du $.

Now plug everything into the integral:
$I = \\int\\dfrac{(x^{8}-x^{2})\\,dx}{(x^{12}+3x^{6}+1)\\tan^{-1}(u)} = \\int\\dfrac{(x^{6}/3)\\,du}{x^{6}(u^{2}+1)\\tan^{-1}(u)} = \\dfrac{1}{3}\\int\\dfrac{du}{(u^{2}+1)\\tan^{-1}(u)}$.

The $ x^{6} $ cancels cleanly. Now let $ v = \\tan^{-1}u $. Then $ dv = \\dfrac{du}{u^{2}+1} $.

$I = \\dfrac{1}{3}\\int\\dfrac{dv}{v} = \\dfrac{1}{3}\\log_{e}|v|+C = \\dfrac{1}{3}\\log_{e}|\\tan^{-1}u|+C = \\log_{e}\\left|\\tan^{-1}\\left(x^{3}+\\dfrac{1}{x^{3}}\\right)\\right|^{1/3}+C$.

That matches option (a).

**⚡ Two Substitutions in a Row — One Pattern**

Whenever the integrand has $ \\tan^{-1}(g(x)) $ in the denominator and $ 1+g^{2}(x) $ somewhere too, the chain $ u = g(x), v = \\tan^{-1}u $ always reduces it to $ \\int dv/v = \\log|v| $. Same chain with $ \\log $ in place of $ \\tan^{-1} $ — if you see $ \\log(g(x)) $ in the denominator and $ g'(x)/g(x) $ elsewhere, do $ u = g(x), v = \\log u $. Both are "two-step unwind" patterns that appear in JEE almost every year.

**⚠️ Where Students Get Stuck**

⚠️ **Missing the $ x^{6} $ factorisation.** The leap from $ x^{12}+3x^{6}+1 $ to $ x^{6}((x^{3}+1/x^{3})^{2}+1) $ is the whole question. If you do not spot this, the integral looks impossible. Always check whether high-degree polynomials in $x$ can be written in $ x^{k}+x^{-k} $ form by dividing by the middle power.

⚠️ **Trying $ u = x^{3} $ alone.** That converts $ \\tan^{-1}(u+1/u) $, not $ \\tan^{-1}(u) $. Students get stuck because the arctan does not simplify. The right inside-variable is $ x^{3}+1/x^{3} $, not $ x^{3} $.

⚠️ **Sign on $ d/dx(x^{3}+1/x^{3}) $.** This is $ 3x^{2}-3x^{-4} $, with a minus. Many students drop the minus and the rest of the computation falls apart. Write the derivative cleanly: $ d/dx(x^{-3}) = -3x^{-4} $.

⚠️ **Reading option (a) as $ \\log\\,\\,|\\cdots|^{1/3} $ vs $ (1/3)\\log|\\cdots| $.** They are the same: $ \\log|f|^{1/3} = (1/3)\\log|f| $. Option (b) has $ |\\cdots|^{1/2} $, option (d) has $ |\\cdots|^{3} $. The right exponent is $ 1/3 $, matching the $ 1/3 $ factor that came out of $ du = 3(x^{6}-1)/x^{4}\\,dx $.

$\\boxed{\\text{Answer: (a) } \\log\\left|\\tan^{-1}\\left(x^{3}+\\dfrac{1}{x^{3}}\\right)\\right|^{1/3}+C}$`,
  },

  {
    display_id: 'ININ-016',
    answer: { correct_option: 'a' },
    solution: `**🧠 The $ (1+x)\\,dx $ Is the Differential of $ xe^{x} $**

Read the integrand. You see $ xe^{x} $ in the denominator (squared) and $ x+1 $ in the numerator. Whenever you see $ xe^{x} $ in a JEE integral, your first reflex must be to recall:
$\\dfrac{d}{dx}(xe^{x}) = e^{x}+xe^{x} = (1+x)e^{x}$.

So $ d(xe^{x}) = (1+x)e^{x}\\,dx $. The $ (1+x) $ in our numerator is begging for this connection. The right substitution is $ t = 1+xe^{x} $, so that $ dt = (1+x)e^{x}\\,dx $.

The integrand $ \\dfrac{(x+1)\\,dx}{x(1+xe^{x})^{2}} $ has $ (x+1)\\,dx = dt/e^{x} $, and the $ x e^{x} $ in the denominator equals $ t-1 $. So everything in the integral converts to functions of $t$ — a clean rational-function integral.

The boundary condition $ \\lim_{x\\to\\infty}I(x)=0 $ pins the constant $C$.

This is the habit I want you to build. The pair "$ xe^{x} $ as one piece, $ (1+x)\\,dx $ as another" is a classic JEE coupling. Whenever you see $ xe^{x} $, look for $ (1+x) $ — it is always lurking nearby because their derivative-pair relation is built into the question.

**🗺️ Working It Out**

Let $ t = 1+xe^{x} $. Then $ dt = (1+x)e^{x}\\,dx $, so $ (1+x)\\,dx = dt/e^{x} $. Also $ xe^{x} = t-1 $.

$\\dfrac{(x+1)\\,dx}{x(1+xe^{x})^{2}} = \\dfrac{dt/e^{x}}{x\\cdot t^{2}} = \\dfrac{dt}{xe^{x}\\cdot t^{2}} = \\dfrac{dt}{(t-1)t^{2}}$.

So
$I(x) = \\int\\dfrac{dt}{(t-1)t^{2}}$.

**Partial fractions.** $ \\dfrac{1}{(t-1)t^{2}} = \\dfrac{A}{t-1}+\\dfrac{B}{t}+\\dfrac{C}{t^{2}} $. Cover-up tricks:
- At $ t=1 $: $ A = 1 $.
- At $ t=0 $: $ C = -1 $.
- Coefficient of $ t^{2} $: $ A+B = 0 \\Rightarrow B = -1 $.

So
$I = \\int\\left[\\dfrac{1}{t-1}-\\dfrac{1}{t}-\\dfrac{1}{t^{2}}\\right]dt = \\log_{e}|t-1|-\\log_{e}|t|+\\dfrac{1}{t}+C = \\log_{e}\\left|\\dfrac{t-1}{t}\\right|+\\dfrac{1}{t}+C$.

Substitute back $ t = 1+xe^{x} $:
$I(x) = \\log_{e}\\left|\\dfrac{xe^{x}}{1+xe^{x}}\\right|+\\dfrac{1}{1+xe^{x}}+C$.

**Pin down $C$.** As $ x\\to\\infty $: $ xe^{x}/(1+xe^{x})\\to 1 $, so $ \\log_{e}(\\cdots)\\to 0 $. And $ 1/(1+xe^{x})\\to 0 $. So $ \\lim I = C = 0 $.

**Evaluate $ I(1) $.** $ 1+xe^{x}\\big|_{x=1} = 1+e $. $ xe^{x}\\big|_{x=1} = e $.
$I(1) = \\log_{e}\\dfrac{e}{e+1}+\\dfrac{1}{e+1} = 1-\\log_{e}(e+1)+\\dfrac{1}{e+1}$.

Combine the two fractional terms: $ 1+\\dfrac{1}{e+1} = \\dfrac{e+1+1}{e+1} = \\dfrac{e+2}{e+1} $.

So $ I(1) = \\dfrac{e+2}{e+1}-\\log_{e}(e+1) $.

**⚡ The "Spot the Derivative Inside" Pattern**

For any integrand of the form $ \\dfrac{\\text{function involving }(1+x)\\,dx}{\\text{function of }xe^{x}} $, the right substitution is $ t = 1+xe^{x} $ (or $ xe^{x} $, whichever fits). Same logic for $ x\\ln x $ (paired with $ (\\ln x+1)\\,dx $) and $ e^{x}/x $ (paired with $ (1-1/x)\\,dx $, but check signs). The trick is to recognise the "derivative pair" — a function and the exact $ dx $ multiplier that comes from differentiating it. Once you see the pair, the substitution writes itself.

**⚠️ Where Students Get Stuck**

⚠️ **Trying integration by parts.** It works in principle but you end up doing IBP twice and the bookkeeping is fiddly. The substitution route is shorter every time.

⚠️ **Forgetting the boundary condition.** Without using $ \\lim I = 0 $, you cannot pin down $C$ and the four options become indistinguishable (they only differ in the constant piece). Always use the given condition first.

⚠️ **Sign on the log argument.** Inside, $ \\log_{e}|t-1| - \\log_{e}|t| $ becomes $ \\log_{e}|(t-1)/t| $, NOT $ \\log_{e}|t/(t-1)| $. Flip this and you get $ +\\log_{e}(e+1) $ instead of $ -\\log_{e}(e+1) $, picking option (d) by mistake.

$\\boxed{\\text{Answer: (a) } \\dfrac{e+2}{e+1}-\\log_{e}(e+1)}$`,
  },

  {
    display_id: 'ININ-017',
    answer: { correct_option: 'b' },
    solution: `**🧠 Differentiate $ (x/e)^{2x} $ — Watch the Magic**

Read the integrand: $ ((x/e)^{2x}+(e/x)^{2x})\\ln x $. The whole point of this question is to recognise that $ (x/e)^{2x} $ has an unusually clean derivative.

Let $ f(x) = (x/e)^{2x} = e^{2x\\ln(x/e)} = e^{2x(\\ln x-1)} $.

Differentiate:
$f'(x) = f(x)\\cdot\\dfrac{d}{dx}[2x(\\ln x-1)] = f(x)\\cdot[2(\\ln x-1)+2x\\cdot(1/x)] = f(x)\\cdot[2\\ln x-2+2] = 2f(x)\\ln x$.

Clean. The "$ -1 $" from $ \\ln(x/e) $ cancels exactly with the "$ +1 $" from the product rule. So $ f' = 2(x/e)^{2x}\\ln x $.

By the same logic for $ g(x) = (e/x)^{2x} = e^{2x(1-\\ln x)} $: $ g' = g\\cdot[2(1-\\ln x)-2] = -2g\\ln x = -2(e/x)^{2x}\\ln x $.

So $ \\dfrac{d}{dx}[(x/e)^{2x}-(e/x)^{2x}] = 2\\ln x\\cdot[(x/e)^{2x}+(e/x)^{2x}] $.

That is exactly $ 2\\ln x $ times the integrand-bracket. So
$\\int[(x/e)^{2x}+(e/x)^{2x}]\\ln x\\,dx = \\dfrac{1}{2}[(x/e)^{2x}-(e/x)^{2x}]+C$.

This is the habit I want you to build. When you see $ (x/e)^{kx} $ or $ (e/x)^{kx} $, always differentiate first — the $ -1 $ inside the log cancels with the $ +1 $ from the product rule, leaving a clean $ k\\ln x $ multiplier. JEE leans on this cancellation almost every year.

**🗺️ Working It Out**

Reading off the answer form $ \\dfrac{1}{\\alpha}(x/e)^{\\beta x}-\\dfrac{1}{\\gamma}(e/x)^{\\delta x}+C $ and comparing with $ \\dfrac{1}{2}(x/e)^{2x}-\\dfrac{1}{2}(e/x)^{2x}+C $:

- $ \\dfrac{1}{\\alpha} = \\dfrac{1}{2} \\Rightarrow \\alpha = 2 $.
- $ \\beta x = 2x \\Rightarrow \\beta = 2 $.
- $ \\dfrac{1}{\\gamma} = \\dfrac{1}{2} \\Rightarrow \\gamma = 2 $.
- $ \\delta x = 2x \\Rightarrow \\delta = 2 $.

All four are $ 2 $.

$\\alpha+2\\beta+3\\gamma-4\\delta = 2+4+6-8 = 4$.

**⚡ The Cancellation Trick for $ (x/e)^{x} $ Family**

Why does $ (x/e)^{2x} $ have a clean derivative? Because $ \\ln(x/e) = \\ln x-1 $, and $ d/dx[2x(\\ln x-1)] = 2(\\ln x-1)+2x/x = 2\\ln x $. The $ -1 $ and the $ +1 $ cancel. The same magic works for $ (x/e^{k})^{x} $ (giving derivative $ x^{x/e^{k}}\\cdot[\\ln x-k+1] $, still clean), and for $ (e^{k}/x)^{x} $ (giving $ -(\\ln x-k+1) $). JEE uses the $ k=1 $ case because the cancellation is perfect and the answer falls out instantly.

**⚠️ Where Students Get Stuck**

⚠️ **Trying substitution.** No clean $u$ converts this integrand to a standard form. The differentiate-the-answer-form approach is the only quick route.

⚠️ **Wrong sign on the $ (e/x)^{2x} $ derivative.** Computing $ d/dx[(e/x)^{2x}] $: the inside is $ 2x(1-\\ln x) $. Derivative: $ 2(1-\\ln x)+2x\\cdot(-1/x) = 2-2\\ln x-2 = -2\\ln x $. So $ g' = -2g\\ln x $. The minus sign is crucial; lose it and the sum-vs-difference structure breaks.

⚠️ **Confusing $ \\alpha,\\beta,\\gamma,\\delta $ assignments.** Read the form carefully: $ \\dfrac{1}{\\alpha}(x/e)^{\\beta x}-\\dfrac{1}{\\gamma}(e/x)^{\\delta x} $. So $ \\alpha,\\beta $ go with the $ (x/e) $ term and $ \\gamma,\\delta $ with the $ (e/x) $ term. Match the right exponent to the right symbol.

⚠️ **Arithmetic on $ \\alpha+2\\beta+3\\gamma-4\\delta $.** Each of the four is $2$. Sum: $ 2+4+6-8 = 4 $. The "$-4\\delta$" is the trap — students sometimes add all four and get $ 2+4+6+8 = 20 $ or $ -8 $. Be careful with the sign.

$\\boxed{\\text{Answer: (b) } 4}$`,
  },

  {
    display_id: 'ININ-018',
    answer: { integer_value: 64 },
    solution: `**🧠 Substitute the Whole Square Root — That Linearises Everything**

Read the integrand: $ \\sqrt{(x+7)/x} = \\sqrt{1+7/x} $. Whenever a square root contains a rational expression in $x$, your first move should be to substitute the entire root, not the inside. Set $ t = \\sqrt{(x+7)/x} $.

Why this works: squaring gives $ t^{2} = 1+7/x $, so $ x = 7/(t^{2}-1) $ — a clean inverse. Then $ dx $ comes out as a rational function of $t$, and the integrand turns into something you can either expand or attack by parts.

The boundary condition $ I(9) = 12+7\\ln 7 $ pins the integration constant. The value $ x=9 $ is chosen because $ t = \\sqrt{16/9} = 4/3 $, a clean rational.

This is the habit I want you to build. Whenever you see $ \\sqrt{\\text{rational in }x} $, substitute the root itself — never the radicand. The substitution is symmetric and almost always produces an integration-by-parts setup.

**🗺️ Working It Out**

Let $ t = \\sqrt{(x+7)/x} $. Then $ t^{2} = 1+7/x $, so $ x = 7/(t^{2}-1) $ and
$dx = -\\dfrac{14t}{(t^{2}-1)^{2}}\\,dt$.

So
$I(x) = \\int t\\,dx = \\int t\\cdot\\dfrac{-14t}{(t^{2}-1)^{2}}\\,dt = -14\\int\\dfrac{t^{2}\\,dt}{(t^{2}-1)^{2}}$.

**Integration by parts** is the clean route here. Let $ u = t $ (so $ du = dt $) and $ dv = \\dfrac{-14t\\,dt}{(t^{2}-1)^{2}} $ (so $ v = \\dfrac{7}{t^{2}-1} $, since $ \\int -14t/(t^{2}-1)^{2}\\,dt = 7/(t^{2}-1) $).

Then
$I = uv-\\int v\\,du = \\dfrac{7t}{t^{2}-1}-\\int\\dfrac{7}{t^{2}-1}\\,dt = \\dfrac{7t}{t^{2}-1}-\\dfrac{7}{2}\\log_{e}\\left|\\dfrac{t-1}{t+1}\\right|+C$.

**Convert back to $x$.** Notice $ t/(t^{2}-1) = t\\cdot x/7 $, and $ tx = x\\sqrt{(x+7)/x} = \\sqrt{x(x+7)} = \\sqrt{x^{2}+7x} $. So
$\\dfrac{7t}{t^{2}-1} = 7\\cdot\\dfrac{tx}{7} = tx = \\sqrt{x^{2}+7x}$.

So
$I(x) = \\sqrt{x^{2}+7x}-\\dfrac{7}{2}\\log_{e}\\left|\\dfrac{t-1}{t+1}\\right|+C$.

**Pin down $C$ from $ I(9) $.** At $ x=9 $: $ t = 4/3 $, $ \\sqrt{x^{2}+7x} = \\sqrt{144} = 12 $, $ (t-1)/(t+1) = (1/3)/(7/3) = 1/7 $.
$I(9) = 12-\\dfrac{7}{2}\\log_{e}(1/7)+C = 12+\\dfrac{7}{2}\\log_{e}7+C$.

Set equal to $ 12+7\\log_{e}7 $: $ \\dfrac{7}{2}\\log_{e}7+C = 7\\log_{e}7 $, so $ C = \\dfrac{7}{2}\\log_{e}7 $.

**Evaluate $ I(1) $.** $ t^{2} = 8 $, $ t = 2\\sqrt{2} $. $ \\sqrt{x^{2}+7x} = \\sqrt{8} = 2\\sqrt{2} $.
$(t-1)/(t+1) = (2\\sqrt{2}-1)/(2\\sqrt{2}+1)$.

Rationalise: multiply num and denom by $ 2\\sqrt{2}+1 $: numerator becomes $ (2\\sqrt{2})^{2}-1^{2} = 7 $; denominator becomes $ (2\\sqrt{2}+1)^{2} = 9+4\\sqrt{2} $. So
$(t-1)/(t+1) = 7/(9+4\\sqrt{2})$, which means $ (t+1)/(t-1) = (9+4\\sqrt{2})/7 $.

$I(1) = 2\\sqrt{2}-\\dfrac{7}{2}\\log_{e}\\dfrac{7}{9+4\\sqrt{2}}+\\dfrac{7}{2}\\log_{e}7$
$= 2\\sqrt{2}+\\dfrac{7}{2}\\log_{e}\\dfrac{9+4\\sqrt{2}}{7}+\\dfrac{7}{2}\\log_{e}7 = 2\\sqrt{2}+\\dfrac{7}{2}\\log_{e}(9+4\\sqrt{2})$.

Notice $ 9+4\\sqrt{2} = 1+8+4\\sqrt{2} = (1+2\\sqrt{2})^{2} $. So $ \\log_{e}(9+4\\sqrt{2}) = 2\\log_{e}(1+2\\sqrt{2}) $.

$I(1) = 2\\sqrt{2}+7\\log_{e}(1+2\\sqrt{2})$.

Matching $ I(1) = \\alpha+7\\log_{e}(1+2\\sqrt{2}) $, we get $ \\alpha = 2\\sqrt{2} $.

So $ \\alpha^{4} = (2\\sqrt{2})^{4} = 16\\cdot 4 = 64 $.

**⚡ Why $ (1+2\\sqrt{2})^{2} = 9+4\\sqrt{2} $ Is the Bridge**

Whenever a JEE answer has $ \\log(a+b\\sqrt{2}) $ (or $ \\sqrt{3} $, $ \\sqrt{5} $, etc.), check if the argument is a perfect square in $ \\mathbb{Z}[\\sqrt{2}] $. Patterns to remember: $ (1+\\sqrt{2})^{2} = 3+2\\sqrt{2} $, $ (2+\\sqrt{2})^{2} = 6+4\\sqrt{2} $, $ (1+2\\sqrt{2})^{2} = 9+4\\sqrt{2} $. These let you halve the log argument — a $ \\log a^{2} = 2\\log a $ move that often closes the gap between two of the answer choices.

**⚠️ Where Students Get Stuck**

⚠️ **Trying $ x = 7\\tan^{2}\\theta $ trig substitution.** It works, but the algebra is twice as long. Direct substitution $ t = \\sqrt{(x+7)/x} $ wins.

⚠️ **Forgetting to convert the log argument.** If you stop at $ I(1) = 2\\sqrt{2}+\\dfrac{7}{2}\\log_{e}(9+4\\sqrt{2}) $, you cannot match $ \\alpha+7\\log_{e}(1+2\\sqrt{2}) $. The question is testing whether you spot $ 9+4\\sqrt{2} = (1+2\\sqrt{2})^{2} $.

⚠️ **Computing $ (2\\sqrt{2})^{4} $.** $ (2\\sqrt{2})^{2} = 8 $, and $ 8^{2} = 64 $. Skip the intermediate step and you may get $ 32 $ or $ 128 $. Always square twice.

$\\boxed{\\text{Answer: } 64}$`,
  },

  {
    display_id: 'ININ-019',
    answer: { integer_value: 1 },
    solution: `**🧠 Convert $ \\sec 2x-1 $ to a Clean Trig Ratio**

Read the integrand: $ \\sqrt{\\sec 2x-1} $. Whenever you see $ \\sec\\theta-1 $ or $ 1-\\cos\\theta $ under a root, your first move should be to use the half-angle identity to rewrite it as a clean ratio.

$\\sec 2x-1 = \\dfrac{1-\\cos 2x}{\\cos 2x} = \\dfrac{2\\sin^{2}x}{\\cos 2x}$.

So (assuming $ \\sin x > 0 $, $ \\cos 2x > 0 $):
$\\sqrt{\\sec 2x-1} = \\dfrac{\\sqrt{2}\\sin x}{\\sqrt{\\cos 2x}}$.

Now $ \\cos 2x = 1-2\\sin^{2}x $, so $ \\sqrt{\\cos 2x} = \\sqrt{1-2\\sin^{2}x} $. The substitution $ u = \\sqrt{2}\\cos x $ is natural — its derivative is $ -\\sqrt{2}\\sin x\\,dx $, exactly the numerator. And $ u^{2} = 2\\cos^{2}x = 1+\\cos 2x $, so $ u^{2}-1 = \\cos 2x $. Both pieces line up.

This is the habit I want you to build. When you see $ \\sec\\theta-1 $ or $ \\sec\\theta+1 $ under a root, the half-angle conversion turns the integral into a standard $ 1/\\sqrt{u^{2}\\pm 1} $ form.

**🗺️ Working It Out**

$\\sqrt{\\sec 2x-1}\\,dx = \\dfrac{\\sqrt{2}\\sin x}{\\sqrt{1-2\\sin^{2}x}}\\,dx$.

Let $ u = \\sqrt{2}\\cos x $. Then $ du = -\\sqrt{2}\\sin x\\,dx $, so $ \\sqrt{2}\\sin x\\,dx = -du $. And $ u^{2} = 2\\cos^{2}x $, so $ 1-2\\sin^{2}x = 2\\cos^{2}x-1 = u^{2}-1 $.

$\\int\\sqrt{\\sec 2x-1}\\,dx = \\int\\dfrac{-du}{\\sqrt{u^{2}-1}} = -\\log_{e}|u+\\sqrt{u^{2}-1}|+C$.

Substitute back $ u = \\sqrt{2}\\cos x $ and $ u^{2}-1 = \\cos 2x $:
$= -\\log_{e}|\\sqrt{2}\\cos x+\\sqrt{\\cos 2x}|+C$.

Now match this to the answer form $ \\alpha\\log_{e}|\\cos 2x+\\beta+\\sqrt{\\cos 2x(1+\\cos(x/\\beta))}|+\\text{const} $.

**Square the inside of our log.** $ (\\sqrt{2}\\cos x+\\sqrt{\\cos 2x})^{2} = 2\\cos^{2}x+2\\sqrt{2}\\cos x\\sqrt{\\cos 2x}+\\cos 2x = (1+\\cos 2x)+\\cos 2x+2\\sqrt{(2\\cos^{2}x)\\cos 2x} = 1+2\\cos 2x+2\\sqrt{\\cos 2x(1+\\cos 2x)} $.

Factor $2$: $ = 2[\\cos 2x+1/2+\\sqrt{\\cos 2x(1+\\cos 2x)}] $.

So $ -\\log_{e}|\\sqrt{2}\\cos x+\\sqrt{\\cos 2x}| = -\\dfrac{1}{2}\\log_{e}|2(\\cos 2x+1/2+\\sqrt{\\cos 2x(1+\\cos 2x)})| = -\\dfrac{1}{2}\\log_{e}|\\cos 2x+1/2+\\sqrt{\\cos 2x(1+\\cos 2x)}|+C'$ (absorbing the $ -\\dfrac{1}{2}\\log 2 $ into $ C' $).

Match with $ \\alpha\\log_{e}|\\cos 2x+\\beta+\\sqrt{\\cos 2x(1+\\cos(x/\\beta))}| $:
- $ \\alpha = -1/2 $.
- $ \\beta = 1/2 $.
- Inside the inner cosine: $ x/\\beta = x/(1/2) = 2x $, giving $ \\cos(2x) $. ✓ matches $ 1+\\cos 2x $ inside the radical.

So $ \\beta-\\alpha = \\dfrac{1}{2}-\\left(-\\dfrac{1}{2}\\right) = 1 $.

**⚡ Half-Angle Conversion for $ \\sqrt{\\sec\\theta\\pm 1} $**

Memorise this identity family:
$\\sec\\theta-1 = \\dfrac{1-\\cos\\theta}{\\cos\\theta} = \\dfrac{2\\sin^{2}(\\theta/2)}{\\cos\\theta}$,
$\\sec\\theta+1 = \\dfrac{1+\\cos\\theta}{\\cos\\theta} = \\dfrac{2\\cos^{2}(\\theta/2)}{\\cos\\theta}$.

Whenever you see these under a root, conversion to half-angle form turns the integral into either a $ \\sin $-based or $ \\cos $-based substitution. Same logic for $ \\csc\\theta\\pm 1 $ — use $ 1\\pm\\sin\\theta = 1\\pm\\cos(\\pi/2-\\theta) $ then half-angle.

**⚠️ Where Students Get Stuck**

⚠️ **Sign of $ \\sin x $.** The half-angle conversion gives $ |\\sin x| $, not $ \\sin x $. JEE usually puts you in a region where $ \\sin x > 0 $, but if the question specifies otherwise, be careful.

⚠️ **Missing the $ \\cos 2x = u^{2}-1 $ link.** $ u = \\sqrt{2}\\cos x \\Rightarrow u^{2} = 2\\cos^{2}x = 1+\\cos 2x \\Rightarrow u^{2}-1 = \\cos 2x $. Without seeing this clean relation, you cannot recognise the $ \\int du/\\sqrt{u^{2}-1} $ standard form.

⚠️ **Reading the $ \\cos(x/\\beta) $ form.** Many students freeze at $ x/\\beta $ and think it must be a fraction inside cosine. But here $ \\beta = 1/2 $, so $ x/\\beta = 2x $ — a clean integer multiple. The "weird" form is just a coded way of expressing $ \\cos(2x) $ in terms of $ \\beta $.

⚠️ **Sign of $ \\alpha $.** Our $ \\alpha = -1/2 $ — negative. The minus comes from $ -du $ (the substitution flipped sign). Lose this sign and you get $ \\beta-\\alpha = 0 $ instead of $1$.

$\\boxed{\\text{Answer: } 1}$`,
  },

  {
    display_id: 'ININ-020',
    answer: { correct_option: 'a' },
    verifier_note: 'Option (a) has an OCR typo — missing "tan" before the denominator angle. Solution derives the intended form tan(x/2+π/12)/tan(x/2+π/6), which is option (a) when read with the tan included.',
    solution: `**🧠 $ (\\cos x-\\sin x)\\,dx $ Says "Substitute $ u = \\sin x+\\cos x $"**

Read the integrand. The numerator has $ (\\cos x-\\sin x)\\,dx $ — that is exactly $ d(\\sin x+\\cos x) $. And the denominator has $ \\sin 2x = 2\\sin x\\cos x $. Whenever you see this pair in a JEE integral, your first move should be the substitution $ u = \\sin x+\\cos x $. Then $ u^{2} = 1+\\sin 2x $, so $ \\sin 2x = u^{2}-1 $ — the whole denominator turns into a quadratic in $u$.

This is the habit I want you to build. The pair "$ \\sin x+\\cos x $" (or $ \\sin x-\\cos x $) with $ \\sin 2x $ nearby is a JEE signature. The substitution reduces everything to a rational $u$-integral.

**🗺️ Working It Out**

Let $ u = \\sin x+\\cos x $. Then $ du = (\\cos x-\\sin x)\\,dx $ and $ \\sin 2x = u^{2}-1 $.

$I = \\left(1-\\dfrac{1}{\\sqrt{3}}\\right)\\int\\dfrac{du}{1+\\dfrac{2}{\\sqrt{3}}(u^{2}-1)} = \\left(1-\\dfrac{1}{\\sqrt{3}}\\right)\\int\\dfrac{\\sqrt{3}\\,du}{\\sqrt{3}+2(u^{2}-1)} = (\\sqrt{3}-1)\\int\\dfrac{du}{2u^{2}-(2-\\sqrt{3})}$.

(Multiplied num and denom by $ \\sqrt{3} $, then used $ \\sqrt{3}-2 = -(2-\\sqrt{3}) $.)

**Spot the clean square.** $ 2-\\sqrt{3} = \\dfrac{(\\sqrt{3}-1)^{2}}{2} $ because $ (\\sqrt{3}-1)^{2} = 4-2\\sqrt{3} = 2(2-\\sqrt{3}) $. So $ \\sqrt{2-\\sqrt{3}} = \\dfrac{\\sqrt{3}-1}{\\sqrt{2}} $, and the constant inside the integral is $ a^{2} $ where $ a = \\dfrac{\\sqrt{3}-1}{2} $.

So
$I = (\\sqrt{3}-1)\\cdot\\dfrac{1}{2}\\int\\dfrac{du}{u^{2}-a^{2}} = \\dfrac{\\sqrt{3}-1}{2}\\cdot\\dfrac{1}{2a}\\log_{e}\\left|\\dfrac{u-a}{u+a}\\right|+C$.

With $ a = (\\sqrt{3}-1)/2 $: $ 2a = \\sqrt{3}-1 $, so $ \\dfrac{\\sqrt{3}-1}{2\\cdot 2a} = \\dfrac{\\sqrt{3}-1}{2(\\sqrt{3}-1)} = \\dfrac{1}{2} $. The constant collapses to $ \\dfrac{1}{2} $.

$I = \\dfrac{1}{2}\\log_{e}\\left|\\dfrac{u-a}{u+a}\\right|+C$.

**Rewrite $ (u-a)/(u+a) $ as a $ \\tan $ ratio.** Note $ u = \\sin x+\\cos x = \\sqrt{2}\\sin(x+\\pi/4) $. And $ a = (\\sqrt{3}-1)/2 = \\sin(-\\pi/6)+\\cos(-\\pi/6) = \\sqrt{2}\\sin(-\\pi/6+\\pi/4) = \\sqrt{2}\\sin(\\pi/12) $. Similarly $ -a = \\sqrt{2}\\sin(-\\pi/12) $.

So
$u-a = \\sqrt{2}[\\sin(x+\\pi/4)-\\sin(\\pi/12)] = 2\\sqrt{2}\\cos\\left(\\dfrac{x+\\pi/3}{2}\\right)\\sin\\left(\\dfrac{x+\\pi/6}{2}\\right)$,
$u+a = \\sqrt{2}[\\sin(x+\\pi/4)+\\sin(\\pi/12)] = 2\\sqrt{2}\\sin\\left(\\dfrac{x+\\pi/3}{2}\\right)\\cos\\left(\\dfrac{x+\\pi/6}{2}\\right)$.

(Used $ \\sin A-\\sin B = 2\\cos((A+B)/2)\\sin((A-B)/2) $ and $ \\sin A+\\sin B = 2\\sin((A+B)/2)\\cos((A-B)/2) $; with $ A = x+\\pi/4, B = \\pi/12 $, so $ (A+B)/2 = (x+\\pi/3)/2 $ and $ (A-B)/2 = (x+\\pi/6)/2 $.)

Ratio:
$\\dfrac{u-a}{u+a} = \\dfrac{\\cos((x+\\pi/3)/2)\\sin((x+\\pi/6)/2)}{\\sin((x+\\pi/3)/2)\\cos((x+\\pi/6)/2)} = \\dfrac{\\tan((x+\\pi/6)/2)}{\\tan((x+\\pi/3)/2)} = \\dfrac{\\tan(x/2+\\pi/12)}{\\tan(x/2+\\pi/6)}$.

So
$I = \\dfrac{1}{2}\\log_{e}\\left|\\dfrac{\\tan(x/2+\\pi/12)}{\\tan(x/2+\\pi/6)}\\right|+C$.

That matches option (a).

**⚡ The $ (u-a)/(u+a) $ to $ \\tan $-Ratio Bridge**

Whenever you finish an integral with $ \\log|(u-a)/(u+a)| $ where $ u = \\sin x+\\cos x $ and $a$ is a constant, convert to a $ \\tan $ ratio using sum-to-product. The trick is to write $ a $ itself as $ \\sqrt{2}\\sin(\\text{angle}) $ — then $ u-a $ and $ u+a $ both become sums or differences of sines, which factor cleanly into $ \\sin\\cdot\\cos $ pairs. The ratio collapses to $ \\tan/\\tan $. JEE answers in this family always look like $ \\dfrac{1}{2}\\log|\\tan A/\\tan B| $ — recognise this and you save 5 minutes of fiddling.

**⚠️ Where Students Get Stuck**

⚠️ **Trying Weierstrass substitution.** $ t = \\tan(x/2) $ converts everything, but the algebra is three times longer. The $ u = \\sin x+\\cos x $ substitution is the JEE intended route.

⚠️ **Missing $ 2-\\sqrt{3} = (\\sqrt{3}-1)^{2}/2 $.** Without spotting this, you get stuck at $ a^{2} = (2-\\sqrt{3})/2 $ and cannot simplify. Recognise that surds like $ 2-\\sqrt{3} $, $ 7-4\\sqrt{3} $ are often perfect squares in $ \\mathbb{Z}[\\sqrt{3}] $.

⚠️ **Sum-to-product sign error.** $ \\sin A-\\sin B = 2\\cos((A+B)/2)\\sin((A-B)/2) $ — the order is "cos of sum, sin of difference". $ \\sin A+\\sin B = 2\\sin((A+B)/2)\\cos((A-B)/2) $ — "sin of sum, cos of difference". Mix these up and the ratio comes out inverted.

⚠️ **Wrong angles.** With $ A = x+\\pi/4, B = \\pi/12 $: $ A+B = x+\\pi/4+\\pi/12 = x+\\pi/3 $ (LCM of $4,12$ is $12$, so $ 3/12+1/12 = 4/12 = 1/3 $). And $ A-B = x+\\pi/4-\\pi/12 = x+\\pi/6 $ ($ 3/12-1/12 = 2/12 = 1/6 $). Half of each gives $ (x+\\pi/3)/2 = x/2+\\pi/6 $ and $ (x+\\pi/6)/2 = x/2+\\pi/12 $. Arithmetic on $ \\pi $ fractions is a frequent source of errors — write each step.

$\\boxed{\\text{Answer: (a) } \\dfrac{1}{2}\\log_{e}\\left|\\dfrac{\\tan(x/2+\\pi/12)}{\\tan(x/2+\\pi/6)}\\right|+C}$`,
  },
];
