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

// Q21 — Time for 99.9% completion; Answer: 10
mkNVT('CK-021', 'Medium',
`A reaction has a half life of 1 min. The time required for 99.9% completion of the reaction is $\\_\\_\\_\\_$ min. (Round off to the Nearest integer)

[Use: $\\ln 2 = 0.69$, $\\ln 10 = 2.3$]`,
{ integer_value: 10 },
`For first order: $k = \\frac{\\ln 2}{t_{1/2}} = \\frac{0.69}{1} = 0.69\\,\\mathrm{min^{-1}}$

For 99.9% completion, 0.1% remains:
$$t = \\frac{\\ln(1000)}{k} = \\frac{3\\ln 10}{0.69} = \\frac{3 \\times 2.3}{0.69} = \\frac{6.9}{0.69} = 10\\,\\mathrm{min}$$

**Answer: 10 min**`,
'tag_kinetics_8', src(2021, 'Mar', 18, 'Evening')),

// Q22 — Time for 40% isomerization of cyclobutene; Answer: 26
mkNVT('CK-022', 'Medium',
`Gaseous cyclobutene isomerizes to butadiene in a first order process which has a '$K$' value of $3.3 \\times 10^{-4}\\,\\mathrm{s^{-1}}$ at $153°\\mathrm{C}$. The time in minutes it takes for the isomerization to proceed 40% to completion at this temperature is $\\_\\_\\_\\_$. (Rounded off to the nearest integer)`,
{ integer_value: 26 },
`For first order, 40% completion means 60% remains:
$$t = \\frac{\\ln(1/0.6)}{k} = \\frac{\\ln(5/3)}{3.3 \\times 10^{-4}}$$

$$\\ln(5/3) = \\ln 5 - \\ln 3 = 1.609 - 1.099 = 0.510$$

$$t = \\frac{0.510}{3.3 \\times 10^{-4}} = 1545\\,\\mathrm{s} = \\frac{1545}{60} = 25.75 \\approx 26\\,\\mathrm{min}$$

**Answer: 26 min**`,
'tag_kinetics_8', src(2021, 'Feb', 24, 'Morning')),

// Q23 — Time for [A] = 4[B] in mixture; Answer: (2) 900 s
mkSCQ('CK-023', 'Hard',
`A flask contains a mixture of compounds A and B. Both compounds decompose by first-order kinetics. The half-lives for A and B are 300 s and 180 s, respectively. If the concentrations of A and B are equal initially, the time required for the concentration of A to be four times that of B (in s) is:

(Use $\\ln 2 = 0.693$)`,
['180', '900', '300', '120'],
'b',
`Let initial concentration of both = $C_0$.

At time $t$:
$$[\\mathrm{A}] = C_0 e^{-k_A t},\\quad k_A = \\frac{\\ln 2}{300}$$
$$[\\mathrm{B}] = C_0 e^{-k_B t},\\quad k_B = \\frac{\\ln 2}{180}$$

Condition: $[\\mathrm{A}] = 4[\\mathrm{B}]$:
$$C_0 e^{-k_A t} = 4 C_0 e^{-k_B t}$$
$$e^{(k_B - k_A)t} = 4$$
$$(k_B - k_A)t = \\ln 4 = 2\\ln 2$$

$$k_B - k_A = \\ln 2\\left(\\frac{1}{180} - \\frac{1}{300}\\right) = \\ln 2 \\times \\frac{300 - 180}{180 \\times 300} = \\ln 2 \\times \\frac{120}{54000} = \\frac{\\ln 2}{450}$$

$$t = \\frac{2\\ln 2}{\\ln 2/450} = 2 \\times 450 = 900\\,\\mathrm{s}$$

**Answer: Option (2) — 900 s**`,
'tag_kinetics_8', src(2020, 'Sep', 5, 'Morning')),

