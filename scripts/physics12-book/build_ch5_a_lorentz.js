'use strict';
/**
 * Class 12 Physics · Ch.5 "Magnetic Effects of Current" — pages 1–6.
 * The magnetic force on a moving charge, getting directions right, the Lorentz
 * force and velocity selector, circular motion, helical paths, and the cyclotron.
 *
 * Run: node scripts/physics12-book/build_ch5_a_lorentz.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 5;

// ── p1 · A Moving Charge Feels a Force ───────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'a-moving-charge-feels-a-force',
  title: 'A Moving Charge Feels a Force',
  subtitle: 'Perpendicular to everything — and it never does any work',
  glossary: [
    { term: 'magnetic force', definition: 'The force $ \\vec{F} = q(\\vec{v}\\times\\vec{B}) $ on a charge moving through a magnetic field.' },
    { term: 'tesla', definition: 'The SI unit of magnetic field. One tesla gives a force of one newton on one coulomb moving at one metre per second perpendicular to it.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'In 1820 Hans Christian Oersted was lecturing with a compass near a wire. He switched the current on, and the needle turned.\n\nBefore that afternoon, electricity and magnetism were two separate subjects in two separate chapters. Why did one twitching needle end that?',
      hint: 'What could a current possibly have in common with a magnet?',
      reveal: 'Because it proved that an **electric current produces a magnetic field** — so the two subjects were not separate at all. Within a decade Ampère, Faraday and others had built the whole of electromagnetism on that one observation.\n\nAnd it works both ways, which is where this chapter starts. A current makes a magnetic field; and a magnetic field pushes on a current. Two halves of one relationship.\n\nWe take the second half first, because it is what *defines* the magnetic field in the first place.',
    }),
    b('text', 1, {
      markdown: 'A charge $ q $ moving with velocity $ \\vec{v} $ through a magnetic field $ \\vec{B} $ feels a force',
    }),
    b('latex_block', 2, {
      latex: '\\vec{F} = q\\,(\\vec{v}\\times\\vec{B}), \\qquad |\\vec{F}| = qvB\\sin\\theta',
      label: 'Magnetic force on a moving charge',
      note: 'θ is the angle between v and B. This equation is what DEFINES B — it is the magnetic analogue of F = qE.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'That cross product makes this force behave quite unlike any force you have met. Four features, each with real consequences:\n\n**It needs motion.** A stationary charge in a magnetic field feels nothing at all, however strong the field. Contrast $ \\vec{F} = q\\vec{E} $, which acts on a charge whether it moves or not.\n\n**It vanishes along the field.** If $ \\vec{v} $ is parallel or antiparallel to $ \\vec{B} $, then $ \\sin\\theta = 0 $ and there is no force. A charge fired straight along a field line travels in a straight line, unaffected.\n\n**It is maximum across the field.** At $ \\theta = 90^\\circ $, $ F = qvB $ — the largest it can be.\n\n**It is perpendicular to both $ \\vec{v} $ and $ \\vec{B} $.** Not to one of them. To *both*, simultaneously. That three-way perpendicularity is the source of every interesting result in this chapter.',
    }),
    b('text', 4, {
      markdown: 'The unit follows from the definition. One **tesla** is the field that gives a force of one newton on a charge of one coulomb moving at one metre per second at right angles to it:\n\n$ 1\\ \\text{T} = 1\\ \\frac{\\text{N}}{\\text{A·m}} = 10^{4}\\ \\text{gauss} $\n\nThe tesla is a large unit. The Earth\'s field is about $ 5\\times10^{-5} $ T, a fridge magnet a few millitesla, an MRI scanner 1.5 to 3 T, and the strongest steady laboratory magnets around 45 T.',
    }),
    b('heading', 5, {
      text: 'The magnetic force does no work — ever',
      level: 2,
      objective: 'Prove that a magnetic force cannot change a particle\'s speed, and say what it can change.',
    }),
    b('text', 6, {
      markdown: 'This is the single most important consequence, and it follows in one line.\n\nThe work done by a force over a small displacement is $ dW = \\vec{F}\\cdot d\\vec{s} $. But the displacement is along $ \\vec{v} $, and the magnetic force is **perpendicular** to $ \\vec{v} $. A dot product of perpendicular vectors is zero. So\n\n$ dW = 0 \\qquad\\text{always} $\n\nAnd therefore, by the work-energy theorem:',
    }),
    b('latex_block', 7, {
      latex: '\\text{A magnetic force can change a particle\'s DIRECTION, but never its SPEED.}',
      label: 'The consequence worth memorising',
      note: 'Kinetic energy is constant in a purely magnetic field. Only an electric field can speed a charge up.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'So a magnetic field is a perfect steering wheel and a useless accelerator. It can bend a beam, curl it into a circle, wind it into a helix — all without adding a single joule.\n\nThis has a direct engineering consequence you will meet on p6: a **cyclotron** cannot use its magnetic field to accelerate anything. The magnet only bends the particles round; a separate *electric* field does all the speeding up.',
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'logical',
      prompt: 'A charged particle is fired into a region of uniform magnetic field and travels straight through, undeflected. What can you conclude?',
      options: [
        'Its velocity is parallel or antiparallel to the field',
        'The field in that region must be exactly zero',
        'The particle must be carrying no net charge',
        'Its speed must be too large for the field to bend it',
      ],
      reveal: '**Its velocity must be along the field** — parallel or antiparallel.\n\nWith $ F = qvB\\sin\\theta $, the only ways to get zero force are $ q = 0 $, $ v = 0 $, $ B = 0 $, or $ \\sin\\theta = 0 $. The particle is charged and moving in a field, so the angle is the only option left: $ \\theta = 0^\\circ $ or $ 180^\\circ $.\n\n**Note what speed has to do with it: nothing.** Increasing the speed increases the force, so a fast particle is deflected *more*, not less. The "it was going too fast to be deflected" instinct is wrong here — it comes from thinking of the field as needing time to act, which it does not.\n\n**And one honest caution.** In an exam, "travels undeflected" can also mean the magnetic force is being cancelled by an *electric* one. That is the velocity selector, and it arrives two pages from now — so read the question for whether an electric field is present.',
      difficulty_level: 2,
    }),
    b('table', 10, {
      caption: 'The electric force and the magnetic force, compared. Almost every property differs.',
      headers: ['', 'Electric force', 'Magnetic force'],
      rows: [
        ['Formula', '$ \\vec{F} = q\\vec{E} $', '$ \\vec{F} = q(\\vec{v}\\times\\vec{B}) $'],
        ['Acts on a charge at rest?', '**Yes**', '**No** — needs motion'],
        ['Direction', 'along $ \\vec{E} $ (or against, for $ -q $)', 'perpendicular to **both** $ \\vec{v} $ and $ \\vec{B} $'],
        ['Does work?', 'Yes — changes kinetic energy', '**Never** — speed is constant'],
        ['Depends on speed?', 'No', 'Yes, and on direction of travel'],
        ['Typical path in a uniform field', 'parabola (projectile-like)', 'circle or helix'],
      ],
    }),
    b('image', 11, {
      src: '',
      alt: 'A positive charge moving through a magnetic field with the force perpendicular to both the velocity and the field',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Three mutually perpendicular directions. The force is across both the motion and the field.',
      generation_prompt: 'Clean scientific 3D-perspective diagram on a near-black background (#0B0C0F). Three bold arrows meeting at a single point, mutually perpendicular and drawn in slight perspective: a cool-blue arrow pointing right labelled v, a set of dim-orange parallel arrows going into the page depth labelled B, and a bright amber arrow pointing upward labelled F. A small bright sphere sits at the meeting point marked with a plus sign. Faint dashed grey lines suggest the right-angle box between the three directions. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{F} = q(\\vec{v}\\times\\vec{B}) $, magnitude $ qvB\\sin\\theta $. This equation **defines** $ \\vec{B} $.\n- Zero force if the charge is at rest, or moving **along** the field.\n- Maximum force when $ \\vec{v} \\perp \\vec{B} $.\n- The force is perpendicular to **both** $ \\vec{v} $ and $ \\vec{B} $.\n- **It never does work.** Direction changes; speed and kinetic energy do not.\n- $ 1\\ \\text{T} = 10^{4} $ G. Earth $ \\approx 5\\times10^{-5} $ T; MRI $ \\approx 1.5\\text{–}3 $ T.',
    }),
    b('text', 13, {
      markdown: 'Next: the formula is easy. Getting the **direction** right, every time, for either sign of charge, is the skill — and it is worth a page of its own.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A magnetic force can never change a charged particle\'s',
          ['speed', 'direction of motion', 'momentum', 'path'],
          0,
          'The force is always perpendicular to the velocity, so $ \\vec{F}\\cdot d\\vec{s} = 0 $ and no work is done. Momentum and direction certainly change — momentum is a vector, and changing its direction changes it.',
          2),
        q('A stationary charge is placed in a strong uniform magnetic field. The force on it is',
          ['zero', 'maximum', '$ qB $', 'perpendicular to the field'],
          0,
          '$ F = qvB\\sin\\theta $ with $ v = 0 $ gives zero, however strong the field. This is a sharp difference from the electric force $ q\\vec{E} $, which does not care whether the charge moves.',
          1),
        q('The magnetic force on a moving charge is maximum when the angle between $ \\vec{v} $ and $ \\vec{B} $ is',
          ['$ 90^\\circ $', '$ 0^\\circ $', '$ 180^\\circ $', '$ 45^\\circ $'],
          0,
          '$ F \\propto \\sin\\theta $, which peaks at $ 90^\\circ $. At $ 0^\\circ $ and $ 180^\\circ $ — motion along the field — the force vanishes entirely and the particle goes straight.',
          1),
      ],
    }),
  ],
};

// ── p2 · Getting the Direction Right ─────────────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'getting-the-direction-right',
  title: 'Getting the Direction Right',
  subtitle: 'One rule, applied in one order, every time',
  glossary: [
    { term: 'right-hand rule', definition: 'A convention for finding the direction of a cross product: point the fingers along the first vector, curl them towards the second, and the thumb gives the result.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'More marks are lost in this chapter to **direction errors** than to everything else combined.\n\nThe formulas are short and there are only a few of them. But $ \\vec{v}\\times\\vec{B} $ has to be evaluated in three dimensions, on paper, and then flipped if the charge is negative — and there are two independent places to go wrong.\n\nSo this page is one method, applied in one fixed order. Use the same order every single time and the errors stop.',
    }),
    b('heading', 1, {
      text: 'The three-step method',
      level: 2,
      objective: 'Find the direction of the magnetic force reliably, for either sign of charge.',
    }),
    b('text', 2, {
      markdown: '**Step 1 — find $ \\vec{v}\\times\\vec{B} $, ignoring the charge completely.**\n\nUse the right hand. Point your fingers along $ \\vec{v} $ (the **first** vector). Curl them towards $ \\vec{B} $ (the **second**). Your thumb now points along $ \\vec{v}\\times\\vec{B} $.\n\nOrder matters: $ \\vec{v}\\times\\vec{B} = -\\vec{B}\\times\\vec{v} $. Doing it backwards gives exactly the wrong answer, which is a particularly annoying way to lose a mark.\n\n**Step 2 — now look at the sign of the charge.**\n\n- $ q $ positive → $ \\vec{F} $ is along $ \\vec{v}\\times\\vec{B} $.\n- $ q $ negative → $ \\vec{F} $ is **opposite** to $ \\vec{v}\\times\\vec{B} $.\n\n**Step 3 — check it.** The answer must be perpendicular to both $ \\vec{v} $ and $ \\vec{B} $. If it is not, you have made a mistake, and you have caught it for free.\n\nKeeping steps 1 and 2 **separate** is the whole trick. Trying to do the geometry and the sign in one motion is where people go wrong.',
    }),
    b('text', 3, {
      markdown: 'On paper, fields are usually drawn into or out of the page, and the two symbols are worth being fluent with:\n\n- **$ \\odot $ (a dot)** — field **out of** the page, towards you. Think of an arrow\'s tip coming at you.\n- **$ \\otimes $ (a cross)** — field **into** the page, away from you. Think of an arrow\'s tail feathers going away.\n\nWith the field into the page and a positive charge moving to the right, $ \\vec{v}\\times\\vec{B} $ points **upward**. Work that one case out with your own hand now — it is the case almost every diagram reduces to.',
    }),
    b('table', 4, {
      caption: 'The four cases you will meet most, all with $ \\vec{B} $ into the page. Verify each with your own hand.',
      headers: ['Charge', 'Moving', 'Force direction'],
      rows: [
        ['positive', 'right ($ \\rightarrow $)', 'up ($ \\uparrow $)'],
        ['positive', 'up ($ \\uparrow $)', 'left ($ \\leftarrow $)'],
        ['negative', 'right ($ \\rightarrow $)', 'down ($ \\downarrow $)'],
        ['negative', 'up ($ \\uparrow $)', 'right ($ \\rightarrow $)'],
      ],
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'spatial',
      prompt: 'An electron travels **north** through a magnetic field directed **vertically downward**. In which direction is the magnetic force on it?',
      options: ['East', 'West', 'Upward', 'Downward'],
      reveal: '**East.**\n\nDo it in the two separate steps.\n\n*Step 1 — $ \\vec{v}\\times\\vec{B} $, charge ignored.* Fingers point north, curl them downward. The thumb points **west**. (Check: west is perpendicular to both north and down. ✓)\n\n*Step 2 — the charge.* An electron is **negative**, so the force is opposite to $ \\vec{v}\\times\\vec{B} $ — which makes it **east**.\n\nThat sign flip is the step people drop, and it inverts the answer completely. Every one of the three wrong options here is a plausible slip: "west" is forgetting the electron\'s charge, and "up" or "down" come from breaking the perpendicularity rule.\n\n**So always finish with step 3:** is the answer perpendicular to both? East is perpendicular to both north and down. It survives the check.',
      difficulty_level: 3,
    }),
    b('worked_example', 6, {
      label: 'a force in component form',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A proton moves with velocity $ \\vec{v} = (2\\times10^{6}\\,\\hat{i})\\ \\text{m/s} $ in a field $ \\vec{B} = (0.5\\,\\hat{j} - 0.3\\,\\hat{k})\\ \\text{T} $. Find the force on it.',
      solution: 'With components given, use the determinant rather than your hand — it is faster and it cannot be misread.\n\n$ \\vec{v}\\times\\vec{B} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 2\\times10^{6} & 0 & 0 \\\\ 0 & 0.5 & -0.3 \\end{vmatrix} $\n\nExpanding:\n\n$ \\hat{i}\\big[(0)(-0.3) - (0)(0.5)\\big] - \\hat{j}\\big[(2\\times10^{6})(-0.3) - 0\\big] + \\hat{k}\\big[(2\\times10^{6})(0.5) - 0\\big] $\n\n$ = 0\\,\\hat{i} + (6\\times10^{5})\\,\\hat{j} + (10^{6})\\,\\hat{k} $\n\nNow multiply by the charge. A proton is positive, $ q = +1.6\\times10^{-19} $ C:\n\n$ \\vec{F} = (1.6\\times10^{-19})\\left[(6\\times10^{5})\\hat{j} + (10^{6})\\hat{k}\\right] $\n\n$ \\vec{F} = \\left(9.6\\times10^{-14}\\,\\hat{j} + 1.6\\times10^{-13}\\,\\hat{k}\\right)\\ \\text{N} $\n\n**Check it.** The force must be perpendicular to $ \\vec{v} $, so $ \\vec{F}\\cdot\\vec{v} $ must be zero. And it is: $ \\vec{v} $ has only an $ \\hat{i} $ component while $ \\vec{F} $ has none. ✓\n\n**Do that dot-product check every time.** It costs one line and catches a sign error or a mis-expanded determinant immediately.',
    }),
    b('image', 7, {
      src: '',
      alt: 'A grid of cases showing positive and negative charges moving in a field into the page with the resulting force directions',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Field into the page, four cases. Work each one out with your own right hand before trusting the table.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), a two-by-two grid of four square panels separated by thin grey rules, each panel filled with a regular array of small dim-orange cross symbols indicating a field into the page. In each panel a small bright sphere carries either a warm amber plus or a cool blue minus sign, with a blue velocity arrow and a bold amber force arrow at right angles to it: top-left plus moving right with force up, top-right plus moving up with force left, bottom-left minus moving right with force down, bottom-right minus moving up with force right. Muted white minimal labels v and F. Generous dark space.',
    }),
    b('callout', 8, {
      variant: 'warning',
      title: 'The two most common direction errors',
      markdown: '**Computing $ \\vec{B}\\times\\vec{v} $ instead of $ \\vec{v}\\times\\vec{B} $.** The cross product is not commutative — reversing the order reverses the answer. Velocity always comes first.\n\n**Forgetting the sign of the charge.** For an electron the force is *opposite* to $ \\vec{v}\\times\\vec{B} $. Since electrons are the moving charge in most problems, this is not an edge case.\n\nBoth errors invert your answer, and both are caught by working in the fixed order: **geometry first, sign second, perpendicularity check third.**',
    }),
    b('text', 9, {
      markdown: 'Next: combine the magnetic force with an electric one, and you get an instrument that sorts particles by speed.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.6,
      questions: [
        q('A positive charge moves to the right through a field directed into the page. The magnetic force on it is',
          ['upward', 'downward', 'to the left', 'into the page'],
          0,
          'Point your fingers right, curl them into the page, and your thumb points up. The charge is positive, so the force is along $ \\vec{v}\\times\\vec{B} $ — upward. And the answer passes the check: up is perpendicular to both right and into-the-page.',
          2),
        q('An electron and a proton move with the same velocity through the same magnetic field. Their magnetic forces are',
          ['equal in magnitude but opposite in direction', 'equal in both magnitude and direction', 'different in magnitude and direction', 'both zero'],
          0,
          'The magnitudes match because $ |q| $ is the same for both. The directions are opposite because the signs differ. Their *accelerations* differ enormously, though, since the masses differ by a factor of about 1836.',
          2),
        q('The symbol $ \\otimes $ drawn across a region indicates a magnetic field',
          ['into the page', 'out of the page', 'in the plane of the page', 'of zero strength'],
          0,
          'A cross represents the tail feathers of an arrow flying away from you, so the field points into the page. A dot $ \\odot $ is the arrow tip coming towards you — out of the page.',
          1),
      ],
    }),
  ],
};

// ── p3 · The Lorentz Force and the Velocity Selector ─────────────────────────
const p3 = {
  page_number: 3,
  slug: 'the-lorentz-force-and-the-velocity-selector',
  title: 'The Lorentz Force and the Velocity Selector',
  subtitle: 'Two fields at right angles, and only one speed gets through',
  glossary: [
    { term: 'Lorentz force', definition: 'The total electromagnetic force on a charge, $ \\vec{F} = q(\\vec{E} + \\vec{v}\\times\\vec{B}) $.' },
    { term: 'velocity selector', definition: 'Crossed electric and magnetic fields arranged so that only particles of one particular speed pass through undeflected.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You have a beam of ions travelling at all sorts of different speeds, and you need only the ones moving at exactly $ 10^{6} $ m/s.\n\nYou cannot sort them by mass, or by charge — they may be identical particles. **Only their speeds differ.**\n\nHow do you filter by speed alone?',
      hint: 'You have two kinds of force available. Does either one care about speed?',
      reveal: 'Use **both** fields, arranged to fight each other.\n\nThe electric force $ qE $ does **not** depend on speed. The magnetic force $ qvB $ **does** — it grows in proportion to $ v $.\n\nSo set them opposing. Slow particles feel too little magnetic force and are pushed one way by the electric field; fast particles feel too much and are pushed the other way. At exactly one speed the two cancel, and only those particles go straight through a slit.\n\nThat is a **velocity selector**, and it works precisely because one of the two forces is speed-dependent and the other is not.',
    }),
    b('text', 1, {
      markdown: 'When both fields are present, the total force is the sum — and it has a name:',
    }),
    b('latex_block', 2, {
      latex: '\\vec{F} = q\\left(\\vec{E} + \\vec{v}\\times\\vec{B}\\right)',
      label: 'The Lorentz force',
      note: 'The complete electromagnetic force on a charge. Everything in this book so far is a special case of it.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'That single equation contains the whole of the last five chapters. Set $ \\vec{B} = 0 $ and it is $ q\\vec{E} $, the electrostatics of Chapters 1 and 2. Set $ \\vec{E} = 0 $ and it is the magnetic force of p1. Keep both and you get the instruments on this page.\n\nIt is worth pausing on how differently the two terms behave. The electric term is along $ \\vec{E} $ and independent of the motion. The magnetic term is perpendicular to the motion and proportional to its speed. **They have almost nothing in common except the charge they act on** — and that difference is exactly what makes them useful together.',
    }),
    b('heading', 4, {
      text: 'The velocity selector',
      level: 2,
      objective: 'Derive the selected speed and say what happens to particles at other speeds.',
    }),
    b('text', 5, {
      markdown: 'Arrange $ \\vec{E} $ and $ \\vec{B} $ **perpendicular to each other**, and send the beam in perpendicular to both. Then the electric force ($ qE $, along $ \\vec{E} $) and the magnetic force ($ qvB $, perpendicular to $ \\vec{v} $ and $ \\vec{B} $) can be made to act along the same line, in opposite senses.\n\nA particle goes straight through only if they cancel exactly:\n\n$ qE = qvB $',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'spatial',
      prompt: 'Before the arithmetic, the geometry. A beam of **positive** ions travels horizontally due **east**, and in the selector region the magnetic field points **vertically upward**. For the beam to pass straight through, which way must the electric field point?',
      options: [
        'Vertically upward, parallel to the field',
        'Horizontally east, along the beam',
        'Horizontally south, across the beam',
        'Horizontally north, across the beam',
      ],
      correct_index: 3,
      reveal: '**Horizontally north** — across the beam, and opposite to the magnetic force.\n\nDo the geometry first and the sign second, exactly as on p2. Take east as $ \\hat{i} $, north as $ \\hat{j} $ and up as $ \\hat{k} $.\n\n$ \\vec{v} = v\\,\\hat{i}, \\qquad \\vec{B} = B\\,\\hat{k} $\n\n$ \\hat{i}\\times\\hat{k} = -\\hat{j} $\n\nso $ \\vec{v}\\times\\vec{B} = -vB\\,\\hat{j} $, which points **south**. The ion is positive, so the magnetic force on it points south as well.\n\nZero net force needs the electric force to be equal and opposite. So $ q\\vec{E} $ must point **north**, and since $ q $ is positive, $ \\vec{E} $ points north too.\n\n**Two things are worth noticing here.**\n\nWritten as one line, the whole geometry of the device is $ q\\vec{E} = -q\\,\\vec{v}\\times\\vec{B} $: the electric field sits **opposite** to $ \\vec{v}\\times\\vec{B} $. So all three directions — beam, magnetic field, electric field — are mutually perpendicular. That is what "crossed fields" actually means.\n\nAnd the answer does not change if the beam is made of **negative** ions instead. Both forces reverse together, so they still cancel. That is the same charge-independence you are about to see in $ v = E/B $, met here as a picture rather than as an algebraic cancellation.\n\n**Why the others fail.** An electric field along $ \\vec{B} $, or along the beam, gives a force that does not even lie on the line of the magnetic force, so nothing can cancel. A field pointing south doubles the sideways push instead of removing it — that is the sign slip, and it is the same one p2 warned about.',
      difficulty_level: 3,
    }),
    b('latex_block', 7, {
      latex: 'v = \\frac{E}{B}',
      label: 'The speed selected by crossed fields',
      note: 'Independent of the charge AND the mass. Every particle at this speed passes, whatever it is.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'Two things about that result deserve attention.\n\n**The charge cancels.** So does the mass — it never even entered. A velocity selector filters on **speed alone**, and a proton, an electron and a uranium ion at the same speed all pass equally. That is exactly what makes it useful as a *first* stage: it prepares a beam of known speed for a *second* instrument that then separates by mass.\n\n**Other speeds are deflected, and in opposite directions.** A particle slower than $ E/B $ feels too little magnetic force, so the electric force wins and pushes it one way. A faster particle feels too much magnetic force and is pushed the other way. A slit downstream catches only the ones that went straight.',
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'quantitative',
      prompt: 'A velocity selector uses $ E = 3.0\\times10^{5} $ V/m and $ B = 0.15 $ T. Which particles pass through undeflected?',
      options: [
        'All particles with speed $ 2.0\\times10^{6} $ m/s, whatever their charge or mass',
        'Only protons with speed $ 2.0\\times10^{6} $ m/s, since the charge must be $ +e $',
        'All particles with speed $ 4.5\\times10^{4} $ m/s, whatever their charge or mass',
        'Only neutral particles, since a charged one always feels some net force',
      ],
      reveal: '**Any particle at $ 2.0\\times10^{6} $ m/s, regardless of charge or mass.**\n\n$ v = \\frac{E}{B} = \\frac{3.0\\times10^{5}}{0.15} = 2.0\\times10^{6}\\ \\text{m/s} $\n\nThe charge divided out of $ qE = qvB $, and the mass never appeared at all — so the selected speed is a property of the **apparatus**, not of the particle.\n\n**The neutral-particle option is a genuine trap** worth thinking through. A neutral particle feels neither force, so it does go straight through — but it goes straight through at *any* speed, so the selector does nothing useful with it. The instrument only *selects* among charged particles.\n\nAnd note the option $ 4.5\\times10^{4} $, which is $ E \\times B $ rather than $ E/B $. Check the units when in doubt: V/m divided by T gives m/s; multiplied gives nonsense.',
      difficulty_level: 2,
    }),
    b('heading', 10, {
      text: 'Adding a second stage — separating by mass',
      level: 2,
      objective: 'Explain how a velocity selector plus a magnetic field measures mass.',
    }),
    b('text', 11, {
      markdown: 'The selector on its own only tidies the beam. Its real value is what you put after it.\n\nSend the speed-selected beam into a region of pure magnetic field. As the next page shows in detail, each particle then travels in a circle of radius\n\n$ r = \\frac{mv}{qB} $\n\nNow **$ v $ is known** — the selector guaranteed it — so measuring $ r $ gives you $ m/q $ directly. Particles of different mass land at different places on a detector.\n\nThat two-stage arrangement is a **mass spectrometer**, and it is one of the most consequential instruments ever built: it is how isotopes were discovered, how carbon dating is done, how doping tests work, and how the composition of another planet\'s atmosphere is measured from a passing spacecraft.\n\nAnd the logic is worth noticing as a piece of method. **One instrument fixes an unknown so that a second can measure something else.** That is a pattern you have already seen — a potentiometer\'s driver circuit fixing the gradient so a length can measure an emf.',
    }),
    b('worked_example', 12, {
      label: 'weighing an ion with two stages',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A velocity selector uses $ E = 3.0\\times10^{5} $ V/m with $ B_1 = 0.15 $ T. The beam that survives enters an analyser region of uniform field $ B_2 = 0.50 $ T, crossing the boundary at right angles. A singly charged ion is detected back on that same boundary, $ 16.6 $ cm from the entry slit. Find the selected speed and the mass of the ion. Take $ e = 1.6\\times10^{-19} $ C and $ 1\\ \\text{u} = 1.66\\times10^{-27} $ kg.',
      solution: '**Stage one — the speed.** This is the only thing the selector tells you, and it tells you nothing about the particle.\n\n$ v = \\frac{E}{B_1} = \\frac{3.0\\times10^{5}}{0.15} = 2.0\\times10^{6}\\ \\text{m/s} $\n\nUnit check: volts per metre divided by tesla gives metres per second. ✓\n\n**Stage two — read the geometry before writing anything.** In the analyser there is no electric field, so the only force is magnetic and the ion travels a circle of radius $ r = \\frac{mv}{qB_2} $. Entering perpendicular to the boundary, it turns through half a circle and comes back to the boundary a **diameter** away. So the measured $ 16.6 $ cm is $ 2r $, not $ r $:\n\n$ r = \\frac{0.166}{2} = 0.083\\ \\text{m} $\n\n**Now solve for the mass.**\n\n$ r = \\frac{mv}{qB_2} \\quad\\Rightarrow\\quad m = \\frac{q B_2 r}{v} $\n\n$ m = \\frac{(1.6\\times10^{-19})(0.50)(0.083)}{2.0\\times10^{6}} = \\frac{6.64\\times10^{-21}}{2.0\\times10^{6}} $\n\n$ m = 3.32\\times10^{-27}\\ \\text{kg} $\n\nIn atomic mass units:\n\n$ \\frac{3.32\\times10^{-27}}{1.66\\times10^{-27}} = 2.0\\ \\text{u} $\n\nSo it is a **deuteron** — a hydrogen nucleus carrying one extra neutron. The instrument has just identified an isotope from a length measured with a ruler.\n\n**The trap in this question is the factor of two.** Take $ 16.6 $ cm as the radius and you get $ 4 $ u, which reads as a helium nucleus — a wrong answer that looks completely respectable. Always ask whether the detector distance is a radius or a diameter.\n\n**And notice what made the whole thing work.** $ r = \\frac{mv}{qB_2} $ has two unknowns in it, $ m $ and $ v $. One measurement cannot give both. The selector removed $ v $ from the list before the measurement was taken — which is the entire reason for putting it in front.',
    }),
    b('image', 13, {
      src: '',
      alt: 'A velocity selector with crossed fields feeding a magnetic region where particles of different mass follow different radii',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Stage one selects a single speed; stage two then sorts by mass. Neither works without the other.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), wide horizontal composition in thin dim-grey line art. At left, a horizontal channel between two plates — upper amber with plus signs, lower cool blue with minus signs — with small orange downward field arrows and an array of dim-orange cross symbols between them; three particle tracks enter from the left, one curving up, one curving down and hitting the plates, and one passing straight through a narrow slit at the right end of the channel. Beyond the slit, a larger region filled with dim-orange cross symbols in which the surviving beam splits into three smooth circular arcs of visibly different radii, each ending at a small marker on a detector strip. Muted white minimal labels reading selector and spectrometer. Generous dark space.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{F} = q(\\vec{E} + \\vec{v}\\times\\vec{B}) $ — the Lorentz force, containing everything else as a special case.\n- Electric term: **independent of speed**, along $ \\vec{E} $. Magnetic term: **proportional to speed**, perpendicular to $ \\vec{v} $.\n- Geometry: $ \\vec{E} $, $ \\vec{B} $ and the beam are **mutually perpendicular**, with $ q\\vec{E} $ opposite to $ q\\,\\vec{v}\\times\\vec{B} $.\n- Velocity selector: $ v = E/B $, independent of **both** charge and mass.\n- Slower than $ E/B $ → electric force wins. Faster → magnetic force wins. Opposite deflections.\n- Selector + magnetic field = **mass spectrometer**, since $ r = mv/qB $ with $ v $ now known.\n- Unit check: (V/m) ÷ T gives m/s. Never multiply them.',
    }),
    b('text', 15, {
      markdown: 'Next: that circular path, properly derived — and a period that turns out not to depend on the speed at all.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('In a velocity selector with crossed fields $ E $ and $ B $, the particles that pass undeflected have speed',
          ['$ E/B $', '$ B/E $', '$ EB $', '$ \\sqrt{EB} $'],
          0,
          'Setting $ qE = qvB $ gives $ v = E/B $, and the charge cancels. Check the units: volts per metre divided by tesla gives metres per second, which the other options do not.',
          1),
        q('The speed selected by a velocity selector depends on',
          ['only the two field strengths', 'the charge of the particle', 'the mass of the particle', 'both the charge and the mass'],
          0,
          'The charge divides out of $ qE = qvB $ and the mass never enters at all. This is exactly why the instrument is useful as a first stage — it prepares a beam of known speed containing every species present.',
          2),
        q('A particle moving slower than $ E/B $ enters a velocity selector. It is deflected',
          ['by the electric force, which now dominates', 'by the magnetic force, which now dominates', 'not at all', 'along the direction of its motion'],
          0,
          'The magnetic force $ qvB $ shrinks with speed while the electric force $ qE $ does not, so at low speed the electric force wins. A faster particle is deflected the opposite way, which is what makes the slit an effective filter.',
          3),
      ],
    }),
  ],
};

// ── p4 · Circular Motion in a Magnetic Field ─────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'circular-motion-in-a-magnetic-field',
  title: 'Circular Motion in a Magnetic Field',
  subtitle: 'A period that does not care how fast the particle is going',
  glossary: [
    { term: 'cyclotron frequency', definition: 'The frequency $ f = qB/2\\pi m $ at which a charged particle circles in a magnetic field — independent of its speed and radius.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'A slow particle in a magnetic field travels a small circle. A fast one travels a big circle.\n\nAnd they take **exactly the same time** to go round.\n\nThat is not an approximation. The period is completely independent of the speed, and it is the single fact that makes particle accelerators possible.',
    }),
    b('text', 1, {
      markdown: 'Fire a charge into a uniform field **perpendicular** to it. Two things are true at every instant:\n\n- the force has magnitude $ qvB $, constant, because $ v $ never changes (the force does no work);\n- the force is always perpendicular to the velocity.\n\nA constant-magnitude force always perpendicular to the motion is exactly the definition of **uniform circular motion**. So the path is a circle, and the magnetic force is the centripetal force:\n\n$ qvB = \\frac{mv^{2}}{r} $\n\nCancelling one $ v $:',
    }),
    b('latex_block', 2, {
      latex: 'r = \\frac{mv}{qB} = \\frac{p}{qB}',
      label: 'Radius of the circular path',
      note: 'Radius grows with momentum and falls with field strength. Often written with p = mv, which is the more useful form.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'And now the period. Time for one revolution is circumference over speed:\n\n$ T = \\frac{2\\pi r}{v} = \\frac{2\\pi}{v}\\cdot\\frac{mv}{qB} $\n\nThe $ v $ cancels:',
    }),
    b('latex_block', 4, {
      latex: 'T = \\frac{2\\pi m}{qB}, \\qquad f = \\frac{qB}{2\\pi m}, \\qquad \\omega = \\frac{qB}{m}',
      label: 'Cyclotron period and frequency',
      note: 'NO v and NO r. The period depends only on the particle and the field — never on how fast it is going.',
      highlight: true,
    }),
    b('text', 5, {
      markdown: 'That cancellation is the important moment on this page, so it is worth saying in words why it happens.\n\nDouble the speed and two things change together. The particle has to travel a circle of **twice the radius** — twice as far. But it is also going **twice as fast**. The two exactly compensate, and the time comes out the same.\n\nThe consequence is enormous: you can accelerate a particle round and round in the same magnetic field, and it keeps arriving back at the same place at the same intervals, however much energy you have given it. That is a cyclotron, two pages from now.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'A proton and an alpha particle (charge $ 2e $, mass $ 4m_p $) enter the same magnetic field with the same **speed**. Compare their radii and their periods.',
      options: [
        'The alpha has twice the radius and twice the period',
        'The alpha has twice the radius and the same period',
        'The alpha has the same radius and twice the period',
        'The alpha has four times the radius and twice the period',
      ],
      reveal: '**Twice the radius and twice the period.**\n\n*Radius:* $ r = \\frac{mv}{qB} \\propto \\frac{m}{q} $. For the alpha, $ \\frac{4m_p}{2e} = 2\\frac{m_p}{e} $ — twice as large.\n\n*Period:* $ T = \\frac{2\\pi m}{qB} \\propto \\frac{m}{q} $ as well — also twice as large.\n\nSo **both** scale with the same ratio $ m/q $, and that is the quantity worth tracking. For an alpha particle it is twice the proton value, which is why alphas and protons behave so similarly in magnetic instruments while an electron (with $ m/q $ nearly two thousand times smaller) behaves completely differently.\n\n**Careful with the wording, though.** This question fixed the **speed**. Had it fixed the **kinetic energy** instead, the radius comparison would change entirely — see the next section.',
      difficulty_level: 3,
    }),
    b('heading', 7, {
      text: 'When the energy is fixed instead of the speed',
      level: 2,
      objective: 'Express the radius in terms of kinetic energy and accelerating voltage.',
    }),
    b('text', 8, {
      markdown: 'Real particles usually arrive having been accelerated through a potential difference, so what you know is their **energy**, not their speed. Two rewrites of the radius formula handle that.\n\nFrom $ K = \\tfrac{1}{2}mv^{2} $ we get $ mv = \\sqrt{2mK} $, so\n\n$ r = \\frac{\\sqrt{2mK}}{qB} $\n\nAnd if the particle was accelerated from rest through a voltage $ V $, then $ K = qV $, giving',
    }),
    b('latex_block', 9, {
      latex: 'r = \\frac{\\sqrt{2mK}}{qB} = \\frac{1}{B}\\sqrt{\\frac{2mV}{q}}',
      label: 'Radius in terms of energy, and of accelerating voltage',
      note: 'Note r ∝ √m for equal energy — but r ∝ m for equal speed. Read which one the question fixed.',
      highlight: true,
    }),
    b('text', 10, {
      markdown: 'Compare the two dependences carefully, because exam questions are built on exactly this distinction:\n\n- **Equal speed:** $ r \\propto \\frac{m}{q} $\n- **Equal kinetic energy:** $ r \\propto \\frac{\\sqrt{m}}{q} $\n- **Equal accelerating voltage:** $ r \\propto \\frac{\\sqrt{m}}{\\sqrt{q}} $\n\nThree different answers to "which particle curves more", depending on one word in the question. **Underline that word before you calculate.**',
    }),
    b('worked_example', 11, {
      label: 'an electron in the Earth-scale field of a laboratory magnet',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An electron is accelerated from rest through $ 100 $ V and then enters a uniform magnetic field of $ 2.0 $ mT perpendicular to its velocity. Find its speed, the radius of its path, and its period. Take $ m_e = 9.1\\times10^{-31} $ kg.',
      solution: '**Speed, from the accelerating voltage.**\n\n$ eV = \\tfrac{1}{2}mv^{2} \\quad\\Rightarrow\\quad v = \\sqrt{\\frac{2eV}{m}} = \\sqrt{\\frac{2(1.6\\times10^{-19})(100)}{9.1\\times10^{-31}}} $\n\n$ = \\sqrt{3.52\\times10^{13}} = 5.9\\times10^{6}\\ \\text{m/s} $\n\n**Radius.**\n\n$ r = \\frac{mv}{qB} = \\frac{(9.1\\times10^{-31})(5.9\\times10^{6})}{(1.6\\times10^{-19})(2.0\\times10^{-3})} $\n\n$ = \\frac{5.37\\times10^{-24}}{3.2\\times10^{-22}} = 1.7\\times10^{-2}\\ \\text{m} $\n\nAbout $ 1.7 $ cm — a circle you could draw on paper, from a field of only two millitesla. Electrons are easy to bend because their mass is so small.\n\n**Period.**\n\n$ T = \\frac{2\\pi m}{qB} = \\frac{2\\pi(9.1\\times10^{-31})}{(1.6\\times10^{-19})(2.0\\times10^{-3})} = \\frac{5.72\\times10^{-30}}{3.2\\times10^{-22}} $\n\n$ T = 1.8\\times10^{-8}\\ \\text{s} $\n\nAbout $ 18 $ nanoseconds, or $ 56 $ MHz.\n\n**Check the period a second way.** $ T = 2\\pi r/v = 2\\pi(1.7\\times10^{-2})/(5.9\\times10^{6}) = 1.8\\times10^{-8} $ s ✓ — and notice that this route needed the speed while the formula did not. That is the speed-independence, confirmed numerically.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Two charged particles of different speeds circling in the same magnetic field, showing different radii but the same period',
      width: 'two_third',
      aspect_ratio: '1:1',
      caption: 'Different speeds, different radii — identical periods. That coincidence is what makes accelerators work.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), a square field region filled with a regular array of small dim-orange cross symbols indicating a field into the page. Two concentric-ish circular orbits drawn in amber, one small and one about twice the radius, each with a small bright sphere on it and a short tangential velocity arrow — the arrow on the larger orbit drawn about twice as long. A curved arrow on each orbit shows the sense of rotation, the same for both. A muted white note reads same period. Generous dark space, orange accent, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Perpendicular entry → **circular** path, with $ qvB = mv^{2}/r $.\n- $ r = \\frac{mv}{qB} = \\frac{p}{qB} $ — radius grows with momentum.\n- $ T = \\frac{2\\pi m}{qB} $, $ f = \\frac{qB}{2\\pi m} $ — **no $ v $, no $ r $**. Faster particles travel further at proportionally higher speed.\n- Equal speed → $ r \\propto m/q $. Equal energy → $ r \\propto \\sqrt{m}/q $. Equal voltage → $ r \\propto \\sqrt{m/q} $.\n- Speed and kinetic energy are **constant** throughout — the force does no work.',
    }),
    b('text', 14, {
      markdown: 'Next: what if the particle is not moving exactly across the field? The circle becomes a spiral, and there is a neat way to see why.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The period of a charged particle circling in a uniform magnetic field',
          ['is independent of its speed', 'increases with its speed', 'decreases with its speed', 'depends on the radius of the path'],
          0,
          'A faster particle travels a proportionally larger circle, so the extra distance exactly cancels the extra speed: $ T = 2\\pi m/qB $ contains neither $ v $ nor $ r $. This is precisely what allows a cyclotron to work at a fixed driving frequency.',
          2),
        q('Two protons enter the same magnetic field, one with twice the speed of the other. The ratio of their path radii is',
          ['$ 2 : 1 $', '$ 1 : 2 $', '$ 4 : 1 $', '$ 1 : 1 $'],
          0,
          '$ r = mv/qB $, so with the same $ m $, $ q $ and $ B $ the radius is proportional to the speed. Their periods, however, are identical.',
          1),
        q('A particle of charge $ q $ and mass $ m $ is accelerated through a voltage $ V $ and then bent by a field $ B $. Its radius is proportional to',
          ['$ \\sqrt{m/q} $', '$ m/q $', '$ \\sqrt{mq} $', '$ q/m $'],
          0,
          'With $ K = qV $, we get $ r = \\sqrt{2mK}/qB = \\sqrt{2mV/q}/B $, so $ r \\propto \\sqrt{m/q} $. Note this differs from the equal-**speed** case, where $ r \\propto m/q $ — which quantity the question fixes changes the answer.',
          3),
      ],
    }),
  ],
};

// ── p5 · Helical Paths ───────────────────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'helical-paths',
  title: 'Helical Paths',
  subtitle: 'Split the velocity in two, and the spiral explains itself',
  glossary: [
    { term: 'pitch', definition: 'The distance a helical path advances along the field direction during one complete revolution.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Fire a charge **across** a magnetic field and it circles. Fire it **along** the field and it goes straight.\n\nNow fire it in at $ 45^\\circ $. What happens?',
      hint: 'Resolve the velocity into the two cases you already understand.',
      reveal: 'It does **both at once** — it spirals. A **helix**, like the thread of a screw.\n\nAnd you can see exactly why by splitting the velocity into two components:\n\n- The part **perpendicular** to $ \\vec{B} $ feels the magnetic force and circles, exactly as on the last page.\n- The part **parallel** to $ \\vec{B} $ feels no force at all, and continues unchanged for ever.\n\nCircular motion in one plane, plus steady drift at right angles to it, is a helix. There is no new physics on this page — only a resolution into two cases you have already solved.',
    }),
    b('text', 1, {
      markdown: 'So resolve the velocity at the moment of entry, with $ \\theta $ the angle to the field:\n\n$ v_{\\perp} = v\\sin\\theta \\qquad\\text{(does the circling)} $\n\n$ v_{\\parallel} = v\\cos\\theta \\qquad\\text{(does the drifting)} $\n\nEach component then behaves independently, and every property of the helix follows.\n\n**The radius** is set by the perpendicular part only — the parallel part contributes nothing to the force:',
    }),
    b('latex_block', 2, {
      latex: 'r = \\frac{m\\,v_{\\perp}}{qB} = \\frac{m\\,v\\sin\\theta}{qB}',
      label: 'Radius of the helix',
      note: 'Only the PERPENDICULAR component of velocity enters. This is the commonest slip on this page.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: '**The period** is exactly what it was before:\n\n$ T = \\frac{2\\pi m}{qB} $\n\nUnchanged — because the derivation never used $ v $ at all, so it certainly does not care which part of $ v $ is doing the circling.\n\n**The pitch** is the new quantity: how far the particle advances along the field in one full revolution. Since the parallel motion is at a constant $ v_{\\parallel} $ for a time $ T $:',
    }),
    b('latex_block', 4, {
      latex: 'p = v_{\\parallel}\\,T = v\\cos\\theta \\cdot \\frac{2\\pi m}{qB}',
      label: 'Pitch of the helix',
      note: 'Uses the PARALLEL component. Radius uses the perpendicular one. Keep the two straight.',
      highlight: true,
    }),
    b('table', 5, {
      caption: 'One field, three paths — decided entirely by the entry angle.',
      headers: ['Entry angle $ \\theta $', '$ v_{\\perp} $', '$ v_{\\parallel} $', 'Path'],
      rows: [
        ['$ 0^\\circ $ or $ 180^\\circ $ (along $ \\vec{B} $)', 'zero', '$ v $', '**Straight line**, unaffected'],
        ['$ 90^\\circ $ (across $ \\vec{B} $)', '$ v $', 'zero', '**Circle**, pitch zero'],
        ['anything in between', '$ v\\sin\\theta $', '$ v\\cos\\theta $', '**Helix**, pitch $ v\\cos\\theta\\cdot T $'],
      ],
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'quantitative',
      prompt: 'A charged particle enters a uniform magnetic field at $ 30^\\circ $ to it. Compared with a particle of the same speed entering at $ 90^\\circ $, is the helix radius larger or smaller — and what happens to the period?',
      options: [
        'Radius is half; period is unchanged',
        'Radius is half; period is doubled',
        'Radius is doubled; period is unchanged',
        'Radius and period are both halved',
      ],
      reveal: '**Radius is half; period is unchanged.**\n\n*Radius:* only $ v_{\\perp} = v\\sin\\theta $ matters. At $ 30^\\circ $, $ \\sin 30^\\circ = 0.5 $, so the perpendicular component — and therefore the radius — is **half** what it was at $ 90^\\circ $ where $ \\sin 90^\\circ = 1 $.\n\n*Period:* $ T = 2\\pi m/qB $ contains no velocity at all, so it is **completely unaffected** by the entry angle. Same field, same particle, same period — always.\n\nThe particle at $ 30^\\circ $ therefore goes round a tighter circle in the same time, while simultaneously drifting along the field at $ v\\cos 30^\\circ $. It travels a long, thin, stretched-out helix.\n\n**The habit to build:** at the start of any helix question, write down $ v\\sin\\theta $ and $ v\\cos\\theta $ explicitly and label which is which. Radius uses one; pitch uses the other. Confusing them is essentially the only way to get these wrong.',
      difficulty_level: 3,
    }),
    b('worked_example', 7, {
      label: 'the geometry of a helix',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A proton enters a uniform field of $ 0.10 $ T at $ 60^\\circ $ to the field direction, with speed $ 4.0\\times10^{6} $ m/s. Find the radius, the period and the pitch of its helical path. Take $ m_p = 1.67\\times10^{-27} $ kg.',
      solution: '**Resolve the velocity first — always.**\n\n$ v_{\\perp} = v\\sin 60^\\circ = (4.0\\times10^{6})(0.866) = 3.46\\times10^{6}\\ \\text{m/s} $\n\n$ v_{\\parallel} = v\\cos 60^\\circ = (4.0\\times10^{6})(0.5) = 2.0\\times10^{6}\\ \\text{m/s} $\n\n**Radius — uses $ v_{\\perp} $:**\n\n$ r = \\frac{mv_{\\perp}}{qB} = \\frac{(1.67\\times10^{-27})(3.46\\times10^{6})}{(1.6\\times10^{-19})(0.10)} = \\frac{5.78\\times10^{-21}}{1.6\\times10^{-20}} $\n\n$ r = 0.36\\ \\text{m} $\n\n**Period — uses neither component:**\n\n$ T = \\frac{2\\pi m}{qB} = \\frac{2\\pi(1.67\\times10^{-27})}{1.6\\times10^{-20}} = 6.6\\times10^{-7}\\ \\text{s} $\n\n**Pitch — uses $ v_{\\parallel} $:**\n\n$ p = v_{\\parallel}T = (2.0\\times10^{6})(6.6\\times10^{-7}) = 1.3\\ \\text{m} $\n\n**Picture the result.** A helix of radius $ 36 $ cm advancing $ 1.3 $ m per turn — so it is a long, stretched spiral rather than a tight coil. A shallower entry angle would stretch it further; a steeper one would tighten it towards a circle.\n\n**And the tally of which formula used what:** radius → perpendicular, pitch → parallel, period → neither. If you wrote that down before substituting, this problem had no way to go wrong.',
    }),
    b('callout', 8, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'The **aurora** is a helix, several thousand kilometres long.\n\nCharged particles from the Sun arrive at the Earth and meet its magnetic field. Almost all of them are simply turned aside — which is the point, since the bare stream would strip the atmosphere away. But near the poles the field lines dive into the ground, and particles moving nearly along a line spiral down it in a long, thin helix, exactly as on this page.\n\nWhen they finally reach the upper atmosphere they collide with oxygen and nitrogen and make them glow: green from oxygen at about 100 km, red higher up, blue and violet from nitrogen.\n\nSo the aurora appears in rings around the magnetic poles rather than everywhere, and that geometry is a direct consequence of $ v_{\\parallel} $ being untouched while $ v_{\\perp} $ circles.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F). At left, a globe outlined in dim grey with smooth dim-orange dipole field lines converging steeply into the polar region. A single bright cool-blue particle track drawn as a long stretched helix spiralling tightly along one converging field line down towards the pole, with the coils getting tighter as it descends. Where it meets the upper atmosphere, a soft green and faint violet glow arc, drawn as a thin curtain following a ring around the pole. Muted white minimal labels, generous dark space.',
    }),
    b('image', 9, {
      src: '',
      alt: 'A helical particle path in a magnetic field with the radius, pitch and the two velocity components marked',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Circling from the perpendicular component, drifting from the parallel one. Together, a helix.',
      generation_prompt: 'Clean scientific 3D-perspective diagram on a near-black background (#0B0C0F). A smooth amber helix drawn winding around a horizontal dashed grey axis, with three or four complete turns, and dim-orange straight field arrows running along the axis direction. At the entry point on the left, a bright cool-blue velocity arrow angled to the axis, with its two dashed grey components drawn and labelled v perpendicular and v parallel, and a small arc marking the angle theta. A dashed grey vertical line marks the helix radius labelled r, and a dashed horizontal span between two equivalent points on successive turns is labelled pitch. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Resolve at entry: $ v_{\\perp} = v\\sin\\theta $ circles, $ v_{\\parallel} = v\\cos\\theta $ drifts.\n- **Radius** $ r = \\frac{mv_{\\perp}}{qB} $ — perpendicular component only.\n- **Period** $ T = \\frac{2\\pi m}{qB} $ — neither component; unchanged by the entry angle.\n- **Pitch** $ p = v_{\\parallel}T $ — parallel component only.\n- $ \\theta = 90^\\circ $ → circle (pitch zero). $ \\theta = 0^\\circ $ → straight line. In between → helix.\n- Write down $ v\\sin\\theta $ and $ v\\cos\\theta $ before substituting anything.',
    }),
    b('text', 11, {
      markdown: 'Next: take the speed-independent period and build a machine out of it.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('A charged particle enters a uniform magnetic field at an angle $ \\theta $ to it. The radius of its helical path depends on',
          ['$ v\\sin\\theta $', '$ v\\cos\\theta $', '$ v $ alone', 'neither component'],
          0,
          'Only the component perpendicular to the field produces a magnetic force, so only $ v\\sin\\theta $ sets the radius. The parallel component $ v\\cos\\theta $ determines the pitch instead.',
          2),
        q('The pitch of a helical path is the distance advanced',
          ['along the field in one complete revolution', 'perpendicular to the field in one revolution', 'in one second', 'between two successive collisions'],
          0,
          'It is $ v_{\\parallel}T $ — the steady drift along the field multiplied by the time for one turn. For a particle entering perpendicular to the field the pitch is zero, and the helix collapses to a circle.',
          1),
        q('A particle enters a magnetic field exactly along the field direction. Its path is',
          ['a straight line', 'a circle', 'a helix of small pitch', 'a parabola'],
          0,
          'With $ \\theta = 0 $ there is no perpendicular component, so no force at all: $ F = qvB\\sin 0 = 0 $. The particle carries on undeflected.',
          1),
      ],
    }),
  ],
};

// ── p6 · The Cyclotron ───────────────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'the-cyclotron',
  title: 'The Cyclotron',
  subtitle: 'Building a machine out of a period that does not change',
  glossary: [
    { term: 'cyclotron', definition: 'A particle accelerator in which a magnetic field bends charges into circles while an alternating electric field speeds them up twice per revolution.' },
    { term: 'dees', definition: 'The two hollow semicircular electrodes of a cyclotron, between which the accelerating voltage is applied.' },
    { term: 'resonance condition', definition: 'The requirement that the applied alternating voltage reverse at exactly the cyclotron frequency.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'To give a proton a million electron volts of energy with a single accelerating gap, you would need a million volts across it — which would arc over and destroy itself.\n\nErnest Lawrence\'s idea in 1932 was to use a **small** voltage, a few thousand volts, and simply push the same proton through it **hundreds of times**.\n\nBut how do you get a proton to come back to the same gap, over and over, and arrive each time exactly when the voltage is pushing the right way?',
      hint: 'What property of circular motion in a magnetic field was surprising on p4?',
      reveal: 'You use the fact that the **period does not depend on the speed.**\n\nBend the proton into a circle with a magnetic field. It returns to the gap after a time $ T = 2\\pi m/qB $. Give it a push, so it goes faster and now travels a **bigger** circle — and it comes back after **exactly the same time**.\n\nSo a voltage alternating at one fixed frequency stays in step with the particle for its entire journey, however much energy it gains. Lawrence\'s first cyclotron was 11 cm across and fitted on a bench.\n\nWithout the speed-independence of $ T $, none of this would work — you would need a driving frequency that changed as the particle sped up.',
    }),
    b('text', 1, {
      markdown: 'The construction is two hollow semicircular metal boxes — the **dees** — separated by a narrow gap, sitting between the poles of a large electromagnet, with the whole thing evacuated. An alternating voltage is applied across the gap.\n\nThe motion then alternates between two phases, each doing exactly one job:\n\n**Inside a dee.** A metal box is an equipotential, so there is **no electric field inside it** (Chapter 1, and Chapter 2\'s shielding page). The particle feels only the magnetic field, and travels a perfect semicircle at constant speed.\n\n**Crossing the gap.** Here there is no magnetic shielding but there *is* an electric field, and the particle is accelerated. It gains energy $ qV $ and emerges faster.\n\nThen it enters the other dee, travels a **larger** semicircle at the new speed, and arrives back at the gap — where the voltage has meanwhile reversed, so it is accelerated again.',
    }),
    b('text', 2, {
      markdown: 'For that to work, the voltage must reverse exactly twice per revolution, which means the applied frequency must equal the cyclotron frequency:',
    }),
    b('latex_block', 3, {
      latex: 'f = \\frac{qB}{2\\pi m}',
      label: 'Cyclotron resonance condition',
      note: 'Set the oscillator to this and it stays in step for the whole spiral — because the period never changes.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'The particle spirals outward, gaining $ qV $ at every gap crossing — so $ 2qV $ per revolution — until it reaches the outer edge of the dees, at radius $ R $, and is extracted.\n\nIts final energy follows from the radius formula. At $ r = R $, $ v = \\frac{qBR}{m} $, so',
    }),
    b('latex_block', 5, {
      latex: 'K_{\\max} = \\frac{1}{2}mv^{2} = \\frac{q^{2}B^{2}R^{2}}{2m}',
      label: 'Maximum energy from a cyclotron',
      note: 'Set entirely by the MAGNET — its field strength and its radius. The accelerating voltage does not appear.',
      highlight: true,
    }),
    b('text', 6, {
      markdown: 'That result is worth dwelling on, because it is counter-intuitive and it is what makes cyclotrons expensive.\n\n**The accelerating voltage is not in the formula.** A bigger voltage does not give a higher final energy — it just gets the particle there in fewer turns. The final energy is fixed by $ B $ and $ R $ alone: by how strong your magnet is and how big it is.\n\nWhich is why every advance in accelerator energy has been an advance in **magnets**. And why the machines got so large: with $ K \\propto R^{2} $, doubling the energy means a magnet $ \\sqrt{2} $ times wider in every direction.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'logical',
      prompt: 'To double the maximum energy a cyclotron can deliver, which change would work?',
      options: [
        'Increase the magnetic field by a factor of $ \\sqrt{2} $',
        'Double the accelerating voltage across the dees',
        'Double the frequency of the oscillator',
        'Double the number of turns the particle makes',
      ],
      reveal: '**Increase the magnetic field by $ \\sqrt{2} $.**\n\n$ K_{\\max} = \\frac{q^{2}B^{2}R^{2}}{2m} \\propto B^{2} $, so multiplying $ B $ by $ \\sqrt{2} $ doubles the energy. Multiplying $ R $ by $ \\sqrt{2} $ would work equally well, and cost far more.\n\n**Why the others fail:**\n\n*Doubling the voltage* gets the particle to the same final energy in half as many turns. Faster, but no more energetic — the voltage does not appear in $ K_{\\max} $ at all.\n\n*Doubling the frequency* breaks the resonance condition. The voltage would no longer reverse when the particle arrives, so it would be decelerated as often as accelerated, and the machine would simply stop working.\n\n*Doubling the number of turns* is not something you can choose. The number of turns is whatever it takes to spiral out to radius $ R $ — set by $ B $, $ R $ and $ V $, not by you.',
      difficulty_level: 3,
    }),
    b('heading', 8, {
      text: 'Why a cyclotron has a ceiling',
      level: 2,
      objective: 'State the limitations of a cyclotron and say which particles it cannot accelerate.',
    }),
    b('text', 9, {
      markdown: 'The whole design rests on the period being constant — and eventually that fails.\n\n**Relativity.** As the particle approaches the speed of light, its effective mass increases. Since $ T = 2\\pi m/qB $, the period **grows**, the particle starts arriving late at the gap, and it drifts out of step with the oscillator. This puts a hard ceiling on a cyclotron at around $ 25 $ MeV for protons. (The fix is a **synchrocyclotron**, which slowly reduces the driving frequency to match — but that is a different machine.)\n\n**It cannot accelerate electrons usefully.** An electron becomes relativistic at only a few hundred keV, because its mass is so small. It falls out of step almost immediately.\n\n**It cannot accelerate neutral particles.** Obvious once stated: no charge, no magnetic bending and no electric acceleration.\n\nSo a cyclotron is a machine for heavy charged particles at moderate energy — which is precisely what medicine needs, and why hospitals have them.',
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Cyclotrons are not museum pieces. There are several hundred in hospitals worldwide, and most large cities have one.\n\n**Making medical isotopes.** A PET scan needs a radioactive tracer — commonly fluorine-18, with a half-life of only 110 minutes. You cannot ship that; it would decay on the way. So a cyclotron on the hospital site bombards a target, makes the isotope, and it is in a patient within the hour.\n\n**Proton beam therapy.** A proton beam of carefully chosen energy stops *inside* the body at a depth you can select, depositing most of its energy right at the tumour and very little on the way in or beyond. For a tumour next to the spinal cord or behind the eye, that precision is the difference between treatment and no treatment.\n\nBoth applications need exactly what a cyclotron is good at: heavy charged particles, energies of tens of MeV, and a machine that fits in a basement.',
      image_prompt: 'Clean scientific illustration on a near-black background (#0B0C0F), two vignettes side by side in thin dim-grey line art. Left: a top view of a cyclotron — two semicircular dee electrodes in warm amber with a narrow gap between them, an outward-spiralling amber particle track inside, and a small extraction channel leading out to a target block; dim-orange field symbols dot the background. Right: a simplified human torso outline in dim grey with a narrow amber proton beam entering and a bright orange deposition spot glowing at a depth inside, with a small graph inset showing dose rising to a sharp peak then falling abruptly to zero. Muted white minimal labels, generous dark space.',
    }),
    b('worked_example', 11, {
      label: 'the numbers for a hospital cyclotron',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A cyclotron accelerating protons has dees of radius $ 0.50 $ m in a magnetic field of $ 1.5 $ T. Find the oscillator frequency required, and the maximum kinetic energy of the protons in MeV. Take $ m_p = 1.67\\times10^{-27} $ kg.',
      solution: '**Oscillator frequency — the resonance condition.**\n\n$ f = \\frac{qB}{2\\pi m} = \\frac{(1.6\\times10^{-19})(1.5)}{2\\pi(1.67\\times10^{-27})} = \\frac{2.4\\times10^{-19}}{1.05\\times10^{-26}} $\n\n$ f = 2.3\\times10^{7}\\ \\text{Hz} = 23\\ \\text{MHz} $\n\nA radio frequency, comfortably within reach of ordinary electronics — which is a large part of why the design is practical.\n\n**Maximum energy.**\n\n$ K_{\\max} = \\frac{q^{2}B^{2}R^{2}}{2m} = \\frac{(1.6\\times10^{-19})^{2}(1.5)^{2}(0.50)^{2}}{2(1.67\\times10^{-27})} $\n\nNumerator: $ (2.56\\times10^{-38})(2.25)(0.25) = 1.44\\times10^{-38} $\n\n$ K_{\\max} = \\frac{1.44\\times10^{-38}}{3.34\\times10^{-27}} = 4.3\\times10^{-12}\\ \\text{J} $\n\n**Convert to MeV.** Divide by $ 1.6\\times10^{-19} $ to get eV:\n\n$ K_{\\max} = \\frac{4.3\\times10^{-12}}{1.6\\times10^{-19}} = 2.7\\times10^{7}\\ \\text{eV} = 27\\ \\text{MeV} $\n\n**Read the answer against the theory.** $ 27 $ MeV is right at the relativistic ceiling mentioned above — a proton at that energy is moving at about a quarter of the speed of light, and its mass has already increased by a few per cent. So this machine is at the practical limit of a plain cyclotron, and pushing it further would need the frequency to be swept downward as the particles speed up.\n\nIt is also, not coincidentally, exactly the energy range hospitals use.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Top view of a cyclotron showing the two dees, the accelerating gap and the outward spiral path of the particle',
      width: 'two_third',
      aspect_ratio: '4:3',
      caption: 'Semicircles inside the dees at constant speed; a push at every gap crossing. The spiral widens but the timing never changes.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), top view. Two semicircular hollow electrodes drawn in thin dim-grey outline with a warm amber tint, separated by a narrow vertical gap, together forming a circle. Inside them, a single amber particle track spirals outward from the centre as a series of widening semicircles, each half in one dee, with small bright orange arrowheads at each gap crossing to mark where acceleration happens. The background is dotted with dim-orange cross symbols indicating the field into the page. A short extraction channel leads out at the rim to a small grey target block. Muted white minimal labels reading dee, gap and target. Generous dark space, no clutter.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Magnetic field **bends**; the alternating electric field across the gap **accelerates**. The magnet does no work.\n- No field inside a dee (it is a conductor) → pure semicircle at constant speed.\n- Resonance: $ f = \\frac{qB}{2\\pi m} $ — works only because $ T $ is speed-independent.\n- Energy gained per revolution $ = 2qV $ (two gap crossings).\n- $ K_{\\max} = \\frac{q^{2}B^{2}R^{2}}{2m} $ — set by the **magnet**, not by the voltage.\n- Limits: relativistic mass increase caps it around $ 25 $ MeV for protons; useless for electrons and for neutral particles.',
    }),
    b('text', 13, {
      markdown: 'Next: a current is just a stream of moving charges. So a wire in a magnetic field must feel a force too — and it is easier to measure than a single particle.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('In a cyclotron, the particle is accelerated by',
          ['the electric field across the gap', 'the magnetic field inside the dees', 'both fields, in equal measure', 'the magnetic field across the gap'],
          0,
          'A magnetic force never does work, so it cannot change the particle\'s energy — it only bends the path. All the acceleration happens in the gap, where the alternating electric field acts.',
          2),
        q('The maximum energy a cyclotron can give a particle depends on',
          ['the field strength and the dee radius', 'the accelerating voltage applied', 'the frequency of the oscillator', 'the number of revolutions made'],
          0,
          '$ K_{\\max} = q^{2}B^{2}R^{2}/2m $ — the voltage does not appear. A larger voltage simply reaches the same final energy in fewer turns.',
          3),
        q('A cyclotron cannot usefully accelerate electrons because',
          ['they become relativistic almost at once', 'they carry a negative rather than positive charge', 'they are too light to be bent by the field', 'they would escape through the gap between the dees'],
          0,
          'The resonance condition depends on $ T = 2\\pi m/qB $ being constant. An electron reaches relativistic speeds within a few hundred keV, its effective mass rises, the period grows, and it falls out of step with the oscillator.',
          3),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p1, p2, p3, p4, p5, p6]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
