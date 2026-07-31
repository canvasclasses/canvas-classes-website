'use strict';
/* Class 11 Math · Ch.4 Complex Numbers and Quadratic Equations — pages 8–9:
   the end-of-chapter PRACTICE page (practice_bank, 5 themes, 30 items) and the
   RECAP page. Additive + idempotent (skip-if-exists by slug). published:false.

   SOURCING NOTE (see _agents/plans/MATH_CH4_COMPLEX_NUMBERS_PLAN.md §A): no
   NCERT Ch.4 PDF was available at build time (only Ch1–3 exist in the source
   folder), so every item here is an ORIGINAL, independently-verified problem
   of the same type/scope as the standard NCERT Ex 4.1/4.2/4.3/Misc set — not a
   transcription. Tagged source:'mcq' (never 'ncert_exercise') to avoid a false
   verbatim-sourcing claim, per the task's Rule 0 anti-hallucination gate.

   Run: node scripts/math11-book/build_ch4_practice_recap.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch4');
const { v4: uuidv4 } = require('uuid');

/* item helpers — every id is a fresh uuid. source:'mcq' = generic own-authored
   bucket (see sourcing note above), never a false NCERT-verbatim claim. */
const num = (source_label, prompt, answer, solution) =>
  ({ id: uuidv4(), kind: 'numerical', source: 'mcq', source_label, prompt, answer, solution });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ── Section 1 — Powers of i & definitions ────────────────────────────────── */
const s1 = sec(
  'Powers of i & definitions',
  'Simplify powers of i (positive and negative exponents), and sort real vs. imaginary parts.',
  [
    num('Practice · Powers of i · Q1',
      'Evaluate $ i^{41} $.',
      '$ i $',
      '$ 41 = 4 \\times 10 + 1 $, so $ 41 \\equiv 1 \\pmod 4 $. Hence $ i^{41} = i^1 = i $.'),
    num('Practice · Powers of i · Q2',
      'Evaluate $ i^{-99} $.',
      '$ i $',
      'First reduce $ 99 $: $ 99 = 4\\times24+3 $, so $ i^{99}=i^3=-i $. Then $ i^{-99} = \\dfrac{1}{-i} = ' +
      '\\dfrac{1}{-i}\\times\\dfrac{i}{i} = \\dfrac{i}{-i^2} = \\dfrac{i}{1} = i $.\n\n' +
      '**Shortcut:** $ -99 \\equiv 1 \\pmod 4 $ directly, since $ -99 = 4\\times(-25) + 1 $ — same answer, no double step needed.'),
    num('Practice · Powers of i · Q3',
      'Simplify $ 1 + i^2 + i^4 + i^6 + i^8 $.',
      '$ 1 $',
      'Reduce each power: $ i^2=-1,\\ i^4=1,\\ i^6=-1,\\ i^8=1 $ (even powers only ever give $ \\pm1 $).\n\n' +
      'Sum: $ 1 + (-1) + 1 + (-1) + 1 = 1 $.'),
    num('Practice · Powers of i · Q4',
      'For $ z = 7 $ (thought of as a complex number $ 7 + 0i $), state whether $ z $ is purely real, purely imaginary, or neither, and give $ \\text{Re}(z) $ and $ \\text{Im}(z) $.',
      'Purely real; $ \\text{Re}(z)=7,\\ \\text{Im}(z)=0 $',
      'Every real number is a complex number with imaginary part $ 0 $. Here $ \\text{Re}(z) = 7 $ and $ \\text{Im}(z) = 0 $, so $ z $ is **purely real**.'),
    num('Practice · Powers of i · Q5',
      'For $ z = -9i $, give $ \\text{Re}(z) $ and $ \\text{Im}(z) $, and state whether $ z $ is purely real, purely imaginary, or neither.',
      '$ \\text{Re}(z)=0,\\ \\text{Im}(z)=-9 $; purely imaginary',
      'Write $ z = 0 + (-9)i $. The real part is $ 0 $ and the imaginary part is $ -9 $ (non-zero), so $ z $ is **purely imaginary**.'),
    num('Practice · Powers of i · Q6',
      'Simplify $ i^{19} + i^{-19} $.',
      '$ 0 $',
      '$ 19 = 4\\times4+3 $, so $ i^{19} = i^3 = -i $.\n\n' +
      'Then $ i^{-19} = \\dfrac{1}{-i} = i $ (same rationalizing trick as Q2).\n\n' +
      'Sum: $ -i + i = 0 $.'),
  ],
);

