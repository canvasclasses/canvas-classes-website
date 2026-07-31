'use strict';
/* Class 11 Math · Ch.4 Complex Numbers and Quadratic Equations — RECONCILIATION PASS.
   The real NCERT Ch.4 PDF (rationalized 2023-24 edition) is now available at
   `~/iCloud Drive (Archive)/Kindle Converter/Math Books/NCERT Class 11 Maths/
   Ch4 - Complex Numbers and Quadratic Equations.pdf` (13 pages, read in full,
   2026-07-24). This script replaces the `complex-numbers-practice` page's
   `practice_bank` sections — previously original/invented items tagged
   `source:'mcq'` — with the REAL, COMPLETE set of NCERT exercise questions,
   transcribed verbatim from the PDF and independently re-derived/verified here
   (never reconstructed from training-data memory), tagged `source:'ncert_exercise'`.

   REAL SPINE FOUND (differs from the assumed spine in MATH_CH4_COMPLEX_NUMBERS_PLAN.md
   §A — see the plan doc update for details):
     4.1 Introduction · 4.2 Complex Numbers · 4.3 Algebra of Complex Numbers
     (4.3.1–4.3.7: addition, difference, multiplication, division, powers of i,
     square roots of negative reals, identities) · 4.4 Modulus & Conjugate ·
     4.5 Argand Plane (heading retains "and Polar Representation" from the
     pre-rationalization edition, but the body text ONLY covers plotting points
     or the plane, modulus-as-distance, and conjugate-as-mirror-image — no r/θ
     polar form, no argument, no principal argument anywhere in the 13 pages) ·
     Miscellaneous Examples/Exercise · Summary · Historical Note.
   There is NO section 4.6 (quadratic equations with complex roots) and NO
   Exercise 4.2 / 4.3 in the current rationalized print — only Exercise 4.1
   (14 Qs) and the Miscellaneous Exercise (14 Qs) exist. This is a genuine
   textbook-rationalization fact, not an extraction gap (all 13 pages were read
   start to end). See the plan doc for the resulting judgment call on pages
   5/6/7 (polar representation, quadratic-equations, mixed-worked-examples).

   Run: node scripts/math11-book/reconcile_ch4_ncert_practice.js */
const { withDb, savePage } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const num = (source_label, prompt, answer, solution) =>
  ({ id: uuidv4(), kind: 'numerical', source: 'ncert_exercise', source_label, prompt, answer, solution });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ── Ex 4.1 items (verbatim from PDF pp.82–83, "EXERCISE 4.1") ────────────── */
const e1q1 = num('NCERT Ex 4.1 · Q1',
  'Express $ (5i)\\left(-\\frac{3}{5}i\\right) $ in the form $ a+bi $.',
  '$ 3+0i $',
  'Multiply the numbers and the $ i $\'s separately: $ 5\\times\\left(-\\frac{3}{5}\\right) = -3 $, and $ i\\times i = i^2 = -1 $.\n\n' +
  'So the product is $ (-3)\\times(-1) = 3 $ — a purely real number, i.e. $ 3+0i $.');

const e1q2 = num('NCERT Ex 4.1 · Q2',
  'Simplify $ i^9 + i^{19} $, and express the result in the form $ a+bi $.',
  '$ 0 $',
  'Reduce each exponent mod 4 (since $ i^4=1 $, only the remainder after dividing by 4 matters): $ 9 = 4\\times2+1 $, so $ i^9 = i^1 = i $. And $ 19 = 4\\times4+3 $, so $ i^{19} = i^3 = -i $.\n\n' +
  'Add them: $ i + (-i) = 0 $.');

const e1q3 = num('NCERT Ex 4.1 · Q3',
  'Simplify $ i^{-39} $, and express the result in the form $ a+bi $.',
  '$ i $',
  'First reduce the positive power: $ 39 = 4\\times9+3 $, so $ i^{39} = i^3 = -i $.\n\n' +
  'Then $ i^{-39} = \\frac{1}{i^{39}} = \\frac{1}{-i} $. Multiply top and bottom by $ i $: $ \\frac{1}{-i}\\times\\frac{i}{i} = \\frac{i}{-i^2} = \\frac{i}{1} = i $.\n\n' +
  '**Shortcut:** a negative exponent can be reduced mod 4 directly too — $ -39 \\equiv 1 \\pmod4 $ (since $ -39 = 4\\times(-10)+1 $), so $ i^{-39}=i^1=i $ in one step.');

