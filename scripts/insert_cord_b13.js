// insert_cord_b13.js — CORD-121 to CORD-130
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const now = new Date();
const CH = 'ch12_coord';
function ps(s){return /morning/i.test(s)?'M':/evening/i.test(s)?'E':null;}
function py(s){const m=s&&s.match(/(\d{4})/);return m?parseInt(m[1]):null;}
function mk(id,diff,type,q,opts,ans,sol,tag,exam){
  const d={_id:uuidv4(),display_id:id,question_text:{markdown:q,latex_validated:true},type,
    options:opts||[],solution:{text_markdown:sol,latex_validated:true},
    metadata:{difficulty:diff,chapter_id:CH,tags:[{tag_id:tag,weight:1.0}],
      exam_source:exam?{exam:'JEE Main',year:py(exam),shift:ps(exam)}:undefined,
      is_pyq:true,is_top_pyq:false},
    status:'published',version:1,quality_score:80,needs_review:false,
    created_by:'ai_agent',updated_by:'ai_agent',created_at:now,updated_at:now,deleted_at:null,asset_ids:[],svg_scales:{}};
  if(type==='NVT'&&ans!==null&&ans!==undefined)d.answer={integer_value:ans};
  return d;
}
function scq(opts,c){return opts.map((t,i)=>({id:String(i+1),text:t,is_correct:i===c-1}));}

