'use strict';
// Founder request (2026-07-10): the Ajanta & Ellora photos (items 4 & 5) don't belong in the
// top NATURAL-cave gallery — move them down beside the Ajanta/Ellora callout. Same R2 images,
// just relocated into a new 2-item gallery placed right after that callout. Nothing is deleted;
// the two asset URLs stay on the page, so no content/asset loss.
const crypto = require('crypto');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SLUG = 'underground-water-caves-and-karst-landscapes';
const isRockcut = (it) => /ajanta|ellora/i.test(`${it.caption || ''} ${it.alt || ''}`);

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);

    // 1) find the top gallery + split its items
    const topGallery = page.blocks.find((b) => b.type === 'gallery');
    if (!topGallery) throw new Error('no gallery on page');
    const moved = (topGallery.items || []).filter(isRockcut);
    const kept = (topGallery.items || []).filter((it) => !isRockcut(it));
    if (moved.length !== 2) throw new Error(`expected 2 Ajanta/Ellora items, found ${moved.length}: ` +
      moved.map((m) => m.caption).join(' | '));

    // order the moved pair Ajanta first, then Ellora (matches the callout's narrative order)
    moved.sort((a, b) => (/ajanta/i.test(`${a.caption}${a.alt}`) ? -1 : 1) - (/ajanta/i.test(`${b.caption}${b.alt}`) ? -1 : 1));

    const newGallery = { id: crypto.randomUUID(), type: 'gallery', order: 0, items: moved };

    // 2) rebuild blocks: shrink top gallery, insert new gallery after the Ajanta/Ellora callout
    let insertedAfter = false;
    const out = [];
    for (const b of page.blocks) {
      if (b === topGallery) { out.push({ ...b, items: kept }); continue; }
      out.push(b);
      const isAjantaCallout = b.type === 'callout' && /ajanta/i.test(`${b.title || ''}`);
      if (isAjantaCallout) { out.push({ ...newGallery }); insertedAfter = true; }
    }
    if (!insertedAfter) throw new Error('Ajanta/Ellora callout not found to anchor the moved gallery');

    // 3) safety: total image/gallery-item assets unchanged (nothing dropped)
    const assetSet = (blocks) => new Set(blocks.flatMap((b) =>
      [...(b.src ? [b.src] : []), ...((b.items || []).map((it) => it.src).filter(Boolean))]));
    const before = assetSet(page.blocks), after = assetSet(out);
    for (const url of before) if (!after.has(url)) throw new Error('ABORT: asset dropped ' + url);

    const reindexed = out.map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: SLUG }, reindexed, {
      author: 'agent',
      summary: 'Moved the Ajanta & Ellora photos out of the top natural-cave gallery into a new ' +
        'gallery under the Ajanta/Ellora callout (same images relocated; no asset removed).',
    });
    console.log(`✓ ${SLUG} saved (v${res.version || '?'}) — top gallery now ${kept.length} items, ` +
      `moved ${moved.length} (${moved.map((m) => (/ajanta/i.test(m.caption) ? 'Ajanta' : 'Ellora')).join(', ')}) to a gallery below the callout`);
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
