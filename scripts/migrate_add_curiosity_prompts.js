/**
 * migrate_add_curiosity_prompts.js
 *
 * For every Class 9 book page that currently has a `reasoning_prompt` at Block 0:
 *  1. Inserts a `curiosity_prompt` at order 0
 *  2. Shifts all existing blocks up by 1 (order + 1)
 *
 * Run: node scripts/migrate_add_curiosity_prompts.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const COLLECTION = 'book_pages';

// Hand-crafted curiosity prompts keyed by page title (lowercase, trimmed).
// Each entry: { prompt, hint?, reveal? }
const CURIOSITY_BY_TITLE = {
  'pure substances vs. mixtures': {
    prompt: 'You pour yourself a glass of tap water. Your friend says it\'s "pure water — just H₂O." Is that right? What do you think is actually in that glass?',
    reveal: 'Tap water contains dissolved minerals, chlorine, and sometimes trace metals. "Pure" water in a scientific sense is something most of us have never tasted — it\'s actually flavourless and slightly odd.',
  },
  'homogeneous mixtures': {
    prompt: 'You stir a spoonful of sugar into hot tea until it completely disappears. Where does the sugar go? Is it still there — or has it truly vanished?',
    reveal: 'The sugar is still there — every sip is equally sweet. It has mixed so evenly that you can\'t separate it by looking. This is one of the things that makes some mixtures feel like magic.',
  },
  'heterogeneous mixtures': {
    prompt: 'You shake a bottle of salad dressing and it looks uniform. A few minutes later it separates into layers again. Why can\'t it stay mixed?',
    hint: 'Think about what oil and water actually do to each other.',
    reveal: 'Oil and water don\'t truly mix — they just get broken into droplets when shaken. The droplets settle back out because the two liquids don\'t dissolve in each other at all.',
  },
  'the tyndall effect': {
    prompt: 'On a foggy morning you can see a beam of sunlight cutting through the mist. On a clear day the same sunlight passes through the sky but you can\'t see the beam at all. Why does fog make the light beam visible?',
    reveal: 'The fog scatters light from tiny water droplets, making the beam visible from the side. Clear air has nothing large enough to scatter the light — so the beam passes through invisibly.',
  },
  'concentration of solutions': {
    prompt: 'If you keep adding salt to a glass of water, does there come a point where no more salt will dissolve? What do you think happens to the extra salt — and to the solution itself?',
    reveal: 'Yes — every liquid has a limit. When salt can no longer dissolve, the solution is "saturated." Understanding this limit is actually how we define and measure concentration.',
  },
  'solubility and temperature': {
    prompt: 'You\'ve probably noticed that hot tea dissolves sugar faster. But fizzy drinks go flat faster when warm. Can temperature be good for dissolving some things but bad for others at the same time?',
    reveal: 'Yes — temperature helps dissolve most solids (like sugar and salt) but pushes gases out of liquids. That\'s why cold cola stays fizzy longer: the gas dissolves better in cold water.',
  },
  'crystallisation': {
    prompt: 'Sea water is full of dissolved salt — invisible, completely mixed in. Salt farmers somehow get dry, solid salt from this water without any electricity or machines. How do you think they do it?',
    reveal: 'They let sunlight do the work. As water evaporates, the solution becomes more and more concentrated until the salt has no choice but to come out as solid crystals.',
  },
  'distillation': {
    prompt: 'Sailors used to die of thirst surrounded by ocean water. Sea water makes you sicker the more you drink. But the ocean has no shortage of water. What would you need to do to make it drinkable?',
    reveal: 'The key insight is that water evaporates at a lower temperature than salt dissolves. Capture the steam, cool it back to liquid, and you have fresh water — the salt stays behind.',
  },
  'paper chromatography': {
    prompt: 'Two black pens look identical. A detective needs to know if the same pen wrote two different notes. How could you possibly tell them apart — just from the ink — without a microscope?',
    hint: 'Think about what "black" ink actually is.',
    reveal: 'Black ink is usually a mixture of several coloured dyes. Different dyes travel at different speeds when dissolved — revealing a hidden fingerprint unique to each ink brand.',
  },
  'sublimation': {
    prompt: 'Dry ice (solid CO₂) warms up and disappears — no puddle, no liquid, just gone. Naphthalene balls (mothballs) do the same thing slowly over weeks. What do you think is happening to the solid?',
    reveal: 'Some solids skip the liquid phase entirely and turn directly into gas. This is rare and surprising — most things melt first. Understanding when this happens lets chemists separate substances that behave this way.',
  },
  'centrifugation': {
    prompt: 'Fresh milk is white and uniform. Leave it overnight and a cream layer floats to the top. What force causes the heavier part to separate from the lighter — and could you speed this up somehow?',
    reveal: 'Gravity is slowly pulling the denser particles down (and pushing the less dense ones up). Spinning at high speed multiplies that force thousands of times — what gravity takes hours to do, a centrifuge does in minutes.',
  },
  'coagulation': {
    prompt: 'River water is muddy and brown. But if you collect it in a bucket and wait, the mud slowly settles and the water above becomes clear. What if you needed it clear in minutes, not hours — what would you add?',
    reveal: 'Certain substances (like alum) cause tiny mud particles to clump together into larger masses that settle much faster. This trick has been used for centuries to purify drinking water.',
  },
  'choosing the right separation method': {
    prompt: 'You have three problems: sand mixed in water, alcohol mixed in water, and iron filings mixed in sand. Would you use the same method to solve all three — or does each one need a completely different approach?',
    reveal: 'Each problem needs a different method, because what makes a separation possible is always a difference in physical properties — density, boiling point, magnetic behaviour. Match the method to the difference.',
  },
  "india's contribution — the ors story": {
    prompt: 'A child has severe diarrhoea and is losing water and salts rapidly. No hospital, no IV drip. What simple household ingredients would you combine to make a life-saving drink — and why those specific ingredients?',
    reveal: 'The key is replacing both water AND the specific salts (electrolytes) lost. Plain water isn\'t enough. The right balance — discovered through careful science — has saved millions of lives at almost zero cost.',
  },
  'frontier question — can we create artificial blood?': {
    prompt: 'Real blood carries oxygen, fights infection, clots wounds, and transports nutrients — all at once. Scientists are trying to build an artificial replacement. Which of those jobs do you think would be the hardest to copy — and why?',
    reveal: 'Each function of blood has been mimicked partially, but replicating all of them in a single fluid that the body accepts is still an unsolved problem. Sometimes the gap between "simple-sounding" and "actually possible" is a hundred years of science.',
  },
};

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found in .env.local');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('crucible');
  const col = db.collection(COLLECTION);

  // Find all pages whose first block is a reasoning_prompt
  const pages = await col.find({
    'blocks.0.type': 'reasoning_prompt',
  }).toArray();

  console.log(`Found ${pages.length} pages with reasoning_prompt at block 0\n`);

  let updated = 0;
  let skipped = 0;

  for (const page of pages) {
    const titleKey = (page.title || '').toLowerCase().trim();
    const curiosityData = CURIOSITY_BY_TITLE[titleKey];

    if (!curiosityData) {
      console.log(`  SKIP — no curiosity prompt defined for: "${page.title}"`);
      skipped++;
      continue;
    }

    const curiosityBlock = {
      id: uuidv4(),
      type: 'curiosity_prompt',
      order: 0,
      prompt: curiosityData.prompt,
      ...(curiosityData.hint  ? { hint: curiosityData.hint }   : {}),
      ...(curiosityData.reveal ? { reveal: curiosityData.reveal } : {}),
    };

    // Shift all existing blocks up by 1
    const shiftedBlocks = page.blocks.map(b => ({ ...b, order: b.order + 1 }));

    const newBlocks = [curiosityBlock, ...shiftedBlocks];

    await col.updateOne(
      { _id: page._id },
      { $set: { blocks: newBlocks, updated_at: new Date() } }
    );

    console.log(`  ✓ ${page.title} (${page._id})`);
    updated++;
  }

  console.log(`\nDone — ${updated} updated, ${skipped} skipped.`);
  await client.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
