'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc A, Page 3.
 * "Heat, Work & Internal Energy" — three ways to talk about energy: one stored
 * inside the system (internal energy, a state function), two that exist only while
 * crossing the boundary (heat and work). Plus the modern IUPAC/NCERT sign convention
 * ("energy into the system is positive") and ΔU = q + w.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (exemplar D2:
 * "is gilaas paani mein itna work hai?" — heat/work are not stored, they live at the
 * boundary during transfer).
 * Reference-first: Mittal §23.4, §23.5.1–4, §23.6 + NCERT Class 11 Ch.5 sign convention.
 * published:false. Run: node scripts/insert_thermo_p3_heat-work-internal-energy.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 3;
const NEW_SLUG = 'heat-work-internal-energy';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A hand pumping a bicycle pump, the metal barrel glowing warm orange where it has heated up from the pumping',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A hand gripping a bicycle pump mid-stroke, pushing the handle down hard. The metal barrel of the pump glows warm orange near the bottom, showing it has heated up from the pumping — soft heat shimmer rising off it. The idea: you did work on the air inside, and heat appeared. Deep near-black background (#0a0a0a), warm orange and amber glow concentrated at the heated barrel, cool dim steel tones for the rest of the pump, faint motion blur on the moving handle. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Energy Changing Costume',
      markdown: "Pump a bicycle tyre hard and the barrel of the pump gets hot in your hand. Rub your two palms together fast and they warm up too. In both cases you pushed — you did **work** — and **heat** showed up out of nowhere.\n\nThe energy was never lost. It just changed costume: from the work of your muscles into the warmth you can feel. This page is about the three names energy goes by — and the one big difference between them." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Energy in thermodynamics comes in three flavours, and the whole chapter rides on telling them apart.\n\n" +
      "**Internal energy** is the energy a system *has* — stored inside it, right now, whether or not anything is happening. **Heat** and **work** are energy a system *gains or loses* — they only exist while energy is on the move across the boundary.\n\n" +
      "Think of it like money. The cash sitting in your account is one thing. Money flowing in or out is another. You would never point at your bank balance and call part of it \"a deposit\" — a deposit is something that *happened*, not something stored. Heat and work are the deposits and withdrawals; internal energy is the balance." },

    // 3 — heading: internal energy
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: "Internal Energy — the System's Hidden Store",
      objective: "Say what internal energy ($U$) is made of, why it is a state function, and why we only ever talk about its change $\\Delta U$." },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Zoom into any system — the gas in a cylinder, the water in a glass — and you find particles in ceaseless motion, pulling and pushing on each other. Add up *all* of it: the kinetic energy of every moving particle plus the potential energy of every interaction between them. That grand total is the **internal energy**, written $ U $.\n\n" +
      "Internal energy is a **state function** — it depends only on the present condition of the system (its temperature, pressure, amount), not on the route taken to get there. Two glasses of water at the same temperature and amount hold the same $ U $, no matter how one was heated and the other cooled to reach it.\n\n" +
      "Here is the honest catch: you can never measure the *absolute* value of $ U $. There is no zero mark on the tank. What you can measure — and all you ever need — is the **change**, $ \\Delta U $, from a start state to an end state." },

    // 4 — image: internal energy as a store
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A sealed container of gas with many particles zipping around inside, the total stored energy shown as a glowing fill-level inside the container',
      caption: '📸 Internal energy is the total energy stored in all the particles — only its change can be measured',
      generation_prompt: 'A clean scientific illustration on a deep near-black background (#0a0a0a). A sealed rounded container of gas, with many small glowing orange particles zipping around inside, short motion-trail arrows on each showing kinetic energy, and faint connecting lines between nearby particles suggesting potential energy of interaction. Beside or behind the container, a vertical "fuel-gauge" style glowing amber fill bar labelled only with a small "U" at the top, drawn with the zero mark crossed out or faded to show the absolute value is unknown — only the change is measurable. Orange and amber accents, cool dim background. Minimal white labels (only "U"). No other text.' },

    // 5 — heading: heat and work
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Heat and Work — Energy Only in Transit',
      objective: 'Explain why heat ($q$) and work ($w$) are not stored inside a system, and name what drives each one across the boundary.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Now the most useful idea on this page. **Heat** and **work** are *not* things a system contains. You cannot point at a glass of water and ask how much heat is *in* it — that question has no answer, the same way \"how much work is stored in this glass?\" has no answer. Heat and work only exist at the **boundary, during transfer.** Once the transfer stops, there is no heat and no work left over — only a changed internal energy.\n\n" +
      "What separates the two is *what drives the energy across*:\n\n" +
      "- **Heat** ($ q $) is energy that crosses the boundary because of a **temperature difference** — from the hotter side to the colder side. A flame heating a beaker moves energy as heat.\n" +
      "- **Work** ($ w $) is energy that crosses when a **force acts through a distance**. In chemistry this is almost always **pressure–volume work** — a gas expanding against a piston, or being squeezed by one." },

    // 6 — reasoning_prompt (mid-page)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "A gas is compressed — the surroundings push the piston in on it — and at the same moment the gas gives out heat to the room. Using the convention \"energy into the system is positive\", what are the signs of the work $ w $ and the heat $ q $ for the gas?",
      options: [
        "$ w $ is positive and $ q $ is negative — work is done on the gas, but heat leaves it",
        "$ w $ is negative and $ q $ is positive — the gas does work and absorbs heat",
        "Both $ w $ and $ q $ are positive — the gas is being compressed and warmed",
        "Both $ w $ and $ q $ are negative — energy leaves the gas in both ways"
      ],
      correct_index: 0,
      reveal: "The surroundings push *on* the gas, so energy enters the gas as work — energy in is positive, so $ w > 0 $. At the same time heat *leaves* the gas to the room — energy out is negative, so $ q < 0 $. The two run in opposite directions, which is exactly why you read each one separately before adding them in $ \\Delta U = q + w $. The tempting trap is to assume both share a sign because they happen together; they do not." },

    // 7 — heading: sign convention
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Sign Convention — Energy In Is Positive',
      objective: "Assign the correct sign to $ q $ and $ w $ from one rule, and write the first law as $ \\Delta U = q + w $." },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "There is one rule to remember, and everything else falls out of it: **energy that goes *into* the system is positive; energy that *leaves* is negative.** This is the modern IUPAC convention, the one NCERT uses.\n\n" +
      "Apply it to heat and work:\n\n" +
      "- $ q > 0 $ — heat is **absorbed** by the system (an **endothermic** change).\n" +
      "- $ q < 0 $ — heat is **released** by the system (an **exothermic** change).\n" +
      "- $ w > 0 $ — work is done **on** the system (it is **compressed** — energy pushed in).\n" +
      "- $ w < 0 $ — work is done **by** the system (it **expands** — energy pushed out).\n\n" +
      "Put the two transfers together and you get the change in the stored energy — the **first law of thermodynamics**:\n\n" +
      "$ \\Delta U = q + w $\n\n" +
      "In plain words: whatever energy comes in as heat, plus whatever comes in as work, is exactly what the internal energy gains. Nothing leaks." },

    // 8 — image: sign convention map
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A central box labelled "system" with arrows: heat and work coming in marked positive, heat and work leaving marked negative',
      caption: '📸 One rule for every sign: energy into the system is positive, energy out is negative',
      generation_prompt: 'A clean scientific illustration on a deep near-black background (#0a0a0a). A central rounded box labelled "SYSTEM" in white. Four glowing arrows: a heat arrow and a work arrow pointing INTO the box, each tagged with a small "+" in green; a heat arrow and a work arrow pointing OUT of the box, each tagged with a small "−" in red. The inbound arrows glow brighter orange, the outbound arrows cooler. A short equation "U = q + w" floating above using a Greek delta before U. Orange/amber accents for the arrows, green plus and red minus signs, minimal white labels (SYSTEM, q, w only). No other text.' },

    // 9 — worked example
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Give Each Transfer a Sign',
      problem: "Using the convention \"energy in is positive\", assign the sign of $ q $ and of $ w $ in each case: (a) a block of ice melts, absorbing heat from the room, with no change in volume worth counting; (b) a gas expands and pushes a piston outward while absorbing heat; (c) a gas is compressed by the surroundings and releases heat to them.",
      solution: "Each time, ask the one question: *for the system, is this energy coming in (positive) or going out (negative)?*\n\n" +
        "**(a) Ice melting.** Heat flows from the warm room *into* the ice, so energy comes in: $ q > 0 $ (endothermic). The volume barely changes, so no real expansion or compression happens: $ w \\approx 0 $.\n\n" +
        "**(b) Gas expanding while heated.** Heat enters the gas, so $ q > 0 $. But the gas pushes the piston *outward* — it does work *on* the surroundings, so energy leaves as work: $ w < 0 $.\n\n" +
        "**(c) Gas compressed while cooling.** The surroundings push *on* the gas, so work goes *into* it: $ w > 0 $. Heat is released to the room, so energy leaves: $ q < 0 $.\n\n" +
        "**Reading the pattern:** absorbed heat and compression are energy *in* (positive); released heat and expansion are energy *out* (negative). Once you can tag each transfer, $ \\Delta U = q + w $ is just bookkeeping." },

    // 10 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'One Rule, Every Sign',
      markdown: "**Energy into the system is positive; energy out is negative.** That single line gives you all four signs:\n\n" +
        "Heat absorbed $ q > 0 $ · heat released $ q < 0 $ · compression (work on system) $ w > 0 $ · expansion (work by system) $ w < 0 $.\n\n" +
        "And they add up to the change in what is stored: $ \\Delta U = q + w $." },

    // 11 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "The classic trap here is a **convention mix-up.** NCERT and JEE use the modern form: energy *in* is positive, so $ \\Delta U = q + w $, and the expansion work is $ w = -P_{ext}\\,\\Delta V $.\n\n" +
        "Some **older books** write the work done *by* the system as positive instead — so they use $ w = +P\\,\\Delta V $ and $ \\Delta U = q - w $. Both are internally correct, but they label the *same* expansion with *opposite* signs.\n\n" +
        "Pick the modern convention, write $ \\Delta U = q + w $ at the top of your rough sheet, and never switch halfway through a problem. Most sign errors in this chapter are not physics mistakes — they are someone mixing the two conventions mid-solution." },

    // 12 — inline_quiz (§3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Which of these is energy *stored inside* a system, rather than energy that only exists while crossing the boundary?',
          options: [
            'Heat',
            'Work',
            'Internal energy',
            'Both heat and work together'
          ],
          correct_index: 2,
          explanation: 'Internal energy is the total energy the system holds in its particles right now — it is stored, and it is a state function. Heat and work are different in kind: they exist only while energy is moving across the boundary, so neither one is ever "stored" inside the system.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A gas absorbs heat from a flame and, at the same time, expands and pushes a piston outward. Using the convention that energy entering the system is positive, what are the signs of $ q $ and $ w $ for the gas?',
          options: [
            '$ q < 0 $ and $ w > 0 $ — heat leaves and work enters',
            '$ q > 0 $ and $ w < 0 $ — heat enters but the gas does work on the surroundings',
            '$ q > 0 $ and $ w > 0 $ — both energies enter the gas',
            '$ q < 0 $ and $ w < 0 $ — both energies leave the gas'
          ],
          correct_index: 1,
          explanation: 'Heat flows into the gas, so $ q $ is positive. But the gas pushes the piston outward, doing work on the surroundings — energy leaves as work, so $ w $ is negative. The trap is assuming both share a sign because they happen at once; absorbing heat and expanding point in opposite directions.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For a closed system, the first law of thermodynamics is correctly written (in the modern "energy in is positive" convention) as which of the following?',
          options: [
            '$ \\Delta U = q + w $, where $ w $ is positive when work is done on the system',
            '$ \\Delta U = q - w $, where $ w $ is positive when work is done on the system',
            '$ \\Delta U = q \\times w $, the product of the two transfers',
            '$ \\Delta U = w - q $, where heat is always subtracted'
          ],
          correct_index: 0,
          explanation: 'In the modern convention, every energy entering the system is added, so $ \\Delta U = q + w $ with $ w > 0 $ for work done on the system. The $ \\Delta U = q - w $ form belongs to the older convention where $ w $ counts work done *by* the system as positive — correct in that book, but it must not be mixed with this one. Energy transfers add; they are never multiplied.' },
      ] },

    // 13 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now name energy three ways and give every transfer the right sign. One of those transfers — pressure–volume work — is the one you will actually compute again and again. Next: how much work a gas really does when it pushes a piston, and why a slow push and a sudden one give different answers.*" },
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
    slug: NEW_SLUG, title: 'Heat, Work & Internal Energy',
    subtitle: 'Three ways to talk about energy — one is stored inside, two exist only while crossing the boundary.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'internal-energy', 'heat-work', 'sign-convention'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 3 (heat, work, internal energy, sign convention)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
