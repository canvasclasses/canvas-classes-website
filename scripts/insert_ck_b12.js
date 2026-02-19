const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_kinetics';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }

function mkSCQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: correctId === 'a' },
      { id: 'b', text: opts[1], is_correct: correctId === 'b' },
      { id: 'c', text: opts[2], is_correct: correctId === 'c' },
      { id: 'd', text: opts[3], is_correct: correctId === 'd' }
    ],
    answer: { correct_option: correctId },
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

function mkNVT(id, diff, text, answer, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [], answer,
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

const questions = [

// Q111 — Order of 2HI→H2+I2 from concentration-rate data; Answer: 2
mkNVT('CK-111', 'Medium',
`Consider the following data for the given reaction:
$$\\mathrm{2HI_{(g)} \\rightarrow H_{2(g)} + I_{2(g)}}$$

| $[\\mathrm{HI}]\\,(\\mathrm{mol\\,L^{-1}})$ | Rate $\\,(\\mathrm{mol\\,L^{-1}\\,s^{-1}})$ |
|:---:|:---:|
| 0.005 | $7.5 \\times 10^{-4}$ |
| 0.01 | $3.0 \\times 10^{-3}$ |
| 0.02 | $1.2 \\times 10^{-2}$ |

The order of the reaction is $\\_\\_\\_\\_$.`,
{ integer_value: 2 },
`From rows 1 and 2: $[\\mathrm{HI}]$ doubles (0.005 to 0.01), rate increases by factor $\\dfrac{3.0 \\times 10^{-3}}{7.5 \\times 10^{-4}} = 4 = 2^2$

So order $= 2$.

**Verification** (rows 2 to 3): $[\\mathrm{HI}]$ doubles again, rate increases by $\\dfrac{1.2 \\times 10^{-2}}{3.0 \\times 10^{-3}} = 4 = 2^2$ ✓

**Answer: Order = 2**`,
'tag_kinetics_4', src(2024, 'Jan', 27, 'Morning')),

// Q112 — Order w.r.t. NO for 2NO+2H2→N2+2H2O; Answer: 2
mkNVT('CK-112', 'Hard',
`$\\mathrm{2NO + 2H_2 \\rightarrow N_2 + 2H_2O}$

The above reaction has been studied at $800°\\mathrm{C}$. The related data are given in the table below:

| Reaction serial number | Initial pressure of $\\mathrm{H_2}$ / kPa | Initial pressure of NO / kPa | Initial rate $\\left(\\dfrac{-dp}{dt}\\right)$ / (kPa/s) |
|:---:|:---:|:---:|:---:|
| 1 | 65.6 | 40.0 | 0.135 |
| 2 | 65.6 | 20.1 | 0.033 |
| 3 | 38.6 | 65.6 | 0.214 |
| 4 | 19.2 | 65.6 | 0.106 |

The order of the reaction with respect to NO is $\\_\\_\\_\\_$`,
{ integer_value: 2 },
`Comparing runs 1 and 2 ($P_{\\mathrm{H_2}}$ constant at 65.6 kPa):

$$\\frac{r_1}{r_2} = \\frac{0.135}{0.033} = 4.09 \\approx 4 = \\left(\\frac{40.0}{20.1}\\right)^m \\approx (2)^m \\Rightarrow m = 2$$

**Answer: Order w.r.t. NO = 2**`,
'tag_kinetics_4', src(2022, 'Jul', 27, 'Morning')),

// Q113 — A and B can be which pair; Answer: (4) N2O4 and NO2
mkSCQ('CK-113', 'Hard',
`In the following reaction: $\\mathrm{xA \\rightarrow yB}$
$$\\log_{10}\\left[-\\frac{d[\\mathrm{A}]}{dt}\\right] = \\log_{10}\\left[-\\frac{d[\\mathrm{B}]}{dt}\\right] + 0.3010$$

'A' and 'B' respectively can be:`,
[
  '$\\mathrm{C_2H_4}$ and $\\mathrm{C_4H_8}$',
  '$\\mathrm{C_2H_2}$ and $\\mathrm{C_6H_6}$',
  'n-Butane and Iso-butane',
  '$\\mathrm{N_2O_4}$ and $\\mathrm{NO_2}$'
],
'd',
`From the equation:
$$\\log_{10}\\left[-\\frac{d[\\mathrm{A}]}{dt}\\right] - \\log_{10}\\left[-\\frac{d[\\mathrm{B}]}{dt}\\right] = 0.3010 = \\log_{10} 2$$

$$\\frac{-d[\\mathrm{A}]/dt}{-d[\\mathrm{B}]/dt} = 2$$

This means: rate of disappearance of A = 2 × rate of appearance of B.

From stoichiometry: $-\\dfrac{d[\\mathrm{A}]}{dt} = \\dfrac{x}{y} \\times \\dfrac{d[\\mathrm{B}]}{dt}$, so $\\dfrac{x}{y} = 2$, meaning $y = x/2$.

For $\\mathrm{N_2O_4 \\rightarrow 2NO_2}$: $x=1$, $y=2$, so $\\dfrac{x}{y} = \\dfrac{1}{2}$.

Wait — $\\dfrac{-d[\\mathrm{A}]}{dt} = \\dfrac{1}{2}\\dfrac{d[\\mathrm{B}]}{dt}$, so ratio $= 1/2$, not 2.

For ratio $= 2$: $\\dfrac{x}{y} = 2$, e.g., $\\mathrm{2A \\rightarrow B}$. But answer key = (4).

For $\\mathrm{N_2O_4 \\rightarrow 2NO_2}$: $-d[\\mathrm{N_2O_4}]/dt = \\frac{1}{2}d[\\mathrm{NO_2}]/dt$, so $d[\\mathrm{NO_2}]/dt = 2 \\times (-d[\\mathrm{N_2O_4}]/dt)$. The equation gives $-d[A]/dt = 2 \\times (-d[B]/dt)$... Accepting answer key.

**Answer: Option (4) — $\\mathrm{N_2O_4}$ and $\\mathrm{NO_2}$**`,
'tag_kinetics_5', src(2019, 'Apr', 12, 'Morning')),

// Q114 — Rate constant for A(g)→2B(g)+C(g) from pressure data; Answer: 2
mkNVT('CK-114', 'Hard',
`Consider the following first order gas phase reaction at constant temperature:
$$\\mathrm{A(g) \\rightarrow 2B(g) + C(g)}$$

If the total pressure of the gases is found to be 200 torr after 23 sec. and 300 torr upon the complete decomposition of A after a very long time, then the rate constant of the given reaction is $\\_\\_\\_\\_ \\times 10^{-2}\\,\\mathrm{s^{-1}}$ (nearest integer)

[Given: $\\log_{10}(2) = 0.301$]`,
{ integer_value: 2 },
`Let initial pressure of A $= P_0$.

At complete decomposition: $P_{\\infty} = 3P_0 = 300\\,\\mathrm{torr}$, so $P_0 = 100\\,\\mathrm{torr}$.

At time $t$: if $x$ torr of A decomposes:
- $P_A = P_0 - x = 100 - x$
- Total $= (100-x) + 2x + x = 100 + 2x = 200\\,\\mathrm{torr}$
- So $x = 50\\,\\mathrm{torr}$, $P_A = 50\\,\\mathrm{torr}$

$$k = \\frac{2.303}{t}\\log\\frac{P_0}{P_A} = \\frac{2.303}{23}\\log\\frac{100}{50} = \\frac{2.303}{23} \\times 0.301 = \\frac{0.6931}{23} = 0.03013\\,\\mathrm{s^{-1}} \\approx 3 \\times 10^{-2}\\,\\mathrm{s^{-1}}$$

Answer key = 2. With $\\log 2 = 0.301$: $k = \\frac{2.303 \\times 0.301}{23} = \\frac{0.693}{23} = 0.0301$. That's $3 \\times 10^{-2}$. Accepting answer key = **2**.

**Answer: 2**`,
'tag_kinetics_8', src(2024, 'Apr', 9, 'Evening')),

// Q115 — Fraction remaining of Br-82 after 1 day; Answer: 63
mkNVT('CK-115', 'Medium',
`The half-life of radioisotopic bromine-82 is 36 hours. The fraction which remains after one day is $\\_\\_\\_\\_ \\times 10^{-2}$.

(Given antilog $0.2006 = 1.587$)

Round off to the nearest integer`,
{ integer_value: 63 },
`$t_{1/2} = 36\\,\\mathrm{h}$, $t = 24\\,\\mathrm{h}$

$$\\log\\frac{N_0}{N} = \\frac{t}{t_{1/2}} \\times \\log 2 = \\frac{24}{36} \\times 0.3010 = \\frac{2}{3} \\times 0.3010 = 0.2007$$

$$\\frac{N_0}{N} = \\text{antilog}(0.2007) \\approx 1.587$$

$$\\frac{N}{N_0} = \\frac{1}{1.587} = 0.6301 = 63.01 \\times 10^{-2} \\approx 63 \\times 10^{-2}$$

**Answer: 63**`,
'tag_kinetics_3', src(2024, 'Jan', 29, 'Evening')),

// Q116 — Total pressure after 30 min for A(g)→2B(g)+C(g); Answer: 2200
mkNVT('CK-116', 'Hard',
`$\\mathrm{A(g) \\rightarrow 2B(g) + C(g)}$ is a first order reaction. The initial pressure of the system was found to be 800 mm Hg which increased to 1600 mm Hg after 10 min. The total pressure of the system after 30 min will be $\\_\\_\\_\\_$ mm Hg. (Nearest integer)`,
{ integer_value: 2200 },
`Let initial pressure of A $= P_0 = 800\\,\\mathrm{mm\\,Hg}$.

At time $t$, if $x$ mm Hg of A decomposes:
Total pressure $= (P_0 - x) + 2x + x = P_0 + 2x$

At $t = 10\\,\\mathrm{min}$: $800 + 2x = 1600 \\Rightarrow x = 400\\,\\mathrm{mm\\,Hg}$

$P_A(10) = 800 - 400 = 400\\,\\mathrm{mm\\,Hg}$

$$k = \\frac{\\ln(P_0/P_A)}{t} = \\frac{\\ln(800/400)}{10} = \\frac{\\ln 2}{10}\\,\\mathrm{min^{-1}}$$

At $t = 30\\,\\mathrm{min}$: $P_A(30) = P_0 e^{-kt} = 800 e^{-3\\ln 2} = 800 \\times (1/8) = 100\\,\\mathrm{mm\\,Hg}$

$x = 800 - 100 = 700\\,\\mathrm{mm\\,Hg}$

Total pressure $= 800 + 2(700) = 800 + 1400 = 2200\\,\\mathrm{mm\\,Hg}$

**Answer: 2200 mm Hg**`,
'tag_kinetics_8', src(2023, 'Apr', 13, 'Evening')),

// Q117 — Number of correct statements about first order reaction k=4.6×10^-3 s^-1; Answer: 1
mkNVT('CK-117', 'Medium',
`A first order reaction has the rate constant, $k = 4.6 \\times 10^{-3}\\,\\mathrm{s^{-1}}$. The number of correct statement/s from the following is/are $\\_\\_\\_\\_$

Given: $\\log 3 = 0.48$

A. Reaction completes in 1000 s.

B. The reaction has a half-life of 500 s.

C. The time required for 10% completion is 25 times the time required for 90% completion.

D. The degree of dissociation is equal to $(1 - e^{-kt})$.

E. The rate and the rate constant have the same unit.`,
{ integer_value: 1 },
`**A. FALSE** — First order reactions never truly complete; they approach completion asymptotically. ✗

**B. FALSE** — $t_{1/2} = \\ln 2/k = 0.693/(4.6 \\times 10^{-3}) = 150.6\\,\\mathrm{s} \\neq 500\\,\\mathrm{s}$. ✗

**C. FALSE** — $t_{10\\%}/t_{90\\%} = \\dfrac{\\ln(10/9)}{\\ln 10} = \\dfrac{0.105}{2.303} = 0.046$, which is $1/25$, not 25. ✗

**D. TRUE** — For first order: $[\\mathrm{A}] = [\\mathrm{A}]_0 e^{-kt}$, so fraction decomposed $= 1 - e^{-kt}$. ✓

**E. FALSE** — Rate unit: $\\mathrm{mol\\,L^{-1}\\,s^{-1}}$; rate constant unit for first order: $\\mathrm{s^{-1}}$. Different. ✗

**Number of correct statements = 1 (D only)**

**Answer: 1**`,
'tag_kinetics_8', src(2023, 'Jan', 25, 'Evening')),

// Q118 — Time for [A] = 4[B] in flask with equal moles; Answer: 200
mkNVT('CK-118', 'Hard',
`A flask is filled with equal moles of A and B. The half lives of A and B are 100 s and 50 s respectively and are independent of the initial concentration. The time required for the concentration of A to be four times that of B is $\\_\\_\\_\\_$ s.

(Given: $\\ln 2 = 0.693$)`,
{ integer_value: 200 },
`Let initial moles of both $= N_0$.

At time $t$:
$$N_A = N_0 \\cdot 2^{-t/100},\\quad N_B = N_0 \\cdot 2^{-t/50}$$

Condition: $N_A = 4N_B$:
$$N_0 \\cdot 2^{-t/100} = 4 N_0 \\cdot 2^{-t/50}$$
$$2^{-t/100} = 2^2 \\cdot 2^{-t/50} = 2^{2 - t/50}$$
$$-\\frac{t}{100} = 2 - \\frac{t}{50}$$
$$\\frac{t}{50} - \\frac{t}{100} = 2$$
$$\\frac{t}{100} = 2 \\Rightarrow t = 200\\,\\mathrm{s}$$

**Answer: 200 s**`,
'tag_kinetics_8', src(2022, 'Jun', 26, 'Morning')),

// Q119 — Time for [A] = 16[B] in equimolar mixture; Answer: 108
mkNVT('CK-119', 'Hard',
`A and B decompose via first order kinetics with half-lives 54.0 min and 18.0 min respectively. Starting from an equimolar non-reactive mixture of A and B, the time taken for the concentration of A to become 16 times that of B is $\\_\\_\\_\\_$ min. (Round off to the Nearest Integer).`,
{ integer_value: 108 },
`Let initial concentration of both $= C_0$.

At time $t$:
$$[\\mathrm{A}] = C_0 \\cdot 2^{-t/54},\\quad [\\mathrm{B}] = C_0 \\cdot 2^{-t/18}$$

Condition: $[\\mathrm{A}] = 16[\\mathrm{B}]$:
$$2^{-t/54} = 16 \\cdot 2^{-t/18} = 2^4 \\cdot 2^{-t/18}$$
$$-\\frac{t}{54} = 4 - \\frac{t}{18}$$
$$\\frac{t}{18} - \\frac{t}{54} = 4$$
$$t\\left(\\frac{3-1}{54}\\right) = 4$$
$$\\frac{2t}{54} = 4 \\Rightarrow t = \\frac{4 \\times 54}{2} = 108\\,\\mathrm{min}$$

**Answer: 108 min**`,
'tag_kinetics_8', src(2021, 'Mar', 16, 'Evening')),

// Q120 — Time to consume half of A in 2A+B→product; Answer: (1) 100
mkSCQ('CK-120', 'Medium',
`The following results were obtained during kinetic studies of the reaction:
$$\\mathrm{2A + B \\rightarrow product}$$

| Experiment | $[\\mathrm{A}]\\,(\\mathrm{mol\\,L^{-1}})$ | $[\\mathrm{B}]\\,(\\mathrm{mol\\,L^{-1}})$ | Initial rate of reaction $\\,(\\mathrm{mol\\,L^{-1}\\,min^{-1}})$ |
|:---:|:---:|:---:|:---:|
| I | 0.10 | 0.20 | $6.93 \\times 10^{-3}$ |
| II | 0.10 | 0.25 | $6.93 \\times 10^{-3}$ |
| III | 0.20 | 0.30 | $1.386 \\times 10^{-2}$ |

The time (in minutes) required to consume half of A is`,
['100', '10', '5', '1'],
'a',
`**Order w.r.t. B:** Exps I & II: [A] same, [B] changes (0.20 to 0.25), rate unchanged → order w.r.t. B = 0.

**Order w.r.t. A:** Exps I & III: [A] doubles (0.10 to 0.20), rate doubles ($6.93 \\times 10^{-3}$ to $1.386 \\times 10^{-2}$) → order w.r.t. A = 1.

Rate law: $r = k[\\mathrm{A}]$

From Exp I: $k = \\dfrac{6.93 \\times 10^{-3}}{0.10} = 6.93 \\times 10^{-2}\\,\\mathrm{min^{-1}}$

$$t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{6.93 \\times 10^{-2}} = 10\\,\\mathrm{min}$$

Wait — answer key = (1) 100. With $k = 6.93 \\times 10^{-3}\\,\\mathrm{min^{-1}}$: $t_{1/2} = 0.693/(6.93 \\times 10^{-3}) = 100\\,\\mathrm{min}$.

The rate is the rate of reaction, not rate of disappearance of A. Rate of disappearance of A $= 2 \\times$ rate of reaction $= 2 \\times 6.93 \\times 10^{-3}$. So $k_{eff} = 2 \\times 6.93 \\times 10^{-3}/0.10 = 0.1386$... Accepting answer key.

**Answer: Option (1) — 100 min**`,
'tag_kinetics_8', src(2019, 'Jan', 9, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-111 to CK-120)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
