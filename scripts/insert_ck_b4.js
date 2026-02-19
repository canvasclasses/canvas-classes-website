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

// Q31 — Graph of k vs T for endothermic reaction; Answer: (1)
mkSCQ('CK-031', 'Medium',
`Which one of the following given graphs represents the variation of rate constant (k) with temperature (T) for an endothermic reaction?

![Option 1](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=227&width=222&top_left_y=831&top_left_x=274)
![Option 2](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=237&width=223&top_left_y=826&top_left_x=648)
![Option 3](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=234&width=222&top_left_y=829&top_left_x=1023)
![Option 4](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=232&width=232&top_left_y=831&top_left_x=1388)`,
['Option 1', 'Option 2', 'Option 3', 'Option 4'],
'a',
`For any reaction (endothermic or exothermic), the rate constant $k$ increases with temperature according to the Arrhenius equation:
$$k = Ae^{-E_a/RT}$$

As $T$ increases, $k$ increases exponentially. The graph of $k$ vs $T$ is an exponential curve that starts near zero at low temperatures and rises steeply.

For an endothermic reaction, $E_a(\\text{forward}) > E_a(\\text{reverse})$, but the shape of $k$ vs $T$ is still an exponential increase.

**Answer: Option (1)** — exponential increase of k with T`,
'tag_kinetics_1', src(2021, 'Sep', 1, 'Evening')),

// Q32 — Activation energy for catalysed reaction; Answer: (1) 75 kJ/mol
mkSCQ('CK-032', 'Hard',
`For the following reactions:
$$\\mathrm{A} \\xrightarrow{700\\,\\mathrm{K}} \\text{Product}$$
$$\\mathrm{A} \\xrightarrow[\\text{catalyst}]{500\\,\\mathrm{K}} \\text{Product}$$

It was found that the $E_a$ is decreased by $30\\,\\mathrm{kJ/mol}$ in the presence of catalyst. If the rate remains unchanged, the activation energy for catalysed reaction is (Assume pre-exponential factor is same)`,
['$75\\,\\mathrm{kJ/mol}$', '$105\\,\\mathrm{kJ/mol}$', '$135\\,\\mathrm{kJ/mol}$', '$198\\,\\mathrm{kJ/mol}$'],
'a',
`Since rate remains unchanged with catalyst at lower temperature:
$$k_1 = k_2 \\ \\Rightarrow\\ Ae^{-E_a/(R \\times 700)} = Ae^{-(E_a - 30000)/(R \\times 500)}$$

$$\\frac{E_a}{700} = \\frac{E_a - 30000}{500}$$

$$500 E_a = 700(E_a - 30000)$$

$$500 E_a = 700 E_a - 21000000$$

$$200 E_a = 21000000$$

$$E_a = 105000\\,\\mathrm{J/mol} = 105\\,\\mathrm{kJ/mol}$$

Activation energy for catalysed reaction $= 105 - 30 = 75\\,\\mathrm{kJ/mol}$

**Answer: Option (1) — 75 kJ/mol**`,
'tag_kinetics_1', src(2020, 'Jan', 9, 'Morning')),

// Q33 — Correct/incorrect plots for Arrhenius equation; Answer: (4) Both I and II correct
mkSCQ('CK-033', 'Hard',
`Consider the given plots for a reaction obeying Arrhenius equation ($0°\\mathrm{C} < T < 300°\\mathrm{C}$): ($K$ and $E_a$ are rate constant and activation energy, respectively)

![Plot I](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=200&width=204&top_left_y=1587&top_left_x=260)
![Plot II](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-04.jpg?height=191&width=188&top_left_y=1594&top_left_x=532)`,
[
  'I is wrong but II is right',
  'Both I and II are wrong',
  'I is right but II is wrong',
  'Both I and II are correct'
],
'd',
`**Arrhenius equation:** $k = Ae^{-E_a/RT}$, so $\\ln k = \\ln A - \\frac{E_a}{RT}$

**Plot I** — $\\ln k$ vs $T$: As $T$ increases, $\\ln k$ increases (non-linearly, since the relationship is $\\ln k \\propto -1/T$). The curve is concave and increasing. **Correct.**

**Plot II** — $\\ln k$ vs $1/T$: This gives a straight line with slope $= -E_a/R$ (negative slope). **Correct.**

**Answer: Option (4) — Both I and II are correct**`,
'tag_kinetics_1', src(2019, 'Jan', 10, 'Morning')),

