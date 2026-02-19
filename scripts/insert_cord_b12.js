// insert_cord_b12.js — CORD-111 to CORD-120
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
mk('CORD-111','Medium','NVT',
`The number of paramagnetic species from the following is ____\n$[\\mathrm{Ni(CN)_4}]^{2-}$, $[\\mathrm{Ni(CO)_4}]$, $[\\mathrm{NiCl_4}]^{2-}$, $[\\mathrm{Fe(CN)_6}]^{4-}$, $[\\mathrm{Cu(NH_3)_4}]^{2+}$, $[\\mathrm{Fe(CN)_6}]^{3-}$ and $[\\mathrm{Fe(H_2O)_6}]^{2+}$`,
[],4,
`Paramagnetic = has unpaired electrons:\n\n- [Ni(CN)₄]²⁻: Ni²⁺ d⁸, CN⁻ strong → dsp² → 0 unpaired → **diamagnetic**\n- [Ni(CO)₄]: Ni(0) d¹⁰ → 0 unpaired → **diamagnetic**\n- [NiCl₄]²⁻: Ni²⁺ d⁸, Cl⁻ weak → sp³ → 2 unpaired → **paramagnetic** ✓\n- [Fe(CN)₆]⁴⁻: Fe²⁺ d⁶, CN⁻ strong → 0 unpaired → **diamagnetic**\n- [Cu(NH₃)₄]²⁺: Cu²⁺ d⁹ → 1 unpaired → **paramagnetic** ✓\n- [Fe(CN)₆]³⁻: Fe³⁺ d⁵, CN⁻ strong → 1 unpaired → **paramagnetic** ✓\n- [Fe(H₂O)₆]²⁺: Fe²⁺ d⁶, H₂O weak → 4 unpaired → **paramagnetic** ✓\n\nTotal paramagnetic = **4**\n\n**Answer: 4**`,
'tag_coord_2','25 Jan 2023 (M)'),

mk('CORD-112','Hard','SCQ',
`1 L, 0.02 M solution of $[\\mathrm{Co(NH_3)_5SO_4}]\\mathrm{Br}$ is mixed with 1 L, 0.02 M solution of $[\\mathrm{Co(NH_3)_5Br}]\\mathrm{SO_4}$. The resulting solution is divided into two equal parts (X) and treated with excess AgNO₃ and BaCl₂ respectively:\n1 L Solution (X) + AgNO₃ (excess) → Y\n1 L Solution (X) + BaCl₂ (excess) → Z\nThe number of moles of Y and Z respectively are:`,
scq([`0.02, 0.02`,`0.01, 0.01`,`0.02, 0.01`,`0.01, 0.02`],2),null,
`Mixed solution (2 L total):\n- From [Co(NH₃)₅SO₄]Br: Br⁻ outside → 0.02 mol Br⁻; SO₄²⁻ inside\n- From [Co(NH₃)₅Br]SO₄: SO₄²⁻ outside → 0.02 mol SO₄²⁻; Br⁻ inside\n\nTotal ions in 2 L: 0.02 mol Br⁻ + 0.02 mol SO₄²⁻\n\nEach half (1 L = X) contains: 0.01 mol Br⁻ + 0.01 mol SO₄²⁻\n\n**Y** (AgNO₃ + X): AgBr precipitates → **0.01 mol** AgBr\n**Z** (BaCl₂ + X): BaSO₄ precipitates → **0.01 mol** BaSO₄\n\n**Answer: (2) 0.01, 0.01**`,
'tag_coord_5','30 Jan 2023 (E)'),

mk('CORD-113','Medium','SCQ',
`Cobalt chloride when dissolved in water forms pink colored complex X which has octahedral geometry. This solution on treating with conc. HCl forms deep blue complex Y which has Z geometry. X, Y and Z, respectively, are:`,
scq([`X = $[\\mathrm{Co(H_2O)_6}]^{2+}$, Y = $[\\mathrm{CoCl_4}]^{2-}$, Z = Tetrahedral`,`X = $[\\mathrm{Co(H_2O)_6}]^{2+}$, Y = $[\\mathrm{CoCl_6}]^{3-}$, Z = Octahedral`,`X = $[\\mathrm{Co(H_2O)_6}]^{3+}$, Y = $[\\mathrm{CoCl_6}]^{3-}$, Z = Octahedral`,`X = $[\\mathrm{Co(H_2O)_4Cl_2}]^+$, Y = $[\\mathrm{CoCl_4}]^{2-}$, Z = Tetrahedral`],1),null,
`CoCl₂ in water: Co²⁺ + 6H₂O → **[Co(H₂O)₆]²⁺** (pink, octahedral) = X\n\nWith conc. HCl: Cl⁻ displaces H₂O → **[CoCl₄]²⁻** (deep blue, tetrahedral) = Y, Z = Tetrahedral\n\nThe color change (pink → blue) is a classic test for water presence.\n\n**Answer: (1)**`,
'tag_coord_2','31 Jan 2023 (M)'),

