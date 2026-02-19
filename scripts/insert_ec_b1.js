const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_electrochem';
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

// Q1 — Silver deposited by 1 coulomb; Answer: (2) 1 electrochemical equivalent
mkSCQ('EC-001', 'Easy',
`The quantity of silver deposited when one coulomb charge is passed through $\\mathrm{AgNO_3}$ solution:`,
[
  '1 g of silver',
  '1 electrochemical equivalent of silver',
  '1 chemical equivalent of silver',
  '0.1 g atom of silver'
],
'b',
`**Faraday's First Law of Electrolysis:** The mass of substance deposited at an electrode is directly proportional to the quantity of electricity passed.

The electrochemical equivalent (ECE) of a substance is defined as the mass deposited by **1 coulomb** of charge.

$$m = Z \\times Q$$

where $Z$ = electrochemical equivalent, $Q$ = charge in coulombs.

When $Q = 1$ coulomb, $m = Z$ = 1 electrochemical equivalent.

**Answer: Option (2) — 1 electrochemical equivalent of silver**`,
'tag_electrochem_5', src(2024, 'Apr', 5, 'Evening')),

// Q2 — Oxidising power order from reduction potentials; Answer: (2) BrO4- > IO4- > ClO4-
mkSCQ('EC-002', 'Easy',
`Reduction potential of ions are given below:

| Ion | $\\mathrm{ClO_4^-}$ | $\\mathrm{IO_4^-}$ | $\\mathrm{BrO_4^-}$ |
|---|---|---|---|
| $E°$ (V) | 1.19 | 1.65 | 1.74 |

The correct order of their oxidising power is:`,
[
  '$\\mathrm{ClO_4^- > IO_4^- > BrO_4^-}$',
  '$\\mathrm{BrO_4^- > IO_4^- > ClO_4^-}$',
  '$\\mathrm{BrO_4^- > ClO_4^- > IO_4^-}$',
  '$\\mathrm{IO_4^- > BrO_4^- > ClO_4^-}$'
],
'b',
`**Key principle:** Higher the standard reduction potential ($E°$), greater the tendency to get reduced → stronger oxidising agent.

| Ion | $E°$ (V) | Oxidising power |
|---|---|---|
| $\\mathrm{BrO_4^-}$ | 1.74 | Highest |
| $\\mathrm{IO_4^-}$ | 1.65 | Medium |
| $\\mathrm{ClO_4^-}$ | 1.19 | Lowest |

$$\\mathrm{BrO_4^- > IO_4^- > ClO_4^-}$$

**Answer: Option (2)**`,
'tag_electrochem_3', src(2024, 'Jan', 30, 'Evening')),

// Q3 — Product NOT obtained in electrolysis of brine; Answer: (2) HCl
mkSCQ('EC-003', 'Easy',
`The product, which is not obtained during the electrolysis of brine solution is`,
[
  '$\\mathrm{H_2}$',
  'HCl',
  'NaOH',
  '$\\mathrm{Cl_2}$'
],
'b',
`**Electrolysis of brine (concentrated NaCl solution):**

- **At cathode:** $2\\mathrm{H_2O} + 2e^- \\rightarrow \\mathrm{H_2} + 2\\mathrm{OH^-}$ → produces $\\mathrm{H_2}$ ✓
- **At anode:** $2\\mathrm{Cl^-} \\rightarrow \\mathrm{Cl_2} + 2e^-$ → produces $\\mathrm{Cl_2}$ ✓
- **In solution:** $\\mathrm{Na^+}$ and $\\mathrm{OH^-}$ remain → forms NaOH ✓

**HCl is NOT produced** — it would require combining $\\mathrm{H_2}$ and $\\mathrm{Cl_2}$ in a separate step, which does not occur during electrolysis of brine.

**Answer: Option (2) — HCl**`,
'tag_electrochem_5', src(2023, 'Apr', 6, 'Evening')),

