'use strict';
/**
 * Editorial pass fixes found during a full-manuscript review of the Focus
 * module (2026-07-08), acting as a publication editor:
 *
 *  1. Page 4, image block 4916eba7 — alt text was the literal raw export
 *     filename ("ChatGPT Image Jul 5, 2026, 12_27_56 AM"), not a real
 *     description. Fixed after downloading and viewing the actual image (a
 *     "Deep Work vs Multitasking" comparison infographic).
 *  2. Page 3, curiosity_prompt 38072de3 — the `hint` field's content itself
 *     started with the redundant word "Hint: " baked into the sentence
 *     ("Hint: the answer is not..."). No other hint field on the platform
 *     self-prefixes this way (the renderer adds no separate "HINT" label),
 *     so this read as an inconsistent copy-editing slip. Stripped the prefix.
 *  3. Page 3 repeated the near-identical sentence "you can't out-willpower a
 *     slot machine... practise watching the pull instead of obeying it" twice
 *     on the same page (once in the main text, once in the attention_xray
 *     closing) — reads as a copy-paste oversight. Varied the second
 *     occurrence (the closing) while keeping the same idea.
 *
 * Text-only edits across 3 blocks on 2 pages — 0 blocks removed, no
 * content-loss guard needed.
 *
 * Run: node scripts/focus_editorial_pass_fixes.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const DRY = process.argv.includes('--dry');

const NEW_ALT_4916 =
  'A split "Deep Work vs Multitasking" infographic. Left, in green: a focused student writing calmly at a lamp-lit desk, with benefits listed — high focus, better quality, faster progress, stronger memory, compound growth — a steady focus graph, and an "80% impact, time well spent" dial. Right, in orange: a stressed student surrounded by notification icons and a cluttered desk, with costs listed — constant context switching (~23 minutes to refocus each time), cognitive overload, lower quality, a time illusion, fragmented memory — a spiky, sawtooth focus graph, and a "40% impact, time wasted" dial. Centre: a half-and-half brain icon and a dial for "choose your mode." Footer: "Deep work is a superpower — it\'s rare, valuable, and compounds," "the more you protect your focus, the farthest you go," and "multitasking feels productive, but quietly steals your best."';

const NEW_HINT_38072de3 = 'The answer is not "I am weak."';

const NEW_XRAY_CLOSING =
  "So why the trouble? Here's the part nobody advertises: **you are not the customer — you are the product.** These apps are free because your *attention* is what's being sold, to advertisers who pay for every extra minute you stay. On the other side of the glass sit teams of brilliant engineers whose paid job is to win those minutes.\n\n" +
  "That sounds grim. It isn't — because there's one thing they can't design around: **a student who can see the trick.** Willpower alone won't beat a machine built by hundreds of engineers. But noticing beats it every time: kill the red dots, and the next time your thumb reaches for the app on its own, just watch it happen instead of following it. Seeing the blueprint is step one. You just did it.";

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);

    // --- Page 4: fix the image alt text ---
    {
      const SLUG = 'the-multitasking-myth';
      const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
      if (!page) throw new Error(`page ${SLUG} not found`);
      let fixed = false;
      const out = page.blocks.map((b) => {
        if (b.type === 'image' && b.id.startsWith('4916eba7')) { fixed = true; return { ...b, alt: NEW_ALT_4916 }; }
        return b;
      });
      if (!fixed) throw new Error('image 4916eba7 not found on page 4');
      const res = await bw.savePage(db, { pageId: page._id }, out, {
        author: 'agent',
        summary: 'editorial pass: fix alt text on the Deep Work vs Multitasking image (was the raw export filename)',
        dryRun: DRY,
      });
      console.log(DRY
        ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length}`
        : `✓ ${SLUG}: v${res.version} · alt text fixed`);
    }

    // --- Page 3: fix the redundant hint prefix + vary the repeated sentence ---
    {
      const SLUG = 'why-reels-feel-impossible-to-stop';
      const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
      if (!page) throw new Error(`page ${SLUG} not found`);
      let hintFixed = false, closingFixed = false;
      const out = page.blocks.map((b) => {
        if (b.type === 'curiosity_prompt' && b.id.startsWith('38072de3')) {
          hintFixed = true;
          return { ...b, hint: NEW_HINT_38072de3 };
        }
        if (b.type === 'attention_xray') {
          closingFixed = true;
          return { ...b, closing: NEW_XRAY_CLOSING };
        }
        return b;
      });
      if (!hintFixed) throw new Error('curiosity_prompt 38072de3 not found on page 3');
      if (!closingFixed) throw new Error('attention_xray not found on page 3');
      const res = await bw.savePage(db, { pageId: page._id }, out, {
        author: 'agent',
        summary: 'editorial pass: strip redundant "Hint:" prefix from curiosity_prompt hint; de-duplicate the repeated "out-willpower a slot machine" sentence in the attention_xray closing',
        dryRun: DRY,
      });
      console.log(DRY
        ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length}`
        : `✓ ${SLUG}: v${res.version} · hint + closing fixed`);
    }
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Editorial pass fixes applied.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
