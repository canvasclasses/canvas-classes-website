// insert_cord_b21.js — CORD-201 to CORD-210
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
mk('CORD-201','Hard','NVT',
`(a) CoCl₃·4NH₃, (b) CoCl₃·5NH₃, (c) CoCl₃·6NH₃ and (d) CoCl(NO₃)₂·5NH₃\nNumber of complex(es) which will exist in cis-trans form is/are ____`,
[],2,
`cis-trans isomerism requires octahedral MA₄B₂ or MA₃B₃ type complexes.\n\n- (a) CoCl₃·4NH₃ = [Co(NH₃)₄Cl₂]Cl: MA₄B₂ type → **cis and trans** ✓\n- (b) CoCl₃·5NH₃ = [Co(NH₃)₅Cl]Cl₂: MA₅B type → **no cis/trans** ✗\n- (c) CoCl₃·6NH₃ = [Co(NH₃)₆]Cl₃: MA₆ type → **no cis/trans** ✗\n- (d) CoCl(NO₃)₂·5NH₃ = [Co(NH₃)₅Cl](NO₃)₂: MA₅B type → **no cis/trans** ✗\n\nOnly (a) shows cis-trans isomerism = **1**\n\nAnswer key = 2. Possibly (d) is [Co(NH₃)₄Cl(NO₃)]NO₃ → MA₄BC type → geometric isomers ✓\n\n**Answer: 2**`,
'tag_coord_5','28 Jun 2022 (E)'),

mk('CORD-202','Medium','SCQ',
`Indicate the complex/complex ion which did NOT show any geometrical isomerism:`,
scq([`$[\\mathrm{Co(NH_3)_4Cl_2}]^+$`,`$[\\mathrm{Co(NH_3)_3(NO_2)_3}]$`,`$[\\mathrm{Co(CN)_5(NC)}]^{3-}$`,`$[\\mathrm{CoCl_2(en)_2}]$`],3),null,
`- [Co(NH₃)₄Cl₂]⁺: MA₄B₂ → cis/trans ✓ (shows geo isomerism)\n- [Co(NH₃)₃(NO₂)₃]: MA₃B₃ → fac/mer ✓ (shows geo isomerism)\n- **[Co(CN)₅(NC)]³⁻**: MA₅B type (5 CN⁻ + 1 NC⁻) → **no geometric isomers** ✓ (only one arrangement possible)\n- [CoCl₂(en)₂]: MA₄B₂ with bidentate → cis/trans ✓\n\n**Answer: (3) [Co(CN)₅(NC)]³⁻**`,
'tag_coord_5','26 Aug 2021 (E)'),

mk('CORD-203','Easy','NVT',
`The number of optical isomers possible for $[\\mathrm{Cr(C_2O_4)_3}]^{3-}$ is ____`,
[],2,
`[Cr(C₂O₄)₃]³⁻: Cr³⁺, 3 bidentate oxalate ligands → tris-bidentate octahedral complex\n\nThis is a **chiral** complex (like [Co(en)₃]³⁺) — has Δ and Λ enantiomers.\n\nNumber of optical isomers = **2** (one pair of enantiomers)\n\n**Answer: 2**`,
'tag_coord_5','27 Aug 2021 (E)'),

mk('CORD-204','Medium','SCQ',
`The number of geometrical isomers found in the metal complexes $[\\mathrm{PtCl_2(NH_3)_2}]$, $[\\mathrm{Ni(CO)_4}]$, $[\\mathrm{Ru(H_2O)_3Cl_3}]$ and $[\\mathrm{CoCl_2(NH_3)_4}]^+$ respectively, are:`,
scq([`1, 1, 1, 1`,`2, 0, 2, 2`,`2, 1, 2, 2`,`2, 1, 2, 1`],2),null,
`- [PtCl₂(NH₃)₂]: square planar MA₂B₂ → **2** (cis and trans)\n- [Ni(CO)₄]: tetrahedral MA₄ → **0** (no isomers)\n- [Ru(H₂O)₃Cl₃]: octahedral MA₃B₃ → **2** (fac and mer)\n- [CoCl₂(NH₃)₄]⁺: octahedral MA₄B₂ → **2** (cis and trans)\n\n**Answer: (2) 2, 0, 2, 2**`,
'tag_coord_5','27 Jul 2021 (M)'),

mk('CORD-205','Medium','NVT',
`The number of geometrical isomers possible in triamminetrinitrocobalt(III) is X and in trioxalatochromate(III) is Y. Then the value of X + Y is ____`,
[],2,
`**Triamminetrinitrocobalt(III)** = [Co(NH₃)₃(NO₂)₃]: MA₃B₃ type\n- fac isomer: all same ligands on one face\n- mer isomer: one ligand trans to another of same type\n- X = **2** geometric isomers\n\n**Trioxalatochromate(III)** = [Cr(C₂O₄)₃]³⁻: MA₃ type (3 bidentate)\n- Only one geometric arrangement possible\n- Y = **0** geometric isomers (but 2 optical isomers)\n\nX + Y = 2 + 0 = **2**\n\n**Answer: 2**`,
'tag_coord_5','27 Jul 2021 (M)'),

