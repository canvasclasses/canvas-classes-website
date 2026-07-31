'use strict';
/**
 * Class 12 Physics · Ch.3 "Current Electricity" — pages 1–5.
 * Current, drift velocity, Ohm's law, resistivity, and temperature dependence.
 *
 * Run: node scripts/physics12-book/build_ch3_a_current.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 3;

// ── p1 · What a Current Really Is ────────────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'what-a-current-really-is',
  title: 'What a Current Really Is',
  subtitle: 'A scalar with a direction — and the vector that fixes it',
  glossary: [
    { term: 'electric current', definition: 'The rate at which charge crosses a section of a conductor: $ I = dq/dt $. Measured in amperes.' },
    { term: 'conventional current', definition: 'The direction a positive charge would move — from the positive terminal round to the negative. Opposite to the actual electron flow in a metal.' },
    { term: 'current density', definition: 'Current per unit area, $ \\vec{J} = I/A $, taken along the direction of flow. A genuine vector.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'For two whole chapters charge has been sitting still. Now let it move.\n\nHere is the first question, and it is more awkward than it looks: is electric current a **scalar** or a **vector**? Every circuit diagram draws it as an arrow.',
      hint: 'Try adding two currents that meet at a junction. Do you need the angle between the wires?',
      reveal: '**Current is a scalar** — despite the arrows.\n\nThe test is what happens at a junction. Two wires meeting at any angle, carrying 3 A and 4 A into a third wire, give **7 A** out. Not 5 A. The angle between the wires is irrelevant, so this is not vector addition.\n\nThe arrow on a circuit diagram is a **sense along a wire**, not a direction in space. It tells you which way round the loop, not which way in three dimensions.\n\nThere *is* a true vector version of current — **current density** $ \\vec{J} $ — and it arrives at the end of this page.',
    }),
    b('text', 1, {
      markdown: 'Current is the rate at which charge crosses a section of a conductor:',
    }),
    b('latex_block', 2, {
      latex: 'I = \\frac{dq}{dt}',
      label: 'Definition of electric current',
      note: 'Unit: the ampere (A) = one coulomb per second. One of the seven SI base units.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'One ampere is one coulomb per second — and you already know from Chapter 1 how enormous a coulomb is. So a current of 1 A means about $ 6.25\\times10^{18} $ electrons crossing every second.\n\nAnd note which quantity is the base unit. The **ampere** is one of the seven SI base units; the **coulomb** is defined *from* it, as an ampere-second. Historically that is because a current is far easier to measure precisely than a static charge.',
    }),
    b('heading', 4, {
      text: 'The direction convention, and why it is backwards',
      level: 2,
      objective: 'State which way conventional current flows, and why it disagrees with the electrons.',
    }),
    b('text', 5, {
      markdown: 'In a metal the moving charges are **electrons**, which are negative. So they drift from the negative terminal of the battery, round the circuit, to the positive terminal.\n\nBut the convention, fixed long before anyone knew electrons existed, is the opposite:\n\n> **Conventional current flows from the positive terminal, round the external circuit, to the negative terminal** — the direction a *positive* charge would go.\n\nSo in every metal wire, the conventional current and the actual electron motion point opposite ways.\n\nIs that a problem? Almost never. A negative charge moving left is electrically equivalent to a positive charge moving right — same charge transported per second, same magnetic effect, same heating. Everything in this chapter works with the convention, and you only need the electrons when you are asked about them directly.\n\n(In an electrolyte or a gas discharge, both signs really do move — positive ions one way and negative ions the other — and then the total current is the sum of the two contributions.)',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'logical',
      prompt: 'Currents of $ 3 $ A and $ 4 $ A flow into a junction along two wires at right angles to each other, and a single wire carries the total away. What current flows in the third wire?',
      options: ['$ 7 $ A', '$ 5 $ A', '$ 1 $ A', '$ 3.5 $ A'],
      reveal: '**7 A.**\n\nCharge is conserved, so whatever arrives per second must leave per second: $ 3 + 4 = 7 $ A.\n\nThe answer 5 A comes from treating the currents as perpendicular vectors and using $ \\sqrt{3^{2}+4^{2}} $. That is exactly the mistake this question exists to catch. **Currents add arithmetically, whatever the geometry of the wires.**\n\nThis is also, in one line, Kirchhoff\'s junction rule — which gets a full page later.',
      difficulty_level: 2,
    }),
    b('heading', 7, {
      text: 'Current density — the honest vector',
      level: 2,
      objective: 'Distinguish current from current density, and say why only one of them is a vector.',
    }),
    b('text', 8, {
      markdown: 'Current tells you how much charge crosses a whole section. **Current density** tells you how concentrated that flow is at a point:',
    }),
    b('latex_block', 9, {
      latex: '\\vec{J} = \\frac{I}{A}\\hat{n}, \\qquad I = \\int \\vec{J}\\cdot d\\vec{A}',
      label: 'Current density',
      note: 'Unit: A/m². A true vector, pointing along the direction of flow — and along E inside a conductor.',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'The relationship is worth stating carefully, because the two are constantly muddled.\n\n**$ I $ is a scalar and refers to a whole cross-section.** It is the same everywhere along a wire, whatever the wire\'s shape — charge cannot pile up.\n\n**$ \\vec{J} $ is a vector and refers to a point.** It changes as the wire gets fatter or thinner, because the same current is spread over a different area.\n\nThat gives a result worth remembering. In a wire whose cross-section is **not** uniform:\n\n$ I $ is the same everywhere, but $ J \\propto \\frac{1}{A} $\n\nSo at a narrow neck, the current density is higher, the drift speed is higher, and — as you will see two pages from now — the field is stronger too. A thin section of wire is where things get hot and where a fuse melts.',
    }),
    b('worked_example', 11, {
      label: 'current and current density in an electron beam',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An electron beam has a cross-section of $ 1.0\\ \\text{mm}^{2} $. A total of $ 6.0\\times10^{16} $ electrons cross any perpendicular section every second. Find (a) the current and (b) the current density.',
      solution: '**(a) The current.** Charge per second is the number of electrons per second times the charge on each:\n\n$ I = \\frac{ne}{t} = \\frac{(6.0\\times10^{16})(1.6\\times10^{-19})}{1} = 9.6\\times10^{-3}\\ \\text{A} $\n\nAbout $ 9.6 $ mA — and note that sixty thousand million million electrons a second is a current of only a few milliamps. That is the coulomb being enormous again.\n\n**(b) The current density.** Convert the area first: $ 1.0\\ \\text{mm}^{2} = 1.0\\times10^{-6}\\ \\text{m}^{2} $.\n\n$ J = \\frac{I}{A} = \\frac{9.6\\times10^{-3}}{1.0\\times10^{-6}} = 9.6\\times10^{3}\\ \\text{A/m}^{2} $\n\n**Habit worth building:** convert mm² to m² by multiplying by $ 10^{-6} $, not $ 10^{-3} $. Areas carry the conversion factor squared, and forgetting that is the most common numerical error in this whole chapter.',
    }),
    b('image', 12, {
      src: '',
      alt: 'A wire of non-uniform cross-section showing the same current but different current density at the narrow and wide sections',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Same current everywhere. Higher current density — and a faster drift — at the neck.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). A horizontal wire drawn in thin dim-grey outline, wide at the left, narrowing to a neck in the middle, and wide again at the right. Orange arrows inside the wire show the flow: widely spaced and short in the wide sections, tightly packed and long at the neck. A muted white label at each end reads I, identical in both, and labels beneath the wide and narrow parts read low J and high J. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ I = dq/dt $, in amperes. The ampere is an SI **base** unit; the coulomb is derived from it.\n- Current is a **scalar** — currents at a junction add arithmetically, never as vectors.\n- Conventional current runs $ + \\to - $ externally, **opposite** to the electron drift in a metal.\n- $ \\vec{J} = I/A $ is the vector, and it points along $ \\vec{E} $ inside the conductor.\n- Along a wire of varying thickness: $ I $ is constant but $ J \\propto 1/A $.\n- mm² → m² is a factor of $ 10^{-6} $.',
    }),
    b('text', 14, {
      markdown: 'Next: those electrons are moving. Astonishingly slowly, as it turns out — which raises a question about why a light comes on the instant you flick a switch.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('Electric current is a scalar quantity because',
          ['currents at a junction add arithmetically', 'it has no direction associated with it at all', 'charge itself is a scalar quantity', 'it is measured with a scalar instrument'],
          0,
          'Two currents meeting at a junction sum directly regardless of the angle between the wires — the test of a scalar. The arrow in a circuit diagram marks a sense along the wire, not a direction in space; the genuine vector is the current density $ \\vec{J} $.',
          2),
        q('In a metallic conductor, the direction of conventional current is',
          ['opposite to the drift of the electrons', 'the same as the drift of the electrons', 'perpendicular to the electron drift', 'undefined'],
          0,
          'The convention was fixed as the direction a positive charge would move, long before the electron was discovered. In a metal the actual carriers are negative, so the two directions disagree — which changes nothing about any calculation.',
          1),
        q('A wire narrows along its length. Along the wire,',
          ['the current is constant but the current density rises at the neck', 'both the current and current density are constant', 'the current falls at the neck', 'the current density is constant but the current rises'],
          0,
          'Charge cannot accumulate, so the same current passes every section. But $ J = I/A $, so squeezing the same current through a smaller area raises the density — and with it the drift speed and the heating.',
          3),
      ],
    }),
  ],
};

// ── p2 · Drift Velocity ──────────────────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'drift-velocity',
  title: 'Drift Velocity',
  subtitle: 'Electrons crawl. So why does the bulb light instantly?',
  glossary: [
    { term: 'drift velocity', definition: 'The small average velocity free electrons acquire along a wire under an applied field, on top of their fast random motion.' },
    { term: 'relaxation time', definition: 'The average time between successive collisions of a free electron with the lattice — about $ 10^{-14} $ s in a metal.' },
    { term: 'free electron density', definition: 'The number of conduction electrons per unit volume, $ n $. About $ 8.5\\times10^{28}\\ \\text{m}^{-3} $ in copper.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'The free electrons in a copper wire are already moving at around **a million metres per second** at room temperature — that is their thermal speed, and it is completely random in direction.\n\nSwitch on a field and they acquire, on top of that chaos, a steady drift of roughly **a tenth of a millimetre per second**.\n\nThat is the ratio this page has to explain: a drift ten orders of magnitude slower than the motion it rides on. And somehow it delivers your electricity.',
    }),
    b('text', 1, {
      markdown: 'Here is what actually happens inside the metal, step by step.\n\nWith no field applied, the free electrons rattle about at high speed in random directions, colliding constantly with the vibrating ions of the lattice. Averaged over all of them, the net motion is **zero** — no current.\n\nApply a field $ E $ and each electron feels a force $ eE $, giving it an acceleration $ a = eE/m $ opposite to the field. It accelerates — but only until its next collision, which resets its direction essentially at random.\n\nThe average time between collisions is the **relaxation time** $ \\tau $, about $ 10^{-14} $ s. So the electron only ever gains a small extra velocity before being knocked off course again:',
    }),
    b('latex_block', 2, {
      latex: 'v_d = \\frac{eE\\tau}{m}',
      label: 'Drift velocity',
      note: 'A steady average, not a growing speed — every collision wipes out the gain and the field starts again.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'The important word is **average**. Nothing accelerates indefinitely. The field adds a small forward nudge, collisions destroy it, and the balance between the two settles at a constant average drift.\n\nThat is why a steady field gives a **steady** current rather than an ever-increasing one — which would be what you would expect from $ F = ma $ alone. The lattice provides the friction.',
    }),
    b('heading', 4, {
      text: 'Connecting drift to current',
      level: 2,
      objective: 'Derive $ I = neAv_d $ and use it to find a real drift speed.',
    }),
    b('step_solver', 5, {
      title: 'From drifting electrons to a measurable current',
      problem: 'A wire of cross-sectional area $ A $ contains $ n $ free electrons per unit volume, drifting at $ v_d $. Find the current.',
      intro: 'Count how much charge crosses a section in a short time $ \\Delta t $. Three lines.',
      steps: [
        st('Volume that crosses the section in time $ \\Delta t $ $ = A\\,v_d\\,\\Delta t $',
          'In time $ \\Delta t $ every electron advances $ v_d\\Delta t $, so exactly the electrons in a slab of that length get through.'),
        st('Number of electrons in that slab $ = n\\,A\\,v_d\\,\\Delta t $',
          'Multiply the volume by the number of free electrons per unit volume.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does only this slab cross the section, and not electrons from further back?',
              options: ['Electrons further back are stationary', 'In time $ \\Delta t $ an electron only travels $ v_d\\Delta t $, so anything further back cannot reach the section', 'Electrons further back move the other way', 'They collide and never arrive'],
              answer_index: 1,
              feedback_right: 'Exactly — the slab length is set by how far an electron can drift in the time available.',
              feedback_wrong: 'Every electron drifts the same distance $ v_d\\Delta t $ in time $ \\Delta t $. An electron starting further back than that simply has not reached the section yet.',
            },
          }),
        st('Charge crossing $ = (n\\,A\\,v_d\\,\\Delta t)\\,e $',
          'Each electron carries a charge of magnitude $ e $.'),
        st('$ I = \\frac{\\Delta q}{\\Delta t} = n\\,e\\,A\\,v_d $',
          'Divide by the time. The $ \\Delta t $ cancels, as it must — the answer cannot depend on the interval we chose.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Dividing by $ A $ gives the current density. What is $ J $ in terms of $ n $, $ e $ and $ v_d $?',
              blank_answer: 'nev_d',
              feedback_right: 'Yes — $ J = nev_d $, a relation between two quantities that both refer to a point rather than a whole section.',
              feedback_wrong: '$ J = I/A = neAv_d/A = nev_d $.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A current of $ 1.20 $ A gives a drift velocity of $ 1.20\\times10^{-4} $ m/s in a certain wire. What is the drift velocity when the current is $ 6.00 $ A?',
        answer: '$ 6.00\\times10^{-4} $ m/s',
        solution: 'For a given wire, $ n $, $ e $ and $ A $ are all fixed, so $ I \\propto v_d $.\n\nThe current has been multiplied by 5, so the drift velocity is multiplied by 5:\n\n$ v_d = 5 \\times 1.20\\times10^{-4} = 6.00\\times10^{-4}\\ \\text{m/s} $\n\nProportionality questions like this never need the values of $ n $ or $ A $ at all.',
      },
    }),
    b('worked_example', 6, {
      label: 'how slowly do electrons actually drift?',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A current of $ 1 $ A flows in a copper wire of cross-section $ 2\\ \\text{mm}^{2} $. Copper has $ 8.5\\times10^{28} $ free electrons per cubic metre. Find the drift velocity.',
      solution: 'Rearrange $ I = neAv_d $:\n\n$ v_d = \\frac{I}{neA} $\n\nConvert the area: $ 2\\ \\text{mm}^{2} = 2\\times10^{-6}\\ \\text{m}^{2} $.\n\n$ v_d = \\frac{1}{(8.5\\times10^{28})(1.6\\times10^{-19})(2\\times10^{-6})} $\n\nThe denominator: $ (8.5\\times10^{28})(1.6\\times10^{-19}) = 1.36\\times10^{10} $, then $ \\times 2\\times10^{-6} = 2.72\\times10^{4} $.\n\n$ v_d = 3.7\\times10^{-5}\\ \\text{m/s} $\n\nAbout **0.04 millimetres per second**. At that rate an electron takes over **7 hours** to travel one metre.\n\n**Why so slow?** Look at where the smallness comes from: $ n $ is colossal. There are so many carriers that each one needs to move only imperceptibly to deliver a whole ampere. A large current does not need fast electrons; it needs a lot of them.',
    }),
    b('heading', 7, {
      text: 'So why does the bulb light instantly?',
      level: 2,
      objective: 'Resolve the paradox between a slow drift and an instant response.',
    }),
    b('text', 8, {
      markdown: 'If electrons crawl at a fraction of a millimetre per second, why does a lamp fifty metres from a switch come on the moment you press it?\n\nBecause **nothing has to travel from the switch to the lamp.**\n\nWhen you close the circuit, the electric field is established throughout the whole loop almost instantly — at close to the speed of light. And the electrons that light the filament were **already inside the filament**. They do not have to arrive from anywhere; they simply start drifting, all together, the moment the field reaches them.\n\nThe standard analogy is a pipe already full of water. Push at one end and water comes out of the other end immediately — not because that particular water travelled the length of the pipe, but because the whole column moved at once.\n\nSo three quite different speeds live in the same wire, and confusing them is the classic error here:',
    }),
    b('table', 9, {
      caption: 'Three speeds in one wire. Only the last one is the drift velocity.',
      headers: ['Speed', 'Order of magnitude', 'What it is'],
      rows: [
        ['Signal / field propagation', '$ \\sim 10^{8} $ m/s', 'How fast the field is set up round the circuit — this is what makes the lamp instant'],
        ['Random thermal speed', '$ \\sim 10^{5}\\text{–}10^{6} $ m/s', 'Chaotic motion of the electrons; averages to zero, carries no current'],
        ['Drift velocity', '$ \\sim 10^{-4} $ m/s', 'The tiny net motion along the wire that actually is the current'],
      ],
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'quantitative',
      prompt: 'A copper conductor of cross-section $ 1\\ \\text{cm}^{2} $ and length $ 10 $ km carries $ 1 $ A. Roughly how long would one electron take to travel from one end to the other? Take $ n = 8.5\\times10^{28}\\ \\text{m}^{-3} $.',
      options: ['A few hundred years', 'A few hours', 'A few seconds', 'About a month'],
      reveal: '**A few hundred years** — around 430, in fact.\n\n$ A = 1\\ \\text{cm}^{2} = 10^{-4}\\ \\text{m}^{2} $, so\n\n$ v_d = \\frac{1}{(8.5\\times10^{28})(1.6\\times10^{-19})(10^{-4})} = 7.4\\times10^{-7}\\ \\text{m/s} $\n\n$ t = \\frac{10^{4}}{7.4\\times10^{-7}} = 1.4\\times10^{10}\\ \\text{s} \\approx 430\\ \\text{years} $\n\nAnd yet the current at the far end starts within microseconds of switching on.\n\nThat gap — four centuries versus microseconds — is the sharpest possible statement of the point. **The current is not electrons delivered from a source. It is electrons already present, all beginning to drift together.**',
      difficulty_level: 3,
    }),
    b('image', 11, {
      src: '',
      alt: 'Electron paths in a wire with and without an applied field, showing random zigzags versus a slow net drift',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The field barely bends the chaos. That slight bias, summed over an enormous number of electrons, is the current.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, each showing a rectangular slice of wire outlined in dim grey containing a regular grid of small grey ion dots. Left panel labelled no field: one bright blue electron path drawn as a jagged zigzag that wanders and ends up near where it started. Right panel labelled with field: horizontal orange field arrows across the top, and a similar jagged blue path that still zigzags violently but ends up noticeably displaced to the right, with a faint straight amber arrow beneath marking the small net drift. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ v_d = \\frac{eE\\tau}{m} $, with $ \\tau \\approx 10^{-14} $ s. Collisions keep it steady rather than growing.\n- $ I = neAv_d $ and $ J = nev_d $.\n- Real drift speeds are $ \\sim 10^{-4} $ m/s — slow because $ n $ is enormous.\n- The lamp is instant because the **field** propagates at $ \\sim 10^{8} $ m/s and the electrons were already there.\n- Never confuse drift speed with thermal speed or with signal speed.',
    }),
    b('text', 13, {
      markdown: 'Next: the drift equation has a formula for resistance hidden inside it — and it explains why Ohm\'s law works at all.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('The drift velocity of electrons in a metal is of the order of',
          ['$ 10^{-4} $ m/s', '$ 10^{5} $ m/s', '$ 10^{8} $ m/s', '$ 1 $ m/s'],
          0,
          'The free electron density is enormous, so each carrier need move only imperceptibly to deliver a substantial current. The value $ 10^{5} $ m/s is the random thermal speed and $ 10^{8} $ m/s is the field propagation speed — two different things.',
          1),
        q('A bulb lights up the instant its switch is closed, even though electrons drift very slowly. This is because',
          ['the field is set up round the whole circuit almost instantly', 'the electrons themselves travel at the speed of light', 'the drift velocity is in fact extremely large', 'the bulb stores charge in advance of being switched on'],
          0,
          'Nothing has to travel from switch to bulb. The field is established round the whole loop at nearly the speed of light, and the electrons already inside the filament simply begin to drift together.',
          2),
        q('If the current in a given wire is doubled, the drift velocity',
          ['doubles', 'halves', 'is unchanged', 'quadruples'],
          0,
          'From $ I = neAv_d $, with $ n $, $ e $ and $ A $ all fixed for a given wire, $ I \\propto v_d $. Doubling one doubles the other.',
          1),
      ],
    }),
  ],
};

// ── p3 · Ohm's Law and Resistance ────────────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'ohms-law-and-resistance',
  title: "Ohm's Law and Resistance",
  subtitle: 'A law that is not a law — and the microscopic reason it holds',
  glossary: [
    { term: 'resistance', definition: 'The ratio of potential difference to current for a conductor, $ R = V/I $. Measured in ohms.' },
    { term: 'ohmic conductor', definition: 'A conductor whose resistance stays constant as the voltage changes, so its V–I graph is a straight line through the origin.' },
    { term: 'conductivity', definition: 'The reciprocal of resistivity, $ \\sigma = 1/\\rho $ — a measure of how freely a material carries current.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Ohm\'s law says $ V = IR $ — double the voltage and you double the current.\n\nBut a torch bulb does not obey it, a diode certainly does not, and even a copper wire stops obeying it if you push enough current through. So in what sense is $ V = IR $ a law at all?',
      hint: 'Ask what has to stay constant for the ratio $ V/I $ to be constant.',
      reveal: 'It is an **empirical rule that some materials follow, under some conditions** — not a fundamental law like the conservation of charge.\n\nThe honest statement is: for a metal at **constant temperature**, the current is proportional to the applied voltage. Break either condition and the proportionality goes.\n\nA bulb filament fails because it gets hot. A diode fails because its conduction mechanism is not the simple drift of this page. Neither is a violation of physics; they are just not ohmic.\n\nThe definition $ R = V/I $ is always valid. It is the *constancy* of $ R $ that is the extra claim.',
    }),
    b('text', 1, {
      markdown: 'The definition first, because it always applies:',
    }),
    b('latex_block', 2, {
      latex: 'R = \\frac{V}{I}',
      label: 'Definition of resistance',
      note: 'Unit: the ohm (Ω) = volt per ampere. This is a definition and is always valid — even for a diode.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: '**Ohm\'s law** is then the further claim that, for some materials, this $ R $ is a **constant** — independent of $ V $ and $ I $ — provided the physical conditions, above all the temperature, do not change.\n\nMaterials that behave this way are **ohmic**: metals, and most alloys. Their $ V $–$ I $ graph is a straight line through the origin, and the slope is $ R $.\n\nThe reciprocal quantities get used often enough to be worth naming: **conductance** $ G = 1/R $, measured in siemens (S), and **conductivity** $ \\sigma = 1/\\rho $.',
    }),
    b('heading', 4, {
      text: 'Where the law comes from',
      level: 2,
      objective: 'Derive Ohm\'s law from the drift-velocity picture and identify what must stay constant.',
    }),
    b('text', 5, {
      markdown: 'The previous page has everything needed. Combine $ J = nev_d $ with $ v_d = eE\\tau/m $:\n\n$ J = ne\\cdot\\frac{eE\\tau}{m} = \\left(\\frac{ne^{2}\\tau}{m}\\right)E $\n\nEverything in the bracket is a property of the **material**, not of the circuit. Call it $ \\sigma $, the conductivity:',
    }),
    b('latex_block', 6, {
      latex: '\\vec{J} = \\sigma\\vec{E}, \\qquad \\sigma = \\frac{ne^{2}\\tau}{m}, \\qquad \\rho = \\frac{m}{ne^{2}\\tau}',
      label: "Ohm's law in microscopic form",
      note: 'This is the real content of the law: J ∝ E, with the constant fixed by the material.',
      highlight: true,
    }),
    b('text', 7, {
      markdown: 'That is Ohm\'s law in its honest form — **current density proportional to field** — and now you can see exactly what has to hold for it to work.\n\nThe constant $ \\sigma $ contains $ n $ and $ \\tau $. In a metal, $ n $ is essentially fixed. So the whole of Ohm\'s law rests on **$ \\tau $ being constant** — on the electrons colliding at the same average rate whatever the current.\n\nAnd $ \\tau $ depends on how violently the lattice ions are vibrating, which depends on **temperature**. Heat the conductor and $ \\tau $ falls, so $ \\sigma $ falls and $ R $ rises.\n\nSo the "constant temperature" condition is not fine print. It is the entire assumption.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'logical',
      prompt: 'A torch bulb is measured at low voltage and gives $ R = 3\\ \\Omega $. At its full working voltage the measured resistance is $ 12\\ \\Omega $. Is Ohm\'s law being violated?',
      options: [
        'No — the filament is much hotter at full voltage, so the conditions have changed',
        'Yes — Ohm\'s law says $ R $ must stay constant whatever the conditions',
        'No — the resistance of every material rises as the voltage across it rises',
        'Yes, but only because a reading taken at low voltage is always inaccurate',
      ],
      reveal: '**No violation.** The conditions changed.\n\nOhm\'s law applies at **constant temperature**. A filament at full brightness sits at over 2000 °C; at low voltage it is barely warm. The hot lattice vibrates far more, so $ \\tau $ drops sharply, and $ \\rho = m/ne^{2}\\tau $ rises.\n\nSo the bulb is not disobeying physics — it is simply not being measured under the same conditions twice. Its $ V $–$ I $ graph curves, bending towards the voltage axis as the filament heats.\n\n**A practical consequence:** at the instant of switch-on the filament is cold and its resistance is low, so the inrush current is several times the running current. That surge is why filament bulbs almost always fail at the moment you switch them on.',
      difficulty_level: 3,
    }),
    b('heading', 9, {
      text: 'The gallery of V–I graphs',
      level: 2,
      objective: 'Identify ohmic and non-ohmic behaviour from a V–I graph.',
    }),
    b('table', 10, {
      caption: 'Reading a $ V $–$ I $ characteristic. A straight line through the origin is the only ohmic case.',
      headers: ['Device', 'Graph shape', 'What it tells you'],
      rows: [
        ['Metal wire at fixed temperature', 'Straight line through the origin', 'Ohmic — $ R $ is the constant slope'],
        ['Filament bulb', 'Curves towards the voltage axis', '$ R $ **rises** as it heats up'],
        ['Semiconductor (thermistor)', 'Curves towards the current axis', '$ R $ **falls** as it heats up'],
        ['Diode', 'Almost nothing, then a sharp rise', 'Conducts one way only, above a threshold'],
        ['Electrolyte', 'Line not through the origin', 'Needs a minimum voltage before conduction starts'],
      ],
    }),
    b('text', 11, {
      markdown: 'One warning about reading these graphs. If the axes are $ V $ (vertical) against $ I $ (horizontal), the **slope** is $ R $. If they are drawn the other way round — $ I $ against $ V $, which is just as common — the slope is $ 1/R $ and a *steeper* line means *less* resistance.\n\nCheck the axes before you say which of two conductors has the greater resistance. It is a favourite trap.',
    }),
    b('image', 12, {
      src: '',
      alt: 'V-I characteristic graphs for a metal wire, a filament bulb, a thermistor and a diode',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Only the first is ohmic. The others are perfectly good physics — just not proportional.',
      generation_prompt: 'Clean scientific graph panel on a near-black background (#0B0C0F), four small graphs in a row sharing a style, each with thin dim-grey axes labelled I horizontally and V vertically in muted white. Graph 1 labelled metal wire: a straight amber line through the origin. Graph 2 labelled filament bulb: an amber curve through the origin bending upward away from the current axis. Graph 3 labelled thermistor: an amber curve through the origin bending toward the current axis. Graph 4 labelled diode: an amber trace flat along the axis then turning sharply upward at a threshold, with a faint flat portion on the negative side. Generous dark space, orange accent, no gridlines, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ R = V/I $ is a **definition** and always holds. Ohm\'s law is the extra claim that $ R $ is constant.\n- Microscopic form: $ \\vec{J} = \\sigma\\vec{E} $ with $ \\sigma = \\frac{ne^{2}\\tau}{m} $ and $ \\rho = \\frac{m}{ne^{2}\\tau} $.\n- The law needs **constant temperature**, because $ \\tau $ depends on lattice vibration.\n- Ohmic → straight line through the origin. Everything else is non-ohmic, not wrong.\n- $ V $ against $ I $: slope is $ R $. $ I $ against $ V $: slope is $ 1/R $. Check the axes.',
    }),
    b('text', 14, {
      markdown: 'Next: resistance depends on the material *and* on the shape of the wire. Separating those two is what lets you compare materials at all.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q("Ohm's law holds for a metallic conductor provided",
          ['its temperature stays constant', 'the current is very large', 'the voltage is very large', 'it is connected to a battery'],
          0,
          'The conductivity contains the relaxation time $ \\tau $, which depends on how strongly the lattice vibrates. Heating changes $ \\tau $ and therefore the resistance, so a constant temperature is exactly the condition the law needs.',
          2),
        q('The resistivity of a metal, in terms of microscopic quantities, is',
          ['$ \\frac{m}{ne^{2}\\tau} $', '$ \\frac{ne^{2}\\tau}{m} $', '$ \\frac{m\\tau}{ne^{2}} $', '$ \\frac{ne^{2}}{m\\tau} $'],
          0,
          'Resistivity is the reciprocal of conductivity, and $ \\sigma = ne^{2}\\tau/m $. A quick check: more free electrons or longer between collisions should both *reduce* resistivity, and both sit in the denominator here.',
          2),
        q('A device has a $ V $–$ I $ graph that curves towards the voltage axis. The device is',
          ['non-ohmic, with resistance increasing', 'ohmic', 'non-ohmic, with resistance decreasing', 'a perfect conductor'],
          0,
          'With $ V $ on the vertical axis the slope is $ R $, and a curve bending away from the current axis means the slope is growing — resistance rising, which is what a filament does as it heats.',
          3),
      ],
    }),
  ],
};

// ── p4 · Resistivity and the Shape of a Wire ─────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'resistivity-and-the-shape-of-a-wire',
  title: 'Resistivity and the Shape of a Wire',
  subtitle: 'Separating what the material does from what the geometry does',
  glossary: [
    { term: 'resistivity', definition: 'A property of a material alone: the resistance of a unit cube of it, measured in ohm-metres.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Between the best conductor and the best insulator, resistivity spans about **twenty-four orders of magnitude** — from $ 10^{-8} $ Ω·m for silver to around $ 10^{16} $ Ω·m for good quartz.\n\nNo other everyday physical property varies over anything like that range. It is why electricity is so easy to control: the difference between "wire" and "insulator" is not a matter of degree, it is a factor of a million million million million.',
    }),
    b('text', 1, {
      markdown: 'Resistance depends on two quite separate things: **what the wire is made of**, and **what shape it is**. Mixing them up makes every comparison meaningless, so we separate them.\n\nA longer wire has more resistance — more lattice to collide with. A fatter wire has less — more parallel routes. Putting those together:',
    }),
    b('latex_block', 2, {
      latex: 'R = \\rho\\,\\frac{l}{A}',
      label: 'Resistance from resistivity and geometry',
      note: 'ρ is the resistivity, a material property in Ω·m. l/A is pure geometry.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: '**Resistivity** $ \\rho $ is what is left when the geometry has been divided out. It is the resistance of a cube of the material one metre on each side, measured face to face — which is why its unit is the ohm-**metre**, an awkward-looking unit that follows straight from $ \\rho = RA/l $.\n\nTwo things it does **not** depend on: the size of the sample, or the shape. A copper wire and a copper bar have the same resistivity and wildly different resistances.',
    }),
    b('table', 4, {
      caption: 'Typical resistivities at room temperature. Note the exponents, not the digits.',
      headers: ['Material', 'Resistivity (Ω·m)', 'Class'],
      rows: [
        ['Silver', '$ 1.6\\times10^{-8} $', 'conductor — the best there is'],
        ['Copper', '$ 1.7\\times10^{-8} $', 'conductor — used because silver is expensive'],
        ['Aluminium', '$ 2.7\\times10^{-8} $', 'conductor — lighter, used for overhead lines'],
        ['Nichrome', '$ \\sim 10^{-6} $', 'alloy — deliberately resistive, for heating elements'],
        ['Silicon (pure)', '$ \\sim 10^{3} $', 'semiconductor'],
        ['Glass', '$ 10^{10}\\text{–}10^{14} $', 'insulator'],
      ],
    }),
    b('heading', 5, {
      text: 'Stretching a wire — the classic trap',
      level: 2,
      objective: 'Predict how resistance changes when a wire is stretched at constant volume.',
    }),
    b('text', 6, {
      markdown: 'This is examined every year and caught out by nearly everyone the first time.\n\nA wire is stretched so that its length doubles. What happens to its resistance?\n\nThe instinct is "it doubles, because $ R \\propto l $." That is wrong, and the reason is that **stretching does not add material.** The volume $ V = Al $ stays constant, so making the wire longer necessarily makes it **thinner** — and both changes push the resistance up.\n\nEliminate $ A $ using $ A = V/l $:\n\n$ R = \\frac{\\rho l}{A} = \\frac{\\rho l}{V/l} = \\frac{\\rho l^{2}}{V} $\n\nSo at constant volume:',
    }),
    b('latex_block', 7, {
      latex: 'R \\propto l^{2} \\qquad\\text{and equivalently}\\qquad R \\propto \\frac{1}{A^{2}}',
      label: 'A stretched wire (constant volume)',
      note: 'Double the length → FOUR times the resistance, because the area halves at the same time.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'So doubling the length gives **four** times the resistance. Stretching to three times the length gives nine times.\n\nAnd read the second form too: halving the area (by stretching) gives four times the resistance, not twice.\n\n**The distinction that matters.** $ R \\propto l $ is right when you compare two *different* wires of the same thickness. $ R \\propto l^{2} $ is right when you *stretch* one wire. The question always tells you which — look for the word "stretched" or "drawn".',
    }),
    b('worked_example', 9, {
      label: 'stretching, and then folding',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A wire of resistance $ R $ is stretched until its length is three times the original. It is then folded in half and the two halves are twisted together to form a single thicker wire. Find the final resistance.',
      solution: '**Stage 1 — stretch to three times the length.**\n\nVolume is conserved, so $ R \\propto l^{2} $:\n\n$ R_1 = 3^{2}R = 9R $\n\n**Stage 2 — fold in half and twist.**\n\nThis is where care is needed. Folding does two things at once: it halves the length **and** it doubles the cross-section (two strands side by side).\n\n$ R_2 = \\rho\\frac{l/2}{2A} = \\frac{1}{4}\\cdot\\rho\\frac{l}{A} = \\frac{R_1}{4} $\n\nSo $ R_2 = \\frac{9R}{4} = 2.25R $\n\n**A faster route to stage 2.** Folding a wire in half and twisting is exactly putting two identical half-length wires in **parallel**. Each half has resistance $ R_1/2 $, and two of those in parallel give $ R_1/4 $. Same answer, less algebra.\n\n**Watch-out.** Volume is conserved during *stretching*, but folding is not stretching — nothing thins out. Applying $ R \\propto l^{2} $ to the folding stage would be wrong.',
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'quantitative',
      prompt: 'A wire is stretched so that its radius is halved. By what factor does its resistance change?',
      options: ['16 times', '4 times', '2 times', '8 times'],
      reveal: '**16 times.**\n\nHalving the radius quarters the area, since $ A = \\pi r^{2} $. And at constant volume, $ R \\propto 1/A^{2} $:\n\n$ R_{\\text{new}} = \\left(\\frac{A}{A/4}\\right)^{2}R = 4^{2}R = 16R $\n\nCheck it the other way to be sure. Constant volume with a quartered area means the length is multiplied by 4, and $ R \\propto l^{2} $ gives $ 4^{2} = 16 $. The two routes agree.\n\n**The trap** is answering "4 times" by using $ R \\propto 1/A $ and forgetting that the length changed too. Whenever a wire is *stretched*, both dimensions move — always.',
      difficulty_level: 3,
    }),
    b('callout', 11, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'The stretching relation is the working principle of a **strain gauge** — a thin conducting track bonded to a structure. Load the structure, the track stretches microscopically, and its resistance rises measurably. Read the resistance and you have read the strain.\n\nThat is how a weighing scale, a load cell in a crane and the sensors monitoring a bridge all work. The change is tiny — parts per million — so the gauge is wired into a bridge circuit that measures a *difference* rather than an absolute value. You will see exactly that circuit later in this chapter.\n\nThe same physics chooses materials for the other end of the range: a **nichrome** heating element needs high resistivity so a short wire can dissipate a lot of power, while **copper** wiring needs low resistivity so the cable wastes as little as possible.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), two vignettes side by side in thin dim-grey line art with orange accents. Left: a close-up of a strain gauge — a flat rectangular backing with a fine amber conducting track folded back and forth many times — bonded to a grey beam that is very slightly bent, with two small arrows showing tension. Right: a coiled amber nichrome heating element glowing warm orange inside a grey appliance outline. Muted white minimal labels, generous dark space.',
    }),
    b('image', 12, {
      src: '',
      alt: 'A wire being stretched at constant volume, showing the length doubling while the cross-section halves',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Stretching adds no material. Longer and thinner, so the resistance rises by the square.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two stages one above the other separated by generous dark space. Upper stage: a short thick horizontal cylinder drawn in dim grey outline with a warm amber fill tint, with a dashed grey dimension line beneath labelled l and a small vertical dimension marker labelled A. Lower stage: the same volume of material drawn as a cylinder twice as long and visibly thinner, dimension lines labelled 2l and A over 2, with two small orange arrows at the ends showing the pull. A muted white note between them reads same volume, and one beneath the lower stage reads R times four. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ R = \\rho l/A $. $ \\rho $ is the material; $ l/A $ is the shape.\n- $ \\rho $ is in Ω·m and does **not** depend on the size or shape of the sample.\n- **Stretched** wire (volume fixed): $ R \\propto l^{2} $ and $ R \\propto 1/A^{2} $.\n- Comparing two **different** wires of equal thickness: $ R \\propto l $.\n- Folding a wire in half and twisting = two half-wires in parallel = $ R/4 $.',
    }),
    b('text', 13, {
      markdown: 'Next: $ \\rho $ has been treated as a fixed number for each material. It is not — it depends on temperature, and the way it does splits materials into two families.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A wire is stretched until its length doubles. Its new resistance is',
          ['four times the original', 'twice the original', 'half the original', 'unchanged'],
          0,
          'Stretching conserves volume, so doubling the length also halves the area. Both changes raise the resistance, and $ R \\propto l^{2} $ gives a factor of four. Answering "twice" uses $ R \\propto l $ and forgets the thinning.',
          2),
        q('The resistivity of a material depends on',
          ['the material and its temperature', 'the length of the sample', 'the cross-sectional area of the sample', 'the current flowing through it'],
          0,
          'Resistivity is defined precisely so that geometry divides out — it is what is left after the shape is removed. Its temperature dependence is real, and is the subject of the next page.',
          1),
        q('A wire of resistance $ 8\\ \\Omega $ is cut into two equal halves, and the halves are connected in parallel. The combined resistance is',
          ['$ 2\\ \\Omega $', '$ 4\\ \\Omega $', '$ 8\\ \\Omega $', '$ 16\\ \\Omega $'],
          0,
          'Each half has resistance $ 4\\ \\Omega $, and two equal resistances in parallel give half of one of them — so $ 2\\ \\Omega $. Equivalently, halving the length and doubling the area both cut the resistance by two.',
          2),
      ],
    }),
  ],
};

// ── p5 · Temperature and Resistance ──────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'temperature-and-resistance',
  title: 'Temperature and Resistance',
  subtitle: 'Two families of material, pulling in opposite directions',
  glossary: [
    { term: 'temperature coefficient of resistivity', definition: 'The fractional change in resistivity per degree of temperature rise, $ \\alpha $. Positive for metals, negative for semiconductors.' },
    { term: 'superconductor', definition: 'A material whose resistance falls to exactly zero below a critical temperature.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Heat a copper wire and its resistance goes **up**. Heat a piece of silicon and its resistance goes **down** — dramatically.\n\nBoth are made of atoms with free-ish electrons. Why do they go opposite ways?',
      hint: 'Resistivity is $ m/ne^{2}\\tau $. Heating affects both $ n $ and $ \\tau $ — but not equally in the two materials.',
      reveal: 'Because heating changes **two** things in $ \\rho = \\frac{m}{ne^{2}\\tau} $, and a different one dominates in each material.\n\n**In a metal**, $ n $ is already as large as it will ever be — every atom has donated its electrons and heating cannot free any more. So only $ \\tau $ matters: hotter lattice, more violent vibration, more collisions, smaller $ \\tau $, **larger $ \\rho $**.\n\n**In a semiconductor**, most electrons are still bound. Heating frees more of them, so $ n $ rises steeply — exponentially. That swamps the fall in $ \\tau $, and $ \\rho $ **drops**.\n\nOne formula, two behaviours, decided by which factor is free to move.',
    }),
    b('text', 1, {
      markdown: 'Over a modest temperature range, the change is close to linear:',
    }),
    b('latex_block', 2, {
      latex: '\\rho = \\rho_0\\left(1 + \\alpha\\,\\Delta T\\right), \\qquad R = R_0\\left(1 + \\alpha\\,\\Delta T\\right)',
      label: 'Temperature dependence of resistivity',
      note: 'α is the temperature coefficient, in per-kelvin. Positive for metals, negative for semiconductors.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'The same $ \\alpha $ works for $ R $ as for $ \\rho $, because the geometry factor $ l/A $ barely changes — thermal expansion is a far smaller effect than the change in $ \\rho $ itself.\n\nFor a metal, $ \\alpha $ is around $ 4\\times10^{-3}\\ \\text{K}^{-1} $. That means a rise of 100 °C increases resistance by roughly 40% — a big effect, and the reason a filament\'s hot resistance is many times its cold value.',
    }),
    b('comparison_card', 4, {
      title: 'Two families',
      columns: [
        {
          heading: 'Metals — $ \\alpha $ positive',
          points: [
            '$ n $ is fixed; heating only reduces $ \\tau $',
            'Resistance **rises** with temperature',
            '$ \\alpha \\approx +4\\times10^{-3}\\ \\text{K}^{-1} $',
            'Roughly linear over normal ranges',
            'Copper, silver, aluminium, tungsten',
          ],
        },
        {
          heading: 'Semiconductors — $ \\alpha $ negative',
          points: [
            'Heating frees many more carriers, so $ n $ rises steeply',
            'Resistance **falls** with temperature',
            '$ \\alpha $ negative and much larger in magnitude',
            'Strongly non-linear (roughly exponential)',
            'Silicon, germanium, carbon, most thermistors',
          ],
        },
      ],
    }),
    b('heading', 5, {
      text: 'Alloys — the third case, engineered on purpose',
      level: 2,
      objective: 'Explain why standard resistors are made from alloys rather than pure metals.',
    }),
    b('text', 6, {
      markdown: 'There is a practical problem lurking in all this. If you build a precision resistor out of copper, its value drifts as it warms up — and passing current through it warms it up. The instrument changes what it is measuring.\n\nThe answer is **alloys** designed to have a nearly zero temperature coefficient:\n\n- **Manganin** (copper-manganese-nickel)\n- **Constantan** (copper-nickel) — the name is the whole point\n\nTheir $ \\alpha $ is around a hundred times smaller than copper\'s, so their resistance is essentially fixed over a wide range. Every standard resistance box, and the wire of every meter bridge you will use, is made of one of these.\n\nThey also have a high resistivity, which is convenient: a short length gives a useful resistance.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'quantitative',
      prompt: 'A metal wire has resistance $ 10\\ \\Omega $ at $ 20\\ ^\\circ\\text{C} $ and $ 14\\ \\Omega $ at $ 120\\ ^\\circ\\text{C} $. What is its temperature coefficient?',
      options: ['$ 4\\times10^{-3}\\ \\text{K}^{-1} $', '$ 4\\times10^{-2}\\ \\text{K}^{-1} $', '$ 0.4\\ \\text{K}^{-1} $', '$ 4\\times10^{-4}\\ \\text{K}^{-1} $'],
      reveal: '**$ 4\\times10^{-3}\\ \\text{K}^{-1} $.**\n\n$ R = R_0(1+\\alpha\\Delta T) $ with $ R_0 = 10 $, $ R = 14 $ and $ \\Delta T = 100 $ K:\n\n$ 14 = 10(1 + 100\\alpha) \\;\\Rightarrow\\; 1.4 = 1 + 100\\alpha \\;\\Rightarrow\\; \\alpha = 4\\times10^{-3}\\ \\text{K}^{-1} $\n\nA useful sanity check: this is the typical value for a metal, so the answer is believable. If a calculation ever hands you $ \\alpha $ of order 1 for a metal, you have slipped a power of ten.\n\nAnd note that $ \\Delta T $ in kelvin equals $ \\Delta T $ in celsius — only the *difference* enters, so there is no need to convert to absolute temperature here.',
      difficulty_level: 2,
    }),
    b('heading', 8, {
      text: 'Superconductivity — resistance exactly zero',
      level: 2,
      objective: 'State what happens at the critical temperature and why it is not just "very low resistance".',
    }),
    b('text', 9, {
      markdown: 'Cool certain materials far enough and something happens that the linear formula cannot describe. Below a **critical temperature** $ T_c $, the resistance does not merely become small — it becomes **exactly zero**.\n\nMercury does this below $ 4.2 $ K, discovered by Kamerlingh Onnes in 1911. Some ceramic compounds manage it above $ 90 $ K, which matters enormously in practice because liquid nitrogen (77 K) is cheap while liquid helium is not.\n\nZero is a strong claim, and it is meant literally. A current started in a superconducting ring has been observed to circulate for **years** with no measurable decay.\n\nThis is not the drift-and-collision picture stretched to its limit; it is a different mechanism entirely, and explaining it needs quantum mechanics well beyond this chapter. But its uses are already around you: the enormous magnets in an MRI scanner are superconducting coils, because no ordinary wire could carry that current without melting.',
    }),
    b('image', 10, {
      src: '',
      alt: 'Resistance against temperature for a metal, a semiconductor and a superconductor',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'A metal climbs, a semiconductor falls away, and a superconductor drops to exactly zero at Tc.',
      generation_prompt: 'Clean scientific graph on a near-black background (#0B0C0F). Thin dim-grey axes labelled T horizontally and R vertically in muted white. Three traces: a straight amber line rising gently from left to right, labelled metal; a cool-blue curve falling steeply and flattening towards the horizontal axis, labelled semiconductor; and a third amber trace that runs along a low value then drops vertically to exactly zero at a point marked Tc with a faint dashed vertical grey line, labelled superconductor. Generous dark space, no gridlines, no clutter.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ R = R_0(1+\\alpha\\Delta T) $, with $ \\Delta T $ the same in K or °C.\n- **Metals:** $ \\alpha > 0 $, because $ \\tau $ falls while $ n $ is fixed. $ \\alpha \\approx 4\\times10^{-3}\\ \\text{K}^{-1} $.\n- **Semiconductors:** $ \\alpha < 0 $, because heating frees far more carriers and $ n $ rises steeply.\n- **Alloys** (manganin, constantan) have near-zero $ \\alpha $ — which is why standard resistors are made of them.\n- Below $ T_c $ a superconductor has **exactly** zero resistance, by a different mechanism entirely.',
    }),
    b('text', 12, {
      markdown: 'Next: enough about the wire. Time to meet the thing that pushes the current round it — and to discover that a battery is not quite the perfect source a circuit diagram suggests.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('When a semiconductor is heated, its resistance falls because',
          ['many more charge carriers are freed', 'the relaxation time increases', 'the lattice vibrates less', 'its length decreases'],
          0,
          'Heating gives bound electrons enough energy to become free, so $ n $ rises steeply in $ \\rho = m/ne^{2}\\tau $. The relaxation time does still fall, but the increase in $ n $ overwhelms it — unlike in a metal, where $ n $ cannot rise at all.',
          2),
        q('Standard resistance coils are made of manganin or constantan because these alloys have',
          ['a very small temperature coefficient of resistance', 'the lowest resistivity available', 'a large negative temperature coefficient', 'zero resistance'],
          0,
          'Their resistance barely changes as they warm, so a resistance box keeps its stated value even while carrying current. Their resistivity is actually high, not low — which is convenient, since a short wire then gives a useful resistance.',
          2),
        q('Below its critical temperature, the resistance of a superconductor is',
          ['exactly zero', 'very small but non-zero', 'negative', 'infinite'],
          0,
          'It is genuinely zero, not merely small — currents set up in superconducting rings have persisted for years without measurable decay. This is a different conduction mechanism, not the drift-and-collision picture pushed to a limit.',
          1),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p1, p2, p3, p4, p5]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
