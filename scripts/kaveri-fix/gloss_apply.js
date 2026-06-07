'use strict';
/**
 * Apply authored gloss examples for one chapter.
 *   node scripts/kaveri-fix/gloss_apply.js <chapter> [--dry]
 * Reads scripts/kaveri-fix/_ch<N>_gloss_fix.json:
 *   [{ loc:{page_slug,block_id,pi,si,gi}, word, example }]
 * Sets glosses[gi].example, verifying the word at that locator still matches.
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');

const ch = Number(process.argv[2]);
const DRY = process.argv.includes('--dry');
if (!ch) { console.error('usage: gloss_apply.js <chapter> [--dry]'); process.exit(1); }

const fixes = JSON.parse(fs.readFileSync(`scripts/kaveri-fix/_ch${ch}_gloss_fix.json`, 'utf8'));
for (const f of fixes) {
  if (!f.example || !String(f.example).trim()) throw new Error(`empty example for ${f.word}`);
}

(async () => {
  await withBook(async ({ pages, allPages }) => {
    const bySlug = {};
    for (const f of fixes) (bySlug[f.loc.page_slug] ||= []).push(f);
    let applied = 0, mismatch = 0, touchedPages = 0;
    for (const [slug, list] of Object.entries(bySlug)) {
      const page = allPages.find((p) => p.slug === slug);
      if (!page) { console.log('⚠ page not found', slug); continue; }
      let dirty = false;
      for (const f of list) {
        const blk = (page.blocks || []).find((b) => b.id === f.loc.block_id && b.type === 'narrated_passage');
        const g = blk?.paragraphs?.[f.loc.pi]?.sentences?.[f.loc.si]?.glosses?.[f.loc.gi];
        if (!g) { mismatch++; console.log('  no gloss at', slug, JSON.stringify(f.loc)); continue; }
        if (g.word !== f.word) { mismatch++; console.log(`  word drift at ${slug}: db='${g.word}' fix='${f.word}'`); continue; }
        g.example = String(f.example).trim();
        applied++; dirty = true;
      }
      if (dirty) { touchedPages++; if (!DRY) await savePageBlocks(pages, page._id, page.blocks); }
    }
    console.log(`Ch${ch}: ${DRY ? '[DRY] ' : ''}applied ${applied} examples across ${touchedPages} pages. mismatches: ${mismatch}`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
