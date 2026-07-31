'use strict';
/**
 * Restructures 'concentration-of-solutions' (Ch.1 Chemistry) — founder-
 * flagged 2026-07-25: the intro text lists the seven concentration units in
 * the order %(w/w), %(v/v), Mole Fraction, Molarity, Normality, Molality,
 * PPM/PPB — but the page BUILT them in a different order, with Mole Fraction
 * merged into (and taught after) Molality/Molarity instead of before
 * Molarity, and PPM/PPB merged into the Normality section. Founder wants:
 * (1) top-list order and section-build order to match, (2) Mole Fraction and
 * Molality as two fully separate sections (not merged), (3) Normality and
 * PPM/PPB as two fully separate sections (not merged), (4) two new PPM
 * worked examples with a real-world hook (chlorine in a swimming pool).
 *
 * New section order: Percentage -> Mole Fraction -> Molarity -> Dilution ->
 * Normality -> Molality -> PPM/PPB. (Dilution isn't one of the 7 listed
 * units — it's a technique — so it stays right after Molarity, where
 * M1V1=M2V2 naturally belongs; the founder didn't flag it as out of place.)
 *
 * Two merged heading+text blocks are split at their existing "---" divider
 * into two independent heading+text pairs (content preserved, only $$ ->
 * single $ normalized per CLAUDE.md §4 since the text is being rewritten
 * anyway). A brand-new minimal "Mole Fraction" worked example is added
 * (glucose-in-water) since the new standalone section otherwise had zero
 * examples where mole fraction itself is the output (every existing example
 * uses mole fraction only as a GIVEN, feeding into molarity/molality) — a
 * small, clearly-scoped addition to make the new section stand on its own,
 * not something the founder explicitly asked for; flagged in chat.
 *
 * The "All Four Concentration Units" capstone (needs molality + molarity +
 * normality + mole fraction) is moved from mid-Normality to the very end of
 * all unit-teaching sections (after the new PPM section), since it's the
 * whole-page review problem and reads best as the final worked example
 * before the wrap-up comparison card / exam tip / quiz.
 *
 * All new PPM chemistry independently verified: pool-1 (100 g Cl in 50,000 L
 * water) -> 2 ppm, mid the commonly-cited 1-3 ppm pool range; pool-2 (25,000
 * L pool, 0.8 ppm currently, 3 ppm cap) -> 20 g currently present, 75 g max
 * allowed, 55 g of headroom.
 *
 * Structural approach matches the previous reorganize_concentration_page_
 * examples.js script: rebuild the full blocks array in the target order,
 * every carried-over block referenced by its known id, with an id-coverage
 * sanity check before saving. Purely additive/reorganizing via
 * book-writer.savePage — no block dropped.
 * Run: node scripts/split_and_reorder_concentration_sections.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'concentration-of-solutions';

const worked = (label, problem, solution) => ({
  id: uuidv4(), type: 'worked_example', label, variant: 'solved_example', problem, solution, reveal_mode: 'tap_to_reveal',
});
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', markdown });

// ─── New standalone section content (split out of the two merged blocks) ──

const moleFractionText = text(
  '**Mole Fraction** is the ratio of moles of one component to the total moles of all components in a solution:\n\n' +
  '$X_A = \\frac{n_A}{n_A + n_B} \\quad \\text{and} \\quad X_B = \\frac{n_B}{n_A + n_B}$\n\n' +
  'Important: $X_A + X_B = 1$ (mole fractions of all components always add up to 1).\n\n' +
  "Mole fraction ranges from 0 to 1 and has **no units** — it's a pure ratio of particle counts, independent of " +
  'mass, volume, or temperature.\n\n' +
  'Example: a mixture has 3 mol A and 9 mol B:\n' +
  '- $X_A = \\frac{3}{12} = 0.25$ (or 25%)\n' +
  '- $X_B = \\frac{9}{12} = 0.75$ (or 75%)'
);

const molalityText = text(
  '**Molality** is the number of moles of solute per **kilogram of solvent** (not solution):\n\n' +
  '$m = \\frac{\\text{moles of solute}}{\\text{mass of solvent (kg)}}$\n\n' +
  'SI unit: mol kg$^{-1}$\n\n' +
  '✅ **Molality is temperature-independent** — it is based on mass, which does not change with temperature. This ' +
  'makes molality preferred for colligative property calculations.'
);

const normalityText = text(
  '**Normality** is the number of gram-equivalents (equivalents) of solute per litre of solution:\n\n' +
  '$N = \\frac{\\text{number of equivalents}}{\\text{volume of solution (L)}} = M \\times n\\text{-factor}$\n\n' +
  'where the **n-factor** depends on the reaction:\n' +
  '- For acids: n-factor = number of replaceable $\\ce{H^+}$ ions\n' +
  '- For bases: n-factor = number of replaceable $\\ce{OH^-}$ ions\n' +
  '- For oxidising/reducing agents: n-factor = change in oxidation state per molecule\n\n' +
  'Examples: 0.2 M HCl → N = 0.2 × 1 = 0.2 N; 0.5 M $\\ce{H2SO4}$ → N = 0.5 × 2 = 1 N'
);

const ppmText = text(
  '**PPM (Parts per Million)** — used for very dilute solutions (pollutants, trace elements):\n\n' +
  '$\\text{PPM} = \\frac{\\text{parts of solute}}{\\text{parts of solution}} \\times 10^6 = ' +
  '\\frac{\\text{mass of solute}}{\\text{mass of solution}} \\times 10^6$\n\n' +
  '**PPB (Parts per Billion):**\n\n' +
  '$\\text{PPB} = \\frac{\\text{parts of solute}}{\\text{parts of solution}} \\times 10^9$\n\n' +
  'A useful shortcut for dilute aqueous solutions (density $\\approx 1$ g/mL): $1$ ppm $\\approx 1$ mg per litre.'
);

const moleFractionHeading = heading('Mole Fraction (X)');
const normalityHeadingNew = heading('Normality (N)');
const molalityHeadingNew = heading('Molality (m)');
const ppmHeading = heading('PPM and PPB');

// ─── New worked examples ────────────────────────────────────────────────────

const moleFractionExample = worked(
  'Example — Mole Fraction of Glucose in a Solution',
  'A solution is prepared by dissolving $2$ mol of glucose ($\\ce{C6H12O6}$) in $18$ mol of water. Calculate the ' +
    'mole fraction of glucose and of water.',
  '**Step 1 — Total moles.**\n\n' +
    '$n_{\\text{total}} = 2 + 18 = 20\\ \\text{mol}$\n\n' +
    '**Step 2 — Mole fraction of each component.**\n\n' +
    '$X_{\\text{glucose}} = \\frac{2}{20} = \\boxed{0.10}$\n\n' +
    '$X_{\\text{water}} = \\frac{18}{20} = \\boxed{0.90}$\n\n' +
    '**Check:** $X_{\\text{glucose}} + X_{\\text{water}} = 0.10 + 0.90 = 1$ ✓ — mole fractions of every component ' +
    'in a solution always add up to exactly $1$.\n\n' +
    '**Answer:** $X_{\\text{glucose}} = 0.10$, $X_{\\text{water}} = 0.90$.',
);

const ppmExample1 = worked(
  'Example — PPM of Chlorine Added to a Swimming Pool',
  'A pool operator adds $100$ g of chlorine to a swimming pool containing $50{,}000$ L of water (density ' +
    '$\\approx 1$ g/mL) to sanitise it. What is the resulting chlorine concentration in ppm? Is this within the ' +
    'typical recommended range of $1$–$3$ ppm for a swimming pool?',
  '**Step 1 — Convert the pool\'s volume to a mass, using density ≈ 1 g/mL.**\n\n' +
    '$50{,}000\\ \\text{L} = 50{,}000{,}000\\ \\text{mL} \\implies \\text{mass of water} \\approx ' +
    '50{,}000{,}000\\ \\text{g} = 5 \\times 10^7\\ \\text{g}$\n\n' +
    'Since the chlorine added is tiny compared to the pool itself, this is also, to a very good approximation, the ' +
    'mass of the whole solution.\n\n' +
    '**Step 2 — Apply the PPM formula.**\n\n' +
    '$\\text{PPM} = \\frac{\\text{mass of solute}}{\\text{mass of solution}} \\times 10^6 = ' +
    '\\frac{100}{5 \\times 10^7} \\times 10^6 = \\boxed{2\\ \\text{ppm}}$\n\n' +
    '**Answer:** $2$ ppm — right in the middle of the $1$–$3$ ppm range typically recommended for swimming pool ' +
    'chlorine, so this pool is properly sanitised.\n\n' +
    "**Why this matters:** for any dilute aqueous solution, you can almost always treat the solute's own mass as " +
    "negligible when finding the mass of 'the solution' — that's what makes the shortcut $1$ ppm $\\approx 1$ mg/L " +
    'work so well for water-based problems like this one.',
);

const ppmExample2 = worked(
  'Example — How Much More Chlorine Can Be Safely Added to a Pool',
  'A $25{,}000$ L swimming pool currently has a chlorine concentration of $0.8$ ppm. Safety guidelines cap ' +
    'chlorine at a maximum of $3$ ppm. Assuming the density of the pool water is $1$ g/mL, what is the maximum ' +
    'additional mass of chlorine (in grams) that can still be safely added?',
  "**Step 1 — Convert the pool's volume to a mass.**\n\n" +
    '$25{,}000\\ \\text{L} = 25{,}000{,}000\\ \\text{g} = 2.5 \\times 10^7\\ \\text{g}$ (density $\\approx 1$ ' +
    'g/mL)\n\n' +
    '**Step 2 — Find the CURRENT mass of chlorine, from the current ppm.**\n\n' +
    '$\\text{mass}_{\\text{current}} = \\text{PPM} \\times \\frac{\\text{mass of solution}}{10^6} = 0.8 \\times ' +
    '\\frac{2.5 \\times 10^7}{10^6} = 0.8 \\times 25 = 20\\ \\text{g}$\n\n' +
    '**Step 3 — Find the MAXIMUM allowed mass of chlorine, at the 3 ppm cap.**\n\n' +
    '$\\text{mass}_{\\text{max}} = 3 \\times \\frac{2.5 \\times 10^7}{10^6} = 3 \\times 25 = 75\\ \\text{g}$\n\n' +
    '**Step 4 — Subtract to find how much more can be added.**\n\n' +
    '$\\text{additional chlorine allowed} = 75 - 20 = \\boxed{55\\ \\text{g}}$\n\n' +
    '**Answer:** $55$ g of chlorine can still be safely added.\n\n' +
    '**Why this matters:** ppm problems often hide a subtraction step just like back-titration problems do — the ' +
    'quantity you actually want (how much more you can add) is never given directly, only the before-and-after ' +
    'totals. Find both masses first, then subtract.',
);

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const byId = new Map(cur.blocks.map((b) => [b.id, b]));
    const get = (id, name) => {
      const b = byId.get(id);
      if (!b) throw new Error(`expected block not found: ${name} (${id})`);
      return b;
    };

    const heroImage = get('8fc70584-bd56-4bff-9348-a467a8bc93bb', 'heroImage');
    const didYouKnow = get('f99d18c7-b7da-48c2-8318-c07adbbaf325', 'didYouKnow');
    const introText = get('32993585-10a4-4b81-99b9-67c15f9360f7', 'introText');
    const dissolutionImage = get('8015bc41-fb90-482a-a9c5-48ce0082c320', 'dissolutionImage');
    const simBlock = get('a82c4925-933e-4502-8468-5c72a6ab1639', 'simBlock');
    const percentHeading = get('7d07a526-f00a-4180-853a-a8b67ef36f0a', 'percentHeading');
    const percentText = get('be9e2346-2494-4a35-b6aa-89466f0b3820', 'percentText');
    const muriaticExample = get('d760c729-e5e0-4b6e-a812-8f94f689a653', 'muriaticExample');
    const seawaterExample = get('e8337db3-f059-4647-9f59-a2150bc3d730', 'seawaterExample');
    const ethanolVvWwExample = get('2b7bea88-487c-441e-a6c3-f6162071d262', 'ethanolVvWwExample');
    const molarityHeading = get('a5a144c1-5386-492c-9dd4-754256661b49', 'molarityHeading');
    const molarityText1 = get('b2ebf30e-f513-4e8f-a60f-34d7a18b4d88', 'molarityText1');
    const molarityText2 = get('26879cff-9735-4f1f-9f1d-3621a31c6b8f', 'molarityText2');
    const waterMolarityExample = get('f70a8295-2c37-469a-9108-f91c4c95cca2', 'waterMolarityExample');
    const naohMolarityExample = get('b8183964-a034-478e-8bc2-391da98af667', 'naohMolarityExample');
    const molarityFromMoleFractionExample = get('9c431808-c504-4dcb-8df4-560a71d5d554', 'molarityFromMoleFractionExample');
    const concHclMolarityExample = get('09276956-12b0-4381-8b7a-e1beadfe3636', 'concHclMolarityExample');
    const dilutionHeading = get('d4a7f634-0d12-43d1-9840-3f6ab59130c7', 'dilutionHeading');
    const dilutionText = get('85100734-04a2-458d-933f-cf75402d6b36', 'dilutionText');
    const simpleDilutionExample = get('3a3a6687-2d31-4ef1-b8a0-29b9a1b867e1', 'simpleDilutionExample');
    const naclMolalityExample = get('b55bde7c-7d4d-49ef-aa26-5cbcf7e95d6c', 'naclMolalityExample');
    const molalityFromMoleFractionExample = get('7a546849-e362-482c-a190-c1be4bb3de1d', 'molalityFromMoleFractionExample');
    const brineCheckExample = get('aa2f2559-ecd9-43fb-9a4b-78c59ceae1dc', 'brineCheckExample');
    const molarityToMolalityExample = get('4ee14fe4-e681-453f-943d-01c8ff723e15', 'molarityToMolalityExample');
    const h2so4wvMolalityExample = get('e4a0beb1-c896-4307-8953-bfab9899b8b3', 'h2so4wvMolalityExample');
    const ethanolMoleFractionExample = get('10c4e555-2028-4aca-90f1-deed94c505ff', 'ethanolMoleFractionExample');
    const mixingH2so4Example = get('d6381fe5-5086-4a50-b09b-b8f8e907c3bf', 'mixingH2so4Example');
    const summaryImage = get('59907472-39fd-415c-a589-4a767378713e', 'summaryImage');
    const meqNaohExample = get('cf1a9082-9712-4f28-8ac7-92cd1ff6ae88', 'meqNaohExample');
    const kohStrengthExample = get('800ba227-b1ac-4fc0-929e-2108f9ac755b', 'kohStrengthExample');
    const mixingAcidsNormalityExample = get('0105ae62-d521-49ba-8516-886a91610d1a', 'mixingAcidsNormalityExample');
    const dilutingH2so4Example = get('02bd1cc9-e519-40ca-be7e-498b4f566cdc', 'dilutingH2so4Example');
    const allFourUnitsCapstone = get('6da13ba3-69fb-4874-9918-60ba625ed5a7', 'allFourUnitsCapstone');
    const comparisonCard = get('57e54e80-522c-4c46-a3d3-baa90a19f836', 'comparisonCard');
    const examTipCallout = get('feaefdea-0657-4ecb-8641-dcacbdfd2403', 'examTipCallout');
    const quiz = get('7b800726-fe9c-47f9-b93d-2a76a595b41a', 'quiz');

    const finalBlocksOrdered = [
      heroImage, didYouKnow, introText, dissolutionImage, simBlock,

      percentHeading, percentText,
      muriaticExample, seawaterExample, ethanolVvWwExample,

      moleFractionHeading, moleFractionText,
      moleFractionExample,

      molarityHeading, molarityText1, molarityText2,
      waterMolarityExample, naohMolarityExample, molarityFromMoleFractionExample, concHclMolarityExample,

      dilutionHeading, dilutionText, simpleDilutionExample,

      normalityHeadingNew, normalityText,
      meqNaohExample, kohStrengthExample, mixingAcidsNormalityExample, dilutingH2so4Example,

      molalityHeadingNew, molalityText,
      naclMolalityExample, molalityFromMoleFractionExample, brineCheckExample, molarityToMolalityExample,
      h2so4wvMolalityExample, ethanolMoleFractionExample, mixingH2so4Example,

      ppmHeading, ppmText,
      ppmExample1, ppmExample2,

      summaryImage,
      allFourUnitsCapstone,

      comparisonCard, examTipCallout,
      quiz,
    ];

    const finalBlocks = finalBlocksOrdered.map((b, i) => ({ ...b, order: i }));

    // These 4 blocks (the old merged "Molality and Mole Fraction" + "Normality
    // and PPM/PPB" heading+text pairs) are INTENTIONALLY retired — their
    // content is preserved, split across the 4 new standalone heading+text
    // blocks above. Everything else must survive untouched.
    const INTENTIONALLY_RETIRED = new Set([
      '83172888-ad30-498f-92be-3630e12b032d', // old heading "Molality (m) and Mole Fraction (X)"
      '3e3a840b-51ff-4e4f-bf39-44ce0cae4622', // old combined molality+mole-fraction text
      'b21ff2ec-2b70-4ae2-823e-de01eaaa99da', // old heading "Normality (N) and PPM/PPB"
      '330e2a63-10e8-4c82-81c0-1ef4ef76570a', // old combined normality+ppm text
    ]);

    const originalIds = new Set(cur.blocks.map((b) => b.id));
    const finalIds = finalBlocks.map((b) => b.id);
    if (new Set(finalIds).size !== finalIds.length) throw new Error('duplicate block id in final assembly');
    const missing = [...originalIds].filter((id) => !finalIds.includes(id) && !INTENTIONALLY_RETIRED.has(id));
    if (missing.length) throw new Error(`original block(s) missing from final assembly: ${missing.join(', ')}`);
    const unexpectedlyRetired = [...INTENTIONALLY_RETIRED].filter((id) => !originalIds.has(id) || finalIds.includes(id));
    if (unexpectedlyRetired.length) throw new Error(`retirement list mismatch: ${unexpectedlyRetired.join(', ')}`);

    const addedCount = finalBlocks.length - cur.blocks.length;
    const res = await bw.savePage(db, { slug: SLUG }, finalBlocks, {
      author: 'agent',
      summary: 'Restructured to match the intro list\'s stated unit order (Percentage -> Mole Fraction -> ' +
        'Molarity -> Dilution -> Normality -> Molality -> PPM/PPB): split "Molality and Mole Fraction" and ' +
        '"Normality and PPM/PPB" into 4 fully separate heading+text sections, moved the all-four-units capstone ' +
        'to the true end of the unit-teaching content, and added 3 worked examples (1 mole-fraction seed + 2 ' +
        'founder-requested PPM examples, swimming-pool chlorine themed). Purely additive/reorganizing.',
      allowContentLoss: true,
      lossReason: 'Founder-requested split of 2 merged heading+text blocks into 4 standalone ones (2026-07-25 ' +
        'chat instruction: "do not merge molality with mole fraction... keep the ppm ppb separate from ' +
        'normality"). This changes 4 block IDs but preserves 100% of their text — every sentence from the 2 old ' +
        'blocks lands in one of the 4 new ones (verified in the script source above). No teaching content dropped.',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· blocks:', finalBlocks.length,
      `(+${addedCount})`, '· lossDetected:', res.diff.lossDetected);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
