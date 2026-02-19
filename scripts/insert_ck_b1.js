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

// Q1 — Rate of production of Fe2(SO4)3; Answer: 333
mkNVT('CK-001', 'Medium',
`$$\\mathrm{KClO_3 + 6\\,FeSO_4 + 3\\,H_2SO_4 \\rightarrow KCl + 3\\,Fe_2(SO_4)_3 + 3\\,H_2O}$$

The above reaction was studied at 300 K by monitoring the concentration of $\\mathrm{FeSO_4}$ in which initial concentration was 10 M and after half an hour became 8.8 M. The rate of production of $\\mathrm{Fe_2(SO_4)_3}$ is $\\_\\_\\_\\_ \\times 10^{-6}\\,\\mathrm{mol\\,L^{-1}\\,s^{-1}}$ (Nearest integer)`,
{ integer_value: 333 },
`**Step 1 — Rate of disappearance of $\\mathrm{FeSO_4}$:**
$$-\\frac{\\Delta[\\mathrm{FeSO_4}]}{\\Delta t} = \\frac{10 - 8.8}{30 \\times 60} = \\frac{1.2}{1800} = 6.67 \\times 10^{-4}\\,\\mathrm{mol\\,L^{-1}\\,s^{-1}}$$

**Step 2 — Rate of production of $\\mathrm{Fe_2(SO_4)_3}$:**

From stoichiometry: 6 mol $\\mathrm{FeSO_4}$ produces 3 mol $\\mathrm{Fe_2(SO_4)_3}$

$$\\frac{d[\\mathrm{Fe_2(SO_4)_3}]}{dt} = \\frac{1}{2} \\times \\frac{d[\\mathrm{FeSO_4}]}{dt} = \\frac{6.67 \\times 10^{-4}}{2} = 3.33 \\times 10^{-4}\\,\\mathrm{mol\\,L^{-1}\\,s^{-1}}$$

$$= 333 \\times 10^{-6}\\,\\mathrm{mol\\,L^{-1}\\,s^{-1}}$$

**Answer: 333**`,
'tag_kinetics_5', src(2023, 'Apr', 11, 'Morning')),

// Q2 — Rate of disappearance of C2H6O; Answer: 4
mkNVT('CK-002', 'Easy',
`The reaction that occurs in a breath analyser, a device used to determine the alcohol level in a person's blood stream is:
$$\\mathrm{2K_2Cr_2O_7 + 8H_2SO_4 + 3C_2H_6O \\rightarrow 2Cr_2(SO_4)_3 + 3C_2H_4O_2 + 2K_2SO_4 + 11H_2O}$$

If the rate of appearance of $\\mathrm{Cr_2(SO_4)_3}$ is $2.67\\,\\mathrm{mol\\,min^{-1}}$ at a particular time, the rate of disappearance of $\\mathrm{C_2H_6O}$ at the same time is $\\_\\_\\_\\_\\,\\mathrm{mol\\,min^{-1}}$. (Nearest integer)`,
{ integer_value: 4 },
`From stoichiometry: 2 mol $\\mathrm{Cr_2(SO_4)_3}$ is produced for every 3 mol $\\mathrm{C_2H_6O}$ consumed.

$$\\frac{d[\\mathrm{C_2H_6O}]}{dt} = \\frac{3}{2} \\times \\frac{d[\\mathrm{Cr_2(SO_4)_3}]}{dt} = \\frac{3}{2} \\times 2.67 = 4.005 \\approx 4\\,\\mathrm{mol\\,min^{-1}}$$

**Answer: 4**`,
'tag_kinetics_5', src(2021, 'Aug', 27, 'Morning')),

