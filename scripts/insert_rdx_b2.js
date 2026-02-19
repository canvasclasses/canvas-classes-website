const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_redox';
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

// Q11 — Species that does NOT show disproportionation; Answer: (1) BrO4-
mkSCQ('RDX-011', 'Medium',
`The species given below that does **NOT** show disproportionation reaction is:`,
[
  `$\\mathrm{BrO_4^{-}}$`,
  `$\\mathrm{BrO^{-}}$`,
  `$\\mathrm{BrO_2^{-}}$`,
  `$\\mathrm{BrO_3^{-}}$`
],
'a',
`**Disproportionation** requires the element to have an intermediate oxidation state — it must be able to both increase and decrease its oxidation state.

**Step 1 — Oxidation states of Br in each species:**

| Species | Oxidation state of Br |
|---|---|
| $\\mathrm{BrO_4^{-}}$ | $x + 4(-2) = -1 \\Rightarrow x = +7$ (highest possible) |
| $\\mathrm{BrO^{-}}$ | $x + (-2) = -1 \\Rightarrow x = +1$ |
| $\\mathrm{BrO_2^{-}}$ | $x + 2(-2) = -1 \\Rightarrow x = +3$ |
| $\\mathrm{BrO_3^{-}}$ | $x + 3(-2) = -1 \\Rightarrow x = +5$ |

**Step 2 — Identify which cannot disproportionate:**

$\\mathrm{BrO_4^{-}}$ has Br in the **highest oxidation state (+7)**. It cannot be further oxidised, so it cannot undergo disproportionation (which requires simultaneous oxidation AND reduction of the same element).

$\\mathrm{BrO^{-}}$, $\\mathrm{BrO_2^{-}}$, and $\\mathrm{BrO_3^{-}}$ all have intermediate oxidation states and can disproportionate.

**Answer: Option (1) — $\\mathrm{BrO_4^{-}}$**`,
'tag_redox_4', src(2021, 'Jul', 20, 'Morning')),

// Q12 — Redox reaction among the following; Answer: (4) combination of N2 with O2
mkSCQ('RDX-012', 'Easy',
`The redox reaction among the following is`,
[
  'formation of ozone from atmospheric oxygen in the presence of sunlight',
  `reaction of $[\\mathrm{Co(H_2O)_6}]\\mathrm{Cl_3}$ with $\\mathrm{AgNO_3}$`,
  `reaction of $\\mathrm{H_2SO_4}$ with NaOH`,
  'combination of dinitrogen with dioxygen at 2000 K'
],
'd',
`**Redox reaction** = reaction involving change in oxidation states.

**Step 1 — Analyse each option:**

**(1) Formation of ozone from O₂:**
$$\\mathrm{3O_2 \\xrightarrow{h\\nu} 2O_3}$$
O is $0$ in $\\mathrm{O_2}$ and $0$ in $\\mathrm{O_3}$ (average). No change in oxidation state → **Not redox** ✗

**(2) $[\\mathrm{Co(H_2O)_6}]\\mathrm{Cl_3}$ with $\\mathrm{AgNO_3}$:**
$$[\\mathrm{Co(H_2O)_6}]\\mathrm{Cl_3} + 3\\mathrm{AgNO_3} \\rightarrow 3\\mathrm{AgCl} + [\\mathrm{Co(H_2O)_6}](\\mathrm{NO_3})_3$$
This is a double displacement/precipitation reaction. No change in oxidation states → **Not redox** ✗

**(3) $\\mathrm{H_2SO_4}$ with NaOH:**
$$\\mathrm{H_2SO_4 + 2NaOH \\rightarrow Na_2SO_4 + 2H_2O}$$
Acid-base neutralisation. No change in oxidation states → **Not redox** ✗

**(4) $\\mathrm{N_2 + O_2 \\rightarrow 2NO}$ at 2000 K:**
- N: $0 \\rightarrow +2$ (oxidised)
- O: $0 \\rightarrow -2$ (reduced)
Change in oxidation states → **Redox reaction ✓**

**Answer: Option (4)**`,
'tag_redox_4', src(2020, 'Jan', 7, 'Evening')),

