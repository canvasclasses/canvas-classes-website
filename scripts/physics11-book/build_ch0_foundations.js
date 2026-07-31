'use strict';
/**
 * Chapter 0, pages 0–7 — the maths toolbox that must come BEFORE vectors.
 *
 *   0  Chapter opener
 *   1  Why Physics Leans on Maths
 *   2  Powers of Ten & Scientific Notation
 *   3  Rearranging Formulas & Proportionality
 *   4  Trigonometry for Physics
 *   5  The Small-Angle Shortcut
 *   6  Scalars and Vectors
 *   7  Anatomy of a Vector
 *
 * Pages 8–11 (triangle law, parallelogram law, subtraction, resolution) follow.
 *
 * Voice: NCERT register, simplified further — short sentences, no ornamental
 * vocabulary, written for a student who studied in Hindi medium until Class 10.
 *
 * Run:  node scripts/physics11-book/build_ch0_foundations.js
 */
const { b, q, v, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch0');

const heroPrompt = (scene) =>
  `Wide cinematic illustration on a very dark near-black background. ${scene} Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.`;

// ═══ 0 ── Chapter opener ═════════════════════════════════════════════════════
const page0 = {
  page_number: 0,
  slug: 'mathematics-in-physics-opener',
  title: 'Mathematics in Physics',
  subtitle: 'The toolbox you pick up before the workshop',
  page_type: 'chapter_opener',
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A neatly laid out set of drawing instruments — ruler, protractor, compass — glowing on a dark workbench, with faint physics diagrams sketched around them.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'A neat row of drawing instruments — ruler, protractor, compass, set square — glowing softly on a dark workbench. Faint sketched physics diagrams (an arrow triangle, a slope on a graph, a right triangle) float around them like blueprints.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Physics is not hard because the ideas are hard. It gets hard when the **maths gets in the way** of the idea.\n\n' +
        'A student who understands what acceleration means can still lose marks because they could not rearrange a formula, or did not know what $ \\sin 30° $ was, or could not read a slope off a graph.\n\n' +
        'So before we start physics, we spend one short chapter collecting the tools. Nothing here is new mathematics — most of it you met in Class 9 and 10. What is new is **why a physicist needs it**, and that is what each page will show you.',
    }),
    b('text', 2, {
      markdown:
        '**What is in this chapter**\n\n' +
        '- Writing very big and very small numbers without counting zeros\n' +
        '- Rearranging a formula for the quantity you actually want\n' +
        '- The handful of trigonometry facts physics keeps reusing\n' +
        '- Reading slopes and areas off a graph\n' +
        '- And then the big one — **vectors**, which take up half this chapter, because almost every chapter after this one is built on them',
    }),
    b('callout', 3, {
      variant: 'note',
      title: 'How to use this chapter',
      markdown:
        'Do not rush it. A week spent here saves a month later.\n\n' +
        'Every board in this chapter is meant to be touched. Press the buttons, drag the arrows, get things wrong. That is the point of them.',
    }),
  ],
};

// ═══ 1 ── Why Physics Leans on Maths ═════════════════════════════════════════
const page1 = {
  page_number: 1,
  slug: 'why-physics-leans-on-maths',
  title: 'Why Physics Leans on Maths',
  subtitle: 'From "it falls fast" to "it falls at 9.8 m/s²"',
  glossary: [
    { term: 'physical quantity', definition: 'Anything in nature that can be measured and given a number with a unit, like length, time or force.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A falling apple with a glowing measurement scale beside it turning the fall into numbers.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'An apple falling through the air on the left; on the right the same fall is shown as a glowing ladder of measured positions with a ruler and a stopwatch, turning the motion into numbers.'
      ),
    }),
    b('curiosity_prompt', 1, {
      prompt:
        'Two students watch a stone fall. One says "it falls fast". The other says "it speeds up by about 10 metres per second, every second". Both are describing the same thing. Which statement lets you predict where the stone will be in 3 seconds?',
      hint: 'Which one contains a number you can actually work with?',
      reveal:
        'Only the second. "Fast" is an opinion — it cannot be checked, and two people can disagree about it forever. A number can be checked by anybody, anywhere, and it lets you predict. That is the whole reason physics uses maths.',
    }),
    b('text', 2, {
      markdown:
        'Science begins when a description becomes **measurable**.\n\n' +
        'Anything we can measure and give a number to is called a **physical quantity** — length, time, mass, speed, force. Once we have numbers, we can look for patterns between them. Once we have a pattern, we can write it as a formula. And once we have a formula, we can predict.\n\n' +
        'That is the chain physics runs on:\n\n' +
        'measure → find a pattern → write a formula → predict.\n\n' +
        'Maths is simply the language each of those arrows is written in.',
    }),
    b('heading', 3, {
      text: 'The four tools you will keep reaching for',
      level: 2,
      objective: 'Know what is coming in this chapter and why each piece matters.',
    }),
    b('table', 4, {
      caption: 'Every tool in this chapter, and the first place physics uses it.',
      headers: ['Tool', 'What it does for you', 'First used in'],
      rows: [
        ['Powers of ten', 'Handles the size of an atom and the size of a star with the same short notation', 'Units and Measurement'],
        ['Rearranging formulas', 'Gets the quantity you want onto the left-hand side', 'Every single chapter'],
        ['Trigonometry', 'Splits a slanting quantity into two straight ones', 'Motion in a Plane, Laws of Motion'],
        ['Graphs — slope and area', 'Reads speed and distance straight off a picture', 'Motion in a Straight Line'],
        ['Vectors', 'Handles quantities that carry a direction', 'Motion in a Plane onwards'],
      ],
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'The honest reason students find Class 11 hard',
      markdown:
        'It is rarely the physics. It is that Class 11 assumes you can do Class 10 maths **quickly and without thinking about it**.\n\n' +
        'In an exam you do not have time to stop and work out how to rearrange $ v^2 = u^2 + 2as $ for $ a $. That step has to be automatic, so that your thinking is free for the physics.',
    }),
    b('text', 6, {
      markdown: 'Next: the first tool — writing numbers that are far too big or far too small to write out in full.',
    }),
  ],
};

