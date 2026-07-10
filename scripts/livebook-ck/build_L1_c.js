'use strict';
/* Chemical Kinetics — Lecture 1, batch C: pages 7–10 (monitoring, rate law & order, units of k, typical rate laws + practice). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 7 ──────────────────────────────────────────────────────────────
  page(7, 'monitoring-a-reaction',
    'Catching a Reaction in the Act: How We Measure Rate',
    'You cannot put a speedometer on a flask — so you track a property that changes as the reaction runs: colour, gas volume, pressure, conductivity, or rotation of light.',
    ['chemical-kinetics', 'monitoring', 'measurement', 'colorimetry', 'conductivity', 'polarimetry'],
    [
      B.hero(
        'A reaction flask in the centre with instruments fanned around it — a colorimeter beam, a gas syringe filling, a pressure gauge, a conductivity probe and a polarimeter — all reading the same reaction',
        'Ultra-wide cinematic banner (16:5 ratio). A single glowing reaction flask at the centre on a dark bench, with measuring instruments fanned around it: a colorimeter light beam passing through it, a gas syringe filling beside it, a pressure gauge, a conductivity probe dipped in, and a polarimeter tube. Each instrument is reading the same reaction in a different way. Deep near-black background, orange accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'Unlike a car, a reaction has no speedometer. To find its rate you have to **measure a concentration at different times** — and the cleverness is choosing some property of a reactant, a product, or the mixture that changes as the reaction proceeds and that you can read off the clock. **Physical properties are usually best, because measuring them does not disturb the reaction.**'
      ),
      B.heading('The toolkit'),
      B.text(
        'Depending on the reaction, you can follow any of these:\n\n1. **Change in concentration** of a reactant or product (the direct quantity).\n2. **Colour change** — if a species absorbs light, a **colorimeter** (spectrophotometer) tracks it. Example: $\\ce{NO}$ (colourless) $+\\ \\ce{O3}$ (colourless) $\\rightarrow \\ce{NO2}$ (brown) $+\\ \\ce{O2}$ — the deepening brown measures the rate.\n3. **Volume change** — collect a gas given off and measure its volume, e.g. $\\ce{CO2}$ from marble chips and acid.\n4. **Pressure change** — for a gas-phase reaction in a closed, fixed container, the total pressure tracks the reaction.\n5. **Conductivity change** — when ions are created or destroyed. Example: the hydrolysis of $\\ce{(CH3)3CBr}$ produces $\\ce{H+}$ and $\\ce{Br-}$, so conductivity rises.\n6. **Titration** — withdraw a small sample and titrate it. Useful but **intrusive**: you remove material and you must "quench" (stop) the sample, which can disturb the reaction.\n7. **Rotation of plane-polarised light** — for chiral (optically active) species, a **polarimeter** follows the angle of rotation. This is how the inversion of cane sugar (sucrose) is tracked.'
      ),
      B.img(
        'A colorimeter setup: a light source passes a beam through a reaction cell containing a coloured solution onto a detector, with the reading rising as colour deepens over time',
        '📸 A colorimeter reads how much light a coloured species absorbs — the deeper the colour, the more product',
        'Apparatus diagram of a colorimeter following a reaction. A light source on the left sends a beam through a sample cell holding a coloured reaction mixture, onto a detector on the right that shows a reading. An arrow indicates the colour deepening over time as product forms. Label: Light source, Sample cell, Detector, Reading. Dark background (#0a0a0a), orange accent labels and arrows, clean technical illustration.'
      ),
      B.reason('logical',
        'A chemist wants to follow $\\ce{(CH3)3CBr + H2O -> (CH3)3COH + H+ + Br-}$ in solution without removing any of the mixture. Which property is the natural one to track, and why?',
        [
          'The colour, because the reaction produces a strongly coloured product',
          'The electrical conductivity, because the reaction creates ions ($\\ce{H+}$ and $\\ce{Br-}$) where there were none, so conductivity rises as it proceeds',
          'The volume of gas given off, because a gas is released',
          'The mass on a balance, because the flask gets heavier',
        ],
        'The reactants are uncharged but the products include $\\ce{H+}$ and $\\ce{Br-}$. Creating ions makes the solution conduct better, so conductivity rises steadily — a clean, non-intrusive handle on the rate. No gas is released and no strong colour appears here.',
        2
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Match the method to the change:** coloured species $\\to$ colorimetry; gas produced $\\to$ volume or pressure; ions made/destroyed $\\to$ conductivity; chiral species $\\to$ polarimetry; $\\ce{H+}$ produced $\\to$ pH.\n\n**Titration is the odd one out** — it is the only common method that is *intrusive* (you withdraw and quench a sample), so a question asking "which method disturbs the reaction" points to titration.\n\n**"Which reaction’s rate is easy to measure?"** — very fast (ionic precipitation) and very slow (rusting) reactions are hard to follow; a moderate one like $\\ce{N2 + 3H2 -> 2NH3}$ is the measurable one.'
      ),
      B.quiz([
        {
          question: 'The reaction $\\ce{NO + O3 -> NO2 + O2}$ is conveniently followed by colorimetry because:',
          options: [
            'All four of the species are brightly coloured in solution',
            'Only $\\ce{NO2}$ is brown, so the deepening colour tracks the reaction',
            'The reaction gives off a coloured gas that slowly escapes',
            'Ozone steadily changes the pH of the surrounding solution',
          ],
          correct_index: 1,
          explanation: 'Only $\\ce{NO2}$ absorbs visible light (it is brown). As it forms, the colour deepens, and a colorimeter reads that increase — a clean optical handle on the rate.',
          difficulty_level: 2,
        },
        {
          question: 'Which method of following a reaction is intrusive — it removes material from the mixture and usually needs the sample to be quenched?',
          options: [
            'Colorimetry',
            'Measuring conductivity',
            'Titration',
            'Measuring gas pressure',
          ],
          correct_index: 2,
          explanation: 'Titration requires withdrawing a sample and stopping (quenching) the reaction in it before titrating. The physical methods (colour, conductivity, pressure) read the mixture without disturbing it.',
          difficulty_level: 1,
        },
        {
          question: 'The acid-catalysed inversion of cane sugar (sucrose to glucose + fructose) is classically followed with a polarimeter because:',
          options: [
            'The mixture slowly changes colour from clear to deep brown',
            'The reaction releases a gas whose volume can be measured',
            'The species are chiral, so their rotation of polarised light changes',
            'The reaction produces ions that steadily raise the conductivity',
          ],
          correct_index: 2,
          explanation: 'Sucrose, glucose and fructose are optically active and rotate plane-polarised light by different amounts. A polarimeter tracks the changing rotation angle, giving the rate without disturbing the mixture.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 8 ──────────────────────────────────────────────────────────────
  page(8, 'rate-law-and-order',
    'Rate Law and Order of Reaction',
    'The powers in a rate law are not the coefficients in the equation — they are found by experiment. That single fact is the whole game.',
    ['chemical-kinetics', 'rate-law', 'order', 'law-of-mass-action', 'rate-constant'],
    [
      B.hero(
        'A balanced chemical equation on one side and an experiment bench on the other, with an arrow showing that the powers in the rate law come from the experiment, not the equation',
        'Ultra-wide cinematic banner (16:5 ratio). Left side: a clean balanced chemical equation glowing on a dark slate. Right side: a laboratory bench with flasks and a measuring instrument. A bold arrow runs from the bench to the equation, suggesting that the true powers in the rate law are read from experiment, not copied from the equation. Deep near-black background, orange accents, cinematic technical style. No text.'
      ),
      B.text(
        'For a reaction $a\\,\\ce{A} + b\\,\\ce{B} \\rightarrow \\text{products}$, there is a tempting guess called the **law of mass action**: that the rate is proportional to each concentration raised to its *coefficient*,\n\n$$\\text{rate} \\propto [\\ce{A}]^{a}[\\ce{B}]^{b}.$$\n\nThis guess is reliable only for a reaction that happens in a single step. For most real reactions it is simply **wrong** — and that is the central warning of this chapter.'
      ),
      B.heading('The rate law: powers come from experiment'),
      B.text(
        'What actually governs the rate is the **rate law**, found in the lab:\n\n$$\\text{rate} = k\\,[\\ce{A}]^{x}[\\ce{B}]^{y}.$$\n\nHere $x$ and $y$ are the **orders** — and they are measured, not assumed. They **may or may not** equal the coefficients $a$ and $b$. You cannot find them by staring at the equation; you change concentrations, watch what the rate does, and read $x$ and $y$ off the data.'
      ),
      B.text(
        '- $x$ is the **order with respect to A**; $y$ is the order with respect to B.\n- The **overall order** is $x + y$.\n- Orders can be whole numbers, **fractions, zero, or even negative** — chemistry has no problem with any of these. (Contrast this with *molecularity*, which we meet next lecture: that is always a positive whole number.)'
      ),
      B.callout('remember', 'When all concentrations are 1, the rate is just $k$',
        'Put every concentration equal to unity in $\\text{rate} = k[\\ce{A}]^{x}[\\ce{B}]^{y}$ and every bracket becomes 1, leaving **rate $= k$**. That is why $k$ is also called the **specific reaction rate**: it is the rate the reaction would have at unit concentration. And $k$ has a personality worth remembering — *as the reactants get used up, the rate falls, but $k$ does not care. As long as you do not change the temperature, $k$ stays exactly the same.*'
      ),
      B.worked('Worked Example — a concentration in the denominator',
        'For the reaction $\\ce{I- + OCl- -> IO- + Cl-}$ in aqueous medium, the experimentally measured rate law is\n\n$$\\text{rate} = \\frac{k\\,[\\ce{I-}][\\ce{OCl-}]}{[\\ce{OH-}]}.$$\n\nWhat is the overall order of the reaction?',
        'Do not be thrown by a concentration sitting in the **denominator**. A term downstairs simply carries a **negative power** — move it up and write its order as $-1$.\n\n**Step 1 — rewrite with all terms multiplied.**\n\n$$\\text{rate} = k\\,[\\ce{I-}]^{1}\\,[\\ce{OCl-}]^{1}\\,[\\ce{OH-}]^{-1}.$$\n\n**Step 2 — add the orders.**\n\n$$\\text{overall order} = 1 + 1 + (-1) = 1.$$\n\n**Answer: overall order = 1 (first order).** Notice this has nothing to do with the coefficients in the equation — it comes purely from the experimental rate law, and one species actually *slows* the reaction (negative order).'
      ),
      B.reason('logical',
        'For $\\ce{2NO2 + F2 -> 2NO2F}$, experiment finds $\\text{rate} = k[\\ce{NO2}][\\ce{F2}]$ — first order in each, second order overall. A student insists the rate "should" be $k[\\ce{NO2}]^2[\\ce{F2}]$ because of the coefficient 2 in front of $\\ce{NO2}$. What is the flaw?',
        [
          'No flaw — the coefficient 2 means the order in $\\ce{NO2}$ must be 2',
          'The orders in a rate law come from experiment, not from the coefficients; the measured order in $\\ce{NO2}$ is 1, whatever the equation’s coefficient says',
          'The rate law should have no powers at all',
          'The reaction must be zero order because $\\ce{F2}$ is a gas',
        ],
        'The law of mass action (powers = coefficients) holds only for single-step reactions. Here experiment gives order 1 in $\\ce{NO2}$, so the coefficient 2 is irrelevant to the rate law. Orders are measured, never copied from the balanced equation.',
        3
      ),
      B.worked('NCERT Example 4.3',
        'Calculate the overall order of a reaction with the rate law (a) Rate $= k[\\ce{A}]^{1/2}[\\ce{B}]^{3/2}$; (b) Rate $= k[\\ce{A}]^{3/2}[\\ce{B}]^{-1}$.',
        'Overall order $=$ the sum of the exponents.\n\n**(a)** $\\dfrac{1}{2} + \\dfrac{3}{2} = 2$ — **second order**.\n\n**(b)** $\\dfrac{3}{2} + (-1) = \\dfrac{1}{2}$ — **half order**. (A negative exponent still adds in algebraically.)',
        'ncert_intext'),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**The one-line rule:** *order is experimental; molecularity (next lecture) is theoretical.* Powers in the rate law are not the stoichiometric coefficients unless the reaction is a single elementary step.\n\n**Denominator species:** a concentration on the bottom of a rate law contributes a **negative order** — raise it to the power $-1$ and add. Overall order can therefore be less than you expect (the $\\ce{I-}/\\ce{OCl-}/\\ce{OH-}$ example is first order overall).\n\n**Rate $= k$ at unit concentration** ($k$ = specific reaction rate). $k$ depends only on temperature, never on concentration.'
      ),
      B.quiz([
        {
          question: 'In the rate law $\\text{rate} = k[\\ce{A}]^{x}[\\ce{B}]^{y}$, the values of $x$ and $y$ are:',
          options: [
            'Always equal to the stoichiometric coefficients of A and B',
            'Determined by experiment, and may or may not equal the coefficients',
            'Always equal to 1 for every reaction',
            'Equal to the molar masses of A and B',
          ],
          correct_index: 1,
          explanation: 'Orders are found experimentally. They match the coefficients only when the reaction is a single elementary step; in general they can differ and can even be fractional, zero or negative.',
          difficulty_level: 1,
        },
        {
          question: 'A reaction has the rate law $\\text{rate} = \\dfrac{k[\\ce{A}][\\ce{B}]}{[\\ce{C}]}$. Its overall order is:',
          options: [
            '3',
            '2',
            '1',
            '0',
          ],
          correct_index: 2,
          explanation: 'C in the denominator means order $-1$. Overall order $= 1 + 1 - 1 = 1$. A species in the denominator lowers the overall order.',
          difficulty_level: 2,
        },
        {
          question: 'Which statement about the rate constant $k$ is correct?',
          options: [
            '$k$ decreases as the reactants are gradually used up in the reaction',
            'At unit concentrations the rate equals $k$, which holds while $T$ is fixed',
            '$k$ is the same for every reaction at a given concentration value',
            '$k$ keeps the same units for reactions of every possible order',
          ],
          correct_index: 1,
          explanation: 'At unit concentrations rate $= k$ (its "specific reaction rate" meaning). $k$ depends on temperature, not on how much reactant is left — so it does not fall as the reaction proceeds. Its units do change with order (next page).',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 9 ──────────────────────────────────────────────────────────────
  page(9, 'units-of-rate-constant',
    'The Units of k Give Away the Order',
    'The rate always has the same units — but the rate constant does not. Read its units backwards and the order falls out.',
    ['chemical-kinetics', 'rate-constant', 'units', 'order', 'rate-vs-rate-constant'],
    [
      B.hero(
        'A magnifying glass hovering over the units of a rate constant on a dark slate, the units glowing and resolving into the order of the reaction',
        'Ultra-wide cinematic banner (16:5 ratio). A magnifying glass hovers over a dark slate where the units of a rate constant glow faintly; through the lens the units sharpen and resolve, with a single illuminated number emerging as if the order of the reaction were being read out like a clue. Detective mood. Deep near-black background, orange accents, cinematic technical style. No text.'
      ),
      B.text(
        'Here is a detective trick worth its weight in marks. The **rate of a reaction always has the same units** — concentration over time, $\\text{mol L}^{-1}\\text{s}^{-1}$. But the **rate constant $k$** does *not*: its units shift with the order. So if a question gives you the units of $k$ but never states the order, the units alone tell you the order.'
      ),
      B.heading('Where the units come from'),
      B.text(
        'For an $n$-th order reaction, $\\text{rate} = k[\\text{conc}]^{n}$. Rearranging, $k = \\dfrac{\\text{rate}}{[\\text{conc}]^{n}}$, so:'
      ),
      B.latex('k = \\frac{\\text{mol L}^{-1}\\,\\text{time}^{-1}}{(\\text{mol L}^{-1})^{n}} = (\\text{mol L}^{-1})^{\\,1-n}\\,\\text{time}^{-1}',
        'Units of the rate constant for order $n$',
        'The exponent $1-n$ on concentration is what makes the units of $k$ change with order.'),
      B.table('Units of $k$ for common orders (concentration in $\\text{mol L}^{-1}$, time in s)',
        ['Order $n$', 'Units of $k$', 'Read it as'],
        [
          ['0', '$\\text{mol L}^{-1}\\,\\text{s}^{-1}$', 'same as rate'],
          ['1', '$\\text{s}^{-1}$', 'just per-time'],
          ['2', '$\\text{L mol}^{-1}\\,\\text{s}^{-1}$', 'per concentration per time'],
          ['$n$', '$(\\text{mol L}^{-1})^{1-n}\\,\\text{s}^{-1}$', 'general formula'],
        ]
      ),
      B.callout('remember', 'The order detective move',
        'If a problem hands you the units of $k$ but hides the order, **work backwards**:\n\n- $k$ in $\\text{mol L}^{-1}\\text{s}^{-1}$ $\\Rightarrow$ **zero order**.\n- $k$ in $\\text{s}^{-1}$ $\\Rightarrow$ **first order**.\n- $k$ in $\\text{L mol}^{-1}\\text{s}^{-1}$ $\\Rightarrow$ **second order**.\n\nYou will use this again and again — many integrated-rate-law problems never state the order outright and expect you to spot it from the units of $k$.'
      ),
      B.worked('Worked Example — order from units',
        'The rate constant of a reaction is found to be $k = 3\\times10^{-2}\\ \\text{L mol}^{-1}\\,\\text{s}^{-1}$. What is the order of the reaction?',
        'No need for any data table — the **units of $k$ alone** settle it.\n\n**Step 1 — match the units.** $k$ has units $\\text{L mol}^{-1}\\text{s}^{-1}$, i.e. $(\\text{mol L}^{-1})^{-1}\\text{s}^{-1}$.\n\n**Step 2 — compare with the general form** $(\\text{mol L}^{-1})^{1-n}\\text{s}^{-1}$:\n\n$$1 - n = -1 \\quad\\Rightarrow\\quad n = 2.$$\n\n**Answer: second order.** The numerical value $3\\times10^{-2}$ is a red herring — only the *units* carry the order.'
      ),
      B.heading('Rate vs rate constant — keep them apart'),
      B.comparison('Rate of reaction vs Rate constant ($k$)', [
        {
          heading: 'Rate of reaction',
          points: [
            'Changes as the reaction proceeds (concentrations fall)',
            'Depends on the concentrations at that instant',
            'Units always $\\text{mol L}^{-1}\\text{s}^{-1}$ (independent of order)',
            'Is a speed — always positive',
          ],
        },
        {
          heading: 'Rate constant $k$',
          points: [
            'Fixed for a given reaction at a given temperature',
            'Does NOT depend on concentration',
            'Units depend on the order of the reaction',
            'Changes only with temperature (and catalyst)',
          ],
        },
      ]),
      B.reason('logical',
        'A first-order reaction has rate $= k[\\ce{A}]$. A student concludes: "since $k$ is a constant, the rate of a first-order reaction must also be constant throughout." Where is the mistake?',
        [
          'No mistake — a constant $k$ means a constant rate',
          'Although $k$ is constant, $[\\ce{A}]$ falls as the reaction proceeds, so the rate $k[\\ce{A}]$ falls too; only a zero-order reaction has a genuinely constant rate',
          'The rate is constant only if the temperature rises',
          'A first-order reaction has no rate constant',
        ],
        'A constant $k$ does not make the rate constant. For first order, rate $= k[\\ce{A}]$ and $[\\ce{A}]$ keeps dropping, so the rate drops. Only zero order (rate $= k$, no concentration term) has a rate that stays fixed.',
        2
      ),
      B.worked('NCERT Example 4.4',
        'Identify the reaction order from each rate constant: (i) $k = 2.3\\times10^{-5}\\ \\text{L mol}^{-1}\\text{s}^{-1}$; (ii) $k = 3\\times10^{-4}\\ \\text{s}^{-1}$.',
        '**(i)** The units $\\text{L mol}^{-1}\\text{s}^{-1}$ are those of a **second-order** rate constant.\n\n**(ii)** The units $\\text{s}^{-1}$ are those of a **first-order** rate constant.\n\nThe units of $k$ alone fix the order — no other data needed.',
        'ncert_intext'),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Units of $k$ by order:** zero $\\to \\text{mol L}^{-1}\\text{s}^{-1}$; first $\\to \\text{s}^{-1}$; second $\\to \\text{L mol}^{-1}\\text{s}^{-1}$; general $\\to (\\text{mol L}^{-1})^{1-n}\\text{s}^{-1}$. When the order is not given, the units of $k$ *are* the order.\n\n**Do not confuse:** units of *rate* never change with order; units of *$k$* always do. "The rate constant has units mol/L/s, so the rate is constant" is a double-trap — that is zero order, and even then it is the rate constant, not the rate, you reasoned from.'
      ),
      B.quiz([
        {
          question: 'A reaction has rate constant $k$ with units $\\text{s}^{-1}$. The order of the reaction is:',
          options: [
            'Zero',
            'First',
            'Second',
            'Cannot be determined from the units',
          ],
          correct_index: 1,
          explanation: 'Units $(\\text{mol L}^{-1})^{1-n}\\text{s}^{-1}$ reduce to $\\text{s}^{-1}$ when $1-n = 0$, i.e. $n = 1$. A bare per-time unit is the signature of first order.',
          difficulty_level: 1,
        },
        {
          question: 'Which quantity keeps the same units ($\\text{mol L}^{-1}\\text{s}^{-1}$) regardless of the order of the reaction?',
          options: [
            'The rate constant $k$',
            'The rate of the reaction',
            'Both the rate and the rate constant',
            'Neither',
          ],
          correct_index: 1,
          explanation: 'The rate of reaction is always concentration/time. It is the rate constant $k$ whose units shift with order.',
          difficulty_level: 2,
        },
        {
          question: 'For a reaction with $k = 2.5\\times10^{-4}\\ \\text{mol L}^{-1}\\text{s}^{-1}$, the order and the behaviour of the rate are:',
          options: [
            'First order; the rate falls as the reaction proceeds',
            'Zero order; the rate stays constant until the reactant runs out',
            'Second order; the rate rises as the reaction proceeds',
            'First order; the rate stays constant',
          ],
          correct_index: 1,
          explanation: 'Units $\\text{mol L}^{-1}\\text{s}^{-1}$ match $1-n = 1$, so $n = 0$ — zero order. For zero order, rate $= k$ is constant (independent of concentration) until the reactant is exhausted.',
          difficulty_level: 3,
        },
      ]),
    ]
  ),

  // ── PAGE 10 ─────────────────────────────────────────────────────────────
  page(10, 'rate-laws-in-the-wild',
    'Rate Laws in the Wild + Practice',
    'Real rate laws can carry fractions, products, catalysts — and can even change shape during the reaction. Then we put Lecture 1 to work on exam questions.',
    ['chemical-kinetics', 'rate-law', 'practice', 'pyq', 'order'],
    [
      B.hero(
        'A row of real reaction equations on a dark slate, each with an unexpected exponent glowing above it — fractions, a negative power, a catalyst tucked into the rate law',
        'Ultra-wide cinematic banner (16:5 ratio). A row of real chemical reaction equations floats on a dark slate; above each, an unexpected exponent glows — a fraction, a negative power, a small species marked as a catalyst — hinting that real rate laws break the tidy rules. Deep near-black background, orange accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'Now that you know orders come from experiment, look at what real reactions actually do. None of these powers could have been guessed from the equation:'
      ),
      B.table('Some experimentally measured rate laws',
        ['Reaction', 'Measured rate law', 'What is surprising'],
        [
          ['$\\ce{H2 + Cl2 ->[h\\nu] 2HCl}$', '$k[\\ce{H2}][\\ce{Cl2}]^{0}$', 'zero order in $\\ce{Cl2}$'],
          ['$\\ce{H2 + I2 -> 2HI}$', '$k[\\ce{H2}][\\ce{I2}]$', 'matches the equation (for once)'],
          ['$\\ce{H2 + Br2 -> 2HBr}$', '$\\dfrac{k[\\ce{H2}][\\ce{Br2}]^{3/2}}{[\\ce{Br2}] + k\'[\\ce{HBr}]}$', 'fractional order; product $\\ce{HBr}$ appears'],
          ['$\\ce{2O3 -> 3O2}$', '$k[\\ce{O3}]^{2}[\\ce{O2}]^{-1}$', 'the product $\\ce{O2}$ slows it (order $-1$)'],
          ['$\\ce{2SO2 + O2 ->[\\ce{NO}] 2SO3}$', '$k[\\ce{O2}][\\ce{NO}]^{2}$', 'the catalyst $\\ce{NO}$ is in the rate law'],
        ]
      ),
      B.callout('remember', 'Three things a rate law is allowed to do',
        '1. **Carry fractional or negative orders** — $\\ce{H2 + Br2}$ has a $3/2$ power; $\\ce{2O3 -> 3O2}$ has $\\ce{O2}$ to the power $-1$.\n2. **Contain a product** — in the ozone case, the product $\\ce{O2}$ actually slows the reaction.\n3. **Contain a catalyst** — $\\ce{NO}$ appears in the $\\ce{SO2}$ oxidation rate law even though it is not consumed.\n\nAnd a fourth, subtler point: the **rate law can change shape** during the reaction or with temperature and pressure, because the underlying mechanism can change. The $\\ce{H2 + Br2}$ law even looks different at the very start versus the very end of the reaction.'
      ),
      B.heading('Putting Lecture 1 to work'),
      B.worked('Practice 1 — orders from a log relation',
        'For the reaction $x\\,\\ce{A} \\rightarrow y\\,\\ce{B}$, it is found that\n\n$$\\log\\left(-\\frac{d[\\ce{A}]}{dt}\\right) = \\log\\left(\\frac{d[\\ce{B}]}{dt}\\right) + 0.3.$$\n\nFind a possible ratio $x : y$.',
        '**Step 1 — write the single rate.** For $x\\,\\ce{A} \\rightarrow y\\,\\ce{B}$,\n\n$$\\text{rate} = -\\frac{1}{x}\\frac{d[\\ce{A}]}{dt} = \\frac{1}{y}\\frac{d[\\ce{B}]}{dt}.$$\n\n**Step 2 — relate the two rates of change.** From this, $-\\dfrac{d[\\ce{A}]}{dt} = \\dfrac{x}{y}\\,\\dfrac{d[\\ce{B}]}{dt}$.\n\n**Step 3 — take logs.**\n\n$$\\log\\left(-\\frac{d[\\ce{A}]}{dt}\\right) = \\log\\left(\\frac{d[\\ce{B}]}{dt}\\right) + \\log\\frac{x}{y}.$$\n\n**Step 4 — match.** Comparing with the given relation, $\\log\\dfrac{x}{y} = 0.3 = \\log 2$, so $\\dfrac{x}{y} = 2$.\n\n**Answer:** $x : y = 2 : 1$ (e.g. $x = 2,\\ y = 1$). A neat 1-minute question — the whole thing is the $1/\\text{coefficient}$ rule plus $\\log 2 \\approx 0.3$.'
      ),
      B.worked('Practice 2 — two ways of writing the same rate',
        'For $\\ce{2N2O5 -> 4NO2 + O2}$, the rate equation can be written in two ways:\n\n$$-\\frac{d[\\ce{N2O5}]}{dt} = k[\\ce{N2O5}] \\qquad\\text{and}\\qquad +\\frac{d[\\ce{NO2}]}{dt} = k\'[\\ce{N2O5}].$$\n\nHow are $k$ and $k\'$ related?',
        '**Step 1 — use the single agreed rate.** From the stoichiometry,\n\n$$\\text{rate} = -\\frac{1}{2}\\frac{d[\\ce{N2O5}]}{dt} = +\\frac{1}{4}\\frac{d[\\ce{NO2}]}{dt}.$$\n\n**Step 2 — connect the two derivatives.** Therefore $+\\dfrac{d[\\ce{NO2}]}{dt} = 2\\left(-\\dfrac{d[\\ce{N2O5}]}{dt}\\right)$.\n\n**Step 3 — substitute the two expressions.**\n\n$$k\'[\\ce{N2O5}] = 2\\,k[\\ce{N2O5}] \\quad\\Rightarrow\\quad k\' = 2k.$$\n\n**Answer:** $k\' = 2k$ (equivalently $2k = k\'$). **Watch out:** the constant you get depends entirely on *which species* you wrote the rate against — same reaction, different $k$. Always note which species a given $k$ belongs to.'
      ),
      B.reason('logical',
        'For $\\ce{2O3 -> 3O2}$ the rate law is $k[\\ce{O3}]^{2}[\\ce{O2}]^{-1}$. As the reaction proceeds and $\\ce{O2}$ builds up, what happens to the rate (at fixed $\\ce{O3}$), and what does that reveal?',
        [
          'The rate rises, because more $\\ce{O2}$ means more product',
          'The rate falls, because $\\ce{O2}$ has a negative order — the product actually inhibits the reaction',
          'The rate is unaffected, because $\\ce{O2}$ is only a product',
          'The rate becomes negative',
        ],
        'A negative order ($-1$) for $\\ce{O2}$ means that increasing $[\\ce{O2}]$ *decreases* the rate. The product inhibits its own formation — a rate law is allowed to contain products, and they need not speed things up.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Rate laws can contain products and catalysts**, and orders can be fractional or negative — never assume "only reactants, only whole numbers."\n\n**$k$ depends on which species you write the rate against** (the $\\ce{N2O5}$ example: $k\' = 2k$). When a question gives a $k$, check the species.\n\n**Handy numbers:** $\\log 2 \\approx 0.3$, $\\log 4 \\approx 0.6$ — they turn up constantly in these short order/ratio questions.\n\n**Chapter calibration (his own words):** kinetics is a small, friendly chapter with lots of shortcuts and a great variety of PYQs — most questions reward a confident, quick read rather than heavy algebra.'
      ),
      B.quiz([
        {
          question: 'For $x\\,\\ce{A} -> y\\,\\ce{B}$, it is given that $\\log\\!\\left(-\\frac{d[\\ce{A}]}{dt}\\right) = \\log\\!\\left(\\frac{d[\\ce{B}]}{dt}\\right) + 0.3$. A possible value of $x : y$ is:',
          options: [
            '$1 : 2$',
            '$2 : 1$',
            '$1 : 1$',
            '$3 : 1$',
          ],
          correct_index: 1,
          explanation: 'From $-\\frac{d[\\ce{A}]}{dt} = \\frac{x}{y}\\frac{d[\\ce{B}]}{dt}$, taking logs gives $\\log(x/y) = 0.3 = \\log 2$, so $x/y = 2$, i.e. $2 : 1$.',
          difficulty_level: 2,
        },
        {
          question: 'For $\\ce{2N2O5 -> 4NO2 + O2}$ with $-\\frac{d[\\ce{N2O5}]}{dt} = k[\\ce{N2O5}]$ and $+\\frac{d[\\ce{NO2}]}{dt} = k\'[\\ce{N2O5}]$, the relation between $k$ and $k\'$ is:',
          options: [
            '$k = k\'$',
            '$k\' = 2k$',
            '$k\' = 4k$',
            '$k = 2k\'$',
          ],
          correct_index: 1,
          explanation: 'The single rate is $-\\frac12\\frac{d[\\ce{N2O5}]}{dt} = \\frac14\\frac{d[\\ce{NO2}]}{dt}$, so $\\frac{d[\\ce{NO2}]}{dt} = 2\\left(-\\frac{d[\\ce{N2O5}]}{dt}\\right)$, giving $k\' = 2k$.',
          difficulty_level: 3,
        },
        {
          question: 'In the rate law $k[\\ce{O3}]^{2}[\\ce{O2}]^{-1}$ for $\\ce{2O3 -> 3O2}$, the presence of $[\\ce{O2}]^{-1}$ tells you that:',
          options: [
            'Oxygen is actually a reactant in this particular reaction',
            'Building up the product $\\ce{O2}$ slows the reaction down',
            'The reaction must therefore be zero order overall',
            'The rate law for this reaction was written down incorrectly',
          ],
          correct_index: 1,
          explanation: 'A negative order in a product means that product inhibits the reaction — as $[\\ce{O2}]$ rises, the rate falls. Rate laws are allowed to contain products, with positive or negative orders.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nbatch C done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
