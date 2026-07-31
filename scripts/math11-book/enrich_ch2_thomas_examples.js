'use strict';
/* Class 11 Math · Ch.2 "Relations and Functions" — enrichment pass (founder
   request, 2026-07-24): richer content + more questions, mining Thomas'
   Calculus §1.1 "Functions and Their Graphs" for genuinely good examples (not
   copied — the underlying idea taken, wording/numbers original where a new
   instance was needed; Thomas's own numbers kept where the example itself
   IS the point, e.g. the domain/range table). NO student-facing attribution
   is added anywhere (founder policy) — these are folded in as the book's own
   worked examples/callouts, same as every existing NCERT-sourced one.
   Plain, simple language throughout — no dressed-up vocabulary.

   Four additions, each fixing a real gap rather than padding:
   1. Page 3 (what-makes-a-function): the SAME circle already used for the
      vertical-line test turns out to have two functions hiding inside it
      once you split it in half (Thomas Fig 1.7b/c) — directly deepens the
      VLT lesson using content already on the page.
   2. Page 4 (domain-range-function-machine): "four ways to see a function"
      framing (formula/graph/table/words — Thomas's own opening framing,
      which this book never stated explicitly) + the tuning-fork pressure
      table as the "numerical" case (Thomas Example 3) + the domain-range
      table extended with x² and √(1−x²) (Thomas Example 1's last 2 rows —
      ties straight back to the circle/semicircle motif from page 3).
   3. Page 5 (function-zoo-lines-powers): a quick, useful note that odd
      roots (cube root) accept negative numbers but even roots (square
      root) don't — Thomas §1.1(c), a real domain distinction this chapter
      never made explicit.
   4. Page 7 (algebra-of-functions): the existing worked example (f=x²,
      g=2x+1) has NO domain restriction, so the "take the overlap" rule for
      combining functions is never actually put to the test. Thomas's own
      f=√x, g=√(1−x) example (§1.2 Example 1) has a real, visible domain
      restriction on both sides — the strongest single addition here.

   Every new quiz/example question's correct answer sits at a DIFFERENT
   option position than that quiz's existing pattern (checked per-block,
   not just per-batch) — see feedback_mcq_answer_position_spread memory.

   Additive-only (no block removed anywhere), applied via the sanctioned
   book-writer gateway, versioned.
   Run: node scripts/math11-book/enrich_ch2_thomas_examples.js        (commits)
        node scripts/math11-book/enrich_ch2_thomas_examples.js --dry  (dry-run) */
const bw = require('../lib/book-writer');
const { withDb } = bw;
const { v4: uuidv4 } = require('uuid');

const DRY = process.argv.includes('--dry');

async function patchPage(db, slug, mutate, summary) {
  const page = await db.collection('book_pages').findOne({ slug });
  if (!page) throw new Error('page not found: ' + slug);
  const out = mutate(page.blocks.map((b) => ({ ...b })));
  out.sort((a, b) => a.order - b.order);
  const res = await bw.savePage(db, { pageId: page._id }, out, { author: 'agent', summary, dryRun: DRY });
  console.log(DRY
    ? `[dry] ${slug}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (was ${page.blocks.length} blocks, now ${out.length})`
    : `✓ ${slug}: v${res.version} · now ${out.length} blocks (was ${page.blocks.length})`);
}

/* ── Page 3 — what-makes-a-function: the semicircle insight ──────────────── */
function patchPage3(blocks) {
  if (blocks.some((b) => b.title === 'Half a circle is a different story')) return blocks; // already applied
  const shifted = blocks.map((b) => (b.order >= 6 ? { ...b, order: b.order + 1 } : b));
  shifted.push({
    id: uuidv4(), type: 'worked_example', order: 6,
    label: 'Half a circle is a different story', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'The full circle $ x^2 + y^2 = 9 $ just failed the vertical-line test — it is not a function. Is the ' +
      'UPPER half of that same circle, $ y = \\sqrt{9 - x^2} $, a function?',
    solution: 'Yes. Solving for y and keeping only the POSITIVE square root gives $ y = \\sqrt{9 - x^2} $. Now every ' +
      'x between $ -3 $ and $ 3 $ gives exactly ONE y — the positive one. One input, one output: that is a function.\n\n' +
      'The LOWER half, $ y = -\\sqrt{9 - x^2} $, is a different function — same shape, all outputs negative.\n\n' +
      'Splitting the circle in two is exactly what fixes it: a full circle gives two y-values per x (fails the ' +
      'test), but each half on its own gives only one (passes it).',
  });
  const withQuiz = shifted.map((b) => {
    if (b.type !== 'inline_quiz') return b;
    return {
      ...b,
      questions: [
        ...b.questions,
        {
          id: uuidv4(),
          question: 'The full circle $ x^2 + y^2 = 9 $ is not a function. Is its upper half, $ y = \\sqrt{9 - x^2} $, a function?',
          options: ['No — it still fails the vertical-line test', 'It depends on the radius', 'Yes — each x gives exactly one y', 'Only for x = 0'],
          correct_index: 2,
          explanation: 'Yes. Keeping only the positive square root gives one y for every x from −3 to 3 — one input, ' +
            'one output. Splitting the circle in half is exactly what turns a two-output relation into a function.',
          difficulty_level: 2,
        },
      ],
    };
  });
  return withQuiz;
}