// Q4 — Galvanic cell for given reaction; Answer: (1) Pt|H2(g)|HCl(soln)|AgCl(s)|Ag
mkSCQ('EC-004', 'Easy',
`The reaction occurs in which of the given galvanic cell?
$$\\frac{1}{2}\\mathrm{H_2(g)} + \\mathrm{AgCl(s)} \\rightleftharpoons \\mathrm{H^+(aq)} + \\mathrm{Cl^-(aq)} + \\mathrm{Ag(s)}$$`,
[
  '$\\mathrm{Pt|H_2(g)|HCl(sol^n)|AgCl(s)|Ag}$',
  '$\\mathrm{Ag|AgCl(s)|KCl(sol^n)|AgNO_3|Ag}$',
  '$\\mathrm{Pt|H_2(g)|HCl(sol^n)|AgNO_3(sol^n)|Ag}$',
  '$\\mathrm{Pt|H_2(g)|KCl(sol^n)|AgCl(s)|Ag}$'
],
'a',
`**Analysing the reaction:**
- **Oxidation (anode):** $\\frac{1}{2}\\mathrm{H_2(g)} \\rightarrow \\mathrm{H^+(aq)} + e^-$ → requires $\\mathrm{H_2}$ gas and $\\mathrm{H^+}$ ions
- **Reduction (cathode):** $\\mathrm{AgCl(s)} + e^- \\rightarrow \\mathrm{Ag(s)} + \\mathrm{Cl^-(aq)}$ → requires AgCl solid

**Cell notation:** Anode | solution | Cathode

The cell must contain:
- Pt electrode with $\\mathrm{H_2}$ gas (anode side)
- HCl solution (provides $\\mathrm{H^+}$ and $\\mathrm{Cl^-}$)
- AgCl(s) and Ag (cathode side)

This matches: $\\mathrm{Pt|H_2(g)|HCl(sol^n)|AgCl(s)|Ag}$

**Answer: Option (1)**`,
'tag_electrochem_4', src(2023, 'Apr', 8, 'Morning')),

// Q5 — Metal ions that liberate H2 from dilute acid; Answer: (3) V2+ and Cr2+
mkSCQ('EC-005', 'Medium',
`The standard electrode potential $(\\mathrm{M^{3+}/M^{2+}})$ for V, Cr, Mn & Co are $-0.26\\ \\mathrm{V},\\ -0.41\\ \\mathrm{V},\\ +1.57\\ \\mathrm{V}$ and $+1.97\\ \\mathrm{V}$, respectively. The metal ions which can liberate $\\mathrm{H_2}$ from a dilute acid are`,
[
  '$\\mathrm{V^{2+}}$ and $\\mathrm{Mn^{2+}}$',
  '$\\mathrm{Cr^{2+}}$ and $\\mathrm{Co^{2+}}$',
  '$\\mathrm{V^{2+}}$ and $\\mathrm{Cr^{2+}}$',
  '$\\mathrm{Mn^{2+}}$ and $\\mathrm{Co^{2+}}$'
],
'c',
`**To liberate $\\mathrm{H_2}$ from dilute acid**, the metal ion ($\\mathrm{M^{2+}}$) must be a stronger reducing agent than $\\mathrm{H^+}$, i.e., $E°(\\mathrm{M^{3+}/M^{2+}}) < E°(\\mathrm{H^+/H_2}) = 0\\ \\mathrm{V}$.

The reaction is: $\\mathrm{M^{2+} + H^+ \\rightarrow M^{3+} + \\frac{1}{2}H_2}$

For this to be spontaneous: $E°_{\\text{cell}} > 0$, which requires $E°(\\mathrm{M^{3+}/M^{2+}}) < 0$.

| Metal ion | $E°(\\mathrm{M^{3+}/M^{2+}})$ | Can liberate $\\mathrm{H_2}$? |
|---|---|---|
| $\\mathrm{V^{2+}}$ | $-0.26\\ \\mathrm{V}$ | ✓ (negative) |
| $\\mathrm{Cr^{2+}}$ | $-0.41\\ \\mathrm{V}$ | ✓ (negative) |
| $\\mathrm{Mn^{2+}}$ | $+1.57\\ \\mathrm{V}$ | ✗ (positive) |
| $\\mathrm{Co^{2+}}$ | $+1.97\\ \\mathrm{V}$ | ✗ (positive) |

**Answer: Option (3) — $\\mathrm{V^{2+}}$ and $\\mathrm{Cr^{2+}}$**`,
'tag_electrochem_3', src(2023, 'Jan', 29, 'Morning')),

