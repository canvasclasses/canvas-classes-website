'use strict';
/* Drop the visible "Adapted · Thomas §1.2" badge from all 20 practice_bank
   items on "Describe the Move" (Ch.0 p8) — founder policy (2026-07-24): the
   platform only shows a source badge for NCERT / NCERT Exemplar / CBSE PYQ /
   JEE Main PYQ. Never attribute a question to any other book on a student-
   facing surface, even an "adapted" one. Content itself is untouched — this
   removes only the `source_label` field, which falls back to the generic
   "MCQ" badge already defined in PracticeBankRenderer.tsx's SOURCE_META.
   The internal provenance note stays in this build script's own header
   comment + project memory, never surfaced to students.
   Run: node scripts/math11-book/patch_ch0_drop_thomas_label.js        (commits)
        node scripts/math11-book/patch_ch0_drop_thomas_label.js --dry  (dry-run) */
const bw = require('../lib/book-writer');
const { withDb } = bw;

const SLUG = 'describe-the-move';
const DRY = process.argv.includes('--dry');

(async () => {
  await withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);
    let changed = 0;
    const out = page.blocks.map((b) => {
      if (b.type !== 'practice_bank') return b;
      const sections = b.sections.map((s) => ({
        ...s,
        items: s.items.map((it) => {
          if (it.source_label) {
            changed++;
            const { source_label, ...rest } = it;
            return rest;
          }
          return it;
        }),
      }));
      return { ...b, sections };
    });
    if (changed === 0) throw new Error('no items had a source_label — already applied?');
    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: `describe-the-move: drop the visible 'Adapted · Thomas' badge from ${changed} items (policy: only cite NCERT/Exemplar/CBSE PYQ/JEE Main PYQ to students)`,
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: ${changed} items fixed, removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — in-place field removal)`
      : `✓ ${SLUG}: v${res.version} · ${changed} items lost their source_label (now show generic "MCQ")`);
  });
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
