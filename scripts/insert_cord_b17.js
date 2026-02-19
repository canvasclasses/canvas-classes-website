// insert_cord_b17.js — CORD-161 to CORD-170
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
mk('CORD-161','Hard','NVT',
`Consider the following metal complexes:\n$[\\mathrm{Co(NH_3)_6}]^{3+}$, $[\\mathrm{CoCl(NH_3)_5}]^{2+}$, $[\\mathrm{Co(CN)_6}]^{3-}$, $[\\mathrm{Co(NH_3)_5(H_2O)}]^{3+}$\nThe spin-only magnetic moment value of the complex that absorbs light with shortest wavelength is ____ B.M. (Nearest integer)`,
[],0,
`Shortest wavelength = highest energy = largest Δ₀ = strongest field ligand.\n\nField strength comparison:\n- [Co(CN)₆]³⁻: CN⁻ is the strongest field ligand → **largest Δ₀** → absorbs shortest λ\n\n[Co(CN)₆]³⁻: Co³⁺ d⁶, CN⁻ strong field → low-spin → $t_{2g}^6 e_g^0$ → **0 unpaired** → μ = 0 BM\n\n**Answer: 0**`,
'tag_coord_3','25 Jul 2022 (M)'),

mk('CORD-162','Medium','SCQ',
`The correct order of energy of absorption for the following metal complexes is:\nA: $[\\mathrm{Ni(en)_3}]^{2+}$, B: $[\\mathrm{Ni(NH_3)_6}]^{2+}$, C: $[\\mathrm{Ni(H_2O)_6}]^{2+}$`,
scq([`C < B < A`,`B < C < A`,`C < A < B`,`A < C < B`],1),null,
`Higher field strength → larger Δ₀ → higher energy of absorption.\n\nField strength: H₂O < NH₃ < en\n\nEnergy order: C (H₂O) < B (NH₃) < A (en)\n\n**Answer: (1) C < B < A**`,
'tag_coord_3','25 Jul 2022 (E)'),

mk('CORD-163','Hard','NVT',
`$[\\mathrm{Fe(CN)_6}]^{3-}$ should be an inner orbital complex. Ignoring the pairing energy, the value of crystal field stabilization energy for this complex is $(-)\\_\\_\\_\\_\\ \\Delta_0$.`,
[],2,
`[Fe(CN)₆]³⁻: Fe³⁺ d⁵, CN⁻ strong field → low-spin (inner orbital, d²sp³)\n\nLow-spin d⁵: $t_{2g}^5 e_g^0$\n\nCFSE = 5 × (−0.4Δ₀) = **−2.0Δ₀**\n\nIgnoring pairing energy: CFSE = −2.0Δ₀\n\nAnswer is the magnitude: **2** (i.e., −2.0Δ₀)\n\n**Answer: 2**`,
'tag_coord_3','29 Jul 2022 (M)'),

mk('CORD-164','Hard','SCQ',
`Transition metal complex with highest value of crystal field splitting (Δ₀) will be:`,
scq([`$[\\mathrm{Mo(H_2O)_6}]^{3+}$`,`$[\\mathrm{Cr(H_2O)_6}]^{3+}$`,`$[\\mathrm{Os(H_2O)_6}]^{3+}$`,`$[\\mathrm{Fe(H_2O)_6}]^{3+}$`],3),null,
`For the same ligand and same charge, Δ₀ increases going down a group:\n3d < 4d < 5d\n\n- Cr (3d): lowest Δ₀\n- Mo (4d): intermediate\n- Os (5d): **highest Δ₀** ✓\n- Fe (3d): low\n\nReason: 5d orbitals are more diffuse → greater overlap with ligands → larger splitting.\n\n**Answer: (3) [Os(H₂O)₆]³⁺**`,
'tag_coord_3','24 Jun 2022 (E)'),

mk('CORD-165','Hard','NVT',
`If $[\\mathrm{Cu(H_2O)_4}]^{2+}$ absorbs a light of wavelength 600 nm for d-d transition, then the value of octahedral crystal field splitting energy for $[\\mathrm{Cu(H_2O)_6}]^{2+}$ will be ____ $\\times 10^{-21}$ J (Nearest integer)\n(Given: h = 6.63 × 10⁻³⁴ Js and c = 3.08 × 10⁸ ms⁻¹)`,
[],331,
`$\\Delta_0 = \\frac{hc}{\\lambda} = \\frac{6.63 \\times 10^{-34} \\times 3.08 \\times 10^8}{600 \\times 10^{-9}}$\n\n$= \\frac{2.042 \\times 10^{-25}}{6 \\times 10^{-7}} = 3.31 \\times 10^{-19}$ J\n\nIn units of 10⁻²¹ J: $3.31 \\times 10^{-19} = 331 \\times 10^{-21}$\n\n**Answer: 331**`,
'tag_coord_3','25 Jun 2022 (M)'),

mk('CORD-166','Hard','NVT',
`Reaction of $[\\mathrm{Co(H_2O)_6}]^{2+}$ with excess ammonia and in the presence of oxygen results into a diamagnetic product. Number of electrons present in $t_{2g}$-orbitals of the product is ____`,
[],6,
`[Co(H₂O)₆]²⁺ + excess NH₃ + O₂ → oxidation of Co²⁺ to Co³⁺\n\nProduct: [Co(NH₃)₆]³⁺\n\nCo³⁺ d⁶, NH₃ strong field → low-spin → $t_{2g}^6 e_g^0$\n\n**Diamagnetic** ✓ (0 unpaired)\n\nElectrons in t₂g = **6**\n\n**Answer: 6**`,
'tag_coord_3','26 Jun 2022 (E)'),