const e1q4 = num('NCERT Ex 4.1 · Q4',
  'Express $ 3(7+i7) + i(7+i7) $ in the form $ a+bi $.',
  '$ 14+28i $',
  'Expand each part separately.\n\n$ 3(7+7i) = 21+21i $.\n\n$ i(7+7i) = 7i+7i^2 = 7i-7 $.\n\n' +
  'Add: $ (21+21i) + (-7+7i) = (21-7) + (21i+7i) = 14+28i $.');

const e1q5 = num('NCERT Ex 4.1 · Q5',
  'Express $ (1-i) - (-1+i6) $ in the form $ a+bi $.',
  '$ 2-7i $',
  'Subtracting a complex number flips the sign of both its parts: $ (1-i) - (-1+6i) = 1-i+1-6i = 2-7i $.');

const e1q6 = num('NCERT Ex 4.1 · Q6',
  'Express $ \\left(\\frac{1}{5}+i\\frac{2}{5}\\right) - \\left(4+i\\frac{5}{2}\\right) $ in the form $ a+bi $.',
  '$ -\\frac{19}{5} - \\frac{21}{10}i $',
  'Subtract the real parts and the imaginary parts separately.\n\n' +
  'Real parts: $ \\frac{1}{5} - 4 = \\frac{1}{5} - \\frac{20}{5} = -\\frac{19}{5} $.\n\n' +
  'Imaginary parts: $ \\frac{2}{5} - \\frac{5}{2} = \\frac{4}{10} - \\frac{25}{10} = -\\frac{21}{10} $.\n\n' +
  'So the answer is $ -\\frac{19}{5} - \\frac{21}{10}i $.');

const e1q7 = num('NCERT Ex 4.1 · Q7',
  'Express $ \\left[\\left(\\frac{1}{3}+i\\frac{7}{3}\\right) + \\left(4+i\\frac{1}{3}\\right)\\right] - \\left(-\\frac{4}{3}+i\\right) $ in the form $ a+bi $.',
  '$ \\frac{17}{3} + \\frac{5}{3}i $',
  'Work inside-out. First add the two bracketed complex numbers:\n\n' +
  'Real: $ \\frac{1}{3}+4 = \\frac{1}{3}+\\frac{12}{3} = \\frac{13}{3} $. Imaginary: $ \\frac{7}{3}+\\frac{1}{3} = \\frac{8}{3} $.\n\n' +
  'So the sum is $ \\frac{13}{3} + \\frac{8}{3}i $.\n\n' +
  'Now subtract $ \\left(-\\frac{4}{3}+i\\right) $: real part $ \\frac{13}{3} - \\left(-\\frac{4}{3}\\right) = \\frac{13}{3}+\\frac{4}{3} = \\frac{17}{3} $. Imaginary part $ \\frac{8}{3} - 1 = \\frac{8}{3}-\\frac{3}{3} = \\frac{5}{3} $.\n\n' +
  'Answer: $ \\frac{17}{3} + \\frac{5}{3}i $.');

const e1q8 = num('NCERT Ex 4.1 · Q8',
  'Express $ (1-i)^4 $ in the form $ a+bi $.',
  '$ -4+0i $',
  'Square it twice rather than expanding all at once. First $ (1-i)^2 = 1 - 2i + i^2 = 1-2i-1 = -2i $.\n\n' +
  'Now square that result: $ (1-i)^4 = (-2i)^2 = 4i^2 = -4 $.\n\n' +
  'So $ (1-i)^4 = -4 $, i.e. $ -4+0i $.');

const e1q9 = num('NCERT Ex 4.1 · Q9',
  'Express $ \\left(\\frac{1}{3}+3i\\right)^3 $ in the form $ a+bi $.',
  '$ -\\frac{242}{27} - 26i $',
  'Use the binomial expansion $ (a+b)^3 = a^3+3a^2b+3ab^2+b^3 $ with $ a=\\frac{1}{3} $ and $ b=3i $.\n\n' +
  '$ a^3 = \\frac{1}{27} $.\n\n$ 3a^2b = 3\\times\\frac{1}{9}\\times3i = i $.\n\n$ 3ab^2 = 3\\times\\frac{1}{3}\\times9i^2 = 9i^2 = -9 $.\n\n$ b^3 = 27i^3 = 27\\times(-i) = -27i $.\n\n' +
  'Add everything: real parts $ \\frac{1}{27} - 9 = \\frac{1}{27}-\\frac{243}{27} = -\\frac{242}{27} $; imaginary parts $ i - 27i = -26i $.\n\n' +
  'So the answer is $ -\\frac{242}{27} - 26i $.');

