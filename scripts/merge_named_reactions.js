/**
 * Merges the old `organic_name_reaction` chapter into `named_reactions_organic`:
 *   1. Adds 9 new quality cards (ORGNR-049–ORGNR-057) covering reactions unique
 *      to the old chapter and in JEE/NEET scope.
 *   2. Soft-deletes all 34 cards in `organic_name_reaction`.
 *
 * Usage:
 *   node scripts/merge_named_reactions.js           # dry run
 *   node scripts/merge_named_reactions.js --apply
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');

const CHAPTER = {
  id: 'named_reactions_organic',
  name: 'Named Reactions',
  category: 'Organic Chemistry',
};

const T1 = { name: 'Carbonyl Condensation Reactions',   order: 1 };
const T2 = { name: 'Reduction Named Reactions',         order: 2 };
const T3 = { name: 'Halide & Carbon-Skeleton Reactions',order: 3 };
const T4 = { name: 'Amine & Diazonium Reactions',       order: 4 };
const T5 = { name: 'Phenol & Aromatic Named Reactions', order: 5 };

// New cards start at ORGNR-049
const NEW_CARDS = [

  // ── Carbonyl ─────────────────────────────────────────────────────────────
  { t: T1, d: 'hard',
    q: 'Claisen condensation: two molecules of ethyl acetate react with $\\ce{NaOEt}$ to give a β-keto ester. Identify the product and explain why the reaction requires a *stoichiometric* base rather than catalytic.',
    a: '$\\ce{2 CH3COOEt ->}$ (NaOEt) $\\ce{-> CH3COCH2COOEt}$ (ethyl acetoacetate, acetoacetic ester) + EtOH. Stoichiometric base needed: the product β-keto ester (pKₐ ≈ 11) is *more acidic* than the starting ester (pKₐ ≈ 25) — the base is consumed deprotonating the product and only *then* is the equilibrium driven to completion. Catalytic base would be used up. This is the thermodynamic driving force for Claisen: acid–base trapping of the product.' },

  { t: T1, d: 'hard',
    q: 'Haloform reaction: a methyl ketone $\\ce{CH3COR}$ is treated with $\\ce{Cl2/NaOH}$ (or $\\ce{I2/NaOH}$). What are the two organic products, and why does the reaction stop after three halogenations on the *same* carbon?',
    a: 'Products: $\\ce{CHX3}$ (haloform, e.g. $\\ce{CHI3}$ — iodoform, yellow ppt) + $\\ce{RCOONa}$ (carboxylate salt). Mechanism: base enolises the $\\ce{CH3}$ group → halogenation at α-C; each halogen makes the remaining H *more acidic* (EW inductive effect of X) → three rapid halogenations on the *same* carbon (not the other α-C). After $\\ce{CX3}$ forms, $\\ce{OH-}$ attacks the carbonyl → tetrahedral intermediate → $\\ce{CX3-}$ leaves (good leaving group, stable carbanion) → $\\ce{RCOOH + CHX3}$.' },

  // ── Reduction ─────────────────────────────────────────────────────────────
  { t: T2, d: 'medium',
    q: 'Mendius reaction: an alkyl or aryl cyanide $\\ce{RCN}$ is reduced with $\\ce{Na/C2H5OH}$ (sodium and ethanol). What product forms and how does this compare with $\\ce{LiAlH4}$ reduction of $\\ce{RCN}$?',
    a: 'Mendius: $\\ce{RCN + 4[H] ->}$ (Na/EtOH) $\\ce{-> RCH2NH2}$ (primary amine). Both Mendius and $\\ce{LiAlH4}$ give the *same product* (primary amine with one extra $\\ce{CH2}$ carbon compared to the starting acid). Difference: Mendius uses dissolving-metal conditions (electron + proton from Na + EtOH, dissolving-metal reduction). $\\ce{LiAlH4}$ is the modern laboratory route; Mendius is the classical/historical method — rarely used now but appears in NCERT.' },

  { t: T2, d: 'medium',
    q: 'Sabatier–Senderens reaction: an unsaturated hydrocarbon is hydrogenated using $\\ce{H2}$ + Raney Ni (or finely divided Ni) at 200–300 °C. What product forms from (i) an alkene, (ii) an alkyne? Why is Ni at high temperature used rather than Pd–C at RT?',
    a: '(i) Alkene + $\\ce{H2}$/Ni → alkane. (ii) Alkyne + 2$\\ce{H2}$/Ni → alkane. Ni requires *higher temperature* (200–300 °C) because Ni has a higher *activation energy* for surface hydrogenation than Pt or Pd (which work at RT/1 atm). Raney Ni has a large surface area (spongy structure) that partially compensates. Historical importance: Sabatier and Senderens discovered catalytic hydrogenation over metals in 1897 — Sabatier received the Nobel Prize (1912).' },

  { t: T2, d: 'hard',
    q: 'Beckmann rearrangement: a ketoxime $\\ce{R-C(=NOH)-R\'}$ is treated with $\\ce{PCl5}$ or conc. $\\ce{H2SO4}$. The product is an amide (not an amine). Identify the product from acetophenone oxime and explain the key migration step.',
    a: 'Acetophenone oxime $\\ce{PhC(=NOH)CH3}$ + acid/PCl₅ → **acetanilide** $\\ce{PhNHCOCH3}$ (N-phenylamide). Mechanism: (i) OH is activated (protonation/PCl₅); (ii) the group *anti* to the leaving group migrates (anti-periplanar 1,2-shift) → nitrilium ion; (iii) water attacks → amide. Key: the group that migrates is *trans* to the leaving OH — this is the *anti-Beckmann* stereospecificity. (E)- and (Z)-oximes give *different* amide products (different R migrates). Scope: JEE Advanced.' },

  // ── Amine & Diazonium ─────────────────────────────────────────────────────
  { t: T4, d: 'medium',
    q: 'Hofmann mustard oil reaction: a primary aliphatic amine $\\ce{RNH2}$ reacts with $\\ce{CS2}$ followed by $\\ce{HgCl2}$ (or heat). What product forms, and how does this test distinguish 1° from 2° amines?',
    a: '$\\ce{RNH2 + CS2 -> RNHCS2H (dithiocarbamic acid) ->}$ (HgCl₂ or Δ) $\\ce{-> R-N=C=S}$ (alkyl isothiocyanate, *mustard oil*, pungent smell). Mechanism: CS₂ inserts into N–H; dehydration gives isothiocyanate. *Specific to 1° amines*: 2° amines ($\\ce{R2NH}$) form dithiocarbamate salts that do *not* eliminate to give isothiocyanate (need two N–H for elimination, but 2° amines have only one N–H and get stuck at the dithiocarbamate). Positive result = unmistakable pungent odour of isothiocyanate.' },

  { t: T4, d: 'medium',
    q: 'Liebermann nitroso reaction: a secondary amine $\\ce{R2NH}$ reacts with $\\ce{NaNO2/HCl}$. What product forms, and what colour change distinguishes this from a primary amine\'s reaction?',
    a: '$\\ce{R2NH + NaNO2/HCl -> R2N-N=O}$ (N-nitrosoamine, pale yellow oil with characteristic smell). With phenol/H₂SO₄ heating: green → blue on dilution with water (Liebermann test positive for secondary amine). Compare: 1° amine + NaNO₂/HCl → diazonium salt (not nitrosamine); 3° amine → no reaction with NaNO₂ under normal conditions. N-Nitrosamines are carcinogenic — their formation is a toxicological concern in food preservation.' },

  { t: T4, d: 'medium',
    q: 'Schotten–Baumann reaction: phenol (or aniline) is acylated with benzoyl chloride $\\ce{C6H5COCl}$ in aqueous $\\ce{NaOH}$. Why is $\\ce{NaOH}$ essential, and what product forms from aniline?',
    a: '$\\ce{PhNH2 + C6H5COCl ->}$ (aq. NaOH) $\\ce{-> PhNH-CO-C6H5 + HCl}$ (benzanilide, an amide). $\\ce{NaOH}$ is essential: it (i) neutralises HCl as it forms, preventing protonation of the amine (which would make $\\ce{PhNH3+}$ — a poor nucleophile), and (ii) provides a slightly basic aqueous environment. The reaction is done in a *biphasic* system (aq. NaOH + organic solvent): the amine attacks from the organic phase, HCl is neutralised by NaOH in the aqueous phase — this is the classic "interfacial acylation" method.' },

  // ── Halide / C-skeleton ───────────────────────────────────────────────────
  { t: T3, d: 'medium',
    q: 'Ullmann reaction: two equivalents of iodobenzene are heated with Cu powder to give biphenyl $\\ce{C6H5-C6H5}$. How does this differ from Fitting reaction, and why is *iodobenzene* used rather than chlorobenzene?',
    a: 'Both Ullmann and Fitting give biaryls (Ar–Ar coupling). Fitting (and Wurtz–Fitting): uses Na metal, dry ether, RT. Ullmann: uses Cu powder at *high temperature* (200–300 °C), no solvent. Iodobenzene preferred: the C–I bond is weaker (easier oxidative addition to Cu surface). Chlorobenzene requires much higher temperatures with Cu. Ullmann is more reliable for aryl coupling than Fitting, which uses harsh alkali metal. (Modern replacement: Pd-catalysed Suzuki/Heck coupling — not in JEE main scope.)' },

];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  // ── 1. New cards ──────────────────────────────────────────────────────────
  const startIdx = 49; // ORGNR-049
  const newIds = NEW_CARDS.map((_, i) => `ORGNR-${String(startIdx + i).padStart(3, '0')}`);
  const clash = await coll.findOne({ flashcard_id: { $in: newIds } });
  if (clash) throw new Error(`ID clash: ${clash.flashcard_id}`);

  const now = new Date();
  const docs = NEW_CARDS.map((c, i) => ({
    _id: uuidv4(),
    flashcard_id: newIds[i],
    chapter: CHAPTER,
    topic: { name: c.t.name, order: c.t.order },
    question: c.q,
    answer: c.a,
    metadata: {
      difficulty: c.d,
      tags: [c.t.name, CHAPTER.name],
      source: 'Canvas Chemistry',
      class_num: 12,
      created_at: now,
      updated_at: now,
    },
    deleted_at: null,
  }));

  // ── 2. Old cards to soft-delete ───────────────────────────────────────────
  const oldCards = await coll.find(
    { 'chapter.id': 'organic_name_reaction', deleted_at: null },
    { projection: { _id: 1, flashcard_id: 1 } }
  ).toArray();

  console.log(`\nNew cards to insert: ${docs.length}`);
  docs.forEach(d => console.log(`  + [${d.flashcard_id}] ${d.topic.name}: ${d.question.slice(0, 80)}…`));

  console.log(`\nOld cards to soft-delete: ${oldCards.length} from chapter organic_name_reaction`);
  oldCards.forEach(c => console.log(`  - [${c.flashcard_id}]`));

  if (APPLY) {
    // Insert new cards
    const ins = await coll.insertMany(docs, { ordered: false });
    console.log(`\n✅ Inserted ${ins.insertedCount} new cards into named_reactions_organic.`);

    // Soft-delete old cards
    const del = await coll.updateMany(
      { 'chapter.id': 'organic_name_reaction', deleted_at: null },
      { $set: { deleted_at: now, 'metadata.updated_at': now } }
    );
    console.log(`✅ Soft-deleted ${del.modifiedCount} cards from organic_name_reaction.`);
  } else {
    console.log('\n(dry run — pass --apply to execute)');
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
