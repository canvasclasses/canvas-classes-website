'use strict';
/**
 * Class 11 Physics · Chapter 4 "Laws of Motion" — pages 12–13.
 * Wave 3a: Circular DYNAMICS — the promise Chapter 3 made and deliberately
 * could not keep, because naming the force that causes circular motion needs
 * Newton's laws.
 *   p12  centripetal force is a ROLE, not a new force · conical pendulum ·
 *        vertical circle (top condition derived in full; the bottom condition
 *        flagged honestly as needing energy conservation from Ch.6)
 *   p13  banking of roads — without friction, then with it (and the genuine
 *        minimum speed, which only exists on a banked track)
 *
 * Run: node scripts/physics11-book/build_ch4_circular.js
 */
const { b, q, st, mcq, num, hero, ensureChapter, upsertPages, withDb } = require('./_book_ch4');

// ── p12 · Circular Dynamics I — Vertical Circle and Conical Pendulum ────────
const p12 = {
  page_number: 12,
  slug: 'circular-dynamics-vertical-circle-and-conical-pendulum',
  title: 'Circular Dynamics — the Vertical Circle and the Conical Pendulum',
  subtitle: 'Chapter 3 found the acceleration. This finds what causes it.',
  glossary: [
    { term: 'centripetal force', definition: 'NOT a new kind of force — it is the NAME given to the net inward force on a body moving in a circle. It is always supplied by real forces: tension, gravity, normal force, friction.' },
    { term: 'conical pendulum', definition: 'A mass on a string whirled in a horizontal circle, so the string sweeps out a cone. Its vertical tension component balances weight; its horizontal component supplies the centripetal force.' },
  ],
  blocks: [
    hero('circular-dynamics-vertical-circle-and-conical-pendulum'),
    b('curiosity_prompt', 0, {
      prompt: 'Swing a bucket of water fast in a vertical circle and the water stays in — even at the very top, when the bucket is upside down over your head. Gravity is pulling that water straight down. So what is holding it up there?',
      hint: 'Nothing is holding it up. Ask instead what gravity is doing with that pull.',
      reveal: '**Nothing is holding it up — and nothing needs to.**\n\nAt the top of the swing, the water genuinely is falling. But the bucket is falling too, along its circular path, at exactly the same rate. The water never gets a chance to separate from the bucket, so it never spills.\n\nGravity has not been defeated; it has been **put to work**. At the top of the circle, "down" points straight at the centre — which is exactly the direction the centripetal acceleration needs to point. So gravity is not fighting the circular motion; it *is* the circular motion, at that instant.\n\nAnd this only works above a certain speed. Swing too slowly and gravity is more than the circle needs, the water leaves the path, and you get wet. Finding that critical speed is what this page builds to.',
    }),
    b('text', 1, {
      markdown: 'Chapter 3 established the kinematics: a body moving in a circle of radius $ r $ at speed $ v $ has an acceleration $ a_c = v^2/r $ directed at the centre. It stopped there, because explaining *why* needs Newton\'s laws.\n\nNow it can be finished. By $ \\mathbf{F} = m\\mathbf{a} $, that acceleration requires a net inward force:\n\n$ F_{\\text{net, inward}} = \\dfrac{mv^2}{r} = m\\omega^2 r $\n\nThis is called the **centripetal force** — and the name is the single biggest source of confusion in the chapter.',
    }),
    b('step_solver', 2, {
      title: 'What actually supplies the centripetal force',
      problem: 'A stone of mass $ 0.25 $ kg tied to a string is whirled in a horizontal circle of radius $ 1.5 $ m at $ 40 $ revolutions per minute. Find the tension in the string. If the string can withstand a maximum tension of $ 200 $ N, find the maximum speed at which it can be whirled.',
      intro: 'Before any algebra, name the force. On this page the whole skill is identifying which REAL force is doing the centripetal job.',
      steps: [
        st('$ 40 $ rev/min $ = \\dfrac{40}{60} $ rev/s, so $ v = 2\\pi r \\times \\dfrac{40}{60} = 2\\pi(1.5)(0.667) = 2\\pi \\approx 6.28\\ \\text{m/s} $.',
          'Convert the rotation rate to a linear speed first — the $ mv^2/r $ form needs $ v $, not revolutions.', {
            check: {
              kind: 'mcq',
              prompt: 'Which real force provides the centripetal force for this stone?',
              options: [
                'The tension in the string, pulling the stone toward the centre',
                'A separate "centripetal force" acting in addition to the tension',
                'The stone\'s own weight, acting downward toward the ground',
                'An outward centrifugal force pushing the stone away from centre',
              ],
              answer_index: 0,
              feedback_right: 'Right — the string\'s tension IS the centripetal force here. There is no extra force; "centripetal" just names the job the tension is doing.',
              feedback_wrong: 'The tension in the string is the centripetal force — not something in addition to it. "Centripetal" describes the ROLE a force is playing (pointing at the centre), not a separate force of nature.',
            },
          }),
        st('$ T = \\dfrac{mv^2}{r} = \\dfrac{0.25 \\times (2\\pi)^2}{1.5} = \\dfrac{0.25 \\times 39.5}{1.5} \\approx 6.6\\ \\text{N} $',
          'The entire tension goes into turning the stone — there is nothing else for it to do, since the circle is horizontal and the string is (near enough) horizontal too.', {
            check: {
              kind: 'fill_blank',
              prompt: 'For the maximum speed, set $ T = 200 $ N: $ v_{\\max}^2 = \\dfrac{T r}{m} = \\dfrac{200 \\times 1.5}{0.25} $. Find $ v_{\\max} $ in m/s, to the nearest whole number.',
              blank_answer: '35',
              feedback_right: 'Yes — $ v_{\\max}^2 = 1200 $, so $ v_{\\max} \\approx 34.6 \\approx 35 $ m/s.',
              feedback_wrong: '$ v_{\\max}^2 = Tr/m = 200(1.5)/0.25 = 1200 $, so $ v_{\\max} = \\sqrt{1200} \\approx 34.6 $ m/s.',
            },
          }),
        st('$ T \\approx 6.6\\ \\text{N} $ and $ v_{\\max} \\approx 35\\ \\text{m/s} $. Beyond that speed the string breaks.',
          'And the instant it breaks, the stone flies off along the **tangent** — not radially outward. With no force at all, the First Law takes over and it travels in a straight line.', {
            why: 'That tangent detail is worth holding onto, because it is the cleanest disproof of "centrifugal force." If some outward force had genuinely been acting on the stone, removing the string would let that force fling it radially outward. It does not — the stone leaves along the tangent, exactly as a body with zero net force must. There was never an outward force; there was only an inward one, and now there is none.',
          }),
      ],
      now_you_try: {
        problem: 'A 0.5 kg ball is whirled in a horizontal circle of radius 2 m at 3 m/s. Find the tension in the string. What is the maximum speed if the string breaks above 30 N?',
        answer: '$ T = 2.25 $ N; $ v_{\\max} \\approx 10.95 $ m/s',
        solution: '$ T = mv^2/r = 0.5(9)/2 = 2.25 $ N. For the limit: $ v_{\\max}^2 = Tr/m = 30(2)/0.5 = 120 $, so $ v_{\\max} = \\sqrt{120} \\approx 10.95 $ m/s.',
      },
    }),
    b('callout', 3, {
      variant: 'warning',
      title: 'Centripetal force is a job description, not a force',
      markdown: 'Never add "centripetal force" to a free body diagram as an extra arrow. It is the **name for the resultant** of the real forces, once they point inward.\n\nOn a diagram you draw tension, gravity, normal force, friction — the real forces. Then you write $ \\sum F_{\\text{inward}} = mv^2/r $. Drawing $ mv^2/r $ as its own arrow double-counts it, and is the most common error on this page.',
    }),
    b('step_solver', 4, {
      title: 'The conical pendulum — two jobs for one tension',
      problem: 'A bob on a string of length $ L = 1 $ m is whirled in a horizontal circle so the string makes $ 30° $ with the vertical. Find the speed of the bob and the time for one revolution. Take $ g = 10 $ m/s².',
      intro: 'The string is no longer horizontal, so its tension must do two jobs at once — hold the bob up AND turn it. Splitting those two jobs is the whole method.',
      steps: [
        st('Resolve the tension. **Vertical** (no acceleration): $ T\\cos\\theta = mg $. **Horizontal** (this is the centripetal direction): $ T\\sin\\theta = \\dfrac{mv^2}{r} $, with $ r = L\\sin\\theta $.',
          'Notice the bob does NOT accelerate vertically — it stays in one horizontal plane. So the vertical equation is an equilibrium one, and only the horizontal one involves circular motion.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the vertical equation an equilibrium ($ = 0 $) rather than $ = ma $?',
              options: [
                'The bob stays in one horizontal plane, so it has no vertical acceleration',
                'Gravity does not act on a body that is moving in a circle',
                'The tension is always exactly equal to the bob\'s weight',
                'Vertical forces are always ignored in circular motion problems',
              ],
              answer_index: 0,
              feedback_right: 'Right — the whole circle lies in one horizontal plane, so the bob never moves up or down and its vertical acceleration is exactly zero.',
              feedback_wrong: 'The bob travels round a horizontal circle, always at the same height. So it has no vertical acceleration at all, and the vertical forces must balance: $ T\\cos\\theta = mg $.',
            },
          }),
        st('Dividing: $ \\tan\\theta = \\dfrac{v^2}{rg} \\ \\Rightarrow\\ v = \\sqrt{rg\\tan\\theta} $, with $ r = L\\sin30° = 0.5\\ \\text{m} $.',
          'The mass cancels — a heavy bob and a light one whirl at the same speed for the same string angle.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ v = \\sqrt{0.5 \\times 10 \\times \\tan30°} = \\sqrt{0.5 \\times 10 \\times 0.577} $, in m/s, to two decimal places.',
              blank_answer: '1.70',
              feedback_right: 'Yes — $ \\sqrt{2.887} \\approx 1.70 $ m/s.',
              feedback_wrong: '$ v = \\sqrt{rg\\tan\\theta} = \\sqrt{0.5 \\times 10 \\times 0.577} = \\sqrt{2.887} \\approx 1.70 $ m/s.',
            },
          }),
        st('Period: $ \\ T_{\\text{period}} = \\dfrac{2\\pi r}{v} = 2\\pi\\sqrt{\\dfrac{L\\cos\\theta}{g}} = 2\\pi\\sqrt{\\dfrac{0.866}{10}} \\approx 1.85\\ \\text{s} $.',
          'Note the tension itself: $ T = mg/\\cos\\theta = 11.5m $ N — always LARGER than the weight, since it must both support and turn the bob.', {
            why: 'The period formula is worth comparing with the ordinary swinging pendulum, $ 2\\pi\\sqrt{L/g} $. They are the same expression with $ L $ replaced by $ L\\cos\\theta $ — which is just the vertical height of the cone. So a conical pendulum keeps time like a simple pendulum whose length is the cone\'s height, not the string\'s length. As $ \\theta \\to 0 $ (a nearly vertical string), $ \\cos\\theta \\to 1 $ and the two formulas agree exactly, which is a good sign the derivation is sound.',
          }),
      ],
      now_you_try: {
        problem: 'A conical pendulum has a string of length 2 m making 60° with the vertical. Take g = 10 m/s², sin60° = 0.866, cos60° = 0.5, tan60° = 1.732. Find the speed of the bob.',
        answer: '$ \\approx 5.48 $ m/s',
        solution: '$ r = L\\sin60° = 2(0.866) = 1.732 $ m. $ v = \\sqrt{rg\\tan\\theta} = \\sqrt{1.732 \\times 10 \\times 1.732} = \\sqrt{30} \\approx 5.48 $ m/s.',
      },
    }),
    b('image', 5, {
      src: '',
      alt: 'Two diagrams side by side: on the left a conical pendulum with the string tension resolved into a vertical component balancing weight and a horizontal component pointing at the circle centre; on the right a vertical circle showing tension and weight at the top both pointing downward toward the centre, and at the bottom tension up against weight down.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-conical-and-vertical-circle',
      caption: 'Left: the conical pendulum splits one tension into two jobs. Right: in a vertical circle, at the top BOTH tension and gravity point at the centre — which is why gravity alone can keep the body on the path.',
    }),
    b('step_solver', 6, {
      title: 'The critical speed at the top of a vertical circle',
      problem: 'A stone tied to a string is whirled in a vertical circle of radius $ R = 2.5 $ m. Find the minimum speed it must have **at the top** of the circle for the string to stay taut. Take $ g = 10 $ m/s².',
      intro: 'The bucket-of-water question, made precise. This derivation needs nothing but a free body diagram at one point of the path.',
      steps: [
        st('At the top, list the forces on the stone: tension $ T $ pointing **down** (toward the centre, since the centre is below), and weight $ mg $ also pointing **down**. Both point the same way.',
          'This is what makes the top of the circle special. Everywhere else, gravity has a component along the path; at the top it points exactly at the centre.', {
            check: {
              kind: 'mcq',
              prompt: 'So at the top, the equation $ \\sum F_{\\text{inward}} = mv^2/R $ reads:',
              options: [
                '$ T + mg = \\dfrac{mv^2}{R} $, since both forces point at the centre',
                '$ T - mg = \\dfrac{mv^2}{R} $, with gravity opposing the tension',
                '$ mg - T = \\dfrac{mv^2}{R} $, with tension opposing gravity',
                '$ T = \\dfrac{mv^2}{R} $, since weight acts perpendicular to the path'
              ],
              answer_index: 0,
              feedback_right: 'Right — at the top, tension and weight both point downward, which is inward. They ADD.',
              feedback_wrong: 'At the top of the circle the centre is directly below the stone, so BOTH the tension (along the string, toward the centre) and the weight point inward. They add: $ T + mg = mv^2/R $.',
            },
          }),
        st('The string is slackest when $ T = 0 $. Setting $ T = 0 $: $ mg = \\dfrac{mv_{\\min}^2}{R} \\ \\Rightarrow\\ v_{\\min} = \\sqrt{gR} $.',
          'At exactly this speed, **gravity alone supplies the whole centripetal force** — the string does nothing at all, and is momentarily limp.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ v_{\\min} = \\sqrt{gR} = \\sqrt{10 \\times 2.5} $, in m/s.',
              blank_answer: '5',
              feedback_right: 'Yes — $ \\sqrt{25} = 5 $ m/s.',
              feedback_wrong: '$ v_{\\min} = \\sqrt{gR} = \\sqrt{10 \\times 2.5} = \\sqrt{25} = 5 $ m/s.',
            },
          }),
        st('$ v_{\\min} = \\sqrt{gR} = 5\\ \\text{m/s} $ at the top. Slower than this and the required centripetal force is LESS than gravity — so the stone falls inward off the circular path.',
          'The mass cancels again: a heavy bucket and a light one need the same critical speed.', {
            why: 'This also explains the bucket exactly. For a bucket swung at arm\'s length, $ R \\approx 1 $ m, so $ v_{\\min} = \\sqrt{10} \\approx 3.2 $ m/s — brisk, but easy. Above that, the bucket\'s base has to *push down* on the water to keep it on the circle (the normal force replaces the tension), and the water stays put. Below it, gravity is more than the circle needs, and the water leaves the path — which is the moment you get wet.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is whirled in a vertical circle of radius 0.4 m. Take g = 10 m/s². Find the minimum speed at the top for the string to stay taut.',
        answer: '$ 2 $ m/s',
        solution: '$ v_{\\min} = \\sqrt{gR} = \\sqrt{10 \\times 0.4} = \\sqrt{4} = 2 $ m/s.',
      },
    }),
    b('step_solver', 7, {
      title: 'Tension at the bottom, and the speed needed to get round at all',
      problem: 'For the same vertical circle ($ R = 2.5 $ m), find the tension at the LOWEST point when the stone is moving at $ v $ there, and state the minimum speed at the bottom needed to complete the full loop.',
      intro: 'The bottom is the mirror image of the top — and comparing the two explains why strings snap at the bottom of a swing, never the top.',
      steps: [
        st('At the bottom, the centre is directly **above**. So tension $ T $ points up (inward) and weight $ mg $ points down (outward): $ T - mg = \\dfrac{mv^2}{R} \\ \\Rightarrow\\ T = m\\left(g + \\dfrac{v^2}{R}\\right) $.',
          'Exactly the opposite arrangement from the top — here gravity works AGAINST the centripetal requirement, so the tension has to cover both.', {
            check: {
              kind: 'mcq',
              prompt: 'Comparing top and bottom at the same speed, where is the tension larger?',
              options: [
                'At the bottom, since tension must both turn the stone and beat gravity',
                'At the top, since the stone is furthest from the ground there',
                'Exactly equal at both points, since the speed is the same',
                'At the top, since gravity adds to the tension there',
              ],
              answer_index: 0,
              feedback_right: 'Right — at the top gravity HELPS turn the stone, so less tension is needed; at the bottom it opposes, so more is.',
              feedback_wrong: 'At the top, gravity points inward and helps supply the centripetal force, so the string does less work. At the bottom, gravity points outward and the tension must supply the centripetal force PLUS overcome the weight — so tension is larger there. That is why strings snap at the bottom of a swing.',
            },
          }),
        st('For the full loop, the stone must still be moving at $ \\sqrt{gR} $ when it reaches the top, having climbed a height $ 2R $. Relating the two speeds needs **energy conservation**, which gives $ u_{\\min} = \\sqrt{5gR} $.',
          'Honest flag: $ v^2 = u^2 - 2gh $ along a curved path is an energy result, and energy is the NEXT chapter. It is quoted here so the standard result is available, and it is derived properly in Work, Energy and Power.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ u_{\\min} = \\sqrt{5gR} = \\sqrt{5 \\times 10 \\times 2.5} = \\sqrt{125} $, in m/s, to two decimal places.',
              blank_answer: '11.18',
              feedback_right: 'Yes — about 11.18 m/s at the bottom, against just 5 m/s needed at the top.',
              feedback_wrong: '$ u_{\\min} = \\sqrt{5gR} = \\sqrt{125} \\approx 11.18 $ m/s.',
            },
          }),
        st('At that critical launch speed, the tension at the bottom works out to exactly $ 6mg $ — six times the stone\'s own weight.',
          'Substituting $ u^2 = 5gR $ into $ T = m(g + u^2/R) $ gives $ T = m(g + 5g) = 6mg $, a result worth recognising on sight.', {
            why: 'The contrast between the two ends of the circle is stark and physically real: at the top the string carries zero tension, and one half-turn later it carries six times the weight. That is why a swing\'s rope, a chain on a fairground ride, or a rope in a loop-the-loop always fails at the **bottom** of the arc — it is the point of maximum load, by a very wide margin.',
          }),
      ],
      now_you_try: {
        problem: 'A stone on a 0.5 m string is whirled in a vertical circle. Take g = 10 m/s². Find the minimum speed at the bottom to complete the loop, and the tension there in terms of m.',
        answer: '$ u_{\\min} = 5 $ m/s, and $ T = 6mg = 60m $ N',
        solution: '$ u_{\\min} = \\sqrt{5gR} = \\sqrt{5(10)(0.5)} = \\sqrt{25} = 5 $ m/s. At that critical speed the tension at the bottom is always $ 6mg = 6m(10) = 60m $ N.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('The "centripetal force" on a body moving in a circle is best described as:',
          ['A new fundamental force that appears only during circular motion', 'The name for the net inward force, supplied by real forces', 'An outward force that balances the body\'s tendency to fly off', 'A force that only acts on bodies which are moving very fast'],
          1, 'Centripetal is a job description, not a force of nature. Tension, gravity, friction or a normal force does the actual pushing or pulling; "centripetal" just says that resultant points at the centre.', 2),
        q('A stone whirled on a string is released when the string snaps. It flies off:',
          ['Radially outward, directly away from the circle\'s centre point', 'Along the tangent to the circle at the point of release', 'Along a curve that continues bending in the same direction', 'Directly toward the centre of the circle it was travelling in'],
          1, 'With no net force, the First Law makes it travel in a straight line along the velocity direction — the tangent. That it does NOT fly radially outward is the cleanest evidence there was never an outward force.', 2),
        q('At the top of a vertical circle, the minimum speed for a string to stay taut is:',
          ['$ \\sqrt{gR} $, where gravity alone supplies the centripetal force', '$ \\sqrt{5gR} $, five times the value at the bottom point', '$ \\sqrt{2gR} $, the speed gained falling through the diameter', 'Zero, since the string can go slack without any consequence'],
          0, 'Setting $ T = 0 $ at the top leaves $ mg = mv^2/R $, so $ v_{\\min} = \\sqrt{gR} $ — the speed at which gravity by itself is exactly the centripetal force required.', 2),
        q('For a stone in a vertical circle at the same speed, the string tension is largest:',
          ['At the top, where gravity and tension both point inward', 'At the bottom, where tension must turn it and oppose gravity', 'At the two side points, level with the circle\'s centre', 'Exactly the same at every point around the circle'],
          1, 'At the bottom, tension supplies the full centripetal force AND supports the weight ($ T = m(g+v^2/R) $), while at the top gravity contributes to the centripetal force and reduces the tension needed.', 2),
        q('In a conical pendulum, the vertical component of the string tension:',
          ['Supplies the centripetal force needed for the circular motion', 'Balances the weight of the bob, since it does not move vertically', 'Is zero, because the bob moves only in a horizontal circle', 'Equals the horizontal component at all possible string angles'],
          1, 'The bob stays at constant height, so it has no vertical acceleration and $ T\\cos\\theta = mg $. It is the HORIZONTAL component that supplies the centripetal force.', 2),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Centripetal force is a role, not a force.** Draw the real forces; then set their inward resultant equal to $ mv^2/r $. Never add $ mv^2/r $ as its own arrow.\n- Cut the string and the body leaves along the **tangent** — proof there was never an outward force.\n- **Conical pendulum:** $ T\\cos\\theta = mg $, $ T\\sin\\theta = mv^2/r $, giving $ v = \\sqrt{rg\\tan\\theta} $ and period $ 2\\pi\\sqrt{L\\cos\\theta/g} $.\n- **Vertical circle, top:** $ v_{\\min} = \\sqrt{gR} $ (gravity alone does the turning). **Bottom:** $ u_{\\min} = \\sqrt{5gR} $, with tension $ 6mg $ there.\n- Tension is **largest at the bottom, zero at the top** in the critical case — which is where ropes actually break.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Seven questions. For each, name the real force doing the centripetal job before writing a single equation.',
      sections: [
        {
          id: 'p12-ysi',
          title: 'Vertical Circles & Conical Pendulums',
          items: [
            num('p12-y1', 'A 0.2 kg ball is whirled in a horizontal circle of radius 0.5 m at 4 m/s. Find the tension in the string.',
              '$ 6.4 $ N',
              '$ T = mv^2/r = 0.2(16)/0.5 = 3.2/0.5 = 6.4 $ N.'),
            num('p12-y2', 'A stone is whirled in a vertical circle of radius 0.9 m. Take g = 10 m/s². Find the minimum speed at the top for the string to stay taut.',
              '$ 3 $ m/s',
              '$ v_{\\min} = \\sqrt{gR} = \\sqrt{10 \\times 0.9} = \\sqrt{9} = 3 $ m/s.'),
            mcq('p12-y3', 'For a body just barely completing a vertical circle, the string tension at the lowest point is:',
              ['$ mg $, exactly equal to the body\'s own weight there', '$ 6mg $, six times the weight of the body', '$ 3mg $, three times the weight of the body', 'Zero, the same as it is at the topmost point'],
              1, 'Substituting the critical $ u^2 = 5gR $ into $ T = m(g + u^2/R) $ gives $ T = m(g+5g) = 6mg $.'),
            num('p12-y4', 'A conical pendulum of length 1.5 m makes 30° with the vertical. Take g = 10 m/s², sin30° = 0.5, tan30° = 0.577. Find the bob\'s speed.',
              '$ \\approx 2.08 $ m/s',
              '$ r = L\\sin30° = 0.75 $ m. $ v = \\sqrt{rg\\tan\\theta} = \\sqrt{0.75 \\times 10 \\times 0.577} = \\sqrt{4.33} \\approx 2.08 $ m/s.'),
            mcq('p12-y5', 'A car drives over the top of a curved hill of radius R. It loses contact with the road when its speed reaches:',
              ['$ \\sqrt{gR} $, where gravity alone supplies the centripetal force', '$ \\sqrt{2gR} $, twice the ordinary critical value at the top', '$ \\sqrt{5gR} $, the same as a full vertical loop needs', 'It can never lose contact with the road going over a hill'],
              0, 'At the crest, $ mg - N = mv^2/R $. Contact is lost when $ N = 0 $, giving $ v = \\sqrt{gR} $ — exactly the vertical-circle top condition, with the normal force replacing the tension.'),
            num('p12-y6', 'A 0.3 kg stone in a vertical circle of radius 1.2 m passes the lowest point at 6 m/s. Take g = 10 m/s². Find the tension there.',
              '$ 12 $ N',
              '$ T = m(g + v^2/R) = 0.3(10 + 36/1.2) = 0.3(10+30) = 0.3(40) = 12 $ N.'),
            mcq('p12-y7', 'A conical pendulum\'s period is $ 2\\pi\\sqrt{L\\cos\\theta/g} $. As the cone angle θ increases toward 90°, the period:',
              ['Increases without limit as the string approaches horizontal', 'Decreases toward zero as $ \\cos\\theta $ approaches zero', 'Stays exactly constant, independent of the cone angle used', 'Becomes equal to that of a simple pendulum of length L'],
              1, 'As $ \\theta \\to 90° $, $ \\cos\\theta \\to 0 $, so the period $ 2\\pi\\sqrt{L\\cos\\theta/g} \\to 0 $ — the bob has to whirl faster and faster to keep a near-horizontal string.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'Every circle on this page was turned by a string. On a road there is no string — and the friction page already showed that relying on friction alone caps your speed uncomfortably low. The next page tilts the road itself, and gets the normal force to do the job instead.',
    }),
  ],
};

