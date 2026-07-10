'use strict';
/* Chemical Kinetics — Lecture 2, batch D: pages 21–23 (bacterial growth, second order, order from half-life). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 21 ─────────────────────────────────────────────────────────────
  page(21, 'bacterial-growth-kinetics',
    'First Order in Reverse: Bacterial Growth',
    'The same exponential law that runs decay backwards also runs growth forwards — and it sets how fast an infection doubles.',
    ['chemical-kinetics', 'first-order', 'bacterial-growth', 'generation-time', 'exponential-growth'],
    [
      B.hero(
        'A single bacterium dividing into two, then four, then eight across a timeline, the population doubling at each equal step',
        'Ultra-wide cinematic banner (16:5 ratio). A timeline showing a single glowing bacterium dividing into two, then four, then eight at equal time steps — the population doubling each step. The mood is quiet exponential growth. Deep near-black background, soft green-orange bacterial glow, clean cinematic technical style. No text.'
      ),
      B.text(
        'First-order kinetics does not only describe things falling away — it also describes things multiplying. A growing bacterial colony obeys the *same* exponential law, just running upward: the rate of increase is proportional to how many bacteria are already there. If $N$ is the population,\n\n$$\\frac{dN}{dt} = kN \\quad\\Rightarrow\\quad N_t = N_0\\,e^{kt}.$$\n\nIn the base-10 form, $k = \\dfrac{2.303}{t}\\log\\dfrac{N_t}{N_0}$ — the familiar first-order formula, with the growing population $N_t$ on top instead of the shrinking reactant.'
      ),
      B.heading('Generation time — the doubling clock'),
      B.text(
        'For decay we asked for the *half*-life. For growth we ask for the **generation time** $t_g$ — the time for the population to **double**. Set $N_t = 2N_0$ in the formula and the result mirrors the half-life exactly:'
      ),
      B.latex('t_g = \\frac{0.693}{k}', 'Generation (doubling) time',
        'The growth twin of the half-life: time to double, independent of the current population size.'),
      B.worked('Worked Example — generation time of a culture',
        'A bacterial culture is sampled and gives 48 colonies. A second sample taken 10 minutes later gives 72 colonies. Assuming each colony grows from one bacterium, find the generation time.',
        '**Step 1 — find $k$ from the two counts** (the colony counts stand in for $N_0$ and $N_t$):\n\n$$k = \\frac{2.303}{t}\\log\\frac{N_t}{N_0} = \\frac{2.303}{10}\\log\\frac{72}{48} = 0.2303 \\times \\log 1.5.$$\n\n**Step 2 — evaluate.** $\\log 1.5 = 0.176$, so $k = 0.2303 \\times 0.176 = 0.0406\\,\\text{min}^{-1}$.\n\n**Step 3 — generation time.**\n\n$$t_g = \\frac{0.693}{k} = \\frac{0.693}{0.0406} \\approx 17\\ \\text{minutes}.$$\n\n**Answer: about 17 minutes to double.** Notice it is just the first-order machinery with a growing count — the doubling time plays the role the half-life plays in decay.'
      ),
      B.reason('analogical',
        'A radioactive sample halves every 20 minutes; a bacterial culture doubles every 20 minutes. In what sense are these two processes described by the same kind of law?',
        [
          'They are not related — growth and decay obey completely different mathematics',
          'Both are first-order exponential processes: the rate of change is proportional to the current amount, so a fixed fraction is lost (decay) or gained (growth) in each equal time interval',
          'They are the same only because both take 20 minutes',
          'Both are zero-order, since a fixed time interval is involved',
        ],
        'Both follow $\\frac{dX}{dt} = \\pm kX$, the first-order law. Decay loses a fixed fraction each interval (half-life); growth gains a fixed fraction each interval (generation time). The sign differs, but the exponential structure — and the $0.693/k$ doubling/halving time — is identical.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Growth = first order upward:** $N_t = N_0 e^{kt}$ and $k = \\dfrac{2.303}{t}\\log\\dfrac{N_t}{N_0}$. **Generation time $t_g = \\dfrac{0.693}{k}$** is the doubling twin of the half-life.\n\n**Watch the starting point:** in infection PYQs where a drug takes, say, an hour to reach the site, the population has already grown to $N_0 e^{kt}$ before the killing begins — integrate time from when the drug acts, not from zero. Mis-setting the lower limit is the classic mark-loser.'
      ),
      B.quiz([
        {
          question: 'A growing bacterial population follows $N_t = N_0 e^{kt}$. The "generation time" is the time for the population to:',
          options: [
            'Fall to half its value',
            'Double its value',
            'Reach a fixed maximum',
            'Increase by a fixed number of cells',
          ],
          correct_index: 1,
          explanation: 'Generation time is the doubling time, $t_g = 0.693/k$ — the growth analogue of the half-life. It is a fixed fraction (×2), not a fixed number of cells.',
          difficulty_level: 1,
        },
        {
          question: 'Bacterial growth and radioactive decay are both described as first order because, in each:',
          options: [
            'The amount changes by a fixed number of units per unit time',
            'The rate of change is proportional to the amount present',
            'The whole process always takes the same total time to finish',
            'The surrounding temperature controls the rate completely',
          ],
          correct_index: 1,
          explanation: 'First order means rate $\\propto$ amount present ($dN/dt = \\pm kN$). That gives a fixed *fraction* change per equal interval — doubling for growth, halving for decay.',
          difficulty_level: 2,
        },
        {
          question: 'A culture grows from 48 to 72 colonies in 10 minutes. Its generation time is closest to:',
          options: [
            '7 minutes',
            '17 minutes',
            '34 minutes',
            '50 minutes',
          ],
          correct_index: 1,
          explanation: '$k = \\frac{2.303}{10}\\log\\frac{72}{48} = 0.0406\\,\\text{min}^{-1}$, so $t_g = 0.693/k \\approx 17$ minutes.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 22 ─────────────────────────────────────────────────────────────
  page(22, 'second-order-reactions',
    'Second-Order Reactions',
    'Rate proportional to the square of concentration — a reciprocal-concentration straight line, and a half-life that shrinks as you start with more.',
    ['chemical-kinetics', 'second-order', 'integrated-rate-law', 'half-life', 'saponification'],
    [
      B.hero(
        'A rising straight line of one-over-concentration against time, beside two molecules of the same kind colliding to react',
        'Ultra-wide cinematic banner (16:5 ratio). On the left, a graph of 1/[A] (reciprocal concentration) rising as a straight line against time. On the right, two identical molecules colliding and reacting together. The idea: a reaction whose rate depends on two reactant molecules meeting. Deep near-black background, orange line and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'A **second-order reaction** has a rate proportional to the square of a concentration (or to the product of two concentrations). For a reactant A reacting with itself, $\\text{rate} = k[\\ce{A}]^2$, so\n\n$$-\\frac{d[\\ce{A}]}{dt} = k[\\ce{A}]^2.$$'
      ),
      B.heading('Deriving the second-order law'),
      B.text(
        'Separate the variables and integrate from $[\\ce{A}]_0$ at $t=0$ to $[\\ce{A}]_t$ at time $t$. Because $\\int \\dfrac{d[\\ce{A}]}{[\\ce{A}]^2} = -\\dfrac{1}{[\\ce{A}]}$, the result is a reciprocal law:'
      ),
      B.latex('\\frac{1}{[\\ce{A}]_t} - \\frac{1}{[\\ce{A}]_0} = k t', 'Integrated second-order rate law',
        'A plot of $1/[\\ce{A}]$ against $t$ is a straight line of slope $k$ and intercept $1/[\\ce{A}]_0$.'),
      B.text(
        'So while zero order gives a straight line of $[\\ce{A}]$ vs $t$, and first order a straight line of $\\log[\\ce{A}]$ vs $t$, **second order gives a straight line of $1/[\\ce{A}]$ vs $t$** — rising, with slope $k$. Setting $[\\ce{A}]_t = \\tfrac12[\\ce{A}]_0$ gives the half-life:\n\n$$t_{1/2} = \\frac{1}{k\\,[\\ce{A}]_0}.$$\n\nThis time the half-life is **inversely proportional to the starting concentration** — start with more, and it halves *faster*. That is the opposite of zero order (where more starting material means a longer half-life) and different again from first order (independent).'
      ),
      B.text(
        'Standard second-order examples: the decomposition of $\\ce{2HI -> H2 + I2}$, $\\ce{2NO2 -> 2NO + O2}$, and the alkaline hydrolysis (saponification) of an ester, $\\ce{CH3COOC2H5 + OH- -> CH3COO- + C2H5OH}$, whose rate is $k[\\text{ester}][\\ce{OH-}]$.'
      ),
      B.reason('quantitative',
        'For a second-order reaction, you double the initial concentration of the reactant. What happens to the half-life?',
        [
          'It doubles, because there is more reactant to consume',
          'It stays the same, as with first order',
          'It halves, because $t_{1/2} = \\dfrac{1}{k[\\ce{A}]_0}$ is inversely proportional to the starting concentration',
          'It becomes four times longer',
        ],
        'For second order, $t_{1/2} = 1/(k[\\ce{A}]_0)$, so doubling $[\\ce{A}]_0$ halves the half-life — a more concentrated start reaches its halfway point sooner. (Zero order would double it; first order would leave it unchanged.)',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Second-order toolkit:** $\\dfrac{1}{[\\ce{A}]_t} - \\dfrac{1}{[\\ce{A}]_0} = kt$ (so $1/[\\ce{A}]$ vs $t$ is the straight line); $t_{1/2} = \\dfrac{1}{k[\\ce{A}]_0}$ (inversely proportional to $[\\ce{A}]_0$); units of $k$ are $\\text{L mol}^{-1}\\text{s}^{-1}$.\n\n**The straight-line test:** zero order $\\to$ $[\\ce{A}]$ vs $t$; first order $\\to$ $\\log[\\ce{A}]$ vs $t$; second order $\\to$ $1/[\\ce{A}]$ vs $t$. Examiners ask "which plot is linear?" — match the order to its line.'
      ),
      B.quiz([
        {
          question: 'For a second-order reaction, which plot gives a straight line?',
          options: [
            '$[\\ce{A}]$ against time',
            '$1/[\\ce{A}]$ against time',
            '$\\log[\\ce{A}]$ against time',
            '$[\\ce{A}]^2$ against time',
          ],
          correct_index: 1,
          explanation: 'The integrated law $\\frac{1}{[\\ce{A}]_t} - \\frac{1}{[\\ce{A}]_0} = kt$ makes $1/[\\ce{A}]$ vs $t$ linear (slope $k$). $[\\ce{A}]$ vs $t$ is zero order; $\\log[\\ce{A}]$ vs $t$ is first order.',
          difficulty_level: 1,
        },
        {
          question: 'The half-life of a second-order reaction depends on the initial concentration $[\\ce{A}]_0$ as:',
          options: [
            'Directly proportional to $[\\ce{A}]_0$',
            'Independent of $[\\ce{A}]_0$',
            'Inversely proportional to $[\\ce{A}]_0$',
            'Proportional to $[\\ce{A}]_0^{2}$',
          ],
          correct_index: 2,
          explanation: '$t_{1/2} = 1/(k[\\ce{A}]_0)$, so a larger starting concentration gives a shorter half-life — inversely proportional to $[\\ce{A}]_0$.',
          difficulty_level: 2,
        },
        {
          question: 'Which reaction is a standard example of second-order kinetics?',
          options: [
            'The radioactive decay of an unstable nucleus',
            'The alkaline hydrolysis (saponification) of an ester',
            'The catalytic decomposition of $\\ce{H2O2}$',
            'The thermal decomposition of $\\ce{N2O5}$ gas',
          ],
          correct_index: 1,
          explanation: 'Saponification has rate $k[\\text{ester}][\\ce{OH-}]$ — second order overall. Radioactive decay, $\\ce{H2O2}$ and $\\ce{N2O5}$ decomposition are all first order.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 23 ─────────────────────────────────────────────────────────────
  page(23, 'order-from-half-life',
    'Reading the Order Off the Half-Life',
    'How the half-life responds when you change the starting amount is a fingerprint — it tells you the order without solving a single equation.',
    ['chemical-kinetics', 'order', 'half-life', 'order-determination', 'summary'],
    [
      B.hero(
        'Three half-life bars stacked against rising initial concentration: one growing, one flat, one shrinking — each labelled with an order',
        'Ultra-wide cinematic banner (16:5 ratio). Three horizontal half-life bars shown against an increasing initial concentration axis: the top bar grows longer, the middle stays the same length, the bottom shrinks — visually encoding zero, first and second order. Clean, diagrammatic. Deep near-black background, orange bars and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'You have now seen that the half-life behaves differently for each order — and that difference is a **fingerprint**. In general, the half-life depends on the initial concentration as\n\n$$t_{1/2} \\propto [\\ce{A}]_0^{\\,1-n},$$\n\nwhere $n$ is the order. Watch what the half-life does when you change the starting amount, and the exponent $1-n$ hands you the order directly.'
      ),
      B.table('How the half-life scales with initial concentration',
        ['Order $n$', '$t_{1/2}$ depends on $[\\ce{A}]_0$ as', 'So if you double $[\\ce{A}]_0$, $t_{1/2}$…'],
        [
          ['0', '$t_{1/2} \\propto [\\ce{A}]_0$', 'doubles'],
          ['1', '$t_{1/2}$ independent of $[\\ce{A}]_0$', 'is unchanged'],
          ['2', '$t_{1/2} \\propto 1/[\\ce{A}]_0$', 'halves'],
          ['3', '$t_{1/2} \\propto 1/[\\ce{A}]_0^{2}$', 'falls to one-quarter'],
        ]
      ),
      B.text(
        'So you never need to fit a curve to find the order: just measure the half-life at two different starting concentrations and see how it scaled. Grew in proportion? Zero order. Did not budge? First order. Halved when the concentration doubled? Second order.'
      ),
      B.worked('Worked Example — order from two half-lives',
        'A gaseous compound starting at $56.0$ kPa has a half-life of $340$ s. When the starting pressure is $28.0$ kPa, the half-life is $170$ s. What is the order of the reaction?',
        '**Step 1 — see how the half-life scaled.** The starting pressure was *halved* ($56.0 \\to 28.0$ kPa), and the half-life also *halved* ($340 \\to 170$ s).\n\n**Step 2 — match the scaling to $t_{1/2} \\propto [\\ce{A}]_0^{1-n}$.** The half-life moved in *direct proportion* to the starting pressure, so $t_{1/2} \\propto [\\ce{A}]_0^{1}$, which means $1 - n = 1$.\n\n**Step 3 — solve for the order.**\n\n$$1 - n = 1 \\quad\\Rightarrow\\quad n = 0.$$\n\n**Answer: zero order.** No equation solved — just the proportionality between the half-life and the starting amount. A larger starting amount giving a *longer* half-life is the unmistakable signature of zero order.'
      ),
      B.reason('quantitative',
        'For a reaction, halving the initial concentration leaves the half-life completely unchanged. What is the order?',
        [
          'Zero order, because the half-life is fixed by $k$ and the concentration',
          'First order, because only a first-order half-life is independent of the starting concentration',
          'Second order, because the half-life depends inversely on concentration',
          'Third order, because the half-life depends on the square of concentration',
        ],
        'A half-life that does not change with the starting concentration means $t_{1/2} \\propto [\\ce{A}]_0^{0}$, so $1 - n = 0$ and $n = 1$. Independence of the starting amount is the unique signature of first order.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**The master relation:** $t_{1/2} \\propto [\\ce{A}]_0^{\\,1-n}$. Memorise the ladder — zero $\\propto [\\ce{A}]_0$, first independent, second $\\propto 1/[\\ce{A}]_0$, third $\\propto 1/[\\ce{A}]_0^{2}$.\n\n**The trick PYQ:** two half-lives at two concentrations (or pressures) — compare how $t_{1/2}$ scaled, read $1-n$, done. No formula or value of $k$ is needed. Pair this with the "units of $k$" detective move from Lecture 1: between them, you can pin down an order almost any way a question gives it.'
      ),
      B.quiz([
        {
          question: 'The general dependence of half-life on initial concentration for an $n$-th order reaction is:',
          options: [
            '$t_{1/2} \\propto [\\ce{A}]_0^{\\,1-n}$',
            '$t_{1/2} \\propto [\\ce{A}]_0^{\\,n}$',
            '$t_{1/2} \\propto [\\ce{A}]_0^{\\,n-1}$',
            '$t_{1/2}$ is always independent of $[\\ce{A}]_0$',
          ],
          correct_index: 0,
          explanation: 'The half-life scales as $[\\ce{A}]_0^{1-n}$: this gives $\\propto [\\ce{A}]_0$ for $n=0$, independence for $n=1$, and $\\propto 1/[\\ce{A}]_0$ for $n=2$.',
          difficulty_level: 2,
        },
        {
          question: 'A reaction’s half-life is 340 s at a starting pressure of 56 kPa and 170 s at 28 kPa. The order is:',
          options: [
            'Zero',
            'First',
            'Second',
            'Third',
          ],
          correct_index: 0,
          explanation: 'Halving the pressure halved the half-life, so $t_{1/2} \\propto [\\ce{A}]_0^{1}$, giving $1-n=1$ and $n=0$. A longer half-life at higher concentration means zero order.',
          difficulty_level: 3,
        },
        {
          question: 'If a reaction’s half-life HALVES when you double the initial concentration, the reaction is:',
          options: [
            'Zero order',
            'First order',
            'Second order',
            'It cannot be determined',
          ],
          correct_index: 2,
          explanation: 'Half-life inversely proportional to concentration means $t_{1/2} \\propto 1/[\\ce{A}]_0$, so $1-n=-1$ and $n=2$ — second order.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL2 batch D done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
