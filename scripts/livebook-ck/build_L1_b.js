'use strict';
/* Chemical Kinetics — Lecture 1, batch B: pages 4–6 (factors, average/instantaneous rate, rate & stoichiometry). */
const { B, page, buildPages } = require('./_lib');

const pages = [

  // ── PAGE 4 ──────────────────────────────────────────────────────────────
  page(4, 'factors-affecting-rate',
    'What Controls the Speed: Factors Affecting Rate',
    'Four levers you can actually pull — concentration, physical state, temperature, and catalyst — plus the full list exams expect.',
    ['chemical-kinetics', 'factors-affecting-rate', 'surface-area', 'temperature', 'catalyst'],
    [
      B.hero(
        'A glass jar holding a single iron nail glowing dull red, beside a second jar where a cloud of fine iron powder erupts into brilliant sparks — the same metal, the same air, very different speed',
        'Ultra-wide cinematic banner (16:5 ratio). Two glass jars side by side on a dark surface. Left jar: a single iron nail, barely glowing dull red. Right jar: a cloud of fine iron powder bursting into brilliant golden sparks and light. Same metal, same air — only the form is different, and the speed is dramatically different. Deep near-black background, warm spark glow. Photorealistic-cinematic. No text.'
      ),
      B.callout('fun_fact', 'You are a rare kind of animal',
        'About **85% of animal species** — all reptiles, most amphibians, insects, fish — borrow heat from their surroundings to keep the reactions of life running. Only mammals like you, and birds, make enough heat inside the body to hold those reactions at a steady, life-sustaining pace. A lizard on a cold morning is slow because *its chemistry is slow*. **Temperature controls reaction rate** — and that is true in a test tube exactly as it is in a frog.'
      ),
      B.text(
        'The rate of a reaction is not fixed by fate. Several things change it, and four of them are levers you can actually control:\n\n1. **Concentration** of the reactants\n2. **Physical state / surface area** of the reactants\n3. **Temperature**\n4. Presence of a **catalyst**\n\nExams also expect you to know the wider list: nature of reactants, radiation (light), pH of the medium, the polarity (dielectric constant) of the solvent, and electric or magnetic fields. But the four above are the ones that do the heavy lifting.'
      ),
      B.heading('Surface area: break it up and it reacts faster'),
      B.text(
        'Drop a big lump of salt into a bucket of water and it dissolves slowly. Grind that same lump into powder and it vanishes almost at once. Nothing about the salt changed — only the **surface exposed**. Picture a cube 1 cm on each side: its surface is $6\\text{ cm}^2$. Cut it into a million tiny cubes and the total surface jumps to about $600\\text{ cm}^2$ — a hundred times more area for the reaction to happen on. That is exactly why a single iron nail barely glows while fine iron powder flares into sparks.'
      ),
      B.img(
        'On the left a single solid cube; on the right the same cube cut into many tiny cubes, with the total surface area marked far larger',
        '📸 Same amount of solid, far more surface — so the reaction has far more room to happen',
        'Side-by-side diagram. Left: one solid cube labelled "1 cm cube, surface = 6 cm squared". Right: the same cube shown chopped into a grid of many tiny cubes, labelled "same mass, surface = 600 cm squared". An arrow between them labelled "more surface area to more reaction". Dark background (#0a0a0a), orange accent labels, clean technical illustration.'
      ),
      B.heading('Temperature: heat it and it races'),
      B.text(
        'Stir sugar into cold water and you wait. Stir it into boiling water and it is gone in seconds. Raising the temperature makes particles move faster and collide harder, so the reaction speeds up. As a rough rule you will meet again later, **raising the temperature speeds nearly every reaction up** — for many reactions, a 10 °C rise roughly doubles the rate.'
      ),
      B.heading('Concentration and catalyst'),
      B.text(
        'Pack more reactant into the same space (**higher concentration**) and particles collide more often, so the reaction goes faster. A **catalyst** is a substance that speeds a reaction up without being used up itself — we will give it a whole section later. For now, keep the headline: concentration up, rate up; catalyst present, rate up.'
      ),
      B.reason('logical',
        'A blacksmith wants a lump of coal to burn faster in his furnace. Without changing the coal itself or adding anything new, what is the single most effective thing he can do to speed up the burning?',
        [
          'Keep the lump whole, since a bigger piece holds more energy',
          'Crush the coal into a fine powder, exposing far more surface for the oxygen to attack',
          'Cool the furnace down so the reaction lasts longer',
          'Lower the amount of air reaching the coal',
        ],
        'Crushing the coal multiplies its exposed surface, so oxygen reacts with far more of it at once — the reaction speeds up sharply. Cooling or starving it of air would slow it down. This is the same surface-area lever that makes iron powder flare while a nail only smoulders.',
        2
      ),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Four controllable factors:** concentration, physical state (surface area), temperature, catalyst. Know these cold — questions often ask "which factor explains why powdered X reacts faster than lumpy X?" (answer: surface area).\n\n**Full list to recognise:** the four above plus nature of reactants, radiation, pH, solvent polarity (dielectric constant), and electric/magnetic fields.\n\n**Temperature direction:** rate almost always *increases* with temperature. A statement saying a higher temperature slows a reaction down is the trap.'
      ),
      B.quiz([
        {
          question: 'Powdered iron burns in air with bright sparks, while an iron nail of the same mass barely reacts. The factor responsible is:',
          options: [
            'The powder is a different element from the nail',
            'The powder has far greater surface area exposed to oxygen',
            'The powder is at a much higher temperature to begin with',
            'The nail contains more iron than the powder',
          ],
          correct_index: 1,
          explanation: 'Same metal, same mass — only the surface area differs. Powder exposes vastly more surface, so oxygen reacts with much more of it at once.',
          difficulty_level: 2,
        },
        {
          question: 'Which of the following is NOT one of the four factors you can readily control to change a reaction’s rate?',
          options: [
            'Concentration of reactants',
            'Temperature',
            'The molar mass of the reactant',
            'Presence of a catalyst',
          ],
          correct_index: 2,
          explanation: 'The four levers are concentration, physical state/surface area, temperature and catalyst. Molar mass is a fixed property of the substance — you cannot tune it to change the rate.',
          difficulty_level: 1,
        },
        {
          question: 'A reaction in solution runs at a certain rate at 25 °C. If you warm it to 35 °C, the most likely effect is:',
          options: [
            'The rate roughly doubles',
            'The rate roughly halves',
            'The rate is unchanged because concentration did not change',
            'The reaction stops',
          ],
          correct_index: 0,
          explanation: 'A common rule of thumb is that a 10 °C rise roughly doubles the rate for many reactions. Heating makes particles collide more often and more energetically, speeding the reaction up — not slowing or stopping it.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

  // ── PAGE 5 ──────────────────────────────────────────────────────────────
  page(5, 'average-and-instantaneous-rate',
    'Average and Instantaneous Rate',
    'Rate is just speed for a reaction — and like speed, it is always positive. Here is how to measure it at an instant.',
    ['chemical-kinetics', 'rate', 'average-rate', 'instantaneous-rate', 'tangent'],
    [
      B.hero(
        'A speedometer needle dissolving into a falling concentration curve, with a tangent line touching the curve at one point — speed of a car becoming the speed of a reaction',
        'Ultra-wide cinematic banner (16:5 ratio). On the left, a glowing car speedometer; its needle stretches rightward and morphs into a smooth falling curve on a graph, with a single straight tangent line touching the curve at one point and glowing orange. The visual idea: the speed of a car becomes the speed of a reaction. Deep near-black background, orange accents, cinematic. No text.'
      ),
      B.text(
        'A **rate** is just a change in some quantity per unit of time. The most familiar rate is speed — distance per unit time. The **rate of a reaction** is the same idea: how fast a concentration changes with time. In fact you can think of it as the *speed* of the reaction.'
      ),
      B.callout('remember', 'Rate is a speed — so it is always positive',
        'You already know this from physics: **speed is always positive**; it was *velocity* that could be negative. Rate of reaction behaves like speed — it is always reported as a positive number. That is why, when we write it in terms of a reactant that is being used up, we put a minus sign in front: the reactant’s concentration is falling, and the minus flips it positive.'
      ),
      B.text(
        'For $\\ce{A -> B}$, the reactant A disappears and the product B appears at the same pace:\n\n$$\\text{rate} = -\\frac{d[\\ce{A}]}{dt} = +\\frac{d[\\ce{B}]}{dt}$$\n\nThe minus sign on A is bookkeeping, not a real negative rate — $[\\ce{A}]$ is decreasing, so $\\dfrac{d[\\ce{A}]}{dt}$ is negative, and the minus makes the whole thing positive.'
      ),
      B.heading('Average rate vs the rate at an instant'),
      B.text(
        'There are two honest ways to quote a rate. The **average rate** is the change in concentration over a chosen time interval — on the curve, it is the slope of the straight line (a *secant*) joining the two endpoints:\n\n$$\\text{average rate} = \\frac{\\Delta c}{\\Delta t} = \\frac{c_2 - c_1}{t_2 - t_1}$$\n\nBut the reaction is not going at one fixed speed — it is fastest at the start and slows down. So we often want the rate **at a single instant**. That is the **instantaneous rate**: shrink the interval until it is a single point, and the secant becomes the **tangent** to the curve at that point.'
      ),
      B.latex('\\text{instantaneous rate} = \\lim_{\\Delta t \\to 0}\\frac{\\Delta c}{\\Delta t} = \\frac{dc}{dt}',
        'Instantaneous rate = gradient of the tangent',
        'Slope of the tangent to the concentration–time curve at the chosen moment. At $t = 0$ this gives the initial rate.'),
      B.img(
        'A falling reactant concentration curve with three tangent lines: a steep one at the start, a gentler one partway through, and a flat one at the end',
        '📸 The tangent’s steepness is the instantaneous rate — steep at the start, flat at the end',
        'Concentration–time graph: a smooth curve of reactant concentration falling from a high value and flattening to near zero. Three tangent lines are drawn: a steep tangent at t = 0 labelled "initial rate", a gentler tangent partway labelled "rate at time t", and a flat tangent near the end labelled "rate ≈ 0, reaction over". Dark background (#0a0a0a), orange tangent lines and labels, clean technical illustration.'
      ),
      B.heading('Why the rate falls as the reaction proceeds'),
      B.text(
        'Why does the curve flatten? Think about the particles. At the start you might have 100 reactant particles crowding the flask, colliding constantly. As they convert to product, you are left with 90, then 80, then fewer. Fewer particles means fewer collisions, and only a small fraction of collisions are "effective" enough to make product anyway. Fewer collisions, fewer effective ones — so the rate drops. By the end, almost no reactant is left, the collisions stop, and the rate falls to zero.'
      ),
      B.reason('quantitative',
        'On a reactant concentration–time curve, a student draws the tangent at $t = 0$ and another tangent near the end of the reaction. How do the two tangents compare, and what does that mean physically?',
        [
          'Both tangents have the same slope, so the rate is constant throughout',
          'The tangent at $t = 0$ is steep and the one near the end is nearly flat, meaning the reaction starts fast and slows almost to a stop',
          'The tangent near the end is steeper, meaning the reaction speeds up as it finishes',
          'Neither tangent has a slope because the curve is not a straight line',
        ],
        'A curve still has a well-defined tangent at every point. The early tangent is steep (high rate) and the late tangent is nearly flat (rate near zero) — the reaction is fastest at the start and slows as reactant runs out and collisions become rarer.',
        3
      ),
      B.worked('NCERT Example 4.1',
        'From the concentrations of $\\ce{C4H9Cl}$ (butyl chloride) at different times below, calculate the average rate of $\\ce{C4H9Cl + H2O -> C4H9OH + HCl}$ during different intervals.\n\n| $t$/s | 0 | 50 | 100 | 200 | 300 |\n|---|---|---|---|---|---|\n| $[\\ce{C4H9Cl}]$/mol L⁻¹ | 0.100 | 0.0905 | 0.0820 | 0.0671 | 0.0549 |',
        'The average rate over an interval is $r_{av} = -\\dfrac{\\Delta[\\ce{C4H9Cl}]}{\\Delta t}$.\n\n**Between 0 and 50 s:**\n\n$$r_{av} = -\\frac{0.0905 - 0.100}{50 - 0} = 1.90\\times10^{-4}\\ \\text{mol L}^{-1}\\text{s}^{-1}.$$\n\n**Between 200 and 300 s:**\n\n$$r_{av} = -\\frac{0.0549 - 0.0671}{300 - 200} = 1.22\\times10^{-4}\\ \\text{mol L}^{-1}\\text{s}^{-1}.$$\n\nThe average rate **falls** as the reaction proceeds (from $1.90$ down to about $0.4\\times10^{-4}$ near the end) because the reactant is being used up — the slowing you see in the concentration–time curve.',
        'ncert_intext'),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Rate vs order — a sign trap:** "the rate of a reaction can be positive, negative or zero" is **false**. Rate is a speed; it has to be positive. It is the **order** of a reaction that can be positive, negative, zero or fractional. Do not let the statement swap them.\n\n**Initial rate** = slope of the tangent at $t = 0$. **Average rate** = slope of the secant over an interval. They are equal only for a straight-line (zero-order) plot, or if the interval is chosen to match.'
      ),
      B.quiz([
        {
          question: 'For $\\ce{A -> B}$, the rate is written $-\\dfrac{d[\\ce{A}]}{dt}$. Why is the minus sign there?',
          options: [
            'Because the rate of the reaction is genuinely a negative quantity',
            'Because $[\\ce{A}]$ falls with time, making $\\dfrac{d[\\ce{A}]}{dt}$ negative, so the minus turns the rate positive',
            'Because A is a reactant and reactants always carry negative signs in chemistry',
            'Because B happens to form faster than A is being used up here',
          ],
          correct_index: 1,
          explanation: 'Rate is a speed and must be positive. Since $[\\ce{A}]$ falls, its derivative is negative; the minus sign flips it to a positive rate. There is no such thing as a negative reaction rate.',
          difficulty_level: 2,
        },
        {
          question: 'The instantaneous rate of a reaction at a particular time is found from the concentration–time curve by:',
          options: [
            'Joining the first and last points with a straight line and taking its slope',
            'Taking the slope of the tangent drawn to the curve at that time',
            'Reading the concentration value directly off the y-axis',
            'Measuring the area under the curve up to that time',
          ],
          correct_index: 1,
          explanation: 'Instantaneous rate is the gradient of the tangent at that instant. The secant (first-to-last line) gives the *average* rate over the whole interval, not the instantaneous one.',
          difficulty_level: 2,
        },
        {
          question: 'Which statement is correct?',
          options: [
            'The rate of a reaction can be positive, negative or zero as it runs',
            'Order can be negative, zero or fractional, but the rate is always positive',
            'Both the rate and the order must be positive whole numbers',
            'The rate is negative whenever a reactant is being used up',
          ],
          correct_index: 1,
          explanation: 'Rate is a speed and is always positive. Order is a different quantity — it can be negative, zero or fractional. Confusing the two is a classic exam trap.',
          difficulty_level: 3,
        },
      ]),
    ]
  ),

  // ── PAGE 6 ──────────────────────────────────────────────────────────────
  page(6, 'rate-and-stoichiometry',
    'One Reaction, One Rate: Rate and Stoichiometry',
    'Different species change at different speeds in the same reaction — the stoichiometric coefficients tie them into one agreed rate.',
    ['chemical-kinetics', 'rate', 'stoichiometry', 'rate-expression', 'units-of-rate'],
    [
      B.hero(
        'Three coloured concentration curves on one graph changing at different steepnesses, linked by a single brace labelled with one shared rate',
        'Ultra-wide cinematic banner (16:5 ratio). One graph with three smooth coloured curves changing at clearly different steepnesses — one falling steeply, one rising gently, one rising steeply — all gathered by a single glowing brace on the right that ties them into one shared value. The idea: many species, different speeds, one agreed rate. Deep near-black background, orange and cool accents, cinematic technical style. No text.'
      ),
      B.text(
        'Here is a subtlety. In $\\ce{2H2O2 -> 2H2O + O2}$, oxygen appears only half as fast as hydrogen peroxide disappears — because two molecules of $\\ce{H2O2}$ are consumed for every one $\\ce{O2}$ made. So "the rate" measured on $\\ce{H2O2}$ and "the rate" measured on $\\ce{O2}$ come out as different numbers. That is awkward. We want **one** rate for the reaction that everyone agrees on, whichever species they watch.'
      ),
      B.text(
        'The fix is to divide each species’ rate of change by its stoichiometric coefficient. For a general reaction\n\n$$a\\,\\ce{A} + b\\,\\ce{B} \\longrightarrow c\\,\\ce{C} + d\\,\\ce{D}$$\n\nthe single, agreed rate is:'
      ),
      B.latex('\\text{rate} = -\\frac{1}{a}\\frac{d[\\ce{A}]}{dt} = -\\frac{1}{b}\\frac{d[\\ce{B}]}{dt} = +\\frac{1}{c}\\frac{d[\\ce{C}]}{dt} = +\\frac{1}{d}\\frac{d[\\ce{D}]}{dt}',
        'The rate of a general reaction',
        'Divide each species’ rate of change by its coefficient; the minus signs sit on the reactants so every term is positive.'),
      B.callout('note', 'This is logic, not a formula to memorise',
        'The $\\dfrac{1}{\\text{coefficient}}$ is not a magic rule to learn by heart. It falls straight out of common sense: two $\\ce{H2O2}$ vanish for each $\\ce{O2}$ formed, so $\\ce{O2}$ changes at half the rate. Write the ordinary mole relationship, rearrange it, and these fractions appear on their own.'
      ),
      B.text(
        'Apply it to the peroxide example, $\\ce{2H2O2 -> 2H2O + O2}$:\n\n$$\\text{rate} = -\\frac{1}{2}\\frac{d[\\ce{H2O2}]}{dt} = +\\frac{1}{2}\\frac{d[\\ce{H2O}]}{dt} = +\\frac{d[\\ce{O2}]}{dt}$$\n\nSo the rate of formation of $\\ce{O2}$ is **half** the rate of disappearance of $\\ce{H2O2}$. Read it the other way and oxygen forms at half the speed peroxide is consumed — exactly what the coefficients said.'
      ),
      B.worked('Worked Example — mind the units',
        'For $\\ce{2SO2 + O2 -> 2SO3}$, the rate of formation of $\\ce{SO3}$ is **100 g/min**. Find the rate of disappearance of $\\ce{O2}$, in g/min.',
        'This is where most students slip. The tempting move is to use the coefficients straight on the grams: "$\\ce{O2}$ is half of $\\ce{SO3}$, so $100/2 = 50$ g/min." That is **wrong** — the $\\tfrac{1}{\\text{coefficient}}$ rule works on **moles**, not grams.\n\n**Step 1 — convert to moles.** $\\ce{SO3}$ forms at 100 g/min. Molar mass of $\\ce{SO3} = 80$ g/mol.\n\nrate of $\\ce{SO3}$ formation $= \\dfrac{100}{80}$ mol/min.\n\n**Step 2 — use the coefficients (on moles).** From $\\ce{2SO2 + O2 -> 2SO3}$:\n\n$$-\\frac{d[\\ce{O2}]}{dt} = \\frac{1}{2}\\,\\frac{d[\\ce{SO3}]}{dt} = \\frac{1}{2}\\times\\frac{100}{80}\\ \\text{mol/min}.$$\n\n**Step 3 — convert back to grams.** Molar mass of $\\ce{O2} = 32$ g/mol.\n\n$$-\\frac{d[\\ce{O2}]}{dt} = \\frac{1}{2}\\times\\frac{100}{80}\\times 32 = 20\\ \\text{g/min}.$$\n\n**Answer: 20 g/min** — not 50. **Watch out:** whenever a rate is given in g (or any mass unit), convert to moles *before* applying the coefficient ratio, then convert back. The bare "divide by 2" on grams is the silly mistake examiners are fishing for.'
      ),
      B.callout('warning', 'Rate of reaction has no meaning without a balanced equation',
        'The phrase "rate of reaction" only makes sense once you fix the equation, because the $\\tfrac{1}{\\text{coefficient}}$ factors depend on it. Write $\\ce{N2 + 3H2 -> 2NH3}$ and you get one set of factors; write the same chemistry as $\\ce{2N2 + 6H2 -> 4NH3}$ and the factors all double. Same reaction, different bookkeeping — so always state the equation you are using.'
      ),
      B.reason('quantitative',
        'For $\\ce{2NO2 -> 2NO + O2}$, how does the rate of formation of $\\ce{NO}$ compare with the rate of formation of $\\ce{O2}$?',
        [
          'They are equal, since both are products',
          'The rate of formation of $\\ce{NO}$ is twice the rate of formation of $\\ce{O2}$, because two $\\ce{NO}$ form for every one $\\ce{O2}$',
          'The rate of formation of $\\ce{O2}$ is twice that of $\\ce{NO}$',
          'You cannot compare them without knowing the temperature',
        ],
        'The single rate is $-\\tfrac12\\tfrac{d[\\ce{NO2}]}{dt} = +\\tfrac12\\tfrac{d[\\ce{NO}]}{dt} = +\\tfrac{d[\\ce{O2}]}{dt}$. So $\\tfrac12\\tfrac{d[\\ce{NO}]}{dt} = \\tfrac{d[\\ce{O2}]}{dt}$, meaning NO forms twice as fast as $\\ce{O2}$ — exactly the 2 : 1 coefficient ratio.',
        3
      ),
      B.worked('NCERT Example 4.2',
        'The decomposition of $\\ce{N2O5}$ in $\\ce{CCl4}$ at 318 K follows $\\ce{2N2O5 -> 4NO2 + O2}$. The $\\ce{N2O5}$ concentration falls from $2.33$ to $2.08\\ \\text{mol L}^{-1}$ in 184 minutes. Find the average rate (in $\\text{mol L}^{-1}\\text{s}^{-1}$) and the rate of production of $\\ce{NO2}$.',
        'Use the single rate with the $1/\\text{coefficient}$ factors.\n\n**Average rate:**\n\n$$r_{av} = -\\frac{1}{2}\\frac{\\Delta[\\ce{N2O5}]}{\\Delta t} = -\\frac{1}{2}\\cdot\\frac{(2.08 - 2.33)}{184} = 6.79\\times10^{-4}\\ \\text{mol L}^{-1}\\text{min}^{-1}.$$\n\nConvert to seconds: $6.79\\times10^{-4} \\div 60 = 1.13\\times10^{-5}\\ \\text{mol L}^{-1}\\text{s}^{-1}$.\n\n**Rate of production of $\\ce{NO2}$:** the same rate equals $\\frac{1}{4}\\frac{\\Delta[\\ce{NO2}]}{\\Delta t}$, so\n\n$$\\frac{\\Delta[\\ce{NO2}]}{\\Delta t} = 4 \\times 6.79\\times10^{-4} = 2.72\\times10^{-3}\\ \\text{mol L}^{-1}\\text{min}^{-1}.$$',
        'ncert_intext'),
      B.callout('exam_tip', 'JEE / NEET Exam Insight',
        '**Units of rate of reaction:** concentration over time, usually $\\text{mol L}^{-1}\\text{s}^{-1}$ (or $\\text{atm}\\,\\text{time}^{-1}$ for gases by pressure). These units are **always the same**, no matter the order — do not confuse them with the units of the rate *constant* $k$, which DO change with order (next pages).\n\n**Grams trap:** when a rate is given in g/min, convert to mol/min before applying coefficient ratios (the $\\ce{SO3}$ worked example). Forgetting this is the most common silly mistake in this topic.'
      ),
      B.quiz([
        {
          question: 'For $\\ce{2H2O2 -> 2H2O + O2}$, the rate of formation of $\\ce{O2}$ compared with the rate of disappearance of $\\ce{H2O2}$ is:',
          options: [
            'Equal to it',
            'Twice it',
            'Half of it',
            'One-quarter of it',
          ],
          correct_index: 2,
          explanation: 'Two $\\ce{H2O2}$ are consumed for each $\\ce{O2}$ formed, so $\\tfrac{d[\\ce{O2}]}{dt} = \\tfrac12\\left(-\\tfrac{d[\\ce{H2O2}]}{dt}\\right)$ — oxygen forms at half the rate peroxide disappears.',
          difficulty_level: 2,
        },
        {
          question: 'For $\\ce{2SO2 + O2 -> 2SO3}$, $\\ce{SO3}$ forms at 100 g/min. The rate of disappearance of $\\ce{O2}$ is:',
          options: [
            '50 g/min',
            '20 g/min',
            '100 g/min',
            '40 g/min',
          ],
          correct_index: 1,
          explanation: 'Convert first: $\\ce{SO3}$ at $100/80$ mol/min; $\\ce{O2}$ disappears at half that, $=\\tfrac12\\cdot\\tfrac{100}{80}$ mol/min; times $32$ g/mol gives 20 g/min. The "$100/2 = 50$" shortcut on grams is the trap.',
          difficulty_level: 3,
        },
        {
          question: 'Why must a balanced equation be specified before the "rate of reaction" is meaningful?',
          options: [
            'Because the units of the rate of reaction depend on the equation you choose',
            'Because the $1/\\text{coefficient}$ factors come from the equation and change if rewritten',
            'Because rate is only defined for reactions with whole-number coefficients',
            'Because the reaction temperature is somehow hidden inside the equation',
          ],
          correct_index: 1,
          explanation: 'The agreed single rate uses $1/\\text{coefficient}$ factors. Writing $\\ce{N2 + 3H2 -> 2NH3}$ vs $\\ce{2N2 + 6H2 -> 4NH3}$ doubles those factors, so the numerical rate depends on which equation you fixed.',
          difficulty_level: 2,
        },
      ]),
    ]
  ),

];

buildPages(pages)
  .then(() => { console.log('\nbatch B done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
