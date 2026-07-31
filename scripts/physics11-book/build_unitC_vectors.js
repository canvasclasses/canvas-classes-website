'use strict';
/**
 * Chapter 0 · UNIT C — Vectors. New pages only; four were already built
 * (23 scalars-and-vectors, 24 anatomy-of-a-vector, 26 triangle-law,
 * 31 subtracting-vectors) and keep their slots.
 *
 *   25  Types of Vectors and the Angle Between Them
 *   27  The Parallelogram Law
 *   28  The Polygon Law and Equilibrium
 *   29  Resolving a Vector into Components
 *   30  The Analytical Method — î and ĵ
 *   32  The Dot Product
 *   33  The Cross Product
 *   34  Unit C Practice Arena
 *
 * Every board is GUIDED where the archetype supports steps — nothing is drawn
 * before it has been explained (founder rule, 2026-07-27).
 *
 * Run:  node scripts/physics11-book/build_unitC_vectors.js
 */
const { b, q, v, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch0');

const heroPrompt = (scene) =>
  `Wide cinematic illustration on a very dark near-black background. ${scene} Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.`;

const pmcq = (id, prompt, options, correct_index, explanation) => ({ id, kind: 'mcq', source: 'mcq', prompt, options, correct_index, explanation });
const pnum = (id, prompt, answer, solution) => ({ id, kind: 'numerical', source: 'mcq', prompt, answer, solution });

// ═══ 25 ── Types of Vectors and the Angle Between Them ═══════════════════════
const page25 = {
  page_number: 25,
  slug: 'types-of-vectors-and-the-angle-between',
  title: 'Types of Vectors and the Angle Between Them',
  subtitle: 'Unit vectors, and the tail-to-tail rule',
  glossary: [
    { term: 'unit vector', definition: 'A vector of magnitude exactly 1, used to carry direction only. Written with a hat, like Â.' },
    { term: 'null vector', definition: 'A vector of zero magnitude and no definite direction. What you get when equal and opposite vectors add.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Several arrows of different lengths and directions, with two drawn from the same point showing the angle between them.',
      generation_prompt: heroPrompt(
        'A dark grid with several glowing arrows of different lengths and directions. Two of them start from the same point, with the angle between them marked by a bright arc.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Before adding vectors, it helps to have names for the special cases. Most of these are obvious once stated — but examiners use the names, so you need them.',
    }),
    b('table', 2, {
      caption: 'The vector vocabulary. Only the unit vector needs real work; the rest are just labels.',
      headers: ['Name', 'What it is', 'Why it matters'],
      rows: [
        ['**Unit vector**', 'A vector of magnitude exactly 1', 'Carries direction with no size attached — the most useful one here'],
        ['**Null (zero) vector**', 'Magnitude zero, direction undefined', 'What a balanced set of forces adds up to'],
        ['**Equal vectors**', 'Same magnitude AND same direction', 'They need not start from the same place'],
        ['**Negative vector**', 'Same magnitude, exactly opposite direction', 'The whole basis of subtraction'],
        ['**Collinear vectors**', 'Along the same line, either way', 'Add like ordinary numbers'],
        ['**Coplanar vectors**', 'All lying in one plane', 'Everything in Class 11 mechanics is coplanar'],
        ['**Position vector**', 'From the origin to a point', 'How you specify where something is'],
      ],
    }),
    b('heading', 3, {
      text: 'The unit vector — direction, bottled',
      level: 2,
      objective: 'Find the unit vector along any given vector, and use î, ĵ, k̂.',
    }),
    b('text', 4, {
      markdown:
        'A unit vector is a vector whose length is 1. It is written with a hat: $ \\hat{A} $, read "A hat".\n\n' +
        'To get the unit vector along any vector, divide the vector by its own magnitude:\n\n' +
        '$ \\hat{A} = \\dfrac{\\vec{A}}{|\\vec{A}|} $\n\n' +
        'Dividing by its own size strips the size away and leaves pure direction. That is exactly what it is for.\n\n' +
        'Three unit vectors have special names because they point along the three axes:\n\n' +
        '$ \\hat{i} $ along $ x $, $ \\qquad \\hat{j} $ along $ y $, $ \\qquad \\hat{k} $ along $ z $\n\n' +
        'These let you write any vector as a sum, which is how almost all vector work is actually done:\n\n' +
        '$ \\vec{A} = A_x\\hat{i} + A_y\\hat{j} + A_z\\hat{k} $\n\n' +
        'And the magnitude follows from Pythagoras in three dimensions:\n\n' +
        '$ |\\vec{A}| = \\sqrt{A_x^2 + A_y^2 + A_z^2} $',
    }),
    b('worked_example', 5, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find the magnitude of $ \\vec{A} = 3\\hat{i} + 4\\hat{j} $, and the unit vector along it.',
      solution:
        'Magnitude first, by Pythagoras:\n\n' +
        '$ |\\vec{A}| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5 $\n\n' +
        'Now divide the vector by that magnitude:\n\n' +
        '$ \\hat{A} = \\dfrac{3\\hat{i} + 4\\hat{j}}{5} = 0.6\\,\\hat{i} + 0.8\\,\\hat{j} $\n\n' +
        'Check it: $ \\sqrt{0.6^2 + 0.8^2} = \\sqrt{0.36 + 0.64} = \\sqrt{1} = 1 $. It really is a unit vector.\n\n' +
        'And notice 0.6 and 0.8 — the 3-4-5 triangle again, which means this vector points at 53° to the x-axis.',
    }),
    b('heading', 6, {
      text: 'The angle between two vectors — tail to tail',
      level: 2,
      objective: 'Identify the correct angle between two vectors, including when they are drawn tip-to-tail.',
    }),
    b('text', 7, {
      markdown:
        'This sounds trivial and it is not. Getting the angle wrong is one of the most expensive mistakes in vector problems, because it feeds straight into every formula that follows.\n\n' +
        '**The rule: the angle between two vectors is measured with both drawn from the same point — tail to tail.**\n\n' +
        'Here is where it bites. When you add vectors, you draw them **tip to tail**. In that picture the angle you can see is *not* the angle between them — it is $ 180° - \\theta $.\n\n' +
        'So before using any formula with $ \\theta $ in it, redraw the two vectors from a common origin, and measure there.\n\n' +
        'On the board below, drag either arrow and watch the angle readout.',
    }),
    b('vector_board', 8, {
      title: 'The angle between two vectors',
      archetype: 'dot-cross',
      units: 'N',
      vectors: [v('A', 6, 0, { color: 'indigo', draggable: true }), v('B', 5, 55, { color: 'amber', draggable: true })],
      show: { angleArc: true, readout: false, formula: false, components: false },
      caption: 'Both arrows start from the same point. That shared corner is where θ lives.',
      identify: {
        prompt: 'Two forces act on a body. Which diagram shows the angle between them measured correctly as 120°?',
        options: [
          { vectors: [v('A', 5, 0, { color: 'indigo' }), v('B', 5, 120, { color: 'amber' })], caption: 'Both from the same corner, 120° apart' },
          { vectors: [v('A', 5, 0, { color: 'indigo' }), v('B', 5, 60, { color: 'amber' })], caption: 'Both from the same corner, 60° apart' },
          { vectors: [v('A', 5, 0, { color: 'indigo' }), v('B', 5, 120, { color: 'amber', tail: 'chain' })], caption: 'Drawn tip-to-tail' },
        ],
        correct_index: 0,
        explanation:
          'Diagram **A** is right: both arrows leave the same point, so the arc between them is the true angle, 120°.\n\n' +
          'Diagram **B** is a genuine 60° pair — a different situation entirely.\n\n' +
          'Diagram **C** is the trap. It contains exactly the same two vectors as A, but drawn tip-to-tail for adding. The angle you can see in that picture is 60°, not 120°. Redraw from a common tail before reading any angle.',
      },
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Two special angles worth spotting instantly',
      markdown:
        '**$ \\theta = 0° $ — parallel.** The vectors reinforce completely; the resultant is simply $ A + B $. This is the biggest a resultant can ever be.\n\n' +
        '**$ \\theta = 180° $ — antiparallel.** They oppose; the resultant is $ |A - B| $. This is the smallest it can ever be.\n\n' +
        'So for any two vectors, the resultant is always somewhere between $ |A - B| $ and $ A + B $. A question that offers you an answer outside that range is offering you a wrong answer, and you can eliminate it without calculating anything.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('The unit vector along $ \\vec{A} = 6\\hat{i} + 8\\hat{j} $ is:',
          ['$ 0.6\\hat{i} + 0.8\\hat{j} $', '$ 6\\hat{i} + 8\\hat{j} $', '$ 0.75\\hat{i} + \\hat{j} $', '$ 3\\hat{i} + 4\\hat{j} $'],
          0,
          '$ |\\vec{A}| = \\sqrt{36 + 64} = 10 $, so divide each component by 10.',
          2),
        q('Two vectors of magnitudes 7 and 4 are added. The resultant CANNOT be:',
          ['$ 11 $', '$ 3 $', '$ 5 $', '$ 12 $'],
          3,
          'The resultant must lie between $ |7-4| = 3 $ and $ 7+4 = 11 $. So 12 is impossible, while 3, 5 and 11 are all reachable.',
          2),
        q('Two vectors are drawn tip-to-tail and the visible angle between them is 50°. The angle to use in the resultant formula is:',
          ['$ 50° $', '$ 40° $', '$ 130° $', '$ 100° $'],
          2,
          'The formula needs the tail-to-tail angle, which is $ 180° - 50° = 130° $. Using 50° here is the single most common vector error.',
          3),
      ],
    }),
    b('text', 11, {
      markdown: 'You already know the triangle law. Next: the same rule drawn a different way — the version physics actually uses for forces.',
    }),
  ],
};

