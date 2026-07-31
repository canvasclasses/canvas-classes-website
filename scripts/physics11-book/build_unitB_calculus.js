'use strict';
/**
 * Chapter 0 · UNIT B — Differentiation and Integration (pages 13–22).
 *
 *   13  What Differentiation Really Means
 *   14  The Standard Derivatives
 *   15  Rules I — Sum, Constant Multiple, Product
 *   16  Rules II — Quotient and Chain
 *   17  The Derivative as a Rate of Change
 *   18  Maxima and Minima
 *   19  Integration — Reversing Differentiation
 *   20  Integration Rules — Constant, Sum, Substitution
 *   21  Definite Integration and Area Under the Curve
 *   22  Unit B Practice Arena
 *
 * Scope rule (founder, 2026-07-29): the bare minimum needed to survive
 * kinematics. No limits from first principles, no ε-δ, no integration by parts,
 * no partial fractions. Formula, when to use it, drill.
 *
 * Run:  node scripts/physics11-book/build_unitB_calculus.js
 */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch0');
const { v4: uuidv4 } = require('uuid');

const heroPrompt = (scene) =>
  `Wide cinematic illustration on a very dark near-black background. ${scene} Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.`;

const st = (math, say, why, check) => ({ id: uuidv4(), math, say, ...(why ? { why } : {}), ...(check ? { check } : {}) });
const pmcq = (id, prompt, options, correct_index, explanation) => ({ id, kind: 'mcq', source: 'mcq', prompt, options, correct_index, explanation });
const pnum = (id, prompt, answer, solution) => ({ id, kind: 'numerical', source: 'mcq', prompt, answer, solution });

// ═══ 13 ── What Differentiation Really Means ═════════════════════════════════
const page13 = {
  page_number: 13,
  slug: 'what-differentiation-means',
  title: 'What Differentiation Really Means',
  subtitle: 'From "average over an hour" to "right now"',
  glossary: [
    { term: 'derivative', definition: 'The rate at which one quantity changes with respect to another, at a single instant rather than over an interval.' },
    { term: 'tangent', definition: 'A straight line that touches a curve at one point and has the same slope as the curve there.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A curve with a chord between two points gradually closing up until it becomes a tangent line at a single point.',
      generation_prompt: heroPrompt(
        'A glowing curve on a dark grid. A straight chord joins two points on it; three faded copies show the second point sliding closer and closer to the first, until the chord becomes a tangent touching at a single bright point.'
      ),
    }),
    b('curiosity_prompt', 1, {
      prompt:
        'A car covers 60 km in one hour. Its average speed is 60 km/h. But a speed camera catches it doing 90 km/h at one particular moment. Both numbers are correct. What is the difference between them?',
      hint: 'One number is about a stretch of time. The other is about an instant.',
      reveal:
        'The 60 is an **average** — total distance divided by total time, blind to everything that happened in between. The 90 is an **instantaneous** value — the speed at one exact moment.\n\n' +
        'Differentiation is the machinery for getting from the first kind of number to the second. That is all it is.',
    }),
    b('text', 2, {
      markdown:
        'Start with something you can already do. If a position changes from $ x_1 $ to $ x_2 $ between times $ t_1 $ and $ t_2 $, the average velocity is:\n\n' +
        '$ v_{\\text{avg}} = \\dfrac{x_2 - x_1}{t_2 - t_1} = \\dfrac{\\Delta x}{\\Delta t} $\n\n' +
        'That symbol $ \\Delta $ (delta) just means "the change in". Nothing mysterious.\n\n' +
        'Now here is the whole idea. Make the time interval smaller. Then smaller again. As $ \\Delta t $ shrinks towards zero, the answer stops being an average over a stretch and becomes the value at an **instant**. When that happens we stop writing $ \\Delta $ and start writing $ d $:\n\n' +
        '$ v = \\dfrac{dx}{dt} $\n\n' +
        'Read it as "dee x by dee t". It means exactly what $ \\dfrac{\\Delta x}{\\Delta t} $ meant — a change divided by a change — except the interval has been squeezed down to nothing.',
    }),
    b('heading', 3, {
      text: 'Watch the interval shrink',
      level: 2,
      objective: 'See why a small interval gives a better estimate of the instantaneous rate.',
    }),
    b('table', 4, {
      caption: 'A body moves so that $ x = t^2 $. Estimating its velocity at $ t = 3 $ s by shrinking the interval.',
      headers: ['Interval $ \\Delta t $', 'From $ x $ at 3 s to $ x $ at $ 3 + \\Delta t $', '$ \\Delta x $', '$ \\Delta x / \\Delta t $'],
      rows: [
        ['$ 1 $', '$ 9 \\to 16 $', '$ 7 $', '$ 7 $'],
        ['$ 0.5 $', '$ 9 \\to 12.25 $', '$ 3.25 $', '$ 6.5 $'],
        ['$ 0.1 $', '$ 9 \\to 9.61 $', '$ 0.61 $', '$ 6.1 $'],
        ['$ 0.01 $', '$ 9 \\to 9.0601 $', '$ 0.0601 $', '$ 6.01 $'],
        ['$ \\to 0 $', '—', '—', '$ \\to 6 $'],
      ],
    }),
    b('text', 5, {
      markdown:
        'The numbers are closing in on 6. They never quite arrive by this method — but they clearly want to.\n\n' +
        'That limiting value, **6**, is the derivative of $ x = t^2 $ at $ t = 3 $. In a moment you will get it in one line instead of five rows of arithmetic.',
    }),
    b('heading', 6, {
      text: 'The same idea, drawn',
      level: 2,
      objective: 'Connect the derivative to the slope of a tangent.',
    }),
    b('text', 7, {
      markdown:
        'On a graph, $ \\dfrac{\\Delta x}{\\Delta t} $ is the slope of the straight line joining two points on the curve. That line is called a **chord**.\n\n' +
        'As the two points slide together, the chord pivots until it just grazes the curve at a single point. That final line is the **tangent**, and its slope is the derivative.\n\n' +
        'So there are two ways to say the same thing, and you need both:\n\n' +
        '- **Physically:** the derivative is an instantaneous rate of change.\n' +
        '- **Graphically:** the derivative is the slope of the tangent.\n\n' +
        'Drag the point along the curve below and watch the tangent follow it. Notice where the tangent goes flat.',
    }),
    b('math_graph', 8, {
      title: 'The tangent follows the point',
      archetype: 'tangent-explorer',
      archetype_params: { base: 'square' },
      caption: 'Drag P along the curve. The tangent line tilts as you go — its slope at each point IS the derivative there.',
      predict: {
        prompt: 'Where on this curve is the tangent perfectly horizontal?',
        options: ['At the far left', 'At the lowest point of the curve', 'Nowhere — it is always tilted', 'At the far right'],
        answer_index: 1,
        reveal: 'At the bottom of the U. A horizontal tangent means slope zero, which means the derivative is zero there. That single fact is the whole basis of finding maxima and minima later in this unit.',
      },
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Read the notation properly',
      markdown:
        '$ \\dfrac{dy}{dx} $ is **not** a fraction with $ d $ on top. The $ d $ is not a quantity you can cancel.\n\n' +
        'It is a single symbol meaning "the rate at which $ y $ changes as $ x $ changes". You will also see it written $ y\' $ or $ f\'(x) $ — same thing, shorter.\n\n' +
        'And the two words mean the same: **differentiating** a function and **finding its derivative** are one operation.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\dfrac{dx}{dt} $ represents:',
          ['The total distance travelled', 'The average velocity over the whole journey', 'The velocity at one instant', 'The acceleration'],
          2,
          'It is the instantaneous rate of change of position with time — the velocity right now, not averaged over an interval.',
          1),
        q('On a position–time graph, the derivative at a point is:',
          ['The height of the curve there', 'The area under the curve', 'The slope of the chord between two far-apart points', 'The slope of the tangent at that point'],
          3,
          'The derivative is the tangent slope. A chord between far-apart points gives only an average, not an instantaneous value.',
          2),
        q('If the tangent to a curve at some point is horizontal, then at that point:',
          ['$ \\dfrac{dy}{dx} = 0 $', '$ \\dfrac{dy}{dx} = 1 $', '$ \\dfrac{dy}{dx} $ is infinite', '$ y = 0 $'],
          0,
          'A horizontal line has slope zero, so the derivative is zero. This is exactly how turning points are located.',
          2),
      ],
    }),
    b('text', 11, {
      markdown: 'Next: the small table of results that lets you skip all that shrinking-interval arithmetic.',
    }),
  ],
};

