'use strict';
/* Class 11 Math · Ch.3 Trigonometric Functions — pages 0–4.
   Additive + idempotent. Run: node scripts/math11-book/build_ch3_pages_0_4.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch3');

/* ── Page 0 — Chapter opener ─────────────────────────────────────────────── */
const p0 = [
  b('image', 0, {
    src: '', alt: 'A glowing point sweeping around a circle, its shadow tracing a wave below, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A single glowing violet point travels around a circle on the left; ' +
      'a faint guide line carries its height across to the right, where it draws a smooth amber wave. A Ferris ' +
      'wheel silhouette and a clock face are subtly worked into the background. Deep near-black background, ' +
      'elegant mathematical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'A Ferris wheel goes round and round. A clock’s minute hand sweeps the same 60 minutes, over and over. ' +
      'The tide rises and falls on the same rhythm, day after day. All of these share one shape underneath: ' +
      '**something going round in a circle, watched from the side.**\n\n' +
      'That “something,” tracked precisely, is what this chapter is about. We started trigonometry in earlier ' +
      'classes with *ratios of sides in a right triangle* — but a triangle only has angles from $ 0° $ to $ 90° $. ' +
      'A Ferris wheel keeps turning well past $ 90° $, past $ 180° $, past a full circle, and round again. To ' +
      'follow it, we need to set the *triangle* definition free and rebuild sine and cosine as **functions of any ' +
      'angle at all** — using a circle instead of a triangle.',
  }),
  b('text', 2, {
    markdown:
      '**What you will be able to do by the end**\n\n' +
      '- Measure an angle in **degrees** and in **radians**, and convert freely between them\n' +
      '- Define $ \\sin x $ and $ \\cos x $ for *any* real $ x $, using a point rotating on the **unit circle**\n' +
      '- Read off the **domain, range and sign** of all six trigonometric functions in every quadrant\n' +
      '- Recognise the **graphs** of $ \\sin x $, $ \\cos x $ and $ \\tan x $ — their period and amplitude\n' +
      '- Expand $ \\sin(x \\pm y) $, $ \\cos(x \\pm y) $ and the double- and triple-angle formulas that follow ' +
      'from them\n' +
      '- Turn a sum of sines/cosines into a product (and back) — the trick behind half the identity proofs you’ll ' +
      'ever see\n' +
      '- **Solve** a trigonometric equation for every angle that satisfies it, not just one',
  }),
];