const e1q10 = num('NCERT Ex 4.1 · Q10',
  'Express $ \\left(-2-\\frac{1}{3}i\\right)^3 $ in the form $ a+bi $.',
  '$ -\\frac{22}{3} - \\frac{107}{27}i $',
  'Use $ (a+b)^3=a^3+3a^2b+3ab^2+b^3 $ with $ a=-2 $ and $ b=-\\frac{1}{3}i $.\n\n' +
  '$ a^3 = -8 $.\n\n$ 3a^2b = 3\\times4\\times\\left(-\\frac{1}{3}i\\right) = -4i $.\n\n' +
  '$ 3ab^2 = 3\\times(-2)\\times\\left(-\\frac{1}{3}i\\right)^2 = 3\\times(-2)\\times\\left(-\\frac{1}{9}\\right) = \\frac{2}{3} $.\n\n' +
  '$ b^3 = \\left(-\\frac{1}{3}\\right)^3 i^3 = -\\frac{1}{27}\\times(-i) = \\frac{1}{27}i $.\n\n' +
  'Add the real parts: $ a^3+3ab^2 = -8+\\frac{2}{3} = -\\frac{24}{3}+\\frac{2}{3} = -\\frac{22}{3} $.\n\n' +
  'Add the imaginary parts: $ 3a^2b + b^3 = -4i + \\frac{1}{27}i = -\\frac{108}{27}i+\\frac{1}{27}i = -\\frac{107}{27}i $.\n\n' +
  'So the answer is $ -\\frac{22}{3} - \\frac{107}{27}i $.');

const e1q11 = num('NCERT Ex 4.1 · Q11',
  'Find the multiplicative inverse of $ 4-3i $.',
  '$ \\frac{4}{25} + \\frac{3}{25}i $',
  'For $ z=4-3i $, the inverse is $ z^{-1} = \\frac{\\bar z}{|z|^2} $.\n\n' +
  '$ \\bar z = 4+3i $, and $ |z|^2 = 4^2+(-3)^2 = 16+9 = 25 $.\n\n' +
  'So $ z^{-1} = \\frac{4+3i}{25} = \\frac{4}{25}+\\frac{3}{25}i $.');

const e1q12 = num('NCERT Ex 4.1 · Q12',
  'Find the multiplicative inverse of $ \\sqrt5+3i $.',
  '$ \\frac{\\sqrt5}{14} - \\frac{3}{14}i $',
  '$ \\bar z = \\sqrt5-3i $, and $ |z|^2 = (\\sqrt5)^2+3^2 = 5+9=14 $.\n\n' +
  '$ z^{-1} = \\frac{\\sqrt5-3i}{14} = \\frac{\\sqrt5}{14} - \\frac{3}{14}i $.');

const e1q13 = num('NCERT Ex 4.1 · Q13',
  'Find the multiplicative inverse of $ -i $.',
  '$ i $',
  'Write $ z=-i = 0-1i $. Then $ \\bar z = i $ and $ |z|^2 = 0^2+(-1)^2=1 $.\n\n' +
  '$ z^{-1} = \\frac{\\bar z}{|z|^2} = \\frac{i}{1} = i $.\n\n' +
  '**Check:** $ (-i)\\times i = -i^2 = 1 $ ✓ — multiplying $ z $ by its inverse must always give $ 1 $.');

const e1q14 = num('NCERT Ex 4.1 · Q14',
  'Express $ \\frac{(3+i\\sqrt5)(3-i\\sqrt5)}{(\\sqrt3+i\\sqrt2)-(\\sqrt3-i\\sqrt2)} $ in the form $ a+bi $.',
  '$ -\\frac{7\\sqrt2}{2}i $',
  'Simplify the numerator and denominator separately first.\n\n' +
  '**Numerator:** $ (3+i\\sqrt5)(3-i\\sqrt5) $ is a conjugate pair, so it collapses to $ 3^2-(i\\sqrt5)^2 = 9-(-5) = 14 $.\n\n' +
  '**Denominator:** $ (\\sqrt3+i\\sqrt2)-(\\sqrt3-i\\sqrt2) = i\\sqrt2-(-i\\sqrt2) = 2i\\sqrt2 $ (the real parts cancel, the imaginary parts double).\n\n' +
  'So the expression is $ \\frac{14}{2i\\sqrt2} = \\frac{7}{i\\sqrt2} $. Since $ \\frac{1}{i}=-i $, this is $ \\frac{-7i}{\\sqrt2} $.\n\n' +
  'Rationalize: $ \\frac{-7i}{\\sqrt2}\\times\\frac{\\sqrt2}{\\sqrt2} = -\\frac{7\\sqrt2}{2}i $ — a purely imaginary number.');

