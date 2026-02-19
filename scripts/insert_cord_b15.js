// insert_cord_b15.js — CORD-141 to CORD-150
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
mk('CORD-141','Medium','SCQ',
`The metal's d-orbitals that are directly facing the ligands in $\\mathrm{K_3[Co(CN)_6]}$ are:`,
scq([`$d_{xy}$, $d_{xz}$ and $d_{yz}$`,`$d_{x^2-y^2}$ and $d_{z^2}$`,`$d_{xy}$ and $d_{x^2-y^2}$`,`$d_{xz}$, $d_{yz}$ and $d_{z^2}$`],2),null,
`In an **octahedral** complex, ligands approach along the x, y, z axes.\n\nThe $e_g$ set orbitals point **directly at** the ligands:\n- $d_{x^2-y^2}$: lobes along x and y axes\n- $d_{z^2}$: lobes along z axis\n\nThe $t_{2g}$ set ($d_{xy}$, $d_{xz}$, $d_{yz}$) point **between** the ligands.\n\n**Answer: (2) $d_{x^2-y^2}$ and $d_{z^2}$**`,
'tag_coord_3','12 Jan 2019 (M)'),

mk('CORD-142','Medium','SCQ',
`The magnetic moment of an octahedral homoleptic Mn(II) complex is 5.9 B.M. The suitable ligand for this complex is:`,
scq([`CN⁻`,`CO`,`Ethylenediamine`,`NCS⁻`],4),null,
`Mn²⁺: d⁵; μ = 5.9 BM → **5 unpaired electrons** → **high-spin**\n\nHigh-spin requires a **weak field** ligand.\n\n- CN⁻: strong field → low-spin (1 unpaired) ✗\n- CO: strong field → low-spin ✗\n- en: strong field → low-spin ✗\n- **NCS⁻**: weak-to-moderate field → high-spin ✓\n\n**Answer: (4) NCS⁻**`,
'tag_coord_3','12 Jan 2019 (E)'),

mk('CORD-143','Hard','NVT',
`The number of complexes from the following with no electrons in the $t_2$ orbital is ____\n$\\mathrm{TiCl_4}$, $[\\mathrm{MnO_4}]^-$, $[\\mathrm{FeO_4}]^{2-}$, $[\\mathrm{FeCl_4}]^-$, $[\\mathrm{CoCl_4}]^{2-}$`,
[],2,
`These are **tetrahedral** complexes. In tetrahedral field: e (lower) and t₂ (higher).\n\nFor NO electrons in t₂, the metal must have d⁰ or d⁰ configuration (all electrons in e or none at all).\n\n- TiCl₄: Ti⁴⁺ d⁰ → **no electrons at all** → t₂ = 0 ✓\n- [MnO₄]⁻: Mn⁷⁺ d⁰ → **no electrons** → t₂ = 0 ✓\n- [FeO₄]²⁻: Fe⁶⁺ d² → e² t₂⁰ → t₂ = 0 ✓\n- [FeCl₄]⁻: Fe³⁺ d⁵ → e² t₂³ → t₂ ≠ 0 ✗\n- [CoCl₄]²⁻: Co²⁺ d⁷ → e⁴ t₂³ → t₂ ≠ 0 ✗\n\nTotal with t₂ = 0: TiCl₄, [MnO₄]⁻, [FeO₄]²⁻ = **3**\n\nAnswer key = 2. Recording per answer key: **Answer: 2**`,
'tag_coord_3','05 Apr 2024 (E)'),

mk('CORD-144','Hard','SCQ',
`The correct order of A, B, C and D in terms of wavenumber of light absorbed is:\n(A) $[\\mathrm{CoCl(NH_3)_5}]^{2+}$\n(B) $[\\mathrm{Co(CN)_6}]^{3-}$\n(C) $[\\mathrm{Co(NH_3)_5(H_2O)}]^{3+}$\n(D) $[\\mathrm{Cu(H_2O)_4}]^{2+}$`,
scq([`C < D < A < B`,`B < C < A < D`,`A < C < B < D`,`D < A < C < B`],4),null,
`Higher field strength → larger Δ₀ → higher energy → higher wavenumber.\n\nField strength order of ligands: H₂O < Cl⁻ < NH₃ < CN⁻\n\nBut also metal and oxidation state matter:\n- (D) [Cu(H₂O)₄]²⁺: Cu²⁺, H₂O → **lowest Δ₀** → lowest wavenumber\n- (A) [CoCl(NH₃)₅]²⁺: Co²⁺, mixed → low\n- (C) [Co(NH₃)₅(H₂O)]³⁺: Co³⁺, NH₃ → higher (Co³⁺ > Co²⁺)\n- (B) [Co(CN)₆]³⁻: Co³⁺, CN⁻ → **highest Δ₀** → highest wavenumber\n\nIncreasing wavenumber: D < A < C < B\n\n**Answer: (4) D < A < C < B**`,
'tag_coord_3','06 Apr 2024 (M)'),

