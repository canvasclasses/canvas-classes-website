'use strict';
/* Chemical Kinetics — Lecture 4, batch B: pages 33–35 (collision theory, transition-state + kinetic/thermo, catalysis). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 33 ─────────────────────────────────────────────────────────────
  page(33, 'collision-theory',
    'Collision Theory: Energy Is Not Enough',
    'Molecules must collide to react — but most collisions do nothing. A successful one needs both enough energy and the right aim.',
    ['chemical-kinetics', 'collision-theory', 'steric-factor', 'orientation', 'activation-energy'],
    [
      B.hero(
        'Many molecules colliding: most bounce apart, while one pair meeting head-on with the correct orientation forms a new bond and reacts',
        'Ultra-wide cinematic banner (16:5 ratio). A scene of many molecules colliding. Most pairs simply bounce apart unchanged; one pair, meeting with the correct orientation and a bright flash of energy, forms a new bond and reacts. The idea: only a few collisions out of many actually succeed. Deep near-black background, orange flash on the successful collision, clean cinematic technical style. No text.'
      ),
      B.text(
        '**Collision theory** says reactions happen when molecules collide — but here is the surprise: the vast majority of collisions lead to *nothing*. In a flask, molecules collide billions of times a second, yet only a tiny fraction of those collisions produce product. For a collision to succeed, **two** conditions must both be met.'
      ),
      B.text(
        '**1. Enough energy (the energy factor).** The colliding molecules must carry at least the activation energy $E_a$. A gentle bump just lets them bounce off and go their separate ways. Only an energetic enough collision can break the old bonds. This factor is the Boltzmann term $e^{-E_a/RT}$ you already know.\n\n**2. The right orientation (the steric factor).** Even an energetic collision fails if the molecules are pointing the wrong way. The reactive parts must meet. A molecule attacking $\\ce{CH3I}$ from the carbon side can react, but a hit on the iodine end achieves nothing — there is a "cone of successful attack", and a collision outside it is wasted no matter how hard.'
      ),
      B.img(
        'Two depictions of a collision: one where the molecules meet in the correct orientation and react, and one where the same molecules meet in the wrong orientation and bounce away unchanged',
        '📸 Same energy, different aim: only the correctly oriented collision leads to reaction',
        'Two side-by-side panels of a molecular collision. Left panel ("effective"): two molecules approach in the correct orientation, their reactive ends meeting, and a new bond forms. Right panel ("ineffective"): the same two molecules approach in the wrong orientation, the reactive ends not aligned, and they bounce apart unchanged. Dark background (#0a0a0a), orange highlight on the reacting ends, clean technical illustration.'
      ),
      B.text(
        'Put the two factors together and you can read the rate constant as a funnel. Out of 100 collisions, maybe 20 have enough energy; of those 20, perhaps half are correctly oriented — so only about 10 succeed. In symbols, $k = P\\,Z\\,f$, where $Z$ is the collision frequency, $f = e^{-E_a/RT}$ is the energy factor, and $P$ is the **steric (probability) factor** for orientation. The pre-exponential factor $A$ of the Arrhenius equation is just $P\\,Z$ — collision frequency times the orientation chance.'
      ),
      B.reason('logical',
        'Two reactant molecules collide with far more than the activation energy, yet no reaction occurs. According to collision theory, what is the most likely explanation?',
        [
          'Energy alone always guarantees a reaction, so this is impossible',
          'The molecules collided with the wrong orientation, so even though they had enough energy, their reactive parts did not meet',
          'The temperature was too low for the collision',
          'The collision frequency was zero',
        ],
        'A successful collision needs both enough energy AND the right orientation. Plenty of energy with poor aim still fails — the reactive sites never line up. This is exactly why the steric factor $P$ sits in $k = PZf$ alongside the energy term.',
        2
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Two conditions for an effective collision:** sufficient energy ($\\ge E_a$, the factor $e^{-E_a/RT}$) AND correct orientation (the steric factor $P$). "Energy alone is enough" is FALSE.\n\n**The pieces of $k = PZf$:** $Z$ = collision frequency, $f = e^{-E_a/RT}$ = energy factor, $P$ = orientation factor. The Arrhenius $A = PZ$. Questions on "why most collisions don’t react" want both the energy and the orientation requirement named.'
      ),
      B.quiz([
        {
          question: 'According to collision theory, an "effective" collision is one that has:',
          options: [
            'Enough energy, but in any orientation',
            'Both enough energy and the correct orientation',
            'The correct orientation, but at any energy',
            'A very high frequency of collisions overall',
          ],
          correct_index: 1,
          explanation: 'Both conditions are required: the colliding molecules need at least the activation energy AND must be correctly oriented. Either one alone is insufficient.',
          difficulty_level: 1,
        },
        {
          question: 'In the expression $k = P\\,Z\\,f$, the steric factor $P$ accounts for:',
          options: [
            'The fraction of collisions that have enough energy to react',
            'The need for molecules to collide in the correct orientation',
            'The total number of molecular collisions per second',
            'The temperature at which the reaction is run',
          ],
          correct_index: 1,
          explanation: '$P$ is the orientation (steric) factor. The energy fraction is $f = e^{-E_a/RT}$ and the collision frequency is $Z$.',
          difficulty_level: 2,
        },
        {
          question: 'The Arrhenius pre-exponential factor $A$ corresponds, in collision theory, to:',
          options: [
            'The activation energy $E_a$ of the reaction',
            'The product $P\\,Z$ of frequency and orientation',
            'The Boltzmann energy fraction $e^{-E_a/RT}$',
            'The overall enthalpy change $\\Delta H$ of reaction',
          ],
          correct_index: 1,
          explanation: 'Comparing $k = PZf$ with $k = Ae^{-E_a/RT}$ (where $f = e^{-E_a/RT}$) gives $A = PZ$ — the energy-independent part, combining collision frequency and orientation.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 34 ─────────────────────────────────────────────────────────────
  page(34, 'transition-state-and-kinetic-vs-thermodynamic',
    'The Transition State, and Two Kinds of "Best" Product',
    'At the top of the barrier sits a fleeting activated complex — and when a reactant can go two ways, "forms fastest" and "most stable" need not be the same product.',
    ['chemical-kinetics', 'transition-state', 'activated-complex', 'kinetic-product', 'thermodynamic-product'],
    [
      B.hero(
        'A reactant at a central valley with two hills to either side: a small hill leading to one product, a tall hill leading to a lower, more stable product',
        'Ultra-wide cinematic banner (16:5 ratio). A central valley (the reactant) with two hills rising on either side. To the left, a small hill leading down to one product. To the right, a taller hill leading down to a product at a noticeably lower energy. The idea: a fast-but-less-stable route versus a slow-but-more-stable one. Deep near-black background, orange profile curves and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        '**Transition-state theory** zooms in on the peak of the energy barrier. There, reactants form a fleeting, half-made structure called the **activated complex** or **transition state** — old bonds partly broken, new bonds partly formed. It exists for an instant before collapsing either back to reactants or forward to products. The energy needed to reach it is the activation energy (more precisely, the Gibbs energy of activation, $\\Delta^{\\ddagger}G$).'
      ),
      B.heading('When a reactant can go two ways'),
      B.text(
        'Often a single reactant can form **two different products** over two different barriers. This sets up a beautiful competition:\n\n- The **kinetic product** forms over the **smaller** barrier — it appears **faster**.\n- The **thermodynamic product** sits at **lower** energy — it is **more stable**, and is favoured given enough time.\n\nCrucially, these need not be the same molecule. "Forms fastest" and "most stable" are different questions — *the product that forms first is not guaranteed to be the most stable one.*'
      ),
      B.img(
        'An energy diagram from a central reactant: a low barrier on one side leading to a higher-energy kinetic product, and a higher barrier on the other side leading to a lower-energy thermodynamic product',
        '📸 Kinetic product (low barrier, forms fast) vs thermodynamic product (lower energy, more stable)',
        'Energy diagram with the reactant in a central well. To the left, a small activation barrier leads down to a product at moderate energy, labelled "kinetic product (forms faster)". To the right, a taller activation barrier leads down to a product at lower energy, labelled "thermodynamic product (more stable)". Mark the two activation barriers. Dark background (#0a0a0a), orange curves and labels, clean technical illustration.'
      ),
      B.text(
        'Temperature decides who wins. At **low temperature**, molecules are short of energy, so they mostly take the easier, smaller hill — the **kinetic product** dominates. At **high temperature** (or given long enough), there is energy to spare, the reaction becomes reversible, and the system settles into the more stable **thermodynamic product**.'
      ),
      B.reason('logical',
        'A reactant can form product P over a small barrier (P sits at moderate energy) or product Q over a tall barrier (Q sits at lower energy). At very low temperature, which product dominates, and what is it called?',
        [
          'Q, because it is the most stable, called the kinetic product',
          'P, because the small barrier is easiest to cross when energy is scarce; P is the kinetic product',
          'Q, because a tall barrier is always preferred at low temperature',
          'P, because it is the most stable, called the thermodynamic product',
        ],
        'At low temperature molecules lack the energy for the tall barrier, so they take the easy route to P, which forms faster — the kinetic product. Q (lower energy, more stable) is the thermodynamic product and is favoured at high temperature or long times.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Kinetic vs thermodynamic product:** kinetic = smaller barrier, forms faster, favoured at LOW temperature; thermodynamic = lower energy, more stable, favoured at HIGH temperature / long time.\n\n**Trap:** "the kinetic product is always the higher-energy one." Not guaranteed — the kinetic product is defined by forming *faster* (smaller $E_a$), not by its energy. The activated complex (transition state) sits at the barrier top; it is not an intermediate (which sits in a dip).'
      ),
      B.quiz([
        {
          question: 'The activated complex (transition state) of a reaction is:',
          options: [
            'A stable intermediate that can be isolated and stored',
            'A fleeting, high-energy structure at the barrier top',
            'The most stable product formed in the reaction',
            'Exactly the same as the original reactant molecules',
          ],
          correct_index: 1,
          explanation: 'The transition state is a short-lived, highest-energy arrangement at the barrier top, with bonds partly broken and partly formed. It cannot be isolated, unlike an intermediate (which sits in an energy dip).',
          difficulty_level: 1,
        },
        {
          question: 'The kinetic product of a reaction is the one that:',
          options: [
            'Has the lowest energy and is most stable',
            'Forms faster, over the smaller activation barrier',
            'Forms only at high temperature',
            'Is always the higher-energy product',
          ],
          correct_index: 1,
          explanation: 'The kinetic product forms faster because it has the smaller barrier. It is favoured at low temperature. Lowest energy / most stable describes the thermodynamic product.',
          difficulty_level: 2,
        },
        {
          question: 'Raising the temperature (or allowing a long time) tends to favour:',
          options: [
            'The kinetic product',
            'The thermodynamic (more stable) product',
            'Neither product',
            'Whichever product has the larger barrier',
          ],
          correct_index: 1,
          explanation: 'With ample energy and time the reaction can reverse and settle into the most stable, lowest-energy product — the thermodynamic product. Low temperature favours the faster-forming kinetic product.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 35 ─────────────────────────────────────────────────────────────
  page(35, 'catalysis',
    'Catalysis: Digging a Tunnel Through the Barrier',
    'A catalyst does not flatten the hill — it offers a lower path around it, speeding the reaction without being used up.',
    ['chemical-kinetics', 'catalysis', 'catalyst', 'activation-energy', 'homogeneous-heterogeneous'],
    [
      B.hero(
        'A tall energy hill with a tunnel bored low through its base, a faint second path at much lower height representing the catalysed route',
        'Ultra-wide cinematic banner (16:5 ratio). A tall energy hill (the uncatalysed barrier) with a glowing tunnel bored low through its base — a second, much lower path representing the catalysed route. A small figure takes the easy tunnel rather than climbing over the top. Deep near-black background, orange tunnel glow and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'A **catalyst** is a substance that speeds up a reaction without being consumed — it is regenerated at the end. It works by offering an **alternative reaction path with a lower activation energy**. You cannot make the hill itself shorter, but a catalyst is like digging a tunnel through its base: the reaction takes the easier route, so a far larger fraction of collisions can get through.'
      ),
      B.img(
        'Two energy profiles on the same axes: a tall barrier for the uncatalysed reaction and a lower barrier for the catalysed reaction, both starting and ending at the same reactant and product levels',
        '📸 A catalyst lowers the activation energy — same reactants, same products, lower barrier',
        'Reaction energy profile showing two curves on the same axes. The uncatalysed path rises over a tall barrier; the catalysed path rises over a noticeably lower barrier (possibly via a small intermediate dip). Both curves start at the same reactant level and end at the same product level — only the barrier height differs. Mark Ea (uncatalysed) and the lower Ea (catalysed). Dark background (#0a0a0a), one accent for uncatalysed, orange for catalysed, clean technical illustration.'
      ),
      B.callout('remember', 'What a catalyst does and does NOT do',
        'A catalyst **lowers the activation energy** and so speeds the reaction; it is **not consumed** (only a small amount is needed) and is regenerated. It does **not** change $\\Delta H$, $\\Delta G$ or the position of equilibrium — it speeds the forward and backward reactions equally, so it only helps you *reach* equilibrium sooner. And it cannot make a non-spontaneous reaction happen. A **negative catalyst (inhibitor)** does the reverse — it slows a reaction down.'
      ),
      B.text(
        'Catalysis comes in two types. In **homogeneous catalysis** the catalyst is in the *same* phase as the reactants (e.g. an acid catalyst dissolved in the reacting solution). In **heterogeneous catalysis** it is in a *different* phase — typically a solid catalyst with gaseous or liquid reactants passing over it (e.g. iron in the Haber process, or $\\ce{MnO2}$ speeding the decomposition of $\\ce{KClO3}$). How much faster a catalyst makes a reaction follows from the drop in activation energy:'
      ),
      B.latex('\\frac{k_{\\text{cat}}}{k} = e^{\\,(E_a - E_a\')/RT}', 'Speed-up from a catalyst',
        "$E_a$ = uncatalysed barrier, $E_a'$ = lower catalysed barrier. The factor $A$ cancels (same reaction, same temperature), so only the drop in $E_a$ matters."),
      B.worked('Worked Example — how many times faster?',
        'A catalyst lowers the activation energy of a reaction by $8.314\\,\\text{kJ mol}^{-1}$ at $300$ K. By what factor does it speed the reaction up? (Take $R = 8.314\\,\\text{J mol}^{-1}\\text{K}^{-1}$.)',
        'Same reaction, same temperature, so the pre-exponential $A$ cancels and only the barrier drop counts.\n\n**Step 1 — write the ratio.**\n\n$$\\frac{k_{\\text{cat}}}{k} = e^{\\,(E_a - E_a\')/RT}.$$\n\n**Step 2 — substitute.** The barrier drops by $E_a - E_a\' = 8.314\\,\\text{kJ} = 8314\\,\\text{J mol}^{-1}$:\n\n$$\\frac{k_{\\text{cat}}}{k} = e^{\\,8314 / (8.314 \\times 300)} = e^{\\,3.33}.$$\n\n**Step 3 — evaluate.** $e^{3.33} \\approx 28$.\n\n**Answer: about 28 times faster.** A barrier drop of only ~8 kJ/mol — small next to typical bond energies — multiplies the rate nearly thirtyfold, because it sits inside an exponential. That exponential leverage is exactly why industry hunts so hard for the right catalyst.'
      ),
      B.reason('logical',
        'A catalyst is added to a reversible reaction that currently favours products at equilibrium. What does the catalyst change?',
        [
          'It shifts the equilibrium further toward the products',
          'It speeds up both the forward and backward reactions equally, so equilibrium is reached faster but its position is unchanged',
          'It increases the amount of product obtainable at equilibrium',
          'It makes the reaction release more heat',
        ],
        'A catalyst lowers the barrier for both directions equally, so it accelerates the approach to equilibrium without moving where equilibrium lies. $\\Delta H$, $\\Delta G$ and $K_{eq}$ are untouched — only the speed changes, not the destination.',
        3
      ),
      B.sim('energy-profile-explorer', 'Add a catalyst — what changes, what doesn’t', {
        prompt: 'When you toggle the catalyst on, which of these changes?',
        options: ['The activation energy (barrier) only', 'The heat released ΔH only', 'Both the barrier and ΔH'],
        reveal_after: 'A catalyst lowers the barrier (Eₐ) — speeding the reaction — but the reactant and product levels do not move, so ΔH, ΔG and the equilibrium position are untouched. Toggle the catalyst in the sim and watch only the peak drop while the two end-levels stay fixed.',
      }),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**A catalyst:** lowers $E_a$ via an alternative path; is not consumed; does NOT change $\\Delta H$, $\\Delta G$, $K_{eq}$ or the equilibrium position (speeds forward and backward equally); cannot drive a non-spontaneous reaction.\n\n**Speed-up factor:** $\\dfrac{k_{\\text{cat}}}{k} = e^{(E_a - E_a\')/RT}$ — $A$ cancels. A small $E_a$ drop gives a large rate increase (exponential).\n\n**Types:** homogeneous (same phase) vs heterogeneous (different phase, e.g. solid catalyst, gas reactants). Negative catalyst = inhibitor (slows the reaction).'
      ),
      B.quiz([
        {
          question: 'A catalyst increases the rate of a reaction by:',
          options: [
            'Increasing the activation energy of the reaction',
            'Providing an alternative path with a lower barrier',
            'Raising the overall temperature of the reaction',
            'Shifting the equilibrium toward the product side',
          ],
          correct_index: 1,
          explanation: 'A catalyst opens a new route with a smaller barrier, so more collisions succeed. It does not raise temperature, nor shift equilibrium.',
          difficulty_level: 1,
        },
        {
          question: 'Which quantity is NOT changed by adding a catalyst to a reaction?',
          options: [
            'The rate of the reaction',
            'The position of equilibrium ($K_{eq}$ and $\\Delta G$)',
            'The activation energy',
            'The time taken to reach equilibrium',
          ],
          correct_index: 1,
          explanation: 'A catalyst leaves $\\Delta H$, $\\Delta G$ and $K_{eq}$ — the equilibrium position — untouched. It changes the rate, the activation energy, and how quickly equilibrium is reached.',
          difficulty_level: 2,
        },
        {
          question: 'A catalyst lowers the activation energy by $8.314$ kJ/mol at 300 K. The rate increases by a factor of about:',
          options: [
            '3',
            '28',
            '100',
            '8.3',
          ],
          correct_index: 1,
          explanation: '$k_{\\text{cat}}/k = e^{8314/(8.314\\times300)} = e^{3.33} \\approx 28$. A modest barrier drop gives a large rate increase because it is exponentiated.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL4 batch B done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