// Q13 — Example of disproportionation; Answer: (3) 2CuBr → CuBr2 + Cu
mkSCQ('RDX-013', 'Easy',
`An example of a disproportionation reaction is`,
[
  `$\\mathrm{2KMnO_4 \\rightarrow K_2MnO_4 + MnO_2 + O_2}$`,
  `$\\mathrm{2MnO_4^{-} + 10I^{-} + 16H^{+} \\rightarrow 2Mn^{2+} + 5I_2 + 8H_2O}$`,
  `$\\mathrm{2CuBr \\rightarrow CuBr_2 + Cu}$`,
  `$\\mathrm{2NaBr + Cl_2 \\rightarrow 2NaCl + Br_2}$`
],
'c',
`**Disproportionation** = same element simultaneously oxidised and reduced.

**Step 1 — Check option (3): $\\mathrm{2CuBr \\rightarrow CuBr_2 + Cu}$**
- Cu in $\\mathrm{CuBr}$: $+1$ (reactant)
- Cu in $\\mathrm{CuBr_2}$: $+2$ → **oxidised**
- Cu in $\\mathrm{Cu}$: $0$ → **reduced**
- Same element (Cu) both oxidised and reduced → **Disproportionation ✓**

**Step 2 — Eliminate others:**

**(1) $\\mathrm{2KMnO_4 \\rightarrow K_2MnO_4 + MnO_2 + O_2}$:**
- Mn: $+7 \\rightarrow +6$ (reduced) and $+7 \\rightarrow +4$ (reduced)
- O: $-2 \\rightarrow 0$ (oxidised in $\\mathrm{O_2}$)
Different elements change → this is a decomposition/redox but Mn only reduces; O is oxidised. Not a pure disproportionation.

**(2)** Two different elements (Mn reduced, I oxidised) → not disproportionation ✗

**(4)** $\\mathrm{Br^-}$ oxidised, $\\mathrm{Cl_2}$ reduced — two different elements → displacement, not disproportionation ✗

**Answer: Option (3) — $\\mathrm{2CuBr \\rightarrow CuBr_2 + Cu}$**`,
'tag_redox_4', src(2019, 'Apr', 12, 'Morning')),

// Q14 — Balance 2IO3- + xI- + 12H+ → 6I2 + 6H2O; Answer: (3) x = 10
mkSCQ('RDX-014', 'Medium',
`$\\mathrm{2IO_3^{-} + xI^{-} + 12H^{+} \\rightarrow 6I_2 + 6H_2O}$. What is the value of $x$?`,
[
  '2',
  '12',
  '10',
  '6'
],
'c',
`**Step 1 — Balance by atom count and charge:**

**Iodine balance:**
- Left: $2$ (from $\\mathrm{IO_3^-}$) $+ x$ (from $\\mathrm{I^-}$)
- Right: $6 \\times 2 = 12$ I atoms (from $\\mathrm{6I_2}$)
$$2 + x = 12 \\Rightarrow x = 10$$

**Step 2 — Verify with charge balance:**
- Left: $2(-1) + 10(-1) + 12(+1) = -2 - 10 + 12 = 0$
- Right: $0$ (neutral molecules)
✓ Charge balanced

**Step 3 — Verify with oxidation states:**
- I in $\\mathrm{IO_3^-}$: $+5$; in $\\mathrm{I^-}$: $-1$; in $\\mathrm{I_2}$: $0$
- Reduction: $\\mathrm{IO_3^-}$: $+5 \\rightarrow 0$ (gain of 5e⁻ per I, total $2 \\times 5 = 10$ e⁻ gained)
- Oxidation: $\\mathrm{I^-}$: $-1 \\rightarrow 0$ (loss of 1e⁻ per I, total $x \\times 1 = x$ e⁻ lost)
- For balance: $x = 10$ ✓

**Answer: Option (3) — $x = 10$**`,
'tag_redox_1', src(2023, 'Apr', 8, 'Morning')),

