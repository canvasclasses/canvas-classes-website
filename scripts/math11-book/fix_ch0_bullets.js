'use strict';
/**
 * Converts the "theory paragraph right before a Play interactive" text blocks
 * in Chapter 0 "Meet the Graphs" from prose into 2-3 actionable bullet points
 * (founder feedback, 2026-07-24): this chapter is hands-on, not theory, so the
 * setup for each interactive should say "this is X, this is Y, try this" —
 * not read like a textbook paragraph. Only the 10 identified before-a-graph
 * blocks are touched; wrap-up/transition paragraphs are untouched.
 *
 * Goes through book-writer.savePage (versioned, content-loss guarded) per
 * CLAUDE.md §0.6 — this only edits existing block markdown, no blocks added
 * or removed, so it should not trip the loss guard (verified via dryRun below).
 */
const { withDb, savePage } = require('../lib/book-writer');

// slug -> { order -> new markdown }
const EDITS = {
  'lines-and-parabolas': {
    1:
      '- **m controls the tilt** — bigger m = steeper; negative m = downhill; m = 0 is flat.\n' +
      '- **c controls where it crosses the y-axis** — it slides the whole line up or down.\n' +
      '- **Try this:** drag m past zero into negative numbers, then drag c up and down. Nothing to get right — just notice what moves.',
    4:
      '- **y = x² is a smooth bowl** sitting on the origin — part of a bigger family, the powers $ x^n $.\n' +
      '- **Even powers ($ x^2, x^4 $) stay bowl-shaped**; odd powers ($ x^3, x^5 $) turn into an S that dives below the axis.\n' +
      '- **Try this:** drag n from 1 up to 5, one step at a time, and watch the shape flip between a bowl and an S.',
  },
  'the-odd-ones-out': {
    1:
      '- **$ |x| $ strips the minus sign off a number** — the output is never negative.\n' +
      '- **The graph is a sharp V** — really two straight lines glued at the origin: $ y = -x $ on the left, $ y = x $ on the right.\n' +
      '- **Try this:** drag x from negative to positive and watch which straight piece is doing the work.',
    3:
      '- **$ y = 1/x $ is a hyperbola in two branches** — it never touches either axis.\n' +
      '- **As x shrinks toward 0, the curve races off toward infinity**; far out, it flattens toward the x-axis.\n' +
      '- **Try this:** trace the curve with your eye from x = 5 down toward x = 0.1 — watch how fast it climbs.',
    5:
      '- **$ y = \\sqrt{x} $ only lives where $ x \\ge 0 $** — no real square root of a negative, so nothing exists left of the origin.\n' +
      '- **It rises fast at first, then eases off** — half a sideways parabola.\n' +
      '- **Try this:** look at where the curve starts (the origin) and notice there’s simply nothing to its left.',
  },
  'sliding-graphs': {
    1:
      '- **k slides the graph up or down** — $ f(x) + k $ — and it behaves exactly how you’d expect.\n' +
      '- **h slides the graph left or right** — $ f(x - h) $ — but this one has a famous twist.\n' +
      '- **Try this:** set h to a positive number like 3 and watch which way the graph actually moves.',
    4:
      '- **The same h and k dials slide ANY shape** — not just the parabola.\n' +
      '- **Try this:** send the V’s sharp corner to a specific spot, say $ (3, -2) $, using only h and k.',
  },
  'stretching-and-flipping': {
    1:
      '- **a stretches or squashes the height** — $ a > 1 $ taller, $ 0 < a < 1 $ flatter, negative a flips it upside down.\n' +
      '- **b squeezes the graph sideways** — and a negative b flips it left-to-right.\n' +
      '- **Try this:** drag a below zero and watch the bowl turn into a dome.',
    4:
      '- **Flipping works on every shape** — not just the parabola.\n' +
      '- **Try this:** on the square-root curve, drag a negative, then drag b negative — see which one flips it below the axis and which one swings it to the left.',
  },
  'putting-it-all-together': {
    1:
      '- **Every transformed graph fits one template:** $ y = a \\cdot f(b(x - h)) + k $.\n' +
      '- **Four dials, four jobs** — a (stretch/flip up-down), b (squeeze/flip left-right), h (slide left-right), k (slide up-down).\n' +
      '- **Try this:** play with all four together for a minute — then answer the one question below, now that you’ve earned it.',
  },
};

(async () => {
  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class11-mathematics' });
    const pages = db.collection('book_pages');
    for (const [slug, orderEdits] of Object.entries(EDITS)) {
      const page = await pages.findOne({ book_id: book._id, slug });
      if (!page) { console.log('SKIP (not found):', slug); continue; }
      const newBlocks = page.blocks.map((b) => {
        if (b.type === 'text' && Object.prototype.hasOwnProperty.call(orderEdits, b.order)) {
          return { ...b, markdown: orderEdits[b.order] };
        }
        return b;
      });
      const dry = await savePage(db, { pageId: page._id }, newBlocks, {
        author: 'fix-ch0-bullets', summary: 'bullets dry-run', dryRun: true,
      });
      if (dry.wouldBlock) { console.log('BLOCKED (content-loss guard):', slug, dry.diff); continue; }
      const res = await savePage(db, { pageId: page._id }, newBlocks, {
        author: 'fix-ch0-bullets',
        summary: 'Convert pre-interactive theory paragraphs to actionable bullet points (founder feedback 2026-07-24)',
      });
      console.log('updated:', slug, '-> version', res.version, '| blocks edited:', Object.keys(orderEdits).length);
    }
  });
  console.log('done.');
})().catch((e) => { console.error(e); process.exit(1); });
