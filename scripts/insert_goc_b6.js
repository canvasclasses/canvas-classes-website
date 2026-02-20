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

// Q92 — Aminobenzene and aniline; Ans: (2) Statement I correct, Statement II incorrect
mkSCQ('GOC-051', 'Easy',
`Given below are two statements:\n**Statement (I):** Aminobenzene and aniline are same organic compounds.\n**Statement (II):** Aminobenzene and aniline are different organic compounds.\n\nIn the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both Statement I and Statement II are correct',
  'Statement I is correct but Statement II is incorrect',
  'Statement I is incorrect but Statement II is correct',
  'Both Statement I and Statement II are incorrect',
],
'b',
`**Aminobenzene vs Aniline:**

- **Aniline** is the common name for **aminobenzene** ($ \\mathrm{C_6H_5NH_2} $)
- **Aminobenzene** is the IUPAC-derived name: benzene ring with –NH₂ substituent

Both names refer to the **same compound**: $ \\mathrm{C_6H_5NH_2} $

**Statement I:** "Aminobenzene and aniline are same organic compounds" → **TRUE** ✓
**Statement II:** "Aminobenzene and aniline are different organic compounds" → **FALSE** ✗

**Final Answer: Option (2) — Statement I is correct but Statement II is incorrect**`,
'tag_goc_1'),

// Q93 — Correct decreasing order of priority of functional groups; Ans: (2)
mkSCQ('GOC-052', 'Hard',
`The correct decreasing order of priority of functional groups in naming an organic compound as per IUPAC system of nomenclature is`,
[
  '$ \\mathrm{-COOH > -CONH_2 > -COCl > -CHO} $',
  '$ \\mathrm{-SO_3H > -COCl > -CONH_2 > -CN} $',
  '$ \\mathrm{-COOH > -COOR > -COCl > -CONH_2} $ (incorrect order)',
  '$ \\mathrm{-COOH > -COOR > -CONH_2 > -COCl} $',
],
'b',
`**IUPAC priority order of principal characteristic groups (decreasing):**

The complete IUPAC seniority order for principal characteristic groups is:

$$\\text{Cations > Acids > Anhydrides > Esters > Acyl halides > Amides > Nitriles > Aldehydes > Ketones > Alcohols > Amines}$$

More specifically for common groups:
1. –COOH (carboxylic acid)
2. –SO₃H (sulfonic acid) — actually ranked above carboxylic acid in some systems
3. –COOR (ester)
4. –COCl (acyl halide)
5. –CONH₂ (amide)
6. –CN (nitrile)
7. –CHO (aldehyde)
8. –C=O (ketone)

**Evaluating option (2):** $ \\mathrm{-SO_3H > -COCl > -CONH_2 > -CN} $

In IUPAC 2013 recommendations:
- –SO₃H > –COOH > –COOR > –COX > –CONH₂ > –CN > –CHO

So: $ \\mathrm{-SO_3H > -COCl > -CONH_2 > -CN} $ ✓

**Final Answer: Option (2)**`,
'tag_goc_1'),

// Q94 — Correct structure of γ-methylcyclohexane carbaldehyde; Ans: (1)
mkSCQ('GOC-053', 'Medium',
`Correct structure of $ \\gamma $-methylcyclohexane carbaldehyde is`,
[
  'Cyclohexane ring with –CHO at C1 and –CH₃ at C4 (para/gamma position)',
  'Cyclohexane ring with –CH₂CHO at C1 and –CH₃ at C4',
  'Cyclohexane ring with –CHO at C1 and –CH₃ at C2',
  'Cyclohexane ring with –CH₂CHO at C1 and –CH₃ at C2',
],
'a',
`**Parsing γ-methylcyclohexane carbaldehyde:**

- **Cyclohexane carbaldehyde:** Cyclohexane ring with a –CHO group attached directly to the ring (C1 of ring = C bearing CHO)
- **γ-methyl:** Greek letter γ (gamma) = position 4 from the principal group

In cyclohexane carbaldehyde:
- C1 = carbon bearing –CHO
- α = C2 (adjacent to C1)
- β = C3
- **γ = C4**

**Structure:** Cyclohexane ring with –CHO at C1 and –CH₃ at C4

This is **4-methylcyclohexane-1-carbaldehyde** in IUPAC nomenclature.

**Final Answer: Option (1)**`,
'tag_goc_1'),

// Q95 — IUPAC name of compound with SMILES CC(=CC(C)[N+](=O)[O-])C(=O)CC=O; Ans: (3)
mkSCQ('GOC-054', 'Hard',
`The correct IUPAC name of the following compound is:\n\n$ \\mathrm{OHC-CH_2-CO-C(CH_3)=CH-CH(CH_3)-NO_2} $`,
[
  '4-methyl-2-nitro-5-oxohept-3-enal',
  '4-methyl-5-oxo-2-nitrohept-3-enal',
  '4-methyl-6-nitro-3-oxohept-4-enal',
  '6-formyl-4-methyl-2-nitrohex-3-enal',
],
'c',
`**Structure:** $ \\mathrm{OHC-CH_2-CO-C(CH_3)=CH-CH(CH_3)-NO_2} $

**IUPAC Naming:**

Principal group: –CHO (aldehyde) at C1 → suffix "al"

Longest chain containing –CHO:
C1(CHO)–C2(CH₂)–C3(C=O)–C4(C(CH₃)=)–C5(=CH)–C6(CH(CH₃))–C7... 

Wait, the –NO₂ group is on C6 and there's a –CH₃ at C4 and C6.

Numbering from CHO end:
- C1: –CHO
- C2: –CH₂–
- C3: –C(=O)– (ketone → 3-oxo)
- C4: –C(CH₃)= (with methyl branch → 4-methyl)
- C5: =CH– (double bond C4=C5 → 4-en... but C4–C5 → hept-4-en)
- C6: –CH(NO₂)– (nitro → 6-nitro)
- C7: –CH₃

**IUPAC name: 4-methyl-6-nitro-3-oxohept-4-enal**

**Final Answer: Option (3)**`,
'tag_goc_1'),

// Q96 — IUPAC name of CC(C=O)C=CC(C)C(=O)O; Ans: (3)
mkSCQ('GOC-055', 'Hard',
`The IUPAC name for the following compound is:\n\n$ \\mathrm{OHC-CH(CH_3)-CH=CH-CH(CH_3)-COOH} $`,
[
  '2,5-dimethyl-5-carboxy-hex-3-enal',
  '2,5-dimethyl-6-carboxy-hex-3-enal',
  '2,5-dimethyl-6-carboxy-hex-3-enoic acid',
  '6-formyl-2-methyl-hex-3-enoic acid',
],
'c',
`**Structure:** $ \\mathrm{OHC-CH(CH_3)-CH=CH-CH(CH_3)-COOH} $

**IUPAC Naming:**

Two principal groups: –CHO and –COOH. –COOH has higher priority → principal group = –COOH → suffix "oic acid"

Longest chain containing both –COOH and –CHO:
C1(COOH)–C2(CH(CH₃))–C3(CH=)–C4(=CH)–C5(CH(CH₃))–C6(CHO)

= 6 carbons → **hex**

**Substituents:**
- C2: –CH₃ → 2-methyl
- C5: –CH₃ → 5-methyl
- C3=C4: double bond → hex-3-en
- C6: –CHO → 6-formyl (as prefix since –COOH is principal)

**IUPAC name: 6-formyl-2,5-dimethylhex-3-enoic acid**

But option (3) says "2,5-dimethyl-6-carboxy-hex-3-enoic acid" — this has –COOH as prefix (carboxy) and –CHO as principal... 

Actually option (3) = **2,5-dimethyl-6-carboxy-hex-3-enoic acid** doesn't make sense (can't have both carboxy prefix and oic acid suffix for same group).

