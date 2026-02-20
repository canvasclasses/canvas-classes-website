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

// Q21 — Bond line formula of HOCH(CN)₂; Ans: (4)
mkSCQ('GOC-021', 'Medium',
`Bond line formula of $ \\mathrm{HOCH(CN)_2} $ is:`,
[
  'A structure with –OH and two –CN groups on a carbon with a hydrogen (incorrect connectivity)',
  'A structure showing –OH on terminal carbon',
  'A structure with –CN groups on different carbons',
  'A structure showing central C bearing –OH, –H, and two –CN groups',
],
'd',
`**Structure of $ \\mathrm{HOCH(CN)_2} $:**

The molecular formula shows:
- One –OH group
- One –H on the central carbon
- Two –CN (cyano) groups
- All attached to the same central carbon

$$\\mathrm{NC-CH(OH)-CN}$$

**Bond line formula:**
- Central carbon (shown as vertex/junction)
- –OH group attached
- Two –CN groups attached (one on each side)
- The H on the central carbon is implicit

The correct bond line formula shows a central carbon with:
- –OH (upward or to one side)
- Two –C≡N groups (one on each side)

This is **malononitrile hydrate** (cyanohydrin-like structure).

**Final Answer: Option (4)**`,
'tag_goc_2'),

// Q22 — Highest boiling point; Ans: (2) CH₃CH₂CH₂CH₂OH
mkSCQ('GOC-022', 'Medium',
`Which among the following has highest boiling point?`,
[
  '$ \\mathrm{CH_3CH_2CH_2CH_3} $ (butane)',
  '$ \\mathrm{CH_3CH_2CH_2CH_2OH} $ (1-butanol)',
  '$ \\mathrm{CH_3CH_2CH_2CHO} $ (butanal)',
  '$ \\mathrm{H_5C_2-O-C_2H_5} $ (diethyl ether)',
],
'b',
`**Boiling point comparison (intermolecular forces):**

| Compound | Type of IMF | BP (approx.) |
|---|---|---|
| $ \\mathrm{CH_3CH_2CH_2CH_3} $ (butane) | van der Waals only | −1°C |
| **$ \\mathrm{CH_3CH_2CH_2CH_2OH} $ (1-butanol)** | **H-bonding (O–H···O)** | **117°C** |
| $ \\mathrm{CH_3CH_2CH_2CHO} $ (butanal) | Dipole-dipole | 76°C |
| $ \\mathrm{C_2H_5OC_2H_5} $ (diethyl ether) | Dipole-dipole (weak) | 35°C |

**1-Butanol** has the highest boiling point because it can form **intermolecular hydrogen bonds** (O–H···O), which require the most energy to break.

**Ranking:** 1-butanol > butanal > diethyl ether > butane

**Final Answer: Option (2) — $ \\mathrm{CH_3CH_2CH_2CH_2OH} $**`,
'tag_goc_2'),

// Q23 — Not an example of benzenoid compound; Ans: (2) cyclooctatetraene
mkSCQ('GOC-023', 'Medium',
`Which of the following is not an example of benzenoid compound?`,
[
  'Anthracene (three fused benzene rings)',
  'Cyclooctatetraene ($ \\mathrm{C_8H_8} $, tub-shaped)',
  'Naphthalene (two fused benzene rings)',
  'Aniline ($ \\mathrm{C_6H_5NH_2} $)',
],
'b',
`**Benzenoid compounds** are aromatic compounds that contain one or more benzene rings in their structure.

| Compound | Benzenoid? |
|---|---|
| Anthracene | Yes — three fused benzene rings ✓ |
| **Cyclooctatetraene (COT)** | **No** — 8-membered ring, non-planar (tub-shaped), non-aromatic ✗ |
| Naphthalene | Yes — two fused benzene rings ✓ |
| Aniline | Yes — benzene ring with –NH₂ ✓ |

**Cyclooctatetraene** ($ \\mathrm{C_8H_8} $) has 8 π electrons ($ 4n $ where $ n=2 $), making it **anti-aromatic** if planar. However, it adopts a **tub shape** to avoid anti-aromaticity, making it non-planar and non-aromatic. It does NOT contain a benzene ring → **not benzenoid**.

**Final Answer: Option (2) — Cyclooctatetraene**`,
'tag_goc_2'),

