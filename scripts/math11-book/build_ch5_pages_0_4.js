'use strict';
/* Class 11 Math · Ch.5 Linear Inequalities — pages 0–4.
   Additive + idempotent. Run: node scripts/math11-book/build_ch5_pages_0_4.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch5');

/* ── Page 0 — Chapter opener ─────────────────────────────────────────────── */
const p0 = [
  b('image', 0, {
    src: '', alt: 'A balance scale tipping to one side next to a speed-limit sign, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). On the left a glowing balance scale tips clearly to one side ' +
      'instead of resting level; on the right a speed-limit sign glows with a "less than or equal to" feel ' +
      '— the idea that most real limits are not exact equalities but boundaries. Amber and violet light on ' +
      'a deep near-black background, elegant mathematical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Most of algebra so far has asked you to find where two things are **exactly equal** — solve ' +
      '$ 2x + 3 = 11 $ and there is one answer, $ x = 4 $. But most of real life doesn’t work that way. A ' +
      'speed-limit sign doesn’t say “drive at exactly 60 km/h” — it says **at most** 60. Your pocket money ' +
      'doesn’t demand you spend **exactly** ₹250 on samosas — it just can’t let you spend **more than** that.\n\n' +
      'These are **inequalities** — statements built from $ <,\\ >,\\ \\leq,\\ \\geq $ instead of $ = $ — and ' +
      'instead of one answer, they usually have a whole **range**, or in two variables, a whole **region** of ' +
      'the plane. This chapter is where you learn to find and *draw* that range or region — and because a ' +
      'region is something you can see, this is the perfect chapter to grab the interactive graph and shade it ' +
      'in yourself.',
  }),
  b('text', 2, {
    markdown:
      '**What you will be able to do by the end**\n\n' +
      '- Solve a linear inequality in **one variable** — and know exactly when to **flip the sign**\n' +
      '- Represent that solution on a **number line**\n' +
      '- Shade the correct **half-plane** for a linear inequality in **two variables**\n' +
      '- Solve a **system** of two or three inequalities together — the overlap is the answer\n' +
      '- Read a feasible **region** — the first step toward a topic you’ll meet properly later: **Linear ' +
      'Programming**',
  }),
];

