/**
 * Seed Career Explorer questionnaire.
 *
 * Upserts every item in SEED_QUESTIONS into the career_questions collection.
 * Safe to re-run — idempotent per `_id`.
 *
 * Usage:  npx tsx scripts/career-explorer/seed_questions.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { CareerQuestion } from '../../lib/models/CareerQuestion';
import { SEED_QUESTIONS } from '../../lib/careerExplorer/seedQuestions';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set — add it to .env.local');

  await mongoose.connect(uri);
  console.log(`Connected. Upserting ${SEED_QUESTIONS.length} questions…`);

  const now = new Date();
  let upserts = 0;
  for (const q of SEED_QUESTIONS) {
    await CareerQuestion.updateOne(
      { _id: q._id },
      {
        $set: {
          ...q,
          updated_at: now,
        },
        $setOnInsert: { created_at: now },
      },
      { upsert: true },
    );
    upserts += 1;
  }

  console.log(`Done. ${upserts} questions upserted.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
