'use strict';
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const POAC_EXAMPLE = {
  id: uuidv4(),
  order: 12,
  type: 'worked_example',
  label: 'Example — Molecular Weight from Atoms Combining by Mass',
  variant: 'solved_example',
  problem:
    "$x$ g of A atoms combine with $y$ atoms of element B (atomic weight $M$) to form 5 molecules of a compound containing A and B. What is the molecular weight of the compound formed?\n\n" +
    '(a) $\\dfrac{xN_A + My}{5}$\n\n(b) $\\dfrac{x+M}{5}$\n\n(c) $\\dfrac{x+My}{5}$\n\n(d) $\\dfrac{x+MyN_A}{5}$',
  solution:
    '**Use mass conservation** — the mass of the compound formed must equal the mass of everything that went into it.\n\n' +
    '**Mass of A used** = $x$ g (given directly).\n\n' +
    '**Mass of B used** = $y$ atoms $\\times$ mass per atom of B = $y \\times \\dfrac{M}{N_A} = \\dfrac{My}{N_A}$ g.\n\n' +
    '**Mass of the 5 molecules formed** = (moles) $\\times$ (molar mass) = $\\dfrac{5}{N_A}\\times\\text{Mol. Wt.}$\n\n' +
    '**Conservation of mass:**\n$$x + \\frac{My}{N_A} = \\frac{5}{N_A}\\times \\text{Mol. Wt.}$$\n\n' +
    'Multiply through by $N_A$:\n$$xN_A + My = 5 \\times \\text{Mol. Wt.}$$\n\n' +
    '$$\\therefore \\text{Mol. Wt. of compound} = \\frac{xN_A + My}{5}$$\n\n**Answer: (a).**',
  reveal_mode: 'tap_to_reveal',
};

const EQUIV_EXAMPLE = {
  id: uuidv4(),
  order: 22,
  type: 'worked_example',
  label: 'Example — Identifying Metal M from a BaO–Carbonate Mixture',
  variant: 'solved_example',
  problem:
    '$4.08$ g of a mixture of $\\ce{BaO}$ and an unknown carbonate $\\ce{MCO3}$ was heated strongly. The residue weighed $3.64$ g. ' +
    'This was dissolved in $100$ mL of $1\\text{ N}$ HCl. The excess acid required $16$ mL of $2.5\\text{ N}$ NaOH for complete neutralisation. Identify the metal M.',
  solution:
    "**Why $\\ce{BaO}$ survives the heating.** $\\ce{BaO}$ is already a basic oxide — it doesn't decompose further on strong heating. Only the carbonate breaks down:\n" +
    '$$\\ce{MCO3 ->[\\Delta] MO + CO2 ^}$$\nSo the residue after heating is $\\ce{BaO + MO}$.\n\n' +
    '**Step 1 — Moles of $\\ce{CO2}$ lost.**\n' +
    '$$\\text{mass of }\\ce{CO2} = 4.08 - 3.64 = 0.44\\text{ g} \\;\\Rightarrow\\; n(\\ce{CO2}) = \\frac{0.44}{44} = 0.01\\text{ mol}$$\n' +
    'Since $\\ce{MCO3 -> MO + CO2}$ is $1:1:1$, this also gives $n(\\ce{MCO3}) = n(\\ce{MO}) = 0.01$ mol.\n\n' +
    '**Step 2 — Total acid vs. excess acid (equivalents, not moles).**\n' +
    '$$\\text{eq. of HCl taken} = 100 \\times 1 = 100\\text{ meq}$$\n' +
    '$$\\text{eq. of NaOH used on the excess} = 16 \\times 2.5 = 40\\text{ meq} = \\text{eq. of excess HCl}$$\n' +
    '$$\\text{eq. of HCl that reacted with the residue} = 100 - 40 = 60\\text{ meq} = 0.06\\text{ eq}$$\n\n' +
    '**Step 3 — Split those equivalents between $\\ce{BaO}$ and $\\ce{MO}$.**\n' +
    'Both are divalent basic oxides, so each reacts as $\\ce{XO + 2HCl -> XCl2 + H2O}$ (n-factor $=2$):\n' +
    '$$\\text{eq}(\\ce{MO}) = n(\\ce{MO}) \\times 2 = 0.01\\times 2 = 0.02\\text{ eq}$$\n' +
    '$$\\text{eq}(\\ce{BaO}) = 0.06 - 0.02 = 0.04\\text{ eq}$$\n\n' +
    '**Step 4 — Mass of $\\ce{BaO}$, then mass of $\\ce{MO}$ by difference.**\n' +
    'Equivalent weight of $\\ce{BaO} = \\dfrac{137.3+16}{2}\\approx 76.7$\n' +
    '$$\\text{mass}(\\ce{BaO}) = 0.04 \\times 76.7 \\approx 3.07\\text{ g}$$\n' +
    '$$\\text{mass}(\\ce{MO}) = 3.64 - 3.07 = 0.57\\text{ g}$$\n\n' +
    '**Step 5 — Molar mass of $\\ce{MO}$, then atomic mass of M.**\n' +
    '$$M(\\ce{MO}) = \\frac{0.57}{0.01} \\approx 57\\text{ g/mol} \\;\\Rightarrow\\; \\text{atomic mass of M} \\approx 57-16 = 41\\text{ g/mol}$$\n\n' +
    '**Answer.** M has an atomic mass of $\\approx 41$ g/mol — closest to **calcium ($\\ce{Ca}$, 40)**, the small gap coming from rounding across several equivalent-weight steps.',
  reveal_mode: 'tap_to_reveal',
};

const POAC_PAGE_ID = '92e3b172-3765-4b60-935c-ef89bcb393d2';
const EQUIV_PAGE_ID = 'cef88eae-354e-487d-a19a-94969f6be73a';

(async () => {
  await bw.withDb(async (db) => {
    // POAC page: insert new example at order 12, shifting the trailing callout+quiz down by 1.
    {
      const page = await db.collection('book_pages').findOne({ _id: POAC_PAGE_ID });
      const existing = page.blocks || [];
      const before = existing.filter((b) => b.order < 12);
      const after = existing.filter((b) => b.order >= 12).map((b) => ({ ...b, order: b.order + 1 }));
      const newBlocks = [...before, POAC_EXAMPLE, ...after];
      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent',
        summary: 'Add worked example: molecular weight from mass conservation (x g A + y atoms B -> 5 molecules)',
      });
      console.log(`POAC page -> version ${res.version}, blocks ${existing.length} -> ${newBlocks.length}`);
    }

    // Equivalent Concept page: append as the new final block (no quiz block currently present).
    {
      const page = await db.collection('book_pages').findOne({ _id: EQUIV_PAGE_ID });
      const existing = page.blocks || [];
      const newBlocks = [...existing, EQUIV_EXAMPLE];
      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent',
        summary: 'Add worked example: identifying metal M from a BaO-carbonate mixture (equivalent-concept method)',
      });
      console.log(`Equivalent Concept page -> version ${res.version}, blocks ${existing.length} -> ${newBlocks.length}`);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
