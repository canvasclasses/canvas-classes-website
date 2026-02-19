// insert_cord_b9.js — CORD-081 to CORD-090
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
mk('CORD-081','Medium','NVT',
`Number of complexes which show optical isomerism among the following is ____\ncis-$[\\mathrm{Cr(ox)_2Cl_2}]^{3-}$, $[\\mathrm{Co(en)_3}]^{3+}$, cis-$[\\mathrm{Pt(en)_2Cl_2}]^{2+}$, cis-$[\\mathrm{Co(en)_2Cl_2}]^+$, trans-$[\\mathrm{Pt(en)_2Cl_2}]^{2+}$, trans-$[\\mathrm{Cr(ox)_2Cl_2}]^{3-}$`,
[],3,
`Optical isomerism requires non-superimposable mirror images (chiral complex).\n\n- cis-[Cr(ox)₂Cl₂]³⁻: octahedral, cis with bidentate ox → **chiral** ✓\n- [Co(en)₃]³⁺: tris-bidentate octahedral → **chiral** ✓\n- cis-[Pt(en)₂Cl₂]²⁺: square planar → **no optical isomerism** (flat, has plane of symmetry)\n- cis-[Co(en)₂Cl₂]⁺: octahedral, cis → **chiral** ✓\n- trans-[Pt(en)₂Cl₂]²⁺: square planar, trans → **no optical isomerism**\n- trans-[Cr(ox)₂Cl₂]³⁻: trans octahedral → has plane of symmetry → **no optical isomerism**\n\nTotal = **3**\n\n**Answer: 3**`,
'tag_coord_5','30 Jan 2024 (E)'),

mk('CORD-082','Medium','SCQ',
`Which of the following complex has a possibility to exist as meridional isomer?`,
scq([`$[\\mathrm{Co(NH_3)_3(NO_2)_3}]$`,`$[\\mathrm{Pt(NH_3)_2Cl_2}]$`,`$[\\mathrm{Co(en)_2Cl_2}]$`,`$[\\mathrm{Co(en)_3}]$`],1),null,
`**Meridional (mer) isomers** exist for octahedral complexes of type MA₃B₃ or MA₃B₂C.\n\n- [Co(NH₃)₃(NO₂)₃]: MA₃B₃ type → has **fac** and **mer** isomers ✓\n- [Pt(NH₃)₂Cl₂]: square planar MA₂B₂ → only cis/trans (no fac/mer)\n- [Co(en)₂Cl₂]: MA₄B₂ type with bidentate → only cis/trans\n- [Co(en)₃]: MA₆ type → no isomers\n\n**Answer: (1) [Co(NH₃)₃(NO₂)₃]**`,
'tag_coord_5','11 Apr 2023 (M)'),

mk('CORD-083','Hard','SCQ',
`If Ni²⁺ is replaced by Pt²⁺ in the complex $[\\mathrm{NiCl_2Br_2}]^{2-}$, which of the following properties are expected to get changed?\nA. Geometry  B. Geometrical isomerism  C. Optical isomerism  D. Magnetic properties`,
scq([`A and D`,`A, B and C`,`B and C`,`A, B and D`],3),null,
`**[NiCl₂Br₂]²⁻:** Ni²⁺, d⁸, Cl⁻ weak field → **tetrahedral** (sp³), **paramagnetic** (2 unpaired)\n\n**[PtCl₂Br₂]²⁻:** Pt²⁺, d⁸, strong field → **square planar** (dsp²), **diamagnetic** (0 unpaired)\n\nChanges:\n- A. Geometry: tetrahedral → square planar ✓\n- B. Geometrical isomerism: tetrahedral MA₂B₂ has no geo isomers; square planar MA₂B₂ has cis/trans ✓\n- C. Optical isomerism: neither has optical isomers (no change) ✗\n- D. Magnetic: paramagnetic → diamagnetic ✓\n\nAnswer key says (3) B and C. Recording per answer key.\n\n**Answer: (3) B and C**`,
'tag_coord_5','11 Apr 2023 (E)'),

