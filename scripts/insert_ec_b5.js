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

// Q41 — Correct statement about electrochemical cell; Answer: (4) M2+ + X2- → M + X is spontaneous
mkSCQ('EC-041', 'Medium',
`For the electrochemical cell, if $E°_{(\\mathrm{M^{2+}/M})} = 0.46\\ \\mathrm{V}$ and $E°_{(\\mathrm{X/X^{2-}})} = 0.34\\ \\mathrm{V}$.

Which of the following is correct?`,
[
  '$\\mathrm{M + X \\rightarrow M^{2+} + X^{2-}}$ is a spontaneous reaction',
  '$E_{\\text{cell}} = 0.80\\ \\mathrm{V}$',
  '$E_{\\text{cell}} = -0.80\\ \\mathrm{V}$',
  '$\\mathrm{M^{2+} + X^{2-} \\rightarrow M + X}$ is a spontaneous reaction'
],
'd',
`**Given:**
- $E°_{\\mathrm{M^{2+}/M}} = +0.46\\ \\mathrm{V}$ (reduction potential of M)
- $E°_{\\mathrm{X/X^{2-}}} = +0.34\\ \\mathrm{V}$ (reduction potential of X: $\\mathrm{X + 2e^- \\rightarrow X^{2-}}$)

**For a spontaneous cell reaction, $E°_{\\text{cell}} > 0$:**

If M is cathode (reduced) and X²⁻ is oxidised:
$$E°_{\\text{cell}} = E°_{\\text{cathode}} - E°_{\\text{anode}} = 0.46 - 0.34 = +0.12\\ \\mathrm{V} > 0$$

**Spontaneous reaction:** $\\mathrm{M^{2+} + X^{2-} \\rightarrow M + X}$ ✓

(M²⁺ is reduced to M; X²⁻ is oxidised to X)

**Answer: Option (4)**`,
'tag_electrochem_4', src(2024, 'Apr', 5, 'Evening')),

// Q42 — Converting electrochemical to electrolytic cell; Answer: (3) Apply external potential > E°cell
mkSCQ('EC-042', 'Easy',
`How can an electrochemical cell be converted into an electrolytic cell?`,
[
  'Applying an external opposite potential lower than $E°_{\\text{cell}}$.',
  'Reversing the flow of ions in salt bridge.',
  'Applying an external opposite potential greater than $E°_{\\text{cell}}$.',
  'Exchanging the electrodes at anode and cathode.'
],
'c',
`**Electrochemical cell** → spontaneous reaction, produces electricity.

**Electrolytic cell** → non-spontaneous reaction, requires external electricity.

To convert an electrochemical cell into an electrolytic cell, an **external potential greater than $E°_{\\text{cell}}$** must be applied in the **opposite direction** to overcome the cell's EMF and force the non-spontaneous reverse reaction.

- If $E_{\\text{ext}} < E°_{\\text{cell}}$: the cell still operates spontaneously (just reduced current)
- If $E_{\\text{ext}} = E°_{\\text{cell}}$: no current flows (equilibrium)
- If $E_{\\text{ext}} > E°_{\\text{cell}}$: electrolysis occurs (non-spontaneous reaction driven)

**Answer: Option (3)**`,
'tag_electrochem_4', src(2024, 'Apr', 6, 'Evening')),

