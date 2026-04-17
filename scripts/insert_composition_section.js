require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('book_pages');
  const page = await col.findOne({ _id: '1b253452-8651-40e3-a901-dc6d3a481770' });

  const newBlocks = [
    {
      id: uuidv4(),
      type: 'heading',
      order: 2,
      text: 'What Do We Mean by Composition?',
      level: 2,
    },
    {
      id: uuidv4(),
      type: 'text',
      order: 3,
      markdown: [
        'Every substance — and every mixture — is made of different materials.',
        'Scientists use the word **composition** to describe what something is made of and how much of each material is present.',
        '',
        'Think of a glass of fresh orange juice. Its composition includes water, natural sugars, vitamin C, and fruit acids — each present in some amount.',
        'Add extra sugar to one glass, and its composition changes. That glass is now chemically different from another glass of juice, even though both look similar.',
        '',
        'Now think of a piece of pure copper wire. Snip a sample from one end, from the middle, from the other end — every sample is 100% copper atoms.',
        'The composition is the same throughout. Scientists call this **uniform composition**.',
        '',
        'This one idea unlocks the difference between the two types of mixtures you are about to study:',
        '',
        '- **Uniform composition** — looks and behaves the same in every part → called **homogeneous**',
        '- **Non-uniform composition** — different parts have different makeups → called **heterogeneous**',
        '',
        'In a handful of granite rock you can actually see the different minerals — white quartz, pink feldspar, black mica — as separate visible specks.',
        "That is non-uniform composition you can see with your own eyes. In a glass of salt water, no matter which drop you taste, it is equally salty.",
        'That is uniform composition.',
      ].join('\n'),
    },
    {
      id: uuidv4(),
      type: 'image',
      order: 4,
      src: '',
      alt: 'Uniform vs non-uniform composition illustrated by copper wire and granite',
      caption: '📸 Uniform composition (copper wire, left) vs. non-uniform composition (granite, right) — every cross-section of copper is identical; granite shows visibly different mineral grains.',
      width: 'full',
      generation_prompt: [
        'Split-panel composition diagram.',
        'Left panel labelled "Uniform Composition": cross-section of a copper wire showing a regular grid of identical orange copper atoms evenly packed throughout, with annotation "same everywhere."',
        'Right panel labelled "Non-uniform Composition": cross-section of a granite rock showing irregular patches of white quartz crystals, pink feldspar grains, and black mica flakes distributed unevenly, with annotation "different parts differ."',
        'Each panel has a small magnified inset circle showing the microscopic view of that material.',
        'Label: Copper (uniform), Granite (non-uniform), quartz, feldspar, mica.',
        'Dark background, orange accent labels, clean technical illustration style.',
      ].join(' '),
    },
  ];

  // Shift all blocks from index 2 onwards up by 3
  const shifted = page.blocks.map((b, i) => (i >= 2 ? { ...b, order: b.order + 3 } : b));

  // Insert new blocks at positions 2, 3, 4
  const finalBlocks = [
    ...shifted.slice(0, 2),
    ...newBlocks,
    ...shifted.slice(2),
  ];

  await col.updateOne(
    { _id: '1b253452-8651-40e3-a901-dc6d3a481770' },
    { $set: { blocks: finalBlocks, updated_at: new Date() } }
  );
  console.log('Done — composition section inserted at blocks 2-4');
  await client.close();
}

run().catch(err => { console.error(err); process.exit(1); });
