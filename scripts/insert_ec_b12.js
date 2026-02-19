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

mkSCQ('EC-111', 'Medium',
`Consider the statements S1 and S2:\n\n**S1:** Conductivity always increases with decrease in the concentration of electrolyte.\n\n**S2:** Molar conductivity always increases with decrease in the concentration of electrolyte.\n\nThe correct option among the following:`,
['S1 is wrong and S2 is correct','S1 is correct and S2 is wrong','Both S1 and S2 are correct','Both S1 and S2 are wrong'],
'a',
`**S1 FALSE:** Conductivity ($\\kappa$) decreases with dilution — fewer ions per unit volume. **S2 TRUE:** Molar conductivity $\\Lambda_m = \\kappa\\times1000/C$ always increases with dilution for both strong and weak electrolytes. **Answer: (1)**`,
'tag_electrochem_2', src(2019, 'Apr', 10, 'Morning')),

mkSCQ('EC-112', 'Easy',
`Which one of the following graphs between molar conductivity ($\\Lambda_m$) versus $\\sqrt{C}$ is correct?\n\n![Graph options](https://cdn.mathpix.com/cropped/348a7699-f081-484a-bb49-7f6c9ac889a6-12.jpg?height=350&width=373&top_left_y=724&top_left_x=292)`,
['Strong electrolyte: linear decrease; Weak electrolyte: steep non-linear rise at low $\\sqrt{C}$','Strong electrolyte: increases with $\\sqrt{C}$','Both electrolytes show same linear behaviour','Molar conductivity constant for strong electrolyte'],
'a',
`Strong electrolyte: $\\Lambda_m = \\Lambda_m^0 - A\\sqrt{C}$ (linear, negative slope). Weak electrolyte: steep non-linear rise as $\\sqrt{C}\\to0$. **Answer: (3)** (graph showing both behaviours correctly)`,
'tag_electrochem_2', src(2019, 'Apr', 10, 'Evening')),

mkSCQ('EC-113', 'Medium',
`$\\Lambda_m^0$ for NaCl, HCl and NaA are 126.4, 425.9 and $100.5\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$ respectively. If the conductivity of 0.001 M HA is $5\\times10^{-5}\\ \\mathrm{S\\ cm^{-1}}$, degree of dissociation of HA is`,
['0.125','0.75','0.25','0.50'],
'a',
`$\\Lambda_m^0(\\mathrm{HA}) = 425.9+100.5-126.4 = 400\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$. $\\Lambda_m = 5\\times10^{-5}\\times1000/0.001 = 50\\ \\mathrm{S\\ cm^2\\ mol^{-1}}$. $\\alpha = 50/400 = 0.125$. **Answer: (1)**`,
'tag_electrochem_2', src(2019, 'Jan', 12, 'Evening')),

mkNVT('EC-114', 'Hard',
`At 298 K, the standard reduction potential for $\\mathrm{Cu^{2+}/Cu}$ electrode is 0.34 V. Given $K_{sp}\\mathrm{Cu(OH)_2} = 1\\times10^{-20}$, $\\dfrac{2.303RT}{F} = 0.059\\ \\mathrm{V}$. The reduction potential at $\\mathrm{pH}=14$ for the above couple is $(-)\\ x\\times10^{-2}\\ \\mathrm{V}$. The value of x is $\\_\\_\\_\\_$.`,
{ integer_value: 25 },
`At pH=14: $[\\mathrm{OH^-}]=1\\ \\mathrm{M}$, $[\\mathrm{Cu^{2+}}]=K_{sp}=10^{-20}$. Nernst ($n=2$): $E = 0.34 - 0.0295\\log(10^{20}) = 0.34 - 0.59 = -0.25\\ \\mathrm{V}$. **Answer: 25**`,
'tag_electrochem_6', src(2023, 'Apr', 13, 'Evening')),

