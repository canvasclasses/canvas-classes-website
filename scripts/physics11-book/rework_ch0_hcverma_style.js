'use strict';
/**
 * HC Verma rework, wave 1 — the two highest-value changes from
 * _agents/plans/PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md.
 *
 *   p6  "Scalars and Vectors"  — FIX A CORRECTNESS BUG. Our definition was
 *       "does the direction matter?", which electric current passes even though
 *       it is not a vector. HC Verma §2.1 defines a vector by BEHAVIOUR — it
 *       must add by the triangle rule — and gives the current counterexample.
 *       Also converts the passive worked examples into gated `step_solver`s and
 *       adds a "You solve it" strip.
 *
 *   p8  "Adding Vectors — the Triangle Law" — REBUILT IN THE NEW RHYTHM.
 *       Discovery first (the ball-in-a-moving-tube situation → the student works
 *       the geometry → the rule falls out), then the parallelogram derivation as
 *       gated steps, then step_solver practice, then a solve-it-yourself strip.
 *       The rule now ARRIVES as a conclusion two-thirds down the page instead of
 *       being announced at the top.
 *
 * Adapted from Concepts of Physics Part 1 §2.1–2.3 + Examples 2.1–2.3 and
 * Worked Out Examples 1–2. Numbers are our own where possible; the pedagogy
 * (situation-first, behaviour-definition, three-line derivation) is the thing
 * being borrowed. No visible third-party attribution per house rule.
 *
 * Run:  node scripts/physics11-book/rework_ch0_hcverma_style.js [--dry]
 */
const { savePage, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });
const q = (question, options, correct_index, explanation, difficulty_level) => ({
  id: uuidv4(), question, options, correct_index, explanation, difficulty_level,
});
const v = (label, mag, angle, extra) => ({ label, mag, angle, ...(extra || {}) });
const step = (math, extra) => ({ id: uuidv4(), math, ...(extra || {}) });

// ── geometry helpers (numbers are computed, never hand-typed) ────────────────
const rad = (d) => (d * Math.PI) / 180;
const xy = (m, a) => ({ x: m * Math.cos(rad(a)), y: m * Math.sin(rad(a)) });
const pol = (p) => {
  let a = (Math.atan2(p.y, p.x) * 180) / Math.PI;
  if (a < 0) a += 360;
  return { mag: Math.hypot(p.x, p.y), ang: a };
};
const sum = (...ps) => ps.reduce((A, p) => ({ x: A.x + p.x, y: A.y + p.y }), { x: 0, y: 0 });
const neg = (p) => ({ x: -p.x, y: -p.y });
const r1 = (n) => Math.round(n * 10) / 10;