/* ── Section 2 — Algebra of complex numbers ───────────────────────────────── */
const s2 = sec(
  'Algebra of complex numbers',
  'Add, subtract, multiply — and check the algebra laws actually hold.',
  [
    num('Practice · Algebra · Q1',
      'Find $ (3+5i) + (-2+4i) $.',
      '$ 1 + 9i $',
      'Add real parts and imaginary parts separately: $ (3+(-2)) + (5+4)i = 1 + 9i $.'),
    num('Practice · Algebra · Q2',
      'Find $ (6-2i) - (4+3i) $.',
      '$ 2 - 5i $',
      '$ (6-4) + (-2-3)i = 2 - 5i $. Watch the sign on the second imaginary part — subtracting $ +3i $ gives $ -3i $, not $ +3i $.'),
    num('Practice · Algebra · Q3',
      'Find $ (2+3i)(2-3i) $.',
      '$ 13 $',
      'This is a $ (p+q)(p-q) = p^2-q^2 $ pattern: $ 2^2 - (3i)^2 = 4 - 9i^2 = 4 - 9(-1) = 4+9 = 13 $.\n\n' +
      '**Notice:** a complex number times its conjugate always lands on a real number — this is $ z\\bar z = \\lvert z\\rvert^2 $, coming up properly in the next section.'),
    num('Practice · Algebra · Q4',
      'Simplify $ (1+i)^2 $.',
      '$ 2i $',
      'Expand: $ (1+i)(1+i) = 1 + i + i + i^2 = 1 + 2i - 1 = 2i $.'),
    num('Practice · Algebra · Q5',
      'Simplify $ (3+2i)(1-i) + (4-i) $.',
      '$ 9 - 2i $',
      'First multiply: $ (3+2i)(1-i) = 3 - 3i + 2i - 2i^2 = 3 - i + 2 = 5 - i $.\n\n' +
      'Then add $ (4-i) $: $ (5-i) + (4-i) = 9 - 2i $.'),
    num('Practice · Algebra · Q6',
      'For $ z_1=1+i,\\ z_2=2-i,\\ z_3=3+2i $, verify the distributive law by computing $ z_1(z_2+z_3) $ and $ z_1z_2+z_1z_3 $ separately.',
      'Both equal $ 4 + 6i $',
      '**Left side:** $ z_2+z_3 = 5+i $, so $ z_1(z_2+z_3) = (1+i)(5+i) = 5+i+5i+i^2 = 5+6i-1 = 4+6i $.\n\n' +
      '**Right side:** $ z_1z_2 = (1+i)(2-i) = 2-i+2i-i^2 = 2+i+1 = 3+i $, and $ z_1z_3 = (1+i)(3+2i) = 3+2i+3i+2i^2 = 3+5i-2 = 1+5i $.\n\n' +
      'Sum: $ (3+i)+(1+5i) = 4+6i $ — matches the left side, confirming the distributive law.'),
  ],
);

