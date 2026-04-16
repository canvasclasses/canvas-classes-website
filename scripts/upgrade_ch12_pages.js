'use strict';
/**
 * Chapter 12 (Practical Organic Chemistry) page upgrade script
 *
 * Changes:
 * 1. Page 1  (Sublimation)       — add inline_quiz (3 questions: recall + application + reasoning)
 * 2. Page 7  (Chromatography)    — expand fun_fact with crime-scene detail
 * 3. Pages 2–12 (all with quiz)  — append one Level-3 reasoning question to each quiz
 */

const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

const BOOK_ID  = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
const PAGE_IDS = {
  p1:  'd0f29e0f-053f-4f2e-8e25-2f72cdc4b83f',
  p2:  '43e9c0cb-eb63-45ed-b6d9-6a5564a67a3f',
  p3:  '99e7e477-0423-4f99-952e-698597f46f83',
  p4:  '2544a9a6-544f-4fc6-b701-1dc31f0c7207',
  p5:  'c5f92da3-be42-4b40-8bb7-f6ce14c80112',
  p6:  '10334749-5f35-455b-8dd1-afe0251774c6',
  p7:  'ffde6040-909c-474b-8e44-de95e3c51c49',
  p8:  '03902fa2-37cf-4c17-822f-860fd0ab8beb',
  p9:  '59175a1e-b062-458a-9f1a-241fa05d0013',
  p10: 'f8f575a1-706d-4199-aa0c-1e28bd9cf0b5',
  p11: 'a25a88f9-eb84-4b05-950a-fa1b3f902156',
  p12: '460bf948-13b2-4f7d-8540-7eeb647e95e6',
};

// Quiz IDs (for pages that already have a quiz)
const QUIZ_IDS = {
  p2:  'b3b0ba2d-7ac2-4edf-8f71-c2f7ecf7cd7a',
  p3:  'c8f73e6b-10e3-48dd-aed7-bc072359fde9',
  p4:  '5404cced-f195-46c9-8076-61c80c2bd447',
  p5:  '1a84df66-be43-458f-8b6c-e71279db1742',
  p6:  '4094e17c-d1e6-4e50-93db-d221c2b7034d',
  p7:  'be048c9e-7a86-4fc1-86b0-e5a70da8a219',
  p8:  '981dcbc2-38bb-4b41-ab49-d274a1daa880',
  p9:  '1842ec02-14b8-467c-b5a6-2b4ba6ef1419',
  p10: 'bbc90fe0-4b7b-40f4-8be4-52fddee1736c',
  p11: '85543017-8e75-4769-947b-43dec3bffc10',
  p12: '8eacc683-69df-4d0e-9fc9-2238b9ada126',
};

// ── Reasoning questions to append to each page's quiz ─────────────────────────

