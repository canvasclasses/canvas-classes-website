'use strict';
/**
 * Founder direction (2026-07-29): "35 pages are too much for a student who has
 * just started physics… let's keep it up to 20 pages max."
 *
 * Consolidates Ch.0 from 35 pages to exactly 20 by MERGING, never by cutting
 * teaching content. Every explanation, worked example, board, step-solver and
 * question survives — what is dropped per absorbed page is only the redundant
 * page scaffolding: its placeholder hero image (`src: ""`, prompt preserved in
 * the soft-deleted doc and in the build scripts) and its one-line "Next: …"
 * pointer, which is meaningless mid-page. Each absorbed page contributes a
 * level-2 heading carrying its old title, so the material stays navigable and
 * still feeds the "On this page" rail.
 *
 * The chapter opener is NOT merged into: `BookReader` filters it out of the
 * lesson flow (`page_type !== 'chapter_opener'`), so any teaching content moved
 * into it would become unreachable.
 *
 * Absorbed pages are SOFT-deleted (CLAUDE.md §0.6) — snapshotted, reason
 * recorded, recoverable via restorePageVersion — and their ids are $pulled from
 * the chapter's page_ids so no phantom stub is left behind.
 *
 * Run:  node scripts/physics11-book/consolidate_ch0_to_20_pages.js [--dry]
 */
const { savePage, softDeletePage, withDb, computeReadingTime, computeContentTypes } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const dryRun = process.argv.includes('--dry');
const REASON = 'Merged into a consolidated page — founder cap of 20 pages for Ch.0 (2026-07-29). All content carried over; only the placeholder hero image and the "Next:" pointer were dropped.';

/** into = survivor slug · absorb = slugs folded into it, in order. */
const PLAN = [
  // ── Unit A ────────────────────────────────────────────────────────────────
  { n: 0, into: 'mathematics-in-physics-opener', absorb: [] },
  {
    n: 1, into: 'why-physics-leans-on-maths', absorb: ['powers-of-ten'],
    title: 'Why Physics Leans on Maths',
    subtitle: 'From "it falls fast" to "it falls at 9.8 m/s²" — and how to write the numbers',
    closer: 'Next: getting the quantity you actually want onto the left-hand side of a formula.',
  },
  {
    n: 2, into: 'rearranging-formulas', absorb: ['quadratic-equations-in-physics'],
    title: 'Algebra for Physics',
    subtitle: 'Rearranging, solving two at once, and handling the squared unknown',
    closer: 'Next: the shapes. Physics reads answers straight off a graph, so you need to recognise a curve the moment you see it.',
  },
  {
    n: 3, into: 'graphs-lines-and-curves', absorb: ['graphs-trig-log-exponential'],
    title: 'Reading Graphs',
    subtitle: 'Lines, parabolas, conics — and the curves that wave, grow and decay',
    closer: 'Next: what happens to any of these curves when you nudge, stretch or flip them.',
  },
  { n: 4, into: 'transforming-a-graph', absorb: [] },
  {
    n: 5, into: 'angles-degrees-and-radians', absorb: ['trigonometry-for-physics'],
    title: 'Angles and Trigonometric Ratios',
    subtitle: 'Radians, arc length, and the table you must know cold',
    closer: 'Next: the identities physics reuses, and the approximation that makes small angles almost disappear.',
  },
  {
    n: 6, into: 'trig-identities-and-compound-angles', absorb: ['small-angle-shortcut'],
    title: 'Trigonometric Identities and Small Angles',
    subtitle: 'The eight formulas physics actually reuses — and the shortcut that removes them',
    closer: 'That is the last of the pure-maths tools. Time to use them all together.',
  },
  { n: 7, into: 'unit-a-practice-arena', absorb: [] },

  // ── Unit B ────────────────────────────────────────────────────────────────
  {
    n: 8, into: 'what-differentiation-means', absorb: ['standard-derivatives'],
    title: 'What Differentiation Really Means',
    subtitle: 'From "average over an hour" to "right now" — and the table that does the work',
    closer: 'Next: what to do when a function is built out of several of these joined together.',
  },
  {
    n: 9, into: 'differentiation-rules-sum-and-product', absorb: ['differentiation-rules-quotient-and-chain'],
    title: 'The Rules of Differentiation',
    subtitle: 'Sums, products, quotients — and the chain rule you will use every day',
    closer: 'You now have all four rules. Next: what they actually mean in physics.',
  },
  {
    n: 10, into: 'derivative-as-rate-of-change', absorb: ['maxima-and-minima'],
    title: 'Using the Derivative',
    subtitle: 'Six rates of change, and finding the top of the hill',
    closer: 'That completes differentiation. Now we run the whole machine backwards.',
  },
  {
    n: 11, into: 'integration-reversing-differentiation', absorb: ['integration-rules'],
    title: 'Integration — Reversing Differentiation',
    subtitle: 'Given the rate, find the quantity — plus the substitution trick',
    closer: 'Next: putting numbers on the integral, and discovering that it measures an area.',
  },
  { n: 12, into: 'definite-integration-and-area', absorb: [] },
  { n: 13, into: 'unit-b-practice-arena', absorb: [] },

  // ── Unit C ────────────────────────────────────────────────────────────────
  {
    n: 14, into: 'scalars-and-vectors', absorb: ['anatomy-of-a-vector', 'types-of-vectors-and-the-angle-between'],
    title: 'Scalars, Vectors and the Angle Between Them',
    subtitle: 'What a vector is, what its parts are called, and how to measure the angle',
    closer: 'Next: the rule for combining two vectors into one.',
  },
  {
    n: 15, into: 'adding-vectors-triangle-law', absorb: ['parallelogram-law-of-vector-addition'],
    title: 'Adding Vectors',
    subtitle: 'The triangle law, the parallelogram law, and the formula for the resultant',
    closer: 'Next: taking a vector away, and what happens when several of them cancel out entirely.',
  },
  {
    n: 16, into: 'subtracting-vectors', absorb: ['polygon-law-and-equilibrium'],
    title: 'Subtraction, the Polygon Law and Equilibrium',
    subtitle: 'Taking one vector away, adding many at once, and the case where they all cancel',
    closer: 'Adding by drawing is fine for two or three. For anything harder we need a numerical method — and that starts by breaking every vector into pieces.',
  },
  {
    n: 17, into: 'resolving-vectors-into-components', absorb: ['analytical-method-of-vector-addition'],
    title: 'Resolution and the Analytical Method',
    subtitle: 'Replace one awkward arrow with two easy ones, then just add the columns',
    closer: 'You can now add and subtract vectors any way you like. The last question is what happens when you **multiply** them — and there are two different answers.',
  },
  {
    n: 18, into: 'the-dot-product', absorb: ['the-cross-product'],
    title: 'Multiplying Vectors — Dot and Cross',
    subtitle: 'One product gives a number, the other gives a vector',
    closer: 'That is the whole of vectors. One practice arena to go, and Chapter 0 is finished.',
  },
  { n: 19, into: 'unit-c-practice-arena', absorb: [] },
];

