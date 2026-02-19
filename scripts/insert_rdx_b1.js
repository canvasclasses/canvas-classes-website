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

// Q1 — Oxidation number change of 5; Answer: (2) MnO4- → Mn2+
mkSCQ('RDX-001', 'Easy',
`Identify the process in which change in the oxidation state is five:`,
[
  `$\\mathrm{Cr_2O_7^{2-} \\rightarrow 2Cr^{3+}}$`,
  `$\\mathrm{MnO_4^{-} \\rightarrow Mn^{2+}}$`,
  `$\\mathrm{CrO_4^{2-} \\rightarrow Cr^{3+}}$`,
  `$\\mathrm{C_2O_4^{2-} \\rightarrow 2CO_2}$`
],
'b',
`**Step 1 — Calculate oxidation state change in each option:**

**(1) $\\mathrm{Cr_2O_7^{2-} \\rightarrow 2Cr^{3+}}$:**
In $\\mathrm{Cr_2O_7^{2-}}$: $2x + 7(-2) = -2 \\Rightarrow x = +6$
In $\\mathrm{Cr^{3+}}$: $x = +3$
Change = $6 - 3 = 3$ per Cr atom.

**(2) $\\mathrm{MnO_4^{-} \\rightarrow Mn^{2+}}$:**
In $\\mathrm{MnO_4^{-}}$: $x + 4(-2) = -1 \\Rightarrow x = +7$
In $\\mathrm{Mn^{2+}}$: $x = +2$
Change = $7 - 2 = \\mathbf{5}$ ✓

**(3) $\\mathrm{CrO_4^{2-} \\rightarrow Cr^{3+}}$:**
In $\\mathrm{CrO_4^{2-}}$: $x + 4(-2) = -2 \\Rightarrow x = +6$
Change = $6 - 3 = 3$

**(4) $\\mathrm{C_2O_4^{2-} \\rightarrow 2CO_2}$:**
In $\\mathrm{C_2O_4^{2-}}$: $2x + 4(-2) = -2 \\Rightarrow x = +3$
In $\\mathrm{CO_2}$: $x + 2(-2) = 0 \\Rightarrow x = +4$
Change = $4 - 3 = 1$

**Answer: Option (2) — $\\mathrm{MnO_4^{-} \\rightarrow Mn^{2+}}$, change = 5**`,
'tag_redox_2', src(2021, 'Jul', 25, 'Evening')),

// Q2 — Oxidation states of N in NO, NO2, N2O, NO3-; Answer: (1)
mkSCQ('RDX-002', 'Easy',
`The oxidation states of nitrogen in $\\mathrm{NO}$, $\\mathrm{NO_2}$, $\\mathrm{N_2O}$ and $\\mathrm{NO_3^{-}}$ are in the order of:`,
[
  `$\\mathrm{NO_3^{-} > NO_2 > NO > N_2O}$`,
  `$\\mathrm{NO_2 > NO_3^{-} > NO > N_2O}$`,
  `$\\mathrm{N_2O > NO_2 > NO > NO_3^{-}}$`,
  `$\\mathrm{NO > NO_2 > N_2O > NO_3^{-}}$`
],
'a',
`**Step 1 — Calculate oxidation state of N in each compound:**

| Compound | Equation | Oxidation state of N |
|---|---|---|
| $\\mathrm{NO}$ | $x + (-2) = 0$ | $x = +2$ |
| $\\mathrm{NO_2}$ | $x + 2(-2) = 0$ | $x = +4$ |
| $\\mathrm{N_2O}$ | $2x + (-2) = 0$ | $x = +1$ |
| $\\mathrm{NO_3^{-}}$ | $x + 3(-2) = -1$ | $x = +5$ |

**Step 2 — Arrange in decreasing order:**
$$+5 > +4 > +2 > +1$$
$$\\mathrm{NO_3^{-}} > \\mathrm{NO_2} > \\mathrm{NO} > \\mathrm{N_2O}$$

**Answer: Option (1)**`,
'tag_redox_2', src(2021, 'Mar', 18, 'Evening')),