const REASONING_QS = {
  // Page 2 — Crystallisation
  p2: {
    question: 'A student recrystallises a compound but finds the product still has a faint colour. Repeating the crystallisation alone does not help. A classmate suggests dissolving the crude product in hot solvent, adding a pinch of activated charcoal, filtering hot, and then cooling. Why does this step remove the colour when plain recrystallisation cannot?',
    options: [
      'Activated charcoal reacts chemically with the coloured impurity and decomposes it',
      'Charcoal adsorbs coloured molecules onto its large surface area; since these impurities do not crystallise out on their own, recrystallisation alone leaves them behind',
      'Heating with charcoal raises the boiling point of the solvent, dissolving more impurity',
      'The colour is due to excess solvent, and charcoal simply absorbs the extra solvent',
    ],
    correct_index: 1,
    explanation: 'Coloured impurities are often large polycyclic molecules that remain dissolved during crystallisation rather than crystallising out with the product. Activated charcoal, with its enormous internal surface area, adsorbs these molecules selectively. Filtering hot removes the charcoal (and adsorbed impurity) before the pure compound crystallises on cooling.',
  },

  // Page 3 — Distillation
  p3: {
    question: 'During a distillation, the thermometer reading climbs continuously from 60 °C to 95 °C instead of holding steady at one temperature. A student claims "this just means the flame is too high — reduce the heat." Is this correct? What does a continuously rising temperature actually indicate?',
    options: [
      'The student is correct; reducing the flame will stabilise the temperature at the lower boiling component\'s boiling point',
      'The rising temperature indicates the two liquids have close boiling points and are co-distilling; pure fractions cannot be collected this way — fractional distillation is needed',
      'The rising temperature means the compound is decomposing, and distillation should be stopped immediately',
      'The thermometer is measuring the flask temperature, not the vapour — this reading is always inaccurate',
    ],
    correct_index: 1,
    explanation: 'In simple distillation of two liquids, the thermometer should hold steady at the lower boiling point while the first fraction distils. A continuously rising reading shows that both components are vaporising simultaneously — their boiling points are too close for clean separation. This calls for a fractionating column (fractional distillation), which provides multiple condensation-vaporisation steps to separate the components.',
  },

  // Page 4 — Fractional Distillation
  p4: {
    question: 'An engineer collects the petrol fraction from a petroleum fractionating column but finds the early portions have a slightly higher boiling point than expected. She suspects the fractionating column is too short. What is the connection between column height and separation purity?',
    options: [
      'A taller column increases pressure inside the column, forcing better separation of fractions',
      'A taller column allows more theoretical plates — more cycles of condensation and re-vaporisation — so each fraction is more thoroughly separated before exiting at the top',
      'A shorter column heats the mixture unevenly, causing heavier fractions to vaporise first',
      'Column height only matters for water distillation; for petroleum, temperature alone determines which fraction exits',
    ],
    correct_index: 1,
    explanation: 'Each "theoretical plate" in a fractionating column is effectively one equilibration cycle: vapour condenses on packing material, re-equilibrates with liquid, and re-vaporises at a composition closer to the more volatile component. A taller column provides more such cycles. A short column lets mixed vapours reach the top without full separation, so early fractions carry traces of heavier components — exactly the elevated boiling point the engineer observed.',
  },

  // Page 5 — Special Distillation Techniques
  p5: {
    question: 'A chemist must purify a water-insoluble compound with a boiling point of ~290 °C that decomposes slowly above 200 °C. She can choose vacuum distillation or steam distillation. Which is more appropriate, and what is the single most important deciding factor?',
    options: [
      'Vacuum distillation, because any compound with a boiling point above 200 °C must be distilled under reduced pressure',
      'Steam distillation, because the compound is water-insoluble — the key requirement — and the mixture boils well below 100 °C, safely avoiding the decomposition temperature',
      'Steam distillation, because steam always produces higher purity than vacuum distillation',
      'Vacuum distillation, because steam distillation introduces water, which might react with the compound',
    ],
    correct_index: 1,
    explanation: 'The decisive factor for steam distillation is water-immiscibility. Because the mixture of compound + water boils at a temperature below 100 °C (the vapour pressures add to 760 mm Hg at a temperature far below either pure boiling point), the compound is safely distilled well below its decomposition temperature. Vacuum distillation does reduce boiling point, but for a compound that decomposes above 200 °C, steam distillation achieves a much larger temperature reduction (distilling near 90–95 °C) without any pump or sealed system.',
  },

  // Page 6 — Differential Extraction
  p6: {
    question: 'A student extracts a compound from water using 45 mL of ether in one batch and recovers 75%. A classmate uses the same 45 mL divided into three 15 mL extractions and recovers 92%. Why do multiple small extractions outperform a single large extraction when the total solvent volume is identical?',
    options: [
      'More extractions increase the temperature, raising solubility in the organic layer',
      'Three extractions expose the solute to more solvent surface area, speeding up the extraction rate',
      'Each extraction establishes a fresh equilibrium with uncontaminated solvent, so each cycle removes a larger percentage of what remains; the cumulative effect beats a single extraction even with the same total volume',
      'Small volumes of solvent have a higher density, causing better layer separation in the separating funnel',
    ],
    correct_index: 2,
    explanation: 'Distribution equilibrium (K = [organic layer] / [aqueous layer]) is fixed for a given solute-solvent pair. After one extraction, the aqueous layer still retains a fraction determined by K and the volume ratio. A fresh 15 mL of solvent re-establishes equilibrium from that reduced concentration — removing another fraction of what was left. Three fresh equilibria cumulatively achieve higher recovery than one equilibrium using all 45 mL at once. This is why continuous extractors are used when K is unfavourable.',
  },

  // Page 7 — Chromatography
  p7: {
    question: 'A forensic analyst runs TLC of an unknown ink alongside Standard A (one spot, Rf = 0.45) and Standard B (two spots, Rf = 0.30 and 0.65). The unknown shows three spots at Rf = 0.30, 0.45, and 0.65. What is the correct conclusion?',
    options: [
      'The unknown is definitively a mixture of Standard A and Standard B, because Rf values uniquely identify compounds in all solvent systems',
      'The unknown is likely a mixture of compounds similar to those in Standards A and B, but Rf values alone are not definitive — a second TLC in a different solvent system, or co-spotting, is needed for confirmation',
      'The unknown is the same as Standard B, because two of its three spots match Standard B exactly',
      'Three spots means the sample is contaminated; TLC results with more than two spots are unreliable',
    ],
    correct_index: 1,
    explanation: 'Matching Rf values in a single solvent system is strong circumstantial evidence but not proof. Rf values depend on the specific solvent, stationary phase, temperature, and plate activity — different compounds can share an Rf in one system and separate in another. A forensic conclusion requires a second solvent system and ideally co-spotting (spotting unknown and standard on the same lane) to confirm spot identity. This is why forensic labs use multi-method confirmation before reporting a match.',
  },

  // Page 8 — Qualitative Analysis
  p8: {
    question: 'A student performs Lassaigne\'s test on a compound. She gets a Prussian blue precipitate (positive for N), but the sodium fusion extract gives no precipitate with AgNO₃ even after acidification with dilute HNO₃. She concludes: "This compound contains nitrogen but no halogen." Is her conclusion valid? Could any error in the procedure explain a false-negative halogen result?',
    options: [
      'The conclusion is valid; Lassaigne\'s test for halogens is infallible — no precipitate means no halogen',
      'The conclusion may be wrong; if the sodium fusion was incomplete, organic halogens may not have been fully converted to halide ions, giving a false negative — repeating the fusion with more sodium could resolve this',
      'The conclusion is wrong; Prussian blue formation always indicates both nitrogen AND a halogen are present',
      'The conclusion is wrong; the extract should be acidified with concentrated HNO₃ to detect halogens, not dilute HNO₃',
    ],
    correct_index: 1,
    explanation: 'Lassaigne\'s test requires that the organic compound be completely decomposed by fusion with sodium, converting C–N bonds to NaCN and C–X bonds to NaX. If the fusion is incomplete (too little sodium, too short a heating time, or a highly stable C–Halogen bond), halide ions may not form in sufficient concentration to precipitate with AgNO₃. This is particularly common with aromatic halogens (aryl halides), where the C–X bond is strengthened by resonance. Always verify by repeating with excess sodium and longer fusion.',
  },

  // Page 9 — Estimation of C and H
  p9: {
    question: 'In a combustion apparatus for C–H estimation, a student accidentally reverses the two absorbers: KOH is placed first, CaCl₂ second. He still obtains mass readings for both tubes. What error does this introduce — will % C be too high, too low, or unaffected? What about % H?',
    options: [
      'No error — the order of absorbers does not matter as long as both gases are absorbed',
      '% C will be too high; % H will be too low — KOH placed first will absorb both CO₂ and water vapour, so its recorded mass gain includes the water that was meant for CaCl₂; the CaCl₂ tube then gains very little mass',
      '% C will be correct; % H will be too low — KOH absorbs CO₂ perfectly, and CaCl₂ is unaffected by CO₂',
      '% C will be too low; % H will be too high — KOH reacts with water vapour to form a hydrate, reducing the apparent CO₂ absorbed',
    ],
    correct_index: 1,
    explanation: 'KOH absorbs both water vapour and CO₂. If placed first, it gains mass from both — the extra mass (water) inflates the apparent CO₂ absorbed, making % C appear too high. Meanwhile, the CaCl₂ tube downstream receives gas that has already lost most of its water to the KOH, so CaCl₂ gains very little mass — making % H appear too low. This is why the sequence CaCl₂ (water absorber) → KOH (CO₂ absorber) is mandatory: CO₂ does not react with CaCl₂, so placing it first does not contaminate the CO₂ reading.',
  },

  // Page 10 — Estimation of Nitrogen
  p10: {
    question: 'A biochemist needs to estimate nitrogen in aniline (C₆H₅NH₂). Her supervisor says: "Do not use Kjeldahl\'s method — use Dumas\' method." Why is Kjeldahl\'s method unsuitable for aniline specifically?',
    options: [
      'Kjeldahl\'s method is only suitable for inorganic compounds; it cannot be used for any organic compound',
      'Aniline is a liquid and would evaporate before the sulphuric acid digestion is complete',
      'In aniline, nitrogen is bonded to an aromatic ring. Kjeldahl\'s acid digestion cannot cleave this N–C bond to release ammonium ions; only nitrogen in aliphatic amines and amides is converted to NH₄⁺ by this method',
      'Dumas\' method uses copper oxide which catalyses the reaction with aromatic amines; Kjeldahl\'s reagents do not contain any catalyst',
    ],
    correct_index: 2,
    explanation: 'Kjeldahl\'s method converts organic nitrogen to ammonium sulphate by digestion with concentrated H₂SO₄. However, it only works for certain nitrogen environments: aliphatic amines, amides, and proteins. Nitrogen bonded to aromatic rings (aniline), nitrogen in azo groups (–N=N–), nitro groups (–NO₂), and ring-nitrogen (pyridine) resist Kjeldahl digestion and do not convert to NH₄⁺ reliably. Dumas\' method (combustion in CO₂ atmosphere over CuO) converts all organic nitrogen to N₂ gas and is therefore universally applicable.',
  },

  // Page 11 — Estimation of Halogens and Sulphur
  p11: {
    question: 'A student suggests simplifying the Carius method by just dissolving the compound in dilute HNO₃ at room temperature and directly adding AgNO₃ to precipitate the halide. Why does this simpler approach fail for most organic halogen compounds?',
    options: [
      'Silver nitrate does not react with dilute HNO₃ solutions, so no precipitation can occur',
      'Organic halogens exist as covalent C–X bonds, not free X⁻ ions. The fuming HNO₃ and high temperature in the Carius method oxidatively degrade the organic molecule, breaking C–X bonds and releasing X⁻ ions — without this step, there are no halide ions for AgNO₃ to precipitate',
      'Dilute HNO₃ reacts with silver nitrate to form AgNO₂, which is insoluble and clogs the apparatus before it can react with the halide',
      'The Carius tube is sealed to create high pressure; without this pressure, the compound does not dissolve in HNO₃',
    ],
    correct_index: 1,
    explanation: 'Most organic halogen compounds (like chlorobenzene, CHCl₃, or DDT) contain halogens as covalent C–X bonds. These bonds do not ionise in dilute acid at room temperature — the molecule stays intact. The Carius method uses sealed-tube heating with fuming nitric acid at ~250 °C to completely oxidise the organic framework, breaking every C–X bond and releasing halogen atoms as HX, which immediately ionises in the acid medium to give X⁻ ions. Only then can AgNO₃ form the insoluble AgX precipitate that is weighed.',
  },

  // Page 12 — Estimation of P and O
  p12: {
    question: 'After measuring %C, %H, %N, and %S in a compound and finding no halogen, a student calculates %O = 100 − (%C + %H + %N + %S). Her professor warns: "Your %O figure could be significantly off, even if each individual measurement has only ±0.5% error." Is the professor right, and why?',
    options: [
      'No — subtraction by difference is the most accurate method for oxygen because it avoids direct measurement errors',
      'Yes — subtraction accumulates every measurement error from %C, %H, %N, and %S into the %O result; a ±0.5% error in each of four quantities could translate into a ±2.0% compounded error in %O',
      'Yes — but only because oxygen is always the most abundant element, so small errors in other percentages become large absolute errors in %O',
      'No — the professor is wrong; random errors cancel each other out, so the sum of four small errors in %O is effectively zero',
    ],
    correct_index: 1,
    explanation: 'Error propagation in subtraction is additive, not cancelling. If each of %C, %H, %N, %S has an experimental uncertainty of ±0.5%, the final %O (calculated as 100 minus their sum) carries an uncertainty of up to ±2.0%. This is why "direct estimation of oxygen" exists as a separate method — the compound is pyrolysed in a stream of nitrogen, and the oxygen-containing gases are converted to CO and measured. The direct method eliminates this error accumulation. In practice, subtraction is used when the required accuracy allows it, but the limitation the professor describes is real.',
  },
};

