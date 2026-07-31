'use strict';
/* Class 11 Math · Ch.3 Trigonometric Functions — Recap (page 9) + Practice (page 10).
   Practice page mirrors the Ch.2 practice-bank CONTRACT exactly: a single practice_bank
   block holding ALL 52 NCERT Ch.3 exercise questions (Ex 3.1 ×7, Ex 3.2 ×10, Ex 3.3 ×25,
   Miscellaneous ×10), sourced verbatim from the NCERT PDF, regrouped into 6 revision
   themes, each with a full worked solution independently re-derived and verified by hand
   (every identity/answer below was checked step-by-step against the source before writing —
   see MATH_CH3_TRIGONOMETRIC_FUNCTIONS_PLAN.md for the source inventory).
   Additive + idempotent. published:false.
   Run: node scripts/math11-book/build_ch3_recap_practice.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch3');
const { v4: uuidv4 } = require('uuid');

/* ── Page 9 — Recap (retrieval-first, mirrors Ch.2 page9 pattern) ────────── */
const p9 = [
  b('image', 0, {
    src: '', alt: 'A concept map of trigonometric functions glowing on a dark background, a unit circle at its centre',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing unit circle sits at the centre of a concept map, with lines ' +
      'radiating out to smaller nodes labelled with graph shapes, a sign-quadrant grid, and formula fragments. ' +
      'Violet and amber glow on a deep near-black background, elegant mind-map style. No readable text beyond a ' +
      'few node labels.',
  }),
  b('text', 1, {
    markdown:
      'Don’t just re-read — **retrieve**. Cover the answers and try each prompt before you check.\n\n' +
      '**The chapter in one line:** measure the angle (degree or radian) → put a point on the unit circle and ' +
      'read its height and shadow (*sin*, *cos*) → build the other four as ratios/reciprocals → track *sign* by ' +
      'quadrant and *shape* on a graph → *expand* what happens when two angles combine → *solve* for every angle ' +
      'that fits.',
  }),
  b('text', 2, {
    markdown:
      '**Formula card**\n\n' +
      '| Identity | Formula |\n|---|---|\n' +
      '| Pythagorean | $ \\sin^2x + \\cos^2x = 1,\\ \\ 1+\\tan^2x=\\sec^2x,\\ \\ 1+\\cot^2x=\\csc^2x $ |\n' +
      '| Sum/difference | $ \\sin(x{\\pm}y)=\\sin x\\cos y \\pm \\cos x\\sin y $;\\ $ \\cos(x{\\pm}y)=\\cos x' +
      '\\cos y \\mp \\sin x\\sin y $ |\n' +
      '| Double angle | $ \\sin 2x = 2\\sin x\\cos x $;\\ $ \\cos 2x = 1-2\\sin^2x = 2\\cos^2x - 1 $ |\n' +
      '| Sum-to-product | $ \\sin x \\pm \\sin y = 2\\sin\\frac{x\\pm y}{2}\\cos\\frac{x\\mp y}{2} $ (cosine ' +
      'versions swap in a minus for the difference) |\n' +
      '| General solutions | $ \\sin\\theta=\\sin\\alpha \\Rightarrow \\theta=n\\pi+(-1)^n\\alpha $;\\ ' +
      '$ \\cos\\theta=\\cos\\alpha \\Rightarrow \\theta=2n\\pi\\pm\\alpha $;\\ $ \\tan\\theta=\\tan\\alpha ' +
      '\\Rightarrow \\theta=n\\pi+\\alpha $ |',
  }),
  b('text', 3, {
    markdown:
      '**Traps worth memorising**\n\n' +
      '| Don’t confuse… | …with |\n|---|---|\n' +
      '| $ \\sin(\\pi - x) = \\sin x $ | $ \\sin(\\pi + x) = -\\sin x $ — same-looking, opposite sign |\n' +
      '| $ \\cos(x+y) $ subtracts | $ \\sin(x+y) $ adds — swapping these is the #1 slip |\n' +
      '| Range of sec, cosec is $ y\\ge1 $ or $ y\\le-1 $ | $ [-1,1] $ — that’s sin/cos’s range, not theirs |\n' +
      '| $ \\sin\\theta=\\sin\\alpha $ needs $ (-1)^n $ | $ \\cos\\theta=\\cos\\alpha $ needs $ \\pm $ instead |\n' +
      '| $ l = r\\theta $ needs $ \\theta $ **in radians** | plugging in degrees silently gives a wrong length |\n' +
      '| tan/cot period is $ \\pi $ | sin/cos/sec/cosec period is $ 2\\pi $ — half as long |',
  }),
  b('reasoning_prompt', 4, {
    reasoning_type: 'logical',
    prompt: 'A friend says “sin(π + x) and sin(π − x) are the same thing, just written differently.” Right or wrong?',
    options: ['Right — they’re equal', 'Wrong — sin(π−x) = sin x but sin(π+x) = −sin x, opposite signs'],
    reveal:
      'Wrong. $ \\pi - x $ and $ \\pi + x $ land at mirror points across the y-axis and the origin respectively — ' +
      'they are NOT the same angle, and their sines are opposite in sign.',
    difficulty_level: 2,
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'quantitative',
    prompt: 'Quick recall: what is the period of cot x?',
    options: ['2π', 'π', 'π/2', '4π'],
    reveal: 'π — half of sin/cos’s 2π, the same shorter period tan x has.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.7,
    questions: [
      q('What is 150° in radian measure?', ['π/6', '5π/6', '3π/4', '2π/3'],
        1, '150 × π/180 = 5π/6.', 1),
      q('For the point (a, b) on the unit circle at angle x, cos x equals…',
        ['a', 'b', 'a + b', 'ab'], 0, 'cos x is the x-coordinate — the shadow.', 1),
      q('In which quadrant is tan x positive but sin x negative?',
        ['I', 'II', 'III', 'IV'], 2,
        'Quadrant III: sin and cos are both negative there, so their ratio tan is positive — but sin itself stays negative.', 2),
      q('What is the range of tan x?',
        ['[−1, 1]', 'all real numbers', 'y ≥ 1 or y ≤ −1', '[0, ∞)'],
        1, 'Unlike sin/cos, tan x is unbounded — it shoots to ±∞ near its vertical breaks.', 1),
      q('cos(x − y) expands to…',
        ['cos x cos y − sin x sin y', 'cos x cos y + sin x sin y', 'sin x cos y − cos x sin y', 'cos x cos y + sin x cos y'],
        1, 'The DIFFERENCE formula for cosine flips to a plus: cos x cos y + sin x sin y.', 2),
      q('Using sin 2x = 2 sin x cos x, if sin x = 3/5 and cos x = 4/5, what is sin 2x?',
        ['7/5', '24/25', '12/25', '1'],
        1, 'sin 2x = 2 × (3/5) × (4/5) = 24/25.', 2),
      q('cos x + cos y turns into a product as…',
        ['2 cos((x+y)/2) cos((x−y)/2)', '2 sin((x+y)/2) sin((x−y)/2)', '2 cos(x+y) cos(x−y)', 'cos x cos y'],
        0, 'Sum-to-product: cos x + cos y = 2 cos((x+y)/2) cos((x−y)/2) — both factors are cosines here (the ' +
        'minus-sign version, cos x − cos y, is the one that turns into sines).', 3),
      q('The general solution of cos θ = 0 is…',
        ['θ = nπ', 'θ = nπ + π/2', 'θ = 2nπ ± π/2', 'θ = nπ + (−1)ⁿ(π/2)'],
        2, 'cos θ = cos(π/2) = 0, so θ = 2nπ ± π/2 — the standard cos θ = cos α form with α = π/2.', 3),
    ],
  }),
  b('text', 7, {
    markdown:
      '**Take it to the exercises.** Work NCERT **Exercise 3.1** (angles), **3.2** (the six ratios and ' +
      'periodicity), **3.3** (identities) and the **Miscellaneous Exercise**, all waiting on the next page — ' +
      'interleaved into mixed themes rather than textbook order, so you’re training *recognition*, not just ' +
      'repetition.',
  }),
];

