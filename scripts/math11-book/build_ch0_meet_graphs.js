'use strict';
/* Class 11 Math · Chapter 0 "Meet the Graphs" — a foundations chapter that comes
   BEFORE Relations & Functions. Its whole job: make students COMFORTABLE with the
   base shapes and how dragging a parameter changes a graph — through UNGATED
   exploration (no predict-first until the shapes are earned). Play-with-Graphs
   style, inside the Live Book framework (every graph is a math_graph block).
   Additive + idempotent. Run: node scripts/math11-book/build_ch0_meet_graphs.js */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class11-mathematics';
const CH = {
  number: 0,
  title: 'Meet the Graphs',
  slug: 'meet-the-graphs',
  description:
    'Before the syllabus proper — get comfortable with the shapes of the common functions and watch, ' +
    'hands-on, how sliding, stretching and flipping change a graph. No tests here, just play.',
};
const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });
const q = (question, options, correct_index, explanation, difficulty_level) => ({
  id: uuidv4(), question, options, correct_index, explanation, difficulty_level,
});

/* ── Page 0 — Opener ─────────────────────────────────────────────────────── */
const p0 = [
  b('image', 0, {
    src: '', alt: 'A gallery of glowing function-graph shapes on a dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A gallery wall of glowing graph shapes hung like framed portraits — ' +
      'a straight line, a parabola, an S-shaped cubic, a sharp V, a hyperbola, a gentle square-root curve — each ' +
      'lit softly. Violet, amber, sky-blue and emerald curves on a deep near-black background, elegant museum-' +
      'gallery style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Here is a secret good students know and struggling students don’t: **you rarely solve a maths problem by ' +
      'grinding algebra from scratch.** You *recognise the shape*. The moment you see $ y = (x-2)^2 + 1 $ and ' +
      'already picture a familiar bowl sitting at the point $ (2, 1) $, half the battle is over.\n\n' +
      'That recognition is not a talent you’re born with — it’s built by **playing** with graphs until they feel ' +
      'like old friends. That is the whole job of this short chapter.',
  }),
  b('callout', 2, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'This chapter has **no tests and no “predict the answer” traps.** Just drag the sliders, watch what happens, ' +
      'and let the shapes sink in. There are no wrong moves here — the point is to *play* until each graph feels ' +
      'obvious. Later chapters will ask you to predict; this one just wants you to look.',
  }),
  b('text', 3, {
    markdown:
      '**What you’ll get comfortable with**\n\n' +
      '- The everyday shapes: the **line**, the **parabola**, the **cubic**, the **V** ($ |x| $), the ' +
      '**hyperbola** ($ 1/x $) and the **square-root** curve\n' +
      '- **Sliding** a graph around — up, down, left, right\n' +
      '- **Stretching** and **flipping** a graph\n' +
      '- Reading any $ a\\,f(b(x-h)) + k $ at a glance — the graph is just a familiar shape, moved',
  }),
];

/* ── Page 1 — Straight Lines & Parabolas ─────────────────────────────────── */
const p1 = [
  b('image', 0, {
    src: '', alt: 'A straight line and a parabola glowing side by side on a dark grid', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). On the left a glowing straight line tilted across a dark grid; on the ' +
      'right a smooth violet parabola. The two most common graph shapes, side by side. Deep near-black ' +
      'background, violet and amber glow, elegant graphing poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Start with the two you’ll meet most often. The **straight line** $ y = mx + c $ has just two dials: ' +
      '**$ m $** sets the *tilt* (bigger $ m $ = steeper; negative $ m $ = downhill), and **$ c $** sets *where it ' +
      'crosses the y-axis*. Drag them and feel the difference — nothing to get right, just notice.',
  }),
  b('math_graph', 2, {
    title: 'Play: the straight line',
    caption: 'Drag m to tilt, drag c to slide up and down.',
    archetype: 'line-explorer',
  }),
  b('curiosity_prompt', 3, {
    prompt: 'Drag m all the way down past zero, into negative numbers. What kind of line do you get?',
    reveal:
      'A downhill line! A positive slope climbs left-to-right; a negative slope falls. And $ m = 0 $ gives a ' +
      'perfectly flat, horizontal line — a constant function.',
  }),
  b('text', 4, {
    markdown:
      'Next, the **parabola** $ y = x^2 $ — a smooth bowl sitting on the origin. It belongs to a bigger family, ' +
      'the **powers** $ x^n $. Watch what happens as you crank $ n $ up: even powers ($ x^2, x^4 $) stay bowl-' +
      'shaped and symmetric; odd powers ($ x^3, x^5 $) make an S that dives below the axis on the left.',
  }),
  b('math_graph', 5, {
    title: 'Play: the power family xⁿ',
    caption: 'Drag n through 1, 2, 3, 4, 5 and watch the shape flip between bowls and S-curves.',
    archetype: 'power-family',
  }),
  b('curiosity_prompt', 6, {
    prompt: 'Set n = 2, then n = 3. One shape is a mirror-image across the y-axis; the other spins onto itself. Which is which?',
    reveal:
      '$ x^2 $ (and every even power) is a **bowl**, mirror-symmetric about the y-axis. $ x^3 $ (and every odd ' +
      'power) is an **S**, symmetric under a half-turn about the origin. Every one of them passes through the ' +
      'origin and through $ (1, 1) $.',
  }),
  b('text', 7, {
    markdown:
      'Lines and powers are the smooth, well-behaved shapes. But a few common functions have a sharp corner, a ' +
      'sudden break, or only live on half the number line. Those are next — and they’re the ones students find ' +
      'strangest, so we’ll spend real time with them.',
  }),
];

