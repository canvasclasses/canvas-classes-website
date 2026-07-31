'use strict';
/**
 * Class 12 Physics · Ch.2 "Capacitance" — pages 13–16.
 * Energy stored, energy density and the force between plates, dielectrics,
 * and charging/discharging through a resistor.
 *
 * Run: node scripts/physics12-book/build_ch2_d_energy_dielectric.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 2;

// ── p13 · Energy Stored in a Capacitor ───────────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'energy-stored-in-a-capacitor',
  title: 'Energy Stored in a Capacitor',
  subtitle: 'Where the factor of one half comes from',
  glossary: [],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A battery of emf $ V $ pushes a total charge $ Q $ onto a capacitor. The battery therefore does work $ QV $.\n\nBut the energy stored in the capacitor comes out as $ \\tfrac{1}{2}QV $ — only half.\n\nWhere did the other half go?',
      hint: 'Nothing in the circuit is perfect. The charge had to travel through wires.',
      reveal: 'It was **dissipated as heat** in the resistance of the circuit — and remarkably, exactly half is lost no matter how small that resistance is.\n\nThat is a genuinely surprising result: you cannot charge a capacitor from a battery through a resistor at better than 50% efficiency, however good your wires. (Charge it *slowly*, raising the voltage gradually instead of applying the full $ V $ at once, and you can do better — which is exactly what a switched-mode charger does.)\n\nBut the half in the formula is not about the resistor. It comes from the charging process itself, and this page shows why.',
    }),
    b('text', 1, {
      markdown: 'Here is the argument, and it is worth following rather than memorising the result.\n\nCharging a capacitor is not one event; it is a long sequence of tiny transfers. At a moment when the capacitor already holds charge $ q $, its voltage is $ q/C $. Moving the **next** small piece $ dq $ across that voltage costs\n\n$ dW = \\frac{q}{C}\\,dq $\n\nThe key point: **the first bit of charge is free** — the capacitor is empty, the voltage is zero, no work needed. The last bit is the expensive one, pushed against the full voltage $ V $. Everything in between costs something in between.\n\nIntegrate from empty to full:\n\n$ W = \\displaystyle\\int_0^Q \\frac{q}{C}\\,dq = \\frac{Q^{2}}{2C} $',
    }),
    b('latex_block', 2, {
      latex: 'U = \\frac{Q^{2}}{2C} = \\frac{1}{2}CV^{2} = \\frac{1}{2}QV',
      label: 'Energy stored in a charged capacitor',
      note: 'Three forms of one result — use whichever matches the two quantities you were given.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'So the $ \\tfrac{1}{2} $ is an **average**. The voltage climbed steadily from $ 0 $ to $ V $ as the charge went on, so the average voltage the charge was pushed against was $ V/2 $, and the total work is $ Q \\times V/2 $.\n\nCompare: a battery holds its voltage constant, so it delivers $ QV $ with no half. That difference between them is exactly the missing energy from the opening question.\n\n**Which form to use** is a matter of what is held fixed:\n\n- **Battery connected** ($ V $ fixed) → use $ U = \\tfrac{1}{2}CV^{2} $.\n- **Battery disconnected** ($ Q $ fixed) → use $ U = \\frac{Q^{2}}{2C} $.\n\nPicking the form whose fixed quantity you actually have turns most "what happens to the energy" questions into one line.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'quantitative',
      prompt: 'A capacitor is charged and then **disconnected** from the battery. The plate separation is now doubled. What happens to the stored energy?',
      options: ['It doubles', 'It halves', 'It stays the same', 'It falls to a quarter'],
      reveal: '**It doubles.**\n\nDisconnected means $ Q $ is fixed, so use $ U = \\frac{Q^{2}}{2C} $.\n\nDoubling $ d $ halves $ C = \\varepsilon_0A/d $, and halving $ C $ in the denominator **doubles** $ U $.\n\nWhere did the extra energy come from? **From you.** The plates carry opposite charges and attract each other, so pulling them apart takes work — and that work is exactly the energy increase.\n\nRun the same question with the **battery still connected** and everything changes: now $ V $ is fixed, $ U = \\tfrac{1}{2}CV^{2} $, and halving $ C $ **halves** the energy, with the surplus going back into the battery. Same physical action, opposite answer — which is why "battery on or off?" is always the first question.',
      difficulty_level: 3,
    }),
    b('worked_example', 5, {
      label: 'the energy lost when two capacitors are joined',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 4\\ \\mu\\text{F} $ capacitor is charged to $ 100 $ V and then disconnected. It is then connected across an uncharged $ 6\\ \\mu\\text{F} $ capacitor. Find the common voltage, and the energy lost.',
      solution: '**Step 1 — what is conserved?** Charge. The capacitors form an isolated system once the battery is gone.\n\n$ Q_{\\text{total}} = C_1V_1 = 4 \\times 100 = 400\\ \\mu\\text{C} $\n\n**Step 2 — the common voltage.** Joined in parallel, they must reach the same voltage, and their capacitances add:\n\n$ V_{\\text{common}} = \\frac{Q_{\\text{total}}}{C_1+C_2} = \\frac{400}{4+6} = 40\\ \\text{V} $\n\n**Step 3 — energy before and after.**\n\n$ U_i = \\tfrac{1}{2}C_1V_1^{2} = \\tfrac{1}{2}(4\\times10^{-6})(100)^{2} = 2.0\\times10^{-2}\\ \\text{J} $\n\n$ U_f = \\tfrac{1}{2}(C_1+C_2)V^{2} = \\tfrac{1}{2}(10\\times10^{-6})(40)^{2} = 0.8\\times10^{-2}\\ \\text{J} $\n\n$ \\text{Energy lost} = 2.0\\times10^{-2} - 0.8\\times10^{-2} = 1.2\\times10^{-2}\\ \\text{J} $\n\n**Where did it go?** Into heat and electromagnetic radiation in the connecting wires as the charge surged across. And here is the striking part: **energy is always lost in this process, however good the wires** — the loss only vanishes if the two capacitors were already at the same voltage.\n\n**Watch-out.** Charge is conserved here; energy is **not**. Setting $ U_i = U_f $ is the standard wrong move on this problem.',
    }),
    b('table', 6, {
      caption: 'The three forms, and when each is easiest.',
      headers: ['Form', 'Use it when', 'Typical situation'],
      rows: [
        ['$ U = \\tfrac{1}{2}CV^{2} $', 'you know $ C $ and $ V $', 'battery connected — $ V $ is fixed'],
        ['$ U = \\frac{Q^{2}}{2C} $', 'you know $ Q $ and $ C $', 'battery disconnected — $ Q $ is fixed'],
        ['$ U = \\tfrac{1}{2}QV $', 'you know $ Q $ and $ V $', 'comparing with the battery\'s work $ QV $'],
      ],
    }),
    b('image', 7, {
      src: '',
      alt: 'Graph of voltage against charge for a charging capacitor, with the triangular area under the line shaded as the stored energy',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The energy is the area under the V–Q line — a triangle, hence the one half.',
      generation_prompt: 'Clean scientific graph on a near-black background (#0B0C0F). Thin dim-grey axes, horizontal labelled q and vertical labelled V in muted white. A straight amber line rises from the origin to a point marked at coordinates Q and V, with faint dashed grey guide lines dropping to each axis. The triangular region between the line and the horizontal axis is filled with a soft translucent amber tint and labelled in muted white as the stored energy. A thin dashed grey horizontal line at the top marks the constant battery voltage, with the rectangle above the triangle left unfilled. Generous dark space, no gridlines, no clutter.',
    }),
    b('callout', 8, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ U = \\frac{Q^{2}}{2C} = \\tfrac{1}{2}CV^{2} = \\tfrac{1}{2}QV $.\n- The $ \\tfrac{1}{2} $ is an average: the voltage climbed from $ 0 $ to $ V $ during charging.\n- The battery does $ QV $; the capacitor keeps $ \\tfrac{1}{2}QV $. The rest is heat in the circuit.\n- Battery **on** → $ V $ fixed → use $ \\tfrac{1}{2}CV^{2} $. Battery **off** → $ Q $ fixed → use $ Q^{2}/2C $.\n- Joining two capacitors: **charge** is conserved, **energy** is not.',
    }),
    b('text', 9, {
      markdown: 'Next: we have said the capacitor stores energy. But stores it *where*? The answer turns out not to be "on the plates".',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.6,
      questions: [
        q('A capacitor is charged by a battery of emf $ V $, taking a total charge $ Q $. The energy stored in the capacitor is',
          ['$ \\tfrac{1}{2}QV $, half the work done by the battery', '$ QV $, all the work done by the battery', '$ 2QV $', '$ \\tfrac{1}{4}QV $'],
          0,
          'The battery does $ QV $ because it holds its voltage constant, but the capacitor voltage rises from zero, so the charge is pushed against an average of only $ V/2 $. The difference is dissipated in the resistance of the circuit.',
          2),
        q('A charged capacitor is disconnected from its battery, and its plates are then pulled apart. The stored energy',
          ['increases', 'decreases, as the plates get further apart', 'stays the same, since $ Q $ is fixed', 'falls to zero once they are separated'],
          0,
          'With $ Q $ fixed, $ U = Q^{2}/2C $ and reducing $ C $ raises $ U $. Physically, the oppositely charged plates attract, so separating them requires work — and that work is the energy increase.',
          3),
        q('A $ 2\\ \\mu\\text{F} $ capacitor charged to $ 200 $ V is connected across an identical uncharged capacitor. The energy of the system',
          ['halves', 'stays the same', 'doubles', 'falls to a quarter'],
          0,
          'Charge is conserved, so the common voltage becomes $ 100 $ V. Initial energy $ \\tfrac{1}{2}(2)(200)^{2} $ against final $ \\tfrac{1}{2}(4)(100)^{2} $ — a ratio of $ 80000 : 40000 $. Exactly half is lost as heat in the wires, whatever their resistance.',
          3),
      ],
    }),
  ],
};

// ── p14 · Where the Energy Lives ─────────────────────────────────────────────
const p14 = {
  page_number: 14,
  slug: 'where-the-energy-lives',
  title: 'Where the Energy Lives',
  subtitle: 'Energy density, and the force pulling the plates together',
  glossary: [
    { term: 'energy density', definition: 'The electrostatic energy stored per unit volume of the field: $ u = \\tfrac{1}{2}\\varepsilon_0E^{2} $.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'It is natural to think the energy of a charged capacitor sits "on the plates", the way water sits in a tank.\n\nIt does not. The energy is in the **field** — in the apparently empty gap between the plates. Take the plates away and leave the field somehow, and you would still have the energy.\n\nThis is not a philosophical nicety. When you get to electromagnetic waves, a field will detach from its source entirely and travel across space carrying its energy with it. Sunlight is field energy that left the Sun eight minutes ago. The idea starts here.',
    }),
    b('text', 1, {
      markdown: 'Take a parallel-plate capacitor and rewrite its energy in terms of the field instead of the charge.\n\nStart from $ U = \\tfrac{1}{2}CV^{2} $, and substitute $ C = \\varepsilon_0A/d $ and $ V = Ed $:\n\n$ U = \\frac{1}{2}\\cdot\\frac{\\varepsilon_0A}{d}\\cdot(Ed)^{2} = \\frac{1}{2}\\varepsilon_0E^{2}(Ad) $\n\nAnd $ Ad $ is precisely the **volume** of the gap. So the energy per unit volume is',
    }),
    b('latex_block', 2, {
      latex: 'u = \\frac{1}{2}\\varepsilon_0 E^{2}',
      label: 'Energy density of an electric field',
      note: 'Joules per cubic metre. In a medium of dielectric constant K it becomes ½ ε₀KE².',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Two things about that formula deserve attention.\n\n**No $ Q $, no $ C $, no geometry.** It refers only to the field. That is what lets us say the energy belongs to the field rather than to the capacitor — the formula applies to *any* electric field, anywhere, whether a capacitor made it or not.\n\n**It goes as $ E^{2} $.** Double the field and you quadruple the stored energy density. And since the energy density is positive whichever way the field points, the squaring is not incidental — energy cannot be negative.\n\nFor a non-uniform field you integrate over the volume, $ U = \\int u\\,dV $. For the uniform field of a parallel-plate capacitor, energy density times volume is enough.',
    }),
    b('heading', 4, {
      text: 'The force between the plates',
      level: 2,
      objective: 'Find the attractive force between capacitor plates and explain the factor of one half in it.',
    }),
    b('text', 5, {
      markdown: 'The plates carry opposite charges, so they attract. How strongly?\n\nThe tempting answer, $ F = QE $, is **wrong** — and the reason is worth understanding. The field $ E = \\sigma/\\varepsilon_0 $ between the plates is produced by **both** plates together. A plate cannot exert a force on itself, so the field acting *on* one plate is only the half produced by the *other* plate, namely $ \\sigma/2\\varepsilon_0 $.\n\nSo the force on one plate is\n\n$ F = Q \\times \\frac{\\sigma}{2\\varepsilon_0} = \\frac{Q^{2}}{2\\varepsilon_0 A} $',
    }),
    b('latex_block', 6, {
      latex: 'F = \\frac{Q^{2}}{2\\varepsilon_0 A} = \\frac{1}{2}QE',
      label: 'Attractive force between capacitor plates',
      note: 'The half is there because a plate does not act on itself — only the OTHER plate\'s field pushes it.',
    }),
    b('text', 7, {
      markdown: 'There is a second route to the same answer that is worth seeing, because it generalises. With $ Q $ fixed, the energy is $ U = \\frac{Q^{2}}{2C} = \\frac{Q^{2}d}{2\\varepsilon_0A} $, which grows linearly with the separation $ d $. And force is the negative gradient of energy:\n\n$ F = -\\frac{dU}{dd} = -\\frac{Q^{2}}{2\\varepsilon_0A} $\n\nThe minus sign says the force acts to **reduce** $ d $ — the plates pull together — and the magnitude agrees exactly. Whenever you can write the energy as a function of a distance, differentiating it gives the force.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'quantitative',
      prompt: 'The electric field in a certain region is $ 2\\times10^{5} $ V/m. How much energy is stored in each cubic metre?',
      options: ['About $ 0.18 $ J', 'About $ 1.8 $ J', 'About $ 0.018 $ J', 'About $ 18 $ J'],
      reveal: '**About $ 0.18 $ J per cubic metre.**\n\n$ u = \\tfrac{1}{2}\\varepsilon_0E^{2} = \\tfrac{1}{2}(8.854\\times10^{-12})(2\\times10^{5})^{2} $\n\n$ = \\tfrac{1}{2}(8.854\\times10^{-12})(4\\times10^{10}) = 0.177\\ \\text{J/m}^{3} $\n\nWorth pausing on how **small** that is. A field of 200,000 V/m is respectable — about a fifteenth of the way to breaking down dry air, which needs roughly $ 3\\times10^{6} $ V/m — and a whole cubic metre of it holds under a fifth of a joule. That is roughly the energy of dropping an apple 20 cm.\n\nThis is the honest reason capacitors are poor batteries. They deliver energy magnificently fast, but they hold very little of it, because $ \\varepsilon_0 $ is tiny and $ E $ cannot be pushed past the breakdown limit of the insulator.',
      difficulty_level: 2,
    }),
    b('image', 9, {
      src: '',
      alt: 'Energy density shaded throughout the gap of a parallel-plate capacitor, with an arrow showing the plates attracting',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The energy is spread through the gap, not stored on the plates.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). Two horizontal parallel plates drawn as thin bars, the upper warm amber with plus signs and the lower cool blue with minus signs. The entire gap between them is filled with a soft translucent amber tint of even density, overlaid with evenly spaced vertical orange field arrows, and labelled in muted white as energy density u. Two bold orange arrows on the outer edges point inward — one down at the upper plate and one up at the lower plate — showing the attraction. A small note in muted white reads half epsilon E squared. Generous dark space, no clutter.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ u = \\tfrac{1}{2}\\varepsilon_0E^{2} $, in J/m³. In a dielectric, $ u = \\tfrac{1}{2}\\varepsilon_0KE^{2} $.\n- The energy lives in the **field**, not on the plates.\n- Force between plates $ = \\frac{Q^{2}}{2\\varepsilon_0A} = \\tfrac{1}{2}QE $, and it is always **attractive**.\n- The half appears because a plate feels only the *other* plate\'s field.\n- $ F = -dU/dx $ works whenever you can write $ U $ as a function of a distance.',
    }),
    b('text', 11, {
      markdown: 'Next: slide a slab of glass into the gap and everything changes — capacitance, field, energy. What changes and by how much depends entirely on one question you already know to ask.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('The energy density of an electric field is proportional to',
          ['$ E^{2} $', '$ E $', '$ 1/E $', '$ 1/E^{2} $'],
          0,
          '$ u = \\tfrac{1}{2}\\varepsilon_0E^{2} $ — doubling the field quadruples the stored energy per unit volume. The square also guarantees the density is positive whichever way the field points.',
          1),
        q('The force of attraction between the plates of a charged capacitor is $ \\tfrac{1}{2}QE $ rather than $ QE $ because',
          ['a plate does not experience its own field', 'the charge is only half on each plate', 'half the field escapes at the edges', 'the plates are separated by a vacuum'],
          0,
          'The field $ E $ in the gap is made by both plates together. One plate cannot push itself, so the field acting on it is only the half contributed by its partner — hence $ \\sigma/2\\varepsilon_0 $ instead of $ \\sigma/\\varepsilon_0 $.',
          3),
        q('The energy stored in a charged capacitor is located',
          ['in the field between the plates', 'on the surfaces of the two plates', 'in the connecting wires and leads', 'in the battery that charged it'],
          0,
          'Rewriting $ U $ purely in terms of $ E $ and the gap volume shows the energy is distributed through the field. This becomes essential later, when a field detaches from its source entirely and travels as an electromagnetic wave.',
          2),
      ],
    }),
  ],
};

// ── p15 · Dielectrics ────────────────────────────────────────────────────────
const p15 = {
  page_number: 15,
  slug: 'dielectrics',
  title: 'Dielectrics',
  subtitle: 'Fill the gap — and read the table that decides every question',
  glossary: [
    { term: 'dielectric', definition: 'An insulating material that becomes polarised in an electric field, weakening the field inside it.' },
    { term: 'polarisation', definition: 'The alignment or stretching of molecules in a dielectric so that opposite charges appear on its two faces.' },
    { term: 'dielectric strength', definition: 'The largest field a material can withstand before it breaks down and starts to conduct.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You want a larger capacitance. $ C = \\varepsilon_0A/d $ offers two routes: bigger plates, or a smaller gap. Both hit practical limits fast.\n\nThere is a third route that every real capacitor uses. What is it?',
      hint: 'The formula assumes vacuum between the plates. What if it is not vacuum?',
      reveal: '**Fill the gap with an insulator.**\n\nA slab of mica, ceramic or plastic film between the plates multiplies the capacitance by a factor $ K $ — typically 5 to 10, and for some ceramics into the thousands.\n\nAnd it does a second job at the same time: it stops the plates touching, so the gap can be made far thinner than an air gap safely could. Both effects push $ C $ up.\n\nEvery capacitor you can buy has a dielectric in it. This page is how it works.',
    }),
    b('text', 1, {
      markdown: 'Put an insulating slab in a field and its molecules **polarise** — either by stretching (each atom\'s electron cloud shifts slightly) or by rotating, if the molecules were already dipoles like water.\n\nEither way, opposite charges appear on the two faces of the slab. These are **bound** charges: they cannot flow through the material, but they sit at its surfaces and produce their own field, pointing **against** the original one.\n\nThe result is that the field inside the dielectric is reduced:\n\n$ E = \\frac{E_0}{K} $\n\nwhere $ E_0 $ is the field that would be there without the slab, and $ K $ is the **dielectric constant** of the material.',
    }),
    b('latex_block', 2, {
      latex: 'C = K\\,\\frac{\\varepsilon_0 A}{d} = KC_0',
      label: 'Capacitance with a dielectric filling the gap',
      note: 'K ≥ 1 always. K = 1 for vacuum, 1.0006 for air, ≈ 6 for mica, ≈ 80 for water.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Notice the chain of reasoning, because it is the same in every dielectric question. With the same charge on the plates, a weaker field means a smaller $ V = Ed $, and a smaller $ V $ with the same $ Q $ means a **bigger** $ C $.\n\nA dielectric brings a second benefit that is just as important in practice. Every material has a **dielectric strength** — the largest field it can take before it ionises and starts conducting. Air breaks down at about $ 3\\times10^{6} $ V/m, but mica survives around $ 10^{8} $ V/m. So a mica capacitor can take a far higher voltage in a far thinner gap.',
    }),
    b('heading', 4, {
      text: 'The table that answers every dielectric question',
      level: 2,
      objective: 'Predict what happens to Q, V, E, C and U when a dielectric is inserted, for both battery states.',
    }),
    b('text', 5, {
      markdown: 'Almost every exam question on dielectrics is the same question: *a slab is inserted — what happens to each quantity?* And the answer always depends on one thing you must establish first.\n\n> **Is the battery still connected?**\n>\n> **Battery connected** → $ V $ is fixed by the battery. $ Q $ adjusts.\n>\n> **Battery disconnected** → $ Q $ is trapped on the plates. $ V $ adjusts.\n\nIn both cases $ C $ becomes $ KC_0 $ — that is geometry and material, and no circuit can change it. Everything else follows from $ Q = CV $ and $ U = \\tfrac{1}{2}CV^{2} = Q^{2}/2C $.',
    }),
    b('table', 6, {
      caption: 'Inserting a dielectric of constant $ K $. Derive each column from Q = CV; do not memorise the table.',
      headers: ['Quantity', 'Battery CONNECTED ($ V $ fixed)', 'Battery DISCONNECTED ($ Q $ fixed)'],
      rows: [
        ['Capacitance $ C $', '$ \\times K $ (increases)', '$ \\times K $ (increases)'],
        ['Charge $ Q $', '$ \\times K $ (increases)', 'unchanged'],
        ['Voltage $ V $', 'unchanged', '$ \\div K $ (decreases)'],
        ['Field $ E $', 'unchanged ($ E = V/d $)', '$ \\div K $ (decreases)'],
        ['Energy $ U $', '$ \\times K $ (increases)', '$ \\div K $ (decreases)'],
        ['Where the energy went', 'battery supplied more', 'slab was pulled in, doing work'],
      ],
      highlight_row: [4],
    }),
    b('text', 7, {
      markdown: 'The energy row is the one that surprises people, so look at it directly.\n\n**Battery connected:** $ U = \\tfrac{1}{2}CV^{2} $ with $ V $ fixed, so $ U $ rises by $ K $. The extra energy came from the battery, which pushed more charge on.\n\n**Battery disconnected:** $ U = Q^{2}/2C $ with $ Q $ fixed, so $ U $ falls by $ K $. Energy left the system — and it left as **work done on the slab**. The field at the edge of the plates pulls the dielectric in, so the slab accelerates inward. That is a real, measurable effect: an unclamped slab is *sucked* into a charged capacitor.\n\n**In both cases the slab is pulled in.** Only the bookkeeping differs.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'logical',
      prompt: 'A capacitor is charged, then **disconnected** from the battery, and a dielectric slab of constant $ K = 4 $ is inserted. What happens to the potential difference and to the energy?',
      options: [
        '$ V $ becomes one quarter; $ U $ becomes one quarter',
        '$ V $ becomes one quarter; $ U $ becomes four times',
        '$ V $ is unchanged; $ U $ becomes four times',
        '$ V $ becomes four times; $ U $ becomes one quarter',
      ],
      reveal: '**Both drop to one quarter.**\n\nWork it in the fixed order:\n\n1. **Battery off → $ Q $ is fixed.**\n2. $ C \\to 4C $ (dielectric, always).\n3. $ V = Q/C $ → drops to $ V/4 $.\n4. $ U = Q^{2}/2C $ → drops to $ U/4 $.\n\nThe lost three quarters went into pulling the slab in — the capacitor did work on it.\n\n**Contrast with the battery left connected:** then $ V $ would be unchanged, $ Q $ would rise to $ 4Q $, and $ U $ would rise to $ 4U $, with the battery supplying all of it.\n\nSame slab, same capacitor, opposite answers. Establish the battery state before touching any formula.',
      difficulty_level: 3,
    }),
    b('worked_example', 9, {
      label: 'a slab that only partly fills the gap',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A parallel-plate capacitor has plate area $ A $ and separation $ d $. A dielectric slab of constant $ K $ and thickness $ t $ (with $ t < d $) is inserted parallel to the plates. Find the new capacitance.',
      solution: '**The trick is to see it as two capacitors in series.** The gap is now made of two layers stacked one on the other, so they carry the same charge and their voltages add — which is exactly a series combination.\n\n- The dielectric layer: thickness $ t $, capacitance $ C_1 = \\frac{K\\varepsilon_0A}{t} $\n- The remaining air layer: thickness $ (d-t) $, capacitance $ C_2 = \\frac{\\varepsilon_0A}{d-t} $\n\nIn series:\n\n$ \\frac{1}{C} = \\frac{t}{K\\varepsilon_0A} + \\frac{d-t}{\\varepsilon_0A} = \\frac{1}{\\varepsilon_0A}\\left(\\frac{t}{K} + d - t\\right) $\n\n$ C = \\frac{\\varepsilon_0A}{d - t + \\frac{t}{K}} $\n\n**Check the two limits — always do this.**\n\n- $ t = 0 $ (no slab): $ C = \\varepsilon_0A/d $. Correct.\n- $ t = d $ (fully filled): the denominator becomes $ d/K $, giving $ C = K\\varepsilon_0A/d $. Correct.\n\n**One more useful reading.** Since $ K > 1 $, the term $ t/K $ is smaller than $ t $, so the denominator is smaller than $ d $ and $ C $ is larger — a partial slab still helps. And notice the answer does not depend on *where* in the gap the slab sits, only on how thick it is.\n\n**The variation to watch for.** If the slab is inserted **sideways**, covering only part of the plate area rather than part of the gap, it becomes two capacitors in **parallel** instead, and you add them: $ C = \\frac{K\\varepsilon_0A_1}{d} + \\frac{\\varepsilon_0A_2}{d} $.',
    }),
    b('image', 10, {
      src: '',
      alt: 'A dielectric slab in a capacitor showing bound surface charges and the reduced net field',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The bound charges on the slab faces set up a field opposing the original — so the net field inside is weaker.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F). Two horizontal parallel plates as thin bars, upper warm amber with plus signs and lower cool blue with minus signs. Between them a rectangular translucent slab in a slightly lighter dark tone, its upper face carrying small cool-blue minus signs and its lower face small warm amber plus signs. Inside the slab, several long orange arrows point downward (the applied field) with shorter dimmer blue arrows pointing upward beside them (the induced field), and a single medium orange arrow labelled net field. Inside the slab a few small oval molecules are drawn stretched and aligned. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ C = KC_0 $, always — the dielectric constant multiplies the capacitance regardless of the circuit.\n- **Ask "battery connected?" first.** Connected → $ V $ fixed. Disconnected → $ Q $ fixed. Everything else follows from $ Q = CV $.\n- Battery on: $ Q $, $ U $ both $ \\times K $; $ V $, $ E $ unchanged.\n- Battery off: $ V $, $ E $, $ U $ all $ \\div K $; $ Q $ unchanged.\n- The slab is pulled **in** either way.\n- Partial slab across the gap → **series**. Partial slab across the area → **parallel**.',
    }),
    b('text', 12, {
      markdown: 'Next: everything so far has been a snapshot of a capacitor already charged. What happens during the seconds in between?',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('A dielectric slab is inserted into a capacitor that remains connected to its battery. The charge on the plates',
          ['increases by a factor $ K $', 'is unchanged', 'decreases by a factor $ K $', 'falls to zero'],
          0,
          'The battery holds $ V $ fixed and the dielectric raises $ C $ by $ K $, so $ Q = CV $ rises by $ K $ — the battery pushes extra charge onto the plates. The "unchanged" answer belongs to the disconnected case.',
          2),
        q('A charged capacitor is disconnected from its battery and a dielectric is then inserted. The electric field between the plates',
          ['decreases by a factor $ K $', 'is unchanged', 'increases by a factor $ K $', 'becomes zero'],
          0,
          'With $ Q $ fixed, the bound charges on the slab faces partly cancel the plate charges, so the net field drops to $ E_0/K $. Had the battery stayed connected, $ E = V/d $ would have been pinned and the field unchanged.',
          3),
        q('A dielectric slab of thickness $ t $ fills part of the gap $ d $ of a parallel-plate capacitor. The two regions behave as capacitors',
          ['in series, because they carry the same charge', 'in parallel, because they have the same voltage', 'independently, with no simple combination', 'in series, because they have the same voltage'],
          0,
          'The layers are stacked one above the other in the gap, so the same charge passes through both and their voltages add — the definition of series. A slab covering only part of the plate *area* would be the parallel case instead.',
          3),
      ],
    }),
  ],
};

// ── p16 · Charging and Discharging ───────────────────────────────────────────
const p16 = {
  page_number: 16,
  slug: 'charging-and-discharging',
  title: 'Charging and Discharging',
  subtitle: 'The time constant, and why every circuit has a clock in it',
  glossary: [
    { term: 'time constant', definition: 'The product $ \\tau = CR $, in seconds. The natural timescale of a capacitor-resistor circuit.' },
    { term: 'transient', definition: 'The temporary changing state of a circuit before it settles into its steady state.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'A car indicator blinks about 1.5 times a second. A camera flash recharges in a few seconds. A metronome app ticks in exact time.\n\nNone of these has a clock in it. Each has a capacitor charging through a resistor, and the **time constant** $ \\tau = CR $ is what sets the rhythm.\n\nBefore quartz crystals and microcontrollers, essentially every timing circuit ever built was a capacitor and a resistor.',
    }),
    b('text', 1, {
      markdown: 'Connect a battery of emf $ V_0 $, a resistor $ R $ and an uncharged capacitor $ C $ in series, and close the switch.\n\nAt the first instant the capacitor is empty, so it opposes nothing and the full $ V_0 $ appears across the resistor. The current starts at its maximum, $ I_0 = V_0/R $.\n\nAs charge builds up, the capacitor pushes back harder, less voltage is left for the resistor, and the current falls. Eventually the capacitor voltage equals $ V_0 $, nothing is left to drive a current, and everything stops.\n\nSolving the circuit equation gives',
    }),
    b('latex_block', 2, {
      latex: 'q(t) = q_0\\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = CR',
      label: 'Charging a capacitor through a resistor',
      note: 'q₀ = CV₀ is the final charge. The current falls as I = I₀e^(−t/τ).',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'And for **discharging** — a charged capacitor connected to a resistor with no battery — the same equation without the "filling up" part:\n\n$ q(t) = q_0\\,e^{-t/\\tau} $\n\nBoth are the same exponential, seen from opposite ends.\n\n**Check the units.** $ \\tau = CR $ has units of farad × ohm. A farad is C/V and an ohm is V/A, so the product is $ \\frac{\\text{C}}{\\text{V}}\\times\\frac{\\text{V}}{\\text{A}} = \\frac{\\text{C}}{\\text{A}} = $ **seconds**. It has to be a time — the exponent must be dimensionless.',
    }),
    b('heading', 4, {
      text: 'What the time constant actually means',
      level: 2,
      objective: 'Interpret τ physically, and use it to estimate how long a circuit takes to settle.',
    }),
    b('text', 5, {
      markdown: 'Put $ t = \\tau $ into the charging equation:\n\n$ q = q_0(1 - e^{-1}) = q_0(1 - 0.368) = 0.632\\,q_0 $\n\nSo **after one time constant the capacitor is 63% charged.** For discharging, after one time constant it has fallen to 37% of its starting value.\n\nThe useful way to think about it is that $ \\tau $ is the *scale* of the process, not its duration:',
    }),
    b('table', 6, {
      caption: 'The exponential does not finish — it just becomes too close to finished to notice.',
      headers: ['Time', 'Charged to', 'Remaining on discharge'],
      rows: [
        ['$ \\tau $', '63%', '37%'],
        ['$ 2\\tau $', '86%', '14%'],
        ['$ 3\\tau $', '95%', '5%'],
        ['$ 5\\tau $', '99.3%', '0.7%'],
        ['$ \\infty $', '100%', '0%'],
      ],
    }),
    b('text', 7, {
      markdown: 'Strictly, a capacitor never finishes charging — the exponential approaches its final value without ever reaching it. In practice engineers take **5 time constants** as "done", which is where the 0.7% figure earns its keep.\n\nOne more property worth naming: the exponential is **memoryless**. Whatever the charge is now, it takes the same $ \\tau $ to cover 63% of the remaining gap. There is no point at which it "speeds up" or "slows down" relative to what is left.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'quantitative',
      prompt: 'A $ 10\\ \\mu\\text{F} $ capacitor discharges through a $ 200\\ \\text{k}\\Omega $ resistor. Roughly how long until it is essentially fully discharged?',
      options: ['About 10 seconds', 'About 2 seconds', 'About 0.5 seconds', 'About 100 seconds'],
      reveal: '**About 10 seconds.**\n\n$ \\tau = CR = (10\\times10^{-6})(200\\times10^{3}) = 2\\ \\text{s} $\n\n"Essentially fully discharged" means about $ 5\\tau $, so around **10 seconds** — at which point 0.7% of the charge is left.\n\nThe answer "about 2 seconds" is $ \\tau $ itself, which is a very different claim: after 2 seconds the capacitor still holds **37%** of its charge. That is a lot, and it is why service manuals tell you to wait — and then to short the terminals anyway.\n\n**Practical note.** A large capacitor in a high-resistance circuit can stay dangerously charged for minutes after the power is off. The time constant is not a formality.',
      difficulty_level: 2,
    }),
    b('heading', 9, {
      text: 'The steady state — where most exam questions live',
      level: 2,
      objective: 'Analyse a circuit long after the switch closes by replacing capacitors with breaks.',
    }),
    b('text', 10, {
      markdown: 'Wait long enough and the transient is over. The capacitor stops charging, so no more charge flows onto it, so **no current flows in the branch containing it**.\n\nThat gives the single most useful rule of the page:\n\n> **In the steady state, a capacitor is an open circuit — a break in the wire.**\n\nSo to analyse any circuit "a long time after the switch is closed":\n\n1. **Delete every capacitor branch** and solve the remaining resistor circuit for the currents.\n2. **Put the capacitors back** and find the potential difference across each one from the node voltages you just calculated.\n3. $ Q = CV $ for each.\n\nAnd the mirror rule for the *first* instant: an **uncharged** capacitor has no voltage across it, so at $ t = 0 $ it behaves as a **short circuit** — a plain wire.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Charging and discharging curves for a capacitor with the time constant marked on each',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'One time constant gets you 63% of the way there — or 63% of the way down.',
      generation_prompt: 'Clean scientific graph panel on a near-black background (#0B0C0F), two graphs side by side sharing a style, thin dim-grey axes labelled t horizontally and q vertically in muted white. Left graph: an amber curve rising from the origin and flattening towards a dashed horizontal grey asymptote labelled q nought, with a faint vertical dashed line at tau and a horizontal dashed line meeting the curve there, marked 63 percent. Right graph: an amber curve falling from q nought on the vertical axis and flattening towards zero, with a vertical dashed line at tau and a horizontal marker at 37 percent. Generous dark space, orange accent, no gridlines, no clutter.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Charging: $ q = q_0(1-e^{-t/\\tau}) $. Discharging: $ q = q_0e^{-t/\\tau} $. Both with $ \\tau = CR $ seconds.\n- After $ \\tau $: 63% charged, or 37% left. After $ 5\\tau $: effectively done.\n- **Steady state → capacitor is an open circuit.** Delete the branch, solve the resistors, then find each capacitor\'s voltage.\n- At $ t = 0 $ an **uncharged** capacitor is a short circuit.\n- Current always starts at $ V_0/R $ and decays to zero — it never jumps.',
    }),
    b('text', 13, {
      markdown: 'That closes Chapter 2. You now have the whole electrostatics story twice over — once in force and field, once in energy and potential — plus the device that puts it to work.\n\nThe last page introduced something new almost in passing: a **current**, flowing while the capacitor charged. We treated it as a transient nuisance to be waited out. The next chapter treats it as the main event.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('In a C-R circuit, after one time constant a charging capacitor has reached',
          ['63% of its final charge', '37% of its final charge', '50% of its final charge', '100% of its final charge'],
          0,
          '$ q = q_0(1-e^{-1}) = 0.632q_0 $. The 37% figure is what is **left** on a discharging capacitor after the same interval — the two numbers are complements, and swapping them is the usual slip.',
          1),
        q('A long time after a switch is closed, a capacitor in a DC circuit behaves as',
          ['an open circuit', 'a short circuit', 'a resistor of value $ 1/C $', 'a battery of emf $ Q/C $'],
          0,
          'Once fully charged, no more charge flows onto it, so no current passes through that branch — which is exactly what a break in the wire does. It behaves as a short circuit only at $ t = 0 $, and only if it started uncharged.',
          2),
        q('The time constant of a circuit with $ C = 5\\ \\mu\\text{F} $ and $ R = 2\\ \\text{M}\\Omega $ is',
          ['$ 10 $ s', '$ 10 $ ms', '$ 0.1 $ s', '$ 100 $ s'],
          0,
          '$ \\tau = CR = (5\\times10^{-6})(2\\times10^{6}) = 10 $ s. The powers of ten cancel neatly here — microfarads times megohms gives seconds directly, which is a handy check.',
          1),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p13, p14, p15, p16]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
