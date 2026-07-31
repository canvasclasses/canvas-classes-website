'use strict';
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_ID = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
const CHAPTER_NUMBER = 2;
const OLD_PAGE_ID = '924d51d0-a7e5-4908-a55b-618915240199';
const OLD_SLUG = 'planck-quantum-photoelectric';
const NEW_SLUG = 'photoelectric-effect';

const NEW_HERO_PROMPT =
  'A wide hand-drawn coloured illustration on a deep charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream), ' +
  'no glow, no neon, no orange haze, no 3D render look, no lens flare. Ultra-wide scene: on the left, a smooth continuous ochre ramp curving gently upward, ' +
  'suggesting the old, unbroken flow of classical energy. Moving rightward, the same ramp gradually resolves into a series of discrete cream-coloured ' +
  'rectangular steps of equal height, like a staircase, each block distinctly separated from the next by a thin dark gap. A few small indigo dots sit on top ' +
  'of alternating steps, as if resting on solid, countable packets rather than a continuous slope. The composition conveys the central idea: energy that once ' +
  'seemed to flow smoothly actually arrives in fixed, indivisible amounts. Clean, textured brush strokes, warm and inviting, textbook-illustration feel, ' +
  'not photorealistic, not glossy, no sci-fi lighting. No text, no labels, no arrows.';

const NEW_PHOTOELECTRIC_QUESTION = {
  id: uuidv4(),
  question: 'The work function of a metal is the minimum energy needed to...',
  options: [
    "eject an electron from the metal's surface",
    "raise the metal's temperature by 1°C",
    'break a single chemical bond in the metal lattice',
    'ionise a gas atom near the metal surface',
  ],
  correct_index: 0,
  explanation:
    "Work function (φ) is specifically the minimum energy required to free the most loosely bound electron from a metal surface — it's a property " +
    'of the metal, not of temperature, bonding, or a nearby gas.',
  difficulty_level: 1,
};

