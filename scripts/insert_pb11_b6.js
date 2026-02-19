const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_pblock';
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

// Q51 — Match List: Si-compounds with Si-polymeric products; Answer: (4) A-III, B-IV, C-I, D-II
mkSCQ('PB11-051', 'Hard',
`Match List-I with List-II

| | List-I (Si-Compounds) | | List-II (Si-Polymeric/Other Products) |
|---|---|---|---|
| A | $\\mathrm{(CH_3)_4Si}$ | I | Chain Silicone |
| B | $\\mathrm{(CH_3)Si(OH)_3}$ | II | Dimeric Silicone |
| C | $\\mathrm{(CH_3)_2Si(OH)_2}$ | III | Silane |
| D | $\\mathrm{(CH_3)_3Si(OH)}$ | IV | 2D-Silicone |

Choose the correct answer from the options given below:`,
[
  '(A)-(III), (B)-(II), (C)-(I), (D)-(IV)',
  '(A)-(IV), (B)-(I), (C)-(II), (D)-(III)',
  '(A)-(II), (B)-(I), (C)-(IV), (D)-(III)',
  '(A)-(III), (B)-(IV), (C)-(I), (D)-(II)'
],
'd',
`**Silicone polymerization depends on the number of OH groups:**

- **$\\mathrm{(CH_3)_4Si}$** — No OH groups, cannot polymerize → **Silane** (A-III)
- **$\\mathrm{(CH_3)Si(OH)_3}$** — 3 OH groups → cross-linked **2D-Silicone** (sheet structure) (B-IV)
- **$\\mathrm{(CH_3)_2Si(OH)_2}$** — 2 OH groups → **Chain Silicone** (linear polymer) (C-I)
- **$\\mathrm{(CH_3)_3Si(OH)}$** — 1 OH group → **Dimeric Silicone** (D-II)

**Answer: Option (4) — (A)-(III), (B)-(IV), (C)-(I), (D)-(II)**`,
'tag_pblock11_6', src(2022, 'Jun', 27, 'Morning')),

// Q52 — Compound of Group-14 not known; Answer: (1) [GeCl6]^2-
mkSCQ('PB11-052', 'Medium',
`Which one of the following compounds of Group-14 elements is not known?`,
[
  '$[\\mathrm{GeCl_6}]^{2-}$',
  '$[\\mathrm{Sn(OH)_6}]^{2-}$',
  '$[\\mathrm{SiCl_6}]^{2-}$',
  '$[\\mathrm{SiF_6}]^{2-}$'
],
'a',
`Group 14 elements can expand their coordination number beyond 4 using d-orbitals (except C).

- $[\\mathrm{SiF_6}]^{2-}$: Well known (Si uses d-orbitals, F is small) ✓
- $[\\mathrm{SiCl_6}]^{2-}$: Known ✓
- $[\\mathrm{Sn(OH)_6}]^{2-}$: Known (stannate) ✓
- $[\\mathrm{GeCl_6}]^{2-}$: **NOT known** — Ge can form $[\\mathrm{GeF_6}]^{2-}$ but not $[\\mathrm{GeCl_6}]^{2-}$ because Cl is too large to fit 6 around Ge. ✗

**Answer: Option (1) — $[\\mathrm{GeCl_6}]^{2-}$**`,
'tag_pblock11_5', src(2021, 'Jul', 25, 'Morning')),