/* ── Page 10 — Practice: all 52 NCERT exercises ──────────────────────────── */
const num = (source_label, prompt, answer, solution) =>
  ({ id: uuidv4(), kind: 'numerical', source: 'ncert_exercise', source_label, prompt, answer, solution });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ── S1 — Angle conversion & arc length (Ex 3.1, 7 Qs) ───────────────────── */
const s1 = sec(
  'Angle conversion & arc length',
  'Ex 3.1 — degree ↔ radian conversions, and the l = rθ formula in real settings.',
  [
    num('NCERT Ex 3.1 · Q1',
      'Find the radian measures corresponding to the following degree measures: (i) $ 25° $ (ii) $ -47°30' + "'" + ' $ (iii) $ 240° $ (iv) $ 520° $.',
      '(i) $ 5\\pi/36 $  (ii) $ -19\\pi/72 $  (iii) $ 4\\pi/3 $  (iv) $ 26\\pi/9 $',
      'Multiply each degree value by $ \\frac{\\pi}{180} $, simplifying the fraction as you go.\n\n' +
      '(i) $ 25 \\times \\frac{\\pi}{180} = \\frac{25\\pi}{180} = \\frac{5\\pi}{36} $.\n\n' +
      '(ii) First turn the minutes into a decimal: $ -47°30' + "'" + ' = -\\left(47 + \\frac12\\right)° = ' +
      '-\\frac{95}{2}° $. Then $ -\\frac{95}{2} \\times \\frac{\\pi}{180} = -\\frac{95\\pi}{360} = -\\frac{19\\pi}{72} $.\n\n' +
      '(iii) $ 240 \\times \\frac{\\pi}{180} = \\frac{240\\pi}{180} = \\frac{4\\pi}{3} $.\n\n' +
      '(iv) $ 520 \\times \\frac{\\pi}{180} = \\frac{520\\pi}{180} = \\frac{26\\pi}{9} $.'),
    num('NCERT Ex 3.1 · Q2',
      'Find the degree measures corresponding to the following radian measures (use $ \\pi = 22/7 $): (i) $ 11\\pi/16 $ (ii) $ -4 $ (iii) $ 5\\pi/3 $ (iv) $ 7\\pi/6 $.',
      '(i) $ 123°45' + "'" + ' $  (ii) $ \\approx -229°5' + "'" + '27\\text{\'\'} $  (iii) $ 300° $  (iv) $ 210° $',
      'Multiply each radian value by $ \\frac{180}{\\pi} $.\n\n' +
      '(i) $ \\frac{11\\pi}{16} \\times \\frac{180}{\\pi} = \\frac{11 \\times 180}{16} = \\frac{1980}{16} = 123.75° ' +
      '= 123° + 0.75 \\times 60' + "'" + ' = 123°45' + "'" + ' $.\n\n' +
      '(ii) $ -4 \\times \\frac{180}{\\pi} $, using $ \\pi = \\frac{22}{7} $: $ -4 \\times \\frac{180 \\times 7}{22} ' +
      '= -\\frac{5040}{22} \\approx -229.09° $. The leftover $ 0.09° $ splits into minutes and seconds: ' +
      '$ 0.09 \\times 60 \\approx 5.45' + "'" + ' $, then $ 0.45 \\times 60 \\approx 27\\text{\'\'} $ — so ' +
      '$ \\approx -229°5' + "'" + '27\\text{\'\'} $.\n\n' +
      '(iii) $ \\frac{5\\pi}{3} \\times \\frac{180}{\\pi} = \\frac{5 \\times 180}{3} = 300° $.\n\n' +
      '(iv) $ \\frac{7\\pi}{6} \\times \\frac{180}{\\pi} = \\frac{7 \\times 180}{6} = 210° $.'),
    num('NCERT Ex 3.1 · Q3',
      'A wheel makes 360 revolutions in one minute. Through how many radians does it turn in one second?',
      '$ 12\\pi $ radian',
      '360 revolutions per minute is $ \\frac{360}{60} = 6 $ revolutions per **second**.\n\n' +
      'Each revolution is $ 2\\pi $ radian, so in one second the wheel turns $ 6 \\times 2\\pi = 12\\pi $ radian.'),
    num('NCERT Ex 3.1 · Q4',
      'Find the degree measure of the angle subtended at the centre of a circle of radius 100 cm by an arc of length 22 cm (use $ \\pi = 22/7 $).',
      '$ 12°36' + "'" + ' $',
      'First find the angle in radians: $ \\theta = \\frac{l}{r} = \\frac{22}{100} = 0.22 $ radian.\n\n' +
      'Convert to degrees: $ 0.22 \\times \\frac{180}{\\pi} $, with $ \\pi = \\frac{22}{7} $: $ 0.22 \\times ' +
      '\\frac{180 \\times 7}{22} = 0.22 \\times \\frac{1260}{22} = \\frac{277.2}{22} = 12.6° = 12° + 0.6 \\times 60' + "'" + ' = 12°36' + "'" + ' $.'),
    num('NCERT Ex 3.1 · Q5',
      'In a circle of diameter 40 cm, the length of a chord is 20 cm. Find the length of minor arc of the chord.',
      '$ \\approx 20\\frac{20}{21} $ cm (using $ \\pi = 22/7 $)',
      'The radius is half the diameter: $ r = 20 $ cm — which is exactly equal to the chord length. A triangle ' +
      'with two sides equal to the radius and the third side (the chord) ALSO equal to the radius is ' +
      '**equilateral**, so the central angle is $ 60° = \\frac{\\pi}{3} $ radian.\n\n' +
      'Arc length $ l = r\\theta = 20 \\times \\frac{\\pi}{3} $. Using $ \\pi = \\frac{22}{7} $: ' +
      '$ 20 \\times \\frac{22}{21} = \\frac{440}{21} \\approx 20.95 $ cm.'),
    num('NCERT Ex 3.1 · Q6',
      'If in two circles, arcs of the same length subtend angles 60° and 75° at the centre, find the ratio of their radii.',
      '$ r_1 : r_2 = 5 : 4 $',
      'Equal arc lengths means $ r_1\\theta_1 = r_2\\theta_2 $, so $ \\frac{r_1}{r_2} = \\frac{\\theta_2}{\\theta_1} $ ' +
      '— the SMALLER angle needs the BIGGER radius to sweep the same arc.\n\n' +
      '$ \\theta_1 = 60° = \\frac{\\pi}{3} $, $ \\theta_2 = 75° = \\frac{5\\pi}{12} $.\n\n' +
      '$ \\frac{r_1}{r_2} = \\dfrac{5\\pi/12}{\\pi/3} = \\frac{5}{12} \\times 3 = \\frac{5}{4} $. So ' +
      '$ r_1 : r_2 = 5 : 4 $.'),
    num('NCERT Ex 3.1 · Q7',
      'Find the angle in radian through which a pendulum swings if its length is 75 cm and the tip describes an arc of length (i) 10 cm (ii) 15 cm (iii) 21 cm.',
      '(i) $ 2/15 $  (ii) $ 1/5 $  (iii) $ 7/25 $ (all in radian)',
      'Each part is a direct $ \\theta = l/r $ with $ r = 75 $ cm.\n\n' +
      '(i) $ \\theta = \\frac{10}{75} = \\frac{2}{15} $ radian.\n\n' +
      '(ii) $ \\theta = \\frac{15}{75} = \\frac{1}{5} $ radian.\n\n' +
      '(iii) $ \\theta = \\frac{21}{75} = \\frac{7}{25} $ radian.'),
  ],
);

