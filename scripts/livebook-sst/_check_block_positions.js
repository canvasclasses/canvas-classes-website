'use strict';
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

const TARGET_IDS = new Set([
  '7677bf16-793b-44d6-ac39-cf431d4e033e', // Jog Falls
  '0f4678ed-2428-4e1a-a022-d73fa4531cc6', // Mawsmai cave
]);

async function main() {
  await bw.withDb(async (db) => {
    const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, deleted_at: null }).toArray();
    for (const p of pages) {
      (p.blocks || []).forEach((b, i) => {
        if (TARGET_IDS.has(b.id)) {
          console.log(`${p.slug}: block[${i}] of ${p.blocks.length}, type=${b.type}, alt="${b.alt}", aspect_ratio=${b.aspect_ratio}`);
        }
      });
    }
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
