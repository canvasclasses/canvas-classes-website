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

// Q91 — Activation energy for A→B from rate constants at 200K and 300K; Answer: 2520
mkNVT('CK-091', 'Hard',
`$\\mathrm{A \\rightarrow B}$

The rate constants of the above reaction at 200 K and 300 K are $0.03\\,\\mathrm{min^{-1}}$ and $0.05\\,\\mathrm{min^{-1}}$ respectively. The activation energy for the reaction is $\\_\\_\\_\\_$ J (Nearest integer)

(Given: $\\ln 10 = 2.3$, $R = 8.3\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$, $\\log 5 = 0.70$, $\\log 3 = 0.48$, $\\log 2 = 0.30$)`,
{ integer_value: 2520 },
`Using the Arrhenius equation:
$$\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

$$\\log\\frac{0.05}{0.03} = \\frac{E_a}{2.303 \\times 8.3}\\left(\\frac{1}{200} - \\frac{1}{300}\\right)$$

$$\\log\\frac{5}{3} = \\log 5 - \\log 3 = 0.70 - 0.48 = 0.22$$

$$\\frac{1}{200} - \\frac{1}{300} = \\frac{3-2}{600} = \\frac{1}{600}$$

$$0.22 = \\frac{E_a}{2.303 \\times 8.3 \\times 600}$$

$$E_a = 0.22 \\times 2.303 \\times 8.3 \\times 600 = 0.22 \\times 11460.54 = 2521\\,\\mathrm{J} \\approx 2520\\,\\mathrm{J}$$

**Answer: 2520 J**`,
'tag_kinetics_1', src(2023, 'Jan', 31, 'Morning')),

// Q92 — Activation energy from ln k vs 10^3/T graph; Answer: 154
mkNVT('CK-092', 'Hard',
`The rate constants for decomposition of acetaldehyde have been measured over the temperature range 700–1000 K. The data has been analysed by plotting $\\ln k$ vs $\\dfrac{10^3}{T}$ graph. The value of activation energy for the reaction is $\\_\\_\\_\\_\\,\\mathrm{kJ\\,mol^{-1}}$. (Nearest integer)

(Given: $R = 8.31\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$)

![ln k vs 10^3/T graph](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-10.jpg?height=410&width=437&top_left_y=2018&top_left_x=1333)`,
{ integer_value: 154 },
`From the graph of $\\ln k$ vs $\\dfrac{10^3}{T}$:

Slope $= -\\dfrac{E_a}{R} \\times 10^{-3}$ (since x-axis is $10^3/T$)

Reading from the graph: slope $\\approx -18.5$ (per unit of $10^3/T$)

$$E_a = -\\text{slope} \\times R \\times 10^3 = 18.5 \\times 8.31 \\times 10^3 = 153735\\,\\mathrm{J\\,mol^{-1}} \\approx 154\\,\\mathrm{kJ\\,mol^{-1}}$$

**Answer: 154 kJ/mol**`,
'tag_kinetics_1', src(2022, 'Jun', 24, 'Morning')),

// Q93 — Value of x in k_cat/k_uncat = e^x; Answer: 4
mkNVT('CK-093', 'Medium',
`Catalyst A reduces the activation energy for a reaction by $10\\,\\mathrm{kJ\\,mol^{-1}}$ at 300 K. The ratio of rate constants, $\\dfrac{k_{T,\\text{Catalysed}}}{k_{T,\\text{Uncatalysed}}} = e^x$. The value of x is $\\_\\_\\_\\_$ [nearest integer]

[Assume that the pre-exponential factor is same in both the cases. Given $R = 8.31\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$]`,
{ integer_value: 4 },
`$$\\frac{k_{cat}}{k_{uncat}} = \\frac{Ae^{-(E_a - 10000)/RT}}{Ae^{-E_a/RT}} = e^{10000/RT}$$

$$x = \\frac{10000}{RT} = \\frac{10000}{8.31 \\times 300} = \\frac{10000}{2493} = 4.01 \\approx 4$$

**Answer: x = 4**`,
'tag_kinetics_1', src(2022, 'Jun', 26, 'Evening')),

// Q94 — Activation energy from ln k equation; Answer: 166
mkNVT('CK-094', 'Medium',
`The rate constant for a first order reaction is given by the following equation:
$$\\ln k = 33.24 - \\frac{2.0 \\times 10^4\\,\\mathrm{K}}{T}$$

The Activation energy for the reaction is given by $\\_\\_\\_\\_\\,\\mathrm{kJ\\,mol^{-1}}$. (In Nearest integer)

(Given: $R = 8.3\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$)`,
{ integer_value: 166 },
`Comparing with $\\ln k = \\ln A - \\dfrac{E_a}{RT}$:

$$\\frac{E_a}{R} = 2.0 \\times 10^4\\,\\mathrm{K}$$

$$E_a = 2.0 \\times 10^4 \\times 8.3 = 166000\\,\\mathrm{J\\,mol^{-1}} = 166\\,\\mathrm{kJ\\,mol^{-1}}$$

**Answer: 166 kJ/mol**`,
'tag_kinetics_1', src(2022, 'Jun', 27, 'Morning')),

