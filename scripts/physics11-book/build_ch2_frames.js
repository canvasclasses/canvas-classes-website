'use strict';
/**
 * Class 11 Physics · Chapter 2 "Motion in One Dimension" — pages 0–4.
 * Wave 1a: the description spine before acceleration arrives — frame and sign,
 * the averages, the limit that defines instantaneous velocity, and reading an
 * x–t graph.
 *
 * Rhythm (house rules, PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md §4A/§6):
 *   situation → student works it → the rule falls out → gated step_solver →
 *   step_solver → "You solve it" strip → bridge.
 * Exposition never runs past ~120 words without something to do.
 *
 * FOUNDER DECISIONS (2026-07-29) honoured here:
 *   • p1 RECAPS position / path length / distance / displacement — junior-class
 *     material — and spends its teaching time on frame and sign instead.
 *   • Per-page floor of 4 step_solvers, 5 inline-quiz questions and a 7-item
 *     closing strip. Graph pages carry more.
 *   • NO simulation blocks. Every page teaches with figures + drill alone.
 *
 * Run: node scripts/physics11-book/build_ch2_frames.js
 */
const { b, q, st, mcq, num, ensureChapter, upsertPages, withDb } = require('./_book_ch2');

// ── p0 · Chapter opener ──────────────────────────────────────────────────────
const p0 = {
  page_number: 0,
  slug: 'motion-in-one-dimension-opener',
  title: 'Motion in One Dimension',
  subtitle: 'Three quantities, one story, told three times',
  page_type: 'chapter_opener',
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A single glowing track running left to right across a dark field, with a bright marker on it and three faint graphs rising behind it.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: 'Wide cinematic illustration on a very dark near-black background. A single straight glowing track running left to right, with one bright amber marker travelling along it. Behind and above the track, three faint translucent graph panels stacked vertically, their curves echoing the marker position. Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.',
    }),
    b('text', 1, {
      markdown: 'Everything in this chapter happens along a single line.\n\nThat sounds like a small subject. It is not. Almost every mistake students make in mechanics for the next two years — a dropped minus sign, a distance used where a displacement belonged, a graph read backwards — is a mistake that starts here, on the straight line, where it is still easy to see.\n\nSo we are going to be slow and careful about three quantities: **where** something is, **how fast** it is moving, and **how fast that is changing**. Position, velocity, acceleration.',
    }),
    b('callout', 2, {
      variant: 'remember',
      title: 'The one sentence this chapter is built on',
      markdown: 'Position, velocity and acceleration are the same story told three times.\n\n**Each one is the slope of the one before it. Each one is the area under the one after it.**\n\nEverything else in this chapter — every graph, all three equations, free fall, relative motion — is a consequence of that sentence. If you finish the chapter owning it, you have the chapter.',
    }),
    b('text', 3, {
      markdown: '**What is in this chapter**\n\n- Choosing a frame, and why a plus or minus sign *is* a direction\n- Average speed and average velocity — and the trap that separates them\n- Shrinking a time interval until it becomes an instant\n- Reading motion off an x–t graph, and the three graphs that move together\n- The three equations of motion, derived twice, and exactly when they stop working\n- **Free fall** — one acceleration, three different-looking situations\n- Stopping distance and reaction time — physics you can feel in a car\n- **Relative velocity** — what motion looks like from something that is itself moving',
    }),
    b('callout', 4, {
      variant: 'note',
      title: 'How to use this chapter',
      markdown: 'This chapter is mostly practice, on purpose. Kinematics is not learnt by reading — it is learnt by working problem after problem until the signs stop being frightening.\n\nEvery step-by-step solution here asks you a question before it shows you the next line. **Answer it in your head before you tap.** If you tap first and read after, you will feel like you understood everything and then be unable to start a single question in the exam.',
    }),
    b('callout', 5, {
      variant: 'note',
      title: 'A note on scope',
      markdown: 'Motion along a straight line is only half of kinematics. Motion in a **plane** — projectiles, circular motion, boats crossing rivers, rain falling on a moving man — is the next chapter, because all of it needs vectors in two dimensions.\n\nEverything in this chapter works with plus and minus signs alone. That is the whole advantage of one dimension, and it is worth enjoying while it lasts.',
    }),
  ],
};

