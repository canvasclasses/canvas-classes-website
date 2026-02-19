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

// Q31 — Cu2+ salt reacts with KI; Answer: (1) Cu2I2
mkSCQ('RDX-031', 'Easy',
`$\\mathrm{Cu^{2+}}$ salt reacts with potassium iodide to give`,
[
  `$\\mathrm{Cu_2I_2}$`,
  `$\\mathrm{Cu_2I_3}$`,
  `$\\mathrm{CuI}$`,
  `$\\mathrm{Cu(I_3)_2}$`
],
'a',
`**Step 1 — Reaction of $\\mathrm{Cu^{2+}}$ with $\\mathrm{KI}$:**

$$\\mathrm{2Cu^{2+} + 4I^{-} \\rightarrow Cu_2I_2 + I_2}$$

Or equivalently:
$$\\mathrm{2CuSO_4 + 4KI \\rightarrow Cu_2I_2 + I_2 + 2K_2SO_4}$$

**Step 2 — Analyse the reaction:**
- $\\mathrm{Cu^{2+}}$ is reduced to $\\mathrm{Cu^+}$ (gain of 1e⁻ per Cu)
- $\\mathrm{I^-}$ is oxidised to $\\mathrm{I_2}$ (loss of 1e⁻ per I)
- $\\mathrm{Cu^+}$ combines with $\\mathrm{I^-}$ to form $\\mathrm{Cu_2I_2}$ (cuprous iodide)

**Step 3 — Product identification:**
$\\mathrm{Cu_2I_2}$ = cuprous iodide (white precipitate)
$\\mathrm{I_2}$ = iodine (brown, detected by starch indicator turning blue)

This reaction is the basis of the iodometric determination of $\\mathrm{Cu^{2+}}$.

**Answer: Option (1) — $\\mathrm{Cu_2I_2}$**`,
'tag_redox_2', src(2021, 'Jul', 20, 'Evening')),

// Q32 — Compound that cannot act as both oxidising and reducing agent; Answer: (1) H3PO4
mkSCQ('RDX-032', 'Easy',
`The compound that cannot act both as oxidizing and reducing agent is`,
[
  `$\\mathrm{H_3PO_4}$`,
  `$\\mathrm{HNO_2}$`,
  `$\\mathrm{H_2SO_3}$`,
  `$\\mathrm{H_2O_2}$`
],
'a',
`**Step 1 — For a compound to act as both oxidising and reducing agent, the central atom must be in an intermediate oxidation state.**

**Step 2 — Check each compound:**

| Compound | Element | Oxidation State | Can be oxidised? | Can be reduced? |
|---|---|---|---|---|
| $\\mathrm{H_3PO_4}$ | P | $+5$ (maximum) | No (already max) | Yes | 
| $\\mathrm{HNO_2}$ | N | $+3$ (intermediate) | Yes → $+5$ | Yes → $-3$ |
| $\\mathrm{H_2SO_3}$ | S | $+4$ (intermediate) | Yes → $+6$ | Yes → $-2$ |
| $\\mathrm{H_2O_2}$ | O | $-1$ (intermediate) | Yes → $0$ | Yes → $-2$ |

**Step 3 — Conclusion:**
$\\mathrm{H_3PO_4}$: P is at its **maximum oxidation state (+5)**. It cannot be further oxidised, so it cannot act as a reducing agent. It can only act as an oxidising agent.

$\\mathrm{HNO_2}$, $\\mathrm{H_2SO_3}$, and $\\mathrm{H_2O_2}$ all have elements in intermediate oxidation states → can act as both.

**Answer: Option (1) — $\\mathrm{H_3PO_4}$**`,
'tag_redox_2', src(2020, 'Jan', 9, 'Morning')),