// ═══ 14 ── The Standard Derivatives ══════════════════════════════════════════
const page14 = {
  page_number: 14,
  slug: 'standard-derivatives',
  title: 'The Standard Derivatives',
  subtitle: 'The short table that does most of the work',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A compact glowing reference card listing derivative results on a dark surface.',
      generation_prompt: heroPrompt(
        'A single glowing reference card floating on a dark surface, ruled into neat rows, with abstract mathematical marks on it. Clean, technical, like a pocket formula card.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Nobody works out derivatives from shrinking intervals. Mathematicians did that once, wrote down the answers, and everybody since has looked them up.\n\n' +
        'Here is the table. It is short. Learn it the way you learned multiplication tables — by using it, not by staring at it.',
    }),
    b('heading', 2, {
      text: 'The one rule you must never forget',
      level: 2,
      objective: 'Apply the power rule to any term of the form xⁿ.',
    }),
    b('text', 3, {
      markdown:
        '$ \\dfrac{d}{dx}\\left(x^n\\right) = n\\,x^{\\,n-1} $\n\n' +
        'In words: **bring the power down to the front, then reduce the power by one.**\n\n' +
        'That single rule covers most of what mechanics asks for. Check it against the earlier table: for $ x = t^2 $, the rule gives $ \\dfrac{dx}{dt} = 2t $, and at $ t = 3 $ that is $ 6 $ — exactly the number all those shrinking intervals were creeping towards.\n\n' +
        'Two special cases fall straight out of it:\n\n' +
        '- **A constant differentiates to zero.** $ \\dfrac{d}{dx}(7) = 0 $. A constant never changes, so its rate of change is nothing.\n' +
        '- **$ x $ differentiates to 1.** Since $ x = x^1 $, the rule gives $ 1 \\cdot x^0 = 1 $.',
    }),
    b('table', 4, {
      caption: 'The standard derivatives. The trigonometric ones assume x is in RADIANS — see the warning below.',
      headers: ['$ f(x) $', '$ f\'(x) $', 'Note'],
      rows: [
        ['$ x^n $', '$ n\\,x^{\\,n-1} $', 'The workhorse'],
        ['constant $ c $', '$ 0 $', 'Nothing changing means no rate'],
        ['$ \\sin x $', '$ \\cos x $', ''],
        ['$ \\cos x $', '$ -\\sin x $', '**The minus sign is the trap**'],
        ['$ \\tan x $', '$ \\sec^2 x $', ''],
        ['$ e^x $', '$ e^x $', 'Differentiates to itself — the only function that does'],
        ['$ \\ln x $', '$ \\dfrac{1}{x} $', 'Only defined for $ x > 0 $'],
        ['$ \\sqrt{x} $', '$ \\dfrac{1}{2\\sqrt{x}} $', 'Just the power rule with $ n = \\tfrac{1}{2} $'],
        ['$ \\dfrac{1}{x} $', '$ -\\dfrac{1}{x^2} $', 'Just the power rule with $ n = -1 $'],
      ],
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'Rewrite roots and fractions as powers first',
      markdown:
        'The last two rows are not separate rules. They are the power rule in disguise, and you should train yourself to see that.\n\n' +
        '$ \\sqrt{x} = x^{1/2} \\;\\Rightarrow\\; \\dfrac{1}{2}x^{-1/2} = \\dfrac{1}{2\\sqrt{x}} $\n\n' +
        '$ \\dfrac{1}{x} = x^{-1} \\;\\Rightarrow\\; -1 \\cdot x^{-2} = -\\dfrac{1}{x^2} $\n\n' +
        'So the habit is: **any root or any fraction, rewrite it as a power before you differentiate.** Then you only ever need one rule.',
    }),
    b('callout', 6, {
      variant: 'note',
      title: 'Radians, not degrees — and why it matters',
      markdown:
        '$ \\dfrac{d}{dx}(\\sin x) = \\cos x $ is only true when $ x $ is in **radians**.\n\n' +
        'If the angle is in degrees, an extra factor appears:\n\n' +
        '$ \\dfrac{d}{dx}\\left(\\sin x°\\right) = \\dfrac{\\pi}{180}\\cos x° $\n\n' +
        'This is the tidiest possible argument for why physics uses radians everywhere: choose radians and that ugly factor is simply 1.',
    }),
    b('worked_example', 7, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Differentiate $ y = x^5 $, $ y = x^{-3} $, and $ y = \\sqrt[3]{x} $ with respect to $ x $.',
      solution:
        'All three are the same rule. Bring the power down, subtract one.\n\n' +
        '$ y = x^5 \\;\\Rightarrow\\; \\dfrac{dy}{dx} = 5x^4 $\n\n' +
        '$ y = x^{-3} \\;\\Rightarrow\\; \\dfrac{dy}{dx} = -3x^{-4} = -\\dfrac{3}{x^4} $\n\n' +
        'For the cube root, rewrite it as a power first:\n\n' +
        '$ y = \\sqrt[3]{x} = x^{1/3} \\;\\Rightarrow\\; \\dfrac{dy}{dx} = \\dfrac{1}{3}x^{-2/3} = \\dfrac{1}{3x^{2/3}} $\n\n' +
        'Watch-out: with a negative power, subtracting one makes it **more** negative. $ -3 - 1 = -4 $, not $ -2 $.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\dfrac{d}{dx}\\left(x^7\\right) $ equals:',
          ['$ 7x^6 $', '$ x^6 $', '$ 7x^8 $', '$ 6x^7 $'],
          0,
          'Bring the 7 down, reduce the power to 6.',
          1),
        q('$ \\dfrac{d}{dx}(\\cos x) $ equals:',
          ['$ \\sin x $', '$ \\sec^2 x $', '$ -\\sin x $', '$ -\\cos x $'],
          2,
          'Cosine differentiates to **minus** sine. Missing that minus sign is the single most common slip in this unit.',
          1),
        q('$ \\dfrac{d}{dx}\\left(\\dfrac{1}{x^2}\\right) $ equals:',
          ['$ \\dfrac{2}{x^3} $', '$ -\\dfrac{1}{2x} $', '$ -\\dfrac{2}{x} $', '$ -\\dfrac{2}{x^3} $'],
          3,
          'Rewrite as $ x^{-2} $. The power rule gives $ -2x^{-3} = -\\dfrac{2}{x^3} $.',
          3),
      ],
    }),
    b('text', 9, {
      markdown: 'Next: what to do when a function is built out of several of these joined together.',
    }),
  ],
};

// ═══ 15 ── Rules I ═══════════════════════════════════════════════════════════
const page15 = {
  page_number: 15,
  slug: 'differentiation-rules-sum-and-product',
  title: 'Rules I — Sums and Products',
  subtitle: 'Adding is easy. Multiplying is not.',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Two mathematical expressions joined by a plus sign and by a multiplication sign, treated differently.',
      generation_prompt: heroPrompt(
        'Two abstract glowing shapes side by side on a dark grid — one pair joined by a bright plus symbol and separating cleanly, the other pair joined by a multiplication symbol and locked together.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Real functions are not single terms. They are sums, products and quotients of the ones in the table. Four rules handle every combination you will meet, and this page covers the first three.',
    }),
    b('heading', 2, {
      text: 'Sums, differences and constant multiples',
      level: 2,
      objective: 'Differentiate any polynomial term by term.',
    }),
    b('text', 3, {
      markdown:
        'These behave exactly as you would hope.\n\n' +
        '$ \\dfrac{d}{dx}\\left(u + v\\right) = \\dfrac{du}{dx} + \\dfrac{dv}{dx} $\n\n' +
        '$ \\dfrac{d}{dx}\\left(k\\,u\\right) = k\\,\\dfrac{du}{dx} $\n\n' +
        'In words: **differentiate each term separately, and constants just come along for the ride.**\n\n' +
        'This is why polynomials are easy. Take them one term at a time and you cannot go wrong.',
    }),
    b('step_solver', 4, {
      title: 'Differentiate term by term',
      problem: 'Differentiate $ y = x^4 + 3x^2 - 2x $ with respect to $ x $.',
      intro: 'Three terms, three separate applications of the power rule. Do not try to do it all at once.',
      steps: [
        st(
          '$ \\dfrac{d}{dx}\\left(x^4\\right) = 4x^3 $',
          'First term. Bring the 4 down, drop the power to 3.',
          'Nothing else in the expression affects this term. That is what the sum rule guarantees.',
          {
            kind: 'mcq',
            prompt: 'What is $ \\dfrac{d}{dx}\\left(x^4\\right) $?',
            options: ['$ 4x^3 $', '$ x^3 $', '$ 4x^5 $', '$ 3x^4 $'],
            answer_index: 0,
            feedback_right: 'Yes — power down to the front, then reduce it by one.',
            feedback_wrong: 'The power comes down as a multiplier AND the power drops by one. Both things happen.',
          },
        ),
        st(
          '$ \\dfrac{d}{dx}\\left(3x^2\\right) = 6x $',
          'Second term. The 3 stays put; differentiate $ x^2 $ to get $ 2x $, then multiply.',
          '$ 3 \\times 2x = 6x $. A constant multiplier never changes — it simply rides along.',
        ),
        st(
          '$ \\dfrac{d}{dx}\\left(-2x\\right) = -2 $',
          'Third term. $ x $ differentiates to 1, so $ -2x $ gives $ -2 $.',
          'Any term that is just a straight multiple of $ x $ differentiates to that multiple. Keep the sign.',
          {
            kind: 'fill_blank',
            prompt: '$ \\dfrac{d}{dx}(-2x) = $ ____',
            blank_answer: '-2',
            feedback_right: 'Correct — the $ x $ disappears and the coefficient is left behind.',
            feedback_wrong: 'Since $ x $ differentiates to 1, you are left with just the coefficient — including its minus sign.',
          },
        ),
        st(
          '$ \\dfrac{dy}{dx} = 4x^3 + 6x - 2 $',
          'Put the three pieces back together with their original signs.',
          'Check the count: three terms in, three terms out. A polynomial of degree 4 differentiates to one of degree 3.',
        ),
      ],
      now_you_try: {
        problem: 'Differentiate $ y = 2x^3 - 5x^2 + 7 $.',
        answer: '$ \\dfrac{dy}{dx} = 6x^2 - 10x $',
        solution:
          '$ \\dfrac{d}{dx}\\left(2x^3\\right) = 6x^2 $\n\n' +
          '$ \\dfrac{d}{dx}\\left(-5x^2\\right) = -10x $\n\n' +
          '$ \\dfrac{d}{dx}(7) = 0 $ — a constant has no rate of change\n\n' +
          '$ \\dfrac{dy}{dx} = 6x^2 - 10x $\n\n' +
          'The $ +7 $ vanishing is worth pausing on. Adding 7 lifts the whole graph up but does not tilt it anywhere, so the slope is unchanged.',
      },
    }),
    b('heading', 5, {
      text: 'Products — where intuition fails',
      level: 2,
      objective: 'Apply the product rule and know why the obvious guess is wrong.',
    }),
    b('text', 6, {
      markdown:
        'Here the pattern breaks. The derivative of a product is **not** the product of the derivatives. That guess is wrong, and it is worth seeing why once.\n\n' +
        'Try $ y = x \\cdot x = x^2 $. The correct answer is $ 2x $. But multiplying the derivatives would give $ 1 \\times 1 = 1 $. Not even close.\n\n' +
        'The real rule is:\n\n' +
        '$ \\dfrac{d}{dx}(uv) = u\\dfrac{dv}{dx} + v\\dfrac{du}{dx} $\n\n' +
        'Say it out loud as a rhythm and it sticks: **"first times derivative of second, plus second times derivative of first."**',
    }),
    b('step_solver', 7, {
      title: 'The product rule in action',
      problem: 'Differentiate $ y = x^2\\cos x $.',
      intro: 'Two functions multiplied together. Name them before you start — that alone prevents most errors.',
      steps: [
        st(
          '$ u = x^2, \\qquad v = \\cos x $',
          'Label the two parts.',
          'Writing this line down looks trivial, but it is what stops you mixing up which derivative goes where.',
          {
            kind: 'pick_op',
            prompt: 'Which rule does $ x^2\\cos x $ need?',
            options: ['Sum rule — differentiate each part separately', 'Product rule', 'Power rule on the whole thing'],
            answer_index: 1,
            feedback_right: 'Right — the two parts are multiplied, not added.',
            feedback_wrong: 'Look at what joins the two parts. There is no plus sign — they are multiplied.',
          },
        ),
        st(
          '$ \\dfrac{du}{dx} = 2x, \\qquad \\dfrac{dv}{dx} = -\\sin x $',
          'Differentiate each part on its own.',
          'The minus on $ \\sin x $ comes from the standard table. Losing it here is the classic mistake.',
        ),
        st(
          '$ \\dfrac{dy}{dx} = x^2(-\\sin x) + \\cos x\\,(2x) $',
          'Now assemble: first × derivative of second, plus second × derivative of first.',
          'Substituting into the pattern mechanically, without trying to simplify yet, keeps the signs straight.',
        ),
        st(
          '$ \\dfrac{dy}{dx} = 2x\\cos x - x^2\\sin x $',
          'Tidy up and write the simpler term first.',
          'Both terms share a factor $ x $, so you could also write $ x(2\\cos x - x\\sin x) $. Either form is acceptable.',
        ),
      ],
      now_you_try: {
        problem: 'Differentiate $ y = e^x x^5 $.',
        answer: '$ \\dfrac{dy}{dx} = e^x x^4(x + 5) $',
        solution:
          'Let $ u = e^x $ and $ v = x^5 $.\n\n' +
          '$ \\dfrac{du}{dx} = e^x $ (it differentiates to itself) and $ \\dfrac{dv}{dx} = 5x^4 $.\n\n' +
          '$ \\dfrac{dy}{dx} = e^x(5x^4) + x^5(e^x) = e^x\\left(5x^4 + x^5\\right) $\n\n' +
          'Take out the common factor $ x^4 $:\n\n' +
          '$ \\dfrac{dy}{dx} = e^x x^4(5 + x) $',
      },
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\dfrac{d}{dx}\\left(5x^3 - 4x + 9\\right) $ equals:',
          ['$ 15x^2 - 4 $', '$ 15x^2 - 4 + 9 $', '$ 5x^2 - 4 $', '$ 15x^2 - 4x $'],
          0,
          'Term by term: $ 15x^2 $, then $ -4 $, and the constant 9 differentiates to zero and disappears.',
          1),
        q('$ \\dfrac{d}{dx}(x\\sin x) $ equals:',
          ['$ \\cos x $', '$ x\\cos x $', '$ \\sin x + x\\cos x $', '$ \\sin x\\cos x $'],
          2,
          'Product rule: $ x(\\cos x) + \\sin x(1) = \\sin x + x\\cos x $. Multiplying the two derivatives together would be wrong.',
          2),
        q('For $ y = uv $, the derivative $ \\dfrac{dy}{dx} $ is:',
          ['$ \\dfrac{du}{dx}\\cdot\\dfrac{dv}{dx} $', '$ u\\dfrac{du}{dx} + v\\dfrac{dv}{dx} $', '$ \\dfrac{du}{dx} + \\dfrac{dv}{dx} $', '$ u\\dfrac{dv}{dx} + v\\dfrac{du}{dx} $'],
          3,
          'Each function multiplies the **other** one\'s derivative. Pairing each with its own derivative is the commonest wrong version.',
          2),
      ],
    }),
    b('text', 9, {
      markdown: 'Next: the last two rules — and the one that matters most in physics.',
    }),
  ],
};

