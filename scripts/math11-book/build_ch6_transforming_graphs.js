'use strict';
/* Class 11 Math · NEW Chapter 6 "Transforming Graphs" — the JEE graph-skills module
   (the crown jewel of the Play-with-Graphs study, _agents/plans/MATH_GRAPHS_EXPANSION.md).
   Teaches the transformation toolkit that Meet-the-Graphs (Ch.0) only started: the three
   reflections, then the signature MODULUS transforms |f(x)| / f(|x|) / |y|=f(x) (each an
   animated fold via the new archetypes), solving equations by counting crossings, and
   combining two graphs (addition of ordinates).

   Voice: warm teacher + "narrate the pen" (each move stated twice); strong practice after
   every graph. Gates are EARNED here (Ch.0 precedes it), so predict-first is used.

   Engine: uses the 4 archetypes added 2026-07-25 — modulus-abs-f, modulus-inner-abs,
   modulus-abs-y, intersection-counter (packages/book-renderer/blocks/math-graph/archetypes.ts).
   Appended as chapter_number 6 (sorts after Linear Inequalities; non-disruptive — founder can
   reorder to sit beside Ch.0 later). Additive + idempotent.
   Run: node scripts/math11-book/build_ch6_transforming_graphs.js */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class11-mathematics';
const CH = {
  number: 6,
  title: 'Transforming Graphs',
  slug: 'transforming-graphs',
  description:
    'The JEE graph-skills toolkit: reflect, fold and combine known shapes instead of plotting from scratch — ' +
    'including the famous modulus moves |f(x)|, f(|x|) and |y| = f(x).',
};
const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });
const q = (question, options, correct_index, explanation, difficulty_level) => ({
  id: uuidv4(), question, options, correct_index, explanation,
  // Only include difficulty_level when set — a bare `undefined` is serialized as
  // `null` by the Mongo driver on insert, which the Zod `.optional()` union then
  // rejects (feedback_livebook_blocks_null_zod_trap). Omit the key instead.
  ...(difficulty_level != null ? { difficulty_level } : {}),
});
const mcq = (prompt, options, correct_index, explanation) =>
  ({ id: uuidv4(), kind: 'mcq', source: 'mcq', prompt, options, correct_index, explanation });
const hero = (order, alt, prompt) => b('image', order, {
  src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt,
});

/* ── Page 0 — Opener ─────────────────────────────────────────────────────── */
const p0 = [
  hero(0, 'A single glowing curve being reflected, folded and combined into new shapes on a dark grid',
    'Ultra-wide cinematic banner (16:5). One bright violet curve at the centre, and around it faint ghost copies ' +
    'showing it reflected across the axes, folded upward, and mirrored — a workshop of graph transformations. Deep ' +
    'near-black background, violet/sky/amber glow, elegant graphing-poster style. No text.'),
  b('text', 1, {
    markdown:
      'Here is the habit that separates fast students from slow ones: **they almost never plot a hard graph point by ' +
      'point.** They spot a shape they already know and *transform* it — move it, flip it, fold it.\n\n' +
      'In **Meet the Graphs** you learned the gentle moves: slide, stretch, flip. Now come the moves the exam loves — ' +
      'the **modulus folds**. They look scary written down ($ |f(x)| $, $ f(|x|) $, $ |y| = f(x) $), but each one is ' +
      'a single, simple action you can do with your hand. Watch each fold happen, and they stop being scary.',
  }),
  b('callout', 2, {
    variant: 'note', title: 'What you’ll pick up here',
    markdown:
      '- **Three mirrors** — reflect a graph across the y-axis, the x-axis, or through the origin\n' +
      '- **$ |f(x)| $** — fold the part below the axis *up*\n' +
      '- **$ f(|x|) $** — keep the right half, *mirror* it to the left\n' +
      '- **$ |y| = f(x) $** — reflect the graph *downward* into a mirror-twin\n' +
      '- **Counting solutions** of an equation just by looking, and **adding two graphs** together',
  }),
  b('text', 3, {
    markdown:
      'One promise: every rule below is followed by real practice, because a transformation only sticks once your ' +
      'hand has done it. Let’s start with the simplest move — the mirror.',
  }),
];

