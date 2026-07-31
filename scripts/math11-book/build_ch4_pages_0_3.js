'use strict';
/* Class 11 Math · Ch.4 Complex Numbers and Quadratic Equations — pages 0–3.
   Additive + idempotent. Run: node scripts/math11-book/build_ch4_pages_0_3.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch4');

/* ── Page 0 — Chapter opener ─────────────────────────────────────────────── */
const p0 = [
  b('image', 0, {
    src: '', alt: 'A closed door labelled with a broken equation opening onto a glowing new number plane, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). On the left, a cracked stone tablet reading a simple equation ' +
      'with a red "no solution" mark; on the right, the same tablet dissolves into a glowing plane of ' +
      'scattered points and a spiral of light — the idea of a brand-new kind of number opening up beyond ' +
      'the real number line. Deep violet and amber glow on a near-black background, elegant mathematical-' +
      'poster style. No readable text.',
  }),
  b('text', 1, {
    markdown:
      'Try to solve $ x^2 + 1 = 0 $ using only the numbers you already know. You need $ x^2 = -1 $ — but ' +
      'every real number, squared, comes out **zero or positive**. Never negative. So inside the real ' +
      'numbers, this equation has **no solution at all**.\n\n' +
      'Rather than give up, mathematicians did something bold: they **invented a new number** whose square ' +
      'is $ -1 $, and built an entire, perfectly consistent system around it. That number is called $ i $, ' +
      'and the numbers built from it are the **complex numbers** — the subject of this chapter.',
  }),
  b('text', 2, {
    markdown:
      '**What you will be able to do by the end**\n\n' +
      '- Write down what $ i $ actually is, and simplify any power of $ i $\n' +
      '- Add, subtract, multiply and divide complex numbers\n' +
      '- Use the **conjugate** and the **modulus** — the two tools that make division and distance work\n' +
      '- **Plot** a complex number as a point on the **Argand plane**, and read off its **polar form** ' +
      '$ r(\\cos\\theta + i \\sin\\theta) $\n' +
      '- Solve **any** quadratic equation $ ax^2+bx+c=0 $ — even when it has no real roots',
  }),
];

