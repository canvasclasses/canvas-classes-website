'use strict';
/* Class 11 Math · Ch.0 "Meet the Graphs" — PRACTICE page 1 of 2: "Spot the Right
   Graph". 10 gradable visual-recognition questions using the new math_graph
   `identify` field (block.identify: prompt + correct_index + explanation). Each
   question renders 4 candidate curves in one shared spec-mode board, letter-
   labelled ONLY (A/B/C/D — never the equation), spanning every base shape from
   this chapter (line/parabola, cubic, |x|, 1/x, √x) and every transform move
   (vertical shift, horizontal shift, stretch/compress, both reflections), plus
   two "abstract function" questions using a shared bump f(x) = x(2−x) so a
   student learns to reason about a transform WITHOUT a formula crutch — adapted
   from Thomas' Calculus §1.2 Figs 1.29–1.34 / Examples 3–5 (own numbers, not
   copied). Correct-letter positions are deliberately spread (A×3, B×3, C×2,
   D×2) so there's no position tell.
   Additive + idempotent. published:false.
   Run: node scripts/math11-book/build_ch0_practice_spot_graph.js */
const { b, ensureBookAndChapter, insertPages, withDb } = require('./_book');

const CH0 = { number: 0 }; // chapter 0 override — insertPages uses ../_book's CH by default

/* identify-mode math_graph factory: 4 lettered curves + a gradable prompt */
const identifyGraph = (order, title, caption, bounds, keepSquare, curves, prompt, correctIndex, explanation) =>
  b('math_graph', order, {
    title, caption,
    spec: {
      bounds,
      // 'emerald' (not 'sky') for B — cyan sat too close to the violet A swatch to
      // tell apart at a glance (founder catch, 2026-07-24).
      functions: curves.map((c, i) => ({ expr: c, color: ['violet', 'emerald', 'amber', 'pink'][i], label: 'ABCD'[i] })),
      showGrid: true, showAxes: true, keepSquare,
    },
    identify: { prompt, correct_index: correctIndex, explanation },
  });

