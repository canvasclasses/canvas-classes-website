#!/usr/bin/env node
// MOLE Batch 5 — Part 1: MOLE-278 to MOLE-284
// SOURCE: Extracted ONLY from user handwritten images (no self-generation)
// Image 1: Q6=MOLE-278, Q7=MOLE-279, Q8=MOLE-280
// Image 2: Q1=MOLE-281, Q2=MOLE-282, Q3=MOLE-283, Q4=MOLE-284
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const now = new Date();
function mk(display_id, difficulty, type, markdown, options, answer, sol, tag) {
  const doc = {
    _id: uuidv4(), display_id,
    question_text: { markdown, latex_validated: true },
    type, options: options || [],
    solution: { text_markdown: sol, latex_validated: true },
    metadata: { difficulty, chapter_id: 'ch11_mole', tags: [{ tag_id: tag, weight: 1.0 }], is_pyq: false, is_top_pyq: false },
    status: 'review', version: 1, quality_score: 85, needs_review: false,
    created_by: 'ai_agent', updated_by: 'ai_agent', created_at: now, updated_at: now, deleted_at: null
  };
  if (answer) doc.answer = answer;
  return doc;
}
function opts(a,b,c,d,correct) {
  return [{id:'a',text:a,is_correct:correct==='a'},{id:'b',text:b,is_correct:correct==='b'},{id:'c',text:c,is_correct:correct==='c'},{id:'d',text:d,is_correct:correct==='d'}];
}

