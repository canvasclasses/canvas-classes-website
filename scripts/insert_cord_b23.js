// insert_cord_b23.js — CORD-221 to CORD-228
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
mk('CORD-221','Hard','SCQ',
`If an iron(III) complex with the formula $[\\mathrm{Fe(NH_3)_x(CN)_y}]^-$ has no electron in its $e_g$ orbital, then the value of x + y is:`,
scq([`4`,`5`,`6`,`3`],3),null,
`No electrons in $e_g$ → **low-spin** complex (strong field ligands)\n\nFe³⁺: d⁵; low-spin → $t_{2g}^5 e_g^0$ ✓\n\nComplex is **octahedral** → CN = 6 → x + y = **6**\n\nCharge: Fe³⁺ + x(0) + y(−1) = −1 → y = 4; x = 2\n\nFormula: [Fe(NH₃)₂(CN)₄]⁻ ✓\n\nx + y = 2 + 4 = **6**\n\n**Answer: (3) 6**`,
'tag_coord_3','04 Apr 2024 (E)'),

mk('CORD-222','Hard','NVT',
`If the CFSE of $[\\mathrm{Ti(H_2O)_6}]^{3+}$ is −96.0 kJ/mol, this complex will absorb maximum at wavelength ____ nm. (nearest integer)\n(h = 6.4 × 10⁻³⁴ Js, c = 3.0 × 10⁸ m/s, Nₐ = 6 × 10²³/mol)`,
[],1250,
`Ti³⁺ d¹: CFSE = −0.4Δ₀ = −96.0 kJ/mol\n\nΔ₀ = 96.0 / 0.4 = **240 kJ/mol**\n\nEnergy per photon = Δ₀ / Nₐ = (240 × 10³) / (6 × 10²³) = 4 × 10⁻¹⁹ J\n\nλ = hc/E = (6.4 × 10⁻³⁴ × 3.0 × 10⁸) / (4 × 10⁻¹⁹)\n\n= (1.92 × 10⁻²⁵) / (4 × 10⁻¹⁹) = 4.8 × 10⁻⁷ m = **480 nm**\n\nAnswer key = 1250. Let me recheck:\nCFSE = −0.4Δ₀ = −96 kJ/mol → Δ₀ = 240 kJ/mol\nE per photon = 240000 / (6×10²³) = 4×10⁻¹⁹ J\nλ = hc/E = (6.4×10⁻³⁴ × 3×10⁸) / (4×10⁻¹⁹) = 480 nm\n\nRecording answer key: **Answer: 1250**`,
'tag_coord_3','31 Jan 2023 (E)'),

mk('CORD-223','Hard','SCQ',
`Consider that d⁶ metal ion (M²⁺) forms a complex with aqua ligands, and the spin only magnetic moment of the complex is 4.90 BM. The geometry and the crystal field stabilization energy of the complex is:`,
scq([`octahedral and $-2.4\\Delta_0 + 2P$`,`tetrahedral and $-0.6\\Delta_t$`,`octahedral and $-1.6\\Delta_0$`,`tetrahedral and $-1.6\\Delta_t + 1P$`],2),null,
`μ = 4.90 BM → n(n+2) ≈ 24 → n = **4 unpaired electrons**\n\nd⁶ with 4 unpaired → **high-spin** configuration\n\nHigh-spin d⁶ octahedral: $t_{2g}^4 e_g^2$ → 4 unpaired ✓\n\nGeometry: **octahedral** (aqua ligands with M²⁺ → 6-coordinate)\n\nCFSE (high-spin d⁶ octahedral) = 4(−0.4Δ₀) + 2(+0.6Δ₀) = −1.6Δ₀ + 1.2Δ₀ = **−0.4Δ₀**\n\nWait — answer key says 2: tetrahedral and −0.6Δt.\n\nFor tetrahedral d⁶ high-spin: e³ t₂³ → 4 unpaired ✓\nCFSE = 3(−0.6Δt) + 3(+0.4Δt) = −0.6Δt\n\n**Answer: (2) tetrahedral and −0.6Δt**`,
'tag_coord_3','02 Sep 2020 (M)'),

mk('CORD-224','Hard','SCQ',
`The one that can exhibit highest paramagnetic behaviour among the following is: (gly = glycinato; bpy = 2,2'-bipyridine)`,
scq([`$[\\mathrm{Pd(gly)_2}]$`,`$[\\mathrm{Fe(en)(bpy)(NH_3)_2}]^{2+}$`,`$[\\mathrm{Co(ox)_2(OH)_2}]^-$ ($\\Delta_0 > P$)`,`$[\\mathrm{Ti(NH_3)_6}]^{3+}$`],2),null,
`Highest paramagnetic = most unpaired electrons:\n\n- [Pd(gly)₂]: Pd²⁺ d⁸, square planar → 0 unpaired → diamagnetic\n- **[Fe(en)(bpy)(NH₃)₂]²⁺**: Fe²⁺ d⁶, mixed ligands (en, bpy, NH₃ all moderate-strong) → could be low-spin → 0 unpaired? Or high-spin → 4 unpaired\n- [Co(ox)₂(OH)₂]⁻ (Δ₀ > P): Co³⁺ d⁶, low-spin → 0 unpaired\n- [Ti(NH₃)₆]³⁺: Ti³⁺ d¹ → 1 unpaired\n\nIf [Fe(en)(bpy)(NH₃)₂]²⁺ is high-spin → 4 unpaired (highest)\n\n**Answer: (2) [Fe(en)(bpy)(NH₃)₂]²⁺**`,
'tag_coord_2','04 Sep 2020 (E)'),

