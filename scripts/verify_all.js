require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const docs = await col.find({ display_id: /^MOLE-/ }).toArray();
  console.log('Docs found:', docs.length);
  docs.sort((a,b) => a.display_id.localeCompare(b.display_id, undefined, {numeric: true})).forEach(d => console.log(d.display_id));
  await client.close();
}
main();