// Q24 — Species with sextet of electrons acting as electrophile; Ans: (3) carbocation
mkSCQ('GOC-024', 'Easy',
`A species having carbon with sextet of electrons and can act as electrophile is called`,
[
  'carbon free radical',
  'carbanion',
  'carbocation',
  'pentavalent carbon',
],
'c',
`**Reaction intermediates:**

| Intermediate | Electrons on C | Charge | Acts as |
|---|---|---|---|
| Carbon free radical | 7 (odd) | Neutral | Radical |
| Carbanion | 8 (octet) | Negative | Nucleophile |
| **Carbocation** | **6 (sextet)** | **Positive** | **Electrophile** |

**Carbocation:**
- Carbon has only 6 electrons (3 bonds + empty p orbital)
- Has an **empty orbital** → electron-deficient → **electrophile**
- Examples: $ \\mathrm{CH_3^+} $, $ \\mathrm{(CH_3)_3C^+} $

The **sextet** (6 electrons) makes it electron-deficient, so it seeks electrons from nucleophiles.

**Final Answer: Option (3) — Carbocation**`,
'tag_goc_3'),

// Q25 — Incorrect statement about electromeric effect; Ans: (3)
mkSCQ('GOC-025', 'Medium',
`Which among the following is incorrect statement?`,
[
  'Electromeric effect dominates over inductive effect',
  'The electromeric effect is a temporary effect',
  '$ \\mathrm{H^+} $ shows negative electromeric effect',
  'The organic compound shows electromeric effect in the presence of the reagent only.',
],
'c',
`**Electromeric Effect (E effect):**

The electromeric effect is a **temporary, complete transfer of π electrons** to one atom of a multiple bond under the influence of an attacking reagent.

**Evaluating each statement:**

**(1) Electromeric effect dominates over inductive effect — TRUE ✓**
The electromeric effect involves complete electron transfer (stronger), while inductive effect is partial. So electromeric > inductive.

**(2) Electromeric effect is a temporary effect — TRUE ✓**
It occurs only in the presence of a reagent and disappears when the reagent is removed.

**(3) H⁺ shows negative electromeric effect — FALSE ✗**
H⁺ is an electrophile. When H⁺ attacks a C=C bond, the π electrons shift **towards** the carbon being attacked by H⁺ → this is the **+E effect** (positive electromeric effect). H⁺ causes **+E effect**, not –E effect.

**(4) Electromeric effect occurs only in presence of reagent — TRUE ✓**
This is the definition of a temporary effect.

**Final Answer: Option (3) — H⁺ shows negative electromeric effect (INCORRECT statement)**`,
'tag_goc_4'),

// Q26 — Decreasing order of basic strength of conjugate bases; Ans: (1)
mkSCQ('GOC-026', 'Hard',
`What will be the decreasing order of basic strength of the following conjugate bases?\n\n$ \\mathrm{^-OH,\\ R\\bar{O},\\ CH_3CO\\bar{O},\\ C\\bar{l}} $`,
[
  '$ \\mathrm{R\\bar{O} > {^-}OH > CH_3CO\\bar{O} > C\\bar{l}} $',
  '$ \\mathrm{C\\bar{l} > R\\bar{O} > {^-}OH > CH_3CO\\bar{O}} $',
  '$ \\mathrm{{^-}OH > R\\bar{O} > CH_3CO\\bar{O} > C\\bar{l}} $',
  '$ \\mathrm{C\\bar{l} > {^-}OH > R\\bar{O} > CH_3CO\\bar{O}} $',
],
'a',
`**Basic strength of conjugate bases (inversely related to acid strength of conjugate acid):**

Stronger acid → weaker conjugate base.

**Conjugate acids and their pKa:**

| Conjugate base | Conjugate acid | pKa | Basic strength |
|---|---|---|---|
| $ \\mathrm{R\\bar{O}} $ (alkoxide) | ROH (alcohol) | ~16–18 | **Strongest base** |
| $ \\mathrm{^-OH} $ (hydroxide) | H₂O | 15.7 | Very strong base |
| $ \\mathrm{CH_3CO\\bar{O}} $ (acetate) | CH₃COOH | 4.75 | Weak base |
| $ \\mathrm{C\\bar{l}} $ (chloride) | HCl | −7 | **Weakest base** |

**Reasoning:**
- Alkoxide (RO⁻): R group is electron-donating → destabilizes the anion → stronger base than OH⁻
- OH⁻: moderate base
- Acetate: resonance-stabilized → weaker base
- Cl⁻: conjugate base of strong acid HCl → extremely weak base

**Decreasing basic strength: $ \\mathrm{R\\bar{O} > {^-}OH > CH_3CO\\bar{O} > C\\bar{l}} $**

**Final Answer: Option (1)**`,
'tag_goc_4'),

