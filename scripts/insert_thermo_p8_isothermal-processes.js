'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc B, Page 8.
 * "Isothermal Processes" — temperature held perfectly still throughout (dT = 0 at
 * every instant). For an ideal gas internal energy depends only on T, so an isothermal
 * change gives ΔU = 0 and therefore ΔH = 0; the first law then forces q = -w, so every
 * joule of heat absorbed leaves again as work. Reversible isothermal work
 * w = -2.303 nRT log(V2/V1); q = +2.303 nRT log(V2/V1).
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md (#12 ΔH=0 surprise,
 * C = ∞ "spends every joule instantly", and the dT=0-throughout essential-condition trap).
 * Reference-first: Mittal §23.9.1–2.
 * published:false. Run: node scripts/insert_thermo_p8_isothermal-processes.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 8;
const NEW_SLUG = 'isothermal-processes';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A gas cylinder with a slowly rising piston sitting in a huge water bath, with heat flowing from the bath into the gas to hold its temperature fixed',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A tall glass-and-metal cylinder of gas with a piston rising very slowly, standing immersed in a vast surrounding water bath that fills most of the frame. Soft orange heat arrows flow steadily from the large bath INTO the gas as the piston lifts, while a thermometer beside the cylinder holds a perfectly steady reading. The idea: the bath keeps feeding heat so the gas temperature never changes while it expands. Deep near-black background (#0a0a0a), warm orange and amber glow on the heat arrows and the cylinder, cool dim blue for the surrounding bath water, gentle volumetric light. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — fun_fact hook (real-life)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Gas That Never Gets to Cool Down',
      markdown: "Let a gas expand very slowly inside a large water bath. Expanding normally cools a gas, but here it never gets the chance. The instant the gas would cool, the surrounding bath feeds in exactly enough heat to hold the temperature fixed. The gas then spends that heat as fast as it arrives, pushing the piston out and doing work on its surroundings. Heat in, work out, temperature unchanged." },

    // 2 — core concept
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "An **isothermal** process is one in which the temperature stays constant. The word splits into *iso* (same) and *thermal* (heat / temperature), and that is exactly the condition: the system's temperature does not change from start to finish.\n\n" +
      "The way you reach this in practice is simple. Keep the system in good thermal contact with a large reservoir — a big water bath, the surrounding atmosphere — and carry out the change **slowly**. Any heat the process would absorb or release is quietly traded with the reservoir, so the temperature has no chance to drift." },

    // 3 — heading: what makes it truly isothermal
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What Makes a Process Truly Isothermal',
      objective: 'State the exact condition for an isothermal change and explain why a zero net temperature change is not enough on its own.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the part students skim past. Isothermal does not mean *the temperature ends where it started.* It means the temperature stays fixed at **every instant** along the way — written as $ dT = 0 $ throughout, not just $ \\Delta T = 0 $ overall.\n\n" +
      "Take a path that warms from 50 °C up to 55 °C and then settles back to 50 °C. The net change is $ \\Delta T = 0 $, yet the temperature moved in the middle, so this is **not** isothermal. The temperature must never leave its value at any moment. That is why an isothermal change has to be slow and held against a reservoir." },

    // 4 — heading: ideal gas, ΔU = 0
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'For an Ideal Gas, ΔU = 0',
      objective: 'Explain why an isothermal change of an ideal gas has both ΔU = 0 and ΔH = 0, because U and H depend only on temperature.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For an **ideal gas**, the internal energy depends only on temperature — not on pressure or volume. So if the temperature does not change, the internal energy cannot change either. For any isothermal change of an ideal gas, $ \\Delta U = 0 $.\n\n" +
      "The same logic carries to enthalpy. Since $ H = U + PV $ and, for an ideal gas, $ PV = nRT $, the enthalpy also depends only on temperature. Hold $ T $ fixed and $ \\Delta H = 0 $ as well. This is the surprise in many exam problems: you are handed an isothermal expansion and asked for $ \\Delta H $, and the answer is simply zero — at the start you do not realise it, but $ PV $ is constant so $ \\Delta H = 0 $." },

    // 5 — image: ΔU = 0, q = -w
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A balance showing heat absorbed on one side exactly matching work done on the other, with internal energy unchanged in the middle',
      caption: '📸 Heat in equals work out — internal energy never moves',
      generation_prompt: 'A clean conceptual diagram on a deep near-black background (#0a0a0a). In the centre, a gas cylinder with the label region kept blank, its internal-energy meter pinned exactly at the middle (a steady gauge needle). On the left, a bold orange arrow of HEAT flowing IN to the gas. On the right, an equal-sized amber arrow of WORK flowing OUT to the surroundings, the two arrows drawn identical in thickness to show they are equal in magnitude. A small steady thermometer beside the cylinder shows an unchanging reading. Minimal white labels only: q (in), w (out). Orange and amber arrows, cool dim background. Clean scientific-illustration style. No equations or extra text.' },

    // 6 — reasoning_prompt (mid-page)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "An ideal gas expands isothermally. The volume grows and the gas does work on its surroundings. What are $ \\Delta U $ and $ \\Delta H $ for this change?",
      options: [
        "Both are negative, because the gas loses energy while doing work",
        "Both are zero, because $ U $ and $ H $ of an ideal gas depend only on temperature, which is held fixed",
        "$ \\Delta U = 0 $ but $ \\Delta H $ is positive, because the volume increased",
        "Both are positive, because heat was absorbed from the surroundings"
      ],
      correct_index: 1,
      reveal: "For an ideal gas, internal energy depends only on temperature, so holding $ T $ fixed pins $ \\Delta U = 0 $. Enthalpy follows the same rule, because $ H = U + PV = U + nRT $ also depends only on $ T $, so $ \\Delta H = 0 $ too. The tempting answer is that $ \\Delta H $ rises with the larger volume, but $ PV = nRT $ stays constant at fixed temperature, so the $ PV $ term does not change at all." },

    // 7 — heading: the work and the heat
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Work and the Heat',
      objective: 'Apply the first law to an isothermal change of an ideal gas to get q = -w, and write the reversible isothermal work and heat.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Now bring in the first law, $ \\Delta U = q + w $. Since $ \\Delta U = 0 $ for an isothermal ideal-gas change, the law collapses to\n\n" +
      "$ q = -w $.\n\n" +
      "Read that plainly: all the heat absorbed leaves again as work. Nothing is stored inside, because the internal energy did not move. The gas behaves like someone who spends every rupee of heat the instant it arrives, which is exactly why the temperature never climbs.\n\n" +
      "For a **reversible** isothermal expansion of an ideal gas from volume $ V_1 $ to $ V_2 $, the work is\n\n" +
      "$ w = -2.303\\,nRT\\log\\frac{V_2}{V_1} $\n\n" +
      "and, because $ q = -w $, the heat absorbed is\n\n" +
      "$ q = +2.303\\,nRT\\log\\frac{V_2}{V_1} $." },

    // 8 — worked example
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Reversible Isothermal Expansion',
      problem: "5 mol of an ideal gas expands isothermally and reversibly at 300 K until its volume is 10 times the original. Find the work $ w $ and the heat $ q $.",
      solution: "**Pick the formula.** Reversible isothermal expansion of an ideal gas uses\n\n" +
        "$ w = -2.303\\,nRT\\log\\frac{V_2}{V_1} $\n\n" +
        "**Put in the numbers** ($ n = 5 $, $ R = 8.314 $, $ T = 300 $, $ V_2/V_1 = 10 $):\n\n" +
        "$ w = -2.303(5)(8.314)(300)\\log 10 $\n\n" +
        "**Use** $ \\log 10 = 1 $:\n\n" +
        "$ w \\approx -28720 $ J\n\n" +
        "$ w \\approx -28.7 $ kJ\n\n" +
        "**Now the heat.** For an ideal gas held at constant temperature, $ \\Delta U = 0 $, so the first law gives $ q = -w $:\n\n" +
        "$ q \\approx +28.7 $ kJ\n\n" +
        "**Answer:** $ w \\approx -28.7 $ kJ and $ q \\approx +28.7 $ kJ. Note this is the *maximum* work for the expansion, because the path is reversible." },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Hold These Three',
      markdown: "**Isothermal needs $ dT = 0 $ throughout, not just $ \\Delta T = 0 $.** The temperature must stay fixed at every instant.\n\n" +
        "**Ideal gas, isothermal $ \\rightarrow \\Delta U = \\Delta H = 0 \\rightarrow q = -w $.** All the heat absorbed leaves again as work.\n\n" +
        "**Reversible isothermal work** $ = -2.303\\,nRT\\log\\frac{V_2}{V_1} $, and the heat absorbed is its exact opposite." },

    // 10 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Examiners love to describe an isothermal change without naming it, then plant a trap:\n\n" +
        "**$ \\Delta T = 0 $ does not prove isothermal.** A path that goes 50 °C $ \\rightarrow $ 55 °C $ \\rightarrow $ 50 °C has $ \\Delta T = 0 $ but fails $ dT = 0 $ in the middle — it is not isothermal.\n\n" +
        "**For an ideal gas, isothermal kills both $ \\Delta U $ and $ \\Delta H $.** A common excess-information question hands you an isothermal expansion and asks for $ \\Delta H $ buried under extra data. The whole trick is realising $ \\Delta H = 0 $.\n\n" +
        "**\"Maximum work\" is the reversible disguise.** When a question asks for the *maximum* work of expansion, it is quietly telling you the path is reversible — reach for $ -2.303\\,nRT\\log\\frac{V_2}{V_1} $." },

    // 11 — inline_quiz (last block)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'What is the defining condition of an isothermal process?',
          options: [
            'No heat is exchanged with the surroundings',
            'The temperature of the system stays constant throughout the change',
            'The pressure of the system stays constant throughout the change',
            'The volume of the system stays constant throughout the change'
          ],
          correct_index: 1,
          explanation: 'Isothermal means constant temperature at every instant of the change. The "no heat exchanged" option describes an adiabatic process, not an isothermal one — in fact an isothermal change usually exchanges heat freely with a reservoir to hold the temperature steady. Constant pressure and constant volume describe isobaric and isochoric processes respectively.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'An ideal gas is taken through an isothermal change. Which statement is correct?',
          options: [
            'Both $ \\Delta U $ and $ \\Delta H $ are zero, so the heat absorbed equals the work done by the gas',
            'Only $ \\Delta U $ is zero; $ \\Delta H $ changes with volume',
            'Both $ \\Delta U $ and $ \\Delta H $ are negative because the gas does work',
            'The heat absorbed is stored as internal energy of the gas'
          ],
          correct_index: 0,
          explanation: 'For an ideal gas, internal energy and enthalpy both depend only on temperature, so an isothermal change gives $ \\Delta U = 0 $ and $ \\Delta H = 0 $. The first law then forces $ q = -w $, so the heat absorbed comes straight back out as work. The tempting option says $ \\Delta H $ changes with volume, but $ PV = nRT $ is constant at fixed temperature, so it does not.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For a reversible isothermal expansion of an ideal gas from $ V_1 $ to $ V_2 $, which pair is correct?',
          options: [
            '$ w = +2.303\\,nRT\\log\\frac{V_2}{V_1} $ and $ q = +2.303\\,nRT\\log\\frac{V_2}{V_1} $',
            '$ w = -2.303\\,nRT\\log\\frac{V_2}{V_1} $ and $ q = -2.303\\,nRT\\log\\frac{V_2}{V_1} $',
            '$ w = -2.303\\,nRT\\log\\frac{V_2}{V_1} $ and $ q = +2.303\\,nRT\\log\\frac{V_2}{V_1} $',
            '$ w = 0 $ and $ q = 0 $, since the temperature does not change'
          ],
          correct_index: 2,
          explanation: 'In an expansion the gas does work on the surroundings, so $ w $ is negative: $ w = -2.303\\,nRT\\log\\frac{V_2}{V_1} $. Since $ \\Delta U = 0 $ here, $ q = -w $, which makes the heat positive (absorbed). The option with both quantities sharing the same sign forgets that $ q $ and $ w $ must be opposite, and the all-zero option wrongly assumes constant temperature means no heat and no work — temperature is held fixed precisely by exchanging heat for work.' },
      ] },

    // 12 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You have seen the case where temperature is pinned and heat flows freely. Next comes the opposite extreme — the **adiabatic process**, where no heat is allowed in or out at all, and the temperature is the very thing that has to move.*" },
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
    slug: NEW_SLUG, title: 'Isothermal Processes',
    subtitle: 'Temperature held perfectly still — so for an ideal gas the internal energy never moves, and every joule of heat comes straight back out as work.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'isothermal', 'delta-u-zero', 'reversible-work'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 8 (isothermal processes)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
