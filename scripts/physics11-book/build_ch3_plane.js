'use strict';
/**
 * Class 11 Physics · Chapter 3 "Motion in Two Dimensions" — pages 0–3.
 * Wave 1a: the chapter opener, the independence of the two axes, position /
 * velocity / acceleration as vectors, and constant acceleration in a plane.
 *
 * NO VECTOR SECTION (founder decision — see _book_ch3.js header). p1 opens on
 * the physics. The first resolution in the chapter is done inside p1's first
 * step_solver, where it is needed, with the trig shown.
 *
 * Run: node scripts/physics11-book/build_ch3_plane.js
 */
const { b, q, st, mcq, hero, num, ensureChapter, upsertPages, withDb } = require('./_book_ch3');

// ── p0 · Chapter opener ──────────────────────────────────────────────────────
const p0 = {
  page_number: 0,
  slug: 'motion-in-two-dimensions-opener',
  title: 'Motion in Two Dimensions',
  subtitle: 'Two one-dimensional motions, happening at once, ignoring each other',
  page_type: 'chapter_opener',
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A glowing parabolic arc across a dark field, with a faint horizontal strip of evenly spaced markers below it and a faint vertical strip of bunching markers beside it.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: 'Wide cinematic illustration on a very dark near-black background. A single bright amber parabolic arc sweeping from lower left to lower right. Below the arc, a faint horizontal strip showing evenly spaced glowing markers. To the left, a faint vertical strip showing markers that bunch together towards the top and spread out towards the bottom. Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.',
    }),
    b('text', 1, {
      markdown: 'In the last chapter everything happened along one line, and a plus or minus sign was enough to say which way.\n\nNow the object can go sideways *and* up. That sounds like twice the difficulty. It is not — and the reason why is the single most useful idea in this chapter.',
    }),
    b('callout', 2, {
      variant: 'remember',
      title: 'The one sentence this chapter is built on',
      markdown: 'A motion in a plane is **two one-dimensional motions happening at the same time and ignoring each other.**\n\nOne along the x-axis. One along the y-axis. Neither one knows the other is going on. And you already solved both of them, separately, in Chapter 2.\n\nSo the method never changes: **resolve, solve each axis as a Chapter 2 problem, recombine.** The parabola, the range formula, the river-boat conditions — every result in this chapter is that sentence with arithmetic attached.',
    }),
    b('text', 3, {
      markdown: '**What is in this chapter**\n\n- Two motions at once — the desk experiment that proves they ignore each other\n- Position, velocity and acceleration as vectors, and why velocity always points along the path\n- Constant acceleration in a plane — two ways to solve it, and how to choose\n- **Projectile motion** — setting it up, time of flight, height, range, and the equation of the path\n- Thrown from a height, and the problem families that keep coming back\n- Projectiles on a slope\n- **Circular motion** — the angular language, centripetal acceleration, and what happens when the circle speeds up\n- **Relative velocity in two dimensions** — crossing a river, and walking in the rain',
    }),
    b('callout', 4, {
      variant: 'note',
      title: 'You will not find a vectors section here',
      markdown: 'Half of the standard treatment of this chapter is vector algebra — adding, subtracting, resolving, dot and cross products. **We are not going to repeat it,** because Chapter 0 already taught all of it, in more depth, with the vector boards.\n\nInstead the vector work is revised **exactly where it gets used**: the first step of a projectile solution *is* a resolution, so that step shows the trig. A relative-velocity step *is* a vector subtraction, so that step draws the triangle.\n\nIf a vector move ever feels rusty, Chapter 0 Unit C is where to go back to.',
    }),
    b('callout', 5, {
      variant: 'note',
      title: 'A note on scope — no forces in this chapter',
      markdown: 'Circular motion here stops at **acceleration**. You will find `a_c = v²/r` and where it points, and nothing about what causes it.\n\nCentripetal *force*, banked roads, the conical pendulum and vertical circles all need Newton\'s laws, so they belong to **Laws of Motion**, the next chapter. If you have already met banked roads in a coaching class, that is why they are not here yet.\n\nThis chapter is kinematics: describing the motion, not explaining it.',
    }),
  ],
};

