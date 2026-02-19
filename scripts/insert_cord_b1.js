// insert_cord_b1.js — CORD-001 to CORD-010
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
mk('CORD-001','Medium','SCQ',
`The correct sequence of ligands in the order of decreasing field strength is:`,
scq([`$\\mathrm{NCS}^- > \\mathrm{EDTA}^{4-} > \\mathrm{CN}^- > \\mathrm{CO}$`,`$\\mathrm{CO} > \\mathrm{H_2O} > \\mathrm{F}^- > \\mathrm{S}^{2-}$`,`$\\mathrm{S}^{2-} > \\mathrm{OH}^- > \\mathrm{EDTA}^{4-} > \\mathrm{CO}$`,`$\\mathrm{OH}^- > \\mathrm{F}^- > \\mathrm{NH_3} > \\mathrm{CN}^-$`],2),null,
`Spectrochemical series (decreasing): CO > CN⁻ > en > NH₃ > H₂O > F⁻ > S²⁻\n\nOption (2): CO > H₂O > F⁻ > S²⁻ ✓ — CO is strongest (π-acceptor), S²⁻ weakest.\n\n**Answer: (2)**`,
'tag_coord_1','04 Apr 2024 (M)'),

mk('CORD-002','Medium','SCQ',
`The correct order of ligands arranged in increasing field strength is:`,
scq([`$\\mathrm{F}^- < \\mathrm{Br}^- < \\mathrm{I}^- < \\mathrm{NH_3}$`,`$\\mathrm{Br}^- < \\mathrm{F}^- < \\mathrm{H_2O} < \\mathrm{NH_3}$`,`$\\mathrm{H_2O} < \\mathrm{OH}^- < \\mathrm{CN}^- < \\mathrm{NH_3}$`,`$\\mathrm{Cl}^- < \\mathrm{OH}^- < \\mathrm{Br}^- < \\mathrm{CN}^-$`],2),null,
`Spectrochemical series (increasing): I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃\n\nOption (2): Br⁻ < F⁻ < H₂O < NH₃ ✓\n\nAmong halides field strength increases as size decreases; NH₃ > H₂O (N is better σ-donor).\n\n**Answer: (2)**`,
'tag_coord_1','05 Apr 2024 (M)'),

mk('CORD-003','Medium','SCQ',
`$\\mathrm{F}^-$ ions convert hydroxyapatite into harder fluoroapatite. The formula of fluoroapatite is:`,
scq([`$[3\\mathrm{Ca_3(PO_4)_2}\\cdot\\mathrm{Ca(OH)_2}]$`,`$[3\\mathrm{Ca_3(PO_4)_3}\\cdot\\mathrm{CaF_2}]$`,`$[3\\mathrm{Ca_2(PO_4)_2}\\cdot\\mathrm{Ca(OH)_2}]$`,`$[3\\mathrm{Ca_3(PO_4)_2}\\cdot\\mathrm{CaF_2}]$`],4),null,
`Hydroxyapatite: $[3\\mathrm{Ca_3(PO_4)_2}\\cdot\\mathrm{Ca(OH)_2}]$\n\nF⁻ replaces OH⁻ → Ca(OH)₂ → CaF₂\n\nFluoroapatite: $[3\\mathrm{Ca_3(PO_4)_2}\\cdot\\mathrm{CaF_2}]$ — harder because F⁻ forms stronger ionic bonds.\n\n**Answer: (4)**`,
'tag_coord_1','09 Apr 2024 (M)'),

mk('CORD-004','Medium','NVT',
`Number of ambidentate ligands among the following is ____\n\n$\\mathrm{NO_2^-,\\ SCN^-,\\ C_2O_4^{2-},\\ NH_3,\\ CN^-,\\ SO_4^{2-},\\ H_2O}$`,
[],3,
`Ambidentate ligands can bind through two *different* donor atoms.\n\n- NO₂⁻: N (nitro) or O (nitrito) ✓\n- SCN⁻: S (thiocyanato) or N (isothiocyanato) ✓\n- C₂O₄²⁻: bidentate via O only ✗\n- NH₃: only N ✗\n- CN⁻: C (cyano) or N (isocyano) ✓\n- SO₄²⁻: only O ✗\n- H₂O: only O ✗\n\n**Answer: 3** (NO₂⁻, SCN⁻, CN⁻)`,
'tag_coord_1','09 Apr 2024 (M)'),

