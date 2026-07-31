'use strict';
/**
 * Chapter 0 · UNIT A — Basic Maths.  New pages only; the four already-built
 * Unit A pages (0 opener, 1 why-maths, 2 powers-of-ten, 3 rearranging,
 * 9 trigonometry, 11 small-angle) keep their slots and are patched separately.
 *
 *    4  Quadratic Equations — and Which Root Is Physical
 *    5  Graphs I — Lines, Parabolas and Curves You Must Recognise
 *    6  Graphs II — Trig, Log and Exponential Curves
 *    7  Transforming a Graph
 *    8  Angles: Degrees, Radians and Arc Length
 *   10  Trig Identities and Compound Angles
 *   12  Unit A Practice Arena
 *
 * Scope rule (founder, 2026-07-29): depth-limited, coverage-broad. Shapes and
 * formulas that mechanics actually uses — no proofs, no domain/range theory.
 * Maths gets the full treatment in its own subject; here it is a toolbox.
 *
 * Run:  node scripts/physics11-book/build_unitA_basic_maths.js
 */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch0');
const { v4: uuidv4 } = require('uuid');

const heroPrompt = (scene) =>
  `Wide cinematic illustration on a very dark near-black background. ${scene} Minimal, clean, technical-diagram feel, no text labels. Dark background with orange and amber accents only.`;

// step-solver step factory
const st = (math, say, why, check) => ({ id: uuidv4(), math, say, ...(why ? { why } : {}), ...(check ? { check } : {}) });
// practice-bank MCQ / numerical factories
const pmcq = (id, prompt, options, correct_index, explanation) => ({
  id, kind: 'mcq', source: 'mcq', prompt, options, correct_index, explanation,
});
const pnum = (id, prompt, answer, solution) => ({
  id, kind: 'numerical', source: 'mcq', prompt, answer, solution,
});

// ═══ 4 ── Quadratic Equations ════════════════════════════════════════════════
const page4 = {
  page_number: 4,
  slug: 'quadratic-equations-in-physics',
  title: 'Quadratic Equations',
  subtitle: 'Two answers — and physics decides which one is real',
  glossary: [
    { term: 'quadratic equation', definition: 'An equation in which the highest power of the unknown is 2, written in the standard form ax² + bx + c = 0.' },
    { term: 'discriminant', definition: 'The quantity b² − 4ac. Its sign tells you how many real roots the equation has.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A ball thrown upward, with two glowing markers at the same height — one on the way up, one on the way down.',
      generation_prompt: heroPrompt(
        'A ball thrown upward tracing a glowing parabolic arc against a dark sky. Two bright markers sit at the same height on the curve — one on the rising side, one on the falling side — connected by a faint dashed horizontal line.'
      ),
    }),
    b('curiosity_prompt', 1, {
      prompt:
        'You throw a ball straight up. Someone asks: "At what time is the ball 15 metres above your hand?" You solve the equation and get **two** answers — 1 second and 3 seconds. Has the maths made a mistake?',
      hint: 'Draw the path of the ball. How many times does it pass a given height?',
      reveal:
        'No mistake. The ball passes 15 m **twice** — once going up at 1 s, and once coming back down at 3 s. The equation is not confused; it is telling you something true that you had not thought of.\n\nThis is the whole reason physics uses quadratics: motion under gravity naturally produces two answers, and reading them correctly is part of the physics.',
    }),
    b('text', 2, {
      markdown:
        'Any equation where the highest power of the unknown is 2 is called a **quadratic equation**. Written in standard form it always looks like this:\n\n' +
        '$ ax^2 + bx + c = 0 $\n\n' +
        'You met this in Class 10. The reason it comes back so hard in Class 11 is the very first formula of kinematics:\n\n' +
        '$ s = ut + \\tfrac{1}{2}at^2 $\n\n' +
        'Look at it closely. The unknown $ t $ appears squared. So the moment a question asks *when* something happens, you are solving a quadratic — and you will be doing that in almost every motion problem for the rest of the year.',
    }),
    b('heading', 3, {
      text: 'The formula, and what the discriminant tells you',
      level: 2,
      objective: 'Solve any quadratic and predict how many real answers it has before solving it.',
    }),
    b('text', 4, {
      markdown:
        'Once the equation is in standard form, the roots come from:\n\n' +
        '$ x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $\n\n' +
        'The part under the root, $ b^2 - 4ac $, is called the **discriminant**, written $ D $. You can read the answer off its sign without finishing the calculation:\n\n' +
        '- $ D > 0 $ — two different real roots. The ball reaches that height twice.\n' +
        '- $ D = 0 $ — one repeated root. The ball just barely reaches that height, at the very top.\n' +
        '- $ D < 0 $ — no real root. The ball never reaches that height at all.\n\n' +
        'That last line is worth remembering. In physics, "no real solution" is not an error message — it is an answer. It means the event you asked about never happens.',
    }),
    b('callout', 5, {
      variant: 'exam_tip',
      title: 'Factorise first, formula second',
      markdown:
        'The formula always works, but it is slow. In an exam, first try to split the middle term — most textbook quadratics are built to factorise neatly.\n\n' +
        '$ t^2 - 4t + 3 = 0 \\;\\Rightarrow\\; (t-1)(t-3) = 0 \\;\\Rightarrow\\; t = 1 \\text{ or } 3 $\n\n' +
        'That took five seconds. The formula would have taken thirty.',
    }),
    b('step_solver', 6, {
      title: 'When is the ball at 15 m?',
      problem: 'A ball is thrown straight up with $ u = 20 $ m/s. Taking $ g = 10 $ m/s², find the times at which it is 15 m above the throwing point.',
      intro: 'Upward is positive, so gravity is negative. Work through it one line at a time.',
      steps: [
        st(
          '$ 15 = 20t - 5t^2 $',
          'Start from $ s = ut + \\tfrac{1}{2}at^2 $ with $ s = 15 $, $ u = 20 $, $ a = -10 $.',
          'Half of $ -10 $ is $ -5 $, which is where the $ -5t^2 $ comes from. The minus sign is gravity pulling opposite to the throw.',
          {
            kind: 'mcq',
            prompt: 'What value of $ a $ goes into the formula here?',
            options: ['$ a = +10 $ m/s²', '$ a = -10 $ m/s²', '$ a = 0 $', '$ a = -5 $ m/s²'],
            answer_index: 1,
            feedback_right: 'Yes — we chose upward as positive, and gravity acts downward.',
            feedback_wrong: 'We picked upward as positive. Gravity pulls the other way, so its sign must be negative.',
          },
        ),
        st(
          '$ 5t^2 - 20t + 15 = 0 $',
          'Bring everything to one side so it is in standard form.',
          'Standard form is $ ax^2 + bx + c = 0 $. Nothing is allowed to stay on the right except zero.',
        ),
        st(
          '$ t^2 - 4t + 3 = 0 $',
          'Every term divides by 5 — always simplify before solving.',
          'Dividing through by a common factor does not change the roots, but it makes the numbers much friendlier.',
          {
            kind: 'pick_op',
            prompt: 'What is the cleanest next move?',
            options: ['Divide every term by 5', 'Apply the quadratic formula now', 'Take the square root of both sides'],
            answer_index: 0,
            feedback_right: 'Right — smaller numbers, fewer slips.',
            feedback_wrong: 'You *could* use the formula, but look at the coefficients first: 5, 20 and 15 share a factor.',
          },
        ),
        st(
          '$ (t-1)(t-3) = 0 $',
          'Split the middle term: which two numbers multiply to 3 and add to $ -4 $?',
          '$ -1 $ and $ -3 $. So the factors are $ (t-1) $ and $ (t-3) $.',
          {
            kind: 'fill_blank',
            prompt: 'Two numbers multiply to $ +3 $ and add to $ -4 $. The smaller one is ____.',
            blank_answer: '-3',
            feedback_right: 'Correct — $ -3 $ and $ -1 $.',
            feedback_wrong: 'Both must be negative (they add to a negative but multiply to a positive). Try $ -3 $ and $ -1 $.',
          },
        ),
        st(
          '$ t = 1\\ \\mathrm{s} \\quad \\text{or} \\quad t = 3\\ \\mathrm{s} $',
          'Both roots are positive, so both are real events.',
          'At $ t = 1 $ s the ball is on its way up. At $ t = 3 $ s it is falling back through the same height. Keep both.',
        ),
      ],
      now_you_try: {
        problem: 'Same throw, $ u = 20 $ m/s, $ g = 10 $ m/s². When is the ball at 20 m?',
        answer: '$ t = 2 $ s (one answer only)',
        solution:
          '$ 20 = 20t - 5t^2 \\Rightarrow 5t^2 - 20t + 20 = 0 \\Rightarrow t^2 - 4t + 4 = 0 \\Rightarrow (t-2)^2 = 0 $\n\n' +
          'Here $ D = 16 - 16 = 0 $, so there is a single repeated root, $ t = 2 $ s.\n\n' +
          'Physically: 20 m is exactly the highest point of this throw. The ball reaches it once and turns around. That is what a repeated root looks like in the real world.',
      },
    }),
    b('worked_example', 7, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A stone is thrown upward at $ 20 $ m/s from the top of a $ 25 $ m tower. Taking $ g = 10 $ m/s², when does it hit the ground?',
      solution:
        'Take upward as positive and the throwing point as the origin. The ground is 25 m **below** the throw, so $ s = -25 $ m.\n\n' +
        '$ -25 = 20t - 5t^2 $\n\n' +
        '$ 5t^2 - 20t - 25 = 0 \\;\\Rightarrow\\; t^2 - 4t - 5 = 0 $\n\n' +
        '$ (t-5)(t+1) = 0 \\;\\Rightarrow\\; t = 5\\ \\mathrm{s} \\ \\text{ or }\\ t = -1\\ \\mathrm{s} $\n\n' +
        'Now the physics. A negative time means "one second **before** you threw it" — the stone did not exist on this path then. So we reject it.\n\n' +
        '**Answer: $ t = 5 $ s.**\n\n' +
        'Watch-out: the commonest error here is writing $ s = +25 $. The sign of the displacement must match the direction you chose as positive.',
    }),
    b('worked_example', 8, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Without solving fully, decide whether a ball thrown up at $ 10 $ m/s ever reaches a height of $ 8 $ m. Take $ g = 10 $ m/s².',
      solution:
        'Set up the equation but stop at the discriminant.\n\n' +
        '$ 8 = 10t - 5t^2 \\;\\Rightarrow\\; 5t^2 - 10t + 8 = 0 $\n\n' +
        'Here $ a = 5 $, $ b = -10 $, $ c = 8 $.\n\n' +
        '$ D = b^2 - 4ac = 100 - 4(5)(8) = 100 - 160 = -60 $\n\n' +
        '$ D < 0 $, so there is **no real root**. The ball never reaches 8 m.\n\n' +
        'Check it against common sense: the maximum height for this throw is $ u^2/2g = 100/20 = 5 $ m. So 8 m was never possible — and the discriminant told us that in one line, without solving anything.',
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Which root do you keep?',
      markdown:
        'The maths gives you two numbers. **Physics** decides which ones survive:\n\n' +
        '- **Negative time** — reject. It refers to before the motion started.\n' +
        '- **Negative mass, negative length, negative speed magnitude** — reject.\n' +
        '- **Two positive times** — usually keep both, and say what each one means.\n\n' +
        'Never throw away a root silently. In a board exam, one line saying *"t = −1 s is rejected as time cannot be negative"* is worth a mark.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('The equation $ 2t^2 - 8t + 8 = 0 $ has:',
          ['Two different real roots', 'No real root', 'Two negative roots', 'Exactly one repeated real root'],
          3,
          '$ D = (-8)^2 - 4(2)(8) = 64 - 64 = 0 $. A zero discriminant means one repeated root — here $ t = 2 $.',
          2),
        q('A body\'s displacement is $ s = 5t^2 - 20t $. At what times is $ s = 0 $?',
          ['$ t = 0 $ and $ t = 4 $ s', '$ t = 4 $ s only', '$ t = 0 $ and $ t = -4 $ s', '$ t = 2 $ s only'],
          0,
          'Factorise: $ 5t(t - 4) = 0 $, giving $ t = 0 $ and $ t = 4 $ s. The body starts at the origin and returns to it after 4 s — both roots are physically real.',
          2),
        q('Solving for the time a projectile lands gives $ t = 6 $ s and $ t = -2 $ s. What should you write?',
          ['Both are valid answers', 'The answer is $ -2 $ s', 'The answer is $ 6 $ s; $ -2 $ s is rejected as time cannot be negative', 'The question has no answer'],
          2,
          'Keep the positive root and state the reason the other is rejected. Examiners award that reasoning line.',
          1),
      ],
    }),
    b('text', 11, {
      markdown: 'Next: the shapes. Physics reads answers straight off a graph, so you need to recognise a curve the moment you see it.',
    }),
  ],
};

