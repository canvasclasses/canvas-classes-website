'use strict';
/**
 * Reorder + renumber the Class 9 Science book chapters to match the printed
 * Table of Contents, and shift from 0-indexed (Ch0..Ch12) to 1-indexed
 * (Ch1..Ch13).
 *
 * Mapping is keyed by EXACT chapter title (robust against the current numbers),
 * so re-running after a partial run is safe as long as the snapshot exists.
 *
 * Touches (scoped to book_slug='class9-science' / its book_id):
 *   - books.chapters[].number              (the 13 chapters, then re-sorted)
 *   - book_pages.chapter_number            (all pages)
 *   - book_progress.chapter_number         (denormalized display field)
 *   - book_bookmarks.chapter_number        (denormalized display field)
 *   - book_practice_attempts.chapter_number(denormalized grouping field)
 *
 * Page slugs, page_numbers, and page->chapter wiring (page_ids) are NOT changed.
 * Within-chapter order is preserved (sort is by chapter_number, then page_number).
 *
 * Safety:
 *   - Snapshots full current state to scripts/_snapshots/<ts>-class9-science.json
 *     before any write.
 *   - Two-phase offset (+1000 then final) so no transient unique-index collision.
 *
 * Usage:
 *   node scripts/reorder_class9_science_chapters.js              # apply
 *   node scripts/reorder_class9_science_chapters.js --dry        # preview only
 *   node scripts/reorder_class9_science_chapters.js --rollback <snapshot.json>
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const OFFSET = 1000;

// New 1-indexed order, exactly as the printed Contents page lists them.
const TARGET_ORDER = [
  'Exploration: Entering the World of Secondary Science',
  'Cell: The Building Block of Life',
  'Tissues in Action',
  'Describing Motion Around Us',
  'Exploring Mixtures and their Separation',
  'How Forces Affect Motion',
  'Work, Energy, and Simple Machines',
  'Journey Inside the Atom',
  'Atomic Foundations of Matter',
  'Sound Waves: Characteristics and Applications',
  'Reproduction: How Life Continues',
  'Patterns in Life: Diversity and Classification',
  'Earth as a System: Energy, Matter, and Life',
];

const USER_COLLECTIONS = ['book_progress', 'book_bookmarks', 'book_practice_attempts'];

async function rollback(client, file) {
  const snap = JSON.parse(fs.readFileSync(file, 'utf8'));
  const db = client.db('crucible');
  console.log(`↩  Rolling back from ${file} (taken ${snap.taken_at})`);

  // Restore book.chapters wholesale.
  await db.collection('books').updateOne(
    { _id: snap.book_id },
    { $set: { chapters: snap.book_chapters } }
  );

  // Restore each page's chapter_number by _id.
  for (const p of snap.pages) {
    await db.collection('book_pages').updateOne(
      { _id: p._id },
      { $set: { chapter_number: p.chapter_number } }
    );
  }

  // Restore user-data rows by _id.
  for (const coll of USER_COLLECTIONS) {
    for (const r of snap.user_rows[coll] || []) {
      await db.collection(coll).updateOne(
        { _id: r._id },
        { $set: { chapter_number: r.chapter_number } }
      );
    }
  }
  console.log('✅ Rollback complete.');
}

async function main() {
  const dry = process.argv.includes('--dry');
  const rbIdx = process.argv.indexOf('--rollback');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    if (rbIdx !== -1) {
      const file = process.argv[rbIdx + 1];
      if (!file) throw new Error('--rollback requires a snapshot file path');
      await rollback(client, file);
      return;
    }

    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book ${BOOK_SLUG} not found`);
    const bookId = String(book._id);

    // Build old->new map by exact title, and validate bijection.
    const titleToNew = new Map(TARGET_ORDER.map((t, i) => [t, i + 1]));
    const oldToNew = new Map();
    const seenTitles = new Set();
    for (const ch of book.chapters) {
      if (!titleToNew.has(ch.title)) {
        throw new Error(`Chapter title not in TARGET_ORDER: "${ch.title}"`);
      }
      if (seenTitles.has(ch.title)) throw new Error(`Duplicate title in book: "${ch.title}"`);
      seenTitles.add(ch.title);
      oldToNew.set(ch.number, titleToNew.get(ch.title));
    }
    if (book.chapters.length !== TARGET_ORDER.length) {
      throw new Error(`Book has ${book.chapters.length} chapters; TARGET_ORDER has ${TARGET_ORDER.length}`);
    }

    console.log('Old → New mapping:');
    for (const ch of [...book.chapters].sort((a, b) => a.number - b.number)) {
      console.log(`  Ch${String(ch.number).padEnd(2)} → Ch${String(oldToNew.get(ch.number)).padEnd(2)}  ${ch.title}`);
    }

    // --- Snapshot ---
    const allPages = await pages
      .find({ book_id: bookId })
      .project({ _id: 1, chapter_number: 1 })
      .toArray();
    const userRows = {};
    for (const coll of USER_COLLECTIONS) {
      userRows[coll] = await db
        .collection(coll)
        .find({ book_slug: BOOK_SLUG })
        .project({ _id: 1, chapter_number: 1 })
        .toArray();
    }
    const snapshot = {
      taken_at: new Date().toISOString(),
      book_id: bookId,
      book_chapters: book.chapters,
      pages: allPages,
      user_rows: userRows,
    };

    const counts = {
      pages: allPages.length,
      ...Object.fromEntries(USER_COLLECTIONS.map((c) => [c, userRows[c].length])),
    };
    console.log('\nDocuments to update:', JSON.stringify(counts), '+ 1 book doc');

    if (dry) {
      console.log('\n--dry: no writes performed.');
      return;
    }

    const snapDir = path.join(__dirname, '_snapshots');
    fs.mkdirSync(snapDir, { recursive: true });
    const stamp = snapshot.taken_at.replace(/[:.]/g, '-');
    const snapFile = path.join(snapDir, `${stamp}-class9-science-reorder.json`);
    fs.writeFileSync(snapFile, JSON.stringify(snapshot, null, 2));
    console.log(`📸 Snapshot written: ${snapFile}`);

    // --- Phase 1: shift everything to new+OFFSET (collision-free) ---
    const collsToShift = [
      { coll: pages, filter: (n) => ({ book_id: bookId, chapter_number: n }) },
      ...USER_COLLECTIONS.map((name) => ({
        coll: db.collection(name),
        filter: (n) => ({ book_slug: BOOK_SLUG, chapter_number: n }),
      })),
    ];

    for (const { coll, filter } of collsToShift) {
      for (const [oldN, newN] of oldToNew) {
        await coll.updateMany(filter(oldN), { $set: { chapter_number: newN + OFFSET } });
      }
    }
    // --- Phase 2: bring offset values down to final ---
    for (const { coll } of collsToShift) {
      for (const newN of oldToNew.values()) {
        const f = coll === pages
          ? { book_id: bookId, chapter_number: newN + OFFSET }
          : { book_slug: BOOK_SLUG, chapter_number: newN + OFFSET };
        await coll.updateMany(f, { $set: { chapter_number: newN } });
      }
    }

    // --- Book.chapters: renumber + re-sort ---
    const newChapters = book.chapters
      .map((ch) => ({ ...ch, number: oldToNew.get(ch.number) }))
      .sort((a, b) => a.number - b.number);
    await books.updateOne({ _id: bookId }, { $set: { chapters: newChapters } });

    // --- Verify ---
    const after = await books.findOne({ slug: BOOK_SLUG });
    console.log('\n✅ New chapter order:');
    for (const ch of after.chapters) {
      const pc = await pages.countDocuments({ book_id: bookId, chapter_number: ch.number });
      console.log(`  Ch${String(ch.number).padEnd(2)} ${ch.title.padEnd(50)} pages:${pc}`);
    }
    const orphan = await pages.countDocuments({ book_id: bookId, chapter_number: { $gte: OFFSET } });
    console.log(orphan === 0 ? '\n✔ No orphaned (offset) pages remain.' : `\n⚠ ${orphan} pages still at offset!`);
    console.log(`\nRollback if needed:\n  node scripts/reorder_class9_science_chapters.js --rollback "${snapFile}"`);
  } finally {
    await client.close();
  }
}

main().catch((e) => { console.error('❌', e); process.exit(1); });
