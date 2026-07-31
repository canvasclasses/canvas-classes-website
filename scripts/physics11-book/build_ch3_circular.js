'use strict';
/**
 * Class 11 Physics · Chapter 3 "Motion in Two Dimensions" — pages 10–12.
 * Wave 2a: the angular language, centripetal acceleration, and non-uniform
 * circular motion.
 *
 * SCOPE (plan conflict C3, and §7 decision 4): this chapter stops at
 * a_c = v²/r. Centripetal FORCE, banked roads, the conical pendulum and vertical
 * circles are DYNAMICS and belong to Laws of Motion. p11 carries an explicit
 * "Note on Scope" callout so a student who has already met banked roads in a
 * coaching class is not confused by their absence here.
 *
 * p12 restores plan gap G2 — NCERT §3.10 treats only the UNIFORM case, so
 * tangential and angular acceleration never appear in it, yet `tag_k2d_4`
 * explicitly says "Uniform & Non-uniform". Sourced from the reference book's
 * circular-kinematics section and marked `tier: 'competitive'`.
 *
 * Run: node scripts/physics11-book/build_ch3_circular.js
 */
const { b, q, st, mcq, hero, num, ensureChapter, upsertPages, withDb } = require('./_book_ch3');

// ── p10 · Going Round in a Circle — the Angular Language ─────────────────────
const p10 = {
  page_number: 10,
  slug: 'going-round-in-a-circle',
  title: 'Going Round in a Circle — the Angular Language',
  subtitle: 'Where radians finally earn their keep',
  glossary: [
    { term: 'angular position', definition: 'The angle θ between the radius to the particle and a fixed reference direction.' },
    { term: 'angular velocity', definition: 'The rate of change of angular position, ω = dθ/dt, measured in rad/s.' },
    { term: 'time period', definition: 'The time taken for one complete revolution, T. The frequency is f = 1/T.' },
  ],
  blocks: [
    hero('going-round-in-a-circle'),
    b('curiosity_prompt', 0, {
      prompt: 'A record is spinning. Point A is near the centre, point B is out at the rim. Which is moving faster — and which is going round faster?',
      hint: 'Those are two different questions. Answer them separately.',
      reveal: '**B is moving faster. Neither is going round faster — they are equal.**\n\nIn one revolution, B travels the whole way round the rim while A traces a much smaller circle. So B covers more metres per second: it has the larger **linear speed**.\n\nBut both complete one revolution in exactly the same time. They sweep the same *angle* per second. So their **angular speed** is identical.\n\nThat is why circular motion gets its own language. Describing this in metres per second is awkward — every point on the record has a different answer. Describing it in radians per second gives one number for the whole record.',
    }),
    b('text', 1, {
      markdown: 'Fix a reference direction from the centre. The **angular position** $ \\theta $ is the angle the radius has turned through, and the **angular velocity** is its rate of change:\n\n$ \\omega = \\dfrac{d\\theta}{dt} $\n\nOne revolution is $ 2\\pi $ radians, so if $ T $ is the **time period** — the time for one full revolution — then\n\n$ \\omega = \\dfrac{2\\pi}{T} = 2\\pi f \\qquad\\text{where } f = \\dfrac{1}{T} \\text{ is the frequency} $',
    }),
    b('step_solver', 2, {
      title: 'From revolutions counted to angular speed',
      problem: 'An insect trapped in a circular groove of radius $ 12 $ cm moves along the groove steadily and completes $ 7 $ revolutions in $ 100 $ s. Find its angular speed and its linear speed.',
      intro: 'The commonest real-world starting point: somebody has counted revolutions with a stopwatch. Turn that into $ \\omega $ first.',
      steps: [
        st('$ 7 $ revolutions in $ 100 $ s, so $ \\quad T = \\dfrac{100}{7}\\ \\text{s} $ per revolution',
          'Time period is seconds per revolution — not revolutions per second, which is the frequency.', {
            check: {
              kind: 'mcq',
              prompt: 'Which formula turns this into $ \\omega $?',
              options: ['$ \\omega = 2\\pi/T $', '$ \\omega = T/2\\pi $', '$ \\omega = 2\\pi T $', '$ \\omega = 1/T $'],
              answer_index: 0,
              feedback_right: 'Right — one revolution is $ 2\\pi $ radians, spread over time $ T $.',
              feedback_wrong: 'One revolution sweeps $ 2\\pi $ radians and takes time $ T $, so the rate is $ \\omega = 2\\pi/T $. The expression $ 1/T $ is the frequency in revolutions per second, which is a different quantity.',
            },
          }),
        st('$ \\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi \\times 7}{100} = 0.44\\ \\text{rad/s} $',
          'Note the shortcut used here: rather than computing $ T $ and then dividing, $ 2\\pi \\times (\\text{revolutions}/\\text{time}) $ gets there in one step.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the linear speed, from $ v = r\\omega $ with $ r = 12 $ cm. Give the answer in cm/s to one decimal place.',
              blank_answer: '5.3',
              feedback_right: 'Yes — $ 0.44 \\times 12 = 5.3 $ cm/s.',
              feedback_wrong: '$ v = r\\omega = 12 \\times 0.44 = 5.3 $ cm/s. Note that $ \\omega $ must be in **rad/s** for this to work.',
            },
          }),
        st('$ \\omega = 0.44\\ \\text{rad/s} $ and $ v = 5.3\\ \\text{cm/s} $',
          'The velocity points along the tangent to the groove at every instant, as page 2 established for any curved path.', {
            why: 'Watch the units in $ v = r\\omega $. Radians are *dimensionless* — an angle is one length divided by another — so $ \\text{m} \\times \\text{rad/s} $ comes out as $ \\text{m/s} $ with nothing left over. **That only works in radians.** Feed degrees per second into $ v = r\\omega $ and the answer is wrong by a factor of $ \\pi/180 $. This is the payoff Chapter 0 promised when it insisted on radians.',
          }),
      ],
      now_you_try: {
        problem: 'A stone tied to the end of a string $ 80 $ cm long is whirled in a horizontal circle at constant speed, making $ 14 $ revolutions in $ 25 $ s. Find its angular speed and linear speed.',
        answer: '$ \\omega = 3.52 $ rad/s, $ v = 2.81 $ m/s',
        solution: '$ \\omega = 2\\pi(14)/25 = 87.96/25 = 3.52 $ rad/s. Then $ v = r\\omega = 0.80 \\times 3.52 = 2.81 $ m/s. Converting the 80 cm to metres before using $ v = r\\omega $ is what keeps the answer in m/s.',
      },
    }),
    b('step_solver', 3, {
      title: 'Where v = rω comes from',
      problem: 'Derive the relation between the linear speed $ v $ of a particle in circular motion and its angular speed $ \\omega $.',
      intro: 'Two lines, and it is worth doing because the derivation shows exactly why radians are compulsory.',
      steps: [
        st('In a small time $ \\Delta t $, the radius turns through $ \\Delta\\theta $ and the particle travels an arc $ \\Delta s $.',
          'The arc-length relation from Chapter 0 is $ \\Delta s = r\\Delta\\theta $ — and that formula is **only** true with $ \\Delta\\theta $ in radians.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is $ s = r\\theta $ only valid in radians?',
              options: [
                'Because the radian is defined as the angle whose arc equals the radius',
                'Because degrees are too large a unit',
                'Because radians are dimensionless',
                'Because $ \\pi $ appears in the formula',
              ],
              answer_index: 0,
              feedback_right: 'Right — the radian is *defined* to make this relation come out with no constant.',
              feedback_wrong: 'One radian is defined as the angle subtending an arc equal in length to the radius, so $ s = r\\theta $ needs no conversion factor. In degrees the relation would be $ s = r\\theta\\pi/180 $.',
            },
          }),
        st('Divide by $ \\Delta t $ and take the limit: $ \\quad \\lim_{\\Delta t \\to 0}\\dfrac{\\Delta s}{\\Delta t} = r\\lim_{\\Delta t \\to 0}\\dfrac{\\Delta\\theta}{\\Delta t} $',
          'The radius $ r $ is constant, so it comes straight through the limit.', {
            check: {
              kind: 'mcq',
              prompt: 'What are the two limits, in the notation of this page?',
              options: ['$ v $ and $ \\omega $', '$ \\omega $ and $ v $', '$ a $ and $ \\alpha $', '$ s $ and $ \\theta $'],
              answer_index: 0,
              feedback_right: 'Right — $ ds/dt = v $ and $ d\\theta/dt = \\omega $.',
              feedback_wrong: 'The left side is $ ds/dt $, which is the linear speed $ v $. The right limit is $ d\\theta/dt $, which is $ \\omega $.',
            },
          }),
        st('$ v = r\\omega $',
          'The bridge between the angular description and the linear one.', {
            why: 'Read it as a statement about a rotating rigid body: **$ \\omega $ is shared, $ v $ is not.** Every point on a spinning record has the same $ \\omega $, and a linear speed proportional to how far out it sits. That is why the outer edge of a CD moves fastest and the label barely moves at all.',
          }),
      ],
      now_you_try: {
        problem: 'A wheel of radius $ 0.35 $ m rotates at $ 120 $ revolutions per minute. Find the linear speed of a point on its rim.',
        answer: '$ 4.4 $ m/s',
        solution: '$ 120 $ rev/min is $ 2 $ rev/s, so $ \\omega = 2\\pi(2) = 12.57 $ rad/s. Then $ v = r\\omega = 0.35(12.57) = 4.4 $ m/s. Converting rev/min to rev/s before multiplying by $ 2\\pi $ is the step most often skipped.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('Two points on a rotating disc, one at the rim and one halfway to the centre, have:',
          ['The same angular speed and the same linear speed', 'The same angular speed but different linear speeds', 'Different angular speeds but the same linear speed', 'Different angular speeds and different linear speeds'], 1,
          'Both complete a revolution in the same time, so $ \\omega $ is shared. But $ v = r\\omega $, so the rim point — with twice the radius — has twice the linear speed.', 2),
        q('The angular speed of a particle completing one revolution every $ 4 $ s is:',
          ['$ 0.25 $ rad/s', '$ \\pi/2 $ rad/s', '$ 4\\pi $ rad/s', '$ 2\\pi $ rad/s'], 1,
          '$ \\omega = 2\\pi/T = 2\\pi/4 = \\pi/2 \\approx 1.57 $ rad/s. The value $ 0.25 $ is $ 1/T $, the frequency in revolutions per second, not the angular speed.', 1),
        q('In the relation $ v = r\\omega $, the angular speed must be in:',
          ['Degrees per second', 'Radians per second', 'Revolutions per second', 'Any of these units'], 1,
          '$ v = r\\omega $ follows from $ s = r\\theta $, which is only true in radians. Using degrees per second gives an answer wrong by a factor of $ \\pi/180 $.', 1),
        q('The minute hand of a clock has an angular speed of about:',
          ['$ 1.75 \\times 10^{-3} $ rad/s', '$ 1.75 \\times 10^{-2} $ rad/s', '$ 0.105 $ rad/s', '$ 6.28 $ rad/s'], 0,
          'One revolution in $ 3600 $ s, so $ \\omega = 2\\pi/3600 = 1.75 \\times 10^{-3} $ rad/s. A slow rotation gives a tiny angular speed, and the value is independent of how long the hand is.', 2),
      ],
    }),
    b('image', 5, {
      src: '',
      alt: 'A circle with the centre marked, a radius drawn to a particle, the angle theta from a reference direction, an arc s along the circumference, and the velocity drawn tangentially.',
      aspect_ratio: '16:9',
      figure_key: 'ch3-angular-language',
      caption: 'One angle, one arc, one tangential velocity. Everything on this page is a relation between these three.',
    }),
    b('step_solver', 6, {
      title: 'Two gears, one belt',
      problem: 'Two pulleys of radii $ 10 $ cm and $ 25 $ cm are joined by a belt that does not slip. The smaller pulley rotates at $ 300 $ revolutions per minute. Find the angular speed of the larger pulley.',
      intro: 'A belt drive is the standard test of whether you have kept $ v $ and $ \\omega $ apart, because one of them is shared and one is not.',
      steps: [
        st('The belt does not slip, so the **rim speed** of the two pulleys must be the same: $ \\quad v_1 = v_2 $.',
          'It is the *linear* speed that the belt forces to match, not the angular speed. The belt is a length of material moving at one speed.', {
            check: {
              kind: 'mcq',
              prompt: 'So which quantity is shared between the two pulleys?',
              options: ['The linear rim speed $ v $', 'The angular speed $ \\omega $', 'Both $ v $ and $ \\omega $', 'Neither'],
              answer_index: 0,
              feedback_right: 'Right — and this is the opposite of the rotating-disc case, where $ \\omega $ was shared.',
              feedback_wrong: 'The belt is one continuous loop moving at one speed, so it is the rim *linear* speed that matches. Their angular speeds must therefore differ, since $ \\omega = v/r $ and the radii differ.',
            },
          }),
        st('$ \\omega_1 = 2\\pi(300/60) = 2\\pi(5) = 31.4\\ \\text{rad/s}, \\quad\\text{so}\\quad v = r_1\\omega_1 = 0.10(31.4) = 3.14\\ \\text{m/s} $',
          'Convert rev/min to rev/s, then to rad/s, then to a rim speed.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now $ \\omega_2 = v/r_2 $ with $ r_2 = 0.25 $ m. Give the answer in rad/s to one decimal place.',
              blank_answer: '12.6',
              feedback_right: 'Yes — $ 3.14/0.25 = 12.6 $ rad/s.',
              feedback_wrong: '$ \\omega_2 = v/r_2 = 3.14/0.25 = 12.6 $ rad/s — slower than the small pulley, as a bigger wheel on the same belt must be.',
            },
          }),
        st('$ \\omega_2 = 12.6\\ \\text{rad/s} $, i.e. $ 120 $ revolutions per minute',
          'The radii are in the ratio $ 10:25 = 2:5 $, and the angular speeds come out in the ratio $ 5:2 $ — exactly inverted.', {
            why: 'That inversion is the whole idea behind gearing: $ \\omega \\propto 1/r $ when $ v $ is fixed. A bicycle in a low gear drives a large rear sprocket slowly with lots of turning effort; a high gear drives a small one quickly. **Which quantity is shared depends on how the parts are connected** — rigidly attached shares $ \\omega $, belt-connected shares $ v $. Getting that backwards is the classic error here.',
          }),
      ],
      now_you_try: {
        problem: 'Two pulleys of radii $ 15 $ cm and $ 45 $ cm are belt-connected. If the larger rotates at $ 100 $ rev/min, find the revolutions per minute of the smaller.',
        answer: '$ 300 $ rev/min',
        solution: 'The rim speeds match, so $ r_1\\omega_1 = r_2\\omega_2 $ and $ \\omega_1/\\omega_2 = r_2/r_1 = 45/15 = 3 $. So the smaller pulley turns three times as fast: $ 300 $ rev/min. Since both sides are ratios, there is no need to convert to rad/s at all.',
      },
    }),
    b('step_solver', 7, {
      title: 'Displacement and distance for part of a circle',
      problem: 'A particle moves at constant speed round a circle of radius $ r $. Find the ratio of the magnitude of its average velocity to its instantaneous speed when it has turned through a quarter of a revolution.',
      intro: 'A chance to reuse Chapter 2\'s distinction between path length and displacement, on a path where the two differ dramatically.',
      steps: [
        st('Distance travelled along the arc: $ \\quad s = r\\theta = r\\left(\\dfrac{\\pi}{2}\\right) $',
          'A quarter revolution is $ \\pi/2 $ radians, so the arc length follows from $ s = r\\theta $.', {
            check: {
              kind: 'mcq',
              prompt: 'And the **displacement** — the straight-line distance from start to finish?',
              options: [
                '$ r\\sqrt{2} $, the chord across a quarter circle',
                '$ r\\pi/2 $, the same as the arc',
                '$ 2r $, the diameter',
                '$ r $, the radius',
              ],
              answer_index: 0,
              feedback_right: 'Right — the two radii are perpendicular, so the chord is the hypotenuse.',
              feedback_wrong: 'Start and finish are at the ends of two perpendicular radii, so the straight-line gap is $ \\sqrt{r^2 + r^2} = r\\sqrt{2} $. The arc $ r\\pi/2 $ is the distance *travelled*, which is longer.',
            },
          }),
        st('Time taken: $ \\quad t = \\dfrac{s}{v} = \\dfrac{r\\pi}{2v} $',
          'The speed is constant, so time is arc length over speed.', {
            check: {
              kind: 'mcq',
              prompt: 'So the magnitude of the average velocity, $ |\\Delta\\mathbf{r}|/t $, is:',
              options: [
                '$ \\dfrac{2\\sqrt{2}\\,v}{\\pi} $',
                '$ \\dfrac{\\sqrt{2}\\,v}{\\pi} $',
                '$ \\dfrac{v}{\\sqrt{2}} $',
                '$ \\dfrac{\\pi v}{2\\sqrt{2}} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — $ r\\sqrt{2} \\div \\dfrac{r\\pi}{2v} = \\dfrac{2\\sqrt{2}v}{\\pi} $.',
              feedback_wrong: 'Divide the displacement by the time: $ r\\sqrt{2} \\div \\dfrac{r\\pi}{2v} = \\dfrac{2\\sqrt{2}v}{\\pi} $. The $ r $ cancels, which it must — the ratio cannot depend on the size of the circle.',
            },
          }),
        st('$ \\dfrac{|\\bar{\\mathbf{v}}|}{v} = \\dfrac{2\\sqrt{2}}{\\pi} \\approx 0.90 $',
          'So the average velocity is only 90% of the instantaneous speed, even though the speed never changed.', {
            why: 'That gap is the whole point. **The speed was constant at $ v $ the entire time, yet the average velocity is smaller.** Nothing has gone wrong: the particle wasted some of its travel curving round, so it ended up closer to the start than its path length would suggest. Over a *full* revolution the displacement is zero and the average velocity is zero, while the speed is still $ v $.',
          }),
      ],
      now_you_try: {
        problem: 'A particle moves at constant speed round a circle. Find the ratio of the magnitude of its average velocity to its speed over **half** a revolution.',
        answer: '$ 2/\\pi \\approx 0.64 $',
        solution: 'Half a revolution: the arc is $ \\pi r $ and the displacement is the diameter, $ 2r $. The time is $ \\pi r/v $, so the average velocity magnitude is $ 2r \\div (\\pi r/v) = 2v/\\pi $, giving a ratio of $ 2/\\pi = 0.64 $. It is smaller than the quarter-revolution answer, and heads to zero over a full revolution.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('Two pulleys of different radii are connected by a non-slipping belt. Which quantity is the same for both?',
          ['The angular speed', 'The linear speed of the rim', 'The time period', 'The number of revolutions per minute'], 1,
          'The belt is one continuous loop moving at a single speed, so it forces the rim *linear* speeds to match. Their angular speeds are then inversely proportional to their radii.', 2),
        q('Over one complete revolution at constant speed, the average velocity of a particle is:',
          ['Equal to its speed', 'Zero', 'Half its speed', '$ 2/\\pi $ times its speed'], 1,
          'The particle returns to its starting point, so the displacement — and therefore the average velocity — is exactly zero. The average *speed* over the same interval is the full $ v $.', 2),
        q('A particle rotating at $ \\omega $ on a circle of radius $ r $ has its radius doubled while $ \\omega $ is kept the same. Its linear speed:',
          ['Stays the same', 'Doubles', 'Halves', 'Quadruples'], 1,
          '$ v = r\\omega $ is linear in $ r $, so doubling the radius at fixed $ \\omega $ doubles the linear speed.', 1),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ \\omega = \\dfrac{d\\theta}{dt} = \\dfrac{2\\pi}{T} = 2\\pi f $, in **rad/s**.\n- $ s = r\\theta $ and $ v = r\\omega $ — **both only valid in radians.** That is what radians are for.\n- Every point of a **rigidly rotating** body shares $ \\omega $; its $ v $ grows with $ r $.\n- Two wheels joined by a **non-slipping belt** share $ v $; their $ \\omega $ goes as $ 1/r $.\n- The velocity is **tangential** at every instant.\n- Over a whole revolution the displacement is zero, so the average velocity is zero — while the speed never changed.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Seven questions. On every belt-or-gear question, decide first which quantity is shared before writing anything down.',
      sections: [
        {
          id: 'p10-ysi',
          title: 'The angular language',
          items: [
            num('p10-y1', 'A fan blade of radius $ 0.30 $ m rotates at $ 900 $ revolutions per minute. Find its angular speed and the linear speed of a blade tip.',
              '$ \\omega = 94.2 $ rad/s, $ v = 28.3 $ m/s',
              '$ 900 $ rev/min $ = 15 $ rev/s, so $ \\omega = 2\\pi(15) = 94.2 $ rad/s. Then $ v = 0.30(94.2) = 28.3 $ m/s.'),
            mcq('p10-y2', 'The angular speed of the hour hand of a clock is:',
              ['$ 2\\pi/3600 $ rad/s', '$ 2\\pi/43200 $ rad/s', '$ 2\\pi/86400 $ rad/s', '$ 2\\pi/60 $ rad/s'], 1,
              'An hour hand completes one revolution in 12 hours, which is $ 12 \\times 3600 = 43200 $ s. So $ \\omega = 2\\pi/43200 $ rad/s. The 3600 s answer is the minute hand and 86400 s would be a full day.'),
            num('p10-y3', 'A cyclist\'s wheel has radius $ 0.35 $ m. If the bicycle moves at $ 7 $ m/s without slipping, find the angular speed of the wheel.',
              '$ 20 $ rad/s',
              'Without slipping, the rim speed equals the road speed, so $ \\omega = v/r = 7/0.35 = 20 $ rad/s. That is about 3.2 revolutions per second.'),
            mcq('p10-y4', 'A particle completes $ 5 $ revolutions in $ 2 $ s. Its angular speed is:',
              ['$ 2.5 $ rad/s', '$ 5\\pi $ rad/s', '$ 10\\pi $ rad/s', '$ 2.5\\pi $ rad/s'], 1,
              '$ \\omega = 2\\pi \\times (\\text{revolutions}/\\text{time}) = 2\\pi(5/2) = 5\\pi \\approx 15.7 $ rad/s.'),
            num('p10-y5', 'Two gears are rigidly mounted on the same shaft, of radii $ 4 $ cm and $ 12 $ cm. The shaft turns at $ 60 $ rev/min. Find the rim speed of each gear.',
              '$ 0.25 $ m/s and $ 0.75 $ m/s',
              'Rigidly mounted on one shaft means they share $ \\omega = 2\\pi(1) = 6.28 $ rad/s. Then $ v_1 = 0.04(6.28) = 0.25 $ m/s and $ v_2 = 0.12(6.28) = 0.75 $ m/s. Here $ \\omega $ is shared and $ v $ differs — the opposite of a belt drive.'),
            mcq('p10-y6', 'A particle moves at constant speed on a circle. Over a quarter revolution, the ratio of the distance travelled to the magnitude of its displacement is:',
              ['$ 1 $, since the two are always equal', '$ \\pi/(2\\sqrt{2}) $', '$ \\pi/2 $, the quarter-turn angle', '$ \\sqrt{2} $, the diagonal ratio'], 1,
              'Arc $ = \\pi r/2 $ and chord $ = r\\sqrt{2} $, so the ratio is $ \\pi/(2\\sqrt{2}) \\approx 1.11 $. The path is about 11% longer than the straight-line gap.'),
            num('p10-y7', 'A record turntable slows from $ 33 $ rev/min to rest. What is its angular speed at the start, in rad/s?',
              '$ 3.46 $ rad/s',
              '$ 33 $ rev/min $ = 33/60 = 0.55 $ rev/s, so $ \\omega = 2\\pi(0.55) = 3.46 $ rad/s.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'The language is in place. Now the question page 2 raised and left hanging: a car going round a bend at a perfectly steady speed — **is it accelerating?**',
    }),
  ],
};

// ── p11 · Centripetal Acceleration ───────────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'centripetal-acceleration',
  title: 'Centripetal Acceleration',
  subtitle: 'Constant speed, changing velocity — and the promise from page 2 paid off',
  glossary: [
    { term: 'centripetal acceleration', definition: 'The acceleration of a body in circular motion, directed towards the centre, of magnitude v²/r = ω²r. "Centripetal" means centre-seeking.' },
    { term: 'uniform circular motion', definition: 'Circular motion at constant speed. The velocity still changes, because its direction does.' },
  ],
  blocks: [
    hero('centripetal-acceleration'),
    b('curiosity_prompt', 0, {
      prompt: 'A car goes round a roundabout at a steady 30 km/h. Its speedometer needle does not move for the whole turn. Which way is the car accelerating — and how big is that acceleration?',
      hint: 'Draw the velocity at two nearby instants and subtract them.',
      reveal: '**Towards the centre of the roundabout**, with magnitude $ v^2/r $.\n\nThe speed never changed, so nothing accelerated the car *along* its direction of travel. But the velocity certainly changed — it swung round. And the change in a velocity is a vector: draw $ \\mathbf{v} $ and $ \\mathbf{v}\' $ at two nearby instants, subtract, and the difference $ \\Delta\\mathbf{v} $ points **inwards**.\n\nThis is the case page 2 set aside as "turning at constant speed", where $ \\mathbf{v}\\cdot\\mathbf{a} = 0 $. Now it gets a number.\n\nAnd notice what has to be true: a *constant-magnitude* acceleration that always points at the centre is **not a constant vector**, because its direction is changing all the time.',
    }),
    b('step_solver', 1, {
      title: 'Deriving the centripetal acceleration',
      problem: 'A particle moves with constant speed $ v $ on a circle of radius $ R $. Derive the magnitude of its acceleration.',
      intro: 'A geometric argument, not an algebraic one. Two similar triangles do all the work.',
      steps: [
        st('At two nearby instants the position vectors are $ \\mathbf{r} $, $ \\mathbf{r}\' $ and the velocities $ \\mathbf{v} $, $ \\mathbf{v}\' $, with the same angle $ \\Delta\\theta $ between each pair.',
          'The velocity is always perpendicular to the radius, so rotating the radius by $ \\Delta\\theta $ rotates the velocity by the same $ \\Delta\\theta $.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the angle between $ \\mathbf{v} $ and $ \\mathbf{v}\' $ the same as between $ \\mathbf{r} $ and $ \\mathbf{r}\' $?',
              options: [
                'Because each velocity is perpendicular to its own radius, so both turn together',
                'Because the speed is constant',
                'Because the time interval is small',
                'Because the radius is constant',
              ],
              answer_index: 0,
              feedback_right: 'Right — a rigid $ 90° $ offset means the two vectors rotate in lockstep.',
              feedback_wrong: 'The velocity is tangential, hence perpendicular to the radius, at every instant. If the radius turns by $ \\Delta\\theta $ then so must the velocity, since the $ 90° $ offset between them never changes.',
            },
          }),
        st('So the triangle of $ \\mathbf{r}, \\mathbf{r}\', \\Delta\\mathbf{r} $ and the triangle of $ \\mathbf{v}, \\mathbf{v}\', \\Delta\\mathbf{v} $ are **similar** — both isosceles with the same apex angle.',
          'Similar triangles have equal ratios of base to side.', {
            check: {
              kind: 'mcq',
              prompt: 'Writing that ratio equality gives:',
              options: [
                '$ \\dfrac{|\\Delta\\mathbf{v}|}{v} = \\dfrac{|\\Delta\\mathbf{r}|}{R} $',
                '$ \\dfrac{|\\Delta\\mathbf{v}|}{R} = \\dfrac{|\\Delta\\mathbf{r}|}{v} $',
                '$ |\\Delta\\mathbf{v}| = |\\Delta\\mathbf{r}| $',
                '$ \\dfrac{v}{R} = \\dfrac{|\\Delta\\mathbf{r}|}{|\\Delta\\mathbf{v}|} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — base over side, matched between the two triangles.',
              feedback_wrong: 'In the velocity triangle the two equal sides have length $ v $ and the base is $ |\\Delta\\mathbf{v}| $. In the position triangle the sides are $ R $ and the base is $ |\\Delta\\mathbf{r}| $. Similarity gives $ |\\Delta\\mathbf{v}|/v = |\\Delta\\mathbf{r}|/R $.',
            },
          }),
        st('$ |\\Delta\\mathbf{v}| = \\dfrac{v}{R}|\\Delta\\mathbf{r}| \\quad \\Rightarrow \\quad a = \\lim_{\\Delta t \\to 0}\\dfrac{|\\Delta\\mathbf{v}|}{\\Delta t} = \\dfrac{v}{R}\\lim_{\\Delta t \\to 0}\\dfrac{|\\Delta\\mathbf{r}|}{\\Delta t} $',
          'And in the limit, the chord $ |\\Delta\\mathbf{r}| $ becomes the arc, so that last limit is just the speed $ v $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Substituting that limit gives $ a = v^2/R $. For $ v = 10 $ m/s and $ R = 20 $ m, find $ a $ in m/s².',
              blank_answer: '5',
              feedback_right: 'Yes — $ 100/20 = 5 $ m/s².',
              feedback_wrong: '$ a = v^2/R = 100/20 = 5 $ m/s².',
            },
          }),
        st('$ a_c = \\dfrac{v^2}{R} = \\omega^2 R $, directed **towards the centre**',
          'The second form comes from substituting $ v = r\\omega $ into the first, and is often the more convenient one.', {
            why: 'The direction argument is the part worth keeping. $ \\Delta\\mathbf{v} $ is perpendicular to $ \\Delta\\mathbf{r} $, and as $ \\Delta t \\to 0 $ it lines up along the bisector of the angle between the two radii — which points **inwards**. Hence "centripetal", from a Greek term meaning centre-seeking.\n\nAnd note that $ a_c $ has constant *magnitude* but is not a constant *vector*, because it keeps re-aiming at the centre.',
          }),
      ],
      now_you_try: {
        problem: 'An insect in a circular groove of radius $ 12 $ cm completes $ 7 $ revolutions in $ 100 $ s. Is its acceleration vector constant? Find its magnitude.',
        answer: 'Not a constant vector; magnitude $ 2.3 $ cm/s²',
        solution: 'From page 10, $ \\omega = 0.44 $ rad/s. So $ a = \\omega^2 R = (0.44)^2(12) = 2.3 $ cm/s². The **magnitude** is constant, but the acceleration always points at the centre and that direction changes continuously — so the acceleration is not a constant vector.',
      },
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'A note on scope — no forces on this page',
      markdown: 'You may already have met **centripetal force**, banked roads or vertical circles in a coaching class. None of them is here, and that is deliberate.\n\nThis chapter is **kinematics** — describing motion. Those topics are **dynamics**: they ask what *causes* the acceleration, which needs Newton\'s laws.\n\nSo this page says there **is** an acceleration of $ v^2/r $ towards the centre. What supplies it — friction, tension, gravity — is next chapter.\n\nMeanwhile: **centripetal acceleration is not a force**, and "centrifugal force" is not a force on the body in the ground frame at all.',
    }),
    b('inline_quiz', 3, {
      pass_threshold: 0.6,
      questions: [
        q('A car moves round a circular track at constant speed. Its acceleration is:',
          ['Zero, since the speed is not changing at all', 'Directed towards the centre, of magnitude $ v^2/r $', 'Directed along the velocity, of magnitude $ v^2/r $', 'Directed away from the centre, of magnitude $ v^2/r $'], 1,
          'Constant speed means no tangential acceleration, but the direction of the velocity is changing, so there is a radial acceleration of $ v^2/r $ pointing at the centre.', 1),
        q('In uniform circular motion, which of these is constant?',
          ['The velocity, in both size and direction', 'The acceleration, in both size and direction', 'The magnitude of the acceleration', 'The displacement from the starting point'], 2,
          'The speed and radius are fixed, so $ v^2/r $ has a fixed *magnitude*. But its direction always points at the centre, which keeps changing — so neither the acceleration vector nor the velocity is constant.', 2),
        q('If the speed of a body in uniform circular motion is doubled at the same radius, its centripetal acceleration:',
          ['Doubles, in direct proportion', 'Is multiplied by four', 'Halves, in inverse proportion', 'Is unchanged by the speed'], 1,
          '$ a_c = v^2/r $ goes as the square of the speed, so doubling $ v $ multiplies $ a_c $ by 4. This is why cornering fast is so much more demanding than cornering slowly.', 1),
        q('The centripetal acceleration of a body moving at angular speed $ \\omega $ on a circle of radius $ r $ is:',
          ['$ \\omega r $', '$ \\omega^2 r $', '$ \\omega r^2 $', '$ \\omega^2/r $'], 1,
          'Substituting $ v = \\omega r $ into $ v^2/r $ gives $ \\omega^2 r^2/r = \\omega^2 r $. The expression $ \\omega r $ is the linear *speed*, not an acceleration — a dimension check catches that instantly.', 1),
      ],
    }),
    b('image', 4, {
      src: '',
      alt: 'A circle with velocity vectors at two nearby points, and beside it the velocity triangle showing v, v-prime and delta-v, with delta-v pointing towards the centre.',
      aspect_ratio: '16:9',
      figure_key: 'ch3-centripetal-derivation',
      caption: 'The velocity triangle is the whole derivation. As the interval shrinks, $ \\Delta\\mathbf{v} $ swings round to point straight at the centre.',
    }),
    b('step_solver', 5, {
      title: 'How big can a centripetal acceleration get?',
      problem: 'An aircraft executes a horizontal loop of radius $ 1.00 $ km with a steady speed of $ 900 $ km/h. Compare its centripetal acceleration with the acceleration due to gravity. Take $ g = 9.8 $ m/s².',
      intro: 'The comparison with $ g $ is what makes the number mean something — pilots talk in "g"s for exactly this reason.',
      steps: [
        st('$ 900\\ \\text{km/h} = 900 \\times \\dfrac{5}{18} = 250\\ \\text{m/s} $',
          'Convert first, as always. And $ R = 1.00 $ km $ = 1000 $ m.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now $ a_c = v^2/R $. Give the answer in m/s².',
              blank_answer: '62.5',
              feedback_right: 'Yes — $ 62500/1000 = 62.5 $ m/s².',
              feedback_wrong: '$ a_c = v^2/R = 250^2/1000 = 62500/1000 = 62.5 $ m/s².',
            },
          }),
        st('$ a_c = 62.5\\ \\text{m/s}^2 $',
          'Now express it as a multiple of $ g $, which is how such numbers are actually quoted.', {
            check: {
              kind: 'mcq',
              prompt: '$ a_c/g $ is approximately:',
              options: ['$ 3.4 $', '$ 6.4 $', '$ 9.8 $', '$ 62.5 $'],
              answer_index: 1,
              feedback_right: 'Right — about 6.4 times gravity.',
              feedback_wrong: '$ 62.5/9.8 = 6.38 \\approx 6.4 $. So the acceleration is about six and a half times $ g $.',
            },
          }),
        st('$ \\dfrac{a_c}{g} = \\dfrac{62.5}{9.8} \\approx 6.4 $ — over six times gravity.',
          'Which is close to the limit of what a trained pilot in a g-suit can stay conscious through.', {
            why: 'The formula tells you why fast aircraft turn in huge arcs. $ a_c = v^2/R $, so at fixed tolerable $ a_c $ the required radius goes as $ v^2 $ — double the speed and you need **four times** the turning circle. A jet at 900 km/h simply cannot make a tight turn, no matter how good the aircraft is; the constraint is on the pilot\'s body, not the machine.',
          }),
      ],
      now_you_try: {
        problem: 'A stone tied to the end of a string $ 80 $ cm long is whirled in a horizontal circle at constant speed, making $ 14 $ revolutions in $ 25 $ s. What is the magnitude and direction of the acceleration of the stone?',
        answer: '$ 9.9 $ m/s², directed towards the centre',
        solution: 'From page 10, $ \\omega = 2\\pi(14)/25 = 3.52 $ rad/s. So $ a = \\omega^2 R = (3.52)^2(0.80) = 12.39(0.80) = 9.9 $ m/s², directed along the string towards the centre of the circle. Note this is almost exactly $ g $ — a whirled stone is under about the same acceleration as a falling one.',
      },
    }),
    b('step_solver', 6, {
      title: 'Working backwards to a speed limit',
      problem: 'A car of mass $ 1200 $ kg goes round a flat curve of radius $ 50 $ m. The largest centripetal acceleration the tyres can sustain on this road is $ 4.0 $ m/s². What is the fastest the car can take the curve?',
      intro: 'Note the question is phrased entirely in terms of acceleration — no forces needed, which is exactly the boundary this chapter keeps.',
      steps: [
        st('$ a_c = \\dfrac{v^2}{r} \\quad \\Rightarrow \\quad v = \\sqrt{a_c r} $',
          'Rearranged for the speed. The mass has not been used — and will not be.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does the $ 1200 $ kg not appear anywhere?',
              options: [
                'Because kinematics never involves mass — it describes motion, not its causes',
                'Because the car is heavy enough to ignore it',
                'Because the road is flat',
                'Because the acceleration is small',
              ],
              answer_index: 0,
              feedback_right: 'Right — the mass is given to see whether you reach for it unnecessarily.',
              feedback_wrong: 'Mass belongs to dynamics, not kinematics. $ a_c = v^2/r $ contains no mass, so the 1200 kg is irrelevant to this question. It would matter for the *force* required, which is next chapter.',
            },
          }),
        st('$ v = \\sqrt{(4.0)(50)} = \\sqrt{200} = 14.1\\ \\text{m/s} $',
          'About 51 km/h — which is roughly why urban roundabouts are signed at the speeds they are.', {
            check: {
              kind: 'fill_blank',
              prompt: 'On a curve of radius $ 200 $ m with the same tyre limit, what is the maximum speed in m/s?',
              blank_answer: '28.3',
              feedback_right: 'Yes — $ \\sqrt{800} = 28.3 $ m/s.',
              feedback_wrong: '$ v = \\sqrt{(4.0)(200)} = \\sqrt{800} = 28.3 $ m/s. Four times the radius allows **twice** the speed, not four times — the square root matters.',
            },
          }),
        st('$ v_{\\max} = 14.1\\ \\text{m/s} \\approx 51\\ \\text{km/h} $',
          'And four times the radius would allow only twice the speed.', {
            why: 'That square-root relationship is worth carrying: $ v_{\\max} \\propto \\sqrt{r} $ at a fixed acceleration limit. It is why motorway curves are enormous and hairpins are slow, and why a bend that feels fine at 50 km/h is genuinely dangerous at 70 — the required acceleration has gone up by a factor of $ (70/50)^2 = 1.96 $, nearly double.',
          }),
      ],
      now_you_try: {
        problem: 'A cyclist can sustain a centripetal acceleration of $ 2.5 $ m/s² before skidding. What is the tightest circle she can ride at $ 5 $ m/s?',
        answer: '$ r = 10 $ m',
        solution: '$ r = v^2/a_c = 25/2.5 = 10 $ m. At twice the speed the minimum radius would be 40 m — four times as large, since $ r \\propto v^2 $.',
      },
    }),
    b('step_solver', 7, {
      title: 'Why a satellite stays up',
      problem: 'A satellite circles the Earth at a radius of $ 7.0 \\times 10^6 $ m with a period of $ 5.8 \\times 10^3 $ s. Find its centripetal acceleration, and compare it with $ g = 9.8 $ m/s² at the Earth\'s surface.',
      intro: 'The comparison at the end is the interesting part, and it settles a question most people get wrong about satellites.',
      steps: [
        st('$ \\omega = \\dfrac{2\\pi}{T} = \\dfrac{2\\pi}{5.8 \\times 10^3} = 1.08 \\times 10^{-3}\\ \\text{rad/s} $',
          'The period is given directly, so the angular speed is one division away.', {
            check: {
              kind: 'mcq',
              prompt: 'Which form of the centripetal acceleration is easier to use here?',
              options: [
                '$ a_c = \\omega^2 r $, since we have $ \\omega $ and $ r $',
                '$ a_c = v^2/r $, since we have $ v $',
                'Neither — the mass of the satellite is needed',
                'Neither — the mass of the Earth is needed',
              ],
              answer_index: 0,
              feedback_right: 'Right — use whichever form matches the data you already have.',
              feedback_wrong: 'We have $ \\omega $ and $ r $, so $ a_c = \\omega^2 r $ is immediate. Using $ v^2/r $ would mean computing $ v = r\\omega $ first — the same answer, one step longer. Neither mass is needed for a kinematics question.',
            },
          }),
        st('$ a_c = \\omega^2 r = (1.08 \\times 10^{-3})^2 (7.0 \\times 10^6) = 8.2\\ \\text{m/s}^2 $',
          'Squaring a small number and multiplying by a large one — worth doing carefully in powers of ten.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Express this as a fraction of $ g = 9.8 $ m/s², to two decimal places.',
              blank_answer: '0.84',
              feedback_right: 'Yes — about 0.84g, most of the way to full surface gravity.',
              feedback_wrong: '$ 8.2/9.8 = 0.837 \\approx 0.84 $. The satellite is accelerating at 84% of surface gravity.',
            },
          }),
        st('$ a_c \\approx 8.2\\ \\text{m/s}^2 $, which is about $ 0.84g $ — nearly full surface gravity.',
          'A satellite in low orbit is not in a place where gravity is weak. It is accelerating almost as hard as a dropped stone.', {
            why: 'This kills the commonest misconception about orbits. Astronauts float **not** because gravity is absent up there — it is 84% of its surface value — but because they and their spacecraft are accelerating at exactly the same rate, so nothing presses them against anything. It is Chapter 2 page 13\'s zero-relative-acceleration result, in orbit.\n\nA satellite is simply an object falling continuously and missing the Earth, because it is also moving sideways fast enough. Which is page 1 again: two independent motions.',
          }),
      ],
      now_you_try: {
        problem: 'A geostationary satellite orbits at a radius of $ 4.2 \\times 10^7 $ m with a period of exactly one day. Find its centripetal acceleration.',
        answer: '$ 0.22 $ m/s²',
        solution: '$ T = 86400 $ s, so $ \\omega = 2\\pi/86400 = 7.27 \\times 10^{-5} $ rad/s. Then $ a_c = \\omega^2 r = (7.27 \\times 10^{-5})^2(4.2 \\times 10^7) = 0.22 $ m/s² — only about $ 0.02g $. Six times further out than a low orbit, and the acceleration has dropped by a factor of nearly forty.',
      },
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'logical',
      prompt: 'Read each of these and decide whether it is true or false, with a reason. (a) The net acceleration of a particle in circular motion is always along the radius of the circle towards the centre. (b) The velocity vector of a particle at a point is always along the tangent to the path of the particle at that point. (c) The acceleration vector of a particle in uniform circular motion averaged over one cycle is a null vector.',
      reveal: '**(a) False.** It is true only for *uniform* circular motion. If the speed is also changing there is a **tangential** component as well, and the net acceleration then points somewhere between the tangent and the radius. That is exactly what page 12 is about.\n\n**(b) True**, and for any path at all, not just circles. Shrinking the displacement swings the chord onto the tangent — page 2.\n\n**(c) True.** Over one complete cycle the acceleration vector sweeps through every direction in the plane, and diametrically opposite points contribute equal and opposite vectors that cancel in pairs. So the *average* is zero even though the acceleration is never zero at any instant.\n\nStatement (c) is worth sitting with, because it is the same trap as the average velocity over a full revolution being zero. **An average of zero does not mean the quantity was ever zero.**',
      difficulty_level: 3,
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('At a fixed centripetal-acceleration limit, the maximum cornering speed varies with the radius as:',
          ['$ v \\propto r $', '$ v \\propto \\sqrt{r} $', '$ v \\propto r^2 $', '$ v $ is independent of $ r $'], 1,
          'From $ a_c = v^2/r $ at fixed $ a_c $, $ v = \\sqrt{a_c r} \\propto \\sqrt{r} $. Four times the radius permits only twice the speed.', 2),
        q('The acceleration of a particle in uniform circular motion, averaged over one complete revolution, is:',
          ['$ v^2/r $ towards the centre', 'Zero', '$ v^2/r $ away from the centre', 'Not defined'], 1,
          'The acceleration vector points in every direction in turn over one cycle, and opposite points cancel in pairs, so the vector average is zero. Its magnitude is never zero at any instant.', 3),
        q('A satellite orbits at radius $ r $ with period $ T $. Its centripetal acceleration is:',
          ['$ 4\\pi^2 r/T^2 $', '$ 2\\pi r/T $', '$ 4\\pi^2 r^2/T^2 $', '$ 2\\pi r/T^2 $'], 0,
          '$ \\omega = 2\\pi/T $, so $ a_c = \\omega^2 r = 4\\pi^2 r/T^2 $. The $ 2\\pi r/T $ expression is the orbital *speed*, not an acceleration.', 2),
        q('"Centripetal" means:',
          ['Centre-fleeing', 'Centre-seeking', 'Tangential', 'Constant in direction'], 1,
          'It comes from a Greek term meaning centre-seeking, which describes the direction of the acceleration. "Centrifugal" is the centre-fleeing word, and it does not name a force acting on the body in the ground frame.', 1),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ a_c = \\dfrac{v^2}{r} = \\omega^2 r $, directed **towards the centre**.\n- **Constant speed does not mean zero acceleration.** The velocity changes because its direction does.\n- $ a_c $ has constant *magnitude* in uniform circular motion but is **not a constant vector** — it keeps re-aiming.\n- $ a_c \\propto v^2 $: double the speed and the acceleration quadruples. At a fixed limit, $ v_{\\max} \\propto \\sqrt{r} $.\n- Averaged over a whole revolution the acceleration is **zero**, though it is never zero at any instant.\n- **No forces on this page.** Centripetal force, banked roads and vertical circles are Laws of Motion.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Eight questions. If a question hands you a mass, check whether you actually need it before using it.',
      sections: [
        {
          id: 'p11-ysi',
          title: 'Centripetal acceleration',
          items: [
            num('p11-y1', 'A car goes round a circular track of radius $ 100 $ m at $ 20 $ m/s. Find its centripetal acceleration.',
              '$ 4 $ m/s²',
              '$ a_c = v^2/r = 400/100 = 4 $ m/s², directed towards the centre of the track.'),
            mcq('p11-y2', 'A body in uniform circular motion has zero:',
              ['Acceleration', 'Tangential acceleration', 'Velocity', 'Radial acceleration'], 1,
              'Uniform means the speed is constant, so there is no tangential acceleration. The radial acceleration is $ v^2/r $ and is definitely not zero.'),
            num('p11-y3', 'A particle moves on a circle of radius $ 0.5 $ m at $ 4 $ rev/s. Find its centripetal acceleration.',
              '$ 316 $ m/s²',
              '$ \\omega = 2\\pi(4) = 25.1 $ rad/s, so $ a_c = \\omega^2 r = 631(0.5) = 316 $ m/s² — about 32 times $ g $. Small radii at high rotation rates give enormous accelerations, which is why centrifuges work.'),
            mcq('p11-y4', 'Two particles move on circles of radii $ r $ and $ 2r $ with the same angular speed. The ratio of their centripetal accelerations is:',
              ['$ 1 : 1 $', '$ 1 : 2 $', '$ 1 : 4 $', '$ 2 : 1 $'], 1,
              'At the same $ \\omega $, $ a_c = \\omega^2 r \\propto r $, so the ratio is $ 1 : 2 $. (If instead their *speeds* were equal, $ a_c = v^2/r \\propto 1/r $ and the ratio would be $ 2 : 1 $ — so it matters which quantity is shared.)'),
            num('p11-y5', 'The moon orbits the Earth at a radius of $ 3.84 \\times 10^8 $ m with a period of $ 27.3 $ days. Find its centripetal acceleration.',
              '$ 2.72 \\times 10^{-3} $ m/s²',
              '$ T = 27.3 \\times 86400 = 2.36 \\times 10^6 $ s, so $ \\omega = 2\\pi/T = 2.66 \\times 10^{-6} $ rad/s. Then $ a_c = \\omega^2 r = (2.66 \\times 10^{-6})^2(3.84 \\times 10^8) = 2.72 \\times 10^{-3} $ m/s².'),
            mcq('p11-y6', 'A body moves in a circle at constant speed. Which statement is correct?',
              ['Its velocity is constant and its acceleration is therefore zero', 'Its speed is constant but its velocity and acceleration both change', 'Both its speed and its velocity stay constant throughout', 'Its acceleration is along the direction of motion at all times'], 1,
              'The speed is fixed, but the velocity changes direction continuously, and the acceleration — always pointing at the centre — changes direction too. The acceleration is perpendicular to the motion, never along it.'),
            num('p11-y7', 'A wheel of radius $ 0.4 $ m rotates so that a point on its rim has a centripetal acceleration of $ 10 $ m/s². Find the rim speed and the angular speed.',
              '$ v = 2 $ m/s, $ \\omega = 5 $ rad/s',
              '$ v = \\sqrt{a_c r} = \\sqrt{10(0.4)} = \\sqrt{4} = 2 $ m/s. Then $ \\omega = v/r = 2/0.4 = 5 $ rad/s.'),
            num('p11-y8', 'A train of mass $ 4 \\times 10^5 $ kg rounds a curve of radius $ 400 $ m at $ 20 $ m/s. Find its centripetal acceleration.',
              '$ 1 $ m/s²',
              '$ a_c = v^2/r = 400/400 = 1 $ m/s². The mass is irrelevant — it would only matter for the *force*, which belongs to the next chapter.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'Everything so far assumed the speed was steady. Switch a fan on from rest and it is going round **and** getting faster — two different accelerations at the same time, which is the next page.',
    }),
  ],
};

