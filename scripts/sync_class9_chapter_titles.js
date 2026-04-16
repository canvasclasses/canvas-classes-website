'use strict';
/**
 * Sync Class 9 chapter titles to the canonical curriculum sequence.
 *
 * Operations:
 *  1. Update science book chapter titles to match exact image sequence
 *  2. Rename math book to "Class 9 Mathematics — NCERT Simplified"
 *     and fix Ch4 title to full name
 *  3. Unpublish the physics book (content is already in science book;
 *     Gravitation chapter preserved in DB for future use)
 *
 * Safe to re-run — all updates are idempotent.
 * Run: node scripts/sync_class9_chapter_titles.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const SCIENCE_BOOK_ID  = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const MATH_BOOK_ID     = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const PHYSICS_BOOK_ID  = '50d762c0-909d-44c2-b189-3d68194fe6dc';

// ── Canonical chapter titles from the curriculum image ──────────────────────

const SCIENCE_TITLE_UPDATES = {
  0:  'Introductory Theme',
  1:  'Cell',
  2:  'Tissues',
  3:  'Reproduction',
  4:  'Diversity of Life',                                 // already correct
  5:  'Mixtures and Their Separation',
  6:  'Structure of the Atom',                             // already correct
  7:  'Atoms and Molecules',                               // already correct
  8:  'Earth as a System: Energy, Matter and Life',
  9:  'Motion',                                            // already correct
  10: 'Force and Laws of Motion',                          // already correct
  11: 'Work, Energy and Simple Machines',
  12: 'Sound',                                             // already correct
};

const MATH_TITLE_UPDATES = {
  1:  'Coordinate Geometry',
  2:  'Introduction to Polynomials',
  3:  'Number Systems',
  4:  "Introduction to Euclid's Geometry: Axioms and Postulates",
  5:  'Lines and Angles',
  6:  'Sequences and Progressions',
  7:  'Triangles: Congruence Theorems',
  8:  'Mensuration: Area and Perimeter',
  9:  'Exploring Algebraic Identities',
  10: '4-gons (Quadrilaterals)',
  11: 'Circles',
  12: 'Linear Equations in Two Variables',
  13: 'Mensuration: Surface Area and Volume',
  14: 'Statistics',
  15: 'Introduction to Probability',
};

// ── Helper: update chapter titles in a book ──────────────────────────────────

async function updateChapterTitles(books, bookId, titleMap, bookLabel) {
  const book = await books.findOne({ _id: bookId });
  if (!book) throw new Error(`${bookLabel} (${bookId}) not found`);

  let changed = 0;
  const updatedChapters = book.chapters.map(ch => {
    const newTitle = titleMap[ch.number];
    if (!newTitle) {
      console.log(`  ⤷ ${bookLabel} Ch${ch.number}: no mapping — kept as "${ch.title}"`);
      return ch;
    }
    if (ch.title === newTitle) {
      console.log(`  ✓ ${bookLabel} Ch${ch.number}: already correct — "${ch.title}"`);
      return ch;
    }
    console.log(`  ✏  ${bookLabel} Ch${ch.number}: "${ch.title}" → "${newTitle}"`);
    changed++;
    return { ...ch, title: newTitle };
  });

  if (changed > 0) {
    await books.updateOne(
      { _id: bookId },
      { $set: { chapters: updatedChapters, updated_at: new Date() } }
    );
    console.log(`  → ${changed} chapter title(s) updated\n`);
  } else {
    console.log(`  → No changes needed\n`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db    = client.db('crucible');
    const books = db.collection('books');

    // ── 1. Science book chapter titles ──────────────────────────────────────
    console.log('── 1. Updating Class 9 Science chapter titles ──────────────');
    await updateChapterTitles(books, SCIENCE_BOOK_ID, SCIENCE_TITLE_UPDATES, 'Science');

    // ── 2. Math book: rename + fix chapter titles ────────────────────────────
    console.log('── 2. Updating Class 9 Mathematics book ────────────────────');
    const mathBook = await books.findOne({ _id: MATH_BOOK_ID });
    if (!mathBook) throw new Error(`Math book ${MATH_BOOK_ID} not found`);

    if (mathBook.title !== 'Class 9 Mathematics — NCERT Simplified') {
      await books.updateOne(
        { _id: MATH_BOOK_ID },
        { $set: { title: 'Class 9 Mathematics — NCERT Simplified', updated_at: new Date() } }
      );
      console.log(`  ✏  Renamed: "${mathBook.title}" → "Class 9 Mathematics — NCERT Simplified"`);
    } else {
      console.log(`  ✓ Title already correct`);
    }
    await updateChapterTitles(books, MATH_BOOK_ID, MATH_TITLE_UPDATES, 'Math');

    // ── 3. Unpublish the physics book ────────────────────────────────────────
    console.log('── 3. Archiving NCERT Physics — Class 9 ────────────────────');
    const physBook = await books.findOne({ _id: PHYSICS_BOOK_ID });
    if (!physBook) throw new Error(`Physics book ${PHYSICS_BOOK_ID} not found`);

    if (physBook.is_published) {
      await books.updateOne(
        { _id: PHYSICS_BOOK_ID },
        { $set: { is_published: false, updated_at: new Date() } }
      );
      console.log(`  ✓ Unpublished "${physBook.title}" (Ch13 Gravitation preserved in DB)`);
    } else {
      console.log(`  ✓ Already unpublished — no change needed`);
    }

    // ── Final verification ───────────────────────────────────────────────────
    console.log('\n══ Verification ════════════════════════════════════════════');
    const science = await books.findOne({ _id: SCIENCE_BOOK_ID });
    const math    = await books.findOne({ _id: MATH_BOOK_ID });
    const physics = await books.findOne({ _id: PHYSICS_BOOK_ID });

    console.log(`\nScience book: "${science.title}" [${science.is_published ? '🟢 LIVE' : '⚪ DRAFT'}]`);
    [...science.chapters].sort((a,b) => a.number - b.number).forEach(ch => {
      console.log(`  Ch${String(ch.number).padEnd(3)} ${ch.title}`);
    });

    console.log(`\nMath book: "${math.title}" [${math.is_published ? '🟢 LIVE' : '⚪ DRAFT'}]`);
    [...math.chapters].sort((a,b) => a.number - b.number).forEach(ch => {
      console.log(`  Ch${String(ch.number).padEnd(3)} ${ch.title}`);
    });

    console.log(`\nPhysics book: "${physics.title}" [${physics.is_published ? '🟢 LIVE' : '⚪ DRAFT'}]`);
    console.log(`  (${physics.chapters.length} chapters preserved in DB, not visible to students)`);

    console.log('\n✅ All done.');
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
