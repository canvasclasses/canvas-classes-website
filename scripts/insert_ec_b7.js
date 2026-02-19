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

// Q61 — Magnitude of E° for Sn/Sn2+ from Keq; Answer: 17 × 10^-2 V
mkNVT('EC-061', 'Hard',
`The equilibrium constant for the reaction $\\mathrm{Zn(s) + Sn^{2+}(aq) \\rightleftharpoons Zn^{2+}(aq) + Sn(s)}$ is $1 \\times 10^{20}$ at 298 K. The magnitude of standard electrode potential of $\\mathrm{Sn/Sn^{2+}}$ if $E°_{\\mathrm{Zn^{2+}/Zn}} = -0.76\\ \\mathrm{V}$ is $\\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{V}$. (Nearest integer)

Given: $\\dfrac{2.303RT}{F} = 0.059\\ \\mathrm{V}$`,
{ integer_value: 17 },
`**Step 1 — Find $E°_{\\text{cell}}$ from $K$:**
$$E°_{\\text{cell}} = \\frac{0.059}{n}\\log K = \\frac{0.059}{2}\\log(10^{20}) = \\frac{0.059 \\times 20}{2} = 0.59\\ \\mathrm{V}$$

**Step 2 — Find $E°_{\\mathrm{Sn^{2+}/Sn}}$:**
$$E°_{\\text{cell}} = E°_{\\text{cathode}} - E°_{\\text{anode}}$$
$$0.59 = E°_{\\mathrm{Sn^{2+}/Sn}} - (-0.76)$$
$$E°_{\\mathrm{Sn^{2+}/Sn}} = 0.59 - 0.76 = -0.17\\ \\mathrm{V}$$

Magnitude = $0.17\\ \\mathrm{V} = 17 \\times 10^{-2}\\ \\mathrm{V}$

**Answer: 17**`,
'tag_electrochem_6', src(2023, 'Jan', 29, 'Evening')),

// Q62 — Ratio [Fe2+]/[Fe3+] from cell potential (same as Q59 but different source); Answer: 10
mkNVT('EC-062', 'Medium',
`Consider the cell
$$\\mathrm{Pt_{(s)}|H_2(g, 1\\ atm)|H^+(aq, 1\\ M)\\|Fe^{3+}(aq), Fe^{2+}(aq)|Pt(s)}$$

When the potential of the cell is 0.712 V at 298 K, the ratio $[\\mathrm{Fe^{2+}}]/[\\mathrm{Fe^{3+}}]$ is $\\_\\_\\_\\_$ (Nearest integer)

Given: $\\mathrm{Fe^{3+} + e^- = Fe^{2+}}$, $E°_{\\mathrm{Fe^{3+},Fe^{2+}|Pt}} = 0.771\\ \\mathrm{V}$, $\\dfrac{2.303RT}{F} = 0.06\\ \\mathrm{V}$`,
{ integer_value: 10 },
`**Cell reaction:** $\\mathrm{\\frac{1}{2}H_2 + Fe^{3+} \\rightarrow H^+ + Fe^{2+}}$, $n = 1$

**Nernst equation:**
$$E_{\\text{cell}} = E°_{\\text{cell}} - \\frac{0.06}{1}\\log\\frac{[\\mathrm{H^+}][\\mathrm{Fe^{2+}}]}{P_{\\mathrm{H_2}}^{1/2}[\\mathrm{Fe^{3+}}]}$$

With $[\\mathrm{H^+}] = 1$, $P_{\\mathrm{H_2}} = 1$:
$$0.712 = 0.771 - 0.06\\log\\frac{[\\mathrm{Fe^{2+}}]}{[\\mathrm{Fe^{3+}}]}$$

$$0.06\\log\\frac{[\\mathrm{Fe^{2+}}]}{[\\mathrm{Fe^{3+}}]} = 0.059$$

$$\\log\\frac{[\\mathrm{Fe^{2+}}]}{[\\mathrm{Fe^{3+}}]} \\approx 1 \\Rightarrow \\frac{[\\mathrm{Fe^{2+}}]}{[\\mathrm{Fe^{3+}}]} = 10$$

**Answer: 10**`,
'tag_electrochem_6', src(2023, 'Jan', 30, 'Morning')),