// ═══ 2 ── Powers of Ten ══════════════════════════════════════════════════════
const page2 = {
  page_number: 2,
  slug: 'powers-of-ten',
  title: 'Powers of Ten',
  subtitle: 'One notation for atoms and for galaxies',
  glossary: [
    { term: 'scientific notation', definition: 'Writing a number as a value between 1 and 10 multiplied by a power of ten, like 3.0 × 10⁸.' },
    { term: 'order of magnitude', definition: 'The nearest power of ten to a quantity — a rough answer to "how big, roughly?"' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A zoom sequence from an atom to a galaxy, with the scale marked in powers of ten.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'A left-to-right zoom sequence: a single atom, a grain of sand, a human figure, the Earth, and a spiral galaxy, evenly spaced along a glowing horizontal scale line.'
      ),
    }),
    b('callout', 1, {
      variant: 'fun_fact',
      title: 'A number with 27 zeros',
      markdown:
        'The mass of the Earth is about 5,970,000,000,000,000,000,000,000 kg.\n\n' +
        'Nobody writes that. Nobody can even count the zeros reliably. We write $ 5.97 \\times 10^{24} $ kg — and it says exactly the same thing in nine characters.',
    }),
    b('text', 2, {
      markdown:
        'In physics we deal with sizes that are absurdly far apart. An atom is about $ 10^{-10} $ m across. A galaxy is about $ 10^{21} $ m across. Ordinary decimal writing simply cannot cope.\n\n' +
        'So we write every number in the same shape:\n\n' +
        '$ a \\times 10^{b} $\n\n' +
        'where $ a $ is between 1 and 10, and $ b $ is a whole number. This is called **scientific notation**.\n\n' +
        'The power $ b $ tells you how many places the decimal point has moved. Moving it left makes $ b $ **positive**; moving it right makes $ b $ **negative**.',
    }),
    b('heading', 3, {
      text: 'Multiplying and dividing become adding and subtracting',
      level: 2,
      objective: 'Multiply and divide numbers in scientific notation without a calculator.',
    }),
    b('text', 4, {
      markdown:
        'This is the part that saves you time in an exam. When two powers of ten multiply, you **add** the powers. When they divide, you **subtract**.\n\n' +
        '$ 10^{m} \\times 10^{n} = 10^{m+n} \\qquad \\dfrac{10^{m}}{10^{n}} = 10^{m-n} $\n\n' +
        'So handle the ordinary numbers and the powers separately, then put them back together.',
    }),
    b('worked_example', 5, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Work out $ (3 \\times 10^{8}) \\times (4 \\times 10^{-5}) $, and give the answer in scientific notation.',
      solution:
        'Deal with the plain numbers first, then the powers.\n\n' +
        'Plain numbers: $ 3 \\times 4 = 12 $\n\n' +
        'Powers: $ 10^{8} \\times 10^{-5} = 10^{8 + (-5)} = 10^{3} $\n\n' +
        'So we have $ 12 \\times 10^{3} $. But scientific notation needs the first part between 1 and 10, and 12 is not. Rewrite 12 as $ 1.2 \\times 10^{1} $:\n\n' +
        '$ 1.2 \\times 10^{1} \\times 10^{3} = 1.2 \\times 10^{4} $\n\n' +
        'Watch-out: forgetting that last tidy-up step is the most common slip here. Always check that the front number sits between 1 and 10.',
    }),
    b('worked_example', 6, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Light travels at $ 3 \\times 10^{8} $ m/s. How far does it travel in $ 2 \\times 10^{-9} $ s (two nanoseconds)?',
      solution:
        'Distance = speed × time.\n\n' +
        '$ d = (3 \\times 10^{8}) \\times (2 \\times 10^{-9}) $\n\n' +
        'Plain numbers: $ 3 \\times 2 = 6 $. Powers: $ 10^{8-9} = 10^{-1} $.\n\n' +
        '$ d = 6 \\times 10^{-1} = 0.6\\ \\mathrm{m} $\n\n' +
        'So in the time it takes light to cross this page, you could not even blink. Useful sense of scale to carry into optics later.',
    }),
    b('callout', 7, {
      variant: 'remember',
      title: 'Order of magnitude',
      markdown:
        'Sometimes you do not need the exact answer — you need to know **roughly how big**. That is the order of magnitude: just the power of ten.\n\n' +
        'The Earth is about $ 10^{7} $ m across. A hydrogen atom is about $ 10^{-10} $ m across. So the Earth is about **17 orders of magnitude** bigger — that is, $ 10^{17} $ times.\n\n' +
        'Examiners like this because it tests whether you have a feel for size, not whether you can push buttons on a calculator.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('Write 0.00045 in scientific notation.',
          ['$ 45 \\times 10^{-5} $', '$ 4.5 \\times 10^{-4} $', '$ 4.5 \\times 10^{4} $', '$ 0.45 \\times 10^{-3} $'],
          1,
          'Move the decimal point 4 places to the right to get 4.5, so the power is −4. The other options are either not in the 1-to-10 form, or have the sign of the power wrong.',
          1),
        q('$ \\dfrac{8 \\times 10^{6}}{2 \\times 10^{-3}} $ equals:',
          ['$ 4 \\times 10^{3} $', '$ 4 \\times 10^{-9} $', '$ 16 \\times 10^{3} $', '$ 4 \\times 10^{9} $'],
          3,
          '8 ÷ 2 = 4, and the powers subtract: 6 − (−3) = 9. Subtracting a negative power is where most marks are lost here.',
          2),
        q('A raindrop has a diameter of about 2 mm. What is its order of magnitude in metres?',
          ['$ 10^{-3} $', '$ 10^{-2} $', '$ 10^{-6} $', '$ 10^{3} $'],
          0,
          '2 mm = 0.002 m = 2 × 10⁻³ m. Since 2 is closer to 1 than to 10, we round it down to 1, giving an order of magnitude of 10⁻³.',
          2),
      ],
    }),
    b('text', 9, {
      markdown: 'Next: getting the quantity you actually want onto the left-hand side of a formula.',
    }),
  ],
};

