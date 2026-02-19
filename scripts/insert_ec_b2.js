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

// Q11 — Metal with highest M2+/M SRP in 3d series; Answer: (3) Cu
mkSCQ('EC-011', 'Easy',
`In 3d series, the metal having the highest $\\mathrm{M^{2+}/M}$ standard electrode potential is`,
['Cr', 'Fe', 'Cu', 'Zn'],
'c',
`**Standard electrode potentials ($E°$) for $\\mathrm{M^{2+}/M}$) in the 3d series:**

| Metal | $E°(\\mathrm{M^{2+}/M})$ (V) |
|---|---|
| Cr | −0.91 |
| Fe | −0.44 |
| Zn | −0.76 |
| **Cu** | **+0.34** |

Copper has the **highest** (most positive) $\\mathrm{M^{2+}/M}$ standard electrode potential in the 3d series, meaning it is the least reactive and the best oxidising agent among these metals.

**Answer: Option (3) — Cu**`,
'tag_electrochem_3', src(2022, 'Jun', 27, 'Evening')),

// Q12 — Faradays to reduce 1 mol Cr2O7^2- to Cr3+; Answer: 6
mkNVT('EC-012', 'Easy',
`The quantity of electricity in Faraday needed to reduce 1 mol of $\\mathrm{Cr_2O_7^{2-}}$ to $\\mathrm{Cr^{3+}}$ is $\\_\\_\\_\\_$`,
{ integer_value: 6 },
`**Half-reaction for reduction of dichromate:**
$$\\mathrm{Cr_2O_7^{2-} + 14H^+ + 6e^- \\rightarrow 2Cr^{3+} + 7H_2O}$$

**Step 1 — Oxidation state change:**
- Cr in $\\mathrm{Cr_2O_7^{2-}}$: $+6$
- Cr in $\\mathrm{Cr^{3+}}$: $+3$
- Change per Cr atom: $6 - 3 = 3$ electrons gained

**Step 2 — Total electrons for 1 mol $\\mathrm{Cr_2O_7^{2-}}$:**

1 mol $\\mathrm{Cr_2O_7^{2-}}$ contains 2 mol Cr atoms.
$$\\text{Total electrons} = 2 \\times 3 = 6\\ \\mathrm{mol\\ e^-} = 6\\ \\mathrm{F}$$

**Answer: 6 F**`,
'tag_electrochem_5', src(2022, 'Jun', 28, 'Morning')),

// Q13 — Ecell for Cu/Ag cell; Answer: 3 V (nearest integer)
mkNVT('EC-013', 'Hard',
`Assume a cell with the following reaction:
$$\\mathrm{Cu_{(s)} + 2Ag^+(1 \\times 10^{-3}\\ M) \\rightarrow Cu^{2+}(0.250\\ M) + 2Ag_{(s)}}$$
$$E°_{\\text{cell}} = 2.97\\ \\mathrm{V}$$

$E_{\\text{cell}}$ for the above reaction is $\\_\\_\\_\\_$ V. (Nearest integer)

[Given: $\\log 2.5 = 0.3979$, $T = 298\\ \\mathrm{K}$]`,
{ integer_value: 3 },
`**Cell reaction:** $\\mathrm{Cu + 2Ag^+ \\rightarrow Cu^{2+} + 2Ag}$, $n = 2$

**Nernst equation:**
$$E_{\\text{cell}} = E°_{\\text{cell}} - \\frac{0.0592}{n}\\log Q$$

**Reaction quotient:**
$$Q = \\frac{[\\mathrm{Cu^{2+}}]}{[\\mathrm{Ag^+}]^2} = \\frac{0.250}{(1 \\times 10^{-3})^2} = \\frac{0.250}{10^{-6}} = 2.5 \\times 10^5$$

$$\\log Q = \\log(2.5 \\times 10^5) = \\log 2.5 + 5 = 0.3979 + 5 = 5.3979$$

$$E_{\\text{cell}} = 2.97 - \\frac{0.0592}{2} \\times 5.3979$$
$$= 2.97 - 0.0296 \\times 5.3979$$
$$= 2.97 - 0.1598 = 2.81\\ \\mathrm{V} \\approx 3\\ \\mathrm{V}$$

**Answer: 3 V**`,
'tag_electrochem_6', src(2021, 'Jul', 22, 'Morning')),

