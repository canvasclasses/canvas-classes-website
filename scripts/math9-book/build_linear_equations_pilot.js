'use strict';
/* Class 9 Math · Ch.2 "Introduction to Linear Polynomials" — PILOT page for the two
   new interactive tools: the BALANCE-SCALE concept-game (simulation) + the STEP-THROUGH
   SOLVER (step_solver block). Placed right after p5 "From Polynomials to Equations:
   Solving for the Unknown" (the natural home). Additive, unpublished, idempotent.

   Research spine: game-based learning (Tokac 2019) → low-floor play; step-based tutoring
   (VanLehn), segmentation (Mayer), generation effect → click-through-every-step solving.
   Plan: _agents/plans/MATH_INTERACTIVE_TOOLS.md.
   Run: node scripts/math9-book/build_linear_equations_pilot.js */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-mathematics';
const CH_NUMBER = 2;
const NEW_SLUG = 'play-then-solve-linear-equations';
const AFTER_SLUG = 'polynomials-to-equations-solving-for-x'; // insert immediately after this page

const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });

const blocks = [
  b('text', 0, {
    markdown:
      'You already know how to *build* an equation. Now the big question: how do you **solve** one — how do you ' +
      'find the mystery number $ x $?\n\n' +
      'Here’s the secret, and it’s not algebra at all — it’s **fairness**. Before we write a single symbol, play with ' +
      'the scale below. Your only job: get the mystery box by itself, and **keep the scale level**.',
  }),
  b('simulation', 1, {
    simulation_id: 'balance-scale-equations',
    title: 'Balance Game — keep both sides equal',
  }),
  b('text', 2, {
    markdown:
      'Did you feel it? The moment you touched **only one pan**, the scale tipped — it wasn’t fair any more. Peel a ' +
      'block off **both** pans and it stays level. That single rule — *whatever you do to one side, do to the other* — ' +
      '**is** how we solve every equation.\n\n' +
      'Now watch the exact same move in symbols. This time **you** make each decision — click through it one step at a time.',
  }),
  b('step_solver', 3, {
    title: 'Solve it: $ 2x + 3 = 11 $',
    intro: 'Same balance, now written down. At each step, decide the move — then see it happen.',
    problem: '$ 2x + 3 = 11 $',
    steps: [
      {
        id: uuidv4(),
        math: '$ 2x = 8 $',
        say: 'Take **3** off both sides.',
        why: 'On the left, $ 3 - 3 = 0 $, so only $ 2x $ is left. On the right, $ 11 - 3 = 8 $. Both sides changed by the same amount, so it’s still balanced — exactly like taking a block off both pans.',
        check: {
          kind: 'pick_op',
          prompt: 'The $ +3 $ is sitting next to the $ x $, in the way. To clear it and **keep both sides equal**, what do we do?',
          options: ['Subtract 3 from both sides', 'Add 3 to both sides', 'Divide both sides by 3'],
          answer_index: 0,
          feedback_right: 'Yes — subtract 3 from **both** sides. The $ +3 $ vanishes on the left.',
          feedback_wrong: 'Not that one. The $ +3 $ is *added*, so to undo it we do the opposite — and we must do it to **both** sides.',
        },
      },
      {
        id: uuidv4(),
        math: '$ x = 4 $',
        say: 'Split both sides into **2** equal groups.',
        why: 'The left is $ 2x $ — two $ x $’s. Split both sides by 2: the left becomes one $ x $, and $ 8 \\div 2 = 4 $. The mystery is solved.',
        check: {
          kind: 'fill_blank',
          prompt: 'Now $ 2x = 8 $ — that’s **two** $ x $’s balancing 8. Split both sides by 2. So $ x = $ ?',
          blank_answer: '4',
          feedback_right: 'That’s it — $ 8 \\div 2 = 4 $, so $ x = 4 $.',
          feedback_wrong: 'Close — think: two $ x $’s weigh 8, so one $ x $ weighs half of 8.',
        },
      },
    ],
    now_you_try: {
      problem: 'Your turn — same two moves: $ 3x + 2 = 14 $',
      answer: '$ x = 4 $',
      solution: 'Take 2 off both sides → $ 3x = 12 $. Split both sides by 3 → $ x = 4 $. (Check: $ 3(4) + 2 = 14 $ ✓)',
    },
  }),
  b('text', 4, {
    markdown:
      'That’s the whole game of solving linear equations: **keep it fair, and peel away everything around the $ x $** ' +
      'until it stands alone. Every equation you’ll ever solve is just this move, repeated.',
  }),
];

