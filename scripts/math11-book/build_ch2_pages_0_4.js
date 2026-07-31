'use strict';
/* Class 11 Math · Ch.2 Relations and Functions — pages 0–4.
   Additive + idempotent. Run: node scripts/math11-book/build_ch2_pages_0_4.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book');

/* ── Page 0 — Chapter opener ─────────────────────────────────────────────── */
const p0 = [
  b('image', 0, {
    src: '', alt: 'A web of inputs flowing through a machine into single outputs, against a dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing machine on the left takes in a stream of numbers ' +
      'and objects and sends out a single ordered stream on the right — the idea of a function as a ' +
      'machine that turns each input into exactly one output. Warm amber and violet light trails on a ' +
      'deep near-black background, elegant mathematical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'So much of mathematics — and of life — is really about **links between things that change**. ' +
      'The boiling point of water changes with altitude. The fare changes with the distance. The area ' +
      'of a circle changes with its radius. In each case one quantity *depends on* another.\n\n' +
      'In this chapter we build the exact language for those links. We start by **pairing** things up, ' +
      'tighten a pairing into a **relation**, and then meet the star of the show — the **function**, a ' +
      'relation so well-behaved that every input has *one and only one* output. Along the way you will ' +
      'not just read graphs — you will **grab them and move them**.',
  }),
  b('text', 2, {
    markdown:
      '**What you will be able to do by the end**\n\n' +
      '- Pair elements of two sets with the **Cartesian product** $ A \\times B $\n' +
      '- Pick out a **relation** and read off its domain, codomain and range\n' +
      '- Tell in one glance whether a relation earns the name **function** (the vertical-line test)\n' +
      '- Find a function’s **domain and range**, and read the **function machine**\n' +
      '- Recognise the everyday **function families** — lines, powers, $ |x| $, the step function\n' +
      '- **Build** new functions by adding, multiplying and **transforming** old ones',
  }),
];

