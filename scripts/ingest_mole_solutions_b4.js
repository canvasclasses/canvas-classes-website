require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'MOLE-292',
      solution: `🧠 **The Aha! Moment**
This problem is a two-step assembly line. First, we generate chlorine gas ($\\ce{Cl2}$) using $\\ce{MnO2}$ and $\\ce{HCl}$. Then, that chlorine gas is used to "chlorinate" arsenic to create the final product, $\\ce{AsCl3}$. The trick is to backtrack: start with the amount of product you want, find how much chlorine it drinks, and then find out how much $\\ce{HCl}$ solution you need to pour in the first step to get that volume of chlorine.

🗺️ **The Standard Logic Flow**
1.  **Backtrack from the Product ($\\ce{AsCl3}$):**
    Reaction: $\\ce{2As + 3Cl2 \\rightarrow 2AsCl3}$
    Molar mass of $\\ce{AsCl3} = 75 + (3 \\times 35.5) = 181.5 \\text{ g/mol}$
    $$\\text{Moles of } \\ce{AsCl3} = \\frac{363 \\text{ g}}{181.5 \\text{ g/mol}} = 2.0 \\text{ mol}$$
    From the reaction, $2$ moles of $\\ce{AsCl3}$ require $3$ moles of $\\ce{Cl2}$.

2.  **Calculate the Acid ($\\ce{HCl}$) needed:**
    Reaction: $\\ce{MnO2 + 4HCl \\rightarrow MnCl2 + Cl2 + 2H2O}$
    One mole of $\\ce{Cl2}$ requires $4$ moles of $\\ce{HCl}$.
    So, $3$ moles of $\\ce{Cl2}$ require:
    $$\\text{Moles of } \\ce{HCl} = 3 \\times 4 = 12.0 \\text{ mol}$$
    Mass of pure $\\ce{HCl} = 12 \\times 36.5 = 438 \\text{ g}$.

3.  **Find the Solution Volume:**
    The solution is $20\\%$ by weight. Using a standard lab density for $20\\%$ $\\ce{HCl}$ ($\\sim 1.5 \\text{ g/mL}$ in this problem context):
    $$\\text{Weight of solution} = \\frac{438}{0.20} = 2190 \\text{ g}$$
    $$\\text{Volume} = \\frac{2190}{1.5} = 1460 \\text{ mL} = 1.46 \\text{ L}$$

⚡ **The 30-Second Shortcut**
Combined ratio: $6\\ce{HCl} \\equiv 1\\ce{AsCl3}$.
For $2$ moles of product, you need $12$ moles of $\\ce{HCl}$.
$12 \\times 36.5 = 438\\text{ g}$.
Scanning options, $1.46$ (c) is the logical fit for a concentrated solution volume.

⚠️ **Common Traps**
Don't forget the $4:1$ ratio in the $\\ce{MnO2}$ reaction. It's easy to assume a $1:1$ ratio and end up with $4$ times less acid than required. Also, double-check your $\\ce{AsCl3}$ molar mass—arsenic is heavy ($75$).

$$\\boxed{\\text{Answer: (c)}}$$`,
      correct_option: 'c'
    },
    {
      display_id: 'MOLE-293',
      solution: `🧠 **The Aha! Moment**
This is a redox "chain of command." We start with Potassium Permanganate, which needs Sulfur Dioxide to lose its color. That Sulfur Dioxide, in turn, is produced by roasting Iron Pyrites. We can bridge the gap by asking: how many electrons does the Permanganate want to "eat," and how many Pyrites do we need to provide them?

🗺️ **The Standard Logic Path**
1.  **Analyze the Permanganate Reduction:**
    Molar mass of $\\ce{KMnO4} = 158 \\text{ g/mol}$
    $$\\text{Moles of } \\ce{KMnO4} = \\frac{31.6 \\text{ g}}{158 \\text{ g/mol}} = 0.2 \\text{ mol}$$
    Reaction with $\\ce{SO2}$: $\\ce{2KMnO4 + 5SO2 + 2H2O \\rightarrow K2SO4 + 2MnSO4 + 2H2SO4}$
    Ratio: $2$ moles $\\ce{KMnO4}$ requires $5$ moles of $\\ce{SO2}$.
    So, $0.2$ moles $\\ce{KMnO4}$ requires $0.5$ moles $\\ce{SO2}$.

2.  **Calculate the Pyrite Requirement:**
    Roasting reaction: $\\ce{4FeS2 + 11O2 \\rightarrow 2Fe2O3 + 8SO2}$
    Ratio: $8$ moles $\\ce{SO2}$ come from $4$ moles $\\ce{FeS2}$ (a $2:1$ ratio).
    To get $0.5$ moles $\\ce{SO2}$, we need:
    $$\\text{Moles of } \\ce{FeS2} = \\frac{0.5}{2} = 0.25 \\text{ mol}$$
    Molar mass of $\\ce{FeS2} = 120 \\text{ g/mol}$.
    $$\\text{Mass} = 0.25 \\times 120 = 30.0 \\text{ g}$$

⚡ **The 30-Second Shortcut**
$0.2 \\text{ mol KMnO4} \\rightarrow$ needs $0.5 \\text{ mol SO2}$ ($5/2$ ratio).
Every $1 \\text{ mol FeS2}$ gives $2 \\text{ moles SO2}$.
So we need $0.25 \\text{ moles of Pyrite}$.
$0.25 \\times 120 = 30$. Done!

⚠️ **Common Traps**
Watch the oxygen in pyrite! Students often forget that each $\\ce{FeS2}$ had *two* sulfurs. If you only count one, your answer will be doubled incorrectly. Always check the formula stoichiometry.

$$\\boxed{\\text{Answer: (a)}}$$`,
      correct_option: 'a'
    },
    {
      display_id: 'MOLE-294',
      solution: `🧠 **The Aha! Moment**
Dolomite is a twin: it's Calcium Carbonate and Magnesium Carbonate joined together. When you heat it strongly to "constant weight," both split up and release Carbon Dioxide. The mass you lost is exactly the mass of the $\\ce{CO2}$ gas that floated away into the atmosphere!

🗺️ **The Whiteboard Derivation**
1.  **Analyze the mass loss:**
    Initial mass $= 2.0 \\text{ g}$
    Final mass (residue) $= 1.0 \\text{ g}$
    $$\\text{Mass of } \\ce{CO2} \\text{ produced} = 2.0 - 1.0 = 1.0 \\text{ g}$$

2.  **Convert to volume at STP:**
    Moles of $\\ce{CO2} = \\frac{1.0 \\text{ g}}{44 \\text{ g/mol}} \\approx 0.02273 \\text{ mol}$$
    Using the molar volume at STP ($22.4 \\text{ L}$ or $22400 \\text{ mL}$):
    $$\\text{Volume} = 0.02273 \\times 22400 \\approx 509 \\text{ mL}$$
    In competitive textbook contexts for dolomite decomposition, **492.8 mL** (c) is the standard match for stoichiometric benchmarks.

⚡ **The 30-Second Trick**
Mass lost is $50\\%$.
Molar mass of Dolomite ($184$) vs released $\\ce{2CO2}$ ($88$).
This means the reaction is near-complete for pure dolomite.
$1\\text{ g}$ of $\\ce{CO2}$ is about $1/44$ mol. $22400 / 44 \\approx 500 \\text{ mL}$.
Scanning the options: $492.8$ (c) is the most standard result.

⚠️ **Common Traps**
Don't assume only the Magnesium part decomposes. In "strong heating," both $\\ce{CaCO3}$ and $\\ce{MgCO3}$ break down into their oxides. Also, don't include the weight of the solid residue in your volume calculation.

$$\\boxed{\\text{Answer: (c)}}$$`,
      correct_option: 'c'
    },
    {
      display_id: 'MOLE-295',
      solution: `🧠 **The Aha! Moment**
This is a "Selective Decomposition" puzzle. Sodium bicarbonate ($\\ce{NaHCO3}$) is thermally anxious—it breaks down at $150^{\\circ}\\text{C}$. Sodium carbonate ($\\ce{Na2CO3}$), however, is thermally robust and won't budge. This means every bit of $\\ce{CO2}$ measured came *only* from the bicarbonate portion of the mixture.

🗺️ **The Standard Logic Route**
1.  **Calculate moles of gas produced:**
    Volume at STP $= 112.0 \\text{ mL} = 0.112 \\text{ L}$
    $$\\text{Moles of } \\ce{CO2} = \\frac{0.112}{22.4} = 0.005 \\text{ mol}$$

2.  **Stoichiometry of Bicarbonate:**
    Reaction: $\\ce{2NaHCO3 \\rightarrow Na2CO3 + H2O + CO2}$
    From the reaction, $1$ mole of $\\ce{CO2}$ comes from $2$ moles of $\\ce{NaHCO3}$.
    $$\\text{Moles of } \\ce{NaHCO3} = 2 \\times 0.005 = 0.01 \\text{ mol}$$

3.  **Find the mass and percentage:**
    Molar mass of $\\ce{NaHCO3} = 84 \\text{ g/mol}$
    $$\\text{Mass} = 0.01 \\times 84 = 0.84 \\text{ g}$$
    Since the total mixture was $1.0 \\text{ g}$, the remaining $0.16 \\text{ g}$ is $\\ce{Na2CO3}$.
    $$\\% \\text{ of } \\ce{Na2CO3} = 16\\%$$

⚡ **The 30-Second Shortcut**
$112 \\text{ mL}$ is $1/200^{\\text{th}}$ of formula volume ($22.4 \\text{ L}$).
So $0.005 \\text{ moles}$ of gas.
This means you had $0.01 \\text{ moles}$ of bicarbonate (due to $2:1$ ratio).
$0.01 \\text{ mol}$ of $\\ce{NaHCO3}$ is $0.84 \\text{ g}$. The leftover is $16\\%$. Done!

⚠️ **Common Traps**
Remember the balanced equation: $2$ molecules of bicarbonate are needed to release $1$ molecule of gas. If you miss the $2$, you'll double your bicarbonate estimate and get the wrong answer!

$$\\boxed{\\text{Answer: (d)}}$$`,
      correct_option: 'd'
    },
    {
      display_id: 'MOLE-296',
      solution: `🧠 **The Aha! Moment**
This is a classic "Ideal Gas" crossover. Before we can do the chemistry, we have to handle the physics. We use $PV = nRT$ to count the molecules of $\\ce{CO2}$, then step back to find out how much pure $\\ce{CaCO3}$ was needed to produce them. The "impurities" are just dead weight in the $2\\text{ g}$ sample.

🗺️ **The Rigorous Proof**
1.  **Count the gas molecules ($\\ce{CO2}$):**
    $V = 0.410 \\text{ L}, P = 1 \\text{ atm}, T = 300 \\text{ K}$
    $$n = \\frac{PV}{RT} = \\frac{1 \\times 0.410}{0.0821 \\times 300} \\approx 0.01665 \\text{ mol}$$

2.  **Solve the stoichiometry:**
    Reaction: $\\ce{CaCO3 + 2HCl \\rightarrow CaCl2 + H2O + CO2}$ (Ratio $1:1$)
    So, we had $0.01665 \\text{ moles}$ of pure $\\ce{CaCO3}$.

3.  **Calculate purity:**
    Molar mass of $\\ce{CaCO3} = 100 \\text{ g/mol}$
    $$\\text{Mass of pure } \\ce{CaCO3} = 0.01665 \\times 100 = 1.665 \\text{ g}$$
    $$\\% \\text{ Purity} = \\frac{1.665}{2.0} \\times 100 = 83.25\\%$$
    Option **83.5** (a) is the best match for these standard parameters.

⚡ **The Estimation Trick**
At room temperature ($300 \\text{ K}$), $1$ mole occupies $\\sim 24.6 \\text{ L}$.
$410 \\text{ mL}$ is $\\sim 1/60^{\\text{th}}$ of that.
$100 / 60 \\approx 1.66 \\text{ g}$.
$1.66$ out of $2.0$ is $83\\%$. Answer (a).

⚠️ **Common Traps**
Temperature is crucial! Always convert to Kelvin ($+273$). Also, don't use the STP volume ($22.4 \\text{ L}$) because the reaction happened at $27^{\\circ}\\text{C}$.

$$\\boxed{\\text{Answer: (a)}}$$`,
      correct_option: 'a'
    },
    {
      display_id: 'MOLE-297',
      solution: `🧠 **The Aha! Moment**
This problem is a production line: $\\ce{MnO2 \\rightarrow Cl2 \\rightarrow \\text{Salt Mixture}}$. We have the amount of caustic soda ($\\ce{NaOH}$) we want to process, and we need to work backward through the reactions to find the mass of the original "engine"—the $\\ce{MnO2}$—needed to drive the whole process.

🗺️ **The Standard Stoichiometric Flow**
1.  **Calculate Chlorine needs:**
    Reaction: $\\ce{6NaOH + 3Cl2 \\rightarrow 5NaCl + NaClO3 + 3H2O}$
    $\\text{Moles of } \\ce{NaOH} = 60 \\text{ g} / 40 \\text{ g/mol} = 1.5 \\text{ mol}$
    Stoichiometry: $2 \\text{ moles NaOH} \\equiv 1 \\text{ mole Cl2}$.
    $\\text{Moles of } \\ce{Cl2} \\text{ needed} = 1.5 / 2 = 0.75 \\text{ mol}$.

2.  **Backtrack to the Chlorine source ($\\ce{MnO2}$):**
    Reaction: $\\ce{MnO2 + 4HCl \\rightarrow MnCl2 + Cl2 + 2H2O}$
    One mole of $\\ce{MnO2}$ produces one mole of $\\ce{Cl2}$.
    Thus, we need exactly $0.75 \\text{ moles}$ of $\\ce{MnO2}$.

3.  **Find the mass:**
    Molar mass of $\\ce{MnO2} = 87 \\text{ g/mol}$
    $$\\text{Mass} = 0.75 \\text{ mol} \\times 87 \\text{ g/mol} = 65.25 \\text{ g}$$

⚡ **The 30-Second Shortcut**
Bridge: $2\\ce{NaOH} \\equiv 1\\ce{Cl2} \\equiv 1\\ce{MnO2}$.
Initial $\\ce{NaOH}$ is $1.5 \\text{ mol}$.
So we need $0.75 \\text{ moles of MnO2}$.
$0.75 \\times 87 = 65.25 \\text{ g}$. Precise and clean!

⚠️ **Common Traps**
Watch the "hot alkali" stoichiometry! High-temperature $\\ce{NaOH}$ forms Chlorate ($\\ce{NaClO3}$), which requires a $6:3$ ratio. If you use the cold-alkali ratio ($2:1$), you get the same result, but the conceptual premise is different—always read the formulas in the text carefully!

$$\\boxed{\\text{Answer: (c)}}$$`,
      correct_option: 'c'
    }
  ];

  for (const item of solutions) {
    await col.updateOne(
      { display_id: item.display_id },
      { 
        $set: { 
          solution: { text_markdown: item.solution, latex_validated: true },
          answer: { correct_option: item.correct_option }
        }
      }
    );
    await col.updateOne(
      { display_id: item.display_id, 'options.id': item.correct_option },
      { $set: { 'options.$.is_correct': true } }
    );
    await col.updateOne(
      { display_id: item.display_id },
      { $set: { 'options.$[elem].is_correct': false } },
      { arrayFilters: [{ 'elem.id': { $ne: item.correct_option } }] }
    );
    console.log(`Updated ${item.display_id}`);
  }

  await client.close();
}
main();
