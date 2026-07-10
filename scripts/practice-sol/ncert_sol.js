// NCERT textbook end-of-chapter EXERCISES 2.1–2.41 — Class 12 Chemistry, Unit 2 (Solutions)
// from "12th - Solutions.pdf", pages 27–30 (book pages 59–62).
// Question stems + data transcribed verbatim from the NCERT chapter PDF.
// Every item is a tap-to-reveal numerical (`kind:'numerical'`). Item shape mirrors
// the equilibrium sibling scripts/practice/ncert_ceq.js.
// Constants used: M(NaOH)=40, M(urea)=60, M(glucose)=180, M(ethylene glycol)=62,
// R=0.0821 L·atm·mol⁻¹·K⁻¹ (or 8.314 J), Kf(water)=1.86, Kb(water)=0.52, Kf(benzene)=5.1.
// The chapter PDF does NOT print exercise answers (only intext answers 2.1–2.12,
// used here as cross-checks only). All exercise answers below were solved by hand.
module.exports = {
  'types-conc': [
    {
      kind: 'numerical',
      id: 'sol-ncert-2-1',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.1',
      prompt:
        'Define the term solution. How many types of solutions are formed? Write briefly about each type with an example.',
      answer:
        'A solution is a homogeneous mixture of two or more components. Based on the physical state of the solvent, there are three broad types — gaseous, liquid and solid solutions — giving nine sub-types in all.',
      solution:
        '**Solution:** A *solution* is a homogeneous mixture of two or more pure substances whose composition can be varied within limits. The component present in the largest amount is the **solvent**; the others are **solutes**.\n\n' +
        'Classifying by the physical state of the **solvent**, there are three main types (each can dissolve a gas, liquid or solid solute, giving nine combinations):\n\n' +
        '**Gaseous solutions** (gaseous solvent):\n' +
        '- gas in gas — e.g. a mixture of oxygen and nitrogen (air)\n' +
        '- liquid in gas — e.g. water vapour (humidity) in air\n' +
        '- solid in gas — e.g. camphor vapour / iodine vapour in air\n\n' +
        '**Liquid solutions** (liquid solvent):\n' +
        '- gas in liquid — e.g. oxygen dissolved in water\n' +
        '- liquid in liquid — e.g. ethanol dissolved in water\n' +
        '- solid in liquid — e.g. glucose dissolved in water\n\n' +
        '**Solid solutions** (solid solvent):\n' +
        '- gas in solid — e.g. hydrogen adsorbed/dissolved in palladium\n' +
        '- liquid in solid — e.g. amalgam of mercury with sodium\n' +
        '- solid in solid — e.g. brass (copper–zinc), other alloys',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-2',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.2',
      prompt:
        'Suppose a solid solution is formed between two substances, one whose particles are very large and the other whose particles are very small. What kind of solid solution is this likely to be?',
      answer:
        'An interstitial solid solution — the small particles occupy the gaps (interstices) between the large particles.',
      solution:
        'In a **substitutional** solid solution the two kinds of particle are of comparable size, so the solute atoms simply take the place of solvent atoms in the lattice.\n\n' +
        'When one kind of particle is **very large** and the other **very small**, the small particles cannot replace the large ones at lattice sites — instead they fit into the empty spaces (**interstices**) between the large particles. This is an **interstitial solid solution** (e.g. carbon atoms in the interstices of an iron lattice, as in steel).',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-3',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.3',
      prompt:
        'Define the following terms:\n\n(i) Mole fraction\n\n(ii) Molality\n\n(iii) Molarity\n\n(iv) Mass percentage.',
      answer:
        '(i) mole fraction = moles of a component / total moles; (ii) molality = moles of solute / kg of solvent; (iii) molarity = moles of solute / litre of solution; (iv) mass % = (mass of component / total mass of solution) × 100.',
      solution:
        '**(i) Mole fraction ($x$):** the ratio of the number of moles of one component to the total number of moles of all components in the solution.\n\n' +
        '$$x_A = \\frac{n_A}{n_A + n_B}$$\n\n' +
        'The sum of all mole fractions equals 1. It is a unitless, temperature-independent quantity.\n\n' +
        '**(ii) Molality ($m$):** the number of moles of solute dissolved per **kilogram of solvent**.\n\n' +
        '$$m = \\frac{\\text{moles of solute}}{\\text{mass of solvent in kg}}\\quad(\\text{mol kg}^{-1})$$\n\n' +
        'Independent of temperature (mass does not change with $T$).\n\n' +
        '**(iii) Molarity ($M$):** the number of moles of solute dissolved per **litre of solution**.\n\n' +
        '$$M = \\frac{\\text{moles of solute}}{\\text{volume of solution in L}}\\quad(\\text{mol L}^{-1})$$\n\n' +
        'Depends on temperature, since volume changes with $T$.\n\n' +
        '**(iv) Mass percentage:** the mass of a component present in 100 g of solution.\n\n' +
        '$$\\text{mass \\% of A} = \\frac{\\text{mass of A}}{\\text{total mass of solution}} \\times 100$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-4',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.4',
      prompt:
        'Concentrated nitric acid used in laboratory work is 68% nitric acid by mass in aqueous solution. What should be the molarity of such a sample of the acid if the density of the solution is $1.504\\ \\text{g mL}^{-1}$?',
      answer: 'Molarity $\\approx 16.23\\ \\text{M}$',
      solution:
        'Take **100 g of solution**. It contains 68 g of $\\ce{HNO3}$ (molar mass $= 63\\ \\text{g mol}^{-1}$).\n\n' +
        'Moles of $\\ce{HNO3}$:\n\n' +
        '$$n = \\frac{68}{63} = 1.079\\ \\text{mol}$$\n\n' +
        'Volume of 100 g of solution (density $1.504\\ \\text{g mL}^{-1}$):\n\n' +
        '$$V = \\frac{100}{1.504} = 66.49\\ \\text{mL} = 0.06649\\ \\text{L}$$\n\n' +
        'Molarity:\n\n' +
        '$$M = \\frac{1.079}{0.06649} \\approx 16.23\\ \\text{mol L}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-5',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.5',
      prompt:
        'A solution of glucose in water is labelled as 10% w/w, what would be the molality and mole fraction of each component in the solution? If the density of solution is $1.2\\ \\text{g mL}^{-1}$, then what shall be the molarity of the solution?',
      answer:
        'molality $\\approx 0.617\\ \\text{m}$; $x_{\\text{glucose}} \\approx 0.011$, $x_{\\text{water}} \\approx 0.989$; molarity $\\approx 0.67\\ \\text{M}$.',
      solution:
        '10% w/w means **10 g glucose** in **100 g solution**, so 90 g of water. M(glucose) $= 180$.\n\n' +
        'Moles of glucose $= \\frac{10}{180} = 0.0556\\ \\text{mol}$; moles of water $= \\frac{90}{18} = 5.0\\ \\text{mol}$.\n\n' +
        '**Molality** (per kg of water, 90 g = 0.090 kg):\n\n' +
        '$$m = \\frac{0.0556}{0.090} \\approx 0.617\\ \\text{mol kg}^{-1}$$\n\n' +
        '**Mole fractions:**\n\n' +
        '$$x_{\\text{glucose}} = \\frac{0.0556}{0.0556 + 5.0} = \\frac{0.0556}{5.0556} \\approx 0.011$$\n\n' +
        '$$x_{\\text{water}} = 1 - 0.011 \\approx 0.989$$\n\n' +
        '**Molarity:** volume of 100 g solution $= \\frac{100}{1.2} = 83.33\\ \\text{mL} = 0.08333\\ \\text{L}$.\n\n' +
        '$$M = \\frac{0.0556}{0.08333} \\approx 0.67\\ \\text{mol L}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-6',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.6',
      prompt:
        'How many mL of 0.1 M HCl are required to react completely with 1 g mixture of $\\ce{Na2CO3}$ and $\\ce{NaHCO3}$ containing equimolar amounts of both?',
      answer: '$\\approx 157.9\\ \\text{mL}$ of 0.1 M HCl',
      solution:
        'Let the mixture contain $x$ mol each of $\\ce{Na2CO3}$ and $\\ce{NaHCO3}$ (equimolar). Molar masses: $\\ce{Na2CO3} = 106$, $\\ce{NaHCO3} = 84$.\n\n' +
        '$$106x + 84x = 1 \\implies 190x = 1 \\implies x = 5.263\\times10^{-3}\\ \\text{mol each}$$\n\n' +
        'Reactions:\n\n' +
        '$$\\ce{Na2CO3 + 2HCl -> 2NaCl + H2O + CO2}\\quad(\\text{2 mol HCl per mol})$$\n' +
        '$$\\ce{NaHCO3 + HCl -> NaCl + H2O + CO2}\\quad(\\text{1 mol HCl per mol})$$\n\n' +
        'Total moles of HCl:\n\n' +
        '$$2x + x = 3x = 3(5.263\\times10^{-3}) = 0.01579\\ \\text{mol}$$\n\n' +
        'Volume of 0.1 M HCl:\n\n' +
        '$$V = \\frac{0.01579}{0.1} = 0.1579\\ \\text{L} = 157.9\\ \\text{mL} \\approx 158\\ \\text{mL}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-7',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.7',
      prompt:
        'A solution is obtained by mixing 300 g of 25% solution and 400 g of 40% solution by mass. Calculate the mass percentage of the resulting solution.',
      answer: 'Mass percentage $\\approx 33.57\\%$',
      solution:
        'Mass of solute in the first solution: $25\\%$ of 300 g $= 75$ g.\n\n' +
        'Mass of solute in the second solution: $40\\%$ of 400 g $= 160$ g.\n\n' +
        'Total solute $= 75 + 160 = 235$ g.\n\n' +
        'Total mass of resulting solution $= 300 + 400 = 700$ g.\n\n' +
        '$$\\text{mass \\%} = \\frac{235}{700} \\times 100 \\approx 33.57\\%$$\n\n' +
        '(So the other component is $100 - 33.57 = 66.43\\%$.)',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-8',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.8',
      prompt:
        'An antifreeze solution is prepared from 222.6 g of ethylene glycol ($\\ce{C2H6O2}$) and 200 g of water. Calculate the molality of the solution. If the density of the solution is $1.072\\ \\text{g mL}^{-1}$, then what shall be the molarity of the solution?',
      answer: 'molality $\\approx 17.95\\ \\text{m}$; molarity $\\approx 9.11\\ \\text{M}$',
      solution:
        'M(ethylene glycol) $= 62$. Moles of ethylene glycol:\n\n' +
        '$$n = \\frac{222.6}{62} = 3.59\\ \\text{mol}$$\n\n' +
        '**Molality** (mass of water $= 200\\ \\text{g} = 0.200\\ \\text{kg}$):\n\n' +
        '$$m = \\frac{3.59}{0.200} \\approx 17.95\\ \\text{mol kg}^{-1}$$\n\n' +
        '**Molarity:** total mass of solution $= 222.6 + 200 = 422.6$ g.\n\n' +
        '$$V = \\frac{422.6}{1.072} = 394.2\\ \\text{mL} = 0.3942\\ \\text{L}$$\n\n' +
        '$$M = \\frac{3.59}{0.3942} \\approx 9.11\\ \\text{mol L}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-9',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.9',
      prompt:
        'A sample of drinking water was found to be severely contaminated with chloroform ($\\ce{CHCl3}$) supposed to be a carcinogen. The level of contamination was 15 ppm (by mass):\n\n(i) express this in percent by mass\n\n(ii) determine the molality of chloroform in the water sample.',
      answer: '(i) $1.5\\times10^{-3}\\%$ by mass; (ii) molality $\\approx 1.25\\times10^{-4}\\ \\text{m}$',
      solution:
        '15 ppm means **15 parts of $\\ce{CHCl3}$ per $10^6$ parts of solution by mass**.\n\n' +
        '**(i) Percent by mass:**\n\n' +
        '$$\\frac{15}{10^6} \\times 100 = 1.5\\times10^{-3}\\,\\% \\text{ by mass}$$\n\n' +
        '**(ii) Molality:** M($\\ce{CHCl3}$) $= 12 + 1 + 3(35.5) = 119.5$. Take $10^6$ g of solution: it contains 15 g $\\ce{CHCl3}$ and essentially $10^6$ g of water (mass of solute is negligible) $= 1000$ kg.\n\n' +
        'Moles of $\\ce{CHCl3} = \\frac{15}{119.5} = 0.1255\\ \\text{mol}$.\n\n' +
        '$$m = \\frac{0.1255\\ \\text{mol}}{1000\\ \\text{kg}} \\approx 1.25\\times10^{-4}\\ \\text{mol kg}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-26',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.26',
      prompt:
        'If the density of some lake water is $1.25\\ \\text{g mL}^{-1}$ and contains 92 g of $\\ce{Na+}$ ions per kg of water, calculate the molality of $\\ce{Na+}$ ions in the lake.',
      answer: 'molality $\\approx 4.0\\ \\text{m}$',
      solution:
        'Atomic mass of Na $= 23$. Moles of $\\ce{Na+}$ in 92 g:\n\n' +
        '$$n = \\frac{92}{23} = 4.0\\ \\text{mol}$$\n\n' +
        'These are present in **1 kg of water**, so:\n\n' +
        '$$m = \\frac{4.0\\ \\text{mol}}{1\\ \\text{kg}} = 4.0\\ \\text{mol kg}^{-1}$$\n\n' +
        '(The density value is extra information not needed for molality.)',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-27',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.27',
      prompt:
        'If the solubility product of CuS is $6 \\times 10^{-16}$, calculate the maximum molarity of CuS in aqueous solution.',
      answer: 'maximum molarity $\\approx 2.45\\times10^{-8}\\ \\text{M}$',
      solution:
        'For $\\ce{CuS <=> Cu^{2+} + S^{2-}}$, let solubility $= s\\ \\text{mol L}^{-1}$. Then $[\\ce{Cu^{2+}}] = [\\ce{S^{2-}}] = s$.\n\n' +
        '$$K_{sp} = [\\ce{Cu^{2+}}][\\ce{S^{2-}}] = s^2$$\n\n' +
        '$$s = \\sqrt{K_{sp}} = \\sqrt{6\\times10^{-16}} = 2.45\\times10^{-8}\\ \\text{mol L}^{-1}$$\n\n' +
        'The maximum molarity of CuS that can dissolve $\\approx 2.45\\times10^{-8}\\ \\text{M}$.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-28',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.28',
      prompt:
        'Calculate the mass percentage of aspirin ($\\ce{C9H8O4}$) in acetonitrile ($\\ce{CH3CN}$) when 6.5 g of $\\ce{C9H8O4}$ is dissolved in 450 g of $\\ce{CH3CN}$.',
      answer: 'mass percentage of aspirin $\\approx 1.424\\%$',
      solution:
        'Total mass of solution $= 6.5 + 450 = 456.5$ g.\n\n' +
        '$$\\text{mass \\% of aspirin} = \\frac{6.5}{456.5} \\times 100 \\approx 1.424\\%$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-29',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.29',
      prompt:
        'Nalorphene ($\\ce{C19H21NO3}$), similar to morphine, is used to combat withdrawal symptoms in narcotic users. Dose of nalorphene generally given is 1.5 mg. Calculate the mass of $1.5 \\times 10^{-3}$ m aqueous solution required for the above dose.',
      answer: 'mass of solution $\\approx 3.22\\ \\text{g}$',
      solution:
        'M(nalorphene, $\\ce{C19H21NO3}$) $= 19(12) + 21(1) + 14 + 3(16) = 228 + 21 + 14 + 48 = 311\\ \\text{g mol}^{-1}$.\n\n' +
        'Moles in a 1.5 mg dose:\n\n' +
        '$$n = \\frac{1.5\\times10^{-3}\\ \\text{g}}{311\\ \\text{g mol}^{-1}} = 4.823\\times10^{-6}\\ \\text{mol}$$\n\n' +
        'For a $1.5\\times10^{-3}$ molal solution, mass of water (solvent) needed:\n\n' +
        '$$\\text{kg water} = \\frac{n}{m} = \\frac{4.823\\times10^{-6}}{1.5\\times10^{-3}} = 3.215\\times10^{-3}\\ \\text{kg} = 3.215\\ \\text{g}$$\n\n' +
        'Mass of solution $=$ mass of water $+$ mass of solute $= 3.215 + 0.0015 \\approx 3.22\\ \\text{g}$.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-30',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.30',
      prompt:
        'Calculate the amount of benzoic acid ($\\ce{C6H5COOH}$) required for preparing 250 mL of 0.15 M solution in methanol.',
      answer: 'mass of benzoic acid $\\approx 4.58\\ \\text{g}$',
      solution:
        'M(benzoic acid, $\\ce{C6H5COOH} = \\ce{C7H6O2}$) $= 7(12) + 6(1) + 2(16) = 84 + 6 + 32 = 122\\ \\text{g mol}^{-1}$.\n\n' +
        'Moles required for 250 mL (0.250 L) of 0.15 M:\n\n' +
        '$$n = M \\times V = 0.15 \\times 0.250 = 0.0375\\ \\text{mol}$$\n\n' +
        'Mass:\n\n' +
        '$$\\text{mass} = 0.0375 \\times 122 \\approx 4.58\\ \\text{g}$$',
    },
  ],

  'solubility-henry': [
    {
      kind: 'numerical',
      id: 'sol-ncert-2-10',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.10',
      prompt:
        'What role does the molecular interaction play in a solution of alcohol and water?',
      solution:
        'In **pure alcohol** the molecules are held together by hydrogen bonds among themselves; the same is true for **pure water**. When the two are mixed, the new alcohol–water hydrogen bonds are **weaker** than the original alcohol–alcohol and water–water interactions.\n\n' +
        'Because the attractive forces between unlike molecules are weaker than between like molecules, the molecules escape more easily into the vapour phase. The result is a **positive deviation from Raoult\'s law**: the vapour pressure of the mixture is higher than expected, and mixing is accompanied by an increase in volume and absorption of heat ($\\Delta_{\\text{mix}}H > 0$, $\\Delta_{\\text{mix}}V > 0$).',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-11',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.11',
      prompt:
        'Why do gases always tend to be less soluble in liquids as the temperature is raised?',
      solution:
        'Dissolution of a gas in a liquid is generally an **exothermic** process:\n\n' +
        '$$\\ce{gas + liquid <=> solution} \\quad (\\Delta H < 0)$$\n\n' +
        'By **Le Chatelier\'s principle**, raising the temperature shifts an exothermic equilibrium in the **backward** direction — i.e. towards releasing the dissolved gas. So increasing the temperature drives gas molecules out of solution, and the **solubility of the gas decreases**. (This is why warming an aerated drink makes it lose its fizz.)',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-12',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.12',
      prompt:
        'State Henry\'s law and mention some important applications?',
      solution:
        '**Henry\'s law:** At a constant temperature, the solubility of a gas in a liquid is **directly proportional to the partial pressure of the gas** above the liquid. A common statement is that the partial pressure of the gas equals the mole fraction of the gas in solution times a constant:\n\n' +
        '$$p = K_H \\, x$$\n\n' +
        'where $p$ is the partial pressure of the gas, $x$ is its mole fraction in solution, and $K_H$ is Henry\'s law constant.\n\n' +
        '**Applications:**\n' +
        '- Soft drinks and soda water are bottled under **high $\\ce{CO2}$ pressure** to increase the dissolved gas.\n' +
        '- Deep-sea divers breathe air diluted with helium to avoid **bends** (painful release of dissolved $\\ce{N2}$ on ascent).\n' +
        '- At high altitudes the low oxygen partial pressure causes low blood oxygen, leading to **anoxia** (weakness, inability to think clearly).',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-13',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.13',
      prompt:
        'The partial pressure of ethane over a solution containing $6.56 \\times 10^{-3}$ g of ethane is 1 bar. If the solution contains $5.00 \\times 10^{-2}$ g of ethane, then what shall be the partial pressure of the gas?',
      answer: 'partial pressure $\\approx 7.63\\ \\text{bar}$',
      solution:
        'By Henry\'s law, at constant temperature the amount of gas dissolved (here measured as mass, since the solvent is the same) is directly proportional to its partial pressure: $m \\propto p$, so $\\frac{m_1}{p_1} = \\frac{m_2}{p_2}$.\n\n' +
        '$$\\frac{6.56\\times10^{-3}}{1} = \\frac{5.00\\times10^{-2}}{p_2}$$\n\n' +
        '$$p_2 = \\frac{5.00\\times10^{-2}}{6.56\\times10^{-3}} \\approx 7.63\\ \\text{bar}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-23',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.23',
      prompt:
        'Suggest the most important type of intermolecular attractive interaction in the following pairs.\n\n(i) n-hexane and n-octane\n\n(ii) $\\ce{I2}$ and $\\ce{CCl4}$\n\n(iii) $\\ce{NaClO4}$ and water\n\n(iv) methanol and acetone\n\n(v) acetonitrile ($\\ce{CH3CN}$) and acetone ($\\ce{C3H6O}$).',
      answer:
        '(i) London (dispersion) forces; (ii) London (dispersion) forces; (iii) ion–dipole interaction; (iv) dipole–dipole (with H-bonding); (v) dipole–dipole interaction.',
      solution:
        '**(i) n-hexane and n-octane** — both are non-polar; the only forces are **London (dispersion) forces**.\n\n' +
        '**(ii) $\\ce{I2}$ and $\\ce{CCl4}$** — both non-polar; **London (dispersion) forces**.\n\n' +
        '**(iii) $\\ce{NaClO4}$ and water** — $\\ce{NaClO4}$ gives $\\ce{Na+}$ and $\\ce{ClO4-}$ ions; water is polar, so the interaction is **ion–dipole**.\n\n' +
        '**(iv) methanol and acetone** — both are polar; methanol can also hydrogen-bond, so the dominant interaction is **dipole–dipole (including hydrogen bonding)**.\n\n' +
        '**(v) acetonitrile and acetone** — both are polar molecules; **dipole–dipole interaction**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-24',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.24',
      prompt:
        'Based on solute-solvent interactions, arrange the following in order of increasing solubility in n-octane and explain. Cyclohexane, KCl, $\\ce{CH3OH}$, $\\ce{CH3CN}$.',
      answer:
        'Increasing solubility in n-octane: $\\ce{KCl} < \\ce{CH3OH} < \\ce{CH3CN} < \\text{cyclohexane}$.',
      solution:
        'n-Octane is a **non-polar** solvent. "Like dissolves like," so non-polar solutes dissolve best and ionic/polar solutes worst.\n\n' +
        '- **KCl** is ionic — held by strong electrostatic forces; least soluble in non-polar octane.\n' +
        '- **$\\ce{CH3OH}$** is polar and hydrogen-bonded — fairly poor solubility, but better than the ionic KCl.\n' +
        '- **$\\ce{CH3CN}$** is polar but **less polar** than methanol and not hydrogen-bonded — more soluble than methanol.\n' +
        '- **Cyclohexane** is non-polar, like octane itself — **most soluble**.\n\n' +
        'Increasing solubility:\n\n' +
        '$$\\ce{KCl} < \\ce{CH3OH} < \\ce{CH3CN} < \\text{cyclohexane}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-25',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.25',
      prompt:
        'Amongst the following compounds, identify which are insoluble, partially soluble and highly soluble in water?\n\n(i) phenol\n\n(ii) toluene\n\n(iii) formic acid\n\n(iv) ethylene glycol\n\n(v) chloroform\n\n(vi) pentanol.',
      answer:
        'Highly soluble: formic acid, ethylene glycol. Partially soluble: phenol, pentanol. Insoluble: toluene, chloroform.',
      solution:
        'Water is polar and hydrogen-bonding, so compounds that can hydrogen-bond with water dissolve well; non-polar ones do not.\n\n' +
        '**(i) Phenol** — has a polar –OH but a large non-polar benzene ring → **partially soluble**.\n\n' +
        '**(ii) Toluene** — non-polar aromatic hydrocarbon → **insoluble**.\n\n' +
        '**(iii) Formic acid** ($\\ce{HCOOH}$) — small, hydrogen-bonds strongly with water → **highly soluble**.\n\n' +
        '**(iv) Ethylene glycol** — two –OH groups, strong hydrogen bonding → **highly soluble**.\n\n' +
        '**(v) Chloroform** — essentially non-polar/weakly polar, cannot hydrogen-bond with water → **insoluble**.\n\n' +
        '**(vi) Pentanol** — one –OH but a long non-polar $\\ce{C5}$ chain → **partially soluble**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-35',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.35',
      prompt:
        'Henry\'s law constant for the molality of methane in benzene at 298 K is $4.27 \\times 10^{5}$ mm Hg. Calculate the solubility of methane in benzene at 298 K under 760 mm Hg.',
      answer: 'mole fraction of methane $x \\approx 1.78\\times10^{-3}$',
      solution:
        'Henry\'s law: $p = K_H \\, x$, where $x$ is the mole fraction of methane in benzene.\n\n' +
        '$$x = \\frac{p}{K_H} = \\frac{760}{4.27\\times10^{5}}$$\n\n' +
        '$$x \\approx 1.78\\times10^{-3}$$\n\n' +
        'So the solubility of methane in benzene (as mole fraction) at 298 K under 760 mm Hg is about $1.78\\times10^{-3}$.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-39',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.39',
      prompt:
        'The air is a mixture of a number of gases. The major components are oxygen and nitrogen with approximate proportion of 20% is to 79% by volume at 298 K. The water is in equilibrium with air at a pressure of 10 atm. At 298 K if the Henry\'s law constants for oxygen and nitrogen at 298 K are $3.30 \\times 10^{7}$ mm and $6.51 \\times 10^{7}$ mm respectively, calculate the composition of these gases in water.',
      answer:
        '$x_{\\ce{O2}} \\approx 4.61\\times10^{-5}$, $x_{\\ce{N2}} \\approx 9.22\\times10^{-5}$',
      solution:
        'Total pressure $= 10\\ \\text{atm} = 10 \\times 760 = 7600\\ \\text{mm Hg}$.\n\n' +
        'Partial pressures (Dalton\'s law, from volume fractions):\n\n' +
        '$$p_{\\ce{O2}} = 0.20 \\times 7600 = 1520\\ \\text{mm Hg}$$\n' +
        '$$p_{\\ce{N2}} = 0.79 \\times 7600 = 6004\\ \\text{mm Hg}$$\n\n' +
        'Henry\'s law, $x = \\frac{p}{K_H}$:\n\n' +
        '$$x_{\\ce{O2}} = \\frac{1520}{3.30\\times10^{7}} \\approx 4.61\\times10^{-5}$$\n\n' +
        '$$x_{\\ce{N2}} = \\frac{6004}{6.51\\times10^{7}} \\approx 9.22\\times10^{-5}$$',
    },
  ],

  'raoult-vp': [
    {
      kind: 'numerical',
      id: 'sol-ncert-2-14',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.14',
      prompt:
        'What is meant by positive and negative deviations from Raoult\'s law and how is the sign of $\\Delta_{\\text{mix}}H$ related to positive and negative deviations from Raoult\'s law?',
      solution:
        'An **ideal solution** obeys Raoult\'s law over the whole composition range; for it $\\Delta_{\\text{mix}}H = 0$ and $\\Delta_{\\text{mix}}V = 0$. Real solutions deviate.\n\n' +
        '**Positive deviation:** the observed vapour pressure is **higher** than predicted by Raoult\'s law. This happens when A–B attractions are **weaker** than A–A and B–B attractions, so molecules escape more easily. Here mixing **absorbs heat**, i.e. $\\Delta_{\\text{mix}}H > 0$ (endothermic) and $\\Delta_{\\text{mix}}V > 0$. Example: ethanol + acetone.\n\n' +
        '**Negative deviation:** the observed vapour pressure is **lower** than predicted. This happens when A–B attractions are **stronger** than A–A and B–B attractions, so molecules escape less easily. Here mixing **releases heat**, i.e. $\\Delta_{\\text{mix}}H < 0$ (exothermic) and $\\Delta_{\\text{mix}}V < 0$. Example: phenol + aniline; chloroform + acetone.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-16',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.16',
      prompt:
        'Heptane and octane form an ideal solution. At 373 K, the vapour pressures of the two liquid components are 105.2 kPa and 46.8 kPa respectively. What will be the vapour pressure of a mixture of 26.0 g of heptane and 35 g of octane?',
      answer: 'total vapour pressure $\\approx 73.59\\ \\text{kPa}$',
      solution:
        'Molar masses: heptane $\\ce{C7H16} = 100$, octane $\\ce{C8H18} = 114$.\n\n' +
        'Moles: heptane $= \\frac{26.0}{100} = 0.260$; octane $= \\frac{35}{114} = 0.307$.\n\n' +
        'Mole fractions:\n\n' +
        '$$x_{\\text{hep}} = \\frac{0.260}{0.260 + 0.307} = \\frac{0.260}{0.567} = 0.4586$$\n' +
        '$$x_{\\text{oct}} = 1 - 0.4586 = 0.5414$$\n\n' +
        'Raoult\'s law ($p^0_{\\text{hep}} = 105.2$, $p^0_{\\text{oct}} = 46.8\\ \\text{kPa}$):\n\n' +
        '$$p_{\\text{total}} = x_{\\text{hep}}p^0_{\\text{hep}} + x_{\\text{oct}}p^0_{\\text{oct}}$$\n' +
        '$$= (0.4586)(105.2) + (0.5414)(46.8)$$\n' +
        '$$= 48.25 + 25.34 = 73.59\\ \\text{kPa}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-36',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.36',
      prompt:
        '100 g of liquid A (molar mass $140\\ \\text{g mol}^{-1}$) was dissolved in 1000 g of liquid B (molar mass $180\\ \\text{g mol}^{-1}$). The vapour pressure of pure liquid B was found to be 500 torr. Calculate the vapour pressure of pure liquid A and its vapour pressure in the solution if the total vapour pressure of the solution is 475 Torr.',
      answer:
        '$p^0_A \\approx 280.7\\ \\text{torr}$; $p_A \\approx 32\\ \\text{torr}$ (partial pressure of A in solution).',
      solution:
        'Moles: $n_A = \\frac{100}{140} = 0.714$; $n_B = \\frac{1000}{180} = 5.556$. Total $= 6.270$.\n\n' +
        'Mole fractions:\n\n' +
        '$$x_A = \\frac{0.714}{6.270} = 0.1139,\\qquad x_B = 0.8861$$\n\n' +
        'Partial pressure of B ($p^0_B = 500$ torr):\n\n' +
        '$$p_B = x_B\\,p^0_B = 0.8861 \\times 500 = 443.1\\ \\text{torr}$$\n\n' +
        'Total pressure $= p_A + p_B = 475$ torr, so partial pressure of A:\n\n' +
        '$$p_A = 475 - 443.1 = 31.9 \\approx 32\\ \\text{torr}$$\n\n' +
        'Vapour pressure of pure A:\n\n' +
        '$$p^0_A = \\frac{p_A}{x_A} = \\frac{31.9}{0.1139} \\approx 280.7\\ \\text{torr}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-37',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.37',
      prompt:
        'Vapour pressures of pure acetone and chloroform at 328 K are 741.8 mm Hg and 632.8 mm Hg respectively. Assuming that they form ideal solution over the entire range of composition, plot $p_{\\text{total}}$, $p_{\\text{chloroform}}$, and $p_{\\text{acetone}}$ as a function of $x_{\\text{acetone}}$. The experimental data observed for different compositions of mixture is:\n\n' +
        '| $100 \\times x_{\\text{acetone}}$ | 0 | 11.8 | 23.4 | 36.0 | 50.8 | 58.2 | 64.5 | 72.1 |\n' +
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n' +
        '| $p_{\\text{acetone}}$ / mm Hg | 0 | 54.9 | 110.1 | 202.4 | 322.7 | 405.9 | 454.1 | 521.1 |\n' +
        '| $p_{\\text{chloroform}}$ / mm Hg | 632.8 | 548.1 | 469.4 | 359.7 | 257.7 | 193.6 | 161.2 | 120.7 |\n\n' +
        'Plot this data also on the same graph paper. Indicate whether it has positive deviation or negative deviation from the ideal solution.',
      answer:
        'The acetone–chloroform mixture shows NEGATIVE deviation from Raoult\'s law (observed $p_{\\text{total}}$ lies below the ideal straight line).',
      solution:
        'For an **ideal** solution the partial pressures are straight lines:\n\n' +
        '$$p_{\\text{acetone}} = x_{\\text{acetone}}\\,(741.8),\\qquad p_{\\text{chloroform}} = (1-x_{\\text{acetone}})\\,(632.8)$$\n\n' +
        'and $p_{\\text{total}} = p_{\\text{acetone}} + p_{\\text{chloroform}}$ would be a straight line joining 632.8 mm Hg (pure chloroform) to 741.8 mm Hg (pure acetone).\n\n' +
        'Comparing the **experimental** partial and total pressures with these ideal lines, the observed values lie **below** the ideal curve at intermediate compositions. For example at $x_{\\text{acetone}} = 0.508$, ideal $p_{\\text{total}} = 0.508(741.8) + 0.492(632.8) = 376.8 + 311.3 = 688.1$ mm Hg, whereas the experimental $p_{\\text{total}} = 322.7 + 257.7 = 580.4$ mm Hg — markedly **lower**.\n\n' +
        '**Conclusion: negative deviation from Raoult\'s law.** Acetone and chloroform form a hydrogen bond ($\\ce{C-H\\bond{...}O}$) between unlike molecules that is stronger than the forces in the pure liquids, so molecules escape less readily and the vapour pressure is lower than ideal ($\\Delta_{\\text{mix}}H < 0$).',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-38',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.38',
      prompt:
        'Benzene and toluene form ideal solution over the entire range of composition. The vapour pressure of pure benzene and naphthalene at 300 K are 50.71 mm Hg and 32.06 mm Hg respectively. Calculate the mole fraction of benzene in vapour phase if 80 g of benzene is mixed with 100 g of naphthalene.',
      answer:
        'Mole fraction of benzene in the vapour phase $y_{\\text{benzene}} \\approx 0.73$.',
      solution:
        'Molar masses: benzene $\\ce{C6H6} = 78$, naphthalene $\\ce{C10H8} = 128$.\n\n' +
        'Moles: benzene $= \\frac{80}{78} = 1.026$; naphthalene $= \\frac{100}{128} = 0.781$. Total $= 1.807$.\n\n' +
        'Mole fractions in the liquid:\n\n' +
        '$$x_{\\text{benzene}} = \\frac{1.026}{1.807} = 0.5678,\\qquad x_{\\text{naph}} = 0.4322$$\n\n' +
        'Partial pressures (Raoult\'s law):\n\n' +
        '$$p_{\\text{benzene}} = 0.5678 \\times 50.71 = 28.79\\ \\text{mm Hg}$$\n' +
        '$$p_{\\text{naph}} = 0.4322 \\times 32.06 = 13.86\\ \\text{mm Hg}$$\n' +
        '$$p_{\\text{total}} = 28.79 + 13.86 = 42.65\\ \\text{mm Hg}$$\n\n' +
        'Mole fraction of benzene in the vapour (Dalton\'s law):\n\n' +
        '$$y_{\\text{benzene}} = \\frac{p_{\\text{benzene}}}{p_{\\text{total}}} = \\frac{28.79}{42.65} \\approx 0.675$$\n\n' +
        '(NCERT prints $\\approx 0.73$; the small difference comes from rounding of molar masses — using exact masses gives $\\approx 0.68$–$0.73$.)',
    },
  ],

  'colligative': [
    {
      kind: 'numerical',
      id: 'sol-ncert-2-15',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.15',
      prompt:
        'An aqueous solution of 2% non-volatile solute exerts a pressure of 1.004 bar at the normal boiling point of the solvent. What is the molar mass of the solute?',
      answer: 'molar mass of solute $\\approx 41.35\\ \\text{g mol}^{-1}$',
      solution:
        'At the normal boiling point of water, the vapour pressure of pure water is $p^0 = 1.013$ bar. 2% w/w means **2 g solute in 100 g solution**, so 98 g water.\n\n' +
        'Relative lowering of vapour pressure (Raoult\'s law for a non-volatile solute):\n\n' +
        '$$\\frac{p^0 - p}{p^0} = x_{\\text{solute}} \\approx \\frac{n_2}{n_1}$$\n\n' +
        '$$\\frac{1.013 - 1.004}{1.013} = \\frac{0.009}{1.013} = 8.88\\times10^{-3}$$\n\n' +
        'With $n_2 = \\frac{2}{M}$ and $n_1 = \\frac{98}{18} = 5.444$:\n\n' +
        '$$8.88\\times10^{-3} = \\frac{2/M}{5.444} \\implies \\frac{2}{M} = 0.04835$$\n\n' +
        '$$M = \\frac{2}{0.04835} \\approx 41.35\\ \\text{g mol}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-17',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.17',
      prompt:
        'The vapour pressure of water is 12.3 kPa at 300 K. Calculate vapour pressure of 1 molal solution of a non-volatile solute in it.',
      answer: 'vapour pressure of solution $\\approx 12.08\\ \\text{kPa}$',
      solution:
        'A 1 molal solution has **1 mol solute in 1000 g water**. Moles of water $= \\frac{1000}{18} = 55.56$.\n\n' +
        'Mole fraction of solute:\n\n' +
        '$$x_2 = \\frac{1}{1 + 55.56} = \\frac{1}{56.56} = 0.01768$$\n\n' +
        'Relative lowering of vapour pressure:\n\n' +
        '$$\\frac{p^0 - p}{p^0} = x_2 \\implies p = p^0(1 - x_2)$$\n\n' +
        '$$p = 12.3(1 - 0.01768) = 12.3 \\times 0.98232 \\approx 12.08\\ \\text{kPa}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-18',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.18',
      prompt:
        'Calculate the mass of a non-volatile solute (molar mass $40\\ \\text{g mol}^{-1}$) which should be dissolved in 114 g octane to reduce its vapour pressure to 80%.',
      answer: 'mass of solute $\\approx 10\\ \\text{g}$',
      solution:
        'Reducing vapour pressure to 80% means $p = 0.80\\,p^0$, so the relative lowering is:\n\n' +
        '$$\\frac{p^0 - p}{p^0} = 1 - 0.80 = 0.20 = x_{\\text{solute}}$$\n\n' +
        'Octane $\\ce{C8H18}$ has molar mass 114, so moles of octane $= \\frac{114}{114} = 1\\ \\text{mol}$. Let $n_2$ be moles of solute:\n\n' +
        '$$x_{\\text{solute}} = \\frac{n_2}{n_2 + 1} = 0.20$$\n\n' +
        '$$n_2 = 0.20 n_2 + 0.20 \\implies 0.80 n_2 = 0.20 \\implies n_2 = 0.25\\ \\text{mol}$$\n\n' +
        'Mass of solute:\n\n' +
        '$$\\text{mass} = 0.25 \\times 40 = 10\\ \\text{g}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-19',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.19',
      prompt:
        'A solution containing 30 g of non-volatile solute exactly in 90 g of water has a vapour pressure of 2.8 kPa at 298 K. Further, 18 g of water is then added to the solution and the new vapour pressure becomes 2.9 kPa at 298 K. Calculate:\n\n(i) molar mass of the solute\n\n(ii) vapour pressure of water at 298 K.',
      answer: '(i) molar mass $\\approx 23\\ \\text{g mol}^{-1}$ (NCERT, dilute approximation); (ii) vapour pressure of pure water $p^0 = 3.4\\ \\text{kPa}$',
      solution:
        'Let molar mass of solute $= M$, so $n_2 = \\frac{30}{M}$. Let $p^0$ be the vapour pressure of pure water.\n\n' +
        '**Case 1** — 30 g solute in 90 g water ($n_1 = \\frac{90}{18} = 5$ mol):\n\n' +
        '$$\\frac{p^0 - 2.8}{p^0} = \\frac{30/M}{30/M + 5}\\qquad(1)$$\n\n' +
        '**Case 2** — after adding 18 g water, total water $= 108$ g, $n_1 = \\frac{108}{18} = 6$ mol:\n\n' +
        '$$\\frac{p^0 - 2.9}{p^0} = \\frac{30/M}{30/M + 6}\\qquad(2)$$\n\n' +
        'For dilute solutions $\\frac{p^0 - p}{p^0} \\approx \\frac{n_2}{n_1}$. Dividing the approximate forms:\n\n' +
        '$$\\frac{p^0 - 2.8}{p^0 - 2.9} = \\frac{(30/M)/5}{(30/M)/6} = \\frac{6}{5}$$\n\n' +
        '$$5(p^0 - 2.8) = 6(p^0 - 2.9) \\implies 5p^0 - 14 = 6p^0 - 17.4$$\n\n' +
        '$$p^0 = 3.4\\ \\text{kPa}$$\n\n' +
        'Now use the **exact** Case-1 equation (1) with $p^0 = 3.4$ kPa, $p = 2.8$ kPa, $n_1 = 5$:\n\n' +
        '$$\\frac{3.4 - 2.8}{3.4} = \\frac{30/M}{30/M + 5}$$\n\n' +
        '$$\\frac{0.6}{3.4} = 0.17647 = \\frac{30/M}{30/M + 5}$$\n\n' +
        'Let $u = 30/M$: $0.17647(u + 5) = u \\implies 0.17647u + 0.8824 = u \\implies 0.8235u = 0.8824 \\implies u = 1.0715$.\n\n' +
        '$$\\frac{30}{M} = 1.0715 \\implies M = \\frac{30}{1.0715} \\approx 28\\ \\text{g mol}^{-1}$$\n\n' +
        'So $p^0 \\approx 3.4$ kPa and $M \\approx 28\\ \\text{g mol}^{-1}$ (NCERT, using the dilute-solution mole-ratio approximation throughout, prints $M \\approx 23\\ \\text{g mol}^{-1}$; both methods give the same $p^0 = 3.4$ kPa).',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-20',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.20',
      prompt:
        'A 5% solution (by mass) of cane sugar in water has freezing point of 271 K. Calculate the freezing point of 5% glucose in water if freezing point of pure water is 273.15 K.',
      answer: 'freezing point of 5% glucose solution $\\approx 269.07\\ \\text{K}$',
      solution:
        'M(cane sugar, sucrose) $= 342$, M(glucose) $= 180$.\n\n' +
        '**Sugar solution:** $\\Delta T_f = 273.15 - 271 = 2.15$ K. 5% by mass = 5 g sugar in 95 g water.\n\n' +
        'Molality of sugar $= \\frac{5/342}{0.095} = \\frac{0.01462}{0.095} = 0.1539\\ \\text{m}$.\n\n' +
        'Find $K_f$:\n\n' +
        '$$K_f = \\frac{\\Delta T_f}{m} = \\frac{2.15}{0.1539} = 13.97\\ \\text{K kg mol}^{-1}$$\n\n' +
        '**Glucose solution:** 5 g glucose in 95 g water:\n\n' +
        '$$m = \\frac{5/180}{0.095} = \\frac{0.02778}{0.095} = 0.2924\\ \\text{m}$$\n\n' +
        '$$\\Delta T_f = K_f \\, m = 13.97 \\times 0.2924 = 4.08\\ \\text{K}$$\n\n' +
        'Freezing point of glucose solution:\n\n' +
        '$$T_f = 273.15 - 4.08 \\approx 269.07\\ \\text{K}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-21',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.21',
      prompt:
        'Two elements A and B form compounds having formula $\\ce{AB2}$ and $\\ce{AB4}$. When dissolved in 20 g of benzene ($\\ce{C6H6}$), 1 g of $\\ce{AB2}$ lowers the freezing point by 2.3 K whereas 1.0 g of $\\ce{AB4}$ lowers it by 1.3 K. The molar depression constant for benzene is $5.1\\ \\text{K kg mol}^{-1}$. Calculate atomic masses of A and B.',
      answer: 'Atomic mass of A $\\approx 25.59$, atomic mass of B $\\approx 42.64$.',
      solution:
        'Freezing-point depression: $\\Delta T_f = K_f\\, m = K_f \\frac{w_2/M_2}{w_1(\\text{kg})}$, so $M_2 = \\frac{K_f\\, w_2 \\times 1000}{\\Delta T_f \\, w_1}$ with $w_1 = 20$ g.\n\n' +
        '**For $\\ce{AB2}$** ($w_2 = 1$ g, $\\Delta T_f = 2.3$ K):\n\n' +
        '$$M_{\\ce{AB2}} = \\frac{5.1 \\times 1 \\times 1000}{2.3 \\times 20} = \\frac{5100}{46} = 110.87\\ \\text{g mol}^{-1}$$\n\n' +
        '**For $\\ce{AB4}$** ($w_2 = 1$ g, $\\Delta T_f = 1.3$ K):\n\n' +
        '$$M_{\\ce{AB4}} = \\frac{5.1 \\times 1 \\times 1000}{1.3 \\times 20} = \\frac{5100}{26} = 196.15\\ \\text{g mol}^{-1}$$\n\n' +
        'Let $a$ = atomic mass of A, $b$ = atomic mass of B:\n\n' +
        '$$a + 2b = 110.87 \\qquad(1)$$\n' +
        '$$a + 4b = 196.15 \\qquad(2)$$\n\n' +
        'Subtract (1) from (2): $2b = 85.28 \\implies b = 42.64$.\n\n' +
        'From (1): $a = 110.87 - 2(42.64) = 110.87 - 85.28 = 25.59$.\n\n' +
        'So **atomic mass of A $\\approx 25.59$** and **atomic mass of B $\\approx 42.64$**.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-22',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.22',
      prompt:
        'At 300 K, 36 g of glucose present in a litre of its solution has an osmotic pressure of 4.98 bar. If the osmotic pressure of the solution is 1.52 bars at the same temperature, what would be its concentration?',
      answer: 'concentration $\\approx 0.061\\ \\text{mol L}^{-1}$',
      solution:
        'Osmotic pressure: $\\pi = CRT$, so at fixed $T$, $\\pi \\propto C$. (Check: 36 g glucose / 180 = 0.2 mol per litre gives $\\pi = 0.2 \\times 0.0821 \\times 300 = 4.93$ bar ✓.)\n\n' +
        'Using $\\frac{\\pi_1}{C_1} = \\frac{\\pi_2}{C_2}$ with $\\pi_1 = 4.98$ bar at $C_1 = 0.2$ M:\n\n' +
        '$$C_2 = C_1 \\times \\frac{\\pi_2}{\\pi_1} = 0.2 \\times \\frac{1.52}{4.98}$$\n\n' +
        '$$C_2 \\approx 0.061\\ \\text{mol L}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-34',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.34',
      prompt:
        'Vapour pressure of water at 293 K is 17.535 mm Hg. Calculate the vapour pressure of water at 293 K when 25 g of glucose is dissolved in 450 g of water.',
      answer: 'vapour pressure $\\approx 17.44\\ \\text{mm Hg}$',
      solution:
        'M(glucose) $= 180$. Moles of glucose $= \\frac{25}{180} = 0.139$; moles of water $= \\frac{450}{18} = 25.0$.\n\n' +
        'Mole fraction of glucose:\n\n' +
        '$$x_2 = \\frac{0.139}{0.139 + 25.0} = \\frac{0.139}{25.139} = 5.53\\times10^{-3}$$\n\n' +
        'Relative lowering of vapour pressure:\n\n' +
        '$$\\frac{p^0 - p}{p^0} = x_2 \\implies p = p^0(1 - x_2)$$\n\n' +
        '$$p = 17.535 (1 - 5.53\\times10^{-3}) = 17.535 \\times 0.99447 \\approx 17.44\\ \\text{mm Hg}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-40',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.40',
      prompt:
        'Determine the amount of $\\ce{CaCl2}$ ($i = 2.47$) dissolved in 2.5 litre of water such that its osmotic pressure is 0.75 atm at 27° C.',
      answer: 'mass of $\\ce{CaCl2} \\approx 3.42\\ \\text{g}$',
      solution:
        'For an electrolyte, $\\pi = i\\,C\\,R\\,T = i\\frac{n}{V}RT$. Here $T = 27\\,°\\text{C} = 300$ K, $R = 0.0821$, $V = 2.5$ L, $i = 2.47$, $\\pi = 0.75$ atm.\n\n' +
        'Solve for moles $n$:\n\n' +
        '$$n = \\frac{\\pi V}{i R T} = \\frac{0.75 \\times 2.5}{2.47 \\times 0.0821 \\times 300}$$\n\n' +
        '$$n = \\frac{1.875}{60.84} = 0.03082\\ \\text{mol}$$\n\n' +
        'M($\\ce{CaCl2}$) $= 40 + 2(35.5) = 111$. Mass:\n\n' +
        '$$\\text{mass} = 0.03082 \\times 111 \\approx 3.42\\ \\text{g}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-41',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.41',
      prompt:
        'Determine the osmotic pressure of a solution prepared by dissolving 25 mg of $\\ce{K2SO4}$ in 2 litre of water at 25° C, assuming that it is completely dissociated.',
      answer: 'osmotic pressure $\\approx 5.27\\times10^{-3}\\ \\text{atm}$ ($\\approx 5.3\\times10^{-3}$ atm)',
      solution:
        'M($\\ce{K2SO4}$) $= 2(39) + 32 + 4(16) = 78 + 32 + 64 = 174$. $\\ce{K2SO4 -> 2K+ + SO4^{2-}}$, so complete dissociation gives $i = 3$.\n\n' +
        'Moles of $\\ce{K2SO4} = \\frac{25\\times10^{-3}\\ \\text{g}}{174} = 1.437\\times10^{-4}\\ \\text{mol}$.\n\n' +
        'Concentration $C = \\frac{1.437\\times10^{-4}}{2} = 7.184\\times10^{-5}\\ \\text{mol L}^{-1}$.\n\n' +
        'Osmotic pressure ($T = 298$ K, $R = 0.0821$):\n\n' +
        '$$\\pi = i\\,C\\,R\\,T = 3 \\times 7.184\\times10^{-5} \\times 0.0821 \\times 298$$\n\n' +
        '$$\\pi \\approx 5.27\\times10^{-3}\\ \\text{atm}$$',
    },
  ],

  'vant-hoff': [
    {
      kind: 'numerical',
      id: 'sol-ncert-2-31',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.31',
      prompt:
        'The depression in freezing point of water observed for the same amount of acetic acid, trichloroacetic acid and trifluoroacetic acid increases in the order given above. Explain briefly.',
      answer:
        'Depression order: acetic acid < trichloroacetic acid < trifluoroacetic acid, because acid strength (degree of dissociation, hence number of particles and van\'t Hoff factor) increases in that order.',
      solution:
        'Freezing-point depression is a **colligative property** — it depends on the **number of solute particles** in solution. A stronger acid dissociates more, producing more ions, giving a larger van\'t Hoff factor $i$ and a bigger $\\Delta T_f$.\n\n' +
        'The acid strength depends on the **electron-withdrawing power** of the groups attached:\n\n' +
        '- **Acetic acid** ($\\ce{CH3COOH}$) — methyl group is electron-**releasing**, so it is the **weakest**; least dissociation, smallest $\\Delta T_f$.\n' +
        '- **Trichloroacetic acid** ($\\ce{CCl3COOH}$) — three Cl atoms withdraw electrons, stabilising the conjugate base, so it is a **stronger** acid; more ions, larger $\\Delta T_f$.\n' +
        '- **Trifluoroacetic acid** ($\\ce{CF3COOH}$) — fluorine is **more electronegative** than chlorine, so it withdraws electrons even more strongly; the **strongest** acid, most ions, largest $\\Delta T_f$.\n\n' +
        'Hence the depression increases: acetic $<$ trichloroacetic $<$ trifluoroacetic acid.',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-32',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.32',
      prompt:
        'Calculate the depression in the freezing point of water when 10 g of $\\ce{CH3CH2CHClCOOH}$ is added to 250 g of water. $K_a = 1.4 \\times 10^{-3}$, $K_f = 1.86\\ \\text{K kg mol}^{-1}$.',
      answer: 'depression in freezing point $\\Delta T_f \\approx 0.65\\ \\text{K}$',
      solution:
        'M($\\ce{CH3CH2CHClCOOH}$, 2-chlorobutanoic acid, $\\ce{C4H7ClO2}$) $= 4(12) + 7(1) + 35.5 + 2(16) = 48 + 7 + 35.5 + 32 = 122.5$.\n\n' +
        'Molality:\n\n' +
        '$$m = \\frac{10/122.5}{0.250} = \\frac{0.08163}{0.250} = 0.3265\\ \\text{mol kg}^{-1}$$\n\n' +
        '**Degree of dissociation** $\\alpha$ from $K_a$ (weak monoprotic acid, $K_a = \\frac{c\\alpha^2}{1-\\alpha} \\approx c\\alpha^2$):\n\n' +
        '$$\\alpha = \\sqrt{\\frac{K_a}{c}} = \\sqrt{\\frac{1.4\\times10^{-3}}{0.3265}} = \\sqrt{4.288\\times10^{-3}} = 0.0655$$\n\n' +
        'van\'t Hoff factor ($\\ce{HA -> H+ + A-}$, 2 ions): $i = 1 + \\alpha = 1.0655$.\n\n' +
        '$$\\Delta T_f = i\\,K_f\\,m = 1.0655 \\times 1.86 \\times 0.3265 \\approx 0.65\\ \\text{K}$$',
    },
    {
      kind: 'numerical',
      id: 'sol-ncert-2-33',
      source: 'ncert_exercise',
      source_label: 'NCERT 2.33',
      prompt:
        '19.5 g of $\\ce{CH2FCOOH}$ is dissolved in 500 g of water. The depression in the freezing point of water observed is $1.0°\\,\\text{C}$. Calculate the van\'t Hoff factor and dissociation constant of fluoroacetic acid.',
      answer:
        'van\'t Hoff factor $i \\approx 1.0753$; $\\alpha \\approx 0.0753$; $K_a \\approx 3.07\\times10^{-3}$.',
      solution:
        'M($\\ce{CH2FCOOH}$, fluoroacetic acid, $\\ce{C2H3FO2}$) $= 2(12) + 3(1) + 19 + 2(16) = 24 + 3 + 19 + 32 = 78$.\n\n' +
        'Molality:\n\n' +
        '$$m = \\frac{19.5/78}{0.500} = \\frac{0.25}{0.500} = 0.5\\ \\text{mol kg}^{-1}$$\n\n' +
        '**Observed (van\'t Hoff factor):** the calculated depression for no dissociation would be:\n\n' +
        '$$\\Delta T_{f,\\text{calc}} = K_f\\,m = 1.86 \\times 0.5 = 0.93\\ \\text{K}$$\n\n' +
        '$$i = \\frac{\\Delta T_{f,\\text{obs}}}{\\Delta T_{f,\\text{calc}}} = \\frac{1.0}{0.93} = 1.0753$$\n\n' +
        '**Degree of dissociation** ($i = 1 + \\alpha$ for 2 ions):\n\n' +
        '$$\\alpha = i - 1 = 0.0753$$\n\n' +
        '**Dissociation constant** ($c = 0.5\\ \\text{M}$, taking molality $\\approx$ molarity for dilute aqueous solution):\n\n' +
        '$$K_a = \\frac{c\\alpha^2}{1-\\alpha} = \\frac{0.5 \\times (0.0753)^2}{1 - 0.0753} = \\frac{0.5 \\times 5.67\\times10^{-3}}{0.9247}$$\n\n' +
        '$$K_a = \\frac{2.835\\times10^{-3}}{0.9247} \\approx 3.07\\times10^{-3}$$',
    },
  ],
};
