'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const SUBJECTS = ['chemistry','biology','physics','mathematics','science','social_science','english','ict','hindi','life_skills'];
const BOARDS = ['ncert','cbse','icse','custom'];
const NARR = ['tts','silent','hide'];
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const b = await client.db('crucible').collection('books').findOne({ slug: 'class9-social-science' });
  const errs = [];
  if (!b._id) errs.push('_id missing');
  if (!b.slug) errs.push('slug missing');
  if (!b.title) errs.push('title missing');
  if (!SUBJECTS.includes(b.subject)) errs.push(`subject "${b.subject}" not in enum`);
  if (!(typeof b.grade === 'number' && b.grade >= 6 && b.grade <= 12)) errs.push(`grade ${b.grade} out of range`);
  if (b.board != null && !BOARDS.includes(b.board)) errs.push(`board "${b.board}" not in enum`);
  if (b.narration_mode != null && !NARR.includes(b.narration_mode)) errs.push(`narration_mode "${b.narration_mode}" not in enum`);
  (b.chapters || []).forEach((c) => {
    if (c.number == null) errs.push(`ch missing number`);
    if (!c.slug) errs.push(`ch#${c.number} missing slug`);
    if (!c.title) errs.push(`ch#${c.number} missing title`);
  });
  if (errs.length) { console.log('❌ would fail book.save():\n - ' + errs.join('\n - ')); }
  else { console.log(`✅ book satisfies EVERY Book-schema constraint — chapter publish (book.save) will now succeed.\n   subject=${b.subject} grade=${b.grade} board=${b.board} chapters=${(b.chapters||[]).length}`); }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