/* ── Section 3 — Conjugate, modulus & division ────────────────────────────── */
const s3 = sec(
  'Conjugate, modulus & division',
  'Rationalize a quotient, find an inverse, and use the conjugate/modulus properties directly.',
  [
    num('Practice · Conjugate & modulus · Q1',
      'Find the conjugate and modulus of $ z = 8 - 6i $.',
      '$ \\overline z = 8+6i,\\ \\lvert z\\rvert = 10 $',
      'Conjugate: flip the sign of the imaginary part → $ 8+6i $.\n\n' +
      'Modulus: $ \\sqrt{8^2+(-6)^2} = \\sqrt{64+36} = \\sqrt{100} = 10 $.'),
    num('Practice · Conjugate & modulus · Q2',
      'Express $ \\dfrac{4+3i}{1-2i} $ in the form $ a+bi $.',
      '$ -\\dfrac25 + \\dfrac{11}{5}i $',
      'Multiply by the conjugate of the denominator, $ 1+2i $:\n\n' +
      'Numerator: $ (4+3i)(1+2i) = 4+8i+3i+6i^2 = 4+11i-6 = -2+11i $.\n\n' +
      'Denominator: $ (1-2i)(1+2i) = 1+4 = 5 $.\n\n' +
      'Result: $ \\dfrac{-2+11i}{5} = -\\dfrac25 + \\dfrac{11}{5}i $.'),
    num('Practice · Conjugate & modulus · Q3',
      'Find the multiplicative inverse of $ z = 5+12i $.',
      '$ \\dfrac{5}{169} - \\dfrac{12}{169}i $',
      '$ \\overline z = 5-12i $, and $ \\lvert z\\rvert^2 = 5^2+12^2 = 25+144 = 169 $.\n\n' +
      '$ z^{-1} = \\dfrac{\\overline z}{\\lvert z\\rvert^2} = \\dfrac{5-12i}{169} = \\dfrac{5}{169} - \\dfrac{12}{169}i $.'),
    num('Practice · Conjugate & modulus · Q4',
      'Verify $ \\lvert z_1z_2\\rvert = \\lvert z_1\\rvert\\lvert z_2\\rvert $ for $ z_1 = 3+4i $ and $ z_2 = 1+i $.',
      'Both sides equal $ 5\\sqrt2 $',
      '$ \\lvert z_1\\rvert = \\sqrt{9+16}=5 $ and $ \\lvert z_2\\rvert = \\sqrt2 $, so the right side is $ 5\\sqrt2 $.\n\n' +
      'Left side: $ z_1z_2 = (3+4i)(1+i) = 3+3i+4i+4i^2 = 3+7i-4 = -1+7i $, so $ \\lvert z_1z_2\\rvert = \\sqrt{1+49} = \\sqrt{50} = 5\\sqrt2 $. Both sides match.'),
    num('Practice · Conjugate & modulus · Q5',
      'Simplify $ \\dfrac{2-i}{2+i} + \\dfrac{2+i}{2-i} $.',
      '$ \\dfrac65 $',
      'Combine over the common denominator $ (2+i)(2-i) = 5 $:\n\n' +
      'Numerator: $ (2-i)^2 + (2+i)^2 = (4-4i+i^2) + (4+4i+i^2) = (3-4i) + (3+4i) = 6 $.\n\n' +
      'So the sum is $ \\dfrac{6}{5} $.'),
    num('Practice · Conjugate & modulus · Q6',
      'For $ z = 4-7i $, check numerically that $ z+\\overline z = 2\\,\\text{Re}(z) $ and $ z-\\overline z = 2i\\,\\text{Im}(z) $.',
      'Both identities hold: $ 8 = 2(4) $ and $ -14i = 2i(-7) $',
      '$ \\overline z = 4+7i $.\n\n' +
      '$ z+\\overline z = (4-7i)+(4+7i) = 8 $, and $ 2\\,\\text{Re}(z) = 2(4) = 8 $. ✓\n\n' +
      '$ z-\\overline z = (4-7i)-(4+7i) = -14i $, and $ 2i\\,\\text{Im}(z) = 2i(-7) = -14i $. ✓'),
  ],
);

/* ── Section 4 — Argand plane & polar form ────────────────────────────────── */
const s4 = sec(
  'Argand plane & polar form',
  'Plot, identify quadrants, and convert between rectangular and polar form.',
  [
    num('Practice · Argand & polar · Q1',
      'Plot $ z = -6+8i $ on the Argand plane. Which quadrant is it in, and what is $ \\lvert z\\rvert $?',
      'Quadrant II; $ \\lvert z\\rvert = 10 $',
      'Real part negative, imaginary part positive → **Quadrant II**.\n\n' +
      '$ \\lvert z\\rvert = \\sqrt{(-6)^2+8^2} = \\sqrt{36+64} = \\sqrt{100} = 10 $.'),
    num('Practice · Argand & polar · Q2',
      'A complex number lies on the negative real axis with modulus 5. Write it in the form $ a+bi $.',
      '$ -5+0i $',
      'On the real axis, the imaginary part is $ 0 $. "Negative real axis" means the real part is negative, and its distance from the origin (the modulus) is the size of that real part: $ z = -5 $.'),
    num('Practice · Argand & polar · Q3',
      'Convert $ z = \\sqrt3 + i $ to polar form.',
      '$ 2(\\cos30° + i\\sin30°) $',
      '$ r = \\sqrt{(\\sqrt3)^2+1^2} = \\sqrt{3+1} = 2 $.\n\n' +
      '$ \\tan\\theta = \\dfrac{1}{\\sqrt3} $, and both parts are positive (Quadrant I), so $ \\theta = 30° $.\n\n' +
      '$ z = 2(\\cos30° + i\\sin30°) $.'),
    num('Practice · Argand & polar · Q4',
      'Convert $ z = 4(\\cos150° + i\\sin150°) $ to the form $ a+bi $.',
      '$ -2\\sqrt3 + 2i $',
      '$ \\cos150° = -\\dfrac{\\sqrt3}{2} $ and $ \\sin150° = \\dfrac12 $.\n\n' +
      '$ z = 4\\left(-\\dfrac{\\sqrt3}{2}\\right) + 4\\left(\\dfrac12\\right)i = -2\\sqrt3 + 2i $.'),
    num('Practice · Argand & polar · Q5',
      'Find the modulus and principal argument of $ z = -1-i $.',
      '$ \\lvert z\\rvert = \\sqrt2,\\ \\arg(z) = -135° = -\\dfrac{3\\pi}{4} $',
      '$ r = \\sqrt{1+1} = \\sqrt2 $. The reference angle from $ \\tan\\theta=1 $ is $ 45° $, but both parts are negative (Quadrant III), so measuring into the principal range $ (-\\pi,\\pi] $ gives $ \\theta = -(180°-45°) = -135° $.'),
    num('Practice · Argand & polar · Q6',
      'Show that $ z_1 = 2+2i $ and $ z_2 = -2+2i $ have the same modulus, and explain why they are reflections of each other across the imaginary axis.',
      '$ \\lvert z_1\\rvert = \\lvert z_2\\rvert = 2\\sqrt2 $; reflected across the imaginary axis',
      '$ \\lvert z_1\\rvert = \\sqrt{4+4} = \\sqrt8 = 2\\sqrt2 $ and $ \\lvert z_2\\rvert = \\sqrt{4+4} = 2\\sqrt2 $ — equal.\n\n' +
      '$ z_2 $ has exactly the same imaginary part as $ z_1 $ but the opposite-signed real part — that is precisely what reflecting a point across the **imaginary (vertical) axis** does.'),
  ],
);