/* ── Miscellaneous Exercise items (verbatim from PDF pp.85–86) ────────────── */
const mq1 = num('NCERT Misc · Q1',
  'Evaluate $ \\left[i^{18} + \\left(\\frac{1}{i}\\right)^{25}\\right]^3 $.',
  '$ 2-2i $',
  'Simplify what is inside the bracket first.\n\n' +
  '$ i^{18} $: since $ 18=4\\times4+2 $, $ i^{18}=i^2=-1 $.\n\n' +
  '$ \\left(\\frac{1}{i}\\right)^{25} $: note $ \\frac{1}{i}=-i $, so this is $ (-i)^{25} = -i^{25} $ (the minus sign survives since $ 25 $ is odd). And $ 25=4\\times6+1 $, so $ i^{25}=i^1=i $. Hence $ \\left(\\frac{1}{i}\\right)^{25} = -i $.\n\n' +
  'Inside the bracket: $ -1+(-i) = -1-i $.\n\n' +
  'Now cube it: $ (-1-i)^2 = 1+2i+i^2 = 2i $, and $ (-1-i)^3 = (-1-i)\\times2i = -2i-2i^2 = -2i+2 = 2-2i $.\n\n' +
  'So the answer is $ 2-2i $.');

const mq2 = num('NCERT Misc · Q2',
  'For any two complex numbers $ z_1 $ and $ z_2 $, prove that $ \\text{Re}(z_1z_2) = \\text{Re}\\,z_1\\,\\text{Re}\\,z_2 - \\text{Im}\\,z_1\\,\\text{Im}\\,z_2 $.',
  'Identity — proved by direct expansion (see solution)',
  'Write $ z_1=a+ib $ and $ z_2=c+id $, so $ \\text{Re}\\,z_1=a,\\ \\text{Im}\\,z_1=b,\\ \\text{Re}\\,z_2=c,\\ \\text{Im}\\,z_2=d $.\n\n' +
  'Multiply them out: $ z_1z_2 = (a+ib)(c+id) = ac+iad+ibc+i^2bd = (ac-bd) + i(ad+bc) $.\n\n' +
  'The real part of this product is $ ac-bd $. But $ ac = \\text{Re}\\,z_1\\,\\text{Re}\\,z_2 $ and $ bd = \\text{Im}\\,z_1\\,\\text{Im}\\,z_2 $, so $ \\text{Re}(z_1z_2) = \\text{Re}\\,z_1\\,\\text{Re}\\,z_2 - \\text{Im}\\,z_1\\,\\text{Im}\\,z_2 $ — exactly the identity to prove.');

const mq3 = num('NCERT Misc · Q3',
  'Reduce $ \\left(\\frac{1}{1-4i} - \\frac{2}{1+i}\\right)\\frac{3-4i}{5+i} $ to the standard form $ a+bi $.',
  '$ \\frac{307}{442} + \\frac{599}{442}i $',
  'Simplify the bracket first, one fraction at a time — rationalize each by multiplying with the conjugate of its denominator.\n\n' +
  '$ \\frac{1}{1-4i}\\times\\frac{1+4i}{1+4i} = \\frac{1+4i}{1+16} = \\frac{1+4i}{17} $.\n\n' +
  '$ \\frac{2}{1+i}\\times\\frac{1-i}{1-i} = \\frac{2(1-i)}{2} = 1-i $.\n\n' +
  'Subtract, putting everything over $ 17 $: $ \\frac{1+4i}{17} - (1-i) = \\frac{1+4i-17(1-i)}{17} = \\frac{1+4i-17+17i}{17} = \\frac{-16+21i}{17} $.\n\n' +
  'Now simplify $ \\frac{3-4i}{5+i} $ the same way: $ \\frac{3-4i}{5+i}\\times\\frac{5-i}{5-i} = \\frac{15-3i-20i+4i^2}{26} = \\frac{11-23i}{26} $.\n\n' +
  'Multiply the two results: $ \\frac{-16+21i}{17}\\times\\frac{11-23i}{26} = \\frac{(-16+21i)(11-23i)}{442} $.\n\n' +
  'Expand the numerator: $ (-16)(11) + (-16)(-23i) + (21i)(11) + (21i)(-23i) = -176+368i+231i-483i^2 = -176+599i+483 = 307+599i $.\n\n' +
  'So the answer is $ \\frac{307+599i}{442} $, i.e. $ \\frac{307}{442} + \\frac{599}{442}i $.');

