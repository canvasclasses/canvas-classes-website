'use strict';
/* "Name That Graph" (Ch.0 p6) had two hands-on exercises (the reasoning_prompt
   AND the build-it-yourself challenge) both testing the SAME shape, |x| — the
   trailing 5-Q quiz has good shape variety, but the page's own interactive
   core was redundant (founder catch: "is this page really enough on that
   topic?"). Fix: add a second reasoning_prompt + challenge pair for the
   parabola, so the hands-on portion samples 2 distinct shapes before the quiz,
   not 1 shape twice. Retitles the existing challenge "Challenge 1" so the new
   one reads as "Challenge 2", not two competing "final challenge"s.
   Additive (2 new blocks; existing blocks keep their ids). Versioned via the
   sanctioned book-writer gateway.
   Run: node scripts/math11-book/patch_ch0_name_that_graph_expand.js        (commits)
        node scripts/math11-book/patch_ch0_name_that_graph_expand.js --dry  (dry-run) */
const bw = require('../lib/book-writer');
const { withDb } = bw;
const { v4: uuidv4 } = require('uuid');

const SLUG = 'name-that-graph';
const DRY = process.argv.includes('--dry');

const newReasoningPrompt = {
  id: uuidv4(), type: 'reasoning_prompt', order: 3,
  reasoning_type: 'spatial',
  prompt: 'A graph is a smooth U-shaped bowl, no corners, touching the x-axis at exactly one lowest point. Which function is it?',
  options: ['$ y = x^2 $', '$ y = |x| $', '$ y = 1/x $', '$ y = x^3 $'],
  reveal: 'No sharp corner and one clear lowest point — that\'s the smooth parabola $ x^2 $. $ |x| $ would have a ' +
    'corner there instead, $ 1/x $ never touches the axis at all, and $ x^3 $ has no lowest point — it keeps ' +
    'falling forever to the left.',
  difficulty_level: 1,
};

const newChallenge = {
  id: uuidv4(), type: 'math_graph', order: 4,
  title: 'Challenge 2 — match the bowl',
  caption: 'Same idea, different shape: slide the bowl onto the dashed goal.',
  archetype: 'shift-explorer',
  archetype_params: { base: 'square' },
  challenge: {
    targets: { h: 2, k: -2 },
    tolerance: 0.25,
    prompt: 'Slide the bowl until it lands on the dashed goal — then read off what h and k had to be.',
    success: 'That\'s y = (x − 2)² − 2 — the vertex moved 2 right and 2 down.',
  },
};

(async () => {
  await withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);

    const first = page.blocks.find((b) => b.order === 3 && b.type === 'math_graph');
    if (!first) throw new Error('expected existing challenge at order 3 not found — page shape changed?');
    if (page.blocks.some((b) => b.title === 'Challenge 2 — match the bowl')) {
      console.log('already applied, skipping'); return;
    }

    const out = page.blocks.map((b) => {
      if (b.id === first.id) return { ...b, title: 'Challenge 1 — match the V' };
      if (b.order >= 4) return { ...b, order: b.order + 2 };
      return b;
    });
    out.push(newReasoningPrompt, newChallenge);
    out.sort((a, b) => a.order - b.order);

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'name-that-graph: add a 2nd reasoning_prompt+challenge pair (parabola) so the hands-on portion covers 2 shapes, not 1 shape twice',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/2 — pure addition + 1 retitle)`
      : `✓ ${SLUG}: v${res.version} · now ${out.length} blocks (was ${page.blocks.length})`);
  });
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