/* ── Page 4 — domain-range-function-machine: 4 representations + extended table ── */
function patchPage4(blocks) {
  if (blocks.some((b) => b.type === 'text' && /Four ways to see a function/.test(b.markdown || ''))) return blocks;

  // Insert 2 new blocks (text framing + real_world callout) right after the
  // domain/codomain/range intro text (order 2), before the C→F graph.
  const shifted = blocks.map((b) => (b.order >= 3 ? { ...b, order: b.order + 2 } : b));
  shifted.push(
    {
      id: uuidv4(), type: 'text', order: 3,
      markdown:
        '**Four ways to see a function.** A function can show up wearing four different disguises — they are ' +
        'all the same idea underneath:\n\n' +
        '- **A formula** — like $ F = \\tfrac{9}{5}C + 32 $.\n' +
        '- **A graph** — a curve, like the one below.\n' +
        '- **A table of numbers** — just a list of input-output pairs.\n' +
        '- **Plain words** — "the temperature in Fahrenheit."\n\n' +
        'Whichever disguise it wears, it is still one machine: one input, one output.',
    },
    {
      id: uuidv4(), type: 'callout', order: 4,
      variant: 'real_world', title: 'A Function Made Only of Numbers',
      markdown:
        'A tuning fork makes a musical note by pushing the air back and forth. If you record the air pressure ' +
        'at thousands of tiny moments in time, you get a long table: time in one column, pressure in the other. ' +
        'No formula was ever written down — but it is still a function. Plot the table and join the dots with a ' +
        'smooth curve, and out comes a wave-shaped graph. One moment in time, one pressure reading: a function, ' +
        'built entirely out of a table of numbers.',
    },
  );

  // Extend the existing "Reading a natural domain" worked_example with two
  // more parts from the same Thomas table (x² and √(1−x²)) — the second one
  // ties straight back to the circle/semicircle on the previous page.
  const withExtendedExample = shifted.map((b) => {
    if (b.type !== 'worked_example' || b.label !== 'Reading a natural domain') return b;
    return {
      ...b,
      problem: 'Find the natural domain and range of each: (a) $ y = \\sqrt{x} $  (b) $ y = \\dfrac{1}{x} $  ' +
        '(c) $ y = \\sqrt{4 - x} $  (d) $ y = x^2 $  (e) $ y = \\sqrt{1 - x^2} $.',
      solution:
        '(a) $ \\sqrt{x} $ needs $ x \\ge 0 $. Domain $ [0, \\infty) $; outputs are never negative, so range $ [0, \\infty) $.\n\n' +
        '(b) $ \\tfrac{1}{x} $ dies only at $ x = 0 $. Domain: all reals except 0; range: all reals except 0.\n\n' +
        '(c) Need $ 4 - x \\ge 0 $, i.e. $ x \\le 4 $. Domain $ (-\\infty, 4] $; range $ [0, \\infty) $.\n\n' +
        '(d) $ x^2 $ never causes trouble — square any real number and you get a real answer. Domain: all reals. ' +
        'A square is never negative, so range $ [0, \\infty) $.\n\n' +
        '(e) Need $ 1 - x^2 \\ge 0 $, i.e. $ -1 \\le x \\le 1 $. Domain $ [-1, 1] $ — this is exactly the upper half of ' +
        'a circle of radius 1! Its output runs from 0 up to 1, so range $ [0, 1] $.\n\n' +
        '**The move:** set the inside of a square root $ \\ge 0 $, and set any denominator $ \\ne 0 $.',
    };
  });

  const withQuiz = withExtendedExample.map((b) => {
    if (b.type !== 'inline_quiz') return b;
    return {
      ...b,
      questions: [
        ...b.questions,
        {
          id: uuidv4(),
          question: 'What is the domain of $ y = \\sqrt{1 - x^2} $?',
          options: ['$ x \\ne \\pm 1 $', 'all real numbers', '$ [0, 1] $', '$ [-1, 1] $'],
          correct_index: 3,
          explanation: 'Need $ 1 - x^2 \\ge 0 $, i.e. $ x^2 \\le 1 $, i.e. $ -1 \\le x \\le 1 $. This is the domain of ' +
            'the upper half of the unit circle.',
          difficulty_level: 2,
        },
      ],
    };
  });
  return withQuiz;
}

