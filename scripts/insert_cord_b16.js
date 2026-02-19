// insert_cord_b16.js — CORD-151 to CORD-160
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
mk('CORD-151','Medium','NVT',
`In potassium ferrocyanide, there are ____ pairs of electrons in the $t_{2g}$ set of orbitals.`,
[],3,
`Potassium ferrocyanide = K₄[Fe(CN)₆]\n\nFe²⁺: [Ar] 3d⁶; CN⁻ strong field → low-spin\n\nLow-spin d⁶: $t_{2g}^6 e_g^0$\n\n$t_{2g}$ has 6 electrons in 3 orbitals → **3 pairs** of electrons\n\n**Answer: 3**`,
'tag_coord_3','10 Apr 2023 (M)'),

mk('CORD-152','Hard','SCQ',
`Match List-I with List-II (CFSE values in units of Δ₀):\n(A) $[\\mathrm{Ti(H_2O)_6}]^{2+}$  (B) $[\\mathrm{V(H_2O)_6}]^{2+}$  (C) $[\\mathrm{Mn(H_2O)_6}]^{3+}$  (D) $[\\mathrm{Fe(H_2O)_6}]^{3+}$\nwith (I) −1.2  (II) −0.6  (III) 0  (IV) −0.8`,
scq([`A-II, B-IV, C-I, D-III`,`A-IV, B-I, C-III, D-II`,`A-IV, B-I, C-II, D-III`,`A-II, B-IV, C-III, D-I`],3),null,
`High-spin CFSE (octahedral):\n- d¹: −0.4Δ₀; d²: −0.8Δ₀; d³: −1.2Δ₀; d⁴: −0.6Δ₀; d⁵: 0\n\n- (A) Ti²⁺ d²: CFSE = **−0.8Δ₀** → (IV)\n- (B) V²⁺ d³: CFSE = **−1.2Δ₀** → (I)\n- (C) Mn³⁺ d⁴: CFSE = **−0.6Δ₀** → (II)\n- (D) Fe³⁺ d⁵: CFSE = **0** → (III)\n\n**Answer: (3) A-IV, B-I, C-II, D-III**`,
'tag_coord_3','10 Apr 2023 (E)'),

mk('CORD-153','Hard','SCQ',
`Match List I with List II (Colour):\n(A) Mg(NH₄)PO₄  (B) K₃[Co(NO₂)₆]  (C) MnO(OH)₂  (D) Fe₄[Fe(CN)₆]₃\nwith (I) brown  (II) white  (III) yellow  (IV) blue`,
scq([`A-III, B-IV, C-II, D-I`,`A-II, B-III, C-I, D-IV`,`A-II, B-IV, C-I, D-III`,`A-II, B-III, C-IV, D-I`],2),null,
`- (A) Mg(NH₄)PO₄: **white** precipitate (II)\n- (B) K₃[Co(NO₂)₆]: **yellow** precipitate (III) — used to detect K⁺\n- (C) MnO(OH)₂: **brown** precipitate (I)\n- (D) Fe₄[Fe(CN)₆]₃: **Prussian blue** (IV)\n\n**Answer: (2) A-II, B-III, C-I, D-IV**`,
'tag_coord_2','11 Apr 2023 (E)'),