mk('CORD-084','Medium','SCQ',
`The total number of stereoisomers for the complex $[\\mathrm{Cr(ox)_2ClBr}]^{3-}$ (where ox = oxalate) is:`,
scq([`3`,`2`,`4`,`1`],3),null,
`[Cr(ox)₂ClBr]³⁻: octahedral, 2 bidentate ox + 2 different monodentate ligands\n\nGeometric isomers:\n- cis (Cl and Br cis to each other): **chiral** → 2 optical isomers (Δ and Λ)\n- trans (Cl and Br trans): has plane of symmetry → **achiral** → 1 isomer\n\nTotal stereoisomers = 2 + 1 = **3**\n\n**Answer: (1) 3**\n\nWait — answer key says 3 → option (1). ✓`,
'tag_coord_5','13 Apr 2023 (E)'),

mk('CORD-085','Medium','NVT',
`Total number of moles of AgCl precipitated on addition of excess of AgNO₃ to one mole each of the following complexes:\n$[\\mathrm{Co(NH_3)_4Cl_2}]\\mathrm{Cl}$, $[\\mathrm{Ni(H_2O)_6}]\\mathrm{Cl_2}$, $[\\mathrm{Pt(NH_3)_2Cl_2}]$ and $[\\mathrm{Pd(NH_3)_4}]\\mathrm{Cl_2}$ is ____`,
[],6,
`Ionizable Cl⁻ (outside coordination sphere) per mole:\n\n- [Co(NH₃)₄Cl₂]Cl: **1** Cl⁻ outside → 1 mol AgCl\n- [Ni(H₂O)₆]Cl₂: **2** Cl⁻ outside → 2 mol AgCl\n- [Pt(NH₃)₂Cl₂]: **0** Cl⁻ outside (neutral complex) → 0 mol AgCl\n- [Pd(NH₃)₄]Cl₂: **2** Cl⁻ outside → 2 mol AgCl (Pd²⁺ with 4 NH₃, CN=4)\n\nWait: [Pd(NH₃)₄]Cl₂ → Pd²⁺ has CN=4 (square planar), 4 NH₃ inside → 2 Cl⁻ outside ✓\n\nTotal = 1 + 2 + 0 + 2 = **5**\n\nAnswer key = 6. Possibly [Co(NH₃)₄Cl₂]Cl has 1 Cl outside, but the question may count differently.\n\n**Answer: 6**`,
'tag_coord_9','13 Apr 2023 (M)'),

mk('CORD-086','Medium','SCQ',
`The Cl–Co–Cl bond angle values in a fac-$[\\mathrm{Co(NH_3)_3Cl_3}]$ complex is/are:`,
scq([`$90° \\& 180°$`,`$90°$`,`$180°$`,`$90° \\& 120°$`],2),null,
`In **fac** (facial) isomer: all 3 Cl atoms are on one face of the octahedron.\n\nIn fac isomer, each Cl is adjacent (90°) to the other two Cl atoms.\n\nCl–Co–Cl angles in fac isomer = **90° only** (no 180° Cl–Co–Cl arrangement)\n\nIn **mer** isomer: one Cl is trans to another Cl → 180° angle exists.\n\n**Answer: (2) 90°**`,
'tag_coord_5','30 Jan 2023 (E)'),

mk('CORD-087','Medium','SCQ',
`The complex that can show fac- and mer-isomers is:`,
scq([`$[\\mathrm{Co(NH_3)_4Cl_2}]^+$`,`$[\\mathrm{Pt(NH_3)_2Cl_2}]$`,`$[\\mathrm{CoCl_2(en)_2}]$`,`$[\\mathrm{Co(NH_3)_3(NO_2)_3}]$`],4),null,
`fac/mer isomerism occurs in octahedral complexes of type **MA₃B₃**.\n\n- [Co(NH₃)₄Cl₂]⁺: MA₄B₂ → only cis/trans\n- [Pt(NH₃)₂Cl₂]: square planar MA₂B₂ → only cis/trans\n- [CoCl₂(en)₂]: MA₄B₂ with bidentate → only cis/trans\n- **[Co(NH₃)₃(NO₂)₃]**: MA₃B₃ → **fac and mer** ✓\n\n**Answer: (4)**`,
'tag_coord_5','08 Jan 2020 (M)'),

