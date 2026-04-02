require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const batch1 = [
  {
    display_id: 'TEMP-101',
    answer: 'b',
    solution: `🧠 **The "Aha!" Moment**
The question tests the fundamental understanding of the Hardy-Schulze rule, which relates the valency of an ion to its ability to cause coagulation (flocculating) of a sol. The key is to check if the statement matches the rule: higher valency leads to greater flocculating power.

🗺️ **The Standard Approach**
According to the Hardy-Schulze rule, the coagulation of a sol is caused by ions carrying a charge opposite to that of the sol particles. The coagulating power of an electrolyte is directly proportional to the valency of the active ion. 

For a positively charged sol, the flocculating power of anions follows the order:
$$\\ce{PO4^{3-}} > \\ce{SO4^{2-}} > \\ce{Cl-}$$
Statement I correctly identifies the rule. Statement II, however, provides an incorrect order for the flocculating power of anions for a positive sol (it suggests $\\ce{Cl-} > \\ce{SO4^{2-}} > \\ce{PO4^{3-}}$). Therefore, Statement I is correct but Statement II is incorrect.

⚡ **The 30-Second Trick**
Just remember: "More charge = More power." $\\ce{PO4^{3-}}$ has 3 units of charge, $\\ce{SO4^{2-}}$ has 2, and $\\ce{Cl-}$ has 1. Any order that doesn't put 3 > 2 > 1 for a positive sol is immediately wrong.

⚠️ **Common Traps**
Students often confuse "coagulating value" with "coagulating power." They are inversely related. High power means low value (only a small amount is needed). Don't let the examiner swap these terms on you!

$$\\boxed{\\text{Answer: (b)}}$$`
  },
  {
    display_id: 'TEMP-102',
    answer: 'c',
    solution: `🧠 **The "Aha!" Moment**
This is a conceptual question about polymer behavior. Thermosetting polymers are like an egg—once cooked (heated), they set into a permanent shape and can't be melted back. This is due to extensive cross-linking.

🗺️ **The Standard Approach**
Thermosetting plastics (like Bakelite or Melamine) are polymers that undergo a chemical change during the molding process, forming extensive cross-links between polymer chains. When heated, these cross-links prevent the polymer chains from sliding past each other. 

Instead of melting, they decompose upon excessive heating. Because they cannot be softened or remolded by heating, they are not reusable. This stands in contrast to thermoplastics, which can be melted and reshaped multiple times.

⚡ **The 30-Second Trick**
Think of the word "Set." Once they are "set," they are stuck. Thermoplastics (like PVC) "flow" when heated, while Thermosets "stay" until they break.

⚠️ **Common Traps**
Don't confuse "Thermosetting" with "Thermoplastic." Thermoplastics are reusable and have linear or slightly branched chains, whereas Thermosetting plastics have 3D network structures.

$$\\boxed{\\text{Answer: (c)}}$$`
  },
  {
    display_id: 'TEMP-103',
    answer: 'b',
    solution: `🧠 **The "Aha!" Moment**
Enantiomers are the "left and right hands" of chemistry. They are mirror images that simply won't fit perfectly on top of each other, no matter how you rotate them.

🗺️ **The Standard Approach**
Enantiomers are a pair of chiral molecules that are non-superimposable mirror images of each other. They have identical physical properties (like melting point, boiling point) but differ in the direction in which they rotate plane-polarized light.

The image notes mention $\\ce{S_N1}$ reactions: while they technically lead to racemization, in practice, inversion often slightly exceeds retention due to ion-pair effects, making the ratio not strictly $1:1$. However, the core definition remains non-superimposable mirror images.

⚡ **The 30-Second Trick**
Chirality = Handedness. If you can't put your right-handed glove on your left hand, they are enantiomers. Mirror images that are *superimposable* (like two plain balls) are identical, not enantiomers.

⚠️ **Common Traps**
Watch out for "Diastereomers." Diastereomers are stereoisomers that are NOT mirror images. Enantiomers MUST be mirror images.

$$\\boxed{\\text{Answer: (b)}}$$`
  },
  {
    display_id: 'TEMP-104',
    answer: 'd',
    solution: `🧠 **The "Aha!" Moment**
Treat $\\ce{CO2}$ ($O=C=O$) as a carbonyl compound with two sides. The Grignard reagent ($\\ce{R-MgX}$) acts as a nucleophile ($\\ce{R-}$) attacking the electrophilic carbon of $\\ce{CO2}$.

🗺️ **The Standard Approach**
1. **Nucleophilic Attack**: The alkyl group $\\ce{R}$ from $\\ce{R-MgX}$ attacks the carbon atom of $\\ce{CO2}$, pushing the electrons of one $\\ce{C=O}$ bond to oxygen.
   $$\\ce{R-MgX + O=C=O -> R-C(=O)-O-MgX}$$
2. **Intermediate (Y)**: This forms a magnesium salt of a carboxylic acid, represented as $\\ce{RCOOMgX}$.
3. **Acidic Hydrolysis**: Adding $\\ce{H3O+}$ protonates the carboxylate ion to form the carboxylic acid.
   $$\\ce{R-COOMgX + H3O+ -> R-COOH + Mg(OH)X}$$
The resulting product $\\ce{R-COOH}$ is a carboxylic acid.

⚡ **The 30-Second Trick**
Grignard ($\\ce{R-}$) + $\\ce{CO2}$ is the standard "Carbonation" reaction to make carboxylic acids. Just count the carbons: you are adding one carbon (from $\\ce{CO2}$) to your starting alkyl chain.

⚠️ **Common Traps**
Ensure you don't stop at the salt moiety ($Y$). The final product after hydrolysis is the acid itself. Also, remember that Dry Ether is essential; any moisture would destroy the Grignard reagent before it can react with $\\ce{CO2}$.

$$\\boxed{\\text{Answer: (d)}}$$`
  },
  {
    display_id: 'TEMP-105',
    answer: 'a',
    solution: `🧠 **The "Aha!" Moment**
The question asks for the definition of "one molal" ($1\\text{ m}$). The suffix "-al" refers to molality, while "-ar" refers to molarity.

🗺️ **The Standard Approach**
Molality ($m$) is defined as the number of moles of solute dissolved per $1\\text{ kilogram}$ ($1000\\text{ g}$) of **solvent**.
$$m = \\frac{n_{\\text{solute}}}{W_{\\text{solvent in kg}}}$$
For a "one molal" solution, $m = 1$. This implies:
$$1 = \\frac{1\\text{ mole of solute}}{1\\text{ kg of solvent}}$$
Therefore, $1$ mole of solute is present in $1000\\text{ g}$ of solvent (usually water). This is also equivalent to $0.5$ mol of solute in $500\\text{ g}$ of solvent.

⚡ **The 30-Second Trick**
Molarit**y** ($\\text{M}$) = Per Litre of Solut**ion**.
Molalit**y** ($\\text{m}$) = Per Kilogram of Solve**nt**.
The "m" in molality reminds you of "mass" of the solvent.

⚠️ **Common Traps**
The most common mistake is picking "1000 mL of solution" (which is molarity) or "1000 g of solution" (which is mass percentage). Molality is the *only* one that uses the mass of the **solvent** alone.

$$\\boxed{\\text{Answer: (a)}}$$`
  },
  {
    display_id: 'TEMP-106',
    answer: 'd',
    solution: `🧠 **The "Aha!" Moment**
This match-the-column tests the group-wise trends of hydrides in the s, p, and d blocks. The position of the element in the periodic table determines the nature of its hydride.

🗺️ **The Standard Approach**
- **Ionic Hydrides**: Formed by highly electropositive elements (Groups 1 and 2, except Be and Mg partly, but $\\ce{MgH2}$ is classified as ionic/polymeric). $\\ce{MgH2}$ (Group 2) $\\rightarrow$ **(iv) Ionic**.
- **Electron-Precise**: Formed by Group 14 elements. They have the exact number of electrons needed for bonds. $\\ce{GeH4}$ (Group 14) $\\rightarrow$ **(i) Electron precise**.
- **Electron-Deficient**: Formed by Group 13 elements ($\\ce{B, Al}$, etc.). They lack enough electrons to form normal covalent bonds (e.g., 3-center-2-electron bonds in $\\ce{B2H6}$). $\\ce{B2H6}$ (Group 13) $\\rightarrow$ **(ii) Electron deficient**.
- **Electron-Rich**: Formed by Groups 15, 16, and 17. They have lone pairs of electrons. $\\ce{HF}$ (Group 17) $\\rightarrow$ **(iii) Electron rich**.

⚡ **The 30-Second Trick**
Group 13 (Boron) = Deficient (think "B" for "Begging for electrons"). Group 14 (Carbon/Germane) = Precise. Group 15-17 (Nitrogen/HF) = Rich (lone pairs). Group 1-2 = Ionic.

⚠️ **Common Traps**
Sometimes students confuse $\\ce{CH4}$ and $\\ce{NH3}$. Remember, $\\ce{NH3}$ has a lone pair, making it rich, while $\\ce{CH4}$ has no lone pairs and is precise.

$$\\boxed{\\text{Answer: (d)}}$$`
  },
  {
    display_id: 'TEMP-107',
    answer: 'd',
    solution: `🧠 **The "Aha!" Moment**
Boiling point is all about how "sticky" the molecules are. The "stickier" the intermolecular force, the higher the boiling point. We are comparing Dipole-Dipole forces, H-bonding, and Van der Waals forces.

🗺️ **The Standard Approach**
- **Statement I**: Aldehydes and ketones have polar $\\ce{C=O}$ bonds ($\\ce{C^{\\delta+} = O^{\\delta-}}$). This leads to dipole-dipole interactions, which are stronger than the weak Van der Waals forces in non-polar hydrocarbons of similar mass. Hence, BP of Carbonyls > Hydrocarbons. (Correct)
- **Statement II**: Alcohols have $\\ce{-OH}$ groups capable of strong intermolecular Hydrogen bonding. Aldehydes and ketones cannot form H-bonds with themselves (they lack an H attached to O). Thus, alcohols are much "stickier" and have higher boiling points. (Correct)
The overall order is: **Alcohol > Aldehyde/Ketone > Hydrocarbon (Alkane)**.

⚡ **The 30-Second Trick**
H-bond is the "King" of intermolecular forces here. Dipole-dipole is the "Prince." Van der Waals is the "Commoner." 
Alcohols (King) > Aldehydes/Ketones (Prince) > Alkanes (Commoner).

⚠️ **Common Traps**
Students sometimes think aldehydes can H-bond because they see H and O. Crucially, the H must be *directly* attached to O (as in $\\ce{R-O-H}$) for intermolecular H-bonding to occur. Carbonyl H ($\\ce{R-CHO}$) is attached to C, not O!

$$\\boxed{\\text{Answer: (d)}}$$`
  },
  {
    display_id: 'TEMP-108',
    answer: 'c',
    solution: `🧠 **The "Aha!" Moment**
This is a "Name that Reaction" puzzle. Every reagent that reacts with a carbonyl ($\\ce{C=O}$) produces a specific functional group. It's essentially nucleophilic addition or addition-elimination.

🗺️ **The Standard Approach**
- **(A) Cyanohydrin**: Formed when $\\ce{HCN}$ adds to a carbonyl. The cyanide group ($\\ce{-CN}$) and hydroxy group ($\\ce{-OH}$) end up on the same carbon. $\\rightarrow$ **(iv) $\\ce{HCN}$**.
- **(B) Acetal**: Formed when a carbonyl reacts with two equivalents of alcohol ($\\ce{ROH}$) in the presence of dry $\\ce{HCl}$. $\\rightarrow$ **(iii) alcohol**.
- **(C) Schiff's base**: Formed by the reaction of a primary amine ($\\ce{RNH2}$) with a carbonyl. It is an imine. $\\rightarrow$ **(ii) $\\ce{RNH2}$**.
- **(D) Oxime**: Formed by the reaction of hydroxylamine ($\\ce{NH2OH}$) with a carbonyl. $\\rightarrow$ **(i) $\\ce{NH2OH}$**.

⚡ **The 30-Second Trick**
Learn the suffixes: 
- "Cya-" $\\rightarrow$ Cyanide ($\\ce{HCN}$).
- "Oxime" $\rightarrow$ Hydroxylamine.
- "Schiff" $\rightarrow$ Amine ($\\ce{R-NH2}$).
- "Acetal" $\rightarrow$ Alcohol.

⚠️ **Common Traps**
Don't confuse "Acetal" with "Hemiacetal." A hemiacetal is the intermediate formed with *one* equivalent of alcohol, while an acetal requires *two* equivalents.

$$\\boxed{\\text{Answer: (c)}}$$`
  }
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');

  for (const q of batch1) {
    const result = await col.updateOne(
      { display_id: q.display_id },
      { 
        $set: { 
          'answer.correct_option': q.answer,
          'solution': {
            text_markdown: q.solution,
            latex_validated: true
          }
        } 
      }
    );
    if (result.matchedCount === 0) {
      console.log(`❌ Could not find question ${q.display_id}`);
    } else {
      console.log(`✅ Updated ${q.display_id}`);
    }
  }

  await client.close();
}

main().catch(console.error);
