'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc B (Thermochemistry), Page 10.
 * "Thermochemical Equations & Hess's Law" — a reaction's heat is fixed by where it
 * starts and ends, never by the road between. That state-function fact lets you add,
 * subtract, and scale thermochemical equations like algebra to find heats you can
 * never measure directly (the classic C -> CO case).
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md
 *   (state-vs-path "altitude on a trek" idea; "thermochemistry is scoring, just
 *    rearrange the equation" register).
 * Reference-first: Mittal §24.3 + §24.4 + NCERT Class 11 Ch.5.
 * published:false. Run: node scripts/insert_thermo_p10_thermochemical-equations-hess.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 10;
const NEW_SLUG = 'thermochemical-equations-hess';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A mountain trek where one straight path and one long winding path both climb from the same valley to the same peak, with the height gain glowing equal on both',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A single mountain rising from a valley. Two glowing trails climb from the exact same point in the valley to the exact same point at the summit: one a short straight line, one a long winding switchback path. A softly glowing vertical measure on the right marks the height gained, and it is identical for both trails. The idea: the height you gain depends only on where you start and where you finish, not on which path you take. Deep near-black background (#0a0a0a), warm orange and amber glow on the two trails and the height marker, cool dim blues for the mountain and sky. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook (the C -> CO measurement problem)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Heat You Cannot Measure Directly',
      markdown: "Try to burn carbon and stop it exactly at carbon monoxide. You cannot. Give carbon enough oxygen and it races straight past $ \\ce{CO} $ to $ \\ce{CO2} $; starve it of oxygen and you get a messy mixture. So the heat of $ \\ce{C + 1/2 O2 -> CO} $ can never be read off a real flame.\n\nAnd yet that value sits in every data book, known to the kilojoule. Hess's law gets it — not by burning carbon, but by going the long way round." },

    // 2 — core concept: thermochemical equation + exo/endo
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A reaction doesn't just turn one set of chemicals into another — it also releases or absorbs heat. To capture both at once, we write a **thermochemical equation**: a balanced equation written together with its enthalpy change $ \\Delta H $ and the physical state of every species.\n\n" +
      "$ \\ce{C(s) + O2(g) -> CO2(g)} $, $ \\Delta H = -393 $ kJ\n\n" +
      "Two things in that line are not optional. The **states** matter, because the heat changes if water comes off as liquid versus vapour. And the **sign of $ \\Delta H $** tells you the direction of heat flow. A reaction that releases heat is **exothermic**, with $ \\Delta H < 0 $ (the system loses energy). A reaction that absorbs heat is **endothermic**, with $ \\Delta H > 0 $." },

    // 3 — heading 1 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Writing a Thermochemical Equation',
      objective: 'Write a reaction with its enthalpy change and states, and flip the sign of that enthalpy correctly when the reaction is reversed.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Once a thermochemical equation is written, it behaves like a two-way street. Run the same reaction backwards and the heat that was released must now be supplied — so **reversing a reaction flips the sign of $ \\Delta H $** while keeping its size. This is the **Laplace-Lavoisier rule**:\n\n" +
      "$ \\ce{H2(g) + 1/2 O2(g) -> H2O(l)} $, $ \\Delta H = -286 $ kJ (releases heat)\n\n" +
      "$ \\ce{H2O(l) -> H2(g) + 1/2 O2(g)} $, $ \\Delta H = +286 $ kJ (absorbs the same heat back)\n\n" +
      "Two more moves come from the same logic. **Scale** a reaction by a number and you scale its $ \\Delta H $ by the same number — double the amounts, double the heat. And when you line up several steps that lead from your starting chemicals to your final ones, you can **add** the equations and add their $ \\Delta H $ values straight down the column." },

    // 4 — image: the three algebra moves
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Three panels showing reverse (flip the sign), scale (multiply the value), and add (sum the values) operations on enthalpy',
      caption: '📸 Reverse, scale, add — the three algebra moves on a thermochemical equation',
      generation_prompt: 'A clean three-panel diagram on a deep near-black background (#0a0a0a). Panel 1 "Reverse": one reaction arrow pointing right with a glowing minus-value beside it, and below it the same reaction arrow flipped to point left with the value now glowing positive — a curved arrow showing the sign flipped. Panel 2 "Scale": a small reaction with a small heat value, and a multiply-by-two operator turning it into a doubled reaction with a doubled heat value. Panel 3 "Add": two short reactions stacked with a plus sign and a horizontal line beneath them, summing into one combined reaction with the two heat values added. Use orange and amber for the heat values and operators, white minimal labels (Reverse / Scale / Add only), clean scientific-illustration style. No long text.' },

    // 5 — mid-page reasoning_prompt (sign flip on reversal)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 1,
      prompt: "For the reaction $ \\ce{A -> B} $ the enthalpy change is $ \\Delta H = -100 $ kJ. What is $ \\Delta H $ for the reverse reaction $ \\ce{B -> A} $?",
      options: [
        "$ -100 $ kJ — the heat is a property of the chemicals, so it stays the same",
        "$ +100 $ kJ — reversing the reaction flips the sign but keeps the size",
        "$ +200 $ kJ — the heat doubles when you turn the reaction around",
        "$ 0 $ kJ — the forward and reverse heats cancel each other out"
      ],
      correct_index: 1,
      reveal: "The forward reaction releases $ 100 $ kJ, so to run it backwards you must put exactly that $ 100 $ kJ back in. Same size, opposite sign: $ \\Delta H = +100 $ kJ. The tempting answer is to keep it at $ -100 $ kJ as if the heat belonged to the chemicals — but $ \\Delta H $ describes the *change*, and the change reverses direction when the reaction does." },

    // 6 — heading 2 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: "Hess's Law — Add the Steps",
      objective: 'State Hess\'s law and use it to find an unknown enthalpy change by adding, subtracting, and scaling known thermochemical equations.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Earlier in this chapter you met **state functions** — quantities that depend only on where the system starts and ends, never on the road taken. Altitude on a trek is one: the height you gain from the valley to the peak is the same whether you take the short straight trail or the long winding one. Enthalpy is exactly the same kind of quantity.\n\n" +
      "That single fact is **Hess's law**: the total $ \\Delta H $ of a reaction is the same whether it happens in one step or in many. Because $ H $ is a state function, the total heat depends only on the starting and final chemicals, not on the route between them.\n\n" +
      "And here is what makes it powerful. If you can't run a reaction directly, find a set of reactions you *can* measure that start at the same chemicals and end at the same chemicals. Add, subtract, and scale those known equations like ordinary algebra until they line up with your target — and their $ \\Delta H $ values follow the same operations." },

    // 7 — worked_example: the classic C -> CO via Hess
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: "Solved Example — Finding the Heat of $ \\ce{C -> CO} $",
      problem: "Find $ \\Delta H $ for $ \\ce{C(s) + 1/2 O2(g) -> CO(g)} $ — the reaction you cannot measure directly — given two reactions you can:\n\n" +
        "Reaction 1: $ \\ce{C(s) + O2(g) -> CO2(g)} $, $ \\Delta H_1 = -393 $ kJ\n\n" +
        "Reaction 2: $ \\ce{CO(g) + 1/2 O2(g) -> CO2(g)} $, $ \\Delta H_2 = -283 $ kJ",
      solution: "The whole question is one move: line up the two known reactions so they add up to the target.\n\n" +
        "**Place the target.** We want $ \\ce{C(s)} $ on the left and $ \\ce{CO(g)} $ on the right.\n\n" +
        "**Use reaction 1 as written.** It already has $ \\ce{C(s)} $ on the left, which is what we need.\n\n" +
        "**Reverse reaction 2.** We need $ \\ce{CO(g)} $ on the right, but reaction 2 has it on the left — so flip it, which flips its sign:\n\n" +
        "$ \\ce{CO2(g) -> CO(g) + 1/2 O2(g)} $, $ \\Delta H = +283 $ kJ\n\n" +
        "**Add the two equations.** Cancel the $ \\ce{CO2(g)} $ that now appears on both sides, and the spare $ \\ce{O2} $ bookkeeping settles to $ \\ce{1/2 O2} $ on the left — leaving exactly the target reaction.\n\n" +
        "**Add the heats the same way:**\n\n" +
        "$ \\Delta H = \\Delta H_1 - \\Delta H_2 $\n\n" +
        "$ \\Delta H = -393 - (-283) $\n\n" +
        "$ \\Delta H = -110 $ kJ\n\n" +
        "**Answer:** $ \\Delta H = -110 $ kJ. A number that no flame could ever give you, found by routing through two reactions that flames *can*." },

    // 8 — callout[remember]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Three Moves, and Why They Work',
      markdown: "Treat a thermochemical equation like algebra:\n\n" +
        "- **Reverse** a reaction $ \\rightarrow $ flip the sign of its $ \\Delta H $.\n" +
        "- **Multiply** a reaction by $ n $ $ \\rightarrow $ multiply its $ \\Delta H $ by $ n $.\n" +
        "- **Add** reactions $ \\rightarrow $ add their $ \\Delta H $ values.\n\n" +
        "All three are allowed for one reason only: $ H $ is a state function, so the total heat depends on the start and the end, not the path. That is Hess's law in a single sentence." },

    // 9 — callout[exam_tip]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Hess's-law problems look heavy but they are pure bookkeeping — the three moves (reverse, scale, add) are all you ever need. Don't try to be clever:\n\n" +
        "**Write the target first**, then ask of each given reaction: as written, reversed, or scaled?\n\n" +
        "**Line the equations up** and cancel every species that appears on both sides — what survives must be the target, exactly.\n\n" +
        "**Make $ \\Delta H $ follow the same operations** you did to the equations. If you reversed a reaction, reverse its sign; if you doubled it, double its value. Get the equations to match and the heat falls out on its own." },

    // 10 — inline_quiz (LAST, 3 Qs, varied correct_index)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'A thermochemical equation differs from an ordinary balanced equation because it also states which of the following?',
          options: [
            'The enthalpy change and the physical state of every species',
            'The speed at which the reaction reaches completion',
            'The colour change observed as the reaction proceeds',
            'The catalyst required for the reaction to occur'
          ],
          correct_index: 0,
          explanation: 'A thermochemical equation pins down both the heat change ($ \\Delta H $) and the states of the chemicals, because the heat released or absorbed depends on both. Reaction speed belongs to kinetics, not thermochemistry — that is the tempting wrong choice, since rate feels like part of "how a reaction goes", but it has nothing to do with the heat.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Given $ \\ce{N2(g) + 3H2(g) -> 2NH3(g)} $ with $ \\Delta H = -92 $ kJ, what is $ \\Delta H $ for $ \\ce{2NH3(g) -> N2(g) + 3H2(g)} $?',
          options: [
            '$ -92 $ kJ, since the same chemicals are involved',
            '$ -184 $ kJ, since the reaction is run twice',
            '$ +92 $ kJ, since reversing the reaction flips the sign',
            '$ +46 $ kJ, since the reverse reaction releases half the heat'
          ],
          correct_index: 2,
          explanation: 'Reversing a reaction flips the sign of $ \\Delta H $ but keeps its size, so $ -92 $ kJ becomes $ +92 $ kJ. The trap is to keep it at $ -92 $ kJ as if the heat were a fixed property of ammonia — but $ \\Delta H $ measures the change, and the change reverses when the reaction does.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Hess\'s law lets us add and subtract thermochemical equations to find an unknown $ \\Delta H $. This is possible because enthalpy is which kind of quantity?',
          options: [
            'A path function, so its value depends on the route taken',
            'A rate constant, so it changes with temperature alone',
            'A catalyst-dependent quantity, so it shifts with the catalyst used',
            'A state function, so its value depends only on the start and end'
          ],
          correct_index: 3,
          explanation: 'Because $ H $ is a state function, the total enthalpy change depends only on the initial and final chemicals, not on the path — which is exactly what allows the steps to be added like algebra. Calling it a path function is the inviting error, since the reaction clearly takes a "path" of steps; but it is precisely the path-independence of $ H $ that makes Hess\'s law work.' },
      ] },

    // 11 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*Hess's law lets you build any reaction's heat from steps you can measure. But measuring a fresh chain of steps for every reaction would be exhausting. Next, a tidy reference table — the **standard enthalpies of formation and combustion** — turns Hess's law into a single one-line formula you can apply to almost any reaction.*" },
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
    slug: NEW_SLUG, title: "Thermochemical Equations & Hess's Law",
    subtitle: "A reaction's heat is fixed by where it starts and ends — never by the road between. That single fact lets you measure heats you could never measure directly.",
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'thermochemistry', 'hess-law', 'enthalpy-of-reaction'],
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

  await bw.snapshotVersion(db, doc, "baseline — new thermo page 10 (thermochemical equations & Hess's law)", 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
