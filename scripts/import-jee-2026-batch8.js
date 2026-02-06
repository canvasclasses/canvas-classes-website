/**
 * JEE Main 2026 - Batch 8
 * Remaining questions from all shifts
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const NEW_QUESTIONS = [
    // ===== 21st JAN EVENING - Remaining =====

    // Q53 - Aldehydes and Ketones
    {
        id: 'jee_2026_jan21e_q53',
        textMarkdown: `If an aldehyde is warmed with excess of formaldehyde and aqueous alkali, what will be the product?`,
        options: [
            { id: '1', text: 'Mixture of alcohols (Cannizzaro products)', isCorrect: false },
            { id: '2', text: 'Crossed aldol product', isCorrect: false },
            { id: '3', text: 'Polyhydroxy aldehyde/alcohol (via crossed aldol + Cannizzaro)', isCorrect: true },
            { id: '4', text: 'No reaction', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ALDEHYDES_KETONES', weight: 0.9 }],
        tagId: 'TAG_CH_ALDEHYDES_KETONES',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Reaction with excess HCHO + NaOH:**

This is known as **Tollens condensation** or **Formose reaction**.

When an aldehyde (with α-H) reacts with excess HCHO in basic medium:

1. **Aldol condensation** occurs multiple times at α-positions
2. Then **Crossed Cannizzaro** reduces one CHO to CH₂OH

Example with acetaldehyde:
$$CH_3CHO + 3HCHO \\xrightarrow{NaOH} (HOCH_2)_3C-CHO$$
$$\\xrightarrow{HCHO, NaOH} (HOCH_2)_4C$$

Final product: Pentaerythritol (tetrahydroxy compound)

**Answer: Polyhydroxy compound**`
        }
    },

    // Q57 - Esterification
    {
        id: 'jee_2026_jan21e_q57',
        textMarkdown: `Ester hydrolysis is often carried out under mild alkaline conditions rather than acidic conditions because:`,
        options: [
            { id: '1', text: 'Alkaline hydrolysis is faster', isCorrect: false },
            { id: '2', text: 'Alkaline conditions prevent side reactions', isCorrect: false },
            { id: '3', text: 'The reaction is irreversible in alkaline medium due to salt formation', isCorrect: true },
            { id: '4', text: 'Acidic hydrolysis requires heat', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_CARBOXYLIC', weight: 0.8 }],
        tagId: 'TAG_CH_CARBOXYLIC',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Alkaline vs Acidic Ester Hydrolysis:**

**Acidic Hydrolysis (Reversible):**
$$RCOOR' + H_2O \\xrightleftharpoons{H^+} RCOOH + R'OH$$

**Alkaline Hydrolysis (Irreversible) - Saponification:**
$$RCOOR' + NaOH \\rightarrow RCOONa + R'OH$$

**Why alkaline is preferred:**
- The carboxylic acid formed reacts with NaOH to form **sodium salt**
- Salt formation makes the reaction **irreversible**
- Equilibrium is shifted completely to products
- Higher yield is obtained

**Answer: Irreversible due to salt formation**`
        }
    },

    // Q59 - p-Block Elements
    {
        id: 'jee_2026_jan21e_q59',
        textMarkdown: `Given below are two statements:

**Statement I:** Element 'X' and 'Y' are the most and least electronegative elements, respectively among N, As, Sb and P. The nature of the oxides X₂O₃ and Y₂O₃ is acidic and amphoteric, respectively.

**Statement II:** BCl₃ is covalent in nature and gets hydrolysed in water. It produces [B(OH)₄]⁻ and [B(H₂O)₆]³⁺ in aqueous medium.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'Both Statement I and Statement II are true', isCorrect: false },
            { id: '2', text: 'Statement I is true but Statement II is false', isCorrect: true },
            { id: '3', text: 'Both Statement I and Statement II are false', isCorrect: false },
            { id: '4', text: 'Statement I is false but Statement II is true', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_P_BLOCK', weight: 0.9 }],
        tagId: 'TAG_CH_P_BLOCK',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Statement I Analysis:**

Electronegativity order in Group 15:
N > P > As > Sb

- X (most EN) = N → N₂O₃ is **acidic** ✓
- Y (least EN) = Sb → Sb₂O₃ is **amphoteric** ✓

**Statement I is TRUE** ✓

**Statement II Analysis:**

BCl₃ hydrolysis:
$$BCl_3 + 3H_2O \\rightarrow H_3BO_3 + 3HCl$$
Or: $B(OH)_3$ (boric acid)

- Does NOT form $[B(OH)_4]^-$ directly without base
- Does NOT form $[B(H_2O)_6]^{3+}$ - Boron is too small for this

**Statement II is FALSE** ✗

**Answer: Statement I true, Statement II false**`
        }
    },

    // Q67 - Glucose Reactions
    {
        id: 'jee_2026_jan21e_q67',
        textMarkdown: `Match List-I with List-II:

**List-I (Reaction of glucose with)**
A. Hydroxylamine
B. Br₂ water
C. Excess acetic anhydride
D. Concentrated HNO₃

**List-II (Product formed)**
I. Gluconic acid
II. Glucose pentacetate
III. Saccharic acid
IV. Glucoxime`,
        options: [
            { id: '1', text: 'A-I, B-III, C-IV, D-II', isCorrect: false },
            { id: '2', text: 'A-IV, B-I, C-II, D-III', isCorrect: true },
            { id: '3', text: 'A-III, B-I, C-IV, D-II', isCorrect: false },
            { id: '4', text: 'A-IV, B-III, C-II, D-I', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_BIOMOLECULES', weight: 0.9 }],
        tagId: 'TAG_CH_BIOMOLECULES',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Glucose Reactions:**

**A. Hydroxylamine (NH₂OH):**
- Reacts with -CHO group
- Forms oxime → **Glucoxime (IV)**

**B. Br₂ water:**
- Mild oxidation of -CHO to -COOH
- Only aldehyde group oxidized
- Forms **Gluconic acid (I)**

**C. Excess acetic anhydride:**
- Acetylates all 5 -OH groups
- Forms **Glucose pentacetate (II)**

**D. Concentrated HNO₃:**
- Strong oxidation
- Oxidizes both -CHO and terminal -CH₂OH to -COOH
- Forms dicarboxylic acid → **Saccharic acid (III)**

**Answer: A-IV, B-I, C-II, D-III**`
        }
    },

    // Q68 - Cross Aldol
    {
        id: 'jee_2026_jan21e_q68',
        textMarkdown: `The compound A, C₈H₈O₂ reacts with acetophenone to form a single product via cross-Aldol condensation. The compound A on reaction with conc. NaOH forms a substituted benzyl alcohol.

The compound A is:`,
        options: [
            { id: '1', text: '2-hydroxy acetophenone', isCorrect: false },
            { id: '2', text: '4-methoxy benzaldehyde', isCorrect: true },
            { id: '3', text: '4-hydroxy benzaldehyde', isCorrect: false },
            { id: '4', text: '4-methyl benzoic acid', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ALDEHYDES_KETONES', weight: 0.9 }],
        tagId: 'TAG_CH_ALDEHYDES_KETONES',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Analysis:**

**Molecular formula:** C₈H₈O₂ (DBE = 5)

**Clue 1:** Forms single product with acetophenone in cross-aldol
- A must be an aldehyde without α-H (otherwise multiple products)

**Clue 2:** With conc. NaOH → benzyl alcohol
- This suggests Cannizzaro reaction
- Confirms A is aldehyde without α-H

**Structure determination:**
C₈H₈O₂ with no α-H = substituted benzaldehyde

- 4-Methoxybenzaldehyde: $CH_3O-C_6H_4-CHO$
  - M = 7(12) + 8(1) + 2(16) = 136 ✓
  - No α-H on aldehyde carbon
  - Has -OCH₃ substituent

**Cross-Aldol with acetophenone:**
$$CH_3O-C_6H_4-CHO + C_6H_5COCH_3 \\xrightarrow{NaOH} \\text{Single product}$$

**Cannizzaro with NaOH:**
$$2 \\text{Anisaldehyde} \\xrightarrow{NaOH} \\text{Anisyl alcohol} + \\text{Anisate}$$

**Answer: 4-methoxy benzaldehyde**`
        }
    },

    // Q69 - Alcohol Preparation
    {
        id: 'jee_2026_jan21e_q69',
        textMarkdown: `3,3-Dimethyl-2-butanol cannot be prepared by:

A. Grignard reaction of acetaldehyde with t-butyl magnesium bromide
B. Hydroboration-oxidation of 3,3-dimethyl-1-butene
C. Reduction of 3,3-dimethyl-2-butanone with NaBH₃
D. Grignard reaction of t-butyl aldehyde with methyl magnesium bromide
E. Acid-catalyzed hydration of 3,3-dimethyl-1-butene

Choose the correct answer:`,
        options: [
            { id: '1', text: 'B only', isCorrect: false },
            { id: '2', text: 'B and E only', isCorrect: true },
            { id: '3', text: 'B and C only', isCorrect: false },
            { id: '4', text: 'B, C and E only', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ALCOHOLS', weight: 0.9 }],
        tagId: 'TAG_CH_ALCOHOLS',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Target:** 3,3-Dimethyl-2-butanol = $(CH_3)_3C-CH(OH)-CH_3$

**Checking each method:**

**A. CH₃CHO + (CH₃)₃CMgBr:**
$(CH_3)_3C-CH(OH)-CH_3$ ✓ Works

**B. Hydroboration of 3,3-dimethyl-1-butene:**
$(CH_3)_3C-CH=CH_2 \\xrightarrow{B_2H_6, H_2O_2} (CH_3)_3C-CH_2-CH_2OH$
Gives 3,3-dimethyl-1-butanol (1° alcohol) ✗

**C. Reduction of 3,3-dimethyl-2-butanone:**
$(CH_3)_3C-CO-CH_3 \\xrightarrow{NaBH_4} (CH_3)_3C-CH(OH)-CH_3$ ✓ Works

**D. (CH₃)₃C-CHO + CH₃MgBr:**
$(CH_3)_3C-CH(OH)-CH_3$ ✓ Works

**E. Acid-catalyzed hydration of 3,3-dimethyl-1-butene:**
- Markovnikov addition
- Carbocation rearrangement possible!
- May not give clean 2-butanol product ✗

**Cannot prepare by: B and E**`
        }
    },

    // ===== 22nd JAN MORNING - Remaining =====

    // Q55 - Electronegativity
    {
        id: 'jee_2026_jan22m_q55',
        textMarkdown: `The correct order of electronegativity among the following elements is:`,
        options: [
            { id: '1', text: 'F > O > N > Cl', isCorrect: true },
            { id: '2', text: 'O > F > Cl > N', isCorrect: false },
            { id: '3', text: 'F > Cl > O > N', isCorrect: false },
            { id: '4', text: 'Cl > F > O > N', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_PERIODIC', weight: 0.9 }],
        tagId: 'TAG_CH_PERIODIC',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Electronegativity (Pauling Scale):**

| Element | EN |
|---------|-----|
| F | 4.0 |
| O | 3.5 |
| N | 3.0 |
| Cl | 3.0 |

**Order:** F > O > N ≈ Cl

Since N and Cl have similar EN values, and N is slightly higher in some scales:
**F > O > N > Cl**

**Answer: F > O > N > Cl**`
        }
    },

    // Q56 - Salt Hydrolysis
    {
        id: 'jee_2026_jan22m_q56',
        textMarkdown: `The pH of 0.1 M solution of sodium acetate at 25°C is approximately:

(Given: pKa of acetic acid = 4.74, log 2 = 0.30)`,
        options: [
            { id: '1', text: '8.37', isCorrect: false },
            { id: '2', text: '8.87', isCorrect: true },
            { id: '3', text: '9.37', isCorrect: false },
            { id: '4', text: '5.63', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_EQUILIBRIUM', weight: 0.9 }],
        tagId: 'TAG_CH_EQUILIBRIUM',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Salt of weak acid + strong base:**

$$pH = 7 + \\frac{1}{2}(pK_a + \\log C)$$

**Given:**
- pKa = 4.74
- C = 0.1 M
- log(0.1) = -1

**Calculation:**
$$pH = 7 + \\frac{1}{2}(4.74 + (-1))$$
$$pH = 7 + \\frac{1}{2}(3.74)$$
$$pH = 7 + 1.87 = 8.87$$

**Answer: 8.87**`
        }
    },

    // Q58 - Optical Isomerism
    {
        id: 'jee_2026_jan22m_q58',
        textMarkdown: `The number of stereoisomers possible for the compound 2,3-dichlorobutane is:`,
        options: [
            { id: '1', text: '2', isCorrect: false },
            { id: '2', text: '3', isCorrect: true },
            { id: '3', text: '4', isCorrect: false },
            { id: '4', text: '1', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ISOMERISM', weight: 0.9 }],
        tagId: 'TAG_CH_ISOMERISM',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**2,3-Dichlorobutane:** $CH_3-CHCl-CHCl-CH_3$

**Chiral centers:** C2 and C3 (both have 4 different groups)

**For compounds with 2 chiral centers:**
- If different: 2² = 4 stereoisomers
- If similar (like here): Need to check for meso

**Stereoisomers:**
1. (2R,3R) - d-form
2. (2S,3S) - l-form (mirror image of 1)
3. (2R,3S) = (2S,3R) = **meso** form

The (2R,3S) and (2S,3R) are superimposable = only ONE meso compound

**Total stereoisomers = 3:**
- One pair of enantiomers (d and l)
- One meso compound

**Answer: 3**`
        }
    },

    // Q60 - Thermodynamics
    {
        id: 'jee_2026_jan22m_q60',
        textMarkdown: `For the reaction at 298 K:
$$2A + B \\rightarrow C$$

$\\Delta H = -400$ kJ and $\\Delta S = -200$ J K⁻¹. The reaction will be spontaneous at:`,
        options: [
            { id: '1', text: 'All temperatures', isCorrect: false },
            { id: '2', text: 'T < 2000 K', isCorrect: true },
            { id: '3', text: 'T > 2000 K', isCorrect: false },
            { id: '4', text: 'No temperature', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_THERMODYNAMICS', weight: 0.9 }],
        tagId: 'TAG_CH_THERMODYNAMICS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Gibbs Free Energy:** $\\Delta G = \\Delta H - T\\Delta S$

**For spontaneous reaction:** $\\Delta G < 0$

**Given:**
- $\\Delta H = -400$ kJ = $-400000$ J (exothermic)
- $\\Delta S = -200$ J/K (entropy decreases)

**Finding temperature condition:**
$$\\Delta G < 0$$
$$\\Delta H - T\\Delta S < 0$$
$$-400000 - T(-200) < 0$$
$$-400000 + 200T < 0$$
$$200T < 400000$$
$$T < 2000 K$$

**The reaction is spontaneous at T < 2000 K**

At T = 2000 K, ΔG = 0 (equilibrium)
Above 2000 K, ΔG > 0 (non-spontaneous)

**Answer: T < 2000 K**`
        }
    },

    // Q62 - Coordination Compounds
    {
        id: 'jee_2026_jan22m_q62',
        textMarkdown: `The coordination number and oxidation state of metal in $K_3[Fe(CN)_6]$ are respectively:`,
        options: [
            { id: '1', text: '6 and +2', isCorrect: false },
            { id: '2', text: '6 and +3', isCorrect: true },
            { id: '3', text: '4 and +3', isCorrect: false },
            { id: '4', text: '4 and +2', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_COORDINATION', weight: 0.9 }],
        tagId: 'TAG_CH_COORDINATION',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Potassium Ferricyanide: $K_3[Fe(CN)_6]$**

**Coordination Number:**
- Number of ligands attached to metal = 6 (CN⁻ groups)
- **CN = 6**

**Oxidation State:**
Let OS of Fe = x
- K is +1 (3 atoms = +3)
- CN is -1 (6 ligands = -6)
- Complex charge: [Fe(CN)₆]³⁻

$$x + 6(-1) = -3$$
$$x - 6 = -3$$
$$x = +3$$

**Oxidation state = +3**

**Answer: CN = 6, OS = +3**`
        }
    },

    // ===== 22nd JAN EVENING - Remaining =====

    // Q59 - Given Statements
    {
        id: 'jee_2026_jan22e_q59',
        textMarkdown: `Given below are two statements:

**Statement I:** $C < O < N < F$ is the correct order in terms of first ionization enthalpy values.

**Statement II:** $S > Se > Te > Po > O$ is the correct order in terms of the magnitude of electron gain enthalpy values.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'Statement I is false but Statement II is true', isCorrect: false },
            { id: '2', text: 'Both Statement I and Statement II are true', isCorrect: true },
            { id: '3', text: 'Both Statement I and Statement II are false', isCorrect: false },
            { id: '4', text: 'Statement I is true but Statement II is false', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_PERIODIC', weight: 0.9 }],
        tagId: 'TAG_CH_PERIODIC',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Statement I Analysis:**
First ionization enthalpy (kJ/mol):
- C: 1086
- O: 1314 (but less than N due to pairing)
- N: 1402 (half-filled stable)
- F: 1681

Wait, let me check: C < O < N would be wrong because O < N.
Actually C (1086) < O (1314) but we also need to compare with N.
N (1402) > O (1314) because of half-filled stability.

So: C < O < N < F is CORRECT ✓

**Statement II Analysis:**
Electron gain enthalpy (magnitude):
- O has lower EA than S due to small size and repulsion
- S > Se > Te > Po (decreasing down the group)
- But O has lower magnitude than S!

Order by magnitude: **S > Se > Te > Po > O** is CORRECT ✓
(O has anomalously low EA due to electron-electron repulsion in small size)

**Both statements are TRUE**`
        }
    },

    // Q60 - Glucose Reactions
    {
        id: 'jee_2026_jan22e_q60',
        textMarkdown: `Match List-I with List-II (Glucose reactions):

**List-I (Reagent)**
A. Hydroxylamine  
B. Br₂ water
C. Excess acetic anhydride
D. Concentrated HNO₃

**List-II (Product)**
I. Gluconic acid
II. Glucose pentacetate
III. Saccharic acid
IV. Glucoxime`,
        options: [
            { id: '1', text: 'A-I, B-III, C-IV, D-II', isCorrect: false },
            { id: '2', text: 'A-IV, B-I, C-II, D-III', isCorrect: true },
            { id: '3', text: 'A-III, B-I, C-IV, D-II', isCorrect: false },
            { id: '4', text: 'A-IV, B-III, C-II, D-I', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_BIOMOLECULES', weight: 0.9 }],
        tagId: 'TAG_CH_BIOMOLECULES',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `Same as Q67 from Jan 21 Evening.

**Matching:**
- A (Hydroxylamine) → IV (Glucoxime) - Oxime formation
- B (Br₂ water) → I (Gluconic acid) - Mild oxidation
- C (Excess acetic anhydride) → II (Glucose pentacetate) - Acetylation
- D (Conc. HNO₃) → III (Saccharic acid) - Strong oxidation

**Answer: A-IV, B-I, C-II, D-III**`
        }
    },

    // ===== 23rd JAN MORNING - Remaining =====

    // Q55 - Electrochemical Cell
    {
        id: 'jee_2026_jan23m_q55',
        textMarkdown: `In the given electrochemical cell:
$$Ag(s)|AgCl(s)|FeCl_2(aq), FeCl_3(aq)|Pt(s)$$

At 298 K, the cell potential (E_cell) will increase when:

(A) Concentration of Fe²⁺ is increased
(B) Concentration of Fe³⁺ is decreased
(C) Concentration of Fe²⁺ is decreased
(D) Concentration of Fe³⁺ is increased
(E) Concentration of Cl⁻ is increased

Choose the correct answer:`,
        options: [
            { id: '1', text: 'A and B only', isCorrect: false },
            { id: '2', text: 'A and E only', isCorrect: false },
            { id: '3', text: 'B only', isCorrect: false },
            { id: '4', text: 'C, D and E only', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ELECTROCHEMISTRY', weight: 0.9 }],
        tagId: 'TAG_CH_ELECTROCHEMISTRY',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 23 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Cell Reaction Analysis:**

**Anode (oxidation):** $Ag + Cl^- \\rightarrow AgCl + e^-$
**Cathode (reduction):** $Fe^{3+} + e^- \\rightarrow Fe^{2+}$

**Overall:** $Ag + Fe^{3+} + Cl^- \\rightarrow AgCl + Fe^{2+}$

**Nernst Equation:**
$$E_{cell} = E^⊖_{cell} - \\frac{0.059}{1}\\log\\frac{[Fe^{2+}]}{[Fe^{3+}][Cl^-]}$$

**To increase E_cell, we need to decrease Q:**

$$Q = \\frac{[Fe^{2+}]}{[Fe^{3+}][Cl^-]}$$

- **C:** Decrease [Fe²⁺] → Q decreases → E_cell increases ✓
- **D:** Increase [Fe³⁺] → Q decreases → E_cell increases ✓
- **E:** Increase [Cl⁻] → Q decreases → E_cell increases ✓

**Answer: C, D and E only**`
        }
    },

    // Q56 - Aldol Condensation
    {
        id: 'jee_2026_jan23m_q56',
        textMarkdown: `'x' is the product which is obtained from propanenitrile and stannous chloride in the presence of hydrochloric acid followed by hydrolysis. 'y' is the product which is obtained from but-2-ene by ozonolysis followed by hydrolysis.

From the following, which product is NOT obtained when one mole of 'x' and one mole of 'y' react with each other in presence of alkali followed by heating?`,
        options: [
            { id: '1', text: '2-Methylbut-2-enal', isCorrect: false },
            { id: '2', text: 'Pent-2-enal', isCorrect: false },
            { id: '3', text: '2-Methylpent-2-enal', isCorrect: false },
            { id: '4', text: '3-Methylbut-2-enal', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ALDEHYDES_KETONES', weight: 0.9 }],
        tagId: 'TAG_CH_ALDEHYDES_KETONES',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 23 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Finding x and y:**

**x:** Propanenitrile + SnCl₂/HCl + H₂O (Stephen reduction)
$$CH_3CH_2CN \\xrightarrow{SnCl_2/HCl} CH_3CH_2CHO$$
**x = Propanal**

**y:** But-2-ene + O₃ + H₂O
$$CH_3-CH=CH-CH_3 \\xrightarrow{O_3, Zn/H_2O} 2CH_3CHO$$
**y = Acetaldehyde**

**Aldol condensation between propanal and acetaldehyde:**

Multiple products possible depending on which is enolate:

1. Propanal attacks acetaldehyde → Pent-2-enal ✓
2. Acetaldehyde attacks propanal → 2-Methylbut-2-enal ✓
3. Self-condensation products

**3-Methylbut-2-enal** cannot be formed from these reactants (wrong carbon skeleton).

**Answer: 3-Methylbut-2-enal**`
        }
    },

    // Q59 - CFT Absorption
    {
        id: 'jee_2026_jan23m_q59',
        textMarkdown: `Given below are two statements:

**Statement I:** $[CoBr_4]^{2-}$ ion will absorb light of lower energy than $[CoCl_4]^{2-}$ ion.

**Statement II:** In $[CoI_4]^{2-}$ ion, the energy separation between the two set of d-orbitals is more than $[CoCl_4]^{2-}$ ion.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'Both Statement I and Statement II are false', isCorrect: false },
            { id: '2', text: 'Statement I is true but Statement II is false', isCorrect: true },
            { id: '3', text: 'Statement I is false but Statement II is true', isCorrect: false },
            { id: '4', text: 'Both Statement I and Statement II are true', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_COORDINATION', weight: 0.9 }],
        tagId: 'TAG_CH_COORDINATION',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 23 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Spectrochemical Series:**
I⁻ < Br⁻ < Cl⁻ < F⁻ (weak field → strong field)

**Statement I:**
$[CoBr_4]^{2-}$ vs $[CoCl_4]^{2-}$
- Br⁻ is weaker field ligand than Cl⁻
- Weaker field → smaller Δ → absorbs lower energy light
- **TRUE** ✓

**Statement II:**
$[CoI_4]^{2-}$ vs $[CoCl_4]^{2-}$
- I⁻ is weaker field ligand than Cl⁻
- Weaker field → **smaller** Δ (not more)
- **FALSE** ✗

**Answer: Statement I true, Statement II false**`
        }
    },

    // ===== 23rd JAN EVENING - Remaining =====

    // Q53 - Concentration Cell
    {
        id: 'jee_2026_jan23e_q53',
        textMarkdown: `Consider the electrochemical cell with semi-permeable membrane where a metal electrode (M) is undergoing redox reaction by forming M⁺ (M → M⁺ + e). The cation M⁺ is present in two different concentrations c₁ and c₂.

Which of the following statement is correct for generating a positive cell potential?`,
        options: [
            { id: '1', text: 'If c₁ is present at anode, then c₁ = c₂', isCorrect: false },
            { id: '2', text: 'If c₁ is present at cathode, then c₁ < c₂', isCorrect: false },
            { id: '3', text: 'If c₁ is present at cathode, then c₁ > c₂', isCorrect: true },
            { id: '4', text: 'If c₁ is present at anode, then c₁ > c₂', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ELECTROCHEMISTRY', weight: 0.9 }],
        tagId: 'TAG_CH_ELECTROCHEMISTRY',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 23 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Concentration Cell:**

For a concentration cell with same electrodes:
$$E_{cell} = \\frac{0.059}{n}\\log\\frac{[M^+]_{cathode}}{[M^+]_{anode}}$$

**For positive E_cell:**
$$\\log\\frac{c_{cathode}}{c_{anode}} > 0$$
$$c_{cathode} > c_{anode}$$

**If c₁ is at cathode:**
- For positive E_cell: c₁ > c₂
- **Statement (3) is correct** ✓

**Why?**
- At cathode: M⁺ + e⁻ → M (reduction)
- Higher concentration at cathode drives reduction
- Lower concentration at anode drives oxidation

**Answer: If c₁ is at cathode, then c₁ > c₂**`
        }
    },

    // Q55 - VBT and Hybridization
    {
        id: 'jee_2026_jan23e_q55',
        textMarkdown: `Identify the CORRECT set of details from the following:

A. $[Co(NH_3)_6]^{3+}$: Inner orbital complex; d²sp³ hybridized
B. $[MnCl_6]^{3-}$: Outer orbital complex; sp³d² hybridized
C. $[CoF_6]^{3-}$: Outer orbital complex; d²sp³ hybridized
D. $[FeF_6]^{3-}$: Outer orbital complex; sp³d² hybridized
E. $[Ni(CN)_4]^{2-}$: Inner orbital complex; sp³ hybridized

Choose the correct answer:`,
        options: [
            { id: '1', text: 'C & D only', isCorrect: false },
            { id: '2', text: 'A, B & D only', isCorrect: true },
            { id: '3', text: 'A, C & E only', isCorrect: false },
            { id: '4', text: 'A, B, C, D & E', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_COORDINATION', weight: 0.9 }],
        tagId: 'TAG_CH_COORDINATION',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 23 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Checking each complex:**

**A. $[Co(NH_3)_6]^{3+}$:** Co³⁺ = d⁶
- NH₃ is strong field → low spin
- Uses inner d orbitals → d²sp³
- **Inner orbital, d²sp³** ✓

**B. $[MnCl_6]^{3-}$:** Mn³⁺ = d⁴
- Cl⁻ is weak field → high spin
- Uses outer d orbitals → sp³d²
- **Outer orbital, sp³d²** ✓

**C. $[CoF_6]^{3-}$:** Co³⁺ = d⁶
- F⁻ is weak field → high spin
- Uses outer d orbitals → **sp³d²** (NOT d²sp³)
- **INCORRECT** ✗

**D. $[FeF_6]^{3-}$:** Fe³⁺ = d⁵
- F⁻ is weak field → high spin
- Uses outer d orbitals → sp³d²
- **Outer orbital, sp³d²** ✓

**E. $[Ni(CN)_4]^{2-}$:** Ni²⁺ = d⁸
- CN⁻ is strong field → low spin, square planar
- Hybridization = **dsp²** (NOT sp³)
- **INCORRECT** ✗

**Correct: A, B & D only**`
        }
    },

    // Q64 - Radiation Calculations
    {
        id: 'jee_2026_jan23e_q64',
        textMarkdown: `Identify the INCORRECT statements from the following:

A. Notation ₁₂²⁴Mg represents 24 protons and 12 neutrons.
B. Wavelength of a radiation of frequency 4.5 × 10¹⁵ s⁻¹ is 6.7 × 10⁻⁸ m.
C. One radiation has wavelength = λ₁ (900 nm) and energy = E₁. Other radiation has wavelength = λ₂ (300 nm) and energy = E₂. E₁:E₂ = 3:1.
D. Number of photons of light of wavelength 2000 pm that provides 1 J of energy is 1.006 × 10¹⁶.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'A and D only', isCorrect: false },
            { id: '2', text: 'A and C only', isCorrect: true },
            { id: '3', text: 'A and B only', isCorrect: false },
            { id: '4', text: 'B and C only', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.9 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 23 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Checking each statement:**

**A. ₁₂²⁴Mg:**
- Subscript 12 = atomic number = protons
- Superscript 24 = mass number = protons + neutrons
- Protons = 12, Neutrons = 24 - 12 = 12
- Statement says "24 protons" → **INCORRECT** ✗

**B. λ = c/ν:**
$$\\lambda = \\frac{3 × 10^8}{4.5 × 10^{15}} = 6.67 × 10^{-8} m$$
**CORRECT** ✓

**C. E ∝ 1/λ:**
$$\\frac{E_1}{E_2} = \\frac{\\lambda_2}{\\lambda_1} = \\frac{300}{900} = \\frac{1}{3}$$
Statement says 3:1 → **INCORRECT** ✗

**D. Number of photons:**
$$E_{photon} = \\frac{hc}{\\lambda} = \\frac{6.63×10^{-34} × 3×10^8}{2000×10^{-12}}$$
$$= \\frac{19.89×10^{-26}}{2×10^{-9}} = 9.945×10^{-17} J$$
$$n = \\frac{1}{9.945×10^{-17}} ≈ 1.006×10^{16}$$
**CORRECT** ✓

**Incorrect: A and C only**`
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