/* ── Page 1 — Measuring Angles: Degree & Radian (NCERT 3.2) ──────────────── */
const p1 = [
  b('image', 0, {
    src: '', alt: 'A point tracing an arc on a unit circle while a protractor glows beside it, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing violet point rotates along a circle of radius 1, leaving a ' +
      'bright amber arc trail behind it; a translucent protractor overlays the same circle, showing both a ' +
      'degree scale and a radian scale side by side. Deep near-black background, elegant instrument-panel style. ' +
      'No text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'A **radian** needs no protractor at all — it is defined purely by *length*. Walk exactly one radius’ worth ' +
      'of distance along the rim of a circle, and the angle you’ve swept is **1 radian**, no matter how big or ' +
      'small the circle is. Degrees are an arbitrary human choice (360, because the Babylonians liked base 60); ' +
      'radians are built into the geometry itself — which is why every formula in calculus quietly assumes you’re ' +
      'using them.',
  }),
  b('text', 2, {
    markdown:
      'An **angle** is a measure of rotation of a ray about its starting point. Turn anticlockwise and the angle ' +
      'is **positive**; turn clockwise and it’s **negative**. There are two units worth knowing cold:\n\n' +
      '- **Degree measure.** One full revolution is $ 360° $. A degree splits further into $ 60 $ **minutes** ' +
      '($ 1° = 60' + "'" + ' $) and a minute into $ 60 $ **seconds** ($ 1' + "'" + ' = 60\\text{\'\'} $) — the same ' +
      'base-60 scheme a clock uses.\n' +
      '- **Radian measure.** Take a circle of radius $ 1 $ (the **unit circle**). The angle subtended at the ' +
      'centre by an arc of length exactly $ 1 $ is called **1 radian**.',
  }),
  b('math_graph', 3, {
    title: 'Play: sweep the unit circle',
    caption: 'Drag θ. Watch the amber arc grow — its length IS the angle, in radians.',
    archetype: 'unit-circle',
  }),
  b('curiosity_prompt', 4, {
    prompt:
      'Drag θ all the way to about 3.14 — roughly halfway round. How far has the point travelled along the rim?',
    reveal:
      'About $ \\pi $ units of arc — because the circle has radius 1, and half a revolution is $ \\pi $ radians. ' +
      'That’s not a coincidence you need to memorise: on a unit circle, **arc length and angle in radians are ' +
      'the exact same number.** (You’ll also notice the tool already prints two other numbers, “$ \\sin\\theta $” ' +
      'and “$ \\cos\\theta $” — hold that thought. That’s the very next page.)',
  }),
  b('text', 5, {
    markdown:
      'For a circle of any radius $ r $, an arc of length $ r $ still subtends $ 1 $ radian (equal arcs subtend ' +
      'equal angles at the centre). More generally, an arc of length $ l $ subtends an angle $ \\theta $ radians ' +
      'where',
  }),
  b('latex_block', 6, {
    latex: '\\theta = \\frac{l}{r}, \\qquad \\text{i.e.} \\qquad l = r\\theta',
    label: 'Arc length', highlight: true,
  }),
  b('text', 7, {
    markdown:
      'Since one revolution is $ 360° $ **and** $ 2\\pi $ radians at once,',
  }),
  b('latex_block', 8, {
    latex: '\\pi \\text{ radian} = 180°, \\qquad \\text{so} \\qquad ' +
      '\\text{radian measure} = \\frac{\\pi}{180} \\times \\text{degree measure}, \\quad ' +
      '\\text{degree measure} = \\frac{180}{\\pi} \\times \\text{radian measure}',
    label: 'Degree ↔ radian conversion', highlight: true,
  }),
  b('table', 9, {
    caption: 'Worth memorising — these six show up constantly.',
    headers: ['Degree', '30°', '45°', '60°', '90°', '180°', '270°', '360°'],
    rows: [
      ['Radian', '$ \\pi/6 $', '$ \\pi/4 $', '$ \\pi/3 $', '$ \\pi/2 $', '$ \\pi $', '$ 3\\pi/2 $', '$ 2\\pi $'],
    ],
  }),
  b('worked_example', 10, {
    label: 'NCERT Example 1', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Convert $ 40°20' + "'" + ' $ into radian measure.',
    solution:
      'First turn the minutes into a decimal degree: $ 40°20' + "'" + ' = 40 + \\frac{20}{60} = 40\\frac{1}{3}° ' +
      '= \\frac{121}{3}° $.\n\n' +
      'Now multiply by $ \\frac{\\pi}{180} $: $ \\frac{121}{3} \\times \\frac{\\pi}{180} = \\frac{121\\pi}{540} $.\n\n' +
      'So $ 40°20' + "'" + ' = \\frac{121\\pi}{540} $ radian.',
  }),
  b('worked_example', 11, {
    label: 'NCERT Example 3', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'Find the radius of the circle in which a central angle of $ 60° $ intercepts an arc of length $ 37.4 $ cm ' +
      '(use $ \\pi = 22/7 $).',
    solution:
      'Convert the angle to radians first — every arc-length formula needs radians: $ 60° = \\frac{\\pi}{3} $.\n\n' +
      'Now use $ r = \\frac{l}{\\theta} $: $ r = \\dfrac{37.4}{\\pi/3} = \\dfrac{37.4 \\times 3}{\\pi} = ' +
      '\\dfrac{37.4 \\times 3 \\times 7}{22} = \\dfrac{785.4}{22} = 35.7 $ cm.',
  }),
  b('worked_example', 12, {
    label: 'NCERT Example 4', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'The minute hand of a watch is $ 1.5 $ cm long. How far does its tip move in $ 40 $ minutes? (Use $ \\pi = 3.14 $.)',
    solution:
      'In $ 60 $ minutes the minute hand makes one full revolution, $ 2\\pi $ radians. In $ 40 $ minutes it turns ' +
      '$ \\frac{40}{60} = \\frac{2}{3} $ of that: $ \\theta = \\frac{2}{3} \\times 2\\pi = \\frac{4\\pi}{3} $.\n\n' +
      'Distance travelled by the tip is the arc length: $ l = r\\theta = 1.5 \\times \\frac{4\\pi}{3} = 2\\pi = ' +
      '2 \\times 3.14 = 6.28 $ cm.',
  }),
  b('reasoning_prompt', 13, {
    reasoning_type: 'quantitative',
    prompt: 'Which is bigger: 1 radian, or 1 degree?',
    options: ['1 radian is bigger', '1 degree is bigger', 'They are equal'],
    reveal:
      'A radian is much bigger — about $ 57.3° $. A full circle is only about $ 6.28 $ radians ($ 2\\pi $) but a ' +
      'full $ 360° $, so each radian has to cover a lot more ground than each degree.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 14, {
    pass_threshold: 0.67,
    questions: [
      q('One radian is the angle subtended at the centre of a circle by an arc whose length equals…',
        ['The diameter', 'The radius', 'Half the radius', 'The full circumference'],
        1,
        'By definition, an arc equal in length to the radius subtends exactly 1 radian at the centre — that’s ' +
        'what makes the radian scale-free (it doesn’t depend on how big the circle is).',
        1),
      q('What is the radian measure of 240°?',
        ['$ 2\\pi/3 $', '$ 3\\pi/4 $', '$ 4\\pi/3 $', '$ 5\\pi/6 $'],
        2,
        '$ 240 \\times \\frac{\\pi}{180} = \\frac{240\\pi}{180} = \\frac{4\\pi}{3} $. Simplify the fraction ' +
        'before panicking about the size of the numbers.',
        2),
      q('π radians equals…',
        ['90°', '180°', '270°', '360°'],
        1,
        'Half a revolution is both π radians and 180° — the single conversion fact everything else in this ' +
        'chapter is built from.',
        1),
      q('A wheel spins through 2π radians. How many degrees is that?',
        ['180°', '270°', '360°', '720°'],
        2,
        '2π radians is one full revolution — 360°, by definition of both units.',
        1),
    ],
  }),
  b('text', 15, {
    markdown:
      'Angle sorted — two languages, one meaning, and a formula ($ l = r\\theta $) linking either to real ' +
      'distance. Now let’s go back to that mystery: what were “$ \\sin\\theta $” and “$ \\cos\\theta $” doing on ' +
      'the unit-circle tool? Time to name them.',
  }),
];

