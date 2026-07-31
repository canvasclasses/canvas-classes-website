'use strict';
/**
 * Class 11 Physics · Chapter 2 "Motion in One Dimension" — pages 12–14.
 * Wave 2b: stopping distance and reaction time, relative velocity in 1-D, and
 * the case where the three equations stop working.
 *
 * SOURCE NOTE on p13 (plan §7 item 2): NCERT's contents box lists §2.5
 * "Relative velocity" but its BODY IS ABSENT from our copy of the reprint.
 * So this page is sourced from the two reference books and **does not cite
 * NCERT for the section**. NCERT Exercise 2.14 *is* printed in our copy and is
 * cited normally.
 *
 * Run: node scripts/physics11-book/build_ch2_relative.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch2');

// ── p12 · Stopping Distance and Reaction Time ─────────────────────────────────
const p12 = {
  page_number: 12,
  slug: 'stopping-distance-and-reaction-time',
  title: 'Stopping Distance and Reaction Time',
  subtitle: 'The one page in this chapter you may need in a hurry',
  glossary: [
    { term: 'stopping distance', definition: 'The distance a vehicle travels between the brakes being applied and the vehicle coming to rest.' },
    { term: 'reaction time', definition: 'The time a person takes to observe a situation, think, and act. Typically about 0.2 s for a simple response.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'You are driving at 40 km/h and you brake hard. Now imagine the same car, the same brakes, the same road — but you are doing 80 km/h. Does it take twice as far to stop?',
      hint: 'Which equation connects speed and distance without mentioning time?',
      reveal: 'It takes **four times** as far.\n\nThe equation with no time in it is $ v^2 = u^2 + 2as $, and setting $ v = 0 $ gives a stopping distance of $ u^2/2a $. The speed is **squared**. Double it and the stopping distance quadruples.\n\nThis is not a small technical point. It is the reason speed limits outside schools are set where they are, and the reason "I was only going a bit faster" is a much worse argument than it sounds.',
    }),
    b('step_solver', 1, {
      title: 'Deriving the stopping distance',
      problem: 'A vehicle moving at speed $ v_0 $ brakes with a constant retardation of magnitude $ a $. Derive an expression for the distance it travels before stopping.',
      intro: 'One equation, chosen with the selection method from page 9. The result is worth remembering, and so is its shape.',
      steps: [
        st('Given $ v_0 $ and $ a $; asked for $ s $; final velocity is $ 0 $. **Time is missing.**',
          'The question never mentions time and never asks for it, so use the equation that leaves it out.', {
            check: {
              kind: 'mcq',
              prompt: 'Which equation should we use?',
              options: ['$ v = u + at $', '$ s = ut + \\frac{1}{2}at^2 $', '$ v^2 = u^2 + 2as $', '$ \\bar{v} = \\frac{u+v}{2} $'],
              answer_index: 2,
              feedback_right: 'Right — the one with no $ t $.',
              feedback_wrong: 'Time is neither given nor asked for, so the right choice is $ v^2 = u^2 + 2as $. The others would force you to find $ t $ first and then throw it away.',
            },
          }),
        st('$ 0 = v_0^2 + 2(-a)\\,d_s \\quad \\Rightarrow \\quad d_s = \\dfrac{v_0^2}{2a} $',
          'Taking the direction of travel as positive, the retardation enters as $ -a $. The vehicle stops, so the final velocity is zero.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A car at $ 20 $ m/s brakes at $ 5 $ m/s². How many metres to stop?',
              blank_answer: '40',
              feedback_right: 'Yes — $ 400/10 = 40 $ m.',
              feedback_wrong: '$ d_s = v_0^2/2a = 400/(2 \\times 5) = 40 $ m.',
            },
          }),
        st('$ d_s = \\dfrac{v_0^2}{2a} $ — proportional to the **square** of the speed',
          'So the stopping distance depends on the speed squared, and only inversely on how good your brakes are.', {
            why: 'Read the formula for what it tells a driver. Better brakes give you a *linear* improvement. Slowing down gives you a *quadratic* one. Halving your speed does four times as much for your stopping distance as doubling your braking power would.',
          }),
      ],
      now_you_try: {
        problem: 'A car travelling at $ 30 $ m/s brakes at $ 6 $ m/s². Find its stopping distance. Then find the stopping distance if it had been travelling at $ 15 $ m/s.',
        answer: '75 m, then 18.75 m',
        solution: 'At $ 30 $ m/s: $ d_s = 900/12 = 75 $ m. At $ 15 $ m/s: $ d_s = 225/12 = 18.75 $ m. Halving the speed cut the stopping distance to a **quarter**, not a half — which is the whole point of the squared term.',
      },
    }),
    b('callout', 2, {
      variant: 'real_world',
      title: 'Real braking data for one car',
      markdown: 'For a car of a particular make, the measured braking distances were:\n\n| Speed | Braking distance |\n|---|---|\n| 11 m/s | 10 m |\n| 15 m/s | 20 m |\n| 20 m/s | 34 m |\n| 25 m/s | 50 m |\n\nCheck the pattern against $ d_s = v_0^2/2a $. From the first row, $ 2a \\approx 121/10 \\approx 12 $, so $ a \\approx 6 $ m/s². Now predict the others: $ 225/12 \\approx 19 $ m, $ 400/12 \\approx 33 $ m, $ 625/12 \\approx 52 $ m.\n\nAgainst the measured 20, 34 and 50 m. The formula is not an idealisation here — **it describes a real car to within a couple of metres.**',
    }),
    b('inline_quiz', 3, {
      pass_threshold: 0.6,
      questions: [
        q('If the speed of a vehicle is tripled, its braking distance (same brakes, same road) becomes:',
          ['3 times', '6 times', '9 times', 'Unchanged'], 2,
          'Braking distance goes as the square of the speed, so tripling the speed multiplies it by $ 3^2 = 9 $. Answering "3 times" treats the relationship as linear, which is exactly the intuition that makes speeding feel safer than it is.', 2),
        q('Two identical cars brake with the same retardation, one from $ 10 $ m/s and one from $ 20 $ m/s. The ratio of their stopping distances is:',
          ['1 : 2', '1 : 4', '2 : 1', '1 : 1'], 1,
          'Since $ d_s \\propto v_0^2 $, the ratio is $ 10^2 : 20^2 = 100 : 400 = 1 : 4 $.', 2),
      ],
    }),
    b('heading', 4, {
      text: 'The part before the brakes',
      level: 2,
      objective: 'Add reaction distance to braking distance to get the true stopping distance.',
    }),
    b('text', 5, {
      markdown: 'There is a gap between a hazard appearing and the brakes actually being applied. You have to see it, recognise it, decide, and move your foot. That interval is your **reaction time**, and during it the car does not slow down at all.\n\nSo the real total is\n\n$ \\text{total stopping distance} = \\underbrace{v_0 t_r}_{\\text{reaction}} + \\underbrace{\\frac{v_0^2}{2a}}_{\\text{braking}} $\n\nNote the two terms behave differently: the first is **linear** in speed, the second **quadratic**. At low speed the reaction distance dominates; at high speed the braking distance does.',
    }),
    b('step_solver', 6, {
      title: 'Measuring your own reaction time',
      problem: 'A friend holds a ruler vertically and drops it without warning; you catch it between thumb and forefinger. The ruler falls $ 21.0 $ cm before you catch it. Estimate your reaction time. Take $ g = 9.8 $ m/s².',
      intro: 'This is an experiment you can do in ten seconds with a ruler and a friend, and it is a genuine measurement of something about you.',
      steps: [
        st('The ruler is in **free fall** from rest, so $ u = 0 $ and $ a = g $.',
          'Nobody pushes it — it is released, so it starts from rest and gravity does the rest.', {
            check: {
              kind: 'mcq',
              prompt: 'Which equation connects the distance fallen to the time, for a body starting from rest?',
              options: ['$ v = gt $', '$ d = \\frac{1}{2}gt^2 $', '$ v^2 = 2gd $', '$ d = gt $'],
              answer_index: 1,
              feedback_right: 'Right — that is the one relating distance and time.',
              feedback_wrong: 'We know the distance and want the time, so we need the equation containing both: $ d = \\frac{1}{2}gt^2 $. The other two involve the velocity, which we never measured.',
            },
          }),
        st('$ d = \\frac{1}{2}g t_r^2 \\quad \\Rightarrow \\quad t_r = \\sqrt{\\dfrac{2d}{g}} $',
          'Rearranging for the time. Convert the distance to metres before substituting: $ 21.0 $ cm $ = 0.210 $ m.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\sqrt{2(0.210)/9.8} $. Give the answer in seconds to one decimal place.',
              blank_answer: '0.2',
              feedback_right: 'Yes — about 0.2 s.',
              feedback_wrong: '$ 2(0.210)/9.8 = 0.0429 $, and $ \\sqrt{0.0429} = 0.207 \\approx 0.2 $ s.',
            },
          }),
        st('$ t_r \\approx 0.2\\ \\text{s} $',
          'About two-tenths of a second — a typical figure for a simple, expected response.', {
            why: 'Now put that number to work. At $ 20 $ m/s (72 km/h), a 0.2 s reaction time means the car travels **4 metres before the brakes even engage**. And a real reaction to something unexpected on a road is more like 0.7 s, which is 14 metres. That is often the whole difference.',
          }),
      ],
      now_you_try: {
        problem: 'In the same experiment a different person catches the ruler after it has fallen $ 30.0 $ cm. What is their reaction time? Take $ g = 9.8 $ m/s².',
        answer: 'About 0.25 s',
        solution: '$ t_r = \\sqrt{2(0.300)/9.8} = \\sqrt{0.0612} = 0.247 \\approx 0.25 s $. A longer fall means a slower reaction — and note that a 43% longer fall corresponds to only a 24% longer time, because the distance depends on $ t^2 $.',
      },
    }),
    b('step_solver', 7, {
      title: 'The full stopping distance',
      problem: 'A car is travelling at $ 25 $ m/s. The driver\'s reaction time is $ 0.6 $ s and the car brakes at $ 5 $ m/s². Find the total distance from the hazard appearing to the car stopping.',
      intro: 'Two contributions, added. The interesting part is which one is bigger.',
      steps: [
        st('Reaction distance: $ \\quad v_0 t_r = 25 \\times 0.6 = 15\\ \\text{m} $',
          'During the reaction time the speed is unchanged, so this part is simply speed times time.', {
            check: {
              kind: 'mcq',
              prompt: 'Why do we use $ v_0 t_r $ and not $ \\frac{1}{2}at_r^2 $ for this part?',
              options: [
                'Because the reaction time is short',
                'Because the car is not decelerating yet — the brakes are not on',
                'Because $ a $ is unknown during the reaction',
                'Because the driver is not looking',
              ],
              answer_index: 1,
              feedback_right: 'Exactly — no braking means no acceleration, so it is plain uniform motion.',
              feedback_wrong: 'During the reaction time the driver has not yet touched the brakes, so there is no deceleration at all. The car simply continues at $ v_0 $, which makes it a uniform-motion calculation.',
            },
          }),
        st('Braking distance: $ \\quad \\dfrac{v_0^2}{2a} = \\dfrac{625}{10} = 62.5\\ \\text{m} $',
          'Now the brakes are on, and this is the result from the top of the page.', {
            why: 'Notice the split: 15 m of reaction against 62.5 m of braking. At this speed the braking term dominates. Repeat the calculation at 5 m/s and you get 3 m of reaction against 2.5 m of braking — the reaction term now dominates. The crossover is at $ v_0 = 2a t_r $.',
          }),
        st('Total $ = 15 + 62.5 = 77.5\\ \\text{m} $',
          'Nearly eighty metres — the length of a football pitch\'s width, from seeing the hazard to being stopped.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now repeat for the same car and driver at $ 12.5 $ m/s (half the speed). What is the total, in metres?',
              blank_answer: '23.125',
              feedback_right: 'Yes — $ 7.5 + 15.625 = 23.125 $ m, well under a third of the original.',
              feedback_wrong: 'Reaction: $ 12.5 \\times 0.6 = 7.5 $ m. Braking: $ 156.25/10 = 15.625 $ m. Total $ 23.125 $ m. Halving the speed cut the total to less than a third, because only one of the two terms halved — the other quartered.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A driver with a reaction time of $ 0.8 $ s is travelling at $ 20 $ m/s and can brake at $ 4 $ m/s². Find the total stopping distance.',
        answer: '66 m',
        solution: 'Reaction distance $ = 20 \\times 0.8 = 16 $ m. Braking distance $ = 400/8 = 50 $ m. Total $ = 66 $ m.',
      },
    }),
    b('step_solver', 8, {
      title: 'Working backwards from a road test',
      problem: 'A car moving along a straight highway at $ 126 $ km/h is brought to a stop within $ 200 $ m. What is the retardation of the car, assumed uniform, and how long does it take to stop?',
      intro: 'A real-numbers version, and the first thing to do is not physics.',
      steps: [
        st('$ 126\\ \\text{km/h} = 126 \\times \\dfrac{5}{18} = 35\\ \\text{m/s} $',
          'Convert to SI first, before touching an equation. Mixing km/h with metres and seconds is the most common single error in this whole chapter.', {
            check: {
              kind: 'mcq',
              prompt: 'The conversion factor from km/h to m/s is:',
              options: ['$ \\times \\frac{18}{5} $', '$ \\times \\frac{5}{18} $', '$ \\times 1000 $', '$ \\times 3.6 $'],
              answer_index: 1,
              feedback_right: 'Yes — $ 1000/3600 = 5/18 $.',
              feedback_wrong: 'One km/h is $ 1000 $ m per $ 3600 $ s, which is $ 5/18 $ m/s. Multiplying by $ 18/5 $ goes the other way, from m/s to km/h.',
            },
          }),
        st('$ 0 = 35^2 + 2a(200) \\quad \\Rightarrow \\quad a = -\\dfrac{1225}{400} = -3.06\\ \\text{m/s}^2 $',
          'Time is neither given nor asked for in this first part, so use $ v^2 = u^2 + 2as $.', {
            why: 'The minus sign came out of the arithmetic, as it should. The magnitude, 3.06 m/s², is the retardation. Quoting it as "$ -3.06 $ m/s² of retardation" would be doubly negative and wrong — retardation is already the magnitude of an opposing acceleration.',
          }),
        st('$ 0 = 35 + (-3.06)t \\quad \\Rightarrow \\quad t = \\dfrac{35}{3.06} \\approx 11.4\\ \\text{s} $',
          'Now the displacement is the missing quantity, so switch to $ v = u + at $.', {
            check: {
              kind: 'mcq',
              prompt: 'A quick consistency check: average velocity $ \\times $ time should give the 200 m. What is the average velocity here?',
              options: ['$ 35 $ m/s', '$ 17.5 $ m/s', '$ 3.06 $ m/s', '$ 11.4 $ m/s'],
              answer_index: 1,
              feedback_right: 'Right — and $ 17.5 \\times 11.4 \\approx 200 $ m. ✓',
              feedback_wrong: 'For constant acceleration the average velocity is the mean of the end values: $ (35 + 0)/2 = 17.5 $ m/s. And $ 17.5 \\times 11.4 \\approx 200 $ m, confirming both answers.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A train travelling at $ 72 $ km/h is brought to rest in $ 100 $ m. Find its retardation and the time taken.',
        answer: '$ 2 $ m/s²; $ 10 $ s',
        solution: '$ 72 $ km/h $ = 72 \\times \\frac{5}{18} = 20 $ m/s. Then $ 0 = 400 + 2a(100) $, so $ a = -2 $ m/s², a retardation of 2 m/s². And $ 0 = 20 - 2t $ gives $ t = 10 $ s. Check: average velocity $ 10 $ m/s $ \\times\\ 10 $ s $ = 100 $ m. ✓',
      },
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('During the reaction time, the vehicle:',
          ['Decelerates at half the braking rate', 'Continues at constant speed', 'Stops immediately', 'Accelerates'], 1,
          'The brakes have not been applied yet, so there is no deceleration. The vehicle covers $ v_0 t_r $ at unchanged speed — which is why reaction distance is linear in the speed while braking distance is quadratic.', 2),
        q('At which speed does the reaction distance make up the larger share of the total stopping distance?',
          ['At high speed', 'At low speed', 'The same share at all speeds', 'It never contributes'], 1,
          'Reaction distance grows linearly with speed while braking distance grows as the square, so the braking term takes over as the speed rises. At low speeds the reaction distance is the bigger of the two.', 3),
        q('A ruler dropped through someone\'s fingers falls $ 5 $ cm before being caught. Their reaction time is closest to (take $ g = 10 $ m/s²):',
          ['$ 0.1 $ s', '$ 0.2 $ s', '$ 0.3 $ s', '$ 0.5 $ s'], 0,
          '$ t_r = \\sqrt{2d/g} = \\sqrt{2(0.05)/10} = \\sqrt{0.01} = 0.1 $ s. A quarter of the 21 cm fall corresponds to half the time, because distance goes as $ t^2 $.', 2),
      ],
    }),
    b('callout', 10, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- Braking distance $ d_s = \\dfrac{v_0^2}{2a} $ — **proportional to the square of the speed.** Double the speed, quadruple the distance.\n- Total stopping distance $ = v_0 t_r + \\dfrac{v_0^2}{2a} $: a **linear** reaction term plus a **quadratic** braking term.\n- Reaction time from a dropped ruler: $ t_r = \\sqrt{2d/g} $, typically about 0.2 s for an expected response.\n- **Convert km/h to m/s before doing anything else** — multiply by $ 5/18 $.',
    }),
    b('practice_bank', 11, {
      title: 'You solve it',
      intro: 'Seven questions. Convert every speed to m/s before you start, every time.',
      sections: [
        {
          id: 'p12-ysi',
          title: 'Stopping, braking and reacting',
          items: [
            num('p12-y1', 'A car travelling at $ 54 $ km/h brakes at $ 3 $ m/s². Find its braking distance.',
              '37.5 m',
              '$ 54 $ km/h $ = 54 \\times \\frac{5}{18} = 15 $ m/s. Then $ d_s = v_0^2/2a = 225/6 = 37.5 $ m.'),
            mcq('p12-y2', 'A vehicle\'s braking distance at $ 40 $ km/h is $ 8 $ m. On the same road with the same brakes, its braking distance at $ 120 $ km/h will be:',
              ['24 m', '48 m', '72 m', '16 m'], 2,
              'The speed is tripled, and braking distance goes as the square of the speed, so the distance is multiplied by 9: $ 8 \\times 9 = 72 $ m. Answering 24 m applies a linear scaling.'),
            num('p12-y3', 'A driver with a reaction time of $ 0.5 $ s travelling at $ 30 $ m/s can brake at $ 6 $ m/s². Find (a) the reaction distance, (b) the braking distance and (c) the total.',
              '(a) 15 m  (b) 75 m  (c) 90 m',
              '(a) $ 30 \\times 0.5 = 15 $ m at unchanged speed. (b) $ 900/12 = 75 $ m. (c) $ 15 + 75 = 90 $ m. Note that the braking term is five times the reaction term at this speed.'),
            mcq('p12-y4', 'A ruler falls $ 20 $ cm before being caught. Doubling the person\'s reaction time would make the fall distance:',
              ['40 cm', '80 cm', '10 cm', '28 cm'], 1,
              'The distance fallen goes as $ t_r^2 $, so doubling the reaction time quadruples the distance: $ 20 \\times 4 = 80 $ cm. This is the same squared relationship as the braking distance, which is not a coincidence — both come from $ s = \\frac{1}{2}at^2 $.'),
            num('p12-y5', 'A car moving at $ 90 $ km/h is brought to rest in $ 50 $ m. Find its retardation.',
              '6.25 m/s²',
              '$ 90 $ km/h $ = 25 $ m/s. Then $ 0 = 625 + 2a(50) $, so $ a = -6.25 $ m/s², a retardation of $ 6.25 $ m/s².'),
            mcq('p12-y6', 'Two drivers travel at the same speed on the same road. Driver P has twice the reaction time of driver Q. Comparing their total stopping distances:',
              ['P\'s total is exactly twice Q\'s total', 'P\'s is longer than Q\'s, but not double', 'The two totals are exactly equal', 'Q\'s total is the longer of the two'], 1,
              'Only the reaction term differs, and it is just one of the two contributions. Doubling the reaction time doubles that term while leaving the braking term untouched, so P\'s total is longer but by less than a factor of two.'),
            num('p12-y7', 'A cyclist moving at $ 8 $ m/s brakes and stops in $ 4 $ s. Find (a) the retardation and (b) the distance covered while stopping.',
              '(a) 2 m/s²  (b) 16 m',
              '(a) $ 0 = 8 + a(4) $, so $ a = -2 $ m/s², a retardation of 2 m/s². (b) Either $ s = 8(4) - \\frac{1}{2}(2)(16) = 32 - 16 = 16 $ m, or average velocity $ 4 $ m/s $ \\times\\ 4 $ s $ = 16 $ m.'),
          ],
        },
      ],
    }),
    b('text', 12, {
      markdown: 'Every calculation so far has quietly assumed you are standing still, watching things move.\n\nBut what if you are moving too? That changes every number — and it is the last big idea in this chapter.',
    }),
  ],
};

// ── p13 · Relative Velocity in One Dimension ──────────────────────────────────
const p13 = {
  page_number: 13,
  slug: 'relative-velocity-in-one-dimension',
  title: 'Relative Velocity in One Dimension',
  subtitle: 'What motion looks like from something that is itself moving',
  glossary: [
    { term: 'relative velocity', definition: 'The velocity of one object as measured from another. v_AB, the velocity of A with respect to B, equals v_A − v_B.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Your height is 167 cm and your friend\'s is 162 cm. Someone asks: "how tall are you, relative to your friend?" You answer 5 cm without thinking about it. What operation did you just perform — and does it have anything to do with physics?',
      hint: 'Write down what you did as an equation.',
      reveal: 'You subtracted. And yes — that is the *entire* idea, for every quantity there is.\n\n"Relative" always means **subtract the reference from the thing you are describing**. Your height relative to your friend is $ 167 - 162 = 5 $ cm. A car\'s velocity relative to another car is one velocity minus the other. It works the same way for positions, velocities and accelerations.\n\nSo there is genuinely nothing new to learn here. There is only one thing to be careful about: **which way round the subtraction goes.**',
    }),
    b('text', 1, {
      markdown: 'Written down, the velocity of A **with respect to** B is\n\n$ v_{AB} = v_A - v_B $\n\nRead the subscripts in order: *A with respect to B*. Swap them and the sign flips:\n\n$ v_{AB} = -v_{BA} $\n\nand the same rule applies to accelerations:\n\n$ a_{AB} = a_A - a_B $',
    }),
    b('step_solver', 2, {
      title: 'Two people walking in opposite directions',
      problem: 'Anoop is moving due east at $ 1 $ m/s and Dhyani is moving due west at $ 2 $ m/s. What is the velocity of Anoop with respect to Dhyani?',
      intro: 'A deliberately small problem. The whole difficulty is signs, so do them explicitly.',
      steps: [
        st('Take **east as positive**. Then $ v_A = +1 $ m/s and $ v_D = -2 $ m/s.',
          'Declare the positive direction first, exactly as on page 10. Dhyani moves west, which is negative.', {
            check: {
              kind: 'mcq',
              prompt: 'We want "Anoop with respect to Dhyani". Which subtraction is that?',
              options: ['$ v_D - v_A $', '$ v_A - v_D $', '$ v_A + v_D $', '$ |v_A| + |v_D| $'],
              answer_index: 1,
              feedback_right: 'Right — the subscripts read in order: A first, then "with respect to" B.',
              feedback_wrong: 'Read $ v_{AD} $ as "velocity of A with respect to D", which is $ v_A - v_D $. Getting this backwards gives an answer of the right size and the wrong sign.',
            },
          }),
        st('$ v_{AD} = v_A - v_D = (+1) - (-2) $',
          'Substituting both signed values. Watch the double negative.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ (+1) - (-2) $. Give the number with its sign.',
              blank_answer: '3',
              feedback_right: 'Yes — subtracting a negative adds.',
              feedback_wrong: '$ (+1) - (-2) = 1 + 2 = +3 $. Subtracting a negative number is the same as adding its magnitude.',
            },
          }),
        st('$ v_{AD} = +3\\ \\text{m/s} $, i.e. $ 3 $ m/s due east',
          'From Dhyani\'s point of view, Anoop is moving away east at 3 m/s — faster than Anoop is moving over the ground.', {
            why: 'This is why closing speeds feel so alarming. Two cars each doing 60 km/h towards each other approach at 120 km/h, and the physics of the collision is governed by that 120, not by either 60. **Opposite directions make relative speeds add; the same direction makes them subtract.** You never have to remember which — the signs do it for you.',
          }),
      ],
      now_you_try: {
        problem: 'Two trains travel on parallel tracks in the same direction, one at $ 30 $ m/s and the other at $ 20 $ m/s. Find the velocity of the faster with respect to the slower, and then of the slower with respect to the faster.',
        answer: '$ +10 $ m/s and $ -10 $ m/s',
        solution: 'Taking the direction of travel as positive: $ v_{FS} = 30 - 20 = +10 $ m/s, so a passenger on the slower train sees the faster one pull ahead at 10 m/s. And $ v_{SF} = 20 - 30 = -10 $ m/s — a passenger on the faster train sees the slower one drift backwards at 10 m/s. Same size, opposite sign, exactly as $ v_{AB} = -v_{BA} $ requires.',
      },
    }),
    b('inline_quiz', 3, {
      pass_threshold: 0.6,
      questions: [
        q('Two cars approach each other head-on, each at $ 40 $ km/h. Their relative speed is:',
          ['0', '40 km/h', '80 km/h', '20 km/h'], 2,
          'Taking one direction as positive, the velocities are $ +40 $ and $ -40 $, so the relative velocity is $ 40 - (-40) = 80 $ km/h. Opposite directions make the relative speed the sum.', 1),
        q('A passenger on a train moving at $ 25 $ m/s sees a second train, on a parallel track, appear stationary. The second train\'s velocity relative to the ground is:',
          ['0', '$ 25 $ m/s in the same direction', '$ 25 $ m/s in the opposite direction', '$ 50 $ m/s'], 1,
          'Appearing stationary means the relative velocity is zero, so $ v_2 - v_1 = 0 $ and $ v_2 = v_1 $. Both trains are doing 25 m/s in the same direction — which is exactly the experience of a train seeming to stand still beside you.', 2),
      ],
    }),
    b('heading', 4, {
      text: 'When both objects share the same acceleration',
      level: 2,
      objective: 'Explain why two bodies in free fall see each other move at constant velocity.',
    }),
    b('text', 5, {
      markdown: 'Apply the subtraction rule to accelerations and something useful drops out.\n\nIf two bodies have the **same** acceleration, then\n\n$ a_{AB} = a_A - a_B = 0 $\n\nSo in each other\'s frame they have **no acceleration at all** — they see each other move at constant velocity.\n\nAnd every object in free fall has the same acceleration, $ g $. So two stones falling together, whatever their masses and whenever they were released, drift apart at a perfectly steady rate.',
    }),
    b('step_solver', 6, {
      title: 'Two stones falling',
      problem: 'A stone is dropped from a height. One second later, a second stone is dropped from the same point. Describe how the gap between them changes with time. Take $ g = 10 $ m/s².',
      intro: 'Try to guess first: does the gap grow, shrink, or stay the same? Most people guess wrong.',
      steps: [
        st('Both stones have $ a = g $ downward, so $ a_{12} = g - g = 0 $.',
          'Whatever else happens, neither stone accelerates relative to the other.', {
            check: {
              kind: 'mcq',
              prompt: 'Zero relative acceleration means the gap between them changes:',
              options: ['At a constant rate', 'At an increasing rate', 'At a decreasing rate', 'Not at all'],
              answer_index: 0,
              feedback_right: 'Right — zero relative acceleration means constant relative velocity.',
              feedback_wrong: 'Zero relative acceleration means the relative *velocity* is constant, not zero. So the gap changes steadily — at a constant number of metres per second.',
            },
          }),
        st('At the moment the second is released, the first has been falling 1 s, so $ v_1 = 10 $ m/s and $ v_2 = 0 $.',
          'The relative velocity at that instant is $ 10 - 0 = 10 $ m/s.', {
            why: 'And because the relative acceleration is zero, that 10 m/s **never changes**. The first stone always pulls away from the second at exactly 10 m/s, however long they fall.',
          }),
        st('At that same instant the gap is already $ \\frac{1}{2}(10)(1)^2 = 5\\ \\text{m} $.',
          'The first stone had a one-second head start, so it is 5 m below the release point when the second stone is let go. That head start is the starting gap.', {
            check: {
              kind: 'mcq',
              prompt: 'So the gap at time $ t $ after the second release is:',
              options: ['$ 10t $', '$ 5 + 10t $', '$ 5t $', '$ 5t^2 $'],
              answer_index: 1,
              feedback_right: 'Right — the 5 m head start plus 10 m of extra separation every second.',
              feedback_wrong: 'The gap is the starting separation plus the relative velocity times the time: $ 5 + 10t $. Writing just $ 10t $ forgets the head start the first stone already had.',
            },
          }),
        st('gap $ = 5 + 10t $ metres, where $ t $ is measured from the release of the second stone',
          'A straight line, not a curve — growing steadily at 10 metres every second from a 5 m start.', {
            check: {
              kind: 'fill_blank',
              prompt: 'How far apart are the two stones $ 3 $ s after the second one is released? Give the answer in metres.',
              blank_answer: '35',
              feedback_right: 'Yes — $ 5 + 30 = 35 $ m.',
              feedback_wrong: 'Use $ 5 + 10t = 5 + 30 = 35 $ m. Check it the long way: stone 1 has been falling 4 s and has covered $ \\frac{1}{2}(10)(16) = 80 $ m; stone 2 has been falling 3 s and has covered $ \\frac{1}{2}(10)(9) = 45 $ m. And $ 80 - 45 = 35 $ m. ✓',
            },
          }),
        st('The gap grows **linearly**, even though each stone is accelerating.',
          'Two accelerating bodies, and the distance between them grows at a perfectly steady rate.', {
            why: 'This is genuinely counter-intuitive, and it is exactly the kind of result that relative motion is *for*. Thinking about each stone separately, you get two quadratics and have to subtract them. Thinking in the relative frame, you get one constant velocity and the answer is immediate.',
          }),
      ],
      now_you_try: {
        problem: 'Two balls are dropped from the same point, $ 2 $ s apart. At what rate does the distance between them increase? Take $ g = 10 $ m/s².',
        answer: 'At a constant $ 20 $ m/s',
        solution: 'When the second ball is released, the first has been falling 2 s and so is moving at $ 10 \\times 2 = 20 $ m/s while the second is at rest. The relative velocity is therefore 20 m/s, and since both share the same acceleration $ g $, the relative acceleration is zero and that 20 m/s never changes.',
      },
    }),
    b('heading', 7, {
      text: 'The trick: freeze one body and the problem halves',
      level: 2,
      objective: 'Solve an overtaking problem by working in the frame of one of the two bodies.',
    }),
    b('text', 8, {
      markdown: 'Here is what relative motion is actually worth in an exam.\n\nA two-body problem — "when does A catch B?" — normally needs two position equations and a simultaneous solve. But if you work **in B\'s frame**, B is not moving at all. You have a one-body problem with the relative initial velocity and the relative acceleration, and the gap to close is just the initial separation.\n\nSame answer, half the algebra, and far fewer places to slip.',
    }),
    b('step_solver', 9, {
      title: 'One car overtaking another',
      problem: 'Cars A and B start moving simultaneously in the same direction along the line joining them. Car A starts from rest with a constant acceleration of $ 4 $ m/s², while car B moves at a constant $ 1 $ m/s. At $ t = 0 $, car A is $ 10 $ m behind car B. Find the time when A overtakes B.',
      intro: 'Solve it in B\'s frame. B will not move at all, and the problem becomes a single body closing a 10 m gap.',
      steps: [
        st('$ u_{AB} = u_A - u_B = 0 - 1 = -1\\ \\text{m/s} $',
          'The relative initial velocity. Negative — at the very first instant A is actually falling further behind, because it starts from rest while B is already moving.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the relative acceleration: $ a_{AB} = a_A - a_B $. Compute it, in m/s².',
              blank_answer: '4',
              feedback_right: 'Yes — B has no acceleration, so the relative acceleration is just A\'s.',
              feedback_wrong: '$ a_{AB} = 4 - 0 = 4 $ m/s². Car B moves at constant velocity, so its acceleration is zero.',
            },
          }),
        st('$ a_{AB} = 4\\ \\text{m/s}^2 $. In B\'s frame, A starts at $ -1 $ m/s and accelerates at $ 4 $ m/s², and must cover $ 10 $ m.',
          'The whole problem is now one body, one equation. B sits still and watches.', {
            why: 'Note what happened to the awkwardness. In the ground frame both cars are moving and you must equate two different position functions. In B\'s frame there is only one moving object and one distance to cover.',
          }),
        st('$ 10 = (-1)t + \\frac{1}{2}(4)t^2 \\quad \\Rightarrow \\quad 2t^2 - t - 10 = 0 $',
          'Using $ s = ut + \\frac{1}{2}at^2 $ with the relative quantities.', {
            check: {
              kind: 'mcq',
              prompt: 'Solve $ 2t^2 - t - 10 = 0 $. Which pair of roots is correct?',
              options: ['$ t = 2.5 $ and $ t = -2 $', '$ t = 2 $ and $ t = -2.5 $', '$ t = 5 $ and $ t = -1 $', '$ t = 2.5 $ and $ t = 2 $'],
              answer_index: 0,
              feedback_right: 'Yes — the discriminant is $ 1 + 80 = 81 $, so $ t = (1 \\pm 9)/4 $.',
              feedback_wrong: 'The discriminant is $ b^2 - 4ac = 1 + 80 = 81 $, so $ t = \\frac{1 \\pm 9}{4} $, giving $ t = 2.5 $ and $ t = -2 $.',
            },
          }),
        st('$ t = 2.5\\ \\text{s} $',
          'A overtakes B 2.5 seconds after they both set off.', {
            why: 'Check it in the ground frame if you like: A has gone $ \\frac{1}{2}(4)(6.25) = 12.5 $ m, and B has gone $ 1 \\times 2.5 = 2.5 $ m from a point 10 m ahead, so B is at $ 12.5 $ m too. They agree — but notice how much longer that check took than the relative-frame solution did.',
          }),
      ],
      now_you_try: {
        problem: 'Car A starts from rest with acceleration $ 2 $ m/s². Car B, $ 12 $ m ahead, moves at a constant $ 4 $ m/s in the same direction, starting at the same instant. When does A catch B?',
        answer: '$ t = 6 $ s',
        solution: 'In B\'s frame: $ u_{AB} = 0 - 4 = -4 $ m/s, $ a_{AB} = 2 - 0 = 2 $ m/s², and the gap to close is $ 12 $ m. So $ 12 = -4t + t^2 $, giving $ t^2 - 4t - 12 = 0 $, which factorises as $ (t-6)(t+2) = 0 $, so $ t = 6 $ s. Check in the ground frame: A has gone $ \\frac{1}{2}(2)(36) = 36 $ m, and B has gone $ 4(6) = 24 $ m from a point 12 m ahead, putting it at 36 m too. ✓',
      },
    }),
    b('reasoning_prompt', 10, {
      reasoning_type: 'logical',
      prompt: 'A food packet is dropped from a plane flying horizontally at a steady speed, from an altitude of 100 m. What is the path of the packet as seen by the pilot? What is its path as seen by someone standing on the ground? And if a third person asks you "but what is the *actual* path?", what will you answer?',
      reveal: '**From the pilot:** a straight line, vertically down. The packet keeps the plane\'s horizontal velocity, so it stays directly beneath the plane the whole way — the pilot sees it simply drop away.\n\n**From the ground:** a curve. The packet has a constant horizontal velocity *and* a downward acceleration, so it traces a parabola forwards and down. (That is the next chapter\'s subject.)\n\n**And the third question is the interesting one: there is no "actual" path.** Both descriptions are complete and correct in their own frame, and neither is privileged. Asking which is real is like asking whether the book on your table is "really" at rest or "really" orbiting the Sun — the question has no answer because it is missing the words "with respect to".\n\nThis is the same point page 1 opened with, and the chapter has now earned it twice.',
      difficulty_level: 3,
    }),
    b('callout', 11, {
      variant: 'note',
      title: 'A note on scope — river-boats and rain are next chapter',
      markdown: 'You may have met problems about a boat crossing a flowing river, or a man tilting his umbrella as he walks through vertical rain. They use the same subtraction rule as this page.\n\nBut they are **two-dimensional** — the boat\'s velocity and the river\'s are at right angles, and so are the rain\'s and the man\'s. That means the subtraction has to be done as a vector subtraction rather than with plus and minus signs.\n\nSo they belong to **Motion in Two Dimensions**, the next chapter, where vectors do the work. Everything on this page is the one-dimensional groundwork for them.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('If $ v_{AB} = +6 $ m/s, then $ v_{BA} $ equals:',
          ['$ +6 $ m/s', '$ -6 $ m/s', '$ 0 $', '$ +12 $ m/s'], 1,
          'Swapping the subscripts reverses the subtraction, so $ v_{BA} = -v_{AB} = -6 $ m/s. If A moves away from B at 6 m/s, then B moves away from A at 6 m/s in the opposite direction.', 1),
        q('Two bodies are in free fall, released at different times. Their relative acceleration is:',
          ['$ g $', '$ 2g $', 'Zero', 'It depends on when each was released'], 2,
          'Both have the same acceleration $ g $, so $ a_{AB} = g - g = 0 $. This is why they see each other move at a constant velocity even though each one is accelerating.', 2),
        q('A police van moving at $ 30 $ km/h fires a bullet at a thief\'s car speeding away in the same direction at $ 192 $ km/h. If the muzzle speed of the bullet is $ 150 $ m/s, the speed with which the bullet hits the car is:',
          ['$ 105 $ m/s', '$ 150 $ m/s', '$ 158 $ m/s', '$ 203 $ m/s'], 0,
          'The bullet\'s ground speed is $ 150 + 30(5/18) = 158.3 $ m/s, and the car\'s is $ 192(5/18) = 53.3 $ m/s. The speed relevant to the damage is the relative speed: $ 158.3 - 53.3 = 105 $ m/s. Using the muzzle speed alone ignores that the target is running away.', 3),
      ],
    }),
    b('callout', 13, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ v_{AB} = v_A - v_B $ — read the subscripts in order: **A with respect to B**.\n- $ v_{AB} = -v_{BA} $, and $ a_{AB} = a_A - a_B $.\n- **Same acceleration ⟹ zero relative acceleration**, so the two see each other at constant velocity. Two bodies in free fall separate at a steady rate.\n- **To solve a two-body problem: freeze one of them.** Give the other the relative velocity and relative acceleration, and one equation does the whole job.\n- Opposite directions make relative speeds add; the same direction makes them subtract. The signs handle it — you do not have to remember which.',
    }),
    b('practice_bank', 14, {
      title: 'You solve it',
      intro: 'Eight questions. Declare your positive direction, then write both velocities with their signs before subtracting.',
      sections: [
        {
          id: 'p13-ysi',
          title: 'Relative velocity along a line',
          items: [
            num('p13-y1', 'Two trains move towards each other on the same track, one at $ 20 $ m/s and the other at $ 15 $ m/s. If they are $ 700 $ m apart, how long before they meet?',
              '20 s',
              'Taking one direction as positive, the velocities are $ +20 $ and $ -15 $, so the relative speed is $ 20 - (-15) = 35 $ m/s. The gap closes at 35 m/s, so the time is $ 700/35 = 20 $ s.'),
            mcq('p13-y2', 'A man in a lift drops a coin. Relative to the lift, the coin\'s acceleration when the lift moves upward with constant **velocity** is:',
              ['$ g $ downward', 'Zero', '$ 2g $ downward', 'Depends on the lift\'s speed'], 0,
              'The lift moves at constant velocity, so its acceleration is zero and the relative acceleration is $ g - 0 = g $ downward. The coin falls inside the lift exactly as it would on the ground — which is why you cannot tell a smoothly moving lift from a stationary one.'),
            num('p13-y3', 'Two cars travel in the same direction at $ 25 $ m/s and $ 18 $ m/s. The slower car is $ 42 $ m ahead. How long until the faster car catches it?',
              '6 s',
              'Relative velocity $ = 25 - 18 = 7 $ m/s, and the gap is 42 m, so the time is $ 42/7 = 6 $ s. Both cars move a long way in that time, but only the closing speed matters.'),
            mcq('p13-y4', 'Two stones are thrown vertically upward from the ground with different speeds, one after the other. Their relative acceleration is:',
              ['Zero', '$ g $ downward', '$ 2g $ downward', 'It depends on their speeds'], 0,
              'Both are in free fall with acceleration $ g $ downward, so the relative acceleration is $ g - g = 0 $. Their relative velocity is therefore constant throughout, whatever speeds they were thrown at.'),
            num('p13-y5', 'A ball is dropped from a height. Half a second later a second ball is dropped from the same point. At what constant rate does the separation between them grow? Take $ g = 10 $ m/s².',
              '5 m/s',
              'When the second ball is released the first has been falling $ 0.5 $ s and so is moving at $ 10(0.5) = 5 $ m/s, while the second is at rest. The relative velocity is 5 m/s, and since both share the acceleration $ g $, the relative acceleration is zero and 5 m/s is the permanent rate.'),
            mcq('p13-y6', 'A passenger on a train sees rain falling at an angle even though the rain is falling vertically. This is because:',
              ['The train is accelerating rather than moving steadily', 'The rain is deflected by air pushed ahead of the train', 'The rain\'s velocity relative to the passenger is the vector difference of the two', 'The curvature of the train\'s windows distorts the view'], 2,
              'What the passenger sees is the rain\'s velocity *relative to the train*, which is the rain\'s velocity minus the train\'s. Since the two are perpendicular, the result is tilted. This is a two-dimensional version of this page — hence the next chapter.'),
            num('p13-y7', 'Car A starts from rest with acceleration $ 2 $ m/s². Car B, $ 24 $ m ahead, moves at a constant $ 2 $ m/s in the same direction, starting at the same instant. When does A catch B?',
              '$ t = 6 $ s',
              'In B\'s frame: $ u_{AB} = 0 - 2 = -2 $ m/s, $ a_{AB} = 2 - 0 = 2 $ m/s², and the gap to close is 24 m. So $ 24 = -2t + t^2 $, giving $ t^2 - 2t - 24 = 0 $, which factorises as $ (t-6)(t+4) = 0 $, so $ t = 6 $ s.'),
            mcq('p13-y8', 'Two objects have the same non-zero acceleration. In the frame of one of them, the other appears to move:',
              ['With constant velocity', 'With constant acceleration', 'At rest always', 'With increasing acceleration'], 0,
              'Equal accelerations give a relative acceleration of zero, so the relative velocity is constant. It is not necessarily zero — the two may be drifting apart steadily — but it does not change.'),
          ],
        },
      ],
    }),
    b('text', 15, {
      markdown: 'One page left in the teaching half of this chapter, and it is the one that puts a boundary on everything you have learned.\n\nEvery equation from page 9 onward assumed the acceleration was constant. What happens when it is not?',
    }),
  ],
};

// ── p14 · Non-Uniform Acceleration ────────────────────────────────────────────
const p14 = {
  page_number: 14,
  slug: 'when-the-three-equations-die',
  title: 'When the Three Equations Die',
  subtitle: 'Motion with changing acceleration — and the tools that still work',
  glossary: [
    { term: 'non-uniform acceleration', definition: 'Acceleration that changes with time or position. The three equations of motion do not apply; the definitions of v and a still do.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A particle moves so that $ x = 20 + t^3 - 12t $, in SI units. Find its velocity at $ t = 0 $ using $ v = u + at $. What goes wrong?',
      hint: 'Try to identify $ u $ and $ a $ for this motion.',
      reveal: 'You cannot even start — and that is the answer.\n\nTo use $ v = u + at $ you need a single value of $ a $. Differentiate twice here and you get $ a = 6t $, which is different at every instant. There is no "the acceleration" to substitute.\n\nSo all three equations of motion are simply **unavailable** for this particle. Not harder to use — unavailable. But the definitions they were built from still hold perfectly well, and that is what this page is about.',
    }),
    b('callout', 1, {
      variant: 'note',
      title: 'A note on scope',
      markdown: 'NCERT deliberately restricts this chapter to motion with constant acceleration, and says so.\n\nThis page goes beyond that, because non-uniform acceleration is standard in JEE and NEET, and because it is where the calculus you learned in Chapter 0 finally does real physics. If you are preparing for boards only, you can treat this page as enrichment.\n\nEverything here uses only differentiation and integration — no new physics at all.',
    }),
    b('text', 2, {
      markdown: 'The two definitions never stopped being true:\n\n$ v = \\frac{dx}{dt} \\qquad a = \\frac{dv}{dt} $\n\nSo the method is exactly the direction map from page 7, written in calculus instead of in slopes and areas:\n\n**Differentiate to go down** the chain: $ x \\to v \\to a $\n\n**Integrate to go up** it: $ a \\to v \\to x $',
    }),
    b('step_solver', 3, {
      title: 'Differentiating down the chain',
      problem: 'A particle moves along the x-axis with $ x = 20 + t^3 - 12t $ (SI units). Find (a) its position and velocity at $ t = 0 $, (b) whether the motion is uniformly accelerated, and (c) the position at which its velocity is zero.',
      intro: 'Three questions, all answered by differentiating. No equation of motion appears anywhere.',
      steps: [
        st('(a) At $ t = 0 $: $ \\quad x = 20 + 0 - 0 = 20\\ \\text{m} $',
          'Position first — just substitute into the given expression.', {
            check: {
              kind: 'mcq',
              prompt: 'To get the velocity from this position function, what do we do?',
              options: ['Divide $ x $ by $ t $', 'Differentiate $ x $ with respect to $ t $', 'Integrate $ x $ with respect to $ t $', 'Substitute into $ v = u + at $'],
              answer_index: 1,
              feedback_right: 'Right — velocity is the rate of change of position.',
              feedback_wrong: 'Velocity is $ dx/dt $, so differentiate. Dividing $ x $ by $ t $ would give an average velocity since $ t = 0 $, which is a different quantity — and $ v = u + at $ is unavailable because $ a $ is not constant here.',
            },
          }),
        st('$ v = \\dfrac{dx}{dt} = 3t^2 - 12 $, so at $ t = 0 $, $ v = -12\\ \\text{m/s} $',
          'Negative — the particle starts by moving in the negative x-direction, even though it sits at a positive position.', {
            why: 'Position and velocity signs are independent, as page 6 established. Here the particle is at $ +20 $ m and heading towards the origin.',
          }),
        st('(b) $ a = \\dfrac{dv}{dt} = 6t $ — this depends on $ t $, so the motion is **not** uniformly accelerated.',
          'Differentiate a second time. Since $ a $ changes with time, no equation of motion applies to this particle at all.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Set $ v = 3t^2 - 12 = 0 $ and find the positive value of $ t $, in seconds.',
              blank_answer: '2',
              feedback_right: 'Yes — $ 3t^2 = 12 $, so $ t^2 = 4 $ and $ t = 2 $ s.',
              feedback_wrong: '$ 3t^2 = 12 $ gives $ t^2 = 4 $, so $ t = 2 $ s (taking the positive root, since the motion starts at $ t = 0 $).',
            },
          }),
        st('(c) At $ t = 2 $ s: $ \\quad x = 20 + 8 - 24 = 4\\ \\text{m} $',
          'So the particle comes momentarily to rest at $ x = 4 $ m, having travelled 16 m in the negative direction, and then turns round.', {
            why: 'Notice this is a *turning point*, exactly like the top of a thrown ball — and we found it the same way, by setting the velocity to zero. The physics of "where does it turn round?" does not care whether the acceleration is constant.',
          }),
      ],
      now_you_try: {
        problem: 'A particle has $ x = (2t - 3)^2 $ metres. Find (a) its position, velocity and acceleration at $ t = 2 $ s, and (b) its velocity when it is at the origin.',
        answer: '(a) $ x = 1 $ m, $ v = 4 $ m/s, $ a = 8 $ m/s²  (b) $ v = 0 $',
        solution: '(a) $ x = (4-3)^2 = 1 $ m. Differentiating, $ v = 2(2t-3)(2) = 8t - 12 $, so $ v = 4 $ m/s at $ t = 2 $ s. Again, $ a = 8 $ m/s² — constant here, as it happens. (b) At the origin $ (2t-3)^2 = 0 $, so $ t = 1.5 $ s, and then $ v = 8(1.5) - 12 = 0 $. The particle arrives at the origin exactly as it comes to rest.',
      },
    }),
    b('step_solver', 4, {
      title: 'Integrating up the chain',
      problem: 'The velocity–time relation for a particle moving in a straight line is $ v = (10 + 2t + 3t^2) $ in SI units. Find (a) its displacement at $ t = 1 $ s given that its displacement is $ 20 $ m at $ t = 0 $, and (b) its acceleration–time relation.',
      intro: 'One question needs integration and one needs differentiation. Notice how differently they are set up.',
      steps: [
        st('(a) $ v = \\dfrac{ds}{dt} \\quad \\Rightarrow \\quad ds = (10 + 2t + 3t^2)\\,dt $',
          'To get displacement from velocity we integrate — up the chain.', {
            check: {
              kind: 'mcq',
              prompt: 'What must the limits of integration be?',
              options: [
                '$ s $ from 0 to $ s $, and $ t $ from 0 to 1',
                '$ s $ from 20 to $ s $, and $ t $ from 0 to 1',
                '$ s $ from 20 to 0, and $ t $ from 1 to 0',
                'No limits are needed',
              ],
              answer_index: 1,
              feedback_right: 'Right — the displacement starts at 20 m, not at zero.',
              feedback_wrong: 'The problem states the displacement is 20 m at $ t = 0 $, so the left-hand side runs from 20 to $ s $ while the time runs from 0 to 1. Starting from 0 would throw away the given initial condition.',
            },
          }),
        st('$ \\displaystyle\\int_{20}^{s} ds = \\int_0^1 (10 + 2t + 3t^2)\\,dt \\quad \\Rightarrow \\quad s - 20 = \\left[10t + t^2 + t^3\\right]_0^1 $',
          'Integrating each term: $ 10 $ gives $ 10t $, $ 2t $ gives $ t^2 $, and $ 3t^2 $ gives $ t^3 $.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\left[10t + t^2 + t^3\\right]_0^1 $. Give the number.',
              blank_answer: '12',
              feedback_right: 'Yes — $ 10 + 1 + 1 = 12 $.',
              feedback_wrong: 'At $ t = 1 $: $ 10(1) + 1 + 1 = 12 $. At $ t = 0 $ everything vanishes. So the definite integral is 12.',
            },
          }),
        st('$ s = 20 + 12 = 32\\ \\text{m} $',
          'The integral gave the *change* in displacement; the initial 20 m had to be added.', {
            why: 'This is the same lesson as the area under an a–t graph on page 7: an integral gives you a change, not a value. Forgetting to add the initial condition is the standard error, and it produces a plausible-looking wrong answer.',
          }),
        st('(b) $ a = \\dfrac{dv}{dt} = \\dfrac{d}{dt}(10 + 2t + 3t^2) = 2 + 6t $',
          'The acceleration, by differentiating down the chain. It grows with time, confirming the motion is not uniformly accelerated.', {
            why: 'One expression handled both directions: integrate for displacement, differentiate for acceleration. That is the whole method, and it works for any function you can differentiate or integrate.',
          }),
      ],
      now_you_try: {
        problem: 'A particle\'s velocity is $ v = (3 + 6t + 9t^2) $ cm/s. Find (a) its acceleration at $ t = 3 $ s and (b) its displacement in the interval from $ t = 5 $ s to $ t = 8 $ s.',
        answer: '(a) $ 60 $ cm/s²  (b) $ 1287 $ cm',
        solution: '(a) $ a = dv/dt = 6 + 18t $, so at $ t = 3 $ s, $ a = 6 + 54 = 60 $ cm/s². (b) $ \\int_5^8 (3 + 6t + 9t^2)\\,dt = \\left[3t + 3t^2 + 3t^3\\right]_5^8 $. At $ t = 8 $: $ 24 + 192 + 1536 = 1752 $. At $ t = 5 $: $ 15 + 75 + 375 = 465 $. The difference is $ 1287 $ cm. No initial condition was needed here, because the question asked for a change.',
      },
    }),
    b('inline_quiz', 5, {
      pass_threshold: 0.6,
      questions: [
        q('A particle has $ a = 6t $ m/s². Which of these may be used to find its velocity?',
          ['$ v = u + at $', '$ v = u + \\int a\\,dt $', '$ v^2 = u^2 + 2as $', 'None of these'], 1,
          'The acceleration is not constant, so no equation of motion applies. What still holds is the definition $ a = dv/dt $, which integrates to $ v = u + \\int a\\,dt $.', 2),
        q('For a particle with $ x = 4t^3 $, the acceleration at $ t = 1 $ s is:',
          ['$ 12 $ m/s²', '$ 24 $ m/s²', '$ 4 $ m/s²', '$ 0 $'], 1,
          'Differentiate twice: $ v = 12t^2 $ and $ a = 24t $, so at $ t = 1 $ s, $ a = 24 $ m/s². Stopping after one differentiation gives 12, which is the velocity, not the acceleration.', 2),
        q('An integral of acceleration with respect to time gives:',
          ['The velocity', 'The change in velocity', 'The displacement', 'The change in displacement'], 1,
          'Integrating a rate of change gives the *change* in the quantity, not the quantity itself. To get an actual velocity you must add the velocity at some known instant — the initial condition.', 2),
      ],
    }),
    b('heading', 6, {
      text: 'When the acceleration depends on position, not time',
      level: 2,
      objective: 'Use a = v dv/dx when the acceleration is a function of position.',
    }),
    b('text', 7, {
      markdown: 'Sometimes you are told the acceleration as a function of **position** rather than time — a spring, for instance, pulls harder the further you stretch it.\n\nThen $ a = dv/dt $ is awkward, because there is no $ t $ anywhere. The fix is a small piece of chain rule:\n\n$ a = \\frac{dv}{dt} = \\frac{dv}{dx}\\cdot\\frac{dx}{dt} = v\\,\\frac{dv}{dx} $\n\nwhich rearranges to the form you actually integrate:\n\n$ v\\,dv = a\\,dx $',
    }),
    b('step_solver', 8, {
      title: 'Acceleration as a function of position',
      problem: 'A particle starts from rest at $ x = 0 $ with an acceleration $ a = 4x $ (SI units). Find its speed at $ x = 3 $ m.',
      intro: 'There is no time in the question and no time in the answer, so time should not appear in the working either.',
      steps: [
        st('$ a = v\\dfrac{dv}{dx} \\quad \\Rightarrow \\quad v\\,dv = a\\,dx = 4x\\,dx $',
          'Use the position form, because the acceleration is given in terms of $ x $.', {
            check: {
              kind: 'mcq',
              prompt: 'Why not use $ a = dv/dt $ here?',
              options: [
                'Because it is wrong',
                'Because the acceleration is given in terms of $ x $, not $ t $ — there is no $ t $ to work with',
                'Because the particle starts from rest',
                'Because $ a $ is not constant',
              ],
              answer_index: 1,
              feedback_right: 'Exactly — the form you use should match the variable you are given.',
              feedback_wrong: '$ a = dv/dt $ is perfectly correct, but useless here: it would leave you with $ x $ on one side and $ t $ on the other and no way to connect them. The $ v\\,dv/dx $ form eliminates time entirely.',
            },
          }),
        st('$ \\displaystyle\\int_0^v v\\,dv = \\int_0^3 4x\\,dx $',
          'Integrate both sides with matching limits: the speed runs from 0 (at rest) to $ v $, while the position runs from 0 to 3 m.', {
            why: 'Matching the limits is the step to be careful with — the left-hand limits are *velocities* and the right-hand ones are *positions*, and they correspond because the particle is at $ x = 0 $ when $ v = 0 $.',
          }),
        st('$ \\dfrac{v^2}{2} = \\left[2x^2\\right]_0^3 = 18 \\quad \\Rightarrow \\quad v^2 = 36 $',
          'Evaluating both sides.', {
            check: {
              kind: 'fill_blank',
              prompt: 'So what is $ v $, in m/s?',
              blank_answer: '6',
              feedback_right: 'Yes — $ v = \\sqrt{36} = 6 $ m/s.',
              feedback_wrong: '$ v^2 = 36 $, so $ v = 6 $ m/s.',
            },
          }),
        st('$ v = 6\\ \\text{m/s} $',
          'Found without ever knowing how long the particle took to get there.', {
            why: 'Compare this with $ v^2 = u^2 + 2as $ from page 9 — the same shape, and for the same reason. That equation is what $ v\\,dv = a\\,dx $ becomes when $ a $ happens to be constant. This is the general version; SUVAT is the special case.',
          }),
      ],
      now_you_try: {
        problem: 'A particle starts from rest at the origin with acceleration $ a = 6x $ (SI units). Find its speed at $ x = 2 $ m.',
        answer: '$ 2\\sqrt{6} \\approx 4.9 $ m/s',
        solution: '$ \\int_0^v v\\,dv = \\int_0^2 6x\\,dx $, so $ \\frac{v^2}{2} = \\left[3x^2\\right]_0^2 = 12 $, giving $ v^2 = 24 $ and $ v = \\sqrt{24} = 2\\sqrt{6} \\approx 4.9 $ m/s.',
      },
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- When the acceleration is **not constant**, the three equations of motion do not apply at all. The definitions still do.\n- **Differentiate to go down** the chain ($ x \\to v \\to a $); **integrate to go up** it ($ a \\to v \\to x $).\n- An integral gives a **change**. Add the initial condition to turn it into a value.\n- When $ a $ is a function of position, use $ a = v\\dfrac{dv}{dx} $, i.e. $ v\\,dv = a\\,dx $.\n- $ v^2 = u^2 + 2as $ is exactly what that last relation becomes when $ a $ is constant — SUVAT is the special case, not the rule.',
    }),
    b('practice_bank', 10, {
      title: 'You solve it',
      intro: 'Seven questions. For each one, decide first whether you need to differentiate or integrate, and in which variable.',
      sections: [
        {
          id: 'p14-ysi',
          title: 'Changing acceleration',
          items: [
            num('p14-y1', 'The velocity of a particle moving along the x-axis is $ v = (10 + 5t - t^2) $ m/s, and $ x = 0 $ at $ t = 0 $. Find (a) its acceleration at $ t = 2 $ s and (b) its x-coordinate at $ t = 3 $ s.',
              '(a) $ 1 $ m/s²  (b) $ 43.5 $ m',
              '(a) $ a = dv/dt = 5 - 2t $, so at $ t = 2 $ s, $ a = 1 $ m/s². (b) $ x = \\int_0^3 (10 + 5t - t^2)\\,dt = \\left[10t + 2.5t^2 - \\frac{t^3}{3}\\right]_0^3 = 30 + 22.5 - 9 = 43.5 $ m.'),
            mcq('p14-y2', 'A particle has $ x = 2 + t^2 + 2t^3 $ (SI units). Its initial velocity is:',
              ['$ 0 $', '$ 2 $ m/s', '$ 1 $ m/s', '$ 6 $ m/s'], 0,
              '$ v = dx/dt = 2t + 6t^2 $, which is zero at $ t = 0 $. The constant 2 in the position is where the particle *starts*, not how fast it starts.'),
            num('p14-y3', 'For the particle in the previous question, find its position at $ t = 0 $ and its acceleration at $ t = 2 $ s.',
              '$ x = 2 $ m; $ a = 26 $ m/s²',
              'At $ t = 0 $, $ x = 2 $ m. Differentiating twice: $ v = 2t + 6t^2 $ and $ a = 2 + 12t $, so at $ t = 2 $ s, $ a = 2 + 24 = 26 $ m/s².'),
            mcq('p14-y4', 'When the acceleration of a particle is given as a function of its position, the most useful relation is:',
              ['$ a = dv/dt $', '$ a = v\\,dv/dx $', '$ v = u + at $', '$ a = d^2x/dt^2 $'], 1,
              'The form $ a = v\\,dv/dx $ eliminates time entirely, which is exactly what you need when neither the question nor the answer involves time. The others are all correct statements but leave you with a variable you cannot connect.'),
            num('p14-y5', 'A particle moves with velocity $ v = 4t^3 $ m/s and is at $ x = 2 $ m when $ t = 0 $. Find its position at $ t = 2 $ s.',
              '18 m',
              '$ \\int_2^x dx = \\int_0^2 4t^3\\,dt $, so $ x - 2 = \\left[t^4\\right]_0^2 = 16 $, giving $ x = 18 $ m. Note the initial 2 m had to be added — the integral only gave the change.'),
            mcq('p14-y6', 'A particle\'s acceleration is $ a = -kx $ with $ k > 0 $. As the particle moves away from the origin, its speed:',
              ['Increases', 'Decreases', 'Stays constant', 'Cannot be determined'], 1,
              'The acceleration points back towards the origin while the particle moves away from it, so acceleration and velocity have opposite signs — and by the rule from page 6, opposite signs mean the speed is falling. (This is the acceleration of a mass on a spring, and it is why the mass eventually turns round.)'),
            num('p14-y7', 'The velocity of a particle moving in a straight line is directly proportional to $ t^{3/4} $. Starting from rest, how do its displacement and its acceleration depend on time?',
              '$ s \\propto t^{7/4} $ and $ a \\propto t^{-1/4} $',
              'Let $ v = kt^{3/4} $. Integrating, $ s = \\frac{4k}{7}t^{7/4} $, so $ s \\propto t^{7/4} $. Differentiating, $ a = \\frac{3k}{4}t^{-1/4} $, so $ a \\propto t^{-1/4} $ — the acceleration *decreases* with time even though the speed keeps growing.'),
          ],
        },
      ],
    }),
    b('text', 11, {
      markdown: 'That is the whole teaching half of the chapter. You now have three quantities, two operations, three equations and the boundary of where they stop working.\n\nWhat remains is retrieval and practice — and there is a lot of practice, because kinematics is a subject you only really own once your hands know it.',
    }),
  ],
};

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureChapter(db);
    await upsertPages(db, bookId, [p12, p13, p14]);
  });
  console.log('\n✅ Ch.2 wave 2b complete — pages 12–14');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
