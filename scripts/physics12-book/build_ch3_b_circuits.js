'use strict';
/**
 * Class 12 Physics · Ch.3 "Current Electricity" — pages 6–10.
 * EMF and internal resistance, series/parallel resistors, reading an unfamiliar
 * circuit, Kirchhoff's laws, and grouping of cells.
 *
 * Run: node scripts/physics12-book/build_ch3_b_circuits.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 3;

// ── p6 · What a Cell Really Does ─────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'what-a-cell-really-does',
  title: 'What a Cell Really Does',
  subtitle: 'EMF, terminal voltage, and the resistance you cannot remove',
  glossary: [
    { term: 'emf', definition: 'The energy a source gives to each unit of charge it drives round the circuit. Measured in volts, despite the name "electromotive force".' },
    { term: 'internal resistance', definition: 'The resistance of the source itself, $ r $ — inside the cell, and impossible to remove.' },
    { term: 'terminal voltage', definition: 'The potential difference actually available across the cell\'s terminals when it is delivering current.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A brand-new AA cell is labelled $ 1.5 $ V. Put a voltmeter across it and you read $ 1.5 $ V. Now connect it to a torch bulb and read again — you get about $ 1.35 $ V.\n\nThe cell has not run down in those two seconds. So where did the missing $ 0.15 $ V go?',
      hint: 'The current has to get through the inside of the cell too.',
      reveal: 'It was **used up inside the cell itself.**\n\nThe chemistry inside a cell does not sit in a perfect conductor. The electrolyte and the electrodes have resistance of their own — the **internal resistance** $ r $ — and the current has to fight through it exactly as it fights through the bulb.\n\nSo some of the energy each coulomb receives is spent before it ever leaves the cell. What is left is what you measure across the terminals.\n\nWhich means a cell has **two** voltages, and telling them apart is the whole of this page.',
    }),
    b('text', 1, {
      markdown: 'The **emf** $ \\varepsilon $ is the energy the source gives to each coulomb of charge it pushes round the circuit. Its unit is the volt, and the old name "electromotive force" is unfortunate — it is not a force at all. Read it as *energy per unit charge supplied*.\n\nThe **terminal voltage** $ V $ is what is actually available at the terminals once current is flowing. The two differ by whatever is lost inside:',
    }),
    b('latex_block', 2, {
      latex: 'V = \\varepsilon - I r',
      label: 'Terminal voltage of a cell delivering current',
      note: 'The Ir term is the potential drop inside the cell. It is lost energy, not stored energy.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Three cases fall straight out of that equation, and they are worth reading off rather than memorising.\n\n**No current drawn** ($ I = 0 $): $ V = \\varepsilon $. An open-circuit cell shows its full emf — which is why a voltmeter (which draws almost nothing) reads $ 1.5 $ V on an idle cell.\n\n**Delivering current** ($ I > 0 $): $ V < \\varepsilon $. The harder you work the cell, the further the terminal voltage sags.\n\n**Being charged** (current forced *into* the cell): $ V = \\varepsilon + Ir $. Now the external supply must overcome both the cell\'s emf and its internal resistance, so the charging voltage is *above* the emf.',
    }),
    b('text', 4, {
      markdown: 'And the current in a simple circuit of a cell driving one resistor $ R $ follows from the whole loop:\n\n$ I = \\frac{\\varepsilon}{R + r} $\n\nRead that as: the emf drives the current, and it has to push through the external resistance **and** the internal resistance in series. There is no way to bypass $ r $ — it is part of the source.',
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'A cell of emf $ 1.5 $ V has internal resistance $ 0.5\\ \\Omega $. It is connected to a $ 2.5\\ \\Omega $ resistor. What is the terminal voltage?',
      options: ['$ 1.25 $ V', '$ 1.5 $ V', '$ 1.0 $ V', '$ 0.25 $ V'],
      reveal: '**1.25 V.**\n\nFirst the current, using the whole loop:\n\n$ I = \\frac{\\varepsilon}{R+r} = \\frac{1.5}{2.5+0.5} = 0.5\\ \\text{A} $\n\nThen the terminal voltage:\n\n$ V = \\varepsilon - Ir = 1.5 - (0.5)(0.5) = 1.25\\ \\text{V} $\n\n**Check it a second way.** The terminal voltage must also equal the voltage across the external resistor: $ IR = (0.5)(2.5) = 1.25 $ V. ✓ Those two routes agreeing is the standard check on this kind of problem.\n\nAnd note the trap: $ V = \\varepsilon - Ir $ needs $ I $, so you cannot skip the first step. Answering 1.5 V means treating the cell as ideal.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'The two extremes, and why they matter',
      level: 2,
      objective: 'Find the short-circuit current and the condition for maximum power transfer.',
    }),
    b('text', 7, {
      markdown: '**Short circuit** ($ R = 0 $). Connect the terminals with a plain wire and the only thing limiting the current is the internal resistance:\n\n$ I_{\\text{max}} = \\frac{\\varepsilon}{r} $\n\nFor a car battery, $ r $ is a few milliohms, so the short-circuit current runs into hundreds of amperes. That is why a spanner dropped across a car battery welds itself in place — and why the internal resistance is a safety-critical number, not a nuisance term.\n\n**Maximum power in the load.** The power delivered to $ R $ is\n\n$ P = I^{2}R = \\frac{\\varepsilon^{2}R}{(R+r)^{2}} $\n\nDifferentiate and set to zero, and the maximum comes at',
    }),
    b('latex_block', 8, {
      latex: 'R = r \\qquad\\Rightarrow\\qquad P_{\\max} = \\frac{\\varepsilon^{2}}{4r}',
      label: 'Maximum power transfer',
      note: 'Matched load. Note the efficiency at this point is only 50% — half the power is wasted inside the source.',
    }),
    b('text', 9, {
      markdown: 'That result surprises people twice over. First, the best load is not the smallest possible one — a very small $ R $ gives a big current but almost no voltage across it. Second, at maximum power the efficiency is only **50%**, because $ R = r $ means equal power is dissipated inside the source.\n\nSo maximum power and maximum efficiency are different goals. Audio amplifiers are matched for power. Power stations are emphatically not — they run with $ R \\gg r $ to keep efficiency high, and accept less than the theoretical maximum power.',
    }),
    b('worked_example', 10, {
      label: 'measuring a cell from two readings',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A cell drives $ 0.5 $ A through an external resistance of $ 4\\ \\Omega $, and $ 0.25 $ A through $ 9\\ \\Omega $. Find its emf and internal resistance.',
      solution: 'Two unknowns, so two equations. Use $ \\varepsilon = I(R+r) $ for each measurement.\n\n**First reading:** $ \\varepsilon = 0.5(4 + r) = 2 + 0.5r $\n\n**Second reading:** $ \\varepsilon = 0.25(9 + r) = 2.25 + 0.25r $\n\nThe emf is a property of the cell, so it is the same in both. Set them equal:\n\n$ 2 + 0.5r = 2.25 + 0.25r $\n\n$ 0.25r = 0.25 \\quad\\Rightarrow\\quad r = 1\\ \\Omega $\n\nSubstituting back:\n\n$ \\varepsilon = 2 + 0.5(1) = 2.5\\ \\text{V} $\n\n**Check both readings.** With $ \\varepsilon = 2.5 $ V and $ r = 1\\ \\Omega $: $ I = 2.5/5 = 0.5 $ A ✓ and $ I = 2.5/10 = 0.25 $ A ✓.\n\n**Why this problem exists.** You cannot measure $ r $ directly with a meter — it is buried inside the cell. Two loaded readings and simultaneous equations is how it is actually done in a laboratory, and it is the same idea a potentiometer uses more precisely later in this chapter.',
    }),
    b('image', 11, {
      src: '',
      alt: 'A real cell drawn as an ideal emf in series with its internal resistance, driving an external resistor',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'A real cell is an ideal source plus a resistance you cannot get at.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), drawn in thin dim-grey line art. A dashed grey rectangle encloses two elements in series to represent one real cell: a battery symbol in warm amber labelled epsilon, and a resistor zigzag labelled r. The dashed box is labelled inside the cell in muted white. Outside the box, wires run to a second resistor zigzag in amber labelled R. A small orange arrow on the wire marks the current direction, and a voltmeter symbol is drawn across the terminals of the dashed box labelled V. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ V = \\varepsilon - Ir $ when discharging; $ V = \\varepsilon + Ir $ when being charged.\n- $ V = \\varepsilon $ only when $ I = 0 $ — an open-circuit reading gives the emf.\n- $ I = \\frac{\\varepsilon}{R+r} $ for a single cell and one resistor.\n- Short circuit: $ I_{\\max} = \\varepsilon/r $. This is a safety number, not a curiosity.\n- Maximum power when $ R = r $, giving $ P_{\\max} = \\varepsilon^{2}/4r $ — but only 50% efficiency.',
    }),
    b('text', 13, {
      markdown: 'Next: circuits rarely have one resistor. Two rules handle most of them — and both come from asking what is shared.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('The terminal voltage of a cell equals its emf when',
          ['no current is being drawn from it', 'it is delivering maximum current', 'its internal resistance is very large', 'it is being charged'],
          0,
          '$ V = \\varepsilon - Ir $, so the two agree only when $ I = 0 $. This is why a voltmeter — which draws almost no current — reads the emf of an idle cell.',
          1),
        q('A cell of emf $ \\varepsilon $ and internal resistance $ r $ delivers maximum power to an external resistance $ R $ when',
          ['$ R = r $', '$ R = 0 $', '$ R \\gg r $', '$ R = 2r $'],
          0,
          'Maximising $ P = \\varepsilon^{2}R/(R+r)^{2} $ gives $ R = r $. Note that the efficiency there is only 50%, so this is the condition for maximum *power*, never for maximum efficiency.',
          3),
        q('A cell of emf $ 2 $ V and internal resistance $ 0.4\\ \\Omega $ is short-circuited. The current is',
          ['$ 5 $ A', '$ 0.8 $ A', 'infinite', '$ 2 $ A'],
          0,
          'With $ R = 0 $, the only thing limiting the current is $ r $: $ I = \\varepsilon/r = 2/0.4 = 5 $ A. The current is not infinite precisely because internal resistance exists — which is the safety significance of $ r $.',
          2),
      ],
    }),
  ],
};

// ── p7 · Resistors in Series and Parallel ────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'resistors-in-series-and-parallel',
  title: 'Resistors in Series and Parallel',
  subtitle: 'Same two questions: what is shared, and what adds?',
  glossary: [],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'You met these rules for capacitors two chapters ago, and they come out **the opposite way round** for resistors: series adds, parallel takes reciprocals.\n\nThat is not a coincidence to be memorised. It is because a capacitor\'s defining relation is $ Q = CV $ while a resistor\'s is $ V = IR $ — the constant sits on the other side. Derive each from what is shared and both come out right without any memory work at all.',
    }),
    b('heading', 1, {
      text: 'Series — same current, voltages add',
      level: 2,
      objective: 'Derive the series rule from the fact that the current is common.',
    }),
    b('text', 2, {
      markdown: 'Resistors end to end, with nothing else joining the middle points. Charge has nowhere else to go, so **the same current passes through every one**.\n\nThe voltage drops add up to the total across the chain:\n\n$ V = V_1 + V_2 + \\cdots = IR_1 + IR_2 + \\cdots = I(R_1+R_2+\\cdots) $',
    }),
    b('latex_block', 3, {
      latex: 'R_{\\text{series}} = R_1 + R_2 + R_3 + \\cdots',
      label: 'Resistors in series',
      note: 'The total is LARGER than any individual resistor. The largest resistor takes the largest share of the voltage.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'Two consequences worth naming:\n\n- The **largest** resistor drops the **most** voltage, since $ V \\propto R $ at fixed current. In a series chain the biggest resistor is the one getting hottest.\n- A break anywhere stops the current everywhere. Old Christmas-tree lights were wired in series, which is why one dead bulb killed the whole string.',
    }),
    b('heading', 5, {
      text: 'Parallel — same voltage, currents add',
      level: 2,
      objective: 'Derive the parallel rule and use the two sanity checks that catch most errors.',
    }),
    b('text', 6, {
      markdown: 'Resistors wired between the same two nodes. Both ends of each are at the same pair of potentials, so **every one has the same voltage across it**.\n\nThe currents add, because the charge arriving at the node has to divide between the branches:\n\n$ I = I_1 + I_2 + \\cdots = \\frac{V}{R_1} + \\frac{V}{R_2} + \\cdots $',
    }),
    b('latex_block', 7, {
      latex: '\\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3} + \\cdots',
      label: 'Resistors in parallel',
      note: 'The total is SMALLER than the smallest resistor in the group. For two: R₁R₂/(R₁+R₂).',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'Two checks that catch nearly every arithmetic slip:\n\n**The answer must be smaller than the smallest resistor.** Adding a parallel path can only ever make it easier for current to flow. If you combine $ 6\\ \\Omega $ and $ 3\\ \\Omega $ and get anything above $ 3\\ \\Omega $, you have made a mistake.\n\n**$ n $ equal resistors $ R $ in parallel give $ R/n $.** Three $ 12\\ \\Omega $ resistors in parallel give $ 4\\ \\Omega $, instantly and with no fractions.\n\nAnd the branch currents divide in inverse proportion: the **smallest** resistor takes the **largest** current, which is the mirror image of the series case.',
    }),
    b('comparison_card', 9, {
      title: 'Resistors, and the capacitor comparison',
      columns: [
        {
          heading: 'Series',
          points: [
            'Same **current** through each',
            'Voltages add',
            '$ R_{\\text{eq}} = R_1 + R_2 $',
            'Total is **larger** than any one',
            'Largest $ R $ takes the largest voltage',
            '(Capacitors in series: reciprocals — the opposite)',
          ],
        },
        {
          heading: 'Parallel',
          points: [
            'Same **voltage** across each',
            'Currents add',
            '$ 1/R_{\\text{eq}} = 1/R_1 + 1/R_2 $',
            'Total is **smaller** than the smallest',
            'Smallest $ R $ takes the largest current',
            '(Capacitors in parallel: they add — the opposite)',
          ],
        },
      ],
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'quantitative',
      prompt: 'You have three $ 6\\ \\Omega $ resistors. What is the smallest resistance you can make from all three, and the largest?',
      options: ['$ 2\\ \\Omega $ and $ 18\\ \\Omega $', '$ 3\\ \\Omega $ and $ 18\\ \\Omega $', '$ 2\\ \\Omega $ and $ 12\\ \\Omega $', '$ 6\\ \\Omega $ and $ 18\\ \\Omega $'],
      reveal: '**Smallest $ 2\\ \\Omega $, largest $ 18\\ \\Omega $.**\n\n*Largest:* all three in series, $ 6+6+6 = 18\\ \\Omega $.\n\n*Smallest:* all three in parallel, and for $ n $ equal resistors that is simply $ R/n = 6/3 = 2\\ \\Omega $.\n\nThose are always the two extremes: **all-series is the maximum, all-parallel is the minimum**, and every mixed arrangement lands somewhere in between. With three resistors the mixed options are $ 6+3 = 9\\ \\Omega $ (one in series with two parallel) and $ 4\\ \\Omega $ (one parallel with two in series).\n\nSo three identical resistors give exactly four possible values: 2, 4, 9 and 18 Ω. Being able to list them is a standard exam task.',
      difficulty_level: 2,
    }),
    b('worked_example', 11, {
      label: 'a mixed network, and where the current goes',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 6\\ \\Omega $ and a $ 3\\ \\Omega $ resistor are connected in parallel, and this combination is in series with a $ 4\\ \\Omega $ resistor across a $ 12 $ V supply of negligible internal resistance. Find the total current and the current in each parallel branch.',
      solution: '**Step 1 — collapse the parallel pair.**\n\n$ R_p = \\frac{6\\times3}{6+3} = \\frac{18}{9} = 2\\ \\Omega $\n\nCheck: 2 is less than 3, the smaller of the pair. ✓\n\n**Step 2 — total resistance and total current.**\n\n$ R_{\\text{total}} = 2 + 4 = 6\\ \\Omega $\n\n$ I = \\frac{12}{6} = 2\\ \\text{A} $\n\n**Step 3 — expand back outwards.** The full $ 2 $ A flows through the $ 4\\ \\Omega $ resistor and through the parallel *combination*, so the voltage across the parallel section is\n\n$ V_p = IR_p = 2 \\times 2 = 4\\ \\text{V} $\n\nBoth branches share that 4 V:\n\n$ I_6 = \\frac{4}{6} = 0.67\\ \\text{A}, \\qquad I_3 = \\frac{4}{3} = 1.33\\ \\text{A} $\n\n**Check:** $ 0.67 + 1.33 = 2 $ A ✓, and the smaller resistor took the bigger current ✓.\n\n**The method is always this loop:** collapse inwards to get the total, then expand outwards to get individual currents and voltages.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Series and parallel resistor arrangements with current and voltage marked on each',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Series shares the current; parallel shares the voltage. Everything else follows.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, drawn in thin dim-grey line art with resistors as warm amber zigzags. Left panel labelled Series: a single loop with a battery symbol and two resistors end to end, one orange current arrow drawn on the wire and repeated identically at three points to stress that it is the same, with two small voltage brackets labelled V1 and V2 above the resistors. Right panel labelled Parallel: a battery with two resistors side by side between the same two nodes marked as small amber dots, one thick orange arrow splitting into two arrows of different thickness, and a single voltage bracket spanning both resistors labelled V. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Series:** same $ I $, voltages add, $ R_{\\text{eq}} = \\sum R $ — larger than any one.\n- **Parallel:** same $ V $, currents add, $ 1/R_{\\text{eq}} = \\sum 1/R $ — smaller than the smallest.\n- $ n $ equal resistors in parallel: $ R/n $. Two unequal: $ R_1R_2/(R_1+R_2) $.\n- Series → largest $ R $ takes most voltage. Parallel → smallest $ R $ takes most current.\n- Always sanity-check a parallel answer against "smaller than the smallest".',
    }),
    b('text', 14, {
      markdown: 'Next: what to do when a circuit is not obviously series or parallel at all. This is the page that separates people who can do circuits from people who can only do formulas.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('Three resistors of $ 2\\ \\Omega $, $ 3\\ \\Omega $ and $ 6\\ \\Omega $ are connected in parallel. The equivalent resistance is',
          ['$ 1\\ \\Omega $', '$ 11\\ \\Omega $', '$ 3.67\\ \\Omega $', '$ 2\\ \\Omega $'],
          0,
          '$ 1/R = 1/2 + 1/3 + 1/6 = 3/6+2/6+1/6 = 1 $, so $ R = 1\\ \\Omega $. It must be less than $ 2\\ \\Omega $, the smallest of the three — which rules out every other option immediately.',
          2),
        q('In a series circuit, the resistor with the largest resistance',
          ['has the largest voltage across it', 'carries the largest current', 'has the smallest voltage across it', 'dissipates the least power'],
          0,
          'The current is common in series, so $ V = IR $ makes the voltage proportional to $ R $. The same reasoning makes it the hottest resistor too, since $ P = I^{2}R $.',
          1),
        q('Adding another resistor in parallel to an existing network always',
          ['decreases the total resistance', 'increases the total resistance', 'leaves it unchanged', 'may increase or decrease it'],
          0,
          'A new parallel path gives the current an extra route, which can only make it easier to flow. This is exactly why a parallel combination is always less than its smallest member.',
          2),
      ],
    }),
  ],
};

// ── p8 · Reading a Circuit You Have Not Seen Before ──────────────────────────
const p8 = {
  page_number: 8,
  slug: 'reading-a-circuit-you-have-not-seen-before',
  title: 'Reading a Circuit You Have Not Seen Before',
  subtitle: 'Label the nodes, redraw, and the answer appears',
  glossary: [
    { term: 'node', definition: 'A point in a circuit together with every point joined to it by plain wire — all at the same potential.' },
    { term: 'short circuit', definition: 'A resistanceless path across a component, forcing its two ends to the same potential so that no current flows through it.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Here is the uncomfortable truth about circuit problems. Almost nobody gets them wrong because they misremembered $ 1/R_{\\text{eq}} = \\sum 1/R $.\n\nThey get them wrong because they decided two resistors were in parallel when they were not.\n\nSo what is the skill this page teaches, if it is not a formula?',
      hint: 'What does a wire actually do to the two points it joins?',
      reveal: '**Seeing the topology** — which components genuinely share a connection point, regardless of how the diagram is drawn.\n\nAnd the tool for it is one fact: **a resistanceless wire forces its two ends to the same potential**, so they are the same point electrically, however far apart they are drawn.\n\nLabel every such set of points with one letter. Redraw the circuit with those letters as far apart as the page allows. The series and parallel groups then become impossible to miss.\n\nThat redraw is the invisible middle step that textbook solutions usually skip — and skipping it is why the solution looks like magic.',
    }),
    b('heading', 1, {
      text: 'The method, in four steps',
      level: 2,
      objective: 'Turn any unfamiliar resistor network into an obviously series-parallel one.',
    }),
    b('text', 2, {
      markdown: '**1 · Label the nodes.** Start at one terminal. Follow every plain wire from it and give every point you reach the same letter. Move to the next unlabelled junction and repeat. Plain wires are free — length and bends mean nothing.\n\n**2 · List each component by its two nodes.** "$ 6\\ \\Omega $ from A to B", "$ 3\\ \\Omega $ from A to B", "$ 4\\ \\Omega $ from B to C". Written like this, the parallel pair is already obvious: two components with the *same* pair of letters.\n\n**3 · Redraw.** Place the nodes spread out, and hang each component between its letters. This is the step people skip, and it is the one that does the work.\n\n**4 · Collapse and expand.** Combine series and parallel groups inwards to get $ R_{\\text{eq}} $, then work back outwards for individual currents and voltages.',
    }),
    b('text', 3, {
      markdown: 'Two special cases will appear constantly once you start labelling nodes:\n\n**A short-circuited resistor carries no current.** If a plain wire connects both ends of a resistor, those ends are at the same potential, so $ V = 0 $ across it and $ I = V/R = 0 $. The resistor is doing nothing — **delete it**. All the current takes the wire.\n\n**A resistor in a dead-end branch carries no current.** If a branch leads nowhere (or to an ideal voltmeter, or to a fully charged capacitor), no current can flow along it — so it contributes no potential drop, and you can ignore it when finding the current. But be careful: it may still matter for finding a *voltage*.',
    }),
    b('image', 4, {
      src: '',
      alt: 'A resistor network drawn awkwardly, then relabelled by node and redrawn cleanly',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Identical circuit, drawn twice. The redraw is what makes the structure visible.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, both in thin dim-grey line art with resistors as warm amber zigzags. Left panel labelled Before: an awkward layout with long looping wires, one wire crossing another with a small hop, four resistors at odd angles, deliberately hard to read. Right panel labelled After: the identical network redrawn with three widely spaced nodes shown as small amber dots labelled A, B and C in muted white, two resistors clearly side by side between A and B, and the remaining resistors in a clean line from B to C. Generous dark space, orange accent, no clutter.',
    }),
    b('heading', 5, {
      text: 'Symmetry — when the redraw is still hard',
      level: 2,
      objective: 'Use a symmetry argument to delete a branch before calculating.',
    }),
    b('text', 6, {
      markdown: 'Some networks resist redrawing — a cube of resistors, a bridge, a ladder. For these there is a second tool, and it is the same one you used for capacitors:\n\n> **If two nodes are at the same potential, the component between them carries no current, and can be removed.**\n\nThe usual way to spot such a pair is symmetry. If the circuit looks identical when you reflect it about the line joining the input and output terminals, then mirror-image points must sit at equal potentials.\n\nThat is exactly the **balanced Wheatstone bridge**, which gets a full page shortly. The balance condition is\n\n$ \\frac{R_1}{R_2} = \\frac{R_3}{R_4} $\n\nand when it holds, the bridging resistor — whatever its value — can simply be crossed out.',
    }),
    b('worked_example', 7, {
      label: 'the network that looks harder than it is',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Five resistors are connected between terminals A and B: $ 10\\ \\Omega $ from A to P, $ 20\\ \\Omega $ from P to B, $ 30\\ \\Omega $ from A to Q, $ 60\\ \\Omega $ from Q to B, and $ 15\\ \\Omega $ between P and Q. Find the resistance between A and B.',
      solution: '**Step 1 — recognise the shape.** Two arms from A to B, each split at a midpoint, with a resistor bridging the two midpoints. That is a Wheatstone bridge, so check for balance before anything else.\n\n**Step 2 — test the ratios.**\n\n$ \\frac{R_{AP}}{R_{PB}} = \\frac{10}{20} = \\frac{1}{2}, \\qquad \\frac{R_{AQ}}{R_{QB}} = \\frac{30}{60} = \\frac{1}{2} $\n\nEqual — the bridge is **balanced**.\n\n**Step 3 — delete the bridge.** P and Q are at the same potential, so the $ 15\\ \\Omega $ resistor has no voltage across it and carries no current. Remove it. Its value is irrelevant; it could be anything.\n\n**Step 4 — what remains is simple.** Two series arms, in parallel with each other.\n\nUpper arm: $ 10 + 20 = 30\\ \\Omega $\n\nLower arm: $ 30 + 60 = 90\\ \\Omega $\n\nIn parallel:\n\n$ R_{AB} = \\frac{30\\times90}{30+90} = \\frac{2700}{120} = 22.5\\ \\Omega $\n\n**The habit worth building.** A five-resistor network between two terminals is almost always a bridge. **Test the ratios first.** If it balances, a hard problem becomes a two-line one; if it does not, you will need Kirchhoff — which is the next page.',
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'spatial',
      prompt: 'A resistor has a plain copper wire soldered across both of its ends. What current flows through the resistor?',
      options: ['Zero', 'The full circuit current', 'Half the circuit current', 'It depends on the resistor value'],
      reveal: '**Zero.**\n\nThe wire has no resistance, so its two ends are at the same potential. Those ends are also the two ends of the resistor — so the resistor has $ V = 0 $ across it, and $ I = V/R = 0 $.\n\nAll the current takes the wire. The resistor might as well not be there, and in a redraw you should **delete it**.\n\nThis is called **short-circuiting** the resistor, and spotting it is worth a lot of marks. Once you are labelling nodes properly it becomes obvious: a short-circuited resistor is one whose two ends carry the **same letter**.',
      difficulty_level: 2,
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Label nodes first. Every point joined by plain wire is **one** node, one letter.\n- Write each component as "value, node to node". Same pair of letters → parallel.\n- **Redraw** before calculating. It is faster than being clever.\n- A resistor with both ends on the same node is short-circuited → carries no current → delete it.\n- Five resistors between two terminals? Test $ R_1/R_2 = R_3/R_4 $ for a balanced bridge before anything else.',
    }),
    b('text', 10, {
      markdown: 'Next: for networks that genuinely will not reduce — multiple batteries, unbalanced bridges — there are two rules that always work.',
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('Two points in a circuit are joined by a resistanceless wire. Those two points',
          ['are at the same potential and count as one node', 'have a small potential difference between them', 'must carry equal currents', 'are necessarily in series'],
          0,
          'Any potential difference along a resistanceless wire would drive an infinite current, so there can be none. Treating all such points as a single labelled node is the first step of every redraw.',
          2),
        q('A resistor is short-circuited by a plain wire. In the redrawn circuit you should',
          ['delete it, since it carries no current', 'keep it, since it still has resistance', 'replace it with a wire', 'double its value'],
          0,
          'Both its ends sit at the same potential, so no current passes through it and it contributes nothing to the network. The current all flows in the wire instead.',
          2),
        q('In a **balanced** Wheatstone bridge, the resistor bridging the two midpoints',
          ['carries no current and can be removed', 'carries the largest current', 'must equal the other four', 'determines the total resistance'],
          0,
          'Balance means its two ends are at equal potential, so $ V = 0 $ across it and no current flows. Its value never enters the answer at all — which is why testing the ratios first can collapse the whole problem.',
          3),
      ],
    }),
  ],
};

// ── p9 · Kirchhoff's Two Laws ────────────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'kirchhoffs-two-laws',
  title: "Kirchhoff's Two Laws",
  subtitle: 'Charge is conserved, energy is conserved — and that is enough',
  glossary: [
    { term: "junction rule (KCL)", definition: 'The total current entering a junction equals the total current leaving it. A statement of charge conservation.' },
    { term: 'loop rule (KVL)', definition: 'The sum of potential changes round any closed loop is zero. A statement of energy conservation.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Kirchhoff\'s laws are usually presented as two circuit-analysis techniques. They are not. They are **conservation of charge** and **conservation of energy**, written for wires.\n\nThat is worth knowing because it tells you when to trust them: always. There is no circuit, however strange, in which charge appears from nowhere or energy is gained going round a loop.\n\nSeries and parallel rules are shortcuts that only work on certain shapes. These two always work.',
    }),
    b('heading', 1, {
      text: 'The junction rule — charge cannot pile up',
      level: 2,
      objective: 'Apply the junction rule with a consistent sign convention.',
    }),
    b('text', 2, {
      markdown: 'Charge cannot accumulate at a point in a wire. So whatever arrives per second must leave per second:',
    }),
    b('latex_block', 3, {
      latex: '\\sum I_{\\text{in}} = \\sum I_{\\text{out}} \\qquad\\text{or equivalently}\\qquad \\sum I = 0 \\ \\text{at a junction}',
      label: "Kirchhoff's junction rule (KCL)",
      note: 'A statement of charge conservation. Currents in are positive, currents out negative — or the reverse, consistently.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'In practice: **guess a direction for every unknown current before you start.** If your guess was backwards, the algebra returns a negative number and tells you so — which is not an error to be fixed, it is the answer.\n\nThat freedom is what makes Kirchhoff usable. You do not need to know which way the current really flows before analysing the circuit.',
    }),
    b('heading', 5, {
      text: 'The loop rule — you cannot gain energy going round',
      level: 2,
      objective: 'Apply the loop rule with correct signs for cells and resistors.',
    }),
    b('text', 6, {
      markdown: 'Walk once round any closed loop and return to where you started. You are back at the same potential, so all the rises and falls must cancel:',
    }),
    b('latex_block', 7, {
      latex: '\\sum \\Delta V = 0 \\quad\\text{round any closed loop}',
      label: "Kirchhoff's loop rule (KVL)",
      note: 'A statement of energy conservation — the electrostatic force is conservative.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'Everything now rests on getting the signs right, and there are only two rules. Pick a direction to walk round the loop — either one — and stick to it:',
    }),
    b('table', 9, {
      caption: 'The two sign rules. Nothing else is needed, and guessing is not required.',
      headers: ['Element', 'Walking through it…', 'Contributes'],
      rows: [
        ['Resistor', 'in the **same** direction as the current', '$ -IR $ (a drop)'],
        ['Resistor', '**against** the current', '$ +IR $ (a rise)'],
        ['Cell', 'from $ - $ terminal to $ + $ terminal', '$ +\\varepsilon $ (a rise)'],
        ['Cell', 'from $ + $ terminal to $ - $ terminal', '$ -\\varepsilon $ (a drop)'],
      ],
    }),
    b('text', 10, {
      markdown: 'Two points that save a lot of confusion.\n\n**The cell\'s sign has nothing to do with the current direction.** It depends only on which terminal you enter by. A cell being *charged* still contributes $ +\\varepsilon $ if you walk into its negative terminal.\n\n**The resistor\'s sign depends entirely on the current direction**, not on the cell. This is where almost all sign errors are made — decide the current direction first, mark it on the diagram with an arrow, and then read the resistor signs off the arrow.',
    }),
    b('step_solver', 11, {
      title: 'A two-loop circuit, done properly',
      problem: 'Two cells of emf $ 10 $ V and $ 4 $ V, with internal resistances $ 1\\ \\Omega $ and $ 2\\ \\Omega $, are connected in parallel across an external resistor of $ 3\\ \\Omega $. Find the current through the external resistor.',
      intro: 'Two unknown currents means two equations. Guess directions, then let the algebra correct you.',
      steps: [
        st('Let $ I_1 $ flow from the $ 10 $ V cell and $ I_2 $ from the $ 4 $ V cell, both towards the junction',
          'Guessed directions. If one is wrong, its answer will simply come out negative.'),
        st('Junction rule: $ I = I_1 + I_2 $',
          'The current through the external resistor is whatever the two cells supply between them.', {
            check: {
              kind: 'mcq',
              prompt: 'Why can we not just add the two emfs to get $ 14 $ V?',
              options: ['Because the cells are in parallel, not in series', 'Because the internal resistances are different', 'Because one cell is being charged', 'Because the external resistor is too small'],
              answer_index: 0,
              feedback_right: 'Right — emfs add only in series. In parallel the cells share the load, and the algebra has to sort out how.',
              feedback_wrong: 'Emfs add when cells are in **series**. Here they are in parallel across the same load, so each drives its own branch current and the junction rule combines them.',
            },
          }),
        st('Loop 1 ($ 10 $ V cell and the external resistor): $ 10 - 1\\,I_1 - 3I = 0 $',
          'Walk from the negative terminal of the 10 V cell: a rise of 10, a drop across its internal resistance, then a drop across the external resistor.'),
        st('Loop 2 ($ 4 $ V cell and the external resistor): $ 4 - 2\\,I_2 - 3I = 0 $',
          'The same walk round the other cell. Both loops share the external resistor, which is what couples them.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Substituting $ I = I_1 + I_2 $ into loop 1 gives $ 10 = 4I_1 + 3I_2 $. What is the coefficient of $ I_1 $?',
              blank_answer: '4',
              feedback_right: 'Yes — $ 1\\,I_1 + 3(I_1+I_2) = 4I_1 + 3I_2 $.',
              feedback_wrong: 'Expand: $ 1\\,I_1 + 3(I_1 + I_2) = I_1 + 3I_1 + 3I_2 = 4I_1 + 3I_2 $. So the coefficient is 4.',
            },
          }),
        st('$ 10 = 4I_1 + 3I_2 $ and $ 4 = 3I_1 + 5I_2 $',
          'Two equations, two unknowns. Solve them together.'),
        st('$ I_1 = 3.64\\ \\text{A}, \\quad I_2 = -1.38\\ \\text{A}, \\quad I = 2.26\\ \\text{A} $',
          'The negative $ I_2 $ is the interesting part: the 4 V cell is being **charged** by the 10 V cell, not supplying the load.'),
      ],
      now_you_try: {
        problem: 'What would happen if both cells had the same emf of $ 10 $ V?',
        answer: 'Neither cell charges the other; both supply current in the direction guessed.',
        solution: 'With equal emfs there is no reason for current to be pushed backwards through either cell, so both $ I_1 $ and $ I_2 $ come out positive.\n\nThe general lesson: in a parallel combination of unequal cells, the **stronger** cell drives current backwards through the weaker one, charging it. A negative current in a Kirchhoff answer is not a mistake — it is the circuit telling you something physical.',
      },
    }),
    b('image', 12, {
      src: '',
      alt: 'A two-loop circuit with current directions guessed and loop walk directions marked',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Mark the guessed currents and the loop directions on the diagram before writing a single equation.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), thin dim-grey line art. Two cells drawn as warm amber battery symbols on the left, side by side in parallel branches, each with a small resistor zigzag beside it for internal resistance. Both branches meet at a junction marked with an amber dot, feeding a single resistor zigzag on the right. Three orange arrows on the wires labelled I1, I2 and I in muted white. Two large faint circular arrows drawn inside the two loops showing the chosen walk direction, each with a small muted-white loop label. Generous dark space, orange accent, no clutter.',
    }),
    b('step_solver', 13, {
      title: 'The unbalanced bridge — the promise from the last page',
      problem: 'A cell of emf $ 12 $ V and negligible internal resistance is joined across A and C. Two arms run from A to C: $ 10\\ \\Omega $ from A to B then $ 40\\ \\Omega $ from B to C, and $ 30\\ \\Omega $ from A to D then $ 15\\ \\Omega $ from D to C. A galvanometer of resistance $ 10\\ \\Omega $ bridges B and D. Find the current through the galvanometer.',
      intro: 'Five resistors between two terminals, so page 8 says test the ratios first: $ \\frac{10}{40} = 0.25 $ but $ \\frac{30}{15} = 2 $. Not equal, so the bridge is **unbalanced** and the galvanometer branch cannot be crossed out.\n\nNow look for a series pair or a parallel pair. There is none. Every junction — B, D, and both terminals — has three elements meeting on it, so no two components are end to end, and no two share both of their ends. Series and parallel have simply run out.\n\nThat is not a hard case for Kirchhoff, because Kirchhoff never needed the network to be series-parallel in the first place. Three unknown currents, three independent equations.',
      steps: [
        st('Let $ I_1 $ flow A→B, $ I_2 $ flow A→D, and $ I_g $ flow B→D through the galvanometer. Then BC carries $ I_1 - I_g $ and DC carries $ I_2 + I_g $',
          'Using the junction rule at B and at D straight away is what keeps this to three unknowns rather than six. Guess the galvanometer direction as B to D; if the guess is backwards, $ I_g $ will come out negative and tell you so.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does BC carry $ I_1 - I_g $ rather than $ I_1 $?',
              options: [
                'Current is used up crossing the $ 10\\ \\Omega $ arm, so less of it arrives at B',
                'BC has the largest resistance, so it must carry the smallest current',
                'Part of $ I_1 $ turns aside at B and goes down the galvanometer branch',
                'The galvanometer draws its current straight from the cell, not from $ I_1 $',
              ],
              answer_index: 2,
              feedback_right: 'Exactly. B is a junction: everything arriving must leave, and here it leaves by two routes.',
              feedback_wrong: 'B is a junction, and the junction rule applies: $ I_1 $ arrives, and it leaves along two branches — some into the galvanometer, the rest on to C. Nothing is used up in a resistor; charge is conserved.',
            },
          }),
        st('Loop A→B→D→A: $ -10I_1 - 10I_g + 30I_2 = 0 $, so $ I_1 + I_g = 3I_2 $',
          'Walk A→B with $ I_1 $ — a drop. B→D with $ I_g $ — a drop. D→A is against $ I_2 $, so that one is a rise. No cell in this loop, so the three terms must cancel on their own.'),
        st('Loop B→C→D→B: $ -40(I_1-I_g) + 15(I_2+I_g) + 10I_g = 0 $, so $ 8I_1 = 3I_2 + 13I_g $',
          'B→C runs with the current in BC, a drop of $ 40(I_1-I_g) $. C→D runs against the current in DC, a rise of $ 15(I_2+I_g) $. D→B runs against $ I_g $, a rise of $ 10I_g $. Expand, collect, and divide through by 5.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Collect the $ I_g $ terms in that loop before simplifying: $ 40I_g + 15I_g + 10I_g $. What is the total coefficient of $ I_g $?',
              blank_answer: '65',
              feedback_right: 'Yes — $ 65I_g $, which becomes $ 13I_g $ after dividing the whole equation by 5.',
              feedback_wrong: '$ 40 + 15 + 10 = 65 $. The equation reads $ -40I_1 + 15I_2 + 65I_g = 0 $, and dividing by 5 gives $ -8I_1 + 3I_2 + 13I_g = 0 $.',
            },
          }),
        st('Loop A→B→C→cell→A: $ 12 - 10I_1 - 40(I_1-I_g) = 0 $, so $ 50I_1 - 40I_g = 12 $',
          'This is the only loop containing the cell, and it is the one that fixes the size of the answer. Walking C→A through the cell enters by the negative terminal, so the cell contributes $ +12 $.'),
        st('Substitute $ I_1 = 3I_2 - I_g $ into $ 8I_1 = 3I_2 + 13I_g $: $ 24I_2 - 8I_g = 3I_2 + 13I_g $, giving $ I_2 = I_g $ and hence $ I_1 = 2I_g $',
          'The two cell-free loops between them fix only the RATIOS of the currents — which makes sense, because nothing in them says how hard the circuit is being driven.'),
        st('Put that into the cell equation: $ 50(2I_g) - 40I_g = 12 $, so $ 60I_g = 12 $ and $ I_g = 0.2\\ \\text{A} $',
          'Positive, so the guessed direction was right: $ 0.2 $ A flows from B to D. Everything else follows — $ I_1 = 0.4 $ A, $ I_2 = 0.2 $ A, BC carries $ 0.2 $ A and DC carries $ 0.4 $ A, and the cell supplies $ 0.4 + 0.2 = 0.6 $ A.\n\n**Check it by potentials, which is a completely separate route.** Take $ V_C = 0 $, so $ V_A = 12 $ V. Then $ V_B = 12 - 10(0.4) = 8 $ V, and from the other side $ V_B = 40(0.2) = 8 $ V ✓. Likewise $ V_D = 12 - 30(0.2) = 6 $ V and $ V_D = 15(0.4) = 6 $ V ✓. The galvanometer therefore sees $ 8 - 6 = 2 $ V across $ 10\\ \\Omega $ — which is $ 0.2 $ A from B to D, exactly as the algebra said.'),
      ],
      now_you_try: {
        problem: 'Keeping everything else the same, what value of the B-to-C arm would make the galvanometer read zero?',
        answer: '$ 5\\ \\Omega $',
        solution: 'A zero galvanometer current is precisely the balance condition from page 8:\n\n$ \\frac{R_{AB}}{R_{BC}} = \\frac{R_{AD}}{R_{DC}} \\quad\\Rightarrow\\quad \\frac{10}{R_{BC}} = \\frac{30}{15} = 2 \\quad\\Rightarrow\\quad R_{BC} = 5\\ \\Omega $\n\nAnd notice what balance buys you. With no current in the bridging branch, B and D sit at the same potential, the galvanometer can be deleted, and the network collapses to two series arms in parallel — a two-line problem instead of a three-equation one.\n\nThat is why the ratio test comes first, always. Kirchhoff will get you there either way, but only one of the two routes is short.',
      },
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **KCL:** $ \\sum I_{\\text{in}} = \\sum I_{\\text{out}} $ at every junction. Charge conservation.\n- **KVL:** $ \\sum \\Delta V = 0 $ round every closed loop. Energy conservation.\n- Guess current directions freely; a negative answer means the guess was reversed.\n- Resistor sign follows the **current** direction. Cell sign follows which **terminal** you enter.\n- $ n $ unknown currents need $ n $ independent equations — count before you start solving.\n- An **unbalanced bridge** has no series pair and no parallel pair anywhere in it. There Kirchhoff is not the long way round; it is the only way.',
    }),
    b('text', 15, {
      markdown: 'Next: the two-cell problem above showed two cells fighting each other. Time to look at how cells are meant to be combined.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q("Kirchhoff's junction rule is a statement of",
          ['conservation of charge', 'conservation of energy', "Ohm's law", 'conservation of momentum'],
          0,
          'Charge cannot pile up at a point in a wire, so whatever flows in must flow out. The **loop** rule is the energy statement — the two laws express different conservation principles.',
          1),
        q('While applying the loop rule, you walk through a resistor **against** the direction of the current. The contribution is',
          ['$ +IR $', '$ -IR $', 'zero', '$ +\\varepsilon $'],
          0,
          'Walking against the current means moving from low to high potential, so it is a rise. Walking with the current gives the drop $ -IR $. The sign depends only on the current direction, never on where the cells are.',
          2),
        q('Solving a Kirchhoff problem gives one of the currents as $ -0.5 $ A. This means',
          ['it flows opposite to the assumed direction', 'a mistake has been made somewhere', 'the current is physically impossible', 'one of the resistances must be negative'],
          0,
          'The minus sign is the algebra correcting your initial guess, and the magnitude is still correct. This freedom to guess is exactly what makes the method usable on circuits you cannot read by inspection.',
          2),
      ],
    }),
  ],
};

// ── p10 · Grouping of Cells ──────────────────────────────────────────────────
const p10 = {
  page_number: 10,
  slug: 'grouping-of-cells',
  title: 'Grouping of Cells',
  subtitle: 'Series for voltage, parallel for current — and when to mix them',
  glossary: [],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You have four identical cells and one lamp. You could wire the cells all in series, all in parallel, or in two rows of two.\n\nAll three give the lamp *some* current. Which arrangement gives it the **most**, and what does the answer depend on?',
      hint: 'Compare the internal resistance of the battery you have built with the resistance of the lamp.',
      reveal: 'It depends entirely on how the lamp\'s resistance compares with the cells\' internal resistance.\n\n**Series** multiplies the emf — but it also multiplies the internal resistance. Good when the external resistance is **large**, because then the extra internal resistance hardly matters.\n\n**Parallel** keeps the emf the same but **divides** the internal resistance. Good when the external resistance is **small**, because then internal resistance is what is limiting you.\n\nAnd if the two are comparable, a **mixed** grouping beats both. This page makes that precise.',
    }),
    b('heading', 1, {
      text: 'Cells in series',
      level: 2,
      objective: 'Find the current from n cells in series and say when this grouping is the right choice.',
    }),
    b('text', 2, {
      markdown: '$ n $ identical cells, each of emf $ \\varepsilon $ and internal resistance $ r $, connected end to end so their emfs all push the same way. The emfs add, and so do the internal resistances:\n\n$ \\varepsilon_{\\text{eq}} = n\\varepsilon, \\qquad r_{\\text{eq}} = nr $\n\nso',
    }),
    b('latex_block', 3, {
      latex: 'I = \\frac{n\\varepsilon}{R + nr}',
      label: 'n identical cells in series',
      note: 'If R ≫ nr this is nearly nI₀ — n times the single-cell current. Series wins with a large external resistance.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'The condition is worth reading off the formula. If $ R \\gg nr $, the $ nr $ in the denominator is negligible and $ I \\approx n\\varepsilon/R $ — you really do get $ n $ times the current.\n\nBut if $ R \\ll nr $, the denominator is dominated by $ nr $ and $ I \\approx \\varepsilon/r $, the same as a single cell. Adding cells in series then buys you nothing at all.\n\n**One warning about polarity.** If one of the $ n $ cells is inserted backwards, its emf subtracts while its internal resistance still adds. With $ n $ cells and one reversed, the total emf becomes $ (n-2)\\varepsilon $, not $ (n-1)\\varepsilon $ — you lose it twice, once for the missing push and once for the opposing one.',
    }),
    b('heading', 5, {
      text: 'Cells in parallel',
      level: 2,
      objective: 'Find the current from m cells in parallel and say when this grouping wins.',
    }),
    b('text', 6, {
      markdown: '$ m $ identical cells side by side, all positive terminals joined and all negative terminals joined. The emf is unchanged — they are not helping each other push — but the internal resistances are now in parallel:\n\n$ \\varepsilon_{\\text{eq}} = \\varepsilon, \\qquad r_{\\text{eq}} = \\frac{r}{m} $\n\nso',
    }),
    b('latex_block', 7, {
      latex: 'I = \\frac{\\varepsilon}{R + r/m} = \\frac{m\\varepsilon}{mR + r}',
      label: 'm identical cells in parallel',
      note: 'If R is small, I ≈ mε/r — m times the single-cell current, because m cells share the work. If R is large, I ≈ ε/R and the extra cells achieve nothing. And only ever parallel cells of MATCHED emf: as the Kirchhoff example showed, a fresh cell paralleled with a flat one pours current backwards into the flat one instead of into the load.',
      highlight: true,
    }),
    b('comparison_card', 9, {
      title: 'Which grouping, and when',
      columns: [
        {
          heading: 'Series ($ n $ cells)',
          points: [
            '$ \\varepsilon_{\\text{eq}} = n\\varepsilon $, $ r_{\\text{eq}} = nr $',
            '$ I = \\frac{n\\varepsilon}{R+nr} $',
            'Use when $ R \\gg r $ — a **high**-resistance load',
            'Approaches $ n $ times the single-cell current',
            'One reversed cell costs you $ 2\\varepsilon $',
          ],
        },
        {
          heading: 'Parallel ($ m $ cells)',
          points: [
            '$ \\varepsilon_{\\text{eq}} = \\varepsilon $, $ r_{\\text{eq}} = r/m $',
            '$ I = \\frac{m\\varepsilon}{mR+r} $',
            'Use when $ R \\ll r $ — a **low**-resistance load',
            'Approaches $ m $ times the single-cell current',
            'Only ever parallel cells of matched emf',
          ],
        },
      ],
    }),
    b('heading', 10, {
      text: 'Mixed grouping — the best of both',
      level: 2,
      objective: 'State the condition for maximum current from a mixed array of cells.',
    }),
    b('text', 11, {
      markdown: 'Now take $ N $ cells and arrange them as $ m $ parallel rows of $ n $ cells each, so $ N = mn $.\n\nEach row is $ n $ cells in series: emf $ n\\varepsilon $, internal resistance $ nr $. Then $ m $ such rows in parallel:\n\n$ \\varepsilon_{\\text{eq}} = n\\varepsilon, \\qquad r_{\\text{eq}} = \\frac{nr}{m} $\n\n$ I = \\frac{n\\varepsilon}{R + \\frac{nr}{m}} = \\frac{mn\\varepsilon}{mR + nr} $\n\nMaximising this over the possible arrangements gives a clean condition:',
    }),
    b('latex_block', 12, {
      latex: 'nr = mR \\qquad\\text{i.e.}\\qquad R = \\frac{nr}{m} = r_{\\text{eq}}',
      label: 'Condition for maximum current from a mixed grouping',
      note: 'The external resistance should match the battery\'s equivalent internal resistance — the same matching idea as maximum power transfer.',
      highlight: true,
    }),
    b('text', 13, {
      markdown: 'So the best arrangement is the one whose **equivalent internal resistance equals the external resistance**. That is the same matching principle as maximum power transfer from page 6, arrived at from a different direction — which is a good sign that it is telling you something real rather than being an algebraic accident.',
    }),
    b('reasoning_prompt', 14, {
      reasoning_type: 'quantitative',
      prompt: 'You have 24 cells, each of emf $ 1.5 $ V and internal resistance $ 0.5\\ \\Omega $, and a load of $ 3\\ \\Omega $. How should they be arranged for maximum current?',
      options: [
        '2 rows of 12 cells',
        '4 rows of 6 cells',
        'All 24 in series',
        'All 24 in parallel',
      ],
      reveal: '**2 rows of 12 cells** ($ m = 2 $, $ n = 12 $).\n\nApply the condition $ nr = mR $:\n\n$ n(0.5) = m(3) \\quad\\Rightarrow\\quad n = 6m $\n\nAnd we need $ mn = 24 $. Substituting: $ 6m^{2} = 24 $, so $ m = 2 $ and $ n = 12 $.\n\nCheck it against the alternatives, using $ I = \\frac{mn\\varepsilon}{mR+nr} $ with $ mn\\varepsilon = 36 $:\n\n- **2 rows of 12:** $ \\frac{36}{2(3)+12(0.5)} = \\frac{36}{12} = 3.0 $ A\n- 4 rows of 6: $ \\frac{36}{4(3)+6(0.5)} = \\frac{36}{15} = 2.4 $ A\n- All in series: $ \\frac{36}{3+12} = 2.4 $ A\n- All in parallel: $ \\frac{36}{72+0.5} = 0.5 $ A\n\nThe matched arrangement wins, and all-in-parallel is a disaster here because the load is large.\n\n**The method to keep:** use $ nr = mR $ to find the optimum, then confirm that $ m $ and $ n $ come out as whole numbers that multiply to the cells you actually have. When they do not, compute the nearest few arrangements and compare.',
      difficulty_level: 3,
    }),
    b('image', 15, {
      src: '',
      alt: 'Three cell groupings: all in series, all in parallel, and a mixed array of rows',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Series stacks the emf, parallel divides the internal resistance, mixed does some of each.',
      generation_prompt: 'Clean scientific circuit diagram on a near-black background (#0B0C0F), three panels side by side separated by thin grey rules, all in thin dim-grey line art with cells as warm amber battery symbols. Panel 1 labelled Series: four cells in a single line end to end, feeding a resistor zigzag. Panel 2 labelled Parallel: four cells stacked vertically side by side between the same two nodes, feeding the same resistor. Panel 3 labelled Mixed: two rows of two cells, the rows in parallel with each other, feeding the resistor. Small muted white labels beneath each panel read n epsilon and nr, epsilon and r over m, and n epsilon and nr over m respectively. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 16, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- **Series:** $ \\varepsilon_{\\text{eq}} = n\\varepsilon $, $ r_{\\text{eq}} = nr $. Best when $ R \\gg r $.\n- **Parallel:** $ \\varepsilon_{\\text{eq}} = \\varepsilon $, $ r_{\\text{eq}} = r/m $. Best when $ R \\ll r $.\n- **Mixed** ($ m $ rows of $ n $): $ I = \\frac{mn\\varepsilon}{mR+nr} $, maximum when $ nr = mR $.\n- One cell reversed in a series chain costs $ 2\\varepsilon $, not $ \\varepsilon $.\n- Never parallel cells of different emf — the stronger one charges the weaker.',
    }),
    b('text', 17, {
      markdown: 'Next: all this current is doing work in the resistors, and that work becomes heat. Which is sometimes the point, and sometimes the problem.',
    }),
    b('inline_quiz', 18, {
      pass_threshold: 0.6,
      questions: [
        q('Cells should be connected in series rather than parallel when the external resistance is',
          ['much larger than the internal resistance', 'much smaller than the internal resistance', 'equal to the internal resistance', 'zero'],
          0,
          'With $ R \\gg nr $ the added internal resistance hardly matters, so the $ n $-fold emf comes through as an $ n $-fold current. If $ R $ were small, the $ nr $ term would swamp the gain and the extra cells would achieve nothing.',
          3),
        q('$ m $ identical cells are connected in parallel. The equivalent internal resistance is',
          ['$ r/m $', '$ mr $', '$ r $', '$ m/r $'],
          0,
          'The internal resistances are in parallel, and $ m $ equal resistances in parallel give $ r/m $. The emf stays at $ \\varepsilon $ — paralleling cells buys current capacity, not voltage.',
          1),
        q('Five identical cells are connected in series, but one is reversed. The net emf is',
          ['$ 3\\varepsilon $', '$ 4\\varepsilon $', '$ 5\\varepsilon $', '$ \\varepsilon $'],
          0,
          'The reversed cell not only fails to contribute its $ \\varepsilon $ but actively opposes with $ \\varepsilon $, so you lose $ 2\\varepsilon $ from the total of $ 5\\varepsilon $. Its internal resistance still adds, though.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p6, p7, p8, p9, p10]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
