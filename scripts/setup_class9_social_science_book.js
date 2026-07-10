// Setup script: Class 9 Social Science — create the book + 9 empty chapter shells.
// Idempotent: re-running will NOT duplicate the book or chapters; it only
// adds any chapter that is missing. Pages are added by per-chapter scripts.
//
// Book: Understanding Society: India and Beyond — Social Science Textbook for Grade 9, Part 1
// Source PDFs: ~/Downloads/Class 9 Social science/iest10{1..9}.pdf

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-social-science';

const CHAPTERS = [
  { number: 1, title: 'Understanding Social Science',                       slug: 'understanding-social-science' },
  { number: 2, title: "Shaping of the Earth's Surface",                     slug: 'shaping-of-the-earths-surface' },
  { number: 3, title: 'Atmosphere and Climate',                             slug: 'atmosphere-and-climate' },
  { number: 4, title: 'Early Humans and Beginning of Civilisation',         slug: 'early-humans-and-beginning-of-civilisation' },
  { number: 5, title: 'State and Society up to 1000 CE',                   slug: 'state-and-society-up-to-1000-ce' },
  { number: 6, title: 'Democracy',                                          slug: 'democracy' },
  { number: 7, title: 'Elections',                                          slug: 'elections' },
  { number: 8, title: 'Building Blocks in Economics: The Problem of Choice', slug: 'building-blocks-in-economics' },
  { number: 9, title: 'The Price Puzzle: What Drives the Market',           slug: 'the-price-puzzle-what-drives-the-market' },
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');

    let book = await books.findOne({ slug: BOOK_SLUG });

    if (!book) {
      const bookId = uuidv4();
      const doc = {
        _id: bookId,
        slug: BOOK_SLUG,
        title: 'Understanding Society: India and Beyond — Class 9 Social Science',
        subject: 'social_science', // must match the Book schema enum (underscore, not hyphen)
        grade: 9,
        board: 'cbse',
        is_published: false,
        chapters: CHAPTERS.map(c => ({
          number: c.number,
          title: c.title,
          slug: c.slug,
          page_ids: [],
          is_published: false,
        })),
        created_at: new Date(),
        updated_at: new Date(),
      };
      await books.insertOne(doc);
      console.log(`✓ Created book "${doc.title}" (${bookId}) with ${CHAPTERS.length} chapter shells.`);
    } else {
      console.log(`ℹ Book "${BOOK_SLUG}" already exists (${book._id}).`);
      const have = new Set((book.chapters || []).map(c => c.number));
      const missing = CHAPTERS.filter(c => !have.has(c.number));
      if (missing.length) {
        await books.updateOne(
          { _id: book._id },
          {
            $push: {
              chapters: {
                $each: missing.map(c => ({
                  number: c.number,
                  title: c.title,
                  slug: c.slug,
                  page_ids: [],
                  is_published: false,
                })),
              },
            },
            $set: { updated_at: new Date() },
          }
        );
        console.log(`✓ Added ${missing.length} missing chapter shell(s): ${missing.map(c => c.number).join(', ')}`);
      } else {
        console.log('✓ All 9 chapter shells already present — nothing to do.');
      }
    }

    console.log('\n✅ class9-social-science book setup complete.');
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