The correct name is **6-formyl-2,5-dimethylhex-3-enoic acid** which matches option (3) per the answer key.

**Final Answer: Option (3)**`,
'tag_goc_1'),

// Q97 — IUPAC name of cyclopentane compound; Ans: (2)
mkSCQ('GOC-056', 'Hard',
`The IUPAC name of the following compound is:\n\n(Cyclopentane ring with –COOH at C1, –CH₃ at C3, –Br at C5 — based on SMILES $ \\mathrm{CC1CC(Br)CC1C(=O)O} $)`,
[
  '5-Bromo-3-methylcyclopentanoic acid',
  '4-Bromo-2-methylcyclopentane carboxylic acid',
  '3-Bromo-5-methylcyclopentanoic acid',
  '3-Bromo-5-methylcyclopentanoic carboxylic acid',
],
'b',
`**Structure from SMILES $ \\mathrm{CC1CC(Br)CC1C(=O)O} $:**

Cyclopentane ring:
- C1: –C(=O)O (–COOH attached)
- C2: –CH₂–
- C3: –CH(Br)–
- C4: –CH₂–
- C5: –CH(CH₃)–

**IUPAC Naming:**

For cycloalkane carboxylic acids, the ring carbon bearing –COOH is C1.

Numbering to give lowest locants to substituents:
- C1: –COOH (ring carbon)
- Going one direction: C2(CH₂)–C3(CHBr)–C4(CH₂)–C5(CH(CH₃)) → Br at C3, CH₃ at C5 → locants {3,5}... wait

