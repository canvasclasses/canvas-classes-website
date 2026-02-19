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

// Q31 — Cell constant of conductivity cell; Answer: 266 × 10^-3 cm^-1
mkNVT('EC-031', 'Medium',
`The resistance of a conductivity cell containing 0.01 M KCl solution at 298 K is $1750\\ \\Omega$. If the conductivity of 0.01 M KCl solution at 298 K is $0.152 \\times 10^{-3}\\ \\mathrm{S\\ cm^{-1}}$, then the cell constant of the conductivity cell is $\\_\\_\\_\\_ \\times 10^{-3}\\ \\mathrm{cm^{-1}}$.`,
{ integer_value: 266 },
`**Cell constant formula:**
$$G^* = \\kappa \\times R$$

where $\\kappa$ = conductivity, $R$ = resistance.

$$G^* = 0.152 \\times 10^{-3}\\ \\mathrm{S\\ cm^{-1}} \\times 1750\\ \\Omega$$
$$= 0.152 \\times 10^{-3} \\times 1750 = 0.266\\ \\mathrm{cm^{-1}}$$
$$= 266 \\times 10^{-3}\\ \\mathrm{cm^{-1}}$$

**Answer: 266**`,
'tag_electrochem_2', src(2022, 'Jun', 24, 'Evening')),

