require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  const solutions = [
    {
      display_id: 'RDX-113',
      solution: `🧠 **The Manganese Medium Hunt**
Permanganate ($\\ce{KMnO4}$) is a versatile oxidizer, but its appetite for electrons depends entirely on the pH of the crowd. Specifically, the "n-factor" (electrons gained per molecule) determines the equivalent weight ($M/n$).

🗺️ **The Three Faces of Manganese**
1. **Acidic Medium**: The $\\ce{Mn}$ ($+7$) is satisfied only after picking up 5 electrons to become $\\ce{Mn^{2+}}$.
   $$ n = 5 \\Rightarrow \text{Eq. weight} = M/5 $$
2. **Neutral or Slightly Alkaline**: It only picks up 3 electrons to form $\\ce{MnO2}$ ($+4$).
   $$ n = 3 \\Rightarrow \text{Eq. weight} = M/3 $$
3. **Strongly Alkaline**: It gains only a single electron to become Manganate ($\\ce{MnO4^{2-}}$, where $\\ce{Mn}$ is $+6$).
   $$ n = 1 \\Rightarrow \text{Eq. weight} = M $$

The values are $M/5, M/3, \text{ and } M$.

⚡ **The "5-3-1" Secret**
Memorize the sequence "5-3-1" for Manganese corresponding to acidic, neutral, and alkaline conditions. It's a standard numerical code used by top students to solve this in under 10 seconds.

⚠️ **Common Traps**
Don't mix up "manganate" and "permanganate." One is $+7$ (purple), and the other is $+6$ (green). Also, remember that "neutral" and "weakly alkaline" behave the same way here!

$$\\boxed{\\text{Answer: (c)}}$$`
    },
    {
      display_id: 'RDX-114',
      solution: `🧠 **Per-Atom vs Per-Molecule**
The "Aha!" moment in calculating equivalent weight for $\\ce{Cr2O7^{2-}}$ is realizing that the molecule has a dual-core: two Chromium atoms. The total electron gain is the sum of what *both* atoms receive.

🗺️ **The Electron Ledger**
In an acidic medium, the dichromate ion behaves as follows:
$$\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O}$$
1. **Oxidation State Shift**: Each Chromium goes from $+6$ to $+3$.
2. **Change per atom**: $6 - 3 = 3$ electrons.
3. **Total change for the ion**: Since there are **two** Chromium atoms:
   $$ n = 2 \\times 3 = 6 $$
4. **Conclusion**:
   $$ \text{Equivalent weight} = \frac{\text{Molecular weight}}{n} = M/6 $$

⚡ **The "Six with Dichromate" Rule**
In almost all JEE acidic redox problems, $\\ce{K2Cr2O7}$ has an n-factor of 6. This is a robust constant you can carry into the exam hall—no need to derive it every time!

⚠️ **Common Traps**
The most repeated error is picking $M/3$. Students see the $+6$ to $+3$ jump and stop there, forgetting to double it for the two atoms in the formula unit. Always count your atoms!

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-115',
      solution: `🧠 **The Average Shift**
Thiosulphate ($\\ce{Na2S2O3}$) is a tricky one because the oxidation state involves fractions when looking at the average. The key is to track the total change for the entire molecule.

🗺️ **The Stoichiometric Math**
Reaction: $\\ce{2Na2S2O3 + I2 -> Na2S4O6 + 2NaI}$
1. **Initial State ($\\ce{Na2S2O3}$)**: Average oxidation state of Sulphur is $+2$.
2. **Final State ($\\ce{Na2S4O6}$)**: Average oxidation state of Sulphur is $+2.5$.
3. **Change per Sulphur atom**: $2.5 - 2 = 0.5$.
4. **Total change per Molecule**: A single $\\ce{Na2S2O3}$ unit contains 2 Sulphur atoms.
   $$ n = 2 \\times 0.5 = 1 $$
   $$ \text{Equivalent weight} = M/1 = M $$

⚡ **The Iodometry Anchor**
This is the fundamental reaction of Iodometry. In this world, Thiosulphate **always** has an n-factor of 1. If you see "Hypo" (Thiosulphate) and "Iodine," the answer for equivalent weight is just $M$.

⚠️ **Common Traps**
Don't overthink the $2$ in the balanced equation ($\\ce{2Na2S2O3}$). Equivalent weight is defined *per mole of the substance* being analyzed. Also, don't get spooked by the fractional state ($+2.5$) in the tetrathionate ion. Average states work just fine for electron tracking.

$$\\boxed{\\text{Answer: (a)}}$$`
    },
    {
      display_id: 'RDX-116',
      solution: `🧠 **Tracking the Nitrogen Pivot**
Hydroxylamine ($\\ce{NH2OH}$) isn't very common, so we need to be extra careful with the signs. We are looking for the "bridge" between Nitrogen in the $+1$ and $-1$ states.

🗺️ **Solving for the n-factor**
1. **Reactant ($\\ce{NH2OH}$)**: 
   Assuming $\\ce{H}$ is $+1$ and $\\ce{O}$ is $-2$:
   $$ x + 3(+1) + (-2) = 0 \\Rightarrow x + 1 = 0 \\Rightarrow x = -1 $$
2. **Product ($\\ce{N2O}$)**:
   $$ 2x + (-2) = 0 \\Rightarrow 2x = 2 \\Rightarrow x = +1 $$
3. **Electronic Jump**:
   The oxidation number moves from $-1$ to $+1$.
   $$ \text{Change } = (+1) - (-1) = 2 $$
4. **Final Step**:
   Since the change per Nitrogen atom is 2:
   $$ \text{Eq. weight} = M/2 $$

⚡ **The Standard Difference**
Just subtract the states: $1 - (-1) = 2$. It's a quick shift. Even if you're unsure of the name, the formula $\\ce{NH2OH}$ tells you exactly what Nitrogen is doing.

⚠️ **Common Traps**
Double-check the $\\ce{N2O}$ state. It's Nitrous Oxide, not Nitric Oxide ($\\ce{NO}$). If you pick $\\ce{NO}$ by mistake ($+2$), you'll get a change of 3 and get stuck with $M/3$. Always read the product formula letter-by-letter.

$$\\boxed{\\text{Answer: (b)}}$$`
    },
    {
      display_id: 'RDX-117',
      solution: `🧠 **The Stoichiometric Sink**
In an ionic equation like this, the electrons are already laid out for us. This is a gift! The n-factor is simply the number of electrons involved *per mole of the reactant*.

🗺️ **Applying the Definition**
Given Ionic Equation:
$$\\ce{2BrO3- + 12H+ + 10e- -> Br2 + 6H2O}$$
1. **Electron Involvement**: The equation shows 10 electrons are being taken up.
2. **Reactant Moles**: These 10 electrons are used by **2 moles** of $\\ce{BrO3-}$.
3. **Electrons per mole (n-factor)**:
   $$ n = \frac{10 \text{ electrons}}{2 \text{ moles of } \ce{BrO3-}} = 5 $$
4. **Final Result**:
   $$ \text{Equivalent weight} = M/n = M/5 $$

⚡ **The Electron/Mole Rule**
Focus strictly on the substance in the question ($\\ce{KBrO3}$). Look at the balanced equation and divide the total electrons by its coefficient. $10 / 2 = 5$. Immediate answer.

⚠️ **Common Traps**
Don't pick $M/10$! The "10" applies to the whole reaction as written (for 2 moles). You must always normalize the value to "per mole" of the specific compound asked about.

$$\\boxed{\\text{Answer: (d)}}$$`
    },
    {
      display_id: 'RDX-118',
      solution: `🧠 **Balancing by Electrons**
Redox balancing is like a seesaw: the number of electrons lost by one element must exactly equal the electrons gained by another. We'll use the "cross-multiplication" method for the n-factors.

🗺️ **The Balancing Act**
1. **Identify the n-factors**:
   - $\\ce{Mn}$ in $\\ce{MnO}$ is $+2$. In $\\ce{HMnO4}$, it is $+7$. Difference ($n_1$) = $5$.
   - $\\ce{Pb}$ in $\\ce{PbO2}$ is $+4$. In $\\ce{Pb(NO3)2}$, it is $+2$. Difference ($n_2$) = $2$.
2. **Cross-Multiply the Coefficients**:
   Use $n_2$ for $\\ce{MnO}$ and $n_1$ for $\\ce{PbO2}$:
   $$ 2\ce{MnO} + 5\ce{PbO2} $$
3. **Balance the Other Elements**:
   - To match the $5 \\ce{Pb}$, we need $5 \\ce{Pb(NO3)2}$ on the right.
   - To match the $2 \\ce{Mn}$, we need $2 \\ce{HMnO4}$ on the right.
4. **Checking Nitrogen (z)**:
   The products contain $5 \\times 2 = 10$ Nitrogens (in $\\ce{Pb(NO3)2}$).
   So we need $10 \\ce{HNO3}$ on the left. ($z = 10$).

The set is $x=2, y=5, z=10$.

⚡ **The n-Factor Cross**
If you know it's a 5-unit jump for $\\ce{Mn}$ and a 2-unit jump for $\\ce{Pb}$, the coefficients $x$ and $y$ must be in the ratio $2:5$ to keep the electrons balanced ($2 \\times 5 = 10$ and $5 \\times 2 = 10$). Only option (a) starts with $2$ and $5$.

⚠️ **Common Traps**
The most frequent mistake is guessing $z$ randomly. Once you've fixed Manganese and Lead, $z$ (the acid) is at the mercy of the Nitrate ions required by the Lead atoms. Nitrogen from $\\ce{HNO3}$ doesn't change oxidation state; it's just there for the ions.

$$\\boxed{\\text{Answer: (a)}}$$`
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