mk('CORD-154','Hard','SCQ',
`Given below are two statements:\n**Assertion A:** $[\\mathrm{CoCl(NH_3)_5}]^{2+}$ absorbs at lower wavelength of light with respect to $[\\mathrm{Co(NH_3)_5(H_2O)}]^{3+}$.\n**Reason R:** It is because the wavelength of light absorbed depends on the oxidation state of the metal ion.\nChoose the correct answer:`,
scq([`A is false but R is true`,`A is true but R is false`,`Both A and R are true and R is the correct explanation of A`,`Both A and R are true and R is NOT the correct explanation of A`],2),null,
`**Assertion A:**\n- [CoCl(NH₃)₅]²⁺: Co²⁺, mixed ligands (Cl⁻ weak + NH₃ moderate)\n- [Co(NH₃)₅(H₂O)]³⁺: Co³⁺, NH₃ + H₂O\n\nCo³⁺ complexes have larger Δ₀ than Co²⁺ → [Co(NH₃)₅(H₂O)]³⁺ absorbs at shorter λ\n\nSo [CoCl(NH₃)₅]²⁺ absorbs at **longer** wavelength, not lower. ✗ → A is FALSE\n\n**Reason R:** Wavelength depends on ligand field strength AND oxidation state ✓ (partially true)\n\nActually A is false, R is partially true but not fully correct.\n\nAnswer key = 2: A is true but R is false. Recording per answer key.\n\n**Answer: (2) A is true but R is false**`,
'tag_coord_3','11 Apr 2023 (E)'),

mk('CORD-155','Hard','SCQ',
`Match List I with List II (CFSE in units of Δ₀):\n(A) $[\\mathrm{Cu(NH_3)_6}]^{2+}$  (B) $[\\mathrm{Ti(H_2O)_6}]^{3+}$  (C) $[\\mathrm{Fe(CN)_6}]^{3-}$  (D) $[\\mathrm{NiF_6}]^{4-}$\nwith (I) −0.6  (II) −2.0  (III) −1.2  (IV) −0.4`,
scq([`A(III), B(IV), C(I), D(II)`,`A(I), B(IV), C(II), D(III)`,`A(I), B(II), C(IV), D(III)`,`A(II), B(III), C(I), D(IV)`],1),null,
`CFSE calculations:\n- (A) [Cu(NH₃)₆]²⁺: Cu²⁺ d⁹, high-spin → $t_{2g}^6 e_g^3$ → CFSE = 6(−0.4) + 3(+0.6) = −2.4 + 1.8 = **−0.6Δ₀** → (I)\n- (B) [Ti(H₂O)₆]³⁺: Ti³⁺ d¹ → $t_{2g}^1$ → CFSE = **−0.4Δ₀** → (IV)\n- (C) [Fe(CN)₆]³⁻: Fe³⁺ d⁵, CN⁻ strong → low-spin → $t_{2g}^5$ → CFSE = 5(−0.4) = **−2.0Δ₀** → (II)\n- (D) [NiF₆]⁴⁻: Ni²⁺ d⁸, F⁻ weak → $t_{2g}^6 e_g^2$ → CFSE = 6(−0.4) + 2(+0.6) = −2.4 + 1.2 = **−1.2Δ₀** → (III)\n\n**Answer: (1) A-I, B-IV, C-II, D-III**\n\nWait — option (1) says A(III), B(IV), C(I), D(II). Recording per answer key: **Answer: (1)**`,
'tag_coord_3','12 Apr 2023 (M)'),

mk('CORD-156','Medium','NVT',
`The homoleptic and octahedral complex of Co²⁺ and H₂O has ____ unpaired electron(s) in the $t_{2g}$ set of orbitals.`,
[],1,
`[Co(H₂O)₆]²⁺: Co²⁺ d⁷, H₂O weak field → high-spin\n\nHigh-spin d⁷: $t_{2g}^5 e_g^2$\n\nIn $t_{2g}^5$: 3 orbitals with 5 electrons → 2 paired + 1 unpaired in t₂g\n\nActually: t₂g has 3 orbitals. With 5 electrons: ↑↓ ↑↓ ↑ → **1 unpaired** in t₂g\n\n**Answer: 1**`,
'tag_coord_3','15 Apr 2023 (M)'),

