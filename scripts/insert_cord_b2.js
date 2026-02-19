// insert_cord_b2.js — CORD-011 to CORD-020
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
mk('CORD-011','Medium','SCQ',
`Which of the following is the correct order of ligand field strength?`,
scq([`$\\mathrm{CO} < en < \\mathrm{NH_3} < \\mathrm{C_2O_4^{2-}} < \\mathrm{S}^{2-}$`,`$\\mathrm{S}^{2-} < \\mathrm{C_2O_4^{2-}} < \\mathrm{NH_3} < en < \\mathrm{CO}$`,`$\\mathrm{NH_3} < en < \\mathrm{CO} < \\mathrm{S}^{2-} < \\mathrm{C_2O_4^{2-}}$`,`$\\mathrm{S}^{2-} < \\mathrm{NH_3} < en < \\mathrm{CO} < \\mathrm{C_2O_4^{2-}}$`],2),null,
`Spectrochemical series (increasing): S²⁻ < C₂O₄²⁻ < H₂O < NH₃ < en < CN⁻ < CO\n\nOption (2): S²⁻ < C₂O₄²⁻ < NH₃ < en < CO ✓\n\nen > NH₃ (chelate effect + better σ-donor); CO is strongest (synergic bonding).\n\n**Answer: (2)**`,
'tag_coord_1','30 Jan 2023 (M)'),

mk('CORD-012','Medium','SCQ',
`Which of the following are examples of double salt?\n(A) $\\mathrm{FeSO_4\\cdot(NH_4)_2SO_4\\cdot 6H_2O}$\n(B) $\\mathrm{CuSO_4\\cdot 4NH_3\\cdot H_2O}$\n(C) $\\mathrm{K_2SO_4\\cdot Al_2(SO_4)_3\\cdot 24H_2O}$\n(D) $\\mathrm{Fe(CN)_2\\cdot 4KCN}$`,
scq([`A and C only`,`A and B only`,`A, B and D only`,`B and D only`],1),null,
`Double salt: loses identity in solution (individual ions released).\nComplex salt: retains coordination sphere in solution.\n\n- (A) Mohr's salt → **double salt** ✓\n- (B) CuSO₄·4NH₃ → complex (forms [Cu(NH₃)₄]²⁺)\n- (C) Potash alum → **double salt** ✓\n- (D) Fe(CN)₂·4KCN → complex (forms [Fe(CN)₆]⁴⁻)\n\n**Answer: (1) A and C only**`,
'tag_coord_1','01 Feb 2023 (M)'),

mk('CORD-013','Medium','NVT',
`The sum of oxidation states of two silver ions in $[\\mathrm{Ag(NH_3)_2}][\\mathrm{Ag(CN)_2}]$ is ____`,
[],2,
`Cation $[\\mathrm{Ag(NH_3)_2}]^+$: NH₃ neutral → Ag = **+1**\n\nAnion $[\\mathrm{Ag(CN)_2}]^-$: 2 CN⁻ (−2 total) → Ag + (−2) = −1 → Ag = **+1**\n\nSum = +1 + (+1) = **2**\n\n**Answer: 2**`,
'tag_coord_1','01 Sep 2021 (E)'),

mk('CORD-014','Medium','SCQ',
`Match: (a) Chlorophyll, (b) Vitamin-B₁₂, (c) Anticancer drug, (d) Grubbs catalyst\nwith (i) Ru, (ii) Pt, (iii) Co, (iv) Mg`,
scq([`a-iii, b-ii, c-iv, d-i`,`a-iv, b-iii, c-ii, d-i`,`a-iv, b-iii, c-i, d-ii`,`a-iv, b-ii, c-iii, d-i`],2),null,
`- Chlorophyll → **Mg** (iv)\n- Vitamin B₁₂ → **Co** (iii)\n- Cisplatin (anticancer) → **Pt** (ii)\n- Grubbs catalyst → **Ru** (i)\n\n**Answer: (2) a-iv, b-iii, c-ii, d-i**\n\nMemory aid: Mg-Chlorophyll, Co-B₁₂, Pt-Cisplatin, Ru-Grubbs, Rh-Wilkinson`,
'tag_coord_7','18 Mar 2021 (M)'),

mk('CORD-015','Easy','NVT',
`The total number of coordination sites in $\\mathrm{EDTA}^{4-}$ is ____`,
[],6,
`EDTA structure: $(\\mathrm{HOOCCH_2})_2\\mathrm{N-CH_2-CH_2-N(CH_2COOH)_2}$\n\nDonor atoms:\n- 2 N atoms (amine groups)\n- 4 O atoms (carboxylate groups, one O each)\n\nTotal = **6** → EDTA is hexadentate.\n\n**Answer: 6**`,
'tag_coord_1','05 Sep 2020 (M)'),