const mq4 = num('NCERT Misc · Q4',
  'If $ x-iy = \\sqrt{\\frac{a-ib}{c-id}} $, prove that $ (x^2+y^2)^2 = \\frac{a^2+b^2}{c^2+d^2} $.',
  'Identity — proved by taking modulus of both sides (see solution)',
  'Square both sides first: $ (x-iy)^2 = \\frac{a-ib}{c-id} $.\n\n' +
  'Now take the modulus of both sides. The modulus of a quotient is the quotient of the moduli, and the modulus of a square is the square of the modulus: $ \\left|(x-iy)^2\\right| = |x-iy|^2 $ and $ \\left|\\frac{a-ib}{c-id}\\right| = \\frac{|a-ib|}{|c-id|} = \\frac{\\sqrt{a^2+b^2}}{\\sqrt{c^2+d^2}} $.\n\n' +
  'So $ x^2+y^2 = \\frac{\\sqrt{a^2+b^2}}{\\sqrt{c^2+d^2}} $ (using $ |x-iy|^2 = x^2+y^2 $).\n\n' +
  'Square both sides once more: $ (x^2+y^2)^2 = \\frac{a^2+b^2}{c^2+d^2} $ — as required.');

const mq5 = num('NCERT Misc · Q5',
  'If $ z_1=2-i $ and $ z_2=1+i $, find $ \\left|\\frac{z_1+z_2+1}{z_1-z_2+1}\\right| $.',
  '$ \\sqrt2 $',
  'Compute the numerator and denominator separately first.\n\n' +
  '$ z_1+z_2+1 = (2-i)+(1+i)+1 = 4+0i = 4 $.\n\n' +
  '$ z_1-z_2+1 = (2-i)-(1+i)+1 = 2-i-1-i+1 = 2-2i $.\n\n' +
  'So the fraction is $ \\frac{4}{2-2i} = \\frac{4}{2(1-i)} = \\frac{2}{1-i} $. Rationalize: $ \\frac{2}{1-i}\\times\\frac{1+i}{1+i} = \\frac{2(1+i)}{2} = 1+i $.\n\n' +
  'Finally, $ |1+i| = \\sqrt{1^2+1^2} = \\sqrt2 $.');

const mq6 = num('NCERT Misc · Q6',
  'If $ a+ib = \\frac{(x+i)^2}{2x^2+1} $, prove that $ a^2+b^2 = \\frac{(x^2+1)^2}{(2x^2+1)^2} $.',
  'Identity — proved by expanding and squaring (see solution)',
  'First expand the numerator: $ (x+i)^2 = x^2+2xi+i^2 = (x^2-1)+2xi $.\n\n' +
  'So $ a+ib = \\frac{(x^2-1)+2xi}{2x^2+1} $, which means $ a = \\frac{x^2-1}{2x^2+1} $ and $ b = \\frac{2x}{2x^2+1} $ (matching real and imaginary parts).\n\n' +
  'Now compute $ a^2+b^2 $: $ \\frac{(x^2-1)^2+(2x)^2}{(2x^2+1)^2} = \\frac{x^4-2x^2+1+4x^2}{(2x^2+1)^2} = \\frac{x^4+2x^2+1}{(2x^2+1)^2} $.\n\n' +
  'The numerator is a perfect square: $ x^4+2x^2+1 = (x^2+1)^2 $. So $ a^2+b^2 = \\frac{(x^2+1)^2}{(2x^2+1)^2} $ — as required.');