// Q63 — log K for Pd2+ + 4Cl- ⇌ PdCl4^2-; Answer: 6
mkNVT('EC-063', 'Hard',
`The logarithm of equilibrium constant for the reaction $\\mathrm{Pd^{2+} + 4Cl^- \\rightleftharpoons PdCl_4^{2-}}$ is $\\_\\_\\_\\_$ (Nearest integer)

Given:
$$\\frac{2.303RT}{F} = 0.06\\ \\mathrm{V}$$
$$\\mathrm{Pd^{2+}_{(aq)} + 2e^- \\rightleftharpoons Pd(s)},\\quad E° = 0.83\\ \\mathrm{V}$$
$$\\mathrm{PdCl_4^{2-}(aq) + 2e^- \\rightleftharpoons Pd(s) + 4Cl^-(aq)},\\quad E° = 0.65\\ \\mathrm{V}$$`,
{ integer_value: 6 },
`**Target reaction:** $\\mathrm{Pd^{2+} + 4Cl^- \\rightarrow PdCl_4^{2-}}$

This is obtained by: Reaction 1 − Reaction 2:
- **Reaction 1 (forward):** $\\mathrm{Pd^{2+} + 2e^- \\rightarrow Pd}$, $E°_1 = 0.83\\ \\mathrm{V}$
- **Reaction 2 (reverse):** $\\mathrm{Pd + 4Cl^- \\rightarrow PdCl_4^{2-} + 2e^-}$, $E°_2 = -0.65\\ \\mathrm{V}$ (reversed)

**Net cell:** $\\mathrm{Pd^{2+} + 4Cl^- \\rightarrow PdCl_4^{2-}}$, $n = 2$

$$E°_{\\text{cell}} = 0.83 - 0.65 = 0.18\\ \\mathrm{V}$$

**Equilibrium constant:**
$$\\log K = \\frac{nE°_{\\text{cell}}}{0.06} = \\frac{2 \\times 0.18}{0.06} = \\frac{0.36}{0.06} = 6$$

**Answer: 6**`,
'tag_electrochem_6', src(2023, 'Jan', 31, 'Morning')),

// Q64 — pH for given MnO4- electrode potential; Answer: 3
mkNVT('EC-064', 'Hard',
`At what pH, given half cell $\\mathrm{MnO_4^-(0.1\\ M)|Mn^{2+}(0.001\\ M)}$ will have electrode potential of 1.282 V? (Nearest Integer)

Given: $E°_{\\mathrm{MnO_4^-/Mn^{2+}}} = 1.54\\ \\mathrm{V}$, $\\dfrac{2.303RT}{F} = 0.059\\ \\mathrm{V}$`,
{ integer_value: 3 },
`**Half-reaction:**
$$\\mathrm{MnO_4^- + 8H^+ + 5e^- \\rightarrow Mn^{2+} + 4H_2O}$$

**Nernst equation:**
$$E = E° - \\frac{0.059}{5}\\log\\frac{[\\mathrm{Mn^{2+}}]}{[\\mathrm{MnO_4^-}][\\mathrm{H^+}]^8}$$

$$1.282 = 1.54 - \\frac{0.059}{5}\\log\\frac{0.001}{0.1 \\times [\\mathrm{H^+}]^8}$$

$$\\frac{0.059}{5}\\log\\frac{0.001}{0.1 \\times [\\mathrm{H^+}]^8} = 1.54 - 1.282 = 0.258$$

$$\\log\\frac{0.001}{0.1 \\times [\\mathrm{H^+}]^8} = \\frac{0.258 \\times 5}{0.059} = \\frac{1.29}{0.059} = 21.86$$

$$\\log(0.01) - 8\\log[\\mathrm{H^+}] = 21.86$$

$$-2 + 8\\mathrm{pH} = 21.86$$

$$8\\mathrm{pH} = 23.86 \\Rightarrow \\mathrm{pH} = 2.98 \\approx 3$$

**Answer: pH = 3**`,
'tag_electrochem_6', src(2023, 'Feb', 1, 'Morning')),

// Q65 — pH of solution from Cu/H2 cell; Answer: 5
mkNVT('EC-065', 'Hard',
`The cell potential for the following cell $\\mathrm{Pt|H_2(g)|H^+(aq)\\|Cu^{2+}(0.01\\ M)|Cu(s)}$ is 0.576 V at 298 K. The pH of the solution is $\\_\\_\\_\\_$ (Nearest integer)

(Given: $E°_{\\mathrm{Cu^{2+}/Cu}} = 0.34\\ \\mathrm{V}$ and $\\dfrac{2.303RT}{F} = 0.06\\ \\mathrm{V}$)`,
{ integer_value: 5 },
`**Cell reaction:** $\\mathrm{H_2 + Cu^{2+} \\rightarrow 2H^+ + Cu}$, $n = 2$

**Nernst equation:**
$$E_{\\text{cell}} = E°_{\\text{cell}} - \\frac{0.06}{2}\\log\\frac{[\\mathrm{H^+}]^2}{P_{\\mathrm{H_2}}[\\mathrm{Cu^{2+}}]}$$

$E°_{\\text{cell}} = 0.34 - 0 = 0.34\\ \\mathrm{V}$

With $P_{\\mathrm{H_2}} = 1\\ \\mathrm{atm}$:
$$0.576 = 0.34 - 0.03\\log\\frac{[\\mathrm{H^+}]^2}{0.01}$$

$$0.03\\log\\frac{[\\mathrm{H^+}]^2}{0.01} = 0.34 - 0.576 = -0.236$$

$$\\log\\frac{[\\mathrm{H^+}]^2}{0.01} = \\frac{-0.236}{0.03} = -7.867$$

$$2\\log[\\mathrm{H^+}] - \\log(0.01) = -7.867$$

$$-2\\mathrm{pH} + 2 = -7.867$$

$$-2\\mathrm{pH} = -9.867 \\Rightarrow \\mathrm{pH} = 4.93 \\approx 5$$

**Answer: pH = 5**`,
'tag_electrochem_6', src(2022, 'Jun', 24, 'Morning')),

