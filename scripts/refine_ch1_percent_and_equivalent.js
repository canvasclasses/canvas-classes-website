'use strict';
/**
 * Round-5 refinements to Chapter 4:
 *
 *   p8 (Percentage Composition & Empirical/Molecular Formulas):
 *     - Expand the existing % Composition text to include MOLE %
 *       (currently only mass % is covered).
 *     - Add 2 worked examples:
 *         BH3 → B2H6 (empirical → molecular)
 *         AIIMS 1998 percent-comp → CHClO
 *
 *   p9 (Stoichiometry & Limiting Reagent):
 *     - Insert "Equivalent Concept" section between Vol–Vol Analysis and
 *       Limiting Reagent (parallels mole–mole analysis):
 *         h2 + intro
 *         h3 Equivalent Weight (def + Mg/Zn derivations + general formula)
 *         h3 n-factor (acids/bases/salts/redox table + H2SO4 trap + 8-compound table)
 *         h3 Special Case — Phosphorus Acids (H3PO4/H3PO3/H3PO2/oxalic)
 *         text — Number of Equivalents formula
 *         WEX — 12 g element + 32 g O → Eq.wt
 *
 * Writes directly to MongoDB. Idempotency-guarded — re-runs are safe.
 * Run: node scripts/refine_ch1_percent_and_equivalent.js
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

// ─── p8 content ─────────────────────────────────────────────────────────────

const expandedPercentCompositionMarkdown =
  "The **percentage composition** of a compound tells you how much of each element is in it. We can express this in two parallel ways:\n\n**Mass percent** — the fraction of total mass contributed by each element:\n\n$$\\% \\text{ by mass of element} = \\frac{\\text{Mass of element in 1 mole of compound}}{\\text{Molar mass of compound}} \\times 100$$\n\n**Mole percent** — the fraction of total atoms (counted in moles) contributed by each element:\n\n$$\\% \\text{ by mole of element} = \\frac{\\text{Moles of that element in the formula}}{\\text{Total moles of all atoms in the formula}} \\times 100$$\n\nFor a generic compound $\\ce{A2B3C}$, 1 mole contains **2 mol A + 3 mol B + 1 mol C = 6 mol atoms total.** So mole % of A = (2/6) × 100 = 33.3 %.\n\n**Example — Water ($\\ce{H2O}$, molar mass = 18 g/mol):**\n\n$$\\% \\text{ H by mass} = \\frac{2}{18} \\times 100 = 11.11\\%$$\n\n$$\\% \\text{ O by mass} = \\frac{16}{18} \\times 100 = 88.89\\%$$\n\n**Example — Carbon dioxide ($\\ce{CO2}$, molar mass = 44 g/mol):**\n\n$$\\% \\text{ C by mass} = \\frac{12}{44} \\times 100 = 27.27\\%$$\n\n$$\\% \\text{ O by mass} = \\frac{32}{44} \\times 100 = 72.73\\%$$\n\nNotice that **% O = 100 − % C** for CO₂ — the percentages of all elements in a compound always add up to 100. If a problem gives you only C, H, and Cl, the rest is oxygen.";

const bh3WEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 2 — Empirical formula → molecular formula',
  variant: 'solved_example',
  problem:
    'The empirical formula of boron hydride is $\\ce{BH3}$. Calculate the molecular formula when the measured molecular mass of the compound is **27.66 g/mol**.\n\n*(Atomic masses: B = 10.81, H = 1)*',
  solution:
    "**Step 1 — Find the empirical formula mass.**\n\n$$M_{\\text{EF}} = M_B + 3 M_H = 10.81 + 3(1) = 13.81 \\text{ g/mol}$$\n\n**Step 2 — Apply** $M_{\\text{molecular}} = n \\times M_{\\text{EF}}$:\n\n$$27.66 = n \\times 13.81$$\n\n$$n = \\frac{27.66}{13.81} = 2$$\n\n**Step 3 — Multiply the empirical formula by $n$.**\n\n$$\\text{Molecular formula} = n \\times \\ce{BH3} = 2 \\times \\ce{BH3} = \\boxed{\\ce{B2H6}}$$\n\n$\\ce{B2H6}$ is **diborane** — a real, well-studied compound with this exact molecular formula.",
  reveal_mode: 'tap_to_reveal',
});

const aiimsCHClOWEX = () => ({
  id: uuidv4(),
  type: 'worked_example',
  label: 'Example 3 — Empirical formula from elemental analysis (AIIMS 1998)',
  variant: 'solved_example',
  problem:
    'A compound, on analysis, was found to contain **C = 18.5 %, H = 1.55 %, Cl = 55.04 %, O = 24.81 %**. What is its empirical formula?\n\n*(Atomic masses: C = 12, H = 1, Cl = 35.5, O = 16)*\n\n(a) $\\ce{C2H2OCl}$  (b) $\\ce{CH2ClO}$  (c) $\\ce{CHClO}$  (d) $\\ce{ClCH2O}$',
  solution:
    "**The standard 3-step approach for % → empirical formula:**\n\n**Step 1 — Divide each % by the atomic mass of that element** (gives relative moles in 100 g of compound):\n\n| Element | % | $\\dfrac{\\%}{\\text{Atomic mass}}$ |\n|---|---|---|\n| C | 18.5 | $18.5 / 12 = 1.54$ |\n| H | 1.55 | $1.55 / 1 = 1.55$ |\n| Cl | 55.04 | $55.04 / 35.5 = 1.55$ |\n| O | 24.81 | $24.81 / 16 = 1.55$ |\n\n**Step 2 — Divide every value by the smallest one (1.54)** to get a clean ratio:\n\n- C: $1.54 / 1.54 = 1$\n- H: $1.55 / 1.54 \\approx 1$\n- Cl: $1.55 / 1.54 \\approx 1$\n- O: $1.55 / 1.54 \\approx 1$\n\n**Step 3 — Whole-number ratio is 1 : 1 : 1 : 1.**\n\n$$\\boxed{\\text{Empirical formula} = \\ce{CHClO} \\quad \\text{(answer c)}}$$\n\n**The general rule:** for any percent-composition problem — *(percent ÷ atomic mass) → divide by smallest*. If the result is clean whole numbers, you're done. If you get a 0.5 or a 0.33, multiply everything by 2 or 3 to clear the fraction.",
  reveal_mode: 'tap_to_reveal',
});

// ─── p9 — Equivalent Concept section ────────────────────────────────────────

const equivalentConceptSection = () => [
  // h2 + intro
  {
    id: uuidv4(),
    type: 'heading',
    text: 'Equivalent Concept — An Alternative to Mole–Mole',
    level: 2,
  },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "Mole–mole analysis is powerful, but it requires you to **balance the chemical equation first**. There's a parallel framework — the **equivalent concept** — that lets you skip balancing entirely. It is especially useful for acid–base neutralisations and redox reactions.\n\nThe core idea: **in any chemical reaction, equal equivalents of reactants combine to give equal equivalents of products.**\n\nFor a reaction (balanced or not):\n\n$$aA + bB \\longrightarrow cC + dD$$\n\nthe relation is simply:\n\n$$\\frac{w_A}{E_A} = \\frac{w_B}{E_B} = \\frac{w_C}{E_C} = \\frac{w_D}{E_D}$$\n\nwhere $w$ is the given (or formed) mass and $E$ is the equivalent weight of each substance.\n\nUnlike mole–mole, this doesn't depend on stoichiometric coefficients at all. The trade-off: you must know each substance's **equivalent weight** — which is itself a function of how the substance behaves in the reaction.",
  },

  // h3 — Equivalent Weight
  { id: uuidv4(), type: 'heading', text: 'What is Equivalent Weight?', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "**Equivalent weight** is the mass of an element or compound that *reacts with, displaces, or supplies* a fixed reference quantity:\n\n- **1.008 g of $\\ce{H2}$**, or\n- **8 g of $\\ce{O2}$**, or\n- **35.5 g of $\\ce{Cl2}$**\n\n**Unlike molecular weight** (which is fixed for a molecule), **equivalent weight changes depending on the reaction the substance is in.**\n\n**Example 1.** $\\ce{2Mg + O2 -> 2MgO}$. From the equation, 48 g of Mg reacts with 32 g of O₂. Scaling down: 12 g of Mg reacts with 8 g of O₂. By the definition above:\n\n$$\\boxed{\\text{Eq. wt of Mg} = 12 \\text{ g}}$$\n\n**Example 2.** $\\ce{Zn + H2SO4 -> ZnSO4 + H2}$. 65.5 g of Zn displaces 2 g of H₂. Per the definition, the mass of Zn that displaces 1.008 g of H₂ is:\n\n$$\\text{Eq. wt of Zn} = \\frac{65.5}{2} \\approx 32.75 \\text{ g}$$\n\n**The general formula** that ties everything together:\n\n$$\\text{Equivalent weight} = \\frac{\\text{Atomic / Molecular weight}}{n\\text{-factor}}$$\n\nSo the problem reduces to: *what's the $n$-factor for this substance, in this reaction?*",
  },

  // h3 — n-factor
  { id: uuidv4(), type: 'heading', text: 'How to Find the n-Factor', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "The $n$-factor depends on **what category of compound** you're dealing with and **how it reacts**:\n\n| Category | $n$-factor |\n|---|---|\n| **Acids** | Basicity — number of $\\ce{H+}$ ions replaced per molecule in *this* reaction |\n| **Bases** | Acidity — number of $\\ce{OH-}$ replaced (or $\\ce{H+}$ gained) per molecule |\n| **Salts** | Total cationic (or anionic) charge per formula unit |\n| **Redox species** | Number of electrons gained or lost per molecule |\n\n**A classic trap — the $n$-factor of an acid depends on *how it actually reacts*, not just its formula.** Consider $\\ce{H2SO4}$:\n\n- $\\ce{2NaOH + H2SO4 -> Na2SO4 + 2H2O}$ → both $\\ce{H+}$ replaced → $n = 2$\n- $\\ce{NaOH + H2SO4 -> NaHSO4 + H2O}$ → only one $\\ce{H+}$ replaced → $n = 1$\n\n*Same acid, two different $n$-factors.* Always check the equation, not just the formula.\n\n**Common substances — memorise the pattern:**\n\n| Substance | $n$-factor | Eq. wt | Why |\n|---|---|---|---|\n| $\\ce{CaCl2}$ | 2 | $M/2$ | Cationic charge = 2 |\n| $\\ce{H2SO4}$ | 2 (usually) | $M/2$ | 2 acidic $\\ce{H+}$ donatable |\n| $\\ce{HCl}$ | 1 | $M$ | 1 acidic $\\ce{H+}$ |\n| $\\ce{HNO3}$ | 1 | $M$ | 1 acidic $\\ce{H+}$ |\n| $\\ce{Mg(OH)2}$ | 2 | $M/2$ | 2 $\\ce{OH-}$ per molecule |\n| $\\ce{AlCl3}$ | 3 | $M/3$ | Cationic charge = 3 |\n| Zn (in redox) | 2 | $M/2$ | Valency = 2 ($\\ce{Zn -> Zn^{2+}}$) |\n| Al (in redox) | 3 | $M/3$ | Valency = 3 ($\\ce{Al -> Al^{3+}}$) |",
  },

  // h3 — phosphorus acids special case
  { id: uuidv4(), type: 'heading', text: 'Special Case — The Phosphorus Acids', level: 3 },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "The phosphorus acids are a classic JEE trap because **not every hydrogen in their formula is acidic**. Only hydrogens bonded to **oxygen** are acidic. Hydrogens bonded directly to **phosphorus** are *not* acidic and don't dissociate.\n\n| Acid | Where the H atoms sit | Basicity | Eq. wt |\n|---|---|---|---|\n| $\\ce{H3PO4}$ (phosphoric acid) | All 3 H bonded to O | **3** | $M / 3$ |\n| $\\ce{H3PO3}$ (phosphorous acid) | 2 H on O, **1 H on P** | **2** | $M / 2$ |\n| $\\ce{H3PO2}$ (hypophosphorous acid) | 1 H on O, **2 H on P** | **1** | $M / 1$ |\n| $\\ce{(COOH)2}$ (oxalic acid) | Both H on O (in $\\ce{-COOH}$) | **2** | $M / 2$ |\n\n**The rule of thumb:** count only the **O–H** groups, never the **P–H** or **C–H** bonds. The formula $\\ce{H3PO3}$ *looks* like it should have basicity 3, but the actual structure has one H bonded directly to the phosphorus — so only the other two can dissociate.",
  },

  // Number of Equivalents formula text
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "**Number of equivalents** = how many \"reaction units\" you have in a sample. The formula has three equivalent forms — pick whichever matches what you're given:\n\n$$\\text{No. of equivalents} = \\frac{w}{E} = \\frac{w \\times n}{M} = (\\text{moles}) \\times (n\\text{-factor})$$\n\nwhere $w$ is the given mass, $E$ is the equivalent weight, $M$ is the molecular weight, and $n$ is the $n$-factor.\n\n**Quick example** — for 18 g of Al ($M = 27$, $n$-factor = 3):\n\n$$\\text{No. of equivalents} = \\frac{18}{27} \\times 3 = \\frac{2}{3} \\times 3 = 2 \\text{ equivalents}$$",
  },

  // WEX — 12g element + 32g O
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — Finding equivalent weight from a mass ratio',
    variant: 'solved_example',
    problem:
      '12 g of an element combines with 32 g of oxygen. What is the **equivalent weight of the element**, given that the equivalent weight of oxygen is 8?',
    solution:
      "**Method 1 — Direct from the definition.**\n\nEquivalent weight of an element = mass that combines with **8 g of oxygen**.\n\n- 32 g of O combines with 12 g of element\n- 8 g of O combines with $\\dfrac{12 \\times 8}{32} = 3$ g of element\n\n$$\\boxed{\\text{Eq. wt of element} = 3 \\text{ g}}$$\n\n**Method 2 — Equivalent ratio formula.**\n\nIn any reaction, the number of equivalents of one reactant equals the number of equivalents of the other:\n\n$$\\frac{w_{\\text{element}}}{E_{\\text{element}}} = \\frac{w_O}{E_O}$$\n\n$$\\frac{12}{E} = \\frac{32}{8}$$\n\n$$E = \\frac{12 \\times 8}{32} = \\boxed{3 \\text{ g}}$$\n\nBoth methods give the same answer. The second method generalises to *any* reaction — you don't need to know the equation itself, only the masses and equivalent weights involved. **This is why the equivalent concept is so powerful: it bypasses balancing entirely.**",
    reveal_mode: 'tap_to_reveal',
  },
];

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    // ━━━ p8 — expand percent composition + add 2 WEX
    console.log('━━━ p8: expand % comp (add mole %) + add BH3 and AIIMS WEX ━━━');
    {
      const page = await pages.findOne({ slug: 'percentage-composition-empirical-formula' });
      if (!page) {
        console.log('⚠  p8 not found. Skipping.');
      } else {
        let updated = page.blocks.slice();
        let didSomething = false;

        // (a) Update % composition text to include mole %
        const pcTextIdx = updated.findIndex(
          (b) => b.type === 'text' && (b.markdown || '').includes('percentage composition') &&
                 (b.markdown || '').includes('% by mass of element')
        );
        if (pcTextIdx === -1) {
          console.log('⚠  Couldn’t locate existing % composition text. Skipping that part.');
        } else {
          const existing = updated[pcTextIdx];
          if ((existing.markdown || '').includes('Mole percent')) {
            console.log('  • Mole percent already in % composition text — skipping that edit');
          } else {
            updated[pcTextIdx] = { ...existing, markdown: expandedPercentCompositionMarkdown };
            didSomething = true;
            console.log('  + Updated % composition text to include MOLE %');
          }
        }

        // (b) Add BH3 + AIIMS WEX after the existing WEX 1
        const hasBh3 = updated.some(
          (b) => b.type === 'worked_example' && (b.problem || '').includes('boron hydride')
        );
        const hasAiims = updated.some(
          (b) => b.type === 'worked_example' && (b.label || '').includes('AIIMS')
        );
        if (hasBh3 && hasAiims) {
          console.log('  • BH3 and AIIMS WEX already present — skipping those inserts');
        } else {
          // Find the last existing WEX to append after
          let lastWexIdx = -1;
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].type === 'worked_example') { lastWexIdx = i; break; }
          }
          if (lastWexIdx === -1) {
            console.log('  ⚠  No existing WEX on p8 to anchor after. Skipping WEX inserts.');
          } else {
            const before = updated.slice(0, lastWexIdx + 1);
            const after = updated.slice(lastWexIdx + 1);
            const inject = [];
            if (!hasBh3) inject.push(bh3WEX());
            if (!hasAiims) inject.push(aiimsCHClOWEX());
            updated = [...before, ...inject, ...after];
            didSomething = true;
            console.log(`  + Inserted ${inject.length} WEX after existing WEX`);
          }
        }

        if (didSomething) {
          const final = await savePage(pages, page, updated);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
        }
      }
    }

    // ━━━ p9 — insert Equivalent Concept section
    console.log('\n━━━ p9: insert Equivalent Concept section ━━━');
    {
      const page = await pages.findOne({ slug: 'stoichiometry-limiting-reagent' });
      if (!page) {
        console.log('⚠  p9 not found. Skipping.');
      } else {
        const alreadyHasEquivalent = page.blocks.some(
          (b) => b.type === 'heading' && (b.text || '').startsWith('Equivalent Concept')
        );
        if (alreadyHasEquivalent) {
          console.log('⚠  Equivalent Concept section already present. Skipping.');
        } else {
          // Find the CO+KOH Vol-Vol WEX (last WEX in the Vol-Vol section)
          // Then insert AFTER it, BEFORE the "Limiting Reagent" h2.
          const lrHeadingIdx = page.blocks.findIndex(
            (b) => b.type === 'heading' && b.text === 'Limiting Reagent' && b.level === 2
          );
          if (lrHeadingIdx === -1) {
            throw new Error('Could not locate "Limiting Reagent" h2 on p9');
          }

          const before = page.blocks.slice(0, lrHeadingIdx);
          const after = page.blocks.slice(lrHeadingIdx);
          const merged = [...before, ...equivalentConceptSection(), ...after];
          const final = await savePage(pages, page, merged);
          console.log(`  + Inserted Equivalent Concept section (${equivalentConceptSection().length} blocks) before "Limiting Reagent" h2`);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
        }
      }
    }

    // ━━━ Final summary
    console.log('\n━━━ Final block counts ━━━');
    for (const slug of [
      'percentage-composition-empirical-formula',
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