const mq7 = num('NCERT Misc · Q7',
  'Let $ z_1=2-i $ and $ z_2=-2+i $. Find (i) $ \\text{Re}\\left(\\frac{z_1z_2}{\\bar z_1}\\right) $, (ii) $ \\text{Im}\\left(\\frac{1}{z_1\\bar z_1}\\right) $.',
  '(i) $ -\\frac{2}{5} $  (ii) $ 0 $',
  '**Part (i).** First find $ z_1z_2 $: $ (2-i)(-2+i) = -4+2i+2i-i^2 = -4+4i+1 = -3+4i $.\n\n' +
  '$ \\bar z_1 = 2+i $.\n\n' +
  'So $ \\frac{z_1z_2}{\\bar z_1} = \\frac{-3+4i}{2+i} $. Rationalize: $ \\frac{(-3+4i)(2-i)}{(2+i)(2-i)} = \\frac{-6+3i+8i-4i^2}{4+1} = \\frac{-6+11i+4}{5} = \\frac{-2+11i}{5} $.\n\n' +
  'So $ \\text{Re}\\left(\\frac{z_1z_2}{\\bar z_1}\\right) = -\\frac{2}{5} $.\n\n' +
  '**Part (ii).** For any complex number, $ z\\bar z = |z|^2 $ is always a real number, so $ z_1\\bar z_1 = 2^2+(-1)^2 = 5 $ — a purely real number.\n\n' +
  'So $ \\frac{1}{z_1\\bar z_1} = \\frac{1}{5} $, which has no imaginary part at all: $ \\text{Im}\\left(\\frac{1}{z_1\\bar z_1}\\right) = 0 $.');

const mq8 = num('NCERT Misc · Q8',
  'Find the real numbers $ x $ and $ y $ if $ (x-iy)(3+5i) $ is the conjugate of $ -6-24i $.',
  '$ x=3,\\ y=-3 $',
  'The conjugate of $ -6-24i $ is $ -6+24i $ (flip the sign of the imaginary part).\n\n' +
  'Expand the left side: $ (x-iy)(3+5i) = 3x+5xi-3yi-5yi^2 = (3x+5y) + i(5x-3y) $ (using $ -5yi^2 = 5y $).\n\n' +
  'Match real and imaginary parts against $ -6+24i $:\n\n$ 3x+5y = -6 $ … (1)\n\n$ 5x-3y = 24 $ … (2)\n\n' +
  'Multiply (1) by 3 and (2) by 5, then add to eliminate $ y $: $ 9x+15y=-18 $ and $ 25x-15y=120 $; adding gives $ 34x=102 $, so $ x=3 $.\n\n' +
  'Substitute back into (1): $ 9+5y=-6 \\Rightarrow 5y=-15 \\Rightarrow y=-3 $.\n\n' +
  '**Check:** $ (3+3i)(3+5i) = 9+15i+9i+15i^2 = 9+24i-15 = -6+24i $ ✓ — matches the conjugate of $ -6-24i $ exactly.');

const mq9 = num('NCERT Misc · Q9',
  'Find the modulus of $ \\frac{1+i}{1-i} - \\frac{1-i}{1+i} $.',
  '$ 2 $',
  'Simplify each fraction by rationalizing.\n\n' +
  '$ \\frac{1+i}{1-i}\\times\\frac{1+i}{1+i} = \\frac{(1+i)^2}{2} = \\frac{2i}{2} = i $.\n\n' +
  '$ \\frac{1-i}{1+i}\\times\\frac{1-i}{1-i} = \\frac{(1-i)^2}{2} = \\frac{-2i}{2} = -i $.\n\n' +
  'Subtract: $ i-(-i) = 2i $.\n\n' +
  'Modulus: $ |2i| = 2 $.');

const mq10 = num('NCERT Misc · Q10',
  'If $ (x+iy)^3 = u+iv $, then show that $ \\frac{u}{x} + \\frac{v}{y} = 4(x^2-y^2) $.',
  'Identity — proved by expanding the cube (see solution)',
  'Expand $ (x+iy)^3 $ with the binomial pattern: $ (x+iy)^3 = x^3+3x^2(iy)+3x(iy)^2+(iy)^3 = x^3+3x^2yi-3xy^2-y^3i $.\n\n' +
  'Group into real and imaginary parts: $ u = x^3-3xy^2 $ and $ v = 3x^2y-y^3 $.\n\n' +
  'Divide each by its matching variable: $ \\frac{u}{x} = x^2-3y^2 $ and $ \\frac{v}{y} = 3x^2-y^2 $ (valid whenever $ x\\ne0,\\ y\\ne0 $).\n\n' +
  'Add them: $ \\frac{u}{x}+\\frac{v}{y} = (x^2-3y^2)+(3x^2-y^2) = 4x^2-4y^2 = 4(x^2-y^2) $ — as required.');

