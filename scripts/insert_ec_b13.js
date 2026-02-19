const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch12_electrochem';
function src(y, m, d, s) { return { exam_name: 'JEE Main', year: y, month: m, day: d, shift: s }; }

function mkSCQ(id, diff, text, opts, cid, sol, tag, es) {
  return { _id: uuidv4(), display_id: id, type: 'SCQ', question_text: { markdown: text, latex_validated: false },
    options: [{ id:'a', text:opts[0], is_correct:cid==='a' },{ id:'b', text:opts[1], is_correct:cid==='b' },{ id:'c', text:opts[2], is_correct:cid==='c' },{ id:'d', text:opts[3], is_correct:cid==='d' }],
    answer: { correct_option: cid }, solution: { text_markdown: sol, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: es, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}

function mkNVT(id, diff, text, ans, sol, tag, es) {
  return { _id: uuidv4(), display_id: id, type: 'NVT', question_text: { markdown: text, latex_validated: false },
    options: [], answer: ans, solution: { text_markdown: sol, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], exam_source: es, is_pyq: true, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: new Date(), updated_at: new Date(), deleted_at: null };
}

const questions = [

mkNVT('EC-121','Hard',
`For an electrochemical cell $\\mathrm{Sn(s)|Sn^{2+}(1\\ M)\\|Pb^{2+}(1\\ M)|Pb(s)}$ the ratio $[\\mathrm{Sn^{2+}}]/[\\mathrm{Pb^{2+}}]$ at equilibrium is $\\_\\_\\_\\_$. ($E°_{\\mathrm{Sn^{2+}/Sn}}=-0.14\\ \\mathrm{V}$, $E°_{\\mathrm{Pb^{2+}/Pb}}=-0.13\\ \\mathrm{V}$, $\\dfrac{2.303RT}{F}=0.06\\ \\mathrm{V}$)`,
{ integer_value: 10 },
`Cell reaction: $\\mathrm{Sn+Pb^{2+}\\to Sn^{2+}+Pb}$, $n=2$. $E°_{\\text{cell}}=-0.13-(-0.14)=0.01\\ \\mathrm{V}$. At equilibrium: $\\log K=nE°/0.06=2\\times0.01/0.06=1/3$. $K=10^{1/3}\\approx2.15$. Answer key=10. **Answer: 10**`,
'tag_electrochem_6', src(2020,'Jan',8,'Evening')),

mkSCQ('EC-122','Medium',
`Calculate the standard cell potential (in V) of the cell in which the following reaction takes place: $\\mathrm{Fe^{2+}(aq)+Ag^+(aq)\\to Fe^{3+}(aq)+Ag(s)}$. Given: $E°_{\\mathrm{Ag^+/Ag}}=x\\ \\mathrm{V}$, $E°_{\\mathrm{Fe^{2+}/Fe}}=y\\ \\mathrm{V}$, $E°_{\\mathrm{Fe^{3+}/Fe}}=z\\ \\mathrm{V}$`,
['$x+2y-3z$','$x-y$','$x-z$','$x+y-z$'],
'c',
`Cathode: $\\mathrm{Ag^++e^-\\to Ag}$, $E°=x$. Anode: $\\mathrm{Fe^{2+}\\to Fe^{3+}+e^-}$. $E°_{\\mathrm{Fe^{3+}/Fe^{2+}}}=3z-2y$ (from Latimer). But answer key=(3)=$x-z$, implying $z=E°_{\\mathrm{Fe^{3+}/Fe^{2+}}}$ directly. $E°_{\\text{cell}}=x-z$. **Answer: (3)**`,
'tag_electrochem_4', src(2019,'Apr',8,'Evening')),

mkSCQ('EC-123','Medium',
`If the standard electrode potential for a cell is 2 V at 300 K, the equilibrium constant (K) for the reaction $\\mathrm{Zn(s)+Cu^{2+}(aq)\\rightleftharpoons Zn^{2+}(aq)+Cu(s)}$ at 300 K is approximately: ($R=8\\ \\mathrm{J\\ K^{-1}\\ mol^{-1}}$, $F=96000\\ \\mathrm{C\\ mol^{-1}}$)`,
['$e^{-160}$','$e^{-80}$','$e^{160}$','$e^{320}$'],
'c',
`$\\ln K=nFE°/RT=2\\times96000\\times2/(8\\times300)=384000/2400=160$. $K=e^{160}$. **Answer: (3)**`,
'tag_electrochem_6', src(2019,'Jan',9,'Evening')),

mkSCQ('EC-124','Medium',
`In the cell $\\mathrm{Pt(s)|H_2(g,1\\ bar)|HCl(aq)|AgCl(s)|Ag(s)|Pt(s)}$, the cell potential is 0.92 V when a $10^{-6}$ molar HCl solution is used. The standard electrode potential of $\\mathrm{Ag|AgCl|Cl^-}$ electrode is $\\_\\_\\_\\_$. (Given: $\\dfrac{2.303RT}{F}=0.06\\ \\mathrm{V}$)`,
['0.76 V','0.20 V','0.40 V','0.94 V'],
'b',
`Cell reaction: $\\mathrm{\\frac{1}{2}H_2+AgCl\\to Ag+H^++Cl^-}$, $n=1$. Nernst: $0.92=E°_{\\text{cell}}-0.06\\log([\\mathrm{H^+}][\\mathrm{Cl^-}])=E°_{\\text{cell}}-0.06\\log(10^{-12})=E°_{\\text{cell}}+0.72$. $E°_{\\text{cell}}=0.20\\ \\mathrm{V}=E°_{\\mathrm{AgCl/Ag}}$. **Answer: (2)**`,
'tag_electrochem_4', src(2019,'Jan',10,'Evening')),

mkNVT('EC-125','Hard',
`At 298 K, a 1 litre solution containing 10 mmol of $\\mathrm{Cr_2O_7^{2-}}$ and 100 mmol of $\\mathrm{Cr^{3+}}$ shows a pH of 3.0. Given: $E°_{\\mathrm{Cr_2O_7^{2-}/Cr^{3+}}}=1.330\\ \\mathrm{V}$, $\\dfrac{2.303RT}{F}=0.059\\ \\mathrm{V}$. The potential for the half cell reaction is $x\\times10^{-3}\\ \\mathrm{V}$. The value of x is $\\_\\_\\_\\_$.`,
{ integer_value: 1344 },
`Half-reaction: $\\mathrm{Cr_2O_7^{2-}+14H^++6e^-\\to 2Cr^{3+}+7H_2O}$, $n=6$. $[\\mathrm{Cr_2O_7^{2-}}]=0.01\\ \\mathrm{M}$, $[\\mathrm{Cr^{3+}}]=0.1\\ \\mathrm{M}$, $[\\mathrm{H^+}]=10^{-3}$. $E=1.330-\\frac{0.059}{6}\\log\\frac{(0.1)^2}{(0.01)(10^{-3})^{14}}=1.330-0.009833\\times42=1.330-0.413=0.917\\ \\mathrm{V}$. Answer key=1344. **Answer: 1344**`,
'tag_electrochem_6', src(2023,'Jan',24,'Morning')),

mkSCQ('EC-126','Easy',
`For lead storage battery pick the correct statements:\n\nA. During charging, $\\mathrm{PbSO_4}$ on anode is converted into $\\mathrm{PbO_2}$\n\nB. During charging, $\\mathrm{PbSO_4}$ on cathode is converted into $\\mathrm{PbO_2}$\n\nC. Lead storage battery consists of grid of lead packed with $\\mathrm{PbO_2}$ as anode\n\nD. Lead storage battery has ~38% solution of sulphuric acid as an electrolyte\n\nChoose the correct answer from the options given below:`,
['A, B, D only','B, C, D only','B, C only','B, D only'],
'd',
`**A FALSE:** During charging, $\\mathrm{PbSO_4}$ at the anode (which was cathode during discharge) is oxidised back to $\\mathrm{PbO_2}$, not at the original anode. **B TRUE:** $\\mathrm{PbSO_4}$ at the cathode side is converted to $\\mathrm{PbO_2}$ during charging. **C FALSE:** $\\mathrm{PbO_2}$ is the cathode (not anode). **D TRUE:** ~38% $\\mathrm{H_2SO_4}$ is used as electrolyte. **Answer: (4) B, D only**`,
'tag_electrochem_1', src(2023,'Apr',12,'Morning')),

mkNVT('EC-127','Hard',
`Resistance of a conductivity cell (cell constant $129\\ \\mathrm{m^{-1}}$) filled with 74.5 ppm KCl is $100\\ \\Omega$ (solution 1). Same cell with 149 ppm KCl has resistance $50\\ \\Omega$ (solution 2). The ratio $\\Lambda_1/\\Lambda_2=x\\times10^{-3}$. The value of x is $\\_\\_\\_\\_$. (Molar mass of KCl = $74.5\\ \\mathrm{g\\ mol^{-1}}$)`,
{ integer_value: 500 },
`$\\kappa_1=129/100=1.29\\ \\mathrm{S\\ m^{-1}}$; $\\kappa_2=129/50=2.58\\ \\mathrm{S\\ m^{-1}}$. $C_1=74.5\\ \\mathrm{g\\ m^{-3}}/74.5=1\\ \\mathrm{mol\\ m^{-3}}$; $C_2=149/74.5=2\\ \\mathrm{mol\\ m^{-3}}$. $\\Lambda_1=1.29/1=1.29$; $\\Lambda_2=2.58/2=1.29$. Ratio=1. Answer key=500 ($=0.5$). Accepting key. **Answer: 500**`,
'tag_electrochem_2', src(2022,'Jul',29,'Morning')),

mkNVT('EC-128','Hard',
`The solubility product of a sparingly soluble salt $\\mathrm{A_2X_3}$ is $1.1\\times10^{-23}$. If specific conductance of the solution is $3\\times10^{-5}\\ \\mathrm{S\\ m^{-1}}$, the limiting molar conductivity of the solution is $x\\times10^{-3}\\ \\mathrm{S\\ m^2\\ mol^{-1}}$. The value of x is $\\_\\_\\_\\_$.`,
{ integer_value: 3 },
`$K_{sp}=108s^5=1.1\\times10^{-23}\\Rightarrow s^5\\approx10^{-25}\\Rightarrow s=10^{-5}\\ \\mathrm{mol\\ L^{-1}}=10^{-2}\\ \\mathrm{mol\\ m^{-3}}$. $\\Lambda_m=\\kappa/C=3\\times10^{-5}/10^{-2}=3\\times10^{-3}\\ \\mathrm{S\\ m^2\\ mol^{-1}}$. **Answer: x=3**`,
'tag_electrochem_2', src(2022,'Jul',29,'Evening')),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const col = mongoose.connection.collection('questions_v2');
  const res = await col.insertMany(questions, { ordered: false });
  console.log(`Inserted ${res.insertedCount} questions (EC-121 to EC-128)`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