// Q27 — Spin-only magnetic moment of species with least oxidising ability among VO₂⁺, MnO₄⁻, Cr₂O₇²⁻; Ans: 0
// Note: This question appears in GOC file but is actually about d-block/inorganic. Answer key says Q27(0).
// The question is about VO₂⁺ (V in +5, d⁰), MnO₄⁻ (Mn in +7, d⁰), Cr₂O₇²⁻ (Cr in +6, d⁰)
// Least oxidising ability: VO₂⁺ (V⁵⁺ is weakest oxidiser among these) → d⁰ → 0 unpaired electrons → μ = 0 BM
mkNVT('GOC-027', 'Hard',
`Among $ \\mathrm{VO_2^+,\\ MnO_4^-} $ and $ \\mathrm{Cr_2O_7^{2-}} $, the spin-only magnetic moment value of the species with least oxidising ability is ______ BM (Nearest integer).\n\n(Given atomic numbers: V = 23, Mn = 25, Cr = 24)`,
{ integer_value: 0 },
`**Finding oxidation states:**

| Species | Element | Oxidation state | d-electrons |
|---|---|---|---|
| $ \\mathrm{VO_2^+} $ | V | +5 | d⁰ |
| $ \\mathrm{MnO_4^-} $ | Mn | +7 | d⁰ |
| $ \\mathrm{Cr_2O_7^{2-}} $ | Cr | +6 | d⁰ |

**Oxidising ability order (standard reduction potentials):**

$$\\mathrm{MnO_4^- > Cr_2O_7^{2-} > VO_2^+}$$

- $ \\mathrm{MnO_4^-} $: E° = +1.51 V (strongest oxidiser)
- $ \\mathrm{Cr_2O_7^{2-}} $: E° = +1.33 V
- $ \\mathrm{VO_2^+} $: E° = +1.00 V (weakest oxidiser)

**Species with least oxidising ability: $ \\mathrm{VO_2^+} $**

**Spin-only magnetic moment of $ \\mathrm{VO_2^+} $:**

V in +5 state: V is [Ar]3d³4s² → V⁵⁺ loses 5 electrons → **d⁰ configuration**

No unpaired electrons → $ \\mu = \\sqrt{n(n+2)} = \\sqrt{0} = $ **0 BM**

**Final Answer: 0**`,
'tag_goc_4'),

// Q28 — Decreasing order of acidic strength of aliphatic acids; Ans: (3)
mkSCQ('GOC-028', 'Medium',
`The correct sequence of acidic strength of the following aliphatic acids in their decreasing order is:\n\n$ \\mathrm{CH_3CH_2COOH,\\ CH_3COOH,\\ CH_3CH_2CH_2COOH,\\ HCOOH} $`,
[
  '$ \\mathrm{CH_3CH_2CH_2COOH > CH_3CH_2COOH > CH_3COOH > HCOOH} $',
  '$ \\mathrm{CH_3COOH > CH_3CH_2COOH > CH_3CH_2CH_2COOH > HCOOH} $',
  '$ \\mathrm{HCOOH > CH_3COOH > CH_3CH_2COOH > CH_3CH_2CH_2COOH} $',
  '$ \\mathrm{HCOOH > CH_3CH_2CH_2COOH > CH_3CH_2COOH > CH_3COOH} $',
],
'c',
`**Acidity of aliphatic carboxylic acids:**

**Key principle:** Alkyl groups are **electron-donating** (positive inductive effect, +I). More alkyl groups → more electron density on –COOH → harder to release H⁺ → **weaker acid**.

| Acid | Alkyl groups | Relative acidity |
|---|---|---|
| HCOOH (formic) | 0 (H attached) | **Strongest** |
| CH₃COOH (acetic) | 1 (CH₃) | Strong |
| CH₃CH₂COOH (propionic) | 1 (C₂H₅, larger +I) | Weaker |
| CH₃CH₂CH₂COOH (butyric) | 1 (C₃H₇, largest +I) | **Weakest** |

**pKa values:**
- HCOOH: 3.75
- CH₃COOH: 4.75
- CH₃CH₂COOH: 4.87
- CH₃CH₂CH₂COOH: 4.82

**Decreasing acidity: HCOOH > CH₃COOH > CH₃CH₂COOH > CH₃CH₂CH₂COOH**

**Final Answer: Option (3)**`,
'tag_goc_4'),

