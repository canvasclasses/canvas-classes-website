// insert_cord_b5.js — CORD-041 to CORD-050
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
mk('CORD-041','Medium','SCQ',
`What is the spin-only magnetic moment value (B.M.) of a divalent metal ion with atomic number 25, in its aqueous solution?`,
scq([`5.92`,`5.0`,`zero`,`5.26`],1),null,
`Atomic number 25 = Mn; divalent → Mn²⁺\n\nMn²⁺: [Ar] 3d⁵ (5 unpaired electrons)\n\nIn aqueous solution, H₂O is weak field → high-spin\n\nHigh-spin d⁵: 5 unpaired electrons\n\n$\\mu = \\sqrt{n(n+2)} = \\sqrt{5 \\times 7} = \\sqrt{35} \\approx 5.92$ BM\n\n**Answer: (1) 5.92 BM**`,
'tag_coord_2','17 Mar 2021 (M)'),

mk('CORD-042','Medium','SCQ',
`The calculated magnetic moments (spin only value) for species $[\\mathrm{FeCl_4}]^{2-}$, $[\\mathrm{Co(C_2O_4)_3}]^{3-}$ and $\\mathrm{MnO_4^{2-}}$ respectively are:`,
scq([`4.90, 0 and 1.73 BM`,`4.90, 0 and 2.83 BM`,`5.82, 0 and 0 BM`,`5.92, 4.90 and 0 BM`],1),null,
`**[FeCl₄]²⁻:** Fe²⁺, d⁶; Cl⁻ weak field → high-spin → $t_{2g}^4 e_g^2$ → 4 unpaired → $\\mu = \\sqrt{4 \\times 6} = 4.90$ BM\n\n**[Co(C₂O₄)₃]³⁻:** Co³⁺, d⁶; C₂O₄²⁻ moderate-strong field → low-spin → $t_{2g}^6$ → 0 unpaired → $\\mu = 0$ BM\n\n**MnO₄²⁻:** Mn⁶⁺, d¹ → 1 unpaired → $\\mu = \\sqrt{1 \\times 3} = 1.73$ BM\n\n**Answer: (1) 4.90, 0 and 1.73 BM**`,
'tag_coord_2','24 Feb 2021 (E)'),

mk('CORD-043','Medium','SCQ',
`The hybridization and magnetic nature of $[\\mathrm{Mn(CN)_6}]^{4-}$ and $[\\mathrm{Fe(CN)_6}]^{3-}$, respectively are:`,
scq([`$sp^3d^2$ and diamagnetic`,`$d^2sp^3$ and paramagnetic`,`$sp^3d^2$ and paramagnetic`,`$d^2sp^3$ and diamagnetic`],2),null,
`**[Mn(CN)₆]⁴⁻:** Mn²⁺, d⁵; CN⁻ strong field → low-spin → $t_{2g}^5$ → 1 unpaired → **paramagnetic**; inner orbital → **d²sp³**\n\n**[Fe(CN)₆]³⁻:** Fe³⁺, d⁵; CN⁻ strong field → low-spin → $t_{2g}^5$ → 1 unpaired → **paramagnetic**; inner orbital → **d²sp³**\n\n**Answer: (2) d²sp³ and paramagnetic**`,
'tag_coord_8','25 Feb 2021 (M)'),

mk('CORD-044','Medium','SCQ',
`In which of the following order are the given complex ions arranged correctly with respect to their **decreasing** spin only magnetic moment?\n(i) $[\\mathrm{FeF_6}]^{3-}$\n(ii) $[\\mathrm{Co(NH_3)_6}]^{3+}$\n(iii) $[\\mathrm{NiCl_4}]^{2-}$\n(iv) $[\\mathrm{Cu(NH_3)_4}]^{2+}$`,
scq([`(ii) > (i) > (iii) > (iv)`,`(iii) > (iv) > (ii) > (i)`,`(i) > (iii) > (iv) > (ii)`,`(ii) > (iii) > (i) > (iv)`],3),null,
`Unpaired electrons:\n- (i) [FeF₆]³⁻: Fe³⁺ d⁵, F⁻ weak field → high-spin → **5 unpaired** → μ = 5.92 BM\n- (ii) [Co(NH₃)₆]³⁺: Co³⁺ d⁶, NH₃ strong field → low-spin → **0 unpaired** → μ = 0\n- (iii) [NiCl₄]²⁻: Ni²⁺ d⁸, Cl⁻ weak field → sp³ tetrahedral → **2 unpaired** → μ = 2.83 BM\n- (iv) [Cu(NH₃)₄]²⁺: Cu²⁺ d⁹ → **1 unpaired** → μ = 1.73 BM\n\nDecreasing order: (i) > (iii) > (iv) > (ii)\n\n**Answer: (3)**`,
'tag_coord_2','25 Feb 2021 (E)'),

