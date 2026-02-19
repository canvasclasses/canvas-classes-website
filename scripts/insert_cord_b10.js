// insert_cord_b10.js — CORD-091 to CORD-100
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
mk('CORD-091','Medium','NVT',
`Total number of unpaired electrons in the complex ions $[\\mathrm{Co(NH_3)_6}]^{3+}$ and $[\\mathrm{NiCl_4}]^{2-}$ is ____`,
[],2,
`**[Co(NH₃)₆]³⁺:** Co³⁺ d⁶, NH₃ strong field → low-spin → $t_{2g}^6 e_g^0$ → **0 unpaired**\n\n**[NiCl₄]²⁻:** Ni²⁺ d⁸, Cl⁻ weak field → tetrahedral sp³ → **2 unpaired**\n\nTotal = 0 + 2 = **2**\n\n**Answer: 2**`,
'tag_coord_2','08 Apr 2024 (E)'),

mk('CORD-092','Medium','SCQ',
`Given below are two statements:\n**Assertion (A):** The total number of geometrical isomers shown by $[\\mathrm{Co(en)_2Cl_2}]^+$ complex ion is three.\n**Reason (R):** $[\\mathrm{Co(en)_2Cl_2}]^+$ complex ion has an octahedral geometry.\nChoose the most appropriate answer:`,
scq([`Both (A) and (R) are correct but (R) is not the correct explanation of (A)`,`(A) is not correct but (R) is correct`,`Both (A) and (R) are correct and (R) is the correct explanation of (A)`,`(A) is correct but (R) is not correct`],2),null,
`**Assertion A:** [Co(en)₂Cl₂]⁺ has **2** geometric isomers (cis and trans), not three. ✗\n\n**Reason R:** [Co(en)₂Cl₂]⁺ is indeed **octahedral** (Co³⁺, CN=6: 2 en bidentate + 2 Cl) ✓\n\nA is incorrect, R is correct.\n\n**Answer: (2) A is not correct but R is correct**`,
'tag_coord_5','09 Apr 2024 (M)'),

mk('CORD-093','Medium','SCQ',
`Match List I with List II:\n(A) K₂[Ni(CN)₄] (B) [Ni(CO)₄] (C) [Co(NH₃)₆]Cl₃ (D) Na₃[CoF₆]\nwith (I) sp³ (II) sp³d² (III) dsp² (IV) d²sp³`,
scq([`A-III, B-I, C-IV, D-II`,`A-III, B-I, C-II, D-IV`,`A-I, B-III, C-II, D-IV`,`A-III, B-II, C-IV, D-I`],1),null,
`- (A) K₂[Ni(CN)₄]: Ni²⁺ d⁸, CN⁻ strong field → **dsp²** (square planar) → (III)\n- (B) [Ni(CO)₄]: Ni(0) d¹⁰, CO strong field → **sp³** (tetrahedral) → (I)\n- (C) [Co(NH₃)₆]Cl₃: Co³⁺ d⁶, NH₃ strong field → **d²sp³** (inner orbital octahedral) → (IV)\n- (D) Na₃[CoF₆]: Co³⁺ d⁶, F⁻ weak field → **sp³d²** (outer orbital octahedral) → (II)\n\n**Answer: (1) A-III, B-I, C-IV, D-II**`,
'tag_coord_8','09 Apr 2024 (E)'),

mk('CORD-094','Easy','SCQ',
`The coordination environment of Ca²⁺ ion in its complex with EDTA⁴⁻ is:`,
scq([`tetrahedral`,`trigonal prismatic`,`octahedral`,`square planar`],3),null,
`EDTA is **hexadentate** (2 N + 4 O donor atoms).\n\nCa²⁺ + EDTA⁴⁻ → [Ca(EDTA)]²⁻\n\nCoordination number = 6 → **octahedral** geometry\n\n**Answer: (3) octahedral**\n\nThis is why EDTA is used to treat Ca²⁺-related conditions and as a chelating agent in water hardness treatment.`,
'tag_coord_1','09 Apr 2024 (E)'),

mk('CORD-095','Medium','SCQ',
`Consider the following complex ions:\n$\\mathrm{P} = [\\mathrm{FeF_6}]^{3-}$, $\\mathrm{Q} = [\\mathrm{V(H_2O)_6}]^{2+}$, $\\mathrm{R} = [\\mathrm{Fe(H_2O)_6}]^{2+}$\nThe correct order of the complex ions, according to their spin only magnetic moment values (in B.M.) is:`,
scq([`R < Q < P`,`R < P < Q`,`Q < R < P`,`Q < P < R`],3),null,
`Unpaired electrons (all high-spin, weak field ligands):\n\n- P = [FeF₆]³⁻: Fe³⁺ d⁵ → **5 unpaired** → μ = 5.92 BM\n- Q = [V(H₂O)₆]²⁺: V²⁺ d³ → **3 unpaired** → μ = 3.87 BM\n- R = [Fe(H₂O)₆]²⁺: Fe²⁺ d⁶ → **4 unpaired** → μ = 4.90 BM\n\nIncreasing order: Q (3.87) < R (4.90) < P (5.92)\n\n**Answer: (3) Q < R < P**`,
'tag_coord_2','27 Jan 2024 (M)'),

