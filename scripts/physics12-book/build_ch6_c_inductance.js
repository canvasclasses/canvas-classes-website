'use strict';
/**
 * Class 12 Physics · Ch.6 "Electromagnetic Induction" — pages 10–15.
 *
 * The inductance block and the chapter's payoff:
 *   p10 Self-Inductance          — a coil induces an EMF in itself; L of a solenoid
 *   p11 Mutual Inductance        — one coil talking to another; M12 = M21; coupling
 *   p12 Energy Stored in an Inductor — U = ½Li², u = B²/2μ₀, set beside Ch.2's ½ε₀E²
 *   p13 The L-R Circuit          — growth, decay, τ = L/R; the C-R mirror (Ch.2 p16)
 *   p14 The Induced Electric Field — non-conservative E; every block tier:'competitive'
 *   p15 The AC Generator         — ε = ε₀ sin ωt; the bridge into Chapter 7
 *
 * SIGN CONVENTION (fixed on p2 of this chapter, not re-opened here): flux is
 * positive along the chosen normal, and Faraday's law reads ε = −N dΦ/dt. The
 * minus in ε = −L di/dt is that same minus, and the pages say so.
 *
 * Run: node scripts/physics12-book/build_ch6_c_inductance.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 6;

// ── p10 · Self-Inductance ────────────────────────────────────────────────────
const p10 = {
  page_number: 10,
  slug: 'emi-self-inductance',
  title: 'Self-Inductance',
  subtitle: 'A coil that argues with its own current',
  glossary: [
    { term: 'self-inductance', definition: 'The constant $ L $ that links a coil\'s own flux linkage to its own current: $ N\\Phi = Li $. It depends on the coil\'s shape and its core, never on the current.' },
    { term: 'henry', definition: 'The SI unit of inductance. A coil has an inductance of one henry if a current changing at one ampere per second induces one volt across it.' },
    { term: 'back-EMF', definition: 'The self-induced EMF in a coil, which always opposes the change in that coil\'s own current.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A coil is lying alone on the bench. No magnet anywhere near it. No second coil. Nothing is moving.\n\nYou simply close a switch and let a current start to grow in it — and an EMF appears in that same coil, pushing back against you.\n\nEverything so far in this chapter needed a **changing flux**. Where is the changing flux coming from here?',
      hint: 'The coil is carrying the current. What does a current-carrying coil produce?',
      reveal: 'From the coil itself.\n\nA current in a coil makes a magnetic field (Chapter 5). That field passes straight through the coil\'s own turns, so the coil has a flux through it — a flux that **it made**.\n\nChange the current and that flux changes. Faraday\'s law does not ask where the flux came from, so an EMF is induced. And by Lenz\'s law it opposes the change that produced it: switch on and the coil resists the current growing; switch off and it resists the current dying.\n\nThis is **self-induction**. It is the reason eddy currents were the last page of "induction from outside" and this is the first page of "induction from inside".',
    }),
    b('text', 1, {
      markdown: 'Take a coil of $ N $ turns carrying a current $ i $. The field it makes is proportional to $ i $ everywhere — double the current and you double the field at every point, because Biot-Savart is linear in $ i $.\n\nSo the flux through each turn is proportional to $ i $, and the total **flux linkage** $ N\\Phi $ is too. Write the constant of proportionality as $ L $:',
    }),
    b('latex_block', 2, {
      latex: 'N\\Phi = L\\,i \\qquad\\Longrightarrow\\qquad L = \\frac{N\\Phi}{i}',
      label: 'Definition of self-inductance',
      note: 'L is fixed by the coil: its number of turns, its size and shape, and what is inside it. It does NOT depend on the current — i appears on both sides and cancels out.',
      highlight: true,
    }),
    b('latex_block', 3, {
      latex: '\\varepsilon = -L\\,\\frac{di}{dt}',
      label: 'The self-induced EMF',
      note: 'This minus sign is not a new one. It is exactly the minus of Faraday-Lenz, carried through the substitution — the coil opposes the CHANGE in its own current.',
      highlight: true,
    }),
    b('text', 4, {
      markdown: '**Where that came from.** Faraday\'s law for this coil, in the sign convention fixed earlier in the chapter, is $ \\varepsilon = -N\\frac{d\\Phi}{dt} $. Substitute $ N\\Phi = Li $ and differentiate, remembering that $ L $ is a constant: the $ N\\Phi $ becomes $ L\\frac{di}{dt} $ and nothing else changes, which is why the minus survives untouched.\n\nNow read that minus sign carefully, because it is the whole behaviour of the page.\n\n**Current increasing** ($ di/dt > 0 $) → the induced EMF is negative, i.e. it acts *against* the applied EMF. The coil is holding the current back.\n\n**Current decreasing** ($ di/dt < 0 $) → the induced EMF is positive, acting *with* the current. The coil is trying to keep the current going.\n\nEither way, the coil opposes the change, never the current itself. A steady current in an ideal coil produces no EMF at all — $ di/dt = 0 $, so $ \\varepsilon = 0 $, and the coil is just a piece of wire.\n\nThe unit follows from the equation. One **henry** is the inductance for which a current changing at one ampere per second induces one volt:\n\n$ 1\\ \\text{H} = 1\\ \\frac{\\text{V}\\cdot\\text{s}}{\\text{A}} = 1\\ \\frac{\\text{Wb}}{\\text{A}} $\n\nThe henry is a large unit. A small air-cored coil is microhenries; a typical laboratory inductor is millihenries; an iron-cored choke of a few henries is already a heavy object.',
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'logical',
      prompt: 'A steady current of $ 5 $ A has been flowing through an ideal inductor for a long time. What is the EMF across it?',
      options: [
        'Zero, because the current is not changing',
        'Five times the inductance',
        'Large, because the current is large',
        'Equal and opposite to the battery EMF',
      ],
      reveal: '**Zero.**\n\n$ \\varepsilon = -L\\frac{di}{dt} $, and a steady current has $ di/dt = 0 $. It does not matter that the current is 5 A rather than 0.005 A — the size of the current is simply not in the formula.\n\nThis is the single most common misreading of self-inductance: treating the coil as though it opposes **current**. It does not. It opposes **change in current**. An ideal inductor carrying a steady current is electrically indistinguishable from a plain wire.\n\n**And notice what would make the EMF large:** not a big current, but a fast-changing one. A current of only $ 0.1 $ A switched off in a microsecond gives $ di/dt = 10^{5} $ A/s, which across a $ 1 $ H coil is a hundred thousand volts. That number is not a trick — it is the spark you will meet on the L-R page.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'The inductance of a long solenoid',
      level: 2,
      objective: 'Derive $ L = \\mu_0 n^{2}Al $ from the definition, and say what each symbol controls.',
    }),
    b('step_solver', 7, {
      title: 'Deriving L for a long solenoid',
      problem: 'A long solenoid of length $ l $ and cross-sectional area $ A $ has $ n $ turns per unit length, so $ N = nl $ turns in total. Find its self-inductance.',
      intro: 'Every self-inductance calculation in this book follows the same four moves: assume a current, find the field, find the total flux linkage, then divide by the current. The method is the lesson here — the answer for a solenoid is only one application of it.',
      steps: [
        st('Assume a current $ i $ flows. Inside a long solenoid, $ B = \\mu_0 n i $',
          'This is the Ampere\'s-law result from Chapter 5. The field is uniform inside and effectively zero outside, which is exactly why the long solenoid is the easy case.', {
            check: {
              kind: 'mcq',
              prompt: 'The field inside a long solenoid depends on the turns per unit length $ n $. Does it depend on the solenoid\'s radius?',
              options: ['No — only on $ n $ and $ i $', 'Yes — it grows with radius', 'Yes — it falls with radius', 'Only if a core is present'],
              answer_index: 0,
              feedback_right: 'Correct. $ B = \\mu_0 n i $ contains no area term at all. The radius will enter later, through the flux, not through the field.',
              feedback_wrong: '$ B = \\mu_0 n i $ has no radius in it. A fat solenoid and a thin one with the same turns per metre have the same internal field — the fat one simply has more area for that field to pass through.',
            },
          }),
        st('Flux through **one** turn: $ \\Phi = BA = \\mu_0 n i A $',
          'The field is uniform and perpendicular to the turn, so the flux is just field times area. Here is where the cross-section finally matters.'),
        st('Total flux linkage: $ N\\Phi = (nl)(\\mu_0 n i A) = \\mu_0 n^{2} A l\\, i $',
          'Every one of the $ N = nl $ turns carries the same flux, so multiply. Note that $ n $ has now appeared twice — once from the field, once from the turn count.', {
            check: {
              kind: 'fill_blank',
              prompt: 'What power of $ n $ appears in the total flux linkage?',
              blank_answer: '2',
              feedback_right: 'Yes. One factor of $ n $ comes from the field $ \\mu_0 n i $, and a second from counting $ N = nl $ turns.',
              feedback_wrong: 'Two. The field carries one factor of $ n $, and multiplying by the number of turns $ N = nl $ carries a second — so the linkage goes as $ n^{2} $.',
            },
          }),
        st('Divide by the current: $ L = \\frac{N\\Phi}{i} = \\mu_0 n^{2} A l $',
          'The current cancels, exactly as the definition promised it would. What is left contains only geometry and a constant of nature.'),
      ],
      now_you_try: {
        problem: 'A solenoid $ 0.50 $ m long with a cross-sectional area of $ 4.0\\ \\text{cm}^{2} $ has $ 1000 $ turns. Find its inductance. Take $ \\mu_0 = 4\\pi\\times10^{-7} $ SI units.',
        answer: 'About $ 0.25 $ mH',
        solution: 'Turns per unit length: $ n = 1000/0.50 = 2000 $ per metre, and $ A = 4.0\\times10^{-4}\\ \\text{m}^{2} $.\n\n$ L = \\mu_0 n^{2} A l = (4\\pi\\times10^{-7})(2000)^{2}(4.0\\times10^{-4})(0.50) $\n\n$ = (1.257\\times10^{-6})(4.0\\times10^{6})(4.0\\times10^{-4})(0.50) = 2.5\\times10^{-4}\\ \\text{H} $\n\nAbout $ 0.25 $ mH — which tells you how hard inductance is to come by with air inside. Slide an iron core in and the same coil can reach a few henries.',
      },
    }),
    b('latex_block', 8, {
      latex: 'L = \\mu_0 n^{2} A l = \\frac{\\mu_0 N^{2} A}{l}',
      label: 'Self-inductance of a long solenoid',
      note: 'The two forms are the same thing, written with turns-per-metre or with total turns. With a core of relative permeability mu-r, multiply by mu-r.',
      highlight: true,
    }),
    b('text', 9, {
      markdown: 'Three things that formula tells you, none of them obvious before the derivation:\n\n**It goes as the square of the turns.** Double the number of turns on the same former and you get **four** times the inductance, not twice. That is why inductors are wound with so many turns of thin wire — turns are the cheapest thing to buy in this formula.\n\n**Only geometry and the core appear.** No current, no voltage, no frequency. $ L $ is a property of the object, in exactly the way $ C = \\varepsilon_0A/d $ was a property of a capacitor in Chapter 2.\n\n**A core multiplies it.** Replace the air with iron of relative permeability $ \\mu_r $ and $ L $ becomes $ \\mu_r\\mu_0n^{2}Al $. Since $ \\mu_r $ for soft iron runs into the thousands, this is how a coil small enough to hold gets an inductance of several henries.',
    }),
    b('heading', 10, {
      text: 'Inductance is electrical inertia',
      level: 2,
      objective: 'Use the mass-and-velocity analogy to predict how a circuit with a large $ L $ behaves.',
    }),
    b('text', 11, {
      markdown: 'Push a heavy trolley and it does not leap to speed — it takes time. Stop pushing and it does not stop dead — it takes time. That reluctance to change velocity is **inertia**, and it is measured by the mass.\n\nAn inductor does the same thing to current. Apply a voltage and the current does not leap to its final value. Cut the supply and the current does not stop dead. The reluctance to change current is measured by $ L $.\n\nThe parallel is not loose. It is line-for-line:',
    }),
    b('table', 12, {
      caption: 'Mass is to velocity what inductance is to current. Every row is an exact correspondence, not an illustration.',
      headers: ['Mechanics', 'Circuit'],
      rows: [
        ['mass $ m $', 'inductance $ L $'],
        ['velocity $ v $', 'current $ i $'],
        ['force $ F = m\\frac{dv}{dt} $', 'EMF $ \\varepsilon = L\\frac{di}{dt} $'],
        ['kinetic energy $ \\frac{1}{2}mv^{2} $', 'stored energy $ \\frac{1}{2}Li^{2} $'],
        ['a heavy body takes time to start or stop', 'a large $ L $ takes time to let current start or stop'],
        ['inertia does not oppose motion, only change in it', '$ L $ does not oppose current, only change in it'],
      ],
    }),
    b('image', 13, {
      src: '',
      alt: 'A solenoid carrying a growing current, with its own field lines threading back through its turns and an opposing induced EMF',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The coil\'s own field passes through the coil. Change the current and the coil pushes back on itself.',
      generation_prompt: 'Clean scientific diagram, side view of a helical solenoid drawn as a row of evenly spaced amber elliptical turns along a horizontal axis. Smooth dim-orange magnetic field lines run through the interior of the coil parallel to the axis and loop widely around the outside, clearly passing back through the turns themselves. A bright amber arrow along the winding shows a growing current, and a shorter opposing arrow of a cooler blue tone points the other way to suggest the self-induced EMF resisting it. Thin dim-grey dashed axis line. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ N\\Phi = Li $ defines $ L $; the current cancels, so $ L $ is pure geometry plus the core.\n- $ \\varepsilon = -L\\frac{di}{dt} $ — and that minus is the same Faraday-Lenz minus, not a new one.\n- A coil opposes **change in current**, never current. Steady current → zero EMF.\n- $ 1\\ \\text{H} = 1\\ \\text{Wb/A} = 1\\ \\text{V}\\cdot\\text{s/A} $.\n- Long solenoid: $ L = \\mu_0 n^{2} A l = \\mu_0 N^{2}A/l $. Turns enter **squared**.\n- An iron core multiplies $ L $ by $ \\mu_r $ — thousands, for soft iron.\n- Think of $ L $ as electrical inertia: $ L\\leftrightarrow m $, $ i\\leftrightarrow v $.',
    }),
    b('text', 15, {
      markdown: 'Next: the coil\'s field does not stop at its own turns. Put a second coil nearby and it will feel the change too — which is one coil talking to another.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('The self-inductance of a coil depends on',
          ['its geometry and its core material', 'the current flowing through it', 'the rate at which the current changes', 'the EMF applied across it'],
          0,
          '$ L = N\\Phi/i $ — the current appears in both the flux and the denominator and cancels out. What is left is turns, size, shape and what is inside the coil.',
          2),
        q('If the number of turns on a solenoid is doubled while its length and area are unchanged, its inductance becomes',
          ['four times larger', 'twice as large', 'half as large', 'a quarter as large'],
          0,
          '$ L = \\mu_0N^{2}A/l $, so $ L $ goes as the square of the turns. This is why inductors are wound with many turns of fine wire rather than few turns of thick wire.',
          2),
        q('A current through an inductor is held perfectly steady. The self-induced EMF is',
          ['zero', 'maximum', 'equal to $ Li $', 'equal to $ L/i $'],
          0,
          '$ \\varepsilon = -L\\,di/dt $ and $ di/dt = 0 $ for a steady current, whatever its size. An ideal inductor carrying a steady current behaves as an ordinary wire.',
          1),
      ],
    }),
  ],
};

// ── p11 · Mutual Inductance ──────────────────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'emi-mutual-inductance',
  title: 'Mutual Inductance',
  subtitle: 'One coil talking to another — and a symmetry nobody expects',
  glossary: [
    { term: 'mutual inductance', definition: 'The constant $ M $ linking the flux through one coil to the current in another: $ N_2\\Phi_2 = M i_1 $. Measured in henry.' },
    { term: 'coefficient of coupling', definition: 'The fraction $ k = M/\\sqrt{L_1L_2} $, between $ 0 $ and $ 1 $, saying how much of one coil\'s flux actually reaches the other.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Put your phone on a wireless charging pad. No metal touches metal — there is a plastic shell in between, and often a millimetre of air.\n\nYet energy crosses that gap at fifteen watts.\n\nNothing on this page is new physics. Which two ideas from the last three pages are being used?',
      hint: 'One coil makes a changing field. What is the other coil doing in that field?',
      reveal: 'A coil in the pad carries an **alternating current**, so it makes a **changing magnetic field** (Chapter 5, plus the fact that the current changes).\n\nA second coil inside the phone sits in that changing field. Its flux changes, so by Faraday\'s law an EMF is induced in it — and that EMF drives the charging current.\n\nOne coil, changing its current, inducing an EMF in another coil that it never touches. That is **mutual induction**, and the constant that measures how strongly the two are linked is what this page is about.',
    }),
    b('text', 1, {
      markdown: 'Two coils sit near each other. Coil 1 carries a current $ i_1 $ and makes a field; some of that field passes through coil 2.\n\nThe argument is exactly the one from the last page. The field is proportional to $ i_1 $, so the flux through coil 2 is proportional to $ i_1 $, so the flux linkage of coil 2 is proportional to $ i_1 $. Call the constant $ M $:\n\n$ N_2\\Phi_2 = M\\,i_1 $\n\nAnd differentiating, with the same Faraday-Lenz minus sign as before:',
    }),
    b('latex_block', 2, {
      latex: '\\varepsilon_2 = -M\\,\\frac{di_1}{dt}',
      label: 'EMF induced in coil 2 by a changing current in coil 1',
      note: 'M is measured in henry, exactly like L. Same unit, same shape of equation — only the two coils are different objects.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'What does $ M $ depend on? The same kind of things $ L $ did, plus one more:\n\n- the **size and shape** of each coil, and how many turns each has;\n- what is **between and inside** them — an iron core linking both raises $ M $ enormously;\n- and crucially, their **relative position and orientation**. Slide the coils apart and $ M $ falls. Turn one through a right angle so that the first coil\'s field runs *along* the plane of the second, and $ M $ drops close to zero.\n\nWhat $ M $ does **not** depend on is the current, or how fast it is changing. Like $ L $, it is a property of the arrangement.',
    }),
    b('heading', 4, {
      text: 'Mutual inductance of two coaxial solenoids',
      level: 2,
      objective: 'Derive $ M $ for the standard two-solenoid arrangement and identify which radius enters.',
    }),
    b('step_solver', 5, {
      title: 'Two long solenoids, one inside the other',
      problem: 'A long solenoid of length $ l $, radius $ r_1 $ and $ n_1 $ turns per unit length is wound closely inside a second solenoid of the same length, radius $ r_2 > r_1 $, with $ n_2 $ turns per unit length. Find their mutual inductance.',
      intro: 'The method is the same four moves as for self-inductance — assume a current, find the field, find the flux linkage of the OTHER coil, divide. The only new decision is which coil to drive, and that decision turns out to matter less than it looks.',
      steps: [
        st('Drive the **outer** coil: pass a current $ i_2 $ through it. Inside it, $ B = \\mu_0 n_2 i_2 $',
          'Driving the outer coil first is the easy route, because its field fills the whole interior uniformly — including all of the inner coil.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is it easier to start with a current in the OUTER solenoid?',
              options: [
                'Its field is uniform across the whole of the inner coil',
                'It has more turns, so its field is stronger',
                'Its radius is larger, so the flux is larger',
                'The inner coil has no field of its own',
              ],
              answer_index: 0,
              feedback_right: 'Exactly. Every turn of the inner coil sits in the same uniform field, so the flux per turn is a single easy product.',
              feedback_wrong: 'It is about uniformity, not strength. The outer solenoid\'s field fills its whole interior evenly, so every turn of the inner coil sees the same field and the flux per turn is one simple product.',
            },
          }),
        st('Flux through one turn of the **inner** coil: $ \\Phi_1 = B\\,\\pi r_1^{2} = \\mu_0 n_2 i_2 \\pi r_1^{2} $',
          'The area that matters is the INNER coil\'s cross-section, because that is the loop we are computing the flux through. The outer radius plays no part.'),
        st('Inner coil has $ N_1 = n_1 l $ turns, so $ N_1\\Phi_1 = \\mu_0 n_1 n_2 \\pi r_1^{2} l \\, i_2 $',
          'Multiply by the number of turns to get the flux linkage, then divide by $ i_2 $ to read off $ M $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Which radius appears in the answer — the inner one or the outer one? Write "inner" or "outer".',
              blank_answer: 'inner',
              feedback_right: 'Yes. The flux is computed through the inner coil\'s area, so only $ r_1 $ survives.',
              feedback_wrong: 'The inner one. We computed the flux through the inner coil\'s own cross-section, so only $ r_1 $ appears — the outer radius never entered the calculation.',
            },
          }),
        st('Now drive the **inner** coil instead, with $ i_1 $. Its field $ \\mu_0 n_1 i_1 $ exists only inside radius $ r_1 $, and is effectively zero outside it',
          'This direction is harder, because each turn of the outer coil encloses a region that is only partly filled with field. But the flux through one outer turn is still $ \\mu_0 n_1 i_1 \\pi r_1^{2} $ — the field-free ring between $ r_1 $ and $ r_2 $ contributes nothing.'),
        st('Outer coil has $ N_2 = n_2 l $ turns, so $ N_2\\Phi_2 = \\mu_0 n_1 n_2 \\pi r_1^{2} l \\, i_1 $ — the same constant',
          'Two different calculations, of two different difficulties, giving one identical constant. That is not a coincidence, and the next section says why.'),
      ],
    }),
    b('latex_block', 6, {
      latex: 'M = \\mu_0 n_1 n_2 \\pi r_1^{2}\\, l = \\frac{\\mu_0 N_1 N_2 A_1}{l}',
      label: 'Mutual inductance of two coaxial solenoids',
      note: 'A-one is the cross-sectional area of the INNER coil. The outer radius never appears — only the smaller coil sets how much flux the pair can share.',
      highlight: true,
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'spatial',
      prompt: 'Two flat coils lie face to face, a few centimetres apart, with a large mutual inductance. One of them is now rotated through $ 90^\\circ $, so that its plane is perpendicular to the other\'s. What happens to $ M $?',
      options: [
        'It falls almost to zero',
        'It is unchanged, since neither coil moved further away',
        'It doubles, since the coils are now at right angles',
        'It becomes negative',
      ],
      reveal: '**It falls almost to zero.**\n\nFace to face, the first coil\'s field lines pass straight through the second coil, so the flux linkage is large. Turn the second coil through a right angle and those same field lines now run *along* its plane — they graze past it instead of threading through it. Flux through a loop is $ BA\\cos\\theta $, and $ \\cos 90^\\circ = 0 $.\n\nNo flux linkage means no mutual inductance, whatever the currents are doing.\n\n**This is a practical fact, not a curiosity.** It is exactly how sensitive circuits are protected from a noisy neighbour on the same board: you do not always have to move the coils apart, you can simply turn one of them. And it is why a wireless charger stops working when the phone is not lying flat on the pad.',
      difficulty_level: 2,
    }),
    b('heading', 8, {
      text: 'Reciprocity, and how much flux actually gets across',
      level: 2,
      objective: 'State $ M_{12} = M_{21} $, then use the coefficient of coupling to say how much of one coil\'s flux reaches the other.',
    }),
    b('text', 9, {
      markdown: 'In the derivation, driving the outer coil and driving the inner coil gave the **same** constant. Write the two possible mutual inductances separately for a moment:\n\n- $ M_{12} $ — flux linkage of coil 1 per unit current in coil 2;\n- $ M_{21} $ — flux linkage of coil 2 per unit current in coil 1.\n\nThese are computed from different fields, over different areas, with different numbers of turns. There is no reason at first sight for them to be equal. And yet:\n\n$ M_{12} = M_{21} = M $\n\n**This is a theorem, and it is true for any two circuits whatever** — not just for neat coaxial solenoids. It holds for a tiny loop beside a giant one, for a coil next to a straight wire, for two circuits of completely different shape.\n\nBe honest about what this page has and has not shown. We **verified** it in one case; we did not **prove** it. The proof needs an energy argument beyond this book: the energy stored in the pair of circuits cannot depend on the order in which you switch the two currents on, and working that out forces the two constants to be equal.\n\nWhat matters practically is the licence it gives you: **compute $ M $ whichever way round is easier.** In the solenoid problem, driving the outer coil took two lines and driving the inner one needed a careful argument about field-free space. Both give the same $ M $, so always pick the easy direction.\n\n**Now the second question: how much of coil 1\'s flux actually gets across to coil 2?**\n\nCoil 1 makes flux. Some of it reaches coil 2; the rest leaks away into the air. A single number measures the fraction that gets across, and it is built from the three inductances of the arrangement:\n\n$ k = \\frac{M}{\\sqrt{L_1L_2}}, \\qquad 0 \\le k \\le 1 $\n\n$ k = 1 $ is **perfect coupling** — every field line from one coil passes through the other. $ k $ near zero means the coils barely notice each other.\n\nOur two solenoids make this concrete. With $ L_1 = \\mu_0 n_1^{2}\\pi r_1^{2}l $ and $ L_2 = \\mu_0 n_2^{2}\\pi r_2^{2}l $:\n\n$ \\sqrt{L_1L_2} = \\mu_0 n_1 n_2 \\pi r_1 r_2 l $\n\nand dividing $ M $ by it, almost everything cancels:\n\n$ k = \\frac{r_1}{r_2} $\n\nA beautifully readable answer. Coupling is just the ratio of the radii. Wind the inner coil tightly inside the outer one and $ r_1 \\to r_2 $, so $ k \\to 1 $. Leave a big gap and most of the outer coil\'s cross-section is wasted on field that never meets the inner winding.\n\nThat is precisely why a transformer\'s two windings are wound **on the same iron core**, often one directly over the other: the core carries essentially all of the flux from one winding to the other, pushing $ k $ above $ 0.99 $. Chapter 7 will need that number.',
    }),
    b('worked_example', 10, {
      label: 'turning M and a rate of change into an actual voltage',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A pair of adjacent coils has a mutual inductance of $ 1.5 $ H. The current in coil 1 is raised steadily from $ 0 $ to $ 20 $ A in $ 0.50 $ s. Find (a) the change in the flux linkage of coil 2, (b) the average EMF induced in coil 2 and which way it acts, and (c) the flux through a single turn of coil 2 if it has $ 500 $ turns. Then (d) the roles are swapped and the same current change is made in coil 2 instead — what EMF appears in coil 1? And (e) what would the EMF be if the same $ 0 $ to $ 20 $ A change happened in $ 5.0 $ ms?',
      solution: '**(a) The change in flux linkage.**\n\nThe defining relation is $ N_2\\Phi_2 = M i_1 $, and $ M $ is a constant of the arrangement — nothing about the coils moved. So the change in flux linkage is just $ M $ times the change in current:\n\n$ \\Delta(N_2\\Phi_2) = M\\,\\Delta i_1 = (1.5)(20) = 30\\ \\text{Wb} $\n\nBe careful with the words here. This is a **flux linkage**, the flux added up over all the turns, which is why the number is so large. It is not the flux through one turn — that is part (c).\n\n**(b) The average EMF.**\n\nThe current rises steadily, so $ \\frac{di_1}{dt} $ is the same throughout and equals the average:\n\n$ \\frac{di_1}{dt} = \\frac{20 - 0}{0.50} = 40\\ \\text{A/s} $\n\n$ \\varepsilon_2 = -M\\frac{di_1}{dt} = -(1.5)(40) = -60\\ \\text{V} $\n\nSo the magnitude is $ 60 $ V. The same answer comes straight from part (a) as $ \\frac{\\Delta(N_2\\Phi_2)}{\\Delta t} = \\frac{30}{0.50} = 60 $ V, which is a useful check.\n\n**What the minus sign is doing.** It is the same Faraday-Lenz minus this chapter fixed at the start, not a new one. Flux is measured positive along the chosen normal to coil 2; while $ i_1 $ is rising, $ \\Phi_2 $ is growing along that normal, so the induced EMF drives a current in coil 2 whose own flux points **against** the growth.\n\nAnd note when the EMF is zero. Once $ i_1 $ settles at a steady $ 20 $ A, $ \\frac{di_1}{dt} = 0 $ and $ \\varepsilon_2 = 0 $ — even though the flux linkage is then at its **largest**. Big flux and big EMF are different things, and this is the single most common slip on this topic.\n\n**(c) The flux through one turn.**\n\n$ \\Phi_2 = \\frac{N_2\\Phi_2}{N_2} = \\frac{30}{500} = 0.060\\ \\text{Wb} $\n\nSixty milliweber through each turn, five hundred turns, thirty weber of linkage. The two numbers differ by a factor of $ N_2 $ and by nothing else.\n\n**(d) Swapping the roles.**\n\nThis is where the reciprocity theorem earns its keep. $ M_{21} = M_{12} = 1.5 $ H, so the same rate of change in coil 2 induces the **same $ 60 $ V** in coil 1 — even if coil 1 is a completely different size with a completely different number of turns. You do not need to know anything more about the coils to answer this.\n\n**(e) The same change, a hundred times faster.**\n\n$ \\frac{di_1}{dt} = \\frac{20}{5.0\\times10^{-3}} = 4000\\ \\text{A/s} \\qquad\\Rightarrow\\qquad |\\varepsilon_2| = (1.5)(4000) = 6000\\ \\text{V} $\n\nNothing about the coils changed. Only the clock did — and the EMF went up a hundredfold with it. That is why interrupting a current in a coupled pair is genuinely dangerous, and it is the same effect that produces the spark you will meet two pages from now.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Two coaxial solenoids, the inner one wound inside the outer, with field lines from the outer coil threading through both',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Only the inner coil\'s cross-section shares flux. The ring of space outside it contributes nothing to $ M $.',
      generation_prompt: 'Clean scientific diagram, cutaway side view of two concentric helical solenoids sharing one horizontal axis: a narrow inner coil drawn as tight bright amber elliptical turns, and a wider outer coil drawn as larger dimmer amber turns around it, both the same length. Straight dim-orange field lines fill the whole interior of the outer coil, with the subset passing through the inner coil drawn noticeably brighter to show the shared flux, and the annular region between the two coils tinted a very faint cool grey to suggest wasted flux. Thin dim-grey dashed centre axis. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'A **hospital cochlear implant** is mutual inductance solving a problem nothing else can.\n\nPart of the device sits under the skin, next to the inner ear. It needs power and it needs a signal, continuously, for years. A wire through the skin would be a permanent open wound and a permanent infection route.\n\nSo there is no wire. A coil outside the head, held in place by a small magnet, carries an alternating current. A matching coil implanted just under the skin picks up the changing flux. Power crosses a few millimetres of living tissue by induction alone, and the audio signal rides across the same link.\n\nThe engineering challenge is the whole content of this page: keep the two coils **coaxial and close**, because $ M $ collapses as they separate or tilt. That is exactly why the external part is held on by a magnet rather than a strap — the magnet is not holding the device on, it is holding $ k $ up.',
      image_prompt: 'Clean scientific illustration, side profile silhouette of a human head drawn as a thin dim-grey outline. Two small flat spiral coils drawn in bright amber sit facing each other on either side of a thin grey line representing the skin, one just outside and one just beneath, sharing a common axis. Soft dim-orange field loops arc from one coil through the other, crossing the skin line. A faint cool-blue thread runs from the inner coil deeper into the head towards a small spiral shape suggesting the inner ear. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ N_2\\Phi_2 = Mi_1 $ and $ \\varepsilon_2 = -M\\frac{di_1}{dt} $. Same unit as $ L $: the henry.\n- Numbers go in through $ \\Delta(N_2\\Phi_2) = M\\Delta i_1 $ and $ |\\varepsilon_2| = M\\frac{\\Delta i_1}{\\Delta t} $. Largest flux linkage and largest EMF happen at **different moments**.\n- $ M $ depends on geometry, the core, and **relative orientation** — never on the current.\n- Coaxial solenoids: $ M = \\mu_0 n_1n_2\\pi r_1^{2}l $. Only the **inner** radius appears.\n- $ M_{12} = M_{21} $ for any two circuits. Verified here, not proved — so compute it whichever way is easier.\n- Coupling $ k = M/\\sqrt{L_1L_2} $, between $ 0 $ and $ 1 $. For the two solenoids, $ k = r_1/r_2 $.\n- Turning one coil through $ 90^\\circ $ kills $ M $ as effectively as moving it far away.',
    }),
    b('text', 14, {
      markdown: 'Next: pushing a current into a coil against its own back-EMF is work. That work does not vanish — it is stored, and we can say exactly where.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The mutual inductance of two coils depends on',
          ['their shapes, separation and orientation', 'the current in the first coil', 'the rate of change of that current', 'the EMF induced in the second coil'],
          0,
          '$ M = N_2\\Phi_2/i_1 $, and the current cancels between numerator and denominator. What remains is the geometry of the pair and what lies between them.',
          2),
        q('For two long coaxial solenoids, the mutual inductance is set by the cross-sectional area of',
          ['the inner solenoid', 'the outer solenoid', 'the gap between them', 'whichever one carries the current'],
          0,
          'The shared flux can only be as large as the smaller coil\'s cross-section allows, so $ M = \\mu_0n_1n_2\\pi r_1^{2}l $ contains $ r_1 $ alone. The outer radius never enters.',
          2),
        q('Two coils have $ M_{12} = 4 $ mH. The value of $ M_{21} $ is',
          ['$ 4 $ mH', '$ 2 $ mH', '$ 8 $ mH', 'not determined without more data'],
          0,
          'Reciprocity: $ M_{12} = M_{21} $ for any two circuits, however different their shapes and turn counts. It is not obvious, but it is exact — and it lets you calculate $ M $ in whichever direction is simpler.',
          1),
      ],
    }),
  ],
};

// ── p12 · Energy Stored in an Inductor ───────────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'emi-energy-stored-in-an-inductor',
  title: 'Energy Stored in an Inductor',
  subtitle: 'And the electric twin it has been waiting for since Chapter 2',
  glossary: [
    { term: 'magnetic energy density', definition: 'The energy stored per unit volume of a magnetic field: $ u = \\frac{B^{2}}{2\\mu_0} $, in joules per cubic metre.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'Disconnect a charged capacitor and it holds its energy quietly for hours. Disconnect a current-carrying inductor and it lets go of its energy in **microseconds** — usually as a bright spark across the switch contacts.\n\nBoth devices store energy in a field. Both store roughly the same amount in a laboratory-sized object.\n\nThe difference in how they give it back is not about how much energy there is. It is about what each one is holding steady — and that is the whole reason a capacitor makes a good battery substitute and an inductor makes a good spark.',
    }),
    b('text', 1, {
      markdown: 'To build up a current in a coil you have to work against its back-EMF, and that work has to go somewhere.\n\nAt the instant when the current is $ i $ and rising at $ di/dt $, the coil opposes you with an EMF of magnitude $ L\\frac{di}{dt} $. To keep the current flowing against it, the source must deliver power\n\n$ P = \\varepsilon i = L\\,i\\,\\frac{di}{dt} $\n\nSo the work done in a small interval $ dt $ is\n\n$ dW = L\\,i\\,\\frac{di}{dt}\\,dt = L\\,i\\,di $\n\nNotice what that substitution did: the time dropped out completely. The total work depends only on the current you end up with, not on how quickly you got there. Integrate from zero current up to a final current $ i $:\n\n$ W = \\int_0^{i} L\\,i\\,di = \\frac{1}{2}Li^{2} $',
    }),
    b('latex_block', 2, {
      latex: 'U = \\frac{1}{2}L\\,i^{2}',
      label: 'Energy stored in an inductor',
      note: 'This is stored, not spent. Reduce the current back to zero and the coil returns every joule of it — which is exactly what the spark is.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'The factor of one half has the same origin it had for a capacitor in Chapter 2, and it is worth naming.\n\nYou are **not** pushing against the full back-EMF the whole time. When the current is small the opposition is whatever it is; as the current grows so does the stored energy. Integrating $ i\\,di $ from $ 0 $ to $ i $ averages that build-up, and averaging a quantity that rises linearly from zero gives you half of its final value. The same integral, the same half, as $ \\frac{1}{2}CV^{2} $.\n\nAnd the mechanical twin from the last page holds here too: $ \\frac{1}{2}Li^{2} $ sits exactly where $ \\frac{1}{2}mv^{2} $ sits. Getting a heavy trolley up to speed takes work; getting a large current into a big coil takes work; both give it back when you slow them down.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'quantitative',
      prompt: 'The current through an inductor is increased from $ 2 $ A to $ 4 $ A. By what factor does the stored energy increase?',
      options: ['Four times', 'Twice', 'Eight times', 'Sixteen times'],
      reveal: '**Four times.**\n\n$ U = \\frac{1}{2}Li^{2} \\propto i^{2} $, so doubling the current quadruples the energy. Numerically the store goes from $ \\frac{1}{2}L(4) = 2L $ to $ \\frac{1}{2}L(16) = 8L $.\n\n**The square is the point, and it is easy to under-rate.** A modest-sounding increase in current is a large increase in stored energy — and every joule of it has to be got rid of somewhere when you open the switch. This is why a big electromagnet cannot simply be switched off: at ten times the current it holds a hundred times the energy, and that energy will find a path out whether you have provided one or not.\n\nThe answer "twice" is what you get by reading $ U $ as proportional to $ i $. Check the exponent before you scale anything.',
      difficulty_level: 1,
    }),
    b('heading', 5, {
      text: 'Where the energy actually sits',
      level: 2,
      objective: 'Rewrite $ \\frac{1}{2}Li^{2} $ in terms of $ B $ alone and read off the energy density.',
    }),
    b('text', 6, {
      markdown: 'Chapter 2 asked this question about a capacitor and got a surprising answer: the energy is not on the plates, it is in the **field**. Ask it again here.\n\nTake the long solenoid, whose two results we already have: $ L = \\mu_0n^{2}Al $ and $ B = \\mu_0 n i $, so $ i = B/\\mu_0 n $. Substitute both into the energy:\n\n$ U = \\frac{1}{2}\\left(\\mu_0n^{2}Al\\right)\\left(\\frac{B}{\\mu_0 n}\\right)^{2} = \\frac{1}{2}\\cdot\\frac{\\mu_0 n^{2}Al\\,B^{2}}{\\mu_0^{2}n^{2}} = \\frac{B^{2}}{2\\mu_0}\\,(Al) $\n\nEvery turn count has cancelled. What is left is a quantity built only from $ B $, multiplied by $ Al $ — which is precisely the **volume** inside the solenoid. So the energy per unit volume is:',
    }),
    b('latex_block', 7, {
      latex: 'u = \\frac{B^{2}}{2\\mu_0}',
      label: 'Energy density of a magnetic field',
      note: 'Joules per cubic metre. No coil, no current, no turns — only the field. So it applies to ANY magnetic field, whatever produced it.',
      highlight: true,
    }),
    b('comparison_card', 8, {
      title: 'The two field energies, side by side — this pairing is the point of the page',
      columns: [
        {
          heading: 'Electric field · Chapter 2',
          points: [
            'Stored in a **capacitor**: $ U = \\frac{1}{2}CV^{2} $',
            'Energy density $ u = \\frac{1}{2}\\varepsilon_0E^{2} $',
            'Built up by moving **charge** onto the plates against the field already there',
            'The half comes from integrating as $ V $ rises from zero',
            'Zero when the capacitor is uncharged',
            'At $ 3\\times10^{6} $ V/m — the most dry air will take — about $ 40 $ J per cubic metre',
          ],
        },
        {
          heading: 'Magnetic field · this chapter',
          points: [
            'Stored in an **inductor**: $ U = \\frac{1}{2}Li^{2} $',
            'Energy density $ u = \\frac{B^{2}}{2\\mu_0} $',
            'Built up by pushing **current** through against the back-EMF already there',
            'The half comes from integrating as $ i $ rises from zero',
            'Zero when the current is zero',
            'At $ 1 $ T — an ordinary laboratory magnet — about $ 4\\times10^{5} $ J per cubic metre',
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'Read that pair carefully, because it is one of the tidiest correspondences in the whole book — and one genuine asymmetry hides inside it.\n\n**The shapes match perfectly.** $ \\frac{1}{2}CV^{2} $ against $ \\frac{1}{2}Li^{2} $; $ \\frac{1}{2}\\varepsilon_0E^{2} $ against $ \\frac{B^{2}}{2\\mu_0} $. Even the second pair is more symmetric than it looks: $ \\frac{B^{2}}{2\\mu_0} $ is just $ \\frac{1}{2}\\frac{1}{\\mu_0}B^{2} $, so one constant multiplies the square in one case and divides it in the other. Roles swap, structure does not.\n\n**But the numbers do not match at all.** The last row is a factor of ten thousand apart. A perfectly ordinary $ 1 $ T magnet stores four hundred thousand joules per cubic metre; an electric field pushed right to the edge of what air can withstand stores forty. That is why energy storage and power conversion in real engineering — motors, generators, transformers — is done magnetically. Air gives up on electric fields long before they get interesting.\n\n**And a forward promise.** In an electromagnetic wave, Chapter 8 will show that these two densities are exactly **equal** at every point. Half the energy of sunlight is in its electric field and half is in its magnetic field. Neither formula on this page is a special case of the other, but out there they meet.',
    }),
    b('worked_example', 10, {
      label: 'the energy in a solenoid, two ways',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A solenoid of inductance $ 0.50 $ H carries a current of $ 2.0 $ A. Its interior has a volume of $ 1.0\\times10^{-3}\\ \\text{m}^{3} $. Find the stored energy, and hence the magnetic field inside it. Take $ \\mu_0 = 4\\pi\\times10^{-7} $ SI units.',
      solution: '**Energy, from the circuit formula.**\n\n$ U = \\frac{1}{2}Li^{2} = \\frac{1}{2}(0.50)(2.0)^{2} = 1.0\\ \\text{J} $\n\n**Field, from the energy density.** All of that energy sits inside the solenoid, so\n\n$ u = \\frac{U}{\\text{volume}} = \\frac{1.0}{1.0\\times10^{-3}} = 1.0\\times10^{3}\\ \\text{J/m}^{3} $\n\nNow invert $ u = \\frac{B^{2}}{2\\mu_0} $:\n\n$ B = \\sqrt{2\\mu_0 u} = \\sqrt{2(4\\pi\\times10^{-7})(1.0\\times10^{3})} = \\sqrt{2.51\\times10^{-3}} $\n\n$ B = 5.0\\times10^{-2}\\ \\text{T} = 50\\ \\text{mT} $\n\n**Now check the answer against the comparison above.** To store the same $ 10^{3} $ J per cubic metre in an electric field you would need\n\n$ E = \\sqrt{\\frac{2u}{\\varepsilon_0}} = \\sqrt{\\frac{2(10^{3})}{8.854\\times10^{-12}}} = 1.5\\times10^{7}\\ \\text{V/m} $\n\nwhich is about **five times** the field at which dry air breaks down and arcs over. A field of $ 50 $ mT is trivially easy to make; a field of $ 1.5\\times10^{7} $ V/m in air is impossible. That single comparison is why the electrical world runs on coils rather than plates.',
    }),
    b('image', 11, {
      src: '',
      alt: 'A solenoid with its interior shaded to show energy density spread through the field volume rather than stored in the wire',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'The joules are in the field filling the interior, not in the copper.',
      generation_prompt: 'Clean scientific diagram, cutaway side view of a solenoid drawn as a row of thin amber elliptical turns along a horizontal axis. The entire cylindrical interior is filled with an even translucent amber glow of uniform density to represent stored energy, with straight dim-orange field arrows running through it parallel to the axis. The copper turns themselves are drawn deliberately dim and thin so the glowing interior clearly dominates. Faint dashed grey lines outline the cylindrical volume at each end. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ U = \\frac{1}{2}Li^{2} $, from integrating the work done against the back-EMF.\n- The half has the same origin as in $ \\frac{1}{2}CV^{2} $ — the opposition builds up from zero.\n- $ u = \\frac{B^{2}}{2\\mu_0} $ — energy per cubic metre of **any** magnetic field.\n- Partner formula, Chapter 2: $ u = \\frac{1}{2}\\varepsilon_0E^{2} $. Same structure, roles of the constant swapped.\n- Magnetic storage beats electric by about $ 10^{4} $ at practical field strengths.\n- $ U \\propto i^{2} $ — a doubled current is a quadrupled store, and all of it must go somewhere on switch-off.',
    }),
    b('text', 13, {
      markdown: 'Next: put a coil, a resistor and a battery in series and watch the current climb. Where it has to go on the way back down is the interesting half.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('The energy stored in an inductor carrying a current $ i $ is',
          ['$ \\frac{1}{2}Li^{2} $', '$ Li^{2} $', '$ \\frac{1}{2}Li $', '$ \\frac{1}{2}L^{2}i $'],
          0,
          'Integrating $ dW = Li\\,di $ from zero to $ i $ gives $ \\frac{1}{2}Li^{2} $. The half comes from the opposition building up as the current grows, exactly as it does for a capacitor.',
          1),
        q('The energy density of a magnetic field is',
          ['$ \\frac{B^{2}}{2\\mu_0} $', '$ \\frac{\\mu_0B^{2}}{2} $', '$ \\frac{B}{2\\mu_0} $', '$ \\frac{2B^{2}}{\\mu_0} $'],
          0,
          'Rewriting $ \\frac{1}{2}Li^{2} $ for a solenoid in terms of $ B $ leaves $ \\frac{B^{2}}{2\\mu_0} $ times the interior volume. Since only $ B $ survives, the result applies to any magnetic field at all.',
          2),
        q('The magnetic energy density $ \\frac{B^{2}}{2\\mu_0} $ pairs with which earlier result?',
          ['$ u = \\frac{1}{2}\\varepsilon_0E^{2} $', '$ V = \\frac{kq}{r} $', '$ C = \\frac{\\varepsilon_0A}{d} $', '$ F = qvB\\sin\\theta $'],
          0,
          'Both give energy per unit volume of a field, both go as the square of the field, and in an electromagnetic wave the two turn out to be equal at every point.',
          2),
      ],
    }),
  ],
};

// ── p13 · The L-R Circuit ────────────────────────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'emi-the-lr-circuit',
  title: 'The L-R Circuit',
  subtitle: 'The same exponential as Chapter 2, running on completely different physics',
  glossary: [
    { term: 'inductive time constant', definition: 'The ratio $ \\tau = L/R $, in seconds. The natural timescale over which current grows or dies in an inductor-resistor circuit.' },
    { term: 'inductive kick', definition: 'The very large EMF produced when the current through an inductor is interrupted quickly, often large enough to arc across the switch.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Pull the plug on a running electric drill and you may see a blue flash at the socket. Open the switch on a large electromagnet and the contacts spark and pit.\n\nThe supply was only $ 230 $ V. The spark can jump a gap that $ 230 $ V could never cross.\n\nWhere is the extra voltage coming from — after you have just **disconnected** the supply?',
      hint: 'Which quantity in $ \\varepsilon = -L\\frac{di}{dt} $ becomes enormous when a switch opens?',
      reveal: 'From the coil, and from the energy it was already holding.\n\nOpening a switch tries to take the current from its running value to zero in perhaps a microsecond. That makes $ \\frac{di}{dt} $ enormous, and $ \\varepsilon = -L\\frac{di}{dt} $ turns it into a voltage of thousands of volts — a voltage the coil generates itself.\n\nAnd there is an energy statement behind it. The coil was holding $ \\frac{1}{2}Li^{2} $ joules. Cutting the circuit does not delete that energy; it just removes the path you had provided for it. So it takes the path that is left, which is straight through the air between the contacts.\n\nThis page is the mathematics of that switch-on and switch-off. It goes a little past the NCERT treatment, and it is standard for the competitive papers.',
    }),
    b('text', 1, {
      markdown: 'Put a battery of EMF $ V_0 $, a resistor $ R $ and an inductor $ L $ in series, and close the switch.\n\nAt the first instant, the current is zero. The coil resists any change, and the fastest change of all would be an instant jump — so it produces exactly enough back-EMF to prevent it. **The current starts at zero and climbs.**\n\nAs it climbs, $ \\frac{di}{dt} $ falls, so the back-EMF falls, so more of the battery\'s voltage is available to push current through $ R $. Eventually the current stops changing altogether, the back-EMF disappears, and the current settles at plain $ V_0/R $.\n\nWriting the loop rule and solving gives:',
    }),
    b('latex_block', 2, {
      latex: 'i = i_0\\left(1 - e^{-t/\\tau}\\right), \\qquad i_0 = \\frac{V_0}{R}, \\qquad \\tau = \\frac{L}{R}',
      label: 'Growth of current in an L-R circuit',
      note: 'i-nought is the final steady current, set by Ohm law alone. The inductor decides how long it takes to get there, not where it ends up.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: '**Check that $ \\tau $ really is a time.** A henry is $ \\text{V}\\cdot\\text{s/A} $ and an ohm is $ \\text{V/A} $, so\n\n$ \\frac{\\text{H}}{\\Omega} = \\frac{\\text{V}\\cdot\\text{s}}{\\text{A}}\\times\\frac{\\text{A}}{\\text{V}} = \\text{s} $\n\nIt has to be, since the exponent must be dimensionless — but doing the check is a two-line habit that catches an upside-down formula immediately.\n\nAnd the interpretation is the one you already know from Chapter 2. After one time constant the current has covered $ 63\\% $ of its way to the final value; after $ 5\\tau $ it is within a fraction of a per cent, which engineers call finished.\n\nOne thing here is genuinely the **opposite** of the capacitor case, though, and it catches people out. In a C-R circuit, a bigger $ R $ makes the circuit **slower** ($ \\tau = CR $). In an L-R circuit, a bigger $ R $ makes it **faster** ($ \\tau = L/R $). Resistance is on the top in one and the bottom in the other, and there is a physical reason: resistance is what *dissipates* the stored energy, so more of it drains an inductor faster while it merely throttles the charging of a capacitor.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'quantitative',
      prompt: 'An L-R circuit has $ L = 8 $ mH and $ R = 4\\ \\Omega $. The resistance is now doubled to $ 8\\ \\Omega $, with the same battery. What happens to the time constant and to the final current?',
      options: [
        'Time constant halves; final current halves',
        'Time constant doubles; final current halves',
        'Time constant halves; final current is unchanged',
        'Both are unchanged',
      ],
      reveal: '**Time constant halves; final current halves.**\n\n$ \\tau = \\frac{L}{R} $, so doubling $ R $ takes $ \\tau $ from $ 2 $ ms to $ 1 $ ms — the circuit settles **twice as fast**.\n\n$ i_0 = \\frac{V_0}{R} $, so doubling $ R $ also halves the steady current the circuit ends up at.\n\nBoth change, and they change for quite separate reasons. The **destination** is pure Ohm\'s law and the inductor has nothing to do with it. The **journey time** is where $ L $ lives.\n\n**The trap worth naming** is importing the C-R intuition wholesale. There, more resistance meant more time. Here, more resistance means less time. The exponential shape is identical, but $ R $ sits on the other side of the fraction — so re-derive $ \\tau $ rather than recalling it.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'Switching off, and the spark',
      level: 2,
      objective: 'Describe the decay of current and explain why breaking an inductive circuit produces a large EMF.',
    }),
    b('text', 6, {
      markdown: 'Now remove the battery but leave the coil and resistor connected in a closed loop. There is nothing left to drive the current — but the coil objects to it stopping, so it keeps it going while its stored energy lasts:\n\n$ i = i_0\\,e^{-t/\\tau} $\n\nSame $ \\tau = L/R $, same exponential, decaying instead of growing. Every joule of the $ \\frac{1}{2}Li_0^{2} $ the coil was holding ends up as heat in $ R $.\n\nThat is the **tidy** switch-off, because a path was left for the current. Now consider the untidy one: opening a switch, so the resistance of the path jumps from a few ohms to effectively infinite in microseconds.\n\n- $ \\tau = L/R $ becomes almost zero, so the current is forced to collapse almost instantly;\n- $ \\frac{di}{dt} $ becomes enormous;\n- $ \\varepsilon = -L\\frac{di}{dt} $ becomes thousands of volts;\n- and the air between the contacts breaks down, giving the current the path you took away.\n\nA current of $ 2 $ A dying in $ 10\\ \\mu\\text{s} $ through a $ 0.1 $ H coil gives $ \\varepsilon = 0.1 \\times \\frac{2}{10^{-5}} = 20{,}000 $ V. That is the spark, and the coil made it out of its own stored energy.',
    }),
    b('comparison_card', 7, {
      title: 'C-R and L-R: identical mathematics, mirror-image physics',
      columns: [
        {
          heading: 'C-R · Chapter 2, "Charging and Discharging"',
          points: [
            'Stores **charge**; opposes a change in **voltage**',
            'Time constant $ \\tau = CR $ — bigger $ R $ makes it **slower**',
            'At $ t = 0 $ an uncharged capacitor is a **short circuit**',
            'After a long time it is an **open circuit**',
            'Current starts at $ V_0/R $ and decays to zero',
            'Charge grows as $ q_0(1 - e^{-t/\\tau}) $',
          ],
        },
        {
          heading: 'L-R · this page',
          points: [
            'Stores **current**; opposes a change in **current**',
            'Time constant $ \\tau = L/R $ — bigger $ R $ makes it **faster**',
            'At $ t = 0 $ an inductor is an **open circuit**',
            'After a long time it is a **plain wire**',
            'Current starts at zero and grows to $ V_0/R $',
            'Current grows as $ i_0(1 - e^{-t/\\tau}) $',
          ],
        },
      ],
    }),
    b('text', 8, {
      markdown: 'Set those two columns beside each other and something worth saying out loud appears.\n\nThe **mathematics is the same equation**. Both are a first-order exponential approach to a final value, both have a 63-per-cent-after-one-time-constant rule, both are effectively finished after $ 5\\tau $. If you can solve one you can solve the other.\n\nThe **physics is the mirror image**. A capacitor holds voltage steady and lets current jump; an inductor holds current steady and lets voltage jump. Every row of that card is a swap of those two words.\n\nThis is worth taking seriously as a way of reading physics, not just as a memory aid. When two different systems obey the same differential equation, everything the equation says is true of both — the shapes of the graphs, the 63 per cent, the "five time constants and it is over". Only the interpretation of the symbols differs. You saw the same thing on the last page, where $ \\frac{1}{2}Li^{2} $ turned out to be $ \\frac{1}{2}mv^{2} $ wearing different letters.',
    }),
    b('worked_example', 9, {
      label: 'timing an L-R circuit',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A $ 12 $ V battery, a $ 4.0\\ \\Omega $ resistor and an $ 8.0 $ mH inductor are connected in series and the switch is closed at $ t = 0 $. Find the final current, the time constant, the current after $ 2.0 $ ms, and the time taken to reach $ 90\\% $ of the final current.',
      solution: '**Final current — pure Ohm\'s law.**\n\n$ i_0 = \\frac{V_0}{R} = \\frac{12}{4.0} = 3.0\\ \\text{A} $\n\nThe inductor has no say in this. Once the current is steady it produces no EMF at all.\n\n**Time constant.**\n\n$ \\tau = \\frac{L}{R} = \\frac{8.0\\times10^{-3}}{4.0} = 2.0\\times10^{-3}\\ \\text{s} = 2.0\\ \\text{ms} $\n\n**Current after $ 2.0 $ ms**, which is exactly one time constant:\n\n$ i = i_0(1 - e^{-1}) = 3.0(1 - 0.368) = 3.0(0.632) = 1.9\\ \\text{A} $\n\nThe $ 63\\% $ figure, applied directly.\n\n**Time to reach $ 90\\% $.** Set $ i = 0.90\\,i_0 $:\n\n$ 0.90 = 1 - e^{-t/\\tau} \\quad\\Rightarrow\\quad e^{-t/\\tau} = 0.10 \\quad\\Rightarrow\\quad \\frac{t}{\\tau} = \\ln 10 = 2.30 $\n\n$ t = 2.30 \\times 2.0\\ \\text{ms} = 4.6\\ \\text{ms} $\n\n**Two things to carry away from the numbers.** First, the whole transient is over in about $ 10 $ ms — for a mains supply reversing every $ 10 $ ms, that is not a transient at all but the permanent state of affairs, which is what Chapter 7 has to deal with. Second, $ t = \\tau\\ln(10) $ for $ 90\\% $ is worth remembering: it is the same $ 2.3\\tau $ in every first-order circuit, C-R or L-R alike.',
    }),
    b('worked_example', 10, {
      label: 'a switch-off with two resistances in the loop',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An ideal inductor $ L = 0.20 $ H sits in series with $ R_1 = 10\\ \\Omega $, and that pair is connected to a $ 20 $ V battery through a switch. A second resistor $ R_2 = 40\\ \\Omega $ is wired permanently across the same pair, so it stays connected even when the switch opens. The switch has been closed for a long time and is opened at $ t = 0 $. Find (a) the current in the inductor just before and just after opening, (b) the time constant after opening, (c) the voltage across $ R_2 $ and across the inductor immediately after opening, (d) the total heat produced after $ t = 0 $ and how it splits between the two resistors, and (e) the time for the current to fall to $ 10\\% $ of its starting value.',
      solution: '**(a) Just before, and just after.**\n\nAfter a long time the current is steady, so $ \\frac{di}{dt} = 0 $ and the ideal inductor is nothing but a piece of wire. The battery then sits directly across $ R_1 $:\n\n$ i_0 = \\frac{V_0}{R_1} = \\frac{20}{10} = 2.0\\ \\text{A} $\n\n($ R_2 $ is also across the battery and draws its own $ 0.5 $ A, but that current comes from the battery and never passes through the coil, so it plays no part in what follows.)\n\nThe instant the switch opens, **the current through the inductor cannot jump**. A jump would need an infinite $ \\frac{di}{dt} $, and $ \\varepsilon = -L\\frac{di}{dt} $ would then be infinite. So immediately after opening the inductor still carries $ 2.0 $ A. What has changed is where that current goes: the battery branch is gone, so the only path left is round through $ R_1 $ and $ R_2 $ in series.\n\n**(b) The new time constant.**\n\nIn the decay loop the coil now sees both resistors:\n\n$ \\tau\' = \\frac{L}{R_1 + R_2} = \\frac{0.20}{50} = 4.0\\times10^{-3}\\ \\text{s} = 4.0\\ \\text{ms} $\n\nWith the switch closed the circuit\'s constant was $ \\frac{L}{R_1} = 20 $ ms. Adding resistance made the circuit **five times faster**, which is the L-R rule from the top of this page doing real work — and the exact opposite of what more resistance would do to a capacitor.\n\n**(c) The voltages, immediately after opening.**\n\nThe same $ 2.0 $ A is now forced through $ R_2 $:\n\n$ V_2 = i_0R_2 = (2.0)(40) = 80\\ \\text{V} $\n\nEighty volts — **four times the battery voltage**, from a battery that has just been disconnected. The coil is the source now, and it is spending the energy it had stored.\n\nAcross the inductor, which has to drive the whole loop:\n\n$ |\\varepsilon| = i_0(R_1 + R_2) = (2.0)(50) = 100\\ \\text{V} $\n\nCheck it the other way. The decay is $ i = i_0e^{-t/\\tau\'} $, so at $ t = 0 $, $ \\left|\\frac{di}{dt}\\right| = \\frac{i_0}{\\tau\'} = \\frac{2.0}{4.0\\times10^{-3}} = 500\\ \\text{A/s} $, and $ L\\left|\\frac{di}{dt}\\right| = (0.20)(500) = 100 $ V. The two routes agree.\n\n**This part is the whole argument for the freewheeling diode below.** Make $ R_2 $ ten times larger and the voltage across it is ten times larger too. Remove it altogether — which is what a plain open switch does — and $ R_2 $ is effectively infinite, so the voltage runs away until the air breaks down. The diode is simply a very small $ R_2 $ that appears exactly when it is needed.\n\n**(d) The heat, without integrating.**\n\nNothing drives the loop after $ t = 0 $, so every joule of heat was already in the coil:\n\n$ Q_{\\text{total}} = \\frac{1}{2}Li_0^{2} = \\frac{1}{2}(0.20)(2.0)^{2} = 0.40\\ \\text{J} $\n\n$ R_1 $ and $ R_2 $ are in series in this loop, so they carry the **same current at every instant**. Heat goes as $ i^{2}R $ with a common $ i $, so it divides in the plain ratio of the resistances:\n\n$ Q_1 = 0.40\\times\\frac{10}{50} = 0.080\\ \\text{J}, \\qquad Q_2 = 0.40\\times\\frac{40}{50} = 0.32\\ \\text{J} $\n\nNo integral anywhere. It is the same energy-accounting move used on the sliding rod: find where the energy started, decide where it can go, and let the bookkeeping do the rest.\n\n**(e) Down to a tenth.**\n\n$ 0.10 = e^{-t/\\tau\'} \\quad\\Rightarrow\\quad \\frac{t}{\\tau\'} = \\ln 10 = 2.30 $\n\n$ t = (2.30)(4.0\\ \\text{ms}) = 9.2\\ \\text{ms} $\n\nThe same $ 2.3\\tau $ that took the growing current to $ 90\\% $ takes the decaying one down to $ 10\\% $. For a first-order circuit those two are the same journey, read from opposite ends.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Growth and decay curves of current in an L-R circuit with the time constant marked on each',
      width: 'two_third',
      aspect_ratio: '16:9',
      caption: 'Rising to $ V_0/R $, then falling back. One time constant covers $ 63\\% $ of either journey.',
      generation_prompt: 'Clean scientific graph panel, two graphs side by side in a shared style with thin dim-grey axes. Left graph: a smooth amber curve rising from the origin and flattening towards a dashed horizontal grey asymptote, with a faint vertical dashed line partway along and a short horizontal dashed line meeting the curve where they cross. Right graph: a smooth amber curve falling from a high value on the vertical axis and flattening towards the horizontal axis, with the same pair of faint dashed guide lines. No gridlines. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 12, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'The inductive kick is a **problem in one place and the entire product in another**.\n\n**As a problem:** every relay, solenoid valve and motor winding in a machine is an inductor, and switching it off would arc across the contacts and destroy them, or send a voltage spike back into the electronics. The standard fix costs a few rupees — a **freewheeling diode** wired backwards across the coil. While the coil is powered the diode does nothing. The moment the switch opens, the coil\'s reversed EMF forward-biases it, and the current has a comfortable loop to circulate in and die away quietly. No path taken away, no spark.\n\n**As the product:** a petrol engine\'s **ignition coil** does exactly the thing the diode is there to prevent, on purpose. A current is built up in a coil and then deliberately interrupted. The collapsing field produces tens of thousands of volts, which jumps the spark plug gap and ignites the fuel. Every one of the billions of petrol engines running today is powered by the equation on this page, applied several thousand times a minute.\n\nSame physics, opposite intention — which is a fair description of most of engineering.',
      image_prompt: 'Clean scientific illustration, two simple circuit vignettes side by side in thin dim-grey line art. Left vignette: a coil symbol drawn as a series of amber loops with a small diode triangle-and-bar symbol wired across it, and a smooth amber curved arrow showing current circulating quietly around the small loop. Right vignette: a similar coil with an open switch drawn as a broken line, and a jagged bright orange spark arcing across a small gap between two rounded electrode tips, with short radiating glow lines around the arc. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Growth: $ i = i_0(1 - e^{-t/\\tau}) $. Decay: $ i = i_0e^{-t/\\tau} $. Both with $ \\tau = L/R $.\n- $ i_0 = V_0/R $ — the **destination** is Ohm\'s law; $ L $ only sets the **journey time**.\n- After $ \\tau $: $ 63\\% $ of the way. After $ 5\\tau $: effectively done. For $ 90\\% $, $ t = 2.3\\tau $.\n- At $ t = 0 $ an inductor is an **open circuit**; long after, it is a **plain wire**. A capacitor does exactly the reverse.\n- Bigger $ R $ makes an L-R circuit **faster** and a C-R circuit **slower**.\n- Breaking an inductive circuit gives a huge $ \\frac{di}{dt} $, hence a huge EMF, hence a spark. A diode across the coil is the standard cure.\n- Switch off into a second resistor: the coil current **cannot jump**, so it carries on at $ i_0 $ through $ R_1 + R_2 $, with $ \\tau\' = \\frac{L}{R_1+R_2} $ and a peak voltage $ i_0(R_1+R_2) $ that can far exceed the battery.\n- All the heat after the switch opens is the stored $ \\frac{1}{2}Li_0^{2} $, and series resistors split it in the ratio of their resistances.',
    }),
    b('text', 14, {
      markdown: 'Next: a question this chapter has quietly avoided. In a stationary loop with a changing field, nothing is moving — so what force is actually pushing the charges around?',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The time constant of an L-R circuit is',
          ['$ L/R $', '$ LR $', '$ R/L $', '$ 1/LR $'],
          0,
          'Henry divided by ohm gives seconds, which the other combinations do not. Note that resistance is on the bottom here, the opposite of $ \\tau = CR $ for a capacitor circuit.',
          1),
        q('Immediately after the switch is closed in an L-R circuit, the inductor behaves as',
          ['an open circuit', 'a plain wire', 'a resistance of $ L/R $', 'a battery of EMF $ Li $'],
          0,
          'The current cannot jump, so at the first instant it is zero — which is what an open circuit does. Long afterwards, with the current steady, the ideal coil produces no EMF and behaves as a plain wire.',
          2),
        q('Opening the switch on a large electromagnet produces a bright spark because',
          ['the sudden change in current induces a very large EMF', 'the battery voltage rises when the circuit opens', 'the coil resistance falls sharply', 'the stored charge on the coil is released'],
          0,
          '$ \\varepsilon = -L\\,di/dt $, and interrupting the current makes $ di/dt $ enormous. The energy for the spark is the $ \\frac{1}{2}Li^{2} $ the coil was already holding, not anything the battery supplies.',
          3),
      ],
    }),
  ],
};

// ── p14 · The Induced Electric Field ─────────────────────────────────────────
// EVERY block on this page is stamped tier:'competitive' below, before upsert.
const p14 = {
  page_number: 14,
  slug: 'emi-the-induced-electric-field',
  title: 'The Induced Electric Field',
  subtitle: 'A field with no charge behind it, and no potential in front of it',
  glossary: [
    { term: 'induced electric field', definition: 'The electric field produced by a changing magnetic field rather than by any charge. Its field lines form closed loops.' },
    { term: 'non-conservative field', definition: 'A field whose line integral around a closed path is not zero, so no potential energy function — and therefore no potential — can be defined for it.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A loop of wire lies perfectly still. The magnetic field through it is increasing. A current flows in the loop.\n\nSomething must be pushing those electrons along the wire. It is not a magnetic force — that would need the charges to be moving to begin with, and before the current started they were not.\n\nThere is no battery. There is no charge anywhere nearby. **So what is pushing them?**',
      hint: 'What is the only kind of force that acts on a charge that is standing still?',
      reveal: 'An **electric field**. It is the only thing that can push a charge that is not already moving.\n\nBut this electric field was not made by any charge. There is no charge anywhere in the problem. It was made by the **changing magnetic field** itself.\n\nThat is a genuinely new object, and it does not obey the rules the electric field of Chapter 1 obeyed. This page is about how it differs, and why that difference is the reason Faraday\'s law is a statement about **fields** rather than about wires.\n\nThis page goes beyond the NCERT treatment. It is here because the competitive papers ask for it, and because the chapter is dishonest without it.',
    }),
    b('text', 1, {
      markdown: 'Start from the definition of EMF, which is older than this chapter: EMF is the **work done per unit charge** in driving a charge once round the circuit.\n\nIf an electric field $ \\vec{E} $ is doing that work, then the work per unit charge around the loop is the line integral of $ \\vec{E} $ around it. Setting that equal to Faraday\'s law, in the sign convention this chapter fixed earlier:',
    }),
    b('latex_block', 2, {
      latex: '\\oint \\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi}{dt}',
      label: 'Faraday\'s law, written as a statement about fields',
      note: 'No wire appears anywhere in this equation. The loop is any closed curve you like to imagine, in empty space if you wish.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'Read what that equation is claiming, because it is much stronger than the version with a coil in it.\n\n**The loop need not be a wire.** It is any closed path you choose to draw — through air, through vacuum, through the middle of nothing. The equation says the induced electric field exists along that path whether or not there is a conductor there to notice it. Put a wire there and a current flows; do not, and the field is still there.\n\n**There is no charge in the problem.** Chapter 1\'s electric field started at positive charges and ended at negative ones. This one starts nowhere and ends nowhere. Its field lines are **closed loops**, encircling the region where the flux is changing, exactly as magnetic field lines encircle a current.\n\n**And the right-hand side is not zero.** That is the sentence with all the consequences in it, and the next section is about why.',
    }),
    b('heading', 4, {
      text: 'Non-conservative — so there is no potential',
      level: 2,
      objective: 'Explain why an induced electric field admits no potential function, and what that breaks.',
    }),
    b('text', 5, {
      markdown: 'For the electrostatic field of Chapter 1, $ \\oint\\vec{E}\\cdot d\\vec{l} = 0 $ around **every** closed path. Carry a charge round any loop you like and you come back with exactly the energy you started with.\n\nThat one fact is what let us invent **potential**. Because the work between two points does not depend on the route, we could attach a single number $ V $ to each point and write the work as $ q(V_A - V_B) $. Every equipotential surface, every $ V = kq/r $, every circuit voltage in Chapter 3 rests on it.\n\nFor the induced field, that integral is $ -\\frac{d\\Phi}{dt} $, which is **not zero**. And the consequences follow immediately:\n\n**You can gain energy by going round in a circle.** Carry a charge once around the loop in the right direction and it comes back with more energy than it left with. That is not a violation of energy conservation — the energy came from whatever is changing the magnetic field — but it is deeply unlike anything in Chapter 1.\n\n**The work depends on the route.** Going from A to B the short way and the long way round give different answers.\n\n**So no potential function exists.** Not "it is hard to calculate" — it cannot be defined at all, because the definition requires route-independence. In a region with a changing magnetic field, asking "what is the potential at this point?" is a question with no answer.\n\nAnd this has a laboratory consequence that startles people the first time they meet it: **two voltmeters connected to the same two points of a loop, with their leads run round opposite sides, read different values.** Neither is faulty. The reading depends on how much changing flux each meter\'s own lead-loop encloses. What a voltmeter measures in an induced-field region is not a property of the two points.',
    }),
    b('comparison_card', 6, {
      title: 'Two electric fields that share a name and almost nothing else',
      columns: [
        {
          heading: 'Electrostatic · Chapter 1',
          points: [
            'Produced by **charges**',
            'Field lines **start and end** on charges',
            '$ \\oint\\vec{E}\\cdot d\\vec{l} = 0 $ around every closed path',
            '**Conservative** — work is route-independent',
            'A potential $ V $ exists; $ \\vec{E} = -\\frac{dV}{dr} $ along a line',
            'A charge carried round a loop gains nothing',
          ],
        },
        {
          heading: 'Induced · this page',
          points: [
            'Produced by a **changing magnetic field**',
            'Field lines are **closed loops** with no ends',
            '$ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi}{dt} \\neq 0 $',
            '**Non-conservative** — work depends on the route',
            'No potential exists; the question has no answer',
            'A charge carried round a loop gains energy',
          ],
        },
      ],
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'logical',
      prompt: 'Inside a long solenoid the current is being increased steadily. A stationary electron is placed in the empty space **outside** the solenoid, where the magnetic field is essentially zero. What happens to it?',
      options: [
        'It accelerates, because the induced electric field is non-zero there',
        'Nothing, because the magnetic field is zero at its position',
        'Nothing, because it is not moving, so it feels no magnetic force',
        'It moves radially outward, away from the solenoid',
      ],
      reveal: '**It accelerates**, along a circle around the solenoid.\n\nThe magnetic field outside a long solenoid is essentially zero — but the induced **electric** field is not. Take a circular path of radius $ r $ outside the solenoid: it still encloses all of the changing flux from inside, so $ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi}{dt} $ is not zero, and by symmetry $ E $ is the same all the way round that circle.\n\nSo there is a real electric field at a place where there is **no magnetic field and no charge whatsoever**. The electron feels $ q\\vec{E} $ and starts to move — tangentially, following the field line, not radially.\n\n**This is the result worth sitting with.** The changing field is confined inside the solenoid. The electron never enters that region. Yet it is pushed. The induced electric field reaches out into space where nothing is happening magnetically at all, and that reach is what makes Faraday\'s law a field law rather than a rule about coils.\n\nOne caution on the reasoning: the answer "nothing, because it is not moving" is correct logic applied to the *magnetic* force, and wrong here only because the magnetic force is not the force in question. An electric field does not care whether a charge is moving.',
      difficulty_level: 3,
    }),
    b('heading', 8, {
      text: 'Working out the field around a solenoid',
      level: 2,
      objective: 'Use symmetry and $ \\oint\\vec{E}\\cdot d\\vec{l} $ to find $ E(r) $ inside and outside a solenoid.',
    }),
    b('worked_example', 9, {
      label: 'the induced field inside and outside a solenoid',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A long solenoid of radius $ R = 5.0 $ cm carries a current that is being increased so that the field inside it rises at a steady $ \\frac{dB}{dt} = 0.20 $ T/s. Find the induced electric field at $ r = 2.0 $ cm from the axis, and at $ r = 10.0 $ cm.',
      solution: 'The method is a direct copy of the Ampere\'s-law technique from Chapter 5: pick a path that symmetry makes easy, and the integral collapses to a product.\n\n**Choose the path.** By symmetry the induced field must be the same magnitude everywhere on a circle centred on the axis, and directed along that circle. So on a circle of radius $ r $,\n\n$ \\oint\\vec{E}\\cdot d\\vec{l} = E\\,(2\\pi r) $\n\n**Inside, $ r < R $.** The circle encloses flux $ \\Phi = B\\,\\pi r^{2} $, so $ \\frac{d\\Phi}{dt} = \\pi r^{2}\\frac{dB}{dt} $. Equating magnitudes:\n\n$ E(2\\pi r) = \\pi r^{2}\\frac{dB}{dt} \\quad\\Rightarrow\\quad E = \\frac{r}{2}\\frac{dB}{dt} $\n\nAt $ r = 2.0 $ cm: $ E = \\frac{0.020}{2}(0.20) = 2.0\\times10^{-3}\\ \\text{V/m} $\n\n**Outside, $ r > R $.** The circle now encloses **all** the flux, and no more — the field beyond the solenoid is zero, so enlarging the circle adds nothing. $ \\frac{d\\Phi}{dt} = \\pi R^{2}\\frac{dB}{dt} $, a constant:\n\n$ E(2\\pi r) = \\pi R^{2}\\frac{dB}{dt} \\quad\\Rightarrow\\quad E = \\frac{R^{2}}{2r}\\frac{dB}{dt} $\n\nAt $ r = 10.0 $ cm: $ E = \\frac{(0.050)^{2}}{2(0.100)}(0.20) = \\frac{0.0025}{0.200}(0.20) = 2.5\\times10^{-3}\\ \\text{V/m} $\n\n**Read the shape of the answer.** $ E $ grows **linearly** with $ r $ inside, peaks at the surface with $ E = \\frac{R}{2}\\frac{dB}{dt} = 5.0\\times10^{-3} $ V/m, then falls off as $ 1/r $ outside. The two formulas agree at $ r = R $, as they must.\n\nAnd notice the pattern: this is exactly the radial profile of the **magnetic** field of a uniform current-carrying cylinder from Chapter 5 — linear inside, $ 1/r $ outside. Same geometry, same symmetry argument, different field. That is not a coincidence; it is the reason Chapter 8 can put these laws side by side and find they rhyme.',
    }),
    b('latex_block', 10, {
      latex: 'E = \\frac{r}{2}\\frac{dB}{dt}\\ \\ (r < R), \\qquad E = \\frac{R^{2}}{2r}\\frac{dB}{dt}\\ \\ (r > R)',
      label: 'Induced electric field around a long solenoid',
      note: 'Linear inside, one-over-r outside, peaking at the surface. The field exists outside even though the magnetic field there is zero.',
      highlight: true,
    }),
    b('text', 11, {
      markdown: 'Why does any of this matter, beyond being unsettling?\n\n**Because it turns Faraday\'s law into a law about space, not about circuits.** Every earlier statement of it needed a coil: "the EMF induced in a loop of wire is...". The version on this page needs nothing but a region of space and an imaginary closed curve in it. The wire was never doing the physics; it was only reporting it.\n\n**Because it is one of Maxwell\'s four equations.** When Chapter 8 collects the laws of this whole book into four lines, the Faraday line is $ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi_B}{dt} $ — this equation, exactly as written above. The circuit version could not have gone in the list.\n\n**Because it makes electromagnetic waves possible.** A changing magnetic field creating an electric field in empty space, far from any wire, is one half of what a light wave is. Chapter 8 supplies the other half — a changing electric field creating a magnetic one — and the two then take turns for ever, travelling outward at $ 3\\times10^{8} $ m/s. Sunlight is this page and its partner, alternating.\n\n**And because a machine was built on it.** The **betatron** accelerates electrons using nothing but the induced electric field around a changing flux — no accelerating gap, no electrodes, no voltage source. The electrons circle in an evacuated ring while the flux through the ring is ramped up, and the induced field pushes them along all the way round. It is a cyclotron whose accelerator is Faraday\'s law itself.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Closed circular electric field lines encircling a solenoid whose internal magnetic field is increasing',
      width: 'two_third',
      aspect_ratio: '1:1',
      caption: 'The induced field lines close on themselves. They begin on no charge and end on none.',
      generation_prompt: 'Clean scientific diagram, end-on view. A shaded circular disc at the centre filled with an even array of small dim-orange dot symbols representing a magnetic field coming out of the plane, with a faint amber glow suggesting it is strengthening. Surrounding and overlapping it, four or five concentric complete circles drawn in bright amber with small arrowheads spaced around each circle all pointing the same way around, representing closed electric field lines; the circles inside the shaded disc are drawn progressively fainter towards the centre and the ones outside progressively fainter with distance. A thin dim-grey dashed radial guide line runs from the centre outward. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- A changing $ \\vec{B} $ produces an $ \\vec{E} $ **with no charge anywhere**. Its field lines are closed loops.\n- $ \\oint\\vec{E}\\cdot d\\vec{l} = -\\frac{d\\Phi}{dt} $ — Faraday\'s law with no wire in it.\n- Right-hand side non-zero → the field is **non-conservative** → **no potential exists**. Not hard to define; impossible.\n- Electrostatic field: $ \\oint\\vec{E}\\cdot d\\vec{l} = 0 $, conservative, $ V $ exists. The two fields share only a name.\n- Around a solenoid: $ E = \\frac{r}{2}\\frac{dB}{dt} $ inside, $ E = \\frac{R^{2}}{2r}\\frac{dB}{dt} $ outside.\n- The field is real outside the solenoid, where $ B = 0 $. This is what makes Faraday\'s law a field law.',
    }),
    b('text', 14, {
      markdown: 'Next: the chapter\'s payoff. Spin a coil in a magnetic field, and every idea in these fifteen pages turns into the electricity in the wall socket.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The electric field induced by a changing magnetic field is',
          ['non-conservative, with closed field lines', 'conservative, with closed field lines', 'non-conservative, starting and ending on charges', 'conservative, starting and ending on charges'],
          0,
          '$ \\oint\\vec{E}\\cdot d\\vec{l} = -d\\Phi/dt \\neq 0 $, which is the definition of non-conservative. And with no charges to begin or end on, the lines can only close on themselves.',
          2),
        q('For an induced electric field, electric potential',
          ['cannot be defined at all', 'is defined but varies with time', 'equals $ -d\\Phi/dt $', 'is defined only outside the field region'],
          0,
          'A potential requires the work between two points to be route-independent, and here it is not. So there is no function to define — this is an impossibility, not a difficulty.',
          3),
        q('Just outside a long solenoid whose current is increasing, the magnetic field is essentially zero. The induced electric field there is',
          ['non-zero, and directed tangentially', 'zero, since the magnetic field is zero', 'non-zero, and directed radially outward', 'zero, since there is no conductor there'],
          0,
          'A circular path outside still encloses the whole changing flux, so its line integral is non-zero. Symmetry then makes the field tangential and equal all the way round, falling off as $ 1/r $.',
          3),
      ],
    }),
  ],
};

// ── p15 · The AC Generator ───────────────────────────────────────────────────
const p15 = {
  page_number: 15,
  slug: 'emi-the-ac-generator',
  title: 'The AC Generator',
  subtitle: 'Where the electricity in the socket is actually made',
  glossary: [
    { term: 'AC generator', definition: 'A machine that rotates a coil in a magnetic field so that the flux through it varies sinusoidally, producing an alternating EMF.' },
    { term: 'slip rings', definition: 'Two continuous conducting rings that keep each end of the rotating coil permanently connected to the same output terminal, so the output alternates.' },
    { term: 'commutator', definition: 'A single ring split into two halves, which swaps the coil\'s connections every half turn so that the output never reverses sign.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Trace the electricity in your wall socket backwards. Through the house, into the street, up the transmission lines, across the state, and into a power station.\n\nAt the far end of that chain you find a boiler, or a dam, or a wind turbine — all of which do just one thing: **turn a shaft**.\n\nSo the entire electricity supply of the country comes down to spinning something. What converts a spin into a voltage?',
      hint: 'What has this whole chapter said is needed to make an EMF?',
      reveal: 'A **changing flux** — and rotation is the easiest way in the world to change a flux.\n\nHold a coil in a magnetic field and turn it. The angle between the field and the coil\'s normal changes continuously, so $ \\Phi = BA\\cos\\theta $ changes continuously, so an EMF appears. That is the whole machine.\n\nAnd notice that a power station does not **make** energy. It converts: chemical or nuclear or gravitational energy turns a shaft, the shaft turns a coil, and induction converts mechanical work into electrical energy. The energy argument from earlier in this chapter is what guarantees the exchange is honest — the harder the electrical load, the harder the turbine is to turn.\n\nThis is the payoff of the chapter. And the EMF it produces turns out to be alternating, which is what the next chapter is about.',
    }),
    b('text', 1, {
      markdown: 'The machine is a coil of $ N $ turns, each of area $ A $, rotating at a constant angular velocity $ \\omega $ in a uniform magnetic field $ B $.\n\nAt time $ t $, the angle between the field and the coil\'s normal is $ \\theta = \\omega t $, so the flux through **one** turn is\n\n$ \\Phi = BA\\cos\\omega t $\n\nand the flux linkage of the whole coil is $ N $ times that. Faraday\'s law, in the sign convention this chapter has used throughout:\n\n$ \\varepsilon = -\\frac{d}{dt}\\left(NBA\\cos\\omega t\\right) = NBA\\,\\omega\\sin\\omega t $',
    }),
    b('latex_block', 2, {
      latex: '\\varepsilon = \\varepsilon_0 \\sin\\omega t, \\qquad \\varepsilon_0 = NBA\\omega',
      label: 'EMF of a rotating coil',
      note: 'The peak EMF grows with turns, field, area and speed — all four, and all of them linearly. Doubling the rotation rate doubles the output.',
      highlight: true,
    }),
    b('text', 3, {
      markdown: 'That result is worth pulling apart, because one feature of it surprises almost everybody.\n\n**The EMF is zero when the flux is largest.** When the coil\'s plane is perpendicular to the field, the flux through it is at its maximum $ NBA $ — and the EMF is zero. A quarter turn later the flux is zero, and the EMF is at its peak.\n\nThat is not a paradox once you remember what Faraday\'s law actually says. The EMF depends on $ \\frac{d\\Phi}{dt} $, not on $ \\Phi $. At maximum flux the curve of $ \\Phi $ against $ t $ is momentarily flat — the coil is passing through its turning point — so nothing is changing and there is no EMF. At zero flux the coil is sweeping through the field lines as fast as it possibly can, and that is where the EMF peaks.\n\n**The output alternates.** As the coil turns past the half-way point, its normal has flipped relative to the field, and the EMF reverses sign. Every half revolution the output changes direction. That single fact is why the next chapter exists.\n\n**The frequency is the rotation rate.** $ f = \\frac{\\omega}{2\\pi} $. India\'s grid runs at $ 50 $ Hz, which means the generator shafts in every power station in the country are turning in step at a rate tied to exactly fifty cycles a second.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'logical',
      prompt: 'At which position of the rotating coil is the induced EMF at its maximum?',
      options: [
        'When the plane of the coil is parallel to the field',
        'When the plane of the coil is perpendicular to the field',
        'When the flux through the coil is at its maximum',
        'When the coil has completed exactly one full turn',
      ],
      reveal: '**When the plane of the coil is parallel to the field** — that is, when the flux through it is momentarily **zero**.\n\nThe EMF is $ -\\frac{d\\Phi}{dt} $, so it tracks how fast the flux is changing, not how big it is. Picture the graph of $ \\Phi = BA\\cos\\omega t $: it is steepest exactly where it crosses zero, and flat exactly at its peaks.\n\nSo the two extremes are swapped:\n\n- coil plane **perpendicular** to the field → flux maximum, rate of change zero → **EMF zero**;\n- coil plane **parallel** to the field → flux zero, rate of change maximum → **EMF maximum**.\n\nPhysically, in the second position the coil\'s sides are slicing across the field lines at full speed. In the first they are moving momentarily along them.\n\n**This is a favourite examination question precisely because the instinct is wrong.** Whenever a question mentions the flux being large, check what it actually asked for — the flux or its rate of change.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'Getting the current out — slip rings and the commutator',
      level: 2,
      objective: 'Explain how the choice of contacts decides whether the output is AC or DC.',
    }),
    b('text', 6, {
      markdown: 'The coil is spinning, so its two ends cannot simply be soldered to a pair of wires — they would twist off within a second. Something has to make a sliding contact, and **what shape that contact is decides what comes out**.\n\n**Two continuous rings — slip rings.** Each end of the coil is joined to its own ring, and a carbon brush presses on each ring. End A of the coil is connected to output terminal 1 permanently, no matter where the coil has rotated to. So when the coil\'s EMF reverses, the output reverses too. The output is **alternating**: $ \\varepsilon_0\\sin\\omega t $, exactly as derived.\n\n**One ring split in two — a commutator.** Now the two halves of the ring rotate with the coil, and the brushes sit fixed in space. Every half turn, each brush stops touching one half of the ring and starts touching the other — so the connection swaps at precisely the moment the coil\'s EMF would have reversed. The two reversals cancel, and the output never changes sign.\n\nThe result is not smooth DC. It is a series of positive humps — $ |\\varepsilon_0\\sin\\omega t| $ — pulsating from zero to the peak twice per revolution. Real machines smooth it by using many coils at different angles, so that one is always near its peak.\n\nThe coil, the magnet and the physics are **identical** in the two machines. Only the shape of the sliding contact differs.',
    }),
    b('worked_example', 7, {
      label: 'sizing a generator for the mains',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A coil of $ 100 $ turns, each of area $ 0.050\\ \\text{m}^{2} $, rotates at $ 50 $ revolutions per second in a uniform field of $ 0.20 $ T. Find the angular velocity, the peak EMF, and the EMF at the instant the coil\'s plane is perpendicular to the field.',
      solution: '**Angular velocity.**\n\n$ \\omega = 2\\pi f = 2\\pi(50) = 314\\ \\text{rad/s} $\n\n**Peak EMF.**\n\n$ \\varepsilon_0 = NBA\\omega = (100)(0.20)(0.050)(314) $\n\n$ = (100)(0.20) = 20; \\quad (20)(0.050) = 1.0; \\quad (1.0)(314) = 314\\ \\text{V} $\n\n$ \\varepsilon_0 = 314\\ \\text{V} $\n\n**EMF when the plane is perpendicular to the field.**\n\nIn that position the flux is at its maximum and its rate of change is zero, so\n\n$ \\varepsilon = 0 $\n\nNot the peak — the exact opposite of it.\n\n**Now look hard at that $ 314 $ V.** Divide it by $ \\sqrt{2} $:\n\n$ \\frac{314}{1.414} = 222\\ \\text{V} $\n\nThat is the mains voltage in your house, and the coincidence is not one. What a domestic supply calls "$ 220 $ V" is not the peak of the sine wave at all — it is a kind of average called the **root-mean-square** value, and it is smaller than the peak by exactly $ \\sqrt{2} $. The actual peak on your wiring is around $ 311 $ V.\n\nWhy that particular average, and where the $ \\sqrt{2} $ comes from, is one of the first things the next chapter has to sort out.',
    }),
    b('image', 8, {
      src: '',
      alt: 'A coil rotating between magnet poles with slip rings and brushes, alongside the sinusoidal EMF it produces',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Rotation makes the flux vary as a cosine, so the EMF varies as a sine. The contacts decide the rest.',
      generation_prompt: 'Clean scientific diagram, wide horizontal composition in two halves. Left half: a rectangular wire loop drawn in bright amber tilted in perspective between two facing pole pieces drawn as dim-grey blocks, with straight dim-orange field arrows running horizontally between the poles through the loop; a curved arrow shows the loop rotating about a horizontal axis, and the two ends of the loop run to two separate continuous rings on the axis with small grey brush blocks pressing on each. Right half: a smooth amber sine wave over a thin dim-grey horizontal axis, drawn with two full cycles, its peaks and zero crossings clearly formed. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 9, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: 'Every generator in India is a version of this page — and the differences between them are only in what turns the shaft.\n\n**Thermal (coal, gas, nuclear):** heat boils water, high-pressure steam drives a turbine, the turbine turns the shaft. About three-quarters of the country\'s electricity arrives this way. A nuclear station is, electrically speaking, an ordinary steam plant with an unusual kettle.\n\n**Hydro:** falling water drives the turbine directly. No boiler, no fuel, and it can be started and stopped within minutes, which makes it the grid\'s tool for handling sudden demand.\n\n**Wind:** the blades turn a shaft through a gearbox. The physics of the last step is unchanged.\n\nOne practical inversion is worth knowing, because it looks like it contradicts the page. In a real power station the **coil stays still and the magnet rotates**. The output current is enormous — thousands of amperes — and passing that through sliding brushes would be hopeless. So engineers rotate the magnet instead and take the heavy current from fixed windings. Relative motion is all that induction ever cared about, exactly as the first page of this chapter said: it makes no difference which part you choose to move.\n\nAnd the energy argument holds visibly at this scale. Switch on a city\'s worth of load and the turbines become measurably harder to turn. The grid operators watch the shaft frequency drop below $ 50 $ Hz and feed in more steam. The electricity is paid for in mechanical work, continuously, second by second.',
      image_prompt: 'Clean scientific illustration, a simple horizontal chain of three vignettes in thin dim-grey line art connected by amber arrows. First vignette: a stylised turbine wheel with curved blades and soft wavy lines flowing into it. Second vignette: a rotating shaft leading to a circular generator body containing a small loop between two pole pieces, drawn in amber. Third vignette: a lattice transmission tower with two catenary lines running off to the edge of the frame. Rendered on a near-black background (#0B0C0F) with orange and amber accents and generous dark space. No text, no labels, no numbers anywhere in the image.',
    }),
    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\Phi = BA\\cos\\omega t $ per turn, so $ \\varepsilon = NBA\\omega\\sin\\omega t = \\varepsilon_0\\sin\\omega t $.\n- $ \\varepsilon_0 = NBA\\omega $ — linear in **all four** of turns, field, area and rotation rate.\n- EMF is **zero** when the flux is maximum, and **maximum** when the flux is zero.\n- Coil plane parallel to $ \\vec{B} $ → peak EMF. Coil plane perpendicular to $ \\vec{B} $ → zero EMF.\n- **Slip rings** (two full rings) give AC. A **commutator** (one split ring) gives pulsating DC.\n- $ f = \\omega/2\\pi $; the Indian grid runs at $ 50 $ Hz.\n- The machine converts mechanical work into electrical energy. A heavier electrical load is a heavier shaft to turn.',
    }),
    b('text', 11, {
      markdown: 'That closes the chapter. A changing flux makes an EMF; the minus sign makes it oppose the change; motion, self-induction and mutual induction are three ways of arranging the change; and a rotating coil turns the whole idea into a power station.\n\nBut look again at what came out of that power station. Not a steady current — a current that reverses fifty times a second. **Every rule you learned for steady current in Chapter 3 now has to be re-examined**, because a resistor, a coil and a capacitor each respond quite differently to a current that will not sit still. That is Chapter 7.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('The peak EMF of an AC generator is given by',
          ['$ NBA\\omega $', '$ NBA $', '$ \\frac{NBA}{\\omega} $', '$ NB\\omega $'],
          0,
          'Differentiating $ NBA\\cos\\omega t $ brings down a factor of $ \\omega $, giving $ \\varepsilon_0 = NBA\\omega $. So spinning the coil twice as fast doubles the output voltage.',
          1),
        q('The EMF of a rotating coil is maximum when the flux through it is',
          ['zero', 'maximum', 'half its maximum value', 'changing most slowly'],
          0,
          'The EMF follows $ d\\Phi/dt $, and a cosine changes fastest exactly where it crosses zero. In that position the coil\'s sides are cutting across the field lines at full speed.',
          2),
        q('Replacing an AC generator\'s slip rings with a split-ring commutator changes the output to',
          ['pulsating direct current', 'a steady direct current', 'alternating current of double the frequency', 'no current at all'],
          0,
          'The split ring swaps the connections every half turn, exactly cancelling the reversal of the coil\'s EMF. The output stays one way round but still rises and falls from zero to the peak twice per revolution.',
          3),
      ],
    }),
  ],
};

// Every block on p14 is competitive-tier (plan §6 rule 5 — `tier` lives on
// BaseBlockSchema, so there is no page-level flag; stamp each block).
p14.blocks = p14.blocks.map((blk) => ({ ...blk, tier: 'competitive' }));

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p10, p11, p12, p13, p14, p15]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
