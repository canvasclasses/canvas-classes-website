/**
 * Add/Restore Q55 (Jan 21 Morning)
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../app/the-crucible/questions.json');
let questions = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const q55 = {
    id: 'jee_2026_jan21m_q55',
    textMarkdown: `Given below are two statements:

**Statement I:** The number of pairs among $[SiO_2, CO_2]$, $[SnO, SnO_2]$, $[PbO, PbO_2]$ and $[GeO, GeO_2]$, which contain oxides that are both amphoteric is 2.

**Statement II:** $BF_3$ is an electron deficient molecule can act as a lewis acid, forms adduct with $NH_3$ and has a trigonal planar geometry.

In the light of the above statement, choose the correct answer from the option given below.`,
    options: [
        { id: '1', text: 'Both **Statement I** and **Statement II** are true.', isCorrect: true },
        { id: '2', text: 'Both **Statement I** and **Statement II** are false.', isCorrect: false },
        { id: '3', text: '**Statement I** is true but **Statement II** is false.', isCorrect: false },
        { id: '4', text: '**Statement I** is false **Statement II** is true.', isCorrect: false },
    ],
    questionType: 'SCQ',
    conceptTags: [
        { tagId: 'TAG_CH_P_BLOCK', weight: 0.6 },
        { tagId: 'TAG_PB_GROUP13', weight: 0.2 },
        { tagId: 'TAG_PB_GROUP14', weight: 0.2 }
    ],
    tagId: 'TAG_CH_P_BLOCK',
    difficulty: 'Medium',
    examSource: 'JEE Main 2026 - Jan 21 Morning Shift',
    isPYQ: true,
    solution: {
        textSolutionLatex: `**Statement I Analysis:**

Amphoteric oxides inhibit both acidic and basic properties.
*   $[SiO_2, CO_2]$: Both are **Acidic**. (0 pairs)
*   $[SnO, SnO_2]$: Both are **Amphoteric**. (1 pair)
*   $[PbO, PbO_2]$: Both are **Amphoteric**. (1 pair)
*   $[GeO, GeO_2]$: $GeO$ is distinct, $GeO_2$ is acidic/amphoteric but generally Ge oxides are less amphoteric than Sn/Pb. NCERT classifies Sn and Pb oxides specifically as amphoteric.

Thus, the number of pairs is **2**.
**Statement I is True.**

**Statement II Analysis:**
*   $BF_3$: Boron has 6 valence electrons (incomplete octet) $\\rightarrow$ **Electron deficient**.
*   Acts as **Lewis Acid** (electron pair acceptor).
*   Forms adduct with Lewis bases like $NH_3$ ($F_3B \\leftarrow NH_3$).
*   Hybridization is $sp^2$ $\\rightarrow$ **Trigonal Planar**.

**Statement II is True.**

**Answer: Option (1)**`
    }
};

// Check if exists
const idx = questions.findIndex(q => q.id === q55.id);
if (idx >= 0) {
    console.log('Updating existing Q55...');
    questions[idx] = q55;
} else {
    console.log('Adding new Q55...');
    // Log where we are adding it (to preserve sorted order if possible, or just push)
    // We'll push, user can sort in Admin.
    questions.push(q55);
}

fs.writeFileSync(DB_PATH, JSON.stringify(questions, null, 2));
console.log('✅ Q55 restored successfully.');