// ═══ 27 ── The Parallelogram Law ═════════════════════════════════════════════
const page27 = {
  page_number: 27,
  slug: 'parallelogram-law-of-vector-addition',
  title: 'The Parallelogram Law',
  subtitle: 'Both arrows from the same corner — and a formula for the answer',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Two arrows from a common corner with the parallelogram completed and its diagonal drawn.',
      generation_prompt: heroPrompt(
        'Two glowing arrows leaving the same corner on a dark grid, with faint dashed lines completing a parallelogram, and a bright diagonal drawn from the shared corner to the far corner.'
      ),
    }),
    b('curiosity_prompt', 1, {
      prompt:
        'Two ropes pull a boat, both tied to the same ring at the bow. The triangle law says to slide one rope\'s arrow to the tip of the other — but the ropes do not act one after the other. They both pull from the same point, at the same time. Is the triangle law even describing this correctly?',
      hint: 'Does moving an arrow somewhere else change what it is?',
      reveal:
        'It gives the right answer, but it draws a picture that does not look like the situation. That bothers people, and rightly so.\n\n' +
        'The parallelogram law fixes the picture. Both arrows stay where they really act — at the same corner — and the resultant is the diagonal. Same answer, honest diagram.',
    }),
    b('text', 2, {
      markdown:
        '**The parallelogram law:** if two vectors acting at a point are drawn as the two adjacent sides of a parallelogram, their resultant is the diagonal drawn from that same point.\n\n' +
        'It is not a new rule. It is the triangle law redrawn — the opposite side of the parallelogram is exactly the "slide it to the tip" arrow of the triangle law. Both give the same resultant, always.\n\n' +
        'Work through the construction below one click at a time.',
    }),
    b('vector_board', 3, {
      title: 'Build the parallelogram',
      archetype: 'parallelogram-law',
      guided: true,
      units: 'N',
      vectors: [v('A', 6, 0, { color: 'indigo', draggable: true }), v('B', 5, 60, { color: 'amber', draggable: true })],
      show: { angleArc: true, readout: true, formula: true },
      caption: 'After the walkthrough, drag either arrow head and watch |R| and the formula update live.',
      predict: {
        prompt: 'Two equal forces act at 60° to each other. Will their resultant be bigger than, smaller than, or equal to their sum?',
        options: ['Bigger than the sum', 'Equal to the sum', 'Smaller than the sum', 'Zero'],
        answer_index: 2,
        reveal: 'Smaller. Only when the two forces point exactly the same way (θ = 0°) does the resultant equal the plain sum. Any angle between them wastes some of the effort pulling against each other.',
      },
    }),
    b('heading', 4, {
      text: 'The formula',
      level: 2,
      objective: 'Calculate the magnitude and direction of a resultant from two vectors and the angle between them.',
    }),
    b('text', 5, {
      markdown:
        'Applying the cosine rule to that parallelogram gives the result you will use constantly:\n\n' +
        '$ R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta} $\n\n' +
        'And the direction, measured from $ \\vec{A} $:\n\n' +
        '$ \\tan\\alpha = \\dfrac{B\\sin\\theta}{A + B\\cos\\theta} $\n\n' +
        'Compare the first formula with the cosine rule from Unit A, $ c^2 = a^2 + b^2 - 2ab\\cos C $. The only difference is the sign — a **plus** here instead of a minus — because $ \\theta $ is measured between the vectors rather than inside the closing triangle.',
    }),
    b('callout', 6, {
      variant: 'remember',
      title: 'Three cases worth memorising',
      markdown:
        'Put the three easy angles into the formula and the results are worth knowing on sight:\n\n' +
        '- $ \\theta = 0° $: $ \\cos 0 = 1 $, so $ R = A + B $ — the **maximum**\n' +
        '- $ \\theta = 90° $: $ \\cos 90 = 0 $, so $ R = \\sqrt{A^2 + B^2} $ — plain Pythagoras\n' +
        '- $ \\theta = 180° $: $ \\cos 180 = -1 $, so $ R = |A - B| $ — the **minimum**\n\n' +
        'The 90° case is the one that appears most, because perpendicular forces are everywhere.',
    }),
    b('worked_example', 7, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Two forces of 5 N and 3 N act at a point with 60° between them. Find the magnitude of the resultant.',
      solution:
        'Straight into the formula, with $ A = 5 $, $ B = 3 $, $ \\theta = 60° $ and $ \\cos 60° = \\dfrac{1}{2} $.\n\n' +
        '$ R = \\sqrt{5^2 + 3^2 + 2(5)(3)\\cos 60°} $\n\n' +
        '$ = \\sqrt{25 + 9 + 30 \\times \\dfrac{1}{2}} $\n\n' +
        '$ = \\sqrt{25 + 9 + 15} = \\sqrt{49} = 7\\ \\mathrm{N} $\n\n' +
        'Sense check against the bounds: the answer must lie between $ |5-3| = 2 $ and $ 5+3 = 8 $. Seven sits comfortably inside, and nearer the top — which is right, because 60° is a fairly small angle.',
    }),
    b('worked_example', 8, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Two equal forces of magnitude $ F $ act at 120° to each other. Find their resultant.',
      solution:
        'Here $ A = B = F $ and $ \\cos 120° = -\\dfrac{1}{2} $.\n\n' +
        '$ R = \\sqrt{F^2 + F^2 + 2F^2\\left(-\\dfrac{1}{2}\\right)} $\n\n' +
        '$ = \\sqrt{2F^2 - F^2} = \\sqrt{F^2} = F $\n\n' +
        'A neat and much-used result: **two equal forces at 120° have a resultant equal to either one of them.**\n\n' +
        'It also explains the three-force equilibrium you will meet on the next page. If a third force of magnitude $ F $ is added opposite to this resultant, everything balances — which is why three equal forces at 120° apart are in equilibrium.',
    }),
    b('vector_board', 9, {
      title: 'Your turn — read the resultant',
      archetype: 'parallelogram-law',
      units: 'N',
      vectors: [v('A', 8, 0, { color: 'indigo', draggable: true }), v('B', 6, 90, { color: 'amber', draggable: true })],
      show: { angleArc: true, readout: true, formula: true },
      caption: 'These two forces are perpendicular, so the formula collapses to Pythagoras.',
      numeric: {
        prompt: 'For the 8 N and 6 N forces shown at 90°, what is the magnitude of the resultant, in newtons?',
        answer: 10,
        tolerance: 0.2,
        unit: 'N',
        worked_reveal:
          'At 90°, $ \\cos\\theta = 0 $ and the middle term vanishes:\n\n' +
          '$ R = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\ \\mathrm{N} $\n\n' +
          'The 6-8-10 triangle is just the 3-4-5 triangle doubled — which also tells you the resultant sits at 37° from the 8 N force.',
      },
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('Two forces of 4 N and 3 N act at 90°. Their resultant is:',
          ['$ 7 $ N', '$ 1 $ N', '$ 5 $ N', '$ 12 $ N'],
          2,
          'At 90° the formula becomes Pythagoras: $ \\sqrt{16 + 9} = 5 $ N. 7 N would need them parallel; 1 N would need them opposite.',
          1),
        q('The resultant of two vectors is maximum when the angle between them is:',
          ['$ 0° $', '$ 90° $', '$ 180° $', '$ 45° $'],
          0,
          'At 0° they point the same way and simply add. As the angle grows, $ \\cos\\theta $ shrinks and so does the resultant.',
          1),
        q('Two equal forces $ F $ have a resultant of magnitude $ F $. The angle between them is:',
          ['$ 60° $', '$ 90° $', '$ 180° $', '$ 120° $'],
          3,
          'From Example 2: at 120°, $ \\cos\\theta = -\\tfrac{1}{2} $ and the formula gives exactly $ F $. This result appears often enough to be worth remembering.',
          3),
      ],
    }),
    b('text', 11, {
      markdown: 'Next: what happens when there are more than two vectors — and what it means when they add to nothing.',
    }),
  ],
};

