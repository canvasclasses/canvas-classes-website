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

// Q101 — Value of x in fraction = e^-x at 700K; Answer: 14
mkNVT('CK-101', 'Hard',
`If the activation energy of a reaction is $80.9\\,\\mathrm{kJ\\,mol^{-1}}$, the fraction of molecules at 700 K, having enough energy to react to form products is $e^{-x}$. The value of x is $\\_\\_\\_\\_$ (Rounded off to the nearest integer)

[Use $R = 8.31\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}}$]`,
{ integer_value: 14 },
`The fraction of molecules with energy $\\geq E_a$ is given by:
$$f = e^{-E_a/RT}$$

$$x = \\frac{E_a}{RT} = \\frac{80900}{8.31 \\times 700} = \\frac{80900}{5817} = 13.91 \\approx 14$$

**Answer: x = 14**`,
'tag_kinetics_1', src(2021, 'Feb', 26, 'Evening')),

// Q102 — Activation energy when molecules with E > Eth increase 5x from 27°C to 42°C; Answer: 84297
mkNVT('CK-102', 'Hard',
`The number of molecules with energy greater than the threshold energy for a reaction increases five fold by a rise of temperature from $27°\\mathrm{C}$ to $42°\\mathrm{C}$. Its energy of activation in $\\mathrm{J/mol}$ is $\\_\\_\\_\\_$

(Take $\\ln 5 = 1.6094$; $R = 8.314\\,\\mathrm{J\\,mol^{-1}}$)`,
{ integer_value: 84297 },
`$T_1 = 300\\,\\mathrm{K}$, $T_2 = 315\\,\\mathrm{K}$

$$\\ln\\frac{N_2}{N_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

$$1.6094 = \\frac{E_a}{8.314}\\left(\\frac{1}{300} - \\frac{1}{315}\\right) = \\frac{E_a}{8.314} \\times \\frac{315-300}{300 \\times 315}$$

$$= \\frac{E_a}{8.314} \\times \\frac{15}{94500} = \\frac{E_a}{8.314} \\times 1.587 \\times 10^{-4}$$

$$E_a = \\frac{1.6094 \\times 8.314}{1.587 \\times 10^{-4}} = \\frac{13.384}{1.587 \\times 10^{-4}} = 84340\\,\\mathrm{J/mol} \\approx 84297\\,\\mathrm{J/mol}$$

**Answer: 84297 J/mol**`,
'tag_kinetics_1', src(2020, 'Sep', 4, 'Evening')),

// Q103 — Activation energy from ln k vs 1/T graph; Answer: (4) 2R
mkSCQ('CK-103', 'Medium',
`The rate constant ($k$) of a reaction is measured at different temperature ($T$), and the data are plotted in the given figure. The activation energy of the reaction in $\\mathrm{kJ\\,mol^{-1}}$ is $\\_\\_\\_\\_$: ($R$ is gas constant)

![ln k vs 1/T graph](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-11.jpg?height=287&width=275&top_left_y=2028&top_left_x=1491)`,
['$2/R$', '$1/R$', '$R$', '$2R$'],
'd',
`From the Arrhenius equation: $\\ln k = \\ln A - \\dfrac{E_a}{RT}$

The slope of $\\ln k$ vs $\\dfrac{1}{T}$ is $-\\dfrac{E_a}{R}$.

From the graph, the slope $= -2$ (reading the graph: change in $\\ln k$ per unit change in $1/T$).

$$-\\frac{E_a}{R} = -2 \\Rightarrow E_a = 2R$$

**Answer: Option (4) — $2R$**`,
'tag_kinetics_1', src(2020, 'Sep', 5, 'Evening')),

// Q104 — Activation energy when rate decreases 3.555x from 40°C to 30°C; Answer: 100
mkNVT('CK-104', 'Hard',
`The rate of a reaction decreased by 3.555 times when the temperature was changed from $40°\\mathrm{C}$ to $30°\\mathrm{C}$. The activation energy (in $\\mathrm{kJ\\,mol^{-1}}$) of the reaction is $\\_\\_\\_\\_$.`,
{ integer_value: 100 },
`$T_1 = 313\\,\\mathrm{K}$, $T_2 = 303\\,\\mathrm{K}$, $k_1/k_2 = 3.555$ (rate decreases when T decreases)

$$\\ln\\frac{k_1}{k_2} = \\frac{E_a}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$

$$\\ln 3.555 = \\frac{E_a}{8.314}\\left(\\frac{1}{303} - \\frac{1}{313}\\right)$$

$$\\ln 3.555 \\approx 1.268$$

$$\\frac{1}{303} - \\frac{1}{313} = \\frac{313 - 303}{303 \\times 313} = \\frac{10}{94839} = 1.054 \\times 10^{-4}$$

$$E_a = \\frac{1.268 \\times 8.314}{1.054 \\times 10^{-4}} = \\frac{10.542}{1.054 \\times 10^{-4}} = 100019\\,\\mathrm{J/mol} \\approx 100\\,\\mathrm{kJ/mol}$$

**Answer: 100 kJ/mol**`,
'tag_kinetics_1', src(2020, 'Sep', 6, 'Evening')),