// Q3 — Oxidation states in K2Cr2O7, KMnO4, K2FeO4; Answer: 19 (NVT)
mkNVT('RDX-003', 'Easy',
`The oxidation states of transition metal atoms in $\\mathrm{K_2Cr_2O_7}$, $\\mathrm{KMnO_4}$ and $\\mathrm{K_2FeO_4}$, respectively, are $x$, $y$ and $z$. The sum of $x$, $y$ and $z$ is ____`,
{ integer_value: 19 },
`**Step 1 — Oxidation state of Cr in $\\mathrm{K_2Cr_2O_7}$:**
$$2(+1) + 2x + 7(-2) = 0 \\Rightarrow 2 + 2x - 14 = 0 \\Rightarrow x = +6$$

**Step 2 — Oxidation state of Mn in $\\mathrm{KMnO_4}$:**
$$(+1) + y + 4(-2) = 0 \\Rightarrow 1 + y - 8 = 0 \\Rightarrow y = +7$$

**Step 3 — Oxidation state of Fe in $\\mathrm{K_2FeO_4}$:**
$$2(+1) + z + 4(-2) = 0 \\Rightarrow 2 + z - 8 = 0 \\Rightarrow z = +6$$

**Step 4 — Sum:**
$$x + y + z = 6 + 7 + 6 = \\mathbf{19}$$

**Answer: 19**`,
'tag_redox_2', src(2020, 'Sep', 2, 'Evening')),

// Q4 — Reaction 2[Au(CN)2]- + Zn → 2Au + [Zn(CN)4]2-; Answer: (3) A and B only
mkSCQ('RDX-004', 'Easy',
`Which of the following options are correct for the reaction?

$$2[\\mathrm{Au(CN)_2}]^{-}(\\mathrm{aq}) + \\mathrm{Zn}(\\mathrm{s}) \\rightarrow 2\\mathrm{Au}(\\mathrm{s}) + [\\mathrm{Zn(CN)_4}]^{2-}(\\mathrm{aq})$$

**A.** Redox reaction $\\quad$ **B.** Displacement reaction $\\quad$ **C.** Decomposition reaction $\\quad$ **D.** Combination reaction

Choose the correct answer from the options given below:`,
[
  'A only',
  'A and D only',
  'A and B only',
  'C and D only'
],
'c',
`**Step 1 — Identify oxidation state changes:**

- $\\mathrm{Au}$ in $[\\mathrm{Au(CN)_2}]^-$: Let $x + 2(-1) = -1 \\Rightarrow x = +1$
- $\\mathrm{Au}$ in product: $0$ → **Reduced** (gain of electrons)
- $\\mathrm{Zn}$ in reactant: $0$
- $\\mathrm{Zn}$ in $[\\mathrm{Zn(CN)_4}]^{2-}$: $x + 4(-1) = -2 \\Rightarrow x = +2$ → **Oxidised**

Since oxidation states change → **A. Redox reaction ✓**

**Step 2 — Displacement reaction:**
Zn (more active metal) displaces Au from its complex salt → **B. Displacement reaction ✓**

**Step 3 — Decomposition / Combination:**
No single compound breaks down (not decomposition ✗). No single product formed from multiple reactants (not combination ✗).

**Answer: Option (3) — A and B only**`,
'tag_redox_4', src(2023, 'Apr', 6, 'Morning')),

