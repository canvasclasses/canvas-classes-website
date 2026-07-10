'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Page 7.
 * "Heat Capacity, Cp and Cv" — how much heat warms something by one degree, why a gas at
 * constant pressure always needs more heat than at constant volume (Mayer: Cp - Cv = R),
 * the Cv values by atomicity, and gamma. Isothermal: C = infinity.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (Heat capacity,
 * Why CP > CV, C = infinity for isothermal).
 * Reference-first: Mittal §23.7 + NCERT Class 11 Ch.5.
 * published:false. Run: node scripts/insert_thermo_p7_heat-capacity-cp-cv.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 7;
const NEW_SLUG = 'heat-capacity-cp-cv';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A calm coastal city at dusk beside a vast dark sea, the water glowing faintly warm while the inland desert behind it is split between blazing day and freezing night',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). On one side, a calm coastal city at dusk sitting beside a vast, still sea that glows with a soft warm orange light, as if holding a huge store of heat. On the other side, a stark inland desert split down the middle — one half blazing hot under a harsh sun, the other half frozen blue and cold. The sea between them stays even and mild. The idea: water soaks up enormous heat while barely changing temperature, so the coast never swings to the extremes the desert does. Deep near-black background (#0a0a0a), warm amber glow from the sea, cold blues for the desert night, clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Why the Coast Never Roasts',
      markdown: "A city by the sea is never as blazing-hot by day, or as freezing-cold by night, as a desert town inland. The reason sits in the water itself. The sea soaks up a huge amount of heat from the day's sun while its temperature barely creeps up, then gives that heat back slowly through the night. Water has an enormous **heat capacity**, and that single property is what keeps the coast mild while the desert swings between extremes." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Heat and temperature are not the same thing. Pour the same amount of heat into two different substances and you can get two very different temperature rises. The quantity that connects the two is **heat capacity** — the amount of heat needed to raise a substance's temperature by one degree.\n\n" +
      "Write it as a simple bookkeeping line. If a substance takes in heat $ q $ and its temperature rises by $ \\\\Delta T $, then\n\n" +
      "$ q = C\\\\,\\\\Delta T $\n\n" +
      "where $ C $ is the heat capacity. A large $ C $ means the substance is a heat sponge — it can swallow a lot of heat for only a small rise in temperature. When we measure this per mole of substance, we call it the **molar heat capacity**, and that is the version that matters for gases in this chapter." },

    // 3 — heading: heat capacity / water as coolant
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Heat Capacity — Why Water Is a Great Coolant',
      objective: 'Explain why a substance with a large heat capacity warms slowly, and why that makes water the coolant of choice.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Picture two pans on the same flame for the same time — one holds water, the other holds cooking oil. The oil gets hot first. The water sits there, soaking up far more heat, yet stays comparatively cool. Same flame, same pan, very different temperatures.\n\n" +
      "That is heat capacity made visible. The water absorbs a large amount of heat for only a small rise in temperature, so it lags behind the oil. And that is exactly why water is used as a coolant — in car radiators, in power plants, in your own body's sweat. A coolant's whole job is to carry heat away without itself getting scorching hot. If the coolant heated up the moment it touched anything, what good would it be? Water's large heat capacity is the property that lets it do the job." },

    // 4 — image: water vs oil heat capacity
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Two pans on identical flames — the oil pan shows a high thermometer reading and rising heat shimmer, the water pan shows a much lower thermometer reading despite absorbing more heat',
      caption: '📸 Same flame, same time — the oil races ahead, the water stays cool',
      generation_prompt: 'A clean side-by-side comparison diagram on a deep near-black background (#0a0a0a). Two identical metal pans sit on two identical orange gas flames of equal size. Left pan labelled "Oil" has a thermometer reading HIGH with strong heat-shimmer lines rising off it. Right pan labelled "Water" has a thermometer reading LOW, with many small orange heat arrows flowing INTO the water to show it is absorbing a lot of heat yet staying cool. A short caption-free visual cue (a large downward bar vs a small one) hints that water stores more heat per degree. Orange heat arrows and accents, minimal white labels (Oil / Water only). Clean technical scientific-illustration style. No extra text.' },

    // 5 — heading: Cp vs Cv
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Cp Versus Cv — Constant Pressure Costs Extra',
      objective: 'See why heating a gas at constant pressure always needs more heat than at constant volume.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For a gas, *how* you hold it while you heat it changes the answer. There are two standard ways, and each has its own heat capacity.\n\n" +
      "- **At constant volume** the gas is trapped in a rigid box. It cannot expand, so it does no expansion work. Every joule of heat goes straight into the internal energy. The heat capacity here is $ C_V $, and all of it pays for $ \\\\Delta U $.\n" +
      "- **At constant pressure** the gas is free to push a piston outward as it warms. Now the heat has two bills to pay: it must raise the internal energy ($ \\\\Delta U $) *and* fund the expansion work the gas does on its surroundings. The heat capacity here is $ C_P $.\n\n" +
      "Because the constant-pressure case has an extra bill to pay, it always needs more heat for the same one-degree rise. So $ C_P > C_V $ — for every gas, always." },

    // 6 — reasoning_prompt (mid-page, after Cp/Cv concept)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "You give two identical samples of the same gas the same one-degree temperature rise — one in a sealed rigid box, one under a piston free to move. Which sample needed more heat, and why?",
      options: [
        "The rigid-box sample, because trapped gas resists heating",
        "The piston sample, because some heat went into the expansion work it did while warming, on top of raising its internal energy",
        "They needed exactly the same heat — temperature rise alone fixes the heat",
        "The piston sample, but only because the piston itself absorbs heat"
      ],
      correct_index: 1,
      reveal: "Both samples end up one degree hotter, so both gained the same internal energy $ \\\\Delta U $. But the gas under the piston also pushed the piston out — it did expansion work — and that work had to be paid for with extra heat. The rigid box does no work, so it needs less heat. The temperature rise alone does NOT fix the heat: it is the same $ \\\\Delta U $ plus, in the piston case, the expansion work. That extra cost is exactly why $ C_P > C_V $." },

    // 7 — heading: Mayer's relation and gamma
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: "Mayer's Relation and the Gamma Values",
      objective: 'Use one relation, $ C_P - C_V = R $, to get every gas value, and read gamma off atomicity.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "How much bigger is $ C_P $ than $ C_V $? For one mole of an ideal gas, the answer is beautifully simple. The extra heat the constant-pressure gas needs is precisely the expansion work it does — and for one mole heated by one degree, that work comes out to exactly $ R $. So\n\n" +
      "$ C_P - C_V = R $\n\n" +
      "This is **Mayer's relation**. The gap between the two heat capacities is not some messy number to look up — it is just the gas constant $ R $, and it represents nothing other than the expansion work of an ideal gas. You memorise one value, $ R $, and add it.\n\n" +
      "The $ C_V $ values themselves depend on how many ways a molecule can store energy — its atomicity:\n\n" +
      "- **Monatomic** gas (like $ \\\\ce{He} $, $ \\\\ce{Ar} $): $ C_V = \\\\frac{3}{2}R $\n" +
      "- **Diatomic** gas (like $ \\\\ce{O2} $, $ \\\\ce{N2} $): $ C_V = \\\\frac{5}{2}R $\n" +
      "- **Polyatomic** (non-linear) gas: $ C_V = 3R $\n\n" +
      "Add $ R $ to each to get $ C_P $. Their ratio gets its own symbol, $ \\\\gamma = \\\\frac{C_P}{C_V} $ — about $ 1.67 $ for a monatomic gas and $ 1.4 $ for a diatomic one. Notice the pattern: as atomicity rises, $ \\\\gamma $ falls." },

    // 8 — image: Cv ladder by atomicity + Mayer gap
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'Three rising bars for monatomic, diatomic and polyatomic Cv values, each topped with a fixed extra block of size R to show Cp, with gamma decreasing across them',
      caption: '📸 Cv climbs with atomicity, but the gap up to Cp is always one fixed R',
      generation_prompt: 'A clean bar-chart style diagram on a deep near-black background (#0a0a0a). Three vertical bars rising left to right, labelled "Monatomic", "Diatomic", "Polyatomic". The solid orange part of each bar represents Cv and grows taller across the three (three-halves R, five-halves R, three R). On top of every bar sits the SAME small amber block labelled R, representing the fixed Mayer gap that takes you from Cv up to Cp. A thin descending arrow across the top labelled with the Greek letter gamma falling, to show gamma decreases as atomicity rises. Orange and amber accents, minimal white labels only. Clean technical scientific-illustration style. No stray text beyond the labels named.' },

    // 9 — worked_example
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Heat at Constant V vs Constant P',
      problem: "2 mol of a monatomic ideal gas is heated from 300 K to 400 K. Find the heat needed (a) at constant volume, and (b) at constant pressure. Take $ R = 8.314 $ J/(mol·K).",
      solution: "**Set up the heat capacities.** For a monatomic gas:\n\n" +
        "$ C_V = \\\\frac{3}{2}R $\n\n" +
        "$ C_P = C_V + R = \\\\frac{5}{2}R $\n\n" +
        "**Note the temperature rise.**\n\n" +
        "$ \\\\Delta T = 400 - 300 = 100 $ K\n\n" +
        "**(a) Constant volume — heat pays only for internal energy.**\n\n" +
        "$ q_V = n\\\\,C_V\\\\,\\\\Delta T $\n\n" +
        "$ q_V = 2 \\\\times \\\\frac{3}{2}(8.314)(100) $\n\n" +
        "$ q_V \\\\approx 2494 $ J\n\n" +
        "**(b) Constant pressure — heat also pays for expansion work.**\n\n" +
        "$ q_P = n\\\\,C_P\\\\,\\\\Delta T $\n\n" +
        "$ q_P = 2 \\\\times \\\\frac{5}{2}(8.314)(100) $\n\n" +
        "$ q_P \\\\approx 4157 $ J\n\n" +
        "**Read the difference.**\n\n" +
        "$ q_P - q_V \\\\approx 4157 - 2494 = 1663 $ J\n\n" +
        "$ q_P - q_V = nR\\\\,\\\\Delta T = 2(8.314)(100) \\\\approx 1663 $ J\n\n" +
        "That extra $ 1663 $ J is not lost — it is exactly the expansion work the gas did while pushing its surroundings back at constant pressure. That is Mayer's relation showing up as a number." },

    // 10 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Values Worth Memorising',
      markdown: "**$ C_V $ by atomicity:** monatomic $ \\\\frac{3}{2}R $, diatomic $ \\\\frac{5}{2}R $, polyatomic $ 3R $.\n\n" +
        "**Mayer's relation:** $ C_P - C_V = R $ — memorise the one value $ R $ and add it; don't memorise $ C_P $ separately.\n\n" +
        "**Gamma:** $ \\\\gamma = \\\\frac{C_P}{C_V} $ falls as atomicity rises ($ 1.67 $ monatomic, $ 1.4 $ diatomic).\n\n" +
        "**Isothermal:** $ C = \\\\infty $ — when the temperature is held fixed, no amount of heat changes it." },

    // 11 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Memorise one relation, not many.** You only need $ C_P - C_V = R $. Recall the three $ C_V $ values, add $ R $ for $ C_P $, divide for $ \\\\gamma $. There is no separate table to learn.\n\n" +
        "**Gamma falls as atomicity rises.** $ 1.67 $ for monatomic, $ 1.4 $ for diatomic, lower still for polyatomic. Examiners love asking you to rank gases by $ \\\\gamma $ — order them by atomicity and flip it.\n\n" +
        "**Isothermal means $ C = \\\\infty $.** When a question pins the temperature (an isothermal change), the system spends every joule of heat instantly on work, so the temperature never rises however much heat flows. Divide a finite heat by a zero temperature change and the heat capacity blows up to infinity." },

    // 12 — inline_quiz (LAST)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Why is water used as a coolant in car radiators and power plants?',
          options: [
            'It has a very low heat capacity, so it warms up instantly and carries heat off fast',
            'It has a very large heat capacity, so it absorbs a lot of heat while staying relatively cool',
            'It has no heat capacity, so heat passes straight through it unchanged',
            'Its heat capacity rises sharply the moment it is heated'
          ],
          correct_index: 1,
          explanation: 'A coolant must carry heat away without itself becoming scorching hot. Water’s large heat capacity lets it soak up a lot of heat for only a small rise in temperature, which is exactly what a coolant needs. The tempting "low heat capacity" option gets it backwards: a low heat capacity would mean the coolant heats up fast and quickly becomes useless.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For one mole of an ideal gas, what does the quantity $ C_P - C_V $ equal, and what does it physically represent?',
          options: [
            'It equals zero, because the two heat capacities are the same for an ideal gas',
            'It equals $ R $, and it represents the expansion work an ideal gas does at constant pressure',
            'It equals $ \\\\frac{3}{2}R $, and it represents the internal energy of the gas',
            'It equals $ \\\\gamma $, and it represents the ratio of the two heat capacities'
          ],
          correct_index: 1,
          explanation: 'Mayer’s relation says $ C_P - C_V = R $, and that extra $ R $ is precisely the expansion work the gas does while heating at constant pressure. The $ \\\\frac{3}{2}R $ option confuses the gap with the monatomic $ C_V $ value itself; $ \\\\gamma $ is the ratio of the capacities, not their difference.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A gas is heated isothermally, so its temperature is held constant while heat flows in. What is its heat capacity for this process?',
          options: [
            'Zero, because no heat is needed when temperature does not change',
            'Equal to $ C_V $, since volume effects dominate',
            'Infinite, because heat flows in but the temperature change stays zero',
            'Equal to $ R $, by Mayer’s relation'
          ],
          correct_index: 2,
          explanation: 'Heat capacity is heat divided by temperature change. In an isothermal process the gas spends every joule of incoming heat on work, so its temperature change stays zero while heat keeps flowing. A finite heat divided by a zero temperature change is infinite. The "zero" option misreads the situation: heat is definitely flowing, it is just being spent immediately, so the capacity blows up rather than vanishing.' },
      ] },

    // 13 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You just met the process where the temperature is pinned and the gas spends every joule of heat as work — the reason $ C = \\\\infty $. Next, we look at that case head-on: the **isothermal process**, where the temperature stays fixed and all the heat turns into work.*" },
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
    slug: NEW_SLUG, title: 'Heat Capacity, Cp and Cv',
    subtitle: 'How much heat does it take to warm something by one degree — and why a gas at constant pressure is always thirstier than one at constant volume.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'heat-capacity', 'cp-cv', 'mayer-relation'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 7 (heat capacity, Cp and Cv, Mayer)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
