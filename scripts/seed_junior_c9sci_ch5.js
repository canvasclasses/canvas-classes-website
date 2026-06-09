// Pilot seed — Class 9 Science Ch 5 (Mixtures & Separation) junior questions,
// mined from IIT Foundation Chemistry Class 8 Ch 2 (Concept Application L1/L2)
// and REWRITTEN toward conceptual/reasoning per the agreed rubric (rote facts
// converted to "why / which-and-why / predict"; teaching-voice explanations).
//
// Writes to the junior_questions collection. Idempotent: skips any question
// whose exact text already exists. Run: node scripts/seed_junior_c9sci_ch5.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const COMMON = {
  grade: 9, subject: 'science', book_slug: 'class9-science',
  chapter_number: 5, chapter_slug: 'mixtures-and-separation',
  source: 'IIT_Foundation_Cl8', status: 'published',
};

// Each: stem, opts (correct first — we shuffle ids a–d below), why, tag, diff, topic.
const RAW = [
  {
    topic: 'pure-vs-mixture', tag: 'reasoning', diff: 1,
    stem: 'Duralumin, magnalium and bell metal are all made by melting two or more metals together. Magnesium is not. Which of the four is a **pure substance**, and what makes it different?',
    correct: 'Magnesium — it is an element, made of only one kind of atom, while the other three are alloys (mixtures).',
    wrong: [
      'Bell metal — it looks uniform, so it must be pure.',
      'Duralumin — it is a single solid, so it cannot be a mixture.',
      'Magnalium — alloys are compounds, so they count as pure.',
    ],
    why: 'A pure substance is made of just one kind of particle. Magnesium is an element — only Mg atoms. Duralumin, magnalium and bell metal are alloys: metals physically mixed in varying proportions, so they are mixtures, not pure substances.',
  },
  {
    topic: 'homo-vs-hetero', tag: 'concept', diff: 1,
    stem: 'In which of these would you still be able to point to the separate ingredients — i.e. which is a **heterogeneous** mixture?',
    correct: 'Gunpowder — a mix of solid grains you can tell apart.',
    wrong: [
      'Brine (salt dissolved in water).',
      'Liquor ammonia (ammonia gas dissolved in water).',
      'Duralumin (an alloy).',
    ],
    why: 'A heterogeneous mixture is not uniform throughout — the parts stay distinguishable. Gunpowder is a blend of separate solid grains. Brine, liquor ammonia and duralumin are uniform (homogeneous): the components are mixed at the particle level and look the same everywhere.',
  },
  {
    topic: 'compound-vs-mixture', tag: 'reasoning', diff: 2,
    stem: 'Three of these can be separated into simpler parts by **physical** methods. One cannot, because its parts are chemically joined. Which one is **not** a mixture?',
    correct: 'Molten sodium chloride — it is a compound (Na and Cl chemically bonded).',
    wrong: [
      'Sodium chloride solution.',
      'Brass.',
      'Bronze.',
    ],
    why: 'Salt solution, brass and bronze are mixtures — their components keep their own identity and can be separated physically (evaporation, etc.). Molten sodium chloride is a single compound; its sodium and chlorine are chemically combined and can only be separated by a chemical change.',
  },
  {
    topic: 'sublimation', tag: 'application', diff: 1,
    stem: 'A mixture of ammonium chloride and sand needs to be separated. Ammonium chloride turns straight from solid to vapour on heating; sand does not. Which technique does this make possible?',
    correct: 'Sublimation — gently heat so the ammonium chloride vapourises and re-deposits, leaving sand behind.',
    wrong: [
      'Filtration — pour through filter paper to catch the sand.',
      'Distillation — boil off the ammonium chloride as a liquid.',
      'Magnetic separation — pull out the ammonium chloride with a magnet.',
    ],
    why: 'Sublimation is used when one component changes directly from solid to gas. Heating the mixture turns ammonium chloride into vapour, which re-solidifies on a cool surface, while the sand stays put. Filtration only works for an insoluble solid in a liquid, and neither part here is magnetic.',
  },
  {
    topic: 'immiscible-liquids', tag: 'application', diff: 1,
    stem: 'You need to separate a mixture of oil and water. They do not dissolve in each other and settle into two layers. Which apparatus is designed for exactly this, and why does it work?',
    correct: 'A separating funnel — the denser water sinks below the oil, so you can run the lower layer off first.',
    wrong: [
      'A filter funnel — the paper traps the oil and lets water through.',
      'A distillation flask — boiling separates them by colour.',
      'A magnet — oil and water differ in magnetism.',
    ],
    why: 'A separating funnel exploits the density difference between two immiscible liquids. They form clear layers; opening the tap drains the heavier lower layer (water) first, leaving the oil. Filtration cannot split two liquids, and density — not colour or magnetism — is the property being used.',
  },
  {
    topic: 'fractional-crystallisation', tag: 'reasoning', diff: 2,
    stem: 'Potassium nitrate and common salt are both dissolved in the same water. Their solubilities change differently as the solution cools. Which method best separates the two solids, and on what property does it rely?',
    correct: 'Fractional crystallisation — on cooling, the less-soluble salt crystallises out at a different stage from the more-soluble nitre.',
    wrong: [
      'Filtration — the two solids have different particle sizes.',
      'Sublimation — one of the salts turns directly to gas.',
      'Using a separating funnel — the salts form two liquid layers.',
    ],
    why: 'When two soluble solids are in one solvent, they can be told apart by how their solubility falls as the solution cools — the one that becomes saturated first crystallises out first. That is fractional crystallisation. Both salts are soluble (so filtration fails), neither sublimes, and a separating funnel is only for immiscible liquids.',
  },
  {
    topic: 'fractional-distillation', tag: 'reasoning', diff: 2,
    stem: 'Acetone (boils ~56 °C) and water (boils 100 °C) are mixed and must be separated by fractional distillation. Which step happens **first** when the flask is heated slowly, and why?',
    correct: 'Acetone vapourises first, because it is more volatile (lower boiling point) than water.',
    wrong: [
      'Water vapourises first, because there is more of it.',
      'Both vapourise together and condense as the original mixture.',
      'Water remains as vapour while acetone stays liquid.',
    ],
    why: 'In fractional distillation the component with the lower boiling point leaves as vapour first. Acetone boils far below water, so on gentle heating it evaporates first, travels up the column, condenses and is collected — while the water stays behind in the flask.',
  },
  {
    topic: 'chromatography', tag: 'concept', diff: 2,
    stem: 'On a chromatography strip, two coloured components of an ink end up at different heights. What does the component that travelled **less** tell you about itself?',
    correct: 'It is held more strongly by the paper (stationary phase), so the solvent carried it less far.',
    wrong: [
      'It is the heavier of the two, so gravity pulled it down.',
      'It dissolved better in the solvent, so it moved slowly.',
      'It has no colour, so it could not move.',
    ],
    why: 'Chromatography separates components by how strongly each sticks to the paper versus how well it travels with the moving solvent. A component that moves less has a greater affinity for the paper, so it is left behind as the solvent climbs. Distance moved reflects this balance, not weight or colour.',
  },
  {
    topic: 'choosing-method', tag: 'application', diff: 2,
    stem: 'You must recover pure salt from salt dissolved in water, with the salt left over at the end. Which method fits, and why not simple filtration?',
    correct: 'Evaporation — heat the solution so water escapes as vapour and solid salt is left behind.',
    wrong: [
      'Filtration — the filter paper will trap the dissolved salt.',
      'A separating funnel — salt and water form two layers.',
      'Sublimation — the salt turns straight into gas.',
    ],
    why: 'Salt is dissolved, so its particles pass straight through filter paper — filtration only stops an undissolved solid. Evaporation removes the water and leaves the salt as a solid. Salt water is a single uniform liquid (no layers for a funnel), and salt does not sublime.',
  },
  {
    topic: 'mixture-definition', tag: 'recall', diff: 1,
    stem: 'Why can the parts of a mixture usually be separated by **physical** methods, while the parts of a compound cannot?',
    correct: 'In a mixture the substances are only physically together and keep their own properties; in a compound the elements are chemically bonded.',
    wrong: [
      'A mixture always contains a metal, which is easy to remove.',
      'A compound is always a gas, so it escapes on its own.',
      'Mixtures are always heavier than compounds.',
    ],
    why: 'Making a mixture involves no chemical change — the components retain their identities and can be coaxed apart by physical means (filtering, evaporating, distilling). In a compound the elements are joined by chemical bonds, so only a chemical reaction can separate them.',
  },
];