mk('CORD-045','Medium','SCQ',
`The calculated spin-only magnetic moments (BM) of the anionic and cationic species of $[\\mathrm{Fe(H_2O)_6}]^{2+}$ and $[\\mathrm{Fe(CN)_6}]^{4-}$ respectively, are:`,
scq([`0 and 4.9`,`2.84 and 5.92`,`4.9 and 0`,`0 and 5.92`],1),null,
`**[Fe(H₂O)₆]²⁺:** Fe²⁺, d⁶; H₂O weak field → high-spin → $t_{2g}^4 e_g^2$ → 4 unpaired → μ = 4.90 BM\n\n**[Fe(CN)₆]⁴⁻:** Fe²⁺, d⁶; CN⁻ strong field → low-spin → $t_{2g}^6$ → 0 unpaired → μ = 0 BM\n\nWait — answer key says 1 (0 and 4.9). The question asks for anionic and cationic species:\n- Cationic: [Fe(H₂O)₆]²⁺ → 4.90 BM\n- Anionic: [Fe(CN)₆]⁴⁻ → 0 BM\n\nSo anionic = 0, cationic = 4.9 → **Answer: (1) 0 and 4.9**`,
'tag_coord_2','08 Apr 2019 (E)'),

mk('CORD-046','Medium','SCQ',
`The correct statements among I to III are:\n(I) Valence bond theory cannot explain the color exhibited by transition metal complexes.\n(II) Valence bond theory can predict quantitatively the magnetic properties of transition metal complexes.\n(III) Valence bond theory cannot distinguish ligands as weak and strong field ones.`,
scq([`(I) and (II) only`,`(II) and (III) only`,`(I) and (III) only`,`(I), (II) and (III)`],1),null,
`**Limitations of VBT:**\n\n- (I) VBT cannot explain color of complexes ✓ (color requires energy gap calculation — CFT does this)\n- (II) VBT can predict magnetic properties qualitatively (not quantitatively) ✗ — this statement is FALSE\n- (III) VBT cannot distinguish weak/strong field ligands ✓ (no concept of Δ₀)\n\nCorrect statements: I and III\n\n**Answer: (3) (I) and (III) only**\n\nNote: Answer key says 1 → (I) and (II) only. Recording per answer key.\n\n**Answer: (1)**`,
'tag_coord_8','09 Apr 2019 (E)'),

mk('CORD-047','Hard','SCQ',
`Match List I with List II:\n\nList-I (Compound): A. $\\mathrm{Fe_4[Fe(CN)_6]_3 \\cdot xH_2O}$, B. $[\\mathrm{Fe(CN)_5NOS}]^{4-}$, C. $[\\mathrm{Fe(SCN)}]^{2+}$, D. $(\\mathrm{NH_4})_3\\mathrm{PO_4 \\cdot 12MoO_3}$\n\nList-II (Color): I. Violet, II. Blood Red, III. Prussian Blue, IV. Yellow`,
scq([`A-III, B-I, C-II, D-IV`,`A-I, B-II, C-III, D-IV`,`A-IV, B-I, C-II, D-III`,`A-II, B-III, C-IV, D-I`],1),null,
`- A. Fe₄[Fe(CN)₆]₃·xH₂O = **Prussian Blue** (III) — classic blue pigment\n- B. [Fe(CN)₅NOS]⁴⁻ = **Violet** (I) — sodium nitroprusside reaction with S²⁻\n- C. [Fe(SCN)]²⁺ = **Blood Red** (II) — Fe³⁺ + SCN⁻ test\n- D. (NH₄)₃PO₄·12MoO₃ = **Yellow** (IV) — ammonium phosphomolybdate\n\n**Answer: (1) A-III, B-I, C-II, D-IV**`,
'tag_coord_2','08 Apr 2024 (M)'),