/* ── Page 1 — Ordered Pairs & Cartesian Products (NCERT 2.2) ─────────────── */
const p1 = [
  b('image', 0, {
    src: '', alt: 'License plates being formed by pairing a state code with a number, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two columns of glowing tiles — one column of Indian state ' +
      'codes (DL, MP, KA), one column of numbers (01, 02, 03) — with light lines pairing them into ' +
      'ordered codes like (DL, 01). Amber and violet glow on a deep near-black background, clean ' +
      'infographic-poster style. No text overlay other than the tile labels.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'A vehicle number plate is really an **ordered pair**. “DL 01” is the Delhi plate; “01 DL” would ' +
      'mean something else entirely. The *order* carries the meaning — which is exactly why mathematicians ' +
      'are so fussy about writing pairs in a fixed order.',
  }),
  b('text', 2, {
    markdown:
      'An **ordered pair** $ (a, b) $ is just two things written in a fixed order: a *first* element and ' +
      'a *second* element. The rule that makes it “ordered” is simple but strict:\n\n' +
      '$ (a, b) = (c, d) $ only when $ a = c $ **and** $ b = d $.\n\n' +
      'So $ (2, 3) $ and $ (3, 2) $ are **not** the same — same two numbers, different order, different pair.',
  }),
  b('math_graph', 3, {
    title: 'Order matters — see it on the plane',
    caption: 'Two ordered pairs with the same numbers land on two different points.',
    spec: {
      bounds: { xmin: -1, xmax: 5, ymin: -1, ymax: 5 },
      points: [
        { x: 2, y: 3, label: '(2, 3)', color: 'violet' },
        { x: 3, y: 2, label: '(3, 2)', color: 'sky' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
    predict: {
      prompt: 'Is the point (2, 3) the same as the point (3, 2)?',
      options: ['Yes — they use the same two numbers', 'No — they are different points'],
      answer_index: 1,
      reveal: 'Different points. (2, 3) is 2 across and 3 up; (3, 2) is 3 across and 2 up. The order tells you which is which.',
    },
  }),
  b('text', 4, {
    markdown:
      'Now pair **every** element of a set $ A $ with **every** element of a set $ B $. The full collection ' +
      'of ordered pairs is the **Cartesian product**.',
  }),
  b('latex_block', 5, {
    latex: 'A \\times B = \\{\\,(a, b) : a \\in A,\\ b \\in B\\,\\}',
    label: 'Cartesian product', highlight: true,
  }),
  b('text', 6, {
    markdown:
      'Two quick facts that do a lot of work:\n\n' +
      '- **Counting:** if $ A $ has $ p $ elements and $ B $ has $ q $, then $ A \\times B $ has $ p \\times q $ ' +
      'pairs. (3 states $ \\times $ 3 numbers $ = 9 $ codes.)\n' +
      '- **The plane is a Cartesian product.** $ \\mathbb{R} \\times \\mathbb{R} $ is the set of all pairs ' +
      '$ (x, y) $ of real numbers — that *is* the coordinate plane you graph on. And $ \\mathbb{R} \\times ' +
      '\\mathbb{R} \\times \\mathbb{R} $ is 3-D space.',
  }),
  b('worked_example', 7, {
    label: 'NCERT Example 1', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'If $ (x + 1,\\ y - 2) = (3, 1) $, find $ x $ and $ y $.',
    solution:
      'Equal ordered pairs means the first parts match and the second parts match — separately.\n\n' +
      'First parts: $ x + 1 = 3 $, so $ x = 2 $.\n\n' +
      'Second parts: $ y - 2 = 1 $, so $ y = 3 $.\n\n' +
      'That’s the whole trick with ordered-pair equations: break one pair-equation into two ordinary ones.',
  }),
  b('worked_example', 8, {
    label: 'NCERT Example 3 (part)', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Let $ A = \\{1, 2, 3\\},\\ B = \\{3, 4\\},\\ C = \\{4, 5, 6\\} $. Find $ A \\times (B \\cap C) $.',
    solution:
      'Do the bracket first. $ B \\cap C $ = the elements in **both** $ B $ and $ C $ = $ \\{4\\} $.\n\n' +
      'Now $ A \\times \\{4\\} $ pairs every element of $ A $ with 4:\n\n' +
      '$ A \\times (B \\cap C) = \\{(1, 4),\\ (2, 4),\\ (3, 4)\\} $.',
  }),
  b('reasoning_prompt', 9, {
    reasoning_type: 'quantitative',
    prompt: 'If $ n(A) = 3 $ and $ n(B) = 2 $, how many ordered pairs are in $ A \\times B $?',
    options: ['5', '6', '9', '8'],
    reveal: 'Six. You multiply, not add: $ 3 \\times 2 = 6 $. Each of the 3 elements of $ A $ pairs with each of the 2 elements of $ B $.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 10, {
    pass_threshold: 0.67,
    questions: [
      q('Which statement about the ordered pairs $ (5, 7) $ and $ (7, 5) $ is correct?',
        ['They are equal, because they contain the same numbers',
         'They are different, because the first and second elements are swapped',
         'They are equal only if $ 5 = 7 $',
         'Neither is a valid ordered pair'],
        1,
        'Ordered pairs are equal only when both the first elements match and the second elements match. Here the numbers are swapped, so the pairs are different — the “same numbers” idea ignores order, which is exactly what an ordered pair does not.',
        1),
      q('If $ A = \\{a, b\\} $ and $ B = \\{1, 2, 3\\} $, how many elements does $ A \\times B $ have?',
        ['5', '6', '8', '9'],
        1,
        '$ n(A \\times B) = n(A)\\times n(B) = 2 \\times 3 = 6 $. Adding (giving 5) is the classic slip — every element of $ A $ must pair with every element of $ B $.',
        1),
      q('What does the Cartesian product $ \\mathbb{R} \\times \\mathbb{R} $ represent?',
        ['All real numbers', 'Every point in the coordinate plane', 'Only the points on the x-axis', 'Every point in 3-D space'],
        1,
        '$ \\mathbb{R} \\times \\mathbb{R} $ is the set of all pairs $ (x, y) $ of real numbers — precisely the coordinate plane. All of 3-D space would be $ \\mathbb{R}\\times\\mathbb{R}\\times\\mathbb{R} $.',
        2),
    ],
  }),
  b('text', 11, {
    markdown:
      'A Cartesian product throws in **every** possible pair. Usually we only care about the pairs that ' +
      'obey some **rule** — “is the first letter of”, “is one more than”. Picking out those pairs gives us a ' +
      '**relation**. That’s next.',
  }),
];

/* ── Page 2 — Relations (NCERT 2.3) ─────────────────────────────────────── */
const p2 = [
  b('image', 0, {
    src: '', alt: 'An arrow diagram linking a set of letters to a set of names, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two glowing ovals side by side, one holding letters, one holding ' +
      'names, with a few bright arrows leaping from letters to the names they begin — the picture of a ' +
      'relation as an arrow diagram. Violet and amber glow on a deep near-black background, clean diagram ' +
      'style. No text overlay beyond the labels inside the ovals.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'Every friendship, every “is taller than”, every “is the capital of” is a **relation** in the exact ' +
      'mathematical sense — a chosen set of ordered pairs. Maths didn’t invent relations; it just gave them ' +
      'a spelling.',
  }),
  b('text', 2, {
    markdown:
      'A **relation** $ R $ from a set $ A $ to a set $ B $ is simply a **subset of** $ A \\times B $ — the ' +
      'pairs you keep because they satisfy some rule.\n\n' +
      'Three words you will use constantly:\n\n' +
      '- **Domain** — the set of all *first* elements that actually appear in $ R $.\n' +
      '- **Range** — the set of all *second* elements (the images) that appear.\n' +
      '- **Codomain** — the whole “target” set $ B $. The range sits *inside* the codomain: ' +
      '$ \\text{range} \\subseteq \\text{codomain} $.',
  }),
  b('math_graph', 3, {
    title: 'A relation lives in the plane too',
    caption: 'The relation R = {(x, y) : y = x + 1} on {1, …, 5} is just these five kept pairs.',
    spec: {
      bounds: { xmin: 0, xmax: 7, ymin: 0, ymax: 7 },
      points: [
        { x: 1, y: 2, color: 'amber' }, { x: 2, y: 3, color: 'amber' }, { x: 3, y: 4, color: 'amber' },
        { x: 4, y: 5, color: 'amber' }, { x: 5, y: 6, color: 'amber' },
      ],
      showGrid: true, showAxes: true, keepSquare: true,
    },
  }),
  b('text', 4, {
    markdown:
      'An **arrow diagram** is the other common picture: draw $ A $ and $ B $ as blobs and draw an arrow from ' +
      '$ x $ to $ y $ for every pair $ (x, y) $ you kept.\n\n' +
      '**How many relations are there** from $ A $ to $ B $? A relation is *any* subset of $ A \\times B $, and ' +
      'a set with $ pq $ elements has $ 2^{pq} $ subsets. So there are $ 2^{pq} $ possible relations — a huge ' +
      'number even for small sets.',
  }),
  b('worked_example', 5, {
    label: 'NCERT Example 7', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Let $ A = \\{1, 2, 3, 4, 5, 6\\} $ and $ R = \\{(x, y) : y = x + 1\\} $ on $ A $. Write $ R $, and give its domain, codomain and range.',
    solution:
      'Keep each pair whose second number is one more than the first, staying inside $ A $:\n\n' +
      '$ R = \\{(1, 2),\\ (2, 3),\\ (3, 4),\\ (4, 5),\\ (5, 6)\\} $.\n\n' +
      '(6 has no partner, since 7 is not in $ A $.)\n\n' +
      '- Domain = first elements used = $ \\{1, 2, 3, 4, 5\\} $\n' +
      '- Range = second elements used = $ \\{2, 3, 4, 5, 6\\} $\n' +
      '- Codomain = the whole target set = $ \\{1, 2, 3, 4, 5, 6\\} $',
  }),
  b('reasoning_prompt', 6, {
    reasoning_type: 'logical',
    prompt: 'A relation R has range $ \\{2, 3, 4\\} $ and codomain $ \\{1, 2, 3, 4, 5\\} $. Is that allowed?',
    options: ['Yes — the range can be smaller than the codomain', 'No — range and codomain must be equal', 'Only if R is a function'],
    reveal: 'Yes. The range is whatever second-elements actually show up; the codomain is the whole target set. The range always sits inside the codomain and is often smaller.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 7, {
    pass_threshold: 0.67,
    questions: [
      q('A relation from $ A $ to $ B $ is best described as…',
        ['Any subset of $ A \\times B $', 'The whole set $ A \\times B $ always', 'A subset of $ A $ only', 'A rule with no ordered pairs'],
        0,
        'A relation is any subset of $ A \\times B $ — the pairs you keep by some rule. It need not be all of $ A \\times B $ (that is just one particular, “keep everything”, relation).',
        1),
      q('For the relation $ R = \\{(1, 4), (2, 5), (3, 4)\\} $, what is the range?',
        ['$ \\{1, 2, 3\\} $', '$ \\{4, 5\\} $', '$ \\{4, 5, 4\\} $', '$ \\{1, 2, 3, 4, 5\\} $'],
        1,
        'The range is the set of second elements: 4, 5 and 4 — but a set lists each element once, so the range is $ \\{4, 5\\} $. The first-element set $ \\{1,2,3\\} $ is the domain.',
        2),
      q('If $ n(A) = 2 $ and $ n(B) = 2 $, how many different relations exist from $ A $ to $ B $?',
        ['4', '8', '16', '2'],
        2,
        '$ A \\times B $ has $ 2\\times 2 = 4 $ pairs, and a 4-element set has $ 2^{4} = 16 $ subsets. Each subset is one relation, so there are 16. (4 is the number of *pairs*, not relations.)',
        3),
    ],
  }),
  b('text', 8, {
    markdown:
      'Look again at Example 7’s arrow diagram: every input has exactly one arrow leaving it. Not all relations ' +
      'are so tidy — some inputs fire off two arrows, some none. The tidy ones have a special name, and they run ' +
      'the rest of this chapter: **functions**.',
  }),
];

/* ── Page 3 — What Makes a Relation a Function? (NCERT 2.4 + VLT) ────────── */
const p3 = [
  b('image', 0, {
    src: '', alt: 'A vending machine giving exactly one item per button, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A glowing vending machine: each button (input) is wired to exactly ' +
      'one item (output), the wires clean and unambiguous, while one “broken” button forks to two items and is ' +
      'crossed out — the idea that a function gives one and only one output. Violet and amber glow on a deep ' +
      'near-black background, elegant diagram style. No text.',
  }),
  b('curiosity_prompt', 1, {
    prompt:
      'Think of a machine where you press a button and get a snack. Would you trust a machine that sometimes ' +
      'gives two different snacks for the *same* button? Is “the square root of 9” that kind of machine?',
    hint: 'Both $ +3 $ and $ -3 $ square to 9.',
    reveal:
      'Exactly the tension we need. If one input is allowed two outputs, the “machine” is unreliable. That is ' +
      'the one rule a function is not allowed to break.',
  }),
  b('text', 2, {
    markdown:
      'A **function** $ f $ from $ A $ to $ B $ is a relation with one extra promise: **every element of $ A $ ' +
      'has one and only one image in $ B $.** One input, exactly one output — no input left out, no input with two.\n\n' +
      'Picture the **function machine**: feed in $ x $ (the *independent* variable), out comes a single ' +
      '$ y = f(x) $ (the *dependent* variable). We write $ f : A \\to B $, and call $ b $ the **image** of $ a $ ' +
      'and $ a $ a **pre-image** of $ b $.',
  }),
  b('latex_block', 3, {
    latex: 'f : A \\to B, \\qquad f(a) = b',
    label: 'A function assigns each input one output', highlight: true,
  }),
  b('text', 4, {
    markdown:
      'There’s a beautiful way to *see* the rule on a graph. Sweep a **vertical line** across the picture: if the ' +
      'line ever meets the graph **more than once**, that x-value has two outputs — so it is **not** a function. ' +
      'This is the **vertical-line test**. Try it on a circle.',
  }),
  b('math_graph', 5, {
    title: 'The vertical-line test',
    caption: 'Drag the vertical line. Count how many times it hits the shape.',
    archetype: 'vlt-sweep',
    archetype_params: { shape: 'circle', r: 3 },
    predict: {
      prompt: 'Drag the line across the circle. At most, how many times does one vertical line hit it?',
      options: ['Once', 'Twice', 'It never hits it'],
      answer_index: 1,
      reveal:
        'Twice — a top point and a bottom point. So a single input x would need two outputs. The circle fails ' +
        'the vertical-line test: it is a relation, but NOT a function.',
    },
  }),
  b('worked_example', 6, {
    label: 'NCERT Example 11', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'State, with a reason, whether each relation is a function:\n\n' +
      '(i) $ \\{(2,1),(3,1),(4,2)\\} $  (ii) $ \\{(2,2),(2,4),(3,3),(4,4)\\} $  (iii) $ \\{(1,2),(2,3),(3,4),(4,5)\\} $',
    solution:
      '(i) **Function.** Inputs 2, 3, 4 each appear once. (Two inputs sharing the output 1 is perfectly fine — ' +
      'the rule is about inputs, not outputs.)\n\n' +
      '(ii) **Not a function.** The input 2 has two images, 2 and 4. One input, two outputs — rule broken.\n\n' +
      '(iii) **Function.** Every input has exactly one image.',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'logical',
    prompt: 'Two different inputs give the SAME output. Does that break the function rule?',
    options: ['Yes — outputs must all be different', 'No — the rule only forbids one input having two outputs', 'Only if the inputs are equal'],
    reveal: 'No. A function may send many inputs to one output (a constant function sends *all* inputs to one value). What it may never do is give one input two outputs.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('What is the defining rule of a function $ f : A \\to B $?',
        ['Every element of $ A $ has exactly one image in $ B $',
         'Every element of $ B $ has exactly one pre-image in $ A $',
         'No two ordered pairs share the same second element',
         'The domain and range are equal'],
        0,
        'A function requires each input (element of $ A $) to have one and only one output. It says nothing about outputs being unique — different inputs may share an output.',
        2),
      q('A vertical line cuts a graph at two points. What does that tell you?',
        ['The graph is a function', 'The graph is NOT a function', 'The graph is a straight line', 'The graph has no range'],
        1,
        'Two hits on one vertical line means one x-value has two y-values — two outputs for one input — so the graph fails the vertical-line test and is not a function.',
        1),
      q('Which relation is a function?',
        ['$ \\{(1,2),(1,3),(2,4)\\} $', '$ \\{(1,5),(2,5),(3,5)\\} $', '$ \\{(2,1),(2,2)\\} $', 'A full circle $ x^2 + y^2 = 9 $'],
        1,
        '$ \\{(1,5),(2,5),(3,5)\\} $ sends each input to exactly one output (they happen to share the value 5 — allowed). The others each give some input two outputs, and the circle fails the vertical-line test.',
        2),
      q('In $ y = f(x) $, which is the independent variable?',
        ['$ y $, the output', '$ x $, the input', '$ f $, the rule', 'Both $ x $ and $ y $'],
        1,
        '$ x $ is the independent variable — the input you choose freely. $ y = f(x) $ is the dependent variable, since its value depends on the $ x $ you fed in.',
        1),
    ],
  }),
  b('text', 9, {
    markdown:
      'Every function has a set it is allowed to eat (its **domain**) and a set of values it can spit out (its ' +
      '**range**). Pinning those down is the next essential skill.',
  }),
];

/* ── Page 4 — Domain, Range & the Function Machine (NCERT + Thomas) ──────── */
const p4 = [
  b('image', 0, {
    src: '', alt: 'A machine converting Celsius to Fahrenheit, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A sleek machine with a Celsius dial feeding in and a Fahrenheit dial ' +
      'reading out, a smooth glowing curve rising between them — a temperature-conversion function. Amber and ' +
      'violet glow on a deep near-black background, elegant instrument-panel style. No text beyond the two dial labels.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'The formula that turns Celsius into Fahrenheit, $ F = \\tfrac{9}{5}C + 32 $, is a function you can *feel*: ' +
      'feed in a temperature, get exactly one back. Feed in $ 100 $ (boiling water) and it returns $ 212 $ — every ' +
      'input has one, and only one, output.',
  }),
  b('text', 2, {
    markdown:
      'For a function $ f : A \\to B $:\n\n' +
      '- The **domain** is the set of inputs $ f $ is allowed to eat (here, $ A $).\n' +
      '- The **range** is the set of outputs it actually produces.\n' +
      '- The **codomain** is the declared target set $ B $; the range lives inside it.\n\n' +
      'When a function is given only by a formula, its domain is the **largest set of real $ x $ for which the ' +
      'formula makes sense** — the *natural domain*. Two rules catch almost everything: you may not **divide by ' +
      'zero**, and you may not take the **square root of a negative**.',
  }),
  b('math_graph', 3, {
    title: 'One machine, three views',
    caption: 'Drag along the line: the graph, the table and the equation all move together.',
    height: 360,
    spec: {
      bounds: { xmin: -10, xmax: 110, ymin: -20, ymax: 240 },
      functions: [{ expr: '9*x/5 + 32', color: 'violet', label: 'F' }],
      table: { expr: '9*x/5 + 32', from: 0, to: 100, step: 20, label: 'F' },
      showGrid: true, showAxes: true, keepSquare: false,
    },
    predict: {
      prompt: 'Water boils at 100 °C. Will that come out above or below 200 °F?',
      options: ['Above 200 °F', 'Below 200 °F'],
      answer_index: 0,
      reveal: '$ \\tfrac{9}{5}\\times 100 + 32 = 212 $ °F — just above 200. Every 5 °C becomes 9 °F, so the line climbs faster than one-to-one.',
    },
  }),
  b('worked_example', 4, {
    label: 'Reading a natural domain', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Find the natural domain and range of each: (a) $ y = \\sqrt{x} $  (b) $ y = \\dfrac{1}{x} $  (c) $ y = \\sqrt{4 - x} $.',
    solution:
      '(a) $ \\sqrt{x} $ needs $ x \\ge 0 $. Domain $ [0, \\infty) $; outputs are never negative, so range $ [0, \\infty) $.\n\n' +
      '(b) $ \\tfrac{1}{x} $ dies only at $ x = 0 $. Domain: all reals except 0; range: all reals except 0.\n\n' +
      '(c) Need $ 4 - x \\ge 0 $, i.e. $ x \\le 4 $. Domain $ (-\\infty, 4] $; range $ [0, \\infty) $.\n\n' +
      '**The move:** set the inside of a square root $ \\ge 0 $, and set any denominator $ \\ne 0 $.',
  }),
  b('worked_example', 5, {
    label: 'NCERT Example 21', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Find the domain of $ f(x) = \\dfrac{x^2 + 3x + 5}{x^2 - 5x + 4} $.',
    solution:
      'A fraction is undefined only where the bottom is zero. Factor the denominator:\n\n' +
      '$ x^2 - 5x + 4 = (x - 1)(x - 4) $, which is zero at $ x = 1 $ and $ x = 4 $.\n\n' +
      'So $ f $ is defined everywhere except those two points: **domain $ = \\mathbb{R} - \\{1, 4\\} $.**',
  }),
  b('callout', 6, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'To find a domain fast, hunt for the two troublemakers:\n\n' +
      '- **Denominator $ = 0 $?** Exclude those $ x $.\n' +
      '- **Even root of a negative?** Force the inside $ \\ge 0 $ and solve.\n\n' +
      'The domain is “all reals” **minus** whatever those rules forbid.',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'quantitative',
    prompt: 'What is the natural domain of $ f(x) = \\sqrt{x - 2} $?',
    options: ['$ x \\ge 2 $', '$ x > 2 $', '$ x \\le 2 $', 'all real numbers'],
    reveal: 'Need $ x - 2 \\ge 0 $, so $ x \\ge 2 $. At $ x = 2 $ the root is $ 0 $ — allowed — so it is $ \\ge $, not $ > $.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('The range of a function is…',
        ['The set of inputs it accepts', 'The set of outputs it actually produces', 'Always equal to the codomain', 'The largest x for which it is defined'],
        1,
        'The range is the set of values that actually come out. Inputs form the domain, and the codomain is the declared target — the range sits inside it but can be smaller.',
        1),
      q('Find the domain of $ f(x) = \\dfrac{1}{x - 3} $.',
        ['all real $ x $', '$ x \\ne 3 $', '$ x \\ge 3 $', '$ x \\ne 0 $'],
        1,
        'The only forbidden value is where the denominator is zero: $ x - 3 = 0 $, i.e. $ x = 3 $. Everywhere else is fine, so the domain is all reals except 3.',
        1),
      q('Find the domain of $ f(x) = \\sqrt{9 - x^2} $.',
        ['$ -3 \\le x \\le 3 $', '$ x \\ge 3 $', 'all real $ x $', '$ x \\le 9 $'],
        0,
        'Need $ 9 - x^2 \\ge 0 $, i.e. $ x^2 \\le 9 $, i.e. $ -3 \\le x \\le 3 $. Outside that the inside of the root goes negative.',
        3),
      q('For $ t(C) = \\tfrac{9}{5}C + 32 $, what is $ t(-40) $?',
        ['$ -40 $', '$ 40 $', '$ -8 $', '$ 72 $'],
        0,
        '$ \\tfrac{9}{5}(-40) + 32 = -72 + 32 = -40 $. Famously, $ -40 $ °C $ = -40 $ °F — the one temperature where the two scales agree.',
        2),
    ],
  }),
  b('text', 9, {
    markdown:
      'You can now spot a function and measure what goes in and comes out. Time to meet the **regulars** — the ' +
      'handful of functions that appear again and again, starting with the straightest of them all.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'relations-functions-opener', title: 'Relations and Functions',
        subtitle: 'From pairing things up to the function machine — and graphs you can grab and move.',
        page_number: 0, page_type: 'chapter_opener', blocks: p0 },
      { slug: 'ordered-pairs-cartesian-products', title: 'Ordered Pairs & Cartesian Products',
        subtitle: 'Pairing every element of one set with every element of another — and why order matters.',
        page_number: 1, blocks: p1 },
      { slug: 'relations', title: 'Relations',
        subtitle: 'Keep only the pairs that follow a rule: domain, codomain and range.',
        page_number: 2, blocks: p2 },
      { slug: 'what-makes-a-function', title: 'What Makes a Relation a Function?',
        subtitle: 'One input, one output — and the vertical-line test that spots it.',
        page_number: 3, blocks: p3 },
      { slug: 'domain-range-function-machine', title: 'Domain, Range & the Function Machine',
        subtitle: 'What a function is allowed to eat, and what it spits out.',
        page_number: 4, blocks: p4 },
    ]);
  });
  console.log('pages 0–4 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