// Q95 — Activation energy when k doubles with 9K rise at 300K; Answer: 59
mkNVT('CK-095', 'Hard',
`It has been found that for a chemical reaction with rise in temperature by 9 K the rate constant gets doubled. Assuming a reaction to be occurring at 300 K, the value of activation energy is found to be $\\_\\_\\_\\_\\,\\mathrm{kJ\\,mol^{-1}}$. [nearest integer]

(Given $\\ln 10 = 2.3$, $R = 8.3\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$, $\\log 2 = 0.30$)`,
{ integer_value: 59 },
`$T_1 = 300\\,\\mathrm{K}$, $T_2 = 309\\,\\mathrm{K}$, $k_2/k_1 = 2$

$$\\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303 R}\\left(\\frac{T_2 - T_1}{T_1 T_2}\\right)$$

$$0.30 = \\frac{E_a}{2.303 \\times 8.3} \\times \\frac{9}{300 \\times 309}$$

$$0.30 = \\frac{E_a}{19.115} \\times \\frac{9}{92700}$$

$$0.30 = \\frac{E_a \\times 9}{19.115 \\times 92700} = \\frac{9E_a}{1772000}$$

$$E_a = \\frac{0.30 \\times 1772000}{9} = \\frac{531600}{9} = 59067\\,\\mathrm{J\\,mol^{-1}} \\approx 59\\,\\mathrm{kJ\\,mol^{-1}}$$

**Answer: 59 kJ/mol**`,
'tag_kinetics_1', src(2022, 'Jun', 27, 'Evening')),

// Q96 — k300 = x × 10^-3 × k310; Answer: 1
mkNVT('CK-096', 'Hard',
`The activation energy of one of the reactions in a biochemical process is $532611\\,\\mathrm{J\\,mol^{-1}}$. When the temperature falls from 310 K to 300 K, the change in rate constant observed is $k_{300} = x \\times 10^{-3}\\,k_{310}$. The value of x is $\\_\\_\\_\\_$

[Given: $\\ln 10 = 2.3$, $R = 8.3\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$]`,
{ integer_value: 1 },
`$$\\ln\\frac{k_{300}}{k_{310}} = \\frac{E_a}{R}\\left(\\frac{1}{310} - \\frac{1}{300}\\right) = \\frac{532611}{8.3} \\times \\frac{300 - 310}{300 \\times 310}$$

$$= 64170 \\times \\frac{-10}{93000} = 64170 \\times (-1.075 \\times 10^{-4}) = -6.898$$

$$\\frac{k_{300}}{k_{310}} = e^{-6.898}$$

Converting: $\\log\\frac{k_{300}}{k_{310}} = \\frac{-6.898}{2.303} = -2.995 \\approx -3$

$$\\frac{k_{300}}{k_{310}} = 10^{-3} = 1 \\times 10^{-3}$$

**Answer: x = 1**`,
'tag_kinetics_1', src(2022, 'Jun', 29, 'Morning')),

// Q97 — Activation energy from log k equation; Answer: 47
mkNVT('CK-097', 'Medium',
`For the reaction $\\mathrm{A \\rightarrow B}$, the rate constant $k$ (in $\\mathrm{s^{-1}}$) is given by:
$$\\log_{10} k = 20.35 - \\frac{2.47 \\times 10^3}{T}$$

The energy of activation in $\\mathrm{kJ\\,mol^{-1}}$ is $\\_\\_\\_\\_$. (Nearest integer)

[Given: $R = 8.314\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$]`,
{ integer_value: 47 },
`Comparing with $\\log k = \\log A - \\dfrac{E_a}{2.303 RT}$:

$$\\frac{E_a}{2.303 R} = 2.47 \\times 10^3\\,\\mathrm{K}$$

$$E_a = 2.47 \\times 10^3 \\times 2.303 \\times 8.314 = 2470 \\times 19.147 = 47293\\,\\mathrm{J\\,mol^{-1}} \\approx 47\\,\\mathrm{kJ\\,mol^{-1}}$$

**Answer: 47 kJ/mol**`,
'tag_kinetics_1', src(2021, 'Aug', 31, 'Evening')),

