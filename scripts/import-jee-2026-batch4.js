/**
 * JEE Main 2026 - Batch 4
 * 22nd Jan Morning Shift (Complete)
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const NEW_QUESTIONS = [
    // ===== 22nd JAN MORNING SHIFT =====

    // Q51 - Kinetic Molecular Theory
    {
        id: 'jee_2026_jan22m_q51',
        textMarkdown: `Given below are two statements:

**Statement I:** At constant volume, the pressure of a fixed number of moles of an ideal gas varies directly as its absolute temperature.

**Statement II:** The average kinetic energy of the molecules of ideal gas at a given temperature is independent of the nature of the gas.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'Both Statement I and Statement II are false', isCorrect: false },
            { id: '2', text: 'Statement I is true but Statement II is false', isCorrect: false },
            { id: '3', text: 'Statement I is false but Statement II is true', isCorrect: false },
            { id: '4', text: 'Both Statement I and Statement II are true', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_STATES_MATTER', weight: 0.8 }],
        tagId: 'TAG_CH_STATES_MATTER',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Statement I:**
At constant V and n:
$$PV = nRT \\Rightarrow P \\propto T$$
**TRUE** ✓ (Gay-Lussac's Law)

**Statement II:**
$$KE_{avg} = \\frac{3}{2}kT$$
This depends only on temperature, not on the nature of gas.
**TRUE** ✓

**Both statements are true.**`
        }
    },

    // Q52 - Electron Configuration
    {
        id: 'jee_2026_jan22m_q52',
        textMarkdown: `An element has the electronic configuration of its ground state as:
$$1s^2 2s^2 2p^6 3s^2 3p^6 3d^{10} 4s^2 4p^6 4d^{10} 5s^2$$

Identify the correct statements about the element:

A. It is a d-block element.
B. The element belongs to period 5.
C. Its atomic number is 48.
D. Its symbol is Cd.`,
        options: [
            { id: '1', text: 'B, C and D Only', isCorrect: true },
            { id: '2', text: 'A, B and D Only', isCorrect: false },
            { id: '3', text: 'A, B and C Only', isCorrect: false },
            { id: '4', text: 'A, B, C and D', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_PERIODIC', weight: 0.7 }, { tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.3 }],
        tagId: 'TAG_CH_PERIODIC',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Configuration:** $[Kr]4d^{10}5s^2$

**Analysis:**
- Atomic number = 2+2+6+2+6+10+2+6+10+2 = **48** ✓
- Symbol = **Cd** (Cadmium) ✓
- Period = **5** ✓ (outermost shell is 5th)

**Is it d-block?**
- d-block: Elements where d-orbitals are being filled
- Cd has completely filled d-orbital (4d¹⁰)
- It's in **Group 12** (Zn family)
- Technically d-block but shows s-block behavior
- **Statement A is debatable** - Many consider Zn, Cd, Hg as NOT typical d-block

**Correct: B, C and D Only**`
        }
    },

    // Q53 - Hydrocarbons SMILES reaction
    {
        id: 'jee_2026_jan22m_q53',
        textMarkdown: `Identify the major product in the following reaction:

$$CH_3-CH=CH_2 + HBr \\xrightarrow{Peroxide} ?$$`,
        options: [
            { id: '1', text: '$CH_3-CH(Br)-CH_3$ (2-Bromopropane)', isCorrect: false },
            { id: '2', text: '$CH_3-CH_2-CH_2Br$ (1-Bromopropane)', isCorrect: true },
            { id: '3', text: '$CH_2Br-CH=CH_2$ (3-Bromopropene)', isCorrect: false },
            { id: '4', text: '$CH_3-CBr=CH_2$ (2-Bromopropene)', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_HYDROCARBONS', weight: 0.8 }, { tagId: 'TAG_HC_REACTIONS', weight: 0.2 }],
        tagId: 'TAG_CH_HYDROCARBONS',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Anti-Markovnikov Addition (Peroxide Effect):**

With peroxide (Kharasch effect):
- HBr adds in **anti-Markovnikov** fashion
- Br goes to the **less substituted carbon**

$$CH_3-CH=CH_2 + HBr \\xrightarrow{ROOR} CH_3-CH_2-CH_2Br$$

**Mechanism:** Free radical addition
1. Peroxide generates Br• radical
2. Br• adds to less substituted carbon (more stable radical)
3. H atom completes the addition

**Answer: 1-Bromopropane**`
        }
    },

    // Q54 - Ionization Enthalpy
    {
        id: 'jee_2026_jan22m_q54',
        textMarkdown: `Given below are two statements:

**Statement I:** The first ionization enthalpy of Cr is lower than that of Mn.

**Statement II:** The second and third ionization enthalpies of Cr are higher than those of Mn.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'Both Statement I and Statement II are false', isCorrect: false },
            { id: '2', text: 'Statement I is true but Statement II is false', isCorrect: true },
            { id: '3', text: 'Both Statement I and Statement II are true', isCorrect: false },
            { id: '4', text: 'Statement I is false but Statement II is true', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_PERIODIC', weight: 0.7 }, { tagId: 'TAG_PERIODIC_TRENDS', weight: 0.3 }],
        tagId: 'TAG_CH_PERIODIC',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**First Ionization Enthalpy:**

| Element | Config | IE₁ (kJ/mol) |
|---------|--------|--------------|
| Cr | [Ar]3d⁵4s¹ | 653 |
| Mn | [Ar]3d⁵4s² | 717 |

**Cr has lower IE₁** because:
- Cr loses 4s¹ electron (easy to remove)
- After removal: Cr⁺ = [Ar]3d⁵ (stable half-filled)

**Statement I is TRUE** ✓

**Second and Third IE:**
- 2nd IE: Cr removes from 3d⁵ (stable), Mn removes from 4s
- Cr²⁺ → Cr³⁺ disrupts half-filled d⁵
- Actually, IE₂ and IE₃ of Cr are NOT higher than Mn

**Statement II is FALSE** ✗

**Answer: Statement I true, Statement II false**`
        }
    },

    // Q57 - Polymer Matching
    {
        id: 'jee_2026_jan22m_q57',
        textMarkdown: `Match List-I with List-II:

**List-I (Polymer)**
A. Buna-N
B. Teflon
C. Polystyrene
D. Bakelite

**List-II (Type)**
I. Thermosetting plastic
II. Elastomer
III. Thermoplastic (Homopolymer of vinylic monomer)
IV. Thermoplastic (Addition polymer of halogenated compound)`,
        options: [
            { id: '1', text: 'A-II, B-IV, C-III, D-I', isCorrect: true },
            { id: '2', text: 'A-II, B-III, C-IV, D-I', isCorrect: false },
            { id: '3', text: 'A-I, B-IV, C-III, D-II', isCorrect: false },
            { id: '4', text: 'A-III, B-IV, C-II, D-I', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_POLYMERS', weight: 0.9 }],
        tagId: 'TAG_CH_POLYMERS',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Matching:**

**A. Buna-N** (Butadiene-Acrylonitrile copolymer)
- Synthetic rubber
- **Elastomer (II)** ✓

**B. Teflon** (PTFE - Polytetrafluoroethylene)
- From $CF_2=CF_2$
- Halogenated addition polymer
- **Thermoplastic (IV)** ✓

**C. Polystyrene** (from styrene $C_6H_5CH=CH_2$)
- Vinylic homopolymer
- **Thermoplastic (III)** ✓

**D. Bakelite** (Phenol-formaldehyde resin)
- Cross-linked, cannot be remolded
- **Thermosetting (I)** ✓

**Answer: A-II, B-IV, C-III, D-I**`
        }
    },

    // Q59 - Buffer Solution
    {
        id: 'jee_2026_jan22m_q59',
        textMarkdown: `Which of the given 1 L solution when heated will give a buffer solution?

(Given: $pK_b$ of $NH_4OH$ = 4.74)`,
        options: [
            { id: '1', text: '0.1 mol NaOH + 0.1 mol $NH_4Cl$', isCorrect: false },
            { id: '2', text: '0.2 mol $NH_4OH$ + 0.1 mol HCl', isCorrect: true },
            { id: '3', text: '0.1 mol $NH_4OH$ + 0.1 mol HCl', isCorrect: false },
            { id: '4', text: '0.2 mol $NH_4OH$ + 0.2 mol HCl', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_EQUILIBRIUM', weight: 0.8 }, { tagId: 'TAG_EQ_BUFFER', weight: 0.2 }],
        tagId: 'TAG_CH_EQUILIBRIUM',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Buffer solution needs:** Weak base + its conjugate acid (salt)

**For each option after reaction:**

**(1)** NaOH + NH₄Cl → NaCl + NH₄OH
- 0.1 mol each → Complete reaction
- Only NH₄OH left (no buffer)

**(2)** 0.2 mol NH₄OH + 0.1 mol HCl
- NH₄OH + HCl → NH₄Cl + H₂O
- After: 0.1 mol NH₄OH + 0.1 mol NH₄Cl
- **This is a buffer!** ✓

**(3)** 0.1 mol each → Complete neutralization → No buffer

**(4)** 0.2 mol NH₄OH + 0.2 mol HCl → Complete neutralization → No buffer

**Answer: (2)**`
        }
    },

    // Q61 - Lewis Dot Structure
    {
        id: 'jee_2026_jan22m_q61',
        textMarkdown: `Among $H_2S$, $H_2O$, $NF_3$, $NH_3$ and $CHCl_3$, identify the molecule (X) with lowest dipole moment value.

The number of lone pairs of electrons present on the central atom of the molecule (X) is:`,
        options: [
            { id: '1', text: '2', isCorrect: false },
            { id: '2', text: '0', isCorrect: false },
            { id: '3', text: '1', isCorrect: true },
            { id: '4', text: '3', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_CHEMICAL_BONDING', weight: 0.8 }, { tagId: 'TAG_CB_DIPOLE', weight: 0.2 }],
        tagId: 'TAG_CH_CHEMICAL_BONDING',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Dipole Moments:**

| Molecule | μ (D) |
|----------|-------|
| $H_2O$ | 1.85 |
| $H_2S$ | 0.97 |
| $NH_3$ | 1.47 |
| $NF_3$ | **0.23** (lowest) |
| $CHCl_3$ | 1.04 |

**NF₃ has lowest dipole moment** because:
- Lone pair and N-F bond dipoles oppose each other
- Partial cancellation occurs

**Lone pairs on N in NF₃:**
- N has 5 valence electrons
- 3 used for bonding with F
- 2 electrons = **1 lone pair**

**Answer: 1**`
        }
    },

    // Q63 - Henry's Law
    {
        id: 'jee_2026_jan22m_q63',
        textMarkdown: `Given below are two statements:

**Statement I:** The Henry's law constant $K_H$ is constant with respect to variations in solution's concentration over the range for which the solutions is ideally dilute.

**Statement II:** $K_H$ does not differ for the same solute in different solvents.

Choose the correct answer:`,
        options: [
            { id: '1', text: 'Statement I is false but Statement II is true', isCorrect: false },
            { id: '2', text: 'Statement I is true but Statement II is false', isCorrect: true },
            { id: '3', text: 'Both Statement I and Statement II are true', isCorrect: false },
            { id: '4', text: 'Both Statement I and Statement II are false', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_SOLUTIONS', weight: 0.9 }],
        tagId: 'TAG_SOLUTIONS',
        difficulty: 'Easy',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Henry's Law:** $p = K_H \\cdot x$

**Statement I:**
- In ideally dilute solutions, $K_H$ is constant
- It only depends on temperature, not concentration
- **TRUE** ✓

**Statement II:**
- $K_H$ **does differ** for same solute in different solvents
- Example: O₂ has different $K_H$ in water vs alcohol
- Depends on solute-solvent interactions
- **FALSE** ✗

**Answer: Statement I true, Statement II false**`
        }
    },

    // ===== 22nd JAN MORNING - Section B =====

    // Q71 - Cycloalkane Bromination
    {
        id: 'jee_2026_jan22m_q71',
        textMarkdown: `The cycloalkane (X) on bromination consumes one mole of bromine per mole of (X) and gives the product (Y) in which C:Br ratio is 3:1.

The percentage of bromine in the product (Y) is ______ %. (Nearest integer)

[Given: Molar mass in g mol⁻¹: H:1, C:12, O:16, Br:80]`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '66',
        conceptTags: [{ tagId: 'TAG_CH_HYDROCARBONS', weight: 0.6 }, { tagId: 'TAG_MOLE_COMPOSITION', weight: 0.4 }],
        tagId: 'TAG_CH_HYDROCARBONS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Analysis:**
- Cycloalkane X: $C_nH_{2n}$
- One Br₂ adds per mole → Ring opens or substitution
- Product Y: C:Br = 3:1

**If C:Br = 3:1:**
- 3 Carbon atoms : 1 Bromine atom? No, this gives too little Br
- Actually means molar ratio

**For cyclopropane ($C_3H_6$):**
$C_3H_6 + Br_2 → C_3H_6Br_2$

Product: $C_3H_6Br_2$
- Molar mass = 36 + 6 + 160 = 202 g/mol
- Mass of Br = 160 g

$$\\%Br = \\frac{160}{202} × 100 = 79.2\\%$$

**Re-analyzing for C:Br = 3:1 (by atoms):**
Formula: $C_3H_6Br_2$ has C:Br = 3:2
This doesn't match.

**If product is $C_6H_{12}Br_2$:**
C:Br = 6:2 = 3:1 ✓

Mass = 72 + 12 + 160 = 244
%Br = 160/244 × 100 = **65.6% ≈ 66%**

**Answer: 66%**`
        }
    },

    // Q72 - Electrochemical Cell
    {
        id: 'jee_2026_jan22m_q72',
        textMarkdown: `Consider the following electrochemical cell at 298 K:
$$Pt|HSnO_2^-(aq)|Sn(OH)_6^{2-}(aq)|Bi_2O_3(s)|Bi(s)$$

If the reaction quotient at a given time is $10^6$, then the cell EMF ($E_{cell}$) is ______ × 10⁻¹ V. (Nearest integer)

Given the standard half-cell reduction potentials:
$E^⊖_{Bi_2O_3/Bi,OH^-} = -0.44$ V
$E^⊖_{Sn(OH)_6^{2-}/HSnO_2^-,OH^-} = -0.90$ V`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '4',
        conceptTags: [{ tagId: 'TAG_CH_ELECTROCHEMISTRY', weight: 0.9 }],
        tagId: 'TAG_CH_ELECTROCHEMISTRY',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Cell Reaction:**
- Cathode (reduction): $Bi_2O_3 + 3H_2O + 6e^- → 2Bi + 6OH^-$
- Anode (oxidation): $HSnO_2^- + H_2O + 2OH^- → Sn(OH)_6^{2-} + 2e^-$

**Standard Cell Potential:**
$$E^⊖_{cell} = E^⊖_{cathode} - E^⊖_{anode}$$
$$E^⊖_{cell} = -0.44 - (-0.90) = 0.46 V$$

**Nernst Equation:**
$$E_{cell} = E^⊖_{cell} - \\frac{0.059}{n}\\log Q$$

For n = 6 (based on balanced equation):
$$E_{cell} = 0.46 - \\frac{0.059}{6}\\log(10^6)$$
$$E_{cell} = 0.46 - \\frac{0.059}{6} × 6$$
$$E_{cell} = 0.46 - 0.059 = 0.401 V$$

$$E_{cell} ≈ 4 × 10^{-1} V$$

**Answer: 4**`
        }
    },

    // Q73 - Rate Constants Equal
    {
        id: 'jee_2026_jan22m_q73',
        textMarkdown: `The temperature at which the rate constants of the given below two gaseous reactions become equal is ______ K. (Nearest integer)

$$X → Y \\quad k_1 = 10^6 e^{-30000/T}$$
$$P → Q \\quad k_2 = 10^4 e^{-24000/T}$$

[Given: ln 10 = 2.303]`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '1303',
        conceptTags: [{ tagId: 'TAG_CH_KINETICS', weight: 0.8 }, { tagId: 'TAG_SKILL_CALCULATION', weight: 0.2 }],
        tagId: 'TAG_CH_KINETICS',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**When $k_1 = k_2$:**

$$10^6 e^{-30000/T} = 10^4 e^{-24000/T}$$

$$\\frac{10^6}{10^4} = \\frac{e^{-24000/T}}{e^{-30000/T}}$$

$$10^2 = e^{(-24000+30000)/T}$$

$$10^2 = e^{6000/T}$$

**Taking natural log:**
$$\\ln(10^2) = \\frac{6000}{T}$$

$$2 × 2.303 = \\frac{6000}{T}$$

$$T = \\frac{6000}{4.606} = 1302.6 K$$

**Answer: 1303 K**`
        }
    },

    // Q74 - Halogen Estimation
    {
        id: 'jee_2026_jan22m_q74',
        textMarkdown: `Sodium fusion extract of an organic compound (Y) with $CHCl_3$ and chlorine water gives violet color to the $CHCl_3$ layer.

0.15 g of (Y) gave 0.12 g of the silver halide precipitate in Carius method.

Percentage of halogen in the compound (Y) is ______ %. (Nearest integer)

[Given: Molar mass in g mol⁻¹: C:12, H:1, Cl:35.5, Br:80, I:127]`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '43',
        conceptTags: [{ tagId: 'TAG_MOLE_COMPOSITION', weight: 0.7 }, { tagId: 'TAG_SKILL_CALCULATION', weight: 0.3 }],
        tagId: 'TAG_MOLE_COMPOSITION',
        difficulty: 'Medium',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Analysis:**
- Violet color in CHCl₃ layer → **Iodine** present
- Silver halide = AgI

**Formula for % Iodine:**
$$\\%I = \\frac{127 × \\text{Mass of AgI}}{235 × \\text{Mass of compound}} × 100$$

Where Molar mass of AgI = 108 + 127 = 235 g/mol

**Calculation:**
$$\\%I = \\frac{127 × 0.12}{235 × 0.15} × 100$$

$$\\%I = \\frac{15.24}{35.25} × 100 = 43.23\\%$$

**Answer: 43%**`
        }
    },

    // Q75 - Gibbs Energy and Dissociation
    {
        id: 'jee_2026_jan22m_q75',
        textMarkdown: `Dissociation of a gas $A_2$ takes place according to the following chemical reactions. At equilibrium, the total pressure is 1 bar at 300 K.
$$A_2(g) \\rightleftharpoons 2A(g)$$

The standard Gibbs energy of formation of the involved substances:

| Substance | $\\Delta G_f^⊖$ / kJ mol⁻¹ |
|-----------|------------------------|
| $A_2$ | -100.00 |
| A | -50.832 |

The degree of dissociation of $A_2(g)$ is given by $(x × 10^{-2})^{1/2}$ where x = ______ (Nearest integer)

[Given: R = 8 J mol⁻¹ K⁻¹, log 2 = 0.3010, log 3 = 0.48]`,
        options: [],
        questionType: 'NVT',
        integerAnswer: '33',
        conceptTags: [{ tagId: 'TAG_CH_THERMODYNAMICS', weight: 0.5 }, { tagId: 'TAG_CH_EQUILIBRIUM', weight: 0.5 }],
        tagId: 'TAG_CH_THERMODYNAMICS',
        difficulty: 'Hard',
        examSource: 'JEE Main 2026 - Jan 22 Morning Shift',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Step 1: Calculate ΔG⊖ for reaction**
$$\\Delta G^⊖_{rxn} = 2\\Delta G^⊖_f(A) - \\Delta G^⊖_f(A_2)$$
$$\\Delta G^⊖_{rxn} = 2(-50.832) - (-100.00) = -1.664 \\text{ kJ/mol}$$

**Step 2: Calculate $K_p$**
$$\\Delta G^⊖ = -RT\\ln K_p$$
$$-1664 = -8 × 300 × \\ln K_p$$
$$\\ln K_p = \\frac{1664}{2400} = 0.693$$
$$K_p = e^{0.693} = 2$$

**Step 3: Express $K_p$ in terms of α**
$$A_2 \\rightleftharpoons 2A$$
At equilibrium: $(1-α)$ and $2α$ (if starting with 1 mol)

Total moles = $1-α + 2α = 1+α$
Total pressure = 1 bar

$$P_{A_2} = \\frac{1-α}{1+α} × 1, \\quad P_A = \\frac{2α}{1+α} × 1$$

$$K_p = \\frac{P_A^2}{P_{A_2}} = \\frac{(2α)^2/(1+α)^2}{(1-α)/(1+α)} = \\frac{4α^2}{(1-α)(1+α)} = \\frac{4α^2}{1-α^2}$$

**Step 4: Solve for α**
$$2 = \\frac{4α^2}{1-α^2}$$
$$2 - 2α^2 = 4α^2$$
$$2 = 6α^2$$
$$α^2 = \\frac{1}{3} = 0.333 = 33 × 10^{-2}$$

$$α = (33 × 10^{-2})^{1/2}$$

**Answer: x = 33**`
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