const mq11 = num('NCERT Misc · Q11',
  'If $ \\alpha $ and $ \\beta $ are different complex numbers with $ |\\beta|=1 $, then find $ \\left|\\frac{\\beta-\\alpha}{1-\\bar\\alpha\\beta}\\right| $.',
  '$ 1 $',
  'The trick is to compare $ |\\beta-\\alpha|^2 $ and $ |1-\\bar\\alpha\\beta|^2 $ directly and show they are equal.\n\n' +
  '$ |\\beta-\\alpha|^2 = (\\beta-\\alpha)(\\bar\\beta-\\bar\\alpha) = \\beta\\bar\\beta - \\beta\\bar\\alpha - \\alpha\\bar\\beta + \\alpha\\bar\\alpha = |\\beta|^2 - \\bar\\alpha\\beta - \\alpha\\bar\\beta + |\\alpha|^2 $.\n\n' +
  'Since $ |\\beta|=1 $, this becomes $ 1 - \\bar\\alpha\\beta - \\alpha\\bar\\beta + |\\alpha|^2 $.\n\n' +
  '$ |1-\\bar\\alpha\\beta|^2 = (1-\\bar\\alpha\\beta)(1-\\alpha\\bar\\beta) = 1 - \\alpha\\bar\\beta - \\bar\\alpha\\beta + \\bar\\alpha\\beta\\alpha\\bar\\beta = 1 - \\alpha\\bar\\beta - \\bar\\alpha\\beta + |\\alpha|^2|\\beta|^2 $.\n\n' +
  'Again using $ |\\beta|=1 $, this is also $ 1 - \\bar\\alpha\\beta - \\alpha\\bar\\beta + |\\alpha|^2 $ — **exactly the same expression** as $ |\\beta-\\alpha|^2 $ above.\n\n' +
  'So $ |\\beta-\\alpha|^2 = |1-\\bar\\alpha\\beta|^2 $, which means $ \\left|\\frac{\\beta-\\alpha}{1-\\bar\\alpha\\beta}\\right| = 1 $.');

const mq12 = num('NCERT Misc · Q12',
  'Find the number of non-zero integral solutions of the equation $ |1-i|^x = 2^x $.',
  '$ 0 $',
  'First find $ |1-i| $: $ |1-i| = \\sqrt{1^2+(-1)^2} = \\sqrt2 $.\n\n' +
  'So the equation becomes $ (\\sqrt2)^x = 2^x $, i.e. $ 2^{x/2} = 2^x $. Since the base is the same, the exponents must match: $ \\frac{x}{2} = x $.\n\n' +
  'Solving: $ \\frac{x}{2}-x=0 \\Rightarrow -\\frac{x}{2}=0 \\Rightarrow x=0 $.\n\n' +
  'The **only** solution is $ x=0 $, and the question asks for **non-zero** integral solutions — so there are $ 0 $ of them.');

const mq13 = num('NCERT Misc · Q13',
  'If $ (a+ib)(c+id)(e+if)(g+ih) = A+iB $, then show that $ (a^2+b^2)(c^2+d^2)(e^2+f^2)(g^2+h^2) = A^2+B^2 $.',
  'Identity — proved using $ |z_1z_2\\cdots|=|z_1||z_2|\\cdots $ (see solution)',
  'Take the modulus of both sides of the given equation. The modulus of a product of complex numbers equals the product of their moduli: $ |a+ib|\\,|c+id|\\,|e+if|\\,|g+ih| = |A+iB| $.\n\n' +
  'Now square both sides. Squaring a modulus gives the sum of squares of real and imaginary parts, i.e. $ |z|^2 = (\\text{Re}\\,z)^2+(\\text{Im}\\,z)^2 $:\n\n' +
  '$ (a^2+b^2)(c^2+d^2)(e^2+f^2)(g^2+h^2) = A^2+B^2 $ — exactly as required.');

const mq14 = num('NCERT Misc · Q14',
  'If $ \\left(\\frac{1+i}{1-i}\\right)^m = 1 $, then find the least positive integral value of $ m $.',
  '$ 4 $',
  'Simplify the base first: $ \\frac{1+i}{1-i}\\times\\frac{1+i}{1+i} = \\frac{(1+i)^2}{2} = \\frac{2i}{2} = i $.\n\n' +
  'So the equation becomes $ i^m = 1 $. The powers of $ i $ cycle as $ i,\\ -1,\\ -i,\\ 1,\\ i,\\ -1,\\ \\dots $ with period 4 — the **first** time $ i^m $ equals $ 1 $ is at $ m=4 $.\n\n' +
  'So the least positive integral value is $ m=4 $.');

