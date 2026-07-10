'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc B (Thermochemistry), Page 12.
 * "Calorimetry: Bomb vs Water" — measuring a reaction's heat from the temperature
 * rise it produces, and how the kind of calorimeter (rigid sealed bomb = constant V
 * vs open water/coffee-cup = constant P) decides whether you read off ΔU or ΔH.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (analogies 23, 24;
 * trap "heat at constant V/P", D-exemplars 20 & 24).
 * Reference-first: Mittal §24.5.
 * published:false. Run: node scripts/insert_thermo_p12_calorimetry-bomb-vs-water.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 12;
const NEW_SLUG = 'calorimetry-bomb-vs-water';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5, full)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A sealed steel bomb calorimeter sitting in a tank of water, a thermometer dipping into the water, a tiny flame inside the steel chamber',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A heavy sealed steel cylinder (a bomb calorimeter) submerged in a tank of water, with a slim thermometer dipping into the water beside it. Inside the steel chamber a small sample is burning, shown as a contained orange flame. The heat from the flame is shown spreading as soft orange glow into the surrounding water. The idea: the reaction burns inside the sealed steel, the water around it warms up, and the thermometer reads the rise. Deep near-black background (#0a0a0a), warm orange and amber for the flame and the warming water, cool dim steel-blue for the metal chamber. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook (callout)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Calories on Your Food Label Were Burned, Not Estimated',
      markdown: "The little Calorie number printed on a packet of chips did not come from a formula. The food was sealed inside a small steel chamber called a **bomb calorimeter**, dropped into a bath of water, and set on fire. A spark burns it completely, the water around it warms up, and a thermometer reads the rise. A single peanut, burned this way, can warm a few hundred grams of water by several degrees. Count the joules the water gained, and you have counted the energy the food was holding." },

    // 2 — core concept (text)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Every reaction either releases heat or soaks it up. **Calorimetry** is how we put a number on that heat — not by predicting it, but by *measuring the temperature it produces*. Run the reaction in a known mass of water, watch how much the water warms, and work backwards to the heat.\n\n" +
      "The whole method rests on a simple link between heat and temperature: $ q = mc\\,\\Delta T $, where $ m $ is the mass being warmed, $ c $ is its specific heat, and $ \\Delta T $ is the temperature rise. If you know the calorimeter as one unit instead, you use its heat capacity $ C $: $ q = C\\,\\Delta T $.\n\n" +
      "There is a twist the exam loves. The heat you measure is not always the same quantity — it depends on *how the reaction was held*. Seal it in a rigid box and you get one thing; leave it open to the air and you get another. That single choice is the whole point of this page." },

    // 3 — heading 1 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Measuring Heat by Temperature Rise',
      objective: 'Use $ q = mc\\,\\Delta T $ (or $ q = C\\,\\Delta T $) to turn a measured temperature change into the heat a reaction released or absorbed.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The reaction sits inside a known amount of water. As it runs, it dumps heat into that water (or pulls heat from it), and the thermometer moves. That movement is your raw data.\n\n" +
      "Two routes give you the heat:\n\n" +
      "- **Through the water:** $ q = mc\\,\\Delta T $. Use this when you are told the mass of water and its specific heat ($ c = 4.18 $ J g⁻¹ K⁻¹).\n" +
      "- **Through the calorimeter as a whole:** $ q = C\\,\\Delta T $. Use this when the apparatus is calibrated as a single unit and its heat capacity $ C $ (in J K⁻¹ or kJ K⁻¹) is given.\n\n" +
      "Once you have $ q $ for the small sample you burned, a simple unitary step scales it up to one mole. And a habit to lock in now: combustion *releases* heat, so the reaction's heat change carries a **negative** sign, even though the water got warmer." },

    // 4 — image: bomb calorimeter cross-section (two_third, 16:9)
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Labelled cross-section of a bomb calorimeter: sealed steel bomb, sample cup, ignition wires, surrounding water bath, stirrer, thermometer, insulated outer jacket',
      caption: '📸 Inside a bomb calorimeter — the reaction is sealed in rigid steel; the water bath catches its heat',
      generation_prompt: 'A clean labelled cross-section diagram of a bomb calorimeter on a deep near-black background (#0a0a0a), cutaway view so the inside is visible. Show, from inside out: a small steel sample cup holding the sample, two thin ignition wires reaching into it, the thick-walled sealed steel "bomb" chamber around it (drawn rigid and strong), then a surrounding tank of water with a stirrer paddle and a thermometer dipping in, all wrapped in an insulated outer jacket. Use thin white leader lines with small clean labels: "Sample cup", "Ignition wires", "Sealed steel bomb (rigid — constant volume)", "Water bath", "Stirrer", "Thermometer", "Insulated jacket". Orange/amber glow for the burning sample spreading into the water; cool steel-blue for the metal; calm white labels. Scientific textbook-illustration style, precise and uncluttered.' },

    // 5 — mid-page reasoning_prompt
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "A reaction is run inside a sealed, rigid bomb calorimeter and the water bath warms up. Does the heat you measure equal $ \\Delta H $ or $ \\Delta U $ — and why?",
      options: [
        "$ \\Delta H $, because the heat ends up in the water at atmospheric pressure",
        "$ \\Delta U $, because the rigid sealed chamber keeps the volume constant, so no expansion work is done",
        "$ \\Delta H $, because all combustion reactions are measured as enthalpy",
        "Neither — a bomb calorimeter only gives the temperature change, not any heat quantity"
      ],
      correct_index: 1,
      reveal: "The bomb is rigid and sealed, so the volume cannot change. With no change in volume there is no expansion work, and the first law leaves $ q_V = \\Delta U $. The tempting first option fixates on the water being at atmospheric pressure, but it is the *reaction's* container that decides the quantity, and that container is held at constant volume — so you read $ \\Delta U $, not $ \\Delta H $." },

    // 6 — heading 2 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bomb vs Water — Which One Do You Get?',
      objective: 'Decide whether a calorimeter measures $ \\Delta U $ or $ \\Delta H $ from one fact: is the reaction held at constant volume or constant pressure?' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "There are two everyday calorimeters, and they measure two different quantities because they hold the reaction differently.\n\n" +
      "A **bomb calorimeter** is a thick, sealed steel chamber. Nothing can expand and nothing can leak — the **volume stays fixed**. At constant volume the reaction does no expansion work, so the heat it gives up is the change in internal energy: $ q_V = \\Delta U $.\n\n" +
      "A **water calorimeter** — the simple coffee-cup version is one — is open to the air. The reaction sits at whatever the room's pressure is, and that **pressure stays fixed** while the volume is free to change. At constant pressure the heat measured is the enthalpy change: $ q_P = \\Delta H $.\n\n" +
      "So the apparatus quietly fixes the quantity for you: sealed rigid box gives $ \\Delta U $, open cup gives $ \\Delta H $. Think of it the way the founder frames it — the bomb is the constant-volume box, the cup is the constant-pressure one." },

    // 7 — table: bomb vs water
    { id: uuidv4(), order: n(), type: 'table', caption: 'The container fixes the condition, the condition fixes the quantity',
      headers: ['Calorimeter', 'Held constant', 'Expansion work?', 'Heat measured'],
      rows: [
        ['Bomb (sealed steel)', 'Volume', 'None (rigid)', '$ q_V = \\Delta U $'],
        ['Water / coffee-cup (open)', 'Pressure', 'Yes (free to expand)', '$ q_P = \\Delta H $'],
      ] },

    // 8 — heading 3 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Converting ΔU to ΔH',
      objective: 'Turn a bomb-calorimeter $ \\Delta U $ into the more useful $ \\Delta H $ using $ \\Delta H = \\Delta U + \\Delta n_g RT $.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A bomb gives you $ \\Delta U $, but most chemistry — and most exam questions — wants $ \\Delta H $, the heat at constant pressure. The bridge between them is short:\n\n" +
      "$ \\Delta H = \\Delta U + \\Delta n_g RT $\n\n" +
      "Here $ \\Delta n_g $ is the change in the number of moles of **gas** (gaseous products minus gaseous reactants — count gases only, never solids or liquids), $ R $ is the gas constant, and $ T $ is the temperature in kelvin. The two quantities differ only by the small bit of work the gases would have done expanding against the atmosphere — work the sealed bomb never allowed. If a reaction makes or destroys no gas, $ \\Delta n_g = 0 $ and the two are equal." },

    // 9 — worked_example (solved_example, tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — ΔU of Carbon from a Bomb Run',
      problem: "Burning 0.5 g of carbon in a bomb calorimeter raises the temperature of 2000 g of water by 2.0 K. Take the specific heat of water as $ c = 4.18 $ J g⁻¹ K⁻¹. Find $ \\Delta U $ per mole of carbon.",
      solution: "Ask the founder's three questions first: heat is hiding in the water's temperature rise, the route is $ q = mc\\,\\Delta T $, then scale to one mole.\n\n" +
        "**Heat caught by the water.**\n" +
        "$ q = mc\\,\\Delta T = 2000 \\times 4.18 \\times 2.0 $\n\n" +
        "$ q = 16720 $ J $ \\approx 16.7 $ kJ\n\n" +
        "**That heat came from only 0.5 g of carbon.**\n" +
        "One mole of carbon is 12 g, so scale up by $ \\frac{12}{0.5} = 24 $.\n\n" +
        "$ 16.7 \\times 24 \\approx 401 $ kJ per mole\n\n" +
        "**Fix the sign.**\n" +
        "The reaction released heat (the water warmed), so the heat change is negative:\n\n" +
        "$ \\Delta U \\approx -401 $ kJ/mol\n\n" +
        "**Name the quantity.**\n" +
        "This was a bomb — constant volume — so what you have found is $ \\Delta U $, not $ \\Delta H $.\n\n" +
        "**Answer:** $ \\Delta U \\approx -401 $ kJ per mole of carbon." },

    // 10 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Calorimetry Toolkit',
      markdown: "**Heat from a temperature rise:** $ q = mc\\,\\Delta T $ (or $ q = C\\,\\Delta T $ if the calorimeter's heat capacity is given).\n\n" +
        "**Bomb = constant volume = $ \\Delta U $.** The rigid sealed chamber does no expansion work.\n\n" +
        "**Water / coffee-cup = constant pressure = $ \\Delta H $.** Open to the air, free to expand.\n\n" +
        "**Convert one to the other:** $ \\Delta H = \\Delta U + \\Delta n_g RT $ — count gas moles only.\n\n" +
        "**Combustion is exothermic**, so the sign is negative even though the temperature went up." },

    // 11 — exam_tip callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Examiners rarely say $ \\Delta U $ or $ \\Delta H $ out loud — they hide the quantity in the wording. Learn to translate:\n\n" +
        "**\"heat change at constant volume\" / \"in a sealed rigid bomb\"** → this is $ \\Delta U $.\n\n" +
        "**\"heat change at constant pressure\" / \"in an open vessel\"** → this is $ \\Delta H $.\n\n" +
        "**Classic slip:** the water warmed, so a student writes a positive heat. Combustion is exothermic — the sign is negative. Don't let the rising thermometer trick you into dropping the minus." },

    // 12 — inline_quiz (LAST, 3 Qs, 0.67)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'In a bomb calorimeter, the reaction is held at constant volume. Which quantity does the measured heat equal?',
          options: [
            'The change in enthalpy, $ \\Delta H $',
            'The change in internal energy, $ \\Delta U $',
            'The expansion work done by the gases',
            'The specific heat of the water'
          ],
          correct_index: 1,
          explanation: 'A rigid sealed bomb keeps the volume fixed, so no expansion work is done and the heat is the internal-energy change, $ \\Delta U $. Reading it as $ \\Delta H $ confuses the bomb with the open constant-pressure calorimeter, which is the trap the question is built on.' },
        { id: uuidv4(), difficulty_level: 2,
          question: '500 g of water in a coffee-cup calorimeter warms by 3.0 K during a reaction ($ c = 4.18 $ J g⁻¹ K⁻¹). How much heat did the reaction release?',
          options: [
            'About 6.3 kJ',
            'About 2.1 kJ',
            'About 12.5 kJ',
            'About 6270 kJ'
          ],
          correct_index: 0,
          explanation: 'Use $ q = mc\\,\\Delta T = 500 \\times 4.18 \\times 3.0 = 6270 $ J, about 6.3 kJ. The 2.1 kJ option comes from dividing by the temperature rise instead of multiplying by it, and the 6270 kJ option forgets that 6270 joules is only 6.3 kilojoules.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A bomb calorimeter gives $ \\Delta U $ for a reaction. To convert it to $ \\Delta H $, which correction term do you add?',
          options: [
            'The total moles of all products and reactants times $ RT $',
            'The mass of water times its specific heat',
            'The change in moles of gas, $ \\Delta n_g $, times $ RT $',
            'Nothing — $ \\Delta U $ and $ \\Delta H $ are always equal'
          ],
          correct_index: 2,
          explanation: 'The bridge is $ \\Delta H = \\Delta U + \\Delta n_g RT $, where $ \\Delta n_g $ counts only the change in moles of gas. Counting every species (the first option) overcounts, because solids and liquids do almost no expansion work; assuming the two are always equal ignores reactions that create or destroy gas.' },
      ] },

    // 13 — bridge to next page (text)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now read a reaction's heat straight from the temperature it produces, and name whether you have $ \\Delta U $ or $ \\Delta H $. Next, a way to get that heat without burning anything at all — estimating it from the bonds broken and the bonds formed, which leads us to bond enthalpy and resonance energy.*" },
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
    slug: NEW_SLUG, title: 'Calorimetry: Bomb vs Water',
    subtitle: 'Measure a reaction’s heat by the temperature it produces — and the kind of calorimeter you use decides whether you get ΔU or ΔH.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'calorimetry', 'bomb-calorimeter', 'delta-u-delta-h'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 12 (calorimetry: bomb vs water)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