// Q14 — Cell potential E2 for Cu/Ag cell; Answer: 28 × 10^-2 V
mkNVT('EC-014', 'Hard',
`For the cell $\\mathrm{Cu(s)|Cu^{2+}(aq)(0.1\\ M)\\|Ag^+(aq)(0.01\\ M)|Ag(s)}$ the cell potential $E_1 = 0.3095\\ \\mathrm{V}$.

For the cell $\\mathrm{Cu(s)|Cu^{2+}(aq)(0.01\\ M)\\|Ag^+(aq)(0.001\\ M)|Ag(s)}$ the cell potential $= x \\times 10^{-2}\\ \\mathrm{V}$.

Find value of x (Round off to the Nearest Integer).

[Use: $\\dfrac{2.303RT}{F} = 0.059\\ \\mathrm{V}$]`,
{ integer_value: 28 },
`**Cell reaction:** $\\mathrm{Cu + 2Ag^+ \\rightarrow Cu^{2+} + 2Ag}$, $n = 2$

**For cell 1 ($E_1 = 0.3095$ V):**
$$E_1 = E°_{\\text{cell}} - \\frac{0.059}{2}\\log\\frac{[\\mathrm{Cu^{2+}}]}{[\\mathrm{Ag^+}]^2} = E°_{\\text{cell}} - 0.0295\\log\\frac{0.1}{(0.01)^2}$$
$$= E°_{\\text{cell}} - 0.0295\\log(1000) = E°_{\\text{cell}} - 0.0295 \\times 3 = E°_{\\text{cell}} - 0.0885$$
$$0.3095 = E°_{\\text{cell}} - 0.0885 \\Rightarrow E°_{\\text{cell}} = 0.398\\ \\mathrm{V}$$

**For cell 2:**
$$E_2 = 0.398 - 0.0295\\log\\frac{0.01}{(0.001)^2} = 0.398 - 0.0295\\log(10^4)$$
$$= 0.398 - 0.0295 \\times 4 = 0.398 - 0.118 = 0.280\\ \\mathrm{V} = 28 \\times 10^{-2}\\ \\mathrm{V}$$

**Answer: x = 28**`,
'tag_electrochem_6', src(2021, 'Jul', 27, 'Evening')),

// Q15 — Faradays to reduce 5 mol MnO4-; Answer: 25
mkNVT('EC-015', 'Easy',
`Consider the following reaction:
$$\\mathrm{MnO_4^- + 8H^+ + 5e^- \\rightarrow Mn^{2+} + 4H_2O},\\quad E° = 1.51\\ \\mathrm{V}$$

The quantity of electricity required in Faraday to reduce five moles of $\\mathrm{MnO_4^-}$ is $\\_\\_\\_\\_$.`,
{ integer_value: 25 },
`**From the half-reaction:**
$$\\mathrm{MnO_4^- + 8H^+ + 5e^- \\rightarrow Mn^{2+} + 4H_2O}$$

1 mole of $\\mathrm{MnO_4^-}$ requires **5 moles of electrons** = 5 F.

For **5 moles** of $\\mathrm{MnO_4^-}$:
$$Q = 5 \\times 5 = 25\\ \\mathrm{F}$$

**Answer: 25 F**`,
'tag_electrochem_5', src(2021, 'Feb', 26, 'Morning')),

