'use strict';
/**
 * Class 12 Physics · Ch.6 "Electromagnetic Induction" — pages 6–9.
 * Motional EMF derived twice, motional EMF in rotating and slanted geometries,
 * the energy account behind the retarding force, and eddy currents.
 *
 * Sign convention (fixed on p2 and never silently switched):
 *   flux is positive along the CHOSEN normal, and $ \varepsilon = -N\,d\Phi/dt $.
 *   The minus sign IS Lenz's law.
 *
 * Run: node scripts/physics12-book/build_ch6_b_motional.js
 */
const { b, q, st, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const CH = 6;

// ── p6 · Motional EMF ────────────────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'emi-motional-emf',
  title: 'Motional EMF',
  subtitle: 'One rod, one answer, two completely different routes to it',
  glossary: [
    { term: 'motional emf', definition: 'The emf $ \\varepsilon = Bvl $ produced across a conductor of length $ l $ moving with speed $ v $ across a magnetic field $ B $.' },
    { term: 'emf', definition: 'The work done per unit charge by whatever agency drives charge round a circuit. Measured in volts, but it is not a potential difference — it is a source of one.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two metal rails run side by side. A straight metal rod lies across them and can slide freely. A resistor closes the loop at one end. The whole thing sits in a magnetic field.\n\nThere is no cell anywhere in this circuit. No battery, no plug, nothing.\n\nYou give the rod a push. The resistor gets warm.\n\nWhere is the energy coming from — and what is pushing the charge round?',
      hint: 'Nothing has changed except that the rod is now moving. What does a magnetic field do to a charge that is moving?',
      reveal: 'The rod is full of free charges, and every one of them is now **moving** — because the rod is carrying them along.\n\nA moving charge in a magnetic field feels $ q(\\vec{v}\\times\\vec{B}) $. In this arrangement that force points **along the rod**, so it sweeps charge from one end of the rod to the other. One end goes positive, the other negative, and the rod becomes a source of emf.\n\nThe energy comes from **your hand**. This page shows why the emf is $ Bvl $; two pages from now we will show that the work your hand does is exactly the heat the resistor gives out, to the last joule.',
    }),
    b('text', 1, {
      markdown: 'Set the picture up carefully, because every symbol on this page refers to it.\n\nTwo horizontal rails are a distance $ l $ apart. A resistor $ R $ closes the loop at the **left** end. A conducting rod lies across the rails at a distance $ x $ from that closed end, and slides to the **right** with speed $ v $. A uniform magnetic field $ B $ points **into the page**, perpendicular to the whole loop.\n\nThe rails and the rod have negligible resistance, so $ R $ is the resistance of the whole circuit.\n\nWe will now find the emf twice — once by looking *inside the rod* at the charges, and once by looking *at the loop as a whole* and counting flux. The two arguments have almost nothing in common, so it is worth being surprised that they agree.',
    }),
    b('heading', 2, {
      text: 'Route one — the force on the charges inside the rod',
      level: 2,
      objective: 'Derive $ \\varepsilon = Bvl $ from the magnetic force on the carriers, and say which end of the rod goes positive.',
    }),
    b('text', 3, {
      markdown: 'Take one free positive charge $ q $ sitting inside the rod. The rod is moving right at $ v $, so the charge is moving right at $ v $ too. It therefore feels\n\n$ \\vec{F} = q(\\vec{v}\\times\\vec{B}) $\n\nWith $ \\vec{v} $ to the right and $ \\vec{B} $ into the page, the right-hand rule gives a force **up the rod**. (Do it with your own hand: fingers right, curl into the page, thumb up.)\n\nSo positive charge is pushed to the top end of the rod and negative charge is left at the bottom. The rod is now a tiny battery, with the **top end as its positive terminal**.\n\n**Now get the emf.** Emf is defined as the work done per unit charge by the driving agency in carrying charge from one terminal to the other, inside the source. The force per unit charge is $ vB $ and it acts along the whole length $ l $, so\n\n$ \\varepsilon = \\frac{W}{q} = \\frac{(qvB)\\,l}{q} = Bvl $\n\nThat is the whole derivation. Notice it never mentioned a circuit at all — an isolated rod moving across a field has this emf across its ends whether or not anything is connected.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'spatial',
      prompt: 'The rod is disconnected from the rails and slid across the field on its own, so no current can flow anywhere. What is now true?',
      options: [
        'A steady potential difference $ Bvl $ appears across its ends',
        'Nothing at all happens, because a circuit is needed',
        'Charge keeps piling up at the top end without limit',
        'The emf exists but the potential difference is zero',
      ],
      reveal: '**A steady potential difference $ Bvl $ appears across its ends.**\n\nThe magnetic force starts sweeping positive charge upward at once. But as soon as charge separates, the two ends set up an **electric** field inside the rod pointing downward, which pushes back. The pile-up stops the instant the two balance:\n\n$ qE = qvB \\quad\\Rightarrow\\quad E = vB $\n\nand the potential difference across the length is $ V = El = Bvl $. So the accumulation is self-limiting — it settles in far less than a microsecond and then holds steady.\n\n**Why the "no circuit, nothing happens" instinct is wrong:** a circuit is needed for a *current*, not for an *emf*. A torch cell on a shelf has an emf too.\n\nAnd the claim that the emf exists while the potential difference is zero is worth separating carefully. On **open circuit** the emf and the terminal potential difference are equal, both $ Bvl $. They differ only when a current flows and something drops voltage internally.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'Route two — counting the flux through the loop',
      level: 2,
      objective: 'Get the same $ Bvl $ from $ \\varepsilon = -\\,d\\Phi/dt $, keeping the sign convention honest.',
    }),
    b('text', 6, {
      markdown: 'Now forget the charges completely and look only at the closed loop.\n\n**Choose the normal.** Take the loop normal **into the page**, the same way $ \\vec{B} $ points. Flux is then positive:\n\n$ \\Phi = B\\,A = B\\,l\\,x $\n\nAs the rod slides right, $ x $ grows, so the flux grows. Differentiating, with $ B $ and $ l $ fixed and $ dx/dt = v $:\n\n$ \\frac{d\\Phi}{dt} = B\\,l\\,\\frac{dx}{dt} = B\\,l\\,v $\n\nFaraday\'s law with one turn gives\n\n$ \\varepsilon = -\\frac{d\\Phi}{dt} = -Bvl $\n\n**Read that minus sign properly.** Its size is $ Bvl $, which is the answer we already had. Its sign says the induced emf drives current in the **negative** sense about our chosen normal. With the normal into the page, the positive sense is clockwise on the page — so the induced current is **anticlockwise**.\n\nAnd that is exactly right. An anticlockwise current makes flux **out of** the page inside the loop, which fights the growing into-the-page flux. Lenz\'s law, arrived at by pure bookkeeping.',
    }),
    b('latex_block', 7, {
      latex: '\\varepsilon = B\\,v\\,l',
      label: 'Motional emf across a rod moving perpendicular to a field',
      note: 'Valid when v, B and the rod are mutually perpendicular. When they are not, the next page fixes it.',
      highlight: true,
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'quantitative',
      prompt: 'The rod is pulled at a **constant** speed $ v $. As it slides further and further to the right, what happens to the induced emf?',
      options: [
        'It stays constant at $ Bvl $',
        'It grows, because the enclosed area keeps growing',
        'It falls, because the flux is already large',
        'It falls to zero once the rod stops accelerating',
      ],
      reveal: '**It stays constant at $ Bvl $.**\n\nThis is the single most common slip in the whole topic, so it is worth naming: **induction responds to the RATE of change of flux, not to the amount of flux.**\n\nThe flux $ \\Phi = Blx $ certainly keeps growing. But its *rate* of growth is $ Blv $, and $ B $, $ l $ and $ v $ are all fixed — so $ d\\Phi/dt $ is a constant and so is the emf. A huge flux sitting there unchanging induces nothing at all.\n\nRoute one says the same thing more bluntly: the force on a carrier is $ qvB $, which depends on the speed of the rod and on nothing else. Where the rod happens to be on the rails is irrelevant to it.\n\n**And acceleration is a red herring.** Induction needs the flux to change, not the velocity. A rod moving at a steady $ 5 $ m/s induces a steady emf indefinitely.',
      difficulty_level: 2,
    }),
    b('heading', 9, {
      text: 'Why the two routes had to agree',
      level: 2,
      objective: 'Say what the flux rule really is, and why it is not an independent law.',
    }),
    b('text', 10, {
      markdown: 'It can look like a coincidence. One argument is about individual charges feeling $ q\\vec{v}\\times\\vec{B} $; the other never mentions a charge and only counts area. They are not independent.\n\nLook at what makes the flux change here. **The rod is the moving boundary of the loop.** In a time $ dt $ it sweeps out a strip of area $ l\\,(v\\,dt) $, so\n\n$ d\\Phi = B\\,l\\,v\\,dt $\n\nThe $ v $ in that expression is the speed of the rod, and the $ B $ is the field the rod is moving through — which are precisely the two quantities that set the force $ qvB $ on each carrier inside it. The rate of area sweep and the force per unit charge are built from the same two numbers, so they can only give the same emf.\n\nThis is worth stating in general, because it is a genuinely useful idea:\n\n**The flux rule is not a separate law of nature. For a circuit moving in a steady field it is a theorem, and the Lorentz force is the thing it is a theorem about.**\n\nSo use whichever is easier. When you can see the geometry of the loop, count flux. When the shape is awkward but the motion is simple, go back to the carriers.',
    }),
    b('callout', 11, {
      variant: 'warning',
      title: 'A magnetic force does no work — so what is doing it?',
      markdown: 'Chapter 5 proved that a magnetic force can never do work. Yet here a magnetic force appears to be pushing charge round a circuit and warming a resistor. Both statements are true, and the way out is neat.\n\nOnce a carrier starts drifting **along** the rod with some small speed $ u $, the field acts on that drift too. That extra force is $ quB $ pointing **backwards**, along the rails, opposing the rod\'s motion.\n\nSo the magnetic force has two parts. One part does positive work on the carrier, pushing it up the rod. The other does exactly equal negative work by resisting the rod. The two cancel: total work by the magnetic force is zero, as promised.\n\nWhat the magnetic force actually does is **transfer** energy — out of the hand pushing the rod, into the circuit. It is a broker, not a source. Page 8 puts numbers on that transfer.',
    }),
    b('image', 12, {
      src: '',
      alt: 'A conducting rod sliding to the right along two rails closed by a resistor, in a field into the page, with the induced current flowing anticlockwise',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'The rod is the moving boundary. Its sweep grows the enclosed area, and the induced current runs anticlockwise to fight that growth.',
      generation_prompt: 'Clean scientific circuit diagram, wide horizontal composition in thin dim-grey line art. Two long horizontal parallel rails closed at the left end by a small rectangular resistor block outlined in dim grey. A short vertical bright amber bar lies across the rails toward the right, with a bold amber arrow pointing right from its midpoint to show its motion. The rectangular region enclosed between the resistor and the bar is filled with a regular array of small dim-orange cross symbols indicating a field into the page. A continuous glowing orange arrowhead trail runs around the closed loop in the anticlockwise sense: up the vertical bar, left along the top rail, down through the resistor, right along the bottom rail. A faint dashed grey outline just to the right of the bar suggests the thin strip of new area about to be swept. No text, no letters, no numbers, no labels anywhere in the image. Near-black background (#0B0C0F) throughout, with orange and amber as the only accent colours and generous dark empty space.',
    }),
    b('worked_example', 13, {
      label: 'an aircraft wing as a rod',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'An aircraft with a wingspan of $ 30 $ m flies horizontally at $ 250 $ m/s in a region where the **vertical** component of the Earth\'s magnetic field is $ 4.0\\times10^{-5} $ T. Find the potential difference induced between its wingtips.',
      solution: '**First, decide which field component matters.** The emf comes from $ \\vec{v}\\times\\vec{B} $, so only the part of $ \\vec{B} $ perpendicular to $ \\vec{v} $ contributes — and the wingtips are separated horizontally, across the flight direction. The **vertical** component is the one that is perpendicular to both the velocity and the wingspan, so it is the one we use.\n\n**No horizontal part of the field can contribute, whichever way the aircraft is heading.** Both the velocity and the wingspan lie in the horizontal plane, so a horizontal $ \\vec{B} $ makes $ \\vec{v}\\times\\vec{B} $ point vertically — and dotting a vertical vector with the horizontal wingspan gives nothing.\n\nThe question gives us the vertical component directly, which is the hint that this is the intended reading.\n\n**Now apply the formula.**\n\n$ \\varepsilon = B_{V}\\,v\\,l = (4.0\\times10^{-5})(250)(30) $\n\n$ \\varepsilon = 0.30\\ \\text{V} $\n\n**Sanity-check the size.** Three-tenths of a volt across a $ 30 $ m wing, from a field of a few tens of microtesla. Small, but perfectly measurable — and it is genuinely there on every flight.\n\n**Why nothing happens to the aircraft.** There is no closed circuit through the air, so no current flows and no retarding force appears. The wingtips just sit at slightly different potentials. This is the open-circuit case from earlier on the page, at cruising altitude.',
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ \\varepsilon = Bvl $ when $ \\vec{v} $, $ \\vec{B} $ and the rod are mutually perpendicular.\n- **Route one:** the force per unit charge is $ vB $, acting along the length $ l $. Work per unit charge $ = Bvl $.\n- **Route two:** $ \\Phi = Blx $, so $ d\\Phi/dt = Blv $, so $ |\\varepsilon| = Bvl $. The minus sign gives the direction.\n- The flux rule is a **theorem** here, not an extra law. Use whichever route is easier.\n- The emf depends on the **rate** of flux change, never on how much flux there is.\n- No circuit is needed for an emf. On open circuit the terminal potential difference equals $ Bvl $.\n- The magnetic force does zero net work. It moves energy from the pusher into the circuit.',
    }),
    b('text', 15, {
      markdown: 'Next: the rod does not always slide neatly sideways. It can spin about one end, or sit at an angle — and then the question becomes *which* length belongs in the formula.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('A rod of length $ l $ moves with speed $ v $ perpendicular to a field $ B $. The emf induced across it is',
          ['$ Bvl $', '$ Bv/l $', '$ B/vl $', '$ Bv^{2}l $'],
          0,
          'The force per unit charge is $ vB $ acting along the length $ l $, so the work per unit charge is $ Bvl $. A quick unit check settles it too: tesla times metre per second times metre gives volts.',
          1),
        q('The rod on the rails is pulled at constant speed. Compared with its value just after the push began, the emf a few seconds later is',
          ['the same', 'larger, since the area has grown', 'smaller, since the flux is now large', 'zero, since the motion is now steady'],
          0,
          'Induction responds to $ d\\Phi/dt $, not to $ \\Phi $. With $ B $, $ l $ and $ v $ all fixed, the rate of flux change is fixed too, so the emf holds steady no matter how far along the rails the rod has travelled.',
          2),
        q('With the loop normal chosen into the page and the flux into the page increasing, Faraday\'s law makes $ \\varepsilon $ negative. This tells you the induced current is',
          ['anticlockwise on the page', 'clockwise on the page', 'zero until the flux stops changing', 'along the rod only, not round the loop'],
          0,
          'The positive circulation sense about a normal into the page is clockwise, so a negative emf drives the current the other way. That anticlockwise current makes flux out of the page inside the loop, opposing the growth — which is exactly what Lenz\'s law demands.',
          3),
      ],
    }),
  ],
};