// ═══ 5 ── Graphs I ═══════════════════════════════════════════════════════════
const page5 = {
  page_number: 5,
  slug: 'graphs-lines-and-curves',
  title: 'Graphs I — Lines and Curves You Must Recognise',
  subtitle: 'Straight line, parabola, circle, hyperbola',
  glossary: [
    { term: 'slope', definition: 'How steep a line is: the change in y divided by the change in x. In physics it usually carries a physical meaning, like velocity.' },
    { term: 'intercept', definition: 'Where a graph cuts an axis. The y-intercept is the value of y when x = 0.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A row of glowing graph shapes on a dark grid — a straight line, a parabola, a circle and a hyperbola.',
      generation_prompt: heroPrompt(
        'Four glowing curves laid out in a row on a dark technical grid: a straight sloping line, an upward parabola, a circle, and a two-branch hyperbola. Each drawn in thin luminous strokes.'
      ),
    }),
    b('text', 1, {
      markdown:
        'A physicist looks at a graph the way you look at a face — the shape alone tells them what is going on, before any numbers are read.\n\n' +
        'You do **not** need to be able to plot these from scratch. You need to recognise them instantly and know what their slope and intercept mean. That is all this page is for.',
    }),
    b('heading', 2, {
      text: 'The straight line — the one you will use most',
      level: 2,
      objective: 'Read the slope and intercept off any straight-line graph and say what they mean physically.',
    }),
    b('text', 3, {
      markdown:
        'Every straight line can be written as:\n\n' +
        '$ y = mx + c $\n\n' +
        'where $ m $ is the **slope** and $ c $ is the **y-intercept** — the value of $ y $ where the line crosses the vertical axis.\n\n' +
        'The slope is found from any two points on the line:\n\n' +
        '$ m = \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{\\text{rise}}{\\text{run}} $\n\n' +
        'Drag the two sliders below and watch what each one controls. Change $ m $ and the line pivots; change $ c $ and the whole line slides up or down.',
    }),
    b('math_graph', 4, {
      title: 'The straight line',
      archetype: 'line-explorer',
      caption: 'Slope m tilts the line; intercept c lifts it. Notice that a negative m makes the line fall from left to right.',
      predict: {
        prompt: 'If you make $ m $ negative, what happens to the line?',
        options: ['It moves downward but stays tilted the same way', 'It falls from left to right instead of rising', 'It becomes horizontal', 'It becomes steeper but still rises'],
        answer_index: 1,
        reveal: 'A negative slope means y decreases as x increases — the line falls from left to right. In a velocity–time graph that would mean the body is slowing down.',
      },
    }),
    b('callout', 5, {
      variant: 'remember',
      title: 'Slope always means something in physics',
      markdown:
        'A slope is never just a number. It is always a **rate**:\n\n' +
        '- Slope of a position–time graph = **velocity**\n' +
        '- Slope of a velocity–time graph = **acceleration**\n' +
        '- Slope of a momentum–time graph = **force**\n\n' +
        'So when you see a straight-line graph in physics, the first question is always: *what is the slope of this, physically?*',
    }),
    b('heading', 6, {
      text: 'The parabola — the shape of anything thrown',
      level: 2,
      objective: 'Recognise y = ax² curves and know how the coefficient reshapes them.',
    }),
    b('text', 7, {
      markdown:
        'When the highest power is 2, you get a **parabola** — the U-shaped curve. Its simplest form is $ y = ax^2 $.\n\n' +
        'A positive $ a $ opens the U upward; a negative $ a $ flips it into an arch. A bigger $ |a| $ makes it narrower.\n\n' +
        'This shape matters enormously because $ s = \\tfrac{1}{2}at^2 $ is a parabola, and so is the flight path of every thrown object. Move both sliders below — $ a $ changes the width and the flip, $ n $ changes the power itself.',
    }),
    b('math_graph', 8, {
      title: 'The power family — y = a·xⁿ',
      archetype: 'power-family',
      caption: 'Set n = 2 for the parabola of projectile motion. Set n = 3 and watch the curve become odd — it dives below the axis on the left.',
    }),
    b('heading', 9, {
      text: 'The other three shapes, in one table',
      level: 2,
      objective: 'Identify a circle, an ellipse and a hyperbola from their equations.',
    }),
    b('table', 10, {
      caption: 'The five curve shapes physics keeps reusing. Learn the equation-to-picture link, not the derivations.',
      headers: ['Equation', 'Shape', 'Where physics uses it'],
      rows: [
        ['$ y = mx + c $', 'Straight line', 'Uniform velocity, Ohm\'s law, Hooke\'s law'],
        ['$ y = ax^2 $', 'Parabola', 'Projectile paths, $ s = \\tfrac{1}{2}at^2 $, kinetic energy vs speed'],
        ['$ x^2 + y^2 = r^2 $', 'Circle, radius $ r $ centred at origin', 'Circular motion, wavefronts'],
        ['$ \\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1 $', 'Ellipse', 'Planetary orbits'],
        ['$ xy = k $, i.e. $ y = \\dfrac{k}{x} $', 'Rectangular hyperbola', 'Boyle\'s law ($ PV = $ constant), inverse-square feel'],
      ],
    }),
    b('callout', 11, {
      variant: 'exam_tip',
      title: 'The straightening trick',
      markdown:
        'Curves are hard to read accurately; straight lines are easy. So physicists **force** data into a straight line.\n\n' +
        'If $ y = \\dfrac{k}{x} $, then plotting $ y $ against $ \\dfrac{1}{x} $ gives a straight line of slope $ k $.\n\n' +
        'If $ s = \\tfrac{1}{2}at^2 $, then plotting $ s $ against $ t^2 $ gives a straight line of slope $ \\tfrac{1}{2}a $.\n\n' +
        'This appears constantly in practical and graph-based questions: *"which graph would be a straight line?"* Look for the substitution that kills the power.',
    }),
    b('worked_example', 12, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A position–time graph is a straight line passing through $ (0,\\, 4) $ m and $ (2,\\, 10) $ m. Find the velocity and write the equation of motion.',
      solution:
        'Velocity is the slope of a position–time graph.\n\n' +
        '$ m = \\dfrac{10 - 4}{2 - 0} = \\dfrac{6}{2} = 3\\ \\mathrm{m/s} $\n\n' +
        'The intercept is the position at $ t = 0 $, so $ c = 4 $ m.\n\n' +
        '$ x = 3t + 4 $\n\n' +
        'Reading it back: the body started 4 m from the origin and has been moving at a steady 3 m/s ever since. The straight line tells you the velocity is constant — no acceleration.',
    }),
    b('worked_example', 13, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A gas obeys $ PV = $ constant. Which graph gives a straight line — $ P $ against $ V $, or $ P $ against $ 1/V $?',
      solution:
        'Rearrange the relation into $ y = mx + c $ shape.\n\n' +
        '$ PV = k \\;\\Rightarrow\\; P = k \\times \\dfrac{1}{V} $\n\n' +
        'Compare with $ y = mx + c $. If we let $ y = P $ and $ x = \\dfrac{1}{V} $, then $ m = k $ and $ c = 0 $.\n\n' +
        'So **$ P $ against $ 1/V $ is the straight line**, passing through the origin with slope $ k $.\n\n' +
        '$ P $ against $ V $ gives a curve — the rectangular hyperbola from the table above.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.7,
      questions: [
        q('A velocity–time graph is a straight line sloping downward. The body is:',
          ['Speeding up', 'Moving with constant velocity', 'Slowing down', 'At rest'],
          2,
          'The slope of a velocity–time graph is acceleration. A downward slope means negative acceleration, so the body is slowing down.',
          1),
        q('Which equation gives a rectangular hyperbola?',
          ['$ y = 3x + 2 $', '$ y = 3x^2 $', '$ xy = 6 $', '$ x^2 + y^2 = 9 $'],
          2,
          '$ xy = $ constant is the rectangular hyperbola — the Boyle\'s law shape. The others are a line, a parabola and a circle.',
          1),
        q('For $ s = \\tfrac{1}{2}at^2 $, which plot is a straight line through the origin?',
          ['$ s $ against $ t $', '$ s $ against $ t^2 $', '$ s $ against $ 1/t $', '$ t $ against $ s $'],
          1,
          'Writing it as $ s = \\left(\\tfrac{1}{2}a\\right)t^2 $ and letting $ x = t^2 $ gives $ s = mx $ with $ m = \\tfrac{1}{2}a $ — a straight line through the origin.',
          2),
      ],
    }),
    b('text', 15, {
      markdown: 'Next: the curves that wave, grow and decay.',
    }),
  ],
};