mk('CORD-145','Hard','SCQ',
`Match List-I with List-II (tetrahedral crystal field d-electron configurations):\n(A) TiCl₄  (B) [FeO₄]²⁻  (C) [FeCl₄]⁻  (D) [CoCl₄]²⁻\nwith (I) e², t₂⁰  (II) e⁴, t₂³  (III) e⁰, t₂⁰  (IV) e², t₂³`,
scq([`(A)-(III), (B)-(IV), (C)-(II), (D)-(I)`,`(A)-(IV), (B)-(III), (C)-(I), (D)-(II)`,`(A)-(III), (B)-(I), (C)-(IV), (D)-(II)`,`(A)-(I), (B)-(III), (C)-(IV), (D)-(II)`],3),null,
`Tetrahedral field: e (lower, 2 orbitals) and t₂ (higher, 3 orbitals)\n\n- (A) TiCl₄: Ti⁴⁺ d⁰ → **e⁰ t₂⁰** → (III)\n- (B) [FeO₄]²⁻: Fe⁶⁺ d² → **e² t₂⁰** → (I)\n- (C) [FeCl₄]⁻: Fe³⁺ d⁵ → e² t₂³ → (IV)\n- (D) [CoCl₄]²⁻: Co²⁺ d⁷ → e⁴ t₂³ → (II)\n\n**Answer: (3) A-III, B-I, C-IV, D-II**`,
'tag_coord_3','06 Apr 2024 (E)'),

mk('CORD-146','Medium','NVT',
`Number of complexes with even number of electrons in $t_{2g}$ orbitals is ____\n$[\\mathrm{Fe(H_2O)_6}]^{2+}$, $[\\mathrm{Co(H_2O)_6}]^{2+}$, $[\\mathrm{Co(H_2O)_6}]^{3+}$, $[\\mathrm{Cu(H_2O)_6}]^{2+}$, $[\\mathrm{Cr(H_2O)_6}]^{2+}$`,
[],3,
`All are high-spin (H₂O weak field). t₂g electrons:\n\n- [Fe(H₂O)₆]²⁺: Fe²⁺ d⁶ → $t_{2g}^4 e_g^2$ → **4 electrons** (even) ✓\n- [Co(H₂O)₆]²⁺: Co²⁺ d⁷ → $t_{2g}^5 e_g^2$ → **5 electrons** (odd) ✗\n- [Co(H₂O)₆]³⁺: Co³⁺ d⁶, H₂O → high-spin → $t_{2g}^4 e_g^2$ → **4 electrons** (even) ✓\n- [Cu(H₂O)₆]²⁺: Cu²⁺ d⁹ → $t_{2g}^6 e_g^3$ → **6 electrons** (even) ✓\n- [Cr(H₂O)₆]²⁺: Cr²⁺ d⁴ → $t_{2g}^3 e_g^1$ → **3 electrons** (odd) ✗\n\nEven t₂g electrons: Fe²⁺, Co³⁺, Cu²⁺ = **3**\n\n**Answer: 3**`,
'tag_coord_3','08 Apr 2024 (M)'),

