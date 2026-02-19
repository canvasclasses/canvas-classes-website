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

// Q61 — Time for [A] = [B] in radioactive decay mixture; Answer: 15
mkNVT('CK-061', 'Hard',
`A and B are two substances undergoing radioactive decay in a container. The half life of A is 15 min and that of B is 5 min. If the initial concentration of B is 4 times that of A and they both start decaying at the same time, how much time will it take for the concentration of both of them to be same? $\\_\\_\\_\\_$ min.`,
{ integer_value: 15 },
`Let initial $[\\mathrm{A}]_0 = C$, $[\\mathrm{B}]_0 = 4C$.

At time $t$:
$$[\\mathrm{A}] = C \\cdot 2^{-t/15},\\quad [\\mathrm{B}] = 4C \\cdot 2^{-t/5}$$

Setting $[\\mathrm{A}] = [\\mathrm{B}]$:
$$C \\cdot 2^{-t/15} = 4C \\cdot 2^{-t/5}$$
$$2^{-t/15} = 4 \\cdot 2^{-t/5} = 2^2 \\cdot 2^{-t/5}$$
$$-\\frac{t}{15} = 2 - \\frac{t}{5}$$
$$-\\frac{t}{15} + \\frac{t}{5} = 2$$
$$t\\left(\\frac{1}{5} - \\frac{1}{15}\\right) = 2$$
$$t \\times \\frac{2}{15} = 2 \\Rightarrow t = 15\\,\\mathrm{min}$$

**Answer: 15 min**`,
'tag_kinetics_3', src(2023, 'Feb', 1, 'Morning')),

// Q62 — Ratio [A]0/[A] at t=2 min for first order; Answer: 100
mkNVT('CK-062', 'Medium',
`For the given first order reaction $\\mathrm{A \\rightarrow B}$ the half life of the reaction is 0.3010 min. The ratio of the initial concentration of reactant to the concentration of reactant at time 2.0 min will be equal to $\\_\\_\\_\\_$. (Nearest integer)`,
{ integer_value: 100 },
`$t_{1/2} = 0.3010\\,\\mathrm{min}$

$$k = \\frac{\\ln 2}{t_{1/2}} = \\frac{0.693}{0.3010} = 2.303\\,\\mathrm{min^{-1}}$$

$$\\frac{[\\mathrm{A}]_0}{[\\mathrm{A}]} = e^{kt} = e^{2.303 \\times 2} = e^{4.606}$$

Using $e^{4.606} = 10^{4.606/2.303} = 10^2 = 100$

**Answer: 100**`,
'tag_kinetics_8', src(2022, 'Jul', 28, 'Morning')),

// Q63 — x such that t67% = x × 10^-1 × t1/2; Answer: 16
mkNVT('CK-063', 'Medium',
`For a first order reaction $\\mathrm{A \\rightarrow B}$, the rate constant $k = 5.5 \\times 10^{-14}\\,\\mathrm{s^{-1}}$. The time required for 67% completion of reaction is $x \\times 10^{-1}$ times the half life of reaction. The value of x is $\\_\\_\\_\\_$ (Nearest integer)

(Given: $\\log 3 = 0.4771$)`,
{ integer_value: 16 },
`For 67% completion, 33% remains:
$$t_{67\\%} = \\frac{\\ln(1/0.33)}{k} = \\frac{\\ln 3}{k}$$

$$t_{1/2} = \\frac{\\ln 2}{k}$$

$$\\frac{t_{67\\%}}{t_{1/2}} = \\frac{\\ln 3}{\\ln 2} = \\frac{2.303 \\times 0.4771}{2.303 \\times 0.3010} = \\frac{0.4771}{0.3010} = 1.585$$

$$= 15.85 \\times 10^{-1} \\approx 16 \\times 10^{-1}$$

**Answer: x = 16**`,
'tag_kinetics_8', src(2022, 'Jun', 28, 'Morning')),

