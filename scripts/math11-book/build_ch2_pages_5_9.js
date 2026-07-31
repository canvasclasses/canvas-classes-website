'use strict';
/* Class 11 Math · Ch.2 Relations and Functions — pages 5–9.
   Additive + idempotent. Run: node scripts/math11-book/build_ch2_pages_5_9.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book');

/* ── Page 5 — The Function Zoo, Part 1: Lines & Powers ───────────────────── */
const p5 = [
  b('image', 0, {
    src: '', alt: 'A family of straight lines and power curves fanning out from the origin, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A fan of glowing straight lines through the origin at different ' +
      'slopes, with smooth power curves (x, x squared, x cubed) rising among them, all passing through one ' +
      'bright point (1,1). Violet, amber and sky-blue glow on a deep near-black background, elegant graphing ' +
      'poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Some functions turn up so often they get names. The simplest are the **straight-line** family:\n\n' +
      '- **Identity** $ f(x) = x $ — output equals input; a $ 45^\\circ $ line through the origin.\n' +
      '- **Constant** $ f(x) = c $ — same output for every input; a flat line.\n' +
      '- **Linear** $ f(x) = mx + c $ — slope $ m $ (the tilt) and intercept $ c $ (where it crosses the y-axis).',
  }),
  b('math_graph', 2, {
    title: 'Line explorer — slope and intercept',
    caption: 'Drag m to tilt the line; drag c to slide it up and down.',
    archetype: 'line-explorer',
    predict: {
      prompt: 'If you increase c (the intercept) but leave m alone, what happens to the line?',
      options: ['It tilts — becomes steeper', 'It slides straight up, keeping the same tilt', 'It flips upside down'],
      answer_index: 1,
      reveal: 'c slides the whole line up or down without changing its steepness. Only m controls the tilt.',
    },
  }),
  b('text', 3, {
    markdown:
      'Beyond lines come the **power functions** $ x^n $. They share a pattern worth feeling: for $ 0 < x < 1 $ ' +
      'the higher powers **flatten** toward the x-axis, while for $ x > 1 $ they **shoot up** faster — yet every ' +
      'one passes through the origin and through $ (1, 1) $.',
  }),
  b('math_graph', 4, {
    title: 'The power family xⁿ',
    caption: 'Drag n through 1, 2, 3, … and watch the curve reshape.',
    archetype: 'power-family',
    predict: {
      prompt: 'For $ y = x^n $, as n gets larger, what happens between x = 0 and x = 1?',
      options: ['The curve rises higher', 'The curve flattens toward the x-axis', 'Nothing changes'],
      answer_index: 1,
      reveal: 'Between 0 and 1, higher powers hug the x-axis; past x = 1 they climb faster. All of them still pass through (1, 1) and the origin.',
    },
  }),
  b('text', 5, {
    markdown:
      '**Even and odd — a symmetry you can see.** A function is **even** if $ f(-x) = f(x) $ (its graph is a ' +
      'mirror image across the y-axis, like $ x^2 $), and **odd** if $ f(-x) = -f(x) $ (a $ 180^\\circ $ turn ' +
      'about the origin leaves it unchanged, like $ x^3 $). Watch out: adding a constant can *break* odd symmetry ' +
      '— $ x $ is odd, but $ x + 1 $ is **neither**.',
  }),
  b('math_graph', 6, {
    title: 'Even or odd?',
    caption: 'Drag the point along the curve; the point at −x and the verdict update live.',
    archetype: 'even-odd-mirror',
    archetype_params: { base: 'cube' },
    predict: {
      prompt: 'Is $ y = x^3 $ symmetric — and if so, about what?',
      options: ['About the y-axis (even)', 'About the origin (odd)', 'Not symmetric at all'],
      answer_index: 1,
      reveal: 'x³ is odd: f(−x) = −f(x), so a half-turn about the origin maps it onto itself. Drag the point and watch f(−a) = −f(a).',
    },
  }),
  b('worked_example', 7, {
    label: 'NCERT Example 20', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'A linear function satisfies $ f = \\{(1, 1), (0, -1), (-1, -3)\\} $. Find $ f(x) $.',
    solution:
      'Linear means $ f(x) = mx + c $. Use two known points:\n\n' +
      'From $ (0, -1) $: $ f(0) = c = -1 $.\n\n' +
      'From $ (1, 1) $: $ f(1) = m + c = 1 $, so $ m + (-1) = 1 $, giving $ m = 2 $.\n\n' +
      'So $ f(x) = 2x - 1 $. (Check: $ f(-1) = -2 - 1 = -3 $. ✓)',
  }),
  b('reasoning_prompt', 8, {
    reasoning_type: 'spatial',
    prompt: 'Which of these is an even function (graph symmetric about the y-axis)?',
    options: ['$ f(x) = x^3 $', '$ f(x) = x^2 $', '$ f(x) = x $', '$ f(x) = x + 1 $'],
    reveal: '$ x^2 $ is even: $ (-x)^2 = x^2 $, so the left and right halves mirror across the y-axis. $ x $ and $ x^3 $ are odd, and $ x+1 $ is neither.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 9, {
    pass_threshold: 0.67,
    questions: [
      q('In $ f(x) = mx + c $, what does $ c $ control?',
        ['The steepness of the line', 'Where the line crosses the y-axis', 'Whether the line is even or odd', 'The domain'],
        1,
        '$ c $ is the y-intercept — it slides the line up or down. The steepness is set by the slope $ m $.',
        1),
      q('A function satisfies $ f(-x) = -f(x) $ for all $ x $. It is…',
        ['Even', 'Odd', 'Constant', 'Linear'],
        1,
        'That is exactly the definition of an odd function — symmetric about the origin (a 180° turn maps it to itself), like $ x $ or $ x^3 $.',
        1),
      q('Every power function $ y = x^n $ passes through which point (besides the origin)?',
        ['$ (0, 1) $', '$ (1, 1) $', '$ (1, 0) $', '$ (2, 2) $'],
        1,
        '$ 1^n = 1 $ for every $ n $, so all of them pass through $ (1, 1) $. That shared point is why the family “fans” around it.',
        2),
      q('Which function is neither even nor odd?',
        ['$ x^2 $', '$ x^4 $', '$ x + 1 $', '$ x^3 $'],
        2,
        'Adding the constant 1 to the odd function $ x $ destroys the origin symmetry without creating y-axis symmetry, so $ x+1 $ is neither. $ x^2, x^4 $ are even and $ x^3 $ is odd.',
        3),
    ],
  }),
  b('text', 10, {
    markdown:
      'Lines and powers are smooth. But the zoo has stranger animals too — functions with a sharp corner, a sudden ' +
      'jump, or a staircase of flat steps. Meet them next.',
  }),
];