mk('CORD-005','Medium','SCQ',
`Identify the incorrect pair from the following:`,
scq([`Photography – AgBr`,`Polythene preparation – $\\mathrm{TiCl_4,\\ Al(CH_3)_3}$`,`Haber process – Iron`,`Wacker process – $\\mathrm{PtCl_2}$`],4),null,
`Wacker process: $\\mathrm{CH_2=CH_2 + \\frac{1}{2}O_2 \\xrightarrow{PdCl_2} CH_3CHO}$\n\nCatalyst is **PdCl₂** (palladium), NOT PtCl₂.\n\nAll other pairs are correct. **Answer: (4)**`,
'tag_coord_7','27 Jan 2024 (E)'),

mk('CORD-006','Easy','SCQ',
`Which of the following complex is homoleptic?`,
scq([`$[\\mathrm{Ni(CN)_4}]^{2-}$`,`$[\\mathrm{Ni(NH_3)_2Cl_2}]$`,`$[\\mathrm{Fe(NH_3)_4Cl_2}]^+$`,`$[\\mathrm{Co(NH_3)_4Cl_2}]^+$`],1),null,
`Homoleptic = only one type of ligand.\n\n$[\\mathrm{Ni(CN)_4}]^{2-}$: only CN⁻ → **Homoleptic** ✓\n\nOthers have NH₃ + Cl⁻ → Heteroleptic.\n\n**Answer: (1)**`,
'tag_coord_1','01 Feb 2024 (M)'),

mk('CORD-007','Medium','NVT',
`Number of ambidentate ligands in $[\\mathrm{M(en)(SCN)_4}]$ is ____ (en = ethylenediamine)`,
[],4,
`- en: bidentate through 2 N atoms — NOT ambidentate\n- SCN⁻: binds via S or N — **ambidentate** ✓\n\nThere are 4 SCN⁻ ligands → **Answer: 4**`,
'tag_coord_1','06 Apr 2023 (M)'),

mk('CORD-008','Medium','SCQ',
`The set which does NOT have ambidentate ligand(s) is:`,
scq([`$\\mathrm{C_2O_4^{2-}}$, ethylenediamine, $\\mathrm{H_2O}$`,`$\\mathrm{EDTA}^{4-}$, $\\mathrm{NCS}^-$, $\\mathrm{C_2O_4^{2-}}$`,`$\\mathrm{NO_2^-}$, $\\mathrm{C_2O_4^{2-}}$, $\\mathrm{EDTA}^{4-}$`,`$\\mathrm{C_2O_4^{2-}}$, $\\mathrm{NO_2^-}$, $\\mathrm{NCS}^-$`],1),null,
`Ambidentate ligands: NO₂⁻, SCN⁻/NCS⁻, CN⁻\n\n- Set (1): C₂O₄²⁻ (bidentate-O only), en (bidentate-N only), H₂O (monodentate) → **no ambidentate** ✓\n- Sets (2),(3),(4) contain NCS⁻ or NO₂⁻\n\n**Answer: (1)**`,
'tag_coord_1','11 Apr 2023 (M)'),

mk('CORD-009','Hard','SCQ',
`The mismatched combinations are:\nA. Chlorophyll – Co\nB. Water hardness – EDTA\nC. Photography – $[\\mathrm{Ag(CN)_2}]^-$\nD. Wilkinson catalyst – $[(\\mathrm{Ph_3P})_3\\mathrm{RhCl}]$\nE. Chelating ligand – D-Penicillamine`,
scq([`A, C and E only`,`A and C only`,`A and E only`,`D and E only`],2),null,
`- A: Chlorophyll → **Mg** (not Co) ✗\n- B: Water hardness – EDTA ✓\n- C: Photography uses AgBr (not [Ag(CN)₂]⁻; that is used in silver extraction) ✗\n- D: Wilkinson catalyst – [(Ph₃P)₃RhCl] ✓\n- E: D-Penicillamine is a chelating agent ✓\n\nMismatched: A and C → **Answer: (2)**\n\nMemory: Chlorophyll=Mg, Vitamin B₁₂=Co, Cisplatin=Pt, Wilkinson=Rh`,
'tag_coord_7','13 Apr 2023 (M)'),

mk('CORD-010','Medium','SCQ',
`The primary and secondary valencies of cobalt respectively in $[\\mathrm{Co(NH_3)_5Cl}]\\mathrm{Cl_2}$ are:`,
scq([`3 and 5`,`2 and 6`,`2 and 8`,`3 and 6`],4),null,
`**Primary valency** (oxidation state): Complex cation is $[\\mathrm{Co(NH_3)_5Cl}]^{2+}$\nCo + 0(5 NH₃) + (−1)(Cl) = +2 → Co = **+3**\n\n**Secondary valency** (coordination number): 5 NH₃ + 1 Cl⁻ = **6**\n\n**Answer: (4) 3 and 6**`,
'tag_coord_9','24 Jan 2023 (M)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 1. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
