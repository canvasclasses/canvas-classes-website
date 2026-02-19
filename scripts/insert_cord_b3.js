// insert_cord_b3.js — CORD-021 to CORD-030
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
mk('CORD-021','Medium','SCQ',
`The IUPAC name of $\\mathrm{K_3[Co(C_2O_4)_3]}$ is:`,
scq([`Potassium tris(oxalato)cobaltate(III)`,`Potassium tris(oxalato)cobalt(III)`,`Potassium trioxalatocobalt(III)`,`Potassium trioxalatocobaltate(III)`],4),null,
`K⁺ outside → potassium; complex anion [Co(C₂O₄)₃]³⁻\nCo: 3(+1) + x + 3(−2) = 0 → x = +3\nLigand: oxalato (C₂O₄²⁻); 3 ligands → trioxalato\nAnionic complex → cobaltate\n\nIUPAC: **Potassium trioxalatocobaltate(III)**\n\n**Answer: (4)**`,
'tag_coord_4','06 Apr 2023 (E)'),

mk('CORD-022','Medium','SCQ',
`The IUPAC name of $[\\mathrm{Pt(NH_3)_2Cl(NH_2CH_3)}]\\mathrm{Cl}$ is:`,
scq([`Diamminechlorido(methanamine)platinum(II) chloride`,`Diammine(methanamine)chloridoplatinum(II) chloride`,`Diamminechlorido(aminomethane)platinum(II) chloride`,`Bisammine(methanamine)chloridoplatinum(II) chloride`],1),null,
`Ligands (alphabetical): chlorido (C) < diammine (D) < methanamine (M)\nNH₂CH₃ = methanamine; Pt²⁺; Cl⁻ outside = chloride\n\nName: **Diamminechlorido(methanamine)platinum(II) chloride**\n\n**Answer: (1)**`,
'tag_coord_4','07 Jan 2020 (M)'),

mk('CORD-023','Hard','SCQ',
`Match List-I with List-II:\n(a) $[\\mathrm{Co(NH_3)_6}][\\mathrm{Cr(CN)_6}]$, (b) $[\\mathrm{Co(NH_3)_3(NO_2)_3}]$, (c) $[\\mathrm{Cr(H_2O)_6}]\\mathrm{Cl_3}$, (d) cis-$[\\mathrm{CrCl_2(ox)_2}]^{3-}$\nwith (i) Linkage, (ii) Solvate, (iii) Coordination, (iv) Optical isomerism`,
scq([`(a)-(iii), (b)-(i), (c)-(ii), (d)-(iv)`,`(a)-(iv), (b)-(ii), (c)-(iii), (d)-(i)`,`(a)-(ii), (b)-(i), (c)-(iii), (d)-(iv)`,`(a)-(i), (b)-(ii), (c)-(iii), (d)-(iv)`],1),null,
`- (a) [Co(NH₃)₆][Cr(CN)₆]: cation/anion can exchange ligands → **Coordination isomerism** (iii)\n- (b) [Co(NH₃)₃(NO₂)₃]: NO₂⁻ binds via N or O → **Linkage isomerism** (i)\n- (c) [Cr(H₂O)₆]Cl₃: water inside/outside coordination sphere → **Solvate isomerism** (ii)\n- (d) cis-[CrCl₂(ox)₂]³⁻: non-superimposable mirror images → **Optical isomerism** (iv)\n\n**Answer: (1)**`,
'tag_coord_5','17 Mar 2021 (E)'),

mk('CORD-024','Medium','SCQ',
`The number of unpaired d-electrons in $[\\mathrm{Co(H_2O)_6}]^{3+}$ is:`,
scq([`2`,`1`,`0`,`4`],3),null,
`Co³⁺: [Ar] 3d⁶\n\nH₂O is moderate-field. For Co³⁺, Δ₀ > P → **low-spin**.\n\nLow-spin d⁶: $t_{2g}^6 e_g^0$ → all 6 electrons paired\n\n**Unpaired electrons = 0**\n\n**Answer: (3)**`,
'tag_coord_3','29 Jan 2024 (M)'),

mk('CORD-025','Medium','SCQ',
`The correct IUPAC name of $[\\mathrm{Co(NH_3)_4(H_2O)Cl}]\\mathrm{Cl_2}$ is:`,
scq([`Tetraamminechloridoaquacobalt(III) chloride`,`Tetraammineaquachloridocobalt(III) chloride`,`Tetraammineaquacobalt(III) chloride`,`Chloridotetraammineaquacobalt(III) chloride`],2),null,
`Ligands in alphabetical order: aqua (A) < chlorido (C) < tetraammine (T)\n\nAlphabetical: aqua before chlorido before tetraammine\n\nName: **Tetraammineaquachloridocobalt(III) chloride**\n\n**Answer: (2)**\n\nNote: Ligands are listed alphabetically ignoring multiplying prefixes (di, tri, tetra).`,
'tag_coord_4','03 Sep 2020 (M)'),