// ── p1 · Where Are You? ──────────────────────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'where-are-you-frame-and-sign',
  title: 'Where Are You? The Answer Depends on Who Is Asking',
  subtitle: 'Frames of reference, and why a sign is a direction',
  glossary: [
    { term: 'frame of reference', definition: 'The origin and set of axes you measure positions from. Motion is always described with respect to some frame — there is no such thing as absolute motion.' },
    { term: 'position', definition: 'Where an object is, measured from a chosen origin. In one dimension it is a single number with a sign.' },
    { term: 'displacement', definition: 'The change in position: final position minus initial position. It carries a sign, so it carries a direction.' },
    { term: 'path length', definition: 'The total length of the path actually travelled. Also called distance. It is never negative and it never decreases.' },
    { term: 'point object', definition: 'An object treated as a single point, valid when its size is much smaller than the distances it moves.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A book is lying on your table. It has not moved all day. At the same moment, that same book is travelling around the Sun at about 30 kilometres every second. Which of those two statements is the true one?',
      hint: 'Ask "moving compared to what?" before you answer.',
      reveal: 'Both are true, and neither is more true than the other.\n\nThe book is at rest **with respect to your table**. It is moving fast **with respect to the Sun**. Nothing about the book decides which answer you get — what decides it is what you chose to compare it against.\n\nThis is not a word game. It is the first real idea in mechanics: motion is not a property an object has. It is a relationship between the object and whatever you are watching it from.',
    }),
    b('text', 1, {
      markdown: 'Here is the same idea with people in it.\n\nA robber climbs onto a moving train, points a pistol at the passengers and says: **"Don\'t move."** The passengers freeze — and they obey him perfectly. They are completely still, as far as he is concerned.\n\nMeanwhile they are all hurtling across the countryside at a hundred kilometres an hour, as far as the railway track is concerned.\n\nNobody is lying. There is simply no such thing as being still, full stop. There is only being still **with respect to something**.',
    }),
    b('inline_quiz', 90, {
      pass_threshold: 0.6,
      questions: [
        q('The passengers on the robber\u2019s train are, at the same moment, both perfectly still and travelling at 100 km/h. The reason is that:',
          ['One of the two descriptions must be wrong', 'Rest and motion are always stated with respect to some frame', 'The train is accelerating', 'Speed and velocity mean different things here'], 1,
          'Both descriptions are complete and correct in their own frame \u2014 still with respect to the robber, moving with respect to the track. Neither is more true, because "at rest" is a relationship and not a property.', 2),
        q('Which of these could you NOT choose freely when setting up a frame in one dimension?',
          ['Where the origin sits', 'Which direction counts as positive', 'How far the object actually moves', 'The units you measure position in'], 2,
          'The origin, the positive direction and the units are all yours to pick. How far the object actually moves is a fact about the object, and no choice of frame can change it \u2014 which is exactly why the *number* changes when the frame does but the *motion* does not.', 2),
      ],
    }),
    b('heading', 2, {
      text: 'A frame is a choice you make',
      level: 2,
      objective: 'Set up a frame of reference and use it to write down a position with the correct sign.',
    }),
    b('text', 3, {
      markdown: 'Before you can write down a single number in this chapter, you have to make two choices:\n\n1. **Where is zero?** Pick a point on the line and call it the **origin**.\n2. **Which way is positive?** Pick one of the two directions along the line and call it positive. The other is then negative.\n\nTogether these are your **frame of reference**. Both choices are entirely free — nature does not prefer left over right. But once you have made them, you must stick to them for the whole problem.',
    }),
    b('image', 4, {
      src: '',
      alt: 'A horizontal number line with the origin marked O, positive direction arrow pointing right, and two objects at +4 m and −3 m.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-frame-line',
      caption: 'A frame in one dimension is just this: an origin, and an arrow saying which way counts as positive.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. A horizontal number line running across the frame with evenly spaced tick marks labelled from -5 to +5. The origin marked with a small circle labelled O. A bold arrow above the right-hand end labelled "+ direction". Two small glowing spheres sit on the line, one at +4 and one at -3. Minimal, precise, no shading or texture. Dark background with orange and amber accents only.',
    }),
    b('text', 5, {
      markdown: 'Now the payoff. In one dimension you do **not** need vector arrows or components. A position is a single number, and the **sign of that number is the direction**.\n\nAn object at $ x = +4 $ m is 4 metres along the positive direction. An object at $ x = -3 $ m is 3 metres the other way. That is the entire vector algebra of this chapter — plus and minus.',
    }),
    b('step_solver', 91, {
      title: 'Declaring a frame before you touch a number',
      problem: 'A bus travels along a straight east\u2013west road. It is 300 m east of a crossing, and it moves 500 m further east, then 900 m west. Set up a frame and find its final position.',
      intro: 'The point of this one is the first step, not the arithmetic. Write the frame down before anything else and the rest is bookkeeping.',
      steps: [
        st('Origin at the crossing · east positive.',
          'Two decisions, in writing, before a single number. Either choice could have been the other way round \u2014 what matters is that they are now fixed for the whole problem.', {
            check: {
              kind: 'mcq',
              prompt: 'Under this frame, what is the bus\u2019s initial position?',
              options: ['$ +300 $ m', '$ -300 $ m', '$ 0 $', 'It cannot be determined'],
              answer_index: 0,
              feedback_right: 'Right \u2014 east of the origin, and east is positive.',
              feedback_wrong: 'The bus starts 300 m east of the crossing, and we chose east as positive, so its initial position is $ +300 $ m.',
            },
          }),
        st('$ x_i = +300\\ \\text{m} $, then $ +500 $ m, then $ -900 $ m.',
          'Each move gets its own sign, taken from the frame we just declared. West is negative because east is positive \u2014 not because west is somehow negative in itself.', {
            why: 'Notice that we never had to decide whether a westward move "should" be negative. The frame decided it for us. That is the entire reason for writing the frame down first.',
          }),
        st('$ x_f = 300 + 500 - 900 $',
          'Positions and displacements add, signs included.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ 300 + 500 - 900 $. Give the number with its sign.',
              blank_answer: '-100',
              feedback_right: 'Yes \u2014 the bus finishes west of the crossing.',
              feedback_wrong: '$ 300 + 500 = 800 $, and $ 800 - 900 = -100 $.',
            },
          }),
        st('$ x_f = -100\\ \\text{m} $ \u2014 100 m WEST of the crossing.',
          'The minus sign is not an error to be tidied away. It is the answer telling you which side of the crossing the bus ended up on.', {
            why: 'Sanity check without any algebra: the bus went 800 m east in total and 900 m west, so it must finish slightly west of where it began. It does.',
          }),
      ],
      now_you_try: {
        problem: 'Same crossing, but now take WEST as positive. Write the three quantities again and find the final position.',
        answer: '$ x_i = -300 $ m; the moves are $ -500 $ m then $ +900 $ m; $ x_f = +100 $ m, i.e. 100 m west.',
        solution: 'Every sign flips, so $ x_i = -300 $ m, the eastward 500 m becomes $ -500 $ m and the westward 900 m becomes $ +900 $ m. Then $ x_f = -300 - 500 + 900 = +100 $ m. The number is now positive, but it still describes the very same place: 100 m west of the crossing. **The bus never cared which convention we picked.**',
      },
    }),
    b('step_solver', 6, {
      title: 'Reading a position off the line',
      problem: 'Take the origin at a lamp post, with east as positive. A cat starts 4 m east of the lamp post and ends up 3 m west of it. Write down its initial position, its final position, and its displacement.',
      intro: 'This is deliberately easy. Do it in full anyway — the habit of writing the frame down first is what stops sign errors six pages from now.',
      steps: [
        st('$ x_i = +4\\ \\text{m} $',
          'Initial position. East is positive and the cat starts east of the origin, so the sign is positive.', {
            check: {
              kind: 'mcq',
              prompt: 'We chose east as positive. What is the cat\'s final position, 3 m west of the lamp post?',
              options: ['$ +3 $ m', '$ -3 $ m', '$ +7 $ m', '$ -7 $ m'],
              answer_index: 1,
              feedback_right: 'Right — west is the negative direction under the choice we made.',
              feedback_wrong: 'West is the opposite of our positive direction, so a position 3 m west is $ -3 $ m, not $ +3 $ m.',
            },
          }),
        st('$ x_f = -3\\ \\text{m} $',
          'Final position. Same frame, opposite side of the origin.', {
            why: 'Notice that nothing about the cat changed when we chose east as positive. We could have chosen west as positive and got $ x_i = -4 $, $ x_f = +3 $. Both descriptions are correct. What you must never do is switch halfway.',
          }),
        st('$ \\Delta x = x_f - x_i = (-3) - (+4) $',
          'Displacement is always final minus initial. Write it that way every single time and you will never get the sign backwards.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ (-3) - (+4) $. Give the number only, with its sign.',
              blank_answer: '-7',
              feedback_right: 'Yes — subtracting a positive 4 takes you further negative.',
              feedback_wrong: 'Careful with the double sign: $ (-3) - (+4) = -3 - 4 = -7 $.',
            },
          }),
        st('$ \\Delta x = -7\\ \\text{m} $',
          'The cat is displaced 7 metres, and the minus sign says that displacement points west.', {
            why: 'The minus sign is doing real work here. It is not decoration and it is not an error — it is the direction of the displacement, written in the only way one dimension allows.',
          }),
      ],
      now_you_try: {
        problem: 'Same lamp post, same choice of east as positive. A dog runs from 6 m west of the post to 2 m east of it. What is its displacement?',
        answer: '$ +8 $ m (8 m, pointing east)',
        solution: 'Initial position $ x_i = -6 $ m, final position $ x_f = +2 $ m. So $ \\Delta x = (+2) - (-6) = 2 + 6 = +8 $ m. The positive sign says the displacement points east.',
      },
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.6,
      questions: [
        q('A car is said to be "at rest". For this statement to mean anything, you must also be told:',
          ['The mass of the car', 'What it is at rest with respect to', 'How long it has been at rest', 'The make of the car'], 1,
          'Rest and motion are not properties of an object on its own. A car parked on a road is at rest with respect to the road and moving with respect to the Sun — both at once. Without naming the frame, "at rest" says nothing.', 1),
        q('You choose the upward direction as positive for a ball thrown into the air. Your friend chooses downward as positive for the same ball. Which of you will calculate a different **time of flight**?',
          ['You will', 'Your friend will', 'Neither — you will both get the same time', 'It depends on how high the ball goes'], 2,
          'The choice of positive direction changes the signs you write down, not the physics. A time of flight is a physical fact about the ball; both of you must get the same number for it. Only the signs of positions, velocities and accelerations flip.', 2),
        q('A particle moves from $ x = -2 $ m to $ x = -9 $ m. Its displacement is:',
          ['$ -7 $ m', '$ +7 $ m', '$ -11 $ m', '$ +11 $ m'], 0,
          'Displacement is final minus initial: $ (-9) - (-2) = -9 + 2 = -7 $ m. Both positions are negative, but what matters is the change, and the particle moved further in the negative direction.', 2),
      ],
    }),
    b('heading', 8, {
      text: 'A quick recap: the four words you already know',
      level: 2,
      objective: 'Refresh distance and displacement, and be sure which of them can be negative.',
    }),
    b('text', 9, {
      markdown: 'You met these in junior classes, so this is a refresher, not a lesson. But get them crisp now — the rest of the chapter leans on them constantly.',
    }),
    b('table', 10, {
      caption: 'The four words, side by side',
      headers: ['Word', 'What it means', 'Can it be negative?'],
      rows: [
        ['**Position**', 'Where the object is, measured from your origin', 'Yes — the sign says which side of the origin'],
        ['**Path length** (distance)', 'The total length of the path actually travelled', 'No — it only ever adds up'],
        ['**Displacement**', 'Change in position: final minus initial', 'Yes — the sign says which way'],
        ['**Distance travelled in an interval**', 'Path length covered during that interval', 'No'],
      ],
    }),
    b('text', 11, {
      markdown: 'The one relation worth carrying forward:\n\n$ |\\text{displacement}| \\leq \\text{path length} $\n\nThey are **equal only when the object never reverses direction**. The moment it turns round, the path keeps adding up while the displacement starts shrinking.',
    }),
    b('image', 12, {
      src: '',
      alt: 'A semicircular walking track of radius 40 m, with the curved path marked 126 m and the straight diameter marked 80 m.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-semicircle-walk',
      caption: 'Same journey, two honest answers: 126 m along the track, 80 m from start to finish.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. A semicircular arc drawn as a glowing curved path, with a small figure walking along it, radius marked 40 m from the centre. The straight diameter joining the two ends of the arc drawn as a dashed straight line with an arrowhead. Minimal, precise, schematic, no text beyond simple dimension marks. Dark background with orange and amber accents only.',
    }),
    b('step_solver', 13, {
      title: 'When the two answers differ',
      problem: 'An old man takes his morning walk along a semicircular track of radius 40.0 m. He starts at one end of the track and stops at the other end. Find the distance he covered and his displacement.',
      intro: 'Both answers are correct. They are answers to two different questions, and this problem exists to make that unforgettable.',
      steps: [
        st('$ \\text{distance} = \\pi R $',
          'He walked along the curve, so the distance is the length of the semicircular arc — half the circumference of a circle of radius 40.0 m.', {
            check: {
              kind: 'mcq',
              prompt: 'The full circumference of a circle of radius $ R $ is $ 2\\pi R $. What is the length of a semicircular arc?',
              options: ['$ \\pi R $', '$ 2\\pi R $', '$ \\pi R^2 $', '$ \\frac{\\pi R}{2} $'],
              answer_index: 0,
              feedback_right: 'Yes — half of $ 2\\pi R $.',
              feedback_wrong: 'A semicircle is half a circle, so its arc is half of $ 2\\pi R $, which is $ \\pi R $. ($ \\pi R^2 $ would be an area, not a length.)',
            },
          }),
        st('$ \\text{distance} = \\pi \\times 40.0 = 126\\ \\text{m} $',
          'Putting the radius in.', {
            why: 'Two significant-figure discipline from Ch.1: the radius is given to three significant figures, so 126 m is the right way to write this, not 125.6637 m.',
          }),
        st('$ \\text{displacement} = 2R $',
          'Displacement only cares where he started and where he stopped. Those two points are the two ends of the diameter.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the displacement the diameter and not the arc?',
              options: [
                'Because displacement is always a straight line from start to finish',
                'Because the arc is longer and displacement is always the smaller number',
                'Because he walked in a curve',
                'Because the radius is 40 m',
              ],
              answer_index: 0,
              feedback_right: 'Exactly — displacement ignores the route entirely.',
              feedback_wrong: 'Displacement is the straight line from the starting point to the finishing point, whatever route was actually taken. It happens to be smaller here, but that is a consequence, not the definition.',
            },
          }),
        st('$ \\text{displacement} = 2 \\times 40.0 = 80.0\\ \\text{m} $',
          'Directed from where he started to where he stopped.', {
            why: 'He walked 126 m and finished 80 m from where he began. Neither number is wrong. If you are asked how tired he is, use 126. If you are asked how far he got, use 80.',
          }),
      ],
      now_you_try: {
        problem: 'A runner completes exactly one full lap of a circular track of radius 50 m, finishing where she started. What distance did she cover, and what was her displacement?',
        answer: 'Distance $ = 2\\pi \\times 50 \\approx 314 $ m; displacement $ = 0 $.',
        solution: 'One full lap is a whole circumference, $ 2\\pi R = 2\\pi(50) \\approx 314 $ m of path length. But she finished at the point she started from, so her final position equals her initial position and the displacement is exactly zero. This is the cleanest possible case of the two answers disagreeing.',
      },
    }),
    b('classify_exercise', 14, {
      question: 'Sort these. Which of these quantities **can be negative** in one-dimensional motion?',
      column_label: 'Quantity',
      verdict_label: 'Can be negative?',
      yes_label: '✓ Can be negative',
      no_label: '✗ Never negative',
      rows: [
        { substance: 'Position', is_solution: true, explanation: 'Yes — a negative position just means the object is on the other side of the origin from the direction you called positive.' },
        { substance: 'Path length', is_solution: false, explanation: 'Never. Path length only accumulates; walking further can never reduce it.' },
        { substance: 'Displacement', is_solution: true, explanation: 'Yes — the sign of the displacement is the direction of the displacement.' },
        { substance: 'Distance travelled', is_solution: false, explanation: 'Never. It is another name for path length.' },
        { substance: 'Change in position', is_solution: true, explanation: 'Yes — this is exactly what displacement means.' },
        { substance: 'The magnitude of a displacement', is_solution: false, explanation: 'Never. A magnitude strips the sign off, so it is either positive or zero.' },
      ],
    }),
    b('step_solver', 15, {
      title: 'A journey with a turn in it',
      problem: 'A man has to go 50 m due north, then 40 m due east, then 20 m due south to reach a field. What distance does he walk, and what is his displacement from his house to the field?',
      intro: 'This one has a reversal in it, so the two answers must differ. Watch how little the route matters to the second answer.',
      steps: [
        st('$ \\text{distance} = 50 + 40 + 20 = 110\\ \\text{m} $',
          'Distance is just the walking added up. The turns make no difference — his feet do not care which way he is facing.', {
            check: {
              kind: 'mcq',
              prompt: 'Does going 20 m south at the end reduce the distance he has walked?',
              options: [
                'Yes — south undoes some of the north',
                'No — distance only ever adds up',
                'Only if he walks back along the same road',
                'Only if he walks faster on the way south',
              ],
              answer_index: 1,
              feedback_right: 'Right. Reversing direction subtracts from displacement, never from distance.',
              feedback_wrong: 'Path length is what his legs did. Turning round does not un-walk the metres he has already walked — it only affects where he ends up, which is displacement.',
            },
          }),
        st('north–south: $ 50 - 20 = 30\\ \\text{m}\\ \\text{north} $',
          'Now for the displacement. Take the two north–south legs together: 50 m north then 20 m south leaves him 30 m north of home.', {
            why: 'This is the one place in this chapter where two dimensions sneak in. Handle each direction separately and each one is a one-dimensional problem again — which is exactly the trick the next chapter is built on.',
          }),
        st('east–west: $ 40\\ \\text{m}\\ \\text{east} $',
          'Nothing cancels this one — there is only one east–west leg.', {
            check: {
              kind: 'mcq',
              prompt: 'He is now 30 m north and 40 m east of home. How do you combine those into one distance?',
              options: [
                'Add them: $ 30 + 40 = 70 $ m',
                'Subtract them: $ 40 - 30 = 10 $ m',
                'Pythagoras: $ \\sqrt{30^2 + 40^2} $',
                'Average them: $ 35 $ m',
              ],
              answer_index: 2,
              feedback_right: 'Yes — north and east are perpendicular, so the straight-line distance is the hypotenuse.',
              feedback_wrong: 'North and east are at right angles, so the two legs form a right-angled triangle and the straight line home is its hypotenuse: $ \\sqrt{30^2 + 40^2} $.',
            },
          }),
        st('$ |\\Delta x| = \\sqrt{30^2 + 40^2} = \\sqrt{2500} = 50\\ \\text{m} $',
          'So he walked 110 m and ended up 50 m from his house, in a direction between north and east.', {
            why: 'A 3-4-5 triangle, scaled by 10. You will meet these numbers constantly in physics — 3, 4, 5 and its cousin 5, 12, 13 are worth recognising on sight so you stop reaching for a calculator.',
          }),
      ],
      now_you_try: {
        problem: 'A particle starts at the origin, travels along the x-axis to the point $ x = +20 $ m, then returns along the same line to $ x = -20 $ m. Find the distance travelled and the displacement.',
        answer: 'Distance $ = 40 + 20 = 60 $ m; displacement $ = -20 $ m.',
        solution: 'Going out is 20 m of path; coming back from $ +20 $ to $ -20 $ is another 40 m of path. Total path length $ = 60 $ m. The displacement, though, is only final minus initial: $ (-20) - 0 = -20 $ m. The minus sign says it points along the negative x-direction.',
      },
    }),
    b('inline_quiz', 16, {
      pass_threshold: 0.6,
      questions: [
        q('For a particle moving in one dimension, which statement is **always** true?',
          ['Distance $ = $ |displacement|', 'Distance $ \\geq $ |displacement|', 'Distance $ \\leq $ |displacement|', 'Distance $ > $ |displacement|'], 1,
          'Path length can never be smaller than the straight-line separation between the endpoints. They are equal when the motion never reverses, and the path length is strictly larger the moment it does — so "greater than or equal to" is the safe statement.', 2),
        q('A particle travels along a straight line and returns to its starting point. Which pair of values is correct?',
          ['Distance zero, displacement zero', 'Distance non-zero, displacement zero', 'Distance zero, displacement non-zero', 'Both must be non-zero'], 1,
          'The feet did real work, so path length is non-zero. But the final position equals the initial position, so the change in position — the displacement — is exactly zero. A zero distance with a non-zero displacement is impossible, which rules out the reverse pairing.', 2),
      ],
    }),
    b('heading', 17, {
      text: 'One more simplification: the point object',
      level: 2,
      objective: 'Decide when it is fair to treat a real object as a single point.',
    }),
    b('text', 18, {
      markdown: 'Throughout this chapter we treat moving objects as **points**. A car has a bonnet and a boot; when it drives 20 km we do not ask which end we are tracking.\n\nThat is fair whenever the object\'s **size is much smaller than the distances it moves**, and whenever it is not spinning or tumbling in a way that matters. A car on a highway: fine. A cricket ball spinning sharply off the pitch: not fine, because the spin is the whole point of the question.',
    }),
    b('reasoning_prompt', 19, {
      reasoning_type: 'logical',
      prompt: 'For each of these, decide whether the object can be treated as a point object, and say why:\n\n(a) a railway carriage moving smoothly between two stations\n(b) a monkey sitting on top of a man cycling smoothly around a circular track\n(c) a spinning cricket ball that turns sharply on hitting the ground\n(d) a beaker that has slipped off the edge of a table and is tumbling as it falls',
      reveal: '**(a) Yes.** The carriage is a few tens of metres long and the journey is many kilometres. Its size is negligible compared with the distance it covers.\n\n**(b) Yes.** The monkey is small compared with the circular track, and it is not doing anything complicated of its own — it is just going along for the ride.\n\n**(c) No.** The ball turns sharply *because* it is spinning, and spin is a property of an extended body. Shrink it to a point and the very effect the question is about disappears.\n\n**(d) No.** It is tumbling, so different parts of the beaker are doing visibly different things. Its size is also not small compared to the height it falls.\n\nThe test is not "is the object small?" It is: **does its size or its rotation matter for the question being asked?**',
      difficulty_level: 2,
    }),
    b('callout', 20, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- Motion is always **with respect to a frame**. There is no absolute rest.\n- A frame in one dimension is an **origin plus a positive direction** — both your free choice, both fixed once chosen.\n- The **sign of a number is its direction**. That is all the vector algebra this chapter needs.\n- **Displacement $ = $ final $ - $ initial**, always in that order.\n- $ |\\text{displacement}| \\leq \\text{path length} $, with equality only when the motion never reverses.',
    }),
    b('practice_bank', 21, {
      title: 'You solve it',
      intro: 'Seven before you move on. Work each one out on paper before you reveal it — this page is easy enough that you can afford to build the habit here.',
      sections: [
        {
          id: 'p1-ysi',
          title: 'Frames, signs, distance and displacement',
          items: [
            num('p1-y1', 'Taking north as positive, a cyclist moves from a position 12 m south of a junction to a position 5 m north of it. Write down (a) the initial position, (b) the final position, (c) the displacement.',
              '(a) $ -12 $ m  (b) $ +5 $ m  (c) $ +17 $ m',
              'North is positive, so a position 12 m south of the origin is $ x_i = -12 $ m and 5 m north is $ x_f = +5 $ m. Displacement is final minus initial: $ (+5) - (-12) = 5 + 12 = +17 $ m, pointing north.'),
            mcq('p1-y2', 'A particle moves along the x-axis from $ x = 5 $ m to $ x = -5 $ m and then back to $ x = 2 $ m. The distance travelled and the displacement are:',
              ['Distance 17 m, displacement $ -3 $ m', 'Distance 3 m, displacement $ -3 $ m', 'Distance 17 m, displacement $ +17 $ m', 'Distance 10 m, displacement $ -7 $ m'], 0,
              'The first leg covers $ |{-5} - 5| = 10 $ m of path, the second covers $ |2 - (-5)| = 7 $ m, so the path length is 17 m. The displacement only compares the ends: $ 2 - 5 = -3 $ m.'),
            num('p1-y3', 'A car goes once around a circular track of circumference 800 m and stops exactly where it started. Find the distance covered and the magnitude of the displacement.',
              'Distance 800 m; displacement 0',
              'The wheels covered the whole circumference, so the path length is 800 m. But the final position is identical to the initial position, so the change in position — the displacement — is zero.'),
            mcq('p1-y4', 'Two students describe the same falling stone. One takes upward as positive; the other takes downward as positive. They will disagree about:',
              ['The sign of the stone\'s displacement', 'The time the stone takes to land', 'The distance the stone falls', 'The stone\'s speed on landing'], 0,
              'A change in the sign convention flips the signs of positions, displacements, velocities and accelerations — but times, distances and speeds are magnitudes, so they come out identical either way. Only the signed quantity is affected.'),
            num('p1-y5', 'A man walks 3 km east, then 4 km north. Find (a) the distance walked and (b) the magnitude of his displacement.',
              '(a) 7 km  (b) 5 km',
              'Distance simply adds: $ 3 + 4 = 7 $ km. East and north are perpendicular, so the displacement is the hypotenuse: $ \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5 $ km. Another 3-4-5 triangle.'),
            mcq('p1-y6', 'For which of these motions is the magnitude of the displacement **equal** to the distance travelled?',
              ['A ball thrown straight up and caught again', 'A car reversing out of a driveway and then driving forward past it', 'A train moving forward along a straight track without stopping or reversing', 'A runner completing one lap of a track'], 2,
              'The two agree only when the motion never reverses direction. A train running straight forward qualifies. Every other case here involves a turn or a return, which lets the path keep growing while the displacement shrinks.'),
            num('p1-y7', 'A particle is at $ x = -7 $ m. It undergoes a displacement of $ +12 $ m, then a further displacement of $ -4 $ m. Where does it end up?',
              '$ x = +1 $ m',
              'Displacements simply add, signs included: $ -7 + 12 - 4 = +1 $ m. Note that we never needed to know the route between these positions — displacements carry all the information that matters for the final position.'),
          ],
        },
      ],
    }),
    b('text', 22, {
      markdown: 'You now have a frame, a sign convention, and four words that behave themselves.\n\nNext: the two ways of answering "how fast?" — and the fact that they can give completely different numbers for the same journey.',
    }),
  ],
};