/* ── Page 2 — The Odd Ones Out ───────────────────────────────────────────── */
const p2 = [
  b('image', 0, {
    src: '', alt: 'A V shape, a hyperbola and a square-root curve glowing on a dark grid', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Three unusual curves across a dark grid: a sharp violet V, a sky-blue ' +
      'hyperbola in two branches racing toward the axes, and an emerald square-root curve rising gently from the ' +
      'origin. Deep near-black background, elegant graphing poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'These three trip students up simply because they’re less familiar. Spend a minute with each and they stop ' +
      'being strange.\n\n' +
      'First, the **absolute value** $ |x| $ — it strips the minus sign off a number, so the output is never ' +
      'negative. The graph is a sharp **V**: really two straight lines glued at the origin, $ y = -x $ on the ' +
      'left and $ y = x $ on the right.',
  }),
  b('math_graph', 2, {
    title: 'Play: the V of |x|',
    caption: 'Drag x. The readout tells you which straight piece is doing the work.',
    archetype: 'piecewise-highlight',
  }),
  b('text', 3, {
    markdown:
      'Next, the **reciprocal** $ y = \\dfrac{1}{x} $ — a **hyperbola** in two branches. As $ x $ shrinks toward ' +
      '0 the curve races off toward infinity; far out, it flattens toward the x-axis. It never touches either ' +
      'axis, and it has a hole at $ x = 0 $ (you can’t divide by zero).',
  }),
  b('math_graph', 4, {
    title: 'Play: the hyperbola 1/x',
    caption: 'Two branches that hug the axes but never cross them.',
    spec: {
      bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
      functions: [{ expr: '1/x', color: 'sky' }],
      showGrid: true, showAxes: true, keepSquare: true,
    },
  }),
  b('text', 5, {
    markdown:
      'Last, the **square-root** curve $ y = \\sqrt{x} $ — half a sideways parabola. It only lives where $ x \\ge 0 $ ' +
      '(no real square roots of negatives), so the graph simply doesn’t exist to the left of the origin. It rises ' +
      'fast at first, then eases off.',
  }),
  b('math_graph', 6, {
    title: 'Play: the square-root curve',
    caption: 'It starts at the origin and only goes right — nothing exists for x < 0.',
    height: 320,
    spec: {
      bounds: { xmin: -2, xmax: 9, ymin: -2, ymax: 5 },
      functions: [{ expr: 'sqrt(x)', color: 'emerald' }],
      showGrid: true, showAxes: true, keepSquare: false,
    },
  }),
  b('curiosity_prompt', 7, {
    prompt: 'Look at $ \\sqrt{x} $ and $ 1/x $. Both “refuse” certain x-values. Which x is banned from each, and why?',
    reveal:
      '$ \\sqrt{x} $ bans every **negative** $ x $ (no real square root of a negative). $ 1/x $ bans only ' +
      '$ x = 0 $ (division by zero). Noticing *where a graph doesn’t exist* is how you’ll read off a domain later.',
  }),
  b('text', 8, {
    markdown:
      'That’s the whole cast of base shapes. Here’s the powerful part: you almost never need a *new* shape. You ' +
      'take one of these and **move it**. Let’s start sliding.',
  }),
];

