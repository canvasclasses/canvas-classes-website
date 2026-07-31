'use strict';
/**
 * Class 11 Physics · Chapter 1 "Units and Dimensions" — pages 10–13.
 * Dimensions, dimensional analysis, the exam patterns, and the recap.
 *
 * The Dimension Lab simulation (simulation_id: dimension-lab) appears twice:
 *   p10 — Build and Match modes: derive a dimensional formula, then recall it.
 *   p11 — Check mode: the principle of homogeneity, performed.
 *
 * Run: node scripts/physics11-book/build_ch1_dimensions.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch1');

// ── p10 · What a Quantity Is Made Of ─────────────────────────────────────────
const p10 = {
  page_number: 10,
  slug: 'what-a-quantity-is-made-of',
  title: 'What a Quantity Is Made Of',
  subtitle: 'Dimensions and dimensional formulae',
  glossary: [
    { term: 'dimensions', definition: 'The powers to which the base quantities must be raised to make up a given quantity.' },
    { term: 'dimensional formula', definition: 'The expression showing those powers, written in square brackets — force is [M L T⁻²].' },
    { term: 'dimensional equation', definition: 'A statement equating a quantity to its dimensional formula, such as [F] = [M L T⁻²].' },
    { term: 'dimensionless quantity', definition: 'A quantity whose dimensions all cancel to zero — angle, strain and refractive index are examples.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Density is mass divided by volume. Now throw away the numbers and throw away the units — forget kilograms, forget grams, forget cubic metres. Is there anything left that still describes what density **is**?',
      hint: 'A volume is a length times a length times a length, whatever unit you use.',
      reveal: 'Yes. Something survives: **one mass, divided by three lengths.**\n\nThat statement is true whether you work in SI, in CGS, or in units nobody has invented yet. It is not about how big density is, and not about which units you chose. It is about what density is *built out of*.\n\nWe write it as $ [\\rho] = [\\text{M L}^{-3}] $, and we call it the **dimensional formula** of density.',
    }),
    b('text', 1, {
      markdown: 'The **dimensions** of a physical quantity are the powers to which the base quantities must be raised to produce it.\n\nWe use one letter for each: **M** for mass, **L** for length, **T** for time, **A** for electric current, **K** for temperature, **mol** for amount of substance and **cd** for luminous intensity. Square brackets mean "the dimensions of".\n\nMost of Class 11 mechanics needs only M, L and T.',
    }),
    b('text', 2, {
      markdown: 'Two words that sound the same and are not:\n\n- A **dimensional formula** is the expression itself — $ [\\text{M L}^{2}\\text{T}^{-2}] $.\n- A **dimensional equation** puts a quantity equal to it — $ [W] = [\\text{M L}^{2}\\text{T}^{-2}] $.\n\nAnd one rule that saves you every time: **start from the defining equation, never from memory.** Anyone can misremember a formula. Nobody misremembers that force is mass times acceleration.',
    }),
    b('step_solver', 3, {
      title: 'Building one from scratch',
      problem: 'Find the dimensional formula of pressure.',
      intro: 'Three lines, every time, for every quantity in physics. The method never changes.',
      steps: [
        st('$ \\text{pressure} = \\frac{\\text{force}}{\\text{area}} $',
          'The defining equation. Always line one.'),
        st('$ [\\text{force}] = [\\text{M L T}^{-2}], \\qquad [\\text{area}] = [\\text{L}^{2}] $',
          'Replace each factor by its own dimensions.', {
            check: {
              kind: 'mcq',
              prompt: 'Where does $ [\\text{M L T}^{-2}] $ for force come from?',
              options: ['It has to be memorised', 'From force = mass × acceleration, and acceleration is $ \\text{L T}^{-2} $', 'From the unit newton', 'From Newton\'s third law'],
              answer_index: 1,
              feedback_right: 'Right — every dimensional formula traces back to a defining equation.',
              feedback_wrong: 'Force = mass × acceleration. Mass gives M, and acceleration (length per time per time) gives $ \\text{L T}^{-2} $.',
            },
          }),
        st('$ [P] = \\frac{[\\text{M L T}^{-2}]}{[\\text{L}^{2}]} = [\\text{M L}^{-1}\\text{T}^{-2}] $',
          'Divide, subtracting the powers of L.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The L powers are $ 1 $ on top and $ 2 $ underneath. What is $ 1 - 2 $?',
              blank_answer: '-1',
              feedback_right: 'Yes — so L ends up with a power of −1.',
              feedback_wrong: 'Dividing subtracts exponents: $ 1 - 2 = -1 $.',
            },
          }),
      ],
      now_you_try: {
        problem: 'Find the dimensional formula of work.',
        answer: '$ [\\text{M L}^{2}\\text{T}^{-2}] $',
        solution: 'Work = force × displacement $ = [\\text{M L T}^{-2}][\\text{L}] = [\\text{M L}^{2}\\text{T}^{-2}] $.',
      },
    }),
    b('text', 4, {
      markdown: 'Now do that for yourself, for as many quantities as you like.\n\nIn the lab below, **Build** hands you a defining equation and lets you substitute one factor at a time — the ledger and the formula update on every tap, so you watch the exponents assemble. **Match** then takes the equation away and asks you to set the exponents from memory.',
    }),
    b('simulation', 5, {
      simulation_id: 'dimension-lab',
      title: 'Dimension Lab — build it, then recall it',
      prediction: {
        prompt: 'Before you open it: torque is force × distance, and work is force × distance. Do torque and work have the same dimensional formula?',
        options: ['Yes, and that means they are the same quantity', 'Yes, but they are still different quantities', 'No, torque has an extra length', 'No, torque is a vector so it has different dimensions'],
        reveal_after: 'Both are $ [\\text{M L}^{2}\\text{T}^{-2}] $ — identical. And yet a torque is not an energy; you cannot heat a room with a spanner.\n\nThis is the single most important warning in the whole topic: **same dimensions never means same physics.** It only means the two quantities *could* legally be compared or equated. Use Match mode to collect more of these collisions.',
      },
    }),
    b('heading', 6, {
      text: 'Quantities with no dimensions at all',
      level: 2,
      objective: 'Recognise dimensionless quantities and explain why they have no dimensions.',
    }),
    b('text', 7, {
      markdown: 'Some quantities are a ratio of two things of the same kind, so everything cancels:\n\n- **Angle** = arc / radius — a length over a length\n- **Strain** = change in length / original length\n- **Refractive index** = speed of light in vacuum / speed in the medium\n- **Relative density** = density of a substance / density of water\n\nWe write these as $ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{0}] $. The zeros are not decoration — they are the statement that this quantity is a pure number.\n\nAnd note the difference: strain has **neither a unit nor a dimension**, while an angle has a **unit** (the radian) but **no dimension**.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('Which of these is **not** dimensionless?',
          ["Planck's constant", 'Strain', 'Refractive index', 'Solid angle'], 0,
          "Planck's constant has dimensions $ [\\text{M L}^{2}\\text{T}^{-1}] $ — the same as angular momentum. The other three are all pure ratios.", 2),
        q('A quantity has the dimensional formula $ [\\text{M L}^{-1}\\text{T}^{-2}] $. It could be:',
          ['Force', 'Energy', "Young's modulus", 'Momentum'], 2,
          "Young's modulus is stress divided by strain. Stress is a pressure, and strain is dimensionless, so the modulus has exactly the dimensions of pressure.", 2),
        q('Can a physical quantity have a unit but no dimensions?',
          ['No, never', 'Yes — an angle, measured in radians', 'Yes — but only in the CGS system', 'Only if it is a constant'], 1,
          'An angle is arc length divided by radius, so the dimensions cancel completely. The radian survives as a name for the unit, but there is nothing dimensional left.', 3),
      ],
    }),
    b('table', 9, {
      caption: 'The dimensional formulae worth knowing cold. Everything else you can derive in three lines.',
      headers: ['Quantity', 'Defining relation', 'Dimensional formula'],
      rows: [
        ['Area', 'length × breadth', '$ [\\text{M}^{0}\\text{L}^{2}\\text{T}^{0}] $'],
        ['Volume', 'length³', '$ [\\text{M}^{0}\\text{L}^{3}\\text{T}^{0}] $'],
        ['Density', 'mass / volume', '$ [\\text{M L}^{-3}] $'],
        ['Velocity', 'displacement / time', '$ [\\text{M}^{0}\\text{L T}^{-1}] $'],
        ['Acceleration', 'velocity / time', '$ [\\text{M}^{0}\\text{L T}^{-2}] $'],
        ['Force', 'mass × acceleration', '$ [\\text{M L T}^{-2}] $'],
        ['Momentum', 'mass × velocity', '$ [\\text{M L T}^{-1}] $'],
        ['Impulse', 'force × time', '$ [\\text{M L T}^{-1}] $'],
        ['Work, energy', 'force × displacement', '$ [\\text{M L}^{2}\\text{T}^{-2}] $'],
        ['Torque', 'force × distance', '$ [\\text{M L}^{2}\\text{T}^{-2}] $'],
        ['Power', 'work / time', '$ [\\text{M L}^{2}\\text{T}^{-3}] $'],
        ['Pressure, stress', 'force / area', '$ [\\text{M L}^{-1}\\text{T}^{-2}] $'],
        ["Young's modulus", 'stress / strain', '$ [\\text{M L}^{-1}\\text{T}^{-2}] $'],
        ['Surface tension', 'force / length', '$ [\\text{M T}^{-2}] $'],
        ['Frequency', '1 / time period', '$ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{-1}] $'],
        ['Moment of inertia', 'mass × distance²', '$ [\\text{M L}^{2}\\text{T}^{0}] $'],
        ['Angular momentum', 'momentum × distance', '$ [\\text{M L}^{2}\\text{T}^{-1}] $'],
        ["Planck's constant", 'energy / frequency', '$ [\\text{M L}^{2}\\text{T}^{-1}] $'],
        ['Gravitational constant', 'force × distance² / mass²', '$ [\\text{M}^{-1}\\text{L}^{3}\\text{T}^{-2}] $'],
        ['Coefficient of viscosity', 'force / (area × velocity gradient)', '$ [\\text{M L}^{-1}\\text{T}^{-1}] $'],
      ],
    }),
    b('callout', 10, {
      variant: 'note',
      title: 'Beyond mechanics — for JEE and NEET',
      markdown: 'Once electricity arrives you need the current dimension **A** as well. These come up regularly:\n\n- Charge $ [\\text{A T}] $ · Potential difference $ [\\text{M L}^{2}\\text{T}^{-3}\\text{A}^{-1}] $\n- Resistance $ [\\text{M L}^{2}\\text{T}^{-3}\\text{A}^{-2}] $ · Capacitance $ [\\text{M}^{-1}\\text{L}^{-2}\\text{T}^{4}\\text{A}^{2}] $\n- Magnetic field $ [\\text{M T}^{-2}\\text{A}^{-1}] $ · Inductance $ [\\text{M L}^{2}\\text{T}^{-2}\\text{A}^{-2}] $\n- Permittivity of free space $ [\\text{M}^{-1}\\text{L}^{-3}\\text{T}^{4}\\text{A}^{2}] $\n\nDo not memorise this list. Every one of them is in the Dimension Lab with its defining equation — build each one once and you will be able to rebuild it in the exam.',
    }),
    b('callout', 11, {
      variant: 'remember',
      title: 'Constants have dimensions too',
      markdown: 'A **dimensional constant** has a fixed value *and* dimensions — the gravitational constant G, Planck\'s constant h, the speed of light c.\n\nA **dimensionless constant** is a pure number — 1, 2, $ \\pi $, e, and every trigonometric ratio.\n\nThat second group is about to become very important, because dimensional analysis cannot see them at all.',
    }),
    b('practice_bank', 12, {
      title: 'You solve it',
      intro: 'Write the defining equation first for each one. That habit is the whole skill.',
      sections: [
        {
          id: 'p10-ysi',
          title: 'Finding dimensional formulae',
          items: [
            num('p10-y1', 'Find the dimensional formulae of (a) power and (b) surface tension, starting from their defining equations.',
              '(a) $ [\\text{M L}^{2}\\text{T}^{-3}] $  (b) $ [\\text{M T}^{-2}] $',
              '(a) Power = work / time $ = \\frac{[\\text{M L}^{2}\\text{T}^{-2}]}{[\\text{T}]} = [\\text{M L}^{2}\\text{T}^{-3}] $.\n\n(b) Surface tension = force / length $ = \\frac{[\\text{M L T}^{-2}]}{[\\text{L}]} = [\\text{M T}^{-2}] $. Notice the L cancels away completely.'),
            mcq('p10-y2', 'The dimensions of impulse are the same as those of:',
              ['Force', 'Linear momentum', 'Pressure', 'Angular momentum'], 1,
              'Impulse = force × time $ = [\\text{M L T}^{-2}][\\text{T}] = [\\text{M L T}^{-1}] $, which is exactly momentum. This is not a coincidence — impulse *equals* the change in momentum.'),
            mcq('p10-y3', 'Which of these does **not** have the same dimensions as the others?',
              ['Stress', 'Bulk modulus', 'Thrust', 'Energy density'], 2,
              'Thrust is another name for force, $ [\\text{M L T}^{-2}] $. Stress, bulk modulus and energy density are all $ [\\text{M L}^{-1}\\text{T}^{-2}] $ — the pressure family.'),
            num('p10-y4', 'Show that the ratio of angular momentum to linear momentum has the dimensions of length.',
              '$ [\\text{M}^{0}\\text{L T}^{0}] $ — a length',
              '$ \\frac{[\\text{M L}^{2}\\text{T}^{-1}]}{[\\text{M L T}^{-1}]} $. The M cancels, the T cancels, and $ \\text{L}^{2}/\\text{L} = \\text{L} $. So the ratio is a length — which makes sense, since angular momentum is momentum times a distance.'),
            mcq('p10-y5', 'The dimensional formula $ [\\text{M L}^{-1}\\text{T}^{-1}] $ belongs to:',
              ['Work', 'Torque', 'Coefficient of viscosity', 'Linear momentum'], 2,
              'Viscosity is the odd one out of the "M L to some power" family. It differs from pressure $ [\\text{M L}^{-1}\\text{T}^{-2}] $ by exactly one power of T — a distinction students lose marks on constantly.'),
            num('p10-y6', 'Starting from its defining equation, find the dimensional formula of the gravitational constant $ G $, given $ F = \\frac{Gm_1m_2}{r^{2}} $.',
              '$ [\\text{M}^{-1}\\text{L}^{3}\\text{T}^{-2}] $',
              'Rearrange for G: $ G = \\frac{Fr^{2}}{m_1m_2} $.\n\n$ [G] = \\frac{[\\text{M L T}^{-2}][\\text{L}^{2}]}{[\\text{M}^{2}]} = [\\text{M}^{1-2}\\text{L}^{1+2}\\text{T}^{-2}] = [\\text{M}^{-1}\\text{L}^{3}\\text{T}^{-2}] $\n\nThe mass exponent goes negative because two masses sit in the denominator against one in the force.'),
            mcq('p10-y7', 'Which quantity has the dimensional formula $ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{-1}] $?',
              ['Time period', 'Angular velocity', 'Angular momentum', 'Angular acceleration'], 1,
              'Angular velocity is an angle per unit time, and an angle is dimensionless — so only $ \\text{T}^{-1} $ survives. Angular acceleration would be $ \\text{T}^{-2} $, and a time period is simply $ [\\text{T}] $.'),
            num('p10-y8', 'The energy of a photon is $ E = h\\nu $, where $ \\nu $ is frequency. Use this to find the dimensions of Planck\'s constant $ h $.',
              '$ [\\text{M L}^{2}\\text{T}^{-1}] $',
              '$ h = \\frac{E}{\\nu} = \\frac{[\\text{M L}^{2}\\text{T}^{-2}]}{[\\text{T}^{-1}]} = [\\text{M L}^{2}\\text{T}^{-2+1}] = [\\text{M L}^{2}\\text{T}^{-1}] $\n\nDividing by $ \\text{T}^{-1} $ is the same as multiplying by T — which is why h is measured in joule-**seconds**.'),
            mcq('p10-y9', 'A student says "the dimensional formula of speed is $ \\text{m s}^{-1} $." The mistake is that:',
              ['Speed has no dimensions', 'The formula should be $ \\text{km h}^{-1} $', 'Those are units, not dimensions', 'Speed is a base quantity'], 2,
              'Dimensions are written with the base-quantity symbols M, L and T, and are the same whatever units you use. Speed is $ [\\text{M}^{0}\\text{L T}^{-1}] $; $ \\text{m s}^{-1} $ is its SI unit. Mixing the two up is a very common slip in written answers.'),
            num('p10-y10', 'Find the dimensional formula of the spring constant $ k $, from $ F = kx $.',
              '$ [\\text{M T}^{-2}] $',
              '$ k = \\frac{F}{x} = \\frac{[\\text{M L T}^{-2}]}{[\\text{L}]} = [\\text{M T}^{-2}] $.\n\nThe length cancels completely, which puts the spring constant in the same family as surface tension — both are a force per unit length.'),
          ],
        },
      ],
    }),
  ],
};

// ── p11 · Three Things Dimensions Let You Do ─────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'three-things-dimensions-let-you-do',
  title: 'Three Things Dimensions Let You Do',
  subtitle: 'Checking, converting, deriving — and the three things they cannot do',
  glossary: [
    { term: 'principle of homogeneity', definition: 'Every term in a physically correct equation must have the same dimensions. Only like can be added to like.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Someone writes $ \\frac{1}{2}mv^{2} = mgh $ on the board. You have not studied energy yet and you do not know whether this is a real formula. Can you still say something useful about whether it could be right?',
      hint: 'You do not need to know what the equation means. Only what each side is made of.',
      reveal: 'Yes — and without knowing any mechanics at all.\n\nLeft side: $ [\\text{M}][\\text{L T}^{-1}]^{2} = [\\text{M L}^{2}\\text{T}^{-2}] $.\nRight side: $ [\\text{M}][\\text{L T}^{-2}][\\text{L}] = [\\text{M L}^{2}\\text{T}^{-2}] $.\n\nThey match, so the equation is at least **allowed**. If they had not matched, you could have thrown it out on the spot.\n\nThat is the first of the three powers on this page. (This is NCERT\'s own Example 1.3.)',
    }),
    b('text', 1, {
      markdown: 'Everything on this page rests on one rule, called the **principle of homogeneity**:\n\n> Every term in a physically meaningful equation must have the same dimensions.\n\nThe reasoning is almost childish. You cannot add 3 kilograms to 5 seconds — the sum would mean nothing. So quantities may only be added, subtracted, or set equal when they are made of the same things.\n\nFrom that one rule come three genuinely useful abilities.',
    }),
    b('heading', 2, {
      text: 'Power 1 — check an equation you are not sure about',
      level: 2,
      objective: 'Test any equation for dimensional consistency, and state what a pass and a fail each prove.',
    }),
    b('step_solver', 3, {
      title: 'Testing a suspicious formula',
      problem: 'A student writes the centripetal force as $ F = \\frac{mv^{2}}{r^{2}} $. Is this dimensionally consistent?',
      intro: 'Take each side apart separately, then compare. Never compare halfway through.',
      steps: [
        st('$ [F] = [\\text{M L T}^{-2}] $',
          'The left-hand side is a force, and we know what a force is made of.'),
        st('$ \\left[\\frac{mv^{2}}{r^{2}}\\right] = \\frac{[\\text{M}][\\text{L}^{2}\\text{T}^{-2}]}{[\\text{L}^{2}]} = [\\text{M T}^{-2}] $',
          'Now the right-hand side, carefully.', {
            check: {
              kind: 'mcq',
              prompt: 'The L powers are $ 2 $ on top and $ 2 $ underneath. What survives?',
              options: ['$ \\text{L}^{4} $', '$ \\text{L}^{2} $', '$ \\text{L}^{0} $ — the lengths cancel', '$ \\text{L}^{-2} $'],
              answer_index: 2,
              feedback_right: 'Right — they cancel completely, which is exactly the problem.',
              feedback_wrong: 'Dividing subtracts: $ 2 - 2 = 0 $, so no length survives at all.',
            },
          }),
        st('$ [\\text{M L T}^{-2}] \\ne [\\text{M T}^{-2}] $ — the equation is **wrong**',
          'One power of length short.', {
            why: 'And dimensions tell you how to fix it: we need one more L upstairs, so the denominator should be $ r $, not $ r^{2} $. The correct formula is $ F = \\frac{mv^{2}}{r} $ — recovered without knowing a single thing about circular motion.',
          }),
      ],
      now_you_try: {
        problem: 'Check whether $ v^{2} = u^{2} + 2as $ is dimensionally consistent.',
        answer: 'Yes — every term is $ [\\text{L}^{2}\\text{T}^{-2}] $',
        solution: '$ [v^{2}] = [\\text{L T}^{-1}]^{2} = [\\text{L}^{2}\\text{T}^{-2}] $\n\n$ [u^{2}] = [\\text{L}^{2}\\text{T}^{-2}] $\n\n$ [2as] = [\\text{L T}^{-2}][\\text{L}] = [\\text{L}^{2}\\text{T}^{-2}] $ — the 2 is a pure number and contributes nothing.\n\nAll three match, so the equation passes.',
      },
    }),
    b('callout', 4, {
      variant: 'warning',
      title: 'What a pass proves, and what it does not',
      markdown: 'This is the sentence NCERT wants you to be able to say:\n\n> **A dimensionally wrong equation is definitely wrong. A dimensionally correct equation is not necessarily right.**\n\nThe test is a filter, not a proof. $ s = ut + at^{2} $ passes perfectly — every term is a length — and it is still wrong, because the $ \\frac{1}{2} $ is missing. Dimensions are blind to pure numbers.\n\nSo use the test to **reject**, and never to confirm.',
    }),
    b('text', 5, {
      markdown: 'One more thing the rule catches. Whatever sits inside a $ \\sin $, $ \\cos $, $ \\log $ or exponential must be **dimensionless**.\n\nThink about why: $ \\sin\\theta $ expands as $ \\theta - \\frac{\\theta^{3}}{6} + \\cdots $, so you would be adding an angle to an angle cubed. That only makes sense if the angle has no dimensions to begin with.\n\nSo $ y = a\\sin(vt) $ is wrong — $ vt $ is a length. It should be $ y = a\\sin\\left(\\frac{2\\pi t}{T}\\right) $, where the times cancel.',
    }),
    b('simulation', 6, {
      simulation_id: 'dimension-lab',
      title: 'Dimension Lab — Check mode',
      prediction: {
        prompt: 'Open the **Check** tab. One of the equations there passes the dimensional test and is still physically wrong. Before you look — what could make that happen?',
        options: ['A missing pure number like ½', 'A wrong unit', 'A term with the wrong dimensions', 'It is impossible'],
        reveal_after: 'A missing pure number. Work through all eight equations in Check mode — two of them are dimensionally correct but physically wrong, and finding them yourself is the point.',
      },
    }),
    b('heading', 7, {
      text: 'Power 2 — convert between systems of units',
      level: 2,
      objective: 'Recognise that the conversion machinery from page 4 was dimensional analysis all along.',
    }),
    b('text', 8, {
      markdown: 'You have already used this one. On page 4 you wrote\n\n$ n_2 = n_1 \\left[\\frac{M_1}{M_2}\\right]^{a} \\left[\\frac{L_1}{L_2}\\right]^{b} \\left[\\frac{T_1}{T_2}\\right]^{c} $\n\nand read $ a $, $ b $ and $ c $ off the unit. Those exponents were the **dimensions** all along. That is why the method worked.\n\nSo you now have a name for what you were doing, and a way to find $ a $, $ b $, $ c $ for any quantity at all — even one whose unit you cannot remember.',
    }),
    b('heading', 9, {
      text: 'Power 3 — derive a formula you were never taught',
      level: 2,
      objective: 'Derive a relation between quantities by comparing powers of M, L and T.',
    }),
    b('step_solver', 10, {
      title: 'The time period of a pendulum, from nothing',
      problem: 'The time period $ T $ of a simple pendulum may depend on its length $ l $, the mass of the bob $ m $, and the acceleration due to gravity $ g $. Find how.',
      intro: 'This is NCERT Example 1.5. You will end up deriving a formula you already know — which is exactly why it is a good place to learn the method.',
      steps: [
        st('$ T = k\\, l^{x} g^{y} m^{z} $',
          'Assume the dependence is a product of powers, with k a pure number.', {
            why: 'This assumption is the method\'s foundation and also its biggest limitation. If the real relationship involves a sum, or a sine, or a logarithm, this approach cannot find it.',
          }),
        st('$ [\\text{T}] = [\\text{L}]^{x}\\,[\\text{L T}^{-2}]^{y}\\,[\\text{M}]^{z} = [\\text{M}^{z}\\,\\text{L}^{x+y}\\,\\text{T}^{-2y}] $',
          'Put in the dimensions of each and collect the powers.', {
            check: {
              kind: 'mcq',
              prompt: 'The left-hand side is a time. What are its powers of M, L and T?',
              options: ['$ \\text{M}^{1}\\text{L}^{1}\\text{T}^{1} $', '$ \\text{M}^{0}\\text{L}^{0}\\text{T}^{1} $', '$ \\text{M}^{0}\\text{L}^{1}\\text{T}^{0} $', '$ \\text{M}^{1}\\text{L}^{0}\\text{T}^{1} $'],
              answer_index: 1,
              feedback_right: 'Yes — a time has no mass and no length in it at all.',
              feedback_wrong: 'A time period is purely a time: zero powers of M and L, one power of T.',
            },
          }),
        st('$ z = 0, \\qquad x + y = 0, \\qquad -2y = 1 $',
          'Match the power of each base quantity on the two sides. Three equations, three unknowns.', {
            why: 'Look at $ z = 0 $. The mass of the bob does not appear at all — the method has just told us that a heavy bob and a light bob swing at the same rate. That is a real physical prediction, and it is correct.',
          }),
        st('$ y = -\\frac{1}{2}, \\qquad x = \\frac{1}{2}, \\qquad z = 0 $',
          'Solve them.', {
            check: {
              kind: 'fill_blank',
              prompt: 'From $ -2y = 1 $, what is $ y $?',
              blank_answer: '-1/2',
              feedback_right: 'Correct — and then $ x = -y = 1/2 $.',
              feedback_wrong: 'Divide both sides by −2: $ y = -\\frac{1}{2} $.',
            },
          }),
        st('$ T = k\\sqrt{\\frac{l}{g}} $',
          'And that is the pendulum formula — right up to the constant.', {
            why: 'Experiment says $ k = 2\\pi $, giving $ T = 2\\pi\\sqrt{l/g} $. **Dimensions can never give you that $ 2\\pi $.** It is a pure number, and pure numbers are invisible to this method. You get the shape of the law for free, and you pay for the constant with an experiment.',
          }),
      ],
      now_you_try: {
        problem: 'The centripetal force $ F $ on a body moving in a circle may depend on its mass $ m $, its speed $ v $ and the radius $ r $. Derive the relation.',
        answer: '$ F = k\\frac{mv^{2}}{r} $',
        solution: 'Let $ F = k\\,m^{x}v^{y}r^{z} $.\n\n$ [\\text{M L T}^{-2}] = [\\text{M}]^{x}[\\text{L T}^{-1}]^{y}[\\text{L}]^{z} = [\\text{M}^{x}\\text{L}^{y+z}\\text{T}^{-y}] $\n\nMatching: $ x = 1 $; $ -y = -2 $ so $ y = 2 $; and $ y + z = 1 $ so $ z = -1 $.\n\nTherefore $ F = k\\frac{mv^{2}}{r} $, and experiment gives $ k = 1 $.',
      },
    }),
    b('heading', 11, {
      text: 'And three things it cannot do',
      level: 2,
      objective: 'State the limitations of dimensional analysis and recognise when the method will fail.',
    }),
    b('text', 12, {
      markdown: 'Being honest about a method\'s limits is part of knowing it.\n\n1. **It cannot find a dimensionless constant.** The $ 2\\pi $ in the pendulum, the $ \\frac{1}{2} $ in kinetic energy — invisible, every time.\n2. **It cannot handle sums, or trigonometric, logarithmic and exponential terms.** It only works when the relationship is a product of powers.\n3. **It fails when a quantity depends on more than three factors** (in mechanics). Three base dimensions give you only three equations, so a fourth unknown cannot be pinned down.',
    }),
    b('reasoning_prompt', 13, {
      reasoning_type: 'logical',
      prompt: 'The distance travelled in the $ n $th second is often written $ s_n = u + \\frac{a(2n-1)}{2} $. On the left is a distance; on the right, a velocity added to an acceleration. Is this formula dimensionally wrong — and if it is, why is it in every textbook?',
      reveal: 'As printed, it looks inconsistent, and that bothers careful students every year.\n\nThe resolution is that the formula has a **hidden time factor of 1 second**. Written in full it is\n\n$ s_n = u \\times (1\\ \\text{s}) + \\frac{a}{2}(2n-1) \\times (1\\ \\text{s})^{2} $\n\nand now every term is a length. The "1 s" gets dropped in textbooks because it multiplies by one and looks like clutter — but dimensionally it is load-bearing.\n\n**The lesson:** when a formula seems to fail the homogeneity test, check for a hidden quantity of unit size before declaring it wrong. The same thing happens with $ F = ma $ if you set $ m = 1 $ kg and write $ F = a $ — that hidden kilogram is still there, carrying the dimension of mass.',
      difficulty_level: 4,
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A dimensionally correct equation is:',
          ['Always physically correct', 'Never physically correct', 'Not necessarily physically correct', 'Correct only in SI units'], 2,
          'The test can reject a formula with certainty but can never confirm one, because it cannot see pure numbers. $ s = ut + at^{2} $ passes the test and is still wrong.', 2),
        q('In the equation $ y = a\\sin(\\omega t - kx) $, the quantity $ kx $ must be:',
          ['A length', 'A time', 'Dimensionless', 'A velocity'], 2,
          'Everything inside a sine has to be dimensionless, and every term inside the bracket must match. Since $ \\omega t $ is dimensionless, so is $ kx $.', 2),
        q('The method of dimensions **cannot** be used to:',
          ['Check the consistency of an equation', 'Convert a quantity between systems of units', 'Find the value of a dimensionless constant', 'Find how a quantity depends on three others'], 2,
          'A pure number has no dimensions, so the method has nothing to grip. This is why the pendulum derivation gives $ T = k\\sqrt{l/g} $ and stops there.', 1),
      ],
    }),
    b('practice_bank', 15, {
      title: 'You solve it',
      intro: 'Six items. The last two are the shapes JEE reuses most.',
      sections: [
        {
          id: 'p11-ysi',
          title: 'Using dimensional analysis',
          items: [
            mcq('p11-y1', 'The SI unit of energy is $ \\text{kg m}^{2}\\text{s}^{-2} $, that of speed is $ \\text{m s}^{-1} $ and of acceleration $ \\text{m s}^{-2} $. Which formula for kinetic energy can be ruled out on dimensional grounds?',
              ['$ K = \\frac{1}{2}mv^{2} $', '$ K = \\frac{3}{16}mv^{2} $', '$ K = ma $', 'Both $ K = ma $ and $ K = \\frac{1}{2}mv^{2} + ma $'], 3,
              '$ ma $ has the dimensions of force, $ [\\text{M L T}^{-2}] $, not energy — so it is ruled out. And $ \\frac{1}{2}mv^{2} + ma $ adds an energy to a force, which is meaningless, so it goes too.\n\nNote what the test cannot do: it cannot separate $ \\frac{1}{2}mv^{2} $ from $ \\frac{3}{16}mv^{2} $, because the constants are invisible to it. (NCERT Exercise, adapted.)',
              'ncert_exercise', 'NCERT Ch.1'),
            num('p11-y2', 'Check whether $ s = ut + \\frac{1}{2}at^{2} $ is dimensionally correct.',
              'Yes — every term has the dimension of length',
              '$ [s] = [\\text{L}] $\n\n$ [ut] = [\\text{L T}^{-1}][\\text{T}] = [\\text{L}] $\n\n$ \\left[\\frac{1}{2}at^{2}\\right] = [\\text{L T}^{-2}][\\text{T}^{2}] = [\\text{L}] $\n\nAll three agree, so the equation passes. The $ \\frac{1}{2} $ contributes nothing, which is precisely why this test could not have caught its absence.'),
            mcq('p11-y3', 'In the relation $ y = a\\cos(\\omega t - kx) $, the dimensions of $ \\omega $ are:',
              ['$ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{0}] $', '$ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{-1}] $', '$ [\\text{M}^{0}\\text{L}^{1}\\text{T}^{-1}] $', '$ [\\text{M}^{0}\\text{L}^{1}\\text{T}^{0}] $'], 1,
              'The product $ \\omega t $ must be dimensionless, so $ \\omega $ has to cancel a time: $ [\\omega] = [\\text{T}^{-1}] $. It is an angular frequency.'),
            num('p11-y4', 'In the equation $ F = at + bt^{2} $, where $ F $ is a force and $ t $ is time, find the dimensions of $ a $ and $ b $.',
              '$ [a] = [\\text{M L T}^{-3}] $ and $ [b] = [\\text{M L T}^{-4}] $',
              'Every term must have the dimensions of force, $ [\\text{M L T}^{-2}] $.\n\nFor the first term: $ [a][\\text{T}] = [\\text{M L T}^{-2}] $, so $ [a] = [\\text{M L T}^{-3}] $.\n\nFor the second: $ [b][\\text{T}^{2}] = [\\text{M L T}^{-2}] $, so $ [b] = [\\text{M L T}^{-4}] $.'),
            num('p11-y5', 'The frequency $ f $ of a stretched string depends on the tension $ F $, the length $ l $ and the mass per unit length $ \\mu $. Derive the relation.',
              '$ f = \\frac{k}{l}\\sqrt{\\frac{F}{\\mu}} $',
              'Let $ f = k\\,F^{a}l^{b}\\mu^{c} $.\n\n$ [\\text{T}^{-1}] = [\\text{M L T}^{-2}]^{a}[\\text{L}]^{b}[\\text{M L}^{-1}]^{c} = [\\text{M}^{a+c}\\,\\text{L}^{a+b-c}\\,\\text{T}^{-2a}] $\n\nMatching powers: $ a + c = 0 $; $ a + b - c = 0 $; $ -2a = -1 $.\n\nSo $ a = \\frac{1}{2} $, $ c = -\\frac{1}{2} $, $ b = -1 $, giving $ f = \\frac{k}{l}\\sqrt{\\frac{F}{\\mu}} $. Experiment fixes $ k = \\frac{1}{2} $.'),
            mcq('p11-y6', 'A book with printing errors gives four formulae for the displacement of a particle in periodic motion. Which one is **impossible** on dimensional grounds?',
              ['$ y = a\\sin\\frac{2\\pi t}{T} $', '$ y = a\\sin vt $', '$ y = \\frac{a}{\\sqrt{2}}\\left(\\sin\\frac{2\\pi t}{T} + \\cos\\frac{2\\pi t}{T}\\right) $', 'All three are dimensionally acceptable'], 1,
              'In $ y = a\\sin vt $ the argument $ vt $ is a length, and the argument of a sine must be dimensionless. The other two have $ \\frac{2\\pi t}{T} $ inside, where the times cancel properly. (NCERT Exercise 1.13, adapted.)',
              'ncert_exercise', 'NCERT Ch.1'),
          ],
        },
      ],
    }),
  ],
};

// ── p12 · The Patterns Examiners Reuse ───────────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'the-patterns-examiners-reuse',
  title: 'The Patterns Examiners Reuse',
  subtitle: 'The same-dimension families, and the question shapes built on them',
  blocks: [
    b('callout', 0, {
      variant: 'note',
      title: 'Note on scope',
      markdown: 'This page is exam craft rather than new physics — it is JEE and NEET enrichment. Everything on it follows from page 10 and page 11; what is new is recognising the **shapes** the questions come in.',
    }),
    b('text', 1, {
      markdown: 'Almost every dimensions question in a paper is one of five shapes. Once you can name the shape, the work is short.\n\nThe first shape rests on the fact that groups of quite different quantities share one dimensional formula. Sort these before reading the list.',
    }),
    b('classify_exercise', 2, {
      question: 'Which of these have the dimensions of **energy**, $ [\\text{M L}^{2}\\text{T}^{-2}] $?',
      column_label: 'Quantity',
      verdict_label: 'Energy?',
      yes_label: '✓ Same as energy',
      no_label: '✗ Something else',
      rows: [
        { substance: 'Work', is_solution: true, explanation: 'Yes — work is force × distance, the definition of energy transfer.' },
        { substance: 'Torque', is_solution: true, explanation: 'Yes, dimensionally. Torque is also force × distance, so it lands on the same formula — while being a completely different physical idea.' },
        { substance: 'Power', is_solution: false, explanation: 'No — power is energy per unit time, $ [\\text{M L}^{2}\\text{T}^{-3}] $. One extra power of T.' },
        { substance: 'Pressure', is_solution: false, explanation: 'No — pressure is $ [\\text{M L}^{-1}\\text{T}^{-2}] $. But energy *density* (energy per volume) does match pressure.' },
        { substance: 'Heat', is_solution: true, explanation: 'Yes. Heat is energy in transit, so it must have the dimensions of energy.' },
        { substance: 'Angular momentum', is_solution: false, explanation: 'No — $ [\\text{M L}^{2}\\text{T}^{-1}] $. It differs from energy by one power of T, and matches Planck\'s constant instead.' },
        { substance: 'Moment of a force', is_solution: true, explanation: 'Yes — "moment of a force" is just another name for torque.' },
      ],
    }),
    b('table', 3, {
      caption: 'The families that come up again and again. Learn them as groups, not as separate facts.',
      headers: ['Dimensional formula', 'Quantities sharing it'],
      rows: [
        ['$ [\\text{M L}^{2}\\text{T}^{-2}] $', 'work · energy · heat · torque · moment of a force'],
        ['$ [\\text{M L}^{-1}\\text{T}^{-2}] $', "pressure · stress · Young's modulus · bulk modulus · modulus of rigidity · energy density"],
        ['$ [\\text{M L T}^{-1}] $', 'linear momentum · impulse'],
        ['$ [\\text{M L}^{2}\\text{T}^{-1}] $', "angular momentum · Planck's constant"],
        ['$ [\\text{M T}^{-2}] $', 'surface tension · spring constant · force per unit length'],
        ['$ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{-1}] $', 'frequency · angular velocity · velocity gradient · decay constant'],
        ['$ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{0}] $', 'strain · angle · refractive index · relative density · dielectric constant · Poisson\'s ratio'],
        ['$ [\\text{T}] $', '$ \\frac{L}{R} $ · $ CR $ · $ \\sqrt{LC} $ — all three are times'],
      ],
    }),
    b('callout', 4, {
      variant: 'exam_tip',
      title: 'The electrical time constants are worth ten seconds of memory',
      markdown: 'In circuits, three combinations keep appearing and all three have the dimensions of **time**:\n\n$ \\frac{L}{R}, \\qquad CR, \\qquad \\sqrt{LC} $\n\nYou do not need to derive them in the exam — but you should be able to derive them at home once, so you trust them.\n\nA question that asks "which of these has the dimensions of time?" is asking exactly this, and it takes five seconds if you know the trio.',
    }),
    b('heading', 5, {
      text: 'Shape 2 — find the dimensions of a constant buried in a formula',
      level: 2,
      objective: 'Extract the dimensions of an unknown constant using the principle of homogeneity.',
    }),
    b('step_solver', 6, {
      title: 'Digging a constant out',
      problem: 'In the equation $ P = \\frac{a - t^{2}}{bx} $, where $ P $ is pressure, $ t $ is time and $ x $ is distance, find the dimensions of $ \\frac{a}{b} $.',
      intro: 'These look hostile and are actually mechanical. Two rules do all the work: only like terms may be subtracted, and both sides must match.',
      steps: [
        st('$ [a] = [t^{2}] = [\\text{T}^{2}] $',
          'The subtraction $ a - t^{2} $ is only meaningful if both terms have the same dimensions.', {
            check: {
              kind: 'mcq',
              prompt: 'Why must $ a $ have the dimensions of $ t^{2} $?',
              options: ['Because a comes first in the equation', 'Because only quantities with identical dimensions can be subtracted', 'Because a is a constant', 'Because P is a pressure'],
              answer_index: 1,
              feedback_right: 'Yes — the principle of homogeneity applies inside brackets too.',
              feedback_wrong: 'You cannot subtract a time squared from something that is not a time squared. Homogeneity applies to every sum and difference in the equation.',
            },
          }),
        st('$ [P][b][x] = [a] = [\\text{T}^{2}] $',
          'Rearranging the equation to isolate the product on the left.'),
        st('$ [b] = \\frac{[\\text{T}^{2}]}{[P][x]} = \\frac{[\\text{T}^{2}]}{[\\text{M L}^{-1}\\text{T}^{-2}][\\text{L}]} = [\\text{M}^{-1}\\text{T}^{4}] $',
          'Substitute the dimensions of pressure and distance.', {
            why: 'Take it slowly: the denominator is $ \\text{M L}^{-1}\\text{T}^{-2} \\times \\text{L} = \\text{M T}^{-2} $. Dividing $ \\text{T}^{2} $ by that gives $ \\text{M}^{-1}\\text{T}^{4} $.',
          }),
        st('$ \\left[\\frac{a}{b}\\right] = \\frac{[\\text{T}^{2}]}{[\\text{M}^{-1}\\text{T}^{4}]} = [\\text{M T}^{-2}] $',
          'Finally divide.', {
            why: 'A useful sanity check: $ [\\text{M T}^{-2}] $ is the surface-tension family. Landing on a formula you recognise is a good sign you have not slipped.',
          }),
      ],
      now_you_try: {
        problem: 'The velocity of a particle is $ v = at + \\frac{b}{t + c} $. Find the dimensions of $ a $, $ b $ and $ c $.',
        answer: '$ [a] = [\\text{L T}^{-2}] $, $ [b] = [\\text{L}] $, $ [c] = [\\text{T}] $',
        solution: 'Every term must be a velocity, $ [\\text{L T}^{-1}] $.\n\n$ [at] = [\\text{L T}^{-1}] $, so $ [a] = [\\text{L T}^{-2}] $ — an acceleration.\n\nIn $ t + c $, only a time may be added to a time, so $ [c] = [\\text{T}] $.\n\nThen $ \\frac{[b]}{[\\text{T}]} = [\\text{L T}^{-1}] $, giving $ [b] = [\\text{L}] $.',
      },
    }),
    b('text', 7, {
      markdown: '**Shape 3 — a new set of fundamental quantities.** A question replaces mass, length and time with, say, energy, velocity and force, and asks for the dimensions of mass in the new set. Write $ [\\text{M}] = [E]^{x}[v]^{y} $, expand, and match powers exactly as in the pendulum derivation.\n\n**Shape 4 — rule out the wrong formula.** Four candidate formulae, one of which has a dimensional flaw, usually inside a sine or a logarithm.\n\n**Shape 5 — match the columns.** Four quantities against four dimensional formulae. Build each one from its defining equation and the matching is immediate.',
    }),
    b('step_solver', 8, {
      title: 'Shape 3, worked',
      problem: 'If energy $ E $, velocity $ v $ and force $ F $ are taken as the fundamental quantities, what are the dimensions of mass?',
      intro: 'Do not be thrown by the unfamiliar setup. It is the pendulum method with different letters.',
      steps: [
        st('$ [\\text{M}] = [E]^{x}[v]^{y}[F]^{z} $',
          'Assume a product of powers, as always.'),
        st('$ [\\text{M}] = [\\text{M L}^{2}\\text{T}^{-2}]^{x}[\\text{L T}^{-1}]^{y}[\\text{M L T}^{-2}]^{z} $',
          'Write each new fundamental in terms of the old M, L, T.'),
        st('M: $ x + z = 1 $;  L: $ 2x + y + z = 0 $;  T: $ -2x - y - 2z = 0 $',
          'Collect and match the power of each base dimension.', {
            check: {
              kind: 'mcq',
              prompt: 'On the left is mass alone. What power of L does the left-hand side carry?',
              options: ['1', '0', '2', '−1'],
              answer_index: 1,
              feedback_right: 'Yes — mass contains no length, so the L power is 0.',
              feedback_wrong: '$ [\\text{M}] $ means $ \\text{M}^{1}\\text{L}^{0}\\text{T}^{0} $. The L power is zero.',
            },
          }),
        st('$ x = 1,\\ y = -2,\\ z = 0 $',
          'Add the L and T equations together — everything cancels except z, which turns out to be zero.', {
            why: 'Adding the second and third equations: $ (2x + y + z) + (-2x - y - 2z) = -z = 0 $, so $ z = 0 $. Then $ x = 1 $ from the first, and $ y = -2 $ from the second.',
          }),
        st('$ [\\text{M}] = [E\\,v^{-2}] $',
          'Mass is energy divided by velocity squared.', {
            why: 'Sanity check it against something you know: $ E = \\frac{1}{2}mv^{2} $ rearranges to $ m = \\frac{2E}{v^{2}} $. The method has reproduced a formula you have known since Class 9.',
          }),
      ],
      now_you_try: {
        problem: 'If force $ F $, length $ L $ and time $ T $ are taken as fundamental, what is the dimensional formula for mass?',
        answer: '$ [\\text{F L}^{-1}\\text{T}^{2}] $',
        solution: 'From $ F = ma $, mass $ = \\frac{F}{a} $, and acceleration has dimensions $ \\text{L T}^{-2} $.\n\nSo $ [\\text{M}] = \\frac{[F]}{[\\text{L T}^{-2}]} = [\\text{F L}^{-1}\\text{T}^{2}] $.',
      },
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('Which pair has the same dimensions?',
          ['Torque and force', 'Potential energy and force', 'Torque and potential energy', "Planck's constant and linear momentum"], 2,
          'Torque and energy are both force × distance, giving $ [\\text{M L}^{2}\\text{T}^{-2}] $. Force is one power of L smaller, and Planck\'s constant matches angular momentum rather than linear momentum.', 1),
        q('Which of these does **not** have the dimensions of time?',
          ['$ \\frac{L}{R} $', '$ CR $', '$ \\sqrt{LC} $', '$ \\frac{R}{L} $'], 3,
          '$ \\frac{L}{R} $ is a time, so its reciprocal $ \\frac{R}{L} $ has the dimensions of frequency, $ [\\text{T}^{-1}] $.', 2),
        q('Given $ y = a\\cos\\left(\\frac{t}{p} - qx\\right) $, where $ t $ is time and $ x $ is distance, which statement is true?',
          ['$ q $ has the same dimensions as $ x $', '$ q $ has the same dimensions as $ \\frac{1}{x} $', '$ p $ has the same dimensions as $ x $', '$ p $ is dimensionless'], 1,
          'Everything inside the cosine is dimensionless, so $ qx $ must be dimensionless, which forces $ q $ to be $ \\frac{1}{\\text{length}} $. For the same reason $ p $ must be a time.', 3),
        q('If the units of length, velocity and force are all doubled, which of these is also doubled?',
          ['The unit of time', 'The unit of mass', 'The unit of momentum', 'The unit of energy'], 2,
          'Time $ = \\frac{\\text{length}}{\\text{velocity}} $, so doubling both leaves time unchanged. Mass $ = \\frac{\\text{force} \\times \\text{time}}{\\text{velocity}} $, also unchanged. Momentum $ = \\text{force} \\times \\text{time} $, which doubles. Energy $ = \\text{force} \\times \\text{length} $, which goes up four times.', 3),
      ],
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Name the shape first, then solve. Six items.',
      sections: [
        {
          id: 'p12-ysi',
          title: 'The recurring shapes',
          items: [
            mcq('p12-y1', 'Which of these does **not** have the same dimensions as the others?',
              ['Pressure', 'Bulk modulus', 'Energy density', 'Momentum'], 3,
              'Momentum is $ [\\text{M L T}^{-1}] $. The other three all sit at $ [\\text{M L}^{-1}\\text{T}^{-2}] $ — pressure, any elastic modulus, and energy per unit volume.'),
            num('p12-y2', 'In the relation $ P = \\frac{b - x^{2}}{at} $, where $ P $ is power, $ x $ is distance and $ t $ is time, find the dimensions of $ a $ and $ b $.',
              '$ [b] = [\\text{L}^{2}] $ and $ [a] = [\\text{M}^{-1}\\text{L}^{0}\\text{T}^{2}] $',
              'Only like terms may be subtracted, so $ [b] = [x^{2}] = [\\text{L}^{2}] $.\n\nRearranging, $ [P][a][t] = [\\text{L}^{2}] $, so\n\n$ [a] = \\frac{[\\text{L}^{2}]}{[\\text{M L}^{2}\\text{T}^{-3}][\\text{T}]} = \\frac{[\\text{L}^{2}]}{[\\text{M L}^{2}\\text{T}^{-2}]} = [\\text{M}^{-1}\\text{T}^{2}] $.'),
            mcq('p12-y3', 'The dimensional formula $ [\\text{M L}^{0}\\text{T}^{-3}] $ is most closely associated with:',
              ['Power', 'Energy', 'Intensity', 'Velocity gradient'], 2,
              'Intensity is power per unit area: $ \\frac{[\\text{M L}^{2}\\text{T}^{-3}]}{[\\text{L}^{2}]} = [\\text{M L}^{0}\\text{T}^{-3}] $. Power itself still carries $ \\text{L}^{2} $.'),
            num('p12-y4', 'Show that $ \\sqrt{LC} $, where $ L $ is inductance and $ C $ is capacitance, has the dimensions of time.',
              '$ [\\text{T}] $',
              'Use the resonance relation $ f = \\frac{1}{2\\pi\\sqrt{LC}} $, which rearranges to $ \\sqrt{LC} = \\frac{1}{2\\pi f} $.\n\nSince frequency has dimensions $ [\\text{T}^{-1}] $ and $ 2\\pi $ is a pure number, $ \\sqrt{LC} $ must have the dimensions of $ \\frac{1}{[\\text{T}^{-1}]} = [\\text{T}] $.'),
            mcq('p12-y5', 'If Planck\'s constant $ h $, the speed of light $ c $ and the gravitational constant $ G $ are taken as the three fundamental quantities, then $ \\sqrt{\\frac{hc}{G}} $ has the dimensions of:',
              ['Length', 'Time', 'Mass', 'Energy'], 2,
              '$ [h] = [\\text{M L}^{2}\\text{T}^{-1}] $, $ [c] = [\\text{L T}^{-1}] $, $ [G] = [\\text{M}^{-1}\\text{L}^{3}\\text{T}^{-2}] $.\n\n$ \\left[\\frac{hc}{G}\\right] = \\frac{[\\text{M L}^{2}\\text{T}^{-1}][\\text{L T}^{-1}]}{[\\text{M}^{-1}\\text{L}^{3}\\text{T}^{-2}]} = [\\text{M}^{2}] $\n\nTaking the square root gives $ [\\text{M}] $. This combination is called the Planck mass.'),
            mcq('p12-y6', 'The mass $ m $ of the largest stone that a river can move is found to depend on the water\'s velocity $ v $, its density $ \\rho $ and $ g $. Then $ m $ is proportional to:',
              ['$ v^{3} $', '$ v^{4} $', '$ v^{5} $', '$ v^{6} $'], 3,
              'Let $ m = k\\,v^{a}\\rho^{b}g^{c} $.\n\n$ [\\text{M}] = [\\text{L T}^{-1}]^{a}[\\text{M L}^{-3}]^{b}[\\text{L T}^{-2}]^{c} $\n\nMatching M: $ b = 1 $. Matching T: $ -a - 2c = 0 $. Matching L: $ a - 3b + c = 0 $.\n\nFrom these, $ a = 6 $ and $ c = -3 $, so $ m \\propto v^{6} $ — which is why a modest rise in current speed lets a river shift dramatically bigger boulders.'),
          ],
        },
      ],
    }),
  ],
};

// ── p13 · Recap ──────────────────────────────────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'units-and-dimensions-recap',
  title: 'Recap',
  subtitle: 'Retrieve it, do not re-read it',
  blocks: [
    b('text', 0, {
      markdown: 'There is no summary on this page, and that is deliberate. Re-reading a chapter feels productive and does almost nothing for recall; trying to **retrieve** it works far better.\n\nSo: cover the branches below, say what you remember out loud, and only then open them.',
    }),
    b('mind_map', 1, {
      title: 'The whole chapter on one page',
      root_label: 'Units and Dimensions',
      intro: 'Tap a branch only after you have tried to say it yourself.',
      branches: [
        {
          id: 'br-units',
          label: 'Units',
          children: [
            { id: 'l-nu', label: 'The seesaw relation', formula: '$ n_1 u_1 = n_2 u_2 $', summary: 'The quantity is fixed, so a smaller unit always means a bigger number.' },
            { id: 'l-seven', label: 'The seven base units', summary: 'metre, kilogram, second, ampere, kelvin, mole, candela. Everything else is derived from these.' },
            { id: 'l-derived', label: 'Derived units', formula: '$ 1\\ \\text{N} = 1\\ \\text{kg m s}^{-2} $', summary: 'Always unpack a derived unit from its defining equation, never from memory.' },
            { id: 'l-convert', label: 'Converting systems', formula: '$ n_2 = n_1 \\left[\\frac{M_1}{M_2}\\right]^{a}\\left[\\frac{L_1}{L_2}\\right]^{b}\\left[\\frac{T_1}{T_2}\\right]^{c} $', summary: 'The exponents a, b, c are the quantity\'s dimensions.' },
            { id: 'l-oom', label: 'Order of magnitude', summary: 'Write as a × 10^b. If a ≤ 5 the order is 10^b; if a > 5, round the power up.' },
          ],
        },
        {
          id: 'br-sigfig',
          label: 'Significant figures',
          children: [
            { id: 'l-doubtful', label: 'The doubtful digit', summary: 'Every measurement ends in one estimated digit. Significant figures = all certain digits plus that one.' },
            { id: 'l-multiply', label: 'Multiplying and dividing', summary: 'The answer keeps the fewest significant figures of any input.' },
            { id: 'l-add', label: 'Adding and subtracting', summary: 'The answer keeps the fewest decimal places of any input. A different rule — do not mix them up.' },
            { id: 'l-round', label: 'Rounding', summary: 'Above 5 round up, below 5 leave it, exactly 5 round to make the preceding digit even.' },
          ],
        },
        {
          id: 'br-errors',
          label: 'Errors',
          children: [
            { id: 'l-types', label: 'Systematic and random', summary: 'Systematic errors push one way and survive averaging. Random errors scatter both ways and shrink as 1/√N.' },
            { id: 'l-abs', label: 'Stating an error', formula: '$ a = a_{\\text{mean}} \\pm \\Delta a_{\\text{mean}} $', summary: 'Mean, then mean absolute error, then relative error, then percentage error.' },
            { id: 'l-sum', label: 'Sums and differences', formula: '$ \\Delta x = \\Delta a + \\Delta b $', summary: 'Absolute errors add — even when you subtract. Never find a small quantity as the difference of two large ones.' },
            { id: 'l-prod', label: 'Products and quotients', formula: '$ \\frac{\\Delta x}{x} = \\frac{\\Delta a}{a} + \\frac{\\Delta b}{b} $', summary: 'Relative errors add, whether you multiply or divide.' },
            { id: 'l-pow', label: 'Powers', formula: '$ \\frac{\\Delta x}{x} = n\\frac{\\Delta a}{a} + m\\frac{\\Delta b}{b} $', summary: 'The exponent multiplies the error. A square root halves it.' },
          ],
        },
        {
          id: 'br-dims',
          label: 'Dimensions',
          children: [
            { id: 'l-what', label: 'What they are', formula: '$ [F] = [\\text{M L T}^{-2}] $', summary: 'The powers of the base quantities that make up a quantity. Start from the defining equation.' },
            { id: 'l-none', label: 'Dimensionless quantities', formula: '$ [\\text{M}^{0}\\text{L}^{0}\\text{T}^{0}] $', summary: 'Angle, strain, refractive index — any ratio of two like quantities.' },
            { id: 'l-homog', label: 'Homogeneity', summary: 'Every term of a valid equation has the same dimensions. Wrong dimensions prove an equation false; right dimensions prove nothing.' },
            { id: 'l-derive', label: 'Deriving a relation', formula: '$ T = k\\sqrt{\\frac{l}{g}} $', summary: 'Assume a product of powers and match exponents. The pure constant k always escapes you.' },
            { id: 'l-limits', label: 'The three limits', summary: 'No dimensionless constants; no sums, trig, log or exponential terms; no more than three unknowns.' },
            { id: 'l-families', label: 'The same-dimension families', summary: 'Work/energy/torque · pressure/stress/modulus/energy density · momentum/impulse · angular momentum/h · L/R, CR, √(LC) are all times.' },
          ],
        },
      ],
    }),
    b('reasoning_prompt', 2, {
      reasoning_type: 'logical',
      prompt: 'A friend says: "I checked my formula with dimensional analysis and it came out consistent, so I know it is right." What exactly is wrong with that sentence, and what would you say instead?',
      reveal: 'The word **know** is wrong.\n\nDimensional analysis can only ever reject. It is blind to every pure number, so $ s = ut + at^{2} $, $ s = ut + 7at^{2} $ and $ s = ut + \\frac{1}{2}at^{2} $ all pass identically — and only one of them is the real formula.\n\nWhat you can honestly say is: **"My formula is not obviously wrong."** That is genuinely useful — it is a fast filter that catches most algebra slips — but it is not a proof.',
      difficulty_level: 3,
    }),
    b('reasoning_prompt', 3, {
      reasoning_type: 'quantitative',
      prompt: 'You measure a quantity three ways. Method A gives $ (4.0 \\pm 0.4) $ m, method B gives $ (4.00 \\pm 0.04) $ m, and method C gives $ (4.5 \\pm 0.01) $ m. The true value is 4.00 m. Rank the three methods for precision and for accuracy — and explain why the ranking is not the same both times.',
      reveal: '**Precision** is about the size of the uncertainty, so: C (±0.01) is most precise, then B (±0.04), then A (±0.4).\n\n**Accuracy** is about closeness to the true value: B is exactly right, A is right too within its error, and C is out by 0.5 m — fifty times its own stated uncertainty.\n\nC is the interesting one. It is the most precise **and** the least accurate: a beautifully repeatable measurement of the wrong thing, which is exactly the signature of a systematic error such as a zero error.\n\nThat is why a small ± is not by itself evidence that a measurement is good.',
      difficulty_level: 4,
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.7,
      questions: [
        q('A student measures a length as 2.0 cm and another as 2.00 cm with different instruments. Which claim is correct?',
          ['Both measurements are equally precise', 'The second was made with a finer instrument', 'The first is more accurate', 'The two are identical measurements'], 1,
          'The second claims certainty to the hundredth of a centimetre, which needs an instrument of finer least count. Nothing here says anything about accuracy — only about precision.', 2),
        q('The number 0.00708 has how many significant figures?',
          ['2', '3', '4', '5'], 1,
          'Leading zeros are placeholders. The significant digits are 7, 0 and 8 — three of them, the middle zero counting because it sits between non-zero digits.', 1),
        q('The sum of 2.35 m and 1.2 m, to the correct number of digits, is:',
          ['3.55 m', '3.6 m', '3.5 m', '4 m'], 1,
          'Addition, so decimal places decide. The value 1.2 m has one decimal place, so 3.55 rounds to 3.6 m.', 2),
        q('Two quantities are measured with percentage errors 2% and 3%. The maximum percentage error in their product is:',
          ['1%', '2.5%', '5%', '6%'], 2,
          'Relative errors add for a product: 2% + 3% = 5%. Multiplying them (6%) is the common wrong move.', 2),
        q('The percentage error in $ x $, where $ x = \\frac{a^{2}}{b} $ and the errors in $ a $ and $ b $ are 1% and 2%, is:',
          ['0%', '3%', '4%', '5%'], 2,
          'The exponent on $ a $ doubles its error: $ 2(1\\%) + 2\\% = 4\\% $. The $ b $ term adds even though it is in the denominator.', 3),
        q('Which of these has dimensions different from the other three?',
          ['Work', 'Torque', 'Power', 'Heat'], 2,
          'Power is energy per unit time, $ [\\text{M L}^{2}\\text{T}^{-3}] $. Work, torque and heat all share $ [\\text{M L}^{2}\\text{T}^{-2}] $.', 1),
        q('In $ y = A\\sin(\\omega t) $, the dimensions of $ \\omega $ are:',
          ['$ [\\text{L T}^{-1}] $', '$ [\\text{T}] $', '$ [\\text{T}^{-1}] $', 'Dimensionless'], 2,
          'The product $ \\omega t $ must be dimensionless, so $ \\omega $ has to cancel the time: $ [\\text{T}^{-1}] $.', 2),
        q('The period of a pendulum is derived dimensionally as $ T = k\\sqrt{l/g} $. The constant $ k $:',
          ['Is always equal to 1 for any pendulum length', 'Can be found by extending the dimensional method further', 'Cannot be found dimensionally and must come from experiment', 'Has the dimensions of time, like the period itself'], 2,
          'Pure numbers are invisible to dimensional analysis, so no amount of extending the method will produce the $ 2\\pi $. Only an experiment or a full derivation can.', 3),
      ],
    }),
    b('practice_bank', 5, {
      title: 'Retrieve it by doing it',
      intro: 'Recognising a rule is not the same as being able to use it. Six calculations, one from each part of the chapter — do them on paper, closed book.',
      sections: [
        {
          id: 'recap-calc',
          title: 'Closed-book calculations',
          items: [
            num('r-c1', 'A quantity measures 36 in a unit $ u $. If a new unit is chosen that is three times smaller, what number does the same quantity measure?',
              '108',
              'Smaller unit, bigger number: $ n_1u_1 = n_2u_2 $, so $ n_2 = 36 \\times 3 = 108 $.'),
            num('r-c2', 'Convert a density of $ 2.7\\ \\text{g cm}^{-3} $ into $ \\text{kg m}^{-3} $.',
              '$ 2.7 \\times 10^{3}\\ \\text{kg m}^{-3} $',
              'Density has $ a = 1 $, $ b = -3 $. Going from CGS to SI:\n\n$ n_2 = 2.7 \\times (10^{-3})^{1} \\times (10^{-2})^{-3} = 2.7 \\times 10^{-3} \\times 10^{6} = 2.7 \\times 10^{3} $\n\n(That is aluminium, incidentally.)'),
            num('r-c3', 'Give $ \\frac{6.25}{2.5} $ to the correct number of significant figures.',
              '2.5',
              'This is a division, so significant figures decide. The divisor 2.5 has 2 significant figures — the fewest — so the answer keeps 2: $ 2.5 $, not $ 2.50 $.'),
            num('r-c4', 'Two lengths are $ (4.5 \\pm 0.1) $ cm and $ (2.3 \\pm 0.1) $ cm. Give their difference with its error, and the percentage error in that difference.',
              '$ (2.2 \\pm 0.2) $ cm; about 9%',
              'Absolute errors add even for a difference: $ \\Delta = 0.1 + 0.1 = 0.2 $ cm, and $ 4.5 - 2.3 = 2.2 $ cm.\n\nPercentage error $ = \\frac{0.2}{2.2} \\times 100 \\approx 9\\% $ — far worse than the 2% and 4% of the originals. That is the subtraction trap.'),
            num('r-c5', 'A quantity is $ y = \\frac{p^{2}}{\\sqrt{q}} $. The percentage errors in $ p $ and $ q $ are 2% and 6%. Find the percentage error in $ y $.',
              '7%',
              '$ \\frac{\\Delta y}{y} = 2\\frac{\\Delta p}{p} + \\frac{1}{2}\\frac{\\Delta q}{q} = 2(2\\%) + \\frac{1}{2}(6\\%) = 4\\% + 3\\% = 7\\% $.'),
            num('r-c6', 'Without looking anything up, derive the dimensional formula of pressure from its definition.',
              '$ [\\text{M L}^{-1}\\text{T}^{-2}] $',
              'Pressure = force / area.\n\n$ [P] = \\frac{[\\text{M L T}^{-2}]}{[\\text{L}^{2}]} = [\\text{M L}^{1-2}\\text{T}^{-2}] = [\\text{M L}^{-1}\\text{T}^{-2}] $\n\nIf you had to look up the force line, go back to page 10 and build force once more — every other formula in the chapter hangs off it.'),
          ],
        },
      ],
    }),
    b('text', 6, {
      markdown: 'Two practice pages follow. The first is every NCERT exercise from this chapter, worked in full. The second is a JEE and NEET drill bank sorted by skill.\n\nAfter that, Chapter 2 begins — and every number you meet there will be a measurement with units, significant figures and an error attached. That is what this chapter was for.',
    }),
  ],
};

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureChapter(db);
    await upsertPages(db, bookId, [p10, p11, p12, p13]);
  });
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
