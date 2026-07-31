'use strict';
/**
 * Chapter 0 "Meet the Graphs" — pedagogy enrichment pass (2026-07-24).
 * Adds the four features the founder asked for, modelled on Thomas' Calculus
 * §1.2 (Figures 1.29–1.35):
 *   1. COMPARE MODE on every transformation interactive ("Keep this curve" →
 *      students build a coloured family by hand, like Fig 1.29).
 *   2. STATIC FAMILY / REVISION graphs after each interactive — several curves
 *      at once in different colours with labels + "up 2 / right 3" annotations.
 *      Rendered as vector math_graph blocks, NOT uploaded images.
 *   3. FORMULA REFERENCE CARDS — the boxed "Shift Formulas" / "Scaling
 *      Formulas" idea, as `remember` callouts.
 *   4. MATCH-THE-GRAPH CHALLENGES — auto-checkable: set the sliders until your
 *      curve lands on the dashed goal. The exercise a paper book cannot do.
 *
 * Idempotent: every insert is skipped if a block with that title already exists.
 * Goes through book-writer.savePage (versioned, content-loss guarded).
 */
const { withDb, savePage } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const b = (type, extra) => ({ id: uuidv4(), type, order: 0, ...(extra || {}) });

// ── New blocks, keyed by page slug, each inserted after a given existing order ──
const PLAN = {
  'lines-and-parabolas': {
    patch: { 2: { compare: true }, 5: { compare: true } },
    inserts: [
      {
        after: 5,
        block: b('math_graph', {
          title: 'Revision: the power family at a glance',
          caption: 'Every one passes through the origin and (1, 1). Even powers make bowls; odd powers make S-curves.',
          spec: {
            bounds: { xmin: -2.5, xmax: 2.5, ymin: -2.5, ymax: 2.5 },
            functions: [
              { expr: 'x', color: 'sky', label: 'x' },
              { expr: 'x^2', color: 'violet', label: 'x²' },
              { expr: 'x^3', color: 'amber', label: 'x³' },
              { expr: 'x^4', color: 'emerald', label: 'x⁴' },
            ],
            points: [{ x: 1, y: 1, label: '(1, 1)', color: 'pink' }],
            showGrid: true, showAxes: true, keepSquare: true,
          },
        }),
      },
    ],
  },

  'sliding-graphs': {
    patch: { 2: { compare: true }, 5: { compare: true } },
    inserts: [
      {
        after: 2,
        block: b('math_graph', {
          title: 'Revision: sliding up and down',
          caption: 'Same bowl, three heights. Adding a number outside the function lifts the whole graph.',
          spec: {
            bounds: { xmin: -4, xmax: 4, ymin: -4, ymax: 8 },
            functions: [
              { expr: 'x^2 + 2', color: 'violet', label: 'x² + 2' },
              { expr: 'x^2', color: 'sky', label: 'x²' },
              { expr: 'x^2 - 2', color: 'amber', label: 'x² − 2' },
            ],
            annotations: [
              { x: 0.35, y: 1, text: 'up 2', color: 'violet' },
              { x: 0.35, y: -1.4, text: 'down 2', color: 'amber' },
            ],
            showGrid: true, showAxes: true, keepSquare: true,
          },
        }),
      },
      {
        after: 5,
        block: b('math_graph', {
          title: 'Revision: sliding left and right',
          caption: 'The counter-intuitive one — a minus inside moves the graph RIGHT, a plus moves it LEFT.',
          spec: {
            bounds: { xmin: -6, xmax: 6, ymin: -1.5, ymax: 8 },
            functions: [
              { expr: '(x + 3)^2', color: 'amber', label: '(x + 3)²' },
              { expr: 'x^2', color: 'sky', label: 'x²' },
              { expr: '(x - 3)^2', color: 'violet', label: '(x − 3)²' },
            ],
            annotations: [
              { x: -4.6, y: 5.4, text: '← left 3', color: 'amber' },
              { x: 2.2, y: 5.4, text: 'right 3 →', color: 'violet' },
            ],
            showGrid: true, showAxes: true, keepSquare: true,
          },
        }),
      },
      {
        after: 5,
        block: b('callout', {
          variant: 'remember', title: 'Shift Formulas',
          markdown:
            '**Vertical** — $ y = f(x) + k $\n\n' +
            'Shifts the graph **up** $ k $ units if $ k > 0 $; **down** if $ k < 0 $.\n\n' +
            '**Horizontal** — $ y = f(x - h) $\n\n' +
            'Shifts the graph **right** $ h $ units if $ h > 0 $; **left** if $ h < 0 $.\n\n' +
            'Outside the bracket behaves as you expect. **Inside the bracket runs backwards.**',
        }),
      },
    ],
  },

  'stretching-and-flipping': {
    patch: { 2: { compare: true }, 5: { compare: true } },
    inserts: [
      {
        after: 2,
        block: b('math_graph', {
          title: 'Revision: stretching, squashing, flipping',
          caption: 'One bowl, four sizes. The multiplier outside changes the height; a negative one turns it over.',
          spec: {
            bounds: { xmin: -3, xmax: 3, ymin: -5, ymax: 6 },
            functions: [
              { expr: '2*x^2', color: 'violet', label: '2x² (taller)' },
              { expr: 'x^2', color: 'sky', label: 'x²' },
              { expr: '0.4*x^2', color: 'emerald', label: '0.4x² (flatter)' },
              { expr: '-x^2', color: 'amber', label: '−x² (flipped)' },
            ],
            showGrid: true, showAxes: true, keepSquare: true,
          },
        }),
      },
      {
        after: 5,
        block: b('callout', {
          variant: 'remember', title: 'Scaling & Reflecting Formulas',
          markdown:
            '**Vertical** — $ y = a\\,f(x) $\n\n' +
            'Stretches taller by a factor of $ a $ when $ a > 1 $; squashes flatter when $ 0 < a < 1 $.\n\n' +
            '**Horizontal** — $ y = f(bx) $\n\n' +
            'Squeezes the graph sideways by a factor of $ b $.\n\n' +
            '**Reflections** — $ y = -f(x) $ flips it across the **x-axis**; $ y = f(-x) $ flips it across the **y-axis**.',
        }),
      },
    ],
  },

  'putting-it-all-together': {
    patch: { 2: { compare: true } },
    inserts: [
      {
        after: 2,
        block: b('callout', {
          variant: 'remember', title: 'The Four Dials',
          markdown:
            '$ y = a\\,f\\big(b(x - h)\\big) + k $\n\n' +
            '- **$ a $** — taller / flatter, and flips it upside down when negative\n' +
            '- **$ b $** — squeezes sideways, and flips left-to-right when negative\n' +
            '- **$ h $** — slides right (positive) or left (negative) — *the backwards one*\n' +
            '- **$ k $** — slides up (positive) or down (negative)',
        }),
      },
      {
        after: 2,
        block: b('math_graph', {
          title: 'Challenge: land on the dashed curve',
          caption: 'Your curve is solid; the goal is dashed. Move the dials until they sit on top of each other.',
          archetype: 'transformations',
          archetype_params: { base: 'square' },
          challenge: {
            targets: { a: 1, b: 1, h: 2, k: -3 },
            tolerance: 0.25,
            prompt: 'Move the sliders until your curve lands on the dashed goal. (Hint: it hasn’t been stretched — only moved.)',
            success: 'Got it — that’s y = f(x − 2) − 3: the bowl slid 2 right and 3 down.',
          },
        }),
      },
    ],
  },

  'name-that-graph': {
    patch: {},
    inserts: [
      {
        after: 2,
        block: b('math_graph', {
          title: 'Final challenge: build it yourself',
          caption: 'No multiple choice this time — make your curve match the dashed goal.',
          archetype: 'shift-explorer',
          archetype_params: { base: 'abs' },
          challenge: {
            targets: { h: -3, k: 1 },
            tolerance: 0.25,
            prompt: 'Slide the V until it lands on the dashed goal — then read off what h and k had to be.',
            success: 'That’s y = |x + 3| + 1 — the corner moved 3 left and 1 up.',
          },
        }),
      },
    ],
  },
};