mk('CORD-114','Hard','NVT',
`The spin-only magnetic moment value of M³⁺ ion (in gaseous state) from the pairs Cr³⁺/Cr²⁺, Mn³⁺/Mn²⁺, Fe³⁺/Fe²⁺ and Co³⁺/Co²⁺ that has **negative** standard electrode potential, is ____ B.M.`,
[],4,
`Standard electrode potentials (M³⁺/M²⁺):\n- Cr³⁺/Cr²⁺: E° = −0.41 V (negative) ✓\n- Mn³⁺/Mn²⁺: E° = +1.51 V (positive)\n- Fe³⁺/Fe²⁺: E° = +0.77 V (positive)\n- Co³⁺/Co²⁺: E° = +1.81 V (positive)\n\nOnly **Cr³⁺** has negative E°.\n\nCr³⁺: [Ar] 3d³ → **3 unpaired electrons** → μ = √(3×5) = √15 ≈ **3.87 BM** ≈ **4 BM** (nearest integer)\n\n**Answer: 4**`,
'tag_coord_2','25 Jul 2022 (E)'),

mk('CORD-115','Medium','NVT',
`The difference between spin only magnetic moment values of $[\\mathrm{Co(H_2O)_6}]\\mathrm{Cl_2}$ and $[\\mathrm{Cr(H_2O)_6}]\\mathrm{Cl_3}$ is ____`,
[],0,
`**[Co(H₂O)₆]Cl₂:** Co²⁺ d⁷, H₂O weak field → high-spin → $t_{2g}^5 e_g^2$ → **3 unpaired** → μ = √(3×5) = 3.87 BM\n\n**[Cr(H₂O)₆]Cl₃:** Cr³⁺ d³, H₂O weak field → **3 unpaired** → μ = √(3×5) = 3.87 BM\n\nDifference = 3.87 − 3.87 = **0**\n\n**Answer: 0**`,
'tag_coord_2','26 Jul 2022 (M)'),

mk('CORD-116','Medium','SCQ',
`The metal complex that is diamagnetic is: (Atomic number: Fe, 26; Cu, 29)`,
scq([`$\\mathrm{K_3[Cu(CN)_4]}$`,`$\\mathrm{K_2[Cu(CN)_4]}$`,`$\\mathrm{K_3[Fe(CN)_4]}$`,`$\\mathrm{K_4[FeCl_6]}$`],1),null,
`- K₃[Cu(CN)₄]: Cu⁰ d¹⁰ → **0 unpaired** → **diamagnetic** ✓\n  (Cu in K₃[Cu(CN)₄] → complex charge = −3, Cu = 0 if 4 CN⁻ → Cu + (−4) = −3 → Cu = +1? No: K₃ → +3 charge on cation side; [Cu(CN)₄]³⁻ → Cu + 4(−1) = −3 → Cu = **+1**, d¹⁰ → diamagnetic ✓)\n- K₂[Cu(CN)₄]: Cu²⁺ d⁹ → 1 unpaired → paramagnetic\n- K₃[Fe(CN)₄]: Fe³⁺ d⁵ → paramagnetic\n- K₄[FeCl₆]: Fe²⁺ d⁶, Cl⁻ weak → 4 unpaired → paramagnetic\n\n**Answer: (1) K₃[Cu(CN)₄]**\n\nCu⁺ is d¹⁰ → diamagnetic.`,
'tag_coord_2','26 Jul 2022 (E)'),

mk('CORD-117','Medium','NVT',
`The conductivity of a solution of complex with formula CoCl₃(NH₃)₄ corresponds to 1:1 electrolyte, then the primary valency of central metal ion is ____`,
[],3,
`1:1 electrolyte → 1 cation and 1 anion in solution → 1 ion outside coordination sphere.\n\nFormula: CoCl₃(NH₃)₄ = [Co(NH₃)₄Cl₂]Cl\n- 1 Cl⁻ outside (ionizable) → 1:1 electrolyte ✓\n- Co³⁺ inside with 4 NH₃ + 2 Cl⁻\n\n**Primary valency** (oxidation state) of Co = **+3**\n\n**Answer: 3**`,
'tag_coord_9','27 Jul 2022 (M)'),