// Q43 — How to increase EMF of Tl/Cu cell; Answer: (2) increase [Cu2+]
mkSCQ('EC-043', 'Medium',
`The emf of cell $\\mathrm{Tl}\\underset{(0.001\\ M)}{\\mathrm{Tl^+}}\\underset{(0.01\\ M)}{\\mathrm{Cu^{2+}}}\\mathrm{Cu}$ is 0.83 V at 298 K. It could be increased by:`,
[
  'decreasing concentration of both $\\mathrm{Tl^+}$ and $\\mathrm{Cu^{2+}}$ ions',
  'increasing concentration of $\\mathrm{Cu^{2+}}$ ions',
  'increasing concentration of $\\mathrm{Tl^+}$ ions',
  'increasing concentration of both $\\mathrm{Tl^+}$ and $\\mathrm{Cu^{2+}}$ ions'
],
'b',
`**Cell reaction:** $\\mathrm{Tl + Cu^{2+} \\rightarrow Tl^+ + Cu}$ (Tl is anode, Cu is cathode)

**Nernst equation:**
$$E_{\\text{cell}} = E°_{\\text{cell}} - \\frac{0.059}{n}\\log\\frac{[\\mathrm{Tl^+}]}{[\\mathrm{Cu^{2+}}]}$$

To **increase** $E_{\\text{cell}}$, we need to **decrease** the reaction quotient $Q = \\dfrac{[\\mathrm{Tl^+}]}{[\\mathrm{Cu^{2+}}]}$.

This can be done by:
- **Increasing $[\\mathrm{Cu^{2+}}]$** → Q decreases → $E_{\\text{cell}}$ increases ✓
- Decreasing $[\\mathrm{Tl^+}]$ → Q decreases → $E_{\\text{cell}}$ increases ✓

Among the options, only option (2) — increasing $[\\mathrm{Cu^{2+}}]$ — achieves this.

**Answer: Option (2)**`,
'tag_electrochem_6', src(2024, 'Apr', 8, 'Evening')),

// Q44 — Number of metals oxidised by Cr2O7^2-; Answer: 3
mkNVT('EC-044', 'Medium',
`The standard reduction potentials at 298 K for the following half cells are given below:

$$\\mathrm{Cr_2O_7^{2-} + 14H^+ + 6e^- \\rightarrow 2Cr^{3+} + 7H_2O},\\quad E° = 1.33\\ \\mathrm{V}$$
$$\\mathrm{Fe^{3+}(aq) + 3e^- \\rightarrow Fe},\\quad E° = -0.04\\ \\mathrm{V}$$
$$\\mathrm{Ni^{2+}(aq) + 2e^- \\rightarrow Ni},\\quad E° = -0.25\\ \\mathrm{V}$$
$$\\mathrm{Ag^+(aq) + e^- \\rightarrow Ag},\\quad E° = 0.80\\ \\mathrm{V}$$
$$\\mathrm{Au^{3+}(aq) + 3e^- \\rightarrow Au},\\quad E° = 1.40\\ \\mathrm{V}$$

The number of metal(s) which will be oxidised by $\\mathrm{Cr_2O_7^{2-}}$ in aqueous solution is $\\_\\_\\_\\_$.`,
{ integer_value: 3 },
`**A metal is oxidised by $\\mathrm{Cr_2O_7^{2-}}$ if $E°_{\\text{cell}} > 0$**, i.e., the metal's reduction potential < $E°(\\mathrm{Cr_2O_7^{2-}/Cr^{3+}}) = 1.33\\ \\mathrm{V}$.

| Metal | $E°$ (V) | $E° < 1.33$ V? | Oxidised? |
|---|---|---|---|
| Fe | −0.04 | ✓ | ✓ |
| Ni | −0.25 | ✓ | ✓ |
| Ag | +0.80 | ✓ | ✓ |
| Au | +1.40 | ✗ | ✗ |

**3 metals** (Fe, Ni, Ag) will be oxidised by $\\mathrm{Cr_2O_7^{2-}}$.

**Answer: 3**`,
'tag_electrochem_3', src(2024, 'Apr', 9, 'Morning')),

