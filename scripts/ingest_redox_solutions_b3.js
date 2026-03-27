require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'RDX-107',
      solution: `🧠 **The Dual Identity of Bromine**
In many redox reactions, one element gets reduced while another gets oxidized. But in this specific chemical ballet, a single element—Bromine—is doing both tasks at once. This phenomenon is known as disproportionation.

🗺️ **Tracking the Numbers**
Let's look at the oxidation states in the equation:
$$\\ce{3Br2 + 6CO3^{2-} + 3H2O -> 5Br- + BrO3- + 6HCO3-}$$
1. **Reactant side**: Bromine is in its elemental state ($\\ce{Br2}$), so its oxidation number is $0$.
2. **Product side**:
   - In $\\ce{Br-}$, the oxidation number is $-1$ (Reduction: $0 \\to -1$).
   - In $\\ce{BrO3-}$, let $\\ce{Br}$ be $x$: $x + 3(-2) = -1 \\Rightarrow x = +5$ (Oxidation: $0 \\to +5$).
3. **Carbonate part**: The Carbon in $\\ce{CO3^{2-}}$ and $\\ce{6HCO3-}$ is in the $+4$ state. No change there.

Since Bromine is moving to both a lower ($-1$) and a higher ($+5$) state, it is both reduced and oxidized.

⚡ **The Product Scan**
Whenever you see a reaction where an element in its' zero state (like $\\ce{Br2, Cl2, P4}$) produces two different products containing that same element, it's almost certainly a disproportionation reaction. You don't even need to balance it to see that Bromine is playing a double role.

⚠️ **Common Traps**
Don't let the complex looking $\\ce{CO3^{2-}}$ and $\\ce{HCO3-}$ distract you. Often, these ions are just there to provide the required pH (alkaline medium) for the disproportionation to occur. The real action is purely with the Bromine.

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-108',
      solution: `🧠 **Spotting the Non-Redox Event**
Many Nitrogen reactions are high-energy redox processes (like explosions or acid-metal reactions). However, some are merely proton-transfer or dehydration steps where the electronic state of Nitrogen remains untouched. We are searching for a reaction where Nitrogen keeps its "oxidation passport" unchanged.

🗺️ **The Reaction Audit**
Let's check the oxidation state of Nitrogen in each path:
*   (a) **Nitrating Mixture**: $\\ce{HNO3 + 2H2SO4 -> NO2+ + H3O+ + 2HSO4-}$.
    - In $\\ce{HNO3}$, $\\text{N} = +5$.
    - In the nitronium ion $\\ce{NO2+}$, $x + 2(-2) = +1 \\Rightarrow x = +5$.
    - **No change**. This is a classic acid-base interaction where $\\ce{H2SO4}$ protonates $\\ce{HNO3}$.
*   (b) **$\\ce{2N2O4 + 2KI -> 2KNO3 + 2NO + I2}$**: $\\ce{N}$ goes from $+4$ to both $+5$ and $+2$. Change.
*   (c) **$\\ce{2KHN2 + N2O -> KN3 + KOH + NH3}$**: $\\ce{N}$ in $\\ce{N2O}$ is $+1$, while in $\\ce{NH3}$ it is $-3$. Change.
*   (d) **Complex Redox**: While Nitrogen in the cyanides stays $-3$, the Chromium and Iron are undergoing clear oxidation and reduction. But usually, (a) is the intended conceptual answer for Nitrogen staying static.

⚡ **The Nitrating Mixture Rule**
Memorize this: The formation of the nitronium ion ($\\ce{NO2+}$) from nitric acid is a dehydration/protonation reaction, not a redox reaction. Nitrogen starts as $+5$ and ends as $+5$. It's a standard "trick" question in JEE.

⚠️ **Common Traps**
Don't assume that just because an ion looks different (like $\\ce{NO2+}$ vs $\\ce{HNO3}$), it must have undergone a redox change. Always calculate. Both are in the maximum possible state for Nitrogen ($+5$).

