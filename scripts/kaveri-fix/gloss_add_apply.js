'use strict';
/**
 * Append NEW glosses to existing narrated_passage sentences (re-glossing).
 *   node scripts/kaveri-fix/gloss_add_apply.js <chapter> [--dry]
 * Reads _ch<N>_reglossing.json: [{ loc:{page_slug,block_id,pi,si}, glosses:[{word,meaning,hindi?,example?,pos?}] }]
 * Skips any gloss whose word already exists on that sentence.
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');

const ch = Number(process.argv[2]);
const DRY = process.argv.includes('--dry');
if (!ch) { console.error('usage: gloss_add_apply.js <chapter> [--dry]'); process.exit(1); }
const fixes = JSON.parse(fs.readFileSync(`scripts/kaveri-fix/_ch${ch}_reglossing.json`, 'utf8'));

(async () => {
  await withBook(async ({ pages, allPages }) => {
    const bySlug = {};
    for (const f of fixes) (bySlug[f.loc.page_slug] ||= []).push(f);
    let added = 0, miss = 0, touched = 0;
    for (const [slug, list] of Object.entries(bySlug)) {
      const page = allPages.find((p) => p.slug === slug);
      if (!page) { console.log('⚠ page', slug); continue; }
      let dirty = false;
      for (const f of list) {
        const b = (page.blocks || []).find((x) => x.id === f.loc.block_id && x.type === 'narrated_passage');
        const s = b?.paragraphs?.[f.loc.pi]?.sentences?.[f.loc.si];
        if (!s) { miss++; continue; }
        s.glosses = s.glosses || [];
        const have = new Set(s.glosses.map((g) => g.word.toLowerCase()));
        for (const g of f.glosses) {
          if (!g.word || !g.meaning) continue;
          if (have.has(g.word.toLowerCase())) continue;
          if (!s.text.toLowerCase().includes(g.word.toLowerCase())) continue; // word must be in the sentence
          s.glosses.push(g); added++; dirty = true; have.add(g.word.toLowerCase());
        }
      }
      if (dirty) { touched++; if (!DRY) await savePageBlocks(pages, page._id, page.blocks); }
    }
    console.log(`Ch${ch}: ${DRY ? '[DRY] ' : ''}added ${added} glosses across ${touched} pages. misses: ${miss}`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