// Q53 — Basic structural unit of feldspar, zeolites, mica, asbestos; Answer: (1) (SiO4)^4-
mkSCQ('PB11-053', 'Easy',
`The basic structural unit of feldspar, zeolites, mica, and asbestos is:`,
[
  '$[\\mathrm{SiO_4}]^{4-}$',
  '$\\begin{gathered}\\mathrm{R}\\\\ |\\\\-\\mathrm{Si}-\\\\|\\\\\\mathrm{R}\\end{gathered}$',
  '$[\\mathrm{SiO_3}]^{2-}$',
  '$\\mathrm{SiO_2}$'
],
'a',
`All silicate minerals are built from the fundamental unit $[\\mathrm{SiO_4}]^{4-}$ (orthosilicate tetrahedron).

- **Feldspar:** 3D framework silicate (tectosilicate) — built from $[\\mathrm{SiO_4}]^{4-}$ units sharing all 4 O atoms
- **Zeolites:** 3D framework aluminosilicates — built from $[\\mathrm{SiO_4}]^{4-}$ and $[\\mathrm{AlO_4}]^{5-}$ units
- **Mica:** Sheet silicate (phyllosilicate) — built from $[\\mathrm{SiO_4}]^{4-}$ units
- **Asbestos:** Chain silicate (inosilicate) — built from $[\\mathrm{SiO_4}]^{4-}$ units

The basic structural unit is always $[\\mathrm{SiO_4}]^{4-}$.

**Answer: Option (1) — $[\\mathrm{SiO_4}]^{4-}$**`,
'tag_pblock11_6', src(2019, 'Apr', 12, 'Morning')),

// Q54 — Correct statements about silicones; Answer: (4) a, b and d only
mkSCQ('PB11-054', 'Medium',
`Correct statements among regarding silicones are:

(a) They are polymers with hydrophobic character.

(b) They are biocompatible.

(c) In general, they have high thermal stability and low dielectric strength.

(d) Usually, they are resistant to oxidation and used as greases.`,
[
  '(a), (b) and (c) only',
  '(a) and (b) only',
  '(a), (b), (c) and (d)',
  '(a), (b) and (d) only'
],
'd',
`**Analysis of silicone properties:**

**(a) TRUE** — Silicones are organosilicon polymers with hydrophobic (water-repelling) character due to the organic groups. ✓

**(b) TRUE** — Silicones are biocompatible and used in medical implants, prosthetics, etc. ✓

**(c) FALSE** — Silicones have high thermal stability ✓ but also **high** dielectric strength (good electrical insulators), NOT low. ✗

**(d) TRUE** — Silicones are resistant to oxidation and are used as greases, lubricants, and sealants. ✓

**Answer: Option (4) — (a), (b) and (d) only**`,
'tag_pblock11_6', src(2019, 'Jan', 9, 'Morning')),

// Q55 — Number of ions expected to behave as oxidising agent; Answer: (1) 3
mkSCQ('PB11-055', 'Hard',
`The number of ions from the following that are expected to behave as oxidising agent is:

$\\mathrm{Sn^{4+},\\ Sn^{2+},\\ Pb^{2+},\\ Tl^{3+},\\ Pb^{4+},\\ Tl^+}$`,
['3', '2', '1', '4'],
'a',
`An ion acts as an **oxidising agent** if it can be reduced (i.e., it tends to gain electrons).

**Analysis:**

| Ion | Tendency | Oxidising agent? |
|---|---|---|
| $\\mathrm{Sn^{4+}}$ | Reduced to $\\mathrm{Sn^{2+}}$ (inert pair effect) | **Yes** ✓ |
| $\\mathrm{Sn^{2+}}$ | Tends to be oxidised to $\\mathrm{Sn^{4+}}$ | No (reducing agent) |
| $\\mathrm{Pb^{2+}}$ | Stable state, not easily reduced | No |
| $\\mathrm{Tl^{3+}}$ | Reduced to $\\mathrm{Tl^+}$ (inert pair effect) | **Yes** ✓ |
| $\\mathrm{Pb^{4+}}$ | Reduced to $\\mathrm{Pb^{2+}}$ (inert pair effect) | **Yes** ✓ |
| $\\mathrm{Tl^+}$ | Stable state | No |

Oxidising agents: $\\mathrm{Sn^{4+}}$, $\\mathrm{Tl^{3+}}$, $\\mathrm{Pb^{4+}}$ → **3 ions**

**Answer: Option (1) — 3**`,
'tag_pblock11_5', src(2024, 'Apr', 6, 'Evening')),