/* ── Section 5 — Quadratic equations with complex roots ───────────────────── */
const s5 = sec(
  'Quadratic equations with complex roots',
  'Solve real-coefficient quadratics whose discriminant is negative.',
  [
    num('Practice · Quadratics · Q1',
      'Solve $ x^2+9=0 $.',
      '$ x = \\pm 3i $',
      '$ x^2 = -9 $, so $ x = \\pm\\sqrt{-9} = \\pm 3i $.'),
    num('Practice · Quadratics · Q2',
      'Solve $ x^2-2x+5=0 $.',
      '$ x = 1 \\pm 2i $',
      '$ D = (-2)^2-4(1)(5) = 4-20 = -16 $.\n\n' +
      '$ x = \\dfrac{2 \\pm \\sqrt{-16}}{2} = \\dfrac{2\\pm4i}{2} = 1 \\pm 2i $.'),
    num('Practice · Quadratics · Q3',
      'Solve $ 3x^2+2x+1=0 $.',
      '$ x = \\dfrac{-1 \\pm i\\sqrt2}{3} $',
      '$ D = 2^2-4(3)(1) = 4-12 = -8 $.\n\n' +
      '$ x = \\dfrac{-2 \\pm \\sqrt{-8}}{6} = \\dfrac{-2 \\pm 2i\\sqrt2}{6} = \\dfrac{-1 \\pm i\\sqrt2}{3} $.'),
    num('Practice · Quadratics · Q4',
      'Show that the roots of $ x^2+4x+13=0 $ are complex conjugates, and find them.',
      '$ x = -2 \\pm 3i $',
      '$ D = 4^2-4(1)(13) = 16-52 = -36 $, which is negative, so the roots are a conjugate pair.\n\n' +
      '$ x = \\dfrac{-4\\pm\\sqrt{-36}}{2} = \\dfrac{-4\\pm6i}{2} = -2\\pm3i $ — indeed $ -2+3i $ and $ -2-3i $ are conjugates of each other.'),
    num('Practice · Quadratics · Q5',
      'One root of a real-coefficient quadratic is $ 3-2i $. Find the quadratic equation (with integer coefficients) that has this and its conjugate as roots.',
      '$ x^2 - 6x + 13 = 0 $',
      'The other root must be the conjugate, $ 3+2i $ (real coefficients force conjugate pairs).\n\n' +
      'Sum of roots $ = (3-2i)+(3+2i) = 6 $. Product of roots $ = (3-2i)(3+2i) = 9-4i^2 = 9+4 = 13 $.\n\n' +
      'A quadratic with sum $ S $ and product $ P $ of its roots is $ x^2 - Sx + P = 0 $: $ x^2 - 6x + 13 = 0 $.'),
    num('Practice · Quadratics · Q6',
      'Without fully solving, compare the nature of the roots of $ x^2-4x+4=0 $ and $ x^2-4x+5=0 $.',
      'First: equal real roots (D=0). Second: complex conjugate roots (D=-4)',
      'For $ x^2-4x+4=0 $: $ D = 16-16 = 0 $, so the roots are **real and equal**.\n\n' +
      'For $ x^2-4x+5=0 $: $ D = 16-20 = -4 $, which is negative, so the roots are a **complex conjugate pair**. Changing only the constant term flipped the whole nature of the roots.'),
  ],
);