$$\\boxed{\\text{Answer: (a)}}$$`
    },
    {
      display_id: 'RDX-109',
      solution: `🧠 **Ranking the Donors**
"Reducing power" is just another way of saying "I want to get rid of my electrons." To rank these, we look at the Electrochemical Series (or Reactivity Series). The more a metal "hates" its valence electrons, the more reducing power it has.

🗺️ **The Reactivity Ranking**
From our standard chemical knowledge of the metal activity series:
1. **Sodium ($\\ce{Na}$)**: An alkali metal. Extremely reactive. Loses its lone $3s^1$ electron almost instantly. Highest reducing power here.
2. **Magnesium ($\\ce{Mg}$)**: An alkaline earth metal. Very reactive, but not as "desperate" as Sodium.
3. **Aluminium ($\\ce{Al}$)**: Reactive, but forms a protective oxide layer and has a slightly lower oxidation potential than Magnesium.
4. **Zinc ($\\ce{Zn}$)**: A transition-like metal. Much less reactive than the s-block metals above.

Arranging them in **increasing** order (weakest to strongest):
$\\ce{Zn < Al < Mg < Na}$.

⚡ **The Period/Group Trend**
Think of the periodic position. From Right to Left and Top to Bottom, metals become more electropositive. Sodium is in Group 1, making it the most reducing. Zinc is the furthest to the right in this list, making it the least.

⚠️ **Common Traps**
Make sure you read the arrow direction! The question asks for **increasing** order. It's heart-breaking to know the chemistry but pick the reversed list (Option c) because of a hasty read of the "$<$" signs.

$$\\boxed{\\text{Answer: (a)}}$$`
    },
    {
      display_id: 'RDX-110',
      solution: `🧠 **The Dual-Role Acid**
In many reactions involving concentrated $\\ce{H2SO4}$, the acid doesn't just provide protons (acidic character)—it also acts as a "hungry" oxidizer because the Sulphur is in its maximum $+6$ state and wants to be reduced.

🗺️ **The Redox Analysis**
Reaction: $\\ce{2Ag + 2H2SO4 -> Ag2SO4 + 2H2O + SO2}$
1. **Silver's fate**: $\\ce{Ag}$ (state $0$) becomes $\\ce{Ag+}$ (state $+1$). Silver is oxidized.
2. **Sulphur's fate**:
   - In part of the $\\ce{H2SO4}$, $\\ce{S}$ ($+6$) stays as $\\ce{SO4^{2-}}$ in $\\ce{Ag2SO4}$ ($+6$). This is the **acidic role**, forming a salt.
   - In the other part, $\\ce{S}$ ($+6$) becomes $\\ce{SO2}$ ($+4$). This is the **oxidant role**, gaining electrons.
3. **Proton's fate**: Hydrogen stays $+1$ in both acid and water.

Since the acid causes the oxidation of Silver and also forms a salt, it acts as both an oxidant and an acid.

⚡ **The Companion Strategy**
If a reaction with concentrated acid produces a gas like $\\ce{SO2}$ or $\\ce{NO2}$ along with a salt, that acid is playing two roles. The gas proves the oxidation role, and the salt proves the acid role.