// ═══ 3 ── Rearranging Formulas ═══════════════════════════════════════════════
const page3 = {
  page_number: 3,
  slug: 'rearranging-formulas',
  title: 'Rearranging Formulas',
  subtitle: 'Getting the letter you want on its own',
  glossary: [
    { term: 'directly proportional', definition: 'When one quantity doubles, the other doubles too. Written y ∝ x.' },
    { term: 'inversely proportional', definition: 'When one quantity doubles, the other halves. Written y ∝ 1/x.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A balance scale with an equation on each pan, staying level as the same operation is applied to both sides.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'A precision balance scale, perfectly level, with a glowing algebraic expression resting on each pan; identical glowing operation symbols descend onto both pans at once, keeping the beam level.'
      ),
    }),
    b('text', 1, {
      markdown:
        'A formula is a balance. Whatever you do to one side, you must do to the other, and it stays true.\n\n' +
        'That single rule is all rearranging is. There is no trick to memorise. But it has to become **fast** — in an exam you cannot afford to stop and think about it.',
    }),
    b('heading', 2, {
      text: 'The order to undo things in',
      level: 2,
      objective: 'Make any letter the subject of a formula, in the right order.',
    }),
    b('text', 3, {
      markdown:
        'To free a letter, undo everything that is being done to it — in the **reverse** of the usual order of operations.\n\n' +
        'Undo addition and subtraction first. Then multiplication and division. Then powers and roots last.\n\n' +
        'Think of it like taking off shoes and socks: whatever went on last comes off first.',
    }),
    b('worked_example', 4, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Make $ a $ the subject of $ v^2 = u^2 + 2as $.',
      solution:
        'Look at what is happening to $ a $. It is multiplied by 2, multiplied by $ s $, and then $ u^2 $ is added on.\n\n' +
        'So undo the addition first. Subtract $ u^2 $ from both sides:\n\n' +
        '$ v^2 - u^2 = 2as $\n\n' +
        'Now undo the multiplication. Divide both sides by $ 2s $:\n\n' +
        '$ a = \\dfrac{v^2 - u^2}{2s} $\n\n' +
        'Watch-out: a very common error is to take the square root of $ v^2 - u^2 $ and write $ v - u $. Those are **not** the same. $ \\sqrt{v^2 - u^2} \\ne v - u $.',
    }),
    b('worked_example', 5, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'The time period of a simple pendulum is $ T = 2\\pi\\sqrt{\\dfrac{L}{g}} $. Make $ L $ the subject.',
      solution:
        '$ L $ is inside a square root, which is inside a division, which is multiplied by $ 2\\pi $. Peel it back one layer at a time.\n\n' +
        'Divide both sides by $ 2\\pi $:\n\n' +
        '$ \\dfrac{T}{2\\pi} = \\sqrt{\\dfrac{L}{g}} $\n\n' +
        'Square both sides to kill the root:\n\n' +
        '$ \\dfrac{T^2}{4\\pi^2} = \\dfrac{L}{g} $\n\n' +
        'Multiply both sides by $ g $:\n\n' +
        '$ L = \\dfrac{gT^2}{4\\pi^2} $\n\n' +
        'Shortcut: when you square a fraction, **both** the top and the bottom get squared. Writing $ T^2 / 2\\pi $ instead of $ T^2 / 4\\pi^2 $ is the classic slip.',
    }),
    b('heading', 6, {
      text: 'Proportionality — the exam favourite',
      level: 2,
      objective: 'Answer "if this doubles, what happens to that?" without any numbers.',
    }),
    b('text', 7, {
      markdown:
        'A huge number of questions never give you numbers at all. They ask things like: *if the radius is doubled, what happens to the force?*\n\n' +
        'For that you only need to look at where the letter sits and what power it carries.\n\n' +
        '- On the **top**, power 1: double it, the answer doubles.\n' +
        '- On the **top**, power 2: double it, the answer goes up **4 times**.\n' +
        '- On the **bottom**, power 1: double it, the answer **halves**.\n' +
        '- On the **bottom**, power 2: double it, the answer becomes **one quarter**.\n\n' +
        'Everything else in the formula is just a constant and can be ignored.',
    }),
    b('worked_example', 8, {
      label: 'Example 3',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem:
        'Newton\'s law of gravitation is $ F = \\dfrac{Gm_1m_2}{r^2} $. If the distance $ r $ between two bodies is made three times larger, what happens to the force?',
      solution:
        'Only $ r $ changes, so ignore $ G $, $ m_1 $ and $ m_2 $ — they are fixed.\n\n' +
        '$ r $ sits on the **bottom**, with power **2**. So the force is inversely proportional to $ r^2 $:\n\n' +
        '$ F \\propto \\dfrac{1}{r^2} $\n\n' +
        'If $ r $ becomes $ 3r $, then $ r^2 $ becomes $ 9r^2 $, so $ F $ becomes $ \\dfrac{F}{9} $.\n\n' +
        'The force drops to **one ninth**. Notice you never needed a single number.',
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.7,
      questions: [
        q('Make $ u $ the subject of $ s = ut + \\dfrac{1}{2}at^2 $.',
          ['$ u = s - \\dfrac{1}{2}at^2 $', '$ u = \\dfrac{s}{t} - \\dfrac{1}{2}at^2 $', '$ u = \\dfrac{s - \\frac{1}{2}at^2}{t} $', '$ u = \\dfrac{s}{t} + \\dfrac{1}{2}at $'],
          2,
          'Subtract ½at² from both sides first, then divide the WHOLE remaining side by t. Option B is the trap: it divides only the s term by t and forgets the other one.',
          2),
        q('The kinetic energy of a body is $ K = \\dfrac{1}{2}mv^2 $. If its speed is doubled, its kinetic energy becomes:',
          ['4 times as large', 'twice as large', 'half as large', 'unchanged'],
          0,
          'v sits on the top with power 2, so doubling v multiplies K by 2² = 4. Answering "twice" means reading the power as 1.',
          2),
        q('The pressure of a fixed amount of gas at constant temperature obeys $ P = \\dfrac{k}{V} $. If the volume is reduced to one third, the pressure:',
          ['falls to one third', 'is unchanged', 'falls to one ninth', 'becomes three times larger'],
          3,
          'V is on the bottom with power 1, so P and V move in opposite directions. Dividing V by 3 multiplies P by 3.',
          2),
      ],
    }),
    b('text', 10, {
      markdown: 'Next: the small set of trigonometry facts that physics uses over and over.',
    }),
  ],
};

