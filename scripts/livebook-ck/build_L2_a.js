'use strict';
/* Chemical Kinetics — Lecture 2, batch A: pages 11–13 (elementary/complex + RDS, molecularity, zero order). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 11 ─────────────────────────────────────────────────────────────
  page(11, 'elementary-and-complex-reactions',
    'One Step or Many: Elementary, Complex, and the Slowest Step',
    'Most reactions happen as a sequence of hidden steps — and the slowest of them quietly sets the pace for the whole thing.',
    ['chemical-kinetics', 'elementary-reaction', 'complex-reaction', 'rate-determining-step', 'mechanism'],
    [
      B.hero(
        'A long highway seen from above: a smooth open stretch where a car races, then a final battered pothole-riddled section where it crawls, the slow stretch deciding the whole journey time',
        'Ultra-wide cinematic banner (16:5 ratio). An aerial view of a long highway at dusk. Most of it is a smooth open road where a car streaks past with light trails; the final stretch is battered and pothole-riddled, where the same car crawls. The visual makes clear that the slow, broken stretch decides the total journey time. Deep near-black background, warm tail-lights, cinematic. No text.'
      ),
      B.callout('fun_fact', 'The 300-kilometre holiday drive',
        'Picture a 300 km drive. The first 250 km are a beautiful highway and you cruise at 120 km/h. Then the last 50 km are nothing but potholes and you crawl at 20 km/h. Your *average* speed for the whole trip is wrecked by that final stretch — the smooth 250 km cannot rescue it. A reaction works exactly the same way: when it happens in steps, the **slowest step** decides how fast the whole thing goes.'
      ),
      B.text(
        'Most reactions you write down do not happen in one clean collision. They proceed through a **series of simple steps**, each called an **elementary reaction** — a single event at the molecular level, one actual collision or bond change. The chain of elementary steps is the reaction’s **mechanism**. A reaction made of several such steps is a **complex reaction**, and its overall equation is just a *summary* of the steps — it does not show what actually happens moment to moment.'
      ),
      B.heading('The slowest step sets the pace'),
      B.text(
        'In a multi-step reaction, one step is usually much slower than the rest. That is the **rate-determining step (RDS)** — the bottleneck. No matter how fast the other steps run, the overall reaction cannot outpace its slowest step, just as your road trip could not beat that pothole stretch. Speed the fast steps up all you like; until you fix the slow one, the overall rate barely moves.'
      ),
      B.reason('logical',
        'A reaction goes in three steps with rates: Step 1 fast, Step 2 very slow, Step 3 fast. An engineer doubles the speed of Step 1 and Step 3 but leaves Step 2 alone. What happens to the overall rate?',
        [
          'It roughly doubles, because two of the three steps are now twice as fast',
          'It barely changes, because the slow Step 2 is the bottleneck and still limits the whole reaction',
          'It triples, since the fast steps now dominate the mechanism',
          'It stops, because the steps are no longer balanced with each other',
        ],
        'The overall rate is capped by the slowest (rate-determining) step. Speeding up steps that were never the bottleneck does almost nothing — like widening the smooth part of the highway while the pothole stretch stays. To speed the reaction up, you must address Step 2.',
        3
      ),
      B.heading('Why the overall equation can’t give you the rate law'),
      B.text(
        'This is the deeper payoff. For a *single* elementary step, the powers in its rate law really are its coefficients (we will call that count its **molecularity** next). But for a **complex** reaction, the rate law is governed by the slow step and the steps before it — **not** by the coefficients of the overall equation. That is exactly why, back when we met order, the powers had to be measured: the tidy overall equation hides a messy multi-step reality.'
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Rate-determining step = slowest step.** A reaction’s overall rate is set by it; speeding up non-bottleneck steps changes little. Expect "which step decides the rate?" and "speed up step X — what happens?" questions.\n\n**Elementary vs complex:** an elementary reaction is a single molecular event (its rate law follows its own coefficients); a complex reaction is a sequence of elementary steps, and its overall equation tells you nothing about its rate law. Assume a reaction is complex unless told it is elementary.'
      ),
      B.quiz([
        {
          question: 'The rate-determining step of a multi-step reaction is best described as:',
          options: [
            'The first step that the reactants undergo together',
            'The slowest step, which acts as the bottleneck for the overall rate',
            'The step that releases the most energy as it proceeds',
            'The final step that produces the main product',
          ],
          correct_index: 1,
          explanation: 'The slowest step is the bottleneck — the overall reaction cannot go faster than it. It need not be the first or the last step, nor the most exothermic one.',
          difficulty_level: 1,
        },
        {
          question: 'An "elementary reaction" means a reaction that:',
          options: [
            'Involves only the simplest elements of the periodic table',
            'Happens in a single step as one actual molecular event',
            'Is always the easiest reaction to carry out in a lab',
            'Has a balanced equation with small whole-number coefficients',
          ],
          correct_index: 1,
          explanation: 'An elementary reaction is one step — a single collision or bond change at the molecular level. The word has nothing to do with chemical elements or with how easy the reaction is.',
          difficulty_level: 2,
        },
        {
          question: 'Why can the balanced overall equation of a complex reaction NOT be used to write its rate law?',
          options: [
            'Because the equation is usually written with the wrong coefficients in it',
            'Because the rate law is set by the slow step, not the overall coefficients',
            'Because complex reactions do not actually obey any rate laws at all',
            'Because the overall equation quietly hides the reaction temperature',
          ],
          correct_index: 1,
          explanation: 'The overall equation only summarises the net change. The true rate law comes from the mechanism — chiefly the rate-determining step — so the powers must be found by experiment, not copied from the overall coefficients.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 12 ─────────────────────────────────────────────────────────────
  page(12, 'molecularity-vs-order',
    'Molecularity vs Order',
    'Two words students mix up forever. One you count from a single step; the other you measure from the whole reaction.',
    ['chemical-kinetics', 'molecularity', 'order', 'elementary-reaction', 'comparison'],
    [
      B.hero(
        'Two panels: on the left, a small fixed number of molecules colliding in a single step (molecularity); on the right, a lab experiment with data points revealing the order',
        'Ultra-wide cinematic banner (16:5 ratio). Two panels. Left: a clean close-up of a small, countable group of molecules colliding together in a single step — a fixed whole number. Right: a laboratory bench with a graph of experimental data points being read off. The contrast: one is counted from a single step, the other measured from the whole reaction. Deep near-black background, orange accents, cinematic technical style. No text.'
      ),
      B.text(
        '**Molecularity** is the number of reacting species — atoms, molecules or ions — that come together in a **single elementary step**. You simply count them. Because you cannot have half a molecule colliding, molecularity is always a **positive whole number**:\n\n- **Unimolecular** (molecularity 1): one species rearranges or falls apart, e.g. $\\ce{N2O5 -> NO2 + NO3}$.\n- **Bimolecular** (molecularity 2): two species collide, e.g. $\\ce{H+ + Cl2 -> HCl + Cl}$.\n- **Termolecular** (molecularity 3): three species must meet at once — and this is **rare**, because three particles colliding at the same instant is highly improbable. Molecularity above 3 is essentially never seen.'
      ),
      B.heading('Keep order and molecularity straight'),
      B.text(
        'Here is the distinction that trips students up for good. **Molecularity** belongs to a *single elementary step* — it is theoretical, counted, and always a positive integer. **Order** belongs to the *whole reaction* — it is experimental, measured, and can be zero, fractional, or even negative. They coincide only for a reaction that *is* a single elementary step.'
      ),
      B.comparison('Order vs Molecularity', [
        {
          heading: 'Order of reaction',
          points: [
            'A property of the whole (overall) reaction',
            'Found by experiment, from the rate law',
            'Can be zero, fractional, negative or whole',
            'Defined for any reaction, simple or complex',
            'Can change with conditions (T, P, concentration)',
          ],
        },
        {
          heading: 'Molecularity',
          points: [
            'A property of a single elementary step',
            'Found by counting the colliding species',
            'Always a positive whole number (1, 2, 3)',
            'Defined only for an elementary step',
            'Fixed — it is just a count',
          ],
        },
      ]),
      B.reason('logical',
        'A reaction’s rate law is found by experiment to be order $1.5$ overall. A student concludes "so its molecularity is also 1.5." What is wrong with that statement?',
        [
          'Nothing — order and molecularity are always the same number',
          'Molecularity is a count of colliding species in one elementary step, so it must be a positive whole number; a fractional value like 1.5 can only be an order, signalling a multi-step reaction',
          'The order cannot be 1.5, so the experiment must be wrong',
          'Molecularity can be 1.5 only for gas-phase reactions',
        ],
        'Molecularity counts particles in a single step, so it is always a whole number. A fractional order (1.5) cannot be a molecularity — and it is itself a clue that the reaction is complex (multi-step), since a single elementary step would give a whole-number order.',
        3
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**One-liner:** order is *experimental* (whole reaction, any value); molecularity is *theoretical* (one step, positive integer only).\n\n**For an elementary step**, order = molecularity = sum of the coefficients — this is the only case where the law of mass action gives the correct rate law.\n\n**Tells of a complex reaction:** a fractional or negative order, or an order that disagrees with the overall coefficients. Termolecular steps are rare; a "molecularity of 4 or 5" is essentially never correct.'
      ),
      B.quiz([
        {
          question: 'Molecularity of an elementary step is always:',
          options: [
            'A positive whole number such as 1, 2 or 3',
            'Any value, including zero, fractions or negatives',
            'Equal to the experimentally measured order',
            'Larger than the overall order of the reaction',
          ],
          correct_index: 0,
          explanation: 'Molecularity counts the species colliding in one step, so it must be a positive integer. Zero, fractional and negative values can only describe order, not molecularity.',
          difficulty_level: 1,
        },
        {
          question: 'For which kind of reaction are the order and the molecularity guaranteed to be equal?',
          options: [
            'Any reaction with a balanced chemical equation',
            'A single-step (elementary) reaction',
            'Only reactions that are first order',
            'Any reaction carried out in the gas phase',
          ],
          correct_index: 1,
          explanation: 'For an elementary reaction the rate law follows the coefficients, so order = molecularity. For a multi-step (complex) reaction the two can differ, since order is then set by the mechanism.',
          difficulty_level: 2,
        },
        {
          question: 'A termolecular elementary step is uncommon mainly because:',
          options: [
            'The three-particle products that form are always unstable',
            'Three particles colliding at the same instant is very improbable',
            'Termolecular steps would break the law of mass action',
            'Such steps would somehow require a fractional molecularity',
          ],
          correct_index: 1,
          explanation: 'A simultaneous three-body collision is statistically rare, so termolecular steps are uncommon and molecularities above 3 are essentially never observed. It has nothing to do with product stability or fractional counts.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 13 ─────────────────────────────────────────────────────────────
  page(13, 'zero-order-reactions',
    'Zero-Order Reactions: A Steady, Unhurried Decline',
    'A reaction whose speed does not care how much reactant is left — it just ticks down at a fixed rate, like a body clearing alcohol.',
    ['chemical-kinetics', 'zero-order', 'integrated-rate-law', 'half-life', 'breathalyzer'],
    [
      B.hero(
        'A straight diagonal line of reactant concentration falling steadily to zero over time, beside a stylised glass slowly emptying at a constant pace',
        'Ultra-wide cinematic banner (16:5 ratio). On the left, a graph where the reactant concentration falls along a perfectly straight diagonal line down to zero — steady, unhurried. On the right, a stylised glass emptying at a constant, unchanging pace. The idea: a rate that ignores how much is left. Deep near-black background, orange line and accents, clean cinematic technical style. No text.'
      ),
      B.callout('fun_fact', 'Your body clears alcohol at a fixed rate',
        'Drink two units or ten — once you stop, the liver removes alcohol at a roughly **constant rate**, because the enzyme doing the job is working flat out (saturated). It does not clear alcohol "faster when there is more." That is why a breathalyzer reading drops along a near-straight line, and why "just wait it out" takes a predictable number of hours. This is a **zero-order** process: the rate does not depend on how much reactant is left.'
      ),
      B.text(
        'A **zero-order reaction** is one whose rate does not depend on the reactant concentration at all. Putting the order to zero in the rate law, $\\text{rate} = k[\\ce{A}]^{0} = k$. The rate is simply a constant — it stays the same from start to finish, until the reactant runs out.'
      ),
      B.heading('Deriving the zero-order law'),
      B.text(
        'Start from the definition with rate $= k$:\n\n$$-\\frac{d[\\ce{A}]}{dt} = k.$$\n\nSeparate and integrate from the start ($[\\ce{A}]_0$ at $t=0$) to time $t$ ($[\\ce{A}]_t$). Integrating gives the straight-line law:'
      ),
      B.latex('[\\ce{A}]_t = [\\ce{A}]_0 - k t', 'Integrated zero-order rate law',
        'A plot of $[\\ce{A}]$ against $t$ is a straight line of slope $-k$ and intercept $[\\ce{A}]_0$.'),
      B.img(
        'A straight descending line of reactant concentration against time, starting at the initial concentration on the y-axis and reaching zero, with the slope marked as minus k',
        '📸 Zero order: concentration falls in a straight line, slope $-k$, until the reactant is gone',
        'Graph of concentration [A] (y-axis) versus time (x-axis) for a zero-order reaction: a single straight line starting at the initial concentration on the y-axis and descending at a constant slope to hit zero on the x-axis. The slope is labelled "−k" and the starting point "[A]0". Dark background (#0a0a0a), orange line and labels, clean technical illustration, subtle gridlines.'
      ),
      B.heading('Half-life and the equal-drop shortcut'),
      B.text(
        'Because the line is straight, two results drop out immediately. The reactant reaches zero at the **completion time** $t_{\\text{complete}} = \\dfrac{[\\ce{A}]_0}{k}$. The **half-life** — time to fall to half — is\n\n$$t_{1/2} = \\frac{[\\ce{A}]_0}{2k}.$$\n\nNotice $t_{1/2}$ is **proportional to the initial concentration**: double the starting amount and the half-life doubles. And here is the intuition that lets you solve most zero-order questions in your head: **the concentration drops by equal amounts in equal time intervals.** If it falls by 0.2 every 10 minutes, it just keeps stepping down 0.2, 0.2, 0.2…'
      ),
      B.worked('Worked Example — zero order in your head',
        'A zero-order reaction starts at $[\\ce{A}]_0 = 1.0$ and falls to $0.8$ in 10 minutes. Find its half-life.',
        'No formula needed — use the **equal-drop** idea.\n\n**Step 1 — find the drop per interval.** In 10 minutes $[\\ce{A}]$ fell by $1.0 - 0.8 = 0.2$.\n\n**Step 2 — step it down.** Equal amounts in equal times: it loses $0.2$ every 10 minutes. To go from $1.0$ all the way to $0$ takes five such steps, so the completion time is $5 \\times 10 = 50$ minutes.\n\n**Step 3 — half-life is half the completion time** (for zero order). To fall from $1.0$ to $0.5$ is two and a half steps $= 25$ minutes. Equivalently, $t_{1/2} = \\dfrac{[\\ce{A}]_0}{2k}$ with $k = 0.02\\,\\text{min}^{-1}$ gives the same $25$ minutes.\n\n**Answer: $t_{1/2} = 25$ minutes.** No algebra — just the steady, equal-amount decline. This is not a trick; it is what the zero-order equation *means*.'
      ),
      B.text(
        'Where do you actually meet zero order? When something other than concentration is the bottleneck — a saturated catalyst surface or a saturated enzyme. Classic examples to recognise: the decomposition of $\\ce{HI}$ on a gold surface, ammonia decomposing on hot platinum or tungsten ($\\ce{2NH3 -> N2 + 3H2}$, the reverse of Haber, at high pressure), the photochemical $\\ce{H2 + Cl2 -> 2HCl}$, and the body’s metabolism of ethanol.'
      ),
      B.reason('quantitative',
        'A zero-order reaction is 50% complete in 20 minutes. Roughly how long after the start is it 75% complete?',
        [
          '25 minutes, because each extra quarter takes a little longer',
          '30 minutes, because the reactant falls by equal amounts in equal times, so 25% more takes another 10 minutes',
          '40 minutes, since the second half always takes twice as long',
          'It is impossible to tell without the value of $k$',
        ],
        'Zero order falls by equal amounts in equal time. If 50% goes in 20 minutes, then 25% goes in 10 minutes, so 75% complete is reached at 20 + 10 = 30 minutes. The completion time would be 40 minutes (100%).',
        3
      ),
      B.sim('order-explorer', 'Order Explorer — the zero-order shortcut', {
        prompt: 'A zero-order reaction loses 20% of its starting amount in the first 5 minutes. When is it fully complete?',
        options: ['After 10 minutes', 'After 25 minutes', 'It never fully completes'],
        reveal_after: 'Zero order strips off an equal AMOUNT each interval — 20% of the start every 5 minutes. Five such steps empty it, so it is complete at 25 minutes. Switch to "Zero order" and step through the staircase to watch it march to zero.',
      }),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Zero-order toolkit:** $[\\ce{A}]_t = [\\ce{A}]_0 - kt$ (straight line, slope $-k$); $t_{1/2} = \\dfrac{[\\ce{A}]_0}{2k}$ (proportional to $[\\ce{A}]_0$); completion time $= \\dfrac{[\\ce{A}]_0}{k}$; units of $k$ are $\\text{mol L}^{-1}\\text{s}^{-1}$; and the rate stays constant throughout.\n\n**Solve in your head:** the equal-amount-drop idea cracks most zero-order problems faster than the formula. Half-life rises with $[\\ce{A}]_0$ — a tell that a reaction is zero order. Know the standard examples (surface-saturated decompositions, photochemical $\\ce{H2 + Cl2}$, ethanol metabolism).'
      ),
      B.quiz([
        {
          question: 'For a zero-order reaction, a graph of concentration $[\\ce{A}]$ against time is:',
          options: [
            'A straight line sloping downward with slope $-k$',
            'A curve that decays exponentially toward zero',
            'A horizontal straight line at the starting concentration',
            'A straight line sloping upward with slope $+k$',
          ],
          correct_index: 0,
          explanation: '$[\\ce{A}]_t = [\\ce{A}]_0 - kt$ is the equation of a straight line falling with slope $-k$. The exponential decay shape belongs to first order, not zero order.',
          difficulty_level: 1,
        },
        {
          question: 'How does the half-life of a zero-order reaction depend on the initial concentration $[\\ce{A}]_0$?',
          options: [
            'It is independent of $[\\ce{A}]_0$',
            'It is directly proportional to $[\\ce{A}]_0$',
            'It is inversely proportional to $[\\ce{A}]_0$',
            'It depends on $[\\ce{A}]_0^{2}$',
          ],
          correct_index: 1,
          explanation: '$t_{1/2} = [\\ce{A}]_0 / 2k$, so doubling the initial concentration doubles the half-life. (First order, by contrast, has a half-life independent of $[\\ce{A}]_0$.)',
          difficulty_level: 2,
        },
        {
          question: 'The rate of a zero-order reaction, as the reaction proceeds and reactant is consumed:',
          options: [
            'Falls steadily because there is less reactant left',
            'Stays constant at $k$ until the reactant is exhausted',
            'Rises because the products speed it up',
            'Falls exponentially toward zero',
          ],
          correct_index: 1,
          explanation: 'Rate $= k[\\ce{A}]^0 = k$ is independent of concentration, so it stays constant right up until the reactant runs out — the defining feature of zero order.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL2 batch A done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
