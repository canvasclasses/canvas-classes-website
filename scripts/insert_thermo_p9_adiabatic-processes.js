'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc A, Page 9 (SIGNATURE).
 * "Adiabatic Processes" — seal the boundary against heat (q = 0), so all the work
 * becomes internal-energy change: expansion cools, compression heats. The three
 * reversible-adiabatic-only relations (PV^γ, TV^(γ-1), T^γ P^(1-γ) = const), adiabatic
 * work, the steeper-than-isothermal P–V curve, and the JEE-Advanced free-expansion classic
 * (three zeros; PV^γ does NOT apply because it is irreversible).
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (exemplars #17, #7,
 * and the state-vs-path "dharm sankat" #42).
 * Reference-first: Mittal §23.9.3.
 * published:false. Run: node scripts/insert_thermo_p9_adiabatic-processes.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 9;
const NEW_SLUG = 'adiabatic-processes';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5, full)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A diesel engine piston driving down hard into a sealed cylinder, the trapped air glowing white-hot and igniting injected fuel with no spark plug in sight',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A cutaway of a single diesel engine cylinder: a heavy piston rammed downward, compressing the trapped air into a small bright pocket at the top that glows white-hot orange. A fine mist of injected fuel bursts into flame in that hot pocket — and there is no spark plug anywhere. The boundary of the cylinder is sealed and insulated, with tiny "no heat in or out" crossed-arrows on the walls to suggest the heat is trapped, not added from outside. Deep near-black background (#0a0a0a), intense orange and amber glow from the compressed hot air, cool steel greys for the cylinder. Clean cinematic technical-illustration style. No text, no labels, no stray characters.' },

    // 1 — fun_fact hook (callout)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Engine With No Spark Plug',
      markdown: "A petrol engine needs a spark to light its fuel. A diesel engine has no spark plug at all. It squeezes the air in the cylinder so hard and so fast that the air heats itself past the ignition temperature, and the injected diesel simply bursts into flame on contact. No spark required — just a sudden, heat-sealed squeeze. That squeeze, where no heat is allowed to leak in or out, is an **adiabatic** process, and it is what this page is about." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "An **adiabatic** process is one where **no heat crosses the boundary** — the system is insulated, so $ q = 0 $. Either the change happens inside a thermos-like wall that blocks heat, or it happens so fast that there is no time for heat to flow.\n\n" +
      "Put $ q = 0 $ into the first law, $ \\Delta U = q + w $, and one term simply vanishes:\n\n" +
      "$ \\Delta U = w $\n\n" +
      "Every bit of work now goes straight into the internal energy. So the gas pays for any expansion out of its own energy account. When an adiabatic gas **expands**, it does work on the surroundings, $ \\Delta U $ falls, and the gas **cools**. When it is **compressed**, work is done on it, $ \\Delta U $ rises, and it **heats** — which is exactly how the diesel air lights its fuel." },

    // 3 — heading 1 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Adiabatic — No Heat In or Out',
      objective: 'See why sealing off heat forces $ \\Delta U = w $, so expansion cools the gas and compression heats it.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The whole behaviour follows from one missing term. In an ordinary process the gas can borrow heat from the surroundings to stay warm while it expands. Seal that off, and there is nothing to borrow — the gas can only spend its own internal energy.\n\n" +
      "- **Adiabatic expansion** — the gas does work, $ w < 0 $, so $ \\Delta U < 0 $ and the temperature **drops**. This is why gas rushing out of a high-pressure cylinder feels cold.\n" +
      "- **Adiabatic compression** — work is done on the gas, $ w > 0 $, so $ \\Delta U > 0 $ and the temperature **rises**. This is the diesel cylinder.\n\n" +
      "Contrast this with an isothermal change, where heat flows freely to hold the temperature fixed. Adiabatic is the opposite extreme: no heat moves, so the temperature is *forced* to change." },

    // 4 — image: adiabatic vs isothermal P–V curves (two_third, 16:9)
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A P–V plot showing a steep adiabatic curve and a shallower isothermal curve starting from the same point, the adiabatic falling away more sharply',
      caption: '📸 Same start, two paths — the adiabatic curve is steeper than the isothermal',
      generation_prompt: 'A clean pressure–volume (P–V) graph on a deep near-black background (#0a0a0a). Vertical axis labelled P, horizontal axis labelled V, both as simple orange axis lines with small arrowheads. From one common starting point on the upper-left, two smooth downward-sloping curves spread out: a STEEPER curve falling away sharply (labelled "Adiabatic") drawn in bright orange, and a SHALLOWER, gentler curve (labelled "Isothermal") drawn in a softer amber. The adiabatic curve clearly drops below the isothermal one as volume increases, making the steepness difference obvious. A small note near the curves: "slope of adiabatic = γ × slope of isothermal". Minimal white labels only (P, V, Adiabatic, Isothermal). Clean technical illustration style, orange accent labels, no stray text or extra decoration.' },

    // 5 — heading 2 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Reversible-Adiabatic Relations',
      objective: 'Get the three $ PV^{\\gamma} $-type relations and the adiabatic-work formula — and learn the one condition that makes them legal.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For an ideal gas going through a **reversible** adiabatic change, three relations hold together (here $ \\gamma = \\frac{C_P}{C_V} $):\n\n" +
      "$ PV^{\\gamma} = \\text{constant} $\n\n" +
      "$ TV^{\\gamma-1} = \\text{constant} $\n\n" +
      "$ T^{\\gamma}P^{1-\\gamma} = \\text{constant} $\n\n" +
      "Pick whichever one connects the quantities you are given. But read the condition carefully: these apply **only to a reversible adiabatic** change. They are the single most over-used formula in the chapter — students reach for $ PV^{\\gamma} $ on any process labelled adiabatic, and that is exactly the trap the exam sets.\n\n" +
      "The work done in an adiabatic change comes from $ w = \\Delta U $, and since $ \\Delta U = nC_V\\Delta T $ for an ideal gas:\n\n" +
      "$ w = nC_V\\Delta T = \\frac{nR\\Delta T}{\\gamma-1} = \\frac{P_2V_2 - P_1V_1}{\\gamma-1} $\n\n" +
      "All three forms are the same work — you choose the one that matches your data. And on a P–V plot the adiabatic curve is **steeper** than the isothermal one through the same point: its slope is $ \\gamma $ times the isothermal slope, because the pressure falls faster when the gas is also cooling." },

    // 6 — mid-page reasoning_prompt (after the adiabatic + reversible-relations concept)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "An insulated gas is allowed to rush into an evacuated, equally insulated chamber beside it — a free expansion into vacuum. There is nothing for the gas to push against. What are $ q $, $ w $, and $ \\Delta U $, what happens to the temperature, and does the relation $ PV^{\\gamma} = \\text{constant} $ apply here?",
      options: [
        "$ q = 0 $, but the gas does work against the vacuum, so $ \\Delta U < 0 $ and it cools; $ PV^{\\gamma} $ applies",
        "$ q = 0 $ and $ w = 0 $, so $ \\Delta U = 0 $ and $ \\Delta T = 0 $; and $ PV^{\\gamma} $ does NOT apply, because the expansion is irreversible",
        "$ q = 0 $ and $ w = 0 $, so $ \\Delta U = 0 $; and $ PV^{\\gamma} $ still applies because the process is adiabatic",
        "Heat flows in from the second chamber, so $ q > 0 $ and the temperature rises"
      ],
      correct_index: 1,
      reveal: "Insulated means $ q = 0 $. Expanding into a vacuum means there is nothing to push against, so $ w = 0 $ too. With both zero, $ \\Delta U = 0 $, and for an ideal gas that fixes $ \\Delta T = 0 $ — three zeros in a row. The tempting wrong move is the first option: \"adiabatic expansion always cools.\" It doesn't here, because there is no work — the gas pushes against nothing. And the $ PV^{\\gamma} $ relation does NOT apply: this free expansion is **irreversible**, and those relations are reversible-only. Here $ PV = \\text{constant} $ holds (because $ T $ is unchanged), but $ PV^{\\gamma} $ does not." },

    // 7 — heading 3 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Free Expansion — Three Zeros',
      objective: 'Work through the JEE-Advanced classic where $ q $, $ w $ and $ \\Delta U $ all collapse to zero — and the reversible-only relation breaks.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Free expansion is the cleanest picture of why \"adiabatic\" alone is not enough information. A gas sits in one half of an insulated container; the other half is a vacuum; a valve opens and the gas spreads to fill the whole space.\n\n" +
      "Walk the zeros in order. The wall is insulated, so $ q = 0 $. The gas expands against a vacuum, pushing on nothing, so $ w = 0 $. The first law then gives $ \\Delta U = q + w = 0 $, and for an ideal gas $ \\Delta U = 0 $ means $ \\Delta T = 0 $. The gas ends at the same temperature it started — so it behaves as if it were isothermal, and $ P_1V_1 = P_2V_2 $ holds.\n\n" +
      "Here is the part examiners love. Because the temperature is unchanged, $ PV $ stays constant. But $ PV^{\\gamma} $ does **not** stay constant, even though the process is adiabatic — because it is **irreversible**, and the $ PV^{\\gamma} $ relation was derived only for the reversible case. The same starting state can reach different final points by a reversible versus an irreversible adiabatic path; the two never land on the same point, which is why one relation can hold while the other fails. This is the question that, in his words, is \"so pretty there's nothing to solve — and it's Advanced.\"" },

    // 8 — worked_example (solved_example, tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Work in an Adiabatic Compression',
      problem: "2 mol of a monatomic ideal gas ($ \\gamma = \\frac{5}{3} $, $ C_V = \\frac{3}{2}R $) is compressed adiabatically, and its temperature rises from 300 K to 400 K. Find the work done on the gas. Take $ R = 8.314 $ J/(mol·K).",
      solution: "**Use the condition first.** Adiabatic means $ q = 0 $, so the first law collapses to $ w = \\Delta U $.\n\n" +
        "**Write $ \\Delta U $ for an ideal gas.** $ \\Delta U = nC_V\\Delta T $, with $ C_V = \\frac{3}{2}R $.\n\n" +
        "**Read the numbers.** $ n = 2 $, $ \\Delta T = 400 - 300 = 100 $ K.\n\n" +
        "**Substitute.** $ w = 2 \\times \\frac{3}{2}(8.314)(100) $\n\n" +
        "**Simplify.** $ w = 3 \\times 8.314 \\times 100 \\approx 2494 $ J.\n\n" +
        "**Read the sign.** The temperature rose, so $ \\Delta U > 0 $, so $ w > 0 $: work is done **on** the gas during compression, which is exactly what \"compressed\" should give. A clean question once you see that $ q = 0 $ does all the heavy lifting.\n\n" +
        "**Answer:** $ w \\approx +2494 $ J (work done on the gas)." },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Adiabatic Toolkit',
      markdown: "Adiabatic means $ q = 0 $, so the first law gives $ \\Delta U = w $ — all the work changes the internal energy.\n\n" +
        "The three $ PV^{\\gamma} $-type relations — $ PV^{\\gamma} $, $ TV^{\\gamma-1} $, $ T^{\\gamma}P^{1-\\gamma} = \\text{constant} $ — apply **only to a reversible adiabatic** change. Never on an irreversible one.\n\n" +
        "Adiabatic work: $ w = nC_V\\Delta T = \\frac{P_2V_2 - P_1V_1}{\\gamma-1} $ — pick the form that fits your data.\n\n" +
        "Direction: expansion **cools**, compression **heats**." },

    // 10 — exam_tip callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The IIT-Advanced classic — irreversible adiabatic free expansion.** A gas expands freely into a vacuum inside an insulated container. Walk it: $ q = 0 $ (insulated) and $ w = 0 $ (nothing to push against) give $ \\Delta U = 0 $, so the gas behaves isothermally and $ P_1V_1 = P_2V_2 $ holds.\n\n" +
        "**The trap:** the reflex is to write $ P_1V_1^{\\gamma} = P_2V_2^{\\gamma} $ because the process is adiabatic. That is wrong here. The $ PV^{\\gamma} $ relation is **reversible-only** — and a free expansion is irreversible, so it does not apply.\n\n" +
        "**Safeguard:** never apply $ PV^{\\gamma} $ (or $ TV^{\\gamma-1} $, or $ T^{\\gamma}P^{1-\\gamma} $) to an irreversible adiabatic. If a process is adiabatic but not stated reversible, those three relations are off the table — fall back to $ \\Delta U = w $." },

    // 11 — inline_quiz (LAST, 3 Qs, difficulty 1/2/2, varied correct_index)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'In an adiabatic process, which quantity is zero, and what does the first law then become?',
          options: [
            'The work $ w $ is zero, so $ \\Delta U = q $',
            'The heat $ q $ is zero, so $ \\Delta U = w $',
            'The internal-energy change $ \\Delta U $ is zero, so $ q = -w $',
            'The temperature change $ \\Delta T $ is zero, so $ q = w $'
          ],
          correct_index: 1,
          explanation: 'Adiabatic means the boundary lets no heat cross, so $ q = 0 $. Putting that into $ \\Delta U = q + w $ leaves $ \\Delta U = w $. The tempting answer sets $ \\Delta U = 0 $ — but that is the isothermal condition for an ideal gas, not the adiabatic one; in an adiabatic change the temperature is exactly what is free to move.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A reversible adiabatic curve and a reversible isothermal curve are drawn from the same point on a P–V diagram. How do their slopes compare?',
          options: [
            'The adiabatic curve is steeper — its slope is $ \\gamma $ times the isothermal slope',
            'The two curves have identical slopes everywhere',
            'The isothermal curve is steeper — its slope is $ \\gamma $ times the adiabatic slope',
            'The adiabatic curve is the shallower of the two because the gas cools as it expands'
          ],
          correct_index: 0,
          explanation: 'On an adiabatic expansion the gas also cools, so its pressure falls faster than on an isothermal expansion — making the adiabatic curve steeper, with slope $ \\gamma $ times the isothermal slope. The last option points the right physics (the gas does cool) at the wrong conclusion: cooling makes the pressure drop faster, which is steeper, not shallower.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'An ideal gas undergoes free expansion into a vacuum inside a perfectly insulated container. Which set of statements is fully correct?',
          options: [
            '$ q = 0 $, $ w < 0 $, $ \\Delta U < 0 $, and $ PV^{\\gamma} $ is constant',
            '$ q > 0 $, $ w = 0 $, $ \\Delta U > 0 $, and $ PV^{\\gamma} $ is constant',
            '$ q = 0 $, $ w = 0 $, $ \\Delta U = 0 $, and $ PV^{\\gamma} $ is constant',
            '$ q = 0 $, $ w = 0 $, $ \\Delta U = 0 $, and $ PV $ (not $ PV^{\\gamma} $) is constant'
          ],
          correct_index: 3,
          explanation: 'Insulated gives $ q = 0 $; pushing against a vacuum gives $ w = 0 $; together they force $ \\Delta U = 0 $ and $ \\Delta T = 0 $ — the three zeros. With temperature unchanged, $ PV $ stays constant, but $ PV^{\\gamma} $ does not, because that relation is reversible-only and a free expansion is irreversible. The tempting choice keeps the three zeros but wrongly carries over $ PV^{\\gamma} $ — the single mistake the exam is hunting for.' },
      ] },

    // 12 — bridge text to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now seal a system against heat and predict whether it warms or cools. Next we turn the First Law loose on chemical reactions themselves — the heat they release or absorb — in **Thermochemical Equations and Hess's Law**.*" },
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
    slug: NEW_SLUG, title: 'Adiabatic Processes',
    subtitle: 'Seal the system against heat and something has to give — expansion cools the gas, compression heats it, and a diesel engine lights its fuel with no spark at all.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'adiabatic', 'poisson-relations', 'free-expansion'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 9 (adiabatic processes; free expansion, reversible-adiabatic relations)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