// Q64 — Ratio t75%/t50% for first order; Answer: 2
mkNVT('CK-064', 'Easy',
`For a first order reaction, the ratio of the time for 75% completion of a reaction to the time for 50% completion is $\\_\\_\\_\\_$. (Integer answer)`,
{ integer_value: 2 },
`$$t_{75\\%} = 2 \\times t_{1/2}\\quad (\\text{since } 25\\% = (1/2)^2 \\text{ remains})$$

$$t_{50\\%} = t_{1/2}$$

$$\\frac{t_{75\\%}}{t_{50\\%}} = \\frac{2t_{1/2}}{t_{1/2}} = 2$$

**Answer: 2**`,
'tag_kinetics_8', src(2021, 'Aug', 31, 'Morning')),

// Q65 — Rate constant for viral inactivation; Answer: 106
mkNVT('CK-065', 'Medium',
`The inactivation rate of a viral preparation is proportional to the amount of virus. In the first minute after preparation, 10% of the virus is inactivated. The rate constant for viral inactivation is $\\_\\_\\_\\_ \\times 10^{-3}\\,\\mathrm{min^{-1}}$. (Nearest integer)

[Use: $\\ln 10 = 2.303$; $\\log_{10} 3 = 0.477$; property of logarithm: $\\log x^y = y\\log x$]`,
{ integer_value: 106 },
`Rate proportional to amount → **first order** kinetics.

10% inactivated in 1 min → 90% remains:
$$k = \\frac{\\ln(1/0.9)}{1} = \\ln\\frac{10}{9} = \\ln 10 - \\ln 9 = 2.303 - 2\\ln 3$$

$$\\ln 3 = 2.303 \\times \\log 3 = 2.303 \\times 0.477 = 1.0985$$

$$k = 2.303 - 2 \\times 1.0985 = 2.303 - 2.197 = 0.106\\,\\mathrm{min^{-1}} = 106 \\times 10^{-3}\\,\\mathrm{min^{-1}}$$

**Answer: 106**`,
'tag_kinetics_8', src(2021, 'Jul', 20, 'Morning')),

// Q66 — Rate constant for PCl5 decomposition; Answer: 1
mkNVT('CK-066', 'Medium',
`$$\\mathrm{PCl_5(g) \\rightarrow PCl_3(g) + Cl_2(g)}$$

In the above first order reaction the concentration of $\\mathrm{PCl_5}$ reduces from initial concentration $50\\,\\mathrm{mol\\,L^{-1}}$ to $10\\,\\mathrm{mol\\,L^{-1}}$ in 120 minutes at 300 K. The rate constant for the reaction at 300 K is $x \\times 10^{-2}\\,\\mathrm{min^{-1}}$. The value of $x$ is $\\_\\_\\_\\_$.

[Given $\\log 5 = 0.6989$]`,
{ integer_value: 1 },
`$$k = \\frac{2.303}{t}\\log\\frac{[\\mathrm{PCl_5}]_0}{[\\mathrm{PCl_5}]} = \\frac{2.303}{120}\\log\\frac{50}{10} = \\frac{2.303}{120}\\log 5$$

$$= \\frac{2.303 \\times 0.6989}{120} = \\frac{1.6096}{120} = 0.01341\\,\\mathrm{min^{-1}} \\approx 1.341 \\times 10^{-2}\\,\\mathrm{min^{-1}}$$

Nearest integer: $x = 1$

**Answer: x = 1**`,
'tag_kinetics_8', src(2021, 'Jul', 20, 'Evening')),

// Q67 — Isotope of hydrogen with t1/2 > 12 years; Answer: (2) Tritium
mkSCQ('CK-067', 'Easy',
`Isotope(s) of hydrogen which emits low energy $\\beta^-$ particles with $t_{1/2}$ value $> 12$ years is/are`,
['Protium', 'Tritium', 'Deuterium', 'Deuterium and Tritium'],
'b',
`- **Protium** ($^{1}\\mathrm{H}$): stable, no radioactive decay.
- **Deuterium** ($^{2}\\mathrm{H}$): stable, no radioactive decay.
- **Tritium** ($^{3}\\mathrm{H}$): radioactive, emits low energy $\\beta^-$ particles with $t_{1/2} = 12.32$ years $> 12$ years. ✓

**Answer: Option (2) — Tritium**`,
'tag_kinetics_3', src(2021, 'Jul', 22, 'Morning')),