// ── p2 · Average Speed and Average Velocity ──────────────────────────────────
const p2 = {
  page_number: 2,
  slug: 'average-speed-and-average-velocity',
  title: 'Average Speed and Average Velocity',
  subtitle: 'Two answers to "how fast?", and the trap that separates them',
  glossary: [
    { term: 'average speed', definition: 'Total path length divided by total time taken. Never negative.' },
    { term: 'average velocity', definition: 'Total displacement divided by total time taken. Carries a sign, so it carries a direction.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A man walks 2.5 km from his home to the market at 5 km/h. The market is shut, so he immediately turns round and walks home at 7.5 km/h. Over the whole trip, his average velocity is exactly zero. He is not going to enjoy being told that. Where has the physics gone wrong?',
      hint: 'Ask what "average velocity" is actually the average of.',
      reveal: 'The physics has not gone wrong at all — the word has.\n\n**Average velocity** is displacement over time. He finished where he started, so his displacement is zero, so his average velocity is zero. That is a correct statement about *where he got to*.\n\n**Average speed** is path length over time. He walked 5 km in 50 minutes, so his average speed is 6 km/h. That is a correct statement about *how hard he worked*.\n\nBoth numbers are right. They answer different questions, and this page is about never confusing them again.',
    }),
    b('text', 1, {
      markdown: 'The two definitions differ in exactly one place — the top line.\n\n$ \\text{average speed} = \\frac{\\text{total path length}}{\\text{total time}} $\n\n$ \\text{average velocity} = \\frac{\\text{total displacement}}{\\text{total time}} = \\frac{x_f - x_i}{t_f - t_i} $\n\nAverage speed is built from a quantity that can never be negative, so it can never be negative. Average velocity is built from a displacement, so it carries a sign — and that sign is a direction.',
    }),
    b('inline_quiz', 70, {
      pass_threshold: 0.6,
      questions: [
        q('Average speed and average velocity differ in exactly one place. Which?',
          ['The time interval used', 'The quantity on the top line', 'The sign convention', 'Nothing — they are the same'], 1,
          'Both divide by the same total time. Average speed puts the total path length on top; average velocity puts the displacement there. That single difference is why one can never be negative and the other can.', 2),
      ],
    }),
    b('text', 2, {
      markdown: 'Here is a picture for what an average really is.\n\nIn a one-day cricket match, the commentator quotes a **run rate** — runs per over. Some overs were expensive, some were tight, and the run rate does not care. It reports the overall effect: this many runs, in this many overs.\n\nAverage speed does the same job for motion. It does not claim you moved at that speed at any particular moment. It says: *if you had moved steadily at this speed the whole time, you would have covered the same path in the same time.*',
    }),
    b('inline_quiz', 71, {
      pass_threshold: 0.6,
      questions: [
        q('A cricket commentator quotes a run rate of 5 runs per over. This is most like which quantity in physics?',
          ['Instantaneous velocity', 'An average', 'Acceleration', 'Displacement'], 1,
          'A run rate reports the overall effect across many overs without claiming any single over went at that rate — which is exactly what an average speed does for a journey.', 1),
      ],
    }),
    b('heading', 3, {
      text: 'Which is bigger?',
      level: 2,
      objective: 'Explain why average speed can never be less than the magnitude of average velocity.',
    }),
    b('text', 4, {
      markdown: 'Both fractions have the same denominator — the same total time. So comparing them is just comparing their numerators, and we already know how those compare:\n\n$ \\text{path length} \\geq |\\text{displacement}| $\n\nTherefore\n\n$ \\text{average speed} \\geq |\\text{average velocity}| $\n\nwith equality **only when the motion never reverses**. It is the same rule as the previous page, divided through by time.',
    }),
    b('step_solver', 5, {
      title: 'The market trip, in full',
      problem: 'A man walks 2.5 km from home to a market at 5 km/h. Finding it closed, he instantly turns and walks back home at 7.5 km/h. Find (a) his average velocity and (b) his average speed over the intervals 0 to 30 min, 0 to 50 min, and 0 to 40 min.',
      intro: 'Three different intervals of the same journey. Watch the two answers agree, then separate, then separate differently.',
      steps: [
        st('out: $ t = \\frac{2.5}{5} = 0.5\\ \\text{h} = 30\\ \\text{min} $ · back: $ t = \\frac{2.5}{7.5} = \\frac{1}{3}\\ \\text{h} = 20\\ \\text{min} $',
          'Before anything else, work out the timetable. He reaches the market at 30 min and gets home at 50 min.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The return leg is 2.5 km at 7.5 km/h. How many minutes does it take?',
              blank_answer: '20',
              feedback_right: 'Yes — $ 2.5/7.5 = 1/3 $ h, which is 20 minutes.',
              feedback_wrong: 'Time is distance over speed: $ 2.5 \\div 7.5 = 1/3 $ hour. One-third of 60 minutes is 20 minutes.',
            },
          }),
        st('0–30 min: velocity $ = \\frac{2.5}{0.5} = 5 $ km/h · speed $ = \\frac{2.5}{0.5} = 5 $ km/h',
          'For the outward leg alone he never turns round, so displacement and path length are the same 2.5 km — and the two averages are identical.', {
            why: 'This is the "equality case" in action. As long as the motion is one-way, average speed and average velocity are the same number and you can be sloppy without being punished. That ends the moment he turns round.',
          }),
        st('0–50 min: velocity $ = \\frac{0}{50/60} = 0 $ · speed $ = \\frac{5.0}{50/60} = 6 $ km/h',
          'Over the whole trip he is back where he started, so the displacement is zero — but he has walked a full 5 km.', {
            check: {
              kind: 'mcq',
              prompt: 'Why is the average speed 6 km/h and not the simple average of 5 and 7.5, which is 6.25 km/h?',
              options: [
                'Because he spent more time at the slower speed than at the faster one',
                'Because average speed is always less than the mean of the two speeds',
                'Because the distances were different on the two legs',
                'Because 6 km/h is the average of 5 and 7.5 rounded down',
              ],
              answer_index: 0,
              feedback_right: 'Exactly — 30 minutes slow against 20 minutes fast, so the slow speed gets more weight.',
              feedback_wrong: 'The two legs were equal in *distance*, not in *time* — 30 minutes out and only 20 back. The slower speed therefore occupied more of the total time and pulls the average down below 6.25.',
            },
          }),
        st('0–40 min: back $ 7.5 \\times \\frac{10}{60} = 1.25 $ km, so $ x = 2.5 - 1.25 = 1.25 $ km',
          'At 40 minutes he has been walking home for 10 minutes. Find where he actually is before you divide anything.', {
            why: 'Almost every wrong answer to this part comes from forgetting to locate him first and just dividing 2.5 by something. Position first, then the fraction.',
          }),
        st('velocity $ = \\frac{1.25}{2/3} = 1.875 $ km/h · speed $ = \\frac{2.5 + 1.25}{2/3} = 5.625 $ km/h',
          'Displacement 1.25 km, but path length 3.75 km, over the same 40 minutes.', {
            why: 'Three intervals, three different relationships: equal, then one zero and one not, then both non-zero but very different. Same man, same walk. The interval you choose is part of the question.',
          }),
      ],
      now_you_try: {
        problem: 'For the same trip, what are the average velocity and average speed over the interval from 30 min to 50 min (the return leg alone)?',
        answer: 'Average velocity $ = -7.5 $ km/h (i.e. 7.5 km/h towards home); average speed $ = 7.5 $ km/h.',
        solution: 'Over the return leg alone he never reverses, so path length and $ |$displacement$| $ are both 2.5 km over $ 20 $ min $ = 1/3 $ h. Both averages come out as 7.5 km/h in magnitude. Taking "away from home" as positive, the displacement is $ -2.5 $ km, so the average velocity is $ -7.5 $ km/h while the average speed stays $ +7.5 $ km/h.',
      },
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('The average speed of a particle over an interval is zero. What can you conclude?',
          ['The particle did not move at all during the interval', 'The particle returned to its starting point', 'The particle moved at constant velocity', 'Nothing — this is impossible'], 0,
          'Zero average speed means zero path length, which means the particle never moved. (Zero average *velocity* is the much weaker statement that it came back to where it started — that one it can do while moving a great deal.)', 2),
        q('Over some interval a particle has non-zero average speed and zero average velocity. This means:',
          ['The particle moved and finished where it started', 'The particle never moved from its starting position', 'The particle moved at a constant speed throughout', 'The data given is self-contradictory'], 0,
          'Non-zero average speed says the path length was non-zero, so it definitely moved. Zero average velocity says the displacement was zero, so it finished at its starting point. Both together describe any closed round trip.', 2),
      ],
    }),
    b('heading', 7, {
      text: 'The trap: half the distance, or half the time?',
      level: 2,
      objective: 'Choose the correct average when a journey is split by distance and when it is split by time.',
    }),
    b('text', 8, {
      markdown: 'Here are two problems that look almost identical, and have genuinely different answers. Examiners love them for exactly that reason.\n\n**Problem A.** A particle covers the **first half of the distance** at $ v_1 $ and the second half at $ v_2 $.\n\n**Problem B.** A particle moves at $ v_1 $ for the **first half of the time** and at $ v_2 $ for the second half.\n\nBefore reading on, guess whether they give the same average speed.',
    }),
    b('step_solver', 9, {
      title: 'Problem A — split by distance',
      problem: 'A particle travels the first half of the total distance with constant speed $ v_1 $ and the second half with constant speed $ v_2 $. Find its average speed for the whole journey.',
      intro: 'The trick that makes this easy: call each half $ d $, so the total is $ 2d $. Never call the total $ d $ — you will spend the rest of the problem dividing by two.',
      steps: [
        st('$ t_1 = \\frac{d}{v_1} $ and $ t_2 = \\frac{d}{v_2} $',
          'Each half of the distance is $ d $. Time is distance over speed, so write down the time for each leg separately.', {
            check: {
              kind: 'mcq',
              prompt: 'Which quantity is the same for both legs in this problem?',
              options: ['The time taken', 'The distance covered', 'The speed', 'Nothing is the same'],
              answer_index: 1,
              feedback_right: 'Right — the journey was split into two equal *distances*, and the times come out different.',
              feedback_wrong: 'Read the problem again: it splits the total *distance* in half. So each leg covers the same distance $ d $, and because the speeds differ, the two legs take different times.',
            },
          }),
        st('$ \\text{average speed} = \\frac{2d}{t_1 + t_2} = \\frac{2d}{\\frac{d}{v_1} + \\frac{d}{v_2}} $',
          'Average speed is total distance over total time. Substitute both times in.', {
            why: 'Notice the $ d $ is about to cancel. That is the sign you set the problem up well — the answer cannot depend on how long the journey was, only on the two speeds.',
          }),
        st('$ = \\frac{2}{\\frac{1}{v_1} + \\frac{1}{v_2}} = \\frac{2 v_1 v_2}{v_1 + v_2} $',
          'Cancel the $ d $ and tidy up.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Use the result for $ v_1 = 6 $ km/h and $ v_2 = 8 $ km/h. Give the average speed in km/h, rounded to one decimal place.',
              blank_answer: '6.9',
              feedback_right: 'Yes — $ 2(6)(8)/(6+8) = 96/14 \\approx 6.9 $ km/h.',
              feedback_wrong: 'Substitute directly: $ \\frac{2 \\times 6 \\times 8}{6 + 8} = \\frac{96}{14} = 6.857\\ldots \\approx 6.9 $ km/h.',
            },
          }),
        st('$ v_{\\text{av}} = \\frac{2 v_1 v_2}{v_1 + v_2} $',
          'This is called the **harmonic mean** of the two speeds — and it is always smaller than their ordinary average.', {
            why: 'Why smaller? Because equal distances at different speeds means you spend **more time** at the slower speed. The slow leg gets more weight, so the average is dragged down. That single sentence is the whole reason this formula is not just $ (v_1+v_2)/2 $.',
          }),
      ],
      now_you_try: {
        problem: 'A car covers the first half of a journey at 30 km/h and the second half at 60 km/h. What is its average speed?',
        answer: '40 km/h',
        solution: '$ v_{\\text{av}} = \\frac{2 v_1 v_2}{v_1 + v_2} = \\frac{2(30)(60)}{30 + 60} = \\frac{3600}{90} = 40 $ km/h. Note it is well below 45 km/h, the naive answer — the car spends twice as long on the slow half as on the fast half.',
      },
    }),
    b('step_solver', 10, {
      title: 'Problem B — split by time',
      problem: 'A particle travels with speed $ v_1 $ for the first half of the total time and with speed $ v_2 $ for the second half. Find its average speed.',
      intro: 'Same two speeds, one word changed. Set it up the same careful way: call each half of the time $ t $.',
      steps: [
        st('$ d_1 = v_1 t $ and $ d_2 = v_2 t $',
          'Each half of the time is $ t $. Distance is speed times time, so write each leg\'s distance.', {
            check: {
              kind: 'mcq',
              prompt: 'What is the same for both legs this time?',
              options: ['The distance covered', 'The time taken', 'The speed', 'Nothing is the same'],
              answer_index: 1,
              feedback_right: 'Yes — equal *times* now, so the faster leg covers more ground.',
              feedback_wrong: 'The journey is split into two equal halves of *time*. So both legs last $ t $, and the distances come out different because the speeds differ.',
            },
          }),
        st('$ \\text{average speed} = \\frac{v_1 t + v_2 t}{2t} $',
          'Total distance over total time, where the total time is $ 2t $.', {
            why: 'Again the letter you introduced is about to cancel — the answer must depend only on the two speeds.',
          }),
        st('$ = \\frac{v_1 + v_2}{2} $',
          'Cancel $ t $. This is just the ordinary average of the two speeds.', {
            check: {
              kind: 'mcq',
              prompt: 'Compare the two results. For $ v_1 = 6 $ and $ v_2 = 8 $, which split gives the larger average speed?',
              options: [
                'Splitting by distance (6.9)',
                'Splitting by time (7.0)',
                'They are equal',
                'It depends on which speed comes first',
              ],
              answer_index: 1,
              feedback_right: 'Right — splitting by time gives 7.0, splitting by distance gives about 6.9.',
              feedback_wrong: 'Splitting by time gives $ (6+8)/2 = 7.0 $. Splitting by distance gives $ 96/14 \\approx 6.9 $. The harmonic mean is always the smaller of the two.',
            },
          }),
        st('by distance: $ \\frac{2v_1v_2}{v_1+v_2} $ · by time: $ \\frac{v_1+v_2}{2} $',
          'Two formulas. The only thing you have to get right is which one the question is asking for.', {
            why: 'A reading habit that saves marks: underline the word after "half of the". If it says **distance**, you need the harmonic mean. If it says **time**, you need the ordinary average. The two are equal only when $ v_1 = v_2 $, in which case there was never a question.',
          }),
      ],
      now_you_try: {
        problem: 'A particle moves in a straight line with constant speed 4 m/s for 2 s, then with constant speed 6 m/s for 3 s. Find its average speed over the whole 5 s.',
        answer: '5.2 m/s',
        solution: 'Careful — the halves are *not* equal here, so neither shortcut formula applies and you must go back to the definition. Distance $ = 4(2) + 6(3) = 8 + 18 = 26 $ m in a total time of 5 s, so the average speed is $ 26/5 = 5.2 $ m/s. When in doubt, always fall back to total-distance-over-total-time; the formulas are conveniences, not laws.',
      },
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'Do not memorise these two formulas',
      markdown: 'Memorising $ \\frac{2v_1v_2}{v_1+v_2} $ and $ \\frac{v_1+v_2}{2} $ is exactly how students end up using the wrong one under pressure.\n\nInstead memorise the **method**: name each leg, write its distance and its time, then divide total by total. It takes fifteen extra seconds and it works on every variant an examiner can build — three legs, unequal fractions, one leg at rest.',
    }),
    b('step_solver', 12, {
      title: 'A three-leg journey, from the definition',
      problem: 'A particle moving along a straight line has speed 2 m/s from $ t = 0 $ to $ 2 $ s, 3 m/s from $ 2 $ to $ 5 $ s, 4 m/s from $ 5 $ to $ 10 $ s, and 2 m/s from $ 10 $ to $ 15 $ s. Find the total distance travelled and the average speed.',
      intro: 'No formula fits this. Good — that is the point. Total over total, every time.',
      steps: [
        st('$ 2 \\times 2 = 4 $ m · $ 3 \\times 3 = 9 $ m · $ 4 \\times 5 = 20 $ m · $ 2 \\times 5 = 10 $ m',
          'Each leg has a constant speed, so each leg\'s distance is simply speed times the duration of that leg.', {
            check: {
              kind: 'fill_blank',
              prompt: 'The third leg runs from $ t = 5 $ s to $ t = 10 $ s at 4 m/s. How many metres is that?',
              blank_answer: '20',
              feedback_right: 'Yes — 5 seconds at 4 m/s.',
              feedback_wrong: 'The duration is $ 10 - 5 = 5 $ s, not 10 s. At 4 m/s that gives $ 4 \\times 5 = 20 $ m.',
            },
          }),
        st('$ \\text{total distance} = 4 + 9 + 20 + 10 = 43\\ \\text{m} $',
          'Add the four legs.', {
            why: 'Reading the durations off correctly is the only difficulty in this problem. A table of *time intervals* is not a table of *durations* — you have to subtract.',
          }),
        st('$ \\text{average speed} = \\frac{43}{15} = 2.87\\ \\text{m/s} $',
          'Total distance over the total time of 15 s.', {
            why: 'Sanity check: the four speeds range from 2 to 4 m/s, so any answer outside that range would be wrong on sight. 2.87 sits inside, close to the low end — which fits, because the particle spent 10 of its 15 seconds at 2 or 3 m/s.',
          }),
      ],
      now_you_try: {
        problem: 'A particle travels half of the total time at a constant 2 m/s. In the remaining half of the time it covers one-quarter of the distance of that half at 4 m/s, and the other three-quarters at 6 m/s. Find the average speed for the whole journey.',
        answer: '$ \\frac{11}{3} \\approx 3.7 $ m/s',
        solution: 'Let each half of the time be $ t $, and let $ D $ be the distance covered during the second half.\n\nFirst half: distance $ = 2t $.\n\nSecond half: the two legs take $ \\frac{D/4}{4} $ and $ \\frac{3D/4}{6} $, and together they must fill the time $ t $. So $ \\frac{D}{16} + \\frac{D}{8} = t $, that is $ \\frac{3D}{16} = t $, giving $ D = \\frac{16t}{3} $.\n\nTotal distance $ = 2t + \\frac{16t}{3} = \\frac{22t}{3} $ over a total time of $ 2t $, so the average speed is $ \\frac{22t}{3} \\div 2t = \\frac{11}{3} \\approx 3.7 $ m/s.\n\nThe trap is assuming the second half covers the same distance as the first. It does not — you have to solve for it.',
      },
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('A person travels along a straight line at uniform velocity $ v_1 $ for some time and then at uniform velocity $ v_2 $ for an **equal time**. The average velocity is:',
          ['$ \\frac{v_1 + v_2}{2} $', '$ \\sqrt{v_1 v_2} $', '$ \\frac{2v_1v_2}{v_1+v_2} $', '$ \\frac{v_1 v_2}{v_1 + v_2} $'], 0,
          'Equal times means each leg contributes its speed with equal weight, so the ordinary average applies. The harmonic-mean form belongs to the equal-*distance* version of this question.', 2),
        q('A person travels along a straight line at uniform velocity $ v_1 $ for a distance $ x $ and then at uniform velocity $ v_2 $ for the **next equal distance**. The average velocity is given by:',
          ['$ v = \\frac{v_1+v_2}{2} $', '$ \\frac{2}{v} = \\frac{1}{v_1} + \\frac{1}{v_2} $', '$ v = \\sqrt{v_1v_2} $', '$ \\frac{1}{v} = \\frac{1}{v_1} + \\frac{1}{v_2} $'], 1,
          'Equal distances give the harmonic mean, $ v = \\frac{2v_1v_2}{v_1+v_2} $, which rearranges exactly to $ \\frac{2}{v} = \\frac{1}{v_1} + \\frac{1}{v_2} $. Dropping the factor of 2 is the classic slip here.', 3),
        q('Which of these can **never** be negative?',
          ['Average velocity', 'Displacement', 'Average speed', 'Position'], 2,
          'Average speed is path length over time, and neither of those can be negative. The other three all carry a sign that encodes direction or which side of the origin the object sits on.', 1),
      ],
    }),
    b('callout', 14, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Average speed** $ = \\dfrac{\\text{total path length}}{\\text{total time}} $ — never negative.\n- **Average velocity** $ = \\dfrac{\\text{total displacement}}{\\text{total time}} $ — signed.\n- $ \\text{average speed} \\geq |\\text{average velocity}| $, equal only if the motion never reverses.\n- Half the **distance** $ \\Rightarrow $ harmonic mean $ \\dfrac{2v_1v_2}{v_1+v_2} $. Half the **time** $ \\Rightarrow $ ordinary mean $ \\dfrac{v_1+v_2}{2} $.\n- When in doubt, abandon the formulas and go back to total-over-total.',
    }),
    b('practice_bank', 15, {
      title: 'You solve it',
      intro: 'Seven questions. At least two of them are the distance-versus-time trap in disguise — read each one twice before you start.',
      sections: [
        {
          id: 'p2-ysi',
          title: 'Averages, and which one the question wants',
          items: [
            num('p2-y1', 'A man walks at 6 km/h for the first 1 km and at 8 km/h for the next 1 km. What is his average speed for the 2 km walk?',
              'About 6.9 km/h',
              'Equal distances, so use the harmonic mean: $ \\frac{2(6)(8)}{6+8} = \\frac{96}{14} \\approx 6.9 $ km/h. Or from the definition: $ t = \\frac{1}{6} + \\frac{1}{8} = \\frac{7}{24} $ h for 2 km, giving $ 2 \\div \\frac{7}{24} = \\frac{48}{7} \\approx 6.9 $ km/h.'),
            num('p2-y2', 'A teacher enters a 40 ft wide lecture theatre through a door at one corner at 12:00 noon, walks 10 lengths of the 40 ft wall back and forth, and finally leaves at 12:50 pm through the same door. Find his average speed and his average velocity.',
              'Average speed 16 ft/min; average velocity zero',
              'Ten lengths of 40 ft is 400 ft — but "back and forth" means he covers each length twice over the ten round trips, giving $ 800 $ ft of path in 50 minutes, so the average speed is $ 800/50 = 16 $ ft/min. He leaves through the same door he entered, so his displacement is zero and his average velocity is exactly zero.'),
            mcq('p2-y3', 'A car covers the first third of a distance at 20 km/h, the second third at 30 km/h and the last third at 60 km/h. Its average speed is:',
              ['30 km/h', '36.7 km/h', '40 km/h', '45 km/h'], 0,
              'Let each third be $ d $. The times are $ \\frac{d}{20} $, $ \\frac{d}{30} $ and $ \\frac{d}{60} $, adding to $ \\frac{3d+2d+d}{60} = \\frac{6d}{60} = \\frac{d}{10} $. So the average is $ 3d \\div \\frac{d}{10} = 30 $ km/h. The naive average of the three speeds would give $ 36.7 $, which is the trap.'),
            num('p2-y4', 'It is 260 km from one city to another by air and 320 km by road. An aeroplane takes 30 minutes for the flight; a bus takes 8 hours by road. Find (a) the average speed of the plane, (b) the average speed of the bus, (c) the average velocity of the plane, (d) the average velocity of the bus.',
              '(a) 520 km/h  (b) 40 km/h  (c) 520 km/h  (d) 32.5 km/h',
              'Average speed uses each vehicle\'s own path: plane $ 260 \\div 0.5 = 520 $ km/h, bus $ 320 \\div 8 = 40 $ km/h. Average velocity uses the **displacement**, which is the same 260 km straight-line separation for both: plane $ 260 \\div 0.5 = 520 $ km/h, bus $ 260 \\div 8 = 32.5 $ km/h. The plane\'s two answers agree because it flew straight; the bus\'s do not because the road bends.'),
            mcq('p2-y5', 'The average speed of a particle over some interval equals the magnitude of its average velocity. It follows that during that interval the particle:',
              ['Was at rest', 'Moved with constant speed', 'Never reversed its direction of motion', 'Moved with constant acceleration'], 2,
              'The two are equal exactly when path length equals the magnitude of displacement, and that happens precisely when the motion never doubles back. The particle may have sped up and slowed down as much as it liked — only reversal breaks the equality.'),
            num('p2-y6', 'When a person leaves home for sightseeing, the car odometer reads 12352 km. When he returns home after two hours, it reads 12416 km. Find (a) his average speed and (b) his average velocity.',
              '(a) 32 km/h  (b) zero',
              'The odometer measures path length: $ 12416 - 12352 = 64 $ km in 2 hours, so the average speed is 32 km/h. He returns **home**, so his displacement is zero and his average velocity is zero.'),
            mcq('p2-y7', 'A particle covers half the distance at 10 m/s and the other half at 10 m/s. Its average speed is:',
              ['10 m/s', '5 m/s', '20 m/s', 'Cannot be determined'], 0,
              'The harmonic mean of two equal speeds is that same speed: $ \\frac{2(10)(10)}{10+10} = \\frac{200}{20} = 10 $ m/s. It is worth doing this trivial case once — it shows the two mean formulas only differ when the speeds themselves differ.'),
          ],
        },
      ],
    }),
    b('text', 16, {
      markdown: 'An average tells you about a whole interval. It cannot tell you how fast something was moving **at a particular moment** — and a speedometer clearly can.\n\nSo what is a speedometer measuring? That is the next page, and the answer is one of the most important ideas in physics.',
    }),
  ],
};