/* ── Page 3 — Sliding Graphs Around ──────────────────────────────────────── */
const p3 = [
  b('image', 0, {
    src: '', alt: 'A parabola shown sliding up, down, left and right as ghost copies, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). One bright violet parabola in the centre with faint ghost copies of ' +
      'itself slid up, down, left and right, arrows suggesting the motion. Deep near-black background, elegant ' +
      'graphing poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'The simplest move is a **slide** (mathematicians say *translation*) — pick up a graph and set it down ' +
      'somewhere else, same shape, new spot. Two dials:\n\n' +
      '- **$ k $** (outside the function) slides it **up or down**: $ f(x) + k $.\n' +
      '- **$ h $** (inside, with $ x $) slides it **left or right**: $ f(x - h) $.\n\n' +
      'The up/down one behaves how you’d expect. The left/right one has a famous twist — so don’t take my word ' +
      'for it, drag it and watch.',
  }),
  b('math_graph', 2, {
    title: 'Play: slide the parabola',
    caption: 'The faint curve is the original x². Drag k to move up/down, h to move left/right.',
    archetype: 'shift-explorer',
    archetype_params: { base: 'square' },
  }),
  b('curiosity_prompt', 3, {
    prompt: 'Set h to a positive number like 3. Which way did the graph go — the way you expected, or the opposite?',
    reveal:
      'The opposite! $ f(x - 3) $ slides the graph **right** by 3, even though it looks like a minus. Anything ' +
      '*inside* the bracket with $ x $ works “backwards”. This one surprises almost everyone — which is exactly ' +
      'why seeing it beats memorising it.',
  }),
  b('text', 4, {
    markdown:
      'The same two dials slide **any** shape, not just the parabola. Here’s the V of $ |x| $ — watch its sharp ' +
      'corner move wherever you send it.',
  }),
  b('math_graph', 5, {
    title: 'Play: slide the V',
    caption: 'Same idea, different shape. Send the corner anywhere with h and k.',
    archetype: 'shift-explorer',
    archetype_params: { base: 'abs' },
  }),
  b('text', 6, {
    markdown:
      'Notice you didn’t learn a new graph — you *reused* one you already knew, moved. That’s the whole trick.\n\n' +
      'Sliding keeps the shape and size the same. Next we’ll **stretch, squash and flip** — the moves that change ' +
      'how tall, wide, or which-way-up a graph is.',
  }),
];

/* ── Page 4 — Stretching & Flipping ──────────────────────────────────────── */
const p4 = [
  b('image', 0, {
    src: '', alt: 'A parabola shown stretched tall, squashed wide, and flipped upside down, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). One parabola shown three ways — stretched tall and narrow, squashed ' +
      'wide and shallow, and flipped upside-down into a dome — as glowing violet curves with faint ghost ' +
      'originals. Deep near-black background, elegant graphing poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Two more dials change a graph’s *size and orientation*:\n\n' +
      '- **$ a $** (outside): multiplies the height. $ a > 1 $ **stretches** the graph taller; $ 0 < a < 1 $ ' +
      '**squashes** it flatter; and a **negative $ a $ flips it upside down** (a mirror across the x-axis).\n' +
      '- **$ b $** (inside, with $ x $): squeezes the graph **sideways**, and a negative $ b $ flips it left-to-right.',
  }),
  b('math_graph', 2, {
    title: 'Play: stretch, squash and flip',
    caption: 'The faint curve is the original x². Drag a (tall/short/flip) and b (wide/narrow/flip).',
    archetype: 'stretch-explorer',
    archetype_params: { base: 'square' },
  }),
  b('curiosity_prompt', 3, {
    prompt: 'Drag a below zero. What happens to the bowl — and can you make it a dome?',
    reveal:
      'A negative $ a $ **flips the whole graph upside down** across the x-axis, turning the bowl into a dome. ' +
      'The bigger the size of $ a $, the taller and narrower it looks; between 0 and 1 it goes flat and wide.',
  }),
  b('text', 4, {
    markdown:
      'Flipping works on every shape. Try it on the square-root curve — a negative $ a $ mirrors it below the ' +
      'axis, a negative $ b $ swings it to the left side.',
  }),
  b('math_graph', 5, {
    title: 'Play: stretch and flip the square-root curve',
    caption: 'Send it up or down with a, and left or right with b.',
    archetype: 'stretch-explorer',
    archetype_params: { base: 'sqrt' },
  }),
  b('text', 6, {
    markdown:
      'You now have all four moves — slide up/down ($ k $), slide left/right ($ h $), stretch/flip vertically ' +
      '($ a $), squeeze/flip horizontally ($ b $). The last page puts them on one graph, all at once.',
  }),
];