const blocks = [
  b('image', 0, {
    src: '', alt: 'Four colour-coded curves on a dark grid, one highlighted as correct', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Four candidate curves in violet, sky-blue, amber and pink laid over ' +
      'one dark grid, with a glowing checkmark hovering over the correct one and a faint question mark over the ' +
      'others — the idea of picking the right graph from several look-alikes. Deep near-black background, ' +
      'elegant graphing-poster style, no readable text.',
  }),
  b('text', 1, {
    markdown:
      'Here is a skill exams actually test: **reading** a graph, not drawing one. If you solve a problem and ' +
      'sketch it in your rough book, nobody can check whether your sketch was right. But if you can look at four ' +
      'curves and *point to the correct one*, that is a skill we can grade — and it is exactly what a "which of ' +
      'the following graphs…" JEE question demands.\n\n' +
      'Below, every curve is labelled only **A, B, C, D** — no equations shown until you answer. Read the shape, ' +
      'the shift, the direction — then pick.',
  }),
  b('text', 2, { markdown: '**Lines & parabolas**' }),
  identifyGraph(3, 'Which curve is y = x² − 2?', 'Same parabola, four different vertical positions.',
    { xmin: -3, xmax: 3, ymin: -3, ymax: 9 }, false,
    ['x^2-2', 'x^2+1', 'x^2', 'x^2+2'],
    'Which curve is $ y = x^2 - 2 $?', 0,
    'A is $ x^2 - 2 $ (shifted down 2 — the only one dipping below the x-axis). B is $ x^2 + 1 $, C is the ' +
    'plain $ x^2 $, and D is $ x^2 + 2 $. Adding outside the square only slides the parabola up or down — the ' +
    'shape never changes.'),
  identifyGraph(4, 'Which curve is y = (x + 3)²?', 'Same parabola, four different vertex positions — mind the sign.',
    { xmin: -6, xmax: 5, ymin: -2, ymax: 10 }, false,
    ['(x-2)^2', '(x+3)^2', 'x^2', '(x-1)^2'],
    'Which curve is $ y = (x + 3)^2 $?', 1,
    'B is $ (x+3)^2 $ — its vertex sits at $ x = -3 $, three units LEFT of the origin (the classic reversal: ' +
    '"+3 inside" moves left, not right). A is $ (x-2)^2 $ (vertex at 2), C is plain $ x^2 $ (vertex at 0), and ' +
    'D is $ (x-1)^2 $ (vertex at 1).'),
  b('text', 5, { markdown: '**Cubics & the modulus V**' }),
  identifyGraph(6, 'Which curve is y = (x + 1)³ − 1?', 'Every curve is x³, shifted to a different resting point.',
    { xmin: -4, xmax: 4, ymin: -8, ymax: 8 }, false,
    ['x^3', '(x-1)^3+1', '(x+1)^3-1', '(x+1)^3+1'],
    'Which curve is $ y = (x + 1)^3 - 1 $?', 2,
    'C is $ (x+1)^3 - 1 $ — its inflection point (where it flattens then keeps climbing) sits at $ (-1, -1) $: ' +
    'left 1 (from the $+1$ inside) and down 1 (from the $-1$ outside). A is plain $ x^3 $ (inflection at the ' +
    'origin), B is $ (x-1)^3 + 1 $ (right 1, up 1), and D is $ (x+1)^3 + 1 $ (left 1, up 1 — same horizontal ' +
    'move as the answer, but the wrong vertical one).'),
  identifyGraph(7, 'Which curve is y = −|x − 2| + 1?', 'Four V-shapes — track the sign AND the position.',
    { xmin: -6, xmax: 6, ymin: -4, ymax: 4 }, false,
    ['|x-2|-1', '|x+2|+1', '-abs(x)+1', '-abs(x-2)+1'],
    'Which curve is $ y = -|x - 2| + 1 $?', 3,
    'D is $ -|x-2|+1 $ — the minus sign turns the usual upward V into a downward peak (a "tent" shape), and its ' +
    'peak sits at $ (2, 1) $. A is $ |x-2|-1 $ (a normal upward V, no reflection, shifted right 2 down 1). B is ' +
    '$ |x+2|+1 $ (upward V, shifted left 2 up 1). C is $ -|x|+1 $ (a downward peak, but centred at the origin, ' +
    'not at $ x=2 $).'),
  b('text', 8, { markdown: '**Reciprocal & square root**' }),
  identifyGraph(9, 'Which curve is y = 1/(x − 2) + 1?', 'Watch where each curve\'s asymptotes land.',
    { xmin: -4, xmax: 6, ymin: -4, ymax: 6 }, true,
    ['1/(x-2)+1', '1/x', '1/(x-2)', '1/x+1'],
    'Which curve is $ y = \\dfrac{1}{x-2} + 1 $?', 0,
    'A has its asymptotes at $ x = 2 $ (from the $-2$ inside) and $ y = 1 $ (from the $+1$ outside) — both ' +
    'shifted. B is the plain $ 1/x $ (asymptotes at the origin\'s axes). C is $ 1/(x-2) $ — the vertical ' +
    'asymptote moved to $ x=2 $, but the horizontal one stayed at $ y=0 $. D is $ 1/x + 1 $ — the horizontal ' +
    'asymptote moved to $ y=1 $, but the vertical one stayed at $ x=0 $.'),
  identifyGraph(10, 'Which curve is y = 3√x?', 'One is a vertical stretch — the rest are traps.',
    { xmin: -1, xmax: 9, ymin: -1, ymax: 10 }, false,
    ['sqrt(x)', '3*sqrt(x)', '(1/3)*sqrt(x)', 'sqrt(3*x)'],
    'Which curve is $ y = 3\\sqrt{x} $?', 1,
    'B is $ 3\\sqrt{x} $ — multiplying the OUTPUT by 3 stretches every height threefold, so it climbs fastest. ' +
    'A is the plain $ \\sqrt{x} $. C is $ \\frac{1}{3}\\sqrt{x} $ (compressed, not stretched — the opposite ' +
    'move). D is $ \\sqrt{3x} $ — that scales x INSIDE, a different move that stretches less aggressively ' +
    '(only by a factor of $ \\sqrt{3} \\approx 1.73 $, not 3).'),
  identifyGraph(11, 'y = √x is reflected across the x-axis. Which curve is the result?', 'Reflecting the OUTPUT vs. reflecting the INPUT look very different.',
    { xmin: -9, xmax: 9, ymin: -4, ymax: 4 }, false,
    ['sqrt(x)', 'sqrt(-x)', '-sqrt(x)', '-sqrt(-x)'],
    'y = √x is reflected across the **x-axis**. Which curve is the result?', 2,
    'C is $ -\\sqrt{x} $ — negating the OUTPUT flips the curve down below the x-axis, but it still only lives ' +
    'on $ x \\ge 0 $ (same domain as the original). A is the unreflected $ \\sqrt{x} $. B is $ \\sqrt{-x} $ — ' +
    'that reflects across the **y-axis** instead (it negates the INPUT, so it now lives on $ x \\le 0 $, a ' +
    'completely different domain). D reflects across both axes at once.'),
  b('text', 12, { markdown: '**The abstract test — no formula, just the shape**' }),
  identifyGraph(13, 'The curve shown is f(x) = x(2 − x). Which curve is 2f(x)?', 'Same bump, one operation applied — spot which.',
    { xmin: -1, xmax: 3, ymin: -4, ymax: 4 }, false,
    ['x*(2-x)', 'x*(2-x)+2', '-(x*(2-x))', '2*x*(2-x)'],
    'The curve shown is $ f(x) = x(2-x) $ — a bump peaking at $ (1, 1) $. Which curve is $ 2f(x) $?', 3,
    'D is $ 2f(x) $ — multiplying the whole function by 2 doubles every height, so the peak rises from 1 to 2 ' +
    'without moving sideways. A is $ f(x) $ itself. B is $ f(x) + 2 $ — a common mix-up: that SHIFTS the bump ' +
    'up by 2 (peak still height 1, just relocated), not the same as stretching it. C is $ -f(x) $ — that flips ' +
    'the bump upside down (peak becomes a dip at $ -1 $).'),
  identifyGraph(14, 'Using the same f(x) = x(2 − x), which curve is f(−x)?', 'Reflecting the input moves the WHOLE bump sideways.',
    { xmin: -3, xmax: 3, ymin: -4, ymax: 4 }, false,
    ['x*(2-x)', '-(x*(2-x))', '1-x^2', '-x*(2+x)'],
    'Using the same $ f(x) = x(2-x) $ (peak at $ x=1 $), which curve is $ f(-x) $?', 3,
    'D is $ f(-x) = -x(2+x) $ — replacing x with $ -x $ mirrors the whole bump across the y-axis, so its peak ' +
    'moves from $ x=1 $ to $ x=-1 $ (still height 1). A is the original $ f(x) $. B is $ -f(x) $ — that flips ' +
    'the bump upside-down IN PLACE (a different move: negate the output, not the input). C is $ f(x+1) = 1 - ' +
    'x^2 $ — that just SHIFTS the bump left by 1, without mirroring it (its peak moves to $ x=0 $, not $ x=-1 $, ' +
    'and its shape is not a mirror image).'),
  b('text', 15, { markdown: '**One more scaling trap**' }),
  identifyGraph(16, 'y = x² is stretched HORIZONTALLY by a factor of 2. Which curve is the result?', 'Stretch the x-axis, and the whole parabola widens.',
    { xmin: -4, xmax: 4, ymin: -2, ymax: 20 }, false,
    ['x^2', '(x/2)^2', '(2*x)^2', '2*x^2'],
    'y = x² is stretched HORIZONTALLY by a factor of 2. Which curve is the result?', 1,
    'B is $ (x/2)^2 $ — dividing x by 2 before squaring means you need TWICE the x-distance to reach any given ' +
    'height, which is exactly a horizontal stretch. A is the plain $ x^2 $. C is $ (2x)^2 = 4x^2 $ — that ' +
    'COMPRESSES horizontally (the opposite move — multiplying x inside squeezes the graph). D is $ 2x^2 $ — a ' +
    'VERTICAL stretch, a different operation entirely (it changes the output, not the input).'),
  b('text', 17, {
    markdown:
      'Notice the pattern across every question: **what happens INSIDE the brackets moves the graph ' +
      'sideways** (and often backwards from your first instinct), while **what happens OUTSIDE moves it up, ' +
      'down, or flips it vertically.** That one rule — inside vs. outside — is the whole chapter in one line.',
  }),
];

const PAGE = {
  slug: 'spot-the-right-graph',
  title: 'Practice — Spot the Right Graph',
  subtitle: 'Ten gradable "which curve is it?" questions across every base shape and every move from this chapter.',
  page_number: 7,
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
      const { v4: uuidv4 } = require('uuid');
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
      console.log('created page 7 ·', PAGE.slug, '·', doc.reading_time_min, 'min ·', doc.content_types.join('/'));
      const all = await pages.find({ book_id: book._id, chapter_number: 0, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
      all.sort((a, c) => a.page_number - c.page_number);
      await books.updateOne(
        { _id: book._id, 'chapters.slug': 'meet-the-graphs' },
        { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } },
      );
      console.log('chapter page_ids set:', all.length, 'pages');
    });
    console.log(`spot-the-right-graph DONE (unpublished) · ${blocks.filter((b2) => b2.type === 'math_graph').length} identify questions.`);
  })().catch((e) => { console.error(e); process.exit(1); });
}