/* ── Page 1 — Inequalities in One Variable (NCERT 5.2) ────────────────────── */
const p1 = [
  b('image', 0, {
    src: '', alt: 'A number line with an open circle and a shaded ray extending to the left, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing horizontal number line stretches across the frame, ' +
      'with a bright open circle at one marked point and a thick glowing ray shading off to one side of it — ' +
      'the picture of a one-variable inequality solution. Violet and amber glow on a deep near-black ' +
      'background, elegant technical-diagram style. No readable text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'A lift in a building doesn’t have a sign saying “carry exactly 680 kg” — it says “**do not exceed**”. ' +
      'Every weight limit, every age restriction, every “minimum order value” you’ve ever seen is a linear ' +
      'inequality quietly at work.',
  }),
  b('text', 2, {
    markdown:
      'An **inequality** compares two expressions with $ <,\\ >,\\ \\leq $ or $ \\geq $ instead of $ = $. A ' +
      '**linear inequality in one variable** looks like $ ax + b < c $ (or with any of the other three ' +
      'symbols) — same shape as a linear equation, just with a comparison instead of an equals sign.\n\n' +
      'Solving one works almost exactly like solving an equation: isolate $ x $ by doing the same operation to ' +
      'both sides. Almost — there is **one rule** that catches everyone at least once.',
  }),
  b('heading', 3, {
    text: 'The Three Rules for Solving', level: 2,
    objective: 'Know the one rule that changes everything: what multiplying by a negative number does to an inequality.',
  }),
  b('text', 4, {
    markdown:
      '1. **Add or subtract the same number** from both sides — the inequality is **unchanged**.\n' +
      '2. **Multiply or divide both sides by the same positive number** — **unchanged**.\n' +
      '3. **Multiply or divide both sides by the same negative number** — the inequality **reverses**: ' +
      '$ < $ becomes $ > $, $ \\leq $ becomes $ \\geq $, and vice versa.\n\n' +
      'Rule 3 is the whole game. Forget it once and every answer after that point is wrong — not because the ' +
      'arithmetic was wrong, but because the *direction* was.',
  }),
  b('callout', 5, {
    variant: 'remember', title: 'The Sign-Flip Rule',
    markdown:
      '- Add/subtract anything → sign **stays**.\n' +
      '- Multiply/divide by a **positive** number → sign **stays**.\n' +
      '- Multiply/divide by a **negative** number → sign **flips**.\n\n' +
      'Never multiply or divide both sides by an expression whose sign you don’t already know (like ' +
      '“multiply both sides by $ x $”) — you don’t know whether to flip until you know the sign of what you’re ' +
      'multiplying by.',
  }),
  b('worked_example', 6, {
    label: 'The sign-flip trap', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve for $ x $: $ 3x - 7 > 5x - 1 $.',
    solution:
      'Collect the $ x $ terms on one side. Subtract $ 5x $ from both sides:\n\n' +
      '$ -2x - 7 > -1 $\n\n' +
      'Add $ 7 $ to both sides:\n\n' +
      '$ -2x > 6 $\n\n' +
      'Now divide both sides by $ -2 $ — a **negative** number, so the sign **flips**:\n\n' +
      '$ x < -3 $\n\n' +
      '**Check it:** try $ x = -4 $. Left side $ = 3(-4) - 7 = -19 $. Right side $ = 5(-4) - 1 = -21 $. Is ' +
      '$ -19 > -21 $? Yes — checks out. Try $ x = 0 $ (which should fail, since $ 0 $ is not $ < -3 $): left ' +
      '$ = -7 $, right $ = -1 $; is $ -7 > -1 $? No — correctly excluded.',
  }),
  b('worked_example', 7, {
    label: 'A restricted domain', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve $ 24x < 100 $ when (i) $ x $ is a natural number, (ii) $ x $ is an integer.',
    solution:
      'Divide both sides by $ 24 $ — positive, so the sign stays:\n\n' +
      '$ x < \\frac{100}{24} = \\frac{25}{6} \\approx 4.1\\overline{6} $\n\n' +
      '**(i) Natural numbers** less than $ 4.1\\overline{6} $: $ x \\in \\{1, 2, 3, 4\\} $.\n\n' +
      '**(ii) Integers** less than $ 4.1\\overline{6} $: every integer $ \\leq 4 $ works, so ' +
      '$ x \\in \\{\\ldots, -2, -1, 0, 1, 2, 3, 4\\} $ — unbounded below.\n\n' +
      'The **algebra never changes** — only *which* values of $ x $ you’re allowed to report changes with the ' +
      'domain the question restricts you to.',
  }),
  b('worked_example', 8, {
    label: 'A compound inequality', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve $ -3 < 2x - 1 \\leq 5 $.',
    solution:
      'A compound inequality is really two inequalities glued together. Do the **same operation to all three ' +
      'parts** at once.\n\n' +
      'Add $ 1 $ to all three parts:\n\n' +
      '$ -2 < 2x \\leq 6 $\n\n' +
      'Divide all three parts by $ 2 $ (positive — no flip):\n\n' +
      '$ -1 < x \\leq 3 $\n\n' +
      'So $ x \\in (-1, 3] $ — an **open** circle at $ -1 $ (not included, strict $ < $) and a **closed** dot at ' +
      '$ 3 $ (included, since $ \\leq $).',
  }),
  b('image', 9, {
    src: '', alt: 'Two number lines showing the solved solution sets, open and closed circles marked', caption: '',
    width: 'full',
    generation_prompt:
      'Two stacked horizontal number-line diagrams on a dark background (#0a0a0a or near-black), clean ' +
      'technical illustration style, orange accent labels and ticks. Top line: an open (hollow) circle at -3 ' +
      'with a bold ray shaded to the left, labelled "x < -3". Bottom line: an open (hollow) circle at -1 and a ' +
      'filled (solid) dot at 3, with the segment between them shaded, labelled "-1 < x ≤ 3". Crisp ruler-style ' +
      'tick marks, no other decoration.',
  }),
  b('reasoning_prompt', 10, {
    reasoning_type: 'logical',
    prompt: 'You have $ -2x < 10 $. To isolate $ x $ you must divide both sides by $ -2 $. What happens?',
    options: [
      'The sign stays "<"; the solution is $ x < -5 $',
      'The sign flips to ">"; the solution is $ x > -5 $',
      'The sign flips to ">"; the solution is $ x < -5 $',
      'The sign stays "<"; the solution is $ x > -5 $',
    ],
    reveal:
      'Dividing by $ -2 $ (a negative number) flips the sign: $ -2x < 10 \\Rightarrow x > -5 $. It is easy to ' +
      'get the flip right but the arithmetic wrong (or vice versa) — both have to happen together.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 11, {
    pass_threshold: 0.67,
    questions: [
      q('When you multiply or divide both sides of an inequality by a negative number, what must you do?',
        ['Reverse the direction of the inequality', 'Leave the inequality exactly as it is', 'Add one to both sides before continuing', 'Square both sides to remove the sign'],
        0,
        'Multiplying or dividing by a negative number reverses the inequality — this is the one rule that has no equation counterpart. Leaving it unchanged is the single most common error; squaring or adding one are not valid moves at all.',
        1),
      q('Solve $ 5 - 2x \\geq 7 $ for $ x $.',
        ['$ x \\geq -1 $', '$ x \\leq -1 $', '$ x \\leq -6 $', '$ x \\geq 6 $'],
        1,
        'Subtract 5: $ -2x \\geq 2 $. Divide by $ -2 $ (flip!): $ x \\leq -1 $. Keeping the sign as "≥" after dividing by a negative (giving $ x \\geq -1 $) is the classic forgot-to-flip mistake.',
        2),
      q('What is the solution set of $ -1 < 2x + 3 \\leq 9 $?',
        ['$ (-2, 3] $', '$ [-2, 3) $', '$ (-4, 3] $', '$ (-2, 3) $'],
        0,
        'Subtract 3 from all three parts: $ -4 < 2x \\leq 6 $. Divide by 2 (positive, no flip): $ -2 < x \\leq 3 $. The strict inequality on the left stays open, the "≤" on the right stays closed.',
        2),
    ],
  }),
  b('text', 12, {
    markdown:
      'These solutions all lived on a single **number line** — one dimension. The moment an inequality has ' +
      '**two** variables, its solution stops being a segment of a line and becomes an entire **region of the ' +
      'plane**. That’s where the interactive graph earns its keep.',
  }),
];