// Q24 — Time to reduce 90Sr by 90%; Answer: 23.03
mkNVT('CK-024', 'Hard',
`During the nuclear explosion, one of the products is $^{90}\\mathrm{Sr}$ with half life of 6.93 years. If $1\\,\\mu\\mathrm{g}$ of $^{90}\\mathrm{Sr}$ was absorbed in the bones of a newly born baby in place of Ca, how much time, in years, is required to reduce it by 90% if it is not lost metabolically $\\_\\_\\_\\_$.`,
{ decimal_value: 23.03 },
`For first order (radioactive decay): $k = \\frac{\\ln 2}{t_{1/2}} = \\frac{0.693}{6.93} = 0.1\\,\\mathrm{year^{-1}}$

For 90% reduction, 10% remains:
$$t = \\frac{\\ln(1/0.1)}{k} = \\frac{\\ln 10}{0.1} = \\frac{2.303}{0.1} = 23.03\\,\\mathrm{years}$$

**Answer: 23.03 years**`,
'tag_kinetics_3', src(2020, 'Jan', 7, 'Morning')),

// Q25 — Order from rate constant units; Answer: 2
mkNVT('CK-025', 'Easy',
`For conversion of compound $\\mathrm{A \\rightarrow B}$, the rate constant of the reaction was found to be $4.6 \\times 10^{-5}\\,\\mathrm{L\\,mol^{-1}\\,s^{-1}}$. The order of the reaction is $\\_\\_\\_\\_$.`,
{ integer_value: 2 },
`The unit of the rate constant is $\\mathrm{L\\,mol^{-1}\\,s^{-1}} = \\mathrm{mol^{-1}\\,L\\,s^{-1}}$.

For an $n$th order reaction: $[k] = \\mathrm{mol^{1-n}\\,L^{n-1}\\,s^{-1}}$

Comparing: $1 - n = -1 \\Rightarrow n = 2$

**Answer: Order = 2 (second order)**`,
'tag_kinetics_4', src(2023, 'Jan', 29, 'Evening')),

// Q26 — Order of decomposition of A from half-life data; Answer: 1
mkNVT('CK-026', 'Medium',
`The half life for the decomposition of gaseous compound A is 240 s when the gaseous pressure was 500 Torr initially. When the pressure was 250 Torr, the half life was found to be 4.0 min. The order of the reaction is $\\_\\_\\_\\_$ (Nearest integer)`,
{ integer_value: 1 },
`For an $n$th order reaction: $t_{1/2} \\propto [\\mathrm{A}]_0^{1-n}$

$$\\frac{t_{1/2,2}}{t_{1/2,1}} = \\left(\\frac{P_2}{P_1}\\right)^{1-n}$$

$t_{1/2,1} = 240\\,\\mathrm{s}$, $P_1 = 500\\,\\mathrm{Torr}$

$t_{1/2,2} = 4.0\\,\\mathrm{min} = 240\\,\\mathrm{s}$, $P_2 = 250\\,\\mathrm{Torr}$

$$\\frac{240}{240} = \\left(\\frac{250}{500}\\right)^{1-n} \\Rightarrow 1 = (0.5)^{1-n} \\Rightarrow 1-n = 0 \\Rightarrow n = 1$$

**Answer: Order = 1 (first order)**`,
'tag_kinetics_4', src(2022, 'Jul', 25, 'Morning')),

// Q27 — Order of reaction A→2B+C from half-life data; Answer: 2
mkNVT('CK-027', 'Medium',
`For a reaction $\\mathrm{A \\rightarrow 2B + C}$ the half lives are 100 s and 50 s when the concentration of reactant A is 0.5 and $1.0\\,\\mathrm{mol\\,L^{-1}}$ respectively. The order of the reaction is $\\_\\_\\_\\_$`,
{ integer_value: 2 },
`For an $n$th order reaction: $t_{1/2} \\propto [\\mathrm{A}]_0^{1-n}$

$$\\frac{t_{1/2,1}}{t_{1/2,2}} = \\left(\\frac{[\\mathrm{A}]_{0,1}}{[\\mathrm{A}]_{0,2}}\\right)^{1-n}$$

$$\\frac{100}{50} = \\left(\\frac{0.5}{1.0}\\right)^{1-n}$$

$$2 = (0.5)^{1-n} = 2^{n-1}$$

$$2^1 = 2^{n-1} \\Rightarrow n - 1 = 1 \\Rightarrow n = 2$$

**Answer: Order = 2 (second order)**`,
'tag_kinetics_4', src(2022, 'Jul', 26, 'Morning')),

