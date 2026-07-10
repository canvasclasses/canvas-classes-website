'use strict';
/* Chemical Kinetics — Lecture 2, batch B: pages 14–16 (first order, half-life & shortcuts, first-order practice). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 14 ─────────────────────────────────────────────────────────────
  page(14, 'first-order-reactions',
    'First-Order Reactions: The Workhorse of the Chapter',
    'Rate proportional to concentration — and one formula, $k = \\tfrac{2.303}{t}\\log\\tfrac{a}{a-x}$, that you will use again and again.',
    ['chemical-kinetics', 'first-order', 'integrated-rate-law', 'half-life', 'exponential-decay'],
    [
      B.hero(
        'A smooth exponential decay curve of concentration falling steeply then levelling toward zero, beside a stylised pill dissolving, suggesting a drug clearing from the body',
        'Ultra-wide cinematic banner (16:5 ratio). On the left, a smooth exponential-decay curve: concentration falls steeply at first, then ever more gently toward zero without quite reaching it. On the right, a stylised medicine capsule dissolving into faint particles. The idea: a drug clearing from the blood, halving in fixed steps. Deep near-black background, orange curve and accents, clean cinematic technical style. No text.'
      ),
      B.callout('fun_fact', 'Why a medicine has a "half-life"',
        'When a doctor says paracetamol has a half-life of about two hours, she means that every two hours the amount in your blood halves — 100% to 50% to 25% — *no matter the starting dose*. That fixed-fraction clearance is the fingerprint of a **first-order** process: the rate is proportional to how much is left, so the *time to halve* never changes. The "half-life" you know from medicine is a chemical-kinetics idea.'
      ),
      B.text(
        'A **first-order reaction** is one whose rate is directly proportional to the concentration of a single reactant: $\\text{rate} = k[\\ce{A}]$. Double the reactant and you double the rate. This is the most common and most exam-relevant case in the whole chapter, so the formula below is worth knowing cold.'
      ),
      B.heading('Deriving the first-order law'),
      B.text(
        'Start from $-\\dfrac{d[\\ce{A}]}{dt} = k[\\ce{A}]$. Separate the variables and integrate from $[\\ce{A}]_0$ at $t=0$ to $[\\ce{A}]_t$ at time $t$:\n\n$$\\int_{[\\ce{A}]_0}^{[\\ce{A}]_t} \\frac{d[\\ce{A}]}{[\\ce{A}]} = -\\int_0^t k\\,dt \\quad\\Rightarrow\\quad \\ln\\frac{[\\ce{A}]_0}{[\\ce{A}]_t} = kt.$$\n\nConverting the natural log to base-10 (multiply by $2.303$) gives the form you will actually use:'
      ),
      B.latex('k = \\frac{2.303}{t}\\log\\frac{[\\ce{A}]_0}{[\\ce{A}]_t} = \\frac{2.303}{t}\\log\\frac{a}{a-x}',
        'The first-order workhorse formula',
        'Here $a = [\\ce{A}]_0$ (initial) and $a-x = [\\ce{A}]_t$ (amount left at time $t$). Equivalently, $[\\ce{A}]_t = [\\ce{A}]_0\\,e^{-kt}$.'),
      B.text(
        'In exponential form, $[\\ce{A}]_t = [\\ce{A}]_0\\,e^{-kt}$ — the concentration decays exponentially, fast at first and ever slower. Because rate $= k[\\ce{A}]$, the rate-vs-time and concentration-vs-time graphs have the *same* exponential shape.'
      ),
      B.img(
        'An exponential-decay curve of reactant concentration against time, falling steeply at first and flattening toward — but never touching — zero',
        '📸 First order: concentration decays exponentially, halving in equal time steps',
        'Graph of concentration [A] (y-axis) versus time (x-axis) for a first-order reaction: a smooth exponential-decay curve starting high, falling steeply, then flattening and approaching zero asymptotically without touching it. Dashed guide lines mark the concentration halving at equal time intervals. Dark background (#0a0a0a), orange curve and labels, clean technical illustration, subtle gridlines.'
      ),
      B.text(
        'You will meet first order constantly, so recognise the standard cases: the decomposition of $\\ce{N2O5}$ ($\\ce{2N2O5 -> 4NO2 + O2}$, a favourite in exams), all radioactive decay, the decomposition of $\\ce{H2O2}$, the acid-catalysed hydrolysis of an ester, the inversion of cane sugar, and $\\ce{NH4NO2 -> N2 + 2H2O}$.'
      ),
      B.reason('quantitative',
        'A first-order reaction has rate constant $k$. If you start with twice as much reactant, how does the time taken to consume half of it change?',
        [
          'It doubles, because there is twice as much to get through',
          'It stays exactly the same, because the half-life of a first-order reaction does not depend on the starting concentration',
          'It halves, because more reactant means a faster reaction',
          'It becomes four times longer',
        ],
        'For first order, the time to halve depends only on $k$, not on how much you start with (it equals $0.693/k$). This is the medicine "half-life" idea — the dose does not change the halving time. It is the defining contrast with zero order, whose half-life is proportional to the starting amount.',
        3
      ),
      B.worked('NCERT Example 4.5',
        'The initial concentration of $\\ce{N2O5}$ in the first-order reaction $\\ce{N2O5 -> 2NO2 + 1/2 O2}$ was $1.24\\times10^{-2}\\ \\text{mol L}^{-1}$ at 318 K. After 60 minutes it was $0.20\\times10^{-2}\\ \\text{mol L}^{-1}$. Calculate the rate constant.',
        'Use the first-order formula:\n\n$$k = \\frac{2.303}{t}\\log\\frac{[\\ce{R}]_0}{[\\ce{R}]} = \\frac{2.303}{60}\\log\\frac{1.24\\times10^{-2}}{0.20\\times10^{-2}}.$$\n\n$$= \\frac{2.303}{60}\\log 6.2 = \\frac{2.303}{60}\\times 0.792.$$\n\n$$k = 0.0304\\ \\text{min}^{-1}.$$',
        'ncert_intext'),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Memorise this one formula:** $k = \\dfrac{2.303}{t}\\log\\dfrac{a}{a-x}$. Almost every first-order problem is a substitution into it. Pair it with $[\\ce{A}]_t = [\\ce{A}]_0 e^{-kt}$.\n\n**Units of $k$ are $\\text{s}^{-1}$** (or $\\text{min}^{-1}$) — concentration-free, so a $k$ in pure per-time units flags first order.\n\n**Know the examples** — $\\ce{N2O5}$ decomposition and radioactive decay turn up most often. "Read NCERT like chemistry, not like history": the examiner expects you to recall which standard reactions are first order.'
      ),
      B.quiz([
        {
          question: 'The integrated rate law for a first-order reaction can be written as:',
          options: [
            '$k = \\dfrac{2.303}{t}\\log\\dfrac{a}{a-x}$',
            '$[\\ce{A}]_t = [\\ce{A}]_0 - kt$',
            '$\\dfrac{1}{[\\ce{A}]_t} - \\dfrac{1}{[\\ce{A}]_0} = kt$',
            '$k = \\dfrac{x}{t}$ for all $t$',
          ],
          correct_index: 0,
          explanation: '$k = \\frac{2.303}{t}\\log\\frac{a}{a-x}$ (equivalently $[\\ce{A}]_t = [\\ce{A}]_0 e^{-kt}$) is the first-order law. The straight-line form is zero order; the $1/[\\ce{A}]$ form is second order.',
          difficulty_level: 1,
        },
        {
          question: 'For a first-order reaction, a graph of $[\\ce{A}]$ against time has the shape of:',
          options: [
            'A straight line falling steadily to zero',
            'An exponential decay curve flattening toward zero',
            'A horizontal line at constant concentration',
            'A straight line that rises upward with time',
          ],
          correct_index: 1,
          explanation: 'Since $[\\ce{A}]_t = [\\ce{A}]_0 e^{-kt}$, the concentration decays exponentially. A straight downward line would be zero order.',
          difficulty_level: 2,
        },
        {
          question: 'Which of these reactions is a standard example of first-order kinetics?',
          options: [
            'The decomposition of $\\ce{HI}$ on a hot gold surface',
            'The radioactive decay of an unstable nucleus',
            'Ammonia decomposing on hot platinum at high pressure',
            'The photochemical combination $\\ce{H2 + Cl2 -> 2HCl}$',
          ],
          correct_index: 1,
          explanation: 'Radioactive decay is the classic first-order process (constant half-life). The surface-saturated decompositions and the photochemical $\\ce{H2 + Cl2}$ reaction are standard zero-order examples.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 15 ─────────────────────────────────────────────────────────────
  page(15, 'first-order-half-life-and-shortcuts',
    'First-Order Half-Life and the Equal-Percentage Shortcut',
    'Half-life that ignores the starting amount, a reaction that never quite finishes, and a trick that solves most problems without the formula.',
    ['chemical-kinetics', 'first-order', 'half-life', 'shortcut', 'percentage-drop'],
    [
      B.hero(
        'A concentration bar halving again and again at equal time steps — full, half, quarter, eighth — across a timeline, never reaching empty',
        'Ultra-wide cinematic banner (16:5 ratio). A horizontal timeline with a vertical concentration bar shown at equal time steps: full, then half, then a quarter, then an eighth — each step the same time apart, the bar halving each time but never quite emptying. Clean, rhythmic, almost musical. Deep near-black background, orange bars and accents, cinematic technical style. No text.'
      ),
      B.text(
        'Set $[\\ce{A}]_t = \\tfrac12[\\ce{A}]_0$ in the first-order formula. The starting concentration cancels, leaving a half-life that depends only on $k$:'
      ),
      B.latex('t_{1/2} = \\frac{0.693}{k}', 'First-order half-life',
        '$\\log 2 = 0.301$, and $2.303 \\times 0.301 = 0.693$. Note: NO dependence on $[\\ce{A}]_0$.'),
      B.text(
        'This independence from the starting amount is the **signature** of first order. It is why a drug’s half-life is quoted as a single number regardless of dose, and it is the quickest way to tell first order apart from zero order (whose half-life grows with $[\\ce{A}]_0$) and second order (whose half-life shrinks with it).'
      ),
      B.heading('Halving again and again'),
      B.text(
        'Because every half-life is the same length, the reactant just keeps halving:\n\n$$[\\ce{A}]_0 \\xrightarrow{\\;t_{1/2}\\;} \\frac{[\\ce{A}]_0}{2} \\xrightarrow{\\;t_{1/2}\\;} \\frac{[\\ce{A}]_0}{4} \\xrightarrow{\\;t_{1/2}\\;} \\frac{[\\ce{A}]_0}{8}\\cdots$$\n\nAfter $n$ half-lives, $[\\ce{A}]_t = \\dfrac{[\\ce{A}]_0}{2^{n}}$. Two useful consequences fall out: the time for 75% completion is $t_{75\\%} = 2\\,t_{1/2}$ (because reaching one-quarter left is two halvings), and the reaction **never truly completes** — to reach exactly zero would take infinite time, since the exponential only approaches zero.'
      ),
      B.callout('remember', 'The equal-percentage shortcut',
        'Zero order falls by equal *amounts* in equal time. First order falls by equal **percentages** in equal time. If a reactant drops by 20% in the first 10 minutes, it drops by another 20% of what is *now left* in the next 10 minutes — and so on. So $100 \\to 80 \\to 64 \\to 51.2 \\to \\dots$. This works for *any* percentage, not just 50%, and it cracks most first-order problems in your head. It is not a trick — it is what the exponential law means.'
      ),
      B.worked('Worked Example — the equal-percentage shortcut',
        'A first-order reactant falls from $1.0$ to $0.6$ in 20 minutes. How long does it take to fall from $0.6$ to $0.36$?',
        '**Spot the percentage drop.** Going $1.0 \\to 0.6$ is a fall of 40% in 20 minutes.\n\n**Apply the same percentage.** First order loses the *same fraction* in the same time. Take 40% off the new value $0.6$: $0.6 - 0.4\\times0.6 = 0.6 - 0.24 = 0.36$.\n\nSo falling from $0.6$ to $0.36$ is also a 40% drop — it takes the **same 20 minutes**.\n\n**Answer: 20 minutes.** The slow way (two applications of $k = \\tfrac{2.303}{t}\\log\\tfrac{a}{a-x}$, then equating) gives the same result, but the percentage idea gets there instantly. *It is always applicable, because it is not really a shortcut — it is just a clearer understanding of the first-order law.*'
      ),
      B.reason('quantitative',
        'A first-order reaction is 75% complete in 60 minutes. What is its half-life?',
        [
          '45 minutes, because 75% is three-quarters of 60',
          '30 minutes, because 75% complete means two half-lives have passed (one-quarter is left), so each half-life is 30 minutes',
          '60 minutes, the same as the time given',
          '20 minutes, because 75% is three half-lives',
        ],
        '75% complete means one-quarter of the reactant remains, which is two halvings: $1 \\to \\tfrac12 \\to \\tfrac14$. So $60$ minutes $= 2\\,t_{1/2}$, giving $t_{1/2} = 30$ minutes. This is the $t_{75\\%} = 2\\,t_{1/2}$ result in action.',
        3
      ),
      B.worked('NCERT Example 4.7',
        'A first-order reaction has rate constant $k = 5.5\\times10^{-14}\\ \\text{s}^{-1}$. Find the half-life of the reaction.',
        'For a first-order reaction $t_{1/2} = \\dfrac{0.693}{k}$:\n\n$$t_{1/2} = \\frac{0.693}{5.5\\times10^{-14}} = 1.26\\times10^{13}\\ \\text{s}.$$\n\n**Note:** the NCERT printed answer reads $1.26\\times10^{14}$ s — a typographical slip in the exponent; the arithmetic ($0.693/5.5 = 0.126$, $\\times10^{14} = 1.26\\times10^{13}$) gives $1.26\\times10^{13}$ s.',
        'ncert_intext'),
      B.worked('NCERT Example 4.8',
        'Show that for a first-order reaction, the time required for 99.9% completion is 10 times the half-life ($t_{1/2}$).',
        'At 99.9% completion, $[\\ce{R}] = [\\ce{R}]_0 - 0.999[\\ce{R}]_0 = 0.001[\\ce{R}]_0$.\n\n$$t = \\frac{2.303}{k}\\log\\frac{[\\ce{R}]_0}{0.001[\\ce{R}]_0} = \\frac{2.303}{k}\\log 10^{3} = \\frac{2.303\\times3}{k} = \\frac{6.909}{k}.$$\n\nSince $t_{1/2} = \\dfrac{0.693}{k}$,\n\n$$\\frac{t}{t_{1/2}} = \\frac{6.909/k}{0.693/k} = 10.$$\n\nSo $t_{99.9\\%} = 10\\,t_{1/2}$.',
        'ncert_intext'),
      B.sim('order-explorer', 'Order Explorer — the first-order shortcut', {
        prompt: 'A first-order reaction drops 50% in the first 5 minutes. How much reactant is left after 10 minutes?',
        options: ['0% — it is complete', '25%', '50%'],
        reveal_after: 'First order removes an equal PERCENTAGE each interval — half of whatever is left every 5 minutes. So 100% → 50% → 25%: a quarter remains after 10 minutes, and the curve only ever approaches zero. Switch to "First order" and step through to see it keep halving.',
      }),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Core facts:** $t_{1/2} = \\dfrac{0.693}{k}$ (independent of $[\\ce{A}]_0$); after $n$ half-lives $[\\ce{A}]_t = \\dfrac{[\\ce{A}]_0}{2^{n}}$; $t_{75\\%} = 2\\,t_{1/2}$; a first-order reaction **never completes**.\n\n**Auto-false statement:** "this first-order reaction is complete in 1000 s" — first order never finishes, so kill that option on sight.\n\n**Shortcut:** the equal-percentage drop solves most first-order problems faster than the formula — and examiners pick the numbers so it fits neatly.'
      ),
      B.quiz([
        {
          question: 'The half-life of a first-order reaction depends on:',
          options: [
            'Only the rate constant $k$, not the starting concentration',
            'Both $k$ and the starting concentration together',
            'Only the starting concentration of the reactant',
            'Neither $k$ nor the concentration of reactant',
          ],
          correct_index: 0,
          explanation: '$t_{1/2} = 0.693/k$ contains no concentration term, so the half-life is fixed by $k$ alone. Independence from starting concentration is the hallmark of first order.',
          difficulty_level: 1,
        },
        {
          question: 'After 3 half-lives, the fraction of a first-order reactant remaining is:',
          options: [
            '$1/3$',
            '$1/8$',
            '$1/6$',
            'Zero — it is complete',
          ],
          correct_index: 1,
          explanation: 'After $n$ half-lives the fraction left is $1/2^{n}$. For $n = 3$ that is $1/8$. A first-order reaction never reaches exactly zero.',
          difficulty_level: 2,
        },
        {
          question: 'Which statement about a first-order reaction is FALSE?',
          options: [
            'Its concentration falls by equal percentages in equal time intervals',
            'It reaches 100% completion in a finite, calculable time',
            'Its half-life is $0.693/k$',
            'After two half-lives, one-quarter of the reactant remains',
          ],
          correct_index: 1,
          explanation: 'A first-order reaction never truly completes — the exponential only approaches zero, so 100% completion would take infinite time. The other three statements are all true.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 16 ─────────────────────────────────────────────────────────────
  page(16, 'first-order-practice',
    'First-Order Practice: Three Exam Favourites',
    'Two ways to crack a decay race, a clean log trick, and the case where you are never told the starting concentration.',
    ['chemical-kinetics', 'first-order', 'practice', 'pyq', 'half-life'],
    [
      B.hero(
        'A split race track where two glowing bars decay at different rates, with a finish line marking the moment their lengths become equal',
        'Ultra-wide cinematic banner (16:5 ratio). Two horizontal glowing bars on parallel race tracks, each shrinking (decaying) at a different rate; a vertical finish-line marks the instant at which the two bars become equal in length. The mood is a quiet race against time. Deep near-black background, orange and cool-blue bars, cinematic technical style. No text.'
      ),
      B.text(
        'First order is where the chapter pays off in the exam, so here are three of its most-loved patterns worked end to end. Notice how each one rewards a quick idea — a halving chain, a clean log value, a cancelled unknown — over grinding the formula. Try each yourself before tapping to reveal.'
      ),
      B.worked('Practice 1 — a decay race (IIT favourite)',
        'Two substances A and B are present with $[\\ce{A}] = 4[\\ce{B}]$. Both decay by first-order kinetics; $t_{1/2}(\\ce{A}) = 5$ min and $t_{1/2}(\\ce{B}) = 15$ min. After how long are their concentrations equal?',
        'Use the **halving chains** — first order, so each just keeps halving over its own half-life. Write everything in terms of $[\\ce{B}]_0 = b$, so $[\\ce{A}]_0 = 4b$.\n\n**A halves every 5 min:** $4b \\xrightarrow{5} 2b \\xrightarrow{5} b \\xrightarrow{5} \\tfrac{b}{2}$. So at $t = 15$ min, $[\\ce{A}] = \\tfrac{b}{2}$.\n\n**B halves every 15 min:** $b \\xrightarrow{15} \\tfrac{b}{2}$. So at $t = 15$ min, $[\\ce{B}] = \\tfrac{b}{2}$.\n\n**They match at $t = 15$ minutes.** Both sit at $\\tfrac{b}{2}$.\n\n**Answer: 15 minutes.** The shortcut (equal-fraction halving) lands it without a single logarithm — and the examiner chose the numbers so it would.'
      ),
      B.worked('Practice 2 — a clean log ratio (IIT PYQ)',
        'For a first-order reaction, find $\\dfrac{t_{1/8}}{t_{1/10}} \\times 10$, where $t_{1/8}$ is the time for the reactant to fall to $\\tfrac18$ of its value and $t_{1/10}$ to $\\tfrac{1}{10}$.',
        'For first order, $t = \\dfrac{2.303}{k}\\log\\dfrac{[\\ce{A}]_0}{[\\ce{A}]_t}$, so the time to reach a given fraction is proportional to $\\log(\\text{that fraction reciprocal})$.\n\n**Time to reach $\\tfrac18$:** proportional to $\\log 8 = \\log 2^3 = 3\\log 2 = 3(0.3) = 0.9$.\n\n**Time to reach $\\tfrac{1}{10}$:** proportional to $\\log 10 = 1$.\n\n**Take the ratio** (the $2.303/k$ cancels):\n\n$$\\frac{t_{1/8}}{t_{1/10}} = \\frac{0.9}{1} = 0.9, \\qquad \\frac{t_{1/8}}{t_{1/10}}\\times 10 = 9.$$\n\n**Answer: 9.** An IIT PYQ that is pure $\\log 2 \\approx 0.3$ — no calculator, no value of $k$ needed.'
      ),
      B.worked('Practice 3 — when you never get the initial concentration',
        'A first-order reactant reads $C_1$ at time $t_1$ and $C_2$ at a later time $t_2$. You are never told the true starting concentration. Find $k$.',
        'You do not need $[\\ce{A}]_0$. **Wherever you start observing is your effective "initial".**\n\nWrite the formula between the two observed points instead of from $t = 0$:\n\n$$k = \\frac{2.303}{t_2 - t_1}\\log\\frac{C_1}{C_2}.$$\n\n**Why it works:** $\\log\\frac{[\\ce{A}]_0}{C_1}$ and $\\log\\frac{[\\ce{A}]_0}{C_2}$ each contain the unknown $[\\ce{A}]_0$; subtract them and $[\\ce{A}]_0$ cancels, leaving $\\log\\frac{C_1}{C_2}$ over the elapsed time $t_2 - t_1$.\n\n**Answer:** $k = \\dfrac{2.303}{t_2 - t_1}\\log\\dfrac{C_1}{C_2}$. **Watch out:** you do not always need the actual starting concentration — any two readings and the time between them are enough for a first-order $k$.'
      ),
      B.reason('quantitative',
        'A first-order reactant takes $T$ minutes to fall to one-quarter of its value. How long does it take to fall to one-sixteenth of its value?',
        [
          '$2T$, because one-sixteenth is twice as far as one-quarter',
          '$2T$, because reaching $\\tfrac{1}{16}$ is four halvings while reaching $\\tfrac14$ is two halvings, so the time doubles',
          '$4T$, because sixteen is four times four',
          '$\\tfrac{T}{2}$, because the reaction speeds up as it proceeds',
        ],
        'Reaching $\\tfrac14$ is 2 half-lives; reaching $\\tfrac{1}{16}$ is 4 half-lives ($\\tfrac{1}{16} = \\tfrac{1}{2^4}$). Four half-lives is twice two, so the time is $2T$. (Two options say $2T$, but only one gives the correct halving reasoning.)',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Halving chains** solve "when are two decaying species equal?" and "time to reach $1/2^n$" without logs — write each species as repeated halvings and read off the matching time.\n\n**Log values to keep ready:** $\\log 2 = 0.3$, $\\log 3 = 0.48$, $\\log 4 = 0.6$, $\\log 8 = 0.9$. Time to a fraction $\\propto \\log(\\text{reciprocal})$.\n\n**No $[\\ce{A}]_0$? No problem** — use $k = \\dfrac{2.303}{t_2 - t_1}\\log\\dfrac{C_1}{C_2}$ between any two readings.'
      ),
      B.quiz([
        {
          question: 'Two first-order species start with $[\\ce{A}] = 4[\\ce{B}]$, with $t_{1/2}(\\ce{A}) = 5$ min and $t_{1/2}(\\ce{B}) = 15$ min. They become equal in concentration after:',
          options: [
            '5 minutes',
            '15 minutes',
            '10 minutes',
            '20 minutes',
          ],
          correct_index: 1,
          explanation: 'In 15 min, A halves three times ($4b \\to 2b \\to b \\to b/2$) and B halves once ($b \\to b/2$). Both reach $b/2$, so they are equal at 15 minutes.',
          difficulty_level: 2,
        },
        {
          question: 'For a first-order reaction, the time to fall to $\\tfrac18$ of the initial value, divided by the time to fall to $\\tfrac{1}{10}$, equals:',
          options: [
            '$0.8$',
            '$0.9$',
            '$1.25$',
            '$1.0$',
          ],
          correct_index: 1,
          explanation: 'Time $\\propto \\log(\\text{reciprocal fraction})$: $\\log 8 = 3\\log 2 = 0.9$ and $\\log 10 = 1$, so the ratio is $0.9/1 = 0.9$.',
          difficulty_level: 3,
        },
        {
          question: 'For a first-order reaction you have two concentration readings $C_1$ at $t_1$ and $C_2$ at $t_2$, but not the true starting concentration. The rate constant is:',
          options: [
            'Impossible to find without the initial concentration',
            '$k = \\dfrac{2.303}{t_2 - t_1}\\log\\dfrac{C_1}{C_2}$',
            '$k = \\dfrac{C_1 - C_2}{t_2 - t_1}$',
            '$k = \\dfrac{2.303}{t_2 - t_1}\\log(C_1 \\, C_2)$',
          ],
          correct_index: 1,
          explanation: 'Writing the law between the two readings cancels the unknown $[\\ce{A}]_0$, giving $k = \\frac{2.303}{t_2 - t_1}\\log\\frac{C_1}{C_2}$. Any two readings and the time between them suffice.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL2 batch B done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
