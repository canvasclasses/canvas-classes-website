const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_goc';

function mkSCQ(id, diff, text, opts, cid, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: cid === 'a' },
      { id: 'b', text: opts[1], is_correct: cid === 'b' },
      { id: 'c', text: opts[2], is_correct: cid === 'c' },
      { id: 'd', text: opts[3], is_correct: cid === 'd' },
    ],
    answer: { correct_option: cid },
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'JEE Main', is_pyq: true, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 90,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

function mkNVT(id, diff, text, ans, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [],
    answer: ans,
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'JEE Main', is_pyq: true, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 90,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

// Q31 — Total meta-directing groups; Ans: 4
mkNVT('GOC-031', 'Medium',
`Among the following, total number of meta directing functional groups is (Integer based):\n\n$ \\mathrm{-OCH_3,\\ -NO_2,\\ -CN,\\ -CH_3,\\ -NHCOCH_3,\\ -COR,\\ -OH,\\ -COOH,\\ -Cl} $`,
{ integer_value: 4 },
`**Meta-directing groups** are electron-withdrawing groups (EWG) that deactivate the ring and direct incoming electrophiles to the meta position.

**Evaluating each group:**

| Group | Effect | Director |
|---|---|---|
| $ \\mathrm{-OCH_3} $ | EDG (+M > –I) | ortho/para ✗ |
| **$ \\mathrm{-NO_2} $** | **EWG (–M, –I)** | **meta ✓** |
| **$ \\mathrm{-CN} $** | **EWG (–M, –I)** | **meta ✓** |
| $ \\mathrm{-CH_3} $ | EDG (+I, hyperconj.) | ortho/para ✗ |
| $ \\mathrm{-NHCOCH_3} $ | EDG (+M > –I) | ortho/para ✗ |
| **$ \\mathrm{-COR} $** | **EWG (–M, –I)** | **meta ✓** |
| $ \\mathrm{-OH} $ | EDG (+M > –I) | ortho/para ✗ |
| **$ \\mathrm{-COOH} $** | **EWG (–M, –I)** | **meta ✓** |
| $ \\mathrm{-Cl} $ | EDG (+M) > EWG (–I) → net o/p | ortho/para ✗ |

**Meta directors: –NO₂, –CN, –COR, –COOH = 4**

**Final Answer: 4**`,
'tag_goc_4'),

// Q32 — Interaction between π bond and lone pair on adjacent atom; Ans: (4) Resonance effect
mkSCQ('GOC-032', 'Medium',
`The interaction between $ \\pi $ bond and lone pair of electrons present on an adjacent atom is responsible for`,
[
  'Hyperconjugation',
  'Inductive effect',
  'Electromeric effect',
  'Resonance effect',
],
'd',
`**Types of electron displacement effects:**

| Effect | Description |
|---|---|
| **Inductive effect** | Transmission of electron density through σ bonds |
| **Hyperconjugation** | Interaction of C–H σ bond with adjacent π bond or empty p orbital |
| **Electromeric effect** | Complete transfer of π electrons to one atom under reagent influence |
| **Resonance (Mesomeric) effect** | Delocalization of electrons through conjugated system (π bond ↔ lone pair) |

**The interaction between a π bond and a lone pair on an adjacent atom** is the definition of the **resonance effect (mesomeric effect)**.

Example: In vinyl chloride ($ \\mathrm{CH_2=CH-Cl} $), the lone pair on Cl interacts with the C=C π bond → resonance stabilization.

$$\\mathrm{CH_2=CH-\\ddot{Cl} \\leftrightarrow ^-CH_2-CH=\\dot{Cl}^+}$$

**Final Answer: Option (4) — Resonance effect**`,
'tag_goc_4'),

// Q33 — Ascending acidity order of H atoms; Ans: (1) C < D < B < A
mkSCQ('GOC-033', 'Hard',
`The ascending acidity order of the following H atoms is:\n\n(A) $ \\mathrm{HC\\equiv C-H} $ (terminal alkyne H)\n(B) $ \\mathrm{H_2C=CH_2} $ (alkene H)\n(C) $ \\mathrm{(CH_3)_3C-H} $ (tertiary alkane H)\n(D) $ \\mathrm{H_3C-CH_2-H} $ (primary alkane H)`,
[
  '$ \\mathrm{C < D < B < A} $',
  '$ \\mathrm{A < B < C < D} $',
  '$ \\mathrm{A < B < D < C} $',
  '$ \\mathrm{D < C < B < A} $',
],
'a',
`**Acidity of C–H bonds depends on hybridization of carbon:**

Higher s-character → more electronegative carbon → better stabilization of carbanion → **more acidic C–H bond**.

| Compound | Hybridization | s-character | pKa | Acidity |
|---|---|---|---|---|
| (A) $ \\mathrm{HC\\equiv CH} $ | sp | 50% | ~25 | **Most acidic** |
| (B) $ \\mathrm{H_2C=CH_2} $ | sp² | 33% | ~44 | Moderately acidic |
| (C) $ \\mathrm{(CH_3)_3CH} $ | sp³ | 25% | ~51 | Less acidic |
| (D) $ \\mathrm{CH_3CH_3} $ | sp³ | 25% | ~50 | Less acidic |

**For sp³ carbons:** More alkyl groups → more electron-donating → destabilizes carbanion → **less acidic**.
- Tertiary C–H (C) < Primary C–H (D) in acidity

**Ascending acidity order (least → most acidic):**
$$\\mathrm{C < D < B < A}$$

**Final Answer: Option (1) — C < D < B < A**`,
'tag_goc_4'),

// Q34 — Match pKa values; Ans: (4) A-II, B-I, C-IV, D-III
mkSCQ('GOC-034', 'Hard',
`Match List I with List II:\n\n| List I (Compound) | | List II (pKa value) |\n|---|---|---|\n| A. Ethanol | | I. 10.0 |\n| B. Phenol | | II. 15.9 |\n| C. m-Nitrophenol | | III. 7.1 |\n| D. p-Nitrophenol | | IV. 8.3 |\n\nChoose the correct answer from the options given below:`,
[
  'A-I, B-II, C-III, D-IV',
  'A-IV, B-I, C-II, D-III',
  'A-III, B-IV, C-I, D-II',
  'A-II, B-I, C-IV, D-III',
],
'd',
`**pKa values of alcohols and phenols:**

| Compound | pKa | Reasoning |
|---|---|---|
| **Ethanol (A)** | **15.9** | Alcohol, weak acid; alkyl group donates electrons → high pKa |
| **Phenol (B)** | **10.0** | Phenoxide stabilized by resonance with ring → more acidic than alcohol |
| **m-Nitrophenol (C)** | **8.3** | –NO₂ at meta: only inductive EWG effect → moderately more acidic than phenol |
| **p-Nitrophenol (D)** | **7.1** | –NO₂ at para: both inductive AND resonance EWG → most acidic of phenols listed |

**Matching:**
- A (Ethanol) → II (15.9) ✓
- B (Phenol) → I (10.0) ✓
- C (m-Nitrophenol) → IV (8.3) ✓
- D (p-Nitrophenol) → III (7.1) ✓

**Final Answer: Option (4) — A-II, B-I, C-IV, D-III**`,
'tag_goc_4'),

// Q35 — Set of meta directing groups; Ans: (3)
mkSCQ('GOC-035', 'Medium',
`The set of meta directing functional groups from the following sets is:`,
[
  '$ \\mathrm{-CN,\\ -NH_2,\\ -NHR,\\ -OCH_3} $',
  '$ \\mathrm{-NO_2,\\ -NH_2,\\ -COOH,\\ -COOR} $',
  '$ \\mathrm{-NO_2,\\ -CHO,\\ -SO_3H,\\ -COR} $',
  '$ \\mathrm{-CN,\\ -CHO,\\ -NHCOCH_3,\\ -COOR} $',
],
'c',
`**Meta-directing groups** are electron-withdrawing groups (EWG) that direct electrophiles to the meta position.

**Evaluating each option:**

**(1)** –CN (meta ✓), –NH₂ (o/p ✗), –NHR (o/p ✗), –OCH₃ (o/p ✗) → Mixed ✗

**(2)** –NO₂ (meta ✓), –NH₂ (o/p ✗), –COOH (meta ✓), –COOR (meta ✓) → Mixed ✗

**(3)** –NO₂ (meta ✓), –CHO (meta ✓), –SO₃H (meta ✓), –COR (meta ✓) → **All meta** ✓

**(4)** –CN (meta ✓), –CHO (meta ✓), –NHCOCH₃ (o/p ✗), –COOR (meta ✓) → Mixed ✗

**All four groups in option (3) are EWGs and meta directors:**
- –NO₂: strong EWG (–M, –I)
- –CHO: EWG (–M, –I)
- –SO₃H: EWG (–I)
- –COR: EWG (–M, –I)

**Final Answer: Option (3)**`,
'tag_goc_4'),

// Q36 — Functional group showing negative resonance effect; Ans: (3) –COOH
mkSCQ('GOC-036', 'Medium',
`The functional group that shows negative resonance effect is:`,
[
  '$ \\mathrm{-NH_2} $',
  '$ \\mathrm{-OH} $',
  '$ \\mathrm{-COOH} $',
  '$ \\mathrm{-OR} $',
],
'c',
`**Resonance effects:**

- **Positive resonance effect (+M or +R):** Groups that donate electrons into the ring/π system via resonance. Groups with lone pairs adjacent to π system.
- **Negative resonance effect (–M or –R):** Groups that withdraw electrons from the ring/π system via resonance. Groups with π bonds that extend conjugation by withdrawing.

| Group | Resonance effect | Reason |
|---|---|---|
| –NH₂ | **+M** | Lone pair on N donates into ring |
| –OH | **+M** | Lone pair on O donates into ring |
| **–COOH** | **–M** | C=O withdraws electrons from ring via resonance |
| –OR | **+M** | Lone pair on O donates into ring |

**–COOH** has a C=O group that can accept electron density from the ring through resonance → **negative resonance effect (–M effect)**.

**Final Answer: Option (3) — –COOH**`,
'tag_goc_4'),

// Q37 — Strongest acid; Ans: (1) m-nitrophenol
mkSCQ('GOC-037', 'Medium',
`The strongest acid from the following is`,
[
  'm-Nitrophenol ($ \\mathrm{3-NO_2-C_6H_4OH} $)',
  'm-Cresol ($ \\mathrm{3-CH_3-C_6H_4OH} $)',
  'm-Chlorophenol ($ \\mathrm{3-Cl-C_6H_4OH} $)',
  'Phenol ($ \\mathrm{C_6H_5OH} $)',
],
'a',
`**Acidity of substituted phenols:**

More electron-withdrawing the substituent → more stable phenoxide → stronger acid.

| Compound | Substituent | Effect on acidity |
|---|---|---|
| **(1) m-Nitrophenol** | –NO₂ (meta) | Strong EWG (–I effect at meta) → **most acidic** |
| (2) m-Cresol | –CH₃ (meta) | EDG (+I) → less acidic than phenol |
| (3) m-Chlorophenol | –Cl (meta) | Weak EWG (–I at meta, no resonance) → more acidic than phenol but less than m-NO₂ |
| (4) Phenol | None | Reference |

**Acidity order:** m-Nitrophenol > m-Chlorophenol > Phenol > m-Cresol

**Note:** –NO₂ is a much stronger EWG than –Cl, so m-nitrophenol is the strongest acid.

**Final Answer: Option (1) — m-Nitrophenol**`,
'tag_goc_4'),

// Q38 — Shortest C–Cl bond; Ans: (4) vinyl chloride CH₂=CHCl
mkSCQ('GOC-038', 'Hard',
`Among the following compounds, which one has the shortest $ \\mathrm{C-Cl} $ bond?`,
[
  '$ \\mathrm{(CH_3)_3CCl} $ (tert-butyl chloride)',
  '$ \\mathrm{CH_2=CH-CH_2Cl} $ (allyl chloride)',
  '$ \\mathrm{H_3C-Cl} $ (methyl chloride)',
  '$ \\mathrm{CH_2=CHCl} $ (vinyl chloride)',
],
'd',
`**C–Cl bond length depends on hybridization of carbon:**

Higher s-character of carbon → shorter bond length (carbon is more electronegative, holds electrons closer).

| Compound | C hybridization | s-character | C–Cl bond length |
|---|---|---|---|
| $ \\mathrm{(CH_3)_3CCl} $ | sp³ | 25% | Longest (~1.79 Å) |
| $ \\mathrm{CH_2=CHCH_2Cl} $ (allyl) | sp³ (C bearing Cl) | 25% | Long |
| $ \\mathrm{CH_3Cl} $ | sp³ | 25% | ~1.78 Å |
| **$ \\mathrm{CH_2=CHCl} $ (vinyl)** | **sp²** | **33%** | **Shortest (~1.69 Å)** |

**Additional factor in vinyl chloride:** The C–Cl bond has partial double bond character due to resonance (lone pair of Cl donates into C=C), making it even shorter.

$$\\mathrm{CH_2=CH-\\ddot{Cl} \\leftrightarrow ^-CH_2-CH=\\dot{Cl}^+}$$

**Final Answer: Option (4) — $ \\mathrm{CH_2=CHCl} $ (vinyl chloride)**`,
'tag_goc_4'),

// Q39 — Correct order of stability for alkoxides; Ans: (2) (C)>(B)>(A)
mkSCQ('GOC-039', 'Hard',
`The correct order of stability for the following alkoxides is:\n\n(A) $ \\mathrm{CH_3CH([O^-])NO_2} $ (nitro group on same C as O⁻)\n(B) $ \\mathrm{CH_2=C([O^-])NO_2} $ (vinyl alkoxide with NO₂)\n(C) $ \\mathrm{O_2N-CH=CH-O^-} $ (conjugated vinyl alkoxide with NO₂)`,
[
  '$ \\mathrm{(B) > (A) > (C)} $',
  '$ \\mathrm{(C) > (B) > (A)} $',
  '$ \\mathrm{(C) > (A) > (B)} $',
  '$ \\mathrm{(B) > (C) > (A)} $',
],
'b',
`**Stability of alkoxides (carbanion-like, O⁻ stabilization):**

Greater delocalization of negative charge → greater stability.

**Analyzing each:**

**(A) $ \\mathrm{CH_3-CH(O^-)-NO_2} $:**
- O⁻ on sp³ carbon
- –NO₂ provides –I effect (inductive stabilization only)
- No resonance delocalization of O⁻ charge
- **Least stable**

**(B) $ \\mathrm{CH_2=C(O^-)-NO_2} $:**
- O⁻ on sp² carbon (vinyl position)
- Resonance: $ \\mathrm{CH_2=C(O^-)-NO_2 \\leftrightarrow ^-CH_2-C(=O)-NO_2} $
- Some delocalization
- **Intermediate stability**

**(C) $ \\mathrm{O_2N-CH=CH-O^-} $:**
- O⁻ on sp² carbon, conjugated with C=C and –NO₂
- Extended resonance: $ \\mathrm{O_2N-CH=CH-O^- \\leftrightarrow O_2N^--CH-CH=O} $
- Maximum delocalization through the conjugated system
- **Most stable**

**Stability order: (C) > (B) > (A)**

**Final Answer: Option (2)**`,
'tag_goc_4'),

// Q40 — Increasing order of C–OH bond length; Ans: (3) phenol < p-ethoxyphenol < methanol
mkSCQ('GOC-040', 'Hard',
`Arrange the following compounds in increasing order of $ \\mathrm{C-OH} $ bond length: methanol, phenol, p-ethoxyphenol`,
[
  'methanol < p-ethoxyphenol < phenol',
  'phenol < methanol < p-ethoxyphenol',
  'phenol < p-ethoxyphenol < methanol',
  'methanol < phenol < p-ethoxyphenol',
],
'c',
`**C–OH bond length depends on bond order (resonance/partial double bond character):**

Higher bond order → shorter C–O bond.

**Analysis:**

**(1) Phenol ($ \\mathrm{C_6H_5OH} $):**
- C–OH carbon is sp² (benzene ring)
- Resonance: lone pair of O donates into ring → C–O has partial double bond character
- **Shortest C–OH bond** (highest bond order)

**(2) p-Ethoxyphenol ($ \\mathrm{C_2H_5O-C_6H_4-OH} $):**
- The –OH group is on the ring (sp² carbon)
- –OC₂H₅ at para position donates electrons via resonance → increases electron density at the –OH carbon → slightly reduces C–OH bond order compared to phenol
- **Intermediate C–OH bond length**

**(3) Methanol ($ \\mathrm{CH_3OH} $):**
- C–OH carbon is sp³
- No resonance, pure single bond
- **Longest C–OH bond**

**Increasing C–OH bond length: phenol < p-ethoxyphenol < methanol**

**Final Answer: Option (3)**`,
'tag_goc_4'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
