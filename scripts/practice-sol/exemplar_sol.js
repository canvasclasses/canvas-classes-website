// NCERT Exemplar — Class 12 Chemistry, Unit 2 (Solutions), Q1–Q62.
// Question stems + options transcribed from 12-Chemistry-Exemplar-Chapter-2.pdf.
// Worked answers/solutions from 12-Chemistry-Exemplar-Chapter-2-answer.pdf, verified
// independently. Item shape mirrors the equilibrium sibling scripts/practice/p_ieq.js
// and the NCERT-exercise sibling scripts/practice-sol/ncert_sol.js.
//
// CORRECTIONS to the official answer key (used corrected answer, flagged in explanation):
//   - Q23: key prints (i) "A–B interactions stronger". A MINIMUM-boiling azeotrope
//          means POSITIVE deviation → A–B interactions are WEAKER and MORE molecules
//          escape (higher vapour pressure). Correct single answer is (ii); statement
//          (iv) is also true. Key's (i) describes a maximum-boiling azeotrope. CORRECTED
//          to (ii) (correct_index 1).
//
// Multi-correct Type-II questions (Q27–Q35 where the key marks >1 option) are encoded
// as kind:'numerical' because the MCQ renderer is single-correct only. Q34 and Q35 are
// in fact single-pair sets but the key marks two options each, so they are numerical too.
module.exports = {
  'types-conc': [
    {
      kind: 'mcq',
      id: 'sol-ex-q1',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q1',
      prompt: 'Which of the following units is useful in relating concentration of solution with its vapour pressure?',
      options: [
        'mole fraction',
        'parts per million',
        'mass percentage',
        'molality',
      ],
      correct_index: 0,
      explanation: 'Raoult’s law links the vapour pressure of a component directly to its **mole fraction**: $p_1 = x_1\\, p_1^{\\circ}$. None of the other units (ppm, mass %, molality) appears in that relation, so **mole fraction** → option (i).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q24',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q24',
      prompt: '$4\\,\\text{L}$ of $0.02\\ \\text{M}$ aqueous solution of $\\ce{NaCl}$ was diluted by adding one litre of water. The molality of the resultant solution is ________.',
      options: [
        '$0.004$',
        '$0.008$',
        '$0.012$',
        '$0.016$',
      ],
      correct_index: 3,
      explanation: 'Moles of $\\ce{NaCl}$ are conserved on dilution: $n = 4\\ \\text{L} \\times 0.02\\ \\text{M} = 0.08\\ \\text{mol}$. After adding $1\\ \\text{L}$ water the total volume is $5\\ \\text{L}$. Taking the dilute aqueous solution density $\\approx 1\\ \\text{kg/L}$, the mass of solvent (water) $\\approx 5\\ \\text{kg}$.\n\nMolality $= \\frac{0.08\\ \\text{mol}}{5\\ \\text{kg}} = 0.016\\ \\text{mol kg}^{-1}$ → option (iv).',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q39',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q39',
      prompt: 'Concentration terms such as mass percentage, ppm, mole fraction and molality are independent of temperature, however molarity is a function of temperature. Explain.',
      answer: 'Molarity uses volume of solution, which changes with temperature; the others use only mass / moles, which do not change with temperature.',
      solution: '**Molarity** is defined as moles of solute per **litre of solution**. Volume **expands or contracts with temperature**, so the same amount of solute occupies a different volume at a different temperature — hence molarity changes with temperature.\n\nThe other terms — **mass percentage, ppm, mole fraction and molality** — are all built from **masses or numbers of moles** only (mass of solute, mass/moles of solvent). Mass and number of moles **do not change** with temperature, so these concentration terms stay constant as temperature varies.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q50',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q50',
      prompt: 'Match the terms given in Column I with expressions given in Column II.\n\n' +
        '| Column I (term) | Column II (expression) |\n' +
        '|---|---|\n' +
        '| (i) Mass percentage | (a) $\\frac{\\text{moles of solute component}}{\\text{volume of solution in litres}}$ |\n' +
        '| (ii) Volume percentage | (b) $\\frac{\\text{moles of a component}}{\\text{total moles of all components}}$ |\n' +
        '| (iii) Mole fraction | (c) $\\frac{\\text{volume of solute component in solution}}{\\text{total volume of solution}} \\times 100$ |\n' +
        '| (iv) Molality | (d) $\\frac{\\text{mass of solute component in solution}}{\\text{total mass of the solution}} \\times 100$ |\n' +
        '| (v) Molarity | (e) $\\frac{\\text{moles of solute components}}{\\text{mass of solvent in kilograms}}$ |',
      answer: '(i)-(d), (ii)-(c), (iii)-(b), (iv)-(e), (v)-(a)',
      solution: 'Match each concentration term to its defining formula:\n\n' +
        '- **(i) Mass percentage → (d):** mass of solute / total mass of solution × 100.\n' +
        '- **(ii) Volume percentage → (c):** volume of solute / total volume of solution × 100.\n' +
        '- **(iii) Mole fraction → (b):** moles of a component / total moles of all components.\n' +
        '- **(iv) Molality → (e):** moles of solute / mass of solvent in **kilograms**.\n' +
        '- **(v) Molarity → (a):** moles of solute / **volume of solution in litres**.',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q51',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q51',
      prompt: 'Assertion: Molarity of a solution in liquid state changes with temperature.\n\nReason: The volume of a solution changes with change in temperature.',
      options: [
        'Assertion and reason both are correct statements and reason is the correct explanation for assertion.',
        'Assertion and reason both are correct statements but reason is not the correct explanation for assertion.',
        'Assertion is correct statement but reason is wrong statement.',
        'Assertion and reason both are incorrect statements.',
        'Assertion is wrong statement but reason is correct statement.',
      ],
      correct_index: 0,
      explanation: 'Molarity $=$ moles of solute / **volume of solution**. Volume **does change with temperature** (the reason is true), and that is precisely **why** molarity changes with temperature (so the reason correctly explains the assertion). Both statements are correct and the reason explains the assertion → option (i).',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q55',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q55',
      prompt: 'Define the following modes of expressing the concentration of a solution. Which of these modes are independent of temperature and why?\n\n(i) w/w (mass percentage)\n\n(ii) V/V (volume percentage)\n\n(iii) w/V (mass by volume percentage)\n\n(iv) ppm (parts per million)\n\n(v) $x$ (mole fraction)\n\n(vi) M (molarity)\n\n(vii) m (molality)',
      answer: 'Mass percentage (w/w), ppm and mole fraction (x) and molality (m) are temperature-independent; volume percentage (V/V), mass-by-volume (w/V) and molarity (M) depend on temperature because they involve volume.',
      solution: '**Definitions:**\n\n' +
        '- **(i) w/w (mass percentage):** $\\frac{\\text{mass of solute}}{\\text{mass of solution}} \\times 100$.\n' +
        '- **(ii) V/V (volume percentage):** $\\frac{\\text{volume of solute}}{\\text{volume of solution}} \\times 100$.\n' +
        '- **(iii) w/V (mass by volume %):** $\\frac{\\text{mass of solute}}{\\text{volume of solution (mL)}} \\times 100$ — common in medicine/pharmacy.\n' +
        '- **(iv) ppm:** $\\frac{\\text{mass (or moles) of solute}}{\\text{total mass (or moles) of solution}} \\times 10^{6}$ — for very dilute solutions.\n' +
        '- **(v) Mole fraction $x$:** moles of a component / total moles of all components.\n' +
        '- **(vi) Molarity (M):** moles of solute / litre of solution.\n' +
        '- **(vii) Molality (m):** moles of solute / kg of solvent.\n\n' +
        '**Temperature dependence:** any term that uses a **volume** changes with temperature (volume expands/contracts), so **V/V, w/V and molarity (M)** depend on temperature. The terms built only from **mass or moles** — **w/w, ppm, mole fraction ($x$), molality ($m$)** — are **independent of temperature**.',
    },
  ],

  'solubility-henry': [
    {
      kind: 'mcq',
      id: 'sol-ex-q2',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q2',
      prompt: 'On dissolving sugar in water at room temperature solution feels cool to touch. Under which of the following cases dissolution of sugar will be most rapid?',
      options: [
        'Sugar crystals in cold water.',
        'Sugar crystals in hot water.',
        'Powdered sugar in cold water.',
        'Powdered sugar in hot water.',
      ],
      correct_index: 3,
      explanation: 'Dissolution speeds up with (a) **higher surface area** — powdered sugar exposes far more surface than crystals — and (b) **higher temperature** — hot water gives faster molecular motion. The fastest combination is therefore **powdered sugar in hot water** → option (iv).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q3',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q3',
      prompt: 'At equilibrium the rate of dissolution of a solid solute in a volatile liquid solvent is ________.',
      options: [
        'less than the rate of crystallisation',
        'greater than the rate of crystallisation',
        'equal to the rate of crystallisation',
        'zero',
      ],
      correct_index: 2,
      explanation: 'A **saturated solution at equilibrium** is a dynamic balance: solute keeps dissolving and keeps crystallising, but at **equal rates**, so the concentration stays constant. Rate of dissolution $=$ rate of crystallisation → option (iii). (It is not zero — both processes are still happening, just balanced.)',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q4',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q4',
      prompt: 'A beaker contains a solution of substance ‘A’. Precipitation of substance ‘A’ takes place when small amount of ‘A’ is added to the solution. The solution is ________.',
      options: [
        'saturated',
        'supersaturated',
        'unsaturated',
        'concentrated',
      ],
      correct_index: 1,
      explanation: 'If adding a tiny amount of solute makes the solute **precipitate (crash out)**, the solution was already holding **more than its saturation limit** — it was **supersaturated**, and the added seed triggers the excess to crystallise → option (ii). (If A had simply dissolved, it would be unsaturated; if nothing happened, it would be exactly saturated.)',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q5',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q5',
      prompt: 'Maximum amount of a solid solute that can be dissolved in a specified amount of a given liquid solvent does $not$ depend upon ________.',
      options: [
        'Temperature',
        'Nature of solute',
        'Pressure',
        'Nature of solvent',
      ],
      correct_index: 2,
      explanation: 'The solubility of a **solid** in a liquid depends on temperature, the nature of the solute, and the nature of the solvent — but **pressure has essentially no effect** on solids and liquids (they are nearly incompressible). So the maximum amount does **not** depend on **pressure** → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q6',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q6',
      prompt: 'Low concentration of oxygen in the blood and tissues of people living at high altitude is due to ________.',
      options: [
        'low temperature',
        'low atmospheric pressure',
        'high atmospheric pressure',
        'both low temperature and high atmospheric pressure',
      ],
      correct_index: 1,
      explanation: 'By Henry’s law the amount of a gas dissolved is proportional to its **partial pressure**. At high altitude the **atmospheric (and hence oxygen partial) pressure is low**, so less oxygen dissolves in the blood → option (ii). (Body temperature stays constant, so temperature is not the cause.)',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q17',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q17',
      prompt: 'Value of Henry’s constant $K_H$ ________.',
      options: [
        'increases with increase in temperature.',
        'decreases with increase in temperature.',
        'remains constant.',
        'first increases then decreases.',
      ],
      correct_index: 0,
      explanation: 'Gases are **less soluble** as temperature rises (dissolution of a gas is exothermic). Since $p = K_H\\, x$, a smaller mole fraction $x$ at the same pressure means a **larger $K_H$**. So $K_H$ **increases with increasing temperature** → option (i).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q18',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q18',
      prompt: 'The value of Henry’s constant $K_H$ is ________.',
      options: [
        'greater for gases with higher solubility.',
        'greater for gases with lower solubility.',
        'constant for all gases.',
        'not related to the solubility of gases.',
      ],
      correct_index: 1,
      explanation: 'From $p = K_H\\, x$, at a fixed pressure a **larger $K_H$ gives a smaller $x$** (less dissolved). So a high $K_H$ means **low solubility** — $K_H$ is **greater for gases with lower solubility** → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q26',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q26',
      prompt: '$K_H$ value for $\\ce{Ar}(g)$, $\\ce{CO2}(g)$, $\\ce{HCHO}(g)$ and $\\ce{CH4}(g)$ are $40.39$, $1.67$, $1.83\\times10^{-5}$ and $0.413$ respectively. Arrange these gases in the order of their increasing solubility.',
      options: [
        '$\\ce{HCHO} < \\ce{CH4} < \\ce{CO2} < \\ce{Ar}$',
        '$\\ce{HCHO} < \\ce{CO2} < \\ce{CH4} < \\ce{Ar}$',
        '$\\ce{Ar} < \\ce{CO2} < \\ce{CH4} < \\ce{HCHO}$',
        '$\\ce{Ar} < \\ce{CH4} < \\ce{CO2} < \\ce{HCHO}$',
      ],
      correct_index: 2,
      explanation: 'Higher $K_H$ → **lower** solubility, so increasing solubility means **decreasing $K_H$**. Ordering the constants from largest to smallest: $\\ce{Ar}(40.39) > \\ce{CO2}(1.67) > \\ce{CH4}(0.413) > \\ce{HCHO}(1.83\\times10^{-5})$. So increasing solubility is $\\ce{Ar} < \\ce{CO2} < \\ce{CH4} < \\ce{HCHO}$ → option (iii).',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q27',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q27',
      prompt: 'Which of the following factor(s) affect the solubility of a gaseous solute in the fixed volume of liquid solvent?\n\n(a) nature of solute  (b) temperature  (c) pressure\n\n(i) (a) and (c) at constant T\n\n(ii) (a) and (b) at constant P\n\n(iii) (b) and (c) only\n\n(iv) (c) only\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (ii)',
      solution: 'Solubility of a gas depends on the **nature of the solute (a)**, the **temperature (b)** and the **pressure (c)**.\n\n' +
        '- **(i) (a) and (c) at constant T:** with temperature fixed, nature of solute and pressure both matter — **correct**.\n' +
        '- **(ii) (a) and (b) at constant P:** with pressure fixed, nature of solute and temperature both matter — **correct**.\n' +
        '- (iii) and (iv) leave out one of the relevant factors, so they are incomplete.\n\n' +
        'Both **(i) and (ii)** are correct.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q38',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q38',
      prompt: 'Explain the solubility rule “like dissolves like” in terms of intermolecular forces that exist in solutions.',
      answer: 'A solute dissolves in a solvent when their intermolecular forces are similar in type and strength — polar dissolves polar, non-polar dissolves non-polar.',
      solution: 'A solute will dissolve well in a solvent only when the **intermolecular forces in the two are similar** in nature and magnitude, because then solute–solvent attractions can replace the solute–solute and solvent–solvent attractions that must be broken.\n\n' +
        '- **Polar solutes dissolve in polar solvents:** e.g. ionic/polar substances like $\\ce{NaCl}$ or sugar dissolve in water, where strong dipole–dipole and ion–dipole (and H-bonding) forces operate.\n' +
        '- **Non-polar solutes dissolve in non-polar solvents:** e.g. fats/oils dissolve in benzene or hexane, held together by weak London dispersion forces.\n\n' +
        'A polar solvent cannot effectively surround a non-polar solute (and vice versa), so unlike pairs do **not** mix — hence “**like dissolves like**.”',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q40',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q40',
      prompt: 'What is the significance of Henry’s Law constant $K_H$?',
      answer: 'The higher the value of K_H, the lower the solubility of the gas in the liquid (at a given pressure).',
      solution: 'Henry’s law is $p = K_H\\, x$, where $x$ is the mole fraction of the dissolved gas and $p$ its partial pressure. Rearranging, $x = p/K_H$.\n\n' +
        'So at a fixed pressure, a **higher $K_H$ means a smaller mole fraction dissolved** — i.e. the gas is **less soluble**. Conversely a low $K_H$ means high solubility. $K_H$ is therefore a direct measure of how reluctantly a gas dissolves in a given solvent.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q41',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q41',
      prompt: 'Why are aquatic species more comfortable in cold water in comparison to warm water?',
      answer: 'Gases (including oxygen) are more soluble at lower temperature, so cold water holds more dissolved oxygen for aquatic life.',
      solution: 'The solubility of a gas in a liquid **decreases as temperature rises**. So at a given pressure, **cold water dissolves more oxygen** than warm water.\n\n' +
        'Aquatic species breathe the dissolved oxygen, so the **higher oxygen content of cold water** makes them more comfortable there than in warm water, which holds less dissolved oxygen.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q42',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q42',
      prompt: '(a) Explain the following phenomena with the help of Henry’s law.\n\n(i) Painful condition known as bends.\n\n(ii) Feeling of weakness and discomfort in breathing at high altitude.\n\n(b) Why soda water bottle kept at room temperature fizzes on opening?',
      answer: '(a)(i) Bends: at high pressure underwater more N₂ dissolves in blood; on rapid ascent the pressure drops and N₂ bubbles out painfully. (a)(ii) At high altitude low O₂ partial pressure means less O₂ dissolves in blood (anoxia). (b) Soda is bottled under high CO₂ pressure; opening drops the pressure so dissolved CO₂ escapes as fizz.',
      solution: 'Henry’s law: the amount of a gas dissolved is proportional to its **partial pressure** above the liquid.\n\n' +
        '**(a)(i) Bends.** A diver at depth is under high pressure, so **more nitrogen dissolves in the blood**. If the diver rises too fast, the pressure falls sharply and the excess $\\ce{N2}$ **bubbles out of the blood** — these bubbles cause the painful, dangerous condition called “**bends**”. (Divers use air diluted with helium to reduce this.)\n\n' +
        '**(a)(ii) High-altitude weakness (anoxia).** At high altitude the **partial pressure of oxygen is low**, so **less $\\ce{O2}$ dissolves in the blood**. Low blood oxygen makes a person feel **weak and unable to think clearly** — a condition called anoxia.\n\n' +
        '**(b) Soda water fizzing.** Soda is sealed under a **high pressure of $\\ce{CO2}$**, forcing a lot of gas into solution. On opening, the pressure above the liquid **suddenly drops to atmospheric**, so the now-excess $\\ce{CO2}$ **escapes rapidly as bubbles** — the fizz.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q46',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q46',
      prompt: 'Give an example of a material used for making semipermeable membrane for carrying out reverse osmosis.',
      answer: 'Cellulose acetate.',
      solution: 'A common material used to make the semipermeable membrane for **reverse osmosis** is **cellulose acetate**.\n\n' +
        'It is permeable to **water** but blocks the **dissolved solute (e.g. salt ions)**, which is exactly what is needed to push pure water out of a concentrated (e.g. sea-water) feed under pressure during reverse osmosis.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q48',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q48',
      prompt: 'Match the items given in Column I with the type of solutions given in Column II.\n\n' +
        '| Column I | Column II (type of solution) |\n' +
        '|---|---|\n' +
        '| (i) Soda water | (a) A solution of gas in solid |\n' +
        '| (ii) Sugar solution | (b) A solution of gas in gas |\n' +
        '| (iii) German silver | (c) A solution of solid in liquid |\n' +
        '| (iv) Air | (d) A solution of solid in solid |\n' +
        '| (v) Hydrogen gas in palladium | (e) A solution of gas in liquid |\n' +
        '| | (f) A solution of liquid in solid |',
      answer: '(i)-(e), (ii)-(c), (iii)-(d), (iv)-(b), (v)-(a)',
      solution: 'Identify the physical states of solute and solvent in each:\n\n' +
        '- **(i) Soda water → (e):** $\\ce{CO2}$ **gas dissolved in liquid** water.\n' +
        '- **(ii) Sugar solution → (c):** **solid** sugar dissolved in **liquid** water.\n' +
        '- **(iii) German silver → (d):** an alloy (Cu–Zn–Ni) — a **solid in solid** solution.\n' +
        '- **(iv) Air → (b):** a mixture of **gases in gas**.\n' +
        '- **(v) Hydrogen in palladium → (a):** **gas dissolved in a solid**.',
    },
  ],

  'raoult-vp': [
    {
      kind: 'mcq',
      id: 'sol-ex-q7',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q7',
      prompt: 'Considering the formation, breaking and strength of hydrogen bond, predict which of the following mixtures will show a positive deviation from Raoult’s law?',
      options: [
        'Methanol and acetone.',
        'Chloroform and acetone.',
        'Nitric acid and water.',
        'Phenol and aniline.',
      ],
      correct_index: 0,
      explanation: 'A **positive deviation** occurs when the new solute–solvent attractions are **weaker** than those in the pure liquids. In **methanol + acetone**, acetone molecules get between methanol molecules and **break methanol’s H-bonds**, weakening the overall attractions — so escaping tendency (vapour pressure) rises → positive deviation → option (i).\n\nThe others form **stronger** new interactions (chloroform–acetone H-bond; $\\ce{HNO3}$–water; phenol–aniline) → negative deviation.',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q21',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q21',
      prompt: 'On the basis of information given below mark the correct option.\n\nInformation:\n\n(A) In bromoethane and chloroethane mixture intermolecular interactions of A–A and B–B type are nearly same as A–B type interactions.\n\n(B) In ethanol and acetone mixture A–A or B–B type intermolecular interactions are stronger than A–B type interactions.\n\n(C) In chloroform and acetone mixture A–A or B–B type intermolecular interactions are weaker than A–B type interactions.',
      options: [
        'Solution (B) and (C) will follow Raoult’s law.',
        'Solution (A) will follow Raoult’s law.',
        'Solution (B) will show negative deviation from Raoult’s law.',
        'Solution (C) will show positive deviation from Raoult’s law.',
      ],
      correct_index: 1,
      explanation: 'Raoult’s law (ideal behaviour) holds when A–B interactions are **about the same** as A–A and B–B — that is **case (A)**, so solution (A) follows Raoult’s law → option (ii).\n\nFor reference: (B) has **weaker** A–B → **positive** deviation; (C) has **stronger** A–B → **negative** deviation — which makes options (iii) and (iv) wrong.',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q22',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q22',
      prompt: 'Two beakers of capacity $500\\ \\text{mL}$ were taken. One beaker labelled “A” was filled with $400\\ \\text{mL}$ water; the beaker labelled “B” was filled with $400\\ \\text{mL}$ of $2\\ \\text{M}$ solution of $\\ce{NaCl}$. At the same temperature both beakers were placed in closed containers of same material and same capacity. At a given temperature, which statement is correct about the vapour pressure of pure water and that of $\\ce{NaCl}$ solution?',
      options: [
        'vapour pressure in container (A) is more than that in container (B).',
        'vapour pressure in container (A) is less than that in container (B).',
        'vapour pressure is equal in both the containers.',
        'vapour pressure in container (B) is twice the vapour pressure in container (A).',
      ],
      correct_index: 0,
      explanation: 'Container A holds **pure water**; container B holds a **$\\ce{NaCl}$ solution**. Adding a non-volatile solute **lowers the vapour pressure** (Raoult’s law / relative lowering). So pure water (A) has the **higher** vapour pressure → vapour pressure in A is **more than** in B → option (i).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q23',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q23',
      prompt: 'If two liquids A and B form minimum boiling azeotrope at some specific composition then ________.',
      options: [
        'A–B interactions are stronger than those between A–A or B–B.',
        'vapour pressure of solution increases because more number of molecules of liquids A and B can escape from the solution.',
        'vapour pressure of solution decreases because less number of molecules of only one of the liquids escape from the solution.',
        'A–B interactions are weaker than those between A–A or B–B.',
      ],
      correct_index: 1,
      explanation: 'KEY-CORRECTION: the official key prints **(i)**, but that is wrong. A **minimum-boiling azeotrope** corresponds to a **positive deviation** from Raoult’s law, which means A–B interactions are **weaker** than A–A / B–B — so **more** molecules escape and the **vapour pressure rises**. That is exactly statement **(ii)** (and statement (iv) — “A–B weaker” — is also true). Option (i) describes a **maximum**-boiling azeotrope (negative deviation). Correct single answer: **(ii)**.',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q25',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q25',
      prompt: 'On the basis of information given below mark the correct option.\n\nInformation: On adding acetone to methanol some of the hydrogen bonds between methanol molecules break.',
      options: [
        'At specific composition methanol-acetone mixture will form minimum boiling azeotrope and will show positive deviation from Raoult’s law.',
        'At specific composition methanol-acetone mixture forms maximum boiling azeotrope and will show positive deviation from Raoult’s law.',
        'At specific composition methanol-acetone mixture will form minimum boiling azeotrope and will show negative deviation from Raoult’s law.',
        'At specific composition methanol-acetone mixture will form maximum boiling azeotrope and will show negative deviation from Raoult’s law.',
      ],
      correct_index: 0,
      explanation: 'Breaking methanol’s H-bonds **weakens the attractions**, so molecules escape more easily → **positive deviation** from Raoult’s law → **minimum-boiling azeotrope** (higher vapour pressure means lower boiling point). The option that pairs **minimum boiling azeotrope with positive deviation** is option (i). A positive deviation can never give a maximum-boiling azeotrope, so (ii) is self-contradictory; (iii) and (iv) mismatch the deviation with the azeotrope type. This is the same positive-deviation ⇒ minimum-boiling logic as Q23.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q28',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q28',
      prompt: 'Intermolecular forces between two benzene molecules are nearly of same strength as those between two toluene molecules. For a mixture of benzene and toluene, which of the following are $not$ true?\n\n(i) $\\Delta_{mix}H = 0$\n\n(ii) $\\Delta_{mix}V = 0$\n\n(iii) These will form minimum boiling azeotrope.\n\n(iv) These will not form ideal solution.\n\n(Note: two or more options may be correct.)',
      answer: '(iii) and (iv)',
      solution: 'Benzene–toluene have **nearly equal** A–A, B–B and A–B interactions, so the mixture is essentially an **ideal solution** that obeys Raoult’s law.\n\n' +
        'For an ideal solution: $\\Delta_{mix}H = 0$ and $\\Delta_{mix}V = 0$ — so statements **(i) and (ii) ARE true**.\n\n' +
        'The question asks which are **NOT true**:\n' +
        '- **(iii) “minimum boiling azeotrope” — NOT true:** ideal solutions do not form azeotropes.\n' +
        '- **(iv) “will not form ideal solution” — NOT true:** they *do* form an ideal solution.\n\n' +
        'So the answer is **(iii) and (iv)**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q32',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q32',
      prompt: 'Which of the following binary mixtures will have same composition in liquid and vapour phase?\n\n(i) Benzene – Toluene\n\n(ii) Water – Nitric acid\n\n(iii) Water – Ethanol\n\n(iv) $n$-Hexane – $n$-Heptane\n\n(Note: two or more options may be correct.)',
      answer: '(ii) and (iii)',
      solution: 'A mixture has the **same composition in liquid and vapour** only at an **azeotropic composition** (a constant-boiling mixture). Azeotropes form only in **non-ideal** solutions.\n\n' +
        '- **(i) Benzene–Toluene** and **(iv) $n$-hexane–$n$-heptane** are essentially **ideal** solutions — no azeotrope, so liquid and vapour compositions differ.\n' +
        '- **(ii) Water–Nitric acid** (negative deviation) and **(iii) Water–Ethanol** (positive deviation) are **non-ideal** and form **azeotropes** — at the azeotropic point the liquid and vapour have the **same composition**.\n\n' +
        'So the answer is **(ii) and (iii)**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q34',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q34',
      prompt: 'For a binary ideal liquid solution, the variation in total vapour pressure versus composition of solution is given by which of the curves?\n\n' +
        'The four curves plot total pressure $p$ (vertical) against composition, with $x_1$ increasing to the left and $x_2$ increasing to the right:\n\n' +
        '(i) a **straight line sloping upward** from left to right.\n\n' +
        '(ii) a curve that is **concave upward** (low and flat at left, rising steeply at right).\n\n' +
        '(iii) a curve **concave downward** (high at left, falling and curving down to the right).\n\n' +
        '(iv) a **straight line sloping downward** from left to right.\n\n' +
        '(Note: two or more options may be correct.)',
      answer: '(i) and (iv)',
      solution: 'For an **ideal** binary solution the total vapour pressure varies **linearly** with composition: $p = x_1 p_1^{\\circ} + x_2 p_2^{\\circ}$ (Raoult’s law). On a $p$-vs-composition plot this is a **straight line**.\n\n' +
        'Because $x_1$ increases to the left and $x_2$ to the right, the straight line can slope **either way** depending on which pure component has the higher vapour pressure — so **both straight-line curves (i) and (iv)** are valid representations of an ideal solution.\n\n' +
        'The curved plots (ii) and (iii) represent **non-ideal** solutions (deviations from Raoult’s law), so they are excluded. Answer: **(i) and (iv)**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q36',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q36',
      prompt: 'Components of a binary mixture of two liquids A and B were being separated by distillation. After some time separation of components stopped and composition of vapour phase became same as that of liquid phase. Both the components started coming in the distillate. Explain why this happened.',
      answer: 'The mixture reached its azeotropic composition; an azeotrope boils with the vapour having the same composition as the liquid, so distillation can no longer separate the components.',
      solution: 'Distillation separates two liquids because the **vapour is richer** in the more-volatile component than the liquid. As the distillation proceeds, the liquid composition shifts until it reaches the **azeotropic composition**.\n\n' +
        'At an **azeotrope**, the **vapour has exactly the same composition as the boiling liquid**. From that point on, evaporating and recondensing no longer changes the composition — so **both components distil over together** and further separation by simple distillation becomes **impossible**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q49',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q49',
      prompt: 'Match the laws given in Column I with expressions given in Column II.\n\n' +
        '| Column I (law) | Column II (expression) |\n' +
        '|---|---|\n' +
        '| (i) Raoult’s law | (a) $\\Delta T_f = K_f\\, m$ |\n' +
        '| (ii) Henry’s law | (b) $\\Pi = C R T$ |\n' +
        '| (iii) Elevation of boiling point | (c) $p = x_1 p_1^{\\circ} + x_2 p_2^{\\circ}$ |\n' +
        '| (iv) Depression in freezing point | (d) $\\Delta T_b = K_b\\, m$ |\n' +
        '| (v) Osmotic pressure | (e) $p = K_H\\, x$ |',
      answer: '(i)-(c), (ii)-(e), (iii)-(d), (iv)-(a), (v)-(b)',
      solution: 'Match each law to its formula:\n\n' +
        '- **(i) Raoult’s law → (c):** $p = x_1 p_1^{\\circ} + x_2 p_2^{\\circ}$ (total vapour pressure from mole fractions).\n' +
        '- **(ii) Henry’s law → (e):** $p = K_H\\, x$ (gas solubility vs partial pressure).\n' +
        '- **(iii) Elevation of boiling point → (d):** $\\Delta T_b = K_b\\, m$.\n' +
        '- **(iv) Depression in freezing point → (a):** $\\Delta T_f = K_f\\, m$.\n' +
        '- **(v) Osmotic pressure → (b):** $\\Pi = C R T$.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q56',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q56',
      prompt: 'Using Raoult’s law explain how the total vapour pressure over the solution is related to mole fraction of components in the following solutions.\n\n(i) $\\ce{CHCl3}(l)$ and $\\ce{CH2Cl2}(l)$\n\n(ii) $\\ce{NaCl}(s)$ and $\\ce{H2O}(l)$',
      answer: '(i) Both components are volatile: p = x₁p₁° + x₂p₂°. (ii) Only water is volatile (NaCl is non-volatile): p = x_water × p°_water.',
      solution: '**(i) $\\ce{CHCl3}$ + $\\ce{CH2Cl2}$ — both volatile.** Raoult’s law applies to **each** component, and the total vapour pressure is the sum of the two partial pressures:\n\n' +
        '$$p = p_1 + p_2 = x_1 p_1^{\\circ} + x_2 p_2^{\\circ}$$\n\n' +
        'Writing $x_2 = 1 - x_1$: $\\ p = (p_1^{\\circ} - p_2^{\\circ})\\, x_1 + p_2^{\\circ}$ — a linear relation in $x_1$.\n\n' +
        '**(ii) $\\ce{NaCl}$ + $\\ce{H2O}$ — only water is volatile.** $\\ce{NaCl}$ is a **non-volatile** solid, so it contributes no vapour. Raoult’s law applies only to the **water**:\n\n' +
        '$$p = p_{\\text{water}} = x_{\\text{water}}\\, p_{\\text{water}}^{\\circ}$$\n\n' +
        'Since $x_{\\text{water}} < 1$, the vapour pressure of the solution is **lower** than that of pure water (relative lowering of vapour pressure).',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q57',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q57',
      prompt: 'Explain the terms ideal and non-ideal solutions in the light of forces of interactions operating between molecules in liquid solutions.',
      answer: 'Ideal solution: A–B interactions equal A–A and B–B; obeys Raoult’s law, Δ_mixH = 0, Δ_mixV = 0. Non-ideal solution: A–B differs from A–A/B–B; deviates from Raoult’s law, Δ_mixH ≠ 0, Δ_mixV ≠ 0.',
      solution: '**Ideal solution.** A solution is **ideal** when the **solute–solvent (A–B) interactions are essentially the same** as the solute–solute (A–A) and solvent–solvent (B–B) interactions. Such a solution:\n' +
        '- obeys **Raoult’s law** over the whole composition range,\n' +
        '- has $\\Delta_{mix}H = 0$ (no heat absorbed or released),\n' +
        '- has $\\Delta_{mix}V = 0$ (no volume change on mixing).\n\n' +
        'Examples: benzene–toluene, $n$-hexane–$n$-heptane.\n\n' +
        '**Non-ideal solution.** When A–B interactions **differ** from A–A / B–B, the solution is **non-ideal** and deviates from Raoult’s law:\n' +
        '- **Positive deviation** (A–B weaker): higher vapour pressure, $\\Delta_{mix}H > 0$, $\\Delta_{mix}V > 0$ — e.g. ethanol–acetone.\n' +
        '- **Negative deviation** (A–B stronger): lower vapour pressure, $\\Delta_{mix}H < 0$, $\\Delta_{mix}V < 0$ — e.g. chloroform–acetone.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q58',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q58',
      prompt: 'Why is it not possible to obtain pure ethanol by fractional distillation? What general name is given to binary mixtures which show deviation from Raoult’s law and whose components cannot be separated by fractional distillation? How many types of such mixtures are there?',
      answer: 'Ethanol–water forms an azeotrope (~95% ethanol) that boils with vapour of the same composition, so distillation cannot enrich it further. Such constant-boiling mixtures are called azeotropes; there are two types — minimum-boiling and maximum-boiling.',
      solution: 'Ethanol and water form a **constant-boiling mixture (azeotrope)** at about **95% ethanol**. At this composition the **vapour has the same composition as the liquid**, so boiling and recondensing no longer changes the composition — fractional distillation therefore **cannot push ethanol beyond ~95%** to give pure (100%) ethanol.\n\n' +
        'Binary mixtures that deviate from Raoult’s law and **boil at constant temperature with identical liquid and vapour composition** are called **azeotropes** (azeotropic mixtures).\n\n' +
        'There are **two types**:\n' +
        '- **Minimum-boiling azeotropes** — from **positive** deviation (e.g. ethanol–water).\n' +
        '- **Maximum-boiling azeotropes** — from **negative** deviation (e.g. nitric acid–water).',
    },
  ],

  'colligative': [
    {
      kind: 'mcq',
      id: 'sol-ex-q8',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q8',
      prompt: 'Colligative properties depend on ________.',
      options: [
        'the nature of the solute particles dissolved in solution.',
        'the number of solute particles in solution.',
        'the physical properties of the solute particles dissolved in solution.',
        'the nature of solvent particles.',
      ],
      correct_index: 1,
      explanation: 'By definition, **colligative** properties (relative lowering of vapour pressure, boiling-point elevation, freezing-point depression, osmotic pressure) depend only on the **number** of dissolved solute particles, **not** on their nature → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q9',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q9',
      prompt: 'Which of the following aqueous solutions should have the highest boiling point?',
      options: [
        '$1.0\\ \\text{M}\\ \\ce{NaOH}$',
        '$1.0\\ \\text{M}\\ \\ce{Na2SO4}$',
        '$1.0\\ \\text{M}\\ \\ce{NH4NO3}$',
        '$1.0\\ \\text{M}\\ \\ce{KNO3}$',
      ],
      correct_index: 1,
      explanation: 'Boiling-point elevation is colligative: $\\Delta T_b = i\\, K_b\\, m$, so it scales with the **number of ions ($i$)**. Per formula unit: $\\ce{NaOH}\\to2$, $\\ce{Na2SO4}\\to3$, $\\ce{NH4NO3}\\to2$, $\\ce{KNO3}\\to2$. $\\ce{Na2SO4}$ gives the most particles ($i=3$), so the **highest boiling point** → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q10',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q10',
      prompt: 'The unit of ebullioscopic constant is ________.',
      options: [
        '$\\text{K kg mol}^{-1}$ or $\\text{K (molality)}^{-1}$',
        '$\\text{mol kg K}^{-1}$ or $\\text{K}^{-1}(\\text{molality})$',
        '$\\text{kg mol}^{-1}\\text{K}^{-1}$ or $\\text{K}^{-1}(\\text{molality})^{-1}$',
        '$\\text{K mol kg}^{-1}$ or $\\text{K (molality)}$',
      ],
      correct_index: 0,
      explanation: 'The ebullioscopic constant $K_b$ comes from $\\Delta T_b = K_b\\, m$, so $K_b = \\frac{\\Delta T_b}{m}$. With $\\Delta T_b$ in kelvin (K) and molality $m$ in $\\text{mol kg}^{-1}$, the unit is $\\frac{\\text{K}}{\\text{mol kg}^{-1}} = \\text{K kg mol}^{-1}$, i.e. K·(molality)$^{-1}$ → option (i).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q12',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q12',
      prompt: 'An unripe mango placed in a concentrated salt solution to prepare pickle, shrivels because ________.',
      options: [
        'it gains water due to osmosis.',
        'it loses water due to reverse osmosis.',
        'it gains water due to reverse osmosis.',
        'it loses water due to osmosis.',
      ],
      correct_index: 3,
      explanation: 'The salt solution outside is **more concentrated** (hypertonic) than the fluid inside the mango. By **osmosis**, water flows from the dilute inside to the concentrated outside, so the mango **loses water and shrivels** → option (iv). (No external pressure is applied, so it is ordinary osmosis, not reverse osmosis.)',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q13',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q13',
      prompt: 'At a given temperature, osmotic pressure of a concentrated solution of a substance ________.',
      options: [
        'is higher than that at a dilute solution.',
        'is lower than that of a dilute solution.',
        'is same as that of a dilute solution.',
        'cannot be compared with osmotic pressure of dilute solution.',
      ],
      correct_index: 0,
      explanation: 'Osmotic pressure $\\Pi = C R T$ is proportional to **concentration**. A **concentrated** solution has higher $C$, hence **higher osmotic pressure** than a dilute one → option (i).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q14',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q14',
      prompt: 'Which of the following statements is false?',
      options: [
        'Two different solutions of sucrose of same molality prepared in different solvents will have the same depression in freezing point.',
        'The osmotic pressure of a solution is given by the equation $\\Pi = C R T$ (where C is the molarity of the solution).',
        'Decreasing order of osmotic pressure for $0.01\\ \\text{M}$ aqueous solutions of barium chloride, potassium chloride, acetic acid and sucrose is $\\ce{BaCl2} > \\ce{KCl} > \\ce{CH3COOH} > \\text{sucrose}$.',
        'According to Raoult’s law, the vapour pressure exerted by a volatile component of a solution is directly proportional to its mole fraction in the solution.',
      ],
      correct_index: 0,
      explanation: 'Statement (i) is **false**. Freezing-point depression is $\\Delta T_f = K_f\\, m$, and $K_f$ **depends on the solvent**. Two solutions of the same molality but in **different solvents** have **different $K_f$**, so their $\\Delta T_f$ are **not** the same → option (i) is the false statement. (Statements (ii), (iii), (iv) are all correct.)',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q16',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q16',
      prompt: 'Which of the following statements is false?',
      options: [
        'Units of atmospheric pressure and osmotic pressure are the same.',
        'In reverse osmosis, solvent molecules move through a semipermeable membrane from a region of lower concentration of solute to a region of higher concentration.',
        'The value of molal depression constant depends on nature of solvent.',
        'Relative lowering of vapour pressure, is a dimensionless quantity.',
      ],
      correct_index: 1,
      explanation: 'Statement (ii) is **false**. In **reverse osmosis** the applied pressure pushes solvent the “wrong” way — from the **higher** solute concentration toward the **lower** (pure-solvent) side. The statement describes movement from lower to higher concentration, which is **ordinary osmosis**, not reverse osmosis → option (ii) is the false statement.',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q19',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q19',
      prompt: 'Consider Fig. 2.1 (a chamber divided by a semipermeable membrane: side A holds fresh water with piston A, side B holds concentrated sodium chloride solution with piston B). Mark the correct option.',
      options: [
        'water will move from side (A) to side (B) if a pressure lower than osmotic pressure is applied on piston (B).',
        'water will move from side (B) to side (A) if a pressure greater than osmotic pressure is applied on piston (B).',
        'water will move from side (B) to side (A) if a pressure equal to osmotic pressure is applied on piston (B).',
        'water will move from side (A) to side (B) if pressure equal to osmotic pressure is applied on piston (A).',
      ],
      correct_index: 1,
      explanation: 'Side B is the concentrated solution. **Reverse osmosis** occurs only when the pressure applied on the solution side **exceeds the osmotic pressure** — then water is pushed **from B (solution) to A (fresh water)** → option (ii). (At pressure equal to osmotic pressure there is no net flow; below it, normal osmosis drives water A→B.)',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q29',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q29',
      prompt: 'Relative lowering of vapour pressure is a colligative property because ________.\n\n(i) It depends on the concentration of a non electrolyte solute in solution and does not depend on the nature of the solute molecules.\n\n(ii) It depends on number of particles of electrolyte solute in solution and does not depend on the nature of the solute particles.\n\n(iii) It depends on the concentration of a non electrolyte solute in solution as well as on the nature of the solute molecules.\n\n(iv) It depends on the concentration of an electrolyte or nonelectrolyte solute in solution as well as on the nature of solute molecules.\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (ii)',
      solution: 'A property is **colligative** when it depends on the **number/concentration of solute particles** but **not on their nature**.\n\n' +
        '- **(i) — correct:** for a non-electrolyte, it depends on concentration, not on the nature of the molecules.\n' +
        '- **(ii) — correct:** for an electrolyte, it depends on the number of particles (ions), not on their nature.\n' +
        '- (iii) and (iv) are wrong because they wrongly claim it **depends on the nature** of the solute.\n\n' +
        'So the answer is **(i) and (ii)**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q31',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q31',
      prompt: 'Isotonic solutions must have the same ________.\n\n(i) solute\n\n(ii) density\n\n(iii) elevation in boiling point\n\n(iv) depression in freezing point\n\n(Note: two or more options may be correct.)',
      answer: '(ii) and (iii)',
      solution: 'Isotonic solutions have the **same osmotic pressure**, which (at the same temperature) means the **same molar concentration of particles**. Per the official key, the answer is **(ii) and (iii)**.\n\n' +
        '- They need not have the **same solute** (i), so (i) is wrong.\n' +
        '- Having the same particle concentration ties them to the same colligative behaviour — the key marks **density (ii)** and **elevation in boiling point (iii)**.\n\n' +
        '(Strictly, equal particle concentration most directly forces equal *boiling-point elevation* and *freezing-point depression*; the key’s pairing is (ii) and (iii).)',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q33',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q33',
      prompt: 'In isotonic solutions ________.\n\n(i) solute and solvent both are same.\n\n(ii) osmotic pressure is same.\n\n(iii) solute and solvent may or may not be same.\n\n(iv) solute is always same solvent may be different.\n\n(Note: two or more options may be correct.)',
      answer: '(ii) and (iii)',
      solution: '**Isotonic** solutions are defined by having the **same osmotic pressure** at the same temperature.\n\n' +
        '- **(ii) — correct:** osmotic pressure is the same (that is the definition).\n' +
        '- **(iii) — correct:** the solute and solvent **may or may not be the same** — only the osmotic pressure must match.\n' +
        '- (i) and (iv) wrongly require the solute/solvent to be identical, so they are wrong.\n\n' +
        'So the answer is **(ii) and (iii)**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q35',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q35',
      prompt: 'Colligative properties are observed when ________.\n\n(i) a non volatile solid is dissolved in a volatile liquid.\n\n(ii) a non volatile liquid is dissolved in another volatile liquid.\n\n(iii) a gas is dissolved in non volatile liquid.\n\n(iv) a volatile liquid is dissolved in another volatile liquid.\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (ii)',
      solution: 'Colligative properties appear when a **non-volatile solute** is dissolved in a **volatile solvent** — because the non-volatile particles lower the solvent’s vapour pressure (and hence cause boiling-point elevation, freezing-point depression, etc.).\n\n' +
        '- **(i) — correct:** non-volatile **solid** in a volatile liquid.\n' +
        '- **(ii) — correct:** non-volatile **liquid** in a volatile liquid.\n' +
        '- (iii) a gas solute and (iv) a volatile solute do **not** give the usual colligative lowering, so they are excluded.\n\n' +
        'So the answer is **(i) and (ii)**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q37',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q37',
      prompt: 'Explain why on addition of 1 mol of $\\ce{NaCl}$ to 1 litre of water, the boiling point of water increases, while addition of 1 mol of methyl alcohol to one litre of water decreases its boiling point.',
      answer: 'NaCl is non-volatile, so it lowers water’s vapour pressure and raises its boiling point. Methyl alcohol is more volatile than water, so it raises the total vapour pressure and lowers the boiling point.',
      solution: '**$\\ce{NaCl}$ — boiling point rises.** $\\ce{NaCl}$ is a **non-volatile** solute. Adding it **lowers the vapour pressure** of water (Raoult’s law), so the solution must be heated to a **higher** temperature to reach atmospheric pressure — the **boiling point increases**.\n\n' +
        '**Methyl alcohol — boiling point falls.** Methanol is **more volatile** than water (it has its own appreciable vapour pressure). Adding it **raises the total vapour pressure** of the mixture, so the solution boils at a **lower** temperature — the **boiling point decreases**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q43',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q43',
      prompt: 'Why is the vapour pressure of an aqueous solution of glucose lower than that of water?',
      answer: 'Glucose (non-volatile) occupies part of the surface, reducing the fraction of surface from which water molecules can escape, so fewer water molecules vaporise and the vapour pressure drops.',
      solution: 'In **pure water**, the entire liquid surface is covered by water molecules, all of which can evaporate. When **non-volatile glucose** is dissolved, some surface positions are now occupied by **glucose** molecules.\n\n' +
        'This **reduces the fraction of the surface** from which water molecules can escape, so **fewer water molecules vaporise** per unit time. Consequently the **vapour pressure of the glucose solution is lower** than that of pure water.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q44',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q44',
      prompt: 'How does sprinkling of salt help in clearing the snow covered roads in hilly areas? Explain the phenomenon involved in the process.',
      answer: 'Salt dissolves in the snow and depresses the freezing point of water, so the snow melts at a temperature below 0 °C, clearing the road.',
      solution: 'Spreading salt on snow makes use of **depression in freezing point** (a colligative property). The salt dissolves in the thin film of liquid water on the snow, forming a salt solution.\n\n' +
        'A salt solution **freezes at a lower temperature than pure water** ($\\Delta T_f = i\\, K_f\\, m$). So at the prevailing low temperature, the salted snow can no longer stay frozen — it **melts**, and the road is cleared.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q45',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q45',
      prompt: 'What is “semi permeable membrane”?',
      answer: 'A continuous film (natural or synthetic) with a network of submicroscopic pores that lets small solvent molecules (like water) pass but blocks larger solute molecules.',
      solution: 'A **semipermeable membrane** is a continuous sheet or film (natural or synthetic) containing a network of **submicroscopic holes or pores**.\n\n' +
        'These pores are large enough to let **small solvent molecules** (such as water) pass through, but they **block the larger solute molecules**. This selective passage is what makes **osmosis** (and reverse osmosis) possible.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q47',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q47',
      prompt: 'Match the items given in Column I and Column II.\n\n' +
        '| Column I | Column II |\n' +
        '|---|---|\n' +
        '| (i) Saturated solution | (a) Solution having same osmotic pressure at a given temperature as that of given solution. |\n' +
        '| (ii) Binary solution | (b) A solution whose osmotic pressure is less than that of another. |\n' +
        '| (iii) Isotonic solution | (c) Solution with two components. |\n' +
        '| (iv) Hypotonic solution | (d) A solution which contains maximum amount of solute that can be dissolved in a given amount of solvent at a given temperature. |\n' +
        '| (v) Solid solution | (e) A solution whose osmotic pressure is more than that of another. |\n' +
        '| (vi) Hypertonic solution | (f) A solution in solid phase. |',
      answer: '(i)-(d), (ii)-(c), (iii)-(a), (iv)-(b), (v)-(f), (vi)-(e)',
      solution: 'Match each term to its definition:\n\n' +
        '- **(i) Saturated solution → (d):** holds the **maximum** dissolvable solute at that temperature.\n' +
        '- **(ii) Binary solution → (c):** a solution with **two components**.\n' +
        '- **(iii) Isotonic solution → (a):** **same osmotic pressure** as the given solution.\n' +
        '- **(iv) Hypotonic solution → (b):** osmotic pressure **less** than another.\n' +
        '- **(v) Solid solution → (f):** a solution in the **solid phase**.\n' +
        '- **(vi) Hypertonic solution → (e):** osmotic pressure **more** than another.',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q52',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q52',
      prompt: 'Assertion: When methyl alcohol is added to water, boiling point of water increases.\n\nReason: When a volatile solute is added to a volatile solvent elevation in boiling point is observed.',
      options: [
        'Assertion and reason both are correct statements and reason is the correct explanation for assertion.',
        'Assertion and reason both are correct statements but reason is not the correct explanation for assertion.',
        'Assertion is correct statement but reason is wrong statement.',
        'Assertion and reason both are incorrect statements.',
        'Assertion is wrong statement but reason is correct statement.',
      ],
      correct_index: 3,
      explanation: 'The **assertion is wrong**: methyl alcohol is **more volatile** than water, so adding it **lowers** (not raises) the boiling point. The **reason is also wrong**: adding a **volatile** solute does **not** cause boiling-point elevation — elevation requires a **non-volatile** solute. Both statements are incorrect → option (iv).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q53',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q53',
      prompt: 'Assertion: When $\\ce{NaCl}$ is added to water a depression in freezing point is observed.\n\nReason: The lowering of vapour pressure of a solution causes depression in the freezing point.',
      options: [
        'Assertion and reason both are correct statements and reason is the correct explanation for assertion.',
        'Assertion and reason both are correct statements but reason is not the correct explanation for assertion.',
        'Assertion is correct statement but reason is wrong statement.',
        'Assertion and reason both are incorrect statements.',
        'Assertion is wrong statement but reason is correct statement.',
      ],
      correct_index: 0,
      explanation: 'The **assertion is true** — $\\ce{NaCl}$ (a non-volatile solute) causes freezing-point depression. The **reason is also true** and is **the correct explanation**: the solute **lowers the vapour pressure**, and it is exactly this lowering that depresses the freezing point. Both correct, reason explains assertion → option (i).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q54',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q54',
      prompt: 'Assertion: When a solution is separated from the pure solvent by a semi-permeable membrane, the solvent molecules pass through it from pure solvent side to the solution side.\n\nReason: Diffusion of solvent occurs from a region of high concentration solution to a region of low concentration solution.',
      options: [
        'Assertion and reason both are correct statements and reason is the correct explanation for assertion.',
        'Assertion and reason both are correct statements but reason is not the correct explanation for assertion.',
        'Assertion is correct statement but reason is wrong statement.',
        'Assertion and reason both are incorrect statements.',
        'Assertion is wrong statement but reason is correct statement.',
      ],
      correct_index: 1,
      explanation: 'The **assertion is true**: in osmosis, solvent moves from the **pure solvent (low solute concentration) into the solution (high solute concentration)**. The **reason is also a true statement** (solvent diffuses from where *solvent* is more concentrated to where it is less concentrated), but as worded it does **not correctly explain** the assertion. Both correct but reason is not the correct explanation → option (ii).',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q59',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q59',
      prompt: 'When kept in water, raisin swells in size. Name and explain the phenomenon involved with the help of a diagram. Give three applications of the phenomenon.',
      answer: 'The phenomenon is osmosis. Water (low solute concentration outside) moves through the raisin’s semipermeable skin into the raisin (high solute concentration inside), so it swells. Applications: water uptake by plant roots; preserving food with salt/sugar; reverse osmosis for desalination.',
      solution: '**Phenomenon: osmosis.** A raisin’s skin acts as a **semipermeable membrane**, and its inside is a **concentrated** sugar solution. When placed in water (the **dilute** side), water flows **into the raisin** by osmosis — from the region of lower solute concentration (water) to higher solute concentration (inside the raisin) — so the raisin **swells**.\n\n' +
        '*(Diagram: a beaker of water with a raisin inside; arrows show water passing through the raisin’s semipermeable skin into the raisin.)*\n\n' +
        '**Three applications of osmosis:**\n' +
        '1. **Water uptake by plant roots** — water moves from soil into root cells by osmosis.\n' +
        '2. **Food preservation** — salting meat or sugaring fruit draws water out of microbes by osmosis, killing them.\n' +
        '3. **Reverse osmosis** — used for **desalination** of sea water to produce drinking water.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q60',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q60',
      prompt: 'Discuss biological and industrial importance of osmosis.',
      answer: 'Biological: water uptake by plant roots; turgidity of cells; nutrient movement. Industrial/practical: preservation of meat by salting and fruit by sugaring; reverse osmosis for desalination of water.',
      solution: 'Osmosis is of great **biological and industrial importance**:\n\n' +
        '**Biological:**\n' +
        '1. **Movement of water from soil into plant roots** (and then up the plant) is partly due to osmosis.\n' +
        '2. It maintains the **turgidity (firmness) of plant and animal cells** and helps transport nutrients.\n\n' +
        '**Industrial / practical:**\n' +
        '1. **Preservation of meat** by adding salt — bacteria lose water by osmosis, shrivel and die.\n' +
        '2. **Preservation of fruit** by adding sugar — bacteria in the canned fruit lose water by osmosis and die.\n' +
        '3. **Reverse osmosis** is used for the **desalination of sea water** to obtain fresh drinking water.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q61',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q61',
      prompt: 'How can you remove the hard calcium carbonate layer of the egg without damaging its semipermeable membrane? Can this egg be inserted into a bottle with a narrow neck without distorting its shape? Explain the process involved.',
      answer: 'Soak the egg in dilute (mineral) acid to dissolve the CaCO₃ shell, leaving the semipermeable membrane. Then place it in a hypertonic (concentrated) solution so it shrivels by osmosis and can be pushed through the narrow neck; once inside, add a hypotonic (dilute) solution so it regains its shape by osmosis.',
      solution: '**Removing the shell.** Place the egg in **dilute mineral acid**. The acid reacts with and **dissolves the calcium carbonate ($\\ce{CaCO3}$) shell**, leaving the egg covered only by its **semipermeable membrane**.\n\n' +
        '**Getting it into the bottle (using osmosis):**\n' +
        '1. Put the membrane-covered egg into a **hypertonic (concentrated) solution**. Water leaves the egg by osmosis, so it **shrivels and shrinks** — now small enough to be **pushed through the narrow neck**.\n' +
        '2. Once inside the bottle, add a **hypotonic (dilute) solution**. Water now enters the egg by osmosis, and it **swells back to its original shape**.\n\n' +
        'So yes — the egg can be inserted into a narrow-necked bottle without permanently distorting its shape, using osmosis in both directions.',
    },
  ],

  'vant-hoff': [
    {
      kind: 'mcq',
      id: 'sol-ex-q11',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q11',
      prompt: 'In comparison to a $0.01\\ \\text{M}$ solution of glucose, the depression in freezing point of a $0.01\\ \\text{M}\\ \\ce{MgCl2}$ solution is ________.',
      options: [
        'the same',
        'about twice',
        'about three times',
        'about six times',
      ],
      correct_index: 2,
      explanation: 'Freezing-point depression is $\\Delta T_f = i\\, K_f\\, m$. Glucose does not dissociate ($i = 1$). $\\ce{MgCl2}$ gives $\\ce{Mg^{2+}} + 2\\ce{Cl-}$, so $i = 3$. At the same molality, $\\ce{MgCl2}$ depresses the freezing point **about three times** as much → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q15',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q15',
      prompt: 'The values of Van’t Hoff factors for $\\ce{KCl}$, $\\ce{NaCl}$ and $\\ce{K2SO4}$, respectively, are ________.',
      options: [
        '2, 2 and 2',
        '2, 2 and 3',
        '1, 1 and 2',
        '1, 1 and 1',
      ],
      correct_index: 1,
      explanation: 'The van’t Hoff factor $i$ equals the number of ions per formula unit (for complete dissociation): $\\ce{KCl}\\to\\ce{K+}+\\ce{Cl-}$ ($i=2$), $\\ce{NaCl}\\to\\ce{Na+}+\\ce{Cl-}$ ($i=2$), $\\ce{K2SO4}\\to2\\ce{K+}+\\ce{SO4^{2-}}$ ($i=3$). So **2, 2 and 3** → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'sol-ex-q20',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q20',
      prompt: 'We have three aqueous solutions of $\\ce{NaCl}$ labelled as ‘A’, ‘B’ and ‘C’ with concentrations $0.1\\ \\text{M}$, $0.01\\ \\text{M}$ and $0.001\\ \\text{M}$, respectively. The value of van’t Hoff factor for these solutions will be in the order ________.',
      options: [
        '$i_A < i_B < i_C$',
        '$i_A > i_B > i_C$',
        '$i_A = i_B = i_C$',
        '$i_A < i_B > i_C$',
      ],
      correct_index: 2,
      explanation: 'For a strong electrolyte like $\\ce{NaCl}$, complete dissociation is assumed at the NCERT level, giving $i = 2$ for **every** concentration. So $i_A = i_B = i_C$ → option (iii).\n\n(More precisely, $i$ rises slightly toward its ideal value as the solution gets more dilute because ion-pairing decreases; but at this level all three are taken as $i = 2$, which is the intended answer.)',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q30',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q30',
      prompt: 'Van’t Hoff factor $i$ is given by the expression ________.\n\n(i) $i = \\frac{\\text{Normal molar mass}}{\\text{Abnormal molar mass}}$\n\n(ii) $i = \\frac{\\text{Abnormal molar mass}}{\\text{Normal molar mass}}$\n\n(iii) $i = \\frac{\\text{Observed colligative property}}{\\text{Calculated colligative property}}$\n\n(iv) $i = \\frac{\\text{Calculated colligative property}}{\\text{Observed colligative property}}$\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (iii)',
      solution: 'The van’t Hoff factor is defined as\n\n' +
        '$$i = \\frac{\\text{normal (expected) molar mass}}{\\text{abnormal (observed) molar mass}} = \\frac{\\text{observed colligative property}}{\\text{calculated (normal) colligative property}}$$\n\n' +
        '- **(i) — correct:** normal molar mass / abnormal molar mass.\n' +
        '- **(iii) — correct:** observed colligative property / calculated colligative property.\n' +
        '- (ii) and (iv) are the inverted (reciprocal) forms, so they are wrong.\n\n' +
        'So the answer is **(i) and (iii)**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ex-q62',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q62',
      prompt: 'Why is the mass determined by measuring a colligative property in case of some solutes abnormal? Discuss it with the help of Van’t Hoff factor.',
      answer: 'Some solutes dissociate (e.g. NaCl) or associate (e.g. ethanoic acid in benzene), changing the number of particles in solution. Since colligative properties depend on the number of particles, the molar mass calculated from them is abnormal. The van’t Hoff factor i corrects for this: i = (normal molar mass)/(abnormal molar mass) = (observed colligative property)/(calculated colligative property).',
      solution: 'Colligative properties depend on the **number of solute particles**. The molar mass found from a colligative property is **abnormal** whenever the solute **changes its particle count** in solution:\n\n' +
        '- **Dissociation:** e.g. $\\ce{NaCl}$ splits into $\\ce{Na+} + \\ce{Cl-}$, **increasing** the particle number — the observed colligative effect is larger, so the calculated molar mass comes out **lower** than the true value.\n' +
        '- **Association:** e.g. **ethanoic acid dimerises in benzene** (via H-bonding), **decreasing** the particle number — the calculated molar mass comes out **higher** than the true value.\n\n' +
        '**Van’t Hoff factor** $i$ accounts for this:\n\n' +
        '$$i = \\frac{\\text{normal (expected) molar mass}}{\\text{abnormal (observed) molar mass}} = \\frac{\\text{observed colligative property}}{\\text{calculated colligative property}} = \\frac{\\text{moles of particles after association/dissociation}}{\\text{moles of particles before}}$$\n\n' +
        'So $i > 1$ for dissociation, $i < 1$ for association, and $i = 1$ when the solute neither dissociates nor associates.',
    },
  ],
};
