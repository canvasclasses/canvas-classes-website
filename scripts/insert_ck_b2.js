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

// Q11 — Rate increases by factor when volume reduced by 3; Answer: 27
mkNVT('CK-011', 'Medium',
`The reaction $\\mathrm{2A + B_2 \\rightarrow 2AB}$ is an elementary reaction. For a certain quantity of reactants, if the volume of the reaction vessel is reduced by a factor of 3, the rate of the reaction increases by a factor of $\\_\\_\\_\\_$. (Round off to the Nearest Integer)`,
{ integer_value: 27 },
`For an elementary reaction $\\mathrm{2A + B_2 \\rightarrow 2AB}$:
$$r = k[\\mathrm{A}]^2[\\mathrm{B_2}]$$

When volume is reduced by factor 3, all concentrations increase by factor 3:
$$[\\mathrm{A}]' = 3[\\mathrm{A}],\\quad [\\mathrm{B_2}]' = 3[\\mathrm{B_2}]$$

$$r' = k(3[\\mathrm{A}])^2(3[\\mathrm{B_2}]) = 9 \\times 3 \\times k[\\mathrm{A}]^2[\\mathrm{B_2}] = 27r$$

**Answer: 27**`,
'tag_kinetics_4', src(2021, 'Mar', 17, 'Evening')),

// Q12 — Overall order of 2NO + Cl2 reaction; Answer: 3
mkNVT('CK-012', 'Medium',
`$$\\mathrm{2NO(g) + Cl_2(g) \\rightleftharpoons 2NOCl(s)}$$

This reaction was studied at $-10°\\mathrm{C}$ and the following data was obtained:

| Run | $[\\mathrm{NO}]_0$ | $[\\mathrm{Cl_2}]_0$ | $r_0$ |
|:---:|:---:|:---:|:---:|
| 1 | 0.10 | 0.10 | 0.18 |
| 2 | 0.10 | 0.20 | 0.35 |
| 3 | 0.20 | 0.20 | 1.40 |

$[\\mathrm{NO}]_0$ and $[\\mathrm{Cl_2}]_0$ are the initial concentrations and $r_0$ is the initial reaction rate. The overall order of the reaction is $\\_\\_\\_\\_$ (Round off to the Nearest Integer).`,
{ integer_value: 3 },
`**Order w.r.t. $\\mathrm{Cl_2}$** (Runs 1 & 2, [NO] constant):
$$\\frac{r_2}{r_1} = \\frac{0.35}{0.18} \\approx 2 = \\left(\\frac{0.20}{0.10}\\right)^n \\Rightarrow 2 = 2^n \\Rightarrow n = 1$$

**Order w.r.t. NO** (Runs 2 & 3, $[\\mathrm{Cl_2}]$ constant):
$$\\frac{r_3}{r_2} = \\frac{1.40}{0.35} = 4 = \\left(\\frac{0.20}{0.10}\\right)^m \\Rightarrow 4 = 2^m \\Rightarrow m = 2$$

**Overall order** = $m + n = 2 + 1 = 3$

**Answer: 3**`,
'tag_kinetics_4', src(2021, 'Mar', 18, 'Morning')),

// Q13 — Rate expression for reverse reaction; Answer: (4)
mkSCQ('CK-013', 'Hard',
`For the reaction $\\mathrm{2H_2(g) + 2NO(g) \\rightarrow N_2(g) + 2H_2O(g)}$, the observed rate expression is: $\\text{rate} = k_f[\\mathrm{NO}]^2[\\mathrm{H_2}]$. The rate expression for the reverse reaction is:`,
[
  '$k_b[\\mathrm{N_2}][\\mathrm{H_2O}]^2$',
  '$k_b[\\mathrm{N_2}][\\mathrm{H_2O}]^2/[\\mathrm{NO}]$',
  '$k_b[\\mathrm{N_2}][\\mathrm{H_2O}]$',
  '$k_b[\\mathrm{N_2}][\\mathrm{H_2O}]^2/[\\mathrm{H_2}]$'
],
'd',
`At equilibrium: $r_f = r_b$

$$k_f[\\mathrm{NO}]^2[\\mathrm{H_2}] = k_b \\times r_b$$

The equilibrium constant:
$$K_c = \\frac{k_f}{k_b} = \\frac{[\\mathrm{N_2}][\\mathrm{H_2O}]^2}{[\\mathrm{NO}]^2[\\mathrm{H_2}]^2}$$

So: $k_f[\\mathrm{NO}]^2[\\mathrm{H_2}] = k_b \\cdot \\frac{[\\mathrm{N_2}][\\mathrm{H_2O}]^2}{[\\mathrm{H_2}]}$

Therefore: $r_b = k_b\\dfrac{[\\mathrm{N_2}][\\mathrm{H_2O}]^2}{[\\mathrm{H_2}]}$

**Answer: Option (4)**`,
'tag_kinetics_4', src(2020, 'Jan', 7, 'Evening')),