/* ── Page 1 — What Is a Complex Number? (NCERT 4.2) ──────────────────────── */
const p1 = [
  b('image', 0, {
    src: '', alt: 'A glowing letter i orbited by four rotating symbols 1, i, -1, -i, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A single glowing violet "i" at the centre, orbited by four small ' +
      'glowing tokens reading 1, i, -1, -i arranged in a repeating rotational cycle, like a clock face with ' +
      'four positions. Amber and violet glow on a deep near-black background, elegant mathematical-poster ' +
      'style. No other text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'Electrical engineers use complex numbers constantly to describe alternating current — but they write ' +
      'the imaginary unit as $ j $, not $ i $, because $ i $ was already taken for electric current! Same ' +
      'idea, different letter.',
  }),
  b('text', 2, {
    markdown:
      'Define a new number $ i $ (called **iota**) with exactly one property: $ i^2 = -1 $. With this one rule, ' +
      '$ x^2+1=0 $ finally has solutions: $ x = i $ and $ x = -i $, since $ i^2 = -1 $ and $ (-i)^2 = i^2 = -1 $ too.\n\n' +
      'A **complex number** is anything of the form $ a + bi $, where $ a $ and $ b $ are ordinary real numbers.',
  }),
  b('latex_block', 3, {
    latex: 'z = a + bi, \\qquad i^2 = -1',
    label: 'A complex number', highlight: true,
  }),
  b('text', 4, {
    markdown:
      'For $ z = a + bi $:\n\n' +
      '- $ a $ is called the **real part**, written $ \\text{Re}(z) $\n' +
      '- $ b $ is called the **imaginary part**, written $ \\text{Im}(z) $ (note: $ b $ itself is a real number ' +
      '— it is the *coefficient* of $ i $, not $ bi $ itself)\n\n' +
      'If $ b = 0 $, $ z $ is **purely real** (an ordinary real number). If $ a = 0 $ and $ b \\ne 0 $, $ z $ is ' +
      '**purely imaginary**.',
  }),
  b('text', 5, {
    markdown:
      'Because $ i^2 = -1 $, every higher power of $ i $ collapses back into one of just **four** values. Watch ' +
      'the cycle repeat:',
  }),
  b('table', 6, {
    caption: 'The four-value cycle of powers of i',
    headers: ['Power', 'Value', 'Why'],
    rows: [
      ['$ i^1 $', '$ i $', 'the definition'],
      ['$ i^2 $', '$ -1 $', 'the defining rule'],
      ['$ i^3 $', '$ -i $', '$ i^2 \\cdot i = (-1)(i) $'],
      ['$ i^4 $', '$ 1 $', '$ i^2 \\cdot i^2 = (-1)(-1) $'],
      ['$ i^5 $', '$ i $', 'the cycle restarts — same as $ i^1 $'],
    ],
  }),
  b('callout', 7, {
    variant: 'remember', title: 'The shortcut',
    markdown:
      'To find any power $ i^n $, you only ever need the **remainder** when $ n $ is divided by 4:\n\n' +
      '$ n \\equiv 1 \\Rightarrow i,\\quad n \\equiv 2 \\Rightarrow -1,\\quad n \\equiv 3 \\Rightarrow -i,\\quad n \\equiv 0 \\Rightarrow 1 $.',
  }),
  b('worked_example', 8, {
    label: 'Evaluating large powers of i', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Evaluate (a) $ i^{57} $  (b) $ i^{-71} $.',
    solution:
      '**(a)** Divide the exponent by 4 and keep only the remainder: $ 57 = 4 \\times 14 + 1 $, so $ 57 \\equiv 1 ' +
      '\\pmod 4 $. Hence $ i^{57} = i^1 = i $.\n\n' +
      '**(b)** For a negative exponent, use $ i^{-n} = \\dfrac{1}{i^{n}} $. First, $ 71 = 4 \\times 17 + 3 $, so ' +
      '$ i^{71} = i^3 = -i $. Then $ i^{-71} = \\dfrac{1}{-i} $. Multiply top and bottom by $ i $: ' +
      '$ \\dfrac{1}{-i} \\times \\dfrac{i}{i} = \\dfrac{i}{-i^2} = \\dfrac{i}{1} = i $.\n\n' +
      '**Shortcut check:** $ -71 \\equiv 1 \\pmod 4 $ (since $ -71 = 4\\times(-18) + 1 $) — same answer, no long division of a negative number needed.',
  }),
  b('worked_example', 9, {
    label: 'A sum that vanishes', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Show that $ i + i^2 + i^3 + i^4 = 0 $.',
    solution:
      'Write out each term using the cycle: $ i,\\ -1,\\ -i,\\ 1 $.\n\n' +
      '$ i + (-1) + (-i) + 1 = (i - i) + (-1 + 1) = 0 + 0 = 0 $.\n\n' +
      '**The pattern behind it:** any four *consecutive* powers of $ i $ always add to $ 0 $ — this is why a huge ' +
      'sum like $ i + i^2 + \\cdots + i^{100} $ collapses instantly: it is just 25 complete cycles of 0 each.',
  }),
  b('reasoning_prompt', 10, {
    reasoning_type: 'quantitative',
    prompt: 'What is $ i^{100} $?',
    options: ['$ 1 $', '$ -1 $', '$ i $', '$ -i $'],
    reveal: '$ 100 = 4 \\times 25 $, so $ 100 \\equiv 0 \\pmod 4 $, which lands on $ i^4 = 1 $ (equivalently $ i^{100} = (i^4)^{25} = 1^{25} = 1 $).',
    difficulty_level: 2,
  }),
  b('inline_quiz', 11, {
    pass_threshold: 0.67,
    questions: [
      q('What is $ i^{10} $?',
        ['$ i $', '$ -1 $', '$ -i $', '$ 1 $'],
        1,
        '$ 10 = 4\\times2 + 2 $, so $ 10 \\equiv 2 \\pmod 4 $, giving $ i^{10} = i^2 = -1 $. Forgetting to reduce the exponent first and guessing $ i $ is the most common slip.',
        1),
      q('For $ z = -3 + 5i $, what is $ \\text{Re}(z) $?',
        ['$ -3 $', '$ 5 $', '$ 3 $', '$ -5 $'],
        0,
        'The real part is whatever is added to the $ i $ term, keeping its sign: here that is $ -3 $. The coefficient of $ i $, $ 5 $, is $ \\text{Im}(z) $, not the real part.',
        1),
      q('Which of these numbers is purely imaginary?',
        ['$ 3 + 0i $', '$ 3 + 4i $', '$ 0 + 4i $', '$ 0 + 0i $'],
        2,
        'Purely imaginary means the real part is zero **and** the imaginary part is non-zero: $ 0 + 4i $ fits. $ 3 + 0i $ is purely real, $ 3+4i $ has both parts non-zero, and $ 0 + 0i = 0 $ is usually classed as purely real (it has no non-zero imaginary part to make it "imaginary").',
        2),
    ],
  }),
  b('text', 12, {
    markdown:
      'Now that you can build and simplify individual complex numbers, the next question is: how do you ' +
      '**combine** two of them — add them, multiply them? The rules turn out to be almost exactly what you ' +
      'already know, with one extra fact to remember: $ i^2 = -1 $.',
  }),
];

