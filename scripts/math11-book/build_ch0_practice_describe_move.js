'use strict';
/* Class 11 Math · Ch.0 "Meet the Graphs" — PRACTICE page 2 of 2: "Describe the
   Move". A practice_bank of 20 text MCQs across 4 themes (reading a shift,
   stretch/compress/reflect, domain & range under a transform, spot the base
   shape + move) — the question TYPES take inspiration from Thomas' Calculus
   §1.2 (Figs 1.29-1.34, Examples 3-5, Exercises 1.2 27-36/57-58/59-68/69-76),
   but every number, function and piece of wording below is original, not
   copied. NO visible source badge (founder policy, 2026-07-24): the platform
   only cites NCERT / NCERT Exemplar / CBSE PYQ / JEE Main PYQ to students —
   never any other reference book, even one that's been substantially
   adapted. `source:'mcq'` with source_label OMITTED renders the generic
   "MCQ" badge (see PracticeBankRenderer.tsx's SOURCE_META). The Thomas
   inspiration is noted here, in this comment, for internal traceability only.
   Additive + idempotent. published:false.
   Run: node scripts/math11-book/build_ch0_practice_describe_move.js */
const { b, withDb } = require('./_book');
const { v4: uuidv4 } = require('uuid');

const mcq = (prompt, options, correct_index, explanation) =>
  ({ id: uuidv4(), kind: 'mcq', source: 'mcq', prompt, options, correct_index, explanation });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ── Theme A — Reading the shift ──────────────────────────────────────────── */
const sA = sec(
  'Reading the shift',
  'Inside the bracket vs. outside it — the one distinction that decides everything.',
  [
    mcq('The graph of $ y = f(x) $ is transformed to $ y = f(x) + 4 $. Which way does it move?',
      ['4 units up', '4 units right', '4 units down', '4 units left'], 0,
      'Adding OUTSIDE the function shifts every output up by 4 — a plain vertical move (option A). Nothing ' +
      'inside the bracket changed, so there is no left/right shift at all.'),
    mcq('Which transformation produces $ y = f(x - 5) $ from $ y = f(x) $?',
      ['Shift 5 units up', 'Shift 5 units down', 'Shift 5 units right', 'Shift 5 units left'], 2,
      'This is the classic reversal: $ x - 5 $ INSIDE the bracket shifts the graph 5 units to the RIGHT ' +
      '(option C), not left. A change inside always goes the opposite way to your first instinct.'),
    mcq('Starting from $ y = x^3 $, which equation shifts the graph LEFT 2 and UP 3?',
      ['$ y = (x-2)^3 + 3 $', '$ y = (x+2)^3 - 3 $', '$ y = (x-2)^3 - 3 $', '$ y = (x+2)^3 + 3 $'], 3,
      'Left 2 means replacing x with $ x + 2 $ inside the cube. Up 3 means adding 3 outside. Put both together: ' +
      '$ y = (x+2)^3 + 3 $ — option D.'),
    mcq('A parabola $ y = x^2 $ is shifted so its vertex moves from $ (0,0) $ to $ (-3, 5) $. Which equation matches?',
      ['$ y = (x+3)^2 + 5 $', '$ y = (x-3)^2 + 5 $', '$ y = (x+3)^2 - 5 $', '$ y = (x-3)^2 - 5 $'], 0,
      'A vertex at $ (-3, 5) $ means: left 3 (replace x with $ x+3 $) and up 5 (add 5 outside). So ' +
      '$ y = (x+3)^2 + 5 $ — option A.'),
    mcq('If $ y = f(x+2) - 1 $ is the graph of $ y = f(x) $ moved, which move is it?',
      ['Right 2, up 1', 'Left 2, down 1', 'Right 2, down 1', 'Left 2, up 1'], 1,
      'Inside, $ +2 $ shifts the graph LEFT 2 (the reversal trap: a plus sign inside moves left, not right). ' +
      'Outside, $ -1 $ shifts it down 1 — option B, "left 2, down 1".'),
  ],
);