// ═══ 28 ── Polygon Law and Equilibrium ═══════════════════════════════════════
const page28 = {
  page_number: 28,
  slug: 'polygon-law-and-equilibrium',
  title: 'The Polygon Law and Equilibrium',
  subtitle: 'When the arrows close up, everything balances',
  glossary: [
    { term: 'equilibrium', definition: 'The state in which all the forces on a body add to zero, so it does not accelerate.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Several arrows joined tip to tail forming a closed shape.',
      generation_prompt: heroPrompt(
        'Four glowing arrows joined tip-to-tail on a dark grid, forming a closed quadrilateral that returns exactly to its starting point.'
      ),
    }),
    b('text', 1, {
      markdown:
        'The triangle law handles two vectors. For three or more, nothing changes — you just keep going.\n\n' +
        '**The polygon law:** to add any number of vectors, draw them one after another, each starting where the last one ended. The resultant is the single arrow from the very first tail to the very last tip.\n\n' +
        'And the order does not matter. Add them in any sequence you like and the closing arrow is the same, because vector addition is commutative just as ordinary addition is.',
    }),
    b('heading', 2, {
      text: 'The case that matters most — a closed polygon',
      level: 2,
      objective: 'Recognise that a closed vector polygon means the resultant is zero.',
    }),
    b('text', 3, {
      markdown:
        'Now suppose the last arrow lands exactly back on the first tail. The chain has closed.\n\n' +
        'Then the arrow from the first tail to the last tip has **zero length**. The resultant is the null vector:\n\n' +
        '$ \\vec{F_1} + \\vec{F_2} + \\vec{F_3} + \\ldots = 0 $\n\n' +
        'A body with zero resultant force does not accelerate. It is in **equilibrium** — either sitting still, or moving at constant velocity.\n\n' +
        'That is a big deal. It means an entire class of physics problems can be solved by drawing a shape and checking whether it closes.\n\n' +
        'On the board below the three forces do **not** currently balance. Drag the arrow heads until the polygon closes.',
    }),
    b('vector_board', 4, {
      title: 'Make the forces balance',
      archetype: 'polygon-equilibrium',
      units: 'N',
      vectors: [
        v('F₁', 5, 0, { color: 'indigo', draggable: true, tail: 'chain' }),
        v('F₂', 5, 120, { color: 'amber', draggable: true, tail: 'chain' }),
        v('F₃', 5, 200, { color: 'pink', draggable: true, tail: 'chain' }),
      ],
      show: { readout: true, formula: false },
      caption: 'Three equal forces. There is exactly one arrangement that closes the triangle.',
      target: {
        prompt: 'Drag the head of F₃ until the three forces balance — that is, until the chain of arrows closes back on its starting point and the resultant reads zero.',
        resultant_mag: 0,
        tolerance: 0.6,
        show_goal: false,
        success:
          'Closed. F₃ had to sit at 240°, so the three equal forces are 120° apart — exactly the result from the previous page, where two equal forces at 120° gave a resultant equal to either one of them. The third force cancels it.',
      },
    }),
    b('callout', 5, {
      variant: 'remember',
      title: 'Equilibrium, stated three ways',
      markdown:
        'All three of these say the same thing, and questions switch between them freely:\n\n' +
        '- The vector polygon **closes**\n' +
        '- $ \\Sigma\\vec{F} = 0 $\n' +
        '- $ \\Sigma F_x = 0 $ **and** $ \\Sigma F_y = 0 $\n\n' +
        'That last version is the one you will actually compute with, once you can resolve into components — which is the next page.',
    }),
    b('worked_example', 6, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Three forces act on a body and it stays at rest. Two of them are $ 6 $ N due east and $ 8 $ N due north. Find the third force.',
      solution:
        'For equilibrium the three must add to zero, so the third force must exactly cancel the resultant of the first two.\n\n' +
        'The two given forces are perpendicular, so their resultant is:\n\n' +
        '$ R = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = 10\\ \\mathrm{N} $\n\n' +
        'Its direction, measured from east:\n\n' +
        '$ \\tan\\alpha = \\dfrac{8}{6} = 1.33 \\;\\Rightarrow\\; \\alpha = 53° $ north of east\n\n' +
        'The third force must be **10 N, directed opposite to that** — that is, 53° south of west.\n\n' +
        'A useful general statement falls out of this: when three forces hold a body in equilibrium, **each one is equal and opposite to the resultant of the other two.**',
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.7,
      questions: [
        q('If the vector polygon of several forces closes, then:',
          ['The forces are all equal', 'The resultant is zero and the body is in equilibrium', 'The body must be at rest', 'The forces are all perpendicular'],
          1,
          'A closed polygon means zero resultant. Note that equilibrium allows constant velocity too — the body need not be at rest.',
          2),
        q('Four forces act on a body in equilibrium. Three of them add to $ 12 $ N pointing east. The fourth force is:',
          ['$ 12 $ N east', '$ 4 $ N west', '$ 12 $ N west', 'Zero'],
          2,
          'For the total to be zero, the fourth must cancel the other three exactly — same magnitude, opposite direction.',
          2),
        q('Three equal forces are in equilibrium. The angle between any two of them is:',
          ['$ 90° $', '$ 60° $', '$ 180° $', '$ 120° $'],
          3,
          'Equal forces in equilibrium must be evenly spaced around the full turn: $ 360°/3 = 120° $.',
          2),
      ],
    }),
    b('text', 8, {
      markdown: 'Adding vectors by drawing is fine for two or three. For anything harder we need a numerical method — and that starts by breaking every vector into pieces.',
    }),
  ],
};

// ═══ 29 ── Resolving a Vector into Components ════════════════════════════════
const page29 = {
  page_number: 29,
  slug: 'resolving-vectors-into-components',
  title: 'Resolving a Vector into Components',
  subtitle: 'Replace one awkward arrow with two easy ones',
  glossary: [
    { term: 'component', definition: 'One of the two perpendicular vectors that together have exactly the same effect as the original vector.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A slanting arrow with dashed lines dropping to the two axes, showing its horizontal and vertical parts.',
      generation_prompt: heroPrompt(
        'A single glowing slanted arrow on a dark grid, with faint dashed perpendicular lines dropping from its tip to the horizontal and vertical axes, forming a right-angled box.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Adding vectors by drawing works, but it is slow and only as accurate as your ruler. The professional method runs the other way: instead of combining arrows, **break every arrow into pieces that lie along the axes**, where they add like ordinary numbers.\n\n' +
        'This is called **resolving** a vector, and it is the single most-used technique in all of mechanics.',
    }),
    b('vector_board', 2, {
      title: 'Resolving a force',
      archetype: 'resolution',
      guided: true,
      units: 'N',
      params: { max_mag: 12 },
      vectors: [v('F', 10, 37, { color: 'indigo', draggable: true })],
      show: { components: true, angleArc: true, readout: true, formula: true },
      caption: 'A 10 N force at 37°. Walk through the construction, then drag the head and watch both components respond.',
      predict: {
        prompt: 'As the angle of a force gets closer to 90° (straight up), what happens to its horizontal component?',
        options: ['It grows', 'It shrinks towards zero', 'It stays the same', 'It becomes negative'],
        answer_index: 1,
        reveal: 'It shrinks to zero. A force pointing straight up has no horizontal effect at all — $ \\cos 90° = 0 $. That is why lifting something vertically does no horizontal work.',
      },
    }),
    b('heading', 3, {
      text: 'The two formulas',
      level: 2,
      objective: 'Resolve any vector into perpendicular components and reassemble it.',
    }),
    b('text', 4, {
      markdown:
        'For a vector $ \\vec{A} $ at angle $ \\theta $ to the x-axis:\n\n' +
        '$ A_x = A\\cos\\theta \\qquad A_y = A\\sin\\theta $\n\n' +
        'And running it backwards — components to vector:\n\n' +
        '$ A = \\sqrt{A_x^2 + A_y^2} \\qquad \\tan\\theta = \\dfrac{A_y}{A_x} $\n\n' +
        'Those four relations are the complete toolkit. Everything else in this unit is an application of them.',
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'cos is not always x',
      markdown:
        'Students memorise "cos for horizontal, sin for vertical" and then lose marks the first time a question measures the angle from the **vertical** instead.\n\n' +
        'The reliable rule is about the triangle, not the axis:\n\n' +
        '**The component ADJACENT to the angle uses cos. The component OPPOSITE the angle uses sin.**\n\n' +
        'Mark the angle on your diagram, see which side touches it, and you cannot go wrong — whichever way the axes happen to be drawn. This matters immediately on inclined planes, where the axes are tilted along the slope.',
    }),
    b('worked_example', 6, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A force of 10 N acts at 37° above the horizontal. Find its horizontal and vertical components.',
      solution:
        'Use the 3-4-5 values: $ \\cos 37° = 0.8 $ and $ \\sin 37° = 0.6 $.\n\n' +
        '$ F_x = F\\cos\\theta = 10 \\times 0.8 = 8\\ \\mathrm{N} $\n\n' +
        '$ F_y = F\\sin\\theta = 10 \\times 0.6 = 6\\ \\mathrm{N} $\n\n' +
        'Check by reassembling: $ \\sqrt{8^2 + 6^2} = \\sqrt{100} = 10 $ N. Back to where we started, so the components are right.\n\n' +
        'This is exactly why question-setters choose 37° and 53° — the arithmetic stays clean and the physics stays the point.',
    }),
    b('worked_example', 7, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A block of weight $ W $ rests on a slope inclined at angle $ \\theta $ to the horizontal. Resolve its weight along and perpendicular to the slope.',
      solution:
        'The weight always acts straight down. But on a slope the useful axes are **along** the slope and **perpendicular** to it, so we resolve along those instead.\n\n' +
        'Tilting the axes by $ \\theta $ puts the same angle $ \\theta $ between the weight and the perpendicular direction. So:\n\n' +
        '- Perpendicular to the slope (adjacent to $ \\theta $, so cos): $ W\\cos\\theta $\n' +
        '- Along the slope, downhill (opposite $ \\theta $, so sin): $ W\\sin\\theta $\n\n' +
        'The $ W\\sin\\theta $ piece is what slides the block down. The $ W\\cos\\theta $ piece presses it into the surface and sets the normal force.\n\n' +
        'Notice that here the **sine** goes with the direction of motion — the opposite of the flat-ground case. That is precisely why the adjacent/opposite rule beats memorising "cos for horizontal".',
    }),
    b('vector_board', 8, {
      title: 'Your turn — find the component',
      archetype: 'resolution',
      units: 'N',
      params: { max_mag: 12 },
      vectors: [v('F', 10, 53, { color: 'indigo', draggable: true })],
      show: { components: true, angleArc: true, readout: false, formula: false },
      caption: 'A 10 N force, now at 53° to the horizontal. Work out the horizontal component before revealing.',
      numeric: {
        prompt: 'What is the horizontal component of this 10 N force at 53°, in newtons?',
        answer: 6,
        tolerance: 0.3,
        unit: 'N',
        worked_reveal:
          '$ F_x = F\\cos\\theta = 10\\cos 53° $\n\n' +
          'And $ \\cos 53° = 0.6 $ from the 3-4-5 triangle.\n\n' +
          '$ F_x = 10 \\times 0.6 = 6\\ \\mathrm{N} $\n\n' +
          'Compare with the previous example at 37°, where the horizontal component was 8 N. The two angles swap the roles of 0.6 and 0.8, because they add to 90°.',
      },
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.7,
      questions: [
        q('A 20 N force acts at 60° to the horizontal. Its vertical component is:',
          ['$ 10 $ N', '$ 20 $ N', '$ 17.3 $ N', '$ 34.6 $ N'],
          2,
          '$ F_y = 20\\sin 60° = 20 \\times 0.866 = 17.3 $ N. The 10 N answer comes from using cos by mistake.',
          2),
        q('A vector has components $ A_x = 5 $ and $ A_y = 12 $. Its magnitude is:',
          ['$ 17 $', '$ 7 $', '$ 60 $', '$ 13 $'],
          3,
          '$ \\sqrt{25 + 144} = \\sqrt{169} = 13 $. Components add as squares, never directly — 17 is the common wrong answer.',
          2),
        q('On a slope of angle $ \\theta $, the component of weight along the slope is:',
          ['$ W\\cos\\theta $', '$ W\\sin\\theta $', '$ W\\tan\\theta $', '$ W $'],
          1,
          '$ W\\sin\\theta $ acts down the slope and drives the sliding; $ W\\cos\\theta $ presses into the surface.',
          2),
      ],
    }),
    b('text', 10, {
      markdown: 'Now that every vector can be broken into pieces, adding any number of them becomes pure arithmetic.',
    }),
  ],
};

