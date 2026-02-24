// JEE Main 2025 Jan 24 Morning — Batch 1: Q51–Q55
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const EXAM_SOURCE = { exam: 'JEE Main', year: 2025, month: 'Jan', day: 24, shift: 'Morning' };

const questions = [
  {
    _id: uuidv4(), display_id: 'ELEC-090',
    question_text: { markdown: `For the given cell:\n\n$$\\text{Fe}^{2+}(\\text{eq}) + \\text{Ag}^+(\\text{aq}) \\rightarrow \\text{Fe}^{3+}(\\text{aq}) + \\text{Ag}(s)$$\n\nThe standard cell potential of the above reaction is:\n\nGiven:\n- $\\text{Ag}^+ + e^- \\rightarrow \\text{Ag}$ \\quad $E^0 = x\\,\\text{V}$\n- $\\text{Fe}^{2+} + 2e^- \\rightarrow \\text{Fe}$ \\quad $E^0 = y\\,\\text{V}$\n- $\\text{Fe}^{3+} + 3e^- \\rightarrow \\text{Fe}$ \\quad $E^0 = z\\,\\text{V}$\n\n(a) $x + y - z$ \\quad (b) $x + 2y - 3z$ \\quad (c) $y - 2x$ \\quad (d) $x + 2y$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$x + y - z$', is_correct: false },
      { id: 'b', text: '$x + 2y - 3z$', is_correct: true },
      { id: 'c', text: '$y - 2x$', is_correct: false },
      { id: 'd', text: '$x + 2y$', is_correct: false },
    ],
    answer: { correct_option: 'b', explanation: 'Use Hess law with Gibbs energies. ΔG°(Fe2+→Fe3+) = ΔG°(Fe3+→Fe) - ΔG°(Fe2+→Fe) = -3Fz - (-2Fy) = 2Fy - 3Fz. E°cell = x + (2y-3z)/1 = x + 2y - 3z.' },
    solution: { text_markdown: `**Step 1 — Identify half-reactions for the cell:**\n\nCathode (reduction): $\\text{Ag}^+ + e^- \\rightarrow \\text{Ag}$, $E^0 = x\\,\\text{V}$\n\nAnode (oxidation): $\\text{Fe}^{2+} \\rightarrow \\text{Fe}^{3+} + e^-$\n\n**Step 2 — Find $E^0$ for Fe²⁺ → Fe³⁺ using Gibbs energy:**\n\n$$\\text{Fe}^{3+} + 3e^- \\rightarrow \\text{Fe}, \\quad \\Delta G_3^0 = -3Fz$$\n$$\\text{Fe}^{2+} + 2e^- \\rightarrow \\text{Fe}, \\quad \\Delta G_2^0 = -2Fy$$\n\nSubtracting: $\\text{Fe}^{2+} \\rightarrow \\text{Fe}^{3+} + e^-$\n\n$$\\Delta G^0 = \\Delta G_3^0 - \\Delta G_2^0 = -3Fz - (-2Fy) = 2Fy - 3Fz$$\n\n$$E^0_{\\text{Fe}^{2+}/\\text{Fe}^{3+}} = -(2Fy - 3Fz)/F = 3z - 2y$$\n\n**Step 3 — Cell potential:**\n\n$$E^0_{\\text{cell}} = E^0_{\\text{cathode}} + E^0_{\\text{anode (oxidation)}}$$\n$$= x + (3z - 2y) \\cdot (-1) \\text{ [as oxidation]}$$\n\nUsing $E^0_{\\text{cell}} = E^0_{\\text{cathode}} - E^0_{\\text{anode (reduction)}}$:\n\n$$E^0_{\\text{cell}} = x - (3z - 2y) = x + 2y - 3z$$\n\n$$\\boxed{E^0_{\\text{cell}} = x + 2y - 3z}$$`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch12_electrochem', tags: [{ tag_id: 'tag_elec_1', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'HC-172',
    question_text: { markdown: `Following are the four molecules "P", "Q", "R" and "S". Which one among the four molecules will react with H-Br(aq) at the fastest rate?\n\n(P = dihydropyran (vinyl ether cyclic), Q = cyclohex-2-en-1-one (enone), R = 4-methylenecyclohex-1-ene with gem-dimethyl, S = 1,4-dimethylcyclohex-1-ene)\n\n(a) S \\quad (b) Q \\quad (c) R \\quad (d) P`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'S', is_correct: false },
      { id: 'b', text: 'Q', is_correct: true },
      { id: 'c', text: 'R', is_correct: false },
      { id: 'd', text: 'P', is_correct: false },
    ],
    answer: { correct_option: 'b', explanation: 'Q (cyclohex-2-en-1-one) reacts fastest via electrophilic addition. The enone forms a resonance-stabilised oxocarbenium/carbocation intermediate. Q forms the most stable carbocation intermediate due to resonance stabilisation with the oxygen lone pair.' },
    solution: { text_markdown: `**Mechanism:** H-Br(aq) adds to alkenes via electrophilic addition. The rate depends on the stability of the carbocation intermediate formed in the rate-determining step.\n\n**Analysing each molecule:**\n\n- **P** (dihydropyran — vinyl ether): The oxygen lone pair stabilises the adjacent carbocation by resonance → very reactive, but the question asks for fastest.\n- **Q** (cyclohex-2-en-1-one — enone): Protonation at the β-carbon gives an oxocarbenium ion stabilised by the carbonyl oxygen → **most stable carbocation** → fastest rate.\n- **R** (methylenecyclohexane with gem-dimethyl): Tertiary carbocation but no extra resonance.\n- **S** (1,4-dimethylcyclohexene): Secondary/tertiary carbocation, no special stabilisation.\n\n**Q forms the most resonance-stabilised carbocation intermediate:**\n\n$$\\text{C=C-C=O} \\xrightarrow{\\text{H}^+} \\overset{+}{\\text{C}}-\\text{C=C-O}^- \\leftrightarrow \\overset{+}{\\text{C}}-\\text{C}-\\text{C=O}$$\n\n**Answer: (b) Q**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_hydrocarbon', tags: [{ tag_id: 'tag_hc_3', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'CORD-257',
    question_text: { markdown: `One mole of the octahedral complex compound $\\text{Co(NH}_3)_5\\text{Cl}_3$ gives 3 moles of ions on dissolution in water. One mole of the same complex reacts with excess of $\\text{AgNO}_3$ solution to yield two moles of $\\text{AgCl}_{(s)}$. The structure of the complex is:\n\n(a) $[\\text{Co(NH}_3)_5\\text{Cl}]\\text{Cl}_2$\n(b) $[\\text{Co(NH}_3)_4\\text{Cl}]\\text{Cl}_2\\cdot\\text{NH}_3$\n(c) $[\\text{Co(NH}_3)_4\\text{Cl}_2]\\text{Cl}\\cdot\\text{NH}_3$\n(d) $[\\text{Co(NH}_3)_3\\text{Cl}_3]\\cdot 2\\text{NH}_3$`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: '$[\\text{Co(NH}_3)_5\\text{Cl}]\\text{Cl}_2$', is_correct: true },
      { id: 'b', text: '$[\\text{Co(NH}_3)_4\\text{Cl}]\\text{Cl}_2\\cdot\\text{NH}_3$', is_correct: false },
      { id: 'c', text: '$[\\text{Co(NH}_3)_4\\text{Cl}_2]\\text{Cl}\\cdot\\text{NH}_3$', is_correct: false },
      { id: 'd', text: '$[\\text{Co(NH}_3)_3\\text{Cl}_3]\\cdot 2\\text{NH}_3$', is_correct: false },
    ],
    answer: { correct_option: 'a', explanation: '[Co(NH3)5Cl]Cl2 → [Co(NH3)5Cl]2+ + 2Cl- → 3 ions ✓. With AgNO3: 2 Cl- (ionic) → 2 AgCl ✓. The Cl inside the coordination sphere does not precipitate.' },
    solution: { text_markdown: `**Clue 1:** 1 mole gives **3 moles of ions** on dissolution.\n\n**Clue 2:** Reacts with excess AgNO₃ to give **2 moles of AgCl** → 2 ionic Cl⁻ outside the coordination sphere.\n\n**Testing option (a): $[\\text{Co(NH}_3)_5\\text{Cl}]\\text{Cl}_2$**\n\n$$[\\text{Co(NH}_3)_5\\text{Cl}]\\text{Cl}_2 \\rightarrow [\\text{Co(NH}_3)_5\\text{Cl}]^{2+} + 2\\text{Cl}^-$$\n\n- Ions produced: 1 complex cation + 2 Cl⁻ = **3 ions** ✓\n- AgNO₃ precipitates 2 ionic Cl⁻ → **2 moles AgCl** ✓\n- 1 Cl is inside the coordination sphere (not precipitated) ✓\n\n**All conditions satisfied → Answer: (a)**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch12_coord', tags: [{ tag_id: 'tag_cord_1', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'GOC-145',
    question_text: { markdown: `Which one of the carbocations from the following is most stable?\n\n(a) $\\overset{+}{\\text{CH}_2}$–CH=CH–CH₂–O–CH₃$ (allylic, adjacent to ether)\n(b) $\\overset{+}{\\text{CH}_2}$–CH=CH–O–CH₃$ (allylic vinyl ether type)\n(c) $\\overset{+}{\\text{CH}_2}$–CH=CH–O–C(=O)–CH₃$ (allylic, adjacent to ester)\n(d) $\\overset{+}{\\text{CH}_2}$–CH=CH–F$ (allylic, adjacent to F)`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'Allylic carbocation adjacent to –OCH₃ (through CH₂)', is_correct: false },
      { id: 'b', text: 'Allylic carbocation: $\\overset{+}{\\text{CH}_2}$–CH=CH–OCH₃', is_correct: true },
      { id: 'c', text: 'Allylic carbocation adjacent to ester group', is_correct: false },
      { id: 'd', text: 'Allylic carbocation adjacent to F', is_correct: false },
    ],
    answer: { correct_option: 'b', explanation: 'Option (b): +CH2-CH=CH-OCH3. The oxygen lone pair of OCH3 directly conjugated with the allylic system provides maximum resonance stabilisation (+M effect). This gives an oxocarbenium resonance structure: CH2=CH-CH=O+CH3, making it the most stable.' },
    solution: { text_markdown: `**Carbocation stability — key factors:** Resonance > Hyperconjugation > Inductive effects.\n\n**Option (b): $\\overset{+}{\\text{CH}_2}\\text{–CH=CH–OCH}_3$**\n\nThis is an allylic carbocation where the oxygen of –OCH₃ is **directly conjugated** with the double bond:\n\n$$\\overset{+}{\\text{CH}_2}\\text{–CH=CH–O–CH}_3 \\longleftrightarrow \\text{CH}_2\\text{=CH–CH=}\\overset{+}{\\text{O}}\\text{–CH}_3$$\n\nThe oxygen lone pair delocalises into the carbocation through the π system → **oxocarbenium resonance** → maximum stabilisation.\n\n**Comparison:**\n- (a): –OCH₃ is separated by –CH₂– (no direct conjugation with +)\n- (c): Ester oxygen is less electron-donating (carbonyl withdraws electrons)\n- (d): F is electronegative; –I effect destabilises carbocation\n\n**Most stable: (b)**`, latex_validated: true },
    metadata: { difficulty: 'Hard', chapter_id: 'ch11_goc', tags: [{ tag_id: 'tag_goc_3', weight: 1.0 }], is_pyq: true, is_top_pyq: true, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
  {
    _id: uuidv4(), display_id: 'MOLE-428',
    question_text: { markdown: `Which of the following linear combination of atomic orbitals will lead to formation of molecular orbitals in homonuclear diatomic molecules (internuclear axis in z-direction)?\n\nA. $2p_z$ and $2p_x$ \\quad B. $2s$ and $2p_x$ \\quad C. $3d_{xy}$ and $3d_{x^2-y^2}$ \\quad D. $2s$ and $2p_z$ \\quad E. $2p_z$ and $3d_{x^2-y^2}$\n\n(a) E Only \\quad (b) A and B Only \\quad (c) D Only \\quad (d) C and D Only`, latex_validated: true },
    type: 'SCQ',
    options: [
      { id: 'a', text: 'E Only', is_correct: false },
      { id: 'b', text: 'A and B Only', is_correct: false },
      { id: 'c', text: 'D Only', is_correct: true },
      { id: 'd', text: 'C and D Only', is_correct: false },
    ],
    answer: { correct_option: 'c', explanation: 'For LCAO to form MOs, orbitals must have: (1) compatible symmetry about the bond axis (z), (2) similar energy, (3) significant overlap. 2s and 2pz both have sigma symmetry about z-axis → can combine. All others have incompatible symmetry (zero net overlap).' },
    solution: { text_markdown: `**Conditions for LCAO to form MOs:**\n1. Similar energy\n2. Same symmetry about the internuclear (z) axis\n3. Significant overlap\n\n**Internuclear axis = z-direction.**\n\n**Evaluating each combination:**\n\n| Combination | Symmetry match? | Forms MO? |\n|---|---|---|\n| A: $2p_z + 2p_x$ | $\\sigma$ vs $\\pi$ — different symmetry | ❌ No |\n| B: $2s + 2p_x$ | $\\sigma$ vs $\\pi$ — different symmetry | ❌ No |\n| C: $3d_{xy} + 3d_{x^2-y^2}$ | Both $\\delta$ but different orientation | ❌ No |\n| **D: $2s + 2p_z$** | Both $\\sigma$ symmetry about z-axis | ✅ **Yes** |\n| E: $2p_z + 3d_{x^2-y^2}$ | $\\sigma$ vs $\\delta$ — different symmetry | ❌ No |\n\n**Only D (2s and 2pz) forms molecular orbitals.**\n\n**Answer: (c) D Only**`, latex_validated: true },
    metadata: { difficulty: 'Medium', chapter_id: 'ch11_mole', tags: [{ tag_id: 'tag_mole_5', weight: 1.0 }], is_pyq: true, is_top_pyq: false, exam_source: EXAM_SOURCE },
    status: 'published', created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), version: 1, deleted_at: null
  },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  let ok = 0, fail = 0;
  for (const q of questions) {
    try {
      await col.insertOne(q);
      console.log(`  OK  ${q.display_id}`);
      ok++;
    } catch (e) {
      console.log(`  FAIL ${q.display_id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nBatch 1 done: ${ok} OK, ${fail} FAIL`);
  await mongoose.disconnect();
}

main().catch(console.error);
