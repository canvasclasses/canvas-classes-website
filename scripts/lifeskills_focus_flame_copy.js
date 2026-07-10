'use strict';
/**
 * Refresh the on-page copy for the redesigned focus_game ("The Steady Flame" —
 * watch-the-flame / self-caught mind-wandering meter) on page 1 (baseline) and
 * page 10 (retest) of the Focus module, plus the reflection prompt after each.
 *
 * The earlier copy described the old gradCPT tapping game ("lanterns", "let the
 * dark ones pass", "Focus Score", "steadiness line"). The mechanic is now:
 * watch one flame, tap the instant your mind wanders, see your longest unbroken
 * hold. This script only EDITS text on existing blocks (no block removed, no
 * asset unlinked) so the content-loss guard passes without allowContentLoss.
 *
 * Matches the focus_game block by type (one per page — its id was regenerated in
 * the swap), and the reflection block by id prefix.
 *
 * Run: node scripts/lifeskills_focus_flame_copy.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const DRY = process.argv.includes('--dry');

const PLAN = {
  'your-attention-is-a-superpower': {
    game: {
      title: 'The Steady Flame — Watch Your Focus',
      intro:
        "Focus isn't a feeling — it's a length of time. This is *Trataka* (त्राटक), an old practice of steady flame-gazing, turned into an honest test. Watch the flame. The instant your mind slips somewhere else, tap. You'll see exactly how long you can really hold on — and it's usually shorter than anyone expects.",
      completion_note:
        "Whatever your number, it's **yours**, today — your starting line. Sit with how short unbroken focus actually is. You'll watch the same flame on page 10 and hold it longer.",
    },
    reflectionPrefix: '74a92f04',
    reflection:
      'Write down your longest unbroken hold and how many times you slipped. Which surprised you more — how *short* your best stretch was, or how *often* your mind slipped away? Each time it slipped, where was it trying to go?',
  },
  'your-7-day-focus-challenge': {
    game: {
      title: 'The Steady Flame — Watch Again',
      intro:
        "Same flame, same two minutes as page 1 — nothing about the test changed, only you did. Watch it, and each time your mind slips away, tap. Let's see how much longer you can hold now.",
      completion_note:
        "Compare your longest hold to page 1. Then notice the deeper thing: does the *slip* feel easier to catch now? Catching it faster — and coming back — is the real skill this chapter built.",
    },
    reflectionPrefix: '5dc684af',
    reflection:
      'Write your page-1 longest hold and your page-10 longest hold, and the difference. Even if the numbers are close, what feels different about how quickly you NOTICE the slip and return now? Finally: write one sentence to the you of ten pages ago.',
  },
};

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);

    for (const [slug, plan] of Object.entries(PLAN)) {
      const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug });
      if (!page) throw new Error(`page ${slug} not found`);

      let gameFixed = false, reflectionFixed = false;
      const newBlocks = page.blocks.map((b) => {
        if (b.type === 'focus_game') {
          gameFixed = true;
          return { ...b, title: plan.game.title, intro: plan.game.intro, completion_note: plan.game.completion_note };
        }
        if (b.type === 'reflection_journal' && b.id.startsWith(plan.reflectionPrefix)) {
          reflectionFixed = true;
          return { ...b, prompt: plan.reflection };
        }
        return b;
      });
      if (!gameFixed) throw new Error(`${slug}: focus_game block not found`);
      if (!reflectionFixed) throw new Error(`${slug}: reflection block ${plan.reflectionPrefix} not found`);

      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent',
        summary: 'refresh focus_game + reflection copy for the watch-the-flame redesign',
        dryRun: DRY,
      });
      console.log(DRY
        ? `[dry] ${slug}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length}`
        : `✓ ${slug}: v${res.version} · flame copy + reflection updated`);
    }
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ On-page copy now matches the watch-the-flame game.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
