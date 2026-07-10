'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc A, Page 1.
 * "System, Surroundings & the Universe" — the first move of every thermo problem:
 * drawing the boundary. Open / closed / isolated systems; system + surroundings = universe.
 * This is the FIRST teaching page, so it carries the two §3.12 food-for-thought
 * curiosity_prompts in the opening cluster (after hero, before the first concept).
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md.
 * Reference-first: Mittal §23.2 + NCERT Class 11 Ch.5.
 * published:false. Run: node scripts/insert_thermo_p1_system-surroundings.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 1;
const NEW_SLUG = 'system-surroundings-universe';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A steaming cup of tea on a table with a glowing boundary drawn around it, separating "the tea" from the room around it',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A single steaming cup of hot tea sitting on a wooden table in a dim room. A softly glowing line is drawn in the air around the cup, like a bubble or boundary, clearly separating the cup-and-tea inside from the room outside. Wisps of steam cross the boundary. The idea: everything inside the line is "the system" we study; everything outside is "the surroundings". Deep near-black background (#0a0a0a), warm orange glow from the tea and the boundary line, cool dim blues for the surrounding room, volumetric steam. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — food for thought #1 (opening cluster, §3.12)
    { id: uuidv4(), order: n(), type: 'curiosity_prompt',
      prompt: "Picture a sealed thermos of hot coffee, and beside it the same coffee in an open cup. In both, you want to study 'the coffee'. Draw an imaginary line around just the coffee. Does it matter whether that line lets heat through? Whether it lets steam (matter) escape?",
      hint: "The thermos line blocks almost everything. The open-cup line lets heat and steam leak out. Same coffee — different boundary.",
      reveal: "It matters enormously. The first thing thermodynamics asks you to do is draw a line around the part you care about — the **system** — and then ask what that line lets through: energy, matter, both, or neither. That single choice decides which rules apply. This page is about drawing that line." },

    // 2 — food for thought #2
    { id: uuidv4(), order: n(), type: 'curiosity_prompt',
      prompt: "As the hot coffee cools, the room around it gets very slightly warmer. The coffee lost something; the room gained it. If you could add up the energy of the coffee AND the whole room together, would that grand total have changed at all?",
      hint: "Nothing was created and nothing escaped to outer space — it just moved from one place to the next.",
      reveal: "The total doesn't change — energy only moved from the coffee to the room. That's why thermodynamics always thinks in pairs: the **system** plus its **surroundings** together make the **universe**, and the universe's energy is fixed. You've just met the idea behind the First Law." },

    // 3 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Before you can track energy, you have to decide *whose* energy you are tracking. So thermodynamics begins with one simple act: **drawing a boundary.**\n\n" +
      "The part of the universe you choose to study is the **system** — the reacting chemicals in a beaker, the gas inside an engine cylinder, the coffee in a cup. Everything else that can exchange energy or matter with it is the **surroundings** — the beaker, the air, the table, the room.\n\n" +
      "Together, system and surroundings make up the **universe**. The imaginary surface that separates them is the **boundary**. It can be real, like the walls of a flask, or purely imaginary — but once you draw it, every quantity in the chapter is measured with respect to *it*." },

    // 4 — heading: three kinds of systems
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Three Kinds of System',
      objective: 'Tell whether a system is open, closed, or isolated by asking what its boundary lets cross — energy, matter, or nothing.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Systems are sorted by **what their boundary allows to cross it** — energy, matter, both, or neither:\n\n" +
      "- **Open system** — exchanges *both* energy and matter with the surroundings. A cup of hot tea in the open is open: heat leaves *and* steam (matter) escapes.\n" +
      "- **Closed system** — exchanges *energy but not matter.* The boundary is sealed to matter but lets heat through. A sealed steel pressure cooker on a flame: heat flows in, but no matter gets in or out.\n" +
      "- **Isolated system** — exchanges *neither* energy nor matter. A perfect thermos flask is the everyday picture: nothing crosses. The whole universe is the only truly isolated system there is." },

    // 5 — image: three systems
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Three containers side by side: an open cup losing heat and steam, a sealed flask losing only heat, and a thermos losing nothing',
      caption: '📸 Open, closed, isolated — sorted by what crosses the boundary',
      generation_prompt: 'A clean side-by-side comparison diagram on a deep near-black background (#0a0a0a), three panels of equal size. Panel 1 "Open": an open cup of hot liquid with both wavy orange heat arrows AND small particle/steam arrows leaving across the boundary. Panel 2 "Closed": a sealed flask with only wavy orange heat arrows crossing the boundary, and matter-arrows shown blocked (a small X). Panel 3 "Isolated": a thermos flask with both heat arrows and matter arrows blocked (X on both). Each panel has its boundary drawn as a glowing line. Orange heat arrows, cyan matter arrows, white minimal labels (Open / Closed / Isolated only). Clean scientific-illustration style.' },

    // 6 — reasoning_prompt (mid-page, after the open/closed/isolated concept)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Hot water is sealed inside a closed steel bottle (no matter can escape), but the steel lets heat pass through to your hand. A few minutes later the water is cooler. Which kind of system is the water, and what crossed the boundary?",
      options: [
        "Open system — both heat and water vapour left",
        "Closed system — only energy (heat) crossed; no matter could escape the sealed bottle",
        "Isolated system — nothing crossed, so it cannot have cooled",
        "Closed system — matter left but energy stayed inside"
      ],
      correct_index: 1,
      reveal: "The bottle is sealed, so no matter (water or vapour) can leave — that rules out an open system. But steel conducts heat, so energy *did* cross the boundary, which is exactly why the water cooled. Energy out, matter in: that is a **closed system**. An isolated system couldn't cool at all, because by definition nothing crosses its boundary." },

    // 7 — worked example: classify
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Classify the System',
      problem: "Classify each as open, closed, or isolated: (a) boiling water in an open pan, (b) a sealed glass ampoule of medicine, (c) coffee in a sealed, perfectly insulated thermos, (d) the Earth (ignoring sunlight and space dust).",
      solution: "Each time, ask one question: *what does the boundary let cross — energy, matter, both, or neither?*\n\n" +
        "**(a) Boiling water, open pan** — heat enters from the flame **and** steam (matter) escapes. Both cross → **open system.**\n\n" +
        "**(b) Sealed glass ampoule** — the glass traps all matter, but heat can still flow in or out through the glass. Energy only → **closed system.**\n\n" +
        "**(c) Coffee in a perfect thermos** — sealed to matter *and* insulated against heat. Nothing crosses → **isolated system** (the ideal one; real thermoses leak heat slowly).\n\n" +
        "**(d) The Earth, ignoring sunlight** — if no energy and no matter crossed, it would be isolated. But that ignores the huge energy stream from the Sun — which is why, in reality, Earth is a **closed-ish** system, not isolated. The example shows why the assumptions you make about the boundary decide the answer." },

    // 8 — table
    { id: uuidv4(), order: n(), type: 'table', caption: 'What crosses the boundary defines the system',
      headers: ['System type', 'Energy crosses?', 'Matter crosses?', 'Everyday picture'],
      rows: [
        ['Open', 'Yes', 'Yes', 'Open cup of tea'],
        ['Closed', 'Yes', 'No', 'Sealed pressure cooker'],
        ['Isolated', 'No', 'No', 'Perfect thermos flask'],
      ] },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The First Move, Every Time',
      markdown: "**System + surroundings = universe.** Every thermodynamics problem starts by drawing the boundary and asking what it lets cross. Get this wrong and every later sign and formula goes wrong with it. Open = energy + matter. Closed = energy only. Isolated = nothing." },

    // 10 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Exam questions rarely say \"this is a closed system\" — they **describe** it and make you decide. Watch the signal words:\n\n" +
        "**\"sealed\" / \"rigid closed container\"** → no matter crosses → **closed** (or isolated if also insulated).\n\n" +
        "**\"insulated\" / \"adiabatic\" / \"thermally isolated\"** → no *heat* crosses the boundary — a key fact you'll use again and again in the adiabatic-process pages.\n\n" +
        "**\"open beaker\" / \"open to the atmosphere\"** → matter can escape and pressure is fixed at atmospheric — a setup that comes up constantly in thermochemistry." },

    // 11 — inline_quiz (§3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'In thermodynamics, the "system" together with its "surroundings" make up what?',
          options: [
            'The boundary',
            'The universe',
            'An isolated system only',
            'The atmosphere'
          ],
          correct_index: 1,
          explanation: 'The system is the part you study; the surroundings is everything else that can exchange energy or matter with it. Added together they are the universe. The boundary is only the surface between them, not the sum of the two.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A reaction is carried out in a sealed, rigid steel vessel that conducts heat. Which statement about this system is correct?',
          options: [
            'It is open, because the steel lets heat through',
            'It is isolated, because the vessel is sealed',
            'It is closed, because energy can cross the boundary but matter cannot',
            'It is closed, because matter can cross but energy cannot'
          ],
          correct_index: 2,
          explanation: 'A sealed vessel stops all matter from crossing, so it is not open. But conducting steel lets heat (energy) cross, so it is not isolated either. Energy yes, matter no — that is the definition of a closed system.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Which everyday object is the closest real-world model of an isolated system?',
          options: [
            'A pot of water boiling on a stove',
            'A well-made vacuum thermos flask',
            'A glass of water left on a table',
            'A balloon being inflated'
          ],
          correct_index: 1,
          explanation: 'An isolated system exchanges neither energy nor matter. A vacuum thermos is built to block both heat flow and matter, so it is the best everyday model. The boiling pot and open glass both exchange heat and matter, and an inflating balloon takes in matter.' },
      ] },

    // 12 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now draw the boundary and name the system. Next, a subtler question: some quantities depend only on **where** the system is, others on **how** it got there. That difference — **state functions vs path functions** — quietly decides which formulas you're allowed to use.*" },
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
    slug: NEW_SLUG, title: 'System, Surroundings & the Universe',
    subtitle: 'Every thermodynamics problem starts by drawing a boundary — and asking what it lets cross.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'system-surroundings', 'open-closed-isolated'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 1 (system, surroundings, universe)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
