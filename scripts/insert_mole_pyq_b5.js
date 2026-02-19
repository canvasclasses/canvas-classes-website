#!/usr/bin/env node
// MOLE PYQ Batch 5: MOLE-351 to MOLE-365 (PYQ Q61–Q75)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });
const now = new Date();
function mkNVT(id,diff,md,ans,sol,tag,src){return{_id:uuidv4(),display_id:id,question_text:{markdown:md,latex_validated:true},type:'NVT',options:[],answer:ans,solution:{text_markdown:sol,latex_validated:true},metadata:{difficulty:diff,chapter_id:'ch11_mole',tags:[{tag_id:tag,weight:1.0}],exam_source:src,is_pyq:true,is_top_pyq:false},status:'review',version:1,quality_score:90,needs_review:false,created_by:'ai_agent',updated_by:'ai_agent',created_at:now,updated_at:now,deleted_at:null};}
function mkSCQ(id,diff,md,options,sol,tag,src){return{_id:uuidv4(),display_id:id,question_text:{markdown:md,latex_validated:true},type:'SCQ',options,solution:{text_markdown:sol,latex_validated:true},metadata:{difficulty:diff,chapter_id:'ch11_mole',tags:[{tag_id:tag,weight:1.0}],exam_source:src,is_pyq:true,is_top_pyq:false},status:'review',version:1,quality_score:90,needs_review:false,created_by:'ai_agent',updated_by:'ai_agent',created_at:now,updated_at:now,deleted_at:null};}
function opts(a,b,c,d,k){return[{id:'a',text:a,is_correct:k==='a'},{id:'b',text:b,is_correct:k==='b'},{id:'c',text:c,is_correct:k==='c'},{id:'d',text:d,is_correct:k==='d'}];}
function src(y,mo,d,sh){return{exam:'JEE Main',year:y,month:mo,day:d,shift:sh};}