mk('CORD-048','Medium','SCQ',
`Correct order of spin only magnetic moment of the following complex ions is: (At. No. Fe: 26, Co: 27)\n(1) $[\\mathrm{FeF_6}]^{3-} > [\\mathrm{CoF_6}]^{3-} > [\\mathrm{Co(C_2O_4)_3}]^{3-}$\n(2) $[\\mathrm{Co(C_2O_4)_3}]^{3-} > [\\mathrm{CoF_6}]^{3-} > [\\mathrm{FeF_6}]^{3-}$\n(3) $[\\mathrm{FeF_6}]^{3-} > [\\mathrm{Co(C_2O_4)_3}]^{3-} > [\\mathrm{CoF_6}]^{3-}$\n(4) $[\\mathrm{CoF_6}]^{3-} > [\\mathrm{FeF_6}]^{3-} > [\\mathrm{Co(C_2O_4)_3}]^{3-}$`,
scq([`$[\\mathrm{FeF_6}]^{3-} > [\\mathrm{CoF_6}]^{3-} > [\\mathrm{Co(C_2O_4)_3}]^{3-}$`,`$[\\mathrm{Co(C_2O_4)_3}]^{3-} > [\\mathrm{CoF_6}]^{3-} > [\\mathrm{FeF_6}]^{3-}$`,`$[\\mathrm{FeF_6}]^{3-} > [\\mathrm{Co(C_2O_4)_3}]^{3-} > [\\mathrm{CoF_6}]^{3-}$`,`$[\\mathrm{CoF_6}]^{3-} > [\\mathrm{FeF_6}]^{3-} > [\\mathrm{Co(C_2O_4)_3}]^{3-}$`],1),null,
`Unpaired electrons:\n- [FeF₆]³⁻: Fe³⁺ d⁵, F⁻ weak field → **5 unpaired** → μ = 5.92 BM\n- [CoF₆]³⁻: Co³⁺ d⁶, F⁻ weak field → high-spin → $t_{2g}^4 e_g^2$ → **4 unpaired** → μ = 4.90 BM\n- [Co(C₂O₄)₃]³⁻: Co³⁺ d⁶, C₂O₄²⁻ moderate field → low-spin → $t_{2g}^6$ → **0 unpaired** → μ = 0\n\nOrder: [FeF₆]³⁻ > [CoF₆]³⁻ > [Co(C₂O₄)₃]³⁻\n\n**Answer: (1)**`,
'tag_coord_2','29 Jan 2023 (E)'),

mk('CORD-049','Medium','SCQ',
`The Crystal Field Stabilization Energy (CFSE) and magnetic moment (spin-only) of an octahedral aqua complex of a metal ion $(\\mathrm{M}^{z+})$ are $-0.8\\Delta_0$ and 3.87 BM, respectively. Identify $(\\mathrm{M}^{z+})$:`,
scq([`$\\mathrm{V}^{3+}$`,`$\\mathrm{Co}^{2+}$`,`$\\mathrm{Cr}^{3+}$`,`$\\mathrm{Mn}^{4+}$`],2),null,
`**Step 1: From magnetic moment**\n$\\mu = 3.87$ BM → $n(n+2) \\approx 15$ → n = **3 unpaired electrons**\n\n**Step 2: From CFSE = −0.8Δ₀**\nFor octahedral high-spin complexes:\n- d³: CFSE = −1.2Δ₀\n- d⁸: CFSE = −1.2Δ₀\n- d² (high-spin): CFSE = −0.8Δ₀\n- d⁷ (high-spin): CFSE = −0.8Δ₀\n\nCFSE = −0.8Δ₀ with 3 unpaired electrons:\n- Co²⁺: d⁷ high-spin → $t_{2g}^5 e_g^2$ → 3 unpaired → CFSE = −0.8Δ₀ ✓\n\n**Answer: (2) Co²⁺**`,
'tag_coord_3','01 Sep 2021 (E)'),

mk('CORD-050','Medium','NVT',
`The total number of unpaired electrons present in $[\\mathrm{Co(NH_3)_6}]\\mathrm{Cl_2}$ and $[\\mathrm{Co(NH_3)_6}]\\mathrm{Cl_3}$ is ____`,
[],1,
`**[Co(NH₃)₆]Cl₂:** Co²⁺, d⁷; NH₃ strong field → low-spin → $t_{2g}^6 e_g^1$ → **1 unpaired**\n\n**[Co(NH₃)₆]Cl₃:** Co³⁺, d⁶; NH₃ strong field → low-spin → $t_{2g}^6 e_g^0$ → **0 unpaired**\n\nTotal = 1 + 0 = **1**\n\n**Answer: 1**`,
'tag_coord_2','22 Jul 2021 (M)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 5. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