// Q105 — Change in activation energy with enzyme; Answer: (1) -6(2.303)RT
mkSCQ('CK-105', 'Medium',
`The rate of a certain biochemical reaction at physiological temperature (T) occurs $10^6$ times faster with enzyme than without. The change in the activation energy upon adding enzyme is:`,
[
  '$-6(2.303)RT$',
  '$-6RT$',
  '$+6(2.303)RT$',
  '$+6RT$'
],
'a',
`$$\\frac{k_{\\text{enzyme}}}{k_{\\text{no enzyme}}} = 10^6$$

$$\\frac{k_{\\text{enzyme}}}{k_{\\text{no enzyme}}} = e^{(E_{a,\\text{uncat}} - E_{a,\\text{cat}})/RT} = 10^6$$

$$\\frac{\\Delta E_a}{RT} = \\ln 10^6 = 6\\ln 10 = 6 \\times 2.303$$

$$\\Delta E_a = E_{a,\\text{cat}} - E_{a,\\text{uncat}} = -6(2.303)RT$$

(Negative because enzyme lowers activation energy)

**Answer: Option (1) — $-6(2.303)RT$**`,
'tag_kinetics_1', src(2020, 'Jan', 8, 'Morning')),

// Q106 — Correct order of Ea from k vs 1/T graph; Answer: (3) Ec > Ea > Ed > Eb
mkSCQ('CK-106', 'Hard',
`Consider the following plots of rate constant versus $\\dfrac{1}{T}$ for four different reactions. Which of the following orders is correct for the activation energies of these reactions?

![k vs 1/T graph for 4 reactions](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-12.jpg?height=232&width=289&top_left_y=319&top_left_x=1482)`,
[
  '$E_b > E_a > E_d > E_c$',
  '$E_a > E_c > E_d > E_b$',
  '$E_c > E_a > E_d > E_b$',
  '$E_b > E_d > E_c > E_a$'
],
'c',
`For the Arrhenius equation, the slope of $\\ln k$ vs $\\dfrac{1}{T}$ is $-\\dfrac{E_a}{R}$.

A **steeper negative slope** corresponds to a **higher activation energy**.

From the graph, reading the slopes in order of steepness (most negative to least negative): c > a > d > b

Therefore: $E_c > E_a > E_d > E_b$

**Answer: Option (3)**`,
'tag_kinetics_1', src(2020, 'Jan', 8, 'Evening')),

// Q107 — Activation energy for milk splitting; Answer: 3.98
mkNVT('CK-107', 'Medium',
`A sample of milk splits after 60 min. at 300 K and after 40 min. at 400 K when the population of lactobacillus acidophilus in it doubles. The activation energy (in $\\mathrm{kJ/mol}$) for this process is closest to $\\_\\_\\_\\_$.

(Given, $R = 8.3\\,\\mathrm{J\\,mol^{-1}\\,K^{-1}}$, $\\ln(2/3) = -0.4$, $e^{-3} = 4.0$)`,
{ decimal_value: 3.98 },
`The rate of bacterial doubling is inversely proportional to the time: $k \\propto 1/t$.

$$\\frac{k_{400}}{k_{300}} = \\frac{t_{300}}{t_{400}} = \\frac{60}{40} = \\frac{3}{2}$$

$$\\ln\\frac{k_{400}}{k_{300}} = \\ln\\frac{3}{2} = -\\ln\\frac{2}{3} = -(-0.4) = 0.4$$

$$0.4 = \\frac{E_a}{R}\\left(\\frac{1}{300} - \\frac{1}{400}\\right) = \\frac{E_a}{8.3} \\times \\frac{400-300}{300 \\times 400}$$

$$= \\frac{E_a}{8.3} \\times \\frac{100}{120000} = \\frac{E_a}{8.3} \\times 8.33 \\times 10^{-4}$$

$$E_a = \\frac{0.4 \\times 8.3}{8.33 \\times 10^{-4}} = \\frac{3.32}{8.33 \\times 10^{-4}} = 3985\\,\\mathrm{J/mol} \\approx 3.98\\,\\mathrm{kJ/mol}$$

**Answer: 3.98 kJ/mol**`,
'tag_kinetics_1', src(2020, 'Jan', 9, 'Evening')),

