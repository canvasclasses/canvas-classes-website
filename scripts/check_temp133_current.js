require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const doc = await col.findOne({ display_id: 'TEMP-133' });
  if (!doc) { console.log('❌ TEMP-133 not found'); return; }

  console.log('✅ Question Text:');
  console.log(doc.question_text.markdown);
  console.log('\n✅ Options:');
  console.log(JSON.stringify(doc.options, null, 2));

  await client.close();
}

main().catch(console.error);