/* ── Page 2 — The Algebra of Complex Numbers (NCERT 4.3) ─────────────────── */
const p2 = [
  b('image', 0, {
    src: '', alt: 'Two glowing complex-number tiles merging into a single result tile through addition and multiplication arrows, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two glowing tiles, each showing an abstract a+bi pattern, merging ' +
      'along two separate light paths — one labelled by a plus symbol, one by a multiplication symbol — into ' +
      'two single resulting tiles. Violet and amber glow on a deep near-black background, elegant technical-' +
      'poster style. No readable text beyond the plus/multiply symbols.',
  }),
  b('text', 1, {
    markdown:
      'Adding and subtracting complex numbers is exactly what you would guess: combine the real parts together, ' +
      'and combine the imaginary parts together.',
  }),
  b('latex_block', 2, {
    latex: '(a+bi) \\pm (c+di) = (a \\pm c) + (b \\pm d)\\,i',
  }),
  b('text', 3, {
    markdown:
      '**Multiplication** needs one extra step: expand exactly like two ordinary brackets (FOIL), then simplify ' +
      'using the one rule that makes this a *new* kind of arithmetic — $ i^2 = -1 $.',
  }),
  b('latex_block', 4, {
    latex: '(a+bi)(c+di) = (ac - bd) + (ad + bc)\\,i',
    label: 'Multiplication rule', highlight: true,
  }),
  b('text', 5, {
    markdown:
      'Every algebra law you trust for real numbers still holds for complex numbers:\n\n' +
      '- **Commutative:** $ z_1 + z_2 = z_2 + z_1 $ and $ z_1 z_2 = z_2 z_1 $\n' +
      '- **Associative:** $ (z_1+z_2)+z_3 = z_1+(z_2+z_3) $, and the same for multiplication\n' +
      '- **Distributive:** $ z_1(z_2+z_3) = z_1 z_2 + z_1 z_3 $\n' +
      '- **Identities:** $ 0 $ is the additive identity ($ z+0=z $) and $ 1 $ is the multiplicative identity ' +
      '($ z \\cdot 1 = z $); the additive inverse of $ a+bi $ is $ -a-bi $',
  }),
  b('worked_example', 6, {
    label: 'Adding, subtracting, multiplying', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'For $ z_1 = 2 + 3i $ and $ z_2 = 4 - i $, find (a) $ z_1 + z_2 $  (b) $ z_1 - z_2 $  (c) $ z_1 z_2 $.',
    solution:
      '**(a)** Add the real parts and the imaginary parts separately: $ (2+4) + (3 + (-1))i = 6 + 2i $.\n\n' +
      '**(b)** Same idea, subtracting: $ (2-4) + (3 - (-1))i = -2 + 4i $. (Watch the sign — subtracting $ -i $ flips it to $ +i $.)\n\n' +
      '**(c)** Expand like two brackets: $ (2+3i)(4-i) = 8 - 2i + 12i - 3i^2 = 8 + 10i - 3(-1) = 8 + 10i + 3 = 11 + 10i $.',
  }),
  b('worked_example', 7, {
    label: 'A product that simplifies to something surprising', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Simplify $ (1+i)^2 $.',
    solution:
      'Expand as $ (1+i)(1+i) $: $ 1 + i + i + i^2 = 1 + 2i + (-1) = 2i $.\n\n' +
      '**Notice:** $ (1+i)^2 = 2i $ — a real number squared to give something purely imaginary. This kind of ' +
      'clean simplification is exactly why complex numbers are worth learning to handle comfortably.',
  }),
  b('reasoning_prompt', 8, {
    reasoning_type: 'quantitative',
    prompt: 'What is $ (2+i) + (3-4i) $?',
    options: ['$ 5 - 3i $', '$ 5 + 3i $', '$ -1 - 3i $', '$ 6 - 4i $'],
    reveal: 'Add the real parts ($ 2+3=5 $) and the imaginary parts ($ 1 + (-4) = -3 $): $ 5 - 3i $.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 9, {
    pass_threshold: 0.67,
    questions: [
      q('$ (5 - 2i) - (3 + 4i) $ equals…',
        ['$ 2 - 6i $', '$ 8 - 6i $', '$ 2 + 2i $', '$ 8 + 2i $'],
        0,
        'Subtract real from real and imaginary from imaginary: $ (5-3) + (-2-4)i = 2 - 6i $. Adding instead of subtracting the second imaginary part gives the $ 8 - 6i $ trap.',
        1),
      q('$ (1-i)(1+i) $ equals…',
        ['$ 0 $', '$ 2 $', '$ 1 - i^2 $ left unsimplified', '$ 2i $'],
        1,
        'This is a difference-of-squares pattern: $ 1^2 - i^2 = 1 - (-1) = 2 $. A **real number** result — this exact product ($ z\\bar z $) is the key trick behind division, coming up next.',
        2),
      q('Which law does $ z_1(z_2 + z_3) = z_1z_2 + z_1z_3 $ describe?',
        ['Commutative law', 'Associative law', 'Distributive law', 'Closure law'],
        2,
        'Multiplying a sum by "distributing" the outer factor across each term is exactly the distributive law — the same one you already use for real numbers.',
        1),
    ],
  }),
  b('text', 10, {
    markdown:
      'You can add, subtract and multiply. **Division** is the one operation that needs a genuinely new tool — ' +
      'the **conjugate**. It also hands you a way to measure the "size" of a complex number: the **modulus**.',
  }),
];