const PAGE = {
  slug: NEW_SLUG,
  title: 'Play, Then Solve',
  subtitle: 'Discover how to solve an equation on a balance scale — then do every step yourself.',
  page_type: 'lesson',
  blocks,
};

async function main() {
  await withDb(async (db) => {
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const now = new Date();

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book class9-mathematics not found');
    const chapter = book.chapters.find((c) => c.number === CH_NUMBER);
    if (!chapter) throw new Error('chapter 2 not found');

    // Current Ch.2 pages, in order.
    const existing = await pagesCol.find({ book_id: book._id, chapter_number: CH_NUMBER, deleted_at: null }).toArray();
    existing.sort((a, c) => a.page_number - c.page_number);
    const afterIdx = existing.findIndex((p) => p.slug === AFTER_SLUG);
    if (afterIdx === -1) throw new Error(`anchor page ${AFTER_SLUG} not found`);

    const already = existing.find((p) => p.slug === NEW_SLUG);

    // Desired slug order: pages up to & including the anchor, then NEW, then the rest.
    const order = [];
    for (let i = 0; i < existing.length; i++) {
      if (existing[i].slug === NEW_SLUG) continue; // will be re-placed
      order.push(existing[i].slug);
      if (existing[i].slug === AFTER_SLUG) order.push(NEW_SLUG);
    }

    // 1. Bump every existing Ch.2 page into a temp band (avoids the unique-index collision).
    for (const p of existing) {
      await pagesCol.updateOne({ _id: p._id }, { $set: { page_number: p.page_number + 1000 } });
    }

    // 2. Insert (or leave) the new page.
    if (already) {
      console.log('pilot page exists — will just renumber:', NEW_SLUG);
    } else {
      await pagesCol.insertOne({
        _id: uuidv4(), book_id: book._id, chapter_number: CH_NUMBER, page_number: 2000,
        slug: PAGE.slug, title: PAGE.title, subtitle: PAGE.subtitle, blocks: PAGE.blocks,
        page_type: PAGE.page_type, published: false,
        reading_time_min: computeReadingTime(PAGE.blocks), content_types: computeContentTypes(PAGE.blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      });
      console.log('created pilot page', NEW_SLUG, '·', computeReadingTime(PAGE.blocks), 'min ·', (computeContentTypes(PAGE.blocks).join('/') || '—'));
    }

    // 3. Renumber to the desired order + reset page_ids.
    const all = await pagesCol.find({ book_id: book._id, chapter_number: CH_NUMBER, deleted_at: null }).toArray();
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    const ordered = order.map((s) => bySlug.get(s)).filter(Boolean);
    for (let i = 0; i < ordered.length; i++) {
      if (ordered[i].page_number !== i) await pagesCol.updateOne({ _id: ordered[i]._id }, { $set: { page_number: i, updated_at: now } });
    }
    await books.updateOne({ _id: book._id, 'chapters.number': CH_NUMBER }, { $set: { 'chapters.$.page_ids': ordered.map((p) => p._id), updated_at: now } });
    console.log('  Ch.2 renumbered · new page at index', order.indexOf(NEW_SLUG), '· total', ordered.length, 'pages');
  });
  console.log('Linear-equations pilot DONE (unpublished).');
}

module.exports = { PAGE };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