function rebuild(blocks, inserts, patch) {
  const sorted = [...blocks].sort((a, c) => a.order - c.order);
  const out = [];
  for (const blk of sorted) {
    const patched = patch[blk.order] ? { ...blk, ...patch[blk.order] } : blk;
    out.push(patched);
    inserts.filter((i) => i.after === blk.order).forEach((i) => out.push(i.block));
  }
  return out.map((blk, i) => ({ ...blk, order: i }));
}

(async () => {
  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class11-mathematics' });
    const pages = db.collection('book_pages');
    for (const [slug, cfg] of Object.entries(PLAN)) {
      const page = await pages.findOne({ book_id: book._id, slug });
      if (!page) { console.log('SKIP (not found):', slug); continue; }

      // Idempotency — drop inserts whose title already exists on the page.
      const existingTitles = new Set(page.blocks.map((x) => x.title).filter(Boolean));
      const inserts = cfg.inserts.filter((i) => !existingTitles.has(i.block.title));
      const alreadyPatched = Object.entries(cfg.patch).every(([ord, p]) => {
        const blk = page.blocks.find((x) => x.order === Number(ord));
        return blk && Object.entries(p).every(([k, v]) => blk[k] === v);
      });
      if (!inserts.length && (alreadyPatched || !Object.keys(cfg.patch).length)) {
        console.log('up to date:', slug); continue;
      }

      const newBlocks = rebuild(page.blocks, inserts, cfg.patch);
      const dry = await savePage(db, { pageId: page._id }, newBlocks, { author: 'enrich-ch0', summary: 'dry', dryRun: true });
      if (dry.wouldBlock) { console.log('BLOCKED:', slug, JSON.stringify(dry.diff)); continue; }
      const res = await savePage(db, { pageId: page._id }, newBlocks, {
        author: 'enrich-ch0',
        summary: 'Ch.0 pedagogy pass: compare mode, family/revision graphs, formula cards, match-the-graph challenges',
      });
      console.log(`updated ${slug} -> v${res.version} | +${inserts.length} blocks, ${Object.keys(cfg.patch).length} patched`);
    }
  });
  console.log('done.');
})().catch((e) => { console.error(e); process.exit(1); });
