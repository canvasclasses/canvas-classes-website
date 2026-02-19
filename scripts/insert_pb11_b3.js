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

const questions = [

// Q21 — Borax bead test with CuSO4 in oxidising flame; Answer: (3) Cu(BO2)2
mkSCQ('PB11-021', 'Medium',
`During the borax bead test with $\\mathrm{CuSO_4}$, a blue green colour of the bead was observed in oxidising flame due to the formation of`,
[
  '$\\mathrm{Cu_3B_2}$',
  'Cu',
  '$\\mathrm{Cu(BO_2)_2}$',
  'CuO'
],
'c',
`In the borax bead test:

**Step 1:** Borax melts and loses water to form sodium metaborate and $\\mathrm{B_2O_3}$:
$$\\mathrm{Na_2B_4O_7 \\xrightarrow{\\Delta} 2NaBO_2 + B_2O_3}$$

**Step 2:** In the oxidising flame, the metal salt reacts with $\\mathrm{B_2O_3}$:
$$\\mathrm{CuSO_4 + B_2O_3 \\rightarrow Cu(BO_2)_2 + SO_3}$$

$\\mathrm{Cu(BO_2)_2}$ (copper metaborate) gives the characteristic **blue-green** colour in the oxidising flame.

In the reducing flame, Cu is reduced to Cu metal (red/opaque bead).

**Answer: Option (3) — $\\mathrm{Cu(BO_2)_2}$**`,
'tag_pblock11_3', src(2023, 'Jan', 29, 'Morning')),

// Q22 — Boric acid solid, BF3 gas — reason; Answer: (3)
mkSCQ('PB11-022', 'Easy',
`Boric acid in solid, whereas $\\mathrm{BF_3}$ is gas at room temperature because of`,
[
  'Strong ionic bond in Boric acid',
  'Strong van der Waals\' interaction in Boric acid',
  'Strong hydrogen bond in Boric acid',
  'Strong covalent bond in $\\mathrm{BF_3}$'
],
'c',
`**Boric acid ($\\mathrm{H_3BO_3}$):** Each $\\mathrm{H_3BO_3}$ molecule has three OH groups that form an extensive **intermolecular hydrogen bond network** in the solid state, creating layered structures. These strong H-bonds require significant energy to break, making boric acid a solid at room temperature.

**$\\mathrm{BF_3}$:** A small, non-polar (or weakly polar) molecule with only weak van der Waals forces between molecules → gas at room temperature.

**Answer: Option (3) — Strong hydrogen bond in Boric acid**`,
'tag_pblock11_3', src(2023, 'Jan', 30, 'Evening')),

// Q23 — Geometry around B in product B from BF3+NaH→A, A+NMe3→B; Answer: (2)
mkSCQ('PB11-023', 'Medium',
`The geometry around boron in the product 'B' formed from the following reaction is

$$\\mathrm{BF_3 + NaH \\xrightarrow{450\\,K} A + NaF \\qquad A + NMe_3 \\rightarrow B}$$`,
[
  'trigonal planar',
  'tetrahedral',
  'pyramidal',
  'square planar'
],
'b',
`**Step 1:** $\\mathrm{BF_3 + NaH \\xrightarrow{450\\,K} B_2H_6 + NaF}$

Actually: $\\mathrm{2BF_3 + 6NaH \\rightarrow B_2H_6 + 6NaF}$

So $\\mathrm{A = B_2H_6}$ (diborane)

**Step 2:** $\\mathrm{B_2H_6 + 2NMe_3 \\rightarrow 2[H_3B \\cdot NMe_3]}$

Product B = $\\mathrm{H_3B \\cdot NMe_3}$ (trimethylamine-borane adduct)

In this adduct, $\\mathrm{NMe_3}$ donates its lone pair to the empty p-orbital of $\\mathrm{BH_3}$, making B **sp³ hybridized** → **tetrahedral** geometry.

**Answer: Option (2) — tetrahedral**`,
'tag_pblock11_3', src(2022, 'Jul', 25, 'Morning')),

// Q24 — Assertion-Reason: Boric acid weak acid; Answer: (1)
mkSCQ('PB11-024', 'Easy',
`Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R.

**Assertion A:** Boric acid is a weak acid.

**Reason R:** Boric acid is not able to release $\\mathrm{H^+}$ ion on its own. It receives $\\mathrm{OH^-}$ ion from water and releases $\\mathrm{H^+}$ ion.

In the light of the above statements, choose the most appropriate answer from the options given below.`,
[
  'Both A and R are correct and R is the correct explanation of A',
  'Both A and R are correct but R is NOT the correct explanation of A',
  'A is correct but R is not correct',
  'A is not correct but R is correct'
],
'a',
`**Assertion A:** Boric acid ($\\mathrm{H_3BO_3}$) is a weak monobasic acid ($\\mathrm{pK_a \\approx 9.24}$). ✓

**Reason R:** Boric acid acts as a Lewis acid, not a Brønsted acid. It accepts $\\mathrm{OH^-}$ from water:
$$\\mathrm{B(OH)_3 + H_2O \\rightarrow [B(OH)_4]^- + H^+}$$

It does not directly donate a proton — instead it accepts $\\mathrm{OH^-}$ and releases $\\mathrm{H^+}$. This is why it is a weak acid. ✓

R is the correct explanation of A.

**Answer: Option (1)**`,
'tag_pblock11_3', src(2022, 'Jul', 26, 'Evening')),

// Q25 — Statements about Be/Al chlorides and hydroxides; Answer: (4)
mkSCQ('PB11-025', 'Medium',
`Given below are two statements:

**Statement I:** The chlorides of Be and Al have Cl-bridged structure. Both are soluble in organic solvents and act as Lewis bases.

**Statement II:** Hydroxides of Be and Al dissolve in excess alkali to give beryllate and aluminate ions.

In the light of the above statements, choose the correct answer from the options given below.`,
[
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true'
],
'd',
`**Statement I:** $\\mathrm{BeCl_2}$ and $\\mathrm{AlCl_3}$ do have Cl-bridged structures and are soluble in organic solvents. However, they act as **Lewis acids** (electron pair acceptors), NOT Lewis bases. Statement I is **false**. ✗

**Statement II:** Both $\\mathrm{Be(OH)_2}$ and $\\mathrm{Al(OH)_3}$ are amphoteric:
- $\\mathrm{Be(OH)_2 + 2NaOH \\rightarrow Na_2[Be(OH)_4]}$ (beryllate) ✓
- $\\mathrm{Al(OH)_3 + NaOH \\rightarrow Na[Al(OH)_4]}$ (aluminate) ✓

Statement II is **correct**.

**Answer: Option (4) — Statement I is false but Statement II is true**`,
'tag_pblock11_4', src(2022, 'Jul', 27, 'Morning')),

// Q26 — Assertion-Reason: Boron unable to form BF6^3-; Answer: (1)
mkSCQ('PB11-026', 'Easy',
`Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R.

**Assertion A:** Boron is unable to form $\\mathrm{BF_6^{3-}}$.

**Reason R:** Size of B is very small.

In the light of the above statements, choose the correct answer from the options given below.`,
[
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true'
],
'a',
`**Assertion A:** Boron cannot form $\\mathrm{BF_6^{3-}}$ (hexafluoroborate). The maximum coordination number of B is 4 (e.g., $\\mathrm{BF_4^-}$). ✓

**Reason R:** Boron has a very small atomic size and lacks d-orbitals. Due to its small size, it cannot accommodate 6 fluorine atoms around it (steric constraint). The maximum coordination number is 4. ✓

R correctly explains A — the small size of B prevents it from forming hexacoordinate species.

**Answer: Option (1)**`,
'tag_pblock11_3', src(2022, 'Jul', 27, 'Evening')),

// Q27 — Borax bead test with CoO — blue bead due to; Answer: (2)
mkSCQ('PB11-027', 'Medium',
`When borax is heated with CoO on a platinum loop, blue coloured bead formed is largely due to`,
[
  '$\\mathrm{B_2O_3}$',
  '$\\mathrm{Co(BO_2)_2}$',
  '$\\mathrm{CoB_4O_7}$',
  '$\\mathrm{Co[B_4O_5(OH)_4]}$'
],
'b',
`In the borax bead test with CoO:

Borax on heating gives $\\mathrm{B_2O_3}$ and $\\mathrm{NaBO_2}$.

$\\mathrm{B_2O_3}$ reacts with CoO:
$$\\mathrm{CoO + B_2O_3 \\rightarrow Co(BO_2)_2}$$

**Cobalt metaborate** $\\mathrm{Co(BO_2)_2}$ gives the characteristic **blue** colour of the bead (Thenard's blue).

**Answer: Option (2) — $\\mathrm{Co(BO_2)_2}$**`,
'tag_pblock11_3', src(2022, 'Jul', 29, 'Evening')),

// Q28 — Correct statements about B2H6; Answer: (3) C and D only
mkSCQ('PB11-028', 'Hard',
`Identify the correct statement for $\\mathrm{B_2H_6}$ from those given below.

(A) In $\\mathrm{B_2H_6}$, all B–H bonds are equivalent.

(B) In $\\mathrm{B_2H_6}$, there are four 3-centre-2-electron bonds.

(C) $\\mathrm{B_2H_6}$ is a Lewis acid.

(D) $\\mathrm{B_2H_6}$ can be synthesized from both $\\mathrm{BF_3}$ and $\\mathrm{NaBH_4}$.

(E) $\\mathrm{B_2H_6}$ is a planar molecule.

Choose the most appropriate answer from the options given below:`,
[
  '(A) and (E) only',
  '(B), (C) and (E) only',
  '(C) and (D) only',
  '(C) and (E) only'
],
'c',
`**Analysis of each statement:**

**(A) FALSE** — B–H bonds are NOT all equivalent. There are 4 terminal B–H bonds (2c-2e) and 2 bridging B–H–B bonds (3c-2e). These have different bond lengths and energies.

**(B) FALSE** — $\\mathrm{B_2H_6}$ has **two** 3-centre-2-electron (3c-2e) bonds (the bridging B–H–B bonds), not four.

**(C) TRUE** — $\\mathrm{BH_3}$ (fragment of $\\mathrm{B_2H_6}$) is electron deficient and acts as a Lewis acid. ✓

**(D) TRUE** — Synthesis routes:
- $\\mathrm{2BF_3 + 6NaH \\rightarrow B_2H_6 + 6NaF}$ ✓
- $\\mathrm{2BF_3 + 3NaBH_4 \\rightarrow 2B_2H_6 + 3NaF}$ ✓

**(E) FALSE** — $\\mathrm{B_2H_6}$ is NOT planar. It has a butterfly/staggered structure with the bridging H atoms above and below the B–B axis.

**Answer: Option (3) — (C) and (D) only**`,
'tag_pblock11_3', src(2022, 'Jun', 24, 'Morning')),

// Q29 — Aqueous solution strongly basic — which boron compound; Answer: (4) Na2B4O7
mkSCQ('PB11-029', 'Easy',
`Aqueous solution of which of the following boron compounds will be strongly basic in nature?`,
[
  '$\\mathrm{NaBH_4}$',
  '$\\mathrm{LiBH_4}$',
  '$\\mathrm{B_2H_6}$',
  '$\\mathrm{Na_2B_4O_7}$'
],
'd',
`**Analysis:**

- $\\mathrm{NaBH_4}$ and $\\mathrm{LiBH_4}$: These hydrolyse to give $\\mathrm{B(OH)_3}$ (boric acid, weakly acidic) and $\\mathrm{H_2}$. The solution is mildly basic due to the metal hydroxide.

- $\\mathrm{B_2H_6}$: Hydrolyses to give $\\mathrm{B(OH)_3}$ (weakly acidic).

- $\\mathrm{Na_2B_4O_7}$ (borax): Hydrolyses to give $\\mathrm{NaOH}$ (strong base) and $\\mathrm{H_3BO_3}$ (weak acid):
$$\\mathrm{Na_2B_4O_7 + 7H_2O \\rightarrow 2NaOH + 4H_3BO_3}$$
The solution is **strongly basic** due to NaOH.

**Answer: Option (4) — $\\mathrm{Na_2B_4O_7}$**`,
'tag_pblock11_3', src(2022, 'Jun', 29, 'Evening')),

// Q30 — Strongest back donation from halide to boron; Answer: (4) BF3
mkSCQ('PB11-030', 'Medium',
`In which one of the following molecules strongest back donation of an electron pair from halide to boron is expected?`,
[
  '$\\mathrm{BI_3}$',
  '$\\mathrm{BBr_3}$',
  '$\\mathrm{BCl_3}$',
  '$\\mathrm{BF_3}$'
],
'd',
`**Back donation (p$\\pi$–p$\\pi$):** The halide lone pair donates into the empty p-orbital of boron.

For effective back donation, the p-orbitals of B and X must have good overlap. This requires:
- Similar size of orbitals
- Good energy match

**F** has the smallest size among halogens and its 2p orbital has the best size match with B's empty 2p orbital → **strongest** p$\\pi$–p$\\pi$ back donation in $\\mathrm{BF_3}$.

As we go down (F→Cl→Br→I), the p-orbital size increases, reducing overlap with B's 2p orbital → back donation decreases.

Order: $\\mathrm{BF_3 > BCl_3 > BBr_3 > BI_3}$

This is why $\\mathrm{BF_3}$ is the **weakest Lewis acid** among boron trihalides (back donation reduces Lewis acidity).

**Answer: Option (4) — $\\mathrm{BF_3}$**`,
'tag_pblock11_3', src(2021, 'Aug', 27, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (PB11-021 to PB11-030)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