// Q14 — Time to reduce [A] to 1/4 in zero order; Answer: 75
mkNVT('CK-014', 'Easy',
`$\\mathrm{A \\rightarrow B}$

The above reaction is of zero order. Half life of this reaction is 50 min. The time taken for the concentration of A to reduce to one-fourth of its initial value is $\\_\\_\\_\\_$ min. (Nearest integer)`,
{ integer_value: 75 },
`For a zero order reaction: $[\\mathrm{A}] = [\\mathrm{A}]_0 - kt$

Half life: $t_{1/2} = \\frac{[\\mathrm{A}]_0}{2k} = 50\\,\\mathrm{min}$

So $k = \\frac{[\\mathrm{A}]_0}{100}$

Time to reduce to $\\frac{1}{4}[\\mathrm{A}]_0$:
$$\\frac{[\\mathrm{A}]_0}{4} = [\\mathrm{A}]_0 - kt$$
$$kt = [\\mathrm{A}]_0 - \\frac{[\\mathrm{A}]_0}{4} = \\frac{3[\\mathrm{A}]_0}{4}$$
$$t = \\frac{3[\\mathrm{A}]_0}{4k} = \\frac{3}{4} \\times \\frac{[\\mathrm{A}]_0}{k} = \\frac{3}{4} \\times 100 = 75\\,\\mathrm{min}$$

Alternatively: $t = 3 \\times t_{1/2}/2 \\times 2 = 1.5 \\times t_{1/2} = 1.5 \\times 50 = 75$ min

**Answer: 75 min**`,
'tag_kinetics_7', src(2023, 'Feb', 1, 'Evening')),

// Q15 — Rate constant of first order reaction; Answer: 165
mkNVT('CK-015', 'Easy',
`$[\\mathrm{A}] \\rightarrow [\\mathrm{B}]$

If formation of compound [B] follows the first order of kinetics and after 70 minutes the concentration of [A] was found to be half of its initial concentration. Then the rate constant of the reaction is $x \\times 10^{-6}\\,\\mathrm{s^{-1}}$. The value of $x$ is $\\_\\_\\_\\_$`,
{ integer_value: 165 },
`For first order: $t_{1/2} = \\frac{\\ln 2}{k} = 70\\,\\mathrm{min} = 70 \\times 60\\,\\mathrm{s} = 4200\\,\\mathrm{s}$

$$k = \\frac{\\ln 2}{4200} = \\frac{0.693}{4200} = 1.65 \\times 10^{-4}\\,\\mathrm{s^{-1}} = 165 \\times 10^{-6}\\,\\mathrm{s^{-1}}$$

**Answer: x = 165**`,
'tag_kinetics_8', src(2022, 'Jul', 27, 'Evening')),

// Q16 — Amount of radioactive X remaining after 100 years; Answer: 1
mkNVT('CK-016', 'Medium',
`Assuming $1\\,\\mu\\mathrm{g}$ of trace radioactive element X with a half life of 30 years is absorbed by a growing tree. The amount of X remaining in the tree after 100 years is $\\_\\_\\_\\_ \\times 10^{-1}\\,\\mu\\mathrm{g}$.

[Given: $\\ln 10 = 2.303$; $\\log 2 = 0.30$]`,
{ integer_value: 1 },
`$$k = \\frac{\\ln 2}{t_{1/2}} = \\frac{0.693}{30}\\,\\mathrm{year^{-1}}$$

$$\\ln\\frac{[\\mathrm{X}]_0}{[\\mathrm{X}]} = kt = \\frac{0.693}{30} \\times 100 = 2.31$$

$$\\frac{[\\mathrm{X}]_0}{[\\mathrm{X}]} = e^{2.31}$$

Using $\\log$: $\\log\\frac{1}{[\\mathrm{X}]} = \\frac{100}{30} \\times 0.30 = 1.0$

$$[\\mathrm{X}] = 10^{-1}\\,\\mu\\mathrm{g} = 1 \\times 10^{-1}\\,\\mu\\mathrm{g}$$

**Answer: 1**`,
'tag_kinetics_3', src(2022, 'Jul', 29, 'Evening')),