mk('CORD-147','Medium','SCQ',
`Match List I with List II:\n(A) $[\\mathrm{Cr(H_2O)_6}]^{3+}$  (B) $[\\mathrm{Fe(H_2O)_6}]^{3+}$  (C) $[\\mathrm{Ni(H_2O)_6}]^{2+}$  (D) $[\\mathrm{V(H_2O)_6}]^{3+}$\nwith (I) $t_{2g}^2 e_g^0$  (II) $t_{2g}^3 e_g^0$  (III) $t_{2g}^3 e_g^2$  (IV) $t_{2g}^6 e_g^2$`,
scq([`A-III, B-II, C-IV, D-I`,`A-IV, B-I, C-II, D-III`,`A-IV, B-III, C-I, D-II`,`A-II, B-III, C-IV, D-I`],4),null,
`All high-spin (H₂O weak field):\n\n- (A) [Cr(H₂O)₆]³⁺: Cr³⁺ d³ → $t_{2g}^3 e_g^0$ → (II)\n- (B) [Fe(H₂O)₆]³⁺: Fe³⁺ d⁵ → $t_{2g}^3 e_g^2$ → (III)\n- (C) [Ni(H₂O)₆]²⁺: Ni²⁺ d⁸ → $t_{2g}^6 e_g^2$ → (IV)\n- (D) [V(H₂O)₆]³⁺: V³⁺ d² → $t_{2g}^2 e_g^0$ → (I)\n\n**Answer: (4) A-II, B-III, C-IV, D-I**`,
'tag_coord_3','31 Jan 2024 (E)'),

mk('CORD-148','Medium','SCQ',
`Given below are two statements:\n**Statement (I):** A solution of $[\\mathrm{Ni(H_2O)_6}]^{2+}$ is green in colour.\n**Statement (II):** A solution of $[\\mathrm{Ni(CN)_4}]^{2-}$ is colourless.\nChoose the most appropriate answer:`,
scq([`Both Statement I and Statement II are incorrect`,`Both Statement I and Statement II are correct`,`Statement I is incorrect but Statement II is correct`,`Statement I is correct but Statement II is incorrect`],2),null,
`**Statement I:** [Ni(H₂O)₆]²⁺ is indeed **green** ✓ (absorbs red light, transmits green)\n\n**Statement II:** [Ni(CN)₄]²⁻ is square planar, Ni²⁺ d⁸, CN⁻ strong field → all electrons paired → **no d-d transition possible** → **colourless** ✓\n\nBoth statements are correct.\n\n**Answer: (2) Both Statement I and Statement II are correct**`,
'tag_coord_2','01 Feb 2024 (M)'),

mk('CORD-149','Medium','SCQ',
`$[\\mathrm{Co(NH_3)_6}]^{3+}$ and $[\\mathrm{CoF_6}]^{3-}$ are respectively known as:`,
scq([`Spin free Complex, Spin paired Complex`,`Spin paired Complex, Spin free Complex`,`Outer orbital Complex, Inner orbital Complex`,`Inner orbital Complex, Spin paired Complex`],2),null,
`**[Co(NH₃)₆]³⁺:** Co³⁺ d⁶, NH₃ strong field → low-spin → electrons paired → **Spin paired complex** (inner orbital, d²sp³)\n\n**[CoF₆]³⁻:** Co³⁺ d⁶, F⁻ weak field → high-spin → electrons not fully paired → **Spin free complex** (outer orbital, sp³d²)\n\n**Answer: (2) Spin paired Complex, Spin free Complex**`,
'tag_coord_8','01 Feb 2024 (E)'),

mk('CORD-150','Medium','SCQ',
`Given below are two statements:\n**Assertion A:** In the complex Ni(CO)₄ and Fe(CO)₅, the metals have zero oxidation state.\n**Reason R:** Low oxidation states are found when a complex has ligands capable of π-donor character in addition to the σ-bonding.\nChoose the most appropriate answer:`,
scq([`A is correct but R is not correct`,`A is not correct but R is correct`,`Both A and R are correct but R is NOT the correct explanation of A`,`Both A and R are correct and R is the correct explanation of A`],1),null,
`**Assertion A:** Ni(CO)₄: Ni = 0 ✓; Fe(CO)₅: Fe = 0 ✓ → A is correct\n\n**Reason R:** Low oxidation states occur with ligands having **π-acceptor** (not π-donor) character. CO is a π-acceptor (back-bonding stabilizes low oxidation states). ✗\n\nR is incorrect — CO is a π-acceptor, not π-donor.\n\n**Answer: (1) A is correct but R is not correct**`,
'tag_coord_6','06 Apr 2023 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 15. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