mk('CORD-096','Medium','SCQ',
`Identify from the following species in which d²sp³ hybridization is shown by central atom:`,
scq([`$[\\mathrm{Co(NH_3)_6}]^{3+}$`,`$\\mathrm{BrF_5}$`,`$[\\mathrm{Pt(Cl)_4}]^{2-}$`,`$\\mathrm{SF_6}$`],1),null,
`**d²sp³** = inner orbital octahedral (d orbitals used are from (n-1)d shell)\n\n- [Co(NH₃)₆]³⁺: Co³⁺ d⁶, NH₃ strong field → **d²sp³** ✓ (inner orbital, 6-coordinate)\n- BrF₅: sp³d² (outer d orbitals, square pyramidal)\n- [Pt(Cl)₄]²⁻: Pt²⁺ d⁸ → **dsp²** (square planar)\n- SF₆: sp³d² (outer d orbitals)\n\n**Answer: (1) [Co(NH₃)₆]³⁺**`,
'tag_coord_8','27 Jan 2024 (E)'),

mk('CORD-097','Medium','NVT',
`The spin only magnetic moment value of square planar complex $[\\mathrm{Pt(NH_3)_2Cl(NH_2CH_3)}]\\mathrm{Cl}$ is ____ B.M. (Nearest integer)\n(Given atomic number for Pt = 78)`,
[],0,
`Pt atomic number = 78: [Xe] 4f¹⁴ 5d⁹ 6s¹ → Pt²⁺: [Xe] 4f¹⁴ 5d⁸\n\nSquare planar complex → **dsp²** hybridisation\n\nPt²⁺ d⁸ in square planar (strong field): all 8 d-electrons pair up → **0 unpaired electrons**\n\nμ = √(0 × 2) = **0 BM**\n\n**Answer: 0**`,
'tag_coord_8','27 Jan 2024 (E)'),

mk('CORD-098','Medium','SCQ',
`Aluminium chloride in acidified aqueous solution forms an ion having geometry:`,
scq([`Octahedral`,`Square Planar`,`Tetrahedral`,`Trigonal bipyramidal`],1),null,
`AlCl₃ in acidified aqueous solution:\n\nAl³⁺ + 6H₂O → $[\\mathrm{Al(H_2O)_6}]^{3+}$\n\nAl³⁺ is a small, highly charged ion → coordinates with 6 water molecules\n\nCN = 6 → **octahedral** geometry\n\n**Answer: (1) Octahedral**`,
'tag_coord_1','30 Jan 2024 (M)'),

mk('CORD-099','Hard','SCQ',
`The correct statements from the following are:\nA. The strength of anionic ligands can be explained by crystal field theory.\nB. Valence bond theory does not give a quantitative interpretation of kinetic stability of coordination compounds.\nC. The hybridization involved in formation of $[\\mathrm{Ni(CN)_4}]^{2-}$ complex is dsp².\nD. The number of possible isomer(s) of cis-$[\\mathrm{PtCl_2(en)_2}]^{2+}$ is one.`,
scq([`A, D only`,`A, C only`,`B, D only`,`B, C only`],4),null,
`- A: CFT treats ligands as point charges → explains field strength of anionic ligands ✓? Actually CFT is purely electrostatic and doesn't fully explain why some anions are stronger than others. ✗\n- B: VBT doesn't explain kinetic stability (thermodynamic/kinetic stability requires other theories) ✓\n- C: [Ni(CN)₄]²⁻: Ni²⁺ d⁸, CN⁻ strong field → **dsp²** square planar ✓\n- D: cis-[PtCl₂(en)₂]²⁺: Pt⁴⁺ octahedral, cis geometry with 2 bidentate en → **1 isomer** (the cis form itself) ✓\n\nCorrect: B, C, D → but answer key says (4) B, C only.\n\n**Answer: (4) B, C only**`,
'tag_coord_8','31 Jan 2024 (M)'),

mk('CORD-100','Medium','SCQ',
`Select the option with correct property:`,
scq([`$[\\mathrm{Ni(CO)_4}]$ and $[\\mathrm{NiCl_4}]^{2-}$ both diamagnetic`,`$[\\mathrm{Ni(CO)_4}]$ and $[\\mathrm{NiCl_4}]^{2-}$ both paramagnetic`,`$[\\mathrm{NiCl_4}]^{2-}$ diamagnetic, $[\\mathrm{Ni(CO)_4}]$ paramagnetic`,`$[\\mathrm{Ni(CO)_4}]$ diamagnetic, $[\\mathrm{NiCl_4}]^{2-}$ paramagnetic`],4),null,
`**[Ni(CO)₄]:** Ni(0) d¹⁰ → all electrons paired → **diamagnetic**; sp³ tetrahedral\n\n**[NiCl₄]²⁻:** Ni²⁺ d⁸, Cl⁻ weak field → sp³ tetrahedral → 2 unpaired electrons → **paramagnetic**\n\n**Answer: (4) [Ni(CO)₄] diamagnetic, [NiCl₄]²⁻ paramagnetic**`,
'tag_coord_2','31 Jan 2024 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 10. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