// Q15 — Normality of H2SO4 after mixing; Answer: (1) 1 × 10^-1 N
mkNVT('RDX-015', 'Medium',
`The normality of $\\mathrm{H_2SO_4}$ in the solution obtained on mixing 100 mL of $0.1\\ \\mathrm{M}\\ \\mathrm{H_2SO_4}$ with 50 mL of 0.1 M NaOH is $\\_\\_\\_\\_ \\times 10^{-1}\\ \\mathrm{N}$.`,
{ integer_value: 1 },
`**Step 1 — Equivalents of $\\mathrm{H_2SO_4}$:**
$\\mathrm{H_2SO_4}$ is dibasic (n-factor = 2):
$$\\text{meq} = M \\times n\\text{-factor} \\times V = 0.1 \\times 2 \\times 100 = 20\\ \\text{meq}$$

**Step 2 — Equivalents of NaOH:**
NaOH is monoacidic (n-factor = 1):
$$\\text{meq} = 0.1 \\times 1 \\times 50 = 5\\ \\text{meq}$$

**Step 3 — After neutralisation:**
Remaining $\\mathrm{H_2SO_4}$ equivalents = $20 - 5 = 15\\ \\text{meq}$

**Step 4 — Total volume:**
$$V_{total} = 100 + 50 = 150\\ \\text{mL} = 0.15\\ \\text{L}$$

**Step 5 — Normality of resulting solution:**
$$N = \\frac{\\text{meq}}{V(\\text{L})} = \\frac{15}{150} = 0.1\\ \\mathrm{N} = 1 \\times 10^{-1}\\ \\mathrm{N}$$

**Answer: 1**`,
'tag_redox_3', src(2023, 'Apr', 8, 'Evening')),

