// Migration script: Class 9 Physics — Full Curriculum Restructure
//
// OLD → NEW chapter number mapping:
//   Ch 1  Motion                  → Ch 9
//   Ch 2  Force and Laws of Motion→ Ch 10
//   Ch 3  Gravitation             → Ch 13  (curriculum note: removed from core, kept as supplementary)
//   Ch 4  Work and Energy         → Ch 11  (expanded to "Work, Energy, and Simple Machines")
//   NEW   Sound                   → Ch 12
//
// All new content pages are created EMPTY (blocks: []).
// Existing simulation pages are kept and re-numbered to their new chapter numbers.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-physics';

// ─── Chapter renaming map ────────────────────────────────────────────────────
const CHAPTER_RENAMES = [
  { oldNum: 1, newNum: 9,  newTitle: 'Motion' },
  { oldNum: 2, newNum: 10, newTitle: 'Force and Laws of Motion' },
  { oldNum: 3, newNum: 13, newTitle: 'Gravitation' },
  { oldNum: 4, newNum: 11, newTitle: 'Work, Energy, and Simple Machines' },
];

// ─── New content pages (empty) for each chapter ──────────────────────────────
// These are the CONTENT pages based on the new curriculum chapter structure.
// Simulation pages already created earlier remain in the chapter alongside these.