// ── p13 · Circular Dynamics II — Banking of Roads ───────────────────────────
const p13 = {
  page_number: 13,
  slug: 'circular-dynamics-banking-of-roads',
  title: 'Circular Dynamics — Banking of Roads',
  subtitle: 'Tilt the road, and the normal force does the turning for you',
  glossary: [
    { term: 'banking angle', definition: 'The angle by which a road or track is tilted at a curve. At the design speed, tan θ = v²/rg and no friction is needed at all.' },
    { term: 'design speed', definition: 'The one speed at which a banked curve needs zero friction. Below it, friction acts up the slope; above it, down the slope.' },
  ],
  blocks: [
    hero('circular-dynamics-banking-of-roads'),
    b('curiosity_prompt', 0, {
      prompt: 'A racetrack curve is built tilted — the outer edge lifted well above the inner. So is a velodrome, and so is a railway curve. Why go to all that trouble, when a flat road already works perfectly well for a slow car?',
      hint: 'The friction page found the maximum speed on a flat bend. Ask what happens on a wet day.',
      reveal: 'Because **friction is unreliable, and banking is not.**\n\nOn a flat road, the only thing turning the car is friction, and $ v_{\\max} = \\sqrt{\\mu r g} $ depends entirely on $ \\mu $ — which collapses in rain, on ice, on worn tyres, or on a dusty surface. Every one of those turns a safe corner into a skid, and none of them are under the road builder\'s control.\n\nTilt the road, though, and the **normal force** — which is always there, and does not care about the weather — gets a horizontal component pointing at the centre of the curve. That component can do the entire turning job by itself.\n\nSo a properly banked curve has a speed at which a car could round it safely **even on perfect ice**. That is the whole reason for the trouble.',
    }),
    b('step_solver', 1, {
      title: 'Banking with no friction at all',
      problem: 'A curve of radius $ 80 $ m is banked at an angle $ \\theta $ where $ \\tan\\theta = 0.5 $ (about $ 26.6° $). Find the speed at which a car can round it with **no friction whatsoever**. Take $ g = 10 $ m/s².',
      intro: 'Assume a perfectly icy road, so friction contributes exactly nothing. Only two forces remain — and that is what makes this derivation clean.',
      steps: [
        st('Only two forces act: weight $ mg $ straight down, and the normal force $ N $ **perpendicular to the tilted road surface**. Resolve $ N $ into vertical and horizontal components.',
          'Because the road is tilted, $ N $ is no longer vertical — and its horizontal part is the entire point of banking.', {
            check: {
              kind: 'mcq',
              prompt: 'Which component of the normal force supplies the centripetal force?',
              options: [
                'Its horizontal component $ N\\sin\\theta $, pointing at the curve\'s centre',
                'Its vertical component $ N\\cos\\theta $, pointing straight upward',
                'The whole normal force N, acting perpendicular to the road',
                'Neither — only friction can ever supply a centripetal force',
              ],
              answer_index: 0,
              feedback_right: 'Right — tilting the road tips part of the normal force inward, and that horizontal slice does the turning.',
              feedback_wrong: 'The centripetal force must be horizontal, pointing at the centre of the curve. The normal force\'s horizontal component $ N\\sin\\theta $ is what supplies it; the vertical component holds the car up.',
            },
          }),
        st('**Vertical** (no vertical acceleration): $ N\\cos\\theta = mg $. **Horizontal** (centripetal): $ N\\sin\\theta = \\dfrac{mv^2}{r} $.',
          'Same two-equation structure as the conical pendulum on the previous page — with the normal force playing the role that tension played there.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Dividing gives $ \\tan\\theta = v^2/(rg) $, so $ v = \\sqrt{rg\\tan\\theta} $. Evaluate $ \\sqrt{80 \\times 10 \\times 0.5} $ in m/s.',
              blank_answer: '20',
              feedback_right: 'Yes — $ \\sqrt{400} = 20 $ m/s, which is 72 km/h.',
              feedback_wrong: '$ v = \\sqrt{rg\\tan\\theta} = \\sqrt{80 \\times 10 \\times 0.5} = \\sqrt{400} = 20 $ m/s.',
            },
          }),
        st('$ v = \\sqrt{rg\\tan\\theta} = 20\\ \\text{m/s} = 72\\ \\text{km/h} $ — the **design speed** of this curve.',
          'At exactly 72 km/h, this corner is safe with zero friction. On sheet ice, a car at that speed rounds it perfectly.', {
            why: 'Note the mass cancels once more: $ \\tan\\theta = v^2/rg $ has no $ m $ in it. A loaded truck and a motorbike share the same design speed on the same curve — which is exactly what makes banking practical to engineer. One tilt angle serves every vehicle. Compare the flat-road result $ v_{\\max}=\\sqrt{\\mu r g} $: same structure, but with the unreliable $ \\mu $ replaced by a $ \\tan\\theta $ that is literally built into the ground.',
          }),
      ],
      now_you_try: {
        problem: 'A curve of radius 50 m is banked at an angle where tanθ = 0.8. Take g = 10 m/s². Find its design speed.',
        answer: '$ 20 $ m/s',
        solution: '$ v = \\sqrt{rg\\tan\\theta} = \\sqrt{50 \\times 10 \\times 0.8} = \\sqrt{400} = 20 $ m/s.',
      },
    }),
    b('step_solver', 2, {
      title: 'Designing a curve for a chosen speed',
      problem: 'A highway curve of radius $ 200 $ m is to be built so that vehicles can safely take it at $ 30 $ m/s (108 km/h) without relying on friction. Find the required banking angle. Take $ g = 10 $ m/s².',
      intro: 'The same relation, run backwards — this is the calculation an actual road engineer performs.',
      steps: [
        st('Rearranging $ \\tan\\theta = \\dfrac{v^2}{rg} $ for the angle: $ \\tan\\theta = \\dfrac{30^2}{200 \\times 10} = \\dfrac{900}{2000} = 0.45 $.',
          'Everything on the right is a design choice — the intended speed and the geometry of the land.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find $ \\theta = \\tan^{-1}(0.45) $, in degrees, to one decimal place.',
              blank_answer: '24.2',
              feedback_right: 'Yes — about 24.2°.',
              feedback_wrong: '$ \\theta = \\tan^{-1}(0.45) \\approx 24.2° $.',
            },
          }),
        st('$ \\theta \\approx 24.2° $ — a substantial tilt, which is why real highway curves are banked far less than this and rely partly on friction.',
          'Real roads are typically banked at 5–10°, which is comfortable for slow traffic; race circuits and velodromes, built for one speed, go far steeper.', {
            why: 'The trade-off is worth naming: a steeply banked curve is only *ideal* at one speed. A car crawling round a 24° bank in traffic would tend to slide DOWN the slope toward the inside, and only friction stops it. So public roads compromise — a gentle bank plus friction — while a velodrome, where riders are always fast, can be banked at over 40°.',
          }),
      ],
      now_you_try: {
        problem: 'A curve of radius 125 m is to have a design speed of 25 m/s. Take g = 10 m/s². Find the banking angle.',
        answer: '$ \\approx 26.6° $',
        solution: '$ \\tan\\theta = v^2/(rg) = 625/1250 = 0.5 $, so $ \\theta = \\tan^{-1}(0.5) \\approx 26.6° $.',
      },
    }),
    b('image', 3, {
      src: '',
      alt: 'A car on a banked road shown in cross-section, with the normal force drawn perpendicular to the tilted surface and resolved into a vertical component balancing the weight and a horizontal component pointing toward the centre of the curve, plus a second panel showing friction acting up the slope at low speed and down the slope at high speed.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-banked-road',
      caption: 'Tilting the road tips part of the normal force inward, and that horizontal slice turns the car. Below the design speed friction acts up the slope; above it, friction reverses and acts down.',
    }),
    b('step_solver', 4, {
      title: 'Banking with friction — the maximum safe speed',
      problem: 'The same curve ($ r = 80 $ m, $ \\tan\\theta = 0.5 $) now has friction with $ \\mu = 0.25 $. Find the MAXIMUM speed at which a car can round it without sliding. Take $ g = 10 $ m/s².',
      intro: 'Above the design speed the car tends to slide UP and outward, so friction acts down the slope, opposing that — and adds to the available turning force.',
      steps: [
        st('Above the design speed, the car tends to slide outward and up the bank. Friction therefore acts **down the slope**, and its inward horizontal component now HELPS turn the car.',
          'Getting the direction of friction right is the whole difficulty here — and it is decided by which way the car would slide if friction vanished.', {
            check: {
              kind: 'mcq',
              prompt: 'At a speed ABOVE the design speed, which way does friction act on the tyres?',
              options: [
                'Down the slope, opposing the car\'s tendency to ride up and out',
                'Up the slope, opposing the car\'s tendency to slide down inward',
                'Friction is exactly zero at any speed on a banked curve',
                'Horizontally outward, away from the centre of the curve',
              ],
              answer_index: 0,
              feedback_right: 'Right — too fast means the car tries to climb the bank, so friction acts down the slope to resist that, contributing extra inward force.',
              feedback_wrong: 'Going faster than the design speed, the car needs MORE centripetal force than the normal force alone provides, so it tends to ride UP the bank. Friction opposes that tendency and acts DOWN the slope.',
            },
          }),
        st('With friction at its limit $ f = \\mu N $ acting down the slope, resolving and eliminating $ N $ gives $ v_{\\max} = \\sqrt{\\dfrac{rg(\\tan\\theta + \\mu)}{1 - \\mu\\tan\\theta}} $.',
          'Notice the structure: $ \\mu $ ADDS to $ \\tan\\theta $ on top, because friction and banking now pull in the same direction.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate with $ r=80, \\tan\\theta = 0.5, \\mu = 0.25 $: $ \\sqrt{\\dfrac{800(0.75)}{1 - 0.125}} = \\sqrt{\\dfrac{600}{0.875}} $, in m/s, to one decimal place.',
              blank_answer: '26.2',
              feedback_right: 'Yes — about 26.2 m/s, comfortably above the 20 m/s design speed.',
              feedback_wrong: '$ 600/0.875 = 685.7 $, and $ \\sqrt{685.7} \\approx 26.2 $ m/s.',
            },
          }),
        st('$ v_{\\max} \\approx 26.2\\ \\text{m/s} \\approx 94\\ \\text{km/h} $, against the $ 20 $ m/s design speed and the $ 14.1 $ m/s a FLAT road with the same $ \\mu $ would allow.',
          'Banking and friction together nearly double what friction alone could manage on the same surface.', {
            why: 'That three-way comparison is the argument for banking in one line. Same radius, same tyres, same road surface: **flat = 14.1 m/s, banked with no friction = 20 m/s, banked with friction = 26.2 m/s.** And crucially, if the road ices over and $ \\mu \\to 0 $, the flat road\'s limit collapses to zero while the banked road still safely carries traffic at 20 m/s.',
          }),
      ],
      now_you_try: {
        problem: 'A curve of radius 50 m is banked with tanθ = 0.8, and μ = 0.3. Take g = 10 m/s². Find the maximum safe speed.',
        answer: '$ \\approx 26.9 $ m/s',
        solution: '$ v_{\\max} = \\sqrt{rg(\\tan\\theta+\\mu)/(1-\\mu\\tan\\theta)} = \\sqrt{500(1.1)/(1-0.24)} = \\sqrt{550/0.76} = \\sqrt{723.7} \\approx 26.9 $ m/s.',
      },
    }),
    b('step_solver', 5, {
      title: 'The minimum speed — the one that only exists on a banked road',
      problem: 'For the same banked curve ($ r = 80 $ m, $ \\tan\\theta = 0.5 $, $ \\mu = 0.25 $), find the MINIMUM speed below which the car slides down the bank toward the inside. Take $ g = 10 $ m/s².',
      intro: 'This is the genuinely new idea of banking. On a flat road there is no minimum speed at all — you can stop. On a steep bank, going too slowly is its own hazard.',
      steps: [
        st('Below the design speed, the normal force provides MORE inward force than the circle needs, so the car tends to slide **down** the bank. Friction therefore reverses, acting **up the slope**.',
          'Same reasoning as before, run the other way — friction always opposes the tendency, and the tendency has flipped.', {
            check: {
              kind: 'mcq',
              prompt: 'Compared to the maximum-speed formula, what changes in the minimum-speed formula?',
              options: [
                'The signs of μ flip: $ (\\tan\\theta - \\mu) $ on top, $ (1 + \\mu\\tan\\theta) $ below',
                'Nothing changes — the same formula gives both the limits',
                'The radius r is replaced by its reciprocal in the expression',
                'The value of g must be doubled in the minimum-speed case',
              ],
              answer_index: 0,
              feedback_right: 'Right — friction has reversed direction, so every μ in the formula changes sign.',
              feedback_wrong: 'Friction now acts UP the slope instead of down, which flips the sign of every μ term: $ v_{\\min} = \\sqrt{rg(\\tan\\theta-\\mu)/(1+\\mu\\tan\\theta)} $.',
            },
          }),
        st('$ v_{\\min} = \\sqrt{\\dfrac{rg(\\tan\\theta - \\mu)}{1 + \\mu\\tan\\theta}} = \\sqrt{\\dfrac{800(0.25)}{1.125}} = \\sqrt{177.8} \\approx 13.3\\ \\text{m/s} $',
          'So this curve is safe between about 13.3 m/s and 26.2 m/s — a genuine window, with the 20 m/s design speed sitting inside it.', {
            check: {
              kind: 'mcq',
              prompt: 'What happens if $ \\mu \\ge \\tan\\theta $ — say a well-gripped road with a gentle bank?',
              options: [
                'The formula gives zero or an imaginary result — there is no minimum speed at all',
                'The minimum speed becomes larger than the maximum speed',
                'The car can never round the curve at any speed whatsoever',
                'The banking angle must then be recalculated from scratch',
              ],
              answer_index: 0,
              feedback_right: 'Right — with enough friction the car simply will not slide down, however slowly it goes. It can even stop safely on the bank.',
              feedback_wrong: 'If $ \\mu \\ge \\tan\\theta $, the numerator $ (\\tan\\theta - \\mu) $ is zero or negative, meaning there is no lower limit — friction alone is enough to stop the car sliding down, so it can crawl or even park on the bank safely.',
            },
          }),
      ],
      now_you_try: {
        problem: 'For the curve with r = 50 m, tanθ = 0.8, μ = 0.3, take g = 10 m/s². Find the minimum safe speed.',
        answer: '$ \\approx 14.2 $ m/s',
        solution: '$ v_{\\min} = \\sqrt{rg(\\tan\\theta-\\mu)/(1+\\mu\\tan\\theta)} = \\sqrt{500(0.5)/(1.24)} = \\sqrt{201.6} \\approx 14.2 $ m/s.',
      },
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('On a banked curve with no friction, the centripetal force is supplied by:',
          ['The horizontal component of the normal force from the road', 'The vertical component of the normal force from the road', 'The car\'s own weight, acting downward toward the ground', 'Friction between the tyres and the tilted road surface'],
          0, 'Tilting the road gives the normal force a horizontal component $ N\\sin\\theta $ pointing at the centre of the curve — and with no friction, that component is the only horizontal force available.', 2),
        q('The design speed of a banked curve, $ v = \\sqrt{rg\\tan\\theta} $, depends on:',
          ['The mass of the vehicle rounding the curve at that moment', 'Only the radius, the banking angle, and g — not on mass at all', 'The coefficient of friction between the tyres and the road', 'The width of the road at the point of the curve'],
          1, 'Mass cancels from $ \\tan\\theta = v^2/rg $, so one banking angle serves every vehicle — and friction does not appear at all in the frictionless design case.', 2),
        q('A car travels FASTER than the design speed on a banked curve. Friction on it acts:',
          ['Up the slope, opposing a tendency to slide down the bank', 'Down the slope, opposing a tendency to ride up the bank', 'Exactly zero, since the road is banked for this situation', 'Vertically upward, adding to the normal force present'],
          1, 'Too fast means the car needs more centripetal force than banking alone supplies, so it tends to ride UP and out. Friction opposes that tendency, acting down the slope.', 3),
        q('The main advantage of banking over relying on friction alone is that:',
          ['The normal force is always present and does not depend on weather', 'Banking removes the need for a car to have any tyres at all', 'Banked roads are considerably cheaper to build than flat ones', 'Banking allows a car to travel at any speed with total safety'],
          0, 'Friction collapses in rain, ice or dust; the normal force does not. A properly banked curve has a speed at which it is safe even with zero friction.', 2),
        q('On a banked road where $ \\mu \\ge \\tan\\theta $, the minimum safe speed is:',
          ['Equal to the design speed of that particular curve', 'Nonexistent — the car will not slide down at any speed', 'Higher than on a curve with a smaller coefficient', 'Exactly half of the maximum safe speed for that curve'],
          1, 'The numerator $ (\\tan\\theta - \\mu) $ goes to zero or negative, so no lower bound exists — friction alone prevents sliding down, and the car could even park on the bank.', 3),
      ],
    }),
    b('callout', 7, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Banking, no friction:** $ N\\cos\\theta = mg $ and $ N\\sin\\theta = mv^2/r $, giving the **design speed** $ v = \\sqrt{rg\\tan\\theta} $ — mass-independent.\n- **Above** the design speed the car tends to ride up, so friction acts **down** the slope; **below** it, friction acts **up**.\n- $ v_{\\max} = \\sqrt{\\dfrac{rg(\\tan\\theta+\\mu)}{1-\\mu\\tan\\theta}} $ and $ v_{\\min} = \\sqrt{\\dfrac{rg(\\tan\\theta-\\mu)}{1+\\mu\\tan\\theta}} $ — the same formula with the sign of μ flipped.\n- If $ \\mu \\ge \\tan\\theta $, there is **no minimum speed** — the car cannot slide down.\n- Banking works because the **normal force is always there**; friction is the part that fails in the rain.',
    }),
    b('practice_bank', 8, {
      title: 'You solve it',
      intro: 'Seven questions. Before any formula, decide whether the car is above or below the design speed — that decides which way friction points, and everything else follows.',
      sections: [
        {
          id: 'p13-ysi',
          title: 'Banking of Roads',
          items: [
            num('p13-y1', 'A curve of radius 100 m is banked at an angle where tanθ = 0.2. Take g = 10 m/s². Find the design speed.',
              '$ \\approx 14.14 $ m/s',
              '$ v = \\sqrt{rg\\tan\\theta} = \\sqrt{100 \\times 10 \\times 0.2} = \\sqrt{200} \\approx 14.14 $ m/s.'),
            num('p13-y2', 'A curve of radius 160 m is to have a design speed of 20 m/s. Take g = 10 m/s². Find tanθ for the required banking angle.',
              '$ 0.25 $',
              '$ \\tan\\theta = v^2/(rg) = 400/1600 = 0.25 $, so $ \\theta \\approx 14° $.'),
            mcq('p13-y3', 'A car rounds a banked curve at EXACTLY the design speed. The friction force on it is:',
              ['At its maximum value μN, acting down the slope of the road', 'Exactly zero — the banking alone supplies all the turning force', 'At its maximum value μN, acting up the slope of the road', 'Equal to the weight of the car acting along the slope'],
              1, 'The design speed is defined as the speed at which the normal force alone supplies exactly the required centripetal force — so friction is not needed and adjusts itself to zero.'),
            num('p13-y4', 'A banked curve has r = 90 m, tanθ = 0.5 and μ = 0.2. Take g = 10 m/s². Find the maximum safe speed.',
              '$ \\approx 26.46 $ m/s',
              '$ rg = 900 $. Numerator: $ rg(\\tan\\theta+\\mu) = 900(0.7) = 630 $. Denominator: $ 1 - \\mu\\tan\\theta = 1 - 0.1 = 0.9 $. So $ v_{\\max} = \\sqrt{630/0.9} = \\sqrt{700} \\approx 26.46 $ m/s.'),
            mcq('p13-y5', 'Compared with a flat road of the same radius and the same tyres, a banked road allows a maximum speed that is:',
              ['Exactly the same, since the tyres are unchanged between them', 'Higher, since banking adds to what friction alone can supply', 'Lower, because the tilt reduces the normal force on the tyres', 'Unrelated — banking affects only the minimum speed possible'],
              1, 'Banking contributes its own inward force via $ N\\sin\\theta $, on top of whatever friction supplies — so the two together always beat friction alone.'),
            num('p13-y6', 'A velodrome track of radius 25 m is banked at 45°. Take g = 10 m/s², tan45° = 1. Find the design speed.',
              '$ \\approx 15.81 $ m/s',
              '$ v = \\sqrt{rg\\tan\\theta} = \\sqrt{25 \\times 10 \\times 1} = \\sqrt{250} \\approx 15.81 $ m/s (about 57 km/h).'),
            mcq('p13-y7', 'A railway curve is banked by raising the outer rail. The main purpose is to:',
              ['Let the rails\' normal force supply the centripetal force needed', 'Reduce the total weight the track has to carry at the curve', 'Increase the friction available between the wheels and rails', 'Make the train travel a shorter distance around the curve'],
              0, 'Exactly the same principle as a banked road: tilting lets the normal force from the rails contribute an inward horizontal component, instead of loading the wheel flanges sideways.'),
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'That completes the physics of this chapter. What remains is consolidation — a recap of every result in one place, the NCERT exercises worked in full, and a drill covering all six topic areas at exam standard.',
    }),
  ],
};

// ── run ──────────────────────────────────────────────────────────────────────
withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p12, p13]);
  console.log('\n✅ Ch.4 Wave 3a done: p12–p13 (vertical circle + conical pendulum, banking of roads)');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
