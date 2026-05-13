require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const docs = await col.find({ display_id: /^CURR-/ }).sort({ display_id: -1 }).limit(3).toArray();
  console.log('Top CURR ids:', docs.map(d => d.display_id));
  await client.close();
}
main();
