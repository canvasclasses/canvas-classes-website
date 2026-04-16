/**
 * upgrade_solutions_p1_classify.js
 *
 * Page 1 "What is a Solution?" — replaces the static markdown table
 * inside text block (order 5) with a new `classify_exercise` block.
 *
 * Before:
 *   order 5 — text block containing the three-tests paragraph + teacher's
 *             quick question table (static, answers always visible)
 *   order 6 — image
 *   order 7 — callout (remember)
 *   order 8 — callout (exam_tip)
 *   order 9 — inline_quiz
 *
 * After:
 *   order 5 — text block (three-tests paragraph only, table removed)
 *   order 6 — classify_exercise (NEW interactive block)
 *   order 7 — image  (was 6)
 *   order 8 — callout remember  (was 7)
 *   order 9 — callout exam_tip  (was 8)
 *   order 10 — inline_quiz  (was 9)
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const PAGE_ID = '46c91134-9b22-4540-9278-f9d9a12a49dd';

// Text that stays in the text block — everything BEFORE the teacher's question
const UPDATED_TEXT_MARKDOWN = `Three tests distinguish a true solution from other mixtures:

1. **Transparent** — light passes through without scattering (unlike colloidal milk or muddy water)
2. **Stable** — components do not settle on standing, ever
3. **Cannot be filtered** — particles are at the atomic/ionic/molecular scale (< 1 nm)`;

// The new interactive classify_exercise block
const classifyBlock = {
  id: uuidv4(),
  type: 'classify_exercise',
  order: 6,
  question: 'Which of these are true solutions?',
  column_label: 'Substance',
  rows: [
    {
      substance: 'Steel',
      is_solution: true,
      explanation: 'Carbon dissolved in iron lattice — a solid-in-solid solution (alloy).',
    },
    {
      substance: 'Brass',
      is_solution: true,
      explanation: 'Zinc dissolved in copper — another solid-in-solid alloy solution.',
    },
    {
      substance: 'Brine',
      is_solution: true,
      explanation: 'NaCl dissolved in water — a classic solid-in-liquid aqueous solution.',
    },
    {
      substance: 'Sea water',
      is_solution: true,
      explanation: 'Multiple salts (NaCl, MgCl₂, etc.) dissolved uniformly in water.',
    },
    {
      substance: 'Rain water',
      is_solution: true,
      explanation: 'Dissolved CO₂, O₂, and trace minerals in liquid water — a dilute aqueous solution.',
    },
    {
      substance: 'Air',
      is_solution: true,
      explanation: 'N₂, O₂, Ar, CO₂ fully mixed at the molecular level — a gaseous solution.',
    },
    {
      substance: 'Sugar syrup',
      is_solution: true,
      explanation: 'Sucrose dissolved in water — homogeneous, transparent, cannot be filtered.',
    },
    {
      substance: 'Cough syrup',
      is_solution: true,
      explanation: 'Active compounds dissolved in a water-glycerol solvent — a liquid solution.',
    },
    {
      substance: 'Mist',
      is_solution: false,
      explanation: 'Mist is an aerosol — tiny liquid water droplets dispersed in air. Droplets are 1–100 µm, far above the < 1 nm particle size of a true solution. It is a colloid, not a solution.',
    },
    {
      substance: 'Ruby',
      is_solution: true,
      explanation: 'Cr³⁺ ions substituted into the Al₂O₃ crystal lattice — a solid-in-solid solution. The red colour comes from this substitution.',
    },
  ],
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const col = db.collection('book_pages');

  const page = await col.findOne({ _id: PAGE_ID });
  if (!page) { console.error('Page not found!'); process.exit(1); }

  // 1. Update text block at order 5 — remove the table
  const textBlock = page.blocks.find(b => b.order === 5 && b.type === 'text');
  if (!textBlock) { console.error('Text block at order 5 not found!'); process.exit(1); }
  textBlock.markdown = UPDATED_TEXT_MARKDOWN;

  // 2. Shift all blocks at order >= 6 up by 1 to make room
  for (const b of page.blocks) {
    if (b.order >= 6) b.order += 1;
  }

  // 3. Insert the new classify_exercise block at order 6
  page.blocks.push(classifyBlock);

  // 4. Sort by order for tidiness
  page.blocks.sort((a, b) => a.order - b.order);

  await col.updateOne(
    { _id: PAGE_ID },
    { $set: { blocks: page.blocks, updated_at: new Date() } }
  );

  console.log('✓ Page updated. New block order:');
  page.blocks.forEach(b => {
    const label = b.type === 'callout' ? `callout(${b.variant})`
      : b.type === 'classify_exercise' ? `classify_exercise — "${b.question}"`
      : b.type === 'text' ? `text (${b.markdown?.slice(0, 40)}…)`
      : b.type;
    console.log(` order ${b.order}: ${label}`);
  });

  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
