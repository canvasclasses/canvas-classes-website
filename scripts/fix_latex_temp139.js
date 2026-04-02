require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const doc = await col.findOne({ display_id: 'TEMP-139' });
  if (!doc) { console.log('❌ TEMP-139 not found'); return; }

  const newMarkdown = `Match List-I with List-II.\n\n` +
    `| List-I (Ores) | List-II (Composition) |\n` +
    `| :--- | :--- |\n` +
    `| (A) Haematite | (iii) $Fe_{2}O_{3}$ |\n` +
    `| (B) Magnetite | (i) $Fe_{3}O_{4}$ |\n` +
    `| (C) Calamine | (ii) $ZnCO_{3}$ |\n` +
    `| (D) Kaolinite | (iv) $[Al_{2}(OH)_{4}Si_{2}O_{5}]$ |\n\n` +
    `Choose the correct answer from the options given below:`;

  const fixedOptions = [
    { id: 'a', text: '(A)-(iii), (B)-(i), (C)-(ii), (D)-(iv)', is_correct: true },
    { id: 'b', text: '(A)-(iii), (B)-(i), (C)-(iv), (D)-(ii)', is_correct: false },
    { id: 'c', text: '(A)-(i), (B)-(iii), (C)-(ii), (D)-(iv)', is_correct: false },
    { id: 'd', text: '(A)-(i), (B)-(ii), (C)-(iii), (D)-(iv)', is_correct: false }
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

  console.log('✅ Updated TEMP-139 with proper table and correct answer.');
  await client.close();
}

main().catch(console.error);