// Q33 — Strongest oxidising agent from E° values; Answer: (2) S2O8^2-
mkSCQ('RDX-033', 'Medium',
`Given that,

$$E^\\circ_{\\mathrm{O_2/H_2O}} = +1.23\\ \\mathrm{V};\\quad E^\\circ_{\\mathrm{S_2O_8^{2-}/SO_4^{2-}}} = +2.05\\ \\mathrm{V}$$
$$E^\\circ_{\\mathrm{Br_2/Br^-}} = +1.09\\ \\mathrm{V};\\quad E^\\circ_{\\mathrm{Au^{3+}/Au}} = +1.4\\ \\mathrm{V}$$

The strongest oxidizing agent is`,
[
  `$\\mathrm{O_2}$`,
  `$\\mathrm{S_2O_8^{2-}}$`,
  `$\\mathrm{Br_2}$`,
  `$\\mathrm{Au^{3+}}$`
],
'b',
`**Principle:** The species with the **highest standard reduction potential ($E^\\circ$)** is the strongest oxidising agent (most easily reduced).

**Step 1 — Compare $E^\\circ$ values:**

| Species | $E^\\circ$ (V) |
|---|---|
| $\\mathrm{O_2}$ | $+1.23$ |
| $\\mathrm{S_2O_8^{2-}}$ | $+2.05$ |
| $\\mathrm{Br_2}$ | $+1.09$ |
| $\\mathrm{Au^{3+}}$ | $+1.40$ |

**Step 2 — Identify the highest $E^\\circ$:**
$\\mathrm{S_2O_8^{2-}}$ has the highest $E^\\circ = +2.05\\ \\mathrm{V}$ → strongest tendency to be reduced → **strongest oxidising agent**

**Answer: Option (2) — $\\mathrm{S_2O_8^{2-}}$**`,
'tag_redox_2', src(2019, 'Apr', 8, 'Morning')),

// Q34 — Oxidizing power order from E° values; Answer: (2) Bi3+ < Ce4+ < Pb4+ < Co3+
mkSCQ('RDX-034', 'Medium',
`Given:

$$\\mathrm{Co^{3+} + e^{-} \\rightarrow Co^{2+}};\\quad E^\\circ = +1.81\\ \\mathrm{V}$$
$$\\mathrm{Pb^{4+} + 2e^{-} \\rightarrow Pb^{2+}};\\quad E^\\circ = +1.67\\ \\mathrm{V}$$
$$\\mathrm{Ce^{4+} + e^{-} \\rightarrow Ce^{3+}};\\quad E^\\circ = +1.61\\ \\mathrm{V}$$
$$\\mathrm{Bi^{3+} + 3e^{-} \\rightarrow Bi};\\quad E^\\circ = +0.20\\ \\mathrm{V}$$

Oxidizing power of the species will increase in the order:`,
[
  `$\\mathrm{Co^{3+} < Ce^{4+} < Bi^{3+} < Pb^{4+}}$`,
  `$\\mathrm{Bi^{3+} < Ce^{4+} < Pb^{4+} < Co^{3+}}$`,
  `$\\mathrm{Co^{3+} < Pb^{4+} < Ce^{3+} < Bi^{4+}}$`,
  `$\\mathrm{Ce^{4+} < Pb^{4+} < Bi^{3+} < Co^{3+}}$`
],
'b',
`**Principle:** Higher $E^\\circ$ (reduction potential) → stronger oxidising agent.

**Step 1 — Arrange in increasing order of $E^\\circ$:**

| Species | $E^\\circ$ (V) | Oxidising power |
|---|---|---|
| $\\mathrm{Bi^{3+}}$ | $+0.20$ | Weakest |
| $\\mathrm{Ce^{4+}}$ | $+1.61$ | ↑ |
| $\\mathrm{Pb^{4+}}$ | $+1.67$ | ↑ |
| $\\mathrm{Co^{3+}}$ | $+1.81$ | Strongest |

**Step 2 — Increasing order of oxidising power:**
$$\\mathrm{Bi^{3+} < Ce^{4+} < Pb^{4+} < Co^{3+}}$$

**Answer: Option (2)**`,
'tag_redox_2', src(2019, 'Apr', 12, 'Morning')),

// Q35 — Halogens that can undergo disproportionation; Answer: (4) Cl2, Br2 and I2
mkSCQ('RDX-035', 'Medium',
`Among the following halogens $\\mathrm{F_2}$, $\\mathrm{Cl_2}$, $\\mathrm{Br_2}$ and $\\mathrm{I_2}$. Which can undergo disproportionation reactions?`,
[
  `$\\mathrm{F_2}$, $\\mathrm{Cl_2}$ and $\\mathrm{Br_2}$`,
  `$\\mathrm{F_2}$ and $\\mathrm{Cl_2}$`,
  `Only $\\mathrm{I_2}$`,
  `$\\mathrm{Cl_2}$, $\\mathrm{Br_2}$ and $\\mathrm{I_2}$`
],
'd',
`**Disproportionation** requires the element to simultaneously increase and decrease its oxidation state. For halogens (X₂, OS = 0), they must be able to form both $\\mathrm{X^-}$ (OS = $-1$) and $\\mathrm{XO^-}$ or higher oxyanions (OS > 0).

**Step 1 — $\\mathrm{F_2}$:**
Fluorine is the most electronegative element and has **no positive oxidation states**. It cannot be oxidised to positive states → **cannot disproportionate** ✗

Example: $\\mathrm{F_2 + H_2O \\rightarrow HF + HOF}$ — but this is not disproportionation (F stays at 0 in HOF and goes to -1 in HF, but HOF has O at -1, not F at +1).

**Step 2 — $\\mathrm{Cl_2}$, $\\mathrm{Br_2}$, $\\mathrm{I_2}$:**
These halogens can form positive oxidation states (in oxyanions):
$$\\mathrm{Cl_2 + 2OH^- \\rightarrow Cl^- + ClO^- + H_2O}$$
Cl: $0 \\rightarrow -1$ (reduced) and $0 \\rightarrow +1$ (oxidised) → **Disproportionation ✓**

Similarly $\\mathrm{Br_2}$ and $\\mathrm{I_2}$ can disproportionate in alkaline conditions.

**Answer: Option (4) — $\\mathrm{Cl_2}$, $\\mathrm{Br_2}$ and $\\mathrm{I_2}$**`,
'tag_redox_4', src(2024, 'Apr', 8, 'Morning')),