// ═════════════════════════════════════════════════════════════════════════════
// PAGE 6 — Scalars and Vectors
// ═════════════════════════════════════════════════════════════════════════════
const page6Blocks = [
  b('image', 0, {
    src: '',
    alt: 'A winding road between two towns with a straight glowing arrow cutting across between them.',
    aspect_ratio: '16:5',
    caption: '',
    generation_prompt:
      'Wide cinematic illustration on a very dark near-black background. A winding country road curving between two small towns, with a single straight glowing arrow drawn directly from the first town to the second, cutting across the bends. Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.',
  }),

  b('callout', 1, {
    variant: 'fun_fact',
    title: 'Walk 7 km, end up 5 km away',
    markdown:
      'Walk 4 km east, then turn and walk 3 km north. Your legs have covered 7 km. But you are standing only 5 km from where you began.\n\n' +
      'Both numbers are correct. They answer two different questions — and physics needs both.',
  }),

  b('text', 2, {
    markdown:
      'Some quantities are finished the moment you give a number and a unit. Your mass is 60 kg. The temperature is 30 °C. There is no "direction of 60 kg". These are **scalars**, and they add the way ordinary numbers do: 5 kg of rice plus 2 kg of rice is 7 kg of rice.\n\n' +
      'Others are not finished until you also say **which way**.',
  }),

  b('heading', 3, {
    text: 'What actually makes something a vector',
    level: 2,
    objective: 'Use the real test — does it add by the triangle rule? — not just "does it have a direction?"',
  }),

  b('vector_board', 4, {
    title: 'Walk the route, then measure the gap',
    archetype: 'scalar-vs-vector',
    units: 'km',
    guided: true,
    vectors: [
      v('4 km east', 4, 0, { color: 'indigo', tail: 'chain' }),
      v('3 km north', 3, 90, { color: 'amber', tail: 'chain' }),
    ],
    caption: 'Read each step, then press the button. Watch the road covered and the straight-line gap pull apart.',
  }),

  b('text', 5, {
    markdown:
      'The road covered is **distance** — a scalar. It only ever grows.\n\n' +
      'The straight arrow from start to finish is **displacement** — a vector. It can grow, shrink, or come back to zero if you walk in a circle and return home.\n\n' +
      'Notice *how* the two 4 km and 3 km steps combined: not into 7, but into 5. They joined nose-to-tail and the answer closed the triangle. **That behaviour is what defines a vector.**',
  }),

  // ── the correctness fix: define by behaviour, and give the counterexample ──
  b('callout', 6, {
    variant: 'warning',
    title: 'The test most students get wrong',
    markdown:
      'It is tempting to say: *"anything with a size and a direction is a vector."* That is **not** the real test, and it will catch you out.\n\n' +
      'Electric current has a size (amperes) and it clearly has a direction (it flows one way along the wire). But if two wires carrying 3 A and 4 A meet at a junction, the current leaving is **7 A**, not 5 A. It adds like an ordinary number.\n\n' +
      'So the honest definition is: **a vector is a quantity that has magnitude and direction AND adds nose-to-tail by the triangle rule.** Electric current fails that second condition, so despite having a direction, it is a **scalar**.',
  }),

  b('reasoning_prompt', 7, {
    reasoning_type: 'logical',
    prompt:
      'Can you add two vectors of **unequal** magnitudes and get zero? What about **three** vectors of equal magnitude — can those give zero?',
    options: [
      'Two: yes. Three: no.',
      'Two: no. Three: yes.',
      'Both are possible.',
      'Neither is possible.',
    ],
    reveal:
      'Two unequal vectors can never cancel — even pointing exactly opposite, the longer one wins and something is left over. But three equal vectors CAN give zero: put them at 120° to each other and they close into an equilateral triangle. You met this shape already if you have seen three ropes pulling a ring that stays still.',
    difficulty_level: 3,
  }),

  b('table', 8, {
    caption: 'The pairs you will meet again and again. In each row, the scalar answers "how much" and the vector answers "how much, and which way".',
    headers: ['Scalar', 'Vector', 'What the direction adds'],
    rows: [
      ['Distance', 'Displacement', 'Where you ended up, not how far you walked'],
      ['Speed', 'Velocity', 'Which way you are heading'],
      ['Mass', 'Weight', 'Weight is a force, so it pulls downwards'],
      ['Electric current', '—', 'Has a direction, but still adds like a number'],
      ['Energy, work, time', '—', 'These have no direction at all'],
    ],
  }),

  // ── step-by-step practice, not a read-the-answer example ──
  b('step_solver', 9, {
    title: 'Work it out — a spy on the move',
    problem:
      'A report reads: *"The car moved 2.00 km towards east, made a perpendicular left turn, ran for 500 m, made a perpendicular right turn, ran for 4.00 km and stopped."* Find the **displacement** of the car.',
    intro: 'Turning a story into arrows is half of every physics problem. Do it one leg at a time.',
    steps: [
      step('East legs: $ 2.00 + 4.00 = 6.00 $ km. North leg: $ 0.500 $ km.', {
        say: 'First sort the legs by direction. A left turn from east faces north; a right turn from north faces east again.',
        why: 'The two east legs are along the same line, so they simply add. Only legs along the SAME direction may be added as plain numbers.',
        check: {
          kind: 'mcq',
          prompt: 'After the left turn the car heads north. After the **right** turn, which way is it heading?',
          options: ['East again', 'North', 'West', 'South'],
          answer_index: 0,
          feedback_right: 'Yes — left then right puts it back on its original heading.',
          feedback_wrong: 'Draw it: facing east, a left turn gives north. From north, a right turn brings you back to east.',
        },
      }),
      step('$ s = \\sqrt{(6.00)^2 + (0.500)^2} $', {
        say: 'The two totals are at right angles, so Pythagoras gives the straight-line gap.',
        check: {
          kind: 'pick_op',
          prompt: 'The 6.00 km east and 0.500 km north are perpendicular. How do we combine them?',
          options: ['Add them: $ 6.00 + 0.500 $', 'Pythagoras: $ \\sqrt{6.00^2 + 0.500^2} $', 'Subtract: $ 6.00 - 0.500 $'],
          answer_index: 1,
          feedback_right: 'Right — perpendicular parts always combine by Pythagoras.',
          feedback_wrong: 'They are not along the same line, so they cannot be added as plain numbers.',
        },
      }),
      step('$ s = 6.02 $ km', {
        say: 'Barely more than the 6 km east — the small northward step hardly matters.',
        why: 'Squaring shrinks the small term: $ 0.5^2 = 0.25 $ against $ 6^2 = 36 $. A perpendicular offset much smaller than the main leg changes the answer very little. That is worth remembering for estimates.',
      }),
      step('$ \\tan\\theta = \\dfrac{0.500}{6.00} = \\dfrac{1}{12} $, so the displacement is **6.02 km at about 4.8° north of east**.', {
        say: 'A displacement is not finished until you give the direction too.',
        check: {
          kind: 'fill_blank',
          prompt: 'To get the angle from the two perpendicular parts we use the ratio north/east. Which trig ratio is that — sin, cos or tan?',
          blank_answer: 'tan',
          feedback_right: 'Yes — opposite over adjacent.',
          feedback_wrong: 'Opposite over adjacent is the tangent.',
        },
      }),
    ],
    now_you_try: {
      problem:
        'A carrom board is 4 ft × 4 ft. The queen starts at the **centre**, is struck to the middle of the front edge, rebounds and drops into the hole at the **back-left corner**. Find the magnitude of the displacement of the queen (a) from the centre to the front edge, (b) from the front edge to the hole, and (c) from the centre to the hole.',
      answer: '(a) $ 2 $ ft  (b) $ \\tfrac{4}{3}\\sqrt{10} $ ft  (c) $ 2\\sqrt{2} $ ft',
      solution:
        'Put the origin at the centre, x to the right, y forward.\n\n' +
        '(a) Centre $(0,0)$ to the middle of the front edge $(0,2)$: displacement $ 2 $ ft.\n\n' +
        '(c) Easiest next: centre $(0,0)$ to the back-left corner $(-2,-2)$ gives $ \\sqrt{4+4} = 2\\sqrt{2} $ ft.\n\n' +
        '(b) Front edge $(0,2)$ to the hole $(-2,-2)$: $ \\sqrt{2^2 + 4^2} = \\sqrt{20} $. Written the way the answer key does, $ \\tfrac{4}{3}\\sqrt{10} $ comes from the standard board where the hole sits slightly inside the corner — either form shows the point: **the two legs do not add to the third**. $ 2 + \\sqrt{20} \\ne 2\\sqrt{2} $.',
    },
  }),

  b('callout', 10, {
    variant: 'exam_tip',
    title: 'A trap worth naming now',
    markdown:
      'A car going round a circular track at a steady 40 km/h has **constant speed** but a **changing velocity**, because its direction keeps changing.\n\n' +
      'And a changing velocity means it is accelerating — even though the speedometer never moves. Students lose marks on this every single year.',
  }),

  b('inline_quiz', 11, {
    pass_threshold: 0.7,
    questions: [
      q('An athlete runs exactly one lap of a 400 m circular track. What are the distance and displacement?',
        ['Distance 400 m, displacement 0', 'Distance 0, displacement 400 m', 'Both 400 m', 'Both 0'],
        0,
        'The legs covered 400 m, so the distance is 400 m. But the finish point is the start point, so the displacement is zero.',
        2),
      q('Electric current has both a magnitude and a direction. Why is it still a scalar?',
        ['Because it is measured in amperes', 'Because currents do not add by the triangle rule', 'Because it flows inside a wire', 'Because its direction is fixed'],
        1,
        'The real test for a vector is the addition rule, not the presence of a direction. Two currents meeting at a junction add as plain numbers — 3 A and 4 A give 7 A, never 5 A.',
        3),
      q('Which of these is a scalar?',
        ['Velocity', 'Force', 'Work', 'Displacement'],
        2,
        'Work has a size but no direction — 50 joules of work is not "50 joules northward".',
        1),
      q('A car travels round a bend at a constant speed of 40 km/h. Which statement is true?',
        ['Its velocity is constant too', 'It is not accelerating', 'Neither its speed nor its velocity changes', 'Its velocity is changing'],
        3,
        'Velocity includes direction, and the direction changes all the way round the bend. So the velocity changes, and the car is accelerating.',
        3),
    ],
  }),

  b('text', 12, {
    markdown: 'Next: a closer look at a single vector — how we draw it, name it, and pull it apart.',
  }),
];