// Q5 — Strong reducing and oxidizing agents among lanthanides; Answer: (4) Eu2+ and Ce4+
mkSCQ('RDX-005', 'Medium',
`Strong reducing and oxidizing agents among the following, respectively, are`,
[
  `$\\mathrm{Ce^{3+}}$ and $\\mathrm{Ce^{4+}}$`,
  `$\\mathrm{Ce^{4+}}$ and $\\mathrm{Tb^{4+}}$`,
  `$\\mathrm{Ce^{4+}}$ and $\\mathrm{Eu^{2+}}$`,
  `$\\mathrm{Eu^{2+}}$ and $\\mathrm{Ce^{4+}}$`
],
'd',
`**Step 1 — Identify strong reducing agents (easily oxidised):**

- $\\mathrm{Eu^{2+}}$: Europium prefers the +3 state (stable $4f^7$ configuration at +3). $\\mathrm{Eu^{2+}}$ ($4f^7$) is very stable but readily loses an electron to reach $\\mathrm{Eu^{3+}}$ ($4f^6$)... 

Actually, $\\mathrm{Eu^{2+}}$ has $4f^7$ (half-filled, stable), but it is a **strong reducing agent** because it can donate electrons to reach $\\mathrm{Eu^{3+}}$.

- $\\mathrm{Ce^{3+}}$: Stable configuration; poor reducing agent.

**Step 2 — Identify strong oxidizing agents (easily reduced):**

- $\\mathrm{Ce^{4+}}$: Ce prefers +3 state (empty $4f$ shell at +4 is less stable). $\\mathrm{Ce^{4+}}$ readily accepts an electron to become $\\mathrm{Ce^{3+}}$ (stable $4f^0$) → **strong oxidizing agent** ✓
- $\\mathrm{Tb^{4+}}$: Less common; $\\mathrm{Ce^{4+}}$ is the classic strong oxidizer among lanthanides.

**Step 3 — Conclusion:**
- Strong **reducing** agent: $\\mathrm{Eu^{2+}}$ (donates $e^-$ easily)
- Strong **oxidizing** agent: $\\mathrm{Ce^{4+}}$ (accepts $e^-$ easily)

**Answer: Option (4) — $\\mathrm{Eu^{2+}}$ and $\\mathrm{Ce^{4+}}$**`,
'tag_redox_2', src(2023, 'Apr', 6, 'Morning')),

// Q6 — Mn(VI) disproportionates in acid; difference in OS = 3; Answer: 3 (NVT)
mkNVT('RDX-006', 'Medium',
`Manganese (VI) has ability to disproportionate in acidic solution. The difference in oxidation states of two ions it forms in acidic solution is ____`,
{ integer_value: 3 },
`**Step 1 — Disproportionation of Mn(VI) in acidic solution:**

$\\mathrm{Mn(VI)}$ exists as $\\mathrm{MnO_4^{2-}}$ (manganate ion). In acidic medium it disproportionates:

$$3\\mathrm{MnO_4^{2-}} + 4\\mathrm{H^+} \\rightarrow 2\\mathrm{MnO_4^{-}} + \\mathrm{MnO_2} + 2\\mathrm{H_2O}$$

**Step 2 — Identify the two products:**
- $\\mathrm{MnO_4^{-}}$ (permanganate): Mn oxidation state = $+7$
- $\\mathrm{MnO_2}$ (manganese dioxide): Mn oxidation state = $+4$

**Step 3 — Difference in oxidation states:**
$$\\Delta = 7 - 4 = \\mathbf{3}$$

**Answer: 3**`,
'tag_redox_4', src(2022, 'Jun', 24, 'Evening')),

// Q7 — H2O2 as oxidizing/reducing agent; Answer: (4)
mkSCQ('RDX-007', 'Medium',
`**(A)** $\\mathrm{HOCl + H_2O_2 \\rightarrow H_3O^{+} + Cl^{-} + O_2}$

**(B)** $\\mathrm{I_2 + H_2O_2 + 2OH^{-} \\rightarrow 2I^{-} + 2H_2O + O_2}$

Choose the correct option.`,
[
  `$\\mathrm{H_2O_2}$ acts as oxidizing and reducing agent respectively in equations (A) and (B).`,
  `$\\mathrm{H_2O_2}$ acts as oxidising agent in equations (A) and (B).`,
  `$\\mathrm{H_2O_2}$ acts as reducing and oxidising agent respectively in equations (A) and (B).`,
  `$\\mathrm{H_2O_2}$ acts as reducing agent in equations (A) and (B).`
],
'd',
`**Step 1 — Analyse reaction (A): $\\mathrm{HOCl + H_2O_2 \\rightarrow H_3O^{+} + Cl^{-} + O_2}$**

- In $\\mathrm{H_2O_2}$: O is $-1$
- In $\\mathrm{O_2}$ (product): O is $0$
- O goes from $-1 \\rightarrow 0$: **oxidation** (loss of electrons)
- $\\mathrm{H_2O_2}$ is **oxidised** → acts as **reducing agent** in (A)

- In $\\mathrm{HOCl}$: Cl is $+1$; in $\\mathrm{Cl^-}$: Cl is $-1$ → Cl is reduced → HOCl is the oxidizing agent

**Step 2 — Analyse reaction (B): $\\mathrm{I_2 + H_2O_2 + 2OH^{-} \\rightarrow 2I^{-} + 2H_2O + O_2}$**

- In $\\mathrm{H_2O_2}$: O is $-1$
- In $\\mathrm{O_2}$: O is $0$
- O goes from $-1 \\rightarrow 0$: **oxidation**
- $\\mathrm{H_2O_2}$ is **oxidised** → acts as **reducing agent** in (B)

- $\\mathrm{I_2}$ (0) → $\\mathrm{I^-}$ ($-1$): reduced → $\\mathrm{I_2}$ is the oxidizing agent

**Conclusion: $\\mathrm{H_2O_2}$ acts as reducing agent in BOTH (A) and (B)**

**Answer: Option (4)**`,
'tag_redox_2', src(2021, 'Feb', 24, 'Morning')),