// ═══ 16 ── Rules II ══════════════════════════════════════════════════════════
const page16 = {
  page_number: 16,
  slug: 'differentiation-rules-quotient-and-chain',
  title: 'Rules II — Quotients and the Chain Rule',
  subtitle: 'The one you will use every single day',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Nested rings, one inside another, suggesting a function inside a function.',
      generation_prompt: heroPrompt(
        'Three glowing rings nested one inside another on a dark grid, with a bright arrow passing through all of them from outside to centre, suggesting layers being peeled.'
      ),
    }),
    b('heading', 1, {
      text: 'The quotient rule',
      level: 2,
      objective: 'Differentiate a fraction of two functions and get the sign order right.',
    }),
    b('text', 2, {
      markdown:
        'For a fraction $ y = \\dfrac{u}{v} $:\n\n' +
        '$ \\dfrac{dy}{dx} = \\dfrac{v\\dfrac{du}{dx} - u\\dfrac{dv}{dx}}{v^2} $\n\n' +
        'Two things to note, because both are tested:\n\n' +
        '1. The numerator has a **minus**, so unlike the product rule the **order matters**. Swap the two terms and you get the wrong sign.\n' +
        '2. The denominator is $ v^2 $ — the bottom function squared, and nothing else.\n\n' +
        'A memory line that works: *"bottom times derivative of top, minus top times derivative of bottom, all over bottom squared."*',
    }),
    b('callout', 3, {
      variant: 'exam_tip',
      title: 'Often you can dodge it entirely',
      markdown:
        'The quotient rule is fiddly. Before using it, check whether the fraction can be rewritten as a product.\n\n' +
        '$ \\dfrac{1+x}{e^x} = (1+x)e^{-x} $\n\n' +
        'That is now a product, and the product rule is far less error-prone. Similarly $ \\dfrac{x^3 + x}{x} $ simplifies to $ x^2 + 1 $ before you differentiate anything at all.\n\n' +
        'Always look for the simplification first. It is not laziness; it is fewer places to make a mistake.',
    }),
    b('heading', 4, {
      text: 'The chain rule — a function inside a function',
      level: 2,
      objective: 'Differentiate composite functions by peeling one layer at a time.',
    }),
    b('text', 5, {
      markdown:
        'This is the rule physics leans on hardest, because almost nothing in physics is a bare $ x $. You get $ \\sin(\\omega t) $, $ e^{-\\lambda t} $, $ (2t + 3)^4 $ — always a function wrapped around another function.\n\n' +
        'The rule is:\n\n' +
        '$ \\dfrac{dy}{dx} = \\dfrac{dy}{du} \\times \\dfrac{du}{dx} $\n\n' +
        'In plain words: **differentiate the outside, keep the inside untouched, then multiply by the derivative of the inside.**\n\n' +
        'That last multiplication is the step students forget. It is worth saying to yourself every single time: *"...times the derivative of the inside."*',
    }),
    b('step_solver', 6, {
      title: 'Peeling the layers',
      problem: 'Differentiate $ y = (6x + 7)^4 $.',
      intro: 'You could expand this out. It would take ten minutes and you would make a mistake. Use the chain rule instead.',
      steps: [
        st(
          '$ u = 6x + 7, \\qquad y = u^4 $',
          'Name the inside function. Everything gets easier once it has a name.',
          'The "inside" is whatever sits in the bracket. The "outside" is what is being done to that bracket — here, raising it to the fourth power.',
          {
            kind: 'mcq',
            prompt: 'Which part is the INSIDE function here?',
            options: ['$ x^4 $', '$ 6x + 7 $', '$ 4 $', '$ (6x+7)^4 $'],
            answer_index: 1,
            feedback_right: 'Yes — the bracket is the inside.',
            feedback_wrong: 'The inside function is whatever the outer operation is being applied to. Here the fourth power is applied to the bracket.',
          },
        ),
        st(
          '$ \\dfrac{dy}{du} = 4u^3 $',
          'Differentiate the outside, leaving the inside completely alone.',
          'At this stage $ u $ is treated exactly like a single letter. Do not substitute yet.',
        ),
        st(
          '$ \\dfrac{du}{dx} = 6 $',
          'Now differentiate the inside on its own.',
          '$ 6x + 7 $ differentiates to 6. This is the factor that is so easy to leave out.',
          {
            kind: 'fill_blank',
            prompt: 'The derivative of the inside, $ 6x + 7 $, is ____',
            blank_answer: '6',
            feedback_right: 'Correct — and this 6 must appear in the final answer.',
            feedback_wrong: '$ 6x $ differentiates to 6, and the constant 7 differentiates to 0.',
          },
        ),
        st(
          '$ \\dfrac{dy}{dx} = 4u^3 \\times 6 = 24(6x + 7)^3 $',
          'Multiply the two and substitute the bracket back in.',
          'Sanity check: the answer should still contain the original bracket, one power lower. It does.',
        ),
      ],
      now_you_try: {
        problem: 'Differentiate $ y = \\sin(3x^2) $.',
        answer: '$ \\dfrac{dy}{dx} = 6x\\cos(3x^2) $',
        solution:
          'Inside: $ u = 3x^2 $. Outside: $ \\sin u $.\n\n' +
          '$ \\dfrac{dy}{du} = \\cos u = \\cos(3x^2) $\n\n' +
          '$ \\dfrac{du}{dx} = 6x $\n\n' +
          '$ \\dfrac{dy}{dx} = \\cos(3x^2) \\times 6x = 6x\\cos(3x^2) $\n\n' +
          'Note that the inside stays exactly as it was inside the cosine. Only the extra $ 6x $ appears outside.',
      },
    }),
    b('worked_example', 7, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Differentiate $ y = \\dfrac{1 + x}{e^x} $.',
      solution:
        'Rewrite it as a product first — much cleaner than the quotient rule.\n\n' +
        '$ y = (1 + x)e^{-x} $\n\n' +
        'Let $ u = 1 + x $ and $ v = e^{-x} $.\n\n' +
        '$ \\dfrac{du}{dx} = 1 $\n\n' +
        'For $ v $, the chain rule applies: the outside is $ e^{\\text{something}} $, the inside is $ -x $, whose derivative is $ -1 $.\n\n' +
        '$ \\dfrac{dv}{dx} = e^{-x} \\times (-1) = -e^{-x} $\n\n' +
        'Now the product rule:\n\n' +
        '$ \\dfrac{dy}{dx} = (1 + x)\\left(-e^{-x}\\right) + e^{-x}(1) $\n\n' +
        '$ = e^{-x}\\left(-1 - x + 1\\right) = -x\\,e^{-x} $\n\n' +
        'A pleasingly small answer from a messy-looking start — which is exactly why it was worth rewriting the fraction first.',
    }),
    b('worked_example', 8, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A particle oscillates with $ x = A\\sin(\\omega t) $, where $ A $ and $ \\omega $ are constants. Find its velocity and acceleration.',
      solution:
        'Velocity is $ \\dfrac{dx}{dt} $. The inside function is $ \\omega t $, whose derivative is $ \\omega $.\n\n' +
        '$ v = \\dfrac{dx}{dt} = A\\cos(\\omega t) \\times \\omega = A\\omega\\cos(\\omega t) $\n\n' +
        'Acceleration is $ \\dfrac{dv}{dt} $ — differentiate again, chain rule again, and remember cosine gives **minus** sine:\n\n' +
        '$ a = -A\\omega\\sin(\\omega t) \\times \\omega = -A\\omega^2\\sin(\\omega t) $\n\n' +
        'Now look at what has appeared. Since $ x = A\\sin(\\omega t) $, this says:\n\n' +
        '$ a = -\\omega^2 x $\n\n' +
        'That is the defining equation of simple harmonic motion, and you have just derived it with nothing but the chain rule. Every $ \\omega $ in it came from differentiating the inside.',
    }),
    b('inline_quiz', 9, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\dfrac{d}{dx}\\left((3x + 1)^5\\right) $ equals:',
          ['$ 15(3x+1)^4 $', '$ 5(3x+1)^4 $', '$ 5(3x+1)^6 $', '$ 15(3x+1)^5 $'],
          0,
          'Outside gives $ 5(3x+1)^4 $; the inside $ 3x+1 $ gives 3. Multiply: $ 15(3x+1)^4 $. Missing the 3 gives the second option.',
          2),
        q('$ \\dfrac{d}{dt}\\left(e^{-2t}\\right) $ equals:',
          ['$ e^{-2t} $', '$ -2e^{-2t} $', '$ -2t\\,e^{-2t} $', '$ 2e^{-2t} $'],
          1,
          'The exponential differentiates to itself, then multiply by the derivative of the inside, which is $ -2 $.',
          2),
        q('For $ y = \\dfrac{u}{v} $, the numerator of $ \\dfrac{dy}{dx} $ is:',
          ['$ u\\dfrac{dv}{dx} - v\\dfrac{du}{dx} $', '$ u\\dfrac{dv}{dx} + v\\dfrac{du}{dx} $', '$ v\\dfrac{du}{dx} - u\\dfrac{dv}{dx} $', '$ \\dfrac{du}{dx} - \\dfrac{dv}{dx} $'],
          2,
          'Bottom times derivative of top comes **first**, then subtract top times derivative of bottom. Reversing them flips the sign of the whole answer.',
          3),
      ],
    }),
    b('text', 10, {
      markdown: 'You now have all four rules. Next: what they actually mean in physics.',
    }),
  ],
};

