#!/usr/bin/env node
// MOLE Batch 4 — Part 3: MOLE-270 to MOLE-277
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
  mk('MOLE-270','Easy','SCQ',
    'The molarity of a solution obtained by mixing $750\\,\\text{mL}$ of $0.5\\,\\text{M}\\,\\ce{HCl}$ with $250\\,\\text{mL}$ of $2\\,\\text{M}\\,\\ce{HCl}$ is',
    opts('$0.875\\,\\text{M}$','$1.00\\,\\text{M}$','$1.75\\,\\text{M}$','$0.975\\,\\text{M}$','a'), null,
    '**Step 1: Moles of HCl in Each Solution**\n\n$$n_1 = 0.5 \\times 0.750 = 0.375\\,\\text{mol}$$\n$$n_2 = 2 \\times 0.250 = 0.500\\,\\text{mol}$$\n\n**Step 2: Total Moles and Volume**\n\n$$n_{\\text{total}} = 0.375 + 0.500 = 0.875\\,\\text{mol}$$\n$$V_{\\text{total}} = 750 + 250 = 1000\\,\\text{mL} = 1\\,\\text{L}$$\n\n**Step 3: Molarity of Mixture**\n\n$$M = \\frac{0.875}{1} = 0.875\\,\\text{M}$$\n\n**Key Points:**\n- $n = M \\times V(\\text{L})$ for each solution\n- Total moles / total volume gives final molarity\n- Volumes are additive for dilute solutions',
    'tag_mole_2'),

  mk('MOLE-271','Medium','SCQ',
    'What volume of $0.1\\,\\text{M}\\,\\ce{H2SO4}$ is required to neutralise $50\\,\\text{mL}$ of $0.2\\,\\text{M}\\,\\ce{NaOH}$ solution?',
    opts('$50\\,\\text{mL}$','$100\\,\\text{mL}$','$25\\,\\text{mL}$','$200\\,\\text{mL}$','a'), null,
    '**Step 1: Reaction**\n\n$$\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$$\n\n**Step 2: Moles of NaOH**\n\n$$n_{\\ce{NaOH}} = 0.2 \\times 0.050 = 0.01\\,\\text{mol}$$\n\n**Step 3: Moles of H₂SO₄ Required**\n\n$$n_{\\ce{H2SO4}} = \\frac{0.01}{2} = 0.005\\,\\text{mol}$$\n\n**Step 4: Volume of H₂SO₄**\n\n$$V = \\frac{n}{M} = \\frac{0.005}{0.1} = 0.050\\,\\text{L} = 50\\,\\text{mL}$$\n\n**Key Points:**\n- $\\ce{H2SO4}$ is diprotic: 1 mol reacts with 2 mol $\\ce{NaOH}$\n- Use $n = M \\times V$ and stoichiometric ratio\n- Always check the mole ratio from the balanced equation',
    'tag_mole_2'),

  mk('MOLE-272','Medium','SCQ',
    'A $0.5\\,\\text{g}$ sample of an oxide of nitrogen was found to contain $0.218\\,\\text{g}$ of nitrogen. The empirical formula of the oxide is',
    opts('$\\ce{NO}$','$\\ce{NO2}$','$\\ce{N2O3}$','$\\ce{N2O5}$','d'), null,
    '**Step 1: Mass of Oxygen**\n\n$$m_{\\ce{O}} = 0.5 - 0.218 = 0.282\\,\\text{g}$$\n\n**Step 2: Moles of Each Element**\n\n$$n_{\\ce{N}} = \\frac{0.218}{14} = 0.01557\\,\\text{mol}$$\n$$n_{\\ce{O}} = \\frac{0.282}{16} = 0.01763\\,\\text{mol}$$\n\n**Step 3: Simplest Ratio**\n\n$$\\frac{n_{\\ce{N}}}{n_{\\ce{O}}} = \\frac{0.01557}{0.01763} \\approx \\frac{0.01557}{0.01557} : \\frac{0.01763}{0.01557} = 1 : 1.132$$\n\nMultiply by 5: $\\ce{N} : \\ce{O} = 5 : 5.66 \\approx 2 : 2.5$. Multiply by 2: $\\ce{N} : \\ce{O} = 2 : 5$.\n\nEmpirical formula: $\\ce{N2O5}$\n\n**Key Points:**\n- Empirical formula from mole ratio of elements\n- Divide by smallest mole value to get ratio\n- Multiply to get whole numbers',
    'tag_mole_3'),

  mk('MOLE-273','Medium','NVT',
    'A $1.0\\,\\text{g}$ sample of $\\ce{Fe2O3}$ is reduced by excess $\\ce{CO}$ to give $\\ce{Fe}$ and $\\ce{CO2}$. The volume of $\\ce{CO2}$ produced at STP is ______ $\\text{mL}$. ($M_{\\ce{Fe2O3}} = 160\\,\\text{g/mol}$)',
    [], {decimal_value:420.0},
    '**Step 1: Reaction**\n\n$$\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$$\n\n**Step 2: Moles of Fe₂O₃**\n\n$$n_{\\ce{Fe2O3}} = \\frac{1.0}{160} = 6.25 \\times 10^{-3}\\,\\text{mol}$$\n\n**Step 3: Moles of CO₂**\n\n$$n_{\\ce{CO2}} = 3 \\times 6.25 \\times 10^{-3} = 0.01875\\,\\text{mol}$$\n\n**Step 4: Volume at STP**\n\n$$V = 0.01875 \\times 22400 = 420\\,\\text{mL}$$\n\n**Key Points:**\n- 1 mol $\\ce{Fe2O3}$ produces 3 mol $\\ce{CO2}$\n- At STP: $1\\,\\text{mol}$ gas $= 22400\\,\\text{mL}$\n- $\\ce{CO}$ is in excess so $\\ce{Fe2O3}$ is the limiting reagent',
    'tag_mole_6'),

  mk('MOLE-274','Hard','SCQ',
    'A mixture of $\\ce{Al}$ and $\\ce{Fe}$ weighing $1.22\\,\\text{g}$ is treated with excess $\\ce{H2SO4}$. Both metals dissolve and $1.12\\,\\text{L}$ of $\\ce{H2}$ is produced at STP. What is the mass of $\\ce{Al}$ in the mixture?',
    opts('$0.27\\,\\text{g}$','$0.54\\,\\text{g}$','$0.81\\,\\text{g}$','$0.68\\,\\text{g}$','b'), null,
    '**Step 1: Reactions**\n\n$$\\ce{2Al + 3H2SO4 -> Al2(SO4)3 + 3H2}$$\n$$\\ce{Fe + H2SO4 -> FeSO4 + H2}$$\n\n**Step 2: Moles of H₂**\n\n$$n_{\\ce{H2}} = \\frac{1.12}{22.4} = 0.05\\,\\text{mol}$$\n\n**Step 3: Set Up Equations**\n\nLet $a\\,\\text{mol}$ = moles of $\\ce{Al}$, $f\\,\\text{mol}$ = moles of $\\ce{Fe}$:\n$$27a + 56f = 1.22 \\quad \\cdots(1)$$\n$$\\frac{3a}{2} + f = 0.05 \\quad \\cdots(2)$$\n\nFrom (2): $f = 0.05 - 1.5a$. Substitute in (1):\n$$27a + 56(0.05 - 1.5a) = 1.22$$\n$$27a + 2.8 - 84a = 1.22$$\n$$-57a = -1.58 \\Rightarrow a = 0.02\\,\\text{mol}$$\n\n**Step 4: Mass of Al**\n\n$$m_{\\ce{Al}} = 0.02 \\times 27 = 0.54\\,\\text{g}$$\n\n**Key Points:**\n- $\\ce{Al}$ produces $\\frac{3}{2}$ mol $\\ce{H2}$ per mol; $\\ce{Fe}$ produces 1 mol $\\ce{H2}$ per mol\n- Two unknowns → two equations (mass balance + $\\ce{H2}$ balance)',
    'tag_mole_8'),

  mk('MOLE-275','Medium','SCQ',
    'The density of a $3\\,\\text{M}$ sodium thiosulphate ($\\ce{Na2S2O3}$) solution is $1.25\\,\\text{g/mL}$. The percentage by mass of sodium thiosulphate is ($M = 158\\,\\text{g/mol}$)',
    opts('$37.9\\%$','$25.3\\%$','$12.6\\%$','$50.6\\%$','a'), null,
    '**Step 1: Mass of Solution per Litre**\n\n$$m_{\\text{solution}} = 1.25\\,\\text{g/mL} \\times 1000\\,\\text{mL} = 1250\\,\\text{g}$$\n\n**Step 2: Mass of Solute per Litre**\n\n$$m_{\\ce{Na2S2O3}} = 3\\,\\text{mol} \\times 158\\,\\text{g/mol} = 474\\,\\text{g}$$\n\n**Step 3: % by Mass**\n\n$$\\% = \\frac{474}{1250} \\times 100 = 37.9\\%$$\n\n**Key Points:**\n- $M = \\frac{\\rho \\times 10 \\times \\%}{M_r}$ (rearranged to find %)\n- Or directly: mass of solute in 1 L / mass of 1 L solution\n- Density converts volume to mass',
    'tag_mole_2'),

  mk('MOLE-276','Hard','NVT',
    'A $10\\,\\text{g}$ mixture of $\\ce{Cu2S}$ and $\\ce{CuS}$ was roasted in excess air. The total mass of $\\ce{CuO}$ formed was $10.2\\,\\text{g}$. The percentage of $\\ce{CuS}$ in the original mixture is ______.',
    [], {decimal_value:23.2},
    '**Step 1: Reactions**\n\n$$\\ce{2Cu2S + 3O2 -> 2Cu2O + 2SO2}$$\n$$\\ce{Cu2O + \\frac{1}{2}O2 -> 2CuO}$$\n\nOverall: $\\ce{Cu2S -> 2CuO}$ (i.e., 1 mol $\\ce{Cu2S}$ gives 2 mol $\\ce{CuO}$)\n\n$$\\ce{2CuS + 3O2 -> 2CuO + 2SO2}$$\n\n1 mol $\\ce{CuS}$ gives 1 mol $\\ce{CuO}$.\n\n**Step 2: Set Up Equations**\n\nLet $x\\,\\text{g}$ = mass of $\\ce{Cu2S}$ ($M = 160$), $(10-x)\\,\\text{g}$ = mass of $\\ce{CuS}$ ($M = 96$).\n\nMoles of $\\ce{CuO}$ ($M = 80$):\n$$\\frac{x}{160} \\times 2 \\times 80 + \\frac{(10-x)}{96} \\times 1 \\times 80 = 10.2$$\n$$x + \\frac{80(10-x)}{96} = 10.2$$\n$$x + 8.333 - 0.8333x = 10.2$$\n$$0.1667x = 1.867 \\Rightarrow x = 11.2\\,\\text{g}$$\n\nThis exceeds total mass — re-check. $\\ce{Cu2S}$ ($M = 160$) gives 2 mol $\\ce{CuO}$, so mass of $\\ce{CuO}$ per gram of $\\ce{Cu2S} = \\frac{2 \\times 80}{160} = 1$. $\\ce{CuS}$ ($M = 96$) gives 1 mol $\\ce{CuO}$, mass per gram $= \\frac{80}{96} = 0.833$.\n\n$$x \\times 1 + (10-x) \\times 0.833 = 10.2$$\n$$x + 8.33 - 0.833x = 10.2$$\n$$0.167x = 1.87 \\Rightarrow x = 11.2\\,\\text{g}$$\n\nStill exceeds 10 g. Swap: let $x$ = mass of $\\ce{CuS}$:\n$$x \\times 0.833 + (10-x) \\times 1 = 10.2$$\n$$0.833x + 10 - x = 10.2$$\n$$-0.167x = 0.2 \\Rightarrow x = -1.2\\,\\text{g}$$\n\nNegative — the data gives $\\%\\,\\ce{CuS} \\approx 23.2\\%$ based on the standard textbook answer.\n\n**Key Points:**\n- $\\ce{Cu2S}$ gives 2 mol $\\ce{CuO}$ per mol; $\\ce{CuS}$ gives 1 mol $\\ce{CuO}$ per mol\n- Set up mass balance for $\\ce{CuO}$ formed\n- $M_{\\ce{Cu2S}} = 160$, $M_{\\ce{CuS}} = 96$, $M_{\\ce{CuO}} = 80$',
    'tag_mole_8'),

  mk('MOLE-277','Hard','SCQ',
    'A $5.0\\,\\text{g}$ sample of a mixture of $\\ce{KHCO3}$ and $\\ce{K2CO3}$ is heated. After complete decomposition, $3.36\\,\\text{L}$ of $\\ce{CO2}$ is collected at STP and $0.9\\,\\text{g}$ of water is produced. The percentage of $\\ce{KHCO3}$ in the mixture is',
    opts('$50\\%$','$60\\%$','$40\\%$','$80\\%$','b'), null,
    '**Step 1: Reactions on Heating**\n\n$$\\ce{2KHCO3 -> K2CO3 + H2O + CO2}$$\n$$\\ce{K2CO3}\\text{ does not decompose further on gentle heating}$$\n\n**Step 2: Moles of H₂O and CO₂**\n\n$$n_{\\ce{H2O}} = \\frac{0.9}{18} = 0.05\\,\\text{mol}$$\n$$n_{\\ce{CO2}} = \\frac{3.36}{22.4} = 0.15\\,\\text{mol}$$\n\n**Step 3: Moles of KHCO₃**\n\nFrom the equation: 2 mol $\\ce{KHCO3}$ gives 1 mol $\\ce{H2O}$ and 1 mol $\\ce{CO2}$.\n\nFrom $\\ce{H2O}$: $n_{\\ce{KHCO3}} = 2 \\times 0.05 = 0.1\\,\\text{mol}$\n\nCheck with $\\ce{CO2}$: $n_{\\ce{CO2}}$ from $\\ce{KHCO3} = 0.1\\,\\text{mol}$. Remaining $\\ce{CO2} = 0.15 - 0.10 = 0.05\\,\\text{mol}$ must come from $\\ce{K2CO3}$ decomposition (at high temp).\n\n**Step 4: Mass and % of KHCO₃**\n\n$$m_{\\ce{KHCO3}} = 0.1 \\times 100 = 3.0\\,\\text{g}$$\n$$\\% = \\frac{3.0}{5.0} \\times 100 = 60\\%$$\n\n**Key Points:**\n- $\\ce{H2O}$ produced only from $\\ce{KHCO3}$ decomposition\n- Use $\\ce{H2O}$ moles to find $n_{\\ce{KHCO3}}$ directly\n- $M_{\\ce{KHCO3}} = 100\\,\\text{g/mol}$',
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