/* ── Page 6 — The Function Zoo, Part 2: Rational, Modulus, Signum, [x] ───── */
const p6 = [
  b('image', 0, {
    src: '', alt: 'A hyperbola, a V-shaped absolute value, and a staircase graph on a dark grid',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Three striking curves side by side on a dark grid: a hyperbola 1/x ' +
      'racing toward its axes, a sharp violet V for the absolute value, and a glowing amber staircase for the ' +
      'greatest-integer function. Deep near-black background, sky-blue / violet / amber glow, elegant graphing ' +
      'poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      '**Rational functions** are ratios of polynomials, like $ f(x) = \\dfrac{1}{x} $. The catch is the ' +
      'denominator: $ \\tfrac{1}{x} $ is undefined at $ x = 0 $, so a hole sits there. As $ x $ creeps toward 0 ' +
      'the curve races off toward $ \\pm\\infty $ — it hugs the axes but never touches them (asymptotes).',
  }),
  b('math_graph', 2, {
    title: 'The hyperbola y = 1/x',
    caption: 'Two branches, never crossing the axes.',
    spec: {
      bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
      functions: [{ expr: '1/x', color: 'sky' }],
      points: [{ x: 0.5, y: 2, label: '(0.5, 2)', color: 'amber' }, { x: 0.25, y: 4, label: '(0.25, 4)', color: 'amber' }],
      showGrid: true, showAxes: true, keepSquare: true,
    },
    predict: {
      prompt: 'As x gets closer and closer to 0 from the positive side, what does $ \\tfrac{1}{x} $ do?',
      options: ['Shoots up toward +∞', 'Settles down to 1', 'Reaches exactly 0'],
      answer_index: 0,
      reveal: '1/x grows without bound as x → 0⁺ (see: 1/0.5 = 2, 1/0.25 = 4, 1/0.1 = 10…). x = 0 is never allowed — division by zero.',
    },
  }),
  b('text', 3, {
    markdown:
      '**The modulus (absolute value) function** $ f(x) = |x| $ strips the sign off a number, so its output is ' +
      'never negative. It is really *two rules glued together*:\n\n' +
      '$ |x| = x $ when $ x \\ge 0 $, and $ |x| = -x $ when $ x < 0 $ — a sharp **V** with its corner at the origin.',
  }),
  b('math_graph', 4, {
    title: 'Absolute value — two branches, one V',
    caption: 'Drag x. The readout tells you which branch (y = −x or y = x) is doing the work.',
    archetype: 'piecewise-highlight',
    predict: {
      prompt: 'The two straight pieces of $ |x| $ meet where?',
      options: ['At the origin (0, 0)', 'At (1, 1)', 'They never meet'],
      answer_index: 0,
      reveal: 'The left ray y = −x and the right ray y = x meet at the origin, forming the V. Left of 0 the −x branch is active; right of 0 the x branch is.',
    },
  }),
  b('text', 5, {
    markdown:
      '**The signum function** reports only the *sign*: $ \\text{sgn}(x) = 1 $ for $ x > 0 $, $ 0 $ at $ x = 0 $, ' +
      'and $ -1 $ for $ x < 0 $. Its range is just the three values $ \\{-1, 0, 1\\} $.',
  }),
  b('latex_block', 6, {
    latex: '\\operatorname{sgn}(x) = \\begin{cases} 1, & x > 0 \\\\ 0, & x = 0 \\\\ -1, & x < 0 \\end{cases}',
    label: 'Signum function',
  }),
  b('text', 7, {
    markdown:
      '**The greatest-integer function** $ [x] $ (also called the *floor*) rounds **down** to the nearest integer ' +
      '— the greatest integer that is still $ \\le x $. So $ [2.9] = 2 $ and $ [3] = 3 $. On negatives it drops ' +
      '*away* from zero: $ [-1.2] = -2 $. Its graph is a staircase of flat steps.',
  }),
  b('math_graph', 8, {
    title: 'The greatest-integer staircase',
    caption: 'Drag x along the axis; read [x]. The dashed line is y = x — the steps sit on or below it.',
    archetype: 'step-explorer',
    archetype_params: { kind: 'floor' },
    predict: {
      prompt: 'What is $ [-1.2] $ — the greatest integer that is $ \\le -1.2 $?',
      options: ['−1', '−2', '1'],
      answer_index: 1,
      reveal: '[−1.2] = −2. −1 is bigger than −1.2, so it is too high. On negatives the floor steps DOWN, away from zero — the classic trap.',
    },
  }),
  b('callout', 9, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'Three things exams love to catch:\n\n' +
      '- **Open vs closed dots** on the staircase — each step includes its left end, excludes its right.\n' +
      '- **$ [x] $ on negatives** — $ [-1.2] = -2 $, not $ -1 $. It rounds *down*, not *toward zero*.\n' +
      '- **Signum’s range** is exactly $ \\{-1, 0, 1\\} $ — three values, nothing in between.',
  }),
  b('inline_quiz', 10, {
    pass_threshold: 0.67,
    questions: [
      q('What is the value of $ [-1.2] $ (greatest-integer function)?',
        ['−1', '−2', '1', '2'],
        1,
        '$ [x] $ is the greatest integer $ \\le x $. The integers $ \\le -1.2 $ are $ -2, -3, \\dots $, and the greatest of them is $ -2 $. Choosing $ -1 $ is the “round toward zero” trap.',
        2),
      q('The range of $ f(x) = |x| $ is…',
        ['all real numbers', '$ [0, \\infty) $', '$ (-\\infty, 0] $', '$ \\{-1, 0, 1\\} $'],
        1,
        'Absolute value never returns a negative, and it does reach every value from 0 upward, so the range is $ [0, \\infty) $. The set $ \\{-1,0,1\\} $ is the signum range.',
        1),
      q('Why is $ f(x) = \\tfrac{1}{x} $ undefined at $ x = 0 $?',
        ['Because 0 is negative', 'Because it would require dividing by zero', 'Because 1/0 = 0', 'It is defined; the value is 1'],
        1,
        'Division by zero has no meaning, so $ x = 0 $ is excluded from the domain. Near 0 the outputs blow up toward $ \\pm\\infty $.',
        1),
      q('$ \\operatorname{sgn}(x) $ takes how many distinct values?',
        ['Infinitely many', 'Two', 'Three', 'One'],
        2,
        'Signum outputs exactly $ -1 $, $ 0 $, or $ 1 $ — three values — depending only on whether $ x $ is negative, zero, or positive.',
        1),
    ],
  }),
  b('text', 11, {
    markdown:
      'You have now met the whole cast. The last skill is a builder’s skill: **combining** functions — adding, ' +
      'multiplying, and then *reshaping* them into brand-new graphs.',
  }),
];