/* ── S2 — Given one ratio, find the other five (Ex 3.2 Q1-5) ─────────────── */
const s2 = sec(
  'Given one ratio, find the other five',
  'Ex 3.2 (Q1–5) — one ratio plus a quadrant is always enough to recover all six.',
  [
    num('NCERT Ex 3.2 · Q1',
      'Find the values of the other five trigonometric functions: $ \\cos x = -\\frac12 $, $ x $ lies in the third quadrant.',
      '$ \\sin x = -\\frac{\\sqrt3}{2},\\ \\csc x = -\\frac{2}{\\sqrt3},\\ \\sec x = -2,\\ \\tan x = \\sqrt3,\\ \\cot x = \\frac{1}{\\sqrt3} $',
      'Reciprocal: $ \\sec x = \\frac{1}{\\cos x} = -2 $.\n\n' +
      'Pythagorean identity: $ \\sin^2x = 1 - \\cos^2x = 1 - \\frac14 = \\frac34 $, so $ \\sin x = \\pm\\frac{\\sqrt3}{2} $. ' +
      'Third quadrant → sine negative: $ \\sin x = -\\frac{\\sqrt3}{2} $, and $ \\csc x = -\\frac{2}{\\sqrt3} $.\n\n' +
      '$ \\tan x = \\dfrac{\\sin x}{\\cos x} = \\dfrac{-\\sqrt3/2}{-1/2} = \\sqrt3 $, and $ \\cot x = \\dfrac{1}{\\sqrt3} $.'),
    num('NCERT Ex 3.2 · Q2',
      'Find the values of the other five trigonometric functions: $ \\sin x = \\frac35 $, $ x $ lies in the second quadrant.',
      '$ \\csc x = \\frac53,\\ \\cos x = -\\frac45,\\ \\sec x = -\\frac54,\\ \\tan x = -\\frac34,\\ \\cot x = -\\frac43 $',
      'Reciprocal: $ \\csc x = \\frac53 $.\n\n' +
      '$ \\cos^2x = 1 - \\frac{9}{25} = \\frac{16}{25} $, so $ \\cos x = \\pm\\frac45 $. Second quadrant → cosine ' +
      'negative: $ \\cos x = -\\frac45 $, $ \\sec x = -\\frac54 $.\n\n' +
      '$ \\tan x = \\dfrac{3/5}{-4/5} = -\\frac34 $, $ \\cot x = -\\frac43 $.'),
    num('NCERT Ex 3.2 · Q3',
      'Find the values of the other five trigonometric functions: $ \\cot x = \\frac34 $, $ x $ lies in the third quadrant.',
      '$ \\tan x = \\frac43,\\ \\csc x = -\\frac54,\\ \\sin x = -\\frac45,\\ \\sec x = -\\frac53,\\ \\cos x = -\\frac35 $',
      'Reciprocal: $ \\tan x = \\frac43 $.\n\n' +
      '$ \\csc^2x = 1 + \\cot^2x = 1 + \\frac{9}{16} = \\frac{25}{16} $, so $ \\csc x = \\pm\\frac54 $. Third ' +
      'quadrant → sine (and cosec) negative: $ \\csc x = -\\frac54 $, $ \\sin x = -\\frac45 $.\n\n' +
      '$ \\sec^2x = 1 + \\tan^2x = 1 + \\frac{16}{9} = \\frac{25}{9} $, so $ \\sec x = \\pm\\frac53 $. Third ' +
      'quadrant → cosine negative too: $ \\sec x = -\\frac53 $, $ \\cos x = -\\frac35 $.'),
    num('NCERT Ex 3.2 · Q4',
      'Find the values of the other five trigonometric functions: $ \\sec x = \\frac{13}{5} $, $ x $ lies in the fourth quadrant.',
      '$ \\cos x = \\frac{5}{13},\\ \\tan x = -\\frac{12}{5},\\ \\cot x = -\\frac{5}{12},\\ \\sin x = -\\frac{12}{13},\\ \\csc x = -\\frac{13}{12} $',
      'Reciprocal: $ \\cos x = \\frac{5}{13} $.\n\n' +
      '$ \\tan^2x = \\sec^2x - 1 = \\frac{169}{25} - 1 = \\frac{144}{25} $, so $ \\tan x = \\pm\\frac{12}{5} $. ' +
      'Fourth quadrant → tan negative: $ \\tan x = -\\frac{12}{5} $, $ \\cot x = -\\frac{5}{12} $.\n\n' +
      '$ \\sin x = \\tan x \\cdot \\cos x = \\left(-\\frac{12}{5}\\right)\\left(\\frac{5}{13}\\right) = -\\frac{12}{13} $, ' +
      '$ \\csc x = -\\frac{13}{12} $.'),
    num('NCERT Ex 3.2 · Q5',
      'Find the values of the other five trigonometric functions: $ \\tan x = -\\frac{5}{12} $, $ x $ lies in the second quadrant.',
      '$ \\cot x = -\\frac{12}{5},\\ \\sec x = -\\frac{13}{12},\\ \\cos x = -\\frac{12}{13},\\ \\sin x = \\frac{5}{13},\\ \\csc x = \\frac{13}{5} $',
      'Reciprocal: $ \\cot x = -\\frac{12}{5} $.\n\n' +
      '$ \\sec^2x = 1 + \\tan^2x = 1 + \\frac{25}{144} = \\frac{169}{144} $, so $ \\sec x = \\pm\\frac{13}{12} $. ' +
      'Second quadrant → cosine negative: $ \\sec x = -\\frac{13}{12} $, $ \\cos x = -\\frac{12}{13} $.\n\n' +
      '$ \\sin x = \\tan x \\cdot \\cos x = \\left(-\\frac{5}{12}\\right)\\left(-\\frac{12}{13}\\right) = \\frac{5}{13} $ ' +
      '— positive, as it must be in the second quadrant. $ \\csc x = \\frac{13}{5} $.'),
  ],
);

/* ── S3 — Evaluate via periodicity / large angles (Ex 3.2 Q6-10) ─────────── */
const s3 = sec(
  'Evaluate via periodicity',
  'Ex 3.2 (Q6–10) — strip off whole revolutions first, then read the standard angle left over.',
  [
    num('NCERT Ex 3.2 · Q6', 'Find the value of $ \\sin 765° $.', '$ \\frac{1}{\\sqrt2} $',
      '$ 765° = 720° + 45° = 2 \\times 360° + 45° $ — two full extra revolutions.\n\n' +
      '$ \\sin 765° = \\sin 45° = \\dfrac{1}{\\sqrt2} $.'),
    num('NCERT Ex 3.2 · Q7', 'Find the value of $ \\csc(-1410°) $.', '2',
      '$ \\csc(-\\theta) = -\\csc\\theta $, so first find $ \\csc(1410°) $.\n\n' +
      '$ 1410° = 1080° + 330° = 3 \\times 360° + 330° $. And $ 330° = 360° - 30° $, so $ \\csc 330° = ' +
      '\\csc(-30°) = -\\csc 30° = -2 $.\n\n' +
      'So $ \\csc(1410°) = -2 $, hence $ \\csc(-1410°) = -(-2) = 2 $.'),
    num('NCERT Ex 3.2 · Q8', 'Find the value of $ \\tan\\dfrac{19\\pi}{3} $.', '$ \\sqrt3 $',
      '$ \\frac{19\\pi}{3} = 6\\pi + \\frac{\\pi}{3} $ — and $ 6\\pi $ is a whole number of extra $ \\pi $-periods ' +
      'for tan (tan repeats every $ \\pi $, and $ 6\\pi $ is 6 full extra periods).\n\n' +
      '$ \\tan\\frac{19\\pi}{3} = \\tan\\frac{\\pi}{3} = \\sqrt3 $.'),
    num('NCERT Ex 3.2 · Q9', 'Find the value of $ \\sin\\left(-\\dfrac{11\\pi}{3}\\right) $.', '$ \\frac{\\sqrt3}{2} $',
      '$ \\sin(-\\theta) = -\\sin\\theta $, so find $ \\sin\\frac{11\\pi}{3} $ first.\n\n' +
      '$ \\frac{11\\pi}{3} = 4\\pi - \\frac{\\pi}{3} $, and $ 4\\pi $ is two full extra revolutions ($ 2 \\times 2\\pi $), ' +
      'so $ \\sin\\frac{11\\pi}{3} = \\sin\\left(-\\frac{\\pi}{3}\\right) = -\\frac{\\sqrt3}{2} $.\n\n' +
      'Hence $ \\sin\\left(-\\frac{11\\pi}{3}\\right) = -\\left(-\\frac{\\sqrt3}{2}\\right) = \\frac{\\sqrt3}{2} $.'),
    num('NCERT Ex 3.2 · Q10', 'Find the value of $ \\cot\\left(-\\dfrac{15\\pi}{4}\\right) $.', '1',
      '$ \\cot(-\\theta) = -\\cot\\theta $, so find $ \\cot\\frac{15\\pi}{4} $ first.\n\n' +
      '$ \\frac{15\\pi}{4} = 4\\pi - \\frac{\\pi}{4} $. Since cot repeats every $ \\pi $, and $ 4\\pi $ is 4 whole ' +
      'extra periods, $ \\cot\\frac{15\\pi}{4} = \\cot\\left(-\\frac{\\pi}{4}\\right) = -\\cot\\frac{\\pi}{4} = -1 $.\n\n' +
      'Hence $ \\cot\\left(-\\frac{15\\pi}{4}\\right) = -(-1) = 1 $.'),
  ],
);