// Q17 — Time for 90% completion = x × t1/2; Answer: (3) 3.32
mkSCQ('CK-017', 'Medium',
`For a first order reaction, the time required for completion of 90% reaction is '$x$' times the half life of the reaction. The value of '$x$' is

(Given: $\\ln 10 = 2.303$ and $\\log 2 = 0.3010$)`,
['1.12', '2.43', '3.32', '33.31'],
'c',
`For first order: $t_{90\\%} = \\frac{2.303}{k}\\log\\frac{100}{10} = \\frac{2.303}{k}$

$t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}$

$$x = \\frac{t_{90\\%}}{t_{1/2}} = \\frac{2.303/k}{0.693/k} = \\frac{2.303}{0.693} = 3.32$$

**Answer: Option (3) — 3.32**`,
'tag_kinetics_8', src(2022, 'Jun', 24, 'Evening')),

// Q18 — % original activity remaining after 83 days; Answer: 75
mkNVT('CK-018', 'Medium',
`A radioactive element has a half life of 200 days. The percentage of original activity remaining after 83 days is $\\_\\_\\_\\_$ (Nearest integer)

(Given: antilog $0.125 = 1.333$, antilog $0.693 = 4.93$)`,
{ integer_value: 75 },
`$$k = \\frac{\\ln 2}{200}\\,\\mathrm{day^{-1}}$$

$$\\log\\frac{N_0}{N} = \\frac{k \\times t}{2.303} = \\frac{0.693}{200 \\times 2.303} \\times 83 = \\frac{0.693 \\times 83}{460.6} = \\frac{57.52}{460.6} = 0.1249 \\approx 0.125$$

$$\\frac{N_0}{N} = \\text{antilog}(0.125) = 1.333$$

$$\\frac{N}{N_0} = \\frac{1}{1.333} = 0.75 = 75\\%$$

**Answer: 75%**`,
'tag_kinetics_3', src(2022, 'Jun', 28, 'Evening')),

// Q19 — Half life of first order reaction A→2B; Answer: 655
mkNVT('CK-019', 'Hard',
`For the first order reaction $\\mathrm{A \\rightarrow 2B}$, 1 mole of reactant A gives 0.2 moles of B after 100 minutes. The half life of the reaction is $\\_\\_\\_\\_$ min. (Round off to the nearest integer).

[Use: $\\ln 2 = 0.69$, $\\ln 10 = 2.3$; Properties of logarithms: $\\ln x^y = y\\ln x$; $\\ln(x/y) = \\ln x - \\ln y$]`,
{ integer_value: 655 },
`$\\mathrm{A \\rightarrow 2B}$: 1 mol A gives 0.2 mol B after 100 min.

Since 1 mol A gives 2 mol B at complete reaction, 0.2 mol B corresponds to 0.1 mol A reacted.

Remaining A = $1 - 0.1 = 0.9$ mol (taking initial as 1 mol).

For first order:
$$k = \\frac{\\ln(N_0/N)}{t} = \\frac{\\ln(1/0.9)}{100} = \\frac{\\ln(10/9)}{100} = \\frac{\\ln 10 - \\ln 9}{100}$$

$$= \\frac{2.3 - 2\\ln 3}{100} = \\frac{2.3 - 2 \\times 1.0986}{100} \\approx \\frac{2.3 - 2.197}{100} = \\frac{0.103}{100} = 1.057 \\times 10^{-3}\\,\\mathrm{min^{-1}}$$

$$t_{1/2} = \\frac{0.69}{k} = \\frac{0.69}{1.057 \\times 10^{-3}} \\approx 655\\,\\mathrm{min}$$

**Answer: 655 min**`,
'tag_kinetics_8', src(2021, 'Jul', 27, 'Evening')),

// Q20 — Rate constant from 32% remaining after 570 s; Answer: 2
mkNVT('CK-020', 'Medium',
`For a certain first order reaction 32% of the reactant is left after 570 s. The rate constant of this reaction is $\\_\\_\\_\\_ \\times 10^{-3}\\,\\mathrm{s^{-1}}$. (Round off to the Nearest Integer).

[Given: $\\log_{10} 2 = 0.301$, $\\ln 10 = 2.303$]`,
{ integer_value: 2 },
`32% remaining means $[\\mathrm{A}]/[\\mathrm{A}]_0 = 0.32$

$$k = \\frac{2.303}{t}\\log\\frac{[\\mathrm{A}]_0}{[\\mathrm{A}]} = \\frac{2.303}{570}\\log\\frac{1}{0.32}$$

$$\\log\\frac{1}{0.32} = \\log\\frac{100}{32} = \\log 100 - \\log 32 = 2 - 5\\log 2 = 2 - 5(0.301) = 2 - 1.505 = 0.495$$

$$k = \\frac{2.303 \\times 0.495}{570} = \\frac{1.140}{570} = 2.0 \\times 10^{-3}\\,\\mathrm{s^{-1}}$$

**Answer: 2**`,
'tag_kinetics_8', src(2021, 'Mar', 17, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-011 to CK-020)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