/* ── Page 2 — The Unit Circle: Defining sin and cos (NCERT 3.3 core) ─────── */
const p2 = [
  b('image', 0, {
    src: '', alt: 'A rotating point on a unit circle casting a height shadow and a floor shadow, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing violet point sits on a unit circle; a soft amber beam drops ' +
      'straight down from it to the x-axis (its shadow) and a soft emerald beam runs sideways to the y-axis (its ' +
      'height) — two perpendicular measuring beams reading the point’s position. Deep near-black background, ' +
      'elegant instrument-panel style. No text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'Everything you learned about sine and cosine as “opposite over hypotenuse” in a right triangle still works ' +
      '— it’s just the special case where the angle is between $ 0° $ and $ 90° $. The circle definition below ' +
      'doesn’t replace that; it **extends** it so the same two words keep working past $ 90° $, past $ 360° $, ' +
      'and even for negative angles.',
  }),
  b('text', 2, {
    markdown:
      'Put a unit circle at the origin. Let $ P(a, b) $ be the point you reach after rotating anticlockwise ' +
      'through angle $ x $ radians from $ (1, 0) $. We simply **define**',
  }),
  b('latex_block', 3, {
    latex: '\\cos x = a, \\qquad \\sin x = b',
    label: 'The unit-circle definition', highlight: true,
  }),
  b('text', 4, {
    markdown:
      '$ \\cos x $ is the point’s **shadow on the floor** (its $ x $-coordinate); $ \\sin x $ is its **height** ' +
      '(its $ y $-coordinate). Nothing about a triangle is required any more — $ x $ can be any real number, ' +
      'positive or negative, as large as you like, and $ \\cos x $, $ \\sin x $ are still perfectly well defined.',
  }),
  b('math_graph', 5, {
    title: 'Now you can name it: height and shadow',
    caption: 'Drag θ. sin θ (the height, amber) and cos θ (the shadow, emerald) are just this point’s coordinates.',
    archetype: 'unit-circle',
    predict: {
      prompt: 'Drag θ slowly past 90° (about 1.57). Does cos θ turn negative before, at, or after that point?',
      options: ['Before 90°', 'Exactly at 90°', 'After 90°'],
      answer_index: 1,
      reveal:
        'Exactly at $ 90° = \\pi/2 $. That’s the moment the point crosses from the right half of the circle into ' +
        'the left half — its shadow (the x-coordinate) is zero right at the crossing, then goes negative. ' +
        '$ \\cos x $’s sign is entirely about *which side of the y-axis* the point sits on.',
    },
  }),
  b('text', 6, {
    markdown:
      'Since $ P(a, b) $ sits ON the unit circle, $ a^2 + b^2 = 1 $ always — that’s just Pythagoras applied to the ' +
      'triangle $ OMP $ in the picture. Substituting the definitions gives the single most useful identity in the ' +
      'whole chapter:',
  }),
  b('latex_block', 7, {
    latex: '\\sin^2 x + \\cos^2 x = 1 \\quad \\text{for every real } x',
    label: 'The Pythagorean identity', highlight: true,
  }),
  b('text', 8, {
    markdown:
      'At the four **quadrantal angles** — the ones landing exactly on an axis — the coordinates are easy to read ' +
      'straight off the circle:',
  }),
  b('table', 9, {
    caption: 'Quadrantal values — worth having cold.',
    headers: ['x', '0', '$ \\pi/2 $', '$ \\pi $', '$ 3\\pi/2 $', '$ 2\\pi $'],
    rows: [
      ['$ \\cos x $', '1', '0', '−1', '0', '1'],
      ['$ \\sin x $', '0', '1', '0', '−1', '0'],
    ],
  }),
  b('text', 10, {
    markdown:
      'Two more facts follow immediately from the picture. Rotating by a **negative** angle $ -x $ lands you at ' +
      'the *mirror image* of $ P(a,b) $ across the x-axis — the point $ Q(a, -b) $. Same shadow, flipped height. ' +
      'That gives the **negative-angle identities**:',
  }),
  b('math_graph', 11, {
    title: 'Mirror across the x-axis: negative angles',
    caption: 'x and −x land at points with the same cos, opposite sin.',
    spec: {
      bounds: { xmin: -1.4, xmax: 1.4, ymin: -1.4, ymax: 1.4 },
      functions: [
        { expr: 'sqrt(1-x^2)', color: 'sky' },
        { expr: '-sqrt(1-x^2)', color: 'sky' },
      ],
      points: [
        { x: 0.5, y: 0.866, label: '(cos x, sin x)', color: 'violet' },
        { x: 0.5, y: -0.866, label: '(cos x, −sin x)', color: 'amber' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
  }),
  b('latex_block', 12, {
    latex: '\\cos(-x) = \\cos x, \\qquad \\sin(-x) = -\\sin x',
    label: 'Negative-angle identities', highlight: true,
  }),
  b('text', 13, {
    markdown:
      'And going all the way round — one full extra revolution, $ 2\\pi $ — brings the point back to exactly ' +
      'where it started, for any integer number of extra turns $ n $:',
  }),
  b('latex_block', 14, {
    latex: '\\sin(2n\\pi + x) = \\sin x, \\qquad \\cos(2n\\pi + x) = \\cos x, \\quad n \\in \\mathbb{Z}',
    label: 'Periodicity (period 2π)',
  }),
  b('reasoning_prompt', 15, {
    reasoning_type: 'logical',
    prompt: 'Using sin²x + cos²x = 1, if sin x = 0.6, what are the possible values of cos x?',
    options: ['Only 0.8', 'Only −0.8', '0.8 or −0.8', '0.4'],
    reveal:
      'cos²x = 1 − 0.36 = 0.64, so cos x = ±0.8 — the identity only pins down the *square*. You need to know ' +
      'the quadrant to pick the sign. That’s exactly the next skill.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 16, {
    pass_threshold: 0.67,
    questions: [
      q('For the point $ P(a, b) $ on the unit circle at angle x, which definition is correct?',
        ['$ \\sin x = a,\\ \\cos x = b $', '$ \\sin x = b,\\ \\cos x = a $', '$ \\sin x = a + b $', '$ \\sin x = ab $'],
        1,
        '$ \\cos x $ is the x-coordinate (the shadow), $ \\sin x $ is the y-coordinate (the height) — remember it ' +
        'as “cos is across, sin is up.”',
        1),
      q('What is $ \\cos(\\pi) $?',
        ['0', '1', '−1', 'undefined'],
        2,
        'At $ x = \\pi $ (180°) the point sits at $ (-1, 0) $, so $ \\cos\\pi = -1 $ and $ \\sin\\pi = 0 $.',
        1),
      q('If $ \\sin x = 0.5 $, what is $ \\sin(-x) $?',
        ['0.5', '−0.5', '1', '0'],
        1,
        '$ \\sin(-x) = -\\sin x $, so $ \\sin(-x) = -0.5 $. The mirror across the x-axis flips the height.',
        1),
      q('What does $ \\sin^2 x + \\cos^2 x = 1 $ say, geometrically?',
        ['The point (cos x, sin x) always lies on the unit circle', 'sin x always equals cos x',
         'The angle x is always 90°', 'sin x + cos x = 1'],
        0,
        'It is exactly Pythagoras’ theorem for the point $ (\\cos x, \\sin x) $, which by definition sits at ' +
        'distance 1 from the origin — on the unit circle, always.',
        2),
    ],
  }),
  b('text', 17, {
    markdown:
      'Height and shadow are only two of the six trigonometric functions. The other four are built as ratios and ' +
      'reciprocals of these two — and each one refuses to exist at a few particular angles. That’s next.',
  }),
];

/* ── Page 3 — Domain, Range & the Six Functions ──────────────────────────── */
const p3 = [
  b('image', 0, {
    src: '', alt: 'Six glowing dials labelled with trigonometric symbols, some with warning gaps, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Six glowing instrument dials in a row, each labelled with a different ' +
      'trigonometric symbol, most reading smoothly but two showing a small warning gap where the needle cannot ' +
      'go. Violet and amber glow on a deep near-black background, elegant instrument-panel style. No text beyond ' +
      'the dial symbols.',
  }),
  b('text', 1, {
    markdown:
      'The other four trigonometric functions are just **sin** and **cos**, repackaged:',
  }),
  b('latex_block', 2, {
    latex:
      '\\csc x = \\frac{1}{\\sin x},\\quad \\sec x = \\frac{1}{\\cos x},\\quad ' +
      '\\tan x = \\frac{\\sin x}{\\cos x},\\quad \\cot x = \\frac{\\cos x}{\\sin x}',
    label: 'The other four, as reciprocals and ratios', highlight: true,
  }),
  b('text', 3, {
    markdown:
      'And that formula is also where their **domain gaps** come from — you cannot divide by zero. ' +
      '$ \\csc x $ and $ \\cot x $ break wherever $ \\sin x = 0 $ (i.e. $ x = n\\pi $); $ \\sec x $ and $ \\tan x $ ' +
      'break wherever $ \\cos x = 0 $ (i.e. $ x = (2n+1)\\pi/2 $).',
  }),
  b('text', 4, {
    markdown:
      'Dividing the Pythagorean identity $ \\sin^2 x + \\cos^2 x = 1 $ through by $ \\cos^2 x $ or $ \\sin^2 x $ ' +
      'gives two more identities worth keeping alongside it:',
  }),
  b('latex_block', 5, {
    latex: '1 + \\tan^2 x = \\sec^2 x, \\qquad 1 + \\cot^2 x = \\csc^2 x',
    label: 'The two derived Pythagorean identities', highlight: true,
  }),
  b('table', 6, {
    caption: 'Domain and range of all six — the excluded points are exactly where a denominator hits zero.',
    headers: ['Function', 'Domain', 'Range'],
    rows: [
      ['$ \\sin x $', 'all reals', '$ [-1, 1] $'],
      ['$ \\cos x $', 'all reals', '$ [-1, 1] $'],
      ['$ \\tan x $', '$ x \\ne (2n+1)\\pi/2 $', 'all reals'],
      ['$ \\cot x $', '$ x \\ne n\\pi $', 'all reals'],
      ['$ \\sec x $', '$ x \\ne (2n+1)\\pi/2 $', '$ y \\ge 1 $ or $ y \\le -1 $'],
      ['$ \\csc x $', '$ x \\ne n\\pi $', '$ y \\ge 1 $ or $ y \\le -1 $'],
    ],
  }),
  b('callout', 7, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'A slick shortcut: **if you’re given any ONE of the six ratios plus the quadrant, you can find the other ' +
      'five** — just build a right triangle from the one ratio you have (or use the Pythagorean identities ' +
      'directly), then fix each sign using the quadrant. No angle value is ever needed.',
  }),
  b('worked_example', 8, {
    label: 'NCERT Example 6', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'If $ \\cos x = -\\frac{3}{5} $ and $ x $ lies in the third quadrant, find the values of the other five trigonometric functions.',
    solution:
      'Reciprocal first, no sign issues: $ \\sec x = \\frac{1}{\\cos x} = -\\frac{5}{3} $.\n\n' +
      'Now the Pythagorean identity: $ \\sin^2 x = 1 - \\cos^2 x = 1 - \\frac{9}{25} = \\frac{16}{25} $, so ' +
      '$ \\sin x = \\pm\\frac{4}{5} $. In the **third quadrant** sine is negative, so $ \\sin x = -\\frac{4}{5} $, ' +
      'and $ \\csc x = -\\frac{5}{4} $.\n\n' +
      'Finally the ratios: $ \\tan x = \\dfrac{\\sin x}{\\cos x} = \\dfrac{-4/5}{-3/5} = \\frac{4}{3} $, and ' +
      '$ \\cot x = \\frac{3}{4} $.',
  }),
  b('worked_example', 9, {
    label: 'NCERT Example 7', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'If $ \\cot x = -\\frac{5}{12} $ and $ x $ lies in the second quadrant, find the values of the other five trigonometric functions.',
    solution:
      'Flip it: $ \\tan x = -\\frac{12}{5} $.\n\n' +
      'Use $ 1 + \\tan^2 x = \\sec^2 x $: $ \\sec^2 x = 1 + \\frac{144}{25} = \\frac{169}{25} $, so $ \\sec x = ' +
      '\\pm\\frac{13}{5} $. In the **second quadrant** cosine is negative, so $ \\sec x = -\\frac{13}{5} $, and ' +
      '$ \\cos x = -\\frac{5}{13} $.\n\n' +
      'Now recover sine from the ratio: $ \\sin x = \\tan x \\cdot \\cos x = \\left(-\\frac{12}{5}\\right) ' +
      '\\left(-\\frac{5}{13}\\right) = \\frac{12}{13} $ — positive, as it must be in the second quadrant. ' +
      '$ \\csc x = \\frac{13}{12} $.',
  }),
  b('reasoning_prompt', 10, {
    reasoning_type: 'logical',
    prompt: 'Why do tan x and sec x always break at the SAME angles?',
    options: [
      'Coincidence — no shared reason',
      'Both have cos x in the denominator, and cos x = 0 at those exact angles',
      'Because tan x = sec x always',
    ],
    reveal:
      '$ \\tan x = \\sin x / \\cos x $ and $ \\sec x = 1/\\cos x $ — both fail exactly where $ \\cos x = 0 $, i.e. ' +
      'at odd multiples of $ \\pi/2 $. Spotting the shared denominator is the whole trick to memorising domain gaps.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 11, {
    pass_threshold: 0.67,
    questions: [
      q('cot x and cosec x are undefined exactly where…',
        ['cos x = 0', 'sin x = 0', 'tan x = 0', 'They are never undefined'],
        1,
        'Both $ \\cot x = \\cos x/\\sin x $ and $ \\csc x = 1/\\sin x $ have $ \\sin x $ in the denominator, so ' +
        'both break at $ x = n\\pi $, where $ \\sin x = 0 $.',
        1),
      q('If $ \\sin x = \\frac{3}{5} $ with $ x $ in the second quadrant, what is $ \\cos x $?',
        ['$ 4/5 $', '$ -4/5 $', '$ 3/4 $', '$ -3/4 $'],
        1,
        '$ \\cos^2 x = 1 - 9/25 = 16/25 $, so $ \\cos x = \\pm 4/5 $; the second quadrant makes cosine negative, ' +
        'so $ \\cos x = -4/5 $.',
        2),
      q('What is the range of sec x and csc x?',
        ['$ [-1, 1] $', 'all real numbers', '$ y \\ge 1 $ or $ y \\le -1 $ (never between −1 and 1)', '$ y > 0 $ only'],
        2,
        'Since $ |\\cos x| \\le 1 $ and $ |\\sin x| \\le 1 $, their reciprocals can never land strictly between ' +
        '−1 and 1 — they jump straight from ≥1 to ≤−1.',
        3),
      q('Given tan x = 4/3, which identity finds sec x fastest?',
        ['$ \\sin^2 x + \\cos^2 x = 1 $', '$ 1 + \\tan^2 x = \\sec^2 x $', '$ 1 + \\cot^2 x = \\csc^2 x $', '$ \\tan x = \\sin x/\\cos x $'],
        1,
        '$ 1 + \\tan^2 x = \\sec^2 x $ takes you straight from tan to sec with no detour through sin/cos.',
        2),
    ],
  }),
  b('text', 12, {
    markdown:
      'Now that every function’s domain gaps make sense, the next question is *sign*: in which quadrant is each ' +
      'function positive, and which negative? There’s a clean rule for that.',
  }),
];

/* ── Page 4 — Signs & Quadrants: the CAST Rule (NCERT 3.3.1/3.3.2) ───────── */
const p4 = [
  b('image', 0, {
    src: '', alt: 'A circle divided into four glowing quadrants each labelled with a letter, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A circle split into four glowing quadrants, each tinted a different ' +
      'colour (violet, sky, amber, emerald) and stamped with a single bold letter — A, S, T, C — like a compass ' +
      'rose. Deep near-black background, elegant instrument-panel style.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'Generations of students have kept the sign rule straight with the mnemonic **“All Students Take ' +
      'Calculus”** — read anticlockwise starting from quadrant I: **A**ll positive, **S**in positive, **T**an ' +
      'positive, **C**os positive. Whichever function names the quadrant, its reciprocal is positive there too.',
  }),
  b('math_graph', 2, {
    title: 'Play: which quadrant, which sign?',
    caption: 'Drag θ into each quadrant and watch the two readouts change sign.',
    archetype: 'unit-circle',
    predict: {
      prompt: 'Drag θ into the third quadrant (between π and 3π/2). Are sin θ and cos θ both negative, both positive, or mixed?',
      options: ['Both positive', 'Both negative', 'One positive, one negative'],
      answer_index: 1,
      reveal:
        'Both negative — the point sits in the bottom-left, below AND left of the origin. That’s exactly why ' +
        '$ \\tan\\theta = \\sin\\theta/\\cos\\theta $ comes out **positive** there: a negative divided by a ' +
        'negative is positive. Q3 is “T for tan,” not “everything negative.”',
    },
  }),
  b('table', 3, {
    caption: 'The full sign table by quadrant.',
    headers: ['Quadrant', 'sin, csc', 'cos, sec', 'tan, cot'],
    rows: [
      ['I (0 to π/2)', '+', '+', '+'],
      ['II (π/2 to π)', '+', '−', '−'],
      ['III (π to 3π/2)', '−', '−', '+'],
      ['IV (3π/2 to 2π)', '−', '+', '−'],
    ],
  }),
  b('text', 4, {
    markdown:
      'Within each quadrant the functions don’t just have a fixed sign — they move steadily from one boundary ' +
      'value to the next. As $ x $ sweeps quadrant I ($ 0 \\to \\pi/2 $), $ \\sin x $ **rises** from $ 0 $ to $ 1 $ ' +
      'while $ \\cos x $ **falls** from $ 1 $ to $ 0 $ — they trade places. Then in quadrant II, $ \\sin x $ falls ' +
      'back from $ 1 $ to $ 0 $ while $ \\cos x $ keeps falling, from $ 0 $ down to $ -1 $. Watch it happen on the ' +
      'tool above rather than memorising a table — the shape is the same story every quadrant, just relabelled.',
  }),
  b('worked_example', 5, {
    label: 'NCERT Example 8', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Find the value of $ \\sin\\frac{31\\pi}{3} $.',
    solution:
      'Peel off whole revolutions first — $ \\sin x $ repeats every $ 2\\pi $. Write $ \\frac{31\\pi}{3} = ' +
      '10\\pi + \\frac{\\pi}{3} $, and $ 10\\pi = 5 \\times 2\\pi $ is exactly 5 extra revolutions.\n\n' +
      'So $ \\sin\\frac{31\\pi}{3} = \\sin\\left(10\\pi + \\frac{\\pi}{3}\\right) = \\sin\\frac{\\pi}{3} = ' +
      '\\frac{\\sqrt{3}}{2} $.',
  }),
  b('worked_example', 6, {
    label: 'NCERT Example 9', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Find the value of $ \\cos(-1710°) $.',
    solution:
      'Cosine repeats every $ 360° $, so add whole revolutions until the angle is small. Adding $ 5 \\times 360° ' +
      '= 1800° $: $ \\cos(-1710°) = \\cos(-1710° + 1800°) = \\cos 90° = 0 $.',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'quantitative',
    prompt: 'Without a calculator: is tan(200°) positive or negative?',
    options: ['Positive', 'Negative'],
    reveal:
      '200° sits in the third quadrant (180° to 270°) — and Q3 is “T for tan.” Positive.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('In which quadrant is cos x positive but sin x negative?',
        ['I', 'II', 'III', 'IV'],
        3,
        'Quadrant IV: cos is the last letter of “All Students Take Calculus,” so cos (and sec) is the positive ' +
        'one there, while sin is negative.',
        2),
      q('sin(13π) equals…',
        ['0', '1', '−1', 'undefined'],
        0,
        '$ 13\\pi = 12\\pi + \\pi = 6(2\\pi) + \\pi $ — six full extra revolutions land you back at angle $ \\pi $, ' +
        'and $ \\sin\\pi = 0 $.',
        2),
      q('A student says “in quadrant III, everything is negative.” What’s wrong?',
        ['Nothing — it’s correct', 'tan and cot are actually positive in quadrant III', 'sin is actually positive there', 'Quadrant III doesn’t exist'],
        1,
        'Sin and cos ARE both negative in Q3 — but their ratio, tan (and its reciprocal cot), is a negative ' +
        'divided by a negative, which is positive.',
        3),
      q('cos(−1440°) equals…',
        ['0', '1', '−1', '−0.5'],
        1,
        '$ -1440° + 4 \\times 360° = -1440° + 1440° = 0° $, and $ \\cos 0° = 1 $.',
        2),
    ],
  }),
  b('text', 9, {
    markdown:
      'Sign sorted, quadrant by quadrant. Now zoom out and look at the whole picture at once — what does ' +
      '$ \\sin x $ actually *look like* when you plot every value of $ x $, not just one revolution?',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'trigonometric-functions-opener', title: 'Trigonometric Functions',
        subtitle: 'From a triangle’s ratios to a rotating point — trigonometry set free from the right angle.',
        page_number: 0, page_type: 'chapter_opener', blocks: p0 },
      { slug: 'measuring-angles-degree-radian', title: 'Measuring Angles — Degree & Radian',
        subtitle: 'Two languages for the same rotation, and the arc-length formula linking them.',
        page_number: 1, blocks: p1 },
      { slug: 'unit-circle-sin-cos', title: 'The Unit Circle — Defining sin and cos',
        subtitle: 'Height and shadow of a rotating point — sine and cosine, freed from the right triangle.',
        page_number: 2, blocks: p2 },
      { slug: 'domain-range-six-functions', title: 'Domain, Range & the Six Functions',
        subtitle: 'Reciprocals, ratios, and exactly where each one refuses to exist.',
        page_number: 3, blocks: p3 },
      { slug: 'signs-quadrants-cast', title: 'Signs & Quadrants — the CAST Rule',
        subtitle: 'All Students Take Calculus — which function is positive in which quadrant.',
        page_number: 4, blocks: p4 },
    ]);
  });
  console.log('Ch.3 pages 0–4 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
