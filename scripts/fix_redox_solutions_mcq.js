require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'RDX-128',
      solution: `🧠 **Hunting the Peak State**
Chromium is a transition metal with many faces, but its most iconic high-oxidation forms hit the ceiling at $+6$. In this MCQ, we are looking for every compound where Chromium has donated all its valence electrons.

🗺️ **The Molecule Audit**
*   (a) **$\\ce{FeCr2O4}$**: Iron is $+2$, Oxygen is $-2$. $2 + 2x - 8 = 0 \\Rightarrow x = +3$.
*   (b) **$\\ce{KCrO3Cl}$ (Potassium Chlorochromate)**: 
    $$ 1(+1 \text{ for } \ce{K}) + x + 3(-2 \text{ for } \ce{O}) + 1(-1 \text{ for } \ce{Cl}) = 0 $$
    $$ 1 + x - 6 - 1 = 0 \\Rightarrow x = +6 $$
*   (c) **$\\ce{CrO5}$ (Chromium Pentoxide)**: This famous "butterfly" structure has **four peroxo oxygens** ($-1$) and one oxo oxygen ($-2$).
    $$ x + 4(-1) + 1(-2) = 0 \\Rightarrow x = +6 $$
*   (d) **$\\mathrm{[Cr(OH)_4]-}$**: $x + 4(-1) = -1 \\Rightarrow x = +3$.

Both **(b)** and **(c)** feature Chromium in the $+6$ state.

⚡ **The Structure Scan**
Chromium is $+6$ whenever it is part of chromate ($\\ce{CrO4^{2-}}$), dichromate ($\\ce{Cr2O7^{2-}}$), or specialized oxo-species like $\\ce{CrO5}$. If you see multiple oxygens and no overall positive charge, $+6$ is your strongest bet.

⚠️ **Common Traps**
In $\\ce{CrO5}$, don't treat all five oxygens as regular oxides ($-2$), or you'll calculate an impossible $+10$ state. Similarly, for $\\ce{FeCr2O4}$, remember that Iron usually starts at $+2$ (ferrous) in spinels, which forces Chromium to stay at $+3$.

$$\\boxed{\\text{Answer: (b, c)}}$$`
    },
    {
      display_id: 'RDX-129',
      solution: `🧠 **The Zero-State Surprise**
Carbon is the master of variable oxidation states, but it often hits an exactly zero score in organic compounds where the Hydrogen-to-Oxygen ratio matches the hydration of water ($2:1$). This question tests your ability to see past the big molecular formulas.

🗺️ **Checking the Full List**
Let's see why every option on this list hits zero:
1. **$\\ce{HCHO}$ (Formaldehyde)**: Two Hydrogens ($+2$) and one Oxygen ($-2$) cancel out to leave Carbon at state $0$.
2. **$\\ce{CH2Cl2}$ (Dichloromethane)**: Two Hydrogens ($+2$) and two Chlorines ($-2$) perfectly balance. Carbon is $0$.
3. **$\\ce{C6H12O6}$ (Glucose)**: A carbohydrate. $12(+1) + 6(-2) = 0$. For neutrality, all carbons must aggregate to $0$.
4. **$\\ce{C12H22O11}$ (Sucrose)**: Another carbohydrate. $22(+1) + 11(-2) = 0$. Carbon remains at $0$.

All four options are correct representations of zero-state carbon.

⚡ **The Carbohydrate Shortcut**
If you see a formula like $\\ce{C_n(H2O)_m}$ (like glucose or sucrose), the average oxidation state of Carbon is mathematically guaranteed to be zero. It's a quick way to audit large organic molecules in any multiple-choice section.

⚠️ **Common Traps**
Zero oxidation number does **not** equal zero reactivity. Dichloromethane is quite different from sucrose! Remember that these numbers are just book-keeping conventions—the actual chemical energy is stored in the specific covalent bonds.

$$\\boxed{\\text{Answer: (a, b, c, d)}}$$`
    },
    {
      display_id: 'RDX-130',
      solution: `🧠 **Bonds without Electrons**
A "redox reaction" isn't just any change—it's an electron swap. If the central atoms start and end with the exact same oxidation state, it's just a reorganization of atoms (like a ligand exchange or an acid-base step), not a redox event.

🗺️ **The Structural Scan**
Let's look for the non-redox transitions:
*   (a) **$\\ce{Mg + N2 -> Mg3N2}$**: Pure redox. $0 + 0 \\to +2 + (-3)$.
*   (b) **Breakdown of Ferrocyanide**: $\\ce{K4[Fe(CN)6] + H2SO4 + H2O}$. 
    - Iron starts at $+2$ and stays $+2$ in $\\ce{FeSO4}$.
    - Carbon starts at $+2$ in $\\ce{CN-}$ ($x-3=-1$) and stays $+2$ in $\\ce{CO}$.
    - Nitrogen starts at $-3$ in $\\ce{CN-}$ and stays $-3$ in $\\ce{NH4+}$.
    - **Outcome: Not a redox reaction**.
*   (c) **$\\ce{I2 + Cl2 -> ICl3}$**: Redox change from $0$ to $+3/-1$.
*   (d) **Complexation of Copper**: $\\ce{CuSO4 + NH3 -> [Cu(NH3)4]SO4}$.
    - Copper starts at $+2$ in $\\ce{CuSO4}$.
    - Copper ends at $+2$ in the complex.
    - **Outcome: Not a redox reaction**.

Both (b) and (d) involve no change in oxidation numbers.

⚡ **The Neutral Ligand Logic**
If a reaction involves a transition metal just picking up neutral ligands (like $\\ce{NH3, H2O, \\text{ or } CO}$) without a separate oxidizing agent like Nitric acid, it is almost always a non-redox "complex formation" event.

⚠️ **Common Traps**
Don't be scared of big equations. In option (b), if you assume "something must be oxidized because it looks complicated," you'll miss the fact that it's actually a dehydration/protonation sequence that preserves all oxidation states.

$$\\boxed{\\text{Answer: (b, d)}}$$`
    }
  ];

  for (const sol of solutions) {
    await col.updateOne(
      { display_id: sol.display_id },
      { $set: { solution: { text_markdown: sol.solution, latex_validated: false } } }
    );
    console.log(`✅ Fixed solution for ${sol.display_id} as MCQ`);
  }

  await client.close();
}

main();
