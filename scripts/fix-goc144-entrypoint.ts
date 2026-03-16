import mongoose from 'mongoose';

async function fixGOC144() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db!;
  const col = db.collection('questions_v2');

  // Find GOC-144
  const doc = await col.findOne({ question_id: 'GOC-144' });
  if (!doc) {
    // try display_id field
    const doc2 = await col.findOne({ display_id: 'GOC-144' });
    if (!doc2) {
      console.log('GOC-144 not found by question_id or display_id — searching by prefix...');
      const docs = await col.find({ display_id: { $regex: /^GOC-144$/ } }).toArray();
      console.log('Found by regex:', docs.map(d => ({ _id: d._id, display_id: d.display_id, entryPoint: d.metadata?.entryPoint })));
    } else {
      console.log('Found via display_id:', doc2._id, 'entryPoint:', doc2.metadata?.entryPoint, 'solution:', doc2.solution);
    }
  } else {
    console.log('Found via question_id:', doc._id, 'entryPoint:', doc.metadata?.entryPoint, 'solution:', doc.solution);
  }

  // Find all docs with invalid entryPoint values
  const badDocs = await col.find({
    'metadata.entryPoint': { $nin: ['clear-entry', 'strategy-first', 'novel-framing', null, undefined, ''] }
  }).toArray();

  console.log(`\nFound ${badDocs.length} document(s) with invalid entryPoint:`);
  for (const d of badDocs) {
    console.log(`  _id: ${d._id}  display_id: ${d.display_id}  entryPoint: "${d.metadata?.entryPoint}"`);
  }

  // Also find all docs with null solution
  const nullSolDocs = await col.find({ solution: null }).toArray();
  console.log(`\nFound ${nullSolDocs.length} document(s) with null solution:`);
  for (const d of nullSolDocs) {
    console.log(`  _id: ${d._id}  display_id: ${d.display_id}`);
  }

  if (badDocs.length > 0) {
    console.log('\nFixing invalid entryPoint values (unsetting them)...');
    for (const d of badDocs) {
      await col.updateOne(
        { _id: d._id },
        { $unset: { 'metadata.entryPoint': '' } }
      );
      console.log(`  Fixed: ${d.display_id}`);
    }
  }

  if (nullSolDocs.length > 0) {
    console.log('\nFixing null solution objects...');
    for (const d of nullSolDocs) {
      await col.updateOne(
        { _id: d._id },
        { $set: { solution: { text_markdown: '', latex_validated: false } } }
      );
      console.log(`  Fixed: ${d.display_id}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

fixGOC144().catch(e => { console.error(e); process.exit(1); });