/* ── Theme B — Stretch, compress & reflect ────────────────────────────────── */
const sB = sec(
  'Stretch, compress & reflect',
  'Multiplying the output vs. multiplying the input — two different moves that are easy to swap by mistake.',
  [
    mcq('$ y = f(x) $ is stretched vertically by a factor of 4. Which equation is the result?',
      ['$ y = f(4x) $', '$ y = f(x/4) $', '$ y = 4f(x) $', '$ y = f(x)/4 $'], 2,
      'Multiplying the OUTPUT by 4 (a factor outside f) stretches the graph vertically — option C. Multiplying ' +
      'x INSIDE the function instead changes the horizontal scaling — a different move entirely.'),
    mcq('How does $ y = f(3x) $ compare to $ y = f(x) $?',
      ['Vertical stretch by a factor of 3', 'Horizontal compression by a factor of 3',
        'Vertical compression by a factor of 3', 'Horizontal stretch by a factor of 3'], 1,
      'Multiplying x by a number greater than 1 INSIDE the function squeezes the graph horizontally by that ' +
      'factor — the same output now appears at a smaller x, so the whole curve compresses toward the y-axis ' +
      '(option B).'),
    mcq('Which equation reflects $ y = \\sqrt{x} $ across the x-axis?',
      ['$ y = -\\sqrt{x} $', '$ y = \\sqrt{-x} $', '$ y = \\sqrt{x} - 1 $', '$ y = -\\sqrt{-x} $'], 0,
      'Reflecting across the x-axis flips the sign of the OUTPUT: $ y = -f(x) $ — option A. Reflecting across ' +
      'the y-axis instead flips the sign of x INSIDE the function: $ y = f(-x) $ — a different mirror line ' +
      'entirely.'),
    mcq('$ y = |x| $ is reflected across the y-axis. What happens to its graph?',
      ['It shifts right by 2', 'Nothing changes — it lands exactly on itself',
        'It becomes a completely different shape', 'It flips upside down'], 1,
      'Reflecting across the y-axis replaces x with $ -x $: $ |-x| = |x| $, since absolute value never cares ' +
      'about sign. So the reflected graph lands exactly on the original (option B) — this happens for every ' +
      'EVEN function, and $ |x| $ is even.'),
    mcq('How does $ y = -f(-x) $ compare to $ y = f(x) $?',
      ['Reflected across the y-axis only', 'No change', 'Reflected across the x-axis only',
        'A 180° rotation about the origin (both axes reflected at once)'], 3,
      'The $ -x $ inside reflects across the y-axis; the leading minus outside then reflects that result across ' +
      'the x-axis too. Doing both together is exactly the same as spinning the whole graph 180° about the ' +
      'origin — option D.'),
  ],
);

