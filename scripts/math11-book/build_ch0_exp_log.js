'use strict';
/* Class 11 Math · Chapter 0 "Meet the Graphs" — ADD the missing base transcendental
   shapes: the EXPONENTIAL (aˣ / eˣ) and the LOGARITHM (log x), taught as mirror-twins
   across y = x. These are covered NOWHERE else in the math livebook (trig lives in Ch.3;
   [x]/signum in Ch.2) yet are core JEE base graphs — the biggest clean Tier-1 gap found
   in the Play-with-Graphs study (_agents/plans/MATH_GRAPHS_EXPANSION.md).

   Voice: warm teacher + "narrate the pen" board-teaching (each move stated twice);
   every explanation is followed by real problem-solving. No new engine code — all spec-mode.

   Slots logically AFTER "the-odd-ones-out" (was page 2) as page 3, renumbering the
   transformation/recognition/practice pages up by one, and re-points the odd-ones-out
   closing bridge so it flows into this page. Additive + idempotent.
   Run: node scripts/math11-book/build_ch0_exp_log.js */
const bw = require('../lib/book-writer');
const { computeReadingTime, computeContentTypes, withDb } = bw;
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class11-mathematics';
const CH_SLUG = 'meet-the-graphs';
const NEW_SLUG = 'growth-and-decay';

const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });
const mcq = (source, prompt, options, correct_index, explanation) =>
  ({ id: uuidv4(), kind: 'mcq', source, prompt, options, correct_index, explanation });

/* Canonical page ORDER for Ch.0 after this insert (index = page_number). */
const ORDER = [
  'meet-the-graphs-opener',
  'lines-and-parabolas',
  'the-odd-ones-out',
  NEW_SLUG,                    // ← inserted here
  'sliding-graphs',
  'stretching-and-flipping',
  'putting-it-all-together',
  'name-that-graph',
  'spot-the-right-graph',
  'describe-the-move',
];

