'use strict';
/**
 * Class 11 Physics · Chapter 4 "Laws of Motion" — pages 10–11.
 * Wave 2b: Pseudo Force — the trick itself plus lift problems (p10), then
 * wedges, vehicles and pendulums (p11), which is where the promise made on
 * p6 gets paid off: the block on a FREE-TO-SLIDE wedge, solved cleanly by
 * stepping into the wedge's own accelerating frame.
 *
 * Every worked example is solved BOTH ways (ground frame and accelerating
 * frame) wherever the reference books do so — that side-by-side agreement is
 * what makes the pseudo force believable rather than a rule to memorise.
 *
 * Run: node scripts/physics11-book/build_ch4_pseudo_force.js
 */
const { b, q, st, mcq, num, hero, ensureChapter, upsertPages, withDb } = require('./_book_ch4');

// ── p10 · Pseudo Force I — the Trick, and Lift Problems ─────────────────────
const p10 = {
  page_number: 10,
  slug: 'pseudo-force-and-lift-problems',
  title: 'Pseudo Force — the Trick, and Lift Problems',
  subtitle: 'What to do when the observer is the thing that is accelerating',
  glossary: [
    { term: 'inertial frame', definition: 'A non-accelerating frame of reference. Newton\'s laws hold in their ordinary form here. A frame moving at constant velocity is inertial.' },
    { term: 'non-inertial frame', definition: 'An accelerating frame of reference. F = ma fails here unless a pseudo force is added.' },
    { term: 'pseudo force', definition: 'A fictitious force of magnitude ma_frame, applied opposite to the frame\'s acceleration, which makes F = ma work again inside a non-inertial frame.' },
  ],
  blocks: [
    hero('pseudo-force-and-lift-problems'),
    b('curiosity_prompt', 0, {
      prompt: 'Stand on a bathroom scale inside a lift. The instant the lift starts moving upward, the reading jumps — even though your mass has not changed and gravity has not changed. Has your weight actually changed?',
      hint: 'Ask what a bathroom scale actually measures.',
      reveal: '**No — but what the scale reads was never your weight.**\n\nA bathroom scale measures the **normal force** it pushes up on you with. When you are standing still, that happens to equal your weight, which is why we get away with calling it "weight."\n\nThe moment the lift accelerates upward, you must accelerate upward too — so the net force on you must point up, so the normal force must now EXCEED your weight. The scale faithfully reports that larger normal force, and it reads high.\n\nYour actual weight $ mg $ never changed at all. What changed is the *contact force*, and that is genuinely all a scale can ever see. This distinction — real weight versus **apparent weight** — is what this page is built on.',
    }),
    b('text', 1, {
      markdown: 'Newton\'s laws are only true in an **inertial frame** — one that is not accelerating. Every diagram so far was drawn by an observer standing still on the ground, which is why they all worked.\n\nInside an **accelerating** frame, $ \\mathbf{F} = m\\mathbf{a} $ gives wrong answers: a passenger sees a coin slide forward across a braking bus with nothing touching it, flatly contradicting the First Law.\n\nTwo ways out. **Either** work from the ground (always correct, sometimes awkward), **or** stay in the accelerating frame and add one fictitious force to every body:\n\n$ \\mathbf{F}_{\\text{pseudo}} = -m\\mathbf{a}_{\\text{frame}} $\n\nMagnitude $ ma_{\\text{frame}} $, direction **opposite** to the frame\'s acceleration. With that one extra arrow, $ \\mathbf{F} = m\\mathbf{a} $ works again.',
    }),
    b('step_solver', 2, {
      title: 'A lift accelerating upward, solved from the ground',
      problem: 'A person of mass $ 70 $ kg stands on a weighing scale inside a lift that accelerates **upward** at $ 5 $ m/s². What does the scale read? Take $ g = 10 $ m/s².',
      intro: 'Start on the ground, where no pseudo force is needed at all — this gives the answer the accelerating-frame method must reproduce.',
      steps: [
        st('Free body diagram of the person (ground frame): normal force $ N $ up from the scale, weight $ mg = 700\\ \\text{N} $ down. The person accelerates upward at $ 5 $ m/s² along with the lift.',
          'From the ground the person genuinely IS accelerating, so the net force on them cannot be zero — this is the whole reason N will not equal mg.', {
            check: {
              kind: 'mcq',
              prompt: 'For an upward acceleration, which must be true?',
              options: [
                '$ N > mg $, since the net force must point upward',
                '$ N = mg $, since the person\'s mass has not changed',
                '$ N < mg $, since the lift is helping to support them',
                '$ N = 0 $, since the lift floor carries the whole load',
              ],
              answer_index: 0,
              feedback_right: 'Right — accelerating upward needs a net upward force, and the only upward force is N, so N must beat mg.',
              feedback_wrong: 'To accelerate upward, the net force must point upward. The only upward force is N and the only downward force is mg, so N must be LARGER than mg.',
            },
          }),
        st('$ N - mg = ma \\ \\Rightarrow\\ N = m(g+a) = 70(10+5) = 70 \\times 15 = 1050\\ \\text{N} $',
          'The scale reads 1050 N — as if the person weighed 105 kg. That is their **apparent weight**.', {
            check: {
              kind: 'fill_blank',
              prompt: 'If the lift instead accelerated DOWNWARD at 5 m/s², the reading would be $ m(g-a) = 70(10-5) $. Give it in newtons.',
              blank_answer: '350',
              feedback_right: 'Yes — 350 N, as if they weighed only 35 kg.',
              feedback_wrong: '$ N = m(g-a) = 70(10-5) = 70 \\times 5 = 350 $ N.',
            },
          }),
        st('The general result: $ N = m(g+a) $ accelerating up, $ N = m(g-a) $ accelerating down.',
          'Note carefully what these depend on: the **acceleration**, not the velocity. A lift moving upward at a steady 10 m/s has $ a = 0 $, so the scale reads a perfectly ordinary $ mg = 700 $ N.', {
            why: 'That last point is the one students most often get wrong. It is not "going up" that makes you feel heavy — it is *speeding up while going up* (or slowing down while going down). A lift travelling at constant speed feels exactly like standing on the ground, however fast it is travelling, because $ a = 0 $ makes the pseudo force vanish entirely.',
          }),
      ],
      now_you_try: {
        problem: 'A 50 kg person stands on a scale in a lift accelerating upward at 2 m/s². Take g = 10 m/s². What does the scale read?',
        answer: '$ 600 $ N',
        solution: '$ N = m(g+a) = 50(10+2) = 50 \\times 12 = 600 $ N — against 500 N at rest.',
      },
    }),
    b('step_solver', 4, {
      title: 'The same lift, solved from inside — and the two answers must agree',
      problem: 'Re-solve the same problem ($ 70 $ kg person, lift accelerating upward at $ 5 $ m/s²) from the point of view of an observer standing **inside the lift**, using a pseudo force. Confirm it gives the same $ 1050 $ N.',
      intro: 'This is the payoff. If the pseudo force is legitimate, it must reproduce the ground-frame answer exactly — and it does.',
      steps: [
        st('Inside the lift, the person is **at rest** — they are not moving relative to the lift at all. So in this frame their acceleration is zero, and the equation must be an equilibrium one.',
          'That is the whole appeal of the accelerating frame: a moving problem becomes a statics problem.', {
            check: {
              kind: 'mcq',
              prompt: 'The lift accelerates UP at 5 m/s². Which way does the pseudo force on the person point, and how big is it?',
              options: [
                'Downward, magnitude $ ma = 70 \\times 5 = 350 $ N',
                'Upward, magnitude $ ma = 70 \\times 5 = 350 $ N',
                'Downward, magnitude $ mg = 700 $ N',
                'Upward, magnitude $ m(g+a) = 1050 $ N',
              ],
              answer_index: 0,
              feedback_right: 'Right — the pseudo force is always OPPOSITE to the frame\'s acceleration, so an upward-accelerating lift produces a downward pseudo force of ma.',
              feedback_wrong: '$ \\mathbf{F}_{\\text{pseudo}} = -m\\mathbf{a}_{\\text{frame}} $ — opposite to the frame\'s acceleration. The lift accelerates up, so the pseudo force points DOWN, with magnitude $ ma = 70 \\times 5 = 350 $ N.',
            },
          }),
        st('Equilibrium in the lift frame: $ N - mg - ma = 0 \\ \\Rightarrow\\ N = m(g+a) = 70(15) = 1050\\ \\text{N} $ ✓',
          'Identical to the ground-frame answer, as it must be — the physics cannot depend on who is watching.', {
            check: {
              kind: 'mcq',
              prompt: 'What would go wrong if you worked inside the lift but FORGOT the pseudo force?',
              options: [
                'You would write $ N - mg = 0 $ and wrongly get $ N = 700 $ N',
                'You would get the correct 1050 N answer anyway, by coincidence',
                'You would get $ N = 350 $ N, exactly half the true value',
                'The equation would have no solution at all in that frame',
              ],
              answer_index: 0,
              feedback_right: 'Right — you would see a person at rest, conclude the forces balance, and get 700 N. Which the scale plainly contradicts.',
              feedback_wrong: 'Without the pseudo force you would see a stationary person, write $ N = mg = 700 $ N, and be wrong — the real scale reads 1050 N. That discrepancy is precisely the gap the pseudo force fills.',
            },
          }),
        st('Both frames give $ N = 1050 $ N. **Pick whichever frame makes the diagram simpler — never mix them.**',
          'Here the ground frame was slightly easier. On the wedge problems of the next page, the accelerating frame wins decisively.', {
            why: 'The general rule of thumb, worth carrying: if the body you care about is **at rest relative to the accelerating thing** (a person in a lift, a block riding a wedge, a bob hanging in a car), the accelerating frame turns the whole problem into statics and is almost always cleaner. If the body is moving in a complicated way relative to that frame, the ground is usually simpler.',
          }),
      ],
      now_you_try: {
        problem: 'A 60 kg person stands in a lift accelerating downward at 3 m/s². Solve for the scale reading using the pseudo-force method, and check it against the ground-frame formula. Take g = 10 m/s².',
        answer: '$ 420 $ N',
        solution: 'The lift accelerates DOWN, so the pseudo force on the person is UP, magnitude $ ma = 60(3) = 180 $ N. Lift-frame equilibrium: $ N + 180 - 600 = 0 \\Rightarrow N = 420 $ N. Ground frame: $ N = m(g-a) = 60(7) = 420 $ N ✓.',
      },
    }),
    b('callout', 5, {
      variant: 'warning',
      title: 'A pseudo force is not a real force',
      markdown: 'Now that you have used one: it has **no Third Law partner**. No body exerts it, so nothing is pushed back. It is a bookkeeping term compensating for a yardstick that is itself accelerating.\n\nUse it with discipline: **choose one frame and stay in it.** Mixing a ground-frame force with a lift-frame pseudo force in one equation is how this technique usually goes wrong.',
    }),
    b('image', 6, {
      src: '',
      alt: 'Two free body diagrams of the same person in a lift side by side: the ground-frame diagram shows normal force up and weight down with an acceleration arrow beside the person, while the lift-frame diagram shows normal force up, weight down, and an additional downward pseudo-force arrow, with the person marked as at rest.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-lift-two-frames',
      caption: 'The same person, two frames. Left: from the ground, the person accelerates and N exceeds mg. Right: from inside, the person is at rest but carries an extra downward pseudo force ma. Both give N = m(g+a).',
    }),
    b('step_solver', 6, {
      title: 'The lift whose cable snaps — apparent weightlessness',
      problem: 'The lift\'s cable breaks and it falls freely under gravity. What does the scale read now, for the same $ 70 $ kg person? Take $ g = 10 $ m/s².',
      intro: 'The limiting case of the downward formula — and the correct explanation of what "weightlessness" actually means.',
      steps: [
        st('In free fall the lift\'s acceleration is $ a = g $, downward. Using $ N = m(g-a) $: $ N = 70(10-10) = 0 $.',
          'The scale reads exactly zero. The person floats off the floor, touching nothing.', {
            check: {
              kind: 'mcq',
              prompt: 'During this free fall, the gravitational force on the person is:',
              options: [
                'Still $ mg = 700 $ N, completely unchanged by the fall',
                'Zero, which is why they experience weightlessness',
                'Reduced to half its usual value during the fall',
                'Reversed in direction, now pointing upward instead',
              ],
              answer_index: 0,
              feedback_right: 'Right — gravity is entirely unaffected. What has vanished is the CONTACT force, which is all the scale could ever measure.',
              feedback_wrong: 'Gravity still pulls with the full $ mg = 700 $ N — nothing about the fall changes that. What drops to zero is the normal contact force from the scale, which is the only thing a scale can measure.',
            },
          }),
        st('So "weightlessness" is really **zero apparent weight**: the person and the floor accelerate downward at exactly the same rate, so they never press on each other.',
          'This is precisely why astronauts float in orbit. They are not beyond gravity — they and their spacecraft are simply falling together, so no contact force develops between them.', {
            why: 'The lift-frame view makes it especially vivid: in the freely-falling frame, the downward weight $ mg $ and the upward pseudo force $ ma = mg $ are equal and opposite, so they cancel **exactly**. Inside that frame gravity has, for all practical purposes, been switched off — which is the observation Einstein built general relativity on.',
          }),
      ],
      now_you_try: {
        problem: 'A lift descends with an acceleration of 10 m/s² (taking g = 10 m/s²). A 5 kg object rests on its floor. What normal force does the floor exert on it, and what would happen if the lift accelerated downward faster than g?',
        answer: '$ 0 $ N; and beyond g the object would leave the floor entirely',
        solution: '$ N = m(g-a) = 5(10-10) = 0 $ N. If $ a > g $, the formula would give a negative N — impossible, since a floor can only push. Physically the object simply loses contact and the floor accelerates away downward beneath it.',
      },
    }),
    b('step_solver', 7, {
      title: 'A coin dropped inside a moving lift',
      problem: 'A coin is released from rest from the ceiling of a lift, $ 1.5 $ m above its floor. The lift is accelerating **upward** at $ 2 $ m/s². How long does the coin take to reach the floor? Take $ g = 10 $ m/s².',
      intro: 'Doing this from the ground is genuinely messy — both the coin AND the floor are moving, and you must find when they meet. In the lift frame it is a one-line free-fall problem.',
      steps: [
        st('**In the lift frame**, the coin has two downward forces: its weight $ mg $, and a pseudo force $ ma $ (downward, since the lift accelerates upward). Total: $ m(g+a) $ down.',
          'Both point the same way here, so they simply add — the coin behaves as though gravity had been strengthened.', {
            check: {
              kind: 'mcq',
              prompt: 'So the coin\'s acceleration relative to the lift floor is:',
              options: [
                '$ g + a = 12 $ m/s², downward — as if gravity were stronger',
                '$ g - a = 8 $ m/s², downward — as if gravity were weaker',
                '$ g = 10 $ m/s², unchanged by the lift\'s own motion',
                '$ a = 2 $ m/s², set by the lift\'s acceleration alone',
              ],
              answer_index: 0,
              feedback_right: 'Right — weight and pseudo force both act downward in this frame, so they add to give an effective $ 12 $ m/s².',
              feedback_wrong: 'The lift accelerates UP, so the pseudo force on the coin points DOWN — the same way as its weight. They add: $ g + a = 12 $ m/s² relative to the lift.',
            },
          }),
        st('Now it is an ordinary free-fall problem in that frame: $ h = \\tfrac{1}{2}(g+a)t^2 \\ \\Rightarrow\\ 1.5 = \\tfrac{1}{2}(12)t^2 $.',
          'The coin starts at rest *relative to the lift*, which is what lets this be treated as a simple drop.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Solve $ 1.5 = 6t^2 $ for $ t $, in seconds.',
              blank_answer: '0.5',
              feedback_right: 'Yes — $ t^2 = 0.25 $, so $ t = 0.5 $ s.',
              feedback_wrong: '$ t^2 = 1.5/6 = 0.25 $, so $ t = 0.5 $ s.',
            },
          }),
        st('$ t = 0.5\\ \\text{s} $ — quicker than the $ 0.55 $ s it would take in a stationary lift.',
          'And if the lift were accelerating DOWNWARD instead, the pseudo force would point up, giving $ g - a $ and a longer fall.', {
            why: 'This is where the accelerating frame really earns its place. From the ground you would have to write separate position equations for the coin (accelerating down at $ g $) and the lift floor (accelerating up at $ a $), then solve for when the gap between them closes — three lines of algebra and a real chance of a sign error. In the lift frame it is one substitution into a formula from Chapter 2.',
          }),
      ],
      now_you_try: {
        problem: 'A coin is released from 1.6 m above the floor of a lift accelerating DOWNWARD at 2 m/s². Take g = 10 m/s². Find the time to reach the floor.',
        answer: '$ \\approx 0.63 $ s',
        solution: 'Accelerating down means the pseudo force points UP, so the effective acceleration is $ g - a = 8 $ m/s². Then $ 1.6 = \\tfrac{1}{2}(8)t^2 \\Rightarrow t^2 = 0.4 \\Rightarrow t \\approx 0.63 $ s — longer than in a stationary lift, as expected.',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.6,
      questions: [
        q('A person stands on a scale in a lift moving upward at a CONSTANT 8 m/s. The scale reads:',
          ['More than their normal weight, since the lift is moving upward', 'Exactly their normal weight, since the acceleration is zero', 'Less than their normal weight, since the lift supports them', 'Zero, since they are moving along with the lift itself'],
          1, 'Apparent weight depends on ACCELERATION, not velocity. At constant speed $ a = 0 $, so $ N = mg $ — identical to standing on the ground.', 2),
        q('A pseudo force differs from a real force in that it:',
          ['Has no Third Law partner, since no body actually exerts it', 'Always acts in the same direction as the frame accelerates', 'Only ever acts on objects that are genuinely at rest', 'Is much smaller in magnitude than any real force present'],
          0, 'Every real force is one half of an action–reaction pair. A pseudo force is a bookkeeping term with no exerting body, so nothing is pushed back — and it acts OPPOSITE to the frame\'s acceleration, not along it.', 2),
        q('A 60 kg person is in a lift accelerating downward at 4 m/s² (g = 10 m/s²). The scale reads:',
          ['$ 840 $ N, larger than their weight at rest', '$ 360 $ N, smaller than their weight at rest', '$ 600 $ N, exactly their weight at rest', '$ 240 $ N, less than half their resting weight'],
          1, '$ N = m(g-a) = 60(10-4) = 60 \\times 6 = 360 $ N — reduced, because accelerating downward needs a net downward force, so N must fall below mg.', 2),
        q('Working inside an accelerating lift, the pseudo force on a body must be applied:',
          ['In the same direction as the lift accelerates, with magnitude ma', 'Opposite to the lift\'s acceleration, with magnitude ma', 'Vertically downward always, regardless of the lift motion', 'Perpendicular to the lift\'s direction of acceleration'],
          1, '$ \\mathbf{F}_{\\text{pseudo}} = -m\\mathbf{a}_{\\text{frame}} $. The minus sign is the whole point: the force points opposite to the frame\'s acceleration.', 1),
        q('An astronaut floating inside an orbiting spacecraft feels weightless because:',
          ['Gravity is genuinely zero at that altitude above the Earth', 'They and the craft fall together, so no contact force develops', 'The spacecraft shields them from the Earth\'s gravitational pull', 'Their mass becomes zero once they are in orbital motion'],
          1, 'Gravity in low orbit is still most of its surface value. The astronaut and the spacecraft accelerate identically under it, so they never press on each other — exactly the freely-falling-lift case, with zero apparent weight.', 3),
      ],
    }),
    b('callout', 8, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Inertial frame** = not accelerating; $ F = ma $ works as written. **Non-inertial** = accelerating; it does not.\n- **Pseudo force** $ = -m\\mathbf{a}_{\\text{frame}} $: magnitude $ ma $, direction **opposite** to the frame\'s acceleration. No Third Law partner.\n- **Choose one frame and stay in it.** Mixing frames in a single equation is the classic error.\n- **Apparent weight in a lift:** $ N = m(g+a) $ going up, $ N = m(g-a) $ going down. Depends on acceleration, never on velocity.\n- **Free fall $ \\Rightarrow N = 0 $** — weightlessness is zero CONTACT force, not zero gravity.',
    }),
    b('practice_bank', 9, {
      title: 'You solve it',
      intro: 'Seven questions. State which frame you are working in before writing any equation — and if you use a pseudo force, draw it on the diagram first.',
      sections: [
        {
          id: 'p10-ysi',
          title: 'Pseudo Force & Lift Problems',
          items: [
            num('p10-y1', 'A 80 kg person stands in a lift accelerating upward at 2.5 m/s². Take g = 10 m/s². Find the scale reading.',
              '$ 1000 $ N',
              '$ N = m(g+a) = 80(10+2.5) = 80 \\times 12.5 = 1000 $ N.'),
            mcq('p10-y2', 'A lift moves downward at a constant 5 m/s. A person inside stands on a scale. The reading is:',
              ['Less than their weight, since the lift is descending steadily', 'Exactly equal to their normal weight at rest', 'More than their weight, since the lift is in motion', 'Zero, since the lift and person move together'],
              1, 'Constant velocity means zero acceleration, so $ N = mg $ — the direction of travel is irrelevant.'),
            num('p10-y3', 'A 2 kg block rests on the floor of a lift accelerating downward at 4 m/s². Take g = 10 m/s². Find the normal force on the block.',
              '$ 12 $ N',
              '$ N = m(g-a) = 2(10-4) = 2 \\times 6 = 12 $ N.'),
            mcq('p10-y4', 'A lift accelerates upward at 3 m/s². Working inside the lift, the pseudo force on a 10 kg block on its floor is:',
              ['30 N upward, in the direction the lift accelerates', '30 N downward, opposite to the lift\'s acceleration', '100 N downward, equal to the block\'s own weight', '130 N downward, the sum of weight and pseudo force'],
              1, 'Pseudo force $ = ma_{\\text{frame}} = 10 \\times 3 = 30 $ N, directed OPPOSITE to the lift\'s upward acceleration, so downward.'),
            num('p10-y5', 'A person of mass 50 kg is in a lift whose cable snaps, so it falls freely. Take g = 10 m/s². Find the scale reading, and state the gravitational force still acting on them.',
              'Scale reads $ 0 $ N; gravity is still $ 500 $ N',
              '$ N = m(g-a) = 50(10-10) = 0 $ N. Gravity is entirely unaffected by the fall and still pulls with $ mg = 500 $ N — the scale simply cannot measure it, only the contact force.'),
            mcq('p10-y6', 'A block sits on the floor of a lift. For the normal force on it to be exactly ZERO, the lift must be:',
              ['Accelerating upward at exactly g', 'Accelerating downward at exactly g, in free fall', 'Moving downward at a constant speed equal to g', 'At rest with its brakes fully applied'],
              1, '$ N = m(g-a) $ vanishes when $ a = g $ downward — the free-fall case, where block and floor accelerate identically and never press on each other.'),
            mcq('p10-y7', 'The main advantage of solving a problem inside an accelerating frame rather than from the ground is that:',
              ['Bodies at rest in that frame become simple statics problems', 'The pseudo force is always smaller than any real force there', 'Newton\'s Third Law becomes easier to apply in that frame', 'Gravity can safely be ignored inside an accelerating frame'],
              0, 'A body riding along with the accelerating frame is at rest IN that frame, so its equation becomes an equilibrium one — which is usually far easier than tracking its acceleration from outside.'),
          ],
        },
      ],
    }),
    b('text', 10, {
      markdown: 'Lifts accelerate straight up and down, which keeps every force conveniently vertical. The next page turns the acceleration **sideways** — a bob hanging in a braking car, a block riding a driven wedge — and finishes with the problem this chapter has been deliberately postponing since the constraint pages.',
    }),
  ],
};

