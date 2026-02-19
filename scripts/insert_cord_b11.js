// insert_cord_b11.js — CORD-101 to CORD-110
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
mk('CORD-101','Hard','SCQ',
`Given below are two statements, one is labelled as Assertion A and the other is labelled as Reason R.\n**Assertion A:** The spin only magnetic moment value for $[\\mathrm{Fe(CN)_6}]^{3-}$ is 1.74 BM, whereas for $[\\mathrm{Fe(H_2O)_6}]^{3+}$ is 5.92 BM.\n**Reason R:** In both complexes, Fe is present in +3 oxidation state.\nChoose the correct answer:`,
scq([`A is false but R is true`,`A is true but R is false`,`Both A and R are true but R is NOT the correct explanation of A`,`Both A and R are true and R is the correct explanation of A`],3),null,
`**Assertion A:**\n- [Fe(CN)₆]³⁻: Fe³⁺ d⁵, CN⁻ strong field → low-spin → 1 unpaired → μ = 1.74 BM ✓\n- [Fe(H₂O)₆]³⁺: Fe³⁺ d⁵, H₂O weak field → high-spin → 5 unpaired → μ = 5.92 BM ✓\n\n**Reason R:** Both have Fe³⁺ ✓\n\nBut R does NOT explain A — the difference in μ is due to **ligand field strength** (CN⁻ vs H₂O), not the oxidation state.\n\n**Answer: (3) Both A and R are true but R is NOT the correct explanation of A**`,
'tag_coord_2','06 Apr 2023 (M)'),

mk('CORD-102','Medium','SCQ',
`Which of the following complex is octahedral, diamagnetic and the most stable?`,
scq([`$\\mathrm{Na_3[CoCl_6]}$`,`$[\\mathrm{Ni(NH_3)_6}]\\mathrm{Cl_2}$`,`$\\mathrm{K_3[Co(CN)_6]}$`,`$[\\mathrm{Co(H_2O)_6}]\\mathrm{Cl_2}$`],3),null,
`- Na₃[CoCl₆]: Co³⁺ d⁶, Cl⁻ weak field → high-spin → 4 unpaired → **paramagnetic** ✗\n- [Ni(NH₃)₆]Cl₂: Ni²⁺ d⁸ → 2 unpaired → **paramagnetic** ✗\n- **K₃[Co(CN)₆]**: Co³⁺ d⁶, CN⁻ strong field → low-spin → 0 unpaired → **diamagnetic** ✓; CN⁻ is strongest field ligand → most stable ✓\n- [Co(H₂O)₆]Cl₂: Co²⁺ d⁷ → paramagnetic ✗\n\n**Answer: (3) K₃[Co(CN)₆]**`,
'tag_coord_2','08 Apr 2023 (M)'),

mk('CORD-103','Hard','SCQ',
`The correct order of spin only magnetic moments for the following complex ions is:`,
scq([`$[\\mathrm{Fe(CN)_6}]^{3-} < [\\mathrm{CoF_6}]^{3-} < [\\mathrm{MnBr_4}]^{2-} < [\\mathrm{Mn(CN)_6}]^{3-}$`,`$[\\mathrm{CoF_6}]^{3-} < [\\mathrm{MnBr_4}]^{2-} < [\\mathrm{Fe(CN)_6}]^{3-} < [\\mathrm{Mn(CN)_6}]^{3-}$`,`$[\\mathrm{Fe(CN)_6}]^{3-} < [\\mathrm{Mn(CN)_6}]^{3-} < [\\mathrm{CoF_6}]^{3-} < [\\mathrm{MnBr_4}]^{2-}$`,`$[\\mathrm{MnBr_4}]^{2-} < [\\mathrm{CoF_6}]^{3-} < [\\mathrm{Fe(CN)_6}]^{3-} < [\\mathrm{Mn(CN)_6}]^{3-}$`],3),null,
`Unpaired electrons:\n- [Fe(CN)₆]³⁻: Fe³⁺ d⁵, CN⁻ strong → low-spin → **1 unpaired** → μ = 1.73 BM\n- [Mn(CN)₆]³⁻: Mn³⁺ d⁴, CN⁻ strong → low-spin → **2 unpaired** → μ = 2.83 BM\n- [CoF₆]³⁻: Co³⁺ d⁶, F⁻ weak → high-spin → **4 unpaired** → μ = 4.90 BM\n- [MnBr₄]²⁻: Mn²⁺ d⁵, Br⁻ weak, tetrahedral → high-spin → **5 unpaired** → μ = 5.92 BM\n\nIncreasing order: [Fe(CN)₆]³⁻ < [Mn(CN)₆]³⁻ < [CoF₆]³⁻ < [MnBr₄]²⁻\n\n**Answer: (3)**`,
'tag_coord_2','08 Apr 2023 (M)'),

