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
        tagId: 'PC_Mole_Stoichiometry',
        difficulty: 'Advanced',
        examSource: 'Pyrolusite Sample Problem',
        solution: {
            audioExplanationUrl: '/audio/q_mole_17.mp3',
            textSolutionLatex: `
**Step 1:** Let weight of sample $= 100g$.
*   $MnO_2 = 75g$
*   Inert Impurities $= 20g$
*   Water $= 5g$ (rest)

**Step 2:** Moles of $MnO_2 = \\frac{75}{87} \\approx 0.862$ mol.
Weight of Mn in sample $= \\frac{75}{87} \\times 55 \\approx 47.4g$.

**Step 3:** Reaction: $3MnO_2 \\rightarrow Mn_3O_4 + O_2$
Moles of $MnO_2$ converting to $Mn_3O_4 = 0.862$.
Moles of $Mn_3O_4$ produced $= \\frac{1}{3} \\times 0.862 = 0.287$ mol.
Mass of $Mn_3O_4 = 0.287 \\times 229 \\approx 65.8g$.

**Step 4:** Total weight of residue (ignited sample):
Since water evaporates, residue = Mass of $Mn_3O_4$ + Mass of Inert Impurities
$= 65.8g + 20g = 85.8g$.

**Step 5:** % of Mn in residue:
$= \\frac{\\text{Mass of Mn}}{\\text{Total Mass of Residue}} \\times 100$
$= \\frac{47.4}{85.8} \\times 100 \\approx 55.24\\%$.
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
        textMarkdown: 'The density of a solution prepared by dissolving 120 g of urea (molar mass = 60 u) in 1000 g of water is $1.15 \\text{ g mL}^{-1}$. The molarity of the solution is:',
        options: [
            { id: 'a', text: '0.50 M', isCorrect: false },
            { id: 'b', text: '1.78 M', isCorrect: false },
            { id: 'c', text: '1.02 M', isCorrect: false },
            { id: 'd', text: '2.05 M', isCorrect: true },
        ],
        tagId: 'PC_Mole_ConcentrationTerms',
        difficulty: 'Mains',
        examSource: 'AIEEE 2012',
        solution: {
            audioExplanationUrl: '/audio/q_mole_30.mp3',
            textSolutionLatex: `
**Formula:** $Molarity (M) = \\frac{\\text{Moles of Solute}}{\\text{Volume of Solution (L)}}$

1.  **Moles of Urea:** $\\frac{120}{60} = 2$ moles.
2.  **Total Mass of Solution:** Mass of Solute + Mass of Solvent
    $= 120g + 1000g = 1120g$.
3.  **Volume of Solution:**
    $V = \\frac{\\text{Mass}}{\\text{Density}} = \\frac{1120}{1.15} = 973.9 \\text{ mL}$.
4.  **Molarity:**
    $M = \\frac{2 \\text{ moles}}{0.9739 \\text{ L}} = 2.05 \\text{ M}$.
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
        textMarkdown: '29.2% (w/w) HCl stock solution has density of $1.25 \\text{ g mL}^{-1}$. The molecular weight of HCl is $36.5 \\text{ g mol}^{-1}$. The volume (mL) of stock solution required to prepare a 200 mL solution of 0.4 M HCl is:',
        options: [
            { id: 'A', text: '2 mL', isCorrect: false },
            { id: 'B', text: '4 mL', isCorrect: false },
            { id: 'C', text: '8 mL', isCorrect: true },
            { id: 'D', text: '12 mL', isCorrect: false },
        ],
        tagId: 'PC_Mole_ConcentrationTerms',
        difficulty: 'Advanced',
        examSource: 'IIT-JEE 2012',
        solution: {
            audioExplanationUrl: '/audio/q_mole_7.mp3',
            textSolutionLatex: `
**Step 1: Calculate Molarity of Stock Solution ($M_1$)**
Formula: $M = \\frac{\\% w/w \\times d \\times 10}{MM}$
$M_1 = \\frac{29.2 \\times 1.25 \\times 10}{36.5}$
$M_1 = \\frac{365}{36.5} = 10 \\text{ M}$.

**Step 2: Apply Dilution Formula ($M_1V_1 = M_2V_2$)**
*   $M_1 = 10 \\text{ M}$
*   $V_1 = ?$
*   $M_2 = 0.4 \\text{ M}$
*   $V_2 = 200 \\text{ mL}$

$10 \\times V_1 = 0.4 \\times 200$
$10 V_1 = 80$
$V_1 = 8 \\text{ mL}$.
            `,
        },
        trap: {
            likelyWrongChoiceId: 'B',
            message: "Check your calculation for the stock molarity. Remember the shortcut formula: $M = \\frac{\\% \\times d \\times 10}{MW}$.",
        }
    }
];