/* ── Page 5 — Putting It All Together ────────────────────────────────────── */
const p5 = [
  b('image', 0, {
    src: '', alt: 'A single control panel of four sliders reshaping one curve, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A sleek control panel with four glowing sliders on the left, wired to ' +
      'one violet curve on the right that is simultaneously stretched, shifted and flipped — the full ' +
      'transformation machine. Faint ghost of the original curve behind it. Deep near-black background, elegant ' +
      'instrument-panel style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Every transformed graph you’ll ever meet fits one template:\n\n' +
      '$ y = a\\,f\\big(b(x - h)\\big) + k $\n\n' +
      'Four dials, four jobs: **$ a $** stretches/flips up-down, **$ b $** squeezes/flips left-right, **$ h $** ' +
      'slides left-right, **$ k $** slides up-down. Now that you’ve felt each one on its own, here they are ' +
      'together on the parabola. Play first — then there’s one gentle question, now that you’ve earned it.',
  }),
  b('math_graph', 2, {
    title: 'Play: the full transformer',
    caption: 'The faint curve is x². Move a, b, h, k and watch your graph respond.',
    height: 380,
    archetype: 'transformations',
    archetype_params: { base: 'square' },
    predict: {
      prompt: 'You’ve seen it happen: compared with x², which way does $ (x + 3)^2 $ move the graph?',
      options: ['3 units LEFT', '3 units RIGHT', '3 units UP'],
      answer_index: 0,
      reveal:
        'LEFT — the inside-the-bracket twist you met on the sliding page. $ f(x + 3) $ shifts left. (In the ' +
        'tool, that’s $ x - h $ with $ h = -3 $.) You predicted this because you’d already *seen* it — that’s ' +
        'the whole point of meeting the graphs first.',
    },
  }),
  b('callout', 3, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'The one rule worth burning in: **changes *inside* the bracket run backwards.**\n\n' +
      '- $ f(x - 3) $ → right 3;  $ f(x + 3) $ → left 3.\n' +
      '- Changes *outside* behave normally: $ +k $ up, $ \\times a $ taller, $ -f(x) $ flips down.',
  }),
  b('text', 4, {
    markdown:
      'That’s it — you’ve met the graphs. From here on, when a function shows up in Relations & Functions, in ' +
      'Trigonometry, in Limits, you won’t be staring at a stranger. One quick recognition workout, and you’re ' +
      'ready for the syllabus proper.',
  }),
];

