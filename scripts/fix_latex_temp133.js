require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const doc = await col.findOne({ display_id: 'TEMP-133' });
  if (!doc) { console.log('❌ TEMP-133 not found'); return; }

  // Question Text fix: use proper subscripts and standard LaTeX for arrows.
  // We'll avoid \ce here since it has been causing issues.
  const newMarkdown = `Given below are half cell reactions:\n` +
    `$MnO_{4}^{-} + 8H^{+} + 5e^{-} \\rightarrow Mn^{2+} + 4H_{2}O,$\n` +
    `$E_{Mn^{2+}/MnO_{4}^{-}}^{\\circ} = -1.510 V$\n\n` +
    `$\\frac{1}{2}O_{2} + 2H^{+} + 2e^{-} \\rightarrow H_{2}O,$\n` +
    `$E_{O_{2}/H_{2}O}^{\\circ} = +1.223 V$\n\n` +
    `Will the permanganate ion, $MnO_{4}^{-}$ liberate $O_{2}$ from water in the presence of an acid?`;

  const fixedOptions = [
    { id: 'a', text: 'No, because $E_{\\text{cell}}^{\\circ} = -0.287 V$', is_correct: false },
    { id: 'b', text: 'Yes, because $E_{\\text{cell}}^{\\circ} = +2.733 V$', is_correct: false },
    { id: 'c', text: 'No, because $E_{\\text{cell}}^{\\circ} = -2.733 V$', is_correct: false },
    { id: 'd', text: 'Yes, because $E_{\\text{cell}}^{\\circ} = +0.287 V$', is_correct: true }
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

  console.log('✅ Updated TEMP-133 metadata and rendering successfully.');
  await client.close();
}

main().catch(console.error);