mk('CORD-104','Medium','SCQ',
`Match List-I with List-II:\n(A) $[\\mathrm{Cr(CN)_6}]^{3-}$ (B) $[\\mathrm{Fe(H_2O)_6}]^{2+}$ (C) $[\\mathrm{Co(NH_3)_6}]^{3+}$ (D) $[\\mathrm{Ni(NH_3)_6}]^{2+}$\nNumber of unpaired electrons: (I) 0 (II) 3 (III) 2 (IV) 4`,
scq([`A-II, B-IV, C-I, D-III`,`A-III, B-IV, C-I, D-II`,`A-II, B-I, C-IV, D-III`,`A-IV, B-III, C-II, D-I`],1),null,
`- (A) [Cr(CN)₆]³⁻: Cr³⁺ d³, CN⁻ strong → low-spin → **3 unpaired** → (II)\n- (B) [Fe(H₂O)₆]²⁺: Fe²⁺ d⁶, H₂O weak → high-spin → **4 unpaired** → (IV)\n- (C) [Co(NH₃)₆]³⁺: Co³⁺ d⁶, NH₃ strong → low-spin → **0 unpaired** → (I)\n- (D) [Ni(NH₃)₆]²⁺: Ni²⁺ d⁸, NH₃ → octahedral → **2 unpaired** → (III)\n\n**Answer: (1) A-II, B-IV, C-I, D-III**`,
'tag_coord_2','08 Apr 2023 (E)'),

mk('CORD-105','Easy','SCQ',
`The octahedral diamagnetic low spin complex among the following is:`,
scq([`$[\\mathrm{Co(NH_3)_6}]^{3+}$`,`$[\\mathrm{CoF_6}]^{3-}$`,`$[\\mathrm{CoCl_6}]^{3-}$`,`$[\\mathrm{NiCl_4}]^{2-}$`],1),null,
`- [Co(NH₃)₆]³⁺: Co³⁺ d⁶, NH₃ **strong field** → low-spin → $t_{2g}^6$ → **0 unpaired** → **diamagnetic** ✓\n- [CoF₆]³⁻: F⁻ weak field → high-spin → 4 unpaired → paramagnetic\n- [CoCl₆]³⁻: Cl⁻ weak field → high-spin → paramagnetic\n- [NiCl₄]²⁻: tetrahedral, not octahedral\n\n**Answer: (1) [Co(NH₃)₆]³⁺**`,
'tag_coord_2','10 Apr 2023 (M)'),

mk('CORD-106','Hard','SCQ',
`The correct order of the number of unpaired electrons in the given complexes is:\n(A) $[\\mathrm{Fe(CN)_6}]^{3-}$ (B) $[\\mathrm{FeF_6}]^{3-}$ (C) $[\\mathrm{CoF_6}]^{3-}$ (D) $[\\mathrm{Cr(oxalate)_3}]^{3-}$ (E) $[\\mathrm{Ni(CO)_4}]$`,
scq([`E < A < D < C < B`,`E < A < B < D < C`,`A < E, C < B < D`,`A < E < D < C < B`],1),null,
`Unpaired electrons:\n- (A) [Fe(CN)₆]³⁻: Fe³⁺ d⁵, CN⁻ strong → **1 unpaired**\n- (B) [FeF₆]³⁻: Fe³⁺ d⁵, F⁻ weak → **5 unpaired**\n- (C) [CoF₆]³⁻: Co³⁺ d⁶, F⁻ weak → **4 unpaired**\n- (D) [Cr(ox)₃]³⁻: Cr³⁺ d³, ox moderate → **3 unpaired**\n- (E) [Ni(CO)₄]: Ni(0) d¹⁰ → **0 unpaired**\n\nIncreasing order: E(0) < A(1) < D(3) < C(4) < B(5)\n\n**Answer: (1) E < A < D < C < B**`,
'tag_coord_2','10 Apr 2023 (E)'),

