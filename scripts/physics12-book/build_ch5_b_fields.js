'use strict';
/**
 * Class 12 Physics · Ch.5 "Magnetic Effects of Current" — pages 7–11.
 * Force on a current-carrying wire, force between parallel wires, the
 * Biot-Savart law, the field of a straight wire, and the field of loops and arcs.
 *
 * Run: node scripts/physics12-book/build_ch5_b_fields.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 5;

// ── p7 · Force on a Current-Carrying Wire ────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'force-on-a-current-carrying-wire',
  title: 'Force on a Current-Carrying Wire',
  subtitle: 'Only the end-to-end vector matters',
  glossary: [
    { term: 'effective length', definition: 'The straight vector from one end of a wire to the other. In a uniform field it is the only thing about the wire\'s shape that affects the force on it.' },
    { term: 'Fleming\'s left-hand rule', definition: 'A mnemonic for the force on a current in a field: forefinger along B, middle finger along I, thumb gives the force. A second name for the same cross product the right hand already gives.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A current is a stream of charges, and each one feels $ q(\\vec{v}\\times\\vec{B}) $. So a wire in a field must feel the sum of all those forces.\n\nNow take a wire bent into a complicated squiggle — loops, kinks, zigzags — carrying a current through a uniform field. How much of that geometry do you need to know to find the total force?',
      hint: 'The forces on the individual pieces are vectors. What happens when you add vectors head to tail?',
      reveal: '**Only where it starts and where it ends.**\n\nEach small element contributes $ I\\,d\\vec{l}\\times\\vec{B} $, and in a *uniform* field $ \\vec{B} $ comes outside the sum. What is left is $ \\sum d\\vec{l} $ — and adding all those little displacement vectors head to tail gives simply the **straight vector from one end of the wire to the other**.\n\nSo every wiggle in between cancels out. A tangled wire feels exactly the same force as a straight wire joining its two ends.\n\nAnd it follows immediately that a **closed loop** in a uniform field feels **zero** net force, because its start and end are the same point.',
    }),
    b('text', 1, {
      markdown: 'Take a straight wire of length $ l $ carrying current $ I $ in a field $ \\vec{B} $. There are $ n A l $ carriers in it, each drifting at $ v_d $ and each feeling $ q(\\vec{v}_d\\times\\vec{B}) $. Adding them and using $ I = neAv_d $ from Chapter 3, all the microscopic detail collapses into',
    }),
    b('latex_block', 2, {
      latex: '\\vec{F} = I\\,(\\vec{l}\\times\\vec{B}), \\qquad |\\vec{F}| = BIl\\sin\\theta',
      label: 'Force on a straight current-carrying wire',
      note: 'l is a vector along the wire, in the direction of the current. θ is the angle between the wire and the field.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Notice what has disappeared: $ n $, $ A $, $ v_d $ and $ e $ are all gone. Only the current survives — which is exactly why this is the useful form. You can measure a current with an ammeter; you cannot measure a drift velocity.\n\n**The direction rule is the one you already have.** Look at the two formulas side by side: $ q\\vec{v}\\times\\vec{B} $ and $ I\\vec{l}\\times\\vec{B} $. The vector $ I\\vec{l} $ sits in exactly the slot $ \\vec{v} $ sat in, because a current *is* positive charge moving along the wire. So use the same **right** hand, in the same order as p2: point your fingers along the **current**, curl them towards $ \\vec{B} $, and your **thumb** gives the force.\n\nThere is one thing less to worry about than on p2. The sign of the charge does not come into it here, because the direction of the current already carries that information — in a wire carrying current to the right, the electrons are drifting left, and the formula has taken care of it.\n\n**Fleming\'s left-hand rule** is the traditional mnemonic for this same result, and exam papers name it, so know it: with the **fore**finger along the **field**, the **middle** finger along the **current**, the **thumb** gives the **force** (thrust), all three mutually perpendicular. It is a second *name* for the cross product, not a second rule — right hand and Fleming\'s left hand always agree. Pick the one you can do reliably under pressure and use it every single time.\n\nAnd the special cases fall out of $ \\sin\\theta $:\n\n- **Wire perpendicular to the field:** $ F = BIl $, the maximum.\n- **Wire parallel to the field:** $ F = 0 $. A wire lying along the field lines feels nothing.',
    }),
    b('image', 4, {
      src: '',
      alt: 'The same wire, field and force worked out twice: once with the right hand for I l cross B, and once with Fleming\'s left-hand rule',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'One situation, two hands, the same answer. Use the right hand if you already trust it from p2.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, each panel filled with a regular array of small dim-orange cross symbols indicating a magnetic field into the page, and each containing the same horizontal amber wire with a small orange arrow on it pointing to the right for the current and a bold bright-amber arrow pointing straight up for the force. Left panel: a simplified RIGHT hand sketched in thin grey line art above the wire, its flat fingers extended to the right along the current arrow and shown curling into the page towards the field, with the thumb extended straight up along the force arrow; small muted white labels reading I l, B and F beside the three directions. Right panel: a simplified LEFT hand sketched in the same thin grey line art with three fingers held mutually perpendicular — forefinger pointing into the page in slight perspective, middle finger pointing to the right, thumb pointing straight up — each finger tipped with a small muted white label reading field, current and force respectively. Generous dark space, no clutter.',
    }),
    b('heading', 5, {
      text: 'Curved wires and closed loops',
      level: 2,
      objective: 'Find the force on an arbitrarily shaped wire in a uniform field without integrating.',
    }),
    b('text', 6, {
      markdown: 'For a wire of any shape in a **uniform** field, the argument from the opening applies:',
    }),
    b('latex_block', 7, {
      latex: '\\vec{F} = I\\left(\\vec{L}_{\\text{eff}}\\times\\vec{B}\\right)',
      label: 'Force on a wire of any shape (uniform field)',
      note: 'L_eff is the straight vector from the start of the wire to its end. The shape in between is irrelevant.',
      highlight: true,
    }),
    b('text', 8, {
      markdown: 'Two consequences worth having ready:\n\n**A semicircular wire of radius $ R $** carrying current in a uniform field has $ L_{\\text{eff}} = 2R $ — the diameter, joining its two ends — not $ \\pi R $, its actual length. So $ F = 2BIR $.\n\n**Any closed loop** has $ \\vec{L}_{\\text{eff}} = 0 $, because it ends where it began. So the net force on a closed loop in a uniform field is **zero**, whatever its shape and orientation.\n\nThat last result should feel familiar. A current loop is a magnetic dipole, and Chapter 4 showed that a dipole in a uniform field feels no net force — only a torque. The two statements are the same fact, and p14 will close that circle properly.\n\n**Careful, though:** this is a *uniform*-field result. In a non-uniform field a closed loop **does** feel a net force, which is exactly why a magnet attracts a coil.',
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'spatial',
      prompt: 'A wire is bent into a semicircle of radius $ R $ and placed in a uniform field $ B $ perpendicular to its plane, carrying current $ I $. What is the force on it?',
      options: ['$ 2BIR $', '$ \\pi BIR $', 'zero', '$ BIR $'],
      reveal: '**$ 2BIR $.**\n\nThe effective length is the straight vector joining the two ends of the semicircle — its **diameter**, $ 2R $. So\n\n$ F = BI(2R) = 2BIR $\n\nThe answer $ \\pi BIR $ uses the *actual arc length* $ \\pi R $, and that is the mistake this question exists to catch. The arc length would matter if you were computing resistance or heating; for force in a uniform field, only the end-to-end vector counts.\n\n**Why the shape drops out.** Each element contributes $ I\\,d\\vec{l}\\times\\vec{B} $, and in a uniform field $ \\vec{B} $ factors out of the sum, leaving $ \\sum d\\vec{l} $ — which is the resultant displacement, head to tail. Every excursion sideways is undone by a matching one back.\n\nAnd note that zero would be right if the wire were a **complete** circle.',
      difficulty_level: 3,
    }),
    b('worked_example', 10, {
      label: 'a wire held up by a magnetic force',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A horizontal wire of mass per unit length $ 5.0\\times10^{-3} $ kg/m is placed in a horizontal magnetic field of $ 0.20 $ T, perpendicular to the wire. What current would make the magnetic force support the wire against gravity? Take $ g = 9.8 $ m/s².',
      solution: 'For the wire to float, the upward magnetic force must balance its weight — per unit length, since the length itself will cancel.\n\n**Magnetic force per unit length:** $ \\frac{F}{l} = BI $ (the wire is perpendicular to the field, so $ \\sin\\theta = 1 $).\n\n**Weight per unit length:** $ \\frac{mg}{l} = \\lambda g $, where $ \\lambda = 5.0\\times10^{-3} $ kg/m.\n\nSetting them equal:\n\n$ BI = \\lambda g $\n\n$ I = \\frac{\\lambda g}{B} = \\frac{(5.0\\times10^{-3})(9.8)}{0.20} = \\frac{4.9\\times10^{-2}}{0.20} $\n\n$ I = 0.245\\ \\text{A} $\n\nAbout a quarter of an amp — a very ordinary current, holding up a wire against gravity. That is a good measure of how strong magnetic forces are at laboratory scale.\n\n**The direction matters too, and the question did not ask.** The current must flow in whichever sense makes $ I\\vec{l}\\times\\vec{B} $ point **upward**; reverse it and the wire is pressed down with the same force. Always state the sense, even when only a magnitude is requested.\n\n**And note the technique:** working per unit length let $ l $ cancel, so the wire\'s actual length never had to be known.',
    }),
    b('image', 11, {
      src: '',
      alt: 'A straight wire and a bent wire in the same uniform field, with the effective length shown as the straight line joining the ends',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Both wires feel the same force. Only the vector from start to end enters.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule, each filled with a regular array of small dim-orange cross symbols for a field into the page. Left panel: a straight horizontal amber wire with a small current arrow on it and a bold orange force arrow pointing upward, with a dashed grey line beneath labelled l. Right panel: an irregularly bent amber wire with several kinks and one loop, its two ends at the same positions as the straight wire in the left panel, with the same bold upward force arrow and a dashed grey straight line joining its two ends labelled L effective. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\vec{F} = I(\\vec{l}\\times\\vec{B}) $, magnitude $ BIl\\sin\\theta $. All the microscopic detail cancels into $ I $.\n- Direction: the **same right hand as p2**, with $ I\\vec{l} $ in place of $ \\vec{v} $ — fingers along the current, curl to $ \\vec{B} $, thumb gives $ \\vec{F} $. No sign flip; the current carries it.\n- Fleming\'s left hand (**fore** = **field**, **middle** = **current**, **thumb** = force) is the same rule under another name. Use one of them, always.\n- Wire $ \\perp $ field → $ F = BIl $ (maximum). Wire $ \\parallel $ field → $ F = 0 $.\n- Any shape in a **uniform** field → use $ \\vec{L}_{\\text{eff}} $, the straight vector end to end. Semicircle → $ 2R $, not $ \\pi R $.\n- **Closed loop in a uniform field → zero net force.** (Not in a non-uniform one.)',
    }),
    b('text', 13, {
      markdown: 'Next: if a field pushes a current, and a current makes a field, then two currents must push each other. That mutual force turns out to define the ampere.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A wire carrying current $ I $ lies **parallel** to a uniform magnetic field. The force on it is',
          ['zero', '$ BIl $', '$ BIl/2 $', 'perpendicular to the wire'],
          0,
          '$ F = BIl\\sin\\theta $ with $ \\theta = 0 $ gives zero. A wire lying along the field lines feels nothing at all — the same condition as a charge moving along the field.',
          1),
        q('The net force on a closed current loop placed in a **uniform** magnetic field is',
          ['zero, whatever its shape', 'zero only if it is circular', '$ BIl $ where $ l $ is its perimeter', 'directed along the field'],
          0,
          'The effective length is the vector from start to end, and a closed loop ends where it begins — so $ \\vec{L}_{\\text{eff}} = 0 $. It does experience a torque, though, and in a **non-uniform** field it experiences a net force as well.',
          3),
        q('A wire bent into a semicircle of radius $ R $ carries current $ I $ in a uniform field $ B $ perpendicular to its plane. The force on it is',
          ['$ 2BIR $', '$ \\pi BIR $', 'zero', '$ 2\\pi BIR $'],
          0,
          'The effective length is the diameter joining the two ends, $ 2R $ — not the arc length $ \\pi R $. In a uniform field the shape of the wire between its endpoints makes no difference to the force.',
          3),
      ],
    }),
  ],
};

// ── p8 · Force Between Two Parallel Wires ────────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'force-between-two-parallel-wires',
  title: 'Force Between Two Parallel Wires',
  subtitle: 'The effect that used to define the ampere',
  glossary: [],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Two parallel wires carrying current in the **same** direction **attract** each other.\n\nThat is worth pausing on, because it is the opposite of what electrostatics trained you to expect. Two like charges repel; two like currents attract.\n\nThere is no contradiction — the charges in the two wires are not what is interacting here. Each wire sits in the *magnetic field* of the other, and the geometry of $ \\vec{I}\\times\\vec{B} $ happens to come out attractive for parallel flow.',
    }),
    b('text', 1, {
      markdown: 'Two long straight parallel wires, a distance $ d $ apart, carrying $ I_1 $ and $ I_2 $.\n\nThe argument is in two steps, and each uses a result you already have. Wire 1 produces a field at wire 2 of magnitude $ B_1 = \\frac{\\mu_0 I_1}{2\\pi d} $ (this is the straight-wire result, derived properly two pages from now). Wire 2, sitting in that field, feels $ F = B_1I_2l $. Putting them together and dividing by the length:',
    }),
    b('latex_block', 2, {
      latex: '\\frac{F}{l} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}',
      label: 'Force per unit length between parallel wires',
      note: 'Same direction → ATTRACT. Opposite directions → REPEL. Note it is force per unit LENGTH — the total force needs a length.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'The sign rule is worth deriving once with your own hand rather than memorising, and it is quick: put both currents upward, work out the direction of wire 1\'s field at wire 2 (into the page, on that side), then apply $ I\\vec{l}\\times\\vec{B} $ to wire 2. The force comes out pointing towards wire 1.\n\n> **Parallel currents attract. Antiparallel currents repel.**\n\nAnd notice the two features that make this a useful formula. It is **force per unit length**, so you must multiply by a length to get a force. And it falls as $ 1/d $, not $ 1/d^{2} $ — the same $ 1/d $ as the field of a long wire, for the same reason: an infinitely long source, not a point one.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'spatial',
      prompt: 'Two long wires are drawn side by side on the page, both **vertical**, and both carrying current **straight up**. Wire 1 is on the left, wire 2 on the right. Which way is the force on wire 2, and why?',
      options: [
        'Away from wire 1. Currents in the same sense must repel, exactly as two like charges do.',
        'Towards wire 1. Its field at wire 2 points into the page, and $ I\\vec{l}\\times\\vec{B} $ then points left.',
        'Away from wire 1. Its field at wire 2 points into the page, but $ I\\vec{l}\\times\\vec{B} $ points right.',
        'Into the page. The force acts along wire 1\'s field at wire 2, which itself points into the page.',
      ],
      correct_index: 1,
      reveal: '**Towards wire 1** — the two wires pull together.\n\nDo it in two steps, and do not trust a mental picture of a rotating hand for either of them. Set up axes on the page: $ \\hat{i} $ to the right, $ \\hat{j} $ up the page (so both currents are along $ +\\hat{j} $), and $ \\hat{k} $ out of the page.\n\n*Step 1 — wire 1\'s field at wire 2.* Wire 2 lies to the right of wire 1, so the direction from the source to the point is $ +\\hat{i} $. The grip rule in vector form puts the field along (current direction) $ \\times $ (direction to the point):\n\n$ \\hat{j}\\times\\hat{i} = -\\hat{k} $\n\nSo $ \\vec{B}_1 $ at wire 2 points along $ -\\hat{k} $ — **into the page**. Grip wire 1 with your right hand, thumb up, and your fingers do go into the page on the right-hand side. ✓\n\n*Step 2 — the force on wire 2.* Its current vector is along $ +\\hat{j} $ and it sits in a field along $ -\\hat{k} $:\n\n$ \\hat{j}\\times(-\\hat{k}) = -\\hat{i} $\n\nSo $ \\vec{F} = I_2 l B_1\\,(-\\hat{i}) $ — pointing **left**, straight at wire 1. Attraction.\n\n**The trap is the analogy with charges,** and it is a strong one. Two like charges repel, so two like currents ought to repel. They do not. Nothing is interacting electrically here at all — both wires are electrically neutral, with as much positive charge as negative. What acts is one wire\'s *magnetic field* on the other wire\'s current, and that geometry comes out the other way round.\n\n**A useful memory hook:** currents flowing the same way behave like two strands of the same rope, pulling together. Currents flowing opposite ways push apart.\n\nAnd check the symmetry when you finish: by Newton\'s third law the force on wire 1 must be equally strong and point right, towards wire 2. Redo step 1 with the direction to the point reversed and you get exactly that.',
      difficulty_level: 3,
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'Two long parallel wires $ 10 $ cm apart each carry $ 5 $ A in the same direction. Find the force per unit length, and say whether it is attractive or repulsive.',
      options: [
        '$ 5\\times10^{-5} $ N/m, attractive',
        '$ 5\\times10^{-5} $ N/m, repulsive',
        '$ 5\\times10^{-4} $ N/m, attractive',
        '$ 2.5\\times10^{-5} $ N/m, attractive',
      ],
      reveal: '**$ 5\\times10^{-5} $ N/m, attractive.**\n\n$ \\frac{F}{l} = \\frac{\\mu_0I_1I_2}{2\\pi d} $. Use $ \\frac{\\mu_0}{2\\pi} = 2\\times10^{-7} $ — worth memorising in that form, since it saves handling $ 4\\pi $ every time.\n\n$ \\frac{F}{l} = \\frac{(2\\times10^{-7})(5)(5)}{0.10} = \\frac{5\\times10^{-6}}{0.10} = 5\\times10^{-5}\\ \\text{N/m} $\n\nCurrents in the **same** direction, so **attractive**.\n\n**A sense of the scale.** Fifty micronewtons per metre — about the weight of a grain of sand on every metre of wire. Magnetic forces between ordinary currents are genuinely tiny, which is exactly why the ampere had to be defined at $ 1 $ m separation where the number comes out at $ 2\\times10^{-7} $ N/m and can just be measured.\n\nIn a short circuit carrying thousands of amps, though, the same formula gives forces large enough to tear busbars off their mountings — which is why heavy switchgear is bolted down.',
      difficulty_level: 2,
    }),
    b('worked_example', 6, {
      label: 'three wires, and which way the middle one moves',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Three long parallel wires lie in one plane, $ 10 $ cm apart in a row. Wire A carries $ 10 $ A, wire B (the middle one) carries $ 20 $ A, and wire C carries $ 30 $ A — all three in the **same** direction. Find the net force per unit length on wire B, and say which way it points.',
      solution: '**Do the two directions before touching the arithmetic.** Both of B\'s neighbours carry current the same way it does, so both pull it towards themselves — and they pull it **opposite ways**. A is on one side, C on the other. So the two forces subtract, and the answer is a difference, not a sum.\n\nThat single observation is what the question is really testing. Get it wrong and you add $ 4\\times10^{-4} $ to $ 1.2\\times10^{-3} $ and hand in a number three times too big.\n\n**Force per unit length from A on B**, at $ d = 0.10 $ m, using $ \\frac{\\mu_0}{2\\pi} = 2\\times10^{-7} $:\n\n$ \\frac{F_A}{l} = \\frac{(2\\times10^{-7})(10)(20)}{0.10} = \\frac{4\\times10^{-5}}{0.10} = 4.0\\times10^{-4}\\ \\text{N/m} $\n\ndirected **towards A**.\n\n**Force per unit length from C on B**, same separation:\n\n$ \\frac{F_C}{l} = \\frac{(2\\times10^{-7})(20)(30)}{0.10} = \\frac{1.2\\times10^{-4}}{0.10} = 1.2\\times10^{-3}\\ \\text{N/m} $\n\ndirected **towards C**.\n\n**Subtract, because they oppose:**\n\n$ \\frac{F}{l} = 1.2\\times10^{-3} - 4.0\\times10^{-4} = 8.0\\times10^{-4}\\ \\text{N/m} $\n\npointing **towards C**, the $ 30 $ A wire.\n\n**Check it against common sense.** Both neighbours are the same distance away, so the stronger current wins, and B is dragged towards it. If C had carried only $ 10 $ A the two pulls would have been equal and B would have sat still — an equilibrium, though an unstable one, since nudging B nearer either wire strengthens that side\'s pull.\n\n**And note what did NOT happen.** B\'s own field does not act on B, and A\'s force on C plays no part in the force on B. Superposition here means: add the forces on the wire you were asked about, one source at a time, and ignore everything else.',
    }),
    b('heading', 7, {
      text: 'How this used to define the ampere',
      level: 2,
      objective: 'State the old definition of the ampere and explain why it was replaced.',
    }),
    b('text', 8, {
      markdown: 'Put $ I_1 = I_2 = 1 $ A and $ d = 1 $ m into the formula:\n\n$ \\frac{F}{l} = \\frac{(4\\pi\\times10^{-7})(1)(1)}{2\\pi(1)} = 2\\times10^{-7}\\ \\text{N/m} $\n\nFor most of the twentieth century, that was read **backwards** as the definition:\n\n> One ampere is the current which, flowing in each of two infinitely long parallel wires one metre apart in vacuum, produces a force of exactly $ 2\\times10^{-7} $ newtons per metre between them.\n\nThat is why $ \\mu_0 $ used to be exactly $ 4\\pi\\times10^{-7} $ — it was not measured, it was **defined**, chosen precisely so the ampere came out at a convenient value.\n\n**This changed in 2019.** The SI now defines the ampere by fixing the elementary charge $ e $ exactly, so a current is literally a counted number of electrons per second. As a consequence $ \\mu_0 $ is no longer exact — it is now a measured quantity, though still $ 4\\pi\\times10^{-7} $ to within about one part in ten billion.\n\nSo you can keep using $ 4\\pi\\times10^{-7} $ with a clear conscience. But if a book tells you $ \\mu_0 $ is *exact*, it was written before 2019.',
    }),
    b('worked_example', 9, {
      label: 'a wire floating above another',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A long straight wire carries $ 30 $ A. A second wire of mass per unit length $ 1.0\\times10^{-4} $ kg/m is placed parallel to it and floats in equilibrium, supported by the magnetic repulsion. If the second wire carries $ 20 $ A, at what separation does it float? Take $ g = 9.8 $ m/s².',
      solution: '**Set up the balance per unit length**, so the length cancels.\n\nFor the wire to float, the magnetic repulsion must support its weight:\n\n$ \\frac{\\mu_0I_1I_2}{2\\pi d} = \\lambda g $\n\n**Rearrange for $ d $:**\n\n$ d = \\frac{\\mu_0I_1I_2}{2\\pi\\lambda g} = \\frac{(2\\times10^{-7})(30)(20)}{(1.0\\times10^{-4})(9.8)} $\n\nNumerator: $ (2\\times10^{-7})(600) = 1.2\\times10^{-4} $\n\nDenominator: $ 9.8\\times10^{-4} $\n\n$ d = \\frac{1.2\\times10^{-4}}{9.8\\times10^{-4}} = 0.122\\ \\text{m} \\approx 12\\ \\text{cm} $\n\n**Check the physics, not just the arithmetic.** For the force to be **repulsive** and hold the wire up, the two currents must be **antiparallel** — one up, one down. Parallel currents would attract, and the upper wire would fall onto the lower one.\n\n**And note that the equilibrium is unstable.** Push the floating wire slightly downward and the repulsion, which goes as $ 1/d $, gets **stronger** and pushes it back — so that direction is stable. But push it slightly up and the repulsion weakens, so gravity wins and it falls further. The balance only holds at exactly one height, and it will not survive a nudge upward.',
    }),
    b('image', 10, {
      src: '',
      alt: 'Two parallel wires with parallel currents attracting, and with antiparallel currents repelling',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Same direction, attract. Opposite directions, repel. The reverse of what two like charges do.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel labelled parallel: two vertical amber wires with small orange current arrows both pointing upward, faint dim-orange circular field lines around each, and two bold orange force arrows pointing inward towards each other. Right panel labelled antiparallel: the same two wires with current arrows in opposite directions and two bold orange force arrows pointing outward away from each other. A dashed grey dimension line between the wires in each panel labelled d. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\frac{F}{l} = \\frac{\\mu_0I_1I_2}{2\\pi d} $ — force per unit **length**, falling as $ 1/d $.\n- **Parallel currents attract; antiparallel currents repel.** The opposite of like charges.\n- Derive the sense, do not guess it: $ \\hat{j}\\times\\hat{i} = -\\hat{k} $ gives the field, then $ \\hat{j}\\times(-\\hat{k}) = -\\hat{i} $ gives a force pointing at the other wire.\n- With three or more wires, settle every **direction** first, then add — neighbours on opposite sides subtract.\n- Memorise $ \\frac{\\mu_0}{2\\pi} = 2\\times10^{-7} $ — it saves handling $ 4\\pi $ in every problem.\n- $ 1 $ A at $ 1 $ m gives exactly $ 2\\times10^{-7} $ N/m — the old definition of the ampere.\n- Since 2019 the ampere is defined by fixing $ e $, so $ \\mu_0 $ is now measured, not exact.',
    }),
    b('text', 12, {
      markdown: 'Next: we have twice now used the field of a straight wire without deriving it. Time to fix that — with the law that plays for magnetism the role Coulomb\'s law plays for electricity.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('Two long parallel wires carry currents in the same direction. They',
          ['attract each other', 'repel each other', 'exert no force on each other', 'exert forces along their own lengths'],
          0,
          'Each wire sits in the magnetic field of the other, and $ I\\vec{l}\\times\\vec{B} $ comes out attractive for parallel flow. It is deliberately the opposite of the electrostatic case, where like charges repel.',
          2),
        q('The force per unit length between two long parallel wires varies with their separation as',
          ['$ 1/d $', '$ 1/d^{2} $', '$ 1/d^{3} $', 'it does not depend on $ d $'],
          0,
          'It inherits the $ 1/d $ dependence of a long wire\'s field. An inverse-square law would require point-like sources; an infinitely long wire is not one.',
          2),
        q('Two long parallel wires $ 1 $ m apart each carrying $ 1 $ A experience a force per unit length of',
          ['$ 2\\times10^{-7} $ N/m', '$ 4\\pi\\times10^{-7} $ N/m', '$ 10^{-7} $ N/m', '$ 2\\times10^{-5} $ N/m'],
          0,
          'Substituting into $ \\mu_0I_1I_2/2\\pi d $ gives exactly $ 2\\times10^{-7} $ N/m — and for most of the twentieth century this was read backwards as the definition of the ampere.',
          1),
      ],
    }),
  ],
};

// ── p9 · The Biot–Savart Law ─────────────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'the-biot-savart-law',
  title: 'The Biot–Savart Law',
  subtitle: "Magnetism's answer to Coulomb — with two crucial differences",
  glossary: [
    { term: 'Biot-Savart law', definition: 'The law giving the magnetic field produced by a small element of current: $ d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I\\,d\\vec{l}\\times\\hat{r}}{r^{2}} $.' },
    { term: 'current element', definition: 'A short length $ d\\vec{l} $ of a current-carrying wire, treated as the basic source of magnetic field.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Chapter 1 built the whole of electrostatics on one starting point: the field of a **point charge**, $ E = kq/r^{2} $. Everything else came from slicing a distribution into points and adding.\n\nMagnetism needs the same foundation. So what is the magnetic equivalent of a point charge — the smallest possible source of magnetic field?',
      hint: 'What produces magnetic fields? And can you have half of one?',
      reveal: 'There isn\'t a magnetic point charge — that was p1 of Chapter 4. Magnetic fields come from **currents**, and the smallest piece of a current is a short length of wire carrying it: a **current element**, $ I\\,d\\vec{l} $.\n\nAnd here is what makes magnetism harder than electrostatics. A point charge is a **scalar** source with no direction of its own. A current element is a **vector** source — it points along the wire — and the field it makes depends on that direction as well as on where you are standing.\n\nSo the magnetic starting point needs a cross product where the electric one needed none. That is the whole reason these calculations feel more work.',
    }),
    b('text', 1, {
      markdown: 'The field produced by a current element $ I\\,d\\vec{l} $ at a point a distance $ r $ away, in the direction $ \\hat{r} $ from the element, is',
    }),
    b('latex_block', 2, {
      latex: 'd\\vec{B} = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{I\\,d\\vec{l}\\times\\hat{r}}{r^{2}}, \\qquad |d\\vec{B}| = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{I\\,dl\\sin\\theta}{r^{2}}',
      label: 'The Biot–Savart law',
      note: 'θ is the angle between the element dl and the line to the field point. μ₀/4π = 10⁻⁷ T·m/A.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Read it beside Coulomb\'s law and the family resemblance is obvious — an inverse square, a source strength on top, a constant out front. But the two differences are exactly the ones that matter.',
    }),
    b('comparison_card', 4, {
      title: "Coulomb's law and Biot-Savart, compared",
      columns: [
        {
          heading: 'Electric — point charge',
          points: [
            '$ dE = \\frac{1}{4\\pi\\varepsilon_0}\\frac{dq}{r^{2}} $',
            'Source $ dq $ is a **scalar** — no direction of its own',
            'Field is **along** $ \\hat{r} $ — radial, away from or towards the source',
            'No cross product anywhere',
            'Constant $ \\frac{1}{4\\pi\\varepsilon_0} = 9\\times10^{9} $',
          ],
        },
        {
          heading: 'Magnetic — current element',
          points: [
            '$ dB = \\frac{\\mu_0}{4\\pi}\\frac{I\\,dl\\sin\\theta}{r^{2}} $',
            'Source $ I\\,d\\vec{l} $ is a **vector** — it points along the wire',
            'Field is **perpendicular** to both $ d\\vec{l} $ and $ \\hat{r} $ — it circles the wire',
            'Cross product is unavoidable',
            'Constant $ \\frac{\\mu_0}{4\\pi} = 10^{-7} $ exactly',
          ],
        },
      ],
    }),
    b('text', 5, {
      markdown: 'That third row is the one to hold on to. An electric field points **away from** its source; a magnetic field **circles around** it. So the field lines of a straight wire are concentric circles, not radial spokes — and that single geometric fact is why magnetic field lines close on themselves while electric ones do not.\n\nThe $ \\sin\\theta $ has two consequences worth noting immediately:\n\n- **$ \\theta = 90^\\circ $** — the field point is straight out sideways from the element — gives the maximum contribution.\n- **$ \\theta = 0^\\circ $ or $ 180^\\circ $** — the field point lies **along** the wire, in front of or behind the element — gives **zero**. A current element produces no field at any point on its own line of action.',
    }),
    b('reasoning_prompt', 6, {
      reasoning_type: 'spatial',
      prompt: 'A short current element points along the $ x $-axis. At which of these points does it produce **no** magnetic field?',
      options: [
        'At a point further along the $ x $-axis',
        'At a point on the $ y $-axis',
        'At a point on the $ z $-axis',
        'It produces a field everywhere',
      ],
      reveal: '**At a point further along the $ x $-axis** — that is, anywhere along its own line.\n\n$ dB \\propto \\sin\\theta $, where $ \\theta $ is the angle between the element and the line to the field point. For a point straight ahead along the same axis, $ \\theta = 0 $, so $ \\sin\\theta = 0 $ and the contribution vanishes.\n\nOn the $ y $- or $ z $-axis, $ \\theta = 90^\\circ $ and the contribution is maximum.\n\n**Why this matters in practice.** In the next page\'s derivation for a straight wire, the elements *nearest* the perpendicular foot contribute most and the far-away ones contribute little — partly because $ r $ is larger, but also because $ \\theta $ shrinks towards zero. Both effects work the same way, which is what makes the integral converge nicely.\n\nAnd it explains a result you can then check: at a point on the **extension** of a finite straight wire, the field is exactly **zero**, because every element there has $ \\theta = 0 $.',
      difficulty_level: 3,
    }),
    b('text', 7, {
      markdown: 'One honest caveat about the status of this law. A current element cannot exist on its own — current has to come from somewhere and go somewhere, so you can never isolate an $ I\\,d\\vec{l} $ and measure its field directly. Coulomb\'s law, by contrast, describes something you can actually put on a bench.\n\nSo Biot-Savart is not a directly verifiable statement; it is a **rule for building** fields whose *integrated* predictions are checked against experiment. Every complete circuit it has been tested on has agreed, which is why we trust it.\n\nThe recipe from here on is exactly the slice-and-add method of Chapter 1:\n\n1. **Slice** the wire into elements $ d\\vec{l} $.\n2. **Write $ d\\vec{B} $** for one element, and note its direction.\n3. **Use symmetry** to find the component that cancels, and drop it.\n4. **Integrate** what survives.\n\nThe next two pages do that three times.',
    }),
    b('image', 8, {
      src: '',
      alt: 'A current element with the field it produces circling around it, shown perpendicular to both the element and the line to the field point',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The field is perpendicular to both the element and the line to the point — so it circles the wire rather than radiating from it.',
      generation_prompt: 'Clean scientific 3D-perspective diagram on a near-black background (#0B0C0F). A short thick amber segment labelled I dl drawn at an angle, with a small orange current arrow along it. A thin dashed grey line runs from the segment to a marked point P, labelled r, with a small arc between the segment and that line labelled theta. At P, a bold orange arrow points perpendicular to the plane containing the segment and the line, labelled dB. A faint dim-orange circular arc is sketched around the segment to suggest that the field curls around it. Muted white minimal labels, generous dark space, no clutter.',
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I\\,d\\vec{l}\\times\\hat{r}}{r^{2}} $, magnitude $ \\frac{\\mu_0}{4\\pi}\\frac{I\\,dl\\sin\\theta}{r^{2}} $.\n- $ \\frac{\\mu_0}{4\\pi} = 10^{-7} $ T·m/A.\n- The source is a **vector** ($ I\\,d\\vec{l} $), unlike a charge — hence the cross product.\n- The field is **perpendicular** to both $ d\\vec{l} $ and $ \\hat{r} $: it **circles** the wire rather than radiating from it.\n- Zero contribution at any point on the element\'s own line ($ \\sin\\theta = 0 $).\n- Method: slice → write $ d\\vec{B} $ → kill a component by symmetry → integrate.',
    }),
    b('text', 10, {
      markdown: 'Next: the first and most useful application — the field of a straight wire, finite and infinite.',
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('In the Biot–Savart law, the direction of $ d\\vec{B} $ is',
          ['perpendicular to both $ d\\vec{l} $ and $ \\hat{r} $', 'along the element $ d\\vec{l} $ itself', 'radially outward, along $ \\hat{r} $', 'radially inward, opposite to $ \\hat{r} $'],
          0,
          'It is a cross product $ d\\vec{l}\\times\\hat{r} $, so it is perpendicular to both. This is why magnetic field lines circle a wire instead of radiating from it, as electric field lines radiate from a charge.',
          2),
        q('A current element produces zero magnetic field at points',
          ['lying along its own line', 'perpendicular to it', 'at a large distance', 'in the plane containing it'],
          0,
          'There $ \\theta = 0 $ or $ 180^\\circ $, so $ \\sin\\theta = 0 $. It follows that the field at a point on the extension of a finite straight wire is exactly zero, since every element has $ \\theta = 0 $.',
          3),
        q('The essential difference between Coulomb\'s law and the Biot–Savart law is that',
          ['the magnetic source is a vector, not a scalar', 'the magnetic law is not an inverse-square law', 'the magnetic law carries no constant in front', 'the magnetic field is a scalar quantity'],
          0,
          'Both are inverse-square laws with a constant in front and both give vector fields. What differs is the source: a charge $ dq $ has no direction, but a current element $ I\\,d\\vec{l} $ does — and that forces the cross product.',
          3),
      ],
    }),
  ],
};

// ── p10 · The Field of a Straight Wire ───────────────────────────────────────
const p10 = {
  page_number: 10,
  slug: 'the-field-of-a-straight-wire',
  title: 'The Field of a Straight Wire',
  subtitle: 'The most-used result in the chapter, and its two limits',
  glossary: [
    { term: 'right-hand grip rule', definition: 'Grip the wire with the right hand, thumb along the current; the curl of the fingers gives the direction of the magnetic field.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'This is the result Oersted saw on his lecture bench in 1820, and it is the single most-used formula in the chapter.\n\nIt is also the one whose **direction** rule you must be able to apply without thinking, because it appears inside almost every other problem — force between wires, fields of loops, Ampère\'s law, the lot.',
    }),
    b('text', 1, {
      markdown: 'Take a straight wire carrying current $ I $, and a point at perpendicular distance $ d $ from it. Slice the wire, apply Biot-Savart to each element, and integrate.\n\nOne simplification arrives immediately: **every element\'s contribution points the same way** at the field point — perpendicular to the plane containing the wire and the point. So there is no vector cancellation to worry about, and the integral is over magnitudes alone.\n\nFor a **finite** wire, with $ \\theta_1 $ and $ \\theta_2 $ the angles subtended at the foot of the perpendicular by the two ends:',
    }),
    b('latex_block', 2, {
      latex: 'B = \\frac{\\mu_0 I}{4\\pi d}\\left(\\sin\\theta_1 + \\sin\\theta_2\\right)',
      label: 'Field of a finite straight wire',
      note: 'Angles measured from the perpendicular. This one formula gives every straight-wire case — take the right limits.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'That single expression handles every straight-wire situation you will meet, provided you take the limits correctly.',
    }),
    b('table', 4, {
      caption: 'One formula, four cases. Get the angles right and the rest is arithmetic.',
      headers: ['Case', 'Angles', 'Field'],
      rows: [
        ['**Infinite** wire', '$ \\theta_1 = \\theta_2 = 90^\\circ $', '$ \\frac{\\mu_0I}{4\\pi d}(1+1) = \\frac{\\mu_0I}{2\\pi d} $'],
        ['**Semi-infinite** wire, point opposite one end', '$ \\theta_1 = 90^\\circ,\\ \\theta_2 = 0 $', '$ \\frac{\\mu_0I}{4\\pi d} $ — half the infinite value'],
        ['Point on the **perpendicular bisector** of a wire of length $ 2L $', '$ \\theta_1 = \\theta_2 = \\theta $', '$ \\frac{\\mu_0I}{2\\pi d}\\sin\\theta $, with $ \\sin\\theta = \\frac{L}{\\sqrt{L^{2}+d^{2}}} $'],
        ['Point on the **extension** of the wire', 'every element has $ \\theta = 0 $', '**zero**'],
      ],
    }),
    b('text', 5, {
      markdown: 'The infinite-wire case is the one to have permanently to hand:',
    }),
    b('latex_block', 6, {
      latex: 'B = \\frac{\\mu_0 I}{2\\pi d}',
      label: 'Field of a long straight wire',
      note: 'Falls as 1/d. Circles the wire, direction by the right-hand grip rule.',
      highlight: true,
    }),
    b('heading', 7, {
      text: 'The direction: the right-hand grip rule',
      level: 2,
      objective: 'Apply the grip rule to find the field direction around a wire.',
    }),
    b('text', 8, {
      markdown: 'Grip the wire with your **right** hand, thumb pointing along the **current**. Your fingers curl the way the field goes.\n\nSo the field lines are **concentric circles** around the wire, in planes perpendicular to it — closer together near the wire, where the field is stronger.\n\nAnd here is a nice confirmation of Chapter 4. These circles are closed loops with no beginning and no end, which is exactly the property that Gauss\'s law for magnetism demanded. The geometry of Biot-Savart delivers it automatically.\n\nWith the current flowing **out of the page**, the field circles **anticlockwise**. Work that one case out with your own hand now; almost every diagram reduces to it.',
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'quantitative',
      prompt: 'A long straight wire carries $ 10 $ A. At what distance from it is the field equal in magnitude to the Earth\'s field of about $ 5\\times10^{-5} $ T?',
      options: ['About $ 4 $ cm', 'About $ 4 $ mm', 'About $ 40 $ cm', 'About $ 4 $ m'],
      reveal: '**About 4 cm.**\n\n$ B = \\frac{\\mu_0I}{2\\pi d} \\quad\\Rightarrow\\quad d = \\frac{\\mu_0I}{2\\pi B} $\n\nUsing $ \\frac{\\mu_0}{2\\pi} = 2\\times10^{-7} $:\n\n$ d = \\frac{(2\\times10^{-7})(10)}{5\\times10^{-5}} = \\frac{2\\times10^{-6}}{5\\times10^{-5}} = 0.04\\ \\text{m} = 4\\ \\text{cm} $\n\n**This is Oersted\'s experiment, quantified.** A compass 4 cm from a wire carrying 10 A sees a field comparable to the Earth\'s, so it deflects by roughly $ 45^\\circ $ — a large, unmistakable movement. Any closer and it swings round almost completely.\n\nWhich also explains why the effect went unnoticed for so long: with a weak battery giving a fraction of an amp, you have to hold the compass within millimetres. Oersted had a decent voltaic pile and got lucky with his geometry.',
      difficulty_level: 2,
    }),
    b('worked_example', 10, {
      label: 'two wires, and the point where the field vanishes',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Two long parallel wires $ 20 $ cm apart carry currents of $ 6 $ A and $ 4 $ A in the **same** direction. Find the point between them where the net magnetic field is zero.',
      solution: '**Region first — as always.** Between the wires the two fields point in **opposite** directions (grip each wire and check), so cancellation is possible there. Outside, both fields point the same way and cannot cancel.\n\nLet the point be $ x $ from the $ 6 $ A wire, so $ (0.20 - x) $ from the $ 4 $ A wire. Setting the magnitudes equal:\n\n$ \\frac{\\mu_0(6)}{2\\pi x} = \\frac{\\mu_0(4)}{2\\pi(0.20-x)} $\n\nEverything cancels except the currents and distances:\n\n$ \\frac{6}{x} = \\frac{4}{0.20-x} $\n\n$ 6(0.20-x) = 4x \\quad\\Rightarrow\\quad 1.2 = 10x \\quad\\Rightarrow\\quad x = 0.12\\ \\text{m} $\n\nSo the null point is **12 cm from the 6 A wire** and 8 cm from the 4 A wire.\n\n**Sanity check:** it sits nearer the **smaller** current, as it must — the weaker source needs the advantage of a shorter distance to match the stronger one. Exactly the same logic as the null point between two unequal charges in Chapter 1.\n\n**And note the contrast with electrostatics.** For two **like charges** the null lies between them; for two **parallel currents** it also lies between them. But for **antiparallel** currents the fields add between the wires and cancel only *outside* — the mirror image of the unlike-charge case. Always determine the region from the geometry rather than by analogy.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Concentric circular field lines around a straight wire, with the right-hand grip rule illustrated',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Concentric circles, crowded near the wire. Thumb along the current, fingers give the field.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), two panels side by side separated by a thin grey rule. Left panel: a vertical amber wire with a small orange current arrow pointing upward, surrounded by concentric dim-orange circles drawn in perspective as ellipses in horizontal planes, closely spaced near the wire and further apart outside, each carrying a small arrowhead showing the sense. Right panel: a simplified right hand sketched in thin grey line art gripping a vertical wire, thumb extended upward along an orange current arrow and fingers curling round in the same sense as the field circles. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- General: $ B = \\frac{\\mu_0I}{4\\pi d}(\\sin\\theta_1+\\sin\\theta_2) $, angles from the perpendicular.\n- **Infinite** wire: $ B = \\frac{\\mu_0I}{2\\pi d} $. **Semi-infinite:** half that. **On the extension:** zero.\n- Falls as $ 1/d $, not $ 1/d^{2} $.\n- Direction: **right-hand grip** — thumb along the current, fingers give the field. Lines are concentric circles.\n- $ \\frac{\\mu_0}{2\\pi} = 2\\times10^{-7} $ is the constant to memorise.\n- Null point between parallel currents lies nearer the **smaller** current; for antiparallel currents it lies **outside**.',
    }),
    b('text', 13, {
      markdown: 'Next: bend that wire into a circle, and into an arc, and the same law gives two more results you will use constantly.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('The magnetic field at a perpendicular distance $ d $ from a long straight wire is proportional to',
          ['$ 1/d $', '$ 1/d^{2} $', '$ d $', '$ 1/d^{3} $'],
          0,
          '$ B = \\mu_0I/2\\pi d $. An inverse-square dependence would need a point-like source; an infinitely long wire is not one — exactly as an infinite line of charge gave $ 1/r $ rather than $ 1/r^{2} $ in Chapter 1.',
          1),
        q('The magnetic field lines around a long straight current-carrying wire are',
          ['concentric circles around the wire', 'radial straight lines away from the wire', 'straight lines parallel to the wire', 'ellipses lying in the plane of the wire'],
          0,
          'The Biot–Savart cross product puts the field perpendicular to both the wire and the line to the point, which makes the lines circle it. Radial lines would be the electric-field pattern of a charged wire, not the magnetic one.',
          2),
        q('The magnetic field at a point on the **extension** of a finite straight current-carrying wire is',
          ['zero', '$ \\mu_0I/4\\pi d $', '$ \\mu_0I/2\\pi d $', 'infinite'],
          0,
          'Every element of the wire has $ \\theta = 0 $ with respect to that point, so $ \\sin\\theta = 0 $ and each contributes nothing. This is a direct consequence of the cross product in the Biot–Savart law.',
          3),
      ],
    }),
  ],
};

// ── p11 · Loops and Arcs ─────────────────────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'loops-and-arcs',
  title: 'Loops and Arcs',
  subtitle: 'Bend the wire, and count the fraction of a circle',
  glossary: [],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'At the centre of a circular loop of radius $ R $ carrying current $ I $, every element of the wire is the **same distance** away, and every element is **perpendicular** to the line to the centre.\n\nWhat does that do to the Biot-Savart integral?',
      hint: 'Which quantities in $ dB = \\frac{\\mu_0}{4\\pi}\\frac{I\\,dl\\sin\\theta}{r^{2}} $ are now constant?',
      reveal: '**It removes almost all of it.**\n\nEvery element has $ r = R $ and $ \\theta = 90^\\circ $, so $ \\sin\\theta = 1 $. Nothing varies from element to element except $ dl $ itself, and every contribution points the **same** way — perpendicular to the loop\'s plane.\n\nSo there is no cancellation and nothing to vary:\n\n$ B = \\frac{\\mu_0I}{4\\pi R^{2}}\\displaystyle\\int dl = \\frac{\\mu_0I}{4\\pi R^{2}}(2\\pi R) = \\frac{\\mu_0I}{2R} $\n\nThe integral was just the circumference. That is the whole derivation.',
    }),
    b('latex_block', 1, {
      latex: 'B_{\\text{centre}} = \\frac{\\mu_0 I}{2R}',
      label: 'Field at the centre of a circular loop',
      note: 'Direction perpendicular to the plane of the loop, by the right-hand rule. For N turns, multiply by N.',
      highlight: true,
    }),
    b('text', 2, {
      markdown: 'And since the derivation only added up arc length, an **arc** subtending an angle $ \\theta $ at the centre contributes exactly the corresponding fraction of a full circle:',
    }),
    b('latex_block', 3, {
      latex: 'B_{\\text{arc}} = \\frac{\\mu_0 I\\theta}{4\\pi R} = \\left(\\frac{\\theta}{2\\pi}\\right)\\frac{\\mu_0 I}{2R}',
      label: 'Field at the centre of a circular arc',
      note: 'θ in RADIANS. The bracketed form says it plainly: take the fraction of the full circle that the arc represents.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: 'That second form is the one to think with. **Work out what fraction of a circle you have, and take that fraction of $ \\frac{\\mu_0I}{2R} $.**\n\n- Semicircle ($ \\theta = \\pi $): half, so $ \\frac{\\mu_0I}{4R} $\n- Quarter circle ($ \\theta = \\pi/2 $): a quarter, so $ \\frac{\\mu_0I}{8R} $\n- Three-quarter circle: $ \\frac{3\\mu_0I}{8R} $\n\nNo integration needed for any of them.\n\nAnd the companion fact from the last page completes the toolkit: **a straight segment whose line passes through the centre contributes nothing there**, because $ \\sin\\theta = 0 $ for every one of its elements. So in the very common exam figure of arcs joined by radial straight bits, **the straight bits can simply be ignored**.',
    }),
    b('step_solver', 5, {
      title: 'A composite loop: arcs and radial segments',
      problem: 'A wire carries current $ I $ along the following path: a quarter circle of radius $ a $, then a radial segment outwards, then a quarter circle of radius $ b $ in the same sense, then a radial segment back. Find the field at the common centre.',
      intro: 'Deal with each piece separately and add. Two of the four pieces contribute nothing at all.',
      steps: [
        st('Radial segments: $ B = 0 $',
          'Each radial piece lies along a line through the centre, so every element has $ \\sin\\theta = 0 $.', {
            check: {
              kind: 'mcq',
              prompt: 'Why do the radial segments contribute nothing at the centre?',
              options: ['They are too short', 'The angle between $ d\\vec{l} $ and $ \\hat{r} $ is zero for every element', 'Their currents cancel', 'They are too far from the centre'],
              answer_index: 1,
              feedback_right: 'Exactly — $ dB \\propto \\sin\\theta $, and $ \\theta = 0 $ along a radius.',
              feedback_wrong: 'A radial segment points straight at (or away from) the centre, so $ d\\vec{l} $ and $ \\hat{r} $ are parallel and the cross product vanishes. Their length and position are irrelevant.',
            },
          }),
        st('Inner quarter arc: $ B_a = \\frac{1}{4}\\cdot\\frac{\\mu_0I}{2a} = \\frac{\\mu_0I}{8a} $',
          'A quarter of a circle contributes a quarter of the full-loop field at its own radius.'),
        st('Outer quarter arc: $ B_b = \\frac{\\mu_0I}{8b} $',
          'The same fraction, but at the larger radius — so a smaller field.', {
            check: {
              kind: 'mcq',
              prompt: 'The two arcs are traversed in the same rotational sense. Do their fields add or oppose at the centre?',
              options: ['They add', 'They oppose', 'It depends on the radii', 'Neither — they are perpendicular'],
              answer_index: 0,
              feedback_right: 'Right — same sense of circulation means the same field direction by the right-hand rule, so they add.',
              feedback_wrong: 'The direction of an arc\'s field at the centre depends only on the sense of circulation, not on the radius. Same sense → same direction → they add.',
            },
          }),
        st('$ B = \\frac{\\mu_0I}{8a} + \\frac{\\mu_0I}{8b} = \\frac{\\mu_0I}{8}\\left(\\frac{1}{a}+\\frac{1}{b}\\right) $',
          'Both arcs circulate the same way, so their fields are in the same direction and simply add.'),
      ],
      now_you_try: {
        problem: 'What would the answer be if the outer arc were traversed in the **opposite** sense?',
        answer: '$ B = \\frac{\\mu_0I}{8}\\left(\\frac{1}{a}-\\frac{1}{b}\\right) $, directed as the inner arc.',
        solution: 'Reversing the sense of circulation reverses the direction of that arc\'s field at the centre, so the two now **subtract**.\n\nSince $ a < b $, the inner arc gives the larger contribution and wins, so the net field points the way the inner arc dictates.\n\n**Always establish the sense of circulation for each piece before adding.** It is the only thing that decides whether contributions add or cancel.',
      },
    }),
    b('heading', 6, {
      text: 'On the axis of a loop',
      level: 2,
      objective: 'State the axial field of a loop and recognise the dipole form far away.',
    }),
    b('text', 7, {
      markdown: 'Move off the centre, along the axis, a distance $ x $. The derivation now needs the symmetry argument from Chapter 1\'s charged ring — every element\'s field has a component along the axis and one perpendicular to it, and the perpendicular ones cancel in pairs. What survives is',
    }),
    b('latex_block', 8, {
      latex: 'B_{\\text{axis}} = \\frac{\\mu_0 I R^{2}}{2\\left(R^{2}+x^{2}\\right)^{3/2}}',
      label: 'Field on the axis of a circular loop',
      note: 'For N turns, multiply by N. Put x = 0 and it reduces to μ₀I/2R, as it must.',
      highlight: true,
    }),
    b('text', 9, {
      markdown: 'Two checks, and one payoff.\n\n**At the centre** ($ x = 0 $): the denominator becomes $ 2R^{3} $, giving $ \\frac{\\mu_0I}{2R} $ ✓ — consistent with the direct result.\n\n**Far away** ($ x \\gg R $): the $ R^{2} $ is negligible, so the denominator becomes $ 2x^{3} $ and\n\n$ B \\approx \\frac{\\mu_0 IR^{2}}{2x^{3}} = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{2(I\\pi R^{2})}{x^{3}} = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{2m}{x^{3}} $\n\nwith $ m = I\\pi R^{2} = IA $.\n\n**Look at what that is.** It is exactly the axial field of a **magnetic dipole** from Chapter 4 — same $ 1/x^{3} $, same factor of 2, same constant. So a current loop seen from far away is indistinguishable from a bar magnet of moment $ IA $.\n\nThat is the promise from Chapter 4, now half paid: we have shown $ m = IA $ produces the right **field**. Page 14 completes it by showing the same $ m $ gives the right **torque**.',
    }),
    b('image', 10, {
      src: '',
      alt: 'Field at the centre of a full loop, a semicircle and a quarter circle, plus the axial field of a loop',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Take the fraction of the circle you have. Off-axis, the loop looks like a dipole from far away.',
      generation_prompt: 'Clean scientific diagram on a near-black background (#0B0C0F), four panels in a row separated by thin grey rules, in thin dim-grey line art with wires in warm amber. Panel 1: a full circular loop with a small orange current arrow and a bold orange field arrow out of the plane at its centre, labelled full. Panel 2: a semicircular arc with the same current arrow and a shorter field arrow at the centre, labelled half. Panel 3: a quarter arc joined by two radial straight segments, with an even shorter field arrow at the centre and small crossed-out marks on the radial segments, labelled quarter. Panel 4: a loop seen edge-on with dim-orange field lines looping through and around it, becoming a recognisable dipole pattern at a distance, with a bold arrow along the axis labelled B axial. Muted white minimal labels, generous dark space.',
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Centre of a loop: $ B = \\frac{\\mu_0I}{2R} $. For $ N $ turns, $ \\frac{\\mu_0NI}{2R} $.\n- Arc: take the **fraction of the circle** — $ \\left(\\frac{\\theta}{2\\pi}\\right)\\frac{\\mu_0I}{2R} $, with $ \\theta $ in radians.\n- Semicircle → $ \\frac{\\mu_0I}{4R} $. Quarter → $ \\frac{\\mu_0I}{8R} $.\n- **Radial straight segments contribute nothing** at the centre. Ignore them.\n- Same sense of circulation → fields add. Opposite → subtract.\n- On the axis: $ B = \\frac{\\mu_0IR^{2}}{2(R^{2}+x^{2})^{3/2}} $, which for $ x \\gg R $ becomes the dipole field with $ m = IA $.',
    }),
    b('text', 12, {
      markdown: 'Next: Biot-Savart always works but is often laborious. There is a shortcut for symmetric cases — and it is the magnetic twin of Gauss\'s law.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The magnetic field at the centre of a circular loop of radius $ R $ carrying current $ I $ is',
          ['$ \\frac{\\mu_0I}{2R} $', '$ \\frac{\\mu_0I}{2\\pi R} $', '$ \\frac{\\mu_0I}{4\\pi R} $', '$ \\frac{\\mu_0I}{R} $'],
          0,
          'Every element is the same distance $ R $ away and perpendicular to the line to the centre, so the integral reduces to the circumference. The option with $ 2\\pi R $ is the long-straight-wire result, a different geometry entirely.',
          1),
        q('A wire is bent into a semicircle of radius $ R $. The field at its centre is',
          ['$ \\frac{\\mu_0I}{4R} $', '$ \\frac{\\mu_0I}{2R} $', '$ \\frac{\\mu_0I}{8R} $', 'zero'],
          0,
          'A semicircle is half a circle, so it gives half the full-loop field. The straight diameter joining its ends, if present, would contribute nothing at the centre since it lies along a radius.',
          2),
        q('A straight segment of wire lies along a line passing through a point P. Its contribution to the field at P is',
          ['zero', 'maximum', '$ \\mu_0I/4\\pi d $', 'perpendicular to the wire'],
          0,
          'Every element of it has $ d\\vec{l} $ parallel to $ \\hat{r} $, so $ \\sin\\theta = 0 $ and the cross product vanishes. This is why radial segments in a composite loop can be ignored at the centre.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p7, p8, p9, p10, p11]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