mk('CORD-167','Medium','SCQ',
`Which one of the following complexes is violet in colour?`,
scq([`$\\mathrm{Fe_4[Fe(CN)_6]_3 \\cdot H_2O}$`,`$[\\mathrm{Fe(CN)_5NOS}]^{4-}$`,`$[\\mathrm{Fe(SCN)_6}]^{4-}$`,`$[\\mathrm{Fe(CN)_6}]^{4-}$`],2),null,
`- Fe₄[Fe(CN)₆]₃·H₂O: **Prussian blue**\n- **[Fe(CN)₅NOS]⁴⁻**: sodium nitroprusside reacts with S²⁻ → **violet/purple** ✓\n- [Fe(SCN)₆]⁴⁻: blood red\n- [Fe(CN)₆]⁴⁻: yellow (potassium ferrocyanide solution)\n\n**Answer: (2) [Fe(CN)₅NOS]⁴⁻**`,
'tag_coord_2','26 Aug 2021 (M)'),

mk('CORD-168','Hard','SCQ',
`Arrange the following Cobalt complexes in the order of increasing Crystal Field Stabilization Energy (CFSE) value:\nA: $[\\mathrm{CoF_6}]^{3-}$  B: $[\\mathrm{Co(H_2O)_6}]^{2+}$  C: $[\\mathrm{Co(NH_3)_6}]^{3+}$  D: $[\\mathrm{Co(en)_3}]^{3+}$`,
scq([`B < C < D < A`,`B < A < C < D`,`A < B < C < D`,`C < D < B < A`],3),null,
`CFSE depends on Δ₀ (larger Δ₀ → more negative CFSE).\n\nField strength: F⁻ < H₂O < NH₃ < en\nAlso Co³⁺ > Co²⁺ for same ligand.\n\n- A. [CoF₆]³⁻: Co³⁺, F⁻ weak → high-spin d⁶ → CFSE = −0.4Δ₀ (small)\n- B. [Co(H₂O)₆]²⁺: Co²⁺, H₂O → high-spin d⁷ → CFSE = −0.8Δ₀ (small Δ₀)\n- C. [Co(NH₃)₆]³⁺: Co³⁺, NH₃ strong → low-spin d⁶ → CFSE = −2.4Δ₀\n- D. [Co(en)₃]³⁺: Co³⁺, en strongest → low-spin d⁶ → CFSE = largest magnitude\n\nIncreasing CFSE (least to most negative): A < B < C < D\n\n**Answer: (3) A < B < C < D**`,
'tag_coord_3','26 Aug 2021 (E)'),

mk('CORD-169','Medium','SCQ',
`Acidic ferric chloride solution on treatment with excess of potassium ferrocyanide gives a Prussian blue coloured colloidal species. It is:`,
scq([`HFe[Fe(CN)₆]`,`K₅Fe[Fe(CN)₆]₂`,`Fe₄[Fe(CN)₆]₃`,`KFe[Fe(CN)₆]`],4),null,
`With **excess** K₄[Fe(CN)₆] (potassium ferrocyanide) and FeCl₃:\n\nThe colloidal Prussian blue formed with excess ferrocyanide is **KFe[Fe(CN)₆]** (soluble Prussian blue / Turnbull's blue variant).\n\nWith stoichiometric amounts: Fe₄[Fe(CN)₆]₃\nWith excess ferrocyanide: **KFe[Fe(CN)₆]** (colloidal)\n\n**Answer: (4) KFe[Fe(CN)₆]**`,
'tag_coord_7','27 Aug 2021 (M)'),

mk('CORD-170','Hard','SCQ',
`The correct order of intensity of colors of the compounds is:`,
scq([`$[\\mathrm{Ni(CN)_4}]^{2-} > [\\mathrm{NiCl_4}]^{2-} > [\\mathrm{Ni(H_2O)_6}]^{2+}$`,`$[\\mathrm{Ni(H_2O)_6}]^{2+} > [\\mathrm{NiCl_4}]^{2-} > [\\mathrm{Ni(CN)_4}]^{2-}$`,`$[\\mathrm{NiCl_4}]^{2-} > [\\mathrm{Ni(H_2O)_6}]^{2+} > [\\mathrm{Ni(CN)_4}]^{2-}$`,`$[\\mathrm{NiCl_4}]^{2-} > [\\mathrm{Ni(CN)_4}]^{2-} > [\\mathrm{Ni(H_2O)_6}]^{2+}$`],3),null,
`Color intensity in d-d transitions:\n- **Tetrahedral** complexes are more intensely colored than octahedral (Laporte rule relaxed)\n- **Square planar** d⁸ with strong field → no d-d transition possible → colorless/very pale\n\n- [NiCl₄]²⁻: **tetrahedral** → most intense color ✓\n- [Ni(H₂O)₆]²⁺: **octahedral** → moderate color\n- [Ni(CN)₄]²⁻: **square planar**, all electrons paired → no d-d transition → least intense (nearly colorless)\n\nOrder: [NiCl₄]²⁻ > [Ni(H₂O)₆]²⁺ > [Ni(CN)₄]²⁻\n\n**Answer: (3)**`,
'tag_coord_2','20 Jul 2021 (M)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 17. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