/* ── S4 — Evaluate & prove: addition/multiple-angle (Ex 3.3 Q1-11) ───────── */
const s4 = sec(
  'Evaluate & prove — addition formulas',
  'Ex 3.3 (Q1–11) — plugging standard angles into the identities, then the first identity proofs.',
  [
    num('NCERT Ex 3.3 · Q1', 'Prove that $ \\sin^2\\frac{\\pi}{6} + \\cos^2\\frac{\\pi}{3} - \\tan^2\\frac{\\pi}{4} = -\\frac12 $.',
      'Verified: L.H.S. $ = -\\frac12 $',
      '$ \\sin\\frac{\\pi}{6} = \\frac12 \\Rightarrow \\sin^2 = \\frac14 $. $ \\cos\\frac{\\pi}{3} = \\frac12 ' +
      '\\Rightarrow \\cos^2 = \\frac14 $. $ \\tan\\frac{\\pi}{4} = 1 \\Rightarrow \\tan^2 = 1 $.\n\n' +
      'Sum: $ \\frac14 + \\frac14 - 1 = \\frac12 - 1 = -\\frac12 $. ✓'),
    num('NCERT Ex 3.3 · Q2', 'Prove that $ 2\\sin^2\\frac{\\pi}{6} + \\csc^2\\frac{7\\pi}{6}\\cos^2\\frac{\\pi}{3} = \\frac32 $.',
      'Verified: L.H.S. $ = \\frac32 $',
      '$ 2\\sin^2\\frac{\\pi}{6} = 2 \\times \\frac14 = \\frac12 $.\n\n' +
      'For $ \\csc\\frac{7\\pi}{6} $: $ \\frac{7\\pi}{6} = \\pi + \\frac{\\pi}{6} $, and $ \\sin(\\pi+x) = -\\sin x $, ' +
      'so $ \\sin\\frac{7\\pi}{6} = -\\frac12 $, giving $ \\csc\\frac{7\\pi}{6} = -2 $, so $ \\csc^2\\frac{7\\pi}{6} = 4 $.\n\n' +
      '$ \\cos^2\\frac{\\pi}{3} = \\frac14 $, so the second term is $ 4 \\times \\frac14 = 1 $.\n\n' +
      'Sum: $ \\frac12 + 1 = \\frac32 $. ✓'),
    num('NCERT Ex 3.3 · Q3', 'Prove that $ \\cot^2\\frac{\\pi}{6} + \\csc\\frac{5\\pi}{6} + 3\\tan^2\\frac{\\pi}{6} = 6 $.',
      'Verified: L.H.S. $ = 6 $',
      '$ \\cot\\frac{\\pi}{6} = \\sqrt3 \\Rightarrow \\cot^2 = 3 $.\n\n' +
      'For $ \\csc\\frac{5\\pi}{6} $: $ \\frac{5\\pi}{6} = \\pi - \\frac{\\pi}{6} $, and $ \\sin(\\pi-x)=\\sin x $, so ' +
      '$ \\sin\\frac{5\\pi}{6} = \\sin\\frac{\\pi}{6} = \\frac12 $, giving $ \\csc\\frac{5\\pi}{6} = 2 $.\n\n' +
      '$ \\tan\\frac{\\pi}{6} = \\frac{1}{\\sqrt3} \\Rightarrow \\tan^2 = \\frac13 $, so $ 3\\tan^2 = 1 $.\n\n' +
      'Sum: $ 3 + 2 + 1 = 6 $. ✓'),
    num('NCERT Ex 3.3 · Q4', 'Prove that $ 2\\sin^2\\frac{3\\pi}{4} + 2\\cos^2\\frac{\\pi}{4} + 2\\sec^2\\frac{\\pi}{3} = 10 $.',
      'Verified: L.H.S. $ = 10 $',
      '$ \\sin\\frac{3\\pi}{4} = \\frac{1}{\\sqrt2} \\Rightarrow \\sin^2 = \\frac12 $, so $ 2\\sin^2 = 1 $.\n\n' +
      '$ \\cos\\frac{\\pi}{4} = \\frac{1}{\\sqrt2} \\Rightarrow \\cos^2 = \\frac12 $, so $ 2\\cos^2 = 1 $.\n\n' +
      '$ \\sec\\frac{\\pi}{3} = 2 \\Rightarrow \\sec^2 = 4 $, so $ 2\\sec^2 = 8 $.\n\n' +
      'Sum: $ 1 + 1 + 8 = 10 $. ✓'),
    num('NCERT Ex 3.3 · Q5', 'Find the value of: (i) $ \\sin 75° $ (ii) $ \\tan 15° $.',
      '(i) $ \\frac{\\sqrt6+\\sqrt2}{4} $  (ii) $ 2 - \\sqrt3 $',
      '(i) $ 75° = 45° + 30° $. $ \\sin75° = \\sin45°\\cos30° + \\cos45°\\sin30° = \\frac{1}{\\sqrt2}\\cdot' +
      '\\frac{\\sqrt3}{2} + \\frac{1}{\\sqrt2}\\cdot\\frac12 = \\frac{\\sqrt3+1}{2\\sqrt2} = \\frac{\\sqrt6+\\sqrt2}{4} $.\n\n' +
      '(ii) $ 15° = 45° - 30° $. $ \\tan15° = \\dfrac{\\tan45°-\\tan30°}{1+\\tan45°\\tan30°} = \\dfrac{1 - ' +
      '\\frac{1}{\\sqrt3}}{1 + \\frac{1}{\\sqrt3}} = \\dfrac{\\sqrt3-1}{\\sqrt3+1} = 2 - \\sqrt3 $ (rationalise by ' +
      'multiplying by $ \\sqrt3-1 $ top and bottom).'),
    num('NCERT Ex 3.3 · Q6', 'Prove that $ \\cos\\left(\\frac{\\pi}{4}-x\\right)\\cos\\left(\\frac{\\pi}{4}-y\\right) - \\sin\\left(\\frac{\\pi}{4}-x\\right)\\sin\\left(\\frac{\\pi}{4}-y\\right) = \\sin(x+y) $.',
      'Verified — an application of cos(A+B)',
      'The left side has the exact shape of $ \\cos A\\cos B - \\sin A\\sin B = \\cos(A+B) $, with $ A = ' +
      '\\frac{\\pi}{4}-x $ and $ B = \\frac{\\pi}{4}-y $.\n\n' +
      'So L.H.S. $ = \\cos\\left[\\left(\\frac{\\pi}{4}-x\\right)+\\left(\\frac{\\pi}{4}-y\\right)\\right] = ' +
      '\\cos\\left(\\frac{\\pi}{2}-x-y\\right) = \\cos\\left(\\frac{\\pi}{2}-(x+y)\\right) = \\sin(x+y) $, using ' +
      '$ \\cos(\\pi/2-\\theta) = \\sin\\theta $.'),
    num('NCERT Ex 3.3 · Q7', 'Prove that $ \\dfrac{\\tan\\left(\\frac{\\pi}{4}+x\\right)}{\\tan\\left(\\frac{\\pi}{4}-x\\right)} = \\left(\\dfrac{1+\\tan x}{1-\\tan x}\\right)^2 $.',
      'Verified — direct substitution',
      'Expand both using the addition formula for tangent (with $ \\tan\\frac{\\pi}{4} = 1 $):\n\n' +
      '$ \\tan\\left(\\frac{\\pi}{4}+x\\right) = \\dfrac{1+\\tan x}{1-\\tan x} $, and $ \\tan\\left(\\frac{\\pi}{4}-x\\right) ' +
      '= \\dfrac{1-\\tan x}{1+\\tan x} $.\n\n' +
      'Dividing the first by the second flips the second fraction: $ \\dfrac{1+\\tan x}{1-\\tan x} \\times ' +
      '\\dfrac{1+\\tan x}{1-\\tan x} = \\left(\\dfrac{1+\\tan x}{1-\\tan x}\\right)^2 $.'),
    num('NCERT Ex 3.3 · Q8', 'Prove that $ \\dfrac{\\cos(\\pi+x)\\cos(-x)}{\\sin(\\pi-x)\\cos\\left(\\frac{\\pi}{2}+x\\right)} = \\cot^2x $.',
      'Verified — reduction formulas',
      'Reduce each factor using the standard reduction formulas: $ \\cos(\\pi+x) = -\\cos x $, ' +
      '$ \\cos(-x) = \\cos x $, $ \\sin(\\pi-x) = \\sin x $, $ \\cos\\left(\\frac{\\pi}{2}+x\\right) = -\\sin x $.\n\n' +
      'Numerator: $ (-\\cos x)(\\cos x) = -\\cos^2x $. Denominator: $ (\\sin x)(-\\sin x) = -\\sin^2x $.\n\n' +
      'Ratio: $ \\dfrac{-\\cos^2x}{-\\sin^2x} = \\dfrac{\\cos^2x}{\\sin^2x} = \\cot^2x $.'),
    num('NCERT Ex 3.3 · Q9', 'Prove that $ \\cos\\left(\\frac{3\\pi}{2}+x\\right)\\cos(2\\pi+x)\\left[\\cot\\left(\\frac{3\\pi}{2}-x\\right)+\\cot(2\\pi+x)\\right] = 1 $.',
      'Verified — reduces to sinx·cosx·(1/(sinx cosx))',
      'Reduce each piece: $ \\cos\\left(\\frac{3\\pi}{2}+x\\right) = \\sin x $, $ \\cos(2\\pi+x) = \\cos x $, ' +
      '$ \\cot\\left(\\frac{3\\pi}{2}-x\\right) = \\tan x $, and $ \\cot(2\\pi+x) = \\cot x $.\n\n' +
      'The bracket becomes $ \\tan x + \\cot x = \\dfrac{\\sin x}{\\cos x} + \\dfrac{\\cos x}{\\sin x} = ' +
      '\\dfrac{\\sin^2x+\\cos^2x}{\\sin x\\cos x} = \\dfrac{1}{\\sin x\\cos x} $.\n\n' +
      'So the whole expression is $ \\sin x \\cdot \\cos x \\cdot \\dfrac{1}{\\sin x\\cos x} = 1 $.'),
    num('NCERT Ex 3.3 · Q10', 'Prove that $ \\sin(n{+}1)x\\,\\sin(n{+}2)x + \\cos(n{+}1)x\\,\\cos(n{+}2)x = \\cos x $.',
      'Verified — an application of cos(A−B)',
      'This matches $ \\cos A\\cos B + \\sin A\\sin B = \\cos(A-B) $ with $ A=(n{+}2)x $ and $ B=(n{+}1)x $ ' +
      '(the order of the two products on the left doesn’t matter — multiplication commutes).\n\n' +
      'So the sum equals $ \\cos\\left[(n{+}2)x - (n{+}1)x\\right] = \\cos x $.'),
    num('NCERT Ex 3.3 · Q11', 'Prove that $ \\cos\\left(\\frac{3\\pi}{4}+x\\right) - \\cos\\left(\\frac{3\\pi}{4}-x\\right) = -\\sqrt2\\sin x $.',
      'Verified — sum-to-product with C = 3π/4+x, D = 3π/4−x',
      'Use $ \\cos C - \\cos D = -2\\sin\\frac{C+D}{2}\\sin\\frac{C-D}{2} $ with $ C = \\frac{3\\pi}{4}+x $, ' +
      '$ D = \\frac{3\\pi}{4}-x $: then $ \\frac{C+D}{2} = \\frac{3\\pi}{4} $ and $ \\frac{C-D}{2} = x $.\n\n' +
      '$ = -2\\sin\\frac{3\\pi}{4}\\sin x = -2 \\times \\frac{1}{\\sqrt2} \\times \\sin x = -\\sqrt2\\sin x $.'),
  ],
);

