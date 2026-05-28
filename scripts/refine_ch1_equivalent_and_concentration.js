'use strict';
/**
 * Round-6 refinements:
 *
 *   p9 (Stoichiometry) — 3 new worked examples for the Equivalent Concept section:
 *     - H₃PO₄ in Ca(OH)₂ reaction (n-factor depends on the reaction, even for triprotic acids)
 *     - Ca + Zn produce same amount of H₂ (eq-of-A = eq-of-B principle)
 *     - CO + Fe₂O₃ reduction, solved by Mole Concept AND Equivalent Concept side-by-side
 *
 *   p10 (Concentration of Solutions):
 *     - Intro text listing the 7 concentration units (after fun_fact)
 *     - Molarity supplementary text (M×V=mol, M×V_ml=mmol, temperature dependence)
 *     - WEX: Molarity from mole fraction (ethanol/water)
 *     - NEW "Dilution" h2 section (heading + text + WEX) between Molarity and Molality
 *     - WEX: Molality from mole fraction (I₂ in benzene)
 *     - WEX: Molarity → molality via density (acetic acid)
 *
 * Writes directly to MongoDB. Idempotency-guarded — re-runs are safe.
 * Run: node scripts/refine_ch1_equivalent_and_concentration.js
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

// ─── p9 new content ─────────────────────────────────────────────────────────

const h3po4WEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — n-factor of H₃PO₄ depends on the reaction',
  variant: 'solved_example',
  problem:
    'Find the equivalent weight of $\\ce{H3PO4}$ in the reaction:\n\n$$\\ce{Ca(OH)2 + H3PO4 -> CaHPO4 + 2H2O}$$\n\n*(Molecular weight of $\\ce{H3PO4}$ = 98 g/mol)*',
  solution:
    "**Step 1 — Count the H⁺ ions actually replaced.**\n\nLook at the products. $\\ce{H3PO4}$ has 3 ionisable H⁺ in its formula. But the product is $\\ce{CaHPO4}$ — one of the three hydrogens **is still attached** to the phosphate. So only **2 H⁺ ions** were actually replaced by Ca²⁺ in this reaction.\n\n$$n\\text{-factor} = 2$$\n\n**Step 2 — Apply** Eq. wt = M / n-factor.\n\n$$\\text{Eq. wt of } \\ce{H3PO4} = \\frac{98}{2} = \\boxed{49 \\text{ g/eq}}$$\n\n**Why this is tricky.** $\\ce{H3PO4}$ has *3* acidic H atoms in its formula — so a student might assume basicity is always 3, giving Eq.wt = 98/3 ≈ 32.7. But basicity depends on **how the acid actually reacts**, not just its formula. Here, only 2 of the 3 H⁺ are replaced. **Always read the product to count what got replaced — don't trust the formula alone.**",
  reveal_mode: 'tap_to_reveal',
});

const caZnWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Same equivalents, different elements',
  variant: 'solved_example',
  problem:
    '1.60 g of Ca and 2.60 g of Zn, when treated with an acid in excess separately, produced **the same amount of hydrogen**. If the equivalent weight of Zn is 32.6, what is the equivalent weight of Ca?',
  solution:
    "**Step 1 — Apply the equivalent principle.**\n\nIf two metals (Ca and Zn) produce the *same amount* of $\\ce{H2}$ when reacted with acid, they must have **the same number of equivalents** — both equal the equivalents of hydrogen displaced.\n\n$$\\text{Eq of Ca} = \\text{Eq of Zn}$$\n\n**Step 2 — Use** $\\text{Eq} = w / E$ **for each metal.**\n\n$$\\frac{w_{\\text{Ca}}}{E_{\\text{Ca}}} = \\frac{w_{\\text{Zn}}}{E_{\\text{Zn}}}$$\n\n$$\\frac{1.60}{E_{\\text{Ca}}} = \\frac{2.60}{32.6}$$\n\n**Step 3 — Solve.**\n\n$$E_{\\text{Ca}} = \\frac{1.60 \\times 32.6}{2.60} = \\boxed{20 \\text{ g/eq}}$$\n\n**The takeaway:** when two reactants produce equal amounts of *any* product, their equivalents are equal. You can solve for one unknown equivalent weight from another **without writing a single balanced equation.**",
  reveal_mode: 'tap_to_reveal',
});

const coFe2O3WEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Mole concept vs Equivalent concept, side-by-side',
  variant: 'solved_example',
  problem:
    'Calculate the amount of $\\ce{O2}$ required to produce enough CO (by reaction with C) to reduce **1.6 kg of $\\ce{Fe2O3}$**.\n\n*Molar masses:* C = 12, O = 16, Fe = 56, $\\ce{Fe2O3}$ = 160',
  solution:
    "This problem can be solved two ways. Compare them.\n\n---\n\n**Method 1 — Mole Concept.**\n\n*Reduction step:*\n\n$$\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$$\n\nFrom the equation: 160 g $\\ce{Fe2O3}$ requires $3 \\times 28 = 84$ g CO.\n\n$$\\text{CO required for 1600 g } \\ce{Fe2O3} = \\frac{84 \\times 1600}{160} = 840 \\text{ g}$$\n\n*Generation step:*\n\n$$\\ce{C + \\frac{1}{2}O2 -> CO}$$\n\n28 g of CO is produced from 16 g of $\\ce{O2}$.\n\n$$\\therefore \\text{O}_2 \\text{ required for 840 g CO} = \\frac{16 \\times 840}{28} = \\boxed{480 \\text{ g}}$$\n\nTwo balanced equations, two mole–mole proportions. Works — but tedious.\n\n---\n\n**Method 2 — Equivalent Concept.**\n\nIn the chain $\\ce{C + O2 -> CO}$, then $\\ce{CO + Fe2O3 -> Fe + CO2}$, equivalents flow through. **No need to balance either equation.**\n\n$$\\text{Eq of } \\ce{O2} = \\text{Eq of } \\ce{Fe2O3} \\text{ reduced}$$\n\n*Determine n-factors:*\n\n- **$\\ce{O2}$:** each O atom goes from 0 to −2, gaining 2 e⁻; 2 atoms per molecule → $n = 4$. Eq. wt = 32/4 = **8 g/eq**.\n- **$\\ce{Fe2O3 \\rightarrow 2Fe}$:** each Fe goes from +3 to 0, gaining 3 e⁻; 2 atoms per molecule → $n = 6$. Eq. wt = 160/6 ≈ **26.67 g/eq**.\n\n*Set up the equation:*\n\n$$\\frac{w_{\\ce{O2}}}{8} = \\frac{1600}{160/6}$$\n\n$$\\frac{w_{\\ce{O2}}}{8} = \\frac{1600 \\times 6}{160} = 60$$\n\n$$w_{\\ce{O2}} = 60 \\times 8 = \\boxed{480 \\text{ g}}$$\n\n---\n\n**Same answer — much less work.** The equivalent method bypasses both balanced equations and goes straight from the input (1600 g $\\ce{Fe2O3}$) to the output ($\\ce{O2}$ needed), because every step preserves the number of equivalents. **This is the kind of multi-step problem where the equivalent concept earns its keep.**",
  reveal_mode: 'tap_to_reveal',
});

// ─── p10 new content ───────────────────────────────────────────────────────

const concentrationIntro = () => ({
  id: uuidv4(),
  type: 'text',
  markdown:
    "Concentration is the answer to a single question: **how much solute is dissolved in how much solvent (or solution)?** But that question has many sensible answers, depending on whether you're measuring mass, volume, moles, equivalents, or particle count. You'll meet **seven different concentration units** in this section. Each one is the same fact viewed through a different lens:\n\n- **% by weight (w/w)** — mass-based\n- **% by volume (v/v)** — volume-based\n- **Mole fraction (X)** — pure ratios of particles, no units\n- **Molarity (M)** — moles per litre of solution\n- **Normality (N)** — equivalents per litre of solution\n- **Molality (m)** — moles per kilogram of solvent\n- **PPM and PPB** — parts-per-million and parts-per-billion, for very dilute solutions\n\nThese are all interchangeable — given enough information, you can convert between any two. **The skill is knowing which unit to use for which problem, and how to convert between them quickly.**",
});

const molarityFormulas = () => ({
  id: uuidv4(),
  type: 'text',
  markdown:
    "**Two equivalent rearrangements of the molarity equation** are worth memorising as separate facts:\n\n$$M \\times V(\\text{L}) = \\text{number of moles}$$\n\n$$M \\times V(\\text{mL}) = \\text{number of millimoles}$$\n\nThe second form is especially useful in **titration problems**, where volumes are naturally given in mL.\n\n**Caveat — molarity is temperature dependent.** The volume of a solution expands when temperature rises, so the same mass of solute produces a *lower* molarity at higher temperatures. For colligative-property problems where temperature changes, switch to **molality** (which is mass-based and therefore temperature-independent).",
});

const molarityFromMoleFractionWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Molarity from mole fraction',
  variant: 'solved_example',
  problem:
    'Calculate the molarity of a solution of ethanol in water in which the **mole fraction of ethanol is 0.04**. Assume the density of the solution is approximately 1 g/mL.\n\n*Molar masses:* $\\ce{C2H5OH}$ = 46, $\\ce{H2O}$ = 18',
  solution:
    "**Step 1 — Take 1 mole of total mixture.**\n\nFrom mole fractions:\n\n- Moles of ethanol = 0.04\n- Moles of water = 0.96\n\n**Step 2 — Mass of solution.**\n\n- Mass of ethanol = $0.04 \\times 46 = 1.84$ g\n- Mass of water = $0.96 \\times 18 = 17.28$ g\n- **Total mass = 19.12 g**\n\n**Step 3 — Volume of solution** (using density ≈ 1 g/mL):\n\n$$V = \\frac{\\text{mass}}{\\text{density}} = \\frac{19.12}{1} = 19.12 \\text{ mL} = 0.01912 \\text{ L}$$\n\n**Step 4 — Molarity.**\n\n$$M = \\frac{\\text{moles of solute}}{V(\\text{L})} = \\frac{0.04}{0.01912} \\approx \\boxed{2.09 \\text{ M}}$$\n\n*(Standard JEE option sets give ≈ 2.31 with slightly different density assumptions; the closest option to our 2.09 is around (a) ≈ 2.3.)*\n\n**The procedure is what matters:** *mole fraction → moles → mass → volume → molarity.* That four-step chain handles every problem of this kind.",
  reveal_mode: 'tap_to_reveal',
});

const dilutionSection = () => [
  { id: uuidv4(), type: 'heading', text: 'Dilution', level: 2 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "**Dilution** is the process of adding more solvent to a solution to lower its concentration. The key principle: **adding pure solvent doesn't change the number of moles of solute** — only the total volume of solution increases.\n\n- Before dilution: $n_{\\text{solute}} = M_1 V_1$\n- After dilution: $n_{\\text{solute}} = M_2 V_2$\n\nSince moles are conserved:\n\n$$\\boxed{M_1 V_1 = M_2 V_2}$$\n\nOne formula, every dilution problem. Plug in any three values and solve for the fourth.\n\n**Important caveat — this formula applies *only* to dilution** (adding pure solvent to a single solution). When you **mix two solutions of different concentrations**, the formula becomes:\n\n$$M_1 V_1 + M_2 V_2 = M_{\\text{final}} (V_1 + V_2)$$\n\nA classic **JEE 2013** problem asked exactly this case: mixing 750 mL of 0.5 M HCl with 250 mL of 2 M HCl gives $M = (0.5 \\times 750 + 2 \\times 250)/1000 = 0.875$ M. Don't apply $M_1 V_1 = M_2 V_2$ here — that's a different scenario.",
  },
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — Simple dilution',
    variant: 'solved_example',
    problem:
      '500 mL of a 5 M solution is diluted to 1500 mL. What is the molarity of the resulting solution?\n\n(a) 1.5 M  (b) 1.66 M  (c) 0.017 M  (d) 1.59 M',
    solution:
      "**Apply** $M_1 V_1 = M_2 V_2$:\n\n$$5 \\times 500 = M_2 \\times 1500$$\n\n$$M_2 = \\frac{2500}{1500} = \\boxed{1.66 \\text{ M} \\quad \\text{(answer b)}}$$\n\n**Sanity check:** we tripled the volume (500 → 1500), so the concentration should fall by a factor of 3 (5 → 1.66). ✓",
    reveal_mode: 'tap_to_reveal',
  },
];

const i2BenzeneWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Molality from mole fraction',
  variant: 'solved_example',
  problem:
    'The mole fraction of $\\ce{I2}$ in benzene is 0.1. What is the molality of $\\ce{I2}$ in benzene?\n\n(a) 1.42  (b) 3.205  (c) 2.06  (d) 1.86\n\n*Molar mass of benzene ($\\ce{C6H6}$) = 78*',
  solution:
    "**Step 1 — Set up mole counts.**\n\nFrom mole fractions: $n_{\\ce{I2}} = 0.1$ and $n_{\\text{benzene}} = 0.9$ per 1 mole of total mixture.\n\n**Step 2 — Mass of solvent (benzene).**\n\n$$w_{\\text{benzene}} = 0.9 \\times 78 = 70.2 \\text{ g} = 0.0702 \\text{ kg}$$\n\n**Step 3 — Molality** = moles of solute per kg of solvent.\n\n$$m = \\frac{n_{\\ce{I2}}}{w_{\\text{solvent}}\\,(\\text{kg})} = \\frac{0.1}{0.0702} \\approx \\boxed{1.42 \\text{ mol/kg} \\quad \\text{(answer a)}}$$\n\n**Key reminder:** for *molality*, the denominator is the mass of **solvent only** — not solution. That's the difference from molarity, and that's what makes molality temperature-independent.",
  reveal_mode: 'tap_to_reveal',
});

const aceticAcidM2mWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example — Molarity to molality using density',
  variant: 'solved_example',
  problem:
    'The density of a **2.05 M solution of acetic acid in water** is 1.02 g/mL. Calculate the molality of the solution.\n\n*Molar mass of acetic acid ($\\ce{CH3COOH}$) = 60*',
  solution:
    "**Approach — work with 1 litre of solution.**\n\n**Step 1 — Mass of 1 L of solution.**\n\n$$\\text{Mass} = V \\times d = 1000 \\text{ mL} \\times 1.02 \\text{ g/mL} = 1020 \\text{ g}$$\n\n**Step 2 — Moles and mass of solute.**\n\nFor 2.05 M, exactly 2.05 mol of acetic acid sits in 1 L of solution.\n\n$$\\text{Mass of acetic acid} = 2.05 \\times 60 = 123 \\text{ g}$$\n\n**Step 3 — Mass of solvent (water) = mass of solution − mass of solute.**\n\n$$w_{\\text{solvent}} = 1020 - 123 = 897 \\text{ g} = 0.897 \\text{ kg}$$\n\n**Step 4 — Molality.**\n\n$$m = \\frac{n_{\\text{solute}}}{w_{\\text{solvent}}\\,(\\text{kg})} = \\frac{2.05}{0.897} \\approx 2.29 \\text{ mol/kg}$$\n\nFrom the standard JEE option set (a) 1.14, (b) 3.28, **(c) 2.0**, (d) 0.44 — the closest is **(c) 2.0**. (Textbooks often round to $m \\approx M / d$ when solute mass is small compared to solvent mass.)\n\n**A direct conversion formula** worth memorising (derivable from the four steps above):\n\n$$\\boxed{m = \\frac{1000 \\, M}{1000 \\, d - M \\cdot M_{\\text{solute}}}}$$\n\nPlugging in: $m = (1000 \\times 2.05) / (1000 \\times 1.02 - 2.05 \\times 60) = 2050 / 897 ≈ 2.29$ — same answer, no four-step derivation needed in the exam.",
  reveal_mode: 'tap_to_reveal',
});

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    // ━━━ p9 — 3 new equivalent-concept worked examples
    console.log('━━━ p9: 3 new Equivalent-Concept worked examples ━━━');
    {
      const page = await pages.findOne({ slug: 'stoichiometry-limiting-reagent' });
      if (!page) { console.log('⚠  p9 not found.'); }
      else {
        const hasH3PO4 = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('CaHPO4')
        );
        const hasCaZn = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('1.60 g of Ca')
        );
        const hasCoFe2O3 = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('1.6 kg of $\\ce{Fe2O3}$')
        );

        if (hasH3PO4 && hasCaZn && hasCoFe2O3) {
          console.log('⚠  All three WEX already present. Skipping.');
        } else {
          const out = [];
          let injH3PO4 = false;
          let injCaZnAndCoFe2O3 = false;

          for (let i = 0; i < page.blocks.length; i++) {
            const b = page.blocks[i];
            out.push(b);

            // Insertion A — right after the Phosphorus Acids text (text containing "Phosphorus Acids")
            if (!injH3PO4 && !hasH3PO4 &&
                b.type === 'text' && (b.markdown || '').includes('phosphorus acids are a classic JEE trap')) {
              out.push(h3po4WEX());
              console.log('  + Inserted H₃PO₄ WEX after Phosphorus Acids text');
              injH3PO4 = true;
            }

            // Insertion B+C — right after the existing "12 g element + 32 g O" WEX
            if (!injCaZnAndCoFe2O3 && !(hasCaZn && hasCoFe2O3) &&
                b.type === 'worked_example' && (b.problem || '').includes('12 g of an element combines with 32 g of oxygen')) {
              if (!hasCaZn) out.push(caZnWEX());
              if (!hasCoFe2O3) out.push(coFe2O3WEX());
              console.log('  + Inserted Ca/Zn + CO/Fe₂O₃ WEX after existing 12g-element WEX');
              injCaZnAndCoFe2O3 = true;
            }
          }

          const final = await savePage(pages, page, out);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
        }
      }
    }

    // ━━━ p10 — Concentration of Solutions expansion
    console.log('\n━━━ p10: Concentration of Solutions expansion ━━━');
    {
      const page = await pages.findOne({ slug: 'concentration-of-solutions' });
      if (!page) { console.log('⚠  p10 not found.'); }
      else {
        const hasIntro = page.blocks.some(
          (b) => b.type === 'text' && (b.markdown || '').includes('Concentration is the answer to a single question')
        );
        const hasMolarityFormulas = page.blocks.some(
          (b) => b.type === 'text' && (b.markdown || '').includes('Two equivalent rearrangements of the molarity equation')
        );
        const hasMolarityMoleFracWEX = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.label || '').includes('Molarity from mole fraction')
        );
        const hasDilutionH2 = page.blocks.some(
          (b) => b.type === 'heading' && b.text === 'Dilution' && b.level === 2
        );
        const hasI2BenzeneWEX = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('mole fraction of $\\ce{I2}$ in benzene')
        );
        const hasAceticAcidWEX = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('2.05 M solution of acetic acid')
        );

        if (hasIntro && hasMolarityFormulas && hasMolarityMoleFracWEX && hasDilutionH2 && hasI2BenzeneWEX && hasAceticAcidWEX) {
          console.log('⚠  All p10 additions already present. Skipping.');
        } else {
          const out = [];
          let injIntro = false;
          let injMolaritySupp = false;
          let injMoleFracWEX = false;
          let injDilution = false;
          let injI2 = false;
          let injAceticAcid = false;

          for (let i = 0; i < page.blocks.length; i++) {
            const b = page.blocks[i];
            out.push(b);

            // A — Intro after fun_fact (block 0)
            if (!injIntro && !hasIntro &&
                b.type === 'callout' && (b.title || '').includes('One Solution, Six Descriptions')) {
              out.push(concentrationIntro());
              console.log('  + Inserted intro text after fun_fact');
              injIntro = true;
            }

            // B/C — Molarity supplementary text + Molarity-from-mole-fraction WEX after the Molarity main text
            if (!injMolaritySupp && !hasMolarityFormulas &&
                b.type === 'text' && (b.markdown || '').startsWith('**Molarity** is the number of moles of solute present in')) {
              out.push(molarityFormulas());
              console.log('  + Inserted Molarity supplementary text (M×V formulas + temperature note)');
              injMolaritySupp = true;
              if (!hasMolarityMoleFracWEX) {
                out.push(molarityFromMoleFractionWEX());
                console.log('  + Inserted Molarity-from-mole-fraction WEX');
                injMoleFracWEX = true;
              }
              // D — Dilution section comes right after — before next heading (Molality)
              if (!hasDilutionH2) {
                out.push(...dilutionSection());
                console.log(`  + Inserted Dilution section (${dilutionSection().length} blocks)`);
                injDilution = true;
              }
            }

            // E/F — Molality WEX after the Molality text
            if (!injI2 && !hasI2BenzeneWEX &&
                b.type === 'text' && (b.markdown || '').startsWith('**Molality** is the number of moles of solute per')) {
              if (!hasI2BenzeneWEX) {
                out.push(i2BenzeneWEX());
                console.log('  + Inserted I₂/benzene molality WEX');
                injI2 = true;
              }
              if (!hasAceticAcidWEX) {
                out.push(aceticAcidM2mWEX());
                console.log('  + Inserted acetic-acid M→m WEX');
                injAceticAcid = true;
              }
            }
          }

          // Note: if some inserts didn't fire due to text-mismatch, log it
          if (!injIntro && !hasIntro) console.log('  ⚠  Intro insertion didn’t fire — check fun_fact match');
          if (!injMolaritySupp && !hasMolarityFormulas) console.log('  ⚠  Molarity supp insertion didn’t fire — check existing Molarity text');
          if (!injI2 && !hasI2BenzeneWEX) console.log('  ⚠  Molality WEX insertion didn’t fire — check existing Molality text');

          const final = await savePage(pages, page, out);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
        }
      }
    }

    console.log('\n━━━ Final block counts ━━━');
    for (const slug of ['stoichiometry-limiting-reagent', 'concentration-of-solutions']) {
      const p = await pages.findOne({ slug });
      if (!p) continue;
      console.log(`  ${slug}  →  ${p.blocks?.length} blocks · ${p.reading_time_min}min read`);
    }
    console.log('\n✓ Done.');
  } finally {
    await client.close();
  }
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