// ── p12 · When the Circle Speeds Up (competitive tier) ───────────────────────
const p12 = {
  page_number: 12,
  slug: 'when-the-circle-speeds-up',
  title: 'When the Circle Speeds Up',
  subtitle: 'Two accelerations at once, at right angles to each other',
  glossary: [
    { term: 'tangential acceleration', definition: 'The component of acceleration along the direction of motion, a_t = dv/dt = rα. It changes the speed.' },
    { term: 'angular acceleration', definition: 'The rate of change of angular velocity, α = dω/dt, measured in rad/s².' },
  ],
  blocks: [
    hero('when-the-circle-speeds-up'),
    b('callout', 0, {
      variant: 'note',
      title: 'A note on scope',
      markdown: 'NCERT treats only **uniform** circular motion, so tangential and angular acceleration do not appear there at all. This page restores them, because non-uniform circular motion is standard in JEE and NEET — and because a fan being switched on is a more honest example than a fan already at full speed.\n\nIf you are preparing for boards only, the first half of this page is worth reading for understanding and the angular equations at the end can be treated as enrichment.\n\nNothing here is new physics. It is page 11 plus Chapter 2\'s three equations, in angular clothing.',
    }),
    b('curiosity_prompt', 1, {
      prompt: 'You switch on a ceiling fan. In the first few seconds a point on the blade tip is both going round in a circle and getting faster. In which direction is it accelerating?',
      hint: 'There is no reason for it to be one single simple direction.',
      reveal: '**Neither straight at the centre, nor along the motion — somewhere in between.**\n\nTwo separate things are happening, and each needs its own acceleration:\n\n- The **direction** of the velocity is changing, which needs a *radial* acceleration $ a_r = v^2/r $ pointing at the centre. That never goes away — the direction is always changing on a circle.\n- The **speed** is changing, which needs a *tangential* acceleration $ a_t = dv/dt $ along the direction of motion.\n\nThose two are at right angles, so the total is their vector sum: $ \\sqrt{a_t^2 + a_r^2} $, at some angle between them.\n\nOnce the fan is up to speed, $ a_t $ drops to zero and only the radial part is left — which is page 11.',
    }),
    b('text', 2, {
      markdown: 'The two components, side by side:\n\n$ a_t = \\dfrac{dv}{dt} = r\\alpha \\qquad\\text{(changes the speed)} $\n\n$ a_r = \\dfrac{v^2}{r} = r\\omega^2 \\qquad\\text{(changes the direction)} $\n\nwhere $ \\alpha = \\dfrac{d\\omega}{dt} $ is the **angular acceleration**. They are perpendicular, so\n\n$ a = \\sqrt{a_t^2 + a_r^2} \\qquad \\tan\\phi = \\dfrac{a_r}{a_t} $',
    }),
    b('callout', 3, {
      variant: 'note',
      title: 'One of them can be zero. The other cannot.',
      markdown: '$ a_t = 0 $ whenever the speed is steady — that is uniform circular motion, and it is common.\n\n$ a_r = 0 $ is **impossible** on a circle. The direction of the velocity is changing at every instant of a circular path, so there is always a radial component. It is zero only if the motion is not circular at all.\n\nSo a body on a circular path can never have zero acceleration, however steadily it moves. That was page 11\'s point, and it survives the generalisation.',
    }),
    b('step_solver', 4, {
      title: 'Both accelerations at once',
      problem: 'The speed of a particle moving in a circle of radius $ r = 2 $ m varies with time as $ v = t^2 $, with $ t $ in seconds and $ v $ in m/s. Find the radial, tangential and net acceleration at $ t = 2 $ s.',
      intro: 'Two components computed separately, then combined by Pythagoras. Do them in either order.',
      steps: [
        st('At $ t = 2 $ s: $ \\quad v = (2)^2 = 4\\ \\text{m/s} $',
          'The speed at the instant in question — needed for the radial component.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find the radial acceleration, $ a_r = v^2/r $, in m/s².',
              blank_answer: '8',
              feedback_right: 'Yes — $ 16/2 = 8 $ m/s².',
              feedback_wrong: '$ a_r = v^2/r = 4^2/2 = 16/2 = 8 $ m/s², pointing towards the centre.',
            },
          }),
        st('$ a_t = \\dfrac{dv}{dt} = \\dfrac{d(t^2)}{dt} = 2t $, so at $ t = 2 $ s, $ \\quad a_t = 4\\ \\text{m/s}^2 $',
          'The tangential component is the *derivative* of the speed, not the speed divided by the time.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is $ a_t = dv/dt $ rather than $ v/t $?',
              options: [
                'Because $ a_t $ is the instantaneous rate of change of speed, and $ v/t $ is an average',
                'Because $ v $ depends on $ t^2 $',
                'Because the motion is circular',
                'Because $ v/t $ has the wrong units',
              ],
              answer_index: 0,
              feedback_right: 'Right — the same distinction Chapter 2 page 3 made between average and instantaneous.',
              feedback_wrong: 'Tangential acceleration is the *instantaneous* rate of change of speed, $ dv/dt $. Here $ v/t = 4/2 = 2 $ m/s², which is the average rate since $ t = 0 $ — a different quantity, and not what is asked for.',
            },
          }),
        st('$ a = \\sqrt{a_r^2 + a_t^2} = \\sqrt{8^2 + 4^2} = \\sqrt{64 + 16} = \\sqrt{80} = 8.94\\ \\text{m/s}^2 $',
          'Perpendicular components combine by Pythagoras, exactly as velocity components do.', {
            check: {
              kind: 'mcq',
              prompt: 'And the angle of the net acceleration from the tangential direction, from $ \\tan\\phi = a_r/a_t = 2 $:',
              options: ['$ 27° $', '$ 45° $', '$ 63° $', '$ 90° $'],
              answer_index: 2,
              feedback_right: 'Right — $ \\tan^{-1}(2) \\approx 63° $, so it leans strongly inwards.',
              feedback_wrong: '$ \\tan^{-1}(2) = 63.4° $ from the tangential direction. Since $ a_r > a_t $ here, the net acceleration is closer to the radius than to the tangent.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A particle moves in a circle of radius $ 1.0 $ cm with speed $ v = 2t $, where $ v $ is in cm/s and $ t $ in seconds. Find (a) the radial acceleration, (b) the tangential acceleration and (c) the magnitude of the net acceleration at $ t = 1 $ s.',
        answer: '(a) $ 4 $ cm/s²  (b) $ 2 $ cm/s²  (c) $ 4.47 $ cm/s²',
        solution: 'At $ t = 1 $ s, $ v = 2 $ cm/s. (a) $ a_r = v^2/r = 4/1 = 4 $ cm/s². (b) $ a_t = dv/dt = 2 $ cm/s², constant here. (c) $ a = \\sqrt{16 + 4} = \\sqrt{20} = 4.47 $ cm/s².',
      },
    }),
    b('step_solver', 5, {
      title: 'From a speed change to an angular acceleration',
      problem: 'A particle moves in a circle of radius $ 0.5 $ m at a speed that increases uniformly. Find its angular acceleration if its speed changes from $ 2.0 $ m/s to $ 4.0 $ m/s in $ 4.0 $ s.',
      intro: 'Two steps: get the tangential acceleration from the speeds, then convert to angular using the radius.',
      steps: [
        st('$ a_t = \\dfrac{dv}{dt} = \\dfrac{4.0 - 2.0}{4.0} = 0.5\\ \\text{m/s}^2 $',
          'The speed increases *uniformly*, so the average rate is also the instantaneous rate — which is what makes this step legitimate.', {
            check: {
              kind: 'mcq',
              prompt: 'Which relation connects $ a_t $ to the angular acceleration $ \\alpha $?',
              options: ['$ a_t = r\\alpha $', '$ a_t = \\alpha/r $', '$ a_t = r^2\\alpha $', '$ a_t = r\\alpha^2 $'],
              answer_index: 0,
              feedback_right: 'Right — differentiate $ v = r\\omega $ once with $ r $ constant.',
              feedback_wrong: 'Differentiating $ v = r\\omega $ with $ r $ fixed gives $ dv/dt = r\\,d\\omega/dt $, i.e. $ a_t = r\\alpha $. It is the exact angular analogue of $ v = r\\omega $.',
            },
          }),
        st('$ \\alpha = \\dfrac{a_t}{r} = \\dfrac{0.5}{0.5} = 1\\ \\text{rad/s}^2 $',
          'One radian per second per second.', {
            why: 'Notice the pattern building up. $ s = r\\theta $, then $ v = r\\omega $, then $ a_t = r\\alpha $ — each one is the previous relation differentiated once. The linear world and the angular world run in parallel, with the radius as the exchange rate between them.',
          }),
        st('$ \\alpha = 1\\ \\text{rad/s}^2 $. Meanwhile $ a_r $ has grown from $ 8 $ to $ 32 $ m/s².',
          'Check: $ a_r = v^2/r $, so at 2.0 m/s it is $ 4/0.5 = 8 $ m/s², and at 4.0 m/s it is $ 16/0.5 = 32 $ m/s².', {
            check: {
              kind: 'mcq',
              prompt: 'So over those 4 s, how did the two components compare?',
              options: [
                '$ a_t $ stayed at $ 0.5 $ m/s² while $ a_r $ grew from $ 8 $ to $ 32 $ m/s²',
                'Both grew by the same factor',
                '$ a_t $ grew while $ a_r $ stayed constant',
                'Both stayed constant',
              ],
              answer_index: 0,
              feedback_right: 'Right — and so the net acceleration turned steadily towards the centre.',
              feedback_wrong: '$ a_t = r\\alpha $ is constant when $ \\alpha $ is constant. But $ a_r = v^2/r $ grows with the *square* of the speed, so it quadrupled as the speed doubled. The net acceleration therefore swings inwards as the motion speeds up.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A wheel of radius $ 0.2 $ m speeds up uniformly from rest to $ 6 $ m/s rim speed in $ 3 $ s. Find its angular acceleration and its tangential acceleration.',
        answer: '$ \\alpha = 10 $ rad/s², $ a_t = 2 $ m/s²',
        solution: '$ a_t = (6 - 0)/3 = 2 $ m/s². Then $ \\alpha = a_t/r = 2/0.2 = 10 $ rad/s². At $ t = 3 $ s the radial acceleration is $ 36/0.2 = 180 $ m/s², ninety times the tangential one — by then the motion is nearly uniform in character.',
      },
    }),
    b('classify_exercise', 6, {
      question: 'For each of these motions, is the circular motion **uniform**?',
      column_label: 'Motion',
      verdict_label: 'Uniform?',
      yes_label: '✓ Uniform',
      no_label: '✗ Not uniform',
      rows: [
        { substance: 'A fan blade, ten minutes after being switched on at a fixed setting', is_solution: true, explanation: 'Uniform. It has reached a steady speed, so $ a_t = 0 $ and only the radial acceleration remains.' },
        { substance: 'A fan blade in the first two seconds after switch-on', is_solution: false, explanation: 'Not uniform. The speed is still rising, so there is a tangential acceleration as well as a radial one.' },
        { substance: 'A stone whirled on a string at a constant rate', is_solution: true, explanation: 'Uniform. Constant speed on a circle — the textbook case.' },
        { substance: 'A car speeding up as it comes out of a roundabout', is_solution: false, explanation: 'Not uniform. Both the speed and the direction are changing, so both components are present.' },
        { substance: 'A ball on a string swinging as a pendulum, at the lowest point', is_solution: false, explanation: 'Not uniform. A pendulum is fastest at the bottom and slowest at the ends, so its speed is changing throughout — even though at the exact lowest point $ a_t $ happens to be momentarily zero.' },
        { substance: 'A point on the second hand of a clock', is_solution: true, explanation: 'Uniform — for a sweeping hand. A ticking hand that jumps once per second is not, since it accelerates and stops every second.' },
      ],
    }),
    b('heading', 7, {
      text: 'The three types, read off one angle',
      level: 2,
      objective: 'Classify a circular motion from the angle between v and a.',
    }),
    b('text', 8, {
      markdown: 'The angle between $ \\mathbf{v} $ and $ \\mathbf{a} $ classifies the motion completely — which is page 2\'s rule, specialised to a circle:\n\n| Type | $ a_t $ | Angle between $ \\mathbf{v} $ and $ \\mathbf{a} $ |\n|---|---|---|\n| **Uniform** | zero | exactly $ 90° $ |\n| **Accelerated** | along $ \\mathbf{v} $ | acute |\n| **Retarded** | against $ \\mathbf{v} $ | obtuse |\n\nSo one glance at that angle tells you whether the thing is speeding up, slowing down, or holding steady.',
    }),
    b('step_solver', 9, {
      title: 'Reading the motion from the angle',
      problem: 'A particle rotates in a circular path of radius $ 54 $ m with a speed varying as $ v = 4t^2 $, where $ v $ is in m/s and $ t $ in seconds. Find the angle between the velocity and the acceleration at $ t = 3 $ s.',
      intro: 'Both components, then the angle between the total acceleration and the tangential direction — which is the direction of the velocity.',
      steps: [
        st('At $ t = 3 $ s: $ \\quad v = 4(9) = 36\\ \\text{m/s} $',
          'Then the radial component follows from the speed and the radius.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find $ a_r = v^2/r $ with $ r = 54 $ m. Give the answer in m/s².',
              blank_answer: '24',
              feedback_right: 'Yes — $ 1296/54 = 24 $ m/s².',
              feedback_wrong: '$ a_r = 36^2/54 = 1296/54 = 24 $ m/s².',
            },
          }),
        st('$ a_t = \\dfrac{dv}{dt} = 8t $, so at $ t = 3 $ s, $ \\quad a_t = 24\\ \\text{m/s}^2 $',
          'The two components have come out equal, which makes the angle immediate.', {
            check: {
              kind: 'mcq',
              prompt: 'The velocity points along the tangent. So what is the angle between $ \\mathbf{v} $ and $ \\mathbf{a} $?',
              options: ['$ 30° $', '$ 45° $', '$ 60° $', '$ 90° $'],
              answer_index: 1,
              feedback_right: 'Right — equal perpendicular components always give $ 45° $.',
              feedback_wrong: 'The acceleration makes an angle $ \\tan^{-1}(a_r/a_t) = \\tan^{-1}(1) = 45° $ with the tangential direction, and the velocity *is* the tangential direction. So the angle between them is $ 45° $.',
            },
          }),
        st('The angle is $ 45° $ — acute, so this is **accelerated** circular motion.',
          'Which is exactly what $ v = 4t^2 $ says: the speed is increasing.', {
            why: 'The classification is free once you have the two components. Acute means speeding up, obtuse means slowing down, $ 90° $ means uniform. And note that here the angle is *not fixed* — at $ t = 1 $ s, $ a_t = 8 $ and $ a_r = 16/54 = 0.30 $, giving an angle of only $ 2° $. As the particle speeds up, $ a_r $ grows as $ v^2 $ and overtakes $ a_t $, swinging the acceleration round towards the centre.',
          }),
      ],
      now_you_try: {
        problem: 'A particle starts from rest on a circular path with a constant angular acceleration of $ 4 $ rad/s². At what time are the magnitudes of its centripetal and tangential accelerations equal?',
        answer: '$ t = 0.5 $ s',
        solution: '$ a_t = r\\alpha = 4r $, constant. And $ \\omega = \\alpha t = 4t $, so $ a_r = r\\omega^2 = 16rt^2 $. Setting them equal: $ 4r = 16rt^2 $, so $ t^2 = 1/4 $ and $ t = 0.5 $ s. The radius cancels, so the answer holds for any circle — before 0.5 s the tangential part dominates, after it the radial part does.',
      },
    }),
    b('callout', 10, {
      variant: 'note',
      title: 'The angular equations of motion',
      markdown: 'When $ \\alpha $ is **constant**, the angular quantities obey three equations of exactly the same shape as Chapter 2\'s:\n\n$ \\omega = \\omega_0 + \\alpha t \\qquad \\theta = \\omega_0 t + \\tfrac{1}{2}\\alpha t^2 \\qquad \\omega^2 = \\omega_0^2 + 2\\alpha\\theta $\n\nThe correspondence is exact: $ s \\to \\theta $, $ v \\to \\omega $, $ a \\to \\alpha $. Everything you learned about choosing between the three equations transfers unchanged.\n\n**And so does the restriction.** These hold only for constant $ \\alpha $, exactly as the linear three held only for constant $ a $. If $ \\alpha $ varies, go back to $ \\omega = d\\theta/dt $ and $ \\alpha = d\\omega/dt $ and use calculus — the Chapter 2 page 14 method, in angular form.',
    }),
    b('step_solver', 11, {
      title: 'Using the angular equations',
      problem: 'A wheel starts from rest and reaches an angular speed of $ 30 $ rad/s in $ 6 $ s with constant angular acceleration. Find (a) its angular acceleration, (b) the angle it turns through, and (c) the number of revolutions it completes.',
      intro: 'Three questions, three equations — and it is the same selection method as Chapter 2 page 10, with $ \\theta $, $ \\omega $ and $ \\alpha $ in place of $ s $, $ v $ and $ a $.',
      steps: [
        st('(a) $ \\omega = \\omega_0 + \\alpha t \\quad \\Rightarrow \\quad 30 = 0 + \\alpha(6) \\quad \\Rightarrow \\quad \\alpha = 5\\ \\text{rad/s}^2 $',
          '"Starts from rest" means $ \\omega_0 = 0 $, exactly as "starts from rest" meant $ u = 0 $ in Chapter 2.', {
            check: {
              kind: 'mcq',
              prompt: '(b) For the angle turned through, which equation should we reach for?',
              options: [
                '$ \\theta = \\omega_0 t + \\frac{1}{2}\\alpha t^2 $, since we have $ \\omega_0 $, $ \\alpha $ and $ t $',
                '$ \\omega = \\omega_0 + \\alpha t $, which we have already used',
                '$ \\theta = \\omega t $, using the final angular speed',
                '$ \\theta = 2\\pi/T $',
              ],
              answer_index: 0,
              feedback_right: 'Right — the second equation, with all three inputs known.',
              feedback_wrong: 'We know $ \\omega_0 $, $ \\alpha $ and $ t $ and want $ \\theta $, so use $ \\theta = \\omega_0 t + \\frac{1}{2}\\alpha t^2 $. Writing $ \\theta = \\omega t $ would use the *final* angular speed as if it applied for the whole interval, which overestimates by a factor of two here.',
            },
          }),
        st('(b) $ \\theta = 0 + \\tfrac{1}{2}(5)(6)^2 = \\tfrac{1}{2}(5)(36) = 90\\ \\text{rad} $',
          'Ninety radians. That is a number in a unit nobody has intuition for, which is why part (c) exists.', {
            check: {
              kind: 'fill_blank',
              prompt: '(c) Convert $ 90 $ rad to revolutions, using $ 2\\pi $ rad per revolution. Give the answer to one decimal place.',
              blank_answer: '14.3',
              feedback_right: 'Yes — $ 90/6.283 = 14.3 $ revolutions.',
              feedback_wrong: '$ 90/(2\\pi) = 90/6.283 = 14.3 $ revolutions. Radians are the unit the equations need; revolutions are the unit a person can picture.',
            },
          }),
        st('$ \\alpha = 5 $ rad/s², $ \\theta = 90 $ rad, about $ 14.3 $ revolutions.',
          'Cross-check with the average angular velocity: $ \\bar{\\omega} = (0 + 30)/2 = 15 $ rad/s, and $ 15 \\times 6 = 90 $ rad ✓.', {
            why: 'That cross-check is the angular version of the one Chapter 2 used constantly, and it works for the same reason: with **constant** $ \\alpha $, the average angular velocity is the mean of the two end values. If $ \\alpha $ were not constant, neither the three equations nor the shortcut would apply — and you would be back to $ \\omega = d\\theta/dt $ with calculus.',
          }),
      ],
      now_you_try: {
        problem: 'A flywheel rotating at $ 40 $ rad/s is brought to rest in $ 8 $ s at constant angular retardation. Find the retardation and the number of revolutions it makes before stopping.',
        answer: '$ 5 $ rad/s²; about $ 25.5 $ revolutions',
        solution: '$ 0 = 40 + \\alpha(8) $, so $ \\alpha = -5 $ rad/s², a retardation of 5 rad/s². The angle is $ \\theta = 40(8) - \\frac{1}{2}(5)(64) = 320 - 160 = 160 $ rad, which is $ 160/(2\\pi) = 25.5 $ revolutions. Check: $ \\bar{\\omega} = 20 $ rad/s and $ 20 \\times 8 = 160 $ rad ✓.',
      },
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('In non-uniform circular motion, the component of acceleration that changes the **speed** is:',
          ['The radial component', 'The tangential component', 'Both components equally', 'Neither component'], 1,
          'The tangential component $ a_t = dv/dt $ lies along the velocity, so it changes the speed. The radial component is perpendicular and can only change the direction.', 1),
        q('For a particle in circular motion, which component can never be zero?',
          ['The tangential acceleration', 'The radial acceleration', 'Both can be zero', 'Neither can be zero'], 1,
          'The direction of the velocity changes at every instant of a circular path, so $ a_r = v^2/r $ is always non-zero. $ a_t $ is zero whenever the speed is steady, which is the uniform case.', 2),
        q('The angle between velocity and acceleration in **retarded** circular motion is:',
          ['Acute', 'Exactly $ 90° $', 'Obtuse', 'Exactly $ 180° $'], 2,
          'Slowing down means $ a_t $ opposes $ \\mathbf{v} $, so the acceleration leans backwards and the angle exceeds $ 90° $. It cannot reach $ 180° $, because the radial component is always there.', 2),
        q('A wheel starting from rest reaches $ 20 $ rad/s in $ 4 $ s at constant angular acceleration. Its $ \\alpha $ is:',
          ['$ 5 $ rad/s²', '$ 80 $ rad/s²', '$ 0.2 $ rad/s²', '$ 2.5 $ rad/s²'], 0,
          '$ \\omega = \\omega_0 + \\alpha t $ gives $ 20 = 0 + \\alpha(4) $, so $ \\alpha = 5 $ rad/s².', 1),
        q('For a particle in circular motion with constant angular acceleration, the radial acceleration:',
          ['Stays constant throughout the motion', 'Grows as the square of the time', 'Grows linearly with the time elapsed', 'Decreases steadily with time'], 1,
          '$ \\omega = \\alpha t $, so $ a_r = r\\omega^2 = r\\alpha^2 t^2 $ — quadratic in $ t $. Meanwhile $ a_t = r\\alpha $ stays fixed, so the net acceleration swings steadily towards the centre.', 3),
      ],
    }),
    b('callout', 12, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ a_t = \\dfrac{dv}{dt} = r\\alpha $ **changes the speed**; $ a_r = \\dfrac{v^2}{r} = r\\omega^2 $ **changes the direction.**\n- They are perpendicular: $ a = \\sqrt{a_t^2 + a_r^2} $, at $ \\tan\\phi = a_r/a_t $ from the tangent.\n- $ a_t $ can be zero (uniform motion). **$ a_r $ never can**, on a circle.\n- The angle between $ \\mathbf{v} $ and $ \\mathbf{a} $: **$ 90° $ uniform · acute accelerating · obtuse retarding.**\n- $ s = r\\theta $, $ v = r\\omega $, $ a_t = r\\alpha $ — each one the previous relation differentiated once.\n- Angular equations $ \\omega = \\omega_0 + \\alpha t $ etc. hold **only for constant $ \\alpha $**, exactly like Chapter 2\'s three.',
    }),
    b('practice_bank', 13, {
      title: 'You solve it',
      intro: 'Eight questions. For each, work out both components before answering anything about the total.',
      sections: [
        {
          id: 'p12-ysi',
          title: 'Non-uniform circular motion',
          items: [
            num('p12-y1', 'A particle moves on a circle of radius $ 4 $ m with $ v = 3t $ m/s. Find its radial and tangential acceleration at $ t = 2 $ s.',
              '$ a_r = 9 $ m/s², $ a_t = 3 $ m/s²',
              'At $ t = 2 $ s, $ v = 6 $ m/s. So $ a_r = 36/4 = 9 $ m/s² and $ a_t = dv/dt = 3 $ m/s², constant.'),
            mcq('p12-y2', 'In uniform circular motion, the angle between the velocity and the acceleration is:',
              ['$ 0° $, along the direction of motion', 'Acute, but never zero', 'Exactly $ 90° $', 'Obtuse, but never $ 180° $'], 2,
              'Uniform means $ a_t = 0 $, leaving only the radial component, which is perpendicular to the tangential velocity. So the angle is exactly $ 90° $.'),
            num('p12-y3', 'A wheel of radius $ 0.5 $ m has an angular acceleration of $ 6 $ rad/s². Find the tangential acceleration of a point on its rim.',
              '$ 3 $ m/s²',
              '$ a_t = r\\alpha = 0.5(6) = 3 $ m/s². Note this stays constant while the radial component grows as the wheel speeds up.'),
            mcq('p12-y4', 'A particle in circular motion has $ a_t = 3 $ m/s² and $ a_r = 4 $ m/s². Its net acceleration is:',
              ['$ 3 $ m/s²', '$ 5 $ m/s²', '$ 7 $ m/s²', '$ 1 $ m/s²'], 1,
              'The two components are perpendicular, so $ a = \\sqrt{9 + 16} = 5 $ m/s². Adding them arithmetically to get 7 ignores that they are at right angles.'),
            num('p12-y5', 'A flywheel starting from rest reaches $ 300 $ rev/min in $ 10 $ s at constant angular acceleration. Find $ \\alpha $ and the number of revolutions completed in that time.',
              '$ \\alpha = 3.14 $ rad/s²; $ 25 $ revolutions',
              '$ \\omega = 2\\pi(5) = 31.4 $ rad/s, so $ \\alpha = 31.4/10 = 3.14 $ rad/s². Then $ \\theta = \\frac{1}{2}\\alpha t^2 = \\frac{1}{2}(3.14)(100) = 157 $ rad, which is $ 157/2\\pi = 25 $ revolutions.'),
            mcq('p12-y6', 'A particle moving on a circle is slowing down. The angle between its velocity and its acceleration is:',
              ['Acute', 'Exactly $ 90° $', 'Obtuse', 'Exactly $ 180° $'], 2,
              'Slowing means $ a_t $ opposes $ \\mathbf{v} $, tilting the total acceleration backwards past $ 90° $. It never reaches $ 180° $ because $ a_r $ is always present.'),
            num('p12-y7', 'A particle starts from rest on a circle of radius $ 2 $ m with constant angular acceleration $ 2 $ rad/s². Find its net acceleration at $ t = 1 $ s.',
              '$ 8.94 $ m/s²',
              '$ a_t = r\\alpha = 2(2) = 4 $ m/s². At $ t = 1 $ s, $ \\omega = \\alpha t = 2 $ rad/s, so $ a_r = r\\omega^2 = 2(4) = 8 $ m/s². Then $ a = \\sqrt{16 + 64} = \\sqrt{80} = 8.94 $ m/s².'),
            num('p12-y8', 'A wheel rotating at $ 20 $ rad/s is brought to rest in $ 100 $ rad of rotation. Find its angular retardation.',
              '$ 2 $ rad/s²',
              'Use $ \\omega^2 = \\omega_0^2 + 2\\alpha\\theta $ with $ \\omega = 0 $: $ 0 = 400 + 2\\alpha(100) $, so $ \\alpha = -2 $ rad/s², a retardation of 2 rad/s². This is the angular version of the stopping-distance calculation from Chapter 2 page 12.'),
          ],
        },
      ],
    }),
    b('text', 14, {
      markdown: 'Circular motion is done — as far as kinematics can take it without forces. What is left is the last big idea in the chapter: **what the world looks like from something that is itself moving**, now in two dimensions.',
    }),
  ],
};

// Plan §4 item 4 + §2.1 G2: the non-uniform circular material is JEE-only, so p12
// is marked competitive. `tier` is a BLOCK field (BaseBlockSchema).
const competitive = (page) => ({ ...page, blocks: page.blocks.map((blk) => ({ ...blk, tier: 'competitive' })) });

withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p10, p11, competitive(p12)]);
}).then(() => { console.log('\nWave 2a done — p10–p12'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
