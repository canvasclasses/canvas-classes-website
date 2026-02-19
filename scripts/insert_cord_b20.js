// insert_cord_b20.js — CORD-191 to CORD-200
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
mk('CORD-191','Medium','SCQ',
`Low oxidation state of metals in their complexes are common when ligands:`,
scq([`have good π-accepting character`,`have good σ-donor character`,`are having good π-donating ability`,`are having poor σ-donating ability`],1),null,
`Low oxidation states are stabilized by **π-acceptor** (π-acid) ligands.\n\nπ-acceptor ligands (like CO, NO⁺, CN⁻) accept electron density from the metal via back-bonding, stabilizing the metal in low/zero oxidation states.\n\n**Answer: (1) have good π-accepting character**`,
'tag_coord_6','27 Jul 2022 (E)'),

mk('CORD-192','Medium','NVT',
`In the cobalt-carbonyl complex [Co₂(CO)₈], number of Co–Co bonds is "X" and terminal CO ligands is "Y". X + Y = ____`,
[],7,
`Co₂(CO)₈ structure (most stable isomer with bridging CO):\n- 2 bridging CO\n- 6 terminal CO (3 on each Co)\n- 1 Co–Co bond\n\nX (Co–Co bonds) = **1**\nY (terminal CO) = **6**\n\nX + Y = 1 + 6 = **7**\n\n**Answer: 7**`,
'tag_coord_6','24 Jun 2022 (M)'),

mk('CORD-193','Medium','NVT',
`Number of complexes which will exhibit synergic bonding amongst $[\\mathrm{Cr(CO)_6}]$, $[\\mathrm{Mn(CO)_5}]$ and $[\\mathrm{Mn_2(CO)_{10}}]$ is ____`,
[],3,
`**Synergic bonding** = σ-donation from CO to metal + π-back donation from metal to CO*\n\nAll metal carbonyls exhibit synergic bonding:\n- [Cr(CO)₆]: Cr(0), CO → synergic ✓\n- [Mn(CO)₅]: Mn(I) or radical, CO → synergic ✓\n- [Mn₂(CO)₁₀]: Mn(0), CO → synergic ✓\n\nAll **3** complexes exhibit synergic bonding.\n\n**Answer: 3**`,
'tag_coord_6','28 Jun 2022 (M)'),

mk('CORD-194','Easy','NVT',
`Number of bridging CO ligands in $[\\mathrm{Mn_2(CO)_{10}}]$ is ____`,
[],0,
`Mn₂(CO)₁₀ structure:\n- Each Mn has 5 terminal CO ligands\n- 1 Mn–Mn bond\n- **No bridging CO** (all CO are terminal)\n\nThis is different from Co₂(CO)₈ which has bridging CO.\n\n**Answer: 0**`,
'tag_coord_6','26 Feb 2021 (M)'),

mk('CORD-195','Easy','SCQ',
`Mn₂(CO)₁₀ is an organometallic compound due to the presence of:`,
scq([`Mn–O bond`,`Mn–Mn bond`,`C–O bond`,`Mn–C bond`],4),null,
`**Organometallic compounds** are defined by the presence of a **direct metal–carbon bond**.\n\nIn Mn₂(CO)₁₀, each Mn is bonded directly to C of CO → **Mn–C bond** ✓\n\n**Answer: (4) Mn–C bond**`,
'tag_coord_6','12 Jan 2019 (M)'),

mk('CORD-196','Hard','SCQ',
`An octahedral complex with the formula CoCl₃·nNH₃ upon reaction with excess of AgNO₃ solution gives 2 moles of AgCl. Consider the oxidation state of Co in the complex is 'x'. The value of "x + n" is ____`,
scq([`6`,`8`,`3`,`5`],2),null,
`2 mol AgCl → 2 ionizable Cl⁻ outside coordination sphere.\n\nTotal Cl = 3; inside = 3 − 2 = 1\n\nOctahedral CN = 6: 1 Cl⁻ + n NH₃ = 6 → n = **5**\n\nComplex: [Co(NH₃)₅Cl]Cl₂\n\nCo oxidation state: x + 0(5 NH₃) + (−1)(Cl) = +2 → x = **+3**\n\nx + n = 3 + 5 = **8**\n\n**Answer: (2) 8**`,
'tag_coord_9','08 Apr 2024 (M)'),