// ── Page 1 quiz block (new) ────────────────────────────────────────────────────
const PAGE1_QUIZ = {
  id: uuidv4(),
  type: 'inline_quiz',
  order: 5,
  pass_threshold: 0.67,
  questions: [
    {
      question: 'Sublimation is a phase change in which a substance converts directly from:',
      options: [
        'Liquid to gas, bypassing the solid phase',
        'Solid to liquid, without heating',
        'Solid to gas, without passing through the liquid phase',
        'Gas to solid, releasing heat',
      ],
      correct_index: 2,
      explanation: 'Sublimation is the direct transition from solid to vapour (gas) state without an intermediate liquid phase. The reverse process — gas to solid directly — is called deposition (or sometimes reverse sublimation).',
    },
    {
      question: 'A student wants to separate a mixture of camphor (sublimable) and sand (non-sublimable). Which technique is most appropriate and why?',
      options: [
        'Distillation, because camphor has a defined boiling point',
        'Sublimation, because camphor converts to vapour and leaves behind the non-sublimable sand',
        'Crystallisation, because camphor is soluble in hot ethanol',
        'Differential extraction, because camphor dissolves in ether but sand does not',
      ],
      correct_index: 1,
      explanation: 'Sublimation is ideal here because camphor converts directly to vapour on gentle heating, leaving the non-volatile sand behind. The vapour is then deposited as pure camphor crystals on the cooler inverted funnel. Crystallisation and extraction would also work but require solvents, while sublimation is solvent-free and simpler.',
    },
    {
      question: 'A student heats camphor for sublimation and notices that deposits on the lower rim of the funnel — closest to the heat source — begin to melt. A classmate says "the funnel is too far from the china dish; bring it closer." Is this advice correct, and what is the actual problem?',
      options: [
        'The classmate is correct; moving the funnel closer concentrates the vapour and speeds up deposition',
        'The advice is incorrect; the problem is that heating is too vigorous — camphor vapour is reaching parts of the funnel that are still above its melting point. Reducing the flame will allow vapour to condense as solid higher up on the cooler funnel',
        'The problem is that the sand is also subliming and mixing with camphor deposits',
        'The classmate is correct; more distance from the flame reduces the temperature gradient needed for condensation',
      ],
      correct_index: 1,
      explanation: 'When heating is too strong, camphor vapour reaches the funnel at a rate faster than it can cool. Near the hot rim, the funnel surface may still be above camphor\'s melting point (~175 °C), causing deposited camphor to melt rather than solidify. The fix is to reduce the flame — not to move the funnel. In lab setups, cotton wool plugged in the funnel stem or ice placed on top of the funnel helps create the necessary temperature gradient.',
    },
  ],
};