// Q16 — ln K for Cu+ disproportionation; Answer: 144 × 10^-1
mkNVT('EC-016', 'Hard',
`For the disproportionation reaction $2\\mathrm{Cu^+(aq)} \\rightleftharpoons \\mathrm{Cu(s)} + \\mathrm{Cu^{2+}(aq)}$ at 298 K, $\\ln K$ (where K is the equilibrium constant) is $\\_\\_\\_\\_ \\times 10^{-1}$.

Given: $E°_{\\mathrm{Cu^{2+}/Cu^+}} = 0.16\\ \\mathrm{V}$, $E°_{\\mathrm{Cu^+/Cu}} = 0.52\\ \\mathrm{V}$, $\\dfrac{RT}{F} = 0.025$`,
{ integer_value: 144 },
`**Step 1 — Identify anode and cathode:**

Disproportionation: $\\mathrm{Cu^+}$ is both oxidised and reduced.
- **Cathode (reduction):** $\\mathrm{Cu^+ + e^- \\rightarrow Cu}$, $E° = +0.52\\ \\mathrm{V}$
- **Anode (oxidation):** $\\mathrm{Cu^+ \\rightarrow Cu^{2+} + e^-}$, $E°_{\\text{ox}} = -0.16\\ \\mathrm{V}$

**Step 2 — Standard cell potential:**
$$E°_{\\text{cell}} = 0.52 - 0.16 = 0.36\\ \\mathrm{V}$$

**Step 3 — Relationship between $E°$ and $\\ln K$:**
$$\\Delta G° = -nFE°_{\\text{cell}} = -RT\\ln K$$
$$\\ln K = \\frac{nFE°}{RT} = \\frac{n \\times E°}{RT/F} = \\frac{1 \\times 0.36}{0.025} = 14.4 = 144 \\times 10^{-1}$$

**Answer: 144**`,
'tag_electrochem_6', src(2020, 'Sep', 2, 'Evening')),

// Q17 — Efficiency of Cr3+ production; Answer: 60%
mkNVT('EC-017', 'Hard',
`An acidic solution of dichromate is electrolyzed for 8 minutes using 2 A current. As per the following equation:
$$\\mathrm{Cr_2O_7^{2-} + 14H^+ + 6e^- \\rightarrow 2Cr^{3+} + 7H_2O}$$

The amount of $\\mathrm{Cr^{3+}}$ obtained was 0.104 g. The efficiency of the process (in %) is $\\_\\_\\_\\_$.

(Take: $F = 96000\\ \\mathrm{C}$, At. mass of chromium = 52)`,
{ integer_value: 60 },
`**Step 1 — Total charge passed:**
$$Q = I \\times t = 2 \\times (8 \\times 60) = 960\\ \\mathrm{C}$$

**Step 2 — Theoretical moles of $\\mathrm{Cr^{3+}}$ (from stoichiometry):**

From the equation, 6 F produces 2 mol $\\mathrm{Cr^{3+}}$, so 1 F produces $\\frac{2}{6} = \\frac{1}{3}$ mol $\\mathrm{Cr^{3+}}$.

$$n_{\\mathrm{Cr^{3+}}}^{\\text{theoretical}} = \\frac{Q}{F} \\times \\frac{1}{3} = \\frac{960}{96000} \\times \\frac{1}{3} = 0.01 \\times \\frac{1}{3} = \\frac{1}{300}\\ \\mathrm{mol}$$

**Step 3 — Theoretical mass:**
$$m_{\\text{theoretical}} = \\frac{1}{300} \\times 52 = \\frac{52}{300} = 0.1733\\ \\mathrm{g}$$

**Step 4 — Efficiency:**
$$\\eta = \\frac{m_{\\text{actual}}}{m_{\\text{theoretical}}} \\times 100 = \\frac{0.104}{0.1733} \\times 100 = 60\\%$$

**Answer: 60%**`,
'tag_electrochem_5', src(2020, 'Sep', 3, 'Evening')),

// Q18 — E°cell from ΔG°; Answer: -6 × 10^-2 V
mkNVT('EC-018', 'Hard',
`An oxidation-reduction reaction in which 3 electrons are transferred has a $\\Delta G° = 17.37\\ \\mathrm{kJ\\ mol^{-1}}$ at $25°\\mathrm{C}$. The value of $E°_{\\text{cell}}$ (in V) is $\\_\\_\\_\\_ \\times 10^{-2}$.

$(1\\ \\mathrm{F} = 96500\\ \\mathrm{C\\ mol^{-1}})$`,
{ integer_value: -6 },
`**Relationship between $\\Delta G°$ and $E°_{\\text{cell}}$:**
$$\\Delta G° = -nFE°_{\\text{cell}}$$

**Solving for $E°_{\\text{cell}}$:**
$$E°_{\\text{cell}} = -\\frac{\\Delta G°}{nF} = -\\frac{17370\\ \\mathrm{J\\ mol^{-1}}}{3 \\times 96500\\ \\mathrm{C\\ mol^{-1}}}$$
$$= -\\frac{17370}{289500} = -0.06\\ \\mathrm{V} = -6 \\times 10^{-2}\\ \\mathrm{V}$$

The negative value indicates the reaction is non-spontaneous under standard conditions.

**Answer: −6**`,
'tag_electrochem_6', src(2020, 'Sep', 5, 'Morning')),