// ── p3 · Instantaneous Velocity ──────────────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'instantaneous-velocity',
  title: 'Instantaneous Velocity',
  subtitle: 'Shrinking the interval until it becomes an instant',
  glossary: [
    { term: 'instantaneous velocity', definition: 'The velocity at one particular instant: the limit of the average velocity as the time interval shrinks to zero. Equal to dx/dt, the slope of the tangent to the x–t graph.' },
    { term: 'instantaneous speed', definition: 'The magnitude of the instantaneous velocity. This is what a speedometer reads.' },
    { term: 'tangent', definition: 'The straight line that just touches a curve at one point and matches its direction there.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'A speedometer reads 60 km/h. But velocity is displacement divided by time — and at a single instant, no time has passed and no displacement has happened. Zero divided by zero. So what, exactly, is the needle measuring?',
      hint: 'Try measuring over a small interval instead of no interval, then make it smaller.',
      reveal: 'The needle is measuring a **limit**.\n\nYou cannot divide by zero, but you can watch what the answer does as the interval you divide by gets smaller and smaller. If those answers settle down towards one particular number, that number is the velocity at the instant.\n\nThat is not a dodge. It is the single most useful idea in all of physics, and this page builds it from the ground up.',
    }),
    b('text', 1, {
      markdown: 'Let us do it with real numbers rather than words.\n\nA particle moves so that its position is given by $ x = 0.08\\, t^3 $, with $ x $ in metres and $ t $ in seconds. We want its velocity **at $ t = 4.0 $ s**.\n\nWe cannot get that directly. But we can compute the average velocity over an interval **centred on** $ t = 4.0 $ s, and then squeeze that interval.',
    }),
    b('table', 2, {
      caption: 'Average velocity over shrinking intervals centred on t = 4.0 s',
      headers: ['$ \\Delta t $ (s)', '$ t_1 $ (s)', '$ t_2 $ (s)', '$ x(t_1) $ (m)', '$ x(t_2) $ (m)', '$ \\Delta x $ (m)', '$ \\Delta x / \\Delta t $ (m/s)'],
      rows: [
        ['2.0', '3.0', '5.0', '2.16', '10.0', '7.84', '**3.92**'],
        ['1.0', '3.5', '4.5', '3.43', '7.29', '3.86', '**3.86**'],
        ['0.5', '3.75', '4.25', '4.21875', '6.14125', '1.9225', '**3.845**'],
        ['0.1', '3.95', '4.05', '4.93039', '5.31441', '0.38402', '**3.8402**'],
        ['0.01', '3.995', '4.005', '5.100824', '5.139224', '0.0384', '**3.8400**'],
      ],
    }),
    b('text', 3, {
      markdown: 'Look down the last column. The numbers are not wandering — they are **converging**: 3.92, 3.86, 3.845, 3.8402, 3.8400.\n\nThey are closing in on **3.84 m/s**. And they will keep closing in no matter how small you make $ \\Delta t $. That settled value is what we mean by the velocity at $ t = 4.0 $ s.',
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('In the table above, why do we take intervals **centred** on $ t = 4.0 $ s rather than starting at it?',
          ['It is the only way the limit is guaranteed to exist', 'It makes the values approach the limit faster and more symmetrically', 'Because the formula $ x = 0.08t^3 $ demands a centred interval', 'It is a mistake — the interval should start at 4.0 s'], 1,
          'Either choice converges to the same limit — that is what "limit" means. Centring simply lets the errors on each side partly cancel, so the numbers home in faster, which makes the pattern obvious in five rows instead of fifteen.', 3),
        q('Suppose we continued the table with $ \\Delta t = 0.001 $ s. The value of $ \\Delta x / \\Delta t $ would be closest to:',
          ['3.8400', '3.8000', '3.9200', '4.0000'], 0,
          'The values have already settled to 3.8400 at $ \\Delta t = 0.01 $ s. Shrinking the interval further can only refine that, not move it — the sequence has converged.', 2),
      ],
    }),
    b('heading', 5, {
      text: 'Why the average was never good enough',
      level: 2,
      objective: 'Explain why a chord\'s slope cannot be the velocity at an instant, and what replaces it.',
    }),
    b('text', 6, {
      markdown: 'It is worth being precise about what was wrong with the average.\n\nOn an x–t graph, the average velocity between two instants is the slope of the straight line joining those two points — the **chord**. That is a perfectly good number. But it describes the whole interval with one figure, and the curve is steeper at one end than at the other. The chord splits the difference and tells you about neither end.\n\nSo shrink the interval. As the second point slides towards the first, the chord pivots — and in the limit it becomes the line that just touches the curve at that one point: the **tangent**.',
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.6,
      questions: [
        q('The average velocity over an interval is the slope of which line on an x–t graph?',
          ['The tangent at the start of the interval', 'The chord joining the two end points', 'The tangent at the end of the interval', 'The horizontal axis'], 1,
          'An average uses only the two end positions and the elapsed time, which is exactly the rise-over-run of the straight line joining those two points — the chord. A tangent touches at a single instant and gives an instantaneous value instead.', 2),
        q('As the time interval is made smaller and smaller, the chord on an x–t graph:',
          ['Becomes horizontal in every case', 'Approaches the tangent at that point', 'Becomes vertical in every case', 'Stops existing altogether'], 1,
          'Shrinking the interval slides the second point towards the first, pivoting the chord until it just touches the curve at one point. That limiting line is the tangent, and its slope is the instantaneous velocity.', 2),
      ],
    }),
    b('image', 8, {
      src: '',
      alt: 'A curved x–t graph with three chords from the same point, each shorter than the last, converging onto the tangent line at that point.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-chord-to-tangent',
      caption: 'The chord pivots as the interval shrinks. In the limit it is the tangent, and its slope is the instantaneous velocity.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. A smooth upward-curving line on labelled axes, time along the horizontal and position along the vertical. From a single marked point on the curve, three straight chords are drawn to three other points progressively closer to it, drawn in faint grey, plus a fourth bold amber straight line that just touches the curve at the marked point. A small right-angled triangle on the bold line indicates its slope. Minimal, precise, schematic. Dark background with orange and amber accents only.',
    }),
    b('text', 8, {
      markdown: 'Written down, that is:\n\n$ v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt} $\n\nand read off a graph, it is:\n\n**Instantaneous velocity $ = $ the slope of the tangent to the x–t graph at that instant.**\n\nThat second statement is the one you will use hundreds of times. Every "read the velocity off this graph" question in every exam is asking you to estimate a tangent slope.',
    }),
    b('step_solver', 9, {
      title: 'From a position formula to a velocity',
      problem: 'The position of an object moving along the x-axis is given by $ x = a + bt^2 $, where $ a = 8.5 $ m, $ b = 2.5 $ m/s² and $ t $ is in seconds. What is its velocity at $ t = 0 $ and at $ t = 2.0 $ s? What is its average velocity between $ t = 2.0 $ s and $ t = 4.0 $ s?',
      intro: 'Two different questions in one problem — one about instants, one about an interval. Notice how differently you have to work.',
      steps: [
        st('$ v = \\frac{dx}{dt} = \\frac{d}{dt}\\left(a + bt^2\\right) = 2bt $',
          'Differentiate the position with respect to time. The constant $ a $ differentiates to zero — a fixed offset does not affect how fast anything is moving.', {
            check: {
              kind: 'mcq',
              prompt: 'Why does the constant $ a = 8.5 $ m disappear when we differentiate?',
              options: [
                'Because 8.5 is small',
                'Because a constant offset does not change with time, so it contributes nothing to the rate of change',
                'Because it has the wrong units',
                'It does not disappear — we dropped it by mistake',
              ],
              answer_index: 1,
              feedback_right: 'Exactly — it shifts where the origin is, and the origin is our choice.',
              feedback_wrong: 'The term $ a $ is the position at $ t = 0 $. Moving the origin changes it but changes nothing physical, so it cannot affect the velocity. Anything constant differentiates to zero.',
            },
          }),
        st('$ v = 2(2.5)t = 5.0\\, t $ m/s',
          'Substituting $ b = 2.5 $ m/s². So the velocity grows steadily with time.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Using $ v = 5.0t $, what is the velocity at $ t = 0 $, in m/s?',
              blank_answer: '0',
              feedback_right: 'Yes — it starts from rest.',
              feedback_wrong: 'Put $ t = 0 $ into $ v = 5.0t $ and you get $ v = 0 $. The object starts at rest at $ x = 8.5 $ m.',
            },
          }),
        st('at $ t = 0 $: $ v = 0 $ · at $ t = 2.0 $ s: $ v = 10\\ \\text{m/s} $',
          'Both are instantaneous velocities, read straight off the formula.', {
            why: 'These two numbers already tell you the object is speeding up — which is the subject of the next page but one.',
          }),
        st('$ \\bar{v} = \\frac{x(4.0) - x(2.0)}{4.0 - 2.0} = \\frac{(a + 16b) - (a + 4b)}{2.0} = \\frac{12b}{2.0} = 6b $',
          'The average velocity is a completely different calculation — positions at the two ends, divided by the elapsed time. Do **not** differentiate for this.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ 6b $ with $ b = 2.5 $ m/s². Give the answer in m/s.',
              blank_answer: '15',
              feedback_right: 'Yes — 15 m/s.',
              feedback_wrong: '$ 6 \\times 2.5 = 15 $ m/s.',
            },
          }),
        st('$ \\bar{v} = 15\\ \\text{m/s} $',
          'And notice: the instantaneous velocities at the two ends of that interval are $ 10 $ m/s and $ 20 $ m/s, and the average came out at exactly 15.', {
            why: 'That the average landed exactly halfway is not a coincidence — it happens here because the velocity grew at a *steady* rate. Page 9 turns that observation into a formula, $ \\bar{v} = \\frac{u+v}{2} $, and also tells you the one condition under which it is allowed.',
          }),
      ],
      now_you_try: {
        problem: 'A particle moves so that $ x = 3t^2 + 2t $ metres. Find its velocity at $ t = 1 $ s, and its average velocity between $ t = 1 $ s and $ t = 3 $ s.',
        answer: 'Velocity at $ t = 1 $ s is 8 m/s; average velocity from 1 s to 3 s is 14 m/s.',
        solution: 'Differentiate: $ v = \\frac{dx}{dt} = 6t + 2 $, so at $ t = 1 $ s, $ v = 8 $ m/s. For the average, use positions: $ x(1) = 3 + 2 = 5 $ m, $ x(3) = 27 + 6 = 33 $ m, so $ \\bar{v} = \\frac{33 - 5}{3 - 1} = \\frac{28}{2} = 14 $ m/s.',
      },
    }),
    b('step_solver', 10, {
      title: 'Confirming the table with calculus',
      problem: 'The table above suggested that for $ x = 0.08\\,t^3 $ the velocity at $ t = 4.0 $ s is 3.84 m/s. Get that number exactly, without any table.',
      intro: 'The table was evidence. This is proof — and it takes three lines instead of five rows of arithmetic.',
      steps: [
        st('$ v = \\frac{dx}{dt} = \\frac{d}{dt}\\left(0.08\\,t^3\\right) $',
          'Instantaneous velocity is the derivative of position with respect to time.', {
            check: {
              kind: 'mcq',
              prompt: 'Differentiating $ t^3 $ with respect to $ t $ gives:',
              options: ['$ 3t^2 $', '$ t^2 $', '$ 3t $', '$ \\frac{t^4}{4} $'],
              answer_index: 0,
              feedback_right: 'Yes — bring the power down and reduce it by one.',
              feedback_wrong: 'The rule is: bring the power down as a multiplier, then reduce the power by one. So $ t^3 $ becomes $ 3t^2 $. ($ t^4/4 $ is what you get if you integrate it instead.)',
            },
          }),
        st('$ v = 0.08 \\times 3t^2 = 0.24\\,t^2 $',
          'The constant 0.08 just comes along for the ride.', {
            why: 'Notice this is a formula for the velocity at *every* instant, not just at $ t = 4 $ s. One differentiation replaced an infinite number of tables.',
          }),
        st('at $ t = 4.0 $ s: $ v = 0.24 \\times 16 $',
          'Now substitute the instant we want.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ 0.24 \\times 16 $. Give the answer in m/s.',
              blank_answer: '3.84',
              feedback_right: 'Yes — exactly the value the table was creeping towards.',
              feedback_wrong: '$ 0.24 \\times 16 = 3.84 $ m/s, which is precisely the number the shrinking intervals were converging on.',
            },
          }),
        st('$ v = 3.84\\ \\text{m/s} $',
          'The same answer the table was approaching — but arrived at exactly, in one step.', {
            why: 'This is why calculus is worth the trouble. The table could only ever get *close* to 3.84; the derivative lands on it. Everything you learned about differentiation in Chapter 0 exists for exactly this moment.',
          }),
      ],
      now_you_try: {
        problem: 'For the same particle, $ x = 0.08\\,t^3 $. Find its velocity at $ t = 2.0 $ s and at $ t = 6.0 $ s.',
        answer: '0.96 m/s and 8.64 m/s',
        solution: 'Using $ v = 0.24\\,t^2 $: at $ t = 2.0 $ s, $ v = 0.24(4) = 0.96 $ m/s; at $ t = 6.0 $ s, $ v = 0.24(36) = 8.64 $ m/s. The particle is speeding up rapidly — tripling the time multiplied the velocity by nine, because the velocity depends on $ t^2 $.',
      },
    }),
    b('step_solver', 92, {
      title: 'Average over an interval, velocity at an instant',
      problem: 'A particle has $ x = 3t^2 - 2t $ metres. Find (a) its average velocity between $ t = 1 $ s and $ t = 3 $ s, and (b) its instantaneous velocity at each of those two instants.',
      intro: 'Three answers from one formula, by two completely different routes. Knowing which route a question is asking for is most of the skill.',
      steps: [
        st('$ x(1) = 3 - 2 = 1\\ \\text{m} $ and $ x(3) = 27 - 6 = 21\\ \\text{m} $',
          'For an average, all you need is where the particle was at each end of the interval. The route between them is irrelevant.', {
            check: {
              kind: 'mcq',
              prompt: 'Which operation gives the average velocity from these two positions?',
              options: ['Differentiate the position formula', 'Divide the change in position by the elapsed time', 'Substitute $ t = 2 $ into the velocity formula', 'Average the two positions'],
              answer_index: 1,
              feedback_right: 'Yes \u2014 change in position over change in time.',
              feedback_wrong: 'An average velocity is displacement over elapsed time, so divide the change in position by the change in time. Differentiating would give an *instantaneous* velocity instead.',
            },
          }),
        st('$ \\bar{v} = \\dfrac{21 - 1}{3 - 1} = 10\\ \\text{m/s} $',
          'That is part (a) done \u2014 and note we never differentiated anything.', {
            why: 'A trap worth naming: substituting the midpoint $ t = 2 $ into the velocity formula also gives 10 m/s here. That is a coincidence of this particular motion, not a method \u2014 it works only when the velocity changes at a steady rate.',
          }),
        st('$ v = \\dfrac{dx}{dt} = 6t - 2 $',
          'Now part (b) \u2014 a different question, so a different tool. Differentiate.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ v = 6t - 2 $ at $ t = 1 $ s. Give the answer in m/s.',
              blank_answer: '4',
              feedback_right: 'Yes \u2014 4 m/s.',
              feedback_wrong: '$ 6(1) - 2 = 4 $ m/s.',
            },
          }),
        st('at $ t = 1 $ s: $ v = 4 $ m/s \u00b7 at $ t = 3 $ s: $ v = 16 $ m/s',
          'So the particle sped up from 4 m/s to 16 m/s, and its average over the interval was 10 m/s.', {
            why: 'And 10 is exactly halfway between 4 and 16 \u2014 which happens here because the velocity grew at a constant rate. Page 9 turns that into $ \\bar{v} = \\frac{u+v}{2} $, and states the one condition under which you may use it.',
          }),
      ],
      now_you_try: {
        problem: 'A particle has $ x = t^3 $ metres. Find its average velocity between $ t = 0 $ and $ t = 2 $ s, and its instantaneous velocity at $ t = 2 $ s.',
        answer: 'Average $ 4 $ m/s; instantaneous $ 12 $ m/s.',
        solution: 'Average: $ x(0) = 0 $ and $ x(2) = 8 $ m, so $ \\bar{v} = 8/2 = 4 $ m/s. Instantaneous: $ v = 3t^2 $, so at $ t = 2 $ s, $ v = 12 $ m/s. Here the instantaneous value is three times the average \u2014 nothing like halfway, because this velocity does **not** grow at a steady rate.',
      },
    }),
    b('step_solver', 93, {
      title: 'Reading a tangent slope off a graph',
      problem: 'On an x\u2013t graph, the tangent drawn at $ t = 6 $ s passes through the points $ (2\\ \\text{s},\\ 4\\ \\text{m}) $ and $ (8\\ \\text{s},\\ 22\\ \\text{m}) $. What is the particle\u2019s velocity at $ t = 6 $ s?',
      intro: 'No formula for $ x $ is given, and none is needed. This is the version of the question you will actually meet in an exam.',
      steps: [
        st('The tangent\u2019s slope IS the instantaneous velocity at the point of contact.',
          'So the whole problem reduces to finding the slope of one straight line.', {
            check: {
              kind: 'mcq',
              prompt: 'Do the two given points have to lie on the curve?',
              options: [
                'Yes, both must lie on the curve',
                'No \u2014 they are points on the tangent, which touches the curve only at $ t = 6 $ s',
                'Only the first one must lie on it',
                'It makes no difference either way',
              ],
              answer_index: 1,
              feedback_right: 'Exactly. Any two points on the tangent give its slope.',
              feedback_wrong: 'They are points on the **tangent**, not on the curve. A tangent meets the curve at just one point \u2014 here $ t = 6 $ s \u2014 and runs clear of it either side. Any two of its own points will do.',
            },
          }),
        st('$ v = \\dfrac{22 - 4}{8 - 2} $',
          'Rise over run, using the two points we were handed.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\frac{18}{6} $. Give the answer in m/s.',
              blank_answer: '3',
              feedback_right: 'Yes \u2014 3 m/s.',
              feedback_wrong: '$ (22-4)/(8-2) = 18/6 = 3 $ m/s.',
            },
          }),
        st('$ v = 3\\ \\text{m/s} $ at $ t = 6 $ s',
          'Positive, so at that instant the particle moves in the positive direction at 3 metres every second.', {
            why: 'In an exam you will usually have to draw the tangent yourself, by eye, then pick two points on it. Choose points far apart and on gridline crossings \u2014 a short tangent read between two awkward points is where the marks go.',
          }),
      ],
      now_you_try: {
        problem: 'A tangent to an x\u2013t graph at $ t = 4 $ s passes through $ (1\\ \\text{s},\\ 14\\ \\text{m}) $ and $ (7\\ \\text{s},\\ 2\\ \\text{m}) $. Find the velocity at $ t = 4 $ s and describe the motion there.',
        answer: '$ v = -2 $ m/s \u2014 moving in the negative direction at 2 m/s.',
        solution: 'Slope $ = \\frac{2 - 14}{7 - 1} = \\frac{-12}{6} = -2 $ m/s. The negative sign says the particle travels in the negative direction at that instant. A tangent sloping downward always means a negative velocity.',
      },
    }),
    b('heading', 11, {
      text: 'Instantaneous speed behaves better than average speed',
      level: 2,
      objective: 'Explain why instantaneous speed always equals the magnitude of instantaneous velocity.',
    }),
    b('text', 11, {
      markdown: 'On page 2 we were careful: average speed and the magnitude of average velocity are **not** the same thing.\n\nAt an instant, that caution disappears. Instantaneous speed is always exactly the magnitude of instantaneous velocity, with no exceptions.\n\nWhy the difference? Because the gap between path length and displacement only opens up when the object **reverses**. Over a vanishingly small interval there is no room to reverse — so path length and $ |$displacement$| $ become the same thing, and the two limits coincide.',
    }),
    b('reasoning_prompt', 12, {
      reasoning_type: 'logical',
      prompt: 'A car\'s speedometer reads a steady 40 km/h for ten minutes. Can you say what the car\'s average velocity was over those ten minutes? Can you even say whether it was zero?',
      reveal: 'No, and no — not without more information.\n\nA speedometer reads **speed**, which is a magnitude. It has no idea which way the car is pointing. The driver could have gone in a straight line for ten minutes, in which case the average velocity has magnitude 40 km/h. Or the driver could have gone five minutes out and five minutes back along the same road, in which case the displacement is zero and so is the average velocity.\n\nBoth journeys look identical to the speedometer. This is exactly why physics keeps two words where everyday speech uses one — and why a speed can be constant while a velocity is changing every second.',
      difficulty_level: 3,
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.6,
      questions: [
        q('The instantaneous velocity of a particle at time $ t $ equals:',
          ['The slope of the chord on the x–t graph', 'The slope of the tangent to the x–t graph at that instant', 'The area under the x–t graph up to that instant', 'The x-coordinate at that instant'], 1,
          'A chord\'s slope gives an average over a finite interval. Shrinking that interval to zero pivots the chord onto the tangent, and the tangent\'s slope is the instantaneous velocity. Area under an x–t graph has no physical meaning at all.', 2),
        q('For a particle in one-dimensional motion, which statement is correct?',
          ['Instantaneous speed is always equal to the magnitude of instantaneous velocity', 'Average speed is always equal to the magnitude of average velocity', 'Both of the above', 'Neither of the above'], 0,
          'Over an interval, a reversal makes path length exceed the displacement, so the average versions can differ. At an instant there is no room to reverse, so the instantaneous versions must agree exactly.', 2),
        q('A particle has $ x = 5t^2 $ metres. Its velocity at $ t = 3 $ s is:',
          ['30 m/s', '45 m/s', '15 m/s', '10 m/s'], 0,
          'Differentiating gives $ v = 10t $, so at $ t = 3 $ s the velocity is 30 m/s. Getting 15 m/s means dividing the position $ x(3) = 45 $ m by 3 s — that is the *average* velocity since $ t = 0 $, not the velocity at $ t = 3 $ s.', 2),
      ],
    }),
    b('callout', 14, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ v = \\displaystyle\\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt} $\n- On an x–t graph: **average velocity is a chord slope, instantaneous velocity is a tangent slope.**\n- Instantaneous speed $ = |$instantaneous velocity$| $ **always** — unlike the averages.\n- To find an instantaneous velocity, differentiate. To find an average velocity, use the two end positions. Mixing up which is which is the most common error on this page.',
    }),
    b('practice_bank', 15, {
      title: 'You solve it',
      intro: 'Seven questions. Every time you see the word "at", think tangent and differentiate; every time you see "between" or "during", think chord and use end points.',
      sections: [
        {
          id: 'p3-ysi',
          title: 'Instants, intervals and tangents',
          items: [
            num('p3-y1', 'The distance travelled by a particle in time $ t $ is $ s = (2.5\\ \\text{m/s}^2)\\, t^2 $. Find (a) the average speed between $ t = 0 $ and $ t = 5.0 $ s, and (b) the instantaneous speed at $ t = 5.0 $ s.',
              '(a) 12.5 m/s  (b) 25 m/s',
              '(a) At $ t = 5.0 $ s, $ s = 2.5(25) = 62.5 $ m, so the average speed is $ 62.5 \\div 5.0 = 12.5 $ m/s. (b) Differentiating, $ \\frac{ds}{dt} = 5.0\\,t $, so at $ t = 5.0 $ s the instantaneous speed is 25 m/s. The instantaneous value is exactly twice the average, because the speed grew steadily from zero.'),
            mcq('p3-y2', 'The position of a particle is $ x = 4 + 3t - t^2 $ metres. At what time is the particle instantaneously at rest?',
              ['$ t = 1.5 $ s', '$ t = 3 $ s', '$ t = 0 $ s', 'It is never at rest'], 0,
              'At rest means $ v = 0 $. Differentiating, $ v = 3 - 2t $, which is zero when $ t = 1.5 $ s. At that instant the particle is momentarily stationary before reversing — but note its acceleration is not zero there.'),
            num('p3-y3', 'A particle moves with $ x = 2t^3 - 3t^2 + 4 $ metres. Find its velocity at $ t = 2 $ s.',
              '12 m/s',
              'Differentiate term by term: $ v = \\frac{dx}{dt} = 6t^2 - 6t $. At $ t = 2 $ s, $ v = 6(4) - 6(2) = 24 - 12 = 12 $ m/s.'),
            mcq('p3-y4', 'On an x–t graph, a horizontal tangent at some instant means that at that instant the particle:',
              ['Is at the origin', 'Is momentarily at rest', 'Has zero acceleration', 'Is moving at maximum speed'], 1,
              'The tangent slope *is* the velocity, so a horizontal tangent means zero velocity — momentarily at rest. It says nothing about where the particle is or what its acceleration is doing; a ball at the top of its flight has exactly this graph and a non-zero acceleration.'),
            num('p3-y5', 'A particle has $ x = 20 + t^3 - 12t $ (SI units). Find (a) its position at $ t = 0 $, (b) its velocity at $ t = 0 $, and (c) the position at which its velocity is zero.',
              '(a) 20 m  (b) $ -12 $ m/s  (c) $ x = 4 $ m',
              '(a) Put $ t = 0 $ into the position: $ x = 20 $ m. (b) $ v = \\frac{dx}{dt} = 3t^2 - 12 $, so at $ t = 0 $, $ v = -12 $ m/s — it starts by moving in the negative direction. (c) $ v = 0 $ gives $ 3t^2 = 12 $, so $ t = 2 $ s (taking the positive root), and then $ x = 20 + 8 - 24 = 4 $ m.'),
            mcq('p3-y6', 'A particle\'s x–t graph is a straight line with positive slope. Which statement is true?',
              ['Its instantaneous velocity equals its average velocity at every instant', 'Its velocity increases steadily with time throughout the motion', 'Its acceleration is positive and constant throughout', 'It is momentarily at rest at the start of the motion'], 0,
              'A straight line has the same slope everywhere, so the tangent slope at any instant equals the chord slope over any interval. That is exactly the statement that instantaneous and average velocity coincide — the definition of uniform motion.'),
            num('p3-y7', 'The velocity of a particle is given by $ v = (3 + 6t + 9t^2) $ cm/s. Find the displacement of the particle during the interval $ t = 5 $ s to $ t = 8 $ s.',
              '1287 cm',
              'Displacement is the integral of velocity: $ \\int_5^8 (3 + 6t + 9t^2)\\,dt = \\left[3t + 3t^2 + 3t^3\\right]_5^8 $. At $ t = 8 $: $ 24 + 192 + 1536 = 1752 $. At $ t = 5 $: $ 15 + 75 + 375 = 465 $. The difference is $ 1752 - 465 = 1287 $ cm. (This is the reverse operation — page 7 explains why it works.)'),
          ],
        },
      ],
    }),
    b('text', 16, {
      markdown: 'You now have the definition. But almost no exam question hands you a formula for $ x $ — most of them hand you a **graph**.\n\nSo the next page is entirely about reading motion off a picture, without a single equation.',
    }),
  ],
};