// ═══ 6 ── Graphs II ══════════════════════════════════════════════════════════
const page6 = {
  page_number: 6,
  slug: 'graphs-trig-log-exponential',
  title: 'Graphs II — Waves, Growth and Decay',
  subtitle: 'sin, cos, tan, log x and aˣ',
  glossary: [
    { term: 'exponential decay', definition: 'A quantity that falls by the same fraction in every equal time interval, described by e raised to a negative power.' },
    { term: 'asymptote', definition: 'A line that a curve approaches ever more closely but never actually touches.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A glowing sine wave beside a rising exponential curve and a slowly climbing logarithm curve on a dark grid.',
      generation_prompt: heroPrompt(
        'Three glowing curves side by side on a dark technical grid: a smooth repeating sine wave, a sharply rising exponential curve, and a slowly flattening logarithm curve.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Three families of curve run through the whole of physics:\n\n' +
        '- **Trigonometric** curves repeat. Anything that oscillates — a pendulum, a spring, a sound wave, alternating current — is drawn with sines and cosines.\n' +
        '- **Exponential** curves grow or die away. Radioactive decay, a capacitor discharging, a body cooling.\n' +
        '- **Logarithmic** curves are the exponential ones read backwards — they turn multiplying into adding.\n\n' +
        'Again: recognise the shape, know the key facts. That is enough for mechanics.',
    }),
    b('heading', 2, {
      text: 'The wave shapes',
      level: 2,
      objective: 'Recall the shape, range and repeat length of sin, cos and tan.',
    }),
    b('table', 3, {
      caption: 'The three wave curves. "Period" means how far along x before the pattern repeats.',
      headers: ['Curve', 'Starts at x = 0 with', 'Range', 'Period'],
      rows: [
        ['$ y = \\sin x $', '$ 0 $, rising', '$ -1 $ to $ +1 $', '$ 2\\pi $'],
        ['$ y = \\cos x $', '$ 1 $, at a peak', '$ -1 $ to $ +1 $', '$ 2\\pi $'],
        ['$ y = \\tan x $', '$ 0 $, rising steeply', 'all values, $ -\\infty $ to $ +\\infty $', '$ \\pi $'],
      ],
    }),
    b('text', 4, {
      markdown:
        'Two facts that get tested again and again:\n\n' +
        '**Cosine is sine shifted.** $ \\cos x = \\sin\\left(x + \\dfrac{\\pi}{2}\\right) $. The two curves are the same shape, just started at different places. In waves this shift is called a **phase difference**.\n\n' +
        '**Tangent breaks.** At $ x = \\dfrac{\\pi}{2} $, $ \\tan x $ shoots off to infinity, because $ \\tan x = \\dfrac{\\sin x}{\\cos x} $ and $ \\cos\\left(\\dfrac{\\pi}{2}\\right) = 0 $. Those breaks repeat every $ \\pi $.',
    }),
    b('heading', 5, {
      text: 'Growth and decay',
      level: 2,
      objective: 'Read an exponential curve and identify its starting value and its limit.',
    }),
    b('text', 6, {
      markdown:
        'An exponential curve is written $ y = a^x $. Whatever the base $ a $, every one of these curves passes through $ (0,\\,1) $, because anything to the power zero is 1.\n\n' +
        '- If $ a > 1 $ the curve **grows** — slowly at first, then explosively.\n' +
        '- If $ a < 1 $ the curve **decays** — steeply at first, then flattening towards zero.\n\n' +
        'Physics almost always uses the special base $ e \\approx 2.718 $, so decay is written $ y = y_0 e^{-kt} $. The bigger the $ k $, the faster the fall.\n\n' +
        'Move the slider below and watch the curve flip between growth and decay as $ a $ crosses 1.',
    }),
    b('math_graph', 7, {
      title: 'Growth and decay — y = aˣ',
      archetype: 'exp-base-explorer',
      caption: 'Every curve passes through (0, 1). Below a = 1 the curve decays instead of growing.',
      predict: {
        prompt: 'What happens to the curve when $ a $ is set to exactly 1?',
        options: ['It becomes a vertical line', 'It becomes the horizontal line y = 1', 'It disappears', 'It becomes a parabola'],
        answer_index: 1,
        reveal: '$ 1^x = 1 $ for every x, so the curve flattens into the horizontal line y = 1. That is the boundary between growth and decay.',
      },
    }),
    b('callout', 8, {
      variant: 'remember',
      title: 'The decay shape in words',
      markdown:
        'A decay curve $ y = y_0 e^{-kt} $ does three things, and questions test all three:\n\n' +
        '1. It **starts** at $ y_0 $ (put $ t = 0 $).\n' +
        '2. It **falls fastest at the start**, then flattens.\n' +
        '3. It approaches zero but **never reaches it**. That horizontal line it creeps towards is called an asymptote.\n\n' +
        'A curve that rises and flattens towards some ceiling $ L $ is the same shape upside-down: $ y = L - Ae^{-kt} $.',
    }),
    b('heading', 9, {
      text: 'Logarithms — turning multiplication into addition',
      level: 2,
      objective: 'Use the three log rules to simplify an expression.',
    }),
    b('text', 10, {
      markdown:
        'A logarithm answers the question *"what power do I raise the base to?"* If $ a^y = x $, then $ y = \\log_a x $.\n\n' +
        'Its whole usefulness sits in three rules:\n\n' +
        '$ \\log(mn) = \\log m + \\log n $\n\n' +
        '$ \\log\\!\\left(\\dfrac{m}{n}\\right) = \\log m - \\log n $\n\n' +
        '$ \\log(m^n) = n \\log m $\n\n' +
        'Multiplying becomes adding; powers come down to the front. That last rule is the one physics uses most — it is how a curve gets straightened into a line.\n\n' +
        'The graph of $ y = \\log x $ climbs quickly at first and then almost flattens, and it is only defined for $ x > 0 $ — you cannot take the log of zero or of a negative number.',
    }),
    b('worked_example', 11, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'The graph shown is exponential. It starts at $ y = -4 $ when $ x = 0 $ and flattens towards $ y = 6 $ for large $ x $. Write down its equation.',
      solution:
        'A curve that rises and flattens towards a ceiling has the shape\n\n' +
        '$ y = L - A e^{-kx} $\n\n' +
        'where $ L $ is the ceiling it approaches.\n\n' +
        'From the graph, the ceiling is $ L = 6 $, so $ y = 6 - Ae^{-kx} $.\n\n' +
        'Now use the starting point. At $ x = 0 $, $ e^{0} = 1 $, so $ y = 6 - A $. The graph gives $ y = -4 $ there:\n\n' +
        '$ 6 - A = -4 \\;\\Rightarrow\\; A = 10 $\n\n' +
        '**$ y = 6 - 10e^{-kx} $**\n\n' +
        'The value of $ k $ cannot be found from the two facts given — it controls only how quickly the curve flattens, and you would need a third reading off the graph to pin it down.',
    }),
    b('worked_example', 12, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A radioactive sample decays as $ N = N_0 e^{-\\lambda t} $. Show how to plot the data so that it becomes a straight line, and say what the slope would be.',
      solution:
        'Take the natural logarithm of both sides — this is the standard way to straighten an exponential.\n\n' +
        '$ \\ln N = \\ln\\left(N_0 e^{-\\lambda t}\\right) $\n\n' +
        'Use $ \\log(mn) = \\log m + \\log n $:\n\n' +
        '$ \\ln N = \\ln N_0 + \\ln\\left(e^{-\\lambda t}\\right) $\n\n' +
        'And since $ \\ln(e^{x}) = x $:\n\n' +
        '$ \\ln N = \\ln N_0 - \\lambda t $\n\n' +
        'Compare with $ y = mx + c $. Plotting $ \\ln N $ on the vertical axis against $ t $ on the horizontal gives a **straight line** with:\n\n' +
        '- slope $ = -\\lambda $\n' +
        '- intercept $ = \\ln N_0 $\n\n' +
        'This is exactly how decay constants are measured in a laboratory.',
    }),
    b('inline_quiz', 13, {
      pass_threshold: 0.7,
      questions: [
        q('Which of these is true for every curve $ y = a^x $?',
          ['It passes through $ (1,\\,0) $', 'It cuts the x-axis once', 'It is symmetric about the y-axis', 'It passes through $ (0,\\,1) $'],
          3,
          'Any non-zero number to the power 0 equals 1, so every exponential curve passes through (0, 1). None of them ever cuts the x-axis.',
          1),
        q('$ \\log\\left(\\dfrac{a^3}{b}\\right) $ equals:',
          ['$ 3\\log a - \\log b $', '$ 3\\log a + \\log b $', '$ \\dfrac{3\\log a}{\\log b} $', '$ \\log 3a - \\log b $'],
          0,
          'Division becomes subtraction, and the power 3 comes down to the front: $ \\log a^3 - \\log b = 3\\log a - \\log b $.',
          2),
        q('The period of $ y = \\tan x $ is:',
          ['$ 2\\pi $', '$ \\pi $', '$ \\dfrac{\\pi}{2} $', '$ 4\\pi $'],
          1,
          'Unlike sine and cosine, the tangent curve repeats every $ \\pi $, not every $ 2\\pi $.',
          2),
      ],
    }),
    b('text', 14, {
      markdown: 'Next: what happens to any of these curves when you nudge, stretch or flip them.',
    }),
  ],
};

