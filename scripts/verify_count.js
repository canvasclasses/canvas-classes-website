require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const docs = await col.find({ display_id: { $in: ['MOLE-272', 'MOLE-273', 'MOLE-274', 'MOLE-275', 'MOLE-276'] } }).toArray();
  console.log('Docs found:', docs.length);
  docs.forEach(d => console.log(d.display_id, d.question_text.markdown.slice(0, 50)));
  await client.close();
}
main();