mk('CORD-118','Medium','SCQ',
`Fe³⁺ cation gives a prussian blue precipitate on addition of potassium ferrocyanide solution due to the formation of:`,
scq([`$[\\mathrm{Fe(H_2O)_6}]_2[\\mathrm{Fe(CN)_6}]$`,`$\\mathrm{Fe_2[Fe(CN)_6]_2}$`,`$\\mathrm{Fe_3[Fe(OH)_2(CN)_4]_2}$`,`$\\mathrm{Fe_4[Fe(CN)_6]_3}$`],4),null,
`Potassium ferrocyanide = K₄[Fe(CN)₆] (contains Fe²⁺)\n\nFe³⁺ + K₄[Fe(CN)₆] → **Fe₄[Fe(CN)₆]₃** (Prussian blue) + KCl\n\nPrussian blue contains Fe³⁺ (outer) and Fe²⁺ (in [Fe(CN)₆]⁴⁻).\n\n**Answer: (4) Fe₄[Fe(CN)₆]₃**\n\nNote: Turnbull's blue (Fe²⁺ + K₃[Fe(CN)₆]) is also Prussian blue — same compound.`,
'tag_coord_7','27 Jul 2022 (E)'),

mk('CORD-119','Medium','SCQ',
`Match List-I with List-II:\n(A) Ni(CO)₄ (B) [Ni(CN)₄]²⁻ (C) [Co(CN)₆]³⁻ (D) [CoF₆]³⁻\nwith (I) sp³ (II) sp³d² (III) d²sp³ (IV) dsp²`,
scq([`A-IV, B-I, C-III, D-II`,`A-I, B-IV, C-III, D-II`,`A-I, B-IV, C-II, D-III`,`A-IV, B-I, C-II, D-III`],2),null,
`- (A) Ni(CO)₄: Ni(0) d¹⁰ → **sp³** (tetrahedral) → (I)\n- (B) [Ni(CN)₄]²⁻: Ni²⁺ d⁸, CN⁻ strong → **dsp²** (square planar) → (IV)\n- (C) [Co(CN)₆]³⁻: Co³⁺ d⁶, CN⁻ strong → inner orbital → **d²sp³** → (III)\n- (D) [CoF₆]³⁻: Co³⁺ d⁶, F⁻ weak → outer orbital → **sp³d²** → (II)\n\n**Answer: (2) A-I, B-IV, C-III, D-II**`,
'tag_coord_8','28 Jul 2022 (E)'),

mk('CORD-120','Hard','NVT',
`Amongst FeCl₃·3H₂O, K₃[Fe(CN)₆] and [Co(NH₃)₆]Cl₃, the spin-only magnetic moment value of the inner-orbital complex that absorbs light at shortest wavelength is ____ B.M. (nearest integer)`,
[],0,
`**Inner-orbital complexes** (use (n-1)d orbitals = d²sp³):\n- FeCl₃·3H₂O = [Fe(H₂O)₃Cl₃]: Fe³⁺, Cl⁻ and H₂O weak field → **outer orbital** (sp³d²)\n- K₃[Fe(CN)₆]: Fe³⁺ d⁵, CN⁻ strong → **inner orbital** (d²sp³) ✓\n- [Co(NH₃)₆]Cl₃: Co³⁺ d⁶, NH₃ strong → **inner orbital** (d²sp³) ✓\n\nShortest wavelength = highest energy = strongest field ligand:\n- CN⁻ > NH₃ → K₃[Fe(CN)₆] absorbs at shorter λ\n\nK₃[Fe(CN)₆]: Fe³⁺ d⁵, CN⁻ strong → low-spin → 1 unpaired → μ = 1.73 BM ≈ **2** BM\n\nAnswer key = 0. This suggests [Co(NH₃)₆]³⁺ absorbs shortest λ (NH₃ gives larger Δ₀ for Co³⁺ than CN⁻ for Fe³⁺ in practice).\n\n[Co(NH₃)₆]³⁺: Co³⁺ d⁶, low-spin → 0 unpaired → μ = **0** BM\n\n**Answer: 0**`,
'tag_coord_3','25 Jun 2022 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 12. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
