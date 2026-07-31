'use strict';
/* Class 11 Math · Ch.3 Trigonometric Functions — pages 5–8.
   Additive + idempotent. Run: node scripts/math11-book/build_ch3_pages_5_8.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch3');

/* ── Page 5 — Graphs of sin, cos and tan ─────────────────────────────────── */
const p5 = [
  b('image', 0, {
    src: '', alt: 'Three glowing wave-like graphs stacked on a dark background, one smooth and continuous, one with vertical breaks',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Three glowing curves stacked vertically on a dark grid — a smooth sky ' +
      'wave, a smooth violet wave shifted slightly beside it, and below them a sharp amber curve broken by ' +
      'repeating vertical gaps racing to infinity. Deep near-black background, elegant graphing-poster style. ' +
      'No text.',
  }),
  b('text', 1, {
    markdown:
      'Every value you can read off the unit circle can also be plotted as an ordinary graph, with $ x $ (the ' +
      'angle, in radians) along the bottom and the function’s value up the side. The unit circle told you the ' +
      'shape *per revolution*; the graph shows what happens as that revolution repeats forever.',
  }),
  b('math_graph', 2, {
    title: 'sin x and cos x, side by side',
    caption: 'Same wave, same period — cos x is just sin x, started a quarter-turn earlier.',
    height: 340,
    spec: {
      bounds: { xmin: -6.5, xmax: 6.5, ymin: -1.6, ymax: 1.6 },
      functions: [
        { expr: 'sin(x)', color: 'sky', label: 'sin x' },
        { expr: 'cos(x)', color: 'violet', label: 'cos x' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('text', 3, {
    markdown:
      'Two things to notice immediately:\n\n' +
      '- **Period.** Both waves repeat every $ 2\\pi $ — exactly what $ \\sin(2n\\pi + x) = \\sin x $ and ' +
      '$ \\cos(2n\\pi + x) = \\cos x $ say. One full “cycle” of the wave takes $ 2\\pi $ units of $ x $.\n' +
      '- **Amplitude.** Neither wave ever climbs above $ 1 $ or dips below $ -1 $ — the range $ [-1, 1] $ made ' +
      'visible. That ceiling-and-floor height is called the **amplitude**.\n' +
      '- **Phase.** The two curves are identical in shape — cos x is literally sin x’s graph, slid $ \\pi/2 $ to ' +
      'the left. (You met this exact “inside-the-bracket” sliding trick back in Functions.)',
  }),
  b('math_graph', 4, {
    title: 'tan x — the odd one out',
    caption: 'tan x repeats twice as fast (period π) and rockets to infinity wherever cos x = 0.',
    height: 340,
    spec: {
      bounds: { xmin: -4.8, xmax: 4.8, ymin: -6, ymax: 6 },
      functions: [{ expr: 'tan(x)', color: 'amber', label: 'tan x' }],
      annotations: [
        { x: 1.75, y: 5.3, text: 'undefined here (x = π/2)', color: 'amber' },
        { x: -3.3, y: 5.3, text: 'and here (x = −π/2, −3π/2, …)', color: 'amber' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('text', 5, {
    markdown:
      '$ \\tan x $ looks completely different for a reason you already know: $ \\tan x = \\sin x/\\cos x $, so it ' +
      'blows up to $ \\pm\\infty $ exactly where $ \\cos x = 0 $ — at every odd multiple of $ \\pi/2 $. Between ' +
      'two consecutive breaks the graph repeats, so $ \\tan x $’s period is only $ \\pi $, half of sin/cos’s. It ' +
      'also has **no amplitude ceiling** — its range is every real number.\n\n' +
      '$ \\cot x $ behaves the same way (period $ \\pi $, breaks at multiples of $ \\pi $ instead). $ \\sec x $ ' +
      'and $ \\csc x $, being reciprocals of cos and sin, inherit sin/cos’s period $ 2\\pi $ but — like tan — ' +
      'never sit between $ -1 $ and $ 1 $; they hug the sin/cos wave from outside and shoot to infinity wherever ' +
      'sin or cos touches zero.',
  }),
  b('callout', 6, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      '| Function | Period | Range |\n|---|---|---|\n' +
      '| sin, cos | $ 2\\pi $ | $ [-1, 1] $ |\n' +
      '| tan, cot | $ \\pi $ | all reals |\n' +
      '| sec, csc | $ 2\\pi $ | $ y \\ge 1 $ or $ y \\le -1 $ |',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'spatial',
    prompt: 'A graph is a smooth wave that touches +1 and −1 and never breaks. Could it be tan x?',
    options: ['Yes', 'No — tan x has vertical breaks and unbounded range'],
    reveal:
      'No. tan x is never bounded between −1 and 1, and it has infinitely many vertical breaks. A smooth, ' +
      'never-breaking wave capped at ±1 can only be sin x or cos x.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('What is the period of sin x?',
        ['π', '2π', 'π/2', '4π'],
        1,
        'sin x completes one full cycle every 2π — the smallest positive number for which sin(x + T) = sin x holds for all x.',
        1),
      q('Why does tan x have period π instead of 2π?',
        ['Because tan is always positive', 'Because sin and cos both flip sign after π, so their ratio returns to the same value',
         'It’s an arbitrary convention', 'tan x doesn’t actually repeat'],
        1,
        'After exactly π, both sin and cos flip sign (sin(x+π) = −sin x, cos(x+π) = −cos x), so their ratio ' +
        'tan(x+π) = (−sin x)/(−cos x) = tan x is unchanged — half the period of sin or cos alone.',
        3),
      q('At which x-values does tan x have vertical breaks?',
        ['x = nπ', 'x = (2n+1)π/2', 'x = 2nπ', 'It never breaks'],
        1,
        'tan x = sin x/cos x breaks wherever cos x = 0, i.e. at odd multiples of π/2.',
        2),
      q('What is the range of cos x?',
        ['All real numbers', '[0, 1]', '[−1, 1]', '(−∞, 1]'],
        2,
        'cos x never exceeds 1 or drops below −1 — the amplitude ceiling and floor visible on its graph.',
        1),
    ],
  }),
  b('text', 9, {
    markdown:
      'You can now picture every one of the six functions. Time to go the other direction — not reading a graph, ' +
      'but **expanding** what happens when you add two angles together before taking their sine or cosine.',
  }),
];

/* ── Page 6 — Sum & Difference Formulas + Double/Triple Angle (NCERT 3.4) ── */
const p6 = [
  b('image', 0, {
    src: '', alt: 'Two rotating arrows combining into a single resultant arrow, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two glowing arrows, one violet at angle x and one sky-blue at angle y, ' +
      'rotate and combine into a single amber resultant arrow at angle x+y, with thin construction lines showing ' +
      'the geometry. Deep near-black background, elegant mathematical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'What is $ \\cos(x+y) $? The tempting (and wrong) guess is $ \\cos x + \\cos y $ — try $ x=y=\\pi/2 $ and it ' +
      'falls apart instantly ($ \\cos\\pi = -1 $, but $ \\cos(\\pi/2)+\\cos(\\pi/2) = 0 $). The real formula comes ' +
      'from comparing two chord lengths on the unit circle (NCERT’s Fig 3.14) and simplifying with the ' +
      'Pythagorean identity. The result is worth memorising outright — four formulas, easy to keep straight if ' +
      'you notice the pattern of which sign flips:',
  }),
  b('latex_block', 2, {
    latex:
      '\\cos(x+y) = \\cos x\\cos y - \\sin x\\sin y, \\qquad \\cos(x-y) = \\cos x\\cos y + \\sin x\\sin y',
    label: 'Cosine of a sum/difference', highlight: true,
  }),
  b('latex_block', 3, {
    latex:
      '\\sin(x+y) = \\sin x\\cos y + \\cos x\\sin y, \\qquad \\sin(x-y) = \\sin x\\cos y - \\cos x\\sin y',
    label: 'Sine of a sum/difference', highlight: true,
  }),
  b('text', 4, {
    markdown:
      'Notice: **cosine’s formula swaps its sign, sine’s formula keeps the same sign** as the $ \\pm $ on the ' +
      'left. Divide the sine and cosine formulas to get tangent’s (and cotangent’s) versions:',
  }),
  b('latex_block', 5, {
    latex:
      '\\tan(x+y) = \\frac{\\tan x + \\tan y}{1 - \\tan x\\tan y}, \\qquad ' +
      '\\tan(x-y) = \\frac{\\tan x - \\tan y}{1 + \\tan x\\tan y}',
    label: 'Tangent of a sum/difference',
  }),
  b('worked_example', 6, {
    label: 'NCERT Example 10', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Prove that $ 3\\sin\\frac{\\pi}{6}\\sec\\frac{\\pi}{3} - 4\\sin\\frac{5\\pi}{6}\\cot\\frac{\\pi}{4} = 1 $.',
    solution:
      'Evaluate each standard-angle piece: $ \\sin\\frac{\\pi}{6} = \\frac{1}{2} $, $ \\sec\\frac{\\pi}{3} = 2 $, ' +
      'so the first term is $ 3 \\times \\frac{1}{2} \\times 2 = 3 $.\n\n' +
      'For the second term, $ \\frac{5\\pi}{6} = \\pi - \\frac{\\pi}{6} $, and $ \\sin(\\pi - x) = \\sin x $, so ' +
      '$ \\sin\\frac{5\\pi}{6} = \\sin\\frac{\\pi}{6} = \\frac{1}{2} $. Also $ \\cot\\frac{\\pi}{4} = 1 $. So the ' +
      'second term is $ 4 \\times \\frac{1}{2} \\times 1 = 2 $.\n\n' +
      'L.H.S. $ = 3 - 2 = 1 $ = R.H.S.',
  }),
  b('worked_example', 7, {
    label: 'NCERT Example 11', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Find the value of $ \\sin 15° $.',
    solution:
      'Build 15° from two standard angles you already know: $ 15° = 45° - 30° $.\n\n' +
      '$ \\sin 15° = \\sin(45° - 30°) = \\sin 45°\\cos 30° - \\cos 45°\\sin 30° = \\frac{1}{\\sqrt2}\\cdot' +
      '\\frac{\\sqrt3}{2} - \\frac{1}{\\sqrt2}\\cdot\\frac{1}{2} = \\frac{\\sqrt3 - 1}{2\\sqrt2} = ' +
      '\\frac{\\sqrt6 - \\sqrt2}{4} $.',
  }),
  b('math_graph', 8, {
    title: 'Checking sin 15° against the curve',
    caption: 'The point marked at x = 15° sits exactly on y = sin x — the algebra and the graph agree.',
    height: 300,
    spec: {
      bounds: { xmin: 0, xmax: 90, ymin: -0.2, ymax: 1.1 },
      functions: [{ expr: 'sin(x*0.0174533)', color: 'sky', label: 'sin x°' }],
      points: [{ x: 15, y: 0.2588, label: 'sin 15° ≈ 0.259', color: 'amber' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('worked_example', 9, {
    label: 'NCERT Example 12', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Find the value of $ \\tan\\frac{13\\pi}{12} $.',
    solution:
      'Since tan has period $ \\pi $: $ \\tan\\frac{13\\pi}{12} = \\tan\\left(\\pi + \\frac{\\pi}{12}\\right) = ' +
      '\\tan\\frac{\\pi}{12} $.\n\n' +
      'Write $ \\frac{\\pi}{12} = \\frac{\\pi}{4} - \\frac{\\pi}{6} $ and use the difference formula:\n\n' +
      '$ \\tan\\frac{\\pi}{12} = \\dfrac{\\tan\\frac{\\pi}{4} - \\tan\\frac{\\pi}{6}}{1 + \\tan\\frac{\\pi}{4}' +
      '\\tan\\frac{\\pi}{6}} = \\dfrac{1 - \\frac{1}{\\sqrt3}}{1 + \\frac{1}{\\sqrt3}} = \\dfrac{\\sqrt3 - 1}' +
      '{\\sqrt3 + 1} = 2 - \\sqrt3 $ (rationalise by multiplying top and bottom by $ \\sqrt3 - 1 $).',
  }),
  b('text', 10, {
    markdown:
      'Set $ y = x $ in the sum formulas and something nice happens — the sum formula for an angle **with itself** ' +
      'gives the **double-angle** formulas. cos2x has three equivalent faces (swap in $ \\sin^2x+\\cos^2x=1 $ to ' +
      'move between them):',
  }),
  b('latex_block', 11, {
    latex:
      '\\sin 2x = 2\\sin x\\cos x, \\qquad ' +
      '\\cos 2x = \\cos^2x - \\sin^2x = 2\\cos^2x - 1 = 1 - 2\\sin^2x, \\qquad ' +
      '\\tan 2x = \\frac{2\\tan x}{1 - \\tan^2 x}',
    label: 'Double-angle formulas', highlight: true,
  }),
  b('text', 12, {
    markdown:
      'One more round — write $ 3x = 2x + x $ and expand — gives the **triple-angle** formulas:',
  }),
  b('latex_block', 13, {
    latex: '\\sin 3x = 3\\sin x - 4\\sin^3 x, \\qquad \\cos 3x = 4\\cos^3 x - 3\\cos x',
    label: 'Triple-angle formulas',
  }),
  b('reasoning_prompt', 14, {
    reasoning_type: 'logical',
    prompt: 'Why does cos 2x have three different-looking versions that are all correct?',
    options: [
      'They aren’t all correct — only one is right',
      'sin²x + cos²x = 1 lets you swap one for the other inside the same expression',
      'Because 2x can mean different things',
    ],
    reveal:
      'They’re the same formula in disguise. Starting from cos²x − sin²x, substitute sin²x = 1−cos²x to get ' +
      '2cos²x − 1, or substitute cos²x = 1−sin²x to get 1−2sin²x. Pick whichever form matches what you already ' +
      'know (sin or cos) in a given problem.',
    difficulty_level: 3,
  }),
  b('inline_quiz', 15, {
    pass_threshold: 0.67,
    questions: [
      q('cos(x + y) expands to…',
        ['cos x cos y + sin x sin y', 'cos x cos y − sin x sin y', 'sin x cos y + cos x sin y', 'sin x sin y − cos x cos y'],
        1,
        'Cosine of a SUM subtracts: cos x cos y − sin x sin y. (It’s sine’s formula that keeps the sign — easy ' +
        'to swap the two by mistake.)',
        2),
      q('sin 2x equals…',
        ['sin x + cos x', '2 sin x cos x', 'sin²x − cos²x', '2 sin x'],
        1,
        'Set y = x in sin(x+y) = sin x cos y + cos x sin y to get sin x cos x + cos x sin x = 2 sin x cos x.',
        1),
      q('tan(x − y) equals…',
        ['(tan x − tan y)/(1 + tan x tan y)', '(tan x + tan y)/(1 − tan x tan y)', 'tan x − tan y', '(tan x − tan y)/(1 − tan x tan y)'],
        0,
        'The difference formula for tangent has a PLUS on the bottom: (tan x − tan y)/(1 + tan x tan y) — the ' +
        'sign flips relative to the sum formula’s minus.',
        3),
      q('Using cos 2x = 1 − 2sin²x, if sin x = 1/2, what is cos 2x?',
        ['1/2', '0', '3/4', '1'],
        0,
        'cos 2x = 1 − 2(1/2)² = 1 − 2(1/4) = 1 − 1/2 = 1/2.',
        2),
    ],
  }),
  b('text', 16, {
    markdown:
      'One more trick lurks inside these formulas: turning a **sum** of two sines or cosines into a **product** ' +
      '— which is exactly the move most identity-proving questions are secretly testing.',
  }),
];

/* ── Page 7 — Sum-to-Product & Product-to-Sum ────────────────────────────── */
const p7 = [
  b('image', 0, {
    src: '', alt: 'Two waves merging into a single product wave envelope, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two glowing sine waves, sky and violet, overlapping and merging into ' +
      'a single amber wave held inside a smooth envelope curve — the visual of a sum becoming a product. Deep ' +
      'near-black background, elegant graphing-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Add the $ \\cos(x+y) $ and $ \\cos(x-y) $ formulas together and the $ \\sin x\\sin y $ terms cancel; ' +
      'subtract them and the $ \\cos x\\cos y $ terms cancel. Do the same with the two sine formulas. Four small ' +
      'algebra moves later, substituting $ \\theta = x+y $ and $ \\phi = x-y $, you get a way to turn a **sum** ' +
      'into a **product**:',
  }),
  b('latex_block', 2, {
    latex:
      '\\cos x + \\cos y = 2\\cos\\frac{x+y}{2}\\cos\\frac{x-y}{2}, \\qquad ' +
      '\\cos x - \\cos y = -2\\sin\\frac{x+y}{2}\\sin\\frac{x-y}{2}',
    label: 'Sum-to-product (cosine)', highlight: true,
  }),
  b('latex_block', 3, {
    latex:
      '\\sin x + \\sin y = 2\\sin\\frac{x+y}{2}\\cos\\frac{x-y}{2}, \\qquad ' +
      '\\sin x - \\sin y = 2\\cos\\frac{x+y}{2}\\sin\\frac{x-y}{2}',
    label: 'Sum-to-product (sine)', highlight: true,
  }),
  b('text', 4, {
    markdown:
      'Read backwards, the very same four identities turn a **product** into a **sum** — just as useful, and ' +
      'exactly the same equations rearranged:',
  }),
  b('latex_block', 5, {
    latex:
      '2\\cos x\\cos y = \\cos(x+y) + \\cos(x-y), \\qquad -2\\sin x\\sin y = \\cos(x+y) - \\cos(x-y)',
  }),
  b('latex_block', 6, {
    latex:
      '2\\sin x\\cos y = \\sin(x+y) + \\sin(x-y), \\qquad 2\\cos x\\sin y = \\sin(x+y) - \\sin(x-y)',
  }),
  b('callout', 7, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'Spot the pattern for **which side is which**: whenever a proof gives you a **sum of two sines/cosines ' +
      'with different arguments**, sum-to-product almost always cracks it — the two pieces usually share a ' +
      'common factor afterwards that cancels beautifully with the rest of the expression.',
  }),
  b('worked_example', 8, {
    label: 'NCERT Example 16', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Prove that $ \\dfrac{\\cos 7x + \\cos 5x}{\\sin 7x - \\sin 5x} = \\cot x $.',
    solution:
      'Turn both the numerator and denominator into products, using $ x=7x, y=5x $ throughout — note ' +
      '$ \\frac{7x+5x}{2} = 6x $ and $ \\frac{7x-5x}{2} = x $ in every term:\n\n' +
      'Numerator: $ \\cos 7x + \\cos 5x = 2\\cos 6x\\cos x $.\n\n' +
      'Denominator: $ \\sin 7x - \\sin 5x = 2\\cos 6x\\sin x $.\n\n' +
      'The $ 2\\cos 6x $ cancels top and bottom, leaving $ \\dfrac{\\cos x}{\\sin x} = \\cot x $.',
  }),
  b('worked_example', 9, {
    label: 'NCERT Example 17', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Prove that $ \\dfrac{\\sin 5x - 2\\sin 3x + \\sin x}{\\cos 5x - \\cos x} = \\tan x $.',
    solution:
      'Group the numerator as $ (\\sin 5x + \\sin x) - 2\\sin 3x $: since $ \\sin 5x + \\sin x = 2\\sin 3x\\cos 2x $, ' +
      'the numerator becomes $ 2\\sin 3x\\cos 2x - 2\\sin 3x = 2\\sin 3x(\\cos 2x - 1) $.\n\n' +
      'The denominator: $ \\cos 5x - \\cos x = -2\\sin 3x\\sin 2x $.\n\n' +
      'Cancel $ 2\\sin 3x $ from top and bottom: $ \\dfrac{\\cos 2x - 1}{-\\sin 2x} = \\dfrac{1 - \\cos 2x}' +
      '{\\sin 2x} $.\n\n' +
      'Now swap in $ 1-\\cos2x = 2\\sin^2x $ and $ \\sin2x = 2\\sin x\\cos x $: $ \\dfrac{2\\sin^2 x}{2\\sin x' +
      '\\cos x} = \\dfrac{\\sin x}{\\cos x} = \\tan x $.',
  }),
  b('reasoning_prompt', 10, {
    reasoning_type: 'logical',
    prompt: 'A proof has cos 9x − cos 5x in it. What should you reach for?',
    options: ['A double-angle formula', 'Sum-to-product — it turns a difference of cosines into a product', 'sin²+cos²=1'],
    reveal:
      'Sum-to-product: cos 9x − cos 5x = −2 sin 7x sin 2x. Seeing a SUM (or difference) of two sines/cosines ' +
      'with different arguments is the trigger to reach for these formulas first.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 11, {
    pass_threshold: 0.67,
    questions: [
      q('sin x + sin y equals…',
        ['2 sin((x+y)/2) cos((x−y)/2)', '2 cos((x+y)/2) sin((x−y)/2)', '2 sin(x+y) cos(x−y)', 'sin x cos y + cos x sin y'],
        0,
        'sin x + sin y = 2 sin((x+y)/2) cos((x−y)/2) — note it’s a SINE of the half-sum times a COSINE of the ' +
        'half-difference, not the other way round (that pairing is cos x − cos y’s formula, with a minus sign too).',
        2),
      q('2 cos x cos y equals…',
        ['cos(x+y) + cos(x−y)', 'cos(x+y) − cos(x−y)', 'sin(x+y) + sin(x−y)', 'cos(x+y) · cos(x−y)'],
        0,
        '2cos x cos y = cos(x+y) + cos(x−y) — the product-to-sum reading of the same identity.',
        2),
    ],
  }),
  b('text', 12, {
    markdown:
      'You’ve now got every identity you need. There’s one job left: not just proving an equation is true for ' +
      'every $ x $, but **solving** one — finding every angle that makes a specific trigonometric equation true.',
  }),
];

/* ── Page 8 — Solving Trigonometric Equations (enrichment beyond current NCERT body) ── */
const p8 = [
  b('image', 0, {
    src: '', alt: 'A unit circle with a horizontal dashed target line crossing it at two points, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A unit circle with a dashed amber horizontal target line crossing it ' +
      'at exactly two glowing violet points, each with a faint radius line to the centre — the picture of two ' +
      'solutions sharing one target value. Deep near-black background, elegant instrument-panel style. No text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'This page goes a step beyond the current NCERT chapter body (which stops at the Miscellaneous Exercise), ' +
      'but **solving trigonometric equations** is inseparable from everything you’ve just built — it’s the very ' +
      'next question a JEE/NEET paper asks once it knows you can handle the identities. We’re building it here, ' +
      'with our own worked numbers, so the chapter doesn’t leave the job half-done.',
  }),
  b('text', 2, {
    markdown:
      'An equation like $ \\sin\\theta = \\frac{1}{2} $ has more than one answer — $ \\theta = 30° $ works, but ' +
      'so does $ 150° $, and so does $ 390° $ (one revolution further round), and so on forever. A ' +
      '**trigonometric equation** asks for **every** such angle, written in one compact formula using an ' +
      'integer $ n $.',
  }),
  b('math_graph', 3, {
    title: 'Two points, one height',
    caption: 'Drag θ to find both places on the circle where the height (sin θ) equals 0.5.',
    archetype: 'unit-circle',
    predict: {
      prompt: 'For sin θ = 0.5, two angles between 0 and 2π work. Are they mirror images across the y-axis or across the x-axis?',
      options: ['Mirror across the y-axis (same height, opposite shadow)', 'Mirror across the x-axis (same shadow, opposite height)'],
      answer_index: 0,
      reveal:
        'Across the y-axis — both points sit at the SAME height (sin θ = 0.5) but on opposite sides, at ' +
        'θ = π/6 and θ = π − π/6. That mirror-across-the-y-axis pair is exactly the identity sin(π−x) = sin x ' +
        'you met earlier — it is the geometric reason sin equations always come in this pair.',
    },
  }),
  b('text', 4, {
    markdown:
      'That mirror pair — $ \\alpha $ and $ \\pi - \\alpha $ — plus a whole extra revolution ($ 2n\\pi $) for ' +
      'every integer $ n $, is packed into one formula using $ (-1)^n $ (it equals $ +1 $ for even $ n $, ' +
      '$ -1 $ for odd $ n $ — so it silently alternates between the two mirror solutions):',
  }),
  b('latex_block', 5, {
    latex: '\\sin\\theta = \\sin\\alpha \\quad\\Longrightarrow\\quad \\theta = n\\pi + (-1)^n\\alpha, \\quad n \\in \\mathbb{Z}',
    label: 'General solution — sin θ = sin α', highlight: true,
  }),
  b('text', 6, {
    markdown:
      'Cosine’s mirror pair is different — $ \\cos(-x) = \\cos x $ means $ \\alpha $ and $ -\\alpha $ (equivalently ' +
      '$ 2\\pi - \\alpha $) give the same cosine, so the general solution uses a $ \\pm $ instead:',
  }),
  b('latex_block', 7, {
    latex: '\\cos\\theta = \\cos\\alpha \\quad\\Longrightarrow\\quad \\theta = 2n\\pi \\pm \\alpha, \\quad n \\in \\mathbb{Z}',
    label: 'General solution — cos θ = cos α', highlight: true,
  }),
  b('text', 8, {
    markdown:
      'Tangent repeats every $ \\pi $ (not $ 2\\pi $), and — unlike sin/cos — has only **one** solution per ' +
      'period, so its general solution needs no $ \\pm $ or $ (-1)^n $ at all:',
  }),
  b('latex_block', 9, {
    latex: '\\tan\\theta = \\tan\\alpha \\quad\\Longrightarrow\\quad \\theta = n\\pi + \\alpha, \\quad n \\in \\mathbb{Z}',
    label: 'General solution — tan θ = tan α', highlight: true,
  }),
  b('worked_example', 10, {
    label: 'Solving sin θ = 1/2', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the general solution of $ \\sin\\theta = \\frac{1}{2} $.',
    solution:
      'The standard angle with sine $ \\frac12 $ is $ \\alpha = \\frac{\\pi}{6} $ (since $ \\sin 30° = \\frac12 $).\n\n' +
      'Plug straight into the sin general-solution formula: $ \\theta = n\\pi + (-1)^n\\dfrac{\\pi}{6},\\ n \\in ' +
      '\\mathbb{Z} $.\n\n' +
      'Check $ n=0 $: $ \\theta = \\pi/6 $ (30°) ✓. Check $ n=1 $: $ \\theta = \\pi - \\pi/6 = 5\\pi/6 $ (150°) ✓ ' +
      '— exactly the mirror pair from the picture above.',
  }),
  b('worked_example', 11, {
    label: 'Solving cos θ = −1/2', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the general solution of $ \\cos\\theta = -\\frac{1}{2} $.',
    solution:
      'First find where cosine is $ +\\frac12 $, then use the reduction formula to place the negative value: ' +
      '$ \\cos\\frac{\\pi}{3} = \\frac12 $, and $ \\cos\\left(\\pi - \\frac{\\pi}{3}\\right) = -\\cos\\frac{\\pi}{3} ' +
      '= -\\frac12 $. So $ \\alpha = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3} $.\n\n' +
      'General solution: $ \\theta = 2n\\pi \\pm \\dfrac{2\\pi}{3},\\ n \\in \\mathbb{Z} $.',
  }),
  b('worked_example', 12, {
    label: 'Solving tan θ = √3', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the general solution of $ \\tan\\theta = \\sqrt3 $.',
    solution:
      '$ \\tan\\frac{\\pi}{3} = \\sqrt3 $, so $ \\alpha = \\frac{\\pi}{3} $.\n\n' +
      'Tangent needs only one family, no $ \\pm $: $ \\theta = n\\pi + \\dfrac{\\pi}{3},\\ n \\in \\mathbb{Z} $.',
  }),
  b('reasoning_prompt', 13, {
    reasoning_type: 'logical',
    prompt: 'Why does tan θ = tan α need no ± or (−1)ⁿ, unlike sin and cos?',
    options: [
      'Because tan is always positive',
      'Because tan repeats every π, and within that shorter period there is only ONE solution, not a mirror pair',
      'It’s just a simpler formula for no particular reason',
    ],
    reveal:
      'Right — sin and cos each have TWO angles per 2π period sharing a value (a mirror pair), which is why ' +
      'their formulas need a sign device to capture both. tan repeats twice as often (every π) and has only one ' +
      'solution inside each of those shorter periods, so a plain $ n\\pi + \\alpha $ already catches everything.',
    difficulty_level: 3,
  }),
  b('inline_quiz', 14, {
    pass_threshold: 0.67,
    questions: [
      q('The general solution of sin θ = sin α is…',
        ['θ = 2nπ ± α', 'θ = nπ + (−1)ⁿα', 'θ = nπ + α', 'θ = nπ − α'],
        1,
        'sin uses the (−1)ⁿ device: θ = nπ + (−1)ⁿα, n ∈ ℤ — it alternates between the angle and its ' +
        '"π minus itself" mirror partner.',
        1),
      q('For cos θ = cos α, which pair of angles (within one revolution) both satisfy the equation?',
        ['α and π − α', 'α and −α (i.e. 2π − α)', 'α and π + α', 'α and α/2'],
        1,
        'cos(−α) = cos α, so α and −α (equivalently 2π − α) share the same cosine — that’s the ± in θ = 2nπ ± α.',
        2),
      q('What is the general solution of tan θ = 1?',
        ['θ = nπ + π/4', 'θ = 2nπ ± π/4', 'θ = nπ + (−1)ⁿπ/4', 'θ = nπ/4'],
        0,
        'tan(π/4) = 1, and tan needs no ± or (−1)ⁿ, so θ = nπ + π/4.',
        2),
      q('For n = 2, what value does θ = nπ + (−1)ⁿ(π/6) give?',
        ['2π + π/6', '2π − π/6', 'π + π/6', 'π/6'],
        0,
        '(−1)² = 1 (n even), so θ = 2π + π/6 — the "even n" branch always adds the plain α.',
        3),
    ],
  }),
  b('text', 15, {
    markdown:
      'That’s the whole toolkit: measure an angle, define its six ratios on a circle, read its sign and shape, ' +
      'expand it in combination with another angle, and now solve for it directly. One chapter, one picture — a ' +
      'point going round a circle — carrying every idea.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'graphs-of-sin-cos-tan', title: 'Graphs of sin, cos and tan',
        subtitle: 'Period, amplitude, and why tan looks so different from sin and cos.',
        page_number: 5, blocks: p5 },
      { slug: 'sum-difference-double-angle', title: 'Trig Functions of Sum & Difference of Two Angles',
        subtitle: 'Expanding sin(x±y) and cos(x±y) — and the double- and triple-angle formulas they unlock.',
        page_number: 6, blocks: p6 },
      { slug: 'sum-to-product-formulas', title: 'Sum-to-Product & Product-to-Sum',
        subtitle: 'Turning a sum of sines or cosines into a product — the trick behind most identity proofs.',
        page_number: 7, blocks: p7 },
      { slug: 'trigonometric-equations', title: 'Solving Trigonometric Equations',
        subtitle: 'Finding every angle that satisfies an equation, not just one.',
        page_number: 8, blocks: p8 },
    ]);
  });
  console.log('Ch.3 pages 5–8 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