// Q3 — Average rate of reaction A→B; Answer: 4
mkNVT('CK-003', 'Easy',
`For a chemical reaction $\\mathrm{A \\rightarrow B}$, it was found that concentration of B is increased by $0.2\\,\\mathrm{mol\\,L^{-1}}$ in 30 min. The average rate of the reaction is $\\_\\_\\_\\_ \\times 10^{-1}\\,\\mathrm{mol\\,L^{-1}\\,h^{-1}}$. (in nearest integer)`,
{ integer_value: 4 },
`$$\\text{Average rate} = \\frac{\\Delta[\\mathrm{B}]}{\\Delta t} = \\frac{0.2\\,\\mathrm{mol\\,L^{-1}}}{30\\,\\mathrm{min}} = \\frac{0.2}{0.5\\,\\mathrm{h}} = 0.4\\,\\mathrm{mol\\,L^{-1}\\,h^{-1}} = 4 \\times 10^{-1}\\,\\mathrm{mol\\,L^{-1}\\,h^{-1}}$$

**Answer: 4**`,
'tag_kinetics_5', src(2021, 'Jul', 25, 'Evening')),

// Q4 — X and Y in kinetics table; Answer: (3) 0.3, 0.4
mkSCQ('CK-004', 'Medium',
`The results given in the below table were obtained during kinetic studies of the following reaction:
$$\\mathrm{2A + B \\rightarrow C + D}$$

| Experiment | $[\\mathrm{A}]\\,/\\,\\mathrm{mol\\,L^{-1}}$ | $[\\mathrm{B}]\\,/\\,\\mathrm{mol\\,L^{-1}}$ | Initial rate $\\mathrm{mol\\,L^{-1}\\,min^{-1}}$ |
|:---:|:---:|:---:|:---:|
| I | 0.1 | 0.1 | $6.00 \\times 10^{-3}$ |
| II | 0.1 | 0.2 | $2.40 \\times 10^{-2}$ |
| III | 0.2 | 0.1 | $1.20 \\times 10^{-2}$ |
| IV | X | 0.2 | $7.20 \\times 10^{-2}$ |
| V | 0.3 | Y | $2.88 \\times 10^{-1}$ |

X and Y in the given table are respectively:`,
['$0.4,\\,0.4$', '$0.4,\\,0.3$', '$0.3,\\,0.4$', '$0.3,\\,0.3$'],
'c',
`**Step 1 — Determine orders:**

From Exp I & II (A constant): Rate doubles when B doubles → order w.r.t. B = 2 (rate quadruples: $2.40/0.6 = 4$, so $n_B = 2$)

From Exp I & III (B constant): Rate doubles when A doubles → order w.r.t. A = 1

Rate law: $r = k[\\mathrm{A}][\\mathrm{B}]^2$

From Exp I: $k = \\frac{6.00 \\times 10^{-3}}{0.1 \\times (0.1)^2} = 6.00\\,\\mathrm{L^2\\,mol^{-2}\\,min^{-1}}$

**Step 2 — Find X (Exp IV):**
$$7.20 \\times 10^{-2} = 6.00 \\times X \\times (0.2)^2 = 6.00 \\times X \\times 0.04$$
$$X = \\frac{7.20 \\times 10^{-2}}{0.24} = 0.3$$

**Step 3 — Find Y (Exp V):**
$$2.88 \\times 10^{-1} = 6.00 \\times 0.3 \\times Y^2$$
$$Y^2 = \\frac{0.288}{1.8} = 0.16 \\Rightarrow Y = 0.4$$

**Answer: Option (3) — 0.3, 0.4**`,
'tag_kinetics_4', src(2020, 'Sep', 2, 'Evening')),

