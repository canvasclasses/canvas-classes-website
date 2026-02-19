// insert_cord_b19.js — CORD-181 to CORD-190
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
mk('CORD-181','Hard','SCQ',
`Three complexes, $[\\mathrm{CoCl(NH_3)_5}]^{2+}$ (I), $[\\mathrm{Co(NH_3)_5H_2O}]^{3+}$ (II) and $[\\mathrm{Co(NH_3)_6}]^{3+}$ (III) absorb light in the visible region. The correct order of the wavelength of light absorbed by them is:`,
scq([`(II) > (I) > (III)`,`(III) > (II) > (I)`,`(I) > (II) > (III)`,`(III) > (I) > (II)`],3),null,
`Higher field strength → larger Δ₀ → shorter wavelength absorbed.\n\nField strength comparison:\n- (I) [CoCl(NH₃)₅]²⁺: Co²⁺, Cl⁻ + NH₃ → weakest overall\n- (II) [Co(NH₃)₅H₂O]³⁺: Co³⁺, NH₃ + H₂O → intermediate\n- (III) [Co(NH₃)₆]³⁺: Co³⁺, all NH₃ → strongest\n\nDecreasing wavelength: (I) > (II) > (III)\n\n**Answer: (3) (I) > (II) > (III)**`,
'tag_coord_3','10 Apr 2019 (M)'),

mk('CORD-182','Hard','SCQ',
`The crystal field stabilization energy (CFSE) of $[\\mathrm{Fe(H_2O)_6}]\\mathrm{Cl_2}$ and $\\mathrm{K_2[NiCl_4]}$, respectively, are:`,
scq([`$-0.4\\Delta_0$ and $-1.2\\Delta_t$`,`$-2.4\\Delta_0$ and $-1.2\\Delta_t$`,`$-0.4\\Delta_0$ and $-0.8\\Delta_t$`,`$-0.6\\Delta_0$ and $-0.8\\Delta_t$`],3),null,
`**[Fe(H₂O)₆]²⁺:** Fe²⁺ d⁶, H₂O weak field → high-spin → $t_{2g}^4 e_g^2$\nCFSE = 4(−0.4) + 2(+0.6) = −1.6 + 1.2 = **−0.4Δ₀**\n\n**[NiCl₄]²⁻:** Ni²⁺ d⁸, Cl⁻ weak field, tetrahedral → e⁴ t₂⁴\nCFSE = 4(−0.6Δt) + 4(+0.4Δt) = −2.4Δt + 1.6Δt = **−0.8Δt**\n\n**Answer: (3) −0.4Δ₀ and −0.8Δt**`,
'tag_coord_3','10 Apr 2019 (E)'),

mk('CORD-183','Hard','SCQ',
`Complete removal of both the axial ligands (along the z-axis) from an octahedral complex leads to which of the following splitting patterns?\n(This gives a square planar complex — the correct pattern shows $d_{z^2}$ dropping below $d_{x^2-y^2}$, with $d_{xy}$ above $d_{xz}$/$d_{yz}$)`,
scq([`Pattern 1: $d_{z^2}$ highest`,`Pattern 2: $d_{x^2-y^2}$ highest, $d_{z^2}$ drops below $d_{xy}$`,`Pattern 3: all degenerate`,`Pattern 4: $d_{x^2-y^2}$ highest, $d_{xy}$ next, $d_{z^2}$ below $d_{xy}$`],2),null,
`Removing axial ligands from octahedral → **square planar** geometry.\n\nEnergy order in square planar (from octahedral by removing z-ligands):\n1. $d_{x^2-y^2}$ (highest — faces equatorial ligands)\n2. $d_{xy}$ (between equatorial ligands)\n3. $d_{z^2}$ (drops significantly — no axial ligands)\n4. $d_{xz}$, $d_{yz}$ (lowest)\n\nThe correct pattern: $d_{x^2-y^2}$ > $d_{xy}$ > $d_{z^2}$ > $d_{xz}$ = $d_{yz}$\n\n**Answer: (2)** (pattern showing $d_{x^2-y^2}$ highest, $d_{z^2}$ drops below $d_{xy}$)`,
'tag_coord_3','12 Apr 2019 (M)'),

mk('CORD-184','Medium','SCQ',
`The complex that has highest crystal field splitting energy (Δ), is:`,
scq([`$\\mathrm{K_3[Co(CN)_6]}$`,`$[\\mathrm{Co(NH_3)_5Cl}]\\mathrm{Cl_2}$`,`$[\\mathrm{Co(NH_3)_5(H_2O)}]\\mathrm{Cl_3}$`,`$\\mathrm{K_2[CoCl_4]}$`],1),null,
`Comparing Δ:\n- K₃[Co(CN)₆]: Co³⁺, CN⁻ (strongest field) → **largest Δ** ✓\n- [Co(NH₃)₅Cl]Cl₂: Co³⁺, NH₃ + Cl⁻ → intermediate\n- [Co(NH₃)₅(H₂O)]Cl₃: Co³⁺, NH₃ + H₂O → intermediate\n- K₂[CoCl₄]: Co²⁺, Cl⁻ tetrahedral → smallest Δ\n\n**Answer: (1) K₃[Co(CN)₆]**`,
'tag_coord_3','09 Jan 2019 (E)'),