// Q8 — Match List: types of redox reactions; Answer: (3) A-IV, B-I, C-II, D-III
mkSCQ('RDX-008', 'Medium',
`Match List-I with List-II.

| List-I (Reaction) | List-II (Type) |
|---|---|
| (A) $\\mathrm{N_{2(g)} + O_{2(g)} \\rightarrow 2NO_{(g)}}$ | (I) Decomposition |
| (B) $\\mathrm{2Pb(NO_3)_{2(s)} \\rightarrow 2PbO_{(s)} + 4NO_{2(g)} + O_{2(g)}}$ | (II) Displacement |
| (C) $\\mathrm{2Na_{(s)} + 2H_2O_{(l)} \\rightarrow 2NaOH_{(aq)} + H_{2(g)}}$ | (III) Disproportionation |
| (D) $\\mathrm{2NO_{2(g)} + 2OH^{-}_{(aq)} \\rightarrow NO_{2(aq)}^{-} + NO_{3(aq)}^{-} + H_2O_{(l)}}$ | (IV) Combination |

Choose the correct answer from the options given below:`,
[
  '(A)-(II), (B)-(III), (C)-(IV), (D)-(I)',
  '(A)-(III), (B)-(II), (C)-(I), (D)-(IV)',
  '(A)-(IV), (B)-(I), (C)-(II), (D)-(III)',
  '(A)-(I), (B)-(II), (C)-(III), (D)-(IV)'
],
'c',
`**Step 1 — Classify each reaction:**

**(A) $\\mathrm{N_2 + O_2 \\rightarrow 2NO}$:**
Two elements combine to form a single compound → **Combination reaction (IV)** ✓

**(B) $\\mathrm{2Pb(NO_3)_2 \\rightarrow 2PbO + 4NO_2 + O_2}$:**
A single compound breaks into multiple products → **Decomposition reaction (I)** ✓
- N in $\\mathrm{NO_3^-}$: $+5$; in $\\mathrm{NO_2}$: $+4$ (reduced); O in $\\mathrm{NO_3^-}$: $-2$; in $\\mathrm{O_2}$: $0$ (oxidised) → also a redox decomposition

**(C) $\\mathrm{2Na + 2H_2O \\rightarrow 2NaOH + H_2}$:**
Na (0) displaces H ($+1$ → 0) from water → **Displacement reaction (II)** ✓

**(D) $\\mathrm{2NO_2 + 2OH^- \\rightarrow NO_2^- + NO_3^- + H_2O}$:**
N in $\\mathrm{NO_2}$: $+4$; in $\\mathrm{NO_2^-}$: $+3$ (reduced); in $\\mathrm{NO_3^-}$: $+5$ (oxidised)
Same element (N) simultaneously oxidised and reduced → **Disproportionation (III)** ✓

**Answer: Option (3) — A-IV, B-I, C-II, D-III**`,
'tag_redox_4', src(2024, 'Apr', 6, 'Evening')),