// Q45 — Mass of Ag displaced by O2 at STP; Answer: 108 g
mkNVT('EC-045', 'Hard',
`The mass of silver (Molar mass of Ag: $108\\ \\mathrm{g\\ mol^{-1}}$) displaced by a quantity of electricity which displaces 5600 mL of $\\mathrm{O_2}$ at S.T.P. will be $\\_\\_\\_\\_$ g.`,
{ integer_value: 108 },
`**Step 1 — Moles of O₂ at STP (22400 mL/mol):**
$$n_{\\mathrm{O_2}} = \\frac{5600}{22400} = 0.25\\ \\mathrm{mol}$$

**Step 2 — Charge from O₂ production:**
$$\\mathrm{2H_2O \\rightarrow O_2 + 4H^+ + 4e^-}$$
$$Q = 4 \\times n_{\\mathrm{O_2}} \\times F = 4 \\times 0.25 \\times F = 1\\ \\mathrm{F}$$

**Step 3 — Moles of Ag deposited (Ag⁺ + e⁻ → Ag, 1 F per mol):**
$$n_{\\mathrm{Ag}} = \\frac{Q}{F} = \\frac{1F}{F} = 1\\ \\mathrm{mol}$$

**Step 4 — Mass of Ag:**
$$m = 1 \\times 108 = 108\\ \\mathrm{g}$$

**Answer: 108 g**`,
'tag_electrochem_5', src(2024, 'Jan', 27, 'Evening')),

// Q46 — Potential of H2 electrode at pH=3; Answer: 18 × 10^-2 V
mkNVT('EC-046', 'Medium',
`The hydrogen electrode is dipped in a solution of $\\mathrm{pH} = 3$ at $25°\\mathrm{C}$. The potential of the electrode will be $-\\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{V}$.

$\\left(\\dfrac{2.303RT}{F} = 0.059\\ \\mathrm{V}\\right)$ Round off the answer to the nearest integer.`,
{ integer_value: 18 },
`**Hydrogen electrode half-reaction:**
$$\\mathrm{2H^+(aq) + 2e^- \\rightarrow H_2(g)},\\quad E° = 0\\ \\mathrm{V}$$

**Nernst equation (at $P_{\\mathrm{H_2}} = 1\\ \\mathrm{atm}$):**
$$E = E° - \\frac{0.059}{2}\\log\\frac{P_{\\mathrm{H_2}}}{[\\mathrm{H^+}]^2}$$
$$= 0 - \\frac{0.059}{2}\\log\\frac{1}{[\\mathrm{H^+}]^2}$$
$$= -\\frac{0.059}{2} \\times 2\\log\\frac{1}{[\\mathrm{H^+}]}$$
$$= -0.059 \\times \\mathrm{pH}$$
$$= -0.059 \\times 3 = -0.177\\ \\mathrm{V} \\approx -18 \\times 10^{-2}\\ \\mathrm{V}$$

**Answer: 18**`,
'tag_electrochem_6', src(2024, 'Jan', 27, 'Evening')),

// Q47 — Mass of Zn from electrolysis; Answer: 46 × 10^-4 g
mkNVT('EC-047', 'Medium',
`The mass of zinc produced by the electrolysis of zinc sulphate solution with a steady current of $0.015\\ \\mathrm{A}$ for 15 minutes is $\\_\\_\\_\\_ \\times 10^{-4}\\ \\mathrm{g}$.

(Atomic mass of zinc = 65.4 amu)`,
{ integer_value: 46 },
`**Step 1 — Charge passed:**
$$Q = I \\times t = 0.015 \\times (15 \\times 60) = 0.015 \\times 900 = 13.5\\ \\mathrm{C}$$

**Step 2 — Moles of electrons:**
$$n_{e^-} = \\frac{Q}{F} = \\frac{13.5}{96500} = 1.399 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 3 — Moles of Zn (Zn²⁺ + 2e⁻ → Zn):**
$$n_{\\mathrm{Zn}} = \\frac{n_{e^-}}{2} = \\frac{1.399 \\times 10^{-4}}{2} = 6.995 \\times 10^{-5}\\ \\mathrm{mol}$$

**Step 4 — Mass of Zn:**
$$m = 6.995 \\times 10^{-5} \\times 65.4 = 4.575 \\times 10^{-3}\\ \\mathrm{g} = 45.75 \\times 10^{-4}\\ \\mathrm{g} \\approx 46 \\times 10^{-4}\\ \\mathrm{g}$$

**Answer: 46**`,
'tag_electrochem_5', src(2024, 'Jan', 29, 'Morning')),