// ═══ 30 ── The Analytical Method ═════════════════════════════════════════════
const page30 = {
  page_number: 30,
  slug: 'analytical-method-of-vector-addition',
  title: 'The Analytical Method',
  subtitle: 'Add the x parts, add the y parts, done',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Several arrows broken into horizontal and vertical parts, with the parts collected into two columns.',
      generation_prompt: heroPrompt(
        'Three glowing slanted arrows on a dark grid, each with faint dashed horizontal and vertical component lines, and two bright summed arrows along the axes on the right.'
      ),
    }),
    b('text', 1, {
      markdown:
        'This is how vectors are added in practice — no ruler, no protractor, no drawing to scale.\n\n' +
        'The method is four steps, and it works for any number of vectors:\n\n' +
        '1. **Resolve** every vector into its $ x $ and $ y $ components.\n' +
        '2. **Add all the $ x $ components** to get $ R_x $.\n' +
        '3. **Add all the $ y $ components** to get $ R_y $.\n' +
        '4. **Reassemble:** $ R = \\sqrt{R_x^2 + R_y^2} $ and $ \\tan\\theta = \\dfrac{R_y}{R_x} $.\n\n' +
        'Once resolved, the components lie along the same line, so they add like ordinary signed numbers. That is the whole trick — **the hard part of vector addition disappears the moment everything is pointing along an axis.**',
    }),
    b('vector_board', 2, {
      title: 'Adding by components',
      archetype: 'analytical-addition',
      units: 'N',
      vectors: [v('A', 6, 0, { color: 'indigo', draggable: true }), v('B', 8, 90, { color: 'amber', draggable: true })],
      show: { components: true, readout: true, formula: true },
      caption: 'The panel shows each vector in î, ĵ form, then the column sums, then the resultant. Drag either arrow.',
      numeric: {
        prompt: 'For the two forces shown — 6 N along x and 8 N along y — what is the magnitude of the resultant, in newtons?',
        answer: 10,
        tolerance: 0.2,
        unit: 'N',
        worked_reveal:
          '$ R_x = 6 + 0 = 6 $ and $ R_y = 0 + 8 = 8 $\n\n' +
          '$ |\\vec{R}| = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = 10\\ \\mathrm{N} $\n\n' +
          '$ \\tan\\theta = \\dfrac{8}{6} = 1.33 \\Rightarrow \\theta = 53° $ from the x-axis.',
      },
    }),
    b('heading', 3, {
      text: 'Writing vectors in î, ĵ form',
      level: 2,
      objective: 'Add and subtract vectors written in component form.',
    }),
    b('text', 4, {
      markdown:
        'Once a vector is resolved, we write it using the unit vectors from earlier:\n\n' +
        '$ \\vec{A} = A_x\\hat{i} + A_y\\hat{j} $\n\n' +
        'And in this form, addition becomes almost embarrassingly simple — just collect like terms:\n\n' +
        '$ \\vec{A} + \\vec{B} = (A_x + B_x)\\hat{i} + (A_y + B_y)\\hat{j} $\n\n' +
        'Subtraction works the same way, with minus signs. No triangles, no protractors, no parallelograms. This is why physicists switch to components as early as possible in a problem and stay there.',
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'Signs do the work — so get them right',
      markdown:
        'A component pointing left is **negative**. A component pointing down is **negative**. The method only works because those signs carry the direction information.\n\n' +
        'The safest habit: write the angle of every vector measured anticlockwise from the positive x-axis, then use $ A\\cos\\theta $ and $ A\\sin\\theta $ without worrying. The signs then look after themselves — $ \\cos 135° $ comes out negative on its own.\n\n' +
        'Trying to reason out each sign by eye is where the errors creep in.',
    }),
    b('worked_example', 6, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Given $ \\vec{A} = 3\\hat{i} + 4\\hat{j} $ and $ \\vec{B} = 5\\hat{i} - 12\\hat{j} $, find $ \\vec{A} + \\vec{B} $ and its magnitude.',
      solution:
        'Collect the $ \\hat{i} $ terms and the $ \\hat{j} $ terms separately.\n\n' +
        '$ \\vec{A} + \\vec{B} = (3 + 5)\\hat{i} + (4 - 12)\\hat{j} = 8\\hat{i} - 8\\hat{j} $\n\n' +
        'Now the magnitude:\n\n' +
        '$ |\\vec{A} + \\vec{B}| = \\sqrt{8^2 + (-8)^2} = \\sqrt{64 + 64} = \\sqrt{128} = 8\\sqrt{2} \\approx 11.3 $\n\n' +
        'The negative $ \\hat{j} $ tells you the resultant points below the x-axis — down and to the right, at 45° below the horizontal since the two components are equal in size.',
    }),
    b('worked_example', 7, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Three forces act on a body: 10 N due east, 10 N due north, and 10 N at 45° south of west. Find the resultant.',
      solution:
        'Take east as $ +x $ and north as $ +y $, then resolve each force.\n\n' +
        '**Force 1** (east): $ 10\\hat{i} + 0\\hat{j} $\n\n' +
        '**Force 2** (north): $ 0\\hat{i} + 10\\hat{j} $\n\n' +
        '**Force 3** (45° south of west): both components negative, each $ 10\\cos 45° = 7.07 $:\n\n' +
        '$ -7.07\\hat{i} - 7.07\\hat{j} $\n\n' +
        'Now add the columns:\n\n' +
        '$ R_x = 10 + 0 - 7.07 = 2.93 $\n\n' +
        '$ R_y = 0 + 10 - 7.07 = 2.93 $\n\n' +
        '$ |\\vec{R}| = \\sqrt{2.93^2 + 2.93^2} = 2.93\\sqrt{2} \\approx 4.14\\ \\mathrm{N} $\n\n' +
        'Both components are equal and positive, so the resultant points at **45° north of east**.\n\n' +
        'Try doing that one by drawing triangles and you will see why this method wins.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('If $ \\vec{A} = 2\\hat{i} + 3\\hat{j} $ and $ \\vec{B} = 4\\hat{i} - \\hat{j} $, then $ \\vec{A} + \\vec{B} $ is:',
          ['$ 6\\hat{i} + 4\\hat{j} $', '$ 6\\hat{i} + 2\\hat{j} $', '$ 8\\hat{i} - 3\\hat{j} $', '$ 2\\hat{i} + 2\\hat{j} $'],
          1,
          'Add components separately: $ (2+4)\\hat{i} = 6\\hat{i} $ and $ (3-1)\\hat{j} = 2\\hat{j} $.',
          1),
        q('A vector has $ R_x = -3 $ and $ R_y = 4 $. Its magnitude is:',
          ['$ 1 $', '$ 7 $', '$ 5 $', '$ -5 $'],
          2,
          '$ \\sqrt{9 + 16} = 5 $. Squaring removes the minus sign, and a magnitude can never be negative.',
          1),
        q('Which step comes FIRST in the analytical method?',
          ['Resolve every vector into components', 'Add the magnitudes', 'Find the angle of the resultant', 'Draw the polygon to scale'],
          0,
          'Resolve first. Everything else in the method depends on having components to work with — and magnitudes can never simply be added.',
          2),
      ],
    }),
    b('text', 9, {
      markdown: 'You can now add and subtract vectors any way you like. The last question is what happens when you **multiply** them — and there are two different answers.',
    }),
  ],
};

