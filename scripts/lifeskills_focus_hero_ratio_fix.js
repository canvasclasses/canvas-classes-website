'use strict';
/**
 * Fix hero image prompts on the Life Skills Focus module: heroes are 16:5 blocks
 * but their generation_prompt said "landscape composition", so ChatGPT produced
 * ~4:3 landscapes that crop badly in the wide slot. Rewrite the tail to force an
 * ultra-wide banner composition (matches the house style used on other books:
 * "Ultra-wide cinematic banner (16:5 ratio)"). Founder correction 2026-07-03.
 *
 * Prompt-text-only edit: no blocks/assets removed → content-loss guard passes.
 * All writes via book-writer (versioned + audited). Run: node scripts/lifeskills_focus_hero_ratio_fix.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const DRY = process.argv.includes('--dry');
const OLD_TAIL = 'landscape composition, generous negative space.';
const NEW_TAIL = 'ultra-wide cinematic banner composition in a 16:5 ratio (much wider than it is tall, like a wide film still), the key subject centred with generous empty space extending to the left and right so nothing important is cropped when shown as a wide banner.';

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const pages = await db.collection('book_pages')
      .find({ book_id: String(book._id) }).sort({ page_number: 1 }).toArray();

    for (const page of pages) {
      let changed = false;
      const newBlocks = page.blocks.map((b) => {
        if (b.type === 'image' && b.aspect_ratio === '16:5' && typeof b.generation_prompt === 'string'
            && b.generation_prompt.includes(OLD_TAIL)) {
          changed = true;
          return { ...b, generation_prompt: b.generation_prompt.replace(OLD_TAIL, NEW_TAIL) };
        }
        return b;
      });
      if (!changed) { console.log(`  – p${page.page_number} ${page.slug}: no hero to fix`); continue; }
      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent',
        summary: 'hero prompt: 16:5 ultra-wide banner framing (founder correction)',
        dryRun: DRY,
      });
      console.log(DRY
        ? `[dry] p${page.page_number} ${page.slug}: wouldBlock=${res.wouldBlock} removed=${res.diff.removedBlockIds.length}`
        : `✓ p${page.page_number} ${page.slug}: v${res.version} · hero prompt updated`);
    }
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ 10 hero prompts set to 16:5 banner framing.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