// ── p7 · Motional EMF in Other Geometries ────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'emi-motional-emf-geometries',
  title: 'Motional EMF in Other Geometries',
  subtitle: 'Which length is "the" length?',
  glossary: [
    { term: 'effective length', definition: 'The straight-line separation of a conductor\'s two ends, measured perpendicular to both the velocity and the field. Only this part of the conductor contributes to the motional emf.' },
    { term: 'Faraday disc', definition: 'A conducting disc spun about its own axis in an axial magnetic field, producing a steady emf $ \\frac{1}{2}B\\omega R^{2} $ between its centre and its rim.' },
  ],
  blocks: [
    b('callout', 0, {
      variant: 'fun_fact',
      markdown: 'A rod of length $ l $ spins about one of its ends at angular speed $ \\omega $, in a field $ B $ perpendicular to the plane it sweeps.\n\nThe fast end is moving at $ \\omega l $. So the emf must be $ B(\\omega l)l = B\\omega l^{2} $, surely?\n\nIt is not. The correct answer is exactly **half** of that. And the factor of a half is not a fudge — it is the whole physics of the page.',
    }),
    b('text', 1, {
      markdown: 'Page 6 gave $ \\varepsilon = Bvl $, and it was honest about the fine print: $ \\vec{v} $, $ \\vec{B} $ and the rod all had to be mutually perpendicular, and every point of the rod had to move at the same speed.\n\nReal problems break both conditions. A spinning rod has a different speed at every point along it. A rod dragged at a slant is not perpendicular to its own velocity. So we need the version of the formula that does not assume anything.\n\nHere it is. For a straight conductor moving with uniform velocity $ \\vec{v} $ in a uniform field $ \\vec{B} $, with $ \\vec{l} $ the vector from one end to the other,\n\n$ \\varepsilon = (\\vec{v}\\times\\vec{B})\\cdot\\vec{l} $\n\nEverything on this page is that one line, read in three different situations. And when a conductor\'s points move at different speeds, we do what we always do with a varying quantity — chop it into pieces small enough that the speed is constant across each one, and integrate.',
    }),
    b('heading', 2, {
      text: 'A rod rotating about one end',
      level: 2,
      objective: 'Derive $ \\varepsilon = \\frac{1}{2}B\\omega l^{2} $ by integrating along the rod, and say why $ v = \\omega l $ is the wrong thing to substitute.',
    }),
    b('text', 3, {
      markdown: 'A rod of length $ l $ is pivoted at one end $ O $ and spun with constant angular speed $ \\omega $. The field $ B $ is perpendicular to the plane the rod sweeps out.\n\nThe trouble is immediate. Every point of the rod is moving, but they are all moving at **different speeds**. A point at distance $ r $ from the pivot moves at $ v = \\omega r $ — zero at the pivot, $ \\omega l $ at the far end.\n\nSo there is no single $ v $ to put into $ Bvl $. That is why substituting the tip speed gives an answer twice too big: it pretends the whole rod is moving as fast as its fastest point.\n\nInstead, take a short element of the rod at distance $ r $, of length $ dr $. It is short enough that the speed across it really is constant at $ \\omega r $, so page 6 applies to *it*:\n\n$ d\\varepsilon = B\\,v\\,dr = B(\\omega r)\\,dr $\n\nThe elements are joined end to end along the rod, so their emfs simply add.',
    }),
    b('step_solver', 4, {
      title: 'Integrating along the spinning rod',
      problem: 'A rod of length $ l $ rotates with angular speed $ \\omega $ about one end, in a uniform field $ B $ perpendicular to its plane of rotation. Find the emf between the pivot and the far end.',
      intro: 'The method is the lesson here. Chop, write the emf of one piece, add the pieces up.',
      steps: [
        st('Take an element at distance $ r $ from the pivot, of length $ dr $',
          'Small enough that every point of it moves at the same speed. That is the only reason the simple formula may be used on it.', {
            check: {
              kind: 'mcq',
              prompt: 'What is the speed of this element?',
              options: ['$ \\omega r $', '$ \\omega l $', '$ \\omega / r $', '$ \\omega r^{2} $'],
              answer_index: 0,
              feedback_right: 'Yes — in circular motion the linear speed is $ \\omega $ times the distance from the axis, so it grows as you move outward.',
              feedback_wrong: 'The linear speed at radius $ r $ is $ v = \\omega r $. Using $ \\omega l $ would mean the whole rod moves as fast as its tip, which is exactly the mistake this derivation exists to avoid.',
            },
          }),
        st('Its emf is $ d\\varepsilon = B\\,v\\,dr = B\\,\\omega\\,r\\,dr $',
          'This is $ \\varepsilon = Bvl $ applied to a piece of length $ dr $ moving at speed $ \\omega r $.'),
        st('The elements sit end to end, so their emfs add: $ \\varepsilon = \\int_{0}^{l} B\\,\\omega\\,r\\,dr $',
          'Series sources add. The limits run from the pivot at $ r = 0 $ to the far end at $ r = l $.', {
            check: {
              kind: 'mcq',
              prompt: 'Why do the element emfs add rather than, say, average?',
              options: [
                'Because the elements are joined in series along the rod',
                'Because the field is uniform along the rod',
                'Because the rod has no resistance',
                'Because the rod is rotating rather than sliding',
              ],
              answer_index: 0,
              feedback_right: 'Right — walking from the pivot to the tip you pass through every element in turn, so the work per unit charge accumulates.',
              feedback_wrong: 'The elements lie one after another along the same conductor, so they are in **series**. Emfs in series add, exactly as cells in series do.',
            },
          }),
        st('$ B $ and $ \\omega $ are constants, so $ \\varepsilon = B\\,\\omega\\int_{0}^{l} r\\,dr = B\\,\\omega\\left[\\frac{r^{2}}{2}\\right]_{0}^{l} $',
          'Only $ r $ varies along the rod. Pull everything else outside the integral.'),
        st('$ \\varepsilon = \\frac{1}{2}B\\,\\omega\\,l^{2} $',
          'The factor of one half is the average of $ r $ over the rod. It is the honest bookkeeping that the tip-speed shortcut skips.', {
            check: {
              kind: 'mcq',
              prompt: 'If the angular speed is doubled, the emf becomes',
              options: ['twice as large', 'four times as large', 'half as large', 'unchanged'],
              answer_index: 0,
              feedback_right: 'Yes — $ \\omega $ appears to the first power. It is the **length** that appears squared.',
              feedback_wrong: 'Read the powers off the formula: $ \\varepsilon \\propto \\omega\\,l^{2} $. Doubling $ \\omega $ doubles the emf; doubling $ l $ would quadruple it.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A rod of length $ 0.20 $ m rotates at $ 50 $ rad/s about one end, in a field of $ 0.30 $ T perpendicular to its plane. Find the emf between its ends.',
        answer: '$ 0.30 $ V',
        solution: '$ \\varepsilon = \\frac{1}{2}B\\omega l^{2} = \\frac{1}{2}(0.30)(50)(0.20)^{2} = \\frac{1}{2}(0.30)(50)(0.040) = 0.30 $ V.',
      },
    }),
    b('latex_block', 5, {
      latex: '\\varepsilon = \\frac{1}{2}\\,B\\,\\omega\\,l^{2}',
      label: 'Rod rotating about one end, field perpendicular to its plane',
      note: 'The length is squared and the angular speed is not. In terms of frequency, since ω = 2πf, this is ε = πfBl².',
      highlight: true,
    }),
    b('text', 6, {
      markdown: '**Check it the other way.** The flux route should give the same number, and it does — in one line.\n\nIn a time $ t $ the rod sweeps through an angle $ \\theta = \\omega t $, covering a sector of area\n\n$ A = \\frac{1}{2}l^{2}\\theta = \\frac{1}{2}l^{2}\\omega t $\n\nSo $ \\Phi = BA = \\frac{1}{2}B\\,l^{2}\\omega t $, and differentiating gives $ |\\varepsilon| = \\frac{1}{2}B\\omega l^{2} $ straight away.\n\nTwo routes, same answer, exactly as on page 6. And the $ \\frac{1}{2} $ now has a second meaning: it is the $ \\frac{1}{2} $ in the area of a sector.\n\n**Which end is positive?** Use the force rule on any one element. With the field out of the page and the rod turning anticlockwise, $ \\vec{v}\\times\\vec{B} $ points **outward along the rod**, so positive charge is flung toward the rim and the **far end** is at the higher potential. Reverse either the field or the sense of rotation and the polarity flips.',
    }),
    b('heading', 7, {
      text: 'A rod that is not perpendicular to its own velocity',
      level: 2,
      objective: 'Identify the effective length, and explain why part of a conductor can contribute nothing at all.',
    }),
    b('text', 8, {
      markdown: 'Now slide a straight rod of length $ l $ through a field $ B $ that is perpendicular to the page, but let the rod sit at an angle $ \\alpha $ to its own velocity $ \\vec{v} $, both in the plane of the page.\n\nGo back to the master formula. $ \\vec{v}\\times\\vec{B} $ has magnitude $ vB $ and lies in the plane of the page, **perpendicular to $ \\vec{v} $**. Dotting it with the rod vector picks out only the part of the rod that lies along that perpendicular direction:\n\n$ \\varepsilon = (\\vec{v}\\times\\vec{B})\\cdot\\vec{l} = B\\,v\\,l\\sin\\alpha $\n\nRead the two extremes and the rule becomes obvious.\n\n**Rod perpendicular to its velocity** ($ \\alpha = 90^\\circ $): $ \\sin\\alpha = 1 $ and we are back to $ Bvl $. Every part of the rod is pulling its weight.\n\n**Rod along its own velocity** ($ \\alpha = 0^\\circ $): the emf is **zero**. The rod is sliding along its own line, so it never sweeps any new area, and the force $ q\\vec{v}\\times\\vec{B} $ on the carriers points sideways *out* of the rod rather than along it. Nothing drives charge from one end to the other.\n\nSo $ l\\sin\\alpha $ — the projection of the rod perpendicular to $ \\vec{v} $ — is the length that actually counts. It has a name: the **effective length**.',
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'spatial',
      prompt: 'A wire is bent into a semicircle of diameter $ d $ and dragged sideways at speed $ v $ through a field $ B $ perpendicular to its plane, with the diameter held perpendicular to the velocity. What is the emf between its two ends?',
      options: [
        '$ Bvd $ — the same as a straight rod joining the ends',
        '$ Bv \\times \\frac{\\pi d}{2} $, using the arc length of the wire',
        'Zero — the curvature cancels the emf along the wire',
        '$ \\frac{1}{2}Bvd $, averaging the length over the curve',
      ],
      reveal: '**$ Bvd $ — exactly what a straight rod between the same two ends would give.**\n\nThe master formula is $ \\varepsilon = (\\vec{v}\\times\\vec{B})\\cdot\\vec{l} $, and $ \\vec{l} $ is the vector **from one end to the other**. It knows nothing about the path taken in between. For a shape as awkward as you like, only the straight-line separation of the endpoints matters, projected perpendicular to $ \\vec{v} $.\n\nHere the endpoints are the two ends of the diameter, separated by $ d $ perpendicular to $ \\vec{v} $, so the effective length is $ d $ and the emf is $ Bvd $.\n\n**Why the arc-length answer is tempting and wrong:** it treats the wire like a resistor, where the path length genuinely matters. Emf is not resistance. Curving a wire adds length without adding any effective length.\n\n**Check it with flux if you prefer.** Compare the semicircle with the straight rod over the same time: the shapes of the swept regions differ, but the *rate* at which each sweeps new area is $ dv $ in both cases, because they both advance a front of width $ d $ at speed $ v $.',
      difficulty_level: 3,
    }),
    b('heading', 10, {
      text: 'The spinning disc',
      level: 2,
      objective: 'Apply the rotating-rod result to a solid conductor and read off where its terminals are.',
    }),
    b('text', 11, {
      markdown: 'Take a solid metal disc of radius $ R $ and spin it about its own axis at $ \\omega $, with the field $ B $ along that axis.\n\nThere is nothing new to derive. **Every radius of the disc is a rotating rod**, pivoted at the centre and sweeping the same field at the same angular speed. Each one develops the same emf between centre and rim:\n\n$ \\varepsilon = \\frac{1}{2}B\\,\\omega\\,R^{2} $\n\nThey are all connected at both ends — joined at the centre, joined at the rim — so they sit in **parallel**. Sources in parallel do not add their emfs; they keep the same emf and share the current. So the disc gives $ \\frac{1}{2}B\\omega R^{2} $ between its centre and its rim, and no more, however many radii you imagine.\n\nSlide one brush contact on the axle and another on the rim and you have a working generator that produces a **steady** emf, not an alternating one — the only common machine that does. Faraday built one in 1831 and it still carries his name. Its weakness is obvious the moment you build it: the emf is tiny and the currents are enormous, so it never became a practical power source. But it is the cleanest demonstration in the subject that continuous rotation can make continuous emf.',
    }),
    b('image', 12, {
      src: '',
      alt: 'Three geometries side by side: a rod rotating about one end, a rod dragged at a slant showing its effective length, and a spinning disc with contacts at the axle and rim',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Three shapes, one formula. In each case the only length that counts is the one across both the motion and the field.',
      generation_prompt: 'Clean scientific illustration, wide horizontal composition of three separate vignettes in thin dim-grey line art, divided by faint vertical rules. Left vignette: a straight bright amber rod pivoted at a small grey dot at its left end, with a curved orange arrow showing rotation and a fan of progressively longer faint velocity arrows along its length, growing from nothing at the pivot to longest at the tip. Middle vignette: a bright amber rod tilted at a slant with a bold orange arrow showing its motion to the right, and a dashed grey line dropped from each end to mark the shorter vertical projection between them, that projection drawn as a solid brighter amber segment. Right vignette: a circular disc in dim grey seen face on with a curved orange rotation arrow, small bright contact points at its centre and on its rim, and a faint radial amber line joining them. All three vignettes sit on a regular sparse array of small dim-orange dot symbols indicating a field out of the page. No text, no letters, no numbers, no labels anywhere in the image. Near-black background (#0B0C0F) throughout, with orange and amber as the only accent colours and generous dark empty space.',
    }),
    b('table', 13, {
      caption: 'The same master formula in the four arrangements you will actually be asked about.',
      headers: ['Arrangement', 'Effective length', 'Emf'],
      rows: [
        ['Rod sliding perpendicular to $ \\vec{v} $ and $ \\vec{B} $', '$ l $', '$ Bvl $'],
        ['Rod at angle $ \\alpha $ to its velocity', '$ l\\sin\\alpha $', '$ Bvl\\sin\\alpha $'],
        ['Rod rotating about one end', 'varies with $ r $ — integrate', '$ \\frac{1}{2}B\\omega l^{2} $'],
        ['Disc spinning about its axis', 'each radius, in parallel', '$ \\frac{1}{2}B\\omega R^{2} $'],
      ],
    }),
    b('callout', 14, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Master formula: $ \\varepsilon = (\\vec{v}\\times\\vec{B})\\cdot\\vec{l} $. Everything else on this page is a reading of it.\n- Rotating rod: $ \\varepsilon = \\frac{1}{2}B\\omega l^{2} $. **Never** substitute the tip speed $ \\omega l $ into $ Bvl $ — that doubles the answer.\n- The $ \\frac{1}{2} $ is the sector area $ \\frac{1}{2}l^{2}\\theta $, and equally the average of $ r $ along the rod.\n- Rod at an angle: $ \\varepsilon = Bvl\\sin\\alpha $. A rod sliding along its own length gives **zero**.\n- Effective length $ = $ straight-line separation of the two ends, projected perpendicular to $ \\vec{v} $. The shape between them is irrelevant.\n- Spinning disc: radii are in **parallel**, so $ \\varepsilon = \\frac{1}{2}B\\omega R^{2} $ between axle and rim — a steady, not alternating, emf.',
    }),
    b('text', 15, {
      markdown: 'Next: close the circuit and let the current flow, and a force appears that fights the motion. Following the energy through that force is where induction stops looking like something for nothing.',
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('A rod of length $ l $ rotates about one end at angular speed $ \\omega $ in a perpendicular field $ B $. The emf across it is',
          ['$ \\frac{1}{2}B\\omega l^{2} $', '$ B\\omega l^{2} $', '$ \\frac{1}{2}B\\omega l $', '$ 2B\\omega l^{2} $'],
          0,
          'Integrating $ B\\omega r\\,dr $ from $ 0 $ to $ l $ gives the factor of a half. Substituting the tip speed into $ Bvl $ is what produces the answer that is twice too big, because it assumes the whole rod moves as fast as its fastest point.',
          2),
        q('A straight rod is dragged through a perpendicular magnetic field along a direction **parallel to the rod itself**. The emf induced across its ends is',
          ['zero', '$ Bvl $', '$ \\frac{1}{2}Bvl $', '$ Bvl\\cos\\alpha $'],
          0,
          'With $ \\alpha = 0 $, $ \\sin\\alpha = 0 $. Physically the rod sweeps no new area, and the force on the carriers points out of the rod sideways rather than along it, so no charge is driven from one end to the other.',
          2),
        q('A wire bent into an arc is moved through a field. The emf between its ends is set by',
          ['the straight-line distance between its ends', 'the total length of wire used', 'the area under the arc', 'the radius of curvature of the arc'],
          0,
          'The master formula dots $ \\vec{v}\\times\\vec{B} $ with the vector joining the two ends, which does not depend on the path between them. Adding length by curving the wire adds resistance but no effective length.',
          3),
      ],
    }),
  ],
};