⚠️ **Common Traps**
Don't pick just "oxidizing agent." While it *is* an oxidizer here, it is also providing the sulphate group for the salt. In the JEE context, "acid as well as oxidant" is the most complete and correct description.

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-111',
      solution: `🧠 **Complex Oxidation Audits**
Coordination chemistry compounds look intimidating, but they follow the same basic neutrality rules. The trick is knowing which ligands are neutral (like $\\ce{H2O}, \\ce{CO}, \\ce{NH3}$) and which are anionic (like $\\ce{Cl-}, \\ce{CN-}, \\ce{O^{2-}}, \\ce{O2^{2-}}$).

🗺️ **Solving for the Metal (x)**
Let's calculate the state for each transition metal:
*   (a) **$\\mathrm{[Cr(H_2O)_4Cl_2]Cl}$**: $x + 4(0) + 2(-1) + (-1) = 0 \\Rightarrow x = +3$.
*   (b) **$\\mathrm{[Fe(CO)_5]}$**: Carbonyl is neutral. $x + 5(0) = 0 \\Rightarrow x = 0$.
*   (c) **$\\mathrm{[(H_2O)_5Cr-O-Cr(H_2O)_5]^{4+}}$**: $\\ce{O}$ is oxo ($-2$). $2x + 10(0) + (-2) = +4 \\Rightarrow 2x = 6 \\Rightarrow x = +3$.
*   (d) **$\\mathrm{K_2[Cr(CN)_2O_2(O_2)NH_3]}$**: 
    This is an oxo-peroxo complex.
    - $2 [+1 \text{ for } \ce{K}]$
    - $x [\text{for } \ce{Cr}]$
    - $2 [-1 \text{ for } \ce{CN}]$
    - $2 [-2 \text{ for Oxo } \ce{O}]$
    - $1 [-2 \text{ for Peroxo } \ce{O2}]$
    - $0 [\text{for } \ce{NH3}]$
    Sum: $2 + x - 2 - 4 - 2 = 0 \\Rightarrow x = +6$.

Chromium hits $+6$ in the last complex.

⚡ **The Chromium Signature**
Chromium is most stable and infamous in its $+6$ and $+3$ states. In complexes with many oxygen ligands (oxo and peroxo), it almost always targets the $+6$ state (think of Chromate or Chromic acid).

⚠️ **Common Traps**
Be careful with the peroxo ($\\ce{O2}$) vs oxo ($\\ce{O}$) ligands. Peroxo behaves as a single unit with a $-2$ charge total. If you count each peroxo oxygen as $-2$, you'll overshoot the calculation and get an impossible oxidation number.

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-112',
      solution: `🧠 **The Nitrogen Staircase**
Nitrogen is the chameleon of chemistry, existing in states from $-3$ up to $+5$. To find the increasing order, we just need to correctly identify each "step" on this electronic staircase.

🗺️ **Step-by-Step State Check**
Let's verify the sequence in option (c), which is often the intended correct path:
1. **$\\ce{NH4+}$ (Ammonium)**: $x + 4(+1) = +1 \\Rightarrow x = -3$.
2. **$\\ce{N2H4}$ (Hydrazine)**: $2x + 4(+1) = 0 \\Rightarrow 2x = -4 \\Rightarrow x = -2$.
3. **$\\ce{NH2OH}$ (Hydroxylamine)**: 
   Set $\\ce{N}$ as $x$: $x + 2(+1) + (-2 \text{ for } \ce{O}) + (+1 \text{ for } \ce{H}) = 0$.
   $$x + 2 - 2 + 1 = 0 \\Rightarrow x = -1$$
4. **$\\ce{N2O}$ (Nitrous Oxide)**: $2x + (-2) = 0 \\Rightarrow 2x = 2 \\Rightarrow x = +1$.

The values are $-3 < -2 < -1 < +1$. This is a perfectly increasing sequence.

⚡ **The Valence Map**
In exams, if you're stuck, use the formula $O.N. = (\text{Charge}) - (\sum \text{Ligand charges})$.
- $\\ce{NH_4^+}: 1 - 4 = -3$
- $\\ce{N_2H_4}: 0 - 2 = -2$ (per N)
- $\\ce{NH_2OH}: 0 - 1 = -1$ (treating $\\ce{OH}$ as $-1$ and $2 \\ce{H}$ as $+2$)
- $\\ce{N_2O}: 0 - (-2) = +2$ (total), so $+1$ per N.

⚠️ **Common Traps**
Watch out for $\\ce{NH2OH}$—it's the most common place for calculation errors. It looks neutral, but the combination of Hydrogen and Oxygen atoms attached to Nitrogen requires careful sign management. Nitrogen is actually more electronegative than Hydrogen but less so than Oxygen, putting it in that middle $-1$ state.

$$\\boxed{\\text{Answer: (c)}}$$`
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
