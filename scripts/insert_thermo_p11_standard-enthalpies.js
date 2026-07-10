'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc B (Thermochemistry), Page 11.
 * "Standard Enthalpies: Formation & Combustion" — fix a zero point (the most stable
 * form of every element), tabulate every compound against it, and any reaction's heat
 * becomes a one-line products-minus-reactants subtraction. Standard state, ΔHf°,
 * ΔH°(rxn) = Σ products − Σ reactants, enthalpy of combustion.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (exemplar B "chosen sea-level zero").
 * Reference-first: Mittal §24.7 + §24.8 + NCERT Class 11 Ch.5.
 * published:false. Run: node scripts/insert_thermo_p11_standard-enthalpies.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 11;
const NEW_SLUG = 'standard-enthalpies';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5, full)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A single peanut burning brightly inside a sealed calorimeter chamber, the released heat warming a small cup of water beside it',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Inside a sealed metal calorimeter chamber, a single peanut burns with a bright warm flame. Around the chamber, a coil of tubing carries the released heat into a small cup of water, which is shown gently steaming. The visual idea: the "calories" on a food packet are the heat released when the food is burned. Deep near-black background (#0a0a0a), warm orange and amber glow from the burning peanut and the heated water, cool dim steel tones for the chamber walls. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — hook (callout fun_fact)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Number On Your Food Packet',
      markdown: "The \"calories\" printed on a packet of chips are not a guess. They are an **enthalpy of combustion** — the heat released when that food is burned completely in oxygen. A single peanut, burned inside a calorimeter, gives off enough heat to bring a small cup of water close to boiling. Your body runs the same combustion, just slower and gentler." },

    // 2 — core text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Every reaction releases or absorbs a certain amount of heat. Measuring that heat one reaction at a time would take forever. So chemists did something clever: they picked one fixed starting point, measured every compound against it once, and tabulated the results.\n\n" +
      "After that, finding the heat of any reaction stops being an experiment. It becomes a one-line subtraction. To make that work, two things had to be agreed first: a fixed set of conditions to measure under, and a chosen zero to measure from." },

    // 3 — heading 1 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Standard States and a Chosen Zero',
      objective: 'State what the standard state is, and explain why the most stable form of every element is assigned an enthalpy of formation of zero.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The **standard state** of a substance is the pure substance at a pressure of 1 bar, at a stated temperature — almost always 298 K (25 °C). When a quantity is measured under these conditions, we mark it with a small degree symbol, like $ \\Delta H^\\circ $.\n\n" +
      "Now the chosen zero. You cannot measure the *absolute* energy stored in a compound, only changes. So chemists fixed a sea-level mark: the most stable form of every element, in its standard state, is assigned a value of exactly zero. Graphite, $ \\ce{O2} $ gas, liquid $ \\ce{Br2} $, rhombic sulphur — each is a zero. Every compound's energy is then measured as a height above or below that chosen sea level." },

    // 4 — image (two_third, 16:9)
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', aspect_ratio: '16:9', src: '',
      alt: 'A horizontal sea-level line marked zero, with element symbols sitting on it and compounds shown as bars dipping below it',
      caption: '📸 Elements sit at the chosen sea-level zero; compounds are measured as a drop below it',
      generation_prompt: 'A clean energy-level diagram on a deep near-black background (#0a0a0a). A long horizontal glowing line runs across the middle, labelled with a small "0" at the left edge — this is the chosen zero. Sitting exactly on this line are a few element tiles: graphite (C), an O2 molecule, a Br2 liquid drop, a sulphur crystal. Below the line, two or three compound bars drop downward to lower levels (a deeper, more stable position), connected to the line by thin vertical guide lines, suggesting their negative enthalpy of formation. Warm orange and amber for the zero line and the elements, cooler amber for the descending compound bars. Minimal white labels for the element symbols only. Clean scientific-illustration style.' },

    // 5 — mid-page reasoning_prompt
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'conceptual', difficulty_level: 1,
      prompt: "Oxygen gas, $ \\ce{O2(g)} $, is the form oxygen naturally takes around us. What is its standard enthalpy of formation, $ \\Delta H_f^\\circ $?",
      options: [
        "Zero — it is an element already in its most stable standard state",
        "Negative — forming any substance releases heat",
        "Positive — gases store more energy than solids",
        "It cannot be defined for a gas"
      ],
      correct_index: 0,
      reveal: "The first reflex is to reach for a non-zero number, since the other forms of oxygen feel like they should differ. But $ \\ce{O2(g)} $ is an element in its most stable form at standard conditions, and that is exactly the chosen sea level. Forming $ \\ce{O2} $ from $ \\ce{O2} $ is no change at all, so $ \\Delta H_f^\\circ = 0 $. (Ozone, $ \\ce{O3} $, is a different and less stable form, and it does carry a non-zero value.)" },

    // 6 — heading 2 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Enthalpy of Formation',
      objective: 'Define the standard enthalpy of formation, and use a table of these values to find any reaction enthalpy by products minus reactants.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The **standard enthalpy of formation**, $ \\Delta H_f^\\circ $, is the enthalpy change when **1 mole** of a compound forms from its elements, each in its standard state. By the rule above, it is zero for an element in its most stable form, and some measured value for every compound.\n\n" +
      "Once you have these tabulated, any reaction's heat falls out of a single equation. The standard enthalpy of a reaction is the total formation enthalpy of the products minus that of the reactants:\n\n" +
      "$ \\Delta H^\\circ = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) $\n\n" +
      "Each value is multiplied by the number of moles in the balanced equation. Any element sitting in its standard state contributes zero, so it simply drops out of the sum." },

    // 7 — heading 3 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Enthalpy of Combustion',
      objective: 'Define the standard enthalpy of combustion and recognise that it is always negative.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The **standard enthalpy of combustion** is the heat released when **1 mole** of a substance burns completely in oxygen, under standard conditions. Complete means the carbon ends up as $ \\ce{CO2} $ and the hydrogen as $ \\ce{H2O} $, with nothing left half-burnt.\n\n" +
      "Burning always gives out heat, so this quantity is always negative. It is the number behind the calories on a food packet and behind the energy value of every fuel. The worked example below uses formation enthalpies to find one such combustion heat." },

    // 8 — worked example (solved_example, tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Combustion of Methane',
      problem: "Find $ \\Delta H^\\circ $ for the combustion of methane, $ \\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)} $, using these standard enthalpies of formation (kJ/mol): $ \\ce{CH4} = -75 $, $ \\ce{CO2} = -393 $, $ \\ce{H2O(l)} = -286 $, and $ \\ce{O2} = 0 $.",
      solution: "First, given what and unknown what. The route is one line: products minus reactants.\n\n" +
        "**Write the rule.** $ \\Delta H^\\circ = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) $\n\n" +
        "**Products side.** One $ \\ce{CO2} $ and two $ \\ce{H2O(l)} $, so $ (-393) + 2(-286) = -393 - 572 = -965 $ kJ.\n\n" +
        "**Reactants side.** One $ \\ce{CH4} $ and two $ \\ce{O2} $, so $ (-75) + 2(0) = -75 $ kJ. The oxygen is an element in its standard state, so it drops out.\n\n" +
        "**Subtract.** $ \\Delta H^\\circ = (-965) - (-75) = -965 + 75 = -890 $ kJ/mol.\n\n" +
        "The answer is negative, which fits — combustion releases heat. An easy question once you see it is just products minus reactants, with the element value falling away." },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Lock These In',
      markdown: "$ \\Delta H_f^\\circ = 0 $ for the most stable form of an element — **graphite, not diamond**; $ \\ce{O2} $, not $ \\ce{O3} $. Any reaction's heat is $ \\Delta H^\\circ_{rxn} = \\sum \\Delta H_f^\\circ(\\text{products}) - \\sum \\Delta H_f^\\circ(\\text{reactants}) $, each value scaled by its mole count. And combustion is always exothermic, so its enthalpy is always negative." },

    // 10 — exam_tip callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Two slips cost most of the marks here.\n\n" +
        "**Direction.** It is products **minus** reactants, never the other way. Reverse it and your sign flips. An element in its standard state contributes **zero**, so it leaves the sum quietly — don't go hunting for its value.\n\n" +
        "**Physical state.** $ \\ce{H2O(l)} $ and $ \\ce{H2O(g)} $ have **different** formation enthalpies — they differ by the heat of vaporisation. Combustion data always assumes **liquid** water is formed, so use the $ \\ce{H2O(l)} $ value unless the question clearly says vapour." },

    // 11 — inline_quiz (LAST, 3 Qs, 0.67)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'What is the standard enthalpy of formation of solid graphite at 298 K and 1 bar?',
          options: [
            'Zero, because graphite is the most stable form of carbon',
            'Equal to the enthalpy of formation of diamond',
            'A large negative value, since carbon stores much energy',
            'Positive, because solids are harder to form than gases'
          ],
          correct_index: 0,
          explanation: 'Graphite is the most stable form of the element carbon under standard conditions, so it sits at the chosen zero and its formation enthalpy is zero. The diamond answer is the tempting trap, but diamond is a less stable form of carbon and carries a small positive value, so the two are not equal.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For the reaction $ \\ce{A + B -> C} $, the standard enthalpy of formation values are $ \\ce{A} = -40 $, $ \\ce{B} = 0 $, and $ \\ce{C} = -110 $ kJ/mol. What is $ \\Delta H^\\circ $ for the reaction?',
          options: [
            '$ -70 $ kJ/mol',
            '$ -150 $ kJ/mol',
            '$ +70 $ kJ/mol',
            '$ -110 $ kJ/mol'
          ],
          correct_index: 0,
          explanation: 'Products minus reactants gives $ (-110) - [(-40) + 0] = -110 + 40 = -70 $ kJ/mol. The $ -150 $ trap comes from adding the reactant value instead of subtracting it, which is the most common sign slip on this formula.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A combustion question gives the enthalpy of formation of water vapour, but the standard combustion equation forms liquid water. What should you do?',
          options: [
            'Use the liquid-water formation value, since combustion data assumes liquid water',
            'Use the vapour value directly, since any water value works',
            'Set the water formation enthalpy to zero, since water is stable',
            'Average the liquid and vapour values together'
          ],
          correct_index: 0,
          explanation: 'Combustion is defined as forming liquid water, and $ \\ce{H2O(l)} $ and $ \\ce{H2O(g)} $ have different formation enthalpies, so you need the liquid value. Using the vapour value directly is the tempting shortcut, but it ignores the heat of vaporisation and gives a wrong combustion enthalpy.' },
      ] },

    // 12 — bridge text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now turn a table of formation enthalpies into any reaction's heat with one subtraction. But where do those formation values come from in the first place? Next, **calorimetry** — how this heat is actually trapped and measured in the lab, in a bomb and in a simple cup.*" },
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
    slug: NEW_SLUG, title: 'Standard Enthalpies: Formation & Combustion',
    subtitle: 'Fix a zero point, tabulate every compound against it, and any reaction\'s heat becomes a one-line subtraction.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'enthalpy-of-formation', 'enthalpy-of-combustion', 'standard-state'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 11 (standard enthalpies of formation & combustion)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