// Q6 — Cell potential of concentration cell; Answer: 275 × 10^-2 V
mkNVT('EC-006', 'Hard',
`The electrode potential of the following half cell at 298 K

$$\\mathrm{X} \\mid \\mathrm{X^{2+}(0.001\\ M)} \\| \\mathrm{Y^{2+}(0.01\\ M)} \\mid \\mathrm{Y}$$

is $\\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{V}$ (Nearest integer)

Given: $E°_{\\mathrm{X^{2+}|X}} = -2.36\\ \\mathrm{V},\\ E°_{\\mathrm{Y^{2+}|Y}} = +0.36\\ \\mathrm{V},\\ \\dfrac{2.303RT}{F} = 0.06\\ \\mathrm{V}$`,
{ integer_value: 275 },
`**Step 1 — Standard cell potential:**
$$E°_{\\text{cell}} = E°_{\\text{cathode}} - E°_{\\text{anode}} = 0.36 - (-2.36) = 2.72\\ \\mathrm{V}$$

**Step 2 — Cell reaction:** $\\mathrm{X + Y^{2+} \\rightarrow X^{2+} + Y}$, $n = 2$

**Step 3 — Nernst equation:**
$$E_{\\text{cell}} = E°_{\\text{cell}} - \\frac{0.06}{2}\\log\\frac{[\\mathrm{X^{2+}}]}{[\\mathrm{Y^{2+}}]}$$
$$= 2.72 - 0.03 \\times \\log\\frac{0.001}{0.01}$$
$$= 2.72 - 0.03 \\times \\log(0.1)$$
$$= 2.72 - 0.03 \\times (-1)$$
$$= 2.72 + 0.03 = 2.75\\ \\mathrm{V} = 275 \\times 10^{-2}\\ \\mathrm{V}$$

**Answer: 275**`,
'tag_electrochem_6', src(2023, 'Jan', 30, 'Evening')),

// Q7 — Correct statement for electrolysis of brine; Answer: (4) OH- formed at cathode
mkSCQ('EC-007', 'Easy',
`Which one of the following statements is correct for electrolysis of brine solution?`,
[
  '$\\mathrm{Cl_2}$ is formed at cathode',
  '$\\mathrm{O_2}$ is formed at cathode',
  '$\\mathrm{H_2}$ is formed at anode',
  '$\\mathrm{OH^-}$ is formed at cathode'
],
'd',
`**Electrolysis of brine (NaCl solution):**

**At cathode (reduction):**
$$2\\mathrm{H_2O} + 2e^- \\rightarrow \\mathrm{H_2(g)} + 2\\mathrm{OH^-(aq)}$$

$\\mathrm{OH^-}$ ions are formed at the cathode. ✓

**At anode (oxidation):**
$$2\\mathrm{Cl^-(aq)} \\rightarrow \\mathrm{Cl_2(g)} + 2e^-$$

$\\mathrm{Cl_2}$ is formed at the anode (not cathode).

**Checking options:**
- (1) $\\mathrm{Cl_2}$ at cathode — WRONG (it forms at anode)
- (2) $\\mathrm{O_2}$ at cathode — WRONG
- (3) $\\mathrm{H_2}$ at anode — WRONG ($\\mathrm{H_2}$ forms at cathode)
- (4) $\\mathrm{OH^-}$ at cathode — **CORRECT ✓**

**Answer: Option (4)**`,
'tag_electrochem_5', src(2023, 'Jan', 31, 'Morning')),

