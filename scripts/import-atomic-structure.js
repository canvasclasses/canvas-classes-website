/**
 * Atomic Structure - Topic 1: Preliminary Developments and Bohr's Model
 * Adding specific questions as requested
 */

const fs = require('fs');
const path = require('path');

// Try to locate the questions file
let DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
if (!fs.existsSync(DB_PATH)) {
    DB_PATH = path.join(__dirname, '../app/the-crucible/questions-migrated.json');
}
console.log(`Using database: ${DB_PATH}`);

let questions = [];
try {
    questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
} catch (e) {
    console.error("Error reading database:", e);
    process.exit(1);
}

const NEW_QUESTIONS = [
    // Q1 - 2019 Main, 9 April II
    {
        id: 'jee_main_2019_9april_ii_q1',
        textMarkdown: `Which one of the following about an electron occupying the 1s-orbital in a hydrogen atom is incorrect? (The Bohr radius is represented by $a_0$)`,
        options: [
            { id: 'a', text: 'The electron can be found at a distance $2a_0$ from the nucleus.', isCorrect: false },
            { id: 'b', text: 'The magnitude of the potential energy is double that of its kinetic energy on an average.', isCorrect: false },
            { id: 'c', text: 'The probability density of finding the electron is maximum at the nucleus.', isCorrect: false },
            { id: 'd', text: 'The total energy of the electron is maximum when it is at a distance $a_0$ from the nucleus.', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 1.0 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Medium',
        examSource: 'JEE Main 2019 - 9 April Shift 2',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Statement (d) is incorrect.**
            
For 1s-orbital, the total energy of the electron is constant ($E_1 = -13.6 \\text{ eV}$) regardless of its distance from the nucleus in the Bohr model, or if considering the quantum mechanical model, energy is an eigenvalue of the state. However, the question likely refers to the dependence of probability or potential.

Actually, the statement says "Total energy... is maximum...". The total energy is negative. Closer to the nucleus, potential energy decreases (becomes more negative) and kinetic energy increases.

Let's look at the options:
(a) Electron can be found at any distance (probability never zero, just small). True.
(b) Viral Theorem: $2\\langle KE \\rangle = -\\langle PE \\rangle$ or $|PE| = 2KE$. True.
(c) Probability density $\\psi^2$ for 1s is maximum at $r=0$. True.
(d) Total energy is quantized and fixed for the 1s state. It doesn't vary with distance $r$ in the stationary state description. Or if interpreting classically, total energy is constant. If interpreting "maximum" as "least negative", well, the energy is just $-13.6$ eV.
But looking at the provided solution graph:
"The graph initially increases and then decreases. It reaches a maximum at a distance very close to the nucleus and then decreases. The maximum in the curve corresponds to the distance at which the probability of finding the electron in maximum."
This description matches the Radial Probability Distribution ($4\\pi r^2 R^2$).
The max for 1s is at $a_0$.
BUT statement (d) talks about **Total Energy**, not probability.
So (d) is definitely the incorrect statement.

**Answer:** (d)`
        }
    },

    // Q2 - 2019 Main, 8 April II
    {
        id: 'jee_main_2019_8april_ii_q2',
        textMarkdown: `If $p$ is the momentum of the fastest electron ejected from a metal surface after the irradiation of light having wavelength $\\lambda$, then for $1.5p$ momentum of the photoelectron, the wavelength of the light should be:
        
(Assume kinetic energy of ejected photoelectron to be very high in comparison to work function)`,
        options: [
            { id: 'a', text: '$\\frac{4}{9}\\lambda$', isCorrect: true },
            { id: 'b', text: '$\\frac{3}{4}\\lambda$', isCorrect: false },
            { id: 'c', text: '$\\frac{2}{3}\\lambda$', isCorrect: false },
            { id: 'd', text: '$\\frac{1}{2}\\lambda$', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.8 }, { tagId: 'TAG_PHOTOELECTRIC_EFFECT', weight: 0.8 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Medium',
        examSource: 'JEE Main 2019 - 8 April Shift 2',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Photoelectric Effect:**
$K.E. = \\frac{hc}{\\lambda} - \phi$
Given $K.E. >> \phi$, so $K.E. \\approx \\frac{hc}{\\lambda}$

Also $K.E. = \\frac{p^2}{2m}$
So, $\\frac{p^2}{2m} = \\frac{hc}{\\lambda} \\implies p^2 \\propto \\frac{1}{\\lambda} \\implies p \\propto \\frac{1}{\\sqrt{\\lambda}}$ or $\\lambda \\propto \\frac{1}{p^2}$

Condition 1: $p$, $\\lambda_1 = \\lambda$
Condition 2: $p' = 1.5p = \\frac{3}{2}p$, $\\lambda_2 = ?$

$\\frac{\\lambda_2}{\\lambda_1} = \\frac{p_1^2}{p_2^2} = \\left(\\frac{p}{1.5p}\\right)^2 = \\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$

$\\lambda_2 = \\frac{4}{9}\\lambda$

**Answer:** (a)`
        }
    },

    // Q3 - 2019 Main, 12 Jan I
    {
        id: 'jee_main_2019_12jan_i_q3',
        textMarkdown: `What is the work function of the metal, if the light of wavelength $4000 \\mathring{A}$ generates photoelectron of velocity $6 \\times 10^5 \\text{ ms}^{-1}$ from it?
        
(Mass of electron $= 9 \\times 10^{-31} \\text{ kg}$
Velocity of light $= 3 \\times 10^8 \\text{ ms}^{-1}$
Planck's constant $= 6.626 \\times 10^{-34} \\text{ Js}$
Charge of electron $= 1.6 \\times 10^{-19} \\text{ J eV}^{-1}$)`,
        options: [
            { id: 'a', text: '4.0 eV', isCorrect: false },
            { id: 'b', text: '2.1 eV', isCorrect: true },
            { id: 'c', text: '0.9 eV', isCorrect: false },
            { id: 'd', text: '3.1 eV', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.8 }, { tagId: 'TAG_PHOTOELECTRIC_EFFECT', weight: 0.8 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Medium',
        examSource: 'JEE Main 2019 - 12 Jan Shift 1',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Equation:** $h\\nu = \phi + K.E.$
$\phi = \\frac{hc}{\\lambda} - \\frac{1}{2}mv^2$

**Step 1: Calculate Energy of photon (E)**
$\\lambda = 4000 \\mathring{A} = 4000 \\times 10^{-10} \\text{ m}$
$E = \\frac{6.626 \\times 10^{-34} \\times 3 \\times 10^8}{4000 \\times 10^{-10}} \\text{ J}$
$E = \\frac{19.878 \\times 10^{-26}}{4 \\times 10^{-7}} = 4.9695 \\times 10^{-19} \\text{ J}$
In eV: $E = \\frac{4.9695 \\times 10^{-19}}{1.6 \\times 10^{-19}} \\approx 3.1 \\text{ eV}$

**Step 2: Calculate Kinetic Energy (KE)**
$v = 6 \\times 10^5 \\text{ m/s}$
$KE = \\frac{1}{2} \\times (9 \\times 10^{-31}) \\times (6 \\times 10^5)^2$
$KE = 0.5 \\times 9 \\times 36 \\times 10^{-21} = 162 \\times 10^{-21} = 1.62 \\times 10^{-19} \\text{ J}$
In eV: $KE = \\frac{1.62 \\times 10^{-19}}{1.6 \\times 10^{-19}} \\approx 1.01 \\text{ eV}$

**Step 3: Work Function**
$\phi = E - KE = 3.1 - 1.01 \\approx 2.09 \\text{ eV}$

Closest option is 2.1 eV.

**Answer:** (b)`
        }
    },

    // Q4 - 2019 Main, 10 Jan II
    {
        id: 'jee_main_2019_10jan_ii_q4',
        textMarkdown: `The ground state energy of hydrogen atom is $-13.6 \\text{ eV}$. The energy of second excited state of $He^+$ ion in eV is:`,
        options: [
            { id: 'a', text: '$-54.4$', isCorrect: false },
            { id: 'b', text: '$-3.4$', isCorrect: false },
            { id: 'c', text: '$-6.04$', isCorrect: true },
            { id: 'd', text: '$-27.2$', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.9 }, { tagId: 'TAG_BOHR_MODEL', weight: 0.9 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Easy',
        examSource: 'JEE Main 2019 - 10 Jan Shift 2',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**Formula:** $E_n = -13.6 \\times \\frac{Z^2}{n^2} \\text{ eV}$

For $He^+$: $Z = 2$
Second excited state means $n = 3$ (Ground=1, 1st excited=2, 2nd excited=3)

$E_3 = -13.6 \\times \\frac{2^2}{3^2}$
$E_3 = -13.6 \\times \\frac{4}{9}$
$E_3 = -13.6 \\times 0.444$
$E_3 = -6.04 \\text{ eV}$

**Answer:** (c)`
        }
    },

    // Q5 - 2019 Main, 10 Jan I
    {
        id: 'jee_main_2019_10jan_i_q5',
        textMarkdown: `Which of the graphs shown below does not represent the relationship between incident light and the electron ejected from metal surface?`,
        options: [
            { id: 'a', text: 'K.E. of $e^-$ vs Energy of light (Linear increasing from threshold)', isCorrect: false },
            { id: 'b', text: 'K.E. of $e^-$ vs Intensity of light (Constant line)', isCorrect: false },
            { id: 'c', text: 'Number of $e^-$ vs Frequency of light (Step function)', isCorrect: false }, // Wait, Number of electrons depends on Intensity, not frequency (above threshold)
            { id: 'd', text: 'K.E. of $e^-$ vs Frequency of light (Linear increasing from threshold)', isCorrect: true }, // Wait, check the question. "does not represent"
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.8 }, { tagId: 'TAG_PHOTOELECTRIC_EFFECT', weight: 0.9 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Medium',
        examSource: 'JEE Main 2019 - 10 Jan Shift 1',
        isPYQ: true,
        solution: {
            textSolutionLatex: `Let's analyze the graphs (based on standard PE effect):
(a) **K.E. vs Energy ($h\\nu$):** Linear relation $KE = E - \phi$. Valid.
(b) **K.E. vs Intensity:** K.E. depends on frequency, NOT intensity. So K.E. is constant as Intensity increases. Valid.
(c) **Number of $e^-$ vs Frequency:** Number of ejected electrons depends on Intensity, provided $\\nu > \\nu_0$. If $\\nu$ increases (at constant Intensity), current might change slightly due to experimental factors, but ideally it's independent or requires specific conditions. However, the graph (c) shows Number of e- is zero below some frequency, then constant. This is plausible if intensity is constant.
(d) **K.E. vs Frequency:** Graph shows KE increasing linearly from origin? No, standard graph is linear starting from $\\nu_0$ (x-intercept).
Wait, let's look at the solution provided in image.
"Slope = + h, intercept = -hv0. So, option (d) is not correct."
Wait, looking at image 1 option (d): The line starts from Origin! $KE = h\\nu$ implies $\phi=0$, which is impossible for metals. The line should cut x-axis at $\\nu_0$.
So (d) is the incorrect representation.

**Answer:** (d)`
        }
    },

    // Q6 - 2016 Main
    {
        id: 'jee_main_2016_q6',
        textMarkdown: `A stream of electrons from a heated filament was passed between two charged plates kept at a potential difference $V$ esu. If $e$ and $m$ are charge and mass of an electron, respectively, then the value of $h/\\lambda$ (where $\\lambda$ is wavelength associated with electron wave) is given by:`,
        options: [
            { id: 'a', text: '$2meV$', isCorrect: false },
            { id: 'b', text: '$\\sqrt{meV}$', isCorrect: false },
            { id: 'c', text: '$\\sqrt{2meV}$', isCorrect: true },
            { id: 'd', text: '$meV$', isCorrect: false },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.8 }, { tagId: 'TAG_DE_BROGLIE', weight: 0.9 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Medium',
        examSource: 'JEE Main 2016',
        isPYQ: true,
        solution: {
            textSolutionLatex: `**De Broglie Wavelength:** $\\lambda = \\frac{h}{p}$
So $\\frac{h}{\\lambda} = p$ (momentum).

Kinetic Energy $KE = eV$
Also $KE = \\frac{p^2}{2m}$
So $eV = \\frac{p^2}{2m}$
$p^2 = 2meV$
$p = \\sqrt{2meV}$

Therefore, $\\frac{h}{\\lambda} = \\sqrt{2meV}$

**Answer:** (c)`
        }
    },

    // Q7 - 2002, 3M (JEE Advanced)
    {
        id: 'jee_adv_2002_q7',
        textMarkdown: `Rutherford's experiment, which established the nuclear model of the atom, used a beam of:`,
        options: [
            { id: 'a', text: '$\\beta$-particles, which impinged on a metal foil and got absorbed', isCorrect: false },
            { id: 'b', text: '$\\gamma$-rays, which impinged on a metal foil and got scattered', isCorrect: false },
            { id: 'c', text: 'helium atoms, which impinged on a metal foil and got scattered', isCorrect: false },
            { id: 'd', text: 'helium nuclei, which impinged on a metal foil and got scattered', isCorrect: true },
        ],
        questionType: 'SCQ',
        conceptTags: [{ tagId: 'TAG_CH_ATOMIC_STRUCTURE', weight: 0.7 }, { tagId: 'TAG_RUTHERFORD_MODEL', weight: 0.9 }],
        tagId: 'TAG_CH_ATOMIC_STRUCTURE',
        difficulty: 'Easy',
        examSource: 'JEE Advanced 2002',
        isPYQ: true,
        solution: {
            textSolutionLatex: `Rutherford used $\\alpha$-particles.
$\\alpha$-particles are doubly ionized helium atoms ($He^{2+}$), i.e., Helium nuclei.
They were made to strike a thin gold foil and scattering was observed.

**Answer:** (d)`
        }
    }
];

// Add questions
let addedCount = 0;
NEW_QUESTIONS.forEach(q => {
    // Check for duplicates by ID
    const existsById = questions.find(existing => existing.id === q.id);

    // Check for duplicates by content (fuzzy)
    // We'll check if the start of the text matches
    const existsByText = questions.find(existing =>
        existing.textMarkdown && q.textMarkdown &&
        existing.textMarkdown.substring(0, 50) === q.textMarkdown.substring(0, 50)
    );

    if (!existsById && !existsByText) {
        questions.push(q);
        addedCount++;
        console.log(`Added: ${q.id}`);
    } else {
        console.log(`Skipped (exists): ${q.id}`);
    }
});

if (addedCount > 0) {
    fs.writeFileSync(DB_PATH, JSON.stringify(questions, null, 2));
    console.log(`\n✅ Import complete! Added ${addedCount} new questions.`);
} else {
    console.log(`\nNo new questions added.`);
}