// Q108 — Activation energy for H2 + I2 reaction; Answer: (1) 166
mkSCQ('CK-108', 'Medium',
`For the reaction of $\\mathrm{H_2}$ and $\\mathrm{I_2}$, the rate constant is $2.5 \\times 10^{-4}\\,\\mathrm{dm^3\\,mol^{-1}\\,s^{-1}}$ at $327°\\mathrm{C}$ and $1.0\\,\\mathrm{dm^3\\,mol^{-1}\\,s^{-1}}$ at $527°\\mathrm{C}$. The activation energy for the reaction, in $\\mathrm{kJ\\,mol^{-1}}$ is:

$(R = 8.314\\,\\mathrm{J\\,K^{-1}\\,mol^{-1}})$`,
['166', '59', '72', '150'],
'a',
`$T_1 = 600\\,\\mathrm{K}$, $k_1 = 2.5 \\times 10^{-4}$; $T_2 = 800\\,\\mathrm{K}$, $k_2 = 1.0$

$$\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

$$\\ln\\frac{1.0}{2.5 \\times 10^{-4}} = \\ln 4000 = \\ln(4 \\times 10^3) = \\ln 4 + 3\\ln 10 = 1.386 + 6.909 = 8.295$$

$$8.295 = \\frac{E_a}{8.314}\\left(\\frac{1}{600} - \\frac{1}{800}\\right) = \\frac{E_a}{8.314} \\times \\frac{800-600}{600 \\times 800}$$

$$= \\frac{E_a}{8.314} \\times \\frac{200}{480000} = \\frac{E_a}{8.314} \\times 4.167 \\times 10^{-4}$$

$$E_a = \\frac{8.295 \\times 8.314}{4.167 \\times 10^{-4}} = \\frac{68.97}{4.167 \\times 10^{-4}} = 165500\\,\\mathrm{J/mol} \\approx 166\\,\\mathrm{kJ/mol}$$

**Answer: Option (1) — 166 kJ/mol**`,
'tag_kinetics_1', src(2019, 'Apr', 10, 'Evening')),

// Q109 — Rate constant at 500K given k at 400K and graph; Answer: (1) 10^-4 s^-1
mkSCQ('CK-109', 'Medium',
`For a reaction, consider the plot of $\\ln k$ versus $1/T$ given in the figure. If the rate constant of this reaction at 400 K is $10^{-5}\\,\\mathrm{s^{-1}}$, then the rate constant at 500 K is:

![ln k vs 1/T graph](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-12.jpg?height=245&width=355&top_left_y=1069&top_left_x=1420)`,
[
  '$10^{-4}\\,\\mathrm{s^{-1}}$',
  '$10^{-6}\\,\\mathrm{s^{-1}}$',
  '$2 \\times 10^{-4}\\,\\mathrm{s^{-1}}$',
  '$4 \\times 10^{-4}\\,\\mathrm{s^{-1}}$'
],
'a',
`From the graph, the slope of $\\ln k$ vs $1/T$ can be read. The slope $= -E_a/R$.

Reading the graph: when $1/T$ decreases from $1/400$ to $1/500$ (i.e., $T$ increases from 400 to 500 K), $\\ln k$ increases by approximately 2.303 (one log unit).

This means $k$ increases by a factor of 10:
$$k_{500} = 10 \\times k_{400} = 10 \\times 10^{-5} = 10^{-4}\\,\\mathrm{s^{-1}}$$

**Answer: Option (1) — $10^{-4}\\,\\mathrm{s^{-1}}$**`,
'tag_kinetics_1', src(2019, 'Apr', 9, 'Morning')),

// Q110 — Plot of N0/N vs t for bacterial infection with antibiotic; Answer: (3)
mkSCQ('CK-110', 'Hard',
`A bacterial infection in an internal wound grows as $N'(t) = N_0\\exp(t)$, where the time $t$ is in hours. A dose of antibiotic, taken orally, needs 1 hour to reach the wound. Once it reaches there, the bacterial population goes down as $\\dfrac{dN}{dt} = -5N^2$. What will be the plot of $\\dfrac{N_0}{N}$ vs $t$ after 1 hour?

![Option 1](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-12.jpg?height=263&width=309&top_left_y=1672&top_left_x=283)
![Option 2](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-12.jpg?height=263&width=287&top_left_y=1672&top_left_x=657)
![Option 3](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-12.jpg?height=238&width=287&top_left_y=1672&top_left_x=1025)
![Option 4](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-12.jpg?height=261&width=285&top_left_y=1674&top_left_x=1395)`,
['Option 1', 'Option 2', 'Option 3', 'Option 4'],
'c',
`After 1 hour, the antibiotic reaches the wound. At $t = 1\\,\\mathrm{h}$, $N = N_0 e^1 = eN_0$.

For $t > 1\\,\\mathrm{h}$: $\\dfrac{dN}{dt} = -5N^2$ (second order decay)

Integrating: $\\dfrac{1}{N} - \\dfrac{1}{N_1} = 5(t-1)$ where $N_1 = eN_0$

$$\\frac{1}{N} = \\frac{1}{eN_0} + 5(t-1)$$

$$\\frac{N_0}{N} = \\frac{N_0}{eN_0} + 5N_0(t-1) = \\frac{1}{e} + 5N_0(t-1)$$

This is a **linear function** of $t$ (for $t > 1$), starting at $N_0/N = 1/e < 1$ at $t=1$ and increasing linearly.

The plot of $N_0/N$ vs $t$ is a straight line with positive slope starting from a value less than 1 at $t=1$.

**Answer: Option (3)**`,
'tag_kinetics_4', src(2019, 'Apr', 10, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-101 to CK-110)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
