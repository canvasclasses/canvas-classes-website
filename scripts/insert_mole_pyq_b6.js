#!/usr/bin/env node
// MOLE PYQ Batch 6: MOLE-366 to MOLE-380 (PYQ Q76–Q90)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });
const now = new Date();
function mkNVT(id,diff,md,ans,sol,tag,src){return{_id:uuidv4(),display_id:id,question_text:{markdown:md,latex_validated:true},type:'NVT',options:[],answer:ans,solution:{text_markdown:sol,latex_validated:true},metadata:{difficulty:diff,chapter_id:'ch11_mole',tags:[{tag_id:tag,weight:1.0}],exam_source:src,is_pyq:true,is_top_pyq:false},status:'review',version:1,quality_score:90,needs_review:false,created_by:'ai_agent',updated_by:'ai_agent',created_at:now,updated_at:now,deleted_at:null};}
function mkSCQ(id,diff,md,options,sol,tag,src){return{_id:uuidv4(),display_id:id,question_text:{markdown:md,latex_validated:true},type:'SCQ',options,solution:{text_markdown:sol,latex_validated:true},metadata:{difficulty:diff,chapter_id:'ch11_mole',tags:[{tag_id:tag,weight:1.0}],exam_source:src,is_pyq:true,is_top_pyq:false},status:'review',version:1,quality_score:90,needs_review:false,created_by:'ai_agent',updated_by:'ai_agent',created_at:now,updated_at:now,deleted_at:null};}
function opts(a,b,c,d,k){return[{id:'a',text:a,is_correct:k==='a'},{id:'b',text:b,is_correct:k==='b'},{id:'c',text:c,is_correct:k==='c'},{id:'d',text:d,is_correct:k==='d'}];}
function src(y,mo,d,sh){return{exam:'JEE Main',year:y,month:mo,day:d,shift:sh};}