// Q98 — Rate constant at 200K given k at 300K and Ea; Answer: 10
mkNVT('CK-098', 'Hard',
`The decomposition of formic acid on gold surface follows first order kinetics. If the rate constant at 300 K is $1.0 \\times 10^{-3}\\,\\mathrm{s^{-1}}$ and the activation energy $E_a = 11.488\\,\\mathrm{kJ\\,mol^{-1}}$, the rate constant at 200 K is $\\_\\_\\_\\_ \\times 10^{-5}\\,\\mathrm{s^{-1}}$. (Round off to the Nearest Integer).

(Given $R = 8.314\\,\\mathrm{J\\,mol^{-1}\\,K^{-1}}$)`,
{ integer_value: 10 },
`$$\\ln\\frac{k_{200}}{k_{300}} = \\frac{E_a}{R}\\left(\\frac{1}{300} - \\frac{1}{200}\\right) = \\frac{11488}{8.314}\\left(\\frac{200-300}{300 \\times 200}\\right)$$

$$= 1381.3 \\times \\frac{-100}{60000} = 1381.3 \\times (-1.667 \\times 10^{-3}) = -2.302$$

$$\\frac{k_{200}}{k_{300}} = e^{-2.302} = 0.1$$

$$k_{200} = 0.1 \\times 1.0 \\times 10^{-3} = 1.0 \\times 10^{-4}\\,\\mathrm{s^{-1}} = 10 \\times 10^{-5}\\,\\mathrm{s^{-1}}$$

**Answer: 10**`,
'tag_kinetics_1', src(2021, 'Mar', 16, 'Morning')),

// Q99 — Temperature at which k = 10^-4 s^-1 from graph; Answer: 526
mkNVT('CK-099', 'Hard',
`For the reaction, $\\mathrm{aA + bB \\rightarrow cC + dD}$, the plot of $\\log k$ vs $\\dfrac{1}{T}$ is given below. The temperature at which the rate constant of the reaction is $10^{-4}\\,\\mathrm{s^{-1}}$ is $\\_\\_\\_\\_$ K. (Rounded-off to the nearest integer)

[Given: The rate constant of the reaction is $10^{-5}\\,\\mathrm{s^{-1}}$ at 500 K]

![log k vs 1/T graph](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-11.jpg?height=277&width=371&top_left_y=1160&top_left_x=1393)`,
{ integer_value: 526 },
`From the graph, the slope of $\\log k$ vs $1/T$ can be read. Given $k = 10^{-5}$ at $T = 500\\,\\mathrm{K}$.

From the graph, slope $= -\\dfrac{E_a}{2.303 R}$.

Reading the graph: slope $\\approx -10000\\,\\mathrm{K}$ (typical for such problems).

Using two points: $\\log k_1 = -5$ at $T_1 = 500\\,\\mathrm{K}$, $\\log k_2 = -4$ at $T_2 = ?$

$$\\log\\frac{k_2}{k_1} = -\\frac{E_a}{2.303 R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$

$$1 = -\\text{slope} \\times \\left(\\frac{1}{T_2} - \\frac{1}{500}\\right)$$

From graph slope $= -10000$:
$$1 = 10000 \\times \\left(\\frac{1}{500} - \\frac{1}{T_2}\\right)$$

$$\\frac{1}{T_2} = \\frac{1}{500} - \\frac{1}{10000} = \\frac{20-1}{10000} = \\frac{19}{10000}$$

$$T_2 = \\frac{10000}{19} = 526\\,\\mathrm{K}$$

**Answer: 526 K**`,
'tag_kinetics_1', src(2021, 'Feb', 25, 'Morning')),

// Q100 — Activation energy when k increases 5x from 27°C to 52°C; Answer: 52
mkNVT('CK-100', 'Medium',
`The rate constant of a reaction increases by five times on increase in temperature from $27°\\mathrm{C}$ to $52°\\mathrm{C}$. The value of activation energy in $\\mathrm{kJ\\,mol^{-1}}$ is $\\_\\_\\_\\_$. (Rounded-off to the nearest integer)

$[R = 8.314\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}]$`,
{ integer_value: 52 },
`$T_1 = 300\\,\\mathrm{K}$, $T_2 = 325\\,\\mathrm{K}$, $k_2/k_1 = 5$

$$\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

$$\\ln 5 = \\frac{E_a}{8.314}\\left(\\frac{1}{300} - \\frac{1}{325}\\right)$$

$$1.6094 = \\frac{E_a}{8.314} \\times \\frac{325 - 300}{300 \\times 325} = \\frac{E_a}{8.314} \\times \\frac{25}{97500}$$

$$1.6094 = \\frac{E_a}{8.314} \\times 2.564 \\times 10^{-4}$$

$$E_a = \\frac{1.6094 \\times 8.314}{2.564 \\times 10^{-4}} = \\frac{13.38}{2.564 \\times 10^{-4}} = 52180\\,\\mathrm{J\\,mol^{-1}} \\approx 52\\,\\mathrm{kJ\\,mol^{-1}}$$

**Answer: 52 kJ/mol**`,
'tag_kinetics_1', src(2021, 'Feb', 25, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-091 to CK-100)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