// ═══ 4 ── Trigonometry for Physics ═══════════════════════════════════════════
const page4 = {
  page_number: 4,
  slug: 'trigonometry-for-physics',
  title: 'Trigonometry for Physics',
  subtitle: 'Three ratios, five angles, and one circle',
  glossary: [
    { term: 'radian', definition: 'A way of measuring angles using arc length instead of degrees. A full circle is 2π radians.' },
    { term: 'hypotenuse', definition: 'The longest side of a right triangle — the one opposite the right angle.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A right triangle glowing on a dark background with its three sides highlighted in different colours.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'A large clean right triangle glowing on the left with its three sides picked out in distinct warm colours, and on the right the same triangle inscribed inside a circle of radius one.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Physics uses far less trigonometry than you might fear. In the whole of Class 11 you will mostly need three ratios and about five angles.\n\n' +
        'What you *do* need is to know them **instantly**, because they turn up in the middle of longer problems and you cannot afford to stop.',
    }),
    b('heading', 2, {
      text: 'The three ratios',
      level: 2,
      objective: 'Write sin, cos and tan for any angle in a right triangle.',
    }),
    b('text', 3, {
      markdown:
        'In a right triangle, pick one of the two non-right angles and call it $ \\theta $. Then:\n\n' +
        '$ \\sin\\theta = \\dfrac{\\text{opposite}}{\\text{hypotenuse}} \\qquad \\cos\\theta = \\dfrac{\\text{adjacent}}{\\text{hypotenuse}} \\qquad \\tan\\theta = \\dfrac{\\text{opposite}}{\\text{adjacent}} $\n\n' +
        '"Opposite" means the side facing your angle. "Adjacent" means the side touching it that is not the hypotenuse. The hypotenuse never changes — it is always the longest side.\n\n' +
        'Two facts worth carrying: $ \\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta} $, and $ \\sin^2\\theta + \\cos^2\\theta = 1 $.',
    }),
    b('table', 4, {
      caption: 'The five angles that cover nearly every Class 11 problem. Learn this table by heart.',
      headers: ['θ', '0°', '30°', '45°', '60°', '90°'],
      rows: [
        ['sin θ', '0', '1/2', '$ 1/\\sqrt{2} $', '$ \\sqrt{3}/2 $', '1'],
        ['cos θ', '1', '$ \\sqrt{3}/2 $', '$ 1/\\sqrt{2} $', '1/2', '0'],
        ['tan θ', '0', '$ 1/\\sqrt{3} $', '1', '$ \\sqrt{3} $', '∞'],
      ],
    }),
    b('callout', 5, {
      variant: 'remember',
      title: 'The easiest way to remember it',
      markdown:
        'Write 0, 1, 2, 3, 4 in a row. Divide each by 4. Take the square root of each. You now have sin 0°, sin 30°, sin 45°, sin 60°, sin 90°:\n\n' +
        '$ 0,\\ \\dfrac{1}{2},\\ \\dfrac{1}{\\sqrt{2}},\\ \\dfrac{\\sqrt{3}}{2},\\ 1 $\n\n' +
        'For cosine, read the same row **backwards**. That is the whole table from one trick.',
    }),
    b('heading', 6, {
      text: 'Degrees and radians',
      level: 2,
      objective: 'Convert between degrees and radians confidently.',
    }),
    b('text', 7, {
      markdown:
        'Degrees are a human invention — somebody chose 360. Radians come from the circle itself: one radian is the angle you get when the arc length equals the radius.\n\n' +
        'A full circle is $ 2\\pi $ radians, and a full circle is also 360°. So:\n\n' +
        '$ 180° = \\pi\\ \\mathrm{rad} \\qquad\\Rightarrow\\qquad 1° = \\dfrac{\\pi}{180}\\ \\mathrm{rad} $\n\n' +
        'You will need radians from Oscillations and Circular Motion onwards, because every formula there assumes them.',
    }),
    b('math_graph', 8, {
      title: 'The unit circle — where sin and cos come from',
      archetype: 'unit-circle',
      caption: 'Drag the point round the circle. The height of the point is sin θ and its sideways distance is cos θ. That is the whole definition.',
      height: 400,
    }),
    b('worked_example', 9, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A ladder leans against a wall at 60° to the ground. The ladder is 4 m long. How high up the wall does it reach?',
      solution:
        'Draw the right triangle. The ladder is the hypotenuse (4 m). The height up the wall is the side **opposite** the 60° angle.\n\n' +
        'Opposite and hypotenuse means sine:\n\n' +
        '$ \\sin 60° = \\dfrac{\\text{height}}{4} $\n\n' +
        '$ \\text{height} = 4 \\times \\sin 60° = 4 \\times \\dfrac{\\sqrt{3}}{2} = 2\\sqrt{3} \\approx 3.46\\ \\mathrm{m} $\n\n' +
        'Shortcut for checking: the answer must be less than the ladder length. If you ever get a height bigger than the hypotenuse, you have used cos where you needed sin.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('What is $ \\cos 60° $?',
          ['$ \\sqrt{3}/2 $', '$ 1/2 $', '$ 1/\\sqrt{2} $', '1'],
          1,
          'cos 60° = 1/2. Answering √3/2 means you gave sin 60° instead — swapping the two is the single most common trig error in physics.',
          1),
        q('Convert 30° into radians.',
          ['$ \\pi/3 $', '$ \\pi/2 $', '$ \\pi/6 $', '$ 30\\pi $'],
          2,
          'Multiply by π/180: 30 × π/180 = π/6. Getting π/3 means you used 60° by mistake.',
          2),
        q('In a right triangle the side opposite θ is 3 cm and the hypotenuse is 5 cm. What is $ \\tan\\theta $?',
          ['3/4', '3/5', '4/5', '5/3'],
          0,
          'This is the 3-4-5 triangle, so the adjacent side is 4. tan θ = opposite/adjacent = 3/4. Answering 3/5 gives sin θ, not tan θ.',
          3),
      ],
    }),
    b('text', 11, {
      markdown: 'Next: a shortcut that makes small angles almost disappear from your working.',
    }),
  ],
};