// Q8 — Number of electrons in Zn/Sn cell; Answer: 4
mkNVT('EC-008', 'Hard',
`The cell potential for $\\mathrm{Zn|Zn^{2+}(aq)\\|Sn^{x+}|Sn}$ is 0.801 V at 298 K. The reaction quotient for the above reaction is $10^{-2}$. The number of electrons involved in the given electrochemical cell reaction is $\\_\\_\\_\\_$.

Given: $E°_{\\mathrm{Zn^{2+}|Zn}} = -0.763\\ \\mathrm{V},\\ E°_{\\mathrm{Sn^{x+}|Sn}} = +0.008\\ \\mathrm{V}$ and $\\dfrac{2.303RT}{F} = 0.06\\ \\mathrm{V}$`,
{ integer_value: 4 },
`**Step 1 — Standard cell potential:**
$$E°_{\\text{cell}} = E°_{\\text{cathode}} - E°_{\\text{anode}} = 0.008 - (-0.763) = 0.771\\ \\mathrm{V}$$

**Step 2 — Nernst equation:**
$$E_{\\text{cell}} = E°_{\\text{cell}} - \\frac{0.06}{n}\\log Q$$
$$0.801 = 0.771 - \\frac{0.06}{n}\\log(10^{-2})$$
$$0.801 = 0.771 - \\frac{0.06}{n} \\times (-2)$$
$$0.801 = 0.771 + \\frac{0.12}{n}$$
$$0.030 = \\frac{0.12}{n}$$
$$n = \\frac{0.12}{0.030} = 4$$

**Answer: 4 electrons**`,
'tag_electrochem_6', src(2022, 'Jul', 25, 'Morning')),

// Q9 — Faradays to obtain 1 mol Fe from Fe3O4; Answer: 3
mkNVT('EC-009', 'Medium',
`The amount of charge in F (Faraday) required to obtain one mole of iron from $\\mathrm{Fe_3O_4}$ is $\\_\\_\\_\\_$. (Round off the answer to the nearest integer)`,
{ integer_value: 3 },
`**Step 1 — Oxidation state of Fe in $\\mathrm{Fe_3O_4}$:**

$\\mathrm{Fe_3O_4}$ is a mixed oxide: $\\mathrm{FeO \\cdot Fe_2O_3}$

Average oxidation state of Fe: $3x + 4(-2) = 0 \\Rightarrow x = +8/3$

**Step 2 — Reduction to Fe(0):**

Each Fe atom goes from $+8/3$ to $0$, gaining $8/3$ electrons.

For 1 mole of Fe: charge = $8/3\\ \\mathrm{F}$

But the question asks for integer answer. Let's consider the full reduction:

$\\mathrm{Fe_3O_4 + 8e^- \\rightarrow 3Fe + 4O^{2-}}$ (8 electrons for 3 Fe atoms)

For 1 mole of Fe: $8/3 \\approx 2.67\\ \\mathrm{F}$

Rounding to nearest integer = **3 F**

**Answer: 3 F**`,
'tag_electrochem_5', src(2022, 'Jul', 26, 'Morning')),

// Q10 — Correct order of reduction potentials; Answer: (4) A > C > B > D > E
mkSCQ('EC-010', 'Medium',
`The correct order of reduction potentials of the following pairs is

| Label | Half-cell |
|---|---|
| A | $\\mathrm{Cl_2/Cl^-}$ |
| B | $\\mathrm{I_2/I^-}$ |
| C | $\\mathrm{Ag^+/Ag}$ |
| D | $\\mathrm{Na^+/Na}$ |
| E | $\\mathrm{Li^+/Li}$ |

Choose the correct answer from the options given below.`,
[
  'A > B > C > E > D',
  'A > C > B > E > D',
  'A > B > C > D > E',
  'A > C > B > D > E'
],
'd',
`**Standard reduction potentials (approximate values):**

| Half-cell | $E°$ (V) |
|---|---|
| $\\mathrm{Cl_2/Cl^-}$ (A) | +1.36 |
| $\\mathrm{Ag^+/Ag}$ (C) | +0.80 |
| $\\mathrm{I_2/I^-}$ (B) | +0.54 |
| $\\mathrm{Na^+/Na}$ (D) | −2.71 |
| $\\mathrm{Li^+/Li}$ (E) | −3.04 |

**Order:** A > C > B > D > E

**Answer: Option (4) — A > C > B > D > E**`,
'tag_electrochem_3', src(2022, 'Jun', 25, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-001 to EC-010)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
