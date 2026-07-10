'use strict';
/* Chemical Kinetics — Lecture 3, batch B: pages 27–29 (consecutive, rate law from mechanism/RDS, steady-state). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 27 ─────────────────────────────────────────────────────────────
  page(27, 'consecutive-reactions',
    'Consecutive (Sequential) Reactions',
    'A reaction in a chain, $\\ce{A -> I -> P}$ — the middle player builds up, peaks, and drains away, like stock in a busy warehouse.',
    ['chemical-kinetics', 'consecutive-reaction', 'sequential', 'intermediate', 'concentration-profile'],
    [
      B.hero(
        'A warehouse with boxes arriving on one conveyor and leaving on another, the stock on the floor rising to a peak then falling as the outflow overtakes the inflow',
        'Ultra-wide cinematic banner (16:5 ratio). A warehouse interior: boxes arrive on a left conveyor and leave on a right conveyor. The stock piled on the floor is shown rising to a peak then falling as the outflow overtakes the dwindling inflow. The idea: an intermediate that builds up then drains away. Deep near-black background, orange conveyor glow and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'In a **consecutive (sequential) reaction**, the product of one step is the reactant of the next:\n\n$$\\ce{A ->[k_1] I ->[k_2] P}.$$\n\nThe middle species $\\ce{I}$ is an **intermediate** — made from A, then consumed to give P. Picture a warehouse: boxes (A) arrive and pile up as stock (I); that stock is then shipped out as deliveries (P). The stock on the floor first **builds up**, then **drains away** once the inflow slows.'
      ),
      B.heading('How the three concentrations move'),
      B.text(
        'Three things happen together. The starting material **A decays** in simple first-order fashion, $[\\ce{A}] = [\\ce{A}]_0 e^{-k_1 t}$. The intermediate **I rises to a maximum and then falls** — it is being made and destroyed at once, so it peaks when its formation rate equals its consumption rate. The final product **P rises in an S-shaped curve**, slow at first (little I yet), then steepening, then levelling as A runs out.'
      ),
      B.img(
        'Three concentration curves against time: A falling exponentially, I rising to a peak then falling, and P rising in an S-shape to a plateau',
        '📸 Consecutive reaction: A decays, the intermediate I peaks then falls, and the product P builds up',
        'Graph of concentration versus time for a consecutive reaction A to I to P. Three curves: [A] starts high and decays exponentially toward zero; [I] starts at zero, rises to a clear maximum partway along, then falls back toward zero; [P] starts at zero and rises in an S-shaped curve to a high plateau. Dark background (#0a0a0a), three distinct accent colours (orange for A), labelled [A], [I], [P], clean technical illustration with subtle gridlines.'
      ),
      B.text(
        'How big the intermediate’s pile gets depends on the two rate constants. If $k_2 \\gg k_1$, the intermediate is shipped out the instant it forms — it barely accumulates, never getting a chance to pile up. If $k_1 \\gg k_2$, A floods in faster than I can leave, so the intermediate **builds up** and the slow second step becomes the bottleneck. As always, the slower step is rate-determining.'
      ),
      B.reason('logical',
        'In a consecutive reaction $\\ce{A ->[k_1] I ->[k_2] P}$, the concentration of the intermediate I is observed to stay very low throughout. What does this tell you about the two rate constants?',
        [
          'That $k_1$ is much larger than $k_2$, so I piles up',
          'That $k_2$ is much larger than $k_1$, so I is consumed almost as soon as it is formed and never accumulates',
          'That $k_1$ and $k_2$ are exactly equal',
          'That neither step is taking place',
        ],
        'A persistently low intermediate means it leaves as fast as it arrives — its consumption ($k_2$) outpaces its formation ($k_1$), so $k_2 \\gg k_1$. If $k_1$ were larger, I would build up to a high peak instead.',
        3
      ),
      B.sim('consecutive-reactions', 'Consecutive Reactions — set k₁ and k₂', {
        prompt: 'In the consecutive reaction A → I → P, if the second step is much faster than the first (k₂ ≫ k₁), what happens to the intermediate I?',
        options: ['It piles up to a high peak', 'It stays low and almost flat', 'It never forms at all'],
        reveal_after: 'When the second step is much faster, I is consumed almost as fast as it is made, so its peak stays low and flat — the steady-state picture. Drag k₂ above k₁ in the sim and watch the pink intermediate curve collapse toward the axis.',
      }),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Consecutive signature:** A decays exponentially; the intermediate I rises to a peak then falls; P is an S-curve. The intermediate peaks when its formation and consumption rates are equal.\n\n**Two regimes:** $k_2 \\gg k_1 \\Rightarrow$ I stays tiny (sets up the steady-state idea, next pages); $k_1 \\gg k_2 \\Rightarrow$ I builds up and step 2 is rate-determining. Graph-identification questions ("which curve is the intermediate?") pick the one that goes up then down.'
      ),
      B.quiz([
        {
          question: 'In a consecutive reaction $\\ce{A -> I -> P}$, the concentration of the intermediate I over time:',
          options: [
            'Falls steadily from a high value to zero',
            'Rises to a maximum and then falls',
            'Stays constant throughout',
            'Rises steadily in an S-shape to a plateau',
          ],
          correct_index: 1,
          explanation: 'The intermediate is both formed (from A) and consumed (to P), so it builds to a peak then drains away. The steady fall describes A; the S-shaped rise describes the final product P.',
          difficulty_level: 1,
        },
        {
          question: 'In $\\ce{A ->[k_1] I ->[k_2] P}$, the intermediate I accumulates to a high concentration when:',
          options: [
            '$k_1 \\gg k_2$, so I is formed faster than it is consumed',
            '$k_2 \\gg k_1$, so I is consumed faster than it is formed',
            '$k_1 = k_2$ exactly',
            'Both rate constants are very small',
          ],
          correct_index: 0,
          explanation: 'If formation ($k_1$) outpaces consumption ($k_2$), the intermediate piles up. If $k_2 \\gg k_1$, it is removed as fast as it appears and stays low.',
          difficulty_level: 2,
        },
        {
          question: 'On a concentration–time graph for $\\ce{A -> I -> P}$, which curve is the S-shaped one that rises to a plateau?',
          options: [
            'The reactant A',
            'The final product P',
            'The intermediate I',
            'None of the curves is S-shaped',
          ],
          correct_index: 1,
          explanation: 'The final product P builds up slowly at first, steepens, then levels off — an S-shape to a plateau. A decays; I peaks then falls.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 28 ─────────────────────────────────────────────────────────────
  page(28, 'rate-law-from-a-mechanism',
    'Writing the Rate Law From a Mechanism',
    'When the slow step is handed to you: read the rate law off it — but never leave an intermediate in your answer.',
    ['chemical-kinetics', 'mechanism', 'rate-determining-step', 'rate-law', 'fast-equilibrium'],
    [
      B.hero(
        'A mechanism written as two steps, one boxed and labelled slow, with an arrow pulling the rate law out of the slow step',
        'Ultra-wide cinematic banner (16:5 ratio). A reaction mechanism written as two stacked steps on a dark slate; the slower step is boxed and glowing, with an arrow drawing the rate law out of it. The idea: the slow step dictates the rate law. Deep near-black background, orange highlight on the slow step, clean cinematic technical style. No text.'
      ),
      B.text(
        'When a mechanism gives you a clearly **slow step** (the rate-determining step), the recipe is simple: **the rate law is the rate of that slow step**, written from its own molecularity. There is one firm rule, though — the rate law must be expressed in terms of reactants, products or catalysts, **never an intermediate**. If an intermediate appears, substitute it out using a fast step that precedes the slow one.'
      ),
      B.heading('Case 1 — the slow step comes first'),
      B.worked('Worked Example — slow step first',
        'For $\\ce{2NO2 + F2 -> 2NO2F}$, the proposed mechanism is:\n\nStep I (slow): $\\ce{NO2 + F2 ->[k_1] NO2F + F}$\n\nStep II (fast): $\\ce{NO2 + F ->[k_2] NO2F}$\n\nFind the rate law and the overall order.',
        '**Step 1 — write the rate of the slow step.** Step I is rate-determining, and it is bimolecular in $\\ce{NO2}$ and $\\ce{F2}$:\n\n$$\\text{rate} = k_1[\\ce{NO2}][\\ce{F2}].$$\n\n**Step 2 — check for intermediates.** The only species here are $\\ce{NO2}$ and $\\ce{F2}$ — both genuine reactants, no intermediate. Done.\n\n**Step 3 — read the order.** First order in each, so **overall order = 2**.\n\n**Answer:** $\\text{rate} = k_1[\\ce{NO2}][\\ce{F2}]$, second order. Notice it uses just *one* $\\ce{NO2}$ — the one in the slow step — not the "2" from the overall equation. The overall coefficient is irrelevant; the slow step decides.'
      ),
      B.heading('Case 2 — a fast equilibrium feeds the slow step'),
      B.worked('Worked Example — substitute the intermediate',
        'For $\\ce{2O3 -> 3O2}$, the proposed mechanism is:\n\nStep I (fast equilibrium): $\\ce{O3 <=>[k_1][k_{-1}] O2 + O}$\n\nStep II (slow): $\\ce{O + O3 ->[k_2] 2O2}$\n\nFind the rate law.',
        '**Step 1 — rate of the slow step.** Step II is rate-determining:\n\n$$\\text{rate} = k_2[\\ce{O}][\\ce{O3}].$$\n\n**Step 2 — but $\\ce{O}$ is an intermediate** — it cannot stay in the answer. Use the fast equilibrium (Step I), where forward rate equals backward rate:\n\n$$k_1[\\ce{O3}] = k_{-1}[\\ce{O2}][\\ce{O}] \\quad\\Rightarrow\\quad [\\ce{O}] = \\frac{k_1[\\ce{O3}]}{k_{-1}[\\ce{O2}]}.$$\n\n**Step 3 — substitute back.**\n\n$$\\text{rate} = k_2\\cdot\\frac{k_1[\\ce{O3}]}{k_{-1}[\\ce{O2}]}\\cdot[\\ce{O3}] = \\frac{k_1 k_2}{k_{-1}}\\,\\frac{[\\ce{O3}]^2}{[\\ce{O2}]} = k\'[\\ce{O3}]^{2}[\\ce{O2}]^{-1}.$$\n\n**Answer:** $\\text{rate} = k\'[\\ce{O3}]^{2}[\\ce{O2}]^{-1}$. This is exactly the product-inhibited rate law you met in Lecture 1 — and now you can see *why* the product $\\ce{O2}$ appears with a negative order: it pushes the fast equilibrium back, starving the slow step of $\\ce{O}$.'
      ),
      B.callout('warning', 'An intermediate must never survive in the final rate law',
        'A rate law is something you can measure, so it can only contain things whose concentrations you can control or measure — reactants, products, catalysts. An intermediate is fleeting and unmeasurable. If your slow step contains one, you are not finished: substitute it using a preceding fast equilibrium (or the steady-state method on the next page) until it is gone.'
      ),
      B.reason('logical',
        'A slow step in a mechanism is found to be $\\ce{X + O3 -> products}$, where X is an intermediate generated in a prior fast equilibrium. Why can the rate law not simply be left as $k[\\ce{X}][\\ce{O3}]$?',
        [
          'Because the slow step never determines the rate law',
          'Because X is an intermediate whose concentration cannot be measured or controlled, so it must be replaced using the prior fast equilibrium before the rate law is valid',
          'Because intermediates always have zero concentration',
          'Because only products may appear in a rate law',
        ],
        'A usable rate law contains only measurable species. The intermediate X must be expressed in terms of stable species via the fast equilibrium (e.g. $[\\ce{X}] = \\frac{k_1}{k_{-1}}\\frac{[\\dots]}{[\\dots]}$). Leaving X in makes the rate law untestable.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Recipe when a slow step is given:** (1) write rate = rate of the slow step from its molecularity; (2) if an intermediate appears, replace it using the prior fast equilibrium ($k_{\\text{fwd}}[\\,] = k_{\\text{back}}[\\,][\\,]$); (3) read the order.\n\n**Why products/negative orders appear:** substituting an intermediate often brings a product into the denominator — that is how $\\ce{2O3 -> 3O2}$ ends up inhibited by $\\ce{O2}$. The overall-equation coefficients never enter; only the slow step and the equilibria do.'
      ),
      B.quiz([
        {
          question: 'For $\\ce{2NO2 + F2 -> 2NO2F}$ with a slow first step $\\ce{NO2 + F2 -> NO2F + F}$, the rate law is:',
          options: [
            '$k[\\ce{NO2}]^2[\\ce{F2}]$',
            '$k[\\ce{NO2}][\\ce{F2}]$',
            '$k[\\ce{NO2}]^2[\\ce{F2}]^2$',
            '$k[\\ce{F2}]$',
          ],
          correct_index: 1,
          explanation: 'The rate is that of the slow step, which involves one $\\ce{NO2}$ and one $\\ce{F2}$: rate $= k[\\ce{NO2}][\\ce{F2}]$. The "2" in the overall equation does not enter.',
          difficulty_level: 2,
        },
        {
          question: 'When a slow step contains an intermediate, you make the rate law usable by:',
          options: [
            'Leaving the intermediate in, since it really controls the rate',
            'Replacing it via a preceding fast equilibrium with stable species',
            'Deleting the intermediate from the rate law completely',
            'Replacing the intermediate with the overall reactant coefficients',
          ],
          correct_index: 1,
          explanation: 'An intermediate cannot stay in a rate law. Use the fast equilibrium ($k_1[\\,] = k_{-1}[\\,][\\,]$) to express it in terms of stable species, then substitute.',
          difficulty_level: 2,
        },
        {
          question: 'For $\\ce{2O3 -> 3O2}$ via a fast $\\ce{O3 <=> O2 + O}$ then slow $\\ce{O + O3 -> 2O2}$, the rate law works out to:',
          options: [
            '$k[\\ce{O3}]^{2}[\\ce{O2}]$',
            '$k[\\ce{O3}]^{2}[\\ce{O2}]^{-1}$',
            '$k[\\ce{O3}][\\ce{O2}]^{-1}$',
            '$k[\\ce{O3}]^{3}[\\ce{O2}]^{-1}$',
          ],
          correct_index: 1,
          explanation: 'Substituting $[\\ce{O}] = \\frac{k_1}{k_{-1}}\\frac{[\\ce{O3}]}{[\\ce{O2}]}$ into rate $= k_2[\\ce{O}][\\ce{O3}]$ gives $k\'[\\ce{O3}]^2[\\ce{O2}]^{-1}$ — the product $\\ce{O2}$ inhibits the reaction.',
          difficulty_level: 3,
        },
      ]),
    ]
  ),

  // ── PAGE 29 ─────────────────────────────────────────────────────────────
  page(29, 'steady-state-approximation',
    'The Steady-State Approximation',
    'When no step wears a "slow" label: assume the reactive intermediate is made and destroyed at the same rate, so its concentration barely moves.',
    ['chemical-kinetics', 'steady-state', 'intermediate', 'mechanism', 'rate-law'],
    [
      B.hero(
        'A wash basin with the tap running in and the drain open, the water level holding steady because inflow equals outflow',
        'Ultra-wide cinematic banner (16:5 ratio). A wash basin with the tap running water in from above and the drain open below; the water level holds perfectly steady because the inflow exactly matches the outflow. The idea: a steady level maintained by balanced one-way flow. Deep near-black background, cool-blue water against orange accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'Sometimes a mechanism gives you no step marked "slow". Then you use the **steady-state approximation (SSA)**: a highly reactive intermediate is destroyed almost as fast as it is formed, so its concentration stays low and roughly **constant**. Mathematically, its net rate of change is taken as zero:\n\n$$\\frac{d[\\ce{intermediate}]}{dt} \\approx 0.$$\n\nPicture a wash basin with the tap on and the drain open: water pours in and drains out at the same rate, so the level holds steady. **Important:** this is *not* equilibrium — water flows one way, in at the top and out at the bottom. A steady level is not the same as a two-way balance.'
      ),
      B.heading('Applying the steady state'),
      B.text(
        'Take $\\ce{A <=>[k_1][k_{-1}] B ->[k_2] C}$, with B the reactive intermediate. Set its net rate to zero — formation equals total consumption:\n\n$$\\frac{d[\\ce{B}]}{dt} = k_1[\\ce{A}] - (k_{-1} + k_2)[\\ce{B}] = 0 \\quad\\Rightarrow\\quad [\\ce{B}] = \\frac{k_1[\\ce{A}]}{k_{-1} + k_2}.$$\n\nThe overall rate is the rate of product formation, $\\dfrac{d[\\ce{C}]}{dt} = k_2[\\ce{B}]$, so'
      ),
      B.latex('\\frac{d[\\ce{C}]}{dt} = \\frac{k_1 k_2\\,[\\ce{A}]}{k_{-1} + k_2}', 'Rate from the steady-state approximation',
        'If $k_2 \\gg k_{-1}$ this reduces to $k_1[\\ce{A}]$ (first step controls); if $k_{-1} \\gg k_2$ it becomes $\\dfrac{k_1 k_2}{k_{-1}}[\\ce{A}]$.'),
      B.worked('Worked Example — the browning of nitric oxide',
        'Colourless $\\ce{NO}$ turns brown in air as $\\ce{NO2}$ forms: $\\ce{2NO + O2 -> 2NO2}$. Experiment shows it is second order in $\\ce{NO}$ and first order in $\\ce{O2}$. Show the mechanism below is consistent:\n\nStep I (fast): $\\ce{2NO <=>[k_1][k_{-1}] N2O2}$   Step II (slow): $\\ce{N2O2 + O2 ->[k_2] 2NO2}$',
        'Treat $\\ce{N2O2}$ as a short-lived intermediate and apply the steady state.\n\n**Step 1 — set $d[\\ce{N2O2}]/dt = 0$:**\n\n$$k_1[\\ce{NO}]^2 - k_{-1}[\\ce{N2O2}] - k_2[\\ce{N2O2}][\\ce{O2}] = 0.$$\n\n**Step 2 — solve for the intermediate:**\n\n$$[\\ce{N2O2}] = \\frac{k_1[\\ce{NO}]^2}{k_{-1} + k_2[\\ce{O2}]}.$$\n\n**Step 3 — write the overall rate** ($= k_2[\\ce{N2O2}][\\ce{O2}]$):\n\n$$\\text{rate} = \\frac{k_1 k_2\\,[\\ce{NO}]^2[\\ce{O2}]}{k_{-1} + k_2[\\ce{O2}]}.$$\n\n**Step 4 — take the limit $k_{-1} \\gg k_2[\\ce{O2}]$** (the dimer mostly falls back apart):\n\n$$\\text{rate} = \\frac{k_1 k_2}{k_{-1}}[\\ce{NO}]^2[\\ce{O2}].$$\n\n**Answer:** second order in $\\ce{NO}$, first order in $\\ce{O2}$ — exactly the observed law. The mechanism is **consistent** with the data.'
      ),
      B.callout('note', 'Steady state is not equilibrium',
        'Both ideas hold a concentration constant, but they are different. **Equilibrium** is a two-way balance — the forward and backward of the *same* step run equally. The **steady state** is a balance of *different* one-way flows — the intermediate is produced by one reaction and consumed by another, at equal rates. The wash basin (in at the top, out at the drain) is steady state; it never reverses.'
      ),
      B.reason('logical',
        'Both the equilibrium method and the steady-state approximation can hold an intermediate’s concentration constant. What is the essential difference between them?',
        [
          'There is no real difference; the two terms mean the same thing',
          'Equilibrium balances the forward and backward of the same reversible step, while the steady state balances formation and consumption by different one-way steps',
          'Equilibrium applies only to gases, the steady state only to solutions',
          'The steady state requires the intermediate to be at high concentration',
        ],
        'Equilibrium is a two-way balance within one reversible step. The steady state balances an intermediate’s production (one step) against its consumption (another step) — distinct one-way flows held equal, like the wash basin. The steady state also assumes the intermediate stays at low concentration.',
        3
      ),
      B.sim('consecutive-reactions', 'See the steady state form (k₂ ≫ k₁)', {
        prompt: 'For the steady-state approximation to hold for the intermediate, its concentration must stay:',
        options: ['Low and roughly constant', 'High and steadily rising', 'Exactly equal to the reactant'],
        reveal_after: 'The steady state needs the intermediate held low and roughly constant — formed as fast as it is consumed. In the sim, push k₂ well above k₁: the intermediate flatlines near zero, which is exactly when setting d[I]/dt ≈ 0 is valid.',
      }),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**SSA recipe:** set $\\dfrac{d[\\text{intermediate}]}{dt} = 0$, solve for the intermediate, substitute into the product-formation rate. Then take the limiting case the question implies to recover a clean rate law.\n\n**Steady state $\\ne$ equilibrium:** equilibrium = same step both ways; steady state = different steps, formation = consumption. Examiners test this distinction directly.\n\n**Use SSA when no step is labelled slow;** use the fast-equilibrium method (previous page) when one clearly is.'
      ),
      B.quiz([
        {
          question: 'The steady-state approximation assumes that, for a reactive intermediate I:',
          options: [
            'The concentration $[\\ce{I}]$ rises steadily throughout the whole reaction',
            '$\\dfrac{d[\\ce{I}]}{dt} \\approx 0$: it is consumed about as fast as it is formed',
            'The concentration $[\\ce{I}]$ stays equal to that of the reactant',
            'The intermediate is actually the major product of the reaction',
          ],
          correct_index: 1,
          explanation: 'A reactive intermediate is destroyed nearly as fast as it forms, so its net rate of change is taken as zero and its concentration stays low and steady.',
          difficulty_level: 1,
        },
        {
          question: 'For $\\ce{A <=>[k_1][k_{-1}] B ->[k_2] C}$, the steady-state concentration of the intermediate B is:',
          options: [
            '$[\\ce{B}] = \\dfrac{k_1[\\ce{A}]}{k_{-1} + k_2}$',
            '$[\\ce{B}] = k_1[\\ce{A}]$',
            '$[\\ce{B}] = \\dfrac{k_{-1} + k_2}{k_1[\\ce{A}]}$',
            '$[\\ce{B}] = k_1 k_2[\\ce{A}]$',
          ],
          correct_index: 0,
          explanation: 'Setting $k_1[\\ce{A}] - (k_{-1}+k_2)[\\ce{B}] = 0$ gives $[\\ce{B}] = \\frac{k_1[\\ce{A}]}{k_{-1}+k_2}$ — formation over total consumption.',
          difficulty_level: 2,
        },
        {
          question: 'How does the steady state differ from equilibrium?',
          options: [
            'They are really two different names for the same single condition',
            'Equilibrium balances one reversible step; steady state balances two one-way steps',
            'The steady state only ever occurs at a very high temperature',
            'Equilibrium keeps the concentrations changing, the steady state does not',
          ],
          correct_index: 1,
          explanation: 'Equilibrium is a two-way balance of one step; the steady state balances an intermediate’s production and consumption by separate one-way steps. The wash-basin (in at the top, out at the drain) is steady state, never reversing.',
          difficulty_level: 3,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL3 batch B done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