// ═══ 17 ── Derivative as a Rate of Change ════════════════════════════════════
const page17 = {
  page_number: 17,
  slug: 'derivative-as-rate-of-change',
  title: 'The Derivative as a Rate of Change',
  subtitle: 'Six formulas you already half-know',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A set of physical gauges — speedometer, force meter, current meter — all reading rates of change.',
      generation_prompt: heroPrompt(
        'A row of glowing circular gauges on a dark instrument panel, needles at different positions, connected by faint lines to suggest they all measure the same kind of quantity.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Here is the payoff. Every one of these definitions in physics is a derivative — and most of them you already met without the notation.',
    }),
    b('table', 2, {
      caption: 'Whenever a physics definition contains the words "rate of", it is a derivative.',
      headers: ['Quantity', 'Definition', 'In words'],
      rows: [
        ['Velocity', '$ v = \\dfrac{dx}{dt} $', 'Rate of change of position'],
        ['Acceleration', '$ a = \\dfrac{dv}{dt} $', 'Rate of change of velocity'],
        ['Force', '$ F = \\dfrac{dp}{dt} $', 'Rate of change of momentum'],
        ['Power', '$ P = \\dfrac{dW}{dt} $', 'Rate of doing work'],
        ['Current', '$ I = \\dfrac{dq}{dt} $', 'Rate of flow of charge'],
        ['Angular velocity', '$ \\omega = \\dfrac{d\\theta}{dt} $', 'Rate of change of angle'],
      ],
    }),
    b('callout', 3, {
      variant: 'remember',
      title: 'The reading trick',
      markdown:
        'If a definition anywhere in physics uses the words **"rate of"**, it is a derivative with respect to time.\n\n' +
        'This works in reverse too, and that is where it earns its keep: when a question says *"the rate at which the temperature falls"*, you can immediately write $ \\dfrac{dT}{dt} $ and start doing algebra with it.',
    }),
    b('heading', 4, {
      text: 'Differentiating twice',
      level: 2,
      objective: 'Use the second derivative to get acceleration directly from position.',
    }),
    b('text', 5, {
      markdown:
        'Acceleration is the rate of change of velocity, and velocity is itself the rate of change of position. So acceleration is what you get by differentiating position **twice**:\n\n' +
        '$ a = \\dfrac{dv}{dt} = \\dfrac{d}{dt}\\left(\\dfrac{dx}{dt}\\right) = \\dfrac{d^2x}{dt^2} $\n\n' +
        'That symbol $ \\dfrac{d^2x}{dt^2} $ is called the **second derivative**. It is not a new operation — just differentiation done twice in a row.\n\n' +
        'It also has a graphical meaning that becomes important in the next page: the second derivative tells you whether a curve is bending **upward** (positive) or **downward** (negative).',
    }),
    b('worked_example', 6, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A particle moves so that $ x = 2t^3 - 5t^2 + 4t $ metres. Find its velocity and acceleration at $ t = 2 $ s.',
      solution:
        'Differentiate once for velocity.\n\n' +
        '$ v = \\dfrac{dx}{dt} = 6t^2 - 10t + 4 $\n\n' +
        'At $ t = 2 $: $ v = 6(4) - 10(2) + 4 = 24 - 20 + 4 = 8\\ \\mathrm{m/s} $\n\n' +
        'Differentiate again for acceleration.\n\n' +
        '$ a = \\dfrac{dv}{dt} = 12t - 10 $\n\n' +
        'At $ t = 2 $: $ a = 24 - 10 = 14\\ \\mathrm{m/s^2} $\n\n' +
        'Both are positive, so at this instant the particle is moving forward and speeding up.\n\n' +
        'Watch-out: substitute the value of $ t $ **only after** differentiating. Putting $ t = 2 $ into $ x $ first would give a single number, and the derivative of a number is zero.',
    }),
    b('worked_example', 7, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'The charge flowing through a wire is $ q = 3t^2 + 2t $ coulombs. Find the current at $ t = 3 $ s.',
      solution:
        'Current is the rate of flow of charge, so it is a derivative.\n\n' +
        '$ I = \\dfrac{dq}{dt} = 6t + 2 $\n\n' +
        'At $ t = 3 $: $ I = 18 + 2 = 20\\ \\mathrm{A} $\n\n' +
        'Notice what this is not. The *average* current over the first 3 seconds would be $ \\dfrac{q}{t} = \\dfrac{27 + 6}{3} = 11 $ A — a completely different number, and not what was asked for.\n\n' +
        'That distinction between $ \\dfrac{q}{t} $ and $ \\dfrac{dq}{dt} $ is exactly the average-versus-instantaneous idea from the start of this unit.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('If $ x = 4t^2 $, the velocity at $ t = 3 $ s is:',
          ['$ 12 $ m/s', '$ 36 $ m/s', '$ 24 $ m/s', '$ 8 $ m/s'],
          2,
          '$ v = \\dfrac{dx}{dt} = 8t $, so at $ t = 3 $, $ v = 24 $ m/s. Substituting $ t = 3 $ into $ x $ first would give 36, which is the position, not the velocity.',
          2),
        q('Force is defined as the rate of change of:',
          ['Position', 'Momentum', 'Energy', 'Velocity'],
          1,
          '$ F = \\dfrac{dp}{dt} $. Rate of change of velocity is acceleration, and rate of change of energy is power.',
          1),
        q('For $ x = t^3 $, the acceleration is:',
          ['$ 3t^2 $', '$ t^2 $', '$ 3t $', '$ 6t $'],
          3,
          'Differentiate twice: $ v = 3t^2 $, then $ a = 6t $. The first option is the velocity, not the acceleration.',
          2),
      ],
    }),
    b('text', 9, {
      markdown: 'Next: using the derivative to find where a quantity is largest or smallest.',
    }),
  ],
};

