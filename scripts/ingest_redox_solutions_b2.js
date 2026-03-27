require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'RDX-101',
      solution: `🧠 **The Charge Shift Logic**
The oxidation number is essentially a ledger of electrons. Losing an electron means losing a negative charge, which causes the oxidation number to climb. Think of it like a lift: every electron you kick out sends you up one floor.

🗺️ **The Algebraic Ascent**
1. **Initial State**: We start with the metal ion $\\ce{M^{3+}}$. Here, the oxidation number is $+3$.
2. **The Event**: The ion loses 3 electrons.
3. **The Calculation**: 
   $$ \text{Final O.N.} = \text{Initial O.N.} + (\text{Electrons lost}) $$
   $$ \text{Final O.N.} = +3 + 3 = +6 $$

The metal now exists in the $+6$ oxidation state in the resulting cation.

⚡ **The Quick Jump**
"Loss is Oxidation" (LEO says GER). Losing 3 negative charges is equivalent to adding 3 positive units to your current state. $3 + 3 = 6$. No need for complex formulas here.

⚠️ **Common Traps**
Don't subtract! If you subtract 3 from 3, you'll get 0 (Option c or similar), which would happen if the ion *gained* electrons. Oxidation means the number must get more positive.

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-102',
      solution: `🧠 **Tracking the Electron Flow**
The key to this problem is scaling. We aren't dealing with a single molecule, but a whole sample. We need to figure out exactly how much each individual Nitrogen atom "paid" in terms of electrons during the reaction.

🗺️ **The Molar Audit**
1. **Electrons per Mole of Hydrazine**:
   $$ \text{Electrons lost per mol of } \ce{N2H4} = \frac{25 \text{ mol } e^-}{2.5 \text{ mol } \ce{N2H4}} = 10 \text{ mol } e^- / \text{mol} $$
2. **Electrons per Nitrogen Atom**:
   Since each $\\ce{N2H4}$ contains 2 Nitrogen atoms, each $\\ce{N}$ atom loses:
   $$ \frac{10}{2} = 5 \text{ electrons} $$
3. **Initial State of Nitrogen**:
   In $\\ce{N2H4}$, Hydrogen is $+1$. 
   $$ 2x + 4(+1) = 0 \Rightarrow 2x = -4 \Rightarrow x = -2 $$
4. **Final State**:
   $$ \text{Final O.N.} = -2 + 5 = +3 $$

⚡ **The Per-Atom Shortcut**
Always reduce these problems to the "per atom" level as fast as possible. 25 electrons from 5 Nitrogen atoms (since 2.5 mol of $\\ce{N2}$ units equals 5 mol of $\\ce{N}$ atoms) means 5 electrons per atom. $-2 + 5 = 3$. Done.

⚠️ **Common Traps**
A very common mistake is forgetting that there are *two* Nitrogens in hydrazine. If you divide 10 by 1 instead of 2, you'll end up with an impossible oxidation state or a wrong choice like $+8$. Also, make sure you calculate the initial state correctly; Nitrogen is $-2$ in hydrazine, not $-3$ like in ammonia.

$$\\boxed{\\text{Answer: (c)}}$$`
    },
    {
      display_id: 'RDX-103',
      solution: `🧠 **The Oxygen Exception Map**
Usually, Oxygen is a boring $-2$. But this question is a tour of its "rebellious" states: peroxides, superoxides, elemental forms, and its only positive state. The "Aha!" moment is recognizing which formula belongs to which category.

🗺️ **Category Scan**
1. **$\\ce{BaO2}$ (Barium Peroxide)**: Barium is $+2$. The peroxide ion $\\ce{O2^{2-}}$ has each Oxygen at $-1$.
2. **$\\ce{KO2}$ (Potassium Superoxide)**: Potassium is $+1$. The superoxide ion $\\ce{O2^{1-}}$ has each Oxygen at $-1/2$.
3. **$\\ce{O3}$ (Ozone)**: As an elemental form, the oxidation number is strictly $0$.
4. **$\\ce{OF2}$ (Oxygen Difluoride)**: Fluorine is more electronegative ($-1$), so Oxygen is forced into $+2$.

Increasing order: $-1 < -1/2 < 0 < +2$.
This perfectly matches the sequence: $\\ce{BaO2 < KO2 < O3 < OF2}$.

⚡ **The Fluorine Anchor**
In any list like this, $\\ce{OF2}$ must be at the very end (the highest) because it's the only one where Oxygen is positive. Similarly, peroxides ($-1$) are usually the lowest. Scanning for a list that starts with a peroxide and ends with $\\ce{OF2}$ usually narrows it down to the right answer in seconds.

⚠️ **Common Traps**
Don't treat $\\ce{BaO2}$ as a normal oxide. If you did, you'd calculate $\\ce{Ba}$ as $+4$, which is impossible for a Group 2 metal. Recognize the peroxide/superoxide structures! 

$$\\boxed{\\text{Answer: (a)}}$$`
    },
    {
      display_id: 'RDX-104',
      solution: `🧠 **The Power of Electronegativity**
