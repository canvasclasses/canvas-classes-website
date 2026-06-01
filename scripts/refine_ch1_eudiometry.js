'use strict';
/**
 * Round-7 — Expand the existing Volume-Volume Analysis (Eudiometry)
 * subsection on p9 with:
 *
 *   1. An eudiometer apparatus IMAGE (with a detailed generation_prompt,
 *      per the user's explicit request). Sits right after the existing
 *      Vol–Vol theory text.
 *   2. A SECOND theory text block covering:
 *        - the general hydrocarbon combustion equation
 *          C_xH_y + (x + y/4) O2 → x CO2 + (y/2) H2O
 *        - air composition (21% O₂ by volume) — converting between O₂ and air
 *        - the standard problem-solving recipe for eudiometry questions
 *        - quick recap of which absorbent grabs which gas
 *   3. Four new worked examples (text-only — calculations stay
 *      handwritten-ready per the user's existing convention):
 *        - Volume of air to completely burn 1 kg of carbon
 *        - Hydrocarbon formula from O₂ consumed + CO₂ formed (→ C₄H₆)
 *        - CH₄ + C₂H₄ mixture with swapped ratio (→ 50 mL CO₂)
 *        - Hydrocarbon formula via KOH + alkaline pyrogallol absorption (→ C₂H₄)
 *
 * Writes directly to MongoDB. Idempotency-guarded — re-runs are safe.
 * Run: node scripts/refine_ch1_eudiometry.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ─── Helpers ────────────────────────────────────────────────────────────────

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
async function savePage(pages, page, newBlocks) {
  const final = renumber(newBlocks);
  await pages.updateOne(
    { _id: page._id },
    {
      $set: {
        blocks: final,
        reading_time_min: computeReadingTime(final),
        content_types: computeContentTypes(final),
        updated_at: new Date(),
      },
    }
  );
  return final;
}

// ─── New block factories ────────────────────────────────────────────────────

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

const wexAirFor1kgCarbon = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Volume of air to burn 1 kg of carbon',
  variant: 'solved_example',
  problem:
    'What volume of air (containing 21% oxygen by volume) is required to completely burn **1 kg of carbon**, assumed to be 100% combustible?\n\n*(Atomic mass: C = 12; molar volume at NTP = 22.4 L)*',
  solution:
    "**Step 1 — Balanced equation.**\n\n$$\\ce{C + O2 -> CO2}$$\n\n1 mole C requires 1 mole O₂. *(12 g C requires 22.4 L O₂ at NTP.)*\n\n**Step 2 — Moles of carbon.**\n\n$$n_C = \\frac{1000}{12} = 83.33 \\text{ mol}$$\n\nSo we need 83.33 mol of $\\ce{O2}$.\n\n**Step 3 — Volume of O₂ required at NTP.**\n\n$$V_{\\ce{O2}} = 83.33 \\times 22.4 = 1866.6 \\text{ L}$$\n\n**Step 4 — Convert O₂ volume to *air* volume.**\n\nAir contains 21 L of O₂ per 100 L of air. So:\n\n$$V_{\\text{air}} = \\frac{100}{21} \\times 1866.6 = \\boxed{8888.5 \\text{ L of air}}$$\n\n**The trap to avoid:** the question asks for *air*, not pure *oxygen*. Always read what is being asked. Roughly, the volume of air needed is **~5 times** the volume of pure O₂.",
  reveal_mode: 'tap_to_reveal',
});

const wexHydrocarbonFromO2andCO2 = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Formula from O₂ consumed and CO₂ formed',
  variant: 'solved_example',
  problem:
    'At 300 K and 1 atm, **10 mL of a hydrocarbon** required **55 mL of O₂** for complete combustion, and **40 mL of CO₂** was formed. The formula of the hydrocarbon is:\n\n(a) $\\ce{C4H7Cl}$  (b) $\\ce{C4H6}$  (c) $\\ce{C4H10}$  (d) $\\ce{C4H8}$',
  solution:
    "**Step 1 — Write the general combustion equation.**\n\n$$\\ce{C_xH_y + \\left(x + \\frac{y}{4}\\right)O2 -> xCO2 + \\frac{y}{2}H2O}$$\n\nBy Avogadro's law, volume ratios follow the coefficients: $1 : (x + y/4) : x$.\n\n**Step 2 — Plug in the given volumes.**\n\n- 10 mL hydrocarbon → $10x$ mL CO₂; CO₂ formed = 40 mL → $10x = 40$.\n- 10 mL hydrocarbon → $10(x + y/4)$ mL O₂; O₂ used = 55 mL → $10(x + y/4) = 55$.\n\n**Step 3 — Solve for x.**\n\n$$x = \\frac{40}{10} = 4$$\n\n**Step 4 — Solve for y.**\n\n$$x + \\frac{y}{4} = \\frac{55}{10} = 5.5$$\n\n$$4 + \\frac{y}{4} = 5.5 \\implies \\frac{y}{4} = 1.5 \\implies y = 6$$\n\n**Formula:** $\\boxed{\\ce{C4H6} \\quad \\text{— answer (b)}}$\n\n**The pattern.** Two linear equations from two given volumes, two unknowns ($x$ and $y$). Most JEE eudiometry hydrocarbon problems reduce to exactly this routine.",
  reveal_mode: 'tap_to_reveal',
});

const wexMethaneEthyleneSwap = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Methane + ethylene mixture with swapped ratio',
  variant: 'solved_example',
  problem:
    'A mixture of methane and ethylene in the ratio $a:b$ by volume occupies **30 mL**. On complete combustion, the mixture yields **40 mL of CO₂**.\n\nWhat volume of CO₂ would have been obtained if the ratio were $b:a$ instead?\n\n(a) 50 mL  (b) 30 mL  (c) 40 mL  (d) 60 mL',
  solution:
    "**Step 1 — Write each combustion equation and read off the CO₂ yield.**\n\n$$\\ce{CH4 + 2O2 -> CO2 + 2H2O} \\quad \\text{(1 vol } \\ce{CH4} \\rightarrow 1 \\text{ vol } \\ce{CO2}\\text{)}$$\n\n$$\\ce{C2H4 + 3O2 -> 2CO2 + 2H2O} \\quad \\text{(1 vol } \\ce{C2H4} \\rightarrow 2 \\text{ vol } \\ce{CO2}\\text{)}$$\n\n**Step 2 — Set up two equations from the given data.**\n\n- Total volume of mixture: $a + b = 30$\n- Total CO₂ formed: $a \\cdot 1 + b \\cdot 2 = a + 2b = 40$\n\n**Step 3 — Solve.**\n\nSubtracting: $b = 10$, so $a = 20$.\n\n**Step 4 — Swap the ratio.**\n\nIf the ratio is now $b:a = 10:20$ — i.e., **10 mL methane and 20 mL ethylene** (total still 30 mL):\n\n$$\\text{CO}_2 = 10 \\times 1 + 20 \\times 2 = 10 + 40 = \\boxed{50 \\text{ mL} \\quad \\text{(answer a)}}$$\n\n**Why CO₂ goes up:** swapping the ratio means *more ethylene, less methane*. Ethylene gives **twice** as much CO₂ per volume as methane, so the total CO₂ jumps from 40 mL to 50 mL.",
  reveal_mode: 'tap_to_reveal',
});

const wexC2H4FromAbsorption = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Hydrocarbon formula via KOH + pyrogallol absorption',
  variant: 'solved_example',
  problem:
    '**7.5 mL** of a gaseous hydrocarbon was exploded with **36 mL of oxygen**. The total volume of gases on cooling was **28.5 mL**. Of that, **15 mL was absorbed by KOH** and the rest was absorbed in a solution of alkaline pyrogallol.\n\nIf all volumes are measured under the same conditions, deduce the formula of the hydrocarbon.',
  solution:
    "**Step 1 — Identify each product gas using the absorbents.**\n\n- KOH absorbs $\\ce{CO2}$ → 15 mL absorbed → **15 mL CO₂ was present.**\n- Alkaline pyrogallol absorbs $\\ce{O2}$ → the rest = 28.5 − 15 = **13.5 mL of leftover (unreacted) O₂.**\n\n**Step 2 — Find the O₂ actually consumed in combustion.**\n\n$$\\text{O}_2 \\text{ used} = 36 - 13.5 = 22.5 \\text{ mL}$$\n\n**Step 3 — Set up the general combustion equation.**\n\n$$\\ce{C_xH_y + \\left(x + \\frac{y}{4}\\right)O2 -> xCO2 + \\frac{y}{2}H2O}$$\n\n- 7.5 mL hydrocarbon → $7.5x$ mL CO₂ = 15 mL → $\\boxed{x = 2}$\n- 7.5 mL hydrocarbon → $7.5(x + y/4)$ mL O₂ = 22.5 mL\n\n**Step 4 — Solve for y.**\n\n$$x + \\frac{y}{4} = \\frac{22.5}{7.5} = 3$$\n\n$$2 + \\frac{y}{4} = 3 \\implies \\frac{y}{4} = 1 \\implies \\boxed{y = 4}$$\n\n**Formula:** $\\boxed{\\ce{C2H4}}$ — **ethylene.**\n\n**Why this problem is JEE-style.** It chains *three* concepts: (1) the general hydrocarbon combustion equation, (2) selective absorption to identify each product gas, and (3) using leftover (unreacted) O₂ to find how much was actually consumed. Build the absorption table first, then plug into the combustion equation.",
  reveal_mode: 'tap_to_reveal',
});

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    console.log('━━━ p9: expand Volume-Volume (Eudiometry) subsection ━━━');
    const page = await pages.findOne({ slug: 'stoichiometry-limiting-reagent' });
    if (!page) {
      console.log('⚠  p9 not found.');
      return;
    }

    // Idempotency probes
    const hasEudiometerImage = page.blocks.some(
      (b) => b.type === 'image' && (b.alt || '').toLowerCase().includes('eudiometer apparatus')
    );
    const hasPatternsText = page.blocks.some(
      (b) => b.type === 'text' && (b.markdown || '').includes('The general hydrocarbon combustion equation')
    );
    const hasAirFor1kgC = page.blocks.some(
      (b) => b.type === 'worked_example' && (b.problem || '').includes('burn **1 kg of carbon**')
    );
    const hasC4H6 = page.blocks.some(
      (b) => b.type === 'worked_example' && (b.problem || '').includes('10 mL of a hydrocarbon**')
    );
    const hasCh4C2h4Swap = page.blocks.some(
      (b) => b.type === 'worked_example' && (b.problem || '').includes('mixture of methane and ethylene')
    );
    const hasC2h4Absorption = page.blocks.some(
      (b) => b.type === 'worked_example' && (b.problem || '').includes('7.5 mL** of a gaseous hydrocarbon')
    );

    if (hasEudiometerImage && hasPatternsText && hasAirFor1kgC && hasC4H6 && hasCh4C2h4Swap && hasC2h4Absorption) {
      console.log('⚠  All eudiometry additions already present. Skipping.');
      return;
    }

    const out = [];
    let injImageAndText = false;
    let injNewWEX = false;

    for (let i = 0; i < page.blocks.length; i++) {
      const b = page.blocks[i];
      out.push(b);

      // Insertion A — right after the existing Volume-Volume theory text
      // (recognised by the phrase "eudiometry (from the Greek")
      if (!injImageAndText && !(hasEudiometerImage && hasPatternsText) &&
          b.type === 'text' && (b.markdown || '').includes('eudiometry (from the Greek')) {
        if (!hasEudiometerImage) {
          out.push(eudiometerImage());
          console.log('  + Inserted eudiometer apparatus image (with generation_prompt)');
        }
        if (!hasPatternsText) {
          out.push(eudiometryPatternsText());
          console.log('  + Inserted eudiometry patterns/recipe text');
        }
        injImageAndText = true;
      }

      // Insertion B — right after the existing "20 mL of CO" WEX (last existing Vol-Vol WEX)
      if (!injNewWEX && !(hasAirFor1kgC && hasC4H6 && hasCh4C2h4Swap && hasC2h4Absorption) &&
          b.type === 'worked_example' && (b.problem || '').includes('20 mL of $\\ce{CO}$ was mixed')) {
        if (!hasAirFor1kgC) {
          out.push(wexAirFor1kgCarbon());
          console.log('  + Inserted "Air to burn 1 kg of C" WEX');
        }
        if (!hasC4H6) {
          out.push(wexHydrocarbonFromO2andCO2());
          console.log('  + Inserted "Hydrocarbon → C₄H₆" WEX');
        }
        if (!hasCh4C2h4Swap) {
          out.push(wexMethaneEthyleneSwap());
          console.log('  + Inserted "Methane + ethylene swap" WEX');
        }
        if (!hasC2h4Absorption) {
          out.push(wexC2H4FromAbsorption());
          console.log('  + Inserted "C₂H₄ from KOH/pyrogallol absorption" WEX');
        }
        injNewWEX = true;
      }
    }

    if (!injImageAndText && !(hasEudiometerImage && hasPatternsText)) {
      console.log('  ⚠  Image/text insertion didn’t fire — check Vol-Vol theory text match');
    }
    if (!injNewWEX && !(hasAirFor1kgC && hasC4H6 && hasCh4C2h4Swap && hasC2h4Absorption)) {
      console.log('  ⚠  WEX insertion didn’t fire — check CO+KOH WEX match');
    }

    const final = await savePage(pages, page, out);
    console.log(`  ${page.blocks.length} blocks → ${final.length} blocks · ${computeReadingTime(final)}min read`);
    console.log('\n✓ Done.');
  } finally {
    await client.close();
  }
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