// ═══ 32 ── The Dot Product ═══════════════════════════════════════════════════
const page32 = {
  page_number: 32,
  slug: 'the-dot-product',
  title: 'The Dot Product',
  subtitle: 'Two vectors in, one number out',
  glossary: [
    { term: 'scalar product', definition: 'Another name for the dot product: it multiplies two vectors and gives an ordinary number, not a vector.' },
    { term: 'projection', definition: 'The shadow one vector casts along the direction of another.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'One arrow casting a shadow along the direction of another arrow.',
      generation_prompt: heroPrompt(
        'Two glowing arrows from a common point on a dark grid, with a soft beam of light casting the shadow of one arrow flat along the direction of the other, the shadow highlighted in amber.'
      ),
    }),
    b('curiosity_prompt', 1, {
      prompt:
        'You drag a heavy box along the floor with a rope held at an angle. Some of your pull goes into moving the box forward, and some of it goes into lifting it slightly. Which part actually does the work?',
      hint: 'Work is done when a force moves something in the direction of that force.',
      reveal:
        'Only the part along the direction of motion. The upward part of your pull does no work at all on a box moving horizontally.\n\n' +
        'The dot product is the operation that extracts exactly that useful part — which is why work is defined as $ W = \\vec{F}\\cdot\\vec{d} $.',
    }),
    b('text', 2, {
      markdown:
        'Multiplying two vectors can be done in two completely different ways, and physics uses both. The first gives a plain number:\n\n' +
        '$ \\vec{A}\\cdot\\vec{B} = AB\\cos\\theta $\n\n' +
        'It is read "A dot B", and it is also called the **scalar product** because the answer is a scalar — no direction attached.\n\n' +
        'The $ \\cos\\theta $ is doing the important work. It picks out how much of $ \\vec{B} $ lies along $ \\vec{A} $ — the shadow, or **projection**, of one vector on the other.\n\n' +
        'Drag either arrow below and watch the value pass through zero and go negative.',
    }),
    b('vector_board', 3, {
      title: 'A · B, live',
      archetype: 'dot-cross',
      units: 'N',
      vectors: [v('A', 6, 0, { color: 'indigo', draggable: true }), v('B', 5, 55, { color: 'amber', draggable: true })],
      show: { angleArc: true, readout: true, formula: true },
      caption: 'The green arrow is the projection of B onto A. Swing B past 90° and the dot product turns negative.',
      predict: {
        prompt: 'What happens to $ \\vec{A}\\cdot\\vec{B} $ when the two vectors are exactly perpendicular?',
        options: ['It reaches its maximum', 'It becomes zero', 'It becomes negative', 'It equals $ AB $'],
        answer_index: 1,
        reveal: 'It is zero, because $ \\cos 90° = 0 $. This makes the dot product a perfect perpendicularity test: if $ \\vec{A}\\cdot\\vec{B} = 0 $ and neither vector is zero, they must be at right angles.',
      },
    }),
    b('heading', 4, {
      text: 'In component form',
      level: 2,
      objective: 'Compute a dot product from components without knowing the angle.',
    }),
    b('text', 5, {
      markdown:
        'You rarely know the angle between two vectors in a real problem. Fortunately there is a second formula that needs only the components:\n\n' +
        '$ \\vec{A}\\cdot\\vec{B} = A_xB_x + A_yB_y + A_zB_z $\n\n' +
        'Multiply matching components, then add. That is all.\n\n' +
        'Both formulas give the same number, and together they are surprisingly powerful — equate them and you can **find the angle** between any two vectors:\n\n' +
        '$ \\cos\\theta = \\dfrac{\\vec{A}\\cdot\\vec{B}}{AB} $\n\n' +
        'That is the standard way to get an angle out of component data, and it is a very common exam question.',
    }),
    b('table', 6, {
      caption: 'What the dot product is used for. Every one of these appears in Class 11.',
      headers: ['Use', 'How', 'Where you meet it'],
      rows: [
        ['Work done', '$ W = \\vec{F}\\cdot\\vec{d} = Fd\\cos\\theta $', 'Work, Energy and Power'],
        ['Perpendicularity test', '$ \\vec{A}\\cdot\\vec{B} = 0 \\Rightarrow $ at right angles', 'Everywhere'],
        ['Finding the angle', '$ \\cos\\theta = \\dfrac{\\vec{A}\\cdot\\vec{B}}{AB} $', 'Vector problems, JEE favourite'],
        ['Projection of B on A', '$ B\\cos\\theta = \\dfrac{\\vec{A}\\cdot\\vec{B}}{A} $', 'Components along any direction'],
        ['Power', '$ P = \\vec{F}\\cdot\\vec{v} $', 'Work, Energy and Power'],
      ],
    }),
    b('callout', 7, {
      variant: 'remember',
      title: 'The sign tells you the story',
      markdown:
        '- $ \\vec{A}\\cdot\\vec{B} > 0 $ — the angle is **less than 90°**, the vectors broadly agree\n' +
        '- $ \\vec{A}\\cdot\\vec{B} = 0 $ — exactly **perpendicular**\n' +
        '- $ \\vec{A}\\cdot\\vec{B} < 0 $ — the angle is **more than 90°**, they broadly oppose\n\n' +
        'This is why friction does negative work: it points opposite to the motion, so $ \\vec{F}\\cdot\\vec{d} $ comes out negative, meaning energy is being taken out of the body rather than put in.\n\n' +
        'Also useful: $ \\hat{i}\\cdot\\hat{i} = 1 $ but $ \\hat{i}\\cdot\\hat{j} = 0 $, since the axes are perpendicular. Those two facts are what make the component formula work.',
    }),
    b('worked_example', 8, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find $ \\vec{A}\\cdot\\vec{B} $ for $ \\vec{A} = 2\\hat{i} + 3\\hat{j} $ and $ \\vec{B} = 4\\hat{i} - \\hat{j} $. Are they perpendicular?',
      solution:
        'Multiply matching components and add.\n\n' +
        '$ \\vec{A}\\cdot\\vec{B} = (2)(4) + (3)(-1) = 8 - 3 = 5 $\n\n' +
        'The result is not zero, so the vectors are **not** perpendicular.\n\n' +
        'It is positive, so the angle between them is less than 90°. To find it exactly:\n\n' +
        '$ A = \\sqrt{4 + 9} = \\sqrt{13}, \\qquad B = \\sqrt{16 + 1} = \\sqrt{17} $\n\n' +
        '$ \\cos\\theta = \\dfrac{5}{\\sqrt{13}\\sqrt{17}} = \\dfrac{5}{14.87} = 0.336 \\;\\Rightarrow\\; \\theta \\approx 70° $',
    }),
    b('worked_example', 9, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A force $ \\vec{F} = 5\\hat{i} + 3\\hat{j} $ N moves a body through a displacement $ \\vec{d} = 4\\hat{i} - 2\\hat{j} $ m. Find the work done.',
      solution:
        'Work is the dot product of force and displacement.\n\n' +
        '$ W = \\vec{F}\\cdot\\vec{d} = (5)(4) + (3)(-2) = 20 - 6 = 14\\ \\mathrm{J} $\n\n' +
        'Positive, so the force is helping the motion rather than resisting it.\n\n' +
        'Note that the answer is a plain number with no direction — work is a scalar. That is the whole reason the dot product exists: two vectors go in, and something you can add up arithmetically comes out.',
    }),
    b('vector_board', 10, {
      title: 'Your turn',
      archetype: 'dot-cross',
      units: 'N',
      vectors: [v('A', 6, 0, { color: 'indigo', draggable: true }), v('B', 5, 60, { color: 'amber', draggable: true })],
      show: { angleArc: true, readout: false, formula: false },
      caption: 'A 6 N vector and a 5 N vector with 60° between them. Work out the dot product before revealing.',
      numeric: {
        prompt: 'What is $ \\vec{A}\\cdot\\vec{B} $ for these two vectors?',
        answer: 15,
        tolerance: 0.5,
        worked_reveal:
          '$ \\vec{A}\\cdot\\vec{B} = AB\\cos\\theta = 6 \\times 5 \\times \\cos 60° $\n\n' +
          'And $ \\cos 60° = \\dfrac{1}{2} $, so:\n\n' +
          '$ \\vec{A}\\cdot\\vec{B} = 30 \\times \\dfrac{1}{2} = 15 $\n\n' +
          'Positive, and exactly half of the maximum possible value of 30 that they would have if they pointed the same way.',
      },
    }),
    b('inline_quiz', 11, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\vec{A}\\cdot\\vec{B} = 0 $ for two non-zero vectors means they are:',
          ['Parallel', 'Perpendicular', 'Equal', 'Opposite'],
          1,
          'A zero dot product means $ \\cos\\theta = 0 $, so $ \\theta = 90° $. Parallel vectors would give the maximum, not zero.',
          1),
        q('For $ \\vec{A} = \\hat{i} + 2\\hat{j} $ and $ \\vec{B} = 3\\hat{i} + \\hat{j} $, $ \\vec{A}\\cdot\\vec{B} $ equals:',
          ['$ 3\\hat{i} + 2\\hat{j} $', '$ 7 $', '$ 5 $', '$ 2 $'],
          2,
          '$ (1)(3) + (2)(1) = 3 + 2 = 5 $. Note the answer is a number, not a vector — which rules out the first option immediately.',
          2),
        q('A friction force acts opposite to a body\'s displacement. The work it does is:',
          ['Positive', 'Zero', 'Cannot be determined', 'Negative'],
          3,
          'The angle is 180°, so $ \\cos\\theta = -1 $ and $ W = -Fd $. Friction removes energy from the body.',
          2),
      ],
    }),
    b('text', 12, {
      markdown: 'One more product to go — and this one gives back a vector.',
    }),
  ],
};