/* ── Page 5 — function-zoo-lines-powers: odd root vs even root domain ────── */
function patchPage5(blocks) {
  if (blocks.some((b) => b.variant === 'remember' && /odd root/i.test(b.markdown || ''))) return blocks;
  const shifted = blocks.map((b) => (b.order >= 5 ? { ...b, order: b.order + 1 } : b));
  shifted.push({
    id: uuidv4(), type: 'callout', order: 5,
    variant: 'remember', title: 'Remember',
    markdown:
      'Not every root behaves the same way. $ \\sqrt{x} $ (an **even** root) refuses negative inputs — ' +
      '$ \\sqrt{-8} $ is not a real number. But $ \\sqrt[3]{x} $ (an **odd** root) does not mind negatives at all: ' +
      '$ \\sqrt[3]{-8} = -2 $, since $ (-2)^3 = -8 $. So the domain of $ x^{1/2} $ is $ [0, \\infty) $, but the domain ' +
      'of $ x^{1/3} $ is all of $ \\mathbb{R} $.',
  });
  const withQuiz = shifted.map((b) => {
    if (b.type !== 'inline_quiz') return b;
    return {
      ...b,
      questions: [
        ...b.questions,
        {
          id: uuidv4(),
          question: 'Which of these is a real number?',
          options: ['$ \\sqrt{-8} $', 'Both', 'Neither', '$ \\sqrt[3]{-8} $'],
          correct_index: 3,
          explanation: 'Even roots (square root, 4th root, …) reject negative inputs — $ \\sqrt{-8} $ is not real. ' +
            'Odd roots (cube root, 5th root, …) are fine with negatives: $ \\sqrt[3]{-8} = -2 $, since $ (-2)^3 = -8 $.',
          difficulty_level: 2,
        },
      ],
    };
  });
  return withQuiz;
}

/* ── Page 7 — algebra-of-functions: an example where domain actually restricts ── */
function patchPage7(blocks) {
  if (blocks.some((b) => b.label === 'When domains actually restrict things')) return blocks;
  const shifted = blocks.map((b) => (b.order >= 5 ? { ...b, order: b.order + 1 } : b));
  shifted.push({
    id: uuidv4(), type: 'worked_example', order: 5,
    label: 'When domains actually restrict things', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Let $ f(x) = \\sqrt{x} $ and $ g(x) = \\sqrt{1 - x} $. Find $ (f + g)(x) $ and its domain.',
    solution:
      'Pin down each domain on its own first. $ f $ needs $ x \\ge 0 $, so $ D(f) = [0, \\infty) $. $ g $ needs ' +
      '$ 1 - x \\ge 0 $, so $ D(g) = (-\\infty, 1] $.\n\n' +
      'A sum needs BOTH parts defined, so the domain is the overlap: $ [0, \\infty) \\cap (-\\infty, 1] = [0, 1] $.\n\n' +
      '$ (f + g)(x) = \\sqrt{x} + \\sqrt{1 - x} $ — but only for x **between 0 and 1**. Outside that, the formula does ' +
      'not even make sense.\n\n' +
      '**Why this one is worth remembering:** the earlier example ($ f = x^2 $, $ g = 2x + 1 $) had no domain ' +
      'restriction at all, so the "take the overlap" rule was invisible — nothing was ever excluded. Here, each ' +
      'piece genuinely blocks off part of the number line, and the overlap is a short, visible stretch. This is ' +
      'exactly what the domain rule is protecting you from.',
  });
  const withQuiz = shifted.map((b) => {
    if (b.type !== 'inline_quiz') return b;
    return {
      ...b,
      questions: [
        ...b.questions,
        {
          id: uuidv4(),
          question: 'If $ f(x) = \\sqrt{x - 2} $ has domain $ [2, \\infty) $ and $ g(x) = \\sqrt{6 - x} $ has domain ' +
            '$ (-\\infty, 6] $, what is the domain of $ (f + g)(x) $?',
          options: ['$ [0, \\infty) $', '$ (-\\infty, 6] $', '$ [2, 6] $', '$ [2, \\infty) $'],
          correct_index: 2,
          explanation: 'A sum needs both f and g defined, so take the overlap: $ [2, \\infty) \\cap (-\\infty, 6] = [2, 6] $.',
          difficulty_level: 3,
        },
      ],
    };
  });
  return withQuiz;
}

(async () => {
  await withDb(async (db) => {
    await patchPage(db, 'what-makes-a-function', patchPage3,
      'add the semicircle-is-a-function worked example (Thomas Fig 1.7) + a matching quiz question');
    await patchPage(db, 'domain-range-function-machine', patchPage4,
      'add "four ways to see a function" framing + tuning-fork real_world callout (Thomas Ex.3) + extend the domain table with x²/√(1-x²) (Thomas Ex.1) + a matching quiz question');
    await patchPage(db, 'function-zoo-lines-powers', patchPage5,
      'add odd-root-vs-even-root domain note (Thomas §1.1c) + a matching quiz question');
    await patchPage(db, 'algebra-of-functions', patchPage7,
      'add a domain-intersection worked example with an actual restriction (Thomas §1.2 Ex.1) + a matching quiz question');
  });
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