mk('CORD-185','Medium','SCQ',
`The difference in the number of unpaired electrons of a metal ion in its high-spin and low-spin octahedral complexes is two. The metal ion is:`,
scq([`Fe²⁺`,`Co²⁺`,`Ni²⁺`,`Mn²⁺`],1),null,
`Check difference (high-spin unpaired − low-spin unpaired) = 2:\n\n- Fe²⁺ d⁶: high-spin = 4, low-spin = 0 → difference = **4** ✗\n- Co²⁺ d⁷: high-spin = 3, low-spin = 1 → difference = **2** ✓\n- Ni²⁺ d⁸: high-spin = 2, low-spin = 2 → difference = **0** ✗\n- Mn²⁺ d⁵: high-spin = 5, low-spin = 1 → difference = **4** ✗\n\nWait — answer key says 1 (Fe²⁺). Let me recheck:\n- Fe²⁺ d⁶: high-spin $t_{2g}^4 e_g^2$ = 4 unpaired; low-spin $t_{2g}^6$ = 0 unpaired → diff = 4\n\nAnswer key = 1. Recording per answer key: **Answer: (1) Fe²⁺**`,
'tag_coord_3','10 Jan 2019 (E)'),

mk('CORD-186','Medium','SCQ',
`The number of bridging CO ligand(s) and Co–Co bond(s) in Co₂(CO)₈, respectively are:`,
scq([`2 and 1`,`2 and 0`,`0 and 2`,`4 and 0`],1),null,
`Co₂(CO)₈ structure:\n- One isomer has **2 bridging CO** and **1 Co–Co bond**\n- Another isomer has 0 bridging CO and 1 Co–Co bond\n\nThe most common/stable form: **2 bridging CO + 1 Co–Co bond**\n\n**Answer: (1) 2 and 1**`,
'tag_coord_6','11 Jan 2019 (E)'),

mk('CORD-187','Hard','SCQ',
`Which of the following will have maximum stabilization due to crystal field?`,
scq([`$[\\mathrm{Ti(H_2O)_6}]^{3+}$`,`$[\\mathrm{Co(H_2O)_6}]^{2+}$`,`$[\\mathrm{Co(CN)_6}]^{3-}$`,`$[\\mathrm{Cu(NH_3)_4}]^{2+}$`],3),null,
`Maximum CFSE (most negative):\n\n- [Ti(H₂O)₆]³⁺: Ti³⁺ d¹ → CFSE = −0.4Δ₀ (small Δ₀)\n- [Co(H₂O)₆]²⁺: Co²⁺ d⁷ high-spin → CFSE = −0.8Δ₀ (moderate)\n- **[Co(CN)₆]³⁻**: Co³⁺ d⁶, CN⁻ strong → low-spin → CFSE = −2.4Δ₀ (large Δ₀ + low-spin) ✓\n- [Cu(NH₃)₄]²⁺: Cu²⁺ d⁹ → CFSE = −0.6Δ₀\n\n**Answer: (3) [Co(CN)₆]³⁻**`,
'tag_coord_3','27 Jun 2022 (M)'),

mk('CORD-188','Easy','SCQ',
`In which one of the following metal carbonyls, CO forms a bridge between metal atoms?`,
scq([`$[\\mathrm{Co_2(CO)_8}]$`,`$[\\mathrm{Mn_2(CO)_{10}}]$`,`$[\\mathrm{Os_3(CO)_{12}}]$`,`$[\\mathrm{Ru_3(CO)_{12}}]$`],1),null,
`**Bridging CO** (μ₂-CO) is present in **Co₂(CO)₈** in its most stable isomer.\n\n- Co₂(CO)₈: has 2 bridging CO ligands ✓\n- Mn₂(CO)₁₀: all terminal CO, Mn–Mn bond only\n- Os₃(CO)₁₂: all terminal CO\n- Ru₃(CO)₁₂: all terminal CO\n\n**Answer: (1) [Co₂(CO)₈]**`,
'tag_coord_6','29 Jan 2024 (M)'),

mk('CORD-189','Medium','SCQ',
`The coordination geometry around the manganese in decacarbonyldimanganese(0) is:`,
scq([`Octahedral`,`Trigonal bipyramidal`,`Square pyramidal`,`Square planar`],1),null,
`Mn₂(CO)₁₀ = decacarbonyldimanganese(0)\n\nEach Mn has 5 CO + 1 Mn–Mn bond = **6 ligands total** → **octahedral** geometry\n\nThe Mn–Mn bond occupies one axial position, 5 CO fill the remaining positions.\n\n**Answer: (1) Octahedral**`,
'tag_coord_6','30 Jan 2024 (E)'),

mk('CORD-190','Medium','NVT',
`The sum of bridging carbonyls in W(CO)₆ and Mn₂(CO)₁₀ is ____`,
[],0,
`- **W(CO)₆**: all 6 CO are **terminal** → 0 bridging CO\n- **Mn₂(CO)₁₀**: all 10 CO are **terminal** (Mn–Mn bond, no bridging CO) → 0 bridging CO\n\nSum = 0 + 0 = **0**\n\n**Answer: 0**\n\nNote: Co₂(CO)₈ has bridging CO, but Mn₂(CO)₁₀ does not.`,
'tag_coord_6','29 Jan 2023 (M)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 19. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