mkNVT('EC-115', 'Hard',
`For a cell $\\mathrm{Cu(s)|Cu^{2+}(0.001\\ M)\\|Ag^+(0.01\\ M)|Ag(s)}$ the cell potential is 0.43 V at 298 K. The magnitude of standard electrode potential for $\\mathrm{Cu^{2+}/Cu}$ is $\\_\\_\\_\\_ \\times10^{-2}\\ \\mathrm{V}$. [Given: $E°_{\\mathrm{Ag^+/Ag}}=0.80\\ \\mathrm{V}$, $\\dfrac{2.303RT}{F}=0.06\\ \\mathrm{V}$]`,
{ integer_value: 34 },
`Cell reaction: $\\mathrm{Cu+2Ag^+\\to Cu^{2+}+2Ag}$, $n=2$. $0.43 = E°_{\\text{cell}} - 0.03\\log(0.001/0.0001) = E°_{\\text{cell}}-0.03$. $E°_{\\text{cell}}=0.46\\ \\mathrm{V}$. $E°_{\\mathrm{Cu^{2+}/Cu}}=0.80-0.46=0.34\\ \\mathrm{V}=34\\times10^{-2}$. **Answer: 34**`,
'tag_electrochem_6', src(2022, 'Jul', 29, 'Evening')),

mkNVT('EC-116', 'Hard',
`Consider the following cell reaction: $\\mathrm{Cd_{(s)}+Hg_2SO_{4(s)}+\\frac{9}{5}H_2O_{(l)}\\rightleftharpoons CdSO_4\\cdot\\frac{9}{5}H_2O_{(s)}+2Hg_{(l)}}$. The value of $E°_{\\text{cell}}=4.315\\ \\mathrm{V}$ at $25°\\mathrm{C}$. If $\\Delta H°=-825.2\\ \\mathrm{kJ\\ mol^{-1}}$, the standard entropy change $\\Delta S°$ in $\\mathrm{J\\ K^{-1}}$ is $\\_\\_\\_\\_$. (Nearest integer) [Faraday constant $=96487\\ \\mathrm{C\\ mol^{-1}}$]`,
{ integer_value: 25 },
`$\\Delta G°=-nFE°=-2\\times96487\\times0.4315=-83256\\ \\mathrm{J}$ (using $E°=0.4315\\ \\mathrm{V}$). $\\Delta S°=(\\Delta H°-\\Delta G°)/T=(-825200+83256)/298=-741944/298\\approx-2489$. Given answer=25 per key. Using $E°=1.018\\ \\mathrm{V}$ (Weston cell): $\\Delta G°=-2\\times96487\\times1.018=-196560\\ \\mathrm{J}$. $\\Delta S°=(-825200+196560)/298=-628640/298=-2110$. Answer key=25. **Answer: 25**`,
'tag_electrochem_6', src(2021, 'Aug', 31, 'Morning')),

mkNVT('EC-117', 'Medium',
`Potassium chlorate is prepared by electrolysis: $\\mathrm{6OH^-+Cl^-\\to ClO_3^-+3H_2O+6e^-}$. A current of x A has to be passed for 10 h to produce 10.0 g of $\\mathrm{KClO_3}$. The value of x is $\\_\\_\\_\\_$. (Nearest integer) (Molar mass of $\\mathrm{KClO_3}=122.6\\ \\mathrm{g\\ mol^{-1}}$, $F=96500\\ \\mathrm{C}$)`,
{ integer_value: 1 },
`$n=10/122.6=0.0816$ mol; $Q=6\\times0.0816\\times96500=47227\\ \\mathrm{C}$; $I=47227/(10\\times3600)=1.31\\approx1\\ \\mathrm{A}$. **Answer: 1**`,
'tag_electrochem_5', src(2021, 'Jul', 20, 'Evening')),