/* ── Page 6 — Name That Graph (recognition drill) ────────────────────────── */
const p6 = [
  b('image', 0, {
    src: '', alt: 'A quiz-show style line-up of graph shapes waiting to be named, dark background', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A game-show line-up of glowing graph shapes on stands — a V, a bowl, ' +
      'an S, a hyperbola — spotlit as if waiting to be identified. Deep near-black background, playful but ' +
      'elegant, violet and amber glow. No text.',
  }),
  b('text', 1, {
    markdown:
      'Now the fun part — a quick recognition workout. This time *do* try to answer before checking; you’ve done ' +
      'the looking, so your instinct is worth trusting. If one trips you up, flip back a page and drag the ' +
      'slider again — that’s exactly how it’s meant to work.',
  }),
  b('reasoning_prompt', 2, {
    reasoning_type: 'spatial',
    prompt: 'A graph is a sharp V with its corner at the origin. Which function is it?',
    options: ['$ y = x^2 $', '$ y = |x| $', '$ y = 1/x $', '$ y = \\sqrt{x} $'],
    reveal: 'The sharp corner is the giveaway — smooth curves like $ x^2 $ have no corner. A V is the absolute value $ |x| $.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 3, {
    pass_threshold: 0.7,
    questions: [
      q('Which equation makes an S-shaped curve that dips below the axis on the left?',
        ['$ y = x^2 $', '$ y = x^3 $', '$ y = |x| $', '$ y = \\sqrt{x} $'],
        1,
        'Odd powers like $ x^3 $ make the S-shape (symmetric about the origin). $ x^2 $ is a bowl, $ |x| $ a V, and $ \\sqrt{x} $ only exists for $ x \\ge 0 $.',
        1),
      q('The graph of $ y = (x - 4)^2 $ is the parabola $ y = x^2 $ moved…',
        ['4 left', '4 right', '4 up', '4 down'],
        1,
        'Inside the bracket runs backwards: $ x - 4 $ slides the bowl 4 to the **right**, so its lowest point moves from $ (0,0) $ to $ (4, 0) $.',
        2),
      q('Which graph never touches the x- or y-axis and has a hole at $ x = 0 $?',
        ['$ y = |x| $', '$ y = 1/x $', '$ y = x^2 $', '$ y = \\sqrt{x} $'],
        1,
        'That’s the hyperbola $ y = 1/x $ — two branches that hug the axes without ever meeting them, undefined at $ x = 0 $.',
        1),
      q('Compared with $ y = x^2 $, the graph of $ y = -x^2 + 2 $ is…',
        ['A taller, right-shifted bowl', 'An upside-down bowl (dome) lifted 2 up', 'A bowl slid 2 left', 'The same graph'],
        1,
        'The minus flips the bowl into a dome (reflection across the x-axis); the $ +2 $ then lifts it up by 2. Its peak sits at $ (0, 2) $.',
        2),
      q('The graph of $ y = |x - 2| + 1 $ has its corner at…',
        ['$ (2, 1) $', '$ (-2, 1) $', '$ (2, -1) $', '$ (0, 0) $'],
        0,
        '$ x - 2 $ slides the V right by 2; $ +1 $ lifts it up by 1. The corner moves from the origin to $ (2, 1) $.',
        3),
    ],
  }),
  b('text', 4, {
    markdown:
      '**Well played.** You now carry a mental gallery of shapes and know how each dial moves them. Keep this ' +
      'chapter handy — whenever a graph in a later topic looks unfamiliar, it’s almost always one of these six ' +
      'shapes wearing a disguise. Next stop: **Relations and Functions**, where these shapes get their formal ' +
      'names and rules.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const now = new Date();

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book class11-mathematics not found — run the Ch.2 build first');

    if (!book.chapters.some((c) => c.slug === CH.slug)) {
      await books.updateOne({ _id: book._id }, {
        $push: { chapters: { number: CH.number, title: CH.title, slug: CH.slug, page_ids: [], description: CH.description, is_published: false } },
        $set: { updated_at: now },
      });
      console.log('added chapter', CH.number, CH.title);
    } else {
      console.log('chapter exists:', CH.title);
    }

    const PAGES = [
      { slug: 'meet-the-graphs-opener', title: 'Meet the Graphs', subtitle: 'See before you solve — get comfortable with the shapes. No tests, just play.', page_number: 0, page_type: 'chapter_opener', blocks: p0 },
      { slug: 'lines-and-parabolas', title: 'Straight Lines & Parabolas', subtitle: 'The two shapes you’ll meet most — and the power family behind them.', page_number: 1, blocks: p1 },
      { slug: 'the-odd-ones-out', title: 'The Odd Ones Out', subtitle: 'The V, the hyperbola and the square-root curve — the “strange” shapes, made familiar.', page_number: 2, blocks: p2 },
      { slug: 'sliding-graphs', title: 'Sliding Graphs Around', subtitle: 'Pick a shape up and set it down somewhere else — up, down, left, right.', page_number: 3, blocks: p3 },
      { slug: 'stretching-and-flipping', title: 'Stretching & Flipping', subtitle: 'Make a graph taller, wider, or upside down.', page_number: 4, blocks: p4 },
      { slug: 'putting-it-all-together', title: 'Putting It All Together', subtitle: 'All four dials on one graph — a·f(b(x−h))+k, now that you’ve earned it.', page_number: 5, blocks: p5 },
      { slug: 'name-that-graph', title: 'Name That Graph', subtitle: 'A quick recognition workout — trust your eyes.', page_number: 6, blocks: p6 },
    ];

    for (const p of PAGES) {
      const existing = await pagesCol.findOne({ book_id: book._id, slug: p.slug });
      if (existing) { console.log('  page exists, skipping:', p.slug); continue; }
      const doc = {
        _id: uuidv4(), book_id: book._id, chapter_number: CH.number, page_number: p.page_number,
        slug: p.slug, title: p.title, subtitle: p.subtitle, blocks: p.blocks,
        page_type: p.page_type || 'lesson', published: false,
        reading_time_min: computeReadingTime(p.blocks), content_types: computeContentTypes(p.blocks),
        tags: [], deleted_at: null, created_at: now, updated_at: now,
      };
      await pagesCol.insertOne(doc);
      console.log('  created page', p.page_number, '·', p.slug, '·', doc.reading_time_min, 'min ·', (doc.content_types.join('/') || '—'));
    }
    const all = await pagesCol.find({ book_id: book._id, chapter_number: CH.number, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
    all.sort((a, c) => a.page_number - c.page_number);
    await books.updateOne({ _id: book._id, 'chapters.slug': CH.slug }, { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } });
    console.log('  chapter page_ids set:', all.length, 'pages');
  });
  console.log('Chapter 0 "Meet the Graphs" DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