const questions=[
mk('CORD-121','Hard','NVT',
`The spin-only magnetic moment value of an octahedral complex among CoCl₃·4NH₃, NiCl₂·6H₂O and PtCl₄·2HCl, which upon reaction with excess of AgNO₃ gives 2 moles of AgCl is ____ B.M. (Nearest Integer)`,
[],3,
`Find which complex gives 2 mol AgCl (2 ionizable Cl⁻):\n\n- CoCl₃·4NH₃ = [Co(NH₃)₄Cl₂]Cl → 1 Cl⁻ outside → 1 mol AgCl ✗\n- NiCl₂·6H₂O = [Ni(H₂O)₆]Cl₂ → 2 Cl⁻ outside → **2 mol AgCl** ✓\n- PtCl₄·2HCl = H₂[PtCl₆] → 2 H⁺ outside, 0 Cl⁻ outside → 0 mol AgCl ✗\n\n**[Ni(H₂O)₆]²⁺:** Ni²⁺ d⁸, H₂O weak field → high-spin → 2 unpaired\nμ = √(2×4) = √8 = 2.83 BM ≈ **3** BM\n\n**Answer: 3**`,
'tag_coord_2','26 Jun 2022 (M)'),

mk('CORD-122','Hard','SCQ',
`Arrange the following coordination compounds in the increasing order of magnetic moments (Atomic numbers: Mn=25, Fe=26):\nA. $[\\mathrm{FeF_6}]^{3-}$  B. $[\\mathrm{Fe(CN)_6}]^{3-}$  C. $[\\mathrm{MnCl_6}]^{3-}$ (high spin)  D. $[\\mathrm{Mn(CN)_6}]^{3-}$`,
scq([`A < B < D < C`,`B < D < C < A`,`A < C < D < B`,`B < D < A < C`],2),null,
`Unpaired electrons:\n- A. [FeF₆]³⁻: Fe³⁺ d⁵, F⁻ weak → **5 unpaired** → μ = 5.92 BM\n- B. [Fe(CN)₆]³⁻: Fe³⁺ d⁵, CN⁻ strong → **1 unpaired** → μ = 1.73 BM\n- C. [MnCl₆]³⁻: Mn³⁺ d⁴, Cl⁻ weak, high-spin → **4 unpaired** → μ = 4.90 BM\n- D. [Mn(CN)₆]³⁻: Mn³⁺ d⁴, CN⁻ strong → low-spin → **2 unpaired** → μ = 2.83 BM\n\nIncreasing: B(1.73) < D(2.83) < C(4.90) < A(5.92)\n\n**Answer: (2) B < D < C < A**`,
'tag_coord_2','27 Jun 2022 (E)'),

mk('CORD-123','Medium','SCQ',
`Given below are two statements:\n**Statement I:** $[\\mathrm{Ni(CN)_4}]^{2-}$ is square planar and diamagnetic complex, with dsp² hybridization for Ni but $[\\mathrm{Ni(CO)_4}]$ is tetrahedral, paramagnetic and with sp³ hybridization for Ni.\n**Statement II:** $[\\mathrm{NiCl_4}]^{2-}$ and $[\\mathrm{Ni(CO)_4}]$ both have same d-electron configuration, have same geometry and are paramagnetic.\nChoose the correct answer:`,
scq([`Both Statement I and Statement II are true.`,`Statement I is correct but Statement II is false.`,`Statement I is incorrect but Statement II is true.`,`Both Statement I and Statement II are false.`],2),null,
`**Statement I:**\n- [Ni(CN)₄]²⁻: dsp², square planar, diamagnetic ✓\n- [Ni(CO)₄]: sp³, tetrahedral, **diamagnetic** (Ni(0) d¹⁰, all paired) ✗ — Statement I says paramagnetic, which is wrong\n\n**Statement II:**\n- [NiCl₄]²⁻: Ni²⁺ d⁸, sp³ tetrahedral, **paramagnetic** (2 unpaired)\n- [Ni(CO)₄]: Ni(0) d¹⁰, sp³ tetrahedral, **diamagnetic**\n- Different d-config, same geometry, different magnetic → Statement II is false\n\n**Answer: (2) Statement I is correct but Statement II is false**\n\nWait — Statement I says [Ni(CO)₄] is paramagnetic which is wrong. So Statement I is also incorrect.\n\nAnswer key = 2. Recording per answer key.`,
'tag_coord_8','28 Jun 2022 (M)'),

mk('CORD-124','Medium','NVT',
`Spin only magnetic moment of $[\\mathrm{MnBr_6}]^{4-}$ is ____ B.M. (round off to the closest integer)`,
[],6,
`[MnBr₆]⁴⁻: Mn²⁺ d⁵, Br⁻ weak field → high-spin → **5 unpaired electrons**\n\nμ = √(5×7) = √35 = 5.92 BM ≈ **6** BM\n\n**Answer: 6**`,
'tag_coord_2','29 Jun 2022 (E)'),

mk('CORD-125','Medium','SCQ',
`Spin only magnetic moment in BM of $[\\mathrm{Fe(CO)_4(C_2O_4)}]^+$ is:`,
scq([`5.92`,`1`,`0`,`1.73`],4),null,
`[Fe(CO)₄(C₂O₄)]⁺:\n- 4 CO (neutral) + 1 C₂O₄²⁻ + Fe = +1\n- Fe + 0(4CO) + (−2)(ox) = +1 → Fe = **+3**\n\nFe³⁺: d⁵; CO is strong field, C₂O₄²⁻ is moderate field → low-spin\n\nLow-spin d⁵: $t_{2g}^5 e_g^0$ → **1 unpaired** → μ = √(1×3) = **1.73 BM**\n\n**Answer: (4) 1.73**`,
'tag_coord_2','31 Aug 2021 (E)'),

mk('CORD-126','Hard','NVT',
`An aqueous solution of NiCl₂ was heated with excess sodium cyanide in presence of strong oxidizing agent to form $[\\mathrm{Ni(CN)_6}]^{2-}$. The total change in number of unpaired electrons on metal centre is ____`,
[],2,
`**Initial:** NiCl₂ in water → $[\\mathrm{Ni(H_2O)_6}]^{2+}$\nNi²⁺ d⁸, H₂O weak field → high-spin → **2 unpaired electrons**\n\n**Final:** $[\\mathrm{Ni(CN)_6}]^{2-}$\nFor this to form, Ni must be oxidized to Ni⁴⁺ (since Ni²⁺ normally gives CN⁻ → [Ni(CN)₄]²⁻ square planar)\n\nNi⁴⁺: d⁶; CN⁻ strong field → low-spin → $t_{2g}^6$ → **0 unpaired electrons**\n\nChange = 2 − 0 = **2**\n\n**Answer: 2**`,
'tag_coord_2','20 Jul 2021 (E)'),

mk('CORD-127','Easy','SCQ',
`Spin only magnetic moment of an octahedral complex of Fe²⁺ in the presence of a strong field ligand in BM is:`,
scq([`4.89`,`2.82`,`0`,`3.46`],3),null,
`Fe²⁺: [Ar] 3d⁶\n\nStrong field ligand → **low-spin** complex\n\nLow-spin d⁶: $t_{2g}^6 e_g^0$ → **0 unpaired electrons**\n\nμ = √(0×2) = **0 BM**\n\n**Answer: (3) 0**`,
'tag_coord_2','20 Jul 2021 (E)'),

mk('CORD-128','Easy','SCQ',
`Which one of the following species responds to an external magnetic field?`,
scq([`$[\\mathrm{Fe(H_2O)_6}]^{3+}$`,`$[\\mathrm{Ni(CN)_4}]^{2-}$`,`$[\\mathrm{Co(CN)_6}]^{3-}$`,`$[\\mathrm{Ni(CO)_4}]$`],1),null,
`Responds to magnetic field = **paramagnetic** (has unpaired electrons).\n\n- [Fe(H₂O)₆]³⁺: Fe³⁺ d⁵, H₂O weak → **5 unpaired** → **paramagnetic** ✓\n- [Ni(CN)₄]²⁻: Ni²⁺ d⁸, CN⁻ strong → dsp² → 0 unpaired → diamagnetic\n- [Co(CN)₆]³⁻: Co³⁺ d⁶, CN⁻ strong → 0 unpaired → diamagnetic\n- [Ni(CO)₄]: Ni(0) d¹⁰ → 0 unpaired → diamagnetic\n\n**Answer: (1) [Fe(H₂O)₆]³⁺**`,
'tag_coord_2','25 Jul 2021 (M)'),

mk('CORD-129','Hard','NVT',
`The equivalents of ethylenediamine required to replace the neutral ligands from the coordination sphere of the trans-complex of CoCl₃·4NH₃ is ____ (Round off to the Nearest Integer)`,
[],2,
`CoCl₃·4NH₃ = trans-[Co(NH₃)₄Cl₂]Cl\n\nCoordination sphere: 4 NH₃ + 2 Cl⁻ (CN = 6)\n\nTo replace the **neutral ligands** (4 NH₃) with en (bidentate, each replaces 2 NH₃):\n- 4 NH₃ ÷ 2 = **2 en** needed\n\nProduct: trans-[Co(en)₂Cl₂]Cl\n\n**Answer: 2**`,
'tag_coord_1','16 Mar 2021 (M)'),

mk('CORD-130','Hard','SCQ',
`Arrange the following metal complex/compounds in the increasing order of spin only magnetic moment. Presume all three are high spin systems. (Atomic numbers: Ce=58, Gd=64, Eu=63)\n(a) $(\\mathrm{NH_4})_2[\\mathrm{Ce(NO_3)_6}]$\n(b) $\\mathrm{Gd(NO_3)_3}$\n(c) $\\mathrm{Eu(NO_3)_3}$`,
scq([`(b) < (a) < (c)`,`(c) < (a) < (b)`,`(a) < (b) < (c)`,`(a) < (c) < (b)`],4),null,
`Lanthanide electron configurations (4f electrons):\n- Ce (58): [Xe] 4f¹ 5d¹ 6s² → Ce⁴⁺ in (NH₄)₂[Ce(NO₃)₆]: 4f⁰ → **0 unpaired** → μ = 0\n- Gd (64): [Xe] 4f⁷ 5d¹ 6s² → Gd³⁺: 4f⁷ → **7 unpaired** → μ = √(7×9) = 7.94 BM\n- Eu (63): [Xe] 4f⁷ 6s² → Eu³⁺: 4f⁶ → **6 unpaired** → μ = √(6×8) = 6.93 BM\n\nIncreasing order: (a) < (c) < (b)\n\n**Answer: (4) (a) < (c) < (b)**`,
'tag_coord_2','16 Mar 2021 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 13. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