// ═══ 5 ── The Small-Angle Shortcut ═══════════════════════════════════════════
const page5 = {
  page_number: 5,
  slug: 'small-angle-shortcut',
  title: 'The Small-Angle Shortcut',
  subtitle: 'When an angle is tiny, sin θ, tan θ and θ are the same thing',
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A very thin wedge of a circle, showing the arc and the straight chord almost overlapping.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'A very narrow glowing wedge cut from a large circle, so thin that the curved arc and the straight chord across it are almost indistinguishable, with both drawn in slightly different warm colours.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Here is a fact that saves an enormous amount of work later.\n\n' +
        'When an angle is **small** — and measured in **radians** — these three quantities are almost equal:\n\n' +
        '$ \\sin\\theta \\approx \\tan\\theta \\approx \\theta $\n\n' +
        'The "measured in radians" part is not optional. The shortcut is completely false in degrees.',
    }),
    b('table', 2, {
      caption: 'The three quantities pulling apart as the angle grows. Below about 10° they agree to within 1%.',
      headers: ['θ (degrees)', 'θ (radians)', 'sin θ', 'tan θ'],
      rows: [
        ['1°', '0.0175', '0.0175', '0.0175'],
        ['5°', '0.0873', '0.0872', '0.0875'],
        ['10°', '0.1745', '0.1736', '0.1763'],
        ['20°', '0.3491', '0.3420', '0.3640'],
        ['45°', '0.7854', '0.7071', '1.0000'],
      ],
    }),
    b('reasoning_prompt', 3, {
      reasoning_type: 'quantitative',
      prompt:
        'Look down the table. At 1° the three columns agree to four decimal places. At 45° they are hopelessly different. Roughly where would you stop trusting the shortcut?',
      options: ['Around 5°', 'Around 10°', 'Around 30°', 'It always works'],
      reveal:
        'Around 10° is the usual working limit — the error is under 1% there. By 20° sin θ is already off by 2% and tan θ by 4%, which is enough to lose you an answer. The honest rule: use it when the question tells you the angle is small, not whenever you feel like it.',
      difficulty_level: 2,
    }),
    b('text', 4, {
      markdown:
        'Why does it work? Look at a very thin slice of a circle.\n\n' +
        'The arc length is $ r\\theta $. The straight chord across it is $ 2r\\sin(\\theta/2) $. When the slice is thin, the curve and the straight line lie almost on top of each other — so the two lengths are nearly the same, and therefore $ \\sin\\theta $ and $ \\theta $ are nearly the same.\n\n' +
        'That is all it is: for a small enough piece, a curve is a straight line.',
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'Where you will actually meet this',
      markdown:
        'You will use this shortcut in at least three places:\n\n' +
        '**The simple pendulum** — the formula $ T = 2\\pi\\sqrt{L/g} $ is only true for small swings, because its derivation replaces $ \\sin\\theta $ with $ \\theta $.\n\n' +
        '**Optics** — the whole of the thin-lens and mirror formula work assumes small angles near the axis.\n\n' +
        '**Estimating distances** — the width of a distant object is roughly (distance × angle in radians).',
    }),
    b('worked_example', 6, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'The Moon appears about 0.5° wide in the sky and is about 384,000 km away. Roughly how wide is it?',
      solution:
        'First put the angle into radians, because the shortcut only works there:\n\n' +
        '$ \\theta = 0.5 \\times \\dfrac{\\pi}{180} = 0.00873\\ \\mathrm{rad} $\n\n' +
        'For a small angle, width ≈ distance × θ:\n\n' +
        '$ \\text{width} \\approx 384000 \\times 0.00873 \\approx 3350\\ \\mathrm{km} $\n\n' +
        'The Moon\'s real diameter is about 3475 km, so we are within 4% — using nothing but an angle and a shortcut.',
    }),
    b('inline_quiz', 7, {
      pass_threshold: 0.7,
      questions: [
        q('The small-angle approximation $ \\sin\\theta \\approx \\theta $ is valid when θ is measured in:',
          ['degrees', 'either degrees or radians', 'revolutions', 'radians'],
          3,
          'Radians only. In degrees, sin 10° = 0.17 while θ = 10 — nowhere close. The approximation comes from the definition of the radian itself.',
          1),
        q('For a small angle θ (in radians), which is the best approximation for $ \\cos\\theta $?',
          ['θ', '1', '0', '1/θ'],
          1,
          'As θ gets small, cos θ approaches 1, not 0. Note that sine and tangent shrink towards θ while cosine heads towards 1 — mixing these up is a common slip.',
          2),
        q('A pendulum formula derived using $ \\sin\\theta \\approx \\theta $ will be least accurate for a swing of:',
          ['2°', '5°', '40°', '8°'],
          2,
          'The larger the angle, the worse the approximation. At 40° the error in sin θ is over 8%, so the predicted time period is noticeably wrong.',
          2),
      ],
    }),
    b('text', 8, {
      markdown:
        'That is the last of the pure-maths tools. From the next page the chapter changes gear — we start on **vectors**, which is what the rest of physics is really built on.',
    }),
  ],
};

