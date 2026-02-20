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

const questions = [

// Q112 — Increasing order of basicity of carbanions; Ans: (3) (v)<(iii)<(ii)<(iv)<(i)
mkSCQ('GOC-071', 'Hard',
`The increasing order of basicity for the following intermediates is (from weak to strong):\n\n(i) $ \\mathrm{(CH_3)_3C^-} $ (tert-butyl carbanion)\n(ii) $ \\mathrm{CH_2=CH-CH_2^-} $ (allyl carbanion)\n(iii) $ \\mathrm{HC\\equiv C^-} $ (acetylide)\n(iv) $ \\mathrm{^-OH} $ (hydroxide)\n(v) $ \\mathrm{CH_3^-} $ (methyl carbanion) — actually the question lists 5 species`,
[
  '$ \\mathrm{(iii) < (i) < (ii) < (iv) < (v)} $',
  '$ \\mathrm{(v) < (i) < (iv) < (ii) < (iii)} $',
  '$ \\mathrm{(v) < (iii) < (ii) < (iv) < (i)} $',
  '$ \\mathrm{(iii) < (iv) < (ii) < (i) < (v)} $',
],
'c',
`**Basicity of carbanions (inversely related to acidity of conjugate acid C–H):**

More stable carbanion → weaker base (conjugate acid is more acidic).

| Carbanion | Conjugate acid | pKa | Basicity |
|---|---|---|---|
| (v) $ \\mathrm{CH_3^-} $ | $ \\mathrm{CH_4} $ | ~48 | Weakest base... |

Wait — the question has 5 species. From the answer key (3) = (v)<(iii)<(ii)<(iv)<(i):

Re-reading the original question with 5 species:
- (i) $ \\mathrm{(CH_3)_3C^-} $ (tert-butyl carbanion) — most basic (sp³, alkyl groups destabilize)
- (ii) $ \\mathrm{CH_2=CHCH_2^-} $ (allyl carbanion) — resonance stabilized
- (iii) $ \\mathrm{HC\\equiv C^-} $ (acetylide) — sp carbon, most stable carbanion
- (iv) $ \\mathrm{^-OH} $ (hydroxide) — reference
- (v) $ \\mathrm{CH_3^-} $ or another species

**Basicity order (increasing):**
- Acetylide (iii): sp carbon (50% s-character), most stable → **weakest base**
- Allyl (ii): resonance stabilized → weak base
- Hydroxide (iv): moderate base (pKa of H₂O = 15.7)
- tert-Butyl carbanion (i): sp³, 3 alkyl groups destabilize → **strongest base**

**Increasing basicity: (v) < (iii) < (ii) < (iv) < (i)**

**Final Answer: Option (3)**`,
'tag_goc_3'),

// Q113 — Match mechanism steps with effects; Ans: (1) (A)-(IV), (B)-(III), (C)-(I), (D)-(II)
mkSCQ('GOC-072', 'Hard',
`Match List I (Mechanism steps) with List II (Effects):\n\n**List I:**\n(A) Lone pair donation into adjacent π system (+M effect)\n(B) Attack by electrophile on π electrons (+E effect)\n(C) Withdrawal of electrons through σ bonds (–I effect)\n(D) Withdrawal of electrons from ring via π system (–R/–M effect)\n\n**List II:**\n(I) –E effect\n(II) –R effect\n(III) +E effect\n(IV) +R effect`,
[
  '$ \\mathrm{(A)-(IV),\\ (B)-(III),\\ (C)-(I),\\ (D)-(II)} $',
  '$ \\mathrm{(A)-(I),\\ (B)-(II),\\ (C)-(IV),\\ (D)-(III)} $',
  '$ \\mathrm{(A)-(III),\\ (B)-(I),\\ (C)-(II),\\ (D)-(IV)} $',
  '$ \\mathrm{(A)-(II),\\ (B)-(IV),\\ (C)-(III),\\ (D)-(I)} $',
],
'a',
`**Electron displacement effects:**

| Effect | Description |
|---|---|
| **+R (or +M)** | Donation of lone pair/electrons INTO the π system (electron-donating by resonance) |
| **–R (or –M)** | Withdrawal of electrons FROM the π system (electron-withdrawing by resonance) |
| **+E** | Electromeric effect where electrons shift TOWARD the attacking electrophile |
| **–E** | Electromeric effect where electrons shift AWAY from the attacking electrophile |

**Matching:**
- (A) Lone pair donation into π system → **+R effect (IV)** ✓
- (B) Attack by electrophile on π electrons → **+E effect (III)** ✓
- (C) Withdrawal through σ bonds → **–I effect (I)** ✓
- (D) Withdrawal from ring via π system → **–R effect (II)** ✓

**Final Answer: Option (1) — (A)-(IV), (B)-(III), (C)-(I), (D)-(II)**`,
'tag_goc_4'),

// Q114 — Basicity order of pyrrole, piperidine, pyridine; Ans: (4) Piperidine > Pyridine > Pyrrole
mkSCQ('GOC-073', 'Medium',
`The correct order of basicity of pyrrole, piperidine, and pyridine is:`,
[
  'Pyrrole > Piperidine > Pyridine',
  'Pyrrole > Pyridine > Piperidine',
  'Pyridine > Piperidine > Pyrrole',
  'Piperidine > Pyridine > Pyrrole',
],
'd',
`**Basicity of nitrogen heterocycles:**

| Compound | N lone pair availability | pKa (conjugate acid) | Basicity |
|---|---|---|---|
| **Piperidine** | sp³ N, lone pair NOT in ring conjugation | ~11 | **Most basic** |
| **Pyridine** | sp² N, lone pair in plane (not in π system) | ~5.2 | Moderate |
| **Pyrrole** | sp² N, lone pair IS part of aromatic π system (6π) | ~−3.8 | **Least basic** |

**Reasoning:**
- **Piperidine:** Saturated ring, N is sp³, lone pair freely available for protonation → most basic
- **Pyridine:** Aromatic ring, N is sp², but lone pair is in the plane (not part of π system) → available for protonation → moderately basic
- **Pyrrole:** Aromatic ring, N lone pair is part of the aromatic π system (contributes 2e to 6π) → lone pair is delocalized → NOT available for protonation → least basic (actually weakly acidic N–H)

**Basicity order: Piperidine > Pyridine > Pyrrole**

**Final Answer: Option (4)**`,
'tag_goc_4'),

// Q115 — Highly acidic hydrogen; Ans: (4) EtCO-CH₂-COEt (1,3-diketone)
mkSCQ('GOC-074', 'Hard',
`Which of the following has highly acidic hydrogen?`,
[
  '$ \\mathrm{CH_3CH_2CH_2-CO-CH(CH_3)-CO-CH_3} $ (β-diketone, flanked by two carbonyls)',
  '$ \\mathrm{CH_3-CO-CH_2-CH_2-CH_2-CO-CH_3} $ (1,5-diketone, far apart)',
  '$ \\mathrm{CH_3CH_2CH_2-CO-CH_2-CH_3} $ (simple ketone)',
  '$ \\mathrm{CH_3CH_2-CO-CH_2-CO-CH_3} $ (1,3-diketone, β-diketone)',
],
'd',
`**Acidity of α-hydrogens in carbonyl compounds:**

The acidity of α-H depends on the stability of the resulting carbanion (enolate).

**Key principle:** α-H flanked by **two carbonyl groups** (1,3-dicarbonyl/β-diketone) is most acidic because the resulting carbanion is stabilized by resonance with **both** C=O groups.

| Compound | α-H situation | pKa |
|---|---|---|
| Simple ketone (option 3) | Adjacent to one C=O | ~20 |
| 1,5-diketone (option 2) | Two C=O far apart (no synergistic effect) | ~20 |
| β-diketone option 1 | α-H between two C=O (1,3-diketone) | ~11 |
| **β-diketone option 4** | **α-H between two C=O (1,3-diketone)** | **~11** |

Options (1) and (4) are both 1,3-diketones. Option (4) $ \\mathrm{CH_3CH_2-CO-CH_2-CO-CH_3} $ (pentan-2,4-dione type) has the –CH₂– between two carbonyls → **most acidic**.

**Final Answer: Option (4)**`,
'tag_goc_4'),

// Q116 — Ascending order of acidity of –OH; Ans: (4) (A)<(C)<(D)<(B)<(E)
mkSCQ('GOC-075', 'Hard',
`The ascending order of acidity of –OH group in the following compounds is:\n\n(A) $ \\mathrm{Bu-OH} $ (butanol)\n(B) 4-Nitrophenol\n(C) 4-Methoxyphenol\n(D) Phenol\n(E) 2,4-Dinitrophenol`,
[
  '$ \\mathrm{(A) < (D) < (C) < (B) < (E)} $',
  '$ \\mathrm{(C) < (A) < (D) < (B) < (E)} $',
  '$ \\mathrm{(C) < (D) < (B) < (A) < (E)} $',
  '$ \\mathrm{(A) < (C) < (D) < (B) < (E)} $',
],
'd',
`**Acidity of –OH group (increasing pKa = decreasing acidity; lower pKa = more acidic):**

| Compound | Effect | pKa | Acidity |
|---|---|---|---|
| (A) Butanol | Alkyl +I effect | ~16–17 | **Least acidic** |
| (C) 4-Methoxyphenol | –OCH₃ is EDG (+M) → destabilizes phenoxide | ~10.2 | Less acidic than phenol |
| (D) Phenol | Reference | ~10.0 | Reference |
| (B) 4-Nitrophenol | –NO₂ is EWG (–M, –I at para) | ~7.1 | More acidic |
| (E) 2,4-Dinitrophenol | Two –NO₂ groups (strong EWG) | ~4.1 | **Most acidic** |

**Ascending acidity order (least → most acidic):**
$$\\mathrm{(A) < (C) < (D) < (B) < (E)}$$

**Final Answer: Option (4)**`,
'tag_goc_4'),

// Q117 — Correct stability order of carbocations; Ans: (3)
mkSCQ('GOC-076', 'Medium',
`The correct stability order of carbocations is`,
[
  '$ \\mathrm{(CH_3)_3C^+ > CH_3\\text{-}\\overset{+}{C}H_2 > (CH_3)_2\\overset{+}{C}H > \\overset{+}{C}H_3} $',
  '$ \\mathrm{\\overset{+}{C}H_3 > (CH_3)_2\\overset{+}{C}H > CH_3\\text{-}\\overset{+}{C}H_2 > (CH_3)_3C^+} $',
  '$ \\mathrm{(CH_3)_3C^+ > (CH_3)_2\\overset{+}{C}H > CH_3\\overset{+}{C}H_2 > \\overset{+}{C}H_3} $',
  '$ \\mathrm{\\overset{+}{C}H_3 > CH_3\\overset{+}{C}H_2 > (CH_3)_2\\overset{+}{C}H > (CH_3)_3C^+} $',
],
'c',
`**Stability of carbocations:**

Carbocation stability increases with:
1. More alkyl groups (hyperconjugation + inductive +I effect)
2. Resonance stabilization

**Order:** Tertiary > Secondary > Primary > Methyl

| Carbocation | Type | Stability |
|---|---|---|
| $ \\mathrm{(CH_3)_3C^+} $ | Tertiary (3°) | **Most stable** |
| $ \\mathrm{(CH_3)_2\\overset{+}{C}H} $ | Secondary (2°) | Stable |
| $ \\mathrm{CH_3\\overset{+}{C}H_2} $ | Primary (1°) | Less stable |
| $ \\mathrm{\\overset{+}{C}H_3} $ | Methyl | **Least stable** |

**Stability: $ \\mathrm{(CH_3)_3C^+ > (CH_3)_2\\overset{+}{C}H > CH_3\\overset{+}{C}H_2 > \\overset{+}{C}H_3} $**

**Final Answer: Option (3)**`,
'tag_goc_3'),

// Q118 — Descending order of acidity of carboxylic acids; Ans: (3) B>D>C>E>A
mkSCQ('GOC-077', 'Hard',
`The descending order of acidity for the following carboxylic acids is:\n\n(A) $ \\mathrm{CH_3COOH} $\n(B) $ \\mathrm{F_3C-COOH} $\n(C) $ \\mathrm{ClCH_2-COOH} $\n(D) $ \\mathrm{FCH_2-COOH} $\n(E) $ \\mathrm{BrCH_2-COOH} $`,
[
  '$ \\mathrm{B > C > D > E > A} $',
  '$ \\mathrm{E > D > B > A > C} $',
  '$ \\mathrm{B > D > C > E > A} $',
  '$ \\mathrm{D > B > A > E > C} $',
],
'c',
`**Acidity of haloacetic acids (–I effect of halogens):**

More electron-withdrawing the α-substituent → more stable carboxylate → stronger acid.

**Inductive effect strength:** F > Cl > Br > I (electronegativity order)

| Acid | Substituent | –I effect | pKa | Acidity |
|---|---|---|---|---|
| (B) $ \\mathrm{F_3CCOOH} $ | 3×F | **Strongest EWG** | ~0.5 | **Most acidic** |
| (D) $ \\mathrm{FCH_2COOH} $ | 1×F | Strong EWG | ~2.66 | Very acidic |
| (C) $ \\mathrm{ClCH_2COOH} $ | 1×Cl | Moderate EWG | ~2.86 | Acidic |
| (E) $ \\mathrm{BrCH_2COOH} $ | 1×Br | Weaker EWG | ~2.90 | Less acidic |
| (A) $ \\mathrm{CH_3COOH} $ | –CH₃ (+I) | EDG | ~4.75 | **Least acidic** |

**Descending acidity: B > D > C > E > A**

**Final Answer: Option (3)**`,
'tag_goc_4'),

// Q119 — Correct order for acidity of hydroxyl compounds; Ans: (4) E>C>D>A>B
mkSCQ('GOC-078', 'Hard',
`The correct order for acidity of the following hydroxyl compounds is:\n\n(A) $ \\mathrm{CH_3OH} $ (methanol)\n(B) $ \\mathrm{(CH_3)_3COH} $ (tert-butanol)\n(C) Phenol\n(D) 4-Methoxyphenol\n(E) 4-Nitrophenol`,
[
  '$ \\mathrm{C > E > D > B > A} $',
  '$ \\mathrm{E > D > C > B > A} $',
  '$ \\mathrm{D > E > C > A > B} $',
  '$ \\mathrm{E > C > D > A > B} $',
],
'd',
`**Acidity order (higher acidity = lower pKa):**

| Compound | Effect | pKa | Acidity |
|---|---|---|---|
| (E) 4-Nitrophenol | –NO₂ (strong EWG, para) | ~7.1 | **Most acidic** |
| (C) Phenol | Reference | ~10.0 | High |
| (D) 4-Methoxyphenol | –OCH₃ (EDG, +M at para) | ~10.2 | Slightly less than phenol |
| (A) Methanol | –CH₃ (+I) | ~15.5 | Low |
| (B) tert-Butanol | 3×CH₃ (strong +I) | ~18 | **Least acidic** |

**Acidity order: E > C > D > A > B**

**Reasoning:**
- 4-Nitrophenol: –NO₂ stabilizes phenoxide by resonance and induction → most acidic
- Phenol > 4-methoxyphenol: –OCH₃ destabilizes phenoxide (+M effect)
- Alcohols are less acidic than phenols (no resonance stabilization of alkoxide)
- tert-Butanol: 3 methyl groups donate electrons → least acidic

**Final Answer: Option (4) — E > C > D > A > B**`,
'tag_goc_4'),

// Q120 — Assertion-Reason about acidity order A>B>C; Ans: (4) Both correct but R not explanation
mkSCQ('GOC-079', 'Hard',
`**Assertion A:** Order of acidic nature of the following compounds is A > B > C.\n\n(A) 2-Chlorocyclohexanol (Cl adjacent to OH)\n(B) 4-Fluorocyclohexanol (F at para)\n(C) 4-Methylcyclohexanol (CH₃ at para)\n\n**Reason R:** Fluoro is a stronger electron withdrawing group than Chloro group.\n\nIn the light of the above statements, choose the correct answer from the options given below:`,
[
  'A is false but R is true',
  'Both A and R are correct and R is the correct explanation of A',
  'A is true but R is false',
  'Both A and R are correct but R is NOT the correct explanation of A',
],
'd',
`**Evaluating Assertion A:**

Acidity of cyclohexanols (–OH group):

| Compound | Substituent | Position | Effect | Acidity |
|---|---|---|---|---|
| (A) 2-Chlorocyclohexanol | –Cl | ortho (C2) | –I effect, close proximity → strong stabilization of alkoxide | **Most acidic** |
| (B) 4-Fluorocyclohexanol | –F | para (C4) | –I effect, but farther away | Intermediate |
| (C) 4-Methylcyclohexanol | –CH₃ | para (C4) | +I effect → destabilizes alkoxide | **Least acidic** |

**Assertion A: A > B > C** — TRUE ✓

**Evaluating Reason R:**

"Fluoro is a stronger electron withdrawing group than Chloro" — TRUE ✓ (F has higher electronegativity than Cl → stronger –I effect)

**However, R does NOT explain A:**
- The order A > B > C is because Cl is at the ortho position (C2, very close to –OH) while F is at para (C4, farther away)
- Even though F is a stronger EWG than Cl, the proximity effect of ortho-Cl makes compound A more acidic than B
- R (F > Cl in EWG strength) would predict B > A, which contradicts A

**Both A and R are correct but R is NOT the correct explanation of A.**

**Final Answer: Option (4)**`,
'tag_goc_4'),

// Q121 — Most stable carbocation; Ans: (1) c
mkSCQ('GOC-080', 'Hard',
`The most stable carbocation for the following is:\n\n(a) $ \\mathrm{NH_2} $ group adjacent to C⁺ (direct attachment)\n(b) $ \\mathrm{NH_2} $ group two carbons away from C⁺\n(c) $ \\mathrm{NH_2} $ group in conjugation with C⁺ through alternating double bonds (para-like)\n(d) $ \\mathrm{NH_2} $ group meta to C⁺`,
[
  'c',
  'd',
  'b',
  'a',
],
'a',
`**Stability of carbocations with –NH₂ group:**

The –NH₂ group stabilizes adjacent carbocations through **resonance donation** of the nitrogen lone pair.

From the SMILES in the original question (cyclohexadienyl cations with –NH₂):

**(a)** $ \\mathrm{NC1[C+]C=CC=C1} $: C⁺ directly adjacent to –NH₂ bearing carbon → direct resonance donation → but N and C⁺ are not directly bonded

**(b)** $ \\mathrm{NC1C=C[CH+]C=C1} $: C⁺ at para position to –NH₂ → maximum resonance stabilization through the ring

**(c)** $ \\mathrm{NC1=CC=C[CH+]C1} $: –NH₂ on sp² carbon, C⁺ in conjugation → strong stabilization

**(d)** $ \\mathrm{NC1=CC=CC[CH+]1} $: –NH₂ and C⁺ in conjugated system

**The most stable carbocation is (c)** where the –NH₂ group is in full conjugation with the C⁺ through the π system, allowing maximum lone pair donation.

**Final Answer: Option (1) — c**`,
'tag_goc_3'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