// ── p11 · Pseudo Force II — Wedges, Vehicles, and Pendulums ─────────────────
const p11 = {
  page_number: 11,
  slug: 'pseudo-force-wedges-vehicles-and-pendulums',
  title: 'Pseudo Force II — Wedges, Vehicles, and Pendulums',
  subtitle: 'Sideways acceleration, and the wedge problem finally solved',
  glossary: [
    { term: 'effective gravity', definition: 'In a horizontally accelerating frame, the vector sum of real gravity and the pseudo force. A pendulum hangs along this direction, and it has magnitude √(g² + a²).' },
  ],
  blocks: [
    hero('pseudo-force-wedges-vehicles-and-pendulums'),
    b('curiosity_prompt', 0, {
      prompt: 'A small ornament hangs from a car\'s rearview mirror. The car is parked and it hangs straight down. The driver accelerates hard away from a signal — and the ornament swings back and settles at a steady angle. Why does it settle at all, rather than swinging back and forth forever?',
      hint: 'Think about what the passenger sees, not what someone on the pavement sees.',
      reveal: 'Because in the car\'s own frame, it has reached a genuine **equilibrium**.\n\nFrom the pavement, the ornament is accelerating forward along with the car, and the tension in its string must be tilted forward to supply that acceleration — which is why it cannot hang vertically.\n\nFrom inside the car, it is far simpler: the ornament is *hanging still*. Three forces act on it — its weight straight down, the string tension along the string, and a backward pseudo force $ ma $. Those three balance at exactly one angle, and that is where it sits.\n\nAnd here is the pleasing part: the ornament is now hanging along the direction of **effective gravity** — the combination of real gravity and the pseudo force. In the accelerating car, "down" has genuinely tilted, and everything hanging freely tilts with it.',
    }),
    b('step_solver', 1, {
      title: 'The hanging bob in an accelerating vehicle — both frames at once',
      problem: 'A bob of mass $ m $ hangs from the ceiling of a train accelerating horizontally at $ a = 5 $ m/s². Find the angle $ \\theta $ the string makes with the vertical, and the tension, in terms of $ m $. Take $ g = 10 $ m/s².',
      intro: 'Solved both ways deliberately. The two methods look completely different and must give the same angle — and seeing that happen is what makes the pseudo force trustworthy.',
      steps: [
        st('**Ground frame.** The bob accelerates horizontally at $ a $, so: horizontally $ T\\sin\\theta = ma $, vertically $ T\\cos\\theta = mg $ (no vertical acceleration).',
          'From outside, the bob is genuinely accelerating, and the string must tilt so that tension has a forward horizontal component to cause it.', {
            check: {
              kind: 'mcq',
              prompt: 'Dividing the horizontal equation by the vertical one gives:',
              options: [
                '$ \\tan\\theta = a/g $, with the mass cancelling out entirely',
                '$ \\tan\\theta = g/a $, the reciprocal of that ratio instead',
                '$ \\sin\\theta = a/g $, since the horizontal side is opposite',
                '$ \\tan\\theta = ma/g $, keeping the mass in the result'],
              answer_index: 0,
              feedback_right: 'Right — $ T $ and $ m $ both cancel, leaving $ \\tan\\theta = a/g $. The angle is mass-independent.',
              feedback_wrong: 'Dividing $ T\\sin\\theta = ma $ by $ T\\cos\\theta = mg $ cancels both $ T $ and $ m $, giving $ \\tan\\theta = a/g $.',
            },
          }),
        st('**Train frame.** The bob is at rest. Forces: weight $ mg $ down, tension $ T $ along the string, pseudo force $ ma $ backward. Equilibrium: $ T\\sin\\theta = ma $ and $ T\\cos\\theta = mg $.',
          'Identical equations — but reached as an *equilibrium* rather than as an acceleration problem. That is the entire saving.', {
            check: {
              kind: 'fill_blank',
              prompt: 'With $ a = 5 $ and $ g = 10 $, evaluate $ \\tan\\theta = a/g $ as a decimal.',
              blank_answer: '0.5',
              feedback_right: 'Yes — $ \\tan\\theta = 0.5 $, so $ \\theta \\approx 26.6° $ from the vertical.',
              feedback_wrong: '$ \\tan\\theta = a/g = 5/10 = 0.5 $, giving $ \\theta = \\tan^{-1}(0.5) \\approx 26.6° $.',
            },
          }),
        st('$ \\theta = \\tan^{-1}(a/g) \\approx 26.6° $, and $ T = m\\sqrt{g^2+a^2} = m\\sqrt{125} \\approx 11.2m\\ \\text{N} $.',
          'The tension exceeds $ mg $ — the string is working harder than it would at rest, because it now has to supply the horizontal acceleration too.', {
            why: 'That $ \\sqrt{g^2+a^2} $ is **effective gravity**: the vector sum of real gravity (down) and the pseudo force per unit mass (backward). In the accelerating frame it behaves exactly like a stronger gravity pointing in a tilted direction. Every freely hanging object in that train tilts to the same angle — and a pendulum swinging in it would even oscillate about that tilted line rather than the vertical.',
          }),
      ],
      now_you_try: {
        problem: 'A bob hangs from the ceiling of a bus accelerating at 7.5 m/s². Take g = 10 m/s². Find the angle it makes with the vertical, and the tension in terms of m.',
        answer: '$ \\theta = \\tan^{-1}(0.75) \\approx 36.9° $, and $ T = 12.5m $ N',
        solution: '$ \\tan\\theta = a/g = 7.5/10 = 0.75 $, so $ \\theta \\approx 36.9° $. $ T = m\\sqrt{g^2+a^2} = m\\sqrt{100+56.25} = m\\sqrt{156.25} = 12.5m $ N.',
      },
    }),
    b('image', 2, {
      src: '',
      alt: 'A bob hanging from the ceiling of an accelerating vehicle shown twice: on the left the ground-frame diagram with tension tilted forward and an acceleration arrow, on the right the vehicle-frame diagram with the same tension, weight down and a backward pseudo-force arrow, plus a dashed line marking the tilted effective-gravity direction the bob hangs along.',
      aspect_ratio: '16:9',
      figure_key: 'ch4-pendulum-in-vehicle',
      caption: 'The bob hangs along "effective gravity" — the vector sum of real gravity and the pseudo force. In an accelerating vehicle, down genuinely tilts, and everything hanging freely tilts with it.',
    }),
    b('step_solver', 3, {
      title: 'A driven wedge — holding a block motionless on a frictionless slope',
      problem: 'A block of mass $ m = 2 $ kg rests on the frictionless face of a wedge of mass $ M = 8 $ kg and angle $ \\theta = 30° $. A horizontal force $ F $ is applied to the wedge. Find the $ F $ for which the block stays **stationary relative to the wedge** — neither sliding up nor down its face. Take $ g = 10 $ m/s².',
      intro: 'A frictionless slope with a block that refuses to slide sounds impossible. The resolution is that the whole system is accelerating, and it is the accelerating frame that makes it easy to see.',
      steps: [
        st('**Wedge frame.** The block is at rest here. Forces on it: weight $ mg $ down, normal $ N $ perpendicular to the face, and pseudo force $ ma $ backward (opposite the acceleration $ a $ of the wedge).',
          'Only two real forces plus one pseudo force, and they must balance — a clean statics problem, despite nothing being genuinely stationary.', {
            check: {
              kind: 'mcq',
              prompt: 'With no friction available on the face, what must the pseudo force do for the block to stay put?',
              options: [
                'Combine with gravity so the resultant is perpendicular to the face',
                'Point directly up the slope, exactly cancelling gravity alone',
                'Exceed the block\'s weight so it is pressed into the wedge face',
                'Vanish entirely, which happens only when the wedge is at rest',
              ],
              answer_index: 0,
              feedback_right: 'Right — the normal force can only act perpendicular to the face, so everything else combined must also be perpendicular to it, or the block would slide.',
              feedback_wrong: 'The only other force available is $ N $, which is perpendicular to the face. So weight plus pseudo force must combine into a resultant that is ALSO perpendicular to the face — otherwise there would be an unbalanced component along it, and the block would slide.',
            },
          }),
        st('Components: $ N\\cos\\theta = mg $ (vertical) and $ N\\sin\\theta = ma $ (horizontal). Dividing: $ \\tan\\theta = a/g \\ \\Rightarrow\\ a = g\\tan\\theta $.',
          'The same $ \\tan\\theta = a/g $ relation as the hanging bob — which is no coincidence: in both, "effective gravity" has tilted to line up with a surface or a string.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ a = g\\tan30° = 10 \\times 0.577 $, in m/s², to two decimal places.',
              blank_answer: '5.77',
              feedback_right: 'Yes — about 5.77 m/s².',
              feedback_wrong: '$ a = g\\tan30° = 10 \\times 0.577 = 5.77 $ m/s².',
            },
          }),
        st('The whole system (block + wedge) must be given this acceleration: $ F = (M+m)a = 10 \\times 5.77 \\approx 57.7\\ \\text{N} $.',
          'Note $ F $ accelerates the COMBINED mass — the block rides along, so it must be pushed too.', {
            why: 'Worth checking against the ground frame, which gives the same answer by a different route: there the block is accelerating horizontally at $ a $, and the only horizontal force on it is $ N\\sin\\theta $, so $ N\\sin\\theta = ma $; vertically it does not accelerate, so $ N\\cos\\theta = mg $. Identical pair of equations, identical result — but reached by thinking about acceleration rather than balance. Both are correct; the wedge frame simply reads more naturally.',
          }),
      ],
      now_you_try: {
        problem: 'A 3 kg block rests on the frictionless face of a 7 kg wedge of angle 45°. Find the horizontal force on the wedge that keeps the block stationary relative to it. Take g = 10 m/s².',
        answer: '$ 100 $ N',
        solution: '$ a = g\\tan45° = 10(1) = 10 $ m/s². $ F = (M+m)a = (7+3)(10) = 100 $ N.',
      },
    }),
    b('step_solver', 4, {
      title: 'The block on a FREE wedge — the problem promised on the constraint page',
      problem: 'A block of mass $ m = 2 $ kg is released on the frictionless face of a wedge of mass $ M = 4 $ kg and angle $ \\theta = 45° $. The wedge is free to slide on a frictionless floor, and nothing is pushing it. Find the acceleration $ A $ of the wedge. Take $ g = 10 $ m/s².',
      intro: 'This is the picture set up on the movable-pulley page and deliberately left unsolved. In the ground frame it needs two coupled arguments at once; in the wedge frame it becomes an ordinary incline problem with one extra force.',
      steps: [
        st('Let the wedge accelerate with magnitude $ A $ (horizontally, away from the block\'s slide direction). **In the wedge frame**, add a pseudo force $ mA $ on the block, directed opposite to the wedge\'s acceleration — i.e. horizontally, pushing the block toward the slope.',
          'The block now simply slides along the face, as in any ordinary incline problem. The only novelty is that one extra horizontal force.', {
            check: {
              kind: 'mcq',
              prompt: 'Resolving perpendicular to the incline face, the block does not accelerate in that direction (it stays on the surface). This gives:',
              options: [
                '$ N = m(g\\cos\\theta - A\\sin\\theta) $ — the pseudo force reduces N',
                '$ N = m(g\\cos\\theta + A\\sin\\theta) $ — the pseudo force increases N',
                '$ N = mg $ — the pseudo force has no perpendicular component',
                '$ N = mg\\cos\\theta $ — exactly as for a fixed wedge',
              ],
              answer_index: 0,
              feedback_right: 'Right — the pseudo force has a component that lifts the block away from the face, so N comes out smaller than on a fixed wedge.',
              feedback_wrong: 'The horizontal pseudo force has a component perpendicular to the tilted face that pulls the block AWAY from it, so it reduces the normal force: $ N = m(g\\cos\\theta - A\\sin\\theta) $. On a fixed wedge ($ A = 0 $) this correctly collapses back to $ mg\\cos\\theta $.',
            },
          }),
        st('Now the **wedge**, in the ground frame: the only horizontal force on it is the block\'s reaction, of horizontal component $ N\\sin\\theta $. So $ MA = N\\sin\\theta $.',
          'Two equations, two unknowns ($ N $ and $ A $) — the system is now closed and solvable.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Substituting: $ MA = m(g\\cos\\theta - A\\sin\\theta)\\sin\\theta $, which rearranges to $ A = \\dfrac{mg\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta} $. With $ m=2, M=4, \\theta=45° $ ($ \\sin\\theta\\cos\\theta = 0.5 $, $ \\sin^2\\theta = 0.5 $) and $ g=10 $, evaluate $ A $ in m/s².',
              blank_answer: '2',
              feedback_right: 'Yes — $ A = (2)(10)(0.5)/(4 + 2 \\times 0.5) = 10/5 = 2 $ m/s².',
              feedback_wrong: 'Numerator: $ mg\\sin\\theta\\cos\\theta = 2(10)(0.5) = 10 $. Denominator: $ M + m\\sin^2\\theta = 4 + 2(0.5) = 5 $. So $ A = 10/5 = 2 $ m/s².',
            },
          }),
        st('$ A = \\dfrac{mg\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta} = 2\\ \\text{m/s}^2 $, and back-substituting, $ N = m(g\\cos\\theta - A\\sin\\theta) = 2(7.07 - 1.41) \\approx 11.3\\ \\text{N} $.',
          'Check: $ MA = 4(2) = 8 $ N and $ N\\sin\\theta = 11.3(0.707) = 8 $ N ✓ — the two equations agree, so neither was mis-signed.', {
            why: 'Two limits confirm the formula behaves. **A very heavy wedge** ($ M \\to \\infty $) gives $ A \\to 0 $ — it barely budges, and the problem correctly reduces to the fixed-incline case from the free-body-diagram page. **A vertical face** ($ \\theta = 90° $) gives $ \\sin\\theta\\cos\\theta = 0 $, so $ A = 0 $ — the block just falls straight down past a vertical wall, pushing it nowhere sideways. Both are exactly right, which is good evidence the algebra is too.',
          }),
      ],
      now_you_try: {
        problem: 'A 1 kg block is released on the frictionless 45° face of a 3 kg wedge free to slide on a frictionless floor. Take g = 10 m/s². Find the wedge\'s acceleration.',
        answer: '$ \\approx 1.43 $ m/s²',
        solution: '$ A = mg\\sin\\theta\\cos\\theta/(M + m\\sin^2\\theta) = (1)(10)(0.5)/(3 + 1 \\times 0.5) = 5/3.5 \\approx 1.43 $ m/s².',
      },
    }),
    b('step_solver', 5, {
      title: 'A block held on the wall of an accelerating cart — friction with no hand pressing',
      problem: 'A block rests against the smooth-looking vertical **back wall** of a cart, with $ \\mu = 0.5 $ between block and wall. Nothing touches the block except the wall. Find the minimum horizontal acceleration of the cart for which the block does not slide down. Take $ g = 10 $ m/s².',
      intro: 'This is the wall problem from the friction pages — but with nobody pressing. The question is what supplies the press, and the answer is the pseudo force.',
      steps: [
        st('**In the cart frame**, the block is at rest. The pseudo force $ ma $ acts backward — pressing the block INTO the back wall. So the wall\'s normal force is $ N = ma $.',
          'This is exactly the p9 wall picture, except the "hand" doing the pressing is now the pseudo force from the cart\'s acceleration.', {
            check: {
              kind: 'mcq',
              prompt: 'What holds the block up against gravity here?',
              options: [
                'Friction from the wall, acting vertically along the wall face',
                'The normal force from the wall, acting vertically upward',
                'The pseudo force itself, which points partly upward',
                'Nothing — a block cannot be held on a vertical wall this way',
              ],
              answer_index: 0,
              feedback_right: 'Right — same as the p9 wall problem: the normal force is horizontal, so only friction along the wall can oppose the weight.',
              feedback_wrong: 'The normal force is perpendicular to the wall, so it is horizontal and cannot fight gravity. Friction acts ALONG the wall — vertically — and is the only upward force available.',
            },
          }),
        st('On the verge of slipping: $ \\mu N = mg \\ \\Rightarrow\\ \\mu(ma) = mg \\ \\Rightarrow\\ a = \\dfrac{g}{\\mu} $.',
          'The mass cancels completely — the required acceleration is the same for a matchbox and a brick.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ a_{\\min} = g/\\mu = 10/0.5 $, in m/s².',
              blank_answer: '20',
              feedback_right: 'Yes — 20 m/s², which is a very brisk acceleration indeed.',
              feedback_wrong: '$ a_{\\min} = g/\\mu = 10/0.5 = 20 $ m/s².',
            },
          }),
        st('$ a_{\\min} = \\dfrac{g}{\\mu} = 20\\ \\text{m/s}^2 $ — twice $ g $. The cart must accelerate ferociously hard to pin the block by friction alone.',
          'Compare with the p9 result $ F_{\\min} = mg/\\mu $: identical structure, with $ ma $ playing the role that a hand\'s push played there.', {
            why: 'This is a nice demonstration that the pseudo force behaves like any other force once it is on the diagram — it presses, it creates a normal force, and that normal force generates friction, all exactly as a real push would. The only difference is that no body is exerting it. Everyone who has felt themselves pressed back into a car seat during hard acceleration has felt this exact effect.',
          }),
      ],
      now_you_try: {
        problem: 'A block rests against the vertical back wall of a cart with μ = 0.4 between them. Take g = 10 m/s². Find the minimum acceleration of the cart that stops the block sliding down.',
        answer: '$ 25 $ m/s²',
        solution: '$ a_{\\min} = g/\\mu = 10/0.4 = 25 $ m/s² — a lower coefficient of friction demands an even harsher acceleration.',
      },
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.6,
      questions: [
        q('A bob hangs from the ceiling of a car accelerating at 5 m/s² (g = 10 m/s²). Its angle from the vertical satisfies:',
          ['$ \\tan\\theta = 0.5 $, giving roughly 27° from the vertical', '$ \\sin\\theta = 0.5 $, giving exactly 30° from the vertical', '$ \\tan\\theta = 2.0 $, giving roughly 63° from the vertical', '$ \\cos\\theta = 0.5 $, giving exactly 60° from the vertical'],
          0, 'Both frames give $ \\tan\\theta = a/g = 5/10 = 0.5 $, so $ \\theta \\approx 26.6° $ — and the mass cancels out entirely.', 2),
        q('In a horizontally accelerating frame, a freely hanging object lines up along:',
          ['The true vertical, exactly as it would when at rest', 'The direction of "effective gravity", tilted from the vertical', 'The direction of the frame\'s acceleration itself', 'A direction that depends on the object\'s own mass'],
          1, 'The pseudo force adds vectorially to real gravity, producing an effective gravity of magnitude $ \\sqrt{g^2+a^2} $ in a tilted direction — and anything hanging freely settles along it, regardless of its mass.', 2),
        q('A block stays stationary on the FRICTIONLESS face of a wedge being pushed horizontally. This requires the wedge\'s acceleration to be:',
          ['$ a = g\\sin\\theta $, the component of gravity along the face', '$ a = g\\tan\\theta $, so effective gravity is perpendicular to it', '$ a = g\\cos\\theta $, matching the perpendicular component', '$ a = g $, regardless of the wedge angle in question'],
          1, 'The block can only be held by a force perpendicular to the face, so weight plus pseudo force must combine perpendicular to it — which requires $ \\tan\\theta = a/g $, i.e. $ a = g\\tan\\theta $.', 3),
        q('For a block on a wedge that is FREE to slide on a frictionless floor, the normal force compared to a fixed wedge of the same angle is:',
          ['Larger, since the wedge moves away and the block presses harder', 'Smaller, since the wedge accelerates away and partly gives way', 'Exactly the same, since the block\'s weight is unchanged', 'Zero, since a free wedge cannot support any load at all'],
          1, '$ N = m(g\\cos\\theta - A\\sin\\theta) $, which is less than the fixed-wedge value $ mg\\cos\\theta $ whenever $ A > 0 $ — the wedge is partly retreating from under the block.', 3),
        q('The main reason the pseudo-force method simplifies the sliding-wedge problem is that:',
          ['The block becomes an ordinary incline problem in the wedge\'s frame', 'The pseudo force cancels the block\'s weight completely', 'It removes the need to consider the normal force at all', 'Frictionless surfaces can only be analysed in accelerating frames'],
          0, 'In the ground frame the block\'s acceleration is a two-dimensional combination of its motion along the face and the wedge\'s own motion. In the wedge frame it simply slides along a slope, with one extra horizontal force — a picture already familiar from the incline pages.', 3),
      ],
    }),
    b('callout', 6, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- **Hanging bob in an accelerating vehicle:** $ \\tan\\theta = a/g $, $ T = m\\sqrt{g^2+a^2} $ — both mass-independent in angle.\n- **Effective gravity** in a horizontally accelerating frame: magnitude $ \\sqrt{g^2+a^2} $, tilted by $ \\tan^{-1}(a/g) $. Everything hanging freely lines up with it.\n- **Block held on a frictionless driven wedge:** needs $ a = g\\tan\\theta $, so $ F = (M+m)g\\tan\\theta $.\n- **Block on a FREE wedge:** $ A = \\dfrac{mg\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta} $, and $ N = m(g\\cos\\theta - A\\sin\\theta) $ is less than on a fixed wedge.\n- **Always sanity-check a hard result at a limit** ($ M\\to\\infty $, $ \\theta \\to 90° $) before trusting it.',
    }),
    b('practice_bank', 7, {
      title: 'You solve it',
      intro: 'Seven questions. For each, decide which frame makes the diagram simpler before starting — and if the body rides along with the accelerating object, that frame is almost certainly the accelerating one.',
      sections: [
        {
          id: 'p11-ysi',
          title: 'Wedges, Vehicles & Pendulums',
          items: [
            num('p11-y1', 'A bob hangs in a train accelerating at 2.5 m/s². Take g = 10 m/s². Find the angle it makes with the vertical.',
              '$ \\approx 14.0° $',
              '$ \\tan\\theta = a/g = 2.5/10 = 0.25 $, so $ \\theta = \\tan^{-1}(0.25) \\approx 14.0° $.'),
            mcq('p11-y2', 'A pendulum hangs at 45° to the vertical inside an accelerating vehicle. The vehicle\'s acceleration is:',
              ['$ g/2 $, half the acceleration due to gravity', 'Exactly $ g $, since $ \\tan45° = 1 $', '$ 2g $, twice the acceleration due to gravity', '$ g\\sqrt{2} $, the diagonal of the two components'],
              1, '$ \\tan\\theta = a/g $, so at 45° we need $ \\tan45° = 1 = a/g $, giving $ a = g $.'),
            num('p11-y3', 'A 2 kg bob hangs in a bus accelerating at 6 m/s². Take g = 8 m/s² for this problem. Find the tension in the string.',
              '$ 20 $ N',
              '$ T = m\\sqrt{g^2+a^2} = 2\\sqrt{64+36} = 2\\sqrt{100} = 2(10) = 20 $ N.'),
            num('p11-y4', 'A 2 kg block rests on the frictionless 30° face of an 8 kg wedge. Find the horizontal force on the wedge that keeps the block stationary relative to it. Take g = 10 m/s², tan30° = 0.577.',
              '$ \\approx 57.7 $ N',
              '$ a = g\\tan30° = 5.77 $ m/s², and $ F = (M+m)a = 10(5.77) \\approx 57.7 $ N.'),
            mcq('p11-y5', 'For a block on a wedge free to slide on a frictionless floor, making the wedge much heavier causes its acceleration to approach:',
              ['Zero, correctly reducing to the fixed-incline case', '$ g\\sin\\theta $, the block\'s own acceleration along the face', 'Infinity, since a heavier wedge is pushed harder', '$ g $, regardless of the wedge angle involved'],
              0, 'In $ A = mg\\sin\\theta\\cos\\theta/(M+m\\sin^2\\theta) $, letting $ M \\to \\infty $ sends $ A \\to 0 $ — the wedge barely moves, which is exactly the fixed-incline problem.'),
            num('p11-y6', 'A 3 kg block is released on the frictionless 30° face of a 6 kg wedge free to slide on a frictionless floor. Take g = 10 m/s², sin30° = 0.5, cos30° = 0.866. Find the wedge\'s acceleration.',
              '$ \\approx 1.93 $ m/s²',
              'Numerator: $ mg\\sin\\theta\\cos\\theta = 3(10)(0.5)(0.866) = 12.99 $. Denominator: $ M + m\\sin^2\\theta = 6 + 3(0.25) = 6.75 $. $ A = 12.99/6.75 \\approx 1.93 $ m/s².'),
            mcq('p11-y7', 'A pseudo force applied in an accelerating frame has no Third Law partner because:',
              ['It is too small in magnitude to produce any measurable reaction', 'No physical body exerts it — it is a bookkeeping term only', 'It always acts at the exact centre of mass of the body', 'Newton\'s Third Law does not apply to accelerating objects'],
              1, 'Every real force is exerted by some body, which is what guarantees a reaction on that body. A pseudo force is introduced to compensate for measuring against an accelerating yardstick, so there is no exerting body and nothing to push back.'),
          ],
        },
      ],
    }),
    b('text', 8, {
      markdown: 'Chapter 3 established that circular motion needs an acceleration pointing at the centre, and deliberately stopped there — because naming the force that supplies it needs Newton\'s laws. The last two content pages of this chapter finally do it: the vertical circle and the conical pendulum, and then the banked road, where the surface itself is tilted to do the job that friction was struggling with.',
    }),
  ],
};

// ── run ──────────────────────────────────────────────────────────────────────
withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p10, p11]);
  console.log('\n✅ Ch.4 Wave 2b done: p10–p11 (pseudo force + lifts; wedges, vehicles, pendulums)');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
