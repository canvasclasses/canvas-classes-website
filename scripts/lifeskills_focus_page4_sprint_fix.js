'use strict';
/**
 * Page 4 ("The Multitasking Myth") — same bug as page 8: the "10-Minute
 * One-Track Sprint" guided_practice embeds a live 600-second in-page timer.
 * Founder confirmed: fix the same way as page 8 — teach the protocol, don't
 * ask the reader to sit through it here.
 *
 * Unlike page 8, the reflection_journal + closing cue right after this block
 * are about the earlier music/lyrics topic (from the same-day page-4 rebuild),
 * NOT the sprint — so only the guided_practice itself needs editing (intro,
 * step 3's instruction + removing duration_sec, completion_note).
 *
 * Text-only edit — 0 blocks removed, no content-loss guard needed.
 *
 * Run: node scripts/lifeskills_focus_page4_sprint_fix.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'the-multitasking-myth';
const DRY = process.argv.includes('--dry');
const GP_ID = '1b865b9c';

const NEW_INTRO =
  'A taste of one-pointed mode — read the three moves now, then run the real ten minutes next time you sit down with actual homework.';

const NEW_STEP3_INSTRUCTION =
  'When you actually sit down with real homework, work on only this one task for ten minutes. When the urge to switch arrives — and it will — notice it like a wave, let it pass, and continue. No timer running here; use your phone or a clock when you do it for real.';

const NEW_COMPLETION_NOTE =
  "That's the whole move — one task, ten minutes, riding out the urge to switch instead of obeying it. Next time you sit down to study, try it for real and notice how far you get once you stop branching.";

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let gpFixed = false;
    const out = page.blocks.map((b) => {
      if (b.type === 'guided_practice' && b.id.startsWith(GP_ID)) {
        gpFixed = true;
        return {
          ...b,
          intro: NEW_INTRO,
          completion_note: NEW_COMPLETION_NOTE,
          steps: b.steps.map((s) => {
            if (typeof s.duration_sec !== 'number') return s;
            const { duration_sec, ...rest } = s;
            return { ...rest, instruction: NEW_STEP3_INSTRUCTION };
          }),
        };
      }
      return b;
    });
    if (!gpFixed) throw new Error(`guided_practice ${GP_ID} not found`);

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'page 4: remove the live 10-min in-page countdown — convert the one-track sprint practice into a teach-the-protocol walkthrough (same fix as page 8)',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — text-only)`
      : `✓ ${SLUG}: v${res.version} · one-track sprint now teaches the protocol instead of running it live`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Page 4 fixed.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