// ═══ 7 ── Transforming a Graph ═══════════════════════════════════════════════
const page7 = {
  page_number: 7,
  slug: 'transforming-a-graph',
  title: 'Transforming a Graph',
  subtitle: 'Shift it, stretch it, flip it',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A parabola shown four times — original, shifted sideways, shifted up, and flipped upside down.',
      generation_prompt: heroPrompt(
        'One glowing parabola repeated four times across a dark grid: in its original position, slid sideways, lifted upward, and flipped upside down. A faint dashed ghost of the original sits behind each.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Here is the payoff for learning the shapes. Once you know one curve, you get a whole family free — because changing a formula in a simple way just **moves** the curve without changing its shape.\n\n' +
        'There are only four moves, and physics uses all of them. A wave that starts late is a sideways shift. A wave that is twice as loud is a vertical stretch. A reflected pulse is a flip.',
    }),
    b('heading', 2, {
      text: 'Move 1 and 2 — sliding the curve',
      level: 2,
      objective: 'Predict which way a curve moves when a constant is added inside or outside the function.',
    }),
    b('text', 3, {
      markdown:
        'Take any curve $ y = f(x) $.\n\n' +
        '**Adding outside** lifts it: $ y = f(x) + k $ moves the whole curve **up** by $ k $.\n\n' +
        '**Adding inside** slides it sideways — and here is the trap: $ y = f(x - h) $ moves the curve **right** by $ h $, not left.\n\n' +
        'It feels backwards, and it catches almost everybody the first time. The reason is simple: to get the same output you now have to feed in an $ x $ that is $ h $ bigger, so every point has moved to the right.\n\n' +
        'Try it below. Move $ h $ and $ k $, and keep an eye on the dashed ghost of the original.',
    }),
    b('math_graph', 4, {
      title: 'Sliding — y = f(x − h) + k',
      archetype: 'shift-explorer',
      archetype_params: { base: 'square' },
      caption: 'The dashed curve is the original. h slides it sideways, k lifts it. Notice that a positive h moves it right.',
      predict: {
        prompt: 'Which way does $ y = f(x - 3) $ move the curve?',
        options: ['3 units left', '3 units right', '3 units up', '3 units down'],
        answer_index: 1,
        reveal: 'Right by 3 — the opposite of what the minus sign suggests. Test it on the board: set h = 3 and watch.',
      },
    }),
    b('heading', 5, {
      text: 'Move 3 and 4 — stretching and flipping',
      level: 2,
      objective: 'Predict the effect of a multiplier inside or outside the function.',
    }),
    b('text', 6, {
      markdown:
        '**Multiplying outside** stretches vertically: $ y = a\\,f(x) $ makes the curve $ a $ times taller. If $ a $ is negative, the curve also **flips upside down**.\n\n' +
        '**Multiplying inside** squeezes horizontally: $ y = f(bx) $ squashes the curve towards the y-axis by a factor $ b $. A negative $ b $ flips it left-to-right.\n\n' +
        'Once more, the inside move behaves opposite to expectation — $ b = 2 $ makes the curve **narrower**, not wider, because it now completes its pattern in half the distance.',
    }),
    b('math_graph', 7, {
      title: 'Stretching and flipping — y = a·f(bx)',
      archetype: 'stretch-explorer',
      archetype_params: { base: 'sin' },
      caption: 'On a sine wave, a is the amplitude and b controls how many waves fit in the same space. Make a negative and the wave turns over.',
    }),
    b('table', 8, {
      caption: 'The four moves. Outside the bracket behaves as you expect; inside the bracket behaves backwards.',
      headers: ['New formula', 'What happens', 'The catch'],
      rows: [
        ['$ y = f(x) + k $', 'Moves up by $ k $', 'None — behaves normally'],
        ['$ y = f(x - h) $', 'Moves right by $ h $', 'Minus means right, not left'],
        ['$ y = a\\,f(x) $', 'Stretches vertically by $ a $', 'Negative $ a $ flips it upside down'],
        ['$ y = f(bx) $', 'Squeezes horizontally by $ b $', 'Bigger $ b $ means narrower, not wider'],
      ],
    }),
    b('callout', 9, {
      variant: 'exam_tip',
      title: 'Where this shows up in physics',
      markdown:
        'A wave travelling to the right is written $ y = A\\sin(kx - \\omega t) $.\n\n' +
        'Look at what is inside the bracket: a sideways shift that grows with time. That is exactly the "move right" rule from this page — the whole wave is sliding right as $ t $ increases.\n\n' +
        'The $ A $ in front is the outside multiplier: the amplitude. You have already met all the maths of a travelling wave; you just have not called it that yet.',
    }),
    b('worked_example', 10, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'The graph of $ y = x^2 $ is moved 2 units right and 3 units down. Write the new equation.',
      solution:
        'Handle the two moves one at a time.\n\n' +
        'Moving **right by 2** means replacing $ x $ with $ (x - 2) $:\n\n' +
        '$ y = (x-2)^2 $\n\n' +
        'Moving **down by 3** means subtracting 3 from the whole thing:\n\n' +
        '$ y = (x-2)^2 - 3 $\n\n' +
        'Quick check: the lowest point of $ y = x^2 $ is at $ (0,\\,0) $. After the moves it should sit at $ (2,\\,-3) $. Putting $ x = 2 $ into the new equation gives $ y = 0 - 3 = -3 $. It matches.',
    }),
    b('worked_example', 11, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A sound wave is described by $ y = 3\\sin(2x) $. Compare it with $ y = \\sin x $ — what has changed?',
      solution:
        'There are two changes, one outside the bracket and one inside.\n\n' +
        '**Outside:** the 3 multiplies the whole sine, so the curve is 3 times taller. Its values now run from $ -3 $ to $ +3 $ instead of $ -1 $ to $ +1 $. In sound, that means a louder note.\n\n' +
        '**Inside:** the 2 multiplies $ x $, squeezing the curve horizontally by a factor of 2. The pattern now repeats every $ \\pi $ instead of every $ 2\\pi $, so **two** full waves fit where one used to. In sound, that means a higher pitch.\n\n' +
        'So the new wave is louder and higher — twice the frequency, three times the amplitude.',
    }),
    b('inline_quiz', 12, {
      pass_threshold: 0.7,
      questions: [
        q('The curve $ y = f(x) $ is shifted to give $ y = f(x + 4) $. The curve has moved:',
          ['4 units left', '4 units right', '4 units up', '4 units down'],
          0,
          'Inside the bracket the effect is reversed. A plus sign moves the curve left.',
          2),
        q('Compared with $ y = \\cos x $, the curve $ y = -2\\cos x $ is:',
          ['Twice as tall and flipped upside down', 'Twice as tall, same way up', 'Half as tall and flipped', 'Shifted 2 units down'],
          0,
          'The 2 stretches it vertically; the minus sign flips it. Both act outside the bracket, so both behave exactly as they look.',
          2),
        q('$ y = \\sin(3x) $ completes one full wave in a distance of:',
          ['$ 6\\pi $', '$ 2\\pi $', '$ \\dfrac{2\\pi}{3} $', '$ 3\\pi $'],
          2,
          'The inside multiplier squeezes the curve by 3, so the period becomes $ 2\\pi/3 $. Three complete waves now fit into the old space of one.',
          3),
      ],
    }),
    b('text', 13, {
      markdown: 'That completes the graph work. Next we start the trigonometry block — beginning with the way physics actually measures angles.',
    }),
  ],
};