/* ── Page 2 — Graphing a Linear Inequality in Two Variables (NCERT 5.3) ───── */
const p2 = [
  b('image', 0, {
    src: '', alt: 'A straight line splitting a plane into two shaded halves, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A single glowing straight line cuts diagonally across a coordinate ' +
      'plane, with one side lightly shaded violet and the other side left dark — the picture of a linear ' +
      'inequality carving the plane into two half-planes. Deep near-black background, amber accent grid lines, ' +
      'elegant technical-illustration style. No text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'Every straight line $ ax + by = c $ splits the entire coordinate plane into exactly **two** pieces. A ' +
      'linear inequality in two variables is just a claim about **which piece you’re standing in**.',
  }),
  b('text', 2, {
    markdown:
      'Replace the $ = $ in a line’s equation with $ <,\\ >,\\ \\leq $ or $ \\geq $ and you get a **linear ' +
      'inequality in two variables**. The line itself is the **boundary**:\n\n' +
      '- **Strict** ($ < $ or $ > $): the boundary line is **dashed** — points on the line are *not* part of ' +
      'the solution.\n' +
      '- **Not strict** ($ \\leq $ or $ \\geq $): the boundary line is **solid** — points on the line *are* ' +
      'included.\n\n' +
      'To find *which* side to shade, use the **test-point method**: pick any point not on the line — the ' +
      'origin $ (0, 0) $ is usually easiest — substitute it into the inequality. If it comes out **true**, ' +
      'shade the side the test point is on. If **false**, shade the *other* side.',
  }),
  b('math_graph', 3, {
    title: 'A single shaded half-plane', caption: 'Drag your eye across the line — one whole side is the solution, the other isn’t.',
    spec: {
      bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 10 },
      functions: [{ expr: '2*x + 3', color: 'violet', dashed: true, label: 'y = 2x + 3' }],
      regions: [{ expr: '2*x + 3', op: '<', color: 'violet' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
    predict: {
      prompt: 'Test the origin (0, 0) in $ y < 2x + 3 $: is $ 0 < 2(0) + 3 $ true? Which side gets shaded?',
      options: ['True — shade the side containing the origin', 'False — shade the side away from the origin'],
      answer_index: 0,
      reveal:
        '$ 0 < 3 $ is true, so the origin is part of the solution — shade the side of the dashed line that ' +
        'contains $ (0, 0) $ (below the line). The line itself is dashed because the inequality is strict.',
    },
  }),
  b('text', 4, {
    markdown:
      'Most inequalities you meet won’t arrive already solved for $ y $ — you’ll need to rearrange first, ' +
      'exactly like solving an equation for $ y $. The same sign-flip rule from Page 1 applies the moment you ' +
      'divide by a **negative** coefficient of $ y $.',
  }),
  b('worked_example', 5, {
    label: 'Solving for y — a solid boundary', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve graphically: $ x + 2y \\leq 8 $.',
    solution:
      'Isolate $ y $. Subtract $ x $:\n\n' +
      '$ 2y \\leq 8 - x $\n\n' +
      'Divide by $ 2 $ — **positive**, sign stays:\n\n' +
      '$ y \\leq 4 - \\frac{x}{2} $\n\n' +
      'The boundary $ y = 4 - \\frac{x}{2} $ is drawn **solid** (the inequality is $ \\leq $). Test the origin ' +
      'in the *original* inequality: $ 0 + 2(0) = 0 \\leq 8 $ — true, so shade the side containing the origin ' +
      '(below/on the line).',
  }),
  b('math_graph', 6, {
    title: '$ x + 2y \\leq 8 $, solved for y', caption: 'A solid boundary — points on the line count too.',
    spec: {
      bounds: { xmin: -4, xmax: 12, ymin: -4, ymax: 9 },
      functions: [{ expr: '4 - x/2', color: 'sky', dashed: false, label: 'x + 2y = 8' }],
      regions: [{ expr: '4 - x/2', op: '<=', color: 'sky' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('worked_example', 7, {
    label: 'The negative-coefficient flip', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve graphically: $ 3x - 2y > 6 $.',
    solution:
      'Isolate $ y $. Subtract $ 3x $:\n\n' +
      '$ -2y > 6 - 3x $\n\n' +
      'Divide by $ -2 $ — **negative**, so the sign **flips** from $ > $ to $ < $:\n\n' +
      '$ y < \\frac{3x - 6}{2} $\n\n' +
      'This is the trap: the *original* inequality said $ > $, but the *y-form* says $ < $. The boundary is ' +
      '**dashed** (still strict). Test the origin in the original inequality: $ 3(0) - 2(0) = 0 > 6 $? False — ' +
      'so shade the side **away from** the origin.',
  }),
  b('math_graph', 8, {
    title: '$ 3x - 2y > 6 $ — mind the flip', caption: 'The y-form reads "<", even though the original said ">".',
    spec: {
      bounds: { xmin: -6, xmax: 6, ymin: -8, ymax: 8 },
      functions: [{ expr: '(3*x - 6)/2', color: 'amber', dashed: true, label: '3x - 2y = 6' }],
      regions: [{ expr: '(3*x - 6)/2', op: '<', color: 'amber' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
    predict: {
      prompt: 'For $ 3x - 2y > 6 $, does the origin (0, 0) belong to the shaded region?',
      options: ['Yes', 'No'],
      answer_index: 1,
      reveal:
        'No. $ 3(0) - 2(0) = 0 $, and $ 0 > 6 $ is false — so the origin is on the *unshaded* side. Shading ' +
        'moves to the far side of the dashed line.',
    },
  }),
  b('callout', 9, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      '- **Dashed** boundary for strict ($ < $ / $ > $); **solid** for $ \\leq $ / $ \\geq $.\n' +
      '- **Test a point** (origin, if the line doesn’t pass through it) in the *original* inequality — true ' +
      'shades that side, false shades the other.\n' +
      '- Dividing by a **negative** $ y $-coefficient flips the sign of the **y-form**, even though the ' +
      'original inequality’s sign never changes.',
  }),
  b('reasoning_prompt', 10, {
    reasoning_type: 'quantitative',
    prompt: 'For the inequality $ y \\geq x - 4 $, is the point $ (0, 0) $ part of the solution?',
    options: ['Yes — $ 0 \\geq -4 $ is true', 'No — $ 0 \\geq -4 $ is false', 'Only if the boundary is dashed'],
    reveal: 'Yes. Substituting gives $ 0 \\geq 0 - 4 = -4 $, which is true, so the origin is inside the shaded region — regardless of whether the boundary is dashed or solid (that only affects the line itself, not which side is shaded).',
    difficulty_level: 2,
  }),
  b('inline_quiz', 11, {
    pass_threshold: 0.67,
    questions: [
      q('Why is the boundary line of $ y > x + 1 $ drawn dashed rather than solid?',
        ['Because the inequality is strict, so points on the line are not solutions', 'Because the line has a positive slope', 'Because the origin lies on the line', 'Dashed lines are only a stylistic choice with no meaning'],
        0,
        'A dashed boundary specifically signals a strict inequality ($ < $ or $ > $): the line itself is excluded from the solution set. Slope and the origin’s location have nothing to do with dashed-vs-solid.',
        1),
      q('To decide which side of a boundary line to shade, what should you do?',
        ['Always shade the upper half of the plane', 'Substitute a test point (not on the line) into the inequality', 'Shade whichever side looks larger on the graph', 'Shade the side where x is positive'],
        1,
        'The test-point method is the reliable rule: plug a point not on the line into the inequality — true shades that side, false shades the other. Guessing by "which side looks bigger" or a fixed direction gives no guarantee at all.',
        1),
      q('Solve $ 4x - 2y \\geq 8 $ for $ y $.',
        ['$ y \\leq 2x - 4 $', '$ y \\geq 2x - 4 $', '$ y \\leq -2x + 4 $', '$ y \\geq -2x - 4 $'],
        0,
        'Subtract 4x: $ -2y \\geq 8 - 4x $. Divide by $ -2 $ (negative — flip!): $ y \\leq 2x - 4 $. Keeping "≥" after dividing by a negative (the second option) is exactly the forgotten-flip trap from this page.',
        2),
    ],
  }),
  b('text', 12, {
    markdown:
      'One inequality shades half the plane. What happens when a real problem hands you **two** conditions that ' +
      'must both hold at once? The answer is exactly what you’d guess — you shade both, and keep only where they ' +
      '**overlap**.',
  }),
];

/* ── Page 3 — Systems of Two Linear Inequalities (NCERT 5.4) ──────────────── */
const p3 = [
  b('image', 0, {
    src: '', alt: 'Two shaded half-planes overlapping into a darker wedge, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two glowing translucent shaded regions — one violet, one sky-blue ' +
      '— overlap across a coordinate plane, with the overlapping wedge glowing brighter where both colours ' +
      'stack. Deep near-black background, clean technical-illustration style. No text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'A recipe that needs “at least 2 cups of flour” **and** “no more than 500 grams total” isn’t satisfied ' +
      'by either condition alone — you need **both at once**. That’s exactly what a system of inequalities ' +
      'asks for.',
  }),
  b('text', 2, {
    markdown:
      'A **system of inequalities** is a set of inequalities that must **all be true at the same time**. Shade ' +
      'each one on its own; the **solution of the system is only the region shaded by every single one** — the ' +
      'overlap, never the union.',
  }),
  b('math_graph', 3, {
    title: 'Two regions, one overlap',
    caption: 'Both $ x + y < 4 $ and $ x - y > -2 $ shaded together — the darker wedge is where both are true.',
    spec: {
      bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
      functions: [
        { expr: '4 - x', color: 'violet', dashed: true, label: 'x + y = 4' },
        { expr: 'x + 2', color: 'sky', dashed: true, label: 'x - y = -2' },
      ],
      regions: [
        { expr: '4 - x', op: '<', color: 'violet' },
        { expr: 'x + 2', op: '<', color: 'sky' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
    predict: {
      prompt: 'Which patch of the plane is shaded by BOTH regions at once — is it wider or narrower than either region alone?',
      options: ['Narrower — the overlap is smaller than either single region', 'Wider — the overlap is bigger than either region alone'],
      answer_index: 0,
      reveal:
        'Narrower. Every extra condition can only remove territory, never add it — the system’s solution is a ' +
        'subset of each individual inequality’s region.',
    },
  }),
  b('worked_example', 4, {
    label: 'Solving the system', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve the system graphically: $ x + y < 4 $ and $ x - y > -2 $.',
    solution:
      'Solve each for $ y $ separately.\n\n' +
      '**First:** $ x + y < 4 \\Rightarrow y < 4 - x $. Dashed boundary $ y = 4 - x $, shade below it.\n\n' +
      '**Second:** $ x - y > -2 \\Rightarrow -y > -2 - x $. Divide by $ -1 $ (**flip**): $ y < x + 2 $. Dashed ' +
      'boundary $ y = x + 2 $, shade below it too.\n\n' +
      'The two boundary lines cross where $ 4 - x = x + 2 \\Rightarrow x = 1,\\ y = 3 $. The **system’s ' +
      'solution** is every point that lies **below both** lines at once — a wedge opening downward from $ (1, 3) $.',
  }),
  b('math_graph', 5, {
    title: 'A ≥/≤ system',
    caption: '$ 2x + y \\geq 6 $ (above) and $ 3x + 4y \\leq 12 $ (below) — this time the overlap opens the other way.',
    spec: {
      bounds: { xmin: -2, xmax: 8, ymin: -4, ymax: 10 },
      functions: [
        { expr: '6 - 2*x', color: 'emerald', dashed: false, label: '2x + y = 6' },
        { expr: '(12 - 3*x)/4', color: 'pink', dashed: false, label: '3x + 4y = 12' },
      ],
      regions: [
        { expr: '6 - 2*x', op: '>=', color: 'emerald' },
        { expr: '(12 - 3*x)/4', op: '<=', color: 'pink' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('worked_example', 6, {
    label: 'A solid-boundary system', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve the system graphically: $ 2x + y \\geq 6 $ and $ 3x + 4y \\leq 12 $.',
    solution:
      '**First:** $ 2x + y \\geq 6 \\Rightarrow y \\geq 6 - 2x $. Solid boundary, shade **above** it.\n\n' +
      '**Second:** $ 3x + 4y \\leq 12 \\Rightarrow 4y \\leq 12 - 3x \\Rightarrow y \\leq \\frac{12 - 3x}{4} $. ' +
      'Solid boundary, shade **below** it.\n\n' +
      'The boundaries cross at $ 6 - 2x = \\frac{12 - 3x}{4} \\Rightarrow 24 - 8x = 12 - 3x \\Rightarrow 12 = ' +
      '5x \\Rightarrow x = 2.4,\\ y = 1.2 $. For $ x < 2.4 $ the two conditions ask for **impossible** things ' +
      '(above a high line and below a low one) — the overlap only exists from $ x = 2.4 $ onward, opening ' +
      'up and to the right.',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'logical',
    prompt: 'A point lies inside the shaded region for $ x + y < 4 $ but outside the shaded region for $ x - y > -2 $. Does it solve the system?',
    options: ['Yes — satisfying one inequality is enough', 'No — a system needs every inequality satisfied at once', 'Only if the point is the origin'],
    reveal: 'No. A system demands ALL of its inequalities hold simultaneously — failing even one disqualifies the point, no matter how comfortably it sits inside the others.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('The solution region of a system of two inequalities is best described as the…',
        ['Union of the two individual regions', 'Overlap (intersection) of the two individual regions', 'Region shaded by whichever inequality comes first', 'Empty set, always'],
        1,
        'A system requires both conditions to hold together, so its solution is the intersection — only the territory shaded by every inequality survives, never the combined (union) area.',
        1),
      q('For the system $ y < 4 - x $ and $ y < x + 2 $, at the crossing point $ (1, 3) $, is $ (1, 3) $ itself part of the solution?',
        ['Yes, since it lies on both boundary lines', 'No, because both boundaries are dashed (strict inequalities)', 'Yes, but only for the first inequality', 'It cannot be determined without a table'],
        1,
        'Both inequalities are strict ($ < $), so both boundary lines are dashed — points exactly on either line, including their crossing point, are excluded from the solution set.',
        2),
      q('Does the point $ (5, 0) $ satisfy the system $ 2x + y \\geq 6 $ and $ 3x + 4y \\leq 12 $?',
        ['Yes, it satisfies both', 'No, it fails the second inequality', 'No, it fails the first inequality', 'No, it fails both'],
        1,
        'Check each: $ 2(5) + 0 = 10 \\geq 6 $ ✓, but $ 3(5) + 4(0) = 15 \\leq 12 $ is false — the second inequality fails, so the point is not in the system’s solution even though the first one is satisfied.',
        3),
    ],
  }),
  b('text', 9, {
    markdown:
      'Two overlapping regions can already pin a solution down to a wedge. Add a **third** inequality, and — if ' +
      'the three lines close in on each other correctly — that wedge can shrink into a fully **bounded shape**. ' +
      'That’s next.',
  }),
];

/* ── Page 4 — Systems of Three Linear Inequalities (NCERT 5.4) ────────────── */
const p4 = [
  b('image', 0, {
    src: '', alt: 'Three shaded regions overlapping to form a bounded triangular patch, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Three translucent glowing shaded regions in violet, amber and ' +
      'emerald overlap across a coordinate plane, their combined overlap forming one bright, fully enclosed ' +
      'triangular patch at the centre. Deep near-black background, clean technical-illustration style. No text.',
  }),
  b('curiosity_prompt', 1, {
    prompt:
      'A small workshop has a limited budget, a limited number of working hours, and can’t produce a negative ' +
      'amount of anything. If you shaded all three limits on the same graph, what do you think the region where ' +
      'ALL of them are satisfied together would look like — an endless strip, or something closed off on every side?',
    hint: 'Think about what a THIRD boundary can do that two boundaries alone cannot.',
    reveal:
      'With enough constraints pointing the right ways, the overlap can close completely — becoming a bounded ' +
      'shape with corners. That closed-off region is exactly what a workshop (or any business) actually has to ' +
      'choose from, and it’s the starting point of a whole later topic: **Linear Programming**.',
  }),
  b('text', 2, {
    markdown:
      'Two shaded half-planes overlap into a wedge that still runs off to infinity in some direction. Add a ' +
      '**third** inequality, and if the three boundary lines are arranged the right way, their common overlap ' +
      'can close into a **bounded polygon** — a shape with a finite area and sharp corners (its **vertices**).',
  }),
  b('math_graph', 3, {
    title: 'Three regions, one closed triangle',
    caption: '$ x + y \\leq 6 $, $ y \\leq 2x $ and $ y \\geq 0 $ — the triple overlap is a bounded triangle.',
    spec: {
      bounds: { xmin: -2, xmax: 8, ymin: -2, ymax: 6 },
      functions: [
        { expr: '6 - x', color: 'violet', dashed: false, label: 'x + y = 6' },
        { expr: '2*x', color: 'amber', dashed: false, label: 'y = 2x' },
        { expr: '0', color: 'emerald', dashed: false, label: 'y = 0' },
      ],
      regions: [
        { expr: '6 - x', op: '<=', color: 'violet' },
        { expr: '2*x', op: '<=', color: 'amber' },
        { expr: '0', op: '>=', color: 'emerald' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
    predict: {
      prompt: 'Before the third condition ($ y \\geq 0 $) is added, is the two-inequality overlap of $ x+y\\leq6 $ and $ y\\leq 2x $ already a closed shape?',
      options: ['Yes — already closed', 'No — it still runs off toward negative y, unbounded'],
      answer_index: 1,
      reveal:
        'No — two conditions alone leave the wedge open toward negative $ y $. Only adding $ y \\geq 0 $ caps it ' +
        'from below and closes the triangle completely.',
    },
  }),
  b('worked_example', 4, {
    label: 'Finding the vertices', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the vertices of the feasible region for the system $ x + y \\leq 6 $, $ y \\leq 2x $, $ y \\geq 0 $.',
    solution:
      'A vertex is where **two** boundary lines cross **and** that crossing point still satisfies the ' +
      '**third** inequality. Check every pair.\n\n' +
      '$ x + y = 6 $ and $ y = 2x $: substitute, $ x + 2x = 6 \\Rightarrow x = 2,\\ y = 4 $. Check ' +
      '$ y \\geq 0 $: $ 4 \\geq 0 $ ✓. **Vertex $ (2, 4) $.**\n\n' +
      '$ x + y = 6 $ and $ y = 0 $: gives $ x = 6 $. Check $ y \\leq 2x $: $ 0 \\leq 12 $ ✓. **Vertex $ (6, 0) $.**\n\n' +
      '$ y = 2x $ and $ y = 0 $: gives $ x = 0 $. Check $ x + y \\leq 6 $: $ 0 \\leq 6 $ ✓. **Vertex $ (0, 0) $.**\n\n' +
      'All three crossing points survive the check, so the feasible region is the **triangle with vertices ' +
      '$ (0,0) $, $ (6,0) $, $ (2,4) $**.',
  }),
  b('callout', 5, {
    variant: 'real_world', title: 'Where This Is Headed',
    markdown:
      'A bounded region like this triangle is exactly what a real business works with — a limited territory of ' +
      '“allowed” choices, carved out by every constraint at once. What we **haven’t** done yet is ask *which* ' +
      'point inside the triangle is *best* (most profit, least cost, …) — that question, and the method for ' +
      'answering it, belongs to a later chapter: **Linear Programming**. For now, finding and shading the ' +
      'region itself is the whole job.',
  }),
  b('reasoning_prompt', 6, {
    reasoning_type: 'quantitative',
    prompt: 'Does the point $ (3, 3) $ lie inside the feasible region for $ x + y \\leq 6 $, $ y \\leq 2x $, $ y \\geq 0 $?',
    options: ['Yes — it satisfies all three', 'No — it fails $ x + y \\leq 6 $', 'No — it fails $ y \\leq 2x $'],
    reveal: 'Yes. $ 3+3=6\\leq 6 $ ✓ (on the boundary, still included since it’s $ \\leq $), $ 3 \\leq 2(3)=6 $ ✓, $ 3 \\geq 0 $ ✓ — all three hold, so $ (3,3) $ sits right on the edge of the triangle.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 7, {
    pass_threshold: 0.67,
    questions: [
      q('Why can THREE overlapping inequalities produce a bounded (closed) region when two often cannot?',
        ['A third boundary line can cap off the direction the first two left open', 'Three inequalities are always automatically bounded', 'Bounded regions require exactly three inequalities, never more or fewer', 'The third line must always be vertical'],
        0,
        'Two half-planes typically still run off to infinity in some direction; a well-placed third boundary can close off that remaining open side, turning an unbounded wedge into a finite polygon. Boundedness depends on how the lines are arranged, not on the count alone.',
        2),
      q('A "vertex" of a feasible region is a point where…',
        ['Any single boundary line is drawn', 'Two boundary lines cross AND the point still satisfies every other inequality in the system', 'The origin happens to sit', 'Exactly one inequality is strict'],
        1,
        'Two lines crossing is not enough on its own — that crossing point must also satisfy every remaining inequality in the system to actually be a corner of the feasible region. Some line-pair crossings get eliminated by a third constraint.',
        2),
      q('For the triangle with vertices $ (0,0),\\ (6,0),\\ (2,4) $, which of these lies STRICTLY inside the region (not on an edge)?',
        ['$ (3, 1) $', '$ (6, 0) $', '$ (0, 6) $', '$ (7, 1) $'],
        0,
        'Check $ (3,1) $: $ 3+1=4\\leq 6 $ ✓, $ 1\\leq 2(3)=6 $ ✓, $ 1\\geq0 $ ✓ — comfortably interior. $ (6,0) $ is a vertex (on the boundary, not strictly inside); $ (0,6) $ and $ (7,1) $ both fail $ x+y\\leq6 $.',
        3),
    ],
  }),
  b('text', 8, {
    markdown:
      'You now have the full toolkit — one variable to two, a single boundary to a whole overlapping system. ' +
      'Time to put it all to work across a mixed set of examples before the practice bank.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'linear-inequalities-opener', title: 'Linear Inequalities',
        subtitle: 'Not everything in life is equal — sometimes it only has to be enough, or not too much.',
        page_number: 0, page_type: 'chapter_opener', blocks: p0 },
      { slug: 'inequalities-in-one-variable', title: 'Inequalities in One Variable',
        subtitle: 'The rules for solving them — and the one rule that flips everything.',
        page_number: 1, blocks: p1 },
      { slug: 'graphing-a-linear-inequality', title: 'Graphing a Linear Inequality in Two Variables',
        subtitle: 'A line splits the plane in two — which half is yours?',
        page_number: 2, blocks: p2 },
      { slug: 'systems-of-two-linear-inequalities', title: 'Systems of Two Linear Inequalities',
        subtitle: 'When two conditions must both hold, the overlap is the answer.',
        page_number: 3, blocks: p3 },
      { slug: 'systems-of-three-linear-inequalities', title: 'Systems of Three Linear Inequalities',
        subtitle: 'Three overlapping regions can close into a bounded shape — the first taste of Linear Programming.',
        page_number: 4, blocks: p4 },
    ]);
  });
  console.log('pages 0–4 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