// Q66 — Industrial process giving H2 as byproduct; Answer: (2) NaOH
mkSCQ('EC-066', 'Easy',
`In the industrial production of which of the following, molecular hydrogen is obtained as a byproduct?`,
[
  '$\\mathrm{Na_2CO_3}$',
  'NaOH',
  'Na metal',
  '$\\mathrm{NaHCO_3}$'
],
'b',
`**Chlor-alkali process** (electrolysis of brine):
$$\\mathrm{2NaCl(aq) + 2H_2O \\xrightarrow{\\text{electrolysis}} 2NaOH(aq) + H_2(g) + Cl_2(g)}$$

NaOH is produced industrially by electrolysis of brine, and **$\\mathrm{H_2}$** is obtained as a byproduct at the cathode.

- $\\mathrm{Na_2CO_3}$ (Solvay process) — no $\\mathrm{H_2}$ byproduct
- Na metal (electrolysis of molten NaCl) — no $\\mathrm{H_2}$ (no water present)
- $\\mathrm{NaHCO_3}$ (Solvay process) — no $\\mathrm{H_2}$ byproduct

**Answer: Option (2) — NaOH**`,
'tag_electrochem_5', src(2022, 'Jun', 24, 'Evening')),

// Q67 — Standard electrode potential for Fe3+/Fe2+ vs I2/I- cell; Answer: 23 × 10^-2 V
mkNVT('EC-067', 'Hard',
`In a cell, the following reactions take place:
$$\\mathrm{Fe^{2+} \\rightarrow Fe^{3+} + e^-},\\quad E°_{\\mathrm{Fe^{3+}/Fe^{2+}}} = 0.77\\ \\mathrm{V}$$
$$\\mathrm{2I^- \\rightarrow I_2 + 2e^-},\\quad E°_{\\mathrm{I_2/I^-}} = 0.54\\ \\mathrm{V}$$

The standard electrode potential for the spontaneous reaction in the cell is $x \\times 10^{-2}\\ \\mathrm{V}$ at 298 K. The value of x is $\\_\\_\\_\\_$ (Nearest Integer)`,
{ integer_value: 23 },
`**Identify cathode and anode for spontaneous reaction:**

For a spontaneous cell, $E°_{\\text{cell}} > 0$, so cathode has higher $E°$.

$E°_{\\mathrm{Fe^{3+}/Fe^{2+}}} = 0.77\\ \\mathrm{V}$ > $E°_{\\mathrm{I_2/I^-}} = 0.54\\ \\mathrm{V}$

- **Cathode (reduction):** $\\mathrm{2Fe^{3+} + 2e^- \\rightarrow 2Fe^{2+}}$, $E° = 0.77\\ \\mathrm{V}$
- **Anode (oxidation):** $\\mathrm{2I^- \\rightarrow I_2 + 2e^-}$, $E°_{\\text{ox}} = -0.54\\ \\mathrm{V}$

$$E°_{\\text{cell}} = E°_{\\text{cathode}} - E°_{\\text{anode}} = 0.77 - 0.54 = 0.23\\ \\mathrm{V} = 23 \\times 10^{-2}\\ \\mathrm{V}$$

**Answer: x = 23**`,
'tag_electrochem_4', src(2022, 'Jun', 25, 'Morning')),

// Q68 — Time to deposit 0.3482 g Fe from Fe2(SO4)3; Answer: 20 min
mkNVT('EC-068', 'Hard',
`A solution of $\\mathrm{Fe_2(SO_4)_3}$ is electrolyzed for '$x$' min with a current of 1.5 A to deposit 0.3482 g of Fe. The value of x is $\\_\\_\\_\\_$ [nearest integer]

Given: $1\\ \\mathrm{F} = 96500\\ \\mathrm{C\\ mol^{-1}}$. Atomic mass of $\\mathrm{Fe} = 56\\ \\mathrm{g\\ mol^{-1}}$`,
{ integer_value: 20 },
`**Step 1 — Moles of Fe deposited:**
$$n_{\\mathrm{Fe}} = \\frac{0.3482}{56} = 6.218 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 2 — Cathode reaction (Fe³⁺ + 3e⁻ → Fe):**
$$n_{e^-} = 3 \\times 6.218 \\times 10^{-3} = 0.01865\\ \\mathrm{mol}$$

**Step 3 — Charge:**
$$Q = 0.01865 \\times 96500 = 1800\\ \\mathrm{C}$$

**Step 4 — Time:**
$$t = \\frac{Q}{I} = \\frac{1800}{1.5} = 1200\\ \\mathrm{s} = 20\\ \\mathrm{min}$$

**Answer: x = 20 min**`,
'tag_electrochem_5', src(2022, 'Jun', 25, 'Evening')),

