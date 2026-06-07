// Setup script: Class 9 Hindi "गंगा" — create the book + 12 empty chapter shells.
// Idempotent: re-running will NOT duplicate the book or chapters; it only adds
// any chapter that is missing. Pages are added by per-chapter scripts.
//
// Book: गंगा — कक्षा 9 हिंदी (NCERT, NEP 2020 / NCF-SE 2023, 1st ed. March 2026)
// Source PDFs: ~/Downloads/Class 9 Hindi/ihga1{ps,01..12}.pdf
// Workflow: _agents/workflows/HINDI_BOOK_PAGE_WORKFLOW.md §15
//
// DB IMPACT: inserts/updates exactly ONE document in the `books` collection.
// No questions_v2 writes. Rollback: db.books.deleteOne({ slug: 'class9-hindi-ganga' }).

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-hindi-ganga';

// विषय-क्रम — गद्य खंड (1–7) + काव्य खंड (8–12).
const CHAPTERS = [
  { number: 1,  title: 'दो बैलों की कथा',            slug: 'do-bailon-ki-katha' },
  { number: 2,  title: 'क्या लिखूँ?',                slug: 'kya-likhun' },
  { number: 3,  title: 'संवादहीन',                   slug: 'samvadheen' },
  { number: 4,  title: 'ऐसी भी बातें होती हैं',      slug: 'aisi-bhi-baaten-hoti-hain' },
  { number: 5,  title: 'आखिरी चट्टान तक',            slug: 'aakhiri-chattan-tak' },
  { number: 6,  title: 'रीढ़ की हड्डी',              slug: 'reedh-ki-haddi' },
  { number: 7,  title: 'मैं और मेरा देश',            slug: 'main-aur-mera-desh' },
  { number: 8,  title: 'पद (रैदास)',                 slug: 'pad-raidas' },
  { number: 9,  title: 'राम-लक्ष्मण-परशुराम संवाद',  slug: 'ram-lakshman-parshuram-samvad' },
  { number: 10, title: 'भारति, जय, विजयकरे!',        slug: 'bharti-jai-vijaykare' },
  { number: 11, title: 'झाँसी की रानी',              slug: 'jhansi-ki-rani' },
  { number: 12, title: 'घर की याद',                  slug: 'ghar-ki-yaad' },
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');

    const book = await books.findOne({ slug: BOOK_SLUG });

    if (!book) {
      const bookId = uuidv4();
      const doc = {
        _id: bookId,
        slug: BOOK_SLUG,
        title: 'गंगा — कक्षा 9 हिंदी (NCERT)',
        subject: 'hindi',
        grade: 9,
        board: 'ncert',
        is_published: false,
        audio_fallback: 'tts', // Hindi browser TTS (hi-IN) until human voice is recorded
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
        console.log(`  ✓ Added ${missing.length} missing chapter shell(s): ${missing.map(c => c.number).join(', ')}`);
      } else {
        console.log('  ✓ All 12 chapter shells already present — nothing to do.');
      }
    }
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