/* ── Theme C — Domain & range under a transform ──────────────────────────── */
const sC = sec(
  'Domain & range under a transform',
  'Given f(x) = x(2 − x) with domain [0, 2] and range [0, 1] — no formula needed to answer, just the rule.',
  [
    mcq('For $ f(x) = x(2-x) $ with domain $ [0, 2] $ and range $ [0, 1] $, what is the domain of $ y = f(x) + 5 $?',
      ['$ [-5, -3] $', '$ [0, 2] $', '$ [5, 7] $', '$ [0, 6] $'], 1,
      'Adding outside the function only shifts the OUTPUT — the range. It never touches the input, so the ' +
      'domain stays exactly $ [0, 2] $ (option B) — only the range shifts, to $ [5, 6] $.'),
    mcq('For the same $ f $, what is the RANGE of $ y = f(x) + 5 $?',
      ['$ [0, 1] $', '$ [5, 7] $', '$ [0, 6] $', '$ [5, 6] $'], 3,
      'Every output shifts up by 5: $ [0, 1] $ becomes $ [5, 6] $ — option D.'),
    mcq('For the same $ f $, what is the domain of $ y = f(x - 3) $?',
      ['$ [0, 2] $', '$ [-3, -1] $', '$ [3, 5] $', '$ [0, 5] $'], 2,
      'A horizontal shift moves the DOMAIN, not the range. Shifting right by 3 moves $ [0, 2] $ to $ [3, 5] $ ' +
      '— option C. The range is untouched — still $ [0, 1] $.'),
    mcq('For the same $ f $, what is the range of $ y = 2f(x) $?',
      ['$ [0, 1] $', '$ [-2, 0] $', '$ [0, 2] $', '$ [0, 4] $'], 2,
      'Multiplying the output by 2 stretches the range: $ [0, 1] $ becomes $ [0, 2] $ — option C. The domain ' +
      'is untouched — still $ [0, 2] $.'),
    mcq('For the same $ f $, what is the range of $ y = -f(x) $?',
      ['$ [-2, -1] $', '$ [0, 1] $', '$ [1, 2] $', '$ [-1, 0] $'], 3,
      'Negating the output flips the range top-to-bottom about 0: $ [0, 1] $ becomes $ [-1, 0] $ — option D. ' +
      'The domain stays $ [0, 2] $.'),
  ],
);

/* ── Theme D — Spot the base shape + the move ─────────────────────────────── */
const sD = sec(
  'Spot the base shape + the move',
  'Read a formula and name (a) which of the 5 base shapes it started from, and (b) exactly how it was moved.',
  [
    mcq('$ y = (x - 1)^3 + 2 $ is built by taking which base shape, and moving it how?',
      ['$ y = x^3 $, shifted right 1 and up 2', '$ y = |x| $, shifted right 1 and up 2',
        '$ y = x^3 $, shifted left 1 and up 2', '$ y = x^2 $, shifted right 1 and up 2'], 0,
      'The cube tells you the base shape is $ y = x^3 $. Inside, $ (x-1) $ shifts right 1; outside, $ +2 $ ' +
      'shifts up 2 — option A.'),
    mcq('$ y = -\\sqrt{x + 4} $ is built from which base shape, with which moves?',
      ['$ y = x^2 $, shifted left 4 and reflected',
        '$ y = \\sqrt{x} $, shifted right 4, no reflection',
        '$ y = \\sqrt{x} $, shifted left 4 and reflected across the x-axis',
        '$ y = \\sqrt{x} $, shifted left 4, no reflection'], 2,
      'The base shape is $ \\sqrt{x} $. Inside, $ +4 $ shifts left 4. The leading minus sign, OUTSIDE the ' +
      'root, reflects the whole result across the x-axis — option C.'),
    mcq('$ y = \\dfrac{1}{x+2} - 3 $ is built from $ y = \\dfrac{1}{x} $ with which moves?',
      ['Right 2, up 1', 'Left 2, down 3', 'Right 2, down 3', 'Left 2, up 3'], 1,
      'Inside, $ +2 $ shifts left 2 — the vertical asymptote moves from $ x=0 $ to $ x=-2 $. Outside, $ -3 $ ' +
      'shifts down 3 — the horizontal asymptote moves from $ y=0 $ to $ y=-3 $. Option B.'),
    mcq('Which equation is $ y = \\sqrt{x} $ horizontally COMPRESSED by a factor of 2?',
      ['$ y = \\sqrt{2x} $', '$ y = \\sqrt{x}/2 $', '$ y = \\sqrt{x/2} $', '$ y = 2\\sqrt{x} $'], 0,
      'Horizontal compression by a factor c multiplies x by c INSIDE: $ \\sqrt{2x} $ — option A. Note this is ' +
      'NOT the same as $ 2\\sqrt{x} $ — scaling inside and outside are different moves that only happen to ' +
      'coincide for pure power functions like $ x^2 $ or $ x^3 $, never for a square root.'),
    mcq('Which base shape and move produces $ y = (x/3)^2 $?',
      ['$ y = x^2 $, horizontally compressed by a factor of 3', '$ y = x^3 $, stretched by a factor of 3',
        '$ y = x^2 $, vertically compressed by a factor of 3', '$ y = x^2 $, horizontally stretched by a factor of 3'], 3,
      'Dividing x by 3 INSIDE stretches the graph horizontally by a factor of 3 — it now takes 3 times the ' +
      'x-distance to reach the same height (option D). (Since $ (x/3)^2 = x^2/9 $, this also happens to look ' +
      'identical to a vertical compression by 9 — a coincidence special to power functions, but the move ' +
      'actually performed is a horizontal stretch.)'),
  ],
);