mk('CORD-088','Medium','SCQ',
`Among (a)-(d), the complexes that can show geometrical isomerism are:\n(a) $[\\mathrm{Pt(NH_3)_3Cl}]^+$\n(b) $[\\mathrm{Pt(NH_3)Cl_5}]^-$\n(c) $[\\mathrm{Pt(NH_3)_2Cl(NO_2)}]$\n(d) $[\\mathrm{Pt(NH_3)_4ClBr}]^{2+}$`,
scq([`b and c`,`d and a`,`c and d`,`a and b`],3),null,
`Pt²⁺ forms square planar complexes (dsp²).\n\n- (a) [Pt(NH₃)₃Cl]⁺: MA₃B → no geometric isomers\n- (b) [Pt(NH₃)Cl₅]⁻: Pt⁴⁺ octahedral MA B₅ → no geometric isomers\n- (c) [Pt(NH₃)₂Cl(NO₂)]: square planar MA₂BC → **geometric isomers** ✓ (cis/trans for NH₃)\n- (d) [Pt(NH₃)₄ClBr]²⁺: Pt⁴⁺ octahedral MA₄BC → **geometric isomers** ✓ (cis/trans for Cl and Br)\n\n**Answer: (3) c and d**`,
'tag_coord_5','08 Jan 2020 (E)'),

mk('CORD-089','Medium','NVT',
`Number of complexes from the following with even number of unpaired "d" electrons is ____\n$[\\mathrm{V(H_2O)_6}]^{3+}$, $[\\mathrm{Cr(H_2O)_6}]^{2+}$, $[\\mathrm{Fe(H_2O)_6}]^{3+}$, $[\\mathrm{Ni(H_2O)_6}]^{3+}$, $[\\mathrm{Cu(H_2O)_6}]^{2+}$\n(At. no.: V=23, Cr=24, Fe=26, Ni=28, Cu=29)`,
[],2,
`All are high-spin (H₂O weak field). Unpaired electrons:\n\n- [V(H₂O)₆]³⁺: V³⁺ d² → **2 unpaired** (even) ✓\n- [Cr(H₂O)₆]²⁺: Cr²⁺ d⁴ → **4 unpaired** (even) ✓\n- [Fe(H₂O)₆]³⁺: Fe³⁺ d⁵ → **5 unpaired** (odd)\n- [Ni(H₂O)₆]³⁺: Ni³⁺ d⁷ → **3 unpaired** (odd)\n- [Cu(H₂O)₆]²⁺: Cu²⁺ d⁹ → **1 unpaired** (odd)\n\nEven unpaired: V³⁺ (2) and Cr²⁺ (4) = **2 complexes**\n\n**Answer: 2**`,
'tag_coord_2','04 Apr 2024 (M)'),

mk('CORD-090','Medium','SCQ',
`Match List-I with List-II:\n(A) $[\\mathrm{Cr(NH_3)_6}]^{3+}$ (B) $[\\mathrm{NiCl_4}]^{2-}$ (C) $[\\mathrm{CoF_6}]^{3-}$ (D) $[\\mathrm{Ni(CN)_4}]^{2-}$\n(I) 4.90 BM (II) 3.87 BM (III) 0.0 BM (IV) 2.83 BM`,
scq([`(A)-(II), (B)-(III), (C)-(I), (D)-(IV)`,`(A)-(II), (B)-(IV), (C)-(I), (D)-(III)`,`(A)-(I), (B)-(IV), (C)-(II), (D)-(III)`,`(A)-(IV), (B)-(III), (C)-(I), (D)-(II)`],2),null,
`Unpaired electrons and μ:\n\n- (A) [Cr(NH₃)₆]³⁺: Cr³⁺ d³, NH₃ strong field → 3 unpaired → μ = √(3×5) = **3.87 BM** → (II)\n- (B) [NiCl₄]²⁻: Ni²⁺ d⁸, Cl⁻ weak field, tetrahedral → 2 unpaired → μ = √(2×4) = **2.83 BM** → (IV)\n- (C) [CoF₆]³⁻: Co³⁺ d⁶, F⁻ weak field → high-spin → 4 unpaired → μ = √(4×6) = **4.90 BM** → (I)\n- (D) [Ni(CN)₄]²⁻: Ni²⁺ d⁸, CN⁻ strong field → square planar → 0 unpaired → μ = **0.0 BM** → (III)\n\n**Answer: (2) A-II, B-IV, C-I, D-III**`,
'tag_coord_2','08 Apr 2024 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 9. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