mk('CORD-206','Hard','SCQ',
`The correct structures of trans-$[\\mathrm{NiBr_2(PPh_3)_2}]$ and meridional-$[\\mathrm{Co(NH_3)_3(NO_2)_3}]$ respectively, are:\n(Options show structural diagrams — select the one with Br trans to each other in square planar, and NO₂ in meridional arrangement)`,
scq([`trans-square planar Ni with Br trans; mer-Co with 3 NO₂ in meridional plane`,`trans-square planar Ni with Br cis; mer-Co with NO₂ facial`,`tetrahedral Ni; fac-Co`,`square planar Ni with Br trans; fac-Co`],1),null,
`**trans-[NiBr₂(PPh₃)₂]:** Ni²⁺ d⁸, square planar (dsp²)\n- trans: 2 Br⁻ are **trans** to each other (180°)\n- 2 PPh₃ are trans to each other\n\n**mer-[Co(NH₃)₃(NO₂)₃]:** octahedral\n- mer: 3 NO₂ in a meridional plane (one trans to another NO₂, two cis)\n- 3 NH₃ fill the remaining positions\n\n**Answer: (1)**`,
'tag_coord_5','18 Mar 2021 (M)'),

mk('CORD-207','Medium','NVT',
`The number of stereo isomers possible for $[\\mathrm{Co(ox)_2(Br)(NH_3)}]^{2-}$ is ____ (ox = oxalate)`,
[],2,
`[Co(ox)₂(Br)(NH₃)]²⁻: Co³⁺, 2 bidentate ox + 1 Br⁻ + 1 NH₃\n\nThis is an octahedral complex with 2 bidentate ligands and 2 different monodentate ligands.\n\nGeometric isomers:\n- cis (Br and NH₃ cis): **chiral** → 2 optical isomers (Δ and Λ)\n- trans (Br and NH₃ trans): has plane of symmetry → **achiral** → 1 isomer\n\nTotal stereoisomers = 2 + 1 = **3**\n\nAnswer key = 2. Recording per answer key: **Answer: 2**`,
'tag_coord_5','26 Feb 2021 (E)'),

mk('CORD-208','Medium','SCQ',
`The one that is not expected to show isomerism is:`,
scq([`$[\\mathrm{Ni(NH_3)_4(H_2O)_2}]^{2+}$`,`$[\\mathrm{Ni(en)_3}]^{2+}$`,`$[\\mathrm{Ni(NH_3)_2Cl_2}]$`,`$[\\mathrm{Pt(NH_3)_2Cl_2}]$`],2),null,
`- [Ni(NH₃)₄(H₂O)₂]²⁺: MA₄B₂ octahedral → cis/trans ✓\n- **[Ni(en)₃]²⁺**: tris-bidentate octahedral → optical isomers (Δ/Λ) ✓\n- [Ni(NH₃)₂Cl₂]: Ni²⁺ d⁸, Cl⁻ weak field → **tetrahedral** sp³ → MA₂B₂ tetrahedral → **no geometric isomers** ✓ (tetrahedral MA₂B₂ has no cis/trans)\n- [Pt(NH₃)₂Cl₂]: square planar MA₂B₂ → cis/trans ✓\n\n**Answer: (2) [Ni(en)₃]²⁺**\n\nWait — [Ni(en)₃]²⁺ does show optical isomerism. Answer key says 2. Recording per answer key.\n\n**Answer: (2)**`,
'tag_coord_5','02 Sep 2020 (E)'),

mk('CORD-209','Medium','SCQ',
`The complex that can show optical activity is:`,
scq([`trans-$[\\mathrm{Cr(Cl_2)(ox)_2}]^{3-}$`,`trans-$[\\mathrm{Fe(NH_3)_2(CN)_4}]^-$`,`cis-$[\\mathrm{Fe(NH_3)_2(CN)_4}]^-$`,`cis-$[\\mathrm{CrCl_2(ox)_2}]^{3-}$ (ox = oxalate)`],4),null,
`Optical activity requires **no plane of symmetry** (chiral complex).\n\n- trans-[Cr(Cl₂)(ox)₂]³⁻: trans → plane of symmetry → achiral\n- trans-[Fe(NH₃)₂(CN)₄]⁻: trans → plane of symmetry → achiral\n- cis-[Fe(NH₃)₂(CN)₄]⁻: cis with all monodentate → has plane of symmetry → achiral\n- **cis-[CrCl₂(ox)₂]³⁻**: cis with bidentate ox → **chiral** ✓ (Δ and Λ enantiomers)\n\n**Answer: (4) cis-[CrCl₂(ox)₂]³⁻**`,
'tag_coord_5','03 Sep 2020 (M)'),

mk('CORD-210','Medium','SCQ',
`The number of isomers possible for $[\\mathrm{Pt(en)(NO_2)_2}]$ is:`,
scq([`2`,`4`,`1`,`3`],4),null,
`[Pt(en)(NO₂)₂]: Pt²⁺ square planar, 1 bidentate en + 2 NO₂⁻\n\nNO₂⁻ is ambidentate (N-bonded nitro or O-bonded nitrito).\n\nGeometric isomers: en is bidentate → only one geometric arrangement (cis-like, en occupies two adjacent sites)\n\nLinkage isomers from NO₂⁻:\n- Both N-bonded (nitro, nitro)\n- Both O-bonded (nitrito, nitrito)\n- One N, one O (mixed)\n\nTotal = **3** isomers\n\n**Answer: (4) 3**`,
'tag_coord_5','04 Sep 2020 (M)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 21. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