// ── p1 · Two Motions at Once ─────────────────────────────────────────────────
const p1 = {
  page_number: 1,
  slug: 'two-motions-at-once',
  title: 'Two Motions at Once',
  subtitle: 'The desk experiment that decides the whole chapter',
  glossary: [
    { term: 'independence of motions', definition: 'In a plane, the motion along one axis is unaffected by the motion along a perpendicular axis. Each can be solved as a separate one-dimensional problem.' },
    { term: 'projectile', definition: 'Any object in flight after being thrown or projected, moving under gravity alone.' },
  ],
  blocks: [
    hero('two-motions-at-once'),
    b('curiosity_prompt', 0, {
      prompt: 'Put two coins on the edge of a desk. Flick one hard, sideways, off the edge — and at the exact same instant, just nudge the other one straight off so it drops. Which coin hits the floor first?',
      hint: 'Listen rather than watch. You are trying to hear one click or two.',
      reveal: 'You hear **one click**. They land together.\n\nOne coin flew a metre sideways; the other went straight down. They still took exactly the same time to fall.\n\nThat is not a coincidence or an approximation — it is the whole chapter. **The sideways motion did not slow the fall down, and the fall did not slow the sideways motion down.** The two motions happened side by side and completely ignored each other.\n\nDo it. It takes ten seconds and it is much more convincing than reading about it.',
    }),
    b('text', 1, {
      markdown: 'So look at what the flicked coin actually did, in two directions separately.\n\n**Sideways:** you gave it a speed, and nothing pushed it sideways after that. So it just kept going at that speed — uniform motion, the easiest case in Chapter 2.\n\n**Downwards:** it started with no downward speed at all, and gravity pulled it. So it fell exactly like something dropped from rest — free fall, Chapter 2 page 11.',
    }),
    b('step_solver', 2, {
      title: 'Proving the two coins land together',
      problem: 'One coin is flicked horizontally off a desk of height $ h $ with speed $ u $. A second is released from rest at the same edge, at the same instant. Show that they reach the floor at the same moment, whatever $ u $ is.',
      intro: 'The experiment was convincing. This is why it had to come out that way — and doing it with letters rather than numbers is what makes the result general.',
      steps: [
        st('Flicked coin, vertical column: $ \\quad u_y = 0, \\quad a_y = g, \\quad s_y = h $',
          'Flicked *horizontally* means the initial velocity has no vertical part. That is the whole proof in one line.', {
            check: {
              kind: 'mcq',
              prompt: 'For the dropped coin, the vertical column is:',
              options: [
                'The same three values: $ u_y = 0 $, $ a_y = g $, $ s_y = h $',
                '$ u_y = u $, $ a_y = g $, $ s_y = h $',
                '$ u_y = 0 $, $ a_y = g/2 $, $ s_y = h $',
                '$ u_y = 0 $, $ a_y = g $, $ s_y = h/2 $',
              ],
              answer_index: 0,
              feedback_right: 'Exactly — the two vertical columns are identical, so the answer is already settled.',
              feedback_wrong: 'The dropped coin also starts with no vertical speed, also accelerates at $ g $, and also falls $ h $. Its vertical column is word-for-word the same as the flicked coin\'s.',
            },
          }),
        st('$ h = \\tfrac{1}{2}g t^2 \\quad \\Rightarrow \\quad t = \\sqrt{\\dfrac{2h}{g}} \\quad\\text{for both} $',
          'The same equation with the same three inputs must give the same answer. There is nowhere for $ u $ to enter.', {
            why: 'Notice *why* the proof works: $ u $ is a horizontal quantity, and the vertical column contains only vertical quantities. The independence of the axes is not a physical coincidence — it is visible right there in the algebra, as the absence of any cross term.',
          }),
        st('$ t = \\sqrt{2h/g} $ — independent of $ u $.',
          'Flick it gently or fire it from a rifle; from the same height it hits the floor at the same instant.', {
            check: {
              kind: 'fill_blank',
              prompt: 'A coin leaves a $ 1.25 $ m desk. Using $ t = \\sqrt{2h/g} $ with $ g = 10 $ m/s², how many seconds does it fall?',
              blank_answer: '0.5',
              feedback_right: 'Yes — $ \\sqrt{2(1.25)/10} = \\sqrt{0.25} = 0.5 $ s.',
              feedback_wrong: '$ 2h/g = 2.5/10 = 0.25 $, so $ t = \\sqrt{0.25} = 0.5 $ s — and the sideways speed was never needed.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A helicopter flying horizontally at a steady speed $ u $ at altitude $ H $ must drop a food packet to a victim standing on the ground, in the vertical plane of the helicopter\'s motion. At what horizontal distance from the victim should the packet be released?',
        answer: '$ u\\sqrt{2H/g} $',
        solution: 'The packet leaves with the helicopter\'s horizontal velocity $ u $ and no vertical velocity, so it falls for $ t = \\sqrt{2H/g} $ — exactly the coin result with $ H $ in place of $ h $. During that time it drifts forward by $ x = ut = u\\sqrt{2H/g} $, so it must be released that far **before** reaching the victim.',
      },
    }),
    b('callout', 3, {
      variant: 'note',
      title: 'The method, fixed before any formula',
      markdown: 'Every single problem in this chapter is solved the same way:\n\n1. **Resolve** — pick two perpendicular directions and split every vector into its components along them.\n2. **Solve each axis separately**, as a one-dimensional Chapter 2 problem. The two axes share nothing except the clock.\n3. **Recombine** if the question asks for a magnitude or a direction.\n\nThe only judgement involved is step 1: *which* two directions. Usually horizontal and vertical. Sometimes — on a slope — not.',
    }),
    b('image', 3, {
      src: '',
      alt: 'Two coins leaving a desk edge at the same instant, one flicked sideways along a curved path and one dropping straight down, with dashed horizontal lines showing they are at the same height at each of four instants.',
      aspect_ratio: '16:9',
      figure_key: 'ch3-two-coins',
      caption: 'Four instants, four dashed lines. At every instant the two coins are at exactly the same height — the sideways motion changed nothing about the fall.',
    }),
    b('step_solver', 4, {
      title: 'The flicked coin, in numbers',
      problem: 'A coin is flicked horizontally off a desk at $ 1.5 $ m/s. The desk is $ 0.80 $ m high. How long is the coin in the air, and how far from the desk does it land? Take $ g = 9.8 $ m/s².',
      intro: 'Two columns, worked separately. Notice that the first question — how long? — is answered without the sideways speed ever appearing.',
      steps: [
        st('Vertically: $ \\quad u_y = 0, \\quad a_y = g = 9.8\\ \\text{m/s}^2, \\quad s_y = 0.80\\ \\text{m} $',
          'The coin was flicked horizontally, so it had no downward speed to start with. Set up the vertical column exactly as a free-fall problem.', {
            check: {
              kind: 'mcq',
              prompt: 'Which quantity does the time of fall depend on?',
              options: [
                'Only the height of the desk',
                'Only the sideways speed',
                'Both the height and the sideways speed',
                'Neither — it is the same for every fall',
              ],
              answer_index: 0,
              feedback_right: 'Right — and that is exactly why the two coins landed together.',
              feedback_wrong: 'The vertical column contains no sideways speed anywhere, so the time of fall cannot depend on it. Only the height and $ g $ appear.',
            },
          }),
        st('$ 0.80 = \\frac{1}{2}(9.8)t^2 \\quad \\Rightarrow \\quad t = \\sqrt{\\dfrac{2(0.80)}{9.8}} = 0.40\\ \\text{s} $',
          'Using $ s = ut + \\frac{1}{2}at^2 $ with $ u_y = 0 $. This is the shared clock — the one thing the two axes have in common.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Evaluate $ \\sqrt{2(0.80)/9.8} $. Give the answer in seconds to two decimal places.',
              blank_answer: '0.40',
              feedback_right: 'Yes — about 0.40 s.',
              feedback_wrong: '$ 2(0.80)/9.8 = 0.163 $, and $ \\sqrt{0.163} = 0.404 \\approx 0.40 $ s.',
            },
          }),
        st('Horizontally: $ \\quad u_x = 1.5\\ \\text{m/s}, \\quad a_x = 0 $',
          'Nothing pushes the coin sideways once it has left your finger, so the sideways speed never changes.', {
            why: 'This is the single most reusable fact in the whole chapter. **The horizontal velocity of a projectile is constant.** It does not decrease as the coin rises or falls, and it does not care what the vertical motion is doing. A surprising number of exam questions are answered by that sentence alone.',
          }),
        st('$ x = u_x t = 1.5 \\times 0.40 = 0.60\\ \\text{m} $',
          'Uniform motion for 0.40 s. The coin lands 60 cm from the foot of the desk.', {
            check: {
              kind: 'mcq',
              prompt: 'If the coin were flicked twice as fast off the same desk, it would land:',
              options: ['Twice as far away, after the same time', 'Twice as far away, after twice the time', 'Four times as far away', 'The same distance away'],
              answer_index: 0,
              feedback_right: 'Right — the time is set by the height alone, so doubling the sideways speed just doubles the sideways distance.',
              feedback_wrong: 'The time of fall depends only on the height, so it is unchanged at 0.40 s. The horizontal distance is $ u_x t $, so doubling $ u_x $ doubles the distance to 1.2 m.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A marble rolls off a table $ 1.25 $ m high at $ 2.0 $ m/s. Find the time it is in the air and how far from the table it lands. Take $ g = 10 $ m/s².',
        answer: '$ 0.50 $ s and $ 1.0 $ m',
        solution: 'Vertically: $ 1.25 = \\frac{1}{2}(10)t^2 $, so $ t^2 = 0.25 $ and $ t = 0.50 $ s. Horizontally: $ x = 2.0 \\times 0.50 = 1.0 $ m. Note again that the 2.0 m/s played no part at all in finding the time.',
      },
    }),
    b('inline_quiz', 5, {
      pass_threshold: 0.6,
      questions: [
        q('Two bullets are fired horizontally from the same height, one at $ 200 $ m/s and one at $ 400 $ m/s. Which hits the ground first?',
          ['The faster one', 'The slower one', 'They land at the same instant', 'It depends on their masses'], 2,
          'The vertical motion of each is free fall from the same height with no initial downward speed, and the horizontal speed appears nowhere in the vertical column. So both take the same time — the fast one simply lands much further away.', 2),
        q('A ball is thrown horizontally off a cliff. As it falls, its horizontal velocity:',
          ['Decreases steadily', 'Stays exactly the same', 'Increases steadily', 'Decreases and then increases'], 1,
          'There is no horizontal acceleration — gravity pulls straight down, so it has no sideways component at all. The horizontal velocity therefore never changes. Thinking it "runs out" is the single most common misconception in this chapter.', 1),
        q('A stone is dropped from a moving train. Just after release, its velocity is:',
          ['Zero, until gravity begins to act on it', 'Vertically downwards, with no sideways part', 'Equal to the train\'s velocity, horizontally', 'Opposite to the train\'s velocity, horizontally'], 2,
          'At the instant of release the stone shares the train\'s motion, so its initial velocity is the train\'s velocity, horizontal. Gravity then adds a downward velocity on top of that. The initial *acceleration*, separately, is $ g $ downwards.', 2),
      ],
    }),
    b('classify_exercise', 6, {
      question: 'A ball is thrown at an angle. Which of these quantities **change** during the flight?',
      column_label: 'Quantity',
      verdict_label: 'Changes during the flight?',
      yes_label: '✓ Changes',
      no_label: '✗ Stays the same',
      rows: [
        { substance: 'The horizontal component of velocity', is_solution: false, explanation: 'Stays the same. Gravity has no horizontal component, so nothing accelerates the ball sideways — $ v_x = u\\cos\\theta $ for the whole flight.' },
        { substance: 'The vertical component of velocity', is_solution: true, explanation: 'Changes, steadily. It falls at $ g $ per second, passes through zero at the top, and then grows downwards.' },
        { substance: 'The speed', is_solution: true, explanation: 'Changes. It is smallest at the top of the path, where only the horizontal component survives, and largest at the two ends.' },
        { substance: 'The acceleration', is_solution: false, explanation: 'Stays the same — $ g $ downwards, in size and direction, at every single instant including the top.' },
        { substance: 'The direction of the velocity', is_solution: true, explanation: 'Changes. It starts at $ +\\theta $, becomes horizontal at the top, and ends at $ -\\theta $ on level ground.' },
        { substance: 'The horizontal distance covered each second', is_solution: false, explanation: 'Stays the same, because the horizontal velocity does. Equal horizontal steps in equal times is the signature of a projectile.' },
      ],
    }),
    b('text', 7, {
      markdown: 'One more thing about the coin, and it is the thing that makes this chapter feel different from the last one.\n\nThe flicked coin was never moving in the direction it was accelerating. It moved sideways and down; gravity pulled straight down. **In one dimension that could not happen** — velocity and acceleration were stuck on the same line, so all they could do was agree or disagree in sign.\n\nIn a plane they can be at any angle. And that angle is what makes the coin *turn*.',
    }),
    b('step_solver', 8, {
      title: 'The first resolution in this chapter',
      problem: 'A ball is thrown at $ 20 $ m/s at $ 30° $ above the horizontal. Find its horizontal and vertical velocity components at the instant it leaves the hand.',
      intro: 'This is the move that starts almost every problem from here to the end of the chapter, so it is worth doing slowly once. Chapter 0 Unit C is where it came from.',
      steps: [
        st('Draw the velocity as the hypotenuse of a right triangle, with the horizontal along the ground and the vertical up the side.',
          'The angle $ 30° $ sits at the launch point, between the velocity and the ground.', {
            check: {
              kind: 'mcq',
              prompt: 'The horizontal component is the side **adjacent** to the $ 30° $ angle. Which ratio gives an adjacent side from a hypotenuse?',
              options: ['$ \\sin\\theta $', '$ \\cos\\theta $', '$ \\tan\\theta $', '$ \\cot\\theta $'],
              answer_index: 1,
              feedback_right: 'Right — adjacent over hypotenuse is the cosine.',
              feedback_wrong: 'Cosine is adjacent over hypotenuse, so the adjacent side is (hypotenuse) $ \\times \\cos\\theta $. Sine would give the opposite side, which here is the vertical component.',
            },
          }),
        st('$ u_x = u\\cos\\theta = 20\\cos 30° = 20 \\times 0.866 = 17.3\\ \\text{m/s} $',
          'The horizontal component. It is smaller than the 20 m/s you threw with — some of the speed went upwards instead.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the vertical component: evaluate $ 20\\sin 30° $, in m/s.',
              blank_answer: '10',
              feedback_right: 'Yes — $ \\sin 30° = 0.5 $, so $ u_y = 10 $ m/s.',
              feedback_wrong: '$ \\sin 30° = 1/2 $, so $ u_y = 20 \\times 0.5 = 10 $ m/s.',
            },
          }),
        st('$ u_x = 17.3\\ \\text{m/s} \\quad\\text{and}\\quad u_y = 10\\ \\text{m/s} $',
          'Written the modern way, $ \\mathbf{u} = 17.3\\,\\hat{i} + 10\\,\\hat{j} $ m/s. From here on we will write components in this form without ceremony.', {
            why: 'Check the resolution before trusting it: $ \\sqrt{17.3^2 + 10^2} = \\sqrt{299 + 100} = \\sqrt{399} \\approx 20 $ ✓. The components must always rebuild the original speed. If they do not, a sine and a cosine have been swapped — which is the most common resolution error there is.',
          }),
      ],
      now_you_try: {
        problem: 'A shell is fired at $ 50 $ m/s at $ 37° $ to the horizontal. Find its two velocity components. Take $ \\sin 37° = 0.6 $ and $ \\cos 37° = 0.8 $.',
        answer: '$ u_x = 40 $ m/s, $ u_y = 30 $ m/s',
        solution: '$ u_x = 50\\cos 37° = 50(0.8) = 40 $ m/s and $ u_y = 50\\sin 37° = 50(0.6) = 30 $ m/s. Check: $ \\sqrt{40^2 + 30^2} = \\sqrt{2500} = 50 $ ✓. This 3–4–5 launch turns up constantly, so it is worth recognising on sight.',
      },
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('A projectile is launched at $ u $ at angle $ \\theta $. Its horizontal velocity component is:',
          ['$ u\\sin\\theta $', '$ u\\cos\\theta $', '$ u\\tan\\theta $', '$ u $'], 1,
          'The horizontal is adjacent to the launch angle, so it is $ u\\cos\\theta $. A quick sanity check: at $ \\theta = 0 $ the throw is purely horizontal, and $ u\\cos 0 = u $ ✓, while $ u\\sin 0 = 0 $ would be wrong.', 1),
        q('At what launch angle are the horizontal and vertical components of the initial velocity equal?',
          ['$ 30° $', '$ 45° $', '$ 60° $', '$ 90° $'], 1,
          'Equal components need $ u\\cos\\theta = u\\sin\\theta $, so $ \\tan\\theta = 1 $ and $ \\theta = 45° $.', 1),
        q('A ball is thrown at $ 10 $ m/s vertically upwards. Its horizontal velocity component is:',
          ['$ 10 $ m/s', '$ 5 $ m/s', 'Zero', '$ 7.07 $ m/s'], 2,
          '$ \\theta = 90° $, and $ \\cos 90° = 0 $, so the horizontal component is zero. A vertical throw is the special case of a projectile where one of the two motions simply does not happen.', 1),
      ],
    }),
    b('step_solver', 10, {
      title: 'Where is the plane when the bomb lands?',
      problem: 'An aeroplane flying horizontally at $ 720 $ km/h releases a bomb from an altitude of $ 490 $ m. Find (a) how long the bomb takes to reach the ground, (b) how far it travels horizontally, and (c) where the plane is at the moment of impact. Take $ g = 9.8 $ m/s².',
      intro: 'Part (c) is the one worth thinking about before you calculate it. Most people guess wrong.',
      steps: [
        st('$ 720\\ \\text{km/h} = 720 \\times \\dfrac{5}{18} = 200\\ \\text{m/s} $',
          'Convert to SI before anything else — the same discipline as Chapter 2 page 12.', {
            check: {
              kind: 'mcq',
              prompt: 'Which column will give us the time of fall?',
              options: [
                'The vertical column, using the 490 m',
                'The horizontal column, using the 200 m/s',
                'Both together, simultaneously',
                'Neither — the time has to be given',
              ],
              answer_index: 0,
              feedback_right: 'Right — the time of a fall is always a vertical question.',
              feedback_wrong: 'The time comes from the vertical column, because that is where the height and $ g $ live. The horizontal column then uses that time to find the distance.',
            },
          }),
        st('Vertically: $ \\quad 490 = \\tfrac{1}{2}(9.8)t^2 \\quad \\Rightarrow \\quad t = 10\\ \\text{s} $',
          'Released from a horizontally flying plane, so $ u_y = 0 $ — it is a plain free-fall problem.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the horizontal distance, $ x = u_x t $. Give the answer in metres.',
              blank_answer: '2000',
              feedback_right: 'Yes — $ 200 \\times 10 = 2000 $ m, two kilometres.',
              feedback_wrong: '$ x = u_x t = 200 \\times 10 = 2000 $ m. The bomb travels two kilometres forward while falling.',
            },
          }),
        st('Horizontally: $ \\quad x = 200 \\times 10 = 2000\\ \\text{m} $',
          'Two kilometres downrange, purely because it kept the speed the plane gave it.', {
            check: {
              kind: 'mcq',
              prompt: '(c) In those same 10 s, how far has the plane flown — and so where is it?',
              options: [
                '2000 m, so it is directly above the bomb at impact',
                'Less than 2000 m, so it is behind the bomb',
                'More than 2000 m, so it is ahead of the bomb',
                'It cannot be worked out from the information given',
              ],
              answer_index: 0,
              feedback_right: 'Right — same horizontal speed, same time, same horizontal distance.',
              feedback_wrong: 'The plane also travels at 200 m/s for 10 s, so it also covers 2000 m. Both keep exactly the same horizontal velocity, so the bomb stays directly beneath the plane for the entire fall.',
            },
          }),
        st('The plane is **directly above the bomb** at the moment of impact.',
          'The bomb never falls behind. From the cockpit it appears to drop straight down the whole way.', {
            why: 'This is the two-coin result again at a scale of kilometres, and it is why bomb-aiming is a geometry problem rather than a guessing game. It also has a limit worth naming: this only holds while the plane flies **straight and level at constant speed**. Let it turn, climb or accelerate and the two horizontal motions stop matching.',
          }),
      ],
      now_you_try: {
        problem: 'A plane flying horizontally at $ 100 $ m/s at an altitude of $ 500 $ m releases a package. How far ahead of the target should it be released? Take $ g = 10 $ m/s².',
        answer: '$ 1000 $ m',
        solution: 'Vertically: $ 500 = \\frac{1}{2}(10)t^2 $, so $ t^2 = 100 $ and $ t = 10 $ s. Horizontally: $ x = 100(10) = 1000 $ m. So the package must be released a full kilometre before the target.',
      },
    }),
    b('reasoning_prompt', 11, {
      reasoning_type: 'logical',
      prompt: 'A cannon on a moving flatbed railway truck fires a shell straight up, exactly vertically as far as the gunner on the truck is concerned. The truck keeps rolling at a steady speed along a straight, level track. Does the shell land in front of the cannon, behind it, or back in the barrel?',
      reveal: '**Back in the barrel.**\n\nAt the instant of firing, the shell already shares the truck\'s horizontal velocity — and nothing takes that away, because gravity pulls only downwards. So the shell keeps drifting forwards at exactly the truck\'s speed for the whole flight, while the truck also travels at exactly that speed. They stay above and below each other the entire time.\n\nThis is the two-coin experiment again, wearing a different costume: **the vertical motion and the horizontal motion do not interfere.** The shell rises and falls; the horizontal drift is untouched by that.\n\nOne condition matters: the truck must not speed up, slow down or turn. If it does, the two horizontal motions stop matching and the shell lands behind or in front.',
      difficulty_level: 3,
    }),
    b('callout', 11, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- A motion in a plane is **two independent one-dimensional motions**, sharing only the clock.\n- **Resolve → solve each axis → recombine.** That is the method for the whole chapter.\n- $ u_x = u\\cos\\theta $, $ u_y = u\\sin\\theta $ — and always check that $ \\sqrt{u_x^2 + u_y^2} $ gives $ u $ back.\n- **The horizontal velocity of a projectile never changes**, because gravity has no horizontal component.\n- The time of a fall is set by the vertical motion alone. Sideways speed does not delay it by one instant.\n- In a plane, velocity and acceleration can be at **any** angle to each other. That is new, and it is what allows turning.',
    }),
    b('practice_bank', 12, {
      title: 'You solve it',
      intro: 'Seven questions. For each one, write the two columns — horizontal and vertical — before you write a single equation.',
      sections: [
        {
          id: 'p1-ysi',
          title: 'Two motions at once',
          items: [
            num('p1-y1', 'A ball is thrown horizontally at $ 15 $ m/s from a window $ 20 $ m above the ground. Find (a) the time to reach the ground and (b) how far from the base of the building it lands. Take $ g = 10 $ m/s².',
              '(a) $ 2 $ s  (b) $ 30 $ m',
              '(a) Vertically: $ 20 = \\frac{1}{2}(10)t^2 $, so $ t^2 = 4 $ and $ t = 2 $ s. (b) Horizontally: $ x = 15 \\times 2 = 30 $ m.'),
            mcq('p1-y2', 'A stone is thrown horizontally from a tower. Compared with a stone simply dropped from the same tower at the same instant, it reaches the ground:',
              ['Earlier', 'At the same time', 'Later', 'Later only if the tower is tall'], 1,
              'Both stones start with zero vertical velocity and fall the same height under the same $ g $, so their vertical columns are identical and they land together. The thrown stone just lands further out.'),
            num('p1-y3', 'A dart is thrown at $ 25 $ m/s at $ 53° $ above the horizontal. Find its two initial velocity components. Take $ \\sin 53° = 0.8 $, $ \\cos 53° = 0.6 $.',
              '$ u_x = 15 $ m/s, $ u_y = 20 $ m/s',
              '$ u_x = 25(0.6) = 15 $ m/s and $ u_y = 25(0.8) = 20 $ m/s. Check: $ \\sqrt{225 + 400} = \\sqrt{625} = 25 $ ✓.'),
            mcq('p1-y4', 'A packet is released from a helicopter flying horizontally at a steady speed. As seen by the pilot, the packet falls:',
              ['Straight down, staying directly below the helicopter', 'Backwards along a curve, falling behind the helicopter', 'Forwards along a curve, pulling ahead of the helicopter', 'Straight down at first, then curving backwards'], 0,
              'The packet keeps the helicopter\'s horizontal velocity, and so does the helicopter, so the two drift forwards together. From the cockpit the packet simply drops away vertically. From the ground it traces a curve — both descriptions are correct in their own frame.'),
            num('p1-y5', 'A bullet is fired horizontally at $ 300 $ m/s from a height of $ 1.8 $ m. Assuming level ground and no air resistance, how far does it travel before hitting the ground? Take $ g = 10 $ m/s².',
              '$ 180 $ m',
              'Vertically: $ 1.8 = \\frac{1}{2}(10)t^2 $, so $ t^2 = 0.36 $ and $ t = 0.6 $ s. Horizontally: $ x = 300(0.6) = 180 $ m. The bullet is only in the air for six-tenths of a second, however fast it was fired.'),
            mcq('p1-y6', 'For a projectile launched at an angle, which of these is zero at the highest point of the path?',
              ['The speed', 'The vertical component of velocity', 'The acceleration', 'The horizontal component of velocity'], 1,
              'Only $ v_y $ vanishes at the top — the ball is still moving sideways at $ u\\cos\\theta $, so the speed is not zero, and the acceleration is $ g $ downwards throughout. Believing the velocity is zero at the top is the second-most-common error in this chapter.'),
            num('p1-y7', 'A coin is flicked off a $ 0.90 $ m desk and lands $ 0.45 $ m away. What was its sideways speed? Take $ g = 10 $ m/s².',
              '$ 1.06 $ m/s',
              'Vertically: $ 0.90 = \\frac{1}{2}(10)t^2 $, so $ t^2 = 0.18 $ and $ t = 0.424 $ s. Horizontally: $ u_x = 0.45/0.424 = 1.06 $ m/s. Notice the height was needed to get the *time*, and only then could the sideways speed be found.'),
          ],
        },
      ],
    }),
    b('text', 13, {
      markdown: 'The method is settled. Before using it on projectiles, we need to be able to say properly what position, velocity and acceleration *are* when the motion is not on a line — which is the next page.',
    }),
  ],
};