mk('CORD-016','Medium','SCQ',
`The coordination numbers of Co and Al in $[\\mathrm{Co(Cl)(en)_2}]\\mathrm{Cl}$ and $\\mathrm{K_3[Al(C_2O_4)_3]}$ respectively are: (en = ethane-1,2-diamine)`,
scq([`3 and 3`,`5 and 3`,`5 and 6`,`6 and 6`],4),null,
`**Co in [Co(Cl)(en)₂]Cl:**\n- 1 Cl⁻ (monodentate) = 1\n- 2 en (bidentate each) = 4\n- CN(Co) = **6**\n\n**Al in K₃[Al(C₂O₄)₃]:**\n- 3 oxalate (bidentate each) = 6\n- CN(Al) = **6**\n\n**Answer: (4) 6 and 6**`,
'tag_coord_1','12 Apr 2019 (E)'),

mk('CORD-017','Easy','SCQ',
`The compound used in the treatment of lead poisoning is:`,
scq([`Desferrioxime B`,`EDTA`,`Cis-platin`,`D-penicillamine`],2),null,
`**EDTA** chelates heavy metal ions (Pb²⁺, Hg²⁺, etc.) forming stable water-soluble complexes excreted in urine.\n\n- Desferrioxime B: iron overload\n- Cisplatin: anticancer\n- D-penicillamine: Wilson's disease (Cu²⁺), rheumatoid arthritis\n\n**Answer: (2) EDTA**`,
'tag_coord_7','12 Apr 2019 (E)'),

mk('CORD-018','Medium','SCQ',
`The coordination number of Th in $\\mathrm{K_4[Th(C_2O_4)_4(H_2O)_2]}$ is:`,
scq([`14`,`6`,`8`,`10`],4),null,
`Ligands in $[\\mathrm{Th(C_2O_4)_4(H_2O)_2}]^{4-}$:\n- 4 oxalate (bidentate) = 4 × 2 = 8\n- 2 H₂O (monodentate) = 2\n\nCN(Th) = 8 + 2 = **10**\n\n**Answer: (4) 10**\n\nLanthanides/actinides can have high CN (8–12) due to large ionic radii.`,
'tag_coord_1','11 Jan 2019 (E)'),

mk('CORD-019','Medium','SCQ',
`The correct IUPAC name of $[\\mathrm{PtBr_2(PMe_3)_2}]$ is:`,
scq([`dibromodi(trimethylphosphine)platinum(II)`,`bis(trimethylphosphine)dibromoplatinum(II)`,`dibromobis(trimethylphosphine)platinum(II)`,`bis[bromo(trimethylphosphine)]platinum(II)`],3),null,
`IUPAC naming rules:\n1. Ligands alphabetical: bromo (B) before trimethylphosphine (T)\n2. "bis" for complex ligand names\n3. Metal + oxidation state last\n\nName: **dibromobis(trimethylphosphine)platinum(II)**\n\n**Answer: (3)**`,
'tag_coord_4','06 Apr 2024 (E)'),

mk('CORD-020','Medium','SCQ',
`The correct IUPAC name of $\\mathrm{K_2MnO_4}$ is:`,
scq([`Potassium tetraoxopermanganate(VI)`,`Potassium tetraoxidomanganate(VI)`,`Dipotassium tetraoxidomanganate(VII)`,`Potassium tetraoxidomanganese(VI)`],2),null,
`Mn oxidation state: 2(+1) + x + 4(−2) = 0 → x = **+6**\n\nIUPAC: **Potassium tetraoxidomanganate(VI)**\n- tetraoxido: 4 O²⁻ ligands\n- manganate: anionic complex\n- (VI): Mn is +6\n\nNote: KMnO₄ is permanganate (Mn = +7); K₂MnO₄ is manganate (Mn = +6).\n\n**Answer: (2)**`,
'tag_coord_4','29 Jan 2024 (E)'),
];

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  const col=mongoose.connection.db.collection('questions_v2');
  for(const q of questions){
    await col.updateOne({display_id:q.display_id},{$setOnInsert:q},{upsert:true});
  }
  const count=await col.countDocuments({display_id:{$regex:'^CORD-'}});
  console.log(`Inserted batch 2. Total CORD questions in DB: ${count}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