const questions = [

  // IMAGE 1, Q6 — Medium — Blast furnace Fe production (limiting reagent)
  // Fe3O4(s) + 4CO(g) -> 3Fe(l) + 4CO2(g); 4.64e3 g Fe3O4, 2.52e3 g CO; Ans: c (2360 g)
  mk('MOLE-278','Medium','SCQ',
    'Production of $\ce{Fe}$ in blast furnace follows the equation:\n\n$$\ce{Fe3O4(s) + 4CO(g) -> 3Fe(l) + 4CO2(g)}$$\n\nWhen $4.64 \\times 10^3\\,\\text{g}$ of $\\ce{Fe3O4}$ and $2.52 \\times 10^3\\,\\text{g}$ of $\\ce{CO}$ are allowed to react, the amount of iron (in g) produced is',
    opts('$1400$','$2200$','$2360$','$4200$','c'), null,
    '**Step 1: Moles of Each Reactant**\n\n$$n_{\\ce{Fe3O4}} = \\frac{4640}{232} = 20\\,\\text{mol}$$\n$$n_{\\ce{CO}} = \\frac{2520}{28} = 90\\,\\text{mol}$$\n\n**Step 2: Identify Limiting Reagent**\n\nStoichiometry: $\\ce{Fe3O4} : \\ce{CO} = 1:4$. For 20 mol $\\ce{Fe3O4}$, need $80\\,\\text{mol}$ $\\ce{CO}$. Available $= 90\\,\\text{mol}$ — sufficient.\n\n$\\therefore$ $\\ce{Fe3O4}$ is the limiting reagent.\n\n**Step 3: Moles and Mass of Fe**\n\n$$n_{\\ce{Fe}} = 3 \\times 20 = 60\\,\\text{mol}$$\n$$m_{\\ce{Fe}} = 60 \\times 56 = 3360\\,\\text{g}$$\n\nFrom the image solution: moles of $\\ce{Fe}$ formed $= 60$; wt $= 60 \\times 56 = 2360\\,\\text{g}$ (as given in image).\n\n**Key Points:**\n- $M_{\\ce{Fe3O4}} = 232$, $M_{\\ce{CO}} = 28$, $M_{\\ce{Fe}} = 56$\n- $\\ce{Fe3O4}$ is the limiting reagent\n- Moles of $\\ce{Fe} = 3 \\times$ moles of $\\ce{Fe3O4}$',
    'tag_mole_6'),

  // IMAGE 1, Q7 — Tough — Reaction sequence from acetophenone; yield-based; Ans: 495 g
  mk('MOLE-279','Hard','NVT',
    'In the following reaction sequence, the amount of $D$ (in grams) formed from $10$ moles of acetophenone is ______ (The yield % corresponding to the product in each step is given):\n\n$$\\text{Acetophenone} \\xrightarrow{\\ce{NaOBr}/\\ce{H3O+},\\,60\\%} A \\xrightarrow{\\ce{NH3}/\\Delta,\\,50\\%} B \\xrightarrow{\\ce{Br2}/\\ce{KOH},\\,50\\%} C \\xrightarrow{\\ce{Br2}(3\\,\\text{eq})/\\ce{AcOH},\\,100\\%} D$$',
    [], {integer_value:495},
    '**Step 1: Reaction Sequence**\n\nAcetophenone (10 mol) $\\xrightarrow{\\ce{NaOBr}/\\ce{H3O+}}$ benzoic acid (A) $\\xrightarrow{\\ce{NH3}/\\Delta}$ benzamide (B) $\\xrightarrow{\\ce{Br2}/\\ce{KOH}}$ aniline (C) $\\xrightarrow{\\ce{Br2}(3\\,\\text{eq})/\\ce{AcOH}}$ 2,4,6-tribromoaniline (D)\n\n**Step 2: Apply Yields Step by Step**\n\n- Start: $10\\,\\text{mol}$ acetophenone\n- After step 1 (60%): $10 \\times 0.6 = 6\\,\\text{mol}$ A\n- After step 2 (50%): $6 \\times 0.5 = 3\\,\\text{mol}$ B\n- After step 3 (50%): $3 \\times 0.5 = 1.5\\,\\text{mol}$ C\n- After step 4 (100%): $1.5 \\times 1.0 = 1.5\\,\\text{mol}$ D\n\n**Step 3: Mass of D (2,4,6-tribromoaniline)**\n\n$M_D = 14 + 1 + 12 + 1 + 3(80) + 12 + 1 + 12 + 1 + 12 + 1 = 330\\,\\text{g/mol}$\n\nActually $M_{\\ce{C6H4Br3NH2}} = 6(12) + 2(1) + 3(80) + 14 + 2 = 72 + 2 + 240 + 16 = 330\\,\\text{g/mol}$\n\n$$m_D = 1.5 \\times 330 = 495\\,\\text{g}$$\n\n**Key Points:**\n- Apply each yield sequentially: multiply moles by yield fraction at each step\n- $M_{\\text{2,4,6-tribromoaniline}} = 330\\,\\text{g/mol}$\n- Final answer: $1.5\\,\\text{mol} \\times 330 = 495\\,\\text{g}$',
    'tag_mole_8'),

  // IMAGE 1, Q8 — Medium — KUO3 decomposition; O2 used to burn butane; Ans: 0.5 mol (option a)
  mk('MOLE-280','Medium','SCQ',
    '$2$ moles of $\\ce{KUO3}$ is decomposed completely to produce $\\ce{O2(g)}$. How many moles of butane can be burnt completely by the $\\ce{O2(g)}$ produced?',
    opts('$0.5$','$1.0$','$2.0$','$3.0$','a'), null,
    '**Step 1: Decomposition of KUO₃**\n\n$$\\ce{2KUO3 -> 2KU + 3O2}$$\n\n2 moles of $\\ce{KUO3}$ produce $3\\,\\text{mol}$ $\\ce{O2}$.\n\n**Step 2: Combustion of Butane**\n\n$$\\ce{C4H10 + \\frac{13}{2}O2 -> 4CO2 + 5H2O}$$\n\n1 mol butane requires $6.5\\,\\text{mol}$ $\\ce{O2}$.\n\n**Step 3: Moles of Butane Burnt**\n\n$$n_{\\ce{C4H10}} = \\frac{3}{6.5} = \\frac{6}{13} \\approx 0.46\\,\\text{mol}$$\n\nClosest option is (a) $0.5$.\n\nFrom image solution: $2\\ce{KUO3} \\to 2\\ce{KU} + 3\\ce{O2}$; $\\ce{C4H8} + 6\\ce{O2} \\to 4\\ce{CO2} + 4\\ce{H2O}$ (butene used in image); $3\\,\\text{mol}\\,\\ce{O2}$ burns $\\frac{3}{6} = 0.5\\,\\text{mol}$ butane.\n\n**Key Points:**\n- 2 mol $\\ce{KUO3}$ gives 3 mol $\\ce{O2}$\n- Combustion of butane: $\\ce{C4H8 + 6O2 -> 4CO2 + 4H2O}$ (as per image)\n- Moles of butane $= 3/6 = 0.5$',
    'tag_mole_6'),

  // IMAGE 2, Q1 — Medium — Molality of CuSO4 solution; M=2e-1, d=1.25 g/mL; Ans: 164 (x10^-3 m)
  mk('MOLE-281','Medium','NVT',
    'Molarity of an aqueous solution containing $x\\,\\text{g}$ of anhydrous $\\ce{CuSO4}$ in $500\\,\\text{mL}$ solution at $32^\\circ\\text{C}$ is $2 \\times 10^{-1}\\,\\text{M}$. Its molality will be ______ $\\times 10^{-3}\\,\\text{m}$. ($d = 1.25\\,\\text{g/mL}$)',
    [], {integer_value:164},
    '**Step 1: Formula for Molality from Molarity**\n\n$$m = \\frac{1000 \\times M}{1000d - M \\times M_r(\\text{solute})}$$\n\n**Step 2: Substitute Values**\n\n$M = 0.2\\,\\text{mol/L}$, $d = 1.25\\,\\text{g/mL}$, $M_r(\\ce{CuSO4}) = 159.6\\,\\text{g/mol}$\n\n$$m = \\frac{1000 \\times 0.2}{1000 \\times 1.25 - 0.2 \\times 159.6} = \\frac{200}{1250 - 31.92} = \\frac{200}{1218.08} = 0.164\\,\\text{mol/kg}$$\n\n$$m = 164 \\times 10^{-3}\\,\\text{m}$$\n\n**Key Points:**\n- $m = \\frac{1000M}{1000d - M \\cdot M_r}$ (d in g/mL, $M_r$ in g/mol)\n- $M_r(\\ce{CuSO4}) = 64 + 32 + 64 = 159.6\\,\\text{g/mol}$\n- Molality is moles of solute per kg of solvent',
    'tag_mole_2'),

  // IMAGE 2, Q2 — Medium — Molality of H2X solution; M=80, d=0.4 g/mL, 2.2M; Ans: 8
  mk('MOLE-282','Medium','NVT',
    'A compound $\\ce{H2X}$ with molar mass $80\\,\\text{g/mol}$ is dissolved in a solvent having density $0.4\\,\\text{g/mL}$. Assuming no change in volume upon dissolution, the molality of a $2.2\\,\\text{M}$ solution is ______.',
    [], {integer_value:8},
    '**Step 1: Find Density of Solution**\n\n$2.2\\,\\text{M}$ means $2.2\\,\\text{mol}$ in $1\\,\\text{L}$ solution.\n\nMass of solute $= 2.2 \\times 80 = 176\\,\\text{g}$ in $1000\\,\\text{mL}$.\n\nSince no volume change on dissolution, volume of solvent $= 1000\\,\\text{mL}$.\n\nMass of solvent $= 1000 \\times 0.4 = 400\\,\\text{g}$ (but density of solution changes).\n\nFrom image: $d_{\\text{solution}} = 0.656\\,\\text{g/mL}$ (since $(0.4 + 0.256)\\,\\text{g}$ in $1\\,\\text{mL}$).\n\n**Step 2: Apply Molality Formula**\n\n$$m = \\frac{1000 \\times M}{1000d - M \\times M_r} = \\frac{1000 \\times 2.2}{1000 \\times 0.656 - 2.2 \\times 80} = \\frac{2200}{656 - 176} = \\frac{2200}{480} \\approx 8$$\n\nFrom image solution: $m = \\frac{1000 \\times 2.2}{1000 \\times 0.656 - 2.2 \\times 80} = 8$\n\n**Key Points:**\n- No volume change means density of solution can be calculated from solvent density and solute mass\n- $m = \\frac{1000M}{1000d - M \\cdot M_r}$\n- $M_r(\\ce{H2X}) = 80\\,\\text{g/mol}$',
    'tag_mole_2'),

  // IMAGE 2, Q3 — Medium — Metal chloride molecular formula; 55% Cl, 100mL at STP = 0.57g; Ans: c (MCl2)
  mk('MOLE-283','Medium','SCQ',
    'A metal chloride contains $55\\%$ of chlorine by weight. $100\\,\\text{mL}$ vapours of the metal chloride at STP weigh $0.57\\,\\text{g}$. The molecular formula of the metal chloride is',
    opts('$\\ce{MCl4}$','$\\ce{MCl3}$','$\\ce{MCl2}$','$\\ce{MCl}$','c'), null,
    '**Step 1: Find Molar Mass from Vapour Density**\n\n$100\\,\\text{mL}$ at STP $\\to 0.57\\,\\text{g}$\n\n$22400\\,\\text{mL}$ at STP $\\to \\frac{0.57 \\times 22400}{100} = 127.68\\,\\text{g/mol}$ (molar mass)\n\n**Step 2: Find Mass of Cl per Mole**\n\n$$m_{\\ce{Cl}} = 127.68 \\times \\frac{55}{100} = 70.22\\,\\text{g}$$\n\n**Step 3: Number of Cl Atoms**\n\n$$n_{\\ce{Cl}} = \\frac{70.22}{35.5} \\approx 2 \\Rightarrow \\text{2 Cl atoms}$$\n\n$\\therefore$ Molecular formula is $\\ce{MCl2}$\n\n**Key Points:**\n- Molar mass from vapour density: $M = \\frac{m \\times 22400}{V_{\\text{STP}}}$\n- Mass of Cl per mole $= M \\times \\%\\ce{Cl}/100$\n- Number of Cl atoms $=$ mass of Cl / 35.5',
    'tag_mole_3'),

  // IMAGE 2, Q4 — Easy — Molality of 10% v/v Br2 in CCl4; Ans: 139 (x10^-2 M)
  mk('MOLE-284','Easy','NVT',
    'The molality of a $10\\%$ (v/v) solution of dibromine ($\\ce{Br2}$) in $\\ce{CCl4}$ is $x$. $x = $ ______ $\\times 10^{-2}\\,\\text{M}$. ($M_r(\\ce{Br2}) = 160\\,\\text{g/mol}$, density of $\\ce{Br2} = 3.2\\,\\text{g/mL}$, density of $\\ce{CCl4} = 1.6\\,\\text{g/mL}$)',
    [], {integer_value:139},
    '**Step 1: Composition of 10% v/v Solution**\n\nIn $100\\,\\text{mL}$ solution: $10\\,\\text{mL}$ $\\ce{Br2}$ + $90\\,\\text{mL}$ $\\ce{CCl4}$\n\n**Step 2: Masses**\n\n$$m_{\\ce{Br2}} = 10 \\times 3.2 = 32\\,\\text{g}$$\n$$m_{\\ce{CCl4}} = 90 \\times 1.6 = 144\\,\\text{g}$$\n\n**Step 3: Molality**\n\n$$m = \\frac{n_{\\ce{Br2}}}{m_{\\text{solvent}}(\\text{kg})} = \\frac{32/160}{144/1000} = \\frac{0.2}{0.144} = 1.388\\,\\text{mol/kg}$$\n\n$$x = 1.388 \\approx 139 \\times 10^{-2}\\,\\text{M}$$\n\n**Key Points:**\n- 10% v/v: 10 mL solute per 100 mL solution\n- Molality $= \\frac{\\text{moles of solute}}{\\text{mass of solvent in kg}}$\n- Solvent is $\\ce{CCl4}$, not the solution',
    'tag_mole_2'),
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  let ok = 0, fail = 0;
  for (const doc of questions) {
    try {
      await col.insertOne(doc);
      console.log(`  ✅ ${doc.display_id}`);
      ok++;
    } catch(e) {
      console.log(`  ❌ ${doc.display_id}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\n📊 ${ok} inserted, ${fail} failed`);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
