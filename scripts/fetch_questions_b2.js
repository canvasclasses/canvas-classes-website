require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const ids = Array.from({ length: 6 }, (_, i) => `MOLE-${280 + i}`);
  const docs = await col.find({ display_id: { $in: ids } }).toArray();
  docs.sort((a,b) => a.display_id.localeCompare(b.display_id, undefined, {numeric: true})).forEach(d => {
    console.log(`--- ${d.display_id} ---`);
    console.log(d.question_text.markdown);
    d.options.forEach(o => console.log(`${o.id}) ${o.text}`));
  });
  await client.close();
}
main();