// Q34 — Energy to activate reactant from ln k vs 1/RT plot; Answer: (2) y unit
mkSCQ('CK-034', 'Easy',
`If a reaction follows the Arrhenius equation, the plot $\\ln k$ vs $\\dfrac{1}{RT}$ gives straight line with a gradient $(-y)$ unit. The energy required to activate the reactant is:`,
['$y/R$ unit', '$y$ unit', '$yR$ unit', '$-y$ unit'],
'b',
`Arrhenius equation: $\\ln k = \\ln A - \\frac{E_a}{RT}$

Rewriting as a function of $\\frac{1}{RT}$:
$$\\ln k = \\ln A - E_a \\cdot \\frac{1}{RT}$$

This is a straight line with slope $= -E_a$ when plotted as $\\ln k$ vs $\\frac{1}{RT}$.

Given slope $= -y$, therefore $E_a = y$ unit.

**Answer: Option (2) — y unit**`,
'tag_kinetics_1', src(2019, 'Jan', 11, 'Morning')),

// Q35 — Rate of formation of NO2 from N2O5 decomposition; Answer: 17
mkNVT('CK-035', 'Easy',
`$\\mathrm{NO_2}$ required for a reaction is produced by decomposition of $\\mathrm{N_2O_5}$ in $\\mathrm{CCl_4}$ as by equation:
$$\\mathrm{2N_2O_{5(g)} \\rightarrow 4NO_{2(g)} + O_{2(g)}}$$

The initial concentration of $\\mathrm{N_2O_5}$ is $3\\,\\mathrm{mol\\,L^{-1}}$ and it is $2.75\\,\\mathrm{mol\\,L^{-1}}$ after 30 minutes. The rate of formation of $\\mathrm{NO_2}$ is $x \\times 10^{-3}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$, value of x is $\\_\\_\\_\\_$.`,
{ integer_value: 17 },
`Rate of disappearance of $\\mathrm{N_2O_5}$:
$$-\\frac{\\Delta[\\mathrm{N_2O_5}]}{\\Delta t} = \\frac{3 - 2.75}{30} = \\frac{0.25}{30} = 8.33 \\times 10^{-3}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$$

From stoichiometry: rate of formation of $\\mathrm{NO_2}$ = $2 \\times$ rate of disappearance of $\\mathrm{N_2O_5}$:
$$\\frac{d[\\mathrm{NO_2}]}{dt} = 2 \\times 8.33 \\times 10^{-3} = 16.67 \\times 10^{-3} \\approx 17 \\times 10^{-3}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$$

**Answer: x = 17**`,
'tag_kinetics_5', src(2024, 'Jan', 30, 'Evening')),

// Q36 — Time for 90% decomposition in first order; Answer: 399
mkNVT('CK-036', 'Medium',
`$r = k[\\mathrm{A}]$ for a reaction, 50% of A is decomposed in 120 minutes. The time taken for 90% decomposition of A is $\\_\\_\\_\\_$ minutes.`,
{ integer_value: 399 },
`First order reaction: $t_{1/2} = 120\\,\\mathrm{min}$

$$k = \\frac{\\ln 2}{120} = \\frac{0.693}{120}\\,\\mathrm{min^{-1}}$$

For 90% decomposition, 10% remains:
$$t = \\frac{\\ln(1/0.1)}{k} = \\frac{\\ln 10}{k} = \\frac{2.303}{0.693/120} = \\frac{2.303 \\times 120}{0.693} = \\frac{276.36}{0.693} = 398.8 \\approx 399\\,\\mathrm{min}$$

**Answer: 399 min**`,
'tag_kinetics_8', src(2024, 'Jan', 31, 'Evening')),