An oxidizing agent wants to steal electrons. The best thieves are either elements that are extremely electronegative or ions where a central atom is "starving" for electrons in a very high oxidation state. 

🗺️ **Comparing the Candidates**
*   **$\\ce{O3}$ (Ozone)**: Oxygen is in a $0$ state but is highly unstable and "wants" to drop to $-2$. It is one of the strongest neutral oxidizers known.
*   **$\\ce{KMnO4}$**: Manganese is in $+7$. Very strong, but usually requires an acidic medium to hit its full potential.
*   **$\\ce{H2O2}$**: Oxygen is at $-1$. It is a good oxidizer but can also act as a reducer.
*   **$\\ce{K2Cr2O7}$**: Chromium is in $+6$. Strong, but generally less vigorous than $\\ce{KMnO4}$.

Among these, Ozone ($\\ce{O3}$) has the highest standard reduction potential in many conditions, making it the most "aggressive" oxidizer.

⚡ **The Standard Potential Rule**
If you've studied the electrochemical series, you'll know that the reduction potential of $\\ce{O3}$ ($\sim +2.07\text{V}$) is higher than $\\ce{MnO4-}$ ($\sim +1.51\text{V}$) and $\\ce{Cr2O7^{2-}}$ ($\sim +1.33\text{V}$). High potential = high oxidizing power.

⚠️ **Common Traps**
Don't assume that a higher oxidation number (like $+7$ in $\\ce{KMnO4}$) always means a stronger oxidizer. While it's a good rule of thumb, the identity of the element and its "greed" (potential) matter more. Ozone is a chemical "beast" despite being at state $0$.

$$\\boxed{\\text{Answer: (a)}}$$`
    },
    {
      display_id: 'RDX-105',
      solution: `🧠 **The Metal Reactivity Ladder**
A reducing agent is an electron donor. The best donors are metals that really want to get rid of their outer electrons to achieve a noble gas configuration. We are looking for the most electropositive element in the list.

🗺️ **Periodic Trends**
1. **$\\ce{Br2}$**: This is a non-metal halogen. It wants to *gain* electrons (oxidizer), not lose them. We can discard this immediately.
2. **$\\ce{Mg, Na, K}$**: These are all metals. 
   - $\\ce{Mg}$ (Group 2) is less reactive than alkali metals.
   - $\\ce{Na}$ and $\\ce{K}$ are both Alkali metals (Group 1).
   - As we go down Group 1, the outermost electron gets further from the nucleus, making it much easier to lose. 

Therefore, Potassium ($\\ce{K}$) is more reducing than Sodium ($\\ce{Na}$), and both are more reducing than Magnesium.

⚡ **The Lower-Left Rule**
Think of the Periodic Table. The strongest reducers live in the bottom-left corner. Since Potassium is below Sodium in the same group, it wins the "Most Reducing" title hands down.

⚠️ **Common Traps**
Don't confuse "reducing agent" with "gets reduced." A reducing agent *is* oxidized. So we are looking for the easiest element to oxidize. Also, don't get tricked by the mass; reactivity is about electronic shielding, not weight.

$$\\boxed{\\text{Answer: (c)}}$$`
    },
    {
      display_id: 'RDX-106',
      solution: `🧠 **Looking for the Minimum**
To find the strongest reducing agent among compounds, look for the central atom that is in its lowest possible oxidation state. If an atom is already at the bottom of its range, it can't gain more electrons—it can only donate them.

🗺️ **State Analysis**
*   **$\\ce{HNO2}$ (Nitrogen is $+3$)**: It can go up to $+5$ or down to $-3$. Neutral character.
*   **$\\ce{H2S}$ (Sulphur is $-2$)**: This is the minimum possible state for Sulphur (Group 16). It is highly unstable in the presence of oxidizers and desperately wants to lose electrons.
*   **$\\ce{H2SO3}$ (Sulphur is $+4$)**: It can still go up to $+6$.
*   **$\\ce{SnCl2}$ (Tin is $+2$)**: Standard reducing agent, but not as potent as the $-2$ state of a non-metal like Sulphur in $\\ce{H2S}$.

$\\ce{H2S}$ is the most powerful reducer here because Sulphur is at its absolute electronic limit on the negative side.

⚡ **The "Bottomed-Out" State**
Whenever you see a non-metal at its minimum oxidation state (like $\\ce{S}$ in $\\ce{H2S}$, $\\ce{N}$ in $\\ce{NH3}$, or $\\ce{P}$ in $\\ce{PH3}$), you should immediately flag it as a potentially strong reducing agent.

⚠️ **Common Traps**
Don't just look for "well-known" reducers like $\\ce{SnCl2}$. While $\\ce{SnCl2}$ is used often in organic chemistry (Stephen reduction), $\\ce{H2S}$ is conceptually a stronger reducer due to the $-2$ state of Sulphur.

$$\\boxed{\\text{Answer: (b)}}$$`
    }
  ];

  for (const sol of solutions) {
    await col.updateOne(
      { display_id: sol.display_id },
      { $set: { solution: { text_markdown: sol.solution, latex_validated: false } } }
    );
    console.log(`✅ Updated solution for ${sol.display_id}`);
  }

  await client.close();
}

main();
