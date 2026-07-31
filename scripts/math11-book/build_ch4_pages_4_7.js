'use strict';
/* Class 11 Math · Ch.4 Complex Numbers and Quadratic Equations — pages 4–7.
   Additive + idempotent. Run: node scripts/math11-book/build_ch4_pages_4_7.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch4');

/* ── Page 4 — The Argand Plane (NCERT 4.5 part 1) ─────────────────────────── */
const p4 = [
  b('image', 0, {
    src: '', alt: 'Scattered glowing points in a coordinate plane, each labelled with a complex number, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing coordinate plane with a handful of bright points scattered ' +
      'across all four quadrants, thin light-lines dropping from each point to the two axes to show its ' +
      'coordinates — the idea of a number turned into a location. Violet, amber and sky-blue glow on a deep ' +
      'near-black background, elegant technical-poster style. No readable text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'This plane is named the **Argand plane** after Jean-Robert Argand, a Swiss bookkeeper (not even a ' +
      'professional mathematician!) who published the idea of plotting complex numbers as points in 1806. It ' +
      'is also called the **complex plane** or the **Gauss plane**.',
  }),
  b('text', 2, {
    markdown:
      'Every complex number $ z = a + bi $ can be drawn as a single point: go $ a $ units along the ' +
      '**real axis** (horizontal) and $ b $ units along the **imaginary axis** (vertical). The point $ (a, b) $ ' +
      '*is* $ z $ — nothing more mysterious than plotting on graph paper.\n\n' +
      'The **distance from the origin to that point** is exactly the modulus, $ \\lvert z \\rvert = ' +
      '\\sqrt{a^2+b^2} $ — the same distance formula you already know.',
  }),
  b('math_graph', 3, {
    title: 'Complex numbers as points',
    caption: 'Four complex numbers, plotted where they actually land.',
    spec: {
      bounds: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
      points: [
        { x: 3, y: 4, label: '3 + 4i', color: 'violet' },
        { x: -2, y: 3, label: '-2 + 3i', color: 'sky' },
        { x: -3, y: -2, label: '-3 - 2i', color: 'amber' },
        { x: 0, y: -3, label: '-3i', color: 'emerald' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
    predict: {
      prompt: 'Before you look closely — which quadrant will z = -2 + 3i fall in?',
      options: ['Quadrant I (both positive)', 'Quadrant II (real negative, imaginary positive)', 'Quadrant III (both negative)', 'Quadrant IV (real positive, imaginary negative)'],
      answer_index: 1,
      reveal: 'Quadrant II. The real part is negative (go left) and the imaginary part is positive (go up) — exactly the top-left quadrant. Also notice -3i sits ON the imaginary axis, since its real part is 0.',
    },
  }),
  b('worked_example', 4, {
    label: 'Plotting and measuring', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Plot $ z = -5 + 12i $ on the Argand plane and find its modulus.',
    solution:
      'The point sits 5 units left of the origin and 12 units up — in **Quadrant II**.\n\n' +
      'Modulus: $ \\lvert z \\rvert = \\sqrt{(-5)^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13 $.\n\n' +
      '(This is the classic 5–12–13 right triangle, hiding inside a complex number.)',
  }),
  b('text', 5, {
    markdown:
      'Because every point is a complex number, **adding** two complex numbers has a picture too: $ z_1 + z_2 $ ' +
      'always lands at the fourth corner of the parallelogram formed by the origin, $ z_1 $ and $ z_2 $ — the ' +
      'same **parallelogram law** used for adding forces or velocities in physics.',
  }),
  b('math_graph', 6, {
    title: 'Adding complex numbers — the parallelogram rule',
    caption: 'z1 + z2 completes a parallelogram with the origin.',
    spec: {
      bounds: { xmin: -1, xmax: 6, ymin: -1, ymax: 6 },
      points: [
        { x: 3, y: 1, label: 'z1 = 3 + i', color: 'violet' },
        { x: 1, y: 3, label: 'z2 = 1 + 3i', color: 'sky' },
        { x: 4, y: 4, label: 'z1+z2 = 4 + 4i', color: 'emerald' },
      ],
      annotations: [
        { x: 4.3, y: 4.5, text: 'O, z1, z2, z1+z2 form a parallelogram', color: 'emerald' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
    predict: {
      prompt: 'Before computing anything — roughly where do you expect z1 + z2 to land, relative to z1 and z2?',
      options: ['Further out from the origin than both, completing a parallelogram', 'Exactly on top of z1', 'Below the real axis', 'Exactly halfway between z1 and z2 in a straight line through the origin'],
      answer_index: 0,
      reveal: 'Add the parts separately: (3+1) + (1+3)i = 4+4i. Geometrically that point is the fourth vertex of the parallelogram whose other three vertices are the origin, z1 and z2 — further out than either one alone.',
    },
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'spatial',
    prompt: 'Does every point in the Argand plane represent some complex number?',
    options: ['Yes — every (a, b) pairs up with exactly the complex number a + bi', 'No — only points on the axes count', 'No — only points with positive coordinates count'],
    reveal: 'Yes. There is a perfect one-to-one match between points (a, b) in the plane and complex numbers a + bi — that correspondence is the entire point of the Argand plane.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('In which quadrant does $ z = 4 - 6i $ lie?',
        ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'],
        3,
        'Real part positive (right), imaginary part negative (down) — that combination is Quadrant IV. Quadrant I would need both parts positive.',
        1),
      q('What is $ \\lvert -5 + 12i \\rvert $?',
        ['$ 5 $', '$ 12 $', '$ 17 $', '$ 13 $'],
        3,
        '$ \\sqrt{(-5)^2 + 12^2} = \\sqrt{25+144} = \\sqrt{169} = 13 $. Adding $ 5+12=17 $ instead of combining the squares is the common slip.',
        2),
      q('A complex number with real part $ 0 $ lies on…',
        ['the imaginary axis', 'the real axis', 'neither axis', 'the origin only'],
        0,
        'If $ a = 0 $, the point is $ (0, b) $ — straight up or down from the origin, which is exactly the imaginary axis. It only sits at the origin itself if $ b = 0 $ too.',
        1),
    ],
  }),
  b('text', 9, {
    markdown:
      'Position isn\'t the only way to describe a point. Instead of "how far right, how far up," you could say ' +
      '"how far from the centre, and in what direction" — that is exactly the idea behind **polar form**.',
  }),
];

/* ── Page 5 — Polar Representation (NCERT 4.5 part 2) ─────────────────────── */
const p5 = [
  b('image', 0, {
    src: '', alt: 'A single glowing point rotating around a circle, tracing an arc with an angle marked at the centre, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing point sweeping around a thin circular light-path centred ' +
      'on the origin, leaving a soft trailing arc, with a bright angle wedge marked at the centre — the idea ' +
      'of describing a point by an angle and a distance rather than coordinates. Violet and amber glow on a ' +
      'deep near-black background, elegant technical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Instead of $ (a, b) $, describe a point by two other numbers: how **far** it is from the origin, and ' +
      'in what **direction**.\n\n' +
      '- $ r = \\lvert z \\rvert = \\sqrt{a^2+b^2} $ — the distance (the modulus, again)\n' +
      '- $ \\theta $, the **argument**, $ \\arg(z) $ — the angle the line to $ z $ makes with the positive real axis\n\n' +
      'Since $ a = r\\cos\\theta $ and $ b = r\\sin\\theta $ (ordinary trigonometry), every complex number can be ' +
      'written in **polar form**:',
  }),
  b('latex_block', 2, {
    latex: 'z = r(\\cos\\theta + i\\sin\\theta)',
    label: 'Polar form', highlight: true,
  }),
  b('math_graph', 3, {
    title: 'Every complex number of modulus 1',
    caption: 'Drag θ. The point traces cos θ + i sin θ — every complex number whose modulus is exactly 1.',
    archetype: 'unit-circle',
    predict: {
      prompt: 'As θ increases just past 90°, does the point\'s height (sin θ, and so the imaginary part) keep rising or start falling?',
      options: ['Keeps rising', 'Starts falling back down'],
      answer_index: 1,
      reveal: 'It starts falling. At θ = 90° the point is at its highest (sin θ = 1); push past that and the point curves back down toward the real axis — the imaginary part shrinks again even though θ keeps growing.',
    },
  }),
  b('text', 4, {
    markdown:
      'That interactive only ever shows modulus $ 1 $. For any modulus, the picture is the same idea, scaled: ' +
      'stretch the point out to distance $ r $ along the same direction $ \\theta $.',
  }),
  b('math_graph', 5, {
    title: 'Three complex numbers in polar form',
    caption: 'Same idea, three different (r, θ) pairs.',
    spec: {
      bounds: { xmin: -3, xmax: 3, ymin: -3, ymax: 3 },
      points: [
        { x: 1, y: 1, label: '1 + i', color: 'violet' },
        { x: -1, y: 1.732, label: '-1 + i√3', color: 'sky' },
        { x: 0, y: -2, label: '-2i', color: 'amber' },
      ],
      annotations: [
        { x: 1.15, y: 0.6, text: 'r = √2, θ = 45°', color: 'violet' },
        { x: -2.6, y: 2.0, text: 'r = 2, θ = 120°', color: 'sky' },
        { x: 0.2, y: -2.3, text: 'r = 2, θ = 270° (or -90°)', color: 'amber' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
  }),
  b('table', 6, {
    caption: 'Standard angles worth knowing by heart',
    headers: ['θ (degrees)', 'θ (radians)', 'cos θ', 'sin θ'],
    rows: [
      ['0°', '0', '1', '0'],
      ['30°', '$ \\pi/6 $', '$ \\sqrt3/2 $', '1/2'],
      ['45°', '$ \\pi/4 $', '$ 1/\\sqrt2 $', '$ 1/\\sqrt2 $'],
      ['60°', '$ \\pi/3 $', '1/2', '$ \\sqrt3/2 $'],
      ['90°', '$ \\pi/2 $', '0', '1'],
    ],
  }),
  b('worked_example', 7, {
    label: 'Rectangular to polar', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Convert $ z = 1 + i $ to polar form.',
    solution:
      '$ r = \\sqrt{1^2+1^2} = \\sqrt2 $.\n\n' +
      'For $ \\theta $: $ \\tan\\theta = \\dfrac{b}{a} = \\dfrac{1}{1} = 1 $, and since both the real and ' +
      'imaginary parts are positive, $ z $ sits in Quadrant I, so $ \\theta = 45° = \\dfrac{\\pi}{4} $.\n\n' +
      '$ z = \\sqrt2\\left(\\cos\\dfrac{\\pi}{4} + i\\sin\\dfrac{\\pi}{4}\\right) $.',
  }),
  b('worked_example', 8, {
    label: 'Polar back to rectangular', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Convert $ z = 2(\\cos 120° + i \\sin 120°) $ to the form $ a + bi $.',
    solution:
      '$ \\cos 120° = -\\dfrac{1}{2} $ and $ \\sin 120° = \\dfrac{\\sqrt3}{2} $.\n\n' +
      '$ z = 2\\left(-\\dfrac{1}{2}\\right) + 2\\left(\\dfrac{\\sqrt3}{2}\\right)i = -1 + \\sqrt3\\,i $.',
  }),
  b('callout', 9, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'The **principal argument** is always chosen in the range $ (-\\pi, \\pi] $.\n\n' +
      '$ \\tan\\theta = b/a $ gives you the *reference* angle only — you must look at the **signs of $ a $ and ' +
      '$ b $** to know which quadrant $ \\theta $ actually belongs to before you commit to a value.',
  }),
  b('reasoning_prompt', 10, {
    reasoning_type: 'quantitative',
    prompt: 'For $ z = -1 - i $, both the real and imaginary parts are negative. Which quadrant, and roughly what argument?',
    options: ['Quadrant II, around 135°', 'Quadrant III, around -135° (or 225°)', 'Quadrant IV, around -45°'],
    reveal: 'Quadrant III (both parts negative), and the reference angle from $ \\tan\\theta = 1 $ is 45° — landing the principal argument at $ -135° $ (i.e. $ -3\\pi/4 $), since we measure into the range $ (-\\pi, \\pi] $.',
    difficulty_level: 3,
  }),
  b('inline_quiz', 11, {
    pass_threshold: 0.6,
    questions: [
      q('The principal argument of a complex number is always chosen from which range?',
        ['$ [0, 2\\pi) $', '$ [0, \\pi] $', '$ (-\\pi, \\pi] $', '$ [-\\pi/2, \\pi/2] $'],
        2,
        'By convention, the principal argument lies in $ (-\\pi, \\pi] $ — every direction around the origin, counted once, split evenly on either side of the positive real axis.',
        2),
      q('For $ z = 1 + i $, what is $ r $?',
        ['$ 1 $', '$ \\sqrt2 $', '$ 2 $', '$ 1/\\sqrt2 $'],
        1,
        '$ r = \\sqrt{1^2+1^2} = \\sqrt2 $. Forgetting the square root (and just adding $ 1+1=2 $) is the common slip.',
        1),
      q('What is $ \\theta $ for $ z = -1 + i\\sqrt3 $?',
        ['$ 60° $', '$ 30° $', '$ 150° $', '$ 120° $'],
        3,
        'The reference angle from $ \\tan\\theta = \\sqrt3/1 $ is $ 60° $, but the real part is negative and imaginary part positive — Quadrant II — so $ \\theta = 180° - 60° = 120° $.',
        3),
      q('On the rotating-point interactive, as θ passes 90°, what happens to sin θ?',
        ['It starts decreasing', 'It keeps increasing', 'It stays constant', 'It immediately becomes negative'],
        0,
        'sin θ peaks at $ +1 $ right at θ = 90° and then decreases as θ continues — it does not turn negative until θ passes 180°.',
        2),
    ],
  }),
  b('text', 12, {
    markdown:
      'You can now describe a complex number two ways — rectangular and polar. Time to put complex numbers to ' +
      'work solving something real numbers alone could never crack: **every** quadratic equation.',
  }),
];

/* ── Page 6 — Quadratic Equations with Complex Roots (NCERT 4.6) ─────────── */
const p6 = [
  b('image', 0, {
    src: '', alt: 'Two parabolas side by side, one crossing a horizontal line twice and one floating entirely above it, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two glowing parabolic curves side by side against a thin horizontal ' +
      'axis line — the left one dips down and crosses the line at two clear points, the right one stays ' +
      'entirely above the line, never touching it. Sky-blue and violet glow on a deep near-black background, ' +
      'elegant technical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'For $ ax^2+bx+c=0 $, the **discriminant** $ D = b^2-4ac $ decides everything. When $ D \\ge 0 $, the ' +
      'usual real roots exist. But when $ D < 0 $ — remember the opening problem, $ x^2+1=0 $ — the *real* ' +
      'numbers give up.\n\n' +
      'Complex numbers don\'t. Rewrite $ \\sqrt{D} $ (with $ D $ negative) as $ i\\sqrt{-D} $, and the quadratic ' +
      'formula works exactly as before.',
  }),
  b('latex_block', 2, {
    latex: 'x = \\dfrac{-b \\pm i\\sqrt{4ac-b^2}}{2a} \\qquad (\\text{when } b^2 - 4ac < 0)',
    label: 'Quadratic formula, complex-root case', highlight: true,
  }),
  b('text', 3, {
    markdown:
      'Notice the $ \\pm $: whenever $ a, b, c $ are real and $ D<0 $, the two roots are always a **conjugate ' +
      'pair** — if $ p+qi $ is one root, $ p-qi $ is automatically the other.',
  }),
  b('math_graph', 4, {
    title: 'What "no real roots" looks like',
    caption: 'One parabola crosses the x-axis (real roots exist); the other never does (roots are complex).',
    spec: {
      bounds: { xmin: -3, xmax: 4, ymin: -2, ymax: 6 },
      functions: [
        { expr: 'x^2 - 3*x + 2', color: 'sky', label: 'D = 1 > 0' },
        { expr: 'x^2 + x + 1', color: 'violet', label: 'D = -3 < 0' },
      ],
      annotations: [{ x: -2.5, y: 5, text: 'this one never touches the x-axis — its roots are complex', color: 'violet' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
    predict: {
      prompt: 'Which of the two curves do you expect to touch the x-axis?',
      options: ['Only the sky-blue one (D = 1 > 0)', 'Only the violet one (D = -3 < 0)', 'Both', 'Neither'],
      answer_index: 0,
      reveal: 'Only the sky-blue curve. A positive discriminant means two real x-intercepts; a negative discriminant means the parabola floats entirely above (or below) the axis — the "roots" still exist, just not as real numbers.',
    },
  }),
  b('worked_example', 5, {
    label: 'Solving with a negative discriminant', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve $ x^2 + x + 1 = 0 $.',
    solution:
      'Here $ a=1, b=1, c=1 $, so $ D = 1^2 - 4(1)(1) = 1 - 4 = -3 $. Since $ D<0 $, expect complex roots.\n\n' +
      '$ x = \\dfrac{-1 \\pm \\sqrt{-3}}{2} = \\dfrac{-1 \\pm i\\sqrt3}{2} $.\n\n' +
      'The two roots, $ \\dfrac{-1+i\\sqrt3}{2} $ and $ \\dfrac{-1-i\\sqrt3}{2} $, are conjugates of each other — exactly as guaranteed.',
  }),
  b('worked_example', 6, {
    label: 'A second discriminant check', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve $ 2x^2 - 4x + 5 = 0 $.',
    solution:
      '$ D = (-4)^2 - 4(2)(5) = 16 - 40 = -24 $.\n\n' +
      '$ x = \\dfrac{4 \\pm \\sqrt{-24}}{4} = \\dfrac{4 \\pm 2i\\sqrt6}{4} = 1 \\pm \\dfrac{\\sqrt6}{2}i $.\n\n' +
      '(Simplify $ \\sqrt{-24} = \\sqrt{24}\\,i = 2\\sqrt6\\,i $ first, then reduce the fraction — that order avoids messy arithmetic.)',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'logical',
    prompt: 'For a real-coefficient quadratic with D < 0, what can you say about the two roots without solving?',
    options: ['They are a conjugate pair of complex numbers', 'They are equal real roots', 'They are two distinct real roots', 'The equation has no roots at all'],
    reveal: 'A conjugate pair. Whenever a, b, c are real and D < 0, the ± in the quadratic formula guarantees two complex roots that are conjugates of each other.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('What are the roots of $ x^2 + x + 1 = 0 $?',
        ['$ 1 \\pm i\\sqrt3 $', '$ -1 \\pm 2i $', '$ \\dfrac{1 \\pm i\\sqrt3}{2} $', '$ \\dfrac{-1 \\pm i\\sqrt3}{2} $'],
        3,
        '$ D = 1-4 = -3 $, so $ x = \\dfrac{-1 \\pm \\sqrt{-3}}{2} = \\dfrac{-1 \\pm i\\sqrt3}{2} $. Dropping the $ \\div 2 $ or flipping the sign of the $ -1 $ are the two common slips.',
        2),
      q('If a real-coefficient quadratic has discriminant D < 0, its roots are…',
        ['two distinct real roots', 'a conjugate pair of complex numbers', 'equal real roots', 'undefined, no roots exist'],
        1,
        'D < 0 always produces a conjugate complex pair when the coefficients are real — the equation still has exactly two roots, they simply are not real numbers.',
        1),
      q('What is the discriminant of $ 2x^2 - 4x + 5 = 0 $?',
        ['$ 16 $', '$ 40 $', '$ -24 $', '$ 24 $'],
        2,
        '$ D = b^2-4ac = (-4)^2 - 4(2)(5) = 16 - 40 = -24 $. Forgetting the minus sign on $ 4ac $ (giving 56, not listed) or stopping after computing $ b^2=16 $ are the usual traps.',
        2),
    ],
  }),
  b('text', 9, {
    markdown:
      'You now have every piece — algebra, conjugate and modulus, the Argand plane, polar form, and complex ' +
      'roots. The last page before practice mixes them all together.',
  }),
];

/* ── Page 7 — Bringing It Together (mixed worked examples) ───────────────── */
const p7 = [
  b('image', 0, {
    src: '', alt: 'Several glowing mathematical panels — algebra, a plotted point, a rotating angle, a parabola — arranged together, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Four small glowing panels arranged in a row — one showing abstract ' +
      'algebra symbols, one a plotted point on axes, one a rotating angle on a circle, one a parabola — all ' +
      'connected by a single glowing thread running through them. Violet, amber and sky-blue glow on a deep ' +
      'near-black background, elegant technical-poster style. No readable text.',
  }),
  b('text', 1, {
    markdown:
      'These five examples don\'t introduce anything new — they **combine** the ideas from the whole chapter, ' +
      'which is exactly how complex numbers show up in an exam.',
  }),
  b('worked_example', 2, {
    label: 'Division landing on something clean', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Express $ \\dfrac{1+i}{1-i} $ in the form $ a+bi $.',
    solution:
      'Multiply by the conjugate of the denominator, $ 1+i $:\n\n' +
      '$ \\dfrac{1+i}{1-i} \\times \\dfrac{1+i}{1+i} = \\dfrac{(1+i)^2}{(1-i)(1+i)} $.\n\n' +
      'Numerator: $ (1+i)^2 = 1+2i+i^2 = 2i $ (from Page 2\'s worked example). Denominator: $ 1 - i^2 = 2 $.\n\n' +
      'So the quotient is $ \\dfrac{2i}{2} = i $ — a purely imaginary number of modulus 1.',
  }),
  b('worked_example', 3, {
    label: 'Finding an unknown real number', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the real value of $ k $ for which $ \\dfrac{3+ik}{1+2i} $ is purely imaginary.',
    solution:
      'Rationalize by multiplying by the conjugate of the denominator, $ 1-2i $:\n\n' +
      'Numerator: $ (3+ik)(1-2i) = 3 - 6i + ik - 2i^2k = 3 - 6i + ik + 2k = (3+2k) + i(k-6) $.\n\n' +
      'Denominator: $ (1+2i)(1-2i) = 1+4 = 5 $.\n\n' +
      'So the expression is $ \\dfrac{(3+2k) + i(k-6)}{5} $. "Purely imaginary" means the **real part is zero**: ' +
      '$ 3+2k=0 \\Rightarrow k = -\\dfrac{3}{2} $.',
  }),
  b('worked_example', 4, {
    label: 'Inverse of a point already on the Argand plane', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the multiplicative inverse of $ z = -1+i\\sqrt3 $ (the same $ z $ plotted in polar form earlier).',
    solution:
      '$ \\overline{z} = -1-i\\sqrt3 $, and $ \\lvert z \\rvert^2 = (-1)^2 + (\\sqrt3)^2 = 1+3 = 4 $.\n\n' +
      '$ z^{-1} = \\dfrac{\\overline{z}}{\\lvert z \\rvert^2} = \\dfrac{-1-i\\sqrt3}{4} = -\\dfrac14 - \\dfrac{\\sqrt3}{4}i $.',
  }),
  b('worked_example', 5, {
    label: 'A quadratic with complex roots', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve $ x^2+2x+5=0 $.',
    solution:
      '$ D = 2^2 - 4(1)(5) = 4-20 = -16 $.\n\n' +
      '$ x = \\dfrac{-2 \\pm \\sqrt{-16}}{2} = \\dfrac{-2 \\pm 4i}{2} = -1 \\pm 2i $.',
  }),
  b('worked_example', 6, {
    label: 'Modulus and argument together', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the modulus and the principal argument of $ z = -\\sqrt3 + i $.',
    solution:
      '$ r = \\sqrt{(\\sqrt3)^2 + 1^2} = \\sqrt{3+1} = 2 $.\n\n' +
      'The reference angle from $ \\tan\\theta = \\dfrac{1}{\\sqrt3} $ is $ 30° $. The real part is negative and ' +
      'the imaginary part is positive, so $ z $ is in Quadrant II: $ \\theta = 180° - 30° = 150° = \\dfrac{5\\pi}{6} $.',
  }),
  b('inline_quiz', 7, {
    pass_threshold: 0.6,
    questions: [
      q('$ \\dfrac{1+i}{1-i} $ simplifies to…',
        ['$ i $', '$ -i $', '$ 1 $', '$ -1 $'],
        0,
        'Multiplying by the conjugate gives $ \\dfrac{(1+i)^2}{2} = \\dfrac{2i}{2} = i $. A purely imaginary result — the two "obvious" real answers (1 or -1) are the trap for anyone who forgets to actually expand the numerator.',
        2),
      q('What is the multiplicative inverse of $ -1+i\\sqrt3 $?',
        ['$ \\dfrac14 + \\dfrac{\\sqrt3}{4}i $', '$ -\\dfrac14 + \\dfrac{\\sqrt3}{4}i $', '$ \\dfrac14 - \\dfrac{\\sqrt3}{4}i $', '$ -\\dfrac14 - \\dfrac{\\sqrt3}{4}i $'],
        3,
        'Using $ z^{-1} = \\overline{z}/\\lvert z\\rvert^2 $: $ \\overline z = -1-i\\sqrt3 $ and $ \\lvert z\\rvert^2=4 $, giving $ \\dfrac{-1-i\\sqrt3}{4} = -\\dfrac14 - \\dfrac{\\sqrt3}{4}i $. Flipping either sign along the way is the usual slip.',
        3),
      q('What are the roots of $ x^2+2x+5=0 $?',
        ['$ -2 \\pm i $', '$ -1 \\pm 2i $', '$ 1 \\pm 2i $', '$ -1 \\pm 4i $'],
        1,
        '$ D=4-20=-16 $, so $ x=\\dfrac{-2\\pm\\sqrt{-16}}{2}=\\dfrac{-2\\pm4i}{2}=-1\\pm2i $. Forgetting to divide the imaginary part by 2 gives the $ -1\\pm4i $ trap.',
        2),
      q('What is the principal argument of $ z = -\\sqrt3 + i $?',
        ['$ 30° $', '$ 60° $', '$ 150° $', '$ 120° $'],
        2,
        'The reference angle is $ 30° $ (from $ \\tan\\theta = 1/\\sqrt3 $), but the point sits in Quadrant II (real negative, imaginary positive), so $ \\theta = 180°-30° = 150° $.',
        3),
    ],
  }),
  b('text', 8, {
    markdown:
      'Every idea in this chapter has now shown up at least twice. Time to drill it — a full practice set is next.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'the-argand-plane', title: 'The Argand Plane',
        subtitle: 'Every complex number is a point — and addition is a parallelogram.',
        page_number: 4, blocks: p4 },
      { slug: 'polar-representation', title: 'Polar Representation',
        subtitle: 'Describe a point by distance and direction instead of coordinates.',
        page_number: 5, blocks: p5 },
      { slug: 'quadratic-equations-complex-roots', title: 'Quadratic Equations with Complex Roots',
        subtitle: 'Every quadratic has roots now — real numbers just could not always see them.',
        page_number: 6, blocks: p6 },
      { slug: 'mixed-worked-examples', title: 'Bringing It Together',
        subtitle: 'Five examples mixing algebra, the conjugate, polar form and complex roots.',
        page_number: 7, blocks: p7 },
    ]);
  });
  console.log('pages 4–7 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