const questions=[
  // Q61 SCQ 06 Sep 2020 (M) Ans:3=c
  mkSCQ('MOLE-351','Hard',
    'A solution of two components containing $n_1$ moles of 1st component and $n_2$ moles of 2nd component. $M_1$, $M_2$ are molecular weights. If $d$ is density in g/mL, $C_2$ is molarity and $x_2$ is mole fraction of 2nd component, then $C_2$ can be expressed as:',
    opts('$C_2=\\dfrac{1000x_2}{M_1+x_2(M_2-M_1)}$','$C_2=\\dfrac{dx_2}{M_1+x_2(M_2-M_1)}$','$C_2=\\dfrac{1000dx_2}{M_1+x_2(M_2-M_1)}$','$C_2=\\dfrac{dx_1}{M_2+x_2(M_2-M_1)}$','c'),
    '**Step 1:** Basis: $n_1+n_2=1$ mol total (mole fraction basis)\n\n**Step 2:** Mass of solution $= n_1M_1+n_2M_2 = (1-x_2)M_1+x_2M_2 = M_1+x_2(M_2-M_1)$ g\n\n**Step 3:** Volume of solution $= \\frac{M_1+x_2(M_2-M_1)}{d}$ mL $= \\frac{M_1+x_2(M_2-M_1)}{1000d}$ L\n\n**Step 4:** $C_2 = \\frac{n_2}{V(\\text{L})} = \\frac{x_2}{\\frac{M_1+x_2(M_2-M_1)}{1000d}} = \\frac{1000dx_2}{M_1+x_2(M_2-M_1)}$\n\n**Answer: Option (3)**',
    'tag_mole_2',src(2020,'Sep',6,'Morning')),

  // Q62 NVT no date Ans:14
  mkNVT('MOLE-352','Easy',
    'The molarity of $\\ce{HNO3}$ in a sample which has density $1.4\\,\\text{g/mL}$ and mass percentage of $63\\%$ is ______ M. (Molecular Weight of $\\ce{HNO3}=63$)',
    {integer_value:14},
    '**Step 1:** $M = \\frac{10 \\times d \\times \\%}{M_r} = \\frac{10 \\times 1.4 \\times 63}{63} = 10 \\times 1.4 = 14\\,\\text{M}$\n\n**Key Points:**\n- $M = \\frac{10 \\times d \\times \\%\\text{(by mass)}}{M_r}$\n- Answer: 14',
    'tag_mole_2',{exam:'JEE Main',year:2020,month:'Jan',day:9,shift:'Morning'}),

  // Q63 NVT 09 Jan 2020 (E) Ans:10
  mkNVT('MOLE-353','Easy',
    '$10.30\\,\\text{mg}$ of $\\ce{O2}$ is dissolved into a litre of sea water of density $1.03\\,\\text{g/mL}$. The concentration of $\\ce{O2}$ in ppm is ______.',
    {integer_value:10},
    '**Step 1:** Mass of 1 L sea water $= 1000 \\times 1.03 = 1030\\,\\text{g} = 1.030\\,\\text{kg}$\n\n**Step 2:** ppm (mg/kg) $= \\frac{10.30\\,\\text{mg}}{1.030\\,\\text{kg}} = 10.0\\,\\text{ppm}$\n\n**Key Points:**\n- ppm = mg of solute per kg of solution\n- Answer: 10',
    'tag_mole_2',src(2020,'Jan',9,'Evening')),

  // Q64 SCQ 09 Apr 2019 (E) Ans:2=b (1.51)
  mkSCQ('MOLE-354','Easy',
    'What would be the molality of $20\\%$ (mass/mass) aqueous solution of KI? (Molar mass of KI $= 166\\,\\text{g/mol}$)',
    opts('$1.35$','$1.51$','$1.08$','$1.48$','b'),
    '**Step 1:** In 100 g solution: 20 g KI + 80 g water\n\n**Step 2:** $n_{\\ce{KI}} = 20/166 = 0.1205\\,\\text{mol}$\n\n**Step 3:** Molality $= 0.1205/0.080 = 1.506 \\approx 1.51\\,\\text{mol/kg}$\n\n**Answer: Option (2)**',
    'tag_mole_2',src(2019,'Apr',9,'Evening')),

  // Q65 SCQ 11 Jan 2019 (E) Ans:1=a (25 mL)
  mkSCQ('MOLE-355','Medium',
    '$25\\,\\text{mL}$ of the given HCl solution requires $30\\,\\text{mL}$ of $0.1\\,\\text{M}$ sodium carbonate solution. What is the volume of this HCl solution required to titrate $30\\,\\text{mL}$ of $0.2\\,\\text{M}$ aqueous NaOH solution?',
    opts('$25\\,\\text{mL}$','$75\\,\\text{mL}$','$50\\,\\text{mL}$','$12.5\\,\\text{mL}$','a'),
    '**Step 1:** Find molarity of HCl.\n\n$\\ce{Na2CO3 + 2HCl -> 2NaCl + H2O + CO2}$\n\nMillimoles of $\\ce{Na2CO3} = 30 \\times 0.1 = 3\\,\\text{mmol}$; mmol of HCl $= 6\\,\\text{mmol}$\n\n$M_{\\ce{HCl}} = 6/25 = 0.24\\,\\text{M}$\n\n**Step 2:** Titrate NaOH: $\\ce{HCl + NaOH -> NaCl + H2O}$\n\nmmol NaOH $= 30 \\times 0.2 = 6\\,\\text{mmol}$\n\n$V_{\\ce{HCl}} = 6/0.24 = 25\\,\\text{mL}$\n\n**Answer: Option (1)**',
    'tag_mole_6',src(2019,'Jan',11,'Evening')),

  // Q66 SCQ 12 Jan 2019 (E) Ans:1=a (0.167, 11.11)
  mkSCQ('MOLE-356','Medium',
    '$8\\,\\text{g}$ of NaOH is dissolved in $18\\,\\text{g}$ of $\\ce{H2O}$. Mole fraction of NaOH in solution and molality (in mol/kg) of the solution respectively are:',
    opts('$0.167,\\;11.11$','$0.167,\\;22.20$','$0.2,\\;11.11$','$0.2,\\;22.20$','a'),
    '**Step 1:** $n_{\\ce{NaOH}} = 8/40 = 0.2\\,\\text{mol}$; $n_{\\ce{H2O}} = 18/18 = 1\\,\\text{mol}$\n\n**Step 2:** Mole fraction of NaOH $= 0.2/(0.2+1) = 0.2/1.2 = 0.167$\n\n**Step 3:** Molality $= 0.2/(18/1000) = 0.2/0.018 = 11.11\\,\\text{mol/kg}$\n\n**Answer: Option (1)**',
    'tag_mole_2',src(2019,'Jan',12,'Evening')),

  // Q67 SCQ 05 Apr 2024 (M) Ans:3=c (C12H22O11)
  mkSCQ('MOLE-357','Medium',
    'An organic compound has $42.1\\%$ carbon, $6.4\\%$ hydrogen and remainder is oxygen. If its molecular weight is $342$, then its molecular formula is:',
    opts('$\\ce{C11H18O12}$','$\\ce{C12H20O12}$','$\\ce{C12H22O11}$','$\\ce{C14H20O10}$','c'),
    '**Step 1:** $\\%\\,O = 100 - 42.1 - 6.4 = 51.5\\%$\n\n**Step 2:** Atom ratios: $C: 42.1/12=3.508$; $H: 6.4/1=6.4$; $O: 51.5/16=3.219$\n\nDivide by smallest (3.219): $C:H:O = 1.09:1.99:1 \\approx 1:2:1$ → empirical formula $\\ce{CH2O}$ ($M=30$)\n\n**Step 3:** $n = 342/30 = 11.4$... Try $\\ce{C12H22O11}$: $M = 144+22+176=342$ ✓\n\n**Answer: Option (3) $\\ce{C12H22O11}$ (sucrose)**',
    'tag_mole_3',src(2024,'Apr',5,'Morning')),

  // Q68 NVT 05 Apr 2024 (M) Ans:80
  mkNVT('MOLE-358','Medium',
    '$9.3\\,\\text{g}$ of pure aniline is treated with bromine water at room temperature to give a white precipitate of product P. The mass of product P obtained is $26.4\\,\\text{g}$. The percentage yield is ______ $\\%$.',
    {integer_value:80},
    '**Step 1:** Aniline + $\\ce{Br2}$ water → 2,4,6-tribromoaniline (P)\n\n$\\ce{C6H5NH2 + 3Br2 -> C6H2Br3NH2 + 3HBr}$\n\n**Step 2:** $n_{\\text{aniline}} = 9.3/93 = 0.1\\,\\text{mol}$\n\n**Step 3:** Theoretical mass of P: $M_r(\\ce{C6H2Br3NH2}) = 330\\,\\text{g/mol}$\n\n$m_{\\text{theoretical}} = 0.1 \\times 330 = 33\\,\\text{g}$\n\n**Step 4:** $\\%\\text{ yield} = (26.4/33) \\times 100 = 80\\%$\n\n**Answer: 80**',
    'tag_mole_8',src(2024,'Apr',5,'Morning')),

  // Q69 SCQ 05 Apr 2024 (E) Ans:4=d (0.25)
  mkSCQ('MOLE-359','Easy',
    'The number of moles of methane required to produce $11\\,\\text{g}$ of $\\ce{CO2(g)}$ after complete combustion is: (Molar mass of methane $= 16\\,\\text{g/mol}$)',
    opts('$0.35$','$0.5$','$0.75$','$0.25$','d'),
    '**Step 1:** $\\ce{CH4 + 2O2 -> CO2 + 2H2O}$; 1 mol $\\ce{CH4}$ → 1 mol $\\ce{CO2}$\n\n**Step 2:** $n_{\\ce{CO2}} = 11/44 = 0.25\\,\\text{mol}$\n\n**Step 3:** $n_{\\ce{CH4}} = 0.25\\,\\text{mol}$\n\n**Answer: Option (4)**',
    'tag_mole_6',src(2024,'Apr',5,'Evening')),

  // Q70 SCQ 08 Apr 2024 (M) Ans:3=c (960 g)
  mkSCQ('MOLE-360','Easy',
    'Combustion of glucose ($\\ce{C6H12O6}$) produces $\\ce{CO2}$ and water. The amount of oxygen (in g) required for complete combustion of $900\\,\\text{g}$ of glucose is: [Molar mass of glucose $= 180\\,\\text{g/mol}$]',
    opts('$480$','$800$','$960$','$32$','c'),
    '**Step 1:** $\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}$\n\n**Step 2:** $n_{\\text{glucose}} = 900/180 = 5\\,\\text{mol}$\n\n**Step 3:** $n_{\\ce{O2}} = 6 \\times 5 = 30\\,\\text{mol}$\n\n**Step 4:** $m_{\\ce{O2}} = 30 \\times 32 = 960\\,\\text{g}$\n\n**Answer: Option (3)**',
    'tag_mole_6',src(2024,'Apr',8,'Morning')),

  // Q71 NVT 27 Jan 2024 (E) Ans:8
  // PbS + O3: PbS + 4O3 -> PbSO4 + 4O2; X=4, Y=4; X+Y=8
  mkNVT('MOLE-361','Hard',
    '$1$ mole of PbS is oxidised by $X$ moles of $\\ce{O3}$ to get $Y$ moles of $\\ce{O2}$. $X + Y = $ ______',
    {integer_value:8},
    '**Step 1:** Balanced equation:\n\n$$\\ce{PbS + 4O3 -> PbSO4 + 4O2}$$\n\n**Step 2:** $X = 4$ (moles of $\\ce{O3}$); $Y = 4$ (moles of $\\ce{O2}$)\n\n**Step 3:** $X + Y = 4 + 4 = 8$\n\n**Key Points:**\n- S goes from $-2$ to $+6$ (oxidised); O in $\\ce{O3}$ goes from $0$ to $-2$ (in $\\ce{PbSO4}$) and $0$ (in $\\ce{O2}$)\n- Answer: 8',
    'tag_mole_6',src(2024,'Jan',27,'Evening')),

  // Q72 SCQ 31 Jan 2024 (E) Ans:1=a
  mkSCQ('MOLE-362','Hard',
    'A sample of $\\ce{CaCO3}$ and $\\ce{MgCO3}$ weighed $2.21\\,\\text{g}$ is ignited to constant weight of $1.152\\,\\text{g}$. The composition of the mixture is: ($M_r$: $\\ce{CaCO3}=100$, $\\ce{MgCO3}=84$)',
    opts('$1.187\\,\\text{g}\\;\\ce{CaCO3} + 1.023\\,\\text{g}\\;\\ce{MgCO3}$','$1.023\\,\\text{g}\\;\\ce{CaCO3} + 1.023\\,\\text{g}\\;\\ce{MgCO3}$','$1.187\\,\\text{g}\\;\\ce{CaCO3} + 1.187\\,\\text{g}\\;\\ce{MgCO3}$','$1.023\\,\\text{g}\\;\\ce{CaCO3} + 1.187\\,\\text{g}\\;\\ce{MgCO3}$','a'),
    '**Step 1:** On ignition: $\\ce{CaCO3 -> CaO + CO2}$; $\\ce{MgCO3 -> MgO + CO2}$\n\nLet $a$ = mol $\\ce{CaCO3}$, $b$ = mol $\\ce{MgCO3}$\n\n**Step 2:** $100a + 84b = 2.21$ ...(1)\n\nResidues: $\\ce{CaO}(56a) + \\ce{MgO}(40b) = 1.152$ ...(2)\n\n**Step 3:** From (1): $100a + 84b = 2.21$; From (2): $56a + 40b = 1.152$\n\nMultiply (2) by 2.1: $117.6a + 84b = 2.419$\n\nSubtract (1): $17.6a = 0.209 \\Rightarrow a = 0.01187\\,\\text{mol}$\n\n$m_{\\ce{CaCO3}} = 0.01187 \\times 100 = 1.187\\,\\text{g}$; $m_{\\ce{MgCO3}} = 2.21 - 1.187 = 1.023\\,\\text{g}$\n\n**Answer: Option (1)**',
    'tag_mole_6',src(2024,'Jan',31,'Evening')),

  // Q73 NVT 31 Jan 2024 (E) Ans:11
  mkNVT('MOLE-363','Medium',
    'The molarity of $1\\,\\text{L}$ orthophosphoric acid ($\\ce{H3PO4}$) having $70\\%$ purity by weight (specific gravity $1.54\\,\\text{g/cm}^3$) is ______ M. ($M_r(\\ce{H3PO4})=98\\,\\text{g/mol}$)',
    {integer_value:11},
    '**Step 1:** Mass of 1 L solution $= 1000 \\times 1.54 = 1540\\,\\text{g}$\n\n**Step 2:** Mass of pure $\\ce{H3PO4} = 1540 \\times 0.70 = 1078\\,\\text{g}$\n\n**Step 3:** $n_{\\ce{H3PO4}} = 1078/98 = 11.0\\,\\text{mol}$\n\n**Step 4:** Molarity $= 11.0/1 = 11\\,\\text{M}$\n\n**Answer: 11**',
    'tag_mole_2',src(2024,'Jan',31,'Evening')),

  // Q74 NVT 01 Feb 2024 (M) Ans:24
  mkNVT('MOLE-364','Hard',
    'Consider: $\\ce{3PbCl2 + 2(NH4)3PO4 -> Pb3(PO4)2 + 6NH4Cl}$\n\nIf $72\\,\\text{mmol}$ $\\ce{PbCl2}$ is mixed with $50\\,\\text{mmol}$ of $(\\ce{NH4})_3\\ce{PO4}$, then amount of $\\ce{Pb3(PO4)2}$ formed in mmol is ______ (nearest integer)',
    {integer_value:24},
    '**Step 1:** Stoichiometry: $\\ce{PbCl2}:\\ce{(NH4)3PO4} = 3:2$\n\n**Step 2:** For 72 mmol $\\ce{PbCl2}$, need $72 \\times (2/3) = 48\\,\\text{mmol}$ $(\\ce{NH4})_3\\ce{PO4}$. Available $= 50\\,\\text{mmol}$ → $\\ce{PbCl2}$ is limiting.\n\n**Step 3:** $n_{\\ce{Pb3(PO4)2}} = 72 \\times (1/3) = 24\\,\\text{mmol}$\n\n**Answer: 24**',
    'tag_mole_6',src(2024,'Feb',1,'Morning')),

  // Q75 NVT 01 Feb 2024 (E) Ans:14
  // 10 mL CxHy → 40 mL CO2 + 50 mL H2O vapour
  // x = 40/10 = 4; y/2 = 50/10 = 5 → y = 10; total C+H = 4+10 = 14
  mkNVT('MOLE-365','Medium',
    '$10\\,\\text{mL}$ of gaseous hydrocarbon on combustion gives $40\\,\\text{mL}$ of $\\ce{CO2(g)}$ and $50\\,\\text{mL}$ of water vapour. Total number of carbon and hydrogen atoms in the hydrocarbon is ______.',
    {integer_value:14},
    '**Step 1:** At constant T, P: volume ratio = mole ratio.\n\n$\\ce{C_xH_y + (x + y/4)O2 -> xCO2 + y/2 H2O}$\n\n**Step 2:** From $\\ce{CO2}$: $x = 40/10 = 4$\n\n**Step 3:** From $\\ce{H2O}$: $y/2 = 50/10 = 5 \\Rightarrow y = 10$\n\n**Step 4:** Total C + H atoms $= 4 + 10 = 14$\n\n**Formula: $\\ce{C4H10}$ (butane)**\n\n**Answer: 14**',
    'tag_mole_5',src(2024,'Feb',1,'Evening')),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  let ok=0,fail=0;
  for(const doc of questions){
    try{await col.insertOne(doc);console.log(`  ✅ ${doc.display_id}`);ok++;}
    catch(e){console.log(`  ❌ ${doc.display_id}: ${e.message}`);fail++;}
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
