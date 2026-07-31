'use strict';
/**
 * Class 11 Physics · Chapter 3 "Motion in Two Dimensions" — pages 4–6.
 * Wave 1b: projectile motion set up, the three standard results derived, and
 * the equation of the path.
 *
 * SOURCE NOTE: the p5 precondition on R_max is plan conflict C1. One reference
 * book states "R_max = u²/g at 45°" flatly, which is only true when the launch
 * and landing points are at the SAME HEIGHT. The condition is attached every
 * single time the result appears, and p7 exists partly to make the failure case
 * concrete.
 *
 * Run: node scripts/physics11-book/build_ch3_projectile.js
 */
const { b, q, st, mcq, hero, num, ensureChapter, upsertPages, withDb } = require('./_book_ch3');

// ── p4 · Projectile Motion — Setting It Up ───────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'projectile-motion-setting-it-up',
  title: 'Projectile Motion — Setting It Up',
  subtitle: 'Resolve once, and two problems you already solved fall out',
  glossary: [
    { term: 'projectile', definition: 'An object in flight after being thrown or projected, moving under gravity alone with air resistance neglected.' },
    { term: 'angle of projection', definition: 'The angle θ between the initial velocity of a projectile and the horizontal.' },
  ],
  blocks: [
    hero('projectile-motion-setting-it-up'),
    b('curiosity_prompt', 0, {
      prompt: 'A ball is thrown at an angle and traces a graceful arc. Name every force acting on it while it is in the air, ignoring air resistance.',
      hint: 'Resist the urge to include a force "pushing it along".',
      reveal: '**Just one: gravity.** Nothing else.\n\nNo forward force. Nothing is pushing the ball along its path — your hand stopped touching it at the launch instant and has had no say since.\n\nThat feels wrong, because the ball is clearly still travelling forwards. But that is what Chapter 2 taught: motion does not need a cause, only a *change* of motion does. The forward motion is simply left over from the throw, and nothing takes it away.\n\nSo the acceleration is $ g $ downwards, constant, for the entire flight — including at the highest point, where the ball is momentarily not going up or down at all.',
    }),
    b('text', 1, {
      markdown: 'Set up the axes the same way every time: **x horizontal, y vertically upwards, origin at the launch point.** Then resolve.\n\n$ u_x = u\\cos\\theta \\qquad u_y = u\\sin\\theta $\n\n$ a_x = 0 \\qquad a_y = -g $\n\nAnd that is the whole of projectile motion. Everything on the next three pages is consequences.',
    }),
    b('step_solver', 2, {
      title: 'A projectile and a vertical throw, side by side',
      problem: 'Ball A is thrown straight up at $ 15 $ m/s. Ball B is thrown at $ 25 $ m/s at $ 37° $ above the horizontal. Show that they reach the same maximum height and spend the same time in the air. Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $.',
      intro: 'Two throws that look nothing alike. Work out the vertical column of each and see what happens.',
      steps: [
        st('Ball A: $ \\quad u_y = 15\\ \\text{m/s} $. Ball B: $ \\quad u_y = 25\\sin 37° = 25(0.6) = 15\\ \\text{m/s} $',
          'Resolve B and the two vertical components turn out to be identical. That is the whole of it.', {
            check: {
              kind: 'mcq',
              prompt: 'What is $ u_y $ for ball A — the one thrown straight up?',
              options: [
                'The full $ 15 $ m/s, since the throw is entirely vertical',
                '$ 15\\cos 90° = 0 $',
                'It cannot be found without an angle',
                'Half of $ 15 $ m/s',
              ],
              answer_index: 0,
              feedback_right: 'Right — a vertical throw puts all of its speed into the vertical component.',
              feedback_wrong: 'A vertical throw is the case $ \\theta = 90° $, so $ u_y = u\\sin 90° = u = 15 $ m/s and $ u_x = u\\cos 90° = 0 $. Nothing goes sideways.',
            },
          }),
        st('Both have $ u_y = 15 $ m/s and $ a_y = -10 $ m/s². **Their vertical columns are identical.**',
          'And the maximum height and the time of flight are answers that come out of the vertical column alone.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find the maximum height from $ v_y^2 = u_y^2 - 2gH $ with $ v_y = 0 $. Give the answer in metres.',
              blank_answer: '11.25',
              feedback_right: 'Yes — $ 225/20 = 11.25 $ m, for both balls.',
              feedback_wrong: '$ 0 = 225 - 2(10)H $, so $ H = 225/20 = 11.25 $ m — the same for both, because their vertical columns are the same.',
            },
          }),
        st('$ H = 11.25\\ \\text{m} $ and $ T = \\dfrac{2(15)}{10} = 3\\ \\text{s} $ — for **both** balls.',
          'Ball B also travels 60 m sideways in those 3 s. Ball A travels nowhere. Neither fact changed the height or the time by one bit.', {
            why: 'So the claim in the box below is literally true, not a loose analogy: **the vertical motion of a projectile *is* a vertical throw.** Whenever you are asked how high or how long, throw the horizontal information away — it has no vote.',
          }),
      ],
      now_you_try: {
        problem: 'Ball P is thrown straight up at $ 20 $ m/s. Ball Q is thrown at $ 25 $ m/s at $ 53° $. Do they reach the same height? Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $.',
        answer: 'Yes — both reach $ 20 $ m',
        solution: 'For Q, $ u_y = 25(0.8) = 20 $ m/s, the same as P\'s. So both have $ H = u_y^2/2g = 400/20 = 20 $ m and $ T = 2(20)/10 = 4 $ s. Q additionally covers $ 25(0.6)(4) = 60 $ m horizontally, which affects neither answer.',
      },
    }),
    b('callout', 3, {
      variant: 'note',
      title: 'Two problems you have already solved',
      markdown: 'Look at the two columns separately and you will recognise both of them from Chapter 2.\n\n**The vertical motion is identical to a particle thrown straight up with speed $ u\\sin\\theta $.** Same rise, same fall, same time — free fall, Chapter 2 page 11.\n\n**The horizontal motion is identical to a particle moving horizontally at a steady $ u\\cos\\theta $.** No acceleration at all — uniform motion, Chapter 2 page 2.\n\nA projectile is those two motions bolted together, sharing one clock. **There is nothing else in it.**',
    }),
    b('step_solver', 3, {
      title: 'The two columns, once and properly',
      problem: 'A ball is thrown from the ground at $ 25 $ m/s at $ 37° $ above the horizontal. Write down its position and velocity components as functions of time. Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
      intro: 'Do this once carefully and every projectile question afterwards becomes bookkeeping.',
      steps: [
        st('$ u_x = 25\\cos 37° = 25(0.8) = 20\\ \\text{m/s} \\qquad u_y = 25\\sin 37° = 25(0.6) = 15\\ \\text{m/s} $',
          'The resolution. This is the first component extraction on this page, so it is written out in full — from here on it will be one line.', {
            check: {
              kind: 'mcq',
              prompt: 'Which of the four set-up quantities is zero?',
              options: ['$ u_x $', '$ u_y $', '$ a_x $', '$ a_y $'],
              answer_index: 2,
              feedback_right: 'Right — gravity has no horizontal component, so there is no horizontal acceleration.',
              feedback_wrong: '$ a_x = 0 $. Gravity points straight down, so it has nothing to contribute along the horizontal axis. All three of the others are non-zero here.',
            },
          }),
        st('Horizontal: $ \\quad v_x = 20\\ \\text{m/s (always)} \\qquad x = 20t $',
          'With $ a_x = 0 $, the first equation gives $ v_x = u_x $ for all time, and the second collapses to plain uniform motion.', {
            check: {
              kind: 'fill_blank',
              prompt: 'What is $ v_x $ at $ t = 3 $ s, in m/s?',
              blank_answer: '20',
              feedback_right: 'Yes — it is 20 m/s at every instant of the flight.',
              feedback_wrong: 'Still 20 m/s. Nothing accelerates the ball horizontally, so $ v_x $ has the same value at launch, at the top, and at landing.',
            },
          }),
        st('Vertical: $ \\quad v_y = 15 - 10t \\qquad y = 15t - 5t^2 $',
          'The full Chapter 2 equations with $ u_y = 15 $ and $ a_y = -10 $. Note $ v_y $ passes through zero and then goes negative.', {
            why: 'Read the $ v_y $ equation as a story. It starts at $ +15 $ m/s, loses 10 m/s every second, hits zero at $ t = 1.5 $ s — that is the top — then keeps going negative as the ball falls. The sign of $ v_y $ *is* the answer to "is it going up or down?"',
          }),
        st('At any time $ t $: $ \\quad \\mathbf{v} = 20\\,\\hat{i} + (15 - 10t)\\,\\hat{j} \\qquad \\mathbf{r} = 20t\\,\\hat{i} + (15t - 5t^2)\\,\\hat{j} $',
          'Four scalar functions, two per axis. Every question about this ball is answered by substituting into these.', {
            check: {
              kind: 'mcq',
              prompt: 'At $ t = 2 $ s, what is the velocity?',
              options: ['$ 20\\,\\hat{i} + 5\\,\\hat{j} $ m/s', '$ 20\\,\\hat{i} - 5\\,\\hat{j} $ m/s', '$ 20\\,\\hat{i} - 15\\,\\hat{j} $ m/s', '$ 0\\,\\hat{i} - 5\\,\\hat{j} $ m/s'],
              answer_index: 1,
              feedback_right: 'Right — $ v_y = 15 - 20 = -5 $ m/s, so the ball is already on the way down.',
              feedback_wrong: '$ v_x $ stays at 20 m/s and $ v_y = 15 - 10(2) = -5 $ m/s. The negative sign says the ball has passed the top and is descending.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A stone is thrown at $ 20 $ m/s at $ 53° $ above the horizontal. Write $ v_x $, $ v_y $, $ x $ and $ y $ as functions of time, and find the velocity at $ t = 1 $ s. Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $, $ \\cos 53° = 0.6 $.',
        answer: '$ v_x = 12 $, $ v_y = 16 - 10t $, $ x = 12t $, $ y = 16t - 5t^2 $; at $ t = 1 $ s, $ \\mathbf{v} = 12\\,\\hat{i} + 6\\,\\hat{j} $ m/s',
        solution: '$ u_x = 20(0.6) = 12 $ m/s and $ u_y = 20(0.8) = 16 $ m/s. So $ v_x = 12 $ m/s always, $ v_y = 16 - 10t $, $ x = 12t $ and $ y = 16t - 5t^2 $. At $ t = 1 $ s, $ v_y = 6 $ m/s, so $ \\mathbf{v} = 12\\,\\hat{i} + 6\\,\\hat{j} $ m/s and the speed is $ \\sqrt{144+36} = 13.4 $ m/s.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('During the flight of a projectile, the acceleration is:',
          ['Zero at the highest point of the path', 'Always $ g $ downwards, including at the top', 'Largest at the launch instant', 'Directed along the path at all times'], 1,
          'Gravity does not switch off anywhere, so the acceleration is $ g $ downwards for the whole flight. At the top the *velocity* has no vertical part, but the acceleration is unchanged — which is exactly why the ball does not stay up there.', 1),
        q('At the highest point of its path, a projectile launched at $ u $ and angle $ \\theta $ has speed:',
          ['Zero', '$ u $', '$ u\\cos\\theta $', '$ u\\sin\\theta $'], 2,
          'Only the vertical component vanishes at the top. The horizontal component is still $ u\\cos\\theta $, untouched, so that is the speed there. It is the smallest speed anywhere on the path.', 2),
        q('A projectile is launched at $ 30° $. Compared with the vertical motion of a ball thrown straight up at $ u\\sin 30° $, its vertical motion is:',
          ['Slower, because some speed went sideways', 'Exactly the same', 'Faster, because it also moves forward', 'Not comparable'], 1,
          'The vertical column of the projectile is $ u_y = u\\sin 30° $ with $ a_y = -g $, which is word-for-word the vertical throw. The horizontal motion appears nowhere in it, so it changes nothing about the rise and fall.', 2),
      ],
    }),
    b('image', 5, {
      src: '',
      alt: 'A projectile trajectory with velocity arrows at five instants, each resolved into a constant horizontal component and a shrinking-then-growing vertical component, with a strip below showing equal horizontal steps.',
      aspect_ratio: '16:9',
      figure_key: 'ch3-projectile-components',
      caption: 'The horizontal arrows are all the same length. The vertical arrows shrink to nothing at the top and then grow downwards. That is the whole of projectile motion in one picture.',
    }),
    b('step_solver', 6, {
      title: 'Speed and direction partway through the flight',
      problem: 'A ball is thrown at $ 20 $ m/s at $ 60° $ to the horizontal. Find its speed and the direction of its motion at $ t = 1.0 $ s. Take $ g = 10 $ m/s², $ \\sin 60° = 0.866 $, $ \\cos 60° = 0.5 $.',
      intro: 'Two components, then recombine. The direction is the part that carries the physics.',
      steps: [
        st('$ u_x = 20(0.5) = 10\\ \\text{m/s} \\qquad u_y = 20(0.866) = 17.3\\ \\text{m/s} $',
          'Resolve, then treat the two axes separately as usual.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find $ v_y $ at $ t = 1.0 $ s, from $ v_y = u_y - gt $. Give the answer in m/s to one decimal place.',
              blank_answer: '7.3',
              feedback_right: 'Yes — $ 17.3 - 10 = 7.3 $ m/s, still positive, so still rising.',
              feedback_wrong: '$ v_y = 17.3 - 10(1.0) = 7.3 $ m/s. It is still positive, which tells you the ball has not yet reached the top.',
            },
          }),
        st('$ v_x = 10\\ \\text{m/s}, \\quad v_y = 7.3\\ \\text{m/s} \\quad \\Rightarrow \\quad v = \\sqrt{100 + 53.3} = 12.4\\ \\text{m/s} $',
          'The speed has dropped from 20 m/s to 12.4 m/s in one second — and every bit of that loss came out of the vertical component.', {
            check: {
              kind: 'mcq',
              prompt: 'The direction of motion at this instant, from $ \\tan\\theta = v_y/v_x = 0.73 $:',
              options: ['$ 36° $ above the horizontal', '$ 54° $ above the horizontal', '$ 60° $ above the horizontal', '$ 36° $ below the horizontal'],
              answer_index: 0,
              feedback_right: 'Right — $ \\tan^{-1}(0.73) = 36° $, and it is above the horizontal because $ v_y > 0 $.',
              feedback_wrong: '$ \\tan^{-1}(7.3/10) = \\tan^{-1}(0.73) = 36° $. It is *above* the horizontal because $ v_y $ is still positive — the ball is rising, but at a shallower angle than it launched at.',
            },
          }),
        st('$ v = 12.4 $ m/s at $ 36° $ above the horizontal.',
          'Launched at $ 60° $, and one second later it is travelling at only $ 36° $. The path is flattening out.', {
            why: 'This is the curve, appearing in the numbers. $ v_x $ is frozen at 10 m/s while $ v_y $ is being eaten away at 10 m/s per second, so the ratio $ v_y/v_x $ falls steadily and the direction of travel rotates downwards. **The path is curved because one component changes and the other does not.**',
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown at $ 30 $ m/s at $ 30° $ to the horizontal. Find its speed and direction of motion at $ t = 2.0 $ s. Take $ g = 10 $ m/s².',
        answer: '$ 26.5 $ m/s at $ 12.2° $ below the horizontal',
        solution: '$ u_x = 30\\cos 30° = 26.0 $ m/s and $ u_y = 30\\sin 30° = 15 $ m/s. At $ t = 2 $ s, $ v_x = 26.0 $ m/s and $ v_y = 15 - 20 = -5 $ m/s. So $ v = \\sqrt{676 + 25} = 26.5 $ m/s, and $ \\tan\\theta = 5/26 $ gives $ 10.9° $ **below** the horizontal — the negative $ v_y $ says it is descending.',
      },
    }),
    b('step_solver', 7, {
      title: 'How fast is it going at a given height?',
      problem: 'A ball is thrown from the ground at $ 20 $ m/s at $ 53° $. Find its speed when it is $ 10 $ m above the ground. Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $, $ \\cos 53° = 0.6 $.',
      intro: 'A height is given and no time is mentioned anywhere, which fixes the choice of equation before you start.',
      steps: [
        st('$ u_x = 12\\ \\text{m/s}, \\quad u_y = 16\\ \\text{m/s} $. Height is a **vertical** quantity, and time is absent.',
          'So use the time-free equation on the vertical axis only.', {
            check: {
              kind: 'mcq',
              prompt: 'Which equation, on which axis?',
              options: [
                '$ v_y^2 = u_y^2 + 2a_y s_y $, vertical',
                '$ v_y = u_y + a_y t $, vertical',
                '$ v^2 = u^2 + 2as $, using total speeds',
                '$ s_x = u_x t $, horizontal',
              ],
              answer_index: 0,
              feedback_right: 'Right — no $ t $ in it, and every quantity in it belongs to the vertical axis.',
              feedback_wrong: 'Time is neither given nor asked for, so use $ v_y^2 = u_y^2 + 2a_y s_y $ — and use it on the vertical axis, because that is where the 10 m lives. Using total speeds in that equation is not a valid statement in two dimensions.',
            },
          }),
        st('$ v_y^2 = 16^2 + 2(-10)(10) = 256 - 200 = 56 \\quad \\Rightarrow \\quad v_y = \\pm 7.48\\ \\text{m/s} $',
          'Two signs, and both are real: the ball passes through 10 m twice, once going up and once coming down.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The horizontal component at that height is unchanged. What is $ v_x $, in m/s?',
              blank_answer: '12',
              feedback_right: 'Yes — 12 m/s, as it is everywhere on the path.',
              feedback_wrong: '$ v_x = u\\cos\\theta = 12 $ m/s, and it never changes. That is why it did not need calculating.',
            },
          }),
        st('$ v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{144 + 56} = \\sqrt{200} = 14.1\\ \\text{m/s} $',
          'The same speed on the way up and on the way down, because only $ v_y^2 $ entered the calculation and the sign was squared away.', {
            why: 'That is a genuinely useful symmetry: **at any given height, the speed going up equals the speed coming down.** The direction differs — one is $ +7.48 $ m/s vertically and the other $ -7.48 $ — but the speed is identical. It is the projectile version of the free-fall symmetry from Chapter 2 page 11.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown from the ground at $ 25 $ m/s at $ 37° $. Find its speed at a height of $ 5 $ m. Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
        answer: '$ 22.9 $ m/s',
        solution: '$ u_x = 20 $ m/s and $ u_y = 15 $ m/s. Then $ v_y^2 = 225 - 2(10)(5) = 125 $, so $ v_y = \\pm 11.2 $ m/s. And $ v = \\sqrt{400 + 125} = \\sqrt{525} = 22.9 $ m/s — the same value on the way up and on the way down.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A projectile passes a given height twice. Comparing its speed at that height on the way up and on the way down:',
          ['The speed going up is greater', 'The speed coming down is greater', 'The two speeds are equal', 'It depends on the launch angle'], 2,
          'Only $ v_y^2 $ enters the calculation, so the sign of $ v_y $ is squared away and the two speeds match. The velocity *vectors* differ, being mirror images about the horizontal.', 2),
        q('For a projectile, which quantity has the same value at launch and at landing on level ground?',
          ['The vertical velocity component', 'The speed', 'The direction of motion', 'The height'], 1,
          'On level ground the landing height equals the launch height, so by the same-height symmetry the speed is the same. The vertical component has reversed sign and the direction of motion is $ -\\theta $ rather than $ +\\theta $.', 2),
        q('The smallest speed a projectile has anywhere on its path occurs:',
          ['At the launch instant', 'At the highest point', 'At the landing instant', 'A quarter of the way along'], 1,
          'The speed is $ \\sqrt{v_x^2 + v_y^2} $ with $ v_x $ fixed, so the speed is smallest where $ |v_y| $ is smallest — which is zero, at the top. There the speed is just $ u\\cos\\theta $.', 2),
      ],
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Three set-up mistakes worth never making',
      markdown: '1. **Using $ \\sin $ where $ \\cos $ belongs.** Always check that $ \\sqrt{u_x^2 + u_y^2} $ rebuilds $ u $.\n2. **Letting $ v_x $ change.** It does not. If your working has $ v_x $ decreasing, something has gone wrong upstream.\n3. **Mixing axes in one equation.** $ v_y^2 = u_y^2 + 2a_y s_y $ is fine. $ v^2 = u^2 + 2as $ with total magnitudes is not a true statement in two dimensions.\n\nAnd one about signs: pick upwards as positive and then *keep* it. Writing $ a_y = -g $ and then also subtracting somewhere else double-counts the minus sign.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Eight questions. Write the four set-up quantities — $ u_x $, $ u_y $, $ a_x $, $ a_y $ — before touching an equation, every time.',
      sections: [
        {
          id: 'p4-ysi',
          title: 'Setting up a projectile',
          items: [
            num('p4-y1', 'A ball is thrown at $ 20 $ m/s at $ 30° $ to the horizontal. Find its velocity components at $ t = 1 $ s. Take $ g = 10 $ m/s².',
              '$ v_x = 17.3 $ m/s, $ v_y = 0 $',
              '$ u_x = 20\\cos 30° = 17.3 $ m/s and $ u_y = 20\\sin 30° = 10 $ m/s. At $ t = 1 $ s, $ v_x = 17.3 $ m/s (unchanged) and $ v_y = 10 - 10(1) = 0 $. The ball is exactly at the top of its path at this instant.'),
            mcq('p4-y2', 'A projectile is launched at $ 45° $. At the top of its path, the ratio of its speed to its launch speed is:',
              ['$ 1 $, the speed is unchanged', '$ 1/\\sqrt{2} $', '$ 1/2 $, half the launch speed', '$ 0 $, the ball is momentarily at rest'], 1,
              'At the top the speed is $ u\\cos 45° = u/\\sqrt{2} $, so the ratio is $ 1/\\sqrt{2} \\approx 0.71 $. It is not zero — the horizontal component survives.'),
            num('p4-y3', 'A stone is thrown at $ 15 $ m/s at $ 53° $. At what time is it moving horizontally? Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $.',
              '$ 1.2 $ s',
              'Moving horizontally means $ v_y = 0 $. With $ u_y = 15(0.8) = 12 $ m/s, $ 0 = 12 - 10t $ gives $ t = 1.2 $ s.'),
            mcq('p4-y4', 'Two balls are thrown with the same speed, one at $ 30° $ and one at $ 60° $. Which has the greater horizontal velocity component?',
              ['The one at $ 30° $', 'The one at $ 60° $', 'They are equal', 'It depends on the speed'], 0,
              '$ u_x = u\\cos\\theta $, and cosine decreases as the angle grows, so the shallower $ 30° $ throw has the larger horizontal component. Its vertical component is correspondingly smaller.'),
            num('p4-y5', 'A ball is thrown at $ 40 $ m/s at $ 37° $. Find its speed at a height of $ 20 $ m. Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
              '$ 34.6 $ m/s',
              '$ u_x = 32 $ m/s, $ u_y = 24 $ m/s. Then $ v_y^2 = 576 - 2(10)(20) = 176 $, so $ v = \\sqrt{1024 + 176} = \\sqrt{1200} = 34.6 $ m/s.'),
            mcq('p4-y6', 'For a projectile in flight, the horizontal component of velocity is constant because:',
              ['Air resistance is neglected and gravity has no horizontal component', 'The projectile is light enough for gravity to dominate', 'The motion is symmetric about the highest point of the path', 'The launch angle is fixed at the moment of release'], 0,
              'No horizontal force means no horizontal acceleration, so $ v_x $ cannot change. Both parts matter: gravity is vertical, and we have assumed away the one force that *would* act horizontally.'),
            num('p4-y7', 'A projectile is launched at $ 50 $ m/s at $ 53° $. Find (a) the time at which it is moving at $ 45° $ below the horizontal and (b) its speed then. Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $, $ \\cos 53° = 0.6 $.',
              '(a) $ 7 $ s  (b) $ 42.4 $ m/s',
              '$ u_x = 30 $ m/s, $ u_y = 40 $ m/s. At $ 45° $ below the horizontal, $ |v_y| = v_x = 30 $ m/s with $ v_y $ negative, so $ -30 = 40 - 10t $ and $ t = 7 $ s. The speed is $ \\sqrt{900+900} = 30\\sqrt{2} = 42.4 $ m/s.'),
            num('p4-y8', 'A ball thrown at $ 12 $ m/s at $ 60° $ from the ground: find its velocity vector at $ t = 1.5 $ s. Take $ g = 10 $ m/s², $ \\sin 60° = 0.866 $, $ \\cos 60° = 0.5 $.',
              '$ \\mathbf{v} = 6\\,\\hat{i} - 4.6\\,\\hat{j} $ m/s',
              '$ u_x = 6 $ m/s and $ u_y = 10.4 $ m/s. At $ t = 1.5 $ s, $ v_x = 6 $ m/s and $ v_y = 10.4 - 15 = -4.6 $ m/s. The ball is descending, having passed the top at $ t = 1.04 $ s.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'The set-up is done. Now the three questions everyone actually asks about a projectile: **how long is it up there, how high does it get, and how far does it go?**',
    }),
  ],
};

// ── p5 · Time of Flight, Height and Range ────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'time-of-flight-height-and-range',
  title: 'Time of Flight, Height and Range',
  subtitle: 'Three results, derived — and one precondition that catches everybody',
  glossary: [
    { term: 'time of flight', definition: 'The total time a projectile spends in the air, from launch until it returns to the launch height.' },
    { term: 'horizontal range', definition: 'The horizontal distance covered by a projectile between launch and returning to the same height.' },
  ],
  blocks: [
    hero('time-of-flight-height-and-range'),
    b('curiosity_prompt', 0, {
      prompt: 'You want to throw a ball as far as you possibly can, along level ground. What angle should you throw it at — and why is that angle a compromise rather than an obvious best?',
      hint: 'Range needs two things at once. What are they, and do they want the same angle?',
      reveal: '**45°** — and it is a compromise between two demands that pull in opposite directions.\n\nTo go far you need a large **horizontal speed** ($ u\\cos\\theta $, which wants a *small* angle) and a long **time in the air** ($ 2u\\sin\\theta/g $, which wants a *large* angle). Throw flat and the ball is fast but lands almost immediately. Throw steeply and it hangs up for ages but barely moves sideways.\n\nThe product of the two is largest exactly halfway between, at $ 45° $.\n\nAnd that answer hides a condition which this page will make very loud, because forgetting it is one of the most common exam errors in mechanics.',
    }),
    b('heading', 1, {
      text: 'Time of flight',
      level: 2,
      objective: 'Derive the time of flight from the vertical column alone.',
    }),
    b('step_solver', 2, {
      title: 'Deriving the time of flight',
      problem: 'A projectile is launched from the ground with speed $ u $ at angle $ \\theta $. Derive an expression for the total time it spends in the air, landing back at the same level.',
      intro: 'One condition, one axis, one quadratic. Note what "landing" means mathematically before you start.',
      steps: [
        st('Landing condition: $ \\quad s_y = 0 $ (back at the launch height)',
          'The ball has moved a long way horizontally, so its *displacement* is not zero — but its **vertical** displacement is.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the landing condition $ s_y = 0 $ rather than $ y $ being at its lowest?',
              options: [
                'Because the ball returns to the height it started from',
                'Because the ball comes to rest',
                'Because the vertical velocity is zero at landing',
                'Because the horizontal displacement is zero',
              ],
              answer_index: 0,
              feedback_right: 'Right — same height means zero *change* in height.',
              feedback_wrong: 'Displacement is measured from the launch point, and the ball lands at the same height it left, so $ s_y = 0 $. The ball is certainly not at rest at landing, and $ v_y $ is at its most negative there, not zero.',
            },
          }),
        st('$ 0 = (u\\sin\\theta)t - \\tfrac{1}{2}gt^2 \\quad \\Rightarrow \\quad t\\left(u\\sin\\theta - \\tfrac{1}{2}gt\\right) = 0 $',
          'Substituting into $ s_y = u_y t + \\frac{1}{2}a_y t^2 $ and factorising rather than using the quadratic formula.', {
            check: {
              kind: 'mcq',
              prompt: 'This gives two roots. What does the root $ t = 0 $ represent?',
              options: [
                'The launch instant, when the ball was also at zero height',
                'An error in the algebra',
                'The highest point of the path',
                'The landing instant',
              ],
              answer_index: 0,
              feedback_right: 'Right — the equation was asked "when is the height zero?", and launch is a perfectly good answer.',
              feedback_wrong: 'At $ t = 0 $ the ball is at the launch point, whose height is also zero. The algebra is being honest: it found both times at which the height is zero. The one we want is the other root.',
            },
          }),
        st('$ T = \\dfrac{2u\\sin\\theta}{g} $',
          'The non-zero root. Notice it depends only on the *vertical* component — the horizontal speed is nowhere in it.', {
            why: 'Which is the two-coin experiment yet again. And there is a shortcut hidden here: the time to the top is $ t_m = u\\sin\\theta/g $, exactly half of $ T $. **Up-time equals down-time**, because the vertical motion is a plain free-fall throw and free fall is symmetric.',
          }),
        st('$ T = \\dfrac{2u\\sin\\theta}{g} \\quad\\text{and}\\quad t_{\\text{top}} = \\dfrac{T}{2} = \\dfrac{u\\sin\\theta}{g} $',
          'Two results for the price of one derivation.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A ball is thrown at $ 20 $ m/s at $ 30° $, with $ g = 10 $ m/s². Find $ T $, in seconds.',
              blank_answer: '2',
              feedback_right: 'Yes — $ 2(20)(0.5)/10 = 2 $ s.',
              feedback_wrong: '$ T = 2u\\sin\\theta/g = 2(20)(0.5)/10 = 20/10 = 2 $ s, with 1 s up and 1 s down.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A projectile is launched at $ 49 $ m/s at $ 30° $. Find its time of flight and the time it takes to reach the highest point. Take $ g = 9.8 $ m/s².',
        answer: '$ T = 5 $ s, $ t_{\\text{top}} = 2.5 $ s',
        solution: '$ T = 2u\\sin\\theta/g = 2(49)(0.5)/9.8 = 49/9.8 = 5 $ s. The time to the top is half of that, 2.5 s.',
      },
    }),
    b('heading', 3, {
      text: 'Maximum height, and range',
      level: 2,
      objective: 'Derive H and R, and state the condition R_max = u²/g depends on.',
    }),
    b('step_solver', 4, {
      title: 'Deriving the maximum height and the range',
      problem: 'For the same launch — speed $ u $, angle $ \\theta $, level ground — derive the maximum height $ H $ and the horizontal range $ R $.',
      intro: 'The height is a vertical question; the range is a horizontal one that borrows the time of flight. Two different axes, two different tools.',
      steps: [
        st('At the top, $ v_y = 0 $. Time-free equation on the vertical axis: $ \\quad 0 = (u\\sin\\theta)^2 - 2gH $',
          'The height is asked for and no time is wanted, so use $ v_y^2 = u_y^2 + 2a_y s_y $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Rearrange for $ H $. The numerator is $ u^2\\sin^2\\theta $ — what is the denominator?',
              blank_answer: '2g',
              feedback_right: 'Yes — $ H = u^2\\sin^2\\theta/2g $.',
              feedback_wrong: '$ 2gH = u^2\\sin^2\\theta $, so $ H = u^2\\sin^2\\theta/(2g) $.',
            },
          }),
        st('$ H = \\dfrac{u^2\\sin^2\\theta}{2g} $',
          'Vertical component squared, over $ 2g $ — which is exactly the Chapter 2 result for a ball thrown straight up at $ u\\sin\\theta $.', {
            why: 'Every projectile result so far has turned out to be a Chapter 2 result with $ u\\sin\\theta $ or $ u\\cos\\theta $ written in place of $ u $. That is not a pattern worth memorising separately — it is what "two independent one-dimensional motions" *means*.',
          }),
        st('Range: $ \\quad R = u_x T = (u\\cos\\theta)\\dfrac{2u\\sin\\theta}{g} = \\dfrac{2u^2\\sin\\theta\\cos\\theta}{g} $',
          'The horizontal axis has no acceleration, so distance is simply speed times time — and the time is the time of flight we already have.', {
            check: {
              kind: 'mcq',
              prompt: 'Which identity turns $ 2\\sin\\theta\\cos\\theta $ into a single term?',
              options: ['$ \\sin 2\\theta $', '$ \\cos 2\\theta $', '$ \\tan 2\\theta $', '$ \\sin^2\\theta $'],
              answer_index: 0,
              feedback_right: 'Right — the double-angle identity $ \\sin 2\\theta = 2\\sin\\theta\\cos\\theta $.',
              feedback_wrong: 'The double-angle identity is $ \\sin 2\\theta = 2\\sin\\theta\\cos\\theta $, from Chapter 0. Using it gives the compact form of the range.',
            },
          }),
        st('$ R = \\dfrac{u^2\\sin 2\\theta}{g} $',
          'The range depends on the angle only through $ \\sin 2\\theta $ — and that single fact carries the rest of this page.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A ball is thrown at $ 20 $ m/s at $ 45° $, $ g = 10 $ m/s². Find $ R $, in metres.',
              blank_answer: '40',
              feedback_right: 'Yes — $ \\sin 90° = 1 $, so $ R = 400/10 = 40 $ m.',
              feedback_wrong: '$ R = u^2\\sin 2\\theta/g = 400\\sin 90°/10 = 400(1)/10 = 40 $ m.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A cricket ball is thrown at $ 28 $ m/s at $ 30° $ above the horizontal. Calculate (a) the maximum height, (b) the time taken to return to the same level, and (c) the distance from the thrower to the point where it returns to the same level. Take $ g = 9.8 $ m/s².',
        answer: '(a) $ 10.0 $ m  (b) $ 2.9 $ s  (c) $ 69 $ m',
        solution: '(a) $ H = (28\\sin 30°)^2/(2 \\times 9.8) = 14^2/19.6 = 196/19.6 = 10.0 $ m. (b) $ T = 2(28)(\\sin 30°)/9.8 = 28/9.8 = 2.9 $ s. (c) $ R = (28)^2\\sin 60°/9.8 = 784(0.866)/9.8 = 69 $ m.',
      },
    }),
    b('callout', 5, {
      variant: 'warning',
      title: 'The precondition that catches everybody',
      markdown: 'Since $ \\sin 2\\theta $ is largest when $ 2\\theta = 90° $, the range is greatest at $ \\theta = 45° $, and then\n\n$ R_{\\max} = \\dfrac{u^2}{g} \\qquad\\text{and}\\qquad R_{\\max} = 4H_{\\max} $\n\n**But all three formulas on this page — $ T $, $ H $ and $ R $ — assume the projectile lands at the same height it was launched from.**\n\nFire from a cliff, throw at a target on a balcony, or launch up a slope, and they are simply the wrong formulas. In particular **$ 45° $ is no longer the best angle** — from a height, the optimum is *less* than $ 45° $.\n\nPage 7 makes that failure concrete. Until then: whenever you write $ R = u^2\\sin 2\\theta/g $, check that the two ends of the flight are level.',
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('The time of flight of a projectile depends on:',
          ['Only the horizontal component of the initial velocity', 'Only the vertical component of the initial velocity, and $ g $', 'Both components equally', 'The mass of the projectile'], 1,
          '$ T = 2u\\sin\\theta/g $ contains only the vertical component. The horizontal speed does not appear, because the horizontal motion has no say in when the ball comes back down.', 1),
        q('If the launch speed of a projectile is doubled at the same angle, its range becomes:',
          ['Twice as large', 'Four times as large', 'Eight times as large', 'Unchanged'], 1,
          '$ R \\propto u^2 $, so doubling $ u $ multiplies the range by 4. Both the horizontal speed and the time of flight double, and the range is their product.', 2),
        q('For a given launch speed on level ground, the range at $ 20° $ compared with the range at $ 70° $ is:',
          ['Greater, by a factor of about two', 'Smaller, by a factor of about two', 'Exactly equal', 'Zero, since the two ranges cancel'], 2,
          '$ \\sin(2 \\times 20°) = \\sin 40° $ and $ \\sin(2 \\times 70°) = \\sin 140° = \\sin 40° $, so the ranges are equal. The two angles add to $ 90° $ — they are complementary, which is the next result on this page.', 2),
        q('$ R_{\\max} = u^2/g $ at $ 45° $ is valid:',
          ['For every projectile launch without exception', 'Only when launch and landing are at the same height', 'Only for launch speeds below $ 50 $ m/s', 'Only when air resistance is included'], 1,
          'The whole derivation used $ s_y = 0 $, meaning the projectile returns to its launch height. From a cliff or up a slope, the formula and the $ 45° $ answer are both wrong.', 2),
      ],
    }),
    b('step_solver', 7, {
      title: 'Why 30° and 60° land in the same place',
      problem: 'Show that for a given launch speed, the ranges at angles $ \\theta $ and $ (90° - \\theta) $ on level ground are equal. Then say what *is* different between the two flights.',
      intro: 'Galileo wrote this down in 1638: "for elevations which exceed or fall short of 45° by equal amounts, the ranges are equal." Here is why.',
      steps: [
        st('Range at $ \\theta $: $ \\quad R_\\theta = \\dfrac{u^2\\sin 2\\theta}{g} $',
          'Now write the range at the complementary angle and compare the two sine terms.', {
            check: {
              kind: 'mcq',
              prompt: 'For the angle $ (90° - \\theta) $, the doubled angle is:',
              options: ['$ 180° - 2\\theta $', '$ 90° - 2\\theta $', '$ 180° + 2\\theta $', '$ 2\\theta - 90° $'],
              answer_index: 0,
              feedback_right: 'Right — $ 2(90° - \\theta) = 180° - 2\\theta $.',
              feedback_wrong: 'Double the whole bracket: $ 2(90° - \\theta) = 180° - 2\\theta $.',
            },
          }),
        st('$ \\sin(180° - 2\\theta) = \\sin 2\\theta $',
          'The supplementary-angle identity from Chapter 0 — sine takes the same value at an angle and at its supplement.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Check it numerically: $ \\sin 140° $ equals $ \\sin $ of which angle, in degrees?',
              blank_answer: '40',
              feedback_right: 'Yes — $ \\sin 140° = \\sin 40° $.',
              feedback_wrong: '$ \\sin(180° - 40°) = \\sin 40° $, so $ \\sin 140° = \\sin 40° \\approx 0.643 $. Both give the same range.',
            },
          }),
        st('$ R_{90° - \\theta} = \\dfrac{u^2\\sin(180° - 2\\theta)}{g} = \\dfrac{u^2\\sin 2\\theta}{g} = R_\\theta $',
          'So $ R_{30°} = R_{60°} $, and $ R_{20°} = R_{70°} $, and so on. The two land in exactly the same spot.', {
            why: 'The two flights are nothing alike though. The steeper throw has the larger $ \\sin\\theta $, so it goes **higher** and stays up **longer**; the shallower one is faster horizontally and gets there sooner. They trade speed for time in exactly compensating amounts. This is why a fielder can be beaten by either a flat throw or a lobbed one from the same distance.',
          }),
      ],
      now_you_try: {
        problem: 'A projectile launched at $ 15° $ has a range of $ 50 $ m. If it is fired at the same speed at $ 45° $, what is its range?',
        answer: '$ 100 $ m',
        solution: 'At $ 15° $: $ R = u^2\\sin 30°/g = u^2(0.5)/g = 50 $ m, so $ u^2/g = 100 $ m. At $ 45° $: $ R = u^2\\sin 90°/g = u^2/g = 100 $ m. The $ 45° $ launch is the maximum-range case, so it doubles the $ 15° $ result.',
      },
    }),
    b('step_solver', 8, {
      title: 'Range equal to the maximum height',
      problem: 'Find the angle of projection for which the horizontal range of a projectile equals its maximum height.',
      intro: 'A short piece of algebra, and the answer is a surprise — most people guess $ 45° $ or thereabouts.',
      steps: [
        st('$ \\dfrac{u^2\\sin 2\\theta}{g} = \\dfrac{u^2\\sin^2\\theta}{2g} $',
          'Set $ R = H $. The $ u^2 $ and the $ g $ will cancel, which is why the answer is a pure angle with no speed in it.', {
            check: {
              kind: 'mcq',
              prompt: 'Write $ \\sin 2\\theta $ as $ 2\\sin\\theta\\cos\\theta $ and cancel. What equation is left?',
              options: [
                '$ 2\\sin\\theta\\cos\\theta = \\sin^2\\theta/2 $',
                '$ \\sin\\theta\\cos\\theta = \\sin^2\\theta $',
                '$ 2\\cos\\theta = \\sin\\theta $',
                '$ \\sin 2\\theta = \\sin^2\\theta $',
              ],
              answer_index: 0,
              feedback_right: 'Right — now divide both sides by $ \\sin\\theta $.',
              feedback_wrong: 'Cancelling $ u^2/g $ from both sides leaves $ \\sin 2\\theta = \\sin^2\\theta/2 $, and substituting the double-angle identity gives $ 2\\sin\\theta\\cos\\theta = \\sin^2\\theta/2 $.',
            },
          }),
        st('Divide by $ \\sin\\theta $: $ \\quad 2\\cos\\theta = \\dfrac{\\sin\\theta}{2} \\quad \\Rightarrow \\quad \\tan\\theta = 4 $',
          'Dividing by $ \\sin\\theta $ is legitimate here because $ \\sin\\theta = 0 $ would mean no projectile at all.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find $ \\theta = \\tan^{-1}(4) $, in degrees to the nearest whole number.',
              blank_answer: '76',
              feedback_right: 'Yes — about $ 76° $.',
              feedback_wrong: '$ \\tan^{-1}(4) = 75.96° \\approx 76° $ — a very steep throw indeed.',
            },
          }),
        st('$ \\theta = \\tan^{-1}(4) \\approx 76° $',
          'A steep, lobbed throw. At $ 45° $ the range is four times the height, not equal to it.', {
            why: 'That $ 45° $ fact is worth having on its own: $ R_{\\max} = u^2/g $ and $ H_{\\max} = u^2\\sin^2 45°/(2g) = u^2/(4g) $, so **$ R_{\\max} = 4H_{\\max} $**. To get the height up to the range, you have to throw far steeper — and give up a lot of range doing it.',
          }),
      ],
      now_you_try: {
        problem: 'Prove that the maximum horizontal range is four times the maximum height attained, when the projectile is fired at the angle that gives maximum range.',
        answer: '$ R_{\\max} = 4H_{\\max} $',
        solution: 'At $ \\theta = 45° $: $ R_{\\max} = u^2\\sin 90°/g = u^2/g $. And $ H = u^2\\sin^2 45°/(2g) = u^2(1/2)/(2g) = u^2/(4g) = R_{\\max}/4 $. So $ R_{\\max} = 4H_{\\max} $.',
      },
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('Two projectiles are fired at the same speed at $ 30° $ and $ 60° $. Which statement is true?',
          ['Equal ranges, but the $ 60° $ one goes higher and stays up longer', 'Equal ranges and equal maximum heights as well', 'The $ 30° $ one has the greater range and the greater height', 'The $ 60° $ one has the greater range and a shorter flight'], 0,
          'Complementary angles give equal ranges. The steeper launch has the bigger vertical component, so it reaches a greater height and has a longer time of flight — the two effects trading off exactly.', 2),
        q('For a projectile fired at maximum range, the ratio $ R_{\\max}/H_{\\max} $ is:',
          ['$ 1 $', '$ 2 $', '$ 4 $', '$ 8 $'], 2,
          'At $ 45° $, $ R_{\\max} = u^2/g $ and $ H = u^2/(4g) $, so the ratio is 4.', 2),
        q('A cricketer can throw a ball to a maximum horizontal distance of $ 100 $ m. How high can the same ball be thrown vertically upwards?',
          ['$ 25 $ m', '$ 50 $ m', '$ 100 $ m', '$ 200 $ m'], 1,
          'Maximum range means $ u^2/g = 100 $ m. Thrown straight up, the height is $ u^2/2g = 50 $ m. Note this is *not* $ H_{\\max} $ at $ 45° $, which would be 25 m — a vertical throw puts all the speed into the vertical component.', 3),
        q('If two projectiles have the same range but different launch angles at the same speed, the sum of their maximum heights is:',
          ['$ u^2/2g $, independent of the angle', '$ u^2/g $', 'Different for every pair of angles', 'Zero'], 0,
          'For $ \\theta $ and $ 90° - \\theta $, $ H_1 + H_2 = \\frac{u^2}{2g}(\\sin^2\\theta + \\cos^2\\theta) = \\frac{u^2}{2g} $. The Pythagorean identity makes the angle drop out completely.', 3),
      ],
    }),
    b('callout', 10, {
      variant: 'real_world',
      title: 'Why a javelin is not thrown at 45°',
      markdown: 'This page says $ 45° $ is best. Every javelin thrower uses about $ 33°–36° $ — and would throw *shorter* at $ 45° $.\n\nEach reason is one assumption breaking:\n\n1. **Launch and landing are not level.** The javelin leaves a hand 2 m up, so a flatter throw wins.\n2. **Air resistance is not negligible**, and a javelin *glides* — lift rewards a shallower angle.\n3. **A human cannot throw equally fast at every angle.** Shoulder mechanics favour shallow, and $ R \\propto u^2 $, so a small speed gain beats a large angle correction.\n\nThe physics is not wrong. Its **assumptions** are not the ones a stadium satisfies.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'quantitative',
      prompt: 'A fielder standing 60 m from the batsman needs to get the ball to the wicketkeeper. She can throw at 30 m/s. Using $ g = 10 $ m/s², is a flat throw at 20° or a lobbed throw at 70° the better choice — and what would decide it in a real match?',
      reveal: '**The ranges are identical**, because $ 20° $ and $ 70° $ are complementary: $ R = 900\\sin 40°/10 = 900(0.643)/10 = 57.9 $ m for both. So on range alone she cannot reach 60 m at either angle — she needs about $ 21.5° $ or $ 68.5° $, or a harder throw.\n\nWhat separates them is **time**. At $ 20° $: $ T = 2(30)(0.342)/10 = 2.05 $ s. At $ 70° $: $ T = 2(30)(0.940)/10 = 5.64 $ s.\n\nSo the flat throw arrives in about a third of the time. In cricket that is the whole decision — a run-out is a race, and 3.6 extra seconds is an eternity. The lobbed throw also reaches about 40 m up, where wind matters much more.\n\n**The physics says the two are equivalent; the situation says they are not.** That is worth noticing: a formula tells you what is possible, not what is sensible. The flat throw is also harder to catch cleanly, which is the argument on the other side.',
      difficulty_level: 3,
    }),
    b('callout', 12, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ T = \\dfrac{2u\\sin\\theta}{g} \\qquad H = \\dfrac{u^2\\sin^2\\theta}{2g} \\qquad R = \\dfrac{u^2\\sin 2\\theta}{g} $\n- **All three assume launch and landing are at the same height.** Check it every time.\n- $ R_{\\max} = u^2/g $ at $ \\theta = 45° $, and $ R_{\\max} = 4H_{\\max} $.\n- **Complementary angles give equal ranges**: $ R_\\theta = R_{90° - \\theta} $. The steeper one goes higher and takes longer.\n- Time to the top is $ T/2 $. Up-time equals down-time.\n- $ R \\propto u^2 $ — double the launch speed and the range **quadruples**.',
    }),
    b('practice_bank', 12, {
      title: 'You solve it',
      intro: 'Eight questions. For each one, first check that launch and landing really are at the same height — if they are not, these formulas do not apply.',
      sections: [
        {
          id: 'p5-ysi',
          title: 'Time, height and range',
          items: [
            num('p5-y1', 'A ball is projected at $ 30 $ m/s at $ 30° $ on level ground. Find its time of flight, maximum height and range. Take $ g = 10 $ m/s².',
              '$ T = 3 $ s, $ H = 11.25 $ m, $ R = 77.9 $ m',
              '$ T = 2(30)(0.5)/10 = 3 $ s. $ H = (30 \\times 0.5)^2/(2 \\times 10) = 225/20 = 11.25 $ m. $ R = 900\\sin 60°/10 = 900(0.866)/10 = 77.9 $ m.'),
            mcq('p5-y2', 'The range of a projectile fired at $ 15° $ is $ 50 $ m. Fired at the same speed at $ 45° $, its range will be:',
              ['$ 25 $ m', '$ 37 $ m', '$ 50 $ m', '$ 100 $ m'], 3,
              '$ R_{15°} = u^2\\sin 30°/g = 0.5u^2/g = 50 $ m, so $ u^2/g = 100 $ m. At $ 45° $, $ R = u^2/g = 100 $ m.'),
            num('p5-y3', 'A projectile has a time of flight of $ 4 $ s and a range of $ 80 $ m. Find its launch speed and angle. Take $ g = 10 $ m/s².',
              '$ u = 28.3 $ m/s at $ 45° $',
              'From $ R = u_x T $: $ u_x = 80/4 = 20 $ m/s. From $ T = 2u_y/g $: $ u_y = 10(4)/2 = 20 $ m/s. So $ u = \\sqrt{400+400} = 28.3 $ m/s and $ \\tan\\theta = 20/20 = 1 $, giving $ \\theta = 45° $.'),
            mcq('p5-y4', 'Two balls are thrown at the same speed, at $ 40° $ and $ 50° $. Comparing them:',
              ['Equal ranges; the $ 50° $ ball reaches a greater height', 'Equal ranges, and equal maximum heights too', 'The $ 40° $ ball has the greater range of the two', 'The $ 50° $ ball has the greater range of the two'], 0,
              '$ 40° $ and $ 50° $ are complementary, so the ranges are equal. The steeper $ 50° $ throw has the larger vertical component, so it goes higher and stays up longer.'),
            num('p5-y5', 'The ceiling of a hall is $ 25 $ m high. What is the maximum horizontal distance a ball thrown at $ 40 $ m/s can travel without hitting the ceiling? Take $ g = 9.8 $ m/s².',
              'About $ 150.5 $ m',
              'The steepest permitted throw just grazes the ceiling: $ 25 = (40\\sin\\theta)^2/(2 \\times 9.8) $, so $ \\sin^2\\theta = 490/1600 = 0.306 $ and $ \\sin\\theta = 0.553 $, giving $ \\theta = 33.6° $ and $ \\cos\\theta = 0.833 $. Then $ R = u^2\\sin 2\\theta/g = 1600(2)(0.553)(0.833)/9.8 = 150.5 $ m.',
              'ncert_exercise'),
            mcq('p5-y6', 'A projectile is fired at $ 60° $ with speed $ u $. Its maximum height is:',
              ['$ u^2/(4g) $', '$ 3u^2/(8g) $', '$ u^2/(2g) $', '$ u^2/g $'], 1,
              '$ H = u^2\\sin^2 60°/(2g) = u^2(3/4)/(2g) = 3u^2/(8g) $.'),
            num('p5-y7', 'A cricketer can throw a ball to a maximum horizontal distance of $ 100 $ m. How high above the ground can the cricketer throw the same ball? Take $ g = 9.8 $ m/s².',
              '$ 50 $ m',
              'Maximum range means $ u^2/g = 100 $ m, so $ u^2 = 980 $ m²/s². Thrown vertically upwards, the height reached is $ u^2/(2g) = 980/19.6 = 50 $ m.',
              'ncert_exercise'),
            num('p5-y8', 'Two projectiles are fired at the same speed $ u = 20 $ m/s, at $ 30° $ and $ 60° $. Find the sum of their maximum heights. Take $ g = 10 $ m/s².',
              '$ 20 $ m',
              '$ H_1 + H_2 = \\dfrac{u^2}{2g}(\\sin^2 30° + \\sin^2 60°) $, and the bracket is $ 0.25 + 0.75 = 1 $ by the Pythagorean identity. So the sum is just $ u^2/2g = 400/20 = 20 $ m. Individually: $ H_{30°} = 5 $ m and $ H_{60°} = 15 $ m, which add to 20 m ✓. The angles have dropped out entirely.'),
          ],
        },
      ],
    }),
    b('text', 13, {
      markdown: 'Three formulas, all about *where the flight begins and ends*. None of them says anything about the **shape** of the path in between — which is the next page, and the reason everyone calls it a parabola.',
    }),
  ],
};