/* ── S5 — Prove: sum-to-product transformations (Ex 3.3 Q12-25) ──────────── */
const s5 = sec(
  'Prove — sum-to-product transformations',
  'Ex 3.3 (Q12–25) — every one of these cracks open once you turn a sum/difference into a product.',
  [
    num('NCERT Ex 3.3 · Q12', 'Prove that $ \\sin^26x - \\sin^24x = \\sin2x\\sin10x $.',
      'Verified — sin²A − sin²B = sin(A+B)sin(A−B), A=6x, B=4x',
      'There’s a shortcut identity here: $ \\sin^2A - \\sin^2B = (\\sin A-\\sin B)(\\sin A+\\sin B) $, and ' +
      'expanding each factor with sum-to-product and multiplying back gives $ \\sin^2A-\\sin^2B = \\sin(A{+}B)\\sin(A{-}B) $.\n\n' +
      'With $ A=6x, B=4x $: $ \\sin^26x-\\sin^24x = \\sin(10x)\\sin(2x) = \\sin2x\\sin10x $.'),
    num('NCERT Ex 3.3 · Q13', 'Prove that $ \\cos^22x - \\cos^26x = \\sin4x\\sin8x $.',
      'Verified — cos²A − cos²B = −sin(A+B)sin(A−B), A=2x, B=6x',
      'Similarly, $ \\cos^2A-\\cos^2B = -\\sin(A{+}B)\\sin(A{-}B) $ (the extra minus sign is the one difference ' +
      'from the sine version above).\n\n' +
      'With $ A=2x, B=6x $: $ A{+}B=8x $, $ A{-}B=-4x $, so $ \\cos^22x-\\cos^26x = -\\sin8x\\sin(-4x) = \\sin8x\\sin4x $.'),
    num('NCERT Ex 3.3 · Q14', 'Prove that $ \\sin2x+2\\sin4x+\\sin6x = 4\\cos^2x\\sin4x $.',
      'Verified',
      'Pair the outer terms: $ \\sin2x+\\sin6x = 2\\sin4x\\cos2x $ (half-sum $ = 4x $, half-difference $ = -2x $, ' +
      'cosine is even so $ \\cos(-2x)=\\cos2x $).\n\n' +
      'So L.H.S. $ = 2\\sin4x\\cos2x + 2\\sin4x = 2\\sin4x(\\cos2x+1) $. Now $ \\cos2x+1 = 2\\cos^2x $, giving ' +
      '$ 2\\sin4x \\times 2\\cos^2x = 4\\cos^2x\\sin4x $.'),
    num('NCERT Ex 3.3 · Q15', 'Prove that $ \\cot4x(\\sin5x+\\sin3x) = \\cot x(\\sin5x-\\sin3x) $.',
      'Verified — both sides reduce to 2 cos x cos 4x',
      'L.H.S.: $ \\sin5x+\\sin3x = 2\\sin4x\\cos x $, so $ \\cot4x \\times 2\\sin4x\\cos x = 2\\cos x\\cos4x $ ' +
      '(since $ \\cot4x\\sin4x=\\cos4x $).\n\n' +
      'R.H.S.: $ \\sin5x-\\sin3x = 2\\cos4x\\sin x $, so $ \\cot x \\times 2\\cos4x\\sin x = 2\\cos4x\\cos x $ ' +
      '(since $ \\cot x\\sin x=\\cos x $).\n\n' +
      'Both sides equal $ 2\\cos x\\cos4x $.'),
    num('NCERT Ex 3.3 · Q16', 'Prove that $ \\dfrac{\\cos9x-\\cos5x}{\\sin17x-\\sin3x} = -\\dfrac{\\sin2x}{\\cos10x} $.',
      'Verified',
      'Numerator: $ \\cos9x-\\cos5x = -2\\sin7x\\sin2x $.\n\n' +
      'Denominator: $ \\sin17x-\\sin3x = 2\\cos10x\\sin7x $.\n\n' +
      'Cancel $ \\sin7x $ (common to both): $ \\dfrac{-2\\sin7x\\sin2x}{2\\cos10x\\sin7x} = -\\dfrac{\\sin2x}{\\cos10x} $.'),
    num('NCERT Ex 3.3 · Q17', 'Prove that $ \\dfrac{\\sin5x+\\sin3x}{\\cos5x+\\cos3x} = \\tan4x $.',
      'Verified',
      'Numerator: $ \\sin5x+\\sin3x = 2\\sin4x\\cos x $.\n\n' +
      'Denominator: $ \\cos5x+\\cos3x = 2\\cos4x\\cos x $.\n\n' +
      'Cancel $ 2\\cos x $: $ \\dfrac{\\sin4x}{\\cos4x} = \\tan4x $.'),
    num('NCERT Ex 3.3 · Q18', 'Prove that $ \\dfrac{\\sin x-\\sin y}{\\cos x+\\cos y} = \\tan\\dfrac{x-y}{2} $.',
      'Verified',
      'Numerator: $ \\sin x-\\sin y = 2\\cos\\frac{x+y}{2}\\sin\\frac{x-y}{2} $.\n\n' +
      'Denominator: $ \\cos x+\\cos y = 2\\cos\\frac{x+y}{2}\\cos\\frac{x-y}{2} $.\n\n' +
      'Cancel $ 2\\cos\\frac{x+y}{2} $: $ \\dfrac{\\sin\\frac{x-y}{2}}{\\cos\\frac{x-y}{2}} = \\tan\\dfrac{x-y}{2} $.'),
    num('NCERT Ex 3.3 · Q19', 'Prove that $ \\dfrac{\\sin x+\\sin3x}{\\cos x+\\cos3x} = \\tan2x $.',
      'Verified',
      'Numerator: $ \\sin x+\\sin3x = 2\\sin2x\\cos x $.\n\n' +
      'Denominator: $ \\cos x+\\cos3x = 2\\cos2x\\cos x $.\n\n' +
      'Cancel $ 2\\cos x $: $ \\dfrac{\\sin2x}{\\cos2x} = \\tan2x $.'),
    num('NCERT Ex 3.3 · Q20', 'Prove that $ \\dfrac{\\sin x-\\sin3x}{\\sin^2x-\\cos^2x} = 2\\sin x $.',
      'Verified',
      'Numerator: $ \\sin x-\\sin3x = 2\\cos2x\\sin(-x) = -2\\cos2x\\sin x $.\n\n' +
      'Denominator: $ \\sin^2x-\\cos^2x = -(\\cos^2x-\\sin^2x) = -\\cos2x $.\n\n' +
      'Ratio: $ \\dfrac{-2\\cos2x\\sin x}{-\\cos2x} = 2\\sin x $.'),
    num('NCERT Ex 3.3 · Q21', 'Prove that $ \\dfrac{\\cos4x+\\cos3x+\\cos2x}{\\sin4x+\\sin3x+\\sin2x} = \\cot3x $.',
      'Verified',
      'Numerator: pair the outer terms, $ \\cos4x+\\cos2x = 2\\cos3x\\cos x $, so the numerator is $ 2\\cos3x\\cos x ' +
      '+ \\cos3x = \\cos3x(2\\cos x+1) $.\n\n' +
      'Denominator: similarly $ \\sin4x+\\sin2x = 2\\sin3x\\cos x $, so the denominator is $ \\sin3x(2\\cos x+1) $.\n\n' +
      'Cancel $ (2\\cos x+1) $: $ \\dfrac{\\cos3x}{\\sin3x} = \\cot3x $.'),
    num('NCERT Ex 3.3 · Q22', 'Prove that $ \\cot x\\cot2x - \\cot2x\\cot3x - \\cot3x\\cot x = 1 $.',
      'Verified — from writing 2x = 3x − x',
      'Since $ 2x = 3x-x $, use the difference formula $ \\cot(A-B) = \\dfrac{\\cot A\\cot B+1}{\\cot B-\\cot A} $ ' +
      'with $ A=3x, B=x $: $ \\cot2x = \\dfrac{\\cot3x\\cot x+1}{\\cot x-\\cot3x} $.\n\n' +
      'Cross-multiply: $ \\cot2x(\\cot x-\\cot3x) = \\cot3x\\cot x+1 $, i.e. $ \\cot x\\cot2x-\\cot2x\\cot3x = ' +
      '\\cot3x\\cot x+1 $.\n\n' +
      'Rearranged: $ \\cot x\\cot2x-\\cot2x\\cot3x-\\cot3x\\cot x = 1 $ — exactly the identity.'),
    num('NCERT Ex 3.3 · Q23', 'Prove that $ \\tan4x = \\dfrac{4\\tan x(1-\\tan^2x)}{1-6\\tan^2x+\\tan^4x} $.',
      'Verified — double the double-angle formula',
      'Write $ 4x = 2(2x) $ and let $ t=\\tan x $, so $ \\tan2x = \\dfrac{2t}{1-t^2} $.\n\n' +
      '$ \\tan4x = \\dfrac{2\\tan2x}{1-\\tan^22x} = \\dfrac{2 \\cdot \\frac{2t}{1-t^2}}{1 - \\frac{4t^2}{(1-t^2)^2}} $.\n\n' +
      'Multiply top and bottom by $ (1-t^2)^2 $: numerator becomes $ 4t(1-t^2) $, denominator becomes ' +
      '$ (1-t^2)^2-4t^2 = 1-2t^2+t^4-4t^2 = 1-6t^2+t^4 $.\n\n' +
      'So $ \\tan4x = \\dfrac{4t(1-t^2)}{1-6t^2+t^4} = \\dfrac{4\\tan x(1-\\tan^2x)}{1-6\\tan^2x+\\tan^4x} $.'),
    num('NCERT Ex 3.3 · Q24', 'Prove that $ \\cos4x = 1-8\\sin^2x\\cos^2x $.',
      'Verified — cos4x = 1 − 2sin²(2x)',
      'Use $ \\cos2\\theta = 1-2\\sin^2\\theta $ with $ \\theta=2x $: $ \\cos4x = 1-2\\sin^22x $.\n\n' +
      '$ \\sin2x = 2\\sin x\\cos x $, so $ \\sin^22x = 4\\sin^2x\\cos^2x $.\n\n' +
      '$ \\cos4x = 1 - 2(4\\sin^2x\\cos^2x) = 1-8\\sin^2x\\cos^2x $.'),
    num('NCERT Ex 3.3 · Q25', 'Prove that $ \\cos6x = 32\\cos^6x - 48\\cos^4x + 18\\cos^2x - 1 $.',
      'Verified — cos6x = 2cos²3x − 1, then expand cos3x',
      'Use $ \\cos2\\theta=2\\cos^2\\theta-1 $ with $ \\theta=3x $: $ \\cos6x = 2\\cos^23x - 1 $.\n\n' +
      'Now $ \\cos3x = 4\\cos^3x-3\\cos x $, so $ \\cos^23x = (4\\cos^3x-3\\cos x)^2 = 16\\cos^6x - 24\\cos^4x + 9\\cos^2x $.\n\n' +
      '$ 2\\cos^23x = 32\\cos^6x - 48\\cos^4x + 18\\cos^2x $, so $ \\cos6x = 32\\cos^6x-48\\cos^4x+18\\cos^2x-1 $.'),
  ],
);