// ── p2 · Position, Velocity and Acceleration as Vectors ──────────────────────
const p2 = {
  page_number: 2,
  slug: 'position-velocity-acceleration-as-vectors',
  title: 'Position, Velocity and Acceleration as Vectors',
  subtitle: 'Where it is, where it is going, and which way it is being pushed',
  glossary: [
    { term: 'position vector', definition: 'The vector from the chosen origin to the particle. In a plane, r = x î + y ĵ.' },
    { term: 'tangent', definition: 'The straight line that touches a curve at a point without crossing it. The velocity of a particle always points along the tangent to its path.' },
  ],
  blocks: [
    hero('position-velocity-acceleration-as-vectors'),
    b('curiosity_prompt', 0, {
      prompt: 'A car drives round a bend at a perfectly steady 40 km/h. The speedometer needle does not move for the whole bend. Is the car accelerating?',
      hint: 'Acceleration is the rate of change of *velocity*, not of speed.',
      reveal: '**Yes.** Strongly.\n\nVelocity has a direction in it. Round the bend, that direction is changing at every instant — so the velocity is changing, so there is an acceleration, even though no number on the dashboard moves.\n\nIn Chapter 2 this could not happen. On a straight line, changing your velocity *meant* changing your speed. In a plane the two come apart, and you can change one while leaving the other alone.\n\nThis page is about that separation, and page 11 cashes it in properly.',
    }),
    b('text', 1, {
      markdown: 'Fix an origin and two axes. The particle\'s **position vector** is then\n\n$ \\mathbf{r} = x\\,\\hat{i} + y\\,\\hat{j} $\n\nwhich is just its two coordinates, written as one object. Move from $ \\mathbf{r} $ to $ \\mathbf{r}\' $ and the **displacement** is the difference:\n\n$ \\Delta\\mathbf{r} = \\mathbf{r}\' - \\mathbf{r} = \\Delta x\\,\\hat{i} + \\Delta y\\,\\hat{j} $',
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'The same two definitions as Chapter 2, one per axis',
      markdown: '$ \\mathbf{v} = \\dfrac{d\\mathbf{r}}{dt} = v_x\\,\\hat{i} + v_y\\,\\hat{j} \\qquad\\text{where}\\qquad v_x = \\dfrac{dx}{dt}, \\quad v_y = \\dfrac{dy}{dt} $\n\n$ \\mathbf{a} = \\dfrac{d\\mathbf{v}}{dt} = a_x\\,\\hat{i} + a_y\\,\\hat{j} \\qquad\\text{where}\\qquad a_x = \\dfrac{dv_x}{dt}, \\quad a_y = \\dfrac{dv_y}{dt} $\n\nNothing here is new. **Differentiating a vector means differentiating each component separately** — which is the independence of the axes appearing again, this time in the calculus.\n\nAnd as always, magnitude and direction come from the components:\n\n$ v = \\sqrt{v_x^2 + v_y^2} \\qquad \\tan\\theta = \\dfrac{v_y}{v_x} $',
    }),
    b('step_solver', 3, {
      title: 'From a position function to everything else',
      problem: 'The position of a particle is $ \\mathbf{r} = 3.0t\\,\\hat{i} + 2.0t^2\\,\\hat{j} + 5.0\\,\\hat{k} $, with $ t $ in seconds and the coefficients in the units that make $ \\mathbf{r} $ come out in metres. Find (a) $ \\mathbf{v}(t) $ and $ \\mathbf{a}(t) $, and (b) the magnitude and direction of $ \\mathbf{v} $ at $ t = 1.0 $ s.',
      intro: 'Differentiate component by component. The $ \\hat{k} $ term is a constant, so it will look after itself.',
      steps: [
        st('$ \\mathbf{v} = \\dfrac{d\\mathbf{r}}{dt} = \\dfrac{d}{dt}\\left(3.0t\\,\\hat{i} + 2.0t^2\\,\\hat{j} + 5.0\\,\\hat{k}\\right) $',
          'Take each component in turn. This is the first component extraction on this page, so it is written out in full: the $ \\hat{i} $ coefficient is $ 3.0t $, the $ \\hat{j} $ coefficient is $ 2.0t^2 $, and the $ \\hat{k} $ coefficient is the constant $ 5.0 $.', {
            check: {
              kind: 'mcq',
              prompt: 'What is the derivative of the constant $ \\hat{k} $ term, $ 5.0 $?',
              options: ['$ 5.0 $', '$ 0 $', '$ 5.0t $', 'Undefined'],
              answer_index: 1,
              feedback_right: 'Right — a constant coordinate means no motion along that axis at all.',
              feedback_wrong: 'The derivative of a constant is zero. The particle sits permanently at $ z = 5.0 $ m, so it has no velocity in the $ \\hat{k} $ direction — the motion is entirely in a plane.',
            },
          }),
        st('$ \\mathbf{v} = 3.0\\,\\hat{i} + 4.0t\\,\\hat{j} \\quad\\text{m/s} $',
          'The $ \\hat{i} $ component is a constant 3.0 m/s; the $ \\hat{j} $ component grows steadily with time.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Differentiate once more to get $ \\mathbf{a} $. What is the coefficient of $ \\hat{j} $, in m/s²?',
              blank_answer: '4',
              feedback_right: 'Yes — $ \\mathbf{a} = 4.0\\,\\hat{j} $ m/s².',
              feedback_wrong: '$ d(4.0t)/dt = 4.0 $, so $ \\mathbf{a} = 4.0\\,\\hat{j} $ m/s² — a constant acceleration of 4.0 m/s² along the y-direction, and nothing along x.',
            },
          }),
        st('$ \\mathbf{a} = 4.0\\,\\hat{j}\\ \\text{m/s}^2 $, i.e. $ 4.0 $ m/s² along the y-direction',
          'Constant in both size and direction — so this is a constant-acceleration motion in a plane, which is exactly what the next page is about.', {
            why: 'Look at the shape of this motion: constant velocity along $ x $, constant acceleration along $ y $. That is a projectile, upside down. The mathematics does not care whether the constant acceleration comes from gravity or from anything else.',
          }),
        st('(b) At $ t = 1.0 $ s: $ \\quad \\mathbf{v} = 3.0\\,\\hat{i} + 4.0\\,\\hat{j} $, so $ v = \\sqrt{3^2 + 4^2} = 5.0\\ \\text{m/s} $',
          'Substitute, then take the magnitude from the components.', {
            check: {
              kind: 'mcq',
              prompt: 'And the direction, from $ \\tan\\theta = v_y/v_x = 4/3 $:',
              options: ['$ 37° $ with the x-axis', '$ 53° $ with the x-axis', '$ 45° $ with the x-axis', '$ 60° $ with the x-axis'],
              answer_index: 1,
              feedback_right: 'Right — $ \\tan^{-1}(4/3) \\approx 53° $.',
              feedback_wrong: '$ \\tan\\theta = 4/3 = 1.33 $, so $ \\theta = \\tan^{-1}(1.33) \\approx 53° $. The $ 37° $ answer is $ \\tan^{-1}(3/4) $ — the components the other way up, which is the usual slip here.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A particle has $ \\mathbf{r} = 3.0t\\,\\hat{i} - 2.0t^2\\,\\hat{j} + 4.0\\,\\hat{k} $ metres. Find $ \\mathbf{v} $ and $ \\mathbf{a} $, and then the magnitude and direction of the velocity at $ t = 2.0 $ s.',
        answer: '$ \\mathbf{v} = 3.0\\,\\hat{i} - 4.0t\\,\\hat{j} $, $ \\mathbf{a} = -4.0\\,\\hat{j} $ m/s²; at $ t = 2 $ s, $ v = 8.54 $ m/s at about $ 70° $ below the x-axis',
        solution: 'Differentiating: $ \\mathbf{v} = 3.0\\,\\hat{i} - 4.0t\\,\\hat{j} $ m/s and $ \\mathbf{a} = -4.0\\,\\hat{j} $ m/s². At $ t = 2.0 $ s, $ \\mathbf{v} = 3.0\\,\\hat{i} - 8.0\\,\\hat{j} $, so $ v = \\sqrt{9 + 64} = \\sqrt{73} = 8.54 $ m/s. The direction is $ \\tan^{-1}(8/3) = 69.4° $ below the x-axis, because $ v_y $ is negative.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('If $ \\mathbf{r} = 4t\\,\\hat{i} + 3t\\,\\hat{j} $ metres, the speed of the particle is:',
          ['$ 3 $ m/s', '$ 4 $ m/s', '$ 5 $ m/s', '$ 7 $ m/s'], 2,
          '$ \\mathbf{v} = 4\\,\\hat{i} + 3\\,\\hat{j} $ m/s, so $ v = \\sqrt{16 + 9} = 5 $ m/s. Adding the components arithmetically to get 7 is the classic error — components combine by Pythagoras, not by addition.', 1),
        q('A particle has $ \\mathbf{v} = 2\\,\\hat{i} + 2t\\,\\hat{j} $. Its acceleration is:',
          ['$ 2\\,\\hat{i} $', '$ 2\\,\\hat{j} $', '$ 2\\,\\hat{i} + 2\\,\\hat{j} $', 'Zero'], 1,
          'Differentiate each component: $ d(2)/dt = 0 $ and $ d(2t)/dt = 2 $, so $ \\mathbf{a} = 2\\,\\hat{j} $. The constant $ \\hat{i} $ component contributes nothing to the acceleration.', 2),
        q('For motion in a plane, the angle between the velocity and the acceleration vectors:',
          ['Must be either $ 0° $ or $ 180° $, as it was in one dimension', 'Can be anything from $ 0° $ to $ 180° $', 'Must be exactly $ 90° $ at every instant', 'Must be $ 0° $, since acceleration follows velocity'], 1,
          'In one dimension the two were locked onto the same line, so only $ 0° $ and $ 180° $ were available. In a plane any angle is possible — and that is precisely what lets a particle turn instead of merely speeding up or slowing down.', 2),
      ],
    }),
    b('heading', 5, {
      text: 'Velocity always points along the path',
      level: 2,
      objective: 'Explain why the velocity vector is tangent to the path, and read speeding-up, slowing-down and turning off the angle between v and a.',
    }),
    b('text', 6, {
      markdown: 'Take a displacement $ \\Delta\\mathbf{r} $ from a point on a curved path and shrink the time interval. The chord swings round, and in the limit it lies along the **tangent**.\n\nThis is the same limit that Chapter 2 page 3 used to turn a chord into a tangent on an x–t graph. The difference is that here the tangent is to the actual path in space.\n\nSo: **velocity is always tangent to the path, pointing the way the particle is going.** Acceleration is under no such restriction — it can point anywhere at all.',
    }),
    b('step_solver', 7, {
      title: 'Average velocity is not the average of the velocities',
      problem: 'A particle moves in a plane with $ \\mathbf{r} = (t^2)\\,\\hat{i} + (2t)\\,\\hat{j} $ metres. Find (a) its average velocity between $ t = 1 $ s and $ t = 3 $ s, and (b) its instantaneous velocity at the midpoint of that interval, $ t = 2 $ s.',
      intro: 'The two answers come out equal here — and the reason they do is more interesting than the fact.',
      steps: [
        st('$ \\mathbf{r}_1 = (1)\\,\\hat{i} + (2)\\,\\hat{j} $ m and $ \\mathbf{r}_2 = (9)\\,\\hat{i} + (6)\\,\\hat{j} $ m',
          'Substitute $ t = 1 $ and $ t = 3 $ into the position function. Average velocity always needs the two end positions, never the path between them.', {
            check: {
              kind: 'mcq',
              prompt: 'Average velocity is defined as:',
              options: [
                '$ \\Delta\\mathbf{r}/\\Delta t $, the displacement over the interval',
                'The average of the initial and final speeds',
                'The total path length over the interval',
                '$ d\\mathbf{r}/dt $ evaluated at the midpoint',
              ],
              answer_index: 0,
              feedback_right: 'Right — displacement over time interval, exactly as in Chapter 2.',
              feedback_wrong: 'Average velocity is $ \\Delta\\mathbf{r}/\\Delta t $. Path length over time is average *speed*, a different quantity — and the midpoint derivative is a coincidence here, not a definition.',
            },
          }),
        st('$ \\bar{\\mathbf{v}} = \\dfrac{\\Delta\\mathbf{r}}{\\Delta t} = \\dfrac{8\\,\\hat{i} + 4\\,\\hat{j}}{2} = 4\\,\\hat{i} + 2\\,\\hat{j}\\ \\text{m/s} $',
          'Divide the displacement vector by the time interval — which divides each component by it.', {
            check: {
              kind: 'fill_blank',
              prompt: '(b) Differentiate to get $ \\mathbf{v} = 2t\\,\\hat{i} + 2\\,\\hat{j} $. What is the $ \\hat{i} $ component at $ t = 2 $ s, in m/s?',
              blank_answer: '4',
              feedback_right: 'Yes — $ 2(2) = 4 $ m/s, the same as the average.',
              feedback_wrong: '$ v_x = 2t $, so at $ t = 2 $ s it is $ 4 $ m/s — which happens to match the average velocity\'s $ \\hat{i} $ component exactly.',
            },
          }),
        st('$ \\mathbf{v}(2) = 4\\,\\hat{i} + 2\\,\\hat{j}\\ \\text{m/s} = \\bar{\\mathbf{v}} $',
          'The instantaneous velocity at the midpoint equals the average velocity over the interval.', {
            why: 'That match is **not** a general rule — it happens because $ x $ is quadratic in $ t $ and $ y $ is linear, which makes each velocity component linear in $ t $. A linear function\'s average over an interval is its value at the midpoint. Change $ x $ to $ t^3 $ and the coincidence disappears immediately. This is the same warning Chapter 2 gave about $ \\bar{v} = (u+v)/2 $: it needs constant acceleration.',
          }),
      ],
      now_you_try: {
        problem: 'A particle has $ \\mathbf{r} = (3t)\\,\\hat{i} + (t^2)\\,\\hat{j} $ metres. Find its average velocity between $ t = 0 $ and $ t = 4 $ s.',
        answer: '$ 3\\,\\hat{i} + 4\\,\\hat{j} $ m/s, magnitude $ 5 $ m/s',
        solution: '$ \\mathbf{r}(0) = \\mathbf{0} $ and $ \\mathbf{r}(4) = 12\\,\\hat{i} + 16\\,\\hat{j} $ m. So $ \\bar{\\mathbf{v}} = (12\\,\\hat{i} + 16\\,\\hat{j})/4 = 3\\,\\hat{i} + 4\\,\\hat{j} $ m/s, with magnitude $ \\sqrt{9+16} = 5 $ m/s.',
      },
    }),
    b('step_solver', 8, {
      title: 'Reading the angle between v and a',
      problem: 'A particle moves along a curve. At one instant its velocity is $ \\mathbf{v} = 3\\,\\hat{i} + 4\\,\\hat{j} $ m/s and its acceleration is $ \\mathbf{a} = -6\\,\\hat{i} - 8\\,\\hat{j} $ m/s². Is the particle speeding up, slowing down, or turning at constant speed?',
      intro: 'The test is the angle between the two vectors, and the quickest way to that angle is the dot product.',
      steps: [
        st('$ \\mathbf{v}\\cdot\\mathbf{a} = (3)(-6) + (4)(-8) = -18 - 32 = -50 $',
          'Component-wise: multiply the $ \\hat{i} $ parts, multiply the $ \\hat{j} $ parts, add. The identity being used is $ \\mathbf{v}\\cdot\\mathbf{a} = |\\mathbf{v}||\\mathbf{a}|\\cos\\phi $, so the **sign** of the dot product is the sign of $ \\cos\\phi $.', {
            check: {
              kind: 'mcq',
              prompt: 'A negative dot product means the angle between the two vectors is:',
              options: ['Less than $ 90° $', 'Exactly $ 90° $', 'More than $ 90° $', 'Exactly $ 180° $'],
              answer_index: 2,
              feedback_right: 'Right — $ \\cos\\phi < 0 $ means an obtuse angle.',
              feedback_wrong: '$ \\mathbf{v}\\cdot\\mathbf{a} = |\\mathbf{v}||\\mathbf{a}|\\cos\\phi $, and the magnitudes are always positive, so a negative result needs $ \\cos\\phi < 0 $ — an angle greater than $ 90° $. It need not be exactly $ 180° $.',
            },
          }),
        st('$ \\mathbf{v}\\cdot\\mathbf{a} < 0 \\quad\\Rightarrow\\quad $ the acceleration has a component **against** the velocity',
          'So the particle is slowing down.', {
            why: 'This is the general rule, and it is worth more than the specific answer:\n\n$ \\mathbf{v}\\cdot\\mathbf{a} > 0 $ → speeding up · $ \\mathbf{v}\\cdot\\mathbf{a} < 0 $ → slowing down · $ \\mathbf{v}\\cdot\\mathbf{a} = 0 $ → **turning at constant speed**.\n\nThe last one is the case that did not exist in one dimension, and it is exactly uniform circular motion.',
          }),
        st('Here $ \\mathbf{a} = -2\\mathbf{v} $ — the acceleration is exactly antiparallel to the velocity.',
          'Check the components: $ -6 = -2(3) $ and $ -8 = -2(4) $. So the angle is a full $ 180° $, and the particle is slowing down along a straight line without turning at all.', {
            check: {
              kind: 'mcq',
              prompt: 'If instead $ \\mathbf{a} $ had been $ 4\\,\\hat{i} - 3\\,\\hat{j} $ m/s², the particle would be:',
              options: ['Speeding up', 'Slowing down', 'Turning at constant speed', 'At rest'],
              answer_index: 2,
              feedback_right: 'Right — $ (3)(4) + (4)(-3) = 0 $, so $ \\mathbf{a} \\perp \\mathbf{v} $.',
              feedback_wrong: '$ \\mathbf{v}\\cdot\\mathbf{a} = (3)(4) + (4)(-3) = 12 - 12 = 0 $. A perpendicular acceleration changes only the direction of the velocity, never its magnitude — so the speed stays at 5 m/s while the particle turns.',
            },
          }),
      ],
      now_you_try: {
        problem: 'At some instant a particle has $ \\mathbf{v} = 5\\,\\hat{i} - 2\\,\\hat{j} $ m/s and $ \\mathbf{a} = 2\\,\\hat{i} + 3\\,\\hat{j} $ m/s². Is it speeding up or slowing down?',
        answer: 'Speeding up',
        solution: '$ \\mathbf{v}\\cdot\\mathbf{a} = (5)(2) + (-2)(3) = 10 - 6 = +4 $. The dot product is positive, so the angle between velocity and acceleration is acute and the speed is increasing — even though the two vectors are far from parallel, and the particle is also turning.',
      },
    }),
    b('image', 8, {
      src: '',
      alt: 'A curved path with velocity arrows drawn tangent to the curve at three points and acceleration arrows at an acute, a right, and an obtuse angle to it, each labelled speeding up, turning, or slowing down, with the dot-product test given underneath each.',
      aspect_ratio: '16:9',
      figure_key: 'ch3-tangent-and-acceleration',
      caption: 'The same test as the step-solver above, read straight off the picture: an acute angle between v and a speeds the particle up, a right angle only turns it, an obtuse angle slows it down.',
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.6,
      questions: [
        q('The velocity of a particle moving along a curved path is always directed:',
          ['Towards the centre of curvature', 'Along the tangent to the path', 'Along the acceleration', 'Away from the origin'], 1,
          'Shrinking the time interval swings the chord onto the tangent, so the instantaneous velocity lies along the tangent, pointing the way the particle is travelling. This is true for every curved path, not only for circles.', 1),
        q('If the acceleration of a particle is always perpendicular to its velocity, then:',
          ['The particle moves in a straight line', 'The speed is constant but the direction changes', 'The particle is at rest', 'The speed changes but the direction does not'], 1,
          'A perpendicular acceleration has no component along the velocity, so it cannot change the speed — only the direction. This is exactly the condition satisfied in uniform circular motion.', 2),
        q('A particle has a non-zero velocity and zero acceleration at some instant. At that instant it is:',
          ['Turning, since a change of direction needs no acceleration', 'Speeding up along its current direction of travel', 'Momentarily moving in a straight line at constant speed', 'At rest, because the acceleration has vanished'], 2,
          'No acceleration means neither the speed nor the direction is changing at that instant, so the motion is momentarily straight and steady. Note this says nothing about the next instant — the acceleration may pick up again.', 2),
        q('For a projectile in flight, the angle between the velocity and the acceleration is $ 90° $:',
          ['At every instant', 'Never', 'At exactly one instant', 'At exactly two instants'], 2,
          'The acceleration is always straight down, so the angle is $ 90° $ only when the velocity is horizontal — which happens once, at the top of the path. Before that the ball is rising and slowing; after it, falling and speeding up.', 3),
      ],
    }),
    b('step_solver', 10, {
      title: 'Getting the direction right when a component is negative',
      problem: 'At some instant a particle has $ \\mathbf{v} = -3\\,\\hat{i} + 4\\,\\hat{j} $ m/s. Find its speed and the direction of its motion.',
      intro: 'The speed is easy. The direction is where marks are lost every year, because a calculator does not know which quadrant you are in.',
      steps: [
        st('$ v = \\sqrt{(-3)^2 + 4^2} = \\sqrt{9 + 16} = 5\\ \\text{m/s} $',
          'Squaring kills the minus sign, so the speed is unaffected by which way the components point.', {
            check: {
              kind: 'mcq',
              prompt: 'With $ v_x $ negative and $ v_y $ positive, which quadrant is the velocity pointing into?',
              options: ['First — right and up', 'Second — left and up', 'Third — left and down', 'Fourth — right and down'],
              answer_index: 1,
              feedback_right: 'Right — negative x means leftwards, positive y means upwards.',
              feedback_wrong: 'A negative $ v_x $ points in the $ -x $ direction (left) and a positive $ v_y $ points up, which is the second quadrant. Sketching the two components before touching a calculator is what prevents this error.',
            },
          }),
        st('$ \\tan\\theta = \\dfrac{v_y}{v_x} = \\dfrac{4}{-3} \\quad \\Rightarrow \\quad \\tan^{-1}(-1.33) = -53° $',
          'And this is the trap: a calculator returns $ -53° $, which points down and to the right — the *opposite* of where the particle is actually going.', {
            why: 'The inverse tangent only ever returns an angle between $ -90° $ and $ +90° $, so it can only ever name the first or fourth quadrant. It has no way to distinguish $ (-3, 4) $ from $ (3, -4) $, because both give the same ratio. **The calculator cannot do this step for you — the sketch has to.**',
          }),
        st('The true direction is $ 180° - 53° = 127° $ from the $ +x $ axis.',
          'Or, said more usefully: $ 53° $ above the $ -x $ direction — up and to the left, which is what the sketch showed.', {
            check: {
              kind: 'mcq',
              prompt: 'If instead $ \\mathbf{v} = -3\\,\\hat{i} - 4\\,\\hat{j} $ m/s, the direction would be:',
              options: ['$ 53° $ from the $ +x $ axis', '$ 127° $ from the $ +x $ axis', '$ 233° $ from the $ +x $ axis', '$ -53° $ from the $ +x $ axis'],
              answer_index: 2,
              feedback_right: 'Right — third quadrant, so $ 180° + 53° = 233° $.',
              feedback_wrong: 'Both components are negative, so the velocity points left and down — the third quadrant. That is $ 180° + 53° = 233° $ from the $ +x $ axis. The calculator would again say $ +53° $, which is the first quadrant and wrong.',
            },
          }),
      ],
      now_you_try: {
        problem: 'A particle has $ \\mathbf{v} = 5\\,\\hat{i} - 12\\,\\hat{j} $ m/s. Find its speed and direction.',
        answer: '$ 13 $ m/s, at $ 67.4° $ below the $ +x $ axis',
        solution: '$ v = \\sqrt{25 + 144} = \\sqrt{169} = 13 $ m/s. Since $ v_x > 0 $ and $ v_y < 0 $ the velocity is in the fourth quadrant, so the calculator\'s $ \\tan^{-1}(-12/5) = -67.4° $ is correct as it stands: $ 67.4° $ below the $ +x $ axis.',
      },
    }),
    b('callout', 11, {
      variant: 'remember',
      title: 'Carry these forward',
      markdown: '- $ \\mathbf{r} = x\\hat{i} + y\\hat{j} $, $ \\mathbf{v} = d\\mathbf{r}/dt $, $ \\mathbf{a} = d\\mathbf{v}/dt $ — **differentiate component by component.**\n- $ v = \\sqrt{v_x^2 + v_y^2} $ and $ \\tan\\theta = v_y/v_x $. Components combine by Pythagoras, never by addition.\n- **Velocity is always tangent to the path.** Acceleration can point anywhere.\n- The angle between $ \\mathbf{v} $ and $ \\mathbf{a} $ tells you what happens next: $ \\mathbf{v}\\cdot\\mathbf{a} > 0 $ speeding up, $ < 0 $ slowing down, $ = 0 $ **turning at constant speed**.\n- Constant speed does **not** mean zero acceleration. That is the one-dimensional habit this chapter has to break.',
    }),
    b('practice_bank', 11, {
      title: 'You solve it',
      intro: 'Seven questions. Where a direction is asked for, say what it is measured from.',
      sections: [
        {
          id: 'p2-ysi',
          title: 'Vectors of motion',
          items: [
            num('p2-y1', 'A particle has $ \\mathbf{r} = (2t^2)\\,\\hat{i} + (3t)\\,\\hat{j} $ metres. Find its velocity and acceleration at $ t = 2 $ s.',
              '$ \\mathbf{v} = 8\\,\\hat{i} + 3\\,\\hat{j} $ m/s, $ \\mathbf{a} = 4\\,\\hat{i} $ m/s²',
              '$ \\mathbf{v} = 4t\\,\\hat{i} + 3\\,\\hat{j} $, so at $ t = 2 $ s, $ \\mathbf{v} = 8\\,\\hat{i} + 3\\,\\hat{j} $ m/s. Differentiating again, $ \\mathbf{a} = 4\\,\\hat{i} $ m/s², constant.'),
            mcq('p2-y2', 'A particle moves so that its speed is constant but its velocity is not. This is possible only if:',
              ['Its acceleration is zero', 'It moves along a curved path', 'It moves along a straight line', 'Its acceleration is parallel to its velocity'], 1,
              'Constant speed with changing velocity means the direction is changing, which is what a curved path is. The acceleration must be non-zero and perpendicular to the velocity at every instant.'),
            num('p2-y3', 'At an instant a particle has $ \\mathbf{v} = 6\\,\\hat{i} + 8\\,\\hat{j} $ m/s. Find its speed and the angle its velocity makes with the x-axis.',
              '$ 10 $ m/s at $ 53° $',
              '$ v = \\sqrt{36 + 64} = 10 $ m/s, and $ \\tan\\theta = 8/6 = 1.33 $, so $ \\theta = 53° $ above the x-axis.'),
            mcq('p2-y4', 'For a particle with $ \\mathbf{v} = 2\\,\\hat{i} + 3\\,\\hat{j} $ m/s and $ \\mathbf{a} = -3\\,\\hat{i} + 2\\,\\hat{j} $ m/s², the speed at that instant is:',
              ['Increasing at that instant', 'Decreasing at that instant', 'Momentarily unchanging', 'Zero at that instant'], 2,
              '$ \\mathbf{v}\\cdot\\mathbf{a} = (2)(-3) + (3)(2) = -6 + 6 = 0 $, so the acceleration is perpendicular to the velocity and the speed is momentarily unchanging. The particle is turning.'),
            num('p2-y5', 'A particle starts at $ \\mathbf{r}_1 = 2\\,\\hat{i} + 3\\,\\hat{j} $ m and $ 4 $ s later is at $ \\mathbf{r}_2 = 10\\,\\hat{i} + 9\\,\\hat{j} $ m. Find its average velocity and its magnitude.',
              '$ 2\\,\\hat{i} + 1.5\\,\\hat{j} $ m/s, magnitude $ 2.5 $ m/s',
              '$ \\Delta\\mathbf{r} = 8\\,\\hat{i} + 6\\,\\hat{j} $ m, so $ \\bar{\\mathbf{v}} = \\Delta\\mathbf{r}/\\Delta t = 2\\,\\hat{i} + 1.5\\,\\hat{j} $ m/s, and $ |\\bar{\\mathbf{v}}| = \\sqrt{4 + 2.25} = 2.5 $ m/s.'),
            mcq('p2-y6', 'A motorcyclist rides at a steady speed around a circular track. Which quantity is constant?',
              ['The velocity vector, in both size and direction', 'The magnitude of the acceleration', 'The acceleration vector, in size and direction', 'The displacement from the starting point'], 1,
              'The speed is constant, so the *magnitude* of the centripetal acceleration is constant too. But its direction always points at the centre, which keeps changing — so the acceleration vector itself is not constant, and neither is the velocity.'),
            num('p2-y7', 'A particle has $ \\mathbf{v} = (3t^2)\\,\\hat{i} + (4t)\\,\\hat{j} $ m/s. Find the magnitude of its acceleration at $ t = 1 $ s.',
              '$ 7.21 $ m/s²',
              '$ \\mathbf{a} = 6t\\,\\hat{i} + 4\\,\\hat{j} $, so at $ t = 1 $ s, $ \\mathbf{a} = 6\\,\\hat{i} + 4\\,\\hat{j} $ m/s² and $ |\\mathbf{a}| = \\sqrt{36 + 16} = \\sqrt{52} = 7.21 $ m/s².'),
          ],
        },
      ],
    }),
    b('text', 12, {
      markdown: 'Those definitions work for any motion at all, however wild. But one particular case is worth a page of its own, because it covers almost everything in this chapter: **the acceleration is constant.**',
    }),
  ],
};