/* ── Page 7 — Algebra of Functions (NCERT 2.4.2) ─────────────────────────── */
const p7 = [
  b('image', 0, {
    src: '', alt: 'Two curves being added point by point into a third curve, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two glowing curves and, above them, a third curve formed by adding ' +
      'their heights at each x — thin vertical light-bars showing the pointwise sum. Sky-blue and amber curves ' +
      'combining into a violet sum-curve, deep near-black background, elegant graphing poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Given two real functions $ f $ and $ g $, you can build new ones just by doing the arithmetic **at each ' +
      '$ x $**:\n\n' +
      '- $ (f + g)(x) = f(x) + g(x) $\n' +
      '- $ (f - g)(x) = f(x) - g(x) $\n' +
      '- $ (fg)(x) = f(x)\\,g(x) $\n' +
      '- $ \\left(\\tfrac{f}{g}\\right)(x) = \\tfrac{f(x)}{g(x)} $, wherever $ g(x) \\ne 0 $\n' +
      '- $ (k f)(x) = k\\,f(x) $ for a scalar $ k $',
  }),
  b('callout', 2, {
    variant: 'remember', title: 'Remember',
    markdown:
      'A combined function only makes sense where **both** parents are defined — so its domain is ' +
      '$ D(f) \\cap D(g) $ (the overlap). For a quotient $ \\tfrac{f}{g} $, also throw out every $ x $ where ' +
      '$ g(x) = 0 $.',
  }),
  b('math_graph', 3, {
    title: 'Adding functions is adding heights',
    caption: 'f, g and their sum f + g. At each x, the violet curve is the two heights stacked.',
    height: 360,
    spec: {
      bounds: { xmin: -5, xmax: 5, ymin: -4, ymax: 12 },
      functions: [
        { expr: 'x^2', color: 'sky', label: 'f' },
        { expr: '2*x + 1', color: 'amber', label: 'g' },
        { expr: 'x^2 + 2*x + 1', color: 'violet', label: 'f+g' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
    predict: {
      prompt: 'At x = 1, $ f(1) = 1 $ and $ g(1) = 3 $. Where is $ (f + g)(1) $?',
      options: ['At 4', 'At 3', 'At 2'],
      answer_index: 0,
      reveal: '(f + g)(1) = f(1) + g(1) = 1 + 3 = 4. You just stack the two heights at each x — that is all “adding functions” means.',
    },
  }),
  b('worked_example', 4, {
    label: 'NCERT Example 16', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Let $ f(x) = x^2 $ and $ g(x) = 2x + 1 $. Find $ (f+g)(x),\\ (f-g)(x),\\ (fg)(x) $ and $ \\left(\\tfrac{f}{g}\\right)(x) $.',
    solution:
      'Just combine the formulas at each $ x $:\n\n' +
      '$ (f + g)(x) = x^2 + 2x + 1 $\n\n' +
      '$ (f - g)(x) = x^2 - 2x - 1 $\n\n' +
      '$ (fg)(x) = x^2(2x + 1) = 2x^3 + x^2 $\n\n' +
      '$ \\left(\\tfrac{f}{g}\\right)(x) = \\dfrac{x^2}{2x + 1} $, valid for $ x \\ne -\\tfrac{1}{2} $ (where the bottom is zero).',
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'quantitative',
    prompt: 'If $ f $ has domain $ [0, \\infty) $ and $ g $ has domain $ (-\\infty, 4] $, what is the domain of $ f + g $?',
    options: ['$ [0, 4] $', '$ (-\\infty, \\infty) $', '$ [0, \\infty) $', '$ (-\\infty, 4] $'],
    reveal: 'A sum needs both parts defined, so the domain is the overlap $ D(f) \\cap D(g) = [0, \\infty) \\cap (-\\infty, 4] = [0, 4] $.',
    difficulty_level: 3,
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.67,
    questions: [
      q('For $ f(x) = x $ and $ g(x) = x^2 $, what is $ (fg)(x) $?',
        ['$ x + x^2 $', '$ x^3 $', '$ x^2 $', '$ \\tfrac{1}{x} $'],
        1,
        '$ (fg)(x) = f(x)\\,g(x) = x \\cdot x^2 = x^3 $. Multiplying functions multiplies their values at each point; $ x + x^2 $ would be the sum.',
        1),
      q('The domain of $ \\tfrac{f}{g} $ excludes which extra points beyond $ D(f) \\cap D(g) $?',
        ['Where $ f(x) = 0 $', 'Where $ g(x) = 0 $', 'Where $ x < 0 $', 'None — the domain is all reals'],
        1,
        'A quotient is undefined wherever the denominator is zero, so on top of needing both functions defined, you remove every $ x $ with $ g(x) = 0 $.',
        2),
      q('If $ f(2) = 5 $ and $ g(2) = -3 $, what is $ (f - g)(2) $?',
        ['2', '8', '−8', '15'],
        1,
        '$ (f - g)(2) = f(2) - g(2) = 5 - (-3) = 8 $. Subtracting a negative adds — the classic sign slip gives $ 2 $.',
        2),
    ],
  }),
  b('text', 7, {
    markdown:
      'Adding and multiplying build new formulas. But there is a more visual power move: take a graph you already ' +
      'know and **slide, stretch, or flip it**. That is transformations — and it is where the graph tool really ' +
      'earns its keep.',
  }),
];

/* ── Page 8 — Transformations: Moving & Reshaping Graphs ─────────────────── */
const p8 = [
  b('image', 0, {
    src: '', alt: 'One parabola being shifted, stretched and reflected into a family of curves, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A single glowing parabola in the centre, with ghostly copies of it ' +
      'shifted left/right/up/down, stretched taller, and flipped upside down — the idea of transforming one ' +
      'known graph into a whole family. Violet parabola with amber ghost-copies, deep near-black background, ' +
      'elegant graphing poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Here is the secret that makes graphing fast: you rarely plot from scratch. Learn a handful of **base ' +
      'shapes** ($ x^2 $, $ |x| $, $ \\sqrt{x} $, $ \\tfrac{1}{x} $) and then **move and reshape** them.\n\n' +
      '- $ f(x) + k $ — shift **up** by $ k $ (down if $ k < 0 $)\n' +
      '- $ f(x - h) $ — shift **right** by $ h $ (left if $ h < 0 $)\n' +
      '- $ a\\,f(x) $ — **stretch** vertically by $ a $ (squash if $ 0 < a < 1 $); flip if $ a < 0 $\n' +
      '- $ f(-x) $ — **reflect** across the y-axis',
  }),
  b('math_graph', 2, {
    title: 'The transformer: a·f(b(x − h)) + k',
    caption: 'Drag a, b, h, k. The faint curve is the original x²; the bright one is your transformed graph.',
    height: 380,
    archetype: 'transformations',
    archetype_params: { base: 'square' },
    predict: {
      prompt: 'Compared with $ x^2 $, which way does $ (x + 3)^2 $ move the graph?',
      options: ['3 units LEFT', '3 units RIGHT', '3 units UP'],
      answer_index: 0,
      reveal: 'LEFT. The “+3” lives inside with x, and inside-changes go the opposite way to your gut — $ f(x + 3) $ shifts left. (In the tool, x − h with h = −3 gives x + 3.)',
    },
  }),
  b('worked_example', 3, {
    label: 'Building a graph by transforming', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Starting from $ y = \\sqrt{x} $, describe the graph of $ y = \\sqrt{x - 2} - 1 $.',
    solution:
      'Read the changes from the inside out:\n\n' +
      '- $ x - 2 $ inside the root → shift **right** by 2.\n' +
      '- $ -1 $ outside → shift **down** by 1.\n\n' +
      'So the familiar $ \\sqrt{x} $ curve simply starts at the point $ (2, -1) $ instead of the origin. Same ' +
      'shape, new home — no new plotting required.',
  }),
  b('callout', 4, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'The trap almost everyone falls into: **inside the bracket, the shift is backwards.**\n\n' +
      '- $ f(x - h) $ moves **right** by $ h $ (not left).\n' +
      '- $ f(x + 3) $ moves **left** by 3.\n\n' +
      'And **order matters** when you combine a stretch with a shift — do them in the wrong order and you land ' +
      'on a different graph.',
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'spatial',
    prompt: 'The graph of $ y = x^2 $ is moved to give $ y = x^2 - 4 $. What happened?',
    options: ['Shifted down 4', 'Shifted right 4', 'Stretched by 4', 'Reflected'],
    reveal: 'The $ -4 $ is *outside*, added to the whole output, so the graph shifts straight **down** by 4 — its vertex drops from (0, 0) to (0, −4).',
    difficulty_level: 2,
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.67,
    questions: [
      q('Compared with $ y = f(x) $, the graph of $ y = f(x) + 5 $ is…',
        ['5 units up', '5 units down', '5 units right', '5 units left'],
        0,
        'Adding 5 *outside* the function lifts every output by 5, so the whole graph moves up 5. Inside-the-bracket changes would move it sideways instead.',
        1),
      q('The graph of $ y = f(x - 2) $ is the graph of $ y = f(x) $ shifted…',
        ['2 left', '2 right', '2 up', '2 down'],
        1,
        'A change *inside* the bracket goes the opposite way to your intuition: $ x - 2 $ shifts the graph 2 to the **right**. This is the most-missed transformation.',
        2),
      q('Which transformation does $ y = -f(x) $ produce?',
        ['Reflection across the x-axis', 'Reflection across the y-axis', 'Shift down', 'Vertical stretch'],
        0,
        'The minus sign multiplies every output by $ -1 $, flipping each point to the other side of the x-axis — a reflection across the x-axis. $ f(-x) $ would flip across the y-axis instead.',
        2),
      q('Starting from $ y = |x| $, the graph of $ y = |x - 3| + 2 $ has its corner at…',
        ['$ (3, 2) $', '$ (-3, 2) $', '$ (3, -2) $', '$ (0, 0) $'],
        0,
        '$ x - 3 $ shifts the V right by 3; $ +2 $ shifts it up by 2. The corner moves from $ (0,0) $ to $ (3, 2) $.',
        3),
    ],
  }),
  b('callout', 7, {
    variant: 'real_world', title: 'Beyond — a preview of Class 12',
    markdown:
      'There is one more way to combine functions: **composition**, feeding the output of one straight into ' +
      'another — written $ (f \\circ g)(x) = f(g(x)) $. A surprise waits there: usually $ f \\circ g \\ne g \\circ f $ ' +
      '(order matters again!). You will meet it properly, along with inverse functions, in Class 12.',
  }),
  b('text', 8, {
    markdown:
      'That completes the toolkit: you can pair, relate, test, measure, catalogue, combine and reshape functions. ' +
      'One page left — a fast retrieval workout to lock it all in.',
  }),
];

/* ── Page 9 — Chapter Recap & Practice (retrieval-first) ─────────────────── */
const p9 = [
  b('image', 0, {
    src: '', alt: 'A concept map of relations and functions glowing on a dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A clean glowing concept map linking the ideas of this chapter — ' +
      'ordered pairs → Cartesian product → relation → function → families → algebra → transformations — as ' +
      'connected nodes. Violet and amber nodes on a deep near-black background, elegant mind-map style. No text ' +
      'other than a few node labels.',
  }),
  b('text', 1, {
    markdown:
      'Don’t just re-read — **retrieve**. Cover the answers and try each prompt before you check. The struggle to ' +
      'recall is what makes it stick.\n\n' +
      '**The chapter in one line:** pair things up ($ A \\times B $) → keep the pairs you want (a *relation*) → ' +
      'demand one output per input (a *function*) → measure it (*domain/range*) → recognise the *families* → ' +
      '*combine and transform* them.',
  }),
  b('text', 2, {
    markdown:
      '**The function families at a glance**\n\n' +
      '| Function | Rule | Domain | Range | Shape |\n' +
      '|---|---|---|---|---|\n' +
      '| Identity | $ x $ | $ \\mathbb{R} $ | $ \\mathbb{R} $ | 45° line |\n' +
      '| Constant | $ c $ | $ \\mathbb{R} $ | $ \\{c\\} $ | flat line |\n' +
      '| Square | $ x^2 $ | $ \\mathbb{R} $ | $ [0,\\infty) $ | parabola (even) |\n' +
      '| Reciprocal | $ 1/x $ | $ x \\ne 0 $ | $ y \\ne 0 $ | hyperbola |\n' +
      '| Modulus | $ |x| $ | $ \\mathbb{R} $ | $ [0,\\infty) $ | V |\n' +
      '| Signum | sgn$ (x) $ | $ \\mathbb{R} $ | $ \\{-1,0,1\\} $ | 3 levels |\n' +
      '| Greatest integer | $ [x] $ | $ \\mathbb{R} $ | $ \\mathbb{Z} $ | staircase |',
  }),
  b('text', 3, {
    markdown:
      '**Traps worth memorising**\n\n' +
      '| Don’t confuse… | …with |\n' +
      '|---|---|\n' +
      '| $ (2,3) $ | $ (3,2) $ — order matters |\n' +
      '| range | codomain — range sits *inside* |\n' +
      '| relation | function — function needs *one* output per input |\n' +
      '| $ f(x+3) $ (left 3) | $ f(x)+3 $ (up 3) |\n' +
      '| $ [-1.2] = -2 $ | $ -1 $ — floor rounds *down* |\n' +
      '| even/odd | *neither* (e.g. $ x+1 $) |',
  }),
  b('reasoning_prompt', 4, {
    reasoning_type: 'logical',
    prompt: 'A friend says “every relation is a function.” Are they right?',
    options: ['Yes, always', 'No — a function is a special relation, not the other way round', 'Only for finite sets'],
    reveal: 'No. Every *function* is a relation, but not every relation is a function — a relation is free to give one input several outputs (like a circle), which a function may never do.',
    difficulty_level: 2,
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'quantitative',
    prompt: 'Quick recall: what is the range of $ f(x) = x^2 $?',
    options: ['$ \\mathbb{R} $', '$ [0, \\infty) $', '$ (0, \\infty) $', '$ \\{0, 1, 4, 9, \\dots\\} $'],
    reveal: 'Squaring never gives a negative and does reach every value from 0 up, so the range is $ [0, \\infty) $ — including 0 itself.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.7,
    questions: [
      q('If $ n(A) = 4 $ and $ n(B) = 3 $, how many ordered pairs are in $ A \\times B $?',
        ['7', '12', '81', '64'],
        1,
        '$ n(A \\times B) = 4 \\times 3 = 12 $. Adding gives the 7 trap; $ 2^{12} $ would be the number of *relations*.',
        1),
      q('Which of these is NOT a function?',
        ['$ \\{(1,2),(2,2),(3,2)\\} $', '$ \\{(1,2),(1,3)\\} $', '$ y = x^2 $', '$ y = |x| $'],
        1,
        '$ \\{(1,2),(1,3)\\} $ gives the input 1 two different outputs, breaking the rule. The first sends everything to 2 (fine), and $ x^2, |x| $ are functions.',
        2),
      q('The domain of $ f(x) = \\dfrac{1}{x^2 - 9} $ is…',
        ['all reals', '$ \\mathbb{R} - \\{3\\} $', '$ \\mathbb{R} - \\{-3, 3\\} $', '$ \\mathbb{R} - \\{9\\} $'],
        2,
        '$ x^2 - 9 = (x-3)(x+3) = 0 $ at $ x = 3 $ and $ x = -3 $, so both are excluded: $ \\mathbb{R} - \\{-3, 3\\} $.',
        2),
      q('Compared with $ y = f(x) $, the graph of $ y = f(x - 4) $ is shifted…',
        ['4 left', '4 right', '4 up', '4 down'],
        1,
        'Inside-the-bracket $ x - 4 $ shifts the graph 4 to the **right** — the counter-intuitive direction.',
        2),
      q('The range of the signum function is…',
        ['$ [0, \\infty) $', '$ \\{-1, 0, 1\\} $', '$ \\mathbb{R} $', '$ \\{0, 1\\} $'],
        1,
        'Signum outputs only $ -1, 0, 1 $ depending on the sign of $ x $.',
        1),
      q('$ [x] $ denotes the greatest integer $ \\le x $. What is $ [2.99] + [-0.5] $?',
        ['2', '1', '3', '2.49'],
        1,
        '$ [2.99] = 2 $ and $ [-0.5] = -1 $ (the greatest integer $ \\le -0.5 $). Sum $ = 2 + (-1) = 1 $. Forgetting that $ [-0.5] = -1 $ (not 0) gives the 2 trap.',
        3),
      q('For $ f(x) = x^2 $ and $ g(x) = 2x + 1 $, what is $ (f - g)(x) $?',
        ['$ x^2 + 2x + 1 $', '$ x^2 - 2x - 1 $', '$ x^2 - 2x + 1 $', '$ -x^2 + 2x + 1 $'],
        1,
        '$ (f-g)(x) = x^2 - (2x + 1) = x^2 - 2x - 1 $. Distributing the minus over *both* terms is the step people miss.',
        2),
      q('Which function is even?',
        ['$ x^3 $', '$ x^2 + 1 $', '$ x + 1 $', '$ 1/x $'],
        1,
        '$ x^2 + 1 $ is even: replacing $ x $ with $ -x $ leaves it unchanged. $ x^3 $ and $ 1/x $ are odd, and $ x + 1 $ is neither.',
        2),
    ],
  }),
  b('text', 7, {
    markdown:
      '**Take it to the exercises.** Work NCERT **Exercise 2.1** (Cartesian products), **2.2** (relations), ' +
      '**2.3** (functions and domains) and the **Miscellaneous Exercise**. Mix them up rather than doing one type ' +
      'in a block — jumping between question types is what trains you to *recognise* which idea a problem needs, ' +
      'which is exactly what the exam tests.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'function-zoo-lines-powers', title: 'The Function Zoo · Lines & Powers',
        subtitle: 'Identity, constant, linear and power functions — and even/odd symmetry.',
        page_number: 5, blocks: p5 },
      { slug: 'function-zoo-rational-modulus-step', title: 'The Function Zoo · Corners, Jumps & Steps',
        subtitle: 'Reciprocal, modulus, signum and the greatest-integer function.',
        page_number: 6, blocks: p6 },
      { slug: 'algebra-of-functions', title: 'Building New Functions: Algebra of Functions',
        subtitle: 'Add, subtract, multiply and divide functions — and mind the domain.',
        page_number: 7, blocks: p7 },
      { slug: 'transformations', title: 'Transformations: Moving & Reshaping Graphs',
        subtitle: 'Slide, stretch and flip a graph you already know.',
        page_number: 8, blocks: p8 },
      { slug: 'relations-functions-recap', title: 'Recap & Practice',
        subtitle: 'Retrieve it, don’t re-read it — then take it to the NCERT exercises.',
        page_number: 9, blocks: p9 },
    ]);
  });
  console.log('pages 5–9 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
