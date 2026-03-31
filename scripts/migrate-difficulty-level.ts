/**
 * Migration: difficulty string → difficultyLevel number
 *
 * Pass 1 — maps deprecated metadata.difficulty string to canonical
 * metadata.difficultyLevel numeric field (1–5 scale):
 *   Easy   → 2
 *   Medium → 3
 *   Hard   → 4
 *
 * Pass 2 — any document still missing metadata.difficultyLevel (or where it
 * is null / 0) after Pass 1 is defaulted to 3 (Medium).
 *
 * Safe to re-run (idempotent per document).
 *
 * Usage:
 *   npx tsx scripts/migrate-difficulty-level.ts [--dry-run]
 *
 * Environment Variables Required:
 *   MONGODB_URI
 */

import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const MAPPING: Record<string, number> = {
  Easy: 2,
  Medium: 3,
  Hard: 4,
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI env var is not set.');
    process.exit(1);
  }

  const dryRun = process.argv.includes('--dry-run');
  console.log(dryRun ? '[DRY RUN] No writes will be performed.\n' : '[LIVE] Writing to MongoDB.\n');

  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB.');

  const db = client.db('crucible');
  const col = db.collection('questions_v2');

  const totals: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0, noLevel: 0 };

  // ── Pass 1: migrate old string difficulty to numeric level ────────────────
  console.log('\n── Pass 1: string difficulty → numeric level ─────────────');
  for (const [diffStr, diffLevel] of Object.entries(MAPPING)) {
    const docs = await col
      .find({ 'metadata.difficulty': diffStr }, { projection: { _id: 1, display_id: 1, 'metadata.difficultyLevel': 1 } })
      .toArray();

    if (docs.length === 0) {
      console.log(`  ${diffStr}: 0 documents — nothing to do.`);
      continue;
    }

    console.log(`  ${diffStr} → Level ${diffLevel}: ${docs.length} document(s)`);

    if (!dryRun) {
      const result = await col.updateMany(
        { 'metadata.difficulty': diffStr },
        { $set: { 'metadata.difficultyLevel': diffLevel } }
      );
      console.log(`    ✓ Updated ${result.modifiedCount} document(s).`);
    } else {
      docs.slice(0, 5).forEach(d =>
        console.log(`    [preview] ${(d as any).display_id} — current difficultyLevel: ${(d as any).metadata?.difficultyLevel} → ${diffLevel}`)
      );
      if (docs.length > 5) console.log(`    ... and ${docs.length - 5} more.`);
    }

    totals[diffStr] = docs.length;
  }

  // ── Pass 2: default any doc with missing / null / 0 difficultyLevel to 3 ─
  console.log('\n── Pass 2: missing difficultyLevel → default 3 (Medium) ──');
  const missingFilter = {
    $or: [
      { 'metadata.difficultyLevel': { $exists: false } },
      { 'metadata.difficultyLevel': null },
      { 'metadata.difficultyLevel': 0 },
    ],
  };

  const missingDocs = await col
    .find(missingFilter, { projection: { _id: 1, display_id: 1 } })
    .toArray();

  console.log(`  Documents with no valid difficultyLevel: ${missingDocs.length}`);

  if (missingDocs.length > 0) {
    if (!dryRun) {
      const result = await col.updateMany(missingFilter, { $set: { 'metadata.difficultyLevel': 3 } });
      console.log(`    ✓ Defaulted ${result.modifiedCount} document(s) to Level 3 (Medium).`);
    } else {
      missingDocs.slice(0, 5).forEach(d =>
        console.log(`    [preview] ${(d as any).display_id} — no difficultyLevel → 3`)
      );
      if (missingDocs.length > 5) console.log(`    ... and ${missingDocs.length - 5} more.`);
    }
    totals.noLevel = missingDocs.length;
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = totals.Easy + totals.Medium + totals.Hard + totals.noLevel;
  console.log('\n── Summary ──────────────────────────────────────────────');
  console.log(`  Easy   string → L2:  ${totals.Easy}`);
  console.log(`  Medium string → L3:  ${totals.Medium}`);
  console.log(`  Hard   string → L4:  ${totals.Hard}`);
  console.log(`  No level      → L3:  ${totals.noLevel}`);
  console.log(`  Total affected:      ${total}`);
  if (dryRun) console.log('\n  Re-run without --dry-run to apply changes.');

  await client.close();
  console.log('\nDone.');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