// ═══ 33 ── The Cross Product ═════════════════════════════════════════════════
const page33 = {
  page_number: 33,
  slug: 'the-cross-product',
  title: 'The Cross Product',
  subtitle: 'Two vectors in, a third vector out — pointing sideways',
  glossary: [
    { term: 'vector product', definition: 'Another name for the cross product: it multiplies two vectors and gives a vector perpendicular to both.' },
    { term: 'right-hand rule', definition: 'A way of finding the direction of a cross product by curling the fingers of the right hand from the first vector to the second; the thumb gives the answer.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Two arrows in a plane with a third arrow rising perpendicular to both.',
      generation_prompt: heroPrompt(
        'Two glowing arrows lying flat in a dark grid plane, with a third bright arrow rising straight up out of the plane, perpendicular to both, suggesting a right-handed screw.'
      ),
    }),
    b('text', 1, {
      markdown:
        'The second way to multiply vectors gives back a **vector**, not a number:\n\n' +
        '$ \\vec{A}\\times\\vec{B} = AB\\sin\\theta\\;\\hat{n} $\n\n' +
        'Read "A cross B". It is also called the **vector product**.\n\n' +
        'Two things changed from the dot product, and both matter:\n\n' +
        '1. **$ \\sin\\theta $ instead of $ \\cos\\theta $.** So this one is largest when the vectors are *perpendicular*, and zero when they are *parallel* — the exact opposite of the dot product.\n' +
        '2. **A direction, $ \\hat{n} $.** It points perpendicular to **both** vectors — straight out of the plane they lie in.',
    }),
    b('heading', 2, {
      text: 'The right-hand rule',
      level: 2,
      objective: 'Determine the direction of a cross product.',
    }),
    b('text', 3, {
      markdown:
        'A line perpendicular to a plane points two ways — up and down. Which one is it?\n\n' +
        '**Point the fingers of your right hand along $ \\vec{A} $, then curl them towards $ \\vec{B} $. Your thumb points along $ \\vec{A}\\times\\vec{B} $.**\n\n' +
        'Use your right hand. Every time. Using the left one reverses the answer, and it is a genuinely common way to lose a mark.\n\n' +
        'An immediate consequence: curling from $ \\vec{B} $ to $ \\vec{A} $ instead points your thumb the other way. So:\n\n' +
        '$ \\vec{A}\\times\\vec{B} = -\\left(\\vec{B}\\times\\vec{A}\\right) $\n\n' +
        '**Order matters in a cross product.** It does not in a dot product. That difference is tested often.',
    }),
    b('vector_board', 4, {
      title: 'Dot and cross together',
      archetype: 'dot-cross',
      units: 'N',
      vectors: [v('A', 6, 0, { color: 'indigo', draggable: true }), v('B', 5, 90, { color: 'amber', draggable: true })],
      show: { angleArc: true, readout: true, formula: true },
      caption: 'Watch both products at once as you drag. Where one peaks, the other is zero — they are complementary.',
      predict: {
        prompt: 'At what angle between the two vectors is $ |\\vec{A}\\times\\vec{B}| $ largest?',
        options: ['$ 0° $', '$ 45° $', '$ 90° $', '$ 180° $'],
        answer_index: 2,
        reveal: 'At 90°, where $ \\sin\\theta = 1 $. Compare with the dot product, which is zero at exactly that angle. One measures how much the vectors agree; the other measures how much they differ.',
      },
    }),
    b('text', 5, {
      markdown:
        'The magnitude $ AB\\sin\\theta $ has a neat geometric meaning: it is the **area of the parallelogram** with $ \\vec{A} $ and $ \\vec{B} $ as its sides. That is worth knowing, because area questions sometimes arrive disguised as vector questions.\n\n' +
        'In component form, the cross product is computed as a determinant:\n\n' +
        '$ \\vec{A}\\times\\vec{B} = \\left(A_yB_z - A_zB_y\\right)\\hat{i} - \\left(A_xB_z - A_zB_x\\right)\\hat{j} + \\left(A_xB_y - A_yB_x\\right)\\hat{k} $\n\n' +
        'For the flat two-dimensional problems of Class 11, only the last term survives, which keeps things manageable:\n\n' +
        '$ \\vec{A}\\times\\vec{B} = \\left(A_xB_y - A_yB_x\\right)\\hat{k} $',
    }),
    b('table', 6, {
      caption: 'Dot versus cross, side by side. Most confusion between them disappears once this table is memorised.',
      headers: ['', 'Dot product $ \\vec{A}\\cdot\\vec{B} $', 'Cross product $ \\vec{A}\\times\\vec{B} $'],
      rows: [
        ['Result is', 'A scalar (a number)', 'A vector'],
        ['Formula', '$ AB\\cos\\theta $', '$ AB\\sin\\theta\\,\\hat{n} $'],
        ['Maximum when', 'Parallel ($ \\theta = 0° $)', 'Perpendicular ($ \\theta = 90° $)'],
        ['Zero when', 'Perpendicular', 'Parallel'],
        ['Order matters?', 'No — $ \\vec{A}\\cdot\\vec{B} = \\vec{B}\\cdot\\vec{A} $', 'Yes — the sign flips'],
        ['Physics examples', 'Work, power', 'Torque, angular momentum, magnetic force'],
      ],
    }),
    b('callout', 7, {
      variant: 'exam_tip',
      title: 'Where the cross product shows up',
      markdown:
        'Three big formulas later in the course are cross products, and each one behaves the way it does because of the $ \\sin\\theta $:\n\n' +
        '$ \\vec{\\tau} = \\vec{r}\\times\\vec{F} $ — **torque**. A spanner gives most turning effect when you push perpendicular to it, and none at all if you push along it.\n\n' +
        '$ \\vec{L} = \\vec{r}\\times\\vec{p} $ — **angular momentum**.\n\n' +
        '$ \\vec{F} = q\\left(\\vec{v}\\times\\vec{B}\\right) $ — the **magnetic force**, which acts sideways to both the velocity and the field. That is why a charged particle moves in a circle in a magnetic field.',
    }),
    b('worked_example', 8, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find $ \\vec{A}\\times\\vec{B} $ for $ \\vec{A} = 3\\hat{i} $ and $ \\vec{B} = 4\\hat{j} $, and state its direction.',
      solution:
        'Both vectors lie in the $ xy $ plane, so use the two-dimensional form.\n\n' +
        '$ A_x = 3,\\; A_y = 0,\\; B_x = 0,\\; B_y = 4 $\n\n' +
        '$ \\vec{A}\\times\\vec{B} = \\left(A_xB_y - A_yB_x\\right)\\hat{k} = \\left(3 \\times 4 - 0 \\times 0\\right)\\hat{k} = 12\\hat{k} $\n\n' +
        'Check it with the other formula: the vectors are perpendicular, so $ \\sin 90° = 1 $ and the magnitude is $ 3 \\times 4 \\times 1 = 12 $. It agrees.\n\n' +
        'The direction is $ +\\hat{k} $, which is **out of the page**. Confirm with your right hand: fingers along $ +x $, curl towards $ +y $, thumb points towards you.',
    }),
    b('worked_example', 9, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A force of 20 N is applied at the end of a spanner 0.25 m long, at 30° to the spanner. Find the torque.',
      solution:
        'Torque is a cross product, so its magnitude uses $ \\sin\\theta $.\n\n' +
        '$ |\\vec{\\tau}| = rF\\sin\\theta = 0.25 \\times 20 \\times \\sin 30° $\n\n' +
        '$ = 0.25 \\times 20 \\times 0.5 = 2.5\\ \\mathrm{N\\,m} $\n\n' +
        'Now compare with pushing perpendicular to the spanner, where $ \\sin 90° = 1 $:\n\n' +
        '$ |\\vec{\\tau}| = 0.25 \\times 20 \\times 1 = 5\\ \\mathrm{N\\,m} $ — **twice as much for the same force.**\n\n' +
        'That is not a mathematical curiosity; it is why you instinctively push a spanner at right angles. The $ \\sin\\theta $ in the cross product is describing something you already knew with your hands.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\vec{A}\\times\\vec{B} = 0 $ for two non-zero vectors means they are:',
          ['Perpendicular', 'Parallel or antiparallel', 'Equal in magnitude', 'Both unit vectors'],
          1,
          '$ \\sin\\theta = 0 $ at $ 0° $ and $ 180° $. The cross product vanishes when the vectors lie along the same line — the opposite condition to the dot product.',
          2),
        q('Which statement is true?',
          ['$ \\vec{A}\\times\\vec{B} = \\vec{B}\\times\\vec{A} $', '$ \\vec{A}\\cdot\\vec{B} = -\\vec{B}\\cdot\\vec{A} $', '$ \\vec{A}\\times\\vec{B} $ is a scalar', '$ \\vec{A}\\times\\vec{B} = -\\vec{B}\\times\\vec{A} $'],
          3,
          'Reversing the order of a cross product reverses its direction. The dot product, by contrast, is completely unaffected by order.',
          2),
        q('The magnitude of $ \\vec{A}\\times\\vec{B} $ for $ A = 5 $, $ B = 4 $ at $ 30° $ is:',
          ['$ 10 $', '$ 20 $', '$ 17.3 $', '$ 5 $'],
          0,
          '$ AB\\sin\\theta = 5 \\times 4 \\times 0.5 = 10 $. Using cos by mistake would give 17.3.',
          2),
      ],
    }),
    b('text', 11, {
      markdown: 'That is the whole of vectors. One practice arena to go, and Chapter 0 is finished.',
    }),
  ],
};

