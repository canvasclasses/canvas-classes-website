'use strict';
/**
 * Class 11 Physics · Chapter 2 "Motion in One Dimension" — pages 5–8.
 * Wave 1b: acceleration, the sign trap, and the two graph pages.
 *
 * WHY THREE GRAPH PAGES (p4, p7, p8): all three source books put graphs late,
 * which is exactly why students can compute v = u + at and still cannot read an
 * x–t plot. Graphs are the spine here. And with no interactive available
 * (founder decision, 2026-07-29), graph-to-graph translation has to be carried
 * by numbered static figures plus a high density of drills — hence p8 exists as
 * a page of its own rather than a section of p7.
 *
 * Run: node scripts/physics11-book/build_ch2_graphs.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch2');

// ── p5 · Acceleration ────────────────────────────────────────────────────────
const p5 = {
  page_number: 5,
  slug: 'acceleration-the-rate-of-a-rate',
  title: 'Acceleration — the Rate of a Rate',
  subtitle: 'How fast the "how fast" is changing',
  glossary: [
    { term: 'acceleration', definition: 'The rate of change of velocity with time. Its SI unit is m/s².' },
    { term: 'average acceleration', definition: 'Change in velocity divided by the time interval over which the change happened.' },
    { term: 'instantaneous acceleration', definition: 'dv/dt — the slope of the tangent to the v–t graph at that instant.' },
    { term: 'uniform acceleration', definition: 'Acceleration that stays constant in both magnitude and direction. Only then do the three equations of motion apply.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A falling stone speeds up as it falls. But *how* should we measure that speeding-up — as extra speed gained **per metre fallen**, or as extra speed gained **per second**? Galileo tried one of these first, and it did not work. Which one, and how do you think he found out?',
      hint: 'One of the two turns out to be the same number all the way down. The other does not.',
      reveal: 'Galileo first assumed that velocity increases at a steady rate **with distance fallen**. It was a perfectly reasonable guess.\n\nBut when he measured falling bodies and balls rolling down inclined planes, he found that the gain in velocity **per metre** is not constant at all — it gets smaller and smaller as the fall goes on. What *is* constant, for every object in free fall, is the gain in velocity **per second**.\n\nSo the definition we use was not chosen for elegance. It was chosen because it is the one that comes out constant in nature, and that is why acceleration is a rate with respect to time.',
    }),
    b('text', 1, {
      markdown: 'So, exactly as we did for velocity, there are two versions — one for an interval, one for an instant.\n\n$ \\bar{a} = \\frac{v_2 - v_1}{t_2 - t_1} = \\frac{\\Delta v}{\\Delta t} $\n\n$ a = \\lim_{\\Delta t \\to 0} \\frac{\\Delta v}{\\Delta t} = \\frac{dv}{dt} $\n\nThe SI unit is metres per second, per second — written $ \\text{m/s}^2 $. Read it out loud as "so many metres per second, gained every second", and the unit stops looking strange.',
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'The pattern is deliberate',
      markdown: 'Look at what just happened. Velocity was the rate of change of position. Acceleration is the rate of change of velocity.\n\nSame definition, applied twice. That is why the whole chapter fits on one sentence: **each quantity is the slope of the one before it.** Position, then velocity, then acceleration — and on a graph, the operation that takes you from one to the next is always the same one.',
    }),
    b('inline_quiz', 80, {
      pass_threshold: 0.6,
      questions: [
        q('Galileo first measured the gain in velocity per metre fallen and found it was not constant. What does that tell us about the definition of acceleration?',
          ['That acceleration cannot be defined at all', 'That defining it per unit time is the version nature makes constant', 'That his measurements were wrong', 'That acceleration depends on the mass'], 1,
          'Both definitions are legal arithmetic; only one of them comes out constant for every falling body. Acceleration is a rate with respect to TIME because that is the version the world cooperates with — it was not chosen for elegance.', 3),
        q('An acceleration of 4 m/s² means that every second, the object gains:',
          ['4 metres of position', '4 metres per second of velocity', '4 metres per second of position', '4 seconds of time'], 1,
          'Read the unit aloud as "metres per second, gained every second". Acceleration accumulates velocity, not position — position is what velocity accumulates.', 1),
      ],
    }),
    b('step_solver', 3, {
      title: 'Average acceleration from two velocities',
      problem: 'A car pulls away from a traffic light and reaches 20 m/s in 8.0 s. Find its average acceleration.',
      intro: 'The easiest possible case, done in full — because the habit of writing the two velocities down with their signs is what saves you three pages from now.',
      steps: [
        st('$ v_1 = 0 $, $ v_2 = 20\\ \\text{m/s} $, $ \\Delta t = 8.0\\ \\text{s} $',
          'Take the direction of travel as positive. The car starts from rest, so its initial velocity is zero.', {
            check: {
              kind: 'mcq',
              prompt: '"Pulls away from a traffic light" — what does that tell you about the initial velocity?',
              options: ['It is 20 m/s', 'It is zero', 'It cannot be determined', 'It is negative'],
              answer_index: 1,
              feedback_right: 'Right — the car was stopped at the light.',
              feedback_wrong: 'A car waiting at a traffic light is at rest, so its initial velocity is zero. Phrases like "starts from rest", "is dropped" and "pulls away" all mean the same thing.',
            },
          }),
        st('$ \\bar{a} = \\frac{\\Delta v}{\\Delta t} = \\frac{20 - 0}{8.0} $',
          'Change in velocity over the time taken for that change.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ 20 \\div 8.0 $. Give the answer in m/s².',
              blank_answer: '2.5',
              feedback_right: 'Yes — 2.5 m/s².',
              feedback_wrong: '$ 20 \\div 8.0 = 2.5 $ m/s².',
            },
          }),
        st('$ \\bar{a} = 2.5\\ \\text{m/s}^2 $',
          'The car gains 2.5 metres per second of velocity, every second.', {
            why: 'That reading of the unit is worth practising. After 1 s it is doing 2.5 m/s, after 2 s it is doing 5.0 m/s, and so on — provided the acceleration really is steady, which we assumed when we called this an *average*.',
          }),
      ],
      now_you_try: {
        problem: 'An athlete takes 2.0 s to reach his maximum speed of 18.0 km/h from rest. What is the magnitude of his average acceleration?',
        answer: '2.5 m/s²',
        solution: 'Convert first: $ 18.0 $ km/h $ = 18.0 \\times \\frac{1000}{3600} = 5.0 $ m/s. Then $ \\bar{a} = \\frac{5.0 - 0}{2.0} = 2.5 $ m/s². Converting to SI *before* dividing is the habit to build — mixing km/h with seconds is one of the most common sources of a wrong answer in this chapter.',
      },
    }),
    b('heading', 4, {
      text: 'A change of velocity does not have to be a change of speed',
      level: 2,
      objective: 'Identify the three different ways a velocity can change.',
    }),
    b('text', 5, {
      markdown: 'Velocity carries both a size and a direction. So a velocity can change in three different ways:\n\n- the **speed** changes, direction the same — a car pressing the accelerator on a straight road\n- the **direction** changes, speed the same — a car going round a bend at a steady 40 km/h\n- **both** change at once — that same car braking into the bend\n\nAll three count as acceleration. In this chapter only the first is available to us, because along a straight line there are only two directions. But keep the other two in mind: a body can be accelerating with its speedometer needle absolutely still, and that fact is the whole of circular motion.',
    }),
    b('step_solver', 6, {
      title: 'When the velocity reverses',
      problem: 'A ball moving at $ +6.0 $ m/s strikes a wall and rebounds at $ 4.0 $ m/s in the opposite direction. The contact lasts $ 0.020 $ s. Find the average acceleration during the contact.',
      intro: 'Nothing here is hard except the signs — and the signs are the entire question.',
      steps: [
        st('$ v_1 = +6.0\\ \\text{m/s} $, $ v_2 = -4.0\\ \\text{m/s} $',
          'Take the ball\'s original direction as positive. It comes back the other way, so the final velocity is negative.', {
            check: {
              kind: 'mcq',
              prompt: 'The rebound speed is 4.0 m/s. Why do we write the final velocity as $ -4.0 $ m/s?',
              options: [
                'Because the ball slowed down',
                'Because the ball is now moving in the direction we called negative',
                'Because it lost energy in the collision',
                'It is a mistake — speed cannot be negative',
              ],
              answer_index: 1,
              feedback_right: 'Exactly. The speed is 4.0 m/s; the velocity is $ -4.0 $ m/s because of the direction.',
              feedback_wrong: 'Speed cannot be negative, but *velocity* can — the sign is the direction. The ball moves the opposite way after the bounce, so its velocity takes the opposite sign.',
            },
          }),
        st('$ \\Delta v = v_2 - v_1 = (-4.0) - (+6.0) = -10.0\\ \\text{m/s} $',
          'Change in velocity, final minus initial. Notice the change is bigger than either velocity on its own.', {
            why: 'This is the step almost everyone gets wrong, by writing $ 6.0 - 4.0 = 2.0 $. The ball did not slow by 2 m/s — it had to be stopped completely *and then* thrown back the other way. That is a change of 10 m/s, and it is why a rebound hurts so much more than being caught.',
          }),
        st('$ \\bar{a} = \\frac{-10.0}{0.020} = -500\\ \\text{m/s}^2 $',
          'Divide by the contact time.', {
            check: {
              kind: 'mcq',
              prompt: 'What does the minus sign on the acceleration tell you here?',
              options: [
                'The ball was slowing down',
                'The acceleration points in the negative direction — away from the wall',
                'The calculation went wrong somewhere',
                'The ball was moving backwards the whole time',
              ],
              answer_index: 1,
              feedback_right: 'Right — the wall pushed the ball back, and that push is in the negative direction.',
              feedback_wrong: 'The sign of an acceleration gives its *direction*, not whether the object sped up or slowed down. Here it points away from the wall, which is exactly the direction the wall pushed. (The next page is entirely about this distinction.)',
            },
          }),
      ],
      now_you_try: {
        problem: 'A car moving east at 50 km/h makes a $ 90^\\circ $ left turn without changing its speed. Has it accelerated?',
        answer: 'Yes — its velocity changed direction, so it accelerated even though its speed was constant throughout.',
        solution: 'Velocity is a vector: size *and* direction. The size never changed, but the direction changed by $ 90^\\circ $, so the velocity certainly changed — and any change of velocity is an acceleration. (The magnitude of the change works out to $ \\sqrt{50^2 + 50^2} \\approx 70 $ km/h, directed north-west, which is why this exact question turns up so often as a multiple-choice item.)',
      },
    }),
    b('heading', 7, {
      text: 'What acceleration does to the shape of a graph',
      level: 2,
      objective: 'Read the sign of the acceleration off the curvature of an x–t graph and the slope of a v–t graph.',
    }),
    b('text', 8, {
      markdown: 'On a **v–t** graph the story is simple, because acceleration is defined as the rate of change of velocity:\n\n**Acceleration $ = $ the slope of the v–t graph.**\n\nOn an **x–t** graph it shows up one level deeper — not in the slope, but in how the slope is *changing*. That is what a curve\'s bend, its **curvature**, records.',
    }),
    b('image', 9, {
      src: '',
      alt: 'Three x–t graphs side by side: one curving upward, one curving downward, and one a straight line.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-xt-curvature',
      caption: 'Positive acceleration bends an x–t graph upward, negative acceleration bends it downward, and zero acceleration leaves it straight.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background, three side-by-side panels separated by thin hairlines. Each panel has simple axes with time horizontal and position vertical. Panel one: a curve bending upward, concave up. Panel two: a curve bending downward, concave down. Panel three: a perfectly straight sloping line. Minimal, precise, schematic, no text labels beyond small axis arrows. Dark background with orange and amber accents only.',
    }),
    b('table', 10, {
      caption: 'What each graph shows you directly',
      headers: ['Graph', 'Its slope gives you', 'Its curvature tells you'],
      rows: [
        ['**x–t**', 'Velocity', 'The sign of the acceleration'],
        ['**v–t**', 'Acceleration', 'Whether the acceleration itself is changing'],
        ['**a–t**', 'The rate of change of acceleration (rarely needed)', '—'],
      ],
    }),
    b('inline_quiz', 81, {
      pass_threshold: 0.6,
      questions: [
        q('On which graph does the acceleration appear as the SLOPE?',
          ['The x–t graph', 'The v–t graph', 'The a–t graph', 'All three'], 1,
          'Slope always gives the rate of change of the vertical quantity, so the slope of a v–t graph is dv/dt — the acceleration. On an x–t graph the slope is the velocity, and acceleration shows up one level deeper, as curvature.', 2),
        q('An x–t graph is a straight line. What can you say about the acceleration?',
          ['It is constant and positive', 'It is zero', 'It is constant and negative', 'It cannot be determined'], 1,
          'A straight line has a constant slope, so the velocity never changes — and an unchanging velocity means zero acceleration. Any non-zero acceleration would bend the line.', 2),
      ],
    }),
    b('step_solver', 11, {
      title: 'Reading an acceleration off a v–t line',
      problem: 'The v–t graph of a particle moving along the x-axis is a straight line passing through $ v = 2 $ m/s at $ t = 0 $ and $ v = 8 $ m/s at $ t = 10 $ s. Find the acceleration.',
      intro: 'One line, one number. But get into the habit of saying out loud which graph you are looking at before you take a slope — half of all graph errors are slope-of-the-wrong-graph errors.',
      steps: [
        st('This is a **v–t** graph, so its slope is the acceleration.',
          'Say it before you calculate. On an x–t graph the same slope would have meant a velocity.', {
            check: {
              kind: 'mcq',
              prompt: 'If this had been an x–t graph instead, what would the slope have given you?',
              options: ['The acceleration', 'The velocity', 'The displacement', 'The distance travelled'],
              answer_index: 1,
              feedback_right: 'Right — slope of x–t is velocity, slope of v–t is acceleration.',
              feedback_wrong: 'Each graph gives the *next* quantity down as its slope: x–t gives velocity, v–t gives acceleration. Which graph you are looking at completely changes what a slope means.',
            },
          }),
        st('$ a = \\frac{\\Delta v}{\\Delta t} = \\frac{8 - 2}{10 - 0} $',
          'Rise over run, using the two points given.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\frac{8 - 2}{10} $. Give the answer in m/s².',
              blank_answer: '0.6',
              feedback_right: 'Yes — 0.6 m/s².',
              feedback_wrong: '$ (8-2)/10 = 6/10 = 0.6 $ m/s². A common slip is dividing 8 by 10 and forgetting that the velocity started at 2, not 0.',
            },
          }),
        st('$ a = 0.6\\ \\text{m/s}^2 $, constant',
          'The line is straight, so the acceleration has the same value throughout — this is uniformly accelerated motion.', {
            why: 'A straight v–t line is the single most important shape in this chapter. It is exactly the condition under which the three equations of motion on page 9 are allowed to be used, and the only condition.',
          }),
      ],
      now_you_try: {
        problem: 'A v–t graph is a straight line from $ v = 10 $ m/s at $ t = 0 $ down to $ v = 0 $ at $ t = 4 $ s. Find the acceleration and describe the motion.',
        answer: '$ a = -2.5 $ m/s² — the particle slows uniformly and comes to rest after 4 s.',
        solution: 'Slope $ = \\frac{0 - 10}{4 - 0} = -2.5 $ m/s². The velocity stays positive throughout while the acceleration is negative, so the particle is moving in the positive direction and slowing down, reaching rest exactly at $ t = 4 $ s.',
      },
    }),
    b('callout', 12, {
      variant: 'note',
      title: 'Why real graphs have no sharp corners',
      markdown: 'Many textbook graphs — including several in this chapter — have sudden kinks in them, where the slope jumps from one value to another.\n\nStrictly, that cannot happen. A kink on a v–t graph would mean the acceleration changed instantaneously; a kink on an x–t graph would mean the velocity did. In reality **velocity and acceleration are always continuous**: they change quickly, sometimes very quickly, but never in literally zero time.\n\nThe kinks are a drawing convenience, and they are harmless as long as you know they are there. It is also why "what is the acceleration at exactly $ t = 4 $ s?" is a slightly unfair question when $ t = 4 $ s is a corner.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The SI unit of acceleration is:',
          ['m/s', 'm/s²', 'm²/s', 's/m²'], 1,
          'Acceleration is a velocity (m/s) divided by a time (s), which gives $ \\text{m}\\,\\text{s}^{-1}/\\text{s} = \\text{m/s}^2 $. This is a good place to use the dimensional habit from Chapter 1 — build the unit from the definition rather than recalling it.', 1),
        q('An object moves round a circular track at a constant speed of 10 m/s. Is it accelerating?',
          ['No — its speed stays constant the whole way round', 'Yes — its direction, and therefore its velocity, is changing', 'Only when it speeds up or slows down on the track', 'Only at the very start of the motion'], 1,
          'Acceleration is the rate of change of *velocity*, not of speed. Going round a bend continuously changes the direction of the velocity, so the velocity is changing and there is an acceleration — even though the speedometer never moves.', 2),
        q('A particle\'s v–t graph is a horizontal straight line above the time axis. The particle has:',
          ['Constant non-zero velocity and zero acceleration', 'Zero velocity and constant acceleration', 'Increasing velocity', 'Constant acceleration and increasing speed'], 0,
          'The height of the line is the velocity, so a horizontal line above the axis means a constant non-zero velocity. The slope of that line is the acceleration, and a horizontal line has zero slope.', 2),
        q('The velocity of a particle changes from $ +3 $ m/s to $ -3 $ m/s in 2 s. Its average acceleration is:',
          ['$ 0 $', '$ -3 $ m/s²', '$ -6 $ m/s²', '$ +3 $ m/s²'], 1,
          'Change in velocity is final minus initial: $ (-3) - (+3) = -6 $ m/s. Dividing by the 2 s interval gives $ -3 $ m/s². Answering zero comes from thinking the speeds "cancel" — they do not, because the two velocities point in opposite directions, so the change is larger than either one.', 3),
      ],
    }),
    b('callout', 14, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ \\bar{a} = \\dfrac{\\Delta v}{\\Delta t} $ and $ a = \\dfrac{dv}{dt} $ — the same definition as velocity, applied one level up.\n- **Acceleration is the slope of the v–t graph.**\n- On an **x–t** graph, acceleration shows up as **curvature**: bending up is positive, bending down is negative, straight is zero.\n- A velocity can change through its **size**, its **direction**, or both. All three are accelerations.\n- A straight v–t line means **uniform acceleration** — the condition every equation on page 9 depends on.',
    }),
    b('practice_bank', 15, {
      title: 'You solve it',
      intro: 'Seven questions. Write the signs of both velocities down before you subtract — that alone will fix most of the errors on this page.',
      sections: [
        {
          id: 'p5-ysi',
          title: 'Rates of change of velocity',
          items: [
            num('p5-y1', 'A train\'s velocity changes from 15 m/s to 33 m/s in 12 s. Find its average acceleration.',
              '1.5 m/s²',
              '$ \\bar{a} = \\frac{33 - 15}{12} = \\frac{18}{12} = 1.5 $ m/s². The train gains 1.5 m/s of velocity every second.'),
            mcq('p5-y2', 'A body has a constant non-zero acceleration. Which of these must be true?',
              ['Its velocity changes by equal amounts in equal intervals of time', 'Its position changes by equal amounts in equal intervals of time', 'Its speed must be increasing', 'Its velocity must be positive'], 0,
              'Constant acceleration means the rate of change of velocity is fixed, so equal times bring equal changes in velocity. Equal changes in *position* would mean constant velocity, i.e. zero acceleration — and whether the speed grows depends on whether the velocity and acceleration share a sign.'),
            num('p5-y3', 'A ball moving at 8.0 m/s towards a wall bounces straight back at 6.0 m/s. If the contact lasts 0.010 s, find the magnitude of the average acceleration during contact.',
              '1400 m/s²',
              'Taking the incoming direction as positive: $ \\Delta v = (-6.0) - (+8.0) = -14.0 $ m/s. So $ \\bar{a} = \\frac{-14.0}{0.010} = -1400 $ m/s², of magnitude 1400 m/s². Adding the two speeds rather than subtracting them is what makes rebound accelerations so large.'),
            mcq('p5-y4', 'A particle has velocity $ v = (4 + 3t) $ m/s. Its acceleration is:',
              ['$ 3 $ m/s², constant', '$ 4 $ m/s², constant', '$ (4 + 3t) $ m/s²', 'Zero'], 0,
              'Differentiate with respect to time: $ a = \\frac{dv}{dt} = 3 $ m/s². The 4 is the velocity at $ t = 0 $ — a constant term in the velocity contributes nothing to the acceleration.'),
            num('p5-y5', 'A particle moves with velocity $ v = (10 + 2t + 3t^2) $ m/s. Find its acceleration at $ t = 2 $ s.',
              '14 m/s²',
              '$ a = \\frac{dv}{dt} = 2 + 6t $. At $ t = 2 $ s, $ a = 2 + 12 = 14 $ m/s². Note the acceleration is not constant here, so none of the equations of motion from page 9 would apply to this particle.'),
            mcq('p5-y6', 'On an x–t graph, a curve that bends downward (concave down) throughout indicates:',
              ['Positive acceleration', 'Negative acceleration', 'Zero acceleration', 'Constant velocity'], 1,
              'Curvature on an x–t graph carries the sign of the acceleration. Bending downward means the slope — the velocity — is steadily decreasing, which is a negative acceleration. A thrown ball\'s x–t graph has exactly this shape for its whole flight.'),
            num('p5-y7', 'A car moving at 90 km/h is brought to rest in 5.0 s. Find its average acceleration in m/s².',
              '$ -5.0 $ m/s²',
              'Convert first: $ 90 $ km/h $ = 90 \\times \\frac{1000}{3600} = 25 $ m/s. Then $ \\bar{a} = \\frac{0 - 25}{5.0} = -5.0 $ m/s². The minus sign says the acceleration points opposite to the motion, which is what brings the car to rest.'),
          ],
        },
      ],
    }),
    b('text', 16, {
      markdown: 'You now have all three quantities. But there is one question about them that trips up more students than any other in this chapter, and it deserves a page of its own:\n\n**if the acceleration is negative, is the object slowing down?**\n\nThe answer is: not necessarily. And the reason why is worth understanding properly.',
    }),
  ],
};

// ── p6 · The Sign Trap ───────────────────────────────────────────────────────
const p6 = {
  page_number: 6,
  slug: 'speeding-up-or-slowing-down',
  title: 'Speeding Up or Slowing Down — the Sign Trap',
  subtitle: 'Why the sign of the acceleration tells you nothing on its own',
  glossary: [
    { term: 'retardation', definition: 'A word describing motion in which the speed is decreasing. It is not the same as "negative acceleration" — that depends on which direction you chose as positive.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Throw a ball straight up. At the highest point of its flight, its velocity is exactly zero — for one instant it is not moving at all. What is its acceleration at that same instant?',
      hint: 'Ask what would happen next if the acceleration really were zero.',
      reveal: 'Its acceleration is $ 9.8\\ \\text{m/s}^2 $ downwards — exactly what it was on the way up, and exactly what it will be on the way down. It never changes for a moment.\n\nHere is the test. If the acceleration really were zero at the top, the ball would have zero velocity and no reason to change it. It would **hang there in the air forever**.\n\nIt does not hang there. So the acceleration at the top is not zero. **Zero velocity does not mean zero acceleration** — velocity is where you are going, acceleration is how that is being changed, and there is no rule that says they must vanish together.',
    }),
    b('text', 1, {
      markdown: 'Now the harder half of the same idea.\n\nOn the way **up**, the ball is slowing down. On the way **down**, the ball is speeding up. And the acceleration was identical the whole time — same size, same direction, never changing.\n\nSo the acceleration cannot be what decides whether something speeds up or slows down. Something else is doing that work.',
    }),
    b('inline_quiz', 82, {
      pass_threshold: 0.6,
      questions: [
        q('A ball is thrown straight up. Over the WHOLE flight, how many times does its acceleration change?',
          ['Never — it is the same at every instant', 'Once, at the highest point', 'Twice', 'Continuously'], 0,
          'Gravity acts with the same size and the same direction from the moment the ball leaves the hand until it is caught. The velocity reverses; the acceleration does not change at all. That single fact is what makes this page necessary.', 2),
        q('If the acceleration really were zero at the top of the flight, the ball would:',
          ['Fall faster', 'Stay there indefinitely', 'Reverse instantly', 'Continue upward forever'], 1,
          'It would have zero velocity and nothing acting to change it — so it would hang in the air. That it does not is the proof that the acceleration at the top is not zero.', 2),
      ],
    }),
    b('heading', 2, {
      text: 'The rule that actually works',
      level: 2,
      objective: 'Decide whether a particle is speeding up or slowing down from the signs of v and a.',
    }),
    b('text', 3, {
      markdown: 'What decides it is whether the acceleration points **along** the velocity or **against** it.\n\n- Acceleration along the velocity — the same sign — and the speed **grows**.\n- Acceleration against the velocity — opposite signs — and the speed **falls**.\n\nThat is the whole rule. Fill the table in yourself before you read on: for each combination of signs, is the particle speeding up or slowing down?',
    }),
    b('image', 4, {
      src: '',
      alt: 'A two-by-two grid with the sign of velocity on one axis and the sign of acceleration on the other, four cells left empty for the student to fill.',
      aspect_ratio: '4:3',
      figure_key: 'ch2-sign-quadrant',
      caption: 'Four combinations of sign. Only two things can happen — and which one depends on whether the signs match.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. A two-by-two grid drawn with thin hairline dividers, no outer box. The rows labelled "v positive" and "v negative" on the left; the columns labelled "a positive" and "a negative" along the top. Each of the four cells contains a small horizontal arrow pair: one arrow for velocity and one for acceleration, pointing left or right according to the signs of that cell. Minimal, precise, schematic, no other text. Dark background with orange and amber accents only.',
    }),
    b('table', 5, {
      caption: 'The four sign combinations',
      headers: ['Velocity', 'Acceleration', 'Signs match?', 'What happens'],
      rows: [
        ['$ + $', '$ + $', 'Yes', '**Speeding up**, moving in the positive direction'],
        ['$ + $', '$ - $', 'No', '**Slowing down**, moving in the positive direction'],
        ['$ - $', '$ - $', 'Yes', '**Speeding up**, moving in the negative direction'],
        ['$ - $', '$ + $', 'No', '**Slowing down**, moving in the negative direction'],
      ],
    }),
    b('callout', 6, {
      variant: 'remember',
      title: 'Say this one out loud',
      markdown: '**Same signs, speeding up. Opposite signs, slowing down.**\n\nNotice what the table does *not* contain: any row where the sign of $ a $ alone decides the answer. Both of the "speeding up" rows and both of the "slowing down" rows contain one positive acceleration and one negative acceleration.\n\nThat is why "negative acceleration means slowing down" is false — and it is probably the most common single mistake in this whole chapter.',
    }),
    b('inline_quiz', 83, {
      pass_threshold: 0.6,
      questions: [
        q('Which pair of facts is enough to decide whether a particle is speeding up?',
          ['The sign of the acceleration alone', 'The signs of the velocity and the acceleration', 'The position and the velocity', 'The magnitude of the acceleration alone'], 1,
          'You need both signs, and only their agreement matters: matching signs mean speeding up, opposite signs mean slowing down. The sign of the acceleration on its own depends on which direction you happened to call positive.', 2),
      ],
    }),
    b('step_solver', 7, {
      title: 'The same ball, described two ways',
      problem: 'A ball is thrown straight upward at 20 m/s and caught again. Describe the sign of its velocity and of its acceleration, on the way up and on the way down, (a) taking upward as positive, and then (b) taking downward as positive.',
      intro: 'Two completely different sets of signs describing one completely unchanged ball. Watch which conclusions survive the switch.',
      steps: [
        st('Upward positive · going up: $ v > 0 $, $ a = -9.8\\ \\text{m/s}^2 $',
          'The ball moves up, so its velocity is positive. Gravity pulls down, which is the negative direction, so the acceleration is negative.', {
            check: {
              kind: 'mcq',
              prompt: 'Velocity positive, acceleration negative. Signs match or not — and so, speeding up or slowing down?',
              options: ['Signs match, speeding up', 'Signs differ, slowing down', 'Signs match, slowing down', 'Signs differ, speeding up'],
              answer_index: 1,
              feedback_right: 'Right — and that matches what you see: a ball thrown up does slow down.',
              feedback_wrong: 'One is positive and one is negative, so the signs differ, and opposite signs mean the speed is falling. That is exactly what a ball thrown upward does.',
            },
          }),
        st('Upward positive · coming down: $ v < 0 $, $ a = -9.8\\ \\text{m/s}^2 $',
          'Now the ball moves downward, so its velocity is negative. Gravity has not changed — the acceleration is still negative.', {
            why: 'This is the crucial line. The acceleration is negative on the way up *and* on the way down. It is the velocity that flipped sign, not the acceleration.',
          }),
        st('signs now MATCH, so the ball is **speeding up**',
          'Two negatives. Same sign, so the speed grows — which is exactly what a falling ball does.', {
            check: {
              kind: 'mcq',
              prompt: 'The acceleration was negative in both phases. Did the ball slow down in both phases?',
              options: [
                'Yes — negative acceleration always means slowing down',
                'No — it slowed on the way up and sped up on the way down',
                'Yes, but only because it was thrown upward',
                'It stayed at constant speed throughout',
              ],
              answer_index: 1,
              feedback_right: 'Exactly. Same acceleration throughout, opposite outcomes — because the velocity changed sign.',
              feedback_wrong: 'The acceleration was $ -9.8 $ m/s² for the whole flight, yet the ball visibly slowed on the way up and sped up on the way down. So a negative acceleration cannot, by itself, mean "slowing down".',
            },
          }),
        st('Downward positive · going up: $ v < 0 $, $ a = +9.8\\ \\text{m/s}^2 $ · coming down: $ v > 0 $, $ a = +9.8\\ \\text{m/s}^2 $',
          'Now flip the convention. Every single sign reverses — the acceleration is positive throughout, and the velocity is negative going up and positive coming down.', {
            why: 'And yet: going up the signs still differ, so it still slows down; coming down they still match, so it still speeds up. **The physical conclusions are untouched.** Only the bookkeeping changed.',
          }),
      ],
      now_you_try: {
        problem: 'A lift is descending and slowing down as it approaches a floor. Taking upward as positive, what are the signs of its velocity and its acceleration?',
        answer: 'Velocity negative, acceleration positive.',
        solution: 'Descending means the velocity points downward, so with upward positive it is negative. It is slowing down, so the acceleration must oppose the velocity — which puts it upward, i.e. positive. Note the acceleration points *up* while the lift moves *down*: perfectly ordinary, and exactly what "slowing down" requires.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A particle has velocity $ -5 $ m/s and acceleration $ -2 $ m/s². The particle is:',
          ['Speeding up, moving in the negative direction', 'Slowing down, moving in the negative direction', 'Speeding up, moving in the positive direction', 'At rest'], 0,
          'Both quantities are negative, so the signs match and the speed is increasing. The negative velocity says that increasing speed is being built up in the negative direction.', 2),
        q('"A particle with a positive value of acceleration must be speeding up." This statement is:',
          ['True always', 'True only in one dimension', 'False — it depends on the sign of the velocity', 'False — acceleration cannot be positive'], 2,
          'A positive acceleration acting on a particle with negative velocity opposes that motion and slows it down. Whether the speed grows depends on whether the two signs agree, never on the sign of the acceleration by itself.', 2),
        q('At the highest point of a ball\'s vertical flight:',
          ['Both velocity and acceleration are zero', 'Velocity is zero, acceleration is not', 'Acceleration is zero, velocity is not', 'Neither is zero'], 1,
          'The ball is momentarily stationary, so its velocity is zero. Its acceleration is still $ g $ downwards — which is precisely why it does not stay up there.', 1),
      ],
    }),
    b('step_solver', 9, {
      title: 'Deciding without a diagram',
      problem: 'A particle moving along the x-axis has velocity $ -8 $ m/s and acceleration $ +3 $ m/s², both at the same instant. Is it speeding up or slowing down? Where is it heading? And what will happen if the acceleration keeps acting?',
      intro: 'No picture, no story — just two signed numbers. This is the form the question takes in an exam, so practise answering it from the signs alone.',
      steps: [
        st('$ v = -8 $ (negative) · $ a = +3 $ (positive)',
          'Write both signs down explicitly before you think about anything else.', {
            check: {
              kind: 'mcq',
              prompt: 'The signs are opposite. What does that tell you?',
              options: ['The particle is speeding up', 'The particle is slowing down', 'The particle is at rest', 'Nothing can be decided'],
              answer_index: 1,
              feedback_right: 'Right — opposite signs mean the acceleration fights the motion.',
              feedback_wrong: 'Same signs, speeding up; opposite signs, slowing down. Here one is negative and one is positive, so the acceleration opposes the velocity and the speed falls.',
            },
          }),
        st('Signs differ, so the particle is **slowing down**.',
          'Its speed is 8 m/s now, and it is dropping at 3 m/s every second.', {
            why: 'Notice we did not need to know what is causing the acceleration, or where the particle is, or how it got here. Two signs were enough.',
          }),
        st('The velocity is negative, so it is moving in the **negative direction**.',
          'Slowing down and moving backwards are two separate facts, and they come from two different pieces of information.', {
            check: {
              kind: 'mcq',
              prompt: 'The acceleration is positive. Which way does the particle move?',
              options: [
                'In the positive direction, because the acceleration is positive',
                'In the negative direction, because the velocity is negative',
                'It cannot be determined from these numbers',
                'It is at rest',
              ],
              answer_index: 1,
              feedback_right: 'Yes — direction of travel is always read from the velocity, never from the acceleration.',
              feedback_wrong: 'The *velocity* says which way something is going; the acceleration only says how that is being changed. A negative velocity means motion in the negative direction, whatever the acceleration is doing.',
            },
          }),
        st('$ v = -8 + 3t $, which reaches zero at $ t = \\frac{8}{3} \\approx 2.7 $ s, then turns positive.',
          'If the acceleration persists, the velocity climbs through zero and the particle reverses — after which the signs match and it starts speeding up in the positive direction.', {
            why: 'One unchanging acceleration, and the particle first slows, then stops, then speeds up the other way. Exactly the ball-thrown-upward story, with the numbers changed. Recognising that these are the same problem is worth more than memorising either one.',
          }),
      ],
      now_you_try: {
        problem: 'A particle has velocity $ +12 $ m/s and acceleration $ -4 $ m/s². Is it speeding up or slowing down, and when does it reverse direction?',
        answer: 'Slowing down; it reverses at $ t = 3 $ s.',
        solution: 'The signs are opposite, so the particle is slowing down while still moving in the positive direction. Its velocity is $ v = 12 - 4t $, which reaches zero at $ t = 3 $ s. After that the velocity is negative while the acceleration is still negative — signs now match — so it speeds up in the negative direction.',
      },
    }),
    b('heading', 10, {
      text: 'So what does "deceleration" mean?',
      level: 2,
      objective: 'Use the words retardation and deceleration correctly, without tying them to a sign.',
    }),
    b('text', 10, {
      markdown: 'You will meet the words **deceleration** and **retardation** constantly, especially in problems about braking.\n\nThey describe an *observation*: the speed is falling. They do **not** mean "the acceleration is negative" — that phrase depends entirely on which direction you happened to call positive, and a problem can be set up either way.\n\nSo when a question says "a car decelerates at 5 m/s²", read it as: *the acceleration has magnitude 5 m/s² and it points against the motion.* Then choose your axis, and write the sign yourself.',
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'Read each statement about a particle in one-dimensional motion and decide whether it is true or false, giving a reason and an example:\n\n(a) With zero speed at an instant, it may have non-zero acceleration at that instant.\n(b) With zero speed, it may have non-zero velocity.\n(c) With constant speed, it must have zero acceleration.\n(d) With a positive value of acceleration, it must be speeding up.',
      reveal: '**(a) True.** A ball at the very top of its flight has zero speed and an acceleration of $ g $ downwards. If this were not possible, nothing thrown upward could ever come back.\n\n**(b) False.** Speed is defined as the magnitude of the velocity. If the magnitude is zero, the velocity itself is zero — there is nothing left for it to be.\n\n**(c) True, for motion along a straight line.** In one dimension a particle can only reverse by passing through zero speed, so if the speed is constant and non-zero the velocity never changes at all, and the acceleration is zero. **Be careful:** this is only true in one dimension. A body going round a circle at constant speed is accelerating the whole time, because its direction keeps changing.\n\n**(d) False.** A positive acceleration acting on a particle that is moving in the negative direction opposes the motion and slows it down. Whether the speed grows depends on whether $ v $ and $ a $ share a sign — never on the sign of $ a $ alone.',
      difficulty_level: 3,
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'logical',
      prompt: 'A student says: "If a particle is accelerating, then it is either speeding up or slowing down." Do you agree? Does your answer change if the particle is allowed to move in a plane rather than along a line?',
      reveal: '**Along a straight line, the student is right.** With only two directions available, the acceleration is either along the velocity or against it, so the speed must be changing one way or the other.\n\n**In a plane, the student is wrong.** The acceleration can point at right angles to the velocity — and then it changes only the *direction* of motion, leaving the speed completely untouched. A stone whirled on a string at constant speed is accelerating every instant, and its speed never changes at all.\n\nThis is worth noticing now, because it is the idea the whole of circular motion rests on. In this chapter the student\'s statement is safe. From the next chapter onwards, it is not.',
      difficulty_level: 3,
    }),
    b('step_solver', 13, {
      title: 'A lift, described four ways',
      problem: 'A lift can be (a) going up and speeding up, (b) going up and slowing down, (c) going down and speeding up, or (d) going down and slowing down. Taking upward as positive, write the signs of $ v $ and $ a $ in each case.',
      intro: 'Four cases, one table. Fill it in yourself as you go — this is the sign quadrant with a real object in it.',
      steps: [
        st('(a) up, speeding up: $ v > 0 $ and $ a > 0 $',
          'Going up fixes the velocity as positive. Speeding up means the acceleration must agree with it.', {
            check: {
              kind: 'mcq',
              prompt: 'Case (b): going up but slowing down. What are the signs?',
              options: ['$ v > 0 $, $ a > 0 $', '$ v > 0 $, $ a < 0 $', '$ v < 0 $, $ a > 0 $', '$ v < 0 $, $ a < 0 $'],
              answer_index: 1,
              feedback_right: 'Right — still going up, so $ v > 0 $; slowing, so $ a $ must oppose it.',
              feedback_wrong: 'Going up still means $ v > 0 $. Slowing down means the acceleration opposes the velocity, so it must be negative.',
            },
          }),
        st('(b) up, slowing: $ v > 0 $, $ a < 0 $ · (c) down, speeding up: $ v < 0 $, $ a < 0 $',
          'Going down makes the velocity negative. Speeding up again means the signs must match — so the acceleration is negative too.', {
            why: 'Look at cases (a) and (c): both are "speeding up", and their accelerations have *opposite* signs. That single comparison is the whole reason the sign of $ a $ cannot tell you whether something is speeding up.',
          }),
        st('(d) down, slowing: $ v < 0 $, $ a > 0 $',
          'The lift arriving at a floor from above: moving down, being slowed, so the acceleration points up.', {
            check: {
              kind: 'mcq',
              prompt: 'In which two of the four cases does the acceleration point **upward**?',
              options: ['(a) and (b)', '(a) and (d)', '(b) and (c)', '(c) and (d)'],
              answer_index: 1,
              feedback_right: 'Yes — upward acceleration in (a) going up faster, and (d) going down more slowly.',
              feedback_wrong: 'The acceleration is positive — upward — in case (a) (rising and speeding up) and case (d) (descending and slowing). In (b) and (c) it is negative, i.e. downward.',
            },
          }),
      ],
      now_you_try: {
        problem: 'You are in a lift and feel briefly heavier than normal. Is the lift accelerating upward or downward — and can you tell from that alone whether it is going up or down?',
        answer: 'Accelerating upward. No — you cannot tell which way it is travelling.',
        solution: 'Feeling heavier means the floor is pushing up on you harder than usual, so your acceleration is upward — the acceleration is positive. But that is consistent with two completely different journeys: rising and speeding up (case a), or descending and slowing down (case d). Your body senses the acceleration, not the velocity, which is exactly why you cannot feel steady motion at all.',
      },
    }),
    b('classify_exercise', 14, {
      question: 'For a particle moving along a straight line, decide whether each statement is **always** true.',
      column_label: 'Statement',
      verdict_label: 'Always true?',
      yes_label: '✓ Always true',
      no_label: '✗ Not always',
      rows: [
        { substance: 'If velocity and acceleration have opposite signs, the object is slowing down.', is_solution: true, explanation: 'Always true. Opposite signs mean the acceleration opposes the motion, which reduces the speed.' },
        { substance: 'If position and velocity have opposite signs, the particle is moving towards the origin.', is_solution: true, explanation: 'Always true. A particle at a positive position with a negative velocity is heading back towards zero, and the mirror case works the same way.' },
        { substance: 'If the velocity is zero at an instant, the acceleration must also be zero at that instant.', is_solution: false, explanation: 'False — the ball at the top of its flight is the standard counterexample: zero velocity, acceleration $ g $ downwards.' },
        { substance: 'If the velocity is zero throughout a time interval, the acceleration is zero at every instant inside that interval.', is_solution: true, explanation: 'True. Staying at zero velocity for a whole interval means the velocity is not changing during it, and an unchanging velocity means zero acceleration. (Note how different this is from the previous row, which is about a single instant.)' },
        { substance: 'If the acceleration is negative, the particle is slowing down.', is_solution: false, explanation: 'False. It depends entirely on the sign of the velocity — and on which direction you chose as positive in the first place.' },
        { substance: 'If the speed is constant and non-zero, the acceleration is zero.', is_solution: true, explanation: 'True in one dimension only. The particle cannot reverse without passing through zero speed, so its velocity is genuinely unchanging. In two dimensions this fails badly — think of circular motion.' },
      ],
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('A car is travelling due east and slowing down. The direction of its acceleration is:',
          ['Due east', 'Due west', 'Zero', 'Perpendicular to the motion'], 1,
          'Slowing down means the acceleration opposes the velocity. The velocity points east, so the acceleration points west — regardless of which direction anyone chose to call positive.', 2),
        q('Which pair of signs describes a particle moving in the negative direction and slowing down?',
          ['$ v < 0 $, $ a < 0 $', '$ v < 0 $, $ a > 0 $', '$ v > 0 $, $ a < 0 $', '$ v > 0 $, $ a > 0 $'], 1,
          'Moving in the negative direction fixes $ v < 0 $. Slowing down requires the acceleration to oppose that, so it must be positive. Both negatives would instead mean speeding up in the negative direction.', 2),
        q('A ball is thrown vertically upward. Taking upward as positive, which graph shape correctly describes its **acceleration** against time for the whole flight?',
          ['A horizontal line at $ -9.8 $ m/s²', 'A horizontal line at $ +9.8 $ m/s²', 'A line crossing zero at the highest point', 'A curve that reaches zero at the highest point'], 0,
          'Gravity acts downward with the same magnitude for the entire flight, so with upward positive the acceleration is a constant $ -9.8 $ m/s². Anything that touches zero at the top would mean the ball briefly stops being pulled down — and then it would never come back.', 2),
      ],
    }),
    b('callout', 15, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Same signs, speeding up. Opposite signs, slowing down.**\n- The **sign of $ a $ alone tells you nothing** — it depends on which direction you called positive.\n- **Zero velocity does not mean zero acceleration.** The ball at the top of its flight is the standard example.\n- "Deceleration" and "retardation" describe the *motion*, not the sign. Read them as "the acceleration opposes the velocity", then choose your own axis.\n- In one dimension, constant non-zero speed does mean zero acceleration. **This stops being true the moment motion leaves the straight line.**',
    }),
    b('practice_bank', 16, {
      title: 'You solve it',
      intro: 'Eight questions. For each one, write down the sign of $ v $ and the sign of $ a $ before you answer anything else.',
      sections: [
        {
          id: 'p6-ysi',
          title: 'Signs, speeding up, and slowing down',
          items: [
            mcq('p6-y1', 'A particle moves along the positive x-direction with a negative acceleration. Which is true?',
              ['It is slowing down and may later reverse direction', 'It is speeding up in the positive direction', 'It must already be moving backwards along the axis', 'Its speed is constant'], 0,
              'Opposite signs mean the speed is falling. If the acceleration persists, the velocity will reach zero and then go negative — so the particle slows, stops, and reverses. A ball thrown upward does exactly this.'),
            mcq('p6-y2', 'A stone is dropped from rest and falls freely. Taking downward as positive, the signs of its velocity and acceleration during the fall are:',
              ['Both positive', 'Both negative', 'Velocity positive, acceleration negative', 'Velocity negative, acceleration positive'], 0,
              'With downward chosen as positive, both the motion and gravity point in the positive direction, so both are positive. The signs match, which correctly predicts that the stone speeds up as it falls.'),
            num('p6-y3', 'A particle has velocity $ +4 $ m/s and acceleration $ -2 $ m/s², both constant in sign. Describe what happens over the next 4 seconds.',
              'It slows to rest after 2 s, then reverses and speeds up in the negative direction, reaching $ -4 $ m/s at $ t = 4 $ s.',
              'Initially the signs differ, so the speed falls: $ v = 4 - 2t $, reaching zero at $ t = 2 $ s. After that the velocity is negative while the acceleration is still negative, so the signs now match and the particle speeds up in the negative direction, reaching $ -4 $ m/s at $ t = 4 $ s. Note that the acceleration never changed — only the description of the motion did.'),
            mcq('p6-y4', 'A lift is moving upward and its speed is increasing. Taking upward as positive, the acceleration is:',
              ['Positive', 'Negative', 'Zero', 'Cannot be determined'], 0,
              'Speed increasing means the acceleration is along the velocity. The velocity points upward, which is positive here, so the acceleration is positive too.'),
            mcq('p6-y5', 'Two students describe the same braking car. One takes the direction of motion as positive and writes $ a = -4 $ m/s². The other takes the opposite direction as positive. The second student writes:',
              ['$ a = -4 $ m/s²', '$ a = +4 $ m/s²', '$ a = 0 $', '$ a = -8 $ m/s²'], 1,
              'Flipping the positive direction flips the sign of every signed quantity, so the acceleration becomes $ +4 $ m/s². Both students agree the car is slowing, because in the second student\'s frame the velocity is now negative and the signs still differ.'),
            num('p6-y6', 'A particle moving in a straight line has constant speed. What is its acceleration, and what would your answer be if the particle were moving on a circular path at that same constant speed?',
              'Zero in a straight line; non-zero on a circle.',
              'Along a straight line, constant speed means constant velocity (the particle cannot reverse without passing through zero speed), so the acceleration is zero. On a circle the direction of the velocity changes continuously, so the velocity is changing even though its magnitude is not — and there is a non-zero acceleration throughout, directed towards the centre.'),
            mcq('p6-y7', 'A body is thrown vertically upward. Which quantity remains constant throughout its flight?',
              ['Speed', 'Velocity', 'Acceleration', 'Kinetic energy'], 2,
              'The acceleration is $ g $ downward from the moment it leaves the hand until the moment it is caught — unchanged in size and direction. The speed falls and then grows, the velocity reverses sign, and the kinetic energy follows the speed.'),
            mcq('p6-y8', 'A particle is at $ x = -6 $ m with velocity $ +3 $ m/s. Which statement is correct?',
              ['It is moving towards the origin', 'It is moving away from the origin', 'It is at rest', 'It must be decelerating'], 0,
              'Position and velocity have opposite signs, so the particle is heading back towards zero. Nothing here says anything at all about the acceleration — it could be speeding up, slowing down, or neither.'),
          ],
        },
      ],
    }),
    b('text', 17, {
      markdown: 'You can now go from position to velocity to acceleration by taking slopes.\n\nThe next page goes the **other way** — and shows that the operation that takes you back up the chain is not a slope at all. It is an area.',
    }),
  ],
};

// ── p7 · Slope Down, Area Up ─────────────────────────────────────────────────
const p7 = {
  page_number: 7,
  slug: 'slope-down-area-up',
  title: 'Slope Down, Area Up',
  subtitle: 'The two operations that connect all three graphs',
  glossary: [
    { term: 'area under a graph', definition: 'The area between the curve and the horizontal axis. Area counted below the axis is negative.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A car travels at a steady 12 m/s for 5 s. Draw its v–t graph and you get a rectangle 5 units wide and 12 units tall, so its "area" is 60. Sixty of what? An area ought to be in square metres — but there is not a single metre on the horizontal axis.',
      hint: 'Multiply the units on the two axes together and see what you get.',
      reveal: 'Multiply the units, not just the numbers.\n\nThe height is in **metres per second**. The width is in **seconds**. So the area carries units of $ \\text{m/s} \\times \\text{s} = \\text{m} $.\n\nMetres. The area under a velocity–time graph is a **distance** — a displacement, to be exact. And indeed the car travelled $ 12 \\times 5 = 60 $ m.\n\nThis is exactly the dimensional habit from Chapter 1 paying off. The units on the axes told you what the area meant before you knew any physics about it.',
    }),
    b('text', 1, {
      markdown: 'That single observation completes the structure of the chapter.\n\nGoing **down** the chain — position to velocity to acceleration — you take a **slope**.\n\nGoing **up** the chain — acceleration to velocity to position — you take an **area**.\n\nTwo operations, applied in two directions, and that is the whole toolkit.',
    }),
    b('image', 2, {
      src: '',
      alt: 'A vertical map showing x–t, v–t and a–t stacked, with downward arrows labelled "slope" and upward arrows labelled "area".',
      aspect_ratio: '4:3',
      figure_key: 'ch2-slope-area-map',
      caption: 'The whole chapter on one diagram. Slope takes you down; area takes you back up.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. Three small graph thumbnails stacked vertically and centred: the top one labelled x-t, the middle one v-t, the bottom one a-t. On the left, two downward-pointing arrows connecting them, labelled "slope". On the right, two upward-pointing arrows connecting them, labelled "area". No boxes, structure from whitespace and thin hairline dividers. Minimal, precise, schematic. Dark background with orange and amber accents only.',
    }),
    b('table', 3, {
      caption: 'What the slope and the area of each graph mean',
      headers: ['Graph', 'Slope gives', 'Area under it gives'],
      rows: [
        ['**x–t**', 'Velocity', '*Nothing physical* — do not use it'],
        ['**v–t**', 'Acceleration', '**Displacement**'],
        ['**a–t**', '(Rarely needed)', '**Change in velocity**'],
      ],
    }),
    b('callout', 4, {
      variant: 'warning',
      title: 'The area under an x–t graph means nothing',
      markdown: 'This is worth stating explicitly, because a question will eventually offer it to you as an option.\n\nMultiply the units on an x–t graph and you get metre-seconds. No physical quantity in mechanics has that unit. The area under a position–time graph is a number you can compute and cannot use.\n\nSlope is meaningful on all three graphs. Area is meaningful on only two of them.',
    }),
    b('inline_quiz', 84, {
      pass_threshold: 0.6,
      questions: [
        q('Multiply the units on the two axes of a v–t graph. What do you get?',
          ['m/s²', 'm', 's', 'm²'], 1,
          '(m/s) × s = m. The area under a v–t graph therefore has the units of a length — which is why it turns out to be a displacement. The units told you what the area meant before any physics did.', 2),
        q('Going UP the chain from acceleration to velocity to position, the operation you need at each step is:',
          ['A slope', 'An area', 'A square root', 'A differentiation'], 1,
          'Slope takes you down the chain; area takes you back up it. Differentiation is the algebraic name for taking a slope, so it belongs to the downward direction.', 2),
      ],
    }),
    b('step_solver', 5, {
      title: 'From a rectangle to a trapezium',
      problem: 'A particle\'s v–t graph is a straight line rising from $ v = 2 $ m/s at $ t = 0 $ to $ v = 8 $ m/s at $ t = 10 $ s. Find the distance it travels in those 10 s.',
      intro: 'The velocity is changing, so you cannot just multiply speed by time. But the area still works — you just need the area of a slightly better shape.',
      steps: [
        st('The region under the line is a **trapezium**.',
          'It has two parallel vertical sides of heights 2 m/s and 8 m/s, separated by a horizontal distance of 10 s.', {
            check: {
              kind: 'mcq',
              prompt: 'Why can we not simply use distance $ = $ speed $ \\times $ time here?',
              options: [
                'Because the time is too long',
                'Because there is no single speed — it changes throughout',
                'Because the graph is a straight line',
                'We can — the answer is $ 8 \\times 10 = 80 $ m',
              ],
              answer_index: 1,
              feedback_right: 'Right. "Speed × time" needs one speed, and here the speed runs from 2 to 8 m/s.',
              feedback_wrong: 'The formula distance $ = $ speed $ \\times $ time assumes a single, unchanging speed. Here the speed is different at every instant, so we need the area instead — which is what the area *is*, in effect: a sum of speed × tiny time over the whole interval.',
            },
          }),
        st('$ \\text{area} = \\frac{1}{2}\\left(v_1 + v_2\\right) \\times \\Delta t = \\frac{1}{2}(2 + 8)(10) $',
          'A trapezium\'s area is the average of the two parallel sides, times the distance between them.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\frac{1}{2}(2 + 8)(10) $. Give the answer in metres.',
              blank_answer: '50',
              feedback_right: 'Yes — 50 m.',
              feedback_wrong: '$ \\frac{1}{2}(10)(10) = 50 $ m.',
            },
          }),
        st('$ \\text{displacement} = 50\\ \\text{m} $',
          'And since the velocity never goes negative, the particle never reverses — so the distance travelled is also 50 m.', {
            why: 'Look again at what the trapezium formula did: it used $ \\frac{2+8}{2} = 5 $ m/s as an effective speed and multiplied by 10 s. That is the average velocity, and the fact that it is the plain average of the two end velocities is a clue about page 9. It only works because the line is straight.',
          }),
      ],
      now_you_try: {
        problem: 'A speed–time graph rises as a straight line from $ 0 $ at $ t = 0 $ to $ 6 $ m/s at $ t = 3 $ s. Find the distance travelled in those 3 s.',
        answer: '9 m',
        solution: 'The region under the line is a right-angled triangle with base 3 s and height 6 m/s, so the area is $ \\frac{1}{2}(3)(6) = 9 $ m. A triangle is just a trapezium with one of its parallel sides shrunk to zero, so the same formula gives the same answer: $ \\frac{1}{2}(0 + 6)(3) = 9 $ m.',
      },
    }),
    b('heading', 6, {
      text: 'Area below the axis is negative — and that is the point',
      level: 2,
      objective: 'Use signed areas to separate distance from displacement on a v–t graph.',
    }),
    b('text', 7, {
      markdown: 'When the v–t curve dips below the time axis, the velocity is negative — the particle is going backwards. The area of that region counts as **negative displacement**.\n\nThat gives you a clean graphical version of the distinction from page 1:\n\n- **Displacement** $ = $ the **signed** area (areas below the axis subtract)\n- **Distance** $ = $ the **total** area, counting every region as positive\n\nSo on a v–t graph, distance and displacement are computed from the same picture by two different rules.',
    }),
    b('image', 8, {
      src: '',
      alt: 'A v–t graph forming a triangle above the time axis followed by an equal triangle below it, the upper region shaded positive and the lower shaded negative.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-signed-area',
      caption: 'Equal areas above and below: 100 m of distance travelled, and a displacement of exactly zero.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. Axes with time horizontal and velocity vertical, the horizontal axis drawn through the middle of the frame. The curve rises from the origin to a peak, returns to the axis, continues down to a symmetric trough, then returns to the axis. The region between the curve and the axis is lightly shaded in both halves, with a small plus sign in the upper region and a small minus sign in the lower region. Minimal, precise, schematic. Dark background with orange and amber accents only.',
    }),
    b('step_solver', 9, {
      title: 'One graph, two answers',
      problem: 'A particle\'s velocity rises linearly from $ 0 $ to $ +5 $ m/s over the first 10 s, falls linearly back to $ 0 $ at $ t = 20 $ s, continues down to $ -5 $ m/s at $ t = 30 $ s, and returns to $ 0 $ at $ t = 40 $ s. Find the distance travelled and the average velocity over the first 40 s.',
      intro: 'Two triangles, one above the axis and one below. Everything depends on how you treat the second one.',
      steps: [
        st('upper triangle: $ \\frac{1}{2}(20)(5) = +50\\ \\text{m} $',
          'The first triangle spans from $ t = 0 $ to $ t = 20 $ s with a peak of 5 m/s. Its area is a positive displacement.', {
            check: {
              kind: 'mcq',
              prompt: 'The triangle runs from $ t = 0 $ to $ t = 20 $ s. What is its base?',
              options: ['10 s', '20 s', '40 s', '5 s'],
              answer_index: 1,
              feedback_right: 'Yes — 20 seconds from where it leaves the axis to where it returns.',
              feedback_wrong: 'The velocity is above the axis from $ t = 0 $ until $ t = 20 $ s, so the triangle\'s base is the whole 20 s. The 10 s is just where its peak sits.',
            },
          }),
        st('lower triangle: $ \\frac{1}{2}(20)(5) = 50\\ \\text{m} $ of area, but $ -50\\ \\text{m} $ of displacement',
          'The second triangle is the same size, but it lies below the axis — the velocity is negative there, so the particle is travelling backwards.', {
            why: 'The area of a shape is never negative in geometry. What we mean is that the *contribution to the displacement* is negative. Compute the area normally, then attach the sign by looking at which side of the axis the region sits on.',
          }),
        st('$ \\text{distance} = 50 + 50 = 100\\ \\text{m} $',
          'Distance ignores the signs: the particle really did cover 100 metres of ground.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the displacement: add the two contributions $ +50 $ and $ -50 $. Give the answer in metres.',
              blank_answer: '0',
              feedback_right: 'Yes — the particle ends up exactly where it started.',
              feedback_wrong: 'The two contributions are $ +50 $ m and $ -50 $ m, which sum to zero. The particle went out 50 m and came back 50 m.',
            },
          }),
        st('$ \\text{average velocity} = \\frac{0}{40} = 0 $',
          'Displacement zero over 40 s, so the average velocity is exactly zero — while the average speed is $ 100/40 = 2.5 $ m/s.', {
            why: 'This is page 2 again, drawn instead of calculated. Whenever a v–t graph has equal areas above and below the axis, you are looking at a round trip.',
          }),
      ],
      now_you_try: {
        problem: 'A particle\'s v–t graph is a horizontal line at $ +4 $ m/s from $ t = 0 $ to $ t = 5 $ s, then a horizontal line at $ -4 $ m/s from $ t = 5 $ s to $ t = 8 $ s. Find the distance travelled and the displacement over the 8 s.',
        answer: 'Distance 32 m; displacement $ +8 $ m.',
        solution: 'First rectangle: $ 4 \\times 5 = 20 $ m, positive. Second rectangle: $ 4 \\times 3 = 12 $ m of area, but below the axis, so it contributes $ -12 $ m. Distance $ = 20 + 12 = 32 $ m. Displacement $ = 20 - 12 = +8 $ m. The particle went 20 m forward, then came 12 m back, finishing 8 m from where it began.',
      },
    }),
    b('heading', 10, {
      text: 'The same trick, one level down',
      level: 2,
      objective: 'Get a change in velocity from the area under an a–t graph.',
    }),
    b('text', 11, {
      markdown: 'The area rule is not special to v–t graphs. It follows from the definition of a rate, so it applies at every level.\n\nOn an **a–t** graph, multiply the units: $ \\text{m/s}^2 \\times \\text{s} = \\text{m/s} $. A velocity. So:\n\n**Area under an a–t graph $ = $ the change in velocity.**\n\nNote it gives the **change**, not the velocity itself. To get the actual velocity you must be told what it was at some starting instant, and then add.',
    }),
    b('step_solver', 12, {
      title: 'From an acceleration graph to a velocity',
      problem: 'The a–t graph of a particle is a triangle: the acceleration rises linearly from $ 0 $ at $ t = 0 $ to $ 4 $ m/s² at $ t = 2 $ s, then falls linearly back to $ 0 $ at $ t = 4 $ s. The particle\'s velocity at $ t = 0 $ is $ 2 $ m/s. Find its velocity at the end of the fourth second.',
      intro: 'The acceleration is changing the whole time, so no equation of motion applies. The area does.',
      steps: [
        st('$ \\Delta v = \\text{area under the a–t graph} $',
          'That is the rule. It works whatever shape the graph is, which is exactly why it beats the equations of motion here.', {
            check: {
              kind: 'mcq',
              prompt: 'Why can we not use $ v = u + at $ for this problem?',
              options: [
                'Because the initial velocity is not zero',
                'Because $ a $ is not constant — it changes throughout the 4 s',
                'Because the time is too short',
                'We can — take $ a = 4 $ m/s²',
              ],
              answer_index: 1,
              feedback_right: 'Exactly. $ v = u + at $ needs one fixed value of $ a $, and there is not one here.',
              feedback_wrong: 'Every equation of motion assumes the acceleration is constant. Here it climbs from 0 to 4 and back to 0, so there is no single $ a $ to substitute. The area method has no such restriction.',
            },
          }),
        st('$ \\text{area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2}(4)(4) $',
          'The triangle has a base of 4 s (from $ t = 0 $ to $ t = 4 $ s) and a height of 4 m/s².', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\frac{1}{2}(4)(4) $. Give the answer in m/s.',
              blank_answer: '8',
              feedback_right: 'Yes — a change of 8 m/s.',
              feedback_wrong: '$ \\frac{1}{2} \\times 4 \\times 4 = 8 $ m/s.',
            },
          }),
        st('$ v_f = v_i + \\Delta v = 2 + 8 = 10\\ \\text{m/s} $',
          'The area gave the *change*. Add it to the velocity we were given at the start.', {
            why: 'Forgetting to add the initial velocity is the single most common error with this method — the area gives you 8, and 8 looks like a perfectly plausible answer. Always ask: change in velocity, or velocity? The area is always the change.',
          }),
      ],
      now_you_try: {
        problem: 'A particle starts from rest. Its a–t graph is a horizontal line at $ 3 $ m/s² from $ t = 0 $ to $ t = 4 $ s, then a horizontal line at $ -2 $ m/s² from $ t = 4 $ s to $ t = 7 $ s. Find its velocity at $ t = 7 $ s.',
        answer: '6 m/s',
        solution: 'First region: $ 3 \\times 4 = +12 $ m/s of change. Second region: $ 2 \\times 3 = 6 $ m/s of area, below the axis, so it contributes $ -6 $ m/s. Total change $ = 12 - 6 = +6 $ m/s. The particle started from rest, so its velocity at $ t = 7 $ s is $ 0 + 6 = 6 $ m/s.',
      },
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The area under a velocity–time graph between two instants gives:',
          ['The distance travelled', 'The displacement', 'The average velocity', 'The acceleration'], 1,
          'Signed area gives displacement — regions below the axis subtract. It equals the distance travelled only in the special case where the velocity never changes sign.', 2),
        q('The area under an acceleration–time graph gives:',
          ['The velocity', 'The change in velocity', 'The displacement', 'The change in displacement'], 1,
          'Multiplying the axis units gives $ \\text{m/s}^2 \\times \\text{s} = \\text{m/s} $, so the area is a velocity — but it is the *change*, not the value. You need the velocity at one instant before you can turn it into an actual velocity.', 2),
        q('The area under a position–time graph gives:',
          ['The velocity at that instant', 'The total displacement so far', 'The acceleration', 'No physically useful quantity'], 3,
          'Multiplying the units gives metre-seconds, which is not the unit of any quantity in mechanics. Slope is useful on all three graphs; area is useful on only the v–t and a–t graphs.', 3),
        q('On a v–t graph, a region lying below the time axis contributes:',
          ['A positive displacement', 'A negative displacement', 'Nothing at all', 'A negative distance'], 1,
          'Below the axis the velocity is negative, so the particle is moving backwards and its displacement is decreasing. It still contributes positively to the *distance* travelled — distance can never decrease.', 2),
      ],
    }),
    b('callout', 14, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Slope goes down the chain** ($ x \\to v \\to a $); **area goes back up** ($ a \\to v \\to x $).\n- Area under **v–t** $ = $ **displacement**. Area under **a–t** $ = $ **change in velocity**.\n- Area under **x–t** $ = $ nothing useful.\n- **Signed** area gives displacement; **total** area gives distance. They differ exactly when the graph crosses the time axis.\n- The area under an a–t graph gives a *change*, so you must add the starting velocity.',
    }),
    b('practice_bank', 15, {
      title: 'You solve it',
      intro: 'Eight questions. For each one, decide first which graph you are looking at, then whether you need a slope or an area.',
      sections: [
        {
          id: 'p7-ysi',
          title: 'Slopes, areas and what they mean',
          items: [
            num('p7-y1', 'A car\'s v–t graph rises as a straight line from $ 0 $ at $ t = 0 $ to $ 20 $ m/s at $ t = 8 $ s. Find (a) its acceleration and (b) the distance travelled in the 8 s.',
              '(a) 2.5 m/s²  (b) 80 m',
              '(a) The acceleration is the slope: $ \\frac{20 - 0}{8} = 2.5 $ m/s². (b) The distance is the area, a triangle of base 8 s and height 20 m/s: $ \\frac{1}{2}(8)(20) = 80 $ m. One graph, two quantities, two different operations.'),
            mcq('p7-y2', 'A v–t graph is a horizontal line at $ v = -6 $ m/s for 4 s. The displacement over that interval is:',
              ['$ +24 $ m', '$ -24 $ m', '$ 24 $ m of distance and zero displacement', '$ -1.5 $ m'], 1,
              'The area is $ 6 \\times 4 = 24 $, and it lies below the time axis, so the displacement is $ -24 $ m. The distance travelled is $ +24 $ m — the particle really did cover 24 metres, just in the negative direction.'),
            num('p7-y3', 'A particle starts from rest. Its acceleration is a constant $ 5 $ m/s² for the first 4 s and then zero for the next 6 s. Find its velocity at $ t = 10 $ s and the distance travelled in the 10 s.',
              '$ v = 20 $ m/s; distance $ = 160 $ m',
              'Velocity: the area under the a–t graph is $ 5 \\times 4 = 20 $ m/s in the first phase and zero in the second, so $ v = 0 + 20 = 20 $ m/s from $ t = 4 $ s onward. Distance: the v–t graph is a triangle (base 4 s, height 20 m/s, area 40 m) followed by a rectangle ($ 20 \\times 6 = 120 $ m), so the total is 160 m.'),
            mcq('p7-y4', 'Which quantity would you obtain by finding the slope of an acceleration–time graph?',
              ['The velocity at that instant', 'The displacement over that interval', 'The rate at which the acceleration is changing', 'The change in velocity over the interval'], 2,
              'A slope is always a rate of change of the vertical quantity with respect to time, so the slope of an a–t graph is the rate of change of acceleration. It is rarely needed in this course. The change in velocity is the *area* under that graph, not its slope.'),
            num('p7-y5', 'The v–t graph of a particle is a triangle: $ v $ rises from $ 0 $ to $ 8 $ m/s over $ 0 $ to $ 3 $ s, then falls back to $ 0 $ at $ t = 7 $ s. Find (a) the displacement over 7 s and (b) the acceleration during each phase.',
              '(a) 28 m  (b) $ +8/3 \\approx 2.7 $ m/s², then $ -2 $ m/s²',
              '(a) The triangle has base 7 s and height 8 m/s, so the area — and the displacement, since $ v $ never goes negative — is $ \\frac{1}{2}(7)(8) = 28 $ m. (b) First phase slope: $ \\frac{8-0}{3-0} \\approx 2.7 $ m/s². Second phase slope: $ \\frac{0-8}{7-3} = -2 $ m/s².'),
            mcq('p7-y6', 'A v–t graph consists of a triangle of area 30 above the time axis followed by a triangle of area 12 below it. The distance travelled and the displacement are:',
              ['42 m and 18 m', '18 m and 42 m', '42 m and 42 m', '30 m and 12 m'], 0,
              'Distance ignores sign, so it is $ 30 + 12 = 42 $ m. Displacement respects it, so it is $ 30 - 12 = 18 $ m. Distance is always the larger of the two whenever the graph crosses the axis.'),
            num('p7-y7', 'A particle moving at $ 6 $ m/s experiences a constant acceleration of $ -2 $ m/s² for 5 s. Using areas only, find its velocity at the end and its displacement.',
              '$ v = -4 $ m/s; displacement $ = +5 $ m',
              'Velocity: the area under the a–t graph is $ -2 \\times 5 = -10 $ m/s, so $ v = 6 - 10 = -4 $ m/s. Displacement: the v–t graph runs from $ +6 $ to $ -4 $ m/s in a straight line, crossing zero at $ t = 3 $ s. Above the axis: $ \\frac{1}{2}(3)(6) = +9 $ m. Below: $ \\frac{1}{2}(2)(4) = 4 $ m of area, contributing $ -4 $ m. Displacement $ = 9 - 4 = +5 $ m — while the distance travelled is $ 9 + 4 = 13 $ m.'),
            mcq('p7-y8', 'Which of these statements about a v–t graph is **false**?',
              ['Its slope gives the acceleration', 'The area under it gives the displacement', 'It can contain a vertical segment', 'It can go below the time axis'], 2,
              'A vertical segment would mean the velocity changed while no time passed, requiring an infinite acceleration — impossible. The other three are all standard properties: slope is acceleration, signed area is displacement, and dipping below the axis simply means the particle reversed.'),
          ],
        },
      ],
    }),
    b('text', 16, {
      markdown: 'You now have both operations. The next page puts them to work on the four kinds of motion you will meet again and again — and asks you to translate between the three graphs until it stops feeling like work.',
    }),
  ],
};

// ── p8 · The Four Motions, Drawn Three Ways ──────────────────────────────────
const p8 = {
  page_number: 8,
  slug: 'the-four-motions-drawn-three-ways',
  title: 'The Four Motions, Drawn Three Ways',
  subtitle: 'Translating between x–t, v–t and a–t until it is automatic',
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Here is an acceleration–time graph and nothing else. From rest at $ t = 0 $: $ a = +2 $ m/s² from $ 0 $ to $ 2 $ s, then $ a = 0 $ from $ 2 $ to $ 4 $ s, then $ a = -4 $ m/s² from $ 4 $ to $ 6 $ s. Sketch the velocity–time graph. You have not been given a single equation — and you do not need one.',
      hint: 'Area under a–t gives the change in velocity. Take one segment at a time.',
      reveal: '**0 to 2 s:** area $ = 2 \\times 2 = +4 $ m/s. Starting from rest, the velocity climbs in a straight line from 0 to $ +4 $ m/s.\n\n**2 to 4 s:** area is zero, so the velocity does not change. A horizontal line at $ +4 $ m/s.\n\n**4 to 6 s:** the acceleration is $ -4 $ m/s², so the velocity falls at 4 m/s every second. From $ +4 $ m/s it reaches zero at $ t = 5 $ s and continues to $ -4 $ m/s at $ t = 6 $ s.\n\nSo the v–t graph is a rising line, then a flat line, then a steeper falling line that crosses the axis at $ t = 5 $ s. Every feature of it came from the area rule, applied three times.',
    }),
    b('text', 1, {
      markdown: 'That is the skill this page drills: **given any one of the three graphs, produce the other two.**\n\nIt is worth being blunt about why. Almost every graph question in an entrance exam is this translation in disguise — "which of the following v–t graphs corresponds to the x–t graph shown?" There is no formula for it. There is only fluency, and fluency comes from doing it many times.',
    }),
    b('inline_quiz', 85, {
      pass_threshold: 0.6,
      questions: [
        q('You are given only an a–t graph and the velocity at one instant. Can you produce the v–t graph?',
          ['No — you also need the position', 'Yes — area under a–t gives the change in velocity, and the known value fixes the rest', 'Only if the acceleration is constant', 'Only if the particle starts from rest'], 1,
          'The area gives you every CHANGE in velocity; the one known value anchors those changes to actual numbers. Neither the position nor a constant acceleration is required.', 3),
        q('Which feature of a v–t graph tells you the particle has reversed direction?',
          ['A peak', 'A crossing of the time axis', 'A steep slope', 'A horizontal section'], 1,
          'Crossing the axis means the velocity changed sign, which is exactly what reversing is. A peak means the acceleration momentarily vanished; a steep slope means a large acceleration.', 2),
      ],
    }),
    b('heading', 2, {
      text: 'The four motions worth knowing on sight',
      level: 2,
      objective: 'Recognise each of the four standard motions from any one of its three graphs.',
    }),
    b('text', 3, {
      markdown: 'Almost every problem in this chapter is one of four situations, or a few of them glued together. Learn what each looks like on all three graphs and most questions become recognition rather than calculation.',
    }),
    b('image', 4, {
      src: '',
      alt: 'A four-by-three grid of small graphs: each of four motion types shown as an x–t, a v–t and an a–t graph.',
      aspect_ratio: '4:3',
      figure_key: 'ch2-four-motions',
      caption: 'The four standard motions, each drawn three ways. Learn the rows, and most graph questions become recognition.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. A four-row by three-column grid of small simple graphs, separated by thin hairline dividers only, no boxes. Column headings x-t, v-t, a-t. Row 1: a straight sloping line, a horizontal line, a line along the zero axis. Row 2: an upward-curving parabola, a straight rising line, a horizontal line above zero. Row 3: a curve that rises and flattens, a straight falling line reaching zero, a horizontal line below zero. Row 4: an inverted parabola arch, a straight line crossing from positive to negative, a horizontal line below zero. Minimal, precise, schematic. Dark background with orange and amber accents only.',
    }),
    b('table', 5, {
      caption: 'The four standard motions',
      headers: ['Motion', 'x–t', 'v–t', 'a–t'],
      rows: [
        ['**Uniform** (constant velocity)', 'Straight sloping line', 'Horizontal line', 'Along the zero axis'],
        ['**Uniformly accelerated** (from rest)', 'Parabola curving upward', 'Straight line rising from the origin', 'Horizontal line above zero'],
        ['**Uniformly retarded** (until it stops)', 'Curve rising and flattening', 'Straight line falling to zero', 'Horizontal line below zero'],
        ['**Retarded, then reversed** (a thrown ball)', 'Arch — up, over, down', 'Straight line crossing the axis', 'Horizontal line below zero'],
      ],
    }),
    b('inline_quiz', 72, {
      pass_threshold: 0.6,
      questions: [
        q('Two of the four standard motions share the same a–t graph. Which two?',
          ['Uniform and uniformly accelerated', 'Uniformly retarded and the thrown ball', 'Uniform and the thrown ball', 'Uniformly accelerated and uniformly retarded'], 1,
          'Both have a constant negative acceleration. What separates them is what happens when the velocity reaches zero: the retarded motion stops there, while the thrown ball carries on into negative velocity and comes back.', 3),
      ],
    }),
    b('callout', 6, {
      variant: 'note',
      title: 'Look at the last two rows',
      markdown: 'The third and fourth motions have **identical a–t graphs** — a constant negative acceleration in both cases.\n\nThe difference is only what happens when the velocity reaches zero. In the third, the motion stops there (a car braking to a halt, where the brakes then stop acting). In the fourth, the acceleration keeps going, so the velocity carries on past zero into negative values and the object comes back (a ball thrown upward, where gravity never switches off).\n\nAn a–t graph alone cannot tell you which of the two you have. You need to know what happens physically at the moment the velocity hits zero — which is why "the ball at the top of its flight" keeps coming back.',
    }),
    b('inline_quiz', 86, {
      pass_threshold: 0.6,
      questions: [
        q('Two motions have identical a–t graphs. Their v–t graphs are:',
          ['Necessarily identical', 'Parallel, but possibly at different heights', 'Necessarily different in shape', 'Unrelated'], 1,
          'Equal accelerations mean equal slopes at every instant, so the v–t graphs have the same shape — but a different starting velocity shifts one bodily up or down. The area gives the change, never the value.', 3),
      ],
    }),
    b('step_solver', 7, {
      title: 'From v–t to a–t and x–t',
      problem: 'A particle starts at the origin. Its v–t graph is a straight line from $ v = 0 $ at $ t = 0 $ to $ v = 12 $ m/s at $ t = 6 $ s. Describe its a–t graph and its x–t graph, and find where it is at $ t = 6 $ s.',
      intro: 'Going down needs a slope; going up needs an area. Do them one at a time and say which you are using.',
      steps: [
        st('$ a = \\text{slope of v–t} = \\frac{12 - 0}{6 - 0} = 2\\ \\text{m/s}^2 $',
          'The v–t line is straight, so the slope is the same everywhere and the acceleration is constant.', {
            check: {
              kind: 'mcq',
              prompt: 'What shape is the a–t graph?',
              options: [
                'A straight line rising from the origin',
                'A horizontal line at $ 2 $ m/s²',
                'A parabola',
                'A horizontal line at zero',
              ],
              answer_index: 1,
              feedback_right: 'Right — a constant acceleration is a horizontal line on an a–t graph.',
              feedback_wrong: 'The acceleration works out as a constant $ 2 $ m/s², and a constant value plots as a horizontal line. A rising line would mean the acceleration itself was growing.',
            },
          }),
        st('$ x = \\text{area under v–t} = \\frac{1}{2}(6)(12) = 36\\ \\text{m} $',
          'Going the other way now — up the chain, so an area. The region is a triangle.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\frac{1}{2}(6)(12) $. Give the answer in metres.',
              blank_answer: '36',
              feedback_right: 'Yes — 36 m from the origin.',
              feedback_wrong: '$ \\frac{1}{2} \\times 6 \\times 12 = 36 $ m.',
            },
          }),
        st('The x–t graph is a **parabola** curving upward, from $ (0, 0) $ to $ (6\\ \\text{s},\\ 36\\ \\text{m}) $.',
          'Why a parabola? Because its slope must equal the velocity at every instant, and the velocity is growing steadily — so the x–t curve has to get steeper and steeper.', {
            why: 'Two checks worth doing on any x–t sketch. **At $ t = 0 $** the velocity is zero, so the curve must start with a *horizontal* tangent. **At $ t = 6 $ s** the velocity is 12 m/s, so it must be steep there. A parabola from the origin does both.',
          }),
      ],
      now_you_try: {
        problem: 'A particle starts at $ x = 0 $ with a v–t graph that is a horizontal line at $ v = 5 $ m/s for 8 s. Describe its a–t and x–t graphs, and find its position at $ t = 8 $ s.',
        answer: 'a–t is a line along zero; x–t is a straight line of slope 5 m/s; at $ t = 8 $ s the particle is at $ x = 40 $ m.',
        solution: 'The v–t line is horizontal, so its slope is zero and the a–t graph lies along the time axis. The area under v–t is a rectangle, $ 5 \\times 8 = 40 $ m, so the particle is at $ x = 40 $ m. The x–t graph must have a constant slope of 5 m/s, so it is a straight line from the origin to $ (8\\ \\text{s},\\ 40\\ \\text{m}) $ — the signature of uniform motion.',
      },
    }),
    b('step_solver', 8, {
      title: 'From a–t back to v–t, in three pieces',
      problem: 'A particle starts from rest. Its acceleration is $ +2 $ m/s² from $ t = 0 $ to $ 2 $ s, zero from $ 2 $ to $ 4 $ s, and $ -4 $ m/s² from $ 4 $ to $ 6 $ s. Find its velocity at $ t = 2 $, $ 4 $, $ 5 $ and $ 6 $ s.',
      intro: 'Three segments, handled one at a time, each one carrying its end velocity forward as the start of the next. That carry-forward is the whole method.',
      steps: [
        st('0 to 2 s: $ \\Delta v = 2 \\times 2 = +4 $, so $ v(2) = 0 + 4 = 4\\ \\text{m/s} $',
          'Area under a rectangle of height 2 m/s² and width 2 s. The particle started from rest, so add 4 to zero.', {
            check: {
              kind: 'mcq',
              prompt: 'On the v–t graph, what does this first segment look like?',
              options: [
                'A horizontal line at 4 m/s',
                'A straight line rising from 0 to 4 m/s',
                'A curve rising from 0 to 4 m/s',
                'A straight line falling from 4 to 0',
              ],
              answer_index: 1,
              feedback_right: 'Right — constant acceleration gives a straight, steadily rising v–t line.',
              feedback_wrong: 'The acceleration is constant at 2 m/s², and the slope of the v–t graph *is* the acceleration. A constant slope is a straight line — rising, because the acceleration is positive.',
            },
          }),
        st('2 to 4 s: $ \\Delta v = 0 $, so $ v(4) = 4\\ \\text{m/s} $',
          'Zero acceleration means zero area, so the velocity does not change at all. A horizontal line at 4 m/s.', {
            why: 'Zero acceleration does **not** mean the particle stopped. It means its velocity stopped *changing*. It is still sailing along at a perfectly good 4 m/s.',
          }),
        st('4 to 5 s: $ \\Delta v = -4 \\times 1 = -4 $, so $ v(5) = 4 - 4 = 0 $',
          'Now the acceleration is $ -4 $ m/s², so the velocity drops by 4 every second. After one second it has reached zero.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The acceleration stays at $ -4 $ m/s² for one more second. What is $ v $ at $ t = 6 $ s, in m/s?',
              blank_answer: '-4',
              feedback_right: 'Yes — it keeps falling straight through zero into negative values.',
              feedback_wrong: 'Nothing stops at zero. The velocity keeps dropping at 4 m/s per second, so one second after reaching zero it is at $ -4 $ m/s — the particle has reversed direction.',
            },
          }),
        st('$ v(6) = -4\\ \\text{m/s} $ — the particle has reversed',
          'So the v–t graph rises to 4, runs flat at 4, then falls steeply, crossing the axis at $ t = 5 $ s and reaching $ -4 $ m/s at $ t = 6 $ s.', {
            why: 'The crossing at $ t = 5 $ s is the only moment the particle is at rest. Before it, the particle is moving forwards; after it, backwards. On the corresponding x–t graph, $ t = 5 $ s is where the curve reaches its maximum.',
          }),
      ],
      now_you_try: {
        problem: 'A cart starts from rest. Its acceleration is $ +5 $ m/s² from $ t = 0 $ to $ 10 $ s, zero from $ 10 $ to $ 20 $ s, and $ -5 $ m/s² from $ 20 $ to $ 30 $ s. Find its velocity at $ t = 10 $, $ 20 $ and $ 30 $ s, and the total distance travelled in 30 s.',
        answer: '$ v = 50 $ m/s, $ 50 $ m/s, $ 0 $; distance $ = 1000 $ m.',
        solution: 'Velocities: $ 5 \\times 10 = 50 $ m/s at $ t = 10 $ s; unchanged at $ t = 20 $ s (zero acceleration); then $ 50 - 5(10) = 0 $ at $ t = 30 $ s.\n\nDistance is the area under the v–t graph. As a trapezium: parallel sides 30 s (the whole base) and 10 s (the flat top from 10 to 20 s), height 50 m/s, giving $ \\frac{1}{2}(30 + 10)(50) = 1000 $ m.\n\nOr add the three pieces: triangle $ \\frac{1}{2}(10)(50) = 250 $ m, rectangle $ 50 \\times 10 = 500 $ m, triangle $ \\frac{1}{2}(10)(50) = 250 $ m — again 1000 m.',
      },
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('A particle\'s x–t graph is a parabola opening upward, starting with a horizontal tangent at the origin. Its v–t graph is:',
          ['A horizontal line', 'A straight line rising from the origin', 'A parabola', 'A straight line falling to the origin'], 1,
          'The v–t graph is the slope of the x–t graph at every instant. A parabola\'s slope starts at zero and grows steadily, which plots as a straight line rising from the origin. That is uniformly accelerated motion from rest.', 2),
        q('A particle\'s v–t graph is a straight line crossing the time axis from positive to negative. Its x–t graph is:',
          ['A straight line of constant slope', 'An upward-curving parabola with no maximum', 'An arch, rising to a maximum and then falling', 'A horizontal line at a fixed height'], 2,
          'The velocity is positive at first, so the position increases; it reaches zero, so the position is momentarily stationary at a maximum; then it goes negative, so the position falls. That traces an arch — exactly the x–t graph of a ball thrown straight up.', 2),
        q('Two motions have identical a–t graphs: a constant negative value throughout. What extra information do you need to tell them apart?',
          ['The mass of the object', 'The initial velocity', 'Nothing — they must be the same motion', 'The length of the track'], 1,
          'The a–t graph gives only the *change* in velocity. A car braking to a halt and a ball thrown upward can share the same constant negative acceleration; what separates their v–t and x–t graphs is where the velocity started from.', 3),
        q('On an x–t graph, a point where the curve reaches a maximum corresponds to which feature of the v–t graph?',
          ['A maximum on the v–t graph', 'The v–t graph crossing the time axis', 'A minimum on the v–t graph', 'A vertical segment on the v–t graph'], 1,
          'A maximum on x–t means a horizontal tangent, i.e. zero velocity. On the v–t graph, zero velocity is where the curve meets the time axis — and it must be crossing, not just touching, because the particle turns around there.', 3),
      ],
    }),
    b('classify_exercise', 10, {
      question: 'A particle\'s x–t graph is a **straight line with a positive slope**. Decide whether each statement about the other two graphs is correct.',
      column_label: 'Statement',
      verdict_label: 'Correct?',
      yes_label: '✓ Correct',
      no_label: '✗ Incorrect',
      rows: [
        { substance: 'The v–t graph is a horizontal line above the time axis.', is_solution: true, explanation: 'Correct. A constant positive slope on x–t is a constant positive velocity, which plots as a horizontal line above the axis.' },
        { substance: 'The v–t graph is a straight line rising from the origin.', is_solution: false, explanation: 'Incorrect — that would describe a velocity that grows with time, which needs a *curved* x–t graph.' },
        { substance: 'The a–t graph lies along the time axis.', is_solution: true, explanation: 'Correct. The velocity never changes, so the acceleration is zero throughout.' },
        { substance: 'The area under the v–t graph increases steadily with time.', is_solution: true, explanation: 'Correct. The area accumulates at a constant rate, which is exactly the steadily-increasing position the x–t line shows.' },
        { substance: 'The particle must start at the origin.', is_solution: false, explanation: 'Incorrect. The line may have any intercept — where it starts is the initial position and has nothing to do with its slope.' },
        { substance: 'The particle reverses direction at some point.', is_solution: false, explanation: 'Incorrect. The slope is positive everywhere, so the velocity never changes sign and the particle never turns round.' },
      ],
    }),
    b('inline_quiz', 87, {
      pass_threshold: 0.6,
      questions: [
        q('On an x–t graph, a section that is flat means the particle:',
          ['Is moving at constant speed', 'Is at rest', 'Has constant acceleration', 'Is at the origin'], 1,
          'Flat means the position is not changing, so the velocity is zero — the particle is stationary. Constant speed would be a straight sloping line, not a flat one.', 1),
      ],
    }),
    b('step_solver', 11, {
      title: 'Reading a whole journey off one graph',
      problem: 'A particle\'s v–t graph rises from $ 0 $ to $ 10 $ m/s over $ 0 $ to $ 2 $ s, stays at $ 10 $ m/s until $ t = 6 $ s, then falls to zero at $ t = 8 $ s. Find (a) the acceleration in each phase, (b) the total distance travelled, and (c) the average velocity over the 8 s.',
      intro: 'Three phases, three slopes, one area. This shape — accelerate, cruise, brake — is the single most common v–t graph in the subject.',
      steps: [
        st('phase 1: $ \\frac{10-0}{2-0} = +5\\ \\text{m/s}^2 $ · phase 2: $ 0 $ · phase 3: $ \\frac{0-10}{8-6} = -5\\ \\text{m/s}^2 $',
          'Acceleration is the slope, taken separately on each straight segment.', {
            check: {
              kind: 'mcq',
              prompt: 'During the middle phase the particle is moving at a steady 10 m/s. What is its acceleration?',
              options: ['10 m/s²', 'Zero', '5 m/s²', 'Cannot be determined'],
              answer_index: 1,
              feedback_right: 'Right — steady velocity means the velocity is not changing, so the acceleration is zero.',
              feedback_wrong: 'The *height* of the line is the velocity, 10 m/s. The *slope* is the acceleration, and a horizontal line has zero slope. Moving fast and accelerating are completely different things.',
            },
          }),
        st('$ \\text{distance} = \\frac{1}{2}(2)(10) + (10)(4) + \\frac{1}{2}(2)(10) $',
          'Distance is the area, split into a triangle, a rectangle and another triangle.', {
            why: 'You could also treat the whole region as one trapezium with parallel sides $ 8 $ s and $ 4 $ s and height $ 10 $ m/s: $ \\frac{1}{2}(8+4)(10) = 60 $ m. Same answer, one step. Spotting the trapezium is worth a few seconds in an exam.',
          }),
        st('$ = 10 + 40 + 10 = 60\\ \\text{m} $',
          'And the velocity never goes negative, so the displacement is the same 60 m.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Average velocity is displacement over total time. Compute $ 60 \\div 8 $, in m/s.',
              blank_answer: '7.5',
              feedback_right: 'Yes — 7.5 m/s.',
              feedback_wrong: '$ 60 \\div 8 = 7.5 $ m/s. Note it is below the peak of 10 m/s, as it must be — the particle was slower than 10 m/s for four of the eight seconds.',
            },
          }),
        st('$ \\bar{v} = 7.5\\ \\text{m/s} $',
          'Lower than the cruising speed of 10 m/s, because time was spent speeding up and slowing down.', {
            why: 'A sanity check worth making every time: the average velocity must lie between the smallest and largest velocities reached. If your answer comes out above 10 m/s here, you have made an arithmetic error somewhere.',
          }),
      ],
      now_you_try: {
        problem: 'A car accelerates uniformly from rest to 20 m/s in 5 s, holds that speed for 10 s, then brakes uniformly to rest in 4 s. Find the total distance travelled and the average speed for the whole journey.',
        answer: 'Distance $ = 290 $ m; average speed $ \\approx 15.3 $ m/s.',
        solution: 'Treat the v–t graph as a trapezium: the parallel sides are the total time 19 s and the flat top 10 s, with height 20 m/s. Area $ = \\frac{1}{2}(19 + 10)(20) = \\frac{1}{2}(29)(20) = 290 $ m. Average speed $ = 290/19 \\approx 15.3 $ m/s, comfortably below the cruising 20 m/s.',
      },
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.6,
      questions: [
        q('For a body moving with uniform velocity, which set of graph shapes is correct?',
          ['x–t straight sloping, v–t horizontal, a–t along zero', 'x–t parabola, v–t straight sloping, a–t horizontal', 'x–t horizontal, v–t horizontal, a–t horizontal', 'x–t straight sloping, v–t straight sloping, a–t horizontal'], 0,
          'Uniform velocity means the position changes at a fixed rate, giving a straight x–t line; the velocity itself is constant, giving a horizontal v–t line; and an unchanging velocity means zero acceleration, so the a–t graph sits on the axis.', 2),
        q('The v–t graph of a body dropped from rest is:',
          ['A horizontal line above the time axis', 'A straight line through the origin with constant slope', 'A parabola opening upward from the origin point', 'A straight line with a negative intercept'], 1,
          'Free fall is uniformly accelerated motion starting from rest, so the velocity grows in direct proportion to time: $ v = gt $. That is a straight line through the origin whose slope is $ g $.', 2),
        q('Two particles have v–t graphs that are parallel straight lines at different heights. They have:',
          ['The same velocity at every instant of time', 'The same acceleration but different velocities', 'The same displacement over any interval', 'Different accelerations throughout'], 1,
          'Parallel lines share a slope, and the slope of a v–t graph is the acceleration — so the accelerations match. Different heights mean different velocities at every instant, and hence different displacements.', 2),
      ],
    }),
    b('inline_quiz', 73, {
      pass_threshold: 0.6,
      questions: [
        q('You are shown one graph and asked to pick the matching pair from four options. The most efficient first check is:',
          ['Compute the area under each option', 'Check the sign of the quantity in each interval', 'Measure every slope', 'Guess and move on'], 1,
          'Sign is the cheapest discriminator — anything on the wrong side of the axis is out immediately, usually leaving one or two candidates. Zeros and turning points come next, and only then straight-or-curved.', 2),
      ],
    }),
    b('callout', 13, {
      variant: 'exam_tip',
      title: 'How to attack any "which graph matches?" question',
      markdown: 'Do not try to picture the whole answer at once. Check the options against three features in turn, and eliminate:\n\n1. **Sign.** Is the given quantity positive or negative, and in which intervals? Anything on the wrong side of the axis is out.\n2. **Zeros.** Where does the given graph reach zero or turn round? Those instants must show up as specific features on the answer graph — a flat tangent, an axis crossing, a corner.\n3. **Straight or curved.** A constant gives a horizontal line one level up and a straight sloping line one level down. Curvature never appears from nowhere.\n\nThree passes will normally leave you with exactly one option, and you will not have done a single calculation.',
    }),
    b('practice_bank', 14, {
      title: 'You solve it',
      intro: 'Eight questions, all translation. Sketch each answer before you reveal it — a rough sketch on paper is worth more here than a confident guess.',
      sections: [
        {
          id: 'p8-ysi',
          title: 'Translating between the three graphs',
          items: [
            mcq('p8-y1', 'The x–t graph of a particle is a horizontal straight line. Its v–t and a–t graphs are:',
              ['Both horizontal lines along the time axis', 'v–t horizontal above the axis, a–t along the axis', 'v–t along the axis, a–t horizontal above it', 'Both straight sloping lines'], 0,
              'A horizontal x–t line means the position never changes, so the particle is at rest: the velocity is zero and stays zero, and an unchanging velocity means zero acceleration. Both graphs therefore lie along the time axis.'),
            num('p8-y2', 'A particle starts from rest with a constant acceleration of $ 4 $ m/s² for 5 s. Sketch its v–t graph and use it to find the distance travelled.',
              '50 m',
              'The v–t graph is a straight line from the origin, reaching $ v = 4(5) = 20 $ m/s at $ t = 5 $ s. The distance is the area of that triangle: $ \\frac{1}{2}(5)(20) = 50 $ m.'),
            mcq('p8-y3', 'A ball is thrown vertically upward and returns to the thrower\'s hand. Taking upward as positive, its v–t graph for the whole flight is:',
              ['A straight line with negative slope crossing the time axis', 'A horizontal line below the time axis for the whole flight', 'An arch rising above the axis and falling back', 'A straight line with a positive constant slope'], 0,
              'The acceleration is a constant $ -g $, so the v–t graph is a straight line with a constant negative slope. It starts positive as the ball rises, crosses zero at the highest point, and becomes negative as the ball falls back — hence the crossing.'),
            num('p8-y4', 'The a–t graph of a particle starting from rest is a horizontal line at $ 3 $ m/s² for 4 s, followed by a horizontal line at $ -6 $ m/s² for 2 s. Find its velocity at $ t = 4 $ s and $ t = 6 $ s.',
              '$ 12 $ m/s and $ 0 $',
              'First phase: area $ = 3 \\times 4 = 12 $ m/s, and starting from rest that gives $ v(4) = 12 $ m/s. Second phase: area $ = -6 \\times 2 = -12 $ m/s, so $ v(6) = 12 - 12 = 0 $. The particle ends exactly at rest.'),
            mcq('p8-y5', 'An x–t graph rises steeply at first and then gradually flattens out, never turning downward. The motion is:',
              ['Uniform motion at constant velocity', 'Uniformly accelerated motion starting from rest', 'Slowing down, still moving in the positive direction', 'Moving in the negative direction and speeding up'], 2,
              'The slope is positive throughout, so the particle keeps moving in the positive direction. The slope is decreasing, so the velocity is falling — the particle is slowing down. Flattening out means it is approaching rest without reversing.'),
            num('p8-y6', 'A particle\'s v–t graph is a straight line from $ v = 12 $ m/s at $ t = 0 $ to $ v = -8 $ m/s at $ t = 10 $ s. Find (a) its acceleration, (b) the instant at which it reverses, and (c) the distance travelled and the displacement over the 10 s.',
              '(a) $ -2 $ m/s²  (b) $ t = 6 $ s  (c) distance 52 m, displacement $ +20 $ m',
              '(a) Slope $ = \\frac{-8 - 12}{10} = -2 $ m/s². (b) The velocity is zero when $ 12 - 2t = 0 $, so $ t = 6 $ s. (c) Above the axis: $ \\frac{1}{2}(6)(12) = 36 $ m. Below: $ \\frac{1}{2}(4)(8) = 16 $ m of area, contributing $ -16 $ m. Distance $ = 36 + 16 = 52 $ m; displacement $ = 36 - 16 = +20 $ m.'),
            mcq('p8-y7', 'Which of these pairs of graphs is **inconsistent**?',
              ['x–t a straight sloping line, with v–t a horizontal line', 'x–t an upward parabola, with v–t a straight rising line', 'x–t a straight sloping line, with a–t a horizontal line above zero', 'x–t an arch, with v–t a straight line crossing the axis'], 2,
              'A straight x–t line means a constant velocity, which requires zero acceleration — so the a–t graph must lie on the axis, not above it. The other three pairings are all standard and mutually consistent.'),
            num('p8-y8', 'A cart accelerates uniformly from rest, reaching 15 m/s in 6 s, then decelerates uniformly to rest in a further 3 s. Sketch the v–t graph and find the total distance travelled and the average speed.',
              'Distance $ = 67.5 $ m; average speed $ = 7.5 $ m/s',
              'The v–t graph is a triangle with a peak of 15 m/s at $ t = 6 $ s, returning to zero at $ t = 9 $ s. Its area is $ \\frac{1}{2}(9)(15) = 67.5 $ m. Average speed $ = 67.5/9 = 7.5 $ m/s — exactly half the peak speed, which is always the case for a simple triangular v–t graph.'),
          ],
        },
      ],
    }),
    b('callout', 15, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Given any one graph, you can build the other two** — slope to go down, area to go up.\n- Learn the four standard motions as *rows*: uniform, uniformly accelerated, uniformly retarded, and retarded-then-reversed.\n- The last two share an a–t graph. What separates them is the initial velocity and what happens when $ v $ reaches zero.\n- On x–t: a **maximum** means $ v = 0 $. On v–t: an **axis crossing** means a reversal.\n- For "which graph matches?" questions, eliminate on **sign**, then **zeros**, then **straight-or-curved**.',
    }),
    b('text', 16, {
      markdown: 'Everything so far has been description — pictures, slopes and areas, and not one equation to memorise.\n\nThat has been deliberate. Because the three famous equations of motion are about to arrive, and they are far easier to trust when you can already see where they come from. On the next page we derive them twice, and find out exactly when they are allowed to be used.',
    }),
  ],
};

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureChapter(db);
    await upsertPages(db, bookId, [p5, p6, p7, p8]);
  });
  console.log('\n✅ Ch.2 wave 1b complete — pages 5–8');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