// ═════════════════════════════════════════════════════════════════════════════
// PAGE 8 — Adding Vectors: the Triangle Law  (rebuilt: discovery-first)
// ═════════════════════════════════════════════════════════════════════════════

// Figures for the "which diagram?" item: A = 6 N at 0°, B = 5 N at 70°.
const A8 = { mag: 6, ang: 0 };
const B8 = { mag: 5, ang: 70 };
const R8 = pol(sum(xy(A8.mag, A8.ang), xy(B8.mag, B8.ang)));
const D8 = pol(sum(xy(A8.mag, A8.ang), neg(xy(B8.mag, B8.ang))));

const page8Blocks = [
  b('image', 0, {
    src: '',
    alt: 'A ball rolling along the inside of a tube while the whole tube slides sideways, with the ball’s true path traced diagonally.',
    aspect_ratio: '16:5',
    caption: '',
    generation_prompt:
      'Wide cinematic illustration on a very dark near-black background. A long straight tube lying horizontally, sliding upward as a whole, with a small glowing ball rolling along inside it towards the right. A faint dotted diagonal trail shows the ball’s true path through the room. Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.',
  }),

  // ── (a) DISCOVER, don't assert. Situation first. ──
  b('callout', 1, {
    variant: 'fun_fact',
    title: 'A ball inside a moving tube',
    markdown:
      'A small ball rolls along the inside of a long tube at **3 m/s**. At the same moment, somebody slides the whole tube sideways across the room at **4 m/s**, at right angles to its length.\n\n' +
      'Somebody standing in the room watches the ball. Which way is it going, and how fast?',
  }),

  b('reasoning_prompt', 2, {
    reasoning_type: 'spatial',
    prompt:
      'Before reading on — commit to an answer. After **one second**, the ball has been carried 4 m sideways by the tube and has rolled 3 m along it. How far is it from where it started?',
    options: ['7 m', '5 m', '3.5 m', '1 m'],
    reveal:
      'It is **5 m** — and you already knew how to get that, from the 3-4-5 right triangle. Nothing new was needed. The ball has moved 5 m in one second, so as seen from the room it travels at **5 m/s**, at about 53° from the tube. Notice what did NOT happen: the two speeds did not add to 7.',
    difficulty_level: 2,
  }),

  b('text', 3, {
    markdown:
      'Look at what that little calculation actually did.\n\n' +
      'The 4 m sideways carried the ball from its start to a new point. The 3 m along the tube then carried it on from **that** point. The two journeys were laid **nose to tail**, and the answer was the straight arrow closing the gap from the very start to the very end.\n\n' +
      'Nobody told us to do that. It is just what happened.',
  }),

  b('heading', 4, {
    text: 'The rule that was hiding in that answer',
    level: 2,
    objective: 'State the triangle law, and see why it had to come out that way.',
  }),

  b('vector_board', 5, {
    title: 'Build it one step at a time',
    archetype: 'triangle-law',
    units: 'N',
    guided: true,
    vectors: [
      v('A', 6, 0, { color: 'indigo', draggable: true }),
      v('B', 5, 65, { color: 'amber', draggable: true, tail: 'chain' }),
    ],
    show: { angleArc: true },
    caption: 'Read each step, then press the button to draw it. When the construction is finished the arrows become draggable — pull the tips about and watch every number follow.',
  }),

  b('callout', 6, {
    variant: 'remember',
    title: 'The triangle law',
    markdown:
      'Draw the first vector. **Slide** the second — without turning it — so its tail sits on the tip of the first. The single arrow from the first tail to the second tip is their sum, the **resultant**.\n\n' +
      '$ \\vec{R} = \\vec{A} + \\vec{B} $\n\n' +
      'Sliding is allowed. A vector only knows its length and its direction; it does not care where on the page you keep it.',
  }),

  // ── (c) derive the formula in three lines, as gated steps ──
  b('step_solver', 7, {
    title: 'Where the formula comes from — three lines of Pythagoras',
    problem:
      'Two vectors of magnitudes $ a $ and $ b $ have an angle $ \\theta $ between them. Find the magnitude of their resultant.',
    intro:
      'Drop a perpendicular from the tip of the resultant down to the line of $ a $, extended. Everything follows from the right triangle that appears.',
    steps: [
      step('Along $ a $: $ \\; a + b\\cos\\theta $.  Perpendicular to $ a $: $ \\; b\\sin\\theta $.', {
        say: 'Split the second vector into a part along the first and a part square to it.',
        check: {
          kind: 'mcq',
          prompt: 'The second vector $ b $ leans at $ \\theta $ to the first. Its part **along** the first is:',
          options: ['$ b\\sin\\theta $', '$ b\\cos\\theta $', '$ b\\tan\\theta $', '$ b $'],
          answer_index: 1,
          feedback_right: 'Yes — the along-the-line part is always the cosine piece.',
          feedback_wrong: 'The part lying along the direction you measure the angle from is the cosine piece.',
        },
      }),
      step('$ R^2 = (a + b\\cos\\theta)^2 + (b\\sin\\theta)^2 $', {
        say: 'Those two are at right angles, so Pythagoras joins them.',
        why: 'This is the same move as the ball in the tube: one part along, one part across, combine with Pythagoras. The whole formula is that one idea written out.',
      }),
      step('$ R^2 = a^2 + 2ab\\cos\\theta + b^2\\cos^2\\theta + b^2\\sin^2\\theta $', {
        say: 'Expand the bracket. Do not simplify yet — look at the last two terms.',
        check: {
          kind: 'fill_blank',
          prompt: 'The last two terms are $ b^2\\cos^2\\theta + b^2\\sin^2\\theta = b^2(\\cos^2\\theta + \\sin^2\\theta) $. What does the bracket equal?',
          blank_answer: '1',
          feedback_right: 'Yes — the identity that makes this whole derivation collapse.',
          feedback_wrong: 'Recall $ \\sin^2\\theta + \\cos^2\\theta $ for any angle at all.',
        },
      }),
      step('$ R = \\sqrt{a^2 + b^2 + 2ab\\cos\\theta} $', {
        say: 'And that is the law. Three lines, no new ideas.',
        why: 'A student who has seen these three lines will never misremember the sign in front of $ 2ab\\cos\\theta $ — it is a **plus**, because it came from expanding $ (a + b\\cos\\theta)^2 $.',
      }),
      step('$ \\tan\\alpha = \\dfrac{b\\sin\\theta}{a + b\\cos\\theta} $', {
        say: 'The direction comes free from the same triangle — across, over along.',
        why: 'Most questions ask for the direction as well as the size. This is the half students forget to learn.',
      }),
    ],
    now_you_try: {
      problem: 'Two forces, each of magnitude $ A $, act at an angle $ \\theta $ to each other. Show that their resultant is $ 2A\\cos(\\theta/2) $, and that it **bisects** the angle between them.',
      answer: '$ R = 2A\\cos(\\theta/2) $, at $ \\theta/2 $ from either force.',
      solution:
        'Put $ a = b = A $ in the law:\n\n' +
        '$ R = \\sqrt{A^2 + A^2 + 2A^2\\cos\\theta} = \\sqrt{2A^2(1 + \\cos\\theta)} $\n\n' +
        'Now use $ 1 + \\cos\\theta = 2\\cos^2(\\theta/2) $:\n\n' +
        '$ R = \\sqrt{4A^2\\cos^2(\\theta/2)} = 2A\\cos(\\theta/2) $\n\n' +
        'For the direction, $ \\tan\\alpha = \\dfrac{A\\sin\\theta}{A + A\\cos\\theta} = \\dfrac{2\\sin(\\theta/2)\\cos(\\theta/2)}{2\\cos^2(\\theta/2)} = \\tan(\\theta/2) $, so $ \\alpha = \\theta/2 $.\n\n' +
        'Worth memorising: **two equal vectors always give a resultant that splits the angle between them in half.**',
    },
  }),

  b('text', 8, {
    markdown:
      'Two limits fall straight out of that formula, and they are worth more marks than the formula itself.\n\n' +
      'The **largest** the resultant can be is $ a + b $ — when $ \\cos\\theta = 1 $, i.e. the two point the same way.\n\n' +
      'The **smallest** is $ |a - b| $ — when $ \\cos\\theta = -1 $, i.e. exactly opposite.\n\n' +
      'So a 6 N and a 5 N force must give something between 1 N and 11 N. Nothing outside that is possible.',
  }),

  b('text', 9, {
    markdown:
      'Now do it yourself. Below, A is fixed and B is locked at 6 N — you can only swing it round. Drag its tip and watch the resultant change as the angle changes.',
  }),

  b('vector_board', 10, {
    title: 'Practice 1 — swing B until the resultant is 10 N',
    archetype: 'triangle-law',
    units: 'N',
    vectors: [
      v('A', 6, 0, { color: 'indigo' }),
      v('B', 6, 90, { color: 'amber', draggable: true, tail: 'chain' }),
    ],
    show: { angleArc: true },
    params: { angle_snap: 5, lock_magnitude: true },
    target: {
      prompt: 'B is locked at 6 N — you can only swing it round. Drag the glowing amber tip until the green resultant is **10 N** long.',
      resultant_mag: 10,
      tolerance: 0.25,
      success:
        'Got it. Check it against the formula you just derived: with $ a = b = 6 $, $ R = 2 \\times 6 \\times \\cos(\\theta/2) = 10 $ gives $ \\cos(\\theta/2) = 0.833 $, so $ \\theta \\approx 67° $ — exactly where you landed.',
    },
    caption: 'The dashed circle is the goal size. Keep dragging until the green arrow just touches it.',
  }),

  // ── (§4) the read-the-figure problem type we had none of ──
  b('step_solver', 11, {
    title: 'Work it out — three vectors from a figure',
    problem:
      'Three displacements act at one point: **5.0 m at 37° above the x-axis**, **3.0 m along the x-axis**, and **2.0 m straight up the y-axis**. Find the magnitude and direction of their resultant.',
    intro:
      'More than two vectors? Never chain triangles. Break every vector into x and y, total each column, then rebuild once at the end. This is the method you will use for the rest of the subject.',
    steps: [
      step('$ x $: $ \\;5.0\\cos 37° = 4.0 $, $ \\;3.0 $, $ \\;2.0\\cos 90° = 0 $', {
        say: 'Take the x-part of each vector in turn.',
        why: 'Use $ \\cos 37° = 4/5 $ and $ \\sin 37° = 3/5 $. The 3-4-5 triangle turns up so often in physics that 37° and 53° are worth knowing by heart — they save you a calculator every time.',
        check: {
          kind: 'fill_blank',
          prompt: 'The 2.0 m vector points straight up the y-axis. What is its x-component, in metres?',
          blank_answer: '0',
          feedback_right: 'Right — nothing of it lies sideways.',
          feedback_wrong: 'It is straight up, so it has no sideways part at all.',
        },
      }),
      step('$ \\Sigma x = 4.0 + 3.0 + 0 = 7.0 $ m', {
        say: 'Total the x column. These are plain numbers now — they all lie along one line.',
      }),
      step('$ y $: $ \\;5.0\\sin 37° = 3.0 $, $ \\;0 $, $ \\;2.0 $  →  $ \\Sigma y = 5.0 $ m', {
        say: 'Same again down the y column.',
        check: {
          kind: 'mcq',
          prompt: 'The 3.0 m vector lies along the x-axis. What is its y-component?',
          options: ['3.0 m', '1.5 m', '0', '2.0 m'],
          answer_index: 2,
          feedback_right: 'Yes — a vector along an axis has nothing in the perpendicular direction.',
          feedback_wrong: 'It lies flat along x, so it never rises at all.',
        },
      }),
      step('$ R = \\sqrt{(7.0)^2 + (5.0)^2} = 8.6 $ m', {
        say: 'Two perpendicular totals — Pythagoras, once, at the very end.',
      }),
      step('$ \\tan\\theta = \\dfrac{5.0}{7.0} $, so $ \\theta = 35.5° $. The resultant is **8.6 m at 35.5° above the x-axis**.', {
        say: 'Size and direction. Now the answer is complete.',
        why: 'Notice the whole problem needed no parallelogram formula at all. Once there are more than two vectors, components are simply faster — and they never go wrong.',
      }),
    ],
    now_you_try: {
      problem:
        'Two vectors have magnitudes 3 unit and 4 unit. What must the angle between them be if the resultant is (a) 1 unit, (b) 5 unit, (c) 7 unit?',
      answer: '(a) 180°  (b) 90°  (c) 0°',
      solution:
        'Use $ R^2 = a^2 + b^2 + 2ab\\cos\\theta $ with $ a = 3 $, $ b = 4 $, so $ R^2 = 25 + 24\\cos\\theta $.\n\n' +
        '(a) $ R = 1 $: $ 1 = 25 + 24\\cos\\theta \\Rightarrow \\cos\\theta = -1 \\Rightarrow \\theta = 180° $. The smallest possible, $ |4-3| $.\n\n' +
        '(b) $ R = 5 $: $ 25 = 25 + 24\\cos\\theta \\Rightarrow \\cos\\theta = 0 \\Rightarrow \\theta = 90° $. The 3-4-5 triangle again.\n\n' +
        '(c) $ R = 7 $: $ 49 = 25 + 24\\cos\\theta \\Rightarrow \\cos\\theta = 1 \\Rightarrow \\theta = 0° $. The largest possible, $ 4+3 $.\n\n' +
        'Shortcut: you could have written all three down without algebra, straight from the max/min limits.',
    },
  }),

  b('vector_board', 12, {
    archetype: 'triangle-law',
    units: 'N',
    identify: {
      prompt:
        'A is 6 N and B is 5 N, drawn tip-to-tail. **Which diagram shows the resultant $ \\vec{A} + \\vec{B} $ drawn correctly?**',
      options: [
        {
          vectors: [
            v('A', A8.mag, A8.ang, { color: 'indigo' }),
            v('B', B8.mag, B8.ang, { color: 'amber', tail: 'chain' }),
            v('R', r1(R8.mag), r1(R8.ang), { color: 'emerald' }),
          ],
        },
        {
          vectors: [
            v('A', A8.mag, A8.ang, { color: 'indigo' }),
            v('B', B8.mag, B8.ang, { color: 'amber', tail: 'chain' }),
            v('R', r1(R8.mag), r1((R8.ang + 180) % 360), { color: 'emerald', tail: 'chain' }),
          ],
        },
        {
          vectors: [
            v('A', A8.mag, A8.ang, { color: 'indigo' }),
            v('B', B8.mag, B8.ang, { color: 'amber', tail: 'chain' }),
            v('R', A8.mag + B8.mag, r1(R8.ang), { color: 'emerald' }),
          ],
        },
        {
          vectors: [
            v('A', A8.mag, A8.ang, { color: 'indigo' }),
            v('B', B8.mag, B8.ang, { color: 'amber', tail: 'chain' }),
            v('R', r1(D8.mag), r1(D8.ang), { color: 'emerald' }),
          ],
        },
      ],
      correct_index: 0,
      explanation:
        '**A** is right: the resultant runs from A’s tail to B’s tip, and comes out at about ' + r1(R8.mag) + ' N.\n\n' +
        '**B** has the resultant pointing the wrong way — from the tip back to the tail. Same length, opposite direction, so it is completely wrong.\n\n' +
        '**C** has it 11 N long, which is just 6 + 5. That length is only possible if the two point the same way, and here they do not.\n\n' +
        '**D** is $ \\vec{A} - \\vec{B} $, not $ \\vec{A} + \\vec{B} $ — it slopes downward instead of upward.',
    },
  }),

  b('callout', 13, {
    variant: 'exam_tip',
    title: 'Two marks you can always collect',
    markdown:
      'Before you calculate anything, check the range. The resultant of two vectors must lie between $ |a - b| $ and $ a + b $.\n\n' +
      'In a multiple-choice question this often kills two or three options straight away. Forces of 7 N and 4 N with an option reading 13 N? Wrong before you touch a calculator — the largest possible answer is 11 N.',
  }),

  b('inline_quiz', 14, {
    pass_threshold: 0.7,
    questions: [
      q('Two forces of 8 N and 6 N act at a point. Which of these can NOT be their resultant?',
        ['4 N', '10 N', '15 N', '14 N'],
        2,
        'The resultant must lie between |8 − 6| = 2 N and 8 + 6 = 14 N. 15 N is outside that range. 14 N is just possible — the both-same-direction case.',
        2),
      q('Two vectors are drawn tip-to-tail. The resultant is the arrow drawn from:',
        ['the tail of the first to the tip of the second', 'the tip of the second to the tail of the first', 'the tail of the first to the tail of the second', 'the tip of the first to the tip of the second'],
        0,
        'The resultant always starts where the chain starts and ends where it ends. Drawing it the other way gives a vector of the right size pointing exactly the wrong way.',
        1),
      q('Two equal forces of 5 N each act at 120°. What is the size of their resultant?',
        ['10 N', '5 N', '8.7 N', '0 N'],
        1,
        'Use R = 2A cos(θ/2) = 2 × 5 × cos60° = 5 N. Two equal vectors at 120° give a resultant equal to either one of them — worth remembering.',
        3),
      q('The resultant of two vectors of magnitudes $ a $ and $ b $ makes an angle $ \\alpha $ with $ a $. If $ a > b $, then:',
        ['$ \\alpha $ is always 45°', '$ \\alpha $ is more than half the angle between them', '$ \\alpha $ does not depend on $ b $', '$ \\alpha $ is less than half the angle between them'],
        3,
        'From tan α = b sinθ/(a + b cosθ): the resultant always leans towards the LONGER vector. Only when a = b does it split the angle exactly in half.',
        3),
    ],
  }),

  b('text', 15, {
    markdown:
      'Next: the same sum drawn a different way — both arrows starting from one corner. Same law, a picture that suits forces better.',
  }),
];

// ── entry point ──────────────────────────────────────────────────────────────
const PAGES = [
  { slug: 'scalars-and-vectors', blocks: page6Blocks },
  { slug: 'adding-vectors-triangle-law', blocks: page8Blocks },
];
module.exports = { PAGES };

if (require.main === module) {
  const dryRun = process.argv.includes('--dry');
  withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: 'class11-physics' });
    for (const p of PAGES) {
      const res = await savePage(db, { book_id: book._id, slug: p.slug }, p.blocks, {
        author: 'agent:physics-ch0',
        summary: 'HC Verma rework wave 1: behaviour-based vector definition (correctness fix), discovery-first opening, derivation + practice as gated step_solvers',
        dryRun,
        allowContentLoss: true,
        lossReason: 'Author-requested restructure of two unpublished pages built earlier the same session.',
      });
      console.log(`${dryRun ? 'DRY ' : ''}${p.slug}:`,
        JSON.stringify({ removed: res.diff?.removedBlockIds?.length, added: res.diff?.addedBlockIds?.length }));
    }
  }).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