// Q5 — Correct statement for 2A + 3B + 3/2 C → 3P; Answer: (3)
mkSCQ('CK-005', 'Medium',
`For the reaction $2\\mathrm{A} + 3\\mathrm{B} + \\dfrac{3}{2}\\mathrm{C} \\rightarrow 3\\mathrm{P}$, which statement is correct?`,
[
  '$\\dfrac{dn_A}{dt} = \\dfrac{3}{2}\\dfrac{dn_B}{dt} = \\dfrac{3}{4}\\dfrac{dn_C}{dt}$',
  '$\\dfrac{dn_A}{dt} = \\dfrac{dn_B}{dt} = \\dfrac{dn_C}{dt}$',
  '$\\dfrac{dn_A}{dt} = \\dfrac{2}{3}\\dfrac{dn_B}{dt} = \\dfrac{4}{3}\\dfrac{dn_C}{dt}$',
  '$\\dfrac{dn_A}{dt} = \\dfrac{2}{3}\\dfrac{dn_B}{dt} = \\dfrac{3}{4}\\dfrac{dn_C}{dt}$'
],
'c',
`The rate of reaction is defined as:
$$r = -\\frac{1}{2}\\frac{dn_A}{dt} = -\\frac{1}{3}\\frac{dn_B}{dt} = -\\frac{1}{3/2}\\frac{dn_C}{dt} = \\frac{1}{3}\\frac{dn_P}{dt}$$

So: $\\frac{dn_A}{dt} = \\frac{2}{3}\\frac{dn_B}{dt}$ and $\\frac{dn_A}{dt} = \\frac{2}{3/2}\\frac{dn_C}{dt} = \\frac{4}{3}\\frac{dn_C}{dt}$

**Answer: Option (3)**`,
'tag_kinetics_5', src(2020, 'Sep', 3, 'Evening')),

// Q6 — Graph for equilibrium A⇌B rate vs time; Answer: (2)
mkSCQ('CK-006', 'Easy',
`For the equilibrium $\\mathrm{A \\rightleftharpoons B}$, the variation of the rate of the forward (a) and reverse (b) reaction with time is given by:

![Option 1](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=181&width=319&top_left_y=1690&top_left_x=255)
![Option 2](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=188&width=320&top_left_y=1690&top_left_x=635)
![Option 3](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=181&width=328&top_left_y=1690&top_left_x=1000)
![Option 4](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=170&width=328&top_left_y=1690&top_left_x=1377)`,
['Option 1', 'Option 2', 'Option 3', 'Option 4'],
'b',
`At the start of the reaction, the forward rate is maximum (high [A]) and the reverse rate is zero (no B present). As the reaction proceeds, [A] decreases so the forward rate decreases, while [B] increases so the reverse rate increases. At equilibrium, both rates become equal and constant.

The correct graph shows the forward rate (a) starting high and decreasing, the reverse rate (b) starting at zero and increasing, and both meeting at a constant value at equilibrium.

**Answer: Option (2)**`,
'tag_kinetics_5', src(2020, 'Sep', 4, 'Morning')),

// Q7 — Graph for SN1 reaction (C6H5)3CCl; Answer: (2)
mkSCQ('CK-007', 'Medium',
`The graph which represents the following reaction is:
$$\\mathrm{(C_6H_5)_3C{-}Cl} \\xrightarrow{\\mathrm{OH^-/Pyridine}} \\mathrm{(C_6H_5)_3C{-}OH}$$

![Option 1](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=287&width=314&top_left_y=2069&top_left_x=251)
![Option 2](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=296&width=314&top_left_y=2069&top_left_x=635)
![Option 3](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=302&width=318&top_left_y=2067&top_left_x=1005)
![Option 4](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-01.jpg?height=296&width=310&top_left_y=2069&top_left_x=1379)`,
['Option 1', 'Option 2', 'Option 3', 'Option 4'],
'b',
`$\\mathrm{(C_6H_5)_3CCl}$ undergoes **SN1 reaction** (unimolecular nucleophilic substitution) because the triphenylmethyl carbocation is highly stabilised by resonance.

In SN1: Rate = $k[\\mathrm{(C_6H_5)_3CCl}]$ — **first order**, depends only on the substrate, not on $\\mathrm{OH^-}$.

The graph showing rate vs $[\\mathrm{OH^-}]$ should be a **horizontal line** (rate independent of $[\\mathrm{OH^-}]$), while rate vs $[\\mathrm{substrate}]$ should be a straight line through origin.

**Answer: Option (2)**`,
'tag_kinetics_4', src(2020, 'Sep', 4, 'Evening')),

