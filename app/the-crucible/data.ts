import { Question } from './types';

export const QUESTIONS: Question[] = [
    // --- QUESTION 1: MnO2 Ignition (Stoichiometry) ---
    {
        id: 'q_mole_17',
        textMarkdown: '$MnO_2$ on ignition converts into $Mn_3O_4$. A sample of pyrolusite having 75% $MnO_2$, 20% inert impurities and the rest water is ignited in air to constant weight. What is the percentage of Mn in the ignited sample? [At. mass of Mn = 55]',
        options: [
            { id: 'a', text: '69.6%', isCorrect: false },
            { id: 'b', text: '49.9%', isCorrect: false },
            { id: 'c', text: '55.24%', isCorrect: true },
            { id: 'd', text: '72.05%', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_STOICHIOMETRY', weight: 0.7 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.3 }
        ],
        tagId: 'TAG_MOLE_STOICHIOMETRY',
        difficulty: 'Hard',
        examSource: 'Pyrolusite Sample Problem',
        solution: {
            audioExplanationUrl: '/audio/q_mole_17.mp3',
            textSolutionLatex: `
**Step 1:** Let weight of sample $= 100g$.
*   $MnO_2 = 75g$
*   Inert Impurities $= 20g$
*   Water $= 5g$ (rest)

**Step 2:** Moles of $MnO_2 = \\\\frac{75}{87} \\\\approx 0.862$ mol.
Weight of Mn in sample $= \\\\frac{75}{87} \\\\times 55 \\\\approx 47.4g$.

**Step 3:** Reaction: $3MnO_2 \\\\rightarrow Mn_3O_4 + O_2$
Moles of $MnO_2$ converting to $Mn_3O_4 = 0.862$.
Moles of $Mn_3O_4$ produced $= \\\\frac{1}{3} \\\\times 0.862 = 0.287$ mol.
Mass of $Mn_3O_4 = 0.287 \\\\times 229 \\\\approx 65.8g$.

**Step 4:** Total weight of residue (ignited sample):
Since water evaporates, residue = Mass of $Mn_3O_4$ + Mass of Inert Impurities
$= 65.8g + 20g = 85.8g$.

**Step 5:** % of Mn in residue:
$= \\\\frac{\\\\text{Mass of Mn}}{\\\\text{Total Mass of Residue}} \\\\times 100$
$= \\\\frac{47.4}{85.8} \\\\times 100 \\\\approx 55.24\\\\%$.
            `,
        },
        trap: {
            likelyWrongChoiceId: 'a',
            message: "Did you forget to include the weight of the inert impurities in the final residue? Or maybe you forgot water evaporates?",
            conceptGapTag: 'PC_Mole_Stoichiometry'
        }
    },

    // --- QUESTION 2: Urea Solution (Concentration Terms) ---
    {
        id: 'q_mole_30',
        textMarkdown: 'The density of a solution prepared by dissolving 120 g of urea (molar mass = 60 u) in 1000 g of water is $1.15 \\\\text{ g mL}^{-1}$. The molarity of the solution is:',
        options: [
            { id: 'a', text: '0.50 M', isCorrect: false },
            { id: 'b', text: '1.78 M', isCorrect: false },
            { id: 'c', text: '1.02 M', isCorrect: false },
            { id: 'd', text: '2.05 M', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_CONCENTRATIONS', weight: 0.8 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }
        ],
        tagId: 'TAG_MOLE_CONCENTRATIONS',
        difficulty: 'Medium',
        examSource: 'AIEEE 2012',
        solution: {
            audioExplanationUrl: '/audio/q_mole_30.mp3',
            textSolutionLatex: `
**Formula:** $Molarity (M) = \\\\frac{\\\\text{Moles of Solute}}{\\\\text{Volume of Solution (L)}}$

1.  **Moles of Urea:** $\\\\frac{120}{60} = 2$ moles.
2.  **Total Mass of Solution:** Mass of Solute + Mass of Solvent
    $= 120g + 1000g = 1120g$.
3.  **Volume of Solution:**
    $V = \\\\frac{\\\\text{Mass}}{\\\\text{Density}} = \\\\frac{1120}{1.15} = 973.9 \\\\text{ mL}$.
4.  **Molarity:**
    $M = \\\\frac{2 \\\\text{ moles}}{0.9739 \\\\text{ L}} = 2.05 \\\\text{ M}$.
            `,
        },
        trap: {
            likelyWrongChoiceId: 'c',
            message: "Watch out! Did you use the mass of water (1000g) as the volume? Density applies to the *total* solution mass (1120g), not just the solvent.",
            conceptGapTag: 'PC_Mole_ConcentrationTerms'
        }
    },

    // --- QUESTION 3: HCl Stock Solution (Dilution) ---
    {
        id: 'q_mole_7',
        textMarkdown: '29.2% (w/w) HCl stock solution has density of $1.25 \\\\text{ g mL}^{-1}$. The molecular weight of HCl is $36.5 \\\\text{ g mol}^{-1}$. The volume (mL) of stock solution required to prepare a 200 mL solution of 0.4 M HCl is:',
        options: [
            { id: 'A', text: '2 mL', isCorrect: false },
            { id: 'B', text: '4 mL', isCorrect: false },
            { id: 'C', text: '8 mL', isCorrect: true },
            { id: 'D', text: '12 mL', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_MOLE_CONCENTRATIONS', weight: 0.6 },
            { tagId: 'TAG_MOLE_STOICHIOMETRY', weight: 0.3 },
            { tagId: 'TAG_SKILL_CALCULATION', weight: 0.1 }
        ],
        tagId: 'TAG_MOLE_CONCENTRATIONS',
        difficulty: 'Hard',
        examSource: 'IIT-JEE 2012',
        solution: {
            audioExplanationUrl: '/audio/q_mole_7.mp3',
            textSolutionLatex: `
**Step 1: Calculate Molarity of Stock Solution ($M_1$)**
Formula: $M = \\\\frac{\\\\% w/w \\\\times d \\\\times 10}{MM}$
$M_1 = \\\\frac{29.2 \\\\times 1.25 \\\\times 10}{36.5}$
$M_1 = \\\\frac{365}{36.5} = 10 \\\\text{ M}$.

**Step 2: Apply Dilution Formula ($M_1V_1 = M_2V_2$)**
*   $M_1 = 10 \\\\text{ M}$
*   $V_1 = ?$
*   $M_2 = 0.4 \\\\text{ M}$
*   $V_2 = 200 \\\\text{ mL}$

$10 \\\\times V_1 = 0.4 \\\\times 200$
$10 V_1 = 80$
$V_1 = 8 \\\\text{ mL}$.
            `,
        },
        trap: {
            likelyWrongChoiceId: 'B',
            message: "Check your calculation for the stock molarity. Remember the shortcut formula: $M = \\\\frac{\\\\% \\\\times d \\\\times 10}{MW}$.",
        }
    },

    // ─────────────────────────────────────────────────────────────────────────────
    // JEE MAIN 2026 - JAN 21 MORNING SHIFT
    // ─────────────────────────────────────────────────────────────────────────────

    // --- Q51: Salt Analysis (Lead Chromate) ---
    {
        id: 'jee_2026_q51',
        textMarkdown: `Consider the following reactions.
1. $PbCl_2 + K_2CrO_4 \\\\rightarrow A + 2KCl$ (Hot solution)
2. $A + NaOH \\\\rightleftharpoons B + Na_2CrO_4$
3. $PbSO_4 + 4CH_3COONH_4 \\\\rightarrow (NH_4)_2SO_4 + X$

In the above reactions, A, B and X are respectively:`,
        options: [
            { id: '1', text: '$Na_2[Pb(OH)_4], PbCrO_4$ and $(NH_4)_2[Pb(CH_3COO)_4]$', isCorrect: false },
            { id: '2', text: '$PbCrO_4, Na_2[Pb(OH)_4]$ and $[Pb(NH_3)_4]SO_4$', isCorrect: false },
            { id: '3', text: '$Na_2[Pb(OH)_2], PbCrO_4$ and $[Pb(NH_3)_4]SO_4$', isCorrect: false },
            { id: '4', text: '$PbCrO_4, Na_2[Pb(OH)_4]$ and $(NH_4)_2[Pb(CH_3COO)_4]$', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_CH_SALT', weight: 0.6 },
            { tagId: 'TAG_SALT_CATION', weight: 0.4 }
        ],
        tagId: 'TAG_CH_SALT',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 21 Morning Shift',
        solution: {
            textSolutionLatex: `
**Reaction 1:** Lead chloride reacts with potassium chromate to form **Lead Chromate ($PbCrO_4$)**, which is a yellow precipitate.
$$PbCl_2 + K_2CrO_4 \\\\rightarrow \\\\underset{\\\\text{(A) Yellow ppt.}}{PbCrO_4} + 2KCl$$

**Reaction 2:** Lead chromate dissolves in excess NaOH to form a soluble complex, sodium plumbate(II).
$$PbCrO_4 + 4NaOH \\\\rightleftharpoons \\\\underset{\\\\text{(B) Soluble}}{Na_2[Pb(OH)_4]} + Na_2CrO_4$$

**Reaction 3:** Lead sulphate dissolves in ammonium acetate due to the formation of lead acetate complex.
$$PbSO_4 + 4CH_3COONH_4 \\\\rightarrow \\\\underset{\\\\text{(X) Soluble}}{(NH_4)_2[Pb(CH_3COO)_4]} + (NH_4)_2SO_4$$

Thus, A = $PbCrO_4$, B = $Na_2[Pb(OH)_4]$, X = $(NH_4)_2[Pb(CH_3COO)_4]$.
            `
        }
    },

    // --- Q52: Periodic Properties Trends ---
    {
        id: 'jee_2026_q52',
        textMarkdown: `Which of the following represents the correct trend for the mentioned property?

A. $F > P > S > B$ – First Ionization Energy
B. $Cl > F > S > P$ – Electron Affinity
C. $K > Al > Mg > B$ – Metallic character
D. $K_2O > Na_2O > MgO > Al_2O_3$ – Basic character

Choose the correct answer from the option given below.`,
        options: [
            { id: '1', text: 'A, B and D only', isCorrect: true },
            { id: '2', text: 'A, B, C and D', isCorrect: false },
            { id: '3', text: 'A and B only', isCorrect: false },
            { id: '4', text: 'B and C only', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_CH_PERIODIC', weight: 0.5 },
            { tagId: 'TAG_PERIODIC_TRENDS', weight: 0.5 }
        ],
        tagId: 'TAG_CH_PERIODIC',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Morning Shift',
        solution: {
            textSolutionLatex: `
**A. Ionization Energy:**
F (Grp 17) is highest. P (Grp 15, half-filled) > S (Grp 16). B (Grp 13) is lowest.
Trend: $F > P > S > B$. **Correct.**

**B. Electron Affinity:**
Cl has highest EA (higher than F due to size). S > P.
Trend: $Cl > F > S > P$. **Correct.**

**C. Metallic Character:**
Increases down a group, decreases across period.
$K$ (Grp 1) is most metallic.
$Mg$ (Grp 2) > $Al$ (Grp 13).
So, $K > Mg > Al > B$.
Given: $K > Al > Mg > B$. **Incorrect.**

**D. Basic Character of Oxides:**
Increases with metallic character.
$K_2O > Na_2O > MgO > Al_2O_3$ (Amphoteric).
Trend is **Correct.**

Correct Statements: A, B, D.
            `
        }
    },

    // --- Q54: Organic Hydrocarbons (Optical Activity) ---
    {
        id: 'jee_2026_q54',
        textMarkdown: `A hydrocarbon 'P' ($C_4H_8$) on reaction with HCl gives an optically active compound 'Q' ($C_4H_9Cl$) which on reaction with one mole of ammonia gives compound 'R' ($C_4H_{11}N$). 'R' on diazotization followed by hydrolysis gives 'S'. Identify P, Q, R and S.

**Options:**
(1) P = 1-Butene, Q = 1-Chlorobutane...
(2) P = Cyclobutane...
(3) P = 2-Butene ($CH_3-CH=CH-CH_3$), Q = 2-Chlorobutane...
(4) P = 1-Butene, Q = 1-Chlorobutane (terminal)...`,
        options: [
            { id: '1', text: 'Structure set 1', isCorrect: false },
            { id: '2', text: 'Structure set 2', isCorrect: false },
            { id: '3', text: 'P=2-Butene, Q=2-Chlorobutane, R=2-Aminobutane, S=2-Butanol', isCorrect: true },
            { id: '4', text: 'Structure set 4', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_CH_HYDROCARBONS', weight: 0.4 },
            { tagId: 'TAG_HC_ALKENES', weight: 0.3 },
            { tagId: 'TAG_HALIDES_SN', weight: 0.3 }
        ],
        tagId: 'TAG_CH_HYDROCARBONS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Morning Shift',
        solution: {
            textSolutionLatex: `
1.  **Reaction with HCl:**
    $C_4H_8$ (P) + HCl $\\\\rightarrow$ Optically Active Q.
    2-Butene ($CH_3-CH=CH-CH_3$) + HCl $\\\\rightarrow$ 2-Chlorobutane ($CH_3-CH_2-CHCl-CH_3$).
    *2-Chlorobutane has a chiral center, so it exists as enantiomers (racemic).*

2.  **Reaction with Ammonia:**
    2-Chlorobutane + $NH_3$ $\\\\rightarrow$ 2-Aminobutane (R).
    $CH_3-CH_2-CH(NH_2)-CH_3$.

3.  **Diazotization & Hydrolysis:**
    $R-NH_2 \\\\xrightarrow{HNO_2} R-N_2^+ \\\\xrightarrow{H_2O} R-OH$ (S).
    S is 2-Butanol ($CH_3-CH_2-CH(OH)-CH_3$).

*Note: 1-Butene also gives 2-Chlorobutane (Major), but options differentiate P. Option 3 correctly identifies the sequence starting from 2-Butene.*
            `
        }
    },

    // --- Q55: Inorganic Statements (Oxides & Boron) ---
    {
        id: 'jee_2026_q55',
        textMarkdown: `Given below are two statements:

**Statement I:** The number of pairs among $[SiO_2, CO_2]$, $[SnO, SnO_2]$, $[PbO, PbO_2]$ and $[GeO, GeO_2]$, which contain oxides that are both amphoteric is 2.

**Statement II:** $BF_3$ is an electron deficient molecule can act as a lewis acid, forms adduct with $NH_3$ and has a trigonal planar geometry.

In the light of the above statement, choose the correct answer from the option given below.`,
        options: [
            { id: '1', text: 'Both Statement I and Statement II are true.', isCorrect: true },
            { id: '2', text: 'Both Statement I and Statement II are false.', isCorrect: false },
            { id: '3', text: 'Statement I is true but Statement II is false.', isCorrect: false },
            { id: '4', text: 'Statement I is false Statement II is true.', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [
            { tagId: 'TAG_CH_P_BLOCK_11', weight: 0.6 },
            { tagId: 'TAG_CH_PERIODIC', weight: 0.4 }
        ],
        tagId: 'TAG_CH_P_BLOCK_11',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Morning Shift',
        solution: {
            textSolutionLatex: `
**Statement I:**
*   $[SiO_2, CO_2]$: Both Acidic.
*   $[SnO, SnO_2]$: **Both Amphoteric.** (Pair 1)
*   $[PbO, PbO_2]$: **Both Amphoteric.** (Pair 2)
*   $[GeO, GeO_2]$: $GeO_2$ is acidic (GeO is distinctively acidic/unstable).
Total pairs with both amphoteric = 2. **Statement I is True.**

**Statement II:**
*   $BF_3$ is electron deficient (6 valence electrons).
*   Acts as Lewis Acid.
*   Forms adduct $F_3B \\\\leftarrow NH_3$.
*   $BF_3$ molecule itself is $sp^2$, Trigonal Planar.
**Statement II is True.**
            `
        }
    }
];
