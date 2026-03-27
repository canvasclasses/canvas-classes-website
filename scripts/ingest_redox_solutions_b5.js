require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'RDX-119',
      solution: `🧠 **The Cross-Method Pivot**
Balancing a complex redox equation like this without a systematic approach is a headache. The "Aha!" moment is identifying the two elements undergoing change: Manganese ($\\ce{Mn}$) and Nitrogen ($\\ce{N}$). Once we find their n-factors, the coefficients practically write themselves.

🗺️ **The n-Factor Audit**
1. **Manganese**: In $\\ce{KMnO4}$, $\\ce{Mn}$ is $+7$. In $\\ce{MnO2}$, it is $+4$.
   $$ \text{Change } = 7 - 4 = 3 \text{ electrons} $$
2. **Nitrogen**: In $\\ce{NH3}$, $\\ce{N}$ is $-3$. In $\\ce{KNO3}$, it is $+5$.
   $$ \text{Change } = 5 - (-3) = 8 \text{ electrons} $$
3. **The Balance**: To make the electron gain match the loss, multiply Manganese by 8 and Nitrogen by 3.
   $$ 8\ce{KMnO4} + 3\ce{NH3} $$
   This gives $x = 8$ and $y = 3$.

⚡ **The Electron Exchange shortcut**
The ratio of the n-factors ($3$ and $8$) must be inverted for the coefficients. Since Nitrogen changes by 8 and Manganese by 3, the ratio of $\\ce{KMnO4}$ to $\\ce{NH3}$ must be $8:3$. Only option (b) matches this specific ratio.

⚠️ **Common Traps**
Watch out for the sign in Nitrogen's jump! Moving from $-3$ to $+5$ is a change of $8$, not $2$. If you calculate it as $2$ (maybe by subtracting ignoring signs), you'll end up with a wrong ratio like $2:3$.

$$\\boxed{\\text{Answer: (b)}}$$`
    },
    {
      display_id: 'RDX-120',
      solution: `🧠 **The Three-Step Balance**
This reaction involves Chromium transitioning to a high state and Oxygen from peroxide dropping to a low state. We'll balance the redox cores first, and then let the Sodium and base (NaOH) fall into place.

🗺️ **Solving the Skeleton**
1. **Redox Cores**:
   - $\\ce{Cr}$ in $\\ce{CrCl3}$ is $+3$, and in $\\ce{Na2CrO4}$ it is $+6$. Jump = 3.
   - $\\ce{O}$ in $\\ce{H2O2}$ is $-1$. It goes to $-2$ (in $\\ce{Na2CrO4}$ or $\\ce{H2O}$). Jump per atom = 1. Jump per $\\ce{H2O2}$ molecule = 2.
2. **Coefficients**: Cross-multiply.
   - $x = 2$ (to match jump of 2)
   - $y = 3$ (to match jump of 3)
3. **Anions and Cations**:
   - $2 \\ce{CrCl3}$ gives $6 \\ce{Cl-}$, so we need $6 \\ce{NaCl}$ on the right.
   - Total Sodium on right: $2 \\ce{Na2CrO4}$ ($4 \\ce{Na}$) and $6 \\ce{NaCl}$ ($6 \\ce{Na}$) = $10 \\ce{Na}$.
   - Thus, we need $10 \\ce{NaOH}$ on the left ($z = 10$).

The set is $x=2, y=3, z=10$.

⚡ **The Chloride Marker**
Look at the Chlorine. If $x=2$, you have 6 Chlorines. They must appear as $6 \\ce{NaCl}$ on the right. That consumes 6 Sodium atoms. Add that to the 4 Sodiums in $2 \\ce{Na2CrO4}$ and you instantly find $z=10$. This "atom counting" shortcut is faster than full electron balancing.

⚠️ **Common Traps**
Don't forget the n-factor of $\\ce{H2O2}$ is 2 (because there are two Oxygen atoms in each molecule). If you use 1, you'll pick the $x=1, y=3$ logic which isn't even an option here.

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-121',
      solution: `🧠 **Ionic Mass and Charge Balance**
When balancing ionic equations, checking the total charge is often faster than tracking every single Oxygen. We'll start with the redox change and then use the charge to find the protons ($\\ce{H+}$).

🗺️ **The Step-by-Step Proof**
1. **Electron Exchange**:
   - $\\ce{Br}$ in $\\ce{BrO3-}$ is $+5 \\to$ in $\\ce{Br2}$ is $0$. Jump per atom = 5. To produce one $\\ce{Br2}$ unit (2 atoms), we gain 10 electrons.
   - $\\ce{Cr}$ $+3 \\to +6$ (in $\\ce{HCrO4-}$). Jump per atom = 3. 
2. **Coefficient Ratio**:
   To balance 10 (from $\\ce{Br}$) and 3 (from $\\ce{Cr}$), we multiply the Bromine part by 3 and Chromium part by 10.
   - $x = 2 \\times 3 = 6$ (to get 6 $\\ce{Br}$ atoms)
   - $y = 10$
3. **Oxygen/Water Balance**:
   - Right side Oxygen: $10 \\times 4 = 40$.
   - Left side Oxygen (from $\\ce{BrO3-}$): $6 \\times 3 = 18$.
   - Deficit = $40 - 18 = 22$. Thus, we need $22 \\ce{H2O}$ ($z=22$).

The set is $x=6, y=10, z=22$.

⚡ **The $z$ Shortcut**
Often in multiple-choice questions, the value of $z$ is the most distinct. Once you determine that you have 40 oxygens on the right and 18 on the left from the Bromate, you know $z$ must be 22. Only one option (c) lists $z=22$.

⚠️ **Common Traps**
A common error is not accounting for the two Bromines in $\\ce{Br2}$. Remember, the n-factor of the reactant ($\\ce{BrO3-}$) is 5, but when cross-multiplying to form a molecule like $\\ce{Br2}$, you must ensure the total electron transfer matches.

$$\\boxed{\\text{Answer: (c)}}$$`
    },
    {
      display_id: 'RDX-122',
      solution: `🧠 **The Iodoform Signature**
This is a standard stoichiometric question based on the famous Iodoform test. Ethanol behaves differently than Acetone. The reaction consumes Iodine for both the oxidation to acetaldehyde and the subsequent halogenation.

🗺️ **The Whiteboard Derivation**
For the Iodoform reaction of Ethanol:
$$\\ce{CH3CH2OH + 4I2 + 6OH- -> CHI3 + HCO2- + 5I- + 5H2O}$$
1. **Oxidation**: 1 mole of $\\ce{I2}$ is used to oxidize Ethanol to Acetaldehyde.
2. **Halogenation**: 3 moles of $\\ce{I2}$ are used to replace alpha-hydrogens and cleave the molecule.
3. **Total Iodine**: $y = 4$.
4. **Hydroxide (OH-)**: 6 moles of hydroxide are needed to neutralize the acid formed during cleavage and process the protons. $z = 6$.

Thus, $x=1, y=4, z=6$.

⚡ **Memory Anchor**
In JEE, it is highly recommended to memorize two specific ratios for iodoform:
- **Ethanol**: $1:4:6$ (Substrate : $\\ce{I2}$ : $\\ce{OH-}$)
- **Acetone**: $1:3:4$
Since the question asks about Ethanol ($\\ce{CH3CH2OH}$), the $1:4:6$ ratio (Option a) is the standard answer.

⚠️ **Common Traps**
Don't use the Acetone ratio ($1:3:4$) for Ethanol! Ethanol requires an extra mole of Iodine to first "prepare" itself by turning into an aldehyde. If you forget this initial oxidation step, you'll pick the wrong coefficients.

$$\\boxed{\\text{Answer: (a)}}$$`
    },
    {
      display_id: 'RDX-123',
      solution: `🧠 **Symmetry Simplification**
Ethylene ($\\ce{C2H4}$) or Ethene is a perfectly symmetric molecule: $\\ce{CH2=CH2}$. In such molecules, both Carbon atoms are in identical chemical environments, so their oxidation numbers must be the same.

🗺️ **Calculating the Number**
To find the state of Carbon ($x$):
1. **Compound Neutrality**: The sum of all oxidation numbers must be zero.
2. **Assigning Hydrogen**: Hydrogen is bonded to a non-metal, so its state is $+1$.
3. **The Equation**:
   $$ 2x + 4(+1) = 0 $$
   $$ 2x = -4 \\Rightarrow x = -2 $$

Both Carbon atoms carry an oxidation state of $-2$.

⚡ **The Bond-Counting Shortcut**
Look at one Carbon. It is bonded to two Hydrogens. Each $\\ce{C-H}$ bond effectively "gives" an electron to Carbon (since $\\ce{C}$ is more electronegative). The $\\ce{C=C}$ double bond between identical atoms doesn't contribute to the oxidation number. Total "gifts" = 2. So, state = $-2$.

⚠️ **Common Traps**
Don't use the $+4$/-4 valency as a default. In organic molecules, Carbon's oxidation state can vary widely depending on what it's attached to. Also, don't confuse this with the oxidation state in ethane ($\\ce{C2H6}$), where it would be $-3$. Every extra hydrogen reduces the carbon further.

$$\\boxed{\\text{Answer: (b)}}$$`
    },
    {
      display_id: 'RDX-124',
      solution: `🧠 **The Local Environment Shift**
Unlike symmetric ethylene, propene ($\\ce{CH3-CH=CH2}$) has carbons in different situations. We must "zoom in" on individual atoms. The oxidation number of a Carbon depends strictly on the atoms directly attached to it.

🗺️ **The Per-Atom Audit**
$$\\ce{\\overset{3}{CH}_3-\\overset{2}{CH}=\\overset{1}{CH}_2}$$
1. **Carbon-1 ($\\ce{=CH2}$)**: It is bonded to 2 Hydrogens. $\\ce{C}$ is more electronegative than $\\ce{H}$ ($2.5$ vs $2.1$). So, C-1 pulls 2 electrons from the Hydrogens. The double bond with Carbon-2 contributes 0.
   $$ \text{O.N. of C-1} = -2 $$
2. **Carbon-2 ($\\ce{-CH=}$)**: It is bonded to 1 Hydrogen. It pulls 1 electron from that Hydrogen. The single bond with C-3 and double bond with C-1 contribute 0.
   $$ \text{O.N. of C-2} = -1 $$
3. **Carbon-3 ($\\ce{-CH3}$)**: (Extra info) Bonded to 3 Hydrogens. It pulls 3 electrons.
   $$ \text{O.N. of C-3} = -3 $$

The states for C-1 and C-2 are $-2$ and $-1$.

⚡ **The "Hydrogen Count" Trick**
For an unsaturated hydrocarbon with only $\\ce{C}$ and $\\ce{H}$, simply count the number of Hydrogens on a specific carbon and make that number negative. 
- C-1 has 2 Hydrogens $\\to -2$.
- C-2 has 1 Hydrogen $\\to -1$.
Quick and effective for exams!

⚠️ **Common Traps**
Pay close attention to the labeling! The question asks for "C-1 and C-2 respectively." If you swap them (Option a or c) or provide the value for C-3, you'll lose the marks even if your math is right. Always match the number to the label in the diagram.

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
