'use strict';
/**
 * Apply Hinglish twins for one chapter's analytical blocks.
 *   node scripts/kaveri-fix/hinglish_apply.js <chapter> [--dry]
 * Reads _ch<N>_hinglish_fix.json: [{ kind, loc, hi | hi_description | hi_reflection }]
 * Sets the matching *_hinglish field by locator, verifying the block/kind match.
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');

const ch = Number(process.argv[2]);
const DRY = process.argv.includes('--dry');
if (!ch) { console.error('usage: hinglish_apply.js <chapter> [--dry]'); process.exit(1); }
const fixes = JSON.parse(fs.readFileSync(`scripts/kaveri-fix/_ch${ch}_hinglish_fix.json`, 'utf8'));

(async () => {
  await withBook(async ({ pages, allPages }) => {
    const bySlug = {};
    for (const f of fixes) (bySlug[f.loc.page_slug] ||= []).push(f);
    let applied = 0, miss = 0, touched = 0;
    for (const [slug, list] of Object.entries(bySlug)) {
      const page = allPages.find((p) => p.slug === slug);
      if (!page) { console.log('⚠ page', slug, 'not found'); continue; }
      let dirty = false;
      for (const f of list) {
        const b = (page.blocks || []).find((x) => x.id === f.loc.block_id);
        if (!b) { miss++; continue; }
        try {
          if (f.kind === 'device') { b.devices[f.loc.di].matches[f.loc.mi].explanation_hinglish = f.hi; }
          else if (f.kind === 'tone') { b.segments[f.loc.si].note_hinglish = f.hi; }
          else if (f.kind === 'culture') { b.detail_hinglish = f.hi; }
          else if (f.kind === 'theme') { const t = b.themes[f.loc.ti]; t.description_hinglish = f.hi_description; t.reflection_prompt_hinglish = f.hi_reflection; }
          else if (f.kind === 'lit_in_life') { b.markdown_hinglish = f.hi; }
          else { miss++; continue; }
          applied++; dirty = true;
        } catch { miss++; }
      }
      if (dirty) { touched++; if (!DRY) await savePageBlocks(pages, page._id, page.blocks); }
    }
    console.log(`Ch${ch}: ${DRY ? '[DRY] ' : ''}applied ${applied} hinglish fields across ${touched} pages. misses: ${miss}`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