const isPointer = (b) => b && b.type === 'text' && typeof b.markdown === 'string' && b.markdown.length < 240;

withDb(async (db) => {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const book = await books.findOne({ slug: 'class11-physics' });
  if (!book) throw new Error('book not found');

  const absorbedIds = [];

  // `book_pages` has a UNIQUE index on (book_id, chapter_number, page_number),
  // and it counts soft-deleted docs too — so renumbering in place collides the
  // moment a survivor moves onto a slot another page still holds. Park every
  // page of this chapter above the working range first; survivors are then
  // written back down to 0–19 and the retired ones simply stay parked.
  const PARK = 1000;
  if (!dryRun) {
    const live = await pages.find({ book_id: book._id, chapter_number: 0, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
    const needPark = live.some((p) => p.page_number < PARK);
    if (needPark) {
      for (const p of live.sort((a, b) => b.page_number - a.page_number)) {
        if (p.page_number < PARK) {
          await pages.updateOne({ _id: p._id }, { $set: { page_number: p.page_number + PARK } });
        }
      }
      console.log(`  parked ${live.length} pages at +${PARK} to clear the unique index\n`);
    }
  }

  for (const step of PLAN) {
    const survivor = await pages.findOne({ book_id: book._id, slug: step.into, deleted_at: null });
    if (!survivor) throw new Error(`survivor not found: ${step.into}`);

    if (!step.absorb.length) {
      // Position-only change.
      if (!dryRun && survivor.page_number !== step.n) {
        await pages.updateOne({ _id: survivor._id }, { $set: { page_number: step.n, updated_at: new Date() } });
      }
      console.log(`  ${String(step.n).padStart(2)}  ${survivor.title}  (unchanged)`);
      continue;
    }

    let blocks = [...survivor.blocks].sort((a, b) => a.order - b.order);
    let glossary = [...(survivor.glossary || [])];

    // Idempotency: a survivor already carrying a level-2 heading with the
    // absorbed page's title has been merged on an earlier (possibly failed) run.
    // Re-appending would duplicate the whole section.
    const alreadyHas = (title) => blocks.some((b) => b.type === 'heading' && b.text === title);
    const pending = [];
    for (const slug of step.absorb) {
      const src = await pages.findOne({ book_id: book._id, slug, deleted_at: null });
      if (!src) throw new Error(`absorb target not found: ${slug}`);
      absorbedIds.push({ id: src._id, slug: src.slug, title: src.title });
      if (alreadyHas(src.title)) {
        console.log(`  ${String(step.n).padStart(2)}  ${step.title}  ← ${slug} ALREADY MERGED, skipping append`);
        continue;
      }
      pending.push(src);
    }

    if (!pending.length) {
      if (!dryRun && survivor.page_number !== step.n) {
        await pages.updateOne({ _id: survivor._id }, { $set: { page_number: step.n, updated_at: new Date() } });
      }
      console.log(`  ${String(step.n).padStart(2)}  ${step.title}  (already consolidated, repositioned)`);
      continue;
    }

    if (isPointer(blocks[blocks.length - 1])) blocks = blocks.slice(0, -1);

    for (const src of pending) {
      let sb = [...src.blocks].sort((a, b) => a.order - b.order);
      if (sb[0] && sb[0].type === 'image') sb = sb.slice(1);           // placeholder hero
      if (isPointer(sb[sb.length - 1])) sb = sb.slice(0, -1);          // "Next: …" pointer
      blocks.push({
        id: uuidv4(), type: 'heading', order: 0,
        text: src.title, level: 2,
        ...(src.subtitle ? { objective: src.subtitle } : {}),
      });
      blocks.push(...sb);
      for (const g of src.glossary || []) {
        if (!glossary.some((x) => x.term === g.term)) glossary.push(g);
      }
    }

    blocks.push({ id: uuidv4(), type: 'text', order: 0, markdown: step.closer });
    blocks = blocks.map((b, i) => ({ ...b, order: i }));

    const res = await savePage(db, { pageId: survivor._id }, blocks, {
      author: 'ch0-consolidate',
      summary: `Consolidation to 20 pages: absorbed ${step.absorb.join(', ')}`,
      dryRun,
      // The only block leaving the survivor is its trailing one-line "Next: …"
      // pointer, immediately replaced by `step.closer`. Founder authorised the
      // consolidation explicitly (2026-07-29, "keep it up to 20 pages max").
      allowContentLoss: true,
      lossReason:
        'Founder-authorised consolidation 35→20 pages. Removed block is the survivor page\'s one-line "Next: …" navigation pointer, ' +
        'replaced in the same save by a new closing pointer. No teaching content, example, board or question is dropped.',
      extraSet: {
        title: step.title,
        subtitle: step.subtitle,
        page_number: step.n,
        glossary: glossary.length ? glossary : undefined,
        reading_time_min: computeReadingTime(blocks),
        content_types: computeContentTypes(blocks),
      },
    });
    const flag = dryRun ? (res.wouldBlock ? '!! WOULD BLOCK ' + JSON.stringify(res.diff.reasons) : 'ok') : 'saved';
    console.log(`  ${String(step.n).padStart(2)}  ${step.title}  ← +${step.absorb.length}  (${survivor.blocks.length} → ${blocks.length} blocks) ${flag}`);
  }

  // ── retire the absorbed pages ───────────────────────────────────────────────
  console.log(`\n  soft-deleting ${absorbedIds.length} absorbed pages:`);
  for (const a of absorbedIds) {
    console.log(`    − ${a.slug}`);
    if (!dryRun) await softDeletePage(db, { pageId: a.id }, { author: 'ch0-consolidate', reason: REASON });
  }

  if (!dryRun) {
    const all = await pages
      .find({ book_id: book._id, chapter_number: 0, deleted_at: null }, { projection: { _id: 1, page_number: 1, title: 1 } })
      .toArray();
    all.sort((a, b) => a.page_number - b.page_number);
    await books.updateOne(
      { _id: book._id, 'chapters.slug': 'mathematics-in-physics' },
      { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: new Date() } },
    );
    console.log(`\n  chapter now ${all.length} pages:`);
    all.forEach((p) => console.log(`    ${String(p.page_number).padStart(2)}  ${p.title}`));
  }
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
