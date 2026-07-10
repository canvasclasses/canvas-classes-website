// CEQ practice page — end-of-chapter Practice for Chemical Equilibrium (Ch.6).
// Built from NCERT Exemplar Chapter 7 (Equilibrium), restricted to the
// equilibrium sub-topics that map to this book's Chemical Equilibrium chapter
// (ionic-equilibrium items like Q7-Q14, Q22-Q36 acid/base/Ksp are excluded).
// One practice_bank block, four sub-topic sections.
// Question stems + options transcribed from 11-Chemistry-Exemplar-Chapter-7.pdf.
// Worked solutions from 11-Chemistry-Exemplar-Chapter-7-answer.pdf, EXCEPT:
//   - Q50: answer CORRECTED to (iii) — the official key prints (iv), which is wrong.
//   - Q52: not in the official key; solution supplied per the build spec.
module.exports = {
  page_number: 17,
  chapter: 6,
  slug: 'chemical-equilibrium-practice',
  title: 'Practice — Chemical Equilibrium',
  subtitle: 'Every NCERT textbook exercise and NCERT Exemplar question for the chapter, by sub-topic.',
  build(h) {
    const ncert = require('./ncert_ceq');
    const sections = [
          {
            id: 'sec-basics',
            title: 'Equilibrium & Physical Equilibria',
            blurb: 'Characteristics of equilibrium, physical equilibria, vapour pressure, and phase coexistence.',
            items: [
              {
                kind: 'mcq',
                id: 'ceq-ex-q3',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q3',
                prompt: 'Which of the following is **not** a general characteristic of equilibria involving physical processes?',
                options: [
                  'Equilibrium is possible only in a closed system at a given temperature.',
                  'All measurable properties of the system remain constant.',
                  'All the physical processes stop at equilibrium.',
                  'The opposing processes occur at the same rate and there is dynamic but stable condition.',
                ],
                correct_index: 2,
                explanation: 'Equilibrium is **dynamic**, not static. The forward and reverse processes never stop — they merely run at equal rates, so the measurable amounts stay constant while molecules keep moving back and forth. Statement (iii) wrongly claims the physical processes stop, so it is the one that is NOT a characteristic of physical equilibria.',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q17',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q17',
                prompt: 'What will be the correct order of vapour pressure of water, acetone and ether at $30\\,^\\circ\\text{C}$? Given that among these compounds, water has maximum boiling point and ether has minimum boiling point.',
                options: [
                  'Water $<$ ether $<$ acetone',
                  'Water $<$ acetone $<$ ether',
                  'Ether $<$ acetone $<$ water',
                  'Acetone $<$ ether $<$ water',
                ],
                correct_index: 1,
                explanation: 'A liquid that boils at a low temperature is volatile — its molecules escape easily, so its vapour pressure is **high**. Vapour pressure and boiling point run opposite to each other. Ether has the lowest boiling point, so the highest vapour pressure; water has the highest boiling point, so the lowest vapour pressure. Ordering vapour pressure from low to high: water $<$ acetone $<$ ether.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q21',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q21',
                prompt: 'At a particular temperature and atmospheric pressure, the solid and liquid phases of a pure substance can exist in equilibrium. Which of the following terms defines this temperature? *(Two or more options may be correct.)*\n\n' +
                  '- (i) Normal melting point\n' +
                  '- (ii) Equilibrium temperature\n' +
                  '- (iii) Boiling point\n' +
                  '- (iv) Freezing point',
                answer: '(i) and (iv)',
                solution: 'The temperature at which the **solid and liquid phases of a pure substance coexist** at atmospheric pressure is the temperature where the solid melts and, equally, the liquid freezes — they are the same point approached from two sides.\n\n' +
                  '- Going solid → liquid, this temperature is the **normal melting point** → option (i).\n' +
                  '- Going liquid → solid, the very same temperature is the **freezing point** → option (iv).\n\n' +
                  'Boiling point (iii) is a liquid ⇌ vapour equilibrium, not solid ⇌ liquid, so it is wrong. "Equilibrium temperature" (ii) is too vague — every equilibrium has one. **Correct: (i) and (iv).**',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q38',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q38',
                prompt: 'Match the following equilibria with the corresponding condition.\n\n' +
                  '| Column I (equilibrium) | Column II (condition) |\n' +
                  '|---|---|\n' +
                  '| (i) Liquid $\\rightleftharpoons$ Vapour | (a) Saturated solution |\n' +
                  '| (ii) Solid $\\rightleftharpoons$ Liquid | (b) Boiling point |\n' +
                  '| (iii) Solid $\\rightleftharpoons$ Vapour | (c) Sublimation point |\n' +
                  '| (iv) Solute (s) $\\rightleftharpoons$ Solute (solution) | (d) Melting point |\n' +
                  '| | (e) Unsaturated solution |',
                answer: '(i)→(b), (ii)→(d), (iii)→(c), (iv)→(a)',
                solution: 'Match each phase change to the condition where its two phases coexist:\n\n' +
                  '- **(i) Liquid $\\rightleftharpoons$ Vapour → (b) Boiling point.** The liquid and its vapour are in equilibrium at the boiling point.\n' +
                  '- **(ii) Solid $\\rightleftharpoons$ Liquid → (d) Melting point.** Solid and liquid coexist at the melting point.\n' +
                  '- **(iii) Solid $\\rightleftharpoons$ Vapour → (c) Sublimation point.** A solid in equilibrium with its vapour defines the sublimation point.\n' +
                  '- **(iv) Solute (s) $\\rightleftharpoons$ Solute (solution) → (a) Saturated solution.** Undissolved solute in equilibrium with dissolved solute is a saturated solution.\n\n' +
                  'Option (e) unsaturated solution is left unused — an unsaturated solution has no undissolved solute, so there is no equilibrium.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q42',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q42',
                prompt: 'Match the following graphical variation (concentration vs time) with their description.\n\n' +
                  '| Column A (graph) | Column B (description) |\n' +
                  '|---|---|\n' +
                  '| (i) A curve that **starts high and falls**, then levels off | (a) Variation in product concentration with time |\n' +
                  '| (ii) A curve that **starts low and rises**, then levels off | (b) Reaction at equilibrium |\n' +
                  '| (iii) Two curves (one falling, one rising) that **meet and level off together** | (c) Variation in reactant concentration with time |',
                answer: '(i)→(c), (ii)→(a), (iii)→(b)',
                solution: 'Read each curve as "what is this concentration doing over time":\n\n' +
                  '- **(i) Decreasing curve → (c) Variation in reactant concentration with time.** Reactants are consumed, so their concentration falls and then flattens.\n' +
                  '- **(ii) Increasing curve → (a) Variation in product concentration with time.** Products build up, so their concentration rises and then flattens.\n' +
                  '- **(iii) The curves levelling off together → (b) Reaction at equilibrium.** Once both reactant and product concentrations stop changing, the reaction has reached equilibrium.',
              },
            ],
          },
          {
            id: 'sec-kc',
            title: 'The Equilibrium Constant (Kc, Kp)',
            blurb: 'Writing Kc, the Kc–Kp link (Δn), and how Kc changes when the equation is scaled or reversed.',
            items: [
              {
                kind: 'mcq',
                id: 'ceq-ex-q1',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q1',
                prompt: 'We know that the relationship between $K_c$ and $K_p$ is\n\n' +
                  '$$K_p = K_c (RT)^{\\Delta n}$$\n\n' +
                  'What would be the value of $\\Delta n$ for the reaction $\\ce{NH4Cl(s) <=> NH3(g) + HCl(g)}$?',
                options: ['1', '0.5', '1.5', '2'],
                correct_index: 3,
                explanation: '$\\Delta n$ counts only the **gaseous** moles: (moles of gaseous products) $-$ (moles of gaseous reactants). The products $\\ce{NH3(g)}$ and $\\ce{HCl(g)}$ give 2 moles of gas; the reactant $\\ce{NH4Cl}$ is a solid and counts as 0. So $\\Delta n = 2 - 0 = 2$.',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q4',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q4',
                prompt: '$\\ce{PCl5}$, $\\ce{PCl3}$ and $\\ce{Cl2}$ are at equilibrium at $500\\text{ K}$ in a closed container and their concentrations are $0.8 \\times 10^{-3}\\text{ mol L}^{-1}$, $1.2 \\times 10^{-3}\\text{ mol L}^{-1}$ and $1.2 \\times 10^{-3}\\text{ mol L}^{-1}$ respectively. The value of $K_c$ for the reaction $\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$ will be:',
                options: [
                  '$1.8 \\times 10^{3}\\text{ mol L}^{-1}$',
                  '$1.8 \\times 10^{-3}$',
                  '$1.8 \\times 10^{-3}\\text{ L mol}^{-1}$',
                  '$0.55 \\times 10^{4}$',
                ],
                correct_index: 1,
                explanation: 'Write $K_c$ with products on top:\n\n' +
                  '$$K_c = \\frac{[\\ce{PCl3}][\\ce{Cl2}]}{[\\ce{PCl5}]} = \\frac{(1.2 \\times 10^{-3})(1.2 \\times 10^{-3})}{0.8 \\times 10^{-3}} = 1.8 \\times 10^{-3}.$$\n\n' +
                  'The magnitude $1.8 \\times 10^{-3}$ picks option (ii). (The proper unit here is $\\text{mol L}^{-1}$, since one extra concentration sits on top; option (iii) has the unit wrong, so (ii) is the intended answer.)',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q18',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q18',
                prompt: 'At $500\\text{ K}$, the equilibrium constant $K_c$ for the reaction\n\n' +
                  '$$\\tfrac{1}{2}\\ce{H2(g)} + \\tfrac{1}{2}\\ce{I2(g)} \\rightleftharpoons \\ce{HI(g)}$$\n\n' +
                  'is $5$. What would be the equilibrium constant $K_c$ for the reaction $\\ce{2HI(g) <=> H2(g) + I2(g)}$?',
                options: ['0.04', '0.4', '25', '2.5'],
                correct_index: 0,
                explanation: 'Doubling a reaction **squares** its $K$; reversing a reaction **inverts** its $K$.\n\n' +
                  '- Start: $\\tfrac12\\ce{H2} + \\tfrac12\\ce{I2} \\rightleftharpoons \\ce{HI}$, $K = 5$.\n' +
                  '- Double it → $\\ce{H2 + I2 <=> 2HI}$, $K = 5^2 = 25$.\n' +
                  '- Reverse it → $\\ce{2HI <=> H2 + I2}$, $K = 1/25 = 0.04$.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q39',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q39',
                prompt: 'For the reaction $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ the equilibrium constant is\n\n' +
                  '$$K_c = \\frac{[\\ce{NH3}]^2}{[\\ce{N2}][\\ce{H2}]^3}.$$\n\n' +
                  'Some reactions are written below in Column I and their equilibrium constants in terms of $K_c$ in Column II. Match them.\n\n' +
                  '| Column I (reaction) | Column II (equilibrium constant) |\n' +
                  '|---|---|\n' +
                  '| (i) $\\ce{2N2(g) + 6H2(g) <=> 4NH3(g)}$ | (a) $2K_c$ |\n' +
                  '| (ii) $\\ce{2NH3(g) <=> N2(g) + 3H2(g)}$ | (b) $K_c^{1/2}$ |\n' +
                  '| (iii) $\\tfrac{1}{2}\\ce{N2(g)} + \\tfrac{3}{2}\\ce{H2(g)} \\rightleftharpoons \\ce{NH3(g)}$ | (c) $1/K_c$ |\n' +
                  '| | (d) $K_c^{2}$ |',
                answer: '(i)→(d), (ii)→(c), (iii)→(b)',
                solution: 'Scaling the equation by a factor $n$ raises $K$ to the power $n$; reversing inverts $K$.\n\n' +
                  '- **(i) Multiply by 2** ($\\ce{2N2 + 6H2 <=> 4NH3}$): the constant becomes $K_c^2$ → **(d)**.\n' +
                  '- **(ii) Reverse** ($\\ce{2NH3 <=> N2 + 3H2}$): the constant becomes $1/K_c$ → **(c)**.\n' +
                  '- **(iii) Halve** ($\\tfrac12\\ce{N2} + \\tfrac32\\ce{H2} \\rightleftharpoons \\ce{NH3}$): the constant becomes $K_c^{1/2}$ → **(b)**.\n\n' +
                  'Option (a) $2K_c$ is a distractor — scaling never just multiplies $K$ by the factor; it raises it to that power.',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q47',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q47',
                prompt: '**Assertion (A):** For any chemical reaction at a particular temperature, the equilibrium constant is fixed and is a characteristic property.\n\n' +
                  '**Reason (R):** Equilibrium constant is independent of temperature.',
                options: [
                  'Both A and R are true and R is the correct explanation of A',
                  'Both A and R are true but R is not the correct explanation of A',
                  'A is true but R is false',
                  'Both A and R are false',
                ],
                correct_index: 2,
                explanation: 'Assertion is **true**: at a *fixed* temperature, $K$ has one fixed value and is a characteristic of the reaction. Reason is **false**: $K$ is **not** independent of temperature — it changes when the temperature changes (that is the whole point of "at a particular temperature"). True A, false R → option (iii).',
              },
            ],
          },
          {
            id: 'sec-q-dg',
            title: 'Reaction Quotient, Direction & ΔG–K',
            blurb: 'Using Q vs Kc to predict direction, and the link between ΔG, ΔG°, K and Q.',
            items: [
              {
                kind: 'mcq',
                id: 'ceq-ex-q2',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q2',
                prompt: 'For the reaction $\\ce{H2(g) + I2(g) <=> 2HI(g)}$, the standard free energy is $\\Delta G^\\circ > 0$. The equilibrium constant $(K)$ would be ______.',
                options: ['$K = 0$', '$K > 1$', '$K = 1$', '$K < 1$'],
                correct_index: 3,
                explanation: 'The link is $\\Delta G^\\circ = -RT\\ln K$. If $\\Delta G^\\circ > 0$, then $\\ln K < 0$, which means $K < 1$. A positive $\\Delta G^\\circ$ tells you the reaction is reactant-favoured, so its equilibrium constant is less than 1.',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q15',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q15',
                prompt: 'Which of the following options will be correct for the stage of half completion of the reaction $\\ce{A <=> B}$?',
                options: [
                  '$\\Delta G^\\circ = 0$',
                  '$\\Delta G^\\circ > 0$',
                  '$\\Delta G^\\circ < 0$',
                  '$\\Delta G^\\circ = -RT\\ln 2$',
                ],
                correct_index: 0,
                explanation: 'Use $\\Delta G^\\circ = -RT\\ln K$. At the stage of half completion the reaction is taken with $[\\ce{A}] = [\\ce{B}]$, so\n\n' +
                  '$$K = \\frac{[\\ce{B}]}{[\\ce{A}]} = 1 \\quad\\Rightarrow\\quad \\Delta G^\\circ = -RT\\ln 1 = 0.$$\n\n' +
                  'So at half completion $\\Delta G^\\circ = 0$ → option (i).',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q28',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q28',
                prompt: 'The value of $K_c$ for the reaction $\\ce{2HI(g) <=> H2(g) + I2(g)}$ is $1 \\times 10^{-4}$. At a given time, the composition of the reaction mixture is\n\n' +
                  '$$[\\ce{HI}] = 2 \\times 10^{-5}\\text{ mol}, \\quad [\\ce{H2}] = 1 \\times 10^{-5}\\text{ mol}, \\quad [\\ce{I2}] = 1 \\times 10^{-5}\\text{ mol}.$$\n\n' +
                  'In which direction will the reaction proceed?',
                answer: 'Reverse direction (Q = 0.25 > Kc = 10⁻⁴)',
                solution: 'Compute the reaction quotient $Q$ in the same form as $K_c$ (products of the written reaction on top):\n\n' +
                  '$$Q = \\frac{[\\ce{H2}][\\ce{I2}]}{[\\ce{HI}]^2} = \\frac{(1 \\times 10^{-5})(1 \\times 10^{-5})}{(2 \\times 10^{-5})^2} = \\frac{1 \\times 10^{-10}}{4 \\times 10^{-10}} = \\frac{1}{4} = 0.25 = 2.5 \\times 10^{-1}.$$\n\n' +
                  'Compare with $K_c = 1 \\times 10^{-4}$. Here $Q > K_c$, so there is too much product relative to equilibrium. The reaction proceeds in the **reverse (backward) direction** to bring $Q$ back down to $K_c$.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q40',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q40',
                prompt: 'Match the standard free energy of the reaction with the corresponding equilibrium constant.\n\n' +
                  '| Column I | Column II |\n' +
                  '|---|---|\n' +
                  '| (i) $\\Delta G^\\circ > 0$ | (a) $K > 1$ |\n' +
                  '| (ii) $\\Delta G^\\circ < 0$ | (b) $K = 1$ |\n' +
                  '| (iii) $\\Delta G^\\circ = 0$ | (c) $K = 0$ |\n' +
                  '| | (d) $K < 1$ |',
                answer: '(i)→(d), (ii)→(a), (iii)→(b)',
                solution: 'From $\\Delta G^\\circ = -RT\\ln K$, the sign of $\\Delta G^\\circ$ fixes how $K$ compares with 1:\n\n' +
                  '- **(i) $\\Delta G^\\circ > 0$** → $\\ln K < 0$ → $K < 1$ → **(d)** (reactant-favoured).\n' +
                  '- **(ii) $\\Delta G^\\circ < 0$** → $\\ln K > 0$ → $K > 1$ → **(a)** (product-favoured).\n' +
                  '- **(iii) $\\Delta G^\\circ = 0$** → $\\ln K = 0$ → $K = 1$ → **(b)**.\n\n' +
                  'Option (c) $K = 0$ is unused — $K$ is never exactly zero for a real equilibrium.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q43',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q43',
                prompt: 'Match Column I with Column II.\n\n' +
                  '| Column I | Column II |\n' +
                  '|---|---|\n' +
                  '| (i) Equilibrium | (a) $\\Delta G > 0,\\ K < 1$ |\n' +
                  '| (ii) Spontaneous reaction | (b) $\\Delta G = 0$ |\n' +
                  '| (iii) Non-spontaneous reaction | (c) $\\Delta G^\\circ = 0$ |\n' +
                  '| | (d) $\\Delta G < 0,\\ K > 1$ |',
                answer: '(i)→(b), (ii)→(d), (iii)→(a)',
                solution: 'The driving sign is $\\Delta G$ (the actual free-energy change at that instant), not $\\Delta G^\\circ$:\n\n' +
                  '- **(i) Equilibrium → (b) $\\Delta G = 0$.** At equilibrium there is no net drive in either direction, so $\\Delta G = 0$.\n' +
                  '- **(ii) Spontaneous reaction → (d) $\\Delta G < 0,\\ K > 1$.** A negative $\\Delta G$ means the reaction runs forward on its own; product-favoured ($K > 1$).\n' +
                  '- **(iii) Non-spontaneous reaction → (a) $\\Delta G > 0,\\ K < 1$.** A positive $\\Delta G$ means it will not run forward on its own.\n\n' +
                  '**Caveat:** the Exemplar key also pairs (i) Equilibrium with (c) $\\Delta G^\\circ = 0$. But $\\Delta G^\\circ = 0$ only when $K = 1$, which is a special case — equilibrium in general just needs $\\Delta G = 0$ (b), whatever $K$ is. So (b) is the clean, always-true match.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q51',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q51',
                prompt: 'How can you predict the following stages of a reaction by comparing the value of $K_c$ and $Q_c$?\n\n' +
                  '- (i) Net reaction proceeds in the forward direction.\n' +
                  '- (ii) Net reaction proceeds in the backward direction.\n' +
                  '- (iii) No net reaction occurs.',
                answer: '(i) Qc < Kc; (ii) Qc > Kc; (iii) Qc = Kc',
                solution: '$Q_c$ is the reaction quotient — the same fraction as $K_c$, but evaluated from the **current** concentrations rather than the equilibrium ones. The reaction always moves to make $Q_c$ approach $K_c$:\n\n' +
                  '- **(i) Forward direction when $Q_c < K_c$.** There is not enough product yet, so the reaction makes more product, raising $Q_c$ up to $K_c$.\n' +
                  '- **(ii) Backward direction when $Q_c > K_c$.** There is too much product, so the reaction runs in reverse, lowering $Q_c$ down to $K_c$.\n' +
                  '- **(iii) No net reaction when $Q_c = K_c$.** The mixture is already at equilibrium, so there is no net change.\n\n' +
                  'where $Q_c$ is the reaction quotient in terms of concentration and $K_c$ is the equilibrium constant.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q54',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q54',
                prompt: 'Write a relation between $\\Delta G$ and $Q$ and define the meaning of each term, then answer:\n\n' +
                  '(a) Why does a reaction proceed forward when $Q < K$ and reach no net reaction when $Q = K$?\n\n' +
                  '(b) Explain the effect of an increase in pressure in terms of the reaction quotient $Q$ for the reaction $\\ce{CO(g) + 3H2(g) <=> CH4(g) + H2O(g)}$.',
                answer: 'ΔG = ΔG° + RT ln Q = RT ln(Q/K); Q<K → ΔG<0 (forward); Q=K → ΔG=0 (no net). Raising pressure makes Q<K, so this reaction goes forward.',
                solution: '**The relation.**\n\n' +
                  '$$\\Delta G = \\Delta G^\\circ + RT\\ln Q$$\n\n' +
                  'where\n' +
                  '- $\\Delta G$ = free-energy change of the reaction as it stands (the actual driving force),\n' +
                  '- $\\Delta G^\\circ$ = standard free-energy change,\n' +
                  '- $Q$ = reaction quotient,\n' +
                  '- $R$ = gas constant,\n' +
                  '- $T$ = absolute temperature.\n\n' +
                  '**(a) Why $Q < K$ drives the reaction forward.** Since $\\Delta G^\\circ = -RT\\ln K$, substitute it in:\n\n' +
                  '$$\\Delta G = -RT\\ln K + RT\\ln Q = RT\\ln\\frac{Q}{K}.$$\n\n' +
                  '- If $Q < K$, then $Q/K < 1$, so $\\ln(Q/K) < 0$ and $\\Delta G < 0$. A negative $\\Delta G$ means the reaction is spontaneous in the **forward** direction.\n' +
                  '- If $Q = K$, then $Q/K = 1$, so $\\ln(Q/K) = 0$ and $\\Delta G = 0$ — **no net reaction**; the system is at equilibrium.\n\n' +
                  '**(b) Effect of increasing pressure on $\\ce{CO(g) + 3H2(g) <=> CH4(g) + H2O(g)}$.** This reaction goes from 4 moles of gas (1 + 3) to 2 moles of gas (1 + 1). Increasing the pressure means reducing the volume, which raises the concentration of every gas. Because there are more gas molecules on the reactant side (the $\\ce{H2}$ term is cubed in the denominator), squeezing the system **lowers $Q$ below $K$**. With $Q < K$, $\\Delta G < 0$, so the reaction proceeds in the **forward** direction (toward fewer gas moles) to re-establish equilibrium.',
              },
            ],
          },
          {
            id: 'sec-lechat',
            title: 'Le Chatelier, Factors & Industry',
            blurb: 'Le Chatelier’s principle: temperature, pressure, concentration, inert gas, and the Haber process.',
            items: [
              {
                kind: 'mcq',
                id: 'ceq-ex-q5',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q5',
                prompt: 'Which of the following statements is **incorrect**?',
                options: [
                  'In an equilibrium mixture of ice and water kept in a perfectly insulated flask, the mass of ice and water does not change with time.',
                  'The intensity of red colour increases when oxalic acid is added to a solution containing iron(III) nitrate and potassium thiocyanate.',
                  'On addition of a catalyst the equilibrium constant value is not affected.',
                  'Equilibrium constant for a reaction with negative $\\Delta H$ value decreases as the temperature increases.',
                ],
                correct_index: 1,
                explanation: 'The red colour comes from the $\\ce{[Fe(SCN)]^{2+}}$ complex. Oxalic acid pulls the $\\ce{Fe^{3+}}$ out into a stable iron-oxalate complex, removing $\\ce{Fe^{3+}}$ from the equilibrium and **fading** the red colour. Statement (ii) claims the colour *increases*, which is the opposite — so it is the incorrect statement. (The other three are all true: ice/water is a stable equilibrium; a catalyst never changes $K$; and for exothermic reactions $K$ falls as $T$ rises.)',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q6',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q6',
                prompt: 'When hydrochloric acid is added to cobalt nitrate solution at room temperature, the following reaction takes place and the reaction mixture becomes blue. On cooling the mixture it becomes pink. On the basis of this information mark the correct answer.\n\n' +
                  '$$\\underset{\\text{(pink)}}{\\ce{[Co(H2O)6]^{3+}(aq)}} + \\ce{4Cl^{-}(aq)} \\rightleftharpoons \\underset{\\text{(blue)}}{\\ce{[CoCl4]^{2-}(aq)}} + \\ce{6H2O(l)}$$',
                options: [
                  '$\\Delta H > 0$ for the reaction',
                  '$\\Delta H < 0$ for the reaction',
                  '$\\Delta H = 0$ for the reaction',
                  'The sign of $\\Delta H$ cannot be predicted on the basis of this information.',
                ],
                correct_index: 0,
                explanation: 'Cooling shifts the equilibrium **back** to pink (the reactant side). By Le Chatelier, cooling favours the exothermic direction — so the **reverse** reaction is exothermic, which makes the **forward** reaction endothermic. Therefore $\\Delta H > 0$ for the forward reaction → option (i).',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q16',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q16',
                prompt: 'On increasing the pressure, the direction in which a gas-phase reaction proceeds to re-establish equilibrium is predicted by applying Le Chatelier’s principle. Consider the reaction\n\n' +
                  '$$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}.$$\n\n' +
                  'Which of the following is correct, if the total pressure at which the equilibrium is established is increased without changing the temperature?',
                options: [
                  'K will remain same',
                  'K will decrease',
                  'K will increase',
                  'K will increase initially and decrease when pressure is very high',
                ],
                correct_index: 0,
                explanation: 'The equilibrium constant $K$ depends **only on temperature**. Changing the pressure shifts the *position* of equilibrium (here, toward fewer gas moles, i.e. more $\\ce{NH3}$), but the value of $K$ stays exactly the same as long as the temperature is unchanged. So K will remain same → option (i).',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q19',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q19',
                prompt: 'In which of the following reactions does the equilibrium remain **unaffected** on addition of a small amount of argon **at constant volume**?',
                options: [
                  '$\\ce{H2(g) + I2(g) <=> 2HI(g)}$',
                  '$\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$',
                  '$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$',
                  'The equilibrium will remain unaffected in all the three cases.',
                ],
                correct_index: 3,
                explanation: 'Adding an inert gas (argon) **at constant volume** does not change the partial pressures or concentrations of any of the reacting gases. Since the actual concentrations are untouched, $Q$ stays equal to $K$ and there is no shift — **for every** reaction, regardless of how its moles change. So the equilibrium is unaffected in all three cases → option (iv).',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q20',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q20',
                prompt: 'For the reaction $\\ce{N2O4(g) <=> 2NO2(g)}$, the value of $K$ is $50$ at $400\\text{ K}$ and $1700$ at $500\\text{ K}$. Which of the following options is correct? *(Two or more options may be correct.)*\n\n' +
                  '- (i) The reaction is endothermic.\n' +
                  '- (ii) The reaction is exothermic.\n' +
                  '- (iii) If $\\ce{NO2(g)}$ and $\\ce{N2O4(g)}$ are mixed at $400\\text{ K}$ at partial pressures $20\\text{ bar}$ and $2\\text{ bar}$ respectively, more $\\ce{N2O4(g)}$ will be formed.\n' +
                  '- (iv) The entropy of the system increases.',
                answer: '(i), (iii) and (iv)',
                solution: 'Work through each option:\n\n' +
                  '- **(i) Endothermic — correct.** $K$ rises from 50 (at 400 K) to 1700 (at 500 K). For $K$ to increase with temperature, the forward reaction must be endothermic ($\\Delta H > 0$). So (ii) exothermic is wrong.\n' +
                  '- **(iii) More $\\ce{N2O4}$ forms — correct.** At 400 K, $K = 50$. Compute $Q$:\n\n' +
                  '$$Q = \\frac{p_{\\ce{NO2}}^2}{p_{\\ce{N2O4}}} = \\frac{(20)^2}{2} = \\frac{400}{2} = 200.$$\n\n' +
                  'Since $Q = 200 > K = 50$, the reaction runs in **reverse**, converting $\\ce{NO2}$ into $\\ce{N2O4}$ — so more $\\ce{N2O4}$ is formed.\n' +
                  '- **(iv) Entropy increases — correct.** The forward reaction goes from 1 mole of gas to 2 moles of gas, so $\\Delta n_{gas} > 0$ and the disorder (entropy) of the system increases, $\\Delta S > 0$.\n\n' +
                  '**Correct options: (i), (iii) and (iv).**',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q37',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q37',
                prompt: 'The following data is given for the reaction $\\ce{CaCO3(s) -> CaO(s) + CO2(g)}$:\n\n' +
                  '$$\\Delta_f H^\\circ[\\ce{CaO(s)}] = -635.1\\text{ kJ mol}^{-1}$$\n' +
                  '$$\\Delta_f H^\\circ[\\ce{CO2(g)}] = -393.5\\text{ kJ mol}^{-1}$$\n' +
                  '$$\\Delta_f H^\\circ[\\ce{CaCO3(s)}] = -1206.9\\text{ kJ mol}^{-1}$$\n\n' +
                  'Predict the effect of temperature on the equilibrium constant of the above reaction.',
                answer: 'ΔrH° = +178.3 kJ/mol (endothermic) → K increases with temperature.',
                solution: 'Compute the reaction enthalpy as (products) $-$ (reactants):\n\n' +
                  '$$\\Delta_r H^\\circ = \\big(\\Delta_f H^\\circ[\\ce{CaO}] + \\Delta_f H^\\circ[\\ce{CO2}]\\big) - \\Delta_f H^\\circ[\\ce{CaCO3}]$$\n\n' +
                  '$$\\Delta_r H^\\circ = \\big((-635.1) + (-393.5)\\big) - (-1206.9) = -1028.6 + 1206.9 = +178.3\\text{ kJ mol}^{-1}.$$\n\n' +
                  'Since $\\Delta_r H^\\circ$ is **positive**, the reaction is **endothermic**. By Le Chatelier’s principle, raising the temperature favours the endothermic (forward) direction, so the **equilibrium constant $K$ increases with temperature**.',
              },
              {
                kind: 'mcq',
                id: 'ceq-ex-q50',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q50',
                prompt: '**Assertion (A):** In the dissociation of $\\ce{PCl5}$ at constant pressure and temperature, addition of helium at equilibrium increases the dissociation of $\\ce{PCl5}$.\n\n' +
                  '**Reason (R):** Helium removes $\\ce{Cl2}$ from the field of action.',
                options: [
                  'Both A and R are true and R is the correct explanation of A',
                  'Both A and R are true but R is not the correct explanation of A',
                  'A is true but R is false',
                  'Both A and R are false',
                ],
                correct_index: 2,
                explanation: 'Assertion is **true**. For $\\ce{PCl5 <=> PCl3 + Cl2}$ the gas moles increase (1 → 2, so $\\Delta n > 0$). Adding helium **at constant pressure** forces the total volume to grow, which lowers the partial pressures of all the reacting gases. By Le Chatelier, the equilibrium shifts toward the side with more gas moles — the products — so dissociation of $\\ce{PCl5}$ **increases**.\n\nReason is **false**: helium is an inert gas and does NOT remove $\\ce{Cl2}$ from the system; nothing is chemically taken out. So true A, false R → option (iii).\n\n*Note:* the official Exemplar answer key prints (iv), but that is an error — the assertion is genuinely true, as the constant-pressure volume increase shows.',
              },
              {
                kind: 'numerical',
                id: 'ceq-ex-q52',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q52',
                prompt: 'On the basis of Le Chatelier’s principle, explain how temperature and pressure can be adjusted to increase the yield of ammonia in the following reaction.\n\n' +
                  '$$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}, \\qquad \\Delta H = -92.38\\text{ kJ mol}^{-1}.$$\n\n' +
                  'What will be the effect of addition of argon to the above reaction mixture at constant volume?',
                answer: 'Low (moderate) temperature + high pressure raise NH₃ yield; argon at constant volume has no effect.',
                solution: 'This is the Haber process. Read the two clues in the equation: the forward reaction is **exothermic** ($\\Delta H = -92.38\\text{ kJ mol}^{-1}$) and it goes from **4 moles of gas to 2 moles of gas** (1 + 3 → 2).\n\n' +
                  '**Temperature.** Since the forward reaction releases heat, a **low temperature** shifts the equilibrium toward more $\\ce{NH3}$ and raises the yield. In practice the temperature is kept **moderate (around 700 K)** with an iron catalyst — a temperature too low makes the reaction unworkably slow, so we trade a little yield for a usable rate.\n\n' +
                  '**Pressure.** The product side has fewer gas moles (2 vs 4), so **high pressure** pushes the equilibrium toward $\\ce{NH3}$ and increases the yield.\n\n' +
                  '**Adding argon at constant volume.** Argon is inert. At **constant volume**, adding it does not change the partial pressures or concentrations of $\\ce{N2}$, $\\ce{H2}$ or $\\ce{NH3}$. So $Q$ stays equal to $K$ and there is **no shift** — the yield of ammonia is unchanged.',
              },
            ],
          },
    ];
    // Merge NCERT textbook exercises into each section (textbook questions first, then Exemplar).
    for (const s of sections) if (ncert[s.id]) s.items = [...ncert[s.id], ...s.items];
    return [
      h.bank(
        'Practice — Chemical Equilibrium',
        'Every NCERT textbook exercise and NCERT Exemplar question for this chapter, organised by sub-topic. Pick a section on the left. The longer questions reveal a full worked solution; MCQs and assertion-reason check instantly.',
        sections
      ),
    ];
  },
};