// ── Page 7 expanded fun_fact markdown ─────────────────────────────────────────
const PAGE7_FUNFACT_MD = `A forensic analyst runs a TLC plate on ink recovered from a suspected forged document. To the naked eye, the ink matches the original perfectly. Under UV light on the developed plate, the original shows one spot — but the suspected forgery shows three. One extra dye component matches a synthetic compound not manufactured until 1998. The document is allegedly dated 1979. The forgery is proven without a confession.

In another lab, gas chromatography detects a single pesticide molecule among one billion water molecules in a fruit sample — below any health threshold, but still measurable. At a crime scene, unknown white powder is identified not by colour or smell but by its chromatographic fingerprint: the pattern of retention times is as unique as a barcode.

Chromatography is now used in **anti-doping tests** (WADA screens for hundreds of prohibited substances in a single urine sample), **airport security** (trace explosive detectors analyse swabs chromatographically in seconds), and **food authentication** (the olive oil in your bottle can be fingerprinted to confirm its geographic origin).

Mikhail Tswett invented the technique in 1903 to separate plant pigments. The same principle — differential migration based on affinity for stationary vs. mobile phase — now catches forgers, dopers, and poisoners. **Chromatography** is arguably the single most powerful analytical tool ever developed.`;

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const col = db.collection('book_pages');

  console.log('=== Chapter 12 Page Upgrade Script ===\n');

  // 1. Page 1 — add inline_quiz
  {
    const page = await col.findOne({ _id: PAGE_IDS.p1 });
    if (!page) { console.error('Page 1 not found'); process.exit(1); }
    const already = page.blocks.some(b => b.type === 'inline_quiz');
    if (already) {
      console.log('Page 1: inline_quiz already exists — skipping');
    } else {
      const newBlocks = [...page.blocks, PAGE1_QUIZ];
      await col.updateOne({ _id: PAGE_IDS.p1 }, { $set: { blocks: newBlocks, updated_at: new Date() } });
      console.log('Page 1: added inline_quiz ✓');
    }
  }

  // 2. Page 7 — expand fun_fact
  {
    const page = await col.findOne({ _id: PAGE_IDS.p7 });
    if (!page) { console.error('Page 7 not found'); process.exit(1); }
    const ffIdx = page.blocks.findIndex(b => b.type === 'callout' && b.variant === 'fun_fact');
    if (ffIdx === -1) { console.error('Page 7 fun_fact not found'); }
    else {
      page.blocks[ffIdx].markdown = PAGE7_FUNFACT_MD;
      await col.updateOne({ _id: PAGE_IDS.p7 }, { $set: { blocks: page.blocks, updated_at: new Date() } });
      console.log('Page 7: fun_fact expanded ✓');
    }
  }

  // 3. Add one reasoning question to each quiz on pages 2–12
  const pagesToUpdate = [
    { key: 'p2',  label: 'Page 2  (Crystallisation)' },
    { key: 'p3',  label: 'Page 3  (Distillation)' },
    { key: 'p4',  label: 'Page 4  (Fractional Distillation)' },
    { key: 'p5',  label: 'Page 5  (Special Distillation)' },
    { key: 'p6',  label: 'Page 6  (Differential Extraction)' },
    { key: 'p7',  label: 'Page 7  (Chromatography)' },
    { key: 'p8',  label: 'Page 8  (Qualitative Analysis)' },
    { key: 'p9',  label: 'Page 9  (Estimation C & H)' },
    { key: 'p10', label: 'Page 10 (Estimation N)' },
    { key: 'p11', label: 'Page 11 (Estimation Halogens & S)' },
    { key: 'p12', label: 'Page 12 (Estimation P & O)' },
  ];

  for (const { key, label } of pagesToUpdate) {
    const pageId = PAGE_IDS[key];
    const quizId = QUIZ_IDS[key];
    const newQ   = REASONING_QS[key];

    const page = await col.findOne({ _id: pageId });
    if (!page) { console.error(`${label}: not found`); continue; }

    const quizIdx = page.blocks.findIndex(b => b.id === quizId);
    if (quizIdx === -1) { console.error(`${label}: quiz block not found`); continue; }

    const quiz = page.blocks[quizIdx];
    // Check if reasoning question already added (idempotency)
    const alreadyAdded = quiz.questions.some(q => q.question === newQ.question);
    if (alreadyAdded) {
      console.log(`${label}: reasoning question already present — skipping`);
      continue;
    }

    quiz.questions.push(newQ);

    // Update pass_threshold: with more questions, 1 wrong out of n+1 → 67% works
    // Keep existing threshold (already set appropriately)

    await col.updateOne(
      { _id: pageId },
      { $set: { blocks: page.blocks, updated_at: new Date() } }
    );
    console.log(`${label}: reasoning question added ✓`);
  }

  await client.close();
  console.log('\nDone.');
}

run().catch(err => { console.error(err); process.exit(1); });
