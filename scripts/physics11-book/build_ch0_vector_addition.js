'use strict';
/**
 * Chapter 0, pages 8 & 10 — the two load-bearing vector pages:
 *   p8  "Adding Vectors — the Triangle Law"
 *   p10 "Subtracting Vectors"
 *
 * These are the PILOT pages for the new `vector_board` block. Every diagram on
 * them is an interactive board authored as DATA (no code), so the remaining
 * Ch.0 pages can be produced the same way.
 *
 * Voice: NCERT register, simplified further — short sentences, no ornamental
 * vocabulary, written for a student who studied in Hindi medium until Class 10.
 *
 * Numbers are COMPUTED here, never hand-typed, so every diagram, every option
 * of every "which diagram?" question and every quiz answer stay exactly
 * consistent with the physics.
 *
 * Run:  node scripts/physics11-book/build_ch0_vector_addition.js
 */
const { b, q, v, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch0');

// ── geometry helpers (so no figure is ever hand-computed) ────────────────────
const rad = (d) => (d * Math.PI) / 180;
const toXY = (mag, ang) => ({ x: mag * Math.cos(rad(ang)), y: mag * Math.sin(rad(ang)) });
const polar = (p) => {
  const mag = Math.hypot(p.x, p.y);
  let ang = (Math.atan2(p.y, p.x) * 180) / Math.PI;
  if (ang < 0) ang += 360;
  return { mag, ang };
};
const sum = (...ps) => ps.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });
const neg = (p) => ({ x: -p.x, y: -p.y });
const r1 = (n) => Math.round(n * 10) / 10;

// ═════════════════════════════════════════════════════════════════════════════
// PAGE 8 — Adding Vectors: the Triangle Law
// ═════════════════════════════════════════════════════════════════════════════

// The figure used by the "which diagram?" question: A = 6 N at 0°, B = 5 N at 70°.
const A8 = { mag: 6, ang: 0 };
const B8 = { mag: 5, ang: 70 };
const R8 = polar(sum(toXY(A8.mag, A8.ang), toXY(B8.mag, B8.ang)));
const D8 = polar(sum(toXY(A8.mag, A8.ang), neg(toXY(B8.mag, B8.ang)))); // A − B, a distractor

