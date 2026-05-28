'use strict';
/**
 * Round-4 refinements to Chapter 4 — treats the mole concept as the central
 * topic of the chapter, expanding p6, p7, and (most heavily) p9.
 *
 *   p6  →  +2 worked examples (Fe JEE 2009, Neon three-isotope)
 *   p7  →  +2 worked examples (CaCO₃ from molecules, CH₄ atom-count)
 *   p9  →  Major restructure:
 *           - NEW "Types of Stoichiometric Calculations" (etymology + 4 sub-sections)
 *             - Mass-Mass Analysis (derivation)
 *             - Mass-Volume Analysis (derivation)
 *             - Mole-Mole Analysis (general formula)
 *             - Volume-Volume Analysis / Eudiometry (setup + absorbents + 2 WEX)
 *           - NEW "Two Ways to Find the Limiting Reagent" h3 + text
 *           - +2 LR worked examples (Na₂CO₃+HCl perfect stoich, C+Cl₂→CCl₄)
 *           - NEW "Theoretical Yield and % Yield" section
 *
 * Writes directly to MongoDB. Idempotency-guarded — re-runs are safe.
 * Run: node scripts/refine_ch1_mole_central_topic.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ─── Helpers ────────────────────────────────────────────────────────────────

function flattenBlocks(arr) {
  const out = [];
  for (const b of arr) {
    if (b.type === 'section' && Array.isArray(b.columns)) {
      for (const col of b.columns) out.push(...col);
    } else out.push(b);
  }
  return out;
}
function computeReadingTime(arr) {
  const flat = flattenBlocks(arr);
  let w = 0, v = 0, a = 0;
  for (const b of flat) {
    if (b.type === 'text') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'heading') w += (b.text || '').split(/\s+/).length;
    else if (b.type === 'callout') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'worked_example') {
      w += (b.problem || '').split(/\s+/).length;
      w += (b.solution || '').split(/\s+/).length;
    }
    else if (b.type === 'video') v++;
    else if (b.type === 'audio_note') a++;
  }
  return Math.max(1, Math.ceil(w / 200) + v * 2 + a);
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

// ─── p6 new worked examples ─────────────────────────────────────────────────

const feIsotopesWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 2 — JEE 2009 (Iron isotopes)',
  variant: 'solved_example',
  problem:
    'Given that the abundances of isotopes $\\ce{^{54}Fe}$, $\\ce{^{56}Fe}$, and $\\ce{^{57}Fe}$ are **5%, 90%, and 5%** respectively, calculate the atomic mass of Fe.',
  solution:
    "**Using the average atomic mass formula:**\n\n$$\\text{Avg. atomic mass} = \\frac{54 \\times 5 + 56 \\times 90 + 57 \\times 5}{100}$$\n\n$$= \\frac{270 + 5040 + 285}{100} = \\frac{5595}{100}$$\n\n$$\\boxed{\\text{Avg. atomic mass of Fe} = 55.95 \\text{ u}}$$\n\n**Why JEE asks this:** the periodic-table value of Fe is 55.85 (based on real natural abundances). This problem tests whether you can compute the weighted average from *given* abundances rather than recall a textbook number.",
  reveal_mode: 'tap_to_reveal',
});

const neonIsotopesWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 3 — Three-isotope average (Neon)',
  variant: 'solved_example',
  problem:
    'Naturally occurring neon consists of three isotopes:\n\n- **90.92%** with mass **19.99244 amu**\n- **0.257%** with mass **20.99395 amu**\n- **8.82%** with mass **21.99138 amu**\n\nWhat is the average atomic weight of neon?',
  solution:
    "**Apply the weighted-average formula:**\n\n$$\\text{Avg.} = \\frac{19.99244 \\times 90.92 + 20.99395 \\times 0.257 + 21.99138 \\times 8.82}{100}$$\n\nTerm by term:\n\n- $19.99244 \\times 90.92 \\approx 1817.51$\n- $20.99395 \\times 0.257 \\approx 5.40$\n- $21.99138 \\times 8.82 \\approx 193.96$\n\nSum $= 1817.51 + 5.40 + 193.96 = 2016.87$\n\n$$\\boxed{\\text{Avg. atomic weight} = \\frac{2016.87}{100} \\approx 20.17 \\text{ amu}}$$\n\n**Key takeaway:** even with messy real-world abundance numbers, the procedure is identical — multiply each isotope's mass by its percent abundance and divide the sum by 100.",
  reveal_mode: 'tap_to_reveal',
});

// ─── p7 new worked examples ─────────────────────────────────────────────────

const caco3WEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 3 — From molecules to mass',
  variant: 'solved_example',
  problem:
    'Calculate the weight of $6.022 \\times 10^{24}$ molecules of $\\ce{CaCO3}$.\n\n*Atomic masses:* Ca = 40, C = 12, O = 16',
  solution:
    "**Step 1 — Convert molecules to moles.**\n\n$$n = \\frac{N}{N_A} = \\frac{6.022 \\times 10^{24}}{6.022 \\times 10^{23}} = 10 \\text{ mol}$$\n\n**Step 2 — Find the molar mass of $\\ce{CaCO3}$.**\n\n$$M = 40 + 12 + 3(16) = 100 \\text{ g/mol}$$\n\n**Step 3 — Find the weight.**\n\n$$w = n \\times M = 10 \\times 100 = \\boxed{1000 \\text{ g}}$$\n\n**Notice the pattern:** moles is the *middle stop* in every conversion. Particles $\\rightarrow$ moles $\\rightarrow$ mass. Skip the middle, and you'll get lost.",
  reveal_mode: 'tap_to_reveal',
});

const ch4AtomsWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 4 — Counting atoms in polyatomic molecules',
  variant: 'solved_example',
  problem:
    'How many atoms are present in $12.044 \\times 10^{23}$ molecules of $\\ce{CH4}$?',
  solution:
    "**Step 1 — Count atoms per molecule.**\n\nEach $\\ce{CH4}$ molecule contains **5 atoms** (1 carbon + 4 hydrogen).\n\n**Step 2 — Multiply.**\n\n$$\\text{Total atoms} = 5 \\times 12.044 \\times 10^{23}$$\n\n$$= 5 \\times 2 \\times 6.022 \\times 10^{23}$$\n\n$$= 10 \\, N_A$$\n\n$$\\boxed{= 10 \\text{ moles of atoms}}$$\n\n**Why this matters:** the question asked for *atoms*, not molecules. JEE/NEET love this distinction — always check whether the question wants atoms, molecules, ions, or formula units before answering.",
  reveal_mode: 'tap_to_reveal',
});

// ─── p9 new content ─────────────────────────────────────────────────────────

const typesOfStoichSection = () => [
  // h2
  { id: uuidv4(), type: 'heading', text: 'Types of Stoichiometric Calculations', level: 2 },
  // text — etymology + 4-type overview
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "**Stoichiometry** comes from two Greek roots: *stoicheion* (element) + *metron* (measure). It is the branch of chemistry that handles the **quantitative relationships** between substances in a chemical reaction — how much reactant is needed, how much product is formed, and in what proportions.\n\nStarting from a balanced equation, every stoichiometric problem fits one of **four standard types**, classified by what is given and what is asked:\n\n| Type | Given | Find |\n|------|-------|------|\n| **Mass–Mass** | Mass of one substance | Mass of another |\n| **Mass–Volume** | Mass of one substance | Volume of a gas (at STP) |\n| **Mole–Mole** | Moles of one substance | Moles of another |\n| **Volume–Volume** *(Eudiometry)* | Volume of a gas | Volume of another gas |\n\n**The strategy is the same in every type:** convert everything to **moles** first, apply the mole ratios from the balanced equation, and convert back to whatever the question asks for. Once you internalise this, every stoichiometry problem reduces to the same three-step routine.",
  },

  // h3 Mass-Mass
  { id: uuidv4(), type: 'heading', text: 'Mass–Mass Analysis', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "Consider the decomposition of potassium chlorate:\n\n$$\\ce{2KClO3 -> 2KCl + 3O2}$$\n\nThe coefficients give the mole ratios directly: **2 mol $\\ce{KClO3}$ → 2 mol $\\ce{KCl}$ + 3 mol $\\ce{O2}$**.\n\nConverting to masses (using $M_{\\ce{KClO3}} = 122.5$, $M_{\\ce{KCl}} = 74.5$, $M_{\\ce{O2}} = 32$):\n\n$$2 \\times 122.5\\text{ g } \\ce{KClO3} \\;\\longrightarrow\\; 2 \\times 74.5\\text{ g } \\ce{KCl} + 3 \\times 32\\text{ g } \\ce{O2}$$\n\nFrom this, the mass ratios are **fixed by stoichiometry**:\n\n$$\\frac{\\text{Mass of }\\ce{KClO3}}{\\text{Mass of }\\ce{KCl}} = \\frac{2 \\times 122.5}{2 \\times 74.5}$$\n\nRearrange both sides — divide each by the corresponding molar mass — and the same equation reads, in moles:\n\n$$\\frac{\\text{Moles of }\\ce{KClO3}}{2} = \\frac{\\text{Moles of }\\ce{KCl}}{2}$$\n\nThe coefficients of the balanced equation are the only numbers that matter. **All mass-to-mass problems reduce to this kind of proportion.**",
  },

  // h3 Mass-Volume
  { id: uuidv4(), type: 'heading', text: 'Mass–Volume Analysis', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "When a reactant or product is a **gas** at known temperature and pressure, it is often easier to measure its volume than its mass. At STP, 1 mole of any gas occupies **22.4 L**.\n\nFor the same decomposition:\n\n$$\\ce{2KClO3 -> 2KCl + 3O2}$$\n\n| Substance | Moles | Mass | Volume at STP |\n|---|---|---|---|\n| $\\ce{KClO3}$ | 2 | $2 \\times 122.5$ g | — (solid) |\n| $\\ce{KCl}$ | 2 | $2 \\times 74.5$ g | — (solid) |\n| $\\ce{O2}$ | 3 | $3 \\times 32$ g | $3 \\times 22.4$ L |\n\nThe mass-to-volume ratios are fixed:\n\n$$\\frac{\\text{Mass of }\\ce{KClO3}}{\\text{Volume of }\\ce{O2}\\text{ at STP}} = \\frac{2 \\times 122.5}{3 \\times 22.4}$$\n\n$$\\frac{\\text{Mass of }\\ce{KCl}}{\\text{Volume of }\\ce{O2}\\text{ at STP}} = \\frac{2 \\times 74.5}{3 \\times 22.4}$$\n\nThese two relations let you find any one of *mass of $\\ce{KClO3}$*, *mass of $\\ce{KCl}$*, or *volume of $\\ce{O2}$ at STP* — given any other. The 367.5 g $\\ce{KClO3}$ worked example below uses exactly this idea.",
  },

  // h3 Mole-Mole
  { id: uuidv4(), type: 'heading', text: 'Mole–Mole Analysis', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "Strip masses and volumes away, and what remains is the cleanest form of stoichiometry — the **mole–mole** relation. For the same reaction:\n\n$$\\frac{\\text{Moles of }\\ce{KClO3}}{2} = \\frac{\\text{Moles of }\\ce{KCl}}{2} = \\frac{\\text{Moles of }\\ce{O2}}{3}$$\n\nThis is just the balanced equation, read out loud.\n\n**General rule.** For *any* balanced equation:\n\n$$aA + bB \\longrightarrow cC + dD$$\n\nthe following is always true:\n\n$$\\frac{\\text{Moles of A reacted}}{a} = \\frac{\\text{Moles of B reacted}}{b} = \\frac{\\text{Moles of C produced}}{c} = \\frac{\\text{Moles of D produced}}{d}$$\n\nwhere $a$, $b$, $c$, $d$ are the **stoichiometric coefficients**. This single relation handles every stoichiometric calculation. Convert everything to moles, apply the formula, and convert back at the end. **Mole–mole is the foundation; mass–mass and mass–volume are just translations of it.**",
  },

  // h3 Volume-Volume (Eudiometry)
  { id: uuidv4(), type: 'heading', text: 'Volume–Volume Analysis (Eudiometry)', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "For reactions that take place **entirely in the gas phase**, you can measure quantities by volume instead of mass. The technique is called **eudiometry** (from the Greek *eudios*, “fair weather” — historically used to measure atmospheric oxygen).\n\nVol–vol analysis is built on **Avogadro's law**: equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules. So the volume ratios in a gaseous reaction are *equal to the mole ratios* — same as the stoichiometric coefficients of the balanced equation.\n\n**The experimental setup.** Gaseous reactions are run in a sealed glass tube called a **eudiometer tube**, fitted with platinum electrodes for spark ignition. After the reaction, the individual product gases are identified and measured by passing the mixture through a series of selective absorbing reagents:\n\n| Gas absorbed | Reagent used |\n|---|---|\n| $\\ce{CO2}$, $\\ce{SO2}$ | KOH solution |\n| $\\ce{O2}$ | alkaline pyrogallol |\n| $\\ce{CO}$ | ammoniacal cuprous chloride |\n\n**Water vapour** produced during a reaction condenses on cooling — its *volume* is usually ignored when comparing gas volumes, but its *moles* must be counted when applying mole-based formulas.\n\nThe drop in total volume after each absorption step tells you how much of that specific gas was present. By chaining absorption steps, you can deduce the formula of an unknown gaseous reactant — a classic JEE-style problem.",
  },

  // WEX — propane combustion
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — Vol–Vol: combustion of propane',
    variant: 'solved_example',
    problem:
      'What volume of oxygen will be required for the complete combustion of **18.2 L of propane** ($\\ce{C3H8}$) at NTP?',
    solution:
      "**Step 1 — Write the balanced equation.**\n\n$$\\ce{C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)}$$\n\n**Step 2 — Read off the volume ratios from the coefficients.**\n\n| | $\\ce{C3H8}$ | $\\ce{O2}$ | $\\ce{CO2}$ | $\\ce{H2O}$ |\n|---|---|---|---|---|\n| Volume ratio | 1 | 5 | 3 | 4 (liquid, ignored) |\n\nBy Avogadro's law, these are the mole ratios for the gases involved.\n\n**Step 3 — Apply to the given volume.**\n\n$$V_{\\ce{O2}} = 5 \\times V_{\\ce{C3H8}} = 5 \\times 18.2 = \\boxed{91 \\text{ L}}$$\n\n*(For reference: at STP, this corresponds to $91 / 22.4 \\approx 4.06$ mol of $\\ce{O2}$.)*",
    reveal_mode: 'tap_to_reveal',
  },

  // WEX — CO + O2 + KOH absorption
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — Vol–Vol with selective absorption',
    variant: 'solved_example',
    problem:
      '20 mL of $\\ce{CO}$ was mixed with 50 mL of $\\ce{O2}$ and the mixture was exploded. On cooling, the resulting mixture was shaken with **KOH solution**. Find the volume of gas left.',
    solution:
      "**Step 1 — Balanced equation.**\n\n$$\\ce{CO(g) + \\frac{1}{2}O2(g) -> CO2(g)}$$\n\nRequired volume ratio: **1 vol $\\ce{CO}$ : 0.5 vol $\\ce{O2}$ : 1 vol $\\ce{CO2}$.**\n\n**Step 2 — Identify the limiting reagent.**\n\n- Given: 20 mL $\\ce{CO}$, 50 mL $\\ce{O2}$.\n- 20 mL $\\ce{CO}$ requires only $20 \\times 0.5 = 10$ mL $\\ce{O2}$. We have 50 mL — much more than required.\n- $\\ce{CO}$ is the **limiting reagent**.\n\n**Step 3 — Find what's in the tube after the explosion.**\n\n- All 20 mL $\\ce{CO}$ is consumed.\n- 10 mL $\\ce{O2}$ is consumed; **40 mL $\\ce{O2}$** remains.\n- 20 mL $\\ce{CO2}$ is formed.\n\nMixture after cooling: 40 mL $\\ce{O2}$ + 20 mL $\\ce{CO2}$.\n\n**Step 4 — Apply KOH absorption.**\n\nKOH absorbs **only $\\ce{CO2}$**, leaving $\\ce{O2}$ untouched.\n\n$$\\boxed{\\text{Volume of gas left} = 40 \\text{ mL of } \\ce{O2}}$$\n\n**Why this kind of problem is interesting:** it combines stoichiometry + limiting-reagent + selective absorption all in one. The structure is JEE-classic — every step is its own mini-question.",
    reveal_mode: 'tap_to_reveal',
  },
];

const lrTwoMethodsBlocks = () => [
  { id: uuidv4(), type: 'heading', text: 'Two Ways to Find the Limiting Reagent', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "Two systematic methods work for any reaction. Both give the same answer; they suit different problem shapes.\n\n**Method 1 — Compare the *given* amount with the amount *required.*** For $\\ce{H2 + Cl2 -> 2HCl}$, the equation tells us **1 mol $\\ce{H2}$ requires 1 mol $\\ce{Cl2}$** (equivalent to 2 g : 71 g, or 1 vol : 1 vol). Whatever the input, ask: *does one reactant fall short of what the other needs?*\n\n| Given | Reasoning | LR |\n|---|---|---|\n| 3 mol $\\ce{H2}$ + 5 mol $\\ce{Cl2}$ | 3 mol $\\ce{H2}$ needs only 3 mol $\\ce{Cl2}$; we have 5. $\\ce{Cl2}$ is in excess. | $\\ce{H2}$ |\n| 2 g $\\ce{H2}$ + 80 g $\\ce{Cl2}$ | 2 g $\\ce{H2}$ needs 71 g $\\ce{Cl2}$; we have 80 g. $\\ce{Cl2}$ is in excess. | $\\ce{H2}$ |\n| 300 molecules $\\ce{H2}$ + 100 molecules $\\ce{Cl2}$ | 100 molecules $\\ce{Cl2}$ would only react with 100 molecules $\\ce{H2}$; we have 300. | $\\ce{Cl2}$ |\n| 6 g $\\ce{H2}$ + 180 g $\\ce{Cl2}$ | 6 g $\\ce{H2}$ needs $3 \\times 71 = 213$ g $\\ce{Cl2}$; we have only 180 g. | $\\ce{Cl2}$ |\n\n**Method 2 — Divide moles by stoichiometric coefficient. The smaller quotient is the LR.** For $\\ce{N2 + 3H2 -> 2NH3}$:\n\n| Given | $\\dfrac{n_{\\ce{N2}}}{1}$ | $\\dfrac{n_{\\ce{H2}}}{3}$ | Smaller | LR |\n|---|---|---|---|---|\n| 4 mol $\\ce{N2}$ + 6 mol $\\ce{H2}$ | 4 | 2 | $\\ce{H2}$ | $\\ce{H2}$ |\n| 5 mol $\\ce{N2}$ + 9 mol $\\ce{H2}$ | 5 | 3 | $\\ce{H2}$ | $\\ce{H2}$ |\n| 2 mol $\\ce{N2}$ + 7 mol $\\ce{H2}$ | 2 | 2.33 | $\\ce{N2}$ | $\\ce{N2}$ |\n\nMethod 2 is fully systematic, doesn't depend on visual inspection, and works just as well for reactions with three or more reactants. **Make Method 2 your default; use Method 1 when the required ratio is obvious by inspection.**",
  },
];

const na2co3WEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 3 — Perfect stoichiometric ratio (no excess)',
  variant: 'solved_example',
  problem:
    '3 moles of $\\ce{Na2CO3}$ are reacted with 6 moles of HCl. Find the volume of $\\ce{CO2}$ gas produced at STP.',
  solution:
    "**Step 1 — Balanced equation.**\n\n$$\\ce{Na2CO3 + 2HCl -> 2NaCl + CO2 + H2O}$$\n\nRequired mole ratio: **1 mol $\\ce{Na2CO3}$ : 2 mol HCl**.\n\n**Step 2 — Check for a limiting reagent.**\n\nGiven: 3 mol $\\ce{Na2CO3}$ + 6 mol HCl. The given ratio is **3 : 6 = 1 : 2** — exactly matching the stoichiometric requirement.\n\n**Neither reactant is in excess. Both are fully consumed. There is no LR.**\n\n**Step 3 — Apply mole–mole analysis.**\n\nFrom the equation: 1 mol $\\ce{Na2CO3}$ → 1 mol $\\ce{CO2}$. So 3 mol $\\ce{Na2CO3}$ → 3 mol $\\ce{CO2}$.\n\n**Step 4 — Convert moles of $\\ce{CO2}$ to volume at STP.**\n\n$$V = n \\times 22.4 = 3 \\times 22.4 = \\boxed{67.2 \\text{ L}}$$\n\n**Why this example matters:** *not every stoichiometry problem has a limiting reagent.* When the given amounts are in perfect stoichiometric ratio, both reactants vanish together — the calculation becomes a simple mole–mole problem.",
  reveal_mode: 'tap_to_reveal',
});

const cccl4WEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 4 — Non-integer ratio limiting reagent',
  variant: 'solved_example',
  problem:
    'Calculate the mass of $\\ce{CCl4}$ that can be produced by the reaction of **10.0 g of carbon** with **100 g of $\\ce{Cl2}$**.\n\n*Atomic masses:* C = 12, Cl = 35.5',
  solution:
    "**Step 1 — Balanced equation.**\n\n$$\\ce{C + 2Cl2 -> CCl4}$$\n\nRequired ratio: **1 mol C : 2 mol $\\ce{Cl2}$.**\n\n**Step 2 — Convert given masses to moles.**\n\n- Moles of C $= \\dfrac{10}{12} \\approx 0.833$ mol\n- Moles of $\\ce{Cl2} = \\dfrac{100}{71} \\approx 1.408$ mol\n\n**Step 3 — Find the LR using Method 2 (divide by coefficient).**\n\n- For C: $0.833 / 1 = 0.833$\n- For $\\ce{Cl2}$: $1.408 / 2 = 0.704$\n\nThe smaller quotient is for $\\ce{Cl2}$ → **$\\ce{Cl2}$ is the limiting reagent.** It runs out first and decides how much product is formed.\n\n**Step 4 — Calculate $\\ce{CCl4}$ formed from the LR.**\n\nFrom the equation: **2 mol $\\ce{Cl2}$ → 1 mol $\\ce{CCl4}$**.\n\nMolar mass of $\\ce{CCl4} = 12 + 4(35.5) = 154$ g/mol.\n\nSo: 2 × 71 = 142 g $\\ce{Cl2}$ → 154 g $\\ce{CCl4}$.\n\n$$\\text{Mass of }\\ce{CCl4} \\text{ from } 100\\text{ g }\\ce{Cl2} = \\frac{154}{142} \\times 100$$\n\n$$\\boxed{= 108.45 \\text{ g}}$$\n\n**Tip:** the moment you've identified the LR, *forget about the excess reactant*. The LR is the only number that matters for calculating the product.",
  reveal_mode: 'tap_to_reveal',
});

const yieldSection = () => [
  { id: uuidv4(), type: 'heading', text: 'Theoretical Yield and % Yield', level: 2 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "In every stoichiometric calculation so far, we've assumed the reaction **goes to completion** — that every molecule of the limiting reagent is converted into product. **Real reactions almost never behave that way.** The amount of product collected in the lab is almost always less than the calculation predicts.\n\nThe amount actually collected is the **actual yield**. The maximum possible product, calculated from stoichiometry assuming perfect conversion, is the **theoretical yield**. The ratio between them — expressed as a percentage — is the **percentage yield**:\n\n$$\\% \\text{ yield} = \\frac{\\text{Actual yield}}{\\text{Theoretical yield}} \\times 100$$\n\n**Why actual yield falls short:**\n\n- **The reaction doesn't go to completion.** Some reactant remains unreacted at equilibrium.\n- **Material sticks to the glassware.** Small amounts of product cling to the walls of flasks, condensers, and filter papers.\n- **Volatile products evaporate** before being collected.\n- **Competing side reactions.** Reactants take alternate routes, forming unintended by-products instead of the desired one.\n\nFor an industrial chemist, the entire job of **process design** is to maximise yield by minimising every one of these losses. A reaction with 40 % yield is often unprofitable; one with 95 % yield can scale to factories.",
  },
];

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    // ━━━ p6 — add Fe and Neon worked examples
    console.log('━━━ p6: add Fe (JEE 2009) + Neon worked examples ━━━');
    {
      const page = await pages.findOne({ slug: 'atomic-molecular-mass' });
      if (!page) {
        console.log('⚠  p6 not found. Skipping.');
      } else {
        const hasFe = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.label || '').includes('JEE 2009')
        );
        const hasNeon = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.label || '').toLowerCase().includes('neon')
        );
        if (hasFe && hasNeon) {
          console.log('⚠  Fe and Neon examples already present. Skipping.');
        } else {
          // Insert after existing "Example 1" worked_example (Cl example)
          const cl_idx = page.blocks.findIndex(
            (b) => b.type === 'worked_example' && (b.label === 'Example 1' || (b.problem || '').includes('chlorine'))
          );
          if (cl_idx === -1) throw new Error('Could not locate existing Cl WEX on p6');
          const before = page.blocks.slice(0, cl_idx + 1);
          const after = page.blocks.slice(cl_idx + 1);
          const inject = [];
          if (!hasFe) inject.push(feIsotopesWEX());
          if (!hasNeon) inject.push(neonIsotopesWEX());
          const merged = [...before, ...inject, ...after];
          const final = await savePage(pages, page, merged);
          console.log(`  + Inserted ${inject.length} WEX after Cl example`);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
        }
      }
    }

    // ━━━ p7 — add CaCO3 (from molecules to mass) and CH4 atom-count examples
    console.log('\n━━━ p7: add CaCO3 (molecules→mass) + CH4 atom-count examples ━━━');
    {
      const page = await pages.findOne({ slug: 'mole-concept' });
      if (!page) {
        console.log('⚠  p7 not found. Skipping.');
      } else {
        const hasCaco3 = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('CaCO3')
        );
        const hasCh4 = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.label || '').toLowerCase().includes('polyatomic')
        );
        if (hasCaco3 && hasCh4) {
          console.log('⚠  CaCO3 and CH4 examples already present. Skipping.');
        } else {
          // Insert after the last existing worked_example (Example 2: SO2)
          let lastWexIdx = -1;
          for (let i = page.blocks.length - 1; i >= 0; i--) {
            if (page.blocks[i].type === 'worked_example') { lastWexIdx = i; break; }
          }
          if (lastWexIdx === -1) throw new Error('Could not locate any existing WEX on p7');
          const before = page.blocks.slice(0, lastWexIdx + 1);
          const after = page.blocks.slice(lastWexIdx + 1);
          const inject = [];
          if (!hasCaco3) inject.push(caco3WEX());
          if (!hasCh4) inject.push(ch4AtomsWEX());
          const merged = [...before, ...inject, ...after];
          const final = await savePage(pages, page, merged);
          console.log(`  + Inserted ${inject.length} WEX after Example 2`);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
        }
      }
    }

    // ━━━ p9 — major expansion
    console.log('\n━━━ p9: major expansion (Types of Stoich + LR Two Methods + Yield) ━━━');
    {
      const page = await pages.findOne({ slug: 'stoichiometry-limiting-reagent' });
      if (!page) {
        console.log('⚠  p9 not found. Skipping.');
      } else {
        // Idempotency probes
        const hasTypesSection = page.blocks.some(
          (b) => b.type === 'heading' && b.text === 'Types of Stoichiometric Calculations'
        );
        const hasLRMethods = page.blocks.some(
          (b) => b.type === 'heading' && b.text === 'Two Ways to Find the Limiting Reagent'
        );
        const hasYield = page.blocks.some(
          (b) => b.type === 'heading' && b.text === 'Theoretical Yield and % Yield'
        );
        const hasNa2CO3 = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('Na2CO3') && (b.problem || '').includes('6 moles')
        );
        const hasCCl4 = page.blocks.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('CCl4')
        );

        if (hasTypesSection && hasLRMethods && hasYield && hasNa2CO3 && hasCCl4) {
          console.log('⚠  All p9 additions already present. Skipping.');
        } else {
          // Build the new block list by iterating through and inserting at content-matched points
          const inserts = []; // log
          const out = [];
          let injectedTypes = false;
          let injectedLRMethods = false;
          let injectedNa2CO3CCl4 = false;
          let injectedYield = false;

          for (let i = 0; i < page.blocks.length; i++) {
            const b = page.blocks[i];
            out.push(b);

            // Insertion point A — after the "Reading a Balanced Chemical Equation" text block
            // (the text block whose markdown mentions "quantitative information")
            if (!injectedTypes && !hasTypesSection &&
                b.type === 'text' && (b.markdown || '').includes('quantitative information')) {
              out.push(...typesOfStoichSection());
              inserts.push('after "Reading a Balanced Equation" text: + Types-of-Stoich section (12 blocks)');
              injectedTypes = true;
            }

            // Insertion point B — after the existing "Limiting Reagent" text block
            // (whose markdown defines "Limiting reagent")
            if (!injectedLRMethods && !hasLRMethods &&
                b.type === 'text' && (b.markdown || '').includes('limits* the amount of product')) {
              out.push(...lrTwoMethodsBlocks());
              inserts.push('after LR text: + "Two Ways to Find the LR" h3 + text');
              injectedLRMethods = true;
            }

            // Insertion point C — after existing "Example 2" WEX (the 367.5g KClO3 one)
            if (!injectedNa2CO3CCl4 && !(hasNa2CO3 && hasCCl4) &&
                b.type === 'worked_example' && (b.problem || '').includes('367.5')) {
              if (!hasNa2CO3) out.push(na2co3WEX());
              if (!hasCCl4) out.push(cccl4WEX());
              inserts.push('after KClO3 WEX: + Na2CO3 and/or CCl4 WEX');
              injectedNa2CO3CCl4 = true;
            }
          }

          // Insertion point D — before the exam_tip callout (insert Yield section right before)
          if (!injectedYield && !hasYield) {
            const examTipIdx = out.findIndex(
              (b) => b.type === 'callout' && b.variant === 'exam_tip'
            );
            if (examTipIdx !== -1) {
              out.splice(examTipIdx, 0, ...yieldSection());
              inserts.push('before exam_tip: + Theoretical-Yield section (h2 + text)');
              injectedYield = true;
            }
          }

          for (const msg of inserts) console.log(`  + ${msg}`);

          const final = await savePage(pages, page, out);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
        }
      }
    }

    // ━━━ Final summary
    console.log('\n━━━ Final block counts ━━━');
    for (const slug of [
      'atomic-molecular-mass',
      'mole-concept',
      'stoichiometry-limiting-reagent',
    ]) {
      const p = await pages.findOne({ slug });
      if (!p) continue;
      console.log(`  ${slug}  →  ${p.blocks?.length} blocks  ·  ${p.reading_time_min}min read`);
    }

    console.log('\n✓ Done.');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