// Q69 — ΔG for Cu + Sn2+ reaction; Answer: 983 × 10^-1 kJ/mol
mkNVT('EC-069', 'Hard',
`$\\mathrm{Cu(s) + Sn^{2+}(0.001\\ M) \\rightarrow Cu^{2+}(0.01\\ M) + Sn(s)}$

The Gibbs free energy change for the above reaction at 298 K is $x \\times 10^{-1}\\ \\mathrm{kJ\\ mol^{-1}}$. The value of x is $\\_\\_\\_\\_$ [nearest integer]

[Given: $E°_{\\mathrm{Cu^{2+}/Cu}} = 0.34\\ \\mathrm{V}$; $E°_{\\mathrm{Sn^{2+}/Sn}} = -0.14\\ \\mathrm{V}$; $F = 96500\\ \\mathrm{C\\ mol^{-1}}$]`,
{ integer_value: 983 },
`**Step 1 — Standard cell potential:**

Cu is anode (oxidised), Sn²⁺ is reduced at cathode.
$$E°_{\\text{cell}} = E°_{\\text{cathode}} - E°_{\\text{anode}} = -0.14 - 0.34 = -0.48\\ \\mathrm{V}$$

**Step 2 — Nernst equation ($n = 2$):**
$$E_{\\text{cell}} = -0.48 - \\frac{0.059}{2}\\log\\frac{[\\mathrm{Cu^{2+}}]}{[\\mathrm{Sn^{2+}}]}$$
$$= -0.48 - 0.0295\\log\\frac{0.01}{0.001}$$
$$= -0.48 - 0.0295 \\times 1 = -0.5095\\ \\mathrm{V}$$

**Step 3 — Gibbs free energy:**
$$\\Delta G = -nFE_{\\text{cell}} = -2 \\times 96500 \\times (-0.5095)$$
$$= 2 \\times 96500 \\times 0.5095 = 98334\\ \\mathrm{J\\ mol^{-1}}$$
$$= 98.33\\ \\mathrm{kJ\\ mol^{-1}} = 983.3 \\times 10^{-1}\\ \\mathrm{kJ\\ mol^{-1}} \\approx 983$$

**Answer: x = 983**`,
'tag_electrochem_6', src(2022, 'Jun', 26, 'Evening')),

// Q70 — ΔfG° for Ag+ + ½H2 → Ag + H+; Answer: 51 kJ/mol
mkNVT('EC-070', 'Hard',
`For the reaction taking place in the cell:
$$\\mathrm{Pt(s)|H_2(g)|H^+(aq)\\|Ag^+(aq)|Ag(s)}$$
$$E_{\\text{cell}} = +0.5332\\ \\mathrm{V}$$

The value of $\\Delta_f G°$ is $\\_\\_\\_\\_ \\mathrm{kJ\\ mol^{-1}}$. (in nearest integer)`,
{ integer_value: 51 },
`**Cell reaction:** $\\mathrm{\\frac{1}{2}H_2(g) + Ag^+(aq) \\rightarrow H^+(aq) + Ag(s)}$, $n = 1$

This is the formation reaction of $\\mathrm{Ag^+(aq)}$ reversed, so:

$$\\Delta_f G°[\\mathrm{Ag^+(aq)}] = -\\Delta G°_{\\text{cell reaction}}$$

$$\\Delta G°_{\\text{cell}} = -nFE°_{\\text{cell}} = -1 \\times 96500 \\times 0.5332 = -51454\\ \\mathrm{J\\ mol^{-1}}$$

The cell reaction is: $\\mathrm{\\frac{1}{2}H_2 + Ag^+ \\rightarrow H^+ + Ag}$

$\\Delta_f G°$ for this reaction = $-51.45\\ \\mathrm{kJ\\ mol^{-1}}$

But $\\Delta_f G°(\\mathrm{Ag^+}) = -\\Delta G°_{\\text{rxn}} = +51.45 \\approx 51\\ \\mathrm{kJ\\ mol^{-1}}$

**Answer: 51 kJ/mol**`,
'tag_electrochem_6', src(2022, 'Jun', 27, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-061 to EC-070)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
