const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_electrochem';
function src(year, month, day, shift) { return { exam_name: 'JEE Main', year, month, day, shift }; }

function mkSCQ(id, diff, text, opts, correctId, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: correctId === 'a' },
      { id: 'b', text: opts[1], is_correct: correctId === 'b' },
      { id: 'c', text: opts[2], is_correct: correctId === 'c' },
      { id: 'd', text: opts[3], is_correct: correctId === 'd' }
    ],
    answer: { correct_option: correctId },
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

function mkNVT(id, diff, text, answer, solution, tag, examSrc) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [], answer,
    solution: { text_markdown: solution, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: examSrc, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null
  };
}

const questions = [

mkNVT('EC-071', 'Hard',
`For the given reactions: $\\mathrm{Sn^{2+} + 2e^- \\rightarrow Sn}$, $E° = -0.140\\ \\mathrm{V}$ and $\\mathrm{Sn^{4+} + 4e^- \\rightarrow Sn}$, $E° = 0.010\\ \\mathrm{V}$. The magnitude of standard electrode potential for $\\mathrm{Sn^{4+}/Sn^{2+}}$ is $\\_\\_\\_\\_ \\times 10^{-2}\\ \\mathrm{V}$ (Nearest integer)`,
{ integer_value: 16 },
`Using $\\Delta G° = -nFE°$: $\\Delta G°_1 = -2F(-0.140) = +0.280F$; $\\Delta G°_2 = -4F(0.010) = -0.040F$. Target ($\\mathrm{Sn^{4+} + 2e^- \\rightarrow Sn^{2+}}$): $\\Delta G°_3 = \\Delta G°_2 - \\Delta G°_1 = -0.040F - 0.280F = -0.320F$. $E°_3 = 0.320F/(2F) = 0.160\\ \\mathrm{V} = 16 \\times 10^{-2}\\ \\mathrm{V}$. **Answer: 16**`,
'tag_electrochem_6', src(2022, 'Jun', 28, 'Evening')),

mkNVT('EC-072', 'Hard',
`A dilute solution of sulphuric acid is electrolysed using a current of 0.10 A for 2 hours to produce hydrogen and oxygen gas. The total volume of gases produced at STP is $\\_\\_\\_\\_ \\mathrm{cm^3}$. (Nearest integer) [Given: $F = 96500\\ \\mathrm{C\\ mol^{-1}}$; molar volume at STP = $22.7\\ \\mathrm{L\\ mol^{-1}}$]`,
{ integer_value: 127 },
`$Q = 0.10 \\times 7200 = 720\\ \\mathrm{C}$; $n_{e^-} = 720/96500 = 7.461 \\times 10^{-3}$ mol. $n_{\\mathrm{H_2}} = 7.461\\times10^{-3}/2 = 3.730\\times10^{-3}$ mol; $n_{\\mathrm{O_2}} = 7.461\\times10^{-3}/4 = 1.865\\times10^{-3}$ mol. Total = $5.595\\times10^{-3}$ mol. $V = 5.595\\times10^{-3} \\times 22700 = 127\\ \\mathrm{cm^3}$. **Answer: 127**`,
'tag_electrochem_5', src(2022, 'Jun', 29, 'Morning')),

mkNVT('EC-073', 'Hard',
`The cell potential for the given cell at 298 K $\\mathrm{Pt|H_2(g, 1\\ bar)|H^+(aq)|Cu^{2+}(aq)|Cu(s)}$ is 0.31 V. The pH of the acidic solution is found to be 3, whereas the concentration of $\\mathrm{Cu^{2+}}$ is $10^x\\ \\mathrm{M}$. The value of x is $\\_\\_\\_\\_$. (Given: $E°_{\\mathrm{Cu^{2+}/Cu}} = 0.34\\ \\mathrm{V}$, $\\dfrac{2.303RT}{F} = 0.06\\ \\mathrm{V}$)`,
{ integer_value: 7 },
`Cell reaction: $\\mathrm{H_2 + Cu^{2+} \\rightarrow 2H^+ + Cu}$, $n=2$. Nernst: $0.31 = 0.34 - 0.03\\log\\frac{(10^{-3})^2}{10^x}$. $0.03\\log(10^{-6-x}) = 0.03$. $-6-x = 1 \\Rightarrow x = -7$. Magnitude = **7**. **Answer: 7**`,
'tag_electrochem_6', src(2022, 'Jun', 29, 'Evening')),

mkNVT('EC-074', 'Medium',
`These are physical properties of an element: (A) Sublimation enthalpy, (B) Ionisation enthalpy, (C) Hydration enthalpy, (D) Electron gain enthalpy. The total number of above properties that affect the reduction potential is $\\_\\_\\_\\_$ (Integer answer)`,
{ integer_value: 3 },
`Reduction potential for $\\mathrm{M^{n+}(aq) + ne^- \\rightarrow M(s)}$ depends on: (A) Sublimation enthalpy ✓, (B) Ionisation enthalpy ✓, (C) Hydration enthalpy ✓. Electron gain enthalpy (D) applies to non-metals, not metal reduction. **Answer: 3**`,
'tag_electrochem_4', src(2021, 'Aug', 26, 'Morning')),

mkNVT('EC-075', 'Hard',
`For the galvanic cell, $\\mathrm{Zn(s) + Cu^{2+}(0.02\\ M) \\rightarrow Zn^{2+}(0.04\\ M) + Cu(s)}$, $E_{\\text{cell}} = \\ldots \\times 10^{-2}\\ \\mathrm{V}$ (Nearest integer). [Use: $E°_{\\mathrm{Cu/Cu^{2+}}} = -0.34\\ \\mathrm{V}$, $E°_{\\mathrm{Zn/Zn^{2+}}} = +0.76\\ \\mathrm{V}$, $\\dfrac{2.303RT}{F} = 0.059\\ \\mathrm{V}$]`,
{ integer_value: 109 },
`$E°_{\\text{cell}} = 0.34 + 0.76 = 1.10\\ \\mathrm{V}$. Nernst ($n=2$): $E = 1.10 - 0.0295\\log(0.04/0.02) = 1.10 - 0.0295(0.301) = 1.10 - 0.00888 = 1.091\\ \\mathrm{V} = 109 \\times 10^{-2}\\ \\mathrm{V}$. **Answer: 109**`,
'tag_electrochem_6', src(2021, 'Aug', 26, 'Evening')),

mkNVT('EC-076', 'Hard',
`Consider the cell at $25°\\mathrm{C}$: $\\mathrm{Zn|Zn^{2+}(1\\ M)\\|Fe^{3+}(aq), Fe^{2+}(aq)|Pt(s)}$. The fraction of total iron present as $\\mathrm{Fe^{3+}}$ ion at the cell potential of 1.500 V is $x \\times 10^{-2}$. The value of x is $\\_\\_\\_\\_$. (Nearest integer). Given: $E°_{\\mathrm{Fe^{3+}/Fe^{2+}}} = 0.77\\ \\mathrm{V}$, $E°_{\\mathrm{Zn^{2+}/Zn}} = -0.76\\ \\mathrm{V}$`,
{ integer_value: 24 },
`$E°_{\\text{cell}} = 0.77+0.76 = 1.53\\ \\mathrm{V}$, $n=2$. Nernst: $1.500 = 1.53 - 0.0295\\log([\\mathrm{Fe^{2+}}]^2/[\\mathrm{Fe^{3+}}]^2)$. $\\log([\\mathrm{Fe^{2+}}]/[\\mathrm{Fe^{3+}}]) = 0.030/(2\\times0.0295) = 0.508$. $[\\mathrm{Fe^{2+}}]/[\\mathrm{Fe^{3+}}] = 3.22$. Fraction Fe³⁺ = $1/(1+3.22) = 0.237 \\approx 24\\times10^{-2}$. **Answer: 24**`,
'tag_electrochem_6', src(2021, 'Jul', 25, 'Morning')),

mkNVT('EC-077', 'Hard',
`For the reaction $\\mathrm{2Fe^{3+}(aq) + 2I^-(aq) \\rightarrow 2Fe^{2+}(aq) + I_2(s)}$ the magnitude of the standard molar free energy change, $\\Delta_r G°_m = -\\_\\_\\_\\_ \\mathrm{kJ}$ (Round off to the Nearest Integer). [$E°_{\\mathrm{Fe^{2+}/Fe}} = -0.440\\ \\mathrm{V}$; $E°_{\\mathrm{Fe^{3+}/Fe}} = -0.036\\ \\mathrm{V}$; $E°_{\\mathrm{I_2/2I^-}} = 0.539\\ \\mathrm{V}$; $F = 96500\\ \\mathrm{C}$]`,
{ integer_value: 45 },
`$E°_{\\mathrm{Fe^{3+}/Fe^{2+}}}$: $\\Delta G°_3 = -3F(-0.036) - [-2F(-0.440)] = 0.108F - 0.880F = -0.772F$; $E° = 0.772\\ \\mathrm{V}$. $E°_{\\text{cell}} = 0.772 - 0.539 = 0.233\\ \\mathrm{V}$, $n=2$. $\\Delta G° = -2\\times96500\\times0.233 = -44969\\ \\mathrm{J} \\approx -45\\ \\mathrm{kJ}$. **Answer: 45**`,
'tag_electrochem_6', src(2021, 'Mar', 18, 'Morning')),

mkNVT('EC-078', 'Hard',
`Emf of the following cell at 298 K in V is $x \\times 10^{-2}$: $\\mathrm{Zn|Zn^{2+}(0.1\\ M)\\|Ag^+(0.01\\ M)|Ag}$. The value of x is $\\_\\_\\_\\_$ (Rounded off to the nearest integer). [Given: $E°_{\\mathrm{Zn^{2+}/Zn}} = -0.76\\ \\mathrm{V}$; $E°_{\\mathrm{Ag^+/Ag}} = +0.80\\ \\mathrm{V}$; $\\dfrac{2.303RT}{F} = 0.059$]`,
{ integer_value: 147 },
`Cell reaction: $\\mathrm{Zn + 2Ag^+ \\rightarrow Zn^{2+} + 2Ag}$, $n=2$. $E°_{\\text{cell}} = 0.80 - (-0.76) = 1.56\\ \\mathrm{V}$. Nernst: $E = 1.56 - \\frac{0.059}{2}\\log\\frac{0.1}{(0.01)^2} = 1.56 - 0.0295\\log(1000) = 1.56 - 0.0295\\times3 = 1.56 - 0.0885 = 1.4715\\ \\mathrm{V} \\approx 147\\times10^{-2}$. **Answer: 147**`,
'tag_electrochem_6', src(2021, 'Feb', 26, 'Evening')),

mkNVT('EC-079', 'Hard',
`The Gibbs energy change (in J) for the given reaction at $[\\mathrm{Cu^{2+}}] = [\\mathrm{Sn^{2+}}] = 1\\ \\mathrm{M}$ and 298 K is: $\\mathrm{Cu(s) + Sn^{2+}(aq) \\rightarrow Cu^{2+}(aq) + Sn(s)}$. ($E°_{\\mathrm{Sn^{2+}/Sn}} = -0.16\\ \\mathrm{V}$, $E°_{\\mathrm{Cu^{2+}/Cu}} = 0.34\\ \\mathrm{V}$, $F = 96500\\ \\mathrm{C\\ mol^{-1}}$)`,
{ integer_value: 96500 },
`$E°_{\\text{cell}} = E°_{\\text{cathode}} - E°_{\\text{anode}} = -0.16 - 0.34 = -0.50\\ \\mathrm{V}$. At standard conditions ($Q=1$), $\\Delta G° = -nFE° = -2\\times96500\\times(-0.50) = +96500\\ \\mathrm{J}$. **Answer: 96500 J**`,
'tag_electrochem_6', src(2020, 'Sep', 2, 'Morning')),

mkSCQ('EC-080', 'Medium',
`![Zn-Cu electrochemical cell diagram](https://cdn.mathpix.com/cropped/348a7699-f081-484a-bb49-7f6c9ac889a6-08.jpg?height=506&width=762&top_left_y=1046&top_left_x=223)

$E°_{\\mathrm{Cu^{2+}/Cu}} = +0.34\\ \\mathrm{V}$; $E°_{\\mathrm{Zn^{2+}/Zn}} = -0.76\\ \\mathrm{V}$

Identify the incorrect statement from the options below for the above cell:`,
[
  'If $E_{\\text{ext}} > 1.1\\ \\mathrm{V}$, $e^-$ flow from Cu to Zn',
  'If $E_{\\text{ext}} > 1.1\\ \\mathrm{V}$, Zn dissolves at Zn electrode and Cu deposits at Cu electrode',
  'If $E_{\\text{ext}} < 1.1\\ \\mathrm{V}$, Zn dissolves at anode and Cu deposits at cathode',
  'If $E_{\\text{ext}} = 1.1\\ \\mathrm{V}$, no flow of $e^-$ or current occurs'
],
'b',
`$E°_{\\text{cell}}(\\mathrm{Zn/Cu}) = 0.34 - (-0.76) = 1.10\\ \\mathrm{V}$.

**If $E_{\\text{ext}} > 1.1\\ \\mathrm{V}$ (electrolytic mode):** External potential opposes and exceeds cell EMF → electrolysis occurs. Electrons are forced from external source into Zn electrode (cathode) and out of Cu electrode (anode). So $e^-$ flow from Cu to Zn through external circuit. Cu dissolves (anode) and Zn deposits (cathode) — the reverse of galvanic operation.

**Statement (2) says:** "Zn dissolves at Zn electrode and Cu deposits at Cu electrode" — this is the **galvanic** behaviour, which occurs when $E_{\\text{ext}} < 1.1\\ \\mathrm{V}$, NOT when $E_{\\text{ext}} > 1.1\\ \\mathrm{V}$. **INCORRECT ✗**

**Answer: Option (2)**`,
'tag_electrochem_4', src(2020, 'Sep', 4, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-071 to EC-080)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
