'use strict';
/* Chemical Kinetics — Lecture 4, batch C: pages 36–37 (enzyme catalysis, chapter mastery + mixed PYQ). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 36 ─────────────────────────────────────────────────────────────
  page(36, 'enzyme-catalysis',
    'Enzyme Catalysis: Life’s Master Catalysts',
    'Biological catalysts so efficient and so fussy that one enzyme speeds up exactly one reaction — and runs the chemistry of life at body temperature.',
    ['chemical-kinetics', 'enzyme', 'catalysis', 'lock-and-key', 'denaturation'],
    [
      B.hero(
        'A large folded enzyme with a notch-shaped active site into which a small substrate molecule fits like a key into a lock',
        'Ultra-wide cinematic banner (16:5 ratio). A large folded protein enzyme with a precisely notch-shaped active site; a small substrate molecule fits snugly into it like a key into a lock. The mood is precise and biological. Deep near-black background, soft green-orange enzyme glow, clean cinematic technical style. No text.'
      ),
      B.text(
        '**Enzymes** are biological catalysts — usually proteins — and they are extraordinary. They run the reactions of life in dilute solution at body temperature ($37\\,^\\circ\\text{C}$), often speeding them up millions of times. Without them, the reactions that digest your food and power your cells would crawl far too slowly to keep you alive.'
      ),
      B.heading('The lock and key'),
      B.text(
        'An enzyme is highly **specific**: each one catalyses essentially a single reaction, because its **active site** has a shape that fits only its particular reactant (the **substrate**) — a lock that accepts just one key. The substrate binds, reacts, and the products leave, freeing the enzyme to start again:\n\n$$\\ce{E + S <=> ES -> EP -> E + P}.$$\n\nThe enzyme E is regenerated at the end (E + P) — exactly what a catalyst should do. By holding the substrate in just the right way, the enzyme slashes the activation energy: catalase, for instance, drops the barrier for $\\ce{H2O2}$ decomposition from about $75$ to $23\\,\\text{kJ mol}^{-1}$.'
      ),
      B.img(
        'A cycle: free enzyme and free substrate combine into an enzyme–substrate complex, react to an enzyme–product complex, then release products and regenerate the free enzyme',
        '📸 The enzyme cycle: substrate binds, reacts, products leave, and the enzyme is regenerated',
        'A four-stage cycle diagram. Stage 1: a free enzyme (large shape with a notch) and a free substrate (small shape) side by side. Stage 2: they combine into an enzyme–substrate complex (substrate sitting in the notch). Stage 3: an enzyme–product complex (the substrate now converted). Stage 4: the products leave and the free enzyme is regenerated, ready again. Label E + S, ES, EP, E + P. Dark background (#0a0a0a), green-orange accents, clean technical illustration.'
      ),
      B.heading('Why enzymes hate heat'),
      B.text(
        'Enzymes show an unusual temperature behaviour. Like any reaction, the rate first **rises** as you warm it up — more energy, faster reaction. But past an **optimum temperature** (around body temperature), the rate suddenly **collapses**, because the heat unravels the protein’s delicate folded shape. This is **denaturation**: the active site loses its precise geometry, the lock no longer fits the key, and catalysis stops. So an enzyme reaction’s rate-versus-temperature graph rises to a peak and then falls steeply — quite unlike the ever-rising Arrhenius curve.'
      ),
      B.img(
        'A graph of reaction rate against temperature for an enzyme: rising to a peak at an optimum temperature, then falling sharply as the enzyme denatures',
        '📸 Enzyme rate vs temperature: a rise to an optimum, then a sharp fall as the enzyme denatures',
        'Graph of reaction rate (y-axis) versus temperature (x-axis) for an enzyme-catalysed reaction: the curve rises to a clear peak at an "optimum temperature" (near body temperature), then falls steeply toward zero as temperature increases further. Label the optimum and the falling "denaturation" region. Contrast note: unlike an ordinary Arrhenius curve which keeps rising. Dark background (#0a0a0a), orange curve and labels, clean technical illustration.'
      ),
      B.reason('logical',
        'For most reactions, raising the temperature always increases the rate. For an enzyme-catalysed reaction, the rate rises, peaks, then falls sharply as temperature increases. Why the difference?',
        [
          'Enzymes do not obey the Arrhenius equation at any temperature',
          'Above an optimum temperature the enzyme’s protein structure denatures, destroying the shape of its active site, so catalysis fails even though the molecules have more energy',
          'The substrate runs out faster at high temperature',
          'Enzymes release heat that cools the reaction down',
        ],
        'Up to the optimum, more heat means a faster reaction as usual. Beyond it, heat unfolds (denatures) the enzyme, wrecking the active site so the substrate no longer fits — and the rate plunges. The fall is a structural failure, not a normal kinetic effect.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Enzyme essentials:** biological catalysts (proteins), highly specific (lock-and-key active site), cycle $\\ce{E + S <=> ES -> EP -> E + P}$ with the enzyme regenerated, and they lower $E_a$ enormously.\n\n**The signature graph:** rate vs temperature *rises to an optimum then falls sharply* (denaturation) — pick this "inverted-U / peak" curve in graph-identification questions, not the ever-rising Arrhenius curve. NEET especially likes "which graph represents an enzyme reaction?"'
      ),
      B.quiz([
        {
          question: 'Enzymes are described as highly "specific" because each enzyme:',
          options: [
            'Works only at a very high reaction temperature',
            'Catalyses essentially one reaction, its site fitting one substrate',
            'Is steadily consumed during the reaction it catalyses',
            'Can speed up almost any reaction it is added to',
          ],
          correct_index: 1,
          explanation: 'An enzyme’s active site has a shape that accepts only its matching substrate — a lock-and-key fit — so it catalyses essentially one reaction. Like all catalysts, it is regenerated, not consumed.',
          difficulty_level: 1,
        },
        {
          question: 'The rate of an enzyme-catalysed reaction falls sharply above an optimum temperature because:',
          options: [
            'The substrate simply evaporates away from the mixture',
            'The enzyme denatures, losing its active-site shape',
            'The activation energy suddenly increases on its own',
            'The reaction abruptly becomes strongly exothermic',
          ],
          correct_index: 1,
          explanation: 'Beyond the optimum, heat unfolds the enzyme’s protein structure (denaturation), destroying the active site, so it can no longer bind substrate — the rate collapses.',
          difficulty_level: 2,
        },
        {
          question: 'Which graph of rate versus temperature represents an enzyme-catalysed reaction?',
          options: [
            'A curve that rises continuously with rising temperature',
            'A curve that rises to a peak, then falls sharply away',
            'A flat horizontal straight line at all temperatures',
            'A curve that falls continuously as temperature rises',
          ],
          correct_index: 1,
          explanation: 'Enzyme reactions speed up to an optimum then slow abruptly as the enzyme denatures — a rise-then-fall (peaked) curve, unlike the continuously rising Arrhenius curve.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 37 ─────────────────────────────────────────────────────────────
  page(37, 'chapter-mastery-chemical-kinetics',
    'Chapter Mastery: Putting It All Together',
    'The whole chapter in one breath, then three exam favourites that braid the ideas together.',
    ['chemical-kinetics', 'mastery', 'practice', 'pyq', 'revision'],
    [
      B.hero(
        'A single timeline weaving together the chapter’s ideas — a falling concentration curve, an energy hill, and a catalyst tunnel — into one connected path',
        'Ultra-wide cinematic banner (16:5 ratio). A single connected path weaving together the chapter’s big ideas: a falling concentration–time curve flows into an energy hill with a transition-state peak, which flows into a catalyst tunnel through the hill. The idea: one chapter, one connected story from rate to mechanism to catalysis. Deep near-black background, orange path and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'Here is the whole chapter in one breath. **Rate** is how fast a reaction goes; the **rate law** $\\text{rate} = k[\\ce{A}]^x[\\ce{B}]^y$ has powers (the **order**) found by experiment, and $k$ depends only on temperature. **Integrated rate laws** turn the order into a usable equation — zero order is a straight line ($t_{1/2} \\propto [\\ce{A}]_0$), first order is exponential ($t_{1/2} = 0.693/k$, constant), second order is reciprocal ($t_{1/2} \\propto 1/[\\ce{A}]_0$). Complex reactions run through **mechanisms** (reversible, parallel, consecutive), where the slow step or the steady state sets the rate law. Finally, **temperature** and **catalysts** act through the **Arrhenius equation** $k = Ae^{-E_a/RT}$ and the activation-energy barrier. Now braid it together.'
      ),
      B.worked('Mastery 1 — overall activation energy of parallel paths',
        'A reactant decomposes by two parallel paths with rate constants $k_1 = 1.0\\times10^{-2}$ and $k_2 = 3.0\\times10^{-2}$ (same units) and activation energies $E_{a1} = 60$ and $E_{a2} = 70\\,\\text{kJ mol}^{-1}$. Find the apparent overall activation energy.',
        'For parallel reactions the overall activation energy is the **rate-constant-weighted average** of the branch values:\n\n$$E_a(\\text{overall}) = \\frac{k_1 E_{a1} + k_2 E_{a2}}{k_1 + k_2}.$$\n\n**Substitute** (the $10^{-2}$ factors cancel top and bottom):\n\n$$E_a = \\frac{(1)(60) + (3)(70)}{1 + 3} = \\frac{60 + 210}{4} = \\frac{270}{4} = 67.5\\ \\text{kJ mol}^{-1}.$$\n\n**Answer: $67.5\\,\\text{kJ mol}^{-1}$.** The overall barrier leans toward the *faster* path (larger $k_2$), so it sits closer to $70$ than to $60$ — a weighted average, not a plain one.'
      ),
      B.worked('Mastery 2 — a catalyst that matches a hotter run',
        'An uncatalysed reaction at $500$ K proceeds at the same rate as the catalysed reaction at $400$ K. The catalyst lowers the activation energy by $20\\,\\text{kJ mol}^{-1}$. Find the (uncatalysed) activation energy $E_a$.',
        'Equal *rates* with the same pre-exponential $A$ means the Boltzmann factors match: $A e^{-E_a/RT_1} = A e^{-E_a\'/RT_2}$, so the exponents are equal:\n\n$$\\frac{E_a}{T_1} = \\frac{E_a\'}{T_2}, \\qquad E_a\' = E_a - 20.$$\n\n**Substitute** $T_1 = 500$ K (uncatalysed) and $T_2 = 400$ K (catalysed):\n\n$$\\frac{E_a}{500} = \\frac{E_a - 20}{400}.$$\n\n**Cross-multiply and solve:**\n\n$$400\\,E_a = 500\\,(E_a - 20) \\;\\Rightarrow\\; 400 E_a = 500 E_a - 10000 \\;\\Rightarrow\\; 100 E_a = 10000.$$\n\n**Answer: $E_a = 100\\,\\text{kJ mol}^{-1}$** (and the catalysed barrier is $80\\,\\text{kJ mol}^{-1}$). The trick was recognising that equal rates at equal $A$ force $E_a/T$ to be equal — no value of $A$ or the rate is ever needed.'
      ),
      B.worked('Mastery 3 — pinning the order without solving anything',
        'A reaction’s rate constant is quoted with units $\\text{L mol}^{-1}\\text{s}^{-1}$, and separately its half-life is found to *halve* when the initial concentration is doubled. Confirm the order two independent ways.',
        'Two of the chapter’s detective tricks, both pointing the same way.\n\n**Way 1 — units of $k$.** The general unit is $(\\text{mol L}^{-1})^{1-n}\\,\\text{s}^{-1}$. Here $k$ is in $\\text{L mol}^{-1}\\text{s}^{-1} = (\\text{mol L}^{-1})^{-1}\\text{s}^{-1}$, so $1 - n = -1$, giving $n = 2$.\n\n**Way 2 — half-life scaling.** $t_{1/2} \\propto [\\ce{A}]_0^{1-n}$. The half-life halved when concentration doubled, so $t_{1/2} \\propto [\\ce{A}]_0^{-1}$, i.e. $1 - n = -1$, again $n = 2$.\n\n**Answer: second order**, confirmed independently by the units of $k$ and by the half-life scaling. When two separate clues agree, you can be confident without ever solving a rate equation.'
      ),
      B.callout('quest_continues', 'Where kinetics goes next',
        'You now have the tools chemists used to crack one of the great puzzles of our atmosphere — the catalytic cycles that destroy ozone, where a single chlorine atom from a CFC can speed the breakdown of *thousands* of ozone molecules before it is removed. The same steady-state and rate-law thinking on this page is what let scientists trace that damage and win a Nobel Prize for it. The next frontier is **femtochemistry**: using laser flashes lasting a millionth of a billionth of a second to actually *watch* a transition state form and break — catching, in real time, the fleeting peak this chapter could only draw.'
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Chapter strategy:** kinetics is a small, friendly, shortcut-rich chapter with a great variety of PYQs — most questions reward a confident, quick read over heavy algebra.\n\n**Keep these reflexes:** order not stated? read the units of $k$, or how $t_{1/2}$ scales with $[\\ce{A}]_0$. Times at two temperatures? use $k_2/k_1 = t_1/t_2$. Equal rates with a catalyst? set $E_a/T$ equal. Parallel paths? weight by the rate constants. A given number quietly equal to a half-life? spot it before you compute.'
      ),
      B.quiz([
        {
          question: 'A reactant decomposes by two parallel paths with $k_1 : k_2 = 1 : 3$ and activation energies 60 and 70 kJ/mol. The apparent overall activation energy is:',
          options: [
            '$65.0\\,\\text{kJ mol}^{-1}$',
            '$67.5\\,\\text{kJ mol}^{-1}$',
            '$70.0\\,\\text{kJ mol}^{-1}$',
            '$130.0\\,\\text{kJ mol}^{-1}$',
          ],
          correct_index: 1,
          explanation: 'Weighted by rate constants: $E_a = \\frac{(1)(60)+(3)(70)}{1+3} = \\frac{270}{4} = 67.5$ kJ/mol — closer to the faster path’s value.',
          difficulty_level: 3,
        },
        {
          question: 'An uncatalysed reaction at 500 K runs at the same rate as the catalysed one at 400 K, the catalyst lowering $E_a$ by 20 kJ/mol. The uncatalysed $E_a$ is:',
          options: [
            '$80\\,\\text{kJ mol}^{-1}$',
            '$100\\,\\text{kJ mol}^{-1}$',
            '$120\\,\\text{kJ mol}^{-1}$',
            '$25\\,\\text{kJ mol}^{-1}$',
          ],
          correct_index: 1,
          explanation: 'Equal rates (same $A$) give $E_a/T_1 = E_a\'/T_2$: $\\frac{E_a}{500} = \\frac{E_a-20}{400}$, so $100E_a = 10000$ and $E_a = 100$ kJ/mol.',
          difficulty_level: 3,
        },
        {
          question: 'A reaction’s half-life is independent of the initial concentration, and the rate constant has units of $\\text{s}^{-1}$. The reaction is:',
          options: [
            'Zero order',
            'First order',
            'Second order',
            'Third order',
          ],
          correct_index: 1,
          explanation: 'A concentration-independent half-life and a $k$ in pure per-time units both point to first order — the two detective tricks agree.',
          difficulty_level: 2,
        },
        {
          question: 'Which statement is correct?',
          options: [
            'A catalyst shifts the equilibrium toward the product side',
            'A catalyst lowers $E_a$ without changing $\\Delta H$ or equilibrium',
            'Raising the temperature lowers a reaction’s activation energy',
            'The rate of a reaction is always independent of concentration',
          ],
          correct_index: 1,
          explanation: 'A catalyst lowers $E_a$ via an alternative path but leaves $\\Delta H$, $\\Delta G$ and $K_{eq}$ untouched. Temperature does not lower $E_a$ (it supplies energy to cross it), and rate generally depends on concentration.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL4 batch C done — chapter content complete (37 pages).'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
