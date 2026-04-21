/**
 * Seed Career Explorer career paths.
 *
 * Upserts every item in SEED_CAREERS into the career_paths collection.
 * Safe to re-run — idempotent per slug `_id`.
 *
 * Usage:  npx tsx scripts/career-explorer/seed_careers.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { CareerPath } from '../../lib/models/CareerPath';
import { SEED_CAREERS } from '../../lib/careerExplorer/seedCareers';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set — add it to .env.local');

  await mongoose.connect(uri);
  console.log(`Connected. Upserting ${SEED_CAREERS.length} careers…`);

  const now = new Date();
  let upserts = 0;
  for (const c of SEED_CAREERS) {
    await CareerPath.updateOne(
      { _id: c._id },
      {
        $set: {
          ...c,
          updated_at: now,
        },
        $setOnInsert: { created_at: now },
      },
      { upsert: true },
    );
    upserts += 1;
  }

  console.log(`Done. ${upserts} careers upserted.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