// Q68 — Rate constant for N2O5 decomposition at 318K; Answer: 7
mkNVT('CK-068', 'Medium',
`$$\\mathrm{N_2O_{5(g)} \\rightarrow 2NO_{2(g)} + \\frac{1}{2}O_{2(g)}}$$

In the above first order reaction the initial concentration of $\\mathrm{N_2O_5}$ is $2.40 \\times 10^{-2}\\,\\mathrm{mol\\,L^{-1}}$ at 318 K. The concentration of $\\mathrm{N_2O_5}$ after 1 hour was $1.60 \\times 10^{-2}\\,\\mathrm{mol\\,L^{-1}}$. The rate constant of the reaction at 318 K is $\\_\\_\\_\\_ \\times 10^{-3}\\,\\mathrm{min^{-1}}$ (Nearest integer):

[Given: $\\log 3 = 0.477$, $\\log 5 = 0.699$]`,
{ integer_value: 7 },
`$$k = \\frac{2.303}{60\\,\\mathrm{min}}\\log\\frac{2.40 \\times 10^{-2}}{1.60 \\times 10^{-2}} = \\frac{2.303}{60}\\log\\frac{3}{2}$$

$$\\log\\frac{3}{2} = \\log 3 - \\log 2 = 0.477 - 0.301 = 0.176$$

$$k = \\frac{2.303 \\times 0.176}{60} = \\frac{0.4053}{60} = 6.755 \\times 10^{-3}\\,\\mathrm{min^{-1}} \\approx 7 \\times 10^{-3}\\,\\mathrm{min^{-1}}$$

**Answer: 7**`,
'tag_kinetics_8', src(2021, 'Jul', 22, 'Morning')),

// Q69 — log10(1/f) for sucrose hydrolysis after 9h; Answer: 81
mkNVT('CK-069', 'Hard',
`Sucrose hydrolyses in acid solution into glucose and fructose following first order rate law with a half-life of 3.33 h at $25°\\mathrm{C}$. After 9 h, the fraction of sucrose remaining is $f$. The value of $\\log_{10}\\left(\\dfrac{1}{f}\\right)$ is $\\_\\_\\_\\_ \\times 10^{-2}$.

(Rounded off to the nearest integer)

[Assume: $\\ln 10 = 2.303$, $\\ln 2 = 0.693$]`,
{ integer_value: 81 },
`$$k = \\frac{\\ln 2}{t_{1/2}} = \\frac{0.693}{3.33}\\,\\mathrm{h^{-1}} = 0.2081\\,\\mathrm{h^{-1}}$$

After 9 h:
$$\\ln\\frac{1}{f} = kt = 0.2081 \\times 9 = 1.873$$

$$\\log_{10}\\frac{1}{f} = \\frac{1.873}{2.303} = 0.813$$

$$= 81.3 \\times 10^{-2} \\approx 81 \\times 10^{-2}$$

**Answer: 81**`,
'tag_kinetics_8', src(2021, 'Feb', 24, 'Evening')),

// Q70 — Correct statement about reaction orders; Answer: (2)
mkSCQ('CK-070', 'Medium',
`It is true that:`,
[
  'A second order reaction is always a multistep reaction',
  'A zero order reaction is a multi-step reaction',
  'A first order reaction is always a single step reaction',
  'A zero order reaction is a single step reaction'
],
'b',
`**Analysis of each statement:**

**(1) FALSE** — A second order reaction can be elementary (single step), e.g., $\\mathrm{2HI \\rightarrow H_2 + I_2}$.

**(2) TRUE** — A zero order reaction cannot be an elementary reaction (elementary reactions must have order equal to molecularity, which is at least 1). Therefore, a zero order reaction must be a multi-step (complex) reaction where the rate-determining step involves a catalyst or surface.

**(3) FALSE** — A first order reaction can be multi-step (e.g., radioactive decay is first order and elementary, but many first order reactions are complex).

**(4) FALSE** — Same reasoning as (2); zero order reactions are multi-step.

**Answer: Option (2)**`,
'tag_kinetics_4', src(2020, 'Sep', 3, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (CK-061 to CK-070)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
