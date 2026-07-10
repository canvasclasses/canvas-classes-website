'use strict';
/* Chemical Kinetics — Lecture 2, batch C: pages 17–20 (gas-phase first order, H2O2/KMnO4, pseudo-first-order + ester, sucrose inversion). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 17 ─────────────────────────────────────────────────────────────
  page(17, 'gas-phase-first-order',
    'First Order in the Gas Phase: Derive It on the Spot',
    'When a gas reaction changes the number of molecules, total pressure tracks it — but you must build the pressure table yourself, every time.',
    ['chemical-kinetics', 'first-order', 'gas-phase', 'pressure', 'half-life'],
    [
      B.hero(
        'A sealed rigid flask of gas with a pressure gauge climbing as one molecule splits into two, the gauge needle rising while the reaction proceeds',
        'Ultra-wide cinematic banner (16:5 ratio). A sealed rigid glass flask containing gas, with a pressure gauge mounted on it whose needle is climbing. Inside, a faint visual of single molecules splitting into pairs, so the total number of gas molecules — and the pressure — rises as the reaction proceeds. Deep near-black background, orange gauge glow and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'For a gas-phase reaction in a sealed, rigid container, **pressure is proportional to the number of moles**, so you can follow the reaction by watching the total pressure. There is a catch the exam loves: there is **no ready-made formula**. Because the pressure change depends on the stoichiometry, you must build a small pressure table and derive the expression on the spot — every time.'
      ),
      B.heading('Building the pressure table'),
      B.text(
        'Take $\\ce{A}(g) \\rightarrow \\ce{B}(g) + \\ce{C}(g)$, starting at pressure $P_0$ of pure A. Let $P$ be the pressure of A that has reacted by time $t$:\n\n| | $\\ce{A}$ | $\\ce{B}$ | $\\ce{C}$ |\n|---|---|---|---|\n| $t = 0$ | $P_0$ | $0$ | $0$ |\n| $t = t$ | $P_0 - P$ | $P$ | $P$ |\n\nThe **total** pressure at time $t$ is $P_t = (P_0 - P) + P + P = P_0 + P$, so $P = P_t - P_0$. The pressure of A *remaining* is therefore $P_0 - P = P_0 - (P_t - P_0) = 2P_0 - P_t$. Substitute into the first-order law (pressure replaces concentration):'
      ),
      B.latex('k = \\frac{2.303}{t}\\log\\frac{P_0}{2P_0 - P_t}', 'First order, gas phase (for $\\ce{A}->\\ce{B}+\\ce{C}$)',
        'The ratio is initial pressure of reactant over pressure of reactant left ($P_0$ over $2P_0 - P_t$) — derived from this specific stoichiometry.'),
      B.callout('warning', 'It is reactant pressure over reactant pressure — never total',
        'The single most common gas-phase mistake is to plug the *total* pressure straight into $\\log\\frac{P_0}{P_t}$. The first-order law is in terms of the **reactant** only: $\\dfrac{\\text{initial pressure of reactant}}{\\text{pressure of reactant left}}$. You must extract the reactant’s leftover pressure ($2P_0 - P_t$ here) from the total. Change the stoichiometry and that expression changes — so always rebuild the table.'
      ),
      B.worked('Worked Example — keep your eyes open',
        'For $\\ce{C2H4O}(g) \\rightarrow \\ce{CH4}(g) + \\ce{CO}(g)$, the initial pressure is $P_0 = 80$ mmHg and the total pressure after 20 minutes is $120$ mmHg. Find the half-life.',
        'Before reaching for the formula, **look at the numbers.**\n\n**Step 1 — find $P$.** Total $P_t = P_0 + P$, so $120 = 80 + P$, giving $P = 40$ mmHg.\n\n**Step 2 — pressure of reactant left.** $P_0 - P = 80 - 40 = 40$ mmHg.\n\n**Step 3 — notice what just happened.** The reactant has gone from $80$ to exactly $40$ — it has **halved** — in 20 minutes. That *is* the half-life. No logarithm required.\n\n**Answer: $t_{1/2} = 20$ minutes.** **Watch out:** students dive straight into $k = \\frac{2.303}{20}\\log\\frac{80}{40}$ and grind out $k$, then $t_{1/2}$ — correct but slower, and they nearly miss that the reactant simply halved. Keep your eyes open before you compute.'
      ),
      B.reason('quantitative',
        'For a gas reaction $\\ce{A}(g) -> \\ce{B}(g) + \\ce{C}(g)$ starting at $P_0$, why is it wrong to write the first-order constant as $k = \\frac{2.303}{t}\\log\\frac{P_0}{P_t}$ using the total pressure $P_t$?',
        [
          'Because total pressure cannot be measured during a gas reaction',
          'Because the first-order law needs the pressure of the reactant left ($2P_0 - P_t$), not the total pressure, which also includes the products',
          'Because pressure can never replace concentration in a rate law',
          'Because the reaction is actually zero order in the gas phase',
        ],
        'The law is written for the reactant: initial reactant pressure over reactant pressure remaining. The total pressure $P_t$ also contains the product pressures, so using it is wrong. You must extract the reactant’s leftover pressure, $2P_0 - P_t$, from the total.',
        3
      ),
      B.worked('NCERT Example 4.6',
        'The first-order thermal decomposition $\\ce{2N2O5(g) -> 2N2O4(g) + O2(g)}$ at constant volume gives a total pressure of $0.5$ atm at $t=0$ and $0.512$ atm at $t=100$ s. Calculate the rate constant.',
        'Let $\\ce{N2O5}$ pressure fall by $2x$. Then $p_t = (0.5-2x) + 2x + x = 0.5 + x$, so $x = p_t - 0.5$.\n\nPressure of $\\ce{N2O5}$ remaining $= 0.5 - 2x = 1.5 - 2p_t$.\n\nAt $t=100$ s, $p_t = 0.512$ atm, so $p_{\\ce{N2O5}} = 1.5 - 2(0.512) = 0.476$ atm.\n\n$$k = \\frac{2.303}{t}\\log\\frac{p_i}{p_{\\ce{N2O5}}} = \\frac{2.303}{100}\\log\\frac{0.5}{0.476} = \\frac{2.303}{100}\\times 0.0216 = 4.98\\times10^{-4}\\ \\text{s}^{-1}.$$',
        'ncert_intext'),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**No memorised gas formula** — build the $P_0 / (P_0-P) / P\\dots$ table, express $P$ from $P_t$, and write the law as $\\dfrac{\\text{reactant pressure initial}}{\\text{reactant pressure left}}$. For $\\ce{A->B+C}$ that is $\\dfrac{P_0}{2P_0 - P_t}$; for $\\ce{2A->2B+C}$ it becomes $\\dfrac{P_0}{3P_0 - 2P_t}$ — different stoichiometry, different expression.\n\n**Eyes open:** if the reactant pressure has fallen to exactly half $P_0$, the elapsed time *is* the half-life — do not grind out $k$.'
      ),
      B.quiz([
        {
          question: 'For $\\ce{A}(g) -> \\ce{B}(g) + \\ce{C}(g)$ starting at pressure $P_0$, the pressure of A remaining when the total pressure is $P_t$ equals:',
          options: [
            '$P_t - P_0$',
            '$2P_0 - P_t$',
            '$P_0 + P_t$',
            '$P_t$ itself',
          ],
          correct_index: 1,
          explanation: 'Total $P_t = P_0 + P$ gives $P = P_t - P_0$ (the amount reacted). Reactant left $= P_0 - P = 2P_0 - P_t$.',
          difficulty_level: 2,
        },
        {
          question: 'In $\\ce{C2H4O} -> \\ce{CH4} + \\ce{CO}$ with $P_0 = 80$ mmHg, the total pressure reaches 120 mmHg after 20 min. The half-life is:',
          options: [
            '10 minutes',
            '20 minutes',
            '40 minutes',
            'Cannot be found without $k$',
          ],
          correct_index: 1,
          explanation: '$P = 120 - 80 = 40$, so reactant left $= 80 - 40 = 40$ — exactly half of $80$ in 20 min. The reactant halved, so $t_{1/2} = 20$ minutes; no formula needed.',
          difficulty_level: 3,
        },
        {
          question: 'Why must the gas-phase first-order expression be derived freshly for each reaction rather than memorised?',
          options: [
            'Because the value of the gas constant $R$ changes between different reactions',
            'Because total-to-reactant pressure conversion depends on the stoichiometry',
            'Because gases simply do not obey first-order reaction kinetics at all',
            'Because the reaction temperature is never held constant for a gas',
          ],
          correct_index: 1,
          explanation: 'How the total pressure relates to the reactant pressure left depends on the mole change in the equation, which differs from reaction to reaction. So the table — and the resulting expression — must be rebuilt each time.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 18 ─────────────────────────────────────────────────────────────
  page(18, 'monitoring-h2o2-decomposition',
    'A First-Order Classic: Following H₂O₂ Decomposition',
    'You cannot see hydrogen peroxide vanish — but you can titrate a sample against $\\ce{KMnO4}$, and the volume used tells you exactly how much is left.',
    ['chemical-kinetics', 'first-order', 'hydrogen-peroxide', 'titration', 'monitoring'],
    [
      B.hero(
        'A flask of hydrogen peroxide slowly bubbling oxygen, with a burette of deep purple potassium permanganate poised above a withdrawn sample',
        'Ultra-wide cinematic banner (16:5 ratio). A flask of hydrogen peroxide gently bubbling off oxygen; beside it a burette filled with deep purple potassium permanganate solution, poised over a small withdrawn sample in a conical flask. The idea: measuring an invisible decline by titration. Deep near-black background, purple burette liquid against orange accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'Hydrogen peroxide decomposes by first-order kinetics:\n\n$$\\ce{H2O2 -> H2O + 1/2 O2}.$$\n\nThe trouble is that you cannot read the concentration of $\\ce{H2O2}$ off the flask directly. The clever fix: at various times, withdraw a small sample and **titrate it against potassium permanganate ($\\ce{KMnO4}$)**, a strong oxidiser that reacts with the $\\ce{H2O2}$ still present. The volume of $\\ce{KMnO4}$ needed is a direct measure of how much $\\ce{H2O2}$ remains.'
      ),
      B.heading('Turning titre volumes into a rate constant'),
      B.text(
        'Let the volume of $\\ce{KMnO4}$ used be $V_0$ at the start and $V_t$ at time $t$. Since the titre is proportional to the $\\ce{H2O2}$ present:\n\n- $V_0 \\propto a$ (initial $\\ce{H2O2}$),\n- $V_t \\propto (a - x)$ ($\\ce{H2O2}$ left at time $t$).\n\nSubstituting these proportional volumes straight into the first-order law (the proportionality constant cancels):'
      ),
      B.latex('k = \\frac{2.303}{t}\\log\\frac{a}{a-x} = \\frac{2.303}{t}\\log\\frac{V_0}{V_t}',
        'First-order $k$ from titre volumes',
        'The volumes $V_0$ and $V_t$ stand in for the concentrations $a$ and $a-x$ — no need to know the actual concentration.'),
      B.text(
        'An alternative is to skip the titration and simply **collect the oxygen** given off, measuring its volume at different times — the volume of $\\ce{O2}$ rises as $\\ce{H2O2}$ falls, and serves the same purpose. Either way, the point is that a *measurable* quantity (titre volume or gas volume) stands in for the concentration you cannot see.'
      ),
      B.worked('Worked Example — peroxide from titres',
        'In the first-order decomposition of $\\ce{H2O2}$, the $\\ce{KMnO4}$ titre is $V_0 = 25.0$ mL at the start and $V_t = 12.5$ mL after 10 minutes. Find the half-life.',
        '**Step 1 — read the volumes as concentrations.** $V_0 = 25.0$ stands for the initial $\\ce{H2O2}$; $V_t = 12.5$ for what is left after 10 min.\n\n**Step 2 — notice the halving.** $25.0 \\to 12.5$ is exactly half, and it happened in 10 minutes.\n\n**Step 3 — that elapsed time is the half-life.** For first order, the time to halve is the half-life regardless of where you started.\n\n**Answer: $t_{1/2} = 10$ minutes** (and $k = 0.693/10 = 0.0693\\,\\text{min}^{-1}$). Once the titre has halved, you already have the half-life — the formula just confirms it.'
      ),
      B.reason('logical',
        'Why is the volume of $\\ce{KMnO4}$ used in titrating a withdrawn sample directly proportional to the amount of $\\ce{H2O2}$ remaining at that time?',
        [
          'Because $\\ce{KMnO4}$ is purple and $\\ce{H2O2}$ is colourless',
          'Because $\\ce{KMnO4}$ reacts with the $\\ce{H2O2}$ present, so more remaining $\\ce{H2O2}$ needs more $\\ce{KMnO4}$ to react with it',
          'Because $\\ce{KMnO4}$ speeds up the decomposition of $\\ce{H2O2}$',
          'Because the titre volume measures the oxygen already released',
        ],
        '$\\ce{KMnO4}$ is consumed in reacting with the $\\ce{H2O2}$ in the sample, so the volume required is proportional to how much $\\ce{H2O2}$ is still there. As the reaction proceeds and $\\ce{H2O2}$ falls, the titre falls in step — which is exactly what lets the volumes replace concentrations.',
        2
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**The volume-as-concentration trick:** for $\\ce{H2O2}$ followed by $\\ce{KMnO4}$ titration, $V_0 \\propto a$ and $V_t \\propto (a-x)$, so $k = \\dfrac{2.303}{t}\\log\\dfrac{V_0}{V_t}$. The proportionality constant cancels — you never need the real concentration.\n\n**$\\ce{H2O2}$ decomposition is first order** — a standard example to memorise alongside $\\ce{N2O5}$ and radioactive decay. If $V_t$ is half $V_0$, the elapsed time is the half-life.'
      ),
      B.quiz([
        {
          question: 'In following $\\ce{H2O2}$ decomposition by $\\ce{KMnO4}$ titration, the rate constant is given by:',
          options: [
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{V_0}{V_t}$',
            '$k = \\dfrac{V_0 - V_t}{t}$',
            '$k = \\dfrac{2.303}{t}\\log(V_0 \\, V_t)$',
            '$k = \\dfrac{V_t}{V_0 \\, t}$',
          ],
          correct_index: 0,
          explanation: 'Since $V_0 \\propto a$ and $V_t \\propto (a-x)$, substituting into the first-order law gives $k = \\frac{2.303}{t}\\log\\frac{V_0}{V_t}$.',
          difficulty_level: 2,
        },
        {
          question: 'The decomposition $\\ce{H2O2 -> H2O + 1/2 O2}$ follows which order of kinetics?',
          options: [
            'Zero order',
            'First order',
            'Second order',
            'Fractional order',
          ],
          correct_index: 1,
          explanation: '$\\ce{H2O2}$ decomposition is a standard first-order reaction, alongside $\\ce{N2O5}$ decomposition and radioactive decay.',
          difficulty_level: 1,
        },
        {
          question: 'If the $\\ce{KMnO4}$ titre falls from 25.0 mL to 12.5 mL in 10 minutes, the half-life of the $\\ce{H2O2}$ decomposition is:',
          options: [
            '5 minutes',
            '10 minutes',
            '20 minutes',
            '12.5 minutes',
          ],
          correct_index: 1,
          explanation: 'The titre (and so the $\\ce{H2O2}$) halved from 25.0 to 12.5 in 10 minutes. For first order the halving time is the half-life, so $t_{1/2} = 10$ minutes.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 19 ─────────────────────────────────────────────────────────────
  page(19, 'pseudo-first-order-and-ester-hydrolysis',
    'Pseudo-First-Order Reactions and Ester Hydrolysis',
    'A reaction that is secretly second order but behaves first order — because one reactant is so abundant its amount barely moves.',
    ['chemical-kinetics', 'pseudo-first-order', 'ester-hydrolysis', 'excess-reactant', 'titration'],
    [
      B.hero(
        'A huge tank of water beside a tiny flask of ester, an arrow showing only a few water molecules dipping into the reaction while the vast bulk stays unchanged',
        'Ultra-wide cinematic banner (16:5 ratio). On the left, an enormous tank of water; on the right, a tiny flask of ester. An arrow shows just a handful of water molecules dipping into the reaction while the vast bulk of water sits unchanged. The idea: one reactant so abundant its concentration barely moves. Deep near-black background, cool-blue water against orange accents, cinematic technical style. No text.'
      ),
      B.text(
        '**Pseudo** means *false*. A **pseudo-first-order reaction** is one that is genuinely second order — $\\text{rate} = k[\\ce{A}][\\ce{B}]$ — but *behaves* like first order, because one reactant is present in such large excess that its concentration hardly changes during the reaction.'
      ),
      B.text(
        'Suppose B is taken in huge excess. As A is consumed, B is barely dented — a patila (pot) full of water loses only a drop or two to the reaction. So $[\\ce{B}]$ stays essentially constant, and we can fold it into the rate constant:\n\n$$\\text{rate} = k[\\ce{A}][\\ce{B}] \\approx k\'[\\ce{A}], \\qquad k\' = k[\\ce{B}].$$\n\nB is so wealthy in molecules that spending a few changes nothing — so $k[\\ce{B}]$ is just another constant, and the reaction looks first order in A alone.'
      ),
      B.heading('The classic example: acid hydrolysis of an ester'),
      B.text(
        'The acid-catalysed hydrolysis of an ester is the textbook case:\n\n$$\\ce{CH3COOC2H5 + H2O ->[H+] CH3COOH + C2H5OH}.$$\n\nWater is the solvent — present in vast excess — and $\\ce{H+}$ is a catalyst, so neither changes appreciably. The reaction is therefore **pseudo-first-order in the ester**. You follow it by withdrawing samples and **titrating against a standard alkali** (the acid present keeps rising as $\\ce{CH3COOH}$ forms).'
      ),
      B.text(
        'Reading the titres takes care: let $V_0$, $V_t$ and $V_\\infty$ be the alkali volumes at the start, at time $t$, and at the end.\n\n- $V_0 \\propto b$ — only the catalyst acid present initially.\n- $V_t \\propto b + x$ — catalyst acid plus the acetic acid formed so far.\n- $V_\\infty \\propto b + a$ — catalyst acid plus all the acetic acid at completion.\n\nSo the initial ester $a \\propto (V_\\infty - V_0)$ and the ester left $a - x \\propto (V_\\infty - V_t)$. Substituting:'
      ),
      B.latex('k = \\frac{2.303}{t}\\log\\frac{V_\\infty - V_0}{V_\\infty - V_t}',
        'Pseudo-first-order $k$ for ester hydrolysis',
        'Differences of alkali titres stand in for the ester concentrations: $a = V_\\infty - V_0$ and $a - x = V_\\infty - V_t$.'),
      B.reason('logical',
        'The hydrolysis of an ester in water is fundamentally a reaction between the ester and water, yet it is treated as first order. Why does the water "disappear" from the effective rate law?',
        [
          'Because water does not really take part in the hydrolysis',
          'Because water is present in such large excess that its concentration is essentially constant, so $k[\\ce{H2O}]$ becomes a single constant and only the ester concentration varies',
          'Because water is a liquid and liquids never appear in rate laws',
          'Because the $\\ce{H+}$ catalyst replaces the water in the reaction',
        ],
        'Water genuinely reacts, but as the solvent it is in vast excess, so its concentration barely changes. The term $k[\\ce{H2O}]$ is effectively constant and merges into $k\'$, leaving a rate law that depends only on the ester — pseudo-first-order.',
        3
      ),
      B.callout('ready_to_go_beyond', 'A reaction that catalyses itself',
        'Some hydrolyses speed *up* as they go, because a **product** is itself the catalyst. The classic is the oxidation of oxalic acid by $\\ce{KMnO4}$: the $\\ce{Mn^{2+}}$ formed catalyses the very reaction that made it, so the rate graph starts slow, then suddenly accelerates. This is **autocatalysis** — worth recognising when a rate curve speeds up partway through instead of steadily slowing.'
      ),
      B.worked('NCERT Example 4.9',
        'Hydrolysis of methyl acetate in aqueous solution is followed by titrating the liberated acetic acid against $\\ce{NaOH}$. The ester concentration at different times is: $t$/min = 0, 30, 60, 90 with $C$/mol L⁻¹ = 0.8500, 0.8004, 0.7538, 0.7096. Show the reaction is pseudo-first-order and find $k\'$ (with $[\\ce{H2O}] = 55\\ \\text{mol L}^{-1}$).',
        'For pseudo first order, $k = \\dfrac{2.303}{t}\\log\\dfrac{C_0}{C}$.\n\n**At $t=30$:** $k = \\frac{2.303}{30}\\log\\frac{0.8500}{0.8004} = 2.004\\times10^{-3}\\ \\text{min}^{-1}$.\n\n**At $t=60$:** $k = \\frac{2.303}{60}\\log\\frac{0.8500}{0.7538} = 2.002\\times10^{-3}\\ \\text{min}^{-1}$.\n\n**At $t=90$:** $k = \\frac{2.303}{90}\\log\\frac{0.8500}{0.7096} = 2.005\\times10^{-3}\\ \\text{min}^{-1}$.\n\n$k$ is essentially **constant** ($\\approx 2.004\\times10^{-3}\\ \\text{min}^{-1}$), confirming first order. Since $k = k\'[\\ce{H2O}]$,\n\n$$k\' = \\frac{k}{[\\ce{H2O}]} = \\frac{2.004\\times10^{-3}}{55} = 3.64\\times10^{-5}\\ \\text{mol}^{-1}\\text{L min}^{-1}.$$',
        'ncert_intext'),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Pseudo-first-order = second order in disguise.** $\\text{rate} = k[\\ce{A}][\\ce{B}]$ with B in excess gives $k\' = k[\\ce{B}]$, so it reads as first order in A. Standard cases: ester hydrolysis (water excess) and sucrose inversion.\n\n**Ester-hydrolysis titres:** $a = V_\\infty - V_0$, $a - x = V_\\infty - V_t$, so $k = \\dfrac{2.303}{t}\\log\\dfrac{V_\\infty - V_0}{V_\\infty - V_t}$. Derive it from the $V_0/V_t/V_\\infty$ meanings rather than memorising — that way you cannot misplace a term.'
      ),
      B.quiz([
        {
          question: 'A pseudo-first-order reaction is one that:',
          options: [
            'Is truly first order but happens to look second order',
            'Is truly second order but behaves as first order in practice',
            'Has a fractional order somewhere between one and two',
            'Has no measurable rate constant associated with it',
          ],
          correct_index: 1,
          explanation: 'It is really second order, $\\text{rate} = k[\\ce{A}][\\ce{B}]$, but with B in large excess $[\\ce{B}]$ is nearly constant, so it behaves as first order in A. "Pseudo" means false — the first-order behaviour is only apparent.',
          difficulty_level: 1,
        },
        {
          question: 'In the acid hydrolysis of an ester, the reaction is pseudo-first-order because:',
          options: [
            'The ester itself is present in large excess over the water',
            'Water is in large excess and $\\ce{H+}$ is a catalyst, so only the ester varies',
            'The products are quickly removed as soon as they form',
            'The acid catalyst is slowly consumed as the reaction proceeds',
          ],
          correct_index: 1,
          explanation: 'Water is in vast excess and $\\ce{H+}$ is a catalyst, so both stay essentially constant. Only the ester concentration falls, making the reaction effectively first order in the ester.',
          difficulty_level: 2,
        },
        {
          question: 'For ester hydrolysis followed by titrating with alkali, the rate constant is:',
          options: [
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{V_0}{V_t}$',
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{V_\\infty - V_0}{V_\\infty - V_t}$',
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{V_t}{V_0}$',
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{V_\\infty - V_t}{V_\\infty - V_0}$',
          ],
          correct_index: 1,
          explanation: 'With $a = V_\\infty - V_0$ and $a - x = V_\\infty - V_t$, the first-order law gives $k = \\frac{2.303}{t}\\log\\frac{V_\\infty - V_0}{V_\\infty - V_t}$. The ratio must put the initial-ester term on top.',
          difficulty_level: 3,
        },
      ]),
    ]
  ),

  // ── PAGE 20 ─────────────────────────────────────────────────────────────
  page(20, 'inversion-of-cane-sugar',
    'The Inversion of Cane Sugar',
    'A reaction named after a twist of light: the rotation of polarised light flips sign as sucrose becomes a glucose–fructose mix.',
    ['chemical-kinetics', 'pseudo-first-order', 'sucrose', 'inversion', 'polarimetry'],
    [
      B.hero(
        'A beam of polarised light passing through a tube of sugar solution, the plane of rotation shown swinging from a right-handed angle through zero to a left-handed angle as the reaction proceeds',
        'Ultra-wide cinematic banner (16:5 ratio). A beam of polarised light passing horizontally through a long tube of sugar solution; the plane of polarisation is shown swinging from a right-handed (clockwise) angle, through vertical, to a left-handed (anticlockwise) angle as the reaction proceeds. The idea: the optical rotation flipping sign. Deep near-black background, orange light beam and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'The acid-catalysed hydrolysis of cane sugar (sucrose) is another pseudo-first-order reaction — water is in excess and $\\ce{H+}$ is the catalyst:\n\n$$\\ce{C12H22O11 + H2O ->[H+] C6H12O6 + C6H12O6}.$$\n\n(sucrose $\\rightarrow$ glucose $+$ fructose.) It is called the **inversion** of cane sugar for a striking reason: sucrose rotates plane-polarised light to the **right** (dextrorotatory, $+66.5^\\circ$), but the glucose–fructose mixture rotates it to the **left** (laevorotatory overall), because fructose’s strong left-rotation ($-92^\\circ$) outweighs glucose’s mild right-rotation ($+52.5^\\circ$). The sign of rotation *inverts* as the reaction proceeds.'
      ),
      B.heading('Following it with a polarimeter'),
      B.text(
        'A **polarimeter** measures the angle of rotation $r$ at any time. Let $r_0$, $r_t$ and $r_\\infty$ be the readings at the start, at time $t$, and at the end. The total swing in rotation is proportional to how much sugar has reacted:\n\n- $a \\propto (r_0 - r_\\infty)$ — the full change from all the sugar,\n- $a - x \\propto (r_t - r_\\infty)$ — the change still to come (sugar left).\n\nSubstituting into the first-order law:'
      ),
      B.latex('k = \\frac{2.303}{t}\\log\\frac{r_0 - r_\\infty}{r_t - r_\\infty}',
        'Pseudo-first-order $k$ for sugar inversion',
        'Differences of polarimeter readings stand in for the sugar concentrations: $a = r_0 - r_\\infty$ and $a - x = r_t - r_\\infty$.'),
      B.reason('analogical',
        'Both ester hydrolysis and sugar inversion are pseudo-first-order, yet one is followed by titration with alkali and the other by a polarimeter. What decides which method you use?',
        [
          'You always use whichever instrument is cheaper',
          'You pick a measurable property that changes as the reaction proceeds: ester hydrolysis produces acid (track it by titration), while sugar inversion changes optical rotation (track it by polarimetry)',
          'Both reactions could only ever be followed by titration',
          'The method depends on the temperature, not on the reaction',
        ],
        'The monitoring method matches the property that changes. Ester hydrolysis steadily produces acetic acid, so titration against alkali works; sugar inversion changes the optical rotation, so a polarimeter is the natural tool. Same kinetics, different observable.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**"Inversion" = sign flip of rotation:** sucrose $+66.5^\\circ$ (dextro) $\\to$ glucose $+52.5^\\circ$ + fructose $-92^\\circ$ (net laevo). The name comes from this optical inversion, not from anything "inverting" chemically.\n\n**Polarimeter formula:** $k = \\dfrac{2.303}{t}\\log\\dfrac{r_0 - r_\\infty}{r_t - r_\\infty}$ — initial-minus-final on top, current-minus-final below. Derive it from the $r_0/r_t/r_\\infty$ meanings.\n\n**Data-as-proportionality:** sugar-inversion PYQs often give half-lives at two pH values and ask for the orders — read proportionalities, do not grind numbers.'
      ),
      B.quiz([
        {
          question: 'The hydrolysis of cane sugar is called "inversion" because:',
          options: [
            'The sugar molecule physically turns inside out during the reaction',
            'The optical rotation changes sign, from dextro sucrose to a net laevo product',
            'The reaction begins to run backwards as it proceeds',
            'The temperature steadily inverts from hot to cold',
          ],
          correct_index: 1,
          explanation: 'Sucrose rotates light to the right ($+66.5^\\circ$); the product mixture rotates it net to the left (fructose’s $-92^\\circ$ outweighs glucose’s $+52.5^\\circ$). The sign of rotation inverts — hence the name.',
          difficulty_level: 2,
        },
        {
          question: 'Sugar inversion is conveniently followed with a polarimeter because:',
          options: [
            'The reaction gives off a faint coloured gas as it runs',
            'The species are optically active and rotate polarised light differently',
            'The reaction produces ions that steadily change the conductivity',
            'The mixture slowly changes colour as the reaction proceeds',
          ],
          correct_index: 1,
          explanation: 'Sucrose, glucose and fructose are all optically active with different rotations, so the net angle of rotation changes as the reaction proceeds — exactly what a polarimeter measures.',
          difficulty_level: 2,
        },
        {
          question: 'For sugar inversion followed by polarimetry, with readings $r_0$, $r_t$ and $r_\\infty$, the rate constant is:',
          options: [
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{r_0 - r_\\infty}{r_t - r_\\infty}$',
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{r_t - r_\\infty}{r_0 - r_\\infty}$',
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{r_0}{r_t}$',
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{r_0 - r_t}{r_\\infty}$',
          ],
          correct_index: 0,
          explanation: 'With $a = r_0 - r_\\infty$ (total change) and $a - x = r_t - r_\\infty$ (change still to come), the first-order law gives $k = \\frac{2.303}{t}\\log\\frac{r_0 - r_\\infty}{r_t - r_\\infty}$.',
          difficulty_level: 3,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL2 batch C done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