// Q36 — Total species that can undergo disproportionation; Answer: 6
mkNVT('RDX-036', 'Medium',
`Total number of species from the following which can undergo disproportionation reaction ____

$\\mathrm{H_2O_2,\\ ClO_3^{-},\\ P_4,\\ Cl_2,\\ Ag,\\ Cu^{+1},\\ F_2,\\ NO_2,\\ K^{+}}$`,
{ integer_value: 6 },
`**Disproportionation** requires the element to be in an intermediate oxidation state (can be both oxidised and reduced).

**Step 1 — Check each species:**

| Species | Element | OS | Can disproportionate? | Reason |
|---|---|---|---|---|
| $\\mathrm{H_2O_2}$ | O | $-1$ (intermediate) | ✓ | $\\mathrm{2H_2O_2 \\rightarrow 2H_2O + O_2}$ (O: $-1 \\rightarrow -2$ and $0$) |
| $\\mathrm{ClO_3^{-}}$ | Cl | $+5$ (intermediate) | ✓ | Can form $\\mathrm{Cl^-}$ and $\\mathrm{ClO_4^-}$ |
| $\\mathrm{P_4}$ | P | $0$ (intermediate) | ✓ | $\\mathrm{P_4 + 3OH^- \\rightarrow PH_3 + H_2PO_2^-}$ |
| $\\mathrm{Cl_2}$ | Cl | $0$ (intermediate) | ✓ | $\\mathrm{Cl_2 + 2OH^- \\rightarrow Cl^- + ClO^- + H_2O}$ |
| $\\mathrm{Ag}$ | Ag | $0$ | ✗ | Ag has no stable positive intermediate state that disproportionates |
| $\\mathrm{Cu^+}$ | Cu | $+1$ (intermediate) | ✓ | $\\mathrm{2Cu^+ \\rightarrow Cu^{2+} + Cu}$ |
| $\\mathrm{F_2}$ | F | $0$ | ✗ | F has no positive OS; cannot be oxidised |
| $\\mathrm{NO_2}$ | N | $+4$ (intermediate) | ✓ | $\\mathrm{2NO_2 + H_2O \\rightarrow HNO_3 + HNO_2}$ |
| $\\mathrm{K^+}$ | K | $+1$ (highest for K) | ✗ | Cannot be further oxidised |

**Step 2 — Count:**
$\\mathrm{H_2O_2}$, $\\mathrm{ClO_3^-}$, $\\mathrm{P_4}$, $\\mathrm{Cl_2}$, $\\mathrm{Cu^+}$, $\\mathrm{NO_2}$ = **6 species**

**Answer: 6**`,
'tag_redox_4', src(2024, 'Jan', 30, 'Evening')),