// ── p8 · The Energy Account ──────────────────────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'emi-the-energy-account',
  title: 'The Energy Account',
  subtitle: 'Every joule the resistor gives out came from somebody\'s hand',
  glossary: [
    { term: 'retarding force', definition: 'The force $ F = \\frac{B^{2}l^{2}v}{R} $ that acts on a current-carrying rod opposite to its motion, and is the mechanical face of Lenz\'s law.' },
    { term: 'terminal velocity', definition: 'The steady speed a falling conductor settles at when the retarding force from the induced current grows to balance its weight.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Suppose the force on the sliding rod pointed **forward** instead of backward — that is, suppose the induced current pushed the rod along in the direction it was already going.\n\nGive the rod one gentle push and see what follows. It speeds up. A faster rod means a bigger emf, so a bigger current, so a bigger forward push, so it speeds up more.\n\nWhere does that end?',
      hint: 'Track the energy at each stage. Something is being produced and nothing is being consumed.',
      reveal: 'It never ends. The rod accelerates without limit, the resistor gets hotter and hotter, and **nothing at all is being supplied**. You would have a machine that makes unlimited energy from one push.\n\nThat is why the opposition in Lenz\'s law is not a curiosity or a convention. It is **forced** by energy conservation. If induced effects helped the change instead of opposing it, every generator in the world would be a perpetual motion machine, and physics would be broken.\n\nThis page turns that argument into numbers. We will find the retarding force, work out the power needed to push against it, and check it against the heat coming out of the resistor. The two agree exactly, and they had to.',
    }),
    b('text', 1, {
      markdown: 'Take the same rails as page 6: rod of length $ l $ sliding at speed $ v $, field $ B $ into the page, total circuit resistance $ R $.\n\nNow the circuit is **closed**, so the emf actually drives a current:\n\n$ \\varepsilon = Bvl \\qquad\\Rightarrow\\qquad I = \\frac{\\varepsilon}{R} = \\frac{Bvl}{R} $\n\nAnd here is the step that changes everything. The rod is now a **current-carrying conductor sitting in a magnetic field**, and Chapter 5 told us exactly what happens to those: they feel a force $ F = BIl $.\n\nSo the moment charge starts flowing, the rod stops being a passive passenger and starts being pushed on.',
    }),
    b('heading', 2, {
      text: 'The force that fights back',
      level: 2,
      objective: 'Derive the retarding force on the rod and check its direction against Lenz\'s law.',
    }),
    b('text', 3, {
      markdown: 'Substitute the current we just found into the force law:\n\n$ F = B\\,I\\,l = B\\left(\\frac{Bvl}{R}\\right)l $\n\n$ F = \\frac{B^{2}l^{2}v}{R} $\n\n**Which way does it point?** Page 6 settled the current: it runs anticlockwise, which means it flows **upward through the rod**. Applying $ \\vec{F} = I\\vec{l}\\times\\vec{B} $ with the current up and the field into the page gives a force to the **left** — against the motion.\n\nSo the force opposes the velocity. It always does, whichever way you slide the rod: reverse $ v $ and the emf reverses, the current reverses, and the force reverses too. There is no way to arrange this so the force helps.\n\nThat is Lenz\'s law showing up in mechanical form. On page 5 it was a statement about induced current directions. Here it is something you can feel in your hand: **the rails push back the moment the circuit is closed.**\n\nAnd notice the dependence. The force is proportional to $ v $, so the faster you drag, the harder it resists — like moving through a thick liquid rather than against friction. That is why induction makes such good brakes, which is page 9.',
    }),
    b('latex_block', 4, {
      latex: 'F = \\frac{B^{2}l^{2}v}{R}',
      label: 'Retarding force on the sliding rod',
      note: 'Proportional to v, so it behaves like a drag force, not like friction. Zero the instant the rod stops.',
      highlight: true,
    }),
    b('reasoning_prompt', 5, {
      reasoning_type: 'quantitative',
      prompt: 'The rails are open-circuited — the resistor is disconnected, so the loop is broken. The rod is still slid at the same speed $ v $. What force is now needed to keep it moving?',
      options: [
        'None, because no current flows',
        'The same $ \\frac{B^{2}l^{2}v}{R} $, since the emf is unchanged',
        'Half as much, since only one rail is carrying charge',
        'More than before, because the charge has nowhere to go',
      ],
      reveal: '**None.** On a frictionless open circuit the rod glides on for ever.\n\nFollow the chain carefully, because each link matters. The emf is **still there** — page 6 showed it needs no circuit. But with the loop broken, $ I = 0 $. And the retarding force is $ F = BIl $, which is zero when $ I $ is zero.\n\nSo the emf alone costs nothing. **It is the current that costs energy**, because it is the current that produces both the heat and the force.\n\nThat is a useful way to remember the whole page: no current, no heat, no force, no work. Close the switch and all four appear together.\n\n**Careful with the "same force, since the emf is unchanged" reading.** It is right that the emf is unchanged, but the retarding force does not depend on the emf directly — it depends on the current, and the same emf across an infinite resistance drives none.',
      difficulty_level: 2,
    }),
    b('heading', 6, {
      text: 'The books balance, exactly',
      level: 2,
      objective: 'Show that the mechanical power supplied equals the electrical power dissipated, term for term.',
    }),
    b('text', 7, {
      markdown: 'To keep the rod at a **constant** speed you must apply an external force equal and opposite to the retarding force. The power you supply is force times speed:\n\n$ P_{\\text{agent}} = F\\,v = \\frac{B^{2}l^{2}v}{R}\\times v = \\frac{B^{2}l^{2}v^{2}}{R} $\n\nNow go to the other end of the circuit and ask how fast the resistor is turning energy into heat:\n\n$ P_{\\text{heat}} = I^{2}R = \\left(\\frac{Bvl}{R}\\right)^{2}R = \\frac{B^{2}l^{2}v^{2}}{R} $\n\nThe two expressions are **identical**. Not approximately, not to within a correction term — the same algebra.',
    }),
    b('latex_block', 8, {
      latex: 'P_{\\text{agent}} = F v = \\frac{B^{2}l^{2}v^{2}}{R} = I^{2}R = P_{\\text{heat}}',
      label: 'The energy account of a generator, in one line',
      note: 'Mechanical power in, electrical power out. This IS what a generator is.',
      highlight: true,
    }),
    b('text', 9, {
      markdown: 'Take a moment over what that equation actually says, because it is the point of the whole chapter.\n\n**You are not extracting energy from the magnetic field.** The field is unchanged at the end of the experiment; it is not used up, and it supplied nothing. Its role is to be the mechanism, not the fuel.\n\n**You are converting mechanical work into heat, and induction is the machinery that does the converting.** The magnetic force, as page 6 explained, does no net work at all — it simply transfers what your hand puts in.\n\nStop pushing and the account settles immediately: the rod slows, the emf falls, the current falls, the heating stops. Nothing is left over. Nothing was created.\n\n**This is a generator.** A power station is this rod, industrialised. The turbine is the hand; steam or falling water pushes it; and the retarding force is what the turbine has to work against. Switch on a heavy load somewhere on the grid and the current rises, the retarding torque on the generator rises with it, and the turbine needs more steam. The load at your end is *felt* at the power station — through exactly the algebra above.',
    }),
    b('worked_example', 10, {
      label: 'the whole account, with numbers',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A rod of length $ 0.50 $ m and mass $ 0.20 $ kg slides on frictionless horizontal rails closed by a resistance of $ 2.0\\ \\Omega $, in a vertical field of $ 0.40 $ T. It is held at a steady $ 10 $ m/s. Find (a) the emf, (b) the current, (c) the retarding force, (d) the power you must supply, and (e) check it against the heat produced. Then (f) the rod is released. How long does it take for its speed to fall to $ 1/e $ of its value, and how much heat appears in total?',
      solution: '**(a) The emf.**\n\n$ \\varepsilon = Bvl = (0.40)(10)(0.50) = 2.0\\ \\text{V} $\n\n**(b) The current.**\n\n$ I = \\frac{\\varepsilon}{R} = \\frac{2.0}{2.0} = 1.0\\ \\text{A} $\n\n**(c) The retarding force.**\n\n$ F = BIl = (0.40)(1.0)(0.50) = 0.20\\ \\text{N} $\n\nOr straight from the formula: $ F = \\frac{B^{2}l^{2}v}{R} = \\frac{(0.16)(0.25)(10)}{2.0} = 0.20 $ N. Same answer, as it must be.\n\n**(d) Power supplied.**\n\n$ P = Fv = (0.20)(10) = 2.0\\ \\text{W} $\n\n**(e) Power dissipated — the check.**\n\n$ P = I^{2}R = (1.0)^{2}(2.0) = 2.0\\ \\text{W} $ ✓\n\nThe books balance. **Do this check on every problem of this type** — it catches an arithmetic slip in one line, and examiners like to ask for it explicitly.\n\n**(f) Now let go.**\n\nWith no external force, the only horizontal force left is the retarding one, so Newton\'s second law reads\n\n$ m\\frac{dv}{dt} = -\\frac{B^{2}l^{2}v}{R} $\n\nThe rate of change of $ v $ is proportional to $ v $ itself, which is the signature of exponential decay — the same shape as a discharging capacitor from Chapter 2. So $ v = v_{0}e^{-t/\\tau} $ with\n\n$ \\tau = \\frac{mR}{B^{2}l^{2}} = \\frac{(0.20)(2.0)}{(0.16)(0.25)} = \\frac{0.40}{0.040} = 10\\ \\text{s} $\n\nSo the speed drops to $ 1/e $ of its value after $ 10 $ s. The rod never formally stops — it just gets exponentially slower, because the braking force fades away with the speed.\n\n**Total heat.** No cheating with integrals needed. All the kinetic energy the rod had must end up in the resistor, since nothing else can take it:\n\n$ Q = \\frac{1}{2}mv_{0}^{2} = \\frac{1}{2}(0.20)(10)^{2} = 10\\ \\text{J} $\n\nThat energy-accounting shortcut is worth keeping. Whenever a conductor is left to be stopped by induction alone, the total heat is simply the kinetic energy it started with.',
    }),
    b('image', 11, {
      src: '',
      alt: 'The sliding rod with the applied force forward and the induced retarding force backward, and an energy-flow arrow running from the hand through the circuit into the resistor',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Two forces on the rod, equal and opposite at constant speed. Below, the same story as an energy flow: everything the hand puts in comes out of the resistor as heat.',
      generation_prompt: 'Clean scientific diagram, wide horizontal composition in thin dim-grey line art, split into an upper and a lower band. Upper band: two horizontal rails closed at the left by a small rectangular resistor block, a short vertical bright amber bar across them, a bold amber arrow from the bar pointing right for the applied force and an equally bold cool-blue arrow from the same point pointing left for the retarding force, with the enclosed rectangle filled by a sparse regular array of small dim-orange cross symbols; a glowing orange arrowhead trail circulates anticlockwise round the loop. Lower band: a simple left-to-right energy flow as three rounded boxes of equal size joined by thick tapering amber arrows of constant width, the first box containing a small stylised hand pushing, the middle a small circuit loop glyph, the last a resistor glyph with wavy heat lines rising from it. No text, no letters, no numbers, no labels anywhere in the image. Near-black background (#0B0C0F) throughout, with orange and amber as the accent colours apart from the single blue force arrow, and generous dark empty space.',
    }),
    b('text', 12, {
      markdown: '**One more standard arrangement, because it is asked constantly.** Stand the rails up vertically and let the rod fall under gravity. Two forces now compete: weight $ mg $ pulling it down, and the retarding force $ \\frac{B^{2}l^{2}v}{R} $ growing as it speeds up.\n\nAt first the rod accelerates. But the faster it goes, the harder induction resists, and there is a speed at which the two balance exactly:\n\n$ mg = \\frac{B^{2}l^{2}v_{T}}{R} \\qquad\\Rightarrow\\qquad v_{T} = \\frac{mgR}{B^{2}l^{2}} $\n\nBeyond that point the net force is zero and the rod falls at a constant **terminal velocity** — and every joule of gravitational potential energy it loses from then on goes straight into the resistor, since its kinetic energy has stopped changing.\n\nThat is precisely a parachute, with induction in place of air resistance. It is also, in essence, how a magnetic brake works — which is where page 9 begins.',
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- $ I = \\frac{Bvl}{R} $, and the rod then feels $ F = BIl = \\frac{B^{2}l^{2}v}{R} $, always **opposing** the motion.\n- $ F \\propto v $ — a drag, not a friction. It vanishes when the rod stops.\n- $ P_{\\text{agent}} = Fv = \\frac{B^{2}l^{2}v^{2}}{R} = I^{2}R = P_{\\text{heat}} $. Always check these two against each other.\n- **Open circuit: emf yes, current no, force no, work no.** All four arrive together when the switch closes.\n- Released on frictionless rails: $ v = v_{0}e^{-t/\\tau} $ with $ \\tau = \\frac{mR}{B^{2}l^{2}} $, and total heat $ = \\frac{1}{2}mv_{0}^{2} $.\n- Falling on vertical rails: terminal velocity $ v_{T} = \\frac{mgR}{B^{2}l^{2}} $.\n- The field supplies nothing. Induction converts mechanical work into heat; it never creates energy.',
    }),
    b('text', 14, {
      markdown: 'Next: stop using a neat wire loop. Let the changing flux pass through a solid block of metal instead, and the induced currents swirl wherever they like.',
    }),
    b('inline_quiz', 15, {
      pass_threshold: 0.6,
      questions: [
        q('The retarding force on a rod sliding at speed $ v $ on rails of total resistance $ R $ is',
          ['$ \\frac{B^{2}l^{2}v}{R} $', '$ \\frac{B^{2}l^{2}v^{2}}{R} $', '$ \\frac{Bl^{2}v}{R} $', '$ \\frac{B^{2}lv}{R} $'],
          0,
          'Combine $ I = Bvl/R $ with $ F = BIl $. The $ v^{2} $ version is the **power**, not the force, and confusing the two is the usual slip here.',
          2),
        q('The rails are open-circuited and the rod is pushed at the same steady speed. The power the pusher must supply is',
          ['zero', 'unchanged', 'doubled', 'halved'],
          0,
          'No closed path means no current, and with $ I = 0 $ the retarding force $ BIl $ vanishes. The emf is still present across the rod\'s ends, but an emf on its own costs nothing to maintain.',
          2),
        q('A rod is released on frictionless horizontal rails with speed $ v_{0} $ and left to be stopped by induction alone. The total heat produced in the circuit is',
          ['$ \\frac{1}{2}mv_{0}^{2} $', '$ mv_{0}^{2} $', '$ \\frac{B^{2}l^{2}v_{0}}{R} $', 'it depends on $ R $'],
          0,
          'Energy accounting settles it without any integration: the kinetic energy has nowhere else to go. Changing $ R $ alters how *quickly* the heat appears, but not how much.',
          3),
      ],
    }),
  ],
};