// ═══ 18 ── Maxima and Minima ═════════════════════════════════════════════════
const page18 = {
  page_number: 18,
  slug: 'maxima-and-minima',
  title: 'Maxima and Minima',
  subtitle: 'Finding the top of the hill',
  glossary: [
    { term: 'turning point', definition: 'A point where a curve stops rising and starts falling, or vice versa. Its tangent is horizontal.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A curve with a peak and a valley, each marked with a horizontal tangent line.',
      generation_prompt: heroPrompt(
        'A glowing wavy curve on a dark grid with one clear peak and one clear valley. A short horizontal bright line touches the curve at each of those two points.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Physics asks this constantly. At what angle is the range greatest? At what separation is the potential energy lowest? What is the maximum height?\n\n' +
        'Every one of those questions has the same shape, and one method answers all of them.',
    }),
    b('text', 2, {
      markdown:
        'At the very top of a hill, you are momentarily going neither up nor down. At the bottom of a valley, the same. So at a maximum or a minimum, the curve is instantaneously **flat** — the tangent is horizontal, and therefore:\n\n' +
        '$ \\dfrac{dy}{dx} = 0 $\n\n' +
        'That equation locates the turning points. Solving it gives you the $ x $ values where something interesting happens.\n\n' +
        'But it does not tell you **which kind** of turning point you found. For that, differentiate once more:\n\n' +
        '- $ \\dfrac{d^2y}{dx^2} < 0 $ → the curve bends downward → **maximum**\n' +
        '- $ \\dfrac{d^2y}{dx^2} > 0 $ → the curve bends upward → **minimum**\n\n' +
        'A way to remember which is which: a **min**imum holds water, like a cup — it bends upward, so the second derivative is positive.',
    }),
    b('math_graph', 3, {
      title: 'Where is the tangent flat?',
      archetype: 'tangent-explorer',
      archetype_params: { base: 'cube' },
      caption: 'Drag P along y = x³. Notice the tangent flattens at the origin — yet this is neither a maximum nor a minimum. Some flat points are just pauses.',
      predict: {
        prompt: 'At $ x = 0 $ on $ y = x^3 $ the tangent is horizontal. What kind of point is it?',
        options: ['A maximum', 'A minimum', 'Neither — the curve keeps rising through it', 'The curve is undefined there'],
        answer_index: 2,
        reveal: 'It is a point of inflection. The curve pauses but does not turn around. This is exactly why the second-derivative test matters — here $ \\dfrac{d^2y}{dx^2} = 6x = 0 $ at the origin, so the test is inconclusive and you must look at the curve itself.',
      },
    }),
    b('callout', 4, {
      variant: 'exam_tip',
      title: 'The three-step method',
      markdown:
        'Every maximum-minimum question, without exception:\n\n' +
        '1. **Differentiate** and set $ \\dfrac{dy}{dx} = 0 $.\n' +
        '2. **Solve** for $ x $ — often a quadratic, which is why Unit A came first.\n' +
        '3. **Test** with the second derivative to say which is which.\n\n' +
        'Then substitute back into the **original** equation to get the actual maximum or minimum value. Forgetting that last substitution — reporting the $ x $ instead of the $ y $ — is the most common way marks are lost here.',
    }),
    b('worked_example', 5, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find the maximum or minimum value of $ y = 4x^2 - 4x + 7 $.',
      solution:
        '**Step 1 — differentiate and set to zero.**\n\n' +
        '$ \\dfrac{dy}{dx} = 8x - 4 = 0 \\;\\Rightarrow\\; x = \\dfrac{1}{2} $\n\n' +
        '**Step 2 — test it.**\n\n' +
        '$ \\dfrac{d^2y}{dx^2} = 8 $, which is positive, so this is a **minimum**.\n\n' +
        '**Step 3 — substitute back into the original.**\n\n' +
        '$ y = 4\\left(\\dfrac{1}{4}\\right) - 4\\left(\\dfrac{1}{2}\\right) + 7 = 1 - 2 + 7 = 6 $\n\n' +
        '**Minimum value: $ y = 6 $, at $ x = \\tfrac{1}{2} $.**\n\n' +
        'Sense check: the coefficient of $ x^2 $ is positive, so this parabola opens upward and must have a minimum, not a maximum. That agrees.',
    }),
    b('worked_example', 6, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find the maxima and minima of $ y = x^3 - 6x^2 + 9x + 15 $.',
      solution:
        '**Step 1.**\n\n' +
        '$ \\dfrac{dy}{dx} = 3x^2 - 12x + 9 = 0 $\n\n' +
        'Divide by 3 and factorise:\n\n' +
        '$ x^2 - 4x + 3 = 0 \\;\\Rightarrow\\; (x-1)(x-3) = 0 \\;\\Rightarrow\\; x = 1 \\text{ or } 3 $\n\n' +
        '**Step 2 — test each one.**\n\n' +
        '$ \\dfrac{d^2y}{dx^2} = 6x - 12 $\n\n' +
        'At $ x = 1 $: $ 6 - 12 = -6 $, negative → **maximum**.\n\n' +
        'At $ x = 3 $: $ 18 - 12 = +6 $, positive → **minimum**.\n\n' +
        '**Step 3 — get the values.**\n\n' +
        'At $ x = 1 $: $ y = 1 - 6 + 9 + 15 = 19 $\n\n' +
        'At $ x = 3 $: $ y = 27 - 54 + 27 + 15 = 15 $\n\n' +
        '**Maximum 19 at $ x = 1 $; minimum 15 at $ x = 3 $.**\n\n' +
        'Notice the oddity: the "maximum" (19) is *higher* than the "minimum" (15), but neither is the largest or smallest value the function ever takes — as $ x $ grows, $ x^3 $ runs away to infinity. These are **local** turning points, which is all the second-derivative test can ever find.',
    }),
    b('worked_example', 7, {
      label: 'Example 3',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A projectile launched at speed $ u $ and angle $ \\theta $ has range $ R = \\dfrac{u^2\\sin 2\\theta}{g} $. Show that the range is greatest at $ \\theta = 45° $.',
      solution:
        'Treat $ u $ and $ g $ as constants and differentiate with respect to $ \\theta $. The chain rule applies, because the inside function is $ 2\\theta $.\n\n' +
        '$ \\dfrac{dR}{d\\theta} = \\dfrac{u^2}{g}\\cos(2\\theta) \\times 2 = \\dfrac{2u^2}{g}\\cos 2\\theta $\n\n' +
        'Set it to zero:\n\n' +
        '$ \\cos 2\\theta = 0 \\;\\Rightarrow\\; 2\\theta = 90° \\;\\Rightarrow\\; \\theta = 45° $\n\n' +
        'Confirm it is a maximum:\n\n' +
        '$ \\dfrac{d^2R}{d\\theta^2} = -\\dfrac{4u^2}{g}\\sin 2\\theta $\n\n' +
        'At $ \\theta = 45° $, $ \\sin 90° = 1 $, so the second derivative is negative — a **maximum**, as required.\n\n' +
        'The maximum range itself is $ R_{\\max} = \\dfrac{u^2}{g} $. This is the standard result you will meet in Motion in a Plane; it is worth having seen where it comes from.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('At a turning point of a curve:',
          ['$ \\dfrac{dy}{dx} = 0 $', '$ y = 0 $', '$ \\dfrac{d^2y}{dx^2} = 0 $', '$ x = 0 $'],
          0,
          'The tangent is horizontal at a turning point, so the first derivative is zero. The second derivative then tells you whether it is a max or a min.',
          1),
        q('If $ \\dfrac{dy}{dx} = 0 $ and $ \\dfrac{d^2y}{dx^2} > 0 $ at some point, that point is a:',
          ['Maximum', 'Point of inflection', 'Minimum', 'Discontinuity'],
          2,
          'A positive second derivative means the curve bends upward like a cup — a minimum.',
          2),
        q('The maximum value of $ y = 5 - (x-1)^2 $ is:',
          ['$ 5 $', '$ 1 $', '$ 0 $', '$ 4 $'],
          0,
          'The squared term is never negative, so the most you can have is when it equals zero, at $ x = 1 $, giving $ y = 5 $. You can also get there by differentiating: $ \\dfrac{dy}{dx} = -2(x-1) = 0 $ at $ x = 1 $.',
          2),
      ],
    }),
    b('text', 9, {
      markdown: 'That completes differentiation. Now we run the whole machine backwards.',
    }),
  ],
};

// ═══ 19 ── Integration ═══════════════════════════════════════════════════════
const page19 = {
  page_number: 19,
  slug: 'integration-reversing-differentiation',
  title: 'Integration — Reversing Differentiation',
  subtitle: 'Given the rate, find the quantity',
  glossary: [
    { term: 'integration', definition: 'The reverse of differentiation: finding a function when you know its rate of change.' },
    { term: 'constant of integration', definition: 'The unknown constant that must be added to every indefinite integral, because differentiating a constant destroys it.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Two arrows forming a loop between a function and its derivative, one labelled forward and one backward.',
      generation_prompt: heroPrompt(
        'Two curved glowing arrows forming a closed loop between two abstract mathematical shapes on a dark grid — one arrow travelling clockwise, the other anticlockwise, suggesting a reversible process.'
      ),
    }),
    b('curiosity_prompt', 1, {
      prompt:
        'Differentiation turns position into velocity. Now suppose a question gives you the velocity at every instant and asks where the body is. Which direction are you travelling in now?',
      hint: 'You have the rate. You want the quantity.',
      reveal:
        'Backwards. And that reverse operation is called **integration**.\n\n' +
        'Kinematics needs both directions constantly: differentiate to go from position to velocity to acceleration, integrate to come back the other way.',
    }),
    b('text', 2, {
      markdown:
        'Integration undoes differentiation. If differentiating $ F(x) $ gives $ f(x) $, then integrating $ f(x) $ gives you back $ F(x) $:\n\n' +
        '$ \\int f(x)\\,dx = F(x) + C $\n\n' +
        'The $ \\int $ sign is a stretched letter S, and the $ dx $ on the end tells you which variable you are integrating with respect to. Do not leave it off — in physics problems with several variables floating around, it is the only thing saying what you are doing.',
    }),
    b('callout', 3, {
      variant: 'remember',
      title: 'Where the $ + C $ comes from',
      markdown:
        'Differentiate $ x^2 $, $ x^2 + 5 $, and $ x^2 - 100 $. Every one gives $ 2x $.\n\n' +
        'So when you integrate $ 2x $ and try to get back, you cannot possibly know which constant was there. It could have been anything. So you write $ + C $ and admit it.\n\n' +
        'In physics $ C $ is never really unknown — it is fixed by the **initial conditions**. The velocity at $ t = 0 $, the position at the start. That is what those numbers in a question are for.',
    }),
    b('heading', 4, {
      text: 'The standard integrals',
      level: 2,
      objective: 'Integrate powers, trigonometric functions and exponentials by reversing the derivative table.',
    }),
    b('text', 5, {
      markdown:
        'You do not need a new table. Read the derivative table backwards.\n\n' +
        'The power rule reverses like this:\n\n' +
        '$ \\int x^n\\,dx = \\dfrac{x^{\\,n+1}}{n+1} + C \\qquad (n \\neq -1) $\n\n' +
        'In words: **raise the power by one, then divide by the new power.** Exactly the opposite of differentiating.\n\n' +
        'The exception $ n = -1 $ exists because raising $ -1 $ by one gives zero, and you cannot divide by zero. That case has its own answer, $ \\ln x $ — which makes sense, since $ \\ln x $ is what differentiates to $ \\dfrac{1}{x} $.',
    }),
    b('table', 6, {
      caption: 'The standard integrals — every one is a row of the derivative table, read right to left.',
      headers: ['$ f(x) $', '$ \\int f(x)\\,dx $', 'Because differentiating the right-hand side gives...'],
      rows: [
        ['$ x^n $', '$ \\dfrac{x^{\\,n+1}}{n+1} + C $', '$ x^n $ — the power rule reversed'],
        ['$ k $ (a constant)', '$ kx + C $', '$ k $'],
        ['$ \\dfrac{1}{x} $', '$ \\ln|x| + C $', '$ \\dfrac{1}{x} $'],
        ['$ \\sin x $', '$ -\\cos x + C $', '$ \\sin x $ — note the minus'],
        ['$ \\cos x $', '$ \\sin x + C $', '$ \\cos x $'],
        ['$ e^x $', '$ e^x + C $', '$ e^x $'],
        ['$ \\sec^2 x $', '$ \\tan x + C $', '$ \\sec^2 x $'],
      ],
    }),
    b('callout', 7, {
      variant: 'exam_tip',
      title: 'The minus signs swap places',
      markdown:
        'Differentiating: $ \\cos x $ picks up the minus.\n\n' +
        'Integrating: $ \\sin x $ picks up the minus.\n\n' +
        '$ \\int \\sin x\\,dx = -\\cos x + C $\n\n' +
        'If you are ever unsure, **differentiate your answer and see if you get back where you started.** That check takes five seconds and it is completely reliable. Integration is the only topic in mathematics where you can always mark your own work.',
    }),
    b('worked_example', 8, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find $ \\int \\left(3x^2 + \\dfrac{1}{x^2}\\right)dx $.',
      solution:
        'Deal with the terms one at a time, and rewrite the fraction as a power first.\n\n' +
        '$ \\int 3x^2\\,dx = 3 \\times \\dfrac{x^3}{3} = x^3 $\n\n' +
        'For the second term, $ \\dfrac{1}{x^2} = x^{-2} $. Raise the power by one: $ -2 + 1 = -1 $. Divide by the new power:\n\n' +
        '$ \\int x^{-2}\\,dx = \\dfrac{x^{-1}}{-1} = -\\dfrac{1}{x} $\n\n' +
        'Put them together with the constant:\n\n' +
        '$ \\int\\left(3x^2 + \\dfrac{1}{x^2}\\right)dx = x^3 - \\dfrac{1}{x} + C $\n\n' +
        'Check by differentiating: $ 3x^2 + \\dfrac{1}{x^2} $. It matches.',
    }),
    b('worked_example', 9, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A body starts from rest and has acceleration $ a = 6t $ m/s². Find its velocity as a function of time.',
      solution:
        'Acceleration is $ \\dfrac{dv}{dt} $, so velocity comes from integrating acceleration.\n\n' +
        '$ v = \\int 6t\\,dt = 6 \\times \\dfrac{t^2}{2} + C = 3t^2 + C $\n\n' +
        'Now use the initial condition to pin down $ C $. "Starts from rest" means $ v = 0 $ when $ t = 0 $:\n\n' +
        '$ 0 = 3(0)^2 + C \\;\\Rightarrow\\; C = 0 $\n\n' +
        '$ v = 3t^2 $ m/s\n\n' +
        'This is why questions bother to tell you things like "starts from rest" or "initially at the origin". Those phrases are not decoration — each one is there to fix a constant of integration.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\int x^3\\,dx $ equals:',
          ['$ 3x^2 + C $', '$ \\dfrac{x^4}{4} + C $', '$ \\dfrac{x^2}{2} + C $', '$ x^4 + C $'],
          1,
          'Raise the power to 4, divide by 4. The first option is the derivative, not the integral.',
          1),
        q('$ \\int \\sin x\\,dx $ equals:',
          ['$ \\cos x + C $', '$ \\sin x + C $', '$ -\\sin x + C $', '$ -\\cos x + C $'],
          3,
          'Integrating sine gives **minus** cosine. Check by differentiating $ -\\cos x $: you get $ +\\sin x $. Correct.',
          2),
        q('Why does an indefinite integral always need $ + C $?',
          ['Because differentiating any constant gives zero, so the original constant is unrecoverable', 'To make the answer look complete', 'Because integration is approximate', 'To account for units'],
          0,
          'Every function differing only by a constant has the same derivative, so integrating cannot tell you which one you started from. The initial conditions supply it.',
          2),
      ],
    }),
    b('text', 11, {
      markdown: 'Next: the two rules that handle anything more complicated than a bare power.',
    }),
  ],
};

