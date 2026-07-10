'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc A, Page 4.
 * "Pressure–Volume Work" — the work a gas does pushing a piston, and why doing it
 * slowly (reversible) versus fast (irreversible) gives completely different answers.
 * SIGNATURE PAGE: carries TWO worked examples (irreversible w/ unit trap; reversible
 * isothermal contrast) so the "maximum work" idea lands on numbers, not words.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md
 *   — rice-grain (chawal ka dana) reversible analogy; "constant external pressure = irreversible" trap;
 *     1 L·bar = 100 J unit-killer; "maximum work" disguise from his trap bank.
 * Reference-first: Mittal §23.5.5–§23.5.10 (PV work, path function, reversible/irreversible, max/min work).
 * published:false. Run: node scripts/insert_thermo_p4_pressure-volume-work.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 4;
const NEW_SLUG = 'pressure-volume-work';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5, full)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A gas-filled cylinder with a piston being pushed outward, with a P–V graph faintly overlaid showing the area swept by the moving piston',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A horizontal glass cylinder filled with faintly glowing gas, a piston on the right being pushed outward by the gas. Tiny gas particles strike the piston face. Faintly overlaid behind the cylinder is a smooth pressure-volume curve, the area beneath it softly shaded, suggesting that the swept area is the work done. Deep near-black background (#0a0a0a), warm orange and amber glow for the gas and the shaded area, cool dim blue for the cylinder walls and piston. Clean cinematic scientific-illustration style. No text or labels.' },

    // 1 — callout[fun_fact] real-life hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Syringe Test',
      markdown: "Take an empty syringe, seal the tip with your thumb, and push the plunger in. Push it slowly and gently and the trapped air pushes back in a steady, even way. Now try to slam it in fast: the air seems to fight back harder, all at once. The gas inside is doing work against the plunger either way, but how fast you do it changes the work involved. A gas expanding against a piston is exactly this story in reverse, and the speed of the change is the whole point of this page." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When a gas expands, it pushes the piston outward, so the gas is doing work on the surroundings. When the surroundings push the piston in and compress the gas, work is done on the gas. In thermodynamics we always measure work done **on the system**, and the formula for this **pressure–volume work** is:\n\n" +
      "$ w = -P_{ext}\\\\,\\\\Delta V $\n\n" +
      "where $ P_{ext} $ is the pressure pushing on the piston and $ \\\\Delta V = V_2 - V_1 $. Look at the minus sign. In an expansion the gas grows, so $ \\\\Delta V $ is positive, which makes $ w $ negative. A negative $ w $ means the system is losing energy as it does work on the surroundings. In a compression $ \\\\Delta V $ is negative, so $ w $ comes out positive: energy is pushed into the gas." },

    // 3 — heading 1 (with objective)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Work When a Gas Pushes a Piston',
      objective: 'Use $ w = -P_{ext}\\\\,\\\\Delta V $ to find the work of an expansion or compression and read its sign correctly.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The simplest case is a gas expanding against a fixed outside pressure, say the atmosphere. The piston feels the same $ P_{ext} $ from start to finish, so the work is just that constant pressure times the change in volume:\n\n" +
      "$ w = -P_{ext}(V_2 - V_1) $\n\n" +
      "This is the **irreversible** case, and it is the one you will use most often. The gas pressure inside might start high and fall as the gas expands, but the work is set entirely by the outside pressure the piston is pushing against, not by the gas pressure. That single fact trips up a lot of students, so hold on to it: in $ w = -P_{ext}\\\\,\\\\Delta V $, the pressure is always the **external** one." },

    // 4 — image: the irreversible expansion against constant Pext
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A gas in a cylinder expanding in one jerk against a fixed external pressure shown as a constant weight on the piston',
      caption: '📸 Constant external pressure: the gas pushes against a fixed weight, all at once',
      generation_prompt: 'A clean scientific diagram on a deep near-black background (#0a0a0a). A vertical cylinder of glowing gas with a piston on top, and a single fixed block weight resting on the piston representing a constant external pressure. The piston has jumped from a low position (dashed outline, V1) up to a high position (solid, V2) in one motion, with a motion-blur arrow showing the sudden jerk. A small inset shows the matching P–V graph: a flat horizontal line at the constant external pressure, with the area beneath it shaded as a simple rectangle. Orange and amber for the gas and shaded rectangle, cool blue for the piston and weight, minimal white labels (V1, V2, Pext only). Clean illustration style.' },

    // 5 — reasoning_prompt (mid-page)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "A gas expands against a fixed external pressure of 1 bar that stays at 1 bar the whole time. Is this expansion reversible or irreversible, and why?",
      options: [
        "Reversible, because the pressure is known and constant the whole way",
        "Irreversible, because a fixed external pressure cannot stay matched to the gas pressure as the gas pressure falls",
        "Reversible, because the gas returns to where it started",
        "Irreversible, because 1 bar is too small a pressure for reversible work"
      ],
      correct_index: 1,
      reveal: "As the gas expands, its own pressure keeps dropping. A reversible change needs the outside pressure to drop in step with it, staying matched at every instant. A pressure pinned at 1 bar cannot do that, so the gas is always pushing against a mismatch. That mismatch is exactly what makes the change a one-way, **irreversible** jerk. The clue to memorise: a *constant* external pressure always means irreversible. Reversible work needs a *variable* external pressure." },

    // 6 — heading 2 (with objective)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Reversible vs Irreversible — One Grain at a Time',
      objective: 'Explain why only the reversible path has a smooth P–V curve, and write the reversible isothermal work formula.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Picture a single grain of rice sitting on the piston, balancing the gas. Lift off one grain and the gas pushes the piston up by a hair, then settles into balance again. Lift the next grain, another hair, settle again. Every pause is a point where the inside and outside pressures are matched, an equilibrium point you can actually mark. Join all those points and you get a smooth curve. That smooth **reversible** P–V curve exists *because* every step was an equilibrium.\n\n" +
      "Now do it the rough way: drop a one-kilogram block on the piston in one go. The gas slams down, overshoots, wobbles, and finally stops. You know only where it started and where it ended. None of the in-between points were equilibrium, so there is no curve to draw, only a rectangle at the final pressure. That is the **irreversible** path." },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For the reversible path, the external pressure matches the gas pressure at every step, so we can use $ PV = nRT $ and add up the work step by step. For a gas expanding at constant temperature (an **isothermal** expansion), the result is:\n\n" +
      "$ w = -2.303\\\\,nRT\\\\log\\\\frac{V_2}{V_1} $\n\n" +
      "This single formula carries the whole reversible isothermal story: the work depends on the moles $ n $, the temperature $ T $, and the ratio of the final to the starting volume." },

    // 7 — heading 3 (with objective)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Maximum Work, and the Area Under the Curve',
      objective: 'State why the reversible path gives the maximum work of expansion, and read work as the area under the P–V curve.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Work is the **area under the P–V curve**. The smooth reversible curve always sits above the low rectangle of the irreversible path between the same two volumes, so it encloses more area. More area means more work delivered. This is why a **reversible expansion gives the maximum work** a gas can hand over, and why a reversible compression takes the **minimum work** to push the gas back. The slow, gentle, one-grain-at-a-time path is the one that squeezes the most useful work out of the gas.\n\n" +
      "One last warning before the examples, and it is a marks-loser: the **unit trap**. Multiply a pressure in bar by a volume in litres and your work comes out in L·bar, not joules. The conversion is $ 1\\\\text{ L·bar} = 100\\\\text{ J} $ (and $ 1\\\\text{ L·atm} \\\\approx 101.3\\\\text{ J} $). Skip it and your answer is off by a factor of a hundred." },

    // 8 — image: PV diagram, reversible curve area vs irreversible rectangle
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A pressure-volume graph comparing a smooth reversible curve with a large shaded area to a low irreversible rectangle with a smaller area, between the same two volumes',
      caption: '📸 Same start and end, more area under the reversible curve: that extra area is the maximum work',
      generation_prompt: 'A clean pressure-volume (P on vertical axis, V on horizontal axis) graph on a deep near-black background (#0a0a0a). Two paths from the same starting point (high P, low V at V1) to the same ending point (low P, high V at V2). Path 1: a smooth downward-curving reversible isotherm, with the full area beneath it shaded in warm orange (labelled as the larger area). Path 2: a low flat horizontal line at the final external pressure forming a rectangle, its smaller area shaded in dim amber, clearly less area than the curve. The curve visibly sits above the rectangle. Minimal white labels (V1, V2, "reversible", "irreversible" only). Glowing axes, scientific-illustration style, no clutter.' },

    // 9 — worked_example #1 (irreversible, unit trap)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example 1 — Irreversible Expansion (mind the units)',
      problem: "2 mol of an ideal gas expands from 5 L to 15 L against a constant external pressure of 2 bar. Find the work $ w $ done on the gas, in joules.",
      solution: "**Spot the path.** The external pressure is *constant* at 2 bar, so this is an irreversible expansion. Use $ w = -P_{ext}\\\\,\\\\Delta V $.\n\n" +
        "**Find the volume change.** $ \\\\Delta V = V_2 - V_1 = 15 - 5 = 10\\\\text{ L} $.\n\n" +
        "**Put in the numbers.** $ w = -P_{ext}\\\\,\\\\Delta V = -(2\\\\text{ bar})(10\\\\text{ L}) = -20\\\\text{ L·bar} $.\n\n" +
        "**Convert the units (the trap).** The answer is asked in joules, but $ -20\\\\text{ L·bar} $ is not joules yet. Use $ 1\\\\text{ L·bar} = 100\\\\text{ J} $:\n\n" +
        "$ w = -20\\\\times 100 = -2000\\\\text{ J} = -2\\\\text{ kJ} $.\n\n" +
        "**Read the sign.** $ w $ is negative, so the gas lost energy doing work on the surroundings as it expanded. That is exactly what an expansion should give." },

    // 10 — worked_example #2 (reversible isothermal contrast, punchline)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example 2 — The Same Gas, Done Reversibly',
      problem: "The same 2 mol of ideal gas now expands isothermally and reversibly from 5 L to 15 L at 300 K. Find $ w $. Take $ R = 8.314\\\\text{ J mol}^{-1}\\\\text{K}^{-1} $ and $ \\\\log 3 \\\\approx 0.477 $.",
      solution: "**Spot the path.** It says reversible and isothermal, so use $ w = -2.303\\\\,nRT\\\\log\\\\frac{V_2}{V_1} $.\n\n" +
        "**Find the volume ratio.** $ \\\\frac{V_2}{V_1} = \\\\frac{15}{5} = 3 $, and $ \\\\log 3 \\\\approx 0.477 $.\n\n" +
        "**Put in the numbers.** $ w = -2.303\\\\times 2\\\\times 8.314\\\\times 300\\\\times 0.477 $.\n\n" +
        "**Work it through.** $ 2.303\\\\times 2 = 4.606 $; $ \\\\times 8.314 = 38.30 $; $ \\\\times 300 = 11490 $; $ \\\\times 0.477 \\\\approx 5481 $.\n\n" +
        "$ w \\\\approx -5481\\\\text{ J} \\\\approx -5.48\\\\text{ kJ} $.\n\n" +
        "**The punchline.** Same gas, same start and end volumes, but the reversible path delivered about 5.48 kJ of work against only 2 kJ for the irreversible jerk. The reversible path squeezed out *more* work. That is what **maximum work** means: do it slowly, one grain at a time, and the gas gives you everything it has." },

    // 11 — callout[remember]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Carry These Four',
      markdown: "**Reversible expansion = maximum work.** **Constant external pressure = irreversible.** **Area under the P–V curve = work.** And the unit-killer: $ 1\\\\text{ L·bar} = 100\\\\text{ J} $. Get these four and most PV-work questions become plain arithmetic." },

    // 12 — callout[exam_tip]
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "The examiner almost never uses the word \"reversible\" or \"irreversible\". You have to read the disguise:\n\n" +
        "**\"Calculate the maximum work of expansion\"** is code for the reversible path, so reach for $ w = -2.303\\\\,nRT\\\\log\\\\frac{V_2}{V_1} $.\n\n" +
        "**\"Expands against a constant external pressure\"** is code for irreversible, so use $ w = -P_{ext}\\\\,\\\\Delta V $.\n\n" +
        "And the units ambush: you compute a clean number in L·bar while every option is in kJ. Convert first, then match. An answer that looks right but is a hundred times too big or too small is a unit slip, not a method slip." },

    // 13 — inline_quiz (LAST teaching block, 3 questions, pass_threshold 0.67)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'A gas expands, so its volume increases. Using $ w = -P_{ext}\\\\,\\\\Delta V $, what is the sign of the work done on the gas?',
          options: [
            'Positive, because work is always counted as a gain',
            'Negative, because the gas does work on the surroundings as it expands',
            'Zero, because the external pressure does not change',
            'Positive, because the volume increased'
          ],
          correct_index: 1,
          explanation: 'In an expansion $ \\\\Delta V $ is positive, and the minus sign in $ w = -P_{ext}\\\\,\\\\Delta V $ then makes $ w $ negative, meaning the system loses energy doing work on the surroundings. The tempting "positive because volume increased" answer forgets the minus sign that the convention puts in front of $ P_{ext}\\\\,\\\\Delta V $.' },
        { id: uuidv4(), difficulty_level: 2,
          question: '3 mol of an ideal gas expands from 2 L to 12 L against a constant external pressure of 1 bar. What is the work done on the gas?',
          options: [
            '$ -10 $ J',
            '$ -1200 $ J',
            '$ -1000 $ J',
            '$ -12 $ J'
          ],
          correct_index: 2,
          explanation: 'Constant external pressure means irreversible, so $ w = -P_{ext}\\\\,\\\\Delta V = -(1)(12-2) = -10\\\\text{ L·bar} $, and converting with $ 1\\\\text{ L·bar} = 100\\\\text{ J} $ gives $ -1000 $ J. The $ -10 $ value is the trap of leaving the answer in L·bar without converting to joules; the $ -1200 $ value is the trap of using $ V_2 $ alone $ (12) $ instead of $ \\\\Delta V = 10 $.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Between the same starting and ending volumes, why does the reversible isothermal expansion give more work than the irreversible expansion against a constant pressure?',
          options: [
            'The reversible path encloses a larger area under the P–V curve, and area equals work',
            'The reversible path is faster, so it transfers energy more efficiently',
            'The reversible path uses a larger value of $ n $ in the formula',
            'The irreversible path loses work to friction in the piston'
          ],
          correct_index: 0,
          explanation: 'Work is the area under the P–V curve, and the smooth reversible curve sits above the low irreversible rectangle between the same two volumes, so it encloses more area and yields more work. The "faster is more efficient" idea is backwards: reversible work is the slow, one-grain-at-a-time path, and the moles $ n $ are the same gas in both cases.' },
      ] },

    // 14 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now find the work for both paths and read its sign. But work is only half of the energy story. Next we bring in heat, $ q $, and combine the two into the master equation of the whole chapter: the First Law of Thermodynamics.*" },
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
    slug: NEW_SLUG, title: 'Pressure–Volume Work',
    subtitle: 'When a gas pushes a piston it does work — and doing it slowly versus fast gives completely different answers.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'pv-work', 'reversible', 'irreversible', 'maximum-work'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 4 (pressure–volume work; reversible vs irreversible; maximum work)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