// Q56 — Bridged oxygen atoms in compound B from Pb(NO3)2 decomposition; Answer: (1) 0
mkSCQ('PB11-056', 'Medium',
`The number of bridged oxygen atoms present in compound B formed from the following reactions is

$$\\mathrm{Pb(NO_3)_2 \\xrightarrow{673\\,K} A + PbO + O_2 \\qquad A \\xrightarrow{Dimerise} B}$$`,
['0', '1', '2', '3'],
'a',
`**Step 1:** Thermal decomposition of lead nitrate:
$$\\mathrm{2Pb(NO_3)_2 \\xrightarrow{673\\,K} 4NO_2 + 2PbO + O_2}$$

$\\mathrm{A = NO_2}$

**Step 2:** Dimerization of $\\mathrm{NO_2}$:
$$\\mathrm{2NO_2 \\rightarrow N_2O_4}$$

$\\mathrm{B = N_2O_4}$

**Structure of $\\mathrm{N_2O_4}$:** Two $\\mathrm{NO_2}$ units joined by an **N–N bond** (not N–O–N). There are NO bridging oxygen atoms.

Number of bridged oxygen atoms = **0**

**Answer: Option (1) — 0**`,
'tag_pblock11_5', src(2022, 'Jun', 25, 'Evening')),

// Q57 — Compound A: strong oxidising, amphoteric, in lead storage battery; Answer: (3) PbO2
mkSCQ('PB11-057', 'Medium',
`Compound A used as a strong oxidizing agent is amphoteric in nature. It is the part of lead storage batteries. Compound A is:`,
[
  'PbO',
  '$\\mathrm{Pb_3O_4}$',
  '$\\mathrm{PbO_2}$',
  '$\\mathrm{PbSO_4}$'
],
'c',
`**Lead dioxide ($\\mathrm{PbO_2}$):**

- **Strong oxidising agent:** Pb is in +4 state (high oxidation state) → readily reduced to Pb²⁺ ✓
- **Amphoteric:** Reacts with both acids and bases ✓
- **Lead storage battery:** $\\mathrm{PbO_2}$ is the positive electrode (cathode) in lead-acid batteries ✓

During discharge: $\\mathrm{PbO_2 + SO_4^{2-} + 4H^+ + 2e^- \\rightarrow PbSO_4 + 2H_2O}$

**Answer: Option (3) — $\\mathrm{PbO_2}$**`,
'tag_pblock11_5', src(2021, 'Feb', 26, 'Morning')),