const blocks = [
  b('image', 0, {
    src: '', alt: 'A single graph shape being described in words on a dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A single glowing curve with faint annotated arrows pointing left, ' +
      'right, up, down, and a mirror-flip symbol around it — the idea of describing a graph\'s move in words ' +
      'rather than drawing it. Violet curve, amber annotation arrows, deep near-black background, elegant ' +
      'graphing-poster style, no readable text.',
  }),
  b('text', 1, {
    markdown:
      'The last page tested whether you can **spot** a graph. This one tests whether you can **describe** one — ' +
      'read a formula and say exactly which shape it started from and how it moved, in words, before you ever ' +
      'touch a pencil.\n\n' +
      'Twenty questions, four themes. Try each on paper first — say the move out loud (*"left 3, down 1"*) — ' +
      'then check.',
  }),
  b('practice_bank', 2, {
    title: 'Describe the Move',
    intro: 'Pick a theme on the left. Every question is about reading a transformation, not calculating a number.',
    sections: [sA, sB, sC, sD],
  }),
];

const PAGE = {
  slug: 'describe-the-move',
  title: 'Practice — Describe the Move',
  subtitle: 'Twenty questions on reading a shift, stretch, compression or reflection straight from the formula.',
  page_number: 8,
  blocks,
};

module.exports = { blocks, PAGE };

if (require.main === module) {
  (async () => {
    await withDb(async (db) => {
      const book = await db.collection('books').findOne({ slug: 'class11-mathematics' });
      if (!book) throw new Error('book not found — run _book.js scaffold first');
      const pages = db.collection('book_pages');
      const books = db.collection('books');
      const now = new Date();
      const existing = await pages.findOne({ book_id: book._id, slug: PAGE.slug });
      if (existing) { console.log('page exists, skipping:', PAGE.slug); return; }
      const { computeReadingTime, computeContentTypes } = require('../lib/book-writer');
      const doc = {
        _id: uuidv4(), book_id: book._id,
        chapter_number: 0, page_number: PAGE.page_number,
        slug: PAGE.slug, title: PAGE.title, subtitle: PAGE.subtitle,
        blocks, page_type: 'lesson', published: false,
        reading_time_min: computeReadingTime(blocks),
        content_types: computeContentTypes(blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      };
      await pages.insertOne(doc);
      console.log('created page 8 ·', PAGE.slug, '·', doc.reading_time_min, 'min ·', doc.content_types.join('/'));
      const all = await pages.find({ book_id: book._id, chapter_number: 0, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
      all.sort((a, c) => a.page_number - c.page_number);
      await books.updateOne(
        { _id: book._id, 'chapters.slug': 'meet-the-graphs' },
        { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } },
      );
      console.log('chapter page_ids set:', all.length, 'pages');
    });
    const total = [sA, sB, sC, sD].reduce((n, s) => n + s.items.length, 0);
    console.log(`describe-the-move DONE (unpublished) · ${[sA, sB, sC, sD].length} sections · ${total} questions.`);
  })().catch((e) => { console.error(e); process.exit(1); });
}