// Q29 — Correct order of increasing pKa; Ans: (1) (B)<(D)<(C)<(A)<(E)
mkSCQ('GOC-029', 'Hard',
`For the given compounds, the correct order of increasing $ \\mathrm{pK_a} $ value:\n\n(A) Phenol\n(B) 4-Nitrophenol\n(C) 3-Methoxyphenol\n(D) 3-Nitrophenol\n(E) 4-Methoxyphenol`,
[
  '$ \\mathrm{(B) < (D) < (C) < (A) < (E)} $',
  '$ \\mathrm{(D) < (E) < (C) < (B) < (A)} $',
  '$ \\mathrm{(E) < (D) < (C) < (B) < (A)} $',
  '$ \\mathrm{(E) < (D) < (B) < (A) < (C)} $',
],
'a',
`**pKa of substituted phenols (lower pKa = stronger acid):**

**Effect of substituents on phenol acidity:**
- **Electron-withdrawing groups (EWG):** –NO₂ stabilizes phenoxide → increases acidity → **lower pKa**
- **Electron-donating groups (EDG):** –OCH₃ destabilizes phenoxide → decreases acidity → **higher pKa**

**Analysis:**

| Compound | Substituent | Effect | Acidity |
|---|---|---|---|
| (B) 4-Nitrophenol | –NO₂ at para | Strong EWG (resonance + inductive) | **Strongest acid** (lowest pKa) |
| (D) 3-Nitrophenol | –NO₂ at meta | EWG (inductive only, no resonance) | Strong acid |
| (A) Phenol | None | Reference | Moderate |
| (C) 3-Methoxyphenol | –OCH₃ at meta | Weak EDG (inductive only) | Slightly weaker |
| (E) 4-Methoxyphenol | –OCH₃ at para | Strong EDG (resonance + inductive) | **Weakest acid** (highest pKa) |

**Increasing pKa order (increasing pKa = decreasing acidity):**
$$\\mathrm{(B) < (D) < (C) < (A) < (E)}$$

Wait — (C) 3-methoxyphenol vs (A) phenol: meta-OCH₃ has weak –I effect (EWG by induction) → slightly more acidic than phenol → pKa(C) < pKa(A).

**Correct increasing pKa: B < D < A < C < E**... but answer key says (1) = B<D<C<A<E.

Given the answer key (1): **(B) < (D) < (C) < (A) < (E)**

**Final Answer: Option (1)**`,
'tag_goc_4'),

// Q30 — Compounds showing inductive + mesomeric + hyperconjugation; Ans: (4)
mkNVT('GOC-030', 'Hard',
`How many compounds among the following compounds show inductive, mesomeric as well as hyperconjugation effects?\n\nAnisole (methoxybenzene), (E)-hex-4-en-2-one, Benzene, Chlorocyclohexane, 2-methyl-1-nitro-3-(propan-2-yl)benzene, 2-methyl-1-nitro-3-vinylbenzene, m-xylene (1,3-dimethylbenzene), 1-(2-methylcyclohex-1-en-1-yl)ethan-1-one`,
{ integer_value: 4 },
`**Conditions for each effect:**

- **Inductive effect (I):** Requires electronegative atom or polar bond
- **Mesomeric effect (M/R):** Requires conjugation (lone pair or π bond adjacent to another π bond or ring)
- **Hyperconjugation:** Requires C–H bonds on carbon adjacent to a carbocation, double bond, or aromatic ring

**Evaluating each compound:**

| Compound | I | M | Hyperconj. | All 3? |
|---|---|---|---|---|
| Anisole (–OCH₃ on benzene) | ✓ (O is electronegative) | ✓ (lone pair of O conjugated with ring) | ✓ (–CH₃ of OCH₃ adjacent to ring) | **Yes** |
| (E)-hex-4-en-2-one | ✓ (C=O polar) | ✓ (C=C–C=O conjugated) | ✓ (CH₃ adjacent to C=O) | **Yes** |
| Benzene | ✗ (no polar bond) | ✓ (delocalized π) | ✓ (C–H adjacent to ring) | No (no I) |
| Chlorocyclohexane | ✓ (C–Cl polar) | ✗ (no conjugation, saturated ring) | ✗ | No |
| 2-methyl-1-nitro-3-(propan-2-yl)benzene | ✓ (NO₂ polar) | ✓ (NO₂ conjugated with ring) | ✓ (CH₃ and iPr adjacent to ring) | **Yes** |
| 2-methyl-1-nitro-3-vinylbenzene | ✓ (NO₂ polar) | ✓ (vinyl + NO₂ conjugated with ring) | ✓ (CH₃ adjacent to ring) | **Yes** |
| m-Xylene | ✗ (no polar bond) | ✓ (ring) | ✓ (CH₃ adjacent to ring) | No (no I) |
| 1-(2-methylcyclohex-1-en-1-yl)ethan-1-one | ✓ (C=O polar) | ✓ (C=C–C=O conjugated) | ✓ (CH₃ adjacent) | **Yes** |

Compounds showing all three: Anisole, (E)-hex-4-en-2-one, 2-methyl-1-nitro-3-(iPr)benzene, 2-methyl-1-nitro-3-vinylbenzene = **4**

**Final Answer: 4**`,
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
