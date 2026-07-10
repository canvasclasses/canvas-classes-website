'use strict';
/* Chemical Kinetics — Lecture 4, batch A: pages 30–32 (Arrhenius, graphs & temperature coefficient, activation energy). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 30 ─────────────────────────────────────────────────────────────
  page(30, 'effect-of-temperature-arrhenius',
    'Why Heat Speeds Reactions: The Arrhenius Equation',
    'A 10-degree rise can double a reaction’s rate. One equation — $k = A e^{-E_a/RT}$ — explains exactly why.',
    ['chemical-kinetics', 'temperature', 'arrhenius-equation', 'activation-energy', 'rate-constant'],
    [
      B.hero(
        'A cold sluggish flask beside a warm vigorously reacting one, with a glowing equation suggesting the temperature dependence linking them',
        'Ultra-wide cinematic banner (16:5 ratio). On the left, a cold flask with barely any activity; on the right, the same reaction at higher temperature reacting vigorously with rising bubbles and a warm glow. Between them, a faint glowing exponential curve hinting at the temperature dependence. Deep near-black background, cool-to-warm gradient, orange accents, cinematic technical style. No text.'
      ),
      B.callout('fun_fact', 'Ten degrees, double the speed',
        'For many reactions, raising the temperature by just **10 °C roughly doubles** the rate. That is why your fridge (cooling food by about 20–25 °C) slows spoilage several-fold, and why a pressure cooker — hotter than boiling water — cooks dal in a fraction of the time. A modest change in temperature has an outsized effect on rate, and the reason is hidden in one famous equation.'
      ),
      B.text(
        'Temperature affects rate through the **rate constant $k$**. The relationship was captured by Svante Arrhenius:'
      ),
      B.latex('k = A\\,e^{-E_a/RT}', 'The Arrhenius equation',
        '$A$ = pre-exponential (frequency) factor · $E_a$ = activation energy · $R$ = gas constant · $T$ = temperature in kelvin.'),
      B.text(
        'Two pieces carry the meaning. The **activation energy $E_a$** is the minimum energy a collision must have for the reaction to happen — an energy barrier. The **pre-exponential factor $A$** measures how often collisions occur (with the right orientation), *irrespective* of their energy. The exponential term $e^{-E_a/RT}$ is the **fraction of collisions energetic enough** to clear the barrier.'
      ),
      B.text(
        'Now the equation almost reads itself. Raise $T$ and the negative exponent shrinks, so $e^{-E_a/RT}$ grows — a larger fraction of collisions make it over the barrier, and $k$ rises steeply. In the limit where $E_a = 0$ or $T \\to \\infty$, the fraction becomes 1 and $k = A$ — every collision succeeds, so the rate is set purely by how often molecules meet.'
      ),
      B.reason('logical',
        'According to $k = A e^{-E_a/RT}$, how does the rate constant respond to (i) a higher activation energy and (ii) a higher temperature?',
        [
          'It increases with both a higher $E_a$ and a higher $T$',
          'It decreases as $E_a$ increases (a taller barrier is harder to clear) and increases as $T$ increases (more collisions clear the barrier)',
          'It decreases with both a higher $E_a$ and a higher $T$',
          'It is unaffected by either',
        ],
        'A larger $E_a$ makes the negative exponent more negative, so $e^{-E_a/RT}$ — and $k$ — falls. A larger $T$ shrinks the magnitude of the exponent, so $k$ rises. Higher barrier $\\Rightarrow$ slower; higher temperature $\\Rightarrow$ faster.',
        2
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Know each symbol in $k = A e^{-E_a/RT}$:** $E_a$ = energy barrier; $A$ = collision frequency factor (energy-independent); $e^{-E_a/RT}$ = fraction of collisions with enough energy. When $E_a = 0$ or $T \\to \\infty$, $k = A$.\n\n**Direction trap:** $k$ *decreases* with increasing $E_a$ but *increases* with increasing $T$. "Higher $E_a$ means a faster reaction" is FALSE — a taller barrier is harder to cross.'
      ),
      B.quiz([
        {
          question: 'In the Arrhenius equation $k = A e^{-E_a/RT}$, the rate constant:',
          options: [
            'Increases with both higher activation energy and higher temperature',
            'Falls as activation energy rises but rises as temperature rises',
            'Decreases steadily as the temperature is increased',
            'Depends only on the concentration of the reactant species',
          ],
          correct_index: 1,
          explanation: 'A higher $E_a$ lowers $k$ (taller barrier); a higher $T$ raises $k$ (more collisions clear the barrier). $k$ does not depend on concentration.',
          difficulty_level: 1,
        },
        {
          question: 'In $k = A e^{-E_a/RT}$, the exponential factor $e^{-E_a/RT}$ represents:',
          options: [
            'The total number of collisions per second',
            'The fraction of collisions that have at least the activation energy',
            'The fraction of molecules that are correctly oriented',
            'The temperature in kelvin',
          ],
          correct_index: 1,
          explanation: 'The Boltzmann factor $e^{-E_a/RT}$ is the fraction of collisions energetic enough to clear the barrier. The collision frequency (and orientation) lives in the pre-exponential factor $A$.',
          difficulty_level: 2,
        },
        {
          question: 'Under what condition does the rate constant become equal to the pre-exponential factor, $k = A$?',
          options: [
            'When the reactant concentration is exactly 1 mol/L',
            'When $E_a = 0$ or $T \\to \\infty$, so all collisions succeed',
            'When the reaction happens to be exactly first order',
            'When a suitable catalyst is added to the reaction',
          ],
          correct_index: 1,
          explanation: 'If $E_a = 0$ (or $T \\to \\infty$), the exponential $e^{-E_a/RT} \\to 1$, so $k = A$ — the rate is then limited only by how often molecules collide.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 31 ─────────────────────────────────────────────────────────────
  page(31, 'arrhenius-graphs-and-temperature-coefficient',
    'The Arrhenius Graphs and the Two-Temperature Formula',
    'Take a log and the curve becomes a straight line whose slope is the activation energy — plus the one formula that links a rate at two temperatures.',
    ['chemical-kinetics', 'arrhenius-equation', 'activation-energy', 'temperature-coefficient', 'maxwell-boltzmann'],
    [
      B.hero(
        'Two graphs side by side: an exponential rise of k against temperature, and a descending straight line of ln k against one-over-temperature',
        'Ultra-wide cinematic banner (16:5 ratio). Two graphs side by side. Left: a smooth exponential rise of rate constant k against temperature T. Right: a straight descending line of ln k against 1/T, with its negative slope highlighted. The idea: the same law seen two ways. Deep near-black background, orange curves and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'Take the natural log of $k = A e^{-E_a/RT}$ and the exponential straightens out:'
      ),
      B.latex('\\ln k = \\ln A - \\frac{E_a}{R}\\cdot\\frac{1}{T}', 'Logarithmic form of the Arrhenius equation',
        'A plot of $\\ln k$ against $1/T$ is a straight line of slope $-E_a/R$ (negative) and intercept $\\ln A$.'),
      B.text(
        'This gives the two graphs that IIT and NEET ask about again and again. **$k$ versus $T$** is the exponential rise — steeper and steeper as the temperature climbs. **$\\ln k$ versus $1/T$** is a *straight line* with a **negative slope of $-E_a/R$** — so measuring that slope gives you the activation energy directly. (Both treat $A$ and $E_a$ as effectively constant over the temperature range.)'
      ),
      B.img(
        'Left: k rising exponentially with temperature. Right: ln k falling as a straight line against 1/T with slope minus Ea over R',
        '📸 The two Arrhenius plots: $k$ vs $T$ (exponential) and $\\ln k$ vs $1/T$ (straight line, slope $-E_a/R$)',
        'Two side-by-side graphs. Left: rate constant k (y-axis) versus temperature T (x-axis) as a smooth exponential rise. Right: ln k (y-axis) versus 1/T (x-axis) as a straight line with a clear negative slope, labelled "slope = −Ea/R". Dark background (#0a0a0a), orange curves and labels, clean technical illustration with subtle gridlines.'
      ),
      B.heading('Comparing two temperatures'),
      B.text(
        'Write the log form at two temperatures and subtract — the $\\ln A$ cancels, leaving the workhorse for "how much faster at a higher temperature?" problems:'
      ),
      B.latex('\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)', 'Arrhenius, two temperatures',
        'Find $E_a$ from two rate constants, or find how many times the rate rises ($k_2/k_1$) for a given temperature jump.'),
      B.text(
        'The **temperature coefficient** is just $k_2/k_1$ for a 10 °C rise — usually between 2 and 3, which is where "10 degrees roughly doubles the rate" comes from. On the molecular level, heating shifts the **Maxwell–Boltzmann** energy distribution to the right: more molecules now sit above $E_a$. Like a student on 30 marks getting 3 grace marks to cross the 33-mark pass line, that extra sliver of the curve above the barrier is what speeds the reaction up.'
      ),
      B.worked('Worked Example — activation energy from spoilage times',
        'Milk turns sour in 60 minutes at 300 K but in only 40 minutes at 400 K. Estimate the activation energy. (Take $R = 8.314\\,\\text{J mol}^{-1}\\text{K}^{-1}$.)',
        'The trick: a *time* tells you a *speed*. Souring in less time means a faster reaction, and the ratio of times is the inverse ratio of rate constants.\n\n**Step 1 — turn times into a rate-constant ratio.** Faster when shorter, so $\\dfrac{k_2}{k_1} = \\dfrac{t_1}{t_2} = \\dfrac{60}{40} = 1.5$. (We are *not* saying $k = $ time — only that the *ratio* of $k$ matches the inverse ratio of times.)\n\n**Step 2 — plug into the two-temperature formula** with $T_1 = 300$ K, $T_2 = 400$ K:\n\n$$\\ln(1.5) = \\frac{E_a}{8.314}\\left(\\frac{1}{300} - \\frac{1}{400}\\right).$$\n\n**Step 3 — evaluate.** $\\frac{1}{300} - \\frac{1}{400} = 8.33\\times10^{-4}$ and $\\ln 1.5 = 0.405$, so\n\n$$E_a = \\frac{0.405 \\times 8.314}{8.33\\times10^{-4}} \\approx 4.0\\times10^{3}\\,\\text{J mol}^{-1} = 4.0\\ \\text{kJ mol}^{-1}.$$\n\n**Answer: about 4 kJ/mol.** The lesson worth keeping: when a question gives you *times* at two temperatures, convert them to a $k$ ratio first — do not put time into the formula as if it were $k$.'
      ),
      B.reason('quantitative',
        'Two reactions are run over the same temperature range. Reaction X has a large activation energy and reaction Y a small one. Whose rate constant changes more sharply when the temperature is raised?',
        [
          'Reaction Y, because a small barrier is easy to cross anyway',
          'Reaction X, because a larger $E_a$ makes the slope $-E_a/R$ steeper, so $k$ is more sensitive to temperature',
          'Both change by exactly the same factor',
          'Neither changes, since $E_a$ is constant',
        ],
        'In $\\ln k = \\ln A - \\frac{E_a}{R}\\cdot\\frac1T$, the slope magnitude is $E_a/R$. A larger $E_a$ means a steeper slope, so $k$ for reaction X responds more strongly to a change in temperature. High-barrier reactions are the temperature-sensitive ones.',
        3
      ),
      B.worked('NCERT Example 4.10',
        'The rate constants of a reaction at 500 K and 700 K are $0.02\\ \\text{s}^{-1}$ and $0.07\\ \\text{s}^{-1}$ respectively. Calculate $E_a$ and $A$.',
        'Use $\\log\\dfrac{k_2}{k_1} = \\dfrac{E_a}{2.303R}\\left[\\dfrac{T_2 - T_1}{T_1 T_2}\\right]$.\n\n$$\\log\\frac{0.07}{0.02} = \\frac{E_a}{2.303\\times8.314}\\left[\\frac{700-500}{700\\times500}\\right].$$\n\n$$0.544 = \\frac{E_a \\times 5.714\\times10^{-4}}{19.15} \\;\\Rightarrow\\; E_a = \\frac{0.544\\times19.15}{5.714\\times10^{-4}} = 18230.8\\ \\text{J} \\approx 18.23\\ \\text{kJ mol}^{-1}.$$\n\nThen from $k = A e^{-E_a/RT}$ at 500 K: $0.02 = A\\,e^{-18230.8/(8.314\\times500)} = A\\,e^{-4.386}$, so\n\n$$A = \\frac{0.02}{0.0124} = 1.61\\ \\text{s}^{-1}.$$',
        'ncert_intext'),
      B.worked('NCERT Example 4.11',
        'The first-order rate constant for the decomposition $\\ce{C2H5I(g) -> C2H4(g) + HI(g)}$ at 600 K is $1.60\\times10^{-5}\\ \\text{s}^{-1}$; its activation energy is $209\\ \\text{kJ mol}^{-1}$. Calculate the rate constant at 700 K.',
        'Use the two-temperature form:\n\n$$\\log k_2 = \\log k_1 + \\frac{E_a}{2.303R}\\left[\\frac{1}{T_1} - \\frac{1}{T_2}\\right].$$\n\n$$\\log k_2 = \\log(1.60\\times10^{-5}) + \\frac{209000}{2.303\\times8.314}\\left[\\frac{1}{600} - \\frac{1}{700}\\right].$$\n\n$$\\log k_2 = -4.796 + 2.599 = -2.197.$$\n\n$$k_2 = 6.36\\times10^{-3}\\ \\text{s}^{-1}.$$',
        'ncert_intext'),
      B.sim('maxwell-boltzmann-temperature', 'Maxwell–Boltzmann Lab — heat it and watch', {
        prompt: 'When you raise the temperature of a gas, does the TOTAL number of molecules under the energy-distribution curve increase?',
        options: ['Yes — heating creates more molecules', 'No — the total area stays the same; the curve just shifts right', 'Only if a catalyst is present'],
        reveal_after: 'The total area (all the molecules) never changes — heating cannot create molecules. The curve shifts right and flattens, so a bigger SLICE of that same area sits beyond Eₐ and can react. Drag the temperature slider and watch the green reactive area grow while the whole curve keeps the same area.',
      }),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**The two graphs (both heavily asked):** $k$ vs $T$ = exponential rise; $\\ln k$ vs $1/T$ = straight line, slope $-E_a/R$ (negative), intercept $\\ln A$.\n\n**Two-temperature workhorse:** $\\ln\\dfrac{k_2}{k_1} = \\dfrac{E_a}{R}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)$. "How many times faster?" means find $k_2/k_1$.\n\n**Time-to-$k$ trap:** if given reaction *times* at two temperatures, use $\\dfrac{k_2}{k_1} = \\dfrac{t_1}{t_2}$ — never substitute a time for $k$. Higher $E_a$ $\\Rightarrow$ stronger temperature dependence.'
      ),
      B.quiz([
        {
          question: 'A plot of $\\ln k$ against $1/T$ for a reaction is a straight line. Its slope equals:',
          options: [
            '$+E_a/R$',
            '$-E_a/R$',
            '$\\ln A$',
            '$E_a \\times R$',
          ],
          correct_index: 1,
          explanation: 'From $\\ln k = \\ln A - \\frac{E_a}{R}\\cdot\\frac1T$, the slope is $-E_a/R$ (negative) and the intercept is $\\ln A$.',
          difficulty_level: 1,
        },
        {
          question: 'A reaction takes 60 min at 300 K and 40 min at 400 K. The ratio $k_2/k_1$ to use in the Arrhenius formula is:',
          options: [
            '$40/60$',
            '$60/40$',
            '$400/300$',
            '$300/400$',
          ],
          correct_index: 1,
          explanation: 'A shorter time means a faster reaction, so $k_2/k_1 = t_1/t_2 = 60/40 = 1.5$. Times convert to an inverse rate-constant ratio.',
          difficulty_level: 2,
        },
        {
          question: 'For two reactions over the same temperature range, the one whose rate constant is MORE sensitive to temperature is the one with:',
          options: [
            'The smaller activation energy',
            'The larger activation energy',
            'The larger pre-exponential factor $A$',
            'The smaller pre-exponential factor $A$',
          ],
          correct_index: 1,
          explanation: 'The slope of $\\ln k$ vs $1/T$ is $-E_a/R$, so a larger $E_a$ gives a steeper slope and a stronger temperature dependence. High-barrier reactions respond most to heating.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 32 ─────────────────────────────────────────────────────────────
  page(32, 'activation-energy-and-energy-profile',
    'The Energy Barrier: Activation Energy and the Reaction Profile',
    'Every reaction has a hill to climb. Its height sets the speed; the drop on the far side sets the heat released.',
    ['chemical-kinetics', 'activation-energy', 'energy-profile', 'transition-state', 'enthalpy'],
    [
      B.hero(
        'A reaction-energy landscape drawn as a hill: reactants at one level climb to a peak (the transition state) then descend to products at a lower level',
        'Ultra-wide cinematic banner (16:5 ratio). A reaction-energy landscape shown as a hill: reactants sit at a starting level on the left, climb up to a sharp peak (the transition state) in the middle, then descend to products at a lower level on the right. A small figure is shown partway up the slope. The idea: every reaction climbs an energy barrier. Deep near-black background, orange profile curve and accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'Why does any energy barrier exist at all? To react, molecules must first break or distort their existing bonds before new ones form — and that costs energy. So every reaction has a **hill to climb**: the reactants must reach a high-energy, unstable arrangement called the **transition state** (the peak) before they can roll down to products. The height of that hill is the **activation energy $E_a$**.'
      ),
      B.img(
        'An energy profile: reactants on a plateau, rising over an activation-energy barrier to a transition-state peak, then falling to a lower products plateau, with Ea and the overall enthalpy change marked',
        '📸 The reaction profile: climb the activation-energy barrier to the transition state, then descend to products',
        'Reaction energy profile (potential energy on the y-axis, progress of reaction on the x-axis). Reactants sit on a plateau at left, the curve rises over a barrier to a peak labelled "transition state", then falls to a products plateau at lower energy on the right. Mark the activation energy Ea (reactants up to the peak) and the overall enthalpy change ΔH (reactants down to products). Dark background (#0a0a0a), orange curve and labels, clean technical illustration.'
      ),
      B.text(
        'Collisions that arrive with **less than $E_a$** simply bounce apart and go their separate ways — no product. Only collisions with enough energy reach the transition state and cross over. So a **taller barrier means a slower reaction** (fewer collisions qualify), which is the molecular reason behind everything on the previous pages.'
      ),
      B.heading('The barrier and the heat of reaction'),
      B.text(
        'The forward and backward activation energies, together with the energy gap between reactants and products, are linked:\n\n$$E_{a}(\\text{forward}) - E_{a}(\\text{backward}) = \\Delta H.$$\n\nIf the products sit *lower* than the reactants, $\\Delta H$ is negative — the reaction is **exothermic** (the forward barrier is smaller than the backward one). If the products sit *higher*, $\\Delta H$ is positive — **endothermic**. The barrier height controls the *rate*; the level difference controls the *heat*. They are independent: a reaction can be very exothermic yet very slow if its barrier is tall.'
      ),
      B.reason('logical',
        'Two reactions are both strongly exothermic (large negative $\\Delta H$), but one is fast at room temperature and the other is imperceptibly slow. How can two exothermic reactions differ so much in rate?',
        [
          'They cannot — exothermic reactions are always fast',
          'The slow one has a tall activation-energy barrier; $\\Delta H$ (the heat released) is set by the energy levels of reactants and products, while the rate is set by the barrier height — the two are independent',
          'The slow one must actually be endothermic',
          'The fast one releases more heat, so it must be faster',
        ],
        '$\\Delta H$ and $E_a$ are independent. The heat released depends only on the reactant–product energy gap; the speed depends on the barrier the reaction must climb. A large $E_a$ makes an exothermic reaction slow (e.g. the combustion of paper needs a match to start).',
        3
      ),
      B.sim('energy-profile-explorer', 'Energy Profile Explorer — barrier vs heat', {
        prompt: 'You make a reaction much more exothermic (drag ΔH far down) but leave the barrier tall. Does it become fast?',
        options: ['Yes — more heat released means faster', 'No — the rate is set by the barrier height, not by ΔH', 'Only at high temperature'],
        reveal_after: 'Rate is governed by the barrier (Eₐ), heat by the reactant–product gap (ΔH) — they are independent. A very exothermic reaction can still crawl behind a tall barrier (diamond → graphite is the extreme case). In the sim, drag ΔH down while keeping Eₐ high and watch the barrier — and so the speed — stay put.',
      }),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Profile essentials:** reactants $\\to$ transition state (peak, height $= E_a$) $\\to$ products. $E_a(\\text{fwd}) - E_a(\\text{back}) = \\Delta H$. Products lower $\\Rightarrow$ exothermic; higher $\\Rightarrow$ endothermic.\n\n**Independence:** rate is set by $E_a$, heat by $\\Delta H$ — a reaction can be exothermic *and* slow. "Higher $E_a$ means faster" is FALSE (taller hill = slower). Temperature does **not** lower $E_a$; it gives molecules more energy to clear it (a catalyst is what lowers $E_a$ — next pages).'
      ),
      B.quiz([
        {
          question: 'The activation energy of a reaction is:',
          options: [
            'The energy that is released as the products form',
            'The minimum energy needed to reach the transition state',
            'The total energy carried by the reactant molecules',
            'The energy difference between the reactants and products',
          ],
          correct_index: 1,
          explanation: '$E_a$ is the barrier height — the minimum energy needed to reach the transition state. The reactant–product energy gap is $\\Delta H$, a separate quantity.',
          difficulty_level: 1,
        },
        {
          question: 'For a reaction, $E_a(\\text{forward}) - E_a(\\text{backward})$ equals:',
          options: [
            'The activation energy of the forward reaction',
            'The overall enthalpy change $\\Delta H$',
            'Always zero',
            'The pre-exponential factor $A$',
          ],
          correct_index: 1,
          explanation: 'The difference between the forward and backward barriers is the energy gap between reactants and products, i.e. $\\Delta H$.',
          difficulty_level: 2,
        },
        {
          question: 'A reaction is strongly exothermic but extremely slow at room temperature. The most likely reason is that it has:',
          options: [
            'A very small overall enthalpy change',
            'A very high activation-energy barrier',
            'No transition state along the way',
            'A negative activation energy value',
          ],
          correct_index: 1,
          explanation: 'Rate is governed by $E_a$, not $\\Delta H$. A large barrier makes a reaction slow regardless of how much heat it would release — exothermic and slow can coexist.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nL4 batch A done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
