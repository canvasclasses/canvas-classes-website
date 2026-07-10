'use strict';
/**
 * Post-build QUALITY PASS for Ch.11 inline quizzes: kill length-tells (correct
 * option being ≥15% longer than the longest distractor) by enriching distractors
 * or trimming the correct option — every replacement stays a real misconception.
 * Idempotent: matches a question by its current question text, replaces options +
 * correct_index. Re-run after any build_p*.js re-run. Run: node scripts/science-ch11/fix_quiz_lengths.js [--dry]
 */
const { withBook, savePageBlocks } = require('../science-practice/_lib');
const DRY = process.argv.includes('--dry');

// slug → [ { qStartsWith, options:[...], correct } ]
const FIXES = {
  'pollination': [
    { qStartsWith: 'A wind-pollinated grass makes lakhs', options: [
      'Insects carry pollen straight to the right flower, so very little is wasted',
      'Insect pollen is much heavier and richer, so it forms far more seeds',
      'Insects lay tiny eggs on the flower that later grow into its seeds',
      'Wind-pollinated plants do not really need much of their pollen at all',
    ], correct: 0 },
  ],
  'fertilisation-in-plants': [
    { qStartsWith: 'Pollen lands on the stigma, but the egg', options: [
      'The pollen grows a tube down the style, carrying its gamete to the ovule',
      'Rainwater slowly trickles down and washes the gamete into the ovary',
      'A visiting insect pushes its long tongue down to deliver the gamete',
      'A strong gust of wind blows the gamete down through the open style',
    ], correct: 0 },
    { qStartsWith: 'A flower is pollinated, but soon after', options: [
      'A perfectly normal fruit, packed full of healthy living seeds',
      'The flower quietly shrinks and turns back into a closed bud',
      'A fruit may still form, but it will hold no living seeds',
      'The stigma at the top swells up and becomes a new fruit',
    ], correct: 2 },
  ],
  'seed-dispersal': [
    { qStartsWith: 'Seed dispersal mainly helps a plant by', options: [
      'making its seeds heavier so they stay close to home',
      'spreading its seeds away from the crowded parent plant',
      'stopping its seeds from ever sprouting into new plants',
      'turning its seeds directly into ripe, ready-to-eat fruits',
    ], correct: 1 },
    { qStartsWith: 'A seed is fairly large, has a tough waterproof', options: [
      'By water, because it floats and its shell keeps the inside dry',
      'By wind, because the light shell helps it fly through the air',
      'By sticking with tiny hooks to the fur of passing animals',
      'By being eaten and then carried away by small hungry birds',
    ], correct: 0 },
    { qStartsWith: 'Why might seeds that simply fall and sprout', options: [
      'Seeds near the parent are simply far too heavy to germinate',
      'Seeds far away are still watered and fed by the parent tree',
      'Seeds near the parent crowd together and compete for light and water',
      'Seeds near the parent are always the very first ones to be eaten',
    ], correct: 2 },
  ],
  'male-reproductive-system': [
    { qStartsWith: 'The urethra in males carries both urine', options: [
      'They are released at different times, so the two never mix in the tube',
      'Urine and sperm are really just the very same fluid anyway',
      'The sperm quickly destroy any urine that they happen to meet',
      'The body simply grows a second, separate tube whenever it is needed',
    ], correct: 0 },
  ],
  'fertilisation-in-humans': [
    { qStartsWith: 'In humans, where does fertilisation', options: [
      'In the oviduct (the fallopian tube)',
      'In the ovary, where the egg is made',
      'In the uterus, where the baby grows',
      'In the vagina, the passage to outside',
    ], correct: 0 },
    { qStartsWith: 'After fertilisation, the zygote divides', options: [
      'It cleverly hides the growing zygote away from the mother\'s own body',
      'It completely stops the zygote from dividing any further at all',
      'The thick, blood-rich lining nourishes the developing baby',
      'The uterus lining slowly turns the zygote back into an egg',
    ], correct: 2 },
  ],
  'menstrual-cycle': [
    { qStartsWith: 'Menstruation is the shedding of the', options: [
      'mature egg that was released that month from the ovary',
      'thickened lining of the uterus, along with some blood',
      'worn-out outer layer lining the wall of the vagina',
      'leftover unused sperm cells from the male partner',
    ], correct: 1 },
  ],
  'birth-control-methods': [
    { qStartsWith: 'A couple uses oral pills, which prevent', options: [
      'The pills may suddenly and unexpectedly cause a pregnancy instead',
      'The pills somehow make infections spread between people much faster',
      'Pills prevent pregnancy but do not stop infections spreading',
      'There is honestly no real risk at all left in this situation',
    ], correct: 2 },
  ],
  'assisted-reproductive-technologies': [
    { qStartsWith: 'In IVF (in-vitro fertilisation), the egg and sperm', options: [
      'Deep inside the mother\'s uterus, where a baby grows',
      'Inside the oviduct, also called the fallopian tube',
      'Outside the body, joined together in a lab dish',
      'Inside one of the mother\'s two egg-making ovaries',
    ], correct: 2 },
  ],
  'india-contribution-human-anatomy': [
    { qStartsWith: 'Why are ASHA workers especially valuable', options: [
      'They build large new hospitals in every single village across India',
      'They are trained local women who carry health care to far-off rural homes',
      'They completely take the place of trained, qualified doctors',
      'They work only in the big cities and never out in the villages',
    ], correct: 1 },
  ],
  'frontier-heavy-metals-fertility': [
    { qStartsWith: 'When an Amoeba divides into two identical', options: [
      'The parent lives on as the two copies, leaving nothing behind to die',
      'Because an Amoeba is, in fact, completely unable to ever reproduce',
      'Because the parent always grows very old and frail before it splits',
      'Because the two new Amoebae quickly merge back together into one',
    ], correct: 0 },
  ],
};

(async () => {
  await withBook(async ({ pages, allPages }) => {
    const ch = allPages.filter((p) => p.chapter_number === 11);
    let changed = 0;
    for (const p of ch) {
      const fixes = FIXES[p.slug];
      if (!fixes) continue;
      let dirty = false;
      const blocks = p.blocks.map((b) => {
        if (b.type !== 'inline_quiz') return b;
        const questions = b.questions.map((qq) => {
          const fx = fixes.find((f) => qq.question.startsWith(f.qStartsWith));
          if (!fx) return qq;
          dirty = true; changed++;
          return { ...qq, options: fx.options, correct_index: fx.correct };
        });
        return { ...b, questions };
      });
      if (dirty && !DRY) await savePageBlocks(pages, p._id, blocks);
      if (dirty) console.log(`${DRY ? '[dry] ' : '✅ '}${p.slug} — patched`);
    }
    console.log(`\n${changed} questions ${DRY ? 'would be' : ''} fixed.`);
  });
})();