// ═══ 6 ── Scalars and Vectors ════════════════════════════════════════════════
const page6 = {
  page_number: 6,
  slug: 'scalars-and-vectors',
  title: 'Scalars and Vectors',
  subtitle: 'When a number alone is not enough',
  glossary: [
    { term: 'scalar', definition: 'A quantity that needs only a size to describe it fully, like mass or temperature.' },
    { term: 'vector', definition: 'A quantity that needs both a size and a direction, like force or velocity.' },
    { term: 'displacement', definition: 'The straight-line distance and direction from the starting point to the finishing point.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A winding road between two towns with a straight glowing arrow cutting across between them.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'A winding country road curving between two small towns, with a single straight glowing arrow drawn directly from the first town to the second, cutting across the bends.'
      ),
    }),
    b('callout', 1, {
      variant: 'fun_fact',
      title: 'Walk 7 km, end up 5 km away',
      markdown:
        'Walk 4 km east, then turn and walk 3 km north. Your legs have covered 7 km. But you are standing only 5 km from where you began.\n\n' +
        'Both numbers are correct. They are answers to two different questions — and physics needs both.',
    }),
    b('text', 2, {
      markdown:
        'Some quantities are completely described by a number and a unit. Your mass is 60 kg. The temperature is 30 °C. There is no "direction of 60 kg". These are called **scalars**.\n\n' +
        'Other quantities make no sense until you also say **which way**. If I tell you a force of 10 N acts on a box, you still cannot say what will happen — it depends entirely on whether I push it left, right or down. These are **vectors**.\n\n' +
        'That is the whole distinction: does the direction matter?',
    }),
    b('heading', 3, {
      text: 'See the difference',
      level: 2,
      objective: 'Tell distance from displacement, and say why the difference matters.',
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
        'The straight arrow from start to finish is **displacement** — a vector. It can grow, shrink, or even come back to zero if you walk in a circle and return home.\n\n' +
        'That last case is worth holding on to. Run one full lap of a 400 m track and your distance is 400 m, but your displacement is **zero**. You are exactly where you started.',
    }),
    b('table', 6, {
      caption: 'The pairs you will meet again and again. In each row, the scalar answers "how much" and the vector answers "how much, and which way".',
      headers: ['Scalar', 'Vector', 'What the direction adds'],
      rows: [
        ['Distance', 'Displacement', 'Where you ended up, not how far you walked'],
        ['Speed', 'Velocity', 'Which way you are heading'],
        ['Mass', 'Weight', 'Weight is a force, so it pulls downwards'],
        ['Energy, work, time', '—', 'These have no direction at all'],
      ],
    }),
    b('callout', 7, {
      variant: 'warning',
      title: 'A trap worth naming now',
      markdown:
        'A car going round a circular track at a steady 40 km/h has **constant speed** but a **changing velocity**, because its direction keeps changing.\n\n' +
        'And a changing velocity means it is accelerating — even though the speedometer never moves. Students lose marks on this every single year.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('An athlete runs exactly one lap of a 400 m circular track. What are the distance and displacement?',
          ['Distance 400 m, displacement 0', 'Distance 0, displacement 400 m', 'Both 400 m', 'Both 0'],
          0,
          'The legs covered 400 m, so the distance is 400 m. But the finish point is the start point, so the displacement is zero. This pair of answers is the standard test of whether you understand the difference.',
          2),
        q('Which of these is a scalar?',
          ['Velocity', 'Force', 'Work', 'Displacement'],
          2,
          'Work has a size but no direction — 50 joules of work is not "50 joules northward". The other three all need a direction to be meaningful.',
          1),
        q('A car travels round a bend at a constant speed of 40 km/h. Which statement is true?',
          ['Its velocity is constant too', 'It is not accelerating', 'Neither its speed nor its velocity changes', 'Its velocity is changing'],
          3,
          'Velocity includes direction, and the direction is changing all the way round the bend. So the velocity changes, and the car is accelerating — despite the steady speedometer reading.',
          3),
      ],
    }),
    b('text', 9, {
      markdown: 'Next: a closer look at a single vector — how we draw it, name it, and pull it apart.',
    }),
  ],
};

