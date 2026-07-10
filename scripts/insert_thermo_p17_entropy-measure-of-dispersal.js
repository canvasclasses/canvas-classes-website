'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc on the Second Law, Page 17.
 * "Entropy — the Measure of Dispersal" — a SIGNATURE page. Entropy counts how spread
 * out a system's energy and matter are: more microstates (W) ⇒ higher S (Boltzmann
 * S = k ln W); colder systems gain more entropy from the same heat because T sits in the
 * denominator of ΔS = q_rev / T. Solid < liquid < gas; rises on heating, mixing, expansion.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md
 *   — his actual analogies: beggar-vs-rich-man ₹2000 note (why T in denominator),
 *     10 chairs & 10 children (microstates), fever-as-indicator (entropy is a MEASURE).
 * Reference-first: Mittal §25.2 (diffusion & probability) + §25.3 (entropy, Boltzmann microstates).
 * published:false. Run: node scripts/insert_thermo_p17_entropy-measure-of-dispersal.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 17;
const NEW_SLUG = 'entropy-measure-of-dispersal';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A single drop of ink released into a glass of clear water, unfurling into spreading tendrils that fade until the whole glass is faintly coloured',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A single drop of dark ink released into a tall glass of perfectly clear water, captured mid-spread: delicate tendrils of colour unfurl and branch outward, growing fainter as they reach the edges, on their way to colouring the whole glass evenly. The composition reads left-to-right as "concentrated drop → spreading → uniform faint tint", suggesting an arrow of time that never runs backward. Deep near-black background (#0a0a0a), the ink glows in warm orange and amber against the dark water, soft volumetric light through the glass, a few suspended particles catching the glow. Clean cinematic scientific-illustration style. No text, no labels, no arrows.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Arrow That Never Reverses',
      markdown: "Let one drop of ink fall into a glass of water and walk away. It always spreads until the whole glass is faintly coloured — and it never, ever gathers itself back into a single drop. Shuffle a deck of cards and it never re-sorts itself into suits on its own. Nobody forbids the neat version; it is just that there are so many more spread-out, jumbled arrangements than tidy ones that nature lands in a spread-out one every single time. **Entropy** is how we count exactly that." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Energy on its own does not tell you which way a change will go. A hot cup of tea cools on the table; it never warms itself back up by stealing heat from the cool room. Both directions conserve energy, yet only one ever happens. Something *besides* energy is steering the traffic.\n\n" +
      "That something is **dispersal** — how spread out a system's energy and matter are. **Entropy**, written $ S $, is the quantity that measures it. The more ways the particles and their energy can be arranged while the system still looks the same from outside, the higher the entropy. Nature drifts, on its own, toward the states that can be built in the most ways.\n\n" +
      "Entropy is a **state function** (it depends only on where the system is, not how it got there), it is **extensive** (twice the stuff, twice the entropy), and it is measured in joules per kelvin, $ \\text{J/K} $. This page is about what it counts and why it grows." },

    // 3 — heading: microstates
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Counting the Ways — Microstates',
      objective: 'See entropy as a head-count of arrangements: more ways to arrange the particles and their energy means higher entropy.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Picture ten chairs in a row and ten children deciding where to sit. There is a staggering number of ways they can fill those chairs. Each distinct seating arrangement is one **microstate** — one specific way the system can be built up at the particle level while still being \"ten children on ten chairs\" from across the room.\n\n" +
      "A system with very few microstates is tightly constrained; one with a huge number is free to be arranged in countless ways. Entropy is just a measure of that count. Ludwig Boltzmann pinned it down in one of the most famous equations in science:\n\n" +
      "$ S = k\\ln W $\n\n" +
      "Here $ W $ is the number of microstates available to the system and $ k $ is the Boltzmann constant. The message is simple: **more microstates means more entropy.** A solid, with its particles locked in a lattice, has few microstates. Melt it to a liquid and the particles can shuffle past one another — more ways to arrange them. Boil it to a gas and they fly freely through a huge volume — vastly more ways still. So entropy climbs in the order solid $ < $ liquid $ < $ gas." },

    // 4 — image: microstates
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A few gas particles starting bunched in one corner of a box, then a series showing them spreading to fill the whole box, with the number of possible arrangements growing at each step',
      caption: '📸 Few particles, one corner — and the explosion of ways to spread them out',
      generation_prompt: 'A clean scientific-illustration sequence on a deep near-black background (#0a0a0a), arranged left to right as three panels of a box of gas. Panel 1: a small box with just a handful of glowing orange particle-dots crowded together in one corner, leaving most of the box empty — labelled underneath only with a small white "few ways". Panel 2: the same box with the dots beginning to spread out across more of the volume — labelled "more ways". Panel 3: the dots evenly distributed throughout the whole box — labelled "the most ways". Above the panels, a simple visual hint that the number of possible arrangements grows enormously from left to right (e.g. a few faint ghosted alternative dot-patterns stacked behind panel 3). Orange particle dots, thin white box outlines, minimal white labels only as quoted. No formulae, no stray text, no arrows crossing the panels. Clean technical illustration style.' },

    // 5 — reasoning_prompt (mid-page, after microstates + before the T-in-denominator section)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "The very same quantity of heat is poured into a cold object and into a hot object. Which object's entropy increases more, and why?",
      options: [
        "The hot one — it is already energetic, so adding heat builds on a larger base",
        "The cold one — because $ \\Delta S = \\frac{q}{T} $, and dividing by a smaller $ T $ gives a larger $ \\Delta S $",
        "Both increase by exactly the same amount — the heat added is identical",
        "Neither — entropy depends only on the heat, not on the temperature"
      ],
      correct_index: 1,
      reveal: "The entropy change is $ \\Delta S = \\frac{q}{T} $, so the same heat $ q $ divided by a **smaller** temperature $ T $ gives a **larger** $ \\Delta S $. The cold object wins. Think of the beggar and the rich man each handed a $ 2000 $ note — the same gift transforms the one who had little and barely registers for the one who had plenty. A cold, low-energy system is the beggar: the same packet of heat means far more to it." },

    // 6 — heading: temperature in the denominator
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Temperature Sits in the Denominator',
      objective: 'Understand why the same heat raises a cold system\'s entropy more than a hot one\'s — the meaning of T below the line.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When heat flows reversibly into a system, the entropy it gains is\n\n" +
      "$ \\Delta S = \\frac{q_{rev}}{T} $\n\n" +
      "The heat $ q_{rev} $ is on top — pour in more heat, gain more entropy, no surprise there. The surprise is the $ T $ underneath. Why should the *current* temperature decide how much that heat is worth?\n\n" +
      "Here is the picture that makes it click. Hand a $ 2000 $ note to a beggar and you change his whole day; hand the same note to a rich man and he barely notices. The note is identical — the *impact* depends entirely on how much the receiver already had. A cold system is the beggar. Its particles are sluggish and orderly, so a fresh packet of heat shakes things up dramatically, opening up many new arrangements. A hot system already has its particles flying about; the same heat is one more drop in an already-churning bucket and adds far fewer new arrangements.\n\n" +
      "So temperature in the denominator is not a piece of algebra to memorise. It is the statement that *the same heat buys more disorder when the system is cold.*" },

    // 7 — heading: what makes entropy rise
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What Makes Entropy Rise',
      objective: 'Recognise on sight the three everyday moves — phase, heat, room — that hand a system more ways to be arranged.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "You rarely have to compute microstates by hand. A few common moves reliably raise the entropy, because every one of them hands the particles more room to be arranged:\n\n" +
      "- **Change of state, upward.** Going solid $ \\to $ liquid $ \\to $ gas frees the particles at each step, so $ S $ rises in that order. Boiling gives the biggest jump of all, because a gas explores an enormous volume.\n" +
      "- **Mixing.** Pour two gases together and they interleave into one jumbled mixture. There are far more mixed arrangements than separated ones, so mixing raises entropy even when no heat is exchanged.\n" +
      "- **Heating.** Warm a system and its particles take on a wider spread of speeds and positions — more energy levels are within reach, so more microstates open up.\n" +
      "- **Expansion into a larger volume.** Give a gas a bigger room and each particle has more places to be. A crowd that can only mill about in a small cell has fewer arrangements than the same crowd loose in a hall.\n\n" +
      "One caution worth carrying: entropy is a **measure** of dispersal, not the mess itself. A fever is not the disease — it is a reading that tells the doctor something inside the body is off. In the same way, $ S $ is the thermometer of spreading-out, not the spreading-out it reports." },

    // 8 — worked example
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — The Same Heat, Two Temperatures',
      problem: "$ 100 $ J of heat is added reversibly to a system, once when the system is at $ 250 $ K and once when it is at $ 500 $ K. Find $ \\Delta S $ in each case, and compare.",
      solution: "The route is one formula: $ \\Delta S = \\frac{q_{rev}}{T} $. Same $ q_{rev} $, different $ T $.\n\n" +
        "**At 250 K:**\n\n" +
        "$ \\Delta S = \\frac{100}{250} $\n\n" +
        "$ \\Delta S = 0.40 $ J/K\n\n" +
        "**At 500 K:**\n\n" +
        "$ \\Delta S = \\frac{100}{500} $\n\n" +
        "$ \\Delta S = 0.20 $ J/K\n\n" +
        "**Compare:**\n\n" +
        "The colder system ($ 250 $ K) gains $ 0.40 $ J/K — twice the entropy the hotter one ($ 500 $ K) gains from the identical $ 100 $ J.\n\n" +
        "**Answer:** $ \\Delta S = 0.40 $ J/K at $ 250 $ K and $ 0.20 $ J/K at $ 500 $ K — the beggar feels the gift twice as much as the rich man." },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Carry These Four',
      markdown: "**Boltzmann:** $ S = k\\ln W $ — more microstates ($ W $) means more entropy.\n\n" +
        "**Change formula:** $ \\Delta S = \\frac{q_{rev}}{T} $, measured in $ \\text{J/K} $.\n\n" +
        "**Order:** entropy rises solid $ < $ liquid $ < $ gas, and on mixing, heating, and expansion.\n\n" +
        "**Nature of $ S $:** a state function and extensive — it depends on where the system is, and it scales with how much there is." },

    // 10 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Always the reversible heat.** $ \\Delta S = \\frac{q_{rev}}{T} $ uses the *reversible* heat even when the real process is irreversible. The trap is to plug in the actual (irreversible) heat — examiners bank on it. Find the entropy along a reversible path between the same two states; entropy is a state function, so the answer is the same.\n\n" +
        "**\"Disorder\" is a loose word — entropy is a measure.** Treat $ S $ like a thermometer reading of how spread-out a system is, not as literal untidiness. The fever-versus-disease distinction is exactly the framing examiners reward.\n\n" +
        "**Gases dominate.** When a question asks which species has the highest entropy, a gas almost always beats a liquid or solid of the same substance — and the boiling step is the biggest entropy jump of all." },

    // 11 — inline_quiz (LAST)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'In Boltzmann\'s equation $ S = k\\ln W $, what does $ W $ stand for?',
          options: [
            'The number of microstates available to the system',
            'The work done by the system',
            'The weight of the system in grams',
            'The amount of heat added to the system'
          ],
          correct_index: 0,
          explanation: 'In $ S = k\\ln W $, $ W $ is the number of microstates — the distinct ways the particles and their energy can be arranged. The tempting wrong choice is "work", because $ W $ is the usual symbol for work elsewhere in thermodynamics; here it is deliberately the microstate count.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'The same quantity of heat is supplied reversibly to a cold body and to a hot body. Which gains more entropy, and why?',
          options: [
            'The hot body, because it is already more energetic',
            'Both gain equal entropy, since the heat supplied is identical',
            'The cold body, because $ \\Delta S = \\frac{q}{T} $ and a smaller $ T $ gives a larger $ \\Delta S $',
            'The cold body, because heat always flows toward colder objects'
          ],
          correct_index: 2,
          explanation: 'Since $ \\Delta S = \\frac{q}{T} $, dividing the same $ q $ by a smaller $ T $ gives a larger $ \\Delta S $, so the cold body wins — the beggar feels the gift more. The "equal entropy" option is the classic slip: identical heat does not mean identical entropy change, because temperature scales the result.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For the same substance, which of these has the highest entropy?',
          options: [
            'The crystalline solid',
            'The water vapour (gas)',
            'The liquid',
            'All three are equal at the same temperature'
          ],
          correct_index: 1,
          explanation: 'Entropy rises solid $ < $ liquid $ < $ gas, because the gas particles roam a huge volume with vastly more arrangements — so the vapour is highest. Picking the solid reverses the order; the solid is the most ordered and so has the *lowest* entropy, not the highest.' },
      ] },

    // 12 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now read entropy as a count of arrangements and explain why temperature sits below the line. Next, we turn that into arithmetic: the master formula for an entropy change, what happens during a phase change, and how to track the entropy of the surroundings alongside the system.*" },
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
    slug: NEW_SLUG, title: 'Entropy — the Measure of Dispersal',
    subtitle: 'Spread-out, jumbled states vastly outnumber neat ones, so nature drifts toward them. Entropy is how we count that drift.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'entropy', 'microstates', 'boltzmann'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 17 (entropy, the measure of dispersal)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