/* ── Page 1 — Reflections: three mirrors ─────────────────────────────────── */
const p1 = [
  hero(0, 'A curve and its three mirror images across the y-axis, x-axis and origin on a dark grid',
    'Ultra-wide cinematic banner (16:5). A violet curve in the first quadrant with three faint mirrored copies — one ' +
    'flipped across a glowing vertical y-axis, one across a horizontal x-axis, one spun through the origin — dashed ' +
    'mirror lines suggested. Deep near-black background, elegant graphing-poster style. No text.'),
  b('text', 1, {
    markdown:
      'A **reflection** is just holding a mirror up to a graph. Three mirrors, three rules — and there’s a neat trick ' +
      'for remembering which is which: **a minus *outside* the function flips it up-down; a minus *inside* (with the ' +
      '$ x $) flips it left-right.**',
  }),
  b('text', 2, {
    markdown:
      '**$ f(-x) $ — the minus is inside, with the $ x $.** Put a mirror on the **y-axis**: the right half swaps with ' +
      'the left. Watch $ e^x $ (which shoots up on the right) become $ e^{-x} $ (which shoots up on the left).',
  }),
  b('math_graph', 3, {
    title: 'Mirror in the y-axis: f(x) → f(−x)',
    caption: 'eˣ (blue) reflected across the y-axis becomes e⁻ˣ (violet). Right and left swap.',
    spec: {
      bounds: { xmin: -4, xmax: 4, ymin: -1, ymax: 7 },
      functions: [
        { expr: 'exp(x)', color: 'sky', label: 'f(x) = eˣ' },
        { expr: 'exp(-x)', color: 'violet', label: 'f(−x) = e⁻ˣ' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('text', 4, {
    markdown:
      '**$ -f(x) $ — the minus is outside.** Now the mirror lies on the **x-axis**: everything above flips below and ' +
      'vice-versa. The rising $ e^x $ becomes the plunging $ -e^x $.',
  }),
  b('math_graph', 5, {
    title: 'Mirror in the x-axis: f(x) → −f(x)',
    caption: 'eˣ (blue) reflected across the x-axis becomes −eˣ (violet). Up and down swap.',
    spec: {
      bounds: { xmin: -4, xmax: 4, ymin: -7, ymax: 7 },
      functions: [
        { expr: 'exp(x)', color: 'sky', label: 'f(x) = eˣ' },
        { expr: '-exp(x)', color: 'violet', label: '−f(x) = −eˣ' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('curiosity_prompt', 6, {
    prompt: 'If you do BOTH mirrors — flip left-right AND up-down — where does the graph end up? Picture spinning it.',
    reveal:
      'You get $ -f(-x) $, which is the graph **spun 180° about the origin** (a point reflection). Two mirrors, at ' +
      'right angles, always equal one half-turn. That’s why odd functions — the ones with $ -f(-x) = f(x) $ — look ' +
      'the same after a spin about the origin.',
  }),
  b('callout', 7, {
    variant: 'remember', title: 'The three mirrors',
    markdown:
      '- **$ f(-x) $** → mirror in the **y-axis** (left ↔ right). *Minus inside.*\n' +
      '- **$ -f(x) $** → mirror in the **x-axis** (up ↔ down). *Minus outside.*\n' +
      '- **$ -f(-x) $** → both together = **spin 180° about the origin.**',
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.7,
    questions: [
      q('The graph of $ y = \\sqrt{-x} $ is the graph of $ y = \\sqrt{x} $ …',
        ['flipped up-down', 'mirrored in the y-axis (now lives on the left)', 'slid left', 'unchanged'], 1,
        'The minus is INSIDE, with the $ x $, so it mirrors in the y-axis. $ \\sqrt{x} $ (living on the right) becomes $ \\sqrt{-x} $, living on the left where $ x \\le 0 $.'),
      q('Which move turns $ y = \\log x $ into $ y = -\\log x $?',
        ['mirror in the x-axis (up-down flip)', 'mirror in the y-axis', 'slide down 1', 'stretch it taller'], 0,
        'The minus is OUTSIDE, so it flips up-down about the x-axis. The rising log curve becomes a falling one; it still passes through $ (1, 0) $.'),
      q('$ y = -f(-x) $ is the same as reflecting $ y = f(x) $ …',
        ['only in the y-axis', 'only in the x-axis', 'through the origin (a 180° turn)', 'across the line y = x'], 2,
        'Two perpendicular mirrors (y-axis then x-axis) compose to a half-turn about the origin.'),
    ],
  }),
  b('text', 9, {
    markdown:
      'Mirrors keep the shape whole — they just turn it around. The next move is different: it takes a *scissors* to ' +
      'the graph. Meet the modulus.',
  }),
];

/* ── Page 2 — |f(x)| : fold the dip up ───────────────────────────────────── */
const p2 = [
  hero(0, 'A parabola with its below-axis dip folding upward like a closing book, on a dark grid',
    'Ultra-wide cinematic banner (16:5). A violet parabola whose lower dip (below a glowing horizontal x-axis) is ' +
    'caught mid-fold, hinging upward like a closing book, leaving a sharp corner where it meets the axis. Deep ' +
    'near-black background, elegant graphing-poster style. No text.'),
  b('text', 1, {
    markdown:
      'The bars in $ |f(x)| $ mean “never let $ y $ go negative.” So the rule is a single physical action:\n\n' +
      '- Any part of the graph **above** the x-axis — leave it exactly as it is.\n' +
      '- Any part **below** the x-axis — **fold it straight up**, like closing a book along the axis.\n' +
      '- **Try this:** drag the slider and watch the dip swing up. Notice the sharp corners it leaves behind.',
  }),
  b('math_graph', 2, {
    title: 'Play: fold up |f(x)|',
    caption: 'The dashed curve is the original f. Drag t: the part below the axis folds up to make |f(x)|.',
    height: 360,
    archetype: 'modulus-abs-f',
    archetype_params: { demo: 'parabola' },
    spec: { bounds: { xmin: -4, xmax: 6, ymin: -6, ymax: 8 }, keepSquare: false },
    predict: {
      prompt: 'Before you drag: the parabola $ x^2 - 2x - 3 $ dips below the axis between its roots −1 and 3. After folding, what happens there?',
      options: ['the dip becomes a bump ABOVE the axis', 'the dip stays below', 'the whole graph disappears'],
      answer_index: 0,
      reveal: 'The dip flips up into a bump. And exactly at the roots −1 and 3 — where the curve met the axis — you get sharp corners.',
    },
  }),
  b('curiosity_prompt', 3, {
    prompt: 'Look at the two points where the folded graph touches the x-axis. They aren’t smooth any more. Why?',
    reveal:
      'At an old x-intercept the curve was heading *down* through the axis; folding sends that piece back *up*, so the ' +
      'graph suddenly changes direction — a **sharp corner**. At a corner the graph is continuous but **not ' +
      'differentiable** (no single tangent). This is why $ |f(x)| $ questions love to ask “where is it not differentiable?”',
  }),
  b('worked_example', 4, {
    label: 'Worked Example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Sketch $ y = |\\sin x| $ and say where it is not differentiable.',
    solution:
      'Start with the shape you know: $ \\sin x $, a wave that rides above the axis, then dips below, then above, forever.\n\n' +
      'Apply the fold: every **below-axis hump gets flipped up**. So the negative humps become positive humps identical ' +
      'to the ones beside them — the graph becomes a run of identical bumps, all sitting on the x-axis, repeating every $ \\pi $.\n\n' +
      'The only rough spots are where $ \\sin x = 0 $ — at $ x = 0, \\pm\\pi, \\pm 2\\pi, \\dots $ (every multiple of $ \\pi $). ' +
      'There the wave was crossing the axis, so folding makes a sharp corner. **Not differentiable at $ x = n\\pi $**; smooth everywhere else.',
  }),
  b('callout', 5, {
    variant: 'remember', title: '|f(x)| — the fold',
    markdown:
      '**Keep the part above the axis; fold the part below it up.**\n\n' +
      '- The result is never negative — it all sits on or above the x-axis.\n' +
      '- **Sharp corners** appear at every old x-intercept → not differentiable there.',
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.7,
    questions: [
      q('The graph of $ y = |x - 2| $ is the line $ y = x - 2 $ with…',
        ['nothing changed', 'the part below the x-axis folded up, making a V with its corner at (2, 0)', 'a slide of 2 up', 'a flip in the y-axis'], 1,
        'The line dips below the axis for $ x < 2 $; folding that part up makes a V. Its corner sits where the line crossed, at $ (2, 0) $.'),
      q('For $ y = |x^2 - 4| $, at how many points is the graph NOT smooth (has a corner)?',
        ['0', '1', '2', '4'], 2,
        '$ x^2 - 4 $ crosses the axis at $ x = -2 $ and $ x = 2 $. Folding the dip between them up makes a corner at each — 2 corners.'),
      q('After applying $ |\\cdot| $, the lowest value $ y $ can take is…',
        ['−1', 'any negative number', '0', 'it depends on f'], 2,
        '$ |f(x)| \\ge 0 $ always — the modulus can never output a negative. The graph sits on or above the x-axis.'),
    ],
  }),
  b('text', 7, {
    markdown:
      'That fold worked on the **outputs** (the $ y $ values). The next modulus works on the **inputs** (the $ x $ ' +
      'values) — and it behaves completely differently.',
  }),
];

/* ── Page 3 — f(|x|) : mirror the right half ─────────────────────────────── */
const p3 = [
  hero(0, 'The right half of a curve being copied and mirrored onto the left across the y-axis, dark grid',
    'Ultra-wide cinematic banner (16:5). A curve on the right side of a glowing vertical y-axis, with its mirror ' +
    'image sweeping across to fill the left side symmetrically; the original left half fading away as "discarded". ' +
    'Deep near-black background, elegant graphing-poster style. No text.'),
  b('text', 1, {
    markdown:
      'In $ f(|x|) $ the bars are **inside**, wrapped around the $ x $. Since $ |x| $ is never negative, the function ' +
      'only ever “sees” non-negative inputs. So the rule, done with your hand:\n\n' +
      '- **Keep the right half** of the graph (where $ x \\ge 0 $) exactly as it is.\n' +
      '- **Throw the left half away**, and in its place put a **mirror image of the right half** across the y-axis.\n' +
      '- **Try this:** drag the slider and watch the right half fold across to become the new left half.',
  }),
  b('math_graph', 2, {
    title: 'Play: mirror across for f(|x|)',
    caption: 'The dashed curve is the original f. Drag t: the left half is replaced by a mirror of the right half.',
    height: 360,
    archetype: 'modulus-inner-abs',
    archetype_params: { demo: 'parabola' },
    spec: { bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 8 }, keepSquare: false },
  }),
  b('curiosity_prompt', 3, {
    prompt: 'After the mirror, fold the finished graph along the y-axis. What do you notice?',
    reveal:
      'The two halves land exactly on top of each other — the graph is **symmetric about the y-axis**. That’s always ' +
      'true: $ f(|x|) $ is an **even function**, because swapping $ x $ for $ -x $ changes nothing ($ |x| = |-x| $).',
  }),
  b('worked_example', 4, {
    label: 'Worked Example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'How does the graph of $ y = \\sin|x| $ differ from $ y = \\sin x $?',
    solution:
      'For $ x \\ge 0 $ nothing changes — $ \\sin|x| = \\sin x $, so the **right half is the ordinary sine wave**.\n\n' +
      'For $ x < 0 $ we throw away the real sine and instead **mirror the right half across the y-axis**. So the left ' +
      'side is the reverse of the right: it starts at $ 0 $, but instead of dipping down (like real $ \\sin x $ does ' +
      'just left of $ 0 $), it *rises* — a mirror of the right.\n\n' +
      'Result: $ \\sin|x| $ is **even** (symmetric about the y-axis), while $ \\sin x $ is **odd**. Same right half, ' +
      'completely different left half — a classic trap.',
  }),
  b('callout', 5, {
    variant: 'remember', title: 'f(|x|) — the mirror',
    markdown:
      '**Keep the right half; discard the left; mirror the right half across the y-axis.**\n\n' +
      '- The result is always **even** (symmetric about the y-axis).\n' +
      '- $ f(|x|) $ generally does **not** equal $ f(x) $ — only their right halves match.',
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.7,
    questions: [
      q('The graph of $ y = f(|x|) $ is always…',
        ['symmetric about the x-axis', 'symmetric about the y-axis (even)', 'the same as f(x)', 'a straight line'], 1,
        'Because $ |x| = |-x| $, the left and right halves are mirror images — the graph is even, symmetric about the y-axis.'),
      q('To draw $ y = e^{|x|} $ you take $ y = e^x $ and…',
        ['fold the part below the axis up', 'keep the right half, mirror it to the left', 'slide it left', 'flip it upside down'], 1,
        'It’s $ f(|x|) $: keep $ e^x $ for $ x \\ge 0 $, mirror that right half across the y-axis. You get a symmetric valley with its lowest point $ (0, 1) $.'),
      q('For $ y = f(|x|) $, the left half of the graph is built from…',
        ['the original left half of f', 'a mirror of the right half of f', 'the x-axis', 'nothing — it’s empty'], 1,
        'The original left half is discarded; the new left half is a mirror image of the right half across the y-axis.'),
    ],
  }),
  b('text', 7, {
    markdown:
      'So far the bars have wrapped the $ x $ or the whole $ f $. What if they wrap the **$ y $** itself? That’s the ' +
      'strangest — and most fun — one.',
  }),
];

/* ── Page 4 — |y| = f(x) : reflect it down ───────────────────────────────── */
const p4 = [
  hero(0, 'A curve reflected downward across the x-axis into a symmetric mirror-twin, dark grid',
    'Ultra-wide cinematic banner (16:5). A curve above a glowing horizontal x-axis and its mirror image reflected ' +
    'below it, forming a symmetric leaf/eye shape, with a portion where the original dipped below the axis erased ' +
    'and marked as gone. Deep near-black background, elegant graphing-poster style. No text.'),
  b('text', 1, {
    markdown:
      'Now the bars are on the **$ y $**: $ |y| = f(x) $. Two things follow, and both are done with your hand:\n\n' +
      '- $ |y| $ can’t be negative, so wherever $ f(x) < 0 $, there’s **no graph at all — erase it**.\n' +
      '- Wherever $ f(x) \\ge 0 $, both $ y = f(x) $ **and** $ y = -f(x) $ work, so keep the curve **and add its ' +
      'reflection below the axis**.\n' +
      '- **Try this:** drag the slider and watch the kept part swing downward into a mirror-twin.',
  }),
  b('math_graph', 2, {
    title: 'Play: reflect down for |y| = f(x)',
    caption: 'The dashed curve is f. Drag t: where f ≥ 0 the graph doubles into a mirror pair; where f < 0 it’s erased.',
    height: 360,
    archetype: 'modulus-abs-y',
    archetype_params: { demo: 'parabola' },
    spec: { bounds: { xmin: -4, xmax: 6, ymin: -8, ymax: 8 }, keepSquare: false },
  }),
  b('callout', 3, {
    variant: 'warning', title: 'This is a relation, not a function',
    markdown:
      'Above each valid $ x $ there are now **two** $ y $-values (one up, one down). A vertical line cuts the graph ' +
      '**twice**, so $ |y| = f(x) $ **fails the vertical-line test** — it is a *relation*, not a function. That’s ' +
      'fine; it just can’t be written as a single $ y = \\dots $',
  }),
  b('worked_example', 4, {
    label: 'Worked Example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Sketch $ |x| + |y| = 1 $.',
    solution:
      'Rearrange to put $ |y| $ alone: $ |y| = 1 - |x| $.\n\n' +
      'First draw the right-hand side $ f(x) = 1 - |x| $: an upside-down V with its peak at $ (0, 1) $, crossing the ' +
      'axis at $ (-1, 0) $ and $ (1, 0) $.\n\n' +
      'Now apply $ |y| = f(x) $:\n\n' +
      '- Outside $ [-1, 1] $, $ 1 - |x| $ is negative → **erase** (no graph).\n' +
      '- On $ [-1, 1] $, keep the tent **and reflect it downward**.\n\n' +
      'The top tent plus its reflection make a perfect **square (a diamond) with corners at $ (1,0), (0,1), (-1,0), ' +
      '(0,-1) $**. That’s the whole graph of $ |x| + |y| = 1 $.',
  }),
  b('callout', 5, {
    variant: 'remember', title: '|y| = f(x) — the down-reflection',
    markdown:
      '**Erase where $ f(x) < 0 $; keep where $ f(x) \\ge 0 $ and add its reflection below the x-axis.**\n\n' +
      '- The result is **symmetric about the x-axis**.\n' +
      '- It is a **relation** (two $ y $’s per $ x $) — it fails the vertical-line test.',
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.7,
    questions: [
      q('Compared with $ y = |f(x)| $, the graph of $ |y| = f(x) $…',
        ['is exactly the same', 'reflects the kept part DOWN instead of folding the dip UP, and erases where f < 0', 'is always a straight line', 'has no graph'], 1,
        '$ |f(x)| $ folds the below-axis part up (still a function). $ |y| = f(x) $ instead erases where $ f < 0 $ and mirrors the surviving part downward — a relation.'),
      q('The graph of $ |y| = x $ exists only for…',
        ['all x', 'x ≤ 0', 'x ≥ 0', 'x = 0 only'], 2,
        '$ |y| = x $ needs the right side $ \\ge 0 $, i.e. $ x \\ge 0 $. There it’s the pair $ y = \\pm x $ — a sideways V opening rightward.'),
      q('Does $ |y| = f(x) $ pass the vertical-line test?',
        ['yes, always', 'no — a vertical line meets it twice wherever f > 0', 'only for straight lines', 'only at x = 0'], 1,
        'Wherever $ f > 0 $ there are two y-values (±), so a vertical line hits twice. It fails the test — a relation, not a function.'),
    ],
  }),
  b('text', 7, {
    markdown:
      'You’ve now met every fold. Time to *use* graphs: the fastest way to count how many solutions an equation has ' +
      'is to draw it — and count crossings.',
  }),
];

/* ── Page 5 — Solve by counting crossings + adding graphs ────────────────── */
const p5 = [
  hero(0, 'A sine wave crossed by a shallow line with the crossing points glowing, on a dark grid',
    'Ultra-wide cinematic banner (16:5). A glowing sky-blue sine wave crossed by a shallow violet straight line, ' +
    'each intersection point lit up like a star, a small counter suggested. Deep near-black background, elegant ' +
    'graphing-poster style. No text.'),
  b('text', 1, {
    markdown:
      'Suppose you’re asked: *how many solutions does $ \\sin x = \\frac{x}{10} $ have?* Solving it with algebra is ' +
      'hopeless. But graphs make it easy:\n\n' +
      '- Draw the **left side** as one curve ($ y = \\sin x $) and the **right side** as another ($ y = \\frac{x}{10} $).\n' +
      '- **Every crossing is one solution.** Just count them.\n' +
      '- **Try this:** drag the line’s slope and watch the solution-counter change.',
  }),
  b('math_graph', 2, {
    title: 'Play: count the crossings',
    caption: 'Fixed wave y = sin x, movable line y = m·x. Drag m — the readout counts the solutions.',
    height: 340,
    archetype: 'intersection-counter',
    archetype_params: { curve: 'sin' },
    spec: { bounds: { xmin: -12, xmax: 12, ymin: -2.5, ymax: 2.5 }, keepSquare: false },
    predict: {
      prompt: 'Since $ \\sin x $ only ranges over $ [-1, 1] $, roughly where can the shallow line $ y = x/10 $ possibly meet it?',
      options: ['only where |x| ≤ 10 (where the line stays within ±1)', 'everywhere, infinitely often', 'only at x = 0'],
      answer_index: 0,
      reveal: 'Right — beyond $ |x| = 10 $ the line has climbed past $ \\pm 1 $, so it can’t touch the wave. All the crossings are trapped in $ [-10, 10] $, and counting them gives 7.',
    },
  }),
  b('worked_example', 3, {
    label: 'Worked Example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'How many real solutions does $ \\cos x = x $ have?',
    solution:
      'Draw $ y = \\cos x $ (a wave between $ -1 $ and $ 1 $) and $ y = x $ (the 45° line).\n\n' +
      'The line $ y = x $ climbs steadily. It can only meet the wave while $ |x| \\le 1 $ (outside that the line is past ' +
      'the wave’s range). In that little window the rising line cuts the gently-falling cosine **exactly once**, near ' +
      '$ x \\approx 0.74 $.\n\n' +
      '**One solution.** No algebra needed — the picture settles it.',
  }),
  b('text', 4, {
    markdown:
      'One more everyday move: **adding two graphs**. To draw $ y = x + \\sin x $, don’t compute — at each $ x $, take ' +
      'the height of the line $ y = x $ and *add on* the height of the sine. Since $ \\sin x $ only ever adds between ' +
      '$ -1 $ and $ +1 $, the whole graph is **trapped in a band** between the lines $ y = x - 1 $ and $ y = x + 1 $, ' +
      'wobbling along the line $ y = x $.',
  }),
  b('math_graph', 5, {
    title: 'Adding ordinates: y = x + sin x',
    caption: 'The rising line y = x with the sine’s height added on — forever trapped between y = x − 1 and y = x + 1.',
    spec: {
      bounds: { xmin: -8, xmax: 8, ymin: -9, ymax: 9 },
      functions: [
        { expr: 'x + sin(x)', color: 'violet', label: 'y = x + sin x' },
        { expr: 'x + 1', color: 'amber', dashed: true, label: 'y = x + 1' },
        { expr: 'x - 1', color: 'amber', dashed: true, label: 'y = x − 1' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('callout', 6, {
    variant: 'remember', title: 'Two graph super-powers',
    markdown:
      '- **Count solutions:** draw both sides; every crossing is one solution.\n' +
      '- **Add graphs ($ f + g $):** add the heights at each $ x $. If $ g $ stays within $ [a, b] $, the sum is ' +
      'trapped between $ f + a $ and $ f + b $.',
  }),
  b('inline_quiz', 7, {
    pass_threshold: 0.7,
    questions: [
      q('To find the number of solutions of $ 2^x = x^2 $, you would…',
        ['solve it with the quadratic formula', 'draw y = 2ˣ and y = x² and count the crossings', 'fold a graph', 'reflect in y = x'], 1,
        'Draw both curves and count intersections — the graphical method. (It turns out there are 3.)'),
      q('The graph of $ y = x + \\sin x $ always stays…',
        ['below the x-axis', 'between the lines y = x − 1 and y = x + 1', 'above y = x²', 'flat'], 1,
        'Since $ -1 \\le \\sin x \\le 1 $, the sum $ x + \\sin x $ is trapped in the band $ x - 1 \\le y \\le x + 1 $, wobbling along $ y = x $.'),
      q('$ \\sin x = 5 $ has how many real solutions?',
        ['one', 'infinitely many', 'none — the line y = 5 never meets the wave (which only reaches 1)', 'two'], 2,
        'Draw $ y = \\sin x $ (max height 1) and the line $ y = 5 $. They never meet, so there are no solutions.'),
    ],
  }),
  b('text', 8, {
    markdown:
      'You now have the whole transformation toolkit. Last stop: one page of mixed practice to lock it in — because ' +
      'recognising the move at a glance is the real skill.',
  }),
];

/* ── Page 6 — Practice & recap ───────────────────────────────────────────── */
const p6 = [
  hero(0, 'A wall of transformed graph shapes waiting to be matched to their equations, dark grid',
    'Ultra-wide cinematic banner (16:5). A gallery wall of transformed graph shapes — a folded V, a symmetric ' +
    'valley, a mirror-twin leaf, a wobbling line — spotlit as if in a challenge round. Deep near-black background, ' +
    'playful but elegant, violet/amber glow. No text.'),
  b('text', 1, {
    markdown:
      'One cheat-sheet, then a workout. Read the move off the equation *first*, then picture the graph — that’s exactly ' +
      'how the exam wants you to think.',
  }),
  b('callout', 2, {
    variant: 'exam_tip', title: 'The transformation cheat-sheet',
    markdown:
      '| You see… | You do… |\n' +
      '|---|---|\n' +
      '| $ f(x) + k $ | slide up $ k $ |\n' +
      '| $ f(x - h) $ | slide right $ h $ (inside runs backwards) |\n' +
      '| $ -f(x) $ | mirror in the x-axis |\n' +
      '| $ f(-x) $ | mirror in the y-axis |\n' +
      '| $ |f(x)| $ | fold the below-axis part **up** |\n' +
      '| $ f(|x|) $ | keep right half, **mirror** it to the left |\n' +
      '| $ |y| = f(x) $ | erase where $ f<0 $, **reflect** the rest **down** |',
  }),
  b('reasoning_prompt', 3, {
    reasoning_type: 'spatial',
    prompt: 'A graph is symmetric about the y-axis and has a sharp valley bottom at (0, 1), rising on both sides. Which is it most likely to be?',
    options: ['$ y = e^x $', '$ y = e^{|x|} $', '$ y = |e^x| $', '$ y = -e^x $'],
    reveal: 'Symmetry about the y-axis is the tell for $ f(|x|) $. $ e^{|x|} $ keeps $ e^x $ on the right and mirrors it left, giving a symmetric valley bottoming at $ (0, 1) $. ($ |e^x| = e^x $, unchanged, since $ e^x $ is already positive.)',
    difficulty_level: 3,
  }),
  b('practice_bank', 4, {
    title: 'Mixed practice — name the move',
    intro: 'Tap any option to check. Read the equation, decide the move, then picture the graph.',
    sections: [
      {
        id: uuidv4(),
        title: 'Which transformation is it?',
        items: [
          mcq('The graph of $ y = |x^2 - 1| $ is the parabola $ y = x^2 - 1 $ with…',
            ['the dip between −1 and 1 folded up (two corners at (±1, 0))', 'the left half mirrored', 'a slide up by 1', 'a flip in the y-axis'], 0,
            'Bars on the whole function → $ |f(x)| $: fold the below-axis dip up. Corners appear at the old roots $ x = \\pm 1 $.'),
          mcq('To draw $ y = \\log|x| $ from $ y = \\log x $, you…',
            ['fold the dip up', 'keep the right half and mirror it across the y-axis', 'slide it right', 'reflect it in the x-axis'], 1,
            'Bars are inside, around $ x $ → $ f(|x|) $: keep $ \\log x $ (right half) and mirror it to the left. You get two symmetric branches.'),
          mcq('The relation $ |y| = \\sin x $ exists only where…',
            ['sin x = 1', 'sin x ≥ 0 (the humps above the axis)', 'x > 0', 'everywhere'], 1,
            '$ |y| $ can’t be negative, so we need $ \\sin x \\ge 0 $ — only the above-axis humps survive, each doubled into a mirror pair; the below-axis humps are erased.'),
          mcq('Which move makes an EVEN function (symmetric about the y-axis) out of any f?',
            ['$ |f(x)| $', '$ -f(x) $', '$ f(|x|) $', '$ f(x) + 2 $'], 2,
            '$ f(|x|) $ mirrors the right half onto the left, so it is always even. $ |f(x)| $ need not be even (it folds up, it doesn’t mirror left-right).'),
        ],
      },
      {
        id: uuidv4(),
        title: 'Corners, symmetry and solutions',
        items: [
          mcq('$ y = ||x| - 2| $ — how is it symmetric?',
            ['about the x-axis', 'about the y-axis', 'about the origin', 'not symmetric'], 1,
            'The inner $ |x| $ forces y-axis symmetry (even); the outer bars just fold dips up without breaking that symmetry.'),
          mcq('How many solutions does $ |x| = \\cos x $ have?',
            ['none', 'exactly two', 'infinitely many', 'exactly one'], 1,
            'Draw the V of $ y = |x| $ and the wave $ y = \\cos x $. The V cuts the central hump once on each side — two crossings, two solutions.'),
          mcq('$ y = |f(x)| $ can never…',
            ['have a corner', 'go below the x-axis', 'be a straight line', 'touch the x-axis'], 1,
            '$ |f(x)| \\ge 0 $ always, so the graph never dips below the x-axis. It can have corners and can touch the axis (at old roots).'),
          mcq('Reflecting $ y = \\sqrt{x} $ in the line $ y = x $ gives…',
            ['$ y = -\\sqrt{x} $', '$ y = \\sqrt{-x} $', '$ y = x^2 $ (for x ≥ 0) — the inverse', '$ y = |x| $'], 2,
            'Reflection in $ y = x $ gives the inverse. The inverse of $ \\sqrt{x} $ is $ x^2 $ (restricted to $ x \\ge 0 $).'),
        ],
      },
    ],
  }),
  b('text', 5, {
    markdown:
      '**That’s the toolkit.** From here, almost no graph is a stranger: it’s a shape you know, reflected, folded or ' +
      'combined. When a JEE question throws $ y = |\\,|x| - 3\\,| $ or $ |y| = \\log|x| $ at you, you won’t reach for ' +
      'a table of values — you’ll just do the moves, one at a time, with your hand.',
  }),
];

const PAGES = [
  { slug: 'transforming-graphs-opener', title: 'Transforming Graphs', subtitle: 'Reflect, fold and combine shapes you already know — the JEE graph-skills toolkit.', page_number: 0, page_type: 'chapter_opener', blocks: p0 },
  { slug: 'three-mirrors', title: 'Three Mirrors', subtitle: 'Reflecting a graph across the y-axis, the x-axis, or through the origin.', page_number: 1, blocks: p1 },
  { slug: 'modulus-fold-up', title: 'Fold It Up — |f(x)|', subtitle: 'Fold the part below the axis upward — and meet the sharp corners it makes.', page_number: 2, blocks: p2 },
  { slug: 'modulus-mirror', title: 'Mirror It — f(|x|)', subtitle: 'Keep the right half, mirror it to the left — an even function every time.', page_number: 3, blocks: p3 },
  { slug: 'modulus-reflect-down', title: 'Reflect It Down — |y| = f(x)', subtitle: 'Erase the negatives, mirror the rest downward — a relation, not a function.', page_number: 4, blocks: p4 },
  { slug: 'count-and-combine', title: 'Count & Combine', subtitle: 'Count an equation’s solutions by crossings; add two graphs by stacking heights.', page_number: 5, blocks: p5 },
  { slug: 'transforming-graphs-practice', title: 'Practice: Name the Move', subtitle: 'A mixed workout — read the move off the equation, then picture the graph.', page_number: 6, page_type: 'lesson', blocks: p6 },
];

async function main() {
  /* self-check: MCQ answer-position spread across every practice_bank + inline_quiz */
  const tally = [0, 0, 0, 0];
  for (const p of PAGES) for (const blk of p.blocks) {
    if (blk.type === 'inline_quiz') blk.questions.forEach((x) => tally[x.correct_index]++);
    if (blk.type === 'practice_bank') blk.sections.forEach((s) => s.items.forEach((it) => { if (it.kind === 'mcq') tally[it.correct_index]++; }));
  }
  console.log('MCQ correct_index spread [A,B,C,D]:', tally, '· total', tally.reduce((a, c) => a + c, 0));

  await withDb(async (db) => {
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const now = new Date();

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book class11-mathematics not found');

    if (!book.chapters.some((c) => c.slug === CH.slug)) {
      await books.updateOne({ _id: book._id }, {
        $push: { chapters: { number: CH.number, title: CH.title, slug: CH.slug, page_ids: [], description: CH.description, is_published: false } },
        $set: { updated_at: now },
      });
      console.log('added chapter', CH.number, CH.title);
    } else {
      console.log('chapter exists:', CH.title);
    }

    for (const p of PAGES) {
      const existing = await pagesCol.findOne({ book_id: book._id, slug: p.slug });
      if (existing) { console.log('  page exists, skipping:', p.slug); continue; }
      await pagesCol.insertOne({
        _id: uuidv4(), book_id: book._id, chapter_number: CH.number, page_number: p.page_number,
        slug: p.slug, title: p.title, subtitle: p.subtitle, blocks: p.blocks,
        page_type: p.page_type || 'lesson', published: false,
        reading_time_min: computeReadingTime(p.blocks), content_types: computeContentTypes(p.blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      });
      console.log('  created page', p.page_number, '·', p.slug, '·', computeReadingTime(p.blocks), 'min ·', (computeContentTypes(p.blocks).join('/') || '—'));
    }

    const all = await pagesCol.find({ book_id: book._id, chapter_number: CH.number, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
    all.sort((a, c) => a.page_number - c.page_number);
    await books.updateOne({ _id: book._id, 'chapters.slug': CH.slug }, { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } });
    console.log('  chapter page_ids set:', all.length, 'pages');
  });
  console.log('Chapter 6 "Transforming Graphs" DONE (unpublished).');
}

module.exports = { PAGES };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