// Q48 — Total charge passed for Au deposition; Answer: 2 × 10^-2 F
mkNVT('EC-048', 'Medium',
`A constant current was passed through a solution of $\\mathrm{AuCl_4^-}$ ion between gold electrodes. After a period of 10.0 minutes, the increase in mass of cathode was 1.314 g. The total charge passed through the solution is $\\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{F}$.

(Given atomic mass of Au = 197)`,
{ integer_value: 2 },
`**Cathode reaction:** $\\mathrm{Au^{3+} + 3e^- \\rightarrow Au}$ (from $\\mathrm{AuCl_4^-}$, Au is in +3 state)

**Step 1 — Moles of Au deposited:**
$$n_{\\mathrm{Au}} = \\frac{1.314}{197} = 0.006670\\ \\mathrm{mol}$$

**Step 2 — Moles of electrons (3 per Au):**
$$n_{e^-} = 3 \\times 0.006670 = 0.02001\\ \\mathrm{mol}$$

**Step 3 — Charge in Faradays:**
$$Q = 0.02001\\ \\mathrm{F} = 2.001 \\times 10^{-2}\\ \\mathrm{F} \\approx 2 \\times 10^{-2}\\ \\mathrm{F}$$

**Answer: 2**`,
'tag_electrochem_5', src(2024, 'Jan', 29, 'Evening')),

// Q49 — Gram atoms of Cu from 1 F; Answer: 5 × 10^-1
mkNVT('EC-049', 'Easy',
`One Faraday of electricity liberates $x \\times 10^{-1}$ gram atom of copper from copper sulphate. x is $\\_\\_\\_\\_$.`,
{ integer_value: 5 },
`**Cathode reaction:**
$$\\mathrm{Cu^{2+} + 2e^- \\rightarrow Cu}$$

2 Faradays deposit 1 gram atom (1 mol) of copper.

1 Faraday deposits $\\dfrac{1}{2} = 0.5$ gram atom of copper.

$$= 5 \\times 10^{-1}\\ \\text{gram atom}$$

**Answer: x = 5**`,
'tag_electrochem_5', src(2024, 'Jan', 31, 'Morning')),

// Q50 — Potential of H2 half cell at PH2=2 atm; Answer: 1 × 10^-2 V
mkNVT('EC-050', 'Medium',
`The potential for the given half cell at 298 K is $(-)\\ \\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{V}$.

$$\\mathrm{2H^+(aq) + 2e^- \\rightarrow H_2(g)}$$

$[\\mathrm{H^+}] = 1\\ \\mathrm{M},\\ P_{\\mathrm{H_2}} = 2\\ \\mathrm{atm}$

(Given: $2.303RT/F = 0.06\\ \\mathrm{V}$, $\\log 2 = 0.3$)`,
{ integer_value: 1 },
`**Nernst equation for the half-cell:**
$$E = E° - \\frac{0.06}{2}\\log\\frac{P_{\\mathrm{H_2}}}{[\\mathrm{H^+}]^2}$$

$$= 0 - 0.03 \\times \\log\\frac{2}{(1)^2}$$

$$= -0.03 \\times \\log 2 = -0.03 \\times 0.3 = -0.009\\ \\mathrm{V}$$

Hmm, $-0.009 = -0.9 \\times 10^{-2}$, rounds to $-1 \\times 10^{-2}$.

$$E = -0.03 \\times 0.3 = -0.009 \\approx -1 \\times 10^{-2}\\ \\mathrm{V}$$

**Answer: 1**`,
'tag_electrochem_6', src(2024, 'Feb', 1, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-041 to EC-050)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
