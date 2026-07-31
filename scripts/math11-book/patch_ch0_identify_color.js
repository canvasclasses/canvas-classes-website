'use strict';
/* Fix: on "Spot the Right Graph" (Ch.0 p7), curve B was coloured 'sky' (cyan) —
   too close to curve A's 'violet' (light purple) to tell apart at a glance
   (founder screenshot catch, 2026-07-24). Swap every identify block's second
   function to 'emerald' (light green — unused elsewhere in this graph's ABCD
   set, distinct hue from violet/amber/pink). Data-only edit via the sanctioned
   book-writer gateway, versioned. Already applied — kept for the audit trail;
   guards against a no-op re-run by throwing if nothing matches.
   Run: node scripts/math11-book/patch_ch0_identify_color.js        (commits)
        node scripts/math11-book/patch_ch0_identify_color.js --dry  (dry-run) */
const bw = require('../lib/book-writer');
const { withDb } = bw;

const SLUG = 'spot-the-right-graph';
const DRY = process.argv.includes('--dry');

(async () => {
  await withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);
    let changed = 0;
    const out = page.blocks.map((b) => {
      if (b.type === 'math_graph' && b.identify && b.spec?.functions?.[1]?.color === 'sky') {
        changed++;
        const functions = b.spec.functions.map((f, i) => (i === 1 ? { ...f, color: 'emerald' } : f));
        return { ...b, spec: { ...b.spec, functions } };
      }
      return b;
    });
    if (changed === 0) throw new Error('no blocks matched — nothing to fix (already applied?)');
    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: `spot-the-right-graph: curve B 'sky' -> 'emerald' on ${changed} identify blocks (cyan/violet contrast fix)`,
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: ${changed} blocks fixed, removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — in-place field edit)`
      : `✓ ${SLUG}: v${res.version} · ${changed} identify blocks recoloured`);
  });
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
