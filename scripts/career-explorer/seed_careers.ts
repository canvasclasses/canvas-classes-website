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
import { CAREER_TAGS } from '../../lib/careerExplorer/seedCareerTags';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set — add it to .env.local');

  await mongoose.connect(uri);
  console.log(`Connected. Upserting ${SEED_CAREERS.length} careers…`);

  // Warn on any careers missing tags so we don't silently ship half-data.
  const untagged = SEED_CAREERS.filter((c) => !CAREER_TAGS[c._id]).map((c) => c._id);
  if (untagged.length > 0) {
    console.warn(`WARN: ${untagged.length} careers missing tags: ${untagged.join(', ')}`);
  }

  const now = new Date();
  let upserts = 0;
  for (const c of SEED_CAREERS) {
    const tags = CAREER_TAGS[c._id];
    const merged = tags
      ? { ...c, school_subjects: tags.school_subjects, evergreen_sector: tags.evergreen_sector }
      : c;
    await CareerPath.updateOne(
      { _id: c._id },
      {
        $set: {
          ...merged,
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