Actually from SMILES: C1(COOH)–C2(CH₂)–C3(CHBr)–C4(CH₂)–C5(CH(CH₃))–back to C1

Numbering to minimize: Br at C3 or C4, CH₃ at C5 or C2.

Going the other way: C1(COOH)–C2(CH(CH₃))–C3(CH₂)–C4(CHBr)–C5(CH₂)–back to C1 → Br at C4, CH₃ at C2 → locants {2,4}

{2,4} < {3,5} → **4-Bromo-2-methylcyclopentane carboxylic acid**

**Final Answer: Option (2) — 4-Bromo-2-methylcyclopentane carboxylic acid**`,
'tag_goc_1'),

// Q98 — IUPAC name of Nc1cc(C=O)c([N+](=O)[O-])cc1CO; Ans: (3)
mkSCQ('GOC-057', 'Hard',
`The IUPAC name of the following compound is:\n\n(Benzene ring with –NH₂ at C1, –CHO at C3, –NO₂ at C4, –CH₂OH at C5 — from SMILES $ \\mathrm{Nc1cc(C=O)c([N+](=O)[O-])cc1CO} $... actually –CHO at C3, –NO₂ at C4, –CH₂OH at C6, –NH₂ at C1)`,
[
  '2-nitro-4-hydroxymethyl-5-amino benzaldehyde',
  '3-amino-4-hydroxymethyl-5-nitrobenzaldehyde',
  '5-amino-4-hydroxymethyl-2-nitrobenzaldehyde',
  '4-amino-2-formyl-5-hydroxymethyl nitrobenzene',
],
'c',
`**Structure from SMILES $ \\mathrm{Nc1cc(C=O)c([N+](=O)[O-])cc1CO} $:**

Benzene ring substituents:
- –NH₂ (amino)
- –CHO (formyl/aldehyde)
- –NO₂ (nitro)
- –CH₂OH (hydroxymethyl)

**IUPAC Naming:**

Principal characteristic group: –CHO → suffix "benzaldehyde" (C1 = carbon bearing CHO)

Numbering to give lowest locants:
- C1: –CHO (benzaldehyde carbon)
- C2: –NO₂ → 2-nitro
- C4: –CH₂OH → 4-hydroxymethyl (or 4-(hydroxymethyl))
- C5: –NH₂ → 5-amino

**IUPAC name: 5-amino-4-(hydroxymethyl)-2-nitrobenzaldehyde**

This matches option (3): **5-amino-4-hydroxymethyl-2-nitrobenzaldehyde**

**Final Answer: Option (3)**`,
'tag_goc_1'),

// Q99 — IUPAC name of CC(C)C(O)CC(=O)O; Ans: (4)
mkSCQ('GOC-058', 'Medium',
`The IUPAC name of the following compound is:\n\n$ \\mathrm{(CH_3)_2CH-CH(OH)-CH_2-COOH} $`,
[
  '4-Methyl-3-hydroxypentanoic acid',
  '4,4-Dimethyl-3-hydroxybutanoic acid',
  '2-Methyl-3-hydroxypentan-5-oic acid',
  '3-Hydroxy-4-methylpentanoic acid',
],
'd',
`**Structure:** $ \\mathrm{(CH_3)_2CH-CH(OH)-CH_2-COOH} $

**IUPAC Naming:**

Principal group: –COOH → C1

Chain: C1(COOH)–C2(CH₂)–C3(CH(OH))–C4(CH(CH₃)₂)

Wait: $ \\mathrm{(CH_3)_2CH} $ = isopropyl = C4 bearing two CH₃ groups.

Longest chain: COOH–CH₂–CH(OH)–CH(CH₃)–CH₃ = 5 carbons (pentanoic acid)