const practicePage = {
  slug: 'complex-numbers-practice',
  title: 'Practice — Exercises',
  subtitle: 'Thirty questions covering every idea in the chapter, regrouped into 5 revision themes, each with a full worked solution.',
  page_number: 8,
  page_type: 'lesson',
  blocks: [
    b('image', 0, {
      src: '', alt: 'A grid of worked complex-number problems glowing on a dark background', caption: '',
      width: 'full', aspect_ratio: '16:5',
      generation_prompt:
        'Ultra-wide cinematic banner (16:5). A tidy grid of glowing hand-worked mathematics — a plotted point, ' +
        'a small rotating angle, a fraction being rationalized, and a parabola floating above a line — arranged ' +
        'like flash-cards on a deep near-black background, with a pen mid-stroke solving one of them. Violet, ' +
        'amber and sky-blue glow, elegant graphing-poster style, no readable text.',
    }),
    b('text', 1, {
      markdown:
        'You have read the chapter — now **drill it**. Below are **30 practice questions**, regrouped by idea ' +
        'rather than the order they were taught, so each cluster hammers one skill.\n\n' +
        'Try every question on paper **first**. Only then tap to open the worked solution — the struggle before ' +
        'you peek is what makes it stick.',
    }),
    b('practice_bank', 2, {
      title: 'Practice · Complex Numbers and Quadratic Equations',
      intro:
        'Pick a theme on the left. Each question is a fresh, checked problem of the same type and difficulty as ' +
        'a standard textbook exercise; tap a question to reveal a full, step-by-step worked solution.',
      sections: [s1, s2, s3, s4, s5],
    }),
  ],
};