const questions=[
  mkNVT('MOLE-366','Medium','If $5$ moles of $\\ce{BaCl2}$ is mixed with $2$ moles of $\\ce{Na3PO4}$, the maximum number of moles of $\\ce{Ba3(PO4)2}$ formed is ______ (Nearest integer)',{integer_value:1},'**Step 1:** $\\ce{3BaCl2 + 2Na3PO4 -> Ba3(PO4)2 + 6NaCl}$\n\n**Step 2:** For 2 mol $\\ce{Na3PO4}$, need 3 mol $\\ce{BaCl2}$. Available=5 mol → $\\ce{Na3PO4}$ limiting.\n\n**Step 3:** $n_{\\ce{Ba3(PO4)2}} = 2 \\times (1/2) = 1\\,\\text{mol}$\n\n**Answer: 1**','tag_mole_6',src(2023,'Apr',6,'Morning')),

  mkSCQ('MOLE-367','Hard','$25\\,\\text{mL}$ of $1\\,\\text{M}$ $\\ce{AgNO3}$ is added to $25\\,\\text{mL}$ of $1.05\\,\\text{M}$ KI solution. The ion(s) present in very small quantity in the solution is/are:',opts('$\\ce{I-}$ only','$\\ce{K+}$ only','$\\ce{NO3-}$ only','$\\ce{Ag+}$ and $\\ce{I-}$ both','d'),'**Step 1:** $n_{\\ce{Ag+}}=25\\,\\text{mmol}$; $n_{\\ce{I-}}=26.25\\,\\text{mmol}$\n\n**Step 2:** AgI precipitates (very low $K_{sp}$); excess $\\ce{I-}=1.25\\,\\text{mmol}$\n\n**Step 3:** Due to $K_{sp}$ equilibrium, both $\\ce{Ag+}$ and $\\ce{I-}$ coexist in solution in extremely small amounts.\n\n**Answer: Option (4)**','tag_mole_6',src(2023,'Apr',11,'Morning')),

  mkNVT('MOLE-368','Easy','The volume of hydrogen liberated at STP by treating $2.4\\,\\text{g}$ of Mg with excess HCl is ______ $\\times 10^{-2}\\,\\text{L}$. [Molar volume=22.4 L at STP; $M_{\\ce{Mg}}=24$]',{integer_value:224},'**Step 1:** $\\ce{Mg+2HCl->MgCl2+H2}$; $n_{\\ce{Mg}}=2.4/24=0.1\\,\\text{mol}$\n\n**Step 2:** $V=0.1\\times22.4=2.24\\,\\text{L}=224\\times10^{-2}\\,\\text{L}$\n\n**Answer: 224**','tag_mole_6',src(2023,'Apr',11,'Evening')),

  mkSCQ('MOLE-369','Hard','When hydrocarbon A undergoes complete combustion it requires $11$ equivalents of $\\ce{O2}$ and produces $4$ equivalents of water. Molecular formula of A is:',opts('$\\ce{C11H8}$','$\\ce{C11H4}$','$\\ce{C5H8}$','$\\ce{C9H8}$','d'),'**Step 1:** $y/2=4 \\Rightarrow y=8$; $x+y/4=11 \\Rightarrow x+2=11 \\Rightarrow x=9$\n\n**Formula: $\\ce{C9H8}$**\n\n**Answer: Option (4)**','tag_mole_5',src(2023,'Jan',31,'Evening')),

  mkNVT('MOLE-370','Medium','$5\\,\\text{g}$ of toluene is converted into benzaldehyde with $92\\%$ yield. The amount of benzaldehyde produced is ______ $\\times10^{-2}\\,\\text{g}$.',{integer_value:530},'**Step 1:** $n_{\\text{toluene}}=5/92=0.05435\\,\\text{mol}$; $M_r(\\text{benzaldehyde})=106$\n\n**Step 2:** Theoretical $=0.05435\\times106=5.761\\,\\text{g}$\n\n**Step 3:** Actual $=5.761\\times0.92=5.30\\,\\text{g}=530\\times10^{-2}\\,\\text{g}$\n\n**Answer: 530**','tag_mole_8',src(2022,'Jul',27,'Evening')),

  mkNVT('MOLE-371','Medium','In $\\ce{X+Y+3Z->XYZ3}$, 1 mol X, 1 mol Y, $0.05\\,\\text{mol}$ Z are used. (Atomic masses X=10, Y=20, Z=30). Yield of $\\ce{XYZ3}$ is ______ g.',{integer_value:2},'**Step 1:** Z is limiting; $n_{\\ce{XYZ3}}=0.05/3\\,\\text{mol}$\n\n**Step 2:** $M_r(\\ce{XYZ3})=10+20+90=120$\n\n**Step 3:** $m=(0.05/3)\\times120=2\\,\\text{g}$\n\n**Answer: 2**','tag_mole_6',src(2022,'Jul',28,'Morning')),

  mkSCQ('MOLE-372','Hard','If a rocket runs on fuel $\\ce{C15H30}$ and liquid oxygen, the weight of $\\ce{O2}$ required and $\\ce{CO2}$ released for every litre of fuel are: (density $=0.756\\,\\text{g/mL}$)',opts('$1188\\,\\text{g}$ and $1296\\,\\text{g}$','$2376\\,\\text{g}$ and $2592\\,\\text{g}$','$2592\\,\\text{g}$ and $2376\\,\\text{g}$','$3429\\,\\text{g}$ and $3142\\,\\text{g}$','c'),'**Step 1:** $\\ce{C15H30+\\frac{45}{2}O2->15CO2+15H2O}$\n\n**Step 2:** $n=756/210=3.6\\,\\text{mol}$; $n_{\\ce{O2}}=3.6\\times22.5=81\\,\\text{mol}$; $m_{\\ce{O2}}=2592\\,\\text{g}$\n\n**Step 3:** $n_{\\ce{CO2}}=54\\,\\text{mol}$; $m_{\\ce{CO2}}=2376\\,\\text{g}$\n\n**Answer: Option (3)**','tag_mole_6',src(2022,'Jun',24,'Morning')),

  mkSCQ('MOLE-373','Easy','$120\\,\\text{g}$ of an organic compound (only C and H) gives $330\\,\\text{g}$ $\\ce{CO2}$ and $270\\,\\text{g}$ $\\ce{H2O}$ on combustion. % of C and H respectively are:',opts('$25$ and $75$','$40$ and $60$','$60$ and $40$','$75$ and $25$','d'),'**Step 1:** $m_C=(330/44)\\times12=90\\,\\text{g}$; $m_H=(270/18)\\times2=30\\,\\text{g}$\n\n**Step 2:** $\\%C=75\\%$; $\\%H=25\\%$\n\n**Answer: Option (4)**','tag_mole_5',src(2022,'Jun',24,'Evening')),

  mkNVT('MOLE-374','Medium','$1\\,\\text{L}$ $\\ce{H2SO4}$ solution contains $0.02\\,\\text{mmol}$. $50\\%$ diluted to 1 L (solution A); then $0.01\\,\\text{mmol}$ added. Total mmols of $\\ce{H2SO4}$ in final solution is ______ $\\times10^{-3}\\,\\text{mmoles}$.',{integer_value:20},'**Step 1:** Take 50%: $0.01\\,\\text{mmol}$ in solution A\n\n**Step 2:** Add $0.01\\,\\text{mmol}$: total $=0.02\\,\\text{mmol}=20\\times10^{-3}\\,\\text{mmol}$\n\n**Answer: 20**','tag_mole_2',src(2022,'Jun',25,'Morning')),

  mkNVT('MOLE-375','Easy','On complete combustion $0.30\\,\\text{g}$ of an organic compound gave $0.20\\,\\text{g}$ $\\ce{CO2}$ and $0.10\\,\\text{g}$ $\\ce{H2O}$. The % of carbon is ______ (Nearest Integer)',{integer_value:18},'**Step 1:** $m_C=(0.20/44)\\times12=0.05455\\,\\text{g}$\n\n**Step 2:** $\\%C=(0.05455/0.30)\\times100=18.2\\approx18$\n\n**Answer: 18**','tag_mole_5',src(2022,'Jun',26,'Morning')),

  mkNVT('MOLE-376','Medium','$100\\,\\text{g}$ CNG (methane) mixed with $208\\,\\text{g}$ $\\ce{O2}$. Amount of $\\ce{CO2}$ produced in grams is ______ [nearest integer]',{integer_value:143},'**Step 1:** $n_{\\ce{CH4}}=100/16=6.25\\,\\text{mol}$; $n_{\\ce{O2}}=208/32=6.5\\,\\text{mol}$\n\n**Step 2:** Need $12.5\\,\\text{mol}$ $\\ce{O2}$ for 6.25 mol $\\ce{CH4}$; $\\ce{O2}$ is limiting.\n\n**Step 3:** $n_{\\ce{CO2}}=6.5/2=3.25\\,\\text{mol}$; $m=3.25\\times44=143\\,\\text{g}$\n\n**Answer: 143**','tag_mole_6',src(2022,'Jun',26,'Evening')),

  mkNVT('MOLE-377','Hard','$116\\,\\text{g}$ of a substance yields $7.5\\,\\text{g}$ H, $60\\,\\text{g}$ O, $48.5\\,\\text{g}$ C. (H=1, O=16, C=12). The data agrees with how many of the following?\nA. $\\ce{CH3COOH}$ B. $\\ce{HCHO}$ C. $\\ce{CH3OOCH3}$ D. $\\ce{CH3CHO}$',{integer_value:2},'**Step 1:** Ratios: $C:H:O=48.5/12:7.5:60/16=4.04:7.5:3.75$; divide by 3.75 → $1.08:2:1\\approx1:2:1$\n\n**Step 2:** Empirical formula $\\ce{CH2O}$\n\n**Step 3:** A ($\\ce{C2H4O2}$, ratio 1:2:1 ✓), B ($\\ce{CH2O}$, ratio 1:2:1 ✓), C ($\\ce{C2H6O2}$, 1:3:1 ✗), D ($\\ce{C2H4O}$, 2:4:1 ✗)\n\n**Answer: 2**','tag_mole_3',src(2022,'Jun',27,'Evening')),

  mkSCQ('MOLE-378','Medium','Compound A: $8.7\\%$ H, $74\\%$ C, $17.3\\%$ N; molar mass $=162\\,\\text{g/mol}$. Molecular formula is: (C=12, H=1, N=14)',opts('$\\ce{C4H6N2}$','$\\ce{C2H3N}$','$\\ce{C5H7N}$','$\\ce{C10H14N2}$','d'),'**Step 1:** Ratios: $C:H:N=74/12:8.7:17.3/14=6.17:8.7:1.236$; divide by 1.236 → $5:7:1$\n\n**Step 2:** Empirical $\\ce{C5H7N}$, $M_r=81$; $n=162/81=2$\n\n**Molecular formula: $\\ce{C10H14N2}$**\n\n**Answer: Option (4)**','tag_mole_3',src(2022,'Jun',28,'Evening')),

  mkNVT('MOLE-379','Hard','Complete combustion of $0.492\\,\\text{g}$ of organic compound (C, H, O) gives $0.793\\,\\text{g}$ $\\ce{CO2}$ and $0.442\\,\\text{g}$ $\\ce{H2O}$. % oxygen in compound is ______ (nearest integer)',{integer_value:46},'**Step 1:** $m_C=(0.793/44)\\times12=0.2163\\,\\text{g}$\n\n**Step 2:** $m_H=(0.442/18)\\times2=0.04911\\,\\text{g}$\n\n**Step 3:** $m_O=0.492-0.2163-0.04911=0.2266\\,\\text{g}$\n\n**Step 4:** $\\%O=(0.2266/0.492)\\times100=46.1\\approx46$\n\n**Answer: 46**','tag_mole_5',src(2022,'Jun',28,'Evening')),

  // Q90 SCQ 29 Jun 2022 (M) Ans:3=c (3360 g)
  mkSCQ('MOLE-380','Medium','Production of Fe in blast furnace: $\\ce{Fe3O4(s)+4CO(g)->3Fe(l)+4CO2(g)}$. When $4.640\\,\\text{kg}$ of $\\ce{Fe3O4}$ and $2.520\\,\\text{kg}$ of CO are allowed to react, the amount of iron (in g) produced is: ($M_{\\ce{Fe}}=56$, $M_O=16$, $M_C=12$)',opts('$1400$','$2200$','$3360$','$4200$','c'),'**Step 1:** $n_{\\ce{Fe3O4}}=4640/232=20\\,\\text{mol}$; $n_{\\ce{CO}}=2520/28=90\\,\\text{mol}$\n\n**Step 2:** Need $4\\times20=80\\,\\text{mol}$ CO; available=90 → $\\ce{Fe3O4}$ limiting\n\n**Step 3:** $n_{\\ce{Fe}}=3\\times20=60\\,\\text{mol}$; $m=60\\times56=3360\\,\\text{g}$\n\n**Answer: Option (3)**','tag_mole_6',src(2022,'Jun',29,'Morning')),
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
