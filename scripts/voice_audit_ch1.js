/**
 * Chapter 1 voice audit — apply 14 surgical patches to remove AI-tells from prose.
 *
 * Patches live in /tmp/ch1_patches.json. Each is one of:
 *   - text/callout block (uses markdown field) — string-replace `old` with `new`
 *   - heading block (uses text field, isHeading: true) — string-replace `old` with `new`
 *
 * The script:
 *   1. Loads patches grouped by page slug
 *   2. Backs up each affected page to scripts/_backups/<slug>-pre-voiceaudit-<ts>.json
 *   3. For each block in the patch list:
 *      - finds the block by id
 *      - verifies the `old` snippet exists EXACTLY (aborts otherwise)
 *      - replaces with `new`
 *   4. Persists each page (atomic full-block-array $set + updated_at)
 *   5. Re-reads each affected block and confirms the change took
 *
 * Rollback: scripts/_backups/<slug>-pre-voiceaudit-<ts>.json is the
 * complete pre-mutation page — restorable in one findOneAndReplace.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

const PATCHES_PATH = '/tmp/ch1_patches.json';

(async () => {
  const patches = JSON.parse(fs.readFileSync(PATCHES_PATH, 'utf8'));
  console.log(`Loaded ${patches.length} patches.`);

  // Group by slug for batched per-page updates
  const bySlug = {};
  for (const p of patches) {
    (bySlug[p.slug] ||= []).push(p);
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const Pages = client.db('crucible').collection('book_pages');

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  let totalApplied = 0;
  let totalFailed = 0;

  for (const [slug, slugPatches] of Object.entries(bySlug)) {
    console.log(`\n── ${slug} (${slugPatches.length} patches) ──`);

    const page = await Pages.findOne({ slug });
    if (!page) { console.error(`  ✗ Page not found: ${slug}`); totalFailed += slugPatches.length; continue; }

    // Backup BEFORE any mutation
    const backupPath = path.join(__dirname, '_backups',
      `${slug}-pre-voiceaudit-${ts}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(page, null, 2));
    console.log(`  ✓ Backed up → ${path.relative(process.cwd(), backupPath)}`);

    // Build a fresh blocks array, applying every patch destined for this page
    const idToBlock = Object.fromEntries(page.blocks.map((b) => [b.id, b]));
    const failedPatches = [];

    for (const patch of slugPatches) {
      const b = idToBlock[patch.id];
      if (!b) {
        console.error(`  ✗ Block id ${patch.id} not on page ${slug}`);
        failedPatches.push(patch); continue;
      }

      const field = patch.isHeading ? 'text' : 'markdown';
      const current = b[field];
      if (typeof current !== 'string') {
        console.error(`  ✗ Block ${patch.id} has no string ${field}`);
        failedPatches.push(patch); continue;
      }

      if (!current.includes(patch.old)) {
        console.error(`  ✗ Snippet not found in block ${patch.id} (patterns: ${patch.patterns.join(', ')})`);
        console.error(`     Looking for: ${JSON.stringify(patch.old.substring(0, 80))}`);
        failedPatches.push(patch); continue;
      }

      // Replace ONLY the first occurrence (str.replace default — explicit for clarity)
      const updated = current.replace(patch.old, patch.new);
      b[field] = updated;
      totalApplied++;
      console.log(`  ✓ Patched #${b.order} (${patch.patterns.join(', ')})`);
    }

    totalFailed += failedPatches.length;

    // Persist the whole blocks array atomically
    await Pages.updateOne(
      { _id: page._id },
      { $set: { blocks: page.blocks, updated_at: new Date() } }
    );

    // Verify each successful patch round-trips
    const reloaded = await Pages.findOne({ _id: page._id });
    const reloadedById = Object.fromEntries(reloaded.blocks.map((b) => [b.id, b]));
    for (const patch of slugPatches) {
      if (failedPatches.includes(patch)) continue;
      const b = reloadedById[patch.id];
      const field = patch.isHeading ? 'text' : 'markdown';
      if (!b[field].includes(patch.new)) {
        console.error(`  ⚠ Verification failed for block ${patch.id}: new snippet not present after save`);
      }
    }
  }

  console.log('\n── Summary ──');
  console.log(`Applied: ${totalApplied} / ${patches.length}`);
  console.log(`Failed:  ${totalFailed}`);
  if (totalFailed > 0) {
    console.log(`Backups in scripts/_backups/*-pre-voiceaudit-${ts}.json`);
    process.exit(1);
  }
  console.log(`Backups in scripts/_backups/*-pre-voiceaudit-${ts}.json`);

  await client.close();
})().catch((err) => { console.error('✗ Migration failed:', err); process.exit(1); });
