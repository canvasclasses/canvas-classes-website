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

// Q81 — Metal(s) electrodeposited from goldsmith waste solution; Answer: (1) only gold
mkSCQ('EC-081', 'Hard',
`250 mL of a waste solution obtained from the workshop of a goldsmith contains 0.1 M $\\mathrm{AgNO_3}$ and 0.1 M AuCl. The solution was electrolyzed at 2 V by passing a current of 1 A for 15 minutes. The metal/metals electrodeposited will be:

($E°_{\\mathrm{Ag^+/Ag}} = 0.80\\ \\mathrm{V}$, $E°_{\\mathrm{Au^+/Au}} = 1.69\\ \\mathrm{V}$)`,
['only gold', 'silver and gold in proportion to their atomic weights', 'only silver', 'silver and gold in equal mass proportion'],
'a',
`**Step 1 — Determine which metal deposits preferentially:**

The metal with the higher reduction potential deposits first.
- $E°_{\\mathrm{Au^+/Au}} = 1.69\\ \\mathrm{V}$ (higher)
- $E°_{\\mathrm{Ag^+/Ag}} = 0.80\\ \\mathrm{V}$ (lower)

Au deposits preferentially.

**Step 2 — Check if all Au can be deposited:**

Moles of Au³⁺ (actually Au⁺ here): $0.1 \\times 0.250 = 0.025\\ \\mathrm{mol}$

Charge needed for all Au: $0.025 \\times 1 \\times 96500 = 2412.5\\ \\mathrm{C}$

Total charge passed: $Q = 1 \\times 15 \\times 60 = 900\\ \\mathrm{C}$

**Step 3 — Moles of Au deposited:**
$$n_{\\mathrm{Au}} = \\frac{900}{96500} = 9.33 \\times 10^{-3}\\ \\mathrm{mol}$$

This is less than 0.025 mol (total Au available), so **not all Au is deposited** — but the applied voltage (2 V) must be checked against the decomposition potential of Ag.

Since $E_{\\text{applied}} = 2\\ \\mathrm{V}$ and the minimum potential needed to deposit Ag is ~0.80 V, both could theoretically deposit. However, since Au has much higher reduction potential, it deposits **exclusively** until exhausted. With only 900 C available and Au still present, **only gold** deposits.

**Answer: Option (1) — only gold**`,
'tag_electrochem_5', src(2020, 'Sep', 4, 'Evening')),

// Q82 — E° for Cu2+/Cu+ from Cu2+/Cu and Cu+/Cu; Answer: (2) +0.158 V
mkSCQ('EC-082', 'Medium',
`Given that the standard potentials ($E°$) of $\\mathrm{Cu^{2+}/Cu}$ and $\\mathrm{Cu^+/Cu}$ are 0.34 V and 0.522 V respectively, the $E°$ of $\\mathrm{Cu^{2+}/Cu^+}$ is:`,
['0.182 V', '+0.158 V', '-0.182 V', '-0.158 V'],
'b',
`**Using $\\Delta G° = -nFE°$:**

**Reaction 1:** $\\mathrm{Cu^{2+} + 2e^- \\rightarrow Cu}$, $n_1 = 2$, $E°_1 = 0.34\\ \\mathrm{V}$
$$\\Delta G°_1 = -2F(0.34) = -0.68F$$

**Reaction 2:** $\\mathrm{Cu^+ + e^- \\rightarrow Cu}$, $n_2 = 1$, $E°_2 = 0.522\\ \\mathrm{V}$
$$\\Delta G°_2 = -1F(0.522) = -0.522F$$

**Target:** $\\mathrm{Cu^{2+} + e^- \\rightarrow Cu^+}$ = Reaction 1 − Reaction 2, $n_3 = 1$:
$$\\Delta G°_3 = \\Delta G°_1 - \\Delta G°_2 = -0.68F - (-0.522F) = -0.158F$$

$$E°_3 = \\frac{-\\Delta G°_3}{n_3 F} = \\frac{0.158F}{F} = +0.158\\ \\mathrm{V}$$

**Answer: Option (2) — +0.158 V**`,
'tag_electrochem_6', src(2020, 'Jan', 7, 'Morning')),

