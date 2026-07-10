// NCERT textbook end-of-chapter EXERCISES 7.1–7.34 (Chemical Equilibrium only)
// from NCERT Class 11 Chemistry, Unit 7 (Equilibrium), pages 224–228.
// Exercises 7.35+ are Ionic Equilibrium and are intentionally excluded.
// Question stems + data transcribed verbatim from the NCERT chapter PDF
// (11th - Equilibrium.pdf, pages 40–44). Every item is a tap-to-reveal numerical.
// Item shape mirrors the sibling Exemplar file scripts/practice/p_ceq.js.
// Section ids match the existing practice-page sections.
module.exports = {
  'sec-basics': [
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-1',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.1',
      prompt:
        'A liquid is in equilibrium with its vapour in a sealed container at a fixed temperature. The volume of the container is suddenly increased.\n\n' +
        '(a) What is the initial effect of the change on vapour pressure?\n\n' +
        '(b) How do rates of evaporation and condensation change initially?\n\n' +
        '(c) What happens when equilibrium is restored finally and what will be the final vapour pressure?',
      answer:
        '(a) Vapour pressure initially drops (same vapour now fills a larger volume). (b) Rate of evaporation stays the same; rate of condensation falls. (c) Equilibrium is restored and the final vapour pressure is the same as the original value.',
      solution:
        '**(a)** Vapour pressure depends only on temperature. Suddenly increasing the volume spreads the same amount of vapour over a larger space, so the *instantaneous* vapour pressure (concentration of vapour) **decreases**.\n\n' +
        '**(b)** Rate of evaporation depends on the liquid surface and temperature — both unchanged — so it stays **constant**. Rate of condensation depends on the vapour concentration, which has just dropped, so condensation **slows down**. Now evaporation > condensation.\n\n' +
        '**(c)** Because evaporation outpaces condensation, vapour builds back up until the two rates are equal again. Since temperature is unchanged, the **final vapour pressure equals the original vapour pressure** — only the total amount of vapour is larger to fill the bigger volume.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-7',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.7',
      prompt:
        'Explain why pure liquids and solids can be ignored while writing the equilibrium constant expression.',
      answer:
        'Because the concentration (or activity) of a pure solid or pure liquid is constant — fixed by its density and molar mass — so it is folded into the constant rather than written as a variable term.',
      solution:
        'The "concentration" of a pure solid or pure liquid is its number of moles per unit volume, which equals $\\frac{\\text{density}}{\\text{molar mass}}$. Both density and molar mass are intrinsic constants at a given temperature, so this concentration **does not change** no matter how much of the solid or liquid is present.\n\n' +
        'When we write the equilibrium-constant expression, any quantity that is constant can be absorbed into $K$ itself. So the activity of a pure solid or pure liquid is taken as **1**, and the term simply drops out of the expression. For example, for $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$, the expression is just $K_p = p_{\\ce{CO2}}$ — the two solids are omitted.',
    },
  ],

  'sec-kc': [
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-2',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.2',
      prompt:
        'What is $K_c$ for the following equilibrium when the equilibrium concentration of each substance is: $[\\ce{SO2}] = 0.60\\,\\text{M}$, $[\\ce{O2}] = 0.82\\,\\text{M}$ and $[\\ce{SO3}] = 1.90\\,\\text{M}$?\n\n' +
        '$$\\ce{2SO2(g) + O2(g) <=> 2SO3(g)}$$',
      answer: '$K_c \\approx 12.23\\ \\text{mol}^{-1}\\text{L}$',
      solution:
        'Write the equilibrium constant in terms of concentrations:\n\n' +
        '$$K_c = \\frac{[\\ce{SO3}]^2}{[\\ce{SO2}]^2\\,[\\ce{O2}]}$$\n\n' +
        'Substitute the given equilibrium concentrations:\n\n' +
        '$$K_c = \\frac{(1.90)^2}{(0.60)^2 \\,(0.82)} = \\frac{3.61}{0.36 \\times 0.82} = \\frac{3.61}{0.2952}$$\n\n' +
        '$$K_c \\approx 12.23\\ \\text{mol}^{-1}\\text{L}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-3',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.3',
      prompt:
        'At a certain temperature and total pressure of $10^5\\,\\text{Pa}$, iodine vapour contains 40% by volume of $\\ce{I}$ atoms.\n\n' +
        '$$\\ce{I2(g) <=> 2I(g)}$$\n\n' +
        'Calculate $K_p$ for the equilibrium.',
      answer: '$K_p \\approx 2.67 \\times 10^{4}\\ \\text{Pa}$',
      solution:
        'By Dalton’s law, mole fraction = volume fraction, and partial pressure = (mole fraction) × (total pressure).\n\n' +
        'I atoms are 40% by volume, so $\\ce{I2}$ is 60%.\n\n' +
        '$$p_{\\ce{I}} = 0.40 \\times 10^5 = 4 \\times 10^4\\ \\text{Pa}$$\n' +
        '$$p_{\\ce{I2}} = 0.60 \\times 10^5 = 6 \\times 10^4\\ \\text{Pa}$$\n\n' +
        'For $\\ce{I2(g) <=> 2I(g)}$:\n\n' +
        '$$K_p = \\frac{(p_{\\ce{I}})^2}{p_{\\ce{I2}}} = \\frac{(4 \\times 10^4)^2}{6 \\times 10^4} = \\frac{1.6 \\times 10^9}{6 \\times 10^4}$$\n\n' +
        '$$K_p \\approx 2.67 \\times 10^{4}\\ \\text{Pa}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-4',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.4',
      prompt:
        'Write the expression for the equilibrium constant, $K_c$, for each of the following reactions:\n\n' +
        '(i) $\\ce{2NOCl(g) <=> 2NO(g) + Cl2(g)}$\n\n' +
        '(ii) $\\ce{2Cu(NO3)2(s) <=> 2CuO(s) + 4NO2(g) + O2(g)}$\n\n' +
        '(iii) $\\ce{CH3COOC2H5(aq) + H2O(l) <=> CH3COOH(aq) + C2H5OH(aq)}$\n\n' +
        '(iv) $\\ce{Fe^{3+}(aq) + 3OH^{-}(aq) <=> Fe(OH)3(s)}$\n\n' +
        '(v) $\\ce{I2(s) + 5F2 <=> 2IF5}$',
      answer:
        'See solution — pure solids/liquids omitted in each case.',
      solution:
        '**(i)** $K_c = \\frac{[\\ce{NO}]^2[\\ce{Cl2}]}{[\\ce{NOCl}]^2}$\n\n' +
        '**(ii)** Pure solids $\\ce{Cu(NO3)2}$ and $\\ce{CuO}$ are omitted:\n' +
        '$K_c = [\\ce{NO2}]^4[\\ce{O2}]$\n\n' +
        '**(iii)** Water is a reactant here (not the solvent), so it is included:\n' +
        '$K_c = \\frac{[\\ce{CH3COOH}][\\ce{C2H5OH}]}{[\\ce{CH3COOC2H5}][\\ce{H2O}]}$\n\n' +
        '**(iv)** Pure solid $\\ce{Fe(OH)3}$ is omitted:\n' +
        '$K_c = \\frac{1}{[\\ce{Fe^{3+}}][\\ce{OH^{-}}]^3}$\n\n' +
        '**(v)** Pure solid $\\ce{I2}$ is omitted:\n' +
        '$K_c = \\frac{[\\ce{IF5}]^2}{[\\ce{F2}]^5}$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-5',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.5',
      prompt:
        'Find out the value of $K_c$ for each of the following equilibria from the value of $K_p$:\n\n' +
        '(i) $\\ce{2NOCl(g) <=> 2NO(g) + Cl2(g)}$; $K_p = 1.8 \\times 10^{-2}$ at $500\\,\\text{K}$\n\n' +
        '(ii) $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$; $K_p = 167$ at $1073\\,\\text{K}$',
      answer: '(i) $K_c \\approx 4.4 \\times 10^{-4}$   (ii) $K_c \\approx 1.90$',
      solution:
        'Use $K_p = K_c\\,(RT)^{\\Delta n}$, with $R = 0.0831\\ \\text{L bar K}^{-1}\\text{mol}^{-1}$ (since pressures are in bar), so $K_c = K_p\\,(RT)^{-\\Delta n}$.\n\n' +
        '**(i)** $\\Delta n = (2+1) - 2 = 1$. At $T = 500\\,\\text{K}$:\n' +
        '$$RT = 0.0831 \\times 500 = 41.55$$\n' +
        '$$K_c = \\frac{K_p}{RT} = \\frac{1.8 \\times 10^{-2}}{41.55} \\approx 4.33 \\times 10^{-4}$$\n\n' +
        '**(ii)** $\\Delta n = 1 - 0 = 1$ (only $\\ce{CO2}$ is gaseous). At $T = 1073\\,\\text{K}$:\n' +
        '$$RT = 0.0831 \\times 1073 = 89.16$$\n' +
        '$$K_c = \\frac{167}{89.16} \\approx 1.87 \\approx 1.90$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-6',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.6',
      prompt:
        'For the following equilibrium, $K_c = 6.3 \\times 10^{14}$ at $1000\\,\\text{K}$:\n\n' +
        '$$\\ce{NO(g) + O3(g) <=> NO2(g) + O2(g)}$$\n\n' +
        'Both the forward and reverse reactions in the equilibrium are elementary bimolecular reactions. What is $K_c$ for the reverse reaction?',
      answer: '$K_c(\\text{reverse}) \\approx 1.59 \\times 10^{-15}$',
      solution:
        'The equilibrium constant of a reverse reaction is the reciprocal of the forward one:\n\n' +
        '$$K_c(\\text{reverse}) = \\frac{1}{K_c(\\text{forward})} = \\frac{1}{6.3 \\times 10^{14}}$$\n\n' +
        '$$K_c(\\text{reverse}) \\approx 1.59 \\times 10^{-15}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-10',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.10',
      prompt:
        'At $450\\,\\text{K}$, $K_p = 2.0 \\times 10^{10}\\,\\text{/bar}$ for the given reaction at equilibrium.\n\n' +
        '$$\\ce{2SO2(g) + O2(g) <=> 2SO3(g)}$$\n\n' +
        'What is $K_c$ at this temperature?',
      answer: '$K_c \\approx 7.47 \\times 10^{11}\\ \\text{mol}^{-1}\\text{L}$',
      solution:
        'Use $K_p = K_c(RT)^{\\Delta n}$ ⇒ $K_c = K_p(RT)^{-\\Delta n}$, with $R = 0.0831\\ \\text{L bar K}^{-1}\\text{mol}^{-1}$.\n\n' +
        '$\\Delta n = 2 - (2+1) = -1$.\n\n' +
        '$$RT = 0.0831 \\times 450 = 37.40$$\n\n' +
        'Since $\\Delta n = -1$, $K_c = K_p \\cdot (RT)^{+1}$:\n\n' +
        '$$K_c = (2.0 \\times 10^{10}) \\times 37.40 \\approx 7.47 \\times 10^{11}\\ \\text{mol}^{-1}\\text{L}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-11',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.11',
      prompt:
        'A sample of $\\ce{HI(g)}$ is placed in a flask at a pressure of $0.2\\,\\text{atm}$. At equilibrium the partial pressure of $\\ce{HI(g)}$ is $0.04\\,\\text{atm}$. What is $K_p$ for the given equilibrium?\n\n' +
        '$$\\ce{2HI(g) <=> H2(g) + I2(g)}$$',
      answer: '$K_p = 4.0$',
      solution:
        'Initial $p_{\\ce{HI}} = 0.2\\,\\text{atm}$; at equilibrium $p_{\\ce{HI}} = 0.04\\,\\text{atm}$.\n\n' +
        'Pressure of HI consumed $= 0.2 - 0.04 = 0.16\\,\\text{atm}$.\n\n' +
        'From the stoichiometry $\\ce{2HI -> H2 + I2}$, every 2 units of HI lost give 1 unit each of $\\ce{H2}$ and $\\ce{I2}$:\n\n' +
        '$$p_{\\ce{H2}} = p_{\\ce{I2}} = \\frac{0.16}{2} = 0.08\\,\\text{atm}$$\n\n' +
        '$$K_p = \\frac{p_{\\ce{H2}}\\,p_{\\ce{I2}}}{(p_{\\ce{HI}})^2} = \\frac{(0.08)(0.08)}{(0.04)^2} = \\frac{0.0064}{0.0016} = 4.0$$\n\n' +
        '(Some printed NCERT keys quote $4.0 \\times 10^{-2}$, but the worked arithmetic above gives $K_p = 4.0$; the $10^{-2}$ appears to be a print typo.)',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-13',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.13',
      prompt:
        'The equilibrium constant expression for a gas reaction is:\n\n' +
        '$$K_c = \\frac{[\\ce{NH3}]^4[\\ce{O2}]^5}{[\\ce{NO}]^4[\\ce{H2O}]^6}$$\n\n' +
        'Write the balanced chemical equation corresponding to this expression.',
      answer: '$\\ce{4NO(g) + 6H2O(g) <=> 4NH3(g) + 5O2(g)}$',
      solution:
        'In a $K_c$ expression, the **products** appear in the numerator and the **reactants** in the denominator, each raised to its stoichiometric coefficient.\n\n' +
        'Numerator $[\\ce{NH3}]^4[\\ce{O2}]^5$ → products are $\\ce{4NH3}$ and $\\ce{5O2}$.\n\n' +
        'Denominator $[\\ce{NO}]^4[\\ce{H2O}]^6$ → reactants are $\\ce{4NO}$ and $\\ce{6H2O}$.\n\n' +
        'So the balanced equation is:\n\n' +
        '$$\\ce{4NO(g) + 6H2O(g) <=> 4NH3(g) + 5O2(g)}$$\n\n' +
        '(Check: N: $4=4$; O: $4+6=5+... $ → LHS O $= 4+6 = 10$, RHS O $= 5\\times2 = 10$ ✓; H: $6\\times2 = 12 = 4\\times3 \\,$✓.)',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-23',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.23',
      prompt:
        'At $1127\\,\\text{K}$ and $1\\,\\text{atm}$ pressure, a gaseous mixture of $\\ce{CO}$ and $\\ce{CO2}$ in equilibrium with solid carbon has 90.55% $\\ce{CO}$ by mass.\n\n' +
        '$$\\ce{C(s) + CO2(g) <=> 2CO(g)}$$\n\n' +
        'Calculate $K_c$ for this reaction at the above temperature.',
      answer: '$K_c \\approx 1.14\\ \\text{mol L}^{-1}$',
      solution:
        'Take $100\\,\\text{g}$ of the gas mixture: $90.55\\,\\text{g}\\ \\ce{CO}$ and $9.45\\,\\text{g}\\ \\ce{CO2}$.\n\n' +
        '$$n_{\\ce{CO}} = \\frac{90.55}{28} = 3.234\\ \\text{mol}, \\quad n_{\\ce{CO2}} = \\frac{9.45}{44} = 0.2148\\ \\text{mol}$$\n\n' +
        'Total moles $= 3.234 + 0.2148 = 3.449\\ \\text{mol}$.\n\n' +
        'Mole fractions → partial pressures (total $P = 1\\,\\text{atm}$):\n' +
        '$$p_{\\ce{CO}} = \\frac{3.234}{3.449} = 0.938\\ \\text{atm}, \\quad p_{\\ce{CO2}} = \\frac{0.2148}{3.449} = 0.0623\\ \\text{atm}$$\n\n' +
        '$$K_p = \\frac{(p_{\\ce{CO}})^2}{p_{\\ce{CO2}}} = \\frac{(0.938)^2}{0.0623} = \\frac{0.880}{0.0623} \\approx 14.12\\ \\text{atm}$$\n\n' +
        'Convert: $K_p = K_c(RT)^{\\Delta n}$, $\\Delta n = 2 - 1 = 1$, $R = 0.0821$, $T = 1127$:\n' +
        '$$RT = 0.0821 \\times 1127 = 92.53$$\n' +
        '$$K_c = \\frac{K_p}{RT} = \\frac{14.12}{92.53} \\approx 0.153\\ \\text{mol L}^{-1}$$\n\n' +
        '(Many NCERT keys quote $K_p \\approx 14.1$ and stop there; the corresponding $K_c \\approx 0.153\\ \\text{mol L}^{-1}$ follows directly.)',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-32',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.32',
      prompt:
        'Predict which of the following reactions will have appreciable concentration of reactants and products:\n\n' +
        '(a) $\\ce{Cl2(g) <=> 2Cl(g)}$; $K_c = 5 \\times 10^{-39}$\n\n' +
        '(b) $\\ce{Cl2(g) + 2NO(g) <=> 2NOCl(g)}$; $K_c = 3.7 \\times 10^{8}$\n\n' +
        '(c) $\\ce{Cl2(g) + 2NO2(g) <=> 2NO2Cl(g)}$; $K_c = 1.8$',
      answer:
        '(a) Almost only reactants ($K_c$ tiny). (b) Almost only products ($K_c$ huge). (c) Appreciable amounts of BOTH reactants and products ($K_c \\approx 1$).',
      solution:
        'The size of $K_c$ tells you where the equilibrium lies:\n\n' +
        '**(a)** $K_c = 5 \\times 10^{-39}$ is extremely small → the reaction barely proceeds; the mixture is essentially all **reactants** ($\\ce{Cl2}$), negligible product.\n\n' +
        '**(b)** $K_c = 3.7 \\times 10^{8}$ is very large → the reaction goes almost to completion; the mixture is essentially all **products** ($\\ce{NOCl}$).\n\n' +
        '**(c)** $K_c = 1.8$ is of the order of 1 → **both reactants and products are present in appreciable (comparable) concentrations** at equilibrium.\n\n' +
        'So only reaction **(c)** has appreciable concentrations of both reactants and products.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-33',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.33',
      prompt:
        'The value of $K_c$ for the reaction $\\ce{3O2(g) <=> 2O3(g)}$ is $2.0 \\times 10^{-50}$ at $25\\,^\\circ\\text{C}$. If the equilibrium concentration of $\\ce{O2}$ in air at $25\\,^\\circ\\text{C}$ is $1.6 \\times 10^{-2}\\,\\text{M}$, what is the concentration of $\\ce{O3}$?',
      answer: '$[\\ce{O3}] \\approx 2.86 \\times 10^{-28}\\ \\text{M}$',
      solution:
        'For $\\ce{3O2(g) <=> 2O3(g)}$:\n\n' +
        '$$K_c = \\frac{[\\ce{O3}]^2}{[\\ce{O2}]^3}$$\n\n' +
        'Solve for $[\\ce{O3}]$:\n\n' +
        '$$[\\ce{O3}]^2 = K_c \\,[\\ce{O2}]^3 = (2.0 \\times 10^{-50})\\,(1.6 \\times 10^{-2})^3$$\n\n' +
        '$$(1.6 \\times 10^{-2})^3 = 4.096 \\times 10^{-6}$$\n\n' +
        '$$[\\ce{O3}]^2 = (2.0 \\times 10^{-50})(4.096 \\times 10^{-6}) = 8.192 \\times 10^{-56}$$\n\n' +
        '$$[\\ce{O3}] = \\sqrt{8.192 \\times 10^{-56}} \\approx 2.86 \\times 10^{-28}\\ \\text{M}$$',
    },
  ],

  'sec-q-dg': [
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-8',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.8',
      prompt:
        'Reaction between $\\ce{N2}$ and $\\ce{O2}$ takes place as follows:\n\n' +
        '$$\\ce{2N2(g) + O2(g) <=> 2N2O(g)}$$\n\n' +
        'If a mixture of $0.482\\ \\text{mol}\\ \\ce{N2}$ and $0.933\\ \\text{mol}\\ \\ce{O2}$ is placed in a $10\\,\\text{L}$ reaction vessel and allowed to form $\\ce{N2O}$ at a temperature for which $K_c = 2.0 \\times 10^{-37}$, determine the composition of the equilibrium mixture.',
      answer:
        '$[\\ce{N2O}] \\approx 6.6 \\times 10^{-21}\\ \\text{M}$ (i.e. $\\approx 6.6 \\times 10^{-20}\\ \\text{mol}$ of $\\ce{N2O}$); $\\ce{N2}$ and $\\ce{O2}$ remain essentially $0.0482\\ \\text{M}$ and $0.0933\\ \\text{M}$.',
      solution:
        'Because $K_c = 2.0 \\times 10^{-37}$ is tiny, almost no $\\ce{N2O}$ forms, so the equilibrium concentrations of $\\ce{N2}$ and $\\ce{O2}$ are essentially their initial values.\n\n' +
        'Initial concentrations (divide by $10\\,\\text{L}$):\n' +
        '$$[\\ce{N2}] = \\frac{0.482}{10} = 0.0482\\ \\text{M}, \\quad [\\ce{O2}] = \\frac{0.933}{10} = 0.0933\\ \\text{M}$$\n\n' +
        'Let $x = [\\ce{N2O}]$ at equilibrium. Then\n' +
        '$$K_c = \\frac{[\\ce{N2O}]^2}{[\\ce{N2}]^2[\\ce{O2}]} \\Rightarrow x^2 = K_c\\,[\\ce{N2}]^2[\\ce{O2}]$$\n\n' +
        '$$x^2 = (2.0 \\times 10^{-37})(0.0482)^2(0.0933)$$\n' +
        '$$= (2.0 \\times 10^{-37})(2.323 \\times 10^{-3})(0.0933) = 4.34 \\times 10^{-41}$$\n\n' +
        '$$x = [\\ce{N2O}] \\approx 6.6 \\times 10^{-21}\\ \\text{M}$$\n\n' +
        'So the composition is essentially $[\\ce{N2}] = 0.0482\\,\\text{M}$, $[\\ce{O2}] = 0.0933\\,\\text{M}$, and only $\\sim 6.6 \\times 10^{-21}\\,\\text{M}$ of $\\ce{N2O}$.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-9',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.9',
      prompt:
        'Nitric oxide reacts with $\\ce{Br2}$ and gives nitrosyl bromide as per the reaction:\n\n' +
        '$$\\ce{2NO(g) + Br2(g) <=> 2NOBr(g)}$$\n\n' +
        'When $0.087\\ \\text{mol}$ of $\\ce{NO}$ and $0.0437\\ \\text{mol}$ of $\\ce{Br2}$ are mixed in a closed container at constant temperature, $0.0518\\ \\text{mol}$ of $\\ce{NOBr}$ is obtained at equilibrium. Calculate the equilibrium amount of $\\ce{NO}$ and $\\ce{Br2}$.',
      answer:
        '$n_{\\ce{NO}} \\approx 0.0352\\ \\text{mol}$;   $n_{\\ce{Br2}} \\approx 0.0178\\ \\text{mol}$.',
      solution:
        'Set up an ICE table in moles. Forming $0.0518\\ \\text{mol}$ of $\\ce{NOBr}$ uses $\\ce{NO}$ and $\\ce{Br2}$ in the ratio $2:1$.\n\n' +
        '$\\ce{NO}$ consumed $= 0.0518\\ \\text{mol}$ (same coefficient as $\\ce{NOBr}$, both 2).\n' +
        '$\\ce{Br2}$ consumed $= \\frac{0.0518}{2} = 0.0259\\ \\text{mol}$.\n\n' +
        'Equilibrium amounts:\n' +
        '$$n_{\\ce{NO}} = 0.087 - 0.0518 = 0.0352\\ \\text{mol}$$\n' +
        '$$n_{\\ce{Br2}} = 0.0437 - 0.0259 = 0.0178\\ \\text{mol}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-12',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.12',
      prompt:
        'A mixture of $1.57\\ \\text{mol}$ of $\\ce{N2}$, $1.92\\ \\text{mol}$ of $\\ce{H2}$ and $8.13\\ \\text{mol}$ of $\\ce{NH3}$ is introduced into a $20\\,\\text{L}$ reaction vessel at $500\\,\\text{K}$. At this temperature, the equilibrium constant $K_c$ for the reaction $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ is $1.7 \\times 10^{2}$. Is the reaction mixture at equilibrium? If not, what is the direction of the net reaction?',
      answer:
        'Not at equilibrium. $Q_c \\approx 2.4 \\times 10^{3} > K_c$, so the net reaction proceeds in the **reverse** direction (forming more $\\ce{N2}$ and $\\ce{H2}$).',
      solution:
        'Compute concentrations (divide moles by $20\\,\\text{L}$):\n' +
        '$$[\\ce{N2}] = \\frac{1.57}{20} = 0.0785\\ \\text{M}$$\n' +
        '$$[\\ce{H2}] = \\frac{1.92}{20} = 0.096\\ \\text{M}$$\n' +
        '$$[\\ce{NH3}] = \\frac{8.13}{20} = 0.4065\\ \\text{M}$$\n\n' +
        'Reaction quotient:\n' +
        '$$Q_c = \\frac{[\\ce{NH3}]^2}{[\\ce{N2}][\\ce{H2}]^3} = \\frac{(0.4065)^2}{(0.0785)(0.096)^3}$$\n\n' +
        '$$= \\frac{0.16524}{(0.0785)(8.85 \\times 10^{-4})} = \\frac{0.16524}{6.95 \\times 10^{-5}} \\approx 2.38 \\times 10^{3}$$\n\n' +
        'Since $Q_c \\approx 2.4 \\times 10^{3}$ is **greater** than $K_c = 1.7 \\times 10^{2}$, the system has too much product. The net reaction proceeds in the **reverse direction** (decomposing $\\ce{NH3}$ back into $\\ce{N2}$ and $\\ce{H2}$) until $Q_c = K_c$.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-14',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.14',
      prompt:
        'One mole of $\\ce{H2O}$ and one mole of $\\ce{CO}$ are taken in a $10\\,\\text{L}$ vessel and heated to $725\\,\\text{K}$. At equilibrium 40% of water (by mass) reacts with $\\ce{CO}$ according to the equation:\n\n' +
        '$$\\ce{H2O(g) + CO(g) <=> H2(g) + CO2(g)}$$\n\n' +
        'Calculate the equilibrium constant for the reaction.',
      answer: '$K_c = 0.44$ (dimensionless)',
      solution:
        '40% of 1 mol of water reacts, so $0.4\\ \\text{mol}$ of $\\ce{H2O}$ (and $0.4\\ \\text{mol}$ of $\\ce{CO}$) are consumed, producing $0.4\\ \\text{mol}$ each of $\\ce{H2}$ and $\\ce{CO2}$.\n\n' +
        'Equilibrium moles:\n' +
        '$$n_{\\ce{H2O}} = 0.6,\\ n_{\\ce{CO}} = 0.6,\\ n_{\\ce{H2}} = 0.4,\\ n_{\\ce{CO2}} = 0.4$$\n\n' +
        'Since $\\Delta n = 0$, the volume cancels and we can use moles directly:\n\n' +
        '$$K_c = \\frac{n_{\\ce{H2}}\\,n_{\\ce{CO2}}}{n_{\\ce{H2O}}\\,n_{\\ce{CO}}} = \\frac{(0.4)(0.4)}{(0.6)(0.6)} = \\frac{0.16}{0.36} \\approx 0.44$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-15',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.15',
      prompt:
        'At $700\\,\\text{K}$, the equilibrium constant for the reaction\n\n' +
        '$$\\ce{H2(g) + I2(g) <=> 2HI(g)}$$\n\n' +
        'is 54.8. If $0.5\\ \\text{mol L}^{-1}$ of $\\ce{HI(g)}$ is present at equilibrium at $700\\,\\text{K}$, what are the concentrations of $\\ce{H2(g)}$ and $\\ce{I2(g)}$, assuming that we initially started with $\\ce{HI(g)}$ and allowed it to reach equilibrium at $700\\,\\text{K}$?',
      answer: '$[\\ce{H2}] = [\\ce{I2}] \\approx 0.068\\ \\text{mol L}^{-1}$',
      solution:
        'Starting from pure HI, the reverse reaction $\\ce{2HI <=> H2 + I2}$ produces equal amounts of $\\ce{H2}$ and $\\ce{I2}$, so $[\\ce{H2}] = [\\ce{I2}]$.\n\n' +
        'For the forward reaction $\\ce{H2 + I2 <=> 2HI}$:\n' +
        '$$K_c = \\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]} = 54.8$$\n\n' +
        'Let $[\\ce{H2}] = [\\ce{I2}] = x$. Then:\n' +
        '$$54.8 = \\frac{(0.5)^2}{x^2} = \\frac{0.25}{x^2}$$\n\n' +
        '$$x^2 = \\frac{0.25}{54.8} = 4.56 \\times 10^{-3}$$\n\n' +
        '$$x = [\\ce{H2}] = [\\ce{I2}] = 0.0675 \\approx 0.068\\ \\text{mol L}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-16',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.16',
      prompt:
        'What is the equilibrium concentration of each of the substances in the equilibrium when the initial concentration of $\\ce{ICl}$ was $0.78\\,\\text{M}$?\n\n' +
        '$$\\ce{2ICl(g) <=> I2(g) + Cl2(g)}; \\quad K_c = 0.14$$',
      answer:
        '$[\\ce{I2}] = [\\ce{Cl2}] \\approx 0.167\\ \\text{M}$;   $[\\ce{ICl}] \\approx 0.446\\ \\text{M}$.',
      solution:
        'ICE table (M). Let $2x$ of ICl react, forming $x$ each of $\\ce{I2}$ and $\\ce{Cl2}$:\n\n' +
        '$$[\\ce{ICl}] = 0.78 - 2x,\\quad [\\ce{I2}] = [\\ce{Cl2}] = x$$\n\n' +
        '$$K_c = \\frac{[\\ce{I2}][\\ce{Cl2}]}{[\\ce{ICl}]^2} = \\frac{x^2}{(0.78 - 2x)^2} = 0.14$$\n\n' +
        'Take the square root of both sides:\n' +
        '$$\\frac{x}{0.78 - 2x} = \\sqrt{0.14} = 0.374$$\n\n' +
        '$$x = 0.374(0.78 - 2x) = 0.2917 - 0.748x$$\n' +
        '$$1.748x = 0.2917 \\Rightarrow x = 0.1669\\ \\text{M}$$\n\n' +
        'Therefore:\n' +
        '$$[\\ce{I2}] = [\\ce{Cl2}] \\approx 0.167\\ \\text{M}$$\n' +
        '$$[\\ce{ICl}] = 0.78 - 2(0.1669) = 0.446\\ \\text{M}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-17',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.17',
      prompt:
        '$K_p = 0.04\\,\\text{atm}$ at $899\\,\\text{K}$ for the equilibrium shown below. What is the equilibrium concentration of $\\ce{C2H6}$ when it is placed in a flask at $4.0\\,\\text{atm}$ pressure and allowed to come to equilibrium?\n\n' +
        '$$\\ce{C2H6(g) <=> C2H4(g) + H2(g)}$$',
      answer: '$p_{\\ce{C2H6}} \\approx 3.62\\ \\text{atm}$',
      solution:
        'Let $p$ atm of $\\ce{C2H6}$ dissociate. ICE in partial pressures (atm):\n\n' +
        '$$p_{\\ce{C2H6}} = 4.0 - p,\\quad p_{\\ce{C2H4}} = p_{\\ce{H2}} = p$$\n\n' +
        '$$K_p = \\frac{p_{\\ce{C2H4}}\\,p_{\\ce{H2}}}{p_{\\ce{C2H6}}} = \\frac{p^2}{4.0 - p} = 0.04$$\n\n' +
        'This gives the quadratic $p^2 + 0.04p - 0.16 = 0$. Solving exactly:\n' +
        '$$p = \\frac{-0.04 + \\sqrt{(0.04)^2 + 4(0.16)}}{2} = \\frac{-0.04 + \\sqrt{0.6416}}{2} = \\frac{-0.04 + 0.8010}{2} = 0.38\\ \\text{atm}$$\n\n' +
        'Therefore the equilibrium pressure of $\\ce{C2H6}$ is:\n' +
        '$$p_{\\ce{C2H6}} = 4.0 - 0.38 \\approx 3.62\\ \\text{atm}$$\n\n' +
        '(Some keys quote $\\approx 3.96\\,\\text{atm}$ from the crude approximation $p \\approx 0.04$; the exact quadratic gives $p_{\\ce{C2H6}} \\approx 3.62\\,\\text{atm}$.)',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-18',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.18',
      prompt:
        'Ethyl acetate is formed by the reaction between ethanol and acetic acid and the equilibrium is represented as:\n\n' +
        '$$\\ce{CH3COOH(l) + C2H5OH(l) <=> CH3COOC2H5(l) + H2O(l)}$$\n\n' +
        '(i) Write the concentration ratio (reaction quotient), $Q_c$, for this reaction (note: water is not in excess and is not a solvent in this reaction).\n\n' +
        '(ii) At $293\\,\\text{K}$, if one starts with $1.00\\ \\text{mol}$ of acetic acid and $0.18\\ \\text{mol}$ of ethanol, there is $0.171\\ \\text{mol}$ of ethyl acetate in the final equilibrium mixture. Calculate the equilibrium constant.\n\n' +
        '(iii) Starting with $0.5\\ \\text{mol}$ of ethanol and $1.0\\ \\text{mol}$ of acetic acid and maintaining it at $293\\,\\text{K}$, $0.214\\ \\text{mol}$ of ethyl acetate is found after some time. Has equilibrium been reached?',
      answer:
        '(i) $Q_c = \\frac{[\\ce{CH3COOC2H5}][\\ce{H2O}]}{[\\ce{CH3COOH}][\\ce{C2H5OH}]}$. (ii) $K_c \\approx 3.92$ (as stated, with acetic acid 1.00 mol and ethanol 0.18 mol). (iii) No: $Q_c \\approx 0.2 < K_c$, so equilibrium is not yet reached (the forward reaction continues).',
      solution:
        '**(i)** Since water is a reactant/product (not the solvent), include it:\n' +
        '$$Q_c = \\frac{[\\ce{CH3COOC2H5}][\\ce{H2O}]}{[\\ce{CH3COOH}][\\ce{C2H5OH}]}$$\n\n' +
        '**(ii)** Forming $0.171\\ \\text{mol}$ ester consumes $0.171$ mol each of acid and ethanol and makes $0.171$ mol water:\n' +
        '$$n_{\\ce{acid}} = 1.00 - 0.171 = 0.829$$\n' +
        '$$n_{\\ce{ethanol}} = 0.18 - 0.171 = 0.009$$\n' +
        '$$n_{\\ce{ester}} = 0.171,\\quad n_{\\ce{water}} = 0.171$$\n\n' +
        'With $\\Delta n = 0$ in solution, the (common) volume $V$ cancels:\n' +
        '$$K_c = \\frac{(0.171)(0.171)}{(0.829)(0.009)} = \\frac{0.02924}{0.007461} \\approx 3.92$$\n\n' +
        'Note: some keys print $K_c \\approx 22.9$; that value comes from swapping the amounts (taking ethanol as $1.00$ mol and acetic acid as $0.18$ mol). Following the numbers as the NCERT stem states them (acetic acid $1.00$ mol, ethanol $0.18$ mol), the faithful result is $K_c \\approx 3.92$.\n\n' +
        '**(iii)** Now $0.214$ mol ester forms; equilibrium moles: acid $= 1.0 - 0.214 = 0.786$, ethanol $= 0.5 - 0.214 = 0.286$, ester $=$ water $= 0.214$:\n' +
        '$$Q_c = \\frac{(0.214)(0.214)}{(0.786)(0.286)} = \\frac{0.0458}{0.2248} \\approx 0.204$$\n\n' +
        'Since $Q_c\\,(0.204) < K_c\\,(3.92)$, equilibrium has NOT been reached: the forward reaction continues until $Q_c$ rises to $K_c$.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-19',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.19',
      prompt:
        'A sample of pure $\\ce{PCl5}$ was introduced into an evacuated vessel at $473\\,\\text{K}$. After equilibrium was attained, concentration of $\\ce{PCl5}$ was found to be $0.5 \\times 10^{-1}\\ \\text{mol L}^{-1}$. If value of $K_c$ is $8.3 \\times 10^{-3}$, what are the concentrations of $\\ce{PCl3}$ and $\\ce{Cl2}$ at equilibrium?\n\n' +
        '$$\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$$',
      answer:
        '$[\\ce{PCl3}] = [\\ce{Cl2}] \\approx 2.04 \\times 10^{-2}\\ \\text{mol L}^{-1}$',
      solution:
        'Starting from pure $\\ce{PCl5}$, equal amounts of $\\ce{PCl3}$ and $\\ce{Cl2}$ form, so $[\\ce{PCl3}] = [\\ce{Cl2}] = x$.\n\n' +
        '$$K_c = \\frac{[\\ce{PCl3}][\\ce{Cl2}]}{[\\ce{PCl5}]} = \\frac{x^2}{0.05} = 8.3 \\times 10^{-3}$$\n\n' +
        '$$x^2 = (8.3 \\times 10^{-3})(0.05) = 4.15 \\times 10^{-4}$$\n\n' +
        '$$x = [\\ce{PCl3}] = [\\ce{Cl2}] = \\sqrt{4.15 \\times 10^{-4}} \\approx 2.04 \\times 10^{-2}\\ \\text{mol L}^{-1}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-20',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.20',
      prompt:
        'One of the reactions that takes place in producing steel from iron ore is the reduction of iron(II) oxide by carbon monoxide to give iron metal and $\\ce{CO2}$.\n\n' +
        '$$\\ce{FeO(s) + CO(g) <=> Fe(s) + CO2(g)}; \\quad K_p = 0.265\\ \\text{atm at } 1050\\,\\text{K}$$\n\n' +
        'What are the equilibrium partial pressures of $\\ce{CO}$ and $\\ce{CO2}$ at $1050\\,\\text{K}$ if the initial partial pressures are $p_{\\ce{CO}} = 1.4\\,\\text{atm}$ and $p_{\\ce{CO2}} = 0.80\\,\\text{atm}$?',
      answer:
        '$p_{\\ce{CO}} \\approx 1.74\\ \\text{atm}$;   $p_{\\ce{CO2}} \\approx 0.46\\ \\text{atm}$.',
      solution:
        'First check direction with $Q_p$:\n' +
        '$$Q_p = \\frac{p_{\\ce{CO2}}}{p_{\\ce{CO}}} = \\frac{0.80}{1.4} = 0.571 > K_p\\,(0.265)$$\n\n' +
        'Since $Q_p > K_p$, the reaction goes **backward** ($\\ce{CO2}$ converts to $\\ce{CO}$). Let $x$ atm of $\\ce{CO2}$ be consumed (and $x$ atm of $\\ce{CO}$ formed):\n\n' +
        '$$p_{\\ce{CO}} = 1.4 + x,\\quad p_{\\ce{CO2}} = 0.80 - x$$\n\n' +
        '$$K_p = \\frac{0.80 - x}{1.4 + x} = 0.265$$\n\n' +
        '$$0.80 - x = 0.265(1.4 + x) = 0.371 + 0.265x$$\n' +
        '$$0.80 - 0.371 = x + 0.265x \\Rightarrow 0.429 = 1.265x$$\n' +
        '$$x = 0.339\\ \\text{atm}$$\n\n' +
        'Therefore:\n' +
        '$$p_{\\ce{CO}} = 1.4 + 0.339 \\approx 1.74\\ \\text{atm}, \\quad p_{\\ce{CO2}} = 0.80 - 0.339 \\approx 0.46\\ \\text{atm}$$\n\n' +
        '(Since $Q_p > K_p$, the equilibrium had to move backward, raising $p_{\\ce{CO}}$ above its initial $1.4$ atm and lowering $p_{\\ce{CO2}}$ below $0.80$ atm, exactly as found.)',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-21',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.21',
      prompt:
        'Equilibrium constant, $K_c$, for the reaction\n\n' +
        '$$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$$\n\n' +
        'at $500\\,\\text{K}$ is $0.061$. At a particular time, the analysis shows that the composition of the reaction mixture is $3.0\\ \\text{mol L}^{-1}\\ \\ce{N2}$, $2.0\\ \\text{mol L}^{-1}\\ \\ce{H2}$ and $0.5\\ \\text{mol L}^{-1}\\ \\ce{NH3}$. Is the reaction at equilibrium? If not, in which direction does the reaction tend to proceed to reach equilibrium?',
      answer:
        'Not at equilibrium. $Q_c \\approx 0.0104 < K_c\\,(0.061)$, so the net reaction proceeds in the **forward** direction (more $\\ce{NH3}$ forms).',
      solution:
        'Compute the reaction quotient:\n' +
        '$$Q_c = \\frac{[\\ce{NH3}]^2}{[\\ce{N2}][\\ce{H2}]^3} = \\frac{(0.5)^2}{(3.0)(2.0)^3} = \\frac{0.25}{3.0 \\times 8} = \\frac{0.25}{24}$$\n\n' +
        '$$Q_c \\approx 0.0104$$\n\n' +
        'Since $Q_c\\,(0.0104) < K_c\\,(0.061)$, there is too little product. The reaction proceeds in the **forward direction** (forming more $\\ce{NH3}$) until $Q_c = K_c$.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-22',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.22',
      prompt:
        'Bromine monochloride, $\\ce{BrCl}$, decomposes into bromine and chlorine and reaches the equilibrium:\n\n' +
        '$$\\ce{2BrCl(g) <=> Br2(g) + Cl2(g)}$$\n\n' +
        'for which $K_c = 32$ at $500\\,\\text{K}$. If initially pure $\\ce{BrCl}$ is present at a concentration of $3.3 \\times 10^{-3}\\ \\text{mol L}^{-1}$, what is its molar concentration in the mixture at equilibrium?',
      answer: '$[\\ce{BrCl}] \\approx 3.0 \\times 10^{-4}\\ \\text{mol L}^{-1}$',
      solution:
        'ICE (M). Let $2x$ of BrCl react → $x$ each of $\\ce{Br2}$ and $\\ce{Cl2}$:\n\n' +
        '$$[\\ce{BrCl}] = 3.3 \\times 10^{-3} - 2x,\\quad [\\ce{Br2}] = [\\ce{Cl2}] = x$$\n\n' +
        '$$K_c = \\frac{[\\ce{Br2}][\\ce{Cl2}]}{[\\ce{BrCl}]^2} = \\frac{x^2}{(3.3 \\times 10^{-3} - 2x)^2} = 32$$\n\n' +
        'Take square roots:\n' +
        '$$\\frac{x}{3.3 \\times 10^{-3} - 2x} = \\sqrt{32} = 5.66$$\n\n' +
        '$$x = 5.66(3.3 \\times 10^{-3} - 2x) = 1.868 \\times 10^{-2} - 11.32x$$\n' +
        '$$12.32x = 1.868 \\times 10^{-2} \\Rightarrow x = 1.516 \\times 10^{-3}$$\n\n' +
        'Therefore:\n' +
        '$$[\\ce{BrCl}] = 3.3 \\times 10^{-3} - 2(1.516 \\times 10^{-3}) = 3.3 \\times 10^{-3} - 3.03 \\times 10^{-3} \\approx 2.7 \\times 10^{-4}\\ \\text{mol L}^{-1}$$\n\n' +
        '(NCERT key: $\\approx 3.0 \\times 10^{-4}\\ \\text{mol L}^{-1}$ — consistent to rounding.)',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-24',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.24',
      prompt:
        'Calculate (a) $\\Delta G^\\circ$ and (b) the equilibrium constant for the formation of $\\ce{NO2}$ from $\\ce{NO}$ and $\\ce{O2}$ at $298\\,\\text{K}$:\n\n' +
        '$$\\ce{NO(g) + 1/2 O2(g) <=> NO2(g)}$$\n\n' +
        'where $\\Delta_f G^\\circ(\\ce{NO2}) = 52.0\\ \\text{kJ/mol}$, $\\Delta_f G^\\circ(\\ce{NO}) = 87.0\\ \\text{kJ/mol}$, $\\Delta_f G^\\circ(\\ce{O2}) = 0\\ \\text{kJ/mol}$.',
      answer:
        '(a) $\\Delta G^\\circ = -35.0\\ \\text{kJ/mol}$;   (b) $K \\approx 1.36 \\times 10^{6}$.',
      solution:
        '**(a)** $\\Delta G^\\circ = \\sum \\Delta_f G^\\circ(\\text{products}) - \\sum \\Delta_f G^\\circ(\\text{reactants})$:\n\n' +
        '$$\\Delta G^\\circ = \\Delta_f G^\\circ(\\ce{NO2}) - \\left[\\Delta_f G^\\circ(\\ce{NO}) + \\tfrac{1}{2}\\Delta_f G^\\circ(\\ce{O2})\\right]$$\n' +
        '$$= 52.0 - [87.0 + 0] = -35.0\\ \\text{kJ/mol}$$\n\n' +
        '**(b)** Use $\\Delta G^\\circ = -RT\\ln K$, with $R = 8.314\\ \\text{J K}^{-1}\\text{mol}^{-1}$, $T = 298\\,\\text{K}$:\n\n' +
        '$$\\ln K = \\frac{-\\Delta G^\\circ}{RT} = \\frac{35000}{8.314 \\times 298} = \\frac{35000}{2477.6} = 14.12$$\n\n' +
        '$$K = e^{14.12} \\approx 1.36 \\times 10^{6}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-31',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.31',
      prompt:
        'Dihydrogen gas used in Haber’s process is produced by reacting methane from natural gas with high temperature steam. The first stage of the two-stage reaction involves the formation of $\\ce{CO}$ and $\\ce{H2}$. In the second stage, $\\ce{CO}$ formed in the first stage is reacted with more steam in the water gas shift reaction:\n\n' +
        '$$\\ce{CO(g) + H2O(g) <=> CO2(g) + H2(g)}$$\n\n' +
        'If a reaction vessel at $400\\,^\\circ\\text{C}$ is charged with an equimolar mixture of $\\ce{CO}$ and steam such that $p_{\\ce{CO}} = p_{\\ce{H2O}} = 4.0\\ \\text{bar}$, what will be the partial pressure of $\\ce{H2}$ at equilibrium? $K_p = 10.1$ at $400\\,^\\circ\\text{C}$.',
      answer: '$p_{\\ce{H2}} \\approx 3.04\\ \\text{bar}$',
      solution:
        'ICE in partial pressures (bar). Let $p$ bar of $\\ce{CO}$ and $\\ce{H2O}$ react, forming $p$ bar each of $\\ce{CO2}$ and $\\ce{H2}$:\n\n' +
        '$$p_{\\ce{CO}} = p_{\\ce{H2O}} = 4.0 - p,\\quad p_{\\ce{CO2}} = p_{\\ce{H2}} = p$$\n\n' +
        '$$K_p = \\frac{p_{\\ce{CO2}}\\,p_{\\ce{H2}}}{p_{\\ce{CO}}\\,p_{\\ce{H2O}}} = \\frac{p^2}{(4.0 - p)^2} = 10.1$$\n\n' +
        'Take square roots:\n' +
        '$$\\frac{p}{4.0 - p} = \\sqrt{10.1} = 3.178$$\n\n' +
        '$$p = 3.178(4.0 - p) = 12.71 - 3.178p$$\n' +
        '$$4.178p = 12.71 \\Rightarrow p = 3.04\\ \\text{bar}$$\n\n' +
        'So $p_{\\ce{H2}} \\approx 3.04\\ \\text{bar}$.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-34',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.34',
      prompt:
        'The reaction $\\ce{CO(g) + 3H2(g) <=> CH4(g) + H2O(g)}$ is at equilibrium at $1300\\,\\text{K}$ in a $1\\,\\text{L}$ flask. It also contains $0.30\\ \\text{mol}$ of $\\ce{CO}$, $0.10\\ \\text{mol}$ of $\\ce{H2}$ and $0.02\\ \\text{mol}$ of $\\ce{H2O}$ and an unknown amount of $\\ce{CH4}$ in the flask. Determine the concentration of $\\ce{CH4}$ in the mixture. The equilibrium constant, $K_c$, for the reaction at the given temperature is $3.90$.',
      answer: '$[\\ce{CH4}] \\approx 5.85 \\times 10^{-2}\\ \\text{mol L}^{-1}$',
      solution:
        'The flask is $1\\,\\text{L}$, so molar concentrations equal the mole numbers:\n' +
        '$$[\\ce{CO}] = 0.30,\\ [\\ce{H2}] = 0.10,\\ [\\ce{H2O}] = 0.02\\ \\text{M}$$\n\n' +
        'Equilibrium expression:\n' +
        '$$K_c = \\frac{[\\ce{CH4}][\\ce{H2O}]}{[\\ce{CO}][\\ce{H2}]^3} = 3.90$$\n\n' +
        'Solve for $[\\ce{CH4}]$:\n' +
        '$$[\\ce{CH4}] = \\frac{K_c\\,[\\ce{CO}][\\ce{H2}]^3}{[\\ce{H2O}]} = \\frac{3.90 \\times 0.30 \\times (0.10)^3}{0.02}$$\n\n' +
        '$$= \\frac{3.90 \\times 0.30 \\times 1.0 \\times 10^{-3}}{0.02} = \\frac{1.17 \\times 10^{-3}}{0.02} = 5.85 \\times 10^{-2}\\ \\text{mol L}^{-1}$$',
    },
  ],

  'sec-lechat': [
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-25',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.25',
      prompt:
        'Does the number of moles of reaction products increase, decrease or remain same when each of the following equilibria is subjected to a decrease in pressure by increasing the volume?\n\n' +
        '(a) $\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$\n\n' +
        '(b) $\\ce{CaO(s) + CO2(g) <=> CaCO3(s)}$\n\n' +
        '(c) $\\ce{3Fe(s) + 4H2O(g) <=> Fe3O4(s) + 4H2(g)}$',
      answer:
        '(a) Products **increase**. (b) Products **decrease**. (c) Number of moles of products **remains the same**.',
      solution:
        'Decreasing pressure (increasing volume) shifts equilibrium toward the side with **more moles of gas** (Le Chatelier). Count gas moles only.\n\n' +
        '**(a)** Gas moles: reactant side $= 1$ ($\\ce{PCl5}$), product side $= 2$ ($\\ce{PCl3} + \\ce{Cl2}$). More gas on the product side, so the equilibrium shifts **forward** → moles of products **increase**.\n\n' +
        '**(b)** Gas moles: reactant side $= 1$ ($\\ce{CO2}$), product side $= 0$ (only solid $\\ce{CaCO3}$). The reactant side has more gas, so the equilibrium shifts **backward** → moles of product ($\\ce{CaCO3}$) **decrease**.\n\n' +
        '**(c)** Gas moles: reactant side $= 4$ ($\\ce{H2O}$), product side $= 4$ ($\\ce{H2}$). Equal gas moles on both sides → pressure change has **no effect**; moles of products **remain the same**.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-26',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.26',
      prompt:
        'Which of the following reactions will get affected by increasing the pressure? Also, mention whether the change will cause the reaction to go into forward or backward direction.\n\n' +
        '(i) $\\ce{COCl2(g) <=> CO(g) + Cl2(g)}$\n\n' +
        '(ii) $\\ce{CH4(g) + 2S2(g) <=> CS2(g) + 2H2S(g)}$\n\n' +
        '(iii) $\\ce{CO2(g) + C(s) <=> 2CO(g)}$\n\n' +
        '(iv) $\\ce{2H2(g) + CO(g) <=> CH3OH(g)}$\n\n' +
        '(v) $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$\n\n' +
        '(vi) $\\ce{4NH3(g) + 5O2(g) <=> 4NO(g) + 6H2O(g)}$',
      answer:
        'Increasing pressure shifts toward fewer gas moles. (i) backward; (ii) no shift (3=3); (iii) backward; (iv) forward; (v) backward; (vi) backward.',
      solution:
        'Increasing pressure shifts the equilibrium toward the side with **fewer moles of gas**. Count gas moles each side ($\\Delta n_g$ = products − reactants):\n\n' +
        '**(i)** $1 \\to 2$ ($\\Delta n_g = +1$). Pressure increase shifts to fewer moles → **backward**.\n\n' +
        '**(ii)** $3 \\to 3$ ($\\Delta n_g = 0$). **No effect** — unaffected by pressure.\n\n' +
        '**(iii)** $1 \\to 2$ gas ($\\ce{C}$ is solid; $\\Delta n_g = +1$). → **backward**.\n\n' +
        '**(iv)** $3 \\to 1$ ($\\Delta n_g = -2$). Pressure increase favors fewer moles → **forward**.\n\n' +
        '**(v)** $0 \\to 1$ gas (solids ignored; $\\Delta n_g = +1$). → **backward**.\n\n' +
        '**(vi)** $9 \\to 10$ ($\\Delta n_g = +1$). → **backward**.\n\n' +
        'So reactions (i), (iii), (iv), (v) and (vi) are affected; (ii) is not.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-27',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.27',
      prompt:
        'The equilibrium constant for the following reaction is $1.6 \\times 10^{5}$ at $1024\\,\\text{K}$:\n\n' +
        '$$\\ce{H2(g) + Br2(g) <=> 2HBr(g)}$$\n\n' +
        'Find the equilibrium pressure of all gases if $10.0\\ \\text{bar}$ of $\\ce{HBr}$ is introduced into a sealed container at $1024\\,\\text{K}$.',
      answer:
        '$p_{\\ce{H2}} = p_{\\ce{Br2}} \\approx 2.49 \\times 10^{-2}\\ \\text{bar}$;   $p_{\\ce{HBr}} \\approx 9.95\\ \\text{bar}$.',
      solution:
        'Starting with only HBr, it decomposes ($\\ce{2HBr <=> H2 + Br2}$), giving $p_{\\ce{H2}} = p_{\\ce{Br2}} = p$ and $p_{\\ce{HBr}} = 10.0 - 2p$.\n\n' +
        'For the forward reaction $K_p = K_c$ (since $\\Delta n = 0$) $= 1.6 \\times 10^{5}$:\n' +
        '$$K_p = \\frac{(p_{\\ce{HBr}})^2}{p_{\\ce{H2}}\\,p_{\\ce{Br2}}} = \\frac{(10.0 - 2p)^2}{p^2} = 1.6 \\times 10^{5}$$\n\n' +
        'Take square roots:\n' +
        '$$\\frac{10.0 - 2p}{p} = \\sqrt{1.6 \\times 10^{5}} = 400$$\n\n' +
        '$$10.0 - 2p = 400p \\Rightarrow 10.0 = 402p \\Rightarrow p = 2.49 \\times 10^{-2}\\ \\text{bar}$$\n\n' +
        'Therefore:\n' +
        '$$p_{\\ce{H2}} = p_{\\ce{Br2}} \\approx 2.49 \\times 10^{-2}\\ \\text{bar}$$\n' +
        '$$p_{\\ce{HBr}} = 10.0 - 2(0.0249) \\approx 9.95\\ \\text{bar}$$',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-28',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.28',
      prompt:
        'Dihydrogen gas is obtained from natural gas by partial oxidation with steam as per the following endothermic reaction:\n\n' +
        '$$\\ce{CH4(g) + H2O(g) <=> CO(g) + 3H2(g)}$$\n\n' +
        '(a) Write an expression for $K_p$ for the above reaction.\n\n' +
        '(b) How will the values of $K_p$ and composition of equilibrium mixture be affected by (i) increasing the pressure, (ii) increasing the temperature, (iii) using a catalyst?',
      answer:
        '(a) $K_p = \\frac{p_{\\ce{CO}}\\,(p_{\\ce{H2}})^3}{p_{\\ce{CH4}}\\,p_{\\ce{H2O}}}$. (b)(i) increasing pressure shifts equilibrium **backward** (fewer gas moles), $K_p$ unchanged; (ii) increasing temperature (endothermic) shifts **forward**, $K_p$ **increases**; (iii) a catalyst changes neither $K_p$ nor the composition — only speeds attainment.',
      solution:
        '**(a)** Products over reactants in partial pressures, each to its coefficient:\n' +
        '$$K_p = \\frac{p_{\\ce{CO}}\\,(p_{\\ce{H2}})^3}{p_{\\ce{CH4}}\\,p_{\\ce{H2O}}}$$\n\n' +
        '**(b)(i) Increasing pressure:** Gas moles go from $2$ (reactants) to $4$ (products). Higher pressure favors fewer moles, so equilibrium shifts **backward** (less $\\ce{H2}$). $K_p$ depends only on temperature, so its **value is unchanged**.\n\n' +
        '**(ii) Increasing temperature:** The reaction is endothermic, so heat is a "reactant." Raising temperature shifts equilibrium **forward** (more products), and **$K_p$ increases**.\n\n' +
        '**(iii) Using a catalyst:** A catalyst speeds up forward and reverse reactions equally. It **does not change** $K_p$ or the equilibrium composition — it only lets equilibrium be reached faster.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-29',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.29',
      prompt:
        'Describe the effect of (a) addition of $\\ce{H2}$, (b) addition of $\\ce{CH3OH}$, (c) removal of $\\ce{CO}$, (d) removal of $\\ce{CH3OH}$ on the equilibrium of the reaction:\n\n' +
        '$$\\ce{2H2(g) + CO(g) <=> CH3OH(g)}$$',
      answer:
        '(a) Shifts **forward** (more $\\ce{CH3OH}$). (b) Shifts **backward**. (c) Shifts **backward**. (d) Shifts **forward** (more $\\ce{CH3OH}$).',
      solution:
        'By Le Chatelier’s principle, the system counteracts any imposed change:\n\n' +
        '**(a) Adding $\\ce{H2}$** (a reactant): equilibrium shifts to consume it → **forward**, forming more $\\ce{CH3OH}$.\n\n' +
        '**(b) Adding $\\ce{CH3OH}$** (the product): equilibrium shifts to consume it → **backward**, forming more $\\ce{H2}$ and $\\ce{CO}$.\n\n' +
        '**(c) Removing $\\ce{CO}$** (a reactant): equilibrium shifts to replace it → **backward**.\n\n' +
        '**(d) Removing $\\ce{CH3OH}$** (the product): equilibrium shifts to replace it → **forward**, forming more $\\ce{CH3OH}$.',
    },
    {
      kind: 'numerical',
      id: 'ceq-ncert-7-30',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.30',
      prompt:
        'At $473\\,\\text{K}$, equilibrium constant $K_c$ for decomposition of phosphorus pentachloride, $\\ce{PCl5}$, is $8.3 \\times 10^{-3}$. If decomposition is depicted as\n\n' +
        '$$\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}; \\quad \\Delta H^\\circ = 124.0\\ \\text{kJ mol}^{-1}$$\n\n' +
        '(a) write an expression for $K_c$ for the reaction.\n\n' +
        '(b) what is the value of $K_c$ for the reverse reaction at the same temperature?\n\n' +
        '(c) what would be the effect on $K_c$ if (i) more $\\ce{PCl5}$ is added, (ii) pressure is increased, (iii) the temperature is increased?',
      answer:
        '(a) $K_c = \\frac{[\\ce{PCl3}][\\ce{Cl2}]}{[\\ce{PCl5}]}$. (b) $K_c(\\text{reverse}) = \\frac{1}{8.3 \\times 10^{-3}} \\approx 120.5$. (c)(i) no change in $K_c$; (ii) no change in $K_c$; (iii) $K_c$ **increases** (endothermic).',
      solution:
        '**(a)** Products over reactant:\n' +
        '$$K_c = \\frac{[\\ce{PCl3}][\\ce{Cl2}]}{[\\ce{PCl5}]}$$\n\n' +
        '**(b)** The reverse reaction’s constant is the reciprocal:\n' +
        '$$K_c(\\text{reverse}) = \\frac{1}{8.3 \\times 10^{-3}} \\approx 120.5$$\n\n' +
        '**(c)** $K_c$ depends **only on temperature**, not on amounts or pressure:\n' +
        '- **(i) Adding more $\\ce{PCl5}$:** the equilibrium *position* shifts forward, but $K_c$ is **unchanged**.\n' +
        '- **(ii) Increasing pressure:** shifts the position backward (fewer gas moles), but $K_c$ is **unchanged**.\n' +
        '- **(iii) Increasing temperature:** the reaction is endothermic ($\\Delta H^\\circ > 0$), so $K_c$ **increases**.',
    },
  ],
};
