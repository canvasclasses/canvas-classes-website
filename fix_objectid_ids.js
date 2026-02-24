// Fix 100 questions that have ObjectId _id instead of UUID string _id
// MongoDB does not allow updating _id in-place, so we delete + re-insert each doc
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');

  // Find all docs where _id is an ObjectId (not a string)
  // ObjectIds are BSON objects; strings are plain JS strings
  const all = await col.find({}).toArray();
  const badDocs = all.filter(d => typeof d._id !== 'string');

  console.log('Total questions:', all.length);
  console.log('Questions with ObjectId _id:', badDocs.length);

  let ok = 0, fail = 0;

  for (const doc of badDocs) {
    const oldId = doc._id;
    const newId = uuidv4();

    // Build new doc with UUID _id, all other fields identical
    const newDoc = { ...doc, _id: newId };

    try {
      // Delete old doc first (frees the display_id unique index slot)
      await col.deleteOne({ _id: oldId });
      // Then insert with new UUID _id
      await col.insertOne(newDoc);
      console.log(`  OK  ${doc.display_id}: ${oldId} -> ${newId}`);
      ok++;
    } catch (e) {
      console.log(`  FAIL ${doc.display_id}: ${e.message}`);
      // If insert failed after delete, try to restore original doc
      try { await col.insertOne(doc); } catch (_) {}
      fail++;
    }
  }

  console.log(`\nDone: ${ok} fixed, ${fail} failed`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