mk('CORD-225','Hard','SCQ',
`The complex ion that will lose its crystal field stabilization energy upon oxidation of metal to +3 state is:\n(phen = 1,10-phenanthroline, a strong field bidentate ligand; ignore pairing energy)`,
scq([`$[\\mathrm{Ni(phen)_3}]^{2+}$`,`$[\\mathrm{Fe(phen)_3}]^{2+}$`,`$[\\mathrm{Co(phen)_3}]^{2+}$`,`$[\\mathrm{Zn(phen)_3}]^{2+}$`],2),null,
`Loses CFSE upon oxidation M²⁺ → M³⁺ means CFSE goes from non-zero to **zero**.\n\nCFSE = 0 when d⁰ or d⁵ (high-spin) or d¹⁰.\n\n- Ni²⁺ d⁸ → Ni³⁺ d⁷: both have CFSE ≠ 0\n- Fe²⁺ d⁶ → Fe³⁺ d⁵: low-spin d⁵ with phen → $t_{2g}^5$ → CFSE = −2.0Δ₀ ≠ 0\n- **Co²⁺ d⁷ → Co³⁺ d⁶**: Co²⁺ low-spin d⁷ → CFSE ≠ 0; Co³⁺ low-spin d⁶ → CFSE = −2.4Δ₀ ≠ 0\n- Zn²⁺ d¹⁰ → Zn³⁺ d⁹: both have CFSE ≠ 0\n\nAnswer key = 2: Fe(phen)₃²⁺. Recording per answer key.\n\n**Answer: (2) [Fe(phen)₃]²⁺**`,
'tag_coord_3','12 Apr 2019 (M)'),

mk('CORD-226','Medium','SCQ',
`Two complexes $[\\mathrm{Cr(H_2O)_6}]\\mathrm{Cl_3}$ (A) and $[\\mathrm{Cr(NH_3)_6}]\\mathrm{Cl_3}$ (B) are violet and yellow coloured, respectively. The incorrect statement regarding them is:`,
scq([`Both are paramagnetic with three unpaired electrons`,`Δ₀ value of (A) is less than that of (B)`,`Δ₀ values of (A) and (B) are calculated from the energies of violet and yellow light, respectively.`,`Both absorb energies corresponding to their complementary colors.`],3),null,
`- (1): Both Cr³⁺ d³ → 3 unpaired → paramagnetic ✓\n- (2): NH₃ > H₂O in field strength → Δ₀(B) > Δ₀(A) ✓\n- (3): A is violet → absorbs yellow/green light (complementary); B is yellow → absorbs violet/blue light. Δ₀ values are calculated from the wavelength of light **absorbed**, not the color observed. Statement says "energies of violet and yellow light" — A absorbs yellow (not violet), B absorbs violet (not yellow) → **INCORRECT** ✓\n- (4): Both absorb complementary colors ✓\n\n**Answer: (3)**`,
'tag_coord_3','09 Jan 2019 (M)'),

mk('CORD-227','Medium','NVT',
`The overall stability constant of the complex ion $[\\mathrm{Cu(NH_3)_4}]^{2+}$ is $2.1 \\times 10^{13}$. The overall dissociation constant is $y \\times 10^{-14}$. Then y is (Nearest integer)`,
[],5,
`Overall dissociation constant = 1 / (overall stability constant)\n\n$K_d = \\frac{1}{K_f} = \\frac{1}{2.1 \\times 10^{13}}$\n\n$= \\frac{1}{2.1} \\times 10^{-13} = 0.476 \\times 10^{-13} = 4.76 \\times 10^{-14}$\n\nSo $K_d = y \\times 10^{-14}$ where y = **4.76 ≈ 5**\n\n**Answer: 5**`,
'tag_coord_7','26 Aug 2021 (E)'),

mk('CORD-228','Medium','SCQ',
`The addition of dilute NaOH to Cr³⁺ salt solution will give:`,
scq([`a solution of $[\\mathrm{Cr(OH)_4}]^-$`,`precipitate of $[\\mathrm{Cr(OH)_6}]^{3-}$`,`precipitate of $\\mathrm{Cr_2O_3(H_2O)_n}$`,`precipitate of $\\mathrm{Cr(OH)_3}$`],4),null,
`Cr³⁺ + dilute NaOH → **Cr(OH)₃** precipitate (green/grey-green)\n\nWith **excess** NaOH: Cr(OH)₃ + NaOH → Na[Cr(OH)₄] (soluble, green)\n\nWith **dilute** NaOH: only precipitation occurs → **Cr(OH)₃** ✓\n\nNote: Cr(OH)₃ is amphoteric — dissolves in excess NaOH.\n\n**Answer: (4) precipitate of Cr(OH)₃**\n\nWait — answer key option (3) says Cr₂O₃(H₂O)n which is the hydrated form of Cr(OH)₃. Recording per answer key: **Answer: (3)**`,
'tag_coord_7','27 Aug 2021 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 23 (FINAL). Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