const page8 = {
  page_number: 8,
  slug: 'adding-vectors-triangle-law',
  title: 'Adding Vectors — the Triangle Law',
  subtitle: 'Two pushes, one answer: join them head to tail',
  glossary: [
    { term: 'resultant', definition: 'The single vector that does the same job as two or more vectors acting together.' },
    { term: 'tip-to-tail', definition: 'A way of drawing vectors where the second one starts exactly where the first one ends.' },
    { term: 'triangle law', definition: 'If two vectors are drawn tip-to-tail, the arrow that closes the triangle is their sum.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'Two ropes pulling a boat from a riverbank at different angles, with glowing arrows showing each pull and the single combined pull.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt:
        'Wide cinematic illustration on a very dark near-black background. Two people on a riverbank pull a small boat with two ropes at different angles. Each rope has a glowing orange arrow along it showing the pull, and a brighter amber arrow between them shows the single combined pull. Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.',
    }),

    b('callout', 1, {
      variant: 'fun_fact',
      title: 'Two ropes, one boat',
      markdown:
        'Two people pull a boat with two ropes. One pulls with 6 N, the other with 5 N. Together they do **not** pull with 11 N.\n\n' +
        'The angle between the ropes eats into the total. Get the angle right and you save effort; get it wrong and you waste it. This page is about finding that real total.',
    }),

    b('text', 2, {
      markdown:
        'You already know how to add ordinary numbers. 6 and 5 make 11, always.\n\n' +
        'Vectors are not like that. A vector carries a **direction** along with its size, so two vectors only give their full total when they point the same way. Point them differently and the total shrinks.\n\n' +
        'So we need a rule for adding them. That rule is simple, and it is drawn, not calculated.',
    }),

    b('heading', 3, {
      text: 'Join them tip to tail',
      level: 2,
      objective: 'Draw two vectors tip-to-tail and read off their resultant.',
    }),

    b('text', 4, {
      markdown:
        'Here is the whole rule.\n\n' +
        'Draw the first vector. Then pick up the second one and **slide it** — without turning it — so that its tail sits on the tip of the first.\n\n' +
        'Now draw one arrow from the tail of the first to the tip of the second. That arrow is the **resultant**. It is written $ \\vec{R} = \\vec{A} + \\vec{B} $.\n\n' +
        'Sliding a vector is allowed. A vector only knows its size and its direction — it does not care where on the page you keep it.',
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
      caption: 'Read each step, then press the button to draw it. When the construction is finished the arrows become draggable \u2014 pull the tips about and watch every number follow.',
    }),

    b('text', 6, {
      markdown:
        'Now do it yourself. Below, A is fixed. Only B can move \u2014 drag its tip and watch how the resultant changes as the angle changes.',
    }),

    b('vector_board', 7, {
      title: 'Practice 1 \u2014 drag B until the resultant is 10 N',
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
          'Got it. You needed about 67\u00b0 between them. Notice you could have swung B above or below A \u2014 both give 10 N, because cos \u03b8 does not care about the sign of the angle.',
      },
      caption: 'The dashed circle is the goal size. Keep dragging until the green arrow just touches it.',
    }),

    b('reasoning_prompt', 8, {
      reasoning_type: 'spatial',
      prompt:
        'On the practice board above, swing B round until it points the same way as A (angle between = 0\u00b0). Both are 6 N. What does |R| become?',
      options: ['12 N', 'Still less than 12 N', '0 N', '8.5 N'],
      reveal:
        'Exactly 12 N \u2014 but **only** at 0\u00b0. That is the one and only case where vectors add like ordinary numbers. Move B even slightly away and |R| starts dropping at once. This is why "6 plus 6 is 12" is a trap in physics.',
      difficulty_level: 2,
    }),

    b('text', 9, {
      markdown:
        'Play with the board a little and you will notice two limits.\n\n' +
        'The **largest** the resultant can ever be is $ A + B $ — when the two point the same way.\n\n' +
        'The **smallest** it can ever be is $ |A - B| $ — when they point exactly opposite.\n\n' +
        'Every other angle gives something in between. So for a 6 N and a 5 N force, the resultant must lie somewhere between 1 N and 11 N. Nothing outside that range is possible.',
    }),

    b('worked_example', 10, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem:
        'Two forces act on a body at the same point. One is 3 N pointing east, the other is 4 N pointing north. Find the size and direction of the resultant.',
      solution:
        'The two forces are at right angles, so the triangle is a right triangle and we can use Pythagoras.\n\n' +
        '$ R = \\sqrt{A^2 + B^2} = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5\\ \\mathrm{N} $\n\n' +
        'For the direction, measure the angle from the 3 N force:\n\n' +
        '$ \\tan\\alpha = \\dfrac{4}{3} = 1.333 \\quad\\Rightarrow\\quad \\alpha = 53.1° $\n\n' +
        'So the resultant is **5 N, at 53.1° north of east**.\n\n' +
        'Watch-out: the answer is 5 N, not 7 N. Adding 3 and 4 straight is exactly the mistake this chapter is here to remove.',
    }),

    b('vector_board', 11, {
      archetype: 'triangle-law',
      units: 'N',
      identify: {
        prompt:
          'A is 6 N and B is 5 N, drawn tip-to-tail. **Which diagram shows the resultant $ \\vec{A} + \\vec{B} $ drawn correctly?**',
        options: [
          {
            // ✓ correct — proper triangle law
            vectors: [
              v('A', A8.mag, A8.ang, { color: 'indigo' }),
              v('B', B8.mag, B8.ang, { color: 'amber', tail: 'chain' }),
              v('R', r1(R8.mag), r1(R8.ang), { color: 'emerald' }),
            ],
          },
          {
            // ✗ resultant drawn backwards — the "closing the loop" slip
            vectors: [
              v('A', A8.mag, A8.ang, { color: 'indigo' }),
              v('B', B8.mag, B8.ang, { color: 'amber', tail: 'chain' }),
              v('R', r1(R8.mag), r1((R8.ang + 180) % 360), { color: 'emerald', tail: 'chain' }),
            ],
          },
          {
            // ✗ magnitudes simply added — violates the triangle inequality
            vectors: [
              v('A', A8.mag, A8.ang, { color: 'indigo' }),
              v('B', B8.mag, B8.ang, { color: 'amber', tail: 'chain' }),
              v('R', A8.mag + B8.mag, r1(R8.ang), { color: 'emerald' }),
            ],
          },
          {
            // ✗ subtracted instead of added
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
          '**B** has the resultant pointing the wrong way — it runs from the tip back to the tail. Same length, opposite direction, so it is completely wrong.\n\n' +
          '**C** has it 11 N long, which is just 6 + 5. The resultant can only be that long if the two point the same way, and here they do not.\n\n' +
          '**D** is $ \\vec{A} - \\vec{B} $, not $ \\vec{A} + \\vec{B} $ — it slopes downward instead of upward.',
      },
    }),

    b('callout', 12, {
      variant: 'exam_tip',
      title: 'Two marks you can always collect',
      markdown:
        'Before you calculate anything, check the range. The resultant of two vectors must lie between $ |A - B| $ and $ A + B $.\n\n' +
        'In a multiple-choice question this often kills two or three options straight away. If a question gives forces of 7 N and 4 N and one option says 13 N, it is wrong before you touch a calculator — the largest possible answer is 11 N.',
    }),

    b('inline_quiz', 13, {
      pass_threshold: 0.7,
      questions: [
        q(
          'Two forces of 8 N and 6 N act at a point. Which of these can NOT be their resultant?',
          ['4 N', '10 N', '15 N', '14 N'],
          2,
          'The resultant must lie between |8 − 6| = 2 N and 8 + 6 = 14 N. 15 N is outside that range, so it is impossible. 14 N is just possible — that is the both-same-direction case.',
          2
        ),
        q(
          'Two vectors are drawn tip-to-tail. The resultant is the arrow drawn from:',
          ['the tail of the first to the tip of the second', 'the tip of the second to the tail of the first', 'the tail of the first to the tail of the second', 'the tip of the first to the tip of the second'],
          0,
          'The resultant always starts where the chain starts and ends where the chain ends. Drawing it the other way round gives a vector of the right size pointing exactly the wrong way.',
          1
        ),
        q(
          'Two equal forces of 5 N each act at 120° to one another. What is the size of their resultant?',
          ['10 N', '0 N', '8.7 N', '5 N'],
          3,
          'R = √(25 + 25 + 2×5×5×cos120°) = √(50 − 25) = √25 = 5 N. Two equal vectors at 120° give a resultant equal to either one of them — a result worth remembering.',
          3
        ),
        q(
          'When is the resultant of two vectors equal to the ordinary sum of their magnitudes?',
          ['Never', 'Only when the angle between them is 0°', 'Always', 'Only when they are perpendicular'],
          1,
          'Only at 0°, when they point the same way. At every other angle cos θ is less than 1, so the resultant is shorter than A + B.',
          2
        ),
      ],
    }),

    b('text', 14, {
      markdown:
        'Next: the same sum drawn a different way — with both arrows starting from one corner. That picture gives us a formula we can actually put numbers into.',
    }),
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// PAGE 10 — Subtracting Vectors
// ═════════════════════════════════════════════════════════════════════════════

// P = 5 units at 20°, Q = 4 units at 110°.
const P10 = { mag: 5, ang: 20 };
const Q10 = { mag: 4, ang: 110 };
const PmQ = polar(sum(toXY(P10.mag, P10.ang), neg(toXY(Q10.mag, Q10.ang))));
const PpQ = polar(sum(toXY(P10.mag, P10.ang), toXY(Q10.mag, Q10.ang)));

const page10 = {
  page_number: 10,
  slug: 'subtracting-vectors',
  title: 'Subtracting Vectors',
  subtitle: 'There is no new rule — you just turn one of them around',
  glossary: [
    { term: 'negative of a vector', definition: 'The same vector turned through 180° — same length, opposite direction.' },
    { term: 'change in velocity', definition: 'Final velocity minus initial velocity, worked out as a vector subtraction, not a number subtraction.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A cricket ball striking a bat and rebounding, with arrows showing the incoming velocity, the outgoing velocity and the change in velocity.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt:
        'Wide cinematic illustration on a very dark near-black background. A cricket ball approaches a bat from the left and rebounds upward to the right. A glowing orange arrow shows the incoming velocity, a second orange arrow shows the outgoing velocity, and a bright amber arrow between the two arrowheads shows the change in velocity. Clean technical-diagram style, motion blur on the ball, no text labels. Dark background, orange and amber accents only.',
    }),

    b('callout', 1, {
      variant: 'fun_fact',
      title: 'A ball that never slowed down — but still changed',
      markdown:
        'A cricket ball comes in at 20 m/s and leaves the bat at 20 m/s. The speed is exactly the same before and after.\n\n' +
        'So did anything change? Yes — a great deal. The **direction** flipped, and that alone means the velocity changed. Working out how much it changed is a vector subtraction, and it is the reason a batsman feels the impact.',
    }),

    b('text', 2, {
      markdown:
        'Subtraction of vectors looks frightening the first time you see it. It is not. There is **no new rule to learn**.\n\n' +
        'We simply rewrite the subtraction as an addition:\n\n' +
        '$ \\vec{A} - \\vec{B} = \\vec{A} + (-\\vec{B}) $\n\n' +
        'So the only new idea is what $ -\\vec{B} $ means. It is the same arrow, the same length, turned round through 180°. That is all.\n\n' +
        'Once you have turned it round, you add it tip-to-tail exactly as you did on the last page.',
    }),

    b('heading', 3, {
      text: 'Turn it around, then add',
      level: 2,
      objective: 'Build A − B by reversing B and chaining it onto A.',
    }),

    b('vector_board', 4, {
      title: 'Watch B turn around',
      archetype: 'vector-subtraction',
      units: 'm/s',
      guided: true,
      vectors: [
        v('A', 6, 20, { color: 'indigo', draggable: true }),
        v('B', 4.5, 100, { color: 'amber', draggable: true }),
      ],
      params: { show_reverse: true },
      caption: 'Four short steps. Read each one, then press the button to see it drawn. The dashed red arrow at the end is B − A — notice it is the exact opposite of A − B.',
    }),

    b('vector_board', 5, {
      title: 'Practice — drag B until A − B points due east',
      archetype: 'vector-subtraction',
      units: 'N',
      vectors: [
        v('A', 6, 40, { color: 'indigo' }),
        v('B', 4, 130, { color: 'amber', draggable: true }),
      ],
      params: { angle_snap: 5, show_reverse: false },
      target: {
        prompt:
          'A is fixed. Drag the glowing amber tip until the green $ \\vec{A} - \\vec{B} $ arrow lies flat along the axis, pointing **due east**.',
        resultant_angle: 0,
        angle_tolerance: 4,
        success:
          'Well done. For A − B to lie flat along the axis, B has to cancel A’s entire upward part — so B’s upward component must equal A’s. Its sideways part is free, which is why several positions work.',
      },
      caption: 'Only the direction is being checked here, not the length.',
    }),


    b('text', 6, {
      markdown:
        'Look carefully at the two green and red arrows on the board.\n\n' +
        '$ \\vec{A} - \\vec{B} $ and $ \\vec{B} - \\vec{A} $ have the **same length** but point in **opposite directions**.\n\n' +
        'With ordinary numbers, 7 − 3 and 3 − 7 give 4 and −4, and the minus sign is easy to spot. With vectors the "minus sign" shows up as the whole arrow flipping round, which is much easier to miss.\n\n' +
        'Shortcut: the answer always points **towards the first vector named**. In $ \\vec{A} - \\vec{B} $, the arrow leans towards A.',
    }),

    b('vector_board', 7, {
      archetype: 'vector-subtraction',
      units: 'm/s',
      identify: {
        prompt:
          'P is 5 m/s at 20° and Q is 4 m/s at 110°. **Which diagram correctly shows $ \\vec{P} - \\vec{Q} $?**',
        options: [
          {
            // ✗ Q − P — the reversal trap, the single most common error
            vectors: [
              v('P', P10.mag, P10.ang, { color: 'indigo' }),
              v('Q', Q10.mag, Q10.ang, { color: 'amber' }),
              v('result', r1(PmQ.mag), r1((PmQ.ang + 180) % 360), { color: 'emerald' }),
            ],
          },
          {
            // ✓ correct
            vectors: [
              v('P', P10.mag, P10.ang, { color: 'indigo' }),
              v('Q', Q10.mag, Q10.ang, { color: 'amber' }),
              v('result', r1(PmQ.mag), r1(PmQ.ang), { color: 'emerald' }),
            ],
          },
          {
            // ✗ added instead of subtracted
            vectors: [
              v('P', P10.mag, P10.ang, { color: 'indigo' }),
              v('Q', Q10.mag, Q10.ang, { color: 'amber' }),
              v('result', r1(PpQ.mag), r1(PpQ.ang), { color: 'emerald' }),
            ],
          },
          {
            // ✗ magnitudes subtracted (5 − 4 = 1), direction right
            vectors: [
              v('P', P10.mag, P10.ang, { color: 'indigo' }),
              v('Q', Q10.mag, Q10.ang, { color: 'amber' }),
              v('result', P10.mag - Q10.mag, r1(PmQ.ang), { color: 'emerald' }),
            ],
          },
        ],
        correct_index: 1,
        explanation:
          '**B** is right. $ \\vec{P} - \\vec{Q} $ comes out at about ' + r1(PmQ.mag) + ' m/s pointing at roughly ' + Math.round(PmQ.ang) + '° — it leans **towards P**, below the axis.\n\n' +
          '**A** is $ \\vec{Q} - \\vec{P} $. Same length, opposite direction. This is the mistake examiners bank on.\n\n' +
          '**C** is $ \\vec{P} + \\vec{Q} $ — it leans up between the two arrows instead of away from Q.\n\n' +
          '**D** just did 5 − 4 = 1. Magnitudes can only be subtracted like that when the two vectors are along the same line.',
      },
    }),

    b('worked_example', 8, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem:
        'A ball hits a wall horizontally at 20 m/s and bounces straight back at 20 m/s. Find the change in its velocity.',
      solution:
        'Change in velocity means **final minus initial**, as vectors:\n\n' +
        '$ \\Delta\\vec{v} = \\vec{v}_f - \\vec{v}_i $\n\n' +
        'Take "towards the wall" as positive. Then $ v_i = +20 $ m/s and $ v_f = -20 $ m/s, because the ball now travels the other way.\n\n' +
        '$ \\Delta v = (-20) - (+20) = -40\\ \\mathrm{m/s} $\n\n' +
        'So the change is **40 m/s, directed away from the wall**.\n\n' +
        'Watch-out: the speed did not change at all — it was 20 m/s before and after. But the velocity changed by 40 m/s, twice the speed. This is exactly why a fast ball hurts so much more when you catch it and throw it back than when you simply stop it.',
    }),

    b('vector_board', 9, {
      title: 'Read the diagram and calculate',
      archetype: 'vector-subtraction',
      units: 'm/s',
      vectors: [
        v('A', 6, 0, { color: 'indigo' }),
        v('B', 6, 90, { color: 'amber' }),
      ],
      show: { formula: true },
      numeric: {
        prompt:
          'A is 6 m/s east and B is 6 m/s north. Work out $ |\\vec{A} - \\vec{B}| $, correct to one decimal place.',
        answer: 8.5,
        tolerance: 0.15,
        unit: 'm/s',
        worked_reveal:
          'Reversing B gives 6 m/s pointing south. Chained onto A, that is a right triangle with both sides 6.\n\n' +
          '$ |\\vec{A} - \\vec{B}| = \\sqrt{6^2 + 6^2} = \\sqrt{72} = 8.49 \\approx 8.5\\ \\mathrm{m/s} $\n\n' +
          'Notice this is **larger** than either vector. Subtracting two vectors at right angles gives the same size as adding them — only the direction differs.',
      },
    }),

    b('callout', 10, {
      variant: 'exam_tip',
      title: 'Where this actually gets asked',
      markdown:
        'Vector subtraction almost never appears as "subtract these two arrows". It appears disguised:\n\n' +
        '**Change in velocity** — $ \\Delta\\vec{v} = \\vec{v}_f - \\vec{v}_i $. Very common with balls bouncing and objects going round a circle.\n\n' +
        '**Relative velocity** — the velocity of A as seen from B is $ \\vec{v}_A - \\vec{v}_B $. This is the whole of the river-boat and rain-umbrella family of problems.\n\n' +
        'In both, the order matters. Write down which one is "final" and which is "initial" before you draw anything.',
    }),

    b('inline_quiz', 11, {
      pass_threshold: 0.7,
      questions: [
        q(
          'Two vectors have equal magnitude and are perpendicular. How does |A − B| compare with |A + B|?',
          ['|A − B| is smaller', 'They are equal', '|A − B| is larger', 'It depends on which way they point'],
          1,
          'At 90°, R = √(A² + B²) for the sum and √(A² + B²) for the difference too — the cos θ term is zero either way. The two have the same length but different directions.',
          3
        ),
        q(
          'A car travelling east at 15 m/s turns and travels north at 15 m/s. What is the size of the change in velocity?',
          ['0 m/s', '15 m/s', '30 m/s', '21.2 m/s'],
          3,
          'Δv = v_f − v_i. Reversing the initial 15 m/s east gives 15 m/s west; chained onto 15 m/s north that is a right triangle, so |Δv| = √(15² + 15²) = 21.2 m/s. The speed never changed, but the velocity did.',
          3
        ),
        q(
          'What does $ -\\vec{B} $ mean?',
          ['The same vector turned through 180°', 'A vector of zero length', 'The same vector made shorter', 'The vector B with its magnitude made negative'],
          0,
          'Turning it through 180° keeps the length and reverses the direction. A magnitude can never be negative — the minus sign lives in the direction.',
          1
        ),
        q(
          'If $ \\vec{A} - \\vec{B} $ points north-east, which way does $ \\vec{B} - \\vec{A} $ point?',
          ['North-east as well', 'North-west', 'South-west', 'It cannot be decided from this'],
          2,
          'B − A is always exactly opposite to A − B. The opposite of north-east is south-west.',
          2
        ),
      ],
    }),

    b('text', 12, {
      markdown:
        'Next: instead of drawing triangles every time, we break each vector into a sideways part and an upward part. That turns every vector problem into simple addition — and it is how you will actually solve them in an exam.',
    }),
  ],
};

// ── entry point ──────────────────────────────────────────────────────────────
const pages = [page8, page10];
module.exports = { pages, page8, page10 };

if (require.main === module) {
  withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, pages);
  }).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