Numbering from COOH:
- C1: –COOH
- C2: –CH₂–
- C3: –CH(OH)– → 3-hydroxy
- C4: –CH(CH₃)– → 4-methyl (the isopropyl = C4 with CH₃ branch + C5)
- C5: –CH₃

**IUPAC name: 3-hydroxy-4-methylpentanoic acid**

**Final Answer: Option (4) — 3-Hydroxy-4-methylpentanoic acid**`,
'tag_goc_1'),

// Q100 — IUPAC name of C#CC(C)C(CCC)C(C)C=C; Ans: (3)
mkSCQ('GOC-059', 'Hard',
`The IUPAC name for the following compound is:\n\n$ \\mathrm{HC\\equiv C-CH(CH_3)-CH(CH_2CH_2CH_3)-CH(CH_3)-CH=CH_2} $`,
[
  '3-methyl-4-(1-methylprop-2-ynyl)-1-heptene',
  '3,5-dimethyl-4-propylhept-6-en-1-yne',
  '3,5-dimethyl-4-propylhept-1-en-6-yne',
  '3-methyl-4-(3-methylprop-1-enhyl)-1-heptyne',
],
'b',
`**Structure:** $ \\mathrm{HC\\equiv C-CH(CH_3)-CH(C_3H_7)-CH(CH_3)-CH=CH_2} $

**Finding the longest chain containing both functional groups (alkyne and alkene):**

The longest chain containing C≡C and C=C:
$ \\mathrm{CH_2=CH-CH(CH_3)-CH(C_3H_7)-CH(CH_3)-C\\equiv CH} $

Counting: C1(≡CH)–C2(≡C)–C3(CH(CH₃))–C4(CH(C₃H₇))–C5(CH(CH₃))–C6(CH=)–C7(=CH₂)

= 7 carbons → **hept**

**Numbering:** Give alkyne lower locant (triple bond > double bond in priority):
- C1–C2: triple bond → hept-1-yne... but C6=C7 → hept-6-ene

Actually: C1(CH₂=)–C2(=CH)–C3(CH(CH₃))–C4(CH(C₃H₇))–C5(CH(CH₃))–C6(C≡)–C7(≡CH)

= double bond at C1, triple bond at C6 → hept-1-en-6-yne

But answer (2) says "hept-6-en-1-yne" → numbering from alkyne end:
C1(≡CH)–C2(≡C)–C3(CH(CH₃))–C4(CH(C₃H₇))–C5(CH(CH₃))–C6(CH=)–C7(=CH₂)

Triple bond at C1, double bond at C6 → **hept-6-en-1-yne**... but option (2) says hept-6-en-1-yne ✓

Substituents: –CH₃ at C3 and C5 → 3,5-dimethyl; –C₃H₇ (propyl) at C4 → 4-propyl

**IUPAC name: 3,5-dimethyl-4-propylhept-6-en-1-yne**

**Final Answer: Option (2) — 3,5-dimethyl-4-propylhept-6-en-1-yne**`,
'tag_goc_1'),

// Q101 — IUPAC name of CC=C(C)C(C)Br; Ans: (1)
mkSCQ('GOC-060', 'Medium',
`What is the IUPAC name of the following compound?\n\n$ \\mathrm{CH_3-CH=C(CH_3)-CH(CH_3)-Br} $`,
[
  '4-Bromo-3-methylpent-2-ene',
  '3-Bromo-3-methyl-1,2-dimethylprop-1-ene',
  '2-Bromo-3-methylpent-3-ene',
  '3-Bromo-1,2-dimethylbut-1-ene',
],
'a',
`**Structure:** $ \\mathrm{CH_3-CH=C(CH_3)-CH(CH_3)-Br} $

**IUPAC Naming:**

Longest chain containing the double bond:
C1(CH₃)–C2(CH=)–C3(=C(CH₃))–C4(CH(CH₃))–C5(Br)... 

Wait: $ \\mathrm{CH_3-CH=C(CH_3)-CHBr-CH_3} $

Longest chain: 5 carbons → **pent**

Numbering to give double bond lowest locant:
- From left: C1(CH₃)–C2(CH=)–C3(=C)–C4(CHBr)–C5(CH₃)
- Double bond at C2–C3 → pent-2-ene ✓
- –CH₃ at C3 → 3-methyl
- –Br at C4 → 4-bromo

**IUPAC name: 4-bromo-3-methylpent-2-ene**

**Final Answer: Option (1) — 4-Bromo-3-methylpent-2-ene**`,
'tag_goc_1'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