/* ── The new page: Growth & Decay ────────────────────────────────────────── */
const blocks = [
  b('image', 0, {
    src: '', alt: 'A soaring exponential growth curve beside its logarithm mirror-twin on a dark grid', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). On the left a glowing violet exponential curve rocketing upward off a dark ' +
      'grid; on the right a calm sky-blue logarithm curve rising gently, the two facing each other like reflections in ' +
      'a mirror, a faint dashed diagonal line y = x running between them. Deep near-black background, violet and ' +
      'sky-blue glow, elegant graphing-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Two shapes run the real world — money in a bank, a spreading rumour, a cooling cup of tea, radioactive decay. ' +
      'They are the **exponential** and the **logarithm**, and here is the nice part: **they are the same curve seen ' +
      'in a mirror.** Meet one and you get the other free.\n\n' +
      'Trigonometry has its own chapter later; here we just add these two to your gallery of shapes, because they ' +
      'turn up in almost every JEE graph question.',
  }),

  /* — Exponential aˣ — */
  b('text', 2, {
    markdown:
      '**Start with $ y = a^x $** — a fixed base $ a $ raised to a moving power $ x $.\n\n' +
      '- **$ a $ is the base** — how fast it grows. Bigger $ a $ = steeper climb.\n' +
      '- Watch the one point that never moves, no matter what $ a $ you pick.\n' +
      '- **Try this:** drag $ a $ down below 1 (say $ 0.5 $). The climb flips into a slide — that’s *decay*.',
  }),
  b('math_graph', 3, {
    title: 'Play: the exponential aˣ',
    caption: 'Drag the base a. Notice every curve pins to (0, 1); below a = 1 it turns into decay.',
    spec: {
      bounds: { xmin: -3, xmax: 3, ymin: -1, ymax: 8 },
      sliders: [{ name: 'a', min: 0.2, max: 4, value: 2, step: 0.1 }],
      functions: [{ expr: 'a^x', color: 'violet', label: 'aˣ' }],
      points: [{ x: 0, y: 1, label: '(0, 1)', color: 'amber' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('curiosity_prompt', 4, {
    prompt: 'Every single one of these curves goes through (0, 1) — no matter what base you choose. Why can’t it be anything else?',
    reveal:
      'Put $ x = 0 $. Anything to the power $ 0 $ is $ 1 $ — $ 2^0 = 1 $, $ 10^0 = 1 $, even $ 0.5^0 = 1 $. So every ' +
      '$ a^x $ is *forced* through $ (0, 1) $. And since a positive base can never give a negative answer, the whole ' +
      'curve stays **above the x-axis** — the x-axis is a wall it approaches but never crosses (its asymptote).',
  }),

  /* — Logarithm — */
  b('text', 5, {
    markdown:
      'Now the **logarithm** $ y = \\log x $ — the exponential run *backwards*. Where $ a^x $ asks “raise the base to ' +
      '$ x $,” $ \\log x $ asks “what power gives me $ x $?”\n\n' +
      'Draw it the teacher’s way: **keep only the right half of the plane** — you can’t take the log of zero or a ' +
      'negative number, so nothing exists on or left of the y-axis. The curve slips up out of the depths near the ' +
      'y-axis, crosses the x-axis at $ (1, 0) $, then rises slower and slower.',
  }),
  b('math_graph', 6, {
    title: 'Play: the logarithm log x',
    caption: 'It only lives to the right of the y-axis, crosses at (1, 0), and hugs the y-axis going down.',
    spec: {
      bounds: { xmin: -1, xmax: 8, ymin: -3, ymax: 3 },
      functions: [{ expr: 'log(x)', color: 'sky', label: 'ln x' }],
      points: [{ x: 1, y: 0, label: '(1, 0)', color: 'amber' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),

  /* — The mirror (family/revision figure) — */
  b('text', 7, {
    markdown:
      'Here is why you get the logarithm free. Put both curves on one grid with the line $ y = x $ between them, and ' +
      '**fold the page along $ y = x $.** The exponential lands *exactly* on the logarithm. They are mirror-twins — ' +
      'each is the other read the opposite way (mathematicians say they’re *inverses*).',
  }),
  b('math_graph', 8, {
    title: 'Revision: two shapes, one mirror',
    caption: 'Fold along the dashed line y = x and eˣ lands on ln x. Same curve, opposite directions.',
    spec: {
      bounds: { xmin: -3, xmax: 6, ymin: -3, ymax: 6 },
      functions: [
        { expr: 'exp(x)', color: 'violet', label: 'eˣ' },
        { expr: 'log(x)', color: 'sky', label: 'ln x' },
        { expr: 'x', color: 'amber', dashed: true, label: 'y = x' },
      ],
      annotations: [{ x: 3.4, y: 4.2, text: 'mirror line', color: 'amber' }],
      showGrid: true, showAxes: true, keepSquare: true,
    },
  }),
  b('callout', 9, {
    variant: 'remember', title: 'The Two Twins — at a glance',
    markdown:
      '**Exponential $ y = a^x $** ( $ a > 1 $ grows, $ 0 < a < 1 $ decays )\n' +
      '- Always through **$ (0, 1) $**; always **above** the x-axis; x-axis is its asymptote.\n\n' +
      '**Logarithm $ y = \\log x $**\n' +
      '- Only exists for **$ x > 0 $**; always through **$ (1, 0) $**; y-axis is its asymptote.\n\n' +
      '**The link:** $ \\log x $ is $ a^x $ reflected across the line $ y = x $ — they undo each other.',
  }),

  /* — Worked example + paired graph — */
  b('worked_example', 10, {
    label: 'Worked Example',
    variant: 'solved_example',
    reveal_mode: 'tap_to_reveal',
    problem:
      'Sketch $ y = e^x - 2 $. Where does it cross the axes, and what is its horizontal asymptote?',
    solution:
      'Don’t start from scratch — start from a shape you know.\n\n' +
      'Take the base curve $ y = e^x $: through $ (0, 1) $, sitting above the x-axis with asymptote $ y = 0 $.\n\n' +
      'The “$ -2 $” is **outside** the function, so it slides the whole curve **down by 2**. Move every landmark down 2:\n\n' +
      '- The asymptote drops from $ y = 0 $ to $ \\mathbf{y = -2} $.\n' +
      '- The point $ (0, 1) $ drops to $ (0, -1) $ — that’s the **y-intercept**.\n\n' +
      'For the **x-intercept**, set $ y = 0 $: $ e^x - 2 = 0 \\Rightarrow e^x = 2 \\Rightarrow x = \\ln 2 \\approx 0.69 $.\n\n' +
      'So: crosses the y-axis at $ (0, -1) $, crosses the x-axis at $ (\\ln 2, 0) $, and flattens toward $ y = -2 $ on the left.',
  }),
  b('math_graph', 11, {
    title: 'The result: y = eˣ − 2',
    caption: 'Same eˣ shape, dropped 2 down: y-intercept (0, −1), x-intercept (ln 2, 0), asymptote y = −2.',
    spec: {
      bounds: { xmin: -3, xmax: 3, ymin: -3, ymax: 6 },
      functions: [
        { expr: 'exp(x) - 2', color: 'violet', label: 'eˣ − 2' },
        { expr: 'x*0 - 2', color: 'pink', dashed: true, label: 'asymptote y = −2' },
      ],
      points: [
        { x: 0, y: -1, label: '(0, −1)', color: 'amber' },
        { x: 0.69, y: 0, label: '(ln 2, 0)', color: 'emerald' },
      ],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),

  /* — Practice — */
  b('practice_bank', 12, {
    title: 'Your turn — read the twins',
    intro: 'Tap any option to check. Reason from the two anchor points and the asymptotes — not from memory.',
    sections: [
      {
        id: uuidv4(),
        title: 'Reading exponentials and logs',
        items: [
          mcq('mcq',
            'Every curve $ y = a^x $ (with $ a > 0,\\ a \\ne 1 $) is guaranteed to pass through one point. Which?',
            ['$ (1, 0) $', '$ (0, 1) $', '$ (0, 0) $', '$ (1, 1) $'], 1,
            'Put $ x = 0 $: $ a^0 = 1 $ for every base. So they ALL go through $ (0, 1) $.'),
          mcq('mcq',
            'The graph of $ y = \\log x $ meets the x-axis where…',
            ['$ x = 0 $', '$ x = e $', '$ x = 1 $', '$ x = 10 $'], 2,
            '$ \\log x = 0 $ means $ x = 1 $ (since $ \\log 1 = 0 $). It crosses at $ (1, 0) $ — never at $ x = 0 $, where log isn’t even defined.'),
          mcq('mcq',
            'As $ x \\to -\\infty $, the curve $ y = 3^x $ …',
            ['flattens down toward the x-axis ($ y \\to 0 $) but never touches it', 'shoots up to $ +\\infty $', 'becomes negative', 'stays fixed at $ y = 1 $'], 0,
            'Big negative powers are tiny positive numbers ($ 3^{-10} \\approx 0.00002 $). The curve hugs the x-axis — its asymptote — always just above $ 0 $.'),
          mcq('mcq',
            'The graph of $ y = \\log x $ exists only where…',
            ['$ x \\le 0 $', 'all real $ x $', '$ x $ is a whole number', '$ x > 0 $'], 3,
            'You can only take the log of a positive number, so the whole curve sits to the RIGHT of the y-axis, which is its asymptote.'),
          mcq('mcq',
            'For $ y = a^x $, what happens as the base $ a $ drops below 1 (say $ a = 0.5 $)?',
            ['the curve disappears', 'the rising curve flips into a falling (decay) curve', 'it becomes a straight line', 'nothing changes'], 1,
            '$ a > 1 $ grows uphill; $ 0 < a < 1 $ decays downhill. At exactly $ a = 1 $ it is the flat line $ y = 1 $ — the tipping point between growth and decay.'),
        ],
      },
      {
        id: uuidv4(),
        title: 'Twins in the mirror — and moving them',
        items: [
          mcq('mcq',
            '$ y = \\log x $ is the mirror image of $ y = e^x $ across which line?',
            ['the x-axis', 'the y-axis', 'the line $ y = x $', 'the line $ y = -x $'], 2,
            'Reflecting across $ y = x $ swaps $ x $ and $ y $, turning $ y = e^x $ into $ x = e^y $, i.e. $ y = \\log x $. Inverses are always mirror-twins across $ y = x $.'),
          mcq('mcq',
            'The curve $ y = e^x + 3 $ is the graph of $ y = e^x $ …',
            ['slid UP by 3, so its asymptote moves to $ y = 3 $', 'slid down by 3', 'slid right by 3', 'made 3 times taller'], 0,
            'The $ +3 $ is outside the function, so it lifts everything up 3. The asymptote rises from $ y = 0 $ to $ y = 3 $ and $ (0,1) $ becomes $ (0, 4) $.'),
          mcq('mcq',
            'Which statement is the odd one out — NOT true of every $ y = a^x $?',
            ['it passes through $ (0, 1) $', 'it stays above the x-axis', 'the x-axis is its asymptote', 'it passes through the origin $ (0, 0) $'], 3,
            '$ a^x $ is always positive, so it can never touch $ (0, 0) $. The other three hold for every exponential.'),
          mcq('mcq',
            '$ y = e^{-x} $ (that is $ e^x $ with a minus sign INSIDE) looks like…',
            ['exactly the same as $ e^x $', 'a straight line', 'a downhill decay curve — $ e^x $ flipped left-to-right across the y-axis', '$ e^x $ turned upside down'], 2,
            'A minus INSIDE reflects across the y-axis, so the rising $ e^x $ becomes a falling curve — the classic decay shape. Still through $ (0, 1) $, still above the x-axis.'),
        ],
      },
    ],
  }),

  /* — Bridge — */
  b('text', 13, {
    markdown:
      'Now your gallery is complete — the straight and curved algebraic shapes, and these two exponential twins. ' +
      'From here on you almost never learn a *new* shape. You take one of these and **move it** — slide it, stretch ' +
      'it, flip it. Let’s start sliding.',
  }),
];

module.exports = { blocks, ORDER, NEW_SLUG };

async function main() {
  /* ---- self-check: MCQ answer-position spread (pre-insert, per house rule) ---- */
  const pb = blocks.find((x) => x.type === 'practice_bank');
  const tally = [0, 0, 0, 0];
  pb.sections.forEach((s) => s.items.forEach((it) => { if (it.kind === 'mcq') tally[it.correct_index]++; }));
  console.log('MCQ correct_index spread [A,B,C,D]:', tally);
  if (Math.max(...tally) - Math.min(...tally.filter((_, i) => i < 4)) > 2) {
    throw new Error('Answer-position spread too skewed — rebalance before insert.');
  }

  await withDb(async (db) => {
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const now = new Date();

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book class11-mathematics not found');
    const chapter = book.chapters.find((c) => c.slug === CH_SLUG);
    if (!chapter) throw new Error('chapter "meet-the-graphs" not found');

    /* 1. Clear the 0..N page_number range by bumping every existing Ch.0 page into a
          temporary high band (+1000). Shifting all uniformly preserves uniqueness and
          avoids the unique-index collision that a mid-chapter insert would otherwise hit. */
    const before = await pagesCol.find({ book_id: book._id, chapter_number: chapter.number, deleted_at: null }).toArray();
    for (const p of before) {
      await pagesCol.updateOne({ _id: p._id }, { $set: { page_number: p.page_number + 1000 } });
    }

    /* 2. Insert the new page (if absent) into a free temp slot; the final renumber places it. */
    const existing = before.find((p) => p.slug === NEW_SLUG);
    if (existing) {
      console.log('page exists — skipping insert:', NEW_SLUG, '(edit via book-writer if content changes)');
    } else {
      await pagesCol.insertOne({
        _id: uuidv4(), book_id: book._id, chapter_number: chapter.number,
        page_number: 2000, slug: NEW_SLUG,
        title: 'Growth & Decay', subtitle: 'The exponential and the logarithm — two shapes, one mirror.',
        blocks, page_type: 'lesson', published: false,
        reading_time_min: computeReadingTime(blocks), content_types: computeContentTypes(blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      });
      console.log('created page', NEW_SLUG, '·', computeReadingTime(blocks), 'min ·', (computeContentTypes(blocks).join('/') || '—'));
    }

    /* 2. Re-point the "odd-ones-out" closing bridge into this page (versioned edit). */
    const odd = await pagesCol.findOne({ book_id: book._id, slug: 'the-odd-ones-out' });
    if (odd) {
      const nb = (odd.blocks || []).map((blk) => ({ ...blk }));
      let idx = nb.findIndex((blk) => blk.type === 'text' && /sliding/i.test(blk.markdown || ''));
      if (idx === -1) { for (let i = nb.length - 1; i >= 0; i--) if (nb[i].type === 'text') { idx = i; break; } }
      const NEW_BRIDGE =
        'That’s the whole *algebraic* cast — lines, powers, the V, the hyperbola and the root. But two more shapes ' +
        'turn up again and again in JEE: the **exponential** (runaway growth) and its mirror-twin the **logarithm**. ' +
        'Let’s meet those two next — then we’ll start moving them all around.';
      if (idx !== -1 && nb[idx].markdown !== NEW_BRIDGE) {
        nb[idx] = { ...nb[idx], markdown: NEW_BRIDGE };
        const res = await bw.savePage(db, { slug: 'the-odd-ones-out' }, nb, {
          author: 'script', summary: 'repoint closing bridge into new growth-and-decay page',
        });
        console.log('  re-pointed odd-ones-out bridge (block', idx, ') · version', res.version);
      } else {
        console.log('  odd-ones-out bridge already correct — no change');
      }
    }

    /* 3. Renumber the whole chapter to the canonical ORDER + reset page_ids. */
    const all = await pagesCol.find({ book_id: book._id, chapter_number: chapter.number, deleted_at: null }).toArray();
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    const ordered = ORDER.map((slug) => bySlug.get(slug)).filter(Boolean);
    for (let i = 0; i < ordered.length; i++) {
      if (ordered[i].page_number !== i) {
        await pagesCol.updateOne({ _id: ordered[i]._id }, { $set: { page_number: i, updated_at: now } });
        console.log('  renumber', ordered[i].slug, '→ page', i);
      }
    }
    // any pages not in ORDER (defensive) get slots after the known ones so none stay in the temp band
    const leftover = all.filter((p) => !ORDER.includes(p.slug));
    if (leftover.length) console.warn('  WARNING: pages not in ORDER:', leftover.map((p) => p.slug));
    for (let j = 0; j < leftover.length; j++) {
      const t = ordered.length + j;
      if (leftover[j].page_number !== t) await pagesCol.updateOne({ _id: leftover[j]._id }, { $set: { page_number: t, updated_at: now } });
    }
    const pageIds = ordered.map((p) => p._id).concat(leftover.map((p) => p._id));
    await books.updateOne({ _id: book._id, 'chapters.slug': CH_SLUG }, { $set: { 'chapters.$.page_ids': pageIds, updated_at: now } });
    console.log('  chapter page_ids set:', pageIds.length, 'pages');
  });
  console.log('Ch.0 "Growth & Decay" (exp + log) DONE — unpublished.');
}

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
