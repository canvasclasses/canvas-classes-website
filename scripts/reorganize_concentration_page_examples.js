'use strict';
/**
 * Reorganizes worked examples on 'concentration-of-solutions' (Ch.1
 * Chemistry) — founder-flagged 2026-07-25: 4 Normality worked_example blocks
 * were sitting AFTER the inline_quiz block, which must always be the
 * bottommost content on a page. While investigating, also found a second,
 * related bug: the block hand-labeled literally "Example 1" (violates
 * BOOK_PAGE_WORKFLOW.md §3.5's auto-numbering rule — labels should carry
 * only a descriptive suffix) is a MOLARITY problem (NaOH mass -> molarity)
 * sitting under the NORMALITY heading — topically misplaced. Fixed both
 * while adding 11 founder-supplied worked examples (from two different
 * reference sources — problems reused as explicitly requested; every
 * solution independently re-derived/re-verified from scratch and written in
 * THIS page's own established voice: direct "Step 1 —" progression, no
 * "Reading the question" preamble (unlike additional-practice-beyond-ncert —
 * this page's existing examples never use that structure), occasional
 * "**Key idea:**"/"**Answer:**" closers, no ALL-CAPS emphasis).
 *
 * Placement: each new example inserted into its topically-relevant section
 * (Percentage / Molarity / Molality & Mole Fraction / Normality & PPM — no
 * new Dilution-only problems were supplied), ordered simplest -> hardest
 * within each section. The single most comprehensive problem (all four
 * units — molality, molarity, normality, mole fraction — for one NaCl
 * solution) is placed last in the Normality section, immediately before the
 * quiz, as the page's natural capstone.
 *
 * All chemistry independently verified before writing (see chat for full
 * derivations); notably Ex.5 (mixing two different-% H2SO4 solutions) had NO
 * solution shown in the source image — solved from scratch, with the
 * "equal volumes -> additive total volume" assumption stated explicitly
 * since the mixture's own density wasn't given.
 *
 * Structural approach: rebuilds the FULL blocks array in the target order.
 * Every non-worked_example block (headings/text/images/simulation/
 * comparison_card/callout/quiz) is carried over UNCHANGED and in its
 * original relative sequence — only worked_example blocks are moved/added.
 * Purely additive/reorganizing via book-writer.savePage (no block dropped).
 * Run: node scripts/reorganize_concentration_page_examples.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'concentration-of-solutions';

const worked = (label, problem, solution, variant = 'solved_example') => ({
  id: uuidv4(), type: 'worked_example', label, variant, problem, solution, reveal_mode: 'tap_to_reveal',
});

// ─── New worked examples, grouped by target section ────────────────────────

const NEW = {
  percentage: [
    worked(
      'Example — Mass of Muriatic Acid Solution Containing 7.5 g of HCl',
      'Muriatic acid is the commercial name for hydrochloric acid sold in hardware stores as a solution that is ' +
        '$37\\%$ (w/w) $\\ce{HCl}$. What mass of this solution contains $7.5$ g of $\\ce{HCl}$?',
      '**Step 1 — Set up the percentage relationship.**\n\n' +
        '$37\\%$ (w/w) means every $100$ g of solution contains $37$ g of $\\ce{HCl}$:\n\n' +
        '$0.37 \\times (\\text{mass of solution}) = \\text{mass of } \\ce{HCl}$\n\n' +
        '**Step 2 — Solve for the mass of solution.**\n\n' +
        '$\\text{mass of solution} = \\frac{7.5}{0.37} = \\boxed{20.3\\ \\text{g}}$\n\n' +
        '**Answer:** $20.3$ g of the muriatic acid solution.',
    ),
    worked(
      'Example — Mass of Sea Salt Needed to Fill an Aquarium',
      'Seawater is typically $3.5\\%$ sea salt and has a density of $1.03$ g mL$^{-1}$. How many grams of sea salt ' +
        'would be needed to prepare enough seawater solution to completely fill a $62.5$ L aquarium?',
      '**Step 1 — Convert the aquarium volume to a mass of solution, using density.**\n\n' +
        '$62.5$ L $= 62{,}500$ mL\n\n' +
        '$\\text{mass of solution} = 62{,}500 \\times 1.03 = 64{,}375\\ \\text{g}$\n\n' +
        '**Step 2 — Apply the percentage to find the mass of sea salt.**\n\n' +
        '$\\text{mass of sea salt} = 0.035 \\times 64{,}375 = \\boxed{2253\\ \\text{g} \\approx 2.25\\ \\text{kg}}$\n\n' +
        '**Answer:** about $2253$ g ($\\approx 2.25$ kg) of sea salt.',
    ),
    worked(
      'Example — Converting % by Volume to % by Weight (Ethanol)',
      'A solution of ethanol in water is $10\\%$ by volume. If the solution and pure ethanol have densities of ' +
        '$0.9866$ g/cc and $0.785$ g/cc respectively, find the percent by weight.',
      '**Step 1 — Pick a convenient basis.** In $100$ mL of solution, $10\\%$ (v/v) means $10$ mL is ethanol.\n\n' +
        "**Step 2 — Convert each volume to a mass, using its OWN density.** This is the step most students skip — " +
        'the ethanol and the solution do not share a density.\n\n' +
        '$\\text{mass of ethanol} = 10 \\times 0.785 = 7.85\\ \\text{g}$\n\n' +
        '$\\text{mass of solution} = 100 \\times 0.9866 = 98.66\\ \\text{g}$\n\n' +
        '**Step 3 — Compute % by weight.**\n\n' +
        '$\\% \\text{(w/w)} = \\frac{7.85}{98.66} \\times 100 = \\boxed{7.95\\%}$\n\n' +
        '**Answer:** $7.95\\%$ by weight.\n\n' +
        '**Why this matters:** you cannot convert $10\\%$ (v/v) directly into a weight percentage without ' +
        'densities — volume and mass percentages only agree when the solute and solution happen to share the same ' +
        'density, which is almost never true.',
    ),
  ],
  molarity: [
    worked(
      'Example — The Molarity of Pure Water Itself',
      'Calculate the molarity of pure water.',
      '**Step 1 — Take exactly 1 litre of water.** Since the density of water is $1$ g/mL, $1$ litre weighs ' +
        '$1000$ g.\n\n' +
        '**Step 2 — Convert to moles.**\n\n' +
        '$n(\\ce{H2O}) = \\frac{1000}{18} = 55.5\\ \\text{mol}$\n\n' +
        '**Answer:** $\\boxed{55.5\\ \\text{M}}$ — a number worth memorising, since it shows up constantly ' +
        'whenever water is the solvent in dilute solutions.',
    ),
    worked(
      'Example — Molar Concentration of Concentrated Hydrochloric Acid',
      'A certain supply of concentrated hydrochloric acid has a concentration of $36.0\\%$ $\\ce{HCl}$. The ' +
        'density of the solution is $1.19$ g mL$^{-1}$. Calculate the molar concentration of $\\ce{HCl}$.',
      '**Step 1 — Work with exactly 1 litre of solution.**\n\n' +
        '$\\text{mass of solution} = 1000 \\times 1.19 = 1190\\ \\text{g}$\n\n' +
        '**Step 2 — Use the percentage to find the mass of HCl.**\n\n' +
        '$\\text{mass of } \\ce{HCl} = 0.360 \\times 1190 = 428.4\\ \\text{g}$\n\n' +
        '**Step 3 — Convert to moles, then to molarity.**\n\n' +
        '$n(\\ce{HCl}) = \\frac{428.4}{36.5} = 11.7\\ \\text{mol}$\n\n' +
        '$M = \\frac{11.7}{1} = \\boxed{11.7\\ \\text{M}}$\n\n' +
        "**Answer:** $11.7$ M — concentrated $\\ce{HCl}$ is genuinely this concentrated, which is why it's always " +
        'diluted before use.',
    ),
  ],
  molality: [
    worked(
      'Example — Mass of NaCl Needed for a 0.150 m Solution',
      'An experiment calls for a $0.150$ m solution of sodium chloride in water. How many grams of $\\ce{NaCl}$ ' +
        'would have to be dissolved in $500.0$ g of water to prepare a solution of this molality?',
      '**Step 1 — Rearrange the molality formula for moles of solute.**\n\n' +
        '$m = \\frac{n_{\\text{solute}}}{w_{\\text{solvent}}\\,(\\text{kg})} \\implies n(\\ce{NaCl}) = m \\times ' +
        'w_{\\text{solvent}}\\,(\\text{kg}) = 0.150 \\times 0.500 = 0.0750\\ \\text{mol}$\n\n' +
        '**Step 2 — Convert to mass.**\n\n' +
        '$w(\\ce{NaCl}) = 0.0750 \\times 58.5 = \\boxed{4.39\\ \\text{g}}$\n\n' +
        '**Answer:** $4.39$ g of $\\ce{NaCl}$.',
    ),
    worked(
      'Example — Checking Whether a 1.90 m Brine Matches a 10.0% (w/w) Requirement',
      'Brine is a fairly concentrated solution of sodium chloride in water, used in curing certain cheeses, where ' +
        'the concentration of brine affects the quality of the cheese. A supplier offers a cheesemaker a good price ' +
        'on $1.90$ m brine. The cheesemaker needs a $10.0\\%$ (w/w) aqueous $\\ce{NaCl}$ solution. Show whether or ' +
        'not the $1.90$ m brine solution will work.',
      '**Step 1 — Convert the 1.90 m brine to a percentage by weight.** Molality is defined per kilogram of ' +
        'solvent, so take exactly $1000$ g of water as the basis.\n\n' +
        '$n(\\ce{NaCl}) = 1.90\\ \\text{mol} \\implies w(\\ce{NaCl}) = 1.90 \\times 58.5 = 111.15\\ \\text{g}$\n\n' +
        '**Step 2 — Find the mass of the full solution and the percentage.**\n\n' +
        '$w_{\\text{solution}} = 1000 + 111.15 = 1111.15\\ \\text{g}$\n\n' +
        '$\\% \\text{(w/w)} = \\frac{111.15}{1111.15} \\times 100 = \\boxed{10.0\\%}$\n\n' +
        '**Answer:** Yes — the $1.90$ m brine works out to almost exactly $10.0\\%$ (w/w), matching what the ' +
        'cheesemaker needs.\n\n' +
        '**Why this matters:** molality and percentage by weight look like completely different units, but ' +
        'converting between them is always the same two-step move: pick $1000$ g of solvent as your basis, find ' +
        "the solute's mass from the molality, then form the ratio.",
    ),
    worked(
      'Example — Molality of 93% H₂SO₄ (w/v) (IIT 1990)',
      'Calculate the molality of a $1$-litre solution of $93\\%$ $\\ce{H2SO4}$ (wt./vol.). The density of the ' +
        'solution is $1.84$ g/mL.',
      '**Step 1 — Find the mass of the solution.**\n\n' +
        '$1$ L $= 1000$ mL $\\implies \\text{mass of solution} = 1000 \\times 1.84 = 1840\\ \\text{g}$\n\n' +
        '**Step 2 — Use "93% w/v" to find the mass of $\\ce{H2SO4}$.** By definition, $93\\%$ (w/v) means $93$ g ' +
        'of solute per $100$ mL of solution:\n\n' +
        '$\\text{mass of } \\ce{H2SO4} = 930\\ \\text{g (in the full 1000 mL)}$\n\n' +
        '**Step 3 — Find the mass of the solvent by subtraction.**\n\n' +
        '$w_{\\text{water}} = 1840 - 930 = 910\\ \\text{g}$\n\n' +
        '**Step 4 — Molality.**\n\n' +
        '$m = \\frac{n(\\ce{H2SO4})}{w_{\\text{water}}\\,(\\text{kg})} = \\frac{930/98}{0.910} = ' +
        '\\boxed{10.4\\ \\text{mol/kg}}$\n\n' +
        '**Answer:** $10.4$ m.',
    ),
    worked(
      'Example — Molality and Molarity of Ethanol from Its Mole Fraction',
      'Calculate the molality and molarity of a solution of ethanol in water if the mole fraction of ethanol is ' +
        '$0.05$ and the density of the solution is $0.997$ g/cc.',
      '**Step 1 — Take 100 moles of the mixture as a convenient basis.**\n\n' +
        '$X(\\ce{C2H5OH}) = 0.05 \\implies n(\\ce{C2H5OH}) = 5\\ \\text{mol}, \\quad n(\\ce{H2O}) = ' +
        '95\\ \\text{mol}$\n\n' +
        '**Step 2 — Convert both to masses.**\n\n' +
        '$w(\\ce{C2H5OH}) = 5 \\times 46 = 230\\ \\text{g}, \\qquad w(\\ce{H2O}) = 95 \\times 18 = ' +
        '1710\\ \\text{g}$\n\n' +
        '**Step 3 — Mass and volume of the whole solution.**\n\n' +
        '$w_{\\text{solution}} = 230 + 1710 = 1940\\ \\text{g} \\implies V = \\frac{1940}{0.997} = ' +
        '1945.8\\ \\text{mL} = 1.9458\\ \\text{L}$\n\n' +
        '**Step 4 — Molality.**\n\n' +
        '$m = \\frac{5}{1.710} = \\boxed{2.92\\ \\text{mol/kg}}$\n\n' +
        '**Step 5 — Molarity.**\n\n' +
        '$M = \\frac{5}{1.9458} = \\boxed{2.57\\ \\text{M}}$\n\n' +
        '**Answer:** molality $= 2.92$ m; molarity $= 2.57$ M.',
    ),
    worked(
      'Example — Molality and Molarity of a Solution Made by Mixing Two Different-Strength H₂SO₄ Solutions',
      'Calculate the molality and molarity of a solution made by mixing equal volumes of $30\\%$ by weight ' +
        '$\\ce{H2SO4}$ (density $= 1.218$ g/mL) and $70\\%$ by weight $\\ce{H2SO4}$ (density $= 1.610$ g/mL).',
      '**Step 1 — Pick a convenient equal volume for each solution — 1 litre of each.**\n\n' +
        '**Step 2 — Find the mass of $\\ce{H2SO4}$ and water in the 30% solution.**\n\n' +
        '$w_{\\text{solution A}} = 1000 \\times 1.218 = 1218\\ \\text{g} \\implies w(\\ce{H2SO4})_A = 0.30 \\times ' +
        '1218 = 365.4\\ \\text{g}, \\quad w(\\ce{H2O})_A = 852.6\\ \\text{g}$\n\n' +
        '**Step 3 — Find the mass of $\\ce{H2SO4}$ and water in the 70% solution.**\n\n' +
        '$w_{\\text{solution B}} = 1000 \\times 1.610 = 1610\\ \\text{g} \\implies w(\\ce{H2SO4})_B = 0.70 \\times ' +
        '1610 = 1127\\ \\text{g}, \\quad w(\\ce{H2O})_B = 483\\ \\text{g}$\n\n' +
        "**Step 4 — Add up both solutions' contributions.**\n\n" +
        '$w(\\ce{H2SO4})_{\\text{total}} = 365.4 + 1127 = 1492.4\\ \\text{g}, \\qquad w(\\ce{H2O})_{\\text{total}} ' +
        '= 852.6 + 483 = 1335.6\\ \\text{g}$\n\n' +
        '**Step 5 — Molality**, using the total water as the solvent mass:\n\n' +
        '$n(\\ce{H2SO4}) = \\frac{1492.4}{98} = 15.23\\ \\text{mol}$\n\n' +
        '$m = \\frac{15.23}{1.3356} = \\boxed{11.4\\ \\text{mol/kg}}$\n\n' +
        "**Step 6 — Molarity.** Take the total volume as the sum of the two volumes mixed ($1\\ \\text{L} + " +
        '1\\ \\text{L} = 2\\ \\text{L}$) — the standard assumption for a \'mixing equal volumes\' problem when the ' +
        "mixture's own density isn't given:\n\n" +
        '$M = \\frac{15.23}{2} = \\boxed{7.61\\ \\text{M}}$\n\n' +
        '**Answer:** molality $\\approx 11.4$ m; molarity $\\approx 7.61$ M.\n\n' +
        '**Why this matters:** mixing two solutions of the same solute is really just two separate ' +
        'percentage-and-density problems solved side by side, then added together — the only new idea is choosing ' +
        'a shared basis (equal volumes) so the two solutions can be combined honestly.',
    ),
  ],
  normality: [
    worked(
      'Example — All Four Concentration Units for the Same NaCl Solution',
      '$5$ g of $\\ce{NaCl}$ is dissolved in $1000$ g of water. If the density of the resulting solution is ' +
        '$0.997$ g per cc, calculate the molality, molarity, normality, and mole fraction of the solute.',
      "**Step 1 — Moles of $\\ce{NaCl}$ — the number every other quantity is built from.**\n\n" +
        '$n(\\ce{NaCl}) = \\frac{5}{58.5} = 0.0855\\ \\text{mol}$\n\n' +
        '**Step 2 — Molality** (per kg of solvent — the water alone, $1000$ g $= 1$ kg):\n\n' +
        '$m = \\frac{0.0855}{1} = \\boxed{0.0855\\ \\text{mol/kg}}$\n\n' +
        '**Step 3 — Volume of the solution**, using its density:\n\n' +
        '$w_{\\text{solution}} = 1000 + 5 = 1005\\ \\text{g} \\implies V = \\frac{1005}{0.997} = ' +
        '1008\\ \\text{mL} = 1.008\\ \\text{L}$\n\n' +
        '**Step 4 — Molarity.**\n\n' +
        '$M = \\frac{0.0855}{1.008} = \\boxed{0.0848\\ \\text{M}}$\n\n' +
        '**Step 5 — Normality.** For $\\ce{NaCl}$, the n-factor is $1$ (equivalent weight = molecular weight), so ' +
        'normality equals molarity here:\n\n' +
        '$N = M \\times 1 = \\boxed{0.0848\\ \\text{N}}$\n\n' +
        '**Step 6 — Mole fraction.**\n\n' +
        '$n(\\ce{H2O}) = \\frac{1000}{18} = 55.6\\ \\text{mol}$\n\n' +
        '$X(\\ce{NaCl}) = \\frac{0.0855}{0.0855 + 55.6} = \\boxed{1.54 \\times 10^{-3}}$\n\n' +
        '**Answer:** molality $= 0.0855$ m; molarity $= 0.0848$ M; normality $= 0.0848$ N; mole fraction $= ' +
        '1.54 \\times 10^{-3}$.\n\n' +
        '**Why this matters:** this is every unit on the page, computed for one single solution — the exact same ' +
        '$0.0855$ mol of $\\ce{NaCl}$, described four different ways. If you can produce this table for any ' +
        'solution, you have genuinely learned this page.',
    ),
  ],
};

const RELABELED_ID = 'b8183964-a034-478e-8bc2-391da98af667'; // "Example 1" -> descriptive label, moved to Molarity
const RELABELED_NEW_LABEL = 'Example — Molarity of NaOH from Mass and Volume';

// IDs of the 4 examples currently sitting after the quiz (Normality-related)
const POST_QUIZ_IDS = [
  'cf1a9082-9712-4f28-8ac7-92cd1ff6ae88', // Milliequivalents and Equivalents in N/10 NaOH
  '800ba227-b1ac-4fc0-929e-2108f9ac755b', // Strength of a KOH Solution from Its Milliequivalents
  '0105ae62-d521-49ba-8516-886a91610d1a', // Normality After Mixing Two Acids
  '02bd1cc9-e519-40ca-be7e-498b4f566cdc', // Diluting Concentrated Sulphuric Acid to a Target Normality
];

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const byId = new Map(cur.blocks.map((b) => [b.id, b]));

    const relabeled = byId.get(RELABELED_ID);
    if (!relabeled) throw new Error('relabeled block not found');
    if (relabeled.label !== RELABELED_NEW_LABEL) {
      console.log('already reorganized — checking full structure anyway (idempotent-ish; safe to re-run).');
    }
    const relabeledBlock = { ...relabeled, label: RELABELED_NEW_LABEL };

    const postQuizBlocks = POST_QUIZ_IDS.map((id) => {
      const b = byId.get(id);
      if (!b) throw new Error(`post-quiz block not found: ${id}`);
      return b;
    });

    // Static (non-worked_example) blocks, carried over unchanged, keyed by id
    // for readability of the assembly below.
    const heroImage = byId.get('8fc70584-bd56-4bff-9348-a467a8bc93bb');
    const didYouKnow = byId.get('f99d18c7-b7da-48c2-8318-c07adbbaf325');
    const introText = byId.get('32993585-10a4-4b81-99b9-67c15f9360f7');
    const dissolutionImage = byId.get('8015bc41-fb90-482a-a9c5-48ce0082c320');
    const simBlock = byId.get('a82c4925-933e-4502-8468-5c72a6ab1639');
    const percentHeading = byId.get('7d07a526-f00a-4180-853a-a8b67ef36f0a');
    const percentText = byId.get('be9e2346-2494-4a35-b6aa-89466f0b3820');
    const molarityHeading = byId.get('a5a144c1-5386-492c-9dd4-754256661b49');
    const molarityText1 = byId.get('b2ebf30e-f513-4e8f-a60f-34d7a18b4d88');
    const molarityText2 = byId.get('26879cff-9735-4f1f-9f1d-3621a31c6b8f');
    const molarityMoleFractionExample = byId.get('9c431808-c504-4dcb-8df4-560a71d5d554');
    const dilutionHeading = byId.get('d4a7f634-0d12-43d1-9840-3f6ab59130c7');
    const dilutionText = byId.get('85100734-04a2-458d-933f-cf75402d6b36');
    const simpleDilutionExample = byId.get('3a3a6687-2d31-4ef1-b8a0-29b9a1b867e1');
    const molalityHeading = byId.get('83172888-ad30-498f-92be-3630e12b032d');
    const molalityText = byId.get('3e3a840b-51ff-4e4f-bf39-44ce0cae4622');
    const molalityFromMoleFractionExample = byId.get('7a546849-e362-482c-a190-c1be4bb3de1d');
    const molarityToMolalityExample = byId.get('4ee14fe4-e681-453f-943d-01c8ff723e15');
    const normalityHeading = byId.get('b21ff2ec-2b70-4ae2-823e-de01eaaa99da');
    const normalityText = byId.get('330e2a63-10e8-4c82-81c0-1ef4ef76570a');
    const summaryImage = byId.get('59907472-39fd-415c-a589-4a767378713e');
    const comparisonCard = byId.get('57e54e80-522c-4c46-a3d3-baa90a19f836');
    const examTipCallout = byId.get('feaefdea-0657-4ecb-8641-dcacbdfd2403');
    const quiz = byId.get('7b800726-fe9c-47f9-b93d-2a76a595b41a');

    const required = {
      heroImage, didYouKnow, introText, dissolutionImage, simBlock, percentHeading, percentText,
      molarityHeading, molarityText1, molarityText2, molarityMoleFractionExample, dilutionHeading, dilutionText,
      simpleDilutionExample, molalityHeading, molalityText, molalityFromMoleFractionExample,
      molarityToMolalityExample, normalityHeading, normalityText, summaryImage, comparisonCard, examTipCallout, quiz,
    };
    for (const [name, block] of Object.entries(required)) {
      if (!block) throw new Error(`expected static block not found: ${name}`);
    }

    const newBlocksOrdered = [
      heroImage, didYouKnow, introText, dissolutionImage, simBlock,
      percentHeading, percentText,
      ...NEW.percentage,
      molarityHeading, molarityText1, molarityText2,
      NEW.molarity[0], // molarity of pure water — simplest
      relabeledBlock,  // NaOH molarity — simple (moved here from Normality section)
      molarityMoleFractionExample, // existing — moderate
      NEW.molarity[1], // concentrated HCl — moderate-hard
      dilutionHeading, dilutionText, simpleDilutionExample,
      molalityHeading, molalityText,
      NEW.molality[0], // NaCl 0.150 m — simplest
      molalityFromMoleFractionExample, // existing — moderate
      NEW.molality[1], // brine check — moderate
      molarityToMolalityExample, // existing — moderate-hard
      NEW.molality[2], // 93% H2SO4 w/v — moderate-hard
      NEW.molality[3], // ethanol mole fraction — hard
      NEW.molality[4], // mixing two H2SO4 solutions — hardest
      normalityHeading, normalityText, summaryImage,
      ...postQuizBlocks, // existing 4 Normality examples, simplest -> hardest (already in that order)
      NEW.normality[0], // all-four-units NaCl capstone — hardest overall, page finale
      comparisonCard, examTipCallout,
      quiz, // bottommost, always
    ];

    const finalBlocks = newBlocksOrdered.map((b, i) => ({ ...b, order: i }));

    // Sanity: no block lost, no block duplicated.
    const originalIds = new Set(cur.blocks.map((b) => b.id));
    const finalIds = finalBlocks.map((b) => b.id);
    if (new Set(finalIds).size !== finalIds.length) throw new Error('duplicate block id in final assembly');
    const missing = [...originalIds].filter((id) => !finalIds.includes(id));
    if (missing.length) throw new Error(`original block(s) missing from final assembly: ${missing.join(', ')}`);

    const addedCount = finalBlocks.length - cur.blocks.length;
    const res = await bw.savePage(db, { slug: SLUG }, finalBlocks, {
      author: 'agent',
      summary: `Reorganized worked examples: fixed 4 Normality examples sitting after the quiz (now before it, ` +
        `quiz restored as bottommost), relabeled+relocated the mis-tagged "Example 1" (a Molarity problem sitting ` +
        `under the Normality heading) to the Molarity section, and added ${addedCount} founder-supplied worked ` +
        'examples into their topically-relevant sections, ordered simplest -> hardest within each section. ' +
        'Purely additive/reorganizing — no block dropped.',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· blocks:', finalBlocks.length,
      `(+${addedCount})`, '· lossDetected:', res.diff.lossDetected);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
