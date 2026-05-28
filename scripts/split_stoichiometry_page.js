/**
 * Split the stoichiometry page into 3 pages — 2026-05-28
 *
 * The current `stoichiometry-limiting-reagent` page (chapter 4, page 9 of
 * NCERT Simplified Class 11 Chemistry) has 48 blocks covering three topics:
 *   • Stoichiometry intro + mass/vol/mole analyses + limiting reagent (~25 blocks)
 *   • Eudiometry (Vol-Vol) + the eudiometer-lab simulation + 6 worked examples (~11 blocks)
 *   • Equivalent Concept + n-factor + phosphorus acids + 5 worked examples (~13 blocks)
 *
 * The page is too long to read comfortably and leaves no room for the
 * handwritten notes / extra solved examples the user wants to add.
 *
 * This script extracts the Eudiometry slice (orders 11-21) and the Equivalent
 * slice (orders 22-34) into two NEW pages, re-orders the chapter so the new
 * pages slot between stoichiometry (p9) and concentration-of-solutions (p10→12),
 * and trims the original stoichiometry page to keep only orders 0-10 + 35-47.
 *
 * Mutations:
 *   1 backup file written to scripts/_backups/
 *   2 inserts  (book_pages: eudiometry, equivalent-concept)
 *   1 update   (book_pages: stoichiometry-limiting-reagent — replace blocks + content_types)
 *   1 update   (book_pages: concentration-of-solutions — bump page_number 10 → 12)
 *   1 update   (books: chapters[idx].page_ids → push 2 new ids)
 *
 * Rollback: load scripts/_backups/stoichiometry-pre-split-<timestamp>.json and
 *   run scripts/rollback_stoichiometry_split.js (mirror script — only needed
 *   if anything below this point goes wrong).
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing in .env.local'); process.exit(1); }

const STOICH_SLUG = 'stoichiometry-limiting-reagent';
const CONC_SLUG   = 'concentration-of-solutions';
const BOOK_SLUG   = 'ncert-simplified';
const CHAPTER_NUM = 4;

// 0-based block-order ranges to extract (inclusive on both ends)
const EUDIO_START = 11, EUDIO_END = 21;   // 11 blocks
const EQUIV_START = 22, EQUIV_END = 34;   // 13 blocks
// Everything else stays in stoichiometry: 0..10 + 35..47

const EUDIO_PAGE = {
  slug:    'eudiometry',
  title:   'Eudiometry — Volume-Volume Analysis',
  subtitle: 'Volume-volume analysis of gas reactions. For gases at the same temperature and pressure, volume ratios match mole ratios — so you can predict product volumes directly from a balanced equation, no moles required.',
  reading_time_min: 8,
};
const EQUIV_PAGE = {
  slug:    'equivalent-concept',
  title:   'Equivalent Concept & n-Factor',
  subtitle: 'An alternative to mole-mole analysis. Convert masses into "equivalents" and the reaction becomes one-line arithmetic — provided you set the n-factor (the "reaction units" each particle carries) correctly.',
  reading_time_min: 10,
};

// New page_numbers after the split
const NEW_PAGE_NUMS = {
  // stoichiometry stays at 9
  eudiometry:           10,
  equivalent_concept:   11,
  concentration:        12,
};

// Compute the distinct block.type values present in a blocks array.
// Mirrors the existing `content_types` field convention on book_pages.
function deriveContentTypes(blocks) {
  const set = new Set();
  const walk = (bs) => {
    if (!Array.isArray(bs)) return;
    for (const b of bs) {
      // Only the "rich" block types end up in content_types per existing data
      if (['inline_quiz', 'simulation', 'worked_example', 'video', 'practice_link'].includes(b.type)) {
        set.add(b.type);
      }
      if (b.columns) b.columns.forEach((col) => walk(col));
    }
  };
  walk(blocks);
  return [...set].sort();
}

// Re-number an array of blocks so their .order is 0, 1, 2, ... while preserving
// the original relative ordering. Returns NEW objects (does not mutate input).
function renumberBlocks(blocks) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  return sorted.map((b, i) => ({ ...b, order: i }));
}

(async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const Pages = db.collection('book_pages');
  const Books = db.collection('books');

  // ── Load the source page ────────────────────────────────────────────────
  const original = await Pages.findOne({ slug: STOICH_SLUG });
  if (!original) throw new Error(`Source page '${STOICH_SLUG}' not found`);
  if (original.blocks.length !== 48) {
    console.warn(`⚠ original block count is ${original.blocks.length}, expected 48 — proceeding anyway`);
  }
  console.log(`✓ Loaded ${STOICH_SLUG} (${original.blocks.length} blocks)`);

  // ── Backup ───────────────────────────────────────────────────────────────
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(__dirname, '_backups', `stoichiometry-pre-split-${ts}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(original, null, 2));
  console.log(`✓ Backup written → ${path.relative(process.cwd(), backupPath)}`);

  // ── Slice the blocks ────────────────────────────────────────────────────
  const sortedBlocks = [...original.blocks].sort((a, b) => a.order - b.order);

  const eudioBlocks = sortedBlocks.filter((b) => b.order >= EUDIO_START && b.order <= EUDIO_END);
  const equivBlocks = sortedBlocks.filter((b) => b.order >= EQUIV_START && b.order <= EQUIV_END);
  const keepBlocks  = sortedBlocks.filter((b) => b.order < EUDIO_START || b.order > EQUIV_END);

  if (eudioBlocks.length !== (EUDIO_END - EUDIO_START + 1)) {
    throw new Error(`Eudiometry slice expected ${EUDIO_END - EUDIO_START + 1} blocks, got ${eudioBlocks.length}`);
  }
  if (equivBlocks.length !== (EQUIV_END - EQUIV_START + 1)) {
    throw new Error(`Equivalent slice expected ${EQUIV_END - EQUIV_START + 1} blocks, got ${equivBlocks.length}`);
  }
  console.log(`✓ Sliced: stoichiometry(keep)=${keepBlocks.length}, eudiometry=${eudioBlocks.length}, equivalent=${equivBlocks.length}`);

  // Re-number each slice from 0
  const newStoichBlocks = renumberBlocks(keepBlocks);
  const newEudioBlocks  = renumberBlocks(eudioBlocks);
  const newEquivBlocks  = renumberBlocks(equivBlocks);

  // ── Build the two new page documents ────────────────────────────────────
  const now = new Date();
  const eudioId = uuidv4();
  const equivId = uuidv4();

  const eudioDoc = {
    _id: eudioId,
    book_id: original.book_id,
    chapter_number: CHAPTER_NUM,
    page_number: NEW_PAGE_NUMS.eudiometry,
    slug: EUDIO_PAGE.slug,
    title: EUDIO_PAGE.title,
    subtitle: EUDIO_PAGE.subtitle,
    blocks: newEudioBlocks,
    tags: [],
    published: true,
    reading_time_min: EUDIO_PAGE.reading_time_min,
    content_types: deriveContentTypes(newEudioBlocks),
    video_title: null,
    created_at: now,
    updated_at: now,
    __v: 0,
  };

  const equivDoc = {
    _id: equivId,
    book_id: original.book_id,
    chapter_number: CHAPTER_NUM,
    page_number: NEW_PAGE_NUMS.equivalent_concept,
    slug: EQUIV_PAGE.slug,
    title: EQUIV_PAGE.title,
    subtitle: EQUIV_PAGE.subtitle,
    blocks: newEquivBlocks,
    tags: [],
    published: true,
    reading_time_min: EQUIV_PAGE.reading_time_min,
    content_types: deriveContentTypes(newEquivBlocks),
    video_title: null,
    created_at: now,
    updated_at: now,
    __v: 0,
  };

  // Conflict check — make sure no existing page already uses these slugs
  const existing = await Pages.find({
    book_id: original.book_id,
    slug: { $in: [EUDIO_PAGE.slug, EQUIV_PAGE.slug] },
  }).toArray();
  if (existing.length > 0) {
    console.error('⚠ Slug conflict — these slugs already exist:');
    existing.forEach((p) => console.error(`   - ${p.slug} (${p._id})`));
    throw new Error('Aborting to avoid overwriting existing pages.');
  }

  // ── Apply mutations ─────────────────────────────────────────────────────
  // Order matters: a unique index on (book_id, chapter_number, page_number)
  // means we must FREE slot 10 (bump concentration) BEFORE inserting eudiometry
  // into slot 10. Same with slot 11 implicitly.

  // 1. Bump concentration-of-solutions page_number 10 → 12 first to free slots 10/11
  const concRes = await Pages.updateOne(
    { slug: CONC_SLUG, book_id: original.book_id },
    { $set: { page_number: NEW_PAGE_NUMS.concentration, updated_at: now } }
  );
  if (concRes.matchedCount === 0) throw new Error(`Could not find ${CONC_SLUG} to renumber`);
  console.log(`✓ Renumbered ${CONC_SLUG}: page_number → ${NEW_PAGE_NUMS.concentration}`);

  // 2. Insert eudiometry page (now slot 10 is free)
  await Pages.insertOne(eudioDoc);
  console.log(`✓ Inserted page: ${EUDIO_PAGE.slug} (${eudioId}) — page_number ${NEW_PAGE_NUMS.eudiometry}`);

  // 3. Insert equivalent-concept page (slot 11 is free)
  await Pages.insertOne(equivDoc);
  console.log(`✓ Inserted page: ${EQUIV_PAGE.slug} (${equivId}) — page_number ${NEW_PAGE_NUMS.equivalent_concept}`);

  // 4. Update stoichiometry page — replace blocks, refresh content_types
  await Pages.updateOne(
    { _id: original._id },
    {
      $set: {
        blocks: newStoichBlocks,
        content_types: deriveContentTypes(newStoichBlocks),
        updated_at: now,
      },
    }
  );
  console.log(`✓ Updated ${STOICH_SLUG} → ${newStoichBlocks.length} blocks remaining`);

  // 5. Add the two new page IDs to the chapter's page_ids array
  const book = await Books.findOne({ slug: BOOK_SLUG });
  const chapterIdx = book.chapters.findIndex((c) => c.number === CHAPTER_NUM);
  if (chapterIdx < 0) throw new Error(`Chapter ${CHAPTER_NUM} not found in book ${BOOK_SLUG}`);

  const updatedPageIds = [...book.chapters[chapterIdx].page_ids, eudioId, equivId];
  await Books.updateOne(
    { _id: book._id },
    {
      $set: {
        [`chapters.${chapterIdx}.page_ids`]: updatedPageIds,
        updated_at: now,
      },
    }
  );
  console.log(`✓ Added ${eudioId}, ${equivId} to chapter ${CHAPTER_NUM}.page_ids (now ${updatedPageIds.length} ids)`);

  // ── Verification ────────────────────────────────────────────────────────
  console.log('\n── Verification ──');
  const finalPages = await Pages
    .find({ chapter_number: CHAPTER_NUM, published: true })
    .project({ slug: 1, page_number: 1, title: 1 })
    .sort({ page_number: 1 })
    .toArray();
  console.log(`Published pages in chapter ${CHAPTER_NUM}:`);
  finalPages.forEach((p) => console.log(`  p${p.page_number}  ${p.slug}  —  ${p.title}`));

  await client.close();
  console.log('\n✓ Migration complete.');
})().catch((err) => {
  console.error('✗ Migration failed:', err);
  process.exit(1);
});