// ═══ 20 ── Integration Rules ═════════════════════════════════════════════════
const page20 = {
  page_number: 20,
  slug: 'integration-rules',
  title: 'Integration Rules',
  subtitle: 'Constants, sums, and the substitution trick',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A tangled expression being untangled into a simple one by a substitution.',
      generation_prompt: heroPrompt(
        'A knotted glowing line on the left gradually straightening into a clean smooth line on the right across a dark grid, suggesting simplification.'
      ),
    }),
    b('text', 1, {
      markdown:
        'The first two rules are the same as for differentiation, and need no comment:\n\n' +
        '$ \\int k\\,f(x)\\,dx = k\\int f(x)\\,dx $ — constants come outside\n\n' +
        '$ \\int\\left(u + v\\right)dx = \\int u\\,dx + \\int v\\,dx $ — integrate term by term\n\n' +
        'The third rule is the one worth learning properly.',
    }),
    b('heading', 2, {
      text: 'Substitution — the chain rule backwards',
      level: 2,
      objective: 'Integrate a function of a linear expression using a substitution.',
    }),
    b('text', 3, {
      markdown:
        'The chain rule made an extra factor appear when you differentiated something like $ \\sin(3x) $. Going backwards, that factor has to be **divided out** instead.\n\n' +
        'For the case physics needs almost all the time — a function of $ (ax + b) $ — the rule collapses to something you can apply in one line:\n\n' +
        '$ \\int f(ax + b)\\,dx = \\dfrac{1}{a}F(ax + b) + C $\n\n' +
        'In words: **integrate as if the bracket were a single letter, then divide by the derivative of the bracket.**\n\n' +
        'So $ \\int \\cos(5x)\\,dx = \\dfrac{1}{5}\\sin(5x) + C $. The 5 goes underneath, because differentiating would have put it on top.',
    }),
    b('step_solver', 4, {
      title: 'Substitution, step by step',
      problem: 'Find $ \\int (2x + 3)^4\\,dx $.',
      intro: 'Expanding the bracket would take five lines. Substituting takes two.',
      steps: [
        st(
          '$ u = 2x + 3 $',
          'Let the bracket be $ u $.',
          'Choosing the bracket as $ u $ is almost always right when the integrand is "something raised to a power".',
          {
            kind: 'pick_op',
            prompt: 'What should we substitute for $ u $?',
            options: ['$ u = x $', '$ u = 2x + 3 $', '$ u = (2x+3)^4 $'],
            answer_index: 1,
            feedback_right: 'Yes — the inside of the bracket.',
            feedback_wrong: 'Pick the *inside* of the bracket, not the whole expression. The aim is to turn this into a plain power of $ u $.',
          },
        ),
        st(
          '$ \\dfrac{du}{dx} = 2 \\;\\Rightarrow\\; dx = \\dfrac{du}{2} $',
          'Differentiate the substitution and rearrange for $ dx $.',
          'Every $ x $ in the integral — including the $ dx $ — has to be replaced. This line is how the $ dx $ gets converted.',
        ),
        st(
          '$ \\int u^4 \\cdot \\dfrac{du}{2} = \\dfrac{1}{2}\\int u^4\\,du $',
          'Substitute everything and pull the constant outside.',
          'The integral is now a bare power of $ u $ — which is the whole point of the substitution.',
        ),
        st(
          '$ = \\dfrac{1}{2} \\cdot \\dfrac{u^5}{5} = \\dfrac{u^5}{10} $',
          'Apply the power rule: raise by one, divide by the new power.',
          '$ \\dfrac{1}{2} \\times \\dfrac{1}{5} = \\dfrac{1}{10} $.',
        ),
        st(
          '$ \\int(2x+3)^4\\,dx = \\dfrac{(2x+3)^5}{10} + C $',
          'Substitute back — the answer must be in terms of $ x $, not $ u $.',
          'Never leave $ u $ in a final answer. Check by differentiating: $ \\dfrac{5(2x+3)^4 \\times 2}{10} = (2x+3)^4 $. Correct.',
          {
            kind: 'mcq',
            prompt: 'How do we check this answer is right?',
            options: ['Substitute $ x = 1 $ and see if it is positive', 'Differentiate it and see whether we get back $ (2x+3)^4 $', 'Integrate it a second time'],
            answer_index: 1,
            feedback_right: 'Exactly — and this check always works, for every integral.',
            feedback_wrong: 'Integration and differentiation are inverses, so differentiating your answer must return the original integrand.',
          },
        ),
      ],
      now_you_try: {
        problem: 'Find $ \\int e^{4x}\\,dx $.',
        answer: '$ \\dfrac{e^{4x}}{4} + C $',
        solution:
          'The bracket here is $ 4x $, whose derivative is 4.\n\n' +
          'Integrate as if it were a plain $ e^u $, then divide by 4:\n\n' +
          '$ \\int e^{4x}\\,dx = \\dfrac{e^{4x}}{4} + C $\n\n' +
          'Check: differentiating $ \\dfrac{e^{4x}}{4} $ gives $ \\dfrac{4e^{4x}}{4} = e^{4x} $. Correct.',
      },
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'Divide, do not multiply',
      markdown:
        'The single most common error in this whole topic is multiplying by the inside derivative instead of dividing by it.\n\n' +
        '$ \\int\\cos(3x)\\,dx = \\dfrac{\\sin 3x}{3} + C $, **not** $ 3\\sin 3x + C $.\n\n' +
        'Differentiation multiplies. Integration divides. They are opposites, so of course the factor goes the other way — and the differentiate-to-check habit catches it every time.',
    }),
    b('inline_quiz', 6, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\int \\cos(2x)\\,dx $ equals:',
          ['$ 2\\sin 2x + C $', '$ \\dfrac{\\sin 2x}{2} + C $', '$ -\\dfrac{\\sin 2x}{2} + C $', '$ \\sin 2x + C $'],
          1,
          'Integrate the cosine to a sine, then **divide** by the derivative of the inside, which is 2.',
          2),
        q('$ \\int (3x - 1)^2\\,dx $ equals:',
          ['$ \\dfrac{(3x-1)^3}{3} + C $', '$ 3(3x-1)^3 + C $', '$ \\dfrac{(3x-1)^3}{9} + C $', '$ \\dfrac{(3x-1)^3}{6} + C $'],
          2,
          'Raise the power to 3 and divide by 3, then divide again by the inside derivative 3. Together that is a division by 9.',
          3),
        q('$ \\int e^{-t}\\,dt $ equals:',
          ['$ -e^{-t} + C $', '$ e^{-t} + C $', '$ \\dfrac{e^{-t}}{t} + C $', '$ te^{-t} + C $'],
          0,
          'The inside is $ -t $, whose derivative is $ -1 $. Dividing by $ -1 $ flips the sign: $ -e^{-t} + C $.',
          2),
      ],
    }),
    b('text', 7, {
      markdown: 'Next: putting numbers on the integral, and discovering that it measures an area.',
    }),
  ],
};

