'use strict';
/**
 * Patch — inserts the eudiometer apparatus IMAGE + patterns/recipe TEXT
 * right after the existing Volume-Volume Analysis theory text.
 * The previous script missed this insertion because its content-match
 * didn't account for the **eudiometry** bold markup between "eudiometry"
 * and "(from the Greek". This patch uses a more robust match.
 *
 * Run: node scripts/refine_ch1_eudiometry_image_patch.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

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
const INTERACTIVE = new Set([
  'inline_quiz', 'simulation', 'video', 'molecule_3d', 'interactive_image',
  'classify_exercise', 'reasoning_prompt', 'worked_example', 'practice_link',
]);
function computeContentTypes(arr) {
  const flat = flattenBlocks(arr);
  const found = new Set();
  for (const b of flat) if (INTERACTIVE.has(b.type)) found.add(b.type);
  return [...found].sort();
}
function renumber(blocks) {
  return blocks.slice().sort((a, b) => a.order - b.order).map((b, i) => ({ ...b, order: i }));
}

const eudiometerImage = () => ({
  id: uuidv4(),
  type: 'image',
  src: '',
  alt: 'Eudiometer apparatus — a sealed graduated glass tube with platinum electrodes at the top showing a spark, inverted over a liquid reservoir, with a gas mixture confined inside above the liquid level',
  caption: '📸 A classic eudiometer apparatus — gases react inside the sealed tube when a spark is fired, and the volume change is read directly off the gradations',
  width: 'full',
  generation_prompt:
    'Detailed technical illustration of a classic eudiometer apparatus used for gas-phase combustion experiments. Show a long vertical graduated glass tube sealed at the top, with two thin platinum electrodes passing through the top seal and ending in a small spark gap visible at the top of the gas column. The tube is inverted, with its lower open end submerged in a small mercury (or water) reservoir at the bottom (a wide shallow bowl). Inside the tube, a faintly coloured gas mixture is confined above the liquid level. Volume gradations are marked clearly along the side of the tube (with numbers 10, 20, 30, 40, 50, 60 mL visible). Show a thin wire leading from the top electrodes to a small external electrical source on the side. Show a bright visible spark crackling between the two platinum electrodes. Label clearly with leader lines: "Platinum electrodes", "Spark", "Eudiometer tube", "Graduated scale", "Gas mixture", "Mercury / water reservoir". Dark background (#0a0a0a or near-black), orange accent labels and leader lines, clean technical illustration style.',
});

const eudiometryPatternsText = () => ({
  id: uuidv4(),
  type: 'text',
  markdown:
    "**The general hydrocarbon combustion equation** is the workhorse of eudiometry problems. Any hydrocarbon $\\ce{C_xH_y}$ burns in oxygen as:\n\n$$\\ce{C_xH_y + \\left(x + \\frac{y}{4}\\right)O2 -> xCO2 + \\frac{y}{2}H2O}$$\n\nSo by Avogadro's law, the volume ratios of the gas-phase substances follow the coefficients directly:\n\n$$1 \\text{ vol } \\ce{C_xH_y} \\;:\\; \\left(x + \\tfrac{y}{4}\\right) \\text{ vol } \\ce{O2} \\;:\\; x \\text{ vol } \\ce{CO2}$$\n\n*(Water condenses on cooling, so its volume drops out — but if you're applying mole-based formulas, the moles of water do count.)*\n\n**Air composition.** When a problem asks for the volume of **air** rather than pure oxygen, remember that atmospheric air is approximately **21% O₂ by volume** (the rest is mostly N₂, which is inert in combustion). So:\n\n$$\\text{Volume of air} = \\text{Volume of }\\ce{O2} \\times \\frac{100}{21}$$\n\n**Quick recap of selective absorbents** (used to identify which product gas is which in the cooled mixture):\n\n| Absorbent | Gas it removes |\n|---|---|\n| **KOH solution** | $\\ce{CO2}$ and $\\ce{SO2}$ |\n| **Alkaline pyrogallol** | $\\ce{O2}$ |\n| **Ammoniacal $\\ce{Cu2Cl2}$** | $\\ce{CO}$ |\n\n**Standard recipe for eudiometry problems:**\n\n1. Write the general combustion equation symbolically: $\\ce{C_xH_y + (x + y/4)O2 \\rightarrow xCO2 + (y/2)H2O}$.\n2. Identify each gas volume in the problem (hydrocarbon used, O₂ consumed or left over, CO₂ formed, etc.). For absorption problems, the volume drop after each absorbent step tells you how much of that gas was present.\n3. Use volume ratios to set up linear equations in $x$ and $y$.\n4. Solve, then read off the molecular formula.\n\nMost JEE eudiometry questions are variations on this routine.",
});

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');
    const page = await pages.findOne({ slug: 'stoichiometry-limiting-reagent' });
    if (!page) throw new Error('p9 not found');

    const hasImage = page.blocks.some(
      (b) => b.type === 'image' && (b.alt || '').toLowerCase().includes('eudiometer apparatus')
    );
    const hasPatternsText = page.blocks.some(
      (b) => b.type === 'text' && (b.markdown || '').includes('The general hydrocarbon combustion equation')
    );
    if (hasImage && hasPatternsText) {
      console.log('⚠  Image + patterns text already present. No changes.');
      return;
    }

    // Find the Vol-Vol theory text by a phrase that's guaranteed unique:
    const idx = page.blocks.findIndex(
      (b) => b.type === 'text' && (b.markdown || '').includes('historically used to measure atmospheric oxygen')
    );
    if (idx === -1) {
      throw new Error('Could not find the Vol-Vol theory text on p9 — looked for "historically used to measure atmospheric oxygen"');
    }
    console.log(`→ Found Vol-Vol theory text at block index ${idx}`);

    const before = page.blocks.slice(0, idx + 1);
    const after = page.blocks.slice(idx + 1);
    const inject = [];
    if (!hasImage) {
      inject.push(eudiometerImage());
      console.log('  + Will insert eudiometer apparatus image');
    }
    if (!hasPatternsText) {
      inject.push(eudiometryPatternsText());
      console.log('  + Will insert eudiometry patterns/recipe text');
    }
    const merged = renumber([...before, ...inject, ...after]);

    await pages.updateOne(
      { _id: page._id },
      {
        $set: {
          blocks: merged,
          reading_time_min: computeReadingTime(merged),
          content_types: computeContentTypes(merged),
          updated_at: new Date(),
        },
      }
    );

    console.log(`  ${page.blocks.length} blocks → ${merged.length} blocks · ${computeReadingTime(merged)}min read`);
    console.log('\n✓ Done.');
  } finally {
    await client.close();
  }
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