/* ── Page 3 — Conjugate, Modulus & Division (NCERT 4.4) ──────────────────── */
const p3 = [
  b('image', 0, {
    src: '', alt: 'A complex number tile and its mirror-image tile reflected across a horizontal axis line, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A single glowing point above a thin horizontal light-line, with its ' +
      'mirror-image point glowing below the line at an equal distance — the picture of a complex number and ' +
      'its conjugate. Violet above, amber below, on a deep near-black background, elegant technical-poster ' +
      'style. No text.',
  }),
  b('text', 1, {
    markdown:
      'The **conjugate** of $ z = a + bi $ is $ \\overline{z} = a - bi $ — just flip the sign of the imaginary part.\n\n' +
      'Multiply a complex number by its own conjugate and something clean happens: the imaginary part cancels ' +
      'out completely, leaving a plain real number.',
  }),
  b('latex_block', 2, {
    latex: 'z\\,\\overline{z} = (a+bi)(a-bi) = a^2 + b^2',
    label: 'A complex number times its conjugate is real', highlight: true,
  }),
  b('text', 3, {
    markdown:
      'That real number, $ a^2 + b^2 $, is always $ \\ge 0 $, so it has a real square root — this defines the ' +
      '**modulus**, the "size" or distance-from-zero of $ z $.',
  }),
  b('latex_block', 4, {
    latex: '\\lvert z \\rvert = \\sqrt{a^2 + b^2}',
    label: 'Modulus', highlight: true,
  }),
  b('math_graph', 5, {
    title: 'The conjugate is a reflection',
    caption: 'z and its conjugate are mirror images of each other across the real axis.',
    spec: {
      bounds: { xmin: -1, xmax: 7, ymin: -5, ymax: 5 },
      points: [
        { x: 4, y: 3, label: 'z = 4 + 3i', color: 'violet' },
        { x: 4, y: -3, label: 'z̄ = 4 − 3i', color: 'amber' },
      ],
      annotations: [{ x: 4.3, y: 0.3, text: 'same distance from the real axis, opposite side', color: 'sky' }],
      showGrid: true, showAxes: true, keepSquare: true,
    },
    predict: {
      prompt: 'The conjugate of a complex number is its reflection across which axis?',
      options: ['The real (horizontal) axis', 'The imaginary (vertical) axis'],
      answer_index: 0,
      reveal: 'The real axis. Flipping the sign of the imaginary part only moves the point up/down, never left/right — exactly a mirror across the horizontal axis.',
    },
  }),
  b('text', 6, {
    markdown:
      'This is exactly the trick that makes **division** possible: to divide by $ c + di $, multiply top and ' +
      'bottom by its conjugate $ c - di $. The denominator becomes the real number $ c^2 + d^2 $, and you are ' +
      'left with an ordinary $ p + qi $.',
  }),
  b('callout', 7, {
    variant: 'remember', title: 'Conjugate rules worth memorising',
    markdown:
      '- $ \\overline{\\overline{z}} = z $ (conjugating twice gets you back to $ z $)\n' +
      '- $ \\overline{z_1 + z_2} = \\overline{z_1} + \\overline{z_2} $, and the same pattern for products\n' +
      '- $ z + \\overline{z} = 2\\,\\text{Re}(z) $ and $ z - \\overline{z} = 2i\\,\\text{Im}(z) $\n' +
      '- $ \\lvert z_1 z_2 \\rvert = \\lvert z_1 \\rvert \\lvert z_2 \\rvert $ and $ \\left\\lvert \\dfrac{z_1}{z_2} \\right\\rvert = \\dfrac{\\lvert z_1 \\rvert}{\\lvert z_2 \\rvert} $ ($ z_2 \\ne 0 $)\n' +
      '- **Multiplicative inverse:** $ z^{-1} = \\dfrac{\\overline{z}}{\\lvert z \\rvert^2} $',
  }),
  b('worked_example', 8, {
    label: 'Dividing by rationalizing', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Express $ \\dfrac{5 - 3i}{2 - i} $ in the form $ a + bi $.',
    solution:
      'Multiply top and bottom by the conjugate of the denominator, $ 2 + i $:\n\n' +
      '$ \\dfrac{5-3i}{2-i} \\times \\dfrac{2+i}{2+i} = \\dfrac{(5-3i)(2+i)}{(2-i)(2+i)} $.\n\n' +
      'Numerator: $ (5-3i)(2+i) = 10 + 5i - 6i - 3i^2 = 10 - i + 3 = 13 - i $.\n\n' +
      'Denominator: $ (2-i)(2+i) = 4 - i^2 = 4 + 1 = 5 $.\n\n' +
      'So the quotient is $ \\dfrac{13-i}{5} = \\dfrac{13}{5} - \\dfrac{1}{5}i $.',
  }),
  b('worked_example', 9, {
    label: 'Finding a multiplicative inverse', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the multiplicative inverse of $ z = 3 - 4i $.',
    solution:
      'Use $ z^{-1} = \\dfrac{\\overline{z}}{\\lvert z \\rvert^2} $. First, $ \\overline{z} = 3 + 4i $, and ' +
      '$ \\lvert z \\rvert^2 = 3^2 + (-4)^2 = 9 + 16 = 25 $.\n\n' +
      'So $ z^{-1} = \\dfrac{3+4i}{25} = \\dfrac{3}{25} + \\dfrac{4}{25}i $.\n\n' +
      '**Quick check:** $ z \\cdot z^{-1} $ should equal $ 1 $ — and multiplying $ (3-4i) $ by $ \\dfrac{3+4i}{25} $ gives $ \\dfrac{25}{25} = 1 $. ✓',
  }),
  b('reasoning_prompt', 10, {
    reasoning_type: 'quantitative',
    prompt: 'What is $ \\lvert 6 - 8i \\rvert $?',
    options: ['$ 2 $', '$ 10 $', '$ 14 $', '$ 100 $'],
    reveal: '$ \\lvert 6-8i \\rvert = \\sqrt{6^2 + (-8)^2} = \\sqrt{36+64} = \\sqrt{100} = 10 $. Adding the numbers instead of the *squares* (giving 14) is the classic slip.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 11, {
    pass_threshold: 0.67,
    questions: [
      q('The conjugate of $ z = -2 + 7i $ is…',
        ['$ 2 - 7i $', '$ 2 + 7i $', '$ -2 - 7i $', '$ -7 + 2i $'],
        2,
        'Conjugating only flips the **sign of the imaginary part**, leaving the real part untouched: $ -2 + 7i \\to -2 - 7i $. Flipping the real part too (giving $ 2-7i $) is not what conjugation does.',
        1),
      q('Why do we multiply by the conjugate when dividing complex numbers?',
        ['It turns the denominator into a real number', 'It cancels the real part', 'It doubles the modulus', 'It makes the numerator zero'],
        0,
        '$ (c+di)(c-di) = c^2+d^2 $ is always real. Multiplying top and bottom by the conjugate turns an "unfriendly" complex denominator into an ordinary real number you can divide by directly.',
        2),
      q('If $ \\lvert z_1 \\rvert = 3 $ and $ \\lvert z_2 \\rvert = 4 $, what is $ \\lvert z_1 z_2 \\rvert $?',
        ['$ 7 $', '$ 1 $', '$ 24 $', '$ 12 $'],
        3,
        'Modulus is multiplicative: $ \\lvert z_1 z_2 \\rvert = \\lvert z_1 \\rvert \\cdot \\lvert z_2 \\rvert = 3 \\times 4 = 12 $. Adding them (giving 7) is not how modulus behaves under multiplication.',
        2),
    ],
  }),
  b('text', 12, {
    markdown:
      'You now have every algebraic tool. The next step is to **see** a complex number rather than just ' +
      'calculate with it — by placing it as a point on a plane.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'complex-numbers-opener', title: 'Complex Numbers and Quadratic Equations',
        subtitle: 'A brand-new kind of number, born from an equation the reals could never solve.',
        page_number: 0, page_type: 'chapter_opener', blocks: p0 },
      { slug: 'what-is-a-complex-number', title: 'What Is a Complex Number?',
        subtitle: 'Meet i, i² = −1, and the four-value cycle that every power of i falls into.',
        page_number: 1, blocks: p1 },
      { slug: 'algebra-of-complex-numbers', title: 'The Algebra of Complex Numbers',
        subtitle: 'Add, subtract and multiply complex numbers — almost exactly like you already know how.',
        page_number: 2, blocks: p2 },
      { slug: 'conjugate-modulus-division', title: 'Conjugate, Modulus & Division',
        subtitle: 'The mirror-image trick that makes division possible — and measures size along the way.',
        page_number: 3, blocks: p3 },
    ]);
  });
  console.log('pages 0–3 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
