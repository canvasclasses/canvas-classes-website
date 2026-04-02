require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const doc = await col.findOne({ display_id: 'TEMP-138' });
  if (!doc) { console.log('❌ TEMP-138 not found'); return; }

  const newMarkdown = `$3O_{2}(g) \\rightleftharpoons 2O_{3}(g)$\n` +
    `For the above reaction at $298 K$, $K_{c}$ is found to be $3.0 \\times 10^{-59}$. If the concentration of $O_{2}$ at equilibrium is $0.040 M$ then concentration of $O_{3}$ in $M$ is`;

  const fixedOptions = [
    { id: 'a', text: '$1.9 \\times 10^{-63}$', is_correct: false },
    { id: 'b', text: '$2.4 \\times 10^{31}$', is_correct: false },
    { id: 'c', text: '$1.2 \\times 10^{21}$', is_correct: false },
    { id: 'd', text: '$4.38 \\times 10^{-32}$', is_correct: true }
  ];

  await col.updateOne(
    { _id: doc._id },
    { $set: { 
        'question_text.markdown': newMarkdown, 
        options: fixedOptions,
        'question_text.latex_validated': true 
      } 
    }
  );

  console.log('✅ Updated TEMP-138 rendering and correct answer successfully.');
  await client.close();
}

main().catch(console.error);