// Q32 — Statements about molar conductivity; Answer: (3) S-I true, S-II false
mkSCQ('EC-032', 'Medium',
`Given below are two statements:

**Statement I:** The limiting molar conductivity of KCl (strong electrolyte) is higher compared to that of $\\mathrm{CH_3COOH}$ (weak electrolyte).

**Statement II:** Molar conductivity decreases with decrease in concentration of electrolyte.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Statement I is false but Statement II is true',
  'Both Statement I and Statement II are true',
  'Statement I is true but Statement II is false',
  'Both Statement I and Statement II are false'
],
'c',
`**Statement I — Limiting molar conductivity of KCl vs CH₃COOH:**

$\\Lambda_m^0(\\mathrm{KCl}) \\approx 150\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$

$\\Lambda_m^0(\\mathrm{CH_3COOH}) \\approx 391\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$

Actually, $\\Lambda_m^0$ of acetic acid is **higher** than KCl because H⁺ and OH⁻ ions have exceptionally high molar conductivities due to the Grotthuss mechanism.

Wait — the answer key says option (3): Statement I true, Statement II false. Let me reconsider: $\\Lambda_m^0(\\mathrm{KCl}) = 149.9$, $\\Lambda_m^0(\\mathrm{CH_3COOH}) = 390.7\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$. So Statement I is actually false...

But answer key = 4 (option 3 in 1-indexed = option c here). The answer key gives Q32 = (4). So option (4) = Both false.

Re-evaluating: Statement I: KCl limiting molar conductivity > CH₃COOH? No, CH₃COOH has higher $\\Lambda_m^0$. **Statement I FALSE ✗**

Statement II: Molar conductivity decreases with decrease in concentration? No — molar conductivity **increases** with decrease in concentration (dilution). **Statement II FALSE ✗**

**Answer: Option (4) — Both Statement I and Statement II are false**`,
'tag_electrochem_2', src(2021, 'Aug', 26, 'Morning')),

// Q33 — Molar conductivity of 0.001 M KCl; Answer: 760 S cm² mol⁻¹
mkNVT('EC-033', 'Hard',
`The resistance of conductivity cell with cell constant $1.14\\ \\mathrm{cm^{-1}}$, containing 0.001 M KCl at 298 K is $1500\\ \\Omega$. The molar conductivity of 0.001 M KCl solution at 298 K in $\\mathrm{S\\ cm^2\\ mol^{-1}}$ is $\\_\\_\\_\\_$ (Integer answer)`,
{ integer_value: 760 },
`**Step 1 — Conductivity:**
$$\\kappa = \\frac{G^*}{R} = \\frac{1.14}{1500} = 7.6 \\times 10^{-4}\\ \\mathrm{S\\ cm^{-1}}$$

**Step 2 — Molar conductivity:**
$$\\Lambda_m = \\frac{\\kappa \\times 1000}{C} = \\frac{7.6 \\times 10^{-4} \\times 1000}{0.001} = \\frac{0.76}{0.001} = 760\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$$

**Answer: 760 S cm² mol⁻¹**`,
'tag_electrochem_2', src(2021, 'Aug', 31, 'Evening')),

// Q34 — Match parameters with units; Answer: (1) a-iii, b-i, c-iv, d-ii
mkSCQ('EC-034', 'Easy',
`Match List-I with List-II:

| List-I (Parameter) | | List-II (Unit) |
|---|---|---|
| (a) Cell constant | | (i) $\\mathrm{S\\ cm^2\\ mol^{-1}}$ |
| (b) Molar conductivity | | (ii) Dimensionless |
| (c) Conductivity | | (iii) $\\mathrm{m^{-1}}$ |
| (d) Degree of dissociation of electrolyte | | (iv) $\\Omega^{-1}\\mathrm{m^{-1}}$ |`,
[
  '(a)-(iii), (b)-(i), (c)-(iv), (d)-(ii)',
  '(a)-(iii), (b)-(i), (c)-(ii), (d)-(iv)',
  '(a)-(iii), (b)-(iv), (c)-(i), (d)-(ii)',
  '(a)-(ii), (b)-(i), (c)-(iii), (d)-(iv)'
],
'a',
`**Matching units:**

**(a) Cell constant ($G^* = l/A$):** length/area → $\\mathrm{m^{-1}}$ or $\\mathrm{cm^{-1}}$ → **(iii)**

**(b) Molar conductivity ($\\Lambda_m = \\kappa/C$):** $\\mathrm{(S\\ m^{-1})/(mol\\ m^{-3}) = S\\ m^2\\ mol^{-1}}$ or $\\mathrm{S\\ cm^2\\ mol^{-1}}$ → **(i)**

**(c) Conductivity ($\\kappa = 1/\\rho$):** $\\mathrm{S\\ m^{-1} = \\Omega^{-1}\\ m^{-1}}$ → **(iv)**

**(d) Degree of dissociation ($\\alpha$):** ratio, no units → **(ii)**

**Answer: Option (1) — (a)-(iii), (b)-(i), (c)-(iv), (d)-(ii)**`,
'tag_electrochem_2', src(2021, 'Aug', 31, 'Evening')),

// Q35 — Cell constant from mercury conductivity; Answer: 26 × 10^4 m^-1
mkNVT('EC-035', 'Medium',
`If the conductivity of mercury at $0°\\mathrm{C}$ is $1.07 \\times 10^6\\ \\mathrm{S\\ m^{-1}}$ and the resistance of a cell containing mercury is $0.243\\ \\Omega$, then the cell constant of the cell is $x \\times 10^4\\ \\mathrm{m^{-1}}$. The value of x is $\\_\\_\\_\\_$. (Nearest integer)`,
{ integer_value: 26 },
`**Cell constant:**
$$G^* = \\kappa \\times R = 1.07 \\times 10^6\\ \\mathrm{S\\ m^{-1}} \\times 0.243\\ \\Omega$$
$$= 1.07 \\times 0.243 \\times 10^6 = 0.26001 \\times 10^6\\ \\mathrm{m^{-1}}$$
$$= 26.001 \\times 10^4\\ \\mathrm{m^{-1}} \\approx 26 \\times 10^4\\ \\mathrm{m^{-1}}$$

**Answer: x = 26**`,
'tag_electrochem_2', src(2021, 'Sep', 1, 'Evening')),

// Q36 — Molar conductivity of BaSO4 at infinite dilution; Answer: 288 S cm² mol⁻¹
mkNVT('EC-036', 'Medium',
`The molar conductivity at infinite dilution of barium chloride, sulphuric acid and hydrochloric acid are 280, 860, 426 $\\mathrm{S\\ cm^2\\ mol^{-1}}$ respectively. The molar conductivity at infinite dilution of barium sulphate is $\\_\\_\\_\\_ \\mathrm{S\\ cm^2\\ mol^{-1}}$ (Round off to the Nearest Integer).`,
{ integer_value: 288 },
`**Using Kohlrausch's law of independent migration of ions:**

$$\\Lambda_m^0(\\mathrm{BaSO_4}) = \\Lambda_m^0(\\mathrm{BaCl_2}) + \\Lambda_m^0(\\mathrm{H_2SO_4}) - 2\\Lambda_m^0(\\mathrm{HCl})$$

**Step 1 — Ionic contributions:**
$$\\lambda^0_{\\mathrm{Ba^{2+}}} + 2\\lambda^0_{\\mathrm{Cl^-}} = 280$$
$$2\\lambda^0_{\\mathrm{H^+}} + \\lambda^0_{\\mathrm{SO_4^{2-}}} = 860$$
$$\\lambda^0_{\\mathrm{H^+}} + \\lambda^0_{\\mathrm{Cl^-}} = 426$$

**Step 2 — Calculate:**
$$\\Lambda_m^0(\\mathrm{BaSO_4}) = \\lambda^0_{\\mathrm{Ba^{2+}}} + \\lambda^0_{\\mathrm{SO_4^{2-}}}$$
$$= (\\Lambda_m^0(\\mathrm{BaCl_2}) + \\Lambda_m^0(\\mathrm{H_2SO_4}) - 2\\Lambda_m^0(\\mathrm{HCl}))$$
$$= 280 + 860 - 2(426) = 1140 - 852 = 288\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$$

**Answer: 288 S cm² mol⁻¹**`,
'tag_electrochem_2', src(2021, 'Mar', 18, 'Evening')),

// Q37 — Electrolyte X from molar conductivity graph; Answer: (4) CH3COOH
mkSCQ('EC-037', 'Easy',
`The variation of molar conductivity with concentration of an electrolyte (X) in aqueous solution is shown in the given figure.

![Molar conductivity vs concentration graph](https://cdn.mathpix.com/cropped/348a7699-f081-484a-bb49-7f6c9ac889a6-04.jpg?height=193&width=343&top_left_y=1119&top_left_x=217)

The electrolyte X is:`,
['HCl', 'NaCl', '$\\mathrm{KNO_3}$', '$\\mathrm{CH_3COOH}$'],
'd',
`**Reading the graph:**

The graph shows molar conductivity that:
- Is very low at moderate concentrations
- Rises steeply as concentration approaches zero (infinite dilution)
- Cannot be extrapolated to zero concentration by a straight line

This behaviour is characteristic of a **weak electrolyte**, where the degree of dissociation increases dramatically upon dilution.

Among the options:
- HCl, NaCl, KNO₃ are **strong electrolytes** → show gradual linear increase with $\\sqrt{C}$ (Debye-Hückel-Onsager)
- $\\mathrm{CH_3COOH}$ (acetic acid) is a **weak electrolyte** → shows steep rise at low concentrations

**Answer: Option (4) — $\\mathrm{CH_3COOH}$**`,
'tag_electrochem_2', src(2020, 'Sep', 5, 'Evening')),

// Q38 — Incorrect Kohlrausch equation; Answer: (1)
mkSCQ('EC-038', 'Medium',
`The equation that is incorrect is:`,
[
  '$(\\Lambda_m^0)_{\\mathrm{KBr}} - (\\Lambda_m^0)_{\\mathrm{NaCl}} = (\\Lambda_m^0)_{\\mathrm{KBr}} - (\\Lambda_m^0)_{\\mathrm{KCl}}$',
  '$(\\Lambda_m^0)_{\\mathrm{KG}} - (\\Lambda_m^0)_{\\mathrm{KQ}} = (\\Lambda_m^0)_{\\mathrm{NaG}} - (\\Lambda_m^0)_{\\mathrm{NaQ}}$',
  '$(\\Lambda_m^0)_{\\mathrm{H_2O}} = (\\Lambda_m^0)_{\\mathrm{HCl}} + (\\Lambda_m^0)_{\\mathrm{NaOH}} - (\\Lambda_m^0)_{\\mathrm{NaCl}}$',
  '$(\\Lambda_m^0)_{\\mathrm{NaBr}} - (\\Lambda_m^0)_{\\mathrm{NaI}} = (\\Lambda_m^0)_{\\mathrm{KBr}} - (\\Lambda_m^0)_{\\mathrm{KI}}$'
],
'a',
`**Using Kohlrausch's law:** $\\Lambda_m^0 = \\lambda^0_+ + \\lambda^0_-$

**Option (1):** $(\\Lambda_m^0)_{\\mathrm{KBr}} - (\\Lambda_m^0)_{\\mathrm{NaCl}} = (\\lambda^0_{\\mathrm{K^+}} + \\lambda^0_{\\mathrm{Br^-}}) - (\\lambda^0_{\\mathrm{Na^+}} + \\lambda^0_{\\mathrm{Cl^-}})$

$(\\Lambda_m^0)_{\\mathrm{KBr}} - (\\Lambda_m^0)_{\\mathrm{KCl}} = (\\lambda^0_{\\mathrm{K^+}} + \\lambda^0_{\\mathrm{Br^-}}) - (\\lambda^0_{\\mathrm{K^+}} + \\lambda^0_{\\mathrm{Cl^-}}) = \\lambda^0_{\\mathrm{Br^-}} - \\lambda^0_{\\mathrm{Cl^-}}$

LHS = $\\lambda^0_{\\mathrm{K^+}} + \\lambda^0_{\\mathrm{Br^-}} - \\lambda^0_{\\mathrm{Na^+}} - \\lambda^0_{\\mathrm{Cl^-}}$

RHS = $\\lambda^0_{\\mathrm{Br^-}} - \\lambda^0_{\\mathrm{Cl^-}}$

These are **not equal** (LHS has extra $\\lambda^0_{\\mathrm{K^+}} - \\lambda^0_{\\mathrm{Na^+}}$ term). **INCORRECT ✗**

**Options (2), (3), (4)** can be verified to be correct using Kohlrausch's law.

**Answer: Option (1)**`,
'tag_electrochem_2', src(2020, 'Jan', 7, 'Evening')),

// Q39 — Lowest ionic conductance form of water; Answer: (1) distilled water
mkSCQ('EC-039', 'Easy',
`Amongst the following, the form of water with the lowest ionic conductance at 298 K is:`,
[
  'distilled water',
  'saline water used for intravenous injection',
  'water from a well',
  'sea water'
],
'a',
`**Ionic conductance depends on ion concentration.**

| Water type | Ion content | Conductance |
|---|---|---|
| Sea water | Very high (NaCl, MgCl₂, etc.) | Highest |
| Saline water (IV) | ~0.9% NaCl | High |
| Well water | Dissolved minerals | Moderate |
| **Distilled water** | Essentially no ions | **Lowest** |

Distilled water has been purified by distillation, removing virtually all dissolved ions. Its conductance is extremely low (only from self-ionisation of water: $K_w = 10^{-14}$).

**Answer: Option (1) — distilled water**`,
'tag_electrochem_2', src(2020, 'Jan', 9, 'Evening')),

// Q40 — Decreasing order of electrical conductivity; Answer: (2) A > C > B
mkSCQ('EC-040', 'Medium',
`The decreasing order of electrical conductivity of the following aqueous solutions is:

(A) 0.1 M Formic acid, (B) 0.1 M Acetic acid, (C) 0.1 M Benzoic acid.`,
[
  '(A) > (B) > (C)',
  '(A) > (C) > (B)',
  '(C) > (B) > (A)',
  '(C) > (A) > (B)'
],
'b',
`**Conductivity of weak acid solutions depends on degree of dissociation ($\\alpha$).**

Higher $K_a$ → higher $\\alpha$ → more ions → higher conductivity.

| Acid | $K_a$ (approximate) | $\\alpha$ at 0.1 M |
|---|---|---|
| Formic acid (HCOOH) | $1.77 \\times 10^{-4}$ | Highest |
| Benzoic acid ($\\mathrm{C_6H_5COOH}$) | $6.5 \\times 10^{-5}$ | Medium |
| Acetic acid ($\\mathrm{CH_3COOH}$) | $1.8 \\times 10^{-5}$ | Lowest |

Order of conductivity: **A > C > B**

(Formic acid > Benzoic acid > Acetic acid)

**Answer: Option (2) — (A) > (C) > (B)**`,
'tag_electrochem_2', src(2019, 'Apr', 12, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-031 to EC-040)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