// Q9 — Not a disproportionation reaction; Answer: (3)
mkSCQ('RDX-009', 'Medium',
`Which of the given reactions is **not** an example of disproportionation reaction?`,
[
  `$\\mathrm{2H_2O_2 \\rightarrow 2H_2O + O_2}$`,
  `$\\mathrm{2NO_2 + H_2O \\rightarrow HNO_3 + HNO_2}$`,
  `$\\mathrm{MnO_4^{-} + 4H^{+} + 3e^{-} \\rightarrow MnO_2 + 2H_2O}$`,
  `$\\mathrm{3MnO_4^{2-} + 4H^{+} \\rightarrow 2MnO_4^{-} + MnO_2 + 2H_2O}$`
],
'c',
`**Disproportionation** = same element simultaneously oxidised and reduced.

**Step 1 — Check each option:**

**(1) $\\mathrm{2H_2O_2 \\rightarrow 2H_2O + O_2}$:**
O in $\\mathrm{H_2O_2}$: $-1$; in $\\mathrm{H_2O}$: $-2$ (reduced); in $\\mathrm{O_2}$: $0$ (oxidised)
Same element (O) both oxidised and reduced → **Disproportionation ✓**

**(2) $\\mathrm{2NO_2 + H_2O \\rightarrow HNO_3 + HNO_2}$:**
N in $\\mathrm{NO_2}$: $+4$; in $\\mathrm{HNO_3}$: $+5$ (oxidised); in $\\mathrm{HNO_2}$: $+3$ (reduced)
Same element (N) both oxidised and reduced → **Disproportionation ✓**

**(3) $\\mathrm{MnO_4^{-} + 4H^{+} + 3e^{-} \\rightarrow MnO_2 + 2H_2O}$:**
This is a **half-reaction** (reduction only). Only one species of Mn is present and it only gets reduced. No simultaneous oxidation of Mn → **NOT disproportionation ✗**

**(4) $\\mathrm{3MnO_4^{2-} + 4H^{+} \\rightarrow 2MnO_4^{-} + MnO_2 + 2H_2O}$:**
Mn in $\\mathrm{MnO_4^{2-}}$: $+6$; in $\\mathrm{MnO_4^{-}}$: $+7$ (oxidised); in $\\mathrm{MnO_2}$: $+4$ (reduced) → **Disproportionation ✓**

**Answer: Option (3)**`,
'tag_redox_4', src(2022, 'Jul', 26, 'Morning')),

// Q10 — Example of disproportionation; Answer: (1)
mkSCQ('RDX-010', 'Easy',
`Which one of the following is an example of disproportionation reaction?`,
[
  `$\\mathrm{3MnO_4^{2-} + 4H^{+} \\rightarrow 2MnO_4^{-} + MnO_2 + 2H_2O}$`,
  `$\\mathrm{MnO_4^{-} + 4H^{+} + 4e^{-} \\rightarrow MnO_2 + 2H_2O}$`,
  `$\\mathrm{10I^{-} + 2MnO_4^{-} + 16H^{+} \\rightarrow 2Mn^{2+} + 8H_2O + 5I_2}$`,
  `$\\mathrm{8MnO_4^{-} + 3S_2O_3^{2-} + H_2O \\rightarrow 8MnO_2 + 6SO_4^{2-} + 2OH^{-}}$`
],
'a',
`**Disproportionation** = same element simultaneously oxidised and reduced in the same reaction.

**Step 1 — Check option (1):**
$$\\mathrm{3MnO_4^{2-} + 4H^{+} \\rightarrow 2MnO_4^{-} + MnO_2 + 2H_2O}$$
- Mn in $\\mathrm{MnO_4^{2-}}$: $+6$ (reactant)
- Mn in $\\mathrm{MnO_4^{-}}$: $+7$ → **oxidised**
- Mn in $\\mathrm{MnO_2}$: $+4$ → **reduced**
- Same element (Mn) both oxidised and reduced → **Disproportionation ✓**

**Step 2 — Eliminate others:**
- (2): Half-reaction only (reduction only) ✗
- (3): $\\mathrm{I^-}$ oxidised, $\\mathrm{Mn}$ reduced — two different elements ✗ (not disproportionation)
- (4): $\\mathrm{S}$ oxidised, $\\mathrm{Mn}$ reduced — two different elements ✗

**Answer: Option (1)**`,
'tag_redox_4', src(2022, 'Jun', 26, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (RDX-001 to RDX-010)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