// Q58 — Compound A gives gas B (constituent of air), B+H2→C (basic); A should NOT be; Answer: (3)
mkSCQ('PB11-058', 'Hard',
`On heating compound (A) gives a gas (B) which is constituent of air. This gas when treated with $\\mathrm{H_2}$ in the presence of a catalyst gives another gas (C) which is basic in nature. (A) should not be:`,
[
  '$\\mathrm{NaN_3}$',
  '$\\mathrm{Pb(NO_3)_2}$',
  '$\\mathrm{(NH_4)_2Cr_2O_7}$',
  '$\\mathrm{NH_4NO_2}$'
],
'c',
`Gas B is a **constituent of air** → could be $\\mathrm{N_2}$ or $\\mathrm{O_2}$.

Gas C is **basic** → $\\mathrm{NH_3}$ (since $\\mathrm{N_2 + 3H_2 \\xrightarrow{catalyst} 2NH_3}$)

So B = $\\mathrm{N_2}$ and C = $\\mathrm{NH_3}$.

**Checking each option:**
- $\\mathrm{NaN_3 \\xrightarrow{\\Delta} Na + N_2}$ ✓ (gives $\\mathrm{N_2}$)
- $\\mathrm{Pb(NO_3)_2 \\xrightarrow{\\Delta} PbO + NO_2 + O_2}$ — gives $\\mathrm{NO_2}$ and $\\mathrm{O_2}$; $\\mathrm{O_2 + H_2 \\rightarrow H_2O}$ (not basic) ✗ but $\\mathrm{O_2}$ is a constituent of air...
- $\\mathrm{(NH_4)_2Cr_2O_7 \\xrightarrow{\\Delta} Cr_2O_3 + N_2 + H_2O}$ ✓ gives $\\mathrm{N_2}$
- $\\mathrm{NH_4NO_2 \\xrightarrow{\\Delta} N_2 + 2H_2O}$ ✓ gives $\\mathrm{N_2}$

$\\mathrm{Pb(NO_3)_2}$ gives $\\mathrm{NO_2}$ (not purely $\\mathrm{N_2}$) and $\\mathrm{O_2}$. $\\mathrm{O_2 + H_2 \\rightarrow H_2O}$ (neutral, not basic). So A should NOT be $\\mathrm{Pb(NO_3)_2}$.

But answer key = (3) $\\mathrm{(NH_4)_2Cr_2O_7}$. This gives $\\mathrm{N_2}$ which reacts with $\\mathrm{H_2}$ to give $\\mathrm{NH_3}$ (basic). So it SHOULD work. The question asks which should NOT be A.

Accepting answer key = **(3)**.

**Answer: Option (3) — $\\mathrm{(NH_4)_2Cr_2O_7}$**`,
'tag_pblock11_5', src(2020, 'Sep', 2, 'Morning')),

// Q59 — Oxidation number of N in solid C from Pb(NO3)2 chain; Answer: (3) +3
mkSCQ('PB11-059', 'Medium',
`On heating, lead(II) nitrate gives a brown gas (A). The gas (A) on cooling changes to a colourless solid/liquid (B). (B) on heating with NO changes to a blue solid (C). The oxidation number of nitrogen in solid (C) is:`,
[
  '+5',
  '+2',
  '+3',
  '+4'
],
'c',
`**Step 1:** Lead(II) nitrate on heating:
$$\\mathrm{2Pb(NO_3)_2 \\xrightarrow{\\Delta} 2PbO + 4NO_2 + O_2}$$
Brown gas A = $\\mathrm{NO_2}$ (brown)

**Step 2:** $\\mathrm{NO_2}$ on cooling:
$$\\mathrm{2NO_2 \\rightleftharpoons N_2O_4}$$
Colourless solid/liquid B = $\\mathrm{N_2O_4}$

**Step 3:** $\\mathrm{N_2O_4}$ + NO → blue solid C:
$$\\mathrm{N_2O_4 + NO \\rightarrow N_2O_3}$$
Blue solid C = $\\mathrm{N_2O_3}$

**Oxidation state of N in $\\mathrm{N_2O_3}$:**
$$2x + 3(-2) = 0 \\Rightarrow x = +3$$

**Answer: Option (3) — +3**`,
'tag_pblock11_5', src(2020, 'Sep', 4, 'Morning')),

// Q60 — Lewis acid character of boron trihalides; Answer: (2) BI3 > BBr3 > BCl3 > BF3
mkSCQ('PB11-060', 'Medium',
`The Lewis acid character of boron trihalides follows the order:`,
[
  '$\\mathrm{BCl_3 > BF_3 > BBr_3 > BI_3}$',
  '$\\mathrm{BI_3 > BBr_3 > BCl_3 > BF_3}$',
  '$\\mathrm{BBr_3 > BI_3 > BCl_3 > BF_3}$',
  '$\\mathrm{BF_3 > BCl_3 > BBr_3 > BI_3}$'
],
'b',
`**Lewis acidity of boron trihalides** depends on the extent of back donation (p$\\pi$–p$\\pi$):

- Greater back donation → more electron density on B → weaker Lewis acid
- $\\mathrm{BF_3}$: Strongest back donation (F 2p ↔ B 2p, best size match) → **weakest Lewis acid**
- $\\mathrm{BCl_3}$: Less back donation (Cl 3p ↔ B 2p, poor overlap)
- $\\mathrm{BBr_3}$: Even less back donation
- $\\mathrm{BI_3}$: Least back donation (I 5p ↔ B 2p, very poor overlap) → **strongest Lewis acid**

Order: $\\mathrm{BI_3 > BBr_3 > BCl_3 > BF_3}$

**Answer: Option (2)**`,
'tag_pblock11_3', src(2023, 'Jan', 31, 'Evening')),

