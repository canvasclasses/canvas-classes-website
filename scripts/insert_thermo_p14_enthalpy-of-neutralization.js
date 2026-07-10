'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Page 14.
 * "Enthalpy of Neutralization" — why every strong-acid + strong-base mix releases
 * the SAME heat (~-57.1 kJ/mol of water), and how the shortfall for a weak species
 * measures its dissociation enthalpy. Spectator-ion idea via the cricket-audience analogy.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (exemplar 21, analogy bank C-spectator).
 * Reference-first: Mittal §24.13.
 * published:false. SIGNATURE page. Run: node scripts/insert_thermo_p14_enthalpy-of-neutralization.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 14;
const NEW_SLUG = 'enthalpy-of-neutralization';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5, full)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Three different acid-and-base beakers pouring into a shared central flask that glows with the same identical warmth',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Three different glass beakers along the top, each a different labelled-looking acid being poured down into one shared beaker of base in the centre. Despite the three different sources, the central mixing beaker glows with one identical warm orange-amber heat, soft heat-haze rising from it. The visual idea: different chemicals in, the very same heat out. Deep near-black background (#0a0a0a), warm orange and amber glow from the central flask, cool dim blue glass for the surrounding beakers, gentle volumetric heat shimmer. Clean cinematic scientific-illustration style. No text, no labels, no numbers.' },

    // 1 — hook (fun_fact)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Different Chemicals, Identical Heat',
      markdown: "Mix hydrochloric acid with sodium hydroxide. Now mix nitric acid with potassium hydroxide. Now sulphuric acid with sodium hydroxide. Three different pairs of chemicals — yet each one releases almost exactly the same heat, about $ -57.1 $ kJ for every mole of water formed.\n\nDifferent acids, different bases, same number on the thermometer every time. Why should that be?" },

    // 2 — core text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When an acid and a base react, they cancel each other out and release heat. The **enthalpy of neutralization** is the heat released when one gram-equivalent of an acid is neutralised by one gram-equivalent of a base in dilute solution.\n\n" +
      "For any **strong acid with any strong base**, that number is always about $ -57.1 $ kJ per mole of water ($ \\approx -13.7 $ kcal). Change the acid, change the base — the heat barely moves. That fixed value is the clue. It tells you that the chemicals you wrote on paper are not the ones actually doing the reacting." },

    // 3 — heading 1 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Strong Plus Strong Is Always Minus 57.1 kJ',
      objective: 'Explain why the enthalpy of neutralization for every strong-acid + strong-base pair lands on the same value.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A strong acid in water is already fully split into ions. So is a strong base. Hydrochloric acid is not really $ \\ce{HCl} $ sitting in the beaker — it is $ \\ce{H+} $ and $ \\ce{Cl-} $ floating apart. Sodium hydroxide is $ \\ce{Na+} $ and $ \\ce{OH-} $.\n\n" +
      "So when you pour them together, the only thing that *changes* is that $ \\ce{H+} $ finds $ \\ce{OH-} $ and they lock into water:\n\n" +
      "$ \\ce{H+(aq) + OH-(aq) -> H2O(l)} $\n\n" +
      "The $ \\ce{Na+} $ and the $ \\ce{Cl-} $ were free ions before, and they are still free ions after. Whichever strong acid and strong base you pick, this same single reaction is the one releasing the heat — so the heat comes out the same every time." },

    // 4 — image (two_third, 16:9)
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A beaker of free ions where only an H-plus and an OH-minus join to form water while the sodium and chloride ions stay apart and unchanged',
      caption: '📸 Only $\\ce{H+}$ and $\\ce{OH-}$ react; the other ions stay free on both sides',
      generation_prompt: 'A clean scientific-illustration diagram on a deep near-black background (#0a0a0a). Inside a single beaker outline, show four kinds of floating ions as labelled glowing spheres: an orange "H+" sphere, a cool-blue "OH-" sphere, a dim grey "Na+" sphere and a dim grey "Cl-" sphere, all initially scattered apart. A bright orange glowing arrow shows ONLY the H+ and OH- merging into one small water droplet "H2O" that radiates warm heat. The Na+ and Cl- spheres are drawn dimmed and unchanged, off to the sides, with a faint label-feel of "spectators / unchanged". Orange/amber for the reacting pair and the heat, muted grey-blue for the spectator ions. Minimal clean white labels (H+, OH-, H2O, Na+, Cl- only). No extra text.' },

    // 5 — mid-page reasoning_prompt
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Acetic acid is a weak acid. When it is neutralised by sodium hydroxide, it releases LESS heat than hydrochloric acid does with the same base. Both end up making water — so why is the heat smaller for the weak acid?",
      options: [
        "The weak acid forms a different, weaker kind of water that stores less heat",
        "Some of the released energy is first spent splitting the weak acid into ions before $ \\ce{H+} $ can react, so less heat is left over",
        "Sodium hydroxide reacts more slowly with a weak acid, so heat leaks away before it is measured",
        "The spectator ions of a weak acid absorb part of the heat as they move"
      ],
      correct_index: 1,
      reveal: "A strong acid arrives already split into ions, so all its heat goes straight into making water. A weak acid like acetic acid is mostly *un*split — before its $ \\ce{H+} $ can meet $ \\ce{OH-} $, the molecule must first break apart into ions, and that breaking step *absorbs* energy. That borrowed energy is paid out of the heat the reaction would otherwise release, so the measured value sits below $ 57.1 $ kJ. There is nothing special about the water, and spectator ions take no part at all — the shortfall is the cost of dissociating the weak acid." },

    // 6 — heading 2 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Spectator Ions Take No Part',
      objective: 'Use the spectator-ion idea to see why ions that do not react cannot change the heat released.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Think of a cricket match. You are sitting in the stands watching. Does your being there — or not being there — decide who wins or loses the match? No. The result is settled out on the pitch, by the players, not by the crowd.\n\n" +
      "The $ \\ce{Na+} $ and $ \\ce{Cl-} $ ions are the crowd. They sit in the solution and watch. The reaction — and the heat it gives out — is settled entirely by the two players on the pitch: $ \\ce{H+} $ and $ \\ce{OH-} $. We call the watching ions **spectator ions**, and because they never join the reaction, swapping one crowd for another cannot change the heat. That is the whole reason every strong-strong pair gives the same value." },

    // 7 — heading 3 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Weak Acids and Bases Release Less',
      objective: 'Read a below-57.1 kJ neutralization value as a sign of a weak acid or base, and turn the gap into its dissociation enthalpy.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A **weak acid** (or weak base) is one that is only partly split into ions in water. Before its $ \\ce{H+} $ can react with $ \\ce{OH-} $, the rest of it has to dissociate first — and dissociation soaks up energy. So part of the heat the neutralization would release is quietly spent on that splitting, and a smaller heat reaches your thermometer.\n\n" +
      "This gives you a neat measuring stick. The further a value falls below $ 57.1 $ kJ, the more energy was needed to dissociate the species, and so the **weaker** the acid or base. The size of the shortfall *is* the enthalpy of dissociation of the weak species." },

    // 8 — worked_example (solved_example, tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Find the Dissociation Enthalpy',
      problem: "The enthalpy of neutralization of a weak acid by a strong base is $ -51.0 $ kJ/mol. A strong-acid + strong-base pair gives $ -57.1 $ kJ/mol. Find the enthalpy of dissociation of the weak acid.",
      solution: "**Picture what is different.** A strong acid arrives already split into ions, so all of its $ 57.1 $ kJ goes into making water.\n\n" +
        "**The weak acid must first ionise.** Before its $ \\ce{H+} $ can react, the molecule has to break into ions — and that step *absorbs* energy, so less heat comes out.\n\n" +
        "**The missing heat is the cost of that splitting.** Whatever the weak acid failed to deliver is exactly the energy it borrowed to dissociate.\n\n" +
        "Dissociation enthalpy $ = 57.1 - 51.0 = +6.1 $ kJ/mol\n\n" +
        "**Read the sign.** It is positive — energy is absorbed to pull the weak acid apart, just as expected.\n\n" +
        "**Answer:** the enthalpy of dissociation of the weak acid is $ +6.1 $ kJ/mol. The larger this gap, the weaker the acid." },

    // 9 — callout[remember]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Lock This In',
      markdown: "Strong acid + strong base neutralization is always about $ -57.1 $ kJ/mol, because the only reaction actually happening is $ \\ce{H+ + OH- -> H2O} $. A weak acid or base gives **less** heat, because some energy is first spent dissociating it. The shortfall from $ 57.1 $ kJ equals the dissociation enthalpy of the weak species — and the bigger the shortfall, the weaker it is." },

    // 10 — callout[exam_tip]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Spectator ions never change the heat:** that is why every strong-acid + strong-base pair matches at $ -57.1 $ kJ/mol. Questions love to hide three or four different pairs and ask which releases the most heat — the answer is \"they are all the same.\"\n\n" +
        "**A value below 57.1 kJ is a signal:** it means a weak acid or weak base is involved, and the gap is its dissociation enthalpy. Rank \"weakest\" by \"furthest below 57.1.\"\n\n" +
        "**Neutralization is defined per gram-equivalent, not per mole:** $ \\ce{H2SO4} $ supplies *two* equivalents of $ \\ce{H+} $ per mole. Counting one mole of $ \\ce{H2SO4} $ as a single equivalent is a classic slip — it gives you double the water and the wrong heat." },

    // 11 — inline_quiz (LAST, 3 Qs, 0.67)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Why does every strong-acid + strong-base neutralization release almost the same heat, about $ -57.1 $ kJ per mole of water?',
          options: [
            'Because all strong acids and bases happen to contain the same amount of stored energy',
            'Because the only reaction actually taking place is $ \\ce{H+ + OH- -> H2O} $, no matter which acid and base are used',
            'Because the spectator ions release a fixed amount of heat as they separate',
            'Because dilute solutions always give exactly $ 57.1 $ kJ regardless of what is dissolved'
          ],
          correct_index: 1,
          explanation: 'In every strong-strong pair the acid and base are already fully split into ions, so the one change that releases heat is $ \\ce{H+} $ joining $ \\ce{OH-} $ to form water. The tempting answer about spectator ions releasing heat is wrong — spectator ions take no part in the reaction at all, which is exactly why the heat stays constant.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A weak acid neutralised by a strong base releases noticeably less heat than $ -57.1 $ kJ/mol. What does that shortfall represent?',
          options: [
            'Heat lost to the surroundings because the weak acid reacts slowly',
            'Heat absorbed by the spectator ions of the weak acid',
            'The energy first spent dissociating the weak acid into ions before neutralization',
            'A measurement error, since neutralization is always $ -57.1 $ kJ/mol'
          ],
          correct_index: 2,
          explanation: 'A weak acid is only partly split into ions, so before its $ \\ce{H+} $ can react it must first dissociate, and that step absorbs energy out of the heat that would otherwise be released. The "slow reaction loses heat" option is the tempting trap, but the loss is not about speed — it is the fixed energy cost of breaking the weak acid apart, which equals its dissociation enthalpy.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'One mole of $ \\ce{H2SO4} $ is neutralised by $ \\ce{NaOH} $. Compared with one mole of $ \\ce{HCl} $, how much water-forming neutralization does it drive?',
          options: [
            'Twice as much, because $ \\ce{H2SO4} $ supplies two equivalents of $ \\ce{H+} $ per mole',
            'The same amount, because every acid supplies one equivalent per mole',
            'Half as much, because $ \\ce{H2SO4} $ is a heavier molecule',
            'It cannot be compared, because $ \\ce{H2SO4} $ is a weak acid'
          ],
          correct_index: 0,
          explanation: 'Neutralization is defined per gram-equivalent, and $ \\ce{H2SO4} $ releases two $ \\ce{H+} $ per mole, so one mole drives twice the water formation of one mole of $ \\ce{HCl} $. The "same amount" option is the classic slip — treating one mole of a diprotic acid as a single equivalent, which quietly halves the real answer.' },
      ] },

    // 12 — text bridge
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You have now seen one reaction whose heat you can measure straight off a thermometer. Next, the opposite case: a lattice energy you can never measure directly. We will reach it by stacking known heats together with Hess's law — **the Born–Haber cycle (a quick look)**.*" },
  ];
}

bw.withDb(async (db) => {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error('book not found');

  if (await pages.findOne({ book_id: book._id, slug: NEW_SLUG })) {
    console.log(`⚠  ${NEW_SLUG} already exists — skipping (idempotent).`);
    return;
  }

  const blocks = buildBlocks();
  const newId = uuidv4();
  const now = new Date();
  const doc = {
    _id: newId, book_id: book._id, chapter_number: CH, page_number: PAGE_NUMBER,
    slug: NEW_SLUG, title: 'Enthalpy of Neutralization',
    subtitle: 'Mix any strong acid with any strong base and you always get the very same heat — and the reason tells you who is actually doing the reacting.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'neutralization', 'spectator-ions', 'strong-weak'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 5 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 14 (enthalpy of neutralization)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
