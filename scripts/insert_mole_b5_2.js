#!/usr/bin/env node
// MOLE Batch 5 — Part 2: MOLE-285 to MOLE-290
// SOURCE: Extracted ONLY from user handwritten images (no self-generation)
// Image 3: Q5=MOLE-285, Q6=MOLE-286, Q7=MOLE-287
// Image 4: Q8=MOLE-288, Q9=MOLE-289, Q10=MOLE-290
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

  // IMAGE 3, Q5 — Medium — % composition of C and H from combustion data
  // 750g organic compound → 420g CO2 + 210g H2O; % C = 15.2, % H = 3.11; Ans: 3
  mk('MOLE-285','Medium','NVT',
    'Complete combustion of $750\\,\\text{g}$ of an organic compound provides $420\\,\\text{g}$ of $\\ce{CO2}$ and $210\\,\\text{g}$ of $\\ce{H2O}$. The $\\%$ composition of $\\text{C}$ and $\\text{H}$ in the organic compound is $15.2$ and ______.',
    [], {decimal_value:3.11},
    '**Step 1: Moles of C from CO₂**\n\n$$n_{\\ce{C}} = n_{\\ce{CO2}} = \\frac{420}{44} = 9.545\\,\\text{mol}$$\n\n**Step 2: % of Carbon**\n\n$$\\%\\,\\ce{C} = \\frac{9.545 \\times 12}{750} \\times 100 = \\frac{114.5}{750} \\times 100 = 15.27\\% \\approx 15.2\\%$$\n\n**Step 3: Moles of H from H₂O**\n\n$$n_{\\ce{H}} = 2 \\times n_{\\ce{H2O}} = 2 \\times \\frac{210}{18} = 2 \\times 11.67 = 23.33\\,\\text{mol}$$\n\n**Step 4: % of Hydrogen**\n\n$$\\%\\,\\ce{H} = \\frac{23.33 \\times 1}{750} \\times 100 = \\frac{23.33}{750} \\times 100 = 3.11\\%$$\n\n**Key Points:**\n- All C in compound → $\\ce{CO2}$; all H → $\\ce{H2O}$\n- $n_{\\ce{C}} = n_{\\ce{CO2}}$; $n_{\\ce{H}} = 2 \\times n_{\\ce{H2O}}$\n- % element $= \\frac{n \\times M_{\\text{element}}}{m_{\\text{sample}}} \\times 100$',
    'tag_mole_5'),

  // IMAGE 3, Q6 — Medium — Gaseous hydrocarbon CxHy; 6 vol O2, 4 vol CO2; find y
  // CxHy + 6O2 → xCO2 + y/2 H2O; x=4 from CO2, y=8; Ans: 8
  mk('MOLE-286','Medium','NVT',
    'The formula of a gaseous hydrocarbon which requires $6$ times its own volume of $\\ce{O2}$ for complete oxidation and produces $4$ times its own volume of $\\ce{CO2}$ is $\\ce{C_xH_y}$. The value of $y$ is ______.',
    [], {integer_value:8},
    '**Step 1: Write Combustion Equation**\n\n$$\\ce{C_xH_y + \\left(x + \\frac{y}{4}\\right) O2 -> x CO2 + \\frac{y}{2} H2O}$$\n\n**Step 2: Use CO₂ Volume Ratio**\n\nProduces 4 times its own volume of $\\ce{CO2}$:\n$$x = 4$$\n\n**Step 3: Use O₂ Volume Ratio**\n\nRequires 6 times its own volume of $\\ce{O2}$:\n$$x + \\frac{y}{4} = 6 \\Rightarrow 4 + \\frac{y}{4} = 6 \\Rightarrow \\frac{y}{4} = 2 \\Rightarrow y = 8$$\n\n**Step 4: Verify**\n\nFrom image: $2x + \\frac{y}{2} = 12 \\Rightarrow 8 + \\frac{y}{2} = 12 \\Rightarrow \\frac{y}{2} = 4 \\Rightarrow y = 8$ ✓\n\n**Key Points:**\n- At constant T and P, volumes are proportional to moles\n- $x$ = coefficient of $\\ce{CO2}$ = volume ratio of $\\ce{CO2}$ to hydrocarbon\n- $x + y/4$ = coefficient of $\\ce{O2}$ = volume ratio of $\\ce{O2}$ to hydrocarbon',
    'tag_mole_5'),

  // IMAGE 3, Q7 — Medium — Saturated acyclic organic compound X; C:H mass% = 4:1, C:O = 3:4; O2 for 2 mol X
  // C:H = 4:1 → 12g:3g → 1:3 atom ratio... C1H3O1 → CH3O → C2H6O2; 2mol X needs 5 mol O2; Ans: 5
  mk('MOLE-287','Medium','NVT',
    'The ratio of the mass percentages of $\\text{C}$ \\& $\\text{H}$ and $\\text{C}$ \\& $\\text{O}$ of a saturated acyclic organic compound $X$ are $4:1$ and $3:4$ respectively. Then, the number of moles of oxygen gas required for complete combustion of two moles of organic compound $X$ is ______.',
    [], {integer_value:5},
    '**Step 1: Find Empirical Formula**\n\n$\\%\\,\\ce{C} : \\%\\,\\ce{H} = 4:1$ (by mass) → $12\\,\\text{g C} : 3\\,\\text{g H}$ → $1:3$ atom ratio\n\n$\\%\\,\\ce{C} : \\%\\,\\ce{O} = 3:4$ (by mass) → $12\\,\\text{g C} : 16\\,\\text{g O}$ → $1:1$ atom ratio\n\nSo $\\ce{C} : \\ce{H} : \\ce{O} = 1:3:1$ → empirical formula $\\ce{CH3O}$\n\nFor a saturated acyclic compound: molecular formula $\\ce{C2H6O2}$ (ethylene glycol)\n\n**Step 2: Combustion Equation**\n\n$$\\ce{C2H6O2 + \\frac{5}{2}O2 -> 2CO2 + 3H2O}$$\n\n**Step 3: O₂ for 2 Moles of X**\n\n$$n_{\\ce{O2}} = 2 \\times \\frac{5}{2} = 5\\,\\text{mol}$$\n\n**Key Points:**\n- Use mass % ratios to find atom ratios (divide by atomic mass)\n- Empirical formula $\\ce{CH3O}$ → molecular formula $\\ce{C2H6O2}$\n- From image: $\\ce{C2H6O2 + \\frac{5}{2}O2 -> 2CO2 + 3H2O}$; for 2 mol $\\ce{C2H6O2}$, need 5 mol $\\ce{O2}$',
    'tag_mole_5'),

  // IMAGE 4, Q8 — Medium — Empirical formula of CxHyOz; C:H mass% = 6:1; O = half needed to burn CxHy; Ans: d (C2H4O3)
  mk('MOLE-288','Medium','SCQ',
    'The ratio of mass $\\%$ of $\\text{C}$ \\& $\\text{H}$ of an organic compound $\\ce{C_xH_yO_z}$ is $6:1$. If one molecule of the above compound contains half as much oxygen as required to burn one molecule of compound $\\ce{C_xH_y}$ completely to $\\ce{CO2}$ and $\\ce{H2O}$. The empirical formula of compound $\\ce{C_xH_yO_z}$ is',
    opts('$\\ce{C3H6O3}$','$\\ce{C2H4O}$','$\\ce{C2H4O2}$','$\\ce{C2H4O3}$','d'), null,
    '**Step 1: Find C:H Atom Ratio**\n\n$\\%\\,\\ce{C} : \\%\\,\\ce{H} = 6:1$ by mass → $6\\,\\text{g C} : 1\\,\\text{g H}$ → atom ratio $= \\frac{6}{12} : \\frac{1}{1} = 0.5:1 = 1:2$\n\nSo $x:y = 1:2$, i.e. $\\ce{C_xH_{2x}}$\n\n**Step 2: O₂ Needed to Burn $\\ce{C_xH_{2x}}$**\n\n$$\\ce{C_xH_{2x} + \\left(x + \\frac{2x}{4}\\right) O2 -> x CO2 + x H2O}$$\n\n$$\\text{O atoms needed} = 2x + x = 3x \\Rightarrow z_{\\text{O atoms in compound}} = \\frac{3x}{2} \\cdot \\frac{1}{1}$$\n\nActually: $\\ce{O2}$ needed $= \\frac{4x+2x}{4} = \\frac{6x}{4} = \\frac{3x}{2}$ mol $\\ce{O2}$ = $3x$ O atoms.\n\nHalf of this $= \\frac{3x}{2}$ O atoms in the compound.\n\n**Step 3: Try x=1, y=2**\n\n$z = \\frac{3 \\times 1}{2} = 1.5$ (not integer)\n\n**Try x=2, y=4:**\n\n$\\ce{C2H4}$ needs $\\frac{4(2)+4}{4} = 3\\,\\text{mol}$ $\\ce{O2}$ = 6 O atoms. Half $= 3$ O atoms → $z=3$\n\nEmpirical formula: $\\ce{C2H4O3}$\n\nFrom image: $z = \\frac{4x+y}{4}$; for $x=2, y=4$: $z = \\frac{12}{4} = 3$ → $\\ce{C2H4O3}$ ✓\n\n**Key Points:**\n- C:H mass ratio 6:1 → atom ratio 1:2\n- O in compound = half the O atoms needed to combust $\\ce{C_xH_y}$\n- Check integer values: $x=2, y=4, z=3$ → $\\ce{C2H4O3}$',
    'tag_mole_5'),

  // IMAGE 4, Q9 — Easy — Incorrect statement about H2O2; Ans: a
  mk('MOLE-289','Easy','SCQ',
    'From the following statements regarding $\\ce{H2O2}$, choose the incorrect statement:',
    opts('It can act only as an oxidising agent','It decomposes on exposure to light','It has to be stored in plastic or wax lined glass bottles in dark','It has to be kept away from dust','a'), null,
    '**Step 1: Analyse Each Statement**\n\n**(a) It can act only as an oxidising agent** — **INCORRECT**\n\n$\\ce{H2O2}$ can act as both an oxidising agent AND a reducing agent depending on the reaction partner. For example:\n- As oxidising agent: $\\ce{H2O2 + 2KI -> I2 + 2KOH}$\n- As reducing agent: $\\ce{H2O2 + 2KMnO4 + 3H2SO4 -> 2MnSO4 + K2SO4 + 5O2 + 8H2O}$\n\n**(b) It decomposes on exposure to light** — Correct. $\\ce{2H2O2 ->[$h\\nu$] 2H2O + O2}$\n\n**(c) Stored in plastic or wax lined bottles in dark** — Correct. Glass catalyses decomposition.\n\n**(d) Kept away from dust** — Correct. Dust particles catalyse decomposition.\n\n**Key Points:**\n- $\\ce{H2O2}$ is amphoteric in redox behaviour — both oxidiser and reducer\n- Statement (a) is incorrect because it ignores its role as a reducing agent\n- This is a standard property of $\\ce{H2O2}$',
    'tag_mole_7'),

  // IMAGE 4, Q10 — Medium — Purity of H2O2; 0.2g reacts with 0.316g KMnO4 in acid; Ans: 85%
  mk('MOLE-290','Medium','NVT',
    'A $20\\,\\text{mL}$ solution containing $0.2\\,\\text{g}$ impure $\\ce{H2O2}$ reacts completely with $0.316\\,\\text{g}$ of $\\ce{KMnO4}$ in acid solution. The purity of $\\ce{H2O2}$ (in $\\%$) is ______. ($M_r(\\ce{KMnO4}) = 158$)',
    [], {integer_value:85},
    '**Step 1: Reaction in Acid Solution**\n\n$$\\ce{2KMnO4 + 5H2O2 + 3H2SO4 -> 2MnSO4 + K2SO4 + 5O2 + 8H2O}$$\n\nEquivalents: $n$-factor of $\\ce{KMnO4} = 5$; $n$-factor of $\\ce{H2O2} = 2$\n\n**Step 2: Equivalents of KMnO₄**\n\n$$\\text{eq of }\\ce{KMnO4} = \\frac{0.316}{158} \\times 5 = 0.01\\,\\text{eq}$$\n\n**Step 3: Equivalents of H₂O₂ = Equivalents of KMnO₄**\n\n$$\\text{eq of }\\ce{H2O2} = 0.01$$\n\n$$n_{\\ce{H2O2}} = \\frac{0.01}{2} = 0.005\\,\\text{mol}$$\n\n**Step 4: Mass of Pure H₂O₂**\n\n$$m_{\\ce{H2O2}} = 0.005 \\times 34 = 0.17\\,\\text{g}$$\n\n**Step 5: Purity**\n\n$$\\%\\,\\text{purity} = \\frac{0.17}{0.2} \\times 100 = 85\\%$$\n\n**Key Points:**\n- Use equivalent concept: eq of oxidant = eq of reductant\n- $n$-factor of $\\ce{KMnO4}$ in acid $= 5$ ($\\ce{Mn}$: $+7 \\to +2$)\n- $n$-factor of $\\ce{H2O2}$ as reductant $= 2$ ($\\ce{O}$: $-1 \\to 0$)\n- $M_r(\\ce{H2O2}) = 34\\,\\text{g/mol}$',
    'tag_mole_8'),
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