// ═══ 8 ── Angles: Degrees, Radians and Arc Length ════════════════════════════
const page8 = {
  page_number: 8,
  slug: 'angles-degrees-and-radians',
  title: 'Angles: Degrees, Radians and Arc Length',
  subtitle: 'Why physics quietly stops using degrees',
  glossary: [
    { term: 'radian', definition: 'The angle at the centre of a circle for which the arc length equals the radius. One radian is about 57.3°.' },
    { term: 'arc length', definition: 'The distance measured along a curved part of a circle, given by s = rθ when θ is in radians.' },
  ],
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'A circle with a highlighted arc equal in length to the radius, marking out one radian at the centre.',
      generation_prompt: heroPrompt(
        'A large glowing circle on a dark grid. One radius is drawn, and an arc of exactly the same length is highlighted in bright amber along the circumference, with the angle between them marked at the centre.'
      ),
    }),
    b('curiosity_prompt', 1, {
      prompt:
        'Why 360 degrees in a circle? Why not 100, or 1000? There is no mathematical reason at all — the number is inherited from ancient Babylonian astronomers, who liked counting in sixties.',
      hint: 'If a unit is chosen by historical accident, is it likely to make formulas come out clean?',
      reveal:
        'Exactly — it does not. Degrees are a human convention, so formulas written in degrees are full of awkward conversion factors.\n\n' +
        'The radian is defined by the circle itself, not by history. Use radians and those extra factors vanish. That is the only reason physics prefers them.',
    }),
    b('text', 2, {
      markdown:
        'Take a circle of radius $ r $. Mark off an arc along its edge whose length is **exactly $ r $**. The angle that arc makes at the centre is defined as **one radian**.\n\n' +
        'The definition generalises immediately. For any arc of length $ s $:\n\n' +
        '$ \\theta = \\dfrac{s}{r} \\qquad\\text{or}\\qquad s = r\\theta $\n\n' +
        'This is one of the most useful small formulas in all of physics — but it is only valid when $ \\theta $ is in **radians**. Feed it degrees and the answer is nonsense.',
    }),
    b('math_graph', 3, {
      title: 'Arc length and sector area',
      archetype: 'sector-explorer',
      archetype_params: { r: 3, theta: 60 },
      caption: 'Sweep the angle and watch the arc length grow. At about 57.3° the arc length equals the radius — that is one radian.',
      predict: {
        prompt: 'For a circle of radius 3, roughly what angle makes the arc length also equal to 3?',
        options: ['About 30°', 'About 45°', 'About 57°', 'About 90°'],
        answer_index: 2,
        reveal: 'About 57.3°, and that is true for every circle whatever its radius — which is precisely what makes the radian a natural unit.',
      },
    }),
    b('heading', 4, {
      text: 'Converting between the two',
      level: 2,
      objective: 'Convert confidently in both directions without memorising a table.',
    }),
    b('text', 5, {
      markdown:
        'A full circle has circumference $ 2\\pi r $. Putting that into $ \\theta = s/r $ gives $ \\theta = 2\\pi $ radians for a full turn. So:\n\n' +
        '$ 360° = 2\\pi \\text{ rad} \\qquad\\Rightarrow\\qquad 180° = \\pi \\text{ rad} $\n\n' +
        'Everything follows from that one line. To convert:\n\n' +
        '$ \\text{degrees} \\to \\text{radians:}\\quad \\times \\dfrac{\\pi}{180} $\n\n' +
        '$ \\text{radians} \\to \\text{degrees:}\\quad \\times \\dfrac{180}{\\pi} $\n\n' +
        'And one radian is $ \\dfrac{180}{\\pi} \\approx 57.3° $.',
    }),
    b('table', 6, {
      caption: 'The handful of conversions worth knowing by heart.',
      headers: ['Degrees', 'Radians', 'Where you meet it'],
      rows: [
        ['$ 30° $', '$ \\pi/6 $', 'Inclined planes'],
        ['$ 37° $', '$ \\approx 0.64 $', 'The 3-4-5 triangle, used constantly in mechanics'],
        ['$ 45° $', '$ \\pi/4 $', 'Maximum-range projectile'],
        ['$ 53° $', '$ \\approx 0.93 $', 'The other 3-4-5 angle'],
        ['$ 60° $', '$ \\pi/3 $', 'Equilateral geometry, vector problems'],
        ['$ 90° $', '$ \\pi/2 $', 'Perpendicular components'],
        ['$ 180° $', '$ \\pi $', 'Reversal of direction'],
      ],
    }),
    b('worked_example', 7, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A circular arc of length $ \\pi $ cm is drawn on a circle of radius 6 cm. Find the angle it subtends at the centre, in radians and in degrees.',
      solution:
        'Use the definition directly.\n\n' +
        '$ \\theta = \\dfrac{s}{r} = \\dfrac{\\pi}{6}\\ \\text{rad} $\n\n' +
        'Now convert to degrees by multiplying by $ \\dfrac{180}{\\pi} $:\n\n' +
        '$ \\theta = \\dfrac{\\pi}{6} \\times \\dfrac{180}{\\pi} = 30° $\n\n' +
        '**Answer: $ \\pi/6 $ rad, or 30°.**\n\n' +
        'Notice how the $ \\pi $ cancelled. Whenever an arc length is given as a multiple of $ \\pi $, expect a clean angle at the end — that is the question-setter being kind to you.',
    }),
    b('worked_example', 8, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'A wheel of radius $ 0.5 $ m turns through $ 120° $. How far does a point on its rim travel?',
      solution:
        'The formula $ s = r\\theta $ needs radians, so convert first. This is the step students skip.\n\n' +
        '$ \\theta = 120 \\times \\dfrac{\\pi}{180} = \\dfrac{2\\pi}{3}\\ \\text{rad} $\n\n' +
        'Now apply the formula:\n\n' +
        '$ s = r\\theta = 0.5 \\times \\dfrac{2\\pi}{3} = \\dfrac{\\pi}{3} \\approx 1.05\\ \\mathrm{m} $\n\n' +
        'Watch-out: if you had put 120 straight into $ s = r\\theta $ you would have got 60 m — a wheel half a metre across cannot move a point 60 m in one third of a turn. A quick sanity check catches this every time.',
    }),
    b('callout', 9, {
      variant: 'remember',
      title: 'Radians are not really a unit',
      markdown:
        'A radian is a length divided by a length, so the units cancel. That is why you can write $ \\sin(0.5) $ but never $ \\sin(0.5\\ \\mathrm{m}) $.\n\n' +
        'It also explains something you will meet soon: in $ v = r\\omega $, the angular speed $ \\omega $ must be in radians per second. Degrees per second will silently give you a wrong answer with no unit error to warn you.',
    }),
    b('inline_quiz', 10, {
      pass_threshold: 0.7,
      questions: [
        q('$ 45° $ in radians is:',
          ['$ \\dfrac{\\pi}{3} $', '$ \\dfrac{\\pi}{6} $', '$ \\dfrac{\\pi}{2} $', '$ \\dfrac{\\pi}{4} $'],
          3,
          'Multiply by $ \\pi/180 $: $ 45 \\times \\pi/180 = \\pi/4 $.',
          1),
        q('An arc of length 4 m lies on a circle of radius 2 m. The angle subtended at the centre is:',
          ['$ 0.5 $ rad', '$ 2 $ rad', '$ 8 $ rad', '$ 4 $ rad'],
          1,
          '$ \\theta = s/r = 4/2 = 2 $ rad. Note it is a pure number — no units.',
          1),
        q('A particle moves along a circle of radius 3 m through an angle of $ \\pi/2 $ rad. The distance travelled along the arc is:',
          ['$ 1.5 $ m', '$ 3\\pi $ m', '$ \\dfrac{3\\pi}{2} $ m', '$ 6 $ m'],
          2,
          '$ s = r\\theta = 3 \\times \\pi/2 = 3\\pi/2 \\approx 4.7 $ m. The angle was already in radians, so no conversion was needed.',
          2),
      ],
    }),
    b('text', 11, {
      markdown: 'Next: the trigonometric ratios themselves, and the small table of values you must know cold.',
    }),
  ],
};

