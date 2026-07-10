'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc (Second Law), Page 20.
 * "Gibbs Free Energy & Spontaneity" — SIGNATURE page. The single number that
 * settles the heat-vs-disorder argument: G = H - TS, and at constant T,P,
 * the sign of ΔG = ΔH - TΔS decides spontaneity. The four sign cases and the
 * crossover temperature T = ΔH/ΔS.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md
 *   (tug of war; mummy-papa four cases; unavailable energy TΔS).
 * Reference-first: Mittal §25.7.1–6.
 * published:false. Run: node scripts/insert_thermo_p20_gibbs-free-energy.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 20;
const NEW_SLUG = 'gibbs-free-energy';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A glowing tug-of-war rope: on one side a falling drop of heat labelled with energy, on the other a spreading cloud of scattered particles, with a temperature dial at the centre deciding the winner',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A glowing tug-of-war rope stretched horizontally across the frame. On the LEFT, the rope is pulled by a stream of falling warm light, like heat being released, drawn in warm orange and amber. On the RIGHT, the rope is pulled by an expanding cloud of scattered glowing particles spreading apart, suggesting disorder spreading out, in cooler amber-gold sparks. At the EXACT centre of the rope sits a single round temperature dial or gauge, glowing, acting as the pivot that decides which side wins. The two pulls are balanced and opposite. Deep near-black background (#0a0a0a). Warm orange and amber glow only, no other colours, volumetric light, clean cinematic scientific-illustration style. No text, no numbers, no labels.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Two Urges, One Referee',
      markdown: "A reaction can be pushed forward by giving out heat, or by spreading itself out into more disorder. Most of the time these two urges agree and the reaction simply happens. But sometimes they pull in opposite directions — and then whether the reaction goes at all flips depending on the temperature. There is one single quantity that listens to both urges and settles the argument every single time." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "You already know two things a reaction \"wants\". It wants to **release energy** — lower enthalpy, a negative $ \\Delta H $. And it wants to **spread out** — higher entropy, a positive $ \\Delta S $. The trouble is that these two wants are often at war.\n\n" +
      "Think of someone who wants the simple, quiet life and *also* wants to earn crores. Those are contradictory pulls. They cannot both win outright, so somewhere the two strike a compromise — and which one ends up in the driving seat depends on the conditions. In a reaction, the condition that decides is the **temperature**.\n\n" +
      "To settle this tug of war with one number, we combine both wants into a single quantity called the **Gibbs free energy**, written $ G = H - TS $. At constant temperature and pressure — the everyday lab condition — the change is\n\n" +
      "$ \\Delta G = \\Delta H - T\\Delta S $\n\n" +
      "and that one number tells you, for good, whether the reaction will run on its own." },

    // 3 — heading 1 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Tug of War Between Heat and Disorder',
      objective: 'See how the energy term and the disorder term pull against each other, and why temperature is the referee that decides which one wins.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Look at the two pieces of $ \\Delta G = \\Delta H - T\\Delta S $ as two players on the rope.\n\n" +
      "The $ \\Delta H $ piece is the **heat-releasing** pull. A reaction that gives out heat has a negative $ \\Delta H $, which pulls $ \\Delta G $ down — towards \"yes, go.\"\n\n" +
      "The $ -T\\Delta S $ piece is the **spreading-out** pull. A reaction that raises disorder has a positive $ \\Delta S $, and with the minus sign in front, the $ -T\\Delta S $ term is negative — it *also* pulls $ \\Delta G $ down towards \"yes, go.\"\n\n" +
      "Now notice the $ T $ sitting on the disorder pull. When the temperature is low, $ T\\Delta S $ is small, so the disorder pull is weak and the heat pull dominates. When the temperature is high, $ T\\Delta S $ grows large and the disorder pull takes over. **Temperature decides who sits in the driving seat.** That is the whole game on this page." },

    // 4 — image: tug of war / balance with temperature deciding
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A balance beam: enthalpy term on one pan, the T times entropy term on the other, with a temperature slider underneath that tips the balance',
      caption: '📸 Enthalpy pulls one way, T·ΔS pulls the other — temperature tips the balance',
      generation_prompt: 'A clean balance-beam diagram on a deep near-black background (#0a0a0a). A horizontal balance beam pivoting on a central fulcrum. On the LEFT pan, a glowing block representing the enthalpy term (delta H), shown as falling warm light / released heat. On the RIGHT pan, a glowing block representing the T times delta S term, shown as scattered spreading particles. Beneath the fulcrum runs a horizontal slider track marked from cool (left) to hot (right) with a glowing slider knob; a leader line shows that as the slider moves toward hot, the right pan sinks and the balance tips. White minimal labels only: enthalpy term on the left pan, T·entropy term on the right pan, and Temperature along the slider. Orange and amber accents, thin white leader lines, clean technical scientific-illustration style. No stray text, no formulas written out.' },

    // 5 — mid-page reasoning_prompt
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "A reaction soaks up heat from its surroundings, so it is endothermic with $ \\Delta H > 0 $. But it also raises the disorder of the system, so $ \\Delta S > 0 $. Under what condition will this reaction become spontaneous?",
      options: [
        "Never — an endothermic reaction can never be spontaneous",
        "Only at low temperature, where the $ T\\Delta S $ term is small",
        "Only at high temperature, where $ T\\Delta S $ grows large enough to outweigh $ \\Delta H $",
        "At every temperature, because a positive $ \\Delta S $ alone guarantees it"
      ],
      correct_index: 2,
      reveal: "Here the heat pull is *against* the reaction (positive $ \\Delta H $ pushes $ \\Delta G $ up), so the only ally is disorder. The disorder pull is $ -T\\Delta S $, and it only becomes strong when $ T $ is large. Raise the temperature far enough and $ T\\Delta S $ grows big enough to overpower $ \\Delta H $, making $ \\Delta G < 0 $. So the answer is high temperature — not \"never\" (disorder can rescue it) and not \"low\" (that is exactly where it stays stuck)." },

    // 6 — heading 2 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'One Number Decides Spontaneity',
      objective: 'Read the sign of the Gibbs free energy change and know immediately whether a reaction runs, stalls, or sits at equilibrium.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Once you have $ \\Delta G = \\Delta H - T\\Delta S $ as a single number, the verdict is simply its **sign**:\n\n" +
      "- $ \\Delta G < 0 $ — the reaction is **spontaneous**; it runs forward on its own.\n" +
      "- $ \\Delta G = 0 $ — the reaction sits at **equilibrium**; forward and backward are perfectly balanced.\n" +
      "- $ \\Delta G > 0 $ — the reaction is **non-spontaneous**; it will not go forward by itself (the reverse direction is the spontaneous one).\n\n" +
      "There is a second, more physical way to read this same $ \\Delta G $. Picture the energy in your body after a meal: a part of it is locked away just to keep you alive and can never be spent on work, while the rest is yours to spend. In a reaction, $ \\Delta G $ is the **spendable part** — the maximum useful (non-expansion) work you can actually extract — and the $ T\\Delta S $ term is the part **locked away**, unavailable for work. That is exactly why $ G $ is called *free* energy: it is the free, spendable portion." },

    // 7 — heading 3 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Four Cases and the Crossover Temperature',
      objective: 'Decide spontaneity straight from the signs of enthalpy and entropy, and find the exact temperature where the answer flips.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Think of $ \\Delta H $ and $ \\Delta S $ as two parents you need permission from for a trip. Whether you go depends on what each one says:\n\n" +
      "- **Both agree** ($ \\Delta H < 0 $, $ \\Delta S > 0 $): the heat pull and the disorder pull both say go. The trip is always on — **spontaneous at all temperatures.**\n" +
      "- **Both refuse** ($ \\Delta H > 0 $, $ \\Delta S < 0 $): both pulls say no. No matter what you try, it never happens — **never spontaneous.**\n" +
      "- **One agrees, one refuses** ($ \\Delta H < 0 $, $ \\Delta S < 0 $): heat says go, disorder says no. Now you must see whose will prevails — and that is decided by temperature. The heat pull wins only when $ T $ is small, so this is **spontaneous only at low temperature.**\n" +
      "- **One refuses, one agrees** ($ \\Delta H > 0 $, $ \\Delta S > 0 $): heat says no, disorder says go. The disorder pull wins only when $ T $ is large, so this is **spontaneous only at high temperature.**\n\n" +
      "For the two mixed cases there is a single temperature where the answer flips — the **crossover temperature**. It is the point where the two pulls exactly cancel, so $ \\Delta G = 0 $. Set $ \\Delta H - T\\Delta S = 0 $ and solve:\n\n" +
      "$ T = \\frac{\\Delta H}{\\Delta S} $\n\n" +
      "Above this temperature one pull wins; below it the other does. The crossover is just the dividing line." },

    // 8 — worked_example
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — When Does Limestone Decompose?',
      problem: "Heating limestone drives off carbon dioxide to make lime: $ \\ce{CaCO3(s) -> CaO(s) + CO2(g)} $. For this reaction $ \\Delta H = +178 $ kJ/mol and $ \\Delta S = +160 $ J/(mol·K). Find the temperature above which the reaction becomes spontaneous.",
      solution: "**Read the signs first.** $ \\Delta H > 0 $ (heat goes in) and $ \\Delta S > 0 $ (a gas is released, disorder rises). This is the \"refuse–agree\" case: spontaneous only at high temperature.\n\n" +
        "**Find the flip point** by setting $ \\Delta G = 0 $:\n\n" +
        "$ T = \\frac{\\Delta H}{\\Delta S} $\n\n" +
        "**Match the units** — $ \\Delta H $ is in kJ, $ \\Delta S $ is in J. Convert $ \\Delta H $ to joules:\n\n" +
        "$ \\Delta H = 178 \\text{ kJ} = 178000 \\text{ J} $\n\n" +
        "**Divide:**\n\n" +
        "$ T = \\frac{178000}{160} \\approx 1113 \\text{ K} $\n\n" +
        "**The verdict:** above about $ 1113 $ K the $ T\\Delta S $ pull overpowers $ \\Delta H $, so $ \\Delta G < 0 $ and the reaction runs.\n\n" +
        "**Answer: the reaction is spontaneous above roughly 1113 K** — which is exactly why limestone has to be heated strongly in a kiln to make lime." },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Number, and the Four Cases',
      markdown: "**$ \\Delta G = \\Delta H - T\\Delta S $** at constant $ T $ and $ P $. The sign is the verdict: $ \\Delta G < 0 $ spontaneous · $ \\Delta G = 0 $ equilibrium · $ \\Delta G > 0 $ non-spontaneous.\n\n" +
        "The four sign cases: $ (\\Delta H -,\\ \\Delta S +) $ always spontaneous · $ (+, -) $ never · $ (-, -) $ only at low $ T $ · $ (+, +) $ only at high $ T $.\n\n" +
        "The flip point for the two mixed cases is the crossover temperature **$ T = \\frac{\\Delta H}{\\Delta S} $** (set $ \\Delta G = 0 $)." },

    // 10 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The units ambush (the number-one error here):** $ \\Delta H $ is given in kJ while $ \\Delta S $ is in J/K. Before you combine them in $ \\Delta G = \\Delta H - T\\Delta S $, bring both to the same unit — students who skip this in a hurry get an answer that is off by a factor of a thousand.\n\n" +
        "**Memorise the four-case table** — sign of $ \\Delta H $ and sign of $ \\Delta S $ tell you the answer with no calculation in the two pure cases, and tell you *which way* temperature flips it in the two mixed cases.\n\n" +
        "**The crossover temperature is just $ T = \\frac{\\Delta H}{\\Delta S} $** — set $ \\Delta G = 0 $ and solve. The exam loves to ask \"above what temperature\" or \"the minimum temperature for feasibility\" — that is this line, every time." },

    // 11 — inline_quiz (LAST)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'For a reaction at constant temperature and pressure, what does a negative value of the Gibbs free energy change tell you?',
          options: [
            'The reaction is spontaneous and runs forward on its own',
            'The reaction is at equilibrium',
            'The reaction is non-spontaneous in the forward direction',
            'The reaction must be exothermic'
          ],
          correct_index: 0,
          explanation: 'A negative $ \\Delta G $ is the green light for spontaneity. The "non-spontaneous" choice describes a positive $ \\Delta G $, and "at equilibrium" describes $ \\Delta G = 0 $. The "must be exothermic" option is the trap: a negative $ \\Delta G $ can come from a strong disorder term even when the reaction absorbs heat, so it need not be exothermic.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A reaction is exothermic ($ \\Delta H < 0 $) but lowers the disorder of the system ($ \\Delta S < 0 $). When is it spontaneous?',
          options: [
            'At all temperatures',
            'Only at low temperature',
            'Only at high temperature',
            'Never, at any temperature'
          ],
          correct_index: 1,
          explanation: 'Here heat says go but disorder says no, so the heat pull must win — and it only wins while $ T\\Delta S $ stays small, which means low temperature. The tempting wrong choice is "only at high temperature": that is the opposite mixed case ($ \\Delta H > 0 $, $ \\Delta S > 0 $), where disorder is the ally that needs heat to win.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A reaction has $ \\Delta H = +90 $ kJ/mol and $ \\Delta S = +300 $ J/(mol·K). Above roughly what temperature does it become spontaneous?',
          options: [
            'About 0.3 K',
            'About 30 K',
            'About 300 K',
            'About 3000 K'
          ],
          correct_index: 2,
          explanation: 'Set $ \\Delta G = 0 $ to get $ T = \\frac{\\Delta H}{\\Delta S} $. Converting enthalpy to joules, $ T = \\frac{90000}{300} = 300 $ K. The tempting wrong answer is about 0.3 K, which comes from dividing $ 90 $ by $ 300 $ without first turning kJ into J — the classic units slip that throws the answer off by a thousand.' },
      ] },

    // 12 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*One number, $ \\Delta G $, now settles whether any reaction runs. But a reaction does not just run or stall — it slows down and finally **settles**. Next, we watch what $ \\Delta G $ becomes as a reaction approaches that resting point, and how it ties directly to the equilibrium constant.*" },
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
    slug: NEW_SLUG, title: 'Gibbs Free Energy & Spontaneity',
    subtitle: 'Releasing heat pulls one way, spreading out pulls the other, and temperature decides the winner. One number settles it for good.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'gibbs-free-energy', 'spontaneity', 'crossover-temperature'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 20 (gibbs free energy & spontaneity)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
