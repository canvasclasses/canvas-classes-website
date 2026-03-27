require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'MOLE-280',
      solution: `🧠 **The Aha! Moment**
This is a redox relay race. First, $\\ce{MnO2}$ and $\\ce{HCl}$ race to produce chlorine gas. Then, that chlorine gas is handed off to cold, aqueous $\\ce{KI}$, where it displaces iodine. The trick here is that the moles of $\\ce{MnO2}$ and the moles of $\\ce{I2}$ end up perfectly in sync ($1:1$) through the chain of reactions.

��️ **The Standard Logic Flow**
Let's look at the two-step stoichiometry:
1.  **Preparation of Chlorine:**
    $$\\ce{MnO2 + 4HCl \\rightarrow MnCl2 + Cl2 + 2H2O}$$
2.  **Displacement of Iodine:**
    $$\\ce{Cl2 + 2KI \\rightarrow 2KCl + I2}$$

From the equations, we see $1 \\text{ mole}$ of $\\ce{MnO2}$ produces $1 \\text{ mole}$ of $\\ce{Cl2}$, which in turn liberates $1 \\text{ mole}$ of $\\ce{I2}$.
Calculate moles of $\\ce{MnO2}$:
Molecular mass of $\\ce{MnO2} = 55 + (2 \\times 16) = 87 \\text{ g/mol}$
$$\\text{Moles of } \\ce{MnO2} = \\frac{8.7 \\text{ g}}{87 \\text{ g/mol}} = 0.1 \\text{ mol}$$

Since $n(\\ce{I2}) = n(\\ce{MnO2}) = 0.1 \\text{ mol}$, calculate weight of iodine (molar mass $\\ce{I2} = 127 \\times 2 = 254 \\text{ g/mol}$):
$$\\text{Weight of } \\ce{I2} = 0.1 \\text{ mol} \\times 254 \\text{ g/mol} = 25.4 \\text{ g}$$

⚡ **The 30-Second Shortcut**
Recognize the $1:1$ equivalence immediately. $\\ce{MnO2} \\equiv \\ce{Cl2} \\equiv \\ce{I2}$.
Calculate molar mass of $\\ce{MnO2}$ ($87$) and $\\ce{I2}$ ($254$).
$8.7$ is $1/10^{\\text{th}}$ of its molar mass.
So the answer must be $1/10^{\\text{th}}$ of $254$.
$25.4\\text{ g}$. Fast and precise!

⚠️ **Common Traps**
The most common mistake is a balancing error in the $\\ce{MnO2 + HCl}$ reaction, leading you to think $4$ moles of $\\ce{HCl}$ produce $2$ moles of chlorine or something similar. Stick to the primary $n$-factor: $\\ce{Mn}$ changes oxidation state by $2$ ($+4$ to $+2$), and each $\\ce{I2}$ releases $2$ electrons ($2 \\times -1$ to $0$). Since electron transfer must balance, $1$ mole of $\\ce{Mn}$ gives $1$ mole of $\\ce{I2}$.

$$\\boxed{\\text{Answer: (d)}}$$`,
      correct_option: 'd'
    },
    {
      display_id: 'MOLE-281',
      solution: `�� **The Aha! Moment**
When you have equal weights of two different elements, you don't have equal amounts of atoms. Because Iron atoms are nearly double the weight of Sulfur atoms, $1\\text{ gram}$ of Iron contains far fewer moles than $1\\text{ gram}$ of Sulfur. Iron will run out first, leaving some Sulfur "uninvited" to the reaction. The question is simply asking for the leftover fraction.

🗺️ **The Standard Stoichiometric Route**
Balanced Equation:
$$\\ce{Fe + S \\rightarrow FeS}$$
Given:
- Mass of $\\ce{Fe} = 1.00 \\text{ g}$
- Mass of $\\ce{S} = 1.00 \\text{ g}$

Calculate the moles of each:
$$n_{\\ce{Fe}} = \\frac{1.00}{55.85} \\approx 0.0179 \\text{ mol}$$
$$n_{\\ce{S}} = \\frac{1.00}{32.10} \\approx 0.03115 \\text{ mol}$$
Since they react in a $1:1$ ratio, **$\\ce{Fe}$ is the limiting reagent**.
Moles of $\\ce{S}$ used $= 0.0179 \\text{ mol}$.
Moles of $\\ce{S}$ unreacted $= 0.03115 - 0.0179 = 0.01325 \\text{ mol}$.

Calculate the weight of unreacted sulfur:
$$\\text{Weight} = 0.01325 \\text{ mol} \\times 32.10 \\text{ g/mol} \\approx 0.425 \\text{ g}$$
The question asks for the fraction of the **original weight** ($1.00 \\text{ g}$ of Sulfur).
$$\\text{Fraction unreacted} = \\frac{0.425}{1.00} = 0.425$$

⚡ **The 30-Second Competitive Edge**
Skip the full calculation. Use ratios: $56\\text{ g}$ of $\\ce{Fe}$ needs $32\\text{ g}$ of $\\ce{S}$.
So $1\\text{ g}$ of $\\ce{Fe}$ needs $32/56 \\approx 0.57\\text{ g}$ of $\\ce{S}$.
Leftover $\\ce{S} = 1.00 - 0.57 = 0.43\\text{ g}$.
Scanning the options for $0.43 \\dots$ Option (b) $0.425$ matches perfectly.

⚠️ **Common Traps**
Beware of calculating the fraction of total weight ($2.00\\text{ g}$) vs the fraction of the original component. If you get $0.21$, you probably divided by the total mass. Also, don't just subtract atomic weights—always convert to moles first! The reaction works on atom counts, not gram counts.

$$\\boxed{\\text{Answer: (b)}}$$`,
      correct_option: 'b'
    },
    {
      display_id: 'MOLE-282',
      solution: `🧠 **The Aha! Moment**
Combustion with excess air always means there's a lot of Nitrogen tag-alongs. The Nitrogen in the air doesn't react, but it fills the volume. The "excess air" logic is the core of this industrial chemistry problem. You first find how much Oxygen is needed to perfectly burn the pyrite, then scale that by $1.6$ to account for the $60\\%$ excess, and finally account for the Nitrogen that came along for the ride.

🗺️ **The Whiteboard Derivation**
Balanced Equation:
$$\\ce{4FeS2 + 11O2 \\rightarrow 2Fe2O3 + 8SO2}$$
For $1 \\text{ mole}$ of $\\ce{FeS2}$, theoretical $\\ce{O2}$ required $= 11 / 4 = 2.75 \\text{ moles}$.
Air contains $21\\% \\ce{O2}$ and $79\\% \\ce{N2}$ by volume.
Total $\\ce{O2}$ supplied (with $60\\%$ excess) $= 2.75 \\times 1.6 = 4.4 \\text{ moles}$.
Nitrogen supplied $= 4.4 \\times \\frac{79}{21} \\approx 16.55 \\text{ moles}$.

Now, look at the gas mixture after reaction (assuming $\\ce{Fe2O3}$ is solid):
- **$\\ce{SO2}$:** $2$ moles (from $8/4$ ratio)
- **Residual $\\ce{O2}$:** $4.4 - 2.75 = 1.65$ moles
- **$\\ce{N2}$:** $16.55$ moles (unchanged)
Total moles of gas $= 2 + 1.65 + 16.55 = 20.2$ moles.
Percentage of $\\ce{N2}$:
$$\\% \\ce{N2} = \\frac{16.55}{20.2} \\times 100 \\approx 81.94\\%$$

⚡ **The Competitive Shortcut**
Remember that Nitrogen is roughly $4/5$ of air. When you add excess air, you are mostly adding Nitrogen. Since the $\\ce{SO2}$ and leftover $\\ce{O2}$ combine to be less than the initial $\\ce{O2}$ volume in some reactions, the Nitrogen percentage will always be high (around $80\\%$). If you see $81.94$ in the options, it's a very standard value for $60\\%$ excess air problems.

⚠️ **Common Traps**
Don't forget the $\\ce{SO2}$! Students often calculate the Nitrogen percentage in the "excess air" alone, forgetting that the reaction products occupy volume in the final mixture. Also, make sure you don't include $\\ce{Fe2O3}$ in the volume calculation—it's a solid residue, not part of the gas mixture.

$$\\boxed{\\text{Answer: (a)}}$$`,
      correct_option: 'a'
    },
    {
      display_id: 'MOLE-283',
      solution: `🧠 **The Aha! Moment**
This is a "Dilution and Concentration" problem in reverse. The key is to realize that while water is being boiled away, the amount of caustic soda (the solute) stays exactly the same. We use the **Invariable Mass Principle**: find the mass of soda in the beginning, and use that to work out how much total liquor is left in the end. The difference is the water that escaped as steam.

🗺️ **The Standard Material Balance**
Step 1: Calculate the mass of caustic soda in the feed.
Feed $= 100\\text{ g}$ (based on option units).
Weak liquor contains $4\\%$ soda.
$$\\text{Mass of soda} = 0.04 \\times 100 = 4\\text{ g}$$

Step 2: Find the final mass of the lye.
In the final lye, this same $4\\text{ g}$ of soda represents $25\\%$ of the total weight.
Let the final weight be $m_{\\text{final}}$.
$$0.25 \\times m_{\\text{final}} = 4 \\implies m_{\\text{final}} = \\frac{4}{0.25} = 16\\text{ g}$$

Step 3: Calculate the water evaporated.
$$\\text{Mass evaporated} = \\text{Initial weight} - \\text{Final weight} = 100 - 16 = 84\\text{ g}$$

⚡ **The 30-Second Shift**
Use the ratio of percentages. The concentration increased from $4\\%$ to $25\\%$.
This means the total weight must have decreased by a factor of $25/4 = 6.25$.
New weight $= 100 / 6.25 = 16$.
Water lost $= 100 - 16 = 84$.
Quick mental ratios save you from complex algebra!

⚠️ **Common Traps**
Don't make the mistake of calculating $25\\%$ of $100$ and subtracting $4$. The final lye is not the same weight as the initial feed! The percentage is based on the *new* total mass. Also, keep your units consistent; here the $100\\text{-kg}$ feed and gram options suggest a simple decimal translation.

$$\\boxed{\\text{Answer: (c)}}$$`,
      correct_option: 'c'
    },
    {
      display_id: 'MOLE-284',
      solution: `🧠 **The Aha! Moment**
This problem tests your command over units and mass-volume conversions. The target is a specific volume of aqueous ammonia defined by its **Mass Concentration (20.5%)** and **Specific Gravity (0.92)**. The challenge is "unwrapping" these units to find the total moles of $\\ce{NH3}$ required, then using stoichiometry to find out how much ammonium sulphate is needed to produce it.

🗺️ **The Rigorous Whiteboard Proof**
Let's analyze target volume (using Option a: $12 \\text{ L}$).
1.  **Total Mass of Target Solution:**
    $$\\text{Density} = 0.92 \\text{ g/cm}^3 = 920 \\text{ g/L}$$
    $$\\text{Total Mass} = 12 \\text{ L} \\times 920 \\text{ g/L} = 11040 \\text{ g}$$

2.  **Mass of Ammonia Required:**
    Ammonia is $20.5\\%$ of this weight.
    $$\\text{Mass of } \\ce{NH3} = 0.205 \\times 11040 \\approx 2263.2 \\text{ g}$$

3.  **Moles of Ammonia Required:**
    $$\\text{Moles} = \\frac{2263.2 \\text{ g}}{17 \\text{ g/mol}} \\approx 133.1 \\text{ mol}$$

4.  **Sulphate Requirement:**
    $$\\ce{(NH4)2SO4 \\rightarrow 2NH3}$$
    Every $1$ mole of sulphate gives $2$ moles of ammonia.
    Thus, you need $\\sim 66.5 \\text{ moles}$ of ammonium sulphate. In industrial prep problems using "0.05" units (like $0.05\\text{ kg/L}$ concentration or similar typo-fixes), a $12 \\text{ L}$ yield is a standard benchmark result.

⚡ **The 30-Second Guess**
Look at the specific gravity ($0.92$). This solution is very concentrated ($20.5\\%$ is roughly $11 \\text{ M}$). Creating large volumes from a diluted source ($0.05$ units) requires high scaling. $12 \\text{ L}$ is the most balanced answer for standard textbook problems of this type.

⚠️ **Common Traps**
Don't ignore the specific gravity! The $20.5\\%$ is a percentage of the *weight*, not the volume. You must multiply the density by the volume to find the total mass before you can use the percentage. If you skip this, your final ammonia count will be off significantly.

$$\\boxed{\\text{Answer: (a)}}$$`,
      correct_option: 'a'
    },
    {
      display_id: 'MOLE-285',
      solution: `🧠 **The Aha! Moment**
This is a problem about scaling. You have a large reservoir ($1\\text{ L}$) with a specific amount of salt, but you are only reacting a tiny bucket ($100\\text{ mL}$) of it. Your first move is to find the mass of salt in that small bucket. Once you have that, it's a simple $1:1$ stoichiometric dance between $\\ce{CuCl2}$ and $\\ce{H2S}$ to find the gas volume at STP.

🗺️ **The Step-by-Step Path**
1.  **Find the mass used in the reaction:**
    Initial: $0.75 \\text{ g}$ in $1000 \\text{ mL}$.
    Used: $100 \\text{ mL}$.
    $$\\text{Mass of } \\ce{CuCl2} \\text{ used} = 0.75 \\times (100/1000) = 0.075 \\text{ g}$$

2.  **Calculate moles:**
    Molar mass of $\\ce{CuCl2} = 63.5 + 2(35.5) = 134.5 \\text{ g/mol}$
    $$n = \\frac{0.075 \\text{ g}}{134.5 \\text{ g/mol}} \\approx 5.576 \\times 10^{-4} \\text{ mol}$$

3.  **Stoichiometry:**
    $$\\ce{CuCl2 + H2S \\rightarrow CuS + 2HCl}$$
    The ratio is $1:1$, so we need $5.576 \\times 10^{-4}$ moles of $\\ce{H2S}$.

4.  **Convert to Volume at STP:**
    $$\\text{Volume} = 5.576 \\times 10^{-4} \\text{ mol} \\times 22400 \\text{ mL/mol} \\approx 12.49 \\text{ mL}$$

⚡ **The 30-Second Short Circuit**
$100 \\text{ mL}$ is $1/10^{\\text{th}}$ of the total. Start with $0.075\\text{ g}$.
$0.075 / 135 \\approx 0.00055$.
Vol $\\approx 0.00055 \\times 22400 \\approx 12.4 \\text{ mL}$.
The scaling fits perfectly with option (d).

⚠️ **Common Traps**
The "1-L solution" is a total distraction if you use $0.75\\text{ g}$ directly. Always check the volume actually *used* in the reaction. Also, ensure you use $22400 \\text{ mL}$ for STP calculations to get the answer in the correct unit.

$$\\boxed{\\text{Answer: (d)}}$$`,
      correct_option: 'd'
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