// ═══ 10 ── Trig Identities and Compound Angles ═══════════════════════════════
const page10 = {
  page_number: 10,
  slug: 'trig-identities-and-compound-angles',
  title: 'Trig Identities and Compound Angles',
  subtitle: 'The formulas physics reuses, and nothing more',
  blocks: [
    b('image', 0, {
      src: '', aspect_ratio: '16:5', caption: '',
      alt: 'Two overlapping right triangles combining into a larger one, illustrating a compound angle.',
      generation_prompt: heroPrompt(
        'Two glowing right-angled triangles drawn nose to tail so their angles add, forming a larger triangle. Thin luminous construction lines show how the two smaller angles combine into one.'
      ),
    }),
    b('text', 1, {
      markdown:
        'Trigonometry has hundreds of identities. Physics uses about eight of them, over and over.\n\n' +
        'This page collects exactly those. You are not expected to prove any of them here — that is the job of the Maths course. You are expected to **recognise when one will simplify a physics expression**, which is a different and more practical skill.',
    }),
    b('heading', 2, {
      text: 'The three you already know',
      level: 2,
      objective: 'State the Pythagorean identities and use them to swap between sin and cos.',
    }),
    b('text', 3, {
      markdown:
        '$ \\sin^2\\theta + \\cos^2\\theta = 1 $\n\n' +
        '$ 1 + \\tan^2\\theta = \\sec^2\\theta $\n\n' +
        '$ 1 + \\cot^2\\theta = \\mathrm{cosec}^2\\theta $\n\n' +
        'The first one is the workhorse. Its real use is **swapping**: any time an expression has both $ \\sin\\theta $ and $ \\cos\\theta $ in an awkward mixture, this lets you write everything in terms of just one of them.',
    }),
    b('heading', 4, {
      text: 'Compound angles — when two angles add',
      level: 2,
      objective: 'Expand sin(A ± B) and cos(A ± B) correctly, including the sign flip in cosine.',
    }),
    b('table', 5, {
      caption: 'The compound-angle formulas. Watch the sign in the cosine pair — it flips.',
      headers: ['Formula', 'The trap'],
      rows: [
        ['$ \\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B $', 'Signs match the left-hand side'],
        ['$ \\sin(A-B) = \\sin A\\cos B - \\cos A\\sin B $', 'Signs match the left-hand side'],
        ['$ \\cos(A+B) = \\cos A\\cos B - \\sin A\\sin B $', '**Plus outside becomes minus inside**'],
        ['$ \\cos(A-B) = \\cos A\\cos B + \\sin A\\sin B $', '**Minus outside becomes plus inside**'],
        ['$ \\tan(A+B) = \\dfrac{\\tan A + \\tan B}{1 - \\tan A\\tan B} $', 'The denominator carries the opposite sign'],
      ],
    }),
    b('callout', 6, {
      variant: 'exam_tip',
      title: 'The cosine sign flip',
      markdown:
        'Sine keeps the sign. Cosine reverses it. That single sentence is worth more marks than any derivation.\n\n' +
        'A quick self-check that takes three seconds: put $ A = B = 0 $. Then $ \\cos(0+0) = 1 $, and the right-hand side must give $ 1 \\times 1 - 0 \\times 0 = 1 $. It works. If you had used a plus, you would still get 1 — so instead test $ A = B = 90° $: $ \\cos 180° = -1 $, and $ 0 \\times 0 - 1 \\times 1 = -1 $. Correct. The plus version would have given $ +1 $, which is wrong.',
    }),
    b('heading', 7, {
      text: 'Double and triple angles',
      level: 2,
      objective: 'Recall the double-angle forms, especially the three versions of cos 2θ.',
    }),
    b('text', 8, {
      markdown:
        'Put $ B = A $ into the compound formulas and you get:\n\n' +
        '$ \\sin 2\\theta = 2\\sin\\theta\\cos\\theta $\n\n' +
        '$ \\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = 1 - 2\\sin^2\\theta = 2\\cos^2\\theta - 1 $\n\n' +
        'Those three versions of $ \\cos 2\\theta $ are all the same thing, rewritten using $ \\sin^2 + \\cos^2 = 1 $. Pick whichever one matches what is already in your expression.\n\n' +
        'The triple-angle pair turn up occasionally:\n\n' +
        '$ \\sin 3\\theta = 3\\sin\\theta - 4\\sin^3\\theta $\n\n' +
        '$ \\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta $',
    }),
    b('callout', 9, {
      variant: 'fun_fact',
      title: 'Where sin 2θ pays for itself',
      markdown:
        'The range of a projectile launched at angle $ \\theta $ with speed $ u $ is\n\n' +
        '$ R = \\dfrac{u^2 \\sin 2\\theta}{g} $\n\n' +
        'Since $ \\sin $ is largest at $ 90° $, the range is largest when $ 2\\theta = 90° $, i.e. $ \\theta = 45° $.\n\n' +
        'That famous result — throw at 45° for maximum distance — is nothing but the double-angle formula doing its job.',
    }),
    b('heading', 10, {
      text: 'Sums into products, and the triangle rules',
      level: 2,
      objective: 'Use the sum-to-product form and apply the sine and cosine rules to non-right triangles.',
    }),
    b('text', 11, {
      markdown:
        'When two waves of nearly equal frequency add, this identity produces the beats you hear:\n\n' +
        '$ \\sin A + \\sin B = 2\\sin\\!\\left(\\dfrac{A+B}{2}\\right)\\cos\\!\\left(\\dfrac{A-B}{2}\\right) $\n\n' +
        'And two rules for triangles that are **not** right-angled — both of which come back when you add vectors:\n\n' +
        '**Sine rule:** $ \\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} $\n\n' +
        '**Cosine rule:** $ c^2 = a^2 + b^2 - 2ab\\cos C $\n\n' +
        'Keep the cosine rule in mind. In Unit C it reappears almost unchanged as the formula for the magnitude of a resultant vector — the only difference is a plus sign, because vectors are joined tip-to-tail rather than closing a triangle.',
    }),
    b('worked_example', 12, {
      label: 'Example 1',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Find the exact value of $ \\cos 15° $.',
      solution:
        'Write $ 15° $ as the difference of two angles whose values you already know.\n\n' +
        '$ 15° = 45° - 30° $\n\n' +
        'Use $ \\cos(A - B) = \\cos A\\cos B + \\sin A\\sin B $ — remember the sign flips to a plus.\n\n' +
        '$ \\cos 15° = \\cos 45°\\cos 30° + \\sin 45°\\sin 30° $\n\n' +
        '$ = \\dfrac{1}{\\sqrt{2}} \\times \\dfrac{\\sqrt{3}}{2} + \\dfrac{1}{\\sqrt{2}} \\times \\dfrac{1}{2} $\n\n' +
        '$ = \\dfrac{\\sqrt{3} + 1}{2\\sqrt{2}} \\approx 0.966 $\n\n' +
        'Sanity check: $ 15° $ is a small angle, so its cosine should be close to 1. It is.',
    }),
    b('worked_example', 13, {
      label: 'Example 2',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: 'Simplify $ \\dfrac{\\sin 2\\theta}{1 + \\cos 2\\theta} $.',
      solution:
        'Choose the versions of the double-angle formulas that will let something cancel.\n\n' +
        'For the top, use $ \\sin 2\\theta = 2\\sin\\theta\\cos\\theta $.\n\n' +
        'For the bottom, pick the version of $ \\cos 2\\theta $ that removes the 1. Using $ \\cos 2\\theta = 2\\cos^2\\theta - 1 $:\n\n' +
        '$ 1 + \\cos 2\\theta = 1 + 2\\cos^2\\theta - 1 = 2\\cos^2\\theta $\n\n' +
        'Now divide:\n\n' +
        '$ \\dfrac{2\\sin\\theta\\cos\\theta}{2\\cos^2\\theta} = \\dfrac{\\sin\\theta}{\\cos\\theta} = \\tan\\theta $\n\n' +
        'The skill here was not the algebra — it was **choosing the right one of the three $ \\cos 2\\theta $ forms**. Always pick the one that cancels what is next to it.',
    }),
    b('inline_quiz', 14, {
      pass_threshold: 0.7,
      questions: [
        q('$ \\cos(A + B) $ equals:',
          ['$ \\cos A\\cos B + \\sin A\\sin B $', '$ \\sin A\\cos B + \\cos A\\sin B $', '$ \\cos A + \\cos B $', '$ \\cos A\\cos B - \\sin A\\sin B $'],
          3,
          'Cosine reverses the sign: a plus outside becomes a minus inside. The two tempting wrong answers are $ \\cos(A-B) $, which keeps the plus, and $ \\sin(A+B) $, which is the sine expansion.',
          2),
        q('If $ \\sin\\theta = \\dfrac{3}{5} $, then $ \\sin 2\\theta $ equals:',
          ['$ \\dfrac{6}{5} $', '$ \\dfrac{9}{25} $', '$ \\dfrac{12}{25} $', '$ \\dfrac{24}{25} $'],
          3,
          'First $ \\cos\\theta = 4/5 $ from the 3-4-5 triangle. Then $ \\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2 \\times \\tfrac{3}{5} \\times \\tfrac{4}{5} = \\tfrac{24}{25} $. Note that $ \\sin 2\\theta $ can never exceed 1, which rules out the first option immediately.',
          3),
        q('A projectile has maximum range at $ 45° $ because:',
          ['$ \\sin 45° $ is maximum', '$ \\sin 2\\theta $ is maximum when $ \\theta = 45° $', '$ \\cos 45° = \\sin 45° $', 'Gravity is weakest at $ 45° $'],
          1,
          'Range depends on $ \\sin 2\\theta $, which peaks when $ 2\\theta = 90° $, so $ \\theta = 45° $. It is the double angle that matters, not $ \\sin\\theta $ itself.',
          2),
      ],
    }),
    b('text', 15, {
      markdown: 'One more trigonometry page — the approximation that makes small angles disappear from your working entirely.',
    }),
  ],
};