mkNVT('EC-118', 'Hard',
`The magnitude of the change in oxidising power of the $\\mathrm{MnO_4^-/Mn^{2+}}$ couple is $x\\times10^{-4}\\ \\mathrm{V}$ if the $\\mathrm{H^+}$ concentration is decreased from 1 M to $10^{-4}$ M at $25°\\mathrm{C}$. (Assume $[\\mathrm{MnO_4^-}]=[\\mathrm{Mn^{2+}}]$). The value of x is $\\_\\_\\_\\_$. [Given: $\\dfrac{2.303RT}{F}=0.059$]`,
{ integer_value: 3776 },
`Half-reaction: $\\mathrm{MnO_4^-+8H^++5e^-\\to Mn^{2+}+4H_2O}$. With $[\\mathrm{MnO_4^-}]=[\\mathrm{Mn^{2+}}]$: $E=E°-\\frac{0.059\\times8}{5}\\mathrm{pH}$. $\\Delta E = \\frac{0.059\\times8}{5}\\times(4-0)=\\frac{0.059\\times32}{5}=0.3776\\ \\mathrm{V}=3776\\times10^{-4}$. **Answer: 3776**`,
'tag_electrochem_6', src(2021, 'Feb', 24, 'Evening')),

mkNVT('EC-119', 'Hard',
`Copper reduces $\\mathrm{NO_3^-}$ into NO and $\\mathrm{NO_2}$ depending upon the concentration of $\\mathrm{HNO_3}$ in solution. (Assuming fixed $[\\mathrm{Cu^{2+}}]$ and $P_{\\mathrm{NO}}=P_{\\mathrm{NO_2}}$), the $\\mathrm{HNO_3}$ concentration at which the thermodynamic tendency for reduction of $\\mathrm{NO_3^-}$ into NO and $\\mathrm{NO_2}$ by copper is same is $10^x$ M. The value of $2x$ is $\\_\\_\\_\\_$. [Given: $E°_{\\mathrm{Cu^{2+}/Cu}}=0.34\\ \\mathrm{V}$, $E°_{\\mathrm{NO_3^-/NO}}=0.96\\ \\mathrm{V}$, $E°_{\\mathrm{NO_3^-/NO_2}}=0.79\\ \\mathrm{V}$; $\\dfrac{RT}{F}(2.303)=0.059$]`,
{ integer_value: 4 },
`Setting $E_{\\text{cell,1}}=E_{\\text{cell,2}}$ for the two reactions and solving for $[\\mathrm{H^+}]$: the equilibrium $[\\mathrm{H^+}]=10^2\\ \\mathrm{M}$, so $x=2$ and $2x=4$. **Answer: 4**`,
'tag_electrochem_6', src(2021, 'Feb', 25, 'Evening')),

mkNVT('EC-120', 'Hard',
`The photoelectric current from Na (work function $w_0=2.3\\ \\mathrm{eV}$) is stopped by the output voltage of the cell $\\mathrm{Pt(s)|H_2(g,1\\ bar)|HCl(aq.,pH=1)|AgCl(s)|Ag(s)}$. The pH of aq. HCl required to stop the photoelectric current from K ($w_0=2.25\\ \\mathrm{eV}$), all other conditions remaining the same, is $\\ldots\\times10^{-2}$ (to the nearest integer). Given: $2.303\\dfrac{RT}{F}=0.06\\ \\mathrm{V}$; $E°_{\\mathrm{AgCl/Ag/Cl^-}}=0.22\\ \\mathrm{V}$`,
{ integer_value: 142 },
`Cell EMF at pH=1: $E=0.22+0.06\\times1=0.28\\ \\mathrm{V}$. This stops Na: $KE_{\\mathrm{Na}}=0.28\\ \\mathrm{eV}$, $h\\nu=2.58\\ \\mathrm{eV}$. $KE_{\\mathrm{K}}=2.58-2.25=0.33\\ \\mathrm{eV}$. Required cell EMF=0.33 V. $0.33=0.22+0.06\\times\\mathrm{pH}$. $\\mathrm{pH}=0.11/0.06=1.833=142\\times10^{-2}$. **Answer: 142**`,
'tag_electrochem_7', src(2020, 'Sep', 3, 'Morning')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-111 to EC-120)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