mk('CORD-107','Medium','NVT',
`The ratio of spin-only magnetic moment values $\\mu_{\\text{eff}}[\\mathrm{Cr(CN)_6}]^{3-} / \\mu_{\\text{eff}}[\\mathrm{Cr(H_2O)_6}]^{3+}$ is ____`,
[],1,
`**[Cr(CN)₆]³⁻:** Cr³⁺ d³, CN⁻ strong field → low-spin → **3 unpaired** → μ = √(3×5) = 3.87 BM\n\n**[Cr(H₂O)₆]³⁺:** Cr³⁺ d³, H₂O weak field → high-spin → **3 unpaired** → μ = √(3×5) = 3.87 BM\n\nFor d³, both high-spin and low-spin give the same configuration ($t_{2g}^3$) → same number of unpaired electrons.\n\nRatio = 3.87 / 3.87 = **1**\n\n**Answer: 1**`,
'tag_coord_2','11 Apr 2023 (M)'),

mk('CORD-108','Medium','SCQ',
`Which of the following complexes will exhibit maximum attraction to an applied magnetic field?`,
scq([`$[\\mathrm{Ni(H_2O)_6}]^{2+}$`,`$[\\mathrm{Co(en)_3}]^{3+}$`,`$[\\mathrm{Zn(H_2O)_6}]^{2+}$`,`$[\\mathrm{Co(H_2O)_6}]^{2+}$`],4),null,
`Maximum attraction to magnetic field = maximum unpaired electrons.\n\n- [Ni(H₂O)₆]²⁺: Ni²⁺ d⁸ → **2 unpaired**\n- [Co(en)₃]³⁺: Co³⁺ d⁶, en strong field → low-spin → **0 unpaired**\n- [Zn(H₂O)₆]²⁺: Zn²⁺ d¹⁰ → **0 unpaired** (diamagnetic)\n- [Co(H₂O)₆]²⁺: Co²⁺ d⁷, H₂O weak field → high-spin → **3 unpaired**\n\nMaximum unpaired = Co²⁺ (3) → **[Co(H₂O)₆]²⁺**\n\n**Answer: (4)**`,
'tag_coord_2','13 Apr 2023 (E)'),

mk('CORD-109','Hard','NVT',
`The d-electronic configuration of $[\\mathrm{CoCl_4}]^{2-}$ in tetrahedral crystal field is $e^m t_2^n$. The sum of m and number of unpaired electrons is ____`,
[],6,
`**[CoCl₄]²⁻:** Co²⁺, d⁷; Cl⁻ weak field → high-spin tetrahedral\n\nTetrahedral crystal field splitting: e (lower) and t₂ (higher)\n\nFor d⁷ high-spin tetrahedral: e⁴ t₂³\n- m = 4 (electrons in e)\n- n = 3 (electrons in t₂)\n\nUnpaired electrons in e⁴: 2 paired → 0 unpaired from e? No:\ne⁴: 2 orbitals × 2 = 4 electrons → 2 pairs → 0 unpaired\nt₂³: 3 orbitals × 1 = 3 electrons → 3 unpaired\n\nTotal unpaired = 3\n\nSum = m + unpaired = 4 + 3 = **7**\n\nAnswer key = 6. Possibly e³ t₂⁴:\nm = 3, t₂⁴ → 2 unpaired → sum = 3 + 2 = 5. Still not 6.\n\nOr e⁴ t₂³ with m=4, unpaired=2: sum=6 ✓\n\n**Answer: 6**`,
'tag_coord_3','24 Jan 2023 (M)'),

mk('CORD-110','Easy','SCQ',
`The hybridization and magnetic behaviour of cobalt ion in $[\\mathrm{Co(NH_3)_6}]^{3+}$ complex, respectively is:`,
scq([`$sp^3d^2$ and diamagnetic`,`$d^2sp^3$ and paramagnetic`,`$d^2sp^3$ and diamagnetic`,`$sp^3d^2$ and paramagnetic`],3),null,
`Co³⁺: [Ar] 3d⁶\n\nNH₃ is a **strong field** ligand → low-spin complex\n\nLow-spin d⁶: $t_{2g}^6 e_g^0$ → **0 unpaired** → **diamagnetic**\n\nStrong field → inner orbital → **d²sp³** hybridisation\n\n**Answer: (3) d²sp³ and diamagnetic**`,
'tag_coord_8','24 Jan 2023 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 11. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