/* ── S6 — Miscellaneous: bringing it together (Misc Q1-10) ───────────────── */
const s6 = sec(
  'Miscellaneous — bringing it together',
  'The Miscellaneous Exercise — identity proofs that mix every tool, then half-angle values.',
  [
    num('NCERT Misc · Q1', 'Prove that $ 2\\cos\\frac{\\pi}{13}\\cos\\frac{9\\pi}{13} + \\cos\\frac{3\\pi}{13} + \\cos\\frac{5\\pi}{13} = 0 $.',
      'Verified',
      'Turn the product into a sum: $ 2\\cos\\frac{\\pi}{13}\\cos\\frac{9\\pi}{13} = \\cos\\frac{10\\pi}{13} + ' +
      '\\cos\\frac{8\\pi}{13} $ (using $ 2\\cos A\\cos B=\\cos(A{+}B)+\\cos(A{-}B) $).\n\n' +
      'Now reduce each: $ \\cos\\frac{10\\pi}{13} = \\cos\\left(\\pi-\\frac{3\\pi}{13}\\right) = -\\cos\\frac{3\\pi}{13} $, ' +
      'and $ \\cos\\frac{8\\pi}{13} = \\cos\\left(\\pi-\\frac{5\\pi}{13}\\right) = -\\cos\\frac{5\\pi}{13} $.\n\n' +
      'So the product term equals $ -\\cos\\frac{3\\pi}{13}-\\cos\\frac{5\\pi}{13} $, which exactly cancels the ' +
      'other two terms in the expression, leaving $ 0 $.'),
    num('NCERT Misc · Q2', 'Prove that $ (\\sin3x+\\sin x)\\sin x + (\\cos3x-\\cos x)\\cos x = 0 $.',
      'Verified',
      'Expand directly: $ \\sin3x\\sin x + \\sin^2x + \\cos3x\\cos x - \\cos^2x $.\n\n' +
      'Group the first and third terms: $ \\cos3x\\cos x+\\sin3x\\sin x = \\cos(3x-x) = \\cos2x $.\n\n' +
      'The remaining $ \\sin^2x-\\cos^2x = -\\cos2x $.\n\n' +
      'Total: $ \\cos2x - \\cos2x = 0 $.'),
    num('NCERT Misc · Q3', 'Prove that $ (\\cos x+\\cos y)^2 + (\\sin x-\\sin y)^2 = 4\\cos^2\\dfrac{x+y}{2} $.',
      'Verified',
      'Expand both squares and add: $ \\cos^2x+2\\cos x\\cos y+\\cos^2y+\\sin^2x-2\\sin x\\sin y+\\sin^2y $.\n\n' +
      'Group the Pythagorean pairs: $ (\\cos^2x+\\sin^2x)+(\\cos^2y+\\sin^2y) = 1+1=2 $, leaving ' +
      '$ 2+2(\\cos x\\cos y-\\sin x\\sin y) = 2+2\\cos(x+y) $.\n\n' +
      'Using $ 1+\\cos\\theta = 2\\cos^2\\frac{\\theta}{2} $: $ 2(1+\\cos(x+y)) = 2 \\times 2\\cos^2\\frac{x+y}{2} = ' +
      '4\\cos^2\\dfrac{x+y}{2} $.'),
    num('NCERT Misc · Q4', 'Prove that $ (\\cos x-\\cos y)^2 + (\\sin x-\\sin y)^2 = 4\\sin^2\\dfrac{x-y}{2} $.',
      'Verified',
      'Expand and add: $ 2 - 2(\\cos x\\cos y+\\sin x\\sin y) = 2 - 2\\cos(x-y) $ (same steps as Q3, but with a ' +
      'minus sign throughout so the cross terms combine to $ \\cos(x-y) $ instead).\n\n' +
      'Using $ 1-\\cos\\theta = 2\\sin^2\\frac{\\theta}{2} $: $ 2(1-\\cos(x-y)) = 4\\sin^2\\dfrac{x-y}{2} $.'),
    num('NCERT Misc · Q5', 'Prove that $ \\sin x+\\sin3x+\\sin5x+\\sin7x = 4\\cos x\\cos2x\\sin4x $.',
      'Verified',
      'Pair the ends: $ \\sin x+\\sin7x = 2\\sin4x\\cos3x $, and the middle pair $ \\sin3x+\\sin5x = 2\\sin4x\\cos x $.\n\n' +
      'Sum: $ 2\\sin4x(\\cos3x+\\cos x) = 2\\sin4x \\times 2\\cos2x\\cos x = 4\\cos x\\cos2x\\sin4x $.'),
    num('NCERT Misc · Q6', 'Prove that $ \\dfrac{(\\sin7x+\\sin5x)+(\\sin9x+\\sin3x)}{(\\cos7x+\\cos5x)+(\\cos9x+\\cos3x)} = \\tan6x $.',
      'Verified',
      'Numerator: $ \\sin7x+\\sin5x=2\\sin6x\\cos x $ and $ \\sin9x+\\sin3x=2\\sin6x\\cos3x $; sum $ = ' +
      '2\\sin6x(\\cos x+\\cos3x) = 2\\sin6x \\times 2\\cos2x\\cos x = 4\\sin6x\\cos2x\\cos x $.\n\n' +
      'Denominator: by the same steps with cosines, $ = 4\\cos6x\\cos2x\\cos x $.\n\n' +
      'Ratio: $ \\dfrac{\\sin6x}{\\cos6x} = \\tan6x $.'),
    num('NCERT Misc · Q7', 'Prove that $ \\sin3x+\\sin2x-\\sin x = 4\\sin x\\cos\\dfrac{x}{2}\\cos\\dfrac{3x}{2} $.',
      'Verified',
      '$ \\sin3x-\\sin x = 2\\cos2x\\sin x $, so L.H.S. $ = 2\\cos2x\\sin x + \\sin2x = \\sin x(2\\cos2x) + ' +
      '2\\sin x\\cos x = 2\\sin x(\\cos2x+\\cos x) $.\n\n' +
      'Now $ \\cos2x+\\cos x = 2\\cos\\frac{3x}{2}\\cos\\frac{x}{2} $, so L.H.S. $ = 2\\sin x \\times ' +
      '2\\cos\\frac{3x}{2}\\cos\\frac{x}{2} = 4\\sin x\\cos\\frac{x}{2}\\cos\\frac{3x}{2} $.'),
    num('NCERT Misc · Q8', 'Find $ \\sin\\frac{x}{2},\\ \\cos\\frac{x}{2},\\ \\tan\\frac{x}{2} $ for $ \\tan x = -\\frac43 $, $ x $ in quadrant II.',
      '$ \\sin\\frac{x}{2} = \\frac{2}{\\sqrt5},\\ \\cos\\frac{x}{2} = \\frac{1}{\\sqrt5},\\ \\tan\\frac{x}{2} = 2 $',
      'Quadrant II means $ 90°<x<180° $, so $ 45°<\\frac{x}{2}<90° $ — $ \\frac{x}{2} $ is in quadrant I, where ' +
      'ALL of sin, cos, tan are positive.\n\n' +
      '$ \\sec^2x = 1+\\tan^2x = 1+\\frac{16}{9} = \\frac{25}{9} $, so $ \\sec x = \\pm\\frac53 $; quadrant II ' +
      'makes cosine negative, so $ \\sec x=-\\frac53 $, $ \\cos x=-\\frac35 $.\n\n' +
      '$ 2\\sin^2\\frac{x}{2} = 1-\\cos x = 1+\\frac35 = \\frac85 \\Rightarrow \\sin^2\\frac{x}{2}=\\frac45 ' +
      '\\Rightarrow \\sin\\frac{x}{2} = \\frac{2}{\\sqrt5} $ (positive, quadrant I).\n\n' +
      '$ 2\\cos^2\\frac{x}{2} = 1+\\cos x = 1-\\frac35 = \\frac25 \\Rightarrow \\cos^2\\frac{x}{2}=\\frac15 ' +
      '\\Rightarrow \\cos\\frac{x}{2} = \\frac{1}{\\sqrt5} $ (positive).\n\n' +
      '$ \\tan\\frac{x}{2} = \\dfrac{2/\\sqrt5}{1/\\sqrt5} = 2 $.'),
    num('NCERT Misc · Q9', 'Find $ \\sin\\frac{x}{2},\\ \\cos\\frac{x}{2},\\ \\tan\\frac{x}{2} $ for $ \\cos x = -\\frac13 $, $ x $ in quadrant III.',
      '$ \\sin\\frac{x}{2} = \\frac{\\sqrt6}{3},\\ \\cos\\frac{x}{2} = -\\frac{\\sqrt3}{3},\\ \\tan\\frac{x}{2} = -\\sqrt2 $',
      'Quadrant III means $ 180°<x<270° $, so $ 90°<\\frac{x}{2}<135° $ — $ \\frac{x}{2} $ is in quadrant II: ' +
      'sine positive, cosine (and tan) negative.\n\n' +
      '$ 2\\sin^2\\frac{x}{2} = 1-\\cos x = 1+\\frac13 = \\frac43 \\Rightarrow \\sin^2\\frac{x}{2} = \\frac23 ' +
      '\\Rightarrow \\sin\\frac{x}{2} = \\sqrt{\\frac23} = \\frac{\\sqrt6}{3} $ (positive, Q2).\n\n' +
      '$ 2\\cos^2\\frac{x}{2} = 1+\\cos x = 1-\\frac13 = \\frac23 \\Rightarrow \\cos^2\\frac{x}{2} = \\frac13 ' +
      '\\Rightarrow \\cos\\frac{x}{2} = -\\frac{1}{\\sqrt3} = -\\frac{\\sqrt3}{3} $ (negative, Q2).\n\n' +
      '$ \\tan\\frac{x}{2} = \\dfrac{\\sqrt6/3}{-\\sqrt3/3} = -\\dfrac{\\sqrt6}{\\sqrt3} = -\\sqrt2 $.'),
    num('NCERT Misc · Q10', 'Find $ \\sin\\frac{x}{2},\\ \\cos\\frac{x}{2},\\ \\tan\\frac{x}{2} $ for $ \\sin x = \\frac14 $, $ x $ in quadrant II.',
      '$ \\sin\\frac{x}{2} = \\sqrt{\\frac{4+\\sqrt{15}}{8}},\\ \\cos\\frac{x}{2} = \\sqrt{\\frac{4-\\sqrt{15}}{8}},\\ \\tan\\frac{x}{2} = \\sqrt{31+8\\sqrt{15}}$',
      'Quadrant II means $ 90°<x<180° $, so $ 45°<\\frac{x}{2}<90° $ — $ \\frac{x}{2} $ is in quadrant I: everything ' +
      'positive. This one leaves an inherently unwieldy surd — that IS the correct final answer, not a mistake.\n\n' +
      '$ \\cos^2x = 1-\\frac{1}{16} = \\frac{15}{16} $, so $ \\cos x=\\pm\\frac{\\sqrt{15}}{4} $; quadrant II ' +
      'makes cosine negative: $ \\cos x = -\\frac{\\sqrt{15}}{4} $.\n\n' +
      '$ 2\\sin^2\\frac{x}{2} = 1-\\cos x = \\frac{4+\\sqrt{15}}{4} \\Rightarrow \\sin^2\\frac{x}{2} = ' +
      '\\frac{4+\\sqrt{15}}{8} $, so $ \\sin\\frac{x}{2} = \\sqrt{\\frac{4+\\sqrt{15}}{8}} $ (positive).\n\n' +
      '$ 2\\cos^2\\frac{x}{2} = 1+\\cos x = \\frac{4-\\sqrt{15}}{4} \\Rightarrow \\cos^2\\frac{x}{2} = ' +
      '\\frac{4-\\sqrt{15}}{8} $, so $ \\cos\\frac{x}{2} = \\sqrt{\\frac{4-\\sqrt{15}}{8}} $ (positive).\n\n' +
      'Dividing and rationalising inside the root gives $ \\tan\\frac{x}{2} = \\sqrt{\\dfrac{4+\\sqrt{15}}{4-\\sqrt{15}}} ' +
      '= \\sqrt{31+8\\sqrt{15}} $ (multiply inside by $ \\frac{4+\\sqrt{15}}{4+\\sqrt{15}} $; the denominator ' +
      'becomes $ 16-15=1 $).'),
  ],
);