// ── p9 · Eddy Currents ───────────────────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'emi-eddy-currents',
  title: 'Eddy Currents',
  subtitle: 'What happens when the induced current is not confined to a wire',
  glossary: [
    { term: 'eddy currents', definition: 'Circulating currents induced inside the body of a solid conductor when the magnetic flux through it changes.' },
    { term: 'lamination', definition: 'Building a magnetic core from thin insulated sheets instead of one solid block, so that eddy current loops are confined to small cross-sections.' },
    { term: 'electromagnetic damping', definition: 'The slowing of a moving conductor by the retarding force from the eddy currents its own motion induces.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Take a thick copper pipe and hold it upright. Drop a small steel ball down it and it falls straight through, in the time you would expect.\n\nNow drop a strong magnet of the same size and weight down the same pipe.\n\nIt takes several seconds to come out — drifting down as though the pipe were full of honey. Copper is not magnetic; a magnet will not stick to it at all. So what is holding the magnet up?',
      hint: 'The magnet is moving, so the flux through each ring of the pipe wall is changing. What does a conductor do about a changing flux?',
      reveal: 'Think of the pipe as a stack of copper rings.\n\nAs the magnet falls toward a ring, the flux through it grows, so a current is induced that opposes the growth — and that ring repels the magnet from below. As the magnet passes and moves away, the flux through the ring falls, so the current reverses and the ring now attracts it from above.\n\n**Every ring pulls back on the magnet, above and below.** The retarding force grows with speed, exactly as on page 8, so the magnet settles at a slow terminal velocity and drifts down.\n\nNo wire, no circuit, no connections. The currents simply circulate in the metal itself. They are called **eddy currents**, and this page is about the trouble they cause and the work they do.',
    }),
    b('text', 1, {
      markdown: 'Everything so far in this chapter has used a **wire**: a loop, a coil, a rod on rails. The induced current had exactly one path available and had no choice but to take it.\n\nNow put a solid slab of metal in a changing magnetic field, and the situation changes in one respect only. The emf is induced exactly as before — Faraday\'s law does not care what shape the conductor is. But the current is no longer forced along a single track. **It can circulate anywhere in the metal, and it does.**\n\nThe result is closed loops of current swirling inside the body of the conductor, in planes perpendicular to the field. They were named **eddy currents** after the swirls in a river, and Foucault studied them in detail, which is why you will occasionally see them called Foucault currents.\n\nTheir direction obeys Lenz\'s law without exception: each loop flows so as to oppose the change in flux that produced it. Everything else on this page follows from that one sentence.',
    }),
    b('heading', 2, {
      text: 'Why a solid block behaves so differently from a wire',
      level: 2,
      objective: 'Explain why eddy currents in bulk metal are large, and where their energy goes.',
    }),
    b('text', 3, {
      markdown: 'The emfs involved are usually small — millivolts. So why do eddy currents matter at all?\n\n**Because the resistance is tiny.** A loop inside a solid block is short, fat and made of metal. Its cross-section may be square centimetres rather than the fraction of a square millimetre in a wire. With $ I = \\varepsilon/R $ and $ R $ down by a factor of thousands, a small emf drives a very large current.\n\nAnd a large current in a resistance produces heat at a rate $ I^{2}R $. In a solid transformer core that heat can be enough to matter within seconds.\n\nSo eddy currents show up in two opposite ways, and it is worth sorting them from the start:\n\n**As a nuisance.** In any device with a changing field inside metal parts — transformers, motors, generators — eddy currents waste energy as heat and warm up components that were not meant to get warm.\n\n**As a tool.** That same heating melts metal in an induction furnace and cooks food on an induction hob. And that same retarding force stops trains and damps instrument needles.\n\nThe physics is identical in both columns. Whether it is a defect or a feature depends only on whether you wanted the heat.',
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'logical',
      prompt: 'A flat metal plate is set swinging like a pendulum so that it passes in and out of the gap of a strong magnet. It stops after two or three swings. The experiment is repeated with an identical plate that has several long slots cut into it. What happens?',
      options: [
        'It swings far longer, because the slots break up the current loops',
        'It stops even faster, because the slots make it lighter',
        'It behaves exactly the same, since the metal is unchanged',
        'It stops instantly, because the slots concentrate the field',
      ],
      reveal: '**It swings far longer.** This is a classic demonstration and it is worth understanding rather than remembering.\n\nIn the solid plate, wide low-resistance loops of eddy current form as it enters and leaves the field. Those currents produce a retarding force — the same $ F \\propto v $ drag as page 8 — and the plate\'s kinetic energy is converted to heat in a couple of swings.\n\nCutting slots does not change the emf at all. What it changes is the **path**. The wide loops are chopped into narrow ones, each with a much smaller area (so a smaller emf around it) and a much longer, thinner path (so a higher resistance). Less current, less force, less heating — and the plate swings on.\n\n**Note what did not change:** the metal, its conductivity, and the field are all the same. Only the geometry available to the current was altered.\n\nHold on to that, because the next section is the same idea applied to a transformer core, where it saves a great deal of money.',
      difficulty_level: 2,
    }),
    b('heading', 5, {
      text: 'The fix that every transformer and motor uses',
      level: 2,
      objective: 'Explain why cores are laminated, and which way the sheets must lie.',
    }),
    b('text', 6, {
      markdown: 'Open any transformer, any motor, any generator, and the iron core is never a solid block. It is a stack of **thin sheets**, each a few tenths of a millimetre thick, coated with insulating varnish and clamped together.\n\nThat is called **lamination**, and it is the slotted-plate trick, done properly.\n\nThe core has to be there — the iron is what concentrates the magnetic flux and makes the device work at all. But the flux inside it is alternating, so the core is a conductor sitting in a changing field, and it will carry eddy currents. Slicing it into insulated sheets confines each eddy loop to one thin sheet:\n\n- **The loop area collapses**, so the emf driving each loop collapses with it.\n- **The path becomes long and thin**, so its resistance goes up.\n\nBoth effects cut the current, and the heating falls faster than either — for thin sheets the eddy-current loss goes roughly as the **square** of the sheet thickness:\n\n$ P_{\\text{eddy}} \\propto \\frac{B^{2}f^{2}d^{2}}{\\rho} $\n\nwhere $ d $ is the thickness of one sheet, $ f $ the frequency and $ \\rho $ the resistivity of the metal. Halve the thickness and you cut the loss to a quarter. Only the $ d^{2} $ matters for most questions, but the $ \\rho $ in the denominator explains the second half of the design: cores are made of **silicon steel**, whose added silicon raises the resistivity well above that of plain iron, cutting the loss again without spoiling the magnetic behaviour.\n\nThese are exactly the "eddy current losses" that will reappear in Chapter 7 when we account for where a transformer\'s missing energy goes.',
    }),
    b('reasoning_prompt', 7, {
      reasoning_type: 'spatial',
      prompt: 'The magnetic flux runs along the length of a transformer core. How must the laminations be stacked for them to do any good?',
      options: [
        'As sheets lying parallel to the flux, stacked across it',
        'As sheets lying perpendicular to the flux, stacked along it',
        'The orientation makes no difference as long as they are insulated',
        'As sheets at 45° to the flux, to split the difference',
      ],
      reveal: '**The sheets must lie parallel to the flux, stacked across it** — so that the insulating gaps sit across the plane in which the eddy currents want to circulate.\n\nThe reasoning is one step. Eddy currents circulate in planes **perpendicular** to the field, because that is the plane in which the flux through a loop is changing. To break those loops you must put insulation across that plane — which means slicing the core in a direction that runs *along* the flux.\n\nStack the sheets the other way, face-on to the flux, and each sheet is a full-width disc in the plane where the eddy currents already flow. You would have changed nothing about the loops, while adding gaps that obstruct the magnetic flux itself and spoil the core.\n\n**And there is a second reason the orientation is not free.** Insulating gaps cutting across the flux path create air gaps in the magnetic circuit, which the design is specifically trying to avoid. Laid the right way, the laminations block the electrical loops without interrupting the magnetic path at all.',
      difficulty_level: 3,
    }),
    b('image', 8, {
      src: '',
      alt: 'A solid metal block with one wide eddy current loop beside a laminated stack in which the same loop is broken into many small ones',
      width: 'full',
      aspect_ratio: '16:9',
      caption: 'Same metal, same field, same emf. Slicing the block confines each loop to one thin sheet, and the heating falls with the square of the thickness.',
      generation_prompt: 'Clean scientific illustration, wide horizontal composition of two side-by-side vignettes in thin dim-grey line art, separated by a faint vertical rule. Left vignette: a solid rectangular metal block drawn in three-quarter perspective with a dim grey body, containing one large bright orange circulating current loop drawn with arrowheads, glowing warmly, with faint wavy heat lines rising from the block. Right vignette: an identical block but visibly sliced into about eight thin vertical sheets with narrow dark insulating gaps between them, each sheet containing its own much smaller and dimmer orange current loop, and only very faint heat lines. Long straight dim-orange field arrows run through both blocks in the same direction, lying along the plane of the sheets in the right-hand vignette. No text, no letters, no numbers, no labels anywhere in the image. Near-black background (#0B0C0F) throughout, with orange and amber as the only accent colours and generous dark empty space.',
    }),
    b('callout', 9, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: '**Stopping a train without touching it.** A high-speed train carries an electromagnet held a few millimetres above the rail. Energise it and the rail — a long conductor with a changing field sweeping over it — fills with eddy currents that oppose the motion. The train is braked by a force it never physically touches.\n\nThe advantages are exactly what a railway wants. **Nothing wears out**, because no surfaces rub. **Nothing fades**, because there are no brake pads to overheat. And the braking is smooth rather than grabbing, since the force builds with speed instead of biting all at once.\n\nBut read page 8 again and the limitation is already there: the force is proportional to $ v $. As the train slows, the braking weakens; at a standstill it is zero. **An eddy-current brake cannot hold a stopped train, and cannot bring it to a complete halt on its own.** So it is used as the service brake at high speed, with conventional friction brakes taking over for the last stretch and for parking.\n\nThe same physics, in miniature, is the fin brake on a roller coaster and the damping vane inside a sensitive laboratory balance — the vane is why the pointer settles at its reading instead of oscillating about it for a minute.',
      image_prompt: 'Clean scientific illustration in thin dim-grey line art, wide horizontal composition. A simplified side view of a train bogie and wheel outlined in dim grey travelling to the right above a long horizontal rail, with a rectangular electromagnet block suspended just above the rail surface leaving a narrow visible gap. Within the rail directly beneath the magnet, several flattened elliptical orange current loops with arrowheads swirl in the metal, brightest under the magnet and fading away along the rail. A bold amber arrow shows the direction of travel and a shorter cool-blue arrow points the opposite way from the magnet to indicate the braking force. No text, no letters, no numbers, no labels anywhere in the image. Near-black background (#0B0C0F) throughout, with orange and amber as the accent colours apart from the single blue arrow, and generous dark empty space.',
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Real-World Application',
      markdown: '**Melting steel with no flame.** An induction furnace is a crucible wrapped in a water-cooled copper coil carrying a large alternating current. The metal charge inside sits in a rapidly changing field, eddy currents flood through it, and $ I^{2}R $ heating melts it — often within minutes.\n\nNothing touches the metal and nothing burns, so no combustion products can get into the melt. That is why induction furnaces dominate the making of stainless and other special steels, where a trace of contamination ruins the batch. The stirring is a bonus: the same currents interact with the field and keep the melt mixing itself.\n\n**And the same machine sits in millions of kitchens.** An induction hob is a flat coil under a ceramic top carrying an alternating current at around $ 20 $ to $ 40 $ kHz. It induces eddy currents in the **base of the pan**, and the pan heats itself. The hob surface never becomes a heating element — it only warms up by contact with the pan, which is why a spill does not burn on and why the surface is cool again soon after the pan is lifted.\n\nThere is a catch that anyone who has bought one knows: the pan must be **ferromagnetic** — steel or cast iron. Aluminium and copper pans are excellent conductors but the field does not couple into them nearly as well at these frequencies, so most simply will not heat. A fridge magnet sticking to the base is the standard shop test.',
      image_prompt: 'Clean scientific illustration in thin dim-grey line art, wide horizontal composition of two side-by-side vignettes separated by a faint vertical rule. Left vignette: a cutaway crucible outlined in dim grey wrapped in a helical copper-toned coil, with the molten charge inside glowing bright amber and small orange circulating current loops with arrowheads swirling within the melt. Right vignette: a cutaway side view of a flat cooktop showing a spiral coil beneath a thin ceramic slab drawn as a dim grey line, a heavy flat-based pan resting on top, and orange circulating current loops with arrowheads confined entirely inside the pan base which glows warm amber while the slab beneath it stays dark and cool. No text, no letters, no numbers, no labels anywhere in the image. Near-black background (#0B0C0F) throughout, with orange and amber as the only accent colours and generous dark empty space.',
    }),
    b('table', 11, {
      caption: 'The same effect, filed under two different headings. What separates them is only whether the heat was wanted.',
      headers: ['Where', 'What eddy currents do', 'What is done about it'],
      rows: [
        ['Transformer and motor cores', 'waste energy as heat, warm the core', 'laminate the core; use high-resistivity silicon steel'],
        ['Eddy-current brakes on trains', 'oppose the motion with a force $ \\propto v $', 'used deliberately; friction brakes finish the stop'],
        ['Moving-coil meters and balances', 'damp the pointer so it settles at once', 'used deliberately — the metal former is the damper'],
        ['Induction furnace', 'heat the charge until it melts, with no contact', 'used deliberately; high current, high frequency'],
        ['Induction hob', 'heat the pan base directly', 'used deliberately; needs ferromagnetic cookware'],
        ['Metal detectors', 'reveal buried metal by the field their loops radiate', 'used deliberately — the detector listens for them'],
      ],
    }),
    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Quick Recap',
      markdown: '- Eddy currents are induced loops circulating **inside the body** of a conductor, in planes perpendicular to the field.\n- Their direction obeys Lenz\'s law: each loop opposes the flux change that made it.\n- They are large because bulk metal has a very **low resistance**, not because the emf is large.\n- Nuisance: $ I^{2}R $ heating in cores. Fix: **laminate**, and use high-resistivity silicon steel.\n- Sheets must lie **parallel to the flux** so the insulation cuts across the current loops without breaking the magnetic path.\n- $ P_{\\text{eddy}} \\propto d^{2} $ — halve the sheet thickness and the loss falls to a quarter.\n- Useful: magnetic braking, instrument damping, induction furnaces, induction hobs, metal detectors.\n- Braking force $ \\propto v $, so it fades to zero at rest and cannot hold a stationary vehicle.',
    }),
    b('text', 13, {
      markdown: 'Every source of changing flux so far has come from **outside** the circuit — a magnet you moved, a field you switched, a rod you pushed. Next: a circuit\'s own current makes a magnetic field of its own, so changing that current changes its own flux, and it induces an emf in **itself**.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('Eddy currents in a solid metal block are large mainly because',
          ['the block offers a very low resistance', 'the induced emf is unusually large', 'metals have no self-inductance', 'the magnetic field inside metal is stronger'],
          0,
          'The emf is typically only millivolts. What makes the current big is $ I = \\varepsilon/R $ with a short, wide, metallic path, so $ R $ is a tiny fraction of what a wire loop would offer.',
          2),
        q('Transformer cores are laminated in order to',
          ['reduce eddy current losses', 'increase the flux through the core', 'reduce the resistance of the windings', 'prevent the core from becoming magnetised'],
          0,
          'The insulated sheets confine each eddy loop to a thin cross-section, cutting both the loop area and the current. The magnetic behaviour of the core is deliberately left alone, which is why the sheets lie along the flux.',
          1),
        q('An eddy-current brake cannot bring a train to a complete stop because the braking force',
          ['falls to zero as the speed falls to zero', 'heats the rail until it stops working', 'acts only while the magnet is switched off', 'reverses direction below a certain speed'],
          0,
          'The force comes from an induced current, which needs a changing flux, which needs motion. With $ F \\propto v $ the braking fades away exactly as the train slows, so friction brakes are needed for the last stretch and for parking.',
          2),
      ],
    }),
  ],
};

async function main() {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db, CH);
    await upsertPages(db, bookId, CH, [p6, p7, p8, p9]);
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
