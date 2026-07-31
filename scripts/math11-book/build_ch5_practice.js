'use strict';
/* Class 11 Math · Ch.5 Linear Inequalities — the end-of-chapter PRACTICE page.
   A single practice_bank block holding 23 NCERT-style exercises, regrouped into 4
   revision THEMES (one variable, word problems, single 2-var graphs, systems),
   each with a full worked solution in the book's plain teacher voice. Every number
   was hand-verified before being written down — see the chapter plan doc §A for the
   provenance note (no source PDF was available for Ch.5 this session, unlike Ch.2).
   Additive + idempotent (skip-if-exists by slug). published:false.
   Run: node scripts/math11-book/build_ch5_practice.js */
const { b, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch5');
const { v4: uuidv4 } = require('uuid');

/* item helper — every id is a fresh uuid */
const num = (source_label, prompt, answer, solution) =>
  ({ id: uuidv4(), kind: 'numerical', source: 'ncert_exercise', source_label, prompt, answer, solution });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ── Section 1 — Inequalities in one variable ─────────────────────────────── */
const s1 = sec(
  'Inequalities in one variable',
  'The sign rules in action — including the trap of dividing by a negative number.',
  [
    num('Practice · One-Variable Inequalities',
      'Solve for $ x $: $ 4x + 3 < 6x + 7 $.',
      '$ x > -2 $',
      'Subtract $ 4x $ from both sides:\n\n$ 3 < 2x + 7 $\n\n' +
      'Subtract $ 7 $:\n\n$ -4 < 2x $\n\n' +
      'Divide by $ 2 $ — positive, sign stays:\n\n$ -2 < x $, i.e. $ x > -2 $.'),
    num('Practice · One-Variable Inequalities',
      'Solve for $ x $: $ 3(x - 1) \\leq 2(x - 3) $.',
      '$ x \\leq -3 $',
      'Expand both sides:\n\n$ 3x - 3 \\leq 2x - 6 $\n\n' +
      'Subtract $ 2x $:\n\n$ x - 3 \\leq -6 $\n\n' +
      'Add $ 3 $:\n\n$ x \\leq -3 $.'),
    num('Practice · One-Variable Inequalities',
      'Solve for $ x $: $ \\frac{2x-1}{3} - \\frac{3x-2}{4} \\leq 1 $.',
      '$ x \\geq -10 $',
      'Multiply every term by the LCD, $ 12 $ (positive, sign stays):\n\n' +
      '$ 4(2x-1) - 3(3x-2) \\leq 12 $\n\n' +
      '$ 8x - 4 - 9x + 6 \\leq 12 $\n\n' +
      '$ -x + 2 \\leq 12 $\n\n' +
      'Subtract $ 2 $:\n\n$ -x \\leq 10 $\n\n' +
      'Multiply by $ -1 $ — **flip**:\n\n$ x \\geq -10 $.'),
    num('Practice · One-Variable Inequalities',
      'Solve for $ x $: $ 7x + 3 < 5x + 9 $.',
      '$ x < 3 $',
      'Subtract $ 5x $:\n\n$ 2x + 3 < 9 $\n\n' +
      'Subtract $ 3 $:\n\n$ 2x < 6 $\n\n' +
      'Divide by $ 2 $ — positive:\n\n$ x < 3 $.'),
    num('Practice · One-Variable Inequalities',
      'Solve for $ x $: $ -12x > 30 $.',
      '$ x < -2.5 $',
      'Divide both sides by $ -12 $ — **negative**, so the sign flips from $ > $ to $ < $:\n\n' +
      '$ x < \\frac{30}{-12} = -2.5 $.'),
    num('Practice · One-Variable Inequalities',
      'Solve $ 5x - 3 \\geq 3x - 5 $ when $ x $ is restricted to natural numbers.',
      'Every natural number satisfies it',
      'Subtract $ 3x $:\n\n$ 2x - 3 \\geq -5 $\n\n' +
      'Add $ 3 $:\n\n$ 2x \\geq -2 $\n\n' +
      'Divide by $ 2 $:\n\n$ x \\geq -1 $.\n\n' +
      'Every natural number ($ 1, 2, 3, \\ldots $) is automatically $ \\geq -1 $, so restricting to natural ' +
      'numbers rules nothing out — **every natural number is a solution**. A good reminder that a domain ' +
      'restriction sometimes changes nothing at all.'),
    num('Practice · One-Variable Inequalities',
      'Solve $ -5 \\leq 2x - 3 < 7 $.',
      '$ x \\in [-1, 5) $',
      'Add $ 3 $ to all three parts:\n\n$ -2 \\leq 2x < 10 $\n\n' +
      'Divide all three parts by $ 2 $ — positive, sign stays:\n\n$ -1 \\leq x < 5 $.'),
    num('Practice · One-Variable Inequalities',
      'Solve simultaneously and give the combined solution set: $ 2x - 3 < 7 $ and $ 3x + 1 \\geq -8 $.',
      '$ x \\in [-3, 5) $',
      '**First:** $ 2x - 3 < 7 \\Rightarrow 2x < 10 \\Rightarrow x < 5 $.\n\n' +
      '**Second:** $ 3x + 1 \\geq -8 \\Rightarrow 3x \\geq -9 \\Rightarrow x \\geq -3 $.\n\n' +
      'Both must hold together, so combine them on one number line: $ -3 \\leq x < 5 $.'),
  ],
);

/* ── Section 2 — Word problems with inequalities ──────────────────────────── */
const s2 = sec(
  'Word problems with inequalities',
  'Turning a real situation into an inequality first — the algebra is the easy part.',
  [
    num('Practice · Word Problems',
      'A greenhouse must be kept so its temperature stays between $ 15\\,°C $ and $ 20\\,°C $ inclusive. Using $ F = \\frac{9C}{5}+32 $, find the corresponding Fahrenheit range.',
      '$ 59\\,°F \\leq F \\leq 68\\,°F $',
      'Start from $ 15 \\leq C \\leq 20 $ and substitute directly into the conversion, working on all three ' +
      'parts at once.\n\n' +
      'Multiply by $ \\frac{9}{5} $ (positive, sign stays):\n\n$ 27 \\leq \\frac{9C}{5} \\leq 36 $\n\n' +
      'Add $ 32 $:\n\n$ 59 \\leq \\frac{9C}{5}+32 \\leq 68 $, i.e. $ 59 \\leq F \\leq 68 $.'),
    num('Practice · Word Problems',
      'A student needs a total of at least 180 marks across two unit tests (each out of 100) to qualify for a scholarship. She scored 76 in the first test. What is the minimum she must score in the second — and is it possible?',
      '$ x \\geq 104 $ — impossible, since the maximum possible score is 100',
      'Let the second score be $ x $. The total must be at least 180:\n\n$ 76 + x \\geq 180 $\n\n' +
      'Subtract $ 76 $:\n\n$ x \\geq 104 $\n\n' +
      'But a test score can be at most $ 100 $ — there is **no possible score** that satisfies $ x \\geq 104 $. ' +
      'The inequality has a perfectly valid algebraic solution; it is the real-world domain that rules it out. ' +
      'Always check your answer against what is actually possible, not just what the algebra says.'),
    num('Practice · Word Problems',
      'Find all pairs of consecutive odd positive integers, both greater than 10, whose sum is less than 40.',
      '$ (11,13),\\ (13,15),\\ (15,17),\\ (17,19) $',
      'Let the smaller odd integer be $ x $; the next consecutive odd integer is $ x + 2 $.\n\n' +
      'Both greater than 10: since $ x $ is odd, the smallest allowed value is $ x = 11 $.\n\n' +
      'Their sum is less than 40:\n\n$ x + (x+2) < 40 \\Rightarrow 2x + 2 < 40 \\Rightarrow 2x < 38 \\Rightarrow x < 19 $.\n\n' +
      'So $ x $ is an odd integer with $ 10 < x < 19 $: $ x \\in \\{11, 13, 15, 17\\} $.\n\n' +
      'The pairs are $ (11,13),\\ (13,15),\\ (15,17),\\ (17,19) $. (Check the last one: $ 17 > 10 $ ✓, ' +
      '$ 19 > 10 $ ✓, sum $ = 36 < 40 $ ✓.)'),
    num('Practice · Word Problems',
      'A caterer has ₹4000 to spend on chairs at ₹250 each and tables at ₹750 each. If he buys exactly 3 tables, what is the maximum number of chairs he can afford?',
      '7 chairs',
      '3 tables cost $ 3 \\times 750 = 2250 $. Money left for chairs: $ 4000 - 2250 = 1750 $.\n\n' +
      'If $ c $ is the number of chairs, the cost condition is $ 250c \\leq 1750 $.\n\n' +
      'Divide by $ 250 $ — positive:\n\n$ c \\leq 7 $\n\n' +
      'So he can afford **at most 7 chairs**.'),
    num('Practice · Word Problems',
      'A class of 30 students is called “tall on average” only if their average height is more than 150 cm. If $ S $ is the total height (in cm) of all 30 students, write this condition as an inequality in $ S $, and find the smallest possible whole-centimetre total that satisfies it.',
      '$ S > 4500 $; smallest whole-cm total is $ 4501 $',
      'Average height $ = \\frac{S}{30} $. The condition is:\n\n$ \\frac{S}{30} > 150 $\n\n' +
      'Multiply both sides by $ 30 $ — positive, sign stays:\n\n$ S > 4500 $\n\n' +
      'Because the inequality is **strict**, $ S = 4500 $ itself does not qualify — the smallest ' +
      'whole-centimetre total that does is $ S = 4501 $.'),
  ],
);

/* ── Section 3 — Graphing a single inequality in two variables ───────────── */
const s3 = sec(
  'Graphing a single inequality in two variables',
  'Solve for y, decide dashed vs solid, then test a point — every time, in that order.',
  [
    num('Practice · Graphing a Single Inequality',
      'Describe the graphical solution of $ x + y < 5 $.',
      'Below the dashed line $ x+y=5 $ (the half-plane containing the origin)',
      'Solve for $ y $: $ y < 5 - x $. Since the inequality is strict, the boundary line $ x+y=5 $ is ' +
      '**dashed**. Test the origin: $ 0+0=0 < 5 $ — true, so shade the side containing the origin, i.e. below the line.'),
    num('Practice · Graphing a Single Inequality',
      'Describe the graphical solution of $ 2x + 3y \\leq 6 $.',
      'On or below the solid line $ 2x+3y=6 $ (the half-plane containing the origin)',
      'Solve for $ y $: $ 3y \\leq 6-2x \\Rightarrow y \\leq \\frac{6-2x}{3} $. The inequality is non-strict, ' +
      'so the boundary is **solid**. Test the origin: $ 2(0)+3(0)=0\\leq 6 $ — true, so shade the side ' +
      'containing the origin.'),
    num('Practice · Graphing a Single Inequality',
      'Describe the graphical solution of $ y > -2 $.',
      'Everything above the dashed horizontal line $ y=-2 $',
      'This inequality has no $ x $ at all — the boundary is simply the horizontal line $ y = -2 $, drawn ' +
      '**dashed** since the inequality is strict. Every point with a $ y $-coordinate greater than $ -2 $ is a ' +
      'solution, regardless of its $ x $-coordinate — the entire half-plane above the line.'),
    num('Practice · Graphing a Single Inequality',
      'Describe the graphical solution of $ -3x + 2y \\geq 6 $.',
      'On or above the solid line $ y = 3 + 1.5x $ (NOT containing the origin)',
      'Add $ 3x $: $ 2y \\geq 6+3x $. Divide by $ 2 $ — positive: $ y \\geq 3 + 1.5x $. Non-strict, so the ' +
      'boundary is **solid**. Test the origin in the original inequality: $ -3(0)+2(0)=0 \\geq 6 $? False — ' +
      'so shade **away** from the origin, above the line.'),
    num('Practice · Graphing a Single Inequality',
      'Does the point $ (2, -1) $ satisfy the inequality $ 3x - y < 9 $?',
      'Yes',
      'Substitute: $ 3(2) - (-1) = 6 + 1 = 7 $. Is $ 7 < 9 $? Yes — so $ (2,-1) $ satisfies the inequality.'),
    num('Practice · Graphing a Single Inequality',
      'Describe the graphical solution of $ 4x - 5y > 20 $.',
      'Below the dashed line $ y = \\frac{4x-20}{5} $ (NOT containing the origin)',
      'Subtract $ 4x $: $ -5y > 20-4x $. Divide by $ -5 $ — **negative, flip**: $ y < \\frac{4x-20}{5} $. ' +
      'Strict, so the boundary is **dashed**. Test the origin in the original: $ 4(0)-5(0)=0 > 20 $? False — ' +
      'shade **away** from the origin.'),
  ],
);

/* ── Section 4 — Systems: two and three at once ───────────────────────────── */
const s4 = sec(
  'Systems — two and three at once',
  'The overlap is the answer — and with a third constraint, that overlap can close completely.',
  [
    num('Practice · Systems of Inequalities',
      'Describe the solution of the system: $ x + y \\leq 6 $ and $ x - y \\leq 2 $.',
      'All points with $ x-2 \\leq y \\leq 6-x $ (an unbounded wedge, valid for $ x \\leq 4 $)',
      '**First:** $ x+y\\leq 6 \\Rightarrow y \\leq 6-x $ (solid, shade below/on).\n\n' +
      '**Second:** $ x-y\\leq 2 \\Rightarrow -y \\leq 2-x \\Rightarrow y \\geq x-2 $ (dividing by $ -1 $ flips ' +
      'the sign; solid, shade above/on).\n\n' +
      'Both together require $ x-2 \\leq y \\leq 6-x $, which only makes sense while $ x-2 \\leq 6-x $, i.e. ' +
      '$ x \\leq 4 $. The solution is the wedge-shaped overlap of the two half-planes, running off ' +
      'unboundedly toward smaller $ x $.'),
    num('Practice · Systems of Inequalities',
      'Find the vertices of the feasible region for the system: $ x + 2y \\leq 10 $, $ x - y \\geq -4 $, $ y \\geq 0 $.',
      '$ (-4, 0),\\ (10, 0),\\ \\left(\\frac{2}{3}, \\frac{14}{3}\\right) $',
      'Rewrite each in $ y $-form.\n\n' +
      '$ x+2y\\leq10 \\Rightarrow y \\leq \\frac{10-x}{2} $.\n\n' +
      '$ x-y\\geq-4 \\Rightarrow -y\\geq-4-x \\Rightarrow y \\leq x+4 $ (dividing by $ -1 $ flips the sign).\n\n' +
      '$ y \\geq 0 $.\n\n' +
      'Check every pair of boundary lines against the third condition.\n\n' +
      '$ \\frac{10-x}{2}=x+4 \\Rightarrow 10-x=2x+8 \\Rightarrow x=\\frac{2}{3},\\ y=\\frac{14}{3} $. Check ' +
      '$ y\\geq0 $ ✓. **Vertex $ \\left(\\frac{2}{3},\\frac{14}{3}\\right) $.**\n\n' +
      '$ \\frac{10-x}{2}=0 \\Rightarrow x=10,\\ y=0 $. Check $ y\\leq x+4 $: $ 0\\leq14 $ ✓. **Vertex $ (10,0) $.**\n\n' +
      '$ x+4=0 \\Rightarrow x=-4,\\ y=0 $. Check $ y\\leq \\frac{10-x}{2} $: $ 0 \\leq 7 $ ✓. **Vertex $ (-4,0) $.**\n\n' +
      'All three checks pass, so the feasible region is a bounded triangle with these three vertices.'),
    num('Practice · Systems of Inequalities',
      'Does the point $ (1, 1) $ satisfy the system $ 2x + y < 8 $ and $ x - 3y > -6 $?',
      'Yes',
      'Check each inequality separately.\n\n' +
      'First: $ 2(1)+1 = 3 $. Is $ 3 < 8 $? Yes.\n\n' +
      'Second: $ 1 - 3(1) = -2 $. Is $ -2 > -6 $? Yes.\n\n' +
      'Both hold, so $ (1,1) $ satisfies the system.'),
    num('Practice · Systems of Inequalities',
      'Describe the solution of the system: $ 3x - 2y < 6 $ and $ x + y > 1 $.',
      'All points with $ y > \\frac{3x-6}{2} $ AND $ y > 1-x $ — an unbounded region opening upward',
      '**First:** $ 3x-2y<6 \\Rightarrow -2y<6-3x \\Rightarrow y > \\frac{3x-6}{2} $ (dividing by $ -2 $ flips ' +
      'the sign).\n\n' +
      '**Second:** $ x+y>1 \\Rightarrow y>1-x $.\n\n' +
      'Both are lower bounds on $ y $, so the system’s solution is everywhere **above both** lines at once — ' +
      'an unbounded region opening upward, bounded below by whichever of the two lines is higher at each $ x $.'),
  ],
);

const practicePage = {
  slug: 'linear-inequalities-practice-ncert',
  title: 'Practice — NCERT-Style Exercises',
  subtitle: 'One-variable rules, word problems, single-region graphs and systems — 23 fully worked exercises across 4 revision themes.',
  page_number: 6,
  page_type: 'lesson',
  blocks: [
    b('image', 0, {
      src: '', alt: 'A grid of solved inequality problems glowing on a dark background', caption: '',
      width: 'full', aspect_ratio: '16:5',
      generation_prompt:
        'Ultra-wide cinematic banner (16:5). A tidy grid of glowing hand-worked inequality problems — a ' +
        'number line with an open circle, a shaded half-plane, two overlapping shaded regions forming a ' +
        'triangle — arranged like flash-cards on a deep near-black background, with a pen mid-stroke solving ' +
        'one of them. Violet, amber and sky-blue glow, elegant graphing-poster style, no readable text.',
    }),
    b('text', 1, {
      markdown:
        'You have read the chapter — now **drill it**. Below are **23 NCERT-style exercises** for this ' +
        'chapter, regrouped by idea rather than in textbook order, so each cluster hammers one skill.\n\n' +
        '*A note on sourcing:* no scanned copy of this chapter was available while building this practice ' +
        'set, so these are carefully hand-verified problems in the chapter’s canonical NCERT style rather ' +
        'than a page-for-page transcription — every number here has been checked by direct substitution.\n\n' +
        'Try every question on paper **first**. Only then tap to open the worked solution — the struggle ' +
        'before you peek is what makes it stick.',
    }),
    b('practice_bank', 2, {
      title: 'Practice · Linear Inequalities',
      intro:
        'Pick a theme on the left. Each question carries a source tag; tap a question to reveal a full, ' +
        'step-by-step worked solution in plain language.',
      sections: [s1, s2, s3, s4],
    }),
  ],
};

module.exports = { practicePage };

if (require.main === module) {
  (async () => {
    await withDb(async (db) => {
      const bookId = await ensureBookAndChapter(db);
      await insertPages(db, bookId, [practicePage]);
    });
    const total = [s1, s2, s3, s4].reduce((n, s) => n + s.items.length, 0);
    console.log(`practice page DONE (unpublished) · ${[s1, s2, s3, s4].length} sections · ${total} questions.`);
  })().catch((e) => { console.error(e); process.exit(1); });
}