mk('CORD-197','Medium','SCQ',
`The complex that dissolves in water is:`,
scq([`$(\\mathrm{NH_4})_3[\\mathrm{As(Mo_3O_{10})_4}]$`,`$\\mathrm{Fe_4[Fe(CN)_6]_3}$`,`$\\mathrm{K_3[Co(NO_2)_6]}$`,`$[\\mathrm{Fe_3(OH)_2(OAc)_6}]\\mathrm{Cl}$`],3),null,
`- (NH₄)₃[As(Mo₃O₁₀)₄]: ammonium phosphomolybdate-type → insoluble yellow precipitate\n- Fe₄[Fe(CN)₆]₃: Prussian blue → insoluble colloidal\n- **K₃[Co(NO₂)₆]**: potassium hexanitrocobaltate(III) → **soluble** in water ✓ (ionic compound)\n- [Fe₃(OH)₂(OAc)₆]Cl: basic iron acetate → insoluble\n\n**Answer: (3) K₃[Co(NO₂)₆]**`,
'tag_coord_7','11 Apr 2023 (M)'),

mk('CORD-198','Medium','SCQ',
`Chiral complex from the following is: (en = ethylene diamine)`,
scq([`cis-$[\\mathrm{PtCl_2(en)_2}]^{2+}$`,`trans-$[\\mathrm{PtCl_2(en)_2}]^{2+}$`,`cis-$[\\mathrm{PtCl_2(NH_3)_2}]$`,`trans-$[\\mathrm{Co(NH_3)_4Cl_2}]^+$`],1),null,
`**Chiral** = non-superimposable mirror image (no plane of symmetry).\n\n- cis-[PtCl₂(en)₂]²⁺: Pt⁴⁺ octahedral, cis geometry with 2 bidentate en → **chiral** ✓ (Δ and Λ enantiomers)\n- trans-[PtCl₂(en)₂]²⁺: trans → has plane of symmetry → achiral\n- cis-[PtCl₂(NH₃)₂]: square planar → flat → achiral\n- trans-[Co(NH₃)₄Cl₂]⁺: trans octahedral → has plane of symmetry → achiral\n\n**Answer: (1) cis-[PtCl₂(en)₂]²⁺**`,
'tag_coord_5','29 Jan 2023 (M)'),

mk('CORD-199','Medium','SCQ',
`The complex cation which has two isomers is:`,
scq([`$[\\mathrm{Co(H_2O)_6}]^{3+}$`,`$[\\mathrm{Co(NH_3)_5Cl}]^{2+}$`,`$[\\mathrm{Co(NH_3)_5NO_2}]^{2+}$`,`$[\\mathrm{Co(NH_3)_5Cl}]^+$`],3),null,
`Two isomers = **linkage isomerism** (ambidentate ligand) or geometric isomerism.\n\n- [Co(H₂O)₆]³⁺: MA₆ → no isomers\n- [Co(NH₃)₅Cl]²⁺: MA₅B → no geometric isomers\n- **[Co(NH₃)₅NO₂]²⁺**: NO₂⁻ is ambidentate → binds via N (nitro) or O (nitrito) → **2 linkage isomers** ✓\n- [Co(NH₃)₅Cl]⁺: wrong charge for Co³⁺ with 5 NH₃ + Cl\n\n**Answer: (3) [Co(NH₃)₅NO₂]²⁺**`,
'tag_coord_5','01 Feb 2023 (E)'),

mk('CORD-200','Hard','NVT',
`Total number of relatively more stable isomer(s) possible for octahedral complex $[\\mathrm{Cu(en)_2(SCN)_2}]$ will be ____`,
[],2,
`[Cu(en)₂(SCN)₂]: Cu²⁺, 2 bidentate en + 2 SCN⁻\n\nGeometric isomers:\n- cis: 2 SCN⁻ cis to each other\n- trans: 2 SCN⁻ trans to each other\n\nSCN⁻ is ambidentate (S or N binding), but for stability:\n- Cu²⁺ (soft acid) prefers S-bonded thiocyanate (soft donor)\n\nMore stable isomers = those with S-bonded SCN⁻:\n- cis with S-bonded SCN⁻\n- trans with S-bonded SCN⁻\n\nTotal relatively more stable isomers = **2**\n\n**Answer: 2**`,
'tag_coord_5','28 Jul 2022 (M)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 20. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
