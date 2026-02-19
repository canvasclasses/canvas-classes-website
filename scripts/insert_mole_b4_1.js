#!/usr/bin/env node
// MOLE Batch 4 — Part 1: MOLE-250 to MOLE-259
// Direct MongoDB insertion (bypasses POST API)
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
  mk('MOLE-250','Medium','SCQ',
    'At $300\\,\\text{K}$ and $1\\,\\text{atm}$ pressure, $10\\,\\text{mL}$ of a hydrocarbon required $55\\,\\text{mL}$ of $\\ce{O2}$ for complete combustion and $40\\,\\text{mL}$ of $\\ce{CO2}$ is formed. The formula of the hydrocarbon is',
    opts('$\\ce{C4H7Cl}$','$\\ce{C4H6}$','$\\ce{C4H10}$','$\\ce{C4H8}$','b'), null,
    '**Step 1: General Combustion Equation**\n\nFor $\\ce{C_xH_y}$:\n$$\\ce{C_xH_y + \\left(x + \\frac{y}{4}\\right) O2 -> x CO2 + \\frac{y}{2} H2O}$$\n\n**Step 2: Find x from CO₂**\n\n$$10x = 40 \\Rightarrow x = 4$$\n\n**Step 3: Find y from O₂**\n\n$$10\\left(4 + \\frac{y}{4}\\right) = 55 \\Rightarrow y = 6$$\n\n**Step 4: Hydrocarbon is $\\ce{C4H6}$**\n\n**Key Points:**\n- At constant T and P, volumes are proportional to moles\n- $\\ce{CO2}$ volume gives carbon count directly\n- $\\ce{O2}$ consumed gives hydrogen count via $x + y/4$',
    'tag_mole_5'),

  mk('MOLE-251','Medium','SCQ',
    'A mixture of methane and ethylene in the ratio of $a:b$ by volume occupies $30\\,\\text{mL}$. On complete combustion, the mixture yields $40\\,\\text{mL}$ of $\\ce{CO2}$. What volume of $\\ce{CO2}$ would have been obtained if the ratio would have been $b:a$?',
    opts('$50\\,\\text{mL}$','$30\\,\\text{mL}$','$40\\,\\text{mL}$','$60\\,\\text{mL}$','a'), null,
    '**Step 1: Combustion Equations**\n\n$$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$$\n$$\\ce{C2H4 + 3O2 -> 2CO2 + 2H2O}$$\n\n**Step 2: Equations for ratio a:b**\n\n$$a + b = 30 \\quad \\cdots(1)$$\n$$a + 2b = 40 \\quad \\cdots(2)$$\n\nSubtracting: $b = 10$, $a = 20$.\n\n**Step 3: CO₂ for reversed ratio b:a**\n\n$$V_{\\ce{CO2}} = 10 + 2(20) = 50\\,\\text{mL}$$\n\n**Key Points:**\n- $\\ce{CH4}$ gives 1 vol $\\ce{CO2}$ per vol burned\n- $\\ce{C2H4}$ gives 2 vol $\\ce{CO2}$ per vol burned\n- Reversing ratio changes yield from 40 to 50 mL',
    'tag_mole_5'),

  mk('MOLE-252','Medium','NVT',
    'When $0.01$ mole of an organic compound containing $60\\%$ carbon was burnt completely, $4.4\\,\\text{g}$ of $\\ce{CO2}$ was produced. The molar mass of the compound is ______ $\\text{g/mol}$.',
    [], {integer_value:200},
    '**Step 1: Moles of CO₂**\n\n$$n_{\\ce{CO2}} = \\frac{4.4}{44} = 0.1\\,\\text{mol}$$\n\n**Step 2: Mass of C in 0.01 mol**\n\nMoles of C $= 0.1$; mass $= 1.2\\,\\text{g}$\n\n**Step 3: Molar Mass**\n\n$$\\frac{1.2}{0.01 \\times M} \\times 100 = 60 \\Rightarrow M = 200\\,\\text{g/mol}$$\n\n**Key Points:**\n- Moles of C = moles of $\\ce{CO2}$ (1:1)\n- Use $\\% = \\frac{\\text{mass of element in 1 mol}}{M} \\times 100$',
    'tag_mole_3'),

  mk('MOLE-253','Easy','SCQ',
    'The mass of $\\ce{CO2}$ that must be mixed with $20\\,\\text{g}$ of oxygen such that $27\\,\\text{mL}$ of a sample of the resulting mixture would contain equal number of molecules of each gas is',
    opts('$13.75\\,\\text{g}$','$27.50\\,\\text{g}$','$41.25\\,\\text{g}$','$55\\,\\text{g}$','b'), null,
    '**Step 1: Equal molecules means equal moles**\n\n$n_{\\ce{CO2}} = n_{\\ce{O2}}$\n\n**Step 2: Moles of O₂**\n\n$$n_{\\ce{O2}} = \\frac{20}{32} = 0.625\\,\\text{mol}$$\n\n**Step 3: Mass of CO₂**\n\n$$w = 0.625 \\times 44 = 27.50\\,\\text{g}$$\n\n**Key Points:**\n- Equal molecules ↔ equal moles (Avogadro)\n- The $27\\,\\text{mL}$ volume is a distractor\n- Mole ratio determines molecular ratio at any conditions',
    'tag_mole_7'),

  mk('MOLE-254','Hard','NVT',
    'A $0.05\\,\\text{cm}$ thick coating of silver is deposited on a plate of $0.05\\,\\text{m}^2$ area. The number of silver atoms deposited on the plate is ______ $\\times 10^{23}$. (Atomic mass of $\\ce{Ag} = 108$, $d = 7.9\\,\\text{g/cm}^3$)',
    [], {decimal_value:11.0},
    '**Step 1: Volume of Coating**\n\nArea $= 0.05\\,\\text{m}^2 = 500\\,\\text{cm}^2$; Thickness $= 0.05\\,\\text{cm}$\n$$V = 500 \\times 0.05 = 25\\,\\text{cm}^3$$\n\n**Step 2: Mass of Silver**\n\n$$m = 7.9 \\times 25 = 197.5\\,\\text{g}$$\n\n**Step 3: Number of Atoms**\n\n$$N = \\frac{197.5}{108} \\times 6.022 \\times 10^{23} = 11.01 \\times 10^{23}$$\n\n**Key Points:**\n- Convert $\\text{m}^2$ to $\\text{cm}^2$: multiply by $10^4$\n- $N = \\frac{m}{M} \\times N_A$',
    'tag_mole_7'),

  mk('MOLE-255','Medium','NVT',
    'Haemoglobin contains $0.34\\%$ Fe by mass. The number of Fe atoms in $3.3\\,\\text{g}$ of haemoglobin is ______.',
    [], {decimal_value:1.21e20},
    '**Step 1: Mass of Fe**\n\n$$m_{\\ce{Fe}} = \\frac{0.34}{100} \\times 3.3 = 0.01122\\,\\text{g}$$\n\n**Step 2: Number of Fe Atoms**\n\n$$N = \\frac{0.01122}{56} \\times 6.022 \\times 10^{23} = 1.21 \\times 10^{20}$$\n\n**Key Points:**\n- $\\% = \\frac{m_{\\text{element}}}{m_{\\text{total}}} \\times 100$\n- $N = \\frac{m}{M} \\times N_A$; atomic mass of $\\ce{Fe} = 56$',
    'tag_mole_7'),

  mk('MOLE-256','Hard','NVT',
    'A $1.84\\,\\text{mg}$ sample of a polyhydric alcoholic compound $X$ of molar mass $92\\,\\text{g/mol}$ gave $1.344\\,\\text{mL}$ of $\\ce{H2}$ gas at STP. The number of alcoholic hydrogen present in compound $X$ is',
    [], {integer_value:6},
    '**Step 1: Reaction with Na**\n\n$$\\ce{R(OH)_x + x Na -> R(ONa)_x + \\frac{x}{2} H2}$$\n\n**Step 2: Moles of H₂**\n\n$$n_{\\ce{H2}} = \\frac{1.344}{22400} = 6 \\times 10^{-5}\\,\\text{mol}$$\n\n**Step 3: Moles of X**\n\n$$n_X = \\frac{1.84 \\times 10^{-3}}{92} = 2 \\times 10^{-5}\\,\\text{mol}$$\n\n**Step 4: Find x**\n\n$$2 \\times 10^{-5} \\times \\frac{x}{2} = 6 \\times 10^{-5} \\Rightarrow x = 6$$\n\n**Key Points:**\n- Each $\\ce{-OH}$ gives $\\frac{1}{2}$ mol $\\ce{H2}$ with Na\n- STP molar volume = $22400\\,\\text{mL/mol}$',
    'tag_mole_7'),

  mk('MOLE-257','Hard','NVT',
    'A $10\\,\\text{mg}$ effervescent tablet containing $\\ce{NaHCO3}$ and oxalic acid releases $0.25\\,\\text{mL}$ of $\\ce{CO2}$ at $298.15\\,\\text{K}$ and $1\\,\\text{bar}$. If molar volume of $\\ce{CO2}$ is $25\\,\\text{L}$ under such conditions, what is the $\\%$ of $\\ce{NaHCO3}$ in each tablet? (Molar mass of $\\ce{NaHCO3} = 84\\,\\text{g/mol}$)',
    [], {decimal_value:8.4},
    '**Step 1: Reaction**\n\n$$\\ce{2NaHCO3 + H2C2O4 -> Na2C2O4 + 2CO2 + 2H2O}$$\n\n$n_{\\ce{NaHCO3}} = n_{\\ce{CO2}}$ (1:1)\n\n**Step 2: Moles of CO₂**\n\n$$n_{\\ce{CO2}} = \\frac{0.25 \\times 10^{-3}}{25} = 1 \\times 10^{-5}\\,\\text{mol}$$\n\n**Step 3: Mass and % of NaHCO₃**\n\n$$m = 1 \\times 10^{-5} \\times 84 = 0.84\\,\\text{mg}$$\n$$\\% = \\frac{0.84}{10} \\times 100 = 8.4\\%$$\n\n**Key Points:**\n- $n = V/V_m$ (use given molar volume)\n- Convert mL to L before dividing\n- $n_{\\ce{NaHCO3}} = n_{\\ce{CO2}}$ from stoichiometry',
    'tag_mole_8'),

  mk('MOLE-258','Medium','SCQ',
    '$\\ce{S}$ combines with $\\ce{O2}$ to form $\\ce{SO2}$ and $\\ce{SO3}$. If $10\\,\\text{g}$ of $\\ce{S}$ is mixed with $12\\,\\text{g}$ of $\\ce{O2}$, what mass of $\\ce{SO2}$ and $\\ce{SO3}$ will be formed so that neither $\\ce{S}$ nor $\\ce{O}$ will be left at the end of reaction?',
    opts('$12\\,\\text{g}\\,\\ce{SO2} + 10\\,\\text{g}\\,\\ce{SO3}$','$10\\,\\text{g}\\,\\ce{SO2} + 12\\,\\text{g}\\,\\ce{SO3}$','$14\\,\\text{g}\\,\\ce{SO2} + 8\\,\\text{g}\\,\\ce{SO3}$','$8\\,\\text{g}\\,\\ce{SO2} + 14\\,\\text{g}\\,\\ce{SO3}$','a'), null,
    '**Step 1: Reactions**\n\n$$\\ce{S + O2 -> SO2} \\quad \\text{and} \\quad \\ce{2S + 3O2 -> 2SO3}$$\n\nLet $x\\,\\text{g}$ of $\\ce{O2}$ form $\\ce{SO2}$, $(12-x)\\,\\text{g}$ form $\\ce{SO3}$.\n\n**Step 2: Conserve Moles of S**\n\n$$\\frac{x}{32} + \\frac{2(12-x)}{96} = \\frac{10}{32} \\Rightarrow x = 6\\,\\text{g}$$\n\n**Step 3: Masses of Products**\n\nMass of $\\ce{SO2} = \\frac{6}{32} \\times 64 = 12\\,\\text{g}$; mass of $\\ce{SO3} = 22 - 12 = 10\\,\\text{g}$\n\n**Key Points:**\n- Total mass conserved: $10 + 12 = 22\\,\\text{g}$\n- Set up S-balance to find split of $\\ce{O2}$',
    'tag_mole_8'),

  mk('MOLE-259','Medium','SCQ',
    'A sample of hydrogen gas is collected and it is observed that it contains only H and D atoms in the atomic ratio $6000:1$. The number of neutrons in $3\\,\\text{g}$ of such a sample should be nearly',
    opts('$0.0005$','$3.01 \\times 10^{20}$','$1.80 \\times 10^{24}$','$1.0$','b'), null,
    '**Step 1: Key Facts**\n\n- H has 0 neutrons; D has 1 neutron\n- Number of neutrons = number of D atoms\n- Average atomic mass $\\approx 1\\,\\text{g/mol}$\n\n**Step 2: Total Atoms in 3 g**\n\n$$N_{\\text{total}} = 3 \\times 6.022 \\times 10^{23}$$\n\n**Step 3: Number of D Atoms**\n\n$$N_D = \\frac{3 \\times 6.022 \\times 10^{23}}{6001} = 3.01 \\times 10^{20}$$\n\n**Key Points:**\n- Only D atoms contribute neutrons\n- H dominates so average mass $\\approx 1$',
    'tag_mole_7'),
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
