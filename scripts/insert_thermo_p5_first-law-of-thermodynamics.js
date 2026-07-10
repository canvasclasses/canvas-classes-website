'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc A, Page 5.
 * "The First Law of Thermodynamics" — conservation of energy written for a system:
 * ΔU = q + w. U is a state function; cyclic ⇒ ΔU = 0 ⇒ q = −w; isolated ⇒ ΔU = 0.
 * His analogy: the kharcha (spending) ledger — energy in either raises the internal
 * store or gets spent as work; nothing vanishes (THERMO-exemplars "ΔH bookkeeping").
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md.
 * Reference-first: Mittal §23.8 + NCERT Class 11 Ch.5.
 * published:false. Run: node scripts/insert_thermo_p5_first-law-of-thermodynamics.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 5;
const NEW_SLUG = 'first-law-of-thermodynamics';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A glowing energy ledger balance: heat flowing into a piston-cylinder on one side, work pushing the piston out on the other, the leftover energy stored as a warm core inside',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A single piston-and-cylinder shown in cross-section, glowing with stored warmth inside. From the left, a stream of wavy orange heat arrows flows INTO the cylinder. To the right, the piston is being pushed outward, with a clear arrow showing work leaving. Inside the cylinder, a softly glowing amber core represents the energy that stayed — the internal store. The whole thing reads like a balance sheet of energy: some came in, some left as work, the rest stayed. Deep near-black background (#0a0a0a), warm orange and amber accents for heat and stored energy, cool dim blue for the piston metal, subtle volumetric glow. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook (real-life)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Machine Nobody Could Ever Build',
      markdown: "For centuries, inventors tried to build a machine that runs forever and pours out free energy with nothing fed in — a **perpetual motion machine.** Patent offices received hundreds of designs. Every single one failed. Not because the gears were badly made, but because there is simply no free energy lying around to collect. You can only ever move energy from one place to another, never conjure it from nothing. The law that explains exactly why every such machine was doomed is the one on this page." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Energy is never created and never destroyed. It only moves from one place to another, or changes from one form to another. That is the **First Law of Thermodynamics**, and it is the strictest accounting rule in all of science.\n\n" +
      "Written for a thermodynamic system, it becomes one short equation:\n\n" +
      "$ \\Delta U = q + w $\n\n" +
      "Here $ \\Delta U $ is the change in the system's **internal energy** — its total stored energy. $ q $ is the heat that flows in or out, and $ w $ is the work done on or by the system. Read it plainly: the change in what a system stores equals everything that came in as heat plus everything that came in as work. Nothing leaks out of the books." },

    // 3 — heading: writing ΔU = q + w
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Energy Is Conserved — the Master Equation',
      objective: 'See the First Law as a balance sheet: the change in a system\'s internal store equals the heat plus the work it received.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Think of the system's internal energy like a bank balance, and the First Law like a bank statement. The change in your balance equals money in minus money out — nothing appears or vanishes on its own.\n\n" +
      "Picture a gas in a cylinder. Suppose you supply it **100 kJ** of heat. The gas pushes the piston outward and **20 kJ** of that gets spent doing work on the surroundings. Where did the energy go? Twenty kilojoules walked out the door as work. The remaining **80 kJ** stayed inside, raising the internal store. Add it up: $ 100 - 20 = 80 $. Heat in, minus work spent, equals the rise in internal energy. Not one joule went missing — it was only moved." },

    // 4 — image: the ledger
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A spending-ledger diagram: 100 kJ of heat flowing in, 20 kJ leaving as work pushing a piston, 80 kJ remaining stored as internal energy',
      caption: '📸 The energy ledger — 100 kJ in, 20 kJ spent as work, 80 kJ left in the store',
      generation_prompt: 'A clean balance-sheet style diagram on a deep near-black background (#0a0a0a). On the left, a bold orange arrow labelled with a glowing "100" flows into a piston-cylinder. From the cylinder, a smaller arrow labelled "20" leaves to the right, pushing a piston outward (the work spent). Inside the cylinder, a warm amber glowing core is labelled "80" — the internal energy that stayed. Show it visually like a simple ledger: in (100) = spent as work (20) + stored (80). Orange for heat, a cooler tone for work leaving, amber glow for stored energy. Minimal white numeric labels only (100, 20, 80). Clean scientific-illustration style, no extra text.' },

    // 5 — reasoning_prompt (mid-page)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'quantitative', difficulty_level: 2,
      prompt: "50 J of heat is supplied to a gas, and the gas does 30 J of work pushing a piston outward. Using $ \\Delta U = q + w $, what is the change in internal energy?",
      options: [
        "$ +80 $ J — added the heat and the work together",
        "$ +20 $ J — heat in is $ +50 $, work done by the gas is $ -30 $, so $ 50 + (-30) $",
        "$ -20 $ J — work done is positive, heat is negative",
        "$ +50 $ J — only the heat counts toward internal energy"
      ],
      correct_index: 1,
      reveal: "Heat supplied TO the gas is positive, so $ q = +50 $ J. The gas does work ON the surroundings, so that energy leaves it: $ w = -30 $ J. Then $ \\Delta U = q + w = 50 + (-30) = +20 $ J. The tempting trap is adding 50 and 30 to get 80 — but work done BY the system is a loss, not a gain, so it must be subtracted." },

    // 6 — heading: reading the equation
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Reading the Equation in Practice',
      objective: 'Fix the signs correctly: heat in and work done on the system are positive; heat out and work done by the system are negative.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The whole equation lives or dies on signs, so fix them once and never guess again:\n\n" +
      "- **Heat in** ($ q > 0 $): energy enters the system. **Heat out / released** ($ q < 0 $): energy leaves.\n" +
      "- **Work done ON the system** ($ w > 0 $): the surroundings push energy in (compressing a gas). **Work done BY the system** ($ w < 0 $): the system spends energy pushing outward (a gas expanding against a piston).\n\n" +
      "There is a second, deeper point. Internal energy $ U $ is a **state function** — it depends only on the system's current state, not on the route it took to get there. So $ \\Delta U $ between a fixed start and a fixed finish is **always the same number**, even though $ q $ and $ w $ on their own each depend on the path. NCERT states this exactly: $ \\Delta U $ does not discriminate between reversible and irreversible paths. For the same initial and final states, $ \\Delta U $ is identical — only how it splits into $ q $ and $ w $ changes." },

    // 7 — worked example: the ledger
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — The Energy Ledger',
      problem: "100 J of heat is added to a system while 40 J of work is done BY the system on the surroundings. Find the change in internal energy, $ \\Delta U $.",
      solution: "**Heat term.** Heat is added TO the system, so it enters the books as a gain.\n\n" +
        "$ q = +100 $ J\n\n" +
        "**Work term.** The work is done BY the system on the surroundings, so that energy leaves the system — it is negative.\n\n" +
        "$ w = -40 $ J\n\n" +
        "**Apply the First Law.** Put both into $ \\Delta U = q + w $.\n\n" +
        "$ \\Delta U = 100 + (-40) $\n\n" +
        "$ \\Delta U = +60 $ J\n\n" +
        "**What it means.** Of the 100 J supplied, 40 J went out as work pushing the surroundings, and the remaining 60 J stayed inside as a rise in internal energy. Money in, money out, balance left over — exactly a ledger." },

    // 8 — heading: two special cases
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Two Special Cases — Cyclic and Isolated',
      objective: 'Use $ \\Delta U = 0 $ in two situations — a process that returns to its start, and a system that exchanges nothing — and read off what it forces.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Two situations make $ \\Delta U $ collapse to zero, and each tells you something powerful.\n\n" +
      "**Cyclic process.** The system goes through a series of changes and then returns to *exactly* its starting state. Since $ U $ is a state function and the start equals the finish, $ \\Delta U = 0 $. The First Law then forces $ q + w = 0 $, so $ q = -w $. Whatever net heat the system absorbed over the whole cycle, it gave back out as an equal amount of net work — no matter how complicated the cycle looked.\n\n" +
      "**Isolated system.** By definition it exchanges neither heat nor matter with anything: $ q = 0 $ and $ w = 0 $. So $ \\Delta U = 0 + 0 = 0 $. Its internal energy is constant. The whole universe is the one truly isolated system there is — which is why we say the energy of the universe is fixed." },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Four Things to Carry Forward',
      markdown: "**The First Law:** $ \\Delta U = q + w $.\n\n" +
        "**Internal energy $ U $ is a state function** — $ \\Delta U $ depends only on start and finish, never on the path.\n\n" +
        "**Cyclic process:** start = finish, so $ \\Delta U = 0 $, which forces $ q = -w $.\n\n" +
        "**Isolated system:** $ q = 0 $ and $ w = 0 $, so $ \\Delta U = 0 $ — its energy never changes." },

    // 10 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Marks are lost on **signs**, not on the formula. Train two reflexes:\n\n" +
        "**\"Work done BY the system\"** means the system spent energy outward, so $ w $ is **negative**. **\"Heat released\"** means energy left, so $ q $ is **negative**. A single missed sign flips the whole answer.\n\n" +
        "For any **cyclic process**, $ \\Delta U = 0 $ is automatic, so the net heat exchanged equals the net work output ($ q = -w $) — true no matter how tangled the cycle looks on a PV diagram. Spot the word \"cyclic\" and you already have one equation for free." },

    // 11 — inline_quiz (§3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'The First Law of Thermodynamics is essentially a statement of which principle?',
          options: [
            'Energy is conserved — it can be moved or converted but never created or destroyed',
            'Energy always flows from hot bodies to cold bodies',
            'The entropy of the universe always increases',
            'Heat and work are different forms of the same quantity and are always equal'
          ],
          correct_index: 0,
          explanation: 'The First Law is conservation of energy written for a system: $ \\Delta U = q + w $. The flow from hot to cold and the rise of entropy belong to the Second Law, not the First. Heat and work are both energy in transit, but they are not required to be equal.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A gas absorbs 200 J of heat and, in the same process, 75 J of work is done ON the gas by the surroundings. What is $ \\Delta U $?',
          options: [
            '$ +125 $ J — subtracted the work because the gas was compressed',
            '$ +200 $ J — only the heat changes the internal energy',
            '$ +275 $ J — heat in is $ +200 $ and work done on the gas is $ +75 $',
            '$ -275 $ J — both heat and work leave the gas'
          ],
          correct_index: 2,
          explanation: 'Heat absorbed gives $ q = +200 $ J. Work done ON the gas adds energy to it, so $ w = +75 $ J (positive). Then $ \\Delta U = 200 + 75 = +275 $ J. The $ +125 $ trap comes from wrongly treating work done on the gas as a loss and subtracting it.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'In a cyclic process the system returns to its exact starting state. Which statement is therefore always true?',
          options: [
            'The heat absorbed must be zero because the system came back',
            'The work done must be zero because nothing changed overall',
            '$ \\Delta U = 0 $, so the net heat absorbed equals the net work done by the system ($ q = -w $)',
            '$ \\Delta U $ is positive, because energy was supplied to drive the cycle'
          ],
          correct_index: 2,
          explanation: 'Internal energy is a state function and the start equals the finish, so $ \\Delta U = 0 $ over any cycle. The First Law then gives $ q + w = 0 $, i.e. $ q = -w $. The heat and the work are not individually zero — a cycle can absorb plenty of heat and give back an equal net work; only their sum vanishes.' },
      ] },

    // 12 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now balance any system's energy with $ \\Delta U = q + w $. But here is the practical catch: most reactions don't happen in sealed cylinders — they happen in open flasks on a bench, where the pressure stays fixed and the system is free to push the air aside. For that everyday setting, a more convenient energy than $ U $ quietly takes over. Next: **Enthalpy**.*" },
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
    slug: NEW_SLUG, title: 'The First Law of Thermodynamics',
    subtitle: 'Energy is never created or destroyed — it is only moved or converted. This is the strictest accounting rule in science.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'first-law', 'internal-energy', 'conservation'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 5 (first law of thermodynamics)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