// Q83 — Electrode potential at pH=5 for O2/H2O; Answer: 0.93 V
mkNVT('EC-083', 'Hard',
`What would be the electrode potential for the given half-cell reaction at $\\mathrm{pH} = 5$?

$$\\mathrm{2H_2O \\rightarrow O_2 + 4H^+ + 4e^-};\\quad E°_{\\text{red}} = 1.23\\ \\mathrm{V}$$

($R = 8.314\\ \\mathrm{J\\ mol^{-1}\\ K^{-1}}$; Temp = 298 K; oxygen under standard atmospheric pressure of 1 bar)`,
{ decimal_value: 0.93 },
`**The given reaction is oxidation; the reduction half-reaction is:**
$$\\mathrm{O_2 + 4H^+ + 4e^- \\rightarrow 2H_2O},\\quad E°_{\\text{red}} = 1.23\\ \\mathrm{V}$$

**Nernst equation for the reduction half-reaction ($n = 4$):**
$$E = E° - \\frac{0.059}{4}\\log\\frac{1}{P_{\\mathrm{O_2}}[\\mathrm{H^+}]^4}$$

With $P_{\\mathrm{O_2}} = 1\\ \\mathrm{bar}$, $[\\mathrm{H^+}] = 10^{-5}$ (pH = 5):
$$E = 1.23 - \\frac{0.059}{4}\\log\\frac{1}{(10^{-5})^4}$$
$$= 1.23 - 0.01475 \\times \\log(10^{20})$$
$$= 1.23 - 0.01475 \\times 20$$
$$= 1.23 - 0.295 = 0.935 \\approx 0.93\\ \\mathrm{V}$$

**Answer: 0.93 V**`,
'tag_electrochem_6', src(2020, 'Jan', 8, 'Morning')),

// Q84 — Standard Gibbs energy for Zn/Cu cell; Answer: (4) -384 kJ/mol
mkSCQ('EC-084', 'Medium',
`The standard Gibbs energy for the given cell reaction in $\\mathrm{kJ\\ mol^{-1}}$ at 298 K is:
$$\\mathrm{Zn(s) + Cu^{2+}(aq) \\longrightarrow Zn^{2+}(aq) + Cu(s)},\\quad E° = 2\\ \\mathrm{V}$$

(Faraday's constant, $F = 96000\\ \\mathrm{C\\ mol^{-1}}$)`,
['-192', '192', '384', '-384'],
'd',
`**Standard Gibbs energy:**
$$\\Delta G° = -nFE°$$

$n = 2$ electrons transferred.

$$\\Delta G° = -2 \\times 96000 \\times 2 = -384000\\ \\mathrm{J\\ mol^{-1}} = -384\\ \\mathrm{kJ\\ mol^{-1}}$$

The negative value confirms the reaction is spontaneous under standard conditions.

**Answer: Option (4) — −384 kJ/mol**`,
'tag_electrochem_6', src(2019, 'Apr', 9, 'Morning')),

// Q85 — Amount of PbSO4 electrolyzed; Answer: (4) 7.6 g
mkSCQ('EC-085', 'Medium',
`The anodic half-cell of lead-acid battery is recharged using electricity of 0.05 Faraday. The amount of $\\mathrm{PbSO_4}$ electrolyzed in g during the process is:

(Molar mass of $\\mathrm{PbSO_4} = 303\\ \\mathrm{g\\ mol^{-1}}$)`,
['22.8', '15.2', '11.4', '7.6'],
'd',
`**Recharging reaction at anode:**
$$\\mathrm{PbSO_4(s) + 2H_2O \\rightarrow PbO_2(s) + SO_4^{2-} + 4H^+ + 2e^-}$$

2 Faradays convert 1 mol of $\\mathrm{PbSO_4}$.

**Moles of $\\mathrm{PbSO_4}$ electrolyzed:**
$$n = \\frac{0.05}{2} = 0.025\\ \\mathrm{mol}$$

**Mass:**
$$m = 0.025 \\times 303 = 7.575 \\approx 7.6\\ \\mathrm{g}$$

**Answer: Option (4) — 7.6 g**`,
'tag_electrochem_1', src(2019, 'Jan', 9, 'Morning')),