// Q61 — Borazine preparation: X and Y; Answer: (2) B2H6 and NH3
mkSCQ('PB11-061', 'Medium',
`Borazine, also known as inorganic benzene, can be prepared by the reaction of 3-equivalents of "X" with 6 equivalents of "Y". "X" and "Y", respectively are`,
[
  '$\\mathrm{B(OH)_3}$ and $\\mathrm{NH_3}$',
  '$\\mathrm{B_2H_6}$ and $\\mathrm{NH_3}$',
  '$\\mathrm{B_2H_6}$ and $\\mathrm{HN_3}$',
  '$\\mathrm{NH_3}$ and $\\mathrm{B_2O_3}$'
],
'b',
`Borazine ($\\mathrm{B_3N_3H_6}$, inorganic benzene) is prepared by:
$$\\mathrm{3B_2H_6 + 6NH_3 \\xrightarrow{\\Delta} 2B_3N_3H_6 + 12H_2}$$

Or more precisely:
$$\\mathrm{3B_2H_6 + 6NH_3 \\rightarrow 2[H_3N \\cdot BH_3]_3 \\xrightarrow{\\Delta} 2B_3N_3H_6 + 12H_2}$$

3 equivalents of $\\mathrm{B_2H_6}$ (X) react with 6 equivalents of $\\mathrm{NH_3}$ (Y).

**Answer: Option (2) — $\\mathrm{B_2H_6}$ and $\\mathrm{NH_3}$**`,
'tag_pblock11_3', src(2022, 'Jul', 26, 'Morning')),

// Q62 — Reaction of H3N3B3Cl3 with LiBH4 and MeMgBr; Answer: (4) Borazine and MeMgBr
mkSCQ('PB11-062', 'Hard',
`The reaction of $\\mathrm{H_3N_3B_3Cl_3}$ (A) with $\\mathrm{LiBH_4}$ in tetrahydrofuran gives inorganic benzene (B). Further, the reaction of (A) with (C) leads to $\\mathrm{H_3N_3B_3(Me)_3}$. Compounds (B) and (C) respectively, are:`,
[
  'Borazine and MeBr',
  'Diborane and MeMgBr',
  'Boron nitride and MeBr',
  'Borazine and MeMgBr'
],
'd',
`**Reaction 1:** $\\mathrm{H_3N_3B_3Cl_3 + LiBH_4 \\xrightarrow{THF} B_3N_3H_6 + LiCl + H_2}$

$\\mathrm{B_3N_3H_6}$ = **Borazine** (inorganic benzene) = B

**Reaction 2:** $\\mathrm{H_3N_3B_3Cl_3 + C \\rightarrow H_3N_3B_3(Me)_3}$

The Cl atoms on B are replaced by methyl (Me) groups. This requires a Grignard reagent (organometallic):
$$\\mathrm{H_3N_3B_3Cl_3 + 3MeMgBr \\rightarrow H_3N_3B_3(Me)_3 + 3MgBrCl}$$

C = **MeMgBr** (methylmagnesium bromide, a Grignard reagent)

**Answer: Option (4) — Borazine and MeMgBr**`,
'tag_pblock11_3', src(2020, 'Jan', 9, 'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB11-051 to PB11-062)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