// Q37 — Correct option for reaction profile (intermediates, complexes, RDS); Answer: (3)
mkSCQ('CK-037', 'Hard',
`Consider the following reaction that goes from A to B in three steps as shown below:

![Reaction profile diagram](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-05.jpg?height=284&width=616&top_left_y=203&top_left_x=214)

Choose the correct option:

| | Number of Intermediates | Number of Activated Complexes | Rate determining step |
|:---:|:---:|:---:|:---:|
| (1) | 2 | 3 | — |
| (2) | 2 | 3 | I |
| (3) | 2 | 3 | III |
| (4) | 3 | 2 | II |`,
['Option (1)', 'Option (2)', 'Option (3)', 'Option (4)'],
'c',
`From a 3-step reaction profile:
- **Number of intermediates** = number of energy minima between reactants and products = **2** (one between steps 1-2 and one between steps 2-3)
- **Number of activated complexes** (transition states) = number of energy maxima = **3** (one per step)
- **Rate determining step** = the step with the **highest activation energy** (highest energy barrier). In the given profile, step III has the highest energy barrier.

**Answer: Option (3) — 2 intermediates, 3 activated complexes, RDS = Step III**`,
'tag_kinetics_6', src(2023, 'Apr', 6, 'Evening')),

// Q38 — Rate of reaction from stoichiometry; Answer: 1
mkNVT('CK-038', 'Medium',
`For a given chemical reaction $\\gamma_1\\mathrm{A} + \\gamma_2\\mathrm{B} \\rightarrow \\gamma_3\\mathrm{C} + \\gamma_4\\mathrm{D}$. Concentration of C changes from $10\\,\\mathrm{mmol\\,dm^{-3}}$ to $20\\,\\mathrm{mmol\\,dm^{-3}}$ in 10 s. Rate of appearance of D is 1.5 times the rate of disappearance of B which is twice the rate of disappearance of A. The rate of appearance of D has been experimentally determined to be $9\\,\\mathrm{mmol\\,dm^{-3}\\,s^{-1}}$. Therefore the rate of reaction is $\\_\\_\\_\\_\\,\\mathrm{mmol\\,dm^{-3}\\,s^{-1}}$. (Nearest Integer)`,
{ integer_value: 1 },
`Rate of appearance of C: $\\frac{d[\\mathrm{C}]}{dt} = \\frac{20-10}{10} = 1\\,\\mathrm{mmol\\,dm^{-3}\\,s^{-1}}$

Given: $\\frac{d[\\mathrm{D}]}{dt} = 9\\,\\mathrm{mmol\\,dm^{-3}\\,s^{-1}}$ (experimentally)

From stoichiometry relations given:
- $\\frac{d[\\mathrm{D}]}{dt} = 1.5 \\times \\frac{-d[\\mathrm{B}]}{dt}$ so $\\frac{-d[\\mathrm{B}]}{dt} = 6$
- $\\frac{-d[\\mathrm{B}]}{dt} = 2 \\times \\frac{-d[\\mathrm{A}]}{dt}$ so $\\frac{-d[\\mathrm{A}]}{dt} = 3$

Rate of reaction $= \\frac{1}{\\gamma_3}\\frac{d[\\mathrm{C}]}{dt} = \\frac{1}{\\gamma_3} \\times 1$

From stoichiometry: $\\frac{\\gamma_4}{\\gamma_3} = \\frac{d[\\mathrm{D}]/dt}{d[\\mathrm{C}]/dt} = \\frac{9}{1} = 9$

Rate of reaction $= \\frac{1}{\\gamma_3}\\frac{d[\\mathrm{C}]}{dt}$. Since $\\gamma_3 = 1$ (from the rate of change of C = 1 mmol/dm³/s and rate = 1):

**Answer: 1 mmol dm⁻³ s⁻¹**`,
'tag_kinetics_5', src(2022, 'Jun', 25, 'Morning')),

