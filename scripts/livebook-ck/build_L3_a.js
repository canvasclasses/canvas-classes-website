'use strict';
/* Chemical Kinetics — Lecture 3, batch A: pages 24–26 (mechanisms & types, reversible/opposing, parallel). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 24 ─────────────────────────────────────────────────────────────
  page(24, 'reaction-mechanisms-and-types',
    'Reaction Mechanisms: The Hidden Story',
    'The overall equation is the headline; the mechanism is the full report. You can never quite prove it — only rule out the stories that do not fit.',
    ['chemical-kinetics', 'mechanism', 'reversible', 'parallel', 'consecutive'],
    [
      B.hero(
        'A single overall reaction arrow at the top, unfolding below into a branching map of hidden intermediate steps — the visible summary versus the real route',
        'Ultra-wide cinematic banner (16:5 ratio). At the top, a single clean reaction arrow (the overall equation). Below it, the same reaction unfolds into a branching network of smaller intermediate steps and short-lived species — the hidden route the reaction actually takes. The contrast: a one-line summary versus the real multi-step story. Deep near-black background, orange accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'A **reaction mechanism** is the detailed, step-by-step molecular story of how reactants actually become products — the sequence of elementary steps, including any short-lived **intermediates** that appear and vanish along the way. The overall equation is only a summary; the mechanism is what really happens.'
      ),
      B.callout('note', 'You can disprove a mechanism, never fully prove one',
        'Here is the honest limit of the science. Kinetics lets you **test** a proposed mechanism against the measured rate law: if the mechanism predicts a different rate law, it is wrong and you throw it out. But if it predicts the *right* rate law, you have only shown it is *consistent* — another, untested mechanism might fit equally well. A mechanism is the best surviving story, not a proven fact.'
      ),
      B.text(
        'Most complex reactions are built from three recurring patterns, and the rest of this lecture takes them one at a time:\n\n- **Reversible (opposing) reactions** — the products can turn back into reactants, so a forward and a backward reaction run at once.\n- **Parallel (concurrent) reactions** — one reactant gives two or more different products by competing routes at the same time.\n- **Consecutive (sequential) reactions** — the reaction proceeds in a chain, $\\ce{A -> I -> P}$, through an intermediate.'
      ),
      B.reason('logical',
        'A proposed mechanism for a reaction correctly predicts the experimentally measured rate law. A student concludes, "so this mechanism is definitely the right one." Why is that claim too strong?',
        [
          'Because a mechanism can never predict a rate law at all',
          'Because agreeing with the rate law only shows the mechanism is consistent with the data — a different mechanism might predict the same rate law, so kinetics can rule mechanisms out but cannot prove one uniquely',
          'Because the rate law is irrelevant to the mechanism',
          'Because mechanisms can only be tested by measuring temperature',
        ],
        'Matching the rate law makes a mechanism plausible, not proven. Other mechanisms can sometimes predict the same rate law, so consistency is necessary but not sufficient. Kinetics is powerful for *eliminating* wrong mechanisms, not for crowning a unique winner.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Mechanism logic:** kinetics can *rule out* a mechanism (wrong predicted rate law) but cannot *prove* one. "This mechanism is consistent with the rate law" is the strongest correct phrasing.\n\n**Three patterns to know:** reversible/opposing, parallel/concurrent, consecutive/sequential. Each has its own signature relations (coming up) — recognising which pattern a question describes is half the battle.'
      ),
      B.quiz([
        {
          question: 'What can kinetic data (the measured rate law) do for a proposed reaction mechanism?',
          options: [
            'Prove beyond any doubt that the proposed mechanism is correct',
            'Rule it out if the predicted rate law is wrong, else show consistency',
            'Reveal the exact three-dimensional shape of every intermediate',
            'Nothing at all, because mechanisms simply cannot be tested',
          ],
          correct_index: 1,
          explanation: 'A mechanism that predicts the wrong rate law is eliminated; one that predicts the right rate law is merely consistent, since other mechanisms might fit too. Kinetics disproves, it does not prove.',
          difficulty_level: 2,
        },
        {
          question: 'A short-lived species that is formed in one step of a mechanism and consumed in a later step is called:',
          options: [
            'A catalyst added to the reaction',
            'A reaction intermediate',
            'A final product of the reaction',
            'A spectator species',
          ],
          correct_index: 1,
          explanation: 'An intermediate is produced then consumed within the mechanism, so it does not appear in the overall equation. A catalyst is added and regenerated; a product remains at the end.',
          difficulty_level: 1,
        },
        {
          question: 'Which set correctly names the three common patterns of complex reactions?',
          options: [
            'Fast reactions, medium reactions and slow reactions',
            'Reversible, parallel and consecutive reactions',
            'Zero-order, first-order and second-order reactions',
            'Acidic reactions, basic reactions and neutral reactions',
          ],
          correct_index: 1,
          explanation: 'The three structural patterns are reversible/opposing, parallel/concurrent and consecutive/sequential. The other options describe speed, order or pH — not mechanism patterns.',
          difficulty_level: 1,
        },
      ]),
    ]
  ),

  // ── PAGE 25 ─────────────────────────────────────────────────────────────
  page(25, 'reversible-opposing-reactions',
    'Reversible (Opposing) Reactions',
    'When the products fight back: the net rate is the forward rate minus the backward rate, and that single idea leads straight to the equilibrium constant.',
    ['chemical-kinetics', 'reversible-reaction', 'opposing', 'equilibrium-constant', 'net-rate'],
    [
      B.hero(
        'A figure walking forward and back along a line — several steps ahead, a couple back — with a net displacement arrow showing the small forward progress',
        'Ultra-wide cinematic banner (16:5 ratio). A stylised figure on a horizontal line taking several steps forward and a couple of steps back; a single net-displacement arrow shows the small overall forward progress. The idea: net motion is forward minus backward. Deep near-black background, orange figure and arrow, clean cinematic technical style. No text.'
      ),
      B.text(
        'In a **reversible (opposing) reaction**, the products can turn back into reactants, so two reactions run at the same time. For $\\ce{A <=>[k_1][k_{-1}] B}$, A converts to B at rate $k_1[\\ce{A}]$ (forward) while B converts back to A at rate $k_{-1}[\\ce{B}]$ (backward). Think of walking: four steps forward, two steps back — your **net** progress is two. The net rate of the reaction is the forward rate *minus* the backward rate:'
      ),
      B.latex('\\text{net rate} = k_1[\\ce{A}] - k_{-1}[\\ce{B}]', 'Net rate of an opposing reaction',
        'Forward rate minus backward rate. Early on $[\\ce{B}]$ is small, so the forward term dominates; as $[\\ce{B}]$ grows, the backward term catches up.'),
      B.heading('Where kinetics meets equilibrium'),
      B.text(
        'As B builds up, the backward reaction speeds up until it exactly matches the forward one. At that point the net rate is **zero** — this is **equilibrium**. Notice nothing has stopped: both reactions are still running, just at equal and opposite rates. Setting the net rate to zero:\n\n$$k_1[\\ce{A}]_{eq} = k_{-1}[\\ce{B}]_{eq}.$$\n\nRearranging gives one of the most beautiful links in all of chemistry — the **equilibrium constant is the ratio of the two rate constants**:'
      ),
      B.latex('K_{eq} = \\frac{[\\ce{B}]_{eq}}{[\\ce{A}]_{eq}} = \\frac{k_1}{k_{-1}}', 'Equilibrium constant from rate constants',
        'Kinetics (the $k$ values) and thermodynamics (the equilibrium constant) are tied together by this single relation.'),
      B.reason('logical',
        'For a reversible reaction $\\ce{A <=> B}$, a student says "at equilibrium the reaction has stopped, so both the forward and backward rates are zero." What is wrong with this?',
        [
          'Nothing — at equilibrium everything stops',
          'At equilibrium the NET rate is zero, but the forward and backward reactions are both still running — they are simply equal and opposite, so the concentrations no longer change',
          'Only the forward reaction stops at equilibrium',
          'Equilibrium can never be reached in a reversible reaction',
        ],
        'Equilibrium is dynamic. The forward and backward reactions continue at equal rates, so the net rate (and the concentrations) stop changing — but neither individual reaction has stopped. Setting the *net* rate to zero gives $k_1[\\ce{A}] = k_{-1}[\\ce{B}]$, hence $K_{eq} = k_1/k_{-1}$.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Net rate $= k_1[\\ce{A}] - k_{-1}[\\ce{B}]$**; at equilibrium net rate $= 0$, giving $K_{eq} = \\dfrac{k_1}{k_{-1}}$. This connects your kinetics to the equilibrium chapter — expect to compute one rate constant from the other plus $K_{eq}$.\n\n**Trap:** "$k_{\\text{forward}} = k_{\\text{backward}}$ because at equilibrium the rates are equal." The *rates* are equal ($k_1[\\ce{A}] = k_{-1}[\\ce{B}]$), not the rate *constants* — they are equal only if $[\\ce{A}]_{eq} = [\\ce{B}]_{eq}$, i.e. $K_{eq}=1$.'
      ),
      B.quiz([
        {
          question: 'For a reversible reaction $\\ce{A <=>[k_1][k_{-1}] B}$, the net rate of reaction is:',
          options: [
            '$k_1[\\ce{A}] + k_{-1}[\\ce{B}]$',
            '$k_1[\\ce{A}] - k_{-1}[\\ce{B}]$',
            '$k_1[\\ce{A}] \\times k_{-1}[\\ce{B}]$',
            '$k_1[\\ce{B}] - k_{-1}[\\ce{A}]$',
          ],
          correct_index: 1,
          explanation: 'Net rate is forward minus backward: $k_1[\\ce{A}] - k_{-1}[\\ce{B}]$. The forward reaction consumes A; the backward reaction regenerates it.',
          difficulty_level: 1,
        },
        {
          question: 'For $\\ce{A <=> B}$, the equilibrium constant is related to the rate constants by:',
          options: [
            '$K_{eq} = k_1 \\times k_{-1}$',
            '$K_{eq} = \\dfrac{k_1}{k_{-1}}$',
            '$K_{eq} = k_1 - k_{-1}$',
            '$K_{eq} = \\dfrac{k_{-1}}{k_1}$',
          ],
          correct_index: 1,
          explanation: 'At equilibrium $k_1[\\ce{A}] = k_{-1}[\\ce{B}]$, so $K_{eq} = [\\ce{B}]/[\\ce{A}] = k_1/k_{-1}$ — the forward constant over the backward one.',
          difficulty_level: 2,
        },
        {
          question: 'At equilibrium in a reversible reaction:',
          options: [
            'Both the forward and the backward reactions have fully stopped',
            'The forward and backward reactions run at equal rates, net zero',
            'Only the backward reaction continues to run onward',
            'The rate constants $k_1$ and $k_{-1}$ become exactly equal',
          ],
          correct_index: 1,
          explanation: 'Equilibrium is dynamic: both reactions continue at equal, opposite rates, so the net rate is zero and concentrations stop changing. The rate constants need not be equal — their ratio is $K_{eq}$.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 26 ─────────────────────────────────────────────────────────────
  page(26, 'parallel-reactions',
    'Parallel (Concurrent) Reactions',
    'One reactant, two destinations, a single race — and the branching ratio is fixed by the rate constants alone.',
    ['chemical-kinetics', 'parallel-reaction', 'concurrent', 'branching-ratio', 'yield'],
    [
      B.hero(
        'A single reactant at a fork in the road splitting into two product streams of different widths, the wider stream carrying the faster reaction',
        'Ultra-wide cinematic banner (16:5 ratio). A single glowing stream of reactant arriving at a fork and splitting into two product streams of clearly different widths — the wider, brighter stream is the faster route. The idea: one reactant, two competing destinations. Deep near-black background, orange streams and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'In a **parallel (concurrent) reaction**, a single reactant is consumed by two or more competing routes at the same time, giving different products. Take both routes as first order:\n\n$$\\ce{A ->[k_1] B} \\qquad \\ce{A ->[k_2] C}.$$\n\nA is being used up by *both* paths at once, so its total rate of disappearance adds the two:\n\n$$-\\frac{d[\\ce{A}]}{dt} = (k_1 + k_2)[\\ce{A}].$$\n\nSo A decays first order with an **overall rate constant $k_1 + k_2$** — faster than either path alone.'
      ),
      B.heading('The branching ratio is fixed by the rate constants'),
      B.text(
        'How does the reactant split between B and C? Since both products form from the same A, at every instant their rates of formation are in the ratio of the rate constants — and that fixes the final split:'
      ),
      B.latex('\\frac{[\\ce{B}]}{[\\ce{C}]} = \\frac{k_1}{k_2}, \\qquad \\%\\,\\ce{B} = \\frac{k_1}{k_1 + k_2}\\times 100', 'Branching ratio and yield',
        'The fraction of A that becomes a given product (its yield) is that path’s rate constant over the sum of all the rate constants.'),
      B.worked('Worked Example — splitting the yield',
        'A substance A decomposes by two parallel first-order paths: $\\ce{A ->[k_1] B}$ with $k_1 = 1.26\\times10^{-4}\\,\\text{s}^{-1}$, and $\\ce{A ->[k_2] C}$ with $k_2 = 3.8\\times10^{-5}\\,\\text{s}^{-1}$. Find the percentage of B and of C formed.',
        'The yield of each product is its rate constant over the total — the $[\\ce{A}]$ cancels, so you never need a concentration or a time.\n\n**Step 1 — add the rate constants.** Write both in the same power: $k_1 = 12.6\\times10^{-5}$ and $k_2 = 3.8\\times10^{-5}\\,\\text{s}^{-1}$, so $k_1 + k_2 = 16.4\\times10^{-5}\\,\\text{s}^{-1}$.\n\n**Step 2 — percentage of B.**\n\n$$\\%\\,\\ce{B} = \\frac{k_1}{k_1+k_2}\\times100 = \\frac{12.6}{16.4}\\times100 \\approx 76.8\\%.$$\n\n**Step 3 — percentage of C.**\n\n$$\\%\\,\\ce{C} = \\frac{k_2}{k_1+k_2}\\times100 = \\frac{3.8}{16.4}\\times100 \\approx 23.2\\%.$$\n\n**Answer: about 77% B and 23% C.** The faster path simply claims the larger share — and the split holds at *every* moment, not just at the end.'
      ),
      B.callout('threads_of_curiosity', 'Why your sunglasses darken',
        'Photochromic ("transition") lenses darken in sunlight and clear indoors through competing reactions of silver and copper ions embedded in the glass. The same competition idea governs which product a molecule chooses: in organic chemistry, a single starting material can react by two routes at once — for example substitution by an $S_N1$ versus an $S_N2$ path — and the faster route wins the larger share, exactly as the branching ratio predicts.'
      ),
      B.reason('quantitative',
        'A reactant decomposes by two parallel first-order paths with $k_1 = 3k_2$. What fraction of the reactant ends up as the product of the faster ($k_1$) path?',
        [
          'One-half, because there are two paths',
          'Three-quarters, because the yield of a path is its rate constant over the sum: $k_1/(k_1+k_2) = 3k_2/4k_2 = 3/4$',
          'One-third, because $k_1 = 3k_2$',
          'It depends on how much reactant you start with',
        ],
        'Yield $= k_1/(k_1+k_2)$. With $k_1 = 3k_2$, that is $3k_2/(3k_2+k_2) = 3/4$. The faster path takes three-quarters; the split depends only on the rate constants, not on the starting amount.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Parallel-reaction relations:** overall $k = k_1 + k_2$; $\\dfrac{[\\ce{B}]}{[\\ce{C}]} = \\dfrac{k_1}{k_2}$ at all times; yield of a path $= \\dfrac{k_i}{\\sum k}$. The $[\\ce{A}]$ always cancels, so yields need no concentration or time.\n\n**Same activation-energy logic later:** the overall activation energy of parallel paths is a weighted average of the branch $E_a$ values — a Lecture-4 follow-up to this page.'
      ),
      B.quiz([
        {
          question: 'For two parallel first-order paths $\\ce{A ->[k_1] B}$ and $\\ce{A ->[k_2] C}$, the overall rate constant for the disappearance of A is:',
          options: [
            '$k_1 - k_2$',
            '$k_1 + k_2$',
            '$k_1 \\times k_2$',
            '$\\sqrt{k_1 k_2}$',
          ],
          correct_index: 1,
          explanation: 'A is consumed by both paths at once, so $-\\frac{d[\\ce{A}]}{dt} = (k_1+k_2)[\\ce{A}]$ — the overall constant is the sum $k_1+k_2$.',
          difficulty_level: 1,
        },
        {
          question: 'In parallel first-order reactions, the ratio of products $[\\ce{B}]/[\\ce{C}]$ is:',
          options: [
            'Equal to $k_1/k_2$ at all times during the reaction',
            'Equal to $k_1/k_2$ only at the very end',
            'Dependent on the starting concentration of A',
            'Always equal to 1',
          ],
          correct_index: 0,
          explanation: 'Both products form from the same A, so their rates of formation are in the constant ratio $k_1/k_2$ at every instant — the $[\\ce{A}]$ cancels.',
          difficulty_level: 2,
        },
        {
          question: 'A reactant splits by two parallel paths with rate constants $k_1$ and $k_2$. The percentage yield of the $k_1$ product is:',
          options: [
            '$\\dfrac{k_1}{k_2}\\times 100$',
            '$\\dfrac{k_1}{k_1 + k_2}\\times 100$',
            '$\\dfrac{k_2}{k_1 + k_2}\\times 100$',
            '$\\dfrac{k_1 + k_2}{k_1}\\times 100$',
          ],
          correct_index: 1,
          explanation: 'The yield of a path is its own rate constant over the sum of all rate constants: $\\%\\,\\ce{B} = \\frac{k_1}{k_1+k_2}\\times100$.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL3 batch A done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