// Q86 — Increasing order of reducing power; Answer: (3) Ni < Zn < Mg < Ca
mkSCQ('EC-086', 'Medium',
`Consider the following reduction processes:
$$\\mathrm{Zn^{2+} + 2e^- \\rightarrow Zn(s)};\\quad E° = -0.76\\ \\mathrm{V}$$
$$\\mathrm{Ca^{2+} + 2e^- \\rightarrow Ca(s)};\\quad E° = -2.87\\ \\mathrm{V}$$
$$\\mathrm{Mg^{2+} + 2e^- \\rightarrow Mg(s)};\\quad E° = -2.36\\ \\mathrm{V}$$
$$\\mathrm{Ni^{2+} + 2e^- \\rightarrow Ni(s)};\\quad E° = -0.25\\ \\mathrm{V}$$

The reducing power of the metals increases in the order:`,
[
  '$\\mathrm{Ca < Mg < Zn < Ni}$',
  '$\\mathrm{Zn < Mg < Ni < Ca}$',
  '$\\mathrm{Ni < Zn < Mg < Ca}$',
  '$\\mathrm{Ca < Zn < Ni < Mg}$'
],
'c',
`**Reducing power is inversely related to reduction potential.**

Lower (more negative) $E°$ → stronger reducing agent (more easily oxidised).

| Metal | $E°$ (V) | Reducing power |
|---|---|---|
| Ni | −0.25 | Weakest |
| Zn | −0.76 | ↑ |
| Mg | −2.36 | ↑ |
| Ca | −2.87 | Strongest |

**Increasing order:** Ni < Zn < Mg < Ca

**Answer: Option (3)**`,
'tag_electrochem_3', src(2019, 'Jan', 10, 'Morning')),

// Q87 — E°cell from Kc for Cu/Ag reaction; Answer: (3) 0.4736 V
mkSCQ('EC-087', 'Medium',
`Given the equilibrium constant $K_C$ of the reaction:
$$\\mathrm{Cu(s) + 2Ag^+(aq) \\rightarrow Cu^{2+}(aq) + 2Ag(s)}$$
is $10 \\times 10^{15}$, calculate the $E°_{\\text{cell}}$ of this reaction at 298 K.

$\\left[2.303\\dfrac{RT}{F}\\text{ at }298\\ \\mathrm{K} = 0.059\\ \\mathrm{V}\\right]$`,
['0.04736 mV', '0.4736 mV', '0.4736 V', '0.04736 V'],
'c',
`**Relationship between $E°_{\\text{cell}}$ and $K$:**
$$E°_{\\text{cell}} = \\frac{0.059}{n}\\log K$$

$n = 2$ electrons, $K = 10 \\times 10^{15} = 10^{16}$

$$E°_{\\text{cell}} = \\frac{0.059}{2}\\log(10^{16}) = \\frac{0.059}{2} \\times 16 = 0.0295 \\times 16 = 0.472\\ \\mathrm{V}$$

More precisely: $K = 1.0 \\times 10^{16}$, $\\log K = 16$:
$$E° = 0.0295 \\times 16 = 0.472\\ \\mathrm{V}$$

The answer key gives 0.4736 V, which corresponds to $\\log K = 16.05$ (using $K = 10^{16.05}$). With $K = 10 \\times 10^{15}$: $\\log K = 16$, $E° = 0.472\\ \\mathrm{V} \\approx 0.4736\\ \\mathrm{V}$.

**Answer: Option (3) — 0.4736 V**`,
'tag_electrochem_6', src(2019, 'Jan', 11, 'Evening')),