function buildOptions(item) {
  // correct first, then wrongs; place correct at a varied index by topic length
  const all = [{ text: item.correct, is_correct: true }, ...item.wrong.map((t) => ({ text: t, is_correct: false }))];
  const pos = item.topic.length % all.length;       // deterministic spread of the answer slot
  const [correct] = all.splice(0, 1);
  all.splice(pos, 0, correct);
  return all.map((o, i) => ({ id: ['a', 'b', 'c', 'd'][i], text: o.text, is_correct: o.is_correct }));
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.collection('junior_questions');

  // next display_id number for this chapter's prefix
  const prefix = 'C9SCI-CH5';
  const existing = await col.find({ display_id: { $regex: `^${prefix}-\\d+$` } }).project({ display_id: 1 }).toArray();
  let max = 0;
  for (const d of existing) { const n = parseInt(d.display_id.slice(prefix.length + 1), 10); if (n > max) max = n; }

  const now = new Date();
  let inserted = 0, skipped = 0;
  for (const item of RAW) {
    const stem = item.stem;
    const dupe = await col.findOne({ book_slug: COMMON.book_slug, chapter_number: 5, 'question_text.markdown': stem });
    if (dupe) { skipped++; continue; }
    max += 1;
    const doc = {
      _id: uuidv4(),
      display_id: `${prefix}-${String(max).padStart(3, '0')}`,
      ...COMMON,
      topic: item.topic,
      format: 'mcq',
      question_text: { markdown: stem, latex_validated: false },
      options: buildOptions(item),
      explanation: { markdown: item.why },
      concept_tag: item.tag,
      difficulty: item.diff,
      flags: [],
      deleted_at: null,
      created_by: 'seed-script', updated_by: 'seed-script',
      created_at: now, updated_at: now,
    };
    await col.insertOne(doc);
    inserted++;
    console.log(`  + ${doc.display_id}  [L${item.diff} ${item.tag}] ${item.topic}`);
  }

  console.log(`\nDone. inserted=${inserted} skipped(existing)=${skipped} total_now=${await col.countDocuments({ book_slug: COMMON.book_slug, chapter_number: 5, deleted_at: null })}`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
