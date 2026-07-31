'use strict';
/* Class 11 Math · Ch.5 Linear Inequalities — page 5 (more worked examples) and
   page 7 (chapter recap). Page 6 (practice bank) is built separately by
   build_ch5_practice.js. Additive + idempotent.
   Run: node scripts/math11-book/build_ch5_pages_5_7.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch5');

/* ── Page 5 — More Worked Examples (consolidation, no new ideas) ─────────── */
const p5 = [
  b('image', 0, {
    src: '', alt: 'A collage of a thermometer, a report card, and a shaded graph region, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing thermometer, a small report-card icon with a percentage, ' +
      'and a shaded coordinate-plane region arranged together like flash-cards on a deep near-black background ' +
      '— everyday situations that all reduce to a linear inequality. Amber and violet glow, elegant ' +
      'graphing-poster style. No readable text.',
  }),
  b('text', 1, {
    markdown:
      'No new ideas on this page — just the whole toolkit applied to a mixed set of real situations, one ' +
      'variable and two, before you head into the practice bank.',
  }),
  b('worked_example', 2, {
    label: 'Temperature conversion (compound inequality)', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem:
      'A liquid is kept in a lab so that its temperature stays between $ 68\\ °\\text{F} $ and $ 77\\ °\\text{F} $ ' +
      '(exclusive of both). Using $ F = \\frac{9C}{5} + 32 $, find the corresponding range in Celsius.',
    solution:
      'Set up the compound inequality using the given Fahrenheit range:\n\n' +
      '$ 68 < \\frac{9C}{5} + 32 < 77 $\n\n' +
      'Subtract $ 32 $ from all three parts:\n\n' +
      '$ 36 < \\frac{9C}{5} < 45 $\n\n' +
      'Multiply all three parts by $ \\frac{5}{9} $ — **positive**, sign stays:\n\n' +
      '$ 20 < C < 25 $\n\n' +
      'So the liquid must be kept between $ 20\\ °\\text{C} $ and $ 25\\ °\\text{C} $. (Sanity check: water boils ' +
      'at $ 100\\ °\\text{C} = 212\\ °\\text{F} $, a much higher pair — the same formula, just different numbers.)',
  }),
  b('worked_example', 3, {
    label: 'Average-marks word problem', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem:
      'A student needs an average of **at least 60 marks** over three unit tests (each out of 100) to be ' +
      'promoted without re-examination. In the first two tests she scored 65 and 72. What is the minimum she ' +
      'must score in the third test?',
    solution:
      'Let the third-test score be $ x $. The average of all three must be at least $ 60 $:\n\n' +
      '$ \\frac{65 + 72 + x}{3} \\geq 60 $\n\n' +
      'Multiply both sides by $ 3 $ (positive, no flip):\n\n' +
      '$ 137 + x \\geq 180 $\n\n' +
      'Subtract $ 137 $:\n\n' +
      '$ x \\geq 43 $\n\n' +
      'Since a test score can’t exceed 100, the full answer is $ 43 \\leq x \\leq 100 $ — she needs **at least ' +
      '43 marks** in the third test.',
  }),
  b('worked_example', 4, {
    label: 'Clearing fractions first', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve for $ x $: $ \\frac{x + 3}{2} \\geq \\frac{2x - 1}{3} $.',
    solution:
      'Multiply both sides by the LCD, $ 6 $ (**positive**, sign stays) to clear the fractions in one move:\n\n' +
      '$ 3(x + 3) \\geq 2(2x - 1) $\n\n' +
      '$ 3x + 9 \\geq 4x - 2 $\n\n' +
      'Subtract $ 3x $ from both sides:\n\n' +
      '$ 9 \\geq x - 2 $\n\n' +
      'Add $ 2 $:\n\n' +
      '$ 11 \\geq x $, i.e. $ x \\leq 11 $.\n\n' +
      '**The move:** multiply through by the LCD first — it turns a fraction-heavy inequality into an ordinary ' +
      'one, and multiplying by a positive LCD never touches the direction of the sign.',
  }),
  b('worked_example', 5, {
    label: 'A ≥ boundary, solved and shaded', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Solve graphically: $ 5x + 4y \\geq 20 $.',
    solution:
      'Isolate $ y $. Subtract $ 5x $:\n\n' +
      '$ 4y \\geq 20 - 5x $\n\n' +
      'Divide by $ 4 $ — positive, sign stays:\n\n' +
      '$ y \\geq 5 - \\frac{5x}{4} $\n\n' +
      'Solid boundary (the inequality is $ \\geq $). Test the origin in the original: $ 5(0) + 4(0) = 0 \\geq 20 $? ' +
      'False — so shade **away from** the origin, above the line.',
  }),
  b('math_graph', 6, {
    title: '$ 5x + 4y \\geq 20 $', caption: 'Solid boundary, shaded away from the origin.',
    spec: {
      bounds: { xmin: -2, xmax: 8, ymin: -2, ymax: 8 },
      functions: [{ expr: '5 - (5*x)/4', color: 'violet', dashed: false, label: '5x + 4y = 20' }],
      regions: [{ expr: '5 - (5*x)/4', op: '>=', color: 'violet' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
    predict: {
      prompt: 'Is the point $ (0, 6) $ part of the solution of $ 5x + 4y \\geq 20 $?',
      options: ['Yes', 'No'],
      answer_index: 0,
      reveal: '$ 5(0) + 4(6) = 24 \\geq 20 $ — true, so $ (0, 6) $ is on the shaded side, above the line.',
    },
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'analogical',
    prompt: 'A one-variable inequality’s solution is a stretch of a number line. What is the two-variable analogue?',
    options: ['A single point', 'A region of the coordinate plane', 'A curve with no thickness', 'Always the whole plane'],
    reveal: 'A region — exactly as a one-variable solution is a stretch of the number line (an interval), a two-variable solution is a whole stretch of the plane (a half-plane, or the overlap of several).',
    difficulty_level: 3,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.6,
    questions: [
      q('A patient’s temperature must stay strictly between $ 97\\ °\\text{F} $ and $ 99\\ °\\text{F} $. Using $ F = \\frac{9C}{5}+32 $, which Celsius range is correct?',
        ['Roughly $ 36.1\\ °\\text{C} $ to $ 37.2\\ °\\text{C} $', 'Roughly $ 32.6\\ °\\text{C} $ to $ 33.9\\ °\\text{C} $', 'Roughly $ 40.0\\ °\\text{C} $ to $ 41.0\\ °\\text{C} $', 'Roughly $ 25.0\\ °\\text{C} $ to $ 26.0\\ °\\text{C} $'],
        0,
        'Setting $ 97 < \\frac{9C}{5}+32 < 99 $ and solving exactly as in the worked example gives roughly $ 36.1\\,°C $ to $ 37.2\\,°C $ — reassuringly close to normal human body temperature.',
        3),
      q('A shopkeeper has ₹150 and must buy exactly 4 notebooks at ₹18 each; the rest can go on pens at ₹6 each. What is the maximum number of pens he can buy?',
        ['13', '12', '25', '11'],
        0,
        '4 notebooks cost $ 4 \\times 18 = 72 $, leaving $ 150 - 72 = 78 $ for pens. $ 6p \\leq 78 \\Rightarrow p \\leq 13 $ — so 13 pens, the largest whole number satisfying the budget.',
        2),
      q('Solve for $ x $: $ \\frac{x+3}{2} \\geq \\frac{2x-1}{3} $.',
        ['$ x \\leq 11 $', '$ x \\geq 11 $', '$ x \\leq -11 $', '$ x \\leq 5 $'],
        0,
        'Multiplying by the LCD 6 gives $ 3(x+3) \\geq 2(2x-1) \\Rightarrow 3x+9 \\geq 4x-2 \\Rightarrow 11 \\geq x $. Since the LCD is positive, the sign never flips — keeping "≥" the whole way through is correct.',
        2),
      q('For $ 5x + 4y \\geq 20 $, which boundary and shading are correct?',
        ['Solid boundary; shade away from the origin', 'Dashed boundary; shade toward the origin', 'Solid boundary; shade toward the origin', 'Dashed boundary; shade away from the origin'],
        0,
        'The inequality is non-strict ($ \\geq $), so the boundary is solid. Testing the origin gives $ 0 \\geq 20 $, which is false, so shading moves away from the origin.',
        2),
    ],
  }),
  b('text', 9, {
    markdown:
      'Time to test the whole toolkit properly — the practice bank next collects a full set of NCERT-style ' +
      'exercises across every idea in this chapter, each with a complete worked solution.',
  }),
];

/* ── Page 7 — Chapter Recap (retrieval-only) ──────────────────────────────── */
const p7 = [
  b('image', 0, {
    src: '', alt: 'A mindmap of number lines, shaded planes and overlapping regions, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing mindmap: a number line on the left flowing into a single ' +
      'shaded half-plane in the middle, which flows into two and then three overlapping shaded regions on the ' +
      'right, all connected by soft light trails. Deep near-black background, violet-amber-emerald palette, ' +
      'elegant technical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'No new ideas here — just the whole chapter pulled into one place. Read the tables, try the two ' +
      'self-checks, then take the closing quiz.',
  }),
  b('table', 2, {
    caption: 'The sign rules at a glance',
    headers: ['Operation on both sides', 'Effect on the inequality'],
    rows: [
      ['Add or subtract the same number', 'Unchanged'],
      ['Multiply or divide by a positive number', 'Unchanged'],
      ['Multiply or divide by a negative number', 'Reversed ( < ↔ > , ≤ ↔ ≥ )'],
    ],
  }),
  b('table', 3, {
    caption: 'Reading a graphical inequality',
    headers: ['Symbol', 'Boundary line', 'Test-point rule'],
    rows: [
      ['< or >', 'Dashed — points on the line are NOT included', 'Substitute the test point in the ORIGINAL inequality; true → shade that side'],
      ['≤ or ≥', 'Solid — points on the line ARE included', 'Same test-point rule; false → shade the opposite side'],
      ['System (2 or 3 inequalities)', 'Draw every boundary', 'Solution is the OVERLAP of every shaded region, never the union'],
    ],
  }),
  b('table', 4, {
    caption: 'Swap-traps — the classic mix-ups',
    headers: ['Easy to confuse', 'The correct rule'],
    rows: [
      ['Dividing by a negative number and NOT flipping the sign', 'Always flip when multiplying/dividing by a negative number'],
      ['Treating a system as the UNION of the regions', 'A system is the INTERSECTION — every inequality must hold at once'],
      ['Forgetting the y-form’s sign can differ from the original', 'Dividing by a negative y-coefficient flips the y-form’s sign, even though the original inequality is untouched'],
      ['Drawing a dashed line for ≤ / ≥', 'Dashed is only for strict < / > ; solid is for ≤ / ≥'],
    ],
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'logical',
    prompt: 'A system of three inequalities has a bounded triangular feasible region. If you remove ONE of the three inequalities, what is guaranteed to happen to the region?',
    options: ['It can only stay the same size or grow — it can never shrink', 'It must shrink to a single point', 'It becomes empty', 'It automatically becomes a different shape but the same size'],
    reveal: 'It can only stay the same or grow (removing a constraint can never make the allowed territory smaller) — with one boundary gone, the region very often becomes unbounded again, running off to infinity in whatever direction that constraint used to block.',
    difficulty_level: 3,
  }),
  b('reasoning_prompt', 6, {
    reasoning_type: 'quantitative',
    prompt: 'For the inequality $ y < -3x + 5 $, without drawing anything, is the ORIGIN part of the solution?',
    options: ['Yes — $ 0 < 5 $ is true', 'No — $ 0 < 5 $ is false', 'Cannot be determined without a graph'],
    reveal: 'Yes. Substituting $ (0,0) $ gives $ 0 < -3(0) + 5 = 5 $, which is true — the test-point method works exactly the same whether or not you draw the graph.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 7, {
    pass_threshold: 0.6,
    questions: [
      q('Solve $ 4x - 3 < 2x + 5 $.',
        ['$ x < 4 $', '$ x > 4 $', '$ x < -4 $', '$ x > -4 $'],
        0,
        'Subtract 2x: $ 2x - 3 < 5 $. Add 3: $ 2x < 8 $. Divide by 2 (positive, no flip): $ x < 4 $.',
        1),
      q('Solve $ -5x \\leq 25 $.',
        ['$ x \\geq -5 $', '$ x \\leq -5 $', '$ x \\geq 5 $', '$ x \\leq 5 $'],
        0,
        'Dividing by $ -5 $ (negative) flips the sign: $ x \\geq -5 $. Keeping "≤" (the second option) is the forgot-to-flip trap.',
        1),
      q('What kind of boundary line does $ 2x + y \\leq 10 $ get?',
        ['Solid, because the inequality is non-strict', 'Dashed, because the inequality is non-strict', 'Solid, because the coefficient of x is positive', 'It depends on which point you test'],
        0,
        'Non-strict inequalities ($ \\leq $, $ \\geq $) always get a solid boundary — the line itself is part of the solution. The coefficient’s sign and the choice of test point don’t affect this rule.',
        1),
      q('For the system $ y < 4 - x $ and $ y < x + 2 $, what shape is the solution?',
        ['An unbounded wedge opening downward', 'A single bounded triangle', 'The whole coordinate plane', 'An empty region — no solution exists'],
        0,
        'Two overlapping strict-below regions with no third, capping constraint stay open in the downward direction — an unbounded wedge, not a closed shape (that needs a third inequality).',
        3),
      q('In the system $ x+y\\leq 6,\\ y\\leq 2x,\\ y\\geq 0 $, which point is a genuine VERTEX of the triangle?',
        ['$ (2, 4) $', '$ (3, 3) $', '$ (0, 0) $ only if the boundary is dashed', '$ (5, 5) $'],
        0,
        '$ (2,4) $ is where $ x+y=6 $ and $ y=2x $ cross, and it satisfies the third condition $ y \\geq 0 $ — a genuine vertex. $ (3,3) $ lies on an edge, not a corner; $ (5,5) $ fails $ x+y\\leq 6 $ outright.',
        3),
      q('Which pair correctly matches strict/non-strict to dashed/solid?',
        ['Strict → dashed; non-strict → solid', 'Strict → solid; non-strict → dashed', 'Both always dashed', 'Both always solid'],
        0,
        'Strict inequalities ($ <,\\ > $) exclude the boundary, drawn dashed; non-strict ($ \\leq,\\ \\geq $) include it, drawn solid.',
        1),
      q('A recipe needs "at least 2 cups of flour" AND "no more than 500 g total". These two conditions together form…',
        ['A system of inequalities — both must hold at once', 'A single equation', 'Two unrelated, independent equations', 'A contradiction that can never be satisfied'],
        0,
        'Two simultaneous conditions expressed with inequalities are exactly a system — the workable options are whatever satisfies both together, which is very often a perfectly valid, non-empty range.',
        2),
    ],
  }),
  b('text', 8, {
    markdown:
      'You’ve built the whole toolkit — one variable to three, a number line to a closed feasible region. Next ' +
      'time a real limit crosses your path, you’ll reach for an inequality, not an equals sign.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'linear-inequalities-worked-examples', title: 'More Worked Examples',
        subtitle: 'One variable and two, mixed together, before the practice bank.',
        page_number: 5, blocks: p5 },
      { slug: 'linear-inequalities-recap', title: 'Chapter Recap',
        subtitle: 'The sign rules, the graphing convention, the swap-traps — all in one place.',
        page_number: 7, blocks: p7 },
    ]);
  });
  console.log('pages 5 & 7 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