// Q19 — Time to produce 10 g KClO3; Answer: 11 hours
mkNVT('EC-019', 'Hard',
`Potassium chlorate is prepared by the electrolysis of KCl in basic solution:
$$6\\mathrm{OH^- + Cl^- \\rightarrow ClO_3^- + 3H_2O + 6e^-}$$

If only 60% of the current is utilized in the reaction, the time (rounded to the nearest hour) required to produce 10 g of $\\mathrm{KClO_3}$ using a current of 2 A is $\\_\\_\\_\\_$.

(Given: $F = 96500\\ \\mathrm{C\\ mol^{-1}}$; molar mass of $\\mathrm{KClO_3} = 122\\ \\mathrm{g\\ mol^{-1}}$)`,
{ integer_value: 11 },
`**Step 1 — Moles of $\\mathrm{KClO_3}$ needed:**
$$n = \\frac{10}{122} = 0.08197\\ \\mathrm{mol}$$

**Step 2 — Moles of electrons required (6 F per mol $\\mathrm{KClO_3}$):**
$$n_{e^-} = 6 \\times 0.08197 = 0.4918\\ \\mathrm{mol}$$

**Step 3 — Charge required (theoretical):**
$$Q_{\\text{theoretical}} = 0.4918 \\times 96500 = 47459\\ \\mathrm{C}$$

**Step 4 — Actual charge needed (60% efficiency):**
$$Q_{\\text{actual}} = \\frac{47459}{0.60} = 79098\\ \\mathrm{C}$$

**Step 5 — Time:**
$$t = \\frac{Q}{I} = \\frac{79098}{2} = 39549\\ \\mathrm{s} = \\frac{39549}{3600} = 10.99 \\approx 11\\ \\mathrm{hours}$$

**Answer: 11 hours**`,
'tag_electrochem_5', src(2020, 'Sep', 5, 'Evening')),

// Q20 — Condition for negative ΔG in concentration cell; Answer: (4) C2 = √2 C1
mkSCQ('EC-020', 'Medium',
`For the given cell:
$$\\mathrm{Cu(s)|Cu^{2+}(C_1\\ M)\\|Cu^{2+}(C_2\\ M)|Cu(s)}$$

change in Gibbs energy ($\\Delta G$) is negative, if:`,
[
  '$C_1 = C_2$',
  '$C_2 = \\dfrac{C_1}{\\sqrt{2}}$',
  '$C_1 = 2C_2$',
  '$C_2 = \\sqrt{2}\\ C_1$'
],
'd',
`**This is a concentration cell.** For $\\Delta G < 0$, we need $E_{\\text{cell}} > 0$.

**Cell reaction:** $\\mathrm{Cu^{2+}(C_1) \\rightarrow Cu^{2+}(C_2)}$ (copper dissolves from anode at $C_1$ and deposits at cathode at $C_2$)

**Nernst equation for concentration cell ($E° = 0$):**
$$E_{\\text{cell}} = -\\frac{0.059}{2}\\log\\frac{C_1}{C_2}$$

For $E_{\\text{cell}} > 0$:
$$\\log\\frac{C_1}{C_2} < 0 \\Rightarrow \\frac{C_1}{C_2} < 1 \\Rightarrow C_2 > C_1$$

Among the options, $C_2 = \\sqrt{2}\\ C_1 > C_1$ satisfies this condition.

**Answer: Option (4) — $C_2 = \\sqrt{2}\\ C_1$**`,
'tag_electrochem_6', src(2020, 'Sep', 6, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-011 to EC-020)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
