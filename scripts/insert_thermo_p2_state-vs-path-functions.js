'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc A, Page 2.
 * "State Functions vs Path Functions" — the second move of every thermo problem:
 * some quantities depend only on where you end up (U, H, S, G, T, P, V), others
 * on the route you took (q, w). That distinction decides which formulas are legal.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md
 * (altitude-vs-distance + bank-balance analogies; "dharm sankat" state-vs-path).
 * Reference-first: Mittal §23.2.11–12, §23.5.6.
 * published:false. Run: node scripts/insert_thermo_p2_state-vs-path-functions.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 2;
const NEW_SLUG = 'state-vs-path-functions';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Two trekkers reaching the same hilltop by two different trails — one short and steep, one long and winding',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A single hilltop with a small glowing flag at the summit. Two trekkers have reached the same top point by two clearly different routes drawn as glowing trails: one a short, steep, almost-straight line up the face; the other a long, winding switchback path curving around the slope. Both trails end at exactly the same summit point. The idea: same final altitude, very different distance walked. Deep near-black background (#0a0a0a), warm orange/amber glow on the trails and the summit flag, cool dim blue for the hill mass and night sky. Clean cinematic scientific-illustration style. No text, no labels, no numbers.' },

    // 1 — fun_fact hook (real-life)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Same Top, Different Walk',
      markdown: "Two friends climb the same hill. One takes a short, steep trail; the other takes a long, winding road. They meet at the summit at exactly the **same altitude** — yet one has walked barely a kilometre and the other has walked five.\n\nNotice what just happened. The altitude they end at depends only on *where they are now* — the top. But the distance each walked depends entirely on *which route* they chose. Two numbers about the same climb, behaving in completely opposite ways. Thermodynamics has both kinds of number too, and telling them apart is today's whole job." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The **state** of a system is just its current condition, fixed by a handful of measurable variables — pressure $ P $, volume $ V $, temperature $ T $, and amount $ n $. Pin those down and the system has nowhere to hide: every other property is decided.\n\n" +
      "Now the key split. A **state function** is any quantity that depends *only on the present state* — only on where the system is, never on how it got there. Altitude on the hill is a state function. So is your **bank balance**: it tells you exactly how much money you have right now, and it does not care whether you earned it in one big payment or a hundred small ones.\n\n" +
      "A **path function** is the opposite — it depends on the *route* the system took. Distance walked up the hill is a path function. So is *\"how much you spent this month\"*: that number is built entirely from the path of your spending, and two people who end the month with the same balance can have spent wildly different amounts along the way." },

    // 3 — heading: state functions
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'State Functions — Only the Destination Counts',
      objective: 'Spot a state function and compute its change as final minus initial, ignoring whatever route the system took.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For a state function, the change is always **final value minus initial value**, full stop — written $ \\Delta X = X_{final} - X_{initial} $.\n\n" +
      "The intermediate steps simply do not enter the arithmetic. Internal energy $ U $, enthalpy $ H $, entropy $ S $, and Gibbs free energy $ G $ are all state functions — and so are the basic variables $ T $, $ P $, and $ V $ themselves.\n\n" +
      "This is why a **cyclic process** is so clean. If a system goes through any loop of changes and returns to its exact starting state, every state function comes back to its starting value, so its net change is zero: $ \\Delta U = 0 $, $ \\Delta H = 0 $, $ \\Delta S = 0 $. The journey can be as long and twisted as you like — for a state function, ending where you began means zero change." },

    // 4 — image: state function (two paths, same endpoints)
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Two different routes between the same initial and final state points on a P-V diagram, both giving the same change in internal energy',
      caption: 'A state function reads the same change no matter which route connects the two states',
      generation_prompt: 'A clean scientific diagram on a deep near-black background (#0a0a0a). A simple pressure-volume style plane with two labelled dots: an "initial state" dot lower-left and a "final state" dot upper-right, both drawn as small glowing orange points. Two clearly different glowing paths connect them — one a gentle smooth curve, one a stepped right-angled path — to show two routes between the same two states. A small floating tag near the final point reads only the symbol "ΔU" once, indicating the change is identical for both routes. Orange/amber accents for the paths and points, cool dim blue axes, minimal white labels (Initial, Final only). No clutter, no extra numbers.' },

    // 5 — reasoning_prompt (mid-page, after state-function concept)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Here is a mixed list of thermodynamic quantities: temperature $ T $, pressure $ P $, heat $ q $, work $ w $, and internal-energy change $ \\Delta U $. Which TWO of these are path functions — the ones whose value depends on the route the system took, not just on its start and end?",
      options: [
        "$ T $ and $ P $ — because both can be measured at any instant",
        "$ q $ and $ w $ — heat and work both depend on which path was taken",
        "$ \\Delta U $ and $ q $ — anything involving energy depends on the path",
        "$ P $ and $ w $ — pressure pushes, so it travels with the path"
      ],
      correct_index: 1,
      reveal: "Heat $ q $ and work $ w $ are the two path functions here. Run the system from the same start to the same finish by a different route and you generally get different $ q $ and different $ w $. $ T $ and $ P $ are state variables — read off the current state alone — and $ \\Delta U $ is a state-function change. The trap is thinking \"$ \\Delta U $ involves energy, so it must travel with the path\": it does not — $ \\Delta U $ is path-independent even though its two ingredients $ q $ and $ w $ are not." },

    // 6 — heading: path functions
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Path Functions — the Route is Everything',
      objective: 'Recognise heat and work as path functions, and explain why a cyclic process can still exchange heat and work even when every state function returns to zero.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The two big path functions in this chapter are **heat** $ q $ and **work** $ w $. Neither is stored *inside* a system the way energy is — they exist only while energy is crossing the boundary, and how much crosses depends on the route you forced the system through. Take a gas from state 1 to state 2 quickly along one path and slowly along another, and the heat exchanged and the work done can come out completely different.\n\n" +
      "This is exactly why a cyclic process is interesting. After a full loop, every state function is back to zero change — but $ q $ and $ w $ need **not** be zero. The system can absorb heat over part of the loop and do work over another part, returning to its start with a net heat and a net work that are not zero at all. The destination reset to zero; the journey did real work along the way." },

    // 7 — worked example: classify
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — State or Path?',
      problem: "Classify each quantity as a state function or a path function, with a one-line reason: internal-energy change $ \\Delta U $, heat absorbed $ q $, work done $ w $, enthalpy $ H $, temperature $ T $, pressure $ P $.",
      solution: "Ask one question each time: *does this depend only on the start and end state, or on the route taken?*\n\n" +
        "**Internal energy $ \\Delta U $** — depends only on initial and final states → **state function.**\n\n" +
        "**Heat $ q $** — how much heat crosses the boundary depends on the route → **path function.**\n\n" +
        "**Work $ w $** — the work done depends on the path the system follows → **path function.**\n\n" +
        "**Enthalpy $ H $** — defined from state variables ($ H = U + PV $), so it depends only on the state → **state function.**\n\n" +
        "**Temperature $ T $** — a state variable read off the current condition → **state function.**\n\n" +
        "**Pressure $ P $** — a state variable, fixed by the present state → **state function.**\n\n" +
        "**The punchline:** $ q $ and $ w $ are each path functions, yet their sum is the state function $ \\Delta U = q + w $. Two route-dependent quantities add up to a route-independent one — and that single fact is the engine of the next page." },

    // 8 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Two Lists, Memorised Once',
      markdown: "**State functions** (depend only on start and end): $ U $, $ H $, $ S $, $ G $, and the variables $ T $, $ P $, $ V $. Their change is always $ X_{final} - X_{initial} $, and in any cyclic process it is **zero**.\n\n" +
        "**Path functions** (depend on the route): heat $ q $ and work $ w $. These can be non-zero even in a cycle. If you remember only one pair, remember that $ q $ and $ w $ are the path functions — almost everything else you'll meet is a state function." },

    // 9 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The headline result:** heat $ q $ and work $ w $ each depend on the path, yet their sum $ \\Delta U = q + w $ is path-independent. The route-dependence of the two pieces cancels in the total.\n\n" +
        "**In a cyclic process:** every state function returns to its start, so $ \\Delta U = 0 $, which forces $ q = -w $. Any heat the system absorbs over the cycle equals the work it does. Examiners love handing you a loop and asking for $ \\Delta U $ — the answer is zero before you compute anything.\n\n" +
        "**Why it matters:** because a state-function change ignores the route, you may compute it along the *easiest imaginary path* you can invent, then trust the answer for the real path. That freedom is exactly what makes Hess's law work — you'll meet it later in this chapter." },

    // 10 — inline_quiz (§3.6.1) — 3 questions, difficulty 1/2/2, varied correct_index
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Which of the following is a path function?',
          options: [
            'Internal energy $ U $',
            'Temperature $ T $',
            'Work done $ w $',
            'Enthalpy $ H $'
          ],
          correct_index: 2,
          explanation: 'Work depends on the route the system takes between two states, so it is a path function. Internal energy, temperature, and enthalpy are all fixed by the current state alone, which makes them state functions — the tempting one is enthalpy, but $ H = U + PV $ is built only from state variables, so it never depends on the path.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A gas is taken around a complete cycle and returns to its exact starting state. What is the change in its internal energy, $ \\Delta U $, over the full cycle?',
          options: [
            'Exactly zero, because internal energy is a state function',
            'Equal to the heat absorbed, $ q $',
            'Always positive, because the gas did work',
            'It depends on which path was taken around the cycle'
          ],
          correct_index: 0,
          explanation: 'Internal energy is a state function, so once the system is back at its starting state its change is zero regardless of the loop taken. The last option is the classic trap — it confuses $ \\Delta U $ with $ q $ and $ w $, which ARE path-dependent and need not be zero around a cycle; only the state function $ \\Delta U $ is forced to zero.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Heat $ q $ and work $ w $ each depend on the path, yet $ \\Delta U = q + w $ does not. What does this tell you about $ \\Delta U $?',
          options: [
            'That $ q $ and $ w $ must always be exactly equal in size to each other',
            'That $ \\Delta U $ must itself be a path function, inheriting the route-dependence',
            'That $ \\Delta U $ is a state function, set only by the start and end states',
            'That heat and work were never genuinely path functions in the first place'
          ],
          correct_index: 2,
          explanation: 'The route-dependence of $ q $ and $ w $ cancels in their sum, leaving $ \\Delta U $ depending only on the start and end states — the definition of a state function. The tempting wrong choice is that $ \\Delta U $ inherits path-dependence from its parts; it does not, and that cancellation is precisely why you can pick the easiest imaginary path to compute it.' },
      ] },

    // 11 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now sort any quantity into \"only the destination counts\" or \"the route is everything\" — and you've met $ \\Delta U = q + w $ in passing. Next: the three energy quantities themselves — heat, work, and internal energy — and the sign convention that decides whether each one is counted as positive or negative.*" },
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
    slug: NEW_SLUG, title: 'State Functions vs Path Functions',
    subtitle: 'Some quantities care only where you end up. Others care how you got there — and that decides which formulas you may use.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'state-function', 'path-function'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 2 (state functions vs path functions)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