/* ── Page 9 — Recap ────────────────────────────────────────────────────────── */
const recapBlocks = [
  b('image', 0, {
    src: '', alt: 'A single glowing thread connecting powers of i, algebra, a plotted point, a rotating angle and a parabola, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A single glowing thread winding through five small glyphs in a row — ' +
      'the letter i, a plus/times symbol, a mirror-image pair of points, a rotating angle on a circle, and a ' +
      'parabola — tying the whole chapter together. Violet and amber glow on a deep near-black background, ' +
      'elegant mathematical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      '**The chapter in one line:** we invented $ i $ so that $ i^2=-1 $, built an entire number system ' +
      '$ a+bi $ around it, learned to see those numbers as points on a plane, and used the new numbers to solve ' +
      'every quadratic equation — not just the friendly ones.',
  }),
  b('table', 2, {
    caption: 'Definitions and formulas at a glance',
    headers: ['Idea', 'Formula'],
    rows: [
      ['Imaginary unit', '$ i^2 = -1 $'],
      ['Complex number', '$ z = a+bi,\\ \\ \\text{Re}(z)=a,\\ \\text{Im}(z)=b $'],
      ['Addition / subtraction', '$ (a+bi) \\pm (c+di) = (a\\pm c)+(b\\pm d)i $'],
      ['Multiplication', '$ (a+bi)(c+di) = (ac-bd)+(ad+bc)i $'],
      ['Conjugate', '$ \\overline{a+bi} = a-bi $'],
      ['Modulus', '$ \\lvert a+bi\\rvert = \\sqrt{a^2+b^2} $'],
      ['Multiplicative inverse', '$ z^{-1} = \\overline z / \\lvert z\\rvert^2 $'],
      ['Polar form', '$ z = r(\\cos\\theta+i\\sin\\theta),\\ \\ r=\\lvert z\\rvert,\\ \\theta=\\arg(z) $'],
      ['Complex quadratic roots', '$ x = \\dfrac{-b\\pm i\\sqrt{4ac-b^2}}{2a} $ when $ b^2-4ac<0 $'],
    ],
  }),
  b('table', 3, {
    caption: 'Swap-traps — mistakes worth guarding against',
    headers: ['Easy to confuse', 'The actual difference'],
    rows: [
      ['$ \\text{Im}(z) $ vs. the imaginary term', '$ \\text{Im}(a+bi) = b $ (a real number) — NOT $ bi $ itself'],
      ['$ i^n $ for large $ n $', 'Reduce the exponent mod 4 first; never try to multiply it out directly'],
      ['$ D > 0 $ vs. $ D < 0 $', '$ D>0 $: real roots (parabola crosses the axis). $ D<0 $: complex conjugate roots (parabola never touches it)'],
      ['Argument vs. reference angle', '$ \\tan\\theta $ only gives the reference angle — the signs of $ a $ and $ b $ decide the actual quadrant/argument'],
      ['Conjugate reflects which axis?', 'The **real** axis (flips the sign of the imaginary part only) — not the imaginary axis'],
    ],
  }),
  b('reasoning_prompt', 4, {
    reasoning_type: 'logical',
    prompt: 'A student says "the range of $ i^n $ is infinite, since n can be any whole number." Is that right?',
    options: ['No — i^n only ever takes 4 possible values, no matter how large n is', 'Yes — every power of i is a different number', 'Only true for negative n'],
    reveal: 'No. Because $ i^4=1 $, the powers of i cycle through only four values — $ i,\\ -1,\\ -i,\\ 1 $ — forever, regardless of how large (or negative) the exponent is.',
    difficulty_level: 2,
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'spatial',
    prompt: 'Two complex numbers have the same modulus but different arguments. Are they the same point on the Argand plane?',
    options: ['No — same distance from the origin, but in different directions, so different points', 'Yes — modulus is all that matters', 'Only if both arguments are positive'],
    reveal: 'No. Modulus alone only fixes how far from the origin a point is — it could be anywhere on a circle of that radius. The argument is what pins down the exact direction, and so the exact point.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.67,
    questions: [
      q('What is $ i^{50} $?',
        ['$ 1 $', '$ -1 $', '$ i $', '$ -i $'],
        1,
        '$ 50 = 4\\times12+2 $, so $ 50 \\equiv 2 \\pmod4 $, giving $ i^{50}=i^2=-1 $.',
        2),
      q('What is the modulus of a purely imaginary number $ bi $ (with $ b $ real)?',
        ['$ \\lvert b\\rvert $', '$ b $', '$ 0 $', '$ b^2 $'],
        0,
        '$ \\lvert bi\\rvert = \\sqrt{0^2+b^2} = \\sqrt{b^2} = \\lvert b\\rvert $ — the size of $ b $, always non-negative.',
        2),
      q('A real-coefficient quadratic has one root $ 2+3i $. What must the other root be?',
        ['$ 2+3i $', '$ -2-3i $', '$ -2+3i $', '$ 2-3i $'],
        3,
        'Complex roots of a real-coefficient quadratic always come in conjugate pairs, so the other root must be $ 2-3i $ — same real part, opposite-signed imaginary part.',
        1),
      q('For $ z = r(\\cos\\theta+i\\sin\\theta) $ with $ r=2,\\ \\theta=90° $, what is $ z $ in the form $ a+bi $?',
        ['$ 2 $', '$ -2 $', '$ 2i $', '$ -2i $'],
        2,
        '$ \\cos90°=0 $ and $ \\sin90°=1 $, so $ z = 2(0) + 2(1)i = 2i $ — purely imaginary, matching a point straight up the imaginary axis.',
        2),
    ],
  }),
  b('text', 7, {
    markdown:
      'That closes Complex Numbers and Quadratic Equations. Every quadratic you meet from now on has a full ' +
      'set of roots — real or complex — and you have the tools to find and describe both.',
  }),
];

const recapPage = {
  slug: 'complex-numbers-recap',
  title: 'Chapter Recap',
  subtitle: 'Every definition, formula and common trap from the chapter, in one place.',
  page_number: 9,
  page_type: 'lesson',
  blocks: recapBlocks,
};

module.exports = { practicePage, recapPage };

if (require.main === module) {
  (async () => {
    await withDb(async (db) => {
      const bookId = await ensureBookAndChapter(db);
      await insertPages(db, bookId, [practicePage, recapPage]);
    });
    const total = [s1, s2, s3, s4, s5].reduce((n, s) => n + s.items.length, 0);
    console.log(`practice + recap DONE (unpublished) · ${[s1, s2, s3, s4, s5].length} sections · ${total} practice questions.`);
  })().catch((e) => { console.error(e); process.exit(1); });
}