(async () => {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const books = db.collection('books');
    const now = new Date();

    const oldPage = await pages.findOne({ _id: OLD_PAGE_ID });
    if (!oldPage) throw new Error('original page not found');
    const byOrder = Object.fromEntries(oldPage.blocks.map((b) => [b.order, b]));

    const oldQuiz = byOrder[65];
    if (!oldQuiz || oldQuiz.type !== 'inline_quiz') throw new Error('quiz block not at expected order 65');

    // ── PAGE A: Planck's Quantum Theory (trim the existing page) ──────────
    const planckOrders = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33];
    const newHero = {
      id: uuidv4(), order: 0, type: 'image', src: '',
      alt: 'A smooth continuous ramp resolving into discrete evenly-spaced steps, representing energy arriving in fixed packets rather than a continuous flow.',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: NEW_HERO_PROMPT,
    };
    const workedHeading = { id: uuidv4(), order: 0, type: 'heading', level: 2, text: 'Worked Examples' };
    const planckQuiz = {
      id: uuidv4(), order: 0, type: 'inline_quiz', pass_threshold: oldQuiz.pass_threshold,
      questions: [0, 1, 4].map((i) => oldQuiz.questions[i]),
    };

    let planckBlocks = [newHero, ...planckOrders.map((o) => byOrder[o]), workedHeading, byOrder[60], byOrder[61], planckQuiz];
    planckBlocks = planckBlocks.map((b, i) => ({ ...b, order: i }));

    const dryA = await bw.savePage(db, { pageId: OLD_PAGE_ID }, planckBlocks, { dryRun: true });
    console.log('PAGE A dry run:', JSON.stringify(dryA.diff));

    await bw.savePage(db, { pageId: OLD_PAGE_ID }, planckBlocks, {
      author: 'agent',
      summary: "Split page: keep only Planck's Quantum Theory content (photoelectric content moves to new page 'photoelectric-effect')",
      allowContentLoss: true,
      lossReason: "Founder-approved page split — removed blocks are not deleted, they move verbatim to the new 'photoelectric-effect' page created in the same operation",
    });

    await pages.updateOne(
      { _id: OLD_PAGE_ID },
      {
        $set: {
          title: "Planck's Quantum Theory",
          subtitle: 'How four stubborn experiments broke classical physics — and why energy comes in indivisible packets',
          tags: ['Planck', 'quantum', 'black body radiation', 'ultraviolet catastrophe', 'E = hν', 'Wien displacement law', 'Stefan-Boltzmann', 'bulb evolution', 'LED'],
          updated_at: now,
        },
      }
    );
    console.log('PAGE A saved: title/subtitle/tags updated, blocks trimmed to', planckBlocks.length);

    // ── PAGE B: The Photoelectric Effect (new page) ────────────────────────
    const photoOrders = [34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];
    const movedHero = { ...byOrder[0], order: 0 };
    const photoQuiz = {
      id: uuidv4(), order: 0, type: 'inline_quiz', pass_threshold: oldQuiz.pass_threshold,
      questions: [oldQuiz.questions[2], oldQuiz.questions[3], NEW_PHOTOELECTRIC_QUESTION],
    };

    let photoBlocks = [movedHero, ...photoOrders.map((o) => byOrder[o]), byOrder[62], byOrder[63], byOrder[64], photoQuiz];
    photoBlocks = photoBlocks.map((b, i) => ({ ...b, order: i }));

    const newDoc = {
      _id: uuidv4(),
      book_id: BOOK_ID,
      chapter_number: CHAPTER_NUMBER,
      page_number: -1, // placeholder; fixed by the renumber pass below
      slug: NEW_SLUG,
      title: 'The Photoelectric Effect',
      subtitle: "Einstein's 1905 explanation of how light knocks electrons off metal — and the experimental proof that light is also a particle",
      blocks: photoBlocks,
      page_type: oldPage.page_type,
      published: true,
      reading_time_min: bw.computeReadingTime(photoBlocks),
      content_types: bw.computeContentTypes(photoBlocks),
      tags: ['photon', 'photoelectric effect', 'Einstein', 'Hertz', 'work function', 'threshold frequency', 'dual nature of light'],
      deleted_at: null,
      created_at: now,
      updated_at: now,
    };
    await pages.insertOne(newDoc);
    console.log('PAGE B created:', NEW_SLUG, '·', newDoc.reading_time_min, 'min ·', photoBlocks.length, 'blocks');

    // ── Splice new page id into chapter.page_ids (order within array doesn't matter — page_number does) ──
    const book = await books.findOne({ _id: BOOK_ID });
    const chapter = book.chapters.find((c) => c.number === CHAPTER_NUMBER);
    if (!chapter) throw new Error('chapter not found');
    await books.updateOne(
      { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
      { $push: { 'chapters.$.page_ids': newDoc._id }, $set: { updated_at: now } }
    );
    console.log('chapter.page_ids updated (appended new page id)');

    // ── Renumber: PAGE B must sit at page_number = (old PAGE A page_number + 1); ──
    // everything from there onward shifts up by 1. Two-phase (placeholder then
    // fill) because (book_id, chapter_number, page_number) is a unique index —
    // same pattern as scripts/fix_poac_page_number_order.js.
    const list = await pages.find(
      { book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, _id: { $ne: newDoc._id } },
      { projection: { slug: 1, page_number: 1 } }
    ).sort({ page_number: 1 }).toArray();

    const anchorIdx = list.findIndex((p) => p.slug === OLD_SLUG);
    if (anchorIdx === -1) throw new Error('anchor (old planck page) not found in list');

    const targetOrder = [...list.slice(0, anchorIdx + 1), { slug: NEW_SLUG, _id: newDoc._id }, ...list.slice(anchorIdx + 1)];
    const moves = targetOrder.map((p, i) => ({ slug: p.slug, id: p._id, to: i }));

    const setPageNumber = async (idOrSlugFilter, pageNumber) => {
      await pages.updateOne({ book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, ...idOrSlugFilter }, { $set: { page_number: pageNumber, updated_at: now } });
    };

    // Park the new page on a placeholder first.
    await setPageNumber({ _id: newDoc._id }, -1);
    // Shift every OTHER page from highest current page_number down to lowest,
    // so each target slot is vacated just before something needs to occupy it.
    const otherMovesDesc = moves
      .filter((m) => m.slug !== NEW_SLUG)
      .map((m) => ({ ...m, from: list.find((p) => p.slug === m.slug).page_number }))
      .sort((a, b) => b.from - a.from);
    for (const m of otherMovesDesc) {
      if (m.from !== m.to) {
        await setPageNumber({ slug: m.slug }, m.to);
        console.log(`  ${m.slug}: page_number ${m.from} -> ${m.to}`);
      }
    }
    const newPageTarget = moves.find((m) => m.slug === NEW_SLUG).to;
    await setPageNumber({ _id: newDoc._id }, newPageTarget);
    console.log(`  ${NEW_SLUG}: page_number -1 -> ${newPageTarget} (final)`);

    console.log('\nDone. Chapter', CHAPTER_NUMBER, 'renumbered,', moves.length, 'total pages in sequence.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