// ═══ 21 ── Definite Integration ══════════════════════════════════════════════
const page21 = {
  page_number: 21,
  slug: 'definite-integration-and-area',
  title: 'Definite Integration and Area',
  subtitle: 'The integral is the area under the graph',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A shaded region under a curve between two vertical boundary lines.',
      generation_prompt: heroPrompt(
        'A glowing curve on a dark grid with the region beneath it, between two vertical boundary lines, filled with a soft amber glow. Thin vertical strips are faintly visible inside the shaded area.'
      ),
    }),
    b('text', 1, {
      markdown:
        'So far every integral has ended with $ + C $ and given a function. Put **limits** on it and you get a number instead:\n\n' +
        '$ \\int_a^b f(x)\\,dx = \\Big[F(x)\\Big]_a^b = F(b) - F(a) $\n\n' +
        'The method is simple: integrate as usual, put the top limit in, put the bottom limit in, subtract.\n\n' +
        'And the constant disappears. If you carried $ C $ through, it would appear in both terms and cancel when you subtract — so with limits, you never write it at all.',
    }),
    b('heading', 2, {
      text: 'What the number means',
      level: 2,
      objective: 'Interpret a definite integral as the area between the curve and the x-axis.',
    }),
    b('text', 3, {
      markdown:
        'Picture the region under a curve chopped into very thin vertical strips. Each strip is almost a rectangle: height $ f(x) $, width $ dx $, so area $ f(x)\\,dx $.\n\n' +
        'Add up every strip from $ a $ to $ b $ and you have the whole area. That summing-up is exactly what the $ \\int $ sign means — it is a stretched S for "sum".\n\n' +
        '$ \\text{Area} = \\int_a^b f(x)\\,dx $\n\n' +
        'Drag the ends of the interval on the board below and watch the shaded area change.',
    }),
    b('math_graph', 4, {
      title: 'Area under a curve',
      archetype: 'area-under-curve',
      archetype_params: { base: 'square' },
      caption: 'The shaded region is what a definite integral measures. Drag the interval ends and watch it grow.',
      predict: {
        prompt: 'If the curve dips below the x-axis over part of the interval, what happens to the integral?',
        options: ['It stays positive', 'That part contributes a negative amount', 'The integral becomes undefined', 'It doubles'],
        answer_index: 1,
        reveal: 'Area below the axis counts as negative. This is exactly why $ \\int_0^{\\pi}\\cos x\\,dx = 0 $ — the positive first half and negative second half cancel out completely.',
      },
    }),
    b('callout', 5, {
      variant: 'remember',
      title: 'Why physics cares so much',
      markdown:
        'Because the area under a graph is a physical quantity every time:\n\n' +
        '- Area under a **velocity–time** graph = **displacement**\n' +
        '- Area under an **acceleration–time** graph = **change in velocity**\n' +
        '- Area under a **force–distance** graph = **work done**\n' +
        '- Area under a **power–time** graph = **energy delivered**\n\n' +
        'And notice the symmetry with the earlier list: **slope gives the rate, area gives the total.** Those two sentences cover most of what graphs do in Class 11.',
    }),
    b('worked_example', 6, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Evaluate (i) $ \\int_0^2 2t\\,dt $  (ii) $ \\int_{\\pi/6}^{\\pi/3}\\sin x\\,dx $  (iii) $ \\int_4^{10}\\dfrac{dx}{x} $  (iv) $ \\int_0^{\\pi}\\cos x\\,dx $.',
      solution:
        'Integrate first, then substitute the limits and subtract.\n\n' +
        '**(i)** $ \\int_0^2 2t\\,dt = \\Big[t^2\\Big]_0^2 = 4 - 0 = 4 $\n\n' +
        '**(ii)** $ \\int_{\\pi/6}^{\\pi/3}\\sin x\\,dx = \\Big[-\\cos x\\Big]_{\\pi/6}^{\\pi/3} $\n\n' +
        '$ = -\\cos\\dfrac{\\pi}{3} + \\cos\\dfrac{\\pi}{6} = -\\dfrac{1}{2} + \\dfrac{\\sqrt{3}}{2} = \\dfrac{\\sqrt{3} - 1}{2} \\approx 0.37 $\n\n' +
        '**(iii)** $ \\int_4^{10}\\dfrac{dx}{x} = \\Big[\\ln x\\Big]_4^{10} = \\ln 10 - \\ln 4 = \\ln\\dfrac{10}{4} = \\ln 2.5 \\approx 0.92 $\n\n' +
        '**(iv)** $ \\int_0^{\\pi}\\cos x\\,dx = \\Big[\\sin x\\Big]_0^{\\pi} = \\sin\\pi - \\sin 0 = 0 - 0 = 0 $\n\n' +
        'That last answer of zero is not a mistake. The cosine curve is above the axis from 0 to $ \\pi/2 $ and below it from $ \\pi/2 $ to $ \\pi $, by exactly the same amount. The two areas cancel.',
    }),
    b('worked_example', 7, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A body moves with velocity $ v = 3t^2 + 2 $ m/s. Find its displacement between $ t = 1 $ s and $ t = 3 $ s.',
      solution:
        'Displacement is the area under the velocity–time graph, which is the definite integral of $ v $.\n\n' +
        '$ s = \\int_1^3 \\left(3t^2 + 2\\right)dt $\n\n' +
        'Integrate term by term:\n\n' +
        '$ = \\Big[t^3 + 2t\\Big]_1^3 $\n\n' +
        'Substitute the top limit, then the bottom, then subtract:\n\n' +
        '$ = \\left(27 + 6\\right) - \\left(1 + 2\\right) = 33 - 3 = 30\\ \\mathrm{m} $\n\n' +
        'Watch-out: this is the displacement **between** those two times, not from the start. Students routinely lose the mark by substituting only the upper limit and forgetting to subtract the lower one.',
    }),
    b('inline_quiz', 8, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\int_1^3 2x\\,dx $ equals:',
          ['$ 9 $', '$ 6 $', '$ 8 $', '$ 4 $'],
          2,
          '$ \\Big[x^2\\Big]_1^3 = 9 - 1 = 8 $. Getting 9 means the lower limit was forgotten.',
          2),
        q('The area under a velocity–time graph represents:',
          ['Acceleration', 'Displacement', 'Force', 'Average speed'],
          1,
          'Area under velocity–time is displacement. Acceleration would be the **slope** of that same graph, not its area.',
          1),
        q('Why does a definite integral not need $ + C $?',
          ['Because the limits are numbers', 'Because $ C $ is always zero', 'Because the area is always positive', 'Because the constant cancels when you subtract $ F(a) $ from $ F(b) $'],
          3,
          'The constant appears in both $ F(b) $ and $ F(a) $, so it vanishes in the subtraction. Writing it would not be wrong, just pointless.',
          2),
      ],
    }),
    b('text', 9, {
      markdown: 'That is the whole calculus toolkit. Time to use it.',
    }),
  ],
};

