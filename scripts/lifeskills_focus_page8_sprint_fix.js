'use strict';
/**
 * Page 8 ("The 25-Minute Sprint") — the guided_practice block literally embedded
 * a live 1500-second (25-min) countdown as its 3rd step, asking the reader to sit
 * through a real 25 minutes ON THE PAGE. Founder: "who will wait 25 min right in
 * the middle of reading or class session... use this section to teach but don't
 * ask user to act right then."
 *
 * Fix: remove the duration_sec from step 3 — all 3 steps become a short,
 * tap-through TEACHING walkthrough of the protocol (readable in ~30 seconds),
 * completable in-session. The actual 25-minute sprint is something the student
 * runs LATER with their own timer, which the page's own journal + closing cue
 * already assumed — this just makes the guided_practice block agree with that.
 * Also rewrites intro/completion_note (no longer "you just finished a sprint")
 * and the journal (retrospective → forward commitment/prediction) + lightly
 * adjusts the closing cue for the new framing.
 *
 * Text-only edits on 3 existing blocks — 0 blocks removed/added, no
 * content-loss guard needed.
 *
 * Run: node scripts/lifeskills_focus_page8_sprint_fix.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'the-25-minute-sprint';
const DRY = process.argv.includes('--dry');

const GP_ID = '7edc06d3';
const JOURNAL_ID = '135259a8';
const CUE_ID = '9f213785';

const NEW_INTRO =
  "This isn't something to run here — a real sprint needs your actual homework and 25 real minutes. Read the protocol now; run it for real next time you sit down to study.";

const NEW_STEP3_INSTRUCTION =
  'When you actually sit to study — later today, not on this page — set a real 25-minute timer (phone, kitchen timer, anything). Work only on your one task. The instant a stray thought shows up, write it on the parking list and go straight back. Let the timer decide when you stop, not your mood.';

const NEW_COMPLETION_NOTE =
  "That's the whole protocol — three moves, and the timer carries the discipline for you. You don't need this page open to run it: next time you sit to study, do exactly this, for real.";

const NEW_JOURNAL_PROMPT =
  'Before you run this for real: which subject and task will get your first sprint? Guess now — do you think the first five minutes or the last ten will feel harder? You will find out for real soon enough.';

const NEW_CUE =
  '**Today or tomorrow:** run your first real sprint using exactly this protocol — one task, phone out of the room, the timer owning the clock. This becomes your daily rep in the 7-day challenge — two pages from now.';

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let gpFixed = false, journalFixed = false, cueFixed = false;
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
      if (b.type === 'reflection_journal' && b.id.startsWith(JOURNAL_ID)) {
        journalFixed = true;
        return { ...b, prompt: NEW_JOURNAL_PROMPT };
      }
      if (b.type === 'text' && b.id.startsWith(CUE_ID)) {
        cueFixed = true;
        return { ...b, markdown: NEW_CUE };
      }
      return b;
    });
    if (!gpFixed) throw new Error(`guided_practice ${GP_ID} not found`);
    if (!journalFixed) throw new Error(`journal ${JOURNAL_ID} not found`);
    if (!cueFixed) throw new Error(`cue text ${CUE_ID} not found`);

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'page 8: remove the live 25-min in-page countdown — convert the sprint practice into a teach-the-protocol walkthrough; journal/cue reframed to forward commitment',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — text-only)`
      : `✓ ${SLUG}: v${res.version} · sprint practice now teaches the protocol instead of running it live`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Page 8 fixed.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