// Q8 — Half life of azomethane decomposition; Answer: 2
mkNVT('CK-008', 'Hard',
`For the decomposition of azomethane:
$$\\mathrm{CH_3N_2CH_3(g) \\rightarrow CH_3CH_3(g) + N_2}$$
a first order reaction, the variation in partial pressure with time at 600 K is given as:

![Graph of partial pressure vs time](https://cdn.mathpix.com/cropped/1b8377bd-0c65-4d83-83dd-5cda20a0f3e5-02.jpg?height=276&width=416&top_left_y=248&top_left_x=201)

The half life of the reaction is $\\_\\_\\_\\_ \\times 10^{-5}\\,\\mathrm{s}$`,
{ integer_value: 2 },
`From the graph, the partial pressure of azomethane decreases from its initial value. For a first order reaction:

$$t_{1/2} = \\frac{\\ln 2}{k}$$

Reading from the graph: the pressure drops to half its initial value at $t = 2 \\times 10^{-5}\\,\\mathrm{s}$.

**Answer: 2**`,
'tag_kinetics_8', src(2022, 'Jul', 25, 'Evening')),

// Q9 — Ratio M/L from kinetics table; Answer: 40
mkNVT('CK-009', 'Medium',
`The reaction between X and Y is first order with respect to X and zero order with respect to Y.

| Experiment | $[\\mathrm{X}]\\,/\\,\\mathrm{mol\\,L^{-1}}$ | $[\\mathrm{Y}]\\,/\\,\\mathrm{mol\\,L^{-1}}$ | Initial rate $\\,/\\,\\mathrm{mol\\,L^{-1}\\,min^{-1}}$ |
|:---:|:---:|:---:|:---:|
| I | 0.1 | 0.1 | $2 \\times 10^{-3}$ |
| II | L | 0.2 | $4 \\times 10^{-3}$ |
| III | 0.4 | 0.4 | $M \\times 10^{-3}$ |
| IV | 0.1 | 0.2 | $2 \\times 10^{-3}$ |

Examine the data of table and calculate ratio of numerical values of M and L.`,
{ integer_value: 40 },
`**Rate law:** $r = k[\\mathrm{X}]^1[\\mathrm{Y}]^0 = k[\\mathrm{X}]$

**From Exp I:** $k = \\frac{2 \\times 10^{-3}}{0.1} = 2 \\times 10^{-2}\\,\\mathrm{min^{-1}}$

**Find L (Exp II):**
$$4 \\times 10^{-3} = 2 \\times 10^{-2} \\times L \\Rightarrow L = 0.2$$

**Find M (Exp III):**
$$M \\times 10^{-3} = 2 \\times 10^{-2} \\times 0.4 = 8 \\times 10^{-3} \\Rightarrow M = 8$$

**Ratio M/L:**
$$\\frac{M}{L} = \\frac{8}{0.2} = 40$$

**Answer: 40**`,
'tag_kinetics_4', src(2020, 'Sep', 2, 'Morning')),

// Q10 — Unit of rate constant for nth order; Answer: (3)
mkSCQ('CK-010', 'Easy',
`For a reaction of order $n$, the unit of the rate constant is:`,
[
  '$\\mathrm{mol^{1-n}\\,L^{1-n}\\,s}$',
  '$\\mathrm{mol^{1-n}\\,L^{2n}\\,s^{-1}}$',
  '$\\mathrm{mol^{1-n}\\,L^{n-1}\\,s^{-1}}$',
  '$\\mathrm{mol^{1-n}\\,L^{1-n}\\,s^{-1}}$'
],
'c',
`For an $n$th order reaction: $\\text{rate} = k[\\mathrm{A}]^n$

$$[k] = \\frac{\\text{rate}}{[\\mathrm{A}]^n} = \\frac{\\mathrm{mol\\,L^{-1}\\,s^{-1}}}{(\\mathrm{mol\\,L^{-1}})^n} = \\frac{\\mathrm{mol\\,L^{-1}\\,s^{-1}}}{\\mathrm{mol^n\\,L^{-n}}}$$

$$= \\mathrm{mol^{1-n}\\,L^{n-1}\\,s^{-1}}$$

**Answer: Option (3)**`,
'tag_kinetics_4', src(2019, 'Jan', 10, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-001 to CK-010)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
