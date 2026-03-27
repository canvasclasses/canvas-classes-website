require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'RDX-131',
      solution: `🧠 **The Valence Shift Metric**
To identify a redox reaction, don't look at the complexity of the formulas. Look for movement. Does any element change its oxidation number? If even one electron is swapped between atoms, it's a redox process.

🗺️ **The Reaction Audit**
Let's analyze the key transitions:
*   (a) **$\\ce{NaIO3 + NaHSO3}$**: 
    - Iodine moves from $+5$ (in $\\ce{IO3-}$) to $0$ (in $\\ce{I2}$). Reduction.
    - Sulphur moves from $+4$ (in $\\ce{HSO3-}$) to $+6$ (in $\\ce{SO4^{2-}}$). Oxidation.
    - **Outcome: Redox**.
*   (b) **Prussian Blue Formation**: This is a simple ion-exchange and complexation reaction. Iron stays as $\\ce{Fe^{3+}}$ and $\\ce{[Fe(CN)6]^{4-}}$ units. No state change.
*   (c) **AgCl Dissolution**: Silver stays $+2$ (or $+1$) in the complex. This is coordination chemistry, not redox.
*   (d) **$\\ce{NaBiO3 + MnSO4}$**:
    - Bismuth moves from $+5$ (in $\\ce{BiO3-}$) to $+3$ (in $\\ce{Bi(NO3)3}$). Reduction.
    - Manganese moves from $+2$ to $+7$ (in $\\ce{HMnO4}$). Oxidation.
    - **Outcome: Redox**.

⚡ **The Element Marker**
If you see an element in its free state (like $\\ce{I2}$) appearing as a product from a compound (like $\\ce{IO3-}$), it is guaranteed to be a redox reaction. Elemental state $0$ is almost always a different oxidation number than the compound state.

⚠️ **Common Traps**
Don't be fooled by the "scary" looking coordination complexes in options (b) and (c). Most complex formation reactions are just Lewis acid-base interactions without any electron exchange.

$$\\boxed{\\text{Answer: (a, d)}}$$`
    },
    {
      display_id: 'RDX-132',
      solution: `🧠 **The "Self-Redox" Split**
Autoredox, or disproportionation, is a special case where a single substance is both the "thief" and the "victim." One atom of an element loses electrons to another atom of the same element. We are looking for a reactant that produces both a more-oxidized and a more-reduced version of itself.

🗺️ **Disproportionation Analysis**
*   (a) **Phosphorus ($\\ce{P4}$)**: 
    - Starts at $0$.
    - Goes to $\\ce{PH3}$ ($-3$, reduced).
    - Goes to $\\ce{H2PO4-}$ ($+1$, oxidized).
    - **Outcome: Autoredox**.
*   (b) **Thiosulphate ($\\ce{S2O3^{2-}}$)**: In acidic media or on heating.
    - Sulphur (average $+2$) splits into $\\ce{SO4^{2-}}$ ($+6$, oxidized) and $\\ce{S}$ ($0$, reduced).
    - **Outcome: Autoredox**.
*   (c) **Hydrogen Peroxide ($\\ce{H2O2}$)**:
    - Oxygen starts at $-1$.
    - Goes to $\\ce{H2O}$ ($-2$, reduced).
    - Goes to $\\ce{O2}$ ($0$, oxidized).
    - **Outcome: Autoredox**.
*   (d) **Silver complex**: No change in oxidation states.

⚡ **The Unstable Intermediate**
Elements in "middle" oxidation states are often prone to autoredox. Phosphorus ($0$), Peroxide Oxygen ($-1$), and Thiosulphate ($+2$) are all classic examples of electronic states that want to "split" into more stable extreme ends ($0$ and $-2$ for Oxygen, etc.).

⚠️ **Common Traps**
Don't confuse disproportionation with simple decomposition. While $\\ce{H2O2}$ *is* decomposing, it is specifically the disproportionation of Oxygen that makes it a redox event.

$$\\boxed{\\text{Answer: (a, b, c)}}$$`
    },
    {
      display_id: 'RDX-133',
      solution: `🧠 **The Peroxo Bond Secret**
When Sulphur is surrounded by many Oxygen atoms, it often hits its max $+6$ state. However, if you calculate the value and get something bigger than $+6$ (like $+7$ or $+8$), the "Aha!" moment is realizing there are peroxo bonds ($\\ce{-O-O-}$ bonds) present where Oxygen is $-1$, not $-2$.

🗺️ **Solving the "ic" Acids**
*   (a) **Caro's Acid ($\\ce{H2SO5}$)**: Structure shows one peroxo group ($+6$ shift).
    $$ 2(+1) + x + 3(-2) + 2(-1) = 0 \\Rightarrow 2 + x - 6 - 2 = 0 \\Rightarrow x = +6 $$
*   (b) **Marshall's Acid ($\\ce{H2S2O8}$)**: Has one peroxo bridge between two Sulphur atoms ($+6$ each).
    $$ 2(+1) + 2x + 6(-2) + 2(-1) = 0 \\Rightarrow 2 + 2x - 12 - 2 = 0 \\Rightarrow 2x = 12 \\Rightarrow x = +6 $$
*   (c) **Oleum ($\\ce{H2S2O7}$)**: Pyrosulphuric acid, no peroxo bonds.
    $$ 2 + 2x - 14 = 0 \\Rightarrow 2x = 12 \\Rightarrow x = +6 $$
*   (d) **Hypo ($\\ce{Na2S2O3}$)**: Average state is $+2$.

Options (a), (b), and (c) all feature Sulphur in the $+6$ state.

⚡ **The Maximum Cap**
Sulphur is in Group 16. It cannot physically have an oxidation state higher than $+6$. If you ever calculate a state like $+7, +8, \text{ or } +10$ for Sulphur, stop immediately—the state is $+6$ and you've just discovered a peroxo bond!

⚠️ **Common Traps**
Don't distinguish between these "high" acids by number of oxygens alone. They all have different structural arrangements, but the "limit" of the central atom remains the same $+6$ because it can't lose more than its 6 valence electrons.

$$\\boxed{\\text{Answer: (a, b, c)}}$$`
    },
    {
      display_id: 'RDX-134',
      solution: `🧠 **Sorting the Series**
To check an "order" question, you must calculate each member of the sequence. For Sulphur, it's helpful to remember the scale goes from $+6$ (Max) down to $-2$ (Min).

🗺️ **Sequence Verification**
Let's check the most likely candidates:
*   (a) **Series A**:
    - $\\ce{H2S2O7}$: $+6$
    - $\\ce{Na2S4O6}$: $+2.5$
    - $\\ce{Na2S2O3}$: $+2$
    - $\\ce{S8}$: $0$
    - **Order: $+6 > +2.5 > +2 > 0$**. Perfect decreasing order.
*   (b) **Series B**: Mixing $\\ce{SO4^{2-}}$ ($+6$) and $\\ce{SO3^{2-}}$ ($+4$) with others usually breaks the linear order.
*   (c) **Series C**:
    - $\\ce{H2SO5}$: $+6$
    - $\\ce{H2SO3}$: $+4$
    - $\\ce{SCl2}$: $+2$ (since $\\ce{Cl}$ is more electronegative)
    - $\\ce{H2S}$: $-2$
    - **Order: $+6 > +4 > +2 > -2$**. Perfect decreasing order.

Both (a) and (c) are correctly arranged in decreasing order.

⚡ **The Anchor Points**
Always start with the ends. $\\ce{H2SO4, H2S2O7, \\text{ or } H2SO5}$ are the $+6$ anchors. $\\ce{S8}$ is the $0$ anchor. $\\ce{H2S}$ is the $-2$ anchor. If the sequence flows correctly between these anchors, it's usually your winner.

⚠️ **Common Traps**
In option (c), don't treat $\\ce{SCl2}$ as Sulphur being $-2$. Chlorine is $3.0$ on the Pauling scale while Sulphur is $2.5$. Chlorine is the "more electronegative" one here, forcing Sulphur to be positive ($+2$).

$$\\boxed{\\text{Answer: (a, c)}}$$`
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