// ═══ 7 ── Anatomy of a Vector ════════════════════════════════════════════════
const page7 = {
  page_number: 7,
  slug: 'anatomy-of-a-vector',
  title: 'Anatomy of a Vector',
  subtitle: 'How we draw one, name one, and read one',
  glossary: [
    { term: 'magnitude', definition: 'The size of a vector, ignoring its direction. Always positive.' },
    { term: 'unit vector', definition: 'A vector of length exactly 1, used to point out a direction. Written with a hat, like î.' },
    { term: 'component', definition: 'The part of a vector lying along one particular axis.' },
  ],
  blocks: [
    b('image', 0, {
      src: '',
      alt: 'A single large glowing arrow on a grid with its tail, tip, length and angle marked.',
      aspect_ratio: '16:5',
      caption: '',
      generation_prompt: heroPrompt(
        'A single large glowing arrow drawn diagonally across a faint technical grid, with small markers picking out its tail, its arrowhead, its length, and the angle it makes with the horizontal.'
      ),
    }),
    b('text', 1, {
      markdown:
        'A vector is drawn as an **arrow**, and the arrow carries two pieces of information at once.\n\n' +
        'Its **length** shows the magnitude — how big the quantity is. A 10 N force is drawn twice as long as a 5 N force.\n\n' +
        'Its **direction** shows which way the quantity acts. The pointed end is called the tip or head; the other end is the tail.\n\n' +
        'In print a vector is written in bold, $ \\mathbf{A} $, or with an arrow above it, $ \\vec{A} $. When you write it by hand, always put the arrow on top — a plain $ A $ means only the magnitude.',
    }),
    b('callout', 2, {
      variant: 'remember',
      title: 'Magnitude is never negative',
      markdown:
        'The magnitude of a vector is written $ |\\vec{A}| $ or just $ A $, and it can never be negative. It is a length.\n\n' +
        'So what does a minus sign mean on a vector? It means **reverse the direction**. $ -\\vec{A} $ has exactly the same length as $ \\vec{A} $ but points the opposite way. You will need this on the subtraction page.',
    }),
    b('heading', 3, {
      text: 'Everything about one arrow, at once',
      level: 2,
      objective: 'Read magnitude, direction and both components off a single vector.',
    }),
    b('vector_board', 4, {
      title: 'Drag the tip and watch all four numbers move together',
      archetype: 'vector-anatomy',
      units: 'N',
      vectors: [v('A', 6, 35, { color: 'indigo', draggable: true })],
      show: { components: true, angleArc: true },
      caption:
        'Magnitude, direction, and the two components are four ways of describing the same single arrow. Change the arrow and all four change together — they are never independent.',
    }),
    b('text', 5, {
      markdown:
        'Notice what happened as you dragged.\n\n' +
        'You can describe that arrow in two completely different ways, and both are complete.\n\n' +
        'You can give its **magnitude and direction** — "6 N at 35°". Or you can give its **two components** — "4.9 N across and 3.4 N up". Neither is more correct. We swap between them constantly, choosing whichever makes the problem easier.\n\n' +
        'Turning magnitude-and-direction into components is called **resolving**, and it gets its own page shortly.',
    }),
    b('heading', 6, {
      text: 'Writing a vector with î and ĵ',
      level: 2,
      objective: 'Read and write a vector in component form.',
    }),
    b('text', 7, {
      markdown:
        'There is a compact way to write the components down.\n\n' +
        'We define $ \\hat{i} $ as a vector of length 1 pointing along the x-axis, and $ \\hat{j} $ as a vector of length 1 pointing along the y-axis. These are called **unit vectors** — their only job is to point.\n\n' +
        'Then any vector in a plane can be written:\n\n' +
        '$ \\vec{A} = A_x\\hat{i} + A_y\\hat{j} $\n\n' +
        'So $ \\vec{A} = 4.9\\hat{i} + 3.4\\hat{j} $ means "4.9 units across and 3.4 units up". And to get back to the magnitude, use Pythagoras:\n\n' +
        '$ |\\vec{A}| = \\sqrt{A_x^2 + A_y^2} $',
    }),
    b('worked_example', 8, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A force is written as $ \\vec{F} = 3\\hat{i} + 4\\hat{j} $ N. Find its magnitude and the angle it makes with the x-axis.',
      solution:
        'The components are $ F_x = 3 $ N and $ F_y = 4 $ N.\n\n' +
        'Magnitude, by Pythagoras:\n\n' +
        '$ |\\vec{F}| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5\\ \\mathrm{N} $\n\n' +
        'Direction, from the tangent ratio:\n\n' +
        '$ \\tan\\theta = \\dfrac{F_y}{F_x} = \\dfrac{4}{3} \\quad\\Rightarrow\\quad \\theta = 53.1° $\n\n' +
        'So the force is 5 N at 53.1° above the x-axis.\n\n' +
        'Shortcut: 3-4-5 is the most common triangle in all of physics. If you see 3 and 4 as components, the magnitude is 5 without any working.',
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.7,
      questions: [
        q('A vector is written $ \\vec{A} = -5\\hat{i} $. What does the minus sign tell you?',
          ['Its magnitude is −5', 'It points along the negative x-direction', 'It has zero length', 'It points along the y-axis'],
          1,
          'The minus sign lives in the direction, never in the magnitude. This vector has magnitude 5 and points the opposite way along the x-axis.',
          2),
        q('What is the magnitude of $ \\vec{v} = 6\\hat{i} - 8\\hat{j} $?',
          ['2', '14', '−2', '10'],
          3,
          '√(6² + (−8)²) = √(36 + 64) = √100 = 10. The components are squared, so the minus sign disappears — a magnitude can never come out negative.',
          2),
        q('A vector has magnitude 10 N and points along the y-axis. In component form it is:',
          ['$ 10\\hat{j} $', '$ 10\\hat{i} $', '$ 10\\hat{i} + 10\\hat{j} $', '$ 5\\hat{i} + 5\\hat{j} $'],
          0,
          'Pointing straight up means there is no sideways part at all, so the x-component is zero and the whole 10 N sits on ĵ.',
          1),
      ],
    }),
    b('text', 10, {
      markdown:
        'You can now describe a single vector completely. Next comes the question the rest of the chapter is built on: what happens when **two** of them act at once?',
    }),
  ],
};

// ── entry point ──────────────────────────────────────────────────────────────
const pages = [page0, page1, page2, page3, page4, page5, page6, page7];
module.exports = { pages };

if (require.main === module) {
  withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, pages);
  }).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
