'use strict';
/**
 * Class 12 Physics · Ch.8 "Electromagnetic Waves" — pages 5–9.
 *
 * Pages 1–4 (a separate script) set up the crisis in Ampère's law, patch it
 * with displacement current, collect Maxwell's four equations, and show they
 * predict a wave at $ c = 1/\sqrt{\mu_0\varepsilon_0} $ — the speed of light.
 * These five pages take that wave and ask what it actually IS: its shape, the
 * energy it carries, the push it exerts, how we make and catch one, and the
 * whole spectrum it turns out to describe.
 *
 * PHYSICS FIXED HERE AND USED UNCHANGED:
 *   • Plane wave along $ +x $: $ \vec{E} $ along $ \hat{j} $, $ \vec{B} $ along
 *     $ \hat{k} $, so $ \vec{E}\times\vec{B} $ points along travel.
 *   • $ E = cB $ at EVERY point and EVERY instant — which is exactly why the
 *     two fields must be IN PHASE. (The commonest misconception, imported from
 *     the LC circuit where the two energies really are a quarter-cycle apart,
 *     is that they are 90° out of step. p5 kills it explicitly.)
 *   • Energy density halves are therefore exactly equal (p6 proves it).
 *   • Radiation pressure: $ I/c $ absorbed, $ 2I/c $ reflected — the 2 is a
 *     momentum REVERSAL, not a doubling of the momentum delivered (p7 derives
 *     it as final-minus-initial rather than asserting it).
 *
 * ANSWER POSITIONS: every `reasoning_prompt` here carries an explicit
 * `correct_index` (the book-wide defect fixed 2026-07-31 — four options, no
 * key, so the reader could show no verdict and `_hygiene.js` could not see
 * them). The ten on these pages sit at 3, 1, 0, 2, 3, 1, 2, 0, 3, 1 — that is
 * 2/3/2/3 across A/B/C/D. Inline-quiz items go through `q()`, which spreads
 * deterministically.
 *
 * Run: node scripts/physics12-book/build_ch8_b_waves.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 8;

// ── p5 · The Structure of an EM Wave ─────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'emw-structure-of-an-em-wave',
  title: 'The Structure of an EM Wave',
  subtitle: 'Two fields at right angles, rising and falling together',
  glossary: [
    { term: 'transverse wave', definition: 'A wave in which whatever is oscillating does so at right angles to the direction the wave travels. Light is transverse; sound in air is not.' },
    { term: 'plane wave', definition: 'An idealised wave whose fields have the same value everywhere on any plane perpendicular to the direction of travel. Far from a small source, any wave looks like one.' },
    { term: 'in phase', definition: 'Two oscillations are in phase when they reach zero together and reach their peaks together. In an electromagnetic wave the electric and magnetic fields are in phase.' },
    { term: 'wave number', definition: 'The quantity $ k = \\frac{2\\pi}{\\lambda} $, which counts how much the phase of a wave advances per metre travelled.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Page 4 handed you a wave and three unanswered questions: which way do the two fields point, how are their sizes related, and how do both sit relative to the direction of travel? This page settles all three.\n\nStart with the sharpest one. Say the wave is travelling **east**. The electric field inside it has to point somewhere.\n\nCould it point east as well — along the direction of travel, the way air molecules in a sound wave shuffle back and forth along the direction the sound is going?',
      hint: 'Gauss\'s law still applies in the empty space the wave is crossing, and there is no charge there. What does that forbid a field from doing along the direction it varies in?',
      reveal: '**No. In empty space, neither field can have any component along the direction of travel.**\n\nThe reason is Gauss\'s law, which is still sitting in Maxwell\'s set and still says that where there is no charge, electric field lines have no beginnings and no endings.\n\nNow think about what an eastward component of $ \\vec{E} $ would have to do. Being part of a wave, it would have to be large in some places along the eastward line and small in others — that is what waving *means*. But a field that grows and shrinks along the very direction it points in is a field whose lines are bunching up and thinning out, and lines can only bunch up where charge starts them or stops them. There is no charge. So that component must be zero everywhere.\n\nThe identical argument, run on the no-monopoles law of Chapter 4, kills any magnetic component along the direction of travel too.\n\nSo **both fields lie flat across the direction the wave is going** — the wave is transverse, and it has no choice in the matter. That is the first of the three answers. The rest of the page fixes the angle between the two fields, and the ratio of their sizes.',
    }),
    b('text', 1, {
      markdown: 'Take the simplest case that Maxwell\'s equations allow — a **plane wave** travelling in one fixed direction, which we shall call the $ x $ direction. The equations then force the following shape on it, with no freedom left over:',
    }),
    b('latex_block', 2, {
      latex: 'E_y = E_0\\sin(kx - \\omega t), \\qquad B_z = B_0\\sin(kx - \\omega t)',
      label: 'A plane electromagnetic wave travelling along x',
      note: 'Same sine, same argument, same instant of peaking. That is the whole content of the phrase "in phase".',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'Three directions, all at right angles',
      level: 2,
      objective: 'State the mutual orientation of E, B and the direction of travel, and use the cross product to find any one of the three from the other two.',
    }),
    b('text', 4, {
      markdown: 'Read the two lines above carefully and the rest of the geometry falls out.\n\n**The wave travels along $ x $.** The electric field points along $ y $. The magnetic field points along $ z $. So not only is each field across the direction of travel, as the opening argument showed — the two fields are also at right angles **to each other**. All three directions are mutually perpendicular.\n\nA wave whose oscillating quantity lies across the direction of travel is called **transverse**, and this is why light can be polarised while sound in air cannot. Sound has nothing lying across its path to orient.\n\n**The order of the two fields is fixed, not free.** Curl your right hand from $ \\vec{E} $ towards $ \\vec{B} $ through the smaller angle, and your thumb points the way the wave is going:\n\n$ \\vec{E}\\times\\vec{B} $ points along the direction of travel.\n\nThe reverse product $ \\vec{B}\\times\\vec{E} $ points backwards, so getting the order right matters. A quick way to remember which way round it goes: the same combination $ \\frac{\\vec{E}\\times\\vec{B}}{\\mu_0} $ is the quantity that carries the *energy*, and energy must travel with the wave, not against it.\n\nAnd because the three are perpendicular, the wave can be pointed in any direction you like simply by rotating the whole trio together. Nothing in the physics picks out a special direction in space.',
    }),
    b('image', 5, {
      src: '',
      alt: 'A three-dimensional sketch of a plane electromagnetic wave, with the electric field oscillating vertically, the magnetic field horizontally, and the wave travelling along the third axis',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The two fields peak at the same places and vanish at the same places. They are never a quarter-cycle apart.',
      generation_prompt: 'Clean scientific 3D-perspective diagram on a near-black background (#0B0C0F), thin dim-grey line art, wide horizontal composition. A long straight horizontal axis runs left to right across the frame with a bright orange arrowhead at the right end, representing the direction of travel. A warm amber sine curve oscillates in the vertical plane above and below that axis, drawn with a series of short vertical amber arrows from the axis to the curve, representing the electric field. A second sine curve of identical wavelength and identical phase oscillates in the horizontal plane, drawn receding into perspective in a cooler dim blue-grey, with short arrows from the axis out to it, representing the magnetic field. Crucially both curves cross the axis at exactly the same points and reach their crests at exactly the same points. One wavelength is marked between two crests with a thin double-headed grey arrow. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'spatial',
      prompt: 'At one instant, at one point in a plane electromagnetic wave, the electric field points due **north** and the magnetic field points **vertically upward**. Which way is the wave travelling at that point?',
      options: [
        'Due west, the direction given by $ \\vec{B}\\times\\vec{E} $',
        'Vertically downward, opposite to the magnetic field',
        'Due south, exactly opposite to the electric field',
        'Due east, the direction given by $ \\vec{E}\\times\\vec{B} $',
      ],
      correct_index: 3,
      reveal: '**Due east.**\n\nSet up axes so that east is $ \\hat{i} $, north is $ \\hat{j} $ and up is $ \\hat{k} $. Then $ \\vec{E} $ lies along $ \\hat{j} $ and $ \\vec{B} $ along $ \\hat{k} $, and\n\n$ \\hat{j}\\times\\hat{k} = \\hat{i} $\n\nwhich is east.\n\n**The trap is the order.** Work out $ \\vec{B}\\times\\vec{E} $ instead and you get $ \\hat{k}\\times\\hat{j} = -\\hat{i} $, which is west — the exact opposite, and a perfectly reasonable-looking answer. Cross products do not commute, and this is one of the places where that costs marks.\n\n**A check that needs no algebra.** Point the fingers of your right hand north (along $ \\vec{E} $), then curl them upward (towards $ \\vec{B} $). Your thumb points east. Do it the other way round and your thumb points west, which should feel wrong the moment you notice you had to start from the magnetic field.\n\n**And a physical anchor, so you never have to guess.** The energy in the wave flows along $ \\vec{E}\\times\\vec{B} $, and energy has to travel *with* the wave. If your answer has the energy going one way and the wave the other, you have the order backwards.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'In step, not out of step',
      level: 2,
      objective: 'Explain why the electric and magnetic fields of a travelling wave must be in phase, and why the LC-circuit picture must not be carried over.',
    }),
    b('text', 8, {
      markdown: 'Now the part that is most often got wrong, and it is worth being blunt about it.\n\n**Wrong version:** "$ E $ and $ B $ are a quarter of a cycle apart — when one is at its peak the other is zero, and the energy sloshes between them."\n**Right version:** "$ E $ and $ B $ are **in phase** — they reach zero together and reach their peaks together."\n\nThe wrong version is not a random guess. It is the **LC circuit of Chapter 7 being smuggled in**. In an LC circuit the capacitor\'s electric energy and the inductor\'s magnetic energy genuinely are a quarter-cycle apart: when one is full the other is empty, and the total is constant. That picture is correct there and wrong here, and the reason is that an LC circuit **stores** energy in one place while a wave **carries** it away.\n\nThe proof that they are in phase takes one line. Maxwell\'s equations force the two amplitudes into a fixed ratio:',
    }),
    b('latex_block', 9, {
      latex: '\\frac{E_0}{B_0} = c \\qquad \\text{and, at every point and every instant,} \\qquad \\frac{E}{B} = c',
      label: 'The two fields are locked to each other',
      note: 'The second statement is the stronger one. It is what forces the two fields to be in phase.',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'Look at what the second statement is saying. Not that the *peaks* are in the ratio $ c $ — that the fields are in that ratio **at every moment**, everywhere along the wave.\n\nSo if $ E $ is zero at some point at some instant, then $ B = \\frac{E}{c} $ is zero there too, at that same instant. If $ E $ is at its largest, so is $ B $. There is no room at all for one to lag the other; a quarter-cycle lag would mean $ B $ was at its peak while $ E $ was zero, and the ratio $ \\frac{E}{B} $ would be zero instead of $ c $.\n\n**Two fields locked in a fixed ratio cannot be out of step.** That is the whole argument.\n\nIt also explains why the numbers look so lopsided. Dividing by $ 3.0\\times10^{8} $ makes $ B_0 $ absurdly small next to $ E_0 $ — an electric field of hundreds of volts per metre sits beside a magnetic field of a few microtesla. That does **not** mean the magnetic part is unimportant. Page 6 shows the two carry exactly equal energy, and it is the tiny-looking $ B $ that keeps the whole thing propagating.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'In a plane electromagnetic wave in vacuum, consider the instant at which the electric field at some point is momentarily **zero**. What is the magnetic field at that same point at that same instant?',
      options: [
        'At its maximum value, since the energy has moved into it',
        'Zero as well, because $ E $ and $ B $ rise and fall together',
        'At half its maximum, a quarter of a cycle behind $ E $',
        'Unchanged, since $ B $ does not vary along the wave at all',
      ],
      correct_index: 1,
      reveal: '**Zero as well.**\n\nThe fields obey $ E = cB $ at every point and every instant. Put $ E = 0 $ into that and $ B $ has nowhere to go but zero.\n\n**Why the other answer feels right.** In the LC circuit of Chapter 7, the energy really does slosh: capacitor full, inductor empty, then the reverse, a quarter of a cycle apart. Students carry that picture across, and it is a reasonable thing to try — but it describes **storage**, not **transport**.\n\nAn LC circuit holds a fixed amount of energy and passes it back and forth between two places that stay put. A wave does not hold energy at all; it hands it on. At the moment both fields are zero at a point, the energy that was there a moment ago has simply **moved a little further along** — it is now sitting a fraction of a wavelength ahead, where the fields are large. Nothing has been lost and nothing needs to be stored locally.\n\n**The exam version of this.** If a question ever offers you a wave in which $ E $ and $ B $ are $ 90^\\circ $ apart, it is not describing a travelling wave in free space. Ratio $ c $, at all times, means in phase.',
      difficulty_level: 3,
    }),
    b('worked_example', 12, {
      label: 'reading a wave off its two numbers',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A plane electromagnetic wave travels through vacuum. Its electric field has amplitude $ E_0 = 48 $ V/m and it oscillates at a frequency of $ 2.0\\times10^{10} $ Hz. Find the amplitude of its magnetic field, its wavelength, its angular frequency and its wave number. Take $ c = 3.0\\times10^{8} $ m/s.',
      solution: '**Magnetic amplitude.** The fields are locked at the ratio $ c $:\n\n$ B_0 = \\frac{E_0}{c} = \\frac{48}{3.0\\times10^{8}} = 1.6\\times10^{-7}\\ \\text{T} $\n\nThat is $ 0.16 $ microtesla — about a three-hundredth of the Earth\'s own magnetic field. Small, and yet it carries exactly half the wave\'s energy.\n\n**Wavelength.** Every wave obeys $ c = \\nu\\lambda $:\n\n$ \\lambda = \\frac{c}{\\nu} = \\frac{3.0\\times10^{8}}{2.0\\times10^{10}} = 1.5\\times10^{-2}\\ \\text{m} $\n\nSo $ 1.5 $ cm — a microwave, as page 9 will confirm.\n\n**Angular frequency.**\n\n$ \\omega = 2\\pi\\nu = 2\\pi(2.0\\times10^{10}) = 1.3\\times10^{11}\\ \\text{rad/s} $\n\n**Wave number.**\n\n$ k = \\frac{2\\pi}{\\lambda} = \\frac{2\\pi}{1.5\\times10^{-2}} = 4.2\\times10^{2}\\ \\text{rad/m} $\n\n**Check it two ways.** For any electromagnetic wave in vacuum, $ \\frac{\\omega}{k} = c $. Here $ \\frac{1.3\\times10^{11}}{4.2\\times10^{2}} = 3.1\\times10^{8} $ m/s ✓ — the small discrepancy is rounding, and if you had kept more digits it would land on $ 3.0\\times10^{8} $ exactly.\n\n**What the question really gave you.** Two numbers, $ E_0 $ and $ \\nu $, and from them everything else followed. That is the point of this page: an electromagnetic wave in vacuum has no free parameters beyond an amplitude, a frequency and a direction. The speed is fixed, the field ratio is fixed, the phase relation is fixed, the perpendicularity is fixed. Nature had almost no choices to make.',
    }),
    b('callout', 13, {
      variant: 'fun_fact',
      markdown: 'A wave with nothing waving in it was too much for nineteenth-century physics to accept. Every wave anyone had ever met needed a medium, so one was invented for light: the **luminiferous ether**, an invisible substance filling all of space, perfectly transparent, perfectly frictionless, and stiffer than steel — because a wave this fast needs an enormously rigid medium.\n\nIf the ether existed, the Earth must be ploughing through it at some speed, and light should travel slightly faster with the flow than across it. In **1887** Albert Michelson and Edward Morley built an interferometer sensitive enough to detect a difference of one part in a hundred million.\n\nThey found **nothing**. No ether wind, in any direction, at any time of year.\n\nIt is one of the most famous null results in physics, and the eventual answer — Einstein\'s, in 1905 — was that there is no medium, that the speed $ c $ falling out of Maxwell\'s equations is the same for every observer, and that light needs nothing to travel through because the fields *are* the wave.\n\nMaxwell had written that down in 1865. It just took forty years for everyone to believe it.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- An electromagnetic wave is an oscillation of $ \\vec{E} $ and $ \\vec{B} $ themselves. **No medium is needed.**\n- $ \\vec{E} $, $ \\vec{B} $ and the direction of travel are **mutually perpendicular** — the wave is **transverse**.\n- $ \\vec{E}\\times\\vec{B} $ points along the direction of travel. The order matters; the reverse gives the opposite way.\n- $ \\frac{E_0}{B_0} = c $, and more strongly $ \\frac{E}{B} = c $ **at every point and every instant**.\n- Therefore the two fields are **in phase** — zero together, peak together. Never $ 90^\\circ $ apart.\n- The quarter-cycle picture belongs to the **LC circuit**, which stores energy. A wave carries it.\n- $ B_0 $ looks tiny only because it equals $ \\frac{E_0}{c} $. It carries exactly half the energy.',
    }),
    b('text', 15, {
      markdown: 'Next: the wave is carrying energy from the Sun to your skin across a hundred and fifty million kilometres of nothing. How much, and how is it shared between the two fields?',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('In a plane electromagnetic wave travelling through vacuum, the electric field, the magnetic field and the direction of travel are',
          ['mutually perpendicular', 'all parallel to one another', 'at 45 degrees to one another', 'perpendicular only inside a medium'],
          0,
          'Neither field ever has a component along the direction of travel, which is what makes the wave transverse, and the two fields are at right angles to each other as well.',
          1),
        q('For a plane electromagnetic wave in vacuum, the ratio of the field amplitudes $ \\frac{E_0}{B_0} $ equals',
          ['$ c $', '$ \\frac{1}{c} $', '$ c^{2} $', '$ \\mu_0\\varepsilon_0 $'],
          0,
          'Maxwell\'s equations lock the two fields at the wave speed. It is worth checking the units: volts per metre divided by tesla does come out as metres per second.',
          1),
        q('In an electromagnetic wave the electric and magnetic fields',
          ['reach their peaks at the same instant', 'are a quarter of a cycle apart', 'are exactly half a cycle apart', 'have no fixed relation in time'],
          0,
          'Since $ E = cB $ holds at every moment, one field cannot be large while the other is zero. The quarter-cycle relation belongs to an LC circuit, where energy is stored rather than carried away.',
          2),
      ],
    }),
  ],
};

// ── p6 · Energy and Intensity ────────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'emw-energy-and-intensity',
  title: 'Energy and Intensity',
  subtitle: 'Two halves that turn out to be exactly equal',
  glossary: [
    { term: 'energy density', definition: 'The energy stored per unit volume of a field, measured in joules per cubic metre. For an electromagnetic wave both fields contribute, and equally.' },
    { term: 'intensity', definition: 'The energy delivered per second to each square metre of a surface facing the wave, measured in watts per square metre. For a wave in vacuum it is the average energy density times $ c $.' },
    { term: 'inverse-square law', definition: 'The rule that intensity from a small source falls as $ \\frac{1}{r^{2}} $, because the same power is spread over a sphere whose area grows as $ r^{2} $.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Sunlight arriving at the top of the Earth\'s atmosphere delivers about $ 1.4 $ kilowatts to every square metre — roughly a room heater\'s worth of power on every square of ground, arriving after eight minutes of travel through nothing at all.\n\nWhile that energy was in transit, it had to be somewhere. There is no medium to hold it, and no matter to warm.\n\nSo which of the two fields was carrying it — the electric one, or the magnetic one?',
      hint: 'Page 5 gave you the size of each field. But size is not the same as energy content — check the formulas before trusting the numbers.',
      reveal: '**Both, and in exactly equal shares.** Not roughly equal — exactly, at every point and every instant.\n\nThat is genuinely surprising, because the numbers look so lopsided. In sunlight the electric field runs to about $ 1000 $ volts per metre while the magnetic field is a few **microtesla**. One number is nine orders of magnitude bigger than the other, and it is very tempting to conclude that the electric field is doing all the work.\n\nIt is not. The two energy-density formulas are built differently — one has $ \\varepsilon_0 $ multiplying, the other has $ \\mu_0 $ dividing — and when you feed in $ B = \\frac{E}{c} $ the difference cancels out perfectly.\n\nYou have already met both halves separately. Chapter 2 gave you the energy stored in an electric field; Chapter 6 gave you the energy stored in a magnetic one. **This is the page where they finally meet**, and the fact that they meet as exact equals is the strongest hint yet that electricity and magnetism were never really two subjects.',
    }),
    b('text', 1, {
      markdown: 'Both pieces are already yours.\n\nIn **Chapter 2**, working out the energy stored in a charged capacitor, you found that the energy is not really in the plates at all but in the field between them, at a density of $ u_E = \\frac{1}{2}\\varepsilon_0E^{2} $ joules per cubic metre.\n\nIn **Chapter 6**, doing the same accounting for a current-carrying inductor, you found the magnetic field holds $ u_B = \\frac{B^{2}}{2\\mu_0} $ per cubic metre.\n\nAn electromagnetic wave has both fields present at once, so its energy density is simply the sum:',
    }),
    b('latex_block', 2, {
      latex: 'u = \\frac{1}{2}\\varepsilon_0 E^{2} + \\frac{B^{2}}{2\\mu_0}',
      label: 'Energy density of an electromagnetic wave',
      note: 'Chapter 2 supplied the first term and Chapter 6 the second. Nothing new has been assumed here.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'The two halves are exactly equal',
      level: 2,
      objective: 'Prove that the magnetic and electric energy densities of a travelling wave are equal, using only the field ratio and the speed of light.',
    }),
    b('step_solver', 4, {
      title: 'Showing the halves are equal',
      problem: 'Show that in a plane electromagnetic wave in vacuum the magnetic energy density $ \\frac{B^{2}}{2\\mu_0} $ is exactly equal to the electric energy density $ \\frac{1}{2}\\varepsilon_0E^{2} $, at every point and every instant.',
      intro: 'Only two facts are needed, and you already have both. From page 5, $ E = cB $ at every instant. From page 4, $ c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $. Everything else is algebra.',
      steps: [
        st('Start from $ u_B = \\frac{B^{2}}{2\\mu_0} $ and replace $ B $ by $ \\frac{E}{c} $',
          'Page 5 locked the two fields at the ratio $ c $, so anywhere a $ B $ appears we may write $ \\frac{E}{c} $ instead. This is the substitution that lets the two expressions be compared at all.', {
            check: {
              kind: 'mcq',
              prompt: 'Page 5 fixed the ratio of the two field magnitudes in vacuum. What does $ \\frac{E}{B} $ equal?',
              options: ['$ \\mu_0\\varepsilon_0 $', '$ c $', '$ c^{2} $', '$ \\frac{1}{c} $'],
              answer_index: 1,
              feedback_right: 'Yes — and it holds at every instant, not just for the amplitudes, which is what makes this substitution legal inside a squared term.',
              feedback_wrong: 'The locked ratio is $ \\frac{E}{B} = c $. Check the units if you are unsure: volts per metre divided by tesla comes out as metres per second.',
            },
          }),
        st('$ u_B = \\frac{E^{2}}{2\\mu_0 c^{2}} $',
          'Squaring $ \\frac{E}{c} $ puts an $ E^{2} $ on top and a $ c^{2} $ underneath, next to the $ 2\\mu_0 $ that was already there. Nothing clever has happened yet — this is just substitution.'),
        st('Now use $ c^{2} = \\frac{1}{\\mu_0\\varepsilon_0} $, so that $ \\frac{1}{c^{2}} = \\mu_0\\varepsilon_0 $',
          'This is page 4\'s result, turned upside down. It is the step that makes the constants cancel — and notice that it is the *same* relation that made the wave travel at $ c $ in the first place.', {
            check: {
              kind: 'mcq',
              prompt: 'If $ c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $, what is $ \\frac{1}{c^{2}} $?',
              options: ['$ \\mu_0\\varepsilon_0 $', '$ \\sqrt{\\mu_0\\varepsilon_0} $', '$ \\frac{1}{\\mu_0\\varepsilon_0} $', '$ \\mu_0 + \\varepsilon_0 $'],
              answer_index: 0,
              feedback_right: 'Correct — square both sides and the square root disappears, leaving $ c^{2} = \\frac{1}{\\mu_0\\varepsilon_0} $, so its reciprocal is the product itself.',
              feedback_wrong: 'Square both sides of $ c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $ to get $ c^{2} = \\frac{1}{\\mu_0\\varepsilon_0} $. Turning that over gives $ \\frac{1}{c^{2}} = \\mu_0\\varepsilon_0 $.',
            },
          }),
        st('$ u_B = \\frac{E^{2}\\mu_0\\varepsilon_0}{2\\mu_0} = \\frac{1}{2}\\varepsilon_0E^{2} = u_E $',
          'The $ \\mu_0 $ cancels top and bottom and what is left is precisely the electric energy density. So the halves are equal — **not on average, but at every point and every instant**, since $ E = cB $ held at every instant too.', {
            check: {
              kind: 'mcq',
              prompt: 'What does this result let you write for the TOTAL energy density $ u $?',
              options: ['$ u = \\frac{1}{2}\\varepsilon_0E^{2} $', '$ u = \\varepsilon_0E^{2} $', '$ u = \\frac{1}{4}\\varepsilon_0E^{2} $', '$ u = \\frac{1}{2\\varepsilon_0}E^{2} $'],
              answer_index: 1,
              feedback_right: 'Exactly — two equal halves means the total is double either one, so the factor of a half disappears.',
              feedback_wrong: 'If the two halves are equal, the total is twice one of them: $ u = 2\\times\\frac{1}{2}\\varepsilon_0E^{2} = \\varepsilon_0E^{2} $.',
            },
          }),
      ],
      now_you_try: {
        problem: 'Use the same two substitutions the other way round to show that the total energy density can be written entirely in terms of the magnetic field, as $ u = \\frac{B^{2}}{\\mu_0} $.',
        answer: '$ u = u_E + u_B = 2u_B = 2\\times\\frac{B^{2}}{2\\mu_0} = \\frac{B^{2}}{\\mu_0} $.',
        solution: 'Since the halves are equal, the total is twice **either** of them — so you may double whichever one is more convenient.\n\nDoubling the magnetic half: $ u = 2u_B = 2\\times\\frac{B^{2}}{2\\mu_0} = \\frac{B^{2}}{\\mu_0} $.\n\n**Both forms are correct and both are used.** $ u = \\varepsilon_0E^{2} $ is the one to reach for when a question gives you the electric field, and $ u = \\frac{B^{2}}{\\mu_0} $ when it gives you the magnetic one. Neither is more fundamental.\n\n**A quick check that they agree.** Put $ B = \\frac{E}{c} $ into the magnetic form: $ \\frac{E^{2}}{\\mu_0c^{2}} = \\frac{E^{2}\\mu_0\\varepsilon_0}{\\mu_0} = \\varepsilon_0E^{2} $ ✓',
      },
    }),
    b('text', 5, {
      markdown: 'So the total energy density of the wave is $ u = \\varepsilon_0E^{2} $, or equivalently $ u = \\frac{B^{2}}{\\mu_0} $.\n\nBut that is the value at one instant, and the field is oscillating thousands of millions of times a second. No instrument on Earth reads the instantaneous value; every detector reads an **average** over an enormous number of cycles.\n\nSo we need the average of $ E^{2} $. For $ E = E_0\\sin(kx-\\omega t) $, the square is $ E_0^{2}\\sin^{2}(\\cdots) $, and the average of $ \\sin^{2} $ over a whole cycle is $ \\frac{1}{2} $ — exactly the same fact that gave you RMS values in Chapter 7. Hence $ \\langle E^{2}\\rangle = \\frac{E_0^{2}}{2} $, and:',
    }),
    b('latex_block', 6, {
      latex: 'u_{avg} = \\varepsilon_0\\langle E^{2}\\rangle = \\frac{1}{2}\\varepsilon_0 E_0^{2}',
      label: 'Average energy density of the wave',
      note: 'The half here is the cycle average of a sine squared — the same half that turned peak values into RMS values in Chapter 7.',
      highlight: true,
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'In sunlight at the Earth the electric field amplitude is about $ 1000 $ V/m while the magnetic field amplitude is only about $ 3 $ microtesla — nine powers of ten smaller. Does the electric field therefore carry nearly all the energy?',
      options: [
        'No — the two halves are exactly equal at every instant',
        'Yes — the electric half carries almost all of it',
        'Yes — the electric half carries about twice as much',
        'No — the magnetic half is the larger of the two here',
      ],
      correct_index: 0,
      reveal: '**No. The halves are exactly equal — the comparison of raw numbers is meaningless.**\n\nThis is a units trap, and it catches almost everybody once.\n\n$ E $ and $ B $ are measured in **different units**, so "bigger" does not mean anything until you convert both into energy. Comparing $ 1000 $ V/m with $ 3\\ \\mu\\text{T} $ is like comparing a temperature in degrees with a distance in metres and announcing that one is larger.\n\nDo the conversion honestly. $ u_E = \\frac{1}{2}\\varepsilon_0E^{2} $ multiplies by the very small number $ \\varepsilon_0 = 8.85\\times10^{-12} $. $ u_B = \\frac{B^{2}}{2\\mu_0} $ **divides** by the very small number $ \\mu_0 = 4\\pi\\times10^{-7} $. One formula shrinks its field, the other magnifies its field — and the step-by-step proof above shows the two effects cancel exactly.\n\n**Sanity check with the actual numbers.** $ u_E = \\frac{1}{2}(8.85\\times10^{-12})(1000)^{2} \\approx 4.4\\times10^{-6} $ J/m³, and $ u_B = \\frac{(3.0\\times10^{-6})^{2}}{2(4\\pi\\times10^{-7})} \\approx 3.6\\times10^{-6} $ J/m³. Equal to within the rounding of the two field values ✓\n\n**The lesson beyond this question:** never compare two physical quantities until they are in the same units. The size of a number in physics is a statement about the unit as much as about nature.',
      difficulty_level: 2,
    }),
    b('heading', 8, {
      text: 'Intensity — the quantity a detector actually reads',
      level: 2,
      objective: 'Define intensity, obtain it from the average energy density, and apply the inverse-square law to a point source.',
    }),
    b('text', 9, {
      markdown: 'Energy density tells you how much energy sits in each cubic metre. What a solar panel, an eye or a thermometer actually cares about is different: how much energy lands on each square metre each second. That is the **intensity** $ I $, measured in watts per square metre.\n\nGetting from one to the other takes one sentence of geometry. Hold up a square metre facing the wave. In one second, every bit of the wave within $ c $ metres behind that square passes through it — a slab of volume $ c\\times1\\ \\text{m}^{2} $. The energy in that slab is $ u_{avg}\\times c $, and that is what crossed the square in that second.',
    }),
    b('latex_block', 10, {
      latex: 'I = u_{avg}\\,c = \\frac{1}{2}\\varepsilon_0 E_0^{2} c',
      label: 'Intensity of a plane electromagnetic wave',
      note: 'Intensity goes as the SQUARE of the field amplitude. Doubling the field quadruples the power delivered.',
      highlight: true,
    }),
    b('worked_example', 11, {
      label: 'the fields inside sunlight',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Sunlight arriving above the Earth\'s atmosphere has an intensity of about $ 1.36\\times10^{3} $ W/m². Find the amplitudes of its electric and magnetic fields, and the average energy density. Then estimate the total power output of the Sun, given that the Earth orbits at $ 1.5\\times10^{11} $ m. Take $ \\varepsilon_0 = 8.85\\times10^{-12} $ and $ c = 3.0\\times10^{8} $ m/s.',
      solution: '**Average energy density first — it is one division.**\n\n$ u_{avg} = \\frac{I}{c} = \\frac{1.36\\times10^{3}}{3.0\\times10^{8}} = 4.5\\times10^{-6}\\ \\text{J/m}^{3} $\n\nAbout four and a half microjoules in every cubic metre of sunlit space. Sunlight is thin stuff; it only adds up because there is so much of it arriving so fast.\n\n**Electric field amplitude.** Rearrange $ I = \\frac{1}{2}\\varepsilon_0E_0^{2}c $:\n\n$ E_0 = \\sqrt{\\frac{2I}{\\varepsilon_0 c}} = \\sqrt{\\frac{2(1.36\\times10^{3})}{(8.85\\times10^{-12})(3.0\\times10^{8})}} $\n\n$ E_0 = \\sqrt{\\frac{2.72\\times10^{3}}{2.66\\times10^{-3}}} = \\sqrt{1.02\\times10^{6}} \\approx 1.0\\times10^{3}\\ \\text{V/m} $\n\nA thousand volts per metre — a serious field, and it is passing through you right now on any sunny day.\n\n**Magnetic field amplitude.** Straight from the locked ratio:\n\n$ B_0 = \\frac{E_0}{c} = \\frac{1.0\\times10^{3}}{3.0\\times10^{8}} = 3.4\\times10^{-6}\\ \\text{T} $\n\nAbout $ 3.4 $ microtesla — a little under a tenth of the Earth\'s own field. Tiny, and carrying exactly half the energy.\n\n**The Sun\'s total output.** At the Earth\'s orbit, all of the Sun\'s power is spread over a sphere of radius $ r = 1.5\\times10^{11} $ m:\n\n$ P = I\\times 4\\pi r^{2} = (1.36\\times10^{3})\\,4\\pi(1.5\\times10^{11})^{2} $\n\n$ P = (1.36\\times10^{3})(2.83\\times10^{23}) \\approx 3.8\\times10^{26}\\ \\text{W} $\n\n**Stop and look at that number.** Nearly $ 4\\times10^{26} $ watts, worked out from a reading taken on one square metre near one small planet — because the wave spreads over a sphere and a sphere\'s area is something we know exactly. The whole calculation is one measurement plus a bit of geometry.',
    }),
    b('text', 12, {
      markdown: 'That last step used the rule that governs every small source of light, sound or radiation.\n\nA source radiating a power $ P $ equally in all directions spreads that power over a sphere. By the time the wave has reached a distance $ r $, the sphere has area $ 4\\pi r^{2} $, so the power per square metre is\n\n$ I = \\frac{P}{4\\pi r^{2}} $\n\n**Nothing has been absorbed and nothing lost** — the same energy is simply spread thinner. That is why the rule is so reliable: it is geometry, not physics.\n\nOne consequence is worth pulling out, because it catches people. Since $ I\\propto\\frac{1}{r^{2}} $ and $ I\\propto E_0^{2} $, the **field** itself falls off only as $ \\frac{1}{r} $. Intensity and amplitude do not obey the same power law, and mixing them up is a standard exam slip.',
    }),
    b('reasoning_prompt', 13, {
      reasoning_type: 'quantitative',
      prompt: 'A small lamp radiates equally in all directions. You walk from $ 2 $ m away to $ 4 $ m away. What happens to the intensity, and what happens to the peak electric field $ E_0 $?',
      options: [
        'Both are halved, since the distance has simply doubled',
        'Intensity is halved and $ E_0 $ falls to a quarter',
        'Intensity falls to a quarter and $ E_0 $ is halved',
        'Intensity falls to a quarter and $ E_0 $ is unchanged',
      ],
      correct_index: 2,
      reveal: '**Intensity falls to a quarter; the field falls to a half.**\n\nTwo different power laws, and they must be kept apart.\n\n*Intensity.* $ I = \\frac{P}{4\\pi r^{2}} $, so doubling $ r $ divides $ I $ by $ 2^{2} = 4 $. The same power now covers four times the area.\n\n*Field.* $ I = \\frac{1}{2}\\varepsilon_0E_0^{2}c $, so $ E_0\\propto\\sqrt{I} $. If $ I $ drops by a factor of $ 4 $, then $ E_0 $ drops by $ \\sqrt{4} = 2 $.\n\n**In short: intensity goes as $ \\frac{1}{r^{2}} $, amplitude goes as $ \\frac{1}{r} $.**\n\n**Why the confusion is so common.** Students learn "inverse square law for light" as a single slogan and apply it to whatever the question happens to ask for. But the inverse-square statement is about **energy flow**, because energy is what gets spread over a sphere. Amplitude is not energy; it is the square root of something proportional to energy.\n\n**A habit that fixes it permanently.** Whenever a question changes a distance, first ask *"is this quantity linear in energy, or in field?"* Intensity, power and energy density are energy-like and go as $ \\frac{1}{r^{2}} $. Field amplitudes $ E_0 $ and $ B_0 $ go as $ \\frac{1}{r} $.',
      difficulty_level: 3,
    }),
    b('image', 14, {
      src: '',
      alt: 'A small source at the centre of two concentric spheres, showing the same energy spread over a larger area at the greater radius',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Nothing is absorbed. The same power simply covers four times the area at twice the distance.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), thin dim-grey line art. A small glowing amber point source at the left-centre, with a set of straight dim-orange rays fanning outward to the right. Two concentric arcs drawn in thin grey cross those rays, the inner one at radius r and the outer one at radius 2r, each labelled with a small tick. On the inner arc a single small square patch is shaded warm amber; on the outer arc the corresponding patch is shaded the same colour but drawn four times the area and noticeably dimmer, showing the same rays now spread over a larger patch. A faint grid inside each patch makes the one-versus-four area comparison readable at a glance. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 15, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ u = \\frac{1}{2}\\varepsilon_0E^{2} + \\frac{B^{2}}{2\\mu_0} $ — the Chapter 2 half plus the Chapter 6 half.\n- The two halves are **exactly equal**, at every point and every instant, because $ E = cB $ and $ c^{2} = \\frac{1}{\\mu_0\\varepsilon_0} $.\n- So $ u = \\varepsilon_0E^{2} = \\frac{B^{2}}{\\mu_0} $. Use whichever field the question gives you.\n- Averaging over a cycle brings in a half: $ u_{avg} = \\frac{1}{2}\\varepsilon_0E_0^{2} $.\n- $ I = u_{avg}c = \\frac{1}{2}\\varepsilon_0E_0^{2}c $ — watts per square metre.\n- $ I = \\frac{P}{4\\pi r^{2}} $ for a point source. That is **geometry**, not absorption.\n- Intensity goes as $ \\frac{1}{r^{2}} $; field amplitude goes as $ \\frac{1}{r} $. Do not merge the two.',
    }),
    b('text', 16, {
      markdown: 'Next: energy is not the only thing this wave is carrying. It also carries momentum — which means light can push, and in some places in the universe the push is the thing that decides what happens.',
    }),
    b('inline_quiz', 17, {
      pass_threshold: 0.6,
      questions: [
        q('The average energy density of a plane electromagnetic wave in vacuum is',
          ['$ \\frac{1}{2}\\varepsilon_0E_0^{2} $', '$ \\varepsilon_0E_0^{2} $', '$ \\frac{1}{4}\\varepsilon_0E_0^{2} $', '$ 2\\varepsilon_0E_0^{2} $'],
          0,
          'The instantaneous total is $ \\varepsilon_0E^{2} $, and averaging $ \\sin^{2} $ over a cycle brings in a factor of a half. Two halves that cancel one factor and then reinstate it — worth writing out rather than guessing.',
          2),
        q('In an electromagnetic wave, the energy carried by the magnetic field, compared with that carried by the electric field, is',
          ['exactly the same', 'very much smaller', 'very much larger', 'larger only in vacuum'],
          0,
          'The magnetic field is numerically tiny only because it equals $ \\frac{E}{c} $, and the two energy formulas are built so that the difference cancels exactly. Comparing raw field values across different units proves nothing.',
          2),
        q('A point source radiates uniformly. Doubling your distance from it multiplies the intensity by',
          ['$ \\frac{1}{4} $', '$ \\frac{1}{2} $', '$ 2 $', '$ 4 $'],
          0,
          'The same power is spread over a sphere of four times the area, so the power per square metre falls to a quarter. The field amplitude, being proportional to the square root of intensity, only halves.',
          1),
      ],
    }),
  ],
};

// ── p7 · Momentum and Radiation Pressure ─────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'emw-momentum-and-radiation-pressure',
  title: 'Momentum and Radiation Pressure',
  subtitle: 'Light pushes — feebly here, decisively elsewhere',
  glossary: [
    { term: 'radiation pressure', definition: 'The pressure exerted on a surface by an electromagnetic wave falling on it: $ \\frac{I}{c} $ if the wave is completely absorbed, $ \\frac{2I}{c} $ if it is completely reflected.' },
    { term: 'solar sail', definition: 'A large, light, highly reflective sheet used to propel a spacecraft on the radiation pressure of sunlight alone, carrying no fuel.' },
    { term: 'comet tail', definition: 'The stream of dust and ionised gas driven off a comet\'s nucleus near the Sun. It points away from the Sun rather than backwards along the comet\'s path.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Momentum, as you learned it in Class 11, is $ p = mv $. A photon of light has **no mass at all**.\n\nPut zero into that formula and you get zero, whatever the speed. So light should carry no momentum, and a beam of light should be unable to push anything.\n\nAnd yet a comet\'s tail always streams away from the Sun — never backwards along the comet\'s path, the way a plume of smoke trails a moving train. Something is pushing that dust outwards, and it is pushing hard enough to be visible across the Solar System.\n\nIf light has no mass, where is the push coming from?',
      hint: 'Is $ p = mv $ really the definition of momentum, or is it one special case of it?',
      reveal: '$ p = mv $ is not the definition of momentum. It is what momentum happens to equal **for a slow-moving massive object**, which was the only kind of object Class 11 needed.\n\nThe deeper statement is that momentum is whatever quantity is conserved when nothing external pushes — and Maxwell showed, from the equations alone, that an electromagnetic field carries momentum too. For a wave carrying energy $ U $, the momentum it carries is\n\n$ p = \\frac{U}{c} $\n\nNo mass appears anywhere.\n\nThat single formula is the whole page. Everything else — the pressure on an absorbing surface, the factor of two on a mirror, solar sails, and why a comet\'s tail runs the wrong way — is read off from it.\n\nAnd notice what the $ c $ in the denominator is doing. It is dividing by three hundred million, which is exactly why you have never felt sunlight push you over, and exactly why in space, where there is nothing else to push, it wins.',
    }),
    b('text', 1, {
      markdown: 'Here is the result, and it is worth stating plainly because it is short and it does everything:',
    }),
    b('latex_block', 2, {
      latex: 'p = \\frac{U}{c}',
      label: 'Momentum carried by an electromagnetic wave of energy U',
      note: 'No mass in it. This is the momentum of the field itself, not of anything material.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'From momentum to pressure, and where the factor of two lives',
      level: 2,
      objective: 'Derive the radiation pressure on an absorbing and on a reflecting surface, and explain why reflection gives exactly twice, not merely more.',
    }),
    b('step_solver', 4, {
      title: 'Absorbing versus reflecting',
      problem: 'A beam of intensity $ I $ falls squarely on a surface of area $ A $. Find the force it exerts (a) when the surface absorbs the beam completely, and (b) when it reflects the beam straight back the way it came.',
      intro: 'Force is the rate of change of momentum — Newton\'s second law in the form he actually wrote it. So the entire job is to work out how much momentum the surface takes from the beam each second, and the two cases differ in that step alone.',
      steps: [
        st('Energy arriving each second: $ \\frac{dU}{dt} = IA $',
          'Intensity is power per unit area, so multiplying by the area facing the beam gives the power landing on the surface — joules per second.', {
            check: {
              kind: 'mcq',
              prompt: 'A beam of intensity $ 500 $ W/m² falls on a plate of area $ 0.2 $ m². How much energy lands each second?',
              options: ['$ 2500 $ J', '$ 500 $ J', '$ 100 $ J', '$ 0.4 $ J'],
              answer_index: 2,
              feedback_right: 'Yes — intensity times area, so $ 500\\times0.2 = 100 $ J each second, which is $ 100 $ W.',
              feedback_wrong: 'Intensity is watts per square metre, so multiply by the area, do not divide: $ 500\\times0.2 = 100 $ J per second.',
            },
          }),
        st('Momentum arriving each second: $ \\frac{dp}{dt} = \\frac{IA}{c} $',
          'Every joule the beam delivers brings $ \\frac{U}{c} $ of momentum with it, so divide the power by $ c $. This is the only place the new physics enters — the rest is bookkeeping.'),
        st('**Absorbed:** the beam ends with zero momentum, so $ F = \\frac{IA}{c} $ and the pressure is $ \\frac{I}{c} $',
          'Change in the beam\'s momentum is final minus initial: $ 0 - \\frac{IA}{c} $. The surface takes up exactly what the beam lost, and dividing that force by the area $ A $ gives the pressure.'),
        st('**Reflected:** the beam leaves with $ \\frac{IA}{c} $ pointing **backwards**, so $ F = \\frac{2IA}{c} $ and the pressure is $ \\frac{2I}{c} $',
          'Final minus initial is now $ \\left(-\\frac{IA}{c}\\right) - \\left(+\\frac{IA}{c}\\right) = -\\frac{2IA}{c} $. Twice as large — because the momentum did not merely stop, it **turned round**.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the reflecting case exactly twice the absorbing case, rather than just somewhat more?',
              options: ['Because a mirror reflects twice as much energy as black paint absorbs', 'Because the momentum is reversed, so the change is twice its size', 'Because the beam strikes the mirror twice on its way out', 'Because reflection doubles the frequency of the arriving wave'],
              answer_index: 1,
              feedback_right: 'Exactly — stopping a momentum removes one lot of it, while reversing it removes one lot and adds another in the opposite direction.',
              feedback_wrong: 'The same energy arrives in both cases. What differs is the momentum change: stopping is a change of one $ \\frac{IA}{c} $, reversing is a change of two, exactly as a ball bouncing back off a wall pushes twice as hard as one that sticks to it.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A laser of power $ 5.0 $ mW is shone straight at a small mirror, which reflects the whole beam straight back. What force does the beam exert on the mirror? Take $ c = 3.0\\times10^{8} $ m/s.',
        answer: '$ F = \\frac{2P}{c} = \\frac{2(5.0\\times10^{-3})}{3.0\\times10^{8}} = 3.3\\times10^{-11}\\ \\text{N} $.',
        solution: 'The area never appears, because the power $ P $ was given directly rather than as an intensity. Use $ F = \\frac{2P}{c} $:\n\n$ F = \\frac{2(5.0\\times10^{-3})}{3.0\\times10^{8}} = 3.3\\times10^{-11}\\ \\text{N} $\n\n**Get a feel for how small that is.** A grain of sand weighing a milligram is pulled down by about $ 10^{-5} $ N — roughly a million times more. You could shine that laser at a mirror all day and never see it twitch.\n\n**And yet it is real.** Forces of this size have been measured in the laboratory since about 1900, and today they are used routinely: *optical tweezers* hold single living cells and single molecules in place with nothing but focused laser light. A force too small to move a grain of sand is exactly the right size to move a bacterium.',
      },
    }),
    b('latex_block', 5, {
      latex: 'P_{rad} = \\frac{I}{c}\\ \\text{(fully absorbed)} \\qquad P_{rad} = \\frac{2I}{c}\\ \\text{(fully reflected)}',
      label: 'Radiation pressure on a surface facing the beam',
      note: 'The 2 is a reversal of momentum, not a doubling of the energy delivered. Same energy, twice the momentum change.',
      highlight: true,
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'Two identical discs hang in the same beam of sunlight. One is coated in perfectly black paint and absorbs everything that lands on it; the other is a perfect mirror and reflects everything straight back. Which feels the larger force, and by what factor?',
      options: [
        'The black disc, by a factor of two, since it takes the energy in',
        'Both feel exactly the same force, since the beam is the same one',
        'The mirror, by a factor of four, since momentum goes as the square',
        'The mirror, by a factor of two, since the momentum is reversed',
      ],
      correct_index: 3,
      reveal: '**The mirror, by a factor of exactly two.**\n\nThe cleanest way to see it is with a tennis ball and a wall.\n\nThrow a ball of momentum $ p $ at a wall of wet clay: it sticks, its momentum goes from $ p $ to $ 0 $, and the wall receives $ p $.\n\nThrow the same ball at a hard wall: it bounces back, its momentum goes from $ +p $ to $ -p $, and the wall receives $ 2p $. **The bouncing ball pushes twice as hard**, even though it arrived with exactly the same energy and speed.\n\nLight behaves identically. Absorption is the clay wall; reflection is the hard wall.\n\n**Why the black-paint answer feels tempting.** Absorbing "takes the energy in", which sounds like the stronger interaction. But force is about **momentum**, not energy, and the mirror changes the momentum more even though it keeps none of the energy.\n\n**Practical consequence, and it is the reason solar sails exist.** A sail is built to be as shiny as possible, not as black as possible. Making it reflective doubles the thrust for free — and in a machine that must run for years on the feeblest force in engineering, a factor of two is not a detail.\n\n*(A real surface is somewhere between the two, so the pressure lies between $ \\frac{I}{c} $ and $ \\frac{2I}{c} $. Exam questions will always tell you which idealisation to assume — read that word carefully.)*',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Negligible on Earth, decisive in space',
      level: 2,
      objective: 'Estimate the radiation pressure of sunlight, compare it with atmospheric pressure, and explain why the same force matters in space.',
    }),
    b('worked_example', 8, {
      label: 'the push of sunlight, and a sail that uses it',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Sunlight near the Earth has an intensity of about $ 1.36\\times10^{3} $ W/m². (a) Find the radiation pressure on a perfectly absorbing surface and on a perfect mirror, and compare with atmospheric pressure, $ 1.0\\times10^{5} $ Pa. (b) A spacecraft of mass $ 300 $ kg carries a perfectly reflecting sail of area $ 200\\ \\text{m}^{2} $ held square to the Sun. Find the thrust and the speed it would gain in one year, ignoring the fall-off of sunlight with distance. Take one year as $ 3.2\\times10^{7} $ s.',
      solution: '**(a) The two pressures.**\n\nAbsorbing: $ P_{rad} = \\frac{I}{c} = \\frac{1.36\\times10^{3}}{3.0\\times10^{8}} = 4.5\\times10^{-6}\\ \\text{Pa} $\n\nReflecting: $ P_{rad} = \\frac{2I}{c} = 9.1\\times10^{-6}\\ \\text{Pa} $\n\n**Compare with the air around you.**\n\n$ \\frac{1.0\\times10^{5}}{9.1\\times10^{-6}} \\approx 1.1\\times10^{10} $\n\nAtmospheric pressure is about **ten thousand million times** larger. Sunlight is pressing on your desk right now with about nine millionths of a pascal, and every draught, every vibration and every temperature difference in the room swamps it completely. That is why nobody discovered radiation pressure by noticing it.\n\n**(b) The sail.**\n\nThrust: $ F = P_{rad}\\times A = (9.1\\times10^{-6})(200) = 1.8\\times10^{-3}\\ \\text{N} $\n\nLess than two millinewtons — about the weight of a large grain of rice. On Earth this would do nothing whatsoever.\n\nAcceleration: $ a = \\frac{F}{m} = \\frac{1.8\\times10^{-3}}{300} = 6.1\\times10^{-6}\\ \\text{m/s}^{2} $\n\nSpeed gained in a year: $ v = at = (6.1\\times10^{-6})(3.2\\times10^{7}) \\approx 1.9\\times10^{2}\\ \\text{m/s} $\n\n**Nearly $ 200 $ m/s, from a force the weight of a grain of rice.** That is the whole idea of a solar sail, and it turns on one word: **continuous**. A rocket burns for minutes and then coasts for years, because it must carry every gram of its fuel. A sail pushes every second of every day, for as long as the Sun shines, and carries no fuel at all.\n\n**Being honest about the estimate.** As the craft moves outward the sunlight thins as $ \\frac{1}{r^{2}} $, so the real gain is smaller than this. But the sail can also be tilted to steer, and unlike fuel the Sun never runs out — so on a long mission the sail wins.',
    }),
    b('image', 9, {
      src: '',
      alt: 'A square solar sail spread behind a small spacecraft, with sunlight arriving from one side and a thrust arrow pointing away from the Sun',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'A force the weight of a grain of rice, applied without pause for years.',
      generation_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. On the left edge a partial bright amber disc suggesting the Sun, with a set of straight parallel dim-orange rays travelling right across the frame. In the centre-right a large flat square sail drawn in perspective as a thin quadrilateral with a faint reflective amber sheen and thin grey diagonal support booms, tilted slightly. A small boxy spacecraft body sits at the sail centre on a short mast. Where the rays meet the sail, a few of them are drawn bouncing back to the left at a mirrored angle, and a single bold bright-amber arrow points away from the Sun, labelled as thrust and drawn deliberately short and thin to signal a very small force. A scattering of tiny faint stars fills the dark space. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Solar sails are not a thought experiment. They have flown.\n\nIn **May 2010** the Japanese space agency JAXA launched **IKAROS**, the first spacecraft to cross interplanetary space driven by sunlight. Its sail was a square sheet about $ 14 $ metres on a side and a few micrometres thick — thinner than a bin liner, spread out by spinning the whole craft so that centrifugal force held the membrane flat. There were no booms and no motors to unfold it.\n\nThe thrust was under two millinewtons. Over the months of its cruise towards Venus, that was enough to change its speed measurably and to steer it — and the mission proved the principle end to end: the sail accelerated the craft, and tilting it changed the direction of the push.\n\n**Why anyone bothers.** Every other kind of engine must carry its own reaction mass, and a rocket that wants to go faster must carry more fuel, which makes it heavier, which means it needs more fuel. That vicious circle is the central problem of spaceflight. A sail steps outside it completely: the momentum it uses arrives free, from a source $ 150 $ million kilometres away, and never runs out.\n\nThe cost is patience. A sail accelerates about as hard as a snail, and it does it for years. For a mission with time to spare — a long survey, a probe to the outer system — that is a trade worth making.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. A spinning square solar sail seen at an oblique angle, drawn as a very thin membrane with a faint amber reflective sheen and a subtle diamond-quilted texture, with four small tip masses at its corners and a curved grey arrow around the centre indicating the spin that holds it flat. A small hexagonal spacecraft bus sits at the centre. Dim-orange parallel rays arrive from the upper left and a few are shown bouncing off the membrane. Faint tiny stars in the background and a small distant dim disc of a planet at the lower right. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'spatial',
      prompt: 'A comet swings around the Sun and then heads back out towards deep space. On that **outward** leg, which way does its tail point?',
      options: [
        'Behind it, trailing the comet as smoke trails a moving train',
        'Ahead of it, still pointing directly away from the Sun',
        'Towards the Sun, dragged back by the Sun\'s huge gravity',
        'Downwards, towards the plane in which the planets orbit',
      ],
      correct_index: 1,
      reveal: '**Ahead of it — the tail leads the comet on the way out.**\n\nThis is one of the most quietly startling facts in astronomy, and it is a direct consequence of $ p = \\frac{U}{c} $.\n\nA comet is a lump of ice and dust a few kilometres across. Near the Sun it warms, and jets of gas carry fine dust off the surface. Those dust grains are tiny, so the sunlight falling on them exerts a radiation pressure that is small in absolute terms but **large compared with their weight** — the push scales with the grain\'s cross-sectional area while gravity scales with its volume, so the smaller the grain, the more the light wins.\n\nThe result is that the dust is driven **directly away from the Sun**, regardless of which way the comet itself happens to be moving. On the way in, the tail streams behind. On the way out, the comet is running away from the Sun and the tail is still pushed outward — so it runs **in front**.\n\n**The tail is not exhaust.** It is not the comet\'s wake, and it has nothing to do with the comet\'s velocity. It is a stream of dust being blown away from the Sun by sunlight, and the comet just happens to be the thing supplying it.\n\n*(Careful observers see two tails. The curved, whitish dust tail is the radiation-pressure one described here. The straighter, bluish ion tail is blown by the solar wind — a stream of charged particles, not light. Both point away from the Sun, for different reasons.)*',
      difficulty_level: 3,
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- An electromagnetic wave carrying energy $ U $ carries momentum $ p = \\frac{U}{c} $. **No mass required.**\n- Force is the rate of change of momentum, so a beam of intensity $ I $ on area $ A $ delivers $ \\frac{IA}{c} $ of momentum each second.\n- Absorbed: pressure $ \\frac{I}{c} $. Reflected: pressure $ \\frac{2I}{c} $.\n- **The 2 is a reversal, not a doubling of energy** — the tennis ball that bounces pushes twice as hard as the one that sticks.\n- Sunlight presses at about $ 4.5\\ \\mu\\text{Pa} $ absorbed, $ 9.1\\ \\mu\\text{Pa} $ reflected — around $ 10^{10} $ times less than the air.\n- The $ c $ in the denominator is why it is negligible here; the absence of anything else to push is why it wins in space.\n- Solar sails are built shiny, for the factor of two. A comet\'s tail points away from the **Sun**, not backwards along its path.',
    }),
    b('text', 13, {
      markdown: 'Next: these waves carry energy and momentum across empty space — but where do they come from in the first place, and how does a piece of metal a metre long catch one?',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A beam of light carrying energy $ U $ carries momentum',
          ['$ \\frac{U}{c} $', '$ Uc $', '$ \\frac{U}{c^{2}} $', '$ \\frac{2U}{c} $'],
          0,
          'Momentum is energy divided by the wave speed, with no mass in the expression at all. The version with a factor of two applies to the momentum *change* at a mirror, not to the beam itself.',
          1),
        q('The radiation pressure on a perfectly reflecting surface facing a beam of intensity $ I $ is',
          ['$ \\frac{2I}{c} $', '$ \\frac{I}{c} $', '$ \\frac{I}{2c} $', '$ \\frac{I}{c^{2}} $'],
          0,
          'Reflection reverses the momentum instead of merely stopping it, so the change is twice as large as for an absorbing surface. Same energy arriving, twice the momentum change.',
          2),
        q('Radiation pressure goes unnoticed in everyday life mainly because',
          ['the momentum is the energy divided by $ c $', 'light has no mass at all', 'light carries no momentum', 'the atmosphere absorbs the beam long before it lands'],
          0,
          'Dividing by three hundred million makes the pressure a few millionths of a pascal, which is buried under air pressure and every stray draught. The effect is real and measurable, just very small.',
          2),
      ],
    }),
  ],
};

// ── p8 · Making and Catching EM Waves ────────────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'emw-making-and-catching-em-waves',
  title: 'Making and Catching EM Waves',
  subtitle: 'An LC circuit, pulled open until the field escapes',
  glossary: [
    { term: 'accelerating charge', definition: 'A charge whose velocity is changing in size or direction. Only an accelerating charge radiates electromagnetic waves; a charge at rest or in uniform motion does not.' },
    { term: 'dipole antenna', definition: 'Two straight conducting rods driven in opposite phase at their inner ends, so that charge sloshes from one to the other. Its total length is usually about half a wavelength.' },
    { term: 'resonant length', definition: 'The length at which an antenna\'s natural standing wave of current matches the frequency being sent or received — about $ \\frac{\\lambda}{2} $ for a simple dipole.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A charged plastic comb lies on a table. It has an electric field around it, and that field stretches out to infinity — so in a sense it already reaches the whole universe.\n\nDoes it radiate? Is it sending electromagnetic waves out across the room?\n\nNow pick the comb up and carry it across the room at a steady walking pace. Does it radiate **now**? After all, the field at any fixed point in the room is certainly changing as the comb goes past.',
      hint: 'Imagine walking beside the comb at exactly the same speed. What does the situation look like to you?',
      reveal: '**Neither case radiates.**\n\nThe comb at rest is easy: a static field, going nowhere, doing nothing.\n\nThe moving comb is the interesting one, and the way to settle it is to walk alongside it at the same speed. From where you now stand, the comb is **sitting still on your hand** — and a comb sitting still does not radiate. But whether energy is streaming away across the room cannot depend on whether an observer chose to walk or stand. So it does not radiate for the person standing still either.\n\n(The field at a fixed point in the room really is changing as the comb passes. But that field change travels *with* the comb; nothing detaches and leaves. A changing field is not the same thing as a radiated wave.)\n\nSo what does it take? **Acceleration.** Shake the comb back and forth and it radiates — genuinely, if very feebly. There is no inertial frame in which a shaking charge is at rest, so the "walk alongside it" escape is closed, and the field really does have to tear loose.\n\nThat one word is the whole of how every transmitter on Earth works.',
    }),
    b('text', 1, {
      markdown: 'Line the three cases up, because the contrast is the lesson.\n\n**A charge at rest** has a static Coulomb field. Nothing changes, nothing is radiated.\n\n**A charge in uniform motion** has a field that is changing at any fixed point, but there is always another observer — one moving alongside — for whom the charge is at rest. Radiation cannot appear or disappear depending on who is looking, so there is none.\n\n**An accelerating charge** has no such escape. No steady motion of an observer can make an accelerating charge stand still. Its field cannot keep up with it, a kink forms and travels outwards at $ c $, and energy leaves for good. The power radiated grows as the **square** of the acceleration, so shaking a charge harder pays off quickly.',
    }),
    b('latex_block', 2, {
      latex: '\\text{ONLY AN ACCELERATING CHARGE RADIATES.}',
      label: 'The source of every electromagnetic wave',
      note: 'At rest — no. Uniform velocity — no. Changing velocity — yes. There is no fourth case.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'From an LC circuit to an antenna',
      level: 2,
      objective: 'Explain how an LC oscillator is opened out into a dipole antenna, and state what fixes the frequency of the wave it sends out.',
    }),
    b('text', 4, {
      markdown: 'Chapter 7 opened with a circuit that does exactly what is wanted here. In an **LC oscillator**, charge sloshes back and forth between the plates of the capacitor through the coil, over and over, at a natural frequency\n\n$ \\nu = \\frac{1}{2\\pi\\sqrt{LC}} $\n\nCharge sloshing back and forth is charge **accelerating** — it stops, turns round and speeds up again twice every cycle. So an LC circuit should radiate.\n\nIt hardly does, and the reason is geometry rather than physics. In a compact LC circuit the electric field is bottled up in the narrow gap between the capacitor plates and the magnetic field is bottled up inside the coil. Both are held close, tidy, and going nowhere.\n\n**So open the circuit out.** Pull the two capacitor plates apart, straighten them into two rods pointing in opposite directions, and drive them from the middle. Now the field has nothing confining it: the charge piles up at one rod tip, then the other, and the field it drags about is spread through the open air. What was a bottled oscillation becomes a **dipole antenna**, and the energy leaves.\n\n**The frequency does not change when you do this.** Whatever rate the circuit oscillates at is the rate the charges accelerate at, and that is the frequency of the wave that goes out: $ \\nu_{\\text{wave}} = \\nu_{\\text{oscillator}} $. Change $ L $ or $ C $ and you change the station.',
    }),
    b('image', 5, {
      src: '',
      alt: 'A sequence showing a compact LC circuit being opened out step by step into a straight dipole antenna radiating into open space',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Same oscillation, same frequency. Only the geometry changes — and now the field has somewhere to go.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), three panels in a row separated by thin vertical grey rules, thin dim-grey line art with conductors drawn in warm amber. Panel one: a compact LC circuit, a parallel-plate capacitor with a narrow gap wired to a coil of a few turns, with dim-orange electric field lines drawn tightly confined in the capacitor gap and dim-orange magnetic loops confined inside the coil. Panel two: the same circuit part-way opened, the capacitor plates swung apart into a shallow V and the coil reduced to a single loop, with the field lines noticeably bulging outward into the surrounding space. Panel three: a straight vertical dipole, two collinear amber rods separated by a small gap at the centre with a tiny circular source symbol driving them, surrounded by wide dim-orange closed field loops that detach and expand outward, and thin amber arcs radiating away to the frame edges. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'The mains supply in your home alternates at $ 50 $ Hz, so the charges in every wire in the house really are accelerating back and forth, all day. Why does almost none of that energy leave the house as electromagnetic waves?',
      options: [
        'Because the wires are insulated, and plastic blocks the waves',
        'Because $ 50 $ Hz is too low a frequency to be radiated at all',
        'Because the wavelength is $ 6000 $ km, so a wire is a hopeless aerial',
        'Because alternating current cannot radiate, only direct current can',
      ],
      correct_index: 2,
      reveal: '**Because the wavelength is enormous compared with the wire.**\n\nWork it out:\n\n$ \\lambda = \\frac{c}{\\nu} = \\frac{3.0\\times10^{8}}{50} = 6.0\\times10^{6}\\ \\text{m} = 6000\\ \\text{km} $\n\nA wavelength roughly the length of India from Kashmir to Kanyakumari. An efficient dipole for it would have to be about $ 3000 $ km long. Your two-metre length of flex is a fraction of a millionth of that — it is not a bad aerial, it is barely an aerial at all.\n\n**The physics behind the rule of thumb.** Radiated power climbs steeply with frequency: at a fixed current, a very short antenna radiates a power proportional to $ \\left(\\frac{l}{\\lambda}\\right)^{2} $. Make $ \\frac{l}{\\lambda} $ a millionth and the radiated power falls by a factor of $ 10^{12} $. The energy is not blocked; it simply is never launched.\n\n**Why the "too low to radiate" answer is wrong in principle.** There is no frequency floor. A $ 50 $ Hz antenna would work perfectly well — if you could build a $ 3000 $ km one. Submarines communicate at frequencies of a few tens of hertz using antennas kilometres long, and even then the efficiency is dreadful.\n\n**And the useful conclusion.** To radiate well you want a **high** frequency, because a high frequency means a short wavelength, and a short wavelength means an antenna you can actually build. That is why every transmitter in your life runs at megahertz or gigahertz, and never at fifty.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Why the length is tied to the wavelength',
      level: 2,
      objective: 'Explain why a dipole antenna is made about half a wavelength long, and compute the length required for a given frequency.',
    }),
    b('text', 8, {
      markdown: 'The last answer said a good antenna must be comparable in size to the wavelength. It is worth seeing where the specific figure of **half a wavelength** comes from, because it is the same standing-wave idea you met for a stretched string.\n\nCurrent has to be **zero at each free end** of the rods — there is nowhere for charge to keep going, so no current can cross the tip. Those two ends are therefore forced to be nodes of the current pattern. The largest, simplest oscillation that has a node at each end and one antinode in between — right at the middle, which is exactly where the antenna is driven — is half a wavelength across.\n\nSo the natural, resonant length of a simple dipole is:',
    }),
    b('latex_block', 9, {
      latex: 'l \\approx \\frac{\\lambda}{2} = \\frac{c}{2\\nu}',
      label: 'Resonant length of a dipole antenna',
      note: 'A quarter-wave rod above a conducting ground plane behaves like half of this, which is why so many real aerials are λ/4.',
      highlight: true,
    }),
    b('worked_example', 10, {
      label: 'how long must the aerial be?',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find the wavelength, and the length of a half-wave dipole, for (a) an FM radio station broadcasting at $ 100 $ MHz, (b) a mobile phone working at $ 1800 $ MHz, and (c) the $ 50 $ Hz mains. Take $ c = 3.0\\times10^{8} $ m/s.',
      solution: '**(a) FM radio, $ \\nu = 1.0\\times10^{8} $ Hz.**\n\n$ \\lambda = \\frac{c}{\\nu} = \\frac{3.0\\times10^{8}}{1.0\\times10^{8}} = 3.0\\ \\text{m} $, so $ l = \\frac{\\lambda}{2} = 1.5\\ \\text{m} $\n\nAbout the height of a person — and about the length of the whip aerial on an older car, which is not a coincidence. Many are cut to a quarter wave, $ 0.75 $ m, and use the car body as the missing half.\n\n**(b) Mobile phone, $ \\nu = 1.8\\times10^{9} $ Hz.**\n\n$ \\lambda = \\frac{3.0\\times10^{8}}{1.8\\times10^{9}} = 0.167\\ \\text{m} = 16.7\\ \\text{cm} $, so $ l = 8.3\\ \\text{cm} $\n\nA quarter-wave version is about $ 4.2 $ cm — small enough to fold inside the case, which is precisely why phone aerials disappeared from view once the frequencies went up. The aerial did not get better; the wavelength got shorter.\n\n**(c) Mains, $ \\nu = 50 $ Hz.**\n\n$ \\lambda = \\frac{3.0\\times10^{8}}{50} = 6.0\\times10^{6}\\ \\text{m} $, so $ l = 3.0\\times10^{6}\\ \\text{m} = 3000\\ \\text{km} $\n\nUnbuildable, and that is the answer to the previous question in one line.\n\n**Notice the pattern the three cases make.** Antenna size is set by wavelength, and wavelength falls as frequency rises. Every push towards higher frequency in communications — from long-wave radio to FM to mobile to Wi-Fi to satellite — has also been a push towards smaller equipment. The engineering and the physics pull the same way.',
    }),
    b('heading', 11, {
      text: 'Catching one: the same story run backwards',
      level: 2,
      objective: 'Describe how a receiving antenna converts an arriving wave into a signal, and why its orientation matters.',
    }),
    b('text', 12, {
      markdown: 'Reception is transmission in reverse, step for step.\n\nA wave sweeps past a metal rod. Its electric field pushes on every free electron in that rod, and since the field is reversing millions of times a second, the electrons are driven **back and forth along the rod** at exactly the wave\'s frequency. Charge accumulating alternately at the two ends is a voltage — a tiny alternating emf, typically microvolts, but at precisely the right frequency.\n\nThat feeble signal then goes into a **tuned LC circuit**, and here Chapter 7 does the rest of the work. Hundreds of stations are shaking that rod at once, all of them producing their own small emf. The receiver sets $ L $ and $ C $ so that $ \\frac{1}{2\\pi\\sqrt{LC}} $ matches the wanted station; at **resonance** that one frequency produces a large response and all the others produce almost nothing. Turning a tuning knob is turning a variable capacitor.\n\n**One more consequence, and it is a visible one.** The field drives charges *along* the rod, so only the component of $ \\vec{E} $ lying along the rod does any work. Point the rod across the field and nothing is driven. This is why a rooftop television aerial has all its elements in one definite orientation, and why turning a portable radio can make a weak station appear or vanish. You are not changing the distance; you are lining the rod up with the arriving electric field.',
    }),
    b('reasoning_prompt', 13, {
      reasoning_type: 'spatial',
      prompt: 'A straight rod aerial is receiving a station whose electric field oscillates **vertically**. Without moving from the spot, you rotate the rod until it lies horizontal, square across the arriving field. What happens to the signal?',
      options: [
        'It dies away to nothing, as the field no longer drives charge along the rod',
        'It doubles, because the rod now cuts across the magnetic field instead',
        'It is unchanged, since orientation cannot matter — only distance does',
        'It halves, because only half of the arriving wave now meets the rod',
      ],
      correct_index: 0,
      reveal: '**It dies away to almost nothing.**\n\nThe emf comes from the electric field pushing free electrons **along** the length of the rod. Only the component of $ \\vec{E} $ parallel to the rod can do that. Turn the rod through $ 90^\\circ $ and that component goes to zero, so the driving force along the rod goes to zero, so the signal goes to zero.\n\n(In symbols: the emf follows $ E l\\cos\\theta $, where $ \\theta $ is the angle between the field and the rod. At $ \\theta = 90^\\circ $, $ \\cos\\theta = 0 $.)\n\n**Nothing about the wave changed.** Same station, same transmitter, same distance, same power arriving at your position. Only your ability to collect it changed — and that is a genuinely useful distinction, because it means a dead signal is not always a weak signal.\n\n**Where you have already seen this.** Rooftop TV aerials in one locality all point the same way and all have their elements in the same plane, because they are all lined up with one transmitter\'s polarisation. Rotating a portable radio to find a station is the same effect under your own hand.\n\n**And the honest caveat:** in a town, walls and buildings scatter the wave and scramble its polarisation, so a rotated aerial usually goes quiet rather than perfectly silent. Out in the open, with a clear line to the transmitter, the null is very sharp indeed.',
      difficulty_level: 2,
    }),
    b('callout', 14, {
      variant: 'india_science',
      title: 'Made and caught in Kolkata, 1895',
      markdown: 'Heinrich Hertz produced and detected electromagnetic waves in his Karlsruhe laboratory in 1887, closing the loop Maxwell had opened on paper twenty years earlier. What is less often taught is what happened next, and where.\n\nIn **1895**, at the Presidency College in Kolkata, **Jagadish Chandra Bose** demonstrated waves of about **five millimetres** — a wavelength a hundred times shorter than Hertz had used, which puts it squarely in what we now call the millimetre band. In a public demonstration he used them to ring a bell and set off a small charge of gunpowder in another room, sending the waves through the intervening walls and through the body of the presiding official.\n\nTo work at that wavelength he had to invent most of the apparatus himself: horn-shaped collectors to direct the beam, a fine metal-particle detector, and polarising grids. Some of those designs are recognisably the ancestors of components in a modern radar set, and the waveband he chose is the one used today for short-range high-capacity links.\n\nBose never patented any of it. He held, and said publicly, that scientific knowledge should not be owned. The work stands on its own — and it is a reminder that the millimetre-wave engineering now in every new phone standard was first demonstrated in a college hall in Kolkata.',
    }),
    b('callout', 15, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Only an accelerating charge radiates.** At rest, no. Uniform velocity, no — an observer moving alongside sees it at rest.\n- An **LC oscillator** shakes charge at $ \\nu = \\frac{1}{2\\pi\\sqrt{LC}} $, but its fields are bottled up inside the components.\n- Open it out into a **dipole antenna** and the field escapes. The frequency radiated is the oscillator\'s own frequency.\n- Current must be **zero at each free end**, so the natural length is $ l\\approx\\frac{\\lambda}{2} = \\frac{c}{2\\nu} $ (or $ \\frac{\\lambda}{4} $ over a ground plane).\n- Higher frequency → shorter $ \\lambda $ → smaller antenna. That is why transmitters run at MHz and GHz, never at $ 50 $ Hz.\n- **Reception is the reverse:** the arriving $ \\vec{E} $ drives charge along the rod, giving a small emf at the same frequency; a **tuned LC circuit** at resonance picks out one station.\n- Only the component of $ \\vec{E} $ **along** the rod counts, so aerial orientation matters.',
    }),
    b('text', 16, {
      markdown: 'Next: change nothing about the physics on this page and simply turn the frequency up, and up, and up. The waves stop being radio, become heat, then light, then something that goes through your hand. It is all one family, and the last page lays it out end to end.',
    }),
    b('inline_quiz', 17, {
      pass_threshold: 0.6,
      questions: [
        q('An electromagnetic wave is radiated by',
          ['a charge that is accelerating', 'a charge sitting at rest', 'a charge moving at a constant speed', 'any charge, whether moving or not'],
          0,
          'A charge in steady motion is at rest for an observer travelling alongside it, and radiation cannot depend on who is watching. Only a change of velocity leaves the field unable to keep up.',
          1),
        q('A dipole antenna radiating at frequency $ \\nu $ is usually made about',
          ['$ \\frac{c}{2\\nu} $ long', '$ \\frac{c}{\\nu^{2}} $ long', '$ 2c\\nu $ long', '$ \\frac{\\nu}{c} $ long'],
          0,
          'Current must vanish at each free end, so the rod holds half a wavelength, and $ \\lambda = \\frac{c}{\\nu} $. Halving that gives the resonant length.',
          2),
        q('A receiving aerial produces a signal because the arriving wave',
          ['drives the charges in it back and forth', 'heats the metal until it glows', 'changes the resistance of the metal', 'pushes the aerial bodily sideways'],
          0,
          'The oscillating electric field pushes free electrons along the rod at the wave\'s own frequency, producing a small alternating emf that a tuned circuit then selects. The radiation pressure on the metal is far too feeble to matter.',
          2),
      ],
    }),
  ],
};

// ── p9 · The Electromagnetic Spectrum ────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'emw-the-electromagnetic-spectrum',
  title: 'The Electromagnetic Spectrum',
  subtitle: 'One family, eighteen powers of ten',
  glossary: [
    { term: 'electromagnetic spectrum', definition: 'The whole range of electromagnetic waves arranged by wavelength or frequency, from radio waves at one end to gamma rays at the other. The bands differ only in $ \\lambda $ and $ \\nu $.' },
    { term: 'ozone layer', definition: 'A region of the stratosphere, roughly 15 to 35 km up, in which ozone is concentrated. It absorbs most of the Sun\'s harmful ultraviolet before it reaches the ground.' },
    { term: 'greenhouse effect', definition: 'The warming produced when an atmosphere lets visible sunlight in but absorbs the infrared the warmed ground radiates back out.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Everything you can see — every colour of every object you have ever looked at, the entire visible world — lies between about $ 400 $ and $ 700 $ nanometres. That is a range of **less than a factor of two** in wavelength.\n\nThe full electromagnetic family runs from waves kilometres long to waves smaller than an atomic nucleus: more than **eighteen powers of ten**.\n\nSo the part of it your eyes respond to is a sliver so thin it barely registers on the scale.\n\nWhat, physically, is different about the rest of it? Is a gamma ray a different *kind* of thing from a radio wave, or the same thing wearing a different hat?',
      hint: 'Look back at what page 5 actually needed in order to describe a wave. How many numbers were there, and which of them is free?',
      reveal: '**The same thing. There is no physical difference of kind anywhere along the spectrum.**\n\nEvery band on this page obeys the identical set of equations — Maxwell\'s four. Every one is a transverse wave of $ \\vec{E} $ and $ \\vec{B} $ at right angles, in phase, with $ \\frac{E}{B} = c $, carrying energy $ \\varepsilon_0E^{2} $ per cubic metre and momentum $ \\frac{U}{c} $. Every one travels through vacuum at exactly $ 3.00\\times10^{8} $ m/s.\n\nThe **only** thing that changes across eighteen powers of ten is the wavelength — and, tied to it by $ c = \\nu\\lambda $, the frequency.\n\nThat is a much bigger claim than it first sounds. It says a radio broadcast, the warmth from a fire, the colour of a mango, a hospital X-ray and the radiation from a decaying nucleus are **one phenomenon**, described by one set of equations written down in the 1860s.\n\nWhat differs is not the physics but the **consequences**: how such a wave is produced, what sort of matter absorbs it, and what it does to you when it lands. Those differences are what the rest of this page is about — and they are large enough that a radio wave passes through you unnoticed while a gamma ray of the same energy can break a molecule.',
    }),
    b('text', 1, {
      markdown: 'One equation links the two labels used for a band, and it is the only piece of arithmetic on this page:\n\nA long wave means a low frequency, and a short wave means a high one. They are two ways of saying the same thing, and different trades prefer different ones — radio engineers quote frequencies, spectroscopists quote wavelengths, and X-ray people often quote neither and use energy instead.',
    }),
    b('latex_block', 2, {
      latex: 'c = \\nu\\lambda = 3.00\\times10^{8}\\ \\text{m/s}',
      label: 'The same for every band, in vacuum',
      note: 'Speed is fixed, so frequency and wavelength can only trade against each other.',
      highlight: true,
    }),
    b('heading', 3, {
      text: 'The seven bands, end to end',
      level: 2,
      objective: 'Name the bands in order of wavelength, quote their approximate ranges, and state how each is produced and used.',
    }),
    b('table', 4, {
      caption: 'The boundaries are conventions, not walls — neighbouring bands shade into one another. Learn the order and the rough powers of ten, not the third significant figure.',
      headers: ['Band', 'Wavelength', 'Frequency', 'How it is made', 'What we use it for'],
      rows: [
        ['**Radio**', 'above $ 0.1 $ m', 'below $ 3\\times10^{9} $ Hz', 'charge oscillating in an aerial', 'AM and FM broadcast, TV, mobile phones'],
        ['**Microwave**', '$ 0.1 $ m to $ 1 $ mm', '$ 3\\times10^{9} $ to $ 3\\times10^{11} $ Hz', 'klystron, magnetron, Gunn diode', 'radar, satellite links, Wi-Fi, ovens'],
        ['**Infrared**', '$ 1 $ mm to $ 700 $ nm', '$ 3\\times10^{11} $ to $ 4.3\\times10^{14} $ Hz', 'hot bodies; molecules vibrating', 'thermal imaging, remote controls, physiotherapy'],
        ['**Visible**', '$ 700 $ nm to $ 400 $ nm', '$ 4.3\\times10^{14} $ to $ 7.5\\times10^{14} $ Hz', 'outer electrons changing energy level', 'sight, photography, optical fibre'],
        ['**Ultraviolet**', '$ 400 $ nm to $ 1 $ nm', '$ 7.5\\times10^{14} $ to $ 3\\times10^{17} $ Hz', 'the Sun, arcs, mercury vapour lamps', 'sterilising water, LASIK, spotting forged notes'],
        ['**X-ray**', '$ 1 $ nm to $ 1 $ pm', '$ 3\\times10^{17} $ to $ 3\\times10^{20} $ Hz', 'fast electrons stopped by a metal target', 'bone imaging, crystallography, radiotherapy'],
        ['**Gamma**', 'below $ 1 $ pm', 'above $ 3\\times10^{20} $ Hz', 'transitions inside the atomic nucleus', 'cancer treatment, sterilising instruments'],
      ],
    }),
    b('image', 5, {
      src: '',
      alt: 'A horizontal band showing the electromagnetic spectrum from radio at one end to gamma rays at the other, with the visible region marked as a narrow slice',
      width: 'full',
      aspect_ratio: '21:9',
      caption: 'Everything you have ever seen lives in the narrow slice in the middle.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), very wide horizontal composition, thin dim-grey line art. A single long horizontal bar spans the full width, divided into seven unequal segments labelled radio, microwave, infrared, visible, ultraviolet, X-ray and gamma from left to right, each segment tinted a different muted amber-to-orange shade with the leftmost darkest and the rightmost brightest. The visible segment is drawn deliberately narrow and is the only one carrying a full spectral gradient from deep red through green to violet, with a thin bright callout line pulling it downward into a small magnified inset labelled with 700 nm at one end and 400 nm at the other. Above the bar a logarithmic wavelength scale runs from ten to the four metres down to ten to the minus fourteen metres with small tick marks; below the bar a matching frequency scale runs the other way. Tiny outline icons sit under three segments only, an aerial mast, a small flame and a hand bone, kept minimal. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'A radio wave of wavelength $ 300 $ m and a gamma ray of wavelength $ 1 $ pm set out together across empty space. Which one arrives first at a detector a light-year away?',
      options: [
        'The gamma ray, because its frequency is enormously higher',
        'The radio wave, because long waves travel more easily',
        'The gamma ray, because shorter waves are obstructed less',
        'Neither — in vacuum every band travels at the same $ c $',
      ],
      correct_index: 3,
      reveal: '**Neither. They arrive together.**\n\nIn vacuum, the speed of an electromagnetic wave is $ c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} $, and there is no $ \\lambda $ and no $ \\nu $ anywhere in that expression. The speed is built out of two constants of empty space, and empty space does not know what wavelength is passing through it.\n\n**Where the wrong instinct comes from.** Higher frequency *feels* faster, because in everyday language "fast" describes both speed and rate. But a high frequency means the field reverses more often per second, not that it moves along more quickly. A pendulum swinging quickly is not travelling anywhere faster than a slow one.\n\n**And this is checked, not just assumed.** When a distant star explodes, the gamma rays, visible light and radio waves from the event arrive within a tiny fraction of a second of one another after travelling for millions of years. If different bands moved at even slightly different speeds, that agreement would be impossible.\n\n**One honest qualification, because it matters later.** All this is for **vacuum**. Inside glass or water, different wavelengths *do* travel at slightly different speeds — that is dispersion, and it is exactly why a prism splits white light into a rainbow. In empty space there is no such effect at all.',
      difficulty_level: 2,
    }),
    b('text', 7, {
      markdown: 'Read the table from top to bottom and one thing is steadily changing: the **frequency**, and with it the amount of energy a wave delivers in a single indivisible lump.\n\nThat lump is called a photon, and its energy grows in proportion to $ \\nu $. This chapter has treated light purely as a wave, and every result on pages 5 to 8 stands. But it is worth knowing now why the two ends of the table behave so differently towards you.\n\n**At the radio end**, each lump is so feeble that it does nothing to a molecule at all. Radio waves pass through your body without leaving a trace, which is precisely why a phone signal reaches you indoors.\n\n**At the gamma end**, a single lump carries more than enough energy to knock an electron clean out of an atom and break the molecule it belonged to. That is what "ionising radiation" means, and it is why X-ray and gamma exposure is limited and measured, while nobody has ever worried about standing near a radio.\n\nThe crossover sits in the ultraviolet — which is the reason the next section is about UV, and why the thin layer of gas that stops it matters as much as it does.',
    }),
    b('heading', 8, {
      text: 'The two bands the atmosphere decides for us',
      level: 2,
      objective: 'Explain how the ozone layer shields the surface from ultraviolet, and how the greenhouse effect follows from an atmosphere that treats visible light and infrared differently.',
    }),
    b('text', 9, {
      markdown: 'The atmosphere is not a uniform window. It is almost perfectly clear at some wavelengths and almost perfectly opaque at others, and life on land depends on exactly where those windows sit.\n\n**Ultraviolet, and the ozone layer.** The Sun pours out ultraviolet along with its visible light. UV photons carry enough energy to break chemical bonds, including bonds in DNA — which is why UV causes sunburn, skin cancers and cataracts, and why it is used deliberately to sterilise drinking water and surgical instruments. It is very good at killing cells, and that is not a property you want raining on a biosphere.\n\nBetween roughly $ 15 $ and $ 35 $ km up sits a thin concentration of **ozone**, $ \\text{O}_3 $. An ozone molecule absorbs a UV photon, splits apart, and then reforms — a cycle that can run over and over, so a small amount of ozone can absorb a great deal of ultraviolet. It removes essentially all of the most damaging part before it reaches the ground.\n\nIf all the ozone in the column above your head were brought down to sea-level pressure, it would form a layer about **three millimetres thick**. Three millimetres of gas is what stands between the surface of the Earth and a sterilising dose of ultraviolet.',
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'In **1985** three scientists of the British Antarctic Survey — Joe Farman, Brian Gardiner and Jonathan Shanklin — published measurements showing that the ozone above Halley Bay had been falling every spring for years, and was by then down by about a third. They had been taking the readings on the same instrument since the 1950s. The satellite data had been recording the same thing, but the processing software had been discarding the lowest values as instrument errors: nobody had expected a hole, so nobody had allowed for one.\n\nThe cause turned out to be **chlorofluorocarbons** — CFCs — used as refrigerants and aerosol propellants. They are chemically inert at ground level, which is exactly why they were chosen, and it is also why they survive the long climb to the stratosphere. There ultraviolet finally breaks them apart, releasing chlorine, and a single chlorine atom can go on to destroy many thousands of ozone molecules before it is removed.\n\nWhat happened next is the part worth remembering. In **1987**, two years after the paper, the **Montreal Protocol** was agreed, phasing CFCs out worldwide. Every country on Earth eventually joined it. Ozone levels stopped falling, and measurements now show the layer slowly recovering; on current projections it should return to its 1980 state around the middle of this century.\n\nIt is the clearest case yet of a global environmental problem being identified by careful measurement and then actually **fixed**. Three people with a spectrophotometer in Antarctica, and a treaty — because the physics was not in doubt.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art. On the left, a curved slice of the Earth\'s limb drawn as a thin arc with a faint amber glow along the horizon, and above it a distinct thin band tinted a soft cool blue labelled as the ozone layer at roughly 15 to 35 km. Bright violet-white arrows arrive from the upper right representing ultraviolet; most of them terminate in small starburst marks within the blue band, while a few longer warm amber arrows representing visible light pass straight through the band and continue down to the surface. A small inset panel at the lower right shows a simple ozone molecule as three linked circles splitting into a two-circle molecule and a single circle, with a thin curved arrow looping back to indicate the cycle repeating. A scattering of tiny faint stars in the dark space above. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('text', 11, {
      markdown: '**Infrared, and the greenhouse effect.** Now the other window, and the same idea used the other way round.\n\nThe atmosphere is largely **transparent to visible light**, which is why the Sun warms the ground rather than the air. Sunlight comes in, lands on soil, sea and roof, and is absorbed.\n\nThe warmed ground then radiates too, as every warm object does — but at a surface temperature of around $ 15^\\circ $ C it radiates in the **infrared**, at wavelengths near $ 10\\ \\mu\\text{m} $. The Sun radiates in the visible because its surface is at about $ 5800 $ K; the Earth radiates in the infrared because it is much cooler. The temperature of the emitter decides the band.\n\nAnd here the atmosphere behaves quite differently. **Carbon dioxide, water vapour and methane absorb strongly in the infrared** while being clear to visible light. They let the energy in and then hold much of it on the way out, radiating it in all directions including back downwards. The surface settles at a higher temperature than it otherwise would.\n\nThis is not a fault. Without any greenhouse gases at all, the Earth\'s average surface temperature would be about $ -18^\\circ $ C — a frozen planet. The natural greenhouse effect is why the average is about $ +15^\\circ $ C and why there is liquid water.\n\nThe difficulty is entirely one of **degree**. Burning fossil fuels has raised carbon dioxide from around $ 280 $ parts per million before industrialisation to over $ 420 $ today, and the same physics that made the planet habitable now makes it warmer than the climate and the agriculture built on it were shaped for.',
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'logical',
      prompt: 'Carbon dioxide is transparent to visible light but absorbs strongly in the infrared. Why does that particular combination **warm** the planet rather than cool it?',
      options: [
        'It stops sunlight arriving, so the ground never gets to heat up at all',
        'Sunlight gets in, but the infrared the ground sends back cannot get out',
        'It reflects infrared straight back to the Sun, heating the atmosphere',
        'Infrared gets in easily, while the visible light is trapped underneath',
      ],
      correct_index: 1,
      reveal: '**Because the traffic is one-way: energy comes in at a wavelength the gas ignores and tries to leave at a wavelength the gas absorbs.**\n\nFollow one joule the whole way through.\n\n*In:* it arrives as visible light. Carbon dioxide is transparent there, so it passes straight down and is absorbed by the ground.\n\n*Out:* the ground, warmed, radiates. But the ground is at about $ 288 $ K, not $ 5800 $ K, so what it radiates is **infrared** near $ 10\\ \\mu\\text{m} $ — and carbon dioxide absorbs strongly there. The joule is caught on its way out and re-radiated in all directions, including downward.\n\n**The whole effect rests on the fact that the two journeys happen at different wavelengths**, because the Sun and the Earth are at very different temperatures. If the atmosphere blocked both equally, or let both through equally, there would be no warming at all.\n\n**Two things to be careful with.** First, "trapped" is a loose word — the energy is not sealed in, or the planet would heat without limit. It leaves more slowly, so the surface settles at a higher steady temperature. Second, a glass greenhouse actually works mostly by stopping warm air from mixing away, which is a different mechanism entirely. The name is historical, and the atmosphere really does work the radiative way described here.',
      difficulty_level: 3,
    }),
    b('callout', 13, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Wien\'s rule says the wavelength at which a warm body radiates most strongly is inversely proportional to its temperature. Put in $ 5800 $ K for the Sun\'s surface and you land in the middle of the visible band; put in $ 288 $ K for the ground and you land at about $ 10 $ micrometres, deep in the infrared.\n\nThat single fact is doing an extraordinary amount of work in the world.\n\n**It is why your eyes see the wavelengths they do.** Evolution built detectors for the band the Sun actually supplies. A creature on a much cooler star would see in the infrared, using the same physics.\n\n**It is why a thermal camera can find a person in the dark.** You are radiating steadily at around $ 10\\ \\mu\\text{m} $, every second, whether or not any lamp is on. There is nothing to switch on and nowhere to hide; a warm object in a cool room is a light source in a band we simply cannot see. The same cameras find heat leaking from a badly insulated wall and overheating joints in an electrical panel before they fail.\n\n**And it is why the greenhouse effect exists at all.** The Sun and the Earth radiate in different bands only because they are at different temperatures — and the atmosphere happens to treat those two bands very differently. Change either temperature enough and the whole argument would have to be redone.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), thin dim-grey line art, split into two halves by a thin vertical rule. Left half: a simplified sun disc in bright amber at the top with a broad emission curve drawn beneath it peaking in a narrow rainbow-tinted region labelled visible, the curve itself in warm amber. Right half: a simple outline of a house and a standing human figure at ground level in dim grey, with a much lower and broader emission curve peaking far to the right in a deep red region labelled infrared, and short dim-red wavy arrows rising from the roof and the figure. A shared horizontal wavelength axis runs beneath both halves with a few tick labels. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Order by increasing wavelength: gamma, X-ray, ultraviolet, visible, infrared, microwave, radio. Reverse it for increasing frequency.\n- All bands are the **same physics** — transverse, $ \\vec{E}\\perp\\vec{B} $, in phase, $ \\frac{E}{B} = c $ — and all travel at $ c $ in vacuum.\n- $ c = \\nu\\lambda $, so long wavelength always means low frequency.\n- Visible is $ 400 $ to $ 700 $ nm — less than a factor of two out of eighteen powers of ten.\n- Energy per photon rises with $ \\nu $: harmless at the radio end, **ionising** from the ultraviolet upwards.\n- **Ozone**, 15 to 35 km up, absorbs most solar ultraviolet. CFCs attacked it; the 1987 Montreal Protocol is repairing it.\n- **Greenhouse effect:** the atmosphere is clear to incoming visible light but absorbs the outgoing infrared the warm ground emits. Natural and necessary; the problem is the excess.',
    }),
    b('text', 15, {
      markdown: 'And that is the end of the electromagnetism half of this book.\n\nIt is worth looking back at the distance covered, because it is further than it feels while you are inside it. Chapter 1 began with two charges pushing each other apart across a gap, and a rule for how hard. Chapter 4 found that magnets have no loose ends. Chapter 6 found that a changing magnetic field makes an electric one. Chapter 5 and this chapter together found that a changing electric field makes a magnetic one.\n\nAnd once those last two statements were both on the table, nothing more had to be added. A changing electric field makes a magnetic field; that magnetic field, in changing, makes an electric field; and the pair walks off through empty space at a speed set by two constants that anyone can measure on a bench with a capacitor and a pair of current-carrying wires.\n\nThat speed is $ 3.00\\times10^{8} $ m/s, and it is the speed of light. Not approximately, and not by coincidence — **light is what those equations describe**. So is the warmth of a fire, the signal in your pocket, the image of your bones, and the ultraviolet three millimetres of ozone is keeping off your skin.\n\nEight chapters, which began by rubbing a rod on cloth, ended by explaining sight.\n\nAnd one loose end has been left deliberately in view. On this page the energy of a wave arrived in indivisible lumps whose size depends on frequency — which is not something a wave should do, and not something anything in these eight chapters can explain. Following that single crack is what breaks classical physics open, and it is where the rest of the book goes next.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('Arranged from the longest wavelength to the shortest, the bands run',
          [
            'radio, microwave, infrared, visible, ultraviolet, X-ray, gamma',
            'gamma, X-ray, ultraviolet, visible, infrared, microwave, radio',
            'infrared, radio, microwave, visible, gamma, X-ray, ultraviolet',
            'visible, infrared, microwave, radio, ultraviolet, X-ray, gamma',
          ],
          0,
          'Radio waves are the longest, at metres and above, and gamma rays the shortest, below a picometre. Since $ c = \\nu\\lambda $ is fixed, that same sequence read backwards is the order of increasing frequency.',
          1),
        q('The ozone layer matters to life on land because it absorbs',
          ['most of the ultraviolet from the Sun', 'most of the infrared from the Sun', 'most of the radio waves from space', 'most of the visible light from the Sun'],
          0,
          'Ultraviolet photons carry enough energy to break chemical bonds, including bonds in DNA. Ozone removes the most damaging part before it reaches the ground, while leaving visible light to pass through.',
          1),
        q('The greenhouse effect works because the atmosphere is',
          ['clear to visible light but opaque to infrared', 'opaque to visible light but clear to infrared', 'clear to both visible light and infrared', 'opaque to both visible light and infrared'],
          0,
          'Sunlight arrives in the visible and passes through; the warmed ground radiates in the infrared, which carbon dioxide and water vapour absorb. Energy therefore leaves more slowly than it arrives, and the surface settles warmer.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p5, p6, p7, p8, p9]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