// ── p4 · Reading an x–t Graph ────────────────────────────────────────────────
const p4 = {
  page_number: 4,
  slug: 'reading-an-x-t-graph',
  title: 'Reading an x–t Graph',
  subtitle: 'Everything the picture tells you, before any formula',
  glossary: [
    { term: 'x–t graph', definition: 'A graph of position against time. Its slope at any instant is the velocity at that instant.' },
    { term: 'uniform motion', definition: 'Motion at constant velocity. Its x–t graph is a straight line.' },
  ],
  blocks: [
    b('curiosity_prompt', 0, {
      prompt: 'Two children, A and B, walk home from the same school. Their position–time graphs are two straight lines. A\'s line starts at the origin and is less steep; B\'s line starts later, is steeper, and ends higher up. From those two lines alone: who lives closer to school, who left first, who walks faster, and does either overtake the other?',
      hint: 'Take the four questions one at a time, and decide which feature of the line answers each.',
      reveal: '**A lives closer** — A\'s line ends at a lower position, so A\'s home is nearer to the school.\n\n**A left earlier** — A\'s line starts at $ t = 0 $, B\'s starts later.\n\n**B walks faster** — B\'s line is steeper, and steepness is speed.\n\n**B overtakes A, once** — the two lines cross exactly once, and at that instant both children are at the same position at the same time. That is what an overtake *is* on this graph.\n\nFour physical facts, and you did not write down a single equation. That is what this page is for.',
    }),
    b('image', 1, {
      src: '',
      alt: 'Two straight position–time lines from a common origin region: line A less steep from t=0 to a lower final position P, line B steeper starting later and ending at a higher position Q, crossing A once.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-two-children',
      caption: 'Two children walking home. Every question you can ask about this journey is answered by a feature of these two lines.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background. Axes with time along the horizontal and position along the vertical, both labelled with simple arrows. Two straight lines: one starting at the origin with a gentle slope ending at a marked level labelled P, and a second steeper line starting further along the time axis and ending at a higher marked level labelled Q. The two lines cross at one clearly marked point. Minimal, precise, schematic. Dark background with orange and amber accents only.',
    }),
    b('heading', 2, {
      text: 'The five things a position–time graph tells you',
      level: 2,
      objective: 'Extract velocity, direction, rest and meetings directly from an x–t graph.',
    }),
    b('table', 3, {
      caption: 'How to read an x–t graph',
      headers: ['What you see', 'What it means'],
      rows: [
        ['The **slope** at a point', 'The velocity at that instant'],
        ['A **steeper** line', 'A faster motion'],
        ['A **positive** slope', 'Moving in the positive direction'],
        ['A **negative** slope', 'Moving in the negative direction'],
        ['A **horizontal** line', 'At rest — the position is not changing'],
        ['Two graphs **crossing**', 'Both objects at the same place at the same time — a meeting or an overtake'],
        ['The **height** of the curve', 'The position — not the distance travelled'],
      ],
    }),
    b('callout', 4, {
      variant: 'warning',
      title: 'The single biggest misconception in this chapter',
      markdown: '**An x–t graph is not a picture of the journey.**\n\nIf the graph goes up and then comes down, that does **not** mean the object went up a hill and came down again. It means the object moved in the positive direction, stopped, and came back the other way — along a perfectly flat straight line the whole time.\n\nThe horizontal axis is **time**, not distance. Nothing on this graph is a map. Every time you look at one, say to yourself: *the object is on a line; this picture is a record of where it was, moment by moment.*',
    }),
    b('inline_quiz', 94, {
      pass_threshold: 0.6,
      questions: [
        q('On an x\u2013t graph, the height of the curve above the time axis tells you:',
          ['How fast the object is moving', 'Where the object is', 'How far the object has travelled', 'How long it has been moving'], 1,
          'Height is position. Speed is the *slope*, and distance travelled is something you have to work out by following the curve \u2014 a curve that goes up and comes back down covers ground while returning to its starting height.', 2),
        q('Two x\u2013t graphs have the same slope at some instant but sit at different heights. At that instant the two particles have:',
          ['The same position, different velocities', 'The same velocity, different positions', 'The same velocity and the same position', 'Neither in common'], 1,
          'Slope is velocity, so equal slopes mean equal velocities. Different heights mean they are in different places. Keeping height and slope separate is most of what reading these graphs is.', 2),
      ],
    }),
    b('image', 5, {
      src: '',
      alt: 'Left panel: a straight horizontal road with a marker moving right, stopping, and returning. Right panel: the corresponding x–t graph, a line rising, flattening and falling.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-road-vs-graph',
      caption: 'The same journey twice: the road on the left, its x–t graph on the right. The graph rises and falls; the road never does.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background, split into two side-by-side panels separated by a thin hairline. Left panel: a perfectly straight horizontal road line with a small glowing marker on it and three faint ghost positions showing it moving right, pausing, then returning left. Right panel: a set of axes with time horizontal and position vertical, carrying a line that rises, then runs flat, then falls. Minimal, precise, schematic, no text labels beyond the axis arrows. Dark background with orange and amber accents only.',
    }),
    b('step_solver', 6, {
      title: 'Reading a velocity off a straight line',
      problem: 'A particle moving along the x-axis has a straight-line x–t graph passing through $ x = -20 $ m at $ t = 0 $ and through $ x = 0 $ at $ t = 10 $ s. Describe its motion completely.',
      intro: 'Straight line means one constant velocity, so the whole motion is captured by one number. Find it and describe what it means.',
      steps: [
        st('The graph is a straight line, so the slope is the same everywhere.',
          'That is the first and most important observation. A constant slope means a constant velocity — uniform motion.', {
            check: {
              kind: 'mcq',
              prompt: 'What does a straight-line x–t graph tell you about the acceleration?',
              options: ['It is constant and positive', 'It is zero', 'It is constant and negative', 'It cannot be determined'],
              answer_index: 1,
              feedback_right: 'Right — constant velocity means the velocity is not changing, so the acceleration is zero.',
              feedback_wrong: 'The slope is the velocity. A straight line has a constant slope, so the velocity never changes — and an unchanging velocity means zero acceleration.',
            },
          }),
        st('$ v = \\text{slope} = \\frac{\\Delta x}{\\Delta t} = \\frac{0 - (-20)}{10 - 0} $',
          'Take any two points on the line and compute rise over run. Here the two given points are the convenient ones.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\frac{0 - (-20)}{10 - 0} $. Give the number in m/s.',
              blank_answer: '2',
              feedback_right: 'Yes — $ +20 $ metres in 10 seconds.',
              feedback_wrong: 'Careful with the double negative on the top: $ 0 - (-20) = +20 $, and $ 20 \\div 10 = 2 $ m/s.',
            },
          }),
        st('$ v = +2\\ \\text{m/s} $',
          'Positive, so the particle moves steadily in the positive x-direction at 2 metres every second.', {
            why: 'The sign came out of the arithmetic, not out of a guess. That is the advantage of always writing slope as (final minus initial) over (final minus initial) — the sign takes care of itself.',
          }),
        st('At $ t = 0 $ it is at $ x = -20 $ m; at $ t = 10 $ s it is at the origin.',
          'Finally, describe it in words: the particle starts 20 m on the negative side, moves steadily towards the origin, and reaches it after 10 s — continuing past it afterwards.', {
            why: 'A graph that starts below the axis is not "negative motion" — the particle is simply on the far side of wherever you put your origin. It is moving positively the whole time.',
          }),
      ],
      now_you_try: {
        problem: 'Another particle has a straight x–t graph passing through $ x = 10 $ m at $ t = 0 $ and reaching $ x = 0 $ at $ t = 5 $ s. Find its velocity and describe the motion.',
        answer: '$ v = -2 $ m/s — it moves steadily in the negative direction, reaching the origin after 5 s.',
        solution: 'Slope $ = \\frac{0 - 10}{5 - 0} = -2 $ m/s. The negative sign means it travels in the negative x-direction at a steady 2 m/s, starting 10 m out on the positive side and arriving at the origin at $ t = 5 $ s.',
      },
    }),
    b('step_solver', 7, {
      title: 'A graph with three different phases',
      problem: 'The x-coordinate of a particle varies with time as follows: it rises steadily from $ 0 $ to $ 50 $ m between $ t = 0 $ and $ t = 2.5 $ s, stays at $ 50 $ m until $ t = 7.5 $ s, rises to $ 100 $ m at $ t = 10.0 $ s, then falls steadily to $ 0 $ at $ t = 15.0 $ s. Find (a) the average velocity over the first 10 s, and (b) the instantaneous velocity at $ t = 2 $, $ 5 $, $ 8 $ and $ 12 $ s.',
      intro: 'Four instantaneous velocities and one average. Notice how differently you get them — and that one of them is zero and one is negative.',
      steps: [
        st('$ \\bar{v} = \\frac{x(10) - x(0)}{10 - 0} = \\frac{100 - 0}{10} = 10\\ \\text{m/s} $',
          'For an average, ignore everything in the middle. Only the two end positions and the elapsed time matter.', {
            check: {
              kind: 'mcq',
              prompt: 'Does the 5-second pause between 2.5 s and 7.5 s affect this average velocity?',
              options: [
                'No — averages only use the end points',
                'Yes — it lowers the average velocity',
                'Yes — it raises the average velocity',
                'Only if the particle also reverses',
              ],
              answer_index: 1,
              feedback_right: 'Yes, it does lower it — the pause adds time to the denominator without adding any displacement.',
              feedback_wrong: 'The end positions fix the numerator, but the pause is part of the elapsed time in the denominator. Time spent standing still still counts, so it drags the average velocity down.',
            },
          }),
        st('at $ t = 2 $ s: slope $ = \\frac{50 - 0}{2.5 - 0} = 20\\ \\text{m/s} $',
          'For an instantaneous velocity, find which straight segment the instant lies on and take that segment\'s slope. At $ t = 2 $ s we are on the first segment.', {
            why: 'On a graph made of straight segments, "the tangent" is just the segment itself. That is why piecewise-linear graphs are the easiest kind to read — and why examiners use them so much.',
          }),
        st('at $ t = 5 $ s: slope $ = 0 $, so $ v = 0 $',
          'At 5 s we are on the flat part. A horizontal line means the position is not changing — the particle is at rest.', {
            check: {
              kind: 'mcq',
              prompt: 'On the flat segment the particle is at $ x = 50 $ m. What is its velocity there?',
              options: ['50 m/s', '0', '20 m/s', 'It cannot be determined from a flat line'],
              answer_index: 1,
              feedback_right: 'Right — flat means not moving, whatever height the line sits at.',
              feedback_wrong: 'The *height* of the line is the position, 50 m. The *slope* is the velocity, and a horizontal line has zero slope. The particle is sitting still at the 50 m mark.',
            },
          }),
        st('at $ t = 8 $ s: slope $ = \\frac{100 - 50}{10.0 - 7.5} = 20\\ \\text{m/s} $',
          'Back to moving, on the third segment, and at the same speed as the first.', {
            why: 'Equal slopes mean equal velocities, even though the two segments sit at completely different heights on the graph. Height is position; slope is velocity. Keep them separate.',
          }),
        st('at $ t = 12 $ s: slope $ = \\frac{0 - 100}{15.0 - 10.0} = -20\\ \\text{m/s} $',
          'The final segment falls, so its slope is negative — the particle is returning towards the origin at 20 m/s.', {
            why: 'The particle covers ground at 20 m/s on three separate segments, but with different signs. Its *speed* is 20 m/s on all three; its *velocity* is $ +20 $, $ +20 $ and $ -20 $ m/s. This is the clearest possible illustration of why physics keeps both words.',
          }),
      ],
      now_you_try: {
        problem: 'For the same graph, what is the average velocity over the whole 15 s, and what is the average speed?',
        answer: 'Average velocity $ = 0 $; average speed $ = \\frac{200}{15} \\approx 13.3 $ m/s.',
        solution: 'The particle finishes at $ x = 0 $, exactly where it began, so its displacement over 15 s is zero and its average velocity is zero. But the path length is $ 50 + 0 + 50 + 100 = 200 $ m, so the average speed is $ 200/15 \\approx 13.3 $ m/s. Same graph, two very different honest answers.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A displacement–time graph rises as a straight line up to a time $ t_0 $ and is horizontal after that. This means the particle:',
          ['Is continuously going in the positive direction', 'Is at rest throughout', 'Moves at constant velocity up to $ t_0 $ and then stops', 'Speeds up until $ t_0 $ and then slows down'], 2,
          'A straight rising segment means a constant positive velocity; a horizontal segment means zero velocity. So the particle moves uniformly until $ t_0 $ and then stops, staying at the position it had reached.', 2),
        q('Two x–t graphs cross at one point. At that instant, the two particles have the same:',
          ['Velocity', 'Position', 'Acceleration', 'Speed'], 1,
          'A crossing means both graphs give the same value of $ x $ at the same value of $ t $ — same place, same moment. Their slopes at that point are generally different, so their velocities are different; that difference is exactly why one overtakes the other.', 2),
        q('On an x–t graph, a segment sloping downwards means the particle is:',
          ['Slowing down as it moves forward', 'Moving in the negative direction', 'Below ground level', 'Decelerating steadily'], 1,
          'A negative slope is a negative velocity, which means motion in the negative direction. It says nothing about speeding up or slowing down — that depends on how the slope is changing, not on its sign.', 2),
      ],
    }),
    b('step_solver', 9, {
      title: 'Two travellers on one graph',
      problem: 'On one x–t plot, car A starts at $ x = 0 $ at $ t = 0 $ and moves at a steady $ 15 $ m/s. Car B starts at $ x = 60 $ m at $ t = 0 $ and moves at a steady $ 10 $ m/s in the same direction. When and where does A overtake B?',
      intro: 'Two straight lines, one crossing. You can do this with graphs or with algebra — do it both ways once, and afterwards you will be able to see the answer in the picture.',
      steps: [
        st('$ x_A = 15t $ · $ x_B = 60 + 10t $',
          'Write each line as a position that grows with time. The starting position is the intercept; the speed is the slope.', {
            check: {
              kind: 'mcq',
              prompt: 'On the graph, what does the crossing of the two lines represent physically?',
              options: [
                'The two cars have the same speed',
                'The two cars are at the same position at the same time',
                'One car stops',
                'The two cars have the same acceleration',
              ],
              answer_index: 1,
              feedback_right: 'Exactly — same $ x $, same $ t $. That is what overtaking means.',
              feedback_wrong: 'A crossing means both graphs give the same value of $ x $ at the same value of $ t $ — the cars are side by side. Their *slopes* there are different, which is precisely why one passes the other.',
            },
          }),
        st('$ 15t = 60 + 10t $',
          'Overtaking means the two positions are equal, so set the two expressions equal to each other.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Solve $ 15t = 60 + 10t $ for $ t $. Give the answer in seconds.',
              blank_answer: '12',
              feedback_right: 'Yes — $ 5t = 60 $, so $ t = 12 $ s.',
              feedback_wrong: 'Subtract $ 10t $ from both sides to get $ 5t = 60 $, so $ t = 12 $ s.',
            },
          }),
        st('$ t = 12\\ \\text{s} $, and $ x = 15(12) = 180\\ \\text{m} $',
          'Substitute back into either expression — using both is a free check that you have not slipped.', {
            why: 'Check with the other one: $ x_B = 60 + 10(12) = 180 $ m. They agree, so the answer is right. Getting two different numbers here means an arithmetic error, and it costs three seconds to find out.',
          }),
        st('A closes the 60 m gap at $ 15 - 10 = 5 $ m/s, so it takes $ 60 \\div 5 = 12 $ s.',
          'And here is the same answer in one line, by thinking about the gap rather than the two positions.', {
            why: 'This shortcut is worth remembering: when two objects move along the same line, only the **difference** of their velocities decides when they meet. That idea has a name — relative velocity — and it gets a page of its own later in this chapter.',
          }),
      ],
      now_you_try: {
        problem: 'Cyclist P starts from the origin at $ t = 0 $ and rides at 8 m/s. Cyclist Q starts from $ x = 40 $ m at the same instant and rides at 4 m/s in the same direction. When and where does P catch Q?',
        answer: 'At $ t = 10 $ s, at $ x = 80 $ m.',
        solution: 'The gap is 40 m and it closes at $ 8 - 4 = 4 $ m/s, so it takes $ 40 \\div 4 = 10 $ s. At that moment P is at $ 8(10) = 80 $ m — and so is Q, at $ 40 + 4(10) = 80 $ m.',
      },
    }),
    b('heading', 10, {
      text: 'Two graphs that cannot exist',
      level: 2,
      objective: 'Recognise x–t and v–t graphs that are physically impossible, and say why.',
    }),
    b('text', 10, {
      markdown: 'Some shapes are ruled out by physics itself, and questions love to hide them among plausible options.\n\n**A vertical segment is impossible.** A vertical piece of an x–t graph would mean the object changed position while no time passed — infinite velocity. The same argument on a v–t graph gives infinite acceleration.\n\n**A double-valued graph is impossible.** If a vertical line drawn at some time $ t $ cuts the curve twice, the object was in two places at that one instant. Objects do not do that.',
    }),
    b('image', 11, {
      src: '',
      alt: 'Two crossed-out graphs: one x–t curve with a vertical jump, and one x–t curve that loops back so a vertical line cuts it twice.',
      aspect_ratio: '16:9',
      figure_key: 'ch2-impossible-graphs',
      caption: 'Neither of these can describe a real object: the first needs infinite velocity, the second needs the object to be in two places at once.',
      generation_prompt: 'Clean technical diagram on a very dark near-black background, two side-by-side panels separated by a thin hairline. Left panel: axes with a rising curve that contains one perfectly vertical jump segment, with a small crossed-circle marker beside the vertical part. Right panel: axes with a curve that loops back on itself so that a faint dashed vertical line drawn through it intersects it at two points, both intersections marked. Minimal, precise, schematic. Dark background with orange and amber accents only.',
    }),
    b('classify_exercise', 12, {
      question: 'Which of these graphs could describe the one-dimensional motion of a real particle?',
      column_label: 'Proposed graph',
      verdict_label: 'Possible?',
      yes_label: '✓ Possible',
      no_label: '✗ Impossible',
      rows: [
        { substance: 'An x–t graph that is a horizontal straight line', is_solution: true, explanation: 'Possible — the particle is simply at rest at a fixed position.' },
        { substance: 'An x–t graph containing a vertical segment', is_solution: false, explanation: 'Impossible. Position would change while no time passed, which needs infinite velocity.' },
        { substance: 'An x–t graph shaped like a closed loop', is_solution: false, explanation: 'Impossible. A loop is double-valued in time, so the particle would be in two places at the same instant.' },
        { substance: 'An x–t graph that rises, flattens, then falls below the time axis', is_solution: true, explanation: 'Possible — the particle moves out, pauses, then returns past its starting point into negative positions.' },
        { substance: 'A v–t graph containing a vertical segment', is_solution: false, explanation: 'Impossible. The velocity would change instantly, which needs infinite acceleration. Real velocities are continuous.' },
        { substance: 'A v–t graph that dips below the time axis and comes back up', is_solution: true, explanation: 'Possible — the particle reverses direction and then reverses again. Negative velocity is perfectly ordinary.' },
        { substance: 'A speed–time graph that goes below the time axis', is_solution: false, explanation: 'Impossible. Speed is a magnitude, so it can be zero but never negative. (A *velocity*–time graph may go below; a *speed*–time graph may not.)' },
      ],
    }),
    b('reasoning_prompt', 13, {
      reasoning_type: 'spatial',
      prompt: 'An x–t plot shows a curve that is a straight line for $ t < 0 $ and a parabola opening upward for $ t > 0 $. A student says: "So the particle moves in a straight line before $ t = 0 $ and along a parabolic path after it." What is wrong with that sentence, and can you suggest a physical situation this graph really describes?',
      reveal: 'What is wrong is the word **path**. This is an x–t graph, not a map. The particle moves along a straight line the entire time — that is what "one-dimensional motion" means. The graph is a record of *where on that line* it was at each moment, not a drawing of where it went in space.\n\nWhat the shapes actually say is: for $ t < 0 $ the slope was constant, so the particle was moving at a **constant velocity**. For $ t > 0 $ the slope increases steadily, so the particle is **accelerating uniformly**.\n\nA real situation that fits: a ball rolling along a level floor at constant speed until $ t = 0 $, when it reaches the top of a ramp and starts rolling down it, picking up speed steadily. Or a car cruising at constant speed that puts its foot down at $ t = 0 $.',
      difficulty_level: 3,
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.6,
      questions: [
        q('An x–t graph curves upward with a slope that increases with time. The particle is:',
          ['Moving in the negative direction', 'Moving in the positive direction and speeding up', 'Moving in the positive direction and slowing down', 'At rest'], 1,
          'A positive slope means motion in the positive direction; a slope that keeps getting steeper means the velocity keeps growing. So the particle is moving positively and speeding up.', 2),
        q('Which of these is definitely **not** a possible graph for a particle in one-dimensional motion?',
          ['A v–t graph that crosses the time axis', 'An x–t graph with a maximum', 'An x–t graph in which a vertical line cuts the curve twice', 'An x–t graph that is entirely below the time axis'], 2,
          'A curve that a vertical line cuts twice puts the particle at two positions at the same instant, which is impossible. Crossing the v-axis is just a reversal; a maximum on x–t is a turning point; and a graph entirely below the axis just means the particle stayed on the negative side of the origin.', 3),
        q('Three intervals of equal length are marked on an x–t plot. In which interval is the average **speed** greatest?',
          ['The one where the curve reaches its highest point', 'The one where the curve is steepest, ignoring sign', 'The one where the curve is flattest', 'The one closest to the start of the motion'], 1,
          'Average speed over an interval is the total path length divided by the time, and on an x–t graph a bigger change in position over the same time shows up as a steeper segment. Since speed ignores direction, it is the steepness — not the sign of the slope — that decides.', 3),
      ],
    }),
    b('callout', 15, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Slope $ = $ velocity.** Steeper is faster; negative slope is the negative direction; horizontal is at rest.\n- **Height $ = $ position**, not distance travelled and not speed.\n- **Crossing graphs $ = $ a meeting**: same place, same time.\n- **An x–t graph is not a map.** The horizontal axis is time.\n- **No vertical segments, no double-valued curves** — both require something infinite.',
    }),
    b('practice_bank', 16, {
      title: 'You solve it',
      intro: 'Eight questions, all graph-reading. Sketch each one on paper before you answer — the sketch is half the marks in an exam anyway.',
      sections: [
        {
          id: 'p4-ysi',
          title: 'Reading motion off a picture',
          items: [
            mcq('p4-y1', 'A particle\'s x–t graph is a straight line through the origin with a negative slope. The particle:',
              ['Starts at the origin and moves in the negative direction at constant speed', 'Starts at the origin and speeds up in the negative direction', 'Is at rest at the origin', 'Moves in the positive direction and then reverses'], 0,
              'Passing through the origin fixes the starting position at $ x = 0 $. A straight line means constant velocity, and a negative slope means that constant velocity points in the negative direction.'),
            num('p4-y2', 'The x–t graph of a particle is a straight line from $ (0\\ \\text{s},\\ 4\\ \\text{m}) $ to $ (8\\ \\text{s},\\ -12\\ \\text{m}) $. Find its velocity, and the time at which it crosses the origin.',
              '$ v = -2 $ m/s; it crosses the origin at $ t = 2 $ s',
              'Slope $ = \\frac{-12 - 4}{8 - 0} = \\frac{-16}{8} = -2 $ m/s. Starting at $ x = 4 $ m and moving at $ -2 $ m/s, it needs $ 4/2 = 2 $ s to reach $ x = 0 $.'),
            mcq('p4-y3', 'Two cars A and B start from the same point. On the x–t graph, A\'s line is steeper than B\'s throughout, and neither line is curved. Which is true?',
              ['A is always ahead of B after the start', 'B is always ahead of A after the start', 'They meet again later', 'B overtakes A'], 0,
              'Both start together, and A has the larger constant velocity throughout. So A pulls ahead immediately and the gap only grows — two straight lines from a common point with different slopes can never meet again.'),
            num('p4-y4', 'A particle\'s x–t graph consists of two segments: from $ (0, 0) $ to $ (4\\ \\text{s}, 12\\ \\text{m}) $, then from $ (4\\ \\text{s}, 12\\ \\text{m}) $ to $ (10\\ \\text{s}, 0) $. Find (a) the velocity on each segment, (b) the average velocity over 10 s, and (c) the average speed over 10 s.',
              '(a) $ +3 $ m/s then $ -2 $ m/s  (b) 0  (c) 2.4 m/s',
              '(a) First segment: $ 12/4 = +3 $ m/s. Second: $ (0-12)/(10-4) = -2 $ m/s. (b) It ends where it began, so the displacement over 10 s is zero and so is the average velocity. (c) Path length is $ 12 + 12 = 24 $ m in 10 s, giving 2.4 m/s.'),
            mcq('p4-y5', 'On an x–t graph, the fact that a curve has a maximum at some instant tells you that at that instant the particle:',
              ['Is travelling at its maximum possible speed', 'Is momentarily at rest and about to reverse', 'Has zero acceleration', 'Is at the origin'], 1,
              'At a maximum the tangent is horizontal, so the velocity is zero. Since the curve rises before and falls after, the particle was moving positively, stops, and then moves negatively — a reversal. Its acceleration there is certainly not zero; it is what turns the particle round.'),
            num('p4-y6', 'The x–t graph of a particle is horizontal at $ x = 6 $ m from $ t = 0 $ to $ t = 3 $ s, then rises as a straight line to $ x = 18 $ m at $ t = 7 $ s. Find its velocity in each phase and its average velocity over the full 7 s.',
              '$ 0 $ then $ +3 $ m/s; average $ \\approx +1.71 $ m/s',
              'The flat phase has zero slope, so $ v = 0 $. The rising phase has slope $ \\frac{18-6}{7-3} = \\frac{12}{4} = +3 $ m/s. The average over the full interval is $ \\frac{18-6}{7-0} = \\frac{12}{7} \\approx 1.71 $ m/s — lower than 3 m/s because three of the seven seconds were spent standing still.'),
            mcq('p4-y7', 'A student looks at an x–t graph shaped like a hill and says the object "went up and came back down". The most accurate correction is:',
              ['The object went up and came down, but faster than the graph suggests', 'The object moved forward, stopped, and returned — it never went up at all', 'The object moved in a circle', 'The graph must be wrong'], 1,
              'The vertical axis is position along a straight line, not height. A hill shape means the object moved in the positive direction, momentarily stopped at the peak, and then moved back in the negative direction. Nothing physically rose or fell.'),
            num('p4-y8', 'A particle\'s x–t graph is a straight line with slope $ +5 $ m/s. Without any further information, state (a) its acceleration and (b) whether its instantaneous and average velocities agree.',
              '(a) zero  (b) yes, they agree over every interval',
              '(a) Constant slope means constant velocity, so the velocity never changes and the acceleration is zero. (b) On a straight line the tangent slope at any instant equals the chord slope over any interval, so instantaneous and average velocity are both $ +5 $ m/s everywhere. This is exactly the definition of uniform motion.'),
          ],
        },
      ],
    }),
    b('text', 17, {
      markdown: 'So far the velocity has either stayed the same or changed without us saying much about it.\n\nFrom here on, the interesting part is how velocity **changes** — and that has a name, a definition, and a history that starts with Galileo getting it wrong.',
    }),
  ],
};

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureChapter(db);
    await upsertPages(db, bookId, [p0, p1, p2, p3, p4]);
  });
  console.log('\n✅ Ch.2 wave 1a complete — pages 0–4');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
