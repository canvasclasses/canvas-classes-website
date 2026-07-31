'use strict';
/**
 * Class 11 Physics · Chapter 2 "Motion in One Dimension" — pages 9–11.
 * Wave 2a: the three equations of motion, using them without sign errors, and
 * free fall.
 *
 * AUTHORED AGAINST THE METRICS FROM THE START (Wave 1 missed both):
 *   • per-page floor of 4 step_solvers / 5 inline-quiz questions / 7-item strip
 *   • no run of prose longer than ~120 words between practice items — so text
 *     blocks are deliberately short and interleaved, not gathered into sections
 *
 * NO SIMULATION BLOCKS (founder decision 2026-07-29). Technical figures are
 * hand-authored SVG (founder decision 2026-07-29); `src` stays '' until the SVG
 * pass, and `generation_prompt` is reserved for atmospheric art only.
 *
 * Run: node scripts/physics11-book/build_ch2_equations.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch2');

// ── p9 · The Three Equations ──────────────────────────────────────────────────
const p9 = {
  page_number: 9,
  slug: 'the-three-equations-derived',
  title: 'The Three Equations — Derived, Not Handed Over',
  subtitle: 'Where they come from, and the one condition they all depend on',
  glossary: [
    { term: 'equations of motion', definition: 'The three relations between u, v, a, t and s that hold for motion with constant acceleration. They are not laws — they are consequences of the definitions of velocity and acceleration.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You are about to meet three famous equations. Before you do: you already know only two facts about motion — that velocity is the rate of change of position, and acceleration is the rate of change of velocity. Could three new equations really contain anything beyond those two facts?',
      hint: 'Ask what the equations would let you calculate that the definitions alone would not.',
      reveal: 'No. They contain nothing new at all.\n\nThe three equations are just those two definitions, rearranged for the special case where the acceleration happens to be **constant**. That is why they are called equations of *motion* and not laws of motion — nobody discovered them, they fall out.\n\nWhich also tells you exactly when they fail: **the moment the acceleration stops being constant.** Keep that in mind for the rest of this page, because it is the one thing students forget.',
    }),
    b('text', 1, {
      markdown: 'Here are the three, in the notation this chapter will use throughout:\n\n$ v = u + at $\n\n$ s = ut + \\frac{1}{2}at^2 $\n\n$ v^2 = u^2 + 2as $\n\nwhere $ u $ is the velocity at $ t = 0 $, $ v $ the velocity at time $ t $, $ a $ the **constant** acceleration, and $ s $ the **displacement** — not the distance.',
    }),
    b('step_solver', 2, {
      title: 'The first one, straight from the definition',
      problem: 'Starting only from $ a = \\dfrac{dv}{dt} $ with $ a $ constant, show that $ v = u + at $.',
      intro: 'Three lines. Do them yourself once and you will never again wonder which way round the equation goes.',
      steps: [
        st('$ a = \\frac{dv}{dt} \\quad \\Rightarrow \\quad dv = a\\,dt $',
          'Rearranging the definition of acceleration. Nothing has been assumed yet.', {
            check: {
              kind: 'mcq',
              prompt: 'To get from a rate of change back to the quantity itself, what operation do we need?',
              options: ['Differentiate again', 'Integrate', 'Take the slope', 'Square both sides'],
              answer_index: 1,
              feedback_right: 'Yes — integration is the reverse of differentiation.',
              feedback_wrong: 'Differentiating took us from velocity to acceleration. To go back the other way we integrate — the same "area under the graph" idea from page 7, written algebraically.',
            },
          }),
        st('$ \\int_u^v dv = \\int_0^t a\\,dt = a \\int_0^t dt $',
          'Integrate both sides. The velocity runs from $ u $ to $ v $ while the time runs from $ 0 $ to $ t $ — **and $ a $ can only come outside the integral because it is constant.**', {
            why: 'That single move is where the constant-acceleration assumption enters. If $ a $ depended on time it would have to stay inside, and the whole derivation would change. Page 14 is about exactly that case.',
          }),
        st('$ v - u = at \\quad \\Rightarrow \\quad v = u + at $',
          'Evaluating both sides.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A body starts at $ u = 4 $ m/s with $ a = 3 $ m/s². What is $ v $ at $ t = 5 $ s, in m/s?',
              blank_answer: '19',
              feedback_right: 'Yes — $ 4 + 3(5) = 19 $ m/s.',
              feedback_wrong: '$ v = u + at = 4 + (3)(5) = 4 + 15 = 19 $ m/s.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A train decelerating at $ 0.5 $ m/s² is moving at $ 20 $ m/s. What is its velocity after $ 30 $ s?',
        answer: '5 m/s',
        solution: 'Decelerating means the acceleration opposes the motion, so with the direction of travel positive, $ a = -0.5 $ m/s². Then $ v = 20 + (-0.5)(30) = 20 - 15 = 5 $ m/s. Note it has not stopped — it would need another 10 s for that.',
      },
    }),
    b('step_solver', 3, {
      title: 'The second one, from the area under the graph',
      problem: 'Use the v–t graph of uniformly accelerated motion to show that $ s = ut + \\frac{1}{2}at^2 $.',
      intro: 'You already know the displacement is the area under a v–t graph. For constant acceleration that graph is a straight line, so the area is a shape you learnt in school.',
      steps: [
        st('The v–t graph is a straight line from $ u $ at $ t = 0 $ to $ v $ at time $ t $.',
          'Constant acceleration means constant slope, which means a straight line — the result from page 5.', {
            check: {
              kind: 'mcq',
              prompt: 'What shape is the region under that line, between $ t = 0 $ and time $ t $?',
              options: ['A rectangle', 'A triangle', 'A trapezium', 'A parabola'],
              answer_index: 2,
              feedback_right: 'Yes — two parallel vertical sides of heights $ u $ and $ v $.',
              feedback_wrong: 'The two vertical edges have different heights ($ u $ and $ v $), and the top is a straight sloping line. That is a trapezium. It becomes a triangle only in the special case $ u = 0 $.',
            },
          }),
        st('$ s = \\text{area} = \\underbrace{ut}_{\\text{rectangle}} + \\underbrace{\\frac{1}{2}(v-u)t}_{\\text{triangle}} $',
          'Split the trapezium into the rectangle of height $ u $ and the triangle of height $ (v - u) $ sitting on top of it.', {
            why: 'Splitting it this way, rather than using the trapezium formula directly, is what makes the next substitution obvious — the triangle\'s height is exactly the quantity the first equation gives us.',
          }),
        st('$ v - u = at $, so $ s = ut + \\frac{1}{2}(at)t = ut + \\frac{1}{2}at^2 $',
          'Substituting the first equation into the triangle\'s height.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A body starts from rest with $ a = 4 $ m/s². How far does it go in $ 3 $ s, in metres?',
              blank_answer: '18',
              feedback_right: 'Yes — with $ u = 0 $, $ s = \\frac{1}{2}(4)(9) = 18 $ m.',
              feedback_wrong: 'With $ u = 0 $ the first term vanishes, leaving $ s = \\frac{1}{2}at^2 = \\frac{1}{2}(4)(3^2) = 18 $ m.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A car moving at $ 12 $ m/s accelerates at $ 2 $ m/s² for $ 5 $ s. How far does it travel in that time?',
        answer: '85 m',
        solution: '$ s = ut + \\frac{1}{2}at^2 = 12(5) + \\frac{1}{2}(2)(25) = 60 + 25 = 85 $ m. Notice the two terms have clear meanings: 60 m is how far it would have gone at its original speed, and the extra 25 m is what the acceleration bought it.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('The three equations of motion apply only when:',
          ['The velocity is constant throughout the motion', 'The acceleration is constant in magnitude and direction', 'The motion starts from rest at the origin', 'The displacement is positive throughout'], 1,
          'Every derivation took the acceleration outside an integral, which is only allowed if it does not change. Constant velocity is a special case (with $ a = 0 $), and neither starting from rest nor a positive displacement is required.', 2),
        q('In $ s = ut + \\frac{1}{2}at^2 $, the quantity $ s $ is:',
          ['The distance travelled', 'The displacement', 'The path length', 'Always positive'], 1,
          'The derivation came from the signed area under the v–t graph, so $ s $ is the displacement. When the motion reverses, the distance travelled is larger — and that difference is the subject of the next page.', 2),
      ],
    }),
    b('step_solver', 5, {
      title: 'The third one, by eliminating time',
      problem: 'Show that $ v^2 = u^2 + 2as $, without using $ t $ anywhere in the answer.',
      intro: 'The third equation is not a new fact. It is the first two with the clock thrown away — which is exactly why it is so useful.',
      steps: [
        st('From $ v = u + at $: $ \\quad t = \\dfrac{v - u}{a} $',
          'Make time the subject of the first equation, so we have something to substitute.', {
            check: {
              kind: 'mcq',
              prompt: 'Why would we *want* an equation with no $ t $ in it?',
              options: [
                'Because time is hard to measure',
                'Because many questions neither give you the time nor ask for it',
                'Because $ t $ makes the algebra harder',
                'Because it is more accurate',
              ],
              answer_index: 1,
              feedback_right: 'Exactly — "how fast is it going after 200 m of braking?" never mentions time at all.',
              feedback_wrong: 'The point is practical. A great many problems give you $ u $, $ a $ and $ s $ and ask for $ v $ — with no time anywhere in the question. Finding $ t $ first and then discarding it is wasted work.',
            },
          }),
        st('Average velocity for constant $ a $ is $ \\bar{v} = \\dfrac{u+v}{2} $, so $ s = \\bar{v}\\,t = \\left(\\dfrac{u+v}{2}\\right)\\left(\\dfrac{v-u}{a}\\right) $',
          'Displacement is average velocity times time — and for a straight v–t line the average is the plain mean of the two end velocities.', {
            why: 'That $ \\bar{v} = \\frac{u+v}{2} $ step is worth flagging: it is **only true for constant acceleration**. On page 2 you saw that the plain mean is the wrong average for a journey split by distance. Here it is right, because the velocity changes at a steady rate.',
          }),
        st('$ s = \\dfrac{v^2 - u^2}{2a} \\quad \\Rightarrow \\quad v^2 = u^2 + 2as $',
          'The two brackets multiply to a difference of squares, and rearranging gives the third equation.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A body starts from rest and accelerates at $ 2 $ m/s² over $ 25 $ m. What is its final speed, in m/s?',
              blank_answer: '10',
              feedback_right: 'Yes — $ v^2 = 0 + 2(2)(25) = 100 $, so $ v = 10 $ m/s.',
              feedback_wrong: '$ v^2 = u^2 + 2as = 0 + 2(2)(25) = 100 $, so $ v = 10 $ m/s. No time was needed anywhere.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A stone is dropped from rest and falls $ 20 $ m. Find its speed on landing. Take $ g = 10 $ m/s².',
        answer: '20 m/s',
        solution: 'Taking downward as positive: $ u = 0 $, $ a = +10 $ m/s², $ s = +20 $ m. Then $ v^2 = 0 + 2(10)(20) = 400 $, so $ v = 20 $ m/s. This is the general free-fall result $ v = \\sqrt{2gh} $, which page 11 derives properly.',
      },
    }),
    b('callout', 6, {
      variant: 'exam_tip',
      title: 'Choosing the right equation in five seconds',
      markdown: 'There are five quantities — $ u $, $ v $, $ a $, $ t $, $ s $ — and each equation contains exactly four of them. So:\n\n**Find the quantity that is neither given nor asked for. Use the equation that leaves it out.**\n\n- No $ s $ in the question? → $ v = u + at $\n- No $ v $? → $ s = ut + \\frac{1}{2}at^2 $\n- No $ t $? → $ v^2 = u^2 + 2as $\n\nThat is the whole selection method, and it is faster than trying to remember which formula "looks right".',
    }),
    b('step_solver', 7, {
      title: 'Using the selection method',
      problem: 'A car moving at $ 15 $ m/s brakes with a constant deceleration and stops in $ 25 $ m. Find its deceleration, then the time it took to stop.',
      intro: 'Two parts, and the point is to notice that they need two different equations. Pick each one before you calculate.',
      steps: [
        st('Part 1: given $ u = 15 $, $ v = 0 $, $ s = 25 $; asked for $ a $. **Time is missing.**',
          'List what you have before touching a formula. Time appears nowhere — not given, not wanted.', {
            check: {
              kind: 'mcq',
              prompt: 'Which equation leaves time out?',
              options: ['$ v = u + at $', '$ s = ut + \\frac{1}{2}at^2 $', '$ v^2 = u^2 + 2as $', 'None of them'],
              answer_index: 2,
              feedback_right: 'Right — that is the one with no $ t $ in it.',
              feedback_wrong: 'Look at which letters appear in each. Only $ v^2 = u^2 + 2as $ has no $ t $, which makes it the right choice when time is neither given nor asked for.',
            },
          }),
        st('$ 0 = 15^2 + 2a(25) \\quad \\Rightarrow \\quad a = -\\dfrac{225}{50} = -4.5\\ \\text{m/s}^2 $',
          'Substituting. The negative sign is the arithmetic telling us the acceleration opposes the motion — which is what braking is.', {
            why: 'We did not have to decide the sign ourselves. We set the direction of travel as positive, put $ v = 0 $ in honestly, and the minus fell out. That is always safer than trying to reason the sign in advance.',
          }),
        st('Part 2: now $ a $ is known, so use $ v = u + at $: $ \\quad 0 = 15 + (-4.5)t $',
          'For the time, the missing quantity is now the displacement — so use the equation without $ s $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Solve $ 0 = 15 - 4.5t $ for $ t $, in seconds, to one decimal place.',
              blank_answer: '3.3',
              feedback_right: 'Yes — about 3.3 s.',
              feedback_wrong: '$ 4.5t = 15 $, so $ t = 15/4.5 = 3.33\\ldots \\approx 3.3 $ s.',
            },
          }),
        st('$ t \\approx 3.3\\ \\text{s} $',
          'So the car takes about 3.3 s to stop, over 25 m, decelerating at 4.5 m/s².', {
            why: 'A free check: the average velocity over the stop is $ (15+0)/2 = 7.5 $ m/s, and $ 7.5 \\times 3.3 \\approx 25 $ m. It agrees, so the two answers are consistent with each other.',
          }),
      ],
      now_you_try: {
        problem: 'A cyclist accelerates from rest at $ 1.5 $ m/s². How far has she travelled when her speed reaches $ 9 $ m/s, and how long did it take?',
        answer: '27 m in 6 s',
        solution: 'For the distance, time is missing: $ v^2 = u^2 + 2as $ gives $ 81 = 0 + 2(1.5)s $, so $ s = 27 $ m. For the time, $ s $ is now known but the cleanest route is $ v = u + at $: $ 9 = 0 + 1.5t $, so $ t = 6 $ s.',
      },
    }),
    b('text', 8, {
      markdown: 'Two more forms worth knowing. If the particle does not start at the origin but at some position $ x_0 $, replace $ s $ by $ (x - x_0) $:\n\n$ x = x_0 + ut + \\frac{1}{2}at^2 $ and $ v^2 = u^2 + 2a(x - x_0) $\n\nAnd the average-velocity relation we used in the derivation is worth remembering in its own right:\n\n$ \\bar{v} = \\frac{u+v}{2} \\quad \\text{(constant acceleration only)} $',
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('A particle starts from rest with constant acceleration. In the first $ 4 $ s it covers $ 16 $ m. How far does it cover in the first $ 8 $ s?',
          ['32 m', '64 m', '48 m', '128 m'], 1,
          'From rest, $ s = \\frac{1}{2}at^2 $, so the displacement is proportional to $ t^2 $. Doubling the time multiplies the displacement by four: $ 16 \\times 4 = 64 $ m. Answering 32 m assumes a proportionality to $ t $, which would only hold at constant velocity.', 3),
        q('For which of these is $ \\bar{v} = \\frac{u+v}{2} $ guaranteed to be correct?',
          ['Any motion at all', 'Motion with constant acceleration', 'Motion with constant speed only', 'Motion that never reverses'], 1,
          'The relation comes from the area under a *straight* v–t line, which requires the acceleration to be constant. For a curved v–t graph the average velocity is generally not the mean of the two end values.', 2),
        q('A body has $ u = 5 $ m/s and $ a = -2 $ m/s². Using $ v = u + at $, at what time is it momentarily at rest?',
          ['$ t = 2.5 $ s', '$ t = 10 $ s', '$ t = 2 $ s', 'It is never at rest'], 0,
          'Set $ v = 0 $: $ 0 = 5 - 2t $, so $ t = 2.5 $ s. After that instant the velocity becomes negative and the body moves back the other way — which is what makes the next page necessary.', 2),
      ],
    }),
    b('callout', 10, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ v = u + at $ · $ s = ut + \\frac{1}{2}at^2 $ · $ v^2 = u^2 + 2as $ — **constant acceleration only.**\n- They contain nothing beyond the definitions of $ v $ and $ a $. They are consequences, not laws.\n- **$ s $ is the displacement**, not the distance.\n- $ \\bar{v} = \\frac{u+v}{2} $, again for constant acceleration only.\n- **To choose an equation: find the quantity that is neither given nor asked for, and use the one that omits it.**',
    }),
    b('practice_bank', 11, {
      title: 'You solve it',
      intro: 'Eight questions. For each, write down which of the five quantities is missing before you pick a formula.',
      sections: [
        {
          id: 'p9-ysi',
          title: 'The three equations',
          items: [
            num('p9-y1', 'A particle starts with an initial velocity of $ 2.5 $ m/s along the positive x-direction and accelerates uniformly at $ 0.50 $ m/s². (a) Find the distance travelled in the first two seconds. (b) How long does it take to reach a velocity of $ 7.5 $ m/s? (c) How much distance will it cover in reaching that velocity?',
              '(a) 6.0 m  (b) 10 s  (c) 50 m',
              '(a) $ s = ut + \\frac{1}{2}at^2 = 2.5(2) + \\frac{1}{2}(0.5)(4) = 5.0 + 1.0 = 6.0 $ m. Since it never turns back, this is also the distance. (b) $ v = u + at $: $ 7.5 = 2.5 + 0.5t $, so $ t = 10 $ s. (c) $ v^2 = u^2 + 2as $: $ 56.25 = 6.25 + 2(0.5)s $, so $ s = 50 $ m.'),
            mcq('p9-y2', 'A car moving along a straight highway at $ 126 $ km/h is brought to a stop within a distance of $ 200 $ m. Its retardation is closest to:',
              ['$ 3.1 $ m/s²', '$ 6.2 $ m/s²', '$ 1.5 $ m/s²', '$ 0.6 $ m/s²'], 0,
              'Convert first: $ 126 $ km/h $ = 126 \\times \\frac{5}{18} = 35 $ m/s. Then $ 0 = 35^2 + 2a(200) $, giving $ a = -1225/400 = -3.06 $ m/s², a retardation of about $ 3.1 $ m/s². Forgetting the unit conversion is the single biggest source of error here.'),
            num('p9-y3', 'For the car in the previous question, how long does it take to stop?',
              'About 11.4 s',
              'With $ a = -3.06 $ m/s², $ v = u + at $ gives $ 0 = 35 - 3.06t $, so $ t = 35/3.06 \\approx 11.4 $ s. A quick check: average velocity $ = 17.5 $ m/s, and $ 17.5 \\times 11.4 \\approx 200 $ m. ✓'),
            mcq('p9-y4', 'A particle moves with constant acceleration. Its velocity at $ t = 0 $ is $ v_1 $ and at time $ t $ is $ v_2 $. Its average velocity over that interval is:',
              ['$ \\frac{v_1 + v_2}{2} $', '$ \\sqrt{v_1 v_2} $', '$ \\frac{2v_1v_2}{v_1+v_2} $', 'Not determinable without $ a $'], 0,
              'For constant acceleration the v–t graph is a straight line, so the average velocity is the plain mean of the two end values. The harmonic and geometric means belong to different situations — the harmonic mean, for instance, appears when a journey is split into equal *distances*.'),
            num('p9-y5', 'A body starts from rest and accelerates uniformly. If it covers $ 20 $ m in the first $ 2 $ s, how far does it cover in the first $ 6 $ s?',
              '180 m',
              'From rest, $ s \\propto t^2 $. Tripling the time multiplies the displacement by $ 3^2 = 9 $: $ 20 \\times 9 = 180 $ m. (Or find $ a $: $ 20 = \\frac{1}{2}a(4) $ gives $ a = 10 $ m/s², then $ s = \\frac{1}{2}(10)(36) = 180 $ m.)'),
            mcq('p9-y6', 'Which equation would you use to find the final velocity of a body given its initial velocity, its acceleration and the distance covered?',
              ['$ v = u + at $', '$ s = ut + \\frac{1}{2}at^2 $', '$ v^2 = u^2 + 2as $', '$ \\bar{v} = \\frac{u+v}{2} $'], 2,
              'Time is neither given nor asked for, so use the equation that omits it. Reaching for $ v = u + at $ would force you to find $ t $ first — extra work and an extra chance to slip.'),
            num('p9-y7', 'A train travelling at $ 20 $ m/s decelerates uniformly at $ 0.4 $ m/s². Find (a) the distance it covers before stopping and (b) the time it takes.',
              '(a) 500 m  (b) 50 s',
              '(a) $ 0 = 400 + 2(-0.4)s $, so $ s = 400/0.8 = 500 $ m. (b) $ 0 = 20 - 0.4t $, so $ t = 50 $ s. Check: average velocity $ 10 $ m/s $ \\times\\ 50 $ s $ = 500 $ m. ✓'),
            mcq('p9-y8', 'A body with constant acceleration travels distances $ s_1 $ in the first second and $ s_2 $ in the second second. If it starts from rest, then $ s_2/s_1 $ equals:',
              ['3', '2', '4', '1.5'], 0,
              'From rest, the distance in the first second is $ \\frac{1}{2}a $, and the total in two seconds is $ \\frac{1}{2}a(4) = 2a $. So the second second alone gives $ 2a - \\frac{1}{2}a = \\frac{3}{2}a $, and the ratio is 3. This is the first step of Galileo\'s 1 : 3 : 5 : 7 pattern, which the next page takes further.'),
          ],
        },
      ],
    }),
    b('text', 12, {
      markdown: 'The equations are easy. Using them without making a sign error is not — especially when a body goes one way, stops, and comes back.\n\nThat is the next page, and it is where most marks in this chapter are actually won and lost.',
    }),
  ],
};

// ── p10 · Using the Equations Without Getting Burned ──────────────────────────
const p10 = {
  page_number: 10,
  slug: 'using-the-equations-safely',
  title: 'Using the Equations Without Getting Burned',
  subtitle: 'Signs, the starting point, and where distance parts company with displacement',
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A ball is thrown **upward** at $ 10 $ m/s from the top of a $ 40 $ m tower. When does it hit the ground? Most students split this into "up to the top" and then "down to the ground", and do two separate calculations. There is a way to do the whole thing in one. Can you see what it needs?',
      hint: 'Ask what the acceleration is doing during the upward part, and during the downward part.',
      reveal: 'The acceleration is $ g $ downward for the **entire** flight — on the way up, at the top, and on the way down. It never changes.\n\nAnd every one of the three equations only requires that. So there is no need to break the motion into pieces at all: one application of $ s = ut + \\frac{1}{2}at^2 $, with the signs done honestly, covers the whole journey.\n\nSplitting it into two is not wrong — it is just twice the work and twice the opportunity to lose a sign.',
    }),
    b('text', 1, {
      markdown: 'Four rules make sign errors almost impossible. They look fussy. Follow them anyway for a week and they become automatic.\n\n1. **Declare the positive direction first**, in writing, before any number.\n2. **Measure $ s $ from the starting point** — the position at $ t = 0 $, not from wherever the velocity happens to be zero.\n3. **Substitute every quantity with its sign**, then let the algebra decide the answer.\n4. **One equation for the whole journey** whenever the acceleration is unchanged.',
    }),
    b('step_solver', 2, {
      title: 'The tower, in one equation',
      problem: 'A ball is thrown upward with a velocity of $ 10 $ m/s from the top of a tower $ 40 $ m high. Find the time when it strikes the ground. Take $ g = 10 $ m/s².',
      intro: 'Follow the four rules in order. The whole flight, one equation.',
      steps: [
        st('Take **upward as positive**. Then $ u = +10 $ m/s and $ a = -10 $ m/s².',
          'Rule 1. The ball is thrown up, so its initial velocity is positive; gravity pulls down, so the acceleration is negative.', {
            check: {
              kind: 'mcq',
              prompt: 'The ball ends up 40 m *below* its starting point. What is $ s $?',
              options: ['$ +40 $ m', '$ -40 $ m', '$ +80 $ m', '$ 0 $'],
              answer_index: 1,
              feedback_right: 'Right — displacement is measured from the start, and the finish is below it.',
              feedback_wrong: 'Rule 2: measure $ s $ from the starting point, which is the top of the tower. The ball finishes 40 m below that, and downward is negative here — so $ s = -40 $ m.',
            },
          }),
        st('$ s = -40\\ \\text{m} $ — measured from the top of the tower, where the ball began.',
          'Rule 2. Not from the ground, and not from the highest point the ball reaches.', {
            why: 'This is the step that goes wrong most often. Students measure $ s $ from the top of the *flight* rather than the start of it, or make it $ +40 $ because "the tower is 40 m tall". The tower\'s height is a distance; $ s $ is a signed displacement from the launch point.',
          }),
        st('$ -40 = 10t + \\frac{1}{2}(-10)t^2 \\quad \\Rightarrow \\quad 5t^2 - 10t - 40 = 0 \\quad \\Rightarrow \\quad t^2 - 2t - 8 = 0 $',
          'Rule 3. Substitute all three signed values and tidy into a standard quadratic.', {
            check: {
              kind: 'mcq',
              prompt: 'Factorise $ t^2 - 2t - 8 = 0 $. What are the two roots?',
              options: ['$ t = 4 $ and $ t = -2 $', '$ t = 2 $ and $ t = -4 $', '$ t = 4 $ and $ t = 2 $', '$ t = 8 $ and $ t = -1 $'],
              answer_index: 0,
              feedback_right: 'Yes — $ (t-4)(t+2) = 0 $.',
              feedback_wrong: 'We need two numbers multiplying to $ -8 $ and adding to $ -2 $: those are $ -4 $ and $ +2 $. So $ (t-4)(t+2) = 0 $, giving $ t = 4 $ and $ t = -2 $.',
            },
          }),
        st('$ t = 4\\ \\text{s} $ (taking the positive root)',
          'The ball strikes the ground 4 s after being thrown.', {
            why: 'And the rejected root is not meaningless. $ t = -2 $ s is where this same parabola *would* have started from ground level, 2 s before the throw, if the ball had been launched upward from the ground with the right speed to arrive at the tower top doing $ 10 $ m/s. The mathematics is describing the whole parabola; we only asked about part of it.',
          }),
      ],
      now_you_try: {
        problem: 'A stone is thrown downward at $ 5 $ m/s from the top of a $ 60 $ m tower. When does it hit the ground? Take $ g = 10 $ m/s².',
        answer: '3 s',
        solution: 'Take upward as positive: $ u = -5 $ m/s, $ a = -10 $ m/s², $ s = -60 $ m. Then $ -60 = -5t - 5t^2 $, so $ 5t^2 + 5t - 60 = 0 $, or $ t^2 + t - 12 = 0 $, giving $ (t+4)(t-3) = 0 $ and $ t = 3 $ s. (Taking downward as positive instead makes every sign positive and is arguably tidier here — either choice gives 3 s.)',
      },
    }),
    b('inline_quiz', 3, {
      pass_threshold: 0.6,
      questions: [
        q('In the equations of motion, the displacement $ s $ should be measured from:',
          ['The point where the velocity happens to be zero', 'The point where the particle was at $ t = 0 $', 'The ground, in every problem', 'The lowest point of the motion'], 1,
          'The derivations integrated from $ t = 0 $, so every quantity in the equations refers to that instant. $ s $ is the displacement from wherever the particle was when the clock started — not from the highest point, and not from the ground unless that happens to be the same place.', 2),
        q('A quadratic solved for the time of a projectile gives two roots, one positive and one negative. The negative root:',
          ['Means the calculation has gone wrong somewhere', 'Should be discarded as physically meaningless', 'Describes where the same parabola would have been before $ t = 0 $', 'Means the body never lands at all'], 2,
          'The equation describes an entire parabola, while the physical problem only starts at $ t = 0 $. The negative root is a real point on that parabola, just before the motion we asked about — worth understanding rather than only crossing out.', 3),
      ],
    }),
    b('heading', 4, {
      text: 'When distance parts company with displacement',
      level: 2,
      objective: 'Compute the distance travelled when the motion reverses partway through.',
    }),
    b('text', 5, {
      markdown: 'Here is the trap the equations set. They give you $ s $, the **displacement**. If the body reverses partway through, the **distance** travelled is larger — and no equation of motion will tell you so.\n\nThe fix is one extra step. Find the instant the velocity reaches zero:\n\n$ t_0 = \\left|\\frac{u}{a}\\right| $\n\nIf the time you are asked about is less than $ t_0 $, there has been no reversal and distance equals $ |s| $. If it is more, you must add the two legs separately.',
    }),
    b('step_solver', 6, {
      title: 'Distance and displacement for a ball thrown up',
      problem: 'A particle is projected vertically upward with velocity $ 40 $ m/s. Find the displacement and the distance travelled in (a) $ 2 $ s, (b) $ 4 $ s, (c) $ 6 $ s. Take $ g = 10 $ m/s².',
      intro: 'Three times, one motion. Watch where the two answers separate — and exactly why.',
      steps: [
        st('$ t_0 = \\left|\\dfrac{u}{a}\\right| = \\dfrac{40}{10} = 4\\ \\text{s} $',
          'Before anything else, find when the velocity hits zero. That is the only instant at which reversal can happen.', {
            check: {
              kind: 'mcq',
              prompt: 'For which of the three times will the distance differ from $ |s| $?',
              options: ['2 s only', '4 s only', '6 s only', 'All three'],
              answer_index: 2,
              feedback_right: 'Right — only 6 s is past the turning point at 4 s.',
              feedback_wrong: 'The reversal happens at $ t_0 = 4 $ s. Before that the particle has only gone one way, so distance and $ |s| $ agree. Only the 6 s case includes motion after the turn.',
            },
          }),
        st('(a) $ t = 2\\ \\text{s} < t_0 $: $ \\quad s = 40(2) - 5(4) = 60\\ \\text{m} $, and distance $ = 60\\ \\text{m} $',
          'Still on the way up, no reversal, so the two agree.', {
            why: 'This is the case where being sloppy costs nothing — which is precisely why students get caught later. Get into the habit of computing $ t_0 $ even when it turns out not to matter.',
          }),
        st('(b) $ t = 4\\ \\text{s} = t_0 $: $ \\quad s = 40(4) - 5(16) = 80\\ \\text{m} $, and distance $ = 80\\ \\text{m} $',
          'Exactly at the highest point. Still no reversal has happened, so the two are still equal — and 80 m is the maximum height.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now compute $ s $ at $ t = 6 $ s from $ s = 40t - 5t^2 $. Give the answer in metres.',
              blank_answer: '60',
              feedback_right: 'Yes — $ 240 - 180 = 60 $ m.',
              feedback_wrong: '$ s = 40(6) - 5(36) = 240 - 180 = 60 $ m. The particle is on its way back down and is 60 m above the launch point.',
            },
          }),
        st('(c) $ t = 6\\ \\text{s} > t_0 $: $ \\quad s = 60\\ \\text{m} $, but distance $ = 80 + 20 = 100\\ \\text{m} $',
          'It went up 80 m, then fell back 20 m in the remaining 2 s. Total path: 100 m. Displacement: only 60 m.', {
            why: 'The general form: distance $ = \\left|\\dfrac{u^2}{2a}\\right| + \\dfrac{1}{2}\\left|a(t - t_0)^2\\right| $ — the height climbed, plus the amount fallen back since the turn. Note the displacement at 6 s (60 m) is the *same* as at 2 s, which is the clearest possible sign that displacement cannot tell you how far something has travelled.',
          }),
      ],
      now_you_try: {
        problem: 'A particle is projected vertically upward at $ 20 $ m/s. Find its displacement and the distance travelled in $ 3 $ s. Take $ g = 10 $ m/s².',
        answer: 'Displacement $ 15 $ m; distance $ 25 $ m.',
        solution: '$ t_0 = 20/10 = 2 $ s, and $ 3 > 2 $, so there is a reversal. Displacement: $ s = 20(3) - 5(9) = 60 - 45 = 15 $ m. Distance: it rose $ u^2/2g = 400/20 = 20 $ m in the first 2 s, then fell $ \\frac{1}{2}(10)(1)^2 = 5 $ m in the third second, giving $ 20 + 5 = 25 $ m.',
      },
    }),
    b('heading', 7, {
      text: 'Displacement in the nth second — and a formula written badly',
      level: 2,
      objective: 'Find the displacement during a single named second, and explain why the usual formula is dimensionally sloppy.',
    }),
    b('text', 8, {
      markdown: 'A body starts from rest. How far does it go during **just the 5th second** — not the first five seconds, but the fifth one alone?\n\nThe honest method is to subtract: total in 5 s, minus total in 4 s. Most books instead print a formula, and it is worth looking at closely.',
    }),
    b('step_solver', 9, {
      title: 'The nth-second formula, and its problem',
      problem: 'Find the displacement of a particle during the $ n $th second of its motion, given initial velocity $ u $ and constant acceleration $ a $. Then check the result dimensionally.',
      intro: 'The derivation is a subtraction. The interesting part is what happens when you check the answer against Chapter 1.',
      steps: [
        st('$ s_n = \\left[u n + \\tfrac{1}{2}an^2\\right] - \\left[u(n-1) + \\tfrac{1}{2}a(n-1)^2\\right] $',
          'Displacement during the $ n $th second = total up to $ n $ seconds, minus total up to $ (n-1) $ seconds.', {
            check: {
              kind: 'mcq',
              prompt: 'To get the displacement during the 5th second, which two totals do you subtract?',
              options: [
                'The total in 5 s minus the total in 4 s',
                'The total in 5 s minus the total in 1 s',
                'The total in 6 s minus the total in 5 s',
                'Half the total in 5 s',
              ],
              answer_index: 0,
              feedback_right: 'Yes — the 5th second runs from $ t = 4 $ s to $ t = 5 $ s.',
              feedback_wrong: 'The "5th second" is the interval from $ t = 4 $ s to $ t = 5 $ s. So subtract the total distance at 4 s from the total at 5 s.',
            },
          }),
        st('$ s_n = u + \\dfrac{a}{2}(2n - 1) $',
          'Expanding and cancelling gives this compact result, which is the form printed in most books.', {
            why: 'Check it on a case you can verify: from rest ($ u = 0 $) with $ a = 10 $ m/s², the 1st second gives $ 5(1) = 5 $ m, the 2nd gives $ 5(3) = 15 $ m, the 3rd gives $ 5(5) = 25 $ m. Ratios 1 : 3 : 5 — Galileo\'s odd numbers, which we meet again below.',
          }),
        st('**But look at the dimensions.** $ u $ is a velocity, $ \\text{LT}^{-1} $. And $ \\frac{a}{2}(2n-1) $ is an acceleration, $ \\text{LT}^{-2} $, times a pure number.',
          'Those two terms have different dimensions. By the principle of homogeneity from Chapter 1, this equation as written **cannot be correct**.', {
            check: {
              kind: 'mcq',
              prompt: 'So what is actually wrong — the physics or the way it is written?',
              options: [
                'The physics is wrong; the formula gives wrong answers',
                'The way it is written; some unit factors have been left out',
                'Nothing — dimensions do not apply to this equation',
                'The subtraction was done incorrectly',
              ],
              answer_index: 1,
              feedback_right: 'Exactly. The numbers it produces are right; the notation is sloppy.',
              feedback_wrong: 'The answers it gives are correct — we just checked them against Galileo\'s ratios. What is wrong is the *writing*: the derivation quietly dropped the "per 1 second" factors, because $ n $ was treated as a plain number rather than a time.',
            },
          }),
        st('$ s_n = u(1\\ \\text{s}) + \\dfrac{a}{2}(2n - 1)(1\\ \\text{s})^2 $',
          'Restore the hidden one-second factors and the dimensions balance: both terms are now lengths.', {
            why: 'This is worth more than the formula itself. Your coaching material will print the short version, and it works — but now you know *why* it looks broken, and you know it gives a **displacement**, not necessarily a distance. If the particle reverses during that second, the two differ, exactly as on the first half of this page.',
          }),
      ],
      now_you_try: {
        problem: 'A body starts from rest with acceleration $ 4 $ m/s². Find its displacement during the 3rd second.',
        answer: '10 m',
        solution: 'Using $ s_n = u + \\frac{a}{2}(2n-1) $ with $ u = 0 $, $ a = 4 $, $ n = 3 $: $ s_3 = 0 + 2(5) = 10 $ m. Or by subtraction: total in 3 s is $ \\frac{1}{2}(4)(9) = 18 $ m, total in 2 s is $ \\frac{1}{2}(4)(4) = 8 $ m, and $ 18 - 8 = 10 $ m. ✓',
      },
    }),
    b('text', 10, {
      markdown: '**Galileo\'s law of odd numbers.** For a body falling from rest, the distances covered in successive equal intervals of time stand in the ratio\n\n$ 1 : 3 : 5 : 7 : 9 : 11 \\ldots $\n\nGalileo established this by experiment in the sixteenth century, long before anyone could write $ s = \\frac{1}{2}gt^2 $. It follows immediately from the nth-second result with $ u = 0 $, and it is a satisfying thing to be able to derive in two lines.',
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.6,
      questions: [
        q('A body falls freely from rest. The ratio of the distances it covers in the first, second and third seconds is:',
          ['1 : 2 : 3', '1 : 3 : 5', '1 : 4 : 9', '1 : 1 : 1'], 1,
          'Galileo\'s odd numbers. The *totals* after 1, 2 and 3 s go as $ 1 : 4 : 9 $ (proportional to $ t^2 $), and the differences between consecutive totals are $ 1, 3, 5 $ — the distances in each individual second.', 2),
        q('The formula $ s_n = u + \\frac{a}{2}(2n-1) $ as usually printed is:',
          ['Dimensionally correct and gives correct values', 'Dimensionally incorrect but gives correct values', 'Dimensionally correct but gives wrong values', 'Wrong in every respect'], 1,
          'It adds a velocity to an acceleration, so it fails the homogeneity test from Chapter 1 — yet it produces the right numbers, because the omitted factors are each numerically 1 in SI units. Restoring the "$ (1\\ \\text{s}) $" factors fixes the notation.', 3),
        q('A particle is projected upward at $ 30 $ m/s with $ g = 10 $ m/s². Over the first $ 4 $ s, its displacement and the distance travelled are:',
          ['40 m and 50 m', '40 m and 40 m', '50 m and 50 m', '20 m and 45 m'], 0,
          'It turns at $ t_0 = 3 $ s having risen $ 900/20 = 45 $ m. Displacement at 4 s: $ 30(4) - 5(16) = 40 $ m. In the fourth second it falls $ \\frac{1}{2}(10)(1)^2 = 5 $ m, so the distance is $ 45 + 5 = 50 $ m.', 3),
      ],
    }),
    b('callout', 12, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Declare the positive direction in writing** before any number goes down.\n- **Measure $ s $ from the position at $ t = 0 $** — not from the highest point, not from the ground.\n- **One equation for the whole journey** while the acceleration is unchanged. Splitting up is legal but doubles the sign risk.\n- A rejected negative root is a real point on the same parabola, just before your motion began.\n- If $ t > t_0 = |u/a| $, the motion has reversed and **distance $ > |s| $** — the equations will not warn you.\n- The nth-second formula gives a **displacement**, and as printed it is dimensionally sloppy. Now you know why.',
    }),
    b('practice_bank', 13, {
      title: 'You solve it',
      intro: 'Eight questions. Declare your positive direction on paper for every single one before you start.',
      sections: [
        {
          id: 'p10-ysi',
          title: 'Signs, starting points, distance and displacement',
          items: [
            num('p10-y1', 'A ball is thrown upward at $ 15 $ m/s from the edge of a cliff $ 20 $ m high. When does it reach the ground below? Take $ g = 10 $ m/s².',
              '4 s',
              'Upward positive: $ u = +15 $, $ a = -10 $, $ s = -20 $. Then $ -20 = 15t - 5t^2 $, so $ 5t^2 - 15t - 20 = 0 $, or $ t^2 - 3t - 4 = 0 $, giving $ (t-4)(t+1) = 0 $ and $ t = 4 $ s.'),
            mcq('p10-y2', 'A particle is projected vertically upward. At $ t = t_0 = |u/a| $, which statement is correct?',
              ['Both displacement and distance are equal, and both are maximal', 'The distance travelled already exceeds the displacement', 'The displacement is momentarily zero', 'The particle has returned to its starting point'], 0,
              'At $ t_0 $ the particle is exactly at its highest point, having travelled only one way, so distance and displacement are still equal — and both are at their maximum upward value. They only diverge afterwards.'),
            num('p10-y3', 'A body starts from rest with constant acceleration $ 6 $ m/s². Find its displacement during the 4th second.',
              '21 m',
              '$ s_n = u + \\frac{a}{2}(2n-1) = 0 + 3(7) = 21 $ m. Check by subtraction: $ \\frac{1}{2}(6)(16) - \\frac{1}{2}(6)(9) = 48 - 27 = 21 $ m. ✓'),
            mcq('p10-y4', 'For a freely falling body released from rest, the ratio of the distances covered in the first three seconds (each second taken separately) is:',
              ['1 : 3 : 5', '1 : 2 : 3', '1 : 4 : 9', '3 : 5 : 7'], 0,
              'Galileo\'s law of odd numbers. The $ 1 : 4 : 9 $ ratio belongs to the *cumulative* distances after 1, 2 and 3 s; the per-second distances are their successive differences.'),
            num('p10-y5', 'A particle is projected vertically upward at $ 50 $ m/s. Find the distance travelled and the displacement in $ 8 $ s. Take $ g = 10 $ m/s².',
              'Distance $ 170 $ m; displacement $ 80 $ m.',
              'The turning point is at $ t_0 = u/g = 5 $ s, by which time it has risen $ u^2/2g = 2500/20 = 125 $ m.\n\nIt then falls for the remaining $ 3 $ s, covering $ \\frac{1}{2}(10)(3)^2 = 45 $ m.\n\nSo the **distance** is $ 125 + 45 = 170 $ m, while the **displacement** is $ 125 - 45 = 80 $ m.\n\nCheck the displacement directly from the equation: $ s = 50(8) - 5(64) = 400 - 320 = 80 $ m. ✓ Getting both routes to agree is the check worth making every time.'),
            mcq('p10-y6', 'A stone dropped from a tower takes $ 4 $ s to reach the ground. The height of the tower is (take $ g = 10 $ m/s²):',
              ['80 m', '40 m', '160 m', '20 m'], 0,
              '$ s = \\frac{1}{2}gt^2 = \\frac{1}{2}(10)(16) = 80 $ m. Answering 40 m usually means using $ \\frac{1}{2}gt $ instead of $ \\frac{1}{2}gt^2 $ — the time is squared, which is why doubling the fall time quadruples the height.'),
            num('p10-y7', 'A car accelerates from rest at $ 2 $ m/s² for $ 5 $ s, then decelerates at $ 5 $ m/s² until it stops. Find the total distance travelled.',
              '35 m',
              'Phase 1: $ v = 2(5) = 10 $ m/s, $ s_1 = \\frac{1}{2}(2)(25) = 25 $ m. Phase 2: from $ 10 $ m/s to rest at $ 5 $ m/s², so $ s_2 = \\frac{v^2}{2a} = \\frac{100}{10} = 10 $ m. Total $ = 35 $ m. Handle each phase separately here — the acceleration changes, so no single equation covers both.'),
            mcq('p10-y8', 'A particle\'s motion gives a quadratic in $ t $ with roots $ t = 5 $ s and $ t = -3 $ s. The physically relevant answer and the meaning of the other root are:',
              ['$ 5 $ s; the other root must be an arithmetic error', '$ 5 $ s; the other root is where the parabola was before the motion began', '$ -3 $ s, because times can be negative here', 'Both roots are valid answers to the question'], 1,
              'The equation describes a whole parabola while the physical motion starts at $ t = 0 $, so only the positive root answers the question. The negative root is still a genuine point on that parabola — it is simply before the interval we asked about.'),
          ],
        },
      ],
    }),
    b('text', 14, {
      markdown: 'Every example on this page has quietly been about the same acceleration — the one every falling object on Earth shares.\n\nIt is worth a page of its own, because three situations that look completely different turn out to be one problem.',
    }),
  ],
};

// ── p11 · Free Fall ───────────────────────────────────────────────────────────
const p11 = {
  page_number: 11,
  slug: 'free-fall',
  title: 'Free Fall — One Acceleration, Three Situations',
  subtitle: 'Dropped, thrown down, thrown up: the same equation three times',
  glossary: [
    { term: 'free fall', definition: 'Motion under gravity alone, with air resistance neglected. The acceleration is g, downward, and it does not depend on the mass of the object.' },
    { term: 'g', definition: 'The acceleration due to gravity near the Earth\'s surface, about 9.8 m/s² downward. Treated as constant for heights small compared with the Earth\'s radius.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two balls are released from the same window at the same instant — one is simply dropped, the other is a cannonball ten times heavier. Which lands first?',
      hint: 'Ask what the acceleration of each one is.',
      reveal: 'They land together.\n\nIn free fall the acceleration is $ g $ **for every object, whatever its mass**. Nothing in $ s = \\frac{1}{2}gt^2 $ mentions mass, so nothing about the fall can depend on it.\n\nThis is genuinely surprising, and it stayed hidden for two thousand years because in real air a feather really does fall more slowly than a stone. The stone and the feather differ only because of the air — remove it, and they fall identically. Astronauts have done the experiment on the Moon with a hammer and a feather.',
    }),
    b('text', 1, {
      markdown: 'An object moving under gravity alone, with air resistance neglected, is in **free fall**. Its acceleration is $ g $, directed downward, with\n\n$ g \\approx 9.8\\ \\text{m/s}^2 $\n\nThis is a constant only because we stay close to the Earth\'s surface. Over a fall of a few hundred metres the variation is far too small to matter, so all three equations of motion apply — with $ a $ replaced by $ g $ and the correct sign.',
    }),
    b('inline_quiz', 74, {
      pass_threshold: 0.6,
      questions: [
        q('Free fall means motion under gravity with:',
          ['no air resistance and no other force acting', 'a constant velocity', 'the object starting from rest', 'the object falling vertically downward'], 0,
          'Free fall is defined by what is acting, not by how the motion looks. A ball thrown UPWARD is in free fall the whole way up, because gravity is still the only influence on it.', 2),
      ],
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'Which value of g should you use?',
      markdown: 'Use $ 9.8 $ m/s² unless the question tells you otherwise. Many books and papers use $ 10 $ m/s² to keep the arithmetic clean, and that is fine — **but say which one you are using**, and never mix them inside one solution.\n\nOn this page: worked examples follow whatever value the source problem states, and it is written next to the question every time.',
    }),
    b('text', 3, {
      markdown: 'The three situations look different and are not:\n\n- **Dropped** from rest — $ u = 0 $\n- **Thrown downward** — $ u $ points the same way as $ g $\n- **Thrown upward** — $ u $ points against $ g $\n\nOne equation covers all three. Only the sign and size of $ u $ change; $ a = -g $ throughout, with upward positive.',
    }),
    b('inline_quiz', 88, {
      pass_threshold: 0.6,
      questions: [
        q('Why is g treated as a constant in this chapter?',
          ['Because gravity never varies anywhere', 'Because the falls considered are tiny compared with the Earth’s radius', 'Because air resistance is neglected', 'Because the objects are small'], 1,
          'g does weaken with height, but over a fall of a few hundred metres the change is far too small to matter next to the Earth’s 6400 km radius. Neglecting air resistance is a separate assumption, and the object’s size is irrelevant.', 3),
        q('A heavy stone and a light stone are dropped together, air resistance neglected. The reason they land together is that:',
          ['Their weights happen to cancel', 'Mass appears in none of the equations of motion', 'The heavier one has more air resistance', 'They are the same size'], 1,
          'Every equation used for the fall involves only u, a, s and t — there is nowhere for the mass to enter. In real air the two differ, which is exactly what "air resistance neglected" removes.', 2),
      ],
    }),
    b('image', 4, {
      src: '',
      alt: 'Three vertical scenarios side by side: a ball dropped with u = 0, a ball thrown downward, and a ball thrown upward, each with a downward g arrow.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-free-fall-three-cases',
      caption: 'Three launches, one acceleration. The arrow for g is identical in all three — including for the ball on its way up.',
    }),
    b('step_solver', 5, {
      title: 'The three standard results, derived',
      problem: 'A ball is thrown vertically upward with speed $ u $. Derive its maximum height, the time to reach that height, and the total time of flight before it returns to the launch level.',
      intro: 'These three results appear in dozens of problems. Derive them once here and you may use them as shortcuts for the rest of the course.',
      steps: [
        st('At the highest point $ v = 0 $. Using $ v^2 = u^2 + 2as $ with $ a = -g $: $ \\quad 0 = u^2 - 2gh $',
          'The defining feature of the highest point is that the velocity is momentarily zero — that is what "highest" means.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is $ v = 0 $ at the top, rather than the acceleration?',
              options: [
                'Both are zero at the top',
                'The velocity is zero because the ball stops rising; the acceleration is still $ g $',
                'The acceleration is zero because the ball stops',
                'Neither is zero',
              ],
              answer_index: 1,
              feedback_right: 'Right — and if the acceleration were also zero the ball would stay up there.',
              feedback_wrong: 'The ball stops moving for an instant, so $ v = 0 $. But gravity does not switch off — the acceleration stays $ g $ downward, which is exactly what brings the ball back. This was the whole point of page 6.',
            },
          }),
        st('$ h = \\dfrac{u^2}{2g} $',
          'The maximum height. Note it goes as the **square** of the launch speed — throw twice as fast and you go four times as high.', {
            why: 'Sanity check the shape of the formula: a bigger $ u $ must give a bigger $ h $ (it does), and a bigger $ g $ must give a smaller $ h $ (it does — the same throw on the Moon goes six times higher). A formula that fails either check is misremembered.',
          }),
        st('Time up, from $ v = u + at $: $ \\quad 0 = u - g\\,t_{\\text{up}} \\quad \\Rightarrow \\quad t_{\\text{up}} = \\dfrac{u}{g} $',
          'Same instant, different equation — this one gives the time rather than the height.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The downward journey is the upward one in reverse, so $ t_{\\text{down}} = t_{\\text{up}} $. What is the total time of flight, in terms of $ u $ and $ g $? Write it as 2u/g if that is your answer.',
              blank_answer: '2u/g',
              feedback_right: 'Yes — the two halves are equal, so the total is $ 2u/g $.',
              feedback_wrong: 'Going up and coming back down take the same time, so the total flight time is twice $ u/g $, that is $ 2u/g $.',
            },
          }),
        st('$ t_{\\text{up}} = t_{\\text{down}} = \\dfrac{u}{g} $, total flight $ T = \\dfrac{2u}{g} $, and it returns at speed $ u $',
          'It comes back to the launch level with the same speed it left — though the velocity now points the other way.', {
            why: 'One more standard result, from the same working: a ball **dropped** from height $ h $ lands at $ v = \\sqrt{2gh} $, taking $ t = \\sqrt{2h/g} $. That is just $ v^2 = u^2 + 2as $ and $ s = \\frac{1}{2}at^2 $ with $ u = 0 $. You may quote all five of these from now on — you have derived them.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is projected vertically upward at $ 50 $ m/s. Find (a) the maximum height, (b) the time to reach it, and (c) its speed at half the maximum height. Take $ g = 10 $ m/s².',
        answer: '(a) 125 m  (b) 5 s  (c) about 35.4 m/s',
        solution: '(a) $ h = u^2/2g = 2500/20 = 125 $ m. (b) $ t = u/g = 50/10 = 5 $ s. (c) At $ h/2 = 62.5 $ m: $ v^2 = 2500 - 2(10)(62.5) = 2500 - 1250 = 1250 $, so $ v = \\sqrt{1250} \\approx 35.4 $ m/s. Note it is **not** half the launch speed — at half the height the ball still has half its original kinetic energy, so its speed is $ u/\\sqrt{2} $, not $ u/2 $.',
      },
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('Two stones of different masses are dropped simultaneously from the same height, with air resistance neglected. They:',
          ['Reach the ground together', 'The heavier one reaches first', 'The lighter one reaches first', 'It depends on their shapes'], 0,
          'The acceleration in free fall is $ g $ for every object regardless of mass, and no equation of motion contains the mass. In real air, shape matters a great deal — but "air resistance neglected" removes exactly that effect.', 1),
        q('A ball thrown upward at $ u $ returns to the thrower\'s hand. Its speed on return is:',
          ['$ u $', '$ u/2 $', '$ 2u $', 'Zero'], 0,
          'The downward journey mirrors the upward one exactly, so the ball arrives back at the launch level with the same speed. The *velocity* has reversed sign, which is a different statement.', 2),
        q('If the maximum height reached by a ball thrown upward is to be doubled, the launch speed must be multiplied by:',
          ['multiplied by $ \\sqrt{2} $', 'multiplied by exactly 2', 'multiplied by exactly 4', 'halved, i.e. $ \\times 1/2 $'], 0,
          'Since $ h = u^2/2g $, the height goes as the square of the speed. Doubling $ h $ therefore needs $ u $ multiplied by $ \\sqrt{2} $, not by 2 — doubling $ u $ would quadruple the height.', 3),
      ],
    }),
    b('step_solver', 7, {
      title: 'Thrown up from a height — both methods',
      problem: 'A ball is thrown vertically upward at $ 20 $ m/s from the top of a multistorey building. The point of release is $ 25.0 $ m above the ground. (a) How high will the ball rise? (b) How long will it be before the ball hits the ground? Take $ g = 10 $ m/s².',
      intro: 'Part (b) can be done two ways. Do both — the comparison is the lesson.',
      steps: [
        st('(a) $ v^2 = u^2 + 2a(y - y_0) $ with $ v = 0 $, $ u = +20 $, $ a = -10 $: $ \\quad 0 = 400 - 20(y - y_0) $',
          'Take the y-axis vertically upward with zero at the ground. The rise is measured from the release point.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Solve $ 0 = 400 - 20(y - y_0) $ for the rise $ (y - y_0) $, in metres.',
              blank_answer: '20',
              feedback_right: 'Yes — it rises 20 m above the release point.',
              feedback_wrong: '$ 20(y - y_0) = 400 $, so the rise is $ 20 $ m. (The ball therefore reaches 45 m above the ground.)',
            },
          }),
        st('(b) **Method 1 — split the flight.** Up: $ 0 = 20 - 10t_1 $, so $ t_1 = 2 $ s. Down from $ 45 $ m: $ 0 = 45 - 5t_2^2 $, so $ t_2 = 3 $ s. Total $ = 5 $ s.',
          'Two separate calculations, each starting from rest or from a known point. It works.', {
            why: 'Note that the downward leg starts from the *highest* point, 45 m above the ground — not from the roof. Getting that height wrong is the usual failure of this method, and it is a failure the second method cannot have.',
          }),
        st('(b) **Method 2 — one equation.** $ y = y_0 + ut + \\frac{1}{2}at^2 $ with $ y_0 = 25 $, $ y = 0 $, $ u = +20 $, $ a = -10 $:',
          'Just the start and the finish, with the whole flight in between handled by the algebra.', {
            check: {
              kind: 'mcq',
              prompt: 'Substituting gives $ 0 = 25 + 20t - 5t^2 $. What does that simplify to?',
              options: ['$ t^2 - 4t - 5 = 0 $', '$ t^2 + 4t - 5 = 0 $', '$ t^2 - 4t + 5 = 0 $', '$ 5t^2 - 20t + 25 = 0 $'],
              answer_index: 0,
              feedback_right: 'Yes — divide through by $ -5 $ to get $ t^2 - 4t - 5 = 0 $.',
              feedback_wrong: 'Rearranging: $ 5t^2 - 20t - 25 = 0 $, then divide by 5 to get $ t^2 - 4t - 5 = 0 $. Watch the sign on the constant term.',
            },
          }),
        st('$ (t-5)(t+1) = 0 \\quad \\Rightarrow \\quad t = 5\\ \\text{s} $',
          'The same answer, in one step instead of three.', {
            why: '**Method 2 is better**, and not just because it is shorter: it never asks you to work out where the highest point is, so it cannot go wrong there. The general lesson — while the acceleration is unchanged, you do not need to care about the shape of the path.',
          }),
      ],
      now_you_try: {
        problem: 'A ball is thrown upward at $ 10 $ m/s from a balcony $ 15 $ m above the ground. Using one equation, find when it lands. Take $ g = 10 $ m/s².',
        answer: '3 s',
        solution: 'Upward positive, origin at the ground: $ y_0 = 15 $, $ y = 0 $, $ u = +10 $, $ a = -10 $. Then $ 0 = 15 + 10t - 5t^2 $, so $ t^2 - 2t - 3 = 0 $, giving $ (t-3)(t+1) = 0 $ and $ t = 3 $ s.',
      },
    }),
    b('step_solver', 8, {
      title: 'At the same height twice',
      problem: 'A ball thrown upward from the ground is at a height of $ 80 $ m at two different instants, and the interval between them is $ 6 $ s. Find the launch speed $ u $. Take $ g = 10 $ m/s².',
      intro: 'A harder one. The key realisation is that "at 80 m at two instants" means a quadratic with two roots — and the question tells you their difference.',
      steps: [
        st('$ 80 = ut - 5t^2 \\quad \\Rightarrow \\quad 5t^2 - ut + 80 = 0 $',
          'Set the displacement to 80 m. This is a quadratic in $ t $, and it has two roots because the ball passes 80 m twice — once going up, once coming down.', {
            check: {
              kind: 'mcq',
              prompt: 'Why are there two solutions rather than one?',
              options: [
                'Because the equation is quadratic, which always gives two',
                'Because the ball passes 80 m twice — rising and falling',
                'Because one root is negative and must be discarded',
                'Because the launch speed is unknown',
              ],
              answer_index: 1,
              feedback_right: 'Yes — the two roots are the two real instants at that height.',
              feedback_wrong: 'Both roots here are physically real: the ball is at 80 m once on the way up and once on the way down. This is different from the tower problem, where one root fell before the motion started.',
            },
          }),
        st('$ t = \\dfrac{u \\pm \\sqrt{u^2 - 1600}}{10} $',
          'The quadratic formula, with $ a = 5 $, $ b = -u $, $ c = 80 $.', {
            why: 'Notice the discriminant $ u^2 - 1600 $. If $ u^2 < 1600 $ there are no real roots at all — meaning the ball never reaches 80 m. So $ u $ must be at least $ 40 $ m/s, which is a useful check on the answer we are about to get.',
          }),
        st('$ t_2 - t_1 = \\dfrac{2\\sqrt{u^2 - 1600}}{10} = 6 \\quad \\Rightarrow \\quad \\sqrt{u^2 - 1600} = 30 $',
          'The difference of the two roots is given as 6 s. Everything else cancels.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Square both sides and solve for $ u $. Give the positive value in m/s.',
              blank_answer: '50',
              feedback_right: 'Yes — $ u^2 = 900 + 1600 = 2500 $, so $ u = 50 $ m/s.',
              feedback_wrong: 'Squaring gives $ u^2 - 1600 = 900 $, so $ u^2 = 2500 $ and $ u = 50 $ m/s (taking the positive root, since the ball was thrown upward).',
            },
          }),
        st('$ u = 50\\ \\text{m/s} $',
          'And it passes our check: 50 m/s is comfortably above the 40 m/s needed to reach 80 m at all.', {
            why: 'A quicker route worth knowing: by symmetry the two instants sit either side of the highest point, so the ball is at 80 m exactly 3 s before and 3 s after the top. Since $ t_{\\text{up}} = u/g $, the top is at $ u/10 $, and the ball is at 80 m at $ t = u/10 - 3 $. Substituting that into the displacement equation gives the same $ u = 50 $ m/s.',
          }),
      ],
      now_you_try: {
        problem: 'A ball thrown upward from the ground is at a height of $ 15 $ m at two instants separated by $ 2 $ s. Find its launch speed. Take $ g = 10 $ m/s².',
        answer: '20 m/s',
        solution: '$ 15 = ut - 5t^2 $ gives $ 5t^2 - ut + 15 = 0 $, with roots differing by $ \\frac{2\\sqrt{u^2 - 300}}{10} = 2 $. So $ \\sqrt{u^2 - 300} = 10 $, hence $ u^2 = 400 $ and $ u = 20 $ m/s. Check: $ h_{\\max} = 400/20 = 20 $ m, comfortably above 15 m. ✓',
      },
    }),
    b('reasoning_prompt', 9, {
      reasoning_type: 'logical',
      prompt: 'A person standing at the edge of a roof throws two balls, A and B, with the **same speed**. Ball A is thrown vertically upward and ball B vertically downward. Which ball hits the ground first, and which hits the ground with the greater speed? Give a reason for each answer.',
      reveal: '**Ball B hits first.** It starts moving downward immediately, while A has to go up, stop, and come back down past the roof — and by the time A passes the roof again it is moving downward at exactly the speed B started with. So A is simply B, delayed by $ 2u/g $.\n\n**Both hit the ground with the same speed.** That delay is the *only* difference between them. When A returns to the roof it has the same speed as B had at launch, pointing the same way, so from that moment on the two motions are identical. Whatever speed B arrives with, A arrives with too.\n\nYou can also see it from $ v^2 = u^2 + 2gh $: the equation contains $ u^2 $, which does not care about the sign of $ u $. Throwing up or down at the same speed gives the same landing speed.\n\n**And a third consequence worth noticing:** ball A is in the air longer, so if you were asked which ball travelled the greater *distance*, the answer is A — by exactly twice its rise height.',
      difficulty_level: 3,
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.6,
      questions: [
        q('A ball dropped from rest falls a height $ h $. Its landing speed is:',
          ['$ \\sqrt{2gh} $', '$ 2gh $', '$ \\sqrt{gh} $', '$ gh $'], 0,
          'From $ v^2 = u^2 + 2as $ with $ u = 0 $, $ a = g $, $ s = h $: $ v^2 = 2gh $, so $ v = \\sqrt{2gh} $. A dimensional check settles it instantly — $ 2gh $ has units of m²/s², which is a speed squared, not a speed.', 2),
        q('A ball is thrown upward and another is thrown downward from the same height with the same speed. Comparing their speeds on landing:',
          ['They are equal', 'The upward one is faster', 'The downward one is faster', 'It depends on the height'], 0,
          'The relation $ v^2 = u^2 + 2gh $ involves $ u^2 $, which is unchanged by reversing the direction of launch. The upward ball simply takes longer to get there — the extra time is the whole difference.', 3),
        q('The time taken by a body to fall freely from rest through a height $ h $ is:',
          ['$ \\sqrt{2h/g} $', '$ 2h/g $', '$ \\sqrt{h/2g} $', '$ h/g $'], 0,
          'From $ h = \\frac{1}{2}gt^2 $, rearranging gives $ t^2 = 2h/g $ and so $ t = \\sqrt{2h/g} $. Note it depends on $ \\sqrt{h} $, so a fall four times as high takes only twice as long.', 2),
      ],
    }),
    b('callout', 11, {
      variant: 'remember',
      title: 'The five free-fall results you may now quote',
      markdown: 'You derived all of these on this page, so you are allowed to use them directly:\n\n- Maximum height for a launch speed $ u $: $ \\quad h = \\dfrac{u^2}{2g} $\n- Time up $ = $ time down $ = \\dfrac{u}{g} $, so total flight $ T = \\dfrac{2u}{g} $\n- Returns to the launch level at the **same speed** $ u $\n- Dropped from height $ h $: lands at $ v = \\sqrt{2gh} $\n- Dropped from height $ h $: takes $ t = \\sqrt{2h/g} $\n\nAnd the one to keep hold of: **mass appears in none of them.**',
    }),
    b('practice_bank', 12, {
      title: 'You solve it',
      intro: 'Eight questions. Where a value of $ g $ is needed and not stated, use $ 10 $ m/s² and say so in your working.',
      sections: [
        {
          id: 'p11-ysi',
          title: 'Free fall',
          items: [
            num('p11-y1', 'A ball is thrown up at $ 4.0 $ m/s. Find the maximum height reached. Take $ g = 10 $ m/s².',
              '0.80 m',
              '$ h = \\frac{u^2}{2g} = \\frac{16}{20} = 0.80 $ m. Or from $ v^2 = u^2 - 2gh $ with $ v = 0 $: $ 0 = 16 - 20h $, giving the same answer.'),
            mcq('p11-y2', 'A stone is released from rest from an elevator that is moving **upward** with acceleration $ a $. The acceleration of the stone just after release is:',
              ['$ g $ downward', '$ (g - a) $ downward', '$ (g + a) $ downward', '$ a $ upward'], 0,
              'Once released, the only influence on the stone is gravity, so its acceleration is $ g $ downward regardless of what the elevator was doing. The elevator\'s motion set the stone\'s initial *velocity*, not its acceleration — a distinction this chapter has returned to repeatedly.'),
            num('p11-y3', 'A ball is dropped from a height of $ 45 $ m. Find (a) the time it takes to land and (b) its landing speed. Take $ g = 10 $ m/s².',
              '(a) 3 s  (b) 30 m/s',
              '(a) $ t = \\sqrt{2h/g} = \\sqrt{90/10} = 3 $ s. (b) $ v = \\sqrt{2gh} = \\sqrt{900} = 30 $ m/s, or simply $ v = gt = 10(3) = 30 $ m/s.'),
            mcq('p11-y4', 'A ball is thrown vertically upward. At its highest point:',
              ['Velocity is zero, acceleration is $ g $ downward', 'Both velocity and acceleration are zero', 'Velocity is $ g $, acceleration is zero', 'Both are non-zero'], 0,
              'The ball is momentarily at rest, so its velocity is zero — but gravity has not stopped acting, so the acceleration remains $ g $ downward. If it were zero the ball would hover there indefinitely.'),
            num('p11-y5', 'A body is dropped from a tower and reaches the ground in $ 5 $ s. Find (a) the tower\'s height and (b) the distance fallen during the last second. Take $ g = 10 $ m/s².',
              '(a) 125 m  (b) 45 m',
              '(a) $ h = \\frac{1}{2}(10)(25) = 125 $ m. (b) Distance in 4 s is $ \\frac{1}{2}(10)(16) = 80 $ m, so the last second accounts for $ 125 - 80 = 45 $ m. Note the body covers more than a third of the whole tower in that final second — falls accelerate.'),
            mcq('p11-y6', 'Two balls are thrown from the top of a building with the same speed, one upward and one downward. Which has the greater **time of flight** to the ground?',
              ['The upward one', 'The downward one', 'They are equal', 'It depends on the building height'], 0,
              'The upward ball must first rise, stop, and return to the launch level — arriving there with exactly the downward ball\'s launch velocity. So its flight is longer by precisely $ 2u/g $, whatever the building height. Their landing *speeds*, though, are identical.'),
            num('p11-y7', 'A ball thrown upward returns to the thrower after $ 6 $ s. Find (a) the launch speed and (b) the maximum height reached. Take $ g = 10 $ m/s².',
              '(a) 30 m/s  (b) 45 m',
              '(a) The total flight is $ T = 2u/g $, so $ 6 = 2u/10 $ and $ u = 30 $ m/s. (b) $ h = u^2/2g = 900/20 = 45 $ m. Alternatively, the time up is 3 s, so $ h = \\frac{1}{2}(10)(9) = 45 $ m. ✓'),
            mcq('p11-y8', 'A ball thrown upward reaches a maximum height $ h $. At what height is its speed half its launch speed?',
              ['$ 3h/4 $', '$ h/2 $', '$ h/4 $', '$ h/\\sqrt{2} $'], 0,
              'Using $ v^2 = u^2 - 2gy $ with $ v = u/2 $: $ u^2/4 = u^2 - 2gy $, so $ 2gy = 3u^2/4 $ and $ y = 3u^2/8g $. Since $ h = u^2/2g $, this is $ \\frac{3}{4}h $. The ball loses three-quarters of its height budget before its speed halves, because speed depends on the square root.'),
          ],
        },
      ],
    }),
    b('text', 13, {
      markdown: 'Free fall is the most famous application of these equations. The next page is the most useful one — the physics of stopping a car, which is the only part of this chapter you may one day need in a hurry.',
    }),
  ],
};

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureChapter(db);
    await upsertPages(db, bookId, [p9, p10, p11]);
  });
  console.log('\n✅ Ch.2 wave 2a complete — pages 9–11');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