// Q28 — Correct option for order from graphs; Answer: (4)
mkSCQ('CK-028', 'Hard',
`For the following graphs:

![Graph (a)](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-03.jpg?height=175&width=216&top_left_y=2279&top_left_x=255)
![Graph (b)](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-03.jpg?height=195&width=193&top_left_y=2261&top_left_x=518)
![Graph (c)/(d)](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-03.jpg?height=154&width=182&top_left_y=2129&top_left_x=785)
![Graph (d)](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-03.jpg?height=154&width=191&top_left_y=2129&top_left_x=1018)

Choose from the options given below, the correct one regarding order of reaction is:`,
[
  '(b) zero order; (c) and (e) First order',
  '(a) and (b) Zero order; (e) First order',
  '(b) and (d) Zero order; (e) First order',
  '(a) and (b) Zero order; (c) and (e) First order'
],
'd',
`**Identifying orders from graphs:**

- **Zero order:** $[\\mathrm{A}]$ vs $t$ is a straight line with negative slope → graphs (a) and (b)
- **First order:** $\\ln[\\mathrm{A}]$ vs $t$ is a straight line with negative slope → graphs (c) and (e)
- **Second order:** $1/[\\mathrm{A}]$ vs $t$ is a straight line with positive slope

**Answer: Option (4) — (a) and (b) Zero order; (c) and (e) First order**`,
'tag_kinetics_4', src(2021, 'Jul', 25, 'Morning')),

// Q29 — Correct reaction profile for positive catalyst; Answer: (2)
mkSCQ('CK-029', 'Easy',
`The correct reaction profile diagram for a positive catalyst reaction.

![Option 1](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=247&width=346&top_left_y=258&top_left_x=274)
![Option 2](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=247&width=339&top_left_y=258&top_left_x=641)
![Option 3](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=250&width=355&top_left_y=258&top_left_x=1018)
![Option 4](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=266&width=362&top_left_y=255&top_left_x=1384)`,
['Option 1', 'Option 2', 'Option 3', 'Option 4'],
'b',
`A **positive catalyst** (or simply a catalyst) lowers the activation energy of the reaction without changing the overall enthalpy change ($\\Delta H$). Key features:
- The energy of reactants and products remains the same
- The activation energy ($E_a$) is **lower** with catalyst
- The transition state energy is lower
- $\\Delta H$ of reaction is unchanged

The correct profile shows a lower energy barrier (transition state) compared to the uncatalysed reaction, with the same reactant and product energy levels.

**Answer: Option (2)**`,
'tag_kinetics_6', src(2023, 'Apr', 8, 'Evening')),

// Q30 — Activation energy from Arrhenius equation; Answer: 216
mkNVT('CK-030', 'Medium',
`The equation $k = (6.5 \\times 10^{12}\\,\\mathrm{s^{-1}})\\,e^{-26000\\,\\mathrm{K}/T}$ is followed for the decomposition of compound A. The activation energy for the reaction is $\\_\\_\\_\\_\\,\\mathrm{kJ\\,mol^{-1}}$. [nearest integer]

(Given: $R = 8.314\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$)`,
{ integer_value: 216 },
`Comparing with the Arrhenius equation $k = Ae^{-E_a/RT}$:

$$\\frac{E_a}{R} = 26000\\,\\mathrm{K}$$

$$E_a = 26000 \\times R = 26000 \\times 8.314 = 216164\\,\\mathrm{J\\,mol^{-1}} = 216.164\\,\\mathrm{kJ\\,mol^{-1}} \\approx 216\\,\\mathrm{kJ\\,mol^{-1}}$$

**Answer: 216 kJ/mol**`,
'tag_kinetics_1', src(2022, 'Jun', 29, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-021 to CK-030)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
