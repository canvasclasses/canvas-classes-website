'use strict';
/**
 * Class 11 Physics · Chapter 4 "Laws of Motion" — pages 14–15.
 * Wave 3b: the recap (mind map + one formula table + reasoning probes + a
 * 10-question chapter quiz), and all 23 NCERT Ch.4 exercises transcribed
 * VERBATIM (Rule 0) and fully solved, regrouped into four themes.
 *
 * SLUG NOTE (Ch.3 lesson): the `book_pages` unique index is on
 * {book_id, slug} ONLY — not per chapter. So every close-out page here is
 * chapter-qualified from the start: `laws-of-motion-recap`,
 * `laws-of-motion-ncert-exercises`, `laws-of-motion-jee-neet-drill`.
 *
 * Run: node scripts/physics11-book/build_ch4_practice.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch4');

// ── p14 · Quick Recap ───────────────────────────────────────────────────────
const p14 = {
  page_number: 14,
  slug: 'laws-of-motion-recap',
  title: 'Quick Recap — Laws of Motion',
  subtitle: 'Every result in the chapter, on one page',
  blocks: [
    b('callout', 0, {
      variant: 'note',
      title: 'How to use this page',
      markdown: 'Do not read it straight through. Cover the right-hand column of the map, state each idea from memory, then reveal. Anything you cannot state is the page you should reread — the map names it.',
    }),
    b('mind_map', 1, {
      title: 'The whole chapter on one map',
      root_label: 'Laws of Motion',
      intro: 'Six branches, matching the six things this chapter actually asks you to be able to do.',
      branches: [
        {
          id: 'br-laws',
          label: "Newton's three laws",
          children: [
            { id: 'l-first', label: 'First Law — inertia', summary: 'Zero net force means zero acceleration. Uniform motion needs no force to continue; only a CHANGE in motion does. Mass is the measure of inertia.' },
            { id: 'l-second', label: 'Second Law', formula: '$ \\mathbf{F} = d\\mathbf{p}/dt = m\\mathbf{a} $', summary: 'The momentum form is the general one; F = ma assumes constant mass. 1 N gives 1 kg an acceleration of 1 m/s².' },
            { id: 'l-impulse', label: 'Impulse', formula: '$ \\mathbf{J} = \\mathbf{F}\\Delta t = \\Delta\\mathbf{p} $', summary: 'Use whenever a TIME connects force to motion. A perfect bounce-back at unchanged speed gives J = 2mv, not mv.' },
            { id: 'l-third', label: 'Third Law — force pairs', summary: 'Equal, opposite, simultaneous, and on TWO DIFFERENT BODIES. Two forces on the same body are never a Third Law pair, however equal and opposite.' },
          ],
        },
        {
          id: 'br-fbd',
          label: 'Free body diagrams',
          children: [
            { id: 'l-fbd', label: 'The discipline', summary: 'One body at a time. Only forces acting ON it, from things touching it, plus gravity. Never a force it exerts elsewhere.' },
            { id: 'l-normal', label: 'Normal force', summary: 'Perpendicular to the surface, and NOT always mg. On an incline N = mg cosθ; on a vertical wall N is set by your push; in a lift N = m(g±a).' },
            { id: 'l-tension', label: 'Tension', summary: 'A string can only PULL, and only along its own length. An ideal pulley changes its direction but not its magnitude.' },
          ],
        },
        {
          id: 'br-constraint',
          label: 'Connected & constrained bodies',
          children: [
            { id: 'l-system', label: 'The system method', formula: '$ a = F/(m_1+m_2+\\ldots) $', summary: 'Treat connected bodies as one to find the shared acceleration — internal tensions cancel. Then isolate ONE body to find a tension.' },
            { id: 'l-atwood', label: 'Fixed pulley', formula: '$ a = \\dfrac{(m_2-m_1)g}{m_1+m_2},\\ T = \\dfrac{2m_1m_2g}{m_1+m_2} $', summary: 'One string over one fixed pulley forces both sides to the same MAGNITUDE of acceleration. Any number of fixed pulleys changes nothing.' },
            { id: 'l-movable', label: 'Movable pulley', formula: '$ a_{\\text{single}} = 2\\,a_{\\text{movable}} $', summary: 'Two segments support the load, so 2T lifts it — but it moves at half the rate. Pull twice the rope for half the force.' },
          ],
        },
        {
          id: 'br-friction',
          label: 'Friction',
          children: [
            { id: 'l-static', label: 'Static — self-adjusting', formula: '$ f_s \\le \\mu_s N $', summary: 'Supplies exactly what is needed to prevent sliding, up to a ceiling. NEVER write f = μN for a body that is not sliding.' },
            { id: 'l-kinetic', label: 'Kinetic — fixed', formula: '$ f_k = \\mu_k N $', summary: 'Once sliding starts, friction is frozen at this value however hard you push. And μ_k < μ_s, which is why things lurch when they break free.' },
            { id: 'l-repose', label: 'Angle of repose', formula: '$ \\tan\\alpha = \\mu $', summary: 'The incline angle at which sliding just begins — mass-independent, and numerically equal to the angle of friction λ.' },
            { id: 'l-pullpush', label: 'Pulling beats pushing', formula: '$ F = \\dfrac{\\mu mg}{\\cos\\theta \\pm \\mu\\sin\\theta} $', summary: 'Pulling up reduces N (plus sign, smaller F); pushing down increases it (minus sign, larger F). Optimum pull angle: tanθ = μ.' },
            { id: 'l-wall', label: 'Vertical wall', formula: '$ F_{\\min} = mg/\\mu $', summary: 'N is set by your push, not by weight; friction acts vertically and is the only thing holding the block up.' },
          ],
        },
        {
          id: 'br-pseudo',
          label: 'Pseudo force',
          children: [
            { id: 'l-pseudo', label: 'The trick', formula: '$ \\mathbf{F}_{\\text{pseudo}} = -m\\mathbf{a}_{\\text{frame}} $', summary: 'Magnitude ma, opposite to the frame\'s acceleration. No Third Law partner. Choose one frame and stay in it.' },
            { id: 'l-lift', label: 'Apparent weight', formula: '$ N = m(g \\pm a) $', summary: 'Depends on ACCELERATION, never on velocity. Free fall gives N = 0 — weightlessness is zero contact force, not zero gravity.' },
            { id: 'l-effgrav', label: 'Effective gravity', formula: '$ \\tan\\theta = a/g,\\ g_{\\text{eff}} = \\sqrt{g^2+a^2} $', summary: 'In a horizontally accelerating frame, "down" tilts. Everything hanging freely lines up with it.' },
            { id: 'l-wedge', label: 'Free wedge', formula: '$ A = \\dfrac{mg\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta} $', summary: 'The hardest picture in the chapter, made tractable by stepping into the wedge\'s own frame.' },
          ],
        },
        {
          id: 'br-circular',
          label: 'Circular dynamics',
          children: [
            { id: 'l-centripetal', label: 'Centripetal force is a ROLE', formula: '$ \\sum F_{\\text{inward}} = mv^2/r $', summary: 'Not a new force. Tension, gravity, normal force or friction supplies it. Never draw mv²/r as its own arrow.' },
            { id: 'l-conical', label: 'Conical pendulum', formula: '$ v = \\sqrt{rg\\tan\\theta},\\ T_{\\text{period}} = 2\\pi\\sqrt{L\\cos\\theta/g} $', summary: 'Tension does two jobs: its vertical part holds the bob up, its horizontal part turns it.' },
            { id: 'l-vertical', label: 'Vertical circle', formula: '$ v_{\\text{top}} = \\sqrt{gR},\\ u_{\\text{bottom}} = \\sqrt{5gR} $', summary: 'At the top, gravity alone can do the turning. Tension is ZERO at the top and 6mg at the bottom in the critical case.' },
            { id: 'l-banking', label: 'Banking', formula: '$ v_{\\text{design}} = \\sqrt{rg\\tan\\theta} $', summary: 'The normal force turns the car, so it works even on ice. Above the design speed friction acts down the slope; below it, up.' },
          ],
        },
      ],
    }),
    b('table', 2, {
      caption: 'Every formula in the chapter, in one place',
      headers: ['Situation', 'Relation', 'Watch out for'],
      rows: [
        ['Second law', '$ \\mathbf{F} = d\\mathbf{p}/dt = m\\mathbf{a} $', 'F is the NET external force'],
        ['Impulse', '$ \\mathbf{J} = \\mathbf{F}\\Delta t = \\Delta\\mathbf{p} $', 'A perfect reversal gives $ 2mv $'],
        ['Block on incline (smooth)', '$ N = mg\\cos\\theta,\\ a = g\\sin\\theta $', 'Mass cancels from $ a $'],
        ['Connected bodies', '$ a = \\dfrac{F}{\\sum m},\\ T = m_{\\text{other}}\\,a $', 'Isolate the block F is NOT applied to'],
        ['Atwood machine', '$ a = \\dfrac{(m_2-m_1)g}{m_1+m_2},\\ T = \\dfrac{2m_1m_2g}{m_1+m_2} $', 'Same $ |a| $ on both sides'],
        ['Movable pulley', '$ a_{\\text{single}} = 2a_{\\text{movable}} $, load felt as $ 2T $', 'Two segments, half the motion'],
        ['Static friction', '$ f_s \\le \\mu_s N $', 'Self-adjusting — find it from equilibrium'],
        ['Kinetic friction', '$ f_k = \\mu_k N $', 'Only once actually sliding'],
        ['Angle of repose / friction', '$ \\tan\\alpha = \\tan\\lambda = \\mu $', 'Independent of mass'],
        ['Rough incline', '$ a = g(\\sin\\theta - \\mu\\cos\\theta) $', 'Moves only if $ \\tan\\theta > \\mu $'],
        ['Pull / push at angle θ', '$ F = \\dfrac{\\mu mg}{\\cos\\theta \\pm \\mu\\sin\\theta} $', '+ for pulling up, − for pushing down'],
        ['Optimum pulling angle', '$ \\tan\\theta = \\mu,\\ F_{\\min} = \\dfrac{\\mu mg}{\\sqrt{1+\\mu^2}} $', 'Curve is flat near the minimum'],
        ['Block on vertical wall', '$ F_{\\min} = mg/\\mu $', '$ N $ is your push, not $ mg $'],
        ['Stacked blocks', '$ a_{\\max} = \\mu m_{\\text{top}}\\,g / m_{\\text{bottom}} $', 'Lower block driven only by friction'],
        ['Pseudo force', '$ \\mathbf{F}_{\\text{pseudo}} = -m\\mathbf{a}_{\\text{frame}} $', 'No Third Law partner'],
        ['Apparent weight in a lift', '$ N = m(g \\pm a) $', 'Acceleration, never velocity'],
        ['Hanging bob in accelerating frame', '$ \\tan\\theta = a/g,\\ T = m\\sqrt{g^2+a^2} $', 'Effective gravity is tilted'],
        ['Block on a free wedge', '$ A = \\dfrac{mg\\sin\\theta\\cos\\theta}{M+m\\sin^2\\theta} $', 'Check the $ M\\to\\infty $ limit'],
        ['Centripetal requirement', '$ \\sum F_{\\text{inward}} = mv^2/r = m\\omega^2 r $', 'It is a role, not an extra force'],
        ['Conical pendulum', '$ v = \\sqrt{rg\\tan\\theta},\\ T_{\\text{period}} = 2\\pi\\sqrt{\\dfrac{L\\cos\\theta}{g}} $', '$ r = L\\sin\\theta $'],
        ['Vertical circle', '$ v_{\\text{top}} = \\sqrt{gR},\\ u_{\\text{bottom}} = \\sqrt{5gR} $', 'Tension $ 0 $ at top, $ 6mg $ at bottom'],
        ['Flat bend', '$ v_{\\max} = \\sqrt{\\mu rg} $', 'Collapses on a wet road'],
        ['Banked, no friction', '$ v = \\sqrt{rg\\tan\\theta} $', 'The design speed; mass-independent'],
        ['Banked, with friction', '$ v_{\\max/\\min} = \\sqrt{\\dfrac{rg(\\tan\\theta \\pm \\mu)}{1 \\mp \\mu\\tan\\theta}} $', 'Sign of μ flips between the two'],
      ],
    }),
    b('reasoning_prompt', 3, {
      reasoning_type: 'logical',
      prompt: 'A book lies on a table. Its weight is 20 N and the table pushes up on it with 20 N. A student says: "These are equal and opposite, so by Newton\'s Third Law they are an action–reaction pair, and that is why the book stays still." Two separate things are wrong with that sentence. Name both.',
      reveal: '**Error one: they are not a Third Law pair.** Both forces act on the SAME body — the book. A Third Law pair must act on two *different* bodies. The real partner of "table pushes up on book" is "book pushes down on table"; the real partner of the book\'s weight is the book\'s gravitational pull on the Earth.\n\n**Error two: the reasoning is backwards.** A Third Law pair can never explain why anything is in equilibrium, precisely because the two forces act on different bodies and so can never cancel. What actually keeps the book still is the **First Law applied to the book alone**: the forces acting on *it* happen to sum to zero.\n\nAnd notice the giveaway — the two forces are equal here *because* the book is in equilibrium, not the other way round. Put the same book in an accelerating lift and $ N \\ne mg $, while the Third Law pairs remain exactly as valid as before.',
      difficulty_level: 4,
    }),
    b('reasoning_prompt', 4, {
      reasoning_type: 'logical',
      prompt: 'Three situations, all involving a coefficient of friction μ and an angle: the angle of repose satisfies tan α = μ; the optimum angle for pulling a block satisfies tan θ = μ; and the angle of friction satisfies tan λ = μ. Is it a coincidence that the same relation turns up three times, or is something deeper going on?',
      reveal: '**Not a coincidence — all three are the same geometric fact, asked from three directions.**\n\nThe underlying object is the **total contact force**: the vector sum of the normal force $ N $ and the limiting friction $ \\mu N $. That resultant makes an angle $ \\lambda = \\tan^{-1}\\mu $ with the normal, and that angle is a property of the two surfaces alone.\n\n- **Angle of repose:** tilt the surface until the total contact force can no longer stay lined up with the (vertical) weight. That happens exactly when the tilt reaches λ.\n- **Optimum pull angle:** pull perpendicular to the total contact force — that is the direction in which none of your effort is wasted fighting the contact force. That direction is at λ.\n\nSo one angle, one physical object, three familiar-looking results. Recognising this is worth more than memorising the three formulas separately: if you can reconstruct the contact-force triangle, you can rebuild all three on demand.',
      difficulty_level: 5,
    }),
    b('inline_quiz', 5, {
      pass_threshold: 0.6,
      questions: [
        q('A body moves at constant velocity in a straight line. The net force on it is:',
          ['Zero, since constant velocity means zero acceleration', 'Equal to its weight, acting vertically downward on it', 'Constant but nonzero, in the direction it is travelling', 'Impossible to determine without knowing its actual speed'],
          0, 'Constant velocity means zero acceleration, and by the Second Law zero acceleration means zero NET force — whatever individual forces act must cancel.', 1),
        q('Two forces act on a single block and are equal and opposite. They:',
          ['Form a Newton\'s Third Law action–reaction pair for that block', 'Are simply the block\'s own force balance, not a Third Law pair', 'Must always cause the block to rotate about its own centre', 'Cannot both exist at once on any single physical object'],
          1, 'A Third Law pair acts on two DIFFERENT bodies. Two equal-and-opposite forces on one body are that body\'s equilibrium condition — an entirely separate idea.', 2),
        q('A block on a rough horizontal floor with $ \\mu_s = 0.5 $ and weight 100 N is pushed with 30 N. The friction on it is:',
          ['$ 50 $ N, the maximum static friction available in this case', '$ 30 $ N, self-adjusting to exactly match the applied push', '$ 15 $ N, half of the applied pushing force on the block', '$ 100 $ N, matching the weight of the block on the floor'],
          1, 'The ceiling is $ \\mu_s N = 0.5(100) = 50 $ N. The 30 N push is below it, so the block stays still and static friction supplies exactly 30 N.', 2),
        q('In an Atwood machine, the magnitudes of the two masses\' accelerations are:',
          ['Always exactly equal, forced by the inextensible string', 'In the ratio of the two masses attached to the string', 'In the inverse ratio of the two masses on either side', 'Independent of one another and set by each mass alone'],
          0, 'A single inextensible string over one ideal pulley means whatever length one side gains, the other loses — so both sides share the same magnitude of acceleration at every instant.', 1),
        q('A person in a lift accelerating upward at 2 m/s² feels heavier because:',
          ['Gravity genuinely increases inside an accelerating lift cabin', 'The normal force from the floor exceeds their true weight', 'Their body mass temporarily increases during the acceleration', 'The lift\'s upward velocity adds directly to their weight'],
          1, 'Accelerating upward needs a net upward force, so $ N > mg $. A scale measures N, so it reads high — but the actual gravitational force $ mg $ is unchanged.', 2),
        q('The centripetal force on a car rounding a flat, unbanked bend is supplied by:',
          ['Friction between the tyres and the road surface beneath', 'The normal force from the road, acting vertically upward', 'The car\'s engine, pushing it around the curve of the bend', 'A centrifugal force acting outward from the bend centre'],
          0, 'On a flat road the normal force is vertical and can contribute nothing horizontal, so friction is the only available inward force — which is exactly why $ v_{\\max} = \\sqrt{\\mu rg} $.', 2),
        q('At the top of a vertical circle, the minimum speed for a string to remain taut is:',
          ['$ \\sqrt{gR} $, where gravity alone supplies the needed force', '$ \\sqrt{2gR} $, twice the square of the critical value there', '$ \\sqrt{5gR} $, which is the required speed at the bottom', 'Zero, because the string can safely go slack at the top'],
          0, 'Setting the tension to zero at the top leaves $ mg = mv^2/R $, giving $ v = \\sqrt{gR} $. The $ \\sqrt{5gR} $ result is the required speed at the BOTTOM.', 2),
        q('A block is pulled by a rope at an angle above the horizontal rather than horizontally. The friction opposing it is:',
          ['Larger, because the rope presses it harder into the ground', 'Smaller, because the upward pull reduces the normal force', 'Unchanged, since the coefficient of friction is the same', 'Zero, because the rope now supports the entire weight'],
          1, 'An upward-angled pull gives $ N = mg - F\\sin\\theta $, and friction $ \\mu N $ falls with it — which is precisely why pulling beats pushing.', 2),
        q('A pseudo force applied to a body inside an accelerating frame:',
          ['Has an equal and opposite reaction on some other body', 'Has no reaction partner, since no body exerts it at all', 'Always points in the frame\'s direction of acceleration', 'Acts only on bodies that are moving within that frame'],
          1, 'It is a bookkeeping term with no exerting body, so nothing is pushed back — and it points OPPOSITE to the frame\'s acceleration, on every mass in the frame.', 2),
        q('A banked curve\'s design speed $ \\sqrt{rg\\tan\\theta} $ is the speed at which:',
          ['Friction is at its maximum value for the road surface', 'No friction at all is needed to round the curve safely', 'The car is on the verge of sliding off the outer edge', 'The normal force on the car falls to exactly zero'],
          1, 'At that one speed the horizontal component of the normal force is exactly the required centripetal force, so friction adjusts itself to zero — the curve is safe even on ice.', 3),
      ],
    }),
    b('callout', 6, {
      variant: 'remember',
      title: 'The five things most often got wrong in this chapter',
      markdown: '1. **Writing $ f = \\mu N $ for a body that is not sliding.** Static friction is self-adjusting; $ \\mu_s N $ is only its ceiling.\n2. **Calling two forces on the SAME body a Third Law pair.** They must act on two different bodies.\n3. **Drawing $ mv^2/r $ as a force arrow.** It is the required resultant, not an extra force.\n4. **Assuming $ N = mg $.** It is not, on an incline, on a wall, in a lift, or when a rope pulls at an angle.\n5. **Mixing frames.** Once you add a pseudo force, every force in that equation must be measured in the same accelerating frame.',
    }),
  ],
};

// ── p15 · Practice — NCERT Exercises ────────────────────────────────────────
// All 23 exercises of NCERT Class 11 Physics Ch.4, transcribed verbatim
// (Rule 0) and regrouped into four themes. NCERT prints "take g = 10 m/s²"
// at the head of its exercise set, so every numeric answer here uses g = 10.
const p15 = {
  page_number: 15,
  slug: 'laws-of-motion-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 23 exercises from the textbook, worked in full',
  blocks: [
    b('callout', 0, {
      variant: 'note',
      title: 'Before you start',
      markdown: 'These are the NCERT Chapter 4 exercises, word for word, regrouped by theme rather than left in textbook order — so that similar problems sit together and the pattern in each family is visible.\n\nNCERT instructs: **for simplicity in numerical calculations, take $ g = 10 $ m/s².** Every answer below uses that value.\n\nTry each one on paper before revealing. A question you can only follow — rather than produce — is not yet learned.',
    }),
    b('practice_bank', 1, {
      title: 'Theme 1 — Identifying the forces',
      intro: 'Four questions with almost no arithmetic. They test whether you can look at a situation and say what is acting, which is the skill everything else rests on.',
      sections: [
        {
          id: 'ncert-forces',
          title: 'Net force and force identification',
          items: [
            num('nc-4-1', 'Give the magnitude and direction of the net force acting on (a) a drop of rain falling down with a constant speed, (b) a cork of mass 10 g floating on water, (c) a kite skillfully held stationary in the sky, (d) a car moving with a constant velocity of 30 km/h on a rough road, (e) a high-speed electron in space far from all material objects, and free of electric and magnetic fields.',
              'Net force is ZERO in every one of the five cases',
              '(a)–(d) all describe bodies either at rest or moving with constant velocity, so by the First Law the net force on each is zero. (e) The electron is far from all material agencies and free of electric and magnetic fields, so no force acts on it at all. Note this does not mean no individual forces act in (a)–(d) — the raindrop has weight and air drag, the cork has weight and buoyancy — only that they cancel.',
              'ncert_exercise', 'NCERT 4.1'),
            num('nc-4-2', 'A pebble of mass 0.05 kg is thrown vertically upwards. Give the direction and magnitude of the net force on the pebble, (a) during its upward motion, (b) during its downward motion, (c) at the highest point where it is momentarily at rest. Do your answers change if the pebble was thrown at an angle of 45° with the horizontal direction? Ignore air resistance.',
              '$ 0.5 $ N vertically downward in all three cases; the answers do not change for a 45° throw',
              'Ignoring air resistance, the only force on the pebble at every stage of its flight is gravity: $ mg = 0.05 \\times 10 = 0.5 $ N, vertically downward. This is true going up, coming down, and at the highest point — where the velocity is zero but the force certainly is not. Throwing at 45° changes nothing about the force; the pebble then simply also carries a constant horizontal velocity component throughout, and at the highest point it is NOT at rest.',
              'ncert_exercise', 'NCERT 4.2'),
            num('nc-4-3', 'Give the magnitude and direction of the net force acting on a stone of mass 0.1 kg, (a) just after it is dropped from the window of a stationary train, (b) just after it is dropped from the window of a train running at a constant velocity of 36 km/h, (c) just after it is dropped from the window of a train accelerating with 1 m/s², (d) lying on the floor of a train which is accelerating with 1 m/s², the stone being at rest relative to the train. Neglect air resistance throughout.',
              '(a) $ 1 $ N vertically downward  (b) same as (a)  (c) same as (a)  (d) $ 0.1 $ N horizontally, in the direction of motion of the train',
              '(a) Only gravity acts: $ mg = 0.1 \\times 10 = 1 $ N downward. (b) Identical — the train\'s constant velocity is irrelevant to the force once the stone is released. (c) Still identical. The train\'s acceleration cannot reach the stone once it is no longer in contact with the train, and force is determined by the situation at that instant, not by the body\'s history. (d) Here the stone IS in contact with the train floor and accelerates with it at 1 m/s², so the horizontal net force is $ ma = 0.1(1) = 0.1 $ N, supplied by friction, in the direction of motion. (Vertically it stays in equilibrium.)',
              'ncert_exercise', 'NCERT 4.3'),
            mcq('nc-4-4', 'One end of a string of length l is connected to a particle of mass m and the other to a small peg on a smooth horizontal table. If the particle moves in a circle with speed v the net force on the particle (directed towards the centre) is: [Choose the correct alternative]',
              ['$ T $', '$ T - \\dfrac{mv^2}{l} $', '$ T + \\dfrac{mv^2}{l} $', '$ 0 $'],
              0, 'The net force on the particle directed toward the centre IS the tension — the string is the only thing pulling it inward, and the table is smooth. The quantity $ mv^2/l $ is not a separate force to be added or subtracted; it is what that net force must EQUAL. Writing $ T - mv^2/l $ double-counts the very thing being asked for.',
              'ncert_exercise', 'NCERT 4.4'),
          ],
        },
      ],
    }),
    b('practice_bank', 2, {
      title: 'Theme 2 — Second law, impulse and momentum',
      intro: 'Eleven questions, the arithmetic core of the chapter. Decide for each whether it is an F = ma problem (a distance is given) or an impulse problem (a time is given).',
      sections: [
        {
          id: 'ncert-second-law',
          title: 'F = ma, impulse and momentum conservation',
          items: [
            num('nc-4-5', 'A constant retarding force of 50 N is applied to a body of mass 20 kg moving initially with a speed of 15 m/s. How long does the body take to stop?',
              '$ 6.0 $ s',
              '$ a = F/m = -50/20 = -2.5 $ m/s². Using $ v = u + at $ with $ v = 0 $: $ 0 = 15 - 2.5t $, so $ t = 6.0 $ s.',
              'ncert_exercise', 'NCERT 4.5'),
            num('nc-4-6', 'A constant force acting on a body of mass 3.0 kg changes its speed from 2.0 m/s to 3.5 m/s in 25 s. The direction of the motion of the body remains unchanged. What is the magnitude and direction of the force?',
              '$ 0.18 $ N, in the direction of motion',
              '$ a = (3.5-2.0)/25 = 1.5/25 = 0.06 $ m/s². $ F = ma = 3 \\times 0.06 = 0.18 $ N. Since the speed increases while the direction is unchanged, the force acts along the direction of motion.',
              'ncert_exercise', 'NCERT 4.6'),
            num('nc-4-7', 'A body of mass 5 kg is acted upon by two perpendicular forces 8 N and 6 N. Give the magnitude and direction of the acceleration of the body.',
              '$ 2 $ m/s², at $ \\tan^{-1}(3/4) = 37° $ to the 8 N force',
              'The two forces are perpendicular, so the resultant is $ \\sqrt{8^2+6^2} = \\sqrt{100} = 10 $ N, at $ \\tan^{-1}(6/8) = \\tan^{-1}(0.75) = 37° $ from the 8 N force. Then $ a = F/m = 10/5 = 2 $ m/s², in the direction of that resultant.',
              'ncert_exercise', 'NCERT 4.7'),
            num('nc-4-8', 'The driver of a three-wheeler moving with a speed of 36 km/h sees a child standing in the middle of the road and brings his vehicle to rest in 4.0 s just in time to save the child. What is the average retarding force on the vehicle? The mass of the three-wheeler is 400 kg and the mass of the driver is 65 kg.',
              '$ 1.2 \\times 10^3 $ N',
              '$ 36 $ km/h $ = 10 $ m/s. $ a = (0-10)/4 = -2.5 $ m/s². Total mass $ = 400 + 65 = 465 $ kg. Retarding force $ = 465 \\times 2.5 = 1162.5 \\approx 1.2 \\times 10^3 $ N. Note the driver\'s mass must be included — the brakes decelerate driver and vehicle together.',
              'ncert_exercise', 'NCERT 4.8'),
            num('nc-4-9', 'A rocket with a lift-off mass 20,000 kg is blasted upwards with an initial acceleration of 5.0 m/s². Calculate the initial thrust (force) of the blast.',
              '$ 3.0 \\times 10^5 $ N',
              'The thrust must both support the weight and produce the upward acceleration: $ F - mg = ma $, so $ F = m(g+a) = 20000(10+5) = 20000 \\times 15 = 3.0 \\times 10^5 $ N.',
              'ncert_exercise', 'NCERT 4.9'),
            num('nc-4-10', 'A body of mass 0.40 kg moving initially with a constant speed of 10 m/s to the north is subject to a constant force of 8.0 N directed towards the south for 30 s. Take the instant the force is applied to be t = 0, the position of the body at that time to be x = 0, and predict its position at t = –5 s, 25 s, 100 s.',
              '$ x = -50 $ m at $ t=-5 $ s; $ x = -6 $ km at $ t=25 $ s; $ x = -50 $ km at $ t=100 $ s',
              'Take north as positive. $ a = -8.0/0.40 = -20 $ m/s², acting only for $ 0 \\le t \\le 30 $ s. **At $ t = -5 $ s:** no force yet, so $ x = ut = 10(-5) = -50 $ m. **At $ t = 25 $ s:** $ x = ut + \\tfrac12 at^2 = 10(25) - 10(625) = 250 - 6250 = -6000 $ m $ = -6 $ km. **At $ t = 100 $ s:** first the powered phase to $ t=30 $: $ x_1 = 10(30) - 10(900) = -8700 $ m, and $ v = 10 - 20(30) = -590 $ m/s. Then force-free from 30 s to 100 s: $ x_2 = -590(70) = -41300 $ m. Total $ x = -8700 - 41300 = -50000 $ m $ = -50 $ km.',
              'ncert_exercise', 'NCERT 4.10'),
            num('nc-4-11', 'A truck starts from rest and accelerates uniformly at 2.0 m/s². At t = 10 s, a stone is dropped by a person standing on the top of the truck (6 m high from the ground). What are the (a) velocity, and (b) acceleration of the stone at t = 11 s? (Neglect air resistance.)',
              '(a) $ 22.4 $ m/s at $ \\tan^{-1}(1/2) $ to the horizontal  (b) $ 10 $ m/s² vertically downwards',
              'At $ t = 10 $ s the truck (and the stone with it) is moving at $ v = 0 + 2(10) = 20 $ m/s horizontally. Once released, no horizontal force acts on the stone, so by the First Law its horizontal velocity stays 20 m/s. Its vertical velocity after 1 s of free fall is $ 0 + 10(1) = 10 $ m/s. (a) Speed $ = \\sqrt{20^2+10^2} = \\sqrt{500} = 22.4 $ m/s, at $ \\tan^{-1}(10/20) = \\tan^{-1}(1/2) $ below the horizontal. (b) Once released the only force is gravity, so the acceleration is $ 10 $ m/s² vertically downward — the truck\'s 2 m/s² is irrelevant to it.',
              'ncert_exercise', 'NCERT 4.11'),
            num('nc-4-14', 'Figure 4.16 shows the position-time graph of a particle of mass 4 kg. What is the (a) force on the particle for t < 0, t > 4 s, 0 < t < 4 s? (b) impulse at t = 0 and t = 4 s? (Consider one-dimensional motion only.)',
              '(a) Zero in all three intervals  (b) $ 3 $ kg·m/s at $ t=0 $; $ -3 $ kg·m/s at $ t=4 $ s',
              'The graph is flat at $ x = 0 $ for $ t < 0 $, rises as a straight line from $ x=0 $ to $ x=3 $ m between $ t=0 $ and $ t=4 $ s, then is flat at $ x = 3 $ m for $ t > 4 $ s. (a) Every segment is a straight line, so the velocity is constant within each interval and the acceleration — and hence the force — is zero throughout all three. (b) The force is nonzero only at the two kinks. Velocity is 0 before $ t=0 $, then $ 3/4 = 0.75 $ m/s, then 0 again. Impulse $ = \\Delta p = m\\Delta v $: at $ t=0 $, $ 4(0.75-0) = 3 $ kg·m/s; at $ t=4 $ s, $ 4(0-0.75) = -3 $ kg·m/s.',
              'ncert_exercise', 'NCERT 4.14'),
            num('nc-4-18', 'Two billiard balls each of mass 0.05 kg moving in opposite directions with speed 6 m/s collide and rebound with the same speed. What is the impulse imparted to each ball due to the other?',
              '$ 0.6 $ kg·m/s on each ball, the two impulses being opposite in direction',
              'Each ball reverses from $ +6 $ m/s to $ -6 $ m/s, so $ |\\Delta v| = 12 $ m/s. Impulse $ = m|\\Delta v| = 0.05 \\times 12 = 0.6 $ kg·m/s. This is the $ J = 2mv $ perfect-reversal result. The two impulses are equal in magnitude and opposite in direction, exactly as the Third Law requires.',
              'ncert_exercise', 'NCERT 4.18'),
            num('nc-4-19', 'A shell of mass 0.020 kg is fired by a gun of mass 100 kg. If the muzzle speed of the shell is 80 m/s, what is the recoil speed of the gun?',
              '$ 0.016 $ m/s (1.6 cm/s)',
              'The gun and shell start at rest, so total momentum is zero and must stay zero (no external horizontal force). Therefore $ 100v = 0.020 \\times 80 = 1.6 $, giving $ v = 0.016 $ m/s $ = 1.6 $ cm/s, directed opposite to the shell.',
              'ncert_exercise', 'NCERT 4.19'),
            num('nc-4-20', 'A batsman deflects a ball by an angle of 45° without changing its initial speed which is equal to 54 km/h. What is the impulse imparted to the ball? (Mass of the ball is 0.15 kg.)',
              '$ \\approx 4.2 $ kg·m/s',
              '$ 54 $ km/h $ = 15 $ m/s. The speed is unchanged, so the impulse is directed along the bisector of the initial and final directions, and its magnitude is $ 2mv\\cos(\\theta/2) $ where $ \\theta = 45° $ is the deflection: $ 2(0.15)(15)\\cos22.5° = 4.5 \\times 0.924 \\approx 4.2 $ kg·m/s.',
              'ncert_exercise', 'NCERT 4.20'),
          ],
        },
      ],
    }),
    b('practice_bank', 3, {
      title: 'Theme 3 — Connected bodies, pulleys and lifts',
      intro: 'Three questions where more than one body is involved. For each, decide first whether to treat the system as one or to isolate a single body.',
      sections: [
        {
          id: 'ncert-connected',
          title: 'Systems, tensions and apparent weight',
          items: [
            num('nc-4-13', 'A man of mass 70 kg stands on a weighing scale in a lift which is moving (a) upwards with a uniform speed of 10 m/s, (b) downwards with a uniform acceleration of 5 m/s², (c) upwards with a uniform acceleration of 5 m/s². What would be the readings on the scale in each case? (d) What would be the reading if the lift mechanism failed and it hurtled down freely under gravity?',
              '(a) $ 700 $ N (70 kg)  (b) $ 350 $ N (35 kg)  (c) $ 1050 $ N (105 kg)  (d) Zero',
              'The scale reads the normal force N on the man. (a) Uniform SPEED means zero acceleration, so $ N = mg = 700 $ N — reading 70 kg. (b) Accelerating down: $ mg - N = ma $, so $ N = m(g-a) = 70(5) = 350 $ N — reading 35 kg. (c) Accelerating up: $ N - mg = ma $, so $ N = m(g+a) = 70(15) = 1050 $ N — reading 105 kg. (d) Free fall means $ a = g $, so $ N = m(g-g) = 0 $ — the scale reads zero, though gravity still pulls with the full 700 N.',
              'ncert_exercise', 'NCERT 4.13'),
            num('nc-4-15', 'Two bodies of masses 10 kg and 20 kg respectively kept on a smooth, horizontal surface are tied to the ends of a light string. A horizontal force F = 600 N is applied to (i) A, (ii) B along the direction of string. What is the tension in the string in each case?',
              '(i) $ T = 200 $ N when the 20 kg body is pulled  (ii) $ T = 400 $ N when the 10 kg body is pulled',
              'The common acceleration is the same either way: $ a = F/(m_1+m_2) = 600/30 = 20 $ m/s². Then isolate whichever body is NOT directly pulled. If the 20 kg body is pulled, the string alone drags the 10 kg body: $ T = 10 \\times 20 = 200 $ N. If the 10 kg body is pulled, the string must drag the 20 kg body: $ T = 20 \\times 20 = 400 $ N. Same acceleration, very different tension.',
              'ncert_exercise', 'NCERT 4.15'),
            num('nc-4-16', 'Two masses 8 kg and 12 kg are connected at the two ends of a light inextensible string that goes over a frictionless pulley. Find the acceleration of the masses, and the tension in the string when the masses are released.',
              '$ a = 2 $ m/s², $ T = 96 $ N',
              'Taking the 12 kg side as descending: $ 12g - T = 12a $ and $ T - 8g = 8a $. Adding: $ 4g = 20a $, so $ a = 4(10)/20 = 2 $ m/s². Then $ T = 8g + 8a = 8(10) + 8(2) = 96 $ N. Check on the other side: $ 12(10) - 96 = 24 = 12(2) $ ✓.',
              'ncert_exercise', 'NCERT 4.16'),
          ],
        },
      ],
    }),
    b('practice_bank', 4, {
      title: 'Theme 4 — Circular motion and conceptual questions',
      intro: 'Five questions, mostly asking for an explanation rather than a number. These are the ones most often skipped and most often examined.',
      sections: [
        {
          id: 'ncert-conceptual',
          title: 'Circular motion, momentum and "explain why"',
          items: [
            num('nc-4-12', 'A bob of mass 0.1 kg hung from the ceiling of a room by a string 2 m long is set into oscillation. The speed of the bob at its mean position is 1 m/s. What is the trajectory of the bob if the string is cut when the bob is (a) at one of its extreme positions, (b) at its mean position.',
              '(a) It falls vertically downwards  (b) It follows a parabolic path',
              '(a) At an extreme position the bob is momentarily at rest, so with the string cut it has zero initial velocity and simply falls straight down under gravity. (b) At the mean position the bob has a horizontal velocity of 1 m/s. Cutting the string leaves only gravity acting, so it becomes a horizontal projectile — uniform horizontal motion plus free fall, tracing a parabola. This is exactly the Chapter 3 two-coins result.',
              'ncert_exercise', 'NCERT 4.12'),
            num('nc-4-17', 'A nucleus is at rest in the laboratory frame of reference. Show that if it disintegrates into two smaller nuclei the products must move in opposite directions.',
              'By momentum conservation, the two fragments must carry equal and opposite momenta, so they move in opposite directions',
              'The nucleus is at rest, so its initial momentum is zero. No external force acts during the disintegration, so the total final momentum must also be zero: $ \\mathbf{p}_1 + \\mathbf{p}_2 = 0 $, i.e. $ \\mathbf{p}_1 = -\\mathbf{p}_2 $. Two momentum vectors can only sum to zero if they are equal in magnitude and exactly opposite in direction. Since momentum is $ m\\mathbf{v} $ and masses are positive, the two velocities must also be oppositely directed.',
              'ncert_exercise', 'NCERT 4.17'),
            num('nc-4-21', 'A stone of mass 0.25 kg tied to the end of a string is whirled round in a circle of radius 1.5 m with a speed of 40 rev./min in a horizontal plane. What is the tension in the string? What is the maximum speed with which the stone can be whirled around if the string can withstand a maximum tension of 200 N?',
              '$ T \\approx 6.6 $ N; $ v_{\\max} \\approx 35 $ m/s',
              '$ 40 $ rev/min $ = 40/60 $ rev/s, so $ v = 2\\pi r (40/60) = 2\\pi(1.5)(2/3) = 2\\pi \\approx 6.28 $ m/s. Tension $ = mv^2/r = 0.25(39.5)/1.5 \\approx 6.6 $ N. For the limit: $ v_{\\max}^2 = T_{\\max} r/m = 200(1.5)/0.25 = 1200 $, so $ v_{\\max} = \\sqrt{1200} \\approx 34.6 \\approx 35 $ m/s.',
              'ncert_exercise', 'NCERT 4.21'),
            mcq('nc-4-22', 'If, in Exercise 4.21, the speed of the stone is increased beyond the maximum permissible value, and the string breaks suddenly, which of the following correctly describes the trajectory of the stone after the string breaks:',
              ['The stone moves radially outwards', 'The stone flies off tangentially from the instant the string breaks', 'The stone flies off at an angle with the tangent whose magnitude depends on the speed of the particle', 'The stone comes instantly to rest at the breaking point'],
              1, 'Once the string breaks, no force acts on the stone in the horizontal plane, so by the First Law it continues in a straight line along its velocity at that instant — which is the tangent to the circle. It does not fly radially outward, because no outward force was ever acting on it.',
              'ncert_exercise', 'NCERT 4.22'),
            num('nc-4-23', 'Explain why (a) a horse cannot pull a cart and run in empty space, (b) passengers are thrown forward from their seats when a speeding bus stops suddenly, (c) it is easier to pull a lawn mower than to push it, (d) a cricketer moves his hands backwards while holding a catch.',
              'See the full explanations below',
              '**(a)** In empty space there is no external force on the horse-cart system. The mutual forces between horse and cart are internal and cancel by the Third Law, so the system as a whole cannot accelerate. On the ground, the horse pushes backward on the ground and the ground pushes forward on the horse (friction) — that external contact force is what moves them.\n\n**(b)** Inertia. The lower body is in contact with the seat and decelerates with the bus, but the upper body is not directly restrained and tends to keep moving forward at the original speed, by the First Law.\n\n**(c)** When pushing at an angle, the downward component increases the normal force ($ N > mg $), and since friction $ f \\propto N $, the friction to be overcome increases — so a greater applied force is needed. Pulling at an angle does exactly the opposite, reducing N and hence the friction.\n\n**(d)** To increase the time over which the ball\'s momentum is reduced to zero. Since $ F = \\Delta p/\\Delta t $ and $ \\Delta p $ is fixed by the ball\'s mass and speed, a longer $ \\Delta t $ means a smaller average force on the hands.',
              'ncert_exercise', 'NCERT 4.23'),
          ],
        },
      ],
    }),
    b('image', 5, {
      src: '',
      alt: 'The position-time graph for NCERT exercise 4.14: position stays at zero until t equals zero, then rises as a straight line to 3 metres at t equals 4 seconds, then stays constant at 3 metres afterwards.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-ncert-exercise-figures',
      caption: 'Figure for Exercise 4.14 — the position-time graph of the 4 kg particle. Three straight-line segments, so zero force within each; the impulses occur only at the two kinks.',
    }),
    b('callout', 6, {
      variant: 'remember',
      title: 'What these 23 questions were really testing',
      markdown: 'Almost none needed a formula you had to look up. What they tested was:\n\n- **Can you tell when the net force is zero?** (4.1, 4.2, 4.3, 4.14)\n- **Do you know a force stops acting once contact ends?** (4.3c, 4.11) — the set\'s most-repeated trap.\n- **Can you use impulse when only a time is given?** (4.18, 4.19, 4.20)\n- **What supplies a centripetal force, and what happens when it stops?** (4.4, 4.21, 4.22)\n\nIf any still feel uncertain, that is the page to reread — not the arithmetic.',
    }),
  ],
};

// ── run ──────────────────────────────────────────────────────────────────────
withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p14, p15]);
  console.log('\n✅ Ch.4 Wave 3b done: p14–p15 (recap, all 23 NCERT exercises verbatim + solved)');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
