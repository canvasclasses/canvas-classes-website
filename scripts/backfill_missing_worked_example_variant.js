'use strict';
/**
 * Backfills the missing required `variant` field on worked_example blocks
 * across Ch.1 Chemistry (ncert-simplified) — founder-flagged 2026-07-25 via
 * the admin editor's "Invalid block payload: N.variant: Invalid input" error
 * on 'equivalent-concept' after a block reorder. WorkedExampleBlockSchema
 * requires `variant: 'solved_example' | 'ncert_intext'` (no .optional()), but
 * 13 blocks across 4 pages were missing it entirely — silently tolerated by
 * the reader's rendering fallback, but rejected by the admin save-path's
 * strict Zod validation the moment those blocks are touched/reordered.
 *
 * All 13 are founder-authored problems (none are NCERT in-text examples), so
 * all get `variant: 'solved_example'`.
 *
 * Purely additive via book-writer.savePage (versioned, per page). Idempotent:
 * skips any block that already has a variant.
 * Run: node scripts/backfill_missing_worked_example_variant.js
 */
const bw = require('./lib/book-writer');

const SLUGS = ['mole-concept', 'atomic-molecular-mass', 'concentration-of-solutions', 'equivalent-concept'];

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');

    for (const slug of SLUGS) {
      const cur = await pages.findOne({ slug });
      if (!cur) { console.log(`SKIP ${slug} — not found`); continue; }

      const missing = cur.blocks.filter((b) => b.type === 'worked_example' && !b.variant);
      if (!missing.length) { console.log(`SKIP ${slug} — already clean`); continue; }

      const newBlocks = cur.blocks.map((b) =>
        (b.type === 'worked_example' && !b.variant) ? { ...b, variant: 'solved_example' } : b
      );

      const res = await bw.savePage(db, { slug }, newBlocks, {
        author: 'agent',
        summary: `Backfilled missing required 'variant' field (-> 'solved_example') on ${missing.length} ` +
          `worked_example block(s): ${missing.map((b) => b.label).join(' | ')}. Purely additive.`,
      });
      console.log(`SAVED ${res.slug} version ${res.version} · fixed ${missing.length} block(s) · lossDetected: ${res.diff.lossDetected}`);
    }
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
