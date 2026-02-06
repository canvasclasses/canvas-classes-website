/**
 * JEE Main 2026 - Batch 3
 * 21st Jan Evening (More Section A + Section B)
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const NEW_QUESTIONS = [
    // ===== 21st JAN EVENING - More Section A =====

    // Q61 - Biomolecules
    {
        id: 'jee_2026_jan21e_q61',
        textMarkdown: `The correct statements are:

A. Activation energy for enzyme catalysed hydrolysis of sucrose is lower than that of acid catalysed hydrolysis.
B. During denaturation, secondary and tertiary structures of a protein are destroyed but primary structure remains intact.
C. Nucleotides are joined together by glycosidic linkage between C₁ and C₄ carbons of the pentose sugar.
D. Quaternary structure of proteins represents overall folding of the polypeptide chain.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'A, C and D Only', isCorrect: false },
            { id: '2', text: 'A, B and D Only', isCorrect: false },
            { id: '3', text: 'A and B Only', isCorrect: true },
            { id: '4', text: 'B and C Only', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_BIOMOLECULES', weight: 0.9 }],
        tagId: 'TAG_CH_BIOMOLECULES',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Statement Analysis:**

**A.** ✓ TRUE - Enzymes lower activation energy significantly

**B.** ✓ TRUE - Denaturation disrupts 2°, 3°, 4° structure but peptide bonds (1°) remain

**C.** ✗ FALSE - Nucleotides are joined by **phosphodiester linkage** between 3' and 5' carbons

**D.** ✗ FALSE - Quaternary structure refers to arrangement of **multiple polypeptide subunits**, not folding of single chain

**Correct: A and B Only**`
        }
    },

    // Q62 - Nucleophilicity Order
    {
        id: 'jee_2026_jan21e_q62',
        textMarkdown: `The correct order of the rate of the reaction for the following reaction with respect to nucleophiles is:

$$CH_3Br + Nu^- \\longrightarrow CH_3Nu + Br^-$$`,
        options: [
            { id: '1', text: '$PhO^- > ^-OH > CH_3COO^- > ClO_4^-$', isCorrect: false },
            { id: '2', text: '$ClO_4^- > CH_3COO^- > ^-OH > PhO^-$', isCorrect: false },
            { id: '3', text: '$CH_3COO^- > PhO^- > ^-OH > ClO_4^-$', isCorrect: false },
            { id: '4', text: '$^-OH > PhO^- > CH_3COO^- > ClO_4^-$', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_HALIDES', weight: 0.7 }, { tagId: 'TAG_HALIDES_SN', weight: 0.3 }],
        tagId: 'TAG_CH_HALIDES',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Nucleophilicity Order (Protic Solvent):**

Rate of SN2 ∝ Nucleophilicity

| Nucleophile | Nature | Nucleophilicity |
|-------------|--------|-----------------|
| $^-OH$ | Strong base, small | **Highest** |
| $PhO^-$ | Resonance stabilized | Moderate |
| $CH_3COO^-$ | Weak nucleophile | Low |
| $ClO_4^-$ | Very stable, poor Nu | **Lowest** |

**Factors:**
- Basicity: OH⁻ > PhO⁻ > CH₃COO⁻ > ClO₄⁻
- ClO₄⁻ is extremely poor nucleophile (stable anion)

**Order: $^-OH > PhO^- > CH_3COO^- > ClO_4^-$**`
        }
    },

    // Q64 - Bond Length Order
    {
        id: 'jee_2026_jan21e_q64',
        textMarkdown: `The correct increasing order of C-H(A), C-O(B), C=O(C) and C≡N(D) bonds in terms of covalent bond length is:`,
        options: [
            { id: '1', text: 'A < B < C < D', isCorrect: false },
            { id: '2', text: 'A < D < C < B', isCorrect: true },
            { id: '3', text: 'D < C < B < A', isCorrect: false },
            { id: '4', text: 'D < C < A < B', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_CHEMICAL_BONDING', weight: 0.8 }, { tagId: 'TAG_CB_COVALENT', weight: 0.2 }],
        tagId: 'TAG_CH_CHEMICAL_BONDING',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Bond Lengths:**

| Bond | Length (pm) |
|------|-------------|
| C-H (A) | 109 |
| C-O (B) | 143 |
| C=O (C) | 123 |
| C≡N (D) | 116 |

**Increasing order of bond length:**
$$C-H < C\\equiv N < C=O < C-O$$
$$A < D < C < B$$

**Explanation:**
- Triple bond (C≡N) is shorter than double bond (C=O)
- Double bond is shorter than single bond (C-O)
- C-H is shortest due to small size of H

**Answer: A < D < C < B**`
        }
    },

    // Q65 - Optical Isomerism
    {
        id: 'jee_2026_jan21e_q65',
        textMarkdown: `Given below are four compounds:
(a) n-propyl chloride
(b) iso-propyl chloride
(c) sec-butyl chloride
(d) neo-pentyl chloride

Percentage of carbon in the one which exhibits optical isomerism is:`,
        options: [
            { id: '1', text: '52', isCorrect: true },
            { id: '2', text: '56', isCorrect: false },
            { id: '3', text: '46', isCorrect: false },
            { id: '4', text: '40', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_HALIDES', weight: 0.5 }, { tagId: 'TAG_CH_ISOMERISM', weight: 0.5 }],
        tagId: 'TAG_CH_HALIDES',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Checking for chirality:**

| Compound | Structure | Chiral? |
|----------|-----------|---------|
| n-propyl chloride | $CH_3CH_2CH_2Cl$ | No |
| iso-propyl chloride | $(CH_3)_2CHCl$ | No |
| **sec-butyl chloride** | $CH_3CH_2CH(Cl)CH_3$ | **Yes** ✓ |
| neo-pentyl chloride | $(CH_3)_3CCH_2Cl$ | No |

**sec-Butyl chloride** ($C_4H_9Cl$) shows optical isomerism.

**Formula:** $C_4H_9Cl$
- Molar mass = 4(12) + 9(1) + 35.5 = 92.5 g/mol
- Mass of C = 48 g/mol

$$\\%C = \\frac{48}{92.5} \\times 100 = 51.89\\% \\approx 52\\%$$

**Answer: 52%**`
        }
    },

    // Q66 - d-block Chemistry
    {
        id: 'jee_2026_jan21e_q66',
        textMarkdown: `Given below are some statements about Mn and $Mn_2O_7$. Identify the correct statements:

A. Mn forms the oxide $Mn_2O_7$ in which Mn is in its highest oxidation state.
B. Oxygen stabilizes the Mn in higher oxidation states by forming multiple bonds with Mn.
C. $Mn_2O_7$ is an ionic oxide.
D. The structure of $Mn_2O_7$ consists of one bridged oxygen.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'A, B, C and D', isCorrect: false },
            { id: '2', text: 'A, B and D Only', isCorrect: true },
            { id: '3', text: 'A, C and D Only', isCorrect: false },
            { id: '4', text: 'A, B and C Only', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_D_BLOCK', weight: 0.8 }, { tagId: 'TAG_DBLOCK_MN', weight: 0.2 }],
        tagId: 'TAG_CH_D_BLOCK',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Statement Analysis:**

**A.** ✓ TRUE - Mn shows max OS = +7 in $Mn_2O_7$

**B.** ✓ TRUE - pπ-dπ bonding stabilizes high OS

**C.** ✗ FALSE - $Mn_2O_7$ is **covalent** (acidic oxide)
- High OS metals form covalent oxides

**D.** ✓ TRUE - Structure has one bridging O atom
- Structure: $O_3Mn-O-MnO_3$

**Correct: A, B and D only**`
        }
    },

    // Q70 - Chromyl Chloride Test
    {
        id: 'jee_2026_jan21e_q70',
        textMarkdown: `On heating a mixture of common salt and $K_2Cr_2O_7$ in equal amount along with concentrated $H_2SO_4$ in a test tube, a gas is evolved.

Formula of the gas evolved and oxidation state of the central metal atom in the gas respectively are:`,
        options: [
            { id: '1', text: '$CrO_2Cl_2$ and +5', isCorrect: false },
            { id: '2', text: '$CrO_2Cl_2$ and +6', isCorrect: true },
            { id: '3', text: '$Cr_2O_2Cl_2$ and +6', isCorrect: false },
            { id: '4', text: '$Cr_2O_2Cl_2$ and +3', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_D_BLOCK', weight: 0.7 }, { tagId: 'TAG_DBLOCK_CR', weight: 0.3 }],
        tagId: 'TAG_CH_D_BLOCK',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Chromyl Chloride Test:**

$$4NaCl + K_2Cr_2O_7 + 6H_2SO_4 \\rightarrow 2CrO_2Cl_2 + ...$$

**Product:** $CrO_2Cl_2$ (Chromyl chloride)
- Deep red/brown colored vapors

**Oxidation State of Cr in $CrO_2Cl_2$:**
Let OS of Cr = x
$$x + 2(-2) + 2(-1) = 0$$
$$x - 4 - 2 = 0$$
$$x = +6$$

**Answer: $CrO_2Cl_2$ and +6**`
        }
    },

    // ===== 21st JAN EVENING - Section B =====

    // Q71 - Diprotic Acid Concentration
    {
        id: 'jee_2026_jan21e_q71',
        textMarkdown: `The first and second ionization constants of $H_2X$ are $2.5 \\times 10^{-8}$ and $1.0 \\times 10^{-13}$ respectively.

The concentration of $X^{2-}$ in 0.1 M $H_2X$ solution is ______ × 10⁻¹⁵ M. (Nearest Integer)`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '100',
        conceptTags: [{ tagId: 'TAG_CH_EQUILIBRIUM', weight: 0.8 }, { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }],
        tagId: 'TAG_CH_EQUILIBRIUM',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**For diprotic acid $H_2X$:**

$H_2X \\rightleftharpoons H^+ + HX^-$ ; $K_{a1} = 2.5 \\times 10^{-8}$
$HX^- \\rightleftharpoons H^+ + X^{2-}$ ; $K_{a2} = 1.0 \\times 10^{-13}$

**Step 1:** Find $[H^+]$ from first dissociation
Since $K_{a1}$ is small: $[H^+] \\approx \\sqrt{K_{a1} \\times C}$
$$[H^+] = \\sqrt{2.5 \\times 10^{-8} \\times 0.1} = 5 \\times 10^{-5} M$$

**Step 2:** Find $[X^{2-}]$
For weak diprotic acid: $[X^{2-}] \\approx K_{a2}$ (when $K_{a2} << K_{a1}$)

**But more accurately:**
$$K_{a2} = \\frac{[H^+][X^{2-}]}{[HX^-]}$$

Since $[HX^-] \\approx [H^+] = 5 \\times 10^{-5}$:
$$[X^{2-}] = K_{a2} = 1.0 \\times 10^{-13} M$$

This equals $100 \\times 10^{-15} M$

**Answer: 100**`
        }
    },

    // Q72 - Osmotic Pressure
    {
        id: 'jee_2026_jan21e_q72',
        textMarkdown: `The osmotic pressure of a living cell is 12 atm at 300 K.

The strength of sodium chloride solution that is isotonic with the living cell at this temperature is ______ g L⁻¹. (Nearest integer)

[Given: R = 0.08 L atm K⁻¹ mol⁻¹]
Assume complete dissociation of NaCl.
[Molar mass: Na = 23, Cl = 35.5 g mol⁻¹]`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '15',
        conceptTags: [{ tagId: 'TAG_MOLE_CONCENTRATIONS', weight: 0.7 }, { tagId: 'TAG_SKILL_CALCULATION', weight: 0.3 }],
        tagId: 'TAG_MOLE_CONCENTRATIONS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Van't Hoff Equation:**
$$\\pi = iCRT$$

**For isotonic solution:** $\\pi_{cell} = \\pi_{NaCl} = 12$ atm

**For NaCl:**
- i = 2 (complete dissociation: Na⁺ + Cl⁻)

$$12 = 2 \\times C \\times 0.08 \\times 300$$

$$C = \\frac{12}{2 \\times 0.08 \\times 300} = \\frac{12}{48} = 0.25 M$$

**Strength (g/L):**
$$\\text{Strength} = C \\times M_{NaCl} = 0.25 \\times 58.5 = 14.625$$

**Answer: 15 g L⁻¹**`
        }
    },

    // Q73 - RLVP
    {
        id: 'jee_2026_jan21e_q73',
        textMarkdown: `A substance 'X' (1.5 g) dissolved in 150 g of a solvent 'Y' (molar mass = 300 g mol⁻¹) led to an elevation of the boiling point by 0.5 K.

The relative lowering in the vapour pressure of the solvent 'Y' is ______ × 10⁻². (Nearest integer)

[Given: $K_b$ of the solvent = 5.0 K kg mol⁻¹]
Assume dilute solution, no association or dissociation.`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '3',
        conceptTags: [{ tagId: 'TAG_MOLE_CONCENTRATIONS', weight: 0.8 }, { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }],
        tagId: 'TAG_MOLE_CONCENTRATIONS',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Step 1:** Find molality from $\\Delta T_b$
$$\\Delta T_b = K_b \\times m$$
$$0.5 = 5.0 \\times m$$
$$m = 0.1 \\text{ mol/kg}$$

**Step 2:** Find moles of solvent
$$n_{solvent} = \\frac{150}{300} = 0.5 \\text{ mol}$$

**Step 3:** Find moles of solute
$$n_{solute} = m \\times W_{solvent}(kg) = 0.1 \\times 0.15 = 0.015 \\text{ mol}$$

**Step 4:** Calculate RLVP
$$\\frac{\\Delta P}{P^0} = \\frac{n_{solute}}{n_{solute} + n_{solvent}} \\approx \\frac{n_{solute}}{n_{solvent}}$$

$$RLVP = \\frac{0.015}{0.5} = 0.03 = 3 \\times 10^{-2}$$

**Answer: 3**`
        }
    },

    // Q74 - Magnetic Moment
    {
        id: 'jee_2026_jan21e_q74',
        textMarkdown: `Identify the metal ions among $Co^{2+}$, $Ni^{2+}$, $Fe^{2+}$, $V^{3+}$ and $Ti^{2+}$ having a spin-only magnetic moment value more than 3.0 BM.

The sum of unpaired electrons present in the high spin octahedral complexes formed by those metal ions is ______.`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '7',
        conceptTags: [{ tagId: 'TAG_CH_COORDINATION', weight: 0.8 }, { tagId: 'TAG_COORD_CFT', weight: 0.2 }],
        tagId: 'TAG_CH_COORDINATION',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Spin-only formula:** $\\mu = \\sqrt{n(n+2)}$ BM

| Ion | Config | n | μ (BM) | > 3.0 BM? |
|-----|--------|---|--------|-----------|
| $Co^{2+}$ | d⁷ | 3 | 3.87 | ✓ |
| $Ni^{2+}$ | d⁸ | 2 | 2.83 | ✗ |
| $Fe^{2+}$ | d⁶ | 4 | 4.90 | ✓ |
| $V^{3+}$ | d² | 2 | 2.83 | ✗ |
| $Ti^{2+}$ | d² | 2 | 2.83 | ✗ |

**Ions with μ > 3.0 BM:** $Co^{2+}$ and $Fe^{2+}$

**Sum of unpaired electrons:**
= 3 (Co²⁺) + 4 (Fe²⁺) = **7**

**Answer: 7**`
        }
    },

    // Q75 - Electrochemistry
    {
        id: 'jee_2026_jan21e_q75',
        textMarkdown: `MX is a sparingly soluble salt that follows the solubility equilibrium at 298 K:

$MX(s) \\rightleftharpoons M^+(aq) + X^-(aq)$ ; $K_{sp} = 10^{-10}$

If the standard reduction potential for $M^+(aq) + e^- \\rightarrow M(s)$ is $E^⊖_{M^+/M} = 0.79$ V, then the value of the standard reduction potential for the metal/metal insoluble salt electrode $E^⊖_{X^-/MX(s)/M}$ is ______ mV. (nearest integer)

[Given: $\\frac{2.303RT}{F} = 0.059$ V]`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '200',
        conceptTags: [{ tagId: 'TAG_CH_ELECTROCHEMISTRY', weight: 0.9 }],
        tagId: 'TAG_CH_ELECTROCHEMISTRY',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 21 Evening Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**The electrode reaction:**
$$MX(s) + e^- \\rightarrow M(s) + X^-(aq)$$

**This can be written as:**
$$M^+ + e^- \\rightarrow M$$ ; $E^⊖_1 = 0.79$ V
$$MX(s) \\rightleftharpoons M^+ + X^-$$ ; $K_{sp} = 10^{-10}$

**Relationship:**
$$E^⊖_{MX/M} = E^⊖_{M^+/M} + \\frac{0.059}{1}\\log K_{sp}$$

$$E^⊖_{MX/M} = 0.79 + 0.059 \\times \\log(10^{-10})$$

$$E^⊖_{MX/M} = 0.79 + 0.059 \\times (-10)$$

$$E^⊖_{MX/M} = 0.79 - 0.59 = 0.20 V = 200 mV$$

**Answer: 200 mV**`
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