// ── p6 · The Equation of the Path ────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'the-equation-of-the-path',
  title: 'The Equation of the Path',
  subtitle: 'Eliminate time, and the shape appears',
  glossary: [
    { term: 'trajectory', definition: 'The path traced out by a moving object. For a projectile it is a parabola.' },
    { term: 'equation of trajectory', definition: 'A relation between y and x alone, with time eliminated, describing the shape of the path.' },
  ],
  blocks: [
    hero('the-equation-of-the-path'),
    b('curiosity_prompt', 0, {
      prompt: 'Everyone says a projectile follows a parabola. How would you actually *prove* that, rather than being told it?',
      hint: 'A parabola is a relation between y and x. What is missing from that description?',
      reveal: '**Get rid of the time.**\n\nThe two component equations, $ x = (u\\cos\\theta)t $ and $ y = (u\\sin\\theta)t - \\frac{1}{2}gt^2 $, both mention $ t $. So they describe *when* the ball is somewhere — not the shape of where it goes.\n\nA shape is a relation between $ y $ and $ x $ with no $ t $ in it at all. So take the first equation, solve it for $ t $, and substitute into the second. Whatever comes out **is** the shape.\n\nWhat comes out is a quadratic in $ x $, which is the definition of a parabola. So it is not a claim about projectiles — it is a consequence of one motion being uniform and the other uniformly accelerated.',
    }),
    b('step_solver', 1, {
      title: 'Eliminating time',
      problem: 'A projectile is launched from the origin with speed $ u $ at angle $ \\theta $. Derive the equation of its path, $ y $ as a function of $ x $.',
      intro: 'Two equations, one unwanted variable. Standard algebra — and the physics is entirely in reading the answer.',
      steps: [
        st('$ x = (u\\cos\\theta)t \\quad \\Rightarrow \\quad t = \\dfrac{x}{u\\cos\\theta} $',
          'The horizontal equation is the easy one to invert, because it has no $ t^2 $ in it.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the horizontal equation the right one to solve for $ t $?',
              options: [
                'Because it is linear in $ t $, so inverting it is trivial',
                'Because $ x $ is always larger than $ y $',
                'Because the vertical equation has no $ t $ in it',
                'Because the horizontal motion is faster',
              ],
              answer_index: 0,
              feedback_right: 'Right — no acceleration means no $ t^2 $ term, so it rearranges in one step.',
              feedback_wrong: 'With $ a_x = 0 $, the horizontal equation is linear in $ t $ and inverts immediately. The vertical one is quadratic in $ t $, so solving it for $ t $ would drag a square root through everything.',
            },
          }),
        st('$ y = (u\\sin\\theta)\\left(\\dfrac{x}{u\\cos\\theta}\\right) - \\dfrac{1}{2}g\\left(\\dfrac{x}{u\\cos\\theta}\\right)^2 $',
          'Substituting into the vertical equation. Now simplify each term.', {
            check: {
              kind: 'mcq',
              prompt: 'The first term simplifies to:',
              options: ['$ x\\tan\\theta $', '$ x\\sin\\theta $', '$ x\\cos\\theta $', '$ x/\\tan\\theta $'],
              answer_index: 0,
              feedback_right: 'Right — the $ u $ cancels and $ \\sin\\theta/\\cos\\theta = \\tan\\theta $.',
              feedback_wrong: '$ (u\\sin\\theta)\\dfrac{x}{u\\cos\\theta} = x\\dfrac{\\sin\\theta}{\\cos\\theta} = x\\tan\\theta $. The launch speed cancels out of this term entirely.',
            },
          }),
        st('$ y = x\\tan\\theta - \\dfrac{gx^2}{2u^2\\cos^2\\theta} $',
          'This is the equation of trajectory. Look at its structure rather than its details.', {
            why: 'It has the form $ y = ax - bx^2 $, with $ a = \\tan\\theta $ and $ b = g/(2u^2\\cos^2\\theta) $ both **constants** for a given launch. A quadratic in $ x $ with a negative $ x^2 $ coefficient is a downward-opening parabola. **That is the proof** — the path is a parabola because one motion is linear in $ t $ and the other quadratic in $ t $.',
          }),
        st('$ y = x\\tan\\theta\\left(1 - \\dfrac{x}{R}\\right) $ — the compact form',
          'Factorising $ x\\tan\\theta $ out and using $ R = u^2\\sin 2\\theta/g $ gives this version, which is often much faster to use.', {
            check: {
              kind: 'mcq',
              prompt: 'From this form, at which two values of $ x $ is $ y = 0 $?',
              options: ['$ x = 0 $ and $ x = R $', '$ x = 0 $ and $ x = R/2 $', '$ x = R/2 $ and $ x = R $', 'Only $ x = 0 $'],
              answer_index: 0,
              feedback_right: 'Right — the launch point and the landing point, which is exactly what the range means.',
              feedback_wrong: 'A product is zero when either factor is zero: $ x = 0 $ (the launch) or $ 1 - x/R = 0 $, i.e. $ x = R $ (the landing). The compact form has the range built into it.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown at $ 20 $ m/s at $ 45° $. Write the equation of its path with $ g = 10 $ m/s², and find the height of the ball when it has travelled $ 10 $ m horizontally.',
        answer: '$ y = x - x^2/40 $; height $ = 7.5 $ m',
        solution: '$ \\tan 45° = 1 $ and $ \\cos^2 45° = 0.5 $, so the second coefficient is $ 10/(2 \\times 400 \\times 0.5) = 10/400 = 1/40 $. Hence $ y = x - x^2/40 $. At $ x = 10 $ m, $ y = 10 - 100/40 = 10 - 2.5 = 7.5 $ m.',
      },
    }),
    b('image', 2, {
      src: '',
      alt: 'A projectile parabola with the launch point, the landing point at x = R, the vertex at x = R/2 and height H marked, and the tangent at launch drawn at angle theta.',
      aspect_ratio: '16:9',
      figure_key: 'ch3-trajectory-parabola',
      caption: 'The compact form $ y = x\\tan\\theta(1 - x/R) $ has the two roots visible in it: $ x = 0 $ and $ x = R $. The vertex sits exactly halfway between, at $ x = R/2 $.',
    }),
    b('step_solver', 3, {
      title: 'Reading the launch back out of a given trajectory',
      problem: 'The path of a projectile is $ y = 4x - 5x^2 $, in metres. Find its launch angle and launch speed. Take $ g = 10 $ m/s².',
      intro: 'This is the derivation run backwards, and it is a standard exam question. Match the given equation against the general form, coefficient by coefficient.',
      steps: [
        st('General form: $ \\quad y = (\\tan\\theta)x - \\dfrac{g}{2u^2\\cos^2\\theta}x^2 $',
          'Compare the two coefficients with the given $ 4 $ and $ 5 $.', {
            check: {
              kind: 'mcq',
              prompt: 'Matching the $ x $ coefficients gives what?',
              options: ['$ \\tan\\theta = 4 $', '$ \\sin\\theta = 4 $', '$ u\\cos\\theta = 4 $', '$ \\theta = 4° $'],
              answer_index: 0,
              feedback_right: 'Right — the coefficient of $ x $ is always $ \\tan\\theta $.',
              feedback_wrong: 'The linear coefficient in the general form is $ \\tan\\theta $, so $ \\tan\\theta = 4 $. Notice it involves no speed at all — the angle comes free.',
            },
          }),
        st('$ \\tan\\theta = 4 \\quad \\Rightarrow \\quad \\theta = \\tan^{-1}(4) = 76° $, with $ \\cos\\theta = 1/\\sqrt{17} $',
          'From $ \\tan\\theta = 4 $, the triangle has opposite 4 and adjacent 1, so the hypotenuse is $ \\sqrt{17} $ and $ \\cos\\theta = 1/\\sqrt{17} $. Exact values are worth keeping here — the next step squares this.', {
            check: {
              kind: 'fill_blank',
              prompt: 'So what is $ \\cos^2\\theta $, as a fraction with denominator 17? Enter just the numerator.',
              blank_answer: '1',
              feedback_right: 'Yes — $ \\cos^2\\theta = 1/17 $.',
              feedback_wrong: '$ \\cos\\theta = 1/\\sqrt{17} $, so $ \\cos^2\\theta = 1/17 $.',
            },
          }),
        st('$ \\dfrac{g}{2u^2\\cos^2\\theta} = 5 \\quad \\Rightarrow \\quad \\dfrac{10}{2u^2(1/17)} = 5 $',
          'Now match the $ x^2 $ coefficients and put in the $ \\cos^2\\theta $ we just found.', {
            check: {
              kind: 'mcq',
              prompt: 'Solve for $ u^2 $:',
              options: ['$ u^2 = 17 $', '$ u^2 = 34 $', '$ u^2 = 8.5 $', '$ u^2 = 85 $'],
              answer_index: 0,
              feedback_right: 'Right — $ 10(17)/(2u^2) = 5 $ gives $ u^2 = 17 $.',
              feedback_wrong: 'Rearranging: $ \\dfrac{10 \\times 17}{2u^2} = 5 $, so $ 170 = 10u^2 $ and $ u^2 = 17 $.',
            },
          }),
        st('$ u = \\sqrt{17} = 4.12\\ \\text{m/s} $ at $ \\theta = 76° $',
          'A slow, very steep throw — which fits, because the given path rises fast and comes down within about 0.8 m.', {
            why: 'Sanity-check it from the equation itself: $ y = 0 $ when $ x(4 - 5x) = 0 $, so $ R = 0.8 $ m. And $ R = u^2\\sin 2\\theta/g = 17\\sin 152°/10 = 17(0.47)/10 = 0.8 $ m ✓. **Always close the loop like this** — matching coefficients is easy to get subtly wrong, and the range check catches it.',
          }),
      ],
      now_you_try: {
        problem: 'The trajectory of a projectile is $ y = x - x^2/20 $ metres. Find its launch angle, launch speed and range. Take $ g = 10 $ m/s².',
        answer: '$ 45° $, $ u = 14.1 $ m/s, $ R = 20 $ m',
        solution: '$ \\tan\\theta = 1 $, so $ \\theta = 45° $ and $ \\cos^2\\theta = 0.5 $. Then $ g/(2u^2\\cos^2\\theta) = 1/20 $ gives $ 10/(u^2) = 1/20 $, so $ u^2 = 200 $ and $ u = 14.1 $ m/s. The range is where $ y = 0 $: $ x(1 - x/20) = 0 $, so $ R = 20 $ m. Check: $ u^2\\sin 90°/g = 200/10 = 20 $ m ✓.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('The path of a projectile is a parabola because:',
          ['Gravity acts vertically downwards throughout the flight', 'One coordinate is linear in $ t $ and the other quadratic in $ t $', 'The launch angle stays fixed for the whole flight', 'Air resistance is neglected in the calculation'], 1,
          '$ x \\propto t $ and $ y $ contains a $ t^2 $ term, so eliminating $ t $ makes $ y $ quadratic in $ x $ — the definition of a parabola. Gravity acting downwards is why $ y $ is quadratic, but the parabola comes from the *combination* of the two.', 2),
        q('For the trajectory $ y = ax - bx^2 $, the range of the projectile is:',
          ['$ a/b $', '$ b/a $', '$ a/(2b) $', '$ ab $'], 0,
          'Set $ y = 0 $: $ x(a - bx) = 0 $, so $ x = 0 $ or $ x = a/b $. The second root is the range.', 2),
        q('In the trajectory equation $ y = x\\tan\\theta - \\dfrac{gx^2}{2u^2\\cos^2\\theta} $, the coefficient of $ x $ depends on:',
          ['The launch angle only', 'The launch speed only', 'Both the angle and the speed', 'Neither'], 0,
          'The coefficient is $ \\tan\\theta $, with no $ u $ in it. That is why the launch angle can be read straight off a given trajectory equation before anything else is known.', 2),
        q('A projectile\'s trajectory is $ y = 2x - x^2 $. Its maximum height is:',
          ['$ 0.5 $ m', '$ 1 $ m', '$ 2 $ m', '$ 4 $ m'], 1,
          'The vertex of $ y = 2x - x^2 $ is at $ x = 1 $ (halfway between the roots $ x = 0 $ and $ x = 2 $), where $ y = 2 - 1 = 1 $ m.', 2),
        q('In the trajectory equation, the coefficient of $ x^2 $ is negative. Physically this says:',
          ['The launch angle is greater than $ 45° $ in every case', 'The path curves downwards, because gravity acts downwards', 'The range is always less than the maximum height', 'The horizontal velocity decreases with distance'], 1,
          'The $ x^2 $ coefficient is $ -g/(2u^2\\cos^2\\theta) $, and the minus sign is inherited directly from $ a_y = -g $. A negative $ x^2 $ coefficient is what makes a parabola open downwards, so the sign of the coefficient *is* the direction of gravity.', 2),
      ],
    }),
    b('step_solver', 5, {
      title: 'Velocity from a trajectory equation',
      problem: 'A particle moves in the x-y plane with a constant acceleration directed along the negative y-axis. Its path has the form $ y = bx - cx^2 $, where $ b $ and $ c $ are positive constants. Find the velocity of the particle at the origin.',
      intro: 'A pure-letters version of the previous solver. It looks abstract, but every step is a coefficient match you have already done.',
      steps: [
        st('Matching the general form: $ \\quad \\tan\\theta = b \\quad\\text{and}\\quad \\dfrac{g}{2u^2\\cos^2\\theta} = c $',
          'The acceleration is called $ g $ here whatever its physical origin — the algebra does not care.', {
            check: {
              kind: 'mcq',
              prompt: 'From $ \\tan\\theta = b $, what is $ \\cos^2\\theta $?',
              options: ['$ 1/(1 + b^2) $', '$ b^2/(1 + b^2) $', '$ 1 + b^2 $', '$ 1/b^2 $'],
              answer_index: 0,
              feedback_right: 'Right — from $ \\sec^2\\theta = 1 + \\tan^2\\theta $.',
              feedback_wrong: 'Since $ \\sec^2\\theta = 1 + \\tan^2\\theta = 1 + b^2 $, and $ \\cos^2\\theta = 1/\\sec^2\\theta $, we get $ \\cos^2\\theta = 1/(1 + b^2) $. The other expression is $ \\sin^2\\theta $.',
            },
          }),
        st('$ \\dfrac{g(1 + b^2)}{2u^2} = c \\quad \\Rightarrow \\quad u^2 = \\dfrac{g(1 + b^2)}{2c} $',
          'Substituting $ \\cos^2\\theta = 1/(1+b^2) $ and rearranging for $ u^2 $.', {
            check: {
              kind: 'mcq',
              prompt: 'So the speed at the origin is:',
              options: [
                '$ \\sqrt{\\dfrac{g(1+b^2)}{2c}} $',
                '$ \\dfrac{g(1+b^2)}{2c} $',
                '$ \\sqrt{\\dfrac{2c}{g(1+b^2)}} $',
                '$ \\sqrt{\\dfrac{gb^2}{2c}} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — take the square root of $ u^2 $.',
              feedback_wrong: 'The speed is $ u = \\sqrt{u^2} = \\sqrt{g(1+b^2)/(2c)} $. Forgetting the square root leaves you with a quantity that has the units of speed squared.',
            },
          }),
        st('$ u = \\sqrt{\\dfrac{g(1 + b^2)}{2c}} $, directed at $ \\theta = \\tan^{-1}(b) $ to the x-axis',
          'A velocity needs both parts, so the answer is not finished until the direction is stated.', {
            why: 'Check the dimensions, because that is the only check available with no numbers. $ b $ is a slope, so dimensionless; $ c $ has dimensions of $ 1/\\text{length} $ (since $ cx^2 $ must be a length). So $ g/c $ has dimensions $ \\text{LT}^{-2} \\times \\text{L} = \\text{L}^2\\text{T}^{-2} $, and its square root is a speed ✓. This is Chapter 1 earning its keep.',
          }),
      ],
      now_you_try: {
        problem: 'A projectile\'s path is $ y = 3x - 4x^2 $ metres, with $ g = 10 $ m/s². Find its launch speed and angle.',
        answer: '$ u = 3.54 $ m/s at $ 71.6° $',
        solution: 'Here $ b = 3 $ and $ c = 4 $. So $ \\theta = \\tan^{-1}(3) = 71.6° $, and $ u^2 = g(1+b^2)/(2c) = 10(1+9)/8 = 12.5 $, giving $ u = 3.54 $ m/s. Check by the direct route: $ \\cos^2\\theta = 1/10 $, and $ 10/(2u^2 \\times 0.1) = 4 $ gives $ u^2 = 12.5 $ ✓.',
      },
    }),
    b('step_solver', 6, {
      title: 'Where on the path is a given height reached?',
      problem: 'A ball is thrown at $ 20 $ m/s at $ 53° $ from the ground. Using the equation of the path, find the two horizontal distances at which the ball is $ 8 $ m above the ground. Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $, $ \\cos 53° = 0.6 $.',
      intro: 'A height given and a horizontal distance wanted — so this is a trajectory-equation question, not a component-equation one.',
      steps: [
        st('$ \\tan 53° = 4/3 $ and $ \\cos^2 53° = 0.36 $, so $ \\quad y = \\dfrac{4x}{3} - \\dfrac{10x^2}{2(400)(0.36)} = \\dfrac{4x}{3} - \\dfrac{x^2}{28.8} $',
          'Build the trajectory equation for this specific launch first.', {
            check: {
              kind: 'mcq',
              prompt: 'To find where $ y = 8 $ m, what do we do?',
              options: [
                'Set $ y = 8 $ and solve the resulting quadratic in $ x $',
                'Set $ x = 8 $ and evaluate $ y $',
                'Differentiate and set the result to 8',
                'Use $ R = u^2\\sin 2\\theta/g $',
              ],
              answer_index: 0,
              feedback_right: 'Right — and a quadratic gives two roots, which is exactly what "the two distances" means.',
              feedback_wrong: 'Substitute $ y = 8 $ and solve for $ x $. The equation is quadratic in $ x $, so it returns two values — the ball passes 8 m once on the way up and once on the way down.',
            },
          }),
        st('$ 8 = \\dfrac{4x}{3} - \\dfrac{x^2}{28.8} \\quad \\Rightarrow \\quad x^2 - 38.4x + 230.4 = 0 $',
          'Multiplying through by $ 28.8 $ and rearranging into standard form.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The discriminant is $ 38.4^2 - 4(230.4) = 1474.56 - 921.6 $. What is it?',
              blank_answer: '552.96',
              feedback_right: 'Yes — and $ \\sqrt{552.96} = 23.52 $.',
              feedback_wrong: '$ 1474.56 - 921.6 = 552.96 $, whose square root is $ 23.52 $.',
            },
          }),
        st('$ x = \\dfrac{38.4 \\pm 23.52}{2} \\quad \\Rightarrow \\quad x = 7.44\\ \\text{m or}\\ 30.96\\ \\text{m} $',
          'Two roots, both physically real: the ball is 8 m up at 7.44 m out and again at 30.96 m out.', {
            why: 'Check the symmetry, which is free here. The range is $ R = 400\\sin 106°/10 = 38.4 $ m, and the two roots average to $ (7.44 + 30.96)/2 = 19.2 $ m $ = R/2 $ ✓ — the vertex of the parabola. **The two crossings are always symmetric about the highest point**, which is a good way to spot an arithmetic slip.',
          }),
      ],
      now_you_try: {
        problem: 'For a projectile with trajectory $ y = x - x^2/40 $ metres, find the two horizontal distances at which the height is $ 7.5 $ m.',
        answer: '$ x = 10 $ m and $ x = 30 $ m',
        solution: 'Set $ 7.5 = x - x^2/40 $, so $ x^2 - 40x + 300 = 0 $, which factorises as $ (x-10)(x-30) = 0 $. So $ x = 10 $ m and $ x = 30 $ m. The range is 40 m, and the two roots average to 20 m $ = R/2 $ ✓.',
      },
    }),
    b('callout', 7, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ y = x\\tan\\theta - \\dfrac{gx^2}{2u^2\\cos^2\\theta} $ — and the compact form $ y = x\\tan\\theta\\left(1 - \\dfrac{x}{R}\\right) $.\n- **The path is a parabola because the equation is quadratic in $ x $**, and it is quadratic in $ x $ because one motion is uniform and the other uniformly accelerated.\n- For a given trajectory $ y = ax - bx^2 $: the launch angle is $ \\tan^{-1}(a) $, the range is $ a/b $, and the maximum height is at $ x = a/(2b) $.\n- Reading a launch back out of a trajectory: **match the coefficients, then check with the range.**\n- A height is reached at two horizontal distances, **symmetric about $ x = R/2 $**.',
    }),
    b('practice_bank', 8, {
      title: 'You solve it',
      intro: 'Seven questions. Whenever you match coefficients, close the loop with a range check.',
      sections: [
        {
          id: 'p6-ysi',
          title: 'The shape of the path',
          items: [
            num('p6-y1', 'A projectile\'s path is $ y = 8x - 4x^2 $ metres. Find its range and maximum height.',
              '$ R = 2 $ m, $ H = 4 $ m',
              'Setting $ y = 0 $: $ x(8 - 4x) = 0 $, so $ R = 2 $ m. The vertex is at $ x = 1 $ m (halfway), where $ y = 8 - 4 = 4 $ m.'),
            mcq('p6-y2', 'A projectile has trajectory $ y = x\\tan\\theta(1 - x/R) $. At $ x = R/2 $, the value of $ y $ is:',
              ['$ R\\tan\\theta/2 $', '$ R\\tan\\theta/4 $', '$ R\\tan\\theta $', 'Zero'], 1,
              'Substituting: $ y = (R/2)\\tan\\theta(1 - 1/2) = (R/2)\\tan\\theta(1/2) = R\\tan\\theta/4 $. This is the maximum height, since $ x = R/2 $ is the vertex.'),
            num('p6-y3', 'A ball is thrown at $ 10 $ m/s at $ 45° $. Write the equation of its path. Take $ g = 10 $ m/s².',
              '$ y = x - x^2/10 $',
              '$ \\tan 45° = 1 $ and $ \\cos^2 45° = 0.5 $. The $ x^2 $ coefficient is $ 10/(2 \\times 100 \\times 0.5) = 10/100 = 1/10 $. So $ y = x - x^2/10 $, and the range is 10 m.'),
            mcq('p6-y4', 'For the path $ y = 6x - 3x^2 $, the launch angle is:',
              ['$ \\tan^{-1}(3) $', '$ \\tan^{-1}(6) $', '$ \\tan^{-1}(2) $', '$ 45° $'], 1,
              'The coefficient of $ x $ is $ \\tan\\theta $, so $ \\tan\\theta = 6 $ and $ \\theta = \\tan^{-1}(6) \\approx 80.5° $. The $ x^2 $ coefficient carries the speed, not the angle.'),
            num('p6-y5', 'A projectile has trajectory $ y = 2x - x^2/8 $ metres, with $ g = 10 $ m/s². Find its launch speed.',
              '$ u = 14.1 $ m/s',
              '$ \\tan\\theta = 2 $, so $ \\cos^2\\theta = 1/(1+4) = 0.2 $. Then $ g/(2u^2\\cos^2\\theta) = 1/8 $ gives $ 10/(2u^2 \\times 0.2) = 1/8 $, so $ 10/(0.4u^2) = 1/8 $ and $ u^2 = 200 $, giving $ u = 14.1 $ m/s. Range check: $ a/b = 2/(1/8) = 16 $ m, and $ u^2\\sin 2\\theta/g $ with $ \\sin\\theta = 0.894 $, $ \\cos\\theta = 0.447 $ gives $ 200(2)(0.894)(0.447)/10 = 16 $ m ✓.'),
            mcq('p6-y6', 'The trajectory of a projectile launched from the ground can never be:',
              ['A downward-opening parabola in the vertical plane', 'A straight line at an angle to the horizontal', 'Symmetric about its own highest point', 'Quadratic in $ x $ for the whole flight'], 1,
              'A non-zero horizontal velocity plus a vertical acceleration always produces a curve. The path is straight only if the launch is exactly vertical, when there is no horizontal motion to plot against.'),
            num('p6-y7', 'A projectile is launched so that its path is $ y = 4x - x^2/5 $ metres. Find the two horizontal distances at which its height is $ 15 $ m.',
              '$ x = 5 $ m and $ x = 15 $ m',
              'Set $ 15 = 4x - x^2/5 $, so $ x^2 - 20x + 75 = 0 $, which factorises as $ (x-5)(x-15) = 0 $. The range is $ a/b = 4 \\times 5 = 20 $ m, and the two roots average to 10 m $ = R/2 $ ✓.'),
          ],
        },
      ],
    }),
    b('text', 9, {
      markdown: 'Every result so far has quietly assumed the ball starts and finishes at the same height. Break that assumption and things get more interesting — starting with the page that shows the $ 45° $ rule failing.',
    }),
  ],
};

withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p4, p5, p6]);
}).then(() => { console.log('\nWave 1b done — p4–p6'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
