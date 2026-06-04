// Setup script: Class 9 ICT — create the book + 8 empty chapter shells.
// Idempotent: re-running will NOT duplicate the book or chapters; it only
// adds any chapter that is missing. Pages are added by per-chapter scripts.
//
// Book: Information & Communication Technology — Class 9 (CBSE/NCERT)
// Source PDFs: ~/Downloads/Class 9 ICT/iict10{1..8}.pdf

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';

const CHAPTERS = [
  { number: 1, title: 'Introduction to ICT',                 slug: 'introduction-to-ict' },
  { number: 2, title: 'Creating Textual Communication',      slug: 'creating-textual-communication' },
  { number: 3, title: 'Creating Visual Communication',       slug: 'creating-visual-communication' },
  { number: 4, title: 'Creating Audio Video Communication',  slug: 'creating-audio-video-communication' },
  { number: 5, title: 'Presenting Ideas',                    slug: 'presenting-ideas' },
  { number: 6, title: 'Getting Connected: Internet',         slug: 'getting-connected-internet' },
  { number: 7, title: 'Safety and Security in the Cyber World', slug: 'safety-and-security-cyber-world' },
  { number: 8, title: 'Fun with Logic',                      slug: 'fun-with-logic' },
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
        title: 'Information & Communication Technology — Class 9',
        subject: 'ict',
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
      // Ensure every chapter shell is present (additive, no duplicates).
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
        console.log('✓ All 8 chapter shells already present — nothing to do.');
      }
    }

    console.log('\n✅ class9-ict book setup complete.');
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