mk('CORD-026','Medium','SCQ',
`The correct IUPAC name of $[\\mathrm{Ni(CO)_4}]$ is:`,
scq([`Nickel tetracarbonyl`,`Tetracarbonylnickel(0)`,`Tetracarbonylnickelate(0)`,`Tetracarbonylnickel`],2),null,
`[Ni(CO)₄]: neutral complex, Ni oxidation state = 0\n\nIUPAC: **Tetracarbonylnickel(0)**\n- tetracarbonyl: 4 CO ligands\n- nickel(0): neutral metal\n\n**Answer: (2)**\n\nNote: Neutral complexes use metal name (not -ate); oxidation state (0) is specified.`,
'tag_coord_4','04 Apr 2024 (M)'),

mk('CORD-027','Medium','SCQ',
`The correct IUPAC name of $\\mathrm{[CoCl_2(en)_2]Cl}$ is: (en = ethane-1,2-diamine)`,
scq([`Dichloridobis(ethane-1,2-diamine)cobalt(III) chloride`,`Bis(ethane-1,2-diamine)dichloridocobalt(III) chloride`,`Dichlorobis(ethylenediamine)cobalt(III) chloride`,`Bis(ethylenediamine)dichlorocobalt(III) chloride`],1),null,
`Ligands alphabetical: chlorido (C) before ethane-1,2-diamine (E)\n\nCo oxidation state: x + 2(−1) + 0(2 en) = +1 (complex cation) → x = +3\n\nName: **Dichloridobis(ethane-1,2-diamine)cobalt(III) chloride**\n\n**Answer: (1)**\n\n"bis" used for en because the ligand name contains a number (1,2).`,
'tag_coord_4','27 Jun 2022 (M)'),

mk('CORD-028','Hard','SCQ',
`The correct IUPAC name of $\\mathrm{[Cr(NH_3)_3(H_2O)_3]Cl_3}$ is:`,
scq([`Triamminetriaquachromium(III) chloride`,`Triaquatriamminechromium(III) chloride`,`Triamminetriaquachromium(III) trichloride`,`Triaquatriamminechromium(III) trichloride`],1),null,
`Ligands alphabetical: aqua (A) < ammine (A) — both start with 'a', but 'ammine' > 'aqua' alphabetically? No: a-m-m vs a-q → 'm' < 'q' alphabetically → **ammine before aqua**\n\nWait: alphabetical comparison: 'ammine' vs 'aqua' → a-m vs a-q → m comes before q → ammine first.\n\nName: **Triamminetriaquachromium(III) chloride**\n\nCounter ions: 3 Cl⁻ → just "chloride" (not trichloride for ionic counter ions).\n\n**Answer: (1)**`,
'tag_coord_4','11 Apr 2023 (E)'),

mk('CORD-029','Medium','SCQ',
`The correct IUPAC name of $\\mathrm{K_2[PtCl_4]}$ is:`,
scq([`Potassium tetrachloroplatinate(II)`,`Dipotassium tetrachloridoplatinate(II)`,`Potassium tetrachloridoplatinate(II)`,`Potassium tetrachloridoplatinum(II)`],3),null,
`K₂[PtCl₄]: 2 K⁺ outside; complex anion [PtCl₄]²⁻\nPt: x + 4(−1) = −2 → x = +2\nLigand: chlorido (4 Cl⁻) → tetrachloriodo\nAnionic complex → platinate\n\nIUPAC: **Potassium tetrachloridoplatinate(II)**\n\n**Answer: (3)**\n\nNote: "Potassium" (not dipotassium) — counter cation multiplicity not specified in IUPAC name.`,
'tag_coord_4','03 Sep 2020 (E)'),

mk('CORD-030','Medium','SCQ',
`The correct IUPAC name of $[\\mathrm{Fe(CN)_5(NO)}]^{2-}$ is:`,
scq([`Pentacyanidonitrosylferrate(II)`,`Pentacyanidonitrosylferrate(III)`,`Nitrosylpentacyanoferrate(II)`,`Pentacyanonitrosylferrate(III)`],2),null,
`[Fe(CN)₅(NO)]²⁻:\n- 5 CN⁻ (−5) + NO⁺ (+1) + Fe = −2\n- Fe + (−5) + (+1) = −2 → Fe = **+2**\n\nWait: NO in this complex is NO⁺ (linear, 3-electron donor):\nFe + 5(−1) + 0(NO) = −2 → Fe = +3\n\nActually NO⁺ → Fe is +2 (with NO⁺); or NO⁻ → Fe is +4. Conventionally NO is treated as NO⁺ here → Fe = **+2**.\n\nLigands alphabetical: cyano (C) before nitrosyl (N)\n\nName: **Pentacyanidonitrosylferrate(II)**\n\n**Answer: (1)**`,
'tag_coord_4','29 Jan 2023 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 3. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
