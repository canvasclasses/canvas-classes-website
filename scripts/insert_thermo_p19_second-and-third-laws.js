'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc E (Entropy & Spontaneity), Page 19.
 * "The Second and Third Laws" — the universe's entropy only ever climbs, a single
 * system's can fall, and a perfectly crystalline solid at 0 K is the one place
 * entropy reaches a true zero. Builds the tools to tabulate absolute S° and compute
 * ΔS°_rxn = ΣS°(products) − ΣS°(reactants).
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md
 *   (exemplars: "Third law perfectly crystalline" prayer-assembly; "Negative ΔS_sys
 *    can still be spontaneous (iron rusting)").
 * Reference-first: Mittal §25.3.3, §25.5, §25.6.
 * published:false. Run: node scripts/insert_thermo_p19_second-and-third-laws.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 19;
const NEW_SLUG = 'second-and-third-laws';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5, full)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'An iron nail rusting on one side while the room around it glows warm, with a balance scale showing the room outweighing the nail',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). On the left, a single iron nail resting outdoors, one half bright metal and the other half crusted with orange-brown rust. From the rusting half, faint warm orange heat-glow radiates outward into the surrounding air. On the right, a delicate balance scale: the small pan holding a tidy, ordered crystal (the nail becoming more ordered) tips UP, while the large pan holding a soft diffuse glow of warmth (the room) sinks DOWN and wins. The visual idea: the nail itself grows more ordered, yet the warmth it sheds tips the universe toward more disorder. Deep near-black background (#0a0a0a), warm amber and orange glow, cool dim blue-grey for the metal, subtle particle motes drifting from the warm side. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook (callout)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'A Nail That Tidies Itself',
      markdown: "Leave an iron nail out in the open and it slowly rusts on its own. Here is the strange part: the rust is a hard, ordered solid, built from a metal and the loose gas around it. The atoms end up *more* organised than they began, so the nail's own disorder actually goes **down**.\n\nAnd yet rusting happens all by itself, with nobody pushing it. How can a change that lowers disorder still be one that nature chooses to do?" },

    // 2 — core text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last page you learned to put a number on disorder: **entropy**, written $ S $. The obvious guess is that nature simply pushes entropy up, always, everywhere. That guess is close — but it hides a trap, and the rusting nail is the trap.\n\n" +
      "The fix is to be careful about *whose* entropy you mean. A change happens to a **system**, but it also dumps or pulls heat from the **surroundings**. The honest scorecard is the two added together — the **universe**. Two laws finish the story: one tells you which way the universe's entropy must move, the other hands you a fixed starting line to measure entropy from." },

    // 3 — heading[2] + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Second Law and Why the Universe Always Wins',
      objective: 'State the Second Law in terms of the universe, and use the sign of the change in the universe’s entropy to tell spontaneous from reversible.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The **Second Law** sets the direction of every real change. In words: for any change that happens on its own, the entropy of the **universe** — system plus surroundings — must increase.\n\n" +
      "As a sign rule it is short:\n\n" +
      "- $ \\Delta S_{universe} > 0 $ — the change is **spontaneous** (it can run on its own).\n" +
      "- $ \\Delta S_{universe} = 0 $ — the change is **reversible**, sitting exactly at equilibrium.\n" +
      "- $ \\Delta S_{universe} < 0 $ — **impossible**; nature never runs this way.\n\n" +
      "Read the subscript carefully. It says *universe*, not *system*. A spontaneous change is free to lower the system's own entropy, as long as it raises the surroundings' entropy by even more, so the grand total still climbs. Hot tea cooling, water freezing on a cold night, a nail rusting — every one of them obeys this, even the ones that look like they tidy up." },

    // 4 — image (two_third, 16:9)
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A balance scale weighing the system’s small drop in entropy against the surroundings’ larger gain, the universe total tipping positive',
      caption: '📸 The system can lose entropy — the universe still gains',
      generation_prompt: 'A clean conceptual diagram on a deep near-black background (#0a0a0a). Centre: a balance scale. The LEFT pan, labelled only with a small downward arrow, holds a small tidy cluster of ordered dots and dips slightly (the system losing entropy). The RIGHT pan, with a larger upward arrow, holds a bigger, looser scatter of glowing dots spreading apart and rises higher in total weight (the surroundings gaining more entropy). Below the scale, a single wide bar split into a small minus segment (cool blue) and a larger plus segment (warm orange), the plus clearly bigger, with a net arrow pointing up. Minimal white labels only: a tiny minus near the left pan, a plus near the right pan. Orange and amber for entropy gained, cool blue for entropy lost. Clean scientific-illustration style, no extra text.' },

    // 5 — mid-page reasoning_prompt
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "When iron rusts, a metal and a gas turn into a hard, ordered solid, so the system's own entropy goes down. Yet rusting is spontaneous. How is the Second Law still satisfied?",
      options: [
        "It isn't — rusting actually breaks the Second Law, which only holds for gases",
        "Rusting is strongly exothermic, so the heat it releases raises the surroundings' entropy by more than the system's falls, and the universe's total still rises",
        "The system's entropy doesn't really fall; solids always have higher entropy than gases",
        "Entropy of the system must rise for any spontaneous change, so the figures given must be wrong"
      ],
      correct_index: 1,
      reveal: "The Second Law is about the **universe**, not the system. Rusting pours out a lot of heat, and that heat floods into the cool surroundings, scattering their molecules and raising *their* entropy. The surroundings gain more than the system loses, so $ \\Delta S_{universe} $ comes out positive and the change is allowed. The tempting wrong choice is the last one — it quietly assumes the *system* must gain entropy, which is exactly the trap this law is built to catch." },

    // 6 — heading[2] + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'When a Single System Loses Entropy',
      objective: 'Explain how a system’s entropy can decrease in a spontaneous change without breaking the Second Law.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "It is worth saying plainly, because the bare slogan \"entropy always increases\" leads students astray. Nowhere does the Second Law say the **system's** entropy has to go up. It says the system *plus* its surroundings — the universe — must.\n\n" +
      "So a system's entropy alone can happily fall. Water freezing into ice locks loose molecules into a rigid lattice, lowering the water's entropy, yet on a cold night it freezes on its own. The same logic runs the rusting nail. In both, the heat handed to the surroundings tips the universe's total upward — the system pays a small entropy debt, the surroundings collect a bigger one, and nature pockets the difference." },

    // 7 — heading[2] + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Third Law and a True Zero of Entropy',
      objective: 'State the Third Law and use it to explain why absolute standard entropies can be tabulated for substances.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Entropy has one luxury that energy does not: a genuine zero. The **Third Law** says the entropy of a **perfectly crystalline** pure substance is zero at absolute zero, $ 0 $ K.\n\n" +
      "Why every word matters: cool a substance down and you freeze out its *thermal* disorder — the jiggling of atoms slows and stops. But there is a second kind of disorder. Picture a school prayer assembly with everyone lined up neatly, except two children who turned up in the wrong dress. That **structural** disorder is visible from clear across the ground, and cooling will never fix it. A true zero of entropy needs both kinds gone, which is why the law insists on a *perfectly crystalline* solid — no atom out of place — sitting at $ 0 $ K.\n\n" +
      "This fixed zero is a gift. Enthalpy has no such anchor (we only ever measure *changes* in it), but entropy does, so chemists can list **absolute** standard entropies $ S^\\circ $ for substances straight from tables. With those in hand, the entropy change of a reaction is a simple subtraction:\n\n" +
      "$ \\Delta S^\\circ_{rxn} = \\sum S^\\circ(\\text{products}) - \\sum S^\\circ(\\text{reactants}) $" },

    // 8 — worked_example (solved_example, tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Entropy Change of Ammonia Synthesis',
      problem: "Find $ \\Delta S^\\circ $ for $ \\ce{N2(g) + 3H2(g) -> 2NH3(g)} $, given the standard entropies $ S^\\circ(\\ce{N2}) = 191.6 $, $ S^\\circ(\\ce{H2}) = 130.7 $, and $ S^\\circ(\\ce{NH3}) = 192.5 $ J/(mol·K).",
      solution: "The plan is one formula: total $ S^\\circ $ of the products minus total $ S^\\circ $ of the reactants, each entry multiplied by how many moles the equation uses.\n\n" +
        "**Products side.** Two moles of $ \\ce{NH3} $:\n\n" +
        "$ \\sum S^\\circ(\\text{products}) = 2 \\times 192.5 = 385.0 $ J/K\n\n" +
        "**Reactants side.** One mole of $ \\ce{N2} $ plus three moles of $ \\ce{H2} $:\n\n" +
        "$ \\sum S^\\circ(\\text{reactants}) = 191.6 + 3 \\times 130.7 = 191.6 + 392.1 = 583.7 $ J/K\n\n" +
        "**Subtract.**\n\n" +
        "$ \\Delta S^\\circ = 385.0 - 583.7 = -198.7 $ J/K\n\n" +
        "**Read the sign.** It comes out negative, and that makes physical sense: four moles of gas on the left collapse into just two moles of gas on the right. Fewer gas molecules means less spreading-out, so the system's entropy drops. (This reaction still runs because it is exothermic enough to repay the universe through the surroundings — the same bargain as the rusting nail.)" },

    // 9 — callout[remember]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Two Laws on One Card',
      markdown: "**Second Law:** $ \\Delta S_{universe} > 0 $ for a spontaneous change, $ = 0 $ for a reversible one, and a decrease is impossible. The subscript is *universe* — a system's entropy alone is allowed to fall.\n\n" +
        "**Third Law:** a perfectly crystalline pure solid has $ S = 0 $ at $ 0 $ K. That fixed zero lets us tabulate absolute $ S^\\circ $ values, so $ \\Delta S^\\circ_{rxn} = \\sum S^\\circ(\\text{products}) - \\sum S^\\circ(\\text{reactants}) $." },

    // 10 — callout[exam_tip]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Two statement-traps live on this page, and examiners love both.\n\n" +
        "**\"Entropy always increases.\"** As written, it is **wrong**. It must be the *universe's* entropy, and only in a *spontaneous* or *isolated* process. For a **reversible** change the answer is $ \\Delta S_{universe} = 0 $, not positive — a favourite catch.\n\n" +
        "**The Third Law needs every word.** \"A perfectly crystalline solid at $ 0 $ K has zero entropy.\" Drop *perfectly* or drop *crystalline* and the statement becomes false. Each word is carrying marks." },

    // 11 — inline_quiz (LAST, 3 Qs, 0.67)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'According to the Second Law, what must be true for any spontaneous change?',
          options: [
            'The entropy of the system must increase',
            'The entropy of the universe (system plus surroundings) must increase',
            'The entropy of the surroundings must stay constant',
            'The entropy of the universe must stay exactly zero'
          ],
          correct_index: 1,
          explanation: 'A spontaneous change requires the entropy of the universe to rise. The first choice is the classic trap: it pins the rise on the system, but the system’s entropy is free to fall (as in freezing or rusting) as long as the surroundings gain more. A universe entropy that stays zero describes a reversible change at equilibrium, not a spontaneous one.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A liquid freezes into a solid on a cold night, lowering the substance’s own entropy, yet the freezing happens on its own. Which explanation fits the Second Law?',
          options: [
            'Freezing must actually raise the liquid’s entropy, so the data is misleading',
            'The Second Law does not apply to changes of state',
            'Freezing releases heat to the cold surroundings, raising their entropy by more than the liquid’s falls, so the universe’s entropy still increases',
            'The surroundings lose entropy too, but the change is allowed because it is fast'
          ],
          correct_index: 2,
          explanation: 'Freezing is exothermic: the heat it sheds pours into the cold surroundings and scatters their molecules, raising their entropy more than the liquid’s drops. The whole universe’s entropy still climbs. The tempting first option assumes the system itself must gain entropy — the very mistake the law is designed to expose.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Which statement about the Third Law is fully correct?',
          options: [
            'Any solid has zero entropy at absolute zero',
            'A perfectly crystalline pure substance has zero entropy at absolute zero',
            'A perfectly crystalline substance has zero entropy at any low temperature',
            'A pure substance has zero entropy at zero degrees Celsius'
          ],
          correct_index: 1,
          explanation: 'The Third Law demands all of it: perfectly crystalline, pure, and at absolute zero. The "any solid" choice drops "perfectly crystalline", so structural disorder could remain and the entropy would not be zero. The "zero degrees Celsius" choice swaps absolute zero for the wrong temperature entirely.' },
      ] },

    // 12 — bridge text to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now say which way the universe must move and measure entropy from a real zero. But weighing the universe — tracking the surroundings every time — is awkward. Next, a single number that folds enthalpy and entropy together and decides spontaneity from the system alone: **Gibbs free energy**.*" },
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
    slug: NEW_SLUG, title: 'The Second and Third Laws',
    subtitle: "The universe's entropy only ever climbs — but a single system's can fall. And there is exactly one place where entropy reaches a true zero.",
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'second-law', 'third-law', 'standard-entropy'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 19 (second and third laws)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