// Q39 — Rate of formation of NO2 from N2O5; Answer: (1)
mkSCQ('CK-039', 'Easy',
`$\\mathrm{NO_2}$ required for a reaction is produced by the decomposition of $\\mathrm{N_2O_5}$ in $\\mathrm{CCl_4}$ as per the equation:
$$\\mathrm{2N_2O_5(g) \\rightarrow 4NO_2(g) + O_2(g)}$$

The initial concentration of $\\mathrm{N_2O_5}$ is $3.00\\,\\mathrm{mol\\,L^{-1}}$ and it is $2.75\\,\\mathrm{mol\\,L^{-1}}$ after 30 minutes. The rate of formation of $\\mathrm{NO_2}$ is:`,
[
  '$1.667 \\times 10^{-2}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$',
  '$8.333 \\times 10^{-3}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$',
  '$4.167 \\times 10^{-3}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$',
  '$2.083 \\times 10^{-3}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$'
],
'a',
`Rate of disappearance of $\\mathrm{N_2O_5}$:
$$-\\frac{\\Delta[\\mathrm{N_2O_5}]}{\\Delta t} = \\frac{3.00 - 2.75}{30} = \\frac{0.25}{30} = 8.33 \\times 10^{-3}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$$

From stoichiometry ($4\\,\\mathrm{NO_2}$ for every $2\\,\\mathrm{N_2O_5}$):
$$\\frac{d[\\mathrm{NO_2}]}{dt} = 2 \\times 8.33 \\times 10^{-3} = 1.667 \\times 10^{-2}\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$$

**Answer: Option (1)**`,
'tag_kinetics_5', src(2019, 'Apr', 12, 'Evening')),

// Q40 — Time for A to become 0.1 M in pseudo-first order; Answer: 50
mkNVT('CK-040', 'Hard',
`Consider the following reaction, the rate expression of which is given below:
$$\\mathrm{A + B \\rightarrow C}$$
$$\\text{rate} = k[\\mathrm{A}]^{1/2}[\\mathrm{B}]^{1/2}$$

The reaction is initiated by taking 1 M concentration of A and B each. If the rate constant ($k$) is $4.6 \\times 10^{-2}\\,\\mathrm{s^{-1}}$, then the time taken for A to become 0.1 M is $\\_\\_\\_\\_$ sec. (nearest integer)`,
{ integer_value: 50 },
`Since $[\\mathrm{A}]_0 = [\\mathrm{B}]_0 = 1\\,\\mathrm{M}$ and they react in 1:1 ratio, $[\\mathrm{A}] = [\\mathrm{B}]$ at all times.

$$\\text{rate} = k[\\mathrm{A}]^{1/2}[\\mathrm{B}]^{1/2} = k[\\mathrm{A}]^{1/2}[\\mathrm{A}]^{1/2} = k[\\mathrm{A}]$$

This is effectively a **first order** reaction with $k = 4.6 \\times 10^{-2}\\,\\mathrm{s^{-1}}$.

$$t = \\frac{\\ln([\\mathrm{A}]_0/[\\mathrm{A}])}{k} = \\frac{\\ln(1/0.1)}{4.6 \\times 10^{-2}} = \\frac{\\ln 10}{4.6 \\times 10^{-2}} = \\frac{2.303}{4.6 \\times 10^{-2}} = \\frac{2.303}{0.046} = 50.07 \\approx 50\\,\\mathrm{s}$$

**Answer: 50 s**`,
'tag_kinetics_8', src(2024, 'Apr', 4, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-031 to CK-040)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