const practicePage = {
  slug: 'trigonometric-functions-practice-ncert',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 52 NCERT textbook exercises for the chapter (3.1, 3.2, 3.3 and Miscellaneous), regrouped into 6 revision themes, each with a full worked solution.',
  page_number: 10,
  page_type: 'lesson',
  blocks: [
    b('image', 0, {
      src: '', alt: 'A grid of worked trigonometry problems glowing on a dark background', caption: '',
      width: 'full', aspect_ratio: '16:5',
      generation_prompt:
        'Ultra-wide cinematic banner (16:5). A tidy grid of glowing hand-worked trigonometry — a unit circle, a ' +
        'sine wave, a triangle with an angle marked, and a few identity fragments — arranged like flash-cards on ' +
        'a deep near-black background, with a pen mid-stroke solving one of them. Violet, amber and sky-blue ' +
        'glow, elegant graphing-poster style, no readable text.',
    }),
    b('text', 1, {
      markdown:
        'You have read the chapter — now **drill it**. Below are **all 52 NCERT exercises** for this chapter ' +
        '(Exercises 3.1, 3.2, 3.3 and the Miscellaneous Exercise), but **regrouped by idea** instead of the ' +
        'textbook’s running order, so each cluster hammers one skill.\n\n' +
        'Try every question on paper **first**. Only then tap to open the worked solution — the struggle before ' +
        'you peek is what makes it stick.',
    }),
    b('practice_bank', 2, {
      title: 'NCERT Exercises · Trigonometric Functions',
      intro:
        'Pick a theme on the left. Each question carries its NCERT source tag; tap a question to reveal a full, ' +
        'step-by-step worked solution in plain language.',
      sections: [s1, s2, s3, s4, s5, s6],
    }),
  ],
};

module.exports = { practicePage };

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'trigonometric-functions-recap', title: 'Recap',
        subtitle: 'Retrieve it, don’t re-read it — then take it to the NCERT exercises.',
        page_number: 9, blocks: p9 },
      practicePage,
    ]);
  });
  const total = [s1, s2, s3, s4, s5, s6].reduce((n, s) => n + s.items.length, 0);
  console.log(`Ch.3 pages 9–10 DONE (unpublished) · ${[s1, s2, s3, s4, s5, s6].length} practice sections · ${total} questions.`);
})().catch((e) => { console.error(e); process.exit(1); });