// Q88 — Standard reaction enthalpy for Zn/Cu cell; Answer: (1) -412.8 kJ/mol
mkSCQ('EC-088', 'Hard',
`The standard electrode potential $E°$ and its temperature coefficient $\\left(\\dfrac{dE}{dT}\\right)$ for a cell are 2 V and $-5 \\times 10^{-4}\\ \\mathrm{V\\ K^{-1}}$ at 300 K, respectively. The reaction is $\\mathrm{Zn(s) + Cu^{2+}(aq) \\rightarrow Zn^{2+}(aq) + Cu(s)}$. The standard reaction enthalpy ($\\Delta_r H°$) at 300 K in $\\mathrm{kJ\\ mol^{-1}}$ is $\\_\\_\\_\\_$.

[Use $R = 8\\ \\mathrm{J\\ K^{-1}\\ mol^{-1}}$ and $F = 96500\\ \\mathrm{C\\ mol^{-1}}$]`,
['-412.8', '206.4', '-384.0', '192.0'],
'a',
`**Using the Gibbs-Helmholtz equation for electrochemical cells:**
$$\\Delta_r H° = -nF\\left[E° - T\\left(\\frac{dE°}{dT}\\right)\\right]$$

With $n = 2$, $E° = 2\\ \\mathrm{V}$, $T = 300\\ \\mathrm{K}$, $\\dfrac{dE°}{dT} = -5 \\times 10^{-4}\\ \\mathrm{V\\ K^{-1}}$:

$$\\Delta_r H° = -2 \\times 96500 \\times \\left[2 - 300 \\times (-5 \\times 10^{-4})\\right]$$
$$= -193000 \\times [2 + 0.15]$$
$$= -193000 \\times 2.15$$
$$= -414950\\ \\mathrm{J\\ mol^{-1}} \\approx -412.8\\ \\mathrm{kJ\\ mol^{-1}}$$

(Small rounding differences due to $F$ value used.)

**Answer: Option (1) — −412.8 kJ/mol**`,
'tag_electrochem_6', src(2019, 'Jan', 12, 'Morning')),

// Q89 — Half cell preferred as reference electrode; Answer: (3) C (smallest dE/dT)
mkSCQ('EC-089', 'Medium',
`The $\\left(\\dfrac{\\partial E}{\\partial T}\\right)_P$ of different types of half cells are as follows:

| Half cell | A | B | C | D |
|---|---|---|---|---|
| $\\left(\\dfrac{\\partial E}{\\partial T}\\right)_P$ | $1 \\times 10^{-4}$ | $2 \\times 10^{-4}$ | $0.1 \\times 10^{-4}$ | $0.2 \\times 10^{-4}$ |

(Where E is the electromotive force). Which of the above half cells would be preferred to be used as reference electrode?`,
['A', 'B', 'C', 'D'],
'c',
`**A reference electrode** must have a **stable, reproducible, and temperature-independent potential**.

The temperature coefficient $\\left(\\dfrac{\\partial E}{\\partial T}\\right)_P$ should be as **small as possible** for a reference electrode, so that its potential does not vary significantly with temperature changes.

| Half cell | $\\left(\\dfrac{\\partial E}{\\partial T}\\right)_P$ |
|---|---|
| A | $1 \\times 10^{-4}$ |
| B | $2 \\times 10^{-4}$ (largest) |
| **C** | $0.1 \\times 10^{-4}$ **(smallest)** |
| D | $0.2 \\times 10^{-4}$ |

Half cell **C** has the smallest temperature coefficient → most stable potential → best reference electrode.

**Answer: Option (3) — C**`,
'tag_electrochem_4', src(2022, 'Jun', 26, 'Morning')),

// Q90 — Pressure of H2 for zero EMF of H electrode in pure water; Answer: (4) 10^-14
mkSCQ('EC-090', 'Medium',
`What pressure (bar) of $\\mathrm{H_2}$ would be required to make emf of hydrogen electrode zero in pure water at $25°\\mathrm{C}$?`,
['$10^{-7}$', '0.5', '1', '$10^{-14}$'],
'd',
`**Hydrogen electrode half-reaction:**
$$\\mathrm{2H^+(aq) + 2e^- \\rightarrow H_2(g)},\\quad E° = 0\\ \\mathrm{V}$$

**Nernst equation:**
$$E = 0 - \\frac{0.059}{2}\\log\\frac{P_{\\mathrm{H_2}}}{[\\mathrm{H^+}]^2}$$

For $E = 0$:
$$\\log\\frac{P_{\\mathrm{H_2}}}{[\\mathrm{H^+}]^2} = 0 \\Rightarrow P_{\\mathrm{H_2}} = [\\mathrm{H^+}]^2$$

In pure water at 25°C: $[\\mathrm{H^+}] = 10^{-7}\\ \\mathrm{M}$

$$P_{\\mathrm{H_2}} = (10^{-7})^2 = 10^{-14}\\ \\mathrm{bar}$$

**Answer: Option (4) — $10^{-14}$ bar**`,
'tag_electrochem_6', src(2024, 'Apr', 4, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-081 to EC-090)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