// ── p3 · Constant Acceleration in a Plane ────────────────────────────────────
const p3 = {
  page_number: 3,
  slug: 'constant-acceleration-in-a-plane',
  title: 'Constant Acceleration in a Plane — Two Ways to Solve It',
  subtitle: 'One vector equation, or six scalar ones. Learn to choose.',
  glossary: [
    { term: 'component method', definition: 'Solving a plane-motion problem by resolving every vector onto two perpendicular axes and applying the one-dimensional equations of motion separately on each.' },
  ],
  blocks: [
    hero('constant-acceleration-in-a-plane'),
    b('curiosity_prompt', 0, {
      prompt: 'A particle is moving at 2 m/s. A constant acceleration of 2 m/s² switches on, at 60° to the direction it is already moving. Where is it 2 seconds later — and is it still going the same way?',
      hint: 'You know three equations of motion. Do they work for vectors?',
      reveal: 'They do — **unchanged**, as long as you treat $ \\mathbf{u} $, $ \\mathbf{v} $, $ \\mathbf{a} $ and $ \\mathbf{s} $ as vectors:\n\n$ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t \\qquad \\mathbf{s} = \\mathbf{u}t + \\tfrac{1}{2}\\mathbf{a}t^2 $\n\nAnd it is definitely not going the same way. The acceleration keeps adding velocity in its own direction, so the total velocity swings steadily towards it.\n\nThere are two honest routes to the answer, and this page is about knowing which one to reach for. One is elegant. The other is the one you will use in the exam.',
    }),
    b('text', 1, {
      markdown: 'NCERT gets the two vector equations from exactly the same argument Chapter 2 used, with the average velocity $ (\\mathbf{u} + \\mathbf{v})/2 $ doing the work.\n\nThe important line comes after: writing them in components gives\n\n$ x = x_0 + u_x t + \\tfrac{1}{2}a_x t^2 \\qquad y = y_0 + u_y t + \\tfrac{1}{2}a_y t^2 $\n\nand these two do not talk to each other. **A plane motion with constant acceleration is two independent one-dimensional constant-acceleration motions** — page 1\'s sentence, now proved rather than demonstrated with coins.',
    }),
    b('step_solver', 2, {
      title: 'Which method, and what is the first line?',
      problem: 'For each of these three questions, decide whether Method 1 (one vector calculation) or Method 2 (six scalar equations) is the better tool — and say what the first line of working would be.',
      intro: 'Choosing the tool is a skill in its own right, and it is faster to practise here than to discover halfway through a solution. All three refer to a ball thrown at $ u $ at angle $ \\theta $.',
      steps: [
        st('(i) "Find the velocity vector $ 2 $ s after launch."',
          'Time is given, and a vector is asked for.', {
            check: {
              kind: 'mcq',
              prompt: 'Which method, and what is the first line?',
              options: [
                'Method 1 — write $ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t $ and substitute',
                'Method 2 — write $ s_y = u_y t + \\frac{1}{2}a_y t^2 $ and set $ s_y = 0 $',
                'Method 2 — write $ v_x^2 = u_x^2 + 2a_x s_x $',
                'Method 1 — write $ v^2 = u^2 + 2as $ using total magnitudes',
              ],
              answer_index: 0,
              feedback_right: 'Right — this is exactly what Method 1 is for.',
              feedback_wrong: 'With $ t $ given and a vector wanted, one substitution into $ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t $ finishes it. Breaking it into components would work too, but it is more writing for the same answer.',
            },
          }),
        st('(ii) "Find how long the ball stays in the air."',
          'Nothing is known about the time — it is the unknown. And the condition is about one axis only: the ball is back at $ y = 0 $.', {
            check: {
              kind: 'mcq',
              prompt: 'Which method, and what is the first line?',
              options: [
                'Method 1 — write $ \\mathbf{s} = \\mathbf{u}t + \\frac{1}{2}\\mathbf{a}t^2 $ and set $ \\mathbf{s} = \\mathbf{0} $',
                'Method 2 — write $ s_y = u_y t + \\frac{1}{2}a_y t^2 $ with $ s_y = 0 $',
                'Method 2 — write $ s_x = u_x t $ with $ s_x = 0 $',
                'Either one works equally well here',
              ],
              answer_index: 1,
              feedback_right: 'Right — a single-axis condition with an unknown time is Method 2\'s home ground.',
              feedback_wrong: 'The landing condition is $ s_y = 0 $, about the vertical axis alone. Setting the whole *vector* $ \\mathbf{s} $ to zero would be wrong — the ball has moved a long way horizontally, so its displacement is not zero.',
            },
          }),
        st('(iii) "Find the speed when the ball is $ 5 $ m above the ground."',
          'No time given, no time asked for, and a height is specified — which should sound familiar from Chapter 2 page 10.', {
            check: {
              kind: 'mcq',
              prompt: 'Which method, and what is the first line?',
              options: [
                'Method 1 — write $ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t $',
                'Method 2 — write $ v_y^2 = u_y^2 + 2a_y s_y $ with $ s_y = 5 $',
                'Method 2 — write $ v_y = u_y + a_y t $',
                'Method 1 — find $ t $ first, then substitute',
              ],
              answer_index: 1,
              feedback_right: 'Right — the time-free equation, on the vertical axis, then recombine with the unchanged $ v_x $.',
              feedback_wrong: 'Time is neither given nor wanted, so use the equation without $ t $ in it — on the vertical axis, since that is where the 5 m lives. Then $ v = \\sqrt{v_x^2 + v_y^2} $ with $ v_x = u\\cos\\theta $ unchanged.',
            },
          }),
        st('Two of the three went to Method 2. That ratio is about right for the rest of this chapter.',
          'Method 1 is the elegant special case. Method 2 is what you will actually write in an exam.', {
            why: 'The pattern to take away: **Method 1 answers questions about the whole vector at a known time. Method 2 answers questions about one axis, usually with the time unknown.** Almost every question worth asking about a projectile — when does it land, how high, how far, how fast at that height — is of the second kind.',
          }),
      ],
      now_you_try: {
        problem: 'Which method would you use for: "a particle with $ \\mathbf{u} = 3\\,\\hat{i} + 4\\,\\hat{j} $ m/s and $ \\mathbf{a} = 2\\,\\hat{i} $ m/s² — find its displacement after $ 3 $ s"? And for "find when its velocity is parallel to the x-axis"?',
        answer: 'Method 1 for the first; Method 2 for the second',
        solution: 'The first gives $ t $ and wants a vector, so one substitution into $ \\mathbf{s} = \\mathbf{u}t + \\frac{1}{2}\\mathbf{a}t^2 $ gives $ 9\\,\\hat{i} + 12\\,\\hat{j} + 9\\,\\hat{i} = 18\\,\\hat{i} + 12\\,\\hat{j} $ m. The second is a single-axis condition ($ v_y = 0 $) with $ t $ unknown — Method 2. Here $ a_y = 0 $, so $ v_y $ stays at 4 m/s and never becomes zero: the velocity is **never** parallel to the x-axis.',
      },
    }),
    b('callout', 3, {
      variant: 'note',
      title: 'The two methods, side by side',
      markdown: '**Method 1 — one vector calculation.** Write $ \\mathbf{u} $ and $ \\mathbf{a} $ in $ \\hat{i},\\hat{j} $ form and use\n\n$ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t \\qquad \\mathbf{s} = \\mathbf{u}t + \\tfrac{1}{2}\\mathbf{a}t^2 $\n\nQuick and clean when the question gives you $ t $ and asks for $ \\mathbf{v} $ or $ \\mathbf{s} $.\n\n**Method 2 — six scalar equations.** Pick two perpendicular directions, find $ u_x, a_x, u_y, a_y $, and run the Chapter 2 trio on each axis:\n\n| Along x | Along y |\n|---|---|\n| $ v_x = u_x + a_x t $ | $ v_y = u_y + a_y t $ |\n| $ s_x = u_x t + \\frac{1}{2}a_x t^2 $ | $ s_y = u_y t + \\frac{1}{2}a_y t^2 $ |\n| $ v_x^2 = u_x^2 + 2a_x s_x $ | $ v_y^2 = u_y^2 + 2a_y s_y $ |\n\n**Method 2 is the workhorse.** It is the only one that copes when the time is unknown, or when the two axes are asked about separately — which is almost every projectile question there is.',
    }),
    b('step_solver', 3, {
      title: 'Method 1 in action',
      problem: 'A particle is projected with a velocity of $ 50 $ m/s at $ 37° $ to the horizontal. Find its velocity and displacement after $ 2 $ s. Take $ g = 10 $ m/s², $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
      intro: 'Time is given and vectors are asked for, so Method 1 is the right tool. One line each.',
      steps: [
        st('$ \\mathbf{u} = (50\\cos 37°)\\,\\hat{i} + (50\\sin 37°)\\,\\hat{j} = 40\\,\\hat{i} + 30\\,\\hat{j}\\ \\text{m/s} $',
          'The resolution first, as always. This is the first component extraction on this page, so it is shown in full.', {
            check: {
              kind: 'mcq',
              prompt: 'And the acceleration vector, with upwards positive?',
              options: ['$ +10\\,\\hat{j} $ m/s²', '$ -10\\,\\hat{j} $ m/s²', '$ -10\\,\\hat{i} $ m/s²', '$ 10\\,\\hat{i} - 10\\,\\hat{j} $ m/s²'],
              answer_index: 1,
              feedback_right: 'Right — gravity acts straight down, and down is negative here.',
              feedback_wrong: 'Gravity pulls vertically downwards with no horizontal part at all, so $ \\mathbf{a} = -g\\,\\hat{j} = -10\\,\\hat{j} $ m/s². The minus sign is because we chose upwards as positive.',
            },
          }),
        st('$ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t = (40\\,\\hat{i} + 30\\,\\hat{j}) + (-10\\,\\hat{j})(2) = 40\\,\\hat{i} + 10\\,\\hat{j}\\ \\text{m/s} $',
          'The $ \\hat{i} $ component is untouched — nothing accelerates it. The $ \\hat{j} $ component has lost 20 m/s in two seconds.', {
            check: {
              kind: 'fill_blank',
              prompt: 'What is the speed at $ t = 2 $ s? Give the answer in m/s to one decimal place.',
              blank_answer: '41.2',
              feedback_right: 'Yes — $ \\sqrt{1600 + 100} = \\sqrt{1700} = 41.2 $ m/s.',
              feedback_wrong: '$ v = \\sqrt{40^2 + 10^2} = \\sqrt{1700} = 41.2 $ m/s. Note this is *less* than the launch speed of 50 m/s, because the vertical component has been eaten into.',
            },
          }),
        st('$ \\mathbf{s} = \\mathbf{u}t + \\tfrac{1}{2}\\mathbf{a}t^2 = (40\\,\\hat{i} + 30\\,\\hat{j})(2) + \\tfrac{1}{2}(-10\\,\\hat{j})(4) $',
          'Substituting into the second equation. Take the arithmetic one component at a time.', {
            check: {
              kind: 'mcq',
              prompt: 'Evaluate it. The displacement is:',
              options: ['$ 80\\,\\hat{i} + 60\\,\\hat{j} $ m', '$ 80\\,\\hat{i} + 40\\,\\hat{j} $ m', '$ 80\\,\\hat{i} + 20\\,\\hat{j} $ m', '$ 40\\,\\hat{i} + 40\\,\\hat{j} $ m'],
              answer_index: 1,
              feedback_right: 'Right — $ 60 - 20 = 40 $ in the $ \\hat{j} $ component.',
              feedback_wrong: 'The $ \\hat{i} $ part is $ 40(2) = 80 $ m. The $ \\hat{j} $ part is $ 30(2) - \\frac{1}{2}(10)(4) = 60 - 20 = 40 $ m. So $ \\mathbf{s} = 80\\,\\hat{i} + 40\\,\\hat{j} $ m.',
            },
          }),
        st('$ \\mathbf{s} = 80\\,\\hat{i} + 40\\,\\hat{j}\\ \\text{m} $ — so the particle is at $ (80, 40) $ relative to the launch point.',
          'Two equations, four lines, done. That is Method 1 at its best.', {
            why: 'Now notice what Method 1 could **not** have told you easily: when does the particle land? For that you need $ s_y = 0 $ and an unknown $ t $ — a single scalar equation on one axis. Method 1 has no natural way to ask a question about only one component. That is exactly where Method 2 takes over.',
          }),
      ],
      now_you_try: {
        problem: 'A particle is projected from the ground at $ 40\\sqrt{2} $ m/s at $ 45° $. Find its velocity and displacement after $ 2 $ s. Take $ g = 10 $ m/s².',
        answer: '$ \\mathbf{v} = 40\\,\\hat{i} + 20\\,\\hat{j} $ m/s; $ \\mathbf{s} = 80\\,\\hat{i} + 60\\,\\hat{j} $ m',
        solution: '$ \\mathbf{u} = 40\\sqrt{2}\\cos 45°\\,\\hat{i} + 40\\sqrt{2}\\sin 45°\\,\\hat{j} = 40\\,\\hat{i} + 40\\,\\hat{j} $ m/s, and $ \\mathbf{a} = -10\\,\\hat{j} $ m/s². Then $ \\mathbf{v} = 40\\,\\hat{i} + (40 - 20)\\,\\hat{j} = 40\\,\\hat{i} + 20\\,\\hat{j} $ m/s. And $ \\mathbf{s} = (40\\,\\hat{i} + 40\\,\\hat{j})(2) - \\frac{1}{2}(10)(4)\\,\\hat{j} = 80\\,\\hat{i} + (80 - 20)\\,\\hat{j} = 80\\,\\hat{i} + 60\\,\\hat{j} $ m.',
      },
    }),
    b('inline_quiz', 4, {
      pass_threshold: 0.6,
      questions: [
        q('A particle starts from rest with a constant acceleration $ \\mathbf{a} = 3\\,\\hat{i} + 4\\,\\hat{j} $ m/s². Its speed after $ 2 $ s is:',
          ['$ 5 $ m/s', '$ 7 $ m/s', '$ 10 $ m/s', '$ 14 $ m/s'], 2,
          '$ \\mathbf{v} = \\mathbf{a}t = 6\\,\\hat{i} + 8\\,\\hat{j} $ m/s, so $ v = \\sqrt{36 + 64} = 10 $ m/s. Starting from rest, the velocity is always parallel to the acceleration.', 2),
        q('Which of the two methods is better suited to the question "at what time does the projectile hit the ground?"',
          ['Method 1, the vector equations', 'Method 2, the six scalar equations', 'Neither — that question needs energy', 'Both are equally convenient'], 1,
          'The condition is about one component only ($ s_y = 0 $), with the time unknown. Method 2 isolates that single scalar equation immediately, while Method 1 would need the vector equation to be broken up anyway.', 2),
        q('For a plane motion with constant acceleration, the x-motion and the y-motion:',
          ['Must have the same acceleration as each other', 'Are completely independent, sharing only the time', 'Must both start from rest at the same instant', 'Always have equal displacements in equal times'], 1,
          'The component equations contain no cross terms, so neither axis appears in the other\'s equations. Nothing is shared but the clock $ t $ — and that shared clock is what links them when you need to.', 1),
      ],
    }),
    b('step_solver', 5, {
      title: 'Method 2, when a single component is the question',
      problem: 'A particle starts from the origin at $ t = 0 $ with a velocity of $ 5.0\\,\\hat{i} $ m/s and moves in the x-y plane under a constant acceleration of $ (3.0\\,\\hat{i} + 2.0\\,\\hat{j}) $ m/s². (a) What is the y-coordinate when the x-coordinate is $ 84 $ m? (b) What is the speed at that instant?',
      intro: 'The question fixes one coordinate and asks about the other, so this is Method 2 territory. The x-axis gives the time; the time then unlocks the y-axis.',
      steps: [
        st('Along x: $ \\quad u_x = 5.0, \\quad a_x = 3.0 \\quad\\Rightarrow\\quad x = 5.0t + 1.5t^2 $',
          'The x-column on its own. Set it equal to 84 m and solve for the time.', {
            check: {
              kind: 'mcq',
              prompt: 'Solve $ 5.0t + 1.5t^2 = 84 $ for the positive root.',
              options: ['$ t = 4 $ s', '$ t = 6 $ s', '$ t = 7 $ s', '$ t = 8 $ s'],
              answer_index: 1,
              feedback_right: 'Right — $ 30 + 54 = 84 $ ✓.',
              feedback_wrong: 'Try $ t = 6 $: $ 5(6) + 1.5(36) = 30 + 54 = 84 $ ✓. Rearranged it is $ 1.5t^2 + 5t - 84 = 0 $, whose positive root is 6 s.',
            },
          }),
        st('$ t = 6\\ \\text{s} $ — this is the bridge between the two axes.',
          'The x-axis has now done its job. Everything else follows from the clock reading it produced.', {
            why: 'This is the shape of nearly every two-dimensional problem you will meet: **one axis gives you the time; the time unlocks the other axis.** Which axis goes first is decided by whichever one the question hands you enough information about.',
          }),
        st('Along y: $ \\quad u_y = 0, \\quad a_y = 2.0 \\quad\\Rightarrow\\quad y = \\tfrac{1}{2}(2.0)(6)^2 = 36\\ \\text{m} $',
          'The particle had no initial y-velocity, so the y-column is a from-rest problem.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Now the velocity components at $ t = 6 $ s. What is $ v_x = u_x + a_x t $, in m/s?',
              blank_answer: '23',
              feedback_right: 'Yes — $ 5 + 3(6) = 23 $ m/s.',
              feedback_wrong: '$ v_x = u_x + a_x t = 5.0 + 3.0(6) = 23 $ m/s.',
            },
          }),
        st('$ v_x = 23\\ \\text{m/s}, \\quad v_y = 0 + 2.0(6) = 12\\ \\text{m/s} $',
          'One component per axis, each from its own equation.', {
            check: {
              kind: 'mcq',
              prompt: 'So the speed at that instant is:',
              options: ['$ 12 $ m/s', '$ 23 $ m/s', '$ 26 $ m/s', '$ 35 $ m/s'],
              answer_index: 2,
              feedback_right: 'Right — $ \\sqrt{529 + 144} = \\sqrt{673} \\approx 26 $ m/s.',
              feedback_wrong: '$ v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{23^2 + 12^2} = \\sqrt{529 + 144} = \\sqrt{673} \\approx 26 $ m/s. Adding to get 35 treats components as if they were collinear.',
            },
          }),
        st('$ y = 36\\ \\text{m} $ and the speed is about $ 26 $ m/s.',
          'Two independent columns, joined at $ t = 6 $ s.', {
            why: 'Worth noticing: the particle accelerates along **both** axes here, so neither motion is uniform. Nothing about the method changed. Projectiles are simply the special case where $ a_x $ happens to be zero, which makes the x-column even easier.',
          }),
      ],
      now_you_try: {
        problem: 'A particle starts from the origin at $ t = 0 $ with velocity $ 10.0\\,\\hat{j} $ m/s and moves in the x-y plane with constant acceleration $ (8.0\\,\\hat{i} + 2.0\\,\\hat{j}) $ m/s². (a) At what time is the x-coordinate $ 16 $ m, and what is the y-coordinate then? (b) What is the speed at that time?',
        answer: '(a) $ t = 2 $ s, $ y = 24 $ m  (b) $ 22.4 $ m/s',
        solution: '(a) Along x: $ u_x = 0 $, $ a_x = 8.0 $, so $ 16 = \\frac{1}{2}(8)t^2 $, giving $ t^2 = 4 $ and $ t = 2 $ s. Along y: $ y = 10(2) + \\frac{1}{2}(2)(4) = 20 + 4 = 24 $ m. (b) $ v_x = 8(2) = 16 $ m/s, $ v_y = 10 + 2(2) = 14 $ m/s, so $ v = \\sqrt{256 + 196} = \\sqrt{452} = 21.3 $ m/s.',
      },
    }),
    b('step_solver', 6, {
      title: 'A constant acceleration at an angle to the motion',
      problem: 'A particle moves in the x-y plane with a constant acceleration of $ 1.5 $ m/s² in a direction making $ 37° $ with the x-axis. At $ t = 0 $ it is at the origin with a velocity of $ 8.0 $ m/s along the x-axis. Find its velocity and position at $ t = 4.0 $ s. Take $ \\sin 37° = 0.6 $, $ \\cos 37° = 0.8 $.',
      intro: 'Here it is the *acceleration* that needs resolving, not the velocity. The method does not notice the difference.',
      steps: [
        st('$ a_x = 1.5\\cos 37° = 1.2\\ \\text{m/s}^2, \\qquad a_y = 1.5\\sin 37° = 0.90\\ \\text{m/s}^2 $',
          'Resolve the acceleration exactly as you would resolve a velocity. A vector is a vector.', {
            check: {
              kind: 'mcq',
              prompt: 'And the initial velocity components?',
              options: ['$ u_x = 8.0 $, $ u_y = 8.0 $ m/s', '$ u_x = 8.0 $, $ u_y = 0 $', '$ u_x = 6.4 $, $ u_y = 4.8 $ m/s', '$ u_x = 0 $, $ u_y = 8.0 $ m/s'],
              answer_index: 1,
              feedback_right: 'Right — the initial velocity is along x, so it has no y-component at all.',
              feedback_wrong: 'The problem says the initial velocity is **along the x-axis**, so it needs no resolving: $ u_x = 8.0 $ m/s and $ u_y = 0 $. Only the acceleration was at an angle.',
            },
          }),
        st('$ v_x = 8.0 + 1.2(4.0) = 12.8\\ \\text{m/s}, \\qquad v_y = 0 + 0.90(4.0) = 3.6\\ \\text{m/s} $',
          'The Chapter 2 first equation, run twice.', {
            check: {
              kind: 'fill_blank',
              prompt: 'Find the speed at $ t = 4.0 $ s, in m/s to one decimal place.',
              blank_answer: '13.3',
              feedback_right: 'Yes — $ \\sqrt{163.84 + 12.96} = \\sqrt{176.8} = 13.3 $ m/s.',
              feedback_wrong: '$ v = \\sqrt{12.8^2 + 3.6^2} = \\sqrt{163.84 + 12.96} = \\sqrt{176.8} = 13.3 $ m/s.',
            },
          }),
        st('$ x = 8.0(4) + \\tfrac{1}{2}(1.2)(16) = 32 + 9.6 = 41.6\\ \\text{m} $',
          'The second equation on the x-axis.', {
            check: {
              kind: 'mcq',
              prompt: 'Now the y-coordinate, from $ y = u_y t + \\frac{1}{2}a_y t^2 $:',
              options: ['$ 3.6 $ m', '$ 7.2 $ m', '$ 14.4 $ m', '$ 36 $ m'],
              answer_index: 1,
              feedback_right: 'Right — $ \\frac{1}{2}(0.90)(16) = 7.2 $ m.',
              feedback_wrong: '$ u_y = 0 $, so $ y = \\frac{1}{2}(0.90)(16) = 7.2 $ m. The 3.6 m answer is $ \\frac{1}{2}v_y t $ computed with the wrong factor — check which equation you used.',
            },
          }),
        st('At $ t = 4.0 $ s the particle is at $ (41.6\\ \\text{m},\\ 7.2\\ \\text{m}) $, moving at $ 13.3 $ m/s.',
          'The velocity now makes an angle $ \\tan^{-1}(3.6/12.8) \\approx 16° $ with the x-axis — it has started to swing round towards the acceleration.', {
            why: 'Watch that angle over time. It began at $ 0° $ and is heading towards $ 37° $, the direction of the acceleration, which it will approach but never reach. **A constant acceleration steadily bends the velocity towards itself.** That single sentence is what makes a projectile\'s path curve downwards.',
          }),
      ],
      now_you_try: {
        problem: 'A particle at the origin has an initial velocity of $ 6.0 $ m/s along the x-axis and a constant acceleration of $ 2.0 $ m/s² at $ 53° $ to the x-axis. Find its velocity components at $ t = 5.0 $ s. Take $ \\sin 53° = 0.8 $, $ \\cos 53° = 0.6 $.',
        answer: '$ v_x = 12 $ m/s, $ v_y = 8 $ m/s',
        solution: '$ a_x = 2.0(0.6) = 1.2 $ m/s² and $ a_y = 2.0(0.8) = 1.6 $ m/s². Then $ v_x = 6.0 + 1.2(5) = 12 $ m/s and $ v_y = 0 + 1.6(5) = 8 $ m/s. The speed is $ \\sqrt{144 + 64} = 14.4 $ m/s.',
      },
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.6,
      questions: [
        q('A particle has an initial velocity along the x-axis and a constant acceleration along the y-axis. Its path is:',
          ['A straight line along x', 'A straight line at $ 45° $', 'A parabola', 'A circle'], 2,
          'Uniform motion along one axis and constant acceleration along the perpendicular one gives $ x \\propto t $ and $ y \\propto t^2 $, so $ y \\propto x^2 $ — a parabola. This is exactly a projectile, and page 6 does the algebra properly.', 2),
        q('For a plane motion with constant acceleration, which relation is valid?',
          ['$ \\mathbf{v} = \\mathbf{u} + \\mathbf{a}t $, treating all four as vectors', 'Only the scalar component equations work; the vector forms fail', '$ v = u + at $, using the speeds on their own', 'Neither form works once the motion leaves a line'], 0,
          'The vector equations hold unchanged for constant acceleration — they were derived without ever assuming one dimension. What fails is using *speeds* in them, because speeds throw the direction information away.', 2),
        q('A particle moving along the x-axis at $ 10 $ m/s is given a constant acceleration along the y-axis. Its x-velocity after $ 5 $ s is:',
          ['$ 0 $', '$ 10 $ m/s', '$ 50 $ m/s', 'It cannot be found without knowing $ a_y $'], 1,
          'The acceleration is entirely along y, so $ a_x = 0 $ and $ v_x $ stays at 10 m/s forever. This is the projectile\'s constant horizontal velocity in general form.', 1),
      ],
    }),
    b('callout', 8, {
      variant: 'exam_tip',
      title: 'Choosing between the two methods, in one line each',
      markdown: 'Time given, vector asked for → **Method 1**. Anything else → **Method 2**.\n\nIn practice that means Method 2 for almost everything, because exam questions ask when something lands, how high it got, how far it went — all single-axis questions with the time unknown.\n\nAnd a warning that costs marks every year: **never mix a magnitude into a component equation.** $ v^2 = u^2 + 2as $ is valid per axis, as $ v_y^2 = u_y^2 + 2a_y s_y $. Writing it with total speeds and a total displacement is simply not a true statement.',
    }),
    b('practice_bank', 9, {
      title: 'You solve it',
      intro: 'Seven questions. Decide which method you are using before you start writing, and say so on the page.',
      sections: [
        {
          id: 'p3-ysi',
          title: 'Constant acceleration in a plane',
          items: [
            num('p3-y1', 'A particle at the origin has $ \\mathbf{u} = 3\\,\\hat{i} $ m/s and $ \\mathbf{a} = 4\\,\\hat{j} $ m/s². Find its position and speed at $ t = 3 $ s.',
              '$ (9\\ \\text{m}, 18\\ \\text{m}) $; speed $ 12.4 $ m/s',
              '$ x = 3(3) = 9 $ m and $ y = \\frac{1}{2}(4)(9) = 18 $ m. Then $ v_x = 3 $ m/s and $ v_y = 4(3) = 12 $ m/s, so $ v = \\sqrt{9 + 144} = \\sqrt{153} = 12.4 $ m/s.'),
            mcq('p3-y2', 'A body has $ \\mathbf{u} = 4\\,\\hat{i} + 3\\,\\hat{j} $ m/s and $ \\mathbf{a} = -2\\,\\hat{j} $ m/s². At what time is its velocity parallel to the x-axis?',
              ['$ 1.0 $ s', '$ 1.5 $ s', '$ 2.0 $ s', '$ 3.0 $ s'], 1,
              'Parallel to the x-axis means $ v_y = 0 $. So $ 3 - 2t = 0 $ and $ t = 1.5 $ s. This is exactly the "top of the path" condition for a projectile.'),
            num('p3-y3', 'A particle starts from rest at the origin with $ \\mathbf{a} = 6\\,\\hat{i} + 8\\,\\hat{j} $ m/s². Find its displacement magnitude after $ 2 $ s.',
              '$ 20 $ m',
              '$ \\mathbf{s} = \\frac{1}{2}\\mathbf{a}t^2 = \\frac{1}{2}(6\\,\\hat{i} + 8\\,\\hat{j})(4) = 12\\,\\hat{i} + 16\\,\\hat{j} $ m, so $ |\\mathbf{s}| = \\sqrt{144 + 256} = \\sqrt{400} = 20 $ m. Starting from rest, the displacement is parallel to the acceleration.'),
            mcq('p3-y4', 'A particle moves in a plane with a constant acceleration that is *not* parallel to its initial velocity. Its path is:',
              ['A straight line', 'A parabola', 'A circle', 'An ellipse'], 1,
              'Resolving along and perpendicular to the acceleration gives uniform motion on one axis and constant acceleration on the other, so the path is a parabola. It is straight only if the acceleration is parallel or antiparallel to the initial velocity.'),
            num('p3-y5', 'A particle at the origin has $ \\mathbf{u} = 2\\,\\hat{i} $ m/s and a constant acceleration of $ 2 $ m/s² at $ 60° $ to the x-axis. Find its velocity at $ t = 2 $ s. Take $ \\cos 60° = 0.5 $, $ \\sin 60° = 0.866 $.',
              '$ \\mathbf{v} = 4\\,\\hat{i} + 3.46\\,\\hat{j} $ m/s, speed $ 5.29 $ m/s',
              '$ a_x = 2(0.5) = 1 $ m/s² and $ a_y = 2(0.866) = 1.73 $ m/s². Then $ v_x = 2 + 1(2) = 4 $ m/s and $ v_y = 0 + 1.73(2) = 3.46 $ m/s, giving $ v = \\sqrt{16 + 12} = \\sqrt{28} = 5.29 $ m/s.'),
            mcq('p3-y6', 'Which equation is valid for a plane motion with constant acceleration?',
              ['$ v_y^2 = u_y^2 + 2a_y s_y $', '$ v^2 = u^2 + 2as $ with total speeds and total displacement', '$ v_y^2 = u_x^2 + 2a_y s_y $', '$ v^2 = u_y^2 + 2a_x s_x $'], 0,
              'The third equation of motion is valid **per axis**, with every quantity in it belonging to that same axis. Mixing a component from one axis with components from another, or using total magnitudes, is not a true statement.'),
            num('p3-y7', 'A particle has $ \\mathbf{u} = 5\\,\\hat{i} + 10\\,\\hat{j} $ m/s and $ \\mathbf{a} = -10\\,\\hat{j} $ m/s². Find (a) the time at which $ v_y = 0 $ and (b) the y-displacement at that instant.',
              '(a) $ 1 $ s  (b) $ 5 $ m',
              '(a) $ 0 = 10 - 10t $, so $ t = 1 $ s. (b) $ s_y = 10(1) - \\frac{1}{2}(10)(1) = 10 - 5 = 5 $ m. This is the maximum-height calculation for a projectile, done from first principles rather than from a formula.'),
          ],
        },
      ],
    }),
    b('text', 10, {
      markdown: 'Every tool the chapter needs is now on the table. Time to point them all at the case that made this chapter famous: an object thrown into the air, with gravity as the only acceleration.',
    }),
  ],
};

withDb(async (db) => {
  const bookId = await ensureChapter(db);
  await upsertPages(db, bookId, [p0, p1, p2, p3]);
}).then(() => { console.log('\nWave 1a done — p0–p3'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