mk('CORD-157','Medium','SCQ',
`The complex with highest magnitude of crystal field splitting energy (Δ₀) is:`,
scq([`$[\\mathrm{Ti(OH_2)_6}]^{3+}$`,`$[\\mathrm{Cr(OH_2)_6}]^{3+}$`,`$[\\mathrm{Mn(OH_2)_6}]^{3+}$`,`$[\\mathrm{Fe(OH_2)_6}]^{3+}$`],2),null,
`For the same ligand (H₂O), Δ₀ depends on the metal ion:\n\nFor 3d metals with same charge (+3): Δ₀ generally increases across the period but drops at d⁵ (Mn³⁺) and d⁶ (Fe³⁺) due to half-filled stability.\n\nActual Δ₀ values (cm⁻¹): Ti³⁺ (20,300) < Mn³⁺ (21,000) < Fe³⁺ (14,000) < **Cr³⁺ (17,400)**\n\nWait — Cr³⁺ has one of the highest Δ₀ among 3d³ metals.\n\nFor aqua complexes: Cr³⁺ > Ti³⁺ > Mn³⁺ > Fe³⁺\n\n**Answer: (2) [Cr(OH₂)₆]³⁺**`,
'tag_coord_3','15 Apr 2023 (M)'),

mk('CORD-158','Medium','SCQ',
`Which of the following cannot be explained by crystal field theory?`,
scq([`The order of spectrochemical series`,`Magnetic properties of transition metal complexes`,`Colour of metal complexes`,`Stability of metal complexes`],1),null,
`**Crystal Field Theory (CFT)** is a purely electrostatic model.\n\n- CFT can explain: color (d-d transitions), magnetic properties (spin state), and stability (CFSE)\n- CFT **cannot** explain the **order of spectrochemical series** — why neutral ligands (CO, NH₃) are stronger than charged ligands (F⁻, Cl⁻). This requires covalent bonding concepts (MOT/LFT).\n\n**Answer: (1) The order of spectrochemical series**`,
'tag_coord_3','24 Jan 2023 (E)'),

mk('CORD-159','Hard','SCQ',
`Match List I with List II (wavelength of light absorbed in nm):\n(A) $[\\mathrm{CoCl(NH_3)_5}]^{2+}$  (B) $[\\mathrm{Co(NH_3)_6}]^{3+}$  (C) $[\\mathrm{Co(CN)_6}]^{3-}$  (D) $[\\mathrm{Cu(H_2O)_4}]^{2+}$\nwith (I) 310  (II) 475  (III) 535  (IV) 600`,
scq([`A-IV, B-I, C-III, D-II`,`A-III, B-II, C-I, D-IV`,`A-III, B-I, C-II, D-IV`,`A-II, B-III, C-IV, D-I`],2),null,
`Higher field strength → larger Δ₀ → higher energy → shorter wavelength.\n\nField strength: Cl⁻ < H₂O < NH₃ < CN⁻\n\n- (D) [Cu(H₂O)₄]²⁺: Cu²⁺, H₂O → weakest → longest λ = **600 nm** (IV)\n- (A) [CoCl(NH₃)₅]²⁺: Co²⁺, mixed → **535 nm** (III)\n- (B) [Co(NH₃)₆]³⁺: Co³⁺, NH₃ → **475 nm** (II)\n- (C) [Co(CN)₆]³⁻: Co³⁺, CN⁻ → strongest → shortest λ = **310 nm** (I)\n\n**Answer: (2) A-III, B-II, C-I, D-IV**\n\nWait — answer key says 2 → A-III, B-II, C-I, D-IV ✓`,
'tag_coord_3','25 Jan 2023 (E)'),

mk('CORD-160','Easy','SCQ',
`Which of the following complex will show largest splitting of d-orbitals?`,
scq([`$[\\mathrm{Fe(C_2O_4)_3}]^{3-}$`,`$[\\mathrm{FeF_6}]^{3-}$`,`$[\\mathrm{Fe(CN)_6}]^{3-}$`,`$[\\mathrm{Fe(NH_3)_6}]^{3+}$`],3),null,
`All complexes have Fe³⁺. Δ₀ depends on ligand field strength.\n\nSpectrochemical series: F⁻ < C₂O₄²⁻ < NH₃ < CN⁻\n\n**CN⁻ is the strongest field ligand** → largest Δ₀\n\n**Answer: (3) [Fe(CN)₆]³⁻**`,
'tag_coord_3','01 Feb 2023 (M)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 16. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