// ═══ 22 ── Unit B Practice Arena ═════════════════════════════════════════════
const page22 = {
  page_number: 22,
  slug: 'unit-b-practice-arena',
  title: 'Unit B — Practice Arena',
  subtitle: 'Differentiation and integration, drilled',
  page_type: 'practice',
  blocks: [
    b('text', 0, {
      markdown:
        'Sections A to C drill one skill at a time. Section D mixes them and adds the physics context, which is how they will actually arrive.\n\n' +
        'For every integration answer, check it by differentiating. That habit will save you more marks than any other single thing in this unit.',
    }),
    b('practice_bank', 1, {
      title: 'Unit B drill',
      intro: 'Work in order. Do not skip the differentiate-to-check step.',
      sections: [
        {
          id: 'ub-diff',
          title: 'A · Differentiation — the four rules',
          blurb: 'Power, sum, product, quotient, chain. One at a time.',
          items: [
            pmcq('ub-df-01',
              '$ \\dfrac{d}{dx}\\left(x^4 + 3x^2 - 2x\\right) $ equals:',
              ['$ 4x^3 + 6x $', '$ 4x^3 + 3x - 2 $', '$ 4x^3 + 6x - 2 $', '$ x^3 + 6x - 2 $'],
              2,
              'Term by term: $ 4x^3 $, $ 6x $, and $ -2 $. Each term is handled independently.'),
            pmcq('ub-df-02',
              '$ \\dfrac{d}{dx}\\left((6x + 7)^4\\right) $ equals:',
              ['$ 4(6x+7)^3 $', '$ 24(6x+7)^3 $', '$ 24(6x+7)^4 $', '$ 6(6x+7)^3 $'],
              1,
              'Chain rule: $ 4(6x+7)^3 \\times 6 = 24(6x+7)^3 $. Dropping the inside derivative 6 gives the first option.'),
            pnum('ub-df-03',
              'Differentiate $ y = x^2\\cos x $.',
              '$ 2x\\cos x - x^2\\sin x $',
              'Product rule with $ u = x^2 $ and $ v = \\cos x $.\n\n' +
              '$ \\dfrac{du}{dx} = 2x $ and $ \\dfrac{dv}{dx} = -\\sin x $.\n\n' +
              '$ \\dfrac{dy}{dx} = x^2(-\\sin x) + \\cos x(2x) = 2x\\cos x - x^2\\sin x $\n\n' +
              'The minus comes from differentiating cosine, not from the product rule itself.'),
            pnum('ub-df-04',
              'Differentiate $ y = e^x x^5 $.',
              '$ e^x x^4(x + 5) $',
              'Product rule: $ \\dfrac{dy}{dx} = e^x(5x^4) + x^5(e^x) = e^x(5x^4 + x^5) $.\n\n' +
              'Factor out $ x^4 $: $ \\dfrac{dy}{dx} = e^x x^4(5 + x) $.'),
            pnum('ub-df-05',
              'Differentiate $ y = \\dfrac{1 + x}{e^x} $.',
              '$ -x\\,e^{-x} $',
              'Rewrite as a product: $ y = (1+x)e^{-x} $.\n\n' +
              '$ \\dfrac{dy}{dx} = (1+x)(-e^{-x}) + e^{-x}(1) = e^{-x}(-1 - x + 1) = -x e^{-x} $\n\n' +
              'The quotient rule gives the same answer with more work — always check whether the fraction can be turned into a product first.'),
          ],
        },
        {
          id: 'ub-int',
          title: 'B · Integration — standard forms and substitution',
          blurb: 'Every answer here can be checked by differentiating it.',
          items: [
            pmcq('ub-in-01',
              '$ \\int \\left(4x^3 - 2\\right)dx $ equals:',
              ['$ 12x^2 + C $', '$ x^4 - 2x + C $', '$ 4x^4 - 2x + C $', '$ x^4 - 2 + C $'],
              1,
              'Raise each power by one and divide: $ \\dfrac{4x^4}{4} = x^4 $, and $ \\int -2\\,dx = -2x $.'),
            pmcq('ub-in-02',
              '$ \\int \\sin(3x)\\,dx $ equals:',
              ['$ 3\\cos 3x + C $', '$ -3\\cos 3x + C $', '$ \\dfrac{\\cos 3x}{3} + C $', '$ -\\dfrac{\\cos 3x}{3} + C $'],
              3,
              'Sine integrates to minus cosine, then **divide** by the inside derivative 3.'),
            pnum('ub-in-03',
              'Evaluate $ \\int_0^2 2t\\,dt $.',
              '$ 4 $',
              '$ \\int 2t\\,dt = t^2 $, so\n\n' +
              '$ \\int_0^2 2t\\,dt = \\Big[t^2\\Big]_0^2 = 4 - 0 = 4 $'),
            pnum('ub-in-04',
              'Evaluate $ \\int_{\\pi/6}^{\\pi/3}\\sin x\\,dx $.',
              '$ \\dfrac{\\sqrt{3} - 1}{2} \\approx 0.37 $',
              '$ \\int\\sin x\\,dx = -\\cos x $, so\n\n' +
              '$ \\Big[-\\cos x\\Big]_{\\pi/6}^{\\pi/3} = -\\cos\\dfrac{\\pi}{3} - \\left(-\\cos\\dfrac{\\pi}{6}\\right) $\n\n' +
              '$ = -\\dfrac{1}{2} + \\dfrac{\\sqrt{3}}{2} = \\dfrac{\\sqrt{3}-1}{2} \\approx 0.37 $'),
            pnum('ub-in-05',
              'Evaluate $ \\int_4^{10}\\dfrac{dx}{x} $ and $ \\int_0^{\\pi}\\cos x\\,dx $.',
              '$ \\ln 2.5 \\approx 0.92 $, and $ 0 $',
              'For the first, $ \\int\\dfrac{dx}{x} = \\ln x $:\n\n' +
              '$ \\Big[\\ln x\\Big]_4^{10} = \\ln 10 - \\ln 4 = \\ln\\dfrac{10}{4} = \\ln 2.5 \\approx 0.92 $\n\n' +
              'For the second, $ \\int\\cos x\\,dx = \\sin x $:\n\n' +
              '$ \\Big[\\sin x\\Big]_0^{\\pi} = 0 - 0 = 0 $\n\n' +
              'The zero is genuine: equal areas above and below the axis cancel.'),
          ],
        },
        {
          id: 'ub-maxmin',
          title: 'C · Maxima and minima',
          blurb: 'Differentiate, set to zero, test with the second derivative, substitute back.',
          items: [
            pmcq('ub-mm-01',
              'The maximum value of $ y = 5 - (x - 1)^2 $ is:',
              ['$ 1 $', '$ 4 $', '$ 6 $', '$ 5 $'],
              3,
              'A square is never negative, so $ y $ is largest when $ (x-1)^2 = 0 $, at $ x = 1 $, giving $ y = 5 $.'),
            pnum('ub-mm-02',
              'Find the minimum value of $ y = 4x^2 - 4x + 7 $.',
              '$ y = 6 $ at $ x = \\tfrac{1}{2} $',
              '$ \\dfrac{dy}{dx} = 8x - 4 = 0 \\Rightarrow x = \\dfrac{1}{2} $\n\n' +
              '$ \\dfrac{d^2y}{dx^2} = 8 > 0 $, so it is a minimum.\n\n' +
              '$ y = 4\\left(\\dfrac{1}{4}\\right) - 4\\left(\\dfrac{1}{2}\\right) + 7 = 1 - 2 + 7 = 6 $'),
            pnum('ub-mm-03',
              'Find the maximum and minimum values of $ y = x^3 - 3x $.',
              'Maximum $ 2 $ at $ x = -1 $; minimum $ -2 $ at $ x = 1 $',
              '$ \\dfrac{dy}{dx} = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1 $\n\n' +
              '$ \\dfrac{d^2y}{dx^2} = 6x $.\n\n' +
              'At $ x = -1 $: $ -6 < 0 $, a maximum, and $ y = -1 + 3 = 2 $.\n\n' +
              'At $ x = 1 $: $ +6 > 0 $, a minimum, and $ y = 1 - 3 = -2 $.'),
            pnum('ub-mm-04',
              'Find the maxima and minima of $ y = x^3 - 6x^2 + 9x + 15 $.',
              'Maximum $ 19 $ at $ x = 1 $; minimum $ 15 $ at $ x = 3 $',
              '$ \\dfrac{dy}{dx} = 3x^2 - 12x + 9 = 3(x-1)(x-3) = 0 \\Rightarrow x = 1, 3 $\n\n' +
              '$ \\dfrac{d^2y}{dx^2} = 6x - 12 $.\n\n' +
              'At $ x = 1 $: $ -6 < 0 $, maximum, $ y = 1 - 6 + 9 + 15 = 19 $.\n\n' +
              'At $ x = 3 $: $ +6 > 0 $, minimum, $ y = 27 - 54 + 27 + 15 = 15 $.'),
            pnum('ub-mm-05',
              'Find the maximum and minimum of $ y = \\sin 2x - x $ for $ -\\dfrac{\\pi}{2} \\le x \\le \\dfrac{\\pi}{2} $.',
              'Maximum $ \\dfrac{\\sqrt{3}}{2} - \\dfrac{\\pi}{6} \\approx 0.34 $ at $ x = \\dfrac{\\pi}{6} $; minimum $ -0.34 $ at $ x = -\\dfrac{\\pi}{6} $',
              '$ \\dfrac{dy}{dx} = 2\\cos 2x - 1 = 0 \\Rightarrow \\cos 2x = \\dfrac{1}{2} \\Rightarrow 2x = \\pm\\dfrac{\\pi}{3} \\Rightarrow x = \\pm\\dfrac{\\pi}{6} $\n\n' +
              '$ \\dfrac{d^2y}{dx^2} = -4\\sin 2x $.\n\n' +
              'At $ x = \\dfrac{\\pi}{6} $: $ \\sin\\dfrac{\\pi}{3} > 0 $, so the second derivative is negative — a **maximum**, value $ \\dfrac{\\sqrt{3}}{2} - \\dfrac{\\pi}{6} \\approx 0.34 $.\n\n' +
              'At $ x = -\\dfrac{\\pi}{6} $: a **minimum**, value $ -\\dfrac{\\sqrt{3}}{2} + \\dfrac{\\pi}{6} \\approx -0.34 $.\n\n' +
              'Note the chain rule appearing twice — the factor 2 comes from differentiating the inside of $ \\sin 2x $ each time.'),
          ],
        },
        {
          id: 'ub-physics',
          title: 'D · Mixed — calculus inside physics',
          blurb: 'No clue about which rule to use. Read the physics, then choose.',
          items: [
            pmcq('ub-px-01',
              'A particle has $ x = 5t^2 - 3t $. Its velocity at $ t = 2 $ s is:',
              ['$ 14 $ m/s', '$ 17 $ m/s', '$ 20 $ m/s', '$ 10 $ m/s'],
              1,
              '$ v = \\dfrac{dx}{dt} = 10t - 3 $, so at $ t = 2 $, $ v = 20 - 3 = 17 $ m/s.'),
            pmcq('ub-px-02',
              'A body has acceleration $ a = 4 $ m/s² and starts from rest. Its velocity after time $ t $ is:',
              ['$ 4t $', '$ 2t^2 $', '$ 4t^2 $', '$ 4 $'],
              0,
              '$ v = \\int a\\,dt = 4t + C $. Starting from rest means $ v = 0 $ at $ t = 0 $, so $ C = 0 $ and $ v = 4t $.'),
            pnum('ub-px-03',
              'A particle oscillates with $ x = A\\sin(\\omega t) $. Show that $ a = -\\omega^2 x $.',
              '$ a = -A\\omega^2\\sin(\\omega t) = -\\omega^2 x $',
              'Differentiate once for velocity, using the chain rule on the inside $ \\omega t $:\n\n' +
              '$ v = \\dfrac{dx}{dt} = A\\omega\\cos(\\omega t) $\n\n' +
              'Differentiate again for acceleration, remembering cosine gives minus sine:\n\n' +
              '$ a = \\dfrac{dv}{dt} = -A\\omega^2\\sin(\\omega t) $\n\n' +
              'Since $ x = A\\sin(\\omega t) $, this is $ a = -\\omega^2 x $ — the defining equation of simple harmonic motion.'),
            pnum('ub-px-04',
              'A body moves with velocity $ v = 6t^2 - 4t $ m/s. Find its displacement between $ t = 0 $ and $ t = 2 $ s.',
              '$ 8 $ m',
              'Displacement is the area under the velocity–time graph:\n\n' +
              '$ s = \\int_0^2\\left(6t^2 - 4t\\right)dt = \\Big[2t^3 - 2t^2\\Big]_0^2 $\n\n' +
              '$ = (16 - 8) - 0 = 8\\ \\mathrm{m} $'),
            pnum('ub-px-05',
              'The charge through a wire is $ q = 2t^3 + t $ coulombs. Find the current at $ t = 2 $ s, and the total charge that flowed between $ t = 0 $ and $ t = 2 $ s.',
              'Current $ = 25 $ A; charge $ = 18 $ C',
              'Current is a **derivative** — the rate of flow of charge:\n\n' +
              '$ I = \\dfrac{dq}{dt} = 6t^2 + 1 $, so at $ t = 2 $, $ I = 24 + 1 = 25\\ \\mathrm{A} $\n\n' +
              'The total charge is not an integral here — $ q $ is already the charge, so just substitute:\n\n' +
              '$ q(2) - q(0) = (16 + 2) - 0 = 18\\ \\mathrm{C} $\n\n' +
              'Read the question carefully: if you had been given $ I $ and asked for $ q $, *then* you would integrate. Knowing which direction you are travelling in is half the skill.'),
          ],
        },
      ],
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'End of Unit B',
      markdown:
        'You can now go from position to velocity to acceleration and all the way back again. That is genuinely everything kinematics will ask of your calculus.\n\n' +
        'Unit C is the last and largest: **vectors**. Everything from here to the end of the year is built on them.',
    }),
  ],
};

const PAGES = [page13, page14, page15, page16, page17, page18, page19, page20, page21, page22];
module.exports = { PAGES };

if (require.main === module) {
  withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, PAGES);
  }).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
