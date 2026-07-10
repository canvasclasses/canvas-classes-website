'use strict';
/**
 * Replace the weak "60-Second Stillness Test" (guided_practice[observation]) on
 * page 1 (baseline) and page 10 (retest) of the Focus module with the new
 * `focus_game` block ("The Steady Flame" — a gradCPT/SART-style sustained-
 * attention meter). Also rewrites the reflection prompt right after each test so
 * it references the new Focus Score instead of the old "wander count".
 *
 * Founder-requested upgrade (2026-07-04): "I want something better than this…
 * design something within the simulation where the student can actually focus."
 * The removed guided_practice block is version-snapshotted by book-writer, so the
 * swap is fully reversible. allowContentLoss is passed with that reason.
 *
 * Run: node scripts/lifeskills_focus_swap_test.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const DRY = process.argv.includes('--dry');
const TEST_ID = 'focus-attention';

const focusGame = (role, title, intro, completion_note) => ({
  id: uuidv4(), type: 'focus_game', order: 0,
  test_id: TEST_ID, role, title, intro, duration_sec: 120, completion_note,
});

// slug → { testBlockPrefix, newGame, reflectionPrefix, newReflection }
const PLAN = {
  'your-attention-is-a-superpower': {
    testPrefix: '91c7d71f',
    game: focusGame(
      'baseline',
      'The Steady Flame — Your Focus Check',
      'Every real training programme starts by measuring. This is your **baseline** — a real number for how steady your attention is *right now*. Not a test you pass or fail. Just your starting line, so improvement later is a fact, not a feeling.',
      "That number isn't good or bad — it's **yours**, today. Keep it in mind; you'll beat it by page 10.",
    ),
    reflectionPrefix: '74a92f04',
    reflection: 'Write down your Focus Score. Then describe how those two minutes felt — long, short, itchy, boring, surprisingly hard? Look at your steadiness line: did your attention dip in the middle? Where did your mind try to go?',
  },
  'your-7-day-focus-challenge': {
    testPrefix: 'c022598f',
    game: focusGame(
      'retest',
      'The Steady Flame — Round 2',
      "Same lanterns, same two minutes as page 1. Nothing about the test changed — only you did. Let's see what nine pages of practice did to your steadiness.",
      'Whatever the number did, notice **how it felt** this time — did the drift feel easier to catch and come back from? That noticing is the real skill.',
    ),
    reflectionPrefix: '5dc684af',
    reflection: 'Write your baseline Focus Score and your Round-2 score, and the difference. Even if the numbers are close, what feels different about HOW you catch the drift and return now? Finally: write one sentence to the you of ten pages ago.',
  },
};

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);

    for (const [slug, plan] of Object.entries(PLAN)) {
      const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug });
      if (!page) throw new Error(`page ${slug} not found`);

      let swapped = false, reflectionFixed = false;
      const newBlocks = page.blocks.map((b) => {
        if (b.type === 'guided_practice' && b.id.startsWith(plan.testPrefix)) {
          swapped = true;
          return { ...plan.game, order: b.order };
        }
        if (b.type === 'reflection_journal' && b.id.startsWith(plan.reflectionPrefix)) {
          reflectionFixed = true;
          return { ...b, prompt: plan.reflection };
        }
        return b;
      });
      if (!swapped) throw new Error(`${slug}: test block ${plan.testPrefix} not found`);
      if (!reflectionFixed) throw new Error(`${slug}: reflection block ${plan.reflectionPrefix} not found`);

      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent',
        summary: 'swap 60-sec stillness test → focus_game "Steady Flame"; update reflection prompt (founder-requested upgrade)',
        allowContentLoss: true,
        lossReason: 'Founder asked to replace the 60-second stillness test with a real in-app focus meter. Old guided_practice[observation] block snapshotted for recovery.',
        dryRun: DRY,
      });
      console.log(DRY
        ? `[dry] ${slug}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length}`
        : `✓ ${slug}: v${res.version} · test → Steady Flame + reflection updated`);
    }
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Both pages upgraded to the Steady Flame focus meter.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