const NEW_PAGES = {

  9: [
    { slug: 'motion-reference-frames',    title: 'What is motion? — Reference frames and relative motion',        pageNo: 1 },
    { slug: 'distance-vs-displacement',   title: 'Distance vs. Displacement — Why direction matters',             pageNo: 2 },
    { slug: 'speed-vs-velocity',          title: 'Speed vs. Velocity — Scalar and vector unpacked',               pageNo: 3 },
    { slug: 'acceleration-real-world',    title: 'Acceleration — When velocity changes',                          pageNo: 4 },
    { slug: 'uniform-circular-motion',    title: 'Uniform circular motion — Moving in circles at constant speed', pageNo: 5 },
    { slug: 'position-time-graphs',       title: 'Position-time graphs — Reading and interpreting',               pageNo: 6 },
    { slug: 'velocity-time-graphs',       title: 'Velocity-time graphs — What the slope tells you',               pageNo: 7 },
    { slug: 'kinematic-equations',        title: 'Kinematic equations — Derived from graphs, not memorised',      pageNo: 8 },
    { slug: 'solving-motion-problems',    title: 'Solving motion problems — Step-by-step worked examples',        pageNo: 9 },
    { slug: 'motion-in-everyday-life',    title: 'Motion in everyday life — Cricket, driving, and cycling',       pageNo: 10 },
  ],

  10: [
    { slug: 'what-is-force',              title: "What is force? — Magnitude, direction, and effects",            pageNo: 1 },
    { slug: 'balanced-unbalanced-forces', title: "Balanced and unbalanced forces — When things move and when they don't", pageNo: 2 },
    { slug: 'friction',                   title: 'Friction — The force we love to ignore',                        pageNo: 3 },
    { slug: 'newtons-first-law',          title: "Newton's First Law — Inertia in action",                        pageNo: 4 },
    { slug: 'newtons-second-law-ch10',    title: "Newton's Second Law — F = ma unpacked",                         pageNo: 5 },
    { slug: 'si-unit-of-force',           title: 'The SI unit of force — The Newton defined',                     pageNo: 6 },
    { slug: 'newtons-third-law-ch10',     title: "Newton's Third Law — Action and reaction everywhere around us",  pageNo: 7 },
    { slug: 'applying-newtons-laws',      title: "Applying Newton's laws — Vehicles, sports, space",              pageNo: 8 },
    { slug: 'newtons-laws-as-model',      title: "Newton's laws as a model — Predicting and testing",             pageNo: 9 },
  ],

  11: [
    { slug: 'work-definition',            title: 'Work — The scientific definition vs. everyday meaning',          pageNo: 1 },
    { slug: 'work-energy-theorem',        title: 'The work-energy theorem — How work and kinetic energy connect',  pageNo: 2 },
    { slug: 'forms-of-energy',            title: 'Forms of energy — A survey of energy around us',                 pageNo: 3 },
    { slug: 'kinetic-energy-derivation',  title: 'Kinetic energy — Deriving the formula from first principles',    pageNo: 4 },
    { slug: 'potential-energy',           title: 'Potential energy — Stored energy and how to calculate it',       pageNo: 5 },
    { slug: 'conservation-of-energy-ch11','title': 'Conservation of energy — Free fall as the perfect example',   pageNo: 6 },
    { slug: 'power-work-rate',            title: 'Power — How fast work gets done',                                pageNo: 7 },
    { slug: 'simple-machines',            title: 'Simple machines — The idea of mechanical advantage',             pageNo: 8 },
    { slug: 'levers',                     title: 'Levers — Three classes with everyday Indian examples',            pageNo: 9 },
    { slug: 'pulleys',                    title: 'Pulleys — How they multiply force',                              pageNo: 10 },
    { slug: 'inclined-planes',            title: 'Inclined planes — Ramps and their advantages',                   pageNo: 11 },
    { slug: 'machines-in-indian-life',    title: 'Machines in Indian traditional life — Charkha, well pulley, grinding stone', pageNo: 12 },
  ],

  12: [
    { slug: 'how-sound-is-produced',      title: 'How is sound produced? — Vibrations all around us',              pageNo: 1 },
    { slug: 'sound-needs-medium',         title: "Sound needs a medium — Why there's no sound in space",           pageNo: 2 },
    { slug: 'sound-as-longitudinal-wave', title: 'Sound as a longitudinal wave — Compressions and rarefactions',   pageNo: 3 },
    { slug: 'sound-wave-characteristics', title: 'Characteristics of sound waves — Wavelength, frequency, amplitude, speed', pageNo: 4 },
    { slug: 'time-period-and-frequency',  title: 'Time period and frequency — The inverse relationship',           pageNo: 5 },
    { slug: 'speed-of-sound',             title: 'Speed of sound — Deriving the expression and calculating it',    pageNo: 6 },
    { slug: 'pitch-and-loudness',         title: 'Pitch and loudness — How we perceive sound differently',         pageNo: 7 },
    { slug: 'audible-range',              title: 'The audible range — What humans hear vs. other animals',         pageNo: 8 },
    { slug: 'reflection-of-sound',        title: 'Reflection of sound — Echo and reverberation',                   pageNo: 9 },
    { slug: 'echolocation',               title: 'Echolocation — Bats, dolphins, and sonar',                       pageNo: 10 },
    { slug: 'sound-and-music',            title: 'Sound and music — Pitch, octave, and amplitude in Indian classical music', pageNo: 11 },
    { slug: 'cv-raman',                   title: "Sir C.V. Raman — India's greatest contribution to the science of light and sound", pageNo: 12 },
  ],
};

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db    = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found.`);
    console.log(`✓ Found book: ${book.title} (${book._id})\n`);

    const bookId = String(book._id);

    // ── Step 1: Renumber existing chapters ──────────────────────────────────
    console.log('── Step 1: Renaming chapter numbers ───────────────────────');
    for (const { oldNum, newNum, newTitle } of CHAPTER_RENAMES) {
      const ch = book.chapters.find(c => c.number === oldNum);
      if (!ch) {
        console.log(`  ⤷ Chapter ${oldNum} not found in book — skipping rename.`);
        continue;
      }
      if (ch.number === newNum) {
        console.log(`  ⤷ Chapter ${oldNum} already renumbered to ${newNum} — skipping.`);
        continue;
      }

      // Update chapter number + title in the book document
      await books.updateOne(
        { _id: book._id, 'chapters.number': oldNum },
        { $set: { 'chapters.$.number': newNum, 'chapters.$.title': newTitle } }
      );

      // Update chapter_number on all pages belonging to this chapter
      const { modifiedCount } = await pages.updateMany(
        { book_id: bookId, chapter_number: oldNum },
        { $set: { chapter_number: newNum } }
      );
      console.log(`  ✓ Ch${oldNum} → Ch${newNum} (${newTitle})  |  ${modifiedCount} page(s) updated`);
    }

    // Reload book to reflect renames before further updates
    const bookReloaded = await books.findOne({ _id: book._id });

    // ── Step 1b: Move old simulation pages to page_number 101–199 ───────────
    // The unique index on (book_id, chapter_number, page_number) means we must
    // free up 1–N before inserting new content pages with those numbers.
    console.log('\n── Step 1b: Reserving page_number slots for sim pages ──────');
    const simChapters = [9, 10, 11, 13];   // the renamed chapters that have old sim pages
    for (const chNum of simChapters) {
      // find pages with page_number <= 50 (original sim pages) and bump to 100+
      const simPages = await pages.find({
        book_id: bookId,
        chapter_number: chNum,
        page_number: { $lte: 50 },
      }).toArray();

      for (const sp of simPages) {
        const newPn = 100 + sp.page_number;
        // Check if 100+ slot already taken
        const collision = await pages.findOne({ book_id: bookId, chapter_number: chNum, page_number: newPn });
        if (collision) {
          console.log(`  ⤷ Ch${chNum} pn${newPn} already occupied — skipping renumber of "${sp.slug}"`);
          continue;
        }
        await pages.updateOne({ _id: sp._id }, { $set: { page_number: newPn } });
        console.log(`  ✓ Ch${chNum}  "${sp.slug}"  pn ${sp.page_number} → ${newPn}`);
      }
    }

    // ── Step 2: Create new empty content pages ───────────────────────────────
    console.log('\n── Step 2: Creating new content pages ─────────────────────');
    for (const [chNumStr, pageDefs] of Object.entries(NEW_PAGES)) {
      const chNum = Number(chNumStr);
      const addedIds = [];

      for (const p of pageDefs) {
        const existing = await pages.findOne({ book_id: bookId, slug: p.slug });
        if (existing) {
          console.log(`  ⤷ Page "${p.slug}" already exists — skipping.`);
          addedIds.push(String(existing._id));
          continue;
        }
        const pageId = uuidv4();
        await pages.insertOne({
          _id: pageId,
          book_id: bookId,
          chapter_number: chNum,
          page_number: p.pageNo,
          slug: p.slug,
          title: p.title,
          blocks: [],          // empty — content to be added later
          tags: [],
          published: false,
          reading_time_min: 0,
        });
        addedIds.push(pageId);
        console.log(`  ✓ Ch${chNum} p${p.pageNo}  ${p.slug}`);
      }

      // ── Link pages to the chapter ──────────────────────────────────────────
      const existingCh = bookReloaded.chapters.find(c => c.number === chNum);
      if (existingCh) {
        // Append only new IDs
        const toAdd = addedIds.filter(id => !existingCh.page_ids.includes(id));
        if (toAdd.length) {
          await books.updateOne(
            { _id: book._id, 'chapters.number': chNum },
            { $push: { 'chapters.$.page_ids': { $each: toAdd } } }
          );
        }
      } else {
        // Chapter doesn't exist yet → create it (Ch12 Sound)
        await books.updateOne(
          { _id: book._id },
          {
            $push: {
              chapters: {
                number: chNum,
                title: chNum === 12 ? 'Sound' : `Chapter ${chNum}`,
                is_published: false,
                page_ids: addedIds,
              },
            },
          }
        );
        console.log(`  ✓ Created new Chapter ${chNum} in book`);
      }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    const finalBook = await books.findOne({ _id: book._id });
    console.log('\n══ Final chapter state ══════════════════════════════════');
    const sorted = [...finalBook.chapters].sort((a, b) => a.number - b.number);
    for (const ch of sorted) {
      console.log(`  Ch${String(ch.number).padEnd(3)} ${ch.title.padEnd(46)} (${ch.page_ids.length} pages)`);
    }

    const totalPages = await pages.countDocuments({ book_id: bookId });
    console.log(`\nTotal pages in DB for this book: ${totalPages}`);
    console.log('\n✅ Restructure complete.');
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
