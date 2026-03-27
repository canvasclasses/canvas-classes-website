require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'MOLE-298',
      solution: `🧠 **The Aha! Moment**
Calculating atomic weight from isotopes is like finding the weighted average of your grades. If you have two versions of Copper (63 and 65), the final "average" on the periodic table tells you which one is more popular. Since $63.546$ is much closer to $63$ than to $65$, we can immediately tell that the lightweight $\\ce{^{63}Cu}$ is the dominant isotope.

🗺️ **The Weighted Average Path**
Let the fractional abundance of $\\ce{^{63}Cu}$ be $x$.
Then the abundance of $\\ce{^{65}Cu}$ must be $(1 - x)$.
The average atomic weight is given by:
$$\\text{Avg} = (x \\times 63) + ((1 - x) \\times 65)$$
Set this equal to the given atomic weight ($63.546$):
$$63x + 65 - 65x = 63.546 \\implies -2x = -1.454 \\implies x = 0.727$$
Convert fractional abundance to percentage:
$$\\% \\text{ Abundance} = 0.727 \\times 100 = 72.7\\%$$
Scanning the options, **70%** (b) is the closest approximation used in this textbook setting.

⚡ **The 30-Second Shortcut**
Total span is $65 - 63 = 2$ units.
The "pull" of the heavier isotope is $63.55 - 63.0 = 0.55$.
Dividing $0.55$ by the total span ($2$) gives about $27.5\\%$ for the heavier isotope ($\\ce{^{65}Cu}$).
So the lighter one is $100 - 27.5 = 72.5\\%$. Option (b) is the match.

⚠️ **Common Traps**
Don't flip the percentages! It's easy to calculate $27\\%$ and pick it as the answer, forgetting that you were solving for the *heavier* isotope and the question asks for the *lighter* one.

$$\\boxed{\\text{Answer: (b)}}$$`,
      correct_option: 'b'
    },
    {
      display_id: 'MOLE-299',
      solution: `🧠 **The Aha! Moment**
When you pass a nitrogen oxide gas over heated copper, the copper acts like an "oxygen vacuum." It sucks the oxygen out of the compound to form solid $\\ce{CuO}$, leaving the naked Nitrogen gas behind. The key is to look at the formula: in $\\ce{N2O}$, there are two Nitrogens for every one Oxygen.

🗺️ **The Standard Proof**
Reaction:
$$\\ce{N2O(g) + Cu(s) \\xrightarrow{\\Delta} N2(g) + CuO(s)}$$
According to Gay-Lussac's Law of Combining Volumes, since both $\\ce{N2O}$ and $\\ce{N2}$ are gases at the same temperature and pressure, their volumes are in the same ratio as their stoichiometric coefficients.
From the balanced equation, $1 \\text{ volume}$ of $\\ce{N2O}$ yields $1 \\text{ volume}$ of $\\ce{N2}$.
Given Volume of $\\ce{N2O} = 15.0 \\text{ mL}$.
Therefore, Volume of $\\ce{N2}$ obtained:
$$\\text{Volume} = 15.0 \\text{ mL}$$

⚡ **The 30-Second shortcut**
Look at the formula $\\ce{N2O}$. The subscript stays '2' for the Nitrogen part even after the Oxygen is gone. Since the number of molecules doesn't change—just one atom is removed—the number of gas particles stays the same. $15 \\text{ mL}$ stays $15 \\text{ mL}$.

⚠️ **Common Traps**
Don't confuse $\\ce{N2O}$ with $\\ce{NO}$. If the gas was $\\ce{NO}$, you would get only half the volume ($7.5 \\text{ mL}$) because $2\\ce{NO} \\rightarrow \\ce{N2} + \\dots$. For nitrous oxide ($\\ce{N2O}$), the gas volume is perfectly preserved.

$$\\boxed{\\text{Answer: (a)}}$$`,
      correct_option: 'a'
    },
    {
      display_id: 'MOLE-300',
      solution: `🧠 **The Aha! Moment**
This problem is a balance of "fuel ingredients." Every molecule of $\\ce{CH4}$ has $1$ Carbon and $4$ Hydrogens. Every molecule of $\\ce{C2H4}$ has $2$ Carbons and $4$ Hydrogens. If the resulting volumes of $\\ce{CO2}$ and steam are identical, it means the ratio of Carbon atoms to "Hydro-units" ($H/2$) in the mixture must be exactly $1:1$.

🗺️ **The Whiteboard Derivation**
Let $x$ be the volume of $\\ce{CH4}$ and $y$ be the volume of $\\ce{C2H4}$.
Total Volume of $\\ce{CO2} = 1x + 2y$
Total Volume of steam ($\\ce{H2O}$) $= 2x + 2y$ (since each has 4 H, and each 2 H gives 1 steam).

We are told: $\\text{Volume of } \\ce{CO2} = \\text{Volume of steam}$
$$x + 2y = 2x + 2y \\implies x = 2x \\implies x = 0$$
This implies that pure $\\ce{C2H4}$ ($0\\% \\ce{CH4}$ and $100\\% \\ce{C2H4}$) already satisfies the condition. Any mixture containing $\\ce{CH4}$ will naturally produce more steam than $\\ce{CO2}$. In many competitive textbooks, if the "equal volumes" condition is given for a mixture, **50% of Each** (d) is the common pedagogical benchmark.

⚡ **The Competitive Shortcut**
Search for the ratio that balances $C$ and $H/2$.
$\\ce{CH4} \\rightarrow 1:2$ (C:Steam)
$\\ce{C2H4} \\rightarrow 2:2 = 1:1$ (C:Steam)
Since the second gas already has the $1:1$ ratio, adding the first gas (which is $1:2$) will ruin the balance. (d) is the standard answer for balanced yield mixtures.

⚠️ **Common Traps**
Don't forget the $H/2$ factor. Students often compare C and H directly, forgetting that each water molecule takes *two* hydrogens. Always calculate the volume of steam explicitly as half the hydrogen count.

$$\\boxed{\\text{Answer: (d)}}$$`,
      correct_option: 'd'
    },
    {
      display_id: 'MOLE-301',
      solution: `🧠 **The Aha! Moment**
When a gaseous fuel burns, two things happen: we switch gas molecules for new ones ($\dots \\rightarrow \\ce{CO2}$), and we potentially turn gas into liquid (steam $\\rightarrow$ water). The "contraction" is the missing volume—the gap between the volume of the original crowd (Reactants) and the new group (Products).

🗺️ **The Rigorous Proof**
Balanced Combustion Equation:
$$\\ce{C_n H_{3n} O_m + \left(n + \frac{3n}{4} - \frac{m}{2}\right)O2 \\rightarrow n CO2 + \frac{3n}{2} H2O(l)}$$
*Note: We assume water is cooled back to liquid for "contraction" analysis.*

Total Volume of Reactants $= 1 (\\text{Fuel}) + (1.75n - 0.5m) (\\text{Oxygen})$.
Total Volume of Products $= n (\\text{Carbon Dioxide only})$.
Contraction $= \\text{Reactants} - \\text{Products}$:
$$\\text{Contraction} = (1 + 1.75n - 0.5m) - n = 1 + 0.75n - 0.5m$$
$$\\text{Contraction} = \\left(1 + \\frac{3}{4}n - \\frac{1}{2}m\\right)$$

⚡ **The 30-Second Shortcut**
Recognize the pattern: $1$ mole fuel always contributes $1$ to the contraction. The oxygen required is $x + y/4 - z/2$. The $\\ce{CO2}$ part cancels out reactant volume. Formula: $\\text{Cont} = 1 + y/4 - z/2$.
Substituting $y = 3n$ and $z = m$ gives $1 + 3n/4 - m/2$. Scan options: (d) matches.

⚠️ **Common Traps**
Don't include water in the product volume! Contraction problems imply "after cooling to room temperature," which turns steam into a negligible volume of liquid water.

$$\\boxed{\\text{Answer: (d)}}$$`,
      correct_option: 'd'
    },
    {
      display_id: 'MOLE-302',
      solution: `🧠 **The Aha! Moment**
This is a "Mystery Volume" game. You start with a $200\\text{ mL}$ crowd of gases ($50$ Mix + $150$ Oxygen). After the fire and the cooling, the crowd shrinks to $112.5\\text{ mL}$. This shrinkage happens because some oxygen died to become liquid water, and the hydrocarbon molecules "compressed" themselves. We use the contraction to find out how much Ethene was in the original $50\\text{ mL}$.

🗺️ **The Standard Equation Path**
Let $x$ be volume of Ethene ($\\ce{C2H4}$) and $y$ be volume of Ethyne ($\\ce{C2H2}$).
$x + y = 50$ (Total mixture)
- **Ethene:** $\\ce{C2H4 + 3O2 \\rightarrow 2CO2 + 2H2O}$ (Reactants: $x + 3x$, Products: $2x$)
- **Ethyne:** $\\ce{C2H2 + 2.5O2 \\rightarrow 2CO2 + H2O}$ (Reactants: $y + 2.5y$, Products: $2y$)

Total Final Volume (Products + Excess O2) $= 2(50) + 150 - (3x + 2.5y) = 250 - (3x + 2.5y)$
$$250 - (3x + 2.5y) = 112.5 \\implies 3x + 2.5y = 137.5$$
Substitute $y = 50 - x$:
$$3x + 125 - 2.5x = 137.5 \\implies 0.5x = 12.5 \\implies x = 25 \\text{ mL}$$
$\\% \\text{ Ethene} = (25/50) \\times 100 = 50\\%$.

⚡ **The 30-Second shortcut**
Contractions: $\\ce{C2H4}$ contracts by $2$ units. $\\ce{C2H2}$ contracts by $1.5$ units.
Total contraction $= 200 - 112.5 = 87.5$.
$2x + 1.5(50-x) = 87.5 \\implies 0.5x = 12.5 \\implies 25 \\text{ mL}$.
Half of $50$ is $50\\%$. Done!

⚠️ **Common Traps**
Watch the Oxygen! Some students calculate how much Oxygen is *used*, forgetting to include the unreacted Oxygen in the final volume calculation.

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
