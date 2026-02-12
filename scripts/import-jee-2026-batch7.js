/**
 * JEE Main 2026 - Batch 7
 * Additional questions with organic structures
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const NEW_QUESTIONS = [
    // ===== MORE 21st JAN MORNING =====

    // Q54 - Allylic Carbocations with structures
    {
        id: 'jee_2026_jan21m_q54',
        textMarkdown: `Identify the compounds P, Q, R and S in which the carbocation formed by loss of Cl⁻ is equally stabilized by resonance:

![Compound P](/structures/jan21m_q54_p.svg) ![Compound Q](/structures/jan21m_q54_q.svg)
![Compound R](/structures/jan21m_q54_r.svg) ![Compound S](/structures/jan21m_q54_s.svg)`,
        options: [
            { id: '1', text: 'P, Q and R only', isCorrect: false },
            { id: '2', text: 'P, Q and S only', isCorrect: true },
            { id: '3', text: 'Q, R and S only', isCorrect: false },
            { id: '4', text: 'P and S only', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_GOC', weight: 0.7 }, { tagId: 'TAG_GOC_RESONANCE', weight: 0.3 }],
        tagId: 'TAG_CH_GOC',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 21 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Allylic Carbocation Stability:**

When Cl⁻ leaves, a carbocation forms. For equal resonance stabilization, the carbocation should be able to delocalize equally.

**Analysis:**
- P: Allylic system with extended conjugation
- Q: Similar allylic conjugation
- R: Different position of double bonds
- S: Symmetric resonance possible

Compounds where carbocation can be equally stabilized by the flanking double bonds have equivalent resonance structures.

**P, Q, and S** have symmetric or equivalent resonance stabilization.

**Answer: P, Q and S only**`
        }
    },

    // Q55 - Schiff Base/Imine formation
    {
        id: 'jee_2026_jan21m_q55',
        textMarkdown: `The final product [B] is:

Benzoyl chloride + Cyclohexylmethylamine → [A] → (LiAlH₃) → [B]

![Option 1](/structures/jan22e_q55_opt1.svg) ![Option 2](/structures/jan22e_q55_opt2.svg)
![Option 3](/structures/jan22e_q55_opt3.svg) ![Option 4](/structures/jan22e_q55_opt4.svg)`,
        options: [
            { id: '1', text: 'N-cyclohexylmethyl benzamide', isCorrect: false },
            { id: '2', text: 'α-hydroxy amine intermediate', isCorrect: false },
            { id: '3', text: 'Benzyl-cyclohexylmethyl amine (secondary amine)', isCorrect: true },
            { id: '4', text: 'N-benzyl cyclohexanecarboxamide', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_AMINES', weight: 0.6 }, { tagId: 'TAG_CH_ALDEHYDES_KETONES', weight: 0.4 }],
        tagId: 'TAG_CH_AMINES',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Reaction Sequence:**

**Step 1:** Benzoyl chloride + Cyclohexylmethylamine
$$C_6H_5COCl + H_2N-CH_2-C_6H_{11} \\rightarrow C_6H_5CO-NH-CH_2-C_6H_{11}$$
Product [A] = **N-cyclohexylmethyl benzamide**

**Step 2:** Reduction with LiAlH₄
$$\\text{Amide} \\xrightarrow{LiAlH_4} \\text{Amine}$$
LiAlH₄ reduces C=O of amide to CH₂

**Product [B]:**
$$C_6H_5-CH_2-NH-CH_2-C_6H_{11}$$
**Benzyl-cyclohexylmethyl amine**

This is a secondary amine (Option 3).

**Answer: Option (3)**`
        }
    },

    // ===== MORE 22nd JAN EVENING =====

    // Q52 - Alkyne Product
    {
        id: 'jee_2026_jan22e_q52',
        textMarkdown: `Consider the following reaction:

Terminal alkyne → (i) NaNH₂ → (ii) isopropyl bromide → Product Y

The product Y formed is:`,
        options: [
            { id: '1', text: '2-methylhex-2-yne', isCorrect: false },
            { id: '2', text: '5-methylhex-2-yne', isCorrect: false },
            { id: '3', text: '2-methylhex-3-yne', isCorrect: true },
            { id: '4', text: 'Isopropylbut-1-yne', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_HYDROCARBONS', weight: 0.9 }],
        tagId: 'TAG_CH_HYDROCARBONS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Reaction mechanism:**

Terminal alkyne → NaNH₂ → Sodium acetylide

$$R-C\\equiv C-H \\xrightarrow{NaNH_2} R-C\\equiv C^-Na^+$$

Then nucleophilic substitution with isopropyl bromide:

$$R-C\\equiv C^- + (CH_3)_2CH-Br \\rightarrow R-C\\equiv C-CH(CH_3)_2$$

**Product identification:**
Based on the starting materials and the answer, the product is **2-methylhex-3-yne**.

Structure: $CH_3-CH_2-C\\equiv C-CH(CH_3)_2$
IUPAC: 2-methylhex-3-yne

**Answer: 2-methylhex-3-yne**`
        }
    },

    // Q55 - Reimer-Tiemann
    {
        id: 'jee_2026_jan22e_q55',
        textMarkdown: `Identify the correct sequence of reagents for the conversion of phenol to salicylaldehyde (2-hydroxybenzaldehyde):`,
        options: [
            { id: '1', text: '(i) CHCl₃/NaOH (ii) H₃O⁺', isCorrect: true },
            { id: '2', text: '(i) CO₂/NaOH (ii) H₃O⁺', isCorrect: false },
            { id: '3', text: '(i) HCN (ii) H₃O⁺', isCorrect: false },
            { id: '4', text: '(i) HCHO/NaOH (ii) Oxidation', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_PHENOLS', weight: 0.9 }],
        tagId: 'TAG_CH_PHENOLS',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Reimer-Tiemann Reaction:**

This is the classic reaction to convert phenol to salicylaldehyde.

$$\\text{Phenol} + CHCl_3 + NaOH \\xrightarrow{\\text{Heat}} \\text{Sodium salicylate} \\xrightarrow{H_3O^+} \\text{Salicylaldehyde}$$

**Mechanism:**
1. CHCl₃ + NaOH → :CCl₂ (dichlorocarbene)
2. Dichlorocarbene attacks phenoxide ion at ortho position
3. Hydrolysis gives aldehyde group

**Other options:**
- CO₂/NaOH → Kolbe-Schmidt (gives salicylic acid, not aldehyde)
- HCN → Doesn't work with phenol directly
- HCHO/NaOH → Gives hydroxymethyl phenol

**Answer: (i) CHCl₃/NaOH (ii) H₃O⁺**`
        }
    },

    // Q57 - Arrhenius Equation
    {
        id: 'jee_2026_jan22e_q57',
        textMarkdown: `Correct statements regarding Arrhenius equation among the following are:

(A) Factor $e^{-E_a/RT}$ corresponds to fraction of molecules having kinetic energy less than Ea.
(B) At a given temperature, lower the Ea, faster is the reaction.
(C) Increase in temperature by about 10°C doubles the rate of reaction.
(D) Plot of log k vs 1/T gives a straight line with slope = $-E_a/R$.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'B and D only', isCorrect: false },
            { id: '2', text: 'A and B only', isCorrect: false },
            { id: '3', text: 'A and C only', isCorrect: false },
            { id: '4', text: 'B and C only', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_KINETICS', weight: 0.9 }],
        tagId: 'TAG_CH_KINETICS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Arrhenius Equation:** $k = Ae^{-E_a/RT}$

**Statement A:** ✗ FALSE
$e^{-E_a/RT}$ = fraction with energy **≥ Ea**, not less than.

**Statement B:** ✓ TRUE
Lower Ea → Higher $e^{-E_a/RT}$ → Larger k → Faster reaction

**Statement C:** ✓ TRUE
This is an empirical observation. Near room temperature, a 10°C rise approximately doubles the rate (rule of thumb).

**Statement D:** ✗ FALSE
$$\\log k = \\log A - \\frac{E_a}{2.303RT}$$
Slope = $-\\frac{E_a}{2.303R}$, NOT $-\\frac{E_a}{R}$

**Answer: B and C only**`
        }
    },

    // Q58 - IUPAC Naming
    {
        id: 'jee_2026_jan22e_q58',
        textMarkdown: `The IUPAC name of the following compound is:

$CH_3CH_2CH_2-O-CO-CHBr-CH_2CH_2CH(CH_3)CH_2CH_3$`,
        options: [
            { id: '1', text: 'n-propyl-2-bromo-5-methylheptanoate', isCorrect: true },
            { id: '2', text: '2-bromo-5-methylhexylpropanoate', isCorrect: false },
            { id: '3', text: '2-bromo-5-methylpropanoate', isCorrect: false },
            { id: '4', text: 'n-propyl-1-bromo-4-methylhexanoate', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_NOMENCLATURE', weight: 0.9 }],
        tagId: 'TAG_CH_NOMENCLATURE',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Structure analysis:**

$CH_3CH_2CH_2-O-CO-CHBr-CH_2CH_2CH(CH_3)CH_2CH_3$

**Identifying parts:**
1. **Ester group:** -O-CO-
2. **Alkoxy part:** n-propyl ($CH_3CH_2CH_2-$)
3. **Acid part:** -CO-CHBr-CH₂CH₂CH(CH₃)CH₂CH₃

**Counting the acid chain:**
C(1)=O, C(2)=CHBr, C(3)=CH₂, C(4)=CH₂, C(5)=CH(CH₃), C(6)=CH₂, C(7)=CH₃
= 7 carbons = heptanoate

**Substituents:**
- Br on C-2 → 2-bromo
- CH₃ on C-5 → 5-methyl

**IUPAC Name:** n-propyl-2-bromo-5-methylheptanoate

**Answer: Option (1)**`
        }
    },

    // Q70 - Dibromo compound mechanism
    {
        id: 'jee_2026_jan22e_q70',
        textMarkdown: `The dibromo compound [P] (molecular formula: $C_9H_{10}Br_2$) when heated with excess sodamide followed by treatment with dilute HCl gives [Q]. On warming [Q] with mercuric sulphate and dilute sulphuric acid yields [R] which gives positive Iodoform test but negative Tollen's test.

The compound [P] is:

![Option 1](/structures/jan22e_q70_opt1.svg) ![Option 2](/structures/jan22e_q70_opt2.svg)
![Option 3](/structures/jan22e_q70_opt3.svg)`,
        options: [
            { id: '1', text: 'p-iodo-α,α\'-dibromoxylene', isCorrect: false },
            { id: '2', text: '(1,2-dibromoethyl)benzene', isCorrect: false },
            { id: '3', text: '(1,1-dibromomethyl)-4-iodotoluene', isCorrect: true },
            { id: '4', text: 'Vinyl dibromide derivative', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_HYDROCARBONS', weight: 0.6 }, { tagId: 'TAG_CH_ALDEHYDES_KETONES', weight: 0.4 }],
        tagId: 'TAG_CH_HYDROCARBONS',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 22 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Reaction sequence analysis:**

**Step 1:** [P] + NaNH₂ (excess) → [Q]
- Geminal dihalide with NaNH₂ → terminal alkyne
- This is elimination (dehydrohalogenation twice)

**Step 2:** [Q] (alkyne) + HgSO₄/H₂SO₄ → [R]
- This is Markovnikov hydration of alkyne
- Terminal alkyne → methyl ketone

**Product [R] analysis:**
- (+) Iodoform test → Has $CH_3CO-$ group
- (-) Tollen's test → No aldehyde (it's a ketone)

**Working backwards:**
- [R] = Methyl aryl ketone
- [Q] = Terminal alkyne
- [P] = Geminal dibromide that gives terminal alkyne

The compound P must be: **CH₃C(Br)₂-C₆H₄-I**

This geminal dibromide gives phenylacetylene → acetophenone derivative.

**Answer: Option (3)**`
        }
    },

    // ===== MORE 23rd JAN MORNING =====

    // Q54 - Organic Conversion
    {
        id: 'jee_2026_jan23m_q54',
        textMarkdown: `The correct sequence of reagents for the conversion of X to Y is:

Cyclohexene (X) → Cyclohexanone (Y)`,
        options: [
            { id: '1', text: '(i) NaOH(aq) (ii) Jones reagent (iii) H₃O⁺', isCorrect: false },
            { id: '2', text: '(i) B₂H₆/H₂O₂ (ii) NaOEt (iii) Jones reagent', isCorrect: false },
            { id: '3', text: '(i) Jones reagent (ii) NaOEt (iii) Hot KMnO₄/KOH', isCorrect: false },
            { id: '4', text: '(i) NaOEt (ii) B₂H₆/H₂O₂ (iii) Jones reagent', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_HYDROCARBONS', weight: 0.5 }, { tagId: 'TAG_CH_ALCOHOLS', weight: 0.5 }],
        tagId: 'TAG_CH_HYDROCARBONS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 23 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Conversion: Cyclohexene → Cyclohexanone**

We need to:
1. Add -OH to the ring (hydration)
2. Oxidize secondary alcohol to ketone

**Option (4) analysis:**

**Step 1:** NaOEt - deprotonation/base (prepares for next step)

**Step 2:** B₂H₆/H₂O₂ (Hydroboration-oxidation)
$$\\text{Cyclohexene} \\xrightarrow{B_2H_6, H_2O_2/NaOH} \\text{Cyclohexanol}$$
- Anti-Markovnikov, syn addition
- Gives secondary alcohol

**Step 3:** Jones reagent (CrO₃/H₂SO₄)
$$\\text{Cyclohexanol} \\xrightarrow{Jones} \\text{Cyclohexanone}$$
- Oxidizes 2° alcohol to ketone

**Answer: (i) NaOEt (ii) B₂H₆/H₂O₂ (iii) Jones reagent**`
        }
    },

    // Q62 - Nitration Reactivity
    {
        id: 'jee_2026_jan23m_q62',
        textMarkdown: `Consider the following compounds:

![Chlorobenzene](/structures/jan23m_q62_a.svg) (a)
![Nitrobenzene](/structures/jan23m_q62_b.svg) (b)
![Anisole](/structures/jan23m_q62_c.svg) (c)

Arrange these compounds in the increasing order of reactivity with nitrating mixture.`,
        options: [
            { id: '1', text: 'c < a < b', isCorrect: false },
            { id: '2', text: 'b < c < a', isCorrect: false },
            { id: '3', text: 'c < b < a', isCorrect: false },
            { id: '4', text: 'b < a < c', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_AROMATIC', weight: 0.9 }],
        tagId: 'TAG_CH_AROMATIC',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 23 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Electrophilic Aromatic Substitution Reactivity:**

**Nitration** requires electron-rich aromatic ring.

| Compound | Substituent | Effect | Reactivity |
|----------|-------------|--------|------------|
| (a) Chlorobenzene | -Cl | -I, +R (weak activating overall) | Moderate |
| (b) Nitrobenzene | -NO₂ | -I, -R (strong deactivating) | **Lowest** |
| (c) Anisole | -OCH₃ | -I, +R (strong activating) | **Highest** |

**Order of reactivity:**
$$\\text{Nitrobenzene} < \\text{Chlorobenzene} < \\text{Anisole}$$
$$b < a < c$$

**Answer: b < a < c**`
        }
    },

    // Q68 - Compound P identification
    {
        id: 'jee_2026_jan23m_q68',
        textMarkdown: `Compound 'P' undergoes the following sequence of reactions:

P → (i) LiAlH₄ → (ii) PCC → Q → Positive Tollen's test

'P' is:

![Option 1](/structures/jan23m_q68_opt1.svg) ![Option 2](/structures/jan23m_q68_opt2.svg)
![Option 3](/structures/jan23m_q68_opt3.svg) ![Option 4](/structures/jan23m_q68_opt4.svg)`,
        options: [
            { id: '1', text: 'Cyclohexyl acetaldehyde', isCorrect: false },
            { id: '2', text: 'Cyclohexanecarboxylic acid', isCorrect: true },
            { id: '3', text: 'Propyl cyclohexyl ketone', isCorrect: false },
            { id: '4', text: 'Cyclohexanecarboxamide', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ALDEHYDES_KETONES', weight: 0.7 }, { tagId: 'TAG_CH_CARBOXYLIC', weight: 0.3 }],
        tagId: 'TAG_CH_ALDEHYDES_KETONES',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 23 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**The Reaction Sequence**

**Step 1: Work Backwards from the Product**
The product **Q** gives a positive **Tollen's test**, which confirms that **Q** is an **aldehyde**.
1. The reagent leading to **Q** is **PCC**.
2. **PCC** specifically oxidizes a **primary alcohol** into an aldehyde.
3. Therefore, the intermediate formed before this step must be **Cyclohexylmethanol** (a primary alcohol).

**Step 2: Identify Starting Compound 'P'**
The reagent used to form the alcohol is **$LiAlH_4$**.
1. **$LiAlH_4$** is a strong reducing agent that converts a **carboxylic acid** into a primary alcohol.
2. The reaction specifically reduces the $-COOH$ group to a $-CH_2OH$ group.
3. Since our intermediate is Cyclohexylmethanol, the starting compound **'P'** must be **Cyclohexanecarboxylic acid**.

**Final Sequence:**
$$C_6H_{11}COOH \\xrightarrow{LiAlH_4} C_6H_{11}CH_2OH \\xrightarrow{PCC} C_6H_{11}CHO$$

**Answer: Cyclohexanecarboxylic acid**`
        }
    },

    // ===== MORE 23rd JAN EVENING =====

    // Q60 - Carbocation Rearrangement
    {
        id: 'jee_2026_jan23e_q60',
        textMarkdown: `Identify [P] in the following reaction:

1,3-Dimethylcyclopentene + HBr → [P]

![Option 2](/structures/jan23e_q60_opt2.svg) ![Option 4](/structures/jan23e_q60_opt4.svg)`,
        options: [
            { id: '1', text: 'Trans-1-bromo-1,3-dimethylcyclopentane', isCorrect: false },
            { id: '2', text: '1-Bromo-1,3-dimethylcyclopentane', isCorrect: true },
            { id: '3', text: 'Rearranged product with methyl shift', isCorrect: false },
            { id: '4', text: '1-Bromo-2,4-dimethylcyclopentane', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_HYDROCARBONS', weight: 0.8 }, { tagId: 'TAG_HC_REACTIONS', weight: 0.2 }],
        tagId: 'TAG_CH_HYDROCARBONS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 23 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `The reaction of **1,3-dimethylcyclopentene** with **HBr** follows the **electrophilic addition** mechanism, obeying **Markovnikov's Rule**.

### Mechanism:

**Step 1: Protonation of the double bond**
The alkene acts as a nucleophile and attacks the $H^+$ from $HBr$. The proton adds to the $C2$ carbon to form the more stable carbocation at $C1$.
$$
\text{1,3-dimethylcyclopentene} + H^+ \longrightarrow \text{Tertiary (3}^\circ\text{) Carbocation}
$$
The carbocation forms at $C1$ because it is a **tertiary** carbon atom (bonded to three other carbons), making it significantly more stable than a secondary carbocation at $C2$.

**Step 2: Nucleophilic attack by $Br^-$**
The bromide ion ($Br^-$) then attacks the positively charged tertiary carbocation at $C1$ to yield the final product.

### Product:
The resulting major product is **1-bromo-1,3-dimethylcyclopentane**.

**Answer: Option (2)**`
        }
    },

    // Q62 - Haloform Reaction
    {
        id: 'jee_2026_jan23e_q62',
        textMarkdown: `Which of the following statements are TRUE about Haloform reaction?

A. Sodium hypochlorite reacts with KI to give KOI.
B. KOI is a reducing agent.
C. α,β-unsaturated methylketone (CH₃-CH=CH-CO-CH₃) will give iodoform reaction.
D. Isopropyl alcohol will not give iodoform test.
E. Methanoic acid will give positive iodoform test.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'A, C & E only', isCorrect: false },
            { id: '2', text: 'A, B & C only', isCorrect: false },
            { id: '3', text: 'A & C only', isCorrect: true },
            { id: '4', text: 'B, D & E only', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ALDEHYDES_KETONES', weight: 0.8 }, { tagId: 'TAG_AK_TESTS', weight: 0.2 }],
        tagId: 'TAG_CH_ALDEHYDES_KETONES',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 23 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Statement Analysis:**

**A.** NaOCl + KI → KOI + NaCl
- Hypochlorite oxidizes iodide
- **TRUE** ✓

**B.** KOI is an **oxidizing agent**, not reducing
- Hypoiodite is unstable and acts as oxidizer
- **FALSE** ✗

**C.** α,β-unsaturated methyl ketone:
$CH_3-CH=CH-CO-CH_3$
- Has $CH_3CO-$ group
- Will give iodoform test
- **TRUE** ✓

**D.** Isopropyl alcohol $(CH_3)_2CHOH$
- Has $CH_3CH(OH)-$ structure
- **WILL give** iodoform test
- Statement says "will not" → **FALSE** ✗

**E.** Methanoic acid (HCOOH)
- No $CH_3CO-$ or $CH_3CH(OH)-$
- **Will NOT give** iodoform test
- **FALSE** ✗

**Correct: A & C only**`
        }
    },

    // Q66 - Mixed Ether
    {
        id: 'jee_2026_jan23e_q66',
        textMarkdown: `A mixed ether (P), when heated with excess of hot concentrated hydrogen iodide produces two different alkyl iodides which when treated with aq. NaOH give compounds (Q) and (R). Both (Q) and (R) give yellow precipitate with NaOI.

Identify the mixed ether (P):

![Option 1](/structures/jan23e_q66_opt1.svg) ![Option 2](/structures/jan23e_q66_opt2.svg) ![Option 3](/structures/jan23e_q66_opt3.svg)`,
        options: [
            { id: '1', text: 'Ethyl sec-butyl ether', isCorrect: true },
            { id: '2', text: 'Ethyl 1-phenylethyl ether', isCorrect: false },
            { id: '3', text: 'Ethyl tert-amyl ether', isCorrect: false },
            { id: '4', text: 'Diethyl ether', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ETHERS', weight: 0.9 }],
        tagId: 'TAG_CH_ETHERS',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 23 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Analysis:**

**Step 1:** Ether + excess HI → two alkyl iodides
$$R-O-R' + 2HI \\xrightarrow{\\text{hot}} R-I + R'-I + H_2O$$

**Step 2:** Alkyl iodides + NaOH → Alcohols Q and R
$$R-I + NaOH \\rightarrow R-OH + NaI$$

**Step 3:** Both Q and R give yellow precipitate with NaOI (=  NaOH + I₂)
- This is iodoform test
- Both alcohols must have $CH_3CH(OH)-$ structure

**Working backwards:**
- Q = Ethanol ($CH_3CH_2OH$) ✓ gives iodoform
- R = 2-Butanol ($CH_3CH(OH)CH_2CH_3$) ✓ gives iodoform

**Ether P must be:**
Ethyl sec-butyl ether: $CH_3CH_2-O-CH(CH_3)CH_2CH_3$

**Answer: Ethyl sec-butyl ether**`
        }
    },
];

// Add questions
let addedCount = 0;
NEW_QUESTIONS.forEach(q => {
    if (!questions.find(existing => existing.id === q.id)) {
        questions.push(q);
        addedCount++;
        console.log(`Added: ${q.id}`);
    } else {
        console.log(`Skipped (exists): ${q.id}`);
    }
});

fs.writeFileSync(DB_PATH, JSON.stringify(questions, null, 2));
console.log(`\n✅ Import complete! Added ${addedCount} new questions.`);
console.log(`Total questions in database: ${questions.length}`);