// ═══ 34 ── Unit C Practice Arena ═════════════════════════════════════════════
const page34 = {
  page_number: 34,
  slug: 'unit-c-practice-arena',
  title: 'Unit C — Practice Arena',
  subtitle: 'Vectors, end to end',
  page_type: 'practice',
  blocks: [
    b('text', 0, {
      markdown:
        'The last set. Sections A to C drill one idea at a time; Section D mixes everything in this chapter — algebra, calculus and vectors together, the way a real exam does it.\n\n' +
        'A habit worth building here: before calculating anything, check whether the answer is even possible. Resultants must lie between $ |A-B| $ and $ A+B $; magnitudes are never negative; a dot product is never a vector. Half the wrong options can be eliminated before you pick up a pen.',
    }),
    b('practice_bank', 1, {
      title: 'Unit C drill',
      intro: 'Work in order. Sketch a diagram for every single one — even when you think you do not need to.',
      sections: [
        {
          id: 'uc-basics',
          title: 'A · Vectors, angles and components',
          blurb: 'Unit vectors, resolution, magnitude.',
          items: [
            pmcq('uc-b-01',
              'The magnitude of $ \\vec{A} = 12\\hat{i} - 5\\hat{j} $ is:',
              ['$ 7 $', '$ 13 $', '$ 17 $', '$ 119 $'],
              1,
              '$ \\sqrt{144 + 25} = \\sqrt{169} = 13 $. The minus sign disappears on squaring.'),
            pmcq('uc-b-02',
              'A 25 N force acts at 53° above the horizontal. Its vertical component is:',
              ['$ 20 $ N', '$ 15 $ N', '$ 12.5 $ N', '$ 25 $ N'],
              0,
              '$ F_y = 25\\sin 53° = 25 \\times 0.8 = 20 $ N. Using $ \\sin 53° = 0.6 $ by mistake gives 15.'),
            pmcq('uc-b-03',
              'Two vectors of magnitude 9 and 5 are added. Which resultant is impossible?',
              ['$ 4 $', '$ 14 $', '$ 3 $', '$ 9 $'],
              2,
              'The resultant must lie between $ |9-5| = 4 $ and $ 9+5 = 14 $. So 3 is out of range; the other three are all achievable.'),
            pnum('uc-b-04',
              'Find the unit vector along $ \\vec{A} = 2\\hat{i} - \\hat{j} + 2\\hat{k} $.',
              '$ \\dfrac{2}{3}\\hat{i} - \\dfrac{1}{3}\\hat{j} + \\dfrac{2}{3}\\hat{k} $',
              'First the magnitude:\n\n' +
              '$ |\\vec{A}| = \\sqrt{2^2 + (-1)^2 + 2^2} = \\sqrt{4 + 1 + 4} = \\sqrt{9} = 3 $\n\n' +
              'Then divide each component by 3:\n\n' +
              '$ \\hat{A} = \\dfrac{2}{3}\\hat{i} - \\dfrac{1}{3}\\hat{j} + \\dfrac{2}{3}\\hat{k} $\n\n' +
              'Check: $ \\sqrt{\\dfrac{4}{9} + \\dfrac{1}{9} + \\dfrac{4}{9}} = 1 $. Correct.'),
            pnum('uc-b-05',
              'A boat heads due north at 4 m/s across a river that flows due east at 3 m/s. Find the boat\'s resultant velocity — magnitude and direction.',
              '$ 5 $ m/s, at 37° east of north',
              'The two velocities are perpendicular, so:\n\n' +
              '$ |\\vec{v}| = \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5\\ \\mathrm{m/s} $\n\n' +
              'For the direction, measured from north:\n\n' +
              '$ \\tan\\theta = \\dfrac{3}{4} = 0.75 \\Rightarrow \\theta = 37° $\n\n' +
              'So the boat travels at 5 m/s, 37° east of north. It does not go where it is pointing — which is the whole point of river-crossing problems.'),
          ],
        },
        {
          id: 'uc-addition',
          title: 'B · Addition, subtraction and equilibrium',
          blurb: 'Triangle, parallelogram, polygon and the analytical method.',
          items: [
            pmcq('uc-a-01',
              'Two forces of 6 N and 8 N act at 90°. Their resultant is:',
              ['$ 14 $ N', '$ 10 $ N', '$ 2 $ N', '$ 48 $ N'],
              1,
              'At 90° the formula reduces to Pythagoras: $ \\sqrt{36 + 64} = 10 $ N.'),
            pmcq('uc-a-02',
              'Two equal forces have a resultant equal to either one of them. The angle between them is:',
              ['$ 120° $', '$ 60° $', '$ 90° $', '$ 180° $'],
              0,
              'With $ A = B = F $ and $ R = F $, the formula needs $ \\cos\\theta = -\\tfrac{1}{2} $, giving $ \\theta = 120° $.'),
            pmcq('uc-a-03',
              'For $ \\vec{A} = 5\\hat{i} + 2\\hat{j} $ and $ \\vec{B} = 2\\hat{i} - 3\\hat{j} $, $ \\vec{A} - \\vec{B} $ is:',
              ['$ 7\\hat{i} - \\hat{j} $', '$ 3\\hat{i} - \\hat{j} $', '$ 7\\hat{i} + 5\\hat{j} $', '$ 3\\hat{i} + 5\\hat{j} $'],
              3,
              'Subtract component by component: $ (5-2)\\hat{i} = 3\\hat{i} $ and $ (2-(-3))\\hat{j} = 5\\hat{j} $. The double minus is where marks are lost.'),
            pnum('uc-a-04',
              'Two forces of 7 N and 5 N act at 60° to each other. Find the magnitude of the resultant.',
              '$ \\sqrt{109} \\approx 10.4 $ N',
              '$ R = \\sqrt{A^2 + B^2 + 2AB\\cos\\theta} $\n\n' +
              '$ = \\sqrt{49 + 25 + 2(7)(5)(0.5)} = \\sqrt{49 + 25 + 35} = \\sqrt{109} \\approx 10.4\\ \\mathrm{N} $\n\n' +
              'Sense check: it must sit between 2 and 12, and closer to the top because 60° is a small angle. It does.'),
            pnum('uc-a-05',
              'Three forces act on a body in equilibrium. Two of them are $ \\vec{F_1} = 4\\hat{i} + 3\\hat{j} $ N and $ \\vec{F_2} = -2\\hat{i} + 5\\hat{j} $ N. Find the third.',
              '$ \\vec{F_3} = -2\\hat{i} - 8\\hat{j} $ N',
              'For equilibrium the three must sum to zero:\n\n' +
              '$ \\vec{F_3} = -\\left(\\vec{F_1} + \\vec{F_2}\\right) $\n\n' +
              '$ \\vec{F_1} + \\vec{F_2} = (4-2)\\hat{i} + (3+5)\\hat{j} = 2\\hat{i} + 8\\hat{j} $\n\n' +
              '$ \\vec{F_3} = -2\\hat{i} - 8\\hat{j}\\ \\mathrm{N} $\n\n' +
              'Its magnitude is $ \\sqrt{4 + 64} = \\sqrt{68} \\approx 8.2 $ N.'),
          ],
        },
        {
          id: 'uc-products',
          title: 'C · Dot and cross products',
          blurb: 'Which one, and what does the answer mean?',
          items: [
            pmcq('uc-p-01',
              'For $ \\vec{A} = 3\\hat{i} + 4\\hat{j} $ and $ \\vec{B} = 4\\hat{i} - 3\\hat{j} $, $ \\vec{A}\\cdot\\vec{B} $ is:',
              ['$ 24 $', '$ 0 $', '$ 12 $', '$ 25 $'],
              1,
              '$ (3)(4) + (4)(-3) = 12 - 12 = 0 $. A zero dot product means these two vectors are perpendicular.'),
            pmcq('uc-p-02',
              'The magnitude of $ \\vec{A}\\times\\vec{B} $ equals the area of:',
              ['The triangle formed by A and B', 'A circle of radius $ AB $', 'The parallelogram with A and B as sides', 'A square of side $ AB $'],
              2,
              '$ AB\\sin\\theta $ is exactly base × perpendicular height for that parallelogram. The triangle would be half of it.'),
            pmcq('uc-p-03',
              'Which quantity is a cross product?',
              ['Work', 'Power', 'Kinetic energy', 'Torque'],
              3,
              '$ \\vec{\\tau} = \\vec{r}\\times\\vec{F} $. Work and power are dot products, and kinetic energy is not a product of two vectors at all.'),
            pnum('uc-p-04',
              'Find the angle between $ \\vec{A} = \\hat{i} + \\hat{j} $ and $ \\vec{B} = \\hat{i} $.',
              '$ 45° $',
              'Use $ \\cos\\theta = \\dfrac{\\vec{A}\\cdot\\vec{B}}{AB} $.\n\n' +
              '$ \\vec{A}\\cdot\\vec{B} = (1)(1) + (1)(0) = 1 $\n\n' +
              '$ A = \\sqrt{2} $ and $ B = 1 $\n\n' +
              '$ \\cos\\theta = \\dfrac{1}{\\sqrt{2}} \\Rightarrow \\theta = 45° $\n\n' +
              'Which is obvious from a sketch — $ \\hat{i} + \\hat{j} $ points along the diagonal.'),
            pnum('uc-p-05',
              'A force $ \\vec{F} = 2\\hat{i} + 3\\hat{j} $ N acts at a point with position vector $ \\vec{r} = \\hat{i} - \\hat{j} $ m. Find the torque about the origin.',
              '$ 5\\hat{k} $ N m',
              'Both vectors are in the $ xy $ plane, so use the two-dimensional form:\n\n' +
              '$ \\vec{\\tau} = \\vec{r}\\times\\vec{F} = \\left(r_xF_y - r_yF_x\\right)\\hat{k} $\n\n' +
              '$ = \\left((1)(3) - (-1)(2)\\right)\\hat{k} = (3 + 2)\\hat{k} = 5\\hat{k}\\ \\mathrm{N\\,m} $\n\n' +
              'Positive $ \\hat{k} $ means the torque points out of the page — an anticlockwise turning effect.'),
          ],
        },
        {
          id: 'uc-mixed',
          title: 'D · Whole-chapter mix',
          blurb: 'Algebra, calculus and vectors together. Nothing tells you which unit a question came from.',
          items: [
            pmcq('uc-m-01',
              'A particle\'s position is $ \\vec{r} = 3t^2\\hat{i} + 4t\\hat{j} $. Its velocity at $ t = 1 $ s has magnitude:',
              ['$ 7 $', '$ 10 $', '$ 5 $', '$ \\sqrt{52} $'],
              3,
              'Differentiate each component: $ \\vec{v} = 6t\\hat{i} + 4\\hat{j} $. At $ t = 1 $, $ \\vec{v} = 6\\hat{i} + 4\\hat{j} $, so $ |\\vec{v}| = \\sqrt{36 + 16} = \\sqrt{52} \\approx 7.2 $.'),
            pmcq('uc-m-02',
              'A projectile is launched at 50 m/s at 37°. Its horizontal velocity component is:',
              ['$ 40 $ m/s', '$ 30 $ m/s', '$ 50 $ m/s', '$ 25 $ m/s'],
              0,
              '$ v_x = 50\\cos 37° = 50 \\times 0.8 = 40 $ m/s. The vertical component would be $ 50 \\times 0.6 = 30 $ m/s.'),
            pnum('uc-m-03',
              'A particle moves with velocity $ \\vec{v} = 4\\hat{i} + 3t\\hat{j} $ m/s. Find its acceleration, and the magnitude of its velocity at $ t = 4 $ s.',
              '$ \\vec{a} = 3\\hat{j} $ m/s²; $ |\\vec{v}| = \\sqrt{160} \\approx 12.6 $ m/s',
              'Acceleration is the time derivative of velocity, component by component:\n\n' +
              '$ \\vec{a} = \\dfrac{d\\vec{v}}{dt} = 0\\hat{i} + 3\\hat{j} = 3\\hat{j}\\ \\mathrm{m/s^2} $\n\n' +
              'At $ t = 4 $: $ \\vec{v} = 4\\hat{i} + 12\\hat{j} $\n\n' +
              '$ |\\vec{v}| = \\sqrt{16 + 144} = \\sqrt{160} \\approx 12.6\\ \\mathrm{m/s} $\n\n' +
              'Note the acceleration is purely in the $ y $ direction while the velocity has both components — exactly the situation in projectile motion.'),
            pnum('uc-m-04',
              'The range of a projectile is $ R = \\dfrac{u^2\\sin 2\\theta}{g} $. A ball is thrown at 20 m/s at 30°. Find its range, and find the other launch angle that would give exactly the same range. Take $ g = 10 $ m/s².',
              '$ R \\approx 34.6 $ m; the other angle is 60°',
              '$ R = \\dfrac{20^2 \\times \\sin 60°}{10} = \\dfrac{400 \\times 0.866}{10} = 34.6\\ \\mathrm{m} $\n\n' +
              'For the other angle, the ranges match when $ \\sin 2\\theta $ matches. Since $ \\sin 60° = \\sin 120° $:\n\n' +
              '$ 2\\theta = 120° \\Rightarrow \\theta = 60° $\n\n' +
              'In general the two angles add to 90°, which is the compound-angle result from Unit A doing physics work.'),
            pnum('uc-m-05',
              'A force $ \\vec{F} = 6\\hat{i} - 8\\hat{j} $ N acts on a body that moves with velocity $ \\vec{v} = 2\\hat{i} + \\hat{j} $ m/s. Find the instantaneous power, and say whether the force is speeding the body up or slowing it down.',
              '$ P = 4 $ W; speeding it up',
              'Power is a dot product:\n\n' +
              '$ P = \\vec{F}\\cdot\\vec{v} = (6)(2) + (-8)(1) = 12 - 8 = 4\\ \\mathrm{W} $\n\n' +
              'The result is **positive**, so the force is doing positive work — energy is going into the body and it is speeding up.\n\n' +
              'Had it come out negative, the force would have been opposing the motion, like friction.'),
          ],
        },
      ],
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'End of Chapter 0',
      markdown:
        'That is the toolbox complete: algebra and graphs, differentiation and integration, and vectors.\n\n' +
        'None of it was physics. All of it is what physics is about to be written in. From the next chapter onward these tools stop being the subject and start being the language — and you will not be given time to stop and look them up.\n\n' +
        'If any page in this chapter still feels slow, go back to it now. It is far cheaper to fix here than in the middle of a mechanics problem.',
    }),
  ],
};

const PAGES = [page25, page27, page28, page29, page30, page32, page33, page34];
module.exports = { PAGES };

if (require.main === module) {
  withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, PAGES);
  }).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
