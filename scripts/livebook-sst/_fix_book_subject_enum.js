'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const VALID = ['chemistry','biology','physics','mathematics','science','social_science','english','ict','hindi','life_skills'];
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const books = await db.collection('books').find({}, { projection: { slug: 1, subject: 1 } }).toArray();
  let fixed = 0;
  for (const b of books) {
    if (VALID.includes(b.subject)) continue;
    const candidate = String(b.subject || '').replace(/-/g, '_'); // hyphen -> underscore
    if (VALID.includes(candidate)) {
      await db.collection('books').updateOne({ _id: b._id }, { $set: { subject: candidate } });
      console.log(`FIXED  ${b.slug}: "${b.subject}" -> "${candidate}"`);
      fixed++;
    } else {
      console.log(`⚠ REVIEW ${b.slug}: subject "${b.subject}" not in enum and no obvious hyphen fix`);
    }
  }
  console.log(`\nScanned ${books.length} books, fixed ${fixed}.`);
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