// Q37 — Assertion-Reason about S8 and ClO4-; Answer: (1) Statement I correct, II incorrect
mkSCQ('RDX-037', 'Medium',
`Given below are two statements:

**Statement I:** $\\mathrm{S_8}$ solid undergoes disproportionation reaction under alkaline conditions to form $\\mathrm{S^{2-}}$ and $\\mathrm{S_2O_3^{2-}}$.

**Statement II:** $\\mathrm{ClO_4^{-}}$ can undergo disproportionation reaction under acidic condition.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Statement I is correct but Statement II is incorrect.',
  'Statement I is incorrect but Statement II is correct',
  'Both Statement I and Statement II are incorrect',
  'Both Statement I and Statement II are correct'
],
'a',
`**Step 1 — Evaluate Statement I:**

$\\mathrm{S_8}$ in alkaline medium:
$$\\mathrm{S_8 + 12OH^- \\rightarrow 4S^{2-} + 2S_2O_3^{2-} + 6H_2O}$$

- S in $\\mathrm{S_8}$: OS = $0$
- S in $\\mathrm{S^{2-}}$: OS = $-2$ (reduced)
- S in $\\mathrm{S_2O_3^{2-}}$: average OS = $+2$ (oxidised)

Same element (S) simultaneously oxidised and reduced → **Disproportionation ✓**
**Statement I is CORRECT** ✓

**Step 2 — Evaluate Statement II:**

$\\mathrm{ClO_4^-}$ (perchlorate): Cl is in its **highest oxidation state (+7)**. It cannot be further oxidised → **cannot undergo disproportionation**.

$\\mathrm{ClO_4^-}$ can only act as an oxidising agent (be reduced), not disproportionate.
**Statement II is INCORRECT** ✗

**Answer: Option (1) — Statement I correct, Statement II incorrect**`,
'tag_redox_4', src(2022, 'Jun', 26, 'Evening')),

// Q38 — Which reactions are disproportionation; Answer: (1) (1),(2)
mkSCQ('RDX-038', 'Medium',
`Which of the following reactions are disproportionation reactions?

**(1)** $\\mathrm{Cu^{+} \\rightarrow Cu^{2+} + Cu}$

**(2)** $\\mathrm{3MnO_4^{2-} + 4H^{+} \\rightarrow 2MnO_4^{-} + MnO_2 + 2H_2O}$

**(3)** $\\mathrm{2KMnO_4 \\rightarrow K_2MnO_4 + MnO_2 + O_2}$

**(4)** $\\mathrm{2MnO_4^{-} + 3Mn^{2+} + 2H_2O \\rightarrow 5MnO_2 + 4H^{+}}$

Choose the correct answer from the options given below:`,
[
  '(1), (2)',
  '(2), (3), (4)',
  '(1), (2), (4)',
  '(1), (4)'
],
'a',
`**Step 1 — Check reaction (1): $\\mathrm{2Cu^{+} \\rightarrow Cu^{2+} + Cu}$**
- Cu: $+1 \\rightarrow +2$ (oxidised) and $+1 \\rightarrow 0$ (reduced)
- Same element simultaneously oxidised and reduced → **Disproportionation ✓**

**Step 2 — Check reaction (2): $\\mathrm{3MnO_4^{2-} + 4H^{+} \\rightarrow 2MnO_4^{-} + MnO_2 + 2H_2O}$**
- Mn in $\\mathrm{MnO_4^{2-}}$: $+6$
- Mn in $\\mathrm{MnO_4^{-}}$: $+7$ (oxidised)
- Mn in $\\mathrm{MnO_2}$: $+4$ (reduced)
- Same element (Mn) simultaneously oxidised and reduced → **Disproportionation ✓**

**Step 3 — Check reaction (3): $\\mathrm{2KMnO_4 \\rightarrow K_2MnO_4 + MnO_2 + O_2}$**
- Mn in $\\mathrm{KMnO_4}$: $+7$
- Mn in $\\mathrm{K_2MnO_4}$: $+6$ (reduced)
- Mn in $\\mathrm{MnO_2}$: $+4$ (reduced)
- O in $\\mathrm{KMnO_4}$: $-2$; O in $\\mathrm{O_2}$: $0$ (oxidised)
- Different elements change: Mn is only reduced, O is oxidised → **NOT disproportionation** ✗ (this is a decomposition redox)

**Step 4 — Check reaction (4): $\\mathrm{2MnO_4^{-} + 3Mn^{2+} + 2H_2O \\rightarrow 5MnO_2 + 4H^{+}}$**
- Mn in $\\mathrm{MnO_4^-}$: $+7$ (reduced to $+4$)
- Mn in $\\mathrm{Mn^{2+}}$: $+2$ (oxidised to $+4$)
- This is **comproportionation** (opposite of disproportionation) → **NOT disproportionation** ✗

**Answer: Option (1) — (1) and (2)**`,
'tag_redox_4', src(2024, 'Feb', 1, 'Morning')),

// Q39 — Set where all species show disproportionation; Answer: (2)
mkSCQ('RDX-039', 'Easy',
`In which one of the following sets all species show disproportionation reaction?`,
[
  `$\\mathrm{ClO_4^{-}}$, $\\mathrm{MnO_4^{-}}$, $\\mathrm{ClO_2^{-}}$ and $\\mathrm{F_2}$`,
  `$\\mathrm{MnO_4^{2-}}$, $\\mathrm{ClO_2^{-}}$, $\\mathrm{Cl_2}$ and $\\mathrm{Mn^{3+}}$`,
  `$\\mathrm{Cr_2O_7^{2-}}$, $\\mathrm{MnO_4^{-}}$, $\\mathrm{ClO_2^{-}}$ and $\\mathrm{Cl_2}$`,
  `$\\mathrm{ClO_2^{-}}$, $\\mathrm{F_2}$, $\\mathrm{MnO_4^{-}}$ and $\\mathrm{Cr_2O_7^{2-}}$`
],
'b',
`**Check each set for all species being capable of disproportionation:**

**Set (1): $\\mathrm{ClO_4^-}$, $\\mathrm{MnO_4^-}$, $\\mathrm{ClO_2^-}$, $\\mathrm{F_2}$**
- $\\mathrm{ClO_4^-}$: Cl = $+7$ (max) → cannot disproportionate ✗
- $\\mathrm{MnO_4^-}$: Mn = $+7$ (max) → cannot disproportionate ✗
- $\\mathrm{F_2}$: no positive OS → cannot disproportionate ✗

**Set (2): $\\mathrm{MnO_4^{2-}}$, $\\mathrm{ClO_2^-}$, $\\mathrm{Cl_2}$, $\\mathrm{Mn^{3+}}$**
- $\\mathrm{MnO_4^{2-}}$: Mn = $+6$ → disproportionates to $\\mathrm{MnO_4^-}$ (+7) and $\\mathrm{MnO_2}$ (+4) ✓
- $\\mathrm{ClO_2^-}$: Cl = $+3$ → disproportionates to $\\mathrm{Cl^-}$ and $\\mathrm{ClO_3^-}$ ✓
- $\\mathrm{Cl_2}$: Cl = $0$ → disproportionates in alkaline medium ✓
- $\\mathrm{Mn^{3+}}$: Mn = $+3$ → disproportionates to $\\mathrm{Mn^{2+}}$ and $\\mathrm{MnO_2}$ ✓
**All four can disproportionate ✓**

**Set (3) and (4):** Contain $\\mathrm{MnO_4^-}$ (Mn = $+7$, max) or $\\mathrm{Cr_2O_7^{2-}}$ (Cr = $+6$, max for Cr) or $\\mathrm{F_2}$ → at least one cannot disproportionate ✗

**Answer: Option (2)**`,
'tag_redox_4', src(2021, 'Aug', 31, 'Evening')),

// Q40 — Balance Cl2 + OH- → ClO- + Cl- + H2O; Answer: (1) a=1, b=2, c=1, d=1
mkSCQ('RDX-040', 'Easy',
`Chlorine undergoes disproportionation in alkaline medium as shown below:

$$\\mathrm{aCl_2(g) + bOH^{-}(aq) \\rightarrow cClO^{-}(aq) + dCl^{-}(aq) + eH_2O(l)}$$

The values of $a$, $b$, $c$ and $d$ in a balanced redox reaction are respectively:`,
[
  '1, 2, 1 and 1',
  '2, 2, 1 and 3',
  '3, 4, 4 and 2',
  '2, 4, 1 and 3'
],
'a',
`**Step 1 — Identify the half-reactions:**

**Oxidation:** $\\mathrm{Cl_2 \\rightarrow ClO^-}$
Cl: $0 \\rightarrow +1$ (loss of 1e⁻ per Cl)

**Reduction:** $\\mathrm{Cl_2 \\rightarrow Cl^-}$
Cl: $0 \\rightarrow -1$ (gain of 1e⁻ per Cl)

**Step 2 — Balance electrons:**
Each $\\mathrm{Cl_2}$ provides one Cl that gets oxidised (+1) and one that gets reduced (-1) → already balanced with 1 molecule of $\\mathrm{Cl_2}$.

**Step 3 — Balance atoms:**
$$\\mathrm{Cl_2 + 2OH^- \\rightarrow ClO^- + Cl^- + H_2O}$$

Check:
- Cl: 2 = 1 + 1 ✓
- O: 2 = 1 + 1 ✓
- H: 2 = 2 ✓
- Charge: $-2 = -1 + (-1) + 0 = -2$ ✓

**Values: $a = 1$, $b = 2$, $c = 1$, $d = 1$**

**Answer: Option (1) — 1, 2, 1 and 1**`,
'tag_redox_1', src(2024, 'Jan', 29, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (RDX-031 to RDX-040)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
