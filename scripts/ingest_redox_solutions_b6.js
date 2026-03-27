require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'RDX-125',
      solution: `🧠 **The Acidic Ledger**
In formic acid ($\\ce{HCOOH}$), carbon is sandwiched between a Hydrogen atom and two Oxygen atoms. The "Aha!" moment is calculating how these electronegative oxygens pull electrons away from the central carbon atom.

🗺️ **The Standard Audit**
Formula: $\\ce{H-C(=O)-OH}$
1. **Assigning States**: 
   - Each Hydrogen is $+1$.
   - Each Oxygen is $-2$.
2. **Neutrality Equation**:
   $$ 1(+1) + x + 2(-2) + 1(+1) = 0 $$
   $$ 1 + x - 4 + 1 = 0 \\Rightarrow x - 2 = 0 $$
   $$ x = +2 $$

The oxidation state of carbon in formic acid is $+2$.

⚡ **The Functional Group Shortcut**
In carboxyl groups ($-COOH$), the carbon is usually $+3$. But in formic acid (formate), it's attached to another Hydrogen instead of a Carbon. This Hydrogen "gives" an extra electron to Carbon compared to an alkyl group, dropping the state from $+3$ to $+2$.

⚠️ **Common Traps**
Don't guess $+4$ just because it's a small carboxylic acid. Always sum the elements. Also, don't confuse it with formaldehyde ($\\ce{HCHO}$), where the carbon state is $0$.

$$\\boxed{\\text{Answer: (a)}}$$`
    },
    {
      display_id: 'RDX-126',
      solution: `🧠 **Segmenting the Molecule**
In acetic acid ($\\ce{CH3COOH}$), the two carbon atoms have different oxidation states because they are in different environments. The "Aha!" moment is focusing strictly on the carbon atom that is part of the carboxyl ($-COOH$) group.

🗺️ **Local Bond Counting**
Let's analyze the bonds for the carboxylic carbon:
1. **Bond to Oxygen (double)**: This pulls 2 electrons away ($+2$).
2. **Bond to Oxygen (single)**: This pulls 1 electron away ($+1$).
3. **Bond to Carbon (methyl)**: A bond between two identical atoms counts as $0$.

Total "loss" = $+2 + +1 + 0 = +3$.

⚡ **The Group Constant**
Memorize this: The carbon atom in a carboxylic acid group ($-COOH$) is **always** in the $+3$ oxidation state (unless it's formic acid). It's a standard anchor for all organic redox problems.

⚠️ **Common Traps**
Don't average the states! While the total carbon charge is $(+3) + (-3) = 0$, the question specifically asks for the "carboxylic carbon." If you give the average (0), you'll fall for the classic examiner's illusion.

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-127',
      solution: `🧠 **The Extreme Swing**
Combustion is one of the most drastic redox events in chemistry. We are moving from the most "reduced" form of carbon (methane) to the most "oxidized" form (carbon dioxide).

🗺️ **The Jump Gradient**
1. **Reactant ($\\ce{CH4}$)**: Hydrogen is $+1$.
   $$ x + 4(+1) = 0 \\Rightarrow x = -4 $$
2. **Product ($\\ce{CO2}$)**: Oxygen is $-2$.
   $$ x + 2(-2) = 0 \\Rightarrow x = +4 $$
3. **The Shift**:
   $$ \text{Change } = (+4) - (-4) = +8 $$

The oxidation number changes by $8$ units.

⚡ **The Hydrocarbon Shortcut**
For any complete combustion of a saturated hydrocarbon, the change per carbon atom is simply the number of Hydrogens on it plus the 4 units needed to reach $\\ce{CO2}$. $4 + 4 = 8$. It's a massive jump—no surprise combustion releases so much energy!

⚠️ **Common Traps**
Students often forget to account for the negative sign of the initial state. $4 - 4 = 0$ is a tempting mistake, but a $-4$ to $+4$ move is a distance of $8$ on the number line.

$$\\boxed{\\text{Answer: (c)}}$$`
    },
    {
      display_id: 'RDX-128',
      solution: `🧠 **Searching for the Peak State**
Chromium is most stable in its $+3$ state, but its most dangerous and powerful forms are in the $+6$ state. We are looking for the Chromium(VI) species in this list.

🗺️ **The Molecule Scan**
*   (a) **$\\ce{FeCr2O4}$**: Iron is $+2$, Oxygen is $-2$. $2 + 2x - 8 = 0 \\Rightarrow x = +3$.
*   (b) **$\\ce{KCrO3Cl}$**: Potassium is $+1$, Oxygen is $-2$, Chlorine is $-1$.
    $$ 1 + x + 3(-2) + (-1) = 0 \\Rightarrow 0 + x - 6 = 0 \\Rightarrow x = +6 $$
*   (c) **$\\ce{CrO5}$**: Chromium Pentoxide (the "Butterfly"). This has 4 peroxo oxygens ($-1$) and 1 oxo oxygen ($-2$).
    $$ x + 4(-1) + (-2) = 0 \\Rightarrow x = +6 $$
*   (d) **$\\mathrm{[Cr(OH)_4]-}$**: Hydroxide is $-1$. $x + 4(-1) = -1 \\Rightarrow x = +3$.

Both (b) and (c) feature Chromium in the $+6$ state. Usually, in competitive exams, $\\ce{KCrO3Cl}$ (Chlorochromyl derivative) or $\\ce{CrO5}$ are both viable answers, but $\\ce{CrO5}$ is a more specialized "test" case. If restricted to one choice, $\\ce{KCrO3Cl}$ is the standard inorganic salt.

⚡ **The Oxo-Ligand Rule**
Any compound where Chromium is bonded to many oxygens (like $\\ce{CrO3, CrO4^{2-}, CrO5}$) is almost certainly a $+6$ state. Chromium "loves" being $+6$ when surrounded by electronegative oxygens.

⚠️ **Common Traps**
In $\\ce{CrO5}$, don't calculate based on five $-2$ oxygens! That would give an impossible state of $+10$. You must recognize the peroxo bonds in the butterfly structure, which caps the state at $+6$.

$$\\boxed{\\text{Answer: (b)}}$$`
    },
    {
      display_id: 'RDX-129',
      solution: `🧠 **The Carbohydrate Rule**
The "Aha!" moment here is recognizing that all carbohydrates (sugar, starch, glucose) follow the general formula $\\ce{C_n(H2O)_m}$. Since Water is neutral, the net oxidation state of Carbon in these compounds effectively averages out to zero.

🗺️ **The Calculation Checklist**
1. **$\\ce{HCHO}$ (Formaldehyde)**: $x + 2(1) + 1(-2) = 0 \\Rightarrow x = 0$.
2. **$\\ce{CH2Cl2}$ (Dichloromethane)**: $x + 2(1) + 2(-1) = 0 \\Rightarrow x = 0$.
3. **$\\ce{C6H12O6}$ (Glucose)**: $6x + 12(1) + 6(-2) = 0 \\Rightarrow 6x = 0 \\Rightarrow x = 0$.
4. **$\\ce{C12H22O11}$ (Sucrose)**: $12x + 22(1) + 11(-2) = 0 \\Rightarrow 12x = 0 \\Rightarrow x = 0$.

All of these compounds have an average carbon oxidation state of zero.

⚡ **The Neutral Ratio**
Whenever you see a $2:1$ ratio of Hydrogen to Oxygen in an organic molecule (the "hydrate of carbon"), the carbon state is zero. It's a quick heuristic for most sugars.

⚠️ **Common Traps**
Zero state doesn't mean "zero bonding." Carbon is still making four bonds in all these cases. Don't let the "zero" fool you into thinking the carbon is in its elemental form like graphite! 

$$\\boxed{\\text{Answer: (c)}}$$`
    },
    {
      display_id: 'RDX-130',
      solution: `🧠 **Redox vs Complexation**
A redox reaction requires an actual exchange of electrons leading to a change in oxidation numbers. A simple Lewis acid-base interaction (like a metal ion picking up ligands) is **not** a redox reaction.

🗺️ **Analyzing the Conversions**
1. **(a)** Element $+$ Element $\\to$ Compound. This is always redox ($0 \\to +3$ and $0 \\to -3$).
2. **(b)** Oxidation of Ferrocyanide to Ferri-? No, this is a complex breakdown involving the oxidation of Carbon and Nitrogen.
3. **(c) $\\ce{I2 + 3Cl2 -> 2ICl3}$**: Elemental states ($0$) to compounds ($+3, -1$). Redox.
4. **(d) Formation of $[\\mathrm{Cu(NH_3)_4]SO_4}$**:
   Copper starts in $\\ce{CuSO4}$ as $\\ce{Cu^{2+}}$ (state $+2$).
   Copper ends in the complex ion as $\\ce{Cu^{2+}}$ (state $+2$).
   Ligands ($\\ce{NH3}$) and Counter-ions ($\\ce{SO4^{2-}}$) also remain unchanged.

Since no oxidation numbers changed, (d) is not a redox reaction.

⚡ **The Coordination Clue**
Formation of a complex (where ligands just "sit" around a metal ion) is usually a coordinate covalent bond formation, which is a sub-type of acid-base reaction, not redox. If the metal's charge before and after matches, it's a non-redox path.

⚠️ **Common Traps**
Don't be intimidated by big formulas like $\\ce{K4[Fe(CN)6]}$. If you see a complex simply rearranging its ligands or dissolving in a base without producing a new element or gas, it's often not a redox process.

$$\\boxed{\\text{Answer: (d)}}$$`
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