// ═══ 12 ── Unit A Practice Arena ═════════════════════════════════════════════
const page12 = {
  page_number: 12,
  slug: 'unit-a-practice-arena',
  title: 'Unit A — Practice Arena',
  subtitle: 'Everything from Basic Maths, in one place',
  page_type: 'practice',
  blocks: [
    b('text', 0, {
      markdown:
        'Work through these in order. The first three sections drill one skill at a time; the last section mixes them, which is how they will actually arrive in an exam.\n\n' +
        'Do not read the solutions until you have committed to an answer. Getting it wrong and then seeing why is worth far more than reading a correct solution you never attempted.',
    }),
    b('practice_bank', 1, {
      title: 'Unit A drill',
      intro: 'Section A is warm-up. Section D is exam-level.',
      sections: [
        {
          id: 'ua-algebra',
          title: 'A · Algebra — rearranging, quadratics, simultaneous equations',
          blurb: 'One skill at a time. Speed matters here, not cleverness.',
          items: [
            pmcq('ua-alg-01',
              'Rearranged for $ a $, the equation $ v^2 = u^2 + 2as $ gives:',
              ['$ a = \\dfrac{v^2 - u^2}{2s} $', '$ a = \\dfrac{v^2 + u^2}{2s} $', '$ a = \\dfrac{v - u}{2s} $', '$ a = 2s(v^2 - u^2) $'],
              0,
              'Subtract $ u^2 $ from both sides to get $ v^2 - u^2 = 2as $, then divide by $ 2s $.'),
            pmcq('ua-alg-02',
              'The roots of $ t^2 - 7t + 12 = 0 $ are:',
              ['$ 3 $ and $ 4 $', '$ -3 $ and $ -4 $', '$ 2 $ and $ 6 $', '$ 1 $ and $ 12 $'],
              0,
              'Two numbers multiplying to 12 and adding to 7 are 3 and 4, so $ (t-3)(t-4) = 0 $.'),
            pmcq('ua-alg-03',
              'The equation $ 3t^2 - 4t + 5 = 0 $ has:',
              ['Two distinct real roots', 'One repeated real root', 'No real roots', 'Two negative real roots'],
              2,
              '$ D = 16 - 4(3)(5) = 16 - 60 = -44 $. A negative discriminant means no real root — physically, the event never happens.'),
            pnum('ua-alg-04',
              'Solve simultaneously: $ 2x + 3y = 13 $ and $ x - y = 1 $.',
              '$ x = 3.2 $, $ y = 2.2 $',
              'From the second equation, $ x = y + 1 $. Substitute into the first:\n\n' +
              '$ 2(y+1) + 3y = 13 $\n\n' +
              '$ 2y + 2 + 3y = 13 \\Rightarrow 5y = 11 \\Rightarrow y = 2.2 $\n\n' +
              'Then $ x = y + 1 = 3.2 $.\n\n' +
              'Always substitute back into the *other* equation to check: $ 2(3.2) + 3(2.2) = 6.4 + 6.6 = 13 $. Correct.'),
            pnum('ua-alg-05',
              'A ball is thrown up at $ 30 $ m/s. Taking $ g = 10 $ m/s², find the two times at which it is $ 40 $ m high.',
              '$ t = 2 $ s and $ t = 4 $ s',
              '$ 40 = 30t - 5t^2 \\Rightarrow 5t^2 - 30t + 40 = 0 \\Rightarrow t^2 - 6t + 8 = 0 $\n\n' +
              '$ (t-2)(t-4) = 0 \\Rightarrow t = 2\\ \\mathrm{s} $ or $ 4\\ \\mathrm{s} $.\n\n' +
              'Both are positive, so both are real events: 2 s on the way up, 4 s on the way down.'),
          ],
        },
        {
          id: 'ua-graphs',
          title: 'B · Graphs — shapes, slopes and transformations',
          blurb: 'Recognise first, calculate second.',
          items: [
            pmcq('ua-gr-01',
              'A straight-line graph of $ y $ against $ x $ passes through $ (1,\\,5) $ and $ (3,\\,11) $. Its slope is:',
              ['$ 2 $', '$ 3 $', '$ 6 $', '$ 8 $'],
              1,
              '$ m = \\dfrac{11-5}{3-1} = \\dfrac{6}{2} = 3 $.'),
            pmcq('ua-gr-02',
              'The graph of $ y = (x+2)^2 - 1 $ is the graph of $ y = x^2 $ moved:',
              ['2 right and 1 up', '2 left and 1 up', '2 right and 1 down', '2 left and 1 down'],
              3,
              'Inside the bracket the sign reverses, so $ +2 $ moves it 2 units **left**. The $ -1 $ outside moves it 1 unit down.'),
            pmcq('ua-gr-03',
              'For a body with $ v = 4 + 2t $, the velocity–time graph is a straight line whose slope represents:',
              ['Displacement', 'Acceleration', 'Initial velocity', 'Distance'],
              1,
              'The slope of a velocity–time graph is always acceleration. Here it is $ 2 $ m/s². The intercept 4 is the initial velocity.'),
            pmcq('ua-gr-04',
              'Which curve does $ y = \\dfrac{6}{x} $ produce?',
              ['A parabola', 'A straight line through the origin', 'A rectangular hyperbola', 'A circle'],
              2,
              '$ xy = 6 $ is a constant product, which is the rectangular hyperbola — the same shape as Boyle\'s law.'),
            pnum('ua-gr-05',
              'A curve rises from $ y = 2 $ at $ x = 0 $ and flattens towards $ y = 10 $. Write a possible equation for it.',
              '$ y = 10 - 8e^{-kx} $',
              'A curve that rises to a ceiling $ L $ has the form $ y = L - Ae^{-kx} $.\n\n' +
              'The ceiling is 10, so $ y = 10 - Ae^{-kx} $.\n\n' +
              'At $ x = 0 $: $ y = 10 - A = 2 $, so $ A = 8 $.\n\n' +
              '$ y = 10 - 8e^{-kx} $, with $ k $ any positive constant — its value only controls how fast the curve flattens.'),
          ],
        },
        {
          id: 'ua-trig',
          title: 'C · Trigonometry — angles, ratios and identities',
          blurb: 'These must become automatic. Time yourself.',
          items: [
            pmcq('ua-tr-01',
              '$ 150° $ expressed in radians is:',
              ['$ \\dfrac{5\\pi}{6} $', '$ \\dfrac{2\\pi}{3} $', '$ \\dfrac{3\\pi}{4} $', '$ \\dfrac{5\\pi}{3} $'],
              0,
              '$ 150 \\times \\dfrac{\\pi}{180} = \\dfrac{5\\pi}{6} $.'),
            pmcq('ua-tr-02',
              '$ \\sin(A - B) $ equals:',
              ['$ \\sin A\\cos B + \\cos A\\sin B $', '$ \\cos A\\cos B + \\sin A\\sin B $', '$ \\sin A - \\sin B $', '$ \\sin A\\cos B - \\cos A\\sin B $'],
              3,
              'Sine keeps the sign of the left-hand side, so the minus stays a minus. The option $ \\cos A\\cos B + \\sin A\\sin B $ is $ \\cos(A-B) $, not a sine expansion at all.'),
            pmcq('ua-tr-03',
              'An arc of length $ 2\\pi $ cm subtends an angle of $ 60° $ at the centre. The radius is:',
              ['$ 3 $ cm', '$ 6 $ cm', '$ 12 $ cm', '$ 2 $ cm'],
              1,
              'Convert first: $ 60° = \\pi/3 $ rad. Then $ r = \\dfrac{s}{\\theta} = \\dfrac{2\\pi}{\\pi/3} = 6 $ cm.'),
            pnum('ua-tr-04',
              'Using the small-angle approximation, estimate $ \\dfrac{\\sin 1°}{\\cos 2°} $.',
              '$ \\dfrac{\\pi}{180} $',
              'For small angles measured in **radians**, $ \\sin\\theta \\approx \\theta $ and $ \\cos\\theta \\approx 1 $.\n\n' +
              'Convert $ 1° $ to radians: $ 1° = \\dfrac{\\pi}{180} $ rad, so $ \\sin 1° \\approx \\dfrac{\\pi}{180} $.\n\n' +
              'And $ \\cos 2° \\approx 1 $.\n\n' +
              '$ \\dfrac{\\sin 1°}{\\cos 2°} \\approx \\dfrac{\\pi/180}{1} = \\dfrac{\\pi}{180} $\n\n' +
              'The single most common error here is forgetting to convert to radians first — the approximation is simply false in degrees.'),
            pnum('ua-tr-05',
              'Find the exact value of $ \\sin 75° $.',
              '$ \\dfrac{\\sqrt{3}+1}{2\\sqrt{2}} $',
              'Write $ 75° = 45° + 30° $ and use $ \\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B $.\n\n' +
              '$ \\sin 75° = \\sin 45°\\cos 30° + \\cos 45°\\sin 30° $\n\n' +
              '$ = \\dfrac{1}{\\sqrt{2}} \\times \\dfrac{\\sqrt{3}}{2} + \\dfrac{1}{\\sqrt{2}} \\times \\dfrac{1}{2} = \\dfrac{\\sqrt{3}+1}{2\\sqrt{2}} \\approx 0.966 $\n\n' +
              'Notice this equals $ \\cos 15° $ — as it must, since $ \\sin 75° = \\cos(90° - 75°) $.'),
          ],
        },
        {
          id: 'ua-mixed',
          title: 'D · Mixed — no clues about which tool to use',
          blurb: 'Exam conditions. Nothing tells you which page the question came from.',
          items: [
            pmcq('ua-mx-01',
              'A body\'s position is $ x = 3t^2 - 12t + 5 $ (metres, seconds). At what time does it return to $ x = 5 $ m?',
              ['$ t = 2 $ s', '$ t = 4 $ s', '$ t = 6 $ s', 'It never returns'],
              1,
              'Set $ 3t^2 - 12t + 5 = 5 $, giving $ 3t^2 - 12t = 0 $, so $ 3t(t-4) = 0 $. The roots are $ t = 0 $ (the start) and $ t = 4 $ s (the return).'),
            pmcq('ua-mx-02',
              'A quantity falls from 80 units, halving every 5 seconds. Which shape describes it?',
              ['Straight line with negative slope', 'Parabola opening downward', 'Exponential decay curve', 'Rectangular hyperbola'],
              2,
              'Falling by the same *fraction* in equal time intervals is exactly exponential decay: $ N = 80\\,e^{-\\lambda t} $. A straight line would fall by the same *amount* each interval, which is different.'),
            pmcq('ua-mx-03',
              'The range formula is $ R = \\dfrac{u^2\\sin 2\\theta}{g} $. Two angles give the same range. If one is $ 30° $, the other is:',
              ['$ 45° $', '$ 75° $', '$ 15° $', '$ 60° $'],
              3,
              'The ranges match when $ \\sin 2\\theta $ matches. $ \\sin 60° = \\sin 120° $, so $ 2\\theta = 120° $ gives $ \\theta = 60° $. In general the two angles add to $ 90° $.'),
            pnum('ua-mx-04',
              'A wheel of radius $ 0.2 $ m rolls without slipping through $ 5 $ complete turns. How far does its centre move?',
              '$ 2\\pi \\approx 6.28 $ m',
              'Rolling without slipping means the distance moved equals the arc length that has unrolled.\n\n' +
              'Five turns is $ \\theta = 5 \\times 2\\pi = 10\\pi $ rad.\n\n' +
              '$ s = r\\theta = 0.2 \\times 10\\pi = 2\\pi \\approx 6.28\\ \\mathrm{m} $\n\n' +
              'Equivalently: five circumferences, $ 5 \\times 2\\pi(0.2) = 2\\pi $ m. Both routes agree.'),
            pnum('ua-mx-05',
              'The intensity of light falls as $ I = \\dfrac{k}{r^2} $. What should be plotted against what to get a straight line, and what would its slope be?',
              'Plot $ I $ against $ \\dfrac{1}{r^2} $; slope $ = k $',
              'Compare with $ y = mx + c $. Let $ y = I $ and $ x = \\dfrac{1}{r^2} $.\n\n' +
              'Then $ I = k \\times \\dfrac{1}{r^2} $ is $ y = kx $ — a straight line through the origin with slope $ k $.\n\n' +
              'This is the straightening trick from Graphs I: find the substitution that removes the power, and the curve becomes a line you can measure accurately.'),
          ],
        },
      ],
    }),
    b('callout', 2, {
      variant: 'note',
      title: 'End of Unit A',
      markdown:
        'That is the algebra, the graphs and the trigonometry you need. None of it was new mathematics — but it now has to be **fast**.\n\n' +
        'Unit B is different. Differentiation and integration are genuinely new, and they are the tools that turn a position into a velocity, and a velocity back into a distance.',
    }),
  ],
};

const PAGES = [page4, page5, page6, page7, page8, page10, page12];
module.exports = { PAGES };

// Guard is load-bearing: the dry-run script `require()`s this file, and without
// it the require alone would insert the pages (it did, once).
if (require.main === module) {
  withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, PAGES);
  }).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