// Q16 — Assertion about redox vs acid-base indicators; Answer: (2) Both incorrect
mkSCQ('RDX-016', 'Easy',
`Given below are two statements:

**Statement I:** In redox titration, the indicators used are sensitive to change in pH of the solution.

**Statement II:** In acid-base titration, the indicators used are sensitive to change in oxidation potential.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Statement I is correct but Statement II is incorrect',
  'Both Statement I and Statement II are incorrect',
  'Statement I is incorrect but Statement II is correct',
  'Both Statement I and Statement II are correct'
],
'b',
`**Step 1 — Evaluate Statement I:**
In **redox titrations**, indicators (e.g., ferroin, diphenylamine) are sensitive to changes in **oxidation potential (redox potential)**, NOT pH.
**Statement I is INCORRECT** ✗

**Step 2 — Evaluate Statement II:**
In **acid-base titrations**, indicators (e.g., phenolphthalein, methyl orange) are sensitive to changes in **pH**, NOT oxidation potential.
**Statement II is INCORRECT** ✗

**Conclusion:** Both statements have the descriptions swapped — each describes the wrong type of titration.

**Answer: Option (2) — Both Statement I and Statement II are incorrect**`,
'tag_redox_3', src(2023, 'Apr', 8, 'Evening')),

// Q17 — Electrons gained by MnO4- in alkaline medium; Answer: 3
mkNVT('RDX-017', 'Easy',
`In alkaline medium, the reduction of permanganate anion involves a gain of $\\_\\_\\_\\_$ electrons.`,
{ integer_value: 3 },
`**Step 1 — Half-reaction of $\\mathrm{MnO_4^-}$ in alkaline medium:**

In alkaline medium, $\\mathrm{MnO_4^-}$ is reduced to $\\mathrm{MnO_2}$:
$$\\mathrm{MnO_4^{-} + 2H_2O + 3e^{-} \\rightarrow MnO_2 + 4OH^{-}}$$

**Step 2 — Verify oxidation state change:**
- Mn in $\\mathrm{MnO_4^-}$: $+7$
- Mn in $\\mathrm{MnO_2}$: $+4$
- Change: $+7 \\rightarrow +4$ = gain of **3 electrons** ✓

**Note:** Compare with other media:
- Acidic medium: $\\mathrm{MnO_4^- \\rightarrow Mn^{2+}}$ (gain of 5e⁻)
- Neutral medium: $\\mathrm{MnO_4^- \\rightarrow MnO_2}$ (gain of 3e⁻)
- Alkaline medium: $\\mathrm{MnO_4^- \\rightarrow MnO_4^{2-}}$ (gain of 1e⁻) — but the standard alkaline product is $\\mathrm{MnO_2}$

**Answer: 3**`,
'tag_redox_3', src(2023, 'Apr', 15, 'Morning')),

// Q18 — Total change in OS of Mn in KMnO4 + KI in acidic medium; Answer: 5
mkNVT('RDX-018', 'Medium',
`The total change in the oxidation state of manganese involved in the reaction of $\\mathrm{KMnO_4}$ and potassium iodide in the acidic medium is $\\_\\_\\_\\_$.`,
{ integer_value: 5 },
`**Step 1 — Reaction of $\\mathrm{KMnO_4}$ with KI in acidic medium:**

$$\\mathrm{2KMnO_4 + 10KI + 8H_2SO_4 \\rightarrow 2MnSO_4 + 5I_2 + 6K_2SO_4 + 8H_2O}$$

**Step 2 — Oxidation state of Mn:**
- In $\\mathrm{KMnO_4}$: Mn = $+7$
- In $\\mathrm{MnSO_4}$: Mn = $+2$

**Step 3 — Change per Mn atom:**
$$\\Delta = 7 - 2 = 5$$

In acidic medium, $\\mathrm{MnO_4^-}$ is reduced to $\\mathrm{Mn^{2+}}$, involving a gain of **5 electrons** per Mn atom.

**Answer: 5**`,
'tag_redox_3', src(2023, 'Apr', 15, 'Morning')),

// Q19 — Unreacted HCl molecules after mixing; Answer: 226 (× 10^21)
mkNVT('RDX-019', 'Hard',
`250 mL of 0.5 M NaOH was added to 500 mL of 1 M HCl. The number of unreacted HCl molecules in the solution after the complete reaction is $p \\times 10^{21}$. Find out $p$ (Nearest integer).

$(\\mathrm{N_A} = 6.022 \\times 10^{23})$`,
{ integer_value: 226 },
`**Step 1 — Moles of each reactant:**
$$n_{\\mathrm{NaOH}} = 0.5\\ \\mathrm{M} \\times 0.250\\ \\mathrm{L} = 0.125\\ \\mathrm{mol}$$
$$n_{\\mathrm{HCl}} = 1\\ \\mathrm{M} \\times 0.500\\ \\mathrm{L} = 0.500\\ \\mathrm{mol}$$

**Step 2 — Neutralisation reaction:**
$$\\mathrm{NaOH + HCl \\rightarrow NaCl + H_2O}$$
NaOH is limiting reagent.

HCl consumed = 0.125 mol

**Step 3 — Unreacted HCl:**
$$n_{\\mathrm{HCl\\ unreacted}} = 0.500 - 0.125 = 0.375\\ \\mathrm{mol}$$

**Step 4 — Number of molecules:**
$$N = 0.375 \\times 6.022 \\times 10^{23} = 2.258 \\times 10^{23} = 225.8 \\times 10^{21} \\approx 226 \\times 10^{21}$$

$$p = 226$$

**Answer: 226**`,
'tag_redox_3', src(2023, 'Apr', 15, 'Morning')),

// Q20 — Molarity of Fe2+ solution; Answer: 24 (× 10^-2 M)
mkNVT('RDX-020', 'Hard',
`15 mL of aqueous solution of $\\mathrm{Fe^{2+}}$ in acidic medium completely reacted with 20 mL of $0.03\\ \\mathrm{M}$ aqueous $\\mathrm{Cr_2O_7^{2-}}$. The molarity of the $\\mathrm{Fe^{2+}}$ solution is $\\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{M}$ (Round off to the Nearest Integer).`,
{ integer_value: 24 },
`**Step 1 — Balanced reaction:**
$$\\mathrm{Cr_2O_7^{2-} + 6Fe^{2+} + 14H^{+} \\rightarrow 2Cr^{3+} + 6Fe^{3+} + 7H_2O}$$

**Step 2 — Moles of $\\mathrm{Cr_2O_7^{2-}}$:**
$$n_{\\mathrm{Cr_2O_7^{2-}}} = 0.03\\ \\mathrm{M} \\times 20 \\times 10^{-3}\\ \\mathrm{L} = 6 \\times 10^{-4}\\ \\mathrm{mol}$$

**Step 3 — Moles of $\\mathrm{Fe^{2+}}$ (stoichiometry 1:6):**
$$n_{\\mathrm{Fe^{2+}}} = 6 \\times 6 \\times 10^{-4} = 3.6 \\times 10^{-3}\\ \\mathrm{mol}$$

**Step 4 — Molarity of $\\mathrm{Fe^{2+}}$:**
$$M = \\frac{3.6 \\times 10^{-3}}{15 \\times 10^{-3}} = 0.24\\ \\mathrm{M} = 24 \\times 10^{-2}\\ \\mathrm{M}$$

**Answer: 24**`,
'tag_redox_3', src(2023, 'Apr', 15, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (RDX-011 to RDX-020)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
