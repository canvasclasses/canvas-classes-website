'use strict';
/**
 * Prepends a Mole-% explanation to the existing % Composition text on p8,
 * preserving all existing examples (Water, CuSO4·5H2O, etc.).
 *
 * Run: node scripts/refine_ch1_p8_mole_percent_patch.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

function flattenBlocks(arr) {
  const out = [];
  for (const b of arr) {
    if (b.type === 'section' && Array.isArray(b.columns)) for (const c of b.columns) out.push(...c);
    else out.push(b);
  }
  return out;
}
function computeReadingTime(arr) {
  const flat = flattenBlocks(arr);
  let w = 0;
  for (const b of flat) {
    if (b.type === 'text') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'heading') w += (b.text || '').split(/\s+/).length;
    else if (b.type === 'callout') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'worked_example') {
      w += (b.problem || '').split(/\s+/).length;
      w += (b.solution || '').split(/\s+/).length;
    }
  }
  return Math.max(1, Math.ceil(w / 200));
}

const OLD_OPENING = "The **percentage composition** of a compound gives the mass of each element present in 100 g of the compound.\n\n$$\\% \\text{ by mass of element}";

const NEW_OPENING =
  "The **percentage composition** of a compound tells you how much of each element is in it. We can express this in **two parallel ways**:\n\n**Mole percent** — the fraction of total atoms (counted in moles) contributed by each element:\n\n$$\\% \\text{ by mole of element} = \\frac{\\text{Moles of that element in the formula}}{\\text{Total moles of all atoms in the formula}} \\times 100$$\n\nFor a generic compound $\\ce{A2B3C}$, 1 mole contains **2 mol A + 3 mol B + 1 mol C = 6 mol of atoms total.** So mole % of A = (2/6) × 100 = 33.3 %.\n\n**Mass percent** — the fraction of total mass contributed by each element:\n\n$$\\% \\text{ by mass of element}";

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');
    const page = await pages.findOne({ slug: 'percentage-composition-empirical-formula' });
    if (!page) throw new Error('p8 not found');

    const idx = page.blocks.findIndex(
      (b) => b.type === 'text' && (b.markdown || '').startsWith('The **percentage composition** of a compound')
    );
    if (idx === -1) throw new Error('Could not find % composition opening text');

    const block = page.blocks[idx];
    const md = block.markdown || '';

    if (md.includes('Mole percent')) {
      console.log('⚠  Mole percent already present. No changes made.');
      return;
    }
    if (!md.includes(OLD_OPENING)) {
      console.log('⚠  Existing opening doesn’t match expected pattern. Aborting to avoid clobbering content.');
      console.log('Current opening (first 200 chars):');
      console.log(JSON.stringify(md.slice(0, 200)));
      return;
    }

    const newMd = md.replace(OLD_OPENING, NEW_OPENING);
    const updatedBlocks = page.blocks.map((b, i) => (i === idx ? { ...b, markdown: newMd } : b));

    await pages.updateOne(
      { _id: page._id },
      {
        $set: {
          blocks: updatedBlocks,
          reading_time_min: computeReadingTime(updatedBlocks),
          updated_at: new Date(),
        },
      }
    );

    console.log('✓ Prepended Mole percent explanation to p8 % Composition text.');
    console.log(`  Old text length: ${md.length} chars`);
    console.log(`  New text length: ${newMd.length} chars`);
    console.log(`  Existing examples (Water, CuSO4·5H2O) preserved.`);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