/* ── Regroup the 28 real NCERT questions into 5 revision themes ──────────── */
const s1 = sec(
  'Standard form & powers of i',
  'Ex 4.1 (Q1–Q3) & Misc Q1 — reduce powers of $ i $ using the period-4 cycle, and combine i-powers inside a bracket.',
  [e1q1, e1q2, e1q3, mq1],
);
const s2 = sec(
  'Algebra: add, subtract, multiply, expand',
  'Ex 4.1 (Q4–Q10) — add, subtract, and expand complex numbers, including binomial cubes.',
  [e1q4, e1q5, e1q6, e1q7, e1q8, e1q9, e1q10],
);
const s3 = sec(
  'Multiplicative inverses & Ex 4.1 finale',
  'Ex 4.1 (Q11–Q14) — multiplicative inverses, and the exercise’s final conjugate-ratio question.',
  [e1q11, e1q12, e1q13, e1q14],
);
const s4 = sec(
  'Conjugate, modulus & division mastery',
  'Miscellaneous Exercise (Q2, Q3, Q5–Q9) — rationalizing quotients, and conjugate/modulus computations with real numbers.',
  [mq2, mq3, mq5, mq6, mq7, mq8, mq9],
);
const s5 = sec(
  'Advanced identities & modulus proofs',
  'Miscellaneous Exercise (Q4, Q10–Q14) — the chapter’s hardest identities: modulus proofs, and equations solved via $ i^m $.',
  [mq4, mq10, mq11, mq12, mq13, mq14],
);

const NEW_SECTIONS = [s1, s2, s3, s4, s5];
const TOTAL = NEW_SECTIONS.reduce((n, s) => n + s.items.length, 0);

const NEW_TEXT_MARKDOWN =
  'You have read the chapter — now **drill it**. Below are **all 28 questions** from the real NCERT ' +
  '**Exercise 4.1** and the **Miscellaneous Exercise** for this chapter, regrouped by idea rather than ' +
  'the textbook’s running order, so each cluster hammers one skill.\n\n' +
  'Try every question on paper **first**. Only then tap to open the worked solution — the struggle before ' +
  'you peek is what makes it stick. The solution shows every step, so a question you get wrong becomes a ' +
  'mini-lesson, not just a red cross.';

const NEW_PRACTICE_BANK_INTRO =
  'Pick a theme on the left. Each question is a genuine NCERT textbook exercise, carrying its exact source ' +
  'tag; tap a question to reveal a full, step-by-step worked solution in plain language.';

const NEW_SUBTITLE =
  'All 28 real NCERT exercises for the chapter (Exercise 4.1 and the Miscellaneous Exercise), regrouped ' +
  'into 5 revision themes, each with a full worked solution.';

if (require.main === module) {
  (async () => {
    await withDb(async (db) => {
      const pages = db.collection('book_pages');
      const cur = await pages.findOne({ slug: 'complex-numbers-practice' });
      if (!cur) throw new Error('page not found: complex-numbers-practice');

      const newBlocks = cur.blocks.map((blk) => {
        if (blk.type === 'text') {
          return { ...blk, markdown: NEW_TEXT_MARKDOWN };
        }
        if (blk.type === 'practice_bank') {
          return { ...blk, intro: NEW_PRACTICE_BANK_INTRO, sections: NEW_SECTIONS };
        }
        return blk; // image block untouched
      });

      const result = await savePage(db, { slug: 'complex-numbers-practice' }, newBlocks, {
        author: 'agent',
        summary: `Replaced invented practice_bank (source:'mcq') with the real, verbatim NCERT Ex 4.1 ` +
          `(14 Qs) + Miscellaneous Exercise (14 Qs) = ${TOTAL} questions, source:'ncert_exercise', ` +
          `transcribed from the real Ch.4 PDF and independently re-verified. Also corrected the intro text ` +
          `and subtitle's stale "30 questions"/"original problems" claims.`,
        extraSet: { subtitle: NEW_SUBTITLE },
      });
      console.log('savePage result:', JSON.stringify({ slug: result.slug, version: result.version, diff: result.diff }, null, 2));
    });
    console.log(`DONE · ${NEW_SECTIONS.length} sections · ${TOTAL} real NCERT questions (source:'ncert_exercise').`);
  })().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { NEW_SECTIONS, TOTAL };
