'use strict';
/**
 * Class 11 Physics · Chapter 3 "Motion in Two Dimensions" — pages 7–9.
 * Wave 1c: projection from a height, the recurring problem families, and the
 * inclined-plane projectile.
 *
 * p7 is where plan conflict C1 gets paid off. p5 taught R_max = u²/g at 45°
 * WITH its precondition attached; this page makes the failure concrete by
 * showing that from a height the optimum angle is genuinely less than 45°.
 *
 * p9 SCHEMA NOTE: `tier` is a BLOCK-level field (BaseBlockSchema), not a
 * page-level one, so the competitive marking is applied to every block via the
 * `competitive()` helper at the bottom rather than set once on the page.
 *
 * SYMBOL NOTE: the reference book uses α for the angle of projection and β for
 * the incline. The chapter's fixed symbol set (see _book_ch3.js) uses θ for the
 * angle of projection throughout, so every p9 formula is transcribed with θ in
 * place of α. β keeps its meaning.
 *
 * Run: node scripts/physics11-book/build_ch3_projectile2.js
 */
const { b, q, st, mcq, hero, num, ensureChapter, upsertPages, withDb } = require('./_book_ch3');

// ── p7 · Thrown From a Height ────────────────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'thrown-from-a-height',
  title: 'Thrown From a Height',
  subtitle: 'Where the 45° rule visibly stops working',
  glossary: [
    { term: 'horizontal projection', definition: 'Projection with the initial velocity horizontal, i.e. θ = 0, so that u_y = 0 and the vertical motion starts from rest.' },
  ],
  blocks: [
    hero('thrown-from-a-height'),
    b('curiosity_prompt', 0, {
      prompt: 'You are standing on a cliff, throwing stones as far out to sea as you can. Should you still throw at 45°?',
      hint: 'What did the range formula assume about where the flight ends?',
      reveal: '**No — and the higher the cliff, the shallower your best throw becomes.**\n\nEvery formula on page 5 assumed the stone lands at the height it left from. On a cliff it does not: it keeps falling past the launch level, so it stays in the air longer than the formula allows for.\n\nThat extra time is free. And the way to make the most of free time is to have a **large horizontal speed** — which means throwing flatter than $ 45° $.\n\nAt the limit, from a very tall cliff, the best angle tends towards $ 0° $: just hurl it straight out, because it will be in the air for ages anyway. This page starts with that limiting case, which is also the easiest one.',
    }),
    b('text', 1, {
      markdown: 'Horizontal projection is the case $ \\theta = 0 $, so\n\n$ u_x = u \\qquad u_y = 0 \\qquad a_x = 0 \\qquad a_y = -g $\n\nWith $ u_y = 0 $, the vertical column is a **plain drop from rest** — which is why the coin on page 1 was the same problem as this one. Only the height matters for the time.',
    }),
    b('step_solver', 2, {
      title: 'Fired horizontally from a hill',
      problem: 'A projectile is fired horizontally at $ 98 $ m/s from the top of a hill $ 490 $ m high. Find (a) the time taken to reach the ground, (b) the distance from the foot of the hill where it lands, and (c) the velocity with which it hits the ground. Take $ g = 9.8 $ m/s².',
      intro: 'A useful convention here: take the downward direction as positive for the vertical axis, since everything vertical goes downwards. Then no minus signs appear at all.',
      steps: [
        st('Set-up: $ \\quad u_x = 98\\ \\text{m/s}, \\quad a_x = 0, \\quad u_y = 0, \\quad a_y = +g $ (downwards positive)',
          'Fired horizontally, so there is no initial vertical velocity. That is the one fact this whole solution hangs on.', {
            check: {
              kind: 'mcq',
              prompt: 'Which equation gives the time of fall?',
              options: [
                '$ s_y = u_y t + \\frac{1}{2}a_y t^2 $ with $ u_y = 0 $ and $ s_y = 490 $',
                '$ s_x = u_x t $ with $ s_x = 490 $',
                '$ R = u^2\\sin 2\\theta/g $',
                '$ v_y^2 = u_y^2 + 2a_y s_y $',
              ],
              answer_index: 0,
              feedback_right: 'Right — the vertical axis, with the 490 m as $ s_y $.',
              feedback_wrong: 'The 490 m is a *vertical* distance, so it belongs in the vertical equation. The range formula does not apply at all here — the launch and landing points are not at the same height.',
            },
          }),
        st('$ 490 = 0 + \\tfrac{1}{2}(9.8)t^2 \\quad \\Rightarrow \\quad t^2 = 100 \\quad \\Rightarrow \\quad t = 10\\ \\text{s} $',
          'The 98 m/s never entered. Fire it at twice the speed and it still takes 10 s.', {
            check: {
              kind: 'fill_blank',
              prompt: '(b) Now the horizontal distance, $ s_x = u_x t $. Give the answer in metres.',
              blank_answer: '980',
              feedback_right: 'Yes — $ 98 \\times 10 = 980 $ m.',
              feedback_wrong: '$ s_x = 98 \\times 10 = 980 $ m, since there is no horizontal acceleration.',
            },
          }),
        st('(c) $ v_x = 98\\ \\text{m/s} $ (unchanged) and $ v_y = 0 + (9.8)(10) = 98\\ \\text{m/s} $',
          'The two components have come out equal — which is a coincidence of these particular numbers, but a very informative one.', {
            check: {
              kind: 'mcq',
              prompt: 'So what angle does the impact velocity make with the horizontal?',
              options: ['$ 30° $', '$ 45° $', '$ 60° $', '$ 90° $'],
              answer_index: 1,
              feedback_right: 'Right — equal components means $ \\tan\\beta = 1 $, so $ 45° $ below the horizontal.',
              feedback_wrong: '$ \\tan\\beta = v_y/v_x = 98/98 = 1 $, so $ \\beta = 45° $ below the horizontal. **Equal components always mean $ 45° $**, and that works in reverse too.',
            },
          }),
        st('$ v = \\sqrt{98^2 + 98^2} = 98\\sqrt{2} \\approx 138.6\\ \\text{m/s} $ at $ 45° $ below the horizontal',
          'Landing at 138.6 m/s, well above the 98 m/s it was fired at — the fall added the rest.', {
            why: 'Store the reverse reading of step (c): **"it lands at $ 45° $" is another way of saying $ v_y = v_x $.** That is a standard exam hook. If a question tells you the impact angle is $ 45° $, it has just told you $ |v_y| $ equals $ v_x $, which is usually the missing equation.',
          }),
      ],
      now_you_try: {
        problem: 'A hiker stands on the edge of a cliff $ 490 $ m above the ground and throws a stone horizontally with an initial speed of $ 15 $ m/s. Neglecting air resistance, find the time taken by the stone to reach the ground and the speed with which it hits the ground. Take $ g = 9.8 $ m/s².',
        answer: '$ 10 $ s and about $ 99 $ m/s',
        solution: 'Vertically: $ 490 = \\frac{1}{2}(9.8)t^2 $, so $ t = 10 $ s — the same 10 s as the projectile above, because the height is the same. At impact $ v_x = 15 $ m/s and $ v_y = 9.8(10) = 98 $ m/s, so $ v = \\sqrt{225 + 9604} = \\sqrt{9829} = 99 $ m/s. Note that at this launch speed the impact is almost vertical.',
      },
    }),
    b('inline_quiz', 3, {
      pass_threshold: 0.6,
      questions: [
        q('A body thrown horizontally from a tower strikes the ground at $ 45° $ to the horizontal. At impact:',
          ['Its vertical and horizontal velocity components are equal in magnitude', 'Its vertical velocity is momentarily zero at that instant', 'Its speed is exactly equal to its launch speed', 'Its horizontal velocity has doubled since the launch instant'], 0,
          '$ 45° $ means $ \\tan\\beta = v_y/v_x = 1 $, so the two components are equal in magnitude. This is the standard way an exam hands you a hidden equation.', 2),
        q('Two stones are thrown horizontally from the same height with different speeds. Comparing the times they take to land:',
          ['The faster stone takes longer', 'The slower stone takes longer', 'The times are equal', 'It depends on the height'], 2,
          'Both have $ u_y = 0 $ and fall the same height, so both vertical columns are identical and the times match. The horizontal speed only affects *where* they land.', 1),
        q('For a projectile launched from a height above the landing level, the angle giving maximum range is:',
          ['Exactly $ 45° $ as usual', 'Less than $ 45° $', 'Greater than $ 45° $', 'Always $ 0° $'], 1,
          'Falling below the launch level gives extra flight time for free, and the way to exploit extra time is a larger horizontal speed — so the best angle is shallower than $ 45° $. The taller the launch point, the shallower it gets.', 3),
      ],
    }),
    b('step_solver', 4, {
      title: 'Working backwards from the impact angle',
      problem: 'A body is thrown horizontally from the top of a tower and strikes the ground after $ 3 $ seconds at an angle of $ 45° $ with the horizontal. Find the height of the tower and the speed with which the body was projected. Take $ g = 9.8 $ m/s².',
      intro: 'Neither the height nor the launch speed is given. The $ 45° $ is what replaces them — so decode it first.',
      steps: [
        st('$ u_y = 0 $, so $ \\quad v_y = g t = 9.8(3) = 29.4\\ \\text{m/s} $ at impact',
          'The vertical column can be worked out completely from the time alone, because it starts from rest.', {
            check: {
              kind: 'mcq',
              prompt: 'What does "strikes the ground at $ 45° $" tell us?',
              options: [
                'That $ v_x = |v_y| = 29.4 $ m/s at impact',
                'That the launch angle was $ 45° $',
                'That the height equals the horizontal distance',
                'That the speed at impact is $ 45 $ m/s',
              ],
              answer_index: 0,
              feedback_right: 'Right — and since $ v_x $ never changes, that is also the launch speed.',
              feedback_wrong: '$ \\tan 45° = v_y/v_x = 1 $, so $ v_x = |v_y| = 29.4 $ m/s. The launch angle was $ 0° $ — it was thrown horizontally, which is given.',
            },
          }),
        st('$ v_x = 29.4\\ \\text{m/s} $, and $ v_x $ never changes, so $ \\quad u = 29.4\\ \\text{m/s} $',
          'The projection speed, obtained without ever knowing the height. This is the whole trick of the problem.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the height: $ h = \\frac{1}{2}gt^2 $ with $ t = 3 $ s. Give the answer in metres to one decimal place.',
              blank_answer: '44.1',
              feedback_right: 'Yes — $ \\frac{1}{2}(9.8)(9) = 44.1 $ m.',
              feedback_wrong: '$ h = \\frac{1}{2}(9.8)(3)^2 = \\frac{1}{2}(9.8)(9) = 44.1 $ m.',
            },
          }),
        st('$ h = 44.1\\ \\text{m} $ and $ u = 29.4\\ \\text{m/s} $',
          'Both unknowns, from a time and an angle.', {
            why: 'Notice the *order* the solution had to go in. The height could not be found first, because nothing connected it to the given data directly — but the time gave $ v_y $, the angle turned $ v_y $ into $ v_x $, and only then was the height a separate one-line calculation. **When two unknowns are given no direct route, look for the quantity that is unchanged** — here $ v_x $ — because it links launch to impact.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown horizontally from a cliff and hits the ground $ 4 $ s later at $ 60° $ to the horizontal. Find the launch speed and the height of the cliff. Take $ g = 10 $ m/s².',
        answer: '$ u = 23.1 $ m/s, height $ = 80 $ m',
        solution: 'At impact $ v_y = 10(4) = 40 $ m/s. From $ \\tan 60° = v_y/v_x $: $ v_x = 40/\\tan 60° = 40/1.732 = 23.1 $ m/s, which is the launch speed. The height is $ \\frac{1}{2}(10)(16) = 80 $ m.',
      },
    }),
    b('image', 5, {
      src: '',
      alt: 'Three trajectories launched from the top of a tower at 25, 35 and 45 degrees, showing that the 35-degree launch lands furthest when the landing point is well below the launch point.',
      aspect_ratio: '16:9',
      figure_key: 'ch3-height-optimum-angle',
      caption: 'Three launches at the same speed from the same tower. On level ground the $ 45° $ one would win. Launched from a height, it does not.',
    }),
    b('step_solver', 6, {
      title: 'Launched at an angle, from a tower',
      problem: 'A ball is thrown from the top of a $ 25 $ m tower at $ 20\\sqrt{2} $ m/s at $ 45° $ above the horizontal. Find the time it takes to strike the ground and the horizontal distance from the foot of the tower where it lands. Take $ g = 10 $ m/s².',
      intro: 'Now $ u_y $ is not zero, so the vertical equation is a genuine quadratic — and the sign convention has to be handled with care.',
      steps: [
        st('$ u_x = 20\\sqrt{2}\\cos 45° = 20\\ \\text{m/s}, \\qquad u_y = 20\\sqrt{2}\\sin 45° = 20\\ \\text{m/s} $',
          'Take **upwards as positive**. The ball ends up 25 m *below* the launch point, so its vertical displacement is $ s_y = -25 $ m.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is $ s_y = -25 $ m rather than $ +25 $ m?',
              options: [
                'Because displacement is measured from the launch point, and the ground is below it',
                'Because the ball is thrown upwards',
                'Because the tower is 25 m tall',
                'Because $ g $ is negative',
              ],
              answer_index: 0,
              feedback_right: 'Right — displacement is always measured from where the motion started.',
              feedback_wrong: 'Displacement is measured from the launch point. The ball finishes 25 m below where it began, and we chose upwards as positive, so $ s_y = -25 $ m. Using $ +25 $ here is the single most common error on this type of question.',
            },
          }),
        st('$ -25 = 20t - \\tfrac{1}{2}(10)t^2 \\quad \\Rightarrow \\quad 5t^2 - 20t - 25 = 0 \\quad \\Rightarrow \\quad t^2 - 4t - 5 = 0 $',
          'Substituting into $ s_y = u_y t + \\frac{1}{2}a_y t^2 $ and tidying up by dividing through by 5.', {
            check: {
              kind: 'mcq',
              prompt: 'Factorise $ t^2 - 4t - 5 = 0 $. What are the roots?',
              options: ['$ t = 5 $ and $ t = -1 $', '$ t = -5 $ and $ t = 1 $', '$ t = 5 $ and $ t = 1 $', '$ t = 2 $ and $ t = -2.5 $'],
              answer_index: 0,
              feedback_right: 'Right — $ (t-5)(t+1) = 0 $.',
              feedback_wrong: '$ (t-5)(t+1) = t^2 - 4t - 5 $, so the roots are $ t = 5 $ and $ t = -1 $.',
            },
          }),
        st('$ t = 5\\ \\text{s} $ (rejecting $ t = -1 $ s)',
          'The negative root is discarded — it refers to a time before the throw happened.', {
            why: 'The negative root is not meaningless, though. It is where the ball *would have been* at ground level if it had been following the same parabola before launch. The algebra knows the whole parabola; only we know when the throw started.',
          }),
        st('$ s_x = u_x t = 20 \\times 5 = 100\\ \\text{m} $',
          'A hundred metres from the foot of the tower.', {
            check: {
              kind: 'fill_blank',
              prompt: 'For comparison, what would the range have been on level ground? Use $ R = u^2\\sin 2\\theta/g $ with $ u^2 = 800 $, in metres.',
              blank_answer: '80',
              feedback_right: 'Yes — $ 800(1)/10 = 80 $ m, so the tower added 20 m.',
              feedback_wrong: '$ R = 800\\sin 90°/10 = 80 $ m. The tower gave the ball an extra 2 s of flight, which bought an extra 20 m — and that free time is exactly why a shallower angle wins from a height.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown from the top of a $ 20 $ m tower at $ 20 $ m/s at $ 30° $ above the horizontal. Find the time to strike the ground and the horizontal distance covered. Take $ g = 10 $ m/s².',
        answer: '$ t = 3.24 $ s, distance $ = 56.1 $ m',
        solution: '$ u_x = 20\\cos 30° = 17.3 $ m/s and $ u_y = 20\\sin 30° = 10 $ m/s. Then $ -20 = 10t - 5t^2 $, so $ 5t^2 - 10t - 20 = 0 $ and $ t^2 - 2t - 4 = 0 $, giving $ t = (2 + \\sqrt{20})/2 = 3.24 $ s. The horizontal distance is $ 17.3 \\times 3.24 = 56.1 $ m.',
      },
    }),
    b('step_solver', 7, {
      title: 'Showing that 45° really does lose from a height',
      problem: 'A ball is thrown at $ 20 $ m/s from the top of a $ 20 $ m tower. Compare the horizontal distance reached at $ 45° $ with the distance reached at $ 30° $. Take $ g = 10 $ m/s².',
      intro: 'Page 5 said $ 45° $ is best *on level ground*. This is the direct test of what happens when that condition is broken.',
      steps: [
        st('At $ 45° $: $ \\quad u_x = u_y = 14.14\\ \\text{m/s} $, and $ -20 = 14.14t - 5t^2 $',
          'Set up the quadratic for the steeper launch first.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Solve $ 5t^2 - 14.14t - 20 = 0 $. Give the positive root in seconds to two decimal places.',
              blank_answer: '3.86',
              feedback_right: 'Yes — about 3.86 s.',
              feedback_wrong: 'The discriminant is $ 14.14^2 + 4(5)(20) = 200 + 400 = 600 $, so $ t = (14.14 + 24.49)/10 = 3.86 $ s.',
            },
          }),
        st('$ t_{45°} = 3.86\\ \\text{s} \\quad \\Rightarrow \\quad s_x = 14.14 \\times 3.86 = 54.6\\ \\text{m} $',
          'Now repeat for $ 30° $, where the horizontal speed is larger but the flight is shorter.', {
            check: {
              kind: 'mcq',
              prompt: 'At $ 30° $, $ u_x = 17.32 $ m/s and $ u_y = 10 $ m/s. Which way do the two effects pull?',
              options: [
                'Larger $ u_x $ helps, shorter flight time hurts',
                'Both help, so $ 30° $ must win',
                'Both hurt, so $ 45° $ must win',
                'Neither changes, so the distances are equal',
              ],
              answer_index: 0,
              feedback_right: 'Right — which is why it takes an actual calculation to settle it.',
              feedback_wrong: 'A shallower launch gives a bigger horizontal speed (good) but a smaller $ u_y $ and so a shorter flight (bad). The two compete, so the winner has to be computed rather than guessed.',
            },
          }),
        st('At $ 30° $: $ \\quad -20 = 10t - 5t^2 \\Rightarrow t^2 - 2t - 4 = 0 \\Rightarrow t = 3.24\\ \\text{s} $, so $ s_x = 17.32 \\times 3.24 = 56.1\\ \\text{m} $',
          'The $ 30° $ throw wins: **56.1 m against 54.6 m.**', {
            why: 'And that settles page 5\'s warning with a number. On level ground $ 45° $ would beat $ 30° $ by a clear margin (40 m against 34.6 m). Add a 20 m tower and the ordering **reverses**. The optimum here is around $ 36° $; make the tower taller and it drops further towards zero.\n\nThis is the honest reason to attach the precondition to a formula rather than just memorising the formula: the formula is not wrong, it is answering a different question.',
          }),
      ],
      now_you_try: {
        problem: 'Would the ordering also reverse for a $ 1 $ m high launch instead of $ 20 $ m? Reason it out rather than calculating in full.',
        answer: 'No — at 1 m the $ 45° $ launch still wins',
        solution: 'The advantage of a shallow throw comes from the extra time gained by falling *below* the launch level. From only 1 m, that extra time is tiny — a fraction of the roughly 4 s flight — so it barely shifts the balance. The optimum angle drops slightly below $ 45° $ (to about $ 44° $), but $ 45° $ still beats $ 30° $ comfortably. **The correction scales with the launch height compared to $ u^2/g $**, so it only matters when the launch height is a decent fraction of the range.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A ball is thrown from a tower at an angle above the horizontal. The vertical displacement at landing is:',
          ['Positive, equal to the height of the tower', 'Negative, equal in magnitude to the tower height', 'Zero, since it returns to launch level', 'Equal to the maximum height it reached'], 1,
          'With upwards positive, the ball finishes below where it started, so $ s_y = -h $. Using $ +h $ gives a quadratic with no real positive root or a badly wrong time — it is the classic sign error on this page.', 2),
        q('For a projectile thrown from a height, the equation $ T = 2u\\sin\\theta/g $:',
          ['Still gives the total flight time', 'Gives only the time to return to the launch height', 'Gives the time to reach the highest point', 'Is valid if $ \\theta > 45° $'], 1,
          'That formula solves $ s_y = 0 $, which is the return to *launch* level. From a height the ball then keeps falling, so the true flight time is longer and must come from the full quadratic.', 3),
        q('A stone is thrown horizontally at $ 10 $ m/s from a $ 45 $ m high cliff, $ g = 10 $ m/s². Its speed on landing is:',
          ['$ 10 $ m/s', '$ 30 $ m/s', '$ 31.6 $ m/s', '$ 40 $ m/s'], 2,
          'Time: $ 45 = \\frac{1}{2}(10)t^2 $ gives $ t = 3 $ s. Then $ v_y = 30 $ m/s and $ v_x = 10 $ m/s, so $ v = \\sqrt{100 + 900} = \\sqrt{1000} = 31.6 $ m/s.', 2),
        q('Increasing the launch height of a projectile, at fixed launch speed, changes the optimum launch angle:',
          ['Not at all', 'Downwards, towards $ 0° $', 'Upwards, towards $ 90° $', 'Upwards, to exactly $ 60° $'], 1,
          'Extra height means extra flight time regardless of angle, and extra time is best exploited by a bigger horizontal speed. So the optimum shifts to shallower angles, approaching $ 0° $ for a very tall launch.', 3),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Horizontal projection is $ \\theta = 0 $:** $ u_y = 0 $, so the vertical motion is a plain drop and the time depends only on the height.\n- Landing **below** the launch level means $ s_y $ is negative. Write it with the minus sign and solve the quadratic.\n- **"Lands at $ 45° $" means $ |v_y| = v_x $.** That is usually the equation a question is secretly handing you.\n- $ T = 2u\\sin\\theta/g $, $ H $ and $ R $ **do not apply** when launch and landing are at different heights.\n- From a height, the best angle is **less than $ 45° $**, and gets shallower the higher you go.\n- Reject negative time roots — but understand what they mean before you do.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Eight questions. On every one, decide first whether the launch and landing are at the same height — because that decides whether you may use a formula or must solve a quadratic.',
      sections: [
        {
          id: 'p7-ysi',
          title: 'Launched from a height',
          items: [
            num('p7-y1', 'A ball is thrown horizontally at $ 20 $ m/s from a $ 80 $ m high cliff. Find (a) the time of flight, (b) the horizontal distance and (c) the impact speed. Take $ g = 10 $ m/s².',
              '(a) $ 4 $ s  (b) $ 80 $ m  (c) $ 44.7 $ m/s',
              '(a) $ 80 = \\frac{1}{2}(10)t^2 $, so $ t = 4 $ s. (b) $ s_x = 20(4) = 80 $ m. (c) $ v_y = 40 $ m/s, $ v_x = 20 $ m/s, so $ v = \\sqrt{400+1600} = \\sqrt{2000} = 44.7 $ m/s.'),
            mcq('p7-y2', 'A body thrown horizontally from a height lands with its velocity at $ 45° $ to the horizontal. This means the height of fall equals:',
              ['The horizontal distance travelled', 'Half the horizontal distance travelled', 'Twice the horizontal distance travelled', 'The launch speed multiplied by the time'], 1,
              'At $ 45° $, $ v_y = v_x = u $, and $ v_y = gt $ gives $ t = u/g $. The height is $ \\frac{1}{2}gt^2 = u^2/(2g) $, while the horizontal distance is $ ut = u^2/g $. So the height is half the horizontal distance.'),
            num('p7-y3', 'A stone is thrown horizontally from a tower and lands $ 40 $ m away after $ 4 $ s. Find the height of the tower and the launch speed. Take $ g = 10 $ m/s².',
              'Height $ = 80 $ m, $ u = 10 $ m/s',
              '$ u = 40/4 = 10 $ m/s from the horizontal column. Height $ = \\frac{1}{2}(10)(16) = 80 $ m from the vertical column.'),
            mcq('p7-y4', 'A ball thrown at $ 45° $ from the top of a tall building, compared with one thrown at $ 30° $ at the same speed, lands:',
              ['Further away, exactly as it would on level ground with no tower', 'Nearer, because the shallower throw exploits the extra fall time', 'At exactly the same distance from the base of the building', 'Nearer only if the building is under $ 10 $ m tall'], 1,
              'From a height the projectile falls below the launch level, gaining flight time whatever the angle. A shallower throw has more horizontal speed to spend on that extra time, so it goes further — reversing the level-ground ordering.'),
            num('p7-y5', 'A ball is thrown at $ 25 $ m/s at $ 37° $ from a $ 15 $ m high roof. Find the time to hit the ground. Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
              '$ t = 3.79 $ s',
              '$ u_y = 15 $ m/s, and $ -15 = 15t - 5t^2 $, so $ 5t^2 - 15t - 15 = 0 $ and $ t^2 - 3t - 3 = 0 $. Then $ t = (3 + \\sqrt{21})/2 = (3 + 4.58)/2 = 3.79 $ s.'),
            mcq('p7-y6', 'A stone dropped from a height $ h $ and one thrown horizontally from the same height:',
              ['Land at the same time but different places', 'Land at the same place at the same time', 'Land at different times', 'Land at the same place at different times'], 0,
              'Both have $ u_y = 0 $ and fall $ h $, so the times match. The thrown one also travels horizontally, so it lands further out. This is the two-coin experiment from page 1.'),
            num('p7-y7', 'A projectile is thrown horizontally from a height of $ 20 $ m and lands $ 30 $ m away. Find its launch speed and its impact angle. Take $ g = 10 $ m/s².',
              '$ u = 15 $ m/s, impact at $ 53.1° $ below the horizontal',
              'Time: $ 20 = \\frac{1}{2}(10)t^2 $ gives $ t = 2 $ s. So $ u = 30/2 = 15 $ m/s. At impact $ v_y = 10(2) = 20 $ m/s, so $ \\tan\\beta = 20/15 = 1.33 $ and $ \\beta = 53.1° $ below the horizontal.'),
            num('p7-y8', 'A ball is thrown vertically **downwards** at $ 5 $ m/s from a $ 40 $ m tower. How long does it take to reach the ground? Take $ g = 10 $ m/s².',
              '$ t = 2.36 $ s',
              'Taking downwards as positive: $ 40 = 5t + 5t^2 $, so $ t^2 + t - 8 = 0 $ and $ t = (-1 + \\sqrt{33})/2 = (-1 + 5.745)/2 = 2.37 $ s. A downward throw is not a projectile at all — there is no horizontal motion — but the sign discipline is identical.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'Those are the standard set-ups. But exam projectile questions rarely say "find the range" — they ask something that *looks* new. The next page collects the disguises.',
    }),
  ],
};

// ── p8 · Projectile Problems That Look Different ─────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'projectile-problems-that-look-different',
  title: 'Projectile Problems That Look Different',
  subtitle: 'Four disguises, and how to see through each one',
  glossary: [
    { term: 'monkey and hunter', definition: 'The classic result that a projectile aimed directly at a target will hit it if the target begins to fall freely at the instant of firing.' },
  ],
  blocks: [
    hero('projectile-problems-that-look-different'),
    b('curiosity_prompt', 0, {
      prompt: 'In projectile motion, is the velocity ever perpendicular to the acceleration — always, never, once, or twice?',
      hint: 'The acceleration points straight down and never moves. When is the velocity horizontal?',
      reveal: '**Exactly once.**\n\nThe acceleration is $ g $ downwards for the whole flight, fixed. So "perpendicular" means the velocity is exactly horizontal — which happens at precisely one instant, the top of the path.\n\nBefore that the ball is rising, so $ v_y > 0 $ and the angle is obtuse. After it, $ v_y < 0 $ and the angle is acute. It passes through $ 90° $ once, on the way through.\n\nOne exception worth naming: a ball thrown **exactly vertically** never has a horizontal velocity, so for it the answer is *never*. That is the case where the projectile has collapsed into a one-dimensional problem.',
    }),
    b('heading', 1, {
      text: 'Disguise 1 — two times at the same height',
      level: 2,
      objective: 'Use t₁ + t₂ = T to short-circuit a quadratic.',
    }),
    b('step_solver', 2, {
      title: 'Why there are always two times, and what they add up to',
      problem: 'Show that a projectile is at a given height $ y $ at two different times, and that the sum of those two times equals the time of flight.',
      intro: 'The algebra is three lines. The result it produces will save you a quadratic in half a dozen exam questions.',
      steps: [
        st('$ y = (u\\sin\\theta)t - \\tfrac{1}{2}gt^2 \\quad \\Rightarrow \\quad \\tfrac{1}{2}gt^2 - (u\\sin\\theta)t + y = 0 $',
          'Rearranged into standard quadratic form, with $ t $ as the unknown and $ y $ as a given constant.', {
            check: {
              kind: 'mcq',
              prompt: 'A quadratic in $ t $ has two roots. What do they mean physically here?',
              options: [
                'The two instants at which the projectile is at height $ y $ — once rising, once falling',
                'Two different projectiles',
                'One is always negative and must be discarded',
                'The launch time and the landing time',
              ],
              answer_index: 0,
              feedback_right: 'Right — and both are genuinely physical, unlike the negative roots on page 7.',
              feedback_wrong: 'Both roots are real and positive (as long as $ y $ is below the maximum height). The projectile passes through height $ y $ twice: on the way up and on the way down.',
            },
          }),
        st('Sum of roots $ = -\\dfrac{b}{a} = \\dfrac{u\\sin\\theta}{\\tfrac{1}{2}g} = \\dfrac{2u\\sin\\theta}{g} $',
          'Using the sum-of-roots relation from Chapter 0 rather than solving for each root — much faster, and the point of the exercise.', {
            check: {
              kind: 'mcq',
              prompt: 'And $ 2u\\sin\\theta/g $ is:',
              options: ['The time of flight $ T $', 'The time to the top', 'The range', 'The maximum height'],
              answer_index: 0,
              feedback_right: 'Right — so $ t_1 + t_2 = T $, whatever height was chosen.',
              feedback_wrong: 'That expression is the time of flight $ T $ from page 5. So the two times at any height always add up to the total flight time.',
            },
          }),
        st('$ t_1 + t_2 = T = \\dfrac{2u\\sin\\theta}{g} $',
          'True for every height, not just one special one.', {
            why: 'The reason is symmetry. The parabola is symmetric about the vertex at $ t = T/2 $, so the two crossings sit at $ T/2 - \\delta $ and $ T/2 + \\delta $, and their sum is $ T $ no matter what $ \\delta $ is.\n\n**What it buys you:** if a question gives you one of the two times, you get the other by subtraction. No quadratic, no discriminant.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown at $ 30 $ m/s at $ 53° $. It passes a height of $ 20 $ m on the way up at $ t = 1 $ s. At what time does it pass $ 20 $ m again on the way down? Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $.',
        answer: '$ t = 3.8 $ s',
        solution: '$ T = 2(30)(0.8)/10 = 4.8 $ s. Since $ t_1 + t_2 = T $, the second time is $ 4.8 - 1 = 3.8 $ s. Solving the quadratic would give the same answer with five times the work.',
      },
    }),
    b('heading', 3, {
      text: 'Disguise 2 — velocity at right angles to the launch',
      level: 2,
      objective: 'Find the instant when v ⊥ u, by two independent routes.',
    }),
    b('step_solver', 4, {
      title: 'When is the velocity perpendicular to the initial velocity?',
      problem: 'A particle is projected with velocity $ u $ at angle $ \\theta $ to the horizontal. Find the time at which its velocity vector is perpendicular to its initial velocity vector.',
      intro: 'Two routes to the same answer. The first is mechanical; the second is short enough to do in your head, and shows what is really going on.',
      steps: [
        st('**Route 1 (dot product).** Perpendicular means $ \\mathbf{v}\\cdot\\mathbf{u} = 0 $, and $ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t $, so $ (\\mathbf{u} + \\mathbf{a}t)\\cdot\\mathbf{u} = 0 $.',
          'The identity being used is that two vectors are perpendicular exactly when their dot product vanishes — stated here because it is the whole basis of the method.', {
            check: {
              kind: 'mcq',
              prompt: 'Expanding gives $ \\mathbf{u}\\cdot\\mathbf{u} + t(\\mathbf{a}\\cdot\\mathbf{u}) = 0 $. What is $ \\mathbf{u}\\cdot\\mathbf{u} $?',
              options: ['$ u^2 $', '$ 0 $', '$ 2u $', '$ u $'],
              answer_index: 0,
              feedback_right: 'Right — a vector dotted with itself is its magnitude squared.',
              feedback_wrong: '$ \\mathbf{u}\\cdot\\mathbf{u} = |\\mathbf{u}||\\mathbf{u}|\\cos 0° = u^2 $. That is the standard first move in any dot-product manipulation.',
            },
          }),
        st('In components: $ \\quad (u\\cos\\theta)^2 + (u\\sin\\theta - gt)(u\\sin\\theta) = 0 $',
          'Writing both vectors out and taking the dot product component by component.', {
            check: {
              kind: 'mcq',
              prompt: 'Expanding and using $ \\sin^2\\theta + \\cos^2\\theta = 1 $ gives $ u^2 = (ug\\sin\\theta)t $. So $ t $ is:',
              options: [
                '$ \\dfrac{u}{g\\sin\\theta} $',
                '$ \\dfrac{u\\sin\\theta}{g} $',
                '$ \\dfrac{u}{g\\cos\\theta} $',
                '$ \\dfrac{g\\sin\\theta}{u} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — which is also written $ (u\\csc\\theta)/g $.',
              feedback_wrong: 'Dividing both sides by $ ug\\sin\\theta $ gives $ t = u/(g\\sin\\theta) $, usually written $ t = u\\,\\text{cosec}\\,\\theta/g $. The expression $ u\\sin\\theta/g $ is the time to the *top*, a different instant.',
            },
          }),
        st('$ t = \\dfrac{u}{g\\sin\\theta} = \\dfrac{u\\,\\text{cosec}\\,\\theta}{g} $',
          'Now check it against the second route.', {
            why: '**Route 2 (the angle).** The angle between $ \\mathbf{u} $ and $ \\mathbf{a} = \\mathbf{g} $ is $ 90° + \\theta $. Writing the same condition as $ u^2 + (ug\\cos(90° + \\theta))t = 0 $ and using $ \\cos(90° + \\theta) = -\\sin\\theta $ gives $ u^2 = ugt\\sin\\theta $ immediately — the same answer in one line, with no components at all.\n\nTwo routes agreeing is the best confirmation you can get without numbers.',
          }),
        st('Sanity check: at $ \\theta = 90° $, $ \\quad t = u/g $ — the time to the top of a vertical throw.',
          'For a vertical throw the "perpendicular" instant is when the velocity is momentarily zero, and a zero vector is trivially perpendicular to everything. The formula knows that.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A particle is projected at $ 20 $ m/s at $ 30° $. Find this time, with $ g = 10 $ m/s². Answer in seconds.',
              blank_answer: '4',
              feedback_right: 'Yes — $ 20/(10 \\times 0.5) = 4 $ s.',
              feedback_wrong: '$ t = u/(g\\sin\\theta) = 20/(10 \\times 0.5) = 20/5 = 4 $ s. Note the time of flight is only $ 2 $ s, so this instant is **after** the particle would have landed — it only happens if the ground is not in the way.',
            },
          }),
      ],
      now_you_try: {
        problem: 'Two particles are projected from a tower horizontally in opposite directions with speeds $ 10 $ m/s and $ 20 $ m/s. Find the time at which their velocity vectors are mutually perpendicular. Take $ g = 10 $ m/s².',
        answer: '$ t = \\sqrt{2} \\approx 1.41 $ s',
        solution: 'Take rightwards and upwards as positive. Then $ \\mathbf{v}_1 = 10\\,\\hat{i} - 10t\\,\\hat{j} $ and $ \\mathbf{v}_2 = -20\\,\\hat{i} - 10t\\,\\hat{j} $. Perpendicular means $ \\mathbf{v}_1\\cdot\\mathbf{v}_2 = 0 $: $ (10)(-20) + (-10t)(-10t) = 0 $, so $ 100t^2 = 200 $, giving $ t^2 = 2 $ and $ t = 1.41 $ s. The shared vertical velocity is what eventually swings them into perpendicularity.',
      },
    }),
    b('heading', 5, {
      text: 'Disguise 3 — the monkey and the hunter',
      level: 2,
      objective: 'Explain why aiming directly at a freely falling target always hits it.',
    }),
    b('step_solver', 6, {
      title: 'Aiming straight at a falling target',
      problem: 'A hunter aims a rifle directly at a monkey hanging from a branch a horizontal distance $ d $ away and a height $ h $ above the muzzle. At the exact instant the rifle is fired, the monkey lets go and falls freely. Show that the bullet hits the monkey, whatever the muzzle speed.',
      intro: 'The classic. The trick is to stop thinking about the parabola and think about the *difference* between the two motions.',
      steps: [
        st('Without gravity, the bullet would travel in a straight line and hit the monkey exactly, since the rifle is aimed at it.',
          'Call the bullet\'s gravity-free position at time $ t $ the "aim line" position. Both objects start on that line.', {
            check: {
              kind: 'mcq',
              prompt: 'With gravity on, how far below its gravity-free position is the bullet at time $ t $?',
              options: ['$ \\frac{1}{2}gt^2 $', '$ gt $', '$ \\frac{1}{2}gt $', 'It depends on the muzzle speed'],
              answer_index: 0,
              feedback_right: 'Right — and notice the muzzle speed does not appear.',
              feedback_wrong: 'Gravity adds a downward displacement of $ \\frac{1}{2}gt^2 $ on top of whatever the motion would otherwise have been. It is independent of the horizontal speed — page 1 again.',
            },
          }),
        st('The monkey also falls $ \\tfrac{1}{2}gt^2 $ below its starting point in the same time $ t $.',
          'Same $ g $, same time, same drop. The two objects fall by *exactly the same amount*.', {
            check: {
              kind: 'mcq',
              prompt: 'So their relative acceleration is:',
              options: ['Zero', '$ g $ downwards', '$ 2g $ downwards', 'It depends on the masses'],
              answer_index: 0,
              feedback_right: 'Right — equal accelerations mean zero relative acceleration, exactly as in Chapter 2 page 13.',
              feedback_wrong: '$ a_{BM} = g - g = 0 $. In the monkey\'s frame the bullet has no acceleration at all and simply travels in a straight line — along the aim line, which points at the monkey.',
            },
          }),
        st('Both drop by $ \\tfrac{1}{2}gt^2 $, so gravity **cancels between them** and the bullet stays on the line joining it to the monkey.',
          'The bullet hits, whatever the muzzle speed — the speed decides only *when* and *how far down*.', {
            why: 'The cleanest way to see it is in the monkey\'s frame, where the relative acceleration is zero: the bullet travels in a **straight line** at constant relative velocity, and that line is the aim line, which by construction ends at the monkey.\n\nOne condition, though: the muzzle speed must be large enough that the bullet arrives before either of them reaches the ground. Fire too slowly and both hit the floor first — separately.',
          }),
      ],
      now_you_try: {
        problem: 'A monkey hangs $ 4.9 $ m above the muzzle and $ 10 $ m horizontally away. The rifle is aimed straight at it and fired at $ 50 $ m/s. How far has each of them fallen when the bullet arrives? Take $ g = 9.8 $ m/s².',
        answer: 'Both have fallen about $ 0.02 $ m',
        solution: 'The bullet\'s speed along the aim line is 50 m/s and the line has length $ \\sqrt{100 + 24} = 11.1 $ m, so the flight lasts $ 11.1/50 = 0.22 $ s. In that time each falls $ \\frac{1}{2}(9.8)(0.22)^2 = 0.024 $ m — about 2 cm. Small, equal, and therefore irrelevant to whether the shot connects.',
      },
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.6,
      questions: [
        q('In projectile motion, the velocity is perpendicular to the acceleration:',
          ['At every instant of the flight', 'At no instant during the flight', 'At exactly one instant', 'At exactly two instants'], 2,
          'The acceleration is fixed vertically downwards, so perpendicularity needs a horizontal velocity — true only at the top of the path. A purely vertical throw is the exception, where it never happens.', 2),
        q('At which point on its path does a projectile have the smallest speed?',
          ['At the launch point', 'At the highest point of the path', 'At the landing point', 'One quarter of the way along the path'], 1,
          'Speed is $ \\sqrt{v_x^2 + v_y^2} $ with $ v_x $ constant, so it is smallest where $ |v_y| $ is smallest — zero, at the top. There the speed is $ u\\cos\\theta $.', 2),
        q('A projectile is at a height of $ 15 $ m at $ t = 1 $ s and again at $ t = 3 $ s. Its time of flight is:',
          ['$ 2 $ s', '$ 3 $ s', '$ 4 $ s', '$ 6 $ s'], 2,
          '$ t_1 + t_2 = T $, so $ T = 1 + 3 = 4 $ s. The vertex sits halfway between the two crossings, at $ t = 2 $ s.', 2),
        q('In the monkey-and-hunter demonstration, the bullet hits the monkey because:',
          ['The bullet travels fast enough to be essentially unaffected by gravity', 'Both fall the same distance in the same time, so gravity cancels between them', 'The monkey falls more slowly than the bullet does', 'The rifle must be aimed slightly above the monkey'], 1,
          'Both have the same acceleration $ g $, so both drop by $ \\frac{1}{2}gt^2 $ and the relative acceleration is zero. In the monkey\'s frame the bullet moves in a straight line along the aim line.', 2),
        q('A projectile\'s velocity becomes perpendicular to its launch velocity at $ t = u\\,\\text{cosec}\\,\\theta/g $. For a launch at $ 30° $ this time is:',
          ['Less than the time of flight, so it happens during the flight', 'Exactly equal to the time of flight', 'Greater than the time of flight, so it never happens on level ground', 'Zero, so it happens at the launch instant'], 2,
          'At $ 30° $: $ t_\\perp = u/(g \\times 0.5) = 2u/g $, while $ T = 2u(0.5)/g = u/g $. So $ t_\\perp = 2T $ — the instant lies beyond landing, and only occurs if nothing is in the way. This happens for all $ \\theta < 45° $.', 3),
      ],
    }),
    b('reasoning_prompt', 8, {
      reasoning_type: 'spatial',
      prompt: 'A player hits a baseball at some angle and it flies high into the air. The player then runs and catches it before it lands. Which has the greater displacement over that interval — the player or the ball?',
      reveal: '**Their displacements are essentially equal — and that is the point of the question.**\n\nBoth start at the bat and finish at the catch. Displacement depends only on those two points, so both are the same horizontal distance. (If the catch height differs from the hit height, the ball gains a small vertical component and its displacement is marginally the larger of the two.)\n\nWhat is *wildly* different is the **path length**. The ball went up and over a long arc; the player ran a straight line along the ground. The ball covered far more ground to arrive at the same place.\n\nSo the question is really asking whether you have kept **path length** and **displacement** separate — the distinction Chapter 2 page 2 opened with. Most people answer "the ball, obviously", and they are answering the path-length question instead of the one that was asked.',
      difficulty_level: 3,
    }),
    b('step_solver', 9, {
      title: 'Catching a ball that is already in the air',
      problem: 'A coach throws a baseball to a player with an initial speed of $ 20 $ m/s at $ 45° $ to the horizontal. At the instant the ball is thrown, the player is $ 50 $ m from the coach. At what speed, and in which direction, must the player run to catch the ball at the same height at which it was released? Take $ g = 10 $ m/s².',
      intro: 'Two moving objects and one meeting point. Work out where and when the ball arrives first, then ask what the player must do.',
      steps: [
        st('$ u_x = u_y = 20\\cos 45° = 14.14\\ \\text{m/s} $, so $ \\quad T = \\dfrac{2(14.14)}{10} = 2.83\\ \\text{s} $',
          'The ball returns to its release height after the full time of flight, since the catch is at the same height as the throw.', {
            check: {
              kind: 'fill_blank',
              prompt: 'How far does the ball travel horizontally in that time? Give the range in metres.',
              blank_answer: '40',
              feedback_right: 'Yes — $ R = 400\\sin 90°/10 = 40 $ m.',
              feedback_wrong: '$ R = u^2\\sin 2\\theta/g = 400(1)/10 = 40 $ m. Or equivalently $ 14.14 \\times 2.83 = 40 $ m.',
            },
          }),
        st('The ball lands $ 40 $ m from the coach. The player starts $ 50 $ m away.',
          'So the ball falls 10 m **short** of the player — they must run *towards* the coach, not away.', {
            check: {
              kind: 'mcq',
              prompt: 'Which way must the player run, and how far?',
              options: [
                'Towards the coach, $ 10 $ m',
                'Away from the coach, $ 10 $ m',
                'Towards the coach, $ 40 $ m',
                'They need not move at all',
              ],
              answer_index: 0,
              feedback_right: 'Right — the gap between 50 m and 40 m has to be closed.',
              feedback_wrong: 'The ball reaches only 40 m and the player is at 50 m, so the player must close a 10 m gap by running **towards** the coach.',
            },
          }),
        st('$ \\text{speed} = \\dfrac{10\\ \\text{m}}{2.83\\ \\text{s}} = 3.53\\ \\text{m/s} $ towards the coach',
          'The player has the whole flight time to cover the 10 m, so a gentle jog is enough.', {
            why: 'The structure here is worth naming: **the projectile fixes the clock, and everything else has to fit inside it.** The ball\'s flight time was not negotiable, so the player\'s required speed was simply a gap divided by a time that had already been decided. Most "two-body plus projectile" questions have exactly this shape.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown at $ 30 $ m/s at $ 37° $ and a fielder standing $ 100 $ m away starts running at the instant of the throw. What speed must the fielder run at to catch the ball at the release height? Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
        answer: 'About $ 3.8 $ m/s, running towards the thrower',
        solution: '$ u_x = 24 $ m/s, $ u_y = 18 $ m/s, so $ T = 2(18)/10 = 3.6 $ s and $ R = 24(3.6) = 86.4 $ m. The ball falls short of the fielder, who must close $ 100 - 86.4 = 13.6 $ m in 3.6 s — a speed of $ 3.8 $ m/s, a comfortable jog. Worth a reality check on this kind of answer: a required speed above about 10 m/s would mean the catch is not humanly possible.',
      },
    }),
    b('callout', 10, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Two times at one height**, and $ t_1 + t_2 = T $. Given one, subtract for the other — no quadratic needed.\n- $ \\mathbf{v} \\perp \\mathbf{u} $ at $ t = \\dfrac{u\\,\\text{cosec}\\,\\theta}{g} $. For $ \\theta < 45° $ this is **after** landing, so it never actually happens on level ground.\n- $ \\mathbf{v} \\perp \\mathbf{a} $ **exactly once**, at the top — because $ \\mathbf{a} $ is fixed vertically downwards.\n- The **smallest speed** on the path is $ u\\cos\\theta $, at the top.\n- **Monkey and hunter:** aim straight at a freely falling target and you hit it, because both fall $ \\frac{1}{2}gt^2 $ and gravity cancels between them.\n- In a projectile-plus-runner problem, **the flight time is fixed first** and everything else fits inside it.',
    }),
    b('practice_bank', 11, {
      title: 'You solve it',
      intro: 'Eight questions. Several can be done in one line if you spot which disguise you are looking at — so look before you calculate.',
      sections: [
        {
          id: 'p8-ysi',
          title: 'The recurring families',
          items: [
            num('p8-y1', 'A projectile is at a height of $ 40 $ m at $ t = 2 $ s. If its time of flight is $ 6 $ s, at what other time is it at $ 40 $ m?',
              '$ t = 4 $ s',
              '$ t_1 + t_2 = T $, so $ t_2 = 6 - 2 = 4 $ s. The vertex is at $ t = 3 $ s, and the two crossings sit symmetrically either side of it.'),
            mcq('p8-y2', 'A projectile is launched at $ 60° $. The instant at which its velocity is perpendicular to its launch velocity:',
              ['Occurs during the flight', 'Occurs after it would have landed', 'Occurs at the top of the path', 'Never occurs'], 0,
              '$ t_\\perp = u/(g\\sin 60°) = 1.155u/g $, and $ T = 2u\\sin 60°/g = 1.732u/g $. Since $ t_\\perp < T $, it happens during the flight. This is true for all $ \\theta > 45° $.'),
            num('p8-y3', 'A particle is projected at $ 40 $ m/s at $ 53° $. Find the time at which its velocity is perpendicular to its initial velocity, and whether this happens before landing. Take $ g = 10 $ m/s², $ \\sin 53° = 0.8 $.',
              '$ t = 5 $ s; yes, since $ T = 6.4 $ s',
              '$ t_\\perp = u/(g\\sin\\theta) = 40/(10 \\times 0.8) = 5 $ s. The time of flight is $ T = 2(40)(0.8)/10 = 6.4 $ s, and $ 5 < 6.4 $, so it does occur in flight — as expected for $ \\theta > 45° $.'),
            mcq('p8-y4', 'A bullet is fired directly at a target that begins to fall freely at the instant of firing. The bullet:',
              ['Passes above the target', 'Hits the target regardless of the muzzle speed', 'Passes below the target', 'Hits only at one particular muzzle speed'], 1,
              'Both bullet and target fall $ \\frac{1}{2}gt^2 $ in the same time, so gravity cancels between them and the bullet stays on the aim line. The muzzle speed decides only when and how far down the meeting happens.'),
            num('p8-y5', 'A ball is projected at $ 25 $ m/s at $ 37° $. Find its minimum speed during the flight and where it occurs. Take $ \\cos 37° = 0.8 $.',
              '$ 20 $ m/s, at the highest point',
              'The minimum speed is the horizontal component, $ u\\cos\\theta = 25(0.8) = 20 $ m/s, which is all that survives at the top where $ v_y = 0 $.'),
            mcq('p8-y6', 'Two projectiles are launched simultaneously from the same point with different speeds and angles. Their relative acceleration is:',
              ['$ g $ downwards', 'Zero', '$ 2g $ downwards', 'It depends on the two angles'], 1,
              'Both have acceleration $ g $ downwards, so $ \\mathbf{a}_{12} = \\mathbf{g} - \\mathbf{g} = \\mathbf{0} $. Each therefore sees the other move in a **straight line** at constant velocity — which is the condition for two projectiles to be able to collide mid-air.'),
            num('p8-y7', 'A projectile has a time of flight of $ 4 $ s. At what two times is it at half its maximum height? Take $ g = 10 $ m/s².',
              '$ t = 0.586 $ s and $ t = 3.414 $ s',
              '$ u_y = gT/2 = 20 $ m/s and $ H = u_y^2/2g = 20 $ m, so half of that is 10 m. Then $ 10 = 20t - 5t^2 $ gives $ t^2 - 4t + 2 = 0 $, so $ t = 2 \\pm \\sqrt{2} $, i.e. $ 0.586 $ s and $ 3.414 $ s. They sum to 4 s ✓.'),
            num('p8-y8', 'A coach throws a ball at $ 20\\sqrt{2} $ m/s at $ 45° $. A player $ 60 $ m away runs to catch it at the release height. Find the player\'s required speed and direction. Take $ g = 10 $ m/s².',
              '$ 5 $ m/s away from the coach',
              '$ u_x = u_y = 20 $ m/s, so $ T = 4 $ s and $ R = 80 $ m. The ball overshoots the player by $ 80 - 60 = 20 $ m, so the player must run **away** from the coach, covering 20 m in 4 s — a speed of 5 m/s.'),
          ],
        },
      ],
    }),
    b('text', 12, {
      markdown: 'One case is left, and it is the one that shows why "choose your axes well" is a physics skill rather than a formality: **what if the ground is not flat?**',
    }),
  ],
};

// ── p9 · Projectile on an Inclined Plane (competitive tier) ──────────────────
const p9 = {
  page_number: 9,
  slug: 'projectile-on-an-inclined-plane',
  title: 'Projectile on an Inclined Plane',
  subtitle: 'Rotate the axes, and one derivation gives two answers',
  glossary: [
    { term: 'inclined-plane projectile', definition: 'A projectile launched over sloping ground, where "landing" means returning to the slope rather than to a horizontal line.' },
  ],
  blocks: [
    hero('projectile-on-an-inclined-plane'),
    b('callout', 0, {
      variant: 'note',
      title: 'A note on scope',
      markdown: 'This page is **beyond the NCERT syllabus.** It is here because it is a genuine JEE Advanced topic, and because it is the best demonstration in this chapter that choosing your axes well is a physics decision, not a formality.\n\nIf you are preparing for boards only, you can treat this page as enrichment and move on to page 10.\n\nNothing on it is new physics. It is page 3\'s Method 2 with the axes turned through an angle.',
    }),
    b('curiosity_prompt', 1, {
      prompt: 'You fire a shell up a hillside. The usual axes are horizontal and vertical. What goes wrong with them here — and what would you use instead?',
      hint: 'What does "it landed" mean mathematically, on a slope?',
      reveal: 'With horizontal and vertical axes, "landed" is no longer $ s_y = 0 $ — the ground rises as you go, so the landing condition becomes $ y = x\\tan\\beta $, a relation *between* the two coordinates. That couples the axes together, and the independence that made this chapter easy is gone.\n\n**So rotate the axes.** Put $ x $ **along the slope** and $ y $ **perpendicular to it**. Now "landed" is $ s_y = 0 $ again, exactly as before.\n\nThe price is that gravity no longer lies along one axis — it has to be resolved into two components, $ g\\sin\\beta $ along the slope and $ g\\cos\\beta $ perpendicular to it. So the awkwardness moves from the *landing condition* to the *acceleration*, and that is a very good trade: a messy constant is easy, a coupled condition is not.',
    }),
    b('text', 2, {
      markdown: 'Launch at speed $ u $ at angle $ \\theta $ **to the horizontal**, up a slope of angle $ \\beta $. The launch angle measured from the slope is then $ (\\theta - \\beta) $.\n\nWith $ x $ along the slope and $ y $ perpendicular to it:\n\n$ u_x = u\\cos(\\theta - \\beta) \\qquad u_y = u\\sin(\\theta - \\beta) $\n\n$ a_x = -g\\sin\\beta \\qquad a_y = -g\\cos\\beta $',
    }),
    b('callout', 3, {
      variant: 'warning',
      title: 'The one thing that changed, and the one thing that did not',
      markdown: '**Changed:** $ a_x $ is no longer zero. Gravity now has a component *along* the slope, so the along-slope motion is decelerated instead of uniform.\n\n**Did not change:** the method. Two axes, three equations each, landing at $ s_y = 0 $. Everything on page 3 still applies word for word.\n\nAnd note carefully that $ \\theta $ is measured **from the horizontal** here, not from the slope. Mixing the two conventions is the single largest source of errors on this topic — the reference formulas look completely different depending on which you pick.',
    }),
    b('step_solver', 4, {
      title: 'Time of flight up the slope',
      problem: 'A projectile is launched at speed $ u $ at angle $ \\theta $ to the horizontal, up a plane inclined at $ \\beta $. Derive its time of flight — the time until it lands back on the slope.',
      intro: 'Identical in shape to the page 5 derivation. Only the two coefficients differ.',
      steps: [
        st('Landing on the slope means $ s_y = 0 $, where $ y $ is measured **perpendicular to the slope**.',
          'That is the entire reason for rotating the axes: it restores the simple landing condition.', {
            check: {
              kind: 'mcq',
              prompt: 'Which acceleration component appears in the perpendicular equation?',
              options: ['$ -g\\cos\\beta $', '$ -g\\sin\\beta $', '$ -g $', 'Zero'],
              answer_index: 0,
              feedback_right: 'Right — the perpendicular-to-slope component of gravity is $ g\\cos\\beta $.',
              feedback_wrong: 'Resolving $ g $ onto the rotated axes gives $ g\\sin\\beta $ along the slope and $ g\\cos\\beta $ perpendicular to it. The perpendicular equation therefore carries $ -g\\cos\\beta $.',
            },
          }),
        st('$ 0 = u\\sin(\\theta - \\beta)\\,t - \\tfrac{1}{2}(g\\cos\\beta)t^2 $',
          'The same quadratic as page 5, with $ u\\sin(\\theta-\\beta) $ in place of $ u\\sin\\theta $ and $ g\\cos\\beta $ in place of $ g $.', {
            check: {
              kind: 'mcq',
              prompt: 'Factorising and taking the non-zero root gives:',
              options: [
                '$ T = \\dfrac{2u\\sin(\\theta - \\beta)}{g\\cos\\beta} $',
                '$ T = \\dfrac{2u\\sin\\theta}{g\\cos\\beta} $',
                '$ T = \\dfrac{2u\\sin(\\theta - \\beta)}{g} $',
                '$ T = \\dfrac{2u\\cos(\\theta - \\beta)}{g\\sin\\beta} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — both substitutions carried through.',
              feedback_wrong: 'Dividing out $ t $ gives $ u\\sin(\\theta-\\beta) = \\frac{1}{2}(g\\cos\\beta)T $, so $ T = 2u\\sin(\\theta-\\beta)/(g\\cos\\beta) $. Both the numerator and the denominator differ from the flat-ground case.',
            },
          }),
        st('$ T = \\dfrac{2u\\sin(\\theta - \\beta)}{g\\cos\\beta} $',
          'Check the limit: set $ \\beta = 0 $ and this becomes $ 2u\\sin\\theta/g $, the flat-ground result. ✓', {
            why: '**Always test a general formula by collapsing it to a case you already know.** Here $ \\beta = 0 $ must reproduce page 5, and it does. If it had not, there would be an error upstream — and this check costs five seconds.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is projected at $ 20 $ m/s at $ 60° $ to the horizontal, up a slope inclined at $ 30° $. Find its time of flight. Take $ g = 10 $ m/s².',
        answer: '$ T = 2.31 $ s',
        solution: '$ \\theta - \\beta = 30° $, so $ T = 2(20)\\sin 30°/(10\\cos 30°) = 20/(10 \\times 0.866) = 2.31 $ s. On flat ground the same launch would give $ T = 2(20)(0.866)/10 = 3.46 $ s — the slope cuts the flight short because it rises to meet the ball.',
      },
    }),
    b('step_solver', 5, {
      title: 'Range along the slope, and the best angle',
      problem: 'For the same launch, derive the range measured **along the slope**, and find the angle $ \\theta $ that maximises it.',
      intro: 'The along-slope axis now has an acceleration, so this is slightly more work than the flat case — but the payoff is a genuinely elegant result.',
      steps: [
        st('$ R = u_x T + \\tfrac{1}{2}a_x T^2 $, with $ u_x = u\\cos(\\theta-\\beta) $ and $ a_x = -g\\sin\\beta $',
          'Both terms are needed now. On flat ground the second term vanished, which is why the flat range was a one-liner.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does the second term matter here but not on flat ground?',
              options: [
                'Because gravity now has a component along the slope',
                'Because the time of flight is longer',
                'Because the launch angle is measured differently',
                'Because the range is measured along a slope',
              ],
              answer_index: 0,
              feedback_right: 'Right — $ a_x = -g\\sin\\beta $, which is only zero when $ \\beta = 0 $.',
              feedback_wrong: 'On flat ground $ a_x = 0 $, so the $ \\frac{1}{2}a_x T^2 $ term disappears and range is just speed times time. On a slope, gravity has an along-slope component, so that term survives.',
            },
          }),
        st('Substituting $ T $ and simplifying with $ \\sin C - \\sin D = 2\\sin\\left(\\frac{C-D}{2}\\right)\\cos\\left(\\frac{C+D}{2}\\right) $:',
          'The algebra is routine but long; the trigonometric identity from Chapter 0 is what makes the result compact.', {
            check: {
              kind: 'mcq',
              prompt: 'The result is $ R = \\dfrac{u^2}{g\\cos^2\\beta}\\left[\\sin(2\\theta - \\beta) - \\sin\\beta\\right] $. Which part of it depends on the launch angle?',
              options: [
                'Only the $ \\sin(2\\theta - \\beta) $ term',
                'Only the $ \\sin\\beta $ term',
                'Both terms',
                'Neither term',
              ],
              answer_index: 0,
              feedback_right: 'Right — so maximising $ R $ means maximising $ \\sin(2\\theta - \\beta) $ alone.',
              feedback_wrong: 'The $ \\sin\\beta $ term and the $ \\cos^2\\beta $ factor are fixed by the slope. Only $ \\sin(2\\theta-\\beta) $ contains $ \\theta $, so that is the only part we can adjust.',
            },
          }),
        st('Maximum when $ \\sin(2\\theta - \\beta) = 1 $, i.e. $ 2\\theta - \\beta = \\dfrac{\\pi}{2} \\quad \\Rightarrow \\quad \\theta = \\dfrac{\\pi}{4} + \\dfrac{\\beta}{2} $',
          'And then $ R_{\\max} = \\dfrac{u^2}{g\\cos^2\\beta}(1 - \\sin\\beta) $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Check the limit: with $ \\beta = 0 $, what is the optimum $ \\theta $ in degrees?',
              blank_answer: '45',
              feedback_right: 'Yes — it collapses to $ 45° $, the flat-ground answer. ✓',
              feedback_wrong: '$ \\theta = 45° + 0/2 = 45° $, recovering the flat-ground result exactly. The limit check passes.',
            },
          }),
        st('$ \\theta = 45° + \\dfrac{\\beta}{2} $ — bisect the angle between the slope and the vertical.',
          'That is what the formula is saying geometrically: aim halfway between the hillside and straight up.', {
            why: 'It is a genuinely beautiful result. On flat ground, halfway between the ground and the vertical is $ 45° $. Tilt the ground up by $ \\beta $ and the bisector moves up by $ \\beta/2 $ — so the same geometric rule covers every slope, including downhill ones where $ \\beta $ is negative and the best angle drops below $ 45° $.',
          }),
      ],
      now_you_try: {
        problem: 'A projectile is fired up a slope inclined at $ 30° $. At what angle to the horizontal should it be fired for maximum range along the slope? And what if the slope went *downhill* at $ 30° $?',
        answer: '$ 60° $ uphill; $ 30° $ downhill',
        solution: 'Uphill: $ \\theta = 45° + 30°/2 = 60° $. For a downhill slope, $ \\beta = -30° $, so $ \\theta = 45° - 15° = 30° $. Both are the bisector of the angle between the slope and the vertical — steeper for uphill, shallower for downhill, which matches the intuition from page 7.',
      },
    }),
    b('callout', 6, {
      variant: 'exam_tip',
      title: 'Down the plane: one substitution, not a second derivation',
      markdown: 'For a projectile fired **down** the slope, the same work gives\n\n$ T = \\dfrac{2u\\sin(\\theta + \\beta)}{g\\cos\\beta} \\qquad R = \\dfrac{u^2}{g\\cos^2\\beta}\\left[\\sin(2\\theta + \\beta) + \\sin\\beta\\right] $\n\nCompare those with the up-the-plane pair and you will see the rule: **replacing $ \\beta $ by $ -\\beta $ turns one into the other.**\n\nSo there is only one derivation here, not two. Do the uphill case, then flip the sign of the incline angle. This works only because $ \\theta $ is measured from the **horizontal** in both cases — measure it from the slope instead and the symmetry disappears.',
    }),
    b('step_solver', 7, {
      title: 'Landing perpendicular to the slope',
      problem: 'A projectile is launched at angle $ \\theta $ to the horizontal, up a plane inclined at $ \\beta $. Find the condition for it to strike the plane at right angles to the plane.',
      intro: 'A favourite of exam setters, and a good test of whether the rotated axes have really sunk in. Decode the condition into a statement about a component first.',
      steps: [
        st('Striking the plane **perpendicularly** means the velocity at landing has no component *along* the plane: $ \\quad v_x = 0 $.',
          'In the rotated frame, "perpendicular to the plane" is simply the $ y $ direction — so the $ x $ component must vanish.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is $ v_x = 0 $, rather than $ v_y = 0 $?',
              options: [
                'Because $ x $ runs along the plane, and a perpendicular velocity has nothing along it',
                'Because $ v_y $ is always zero at landing',
                'Because the projectile stops on impact',
                'Because $ a_x $ is zero on a slope',
              ],
              answer_index: 0,
              feedback_right: 'Right — this is exactly the payoff of choosing the axes this way.',
              feedback_wrong: 'The $ x $ axis lies along the plane. A velocity perpendicular to the plane therefore has zero $ x $ component. ($ v_y $ is at its most negative at landing, not zero — and $ a_x = -g\\sin\\beta $ is not zero on a slope.)',
            },
          }),
        st('Along the slope: $ \\quad v_x = u\\cos(\\theta - \\beta) - (g\\sin\\beta)T $, and we need this to be zero at $ t = T $.',
          'Note that $ v_x $ *does* change here — the along-slope acceleration is what makes this condition possible at all.', {
            check: {
              kind: 'mcq',
              prompt: 'On flat ground ($ \\beta = 0 $), could a projectile ever land perpendicular to the ground?',
              options: [
                'No, because $ v_x = u\\cos\\theta $ never changes and is never zero',
                'Yes, at $ \\theta = 45° $',
                'Yes, for any launch angle',
                'Only if it is launched vertically',
              ],
              answer_index: 0,
              feedback_right: 'Right — and that is precisely why this question only exists on a slope.',
              feedback_wrong: 'With $ \\beta = 0 $ there is no along-slope acceleration, so $ v_x = u\\cos\\theta $ for the whole flight and can only be zero for a purely vertical launch — which is not a projectile. The slope is what makes the condition reachable.',
            },
          }),
        st('Substituting $ T = \\dfrac{2u\\sin(\\theta - \\beta)}{g\\cos\\beta} $:  $ \\quad u\\cos(\\theta-\\beta) = g\\sin\\beta \\cdot \\dfrac{2u\\sin(\\theta-\\beta)}{g\\cos\\beta} $',
          'The $ u $ and the $ g $ cancel, so the condition is purely a relation between the two angles.', {
            check: {
              kind: 'mcq',
              prompt: 'Rearranging gives which condition?',
              options: [
                '$ \\cot(\\theta - \\beta) = 2\\tan\\beta $',
                '$ \\tan(\\theta - \\beta) = 2\\tan\\beta $',
                '$ \\cot(\\theta - \\beta) = \\tan\\beta $',
                '$ \\tan\\theta = 2\\tan\\beta $',
              ],
              answer_index: 0,
              feedback_right: 'Right — cotangent, not tangent. The cosine ended up on top.',
              feedback_wrong: 'Dividing both sides by $ u\\sin(\\theta-\\beta) $ and by $ \\cos\\beta $ gives $ \\dfrac{\\cos(\\theta-\\beta)}{\\sin(\\theta-\\beta)} = \\dfrac{2\\sin\\beta}{\\cos\\beta} $, which is $ \\cot(\\theta-\\beta) = 2\\tan\\beta $.',
            },
          }),
        st('$ \\cot(\\theta - \\beta) = 2\\tan\\beta $',
          'A relation between the launch angle and the slope angle, with the launch speed nowhere in it.', {
            why: 'That the speed drops out is worth pausing on. **Whether it lands perpendicular is a question of geometry, not of how hard you throw.** Throw faster and it lands further up the slope, but at the same angle to it. This is the same kind of speed-independence as the monkey-and-hunter result on page 8, and for the same underlying reason: $ u $ scales the whole trajectory without reshaping it.',
          }),
      ],
      now_you_try: {
        problem: 'A projectile is fired up a plane inclined at $ 30° $. At what angle to the horizontal must it be fired to strike the plane at right angles?',
        answer: '$ \\theta = 70.9° $',
        solution: '$ \\cot(\\theta - 30°) = 2\\tan 30° = 2(0.577) = 1.155 $, so $ \\tan(\\theta - 30°) = 1/1.155 = 0.866 $ and $ \\theta - 30° = 40.9° $, giving $ \\theta = 70.9° $. Note this is *not* the maximum-range angle of $ 60° $ — landing perpendicular and travelling furthest are different requests, and they want different launch angles.',
      },
    }),
    b('step_solver', 8, {
      title: 'A stone thrown horizontally off a hillside',
      problem: 'A person standing on a hilltop throws a stone horizontally with speed $ v_0 $. The hillside slopes downwards at angle $ \\beta $ below the horizontal. Taking the launch point as the origin, find the coordinates of the point where the stone strikes the hill surface.',
      intro: 'A horizontal throw down a slope, so this is the down-the-plane case with $ \\theta = 0 $. Watch how much the general formula saves.',
      steps: [
        st('Down-the-plane range with $ \\theta = 0 $: $ \\quad R = \\dfrac{v_0^2}{g\\cos^2\\beta}\\left[\\sin(0 + \\beta) + \\sin\\beta\\right] $',
          'Substituting $ \\theta = 0 $ into the down-the-plane formula from the box above.', {
            check: {
              kind: 'mcq',
              prompt: 'The bracket becomes $ \\sin\\beta + \\sin\\beta $. So $ R $ is:',
              options: [
                '$ \\dfrac{2v_0^2\\sin\\beta}{g\\cos^2\\beta} $',
                '$ \\dfrac{v_0^2\\sin\\beta}{g\\cos^2\\beta} $',
                '$ \\dfrac{2v_0^2\\sin\\beta}{g} $',
                '$ \\dfrac{2v_0^2}{g\\cos\\beta} $',
              ],
              answer_index: 0,
              feedback_right: 'Right — the two identical sine terms add.',
              feedback_wrong: '$ \\sin\\beta + \\sin\\beta = 2\\sin\\beta $, so $ R = 2v_0^2\\sin\\beta/(g\\cos^2\\beta) $.',
            },
          }),
        st('$ R = \\dfrac{2v_0^2\\sin\\beta}{g\\cos^2\\beta} $ — but this is measured **along the slope**, and the question asks for coordinates.',
          'So project $ R $ back onto the horizontal and vertical directions.', {
            check: {
              kind: 'mcq',
              prompt: 'With $ x $ horizontal and $ y $ vertically downwards along the hill, what are $ x $ and $ |y| $ in terms of $ R $?',
              options: [
                '$ x = R\\cos\\beta $ and $ |y| = R\\sin\\beta $',
                '$ x = R\\sin\\beta $ and $ |y| = R\\cos\\beta $',
                '$ x = R $ and $ |y| = R\\tan\\beta $',
                '$ x = R\\tan\\beta $ and $ |y| = R $',
              ],
              answer_index: 0,
              feedback_right: 'Right — the slope distance resolved onto horizontal and vertical.',
              feedback_wrong: 'The along-slope displacement $ R $ makes angle $ \\beta $ with the horizontal, so its horizontal part is $ R\\cos\\beta $ and its vertical part is $ R\\sin\\beta $.',
            },
          }),
        st('$ x = R\\cos\\beta = \\dfrac{2v_0^2\\tan\\beta}{g} \\qquad y = -R\\sin\\beta = -\\dfrac{2v_0^2\\tan^2\\beta}{g} $',
          'The $ \\cos^2\\beta $ in the denominator absorbs neatly into tangents, which is why the final answer is so much tidier than the intermediate step.', {
            why: 'Worth checking the shape of the answer against intuition. As $ \\beta \\to 0 $ (flat ground), both $ x $ and $ y $ go to zero — correct, because a horizontal throw along flat ground lands immediately at your feet. As $ \\beta $ grows towards $ 90° $ (a cliff face), both grow without limit — correct, because the stone never meets a vertical wall it was thrown away from.\n\nA general result you can test at both ends is a general result you can trust.',
          }),
      ],
      now_you_try: {
        problem: 'A stone is thrown horizontally at $ 10 $ m/s from a hilltop where the hillside slopes down at $ 45° $. Find the coordinates of the point where it strikes the hill. Take $ g = 10 $ m/s².',
        answer: '$ x = 20 $ m, $ y = -20 $ m',
        solution: 'With $ \\tan 45° = 1 $: $ x = 2(100)(1)/10 = 20 $ m and $ y = -2(100)(1)/10 = -20 $ m. So it lands 20 m out and 20 m down, which is on the $ 45° $ line as it must be ✓ — a good self-check, since $ |y|/x $ must equal $ \\tan\\beta $.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('For a projectile on an inclined plane, the axes are chosen along and perpendicular to the slope because:',
          ['Gravity then lies along one of the two axes', 'The landing condition becomes $ s_y = 0 $ again', 'The launch angle becomes $ 45° $ automatically', 'The acceleration along the slope becomes zero'], 1,
          'Rotating the axes restores the simple landing condition. Gravity is then *not* along either axis — it has to be resolved into $ g\\sin\\beta $ and $ g\\cos\\beta $ — but that is a much easier price than a coupled landing condition.', 3),
        q('For maximum range up a plane inclined at $ \\beta $, the projectile should be fired at an angle to the horizontal of:',
          ['$ 45° $', '$ 45° + \\beta/2 $', '$ 45° - \\beta/2 $', '$ 45° + \\beta $'], 1,
          '$ \\theta = \\pi/4 + \\beta/2 $, which bisects the angle between the slope and the vertical. Setting $ \\beta = 0 $ recovers $ 45° $.', 3),
        q('The component of gravity along an incline of angle $ \\beta $ is:',
          ['$ g\\cos\\beta $', '$ g\\sin\\beta $', '$ g\\tan\\beta $', '$ g $'], 1,
          '$ g\\sin\\beta $ acts down the slope and $ g\\cos\\beta $ perpendicular to it. A useful check: at $ \\beta = 0 $ the along-slope component must vanish, and $ \\sin 0 = 0 $ ✓.', 2),
        q('Replacing $ \\beta $ by $ -\\beta $ in the up-the-plane formulas gives the down-the-plane ones. This works because:',
          ['The launch angle is measured from the horizontal in both cases', 'Gravity reverses its direction on a downhill slope', 'The range comes out the same whichever way you fire', 'The time of flight is unaffected by the slope angle'], 0,
          'The symmetry depends on $ \\theta $ being referenced to the horizontal, which is common to both set-ups. Measure the launch angle from the slope itself and the two cases no longer map onto each other by a sign flip.', 3),
        q('A projectile is fired up a slope. Compared with the same launch on flat ground, its time of flight is:',
          ['Longer, since the slope adds distance', 'Shorter, since the slope rises to meet it', 'Unchanged', 'Shorter only if $ \\beta > 45° $'], 1,
          '$ T = 2u\\sin(\\theta-\\beta)/(g\\cos\\beta) $. The numerator shrinks (since $ \\theta - \\beta < \\theta $) faster than the denominator does, so the flight is shorter — the ground has come up to meet the projectile early.', 3),
      ],
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Rotate the axes:** $ x $ along the slope, $ y $ perpendicular. Then landing is $ s_y = 0 $ again.\n- $ u_x = u\\cos(\\theta-\\beta) $, $ u_y = u\\sin(\\theta-\\beta) $, $ a_x = -g\\sin\\beta $, $ a_y = -g\\cos\\beta $.\n- $ T = \\dfrac{2u\\sin(\\theta - \\beta)}{g\\cos\\beta} \\qquad R = \\dfrac{u^2}{g\\cos^2\\beta}\\left[\\sin(2\\theta - \\beta) - \\sin\\beta\\right] $\n- Maximum range at $ \\theta = 45° + \\dfrac{\\beta}{2} $ — **bisect the angle between the slope and the vertical.**\n- **Down the plane: replace $ \\beta $ by $ -\\beta $.** One derivation, two answers — valid only because $ \\theta $ is measured from the horizontal.\n- **Always collapse a general formula to $ \\beta = 0 $** and check it gives the flat-ground result back.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Seven questions. State whether each launch is up or down the plane before you substitute, and remember that $ \\theta $ is measured from the horizontal.',
      sections: [
        {
          id: 'p9-ysi',
          title: 'Projectiles on a slope',
          items: [
            num('p9-y1', 'A ball is projected at $ 20 $ m/s at $ 45° $ to the horizontal, up a slope of $ 15° $. Find its time of flight. Take $ g = 10 $ m/s².',
              '$ T = 2.07 $ s',
              '$ \\theta - \\beta = 30° $, so $ T = 2(20)\\sin 30°/(10\\cos 15°) = 20/(10 \\times 0.966) = 2.07 $ s.'),
            mcq('p9-y2', 'For maximum range up a plane inclined at $ 20° $, the angle of projection to the horizontal should be:',
              ['$ 45° $', '$ 55° $', '$ 65° $', '$ 35° $'], 1,
              '$ \\theta = 45° + \\beta/2 = 45° + 10° = 55° $.'),
            num('p9-y3', 'A projectile is fired at $ 30 $ m/s at $ 60° $ to the horizontal, up a slope of $ 30° $. Find the range along the slope. Take $ g = 10 $ m/s².',
              '$ 60 $ m',
              '$ R = \\frac{u^2}{g\\cos^2\\beta}[\\sin(2\\theta-\\beta) - \\sin\\beta] = \\frac{900}{10(0.75)}[\\sin 90° - \\sin 30°] = 120[1 - 0.5] = 60 $ m. This is also the maximum-range case, since $ 45° + 15° = 60° $ ✓.'),
            mcq('p9-y4', 'For a projectile fired **down** a slope of angle $ \\beta $, the maximum-range angle of projection is:',
              ['$ 45° + \\beta/2 $', '$ 45° - \\beta/2 $', '$ 45° $', '$ 45° - \\beta $'], 1,
              'Replace $ \\beta $ by $ -\\beta $ in $ \\theta = 45° + \\beta/2 $ to get $ 45° - \\beta/2 $. Firing downhill, the optimum is shallower than $ 45° $ — the same direction of correction as launching from a height.'),
            num('p9-y5', 'A stone is thrown horizontally at $ 15 $ m/s from a hilltop where the hillside slopes down at $ 30° $. Find the coordinates of the impact point. Take $ g = 10 $ m/s².',
              '$ x = 26 $ m, $ y = -15 $ m',
              '$ \\tan 30° = 0.577 $. So $ x = 2(225)(0.577)/10 = 26.0 $ m and $ y = -2(225)(0.333)/10 = -15.0 $ m. Check: $ |y|/x = 15/26 = 0.577 = \\tan 30° $ ✓.'),
            mcq('p9-y6', 'On an inclined plane, the perpendicular-to-slope component of the acceleration is $ g\\cos\\beta $. At $ \\beta = 90° $ (a vertical wall) this becomes:',
              ['$ g $, the full acceleration due to gravity', 'Zero, so there is no acceleration away from the wall', '$ g/2 $, half the usual value', 'Undefined, since the formula breaks down'], 1,
              '$ \\cos 90° = 0 $, so nothing pushes the projectile back towards a vertical wall — which is why a stone thrown away from a cliff face never returns to it. The general formula predicts its own breakdown case correctly.'),
            num('p9-y7', 'A projectile is launched at $ 25 $ m/s up a $ 37° $ slope, at the angle that maximises its range along the slope. Find that angle and the maximum range. Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
              '$ \\theta = 63.5° $, $ R_{\\max} = 39.1 $ m',
              '$ \\theta = 45° + 18.5° = 63.5° $. Then $ R_{\\max} = \\frac{u^2}{g\\cos^2\\beta}(1 - \\sin\\beta) = \\frac{625}{10(0.64)}(1 - 0.6) = 97.7(0.4) = 39.1 $ m.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'That is projectiles finished. The chapter now turns to a motion that never stops turning — and to the promise page 2 made about a car going round a bend at a steady speed.',
    }),
  ],
};

// Plan §4 item 4: every JEE-only page is marked `tier: 'competitive'`. `tier`
// lives on BaseBlockSchema, so it is a per-BLOCK field — set it on all of them.
const competitive = (page) => ({ ...page, blocks: page.blocks.map((blk) => ({ ...blk, tier: 'competitive' })) });

withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p7, p8, competitive(p9)]);
}).then(() => { console.log('\nWave 1c done — p7–p9'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
